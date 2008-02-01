// requires lang
(function() {

    var M = function(Y) {
    
        var L = Y.lang, 
        A = Y.array,
        OP = Object.prototype, 
        IEF = ["toString", "valueOf"], 

        /**
         * IE will not enumerate native functions in a derived object even if the
         * function was overridden.  This is a workaround for specific functions 
         * we care about on the Object prototype. 
         * @property _iefix
         * @param {Function} r  the object to receive the augmentation
         * @param {Function} s  the object that supplies the properties to augment
         * @param w a whitelist object (the keys are the valid items to reference)
         * @static
         * @private
         */
        _iefix = (Y.ua && Y.ua.ie) ?
            function(r, s, w) {
                for (var i=0, a=IEF; i<a.length; i=i+1) {
                    var n = a[i], f = s[n];
                    if (L.isFunction(f) && f != OP[n]) {
                        if (!w || (n in w)) {
                            r[n]=f;
                        }
                    }
                }
            } : function() {};
       

        var Ext = function() { };

        Ext.prototype = {
            /**
             * Execute a superclass method or constructor
             * @method Super
             * @param m {string} method name to execute.  If falsy, the 
             * constructor is executed. 
             * @param {String*} arguments 1-n arguments to apply.
             *
             * @todo the caller args don't seem to be avail in all browsers
             * (Opera) ... find another approach or abandon that aspect of
             * the helper method.
             *
             * Super(); -- not supported
             *
             * Super(null, arg1, arg2);
             *
             * Super('methodname'); -- not supported
             *
             * Super('methodname', arg1, arg2);
             *
             */
            Super: function(m) {

                //  var args = arguments,
                //      a = (args.length > 1) ?
                //              Y.array(args, 1, true) :
                //              args.callee.caller["arguments"],
                //      s = this.constructor.superclass;

                // var args = arguments, s = this.constructor.superclass, a;
                // if (args.length > 1) {
                //     a = Y.array(args, 1, true);
                // } else {
                //     var c = args.callee.caller;
                //     a = (c && "arguments" in c) ? c.arguments : [];
                // }

                var a = Y.array(arguments, 1, true), s = this.constructor.superclass;

                if (m) {
                    if (m in s) {
                        s[m].apply(this, a);
                    } else {
                        Y.fail(m + " super method not found");
                    }
                } else {
                    s.constructor.apply(this, a);
                }
            }
        };

        /**
         * Returns a new object containing all of the properties of
         * all the supplied objects.  The properties from later objects
         * will overwrite those in earlier objects.  Passing in a
         * single object will create a shallow copy of it.  For a deep
         * copy, use clone.
         * @method merge
         * @param arguments {Object*} the objects to merge
         * @return the new merged object
         */
        Y.merge = function() {
            // var o={}, a=arguments;
            // for (var i=0, l=a.length; i<l; i=i+1) {
            var a=arguments, o=Y.object(a[0]);
            for (var i=1, l=a.length; i<l; i=i+1) {
                Y.mix(o, a[i], true);
            }
            return o;
        };
           
        /**
         * Applies the supplier's properties to the receiver.  By default
         * all prototype and static propertes on the supplier are applied
         * to the corresponding spot on the receiver.  By default all
         * properties are applied, and a property that is already on the
         * reciever will not be overwritten.  The default behavior can
         * be modified by supplying the appropriate parameters.
         * @method mix
         * @static
         * @param {Function} r  the object to receive the augmentation
         * @param {Function} s  the object that supplies the properties to augment
         * @param ov {boolean} if true, properties already on the receiver
         * will be overwritten if found on the supplier.
         * @param wl {string[]} a whitelist.  If supplied, only properties in 
         * this list will be applied to the receiver.
         * @param {int} mode what should be copies, and to where
         *        default(0): standard object mixin
         *        1: prototype to prototype (old augment)
         *        2: prototype to prototype and object props (new augment)
         *        3: prototype to object
         *        4: object to prototype
         * @return {YUI} the YUI instance
         */
        Y.mix = function(r, s, ov, wl, mode) {

            if (!s||!r) {
                return Y;
            }

            var w = (wl && wl.length) ? A.hash(wl) : null;

            var f = function(fr, fs, proto) {
                for (var i in fs) { 
                    // if (!proto || (i in fs)) {
                    if (proto || ov || Y.object.owns(fs, i)) {
                        if (ov || !fr[i]) {
                            if (!w || (i in w)) {
                                fr[i] = fs[i];
                            }
                        }
                    }
                }

                _iefix(fr, fs, w);
            };

            var rp = r.prototype, sp = s.prototype;

            switch (mode) {
                case 1: // proto to proto
                    f(rp, sp, true);
                    break;
                case 2: // object augmentation AND proto
                    f(r, s);
                    f(rp, sp, true);
                    break;
                case 3: // proto to static
                    f(r, sp, true);
                    break;
                case 4: // static to proto
                    f(rp, s);
                    break;
                default:  // standard object augment
                    f(r, s);
            }

            return Y;
        };

        /**
         * Applies prototype and object properties from the supplier to
         * the receiver.
         * @param {Function} r  the object to receive the augmentation
         * @param {Function} s  the object that supplies the properties to augment
         * @param ov {boolean} if true, properties already on the receiver
         * will be overwritten if found on the supplier.
         * @param wl {string[]} a whitelist.  If supplied, only properties in 
         * this list will be applied to the receiver.
         * @return {YUI} the YUI instance
         */
        Y.augment = function(r, s, ov, wl) {
            Y.mix(r, s, ov, wl, 1);
            return Y;
        };

        /**
         * Utility to set up the prototype, constructor and superclass properties to
         * support an inheritance strategy that can chain constructors and methods.
         * Static members will not be inherited.
         *
         * @method extend
         * @static
         * @param {Function} r   the object to modify
         * @param {Function} s the object to inherit
         * @param {Object} px prototype properties to add/override
         * @param {Object} sx static properties to add/override
         * @return {YUI} the YUI instance
         */
        Y.extend = function(r, s, px, sx) {
            if (!s||!r) {
                Y.fail("extend failed, verify dependencies");
            }

            var sp = s.prototype, rp=Y.object(sp), i;
            r.prototype=rp;

            rp.constructor=r;
            r.superclass=sp;

            // If the superclass doesn't have a standard constructor,
            // define one so that Super() works
            if (sp.constructor == OP.constructor) {
                sp.constructor=s;
            }
        
            // Add object properties too
            Y.mix(r, s);

            // Add superclass convienience functions
            Y.augment(r, Ext);

            // Add prototype overrides
            if (px) {
                Y.mix(rp, px, true);
            }

            // Add object overrides
            if (sx) {
                Y.mix(r, sx, true);
            }

            return Y;
        };

        // objects that will use the event system require a unique 
        // identifier.  An uid will be generated and applied if one
        // isn't found
        Y.stamp = function(o) {
            if (!o) {
                return o;
            }

            var uid = (L.isString(o)) ? o : o.uid;

            if (!uid) {
                uid = Y.guid();
                o.uid = uid;
            }

            return uid;
        };

        Y.each = function(o, f, c) {

            // @todo, the object implementation works for arrays,
            // but arrays can use the native implementation if
            // available.  Is the native implementaiton it worth the 
            // cost of the array test?  Does the object implementation
            // work properly for array-like collections?

            // switch (A.test(o)) {
            //     case 1:
            //         return A.each(o, f, c);
            //     case 2:
            //         return A.each(Y.array(o, 0, true), f, c);
            //     default:
            //         return Y.object.each(o, f, c);
            // }

            return Y.object.each(o, f, c);
        };

        /**
         * Deep obj/array copy. Functions are treated as objects.
         * Array-like objects are treated as arrays.
         * Other types are returned untouched.  Optionally a
         * function can be provided to handle other data types,
         * filter keys, validate values, etc.
         * @method clone
         * @param o what to clone
         * @param f function to apply to each item in a collection
         *          it will be executed prior to applying the value to
         *          the new object.  Return false to prevent the copy.
         * @param c execution context for f
         * @return {Array|Object} the cloned object
         */
        Y.clone = function(o, f, c) {

            if (!L.isObject(o)) {
                return o;
            } else if (L.isDate(o)) {
                return new Date(o);
            }
            
            //var o2 = (A.test(o)) ? [] : {};
            var o2 = Y.object(o);

            Y.each(o, function(v, k) {
                          if (!f || (f.call(c || this, v, k, this, o) !== false)) {
                              this[k] = Y.clone(v, f, c);
                          }
                      }, o2);

            return o2;
        };
        
        /**
         * Returns a function that will execute the supplied function in the
         * supplied object's context, optionally adding any additional
         * supplied parameters to the end of the arguments the function
         * is executed with.
         * @param f {Function} the function to bind
         * @param c the execution context
         * @return the wrapped function
         */
        Y.bind = function(f, c) {
            var a = Y.array(arguments, 2, true);
            return function () {
                // @todo bind args first, or function args first?
                return f.apply(c || f, a.concat(Y.array(arguments, 0, true)));
                //return f.apply(c || f, Y.array(arguments, 0, true).concat(a));
            };
        };

        Y.ready = function(f, c) {
            var a = arguments, m = (a.length > 1) ? Y.bind.apply(Y, a) : f;
            Y.on("yui:ready", m);
            return this;
        };

        Y.io = function(type, url, callback) {

            switch (type) {
                case 'script':
                    break; // get util
                case 'css': 
                    break; // get util
                default:
                    return Y.io.asyncRequest.apply(Y.io, arguments);
            }

        };

        // Overload specs: element/selector?/widget?
        Y.get = function() {
            return Y.Dom.get.apply(Y.Dom, arguments);
        };

        // DOM events and custom events
        Y.on = function(type, f, o) {

            if (type.indexOf(':') > -1) {
                var cat = type.split(':');
                switch (cat[0]) {
                    default:
                        return Y.subscribe.apply(Y, arguments);
                }
            } else {
                return Y.Event.attach.apply(Y.Event, arguments);
            }

        };

        Y.detach = function(type, f, o) {
            if (type.indexOf(':') > -1) {
                var cat = type.split(':');
                switch (cat[0]) {
                    default:
                        return Y.unsubscribe.apply(Y, arguments);
                }
            } else {
                return Y.Event.detach.apply(Y.Event, arguments);
            }
        };


        Y.before = function() {

        };

        // this may not be needed
        Y.after = function() {

        };

        // Object factory
        Y.create = function() {

        };
    };

    // Register the module with the global YUI object
    YUI.add("core", M, "3.0.0");

})();

