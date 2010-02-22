/**
 * The YUI module contains the components required for building the YUI seed file.
 * This includes the script loading mechanism, a simple queue, and the core utilities for the library.
 * @module yui
 * @submodule yui-base
 */

if (typeof YUI === 'undefined') {

/**
 * The YUI global namespace object.  If YUI is already defined, the
 * existing YUI object will not be overwritten so that defined
 * namespaces are preserved.  It is the constructor for the object
 * the end user interacts with.  As indicated below, each instance
 * has full custom event support, but only if the event system 
 * is available.
 *
 * @class YUI
 * @constructor
 * @global
 * @uses EventTarget
 * @param o* Up to five optional configuration objects.  This object is stored
 * in YUI.config.  See config for the list of supported properties.
 */
    /*global YUI*/
    /*global YUI_config*/
    var YUI = function(o1, o2, o3, o4, o5) {

        var Y = this, a = arguments, i, l = a.length,
            globalConfig = (typeof YUI_config !== 'undefined') && YUI_config;

        // Allow instantiation without the new operator
        if (!(Y instanceof YUI)) {
            return new YUI(o1, o2, o3, o4, o5);
        } else {
            // set up the core environment
            Y._init();
            if (globalConfig) {
                Y._config(globalConfig);
            }
            for (i=0; i<l; i++) {
                Y._config(a[i]);
            }
            // bind the specified additional modules for this instance
            Y._setup();
            return Y;
        }
    };
}

