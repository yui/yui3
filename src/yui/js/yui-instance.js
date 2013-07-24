
var clobber = function(r, s) {
    for (var i in s) {
        if (s.hasOwnProperty(i)) {
            r[i] = s[i];
        }
    }
};


var Instance = function() {

    this.version = Factory.version;

    this.Env = {
        parseBasePath: Factory.Env.parseBasePath,
        _BASE_RE: Factory.Env._BASE_RE,
        base: Factory.Env.base,
        root: Factory.Env.root,
        skin: {
            defaultSkin: 'sam',
            base: 'assets/skins/',
            path: 'skin.css',
            after: [
                'cssreset',
                'cssfonts',
                'cssgrids',
                'cssbase',
                'cssreset-context',
                'cssfonts-context'
            ]
        },
        comboBase: Factory.Env.comboBase,
        cdn: Factory.Env.cdn,
        UA: Factory.UA,
        _attached: {},
        _missed: [],
        _used: {},
        _uidx: 0,
        _yidx: ++Factory.Env._yidx,
        _guidp: ('yui_' + VERSION + '_' + Factory.Env._yidx + '_' + time).replace(/[^a-z0-9_]+/g, '_')
    };


    this.UA = this.Env.UA;

    this.id = this.stamp(this);

    this.config = {
        bootstrap: true,
        cacheUse: true,
        debug: true,
        doc: doc,
        fetchCSS: true,
        throwFail: true,
        useBrowserConsole: true,
        useNativeES5: true,
        win: win,
        base: Factory.Env.base,
        global: Function('return this')(),
        loaderPath: Factory.Env.loaderPath,
        lang: 'en-US'
    };
    
    if (typeof YUI_config === 'object') {
        this.applyConfig(YUI_config);
    }
    if (typeof YUI.GlobalConfig === 'object') {
        this.applyConfig(YUI.GlobalConfig);
    }
    var len = arguments.length;
    for (var i = 0; i < len; i++) {
        this.applyConfig(arguments[i]);
    }

    this._setup();
};


