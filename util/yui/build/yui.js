(function() {

    var _instances = {},

// @TODO: this needs to be created at build time from module metadata

        _APPLY_TO_WHITE_LIST = {
            'io.xdrReady': 1,
            'io.start': 1,
            'io.success': 1,
            'io.failure': 1,
            'io.abort': 1
        };
        

if (typeof YUI === 'undefined' || !YUI) {

    /**
     * The YUI global namespace object.  If YUI is already defined, the
     * existing YUI object will not be overwritten so that defined
     * namespaces are preserved.  
     *
     * @class YUI
     * @constructor
     * @global
     * @uses Event.Target
     * @param o Optional configuration object.  Options:
     * <dl>
     *  <dt>debug</dt>
     *  <dd>Turn debug statements on or off</dd>
     *  <dt>useConsole</dt>
     *  <dd>Log to the browser console if debug is on and the console is available</dd>
     *  <dt>logInclude</dt>
     *  <dd>A list of log sources that should be logged.  If specified, only log messages from these sources will be logged.</dd>
     *  <dt>logExclude</dt>
     *  <dd>A list of log sources that should be not be logged.  If specified, all sources are logged if not on this list.</dd>
     *  <dt>throwFail</dt>
     *  <dd>If throwFail is set, Y.fail will generate or re-throw a JS error.  Otherwise the failure is logged.
     *  <dt>win</dt>
     *  <dd>The target window/frame</dd>
     *  <dt>core</dt>
     *  <dd>A list of modules that defines the YUI core (overrides the default)</dd>
     *  <dt>-----</dt><dd>-------------------------------------------------------------------</dd>
     *  <dt>For event and get:</dt>
     *  <dd>-------------------------------------------------------------------</dd>
     *  <dt>pollInterval</dt>
     *  <dd>The default poll interval</dd>
     *  <dt>-----</dt><dd>-------------------------------------------------------------------</dd>
     *  <dt>For loader</dt>
     *  <dd>-------------------------------------------------------------------</dd>
     *  <dt>base</dt>
     *  <dd>The base dir</dd>
     *  <dt>secureBase</dt>
     *  <dd>The secure base dir (not implemented)</dd>
     *  <dt>comboBase</dt>
     *  <dd>The YUI combo service base dir. Ex: http://yui.yahooapis.com/combo?</dd>
     *  <dt>root</dt>
     *  <dd>The root path to prepend to module names for the combo service. Ex: 2.5.2/build/</dd>
     *  <dt>filter</dt>
     *  <dd>
     *
     * A filter to apply to result urls.  This filter will modify the default
     * path for all modules.  The default path for the YUI library is the
     * minified version of the files (e.g., event-min.js).  The filter property
     * can be a predefined filter or a custom filter.  The valid predefined 
     * filters are:
     * <dl>
     *  <dt>DEBUG</dt>
     *  <dd>Selects the debug versions of the library (e.g., event-debug.js).
     *      This option will automatically include the logger widget</dd>
     *  <dt>RAW</dt>
     *  <dd>Selects the non-minified version of the library (e.g., event.js).</dd>
     * </dl>
     * You can also define a custom filter, which must be an object literal 
     * containing a search expression and a replace string:
     * <pre>
     *  myFilter: &#123; 
     *      'searchExp': "-min\\.js", 
     *      'replaceStr': "-debug.js"
     *  &#125;
     * </pre>
     *
     *  </dd>
     *  <dt>combine</dt>
     *  <dd>Use the YUI combo service to reduce the number of http connections required to load your dependencies</dd>
     *  <dt>ignore</dt>
     *  <dd>A list of modules that should never be dynamically loaded</dd>
     *  <dt>force</dt>
     *  <dd>A list of modules that should always be loaded when required, even if already present on the page</dd>
     *  <dt>insertBefore</dt>
     *  <dd>Node or id for a node that should be used as the insertion point for new nodes</dd>
     *  <dt>charset</dt>
     *  <dd>charset for dynamic nodes</dd>
     *  <dt>timeout</dt>
     *  <dd>number of milliseconds before a timeout occurs when dynamically loading nodes.  in not set, there is no timeout</dd>
     *  <dt>context</dt>
     *  <dd>execution context for all callbacks</dd>
     *  <dt>onSuccess</dt>
     *  <dd>callback to subscribe to the 'success' event</dd>
     *  <dt>onFailure</dt>
     *  <dd>callback to subscribe to the 'failure' event</dd>
     *  <dt>onTimeout</dt>
     *  <dd>callback to subscribe to the 'timeout' event</dd>
     *  <dt>-----</dt><dd>-------------------------------------------------------------------</dd>
     * </dl>
     */

    /*global YUI*/
    YUI = function(o) {
        var Y = this;
        // Allow var yui = YUI() instead of var yui = new YUI()
        if (Y == window) {
            return new YUI(o);
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
        

        o = o || {};

        // find targeted window and @TODO create facades
        var w = (o.win) ? (o.win.contentWindow) : o.win  || window;
        o.win = w;
        o.doc = w.document;
        o.debug = ('debug' in o) ? o.debug : true;
        o.useConsole = ('useConsole' in o) ? o.debug : true;
    
        // add a reference to o for anything that needs it
        // before _setup is called.
        this.config = o;

        this.Env = {
            // @todo expand the new module metadata
            mods: {},
            _idx: 0,
            _pre: 'yuid',
            _used: {},
            _attached: {},
            _yidx: 0,
            _uidx: 0
        };

        if (YUI.Env) {
            this.Env._yidx = ++YUI.Env._idx;
            this.id = this.stamp(this);
            _instances[this.id] = this;
        }

        this.constructor = YUI;

    },
    
    /**
     * Finishes the instance setup. Attaches whatever modules were defined
     * when the yui modules was registered.
     * @method _setup
     * @private
     */
    _setup: function(o) {
        this.use("yui");
        // @TODO eval the need to copy the config
        this.config = this.merge(this.config);
    },

    /**
     * Executes a method on a YUI instance with
     * the specified id if the specified method is whitelisted.
     * @method applyTo
     * @param id {string} the YUI instance id
     * @param method {string} the name of the method to exectute.
     * Ex: 'Object.keys'
     * @param args {Array} the arguments to apply to the method
     * @return the return value from the applied method or null
     */
    applyTo: function(id, method, args) {

        if (!(method in _APPLY_TO_WHITE_LIST)) {
            this.fail(method + ': applyTo not allowed');
            return null;
        }

        var instance = _instances[id];

        if (instance) {

            var nest = method.split('.'), m = instance;

            for (var i=0; i<nest.length; i=i+1) {

                m = m[nest[i]];

                if (!m) {
                    this.fail('applyTo not found: ' + method);
                }
            }

            return m.apply(instance, args);
        }

        return null;
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

        YUI.Env.mods[name] = m;

        return this; // chain support
    },

    _attach: function(r, fromLoader) {

        var mods = YUI.Env.mods,
            attached = this.Env._attached;

        for (var i=0, l=r.length; i<l; i=i+1) {
            var name = r[i], m = mods[name], mm;
            if (!attached[name] && m) {

                attached[name] = true;

                var d = m.details, req = d.requires, use = d.use;

                if (req) {
                    this._attach(this.Array(req));
                }


                m.fn(this);

                if (use) {
                    this._attach(this.Array(use));
                }
            }
        }

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

        var Y = this, 
            a=Array.prototype.slice.call(arguments, 0), 
            mods = YUI.Env.mods, 
            used = Y.Env._used,
            loader, 
            firstArg = a[0], 
            dynamic = false,
            callback = a[a.length-1];


        // The last argument supplied to use can be a load complete callback
        if (typeof callback === 'function') {
            a.pop();
            Y.Env._callback = callback;
        } else {
            callback = null;
        }

        // YUI().use('*'); // bind everything available
        if (firstArg === "*") {
            a = [];
            for (var k in mods) {
                if (mods.hasOwnProperty(k)) {
                    a.push(k);
                }
            }

            // if (callback) {
                // a.push(callback);
            // }

            return Y.use.apply(Y, a);

        }
       

        // use loader to optimize and sort the requirements if it
        // is available.
        if (Y.Loader) {
            dynamic = true;
            loader = new Y.Loader(Y.config);
            loader.require(a);
            loader.ignoreRegistered = true;
            loader.calculate();
            a = loader.sorted;
        }


        var missing = [], r = [], f = function(name) {

            // only attach a module once
            if (used[name]) {
                return;
            }

            var m = mods[name], j, req, use;

            if (m) {
                used[name] = true;

                if (dynamic) {
                    // Y.mix(l, YUI.Env.mods);
                    m.fn(Y);
                }

                req = m.details.requires;
                use = m.details.use;
            } else {
                missing.push(name);
            }

            // make sure requirements are attached
            if (req) {
                if (Y.Lang.isString(req)) {
                    f(req);
                } else {
                    for (j = 0; j < req.length; j = j + 1) {
                        f(req[j]);
                    }
                }
            }

            // add this module to full list of things to attach
            r.push(name);

            // auto-attach sub-modules
            /*
            if (use) {
                if (Y.Lang.isString(use)) {
                    f(use);
                } else {
                    for (j = 0; j < use.length; j = j + 1) {
                        f(use[j]);
                    }
                }
            }
            */
        };

        // process each requirement and any additional requirements 
        // the module metadata specifies
        for (var i=0, l=a.length; i<l; i=i+1) {
            f(a[i]);
        }


        var onComplete = function(fromLoader) {


            if (Y.Env._callback) {

                var cb = Y.Env._callback;
                Y.Env._callback = null;
                cb(Y, fromLoader);
            }

            if (Y.fire) {
                Y.fire('yui:load', Y, fromLoader);
            }
        };


        if (Y.Loader && missing.length) {
            // dynamic load
            loader = new Y.Loader(Y.config);
            // loader.subscribe('success', onComplete, Y);
            // loader.subscribe('failure', onComplete, Y);
            // loader.subscribe('timeout', onComplete, Y);
            loader.onSuccess = onComplete;
            loader.onFailure = onComplete;
            loader.onTimeout = onComplete;
            loader.require(missing);
            // loader calls use to automatically attach when finished
            // but we still need to execute the callback.
            loader.insert();
        } else {
            Y._attach(r);
            onComplete();
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

    // this is replaced if the log module is included
    log: function() {

    },

    /**
     * Report an error.  The reporting mechanism is controled by
     * the 'throwFail' configuration attribute.  If throwFail is
     * not specified, the message is written to the logger, otherwise
     * a JS error is thrown
     * @method fail
     * @param msg {string} the failure message
     * @param e {Error} Optional JS error that was caught.  If supplied
     * and throwFail is specified, this error will be re-thrown.
     * @return {YUI} this YUI instance
     */
    fail: function(msg, e) {
        var instance = this;
        instance.log(msg, "error"); // don't scrub this one

        if (this.config.throwFail) {
            throw e || new Error(msg);
        }

        return this;
    },

    /**
     * Generate an id that is unique among all YUI instances
     * @method guid
     * @param pre {string} optional guid prefix
     * @return {string} the guid
     */
    guid: function(pre) {
        var e = this.Env, p = (pre) || e._pre;
        return p +'-' + e._yidx + '-' + e._uidx++;
    },

    /**
     * Stamps an object with a guid.  If the object already
     * has one, a new one is not created
     * @method stamp
     * @param o The object to stamp
     * @return {string} The object's guid
     */
    stamp: function(o) {

        if (!o) {
            return o;
        }

        var uid = (typeof o === 'string') ? o : o._yuid;

        if (!uid) {
            uid = this.guid();
            o._yuid = uid;
        }

        return uid;
    }
};

// Give the YUI global the same properties as an instance.
// This makes it so that the YUI global can be used like the YAHOO
// global was used prior to 3.x.  More importantly, the YUI global
// provides global metadata, so env needs to be configured.
// @TODO review

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
YUI.add("log", function(instance) {

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
    instance.log = function(msg, cat, src) {

        var Y = instance, c = Y.config, es = Y.Env._eventstack,
            bail = (es && es.logging);

        // suppress log message if the config is off or the event stack
        // or the event call stack contains a consumer of the yui:log event
        if (c.debug && !bail) {

            if (c.useConsole && typeof console != 'undefined') {

                // apply source filters
                if (src) {


                    var exc = c.logExclude, inc = c.logInclude;

                    // console.log('checking src filter: ' + src + ', inc: ' + inc + ', exc: ' + exc);

                    if (inc && !(src in inc)) {
                        // console.log('bail: inc list found, but src is not in list: ' + src);
                        bail = true;
                    } else if (exc && (src in exc)) {
                        // console.log('bail: exc list found, and src is in it: ' + src);
                        bail = true;
                    }
                }

                if (!bail) {

                    var f = (cat && console[cat]) ? cat : 'log',
                        m = (src) ? src + ': ' + msg : msg;
                    console[f](m);
                }
            }

            // category filters are not used to suppress the log event
            // so that the data can be stored and displayed later.
            if (Y.fire) {
                Y.fire('yui:log', msg, cat, src);
            }
        }

        return Y;
    };

}, "@VERSION@");

YUI.add("lang", function(Y) {

    /**
     * Provides the language utilites and extensions used by the library
     * @class Lang
     */
    Y.Lang = Y.Lang || {};

    var L = Y.Lang, SPLICE="splice", LENGTH="length";

    /**
     * Determines whether or not the provided object is an array.
     * Testing typeof/instanceof/constructor of arrays across frame 
     * boundaries isn't possible in Safari unless you have a reference
     * to the other frame to test against its Array prototype.  To
     * handle this case, we test well-known array properties instead.
     * properties.
     * @TODO can we kill this cross frame hack?
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
        
    /**
     * Determines whether or not the supplied object is a date instance
     * @method isDate
     * @return {boolean} true if it is a date
     */
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

}, "@VERSION@");


/**
 * YUI core
 * @module yui
 */

/**
 * Array utilities
 * @TODO investigate using Array subclasses for some of this
 * @class Array
 * @static
 */
YUI.add("array", function(Y) {

    var L = Y.Lang, Native = Array.prototype;

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
    Y.Array = function(o, i, al) {
        var t = (al) ? 2 : Y.Array.test(o);
        switch (t) {
            case 1:
                return (i) ? o.slice(o, i) : o;
            case 2:
                return Native.slice.call(o, i || 0);
            default:
                return [o];
        }
    };

    var A = Y.Array;
    
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


    /**
     * Returns the index of the first item in the array
     * that contains the specified value, -1 if the
     * value isn't found.
     * @TODO use native method if avail
     * @method indexOf
     * @param a {Array} the array to search
     * @param val the value to search for
     * @return the index of the item that contains the value or -1
     */
    A.indexOf = function(a, val) {
        for (var i=0; i<a.length; i=i+1) {
            if (a[i] === val) {
                return i;
            }
        }

        return -1;
    };

}, "@VERSION@");
// requires lang
YUI.add("core", function(Y) {

    var L = Y.Lang, 
    A = Y.Array,
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
    _iefix = (Y.UA && Y.UA.ie) ?
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
        //var a=arguments, o=Y.Object(a[0]);
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
     *
     * @TODO add constants for the modes
     *
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
     * @return the augmented object
     * @TODO review for PR2
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
                    // if (PROTO === i) {
                    if (PROTO === i || '_yuid' === i) {
                        continue;
                    }

                    // @TODO deal with the hasownprop issue

                    // check white list if it was supplied
                    if (!w || iwl || (i in w)) {
                        // if the receiver has this property, it is an object,
                        // and merge is specified, merge the two objects.
                        if (m && L.isObject(fr[i], true)) {
                            // console.log('aggregate RECURSE: ' + i);
                            // @TODO recursive or no?
                            // Y.mix(fr[i], fs[i]); // not recursive
                            f(fr[i], fs[i], proto, true); // recursive
                        // otherwise apply the property only if overwrite
                        // is specified or the receiver doesn't have one.
                        // @TODO make sure the 'arr' check isn't desructive
                        } else if (!arr && (ov || !(i in fr))) {
                            // console.log('hash: ' + i);
                            fr[i] = fs[i];
                        // if merge is specified and the receiver is an array,
                        // append the array item
                        } else if (arr) {
                            // console.log('array: ' + i);
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

        return r;
    };

    

}, "@VERSION@");
/**
 * Object utils
 * @class Object
 */
YUI.add("object", function(Y) {

    /**
     * Returns a new object based upon the supplied object.  By
     * default the new object's prototype will have all members
     * on the object.tructor prototype.
     * @param The supplier object
     * @return the new object
     */
    Y.Object = function(o) {
        var F = function() {};
        F.prototype = o;
        return new F();
    }; 

    var O = Y.Object, L = Y.Lang;

    /**
     * Determines whether or not the property was added
     * to the object instance.  Returns false if the property is not present
     * in the object, or was inherited from the prototype.
     *
     * @deprecated Safari 1.x support has been removed, so this is simply a 
     * wrapper for the native implementation.  Use the native implementation
     * directly instead.
     *
     * @TODO Remove in PR2
     *
     * @method owns
     * @param o {any} The object being testing
     * @parma p {string} the property to look for
     * @return {boolean} true if the object has the property on the instance
     */
    O.owns = function(o, p) {
        return (o && o.hasOwnProperty) ? o.hasOwnProperty(p) : false;
    };

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
     * @param proto {boolean} include proto
     * @return {YUI} the YUI instance
     */
    O.each = function (o, f, c, proto) {
        var s = c || Y;

        for (var i in o) {
            if (proto || O.owns(o, i)) {
                f.call(s, o[i], i, o);
            }
        }
        return Y;
    };
}, "@VERSION@");
YUI.add("ua", function(Y) {

    /**
     * Browser/platform detection
     * @class UA
     */
    Y.UA = function() {

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
}, "@VERSION@");
// requires lang
YUI.add("later", function(Y) {

    var L = Y.Lang;

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
}, "@VERSION@");

YUI.add("get", function(Y) {
    
        var ua=Y.UA, 
        L=Y.Lang;

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
        var w = win || Y.config.win, d=w.document, n=d.createElement(type);

        for (var i in attr) {
            if (attr[i] && Y.Object.owns(attr, i)) {
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

    /*
     * The request failed, execute fail handler with whatever
     * was accomplished.  There isn't a failure case at the
     * moment unless you count aborted transactions
     * @method _fail
     * @param id {string} the id of the request
     * @private
     */
    var _fail = function(id, msg) {
        var q = queues[id];
        // execute failure callback
        if (q.onFailure) {
            var sc=q.context || q;
            q.onFailure.call(sc, _returnData(q, msg));
        }
    };

    var _get = function(nId, tId) {
        var q = queues[tId],
            n = (L.isString(nId)) ? q.win.document.getElementById(nId) : nId;
        if (!n) {
            _fail(tId, "target node not found: " + nId);
        }

        return n;
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


    /**
     * The request is complete, so executing the requester's callback
     * @method _finish
     * @param id {string} the id of the request
     * @private
     */
    var _finish = function(id) {
        var q = queues[id];
        q.finished = true;

        if (q.aborted) {
            var msg = "transaction " + id + " was aborted";
            _fail(id, msg);
            return;
        }

        // execute success callback
        if (q.onSuccess) {
            var sc=q.context || q;
            q.onSuccess.call(sc, _returnData(q));
        }
    };

    /**
     * Timeout detected
     * @method _timeout
     * @param id {string} the id of the request
     * @private
     */
    var _timeout = function(id) {
        var q = queues[id];
        if (q.onTimeout) {
            var sc=q.context || q;
            q.onTimeout.call(sc, _returnData(q));
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

        var q = queues[id];

        if (q.timer) {
            q.timer.cancel();
        }

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
            _finish(id);
            return;
        } 

        var url = q.url[0];

        if (q.timeout) {
            q.timer = L.later(q.timeout, q, _timeout, id);
        }

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
            if (queues.hasOwnProperty(i)) {
                var q = queues[i];
                if (q.autopurge && q.finished) {
                    _purge(q.tId);
                    delete queues[i];
                }
            }
        }

        purging = false;
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
        q.win = q.win || Y.config.win;
        q.context = q.context || q;
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
                    f(id, url);
                }
            };

        // webkit prior to 3.x is no longer supported
        } else if (ua.webkit) {

            if (type === "script") {
                // Safari 3.x supports the load event for script nodes (DOM2)
                n.addEventListener("load", function() {
                    f(id, url);
                });
            } 

        // FireFox and Opera support onload (but not DOM2 in FF) handlers for
        // script nodes.  Opera, but not FF, supports the onload event for link
        // nodes.
        } else { 
            n.onload = function() {
                f(id, url);
            };
        }
    };

    return {

        /**
         * The number of request required before an automatic purge.
         * property PURGE_THRESH
         * @static
         * @type int
         * @default 20
         */
        PURGE_THRESH: 20,

        /**
         * Called by the the helper for detecting script load in Safari
         * @method _finalize
         * @param id {string} the transaction id
         * @private
         */
        _finalize: function(id) {
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
         * <dt>onTimeout</dt>
         * <dd>
         * callback to execute when a timeout occurs.
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
         * <dt>context</dt>
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
         * <dt>insertBefore</dt>
         * <dd>node or node id that will become the new node's nextSibling</dd>
         * </dl>
         * <dt>charset</dt>
         * <dd>Node charset, default utf-8</dd>
         * <dt>timeout</dt>
         * <dd>Number of milliseconds to wait before aborting and firing the timeout event</dd>
         * <pre>
         * &nbsp;&nbsp;Y.Get.script(
         * &nbsp;&nbsp;["http://yui.yahooapis.com/2.3.1/build/dragdrop/dragdrop-min.js",
         * &nbsp;&nbsp;&nbsp;"http://yui.yahooapis.com/2.3.1/build/animation/animation-min.js"], &#123;
         * &nbsp;&nbsp;&nbsp;&nbsp;onSuccess: function(o) &#123;
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log(o.data); // foo
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;new Y.DDProxy("dd1"); // also new o.reference("dd1"); would work
         * &nbsp;&nbsp;&nbsp;&nbsp;&#125;,
         * &nbsp;&nbsp;&nbsp;&nbsp;onFailure: function(o) &#123;
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log("transaction failed");
         * &nbsp;&nbsp;&nbsp;&nbsp;&#125;,
         * &nbsp;&nbsp;&nbsp;&nbsp;data: "foo",
         * &nbsp;&nbsp;&nbsp;&nbsp;context: Y,
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
         * <dt>context</dt>
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

}, "@VERSION@");
/**
 * Provides dynamic loading for the YUI library.  It includes the dependency
 * info for the library, and will automatically pull in dependencies for
 * the modules requested.  It supports rollup files (such as utilities.js, and 
 * will automatically use these when appropriate in order to minimize the 
 * number of http connections required to load all of the dependencies.  It
 * can load the files from the Yahoo! CDN, and it can use the combo service
 * provided on that network.
 *
 * @module loader
 */

/**
 * Loader provides dynamic loading for YUI.
 * @class Loader
 */

/**
 * Executed when the loader successfully completes an insert operation
 * This can be subscribed to normally, or a listener can be passed
 * as an onSuccess config option.
 * @event success
 */

/**
 * Executed when the loader fails to complete an insert operation.
 * This can be subscribed to normally, or a listener can be passed
 * as an onFailure config option.
 *
 * @event failure
 */

/**
 * Executed when a Get operation times out.
 * This can be subscribed to normally, or a listener can be passed
 * as an onTimeout config option.
 *
 * @event timeout
 */

// http://yui.yahooapis.com/combo?2.5.2/build/yahoo/yahoo-min.js&2.5.2/build/dom/dom-min.js&2.5.2/build/event/event-min.js&2.5.2/build/autocomplete/autocomplete-min.js"

YUI.add("loader", function(Y) {

    var BASE = 'base', 
        CSS = 'css',
        JS = 'js',
        PKG = 'pkg',

        ANIMATION = 'animation',
        RESET = 'reset',
        FONTS = 'fonts',
        GRIDS = 'grids',
        DRAGDROP = 'dragdrop',
        JSON = 'json',
        VERSION = '@VERSION@',
        ROOT = VERSION + '/build/';

Y.Env.meta = {

    version: VERSION,

    root: ROOT,

    // base: 'http://yui.yahooapis.com/' + ROOT,
    base: '../../build/',

    comboBase: 'http://yui.yahooapis.com/combo?',

    modules: {

        basecss: {
            type: CSS,
            after: [RESET, FONTS, GRIDS],
            path: 'base/base.css'
        },

        fonts: {
            type: CSS
        },

        grids: {
            type: CSS,
            requires: [FONTS],
            optional: [RESET]
        },

        log: {
            optional: [DRAGDROP],
            path: 'log/logreader-min.js',
            skinnable: 1
        },

        reset: {
            type: CSS
        },

        'reset-fonts-grids': {
            type: CSS,
            path: 'reset-fonts-grids/reset-fonts-grids.css',
            supersedes: [RESET, FONTS, GRIDS, 'reset-fonts'],
            rollup: 4
        },

        'reset-fonts': {
            type: CSS,
            path: 'reset-fonts/reset-fonts.css',
            supersedes: [RESET, FONTS],
            rollup: 2
        },

// node, dom, event included in the yui dist, so we are not including the metadata for PR1

        animation: {
            requires: ['base']
        },

        attribute: { 
            requires: ['event']
        },

        base: {
            requires: ['attribute']
        },
        
        classnamemanager: { },
        
        compat: { },
        
        cookie: { },

        css: { },

        'dd-ddm-base': {
            path: 'dd/dd-ddm-base-min.js',
            requires: ['node', BASE]
        }, 
        'dd-ddm':{
            path: 'dd/dd-ddm-min.js',
            requires: ['dd-ddm-base']
        }, 
        'dd-ddm-drop':{
            path: 'dd/dd-ddm-drop-min.js',
            requires: ['dd-ddm']
        }, 
        'dd-drag':{
            path: 'dd/dd-drag-min.js',
            requires: ['dd-ddm-base']
        }, 
        'dd-drop':{
            path: 'dd/dd-drop-min.js',
            requires: ['dd-ddm-drop']
        }, 
        'dd-proxy':{
            path: 'dd/dd-proxy-min.js',
            requires: ['dd-drag']
        }, 
        'dd-constrain':{
            path: 'dd/dd-constrain-min.js',
            requires: ['dd-drag', 'dd-proxy']
        }, 
        'dd-plugin':{
            path: 'dd/dd-plugin-min.js',
            requires: ['dd-drag'],
            optional: ['dd-constrain', 'dd-proxy']
        },
        'dd-drop-plugin':{
            path: 'dd/dd-drop-plugin-min.js',
            requires: ['dd-drop']
        },

        'dd-drag-all':{
            path: 'dd/dd-drag-all-min.js',
            supersedes: ['dd-ddm-base', 'dd-ddm', 'dd-drag', 'dd-proxy', 'dd-constrain', 'dd-plugin', 'dd-drag-core', 'dd-drag-proxy']
        },

        'dd-dragdrop-all':{
            path: 'dd/dd-dragdrop-all-min.js',
            supersedes: ['dd-ddm-base', 'dd-ddm', 'dd-ddm-drop', 'dd-drag', 'dd-proxy', 'dd-constrain', 'dd-plugin', 'dd-drop', 'dd-drop-plugin', 'dd-drag-core', 'dd-drag-proxy']
        },

        'dd-drop-core':{
            path: 'dd/dd-drop-core-min.js',
            supersedes: ['dd-ddm-drop', 'dd-drop', 'dd-plugin-drop']
        },

        'dd-drag-core':{
            path: 'dd/dd-drag-core-min.js',
            supersedes: ['dd-ddm-base', 'dd-ddm', 'dd-drag', 'dd-plugin']
        },

        'dd-drag-proxy':{
            path: 'dd/dd-drag-proxy-min.js',
            supersedes: ['dd-ddm-base', 'dd-ddm', 'dd-drag', 'dd-proxy', 'dd-plugin']
        },

        dom: { },

        dump: { },

        event: { 
            requires: ['oop']
        },
        
        io: { },

        'json-parse': {
            path: 'json/json-parse-min.js'
        },

        'json-stringify': {
            path: 'json/json-stringify-min.js'
        },

        json: {
            supersedes: ['json-parse', 'json-stringify']
        },
        
        logreader: {
            requires: ['css']
        },

        node: { 
            requires: ['event', 'dom']
        },

        oop: { },

        profiler: { },

        queue: { },

        substitute: {
            optional: ['dump']
        },

        yuitestcore: { 
            path: 'yuitest/yuitest_core-min.js'
        },

        yuitest: {
            requires: ['log'],
            // skinnable: 1,
            supersedes: ['yuitestcore']
        }
    }
};


    var L=Y.Lang, env=Y.Env,
        PROV = "_provides", SUPER = "_supersedes",
        REQ = "expanded";

    var _Y = {

        // dupsAllowed: {'yahoo': true, 'get': true},
        dupsAllowed: {},

        /*
         * The library metadata for the current release
         * @property YUIInfo
         * @static
         */
        // info: '@yuiinfo@', 
        info: Y.Env.meta

    };

    Y.Loader = function(o) {

        /**
         * Internal callback to handle multiple internal insert() calls
         * so that css is inserted prior to js
         * @property _internalCallback
         * @private
         */
        this._internalCallback = null;

        /**
         * Use the YUI environment listener to detect script load.  This
         * is only switched on for Safari 2.x and below.
         * @property _useYahooListener
         * @private
         */
        this._useYahooListener = false;

        /*
         * Callback that will be executed when the loader is finished
         * with an insert
         * @method onSuccess
         * @type function
         */
        // this.onSuccess = null;

        /*
         * Callback that will be executed if there is a failure
         * @method onFailure
         * @type function
         */

        /*
         * Callback that will be executed each time a new module is loaded
         * @method onProgress
         * @type function
         */
        // this.onProgress = null;

        /**
         * The execution context for all callbacks
         * @property context
         * @default {YUI} the YUI instance
         */
        this.context = Y;

        /**
         * Data that is passed to all callbacks
         * @property data
         */
        this.data = null;

        /**
         * Node reference or id where new nodes should be inserted before
         * @property insertBefore
         * @type string|HTMLElement
         */
        this.insertBefore = null;

        /**
         * The charset attribute for inserted nodes
         * @property charset
         * @type string
         * @default utf-8
         */
        this.charset = null;

        /**
         * The base directory.
         * @property base
         * @type string
         * @default http://yui.yahooapis.com/[YUI VERSION]/build/
         */
        this.base = _Y.info.base;

        /**
         * Base path for the combo service
         * @property comboBase
         * @type string
         * @default http://yui.yahooapis.com/combo?
         */
        this.comboBase = _Y.info.comboBase;

        /**
         * If configured, YUI JS resources will use the combo
         * handler
         * @property combine
         * @type boolean
         * @default false
         */
        this.combine = false;

        /**
         * Ignore modules registered on the YUI global
         * @property ignoreRegistered
         * @default false
         */
        this.ignoreRegistered = false;

        /**
         * Root path to prepend to module path for the combo
         * service
         * @property root
         * @type string
         * @default [YUI VERSION]/build/
         */
        this.root = _Y.info.root;

        /**
         * Timeout value in milliseconds.  If set, this value will be used by
         * the get utility.  the timeout event will fire if
         * a timeout occurs.
         * @property timeout
         * @type int
         */
        this.timeout = 0;

        /**
         * A list of modules that should not be loaded, even if
         * they turn up in the dependency tree
         * @property ignore
         * @type string[]
         */
        this.ignore = null;

        /**
         * A list of modules that should always be loaded, even
         * if they have already been inserted into the page.
         * @property force
         * @type string[]
         */
        this.force = null;

        /**
         * Should we allow rollups
         * @property allowRollup
         * @type boolean
         * @default true
         */
        this.allowRollup = true;

        /**
         * A filter to apply to result urls.  This filter will modify the default
         * path for all modules.  The default path for the YUI library is the
         * minified version of the files (e.g., event-min.js).  The filter property
         * can be a predefined filter or a custom filter.  The valid predefined 
         * filters are:
         * <dl>
         *  <dt>DEBUG</dt>
         *  <dd>Selects the debug versions of the library (e.g., event-debug.js).
         *      This option will automatically include the logger widget</dd>
         *  <dt>RAW</dt>
         *  <dd>Selects the non-minified version of the library (e.g., event.js).</dd>
         * </dl>
         * You can also define a custom filter, which must be an object literal 
         * containing a search expression and a replace string:
         * <pre>
         *  myFilter: &#123; 
         *      'searchExp': "-min\\.js", 
         *      'replaceStr': "-debug.js"
         *  &#125;
         * </pre>
         * @property filter
         * @type string|{searchExp: string, replaceStr: string}
         */
        this.filter = null;

        /**
         * The list of requested modules
         * @property required
         * @type {string: boolean}
         */
        this.required = {};

        /**
         * The library metadata
         * @property moduleInfo
         */
        // this.moduleInfo = Y.merge(_Y.info.moduleInfo);
        this.moduleInfo = {};
        
        var defaults = _Y.info.modules;

        for (var i in defaults) {
            if (defaults.hasOwnProperty(i)) {
                this._internal = true;
                this.addModule(defaults[i], i);
                this._internal = false;
            }
        }

        /**
         * List of rollup files found in the library metadata
         * @property rollups
         */
        this.rollups = null;

        /**
         * Whether or not to load optional dependencies for 
         * the requested modules
         * @property loadOptional
         * @type boolean
         * @default false
         */
        this.loadOptional = false;

        /**
         * All of the derived dependencies in sorted order, which
         * will be populated when either calculate() or insert()
         * is called
         * @property sorted
         * @type string[]
         */
        this.sorted = [];

        /**
         * Set when beginning to compute the dependency tree. 
         * Composed of what YUI reports to be loaded combined
         * with what has been loaded by the tool
         * @propery loaded
         * @type {string: boolean}
         */
        this.loaded = {};

        /**
         * Flag to indicate the dependency tree needs to be recomputed
         * if insert is called again.
         * @property dirty
         * @type boolean
         * @default true
         */
        this.dirty = true;

        /**
         * List of modules inserted by the utility
         * @property inserted
         * @type {string: boolean}
         */
        this.inserted = {};

        this.skipped = {};

        // Y.on('yui:load', this.loadNext, this);

        this._config(o);

    };

    Y.Loader.prototype = {

        FILTERS: {
            RAW: { 
                'searchExp': "-min\\.js", 
                'replaceStr': ".js"
            },
            DEBUG: { 
                'searchExp': "-min\\.js", 
                'replaceStr': "-debug.js"
            }
        },

        _config: function(o) {

            // apply config values
            if (o) {
                for (var i in o) {
                    if (o.hasOwnProperty(i)) {
                        if (i == "require") {
                            this.require(o[i]);
                        // support the old callback syntax
                        } else if (i.indexOf('on') === 0) {
                            this.subscribe(i.substr(2).toLowerCase(), o[i], o.context || this);
                        } else {
                            this[i] = o[i];
                        }
                    }
                }
            }

            // fix filter
            var f = this.filter;

            if (L.isString(f)) {
                f = f.toUpperCase();

                // the logger must be available in order to use the debug
                // versions of the library
                if (f === "DEBUG") {
                    this.require("log");
                }

                // hack to handle a a bug where LogWriter is being instantiated
                // at load time, and the loader has no way to sort above it
                // at the moment.
                if (!Y.LogWriter) {
                    Y.LogWriter = function() {
                        return Y;
                    };
                }

                this.filter = this.FILTERS[f];
            }

        },

        /** Add a new module to the component metadata.         
         * <dl>
         *     <dt>name:</dt>       <dd>required, the component name</dd>
         *     <dt>type:</dt>       <dd>required, the component type (js or css)</dd>
         *     <dt>path:</dt>       <dd>required, the path to the script from "base"</dd>
         *     <dt>requires:</dt>   <dd>array of modules required by this component</dd>
         *     <dt>optional:</dt>   <dd>array of optional modules for this component</dd>
         *     <dt>supersedes:</dt> <dd>array of the modules this component replaces</dd>
         *     <dt>after:</dt>      <dd>array of modules the components which, if present, should be sorted above this one</dd>
         *     <dt>rollup:</dt>     <dd>the number of superseded modules required for automatic rollup</dd>
         *     <dt>fullpath:</dt>   <dd>If fullpath is specified, this is used instead of the configured base + path</dd>
         *     <dt>skinnable:</dt>  <dd>flag to determine if skin assets should automatically be pulled in</dd>
         * </dl>
         * @method addModule
         * @param o An object containing the module data
         * @param name the module name (optional), required if not in the module data
         * @return {boolean} true if the module was added, false if 
         * the object passed in did not provide all required attributes
         */
        addModule: function(o, name) {

            o.name = o.name || name;

            if (!o || !o.name) {
                return false;
            }

            if (!o.type) {
                o.type = JS;
            }

            if (!o.path && !o.fullpath) {
                o.path = name + "/" + name + "-min." + o.type;
            }

            o.ext = ('ext' in o) ? o.ext : (this._internal) ? false : true;
            o.requires = o.requires || [];

            this.moduleInfo[name] = o;
            this.dirty = true;


            return o;
        },

        /**
         * Add a requirement for one or more module
         * @method require
         * @param what {string[] | string*} the modules to load
         */
        require: function(what) {
            var a = (typeof what === "string") ? arguments : what;
            this.dirty = true;
            //OU.appendArray(this.required, a);
            Y.mix(this.required, Y.Array.hash(a));
        },

        /**
         * Returns an object containing properties for all modules required
         * in order to load the requested module
         * @method getRequires
         * @param mod The module definition from moduleInfo
         */
        getRequires: function(mod) {

            if (!mod) {
                return [];
            }

            if (!this.dirty && mod.expanded) {
                return mod.expanded;
            }

            var i, d=[], r=mod.requires, o=mod.optional, 
                info=this.moduleInfo, m, j, add;

            for (i=0; i<r.length; i=i+1) {
                d.push(r[i]);
                m = this.getModule(r[i]);
                // AU.appendArray(d, this.getRequires(m));
                // d.concat(this.getRequires(m));
                add = this.getRequires(m);
                for (j=0;j<add.length;j=j+1) {
                    d.push(add[j]);
                }
            }

            // get the requirements from superseded modules, if any
            r=mod.supersedes;
            if (r) {
                for (i=0; i<r.length; i=i+1) {
                    d.push(r[i]);
                    m = this.getModule(r[i]);
                    // AU.appendArray(d, this.getRequires(m));
                    // d.concat(this.getRequires(m));
                    add = this.getRequires(m);
                    for (j=0;j<add.length;j=j+1) {
                        d.push(add[j]);
                    }
                }
            }

            if (o && this.loadOptional) {
                for (i=0; i<o.length; i=i+1) {
                    d.push(o[i]);
                    add = this.getRequires(info[o[i]]);
                    for (j=0;j<add.length;j=j+1) {
                        d.push(add[j]);
                    }
                }
            }


            // mod.expanded = AU.uniq(d);
            mod.expanded = Y.Object.keys(Y.Array.hash(d));



            return mod.expanded;
        },


        /**
         * Returns an object literal of the modules the supplied module satisfies
         * @method getProvides
         * @param name{string} The name of the module
         * @param notMe {string} don't add this module name, only include superseded modules
         * @return what this module provides
         */
        getProvides: function(name, notMe) {
            var addMe = !(notMe), ckey = (addMe) ? PROV : SUPER,
                m = this.getModule(name), o = {};

            if (!m) {
                return o;
            }

            if (m[ckey]) {
                return m[ckey];
            }

            var s = m.supersedes, done={}, me = this;

            // use worker to break cycles
            var add = function(mm) {
                if (!done[mm]) {
                    done[mm] = true;
                    // we always want the return value normal behavior 
                    // (provides) for superseded modules.
                    Y.mix(o, me.getProvides(mm));
                } 
                
                // else {
                // }
            };

            // calculate superseded modules
            if (s) {
                for (var i=0; i<s.length; i=i+1) {
                    add(s[i]);
                }
            }

            // supersedes cache
            m[SUPER] = o;
            // provides cache
            m[PROV] = Y.merge(o);
            m[PROV][name] = true;


            return m[ckey];
        },


        /**
         * Calculates the dependency tree, the result is stored in the sorted 
         * property
         * @method calculate
         * @param o optional options object
         */
        calculate: function(o) {
            if (o || this.dirty) {
                this._config(o);
                this._setup();
                this._explode();
                if (this.allowRollup) {
                    this._rollup();
                }
                this._reduce();
                this._sort();


                this.dirty = false;
            }
        },

        /**
         * Investigates the current YUI configuration on the page.  By default,
         * modules already detected will not be loaded again unless a force
         * option is encountered.  Called by calculate()
         * @method _setup
         * @private
         */
        _setup: function() {

            var info = this.moduleInfo, name, i, j;

            var l = Y.merge(this.inserted); // shallow clone

            // available modules
            if (!this.ignoreRegistered) {
                Y.mix(l, YUI.Env.mods);
            }
            

            // add the ignore list to the list of loaded packages
            if (this.ignore) {
                // OU.appendArray(l, this.ignore);
                Y.mix(l, Y.Array.hash(this.ignore));
            }

            // remove modules on the force list from the loaded list
            if (this.force) {
                for (i=0; i<this.force.length; i=i+1) {
                    if (this.force[i] in l) {
                        delete l[this.force[i]];
                    }
                }
            }

            // expand the list to include superseded modules
            for (j in l) {
                if (Y.Object.owns(l, j)) {
                    Y.mix(l, this.getProvides(j));
                }
            }


            this.loaded = l;

        },
        

        /**
         * Inspects the required modules list looking for additional 
         * dependencies.  Expands the required list to include all 
         * required modules.  Called by calculate()
         * @method _explode
         * @private
         */
        _explode: function() {

            var r=this.required, i, mod;

            for (i in r) {
                if (r.hasOwnProperty(i)) {
                    mod = this.getModule(i);

                    var req = this.getRequires(mod);

                    if (req) {
                        Y.mix(r, Y.Array.hash(req));
                    }
                }
            }
        },

        getModule: function(name) {

            var m = this.moduleInfo[name];

            // create the default module
            // if (!m) {
                // m = this.addModule({ext: false}, name);
            // }

            return m;
        },

        /**
         * Look for rollup packages to determine if all of the modules a
         * rollup supersedes are required.  If so, include the rollup to
         * help reduce the total number of connections required.  Called
         * by calculate()
         * @method _rollup
         * @private
         */
        _rollup: function() {
            var i, j, m, s, rollups={}, r=this.required, roll,
                info = this.moduleInfo;

            // find and cache rollup modules
            if (this.dirty || !this.rollups) {
                for (i in info) {
                    if (info.hasOwnProperty(i)) {
                        m = this.getModule(i);
                        // if (m && m.rollup && m.supersedes) {
                        if (m && m.rollup) {
                            rollups[i] = m;
                        }
                    }
                }

                this.rollups = rollups;
            }

            // make as many passes as needed to pick up rollup rollups
            for (;;) {
                var rolled = false;

                // go through the rollup candidates
                for (i in rollups) { 

                    // there can be only one
                    if (!r[i] && !this.loaded[i]) {
                        m =this.getModule(i); s = m.supersedes ||[]; roll=false;

                        if (!m.rollup) {
                            continue;
                        }

                        var c=0;

                        // check the threshold
                        for (j=0;j<s.length;j=j+1) {

                            // if the superseded module is loaded, we can't load the rollup
                            if (this.loaded[s[j]] && (!_Y.dupsAllowed[s[j]])) {
                                roll = false;
                                break;
                            // increment the counter if this module is required.  if we are
                            // beyond the rollup threshold, we will use the rollup module
                            } else if (r[s[j]]) {
                                c++;
                                roll = (c >= m.rollup);
                                if (roll) {
                                    break;
                                }
                            }
                        }

                        if (roll) {
                            // add the rollup
                            r[i] = true;
                            rolled = true;

                            // expand the rollup's dependencies
                            this.getRequires(m);
                        }
                    }
                }

                // if we made it here w/o rolling up something, we are done
                if (!rolled) {
                    break;
                }
            }
        },

        /**
         * Remove superceded modules and loaded modules.  Called by
         * calculate() after we have the mega list of all dependencies
         * @method _reduce
         * @private
         */
        _reduce: function() {

            var i, j, s, m, r=this.required;
            for (i in r) {

                // remove if already loaded
                if (i in this.loaded) { 
                    delete r[i];

                // remove anything this module supersedes
                } else {

                     m = this.getModule(i);
                     s = m && m.supersedes;
                     if (s) {
                         for (j=0; j<s.length; j=j+1) {
                             if (s[j] in r) {
                                 delete r[s[j]];
                             }
                         }
                     }
                }
            }
        },

        _onSuccess: function() {

            this._pushEvents();
            Y._attach(this.sorted);

            for (var i in this.skipped) {
                delete this.inserted[i];
            }

            this.skipped = {};

            // this.fire('success', {
            //     data: this.data
            // });

            var f = this.onSuccess;
            if (f) {
                f.call(this.context, {
                    data: this.data
                });
            }

        },

        _onFailure: function(msg) {
            Y._attach(this.sorted);
            // this.fire('failure', {
            //     msg: 'operation failed: ' + msg,
            //     data: this.data
            // });

            var f = this.onFailure;
            if (f) {
                f.call(this.context, {
                    msg: 'operation failed: ' + msg,
                    data: this.data
                });
            }
        },

        _onTimeout: function(msg) {
            Y._attach(this.sorted);

            // this.fire('timeout', {
            //     data: this.data
            // });

            var f = this.onTimeout;
            if (f) {
                f.call(this.context, {
                    data: this.data
                });
            }
        },
        
        /**
         * Sorts the dependency tree.  The last step of calculate()
         * @method _sort
         * @private
         */
        _sort: function() {
            // create an indexed list
            var s=Y.Object.keys(this.required), info=this.moduleInfo, loaded=this.loaded,
                me = this;

            // returns true if b is not loaded, and is required
            // directly or by means of modules it supersedes.
            var requires = function(aa, bb) {

                var mm=info[aa];

                if (loaded[bb] || !mm) {
                    return false;
                }

                var ii, rr = mm.expanded, 
                    after = mm.after, other=info[bb];

                // check if this module requires the other directly
                if (rr && Y.Array.indexOf(rr, bb) > -1) {
                    return true;
                }

                // check if this module should be sorted after the other
                if (after && Y.Array.indexOf(after, bb) > -1) {
                    return true;
                }

                // check if this module requires one the other supersedes
                var ss=info[bb] && info[bb].supersedes;
                if (ss) {
                    for (ii=0; ii<ss.length; ii=ii+1) {
                        if (requires(aa, ss[ii])) {
                            return true;
                        }
                    }
                }

                // external css files should be sorted below yui css
                if (mm.ext && mm.type == CSS && (!other.ext)) {
                    return true;
                }

                return false;
            };

            // pointer to the first unsorted item
            var p=0; 

            // keep going until we make a pass without moving anything
            for (;;) {
               
                var l=s.length, a, b, j, k, moved=false;

                // start the loop after items that are already sorted
                for (j=p; j<l; j=j+1) {

                    // check the next module on the list to see if its
                    // dependencies have been met
                    a = s[j];

                    // check everything below current item and move if we
                    // find a requirement for the current item
                    for (k=j+1; k<l; k=k+1) {
                        if (requires(a, s[k])) {

                            // extract the dependency so we can move it up
                            b = s.splice(k, 1);

                            // insert the dependency above the item that 
                            // requires it
                            s.splice(j, 0, b[0]);

                            moved = true;
                            break;
                        }
                    }

                    // jump out of loop if we moved something
                    if (moved) {
                        break;
                    // this item is sorted, move our pointer and keep going
                    } else {
                        p = p + 1;
                    }
                }

                // when we make it here and moved is false, we are 
                // finished sorting
                if (!moved) {
                    break;
                }

            }

            this.sorted = s;
        },

        /**
         * inserts the requested modules and their dependencies.  
         * <code>type</code> can be "js" or "css".  Both script and 
         * css are inserted if type is not provided.
         * @method insert
         * @param o optional options object
         * @param type {string} the type of dependency to insert
         */
        insert: function(o, type) {
            // if (o) {
            // } else {
            // }

            // build the dependency list
            this.calculate(o);

            if (!type) {
                var self = this;
                this._internalCallback = function() {
                            self._internalCallback = null;
                            self.insert(null, JS);
                        };
                this.insert(null, CSS);
                return;
            }

            // set a flag to indicate the load has started
            this._loading = true;

            // flag to indicate we are done with the combo service
            // and any additional files will need to be loaded
            // individually
            this._combineComplete = false;

            // keep the loadType (js, css or undefined) cached
            this.loadType = type;

            // start the load
            this.loadNext();

        },

        /**
         * Executed every time a module is loaded, and if we are in a load
         * cycle, we attempt to load the next script.  Public so that it
         * is possible to call this if using a method other than
         * Y.register to determine when scripts are fully loaded
         * @method loadNext
         * @param mname {string} optional the name of the module that has
         * been loaded (which is usually why it is time to load the next
         * one)
         */
        loadNext: function(mname) {

            // It is possible that this function is executed due to something
            // else one the page loading a YUI module.  Only react when we
            // are actively loading something
            if (!this._loading) {
                return;
            }

            var s, len, i, m, url, self=this;

            if (this.combine && !this._combineComplete) {

                this._combining = []; 
                s=this.sorted;
                len=s.length;
                url=this.comboBase;

                for (i=0; i<len; i=i+1) {
                    m = this.getModule(s[i]);
// @TODO we can't combine CSS yet until we deliver files with absolute paths to the assets
                    // Do not try to combine non-yui JS
                    if (m.type == JS && !m.ext) {
                        url += this.root + m.path;
                        if (i < len) {
                            url += '&';
                        }

                        this._combining.push(s[i]);
                    }
                }

                if (this._combining.length) {

                    var callback=function(o) {
                        self._combineComplete = true;

                        var c=self._combining, len=c.length, i, m;
                        for (i=0; i<len; i=i+1) {
                            self.inserted[c[i]] = true;
                        }

                        self.loadNext(o.data);
                    };

                    // @TODO get rid of the redundant Get code
                    Y.Get.script(url, {
                        data: s[i],
                        onSuccess: callback,
                        onFailure: this._onFailure,
                        onTimeout: this._onTimeout,
                        insertBefore: this.insertBefore,
                        charset: this.charset,
                        timeout: this.timeout,
                        context: self 
                    });

                    return;
                } else {
                    this._combineComplete = true;
                }
            }

            if (mname) {

                // if the module that was just loaded isn't what we were expecting,
                // continue to wait
                if (mname !== this._loading) {
                    return;
                }


                // The global handler that is called when each module is loaded
                // will pass that module name to this function.  Storing this
                // data to avoid loading the same module multiple times
                this.inserted[mname] = true;

                // this.fire('progress', {
                //     name: mname,
                //     data: this.data
                // });
                if (this.onProgress) {
                    this.onProgress.call(this.context, {
                            name: mname,
                            data: this.data
                        });
                }


            }

            s=this.sorted;
            len=s.length;

            for (i=0; i<len; i=i+1) {

                // this.inserted keeps track of what the loader has loaded.
                // move on if this item is done.
                if (s[i] in this.inserted) {
                    continue;
                }

                // Because rollups will cause multiple load notifications
                // from Y, loadNext may be called multiple times for
                // the same module when loading a rollup.  We can safely
                // skip the subsequent requests
                if (s[i] === this._loading) {
                    return;
                }

                // log("inserting " + s[i]);
                m = this.getModule(s[i]);

                if (!m) {

                    var msg = "Undefined module " + s[i] + " skipped";
                    this.inserted[s[i]] = true;
                    this.skipped[s[i]] = true;
                    continue;

                    // this.fire('failure', {
                        // msg: msg,
                        // data: this.data
                    // });
                }


                // The load type is stored to offer the possibility to load
                // the css separately from the script.
                if (!this.loadType || this.loadType === m.type) {
                    this._loading = s[i];

                    var fn=(m.type === CSS) ? Y.Get.css : Y.Get.script,
                        onsuccess=function(o) {
                            self.loadNext(o.data);
                        };
                        
                    url=m.fullpath || this._url(m.path);
                    self=this; 

                    fn(url, {
                        data: s[i],
                        onSuccess: onsuccess,
                        insertBefore: this.insertBefore,
                        charset: this.charset,
                        onFailure: this._onFailure,
                        onTimeout: this._onTimeout,
                        timeout: this.timeout,
                        context: self 
                    });

                    return;
                }
            }

            // we are finished
            this._loading = null;

            // internal callback for loading css first
            if (this._internalCallback) {

                var f = this._internalCallback;
                this._internalCallback = null;
                f.call(this);

            // } else if (this.onSuccess) {
            } else {

                // call Y.use passing this instance. Y will use the sorted
                // dependency list.

                this._onSuccess();

            }

        },

        /**
         * In IE, the onAvailable/onDOMReady events need help when Event is
         * loaded dynamically
         * @method _pushEvents
         * @param {Function} optional function reference
         * @private
         */
        _pushEvents: function(ref) {
            var r = ref || Y;
            if (r.Event) {
                r.Event._load();
            }
        },

        /**
         * Generates the full url for a module
         * method _url
         * @param path {string} the path fragment
         * @return {string} the full url
         * @private
         */
        _url: function(path) {
            
            var u = this.base || "", f=this.filter;
            u = u + path;

            if (f) {
                u = u.replace(new RegExp(f.searchExp), f.replaceStr);
            }


            return u;
        }

    };

    // Y.augment(Y.Loader, Y.Event.Target);

}, "@VERSION@");
(function() {

    var min = ['log', 'lang', 'array', 'core'], core,

    M = function(Y) {

        var C = Y.config;

        // apply the minimal required functionality
        Y.use.apply(Y, min);


        if (C.core) {

            core = C.core;

        } else {

            core = ["object", "ua", "later"];

            core.push(
              "get", 
              "loader");
        }

        Y.use.apply(Y, core);

    };
     
    YUI.add("yui", M, "@VERSION@");
    
    // {
        // the following will be bound automatically when this code is loaded
      //   use: core
    // });

})();
