/**
 * YUI core
 * @module yui
 */

if (typeof YUI === 'undefined' || !YUI) {
    /**
     * The YUI global namespace object.  If YUI is already defined, the
     * existing YUI object will not be overwritten so that defined
     * namespaces are preserved.  
     * @class YUI
     * @static
     */
    var YUI = function(o) {
        var Y = this;
        // Allow var yui = YUI() instead of var yui = new YUI()
        if (window === Y) {
            return new YUI(o).log('creating new instance');
        } else {
            // set up the core environment
            Y._init(o);

            // bind the specified additional modules for this instance
            Y._setup();
        }
    };
}

// The prototype contains the functions that are required to allow the external
// modules to be registered and for the instance to be initialized.
YUI.prototype = {

    /**
     * Initialize this YUI instance
     * @param o config options
     * @private
     */
    _init: function(o) {
        
    // @todo
    // loadcfg {
    //    base
    //    securebase
    //    filter
    //    win
    //    doc
    //    exception/log notification
    // }

        this.env = {
            // @todo expand the new module metadata
            mods: {},
            _idx: 0,
            _pre: 'yui-uid'
        };

        var i = YUI.env._idx++;

        this.env._yidx = i;
        this.env._uidx = 0;

        this.id = this.guid('YUI');

        this.log(i + ') init ');
    },
    
    /**
     * Finishes the instance setup. Attaches whatever modules were defined
     * when the yui modules was registered.
     * @method _setup
     * @private
     */
    _setup: function(o) {
        this.use("yui");
    },

    /**
     * Register a module
     * @method add
     * @param name {string} module name
     * @param namespace {string} name space for the module
     * @param fn {Function} entry point into the module that
     * is used to bind module to the YUI instance
     * @param version {string} version string
     * @return {YUI} the YUI instance
     *
     * requires   - features that should be present before loading
     * optional   - optional features that should be present if load optional defined
     * use  - features that should be attached automatically
     * skinnable  -
     * rollup
     * omit - features that should not be loaded if this module is present
     */
    add: function(name, fn, version, details) {

        this.log('Adding a new component' + name);

        // @todo expand this to include version mapping
        
        // @todo allow requires/supersedes

        // @todo may want to restore the build property
        
        // @todo fire moduleAvailable event
        
        var m = {
            name: name, 
            fn: fn,
            version: version,
            details: details || {}
        };

        YUI.env.mods[name] = m;

        return this; // chain support
    },

    /**
     * Bind a module to a YUI instance
     * @param {string} 1-n modules to bind (uses arguments array)
     * @return {YUI} the YUI instance
     */
    use: function() {
        var a=arguments, mods=YUI.env.mods;


        // YUI().use('*');
        // shortcut should use the loader to assure proper order?
        if (a[0] === "*") {
            return this.use.apply(this, mods);
        }

        for (var i=0; i<a.length; i=i+1) {

            // @todo 
            // Implement versioning?  loader can load different versions?
            // Should sub-modules/plugins be normal modules, or do
            // we add syntax for specifying these?
            //
            // YUI().use('dragdrop')
            // YUI().use('dragdrop:2.4.0'); // specific version
            // YUI().use('dragdrop:2.4.0-'); // at least this version
            // YUI().use('dragdrop:2.4.0-2.9999.9999'); // version range
            // YUI().use('*'); // use all available modules
            // YUI().use('lang+dump+substitute'); // use lang and some plugins
            // YUI().use('lang+*'); // use lang and all known plugins

            var m = mods[a[i]];

            this.log('using ' + a[i]);

            if (m) {

                // if (m.namespace) {
                    // this.namespace(m.namespace);
                // }

                m.fn(this);

                var p = m.details.use;
                if (p) {
                    for (i = 0; i < p.length; i = i + 1) {
                        this.use(p[i]);
                    }
                }

            } else {
                this.log('module not found: ' + a[i]);
            }
        }

        return this; // chain support var yui = YUI().use('dragdrop');
    },

    /**
     * Returns the namespace specified and creates it if it doesn't exist
     * <pre>
     * YUI.namespace("property.package");
     * YUI.namespace("YUI.property.package");
     * </pre>
     * Either of the above would create YUI.property, then
     * YUI.property.package
     *
     * Be careful when naming packages. Reserved words may work in some browsers
     * and not others. For instance, the following will fail in Safari:
     * <pre>
     * YUI.namespace("really.long.nested.namespace");
     * </pre>
     * This fails because "long" is a future reserved word in ECMAScript
     *
     * @method namespace
     * @static
     * @param  {String*} arguments 1-n namespaces to create 
     * @return {Object}  A reference to the last namespace object created
     */
    namespace: function() {
        var a=arguments, o=null, i, j, d;
        for (i=0; i<a.length; i=i+1) {
            d = a[i].split(".");
            o = this;
            for (j=(d[0] == "YUI") ? 1 : 0; j<d.length; j=j+1) {
                o[d[j]] = o[d[j]] || {};
                o = o[d[j]];
            }
        }
        return o;
    },

    /**
     * Uses YUI.widget.Logger to output a log message, if the widget is
     * available.
     *
     * @method log
     * @static
     * @param  {String}  msg  The message to log.
     * @param  {String}  cat  The log category for the message.  Default
     *                        categories are "info", "warn", "error", time".
     *                        Custom categories can be used as well. (opt)
     * @param  {String}  src  The source of the the message (opt)
     * @return {YUI}      YUI instance
     */
    log: function(msg, cat, src) {

        // @todo take out automatic console logging, but provide
        // a way to enable console logging without the logger
        // component.
        var l = (this.Logger) || ("console" in window) ? console : function(){};
        if(l && l.log) {
            l.log(msg, cat || "", src || "");
        } 

        return this;
    },

    // Centralizing error messaging means we can configure how
    // they are communicated.
    //
    // @todo msg can take a constant key or type can be a constant.
    fail: function(msg, e, eType) {
        this.log(msg, "error");

        // @todo provide a configuration option that determines if YUI 
        // generated errors throws a javascript error.  Some errors
        // should always generate a js error.  If an error type
        // is provided, that error is thrown regardless of the 
        // configuration.
        if (true) {
            e = e || new Error(msg);
        }

        return this;
    },

    // generate an id that is unique among all YUI instances
    guid: function(pre) {
        var e = this.env, p = (pre) || e._pre;
        return p +'-' + e._yidx + '-' + e._uidx++;
    }
};

