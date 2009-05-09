/**
 * YUI core
 * @module yui
 */
(function() {

    var _instances = {}, _startTime = new Date().getTime(), p, i,

        add = function(el, type, fn, capture) {
            if (el.addEventListener) {
                    el.addEventListener(type, fn, !!capture);
            } else if (el.attachEvent) {
                    el.attachEvent("on" + type, fn);
            } 
        },

        remove = function(el, type, fn, capture) {
            if (el.removeEventListener) {
                    el.removeEventListener(type, fn, !!capture);
            } else if (el.detachEvent) {
                    el.detachEvent("on" + type, fn);
            }
        },

        globalListener = function() {
            YUI.Env.windowLoaded = true;
            YUI.Env.DOMReady = true;
            remove(window, 'load', globalListener);
        },

// @TODO: this needs to be created at build time from module metadata

        _APPLY_TO_WHITE_LIST = {
            'io.xdrReady': 1,
            'io.start': 1,
            'io.success': 1,
            'io.failure': 1,
            'io.abort': 1
        };
        
// reduce to one or the other
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
     * <ul>
     *  <li>------------------------------------------------------------------------</li>
     *  <li>Global:</li>
     *  <li>------------------------------------------------------------------------</li>
     *  <li>debug: Turn debug statements on or off</li>
     *  <li>useBrowserConsole:
     *  Log to the browser console if debug is on and the console is available</li>
     *  <li>logInclude:
     *  A hash of log sources that should be logged.  If specified, only log messages from these sources will be logged.
     *  
     *  </li>
     *  <li>logExclude:
     *  A hash of log sources that should be not be logged.  If specified, all sources are logged if not on this list.</li>
     *  <li>injected: set to true if the yui seed file was dynamically loaded in
     *  order to bootstrap components relying on the window load event and onDOMReady.</li>
     *  <li>throwFail:
     *  If throwFail is set, Y.fail will generate or re-throw a JS error.  Otherwise the failure is logged.
     *  <li>win:
     *  The target window/frame</li>
     *  <li>core:
     *  A list of modules that defines the YUI core (overrides the default)</li>
     *  <li>dateFormat: default date format</li>
     *  <li>locale: default locale</li>
     *  <li>------------------------------------------------------------------------</li>
     *  <li>For event and get:</li>
     *  <li>------------------------------------------------------------------------</li>
     *  <li>pollInterval: The default poll interval</li>
     *  <li>windowResizeDelay: The time between browser events to wait before firing.</li>
     *  <li>-------------------------------------------------------------------------</li>
     *  <li>For loader:</li>
     *  <li>-------------------------------------------------------------------------</li>
     *  <li>base:
     *  The base dir</li>
     *  <li>secureBase:
     *  The secure base dir (not implemented)</li>
     *  <li>comboBase:
     *  The YUI combo service base dir. Ex: http://yui.yahooapis.com/combo?</li>
     *  <li>root:
     *  The root path to prepend to module names for the combo service. Ex: 2.5.2/build/</li>
     *  <li>filter:
     *  
     * A filter to apply to result urls.  This filter will modify the default
     * path for all modules.  The default path for the YUI library is the
     * minified version of the files (e.g., event-min.js).  The filter property
     * can be a predefined filter or a custom filter.  The valid predefined 
     * filters are:
     * <dl>
     *  <dt>DEBUG</dt>
     *  <dd>Selects the debug versions of the library (e.g., event-debug.js).
     *      This option will automatically include the Logger widget</dd>
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
     *  </li>
     *  <li>combine:
     *  Use the YUI combo service to reduce the number of http connections required to load your dependencies</li>
     *  <li>ignore:
     *  A list of modules that should never be dynamically loaded</li>
     *  <li>force:
     *  A list of modules that should always be loaded when required, even if already present on the page</li>
     *  <li>insertBefore:
     *  Node or id for a node that should be used as the insertion point for new nodes</li>
     *  <li>charset:
     *  charset for dynamic nodes</li>
     *  <li>timeout:
     *  number of milliseconds before a timeout occurs when dynamically loading nodes.  in not set, there is no timeout</li>
     *  <li>context:
     *  execution context for all callbacks</li>
     *  <li>onSuccess:
     *  callback for the 'success' event</li>
     *  <li>onFailure:
     *  callback for the 'failure' event</li>
     *  <li>onTimeout:
     *  callback for the 'timeout' event</li>
     *  <li>onProgress:
     *  callback executed each time a script or css file is loaded</li>
     *  <li>modules:
     *  A list of module definitions.  See Loader.addModule for the supported module metadata</li>
     * </ul>
     */

    /*global YUI*/
    // Make a function, disallow direct instantiation
    YUI = function(o) {

        var Y = this;

        // Allow instantiation without the new operator
        if (!(Y instanceof YUI)) {
            return new YUI(o);
        } else {
            // set up the core environment
            Y._init(o);

            // bind the specified additional modules for this instance
            Y._setup();

            return Y;
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

        // find targeted window
        // @TODO create facades
        // @TODO resolve windowless environments
        var w = ((o.win) ? (o.win.contentWindow) : o.win || window) || {},
            v = '@VERSION@';
        o.win = w;
        o.doc = w.document;
        o.debug = ('debug' in o) ? o.debug : true;
        o.useBrowserConsole = ('useBrowserConsole' in o) ? o.useBrowserConsole : true;
        o.throwFail = ('throwFail' in o) ? o.throwFail : true;
    
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

        if (v.indexOf('@') > -1) {
            v = 'test';
        }

        this.version = v;

        if (YUI.Env) {
            this.Env._yidx = ++YUI.Env._idx;
            this.id = this.stamp(this);
            _instances[this.id] = this;
        }

        this.constructor = YUI;

        // this.log(this.id + ') init ');
    },
    
    /**
     * Finishes the instance setup. Attaches whatever modules were defined
     * when the yui modules was registered.
     * @method _setup
     * @private
     */
    _setup: function(o) {
        this.use("yui-base");
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
     * @return {object} the return value from the applied method or null
     */
    applyTo: function(id, method, args) {

        if (!(method in _APPLY_TO_WHITE_LIST)) {
            this.error(method + ': applyTo not allowed');
            return null;
        }

        var instance = _instances[id], nest, m, i;

        if (instance) {

            nest = method.split('.'); 
            m = instance;

            for (i=0; i<nest.length; i=i+1) {

                m = m[nest[i]];

                if (!m) {
                    this.error('applyTo not found: ' + method);
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
     * @param fn {Function} entry point into the module that
     * is used to bind module to the YUI instance
     * @param version {string} version string
     * @param details optional config data: 
     * requires   - features that should be present before loading
     * optional   - optional features that should be present if load optional defined
     * use  - features that should be attached automatically
     * skinnable  -
     * rollup
     * omit - features that should not be loaded if this module is present
     * @return {YUI} the YUI instance
     *
     */
    add: function(name, fn, version, details) {

        // this.log('Adding a new component ' + name);

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
            attached = this.Env._attached,
            i, l = r.length, name, m, d, req, use;

        for (i=0; i<l; i=i+1) {

            name = r[i]; 
            m    = mods[name];

            if (!attached[name] && m) {

                attached[name] = true;

                d   = m.details; 
                req = d.requires; 
                use = d.use;

                if (req) {
                    this._attach(this.Array(req));
                }

                // this.log('attaching ' + name, 'info', 'YUI');

                if (m.fn) {
                    m.fn(this);
                }

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
            callback = a[a.length-1],
            k, i, l, missing = [], r = [], 
            f = function(name) {

                // only attach a module once
                if (used[name]) {
                    // Y.log(name + ' already used');
                    return;
                }

                var m = mods[name], j, req, use;

                if (m) {
                    used[name] = true;

                    // Y.log('found ' + name);
                    req = m.details.requires;
                    use = m.details.use;
                } else {
                    Y.log('module not found: ' + name, 'info', 'yui');
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
                // Y.log('using ' + name);
                r.push(name);

            },

            onComplete = function(fromLoader) {

                // Y.log('Use complete');

                fromLoader = fromLoader || {
                    success: true,
                    msg: 'not dynamic'
                };

                if (Y.Env._callback) {

                    var cb = Y.Env._callback;
                    Y.Env._callback = null;
                    cb(Y, fromLoader);
                }

                if (Y.fire) {
                    Y.fire('yui:load', Y, fromLoader);
                }
            };

        // Y.log(Y.id + ': use called: ' + a + ' :: ' + callback);

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
            for (k in mods) {
                if (mods.hasOwnProperty(k)) {
                    a.push(k);
                }
            }

            return Y.use.apply(Y, a);

        }
        // Y.log('loader before: ' + a.join(','));
       

        // use loader to expand dependencies and sort the 
        // requirements if it is available.
        if (Y.Loader) {
            dynamic = true;
            loader = new Y.Loader(Y.config);
            loader.require(a);
            loader.ignoreRegistered = true;
            loader.allowRollup = false;
            loader.calculate();
            a = loader.sorted;
        }

        // Y.log('loader after: ' + a.join(','));

        l = a.length;

        // process each requirement and any additional requirements 
        // the module metadata specifies
        for (i=0; i<l; i=i+1) {
            f(a[i]);
        }

        // Y.log('all reqs: ' + r + ' --- missing: ' + missing);

        // dynamic load
        if (Y.Loader && missing.length) {
            Y.log('Attempting to dynamically load the missing modules ' + missing, 'info', 'yui');
            loader = new Y.Loader(Y.config);
            loader.onSuccess = onComplete;
            loader.onFailure = onComplete;
            loader.onTimeout = onComplete;
            loader.attaching = a;
            loader.require(missing);
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
     * YUI.namespace("YAHOO.property.package");
     * </pre>
     * Either of the above would create YUI.property, then
     * YUI.property.package (YAHOO is scrubbed out, this is
     * to remain compatible with YUI2)
     *
     * Be careful when naming packages. Reserved words may work in some browsers
     * and not others. For instance, the following will fail in Safari:
     * <pre>
     * YUI.namespace("really.long.nested.namespace");
     * </pre>
     * This fails because "long" is a future reserved word in ECMAScript
     *
     * @method namespace
     * @param  {string*} arguments 1-n namespaces to create 
     * @return {object}  A reference to the last namespace object created
     */
    namespace: function() {
        var a=arguments, o=null, i, j, d;
        for (i=0; i<a.length; i=i+1) {
            d = ("" + a[i]).split(".");
            o = this;
            for (j=(d[0] == "YAHOO") ? 1 : 0; j<d.length; j=j+1) {
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
     * not specified, the message is written to the Logger, otherwise
     * a JS error is thrown
     * @method error
     * @param msg {string} the error message
     * @param e {Error} Optional JS error that was caught.  If supplied
     * and throwFail is specified, this error will be re-thrown.
     * @return {YUI} this YUI instance
     */
    error: function(msg, e) {
        if (this.config.throwFail) {
            throw (e || new Error(msg)); 
        } else {
            this.message(msg, "error"); // don't scrub this one
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
        var e = this.Env, p = (pre) || e._pre,
            id = p + '-' + 
                   this.version + '-' + 
                   e._yidx      + '-' + 
                   (e._uidx++)  + '-' + 
                   _startTime;

            return id.replace(/\./g, '_');
    },

    /**
     * Returns a guid associated with an object.  If the object
     * does not have one, a new one is created unless readOnly
     * is specified.
     * @method stamp
     * @param o The object to stamp
     * @param readOnly {boolean} if true, a valid guid will only
     * be returned if the object has one assigned to it.
     * @return {string} The object's guid or null
     */
    stamp: function(o, readOnly) {

        if (!o) {
            return o;
        }

        var uid = (typeof o === 'string') ? o : o._yuid;

        if (!uid) {
            uid = this.guid();
            if (!readOnly) {
                try {
                    o._yuid = uid;
                } catch(e) {
                    uid = null;
                }
            }
        }

        return uid;
    }
};

// Give the YUI global the same properties as an instance.
// This makes it so that the YUI global can be used like the YAHOO
// global was used prior to 3.x.  More importantly, the YUI global
// provides global metadata, so env needs to be configured.
// @TODO review

    p = YUI.prototype;

    // inheritance utilities are not available yet
    for (i in p) {
        if (true) {
            YUI[i] = p[i];
        }
    }

    // set up the environment
    YUI._init();


    // add a window load event at load time so we can capture
    // the case where it fires before dynamic loading is
    // complete.
    add(window, 'load', globalListener);

    YUI.Env.add = add;
    YUI.Env.remove = remove;

})();
