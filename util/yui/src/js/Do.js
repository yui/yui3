
YUI.add("aop", function(Y) {

    var BEFORE = 0,
        AFTER = 1;

    Y.Do = {

        objs: {},

        // if 'c' context is supplied, apply remaining args to callback
        before: function(fn, obj, sFn, c) {
            var f = fn;
            if (c) {
                var a = [fn, c].concat(Y.array(arguments, 4, true));
                f = Y.bind.apply(Y, a);
            }
            this._inject(BEFORE, f, obj, sFn, c);
        },

        // if 'c' context is supplied, apply remaining args to callback
        after: function(fn, obj, sFn, c) {
            var f = fn;
            if (c) {
                var a = [fn, c].concat(Y.array(arguments, 4, true));
                f = Y.bind.apply(Y, a);
            }
            this._inject(AFTER, f, obj, sFn, c);
        },

        _inject: function(when, fn, obj, sFn) {
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

            // register the callback
            o[sFn].register(id, fn, when);

            return id;

        },

        detach: function(id) {
            if (id in this.before) {
                delete this.before[id];
            }
            if (id in this.after) {
                delete this.after[id];
            }
        },

        _unload: function(e, me) {

        }
    };

    //////////////////////////////////////////////////////////////////////////

    Y.Do.Method = function(obj, sFn) {
        this.obj = obj;
        this.methodName = sFn;
        this.method = obj[sFn];
        // this.before = [];
        // this.after = [];
        this.before = {};
        this.after = {};
    };

    Y.Do.Method.prototype.register = function (id, fn, when) {
        if (when) {
            // this.after.push(fn);
            this.after[id] = fn;
        } else {
            // this.before.push(fn);
            this.before[id] = fn;
        }
    };

    Y.Do.Method.prototype.exec = function () {

        var args = Y.array(arguments, 0, true), i, ret, newRet;

        // for (i=0; i<this.before.length; ++i) {
        for (i in this.before) {
            ret = this.before[i].apply(this.obj, args);

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

        // execute method
        ret = this.method.apply(this.obj, args);

        // execute after methods.
        // for (i=0; i<this.after.length; ++i) {
        for (i in this.after) {
            newRet = this.after[i].apply(this.obj, args);
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

        return ret;
    };

    //////////////////////////////////////////////////////////////////////////

    /**
     * Return an Error object when you want to terminate the execution
     * of all subsequent method calls
     */
    Y.Do.Error = function(msg, retVal) {
        this.msg = msg;
        this.retVal = retVal;
    };

    /**
     * Return an AlterArgs object when you want to change the arguments that
     * were passed into the function.  An example would be a service that scrubs
     * out illegal characters prior to executing the core business logic.
     */
    Y.Do.AlterArgs = function(msg, newArgs) {
        this.msg = msg;
        this.newArgs = newArgs;
    };

    /**
     * Return an AlterReturn object when you want to change the result returned
     * from the core method to the caller
     */
    Y.Do.AlterReturn = function(msg, newRetVal) {
        this.msg = msg;
        this.newRetVal = newRetVal;
    };

    //////////////////////////////////////////////////////////////////////////

// Y["Event"] && Y.Event.addListener(window, "unload", Y.Do._unload, Y.Do);

}, "3.0.0");