// Give the YUI global the same properties as an instance.
// This makes it so that the YUI global can be used like the YAHOO
// global was used prior to 3.x.  More importantly, the YUI global
// provides global metadata, so env needs to be configured.
(function() {
    var Y = YUI, p = Y.prototype, i;

    for (i in p) {
        if (true) { // hasOwnProperty check not needed
            Y[i] = p[i];
        }
    }

    // set up the environment
    Y._init();

})();

(function() {

    var M = function(Y) {
        /**
         * Provides the language utilites and extensions used by the library
         * @class YAHOO.lang
         */

        Y.lang = Y.lang || {};

        var L = Y.lang, SPLICE="splice", LENGTH="length";

            /**
             * Determines whether or not the provided object is an array.
             * Testing typeof/instanceof/constructor of arrays across frame 
             * boundaries isn't possible in Safari unless you have a reference
             * to the other frame to test against its Array prototype.  To
             * handle this case, we test well-known array properties instead.
             * properties.
             * @method isArray
             * @param {any} o The object being testing
             * @return Boolean
             */
         L.isArray = function(o) { 
            if (o) {
               //return L.isNumber(o.length) && L.isFunction(o.splice);
               return (o[SPLICE] && L.isNumber(o[LENGTH]));
            }
            return false;
        };

        /**
         * Determines whether or not the provided object is a boolean
         * @method isBoolean
         * @param {any} o The object being testing
         * @return Boolean
         */
        L.isBoolean = function(o) {
            return typeof o === 'boolean';
        };
        
        /**
         * Determines whether or not the provided object is a function
         * @method isFunction
         * @param {any} o The object being testing
         * @return Boolean
         */
        L.isFunction = function(o) {
            return typeof o === 'function';
        };
            
        L.isDate = function(o) {
            return o instanceof Date;
        };

        /**
         * Determines whether or not the provided object is null
         * @method isNull
         * @param {any} o The object being testing
         * @return Boolean
         */
        L.isNull = function(o) {
            return o === null;
        };
            
        /**
         * Determines whether or not the provided object is a legal number
         * @method isNumber
         * @param {any} o The object being testing
         * @return Boolean
         */
        L.isNumber = function(o) {
            return typeof o === 'number' && isFinite(o);
        };
          
        /**
         * Determines whether or not the provided object is of type object
         * or function
         * @method isObject
         * @param {any} o The object being testing
         * @param failfn {boolean} fail if the input is a function
         * @return Boolean
         */  
        L.isObject = function(o, failfn) {
    return (o && (typeof o === 'object' || (!failfn && L.isFunction(o)))) || false;
        };
            
        /**
         * Determines whether or not the provided object is a string
         * @method isString
         * @param {any} o The object being testing
         * @return Boolean
         */
        L.isString = function(o) {
            return typeof o === 'string';
        };
            
        /**
         * Determines whether or not the provided object is undefined
         * @method isUndefined
         * @param {any} o The object being testing
         * @return Boolean
         */
        L.isUndefined = function(o) {
            return typeof o === 'undefined';
        };
        

        /**
         * Returns a string without any leading or trailing whitespace.  If 
         * the input is not a string, the input will be returned untouched.
         * @method trim
         * @param s {string} the string to trim
         * @return {string} the trimmed string
         */
        L.trim = function(s){
            try {
                return s.replace(/^\s+|\s+$/g, "");
            } catch(e) {
                return s;
            }
        };

        /**
         * A convenience method for detecting a legitimate non-null value.
         * Returns false for null/undefined/NaN, true for other values, 
         * including 0/false/''
         * @method isValue
         * @param o {any} the item to test
         * @return {boolean} true if it is not null/undefined/NaN || false
         */
        L.isValue = function(o) {
            // return (o || o === false || o === 0 || o === ''); // Infinity fails
    return (L.isObject(o) || L.isString(o) || L.isNumber(o) || L.isBoolean(o));
        };

    };

    // Register the module with the global YUI object
    YUI.add("lang", M, "3.0.0");

})();

