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
     * @constructor
     * @param o configuration object
     */
    /*global YUI*/
    YUI = function(o) {
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
        var c = this.merge(this.config);
        this.mix(c, {
            debug: true,
            useConsole: true,
            throwFail: false
        });
        this.config = c;

        // this.publish('yui:load');
        // this.publish('yui:log', {
        //     silent: true
        // });
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
     * If the 'debug' config is true, a 'yui:log' event will be
     * dispatched, which the logger widget and anything else
     * can consume.  If the 'useConsole' config is true, it will
     * write to the browser console if available.
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

        var c = this.config;

        if (c.debug) {

            if (c.useConsole && typeof console != 'undefined') {
                var f = (cat && console[cat]) ? cat : 'log',
                    m = (src) ? src + ': ' + msg : msg;
                console[f](m);
            }

            this.fire('yui:log', msg, cat, src);
        }

        return this;
    },

    // Centralizing error messaging means we can configure how
    // they are communicated.
    fail: function(msg, e, eType) {
        this.log(msg, "error");

        if (this.config.throwFail) {
            throw e || new Error(msg);
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
     * @class lang
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

/**
 * Array utilities
 * @class array
 * @static
 */
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
    PROTO = 'prototype',

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
     * @for YUI
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
     * @param merge {boolean} merge objects instead of overwriting/ignoring
     * Used by Y.aggregate
     * @return {YUI} the YUI instance
     */
    Y.mix = function(r, s, ov, wl, mode, merge) {

        if (!s||!r) {
            return Y;
        }

        var w = (wl && wl.length) ? A.hash(wl) : null, m = merge,

            f = function(fr, fs, proto, iwl) {

                var arr = m && L.isArray(fr);

                for (var i in fs) { 

                    // We never want to overwrite the prototype
                    if (PROTO === i) {
                        continue;
                    }

                    // Y.log('i: ' + i + ", " + fs[i]);
                    // @TODO deal with the hasownprop issue

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
                        // @TODO make sure the 'arr' check isn't desructive
                        } else if (!arr && (ov || !fr[i])) {
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
        return Y.mix(r, s, ov, wl, 1);
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
        return Y.mix(r, s, ov, wl, 0, true);
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

        if (o.each && o.item) {
            return o.each.call(o, f, c);
        } else {
            switch (A.test(o)) {
                case 1:
                    return A.each(o, f, c);
                case 2:
                    return A.each(Y.array(o, 0, true), f, c);
                default:

                    // if (o instanceof Y.NodeList) {
                    //     // Y.log('found NodeList ' + o.length());
                    //     for (var i=0, l=o.length(); i<l; i=i+1) {
                    //         f.call(c || o, o.item(i), i, o);
                    //     }
                    //     return Y;
                    // }
                    return Y.object.each(o, f, c);
            }
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
        // if (!f) {
            // Y.log('no f');
        // }
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

    /*
     * Fetch remote content
     * @method io
     * @parameter type {string} get, post, script, css
     * @param c callback for xhr, options for Get
     */
    // Y.io = function(type, url, c) {
    //     switch (type) {
    //         case 'script':
    //             return Y.Get.script(url, c);
    //             break; // get util
    //         case 'css': 
    //             return Y.Get.css(url, c);
    //             break; // get util
    //         default:
    //             return Y.io.asyncRequest.apply(Y.io, arguments);
    //     }
    // };

    // Overload specs: element/selector?/widget?
    Y.get = function() {
        return Y.Doc.get.apply(Y.Doc, arguments);
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
        if (Y.lang.isObject(type) && type.detach) {
            return type.detach();
        } else if (type.indexOf(':') > -1) {
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

        return Y;
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

        return Y;
    };

    // Object factory
    Y.create = function() {

    };

}, "3.0.0");
/**
 * Object utils
 * @class object
 */
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
     * There is a discrepancy between Y.object.owns and
     * Object.prototype.hasOwnProperty when the property is a primitive added to
     * both the instance AND prototype with the same value:
     * <pre>
     * var A = function() {};
     * A.prototype.foo = 'foo';
     * var a = new A();
     * a.foo = 'foo';
     * alert(a.hasOwnProperty('foo')); // true
     * alert(Y.object.owns(a, 'foo')); // false when using fallback
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

        // hack in NodeList support
        // if (o.length && o.item) {
        //     for (var i=0, l=o..get('length'); i<l; i=i+1) {
        //         f.call(s, o.item(i), i, o);
        //     }
        // } else {
        //     for (var i in o) {
        //         if (O.owns(o, i)) {
        //             f.call(s, o[i], i, o);
        //         }
        //     }
        // }

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
     * @class ua
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

    // IE won't enumerate this
    L.hasOwnProperty = Y.object.owns;

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
    Y.EventTarget = function() { };

    Y.EventTarget.prototype = {

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

            // var ce = this.__yui_events[p_type];
            // if (ce) {
            //     ce.subscribe(p_fn, p_obj, p_override);
            // } else {
            //     this.__yui_subscribers = this.__yui_subscribers || {};
            //     var subs = this.__yui_subscribers;
            //     if (!subs[p_type]) {
            //         subs[p_type] = [];
            //     }
            //     subs[p_type].push(
            //         { fn: p_fn, obj: p_obj, override: p_override } );
            // }

            var ce = this.__yui_events[p_type] || this.publish(p_type);
            return ce.subscribe(p_fn, p_obj, p_override);

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

            if (Y.lang.isObject(p_type) && p_type.detach) {
                return p_type.detach();
            }

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
            var opts = p_config || {},
                events = this.__yui_events,
                silent = opts.silent || false,
                context  = opts.context  || this,
                ce = events[p_type];



            if (ce) {
Y.log("Event.Target publish skipped: '"+p_type+"' already exists");

                // update config for the event
                
                ce.context = context;

                // some events are created silent by default, and that
                // setting needs to be preserved.
                if ("silent" in opts) {
                    ce.silent = silent;
                }

                if ("context" in opts) {
                    ce.context = context;
                }

            } else {


ce = new Y.CustomEvent(p_type, context, silent);
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

            if ("fireOnce" in opts) {
                ce.fireOnce = opts.fireOnce;
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
         * @method fire
         * @param p_type    {string}  the type, or name of the event
         * @param arguments {Object*} an arbitrary set of parameters to pass to 
         *                            the handler.
         * @return {boolean} the return value from Event.Custom.fire
         *                   
         */
        fire: function(p_type) {

            this.__yui_events = this.__yui_events || {};
            var ce = this.__yui_events[p_type] || this.publish(p_type);

            //if (!ce) {
// Y.log(p_type + "event fired before it was created.");
                // return null;
                // ce = this.publish(p_type);
            // }

            // var args = [];
            // for (var i=1; i<arguments.length; ++i) {
                // args.push(arguments[i]);
            // }

            return ce.fire.apply(ce, Y.array(arguments, 1, true));
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

    Y.mix(Y, Y.EventTarget.prototype);

}, "3.0.0");
YUI.add("event-custom", function(Y) {

    /**
     * Return value from all subscribe operations
     * @class Event.Handle
     * @constructor
     * @param evt {Event.Custom} the custom event
     * @param sub {Event.Subscriber} the subscriber
     */
    Y.EventHandle = function(evt, sub) {
        if (!evt || !sub) {
            return null;
        }
        /**
         * The custom event
         * @type Event.Custom
         */
        this.evt = evt;

        /**
         * The subscriber object
         * @type Event.Subscriber
         */
        this.sub = sub;
    };

    Y.EventHandle.prototype = {
        /**
         * Detaches this subscriber
         * @method detach
         */
        detach: function() {
            this.evt._delete(this.sub);
        }
    };

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
     *                  Y.Event.Custom.FLAT.
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
        this.silent = silent || (type == "yui:log");

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
        this.signature = signature || Y.CustomEvent.FLAT;

        /**
         * The subscribers to this event
         * @property subscribers
         * @type Event.Subscriber{}
         */
        this.subscribers = {};

        this.log("Creating " + this);

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
         * @return unsubscribe handle
         */
        subscribe: function(fn, obj) {

            if (!fn) {
throw new Error("Invalid callback for CE: '" + this.type + "'");
            }

            var se = this.subscribeEvent;
            if (se) {
                se.fire.apply(se, arguments);
            }

            // bind context and extra params
            var m = (obj) ? Y.bind.apply(obj, arguments) : fn;

            var s = new Y.Subscriber(m);
            s.ofn = fn;

            if (this.fireOnce && this.fired) {
                this.lastError = null;
                this._notify(s);
                if (this.lastError) {
                    throw this.lastError;
                }
            }

            this.subscribers[s.id] = s;

            return new Y.EventHandle(this, s);

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

            // if arg[0] typeof unsubscribe handle
            if (fn && fn.detach) {
                return fn.detach();
            }

            if (!fn) {
                return this.unsubscribeAll();
            }

            var found = false;
            for (var i in this.subscribers) {
                var s = this.subscribers[i];
                if (s && s.contains(fn, obj)) {
                    this._delete(s);
                    found = true;
                }
            }

            return found;
        },

        _notify: function(s, args) {

            this.log(this.type + "->" + ": " +  s);

            var context = s.getScope(this.context), ret;

            if (this.signature == Y.CustomEvent.FLAT) {

                //try {
                    ret = s.fn.apply(context, args);
                // } catch(e) {
                //    this.lastError = e;
//this.log(this + " subscriber exception: " + e, "error");
 //               }

            } else {
                try {
                    ret = s.fn.call(context, this.type, args, s.obj);
                } catch(ex) {
                    this.lastError = ex;
this.log(this + " subscriber exception: " + ex, "error");
                }
            }
            if (false === ret) {
                this.log("Event cancelled by subscriber");

                //break;
                return false;
            }

            return true;
        },

        log: function(msg, cat) {
            if (!this.silent) {
                Y.log(msg, cat || "info", "Event");
            }
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
            // var subs = this.subscribers.slice(), len=subs.length,
            var subs = Y.merge(this.subscribers),
                args=Y.array(arguments, 0, true), ret=true, i, rebuild=false;

            this.log("Firing "       + this  + ", " + 
                     "args: "        + args);
                     // + "subscribers: " + len);

            // if (!len) {
                // return true;
            // }

            var errors = [];

            // for (i=0; i<len; ++i) {
            for (i in subs) {
                var s = subs[i];
                if (!s || !s.fn) {
                    rebuild=true;
                } else {
                    this.lastError = null;
                    ret = this._notify(s, args);
                    if (this.lastError) {
                        errors.push(this.lastError);
                    }
                    if (!ret) {
                        break;
                    }
                }
            }

            this.fired = true;

            if (errors.length) {
throw new Y.ChainedError(this.type + ': 1 or more subscribers threw an error: ' +
                         errors[0].message, errors);
            }

            return ret;
        },

        /**
         * Removes all listeners
         * @method unsubscribeAll
         * @return {int} The number of listeners unsubscribed
         */
        unsubscribeAll: function() {
            // for (var i=0, len=this.subscribers.length; i<len; ++i) {
            for (var i in this.subscribers) {
                this._delete(this.subscribers[i]);
            }

            this.subscribers={};

            return i;
        },

        /**
         * @method _delete
         * @param subscriber object
         * @private
         */
        _delete: function(s) {

            if (s) {
                delete s.fn;
                delete s.obj;
                delete s.ofn;
                delete this.subscribers[s.id];
            }

        },

        /**
         * @method toString
         */
        toString: function() {
             return "'" + this.type + "'";
                  // + "context: " + this.context;

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
         * This is wrappedif obj was supplied.
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

        this.id = Y.stamp(this);

        /**
         * Original function
         */
        this.ofn = null;

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
            return ((this.fn == fn || this.ofn == fn) && this.obj == obj);
        } else {
            return (this.fn == fn || this.ofn == fn);
        }
    };

    /**
     * @method toString
     */
    Y.Subscriber.prototype.toString = function() {
return "Sub { obj: " + this.obj  + ", override: " + (this.override || "no") + " }";
    };

/**
 * ChainedErrors wrap one or more exceptions thrown by a subprocess.
 *
 * @class ChainedError
 * @extends Error
 * @constructor
 * @param message {String} The message to display when the error occurs.
 * @param errors {Error[]} an array containing the wrapped exceptions
 */ 
Y.ChainedError = function (message, errors){

    arguments.callee.superclass.constructor.call(this, message);
    
    /*
     * Error message. Must be duplicated to ensure browser receives it.
     * @type String
     * @property message
     */
    this.message = message;
    
    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    this.name = "ChainedError";

    /**
     * The list of wrapped exception objects
     * @type Error[]
     * @property errors
     */
    this.errors = errors || [];

    /**
     * Pointer to the current exception
     * @type int
     * @property index
     * @default 0
     */
    this.index = 0;
};

Y.extend(Y.ChainedError, Error, {

    /**
     * Returns a fully formatted error message.
     * @method getMessage
     * @return {String} A string describing the error.
     */
    getMessage: function () {
        return this.message;
    },
    
    /**
     * Returns a string representation of the error.
     * @method toString
     * @return {String} A string representation of the error.
     */
    toString: function () {
        return this.name + ": " + this.getMessage();
    },
    
    /**
     * Returns a primitive value version of the error. Same as toString().
     * @method valueOf
     * @return {String} A primitive value version of the error.
     */
    valueOf: function () {
        return this.toString();
    },

    /**
     * Returns the next exception object this instance wraps
     * @method next
     * @return {Error} the error that was thrown by the subsystem.
     */
    next: function() {
        var e = this.errors[this.index] || null;
        this.index++;
        return e;
    },

    /**
     * Append an error object
     * @method add
     * @param e {Error} the error object to append
     */
    add: function(e) {
        this.errors.push(e);
    }

});

}, "3.0.0");
YUI.add("event-dom", function(Y) {

    /*
     * The Event Utility provides utilities for managing DOM Events and tools
     * for building event systems
     *
     * @module event
     * @title Event Utility
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
             * The number of times to poll after window.onload.  This number is
             * increased if additional late-bound handlers are requested after
             * the page load.
             * @property _retryCount
             * @static
             * @private
             */
            var _retryCount = 0;

            /**
             * onAvailable listeners
             * @property _avail
             * @static
             * @private
             */
            var _avail = [];

            /**
             * Custom event wrappers for DOM events.  Key is 
             * 'event:' + Element uid stamp + event type
             * @property _wrappers
             * @type Y.Event.Custom
             * @static
             * @private
             */
            var _wrappers = {};

            /**
             * Custom event wrapper map DOM events.  Key is 
             * Element uid stamp.  Each item is a hash of custom event
             * wrappers as provided in the _wrappers collection.  This
             * provides the infrastructure for getListeners.
             * @property _el_events
             * @static
             * @private
             */
            var _el_events = {};

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
                        _avail.push({id:         a[i], 
                                           fn:         p_fn, 
                                           obj:        p_obj, 
                                           override:   p_override, 
                                           checkReady: checkContent });
                    }
                    _retryCount = this.POLL_RETRYS;
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
                onDOMReady: function(p_fn) {
                    var ev = Y.Event.DOMReadyEvent;
                    ev.subscribe.apply(ev, arguments);
                    // var a = Y.array(arguments, 0, true);
                    // a.unshift('event:ready');
                    // Y.on.apply(Y, a);
                },

                /**
                 * Appends an event handler
                 *
                 * @method addListener
                 *
                 * @param {String|HTMLElement|Array|NodeList} el An id, an element 
                 *  reference, or a collection of ids and/or elements to assign the 
                 *  listener to.
                 * @param {String}   type     The type of event to append
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
                addListener: function(el, type, fn, obj) {

                    Y.log('addListener: ' + Y.lang.dump(Y.array(arguments, 0, true), 1));

                    var a=Y.array(arguments, 1, true), override = a[3], E = Y.Event;

                    if (!fn || !fn.call) {
    // throw new TypeError(type + " addListener call failed, callback undefined");
    Y.log(type + " addListener call failed, invalid callback", "error", "Event");
                        return false;
                    }

                    // The el argument can be an array of elements or element ids.
                    if (this._isValidCollection(el)) {

                        // Y.log('collection: ' + el);

                        var handles=[], h, i, l, proc = function(v, k) {
// handles.push(this.addListener(el[i], type, fn, obj, override));
                            // Y.log('collection stuff: ' + v);
                            var b = a.slice();
                            b.unshift(v);
                            h = E.addListener.apply(E, b);
                            handles.push(h);
                        };

                        Y.each(el, proc, E);

                        return handles;


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
                                // Y.Event.addListener(el, type, fn, obj, override);
                                Y.Event.addListener.apply(Y.Event, Y.array(arguments, 0, true));
                            });

                            return true;
                        }
                    }

                    // Element should be an html element or an array if we get 
                    // here.
                    if (!el) {
                        // this.logger.debug("unable to attach event " + type);
                        return false;
                    }

                    // the custom event key is the uid for the element + type

                    var ek = Y.stamp(el), key = 'event:' + ek + type,
                        ce = _wrappers[key];


                    if (!ce) {
                        // create CE wrapper
                        ce = Y.publish(key, {
                            silent: true
                        });

                        // cache the dom event details in the custom event
                        // for later removeListener calls
                        ce.el = el;
                        ce.type = type;
                        ce.fn = function(e) {
                            ce.fire(Y.Event.getEvent(e));
                        };

                        _wrappers[key] = ce;
                        _el_events[ek] = _el_events[ek] || {};
                        _el_events[ek][key] = ce;

                        // attach a listener that fires the custom event
                        this.nativeAdd(el, type, ce.fn, false);
                    }

        
                    // from type, fn, etc to fn, obj, override
                    a = Y.array(arguments, 2, true);
                    // a = a.shift();

                    var context = el;
                    if (override) {
                        if (override === true) {
                            context = obj;
                        } else {
                            context = override;
                        }
                    }

                    a[1] = context;

                    // Y.log('DOM event f: ' + a[0]);
                    // Y.log('dom event ce sub: ' + Y.lang.dump(a));

                    // var m = a[1] ? Y.bind.apply(context, a) : fn;
                    // return ce.subscribe(m);

                    // set context to element if not specified
                    return ce.subscribe.apply(ce, a);


                },

                /**
                 * Removes an event listener
                 *
                 * @method removeListener
                 *
                 * @param {String|HTMLElement|Array|NodeList} el An id, an element 
                 *  reference, or a collection of ids and/or elements to remove
                 *  the listener from.
                 * @param {String} type the type of event to remove.
                 * @param {Function} fn the method the event invokes.  If fn is
                 *  undefined, then all event handlers for the type of event are 
                 *  removed.
                 * @return {boolean} true if the unbind was successful, false 
                 *  otherwise.
                 * @static
                 */
                removeListener: function(el, type, fn) {

                    if (el && el.detach) {
                        return el.detach();
                    }
                    var i, len, li;

                    // The el argument can be a string
                    if (typeof el == "string") {
                        el = Y.get(el);
                    // The el argument can be an array of elements or element ids.
                    } else if ( this._isValidCollection(el)) {
                        var ok = true;
                        for (i=0,len=el.length; i<len; ++i) {
                            ok = ( this.removeListener(el[i], type, fn) && ok );
                        }
                        return ok;
                    }

                    if (!fn || !fn.call) {
                        // this.logger.debug("Error, function is not valid " + fn);
                        //return false;
                        return this.purgeElement(el, false, type);
                    }


                    var id = 'event:' + Y.stamp(el) + type, 
                        ce = _wrappers[id];
                    if (ce) {
                        return ce.unsubscribe(fn);
                    }

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
                                 (o.each || o.length)              && // o is indexed
                                 !o.tagName            && // o is not an HTML element
                                 !o.alert              && // o is not a window
                                 (o.item || typeof o[0] !== "undefined") );
                    } catch(ex) {
                        Y.log("collection check failure", "warn");
                        return false;
                    }

                },

                /**
                 * Custom event the fires when the dom is initially usable
                 * @event DOMReadyEvent
                 */
                // DOMReadyEvent: new Y.CustomEvent("event:ready", this),
                DOMReadyEvent: Y.publish("event:ready", this, {
                    fireOnce: true
                }),

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
                        E.nativeRemove(document, "DOMContentLoaded", E._ready);
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
                        tryAgain = (_retryCount > 0);
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
                    for (i=0,len=_avail.length; i<len; ++i) {
                        item = _avail[i];
                        if (item && !item.checkReady) {
                            el = Y.get(item.id);
                            if (el) {
                                executeItem(el, item);
                                _avail[i] = null;
                            } else {
                                notAvail.push(item);
                            }
                        }
                    }

                    // onContentReady
                    for (i=0,len=_avail.length; i<len; ++i) {
                        item = _avail[i];
                        if (item && item.checkReady) {
                            el = Y.get(item.id);

                            if (el) {
                                // The element is available, but not necessarily ready
                                // @todo should we test parentNode.nextSibling?
                                if (loadComplete || el.nextSibling) {
                                    executeItem(el, item);
                                    _avail[i] = null;
                                }
                            } else {
                                notAvail.push(item);
                            }
                        }
                    }

                    _retryCount = (notAvail.length === 0) ? 0 : _retryCount - 1;

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
                 * @param {string} type optional type of listener to purge. If
                 * left out, all listeners will be removed
                 * @static
                 */
                purgeElement: function(el, recurse, type) {
                    var oEl = (Y.lang.isString(el)) ? Y.get(el) : el,
                        id = Y.stamp(oEl);
                    var lis = this.getListeners(oEl, type), i, len;
                    if (lis) {
                        for (i=0,len=lis.length; i<len ; ++i) {
                            lis[i].unsubscribeAll();
                        }
                    }

                    if (recurse && oEl && oEl.childNodes) {
                        for (i=0,len=oEl.childNodes.length; i<len ; ++i) {
                            this.purgeElement(oEl.childNodes[i], recurse, type);
                        }
                    }
                },

                /**
                 * Returns all listeners attached to the given element via addListener.
                 * Optionally, you can specify a specific type of event to return.
                 * @method getListeners
                 * @param el {HTMLElement|string} the element or element id to inspect 
                 * @param type {string} optional type of listener to return. If
                 * left out, all listeners will be returned
                 * @return {Y.Custom.Event} the custom event wrapper for the DOM event(s)
                 * @static
                 */           
                getListeners: function(el, type) {
                    var results=[], ek = Y.stamp(el), key = (type) ? 'event:' + type : null,
                        evts = _el_events[ek];

                    if (key) {
                        if (evts[key]) {
                            results.push(evts[key]);
                        }
                    } else {
                        for (var i in evts) {
                            results.push(evts[i]);
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

                    var E = Y.Event, i, w;

                    for (i in _wrappers) {
                        w = _wrappers[i];
                        w.unsubscribeAll();
                        E.nativeRemove(w.el, w.type, w.fn);
                        delete _wrappers[i];
                    }

                    E.nativeRemove(window, "unload", E._unload);
                },

                
                /**
                 * Adds a DOM event directly without the caching, cleanup, context adj, etc
                 *
                 * @method nativeAdd
                 * @param {HTMLElement} el      the element to bind the handler to
                 * @param {string}      type   the type of event handler
                 * @param {function}    fn      the callback to invoke
                 * @param {boolen}      capture capture or bubble phase
                 * @static
                 * @private
                 */
                nativeAdd: function(el, type, fn, capture) {
                    if (el.addEventListener) {
                            el.addEventListener(type, fn, !!capture);
                    } else if (el.attachEvent) {
                            el.attachEvent("on" + type, fn);
                    } 
                    // else {
                      //   Y.log('DOM evt error')
                    // }
                },

                /**
                 * Basic remove listener
                 *
                 * @method nativeRemove
                 * @param {HTMLElement} el      the element to bind the handler to
                 * @param {string}      type   the type of event handler
                 * @param {function}    fn      the callback to invoke
                 * @param {boolen}      capture capture or bubble phase
                 * @static
                 * @private
                 */
                nativeRemove: function(el, type, fn, capture) {
                    if (el.removeEventListener) {
                            el.removeEventListener(type, fn, !!capture);
                    } else if (el.detachEvent) {
                            el.detachEvent("on" + type, fn);
                    }
                }
            };

        }();

        Y.Event.Custom = Y.CustomEvent;
        Y.Event.Target = Y.EventTarget;

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
        return (n && Y.Doc) ? Y.Doc.get(n) : n;
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
            y = e.clientY || 0;

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
        var a = Y.array(arguments, 0, true),
            oEl = a.splice(2, 1);
        a.unshift(oEl[0]);
        return E.addListener.apply(E, a);
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

            E.nativeAdd(document, "DOMContentLoaded", E._ready);

        }
        /////////////////////////////////////////////////////////////

        E._tryPreloadAttach();
    }

    // for the moment each instance will get its own load/unload listeners
    E.nativeAdd(window, "load", E._load);
    E.nativeAdd(window, "unload", E._unload);

}, "3.0.0");
/**
 * The selector module provides helper methods allowing CSS3 Selectors to be used with DOM elements.
 * @module selector
 * @title Selector Utility
 * @namespace Y.util
 * @requires yahoo, dom
 */

YUI.add('selector', function(Y) {
/**
 * Provides helper methods for collecting and filtering DOM elements.
 * @namespace Y.util
 * @class Selector
 * @static
 */
var Selector = function() {};

var reNth = /^(?:([-]?\d*)(n){1}|(odd|even)$)*([-+]?\d*)$/;

Selector.prototype = {
    /**
     * Default document for use queries 
     * @property document
     * @type object
     * @default window.document
     */
    document: Y.config.doc,
    /**
     * Mapping of attributes to aliases, normally to work around HTMLAttributes
     * that conflict with JS reserved words.
     * @property attrAliases
     * @type object
     */
    attrAliases: {
    },

    /**
     * Mapping of shorthand tokens to corresponding attribute selector 
     * @property shorthand
     * @type object
     */
    shorthand: {
        //'(?:(?:[^\\)\\]\\s*>+~,]+)(?:-?[_a-z]+[-\\w]))+#(-?[_a-z]+[-\\w]*)': '[id=$1]',
        '\\#(-?[_a-z]+[-\\w]*)': '[id=$1]',
        '\\.(-?[_a-z]+[-\\w]*)': '[class~=$1]'
    },

    /**
     * List of operators and corresponding boolean functions. 
     * These functions are passed the attribute and the current node's value of the attribute.
     * @property operators
     * @type object
     */
    operators: {
        '=': function(attr, val) { return attr === val; }, // Equality
        '!=': function(attr, val) { return attr !== val; }, // Inequality
        '~=': function(attr, val) { // Match one of space seperated words 
            var s = ' ';
            return (s + attr + s).indexOf((s + val + s)) > -1;
        },
        '|=': function(attr, val) { return getRegExp('^' + val + '[-]?').test(attr); }, // Match start with value followed by optional hyphen
        '^=': function(attr, val) { return attr.indexOf(val) === 0; }, // Match starts with value
        '$=': function(attr, val) { return attr.lastIndexOf(val) === attr.length - val.length; }, // Match ends with value
        '*=': function(attr, val) { return attr.indexOf(val) > -1; }, // Match contains value as substring 
        '': function(attr, val) { return attr; } // Just test for existence of attribute
    },

    /**
     * List of pseudo-classes and corresponding boolean functions. 
     * These functions are called with the current node, and any value that was parsed with the pseudo regex.
     * @property pseudos
     * @type object
     */
    pseudos: {
        'root': function(node) {
            return node === node.ownerDocument.documentElement;
        },

        'nth-child': function(node, val) {
            return getNth(node, val);
        },

        'nth-last-child': function(node, val) {
            return getNth(node, val, null, true);
        },

        'nth-of-type': function(node, val) {
            return getNth(node, val, node.tagName);
        },
         
        'nth-last-of-type': function(node, val) {
            return getNth(node, val, node.tagName, true);
        },
         
        'first-child': function(node) {
            return getChildren(node.parentNode)[0] === node;
        },

        'last-child': function(node) {
            var children = getChildren(node.parentNode);
            return children[children.length - 1] === node;
        },

        'first-of-type': function(node, val) {
            return getChildren(node.parentNode, node.tagName.toLowerCase())[0];
        },
         
        'last-of-type': function(node, val) {
            var children = getChildren(node.parentNode, node.tagName.toLowerCase());
            return children[children.length - 1];
        },
         
        'only-child': function(node) {
            var children = getChildren(node.parentNode);
            return children.length === 1 && children[0] === node;
        },

        'only-of-type': function(node) {
            return getChildren(node.parentNode, node.tagName.toLowerCase()).length === 1;
        },

        'empty': function(node) {
            return node.childNodes.length === 0;
        },

        'not': function(node, simple) {
            return !Selector.test(node, simple);
        },

        'contains': function(node, str) {
            var text = node.innerText || node.textContent || '';
            return text.indexOf(str) > -1;
        },
        'checked': function(node) {
            return node.checked === true;
        }
    },

    /**
     * Test if the supplied node matches the supplied selector.
     * @method test
     *
     * @param {HTMLElement | String} node An id or node reference to the HTMLElement being tested.
     * @param {string} selector The CSS Selector to test the node against.
     * @return{boolean} Whether or not the node matches the selector.
     * @static
    
     */
    test: function(node, selector) {
        node = Selector.document.getElementById(node) || node;

        if (!node) {
            return false;
        }

        var groups = selector ? selector.split(',') : [];
        if (groups.length) {
            for (var i = 0, len = groups.length; i < len; ++i) {
                if ( rTestNode(node, groups[i]) ) { // passes if ANY group matches
                    return true;
                }
            }
            return false;
        }
        return rTestNode(node, selector);
    },

    /**
     * Filters a set of nodes based on a given CSS selector. 
     * @method filter
     *
     * @param {array} nodes A set of nodes/ids to filter. 
     * @param {string} selector The selector used to test each node.
     * @return{array} An array of nodes from the supplied array that match the given selector.
     * @static
     */
    filter: function(nodes, selector) {
        nodes = nodes || [];

        var node,
            result = [],
            tokens = tokenize(selector);

        if (!nodes.item) { // if not HTMLCollection, handle arrays of ids and/or nodes
            Y.log('filter: scanning input for HTMLElements/IDs', 'info', 'Selector');
            for (var i = 0, len = nodes.length; i < len; ++i) {
                if (!nodes[i].tagName) { // tagName limits to HTMLElements 
                    node = Selector.document.getElementById(nodes[i]);
                    if (node) { // skip IDs that return null 
                        nodes[i] = node;
                    } else {
                        Y.log('filter: skipping invalid node', 'warn', 'Selector');
                    }
                }
            }
        }
        result = rFilter(nodes, tokenize(selector)[0]);
        clearParentCache();
        Y.log('filter: returning:' + result.length, 'info', 'Selector');
        return result;
    },

    /**
     * Retrieves a set of nodes based on a given CSS selector. 
     * @method query
     *
     * @param {string} selector The CSS Selector to test the node against.
     * @param {HTMLElement | String} root optional An id or HTMLElement to start the query from. Defaults to Selector.document.
     * @param {Boolean} firstOnly optional Whether or not to return only the first match.
     * @return {Array} An array of nodes that match the given selector.
     * @static
     */
    query: function(selector, root, firstOnly) {
        var result = query(selector, root, firstOnly);
        //Y.log('query: returning ' + result, 'info', 'Selector');
        return result;
    }
};

var query = function(selector, root, firstOnly, deDupe) {
    var result =  (firstOnly) ? null : [];
    if (!selector) {
        return result;
    }

    var groups = selector.split(','); // TODO: handle comma in attribute/pseudo

    if (groups.length > 1) {
        var found;
        for (var i = 0, len = groups.length; i < len; ++i) {
            found = arguments.callee(groups[i], root, firstOnly, true);
            result = firstOnly ? found : result.concat(found); 
        }
        clearFoundCache();
        return result;
    }

    if (root && !root.nodeName) { // assume ID
        root = Selector.document.getElementById(root);
        if (!root) {
            Y.log('invalid root node provided', 'warn', 'Selector');
            return result;
        }
    }

    root = root || Selector.document;
    var tokens = tokenize(selector);
    var idToken = tokens[getIdTokenIndex(tokens)],
        nodes = [],
        node,
        id,
        token = tokens.pop() || {};
        
    if (idToken) {
        id = getId(idToken.attributes);
    }

    // use id shortcut when possible
    if (id) {
        node = Selector.document.getElementById(id);

        if (node && (root.nodeName == '#document' || contains(node, root))) {
            if ( rTestNode(node, null, idToken) ) {
                if (idToken === token) {
                    nodes = [node]; // simple selector
                } else {
                    root = node; // start from here
                }
            }
        } else {
            return result;
        }
    }

    if (root && !nodes.length) {
        nodes = root.getElementsByTagName(token.tag);
    }

    if (nodes.length) {
        result = rFilter(nodes, token, firstOnly, deDupe); 
    }

    clearParentCache();
    return result;
};

var contains = function() {
    if (document.documentElement.contains && !Y.ua.webkit < 422)  { // IE & Opera, Safari < 3 contains is broken
        return function(needle, haystack) {
            return haystack.contains(needle);
        };
    } else if ( document.documentElement.compareDocumentPosition ) { // gecko
        return function(needle, haystack) {
            return !!(haystack.compareDocumentPosition(needle) & 16);
        };
    } else  { // Safari < 3
        return function(needle, haystack) {
            var parent = needle.parentNode;
            while (parent) {
                if (needle === parent) {
                    return true;
                }
                parent = parent.parentNode;
            } 
            return false;
        }; 
    }
}();

var rFilter = function(nodes, token, firstOnly, deDupe) {
    var result = firstOnly ? null : [];

    for (var i = 0, len = nodes.length; i < len; i++) {
        if (! rTestNode(nodes[i], '', token, deDupe)) {
            continue;
        }

        if (firstOnly) {
            return nodes[i];
        }
        if (deDupe) {
            if (nodes[i]._found) {
                continue;
            }
            nodes[i]._found = true;
            foundCache[foundCache.length] = nodes[i];
        }

        result[result.length] = nodes[i];
    }

    return result;
};

var rTestNode = function(node, selector, token, deDupe) {
    token = token || tokenize(selector).pop() || {};

    if (!node.tagName ||
        (token.tag !== '*' && node.tagName.toUpperCase() !== token.tag) ||
        (deDupe && node._found) ) {
        return false;
    }

    if (token.attributes.length) {
        var attribute;
        for (var i = 0, len = token.attributes.length; i < len; ++i) {
            attribute = node.getAttribute(token.attributes[i][0], 2);
            if (attribute === undefined) {
                return false;
            }
            if ( Selector.operators[token.attributes[i][1]] &&
                    !Selector.operators[token.attributes[i][1]](attribute, token.attributes[i][2])) {
                return false;
            }
        }
    }

    if (token.pseudos.length) {
        for (var i = 0, len = token.pseudos.length; i < len; ++i) {
            if (Selector.pseudos[token.pseudos[i][0]] &&
                    !Selector.pseudos[token.pseudos[i][0]](node, token.pseudos[i][1])) {
                return false;
            }
        }
    }

    return (token.previous && token.previous.combinator !== ',') ?
            combinators[token.previous.combinator](node, token) :
            true;
};


var foundCache = [];
var parentCache = [];
var regexCache = {};

var clearFoundCache = function() {
    Y.log('getBySelector: clearing found cache of ' + foundCache.length + ' elements');
    for (var i = 0, len = foundCache.length; i < len; ++i) {
        try { // IE no like delete
            delete foundCache[i]._found;
        } catch(e) {
            foundCache[i].removeAttribute('_found');
        }
    }
    foundCache = [];
    Y.log('getBySelector: done clearing foundCache');
};

var clearParentCache = function() {
    if (!document.documentElement.children) { // caching children lookups for gecko
        return function() {
            for (var i = 0, len = parentCache.length; i < len; ++i) {
                delete parentCache[i]._children;
            }
            parentCache = [];
        };
    } else return function() {}; // do nothing
}();

var getRegExp = function(str, flags) {
    flags = flags || '';
    if (!regexCache[str + flags]) {
        regexCache[str + flags] = new RegExp(str, flags);
    }
    return regexCache[str + flags];
};

var combinators = {
    ' ': function(node, token) {
        while (node = node.parentNode) {
            if (rTestNode(node, '', token.previous)) {
                return true;
            }
        }  
        return false;
    },

    '>': function(node, token) {
        return rTestNode(node.parentNode, null, token.previous);
    },
    '+': function(node, token) {
        var sib = node.previousSibling;
        while (sib && sib.nodeType !== 1) {
            sib = sib.previousSibling;
        }

        if (sib && rTestNode(sib, null, token.previous)) {
            return true; 
        }
        return false;
    },

    '~': function(node, token) {
        var sib = node.previousSibling;
        while (sib) {
            if (sib.nodeType === 1 && rTestNode(sib, null, token.previous)) {
                return true;
            }
            sib = sib.previousSibling;
        }

        return false;
    }
};

var getChildren = function() {
    if (document.documentElement.children) { // document for capability test
        return function(node, tag) {
            return (tag) ? node.children.tags(tag) : node.children || [];
        };
    } else {
        return function(node, tag) {
            if (node._children) {
                return node._children;
            }
            var children = [],
                childNodes = node.childNodes;

            for (var i = 0, len = childNodes.length; i < len; ++i) {
                if (childNodes[i].tagName) {
                    if (!tag || childNodes[i].tagName.toLowerCase() === tag) {
                        children[children.length] = childNodes[i];
                    }
                }
            }
            node._children = children;
            parentCache[parentCache.length] = node;
            return children;
        };
    }
}();

/*
    an+b = get every _a_th node starting at the _b_th
    0n+b = no repeat ("0" and "n" may both be omitted (together) , e.g. "0n+1" or "1", not "0+1"), return only the _b_th element
    1n+b =  get every element starting from b ("1" may may be omitted, e.g. "1n+0" or "n+0" or "n")
    an+0 = get every _a_th element, "0" may be omitted 
*/
var getNth = function(node, expr, tag, reverse) {
    if (tag) tag = tag.toLowerCase();
    reNth.test(expr);
    var a = parseInt(RegExp.$1, 10), // include every _a_ elements (zero means no repeat, just first _a_)
        n = RegExp.$2, // "n"
        oddeven = RegExp.$3, // "odd" or "even"
        b = parseInt(RegExp.$4, 10) || 0, // start scan from element _b_
        result = [];

    var siblings = getChildren(node.parentNode, tag);

    if (oddeven) {
        a = 2; // always every other
        op = '+';
        n = 'n';
        b = (oddeven === 'odd') ? 1 : 0;
    } else if ( isNaN(a) ) {
        a = (n) ? 1 : 0; // start from the first or no repeat
    }

    if (a === 0) { // just the first
        if (reverse) {
            b = siblings.length - b + 1; 
        }

        if (siblings[b - 1] === node) {
            return true;
        } else {
            return false;
        }

    } else if (a < 0) {
        reverse = !!reverse;
        a = Math.abs(a);
    }

    if (!reverse) {
        for (var i = b - 1, len = siblings.length; i < len; i += a) {
            if ( i >= 0 && siblings[i] === node ) {
                return true;
            }
        }
    } else {
        for (var i = siblings.length - b, len = siblings.length; i >= 0; i -= a) {
            if ( i < len && siblings[i] === node ) {
                return true;
            }
        }
    }
    return false;
};

var getId = function(attr) {
    for (var i = 0, len = attr.length; i < len; ++i) {
        if (attr[i][0] == 'id' && attr[i][1] === '=') {
            return attr[i][2];
        }
    }
};

var getIdTokenIndex = function(tokens) {
    for (var i = 0, len = tokens.length; i < len; ++i) {
        if (getId(tokens[i].attributes)) {
            return i;
        }
    }
    return -1;
};

var patterns = {
    tag: /^((?:-?[_a-z]+[\w-]*)|\*)/i,
    attributes: /^\[([a-z]+\w*)+([~\|\^\$\*!=]=?)?['"]?([^\]]*?)['"]?\]/i,
    //attributes: /^\[([a-z]+\w*)+([~\|\^\$\*!=]=?)?['"]?([^'"\]]*)['"]?\]*/i,
    pseudos: /^:([-\w]+)(?:\(['"]?(.+)['"]?\))*/i,
    combinator: /^\s*([>+~]|\s)\s*/
};

/**
    Break selector into token units per simple selector.
    Combinator is attached to left-hand selector.
 */
var tokenize = function(selector) {
    var token = {},     // one token per simple selector (left selector holds combinator)
        tokens = [],    // array of tokens
        id,             // unique id for the simple selector (if found)
        found = false,  // whether or not any matches were found this pass
        match;          // the regex match

    selector = replaceShorthand(selector); // convert ID and CLASS shortcuts to attributes

    /*
        Search for selector patterns, store, and strip them from the selector string
        until no patterns match (invalid selector) or we run out of chars.

        Multiple attributes and pseudos are allowed, in any order.
        for example:
            'form:first-child[type=button]:not(button)[lang|=en]'
    */
    do {
        found = false; // reset after full pass
        for (var re in patterns) {
                if (!Y.object.owns(patterns, re)) {
                    continue;
                }
                if (re != 'tag' && re != 'combinator') { // only one allowed
                    token[re] = token[re] || [];
                }
            if (match = patterns[re].exec(selector)) { // note assignment
                found = true;
                if (re != 'tag' && re != 'combinator') { // only one allowed
                    //token[re] = token[re] || [];

                    // capture ID for fast path to element
                    if (re === 'attributes' && match[1] === 'id') {
                        token.id = match[3];
                    }

                    token[re].push(match.slice(1));
                } else { // single selector (tag, combinator)
                    token[re] = match[1];
                }
                selector = selector.replace(match[0], ''); // strip current match from selector
                if (re === 'combinator' || !selector.length) { // next token or done
                    token.attributes = fixAttributes(token.attributes);
                    token.pseudos = token.pseudos || [];
                    token.tag = token.tag ? token.tag.toUpperCase() : '*';
                    tokens.push(token);

                    token = { // prep next token
                        previous: token
                    };
                }
            }
        }
    } while (found);

    return tokens;
};

var fixAttributes = function(attr) {
    var aliases = Selector.attrAliases;
    attr = attr || [];
    for (var i = 0, len = attr.length; i < len; ++i) {
        if (aliases[attr[i][0]]) { // convert reserved words, etc
            attr[i][0] = aliases[attr[i][0]];
        }
        if (!attr[i][1]) { // use exists operator
            attr[i][1] = '';
        }
    }
    return attr;
};

var replaceShorthand = function(selector) {
    var shorthand = Selector.shorthand;
    var attrs = selector.match(patterns.attributes); // pull attributes to avoid false pos on "." and "#"
    if (attrs) {
        selector = selector.replace(patterns.attributes, 'REPLACED_ATTRIBUTE');
    }
    for (var re in shorthand) {
        if (!Y.object.owns(shorthand, re)) {
            continue;
        }
        selector = selector.replace(getRegExp(re, 'gi'), shorthand[re]);
    }

    if (attrs) {
        for (var i = 0, len = attrs.length; i < len; ++i) {
            selector = selector.replace('REPLACED_ATTRIBUTE', attrs[i]);
        }
    }
    return selector;
};

Selector = new Selector();
Selector.patterns = patterns;
Y.Selector = Selector;

if (Y.ua.ie) { // rewrite class for IE (others use getAttribute('class')
    Y.Selector.attrAliases['class'] = 'className';
    Y.Selector.attrAliases['for'] = 'htmlFor';
}

}, '3.0.0');
/**
 * DOM Abstractions.
 * @module node
 */

YUI.add('node', function(Y) {

    /**
     * A wrapper for DOM Nodes.
     * Node properties can be accessed via the set/get methods.
     * With the exception of the noted properties,
     * only strings, numbers, and booleans are passed through. 
     * Use Y.get() or Y.Doc.get() to create Node instances.
     *
     * @class Node
     */

    var BASE_NODE                   = 0, 
        ELEMENT_NODE                = 1,
        ATTRIBUTE_NODE              = 2,
        TEXT_NODE                   = 3,
        CDATA_SECTION_NODE          = 4,
        ENTITY_REFERENCE_NODE       = 5,
        ENTITY_NODE                 = 6,
        PROCESSING_INSTRUCTION_NODE = 7,
        COMMENT_NODE                = 8,
        DOCUMENT_NODE               = 9,
        DOCUMENT_TYPE_NODE          = 10,
        DOCUMENT_FRAGMENT_NODE      = 11,
        NOTATION_NODE               = 12;


    var RE_VALID_PROP_TYPES = /(?:string|boolean|number)/;

    Y.use('selector'); // TODO: need this?  should be able to "use" from "add"
    var Selector = Y.Selector;
    var _cache = {};

    // private factory
    var create = function(node) {
        if (!node) {
            return null;
        }
        if (!node.nodeName && node.get) {
            return node; // Node instance
        }

        if (node.item && 'length' in node) {
            return new NodeList(node);
        }

        switch(node.nodeType) {
            case ELEMENT_NODE:
                return new Element(node);

            case DOCUMENT_NODE:
                return new Doc(node);

            default: // BASIC NODE (TEXT_NODE, etc.)
                return new Node(node);
        }
    };

    // returns HTMLElement
    var getDOMNode = function(root, node) {
        if (typeof node == 'string') {
            return Selector.query(node, root, true);
        }

        return      (node && node._yuid) ? _cache[node._yuid] :
                    (node && node.nodeName) ?  node :
                    null;
    };

    /** 
     * Wraps the inputs value of the method in a node instance
     * Wraps the return value of the method in a node instance
     * For use with methods that accept and return nodes
     */
    var nodeInOut = function(method, a, b, c, d, e) {
        if (a) { // first 2 may be Node instances or strings
            a = (!a.nodeName) ? getDOMNode(_cache[this._yuid], a) : a;
            if (b) {
                b = (!b.nodeName) ? getDOMNode(_cache[this._yuid], b) : b;
            }
        }
        return create(_cache[this._yuid][method](a, b, c, d, e));
    };

    /** 
     * Wraps the return value of the method in a node instance
     * For use with methods that return nodes
     */
    var nodeOut = function(method, a, b, c, d, e) {
        node = create(_cache[this._yuid][method](a, b, c, d, e));
        return node;
    };

    /** 
     * Passes method directly to HTMLElement
     */
    var rawOut = function(method, a, b, c, d, e) {
        return _cache[this._yuid][method](a, b, c, d, e);
    };

    var PROPS_WRAP = {

        /**
         * Returns a Node instance. 
         * @property parentNode
         * @type Node
         */
        'parentNode': BASE_NODE,

        /**
         * Returns a wrapper instance. 
         * @property childNodes
         * @type NodeList
         */
        'childNodes': BASE_NODE,

        /**
         * Returns a wrapper instance. 
         * @property firstChild
         * @type Node
         */
        'firstChild': BASE_NODE,

        /**
         * Returns a wrapper instance. 
         * @property lastChild
         * @type Node
         */
        'lastChild': BASE_NODE,

        /**
         * Returns a wrapper instance. 
         * @property previousSibling
         * @type Node
         */
        'previousSibling': BASE_NODE,

        /**
         * Returns a wrapper instance. 
         * @property previousSibling
         * @type Node
         */
        'nextSibling': BASE_NODE,

        /**
         * Returns a wrapper instance. 
         * @property ownerDocument
         * @type Doc
         */
        'ownerDocument': BASE_NODE,

        /**
         * Returns a wrapper instance. 
         * Only valid for HTMLElement nodes.
         * @property offsetParent
         * @type Node
         */
        'offsetParent': ELEMENT_NODE,

        // form
        'elements': ELEMENT_NODE
    };

    var PROPS_READ = { // white list (currently all strings|numbers|booleans are allowed)
    };

    var PROPS_WRITE = { // white list (currently all strings|numbers|booleans are allowed)
    };

    var SETTERS = { // custom setters for specific properties

    };

    var GETTERS = {};
    GETTERS[ELEMENT_NODE] = { // custom getters for specific properties
        /**
         * Normalizes nodeInnerText and textContent. 
         * @property text
         * @type String
         */
        'text': function(node) {
            return node.innerText || node.textContent || '';
        },

        /**
         * A NodeList containing only HTMLElement child nodes 
         * @property child
         * @type NodeList
         */
        children: function() {
            return this.queryAll('> *');
        }
    };

    GETTERS[DOCUMENT_NODE] = { // custom getters for specific properties
        /**
         * Document height 
         * @property height
         * @type Number
         */
        'height':  function(doc) {
            var win = doc.defaultView || doc.parentWindow;
            var h = (doc.compatMode != 'CSS1Compat') ?
                    doc.body.scrollHeight : doc.documentElement.scrollHeight; // body first for safari
            return Math.max(h, WIN_GETTERS['height'](win));
        },

        /**
         * Document width 
         * @property width
         * @type Number
         */
        'width':  function(doc) {
            var win = doc.defaultView || doc.parentWindow;
            var w = (doc.compatMode != 'CSS1Compat') ?
                    doc.body.scrollWidth : doc.documentElement.scrollWidth; // body first for safari
            return Math.max(w, WIN_GETTERS['width'](win));
        },

        /**
         * Amount page has been scroll vertically 
         * @property width
         * @type Number
         */
        'scrollTop':  function(doc) {
            return Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);
        },

        /**
         * Amount page has been scroll horizontally 
         * @property width
         * @type Number
         */
        'scrollLeft':  function(doc) {
            return Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
        }
    };

    var METHODS = {};

    METHODS[BASE_NODE] = {
        /**
         * Passes through to DOM method.
         * @method insertBefore
         * @param {String | HTMLElement | Node} node Node to be inserted 
         * @param {String | HTMLElement | Node} refNode Node to be inserted before
         */
        insertBefore: nodeInOut,

        /**
         * Passes through to DOM method.
         * @method replaceChild
         * @param {String | HTMLElement | Node} node Node to be inserted 
         * @param {String | HTMLElement | Node} refNode Node to be replaced 
         * @return {Node} The replaced node 
         */
        replaceChild: nodeInOut,

        /**
         * Passes through to DOM method.
         * @method removeChild
         * @param {String | HTMLElement | Node} node Node to be removed 
         * @return {Node} The removed node 
         */
        removeChild: nodeInOut,

        /**
         * Passes through to DOM method.
         * @method appendChild
         * @param {String | HTMLElement | Node} node Node to be appended 
         * @return {Node} The appended node 
         */
        appendChild: nodeInOut,

        /**
         * Passes through to DOM method.
         * @method cloneNode
         * @param {String | HTMLElement | Node} node Node to be cloned 
         * @return {Node} The clone 
         */
        cloneNode: nodeOut
    };

    var METHODS_INVOKE = {
        'getBoundingClientRect': true,
        'contains': true,
        'compareDocumentPosition': true
    };

    var Node = function(node) {
        if (!node || !node.nodeName) {
            return null;
            throw new Error('Node: invalid node');
        }
        _cache[Y.stamp(this)] = node;
    };

    Node.prototype = {
        /**
         * Set the value of the property/attribute on the HTMLElement bound to this Node.
         * Only strings/numbers/booleans are passed through unless a SETTER exists.
         * @method set
         * @param {String} prop Property to set 
         * @param {any} val Value to apply to the given property
         */
        set: function(prop, val) {
            node = _cache[this._yuid];
            if (prop in SETTERS) { // use custom setter
                SETTERS[prop](node, prop, val); 
            } else if (RE_VALID_PROP_TYPES.test(typeof node[prop]) || prop in PROPS_WRITE) { // safe to write
                node[prop] = val;
            }
            return this;
        },

        /**
         * Get the value of the property/attribute on the HTMLElement bound to this Node.
         * Only strings/numbers/booleans are passed through unless a GETTER exists.
         * @method get
         * @param {String} prop Property to get 
         * @return {any} Current value of the property
         */
        get: function(prop) {
            var val;
            node = _cache[this._yuid];
            if (prop in PROPS_WRAP) { // wrap DOM object (HTMLElement, HTMLCollection, Document, Window)
                val = create(node[prop]);
            } else if (GETTERS[node.nodeType] && GETTERS[node.nodeType][prop]) { // use custom getter
                val = GETTERS[node.nodeType][prop].call(this, node, prop, val);
            } else if (RE_VALID_PROP_TYPES.test(typeof node[prop]) || prop in PROPS_READ) { // safe to read
                val = node[prop];
            }
            return val;
        },

        /**
         * Tests whether or not the bound HTMLElement has any child nodes. 
         * @method hasChildNodes
         * @return {Boolean} Whether or not the HTMLElement has childNodes 
         */
        hasChildNodes: function() {
            return !!_cache[this._yuid].childNodes.length;
        },

        invoke: function(method, a, b, c, d, e) {
            if (a) { // first 2 may be Node instances or strings
                a = (a.nodeName) ? a : getDOMNode(_cache[this._yuid], a);
                if (b) {
                    b = (b.nodeName) ? b : getDOMNode(_cache[this._yuid], b);
                }
            }
           var  node = _cache[this._yuid];
            if (METHODS_INVOKE[method] && node[method]) {
                return node[method](a, b, c, d, e);
            }
            return null;
        },

        /**
         * Tests whether or not the bound HTMLElement can use the given method. 
         * @method hasMethod
         * @param {String} method The method to check for 
         * @return {Boolean} Whether or not the HTMLElement can use the method 
         */
        hasMethod: function(method) {
            return !!(METHODS_INVOKE[method] && _cache[this._yuid][method]);
        },

        //normalize: function() {},
        //isSupported: function(feature, version) {},
        toString: function() {
            return this.get('id') || this.get('nodeName');
        }
    };

    Y.each(METHODS[BASE_NODE], function(fn, method) {
        Node.prototype[method] = function() {
            var args = [].slice.call(arguments, 0);
            args.unshift(method);
            return fn.apply(this, args);
        };
    });

    METHODS[ELEMENT_NODE] = {
        /**
         * Passes through to DOM method.
         * @method getAttribute
         * @param {String} attribute The attribute to retrieve 
         * @return {String} The current value of the attribute 
         */
        getAttribute: rawOut,

        /**
         * Passes through to DOM method.
         * @method setAttribute
         * @param {String} attribute The attribute to set 
         * @param {String} The value to apply to the attribute 
         */
        setAttribute: rawOut,

        /**
         * Passes through to DOM method.
         * @method removeAttribute
         * @param {String} attribute The attribute to be removed 
         */
        removeAttribute: rawOut,

        /**
         * Passes through to DOM method.
         * @method hasAttribute
         * @param {String} attribute The attribute to test for 
         * @return {Boolean} Whether or not the attribute is present 
         */
        hasAttribute: rawOut,

        /**
         * Passes through to DOM method.
         * @method scrollIntoView
         */
        scrollIntoView: rawOut,

        /**
         * Passes through to DOM method.
         * @method getElementsByTagName
         * @param {String} tagName The tagName to collect 
         * @return {NodeList} A NodeList representing the HTMLCollection
         */
        getElementsByTagName: nodeOut,

        /**
         * Passes through to DOM method.
         * @method focus
         */
        focus: rawOut,

        /**
         * Passes through to DOM method.
         * @method blur
         */
        blur: rawOut,

        /**
         * Passes through to DOM method.
         * Only valid on FORM elements
         * @method submit
         */
        submit: rawOut,

        /**
         * Passes through to DOM method.
         * Only valid on FORM elements
         * @method reset
         */
        reset: rawOut

    };


    
    var Element = function(node) {
        Element.superclass.constructor.call(this, node);
    };

    var _createNode = function(data) {
        var frag = Y.config.doc.createElement('div');
        frag.innerHTML = _createHTML(data);
        return frag.firstChild;
    };

    var _createHTML = function(jsonml) {
        var html = [];
        var att = [];

        if (Y.lang.isString(jsonml)) { // text node
            return jsonml;
        }

        if (!jsonml || !jsonml.push) { // isArray
            return ''; // expecting array 
        }

        var tag = jsonml[0];
        if (!Y.lang.isString(tag)) {
            return null; // bad tag error
        }

        for (var i = 1, len = jsonml.length; i < len; ++i) {
            if (typeof jsonml[i] === 'string' || jsonml[i].push) {
                html[html.length] = _createHTML(jsonml[i]);
            } else if (typeof jsonml[i] == 'object') {
                for (var attr in jsonml[i]) {
                    att[att.length] = ' ' + attr + '="' + jsonml[i][attr] + '"';
                }
            }
        }
        return '<' + tag + att.join('') + '>' + html.join('') + '</' + tag + '>';
        
    };

    /** 
     *  Creates a node instance from an HTML string or jsonml
     * @method create
     * @param {String | Array} jsonml HTML string or jsonml
     */
    Element.create = function(jsonml) {
        return new Element(_createNode(jsonml));
    };

    Y.extend(Element, Node, {
        /**
         * Retrieves a single node based on the given CSS selector. 
         * @method query
         *
         * @param {string} selector The CSS selector to test against.
         * @return {Node} A Node instance for the matching HTMLElement.
         */
        query: function(selector) {
            return new Element(Selector.query(selector, _cache[this._yuid], true));
        },

        /**
         * Retrieves a nodeList based on the given CSS selector. 
         * @method queryAll
         *
         * @param {string} selector The CSS selector to test against.
         * @return {NodeList} A NodeList instance for the matching HTMLCollection/Array.
         */
        queryAll: function(selector) {
            return new NodeList(Selector.query(selector, _cache[this._yuid]));
        },

        /**
         * Test if the supplied node matches the supplied selector.
         * @method test
         *
         * @param {string} selector The CSS selector to test against.
         * @return {boolean} Whether or not the node matches the selector.
         */
        test: function(selector) {
            return Selector.test(_cache[this._yuid], selector);
        },

        /**
         * Retrieves a style attribute from the given node.
         * @method getStyle
         * @param {String} attr The style attribute to retrieve. 
         * @return {String} The current value of the style property for the element.
         */
        getStyle: function(attr) {
            var node = _cache[this._yuid];
            var val = node.style[attr];
            var view = node.ownerDocument.defaultView;
            if (val === '') { // TODO: is empty string sufficient?
                if (view && view.getComputedStyle) {
                    val = view.getComputedStyle(node, '')[attr];
                } else if (node.currentStyle) {
                    val =  node.currentStyle[attr];
                }
            }
            if (val === undefined) {
                val = ''; // TODO: more robust
            }
            return val;
        },

        /**
         * Applies a CSS style to a given node.
         * @method getStyle
         * @param {String} attr The style attribute to retrieve. 
         * @return {String} The current value of the style property for the element.
         */
        setStyle: function(attr, val) {
             _cache[this._yuid].style[attr] = val;
        },

        /**
         * Compares nodes to determine if they match.
         * Node instances can be compared to each other and/or HTMLElements/selectors.
         * @method compareTo
         * @param {String | HTMLElement | Node} refNode The reference node to compare to the node.
         * @return {Boolean} True if the nodes match, false if they do not. 
         */
        compareTo: function(refNode) {
            refNode = refNode.nodeName ? refNode : _cache[refNode._yuid];
            return _cache[this._yuid] === refNode;
        },

       /**
         * Returns the nearest ancestor that passes the test applied by supplied boolean method.
         * @method getAncestorBy
         * @param {Function} method - A boolean method for testing elements which receives the element as its only argument.
         * @return {Object} HTMLElement or null if not found
         */
        ancestor: function(test) {
            var node = this;
            while (node = node.get('parentNode')) { // NOTE: assignment
                if ( test(node) ) {
                    Y.log('getAncestorBy returning ' + node, 'info', 'Dom');
                    return node;
                }
            } 

            Y.log('ancestor returning null (no ancestor passed test)', 'error', 'Node');
            return null;
        },

       /**
         * Attaches a handler for the given DOM event.
         * @method addEventListener
         * @param {String} type The type of DOM Event to listen for 
         * @param {Function} fn The handler to call when the event fires 
         * @param {Object} arg An argument object to pass to the handler 
         */
        addEventListener: function(type, fn, arg) {
            Y.Event.nativeAdd(_cache[this._yuid], type, fn, arg);
        },
        
       /**
         * Attaches a handler for the given DOM event.
         * @method removeEventListener
         * @param {String} type The type of DOM Event
         * @param {Function} fn The handler to call when the event fires 
         */
        removeEventListener: function(type, fn) {
            Y.Event.nativeRemove(_cache[this._yuid], type, fn);
        }
    });

    Y.each(METHODS[ELEMENT_NODE], function(fn, method) {
        Element.prototype[method] = function() {
            var args = [].slice.call(arguments, 0);
            args.unshift(method);

            return fn.apply(this, args);
        };
    });


    /** 
     * A wrapper for interacting with DOM elements
     * Usage:
     * <p>Doc.get() // returns Doc instance for current document</p>
     * <p>Doc.get(document) // returns Doc instance for the given document</p>
     * <p>Doc.get('#foo') // returns Node instance</p>
     * 
     * @class Doc
     */
    var Doc = function(node) {
        node = node || Y.config.doc;
        Doc.superclass.constructor.call(this, node);
    };

    
    Doc.get = function(doc, node) {
        if (!doc) {
            return create(Y.config.doc);
        }

        if (doc.nodeName != '#document') {
            node = doc;
            doc = Y.config.doc;
        }
        if (node && typeof node == 'string') {
            node = Selector.query(node, doc, true);
        }
        return create(node);
    };

    /**
     * Retrieves a nodeList based on the given CSS selector. 
     * @method queryAll
     *
     * @param {HTMLDocument} document The document to search against.
     * @param {string} selector The CSS selector to test against.
     * @param {HTMLElement} root The root node to start from.
     * @return {NodeList} A NodeList instance for the matching HTMLCollection/Array.
     */
    Doc.queryAll = function(doc, selector, root) {
        if (doc.nodeName != '#document') {
            selector = doc;
            doc = Y.config.doc;
        }

        root = root || doc;
        nodes = new NodeList(Selector.query(selector, root));
        return nodes;
    };

    /**
     * Returns a wrapper instance. 
     * @property documentElement
     * @type Node
     */
    PROPS_WRAP.documentElement = DOCUMENT_NODE;

    /**
     * Returns a wrapper instance. 
     * @property body
     * @type Node
     */
    PROPS_WRAP.body = DOCUMENT_NODE;


    METHODS[DOCUMENT_NODE] = {
        /**
         * Passes through to DOM method.
         * @method createElement
         * @param {String} tagName The type of element to create 
         * @return {Node} A Node instance bound to the HTMLElement 
         */
        createElement: nodeOut,
        //createDocumentFragment: fragReturn,

        /**
         * Passes through to DOM method.
         * @method createTextNode
         * @param {String} text The text value of the node 
         * @return {Node} A Node instance bound to the TextNode 
         */
        createTextNode: nodeInOut,

        /**
         * Passes through to DOM method.
         * @method getElementsByTagName
         * @param {String} text The text value of the node 
         * @return {Node} A Node instance bound to the TextNode 
         */
        getElementsByTagName: nodeOut,

        //createElementNS: nodeOut,
        //getElementsByTagNameNS: nodeOut,

        /**
         * Passes through to DOM method.
         * @method getElementsById
         * @param {String} id The id to search for 
         * @return {Node} A Node instance bound to the HTMLElement 
         */
        getElementById: nodeOut
    };

    Y.extend(Doc, Node, {
        /**
         * Retrieves a Node instance based on the given CSS selector. 
         * @method query
         *
         * @param {string} selector The CSS selector to test against.
         * @return {NodeList} A NodeList instance for the matching HTMLCollection/Array.
         */
        query: Element.prototype.query,

        /**
         * Retrieves a nodeList based on the given CSS selector. 
         * @method queryAll
         *
         * @param {string} selector The CSS selector to test against.
         * @return {NodeList} A NodeList instance for the matching HTMLCollection/Array.
         */
        queryAll: Element.prototype.queryAll,

        getElementsBy: function(method, test, tag, root, apply) {
            tag = tag || '*';
            doc = doc.nodeName ? new Doc(doc) : doc;

            if (root) {
                root = (root.tagName) ? new Element(root) : (root.get) ? root : null;
            } else {
                root = doc;
            }

            var elements;

            if (root) {
                elements = root.getElementsByTagName(tag);
            } else {
                elements = [];
            }

            var nodes = [],
                item;
            
            for (var i = 0, len = elements.length(); i < len; ++i) {
                item = elements.item(i);
                if ( test(item) ) {
                    nodes[nodes.length] = item;
                    if (apply) {
                        apply(item);
                    }
                }
            }

            Y.log('getElementsBy returning ' + nodes, 'info', 'Dom');
            
            return new Y.NodeList(nodes);
        }
    });

    Y.each(METHODS[DOCUMENT_NODE], function(fn, method) {
        Doc.prototype[method] = function() {
            var args = [].slice.call(arguments, 0);
            args.unshift(method);
            return fn.apply(this, args);
        };
    });

    var NodeList = function(nodes) {
        _cache[Y.stamp(this)] = nodes;
    };

    /** 
     * A wrapper for interacting with DOM elements
     * @class NodeList
     */
    NodeList.prototype = {
        /**
         * Retrieves the Node instance at the given index. 
         * @method item
         *
         * @param {Number} index The index of the target Node.
         * @return {Node} The Node instance at the given index.
         */
        item: function(index) {
            var node = _cache[this._yuid][index];
            return (node && node.tagName) ? create(node) : (node && node.get) ? node : null;
        },

        /**
         * Set the value of the property/attribute on all HTMLElements bound to this NodeList.
         * Only strings/numbers/booleans are passed through unless a SETTER exists.
         * @method set
         * @param {String} prop Property to set 
         * @param {any} val Value to apply to the given property
         * @see Node
         */
        set: function(name, val) {
            var nodes = _cache[this._yuid];
            for (var i = 0, len = nodes.length; i < len; ++i) {
                Node.set(nodes[i], name, val);
            }

            return this;
        },

        /**
         * Get the value of the property/attribute for each of the HTMLElements bound to this NodeList.
         * Only strings/numbers/booleans are passed through unless a GETTER exists.
         * @method get
         * @param {String} prop Property to get 
         * @return {Array} Array containing the current values mapped to the Node indexes 
         * @see Node
         */
        get: function(name) {
            if (name == 'length') {
                return _cache[this._yuid].length;
            }
            var nodes = _cache[this._yuid];
            var ret = [];
            for (var i = 0, len = nodes.length; i < len; ++i) {
                ret[i] = Node.get(nodes[i], name);
            }

            return ret;
        },

        /**
         * Filters the NodeList instance down to only nodes matching the given selector.
         * @method filter
         * @param {String} selector The selector to filter against
         * @return {NodeList} NodeList containing the updated collection 
         * @see Selector
         */
        filter: function(selector) {
            return new NodeList(Selector.filter(_cache[this._yuid], selector));
        },

        /**
         * Applies the given function to each Node in the NodeList.
         * @method each
         * @param {Function} fn The function to apply 
         * @return {NodeList} NodeList containing the updated collection 
         * @see Y.each
         */
        each: function(fn, context) {
            context = context || this;
            var nodes = _cache[this._yuid];
            var node = Doc.get(nodes[i]); // reusing single instance for each node
            for (var i = 0, len = nodes.length; i < len; ++i) {
                _cache[node._yuid] = nodes[i]; // remap Node instance to current node
                fn.call(context, node, i, this);
            }
        }
    };

    Y.each(Element.prototype, function(fn, method) {
        var ret;
        var a = [];
        NodeList.prototype[method] = function(a, b, c, d, e) {
            for (var i = 0, len = nodes.length; i < len; ++i) {
                ret = Element[method].call(Element, nodes[i], a, b, c, d, e);
                if (ret !== Element) {
                    a[i] = ret;
                }
            }

            return a.length ? a : this;
        };
    });

    /**
     * A wrapper for DOM Windows.
     * Window properties can be accessed via the set/get methods.
     * With the exception of the noted properties,
     * only strings, numbers, and booleans are passed through. 
     * Use Win.get() to create new Win instances.
     *
     * @class Win
     */
    // TODO: merge with NODE statics?
    var WIN_PROPS_WRAP = {
        /**
         * Returns a Doc instance wrapping the window.document 
         * @property document
         * @type Doc
         */
        'document': 1,

        /**
         * Returns a Win instance wrapping the window.window 
         * @property window
         * @type Doc
         */
        'window': 1,
        //'top': 1,
        //'opener': 1,
        //'parent': 1,

        /**
         * Returns a Node instance wrapping the window.frameElement 
         * @property frameElement
         * @type Doc
         */
        'frameElement': 1
    };

    var WIN_GETTERS = {
        /**
         * Returns the inner height of the viewport (exludes scrollbar). 
         * @property height
         * @type String
         */
        'height': function(win) {
            var h = win.innerHeight, // Safari, Opera
            doc = win.document,
            mode = doc.compatMode;
        
            if ( (mode || Y.ua.ie) && !Y.ua.opera ) { // IE, Gecko
                h = (mode == 'CSS1Compat') ?
                        doc.documentElement.clientHeight : // Standards
                        doc.body.clientHeight; // Quirks
            }
        
            Y.log('GETTERS:height returning ' + h, 'info', 'Win');
            return h;
        },

        /**
         * Returns the inner width of the viewport (exludes scrollbar). 
         * @property width
         * @type String
         */
        'width': function(win) {
            var w = win.innerWidth, // Safari, Opera
            doc = win.document,
            mode = doc.compatMode;
        
            if ( (mode || Y.ua.ie) && !Y.ua.opera ) { // IE, Gecko
                w = (mode == 'CSS1Compat') ?
                        doc.documentElement.clientWidth : // Standards
                        doc.body.clientWidth; // Quirks
            }
        
            Y.log('GETTERS:width returning ' + w, 'info', 'Win');
            return w;
        }
    };

    var WIN_SETTERS = {};
    var WIN_PROPS_READ = {};
    var WIN_PROPS_WRITE = {};


    var Win = function(win) {
        win = win || Y.config.win; // TODO: abstract window ref?
        _cache[Y.stamp(this)] = win; 
    };

    /**
     * Returns a Win instance bound to the given or current window.
     * @method get
     * @param {Window} win optional window reference. Defaults to current window.
     * @return {Win} A Win instance bound to the given window. 
     * @static
     */
    Win.get = function(win) {
        return new Win(win);
    };

    Win.prototype = {
        /**
         * Get the value of the property/attribute on the window bound to this Win.
         * Only strings/numbers/booleans are passed through unless a GETTER exists.
         * @method get
         * @param {String} prop Property to get 
         * @return {any} Current value of the property
         */
        get: function(prop) {
            var val;
            var node = _cache[this._yuid];
            if (prop in WIN_PROPS_WRAP) { // wrap DOM object (HTMLElement, HTMLCollection, Document, Window)
                val = create(node[prop]);
            } else if (prop in WIN_GETTERS) { // use custom setter
                val = WIN_GETTERS[prop](node, prop, val);
            } else if (RE_VALID_PROP_TYPES.test(typeof node[prop]) || prop in WIN_PROPS_READ) { // safe to read
                val = node[prop];
            }
            return val;
        },

        /**
         * Set the value of the property/attribute on the window bound to this Win.
         * Only strings/numbers/booleans are passed through unless a SETTER exists.
         * @method set
         * @param {String} prop Property to set 
         * @param {any} val Value to apply to the given property
         */
        set: function(prop, val) {
            var node = _cache[this._yuid];
            if (prop in WIN_SETTERS) { // use custom setter
                WIN_SETTERS[prop](node, prop, val); 
            } else if (RE_VALID_PROP_TYPES.test(typeof node[prop]) || prop in WIN_PROPS_WRITE) { // safe to write
                node[prop] = val;
            }
            return this;
        },

        /**
         * Passes through to DOM window.
         * @method scrollTo
         */
        'scrollTo': rawOut,

        /**
         * Passes through to DOM window.
         * @method scrollBy
         */
        'scrollBy': rawOut,

        /**
         * Passes through to DOM window.
         * @method resizeTo
         */
        'resizeTo': rawOut,

        /**
         * Passes through to DOM window.
         * @method resizeBy
         */
        'resizeBy': rawOut,

        /**
         * Passes through to DOM window.
         * @method moveTo
         */
        'moveTo': rawOut,

        /**
         * Passes through to DOM window.
         * @method moveBy
         */
        'moveBy': rawOut


/* TODO: allow?
        'focus': rawOut,
        'blur': rawOut,

        'close': rawOut,
        'open': nodeInOut,

        'forward': rawOut,
        'back': rawOut,
*/
    };


    Y.Node = Element;
    Y.NodeList = NodeList;
    Y.Doc = Doc;
    Y.Win = Win;
}, '3.0.0');
/**
 * Extended interface for Node
 * @module nodeextras
 */

YUI.add('nodeextras', function(Y) {

    /**
     * An interface for advanced DOM features.
     * @interface NodeExtras
     */

    Y.use('node');

    var regexCache = {};
    var getRegExp = function(str, flags) {
        flags = flags || '';
        if (!regexCache[str + flags]) {
            regexCache[str + flags] = new RegExp(str, flags);
        }
        return regexCache[str + flags];
    };

    var NodeExtras = {
        /**
         * Determines whether an HTMLElement has the given className.
         * @method hasClass
         * @param {String} className the class name to search for
         * @return {Boolean | Array} A boolean value or array of boolean values
         */
        hasClass: function(className) {
            var re = getRegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
            return re.test(this.get('className'));
        },

        /**
         * Adds a class name to a given element or collection of elements.
         * @method addClass         
         * @param {String} className the class name to add to the class attribute
         * @return {Boolean | Array} A pass/fail boolean or array of booleans
         */
        addClass: function(className) {
            if (this.hasClass(node, className)) {
                return; // already present
            }
            
            //Y.log('addClass adding ' + className, 'info', 'Node');
            
            this.set('className', Y.lang.trim([this.get('className'), className].join(' ')));
        },

        /**
         * Removes a class name from a given element or collection of elements.
         * @method removeClass         
         * @param {String} className the class name to remove from the class attribute
         * @return {Boolean | Array} A pass/fail boolean or array of booleans
         */
        removeClass: function(className) {
            if (!className || !this.hasClass(className)) {
                return; // not present
            }                 

            //Y.log('removeClass removing ' + className, 'info', 'Node');
            
            this.set('className', Y.lang.trim(this.get('className').replace(getRegExp('(?:^|\\s+)'
                    + className + '(?:\\s+|$)'), ' ')));

            if ( this.hasClass(className) ) { // in case of multiple adjacent
                this.removeClass(className);
            }
        },

        /**
         * Replace a class with another class for a given element or collection of elements.
         * If no oldClassName is present, the newClassName is simply added.
         * @method replaceClass  
         * @param {String} oldClassName the class name to be replaced
         * @param {String} newClassName the class name that will be replacing the old class name
         * @return {Boolean | Array} A pass/fail boolean or array of booleans
         */
        replaceClass: function(newC, oldC) {
            //Y.log('replaceClass replacing ' + oldC + ' with ' + newC, 'info', 'Node');
        
            if ( !this.hasClass(oldC) ) {
                this.addClass(newC); // just add it if nothing to replace
                return; // NOTE: return
            }
        
            var re = getRegExp('(?:^|\\s+)' + oldC + '(?:\\s+|$)');
            this.set('className', this.get('className').replace(re, ' ' + newC + ' '));

            if ( this.hasClass(oldC) ) { // in case of multiple adjacent
                this.replaceClass(oldC, newC);
            }

            this.set('className', Y.lang.trim(this.get('className'))); // remove any trailing spaces
        },

        /**
         * Returns the previous sibling that is an HTMLElement. 
         * Returns the nearest HTMLElement sibling if no method provided.
         * @method getPreviousSiblingBy
         * @param {Function} method A boolean function used to test siblings
         * that receives the sibling node being tested as its only argument
         * @return {Node} Node instance or null if not found
         */
        previousSibling: function(method) {
            var node = this;
            while (node) {
                node = node.get('previousSibling');
                if ( node && node.get('nodeType') === 1 ) {
                    return node;
                }
            }
            return null;
        }, 

        /**
         * Returns the next HTMLElement sibling that passes the boolean method. 
         * Returns the nearest HTMLElement sibling if no method provided.
         * @method getNextSiblingBy
         * @param {Function} method A boolean function used to test siblings
         * that receives the sibling node being tested as its only argument
         * @return {Object} HTMLElement or null if not found
         */
        nextSibling: function(method) {
            var node = this;
            while (node) {
                node = node.get('nextSibling');
                if ( node && node.get('nodeType') === 1 ) {
                    return node;
                }
            }
            return null;
        },
        
        /**
         * Determines whether an HTMLElement is an ancestor of another HTML element in the DOM hierarchy.
         * @method contains
         * @param {String | HTMLElement} needle The possible descendent
         * @return {Boolean} Whether or not this node is an ancestor of needle
         */
        contains: function(needle) {
            needle = Y.Doc.get(needle);
            if (this.hasMethod('contains'))  {
                return this.invoke('contains', needle);
            } else if ( this.hasMethod('compareDocumentPosition') ) { // gecko
                return !!(this.invoke('compareDocumentPosition', needle) & 16);
            }
        },

        /**
         * Gets the current position of an element based on page coordinates. 
         * Element must be part of the DOM tree to have page coordinates
         * (display:none or elements not appended return false).
         * @method getXY
         * @return {Array} The XY position of the element

         TODO: test inDocument/display
         */
        getXY: function() {
            if (Y.Doc.get().get('documentElement').getBoundingClientRect) {
                return function() {
                    var doc = this.get('ownerDocument'),
                        body = doc.get('body');
                        scrollLeft = Math.max(doc.get('scrollLeft'), body.get('scrollLeft')),
                        scrollTop = Math.max(doc.get('scrollTop'), body.get('scrollTop')),
                        box = this.invoke('getBoundingClientRect'),
                        xy = [box.left, box.top];

                    if ((scrollTop || scrollLeft) && this.getStyle('position') != 'fixed') { // no scroll accounting for fixed
                        xy[0] += scrollLeft;
                        xy[1] += scrollTop;
                    }
                    return xy;
                };
            } else {
                return function(xy) { // manually calculate by crawling up offsetParents
                    var xy = [this.get('offsetLeft'), this.get('offsetTop')];

                    var parentNode = this;
                    while (parentNode = parentNode.get('offsetParent')) {
                        xy[0] += parentNode.get('offsetLeft');
                        xy[1] += parentNode.get('offsetTop');
                    }

                    // account for any scrolled ancestors
                    if (this.getStyle('position') != 'fixed') {
                        parentNode = this;
                        var scrollTop, scrollLeft;

                        while (parentNode = parentNode.get('parentNode')) {
                            scrollTop = parentNode.get('scrollTop');
                            scrollLeft = parentNode.get('scrollLeft');

                            if (scrollTop || scrollLeft) {
                                xy[0] -= scrollLeft;
                                xy[1] -= scrollTop;
                            }
                        }

                    }
                    return xy;
                };
            }
        }(),// NOTE: Executing for loadtime branching

        /**
         * Set the position of an html element in page coordinates, regardless of how the element is positioned.
         * The element(s) must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method setXY
         * @param {Array} xy Contains X & Y values for new position (coordinates are page-based)
         * @param {Boolean} noRetry By default we try and set the position a second time if the first fails
         */
        setXY: function(xy, noRetry) {
            var pos = this.getStyle('position'),
                delta = [ // assuming pixels; if not we will have to retry
                    parseInt( this.getStyle('left'), 10 ),
                    parseInt( this.getStyle('top'), 10 )
                ];
        
            if (pos == 'static') { // default to relative
                pos = 'relative';
                this.setStyle('position', pos);
            }

            var currentXY = this.getXY();
            if (currentXY === false) { // has to be part of doc to have xy
                YAHOO.log('xy failed: node not available', 'error', 'Node');
                return false; 
            }
            
            if ( isNaN(delta[0]) ) {// in case of 'auto'
                delta[0] = (pos == 'relative') ? 0 : this.get('offsetLeft');
            } 
            if ( isNaN(delta[1]) ) { // in case of 'auto'
                delta[1] = (pos == 'relative') ? 0 : this.get('offsetTop');
            } 

            if (pos[0] !== null) {
                this.setStyle('left', xy[0] - currentXY[0] + delta[0] + 'px');
            }

            if (pos[1] !== null) {
                this.setStyle('top', xy[1] - currentXY[1] + delta[1] + 'px');
            }
          
            if (!noRetry) {
                var newXY = this.getXY();

                // if retry is true, try one more time if we miss 
               if ( (xy[0] !== null && newXY[0] != xy[0]) || 
                    (xy[1] !== null && newXY[1] != xy[1]) ) {
                   this.setXY(xy, true);
               }
            }        

            Y.log('setXY setting position to ' + xy, 'info', 'Node');
        }
    
    };

    Y.mix(Y.Node, NodeExtras, 0, null, 4);

}, '3.0.0');
YUI.add("io", function (Y) {

	// Transaction event handlers map
	var _E = ['start', 'complete', 'success', 'failure', 'abort'];

	// Window reference
	var w = Y.config.win;

	// Transaction id counter
	var transactionId = 0;

	// HTTP headers map
	var _headers = {
		'X-Requested-With' : 'XMLHttpRequest'
	};

	// Timeout map
	var _timeout = {};

	// Transaction queue and queue properties
	var _q = [];
	var _qState = 1;
	var _qMaxSize = false;

	/* Define Queue Functions */
	function _queue(uri, c) {

		if (_qMaxSize === false || _q.length < _qMaxSize) {
			var id = _id();
			_q.push({ uri: uri, id: id, cfg:c });
		}
		else {
			Y.log('Unable to queue transaction object.  Maximum queue size reached.', 'warn', 'io');
			return false;
		}

		if (_qState === 1) {
			_shift();
		}

		Y.log('Object queued.  Transaction id is' + id, 'info', 'io');
		return id;
	};

	function _unshift(id) {
		var r;

		for (var i = 0; i < _q.length; i++) {
			if (_q[i].id === id) {
				r = _q.splice(i, 1);
				var p = _q.unshift(r[0]);
				Y.log('Object promoted to top of queue.  Transaction id is' + id, 'info', 'io');
				break;
			}
		}
	};

	function _shift() {
		var c = _q.shift();
		_io(c.uri, c.cfg, c.id);
	};

	function _size(i) {
		if (i) {
			_qMaxSize = i;
			Y.log('Queue size set to ' + i, 'info', 'io');
			return i;
		}
		else {
			return _q.length;
		}
	};

	function _start() {
		var len = (_q.length > _qMaxSize > 0) ? _qMaxSize : _q.length;

		if (len > 1) {
			for (var i=0; i < len; i++) {
				_shift();
			}
		}
		else {
			_shift();
		}

		Y.log('Queue started.', 'info', 'io');
	};

	function _stop() {
		_qState = 0;
		Y.log('Queue stopped.', 'info', 'io');
	};

	function _purge(id) {
		if (Y.lang.isNumber(id)) {
			for (var i = 0; i < _q.length; i++) {
				if (_q[i].id === id) {
					_q.splice(i, 1);
					Y.log('Object purged from queue.  Transaction id is' + id, 'info', 'io');
					break;
				}
			}
		}
	};
	/* End Queue Functions */

	/* --- Define Constructor --- */
	function _io(uri, c, id) {
		// Create transaction object

		var o = _create(Y.lang.isNumber(id) ? id : null);
		var m = (c && c.method) ? c.method.toUpperCase() : 'GET';
		var d = (c && c.data) ? c.data : null;

		/* Determine configuration properties */
		if(c){
			// If config.timeout is defined, initialize timeout poll.
			if (c.timeout) {
				_startTimeout(o, c);
			}

			// If config.form is defined, perform data operations.
			if (c.form) {
				// Serialize the HTML form into a string of name-value pairs.
				var f = _serialize(c.form);
				// If config.data is defined, concatenate the data to the form string.
				if (d) {
					f += "&" + d;
					Y.log('Configuration object.data added to serialized HTML form data. The string is: ' + f, 'info', 'io');
				}

				if (m === 'POST') {
					d = f;
					_setHeader('Content-Type', 'application/x-www-form-urlencoded');
					Y.log('Content-Type set to *application/x-www-form-urlencoded* for HTML form POST.', 'info', 'io');
				}
				else if (m === 'GET') {
					uri = _concat(uri, f);
					Y.log('Configuration object.data added to serialized HTML form data. The querystring is: ' + uri, 'info', 'io');
				}
			}
			else if (d && m === 'GET') {
				uri = _concat(uri, c.data);
				Y.log('Configuration object data added to URI. The querystring is: ' + uri, 'info', 'io');
			}
			else if (d && m === 'POST') {
				_setHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
				Y.log('Content-Type set to *application/x-www-form-urlencoded; charset=UTF-8* for POST transaction.', 'info', 'io');
			}

			if (c.on) {
				_tEvents(o, c);
				Y.log('Transaction Event handlers detected. Transaction id is' + o.id, 'info', 'io');
			}
		}

		/* End Configuration Properties */

		o.c.onreadystatechange = function() { _readyState(o, c); };
		_open(o.c, m, uri);
		_setHeaders(o.c, (c && c.headers) ? c.headers : {});
		_async(o, (d || ''), c);

		o.abort = function () {
			_abort(o, c);
		}

		o.status = function() {
			return o.c.readyState !== 4 && o.c.readyState !== 0;
		}

		return o;
	};
	/* --- End Constructor --- */

	function _tEvents(o, c){
		for(var i = 0; i < _E.length; i++) {
			if(c.on[_E[i]]) {
				o['t:' + _E[i]] = new Y.Event.Target().publish(_E[i]);
				Y.log('Transaction Event t:' + _E[i] + ' published for transaction ' + o.id, 'info', 'io');
				o['t:' + _E[i]].subscribe(c.on[_E[i]], c.context, c.arguments );
				Y.log('Transaction Event t:' + _E[i] + ' subscribed for transaction ' + o.id, 'info', 'io');
			}
		}
	};

	function _transport(t){
		return (w.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
	};

	function _id(){
		var id = transactionId;
		transactionId++;

		Y.log('Transaction id generated. The id is: ' + id, 'info', 'io');
		return id;
	}

	function _create(i, t) {

		var o = {};
		o.id = Y.lang.isNumber(i) ? i : _id();
		o.c = _transport(t);

		return o;
	};

	function _concat(s, d) {
		s += ((s.indexOf('?') == -1) ? '?' : '&') + d;
		return s;
	};

	function _setHeader(l, v) {
		if (v) {
			_headers[l] = v;
		}
		else {
			delete _headers[l];
		}
	};

	function _setHeaders(o, h) {

		var p;

		for (p in _headers) {
			if (_headers.hasOwnProperty(p)) {
				h[p] = _headers[p];
				Y.log('Default HTTP header ' + p + ' found with value of ' + _headers[p], 'info', 'io');
			}
		}

		for (p in h) {
			if (h.hasOwnProperty(p)) {
				o.setRequestHeader(p, h[p]);
				Y.log('HTTP Header ' + p + ' set with value of ' + h[p], 'info', 'io');
			}
		}
	};

	function _open(o, m, uri) {
		o.open(m, uri, true);
	};

	function _async(o, d, c) {
		o.c.send(d);
		var a = (c && c.arguments) ? c.arguments : null;
		// Fire global "io:start" event
		Y.fire('io:start', o.id);

		// Fire transaction "start" event
		if (o['t:start']) {
			o['t:start'].fire(o.id, a);
		}
		Y.log('Transaction ' + o.id + ' started.', 'info', 'io');
	};

	function _startTimeout(o, c) {
		_timeout[o.id] = w.setTimeout(function() { _abort(o, c); }, c.timeout);
	};

	function _clearTimeout(id) {
		w.clearTimeout(_timeout[id]);
		delete _timeout[id];
	};

	function _readyState(o, c) {

		if (o.c.readyState === 4) {

			if (c && c.timeout) {
				_clearTimeout(o.id);
			}

			// Fire global "io:complete" event
			Y.fire('io:complete', o.id, o.c);

			if (o['t:complete']) {
				o['t:complete'].fire(o.id, o.c, c.arguments);
			}

			Y.log('Transaction ' + o.id + ' completed.', 'info', 'io');
			_handleResponse(o, c);
		}
	};

	function _handleResponse(o, c) {

		try{
			if (o.c.status && o.c.status !== 0) {
				status = o.c.status;
			}
			else {
				status = 0;
			}
		}
		catch(e) {
			status = 0;
			Y.log('HTTP status unreadable. The transaction is: ' + o.id, 'warn', 'io');
		}

		/*
		 * IE reports HTTP 204 as HTTP 1223.
		 * However, the response data are still available.
		 */
		if (status >= 200 && status < 300 || status === 1223) {
			// Fire global "io:success" event
			Y.fire('io:success', o.id, o.c);

			if (o['t:success']) {
				o['t:success'].fire(o.id, o.c, c.arguments);
			}
			Y.log('HTTP Status evaluates to Success. The transaction is: ' + o.id, 'info', 'io');
		}
		else {
			// Fire global "io:failure" event
			Y.fire('io:failure', o.id, o.c);

			if (o['t:failure']) {
				o['t:failure'].fire(o.id, o.c, c.arguments);
			}
			Y.log('HTTP Status evaluates to Failure. The transaction is: ' + o.id, 'info', 'io');
		}

		_destroy(o, c);
	};

	function _abort(o, c) {

		var a = (c && c.arguments) ? c.arguments : null;

		if(o && o.c) {
			o.c.abort();

			if (c) {
				if (c.timeout) {
					_clearTimeout(o.id);
				}
			}
			// Fire global "io:abort" event
			Y.fire('io:abort', o.id);

			if (o['t:abort']) {
				o['t:abort'].fire(o.id, a);
			}

			Y.log('Transaction timeout or explicit abort. The transaction is: ' + o.id, 'info', 'io');

			_destroy(o);
		}
	};

	function _destroy(o) {
		// IE6 will throw a "Type Mismatch" error if the event handler is set to "null".
		if(w.XMLHttpRequest) {
			o.c.onreadystatechange = null;
		}

		o.c = null;
		o = null;
	};

	/* start HTML form serialization */
	function _serialize(o) {
		var str = '';
		var f = (typeof o.id == 'object') ? o.id : Y.config.doc.getElementById(o.id);
		var useDf = o.useDisabled || false;
		var eUC = encodeURIComponent;
		var e, n, v, dF;

		// Iterate over the form elements collection to construct the name-value pairs.
		for (var i=0; i < f.elements.length; i++) {
			e = f.elements[i];
			dF = e.disabled;
			n = e.name;
			v = e.value;

			if ((useDf) ? n : (n && dF));
			{
				switch(e.type)
				{
					case 'select-one':
					case 'select-multiple':
						for (var j = 0; j < e.options.length; j++) {
							if (e.options[j].selected) {
								if (Y.ua.ie) {
									str += eUC(n) + '=' + eUC(e.options[j].attributes['value'].specified ? e.options[j].value : e.options[j].text) + '&';
								}
								else {
									str += eUC(n) + '=' + eUC(e.options[j].hasAttribute('value') ? e.options[j].value : e.options[j].text) + '&';
								}
							}
						}
						break;
					case 'radio':
					case 'checkbox':
						if (e.checked) {
							str += eUC(n) + '=' + eUC(v) + '&';
						}
						break;
					case 'file':
					case undefined:
					case 'reset':
					case 'button':
						break;
					case 'submit':
					default:
						str += eUC(n) + '=' + eUC(v) + '&';
				}
			}
		}

		Y.log('HTML form serialized. The value is: ' + str.substr(0, str.length - 1), 'info', 'io');
		return str.substr(0, str.length - 1);
	};
	/* end form serialization */

	/* yui.io HTTP header interface definition*/
	_io.header = _setHeader;
	/* end yui.io interface */

	/* queue interface definition*/
	_io.queue = _queue;
	_io.queue.size = _size;
	_io.queue.start = _start;
	_io.queue.stop = _stop;
	_io.queue.promote = _unshift;
	_io.queue.purge = _purge;
	/* end queue interface */

	Y.io = _io;

}, "3.0.0");

YUI.add("get", function(Y) {
    
        var ua=Y.ua, 
        L=Y.lang;

/*
 * Provides a mechanism to fetch remote resources and
 * insert them into a document
 * @module get
 */

/**
 * Fetches and inserts one or more script or link nodes into the document 
 * @class Get
 * @static
 */
Y.Get = function() {

    /**
     * hash of queues to manage multiple requests
     * @property queues
     * @private
     */
    var queues={}, 
        
    /**
     * queue index used to generate transaction ids
     * @property qidx
     * @type int
     * @private
     */
        qidx=0, 
        
    /**
     * node index used to generate unique node ids
     * @property nidx
     * @type int
     * @private
     */
        nidx=0, 

        // ridx=0,

        // sandboxFrame=null,

    /**
     * interal property used to prevent multiple simultaneous purge 
     * processes
     * @property purging
     * @type boolean
     * @private
     */
        purging=false;

    
    /** 
     * Generates an HTML element, this is not appended to a document
     * @method _node
     * @param type {string} the type of element
     * @param attr {string} the attributes
     * @param win {Window} optional window to create the element in
     * @return {HTMLElement} the generated node
     * @private
     */
    var _node = function(type, attr, win) {
        var w = win || window, d=w.document, n=d.createElement(type);

        for (var i in attr) {
            if (attr[i] && Y.object.owns(attr, i)) {
                n.setAttribute(i, attr[i]);
            }
        }

        return n;
    };

    /**
     * Generates a link node
     * @method _linkNode
     * @param url {string} the url for the css file
     * @param win {Window} optional window to create the node in
     * @return {HTMLElement} the generated node
     * @private
     */
    var _linkNode = function(url, win, charset) {
        var c = charset || "utf-8";
        return _node("link", {
                "id":      "yui__dyn_" + (nidx++),
                "type":    "text/css",
                "charset": c,
                "rel":     "stylesheet",
                "href":    url
            }, win);
    };

    /**
     * Generates a script node
     * @method _scriptNode
     * @param url {string} the url for the script file
     * @param win {Window} optional window to create the node in
     * @return {HTMLElement} the generated node
     * @private
     */
    var _scriptNode = function(url, win, charset) {
        var c = charset || "utf-8";
        return _node("script", {
                "id":      "yui__dyn_" + (nidx++),
                "type":    "text/javascript",
                "charset": c,
                "src":     url
            }, win);
    };

    /**
     * Returns the data payload for callback functions
     * @method _returnData
     * @private
     */
    var _returnData = function(q, msg) {
        return {
                tId: q.tId,
                win: q.win,
                data: q.data,
                nodes: q.nodes,
                msg: msg,
                purge: function() {
                    _purge(this.tId);
                }
            };
    };

    var _get = function(nId, tId) {
        var q = queues[tId],
            n = (L.isString(nId)) ? q.win.document.getElementById(nId) : nId;
        if (!n) {
            _fail(tId, "target node not found: " + nId);
        }

        return n;
    };

    /*
     * The request failed, execute fail handler with whatever
     * was accomplished.  There isn't a failure case at the
     * moment unless you count aborted transactions
     * @method _fail
     * @param id {string} the id of the request
     * @private
     */
    var _fail = function(id, msg) {
        Y.log("get failure: " + msg, "warn", "Get");
        var q = queues[id];
        // execute failure callback
        if (q.onFailure) {
            var sc=q.scope || q.win;
            q.onFailure.call(sc, _returnData(q, msg));
        }
    };

    /**
     * The request is complete, so executing the requester's callback
     * @method _finish
     * @param id {string} the id of the request
     * @private
     */
    var _finish = function(id) {
        Y.log("Finishing transaction " + id);
        var q = queues[id];
        q.finished = true;

        if (q.aborted) {
            var msg = "transaction " + id + " was aborted";
            _fail(id, msg);
            return;
        }

        // execute success callback
        if (q.onSuccess) {
            var sc=q.scope || q.win;
            q.onSuccess.call(sc, _returnData(q));
        }
    };

    /**
     * Loads the next item for a given request
     * @method _next
     * @param id {string} the id of the request
     * @param loaded {string} the url that was just loaded, if any
     * @private
     */
    var _next = function(id, loaded) {
        Y.log("_next: " + id + ", loaded: " + loaded, "info", "Get");
        var q = queues[id];

        if (q.aborted) {
            var msg = "transaction " + id + " was aborted";
            _fail(id, msg);
            return;
        }

        if (loaded) {
            q.url.shift(); 
            if (q.varName) {
                q.varName.shift(); 
            }
        } else {
            // This is the first pass: make sure the url is an array
            q.url = (L.isString(q.url)) ? [q.url] : q.url;
            if (q.varName) {
                q.varName = (L.isString(q.varName)) ? [q.varName] : q.varName;
            }
        }

        var w=q.win, d=w.document, h=d.getElementsByTagName("head")[0], n;

        if (q.url.length === 0) {
            // Safari 2.x workaround - There is no way to know when 
            // a script is ready in versions of Safari prior to 3.x.
            // Adding an extra node reduces the problem, but doesn't
            // eliminate it completely because the browser executes
            // them asynchronously. 
            if (q.type === "script" && ua.webkit && ua.webkit < 420 && 
                    !q.finalpass && !q.varName) {
                // Add another script node.  This does not guarantee that the
                // scripts will execute in order, but it does appear to fix the
                // problem on fast connections more effectively than using an
                // arbitrary timeout.  It is possible that the browser does
                // block subsequent script execution in this case for a limited
                // time.
                var extra = _scriptNode(null, q.win, q.charset);
                extra.innerHTML='Y.Get._finalize("' + id + '");';
                q.nodes.push(extra); h.appendChild(extra);

            } else {
                _finish(id);
            }

            return;
        } 


        var url = q.url[0];
        Y.log("attempting to load " + url, "info", "Get");

        if (q.type === "script") {
            n = _scriptNode(url, w, q.charset);
        } else {
            n = _linkNode(url, w, q.charset);
        }

        // track this node's load progress
        _track(q.type, n, id, url, w, q.url.length);

        // add the node to the queue so we can return it to the user supplied callback
        q.nodes.push(n);

        // add it to the head or insert it before 'insertBefore'
        if (q.insertBefore) {
            var s = _get(q.insertBefore, id);
            if (s) {
                s.parentNode.insertBefore(n, s);
            }
        } else {
            h.appendChild(n);
        }
        
        Y.log("Appending node: " + url, "info", "Get");

        // FireFox does not support the onload event for link nodes, so there is
        // no way to make the css requests synchronous. This means that the css 
        // rules in multiple files could be applied out of order in this browser
        // if a later request returns before an earlier one.  Safari too.
        if ((ua.webkit || ua.gecko) && q.type === "css") {
            _next(id, url);
        }
    };

    /**
     * Removes processed queues and corresponding nodes
     * @method _autoPurge
     * @private
     */
    var _autoPurge = function() {

        if (purging) {
            return;
        }

        purging = true;
        for (var i in queues) {
            var q = queues[i];
            if (q.autopurge && q.finished) {
                _purge(q.tId);
                delete queues[i];
            }
        }

        purging = false;
    };

    /**
     * Removes the nodes for the specified queue
     * @method _purge
     * @private
     */
    var _purge = function(tId) {
        var q=queues[tId];
        if (q) {
            var n=q.nodes, l=n.length, d=q.win.document, 
                h=d.getElementsByTagName("head")[0];

            if (q.insertBefore) {
                var s = _get(q.insertBefore, tId);
                if (s) {
                    h = s.parentNode;
                }
            }

            for (var i=0; i<l; i=i+1) {
                h.removeChild(n[i]);
            }
        }
        q.nodes = [];
    };

    /**
     * Saves the state for the request and begins loading
     * the requested urls
     * @method queue
     * @param type {string} the type of node to insert
     * @param url {string} the url to load
     * @param opts the hash of options for this request
     * @private
     */
    var _queue = function(type, url, opts) {

        var id = "q" + (qidx++);
        opts = opts || {};

        if (qidx % Y.Get.PURGE_THRESH === 0) {
            _autoPurge();
        }

        queues[id] = Y.merge(opts, {
            tId: id,
            type: type,
            url: url,
            finished: false,
            nodes: []
        });

        var q = queues[id];
        q.win = q.win || window;
        q.scope = q.scope || q.win;
        q.autopurge = ("autopurge" in q) ? q.autopurge : 
                      (type === "script") ? true : false;

        L.later(0, q, _next, id);

        return {
            tId: id
        };
    };

    /**
     * Detects when a node has been loaded.  In the case of
     * script nodes, this does not guarantee that contained
     * script is ready to use.
     * @method _track
     * @param type {string} the type of node to track
     * @param n {HTMLElement} the node to track
     * @param id {string} the id of the request
     * @param url {string} the url that is being loaded
     * @param win {Window} the targeted window
     * @param qlength the number of remaining items in the queue,
     * including this one
     * @param trackfn {Function} function to execute when finished
     * the default is _next
     * @private
     */
    var _track = function(type, n, id, url, win, qlength, trackfn) {
        var f = trackfn || _next;

        // IE supports the readystatechange event for script and css nodes
        if (ua.ie) {
            n.onreadystatechange = function() {
                var rs = this.readyState;
                if ("loaded" === rs || "complete" === rs) {
                    Y.log(id + " onload " + url, "info", "Get");
                    f(id, url);
                }
            };

        // webkit prior to 3.x is problemmatic
        } else if (ua.webkit) {

            if (type === "script") {

                // Safari 3.x supports the load event for script nodes (DOM2)
                if (ua.webkit >= 420) {

                    n.addEventListener("load", function() {
                        Y.log(id + " DOM2 onload " + url, "info", "Get");
                        f(id, url);
                    });

                // Nothing can be done with Safari < 3.x except to pause and hope
                // for the best, particularly after last script is inserted. The
                // scripts will always execute in the order they arrive, not
                // necessarily the order in which they were inserted.  To support
                // script nodes with complete reliability in these browsers, script
                // nodes either need to invoke a function in the window once they
                // are loaded or the implementer needs to provide a well-known
                // property that the utility can poll for.
                } else {
                    // Poll for the existence of the named variable, if it
                    // was supplied.
                    var q = queues[id];
                    if (q.varName) {
                        var freq=Y.Get.POLL_FREQ;
                        Y.log("Polling for " + q.varName[0]);
                        q.maxattempts = Y.Get.TIMEOUT/freq;
                        q.attempts = 0;
                        q._cache = q.varName[0].split(".");
                        q.timer = L.later(freq, q, function(o) {
                            var a=this._cache, l=a.length, w=this.win, i;
                            for (i=0; i<l; i=i+1) {
                                w = w[a[i]];
                                if (!w) {
                                    // if we have exausted our attempts, give up
                                    this.attempts++;
                                    if (this.attempts++ > this.maxattempts) {
                                        var msg = "Over retry limit, giving up";
                                        q.timer.cancel();
                                        _fail(id, msg);
                                    } else {
                                        Y.log(a[i] + " failed, retrying");
                                    }
                                    return;
                                }
                            }
                            
                            Y.log("Safari poll complete");

                            q.timer.cancel();
                            f(id, url);

                        }, null, true);
                    } else {
                        L.later(Y.Get.POLL_FREQ, null, f, [id, url]);
                    }
                }
            } 

        // FireFox and Opera support onload (but not DOM2 in FF) handlers for
        // script nodes.  Opera, but not FF, supports the onload event for link
        // nodes.
        } else { 
            n.onload = function() {
                Y.log(id + " onload " + url, "info", "Get");
                f(id, url);
            };
        }
    };

    return {

        /**
         * The default poll freqency in ms, when needed
         * @property POLL_FREQ
         * @static
         * @type int
         * @default 10
         */
        POLL_FREQ: 10,

        /**
         * The number of request required before an automatic purge.
         * property PURGE_THRESH
         * @static
         * @type int
         * @default 20
         */
        PURGE_THRESH: 20,

        /**
         * The length time to poll for varName when loading a script in
         * Safari 2.x before the transaction fails.
         * property TIMEOUT
         * @static
         * @type int
         * @default 2000
         */
        TIMEOUT: 2000,
        
        /**
         * Called by the the helper for detecting script load in Safari
         * @method _finalize
         * @param id {string} the transaction id
         * @private
         */
        _finalize: function(id) {
            Y.log(id + " finalized ", "info", "Get");
            L.later(0, null, _finish, id);
        },

        /**
         * Abort a transaction
         * @method abort
         * @param {string|object} either the tId or the object returned from
         * script() or css()
         */
        abort: function(o) {
            var id = (L.isString(o)) ? o : o.tId;
            var q = queues[id];
            if (q) {
                Y.log("Aborting " + id, "info", "Get");
                q.aborted = true;
            }
        }, 

        /**
         * Fetches and inserts one or more script nodes into the head
         * of the current document or the document in a specified window.
         *
         * @method script
         * @static
         * @param url {string|string[]} the url or urls to the script(s)
         * @param opts {object} Options: 
         * <dl>
         * <dt>onSuccess</dt>
         * <dd>
         * callback to execute when the script(s) are finished loading
         * The callback receives an object back with the following
         * data:
         * <dl>
         * <dt>win</dt>
         * <dd>the window the script(s) were inserted into</dd>
         * <dt>data</dt>
         * <dd>the data object passed in when the request was made</dd>
         * <dt>nodes</dt>
         * <dd>An array containing references to the nodes that were
         * inserted</dd>
         * <dt>purge</dt>
         * <dd>A function that, when executed, will remove the nodes
         * that were inserted</dd>
         * <dt>
         * </dl>
         * </dd>
         * <dt>onFailure</dt>
         * <dd>
         * callback to execute when the script load operation fails
         * The callback receives an object back with the following
         * data:
         * <dl>
         * <dt>win</dt>
         * <dd>the window the script(s) were inserted into</dd>
         * <dt>data</dt>
         * <dd>the data object passed in when the request was made</dd>
         * <dt>nodes</dt>
         * <dd>An array containing references to the nodes that were
         * inserted successfully</dd>
         * <dt>purge</dt>
         * <dd>A function that, when executed, will remove any nodes
         * that were inserted</dd>
         * <dt>
         * </dl>
         * </dd>
         * <dt>scope</dt>
         * <dd>the execution context for the callbacks</dd>
         * <dt>win</dt>
         * <dd>a window other than the one the utility occupies</dd>
         * <dt>autopurge</dt>
         * <dd>
         * setting to true will let the utilities cleanup routine purge 
         * the script once loaded
         * </dd>
         * <dt>data</dt>
         * <dd>
         * data that is supplied to the callback when the script(s) are
         * loaded.
         * </dd>
         * <dt>varName</dt>
         * <dd>
         * variable that should be available when a script is finished
         * loading.  Used to help Safari 2.x and below with script load 
         * detection.  The type of this property should match what was
         * passed into the url parameter: if loading a single url, a
         * string can be supplied.  If loading multiple scripts, you
         * must supply an array that contains the variable name for
         * each script.
         * </dd>
         * <dt>insertBefore</dt>
         * <dd>node or node id that will become the new node's nextSibling</dd>
         * </dl>
         * <dt>charset</dt>
         * <dd>Node charset, default utf-8</dd>
         * <pre>
         * // assumes yahoo, dom, and event are already on the page
         * &nbsp;&nbsp;Y.Get.script(
         * &nbsp;&nbsp;["http://yui.yahooapis.com/2.3.1/build/dragdrop/dragdrop-min.js",
         * &nbsp;&nbsp;&nbsp;"http://yui.yahooapis.com/2.3.1/build/animation/animation-min.js"], &#123;
         * &nbsp;&nbsp;&nbsp;&nbsp;onSuccess: function(o) &#123;
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Y.log(o.data); // foo
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;new Y.DDProxy("dd1"); // also new o.reference("dd1"); would work
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.log("won't cause error because Y is the scope");
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.log(o.nodes.length === 2) // true
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// o.purge(); // optionally remove the script nodes immediately
         * &nbsp;&nbsp;&nbsp;&nbsp;&#125;,
         * &nbsp;&nbsp;&nbsp;&nbsp;onFailure: function(o) &#123;
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Y.log("transaction failed");
         * &nbsp;&nbsp;&nbsp;&nbsp;&#125;,
         * &nbsp;&nbsp;&nbsp;&nbsp;data: "foo",
         * &nbsp;&nbsp;&nbsp;&nbsp;scope: Y,
         * &nbsp;&nbsp;&nbsp;&nbsp;// win: otherframe // target another window/frame
         * &nbsp;&nbsp;&nbsp;&nbsp;autopurge: true // allow the utility to choose when to remove the nodes
         * &nbsp;&nbsp;&#125;);
         * </pre>
         * @return {tId: string} an object containing info about the transaction
         */
        script: function(url, opts) { 
            return _queue("script", url, opts); 
        },

        /**
         * Fetches and inserts one or more css link nodes into the 
         * head of the current document or the document in a specified
         * window.
         * @method css
         * @static
         * @param url {string} the url or urls to the css file(s)
         * @param opts Options: 
         * <dl>
         * <dt>onSuccess</dt>
         * <dd>
         * callback to execute when the css file(s) are finished loading
         * The callback receives an object back with the following
         * data:
         * <dl>win</dl>
         * <dd>the window the link nodes(s) were inserted into</dd>
         * <dt>data</dt>
         * <dd>the data object passed in when the request was made</dd>
         * <dt>nodes</dt>
         * <dd>An array containing references to the nodes that were
         * inserted</dd>
         * <dt>purge</dt>
         * <dd>A function that, when executed, will remove the nodes
         * that were inserted</dd>
         * <dt>
         * </dl>
         * </dd>
         * <dt>scope</dt>
         * <dd>the execution context for the callbacks</dd>
         * <dt>win</dt>
         * <dd>a window other than the one the utility occupies</dd>
         * <dt>data</dt>
         * <dd>
         * data that is supplied to the callbacks when the nodes(s) are
         * loaded.
         * </dd>
         * <dt>insertBefore</dt>
         * <dd>node or node id that will become the new node's nextSibling</dd>
         * <dt>charset</dt>
         * <dd>Node charset, default utf-8</dd>
         * </dl>
         * <pre>
         *      Y.Get.css("http://yui.yahooapis.com/2.3.1/build/menu/assets/skins/sam/menu.css");
         * </pre>
         * <pre>
         *      Y.Get.css(["http://yui.yahooapis.com/2.3.1/build/menu/assets/skins/sam/menu.css",
         *                          "http://yui.yahooapis.com/2.3.1/build/logger/assets/skins/sam/logger.css"]);
         * </pre>
         * @return {tId: string} an object containing info about the transaction
         */
        css: function(url, opts) {
            return _queue("css", url, opts); 
        }
    };
}();

}, "3.0.0");
YUI.add("yui", function(Y) {
    Y.log(Y.id + ' setup complete) .');
} , "3.0.0", {
    // the following will be bound automatically when this code is loaded
    use: ["lang", "array", "core", "object", "ua", "dump", "substitute", "later", 
          "compat", 
          "event-target", "event-custom", "event-dom", "event-facade", "event-ready",
          "node", 
          "io", 
          "get"]
});

// Bind the core modules to the YUI global
YUI._setup();