(function() {

    var p, i,
        VERSION       = '@VERSION@', 
        DOC_LABEL     = 'yui3-js-enabled',
        NOOP          = function() {},
        APPLY_TO_AUTH = { 'io.xdrReady':      1,   // the functions applyTo 
                          'io.xdrResponse':   1,   // can call. this should
                          'SWF.eventHandler': 1 }, // be done at build time
        SLICE         = Array.prototype.slice,
        hasWin        = (typeof window != 'undefined'),
        win           = (hasWin) ? window : null,
        doc           = (hasWin) ? win.document : null,
        docEl         = doc && doc.documentElement,
        docClass      = docEl && docEl.className,
        instances     = {}, 
        time          = new Date().getTime(), 
        add           = function(el, type, fn, capture) {
                            if (el && el.addEventListener) {
                                el.addEventListener(type, fn, capture);
                            } else if (el && el.attachEvent) {
                                el.attachEvent("on" + type, fn);
                            } 
                        },
        remove        = function (el, type, fn, capture) {
                            if (el && el.removeEventListener) {
                                el.removeEventListener(type, fn, capture);
                            } else if (el && el.detachEvent) {
                                el.detachEvent("on" + type, fn);
                            }
                        },
        handleLoad    = function() {
                            YUI.Env.windowLoaded = true;
                            YUI.Env.DOMReady = true;
                            if (hasWin) {
                                remove(window, 'load', handleLoad);
                            }
                        };


//  Stamp the documentElement (HTML) with a class of "yui-loaded" to 
//  enable styles that need to key off of JS being enabled.
if (docEl && docClass.indexOf(DOC_LABEL) == -1) {
    if (docClass) {
        docClass += ' ';
    }
    docClass += DOC_LABEL;
    docEl.className = docClass;
}

if (VERSION.indexOf('@') > -1) {
    VERSION = '3.0.0';
}
        
// The prototype contains the functions that are required to allow the external
// modules to be registered and for the instance to be initialized.
YUI.prototype = {

    _config: function(o) {
        o = o || {};
        var config = this.config, i, j, m, mods = config.modules;
        for (i in o) {
            if (mods && i == 'modules') {
                m = o[i];
                for (j in m) {
                    if (m.hasOwnProperty(j)) {
                        mods[j] = m[j];
                    }
                }
            } else if (i == 'win') {
                config[i] = o[i].contentWindow || o[i];
                config.doc = config[i].document;
            } else {
                config[i] = o[i];
            }
        }
    },

    /**
     * Initialize this YUI instance
     * @private
     */
    _init: function() {
        var filter,
            Y = this, 
            G_ENV = YUI.Env,
            Env = Y.Env;

        Y.version = VERSION;
        Y.gallery = 'gallery-2010.02.10-01'; // @TODO build time

        if (!Env) {
            Y.Env = {
                // @todo expand the new module metadata
                mods: {},
                cdn: 'http://yui.yahooapis.com/' + VERSION + '/build/',
                bootstrapped: false,
                _idx: 0,
                _used: {},
                _attached: {},
                _yidx: 0,
                _uidx: 0,
                _guidp: 'y',
                _loaded: {}

            };

            Env = Y.Env;

            Env._loaded[VERSION] = {};

            if (G_ENV && Y !== YUI) {
                Env._yidx  = ++G_ENV._yidx;
Env._guidp = ('yui_' + VERSION + '_' + Env._yidx + '_' + time).replace(/\./g, '_');
            }

            Y.id = Y.stamp(Y);
            instances[Y.id] = Y;

        }

        Y.constructor = YUI;

        // configuration defaults
        Y.config = Y.config || {

            win: win,
            doc: doc,
            debug: true,
            useBrowserConsole: true,
            throwFail: true,
            bootstrap: true,
            fetchCSS: true,
        
            // base: (Y === YUI) ? Env.cdn : function() {
            base: (YUI.config && YUI.config.base) || function() {
                var b, nodes, i, src, match;

                // get from querystring
                nodes = (doc && doc.getElementsByTagName('script')) || [];

                for (i=0; i<nodes.length; i=i+1) {
                    src = nodes[i].src;

                    if (src) {
// DEBUG
//src = "http://yui.yahooapis.com/combo?2.8.0r4/build/yuiloader-dom-event/yuiloader-dom-event.js&3.0.0/build/yui/yui-min.js";
//console.log('src) ' + src);
// DEBUG
                        match = src.match(/^(.*)yui\/yui([\.\-].*)js(\?.*)?$/);
                        b = match && match[1];

                        if (b) {

                            // this is to set up the path to the loader.  The file filter for loader should match
                            // the yui include.
                            filter = match[2];

// extract correct path for mixed combo urls
// http://yuilibrary.com/projects/yui3/ticket/2528423
// http://yui.yahooapis.com/combo?2.8.0r4/build/yuiloader-dom-event/yuiloader-dom-event.js&3.0.0/build/yui/yui-min.js
                            match = src.match(/^(.*\?)(.*\&)(.*)yui\/yui[\.\-].*js(\?.*)?$/);
                            if (match && match[3]) {
                                b = match[1] + match[3];
                            }

                            break;
                        }
                    }
                }

                // use CDN default
                return b || Env.cdn;

            }(),

            loaderPath: (YUI.config && YUI.config.loaderPath) || 'loader/loader' + (filter || '-min.') + 'js'
        };

    },
    
    /**
     * Finishes the instance setup. Attaches whatever modules were defined
     * when the yui modules was registered.
     * @method _setup
     * @private
     */
    _setup: function(o) {

        var Y = this,
            core = [],
            mods = YUI.Env.mods,
            extras = Y.config.core || ['get', 'intl-base', 'loader', 'yui-log', 'yui-later', 'yui-throttle'];


        for (i=0; i<extras.length; i++) {
            if (mods[extras[i]]) {
                core.push(extras[i]);
            }
        }

        Y.use('yui-base');
        Y.use.apply(Y, core);

        console.log(Y.id + ' initialized', 'info', 'yui');
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

        if (!(method in APPLY_TO_AUTH)) {
            this.log(method + ': applyTo not allowed', 'warn', 'yui');
            return null;
        }

        var instance = instances[id], nest, m, i;
        if (instance) {
            nest = method.split('.'); 
            m = instance;
            for (i=0; i<nest.length; i=i+1) {
                m = m[nest[i]];
                if (!m) {
                    this.log('applyTo not found: ' + method, 'warn', 'yui');
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
        // @todo may want to restore the build property
        // @todo fire moduleAvailable event
        details = details || {};

        YUI.Env.mods[name] = {
            name: name, 
            fn: fn,
            version: version,
            details: details
        };

        return this;
    },

    _attach: function(r, fromLoader) {
        var i, name, mod, details, req, use,
            mods = YUI.Env.mods,
            done = this.Env._attached,
            len  = r.length;

        for (i=0; i<len; i++) {
            name = r[i]; 
            mod  = mods[name];
            if (!done[name] && mod) {

                done[name] = true;
                details    = mod.details; 
                req        = details.requires; 
                use        = details.use;

                if (req) {
                    this._attach(this.Array(req));
                }

                // this.log('attaching ' + name, 'info', 'yui');

                if (mod.fn) {
                    mod.fn(this, name);
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

        if (!this.Array) {
            this._attach(['yui-base']);
        }

        var len, loader, handleBoot,
            Y        = this, 
            G_ENV    = YUI.Env,
            args     = SLICE.call(arguments, 0), 
            mods     = G_ENV.mods, 
            Env      = Y.Env,
            used     = Env._used,
            queue    = G_ENV._loaderQueue,
            firstArg = args[0], 
            callback = args[args.length - 1],
            YArray   = Y.Array,
            config   = Y.config,
            boot     = config.bootstrap,
            missing  = [], 
            r        = [], 
            fetchCSS = config.fetchCSS,
            process  = function(name) {
                // only attach a module once
                if (used[name]) {
                    return;
                }

                var m = mods[name], req, use;

                if (m) {
                    used[name] = true;
                    req = m.details.requires;
                    use = m.details.use;
                } else {
                    // CSS files don't register themselves, see if it has been loaded
                    if (!G_ENV._loaded[VERSION][name]) {
                        missing.push(name);
                    } else {
                        used[name] = true; // probably css
                    }
                }

                if (req) { // make sure requirements are attached
                    YArray.each(YArray(req), process);
                }

                if (use) { // make sure we grab the submodule dependencies too
                    YArray.each(YArray(use), process);
                }

                // add this module to full list of things to attach
                r.push(name);

            },

            handleLoader = function(fromLoader) {
                var response = fromLoader || {
                        success: true,
                        msg: 'not dynamic'
                    }, 
                    newData, redo, missingFlat, origMissing,
                    data = response.data;

                Y._loading = false;

                // console.log('Use complete: ' + data);

                if (callback) {
                    if (data) {
                        origMissing = missing.concat();
                        missing = [];
                        Y.Array.each(data, process);
                        redo = missing.length;
                        if (redo) {
                            missingFlat = missing.sort().join();
                            if (missingFlat == origMissing.sort().join()) {
                                redo = false;
                            }
                        }
                    }

                    // if (redo && data && !Env._retry) {
                    if (redo && data) {
                        // Y.log('redo: ' + r);
                        // Y.log('redo: ' + missing);
                        // Y.log('redo: ' + args);
                        // Env._retry = true;
                        newData = data.concat();
                        newData.push(function() {
                            Y.log('Nested USE callback: ' + data);
                            Y._attach(data);
                            callback(Y, response);
                        });
                        Y._loading  = false;
                        Y.use.apply(Y, newData);
                        // Env._retry = false;
                    } else {
                        //Y.log('No data handleLoader: ');
                        if (data) {
                            Y._attach(data);
                        }
                        callback(Y, response);
                    }
                }

                if (Y._useQueue && Y._useQueue.size() && !Y._loading) {
                    Y.use.apply(Y, Y._useQueue.next());
                }
            };


        if (Y._loading) {
            Y._useQueue = Y._useQueue || new Y.Queue();
            Y._useQueue.add(args);
            return Y;
        }

        // Y.log(Y.id + ': use called: ' + a + ' :: ' + callback, 'info', 'yui');

        // The last argument supplied to use can be a load complete callback
        if (typeof callback === 'function') {
            args.pop();
        } else {
            callback = null;
        }
 
        // YUI().use('*'); // bind everything available
        if (firstArg === "*") {
            args = Y.Object.keys(mods);
        }
        
        // use loader to expand dependencies and sort the 
        // requirements if it is available.
        if (Y.Loader) {
            loader = new Y.Loader(config);
            loader.require(args);
            loader.ignoreRegistered = true;
            // loader.allowRollup = false;
            loader.calculate(null, (fetchCSS) ? null : 'js');
            args = loader.sorted;
        }

        // process each requirement and any additional requirements 
        // the module metadata specifies
        YArray.each(args, process);

        Y.log('Module requirements: ' + args, 'info', 'yui');
        len = missing.length;

        if (len) {
            missing = Y.Object.keys(YArray.hash(missing));
            len = missing.length;
            Y.log('Modules missing: ' + missing + ', ' + missing.length, 'info', 'yui');
        }

        // dynamic load
        if (boot && len && Y.Loader) {
            Y.log('Using loader to fetch missing dependencies: ' + missing, 'info', 'yui');
            Y._loading = true;
            loader = new Y.Loader(config);
            loader.onEnd = handleLoader;
            loader.context = Y;
            loader.attaching = args;
            loader.data = args;
            loader.require((fetchCSS) ? missing : args);
            loader.insert(null, (fetchCSS) ? null : 'js');
        } else if (boot && len && Y.Get && !Env.bootstrapped) {

            Y._loading = true;
            args = YArray(arguments, 0, true);

            handleBoot = function() {
                Y._loading = false;
                queue.running = false;
                Env.bootstrapped = true;
                Y._attach(['loader']);
                Y.use.apply(Y, args);
            };

            if (G_ENV._bootstrapping) {
Y.log('Waiting for loader: ' + Y.id, 'info', 'yui');
                queue.add(handleBoot);
            } else {
                G_ENV._bootstrapping = true;
Y.log('Fetching loader: ' + Y.id + ", " + config.base + config.loaderPath, 'info', 'yui');
                Y.Get.script(config.base + config.loaderPath, {
                    onEnd: handleBoot 
                });
            }

        } else {
            if (len) {
                Y.message('Requirement NOT loaded: ' + missing, 'warn', 'yui');
Y.log('This instance is not provisioned to fetch missing modules: ' + missing, 'log', 'yui');
            }
            Y.log('Attaching available dependencies.', 'info', 'yui');
            Y._attach(r);
            handleLoader();
        }

        return Y;
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
    log: NOOP,
    message: NOOP,
    

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
        var id =  this.Env._guidp + (++this.Env._uidx);
        return (pre) ? (pre + id) : id;
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
        if (1) { // intenionally ignoring hasOwnProperty check
            YUI[i] = p[i];
        }
    }

    // set up the environment
    YUI._init();

    // setTimeout(function() { YUI._attach(['yui-base']); }, 0);

    if (hasWin) {
        // add a window load event at load time so we can capture
        // the case where it fires before dynamic loading is
        // complete.
        add(window, 'load', handleLoad);
    } else {
        handleLoad();
    }

    YUI.Env.add = add;
    YUI.Env.remove = remove;

    /*global exports*/
    // Support the CommonJS method for exporting our single global
    if (typeof exports == 'object') {
        exports.YUI = YUI;
    }

})();

/**
 * The config object contains all of the configuration options for
 * the YUI instance.  This object is supplied by the implementer 
 * when instantiating a YUI instance.  Some properties have default
 * values if they are not supplied by the implementer.
 *
 * @class config
 * @static
 */

/**
 * Allows the YUI seed file to fetch the loader component and library
 * metadata to dynamically load additional dependencies.
 *
 * @property bootstrap
 * @type boolean
 * @default true
 */

/**
 * Log to the browser console if debug is on and the browser has a
 * supported console.
 *
 * @property useBrowserConsole
 * @type boolean
 * @default true
 */

/**
 * A hash of log sources that should be logged.  If specified, only log messages from these sources will be logged.
 *
 * @property logInclude
 * @type object
 */

/**
 * A hash of log sources that should be not be logged.  If specified, all sources are logged if not on this list.
 *
 * @property logExclude
 * @type object
 */

/**
 * Set to true if the yui seed file was dynamically loaded in 
 * order to bootstrap components relying on the window load event 
 * and the 'domready' custom event.
 *
 * @property injected
 * @type boolean
 * @default false
 */

/**
 * If throwFail is set, Y.fail will generate or re-throw a JS Error.  Otherwise the failure is logged.
 *
 * @property throwFail
 * @type boolean
 * @default true
 */

/**
 * The window/frame that this instance should operate in.
 *
 * @property win
 * @type Window
 * @default the window hosting YUI
 */

/**
 * The document associated with the 'win' configuration.
 *
 * @property doc
 * @type Document
 * @default the document hosting YUI
 */

/**
 * A list of modules that defines the YUI core (overrides the default).
 *
 * @property core
 * @type string[]
 */

/**
 * A list of languages in order of preference. This list is matched against
 * the list of available languages in modules that the YUI instance uses to
 * determine the best possible localization of language sensitive modules.
 * Languages are represented using BCP 47 language tags, such as "en-GB" for
 * English as used in the United Kingdom, or "zh-Hans-CN" for simplified
 * Chinese as used in China. The list can be provided as a comma-separated
 * list or as an array.
 *
 * @property lang
 * @type string|string[]
 */

/**
 * The default date format
 * @property dateFormat
 * @type string
 * @deprecated use configuration in DataType.Date.format() instead
 */

/**
 * The default locale
 * @property locale
 * @type string
 * @deprecated use config.lang instead
 */

/**
 * The default interval when polling in milliseconds.
 * @property pollInterval
 * @type int
 * @default 20
 */

/**
 * The number of dynamic nodes to insert by default before
 * automatically removing them.  This applies to script nodes
 * because remove the node will not make the evaluated script
 * unavailable.  Dynamic CSS is not auto purged, because removing
 * a linked style sheet will also remove the style definitions.
 * @property purgethreshold
 * @type int
 * @default 20
 */

/**
 * The default interval when polling in milliseconds.
 * @property windowResizeDelay
 * @type int
 * @default 40
 */

/**
 * Base directory for dynamic loading
 * @property base
 * @type string
 */

/**
 * The secure base dir (not implemented)
 * For dynamic loading.
 * @property secureBase
 * @type string
 */

/**
 * The YUI combo service base dir. Ex: http://yui.yahooapis.com/combo?
 * For dynamic loading.
 * @property comboBase
 * @type string
 */

/**
 * The root path to prepend to module path for the combo service. Ex: 3.0.0b1/build/
 * For dynamic loading.
 * @property root
 * @type string
 */

/**
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
 * For dynamic loading.
 *
 * @property filter
 * @type string|object
 */

/**
 * Hash of per-component filter specification.  If specified for a given component, 
 * this overrides the filter config
 *
 * For dynamic loading.
 *
 * @property filters
 * @type object
 */

/**
 * Use the YUI combo service to reduce the number of http connections 
 * required to load your dependencies.  Turning this off will
 * disable combo handling for YUI and all module groups configured
 * with a combo service.
 *
 * For dynamic loading.
 *
 * @property combine
 * @type boolean
 * @default true if 'base' is not supplied, false if it is.
 */

/**
 * A list of modules that should never be dynamically loaded
 *
 * @property ignore
 * @type string[]
 */

/**
 * A list of modules that should always be loaded when required, even if already 
 * present on the page.
 *
 * @property force
 * @type string[]
 */

/**
 * Node or id for a node that should be used as the insertion point for new nodes
 * For dynamic loading.
 *
 * @property insertBefore
 * @type string
 */

/**
 * charset for dynamic nodes
 * @property charset
 * @type string
 * @deprecated use jsAttributes cssAttributes
 */

/**
 * Object literal containing attributes to add to dynamically loaded script nodes.
 * @property jsAttributes
 * @type string
 */

/**
 * Object literal containing attributes to add to dynamically loaded link nodes.
 * @property cssAttributes
 * @type string
 */

/**
 * Number of milliseconds before a timeout occurs when dynamically 
 * loading nodes. If not set, there is no timeout.
 * @property timeout
 * @type int
 */

/**
 * Callback for the 'CSSComplete' event.  When dynamically loading YUI 
 * components with CSS, this property fires when the CSS is finished
 * loading but script loading is still ongoing.  This provides an
 * opportunity to enhance the presentation of a loading page a little
 * bit before the entire loading process is done.
 *
 * @property onCSS
 * @type function
 */

/**
 * A hash of module definitions to add to the list of YUI components.  
 * These components can then be dynamically loaded side by side with
 * YUI via the use() method. This is a hash, the key is the module
 * name, and the value is an object literal specifying the metdata
 * for the module.  * See Loader.addModule for the supported module
 * metadata fields.  Also @see groups, which provides a way to
 * configure the base and combo spec for a 
 * <code>
 * modules: {
 * &nbsp; mymod1: {
 * &nbsp;   requires: ['node'],
 * &nbsp;   fullpath: 'http://myserver.mydomain.com/mymod1/mymod1.js'
 * &nbsp; },
 * &nbsp; mymod2: {
 * &nbsp;   requires: ['mymod1'],
 * &nbsp;   fullpath: 'http://myserver.mydomain.com/mymod2/mymod2.js'
 * &nbsp; }
 * }
 * </code>
 *
 * @property modules
 * @type object
 */

/**
 * A hash of module group definitions.  It for each group you
 * can specify a list of modules and the base path and
 * combo spec to use when dynamically loading the modules.  @see
 * @see modules for the details about the modules part of the
 * group definition.
 * <code>
 * &nbsp; groups: {
 * &nbsp;     yui2: {
 * &nbsp;         // specify whether or not this group has a combo service
 * &nbsp;         combine: true,
 * &nbsp;
 * &nbsp;         // the base path for non-combo paths
 * &nbsp;         base: 'http://yui.yahooapis.com/2.8.0r4/build/',
 * &nbsp;
 * &nbsp;         // the path to the combo service
 * &nbsp;         comboBase: 'http://yui.yahooapis.com/combo?',
 * &nbsp;
 * &nbsp;         // a fragment to prepend to the path attribute when
 * &nbsp;         // when building combo urls
 * &nbsp;         root: '2.8.0r4/build/',
 * &nbsp;
 * &nbsp;         // the module definitions
 * &nbsp;         modules:  {
 * &nbsp;             yui2_yde: {
 * &nbsp;                 path: "yahoo-dom-event/yahoo-dom-event.js"
 * &nbsp;             },
 * &nbsp;             yui2_anim: {
 * &nbsp;                 path: "animation/animation.js",
 * &nbsp;                 requires: ['yui2_yde']
 * &nbsp;             }
 * &nbsp;         }
 * &nbsp;     }
 * &nbsp; }
 * </code>
 * @property modules
 * @type object
 */
 
/**
 * The loader 'path' attribute to the loader itself.  This is combined
 * with the 'base' attribute to dynamically load the loader component
 * when boostrapping with the get utility alone.
 *
 * @property loaderPath
 * @type string
 * @default loader/loader-min.js
 */

/**
 * Specifies whether or not YUI().use(...) will attempt to load CSS
 * resources at all.  Any truthy value will cause CSS dependencies
 * to load when fetching script.  The special value 'force' will 
 * cause CSS dependencies to be loaded even if no script is needed.
 *
 * @property fetchCSS
 * @type boolean|string
 * @default true
 */

/**
 * The default gallery version to create gallery module urls
 * @property gallery
 * @type string
 */

/**
 * Alternative console log function for use in environments without
 * a supported native console
 * @property logFn
 * @type Function
 */