(function() {

    var M = function(Y) {

        var L = Y.lang, Native = Array.prototype;

        /** 
         * Returns an array:
         * - Arrays are return unmodified unless the start position is specified.
         * - "Array-like" collections (@see Array.test) are converted to arrays
         * - For everything else, a new array is created with the input as the sole item
         * - The start position is used if the input is or is like an array to return
         *   a subset of the collection.
         *
         *   @todo this will not automatically convert elements that are also collections
         *   such as forms and selects.  Passing true as the third param will
         *   force a conversion.
         *
         *   @param o the item to arrayify
         *   @param i {int} if an array or array-like, this is the start index
         *   @param al {boolean} if true, it forces the array-like fork.  This
         *   can be used to avoid multiple array.test calls.
         */
        Y.array = function(o, i, al) {
            var t = (al) ? 2 : Y.array.test(o);
            switch (t) {
                case 1:
                    return (i) ? o.slice(o, i) : o;
                case 2:
                    return Native.slice.call(o, i || 0);
                default:
                    return [o];
            }
        };

        var A = Y.array;
        
        // YUI array utilities.  The current plan is to make a few useful
        // ones 'core', and to have the rest of the array extras an optional
        // module

        /** 
         * Evaluates the input to determine if it is an array, array-like, or 
         * something else.  This is used to handle the arguments collection 
         * available within functions, and HTMLElement collections
         *
         * @todo current implementation (intenionally) will not implicitly 
         * handle html elements that are array-like (forms, selects, etc).  
         *
         * @return {int} a number indicating the results:
         * 0: Not an array or an array-like collection
         * 1: A real array. 
         * 2: array-like collection.
         */
        A.test = function(o) {
            var r = 0;
            if (L.isObject(o, true)) {
                if (L.isArray(o)) {
                    r = 1; 
                } else {
                    try {
                        // indexed, but no tagName (element) or alert (window)
                        if ("length" in o && !("tagName" in o)  && !("alert" in o)) {
                            r = 2;
                        }
                            
                    } catch(ex) {}
                }
            }
            return r;
        };

        /**
         * Executes the supplied function on each item in the array.
         * @method each
         */
        A.each = (Native.forEach) ?
            function (a, f, o) { 
                Native.forEach.call(a, f, o);
                return Y;
            } :
            function (a, f, o) { 
                var l = a.length, i;
                for (i = 0; i < l; i=i+1) {
                    f.call(o, a[i], i, a);
                }
                return Y;
            };

        /**
         * Returns an object using the first array as keys, and
         * the second as values.  If the second array is not
         * provided the value is set to true for each.
         * @method hash
         * @param k {Array} keyset
         * @param v {Array} optional valueset
         * @return the hash
         */
        A.hash = function(k, v) {
            var o = {}, l = k.length, vl = v && v.length, i;
            for (i=0; i<l; i=i+1) {
                o[k[i]] = (vl && vl > i) ? v[i] : true;
            }

            return o;
        };
    };

    YUI.add("array", M, "3.0.0");

})();

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
                    if (!proto || (i in fs)) {
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
                return f.apply(c || f, a.concat(Y.array(arguments, 0, true)));
            };
        };

        Y.ready = function(f, c) {
            var a = arguments, m = (a.length > 1) ? Y.bind.apply(Y, a) : f;
            Y.on("yui:ready", m);
            return this;
        };

        // Overload specs: element/selector?/widget?
        Y.get = function() {

        };

        // DOM events and custom events
        Y.on = function() {

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

(function() {

    // object utils
    var M = function(Y) {

        // Returns a new object based upon the supplied object
        Y.object = function(o) {
            var F = function() {};
            F.prototype = o;
            return new F();
        }; 

        var O = Y.object, L = Y.lang;

        /**
         * Determines whether or not the property was added
         * to the object instance.  Returns false if the property is not present
         * in the object, or was inherited from the prototype.
         * This abstraction is provided to basic hasOwnProperty for Safari 1.3.x.
         * This 
         * There is a discrepancy between YAHOO.lang.hasOwnProperty and
         * Object.prototype.hasOwnProperty when the property is a primitive added to
         * both the instance AND prototype with the same value:
         * <pre>
         * var A = function() {};
         * A.prototype.foo = 'foo';
         * var a = new A();
         * a.foo = 'foo';
         * alert(a.hasOwnProperty('foo')); // true
         * alert(YAHOO.lang.hasOwnProperty(a, 'foo')); // false when using fallback
         * </pre>
         * @method owns
         * @param o {any} The object being testing
         * @parma p {string} the property to look for
         * @return Boolean
         */
        O.owns = (Object.prototype.hasOwnProperty) ? 
            function(o, p) {
                return (o.hasOwnProperty) ? o.hasOwnProperty(p) : true;
            } : 
            function(o, p) {
                return !L.isUndefined(o[p]) && 
                        o.constructor.prototype[p] !== o[p];
            };

        // @todo remove --- 
        // L.hasOwnProperty = function(o, p) {
            // Y.log("Y.lang.hasOwnProperty will not be in 3.0.  Use Y.object.owns instead. "  +
            // "This warning is here because omitting this function will cause silent failure " +
            // "in browsers the have a hasOwnProperty implementation.");
            // return O.owns(o, p);
        // };

        /**
         * Returns an array containing the object's keys
         * @method keys
         * @param o an object
         * @return {string[]} the keys
         */
        O.keys = function(o) {
            var a=[], i;
            for (i in o) {
                if (O.owns(o, i)) {
                    a.push(i);
                }
            }

            return a;
        };

        /**
         * Executes a function on each item. The function
         * receives the value, the key, and the object
         * as paramters (in that order).
         * @param o the object to iterate
         * @param f {function} the function to execute
         * @param c the execution context
         * @return {YUI} the YUI instance
         */
        O.each = function (o, f, c) {
            var s = c;
            for (var i in o) {
                if (O.owns(o, i)) {
                    f.call(s, o[i], i, o);
                }
            }

            return Y;
        };
    };

    YUI.add("object", M, "3.0.0");

})();

(function() {

    var M = function(Y) {

        /**
         * Browser/platform detection
         * @method ua
         */
        Y.ua = function() {

            var o={

                /**
                 * Internet Explorer version number or 0.  Example: 6
                 * @property ie
                 * @type float
                 */
                ie:0,

                /**
                 * Opera version number or 0.  Example: 9.2
                 * @property opera
                 * @type float
                 */
                opera:0,

                /**
                 * Gecko engine revision number.  Will evaluate to 1 if Gecko 
                 * is detected but the revision could not be found. Other browsers
                 * will be 0.  Example: 1.8
                 * <pre>
                 * Firefox 1.0.0.4: 1.7.8   <-- Reports 1.7
                 * Firefox 1.5.0.9: 1.8.0.9 <-- Reports 1.8
                 * Firefox 2.0.0.3: 1.8.1.3 <-- Reports 1.8
                 * Firefox 3 alpha: 1.9a4   <-- Reports 1.9
                 * </pre>
                 * @property gecko
                 * @type float
                 */
                gecko:0,

                /**
                 * AppleWebKit version.  KHTML browsers that are not WebKit browsers 
                 * will evaluate to 1, other browsers 0.  Example: 418.9.1
                 * <pre>
                 * Safari 1.3.2 (312.6): 312.8.1 <-- Reports 312.8 -- currently the 
                 *                                   latest available for Mac OSX 10.3.
                 * Safari 2.0.2:         416     <-- hasOwnProperty introduced
                 * Safari 2.0.4:         418     <-- preventDefault fixed
                 * Safari 2.0.4 (419.3): 418.9.1 <-- One version of Safari may run
                 *                                   different versions of webkit
                 * Safari 2.0.4 (419.3): 419     <-- Tiger installations that have been
                 *                                   updated, but not updated
                 *                                   to the latest patch.
                 * Webkit 212 nightly:   522+    <-- Safari 3.0 precursor (with native SVG
                 *                                   and many major issues fixed).
                 * Safari 3.0.4 (523.12) 523.12  <-- First Tiger release - automatic update
                 *                                   from 2.x via the 10.4.11 OS patch
                 *                                   
                 * </pre>
                 * http://developer.apple.com/internet/safari/uamatrix.html
                 * @property webkit
                 * @type float
                 */
                webkit:0,

                /**
                 * The mobile property will be set to a string containing any relevant
                 * user agent information when a modern mobile browser is detected.
                 * Currently limited to Safari on the iPhone/iPod Touch, Nokia N-series
                 * devices with the WebKit-based browser, and Opera Mini.  
                 * @property mobile 
                 * @type string
                 */
                mobile: null 
            };

            var ua=navigator.userAgent, m;

            // Modern KHTML browsers should qualify as Safari X-Grade
            if ((/KHTML/).test(ua)) {
                o.webkit=1;
            }
            // Modern WebKit browsers are at least X-Grade
            m=ua.match(/AppleWebKit\/([^\s]*)/);
            if (m&&m[1]) {
                o.webkit=parseFloat(m[1]);

                // Mobile browser check
                if (/ Mobile\//.test(ua)) {
                    o.mobile = "Apple"; // iPhone or iPod Touch
                } else {
                    m=ua.match(/NokiaN[^\/]*/);
                    if (m) {
                        o.mobile = m[0]; // Nokia N-series, ex: NokiaN95
                    }
                }

            }

            if (!o.webkit) { // not webkit
                // @todo check Opera/8.01 (J2ME/MIDP; Opera Mini/2.0.4509/1316; fi; U; ssr)
                m=ua.match(/Opera[\s\/]([^\s]*)/);
                if (m&&m[1]) {
                    o.opera=parseFloat(m[1]);
                    m=ua.match(/Opera Mini[^;]*/);
                    if (m) {
                        o.mobile = m[0]; // ex: Opera Mini/2.0.4509/1316
                    }
                } else { // not opera or webkit
                    m=ua.match(/MSIE\s([^;]*)/);
                    if (m&&m[1]) {
                        o.ie=parseFloat(m[1]);
                    } else { // not opera, webkit, or ie
                        m=ua.match(/Gecko\/([^\s]*)/);
                        if (m) {
                            o.gecko=1; // Gecko detected, look for revision
                            m=ua.match(/rv:([^\s\)]*)/);
                            if (m&&m[1]) {
                                o.gecko=parseFloat(m[1]);
                            }
                        }
                    }
                }
            }
            
            return o;
        }();
    };

    YUI.add("ua", M, "3.0.0");

})();
// requires lang
(function() {

    var M = function(Y) {

        var L=Y.lang, OBJ="{...}", FUN="f(){...}", COMMA=', ', ARROW=' => ';

        /**
         * Returns a simple string representation of the object or array.
         * Other types of objects will be returned unprocessed.  Arrays
         * are expected to be indexed.  Use object notation for
         * associative arrays.
         *
         * @todo dumping a window is causing an unhandled exception in
         * FireFox.  Trying to account for it is hanging FireFox.
         * Could be a FireBug interaction.
         *
         * @method dump
         * @param o {Object} The object to dump
         * @param d {int} How deep to recurse child objects, default 3
         * @return {String} the dump result
         */
        Y.lang.dump = function(o, d) {
            var i, len, s = [];


            // Cast non-objects to string
            // Skip dates because the std toString is what we want
            // Skip HTMLElement-like objects because trying to dump 
            // an element will cause an unhandled exception in FF 2.x
            if (!L.isObject(o)) {
                return o + "";
            } else if (o instanceof Date || ("nodeType" in o && "tagName" in o)) {
                return o;
            } else if  (L.isFunction(o)) {
                return FUN;
            }

            // dig into child objects the depth specifed. Default 3
            d = (L.isNumber(d)) ? d : 3;

            // arrays [1, 2, 3]
            if (L.isArray(o)) {
                s.push("[");
                for (i=0,len=o.length;i<len;i=i+1) {
                    if (L.isObject(o[i])) {
                        s.push((d > 0) ? L.dump(o[i], d-1) : OBJ);
                    } else {
                        s.push(o[i]);
                    }
                    s.push(COMMA);
                }
                if (s.length > 1) {
                    s.pop();
                }
                s.push("]");
            // objects {k1 => v1, k2 => v2}
            } else {
                s.push("{");
                for (i in o) {
                    if (Y.object.owns(o, i)) {
                        s.push(i + ARROW);
                        if (L.isObject(o[i])) {
                            s.push((d > 0) ? L.dump(o[i], d-1) : OBJ);
                        } else {
                            s.push(o[i]);
                        }
                        s.push(COMMA);
                    }
                }
                if (s.length > 1) {
                    s.pop();
                }
                s.push("}");
            }

            return s.join("");
        };
    };

    // Register the module with the global YUI object
    YUI.add("dump", M, "3.0.0");

})();

