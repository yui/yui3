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

        o = o || {};

        // find targeted window and @TODO create facades
        var w = (o.win) ? (o.win.contentWindow) : o.win  || window;
        o.win = w;
        o.doc = w.document;
    
        // add a reference to o for anything that needs it
        // before _setup is called.
        this.config = o;

        this.env = {
            // @todo expand the new module metadata
            mods: {},
            _idx: 0,
            _pre: 'yui-uid',
            _used: {}
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
        // make a shallow copy of the config.  This won't fix nested configs
        // so we need to determine if we only allow one level (probably) or
        // if we make clone create references for functions and elements.
        this.config = this.merge(this.config);
        this.publish('yui:load');
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
     * @param modules* {string} 1-n modules to bind (uses arguments array)
     * @param *callback {function} callback function executed when 
     * the instance has the required functionality.  If included, it
     * must be the last parameter.
     *
     * @TODO 
     * Implement versioning?  loader can load different versions?
     * Should sub-modules/plugins be normal modules, or do
     * we add syntax for specifying these?
     *
     * YUI().use('dragdrop')
     * YUI().use('dragdrop:2.4.0'); // specific version
     * YUI().use('dragdrop:2.4.0-'); // at least this version
     * YUI().use('dragdrop:2.4.0-2.9999.9999'); // version range
     * YUI().use('*'); // use all available modules
     * YUI().use('lang+dump+substitute'); // use lang and some plugins
     * YUI().use('lang+*'); // use lang and all known plugins
     *
     *
     * @return {YUI} the YUI instance
     */
    use: function() {

        var a=arguments, l=a.length, mods=YUI.env.mods, 
            Y = this, used = Y.env._used;

        // YUI().use('*'); // assumes you need everything you've included
        if (a[0] === "*") {
            return Y.use.apply(Y, mods);
        }

        var missing = [], r = [], f = function(name) {

            // only attach a module once
            if (used[name]) {
                return;
            }

            used[name] = true;

            var m = mods[name], j, req, use;

            if (m) {
                req = m.details.requires;
                use = m.details.use;
            } else {
                Y.log('module not found: ' + name);
                missing.push(name);
            }

            // make sure requirements are attached
            if (req) {
                for (j = 0; j < req.length; j = j + 1) {
                    f(req[j]);
                }
            }

            // add this module to full list of things to attach
            // Y.log('using ' + name);
            r.push(name);

            // auto-attach sub-modules
            if (use) {
                for (j = 0; j < use.length; j = j + 1) {
                    f(use[j]);
                }
            }
        };

        for (var i=0; i<l; i=i+1) {
            if ((i === l-1) && typeof a[i] === 'function') {
                // Y.log('found loaded listener');
                Y.on('yui:load', a[i], Y, Y);
            } else {
                f(a[i]);
            }
        }

        // Y.log('all reqs: ' + r);

        var attach = function() {
            for (i=0, l=r.length; i<l; i=i+1) {
                var m = mods[r[i]];
                if (m) {
                    Y.log('attaching ' + r[i]);
                    m.fn(Y);
                }
            }

            if (Y.fire) {
                // Y.log('firing loaded event');
                Y.fire('yui:load', Y);
            } else {
                // Y.log('loaded event not fired.');
            }
        };

        if (false && missing.length) {
            // dynamic load
        } else {
            attach();
        }

        return Y; // chain support var yui = YUI().use('dragdrop');
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

    // inheritance utilities are not available yet
    for (i in p) {
        if (true) { // hasOwnProperty not available yet and not needed
            Y[i] = p[i];
        }
    }

    // set up the environment
    Y._init();

})();

YUI.add("lang", function(Y) {

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

}, "3.0.0");

