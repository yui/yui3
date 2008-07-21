/**
 * YUI core
 * @module yui
 */

(function() {

    var _instances = {},

// @TODO: this needs to be created at build time from module metadata

        _APPLY_TO_WHITE_LIST = {
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
     * @class YUI
     * @constructor
     * @param o configuration object
     */
    /*global YUI*/
    YUI = function(o) {
        var Y = this;
        // Allow var yui = YUI() instead of var yui = new YUI()
        // if (!Y instanceof YUI) {
        if (Y === window) {
            // return new YUI(o).log('creating new instance');
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
        
    // @todo
    // loadcfg {
    //    base
    //    securebase
    //    filter
    //    win
    //    doc
    //    debug
    //    useConsole
    //    logInclude
    //    logExclude
    //    throwFail
    //    pollInterval
    //    core
    // }

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
            _yidx: 0,
            _uidx: 0
        };

        if (YUI.Env) {
            this.Env._yidx = ++YUI.Env._idx;
            this.id = this.stamp(this);
            _instances[this.id] = this;
        }

        this.constructor = YUI;

        this.log(this.id + ') init ');
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
        // this.mix(c, {
          //   debug: true,
            // useConsole: true
            // // , throwFail: false
        // });
        this.config = c;

        // this.publish('yui:load');
        // this.publish('yui:log', {
        //     silent: true
        // });
    },

    /**
     * Executes a method on a YUI instance with
     * the specified id.
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
                    this.fail('applyTo failure: ' + method);
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

        YUI.Env.mods[name] = m;

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

        var Y = this, 
            a=Array.prototype.slice.call(arguments, 0), 
            mods=YUI.Env.mods, 
            used = Y.Env._used,
            loader;

        // YUI().use('*'); // bind everything available
        if (a[0] === "*") {
            // a = Y.Object.keys(mods);
            // //return Y.use.apply(Y, Y.Object.keys(mods));
            a = [];
            for (var k in mods) {
                if (mods.hasOwnProperty(k)) {
                    a.push(k);
                }
            }

            return Y.use.apply(Y, a);
        }

        // Y.log('loader before: ' + a.join(','));

        // use loader to optimize and sort the requirements if it
        // is available.
        if (Y.Loader) {

            loader = new Y.Loader(Y.config);
            loader.require(a);
            loader.calculate();
            a = loader.sorted;
        }

        // Y.log('loader after: ' + a.join(','));

        var missing = [], r = [], f = function(name) {

            // only attach a module once
            if (used[name]) {
                return;
            }

            used[name] = true;

            var m = mods[name], j, req, use;

            if (m) {
                // Y.log('found ' + name);
                req = m.details.requires;
                use = m.details.use;
            } else {
                Y.log('module not found: ' + name, 'info', 'YUI');
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

            // auto-attach sub-modules
            if (use) {
                if (Y.Lang.isString(use)) {
                    f(req);
                } else {
                    for (j = 0; j < use.length; j = j + 1) {
                        f(use[j]);
                    }
                }
            }
        };

        // iterate arguments
        for (var i=0, l=a.length; i<l; i=i+1) {
            // th
            if ((i === l-1) && typeof a[i] === 'function') {
                // Y.log('found loaded listener');
                Y.on('yui:load', a[i], Y, Y);
            } else {
                f(a[i]);
            }
        }

        // Y.log('all reqs: ' + r + ' --- missing: ' + missing);

        var attach = function() {

            // Y.log('attach ' + arguments[0]);

            for (i=0, l=r.length; i<l; i=i+1) {
                var m = mods[r[i]];
                if (m) {
                    // Y.log('attaching ' + r[i], 'info', 'YUI');
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

        if (Y.Loader && missing.length) {
            // dynamic load
            Y.log('trying to get the missing modules ' + missing);
            loader = new Y.Loader();
            loader.require(missing);
            loader.subscribe('success', attach, loader, 'loader');
            loader.insert();
            // loader.subscribe('failure', function() {
                // Y.log('asdf');
                // });
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

        var Y = this, c = Y.config, es = Y.Env._eventstack,
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
                } else {
                    console.log('MSG SKIPPED: ' + msg);
                }
            }

            // category filters are not used to suppress the log event
            // so that the data can be stored and displayed later.
            if (Y.fire) {
                Y.fire('yui:log', msg, cat, src);
            }
        }

        return Y;
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
        this.log(msg, "error");

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