// requires lang, dump
(function() {

    var M = function(Y) {

        var L = Y.lang, DUMP='dump', SPACE=' ', LBRACE='{', RBRACE='}';

        /**
         * Does variable substitution on a string. It scans through the string 
         * looking for expressions enclosed in { } braces. If an expression 
         * is found, it is used a key on the object.  If there is a space in
         * the key, the first word is used for the key and the rest is provided
         * to an optional function to be used to programatically determine the
         * value (the extra information might be used for this decision). If 
         * the value for the key in the object, or what is returned from the
         * function has a string value, number value, or object value, it is 
         * substituted for the bracket expression and it repeats.  If this
         * value is an object, it uses the Object's toString() if this has
         * been overridden, otherwise it does a shallow dump of the key/value
         * pairs.
         * @method substitute
         * @param s {String} The string that will be modified.
         * @param o {Object} An object containing the replacement values
         * @param f {Function} An optional function that can be used to
         *                     process each match.  It receives the key,
         *                     value, and any extra metadata included with
         *                     the key inside of the braces.
         * @return {String} the substituted string
         */
        L.substitute = function (s, o, f) {
            var i, j, k, key, v, meta, saved=[], token;

            for (;;) {
                i = s.lastIndexOf(LBRACE);
                if (i < 0) {
                    break;
                }
                j = s.indexOf(RBRACE, i);
                if (i + 1 >= j) {
                    break;
                }

                //Extract key and meta info 
                token = s.substring(i + 1, j);
                key = token;
                meta = null;
                k = key.indexOf(SPACE);
                if (k > -1) {
                    meta = key.substring(k + 1);
                    key = key.substring(0, k);
                }

                // lookup the value
                v = o[key];

                // if a substitution function was provided, execute it
                if (f) {
                    v = f(key, v, meta);
                }

                if (L.isObject(v)) {
                    if (L.isArray(v)) {
                        v = L.dump(v, parseInt(meta, 10));
                    } else {
                        meta = meta || "";

                        // look for the keyword 'dump', if found force obj dump
                        var dump = meta.indexOf(DUMP);
                        if (dump > -1) {
                            meta = meta.substring(4);
                        }

                        // use the toString if it is not the Object toString 
                        // and the 'dump' meta info was not found
                        if (v.toString===Object.prototype.toString||dump>-1) {
                            v = L.dump(v, parseInt(meta, 10));
                        } else {
                            v = v.toString();
                        }
                    }
                } else if (!L.isString(v) && !L.isNumber(v)) {
                    // This {block} has no replace string. Save it for later.
                    v = "~-" + saved.length + "-~";
                    saved[saved.length] = token;

                    // break;
                }

                s = s.substring(0, i) + v + s.substring(j + 1);


            }

            // restore saved {block}s
            for (i=saved.length-1; i>=0; i=i-1) {
                s = s.replace(new RegExp("~-" + i + "-~"), "{"  + saved[i] + "}", "g");
            }

            return s;

        };
    };

    // Register the module with the global YUI object
    YUI.add("substitute", M, "3.0.0");

})();

