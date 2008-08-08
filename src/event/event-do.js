/*
 * Method displacement
 * @submodule event-aop
 * @module event
 */
YUI.add("aop", function(Y) {

    var BEFORE = 0,
        AFTER = 1;

    /**
     * Allows for the insertion of methods that are executed before or after
     * a specified method
     * @class Do
     * @static
     */
    Y.Do = {

        /**
         * Cache of objects touched by the utility
         * @property objs
         * @static
         */
        objs: {},

        /**
         * Execute the supplied method before the specified function
         * @method before
         * @param fn {Function} the function to execute
         * @param obj the object hosting the method to displace
         * @param sFn {string} the name of the method to displace
         * @param c The execution context for fn
         * @return {string} handle for the subscription
         * @static
         */
        before: function(fn, obj, sFn, c) {
            // Y.log('Do before: ' + sFn, 'info', 'event');
            var f = fn;
            if (c) {
                var a = [fn, c].concat(Y.Array(arguments, 4, true));
                f = Y.bind.apply(Y, a);
            }

            return this._inject(BEFORE, f, obj, sFn);
        },

        /**
         * Execute the supplied method after the specified function
         * @method after
         * @param fn {Function} the function to execute
         * @param obj the object hosting the method to displace
         * @param sFn {string} the name of the method to displace
         * @param c The execution context for fn
         * @return {string} handle for the subscription
         * @static
         */
        after: function(fn, obj, sFn, c) {
            var f = fn;
            if (c) {
                var a = [fn, c].concat(Y.Array(arguments, 4, true));
                f = Y.bind.apply(Y, a);
            }

            return this._inject(AFTER, f, obj, sFn);
        },

        /**
         * Execute the supplied method after the specified function
         * @method _inject
         * @param when {string} before or after
         * @param fn {Function} the function to execute
         * @param obj the object hosting the method to displace
         * @param sFn {string} the name of the method to displace
         * @param c The execution context for fn
         * @return {string} handle for the subscription
         * @private
         * @static
         */
        _inject: function(when, fn, obj, sFn) {

            // object id
            var id = Y.stamp(obj);

            if (! this.objs[id]) {
                // create a map entry for the obj if it doesn't exist
                this.objs[id] = {};
            }
            var o = this.objs[id];

            if (! o[sFn]) {
                // create a map entry for the method if it doesn't exist
                o[sFn] = new Y.Do.Method(obj, sFn);

                // re-route the method to our wrapper
                obj[sFn] = 
                    function() {
                        return o[sFn].exec.apply(o[sFn], arguments);
                    };
            }

            // subscriber id
            var sid = id + Y.stamp(fn) + sFn;

            // register the callback
            o[sFn].register(sid, fn, when);

            return sid;

        },

        /**
         * Detach a before or after subscription
         * @method detach
         * @param sid {string} the subscription handle
         */
        detach: function(sid) {
            delete this.before[sid];
            delete this.after[sid];
        },

        _unload: function(e, me) {

        }
    };

    //////////////////////////////////////////////////////////////////////////

    /**
     * Wrapper for a displaced method with aop enabled
     * @class Do.Method
     * @constructor
     * @param obj The object to operate on
     * @param sFn The name of the method to displace
     */
    Y.Do.Method = function(obj, sFn) {
        this.obj = obj;
        this.methodName = sFn;
        this.method = obj[sFn];
        // this.before = [];
        // this.after = [];
        this.before = {};
        this.after = {};
    };

    /**
     * Register a aop subscriber
     * @method register
     * @param sid {string} the subscriber id
     * @param fn {Function} the function to execute
     * @param when {string} when to execute the function
     */
    Y.Do.Method.prototype.register = function (sid, fn, when) {
        if (when) {
            // this.after.push(fn);
            this.after[sid] = fn;
        } else {
            // this.before.push(fn);
            this.before[sid] = fn;
        }
    };

    /**
     * Execute the wrapped method
     * @method exec
     */
    Y.Do.Method.prototype.exec = function () {

        var args = Y.Array(arguments, 0, true), 
            i, ret, newRet, 
            bf = this.before,
            af = this.after;

        // for (i=0; i<this.before.length; ++i) {
        for (i in bf) {
            if (bf.hasOwnProperty(i)) {
                ret = bf[i].apply(this.obj, args);

                // Stop processing if an Error is returned
                if (ret && ret.constructor == Y.Do.Error) {
                    // this.logger.debug("Error before " + this.methodName + 
                    //      ": " ret.msg);
                    return ret.retVal;
                // Check for altered arguments
                } else if (ret && ret.constructor == Y.Do.AlterArgs) {
                    // this.logger.debug("Params altered before " + 
                    //      this.methodName + ": " ret.msg);
                    args = ret.newArgs;
                }
            }
        }

        // execute method
        ret = this.method.apply(this.obj, args);

        // execute after methods.
        // for (i=0; i<this.after.length; ++i) {
        for (i in af) {
            if (af.hasOwnProperty(i)) {
                newRet = af[i].apply(this.obj, args);
                // Stop processing if an Error is returned
                if (newRet && newRet.constructor == Y.Do.Error) {
                    // this.logger.debug("Error after " + this.methodName + 
                    //      ": " ret.msg);
                    return newRet.retVal;
                // Check for a new return value
                } else if (newRet && newRet.constructor == Y.Do.AlterReturn) {
                    // this.logger.debug("Return altered after " + 
                    //      this.methodName + ": " newRet.msg);
                    ret = newRet.newRetVal;
                }
            }
        }

        return ret;
    };

    //////////////////////////////////////////////////////////////////////////

    /**
     * Return an Error object when you want to terminate the execution
     * of all subsequent method calls
     * @class Do.Error
     */
    Y.Do.Error = function(msg, retVal) {
        this.msg = msg;
        this.retVal = retVal;
    };

    /**
     * Return an AlterArgs object when you want to change the arguments that
     * were passed into the function.  An example would be a service that scrubs
     * out illegal characters prior to executing the core business logic.
     * @class Do.AlterArgs
     */
    Y.Do.AlterArgs = function(msg, newArgs) {
        this.msg = msg;
        this.newArgs = newArgs;
    };

    /**
     * Return an AlterReturn object when you want to change the result returned
     * from the core method to the caller
     * @class Do.AlterReturn
     */
    Y.Do.AlterReturn = function(msg, newRetVal) {
        this.msg = msg;
        this.newRetVal = newRetVal;
    };

    //////////////////////////////////////////////////////////////////////////

// Y["Event"] && Y.Event.addListener(window, "unload", Y.Do._unload, Y.Do);

}, "3.0.0");