YUI.add("array", function(Y) {

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
            Native.forEach.call(a, f, o || Y);
            return Y;
        } :
        function (a, f, o) { 
            var l = a.length, i;
            for (i = 0; i < l; i=i+1) {
                f.call(o || Y, a[i], i, a);
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
}, "3.0.0");
// requires lang
YUI.add("core", function(Y) {

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
        //var a=arguments, o=Y.object(a[0]);
        var a=arguments, o={};
        for (var i=0, l=a.length; i<l; i=i+1) {
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
     *        default(0): object to object
     *        1: prototype to prototype (old augment)
     *        2: prototype to prototype and object props (new augment)
     *        3: prototype to object
     *        4: object to prototype
     * @return {YUI} the YUI instance
     */
    Y.mix = function(r, s, ov, wl, mode, merge) {

        if (!s||!r) {
            return Y;
        }

        var w = (wl && wl.length) ? A.hash(wl) : null, m = merge,

            f = function(fr, fs, proto, iwl) {
                // if (m && fr && fr.push) {
                //     Y.log('concat: ' + fs);
                //     fr.concat(fs);
                // }

                var arr = m && L.isArray(fr);

                for (var i in fs) { 
                    // Y.log('i: ' + i + ", " + fs[i]);
                    // if (!proto || (i in fs)) {
                    // @TODO deal with the hasownprop issue
                    // if (proto || ov || Y.object.owns(fs, i)) {

                    // check white list if it was supplied
                    if (!w || iwl || (i in w)) {
                        // if the receiver has this property, it is an object,
                        // and merge is specified, merge the two objects.
                        if (m && L.isObject(fr[i], true)) {
                            // Y.log('recurse: ' + i);
                            // @TODO recursive or no?
                            // Y.mix(fr[i], fs[i]); // not recursive
                            f(fr[i], fs[i], proto, true); // recursive
                        // otherwise apply the property only if overwrite
                        // is specified or the receiver doesn't have one.
                        } else if (ov || !fr[i]) {
                            // Y.log('hash: ' + i);
                            fr[i] = fs[i];
                        // if merge is specified and the receiver is an array,
                        // append the array item
                        } else if (arr) {
                            // Y.log('array: ' + i);
                            // @TODO probably will need to remove dups
                            fr.push(fs[i]);
                        }
                    }
                    // }
                }

                _iefix(fr, fs, w);
            };

        var rp = r.prototype, sp = s.prototype;

        switch (mode) {
            case 1: // proto to proto
                f(rp, sp, true);
                break;
            case 2: // object to object and proto to proto
                f(r, s);
                f(rp, sp, true);
                break;
            case 3: // proto to static
                f(r, sp, true);
                break;
            case 4: // static to proto
                f(rp, s);
                break;
            default:  // object to object
                f(r, s);
        }

        return Y;
    };

    /**
     * Applies prototype properties from the supplier to the receiver.
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
     * Applies object properties from the supplier to the receiver.  If
     * the target has the property, and the property is an object, the target
     * object will be augmented with the supplier's value.  If the property
     * is an array, the suppliers value will be appended to the target.
     *
     * @param {Function} r  the object to receive the augmentation
     * @param {Function} s  the object that supplies the properties to augment
     * @param ov {boolean} if true, properties already on the receiver
     * will be overwritten if found on the supplier.
     * @param wl {string[]} a whitelist.  If supplied, only properties in 
     * this list will be applied to the receiver.
     * @return {YUI} the YUI instance
     */
    Y.aggregate = function(r, s, ov, wl) {
        Y.mix(r, s, ov, wl, 0, true);
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

        var uid = (L.isString(o)) ? o : o._yuid;

        if (!uid) {
            uid = Y.guid();
            o._yuid = uid;
        }

        return uid;
    };

    Y.each = function(o, f, c) {

        // @todo, the object implementation works for arrays,
        // but arrays can use the native implementation if
        // available.  Is the native implementaiton it worth the 
        // cost of the array test?  Does the object implementation
        // work properly for array-like collections?

        switch (A.test(o)) {
            case 1:
                return A.each(o, f, c);
            case 2:
                return A.each(Y.array(o, 0, true), f, c);
            default:
                return Y.object.each(o, f, c);
        }

        // return Y.object.each(o, f, c);
    };

    /**
     * Deep obj/array copy. Functions are treated as objects.
     * Array-like objects are treated as arrays.
     * Other types are returned untouched.  Optionally a
     * function can be provided to handle other data types,
     * filter keys, validate values, etc.
     *
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
     *
     * @param f {Function} the function to bind
     * @param c the execution context
     * @return the wrapped function
     */
    Y.bind = function(f, c) {
        var a = Y.array(arguments, 2, true);
        return function () {
            // @todo bind args first, or function args first?
            // return f.apply(c || f, a.concat(Y.array(arguments, 0, true)));
            return f.apply(c || f, Y.array(arguments, 0, true).concat(a));
        };
    };

    Y.ready = function(f, c) {
        var a = arguments, m = (a.length > 1) ? Y.bind.apply(Y, a) : f;
        Y.on("yui:load", m);
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

    /**
     * Executes the callback before a DOM event, custom event
     * or method.  If the first argument is a function, it
     * is assumed the target is a method.
     *
     * For DOM and custom events:
     * type, callback, context, 1-n arguments
     *  
     * For methods:
     * callback, object (method host), methodName, context, 1-n arguments
     *
     * @method before
     * @return unsubscribe handle
     */
    Y.before = function(type, f, o) { 
        // method override
        // callback, object, sMethod
        if (Y.lang.isFunction(type)) {
            return Y.Do.before.apply(Y.Do, arguments);
        }
    };

    /**
     * Executes the callback after a DOM event, custom event
     * or method.  If the first argument is a function, it
     * is assumed the target is a method.
     *
     * For DOM and custom events:
     * type, callback, context, 1-n arguments
     *  
     * For methods:
     * callback, object (method host), methodName, context, 1-n arguments
     *
     * @method after
     * @return unsubscribe handle
     */
    Y.after = function(type, f, o) {
        if (Y.lang.isFunction(type)) {
            return Y.Do.after.apply(Y.Do, arguments);
        }
    };

    // Object factory
    Y.create = function() {

    };

}, "3.0.0");
// object utils
YUI.add("object", function(Y) {

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
        var s = c || Y;
        for (var i in o) {
            if (O.owns(o, i)) {
                f.call(s, o[i], i, o);
            }
        }

        return Y;
    };
}, "3.0.0");
YUI.add("ua", function(Y) {

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
}, "3.0.0");
// requires lang
YUI.add("dump", function(Y) {

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
}, "3.0.0");
// requires lang, dump
YUI.add("substitute", function(Y) {

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
}, "3.0.0");
// requires lang
YUI.add("later", function(Y) {

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
}, "3.0.0");
// Compatibility layer for 2.x
YUI.add("compat", function(Y) {

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
        // merge: Y.bind(Y.merge, Y)
        merge: Y.merge
    }, true);

    // L.merge = Y.merge;

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
}, "3.0.0");
YUI.add("event-custom", function(Y) {

    /**
     * The Event.Custom class lets you define events for your application
     * that can be subscribed to by one or more independent component.
     *
     * @param {String}  type The type of event, which is passed to the callback
     *                  when the event fires
     * @param {Object}  context The context the event will fire from.  "this" will
     *                  refer to this object in the callback.  Default value: 
     *                  the window object.  The listener can override this.
     * @param {boolean} silent pass true to prevent the event from writing to
     *                  the debugsystem
     * @param {int}     signature the signature that the custom event subscriber
     *                  will receive. Y.Event.Custom.LIST or 
     *                  Y.Event.Custom.FLAT.  The default is
     *                  Y.Event.Custom.LIST.
     * @namespace Y
     * @class Event.Custom
     * @constructor
     */
    Y.CustomEvent = function(type, context, silent, signature) {

        /**
         * The type of event, returned to subscribers when the event fires
         * @property type
         * @type string
         */
        this.type = type;

        /**
         * The context the the event will fire from by default.  Defaults to the YUI
         * instance.
         * @property context
         * @type object
         */
        this.context = context || Y;

        /**
         * By default all custom events are logged in the debug build, set silent
         * to true to disable debug outpu for this event.
         * @property silent
         * @type boolean
         */
        this.silent = silent;

        /**
         * Custom events support two styles of arguments provided to the event
         * subscribers.  
         * <ul>
         * <li>Y.Event.Custom.LIST: 
         *   <ul>
         *   <li>param1: event name</li>
         *   <li>param2: array of arguments sent to fire</li>
         *   <li>param3: <optional> a custom object supplied by the subscriber</li>
         *   </ul>
         * </li>
         * <li>Y.Event.Custom.FLAT
         *   <ul>
         *   <li>param1: the first argument passed to fire.  If you need to
         *           pass multiple parameters, use and array or object literal</li>
         *   <li>param2: <optional> a custom object supplied by the subscriber</li>
         *   </ul>
         * </li>
         * </ul>
         *   @property signature
         *   @type int
         */
        this.signature = signature || Y.CustomEvent.LIST;

        /**
         * The subscribers to this event
         * @property subscribers
         * @type Event.Subscriber[]
         */
        this.subscribers = [];

        if (!this.silent) {
            Y.log( "Creating " + this, "info", "Event" );
        }

        var onsubscribeType = "_YUICEOnSubscribe";

        // Only add subscribe events for events that are not generated by 
        // Event.Custom
        if (type !== onsubscribeType) {

            /**
             * Custom events provide a custom event that fires whenever there is
             * a new subscriber to the event.  This provides an opportunity to
             * handle the case where there is a non-repeating event that has
             * already fired has a new subscriber.  
             *
             * @event subscribeEvent
             * @type Y.Event.Custom
             * @param {Function} fn The function to execute
             * @param {Object}   obj An object to be passed along when the event 
             *                       fires
             * @param {boolean|Object}  override If true, the obj passed in becomes 
             *                                   the execution context of the listener.
             *                                   if an object, that object becomes the
             *                                   the execution context.
             */
            this.subscribeEvent = 
                    new Y.CustomEvent(onsubscribeType, this, true);

            /**
             * This event fires only once if true
             *
             * @property once
             * @type boolean
             * @default false;
             */
            this.once = false;

            /**
             * This event has fired if true
             *
             * @property fired
             * @type boolean
             * @default false;
             */
            this.fired = false;

            /**
             * This event should only fire one time if true, and if
             * it has fired, any new subscribers should be notified
             * immediately.
             *
             * @property fireOnce
             * @type boolean
             * @default false;
             */
            this.fireOnce = false;
        } 


        /**
         * In order to make it possible to execute the rest of the subscriber
         * stack when one thows an exception, the subscribers exceptions are
         * caught.  The most recent exception is stored in this property
         * @property lastError
         * @type Error
         */
        this.lastError = null;
    };

    /**
     * Event.Subscriber listener sigature constant.  The LIST type returns three
     * parameters: the event type, the array of args passed to fire, and
     * the optional custom object
     * @property Y.Event.Custom.LIST
     * @static
     * @type int
     */
    Y.CustomEvent.LIST = 0;

    /**
     * Event.Subscriber listener sigature constant.  The FLAT type returns two
     * parameters: the first argument passed to fire and the optional 
     * custom object
     * @property Y.Event.Custom.FLAT
     * @static
     * @type int
     */
    Y.CustomEvent.FLAT = 1;

    Y.CustomEvent.prototype = {

        /**
         * Subscribes the caller to this event
         * @method subscribe
         * @param {Function} fn        The function to execute
         * @param {Object}   obj       An object to be passed along when the event 
         *                             fires
         * @param {boolean|Object}  override If true, the obj passed in becomes 
         *                                   the execution context of the listener.
         *                                   if an object, that object becomes the
         *                                   the execution context.
         */
        subscribe: function(fn, obj, override) {

            if (!fn) {
    throw new Error("Invalid callback for subscriber to '" + this.type + "'");
            }

            if (this.subscribeEvent) {
                this.subscribeEvent.fire(fn, obj, override);
            }

            var s = new Y.Subscriber(fn, obj, override);

            if (this.fireOnce && this.fired) {
                this._notify(s);
            }

            this.subscribers.push(s);

        },

        /**
         * Unsubscribes subscribers.
         * @method unsubscribe
         * @param {Function} fn  The subscribed function to remove, if not supplied
         *                       all will be removed
         * @param {Object}   obj  The custom object passed to subscribe.  This is
         *                        optional, but if supplied will be used to
         *                        disambiguate multiple listeners that are the same
         *                        (e.g., you subscribe many object using a function
         *                        that lives on the prototype)
         * @return {boolean} True if the subscriber was found and detached.
         */
        unsubscribe: function(fn, obj) {

            if (!fn) {
                return this.unsubscribeAll();
            }

            var found = false;
            for (var i=0, len=this.subscribers.length; i<len; ++i) {
                var s = this.subscribers[i];
                if (s && s.contains(fn, obj)) {
                    this._delete(i);
                    found = true;
                }
            }

            return found;
        },

        _notify: function(s, args) {

            if (!this.silent) {
                Y.log( this.type + "->" + ": " +  s, 
                            "info", "Event" );
            }

            var context = s.getScope(this.context), ret;

            if (this.signature == Y.CustomEvent.FLAT) {
                var param = null;
                if (args.length > 0) {
                    param = args[0];
                }

                try {
                    ret = s.fn.call(context, param, s.obj);
                } catch(e) {
                    this.lastError = e;
                    Y.log(this + " subscriber exception: " + e,
                              "error", "Event");
                }
            } else {
                try {
                    ret = s.fn.call(context, this.type, args, s.obj);
                } catch(ex) {
                    this.lastError = ex;
                    Y.log(this + " subscriber exception: " + ex,
                              "error", "Event");
                }
            }
            if (false === ret) {
                if (!this.silent) {
                    Y.log("Event cancelled by subscriber", "info", "Event");
                }

                //break;
                return false;
            }

            return true;
        },

        /**
         * Notifies the subscribers.  The callback functions will be executed
         * from the context specified when the event was created, and with the 
         * following parameters:
         *   <ul>
         *   <li>The type of event</li>
         *   <li>All of the arguments fire() was executed with as an array</li>
         *   <li>The custom object (if any) that was passed into the subscribe() 
         *       method</li>
         *   </ul>
         * @method fire 
         * @param {Object*} arguments an arbitrary set of parameters to pass to 
         *                            the handler.
         * @return {boolean} false if one of the subscribers returned false, 
         *                   true otherwise
         */
        fire: function() {
            var len=this.subscribers.length;
            if (!len && this.silent) {
                return true;
            }

            var args=Y.array(arguments, 0, true), ret=true, i, rebuild=false;

            if (!this.silent) {
                Y.log( "Firing "       + this  + ", " + 
                           "args: "        + args  + ", " +
                           "subscribers: " + len,                 
                           "info", "Event"                  );
            }

            for (i=0; i<len; ++i) {
                var s = this.subscribers[i];
                if (!s) {
                    rebuild=true;
                } else {
                    ret = this._notify(s, args);
                    if (!ret) {
                        break;
                    }
                }
            }

            if (rebuild) {
                var newlist=[],subs=this.subscribers;
                for (i=0,len=subs.length; i<len; i=i+1) {
                    newlist.push(subs[i]);
                }

                this.subscribers=newlist;
            }

            this.fired = true;

            return ret;
        },

        /**
         * Removes all listeners
         * @method unsubscribeAll
         * @return {int} The number of listeners unsubscribed
         */
        unsubscribeAll: function() {
            for (var i=0, len=this.subscribers.length; i<len; ++i) {
                this._delete(len - 1 - i);
            }

            this.subscribers=[];

            return i;
        },

        /**
         * @method _delete
         * @private
         */
        _delete: function(index) {
            var s = this.subscribers[index];
            if (s) {
                delete s.fn;
                delete s.obj;
            }

            this.subscribers[index]=null;
        },

        /**
         * @method toString
         */
        toString: function() {
             return "Event.Custom: " + "'" + this.type  + "', " + 
                 "context: " + this.context;

        }
    };

    /////////////////////////////////////////////////////////////////////

    /**
     * Stores the subscriber information to be used when the event fires.
     * @param {Function} fn       The function to execute
     * @param {Object}   obj      An object to be passed along when the event fires
     * @param {boolean}  override If true, the obj passed in becomes the execution
     *                            context of the listener
     * @class Event.Subscriber
     * @constructor
     */
    Y.Subscriber = function(fn, obj, override) {

        /**
         * The callback that will be execute when the event fires
         * @property fn
         * @type function
         */
        this.fn = fn;

        /**
         * An optional custom object that will passed to the callback when
         * the event fires
         * @property obj
         * @type object
         */
        this.obj = Y.lang.isUndefined(obj) ? null : obj;

        /**
         * The default execution context for the event listener is defined when the
         * event is created (usually the object which contains the event).
         * By setting override to true, the execution context becomes the custom
         * object passed in by the subscriber.  If override is an object, that 
         * object becomes the context.
         * @property override
         * @type boolean|object
         */
        this.override = override;

    };

    /**
     * Returns the execution context for this listener.  If override was set to true
     * the custom obj will be the context.  If override is an object, that is the
     * context, otherwise the default context will be used.
     * @method getScope
     * @param {Object} defaultScope the context to use if this listener does not
     *                              override it.
     */
    Y.Subscriber.prototype.getScope = function(defaultScope) {
        if (this.override) {
            if (this.override === true) {
                return this.obj;
            } else {
                return this.override;
            }
        }
        return defaultScope;
    };

    /**
     * Returns true if the fn and obj match this objects properties.
     * Used by the unsubscribe method to match the right subscriber.
     *
     * @method contains
     * @param {Function} fn the function to execute
     * @param {Object} obj an object to be passed along when the event fires
     * @return {boolean} true if the supplied arguments match this 
     *                   subscriber's signature.
     */
    Y.Subscriber.prototype.contains = function(fn, obj) {
        if (obj) {
            return (this.fn == fn && this.obj == obj);
        } else {
            return (this.fn == fn);
        }
    };

    /**
     * @method toString
     */
    Y.Subscriber.prototype.toString = function() {
        return "Subscriber { obj: " + this.obj  + 
               ", override: " +  (this.override || "no") + " }";
    };

}, "3.0.0");
YUI.add("event-dom", function(Y) {

    /**
     * The Event Utility provides utilities for managing DOM Events and tools
     * for building event systems
     *
     * @module event
     * @title Event Utility
     * @namespace Y
     * @requires yahoo
     */

    /**
     * The event utility provides functions to add and remove event listeners,
     * event cleansing.  It also tries to automatically remove listeners it
     * registers during the unload event.
     *
     * @class Event
     * @static
     */
        Y.Event = function() {

            /**
             * True after the onload event has fired
             * @property loadComplete
             * @type boolean
             * @static
             * @private
             */
            var loadComplete =  false;

            /**
             * Cache of wrapped listeners
             * @property listeners
             * @type array
             * @static
             * @private
             */
            var listeners = [];

            /**
             * User-defined unload function that will be fired before all events
             * are detached
             * @property unloadListeners
             * @type array
             * @static
             * @private
             */
            var unloadListeners = [];

            /**
             * Cache of DOM0 event handlers to work around issues with DOM2 events
             * in Safari
             * @property legacyEvents
             * @static
             * @private
             */
            var legacyEvents = [];

            /**
             * Listener stack for DOM0 events
             * @property legacyHandlers
             * @static
             * @private
             */
            var legacyHandlers = [];

            /**
             * The number of times to poll after window.onload.  This number is
             * increased if additional late-bound handlers are requested after
             * the page load.
             * @property retryCount
             * @static
             * @private
             */
            var retryCount = 0;

            /**
             * onAvailable listeners
             * @property onAvailStack
             * @static
             * @private
             */
            var onAvailStack = [];

            /**
             * Lookup table for legacy events
             * @property legacyMap
             * @static
             * @private
             */
            var legacyMap = [];

            /**
             * Counter for auto id generation
             * @property counter
             * @static
             * @private
             */
            var counter = 0;
            
            /**
             * Normalized keycodes for webkit/safari
             * @property webkitKeymap
             * @type {int: int}
             * @private
             * @static
             * @final
             */
            var webkitKeymap = {
                63232: 38, // up
                63233: 40, // down
                63234: 37, // left
                63235: 39, // right
                63276: 33, // page up
                63277: 34, // page down
                25: 9      // SHIFT-TAB (Safari provides a different key code in
                           // this case, even though the shiftKey modifier is set)
            };

            return {

                /**
                 * The number of times we should look for elements that are not
                 * in the DOM at the time the event is requested after the document
                 * has been loaded.  The default is 2000@amp;20 ms, so it will poll
                 * for 40 seconds or until all outstanding handlers are bound
                 * (whichever comes first).
                 * @property POLL_RETRYS
                 * @type int
                 * @static
                 * @final
                 */
                POLL_RETRYS: 2000,

                /**
                 * The poll interval in milliseconds
                 * @property POLL_INTERVAL
                 * @type int
                 * @static
                 * @final
                 */
                POLL_INTERVAL: 20,

                /**
                 * Element to bind, int constant
                 * @property EL
                 * @type int
                 * @static
                 * @final
                 */
                EL: 0,

                /**
                 * Type of event, int constant
                 * @property TYPE
                 * @type int
                 * @static
                 * @final
                 */
                TYPE: 1,

                /**
                 * Function to execute, int constant
                 * @property FN
                 * @type int
                 * @static
                 * @final
                 */
                FN: 2,

                /**
                 * Function wrapped for context correction and cleanup, int constant
                 * @property WFN
                 * @type int
                 * @static
                 * @final
                 */
                WFN: 3,

                /**
                 * Object passed in by the user that will be returned as a 
                 * parameter to the callback, int constant.  Specific to
                 * unload listeners
                 * @property OBJ
                 * @type int
                 * @static
                 * @final
                 */
                UNLOAD_OBJ: 3,

                /**
                 * Adjusted context, either the element we are registering the event
                 * on or the custom object passed in by the listener, int constant
                 * @property ADJ_SCOPE
                 * @type int
                 * @static
                 * @final
                 */
                ADJ_SCOPE: 4,

                /**
                 * The original obj passed into addListener
                 * @property OBJ
                 * @type int
                 * @static
                 * @final
                 */
                OBJ: 5,

                /**
                 * The original context parameter passed into addListener
                 * @property OVERRIDE
                 * @type int
                 * @static
                 * @final
                 */
                OVERRIDE: 6,

                /**
                 * addListener/removeListener can throw errors in unexpected scenarios.
                 * These errors are suppressed, the method returns false, and this property
                 * is set
                 * @property lastError
                 * @static
                 * @type Error
                 */
                lastError: null,


                /**
                 * poll handle
                 * @property _interval
                 * @static
                 * @private
                 */
                _interval: null,

                /**
                 * document readystate poll handle
                 * @property _dri
                 * @static
                 * @private
                 */
                 _dri: null,

                /**
                 * True when the document is initially usable
                 * @property DOMReady
                 * @type boolean
                 * @static
                 */
                DOMReady: false,

                /**
                 * @method startInterval
                 * @static
                 * @private
                 */
                startInterval: function() {
                    if (!this._interval) {
                        var self = this;
                        var callback = function() { self._tryPreloadAttach(); };
                        this._interval = setInterval(callback, this.POLL_INTERVAL);
                    }
                },

                /**
                 * Executes the supplied callback when the item with the supplied
                 * id is found.  This is meant to be used to execute behavior as
                 * soon as possible as the page loads.  If you use this after the
                 * initial page load it will poll for a fixed time for the element.
                 * The number of times it will poll and the frequency are
                 * configurable.  By default it will poll for 10 seconds.
                 *
                 * <p>The callback is executed with a single parameter:
                 * the custom object parameter, if provided.</p>
                 *
                 * @method onAvailable
                 *
                 * @param {string||string[]}   p_id the id of the element, or an array
                 * of ids to look for.
                 * @param {function} p_fn what to execute when the element is found.
                 * @param {object}   p_obj an optional object to be passed back as
                 *                   a parameter to p_fn.
                 * @param {boolean|object}  p_override If set to true, p_fn will execute
                 *                   in the context of p_obj, if set to an object it
                 *                   will execute in the context of that object
                 * @param checkContent {boolean} check child node readiness (onContentReady)
                 * @static
                 */
                onAvailable: function(p_id, p_fn, p_obj, p_override, checkContent) {

                    var a = (Y.lang.isString(p_id)) ? [p_id] : p_id;

                    for (var i=0; i<a.length; i=i+1) {
                        onAvailStack.push({id:         a[i], 
                                           fn:         p_fn, 
                                           obj:        p_obj, 
                                           override:   p_override, 
                                           checkReady: checkContent });
                    }
                    retryCount = this.POLL_RETRYS;
                    this.startInterval();
                },

                /**
                 * Works the same way as onAvailable, but additionally checks the
                 * state of sibling elements to determine if the content of the
                 * available element is safe to modify.
                 *
                 * <p>The callback is executed with a single parameter:
                 * the custom object parameter, if provided.</p>
                 *
                 * @method onContentReady
                 *
                 * @param {string}   p_id the id of the element to look for.
                 * @param {function} p_fn what to execute when the element is ready.
                 * @param {object}   p_obj an optional object to be passed back as
                 *                   a parameter to p_fn.
                 * @param {boolean|object}  p_override If set to true, p_fn will execute
                 *                   in the context of p_obj.  If an object, p_fn will
                 *                   exectute in the context of that object
                 *
                 * @static
                 */
                onContentReady: function(p_id, p_fn, p_obj, p_override) {
                    this.onAvailable(p_id, p_fn, p_obj, p_override, true);
                },

                /**
                 * Executes the supplied callback when the DOM is first usable.  This
                 * will execute immediately if called after the DOMReady event has
                 * fired.   @todo the DOMContentReady event does not fire when the
                 * script is dynamically injected into the page.  This means the
                 * DOMReady custom event will never fire in FireFox or Opera when the
                 * library is injected.  It _will_ fire in Safari, and the IE 
                 * implementation would allow for us to fire it if the defered script
                 * is not available.  We want this to behave the same in all browsers.
                 * Is there a way to identify when the script has been injected 
                 * instead of included inline?  Is there a way to know whether the 
                 * window onload event has fired without having had a listener attached 
                 * to it when it did so?
                 *
                 * <p>The callback is a Event.Custom, so the signature is:</p>
                 * <p>type &lt;string&gt;, args &lt;array&gt;, customobject &lt;object&gt;</p>
                 * <p>For DOMReady events, there are no fire argments, so the
                 * signature is:</p>
                 * <p>"DOMReady", [], obj</p>
                 *
                 *
                 * @method onDOMReady
                 *
                 * @param {function} p_fn what to execute when the element is found.
                 * @param {object}   p_obj an optional object to be passed back as
                 *                   a parameter to p_fn.
                 * @param {boolean|object}  p_context If set to true, p_fn will execute
                 *                   in the context of p_obj, if set to an object it
                 *                   will execute in the context of that object
                 *
                 * @static
                 */
                onDOMReady: function(p_fn, p_obj, p_override) {
                    if (Y.Event.DOMReady) {
                        setTimeout(function() {
                            var s = Y;
                            if (p_override) {
                                if (p_override === true) {
                                    s = p_obj;
                                } else {
                                    s = p_override;
                                }
                            }
                            p_fn.call(s, "event:ready", [], p_obj);
                        }, 0);
                    } else {
                        Y.Event.DOMReadyEvent.subscribe(p_fn, p_obj, p_override);
                    }
                },

                /**
                 * Appends an event handler
                 *
                 * @method addListener
                 *
                 * @param {String|HTMLElement|Array|NodeList} el An id, an element 
                 *  reference, or a collection of ids and/or elements to assign the 
                 *  listener to.
                 * @param {String}   sType     The type of event to append
                 * @param {Function} fn        The method the event invokes
                 * @param {Object}   obj    An arbitrary object that will be 
                 *                             passed as a parameter to the handler
                 * @param {Boolean|object}  override  If true, the obj passed in becomes
                 *                             the execution context of the listener. If an
                 *                             object, this object becomes the execution
                 *                             context.
                 * @return {Boolean} True if the action was successful or defered,
                 *                        false if one or more of the elements 
                 *                        could not have the listener attached,
                 *                        or if the operation throws an exception.
                 * @static
                 */
                addListener: function(el, sType, fn, obj, override) {

                    if (!fn || !fn.call) {
    // throw new TypeError(sType + " addListener call failed, callback undefined");
    Y.log(sType + " addListener call failed, invalid callback", "error", "Event");
                        return false;
                    }

                    // The el argument can be an array of elements or element ids.
                    if ( this._isValidCollection(el)) {
                        var ok = true;
                        for (var i=0,len=el.length; i<len; ++i) {
                            ok = this.addListener(el[i], 
                                           sType, 
                                           fn, 
                                           obj, 
                                           override) && ok;
                        }
                        return ok;

                    } else if (Y.lang.isString(el)) {
                        var oEl = Y.get(el);
                        // If the el argument is a string, we assume it is 
                        // actually the id of the element.  If the page is loaded
                        // we convert el to the actual element, otherwise we 
                        // defer attaching the event until onload event fires

                        // check to see if we need to delay hooking up the event 
                        // until after the page loads.
                        if (oEl) {
                            el = oEl;
                        } else {
                            // defer adding the event until the element is available
                            this.onAvailable(el, function() {
                               Y.Event.addListener(el, sType, fn, obj, override);
                            });

                            return true;
                        }
                    }

                    // Element should be an html element or an array if we get 
                    // here.
                    if (!el) {
                        // this.logger.debug("unable to attach event " + sType);
                        return false;
                    }

                    // we need to make sure we fire registered unload events 
                    // prior to automatically unhooking them.  So we hang on to 
                    // these instead of attaching them to the window and fire the
                    // handles explicitly during our one unload event.
                    if ("unload" == sType && obj !== this) {
                        unloadListeners[unloadListeners.length] =
                                [el, sType, fn, obj, override];
                        return true;
                    }

                    // this.logger.debug("Adding handler: " + el + ", " + sType);

                    // if the user chooses to override the context, we use the custom
                    // object passed in, otherwise the executing context will be the
                    // HTML element that the event is registered on
                    var context = el;
                    if (override) {
                        if (override === true) {
                            context = obj;
                        } else {
                            context = override;
                        }
                    }

                    // wrap the function so we can return the obj object when
                    // the event fires;
                    var wrappedFn = function(e) {
                            return fn.call(context, Y.Event.getEvent(e, el), 
                                    obj);
                        };

                    var li = [el, sType, fn, wrappedFn, context, obj, override];
                    var index = listeners.length;
                    // cache the listener so we can try to automatically unload
                    listeners[index] = li;

                    if (this.useLegacyEvent(el, sType)) {
                        var legacyIndex = this.getLegacyIndex(el, sType);

                        // Add a new dom0 wrapper if one is not detected for this
                        // element
                        if ( legacyIndex == -1 || 
                                    el != legacyEvents[legacyIndex][0] ) {

                            legacyIndex = legacyEvents.length;
                            legacyMap[el.id + sType] = legacyIndex;

                            // cache the signature for the DOM0 event, and 
                            // include the existing handler for the event, if any
                            legacyEvents[legacyIndex] = 
                                [el, sType, el["on" + sType]];
                            legacyHandlers[legacyIndex] = [];

                            el["on" + sType] = 
                                function(e) {
                                    Y.Event.fireLegacyEvent(
                                        Y.Event.getEvent(e), legacyIndex);
                                };
                        }

                        // add a reference to the wrapped listener to our custom
                        // stack of events
                        //legacyHandlers[legacyIndex].push(index);
                        legacyHandlers[legacyIndex].push(li);

                    } else {
                        try {
                            this._simpleAdd(el, sType, wrappedFn, false);
                        } catch(ex) {
                            // handle an error trying to attach an event.  If it fails
                            // we need to clean up the cache
                            this.lastError = ex;
                            this.removeListener(el, sType, fn);
                            return false;
                        }
                    }

                    return true;
                    
                },

                /**
                 * When using legacy events, the handler is routed to this object
                 * so we can fire our custom listener stack.
                 * @method fireLegacyEvent
                 * @static
                 * @private
                 */
                fireLegacyEvent: function(e, legacyIndex) {
                    // this.logger.debug("fireLegacyEvent " + legacyIndex);
                    var ok=true,le,lh,li,context,ret;
                    
                    lh = legacyHandlers[legacyIndex];
                    for (var i=0,len=lh.length; i<len; ++i) {
                        li = lh[i];
                        if ( li && li[this.WFN] ) {
                            context = li[this.ADJ_SCOPE];
                            ret = li[this.WFN].call(context, e);
                            ok = (ok && ret);
                        }
                    }

                    // Fire the original handler if we replaced one.  We fire this
                    // after the other events to keep stopPropagation/preventDefault
                    // that happened in the DOM0 handler from touching our DOM2
                    // substitute
                    le = legacyEvents[legacyIndex];
                    if (le && le[2]) {
                        le[2](e);
                    }
                    
                    return ok;
                },

                /**
                 * Returns the legacy event index that matches the supplied 
                 * signature
                 * @method getLegacyIndex
                 * @static
                 * @private
                 */
                getLegacyIndex: function(el, sType) {
                    var key = this.generateId(el) + sType;
                    if (typeof legacyMap[key] == "undefined") { 
                        return -1;
                    } else {
                        return legacyMap[key];
                    }
                },

                /**
                 * Logic that determines when we should automatically use legacy
                 * events instead of DOM2 events.  Currently this is limited to old
                 * Safari browsers with a broken preventDefault
                 * @method useLegacyEvent
                 * @static
                 * @private
                 */
                useLegacyEvent: function(el, sType) {
                    if (Y.ua.webkit && ("click"==sType || "dblclick"==sType)) {
                        var v = parseInt(Y.ua.webkit, 10);
                        if (!isNaN(v) && v<418) {
                            return true;
                        }
                    }
                    return false;
                },
                        
                /**
                 * Removes an event listener
                 *
                 * @method removeListener
                 *
                 * @param {String|HTMLElement|Array|NodeList} el An id, an element 
                 *  reference, or a collection of ids and/or elements to remove
                 *  the listener from.
                 * @param {String} sType the type of event to remove.
                 * @param {Function} fn the method the event invokes.  If fn is
                 *  undefined, then all event handlers for the type of event are 
                 *  removed.
                 * @return {boolean} true if the unbind was successful, false 
                 *  otherwise.
                 * @static
                 */
                removeListener: function(el, sType, fn) {
                    var i, len, li;

                    // The el argument can be a string
                    if (typeof el == "string") {
                        el = Y.get(el);
                    // The el argument can be an array of elements or element ids.
                    } else if ( this._isValidCollection(el)) {
                        var ok = true;
                        for (i=0,len=el.length; i<len; ++i) {
                            ok = ( this.removeListener(el[i], sType, fn) && ok );
                        }
                        return ok;
                    }

                    if (!fn || !fn.call) {
                        // this.logger.debug("Error, function is not valid " + fn);
                        //return false;
                        return this.purgeElement(el, false, sType);
                    }

                    if ("unload" == sType) {

                        for (i=0, len=unloadListeners.length; i<len; i++) {
                            li = unloadListeners[i];
                            if (li && 
                                li[0] == el && 
                                li[1] == sType && 
                                li[2] == fn) {
                                    //unloadListeners.splice(i, 1);
                                    unloadListeners[i]=null;
                                    return true;
                            }
                        }

                        return false;
                    }

                    var cacheItem = null;

                    // The index is a hidden parameter; needed to remove it from
                    // the method signature because it was tempting users to
                    // try and take advantage of it, which is not possible.
                    var index = arguments[3];
      
                    if ("undefined" === typeof index) {
                        index = this._getCacheIndex(el, sType, fn);
                    }

                    if (index >= 0) {
                        cacheItem = listeners[index];
                    }

                    if (!el || !cacheItem) {
                        // this.logger.debug("cached listener not found");
                        return false;
                    }

                    // this.logger.debug("Removing handler: " + el + ", " + sType);

                    if (this.useLegacyEvent(el, sType)) {
                        var legacyIndex = this.getLegacyIndex(el, sType);
                        var llist = legacyHandlers[legacyIndex];
                        if (llist) {
                            for (i=0, len=llist.length; i<len; ++i) {
                                li = llist[i];
                                if (li && 
                                    li[this.EL] == el && 
                                    li[this.TYPE] == sType && 
                                    li[this.FN] == fn) {
                                        //llist.splice(i, 1);
                                        llist[i]=null;
                                        break;
                                }
                            }
                        }

                    } else {
                        try {
                            this._simpleRemove(el, sType, cacheItem[this.WFN], false);
                        } catch(ex) {
                            this.lastError = ex;
                            return false;
                        }
                    }

                    // removed the wrapped handler
                    delete listeners[index][this.WFN];
                    delete listeners[index][this.FN];
                    //listeners.splice(index, 1);
                    listeners[index]=null;

                    return true;

                },


                 
                /**
                 * Finds the event in the window object, the caller's arguments, or
                 * in the arguments of another method in the callstack.  This is
                 * executed automatically for events registered through the event
                 * manager, so the implementer should not normally need to execute
                 * this function at all.
                 * @method getEvent
                 * @param {Event} e the event parameter from the handler
                 * @param {HTMLElement} boundEl the element the listener is attached to
                 * @return {Event} the event 
                 * @static
                 */
                getEvent: function(e, boundEl) {
                    var ev = e || window.event;

                    if (!ev) {
                        var c = this.getEvent.caller;
                        while (c) {
                            ev = c.arguments[0];
                            if (ev && Event == ev.constructor) {
                                break;
                            }
                            c = c.caller;
                        }
                    }

                    return new Y.Event.Facade(ev, boundEl);
                },

                /**
                 * Returns the charcode for an event
                 * @method getCharCode
                 * @param {Event} ev the event
                 * @return {int} the event's charCode
                 * @static
                 */
                getCharCode: function(ev) {
                    var code = ev.keyCode || ev.charCode || 0;

                    // webkit normalization
                    if (Y.ua.webkit && (code in webkitKeymap)) {
                        code = webkitKeymap[code];
                    }
                    return code;
                },

                /**
                 * Locating the saved event handler data by function ref
                 *
                 * @method _getCacheIndex
                 * @static
                 * @private
                 */
                _getCacheIndex: function(el, sType, fn) {
                    for (var i=0,len=listeners.length; i<len; ++i) {
                        var li = listeners[i];
                        if ( li                 && 
                             li[this.FN] == fn  && 
                             li[this.EL] == el  && 
                             li[this.TYPE] == sType ) {
                            return i;
                        }
                    }

                    return -1;
                },

                /**
                 * Generates an unique ID for the element if it does not already 
                 * have one.
                 * @method generateId
                 * @param el the element to create the id for
                 * @return {string} the resulting id of the element
                 * @static
                 */
                generateId: function(el) {
                    var id = el.id;

                    if (!id) {
                        id = Y.stamp(el);
                        el.id = id;
                    }

                    return id;
                },


                /**
                 * We want to be able to use getElementsByTagName as a collection
                 * to attach a group of events to.  Unfortunately, different 
                 * browsers return different types of collections.  This function
                 * tests to determine if the object is array-like.  It will also 
                 * fail if the object is an array, but is empty.
                 * @method _isValidCollection
                 * @param o the object to test
                 * @return {boolean} true if the object is array-like and populated
                 * @static
                 * @private
                 */
                _isValidCollection: function(o) {
                    try {
                        return ( o                     && // o is something
                                 typeof o !== "string" && // o is not a string
                                 o.length              && // o is indexed
                                 !o.tagName            && // o is not an HTML element
                                 !o.alert              && // o is not a window
                                 typeof o[0] !== "undefined" );
                    } catch(ex) {
                        Y.log("_isValidCollection error, assuming that " +
                    " this is a cross frame problem and not a collection", "warn");
                        return false;
                    }

                },


                /**
                 * Custom event the fires when the dom is initially usable
                 * @event DOMReadyEvent
                 */
                DOMReadyEvent: new Y.CustomEvent("event:ready", this),

                /**
                 * hook up any deferred listeners
                 * @method _load
                 * @static
                 * @private
                 */
                _load: function(e) {

                    if (!loadComplete) {
                        loadComplete = true;
                        var E = Y.Event;

                        // Just in case DOMReady did not go off for some reason
                        E._ready();

                        // Available elements may not have been detected before the
                        // window load event fires. Try to find them now so that the
                        // the user is more likely to get the onAvailable notifications
                        // before the window load notification
                        E._tryPreloadAttach();

                    }
                },

                /**
                 * Fires the DOMReady event listeners the first time the document is
                 * usable.
                 * @method _ready
                 * @static
                 * @private
                 */
                _ready: function(e) {
                    var E = Y.Event;
                    if (!E.DOMReady) {
                        E.DOMReady=true;

                        // Fire the content ready custom event
                        E.DOMReadyEvent.fire();

                        // Remove the DOMContentLoaded (FF/Opera)
                        E._simpleRemove(document, "DOMContentLoaded", E._ready);
                    }
                },

                /**
                 * Polling function that runs before the onload event fires, 
                 * attempting to attach to DOM Nodes as soon as they are 
                 * available
                 * @method _tryPreloadAttach
                 * @static
                 * @private
                 */
                _tryPreloadAttach: function() {

                    if (this.locked) {
                        return false;
                    }

                    if (Y.ua.ie) {
                        // Hold off if DOMReady has not fired and check current
                        // readyState to protect against the IE operation aborted
                        // issue.
                        if (!this.DOMReady) {
                            this.startInterval();
                            return false;
                        }
                    }

                    this.locked = true;

                    // this.logger.debug("tryPreloadAttach");

                    // keep trying until after the page is loaded.  We need to 
                    // check the page load state prior to trying to bind the 
                    // elements so that we can be certain all elements have been 
                    // tested appropriately
                    var tryAgain = !loadComplete;
                    if (!tryAgain) {
                        tryAgain = (retryCount > 0);
                    }

                    // onAvailable
                    var notAvail = [];

                    var executeItem = function (el, item) {
                        var context = el;
                        if (item.override) {
                            if (item.override === true) {
                                context = item.obj;
                            } else {
                                context = item.override;
                            }
                        }
                        item.fn.call(context, item.obj);
                    };

                    var i,len,item,el;

                    // onAvailable
                    for (i=0,len=onAvailStack.length; i<len; ++i) {
                        item = onAvailStack[i];
                        if (item && !item.checkReady) {
                            el = Y.get(item.id);
                            if (el) {
                                executeItem(el, item);
                                onAvailStack[i] = null;
                            } else {
                                notAvail.push(item);
                            }
                        }
                    }

                    // onContentReady
                    for (i=0,len=onAvailStack.length; i<len; ++i) {
                        item = onAvailStack[i];
                        if (item && item.checkReady) {
                            el = Y.get(item.id);

                            if (el) {
                                // The element is available, but not necessarily ready
                                // @todo should we test parentNode.nextSibling?
                                if (loadComplete || el.nextSibling) {
                                    executeItem(el, item);
                                    onAvailStack[i] = null;
                                }
                            } else {
                                notAvail.push(item);
                            }
                        }
                    }

                    retryCount = (notAvail.length === 0) ? 0 : retryCount - 1;

                    if (tryAgain) {
                        // we may need to strip the nulled out items here
                        this.startInterval();
                    } else {
                        clearInterval(this._interval);
                        this._interval = null;
                    }

                    this.locked = false;

                    return true;

                },

                /**
                 * Removes all listeners attached to the given element via addListener.
                 * Optionally, the node's children can also be purged.
                 * Optionally, you can specify a specific type of event to remove.
                 * @method purgeElement
                 * @param {HTMLElement} el the element to purge
                 * @param {boolean} recurse recursively purge this element's children
                 * as well.  Use with caution.
                 * @param {string} sType optional type of listener to purge. If
                 * left out, all listeners will be removed
                 * @static
                 */
                purgeElement: function(el, recurse, sType) {
                    var oEl = (Y.lang.isString(el)) ? Y.get(el) : el;
                    var elListeners = this.getListeners(oEl, sType), i, len;
                    if (elListeners) {
                        for (i=0,len=elListeners.length; i<len ; ++i) {
                            var l = elListeners[i];
                            this.removeListener(oEl, l.type, l.fn, l.index);
                        }
                    }

                    if (recurse && oEl && oEl.childNodes) {
                        for (i=0,len=oEl.childNodes.length; i<len ; ++i) {
                            this.purgeElement(oEl.childNodes[i], recurse, sType);
                        }
                    }
                },

                /**
                 * Returns all listeners attached to the given element via addListener.
                 * Optionally, you can specify a specific type of event to return.
                 * @method getListeners
                 * @param el {HTMLElement|string} the element or element id to inspect 
                 * @param sType {string} optional type of listener to return. If
                 * left out, all listeners will be returned
                 * @return {Object} the listener. Contains the following fields:
                 * &nbsp;&nbsp;type:   (string)   the type of event
                 * &nbsp;&nbsp;fn:     (function) the callback supplied to addListener
                 * &nbsp;&nbsp;obj:    (object)   the custom object supplied to addListener
                 * &nbsp;&nbsp;adjust: (boolean|object)  whether or not to adjust the default context
                 * &nbsp;&nbsp;context: (boolean)  the derived context based on the adjust parameter
                 * &nbsp;&nbsp;index:  (int)      its position in the Event util listener cache
                 * @static
                 */           
                getListeners: function(el, sType) {
                    var results=[], searchLists;
                    if (!sType) {
                        searchLists = [listeners, unloadListeners];
                    } else if (sType === "unload") {
                        searchLists = [unloadListeners];
                    } else {
                        searchLists = [listeners];
                    }

                    var oEl = (Y.lang.isString(el)) ? Y.get(el) : el;

                    for (var j=0;j<searchLists.length; j=j+1) {
                        var searchList = searchLists[j];
                        if (searchList && searchList.length > 0) {
                            for (var i=0,len=searchList.length; i<len ; ++i) {
                                var l = searchList[i];
                                if ( l  && l[this.EL] === oEl && 
                                        (!sType || sType === l[this.TYPE]) ) {
                                    results.push({
                                        type:   l[this.TYPE],
                                        fn:     l[this.FN],
                                        obj:    l[this.OBJ],
                                        adjust: l[this.OVERRIDE],
                                        context:  l[this.ADJ_SCOPE],
                                        index:  i
                                    });
                                }
                            }
                        }
                    }

                    return (results.length) ? results : null;
                },

                /**
                 * Removes all listeners registered by pe.event.  Called 
                 * automatically during the unload event.
                 * @method _unload
                 * @static
                 * @private
                 */
                _unload: function(e) {

                    var E = Y.Event, i, j, l, len, index;

                    // execute and clear stored unload listeners
                    for (i=0,len=unloadListeners.length; i<len; ++i) {
                        l = unloadListeners[i];
                        if (l) {
                            var context = Y;
                            if (l[E.ADJ_SCOPE]) {
                                if (l[E.ADJ_SCOPE] === true) {
                                    context = l[E.UNLOAD_OBJ];
                                } else {
                                    context = l[E.ADJ_SCOPE];
                                }
                            }
                            l[E.FN].call(context, E.getEvent(e, l[E.EL]), l[E.UNLOAD_OBJ] );
                            unloadListeners[i] = null;
                            l=null;
                            context=null;
                        }
                    }

                    unloadListeners = null;

                    // Remove listeners to handle IE memory leaks
                    //if (Y.ua.ie && listeners && listeners.length > 0) {
                    
                    // 2.5.0 listeners are removed for all browsers again.  FireFox preserves
                    // at least some listeners between page refreshes, potentially causing
                    // errors during page load (mouseover listeners firing before they
                    // should if the user moves the mouse at the correct moment).
                    if (listeners && listeners.length > 0) {
                        j = listeners.length;
                        while (j) {
                            index = j-1;
                            l = listeners[index];
                            if (l) {
                                E.removeListener(l[E.EL], l[E.TYPE], l[E.FN], index);
                            } 
                            j--;
                        }
                        l=null;
                    }

                    legacyEvents = null;

                    E._simpleRemove(window, "unload", E._unload);

                },

                
                /**
                 * Adds a DOM event directly without the caching, cleanup, context adj, etc
                 *
                 * @method _simpleAdd
                 * @param {HTMLElement} el      the element to bind the handler to
                 * @param {string}      sType   the type of event handler
                 * @param {function}    fn      the callback to invoke
                 * @param {boolen}      capture capture or bubble phase
                 * @static
                 * @private
                 */
                _simpleAdd: function () {
                    if (window.addEventListener) {
                        return function(el, sType, fn, capture) {
                            el.addEventListener(sType, fn, (capture));
                        };
                    } else if (window.attachEvent) {
                        return function(el, sType, fn, capture) {
                            el.attachEvent("on" + sType, fn);
                        };
                    } else {
                        return function(){};
                    }
                }(),

                /**
                 * Basic remove listener
                 *
                 * @method _simpleRemove
                 * @param {HTMLElement} el      the element to bind the handler to
                 * @param {string}      sType   the type of event handler
                 * @param {function}    fn      the callback to invoke
                 * @param {boolen}      capture capture or bubble phase
                 * @static
                 * @private
                 */
                _simpleRemove: function() {
                    if (window.removeEventListener) {
                        return function (el, sType, fn, capture) {
                            el.removeEventListener(sType, fn, (capture));
                        };
                    } else if (window.detachEvent) {
                        return function (el, sType, fn) {
                            el.detachEvent("on" + sType, fn);
                        };
                    } else {
                        return function(){};
                    }
                }()
            };

        }();

}, "3.0.0");