Instance.prototype = {
    instanceOf: function(o, type) {
        if (type === Factory) {
            type = Instance;
        }
        return (o && o.hasOwnProperty && (o instanceof type));
    },
    _getLoader: function(Y, o) {
        var loader = Y.Env._loader,
            lCore = [ 'loader-base' ],
            G_ENV = Factory.Env,
            mods = G_ENV.mods;

        if (loader) {
            //loader._config(Y.config);
            loader.ignoreRegistered = false;
            loader.onEnd = null;
            loader.data = null;
            loader.required = [];
            loader.loadType = null;
        } else {
            loader = new Y.Loader(Y.config);
            Y.Env._loader = loader;
        }
        if (mods && mods.loader) {
            lCore = [].concat(lCore, Factory.Env.loaderExtras);
        }
        Factory.Env.core = Y.Array.dedupe([].concat(Factory.Env.core, lCore));

        return loader;
    },
    use: function() {
        var args = Array.prototype.slice.call(arguments, 0),
            callback = args[args.length - 1],
            Y = this,
            i = 0,
            name,
            Env = Y.Env,
            provisioned = true;

        // The last argument supplied to use can be a load complete callback
        if (Y.Lang.isFunction(callback)) {
            args.pop();
            if (Y.config.delayUntil) {
                callback = Y._delayCallback(callback, Y.config.delayUntil);
            }
        } else {
            callback = null;
        }
        if (Y.Lang.isArray(args[0])) {
            args = args[0];
        }

        if (Y.config.cacheUse) {
            while ((name = args[i++])) {
                if (!Env._attached[name]) {
                    provisioned = false;
                    break;
                }
            }

            if (provisioned) {
                if (args.length) {
                    Y.log('already provisioned: ' + args, 'info', 'yui');
                }
                Y._notify(callback, ALREADY_DONE, args);
                return Y;
            }
        }

        if (Y._loading) {
            Y._useQueue = Y._useQueue || new Y.Queue();
            Y._useQueue.add([args, callback]);
        } else {
            Y._use(args, function(Y, response) {
                Y._notify(callback, response, args);
            });
        }

        return Y;
    },
    toString: function() {
        return 'YUI Instance #' + this.Env._yidx + ' : ' + this.Env._guidp;
    },
    // this is replaced if the log module is included
    log: function() {},
    message: function() {},
    // this is replaced if the dump module is included
    dump: function (o) { return ''+o; },

    /**
    Reports an error.

    The reporting mechanism is controlled by the `throwFail` configuration
    attribute. If `throwFail` is falsy, the message is logged. If `throwFail` is
    truthy, a JS exception is thrown.

    If an `errorFn` is specified in the config it must return `true` to indicate
    that the exception was handled and keep it from being thrown.

    @method error
    @param {String} msg Error message.
    @param {Error|String} [e] JavaScript error object or an error string.
    @param {String} [src] Source of the error (such as the name of the module in
        which the error occurred).
    @chainable
    **/
    error: function(msg, e, src) {
        //TODO Add check for window.onerror here

        var Y = this, ret;

        if (Y.config.errorFn) {
            ret = Y.config.errorFn.apply(Y, arguments);
        }

        if (!ret) {
            throw (e || new Error(msg));
        } else {
            Y.message(msg, 'error', ''+src); // don't scrub this one
        }

        return Y;
    },

    /**
    Generates an id string that is unique among all YUI instances in this
    execution context.

    @method guid
    @param {String} [pre] Prefix.
    @return {String} Unique id.
    **/
    guid: function(pre) {
        var id = this.Env._guidp + '_' + (++this.Env._uidx);
        return (pre) ? (pre + id) : id;
    },

    /**
    Returns a unique id associated with the given object and (if *readOnly* is
    falsy) stamps the object with that id so it can be identified in the future.

    Stamping an object involves adding a `_yuid` property to it that contains
    the object's id. One exception to this is that in Internet Explorer, DOM
    nodes have a `uniqueID` property that contains a browser-generated unique
    id, which will be used instead of a YUI-generated id when available.

    @method stamp
    @param {Object} o Object to stamp.
    @param {Boolean} readOnly If truthy and the given object has not already
        been stamped, the object will not be modified and `null` will be
        returned.
    @return {String} Object's unique id, or `null` if *readOnly* was truthy and
        the given object was not already stamped.
    **/
    stamp: function(o, readOnly) {
        var uid;
        if (!o) {
            return o;
        }

        // IE generates its own unique ID for dom nodes
        // The uniqueID property of a document node returns a new ID
        if (o.uniqueID && o.nodeType && o.nodeType !== 9) {
            uid = o.uniqueID;
        } else {
            uid = (typeof o === 'string') ? o : o._yuid;
        }

        if (!uid) {
            uid = this.guid();
            if (!readOnly) {
                try {
                    o._yuid = uid;
                } catch (e) {
                    uid = null;
                }
            }
        }
        return uid;
    },

    /**
    Destroys this YUI instance.

    @method destroy
    @since 3.3.0
    **/
    destroy: function() {
        var Y = this;
        if (Y.Event) {
            Y.Event._unload();
        }
        delete instances[Y.id];
        delete Y.Env;
        delete Y.config;
    },
    _setup: function() {
        var i, Y = this,
            core = ['yui-base'],
            mods = Factory.Env.mods,
            extras = Y.config.core || [].concat(Factory.Env.core); //Clone it..

        for (i = 0; i < extras.length; i++) {
            if (mods[extras[i]]) {
                core.push(extras[i]);
            }
        }

        Y._attach(core);

        if (Y.Loader) {
            Y._getLoader(Y);
        }

        // Y.log(Y.id + ' initialized', 'info', 'yui');
    },
    /**
    Executes the callback function associated with each required module,
    attaching the module to this YUI instance.

    @method _attach
    @param {Array} r The array of modules to attach
    @param {Boolean} [moot=false] If `true`, don't throw a warning if the module
        is not attached.
    @private
    **/
    _attach: function(r, moot) {
        var i, name, mod, details, req, use, after,
            mods = Factory.Env.mods,
            aliases = Factory.Env.aliases,
            Y = this, j,
            cache = Factory.Env._renderedMods,
            loader = Y.Env._loader,
            done = Y.Env._attached,
            len = r.length, loader, def, go,
            c = [];

        //Check for conditional modules (in a second+ instance) and add their requirements
        //TODO I hate this entire method, it needs to be fixed ASAP (3.5.0) ^davglass
        for (i = 0; i < len; i++) {
            name = r[i];
            mod = mods[name];
            c.push(name);
            if (loader && loader.conditions[name]) {
                for (j in loader.conditions[name]) {
                    if (loader.conditions[name].hasOwnProperty(j)) {
                        def = loader.conditions[name][j];
                        go = def && ((def.ua && Y.UA[def.ua]) || (def.test && def.test(Y)));
                        if (go) {
                            c.push(def.name);
                        }
                    }
                }
            }
        }
        r = c;
        len = r.length;

        for (i = 0; i < len; i++) {
            if (!done[r[i]]) {
                name = r[i];
                mod = mods[name];

                if (aliases && aliases[name] && !mod) {
                    Y._attach(aliases[name]);
                    continue;
                }
                if (!mod) {
                    if (loader && loader.moduleInfo[name]) {
                        mod = loader.moduleInfo[name];
                        moot = true;
                    }

                    // Y.log('no js def for: ' + name, 'info', 'yui');

                    //if (!loader || !loader.moduleInfo[name]) {
                    //if ((!loader || !loader.moduleInfo[name]) && !moot) {
                    if (!moot && name) {
                        if ((name.indexOf('skin-') === -1) && (name.indexOf('css') === -1)) {
                            Y.Env._missed.push(name);
                            Y.Env._missed = Y.Array.dedupe(Y.Env._missed);
                            Y.message('NOT loaded: ' + name, 'warn', 'yui');
                        }
                    }
                } else {
                    done[name] = true;
                    //Don't like this, but in case a mod was asked for once, then we fetch it
                    //We need to remove it from the missed list ^davglass
                    for (j = 0; j < Y.Env._missed.length; j++) {
                        if (Y.Env._missed[j] === name) {
                            Y.message('Found: ' + name + ' (was reported as missing earlier)', 'warn', 'yui');
                            Y.Env._missed.splice(j, 1);
                        }
                    }
                    /*
                        If it's a temp module, we need to redo it's requirements if it's already loaded
                        since it may have been loaded by another instance and it's dependencies might
                        have been redefined inside the fetched file.
                    */
                    if (loader && cache && cache[name] && cache[name].temp) {
                        loader.getRequires(cache[name]);
                        req = [];
                        for (j in loader.moduleInfo[name].expanded_map) {
                            if (loader.moduleInfo[name].expanded_map.hasOwnProperty(j)) {
                                req.push(j);
                            }
                        }
                        Y._attach(req);
                    }

                    details = mod.details;
                    req = details.requires;
                    use = details.use;
                    after = details.after;
                    //Force Intl load if there is a language (Loader logic) @todo fix this shit
                    if (details.lang) {
                        req = req || [];
                        req.unshift('intl');
                    }

                    if (req) {
                        for (j = 0; j < req.length; j++) {
                            if (!done[req[j]]) {
                                if (!Y._attach(req)) {
                                    return false;
                                }
                                break;
                            }
                        }
                    }

                    if (after) {
                        for (j = 0; j < after.length; j++) {
                            if (!done[after[j]]) {
                                if (!Y._attach(after, true)) {
                                    return false;
                                }
                                break;
                            }
                        }
                    }

                    if (mod.fn) {
                            if (Y.config.throwFail) {
                                mod.fn(Y, name);
                            } else {
                                try {
                                    mod.fn(Y, name);
                                } catch (e) {
                                    Y.error('Attach error: ' + name, e, name);
                                return false;
                            }
                        }
                    }

                    if (use) {
                        for (j = 0; j < use.length; j++) {
                            if (!done[use[j]]) {
                                if (!Y._attach(use)) {
                                    return false;
                                }
                                break;
                            }
                        }
                    }



                }
            }
        }

        return true;
    },
    /**
    Utility method for safely creating namespaces if they don't already exist.
    May be called statically on the YUI global object or as a method on a YUI
    instance.

    When called statically, a namespace will be created on the YUI global
    object:

        // Create `YUI.your.namespace.here` as nested objects, preserving any
        // objects that already exist instead of overwriting them.
        YUI.namespace('your.namespace.here');

    When called as a method on a YUI instance, a namespace will be created on
    that instance:

        // Creates `Y.property.package`.
        Y.namespace('property.package');

    Dots in the input string cause `namespace` to create nested objects for each
    token. If any part of the requested namespace already exists, the current
    object will be left in place and will not be overwritten. This allows
    multiple calls to `namespace` to preserve existing namespaced properties.

    If the first token in the namespace string is "YAHOO", that token is
    discarded. This is legacy behavior for backwards compatibility with YUI 2.

    Be careful with namespace tokens. Reserved words may work in some browsers
    and not others. For instance, the following will fail in some browsers
    because the supported version of JavaScript reserves the word "long":

        Y.namespace('really.long.nested.namespace');

    Note: If you pass multiple arguments to create multiple namespaces, only the
    last one created is returned from this function.

    @method namespace
    @param {String} namespace* One or more namespaces to create.
    @return {Object} Reference to the last namespace object created.
    **/
    namespace: function() {
        var a = arguments, o, i = 0, j, d, arg;

        for (; i < a.length; i++) {
            o = this; //Reset base object per argument or it will get reused from the last
            arg = a[i];
            if (arg.indexOf('.') > -1) { //Skip this if no "." is present
                d = arg.split('.');
                for (j = (d[0] == 'YAHOO') ? 1 : 0; j < d.length; j++) {
                    o[d[j]] = o[d[j]] || {};
                    o = o[d[j]];
                }
            } else {
                o[arg] = o[arg] || {};
                o = o[arg]; //Reset base object to the new object so it's returned
            }
        }
        return o;
    },
    _use: function(args, callback) {

        if (!this.Array) {
            this._attach(['yui-base']);
        }

        var len, loader, handleBoot,
            Y = this,
            G_ENV = YUI.Env,
            mods = G_ENV.mods,
            Env = Y.Env,
            used = Env._used,
            aliases = G_ENV.aliases,
            queue = G_ENV._loaderQueue,
            firstArg = args[0],
            YArray = Y.Array,
            config = Y.config,
            boot = config.bootstrap,
            missing = [],
            i,
            r = [],
            ret = true,
            fetchCSS = config.fetchCSS,
            process = function(names, skip) {

                var i = 0, a = [], name, len, m, req, use;

                if (!names.length) {
                    return;
                }

                if (aliases) {
                    len = names.length;
                    for (i = 0; i < len; i++) {
                        if (aliases[names[i]] && !mods[names[i]]) {
                            a = [].concat(a, aliases[names[i]]);
                        } else {
                            a.push(names[i]);
                        }
                    }
                    names = a;
                }

                len = names.length;

                for (i = 0; i < len; i++) {
                    name = names[i];
                    if (!skip) {
                        r.push(name);
                    }

                    // only attach a module once
                    if (used[name]) {
                        continue;
                    }

                    m = mods[name];
                    req = null;
                    use = null;

                    if (m) {
                        used[name] = true;
                        req = m.details.requires;
                        use = m.details.use;
                    } else {
                        // CSS files don't register themselves, see if it has
                        // been loaded
                        if (!G_ENV._loaded[VERSION][name]) {
                            missing.push(name);
                        } else {
                            used[name] = true; // probably css
                        }
                    }

                    // make sure requirements are attached
                    if (req && req.length) {
                        process(req);
                    }

                    // make sure we grab the submodule dependencies too
                    if (use && use.length) {
                        process(use, 1);
                    }
                }

            },

            handleLoader = function(fromLoader) {
                var response = fromLoader || {
                        success: true,
                        msg: 'not dynamic'
                    },
                    redo, origMissing,
                    ret = true,
                    data = response.data;

                Y._loading = false;

                if (data) {
                    origMissing = missing;
                    missing = [];
                    r = [];
                    process(data);
                    redo = missing.length;
                    if (redo) {
                        if ([].concat(missing).sort().join() ==
                                origMissing.sort().join()) {
                            redo = false;
                        }
                    }
                }

                if (redo && data) {
                    Y._loading = true;
                    Y._use(missing, function() {
                        Y.log('Nested use callback: ' + data, 'info', 'yui');
                        if (Y._attach(data)) {
                            Y._notify(callback, response, data);
                        }
                        Y._loading = false;
                    });
                } else {
                    if (data) {
                        // Y.log('attaching from loader: ' + data, 'info', 'yui');
                        ret = Y._attach(data);
                    }
                    if (ret) {
                        Y._notify(callback, response, args);
                    }
                }

                if (Y._useQueue && Y._useQueue.size() && !Y._loading) {
                    Y._use.apply(Y, Y._useQueue.next());
                }

            };

// Y.log(Y.id + ': use called: ' + a + ' :: ' + callback, 'info', 'yui');

        // YUI().use('*'); // bind everything available
        if (firstArg === '*') {
            args = [];
            for (i in mods) {
                if (mods.hasOwnProperty(i)) {
                    args.push(i);
                }
            }
            ret = Y._attach(args);
            if (ret) {
                handleLoader();
            }
            return Y;
        }

        if ((mods.loader || mods['loader-base']) && !Y.Loader) {
            Y.log('Loader was found in meta, but it is not attached. Attaching..', 'info', 'yui');
            Y._attach(['loader' + ((!mods.loader) ? '-base' : '')]);
        }

        // Y.log('before loader requirements: ' + args, 'info', 'yui');

        // use loader to expand dependencies and sort the
        // requirements if it is available.
        if (boot && Y.Loader && args.length) {
            Y.log('Using loader to expand dependencies', 'info', 'yui');
            loader = Y._getLoader(Y);
            loader.require(args);
            loader.ignoreRegistered = true;
            loader._boot = true;
            loader.calculate(null, (fetchCSS) ? null : 'js');
            args = loader.sorted;
            loader._boot = false;
        }

        process(args);

        len = missing.length;


        if (len) {
            missing = YArray.dedupe(missing);
            len = missing.length;
Y.log('Modules missing: ' + missing + ', ' + missing.length, 'info', 'yui');
        }


        // dynamic load
        if (boot && len && Y.Loader) {
// Y.log('Using loader to fetch missing deps: ' + missing, 'info', 'yui');
            Y.log('Using Loader', 'info', 'yui');
            Y._loading = true;
            loader = Y._getLoader(Y);
            loader.onEnd = handleLoader;
            loader.context = Y;
            loader.data = args;
            loader.ignoreRegistered = false;
            loader.require(missing);
            loader.insert(null, (fetchCSS) ? null : 'js');

        } else if (boot && len && Y.Get && !Env.bootstrapped) {

            Y._loading = true;

            handleBoot = function() {
                Y._loading = false;
                queue.running = false;
                Env.bootstrapped = true;
                G_ENV._bootstrapping = false;
                if (Y._attach(['loader'])) {
                    Y._use(args, callback);
                }
            };

            if (G_ENV._bootstrapping) {
Y.log('Waiting for loader', 'info', 'yui');
                queue.add(handleBoot);
            } else {
                G_ENV._bootstrapping = true;
Y.log('Fetching loader: ' + config.base + config.loaderPath, 'info', 'yui');
                Y.Get.script(config.base + config.loaderPath, {
                    onEnd: handleBoot
                });
            }

        } else {
            Y.log('Attaching available dependencies: ' + args, 'info', 'yui');
            ret = Y._attach(args);
            if (ret) {
                handleLoader();
            }
        }

        return Y;
    },
    _notify: function(callback, response, args) {
        if (!response.success && this.config.loadErrorFn) {
            this.config.loadErrorFn.call(this, this, callback, response, args);
        } else if (callback) {
            if (this.Env._missed && this.Env._missed.length) {
                response.msg = 'Missing modules: ' + this.Env._missed.join();
                response.success = false;
            }
            if (this.config.throwFail) {
                callback(this, response);
            } else {
                try {
                    callback(this, response);
                } catch (e) {
                    this.error('use callback error', e, args);
                }
            }
        }
    },
    _config: function(o) {
        this.applyConfig(o);
    },
    applyConfig: function(o) {

        o = o || {};

        var attr,
            name,
            // detail,
            config = this.config,
            mods = config.modules,
            groups = config.groups,
            aliases = config.aliases,
            loader = this.Env._loader;

        for (name in o) {
            if (o.hasOwnProperty(name)) {
                attr = o[name];
                if (mods && name == 'modules') {
                    clobber(mods, attr);
                } else if (aliases && name == 'aliases') {
                    clobber(aliases, attr);
                } else if (groups && name == 'groups') {
                    clobber(groups, attr);
                } else if (name == 'win') {
                    config[name] = (attr && attr.contentWindow) || attr;
                    config.doc = config[name] ? config[name].document : null;
                } else if (name == '_yuid') {
                    // preserve the guid
                } else {
                    config[name] = attr;
                }
            }
        }

        if (loader) {
            loader._config(o);
        }

    },
    _delayCallback: function(cb, until) {

        var Y = this,
            mod = ['event-base'];

        until = (Y.Lang.isObject(until) ? until : { event: until });

        if (until.event === 'load') {
            mod.push('event-synthetic');
        }

        Y.log('Delaying use callback until: ' + until.event, 'info', 'yui');
        return function() {
            Y.log('Use callback fired, waiting on delay', 'info', 'yui');
            var args = arguments;
            Y._use(mod, function() {
                Y.log('Delayed use wrapper callback after dependencies', 'info', 'yui');
                Y.on(until.event, function() {
                    args[1].delayUntil = until.event;
                    Y.log('Delayed use callback done after ' + until.event, 'info', 'yui');
                    cb.apply(Y, args);
                }, until.args);
            });
        };
    }
};