// requires lang
(function() {

    var M = function(Y) {

        var L = Y.lang;

        /**
         * Executes the supplied function in the context of the supplied 
         * object 'when' milliseconds later.  Executes the function a 
         * single time unless periodic is set to true.
         * @method later
         * @param when {int} the number of milliseconds to wait until the fn 
         * is executed
         * @param o the context object
         * @param fn {Function|String} the function to execute or the name of 
         * the method in the 'o' object to execute
         * @param data [Array] data that is provided to the function.  This accepts
         * either a single item or an array.  If an array is provided, the
         * function is executed with one parameter for each array item.  If
         * you need to pass a single array parameter, it needs to be wrapped in
         * an array [myarray]
         * @param periodic {boolean} if true, executes continuously at supplied 
         * interval until canceled
         * @return a timer object. Call the cancel() method on this object to 
         * stop the timer.
         */
        L.later = function(when, o, fn, data, periodic) {
            when = when || 0; 
            o = o || {};
            var m=fn, d=data, f, r;

            if (L.isString(fn)) {
                m = o[fn];
            }

            if (!m) {
                Y.fail("method undefined");
            }

            if (!L.isArray(d)) {
                d = [data];
            }

            f = function() {
                m.apply(o, d);
            };

            r = (periodic) ? setInterval(f, when) : setTimeout(f, when);

            return {
                interval: periodic,
                cancel: function() {
                    if (this.interval) {
                        clearInterval(r);
                    } else {
                        clearTimeout(r);
                    }
                }
            };
        };
    };

    // Register the module with the global YUI object
    YUI.add("later", M, "3.0.0");

})();