YUI.add("event-target", function(Y) {

    /**
     * Event.Target is designed to be used with Y.augment to wrap 
     * Event.Custom in an interface that allows events to be subscribed to 
     * and fired by name.  This makes it possible for implementing code to
     * subscribe to an event that either has not been created yet, or will
     * not be created at all.
     *
     * @Class Event.Target
     */
    Y.Event.Target = function() { };

    Y.Event.Target.prototype = {

        /**
         * Private storage of custom events
         * @property __yui_events
         * @type Object[]
         * @private
         */
        __yui_events: null,

        /**
         * Private storage of custom event subscribers
         * @property __yui_subscribers
         * @type Object[]
         * @private
         */
        __yui_subscribers: null,
        
        /**
         * Subscribe to a Event.Custom by event type
         *
         * @method subscribe
         * @param p_type     {string}   the type, or name of the event
         * @param p_fn       {function} the function to exectute when the event fires
         * @param p_obj      {Object}   An object to be passed along when the event 
         *                              fires
         * @param p_override {boolean}  If true, the obj passed in becomes the 
         *                              execution context of the listener
         */
        subscribe: function(p_type, p_fn, p_obj, p_override) {

            this.__yui_events = this.__yui_events || {};
            var ce = this.__yui_events[p_type];

            if (ce) {
                ce.subscribe(p_fn, p_obj, p_override);
            } else {
                this.__yui_subscribers = this.__yui_subscribers || {};
                var subs = this.__yui_subscribers;
                if (!subs[p_type]) {
                    subs[p_type] = [];
                }
                subs[p_type].push(
                    { fn: p_fn, obj: p_obj, override: p_override } );
            }
        },

        /**
         * Unsubscribes one or more listeners the from the specified event
         * @method unsubscribe
         * @param p_type {string}   The type, or name of the event.  If the type
         *                          is not specified, it will attempt to remove
         *                          the listener from all hosted events.
         * @param p_fn   {Function} The subscribed function to unsubscribe, if not
         *                          supplied, all subscribers will be removed.
         * @param p_obj  {Object}   The custom object passed to subscribe.  This is
         *                        optional, but if supplied will be used to
         *                        disambiguate multiple listeners that are the same
         *                        (e.g., you subscribe many object using a function
         *                        that lives on the prototype)
         * @return {boolean} true if the subscriber was found and detached.
         */
        unsubscribe: function(p_type, p_fn, p_obj) {
            this.__yui_events = this.__yui_events || {};
            var evts = this.__yui_events;
            if (p_type) {
                var ce = evts[p_type];
                if (ce) {
                    return ce.unsubscribe(p_fn, p_obj);
                }
            } else {
                var ret = true;
                for (var i in evts) {
                    if (Y.object.owns(evts, i)) {
                        ret = ret && evts[i].unsubscribe(p_fn, p_obj);
                    }
                }
                return ret;
            }

            return false;
        },
        
        /**
         * Removes all listeners from the specified event.  If the event type
         * is not specified, all listeners from all hosted custom events will
         * be removed.
         * @method unsubscribeAll
         * @param p_type {string}   The type, or name of the event
         */
        unsubscribeAll: function(p_type) {
            return this.unsubscribe(p_type);
        },

        /**
         * Creates a new custom event of the specified type.  If a custom event
         * by that name already exists, it will not be re-created.  In either
         * case the custom event is returned. 
         *
         * @method publish
         *
         * @param p_type {string} the type, or name of the event
         * @param p_config {object} optional config params.  Valid properties are:
         *
         *  <ul>
         *    <li>
         *      context: defines the default execution context.  If not defined
         *      the default context will be this instance.
         *    </li>
         *    <li>
         *      silent: if true, the custom event will not generate log messages.
         *      This is false by default.
         *    </li>
         *    <li>
         *      onSubscribeCallback: specifies a callback to execute when the
         *      event has a new subscriber.  This will fire immediately for
         *      each queued subscriber if any exist prior to the creation of
         *      the event.
         *    </li>
         *  </ul>
         *
         *  @return {Event.Custom} the custom event
         *
         */
        publish: function(p_type, p_config) {

            this.__yui_events = this.__yui_events || {};
            var opts = p_config || {};
            var events = this.__yui_events;

            if (events[p_type]) {
Y.log("Event.Target publish skipped: '"+p_type+"' already exists");
            } else {

                var context  = opts.context  || this;
                var silent = (opts.silent);

                var ce = new Y.CustomEvent(p_type, context, silent,
                        Y.Event.Custom.FLAT);
                events[p_type] = ce;

                if (opts.onSubscribeCallback) {
                    ce.subscribeEvent.subscribe(opts.onSubscribeCallback);
                }

                this.__yui_subscribers = this.__yui_subscribers || {};
                var qs = this.__yui_subscribers[p_type];

                if (qs) {
                    for (var i=0; i<qs.length; ++i) {
                        ce.subscribe(qs[i].fn, qs[i].obj, qs[i].override);
                    }
                }
            }

            return events[p_type];
        },


       /**
         * Fire a custom event by name.  The callback functions will be executed
         * from the context specified when the event was created, and with the 
         * following parameters:
         *   <ul>
         *   <li>The first argument fire() was executed with</li>
         *   <li>The custom object (if any) that was passed into the subscribe() 
         *       method</li>
         *   </ul>
         * If the custom event has not been explicitly created, it will be
         * created now with the default config, context to the host object
         * @method fireEvent
         * @param p_type    {string}  the type, or name of the event
         * @param arguments {Object*} an arbitrary set of parameters to pass to 
         *                            the handler.
         * @return {boolean} the return value from Event.Custom.fire
         *                   
         */
        fire: function(p_type, arg1, arg2, etc) {

            this.__yui_events = this.__yui_events || {};
            var ce = this.__yui_events[p_type];

            if (!ce) {
// Y.log(p_type + "event fired before it was created.");
                // return null;
                ce = this.publish(p_type);
            }

            var args = [];
            for (var i=1; i<arguments.length; ++i) {
                args.push(arguments[i]);
            }
            return ce.fire.apply(ce, args);
        },

        /**
         * Returns true if the custom event of the provided type has been created
         * with publish.
         * @method hasEvent
         * @param type {string} the type, or name of the event
         */
        hasEvent: function(type) {
            if (this.__yui_events) {
                if (this.__yui_events[type]) {
                    return true;
                }
            }
            return false;
        },

        /**
         * Executes the callback before the given event or
         * method hosted on this object.
         *
         * The signature differs based upon the type of
         * item that is being wrapped.
         *
         * Custom Event: type, callback, context, 1-n additional arguments
         * to append to the callback's argument list.
         *
         * Method: callback, object, methodName, context, 1-n additional 
         * arguments to append to the callback's argument list.
         *
         * @method before
         * @return the detach handle
         */
        before: function() {

            var a = Y.array(arguments, 0, true);

            // insert this object as method target
            a.splice(1, 0, this);

            // Y.log('ET:before- ' + Y.lang.dump(a));

            return Y.before.apply(Y, a);
        },

        /**
         * Executes the callback after the given event or
         * method hosted on this object.
         *
         * The signature differs based upon the type of
         * item that is being wrapped.
         *
         * Custom Event: type, callback, context, 1-n additional arguments
         * to append to the callback's argument list.
         *
         * Method: callback, object, methodName, context, 1-n additional 
         * arguments to append to the callback's argument list.
         *
         * @method after
         * @return the detach handle
         */
        after: function() {
            var a = Y.array(arguments, 0, true);
            a.splice(1, 0, this);
            return Y.after.apply(Y, a);
        }

    };

    Y.mix(Y, Y.Event.Target.prototype);

}, "3.0.0");
YUI.add("event-facade", function(Y) {

    var whitelist = {
        "altKey"          : 1,
        "button"          : 1, // we supply
        "bubbles"         : 1,
        "cancelable"      : 1,
        "charCode"        : 1, // we supply
        "cancelBubble"    : 1,
        "currentTarget"   : 1,
        "ctrlKey"         : 1,
        "clientX"         : 1,
        "clientY"         : 1,
        "detail"          : 1, // not fully implemented
        // "fromElement"     : 1,
        "keyCode"         : 1,
        "height"          : 1,
        "initEvent"       : 1, // need the init events?
        "initMouseEvent"  : 1,
        "initUIEvent"     : 1,
        "layerX"          : 1,
        "layerY"          : 1,
        "metaKey"         : 1,
        "modifiers"       : 1,
        "offsetX"         : 1,
        "offsetY"         : 1,
        "preventDefault"  : 1, // we supply
        // "reason"          : 1, // IE proprietary
        // "relatedTarget"   : 1,
        "returnValue"     : 1,
        "shiftKey"        : 1,
        // "srcUrn"          : 1, // IE proprietary
        // "srcElement"      : 1,
        // "srcFilter"       : 1, IE proprietary
        "stopPropagation" : 1, // we supply
        // "target"          : 1,
        "timeStamp"       : 1,
        // "toElement"       : 1,
        "type"            : 1,
        // "view"            : 1,
        "which"           : 1, // we supply
        "width"           : 1,
        "x"               : 1,
        "y"               : 1
    };

    var webkitKeymap = {
        63232: 38, // up
        63233: 40, // down
        63234: 37, // left
        63235: 39, // right
        63276: 33, // page up
        63277: 34, // page down
        25: 9      // SHIFT-TAB (Safari provides a different key code in
                   // this case, even though the shiftKey modifier is set)
    };

    // return the element facade
    var wrapNode = function(n) {
        return n;
    };

    var resolve = function(n) {
        try {
        if (n && 3 == n.nodeType) {
            n = n.parentNode;
        } 
        } catch(ex) { }

        return wrapNode(n);
    };

    var ua = Y.ua;

    // provide a single event with browser abstractions resolved
    //
    // include all properties for both browers?
    // include only DOM2 spec properties?
    // provide browser-specific facade?
    Y.Event.Facade = function(ev, origTarg) {

        // @TODO the document should be the target's owner document

        var e = ev, ot = origTarg, d = document, b = d.body,
            x = e.pageX, y = e.pageY;

        for (var i in whitelist) {
            if (Y.object.owns(whitelist, i)) {
                this[i] = e[i];
            }
        }

        //////////////////////////////////////////////////////
        // pageX pageY

        if (!x && 0 !== x) {
            x = e.clientX || 0;
            y = e.clientX || 0;

            if (ua.ie) {
                x += b.scrollLeft;
                y += b.scrollTop;
            }
        }

        this.pageX = x;
        this.pageY = y;

        //////////////////////////////////////////////////////
        // keyCode

        var c = e.keyCode || e.charCode || 0;

        if (ua.webkit && (c in webkitKeymap)) {
            c = webkitKeymap[c];
        }

        this.keyCode = c;
        this.charCode = c;

        //////////////////////////////////////////////////////
        // time

        this.time = e.time || new Date().getTime();

        //////////////////////////////////////////////////////
        // targets
        
        this.target = resolve(e.target || e.srcElement);
        this.originalTarget = resolve(e.originalTarget || ot);

        var t = e.relatedTarget;
        if (!t) {
            if (e.type == "mouseout") {
                t = e.toElement;
            } else if (e.type == "mouseover") {
                t = e.fromElement;
            }
        }

        this.relatedTarget = resolve(t);
        
        //////////////////////////////////////////////////////
        // methods

        this.stopPropagation = function() {
            if (e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
        };

        this.preventDefault = function() {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
        };

        // stop event
        this.halt = function() {
            this.stopPropagation();
            this.preventDefault();
        };

    };

}, "3.0.0");
YUI.add("event-ready", function(Y) {

    var E = Y.Event;

    E.Custom = Y.CustomEvent;
    E.Subscriber = Y.Subscriber;

    /**
     * Y.Event.on is an alias for addListener
     * @method on
     * @see addListener
     * @static
     */
    E.attach = function(type, fn, el, data, context) {
        return E.addListener(el, type, fn, data, context);
    };

    E.detach = function(type, fn, el, data, context) {
        return E.removeListener(el, type, fn, data, context);
    };

    // only execute DOMReady once
    if (Y !== YUI) {
        YUI.Event.onDOMReady(E._ready);
    } else {


        /////////////////////////////////////////////////////////////
        // DOMReady
        // based on work by: Dean Edwards/John Resig/Matthias Miller 

        // Internet Explorer: use the readyState of a defered script.
        // This isolates what appears to be a safe moment to manipulate
        // the DOM prior to when the document's readyState suggests
        // it is safe to do so.
        if (Y.ua.ie) {

            // Process onAvailable/onContentReady items when when the 
            // DOM is ready.
            Y.Event.onDOMReady(
                    Y.Event._tryPreloadAttach,
                    Y.Event, true);

            E._dri = setInterval(function() {
                var n = document.createElement('p');  
                try {
                    // throws an error if doc is not ready
                    n.doScroll('left');
                    clearInterval(E._dri);
                    E._dri = null;
                    E._ready();
                    n = null;
                } catch (ex) { 
                    n = null;
                }
            }, E.POLL_INTERVAL); 

        
        // The document's readyState in Safari currently will
        // change to loaded/complete before images are loaded.
        } else if (Y.ua.webkit && Y.ua.webkit < 525) {

            E._dri = setInterval(function() {
                var rs=document.readyState;
                if ("loaded" == rs || "complete" == rs) {
                    clearInterval(E._dri);
                    E._dri = null;
                    E._ready();
                }
            }, E.POLL_INTERVAL); 

        // FireFox and Opera: These browsers provide a event for this
        // moment.  The latest WebKit releases now support this event.
        } else {

            E._simpleAdd(document, "DOMContentLoaded", E._ready);

        }
        /////////////////////////////////////////////////////////////

        E._tryPreloadAttach();
    }

    // for the moment each instance will get its own load/unload listeners
    E._simpleAdd(window, "load", E._load);
    E._simpleAdd(window, "unload", E._unload);

}, "3.0.0");
/**
 * The dom module provides helper methods for manipulating Dom elements.
 * @module dom
 */

YUI.add("domcore", function(Y) {

    var id_counter = 0,     // for use with generateId
        reClassNameCache = {},          // cache regexes for className
        document = Y.config.doc;     // cache for faster lookups


    var getClassRegEx = function(className) {
        var re = reClassNameCache[className];
        if (!re) {
            re = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
            reClassNameCache[className] = re;
        }
        return re;
    };
    
    /**
     * Provides helper methods for DOM elements.
     * @class Dom
     */
    Y.Dom = {
        /**
         * Returns an HTMLElement reference.
         * @method get
         * @param {String | HTMLElement |Array} el Accepts a string to use as an ID for getting a DOM reference, an actual DOM reference, or an Array of IDs and/or HTMLElements.
         * @return {HTMLElement | Array} A DOM reference to an HTML element or an array of HTMLElements.
         */
        get: function(el) {
            if (el && (el.nodeType || el.item)) { // Node, or NodeList
                return el;
            }

            if (Y.lang.isString(el) || !el) { // id or null
                return document.getElementById(el);
            }
            
            if (el.length !== undefined) { // array-like 
                var c = [];
                for (var i = 0, len = el.length; i < len; ++i) {
                    c[c.length] = Y.Dom.get(el[i]);
                }
                
                return c;
            }

            return el; // some other object, just pass it back
        },

        /**
         * Determines whether an HTMLElement has the given className.
         * @method hasClass
         * @param {String | HTMLElement | Array} el The element or collection to test
         * @param {String} className the class name to search for
         * @return {Boolean | Array} A boolean value or array of boolean values
         */
        hasClass: function(el, className) {
            var re = getClassRegEx(className);

            var f = function(el) {
                Y.log('hasClass returning ' + re.test(el.className), 'info', 'Dom');
                return re.test(el.className);
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
    
        /**
         * Adds a class name to a given element or collection of elements.
         * @method addClass         
         * @param {String | HTMLElement | Array} el The element or collection to add the class to
         * @param {String} className the class name to add to the class attribute
         * @return {Boolean | Array} A pass/fail boolean or array of booleans
         */
        addClass: function(el, className) {
            var f = function(el) {
                if (this.hasClass(el, className)) {
                    return false; // already present
                }
                
                Y.log('addClass adding ' + className, 'info', 'Dom');
                
                el.className = Y.lang.trim([el.className, className].join(' '));
                return true;
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
    
        /**
         * Removes a class name from a given element or collection of elements.
         * @method removeClass         
         * @param {String | HTMLElement | Array} el The element or collection to remove the class from
         * @param {String} className the class name to remove from the class attribute
         * @return {Boolean | Array} A pass/fail boolean or array of booleans
         */
        removeClass: function(el, className) {
            var re = getClassRegEx(className);
            
            var f = function(el) {
                if (!className || !this.hasClass(el, className)) {
                    return false; // not present
                }                 

                Y.log('removeClass removing ' + className, 'info', 'Dom');
                
                var c = el.className;
                el.className = c.replace(re, ' ');
                if ( this.hasClass(el, className) ) { // in case of multiple adjacent
                    this.removeClass(el, className);
                }

                el.className = Y.lang.trim(el.className); // remove any trailing spaces
                return true;
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Replace a class with another class for a given element or collection of elements.
         * If no oldClassName is present, the newClassName is simply added.
         * @method replaceClass  
         * @param {String | HTMLElement | Array} el The element or collection to remove the class from
         * @param {String} oldClassName the class name to be replaced
         * @param {String} newClassName the class name that will be replacing the old class name
         * @return {Boolean | Array} A pass/fail boolean or array of booleans
         */
        replaceClass: function(el, oldClassName, newClassName) {
            if (!newClassName || oldClassName === newClassName) { // avoid infinite loop
                return false;
            }
            
            var re = getClassRegEx(oldClassName);

            var f = function(el) {
                Y.log('replaceClass replacing ' + oldClassName + ' with ' + newClassName, 'info', 'Dom');
            
                if ( !this.hasClass(el, oldClassName) ) {
                    this.addClass(el, newClassName); // just add it if nothing to replace
                    return true; // NOTE: return
                }
            
                el.className = el.className.replace(re, ' ' + newClassName + ' ');

                if ( this.hasClass(el, oldClassName) ) { // in case of multiple adjacent
                    this.replaceClass(el, oldClassName, newClassName);
                }

                el.className = Y.lang.trim(el.className); // remove any trailing spaces
                return true;
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Returns an ID and applies it to the element "el", if provided.
         * @method generateId  
         * @param {String | HTMLElement | Array} el (optional) An optional element array of elements to add an ID to (no ID is added if one is already present).
         * @param {String} prefix (optional) an optional prefix to use (defaults to "yui-gen").
         * @return {String | Array} The generated ID, or array of generated IDs (or original ID if already present on an element)
         */
        generateId: function(el, prefix) {
            prefix = prefix || 'yui-gen';

            var f = function(el) {
                if (el && el.id) { // do not override existing ID
                    Y.log('generateId returning existing id ' + el.id, 'info', 'Dom');
                    return el.id;
                } 

                var id = prefix + id_counter++;
                Y.log('generateId generating ' + id, 'info', 'Dom');

                if (el) {
                    el.id = id;
                }
                
                return id;
            };

            // batch fails when no element, so just generate and return single ID
            return Y.Dom.batch(el, f, Y.Dom, true) || f.apply(Y.Dom, arguments);
        },

        /**
         * Returns a array of HTMLElements that pass the test applied by supplied boolean method.
         * For optimized performance, include a tag and/or root node when possible.
         * @method getElementsBy
         * @param {Function} method - A boolean method for testing elements which receives the element as its only argument.
         * @param {String} tag (optional) The tag name of the elements being collected
         * @param {String | HTMLElement} root (optional) The HTMLElement or an ID to use as the starting point 
         * @param {Function} apply (optional) A function to apply to each element when found 
         * @return {Array} Array of HTMLElements
         */
        getElementsBy: function(method, tag, root, apply) {
            tag = tag || '*';
            root = (root) ? Y.Dom.get(root) : null || document; 

            if (!root) {
                return [];
            }

            var nodes = [],
                elements = root.getElementsByTagName(tag);
            
            for (var i = 0, len = elements.length; i < len; ++i) {
                if ( method(elements[i]) ) {
                    nodes[nodes.length] = elements[i];
                    if (apply) {
                        apply(elements[i]);
                    }
                }
            }

            Y.log('getElementsBy returning ' + nodes, 'info', 'Dom');
            
            return nodes;
        },
        
        /**
         * Runs the supplied method against each item in the Collection/Array.
         * The method is called with the element(s) as the first arg, and the optional param as the second ( method(el, o) ).
         * @method batch
         * @param {String | HTMLElement | Array} el (optional) An element or array of elements to apply the method to
         * @param {Function} method The method to apply to the element(s)
         * @param {Any} o (optional) An optional arg that is passed to the supplied method
         * @param {Boolean} override (optional) Whether or not to override the scope of "method" with "o"
         * @return {Any | Array} The return value(s) from the supplied method
         */
        batch: function(el, method, o, override) {
            el = (el && (el.tagName || el.item)) ? el : Y.Dom.get(el); // skip get() when possible

            if (!el || !method) {
                Y.log('batch failed: invalid arguments', 'error', 'Dom');
                return false;
            } 
            var scope = (override) ? o : window;
            
            if (el.tagName || el.length === undefined) { // element or not array-like 
                return method.call(scope, el, o);
            } 

            var collection = [];
            
            for (var i = 0, len = el.length; i < len; ++i) {
                collection[collection.length] = method.call(scope, el[i], o);
            }
            
            return collection;
        }
    };

}, "3.0.0");

YUI.add("region", function(Y) {

    /**
     * A region is a representation of an object on a grid.  It is defined
     * by the top, right, bottom, left extents, so is rectangular by default.  If 
     * other shapes are required, this class could be extended to support it.
     * @class Region
     * @param {Int} t the top extent
     * @param {Int} r the right extent
     * @param {Int} b the bottom extent
     * @param {Int} l the left extent
     * @constructor
     */
    Y.Region = function(t, r, b, l) {

        /**
         * The region's top extent
         * @property top
         * @type Int
         */
        this.top = t;
        
        /**
         * The region's top extent as index, for symmetry with set/getXY
         * @property 1
         * @type Int
         */
        this[1] = t;

        /**
         * The region's right extent
         * @property right
         * @type int
         */
        this.right = r;

        /**
         * The region's bottom extent
         * @property bottom
         * @type Int
         */
        this.bottom = b;

        /**
         * The region's left extent
         * @property left
         * @type Int
         */
        this.left = l;
        
        /**
         * The region's left extent as index, for symmetry with set/getXY
         * @property 0
         * @type Int
         */
        this[0] = l;
    };

    /**
     * Returns true if this region contains the region passed in
     * @method contains
     * @param  {Region}  region The region to evaluate
     * @return {Boolean}        True if the region is contained with this region, 
     *                          else false
     */
    Y.Region.prototype.contains = function(region) {
        return ( region.left   >= this.left   && 
                 region.right  <= this.right  && 
                 region.top    >= this.top    && 
                 region.bottom <= this.bottom    );

        // this.logger.debug("does " + this + " contain " + region + " ... " + ret);
    };

    /**
     * Returns the area of the region
     * @method getArea
     * @return {Int} the region's area
     */
    Y.Region.prototype.getArea = function() {
        return ( (this.bottom - this.top) * (this.right - this.left) );
    };

    /**
     * Returns the region where the passed in region overlaps with this one
     * @method intersect
     * @param  {Region} region The region that intersects
     * @return {Region}        The overlap region, or null if there is no overlap
     */
    Y.Region.prototype.intersect = function(region) {
        var t = Math.max( this.top,    region.top    );
        var r = Math.min( this.right,  region.right  );
        var b = Math.min( this.bottom, region.bottom );
        var l = Math.max( this.left,   region.left   );
        
        if (b >= t && r >= l) {
            return new Y.Region(t, r, b, l);
        } else {
            return null;
        }
    };

    /**
     * Returns the region representing the smallest region that can contain both
     * the passed in region and this region.
     * @method union
     * @param  {Region} region The region that to create the union with
     * @return {Region}        The union region
     */
    Y.Region.prototype.union = function(region) {
        var t = Math.min( this.top,    region.top    );
        var r = Math.max( this.right,  region.right  );
        var b = Math.max( this.bottom, region.bottom );
        var l = Math.min( this.left,   region.left   );

        return new Y.Region(t, r, b, l);
    };

    /**
     * toString
     * @method toString
     * @return string the region properties
     */
    Y.Region.prototype.toString = function() {
        return ( "Region {"    +
                 "top: "       + this.top    + 
                 ", right: "   + this.right  + 
                 ", bottom: "  + this.bottom + 
                 ", left: "    + this.left   + 
                 "}" );
    };

    /**
     * Returns a region that is occupied by the DOM element
     * @method getRegion
     * @param  {HTMLElement} el The element
     * @return {Region}         The region that the element occupies
     * @static
     */
    Y.Region.getRegion = function(el) {
        var p = Y.Dom.getXY(el);

        var t = p[1];
        var r = p[0] + el.offsetWidth;
        var b = p[1] + el.offsetHeight;
        var l = p[0];

        return new Y.Region(t, r, b, l);
    };

    /////////////////////////////////////////////////////////////////////////////


    /**
     * A point is a region that is special in that it represents a single point on 
     * the grid.
     * @namespace YAHOO.util
     * @class Point
     * @param {Int} x The X position of the point
     * @param {Int} y The Y position of the point
     * @constructor
     * @extends Y.Region
     */
    Y.Point = function(x, y) {
       if (YAHOO.lang.isArray(x)) { // accept input from Dom.getXY, Event.getXY, etc.
          y = x[1]; // dont blow away x yet
          x = x[0];
       }
       
        /**
         * The X position of the point, which is also the right, left and index zero (for Dom.getXY symmetry)
         * @property x
         * @type Int
         */

        this.x = this.right = this.left = this[0] = x;
         
        /**
         * The Y position of the point, which is also the top, bottom and index one (for Dom.getXY symmetry)
         * @property y
         * @type Int
         */
        this.y = this.top = this.bottom = this[1] = y;
    };

    Y.extend(Y.Point, Y.Region);

}, "3.0.0");


YUI.add("screen", function(Y) {

    var Dom = Y.Dom,
        document = Y.config.doc;     // cache for faster lookups
    
    // brower detection
    var isOpera = Y.ua.opera,
        isSafari = Y.ua.webkit, 
        isGecko = Y.ua.gecko,
        isIE = Y.ua.ie; 
    
    // regex cache
    var patterns = {
        ROOT_TAG: /^body|html$/i // body for quirks mode, html for standards
    };

    var getXY = function() {
        if (document.documentElement.getBoundingClientRect) { // IE
            return function(el) {
                var box = el.getBoundingClientRect();

                var rootNode = el.ownerDocument;
                return [box.left + Y.Dom.getDocumentScrollLeft(rootNode), box.top +
                        Y.Dom.getDocumentScrollTop(rootNode)];
            };
        } else {
            return function(el) { // manually calculate by crawling up offsetParents
                var pos = [el.offsetLeft, el.offsetTop];
                var parentNode = el.offsetParent;

                // safari: subtract body offsets if el is abs (or any offsetParent), unless body is offsetParent
                var accountForBody = (isSafari &&
                        Y.Dom.getStyle(el, 'position') == 'absolute' &&
                        el.offsetParent == el.ownerDocument.body);

                if (parentNode != el) {
                    while (parentNode) {
                        pos[0] += parentNode.offsetLeft;
                        pos[1] += parentNode.offsetTop;
                        if (!accountForBody && isSafari && 
                                Y.Dom.getStyle(parentNode,'position') == 'absolute' ) { 
                            accountForBody = true;
                        }
                        parentNode = parentNode.offsetParent;
                    }
                }

                if (accountForBody) { //safari doubles in this case
                    pos[0] -= el.ownerDocument.body.offsetLeft;
                    pos[1] -= el.ownerDocument.body.offsetTop;
                } 
                parentNode = el.parentNode;

                // account for any scrolled ancestors
                while ( parentNode.tagName && !patterns.ROOT_TAG.test(parentNode.tagName) ) 
                {
                   // work around opera inline/table scrollLeft/Top bug
                   if (Y.Dom.getStyle(parentNode, 'display').search(/^inline|table-row.*$/i)) { 
                        pos[0] -= parentNode.scrollLeft;
                        pos[1] -= parentNode.scrollTop;
                    }
                    
                    parentNode = parentNode.parentNode; 
                }

                return pos;
            };
        }
    }(); // NOTE: Executing for loadtime branching

    Dom.getXY = function(el) {
        var f = function(el) {
            // has to be part of document to have pageXY
            if ( (el.parentNode === null || el.offsetParent === null ||
                    this.getStyle(el, 'display') == 'none') && el != el.ownerDocument.body) {
                Y.log('getXY failed: element not available', 'error', 'Dom');
                return false;
            }
            
            Y.log('getXY returning ' + getXY(el), 'info', 'Dom');
            return getXY(el);
        };
        
        return Y.Dom.batch(el, f, Y.Dom, true);
    };
        
    Dom.getX = function(el) {
        var f = function(el) {
            return Y.Dom.getXY(el)[0];
        };
        
        return Y.Dom.batch(el, f, Y.Dom, true);
    };
        
    Dom.getY = function(el) {
        var f = function(el) {
            return Y.Dom.getXY(el)[1];
        };
        
        return Y.Dom.batch(el, f, Y.Dom, true);
    };
        
    Dom.setXY = function(el, pos, noRetry) {
        var f = function(el) {
            var style_pos = this.getStyle(el, 'position');
            if (style_pos == 'static') { // default to relative
                this.setStyle(el, 'position', 'relative');
                style_pos = 'relative';
            }

            var pageXY = this.getXY(el);
            if (pageXY === false) { // has to be part of doc to have pageXY
                Y.log('setXY failed: element not available', 'error', 'Dom');
                return false; 
            }
            
            var delta = [ // assuming pixels; if not we will have to retry
                parseInt( this.getStyle(el, 'left'), 10 ),
                parseInt( this.getStyle(el, 'top'), 10 )
            ];
        
            if ( isNaN(delta[0]) ) {// in case of 'auto'
                delta[0] = (style_pos == 'relative') ? 0 : el.offsetLeft;
            } 
            if ( isNaN(delta[1]) ) { // in case of 'auto'
                delta[1] = (style_pos == 'relative') ? 0 : el.offsetTop;
            } 
    
            if (pos[0] !== null) { el.style.left = pos[0] - pageXY[0] + delta[0] + 'px'; }
            if (pos[1] !== null) { el.style.top = pos[1] - pageXY[1] + delta[1] + 'px'; }
          
            if (!noRetry) {
                var newXY = this.getXY(el);

                // if retry is true, try one more time if we miss 
               if ( (pos[0] !== null && newXY[0] != pos[0]) || 
                    (pos[1] !== null && newXY[1] != pos[1]) ) {
                   this.setXY(el, pos, true);
               }
            }        
    
            Y.log('setXY setting position to ' + pos, 'info', 'Dom');
        };
        
        Y.Dom.batch(el, f, Y.Dom, true);
    };
        
    Dom.setX = function(el, x) {
        Y.Dom.setXY(el, [x, null]);
    };
    
    Dom.setY = function(el, y) {
        Y.Dom.setXY(el, [null, y]);
    };
        
    Dom.getRegion = function(el) {
        var f = function(el) {
            if ( (el.parentNode === null || el.offsetParent === null ||
                    this.getStyle(el, 'display') == 'none') && el != document.body) {
                Y.log('getRegion failed: element not available', 'error', 'Dom');
                return false;
            }

            var region = Y.Region.getRegion(el);
            Y.log('getRegion returning ' + region, 'info', 'Dom');
            return region;
        };
        
        return Y.Dom.batch(el, f, Y.Dom, true);
    };
        
    /**
     * Returns the width of the client (viewport).
     * @method getClientWidth
     * @deprecated Now using getViewportWidth.  This interface left intact for back compat.
     * @return {Int} The width of the viewable area of the page.
     */
    Dom.getClientWidth = function() {
        return Y.Dom.getViewportWidth();
    };
    
    /**
     * Returns the height of the client (viewport).
     * @method getClientHeight
     * @deprecated Now using getViewportHeight.  This interface left intact for back compat.
     * @return {Int} The height of the viewable area of the page.
     */
    Dom.getClientHeight = function() {
        return Y.Dom.getViewportHeight();
    };
    
    Dom.getDocumentHeight = function() {
        var scrollHeight = (document.compatMode != 'CSS1Compat') ? document.body.scrollHeight : document.documentElement.scrollHeight;

        var h = Math.max(scrollHeight, Y.Dom.getViewportHeight());
        Y.log('getDocumentHeight returning ' + h, 'info', 'Dom');
        return h;
    };
    
    Dom.getDocumentWidth = function() {
        var scrollWidth = (document.compatMode != 'CSS1Compat') ? document.body.scrollWidth : document.documentElement.scrollWidth;
        var w = Math.max(scrollWidth, Y.Dom.getViewportWidth());
        Y.log('getDocumentWidth returning ' + w, 'info', 'Dom');
        return w;
    };

    Dom.getViewportHeight = function() {
        var height = self.innerHeight; // Safari, Opera
        var mode = document.compatMode;
    
        if ( (mode || isIE) && !isOpera ) { // IE, Gecko
            height = (mode == 'CSS1Compat') ?
                    document.documentElement.clientHeight : // Standards
                    document.body.clientHeight; // Quirks
        }
    
        Y.log('getViewportHeight returning ' + height, 'info', 'Dom');
        return height;
    };
    
    Dom.getViewportWidth = function() {
        var width = self.innerWidth;  // Safari
        var mode = document.compatMode;
        
        if (mode || isIE) { // IE, Gecko, Opera
            width = (mode == 'CSS1Compat') ?
                    document.documentElement.clientWidth : // Standards
                    document.body.clientWidth; // Quirks
        }
        Y.log('getViewportWidth returning ' + width, 'info', 'Dom');
        return width;
    };
 
    Dom.getDocumentScrollLeft = function(doc) {
        doc = doc || document;
        return Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
    };

    Dom.getDocumentScrollTop = function(doc) {
        doc = doc || document;
        return Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);
    };

    /**
     * Creates a Region based on the viewport relative to the document. 
     * @method getClientRegion
     * @return {Region} A Region object representing the viewport which accounts for document scroll
     */
    Dom.getClientRegion = function() {
        var t = Y.Dom.getDocumentScrollTop(),
            l = Y.Dom.getDocumentScrollLeft(),
            r = Y.Dom.getViewportWidth() + l,
            b = Y.Dom.getViewportHeight() + t;

        return new Y.Region(t, r, b, l);
    };
    

    /**
     * Provides helper methods for positioning and managing viewport 
     * @namespace YAHOO.util
     * @class Screen
     */
    Y.Screen = {
        /**
         * Set the position of an html element in page coordinates, regardless of how the element is positioned.
         * The element(s) must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method setXY
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements
         * @param {Array} pos Contains X & Y values for new position (coordinates are page-based)
         * @param {Boolean} noRetry By default we try and set the position a second time if the first fails
         */
        setXY: Y.Dom.setXY,
        /**
         * Gets the current position of an element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method getXY
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements
         * @return {Array} The XY position of the element(s)
         */
        getXY: Y.Dom.getXY,
        /**
         * Set the X position of an html element in page coordinates, regardless of how the element is positioned.
         * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method setX
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
         * @param {Int} x The value to use as the X coordinate for the element(s).
         */
        setX: Y.Dom.setX,
        /**
         * Gets the current X position of an element based on page coordinates.  The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method getX
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements
         * @return {Number | Array} The X position of the element(s)
         */
        getX: Y.Dom.getX,
        /**
         * Set the Y position of an html element in page coordinates, regardless of how the element is positioned.
         * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method setY
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
         * @param {Int} x To use as the Y coordinate for the element(s).
         */
        setY: Y.Dom.setY,
        /**
         * Gets the current Y position of an element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method getY
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements
         * @return {Number | Array} The Y position of the element(s)
         */
        getY: Y.Dom.getY,
        /**
         * Returns the region position of the given element.
         * The element must be part of the DOM tree to have a region (display:none or elements not appended return false).
         * @method getRegion
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
         * @return {Region | Array} A Region or array of Region instances containing "top, left, bottom, right" member data.
         */
        getRegion: Y.Dom.getRegion,
        getClientRegion: Y.Dom.getClientRegion,
        /**
         * Returns the current height of the viewport.
         * @method getViewportWidth
         * @return {Int} The height of the viewable area of the page (excludes scrollbars).
         */
        getViewportWidth: Y.Dom.getViewportWidth,
        /**
         * Returns the current height of the viewport.
         * @method getViewportHeight
         * @return {Int} The height of the viewable area of the page (excludes scrollbars).
         */
        getViewportHeight: Y.Dom.getViewportHeight,
        /**
         * Returns the width of the document.
         * @method getDocumentWidth
         * @return {Int} The width of the actual document (which includes the body and its margin).
         */
        getDocumentWidth: Y.Dom.getDocumentWidth,
        /**
         * Returns the height of the document.
         * @method getDocumentHeight
         * @return {Int} The height of the actual document (which includes the body and its margin).
         */
        getDocumentHeight: Y.Dom.getDocumentHeight,
        /**
         * Returns the top scroll value of the document 
         * @method getDocumentScrollTop
         * @param {HTMLDocument} document (optional) The document to get the scroll value of
         * @return {Int}  The amount that the document is scrolled to the top
         */
        getDocumentScrollTop: Y.Dom.getDocumentScrollTop,
        /**
         * Returns the left scroll value of the document 
         * @method getDocumentScrollLeft
         * @param {HTMLDocument} document (optional) The document to get the scroll value of
         * @return {Int}  The amount that the document is scrolled to the left
         */
        getDocumentScrollLeft: Y.Dom.getDocumentScrollLeft
    };

}, "3.0.0");


YUI.add("style", function(Y) {

    var getStyle,           // for load time browser branching
        setStyle,           // ditto
        propertyCache = {}, // for faster hyphen converts
        document = Y.config.doc;     // cache for faster lookups
    
    // brower detection
    var isOpera = Y.ua.opera,
        isSafari = Y.ua.webkit, 
        isGecko = Y.ua.gecko,
        isIE = Y.ua.ie; 
    
    // regex cache
    var patterns = {
        HYPHEN: /(-[a-z])/i // to normalize get/setStyle
    };

    var toCamel = function(property) {
        if ( !patterns.HYPHEN.test(property) ) {
            return property; // no hyphens
        }
        
        if (propertyCache[property]) { // already converted
            return propertyCache[property];
        }
       
        var converted = property;
 
        while( patterns.HYPHEN.exec(converted) ) {
            converted = converted.replace(RegExp.$1,
                    RegExp.$1.substr(1).toUpperCase());
        }
        
        propertyCache[property] = converted;
        return converted;
        //return property.replace(/-([a-z])/gi, function(m0, m1) {return m1.toUpperCase()}) // cant use function as 2nd arg yet due to safari bug
    };
    
    // branching at load instead of runtime
    if (document.defaultView && document.defaultView.getComputedStyle) { // W3C DOM method
        getStyle = function(el, property) {
            var value = null;
            
            if (property == 'float') { // fix reserved word
                property = 'cssFloat';
            }

            var computed = document.defaultView.getComputedStyle(el, '');
            if (computed) { // test computed before touching for safari
                value = computed[toCamel(property)];
            }
            
            return el.style[property] || value;
        };
    } else if (document.documentElement.currentStyle && isIE) { // IE method
        getStyle = function(el, property) {                         
            switch( toCamel(property) ) {
                case 'opacity' :// IE opacity uses filter
                    var val = 100;
                    try { // will error if no DXImageTransform
                        val = el.filters['DXImageTransform.Microsoft.Alpha'].opacity;

                    } catch(e) {
                        try { // make sure its in the document
                            val = el.filters('alpha').opacity;
                        } catch(ex) {
                            Y.log('getStyle: IE filter failed',
                                    'error', 'Dom');
                        }
                    }
                    return val / 100;
                case 'float': // fix reserved word
                    property = 'styleFloat'; // fall through
                default: 
                    // test currentStyle before touching
                    var value = el.currentStyle ? el.currentStyle[property] : null;
                    return ( el.style[property] || value );
            }
        };
    } else { // default to inline only
        getStyle = function(el, property) { return el.style[property]; };
    }
    
    if (isIE) {
        setStyle = function(el, property, val) {
            switch (property) {
                case 'opacity':
                    if ( Y.lang.isString(el.style.filter) ) { // in case not appended
                        el.style.filter = 'alpha(opacity=' + val * 100 + ')';
                        
                        if (!el.currentStyle || !el.currentStyle.hasLayout) {
                            el.style.zoom = 1; // when no layout or cant tell
                        }
                    }
                    break;
                case 'float':
                    property = 'styleFloat';
                default:
                el.style[property] = val;
            }
        };
    } else {
        setStyle = function(el, property, val) {
            if (property == 'float') {
                property = 'cssFloat';
            }
            el.style[property] = val;
        };
    }

    Y.Dom.getStyle = function(el, property) {
        property = toCamel(property);
        
        var f = function(element) {
            return getStyle(element, property);
        };
        
        return Y.Dom.batch(el, f, Y.Dom, true);
    };
    
     Y.Dom.setStyle = function(el, property, val) {
        property = toCamel(property);
        
        var f = function(element) {
            setStyle(element, property, val);
            Y.log('setStyle setting ' + property + ' to ' + val, 'info', 'Dom');
            
        };
        
        Y.Dom.batch(el, f, Y.Dom, true);
    };

    
    /**
     * Provides helper methods for styling DOM elements.
     * @namespace YAHOO.util
     * @class Style
     */
    Y.Style = {
        /**
         * Normalizes currentStyle and ComputedStyle.
         * @method get
         * @param {String | HTMLElement |Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
         * @param {String} property The style property whose value is returned.
         * @return {String | Array} The current value of the style property for the element(s).
         */
        get: Y.Dom.getStyle,
        /**
         * Wrapper for setting style properties of HTMLElements.  Normalizes "opacity" across modern browsers.
         * @method set
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
         * @param {String} property The style property to be set.
         * @param {String} val The value to apply to the given property.
         */
        set: Y.Dom.setStyle
    };
}, "3.0.0");



YUI.add("domextras", function(Y) {

    var Dom = Y.Dom,
        id_counter = 0,     // for use with generateId
        reClassNameCache = {},          // cache regexes for className
        document = window.document;     // cache for faster lookups
    
    // brower detection
    var isOpera = Y.ua.opera,
        isSafari = Y.ua.webkit, 
        isGecko = Y.ua.gecko,
        isIE = Y.ua.ie; 
    
    // regex cache
    var patterns = {
        ROOT_TAG: /^body|html$/i // body for quirks mode, html for standards
    };

    var getClassRegEx = function(className) {
        var re = reClassNameCache[className];
        if (!re) {
            re = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
            reClassNameCache[className] = re;
        }
        return re;
    };

    var testElement = function(node, method) {
        return node && node.nodeType == 1 && ( !method || method(node) );
    };

    /**
     * Returns a array of HTMLElements with the given class.
     * For optimized performance, include a tag and/or root node when possible.
     * @method getElementsByClassName
     * @param {String} className The class name to match against
     * @param {String} tag (optional) The tag name of the elements being collected
     * @param {String | HTMLElement} root (optional) The HTMLElement or an ID to use as the starting point 
     * @param {Function} apply (optional) A function to apply to each element when found 
     * @return {Array} An array of elements that have the given class name
     */
    Dom.getElementsByClassName = function(className, tag, root, apply) {
        tag = tag || '*';
        root = (root) ? Y.Dom.get(root) : null || document; 
        if (!root) {
            return [];
        }

        var nodes = [],
            elements = root.getElementsByTagName(tag),
            re = getClassRegEx(className);

        for (var i = 0, len = elements.length; i < len; ++i) {
            if ( re.test(elements[i].className) ) {
                nodes[nodes.length] = elements[i];
                if (apply) {
                    apply.call(elements[i], elements[i]);
                }
            }
        }
        
        return nodes;
    };
        
    /**
     * Determines whether an HTMLElement is an ancestor of another HTML element in the DOM hierarchy.
     * @method isAncestor
     * @param {String | HTMLElement} haystack The possible ancestor
     * @param {String | HTMLElement} needle The possible descendent
     * @return {Boolean} Whether or not the haystack is an ancestor of needle
     */
    Dom.isAncestor = function(haystack, needle) {
        haystack = Y.Dom.get(haystack);
        needle = Y.Dom.get(needle);
        
        if (!haystack || !needle) {
            return false;
        }

        if (haystack.contains && needle.nodeType && !isSafari) { // safari contains is broken
            Y.log('isAncestor returning ' + haystack.contains(needle), 'info', 'Dom');
            return haystack.contains(needle);
        }
        else if ( haystack.compareDocumentPosition && needle.nodeType ) {
            Y.log('isAncestor returning ' + !!(haystack.compareDocumentPosition(needle) & 16), 'info', 'Dom');
            return !!(haystack.compareDocumentPosition(needle) & 16);
        } else if (needle.nodeType) {
            // fallback to crawling up (safari)
            return !!this.getAncestorBy(needle, function(el) {
                return el == haystack; 
            }); 
        }
        Y.log('isAncestor failed; most likely needle is not an HTMLElement', 'error', 'Dom');
        return false;
    };
        
    /**
     * Determines whether an HTMLElement is present in the current document.
     * @method inDocument         
     * @param {String | HTMLElement} el The element to search for
     * @return {Boolean} Whether or not the element is present in the current document
     */
    Dom.inDocument = function(el) {
        return this.isAncestor(document.documentElement, el);
    };
    
   /**
     * Returns the nearest ancestor that passes the test applied by supplied boolean method.
     * For performance reasons, IDs are not accepted and argument validation omitted.
     * @method getAncestorBy
     * @param {HTMLElement} node The HTMLElement to use as the starting point 
     * @param {Function} method - A boolean method for testing elements which receives the element as its only argument.
     * @return {Object} HTMLElement or null if not found
     */
    Dom.getAncestorBy = function(node, method) {
        while ((node = node.parentNode)) { // NOTE: assignment
            if ( testElement(node, method) ) {
                Y.log('getAncestorBy returning ' + node, 'info', 'Dom');
                return node;
            }
        } 

        Y.log('getAncestorBy returning null (no ancestor passed test)', 'error', 'Dom');
        return null;
    };
    
    /**
     * Returns the nearest ancestor with the given className.
     * @method getAncestorByClassName
     * @param {String | HTMLElement} node The HTMLElement or an ID to use as the starting point 
     * @param {String} className
     * @return {Object} HTMLElement
     */
    Dom.getAncestorByClassName = function(node, className) {
        node = Y.Dom.get(node);
        if (!node) {
            Y.log('getAncestorByClassName failed: invalid node argument', 'error', 'Dom');
            return null;
        }
        var method = function(el) { return Y.Dom.hasClass(el, className); };
        return Y.Dom.getAncestorBy(node, method);
    };

    /**
     * Returns the nearest ancestor with the given tagName.
     * @method getAncestorByTagName
     * @param {String | HTMLElement} node The HTMLElement or an ID to use as the starting point 
     * @param {String} tagName
     * @return {Object} HTMLElement
     */
    Dom.getAncestorByTagName = function(node, tagName) {
        node = Y.Dom.get(node);
        if (!node) {
            Y.log('getAncestorByTagName failed: invalid node argument', 'error', 'Dom');
            return null;
        }
        var method = function(el) {
             return el.tagName && el.tagName.toUpperCase() == tagName.toUpperCase();
        };

        return Y.Dom.getAncestorBy(node, method);
    };

    /**
     * Returns the previous sibling that is an HTMLElement. 
     * For performance reasons, IDs are not accepted and argument validation omitted.
     * Returns the nearest HTMLElement sibling if no method provided.
     * @method getPreviousSiblingBy
     * @param {HTMLElement} node The HTMLElement to use as the starting point 
     * @param {Function} method A boolean function used to test siblings
     * that receives the sibling node being tested as its only argument
     * @return {Object} HTMLElement or null if not found
     */
    Dom.getPreviousSiblingBy = function(node, method) {
        while (node) {
            node = node.previousSibling;
            if ( testElement(node, method) ) {
                return node;
            }
        }
        return null;
    };

    /**
     * Returns the previous sibling that is an HTMLElement 
     * @method getPreviousSibling
     * @param {String | HTMLElement} node The HTMLElement or an ID to use as the starting point 
     * @return {Object} HTMLElement or null if not found
     */
    Dom.getPreviousSibling = function(node) {
        node = Y.Dom.get(node);
        if (!node) {
            Y.log('getPreviousSibling failed: invalid node argument', 'error', 'Dom');
            return null;
        }

        return Y.Dom.getPreviousSiblingBy(node);
    };

    /**
     * Returns the next HTMLElement sibling that passes the boolean method. 
     * For performance reasons, IDs are not accepted and argument validation omitted.
     * Returns the nearest HTMLElement sibling if no method provided.
     * @method getNextSiblingBy
     * @param {HTMLElement} node The HTMLElement to use as the starting point 
     * @param {Function} method A boolean function used to test siblings
     * that receives the sibling node being tested as its only argument
     * @return {Object} HTMLElement or null if not found
     */
    Dom.getNextSiblingBy = function(node, method) {
        while (node) {
            node = node.nextSibling;
            if ( testElement(node, method) ) {
                return node;
            }
        }
        return null;
    };

    /**
     * Returns the next sibling that is an HTMLElement 
     * @method getNextSibling
     * @param {String | HTMLElement} node The HTMLElement or an ID to use as the starting point 
     * @return {Object} HTMLElement or null if not found
     */
    Dom.getNextSibling = function(node) {
        node = Y.Dom.get(node);
        if (!node) {
            Y.log('getNextSibling failed: invalid node argument', 'error', 'Dom');
            return null;
        }

        return Y.Dom.getNextSiblingBy(node);
    };

    /**
     * Returns the first HTMLElement child that passes the test method. 
     * @method getFirstChildBy
     * @param {HTMLElement} node The HTMLElement to use as the starting point 
     * @param {Function} method A boolean function used to test children
     * that receives the node being tested as its only argument
     * @return {Object} HTMLElement or null if not found
     */
    Dom.getFirstChildBy = function(node, method) {
        var child = ( testElement(node.firstChild, method) ) ? node.firstChild : null;
        return child || Y.Dom.getNextSiblingBy(node.firstChild, method);
    };

    /**
     * Returns the first HTMLElement child. 
     * @method getFirstChild
     * @param {String | HTMLElement} node The HTMLElement or an ID to use as the starting point 
     * @return {Object} HTMLElement or null if not found
     */
    Dom.getFirstChild = function(node, method) {
        node = Y.Dom.get(node);
        if (!node) {
            Y.log('getFirstChild failed: invalid node argument', 'error', 'Dom');
            return null;
        }
        return Y.Dom.getFirstChildBy(node);
    };

    /**
     * Returns the last HTMLElement child that passes the test method. 
     * @method getLastChildBy
     * @param {HTMLElement} node The HTMLElement to use as the starting point 
     * @param {Function} method A boolean function used to test children
     * that receives the node being tested as its only argument
     * @return {Object} HTMLElement or null if not found
     */
    Dom.getLastChildBy = function(node, method) {
        if (!node) {
            Y.log('getLastChild failed: invalid node argument', 'error', 'Dom');
            return null;
        }
        var child = ( testElement(node.lastChild, method) ) ? node.lastChild : null;
        return child || Y.Dom.getPreviousSiblingBy(node.lastChild, method);
    };

    /**
     * Returns the last HTMLElement child. 
     * @method getLastChild
     * @param {String | HTMLElement} node The HTMLElement or an ID to use as the starting point 
     * @return {Object} HTMLElement or null if not found
     */
    Dom.getLastChild = function(node) {
        node = Y.Dom.get(node);
        return Y.Dom.getLastChildBy(node);
    };

    /**
     * Returns an array of HTMLElement childNodes that pass the test method. 
     * @method getChildrenBy
     * @param {HTMLElement} node The HTMLElement to start from
     * @param {Function} method A boolean function used to test children
     * that receives the node being tested as its only argument
     * @return {Array} A static array of HTMLElements
     */
    Dom.getChildrenBy = function(node, method) {
        var child = Y.Dom.getFirstChildBy(node, method);
        var children = child ? [child] : [];

        Y.Dom.getNextSiblingBy(child, function(node) {
            if ( !method || method(node) ) {
                children[children.length] = node;
            }
            return false; // fail test to collect all children
        });

        return children;
    };

    /**
     * Returns an array of HTMLElement childNodes. 
     * @method getChildren
     * @param {String | HTMLElement} node The HTMLElement or an ID to use as the starting point 
     * @return {Array} A static array of HTMLElements
     */
    Dom.getChildren = function(node) {
        node = Y.Dom.get(node);
        if (!node) {
            Y.log('getChildren failed: invalid node argument', 'error', 'Dom');
        }

        return Y.Dom.getChildrenBy(node);
    };

    /**
     * Inserts the new node as the previous sibling of the reference node 
     * @method insertBefore
     * @param {String | HTMLElement} newNode The node to be inserted
     * @param {String | HTMLElement} referenceNode The node to insert the new node before 
     * @return {HTMLElement} The node that was inserted (or null if insert fails) 
     */
    Dom.insertBefore = function(newNode, referenceNode) {
        newNode = Y.Dom.get(newNode); 
        referenceNode = Y.Dom.get(referenceNode); 
        
        if (!newNode || !referenceNode || !referenceNode.parentNode) {
            Y.log('insertAfter failed: missing or invalid arg(s)', 'error', 'Dom');
            return null;
        }       

        return referenceNode.parentNode.insertBefore(newNode, referenceNode); 
    };

    /**
     * Inserts the new node as the next sibling of the reference node 
     * @method insertAfter
     * @param {String | HTMLElement} newNode The node to be inserted
     * @param {String | HTMLElement} referenceNode The node to insert the new node after 
     * @return {HTMLElement} The node that was inserted (or null if insert fails) 
     */
    Dom.insertAfter = function(newNode, referenceNode) {
        newNode = Y.Dom.get(newNode); 
        referenceNode = Y.Dom.get(referenceNode); 
        
        if (!newNode || !referenceNode || !referenceNode.parentNode) {
            Y.log('insertAfter failed: missing or invalid arg(s)', 'error', 'Dom');
            return null;
        }       

        if (referenceNode.nextSibling) {
            return referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling); 
        } else {
            return referenceNode.parentNode.appendChild(newNode);
        }
    };


}, "3.0.0");

YUI.add("dom", function(Y) {
    Y.log(Y.id + ' DOM setup complete) .');
} , "3.0.0", {
    use: ["domcore", "region", "screen", "style", "domextras"]
});

YUI.add("io", function(Y) {

    /**
     * The Connection Manager provides a simplified interface to the XMLHttpRequest
     * object.  It handles cross-browser instantiantion of XMLHttpRequest, negotiates the
     * interactive states and server response, returning the results to a pre-defined
     * callback you create.
     *
     * @module connection
     * @requires yahoo
     * @requires event
     */

    Y.mix(Y.io, Y.Event.Target.prototype);

    /**
     * The Connection Manager singleton provides methods for creating and managing
     * asynchronous transactions.
     *
     * @class XHR
     */

    Y.mix(Y.io, {
      /**
       * @description Array of MSFT ActiveX ids for XMLHttpRequest.
       * @property _msxml_progid
       * @private
       * @static
       * @type array
       */
        _msxml_progid:[
            'Microsoft.XMLHTTP',
            'MSXML2.XMLHTTP.3.0',
            'MSXML2.XMLHTTP'
            ],

      /**
       * @description Object literal of HTTP header(s)
       * @property _http_header
       * @private
       * @static
       * @type object
       */
        _http_headers:{},

      /**
       * @description Determines if HTTP headers are set.
       * @property _has_http_headers
       * @private
       * @static
       * @type boolean
       */
        _has_http_headers:false,

     /**
      * @description Determines if a default header of
      * Content-Type of 'application/x-www-form-urlencoded'
      * will be added to any client HTTP headers sent for POST
      * transactions.
      * @property _use_default_post_header
      * @private
      * @static
      * @type boolean
      */
        _use_default_post_header:true,

     /**
      * @description The default header used for POST transactions.
      * @property _default_post_header
      * @private
      * @static
      * @type boolean
      */
        _default_post_header:'application/x-www-form-urlencoded; charset=UTF-8',

     /**
      * @description The default header used for transactions involving the
      * use of HTML forms.
      * @property _default_form_header
      * @private
      * @static
      * @type boolean
      */
        _default_form_header:'application/x-www-form-urlencoded',

     /**
      * @description Determines if a default header of
      * 'X-Requested-With: XMLHttpRequest'
      * will be added to each transaction.
      * @property _use_default_xhr_header
      * @private
      * @static
      * @type boolean
      */
        _use_default_xhr_header:true,

     /**
      * @description The default header value for the label
      * "X-Requested-With".  This is sent with each
      * transaction, by default, to identify the
      * request as being made by YUI Connection Manager.
      * @property _default_xhr_header
      * @private
      * @static
      * @type boolean
      */
        _default_xhr_header:'XMLHttpRequest',

     /**
      * @description Determines if custom, default headers
      * are set for each transaction.
      * @property _has_default_header
      * @private
      * @static
      * @type boolean
      */
        _has_default_headers:true,

     /**
      * @description Determines if custom, default headers
      * are set for each transaction.
      * @property _has_default_header
      * @private
      * @static
      * @type boolean
      */
        _default_headers:{},

     /**
      * @description Property modified by setForm() to determine if the data
      * should be submitted as an HTML form.
      * @property _isFormSubmit
      * @private
      * @static
      * @type boolean
      */
        _isFormSubmit:false,

     /**
      * @description Property modified by setForm() to determine if a file(s)
      * upload is expected.
      * @property _isFileUpload
      * @private
      * @static
      * @type boolean
      */
        _isFileUpload:false,

     /**
      * @description Property modified by setForm() to set a reference to the HTML
      * form node if the desired action is file upload.
      * @property _formNode
      * @private
      * @static
      * @type object
      */
        _formNode:null,

     /**
      * @description Property modified by setForm() to set the HTML form data
      * for each transaction.
      * @property _sFormData
      * @private
      * @static
      * @type string
      */
        _sFormData:null,

     /**
      * @description Collection of polling references to the polling mechanism in handleReadyState.
      * @property _poll
      * @private
      * @static
      * @type object
      */
        _poll:{},

     /**
      * @description Queue of timeout values for each transaction callback with a defined timeout value.
      * @property _timeOut
      * @private
      * @static
      * @type object
      */
        _timeOut:{},

      /**
       * @description The polling frequency, in milliseconds, for HandleReadyState.
       * when attempting to determine a transaction's XHR readyState.
       * The default is 50 milliseconds.
       * @property _polling_interval
       * @private
       * @static
       * @type int
       */
         _polling_interval:50,

      /**
       * @description A transaction counter that increments the transaction id for each transaction.
       * @property _transaction_id
       * @private
       * @static
       * @type int
       */
         _transaction_id:0,

      /**
       * @description Tracks the name-value pair of the "clicked" submit button if multiple submit
       * buttons are present in an HTML form; and, if Event is available.
       * @property _submitElementValue
       * @private
       * @static
       * @type string
       */
         _submitElementValue:null,

      /**
       * @description Determines whether Event is available and returns true or false.
       * If true, an event listener is bound at the document level to trap click events that
       * resolve to a target type of "Submit".  This listener will enable setForm() to determine
       * the clicked "Submit" value in a multi-Submit button, HTML form.
       * @property _hasSubmitListener
       * @private
       * @static
       */
         _hasSubmitListener:(function()
         {
            Y.on(
                'click',
                function(e){
                    var obj = e.target;
                    if(obj.type && obj.type.toLowerCase() == 'submit'){
                        Y.IO._submitElementValue = encodeURIComponent(obj.name) + "=" + encodeURIComponent(obj.value);
                    }
                },
                Y.config.doc );
            return true;
         })(),

      /**
       * @description Custom event that fires at the start of a transaction
       * @property startEvent
       * @private
       * @static
       * @type CustomEvent
       */
        startEvent: Y.io.publish('start'), // new Y.CustomEvent('start'),

      /**
       * @description Custom event that fires when a transaction response has completed.
       * @property completeEvent
       * @private
       * @static
       * @type CustomEvent
       */
        completeEvent: Y.io.publish('complete'), // new Y.CustomEvent('complete'),

      /**
       * @description Custom event that fires when handleTransactionResponse() determines a
       * response in the HTTP 2xx range.
       * @property successEvent
       * @private
       * @static
       * @type CustomEvent
       */
        successEvent: Y.io.publish('success'), // new Y.CustomEvent('success'),

      /**
       * @description Custom event that fires when handleTransactionResponse() determines a
       * response in the HTTP 4xx/5xx range.
       * @property failureEvent
       * @private
       * @static
       * @type CustomEvent
       */
        failureEvent: Y.io.publish('failure'), //new Y.CustomEvent('failure'),

      /**
       * @description Custom event that fires when handleTransactionResponse() determines a
       * response in the HTTP 4xx/5xx range.
       * @property failureEvent
       * @private
       * @static
       * @type CustomEvent
       */
        uploadEvent: Y.io.publish('upload'), // new Y.CustomEvent('upload'),

      /**
       * @description Custom event that fires when a transaction is successfully aborted.
       * @property abortEvent
       * @private
       * @static
       * @type CustomEvent
       */
        abortEvent: Y.io.publish('abort'), // new Y.CustomEvent('abort'),

      /**
       * @description A reference table that maps callback custom events members to its specific
       * event name.
       * @property _customEvents
       * @private
       * @static
       * @type object
       */
        _customEvents:
        {
            onStart:['startEvent', 'start'],
            onComplete:['completeEvent', 'complete'],
            onSuccess:['successEvent', 'success'],
            onFailure:['failureEvent', 'failure'],
            onUpload:['uploadEvent', 'upload'],
            onAbort:['abortEvent', 'abort']
        },

      /**
       * @description Member to add an ActiveX id to the existing xml_progid array.
       * In the event(unlikely) a new ActiveX id is introduced, it can be added
       * without internal code modifications.
       * @method setProgId
       * @public
       * @static
       * @param {string} id The ActiveX id to be added to initialize the XHR object.
       * @return void
       */
        setProgId:function(id)
        {
            this._msxml_progid.unshift(id);
            Y.log('ActiveX Program Id  ' + id + ' added to _msxml_progid.', 'info', 'Connection');
        },

      /**
       * @description Member to override the default POST header.
       * @method setDefaultPostHeader
       * @public
       * @static
       * @param {boolean} b Set and use default header - true or false .
       * @return void
       */
        setDefaultPostHeader:function(b)
        {
            if(typeof b == 'string'){
                this._default_post_header = b;
                Y.log('Default POST header set to  ' + b, 'info', 'Connection');
            }
            else if(typeof b == 'boolean'){
                this._use_default_post_header = b;
            }
        },

      /**
       * @description Member to override the default transaction header..
       * @method setDefaultXhrHeader
       * @public
       * @static
       * @param {boolean} b Set and use default header - true or false .
       * @return void
       */
        setDefaultXhrHeader:function(b)
        {
            if(typeof b == 'string'){
                this._default_xhr_header = b;
                Y.log('Default XHR header set to  ' + b, 'info', 'Connection');
            }
            else{
                this._use_default_xhr_header = b;
            }
        },

      /**
       * @description Member to modify the default polling interval.
       * @method setPollingInterval
       * @public
       * @static
       * @param {int} i The polling interval in milliseconds.
       * @return void
       */
        setPollingInterval:function(i)
        {
            if(typeof i == 'number' && isFinite(i)){
                this._polling_interval = i;
                Y.log('Default polling interval set to ' + i +'ms', 'info', 'Connection');
            }
        },

      /**
       * @description Instantiates a XMLHttpRequest object and returns an object with two properties:
       * the XMLHttpRequest instance and the transaction id.
       * @method createXhrObject
       * @private
       * @static
       * @param {int} transactionId Property containing the transaction id for this transaction.
       * @return object
       */
        createXhrObject:function(transactionId)
        {
            var obj,http;
            try
            {
                // Instantiates XMLHttpRequest in non-IE browsers and assigns to http.
                http = new XMLHttpRequest();
                //  Object literal with http and tId properties
                obj = { conn:http, tId:transactionId };
                Y.log('XHR object created for transaction ' + transactionId, 'info', 'Connection');
            }
            catch(e)
            {
                for(var i=0; i<this._msxml_progid.length; ++i){
                    try
                    {
                        // Instantiates XMLHttpRequest for IE and assign to http
                        http = new ActiveXObject(this._msxml_progid[i]);
                        //  Object literal with conn and tId properties
                        obj = { conn:http, tId:transactionId };
                        Y.log('ActiveX XHR object created for transaction ' + transactionId, 'info', 'Connection');
                        break;
                    }
                    catch(ex){}
                }
            }
            finally
            {
                return obj;
            }
        },

      /**
       * @description This method is called by asyncRequest to create a
       * valid connection object for the transaction.  It also passes a
       * transaction id and increments the transaction id counter.
       * @method getConnectionObject
       * @private
       * @static
       * @return {object}
       */
        getConnectionObject:function(isFileUpload)
        {
            var o;
            var tId = this._transaction_id;

            try
            {
                if(!isFileUpload){
                    o = this.createXhrObject(tId);
                }
                else{
                    o = {};
                    o.tId = tId;
                    o.isUpload = true;
                }

                if(o){
                    this._transaction_id++;
                }
            }
            catch(e){}
            finally
            {
                return o;
            }
        },

      /**
       * @description Method for initiating an asynchronous request via the XHR object.
       * @method asyncRequest
       * @public
       * @static
       * @param {string} method HTTP transaction method
       * @param {string} uri Fully qualified path of resource
       * @param {callback} callback User-defined callback function or object
       * @param {string} postData POST body
       * @return {object} Returns the connection object
       */
        asyncRequest:function(method, uri, callback, postData)
        {
            var o = (this._isFileUpload)?this.getConnectionObject(true):this.getConnectionObject();
            var args = (callback && callback.argument)?callback.argument:null;

            if(!o){
                Y.log('Unable to create connection object.', 'error', 'Connection');
                return null;
            }
            else{

                // Intialize any transaction-specific custom events, if provided.
                if(callback && callback.customevents){

                    Y.mix(o, Y.Event.Target.prototype);
                    this.initCustomEvents(o, callback);
                }

                if(this._isFormSubmit){
                    if(this._isFileUpload){
                        this.uploadFile(o, callback, uri, postData);
                        return o;
                    }

                    // If the specified HTTP method is GET, setForm() will return an
                    // encoded string that is concatenated to the uri to
                    // create a querystring.
                    if(method.toUpperCase() == 'GET'){
                        if(this._sFormData.length !== 0){
                            // If the URI already contains a querystring, append an ampersand
                            // and then concatenate _sFormData to the URI.
                            uri += ((uri.indexOf('?') == -1)?'?':'&') + this._sFormData;
                        }
                    }
                    else if(method.toUpperCase() == 'POST'){
                        // If POST data exist in addition to the HTML form data,
                        // it will be concatenated to the form data.
                        postData = postData?this._sFormData + "&" + postData:this._sFormData;
                    }
                }

                if(method.toUpperCase() == 'GET' && (callback && callback.cache === false)){
                    // If callback.cache is defined and set to false, a
                    // timestamp value will be added to the querystring.
                    uri += ((uri.indexOf('?') == -1)?'?':'&') + "rnd=" + new Date().valueOf().toString();
                }

                o.conn.open(method, uri, true);

                // Each transaction will automatically include a custom header of
                // "X-Requested-With: XMLHttpRequest" to identify the request as
                // having originated from Connection Manager.
                if(this._use_default_xhr_header){
                    if(!this._default_headers['X-Requested-With']){
                        this.initHeader('X-Requested-With', this._default_xhr_header, true);
                        Y.log('Initialize transaction header X-Request-Header to XMLHttpRequest.', 'info', 'Connection');
                    }
                }

                //If the transaction method is POST and the POST header value is set to true
                //or a custom value, initalize the Content-Type header to this value.
                if((method.toUpperCase() == 'POST' && this._use_default_post_header) && this._isFormSubmit === false){
                    this.initHeader('Content-Type', this._default_post_header);
                    Y.log('Initialize header Content-Type to application/x-www-form-urlencoded; UTF-8 for POST transaction.', 'info', 'Connection');
                }

                //Initialize all default and custom HTTP headers,
                if(this._has_default_headers || this._has_http_headers){
                    this.setHeader(o);
                }

                this.handleReadyState(o, callback);
                o.conn.send(postData || null);
                Y.log('Transaction ' + o.tId + ' sent.', 'info', 'Connection');


                // Reset the HTML form data and state properties as
                // soon as the data are submitted.
                if(this._isFormSubmit === true){
                    this.resetFormState();
                }

                // Fire global custom event -- startEvent
                this.startEvent.fire(o, args);

                if(o.startEvent){
                    // Fire transaction custom event -- startEvent
                    o.startEvent.fire(o, args);
                }

                return o;
            }
        },

      /**
       * @description This method creates and subscribes custom events,
       * specific to each transaction
       * @method initCustomEvents
       * @private
       * @static
       * @param {object} o The connection object
       * @param {callback} callback The user-defined callback object
       * @return {void}
       */
        initCustomEvents:function(o, callback)
        {
            // Enumerate through callback.customevents members and bind/subscribe
            // events that match in the _customEvents table.
            for(var prop in callback.customevents){
                if(this._customEvents[prop][0]){
                    // Create the custom event
                    o[this._customEvents[prop][0]] = new Y.io.publish(this._customEvents[prop][1], (callback.scope)?callback.scope:null);
                    Y.log('Transaction-specific Custom Event ' + o[this._customEvents[prop][1]] + ' created.', 'info', 'Connection');

                    // Subscribe the custom event
                    o[this._customEvents[prop][0]].subscribe(callback.customevents[prop]);
                    Y.log('Transaction-specific Custom Event ' + o[this._customEvents[prop][1]] + ' subscribed.', 'info', 'Connection');
                }
            }
        },

      /**
       * @description This method serves as a timer that polls the XHR object's readyState
       * property during a transaction, instead of binding a callback to the
       * onreadystatechange event.  Upon readyState 4, handleTransactionResponse
       * will process the response, and the timer will be cleared.
       * @method handleReadyState
       * @private
       * @static
       * @param {object} o The connection object
       * @param {callback} callback The user-defined callback object
       * @return {void}
       */

        handleReadyState:function(o, callback)

        {
            var oConn = this;
            var args = (callback && callback.argument)?callback.argument:null;

            if(callback && callback.timeout){
                this._timeOut[o.tId] = Y.config.win.setTimeout(function(){ oConn.abort(o, callback, true); }, callback.timeout);
            }

            this._poll[o.tId] = Y.config.win.setInterval(
                function(){
                    if(o.conn && o.conn.readyState === 4){

                        // Clear the polling interval for the transaction
                        // and remove the reference from _poll.
                        Y.config.win.clearInterval(oConn._poll[o.tId]);
                        delete oConn._poll[o.tId];

                        if(callback && callback.timeout){
                            Y.config.win.clearTimeout(oConn._timeOut[o.tId]);
                            delete oConn._timeOut[o.tId];
                        }

                        // Fire global custom event -- completeEvent
                        oConn.completeEvent.fire(o, args);

                        if(o.completeEvent){
                            // Fire transaction custom event -- completeEvent
                            o.completeEvent.fire(o, args);
                        }

                        oConn.handleTransactionResponse(o, callback);
                    }
                }
            ,this._polling_interval);
        },

      /**
       * @description This method attempts to interpret the server response and
       * determine whether the transaction was successful, or if an error or
       * exception was encountered.
       * @method handleTransactionResponse
       * @private
       * @static
       * @param {object} o The connection object
       * @param {object} callback The user-defined callback object
       * @param {boolean} isAbort Determines if the transaction was terminated via abort().
       * @return {void}
       */
        handleTransactionResponse:function(o, callback, isAbort)
        {
            var httpStatus, responseObject;
            var args = (callback && callback.argument)?callback.argument:null;

            try
            {
                if(o.conn.status !== undefined && o.conn.status !== 0){
                    httpStatus = o.conn.status;
                }
                else{
                    httpStatus = 13030;
                }
            }
            catch(e){

                 // 13030 is a custom code to indicate the condition -- in Mozilla/FF --
                 // when the XHR object's status and statusText properties are
                 // unavailable, and a query attempt throws an exception.
                httpStatus = 13030;
            }

            if(httpStatus >= 200 && httpStatus < 300 || httpStatus === 1223){
                responseObject = this.createResponseObject(o, args);
                if(callback && callback.success){
                    if(!callback.scope){
                        callback.success(responseObject);
                        Y.log('Success callback. HTTP code is ' + httpStatus, 'info', 'Connection');
                    }
                    else{
                        // If a scope property is defined, the callback will be fired from
                        // the context of the object.
                        callback.success.apply(callback.scope, [responseObject]);
                        Y.log('Success callback with scope. HTTP code is ' + httpStatus, 'info', 'Connection');
                    }
                }

                // Fire global custom event -- successEvent
                this.successEvent.fire(responseObject);

                if(o.successEvent){
                    // Fire transaction custom event -- successEvent
                    o.successEvent.fire(responseObject);
                }
            }
            else{
                switch(httpStatus){
                    // The following cases are wininet.dll error codes that may be encountered.
                    case 12002: // Server timeout
                    case 12029: // 12029 to 12031 correspond to dropped connections.
                    case 12030:
                    case 12031:
                    case 12152: // Connection closed by server.
                    case 13030: // See above comments for variable status.
                        responseObject = this.createExceptionObject(o.tId, args, (isAbort?isAbort:false));
                        if(callback && callback.failure){
                            if(!callback.scope){
                                callback.failure(responseObject);
                                Y.log('Failure callback. Exception detected. Status code is ' + httpStatus, 'warn', 'Connection');
                            }
                            else{
                                callback.failure.apply(callback.scope, [responseObject]);
                                Y.log('Failure callback with scope. Exception detected. Status code is ' + httpStatus, 'warn', 'Connection');
                            }
                        }

                        break;
                    default:
                        responseObject = this.createResponseObject(o, args);
                        if(callback && callback.failure){
                            if(!callback.scope){
                                callback.failure(responseObject);
                                Y.log('Failure callback. HTTP status code is ' + httpStatus, 'warn', 'Connection');
                            }
                            else{
                                callback.failure.apply(callback.scope, [responseObject]);
                                Y.log('Failure callback with scope. HTTP status code is ' + httpStatus, 'warn', 'Connection');
                            }
                        }
                }

                // Fire global custom event -- failureEvent
                this.failureEvent.fire(responseObject);

                if(o.failureEvent){
                    // Fire transaction custom event -- failureEvent
                    o.failureEvent.fire(responseObject);
                }

            }

            this.releaseObject(o);
            responseObject = null;
        },

      /**
       * @description This method evaluates the server response, creates and returns the results via
       * its properties.  Success and failure cases will differ in the response
       * object's property values.
       * @method createResponseObject
       * @private
       * @static
       * @param {object} o The connection object
       * @param {callbackArg} callbackArg The user-defined argument or arguments to be passed to the callback
       * @return {object}
       */
        createResponseObject:function(o, callbackArg)
        {
            var obj = {};
            var headerObj = {};

            try
            {
                var headerStr = o.conn.getAllResponseHeaders();
                var header = headerStr.split('\n');
                for(var i=0; i<header.length; i++){
                    var delimitPos = header[i].indexOf(':');
                    if(delimitPos != -1){
                        headerObj[header[i].substring(0,delimitPos)] = header[i].substring(delimitPos+2);
                    }
                }
            }
            catch(e){}

            obj.tId = o.tId;
            // Normalize IE's response to HTTP 204 when Win error 1223.
            obj.status = (o.conn.status == 1223)?204:o.conn.status;
            // Normalize IE's statusText to "No Content" instead of "Unknown".
            obj.statusText = (o.conn.status == 1223)?"No Content":o.conn.statusText;
            obj.getResponseHeader = headerObj;
            obj.getAllResponseHeaders = headerStr;
            obj.responseText = o.conn.responseText;
            obj.responseXML = o.conn.responseXML;

            if(callbackArg){
                obj.argument = callbackArg;
            }

            return obj;
        },

      /**
       * @description If a transaction cannot be completed due to dropped or closed connections,
       * there may be not be enough information to build a full response object.
       * The failure callback will be fired and this specific condition can be identified
       * by a status property value of 0.
       *
       * If an abort was successful, the status property will report a value of -1.
       *
       * @method createExceptionObject
       * @private
       * @static
       * @param {int} tId The Transaction Id
       * @param {callbackArg} callbackArg The user-defined argument or arguments to be passed to the callback
       * @param {boolean} isAbort Determines if the exception case is caused by a transaction abort
       * @return {object}
       */
        createExceptionObject:function(tId, callbackArg, isAbort)
        {
            var COMM_CODE = 0;
            var COMM_ERROR = 'communication failure';
            var ABORT_CODE = -1;
            var ABORT_ERROR = 'transaction aborted';

            var obj = {};

            obj.tId = tId;
            if(isAbort){
                obj.status = ABORT_CODE;
                obj.statusText = ABORT_ERROR;
            }
            else{
                obj.status = COMM_CODE;
                obj.statusText = COMM_ERROR;
            }

            if(callbackArg){
                obj.argument = callbackArg;
            }

            return obj;
        },

      /**
       * @description Method that initializes the custom HTTP headers for the each transaction.
       * @method initHeader
       * @public
       * @static
       * @param {string} label The HTTP header label
       * @param {string} value The HTTP header value
       * @param {string} isDefault Determines if the specific header is a default header
       * automatically sent with each transaction.
       * @return {void}
       */
        initHeader:function(label, value, isDefault)
        {
            var headerObj = (isDefault)?this._default_headers:this._http_headers;
            headerObj[label] = value;

            if(isDefault){
                this._has_default_headers = true;
            }
            else{
                this._has_http_headers = true;
            }
        },


      /**
       * @description Accessor that sets the HTTP headers for each transaction.
       * @method setHeader
       * @private
       * @static
       * @param {object} o The connection object for the transaction.
       * @return {void}
       */
        setHeader:function(o)
        {
            var prop;
            if(this._has_default_headers){
                for(prop in this._default_headers){
                    if(Y.lang.hasOwnProperty(this._default_headers, prop)){
                        o.conn.setRequestHeader(prop, this._default_headers[prop]);
                        Y.log('Default HTTP header ' + prop + ' set with value of ' + this._default_headers[prop], 'info', 'Connection');
                    }
                }
            }

            if(this._has_http_headers){
                for(prop in this._http_headers){
                    if(Y.lang.hasOwnProperty(this._http_headers, prop)){
                        o.conn.setRequestHeader(prop, this._http_headers[prop]);
                        Y.log('HTTP header ' + prop + ' set with value of ' + this._http_headers[prop], 'info', 'Connection');
                    }
                }
                delete this._http_headers;

                this._http_headers = {};
                this._has_http_headers = false;
            }
        },

      /**
       * @description Resets the default HTTP headers object
       * @method resetDefaultHeaders
       * @public
       * @static
       * @return {void}
       */
        resetDefaultHeaders:function(){
            delete this._default_headers;
            this._default_headers = {};
            this._has_default_headers = false;
        },

      /**
       * @description This method assembles the form label and value pairs and
       * constructs an encoded string.
       * asyncRequest() will automatically initialize the transaction with a
       * a HTTP header Content-Type of application/x-www-form-urlencoded.
       * @method setForm
       * @public
       * @static
       * @param {string || object} form id or name attribute, or form object.
       * @param {boolean} optional enable file upload.
       * @param {boolean} optional enable file upload over SSL in IE only.
       * @return {string} string of the HTML form field name and value pairs..
       */
        setForm:function(formId, isUpload, secureUri)
        {
            // reset the HTML form data and state properties
            this.resetFormState();

            var oForm;
            if(typeof formId == 'string'){
                // Determine if the argument is a form id or a form name.
                // Note form name usage is deprecated, but supported
                // here for backward compatibility.
                oForm = (Y.get(formId) || Y.config.doc.forms[formId]);
            }
            else if(typeof formId == 'object'){
                // Treat argument as an HTML form object.
                oForm = formId;
            }
            else{
                Y.log('Unable to create form object ' + formId, 'warn', 'Connection');
                return;
            }

            // If the isUpload argument is true, setForm will call createFrame to initialize
            // an iframe as the form target.
            //
            // The argument secureURI is also required by IE in SSL environments
            // where the secureURI string is a fully qualified HTTP path, used to set the source
            // of the iframe, to a stub resource in the same domain.
            if(isUpload){

                // Create iframe in preparation for file upload.
                var io = this.createFrame(secureUri?secureUri:null);
                // Set form reference and file upload properties to true.
                this._isFormSubmit = true;
                this._isFileUpload = true;
                this._formNode = oForm;

                return;

            }

            var oElement, oName, oValue, oDisabled;
            var hasSubmit = false;

            // Iterate over the form elements collection to construct the
            // label-value pairs.
            for (var i=0; i<oForm.elements.length; i++){
                oElement = oForm.elements[i];
                oDisabled = oElement.disabled;
                oName = oElement.name;
                oValue = oElement.value;

                // Do not submit fields that are disabled or
                // do not have a name attribute value.
                if(!oDisabled && oName)
                {
                    switch(oElement.type)
                    {
                        case 'select-one':
                        case 'select-multiple':
                            for(var j=0; j<oElement.options.length; j++){
                                if(oElement.options[j].selected){
                                    if(Y.config.win.ActiveXObject){
                                        this._sFormData += encodeURIComponent(oName) + '=' + encodeURIComponent(oElement.options[j].attributes.value.specified?oElement.options[j].value:oElement.options[j].text) + '&';
                                    }
                                    else{
                                        this._sFormData += encodeURIComponent(oName) + '=' + encodeURIComponent(oElement.options[j].hasAttribute('value')?oElement.options[j].value:oElement.options[j].text) + '&';
                                    }
                                }
                            }
                            break;
                        case 'radio':
                        case 'checkbox':
                            if(oElement.checked){
                                this._sFormData += encodeURIComponent(oName) + '=' + encodeURIComponent(oValue) + '&';
                            }
                            break;
                        case 'file':
                            // stub case as XMLHttpRequest will only send the file path as a string.
                        case undefined:
                            // stub case for fieldset element which returns undefined.
                        case 'reset':
                            // stub case for input type reset button.
                        case 'button':
                            // stub case for input type button elements.
                            break;
                        case 'submit':
                            if(hasSubmit === false){
                                if(this._hasSubmitListener && this._submitElementValue){
                                    this._sFormData += this._submitElementValue + '&';
                                }
                                else{
                                    this._sFormData += encodeURIComponent(oName) + '=' + encodeURIComponent(oValue) + '&';
                                }

                                hasSubmit = true;
                            }
                            break;
                        default:
                            this._sFormData += encodeURIComponent(oName) + '=' + encodeURIComponent(oValue) + '&';
                    }
                }
            }

            this._isFormSubmit = true;
            this._sFormData = this._sFormData.substr(0, this._sFormData.length - 1);

            Y.log('Form initialized for transaction. HTML form POST message is: ' + this._sFormData, 'info', 'Connection');

            this.initHeader('Content-Type', this._default_form_header);
            Y.log('Initialize header Content-Type to application/x-www-form-urlencoded for setForm() transaction.', 'info', 'Connection');

            return this._sFormData;
        },

      /**
       * @description Resets HTML form properties when an HTML form or HTML form
       * with file upload transaction is sent.
       * @method resetFormState
       * @private
       * @static
       * @return {void}
       */
        resetFormState:function(){
            this._isFormSubmit = false;
            this._isFileUpload = false;
            this._formNode = null;
            this._sFormData = "";
        },

      /**
       * @description Creates an iframe to be used for form file uploads.  It is remove from the
       * document upon completion of the upload transaction.
       * @method createFrame
       * @private
       * @static
       * @param {string} optional qualified path of iframe resource for SSL in IE.
       * @return {void}
       */
        createFrame:function(secureUri){

            // IE does not allow the setting of id and name attributes as object
            // properties via createElement().  A different iframe creation
            // pattern is required for IE.
            var frameId = 'yuiIO' + this._transaction_id;
            var io;
            if(Y.config.win.ActiveXObject){
                io = Y.config.doc.createElement('<iframe id="' + frameId + '" name="' + frameId + '" />');

                // IE will throw a security exception in an SSL environment if the
                // iframe source is undefined.
                if(typeof secureUri == 'boolean'){
                    io.src = 'javascript:false';
                }
                else if(typeof secureUri == 'string'){
                    // Deprecated
                    io.src = secureUri;
                }
            }
            else{
                io = Y.config.doc.createElement('iframe');
                io.id = frameId;
                io.name = frameId;
            }

            io.style.position = 'absolute';
            io.style.top = '-1000px';
            io.style.left = '-1000px';

            Y.config.doc.body.appendChild(io);
            Y.log('File upload iframe created. Id is:' + frameId, 'info', 'Connection');
        },

      /**
       * @description Parses the POST data and creates hidden form elements
       * for each key-value, and appends them to the HTML form object.
       * @method appendPostData
       * @private
       * @static
       * @param {string} postData The HTTP POST data
       * @return {array} formElements Collection of hidden fields.
       */
        appendPostData:function(postData)
        {
            var formElements = [];
            var postMessage = postData.split('&');
            for(var i=0; i < postMessage.length; i++){
                var delimitPos = postMessage[i].indexOf('=');
                if(delimitPos != -1){
                    formElements[i] = Y.config.doc.createElement('input');
                    formElements[i].type = 'hidden';
                    formElements[i].name = postMessage[i].substring(0,delimitPos);
                    formElements[i].value = postMessage[i].substring(delimitPos+1);
                    this._formNode.appendChild(formElements[i]);
                }
            }

            return formElements;
        },

      /**
       * @description Uploads HTML form, inclusive of files/attachments, using the
       * iframe created in createFrame to facilitate the transaction.
       * @method uploadFile
       * @private
       * @static
       * @param {int} id The transaction id.
       * @param {object} callback User-defined callback object.
       * @param {string} uri Fully qualified path of resource.
       * @param {string} postData POST data to be submitted in addition to HTML form.
       * @return {void}
       */
        uploadFile:function(o, callback, uri, postData){

            // Each iframe has an id prefix of "yuiIO" followed
            // by the unique transaction id.
            var oConn = this;
            var frameId = 'yuiIO' + o.tId;
            var uploadEncoding = 'multipart/form-data';
            var io = Y.get(frameId);
            var args = (callback && callback.argument)?callback.argument:null;

            // Track original HTML form attribute values.
            var rawFormAttributes =
            {
                action:this._formNode.getAttribute('action'),
                method:this._formNode.getAttribute('method'),
                target:this._formNode.getAttribute('target')
            };

            // Initialize the HTML form properties in case they are
            // not defined in the HTML form.
            this._formNode.setAttribute('action', uri);
            this._formNode.setAttribute('method', 'POST');
            this._formNode.setAttribute('target', frameId);

            if(this._formNode.encoding){
                // IE does not respect property enctype for HTML forms.
                // Instead it uses the property - "encoding".
                this._formNode.setAttribute('encoding', uploadEncoding);
            }
            else{
                this._formNode.setAttribute('enctype', uploadEncoding);
            }

            var oElements;

            if(postData){
                oElements = this.appendPostData(postData);
            }

            // Start file upload.
            this._formNode.submit();

            // Fire global custom event -- startEvent
            this.startEvent.fire(o, args);

            if(o.startEvent){
                // Fire transaction custom event -- startEvent
                o.startEvent.fire(o, args);
            }

            // Start polling if a callback is present and the timeout
            // property has been defined.
            if(callback && callback.timeout){
                this._timeOut[o.tId] = Y.config.win.setTimeout(function(){ oConn.abort(o, callback, true); }, callback.timeout);
            }

            // Remove HTML elements created by appendPostData
            if(oElements && oElements.length > 0){
                for(var i=0; i < oElements.length; i++){
                    this._formNode.removeChild(oElements[i]);
                }
            }

            // Restore HTML form attributes to their original
            // values prior to file upload.
            for(var prop in rawFormAttributes){
                if(Y.object.owns(rawFormAttributes, prop)){
                    if(rawFormAttributes[prop]){
                        this._formNode.setAttribute(prop, rawFormAttributes[prop]);
                    }
                    else{
                        this._formNode.removeAttribute(prop);
                    }
                }
            }

            // Reset HTML form state properties.
            this.resetFormState();

            // Create the upload callback handler that fires when the iframe
            // receives the load event.  Subsequently, the event handler is detached
            // and the iframe removed from the document.
            var uploadCallback = function()
            {
                if(callback && callback.timeout){
                    Y.config.win.clearTimeout(oConn._timeOut[o.tId]);
                    delete oConn._timeOut[o.tId];
                }

                // Fire global custom event -- completeEvent
                oConn.completeEvent.fire(o, args);

                if(o.completeEvent){
                    // Fire transaction custom event -- completeEvent
                    o.completeEvent.fire(o, args);
                }

                var obj = {};
                obj.tId = o.tId;
                obj.argument = callback.argument;

                try
                {
                    // responseText and responseXML will be populated with the same data from the iframe.
                    // Since the HTTP headers cannot be read from the iframe
                    obj.responseText = io.contentWindow.document.body?io.contentWindow.document.body.innerHTML:io.contentWindow.document.documentElement.textContent;
                    obj.responseXML = io.contentWindow.document.XMLDocument?io.contentWindow.document.XMLDocument:io.contentWindow.document;
                }
                catch(e){}

                if(callback && callback.upload){
                    if(!callback.scope){
                        callback.upload(obj);
                        Y.log('Upload callback.', 'info', 'Connection');
                    }
                    else{
                        callback.upload.apply(callback.scope, [obj]);
                        Y.log('Upload callback with scope.', 'info', 'Connection');
                    }
                }

                // Fire global custom event -- uploadEvent
                oConn.uploadEvent.fire(obj);

                if(o.uploadEvent){
                    // Fire transaction custom event -- uploadEvent
                    o.uploadEvent.fire(obj);
                }

                Y.detach("load", uploadCallback, io);

                setTimeout(
                    function(){
                        Y.config.doc.body.removeChild(io);
                        oConn.releaseObject(o);
                        Y.log('File upload iframe destroyed. Id is:' + frameId, 'info', 'Connection');
                    }, 100);
            };

            // Bind the onload handler to the iframe to detect the file upload response.
            Y.on("load", uploadCallback, io);
        },

      /**
       * @description Method to terminate a transaction, if it has not reached readyState 4.
       * @method abort
       * @public
       * @static
       * @param {object} o The connection object returned by asyncRequest.
       * @param {object} callback  User-defined callback object.
       * @param {string} isTimeout boolean to indicate if abort resulted from a callback timeout.
       * @return {boolean}
       */
        abort:function(o, callback, isTimeout)
        {
            var abortStatus;
            var args = (callback && callback.argument)?callback.argument:null;


            if(o && o.conn){
                if(this.isCallInProgress(o)){
                    // Issue abort request
                    o.conn.abort();

                    Y.config.win.clearInterval(this._poll[o.tId]);
                    delete this._poll[o.tId];

                    if(isTimeout){
                        Y.config.win.clearTimeout(this._timeOut[o.tId]);
                        delete this._timeOut[o.tId];
                    }

                    abortStatus = true;
                }
            }
            else if(o && o.isUpload === true){
                var frameId = 'yuiIO' + o.tId;
                var io = Y.get(frameId);

                if(io){
                    // Remove all listeners on the iframe prior to
                    // its destruction.
                    Y.detach("load", io);
                    // Destroy the iframe facilitating the transaction.
                    Y.config.doc.body.removeChild(io);
                    Y.log('File upload iframe destroyed. Id is:' + frameId, 'info', 'Connection');

                    if(isTimeout){
                        Y.config.win.clearTimeout(this._timeOut[o.tId]);
                        delete this._timeOut[o.tId];
                    }

                    abortStatus = true;
                }
            }
            else{
                abortStatus = false;
            }

            if(abortStatus === true){
                // Fire global custom event -- abortEvent
                this.abortEvent.fire(o, args);

                if(o.abortEvent){
                    // Fire transaction custom event -- abortEvent
                    o.abortEvent.fire(o, args);
                }

                this.handleTransactionResponse(o, callback, true);
                Y.log('Transaction ' + o.tId + ' aborted.', 'info', 'Connection');
            }

            return abortStatus;
        },

      /**
       * @description Determines if the transaction is still being processed.
       * @method isCallInProgress
       * @public
       * @static
       * @param {object} o The connection object returned by asyncRequest
       * @return {boolean}
       */
        isCallInProgress:function(o)
        {
            // if the XHR object assigned to the transaction has not been dereferenced,
            // then check its readyState status.  Otherwise, return false.
            if(o && o.conn){
                return o.conn.readyState !== 4 && o.conn.readyState !== 0;
            }
            else if(o && o.isUpload === true){
                var frameId = 'yuiIO' + o.tId;
                return (Y.get(frameId)) ? true : false;
            }
            else{
                return false;
            }
        },

      /**
       * @description Dereference the XHR instance and the connection object after the transaction is completed.
       * @method releaseObject
       * @private
       * @static
       * @param {object} o The connection object
       * @return {void}
       */
        releaseObject:function(o)
        {
            if(o && o.conn){
                //dereference the XHR instance.
                o.conn = null;

                Y.log('Connection object for transaction ' + o.tId + ' destroyed.', 'info', 'Connection');

                //dereference the connection object.
                o = null;
            }
        }
    });

}, "3.0.0");
YUI.add("yui", function(Y) {
    Y.log(Y.id + ' setup complete) .');
} , "3.0.0", {
    // the following will be bound automatically when this code is loaded
    use: ["lang", "array", "core", "object", "ua", "dump", "substitute", "later", "compat", 
          "event-custom", "event-dom", "event-target", "event-facade", "event-ready", "dom", "io"]
});

// Bind the core modules to the YUI global
YUI._setup();
YAHOO.register("yui", YUI, {version: "@VERSION@", build: "@BUILD@"});