// Compatibility layer for 2.x
(function() {

    var M = function(Y) {

        if (Y === YUI) {
            
            // get any existing YAHOO obj props
            var o = (window.YAHOO) ? YUI.merge(window.YAHOO) : null;

            // Make the YUI global the YAHOO global
            window.YAHOO = YUI;

            // augment old YAHOO props
            if (o) {
                Y.mix(Y, o);
            }
        }

        // add old namespaces
        Y.namespace("util", "widget", "example");

        // support Y.register
        Y.mix(Y.env, {
                modules: [],
                listeners: [],
                getVersion: function(name) {
                    return this.env.modules[name] || null;
                }
        });

        Y.env.ua = Y.ua; 
        var L = Y.lang;

        // add old lang properties 
        Y.mix(L, {

            // hasOwnProperty: Y.bind(Y.object.owns, Y),
            hasOwnProperty: Y.object.owns,

            augmentObject: function(r, s) {
                var a = arguments, wl = (a.length > 2) ? Y.array(a, 2, true) : null;
                return Y.mix(r, s, (wl), wl);
            },
         
            augmentProto: function(r, s) {
                var a = arguments, wl = (a.length > 2) ? Y.array(a, 2, true) : null;
                return Y.bind(Y.prototype, r, s, (wl), wl);
            },

            augment: Y.bind(Y.augment, Y),
            extend: Y.bind(Y.extend, Y), 
            merge: Y.bind(Y.merge, Y)
        }, true);

        Y.augmentProto = L.augmentProto;

        // add register function
        Y.mix(Y, {
            register: function(name, mainClass, data) {
                var mods = Y.env.modules;
                if (!mods[name]) {
                    mods[name] = { versions:[], builds:[] };
                }
                var m=mods[name],v=data.version,b=data.build,ls=Y.env.listeners;
                m.name = name;
                m.version = v;
                m.build = b;
                m.versions.push(v);
                m.builds.push(b);
                m.mainClass = mainClass;
                // fire the module load listeners
                for (var i=0;i<ls.length;i=i+1) {
                    ls[i](m);
                }
                // label the main class
                if (mainClass) {
                    mainClass.VERSION = v;
                    mainClass.BUILD = b;
                } else {
                    Y.log("mainClass is undefined for module " + name, "warn");
                }
            }
        });

        // add old load listeners
        if ("undefined" !== typeof YAHOO_config) {
            var l=YAHOO_config.listener,ls=Y.env.listeners,unique=true,i;
            if (l) {
                // if YAHOO is loaded multiple times we need to check to see if
                // this is a new config object.  If it is, add the new component
                // load listener to the stack
                for (i=0;i<ls.length;i=i+1) {
                    if (ls[i]==l) {
                        unique=false;
                        break;
                    }
                }
                if (unique) {
                    ls.push(l);
                }
            }
        }
            
        // add old registration for yahoo
        Y.register("yahoo", Y, {version: "@VERSION@", build: "@BUILD@"});

        // @todo subscribe register to the module added event to pick
        // modules registered with the new method.
    };

    YUI.add("compat", M, "3.0.0");

})();
(function() {

    var M = function(Y) {
        Y.log(Y.id + ' setup complete) .');
    };

    YUI.add("yui", M, "3.0.0", {
        // the following will be bound automatically when this code is loaded
        use: ["lang", "array", "core", "object", "ua", "dump", "substitute", "later", "compat"]
    });

})();

// Bind the core modules to the YUI global
YUI._setup();
YAHOO.register("yui", YUI, {version: "@VERSION@", build: "@BUILD@"});
