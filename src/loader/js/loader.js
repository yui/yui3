/*jslint forin: true, maxlen: 350 */

/**
 * Loader dynamically loads script and css files.  It includes the dependency
 * information for the version of the library in use, and will automatically pull in
 * dependencies for the modules requested. It can also load the
 * files from the Yahoo! CDN, and it can utilize the combo service provided on
 * this network to reduce the number of http connections required to download
 * YUI files.
 *
 * @module loader
 * @main loader
 * @submodule loader-base
 */

var NOT_FOUND = {},
    NO_REQUIREMENTS = [],
    MAX_URL_LENGTH = 1024,
    GLOBAL_ENV = YUI.Env,
    GLOBAL_LOADED = GLOBAL_ENV._loaded,
    CSS = 'css',
    JS = 'js',
    INTL = 'intl',
    DEFAULT_SKIN = 'sam',
    VERSION = Y.version,
    ROOT_LANG = '',
    YObject = Y.Object,
    oeach = YObject.each,
    yArray = Y.Array,
    _queue = GLOBAL_ENV._loaderQueue,
    META = GLOBAL_ENV[VERSION],
    SKIN_PREFIX = 'skin-',
    L = Y.Lang,
    ON_PAGE = GLOBAL_ENV.mods,
    modulekey,
    _path = function(dir, file, type, nomin) {
        var path = dir + '/' + file;
        if (!nomin) {
            path += '-min';
        }
        path += '.' + (type || CSS);

        return path;
    };


    if (!YUI.Env._cssLoaded) {
        YUI.Env._cssLoaded = {};
    }


/**
 * The component metadata is stored in Y.Env.meta.
 * Part of the loader module.
 * @property meta
 * @for YUI
 */
Y.Env.meta = META;

/**
 * Loader dynamically loads script and css files.  It includes the dependency
 * info for the version of the library in use, and will automatically pull in
 * dependencies for the modules requested. It can load the
 * files from the Yahoo! CDN, and it can utilize the combo service provided on
 * this network to reduce the number of http connections required to download
 * YUI files. You can also specify an external, custom combo service to host
 * your modules as well.

        var Y = YUI();
        var loader = new Y.Loader({
            filter: 'debug',
            base: '../../',
            root: 'build/',
            combine: true,
            require: ['node', 'dd', 'console']
        });
        var out = loader.resolve(true);

 * If the Loader needs to be patched before it is used for the first time, it
 * should be done through the `doBeforeLoader` hook. Simply make the patch
 * available via configuration before YUI is loaded:

        YUI_config = YUI_config || {};
        YUI_config.doBeforeLoader = function (config) {
            var resolve = this.context.Loader.prototype.resolve;
            this.context.Loader.prototype.resolve = function () {
                // do something here
                return resolve.apply(this, arguments);
            };
        };

 * @constructor
 * @class Loader
 * @param {Object} config an optional set of configuration options.
 * @param {String} config.base The base dir which to fetch this module from
 * @param {String} config.comboBase The Combo service base path. Ex: `http://yui.yahooapis.com/combo?`
 * @param {String} config.root The root path to prepend to module names for the combo service. Ex: `2.5.2/build/`
 * @param {String|Object} config.filter A filter to apply to result urls. <a href="#property_filter">See filter property</a>
 * @param {Object} config.filters Per-component filter specification.  If specified for a given component, this overrides the filter config.
 * @param {Boolean} config.combine Use a combo service to reduce the number of http connections required to load your dependencies
 * @param {Boolean} [config.async=true] Fetch files in async
 * @param {Array} config.ignore: A list of modules that should never be dynamically loaded
 * @param {Array} config.force A list of modules that should always be loaded when required, even if already present on the page
 * @param {HTMLElement|String} config.insertBefore Node or id for a node that should be used as the insertion point for new nodes
 * @param {Object} config.jsAttributes Object literal containing attributes to add to script nodes
 * @param {Object} config.cssAttributes Object literal containing attributes to add to link nodes
 * @param {Number} config.timeout The number of milliseconds before a timeout occurs when dynamically loading nodes.  If not set, there is no timeout
 * @param {Object} config.context Execution context for all callbacks
 * @param {Function} config.onSuccess Callback for the 'success' event
 * @param {Function} config.onFailure Callback for the 'failure' event
 * @param {Function} config.onTimeout Callback for the 'timeout' event
 * @param {Function} config.onProgress Callback executed each time a script or css file is loaded
 * @param {Object} config.modules A list of module definitions.  See <a href="#method_addModule">Loader.addModule</a> for the supported module metadata
 * @param {Object} config.groups A list of group definitions.  Each group can contain specific definitions for `base`, `comboBase`, `combine`, and accepts a list of `modules`.
 * @param {String} config.2in3 The version of the YUI 2 in 3 wrapper to use.  The intrinsic support for YUI 2 modules in YUI 3 relies on versions of the YUI 2 components inside YUI 3 module wrappers.  These wrappers change over time to accomodate the issues that arise from running YUI 2 in a YUI 3 sandbox.
 * @param {String} config.yui2 When using the 2in3 project, you can select the version of YUI 2 to use.  Valid values are `2.2.2`, `2.3.1`, `2.4.1`, `2.5.2`, `2.6.0`, `2.7.0`, `2.8.0`, `2.8.1` and `2.9.0` [default] -- plus all versions of YUI 2 going forward.
 * @param {Function} config.doBeforeLoader An optional hook that allows for the patching of the loader instance. The `Y` instance is available as `this.context` and the only argument to the function is the Loader configuration object.
 */
Y.Loader = function(o) {

    var self = this;

    //Catch no config passed.
    o = o || {};

    modulekey = META.md5;

    /**
     * Internal callback to handle multiple internal insert() calls
     * so that css is inserted prior to js
     * @property _internalCallback
     * @private
     */
    // self._internalCallback = null;

    /**
     * Callback that will be executed when the loader is finished
     * with an insert
     * @method onSuccess
     * @type function
     */
    // self.onSuccess = null;

    /**
     * Callback that will be executed if there is a failure
     * @method onFailure
     * @type function
     */
    // self.onFailure = null;

    /**
     * Callback executed each time a script or css file is loaded
     * @method onProgress
     * @type function
     */
    // self.onProgress = null;

    /**
     * Callback that will be executed if a timeout occurs
     * @method onTimeout
     * @type function
     */
    // self.onTimeout = null;

    /**
     * The execution context for all callbacks
     * @property context
     * @default {YUI} the YUI instance
     */
    self.context = Y;

    // Hook that allows the patching of loader
    if (o.doBeforeLoader) {
        o.doBeforeLoader.apply(self, arguments);
    }

    /**
     * Data that is passed to all callbacks
     * @property data
     */
    // self.data = null;

    /**
     * Node reference or id where new nodes should be inserted before
     * @property insertBefore
     * @type string|HTMLElement
     */
    // self.insertBefore = null;

    /**
     * The charset attribute for inserted nodes
     * @property charset
     * @type string
     * @deprecated , use cssAttributes or jsAttributes.
     */
    // self.charset = null;

    /**
     * An object literal containing attributes to add to link nodes
     * @property cssAttributes
     * @type object
     */
    // self.cssAttributes = null;

    /**
     * An object literal containing attributes to add to script nodes
     * @property jsAttributes
     * @type object
     */
    // self.jsAttributes = null;

    /**
     * The base directory.
     * @property base
     * @type string
     * @default http://yui.yahooapis.com/[YUI VERSION]/build/
     */
    self.base = Y.Env.meta.base + Y.Env.meta.root;

    /**
     * Base path for the combo service
     * @property comboBase
     * @type string
     * @default http://yui.yahooapis.com/combo?
     */
    self.comboBase = Y.Env.meta.comboBase;

    /*
     * Base path for language packs.
     */
    // self.langBase = Y.Env.meta.langBase;
    // self.lang = "";

    /**
     * If configured, the loader will attempt to use the combo
     * service for YUI resources and configured external resources.
     * @property combine
     * @type boolean
     * @default true if a base dir isn't in the config
     */
    self.combine = o.base &&
        (o.base.indexOf(self.comboBase.substr(0, 20)) > -1);

    /**
    * The default seperator to use between files in a combo URL
    * @property comboSep
    * @type {String}
    * @default Ampersand
    */
    self.comboSep = '&';
    /**
     * Max url length for combo urls.  The default is 1024. This is the URL
     * limit for the Yahoo! hosted combo servers.  If consuming
     * a different combo service that has a different URL limit
     * it is possible to override this default by supplying
     * the maxURLLength config option.  The config option will
     * only take effect if lower than the default.
     *
     * @property maxURLLength
     * @type int
     */
    self.maxURLLength = MAX_URL_LENGTH;

    /**
     * Ignore modules registered on the YUI global
     * @property ignoreRegistered
     * @default false
     */
    self.ignoreRegistered = o.ignoreRegistered;

    /**
     * Root path to prepend to module path for the combo
     * service
     * @property root
     * @type string
     * @default [YUI VERSION]/build/
     */
    self.root = Y.Env.meta.root;

    /**
     * Timeout value in milliseconds.  If set, self value will be used by
     * the get utility.  the timeout event will fire if
     * a timeout occurs.
     * @property timeout
     * @type int
     */
    self.timeout = 0;

    /**
     * A list of modules that should not be loaded, even if
     * they turn up in the dependency tree
     * @property ignore
     * @type string[]
     */
    // self.ignore = null;

    /**
     * A list of modules that should always be loaded, even
     * if they have already been inserted into the page.
     * @property force
     * @type string[]
     */
    // self.force = null;

    self.forceMap = {};

    /**
     * Should we allow rollups
     * @property allowRollup
     * @type boolean
     * @default false
     */
    self.allowRollup = false;

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
     *  <dd>Selects the non-minified version of the library (e.g., event.js).
     *  </dd>
     * </dl>
     * You can also define a custom filter, which must be an object literal
     * containing a search expression and a replace string:
     *
     *      myFilter: {
     *          'searchExp': "-min\\.js",
     *          'replaceStr': "-debug.js"
     *      }
     *
     * @property filter
     * @type string| {searchExp: string, replaceStr: string}
     */
    // self.filter = null;

    /**
     * per-component filter specification.  If specified for a given
     * component, this overrides the filter config.
     * @property filters
     * @type object
     */
    self.filters = {};

    /**
     * The list of requested modules
     * @property required
     * @type {string: boolean}
     */
    self.required = {};

    /**
     * If a module name is predefined when requested, it is checked againsts
     * the patterns provided in this property.  If there is a match, the
     * module is added with the default configuration.
     *
     * At the moment only supporting module prefixes, but anticipate
     * supporting at least regular expressions.
     * @property patterns
     * @type Object
     */
    // self.patterns = Y.merge(Y.Env.meta.patterns);
    self.patterns = {};

    /**
     * Internal loader instance metadata. Use accessor `getModuleInfo()` instead.
     */
    self.moduleInfo = {};

    self.groups = Y.merge(Y.Env.meta.groups);

    /**
     * Provides the information used to skin the skinnable components.
     * The following skin definition would result in 'skin1' and 'skin2'
     * being loaded for calendar (if calendar was requested), and
     * 'sam' for all other skinnable components:
     *
     *      skin: {
     *          // The default skin, which is automatically applied if not
     *          // overriden by a component-specific skin definition.
     *          // Change this in to apply a different skin globally
     *          defaultSkin: 'sam',
     *
     *          // This is combined with the loader base property to get
     *          // the default root directory for a skin. ex:
     *          // http://yui.yahooapis.com/2.3.0/build/assets/skins/sam/
     *          base: 'assets/skins/',
     *
     *          // Any component-specific overrides can be specified here,
     *          // making it possible to load different skins for different
     *          // components.  It is possible to load more than one skin
     *          // for a given component as well.
     *          overrides: {
     *              calendar: ['skin1', 'skin2']
     *          }
     *      }
     * @property skin
     * @type {Object}
     */
    self.skin = Y.merge(Y.Env.meta.skin);

    /*
     * Map of conditional modules
     * @since 3.2.0
     */
    self.conditions = {};

    // map of modules with a hash of modules that meet the requirement
    // self.provides = {};

    self.config = o;
    self._internal = true;

    self._populateConditionsCache();

    /**
     * Set when beginning to compute the dependency tree.
     * Composed of what YUI reports to be loaded combined
     * with what has been loaded by any instance on the page
     * with the version number specified in the metadata.
     * @property loaded
     * @type {string: boolean}
     */
    self.loaded = GLOBAL_LOADED[VERSION];


    /**
    * Should Loader fetch scripts in `async`, defaults to `true`
    * @property async
    */

    self.async = true;

    self._inspectPage();

    self._internal = false;

    self._config(o);

    self.forceMap = (self.force) ? Y.Array.hash(self.force) : {};

    self.testresults = null;

    if (Y.config.tests) {
        self.testresults = Y.config.tests;
    }

    /**
     * List of rollup files found in the library metadata
     * @property rollups
     */
    // self.rollups = null;

    /**
     * Whether or not to load optional dependencies for
     * the requested modules
     * @property loadOptional
     * @type boolean
     * @default false
     */
    // self.loadOptional = false;

    /**
     * All of the derived dependencies in sorted order, which
     * will be populated when either calculate() or insert()
     * is called
     * @property sorted
     * @type string[]
     */
    self.sorted = [];

    /*
     * A list of modules to attach to the YUI instance when complete.
     * If not supplied, the sorted list of dependencies are applied.
     * @property attaching
     */
    // self.attaching = null;

    /**
     * Flag to indicate the dependency tree needs to be recomputed
     * if insert is called again.
     * @property dirty
     * @type boolean
     * @default true
     */
    self.dirty = true;

    /**
     * List of modules inserted by the utility
     * @property inserted
     * @type {string: boolean}
     */
    self.inserted = {};

    /**
     * List of skipped modules during insert() because the module
     * was not defined
     * @property skipped
     */
    self.skipped = {};

    // Y.on('yui:load', self.loadNext, self);

    self.tested = {};

    /*
     * Cached sorted calculate results
     * @property results
     * @since 3.2.0
     */
    //self.results = {};

    if (self.ignoreRegistered) {
        //Clear inpage already processed modules.
        self._resetModules();
    }

};

Y.Loader.prototype = {
    /**
    * Gets the module info from the local moduleInfo hash, or from the
    * default metadata and populate the local moduleInfo hash.
    * @method getModuleInfo
    * @param {string} name of the module
    * @public
    */
    getModuleInfo: function(name) {

        var m = this.moduleInfo[name],
            rawMetaModules, globalRenderedMods, internal, v;

        if (m) {
            return m;
        }

        rawMetaModules = META.modules;
        globalRenderedMods = GLOBAL_ENV._renderedMods;
        internal = this._internal;

        /*
        The logic here is:

        - if the `moduleInfo[name]` is avilable,
          then short circuit
        - otherwise, if the module is in the globalCache (cross Y instance),
          then port it from the global registry into `moduleInfo[name]`
        - otherwise, if the module has raw metadata (from meta modules)
          then add it to the global registry and to `moduleInfo[name]`

        */
        if (globalRenderedMods && globalRenderedMods.hasOwnProperty(name) && !this.ignoreRegistered) {
            this.moduleInfo[name] = Y.merge(globalRenderedMods[name]);
        } else {
            if (rawMetaModules.hasOwnProperty(name)) {
                this._internal = true; // making sure that modules from raw data are marked as internal
                v = this.addModule(rawMetaModules[name], name);
                // Inspect the page for the CSS module and mark it as loaded.
                if (v && v.type === CSS) {
                    if (this.isCSSLoaded(v.name, true)) {
                        Y.log('Found CSS module on page: ' + v.name, 'info', 'loader');
                        this.loaded[v.name] = true;
                    }
                }
                this._internal = internal;
            }
        }
        return this.moduleInfo[name];
    },
    /**
    * Expand the names that are aliases to other modules.
    * @method _expandAliases
    * @param {string[]} list a module name or a list of names to be expanded
    * @private
    * @return {array}
    */
    _expandAliases: function(list) {
        var expanded = [],
            aliases = YUI.Env.aliases,
            i, name;
        list = Y.Array(list);
        for (i = 0; i < list.length; i += 1) {
            name = list[i];
            expanded.push.apply(expanded, aliases[name] ? aliases[name] : [name]);
        }
        return expanded;
    },
    /**
    * Populate the conditions cache from raw modules, this is necessary
    * because no other module will require a conditional module, instead
    * the condition has to be executed and then the module is analyzed
    * to be included in the final requirement list. Without this cache
    * conditional modules will be simply ignored.
    * @method _populateConditionsCache
    * @private
    */
    _populateConditionsCache: function() {
        var rawMetaModules = META.modules,
            cache = GLOBAL_ENV._conditions,
            i, j, t, trigger;

        // if we have conditions in cache and cache is enabled
        // we should port them to this loader instance
        if (cache && !this.ignoreRegistered) {
            for (i in cache) {
                if (cache.hasOwnProperty(i)) {
                    this.conditions[i] = Y.merge(cache[i]);
                }
            }
        } else {
            for (i in rawMetaModules) {
                if (rawMetaModules.hasOwnProperty(i) && rawMetaModules[i].condition) {
                    t = this._expandAliases(rawMetaModules[i].condition.trigger);
                    for (j = 0; j < t.length; j += 1) {
                        trigger = t[j];
                        this.conditions[trigger] = this.conditions[trigger] || {};
                        this.conditions[trigger][rawMetaModules[i].name || i] = rawMetaModules[i].condition;
                    }
                }
            }
            GLOBAL_ENV._conditions = this.conditions;
        }
    },
    /**
    * Reset modules in the module cache to a pre-processed state so additional
    * computations with a different skin or language will work as expected.
    * @method _resetModules
    * @private
    */
    _resetModules: function() {
        var self = this, i, o,
            mod, name, details;
        for (i in self.moduleInfo) {
            if (self.moduleInfo.hasOwnProperty(i) && self.moduleInfo[i]) {
                mod = self.moduleInfo[i];
                name = mod.name;
                details  = (YUI.Env.mods[name] ? YUI.Env.mods[name].details : null);

                if (details) {
                    self.moduleInfo[name]._reset = true;
                    self.moduleInfo[name].requires = details.requires || [];
                    self.moduleInfo[name].optional = details.optional || [];
                    self.moduleInfo[name].supersedes = details.supercedes || [];
                }

                if (mod.defaults) {
                    for (o in mod.defaults) {
                        if (mod.defaults.hasOwnProperty(o)) {
                            if (mod[o]) {
                                mod[o] = mod.defaults[o];
                            }
                        }
                    }
                }
                mod.langCache = undefined;
                mod.skinCache = undefined;
                if (mod.skinnable) {
                    self._addSkin(self.skin.defaultSkin, mod.name);
                }
            }
        }
    },
    /**
    Regex that matches a CSS URL. Used to guess the file type when it's not
    specified.

    @property REGEX_CSS
    @type RegExp
    @final
    @protected
    @since 3.5.0
    **/
    REGEX_CSS: /\.css(?:[?;].*)?$/i,

    /**
    * Default filters for raw and debug
    * @property FILTER_DEFS
    * @type Object
    * @final
    * @protected
    */
    FILTER_DEFS: {
        RAW: {
            'searchExp': '-min\\.js',
            'replaceStr': '.js'
        },
        DEBUG: {
            'searchExp': '-min\\.js',
            'replaceStr': '-debug.js'
        },
        COVERAGE: {
            'searchExp': '-min\\.js',
            'replaceStr': '-coverage.js'
        }
    },
    /*
    * Check the pages meta-data and cache the result.
    * @method _inspectPage
    * @private
    */
    _inspectPage: function() {
        var self = this, v, m, req, mr, i;

        for (i in ON_PAGE) {
            if (ON_PAGE.hasOwnProperty(i)) {
                v = ON_PAGE[i];
                if (v.details) {
                    m = self.getModuleInfo(v.name);
                    req = v.details.requires;
                    mr = m && m.requires;

                   if (m) {
                       if (!m._inspected && req && mr.length !== req.length) {
                           // console.log('deleting ' + m.name);
                           delete m.expanded;
                       }
                   } else {
                       m = self.addModule(v.details, i);
                   }
                   m._inspected = true;
               }
            }
        }
    },
    /*
    * returns true if b is not loaded, and is required directly or by means of modules it supersedes.
    * @private
    * @method _requires
    * @param {String} mod1 The first module to compare
    * @param {String} mod2 The second module to compare
    */
   _requires: function(mod1, mod2) {

        var i, rm, after_map, s,
            m = this.getModuleInfo(mod1),
            other = this.getModuleInfo(mod2);

        if (!m || !other) {
            return false;
        }

        rm = m.expanded_map;
        after_map = m.after_map;

        // check if this module should be sorted after the other
        // do this first to short circut circular deps
        if (after_map && (mod2 in after_map)) {
            return true;
        }

        after_map = other.after_map;

        // and vis-versa
        if (after_map && (mod1 in after_map)) {
            return false;
        }

        // check if this module requires one the other supersedes
        s = other.supersedes;
        if (s) {
            for (i = 0; i < s.length; i++) {
                if (this._requires(mod1, s[i])) {
                    return true;
                }
            }
        }

        s = m.supersedes;
        if (s) {
            for (i = 0; i < s.length; i++) {
                if (this._requires(mod2, s[i])) {
                    return false;
                }
            }
        }

        // check if this module requires the other directly
        // if (r && yArray.indexOf(r, mod2) > -1) {
        if (rm && (mod2 in rm)) {
            return true;
        }

        // external css files should be sorted below yui css
        if (m.ext && m.type === CSS && !other.ext && other.type === CSS) {
            return true;
        }

        return false;
    },
    /**
    * Apply a new config to the Loader instance
    * @method _config
    * @private
    * @param {Object} o The new configuration
    */
    _config: function(o) {
        var i, j, val, a, f, group, groupName, self = this,
            mods = [], mod, modInfo;
        // apply config values
        if (o) {
            for (i in o) {
                if (o.hasOwnProperty(i)) {
                    val = o[i];
                    //TODO This should be a case
                    if (i === 'require') {
                        self.require(val);
                    } else if (i === 'skin') {
                        //If the config.skin is a string, format to the expected object
                        if (typeof val === 'string') {
                            self.skin.defaultSkin = o.skin;
                            val = {
                                defaultSkin: val
                            };
                        }

                        Y.mix(self.skin, val, true);
                    } else if (i === 'groups') {
                        for (j in val) {
                            if (val.hasOwnProperty(j)) {
                                // Y.log('group: ' + j);
                                groupName = j;
                                group = val[j];
                                self.addGroup(group, groupName);
                                if (group.aliases) {
                                    for (a in group.aliases) {
                                        if (group.aliases.hasOwnProperty(a)) {
                                            self.addAlias(group.aliases[a], a);
                                        }
                                    }
                                }
                            }
                        }

                    } else if (i === 'modules') {
                        // add a hash of module definitions
                        for (j in val) {
                            if (val.hasOwnProperty(j)) {
                                self.addModule(val[j], j);
                            }
                        }
                    } else if (i === 'aliases') {
                        for (j in val) {
                            if (val.hasOwnProperty(j)) {
                                self.addAlias(val[j], j);
                            }
                        }
                    } else if (i === 'gallery') {
                        if (this.groups.gallery.update) {
                            this.groups.gallery.update(val, o);
                        }
                    } else if (i === 'yui2' || i === '2in3') {
                        if (this.groups.yui2.update) {
                            this.groups.yui2.update(o['2in3'], o.yui2, o);
                        }
                    } else {
                        self[i] = val;
                    }
                }
            }
        }

        // fix filter
        f = self.filter;

        if (L.isString(f)) {
            f = f.toUpperCase();
            self.filterName = f;
            self.filter = self.FILTER_DEFS[f];
            if (f === 'DEBUG') {
                self.require('yui-log', 'dump');
            }
        }

        if (self.filterName && self.coverage) {
            if (self.filterName === 'COVERAGE' && L.isArray(self.coverage) && self.coverage.length) {
                for (i = 0; i < self.coverage.length; i++) {
                    mod = self.coverage[i];
                    modInfo = self.getModuleInfo(mod);
                    if (modInfo && modInfo.use) {
                        mods = mods.concat(modInfo.use);
                    } else {
                        mods.push(mod);
                    }
                }
                self.filters = self.filters || {};
                Y.Array.each(mods, function(mod) {
                    self.filters[mod] = self.FILTER_DEFS.COVERAGE;
                });
                self.filterName = 'RAW';
                self.filter = self.FILTER_DEFS[self.filterName];
            }
        }

    },

    /**
     * Returns the skin module name for the specified skin name.  If a
     * module name is supplied, the returned skin module name is
     * specific to the module passed in.
     * @method formatSkin
     * @param {string} skin the name of the skin.
     * @param {string} mod optional: the name of a module to skin.
     * @return {string} the full skin module name.
     */
    formatSkin: function(skin, mod) {
        var s = SKIN_PREFIX + skin;
        if (mod) {
            s = s + '-' + mod;
        }

        return s;
    },

    /**
     * Adds the skin def to the module info
     * @method _addSkin
     * @param {string} skin the name of the skin.
     * @param {string} mod the name of the module.
     * @param {string} parent parent module if this is a skin of a
     * submodule or plugin.
     * @return {string} the module name for the skin.
     * @private
     */
    _addSkin: function(skin, mod, parent) {
        var pkg, name, nmod,
            sinf = this.skin,
            mdef = mod && this.getModuleInfo(mod),
            ext = mdef && mdef.ext;

        // Add a module definition for the module-specific skin css
        if (mod) {
            name = this.formatSkin(skin, mod);
            if (!this.getModuleInfo(name)) {
                pkg = mdef.pkg || mod;
                nmod = {
                    skin: true,
                    name: name,
                    group: mdef.group,
                    type: 'css',
                    after: sinf.after,
                    path: (parent || pkg) + '/' + sinf.base + skin +
                          '/' + mod + '.css',
                    ext: ext
                };
                if (mdef.base) {
                    nmod.base = mdef.base;
                }
                if (mdef.configFn) {
                    nmod.configFn = mdef.configFn;
                }
                this.addModule(nmod, name);

                Y.log('Adding skin (' + name + '), ' + parent + ', ' + pkg + ', ' + nmod.path, 'info', 'loader');
            }
        }

        return name;
    },
    /**
    * Adds an alias module to the system
    * @method addAlias
    * @param {Array} use An array of modules that makes up this alias
    * @param {String} name The name of the alias
    * @example
    *       var loader = new Y.Loader({});
    *       loader.addAlias([ 'node', 'yql' ], 'davglass');
    *       loader.require(['davglass']);
    *       var out = loader.resolve(true);
    *
    *       //out.js will contain Node and YQL modules
    */
    addAlias: function(use, name) {
        YUI.Env.aliases[name] = use;
        this.addModule({
            name: name,
            use: use
        });
    },
    /**
     * Add a new module group
     * @method addGroup
     * @param {Object} config An object containing the group configuration data
     * @param {String} config.name required, the group name
     * @param {String} config.base The base directory for this module group
     * @param {String} config.root The root path to add to each combo resource path
     * @param {Boolean} config.combine Should the request be combined
     * @param {String} config.comboBase Combo service base path
     * @param {Object} config.modules The group of modules
     * @param {String} name the group name.
     * @example
     *      var loader = new Y.Loader({});
     *      loader.addGroup({
     *          name: 'davglass',
     *          combine: true,
     *          comboBase: '/combo?',
     *          root: '',
     *          modules: {
     *              //Module List here
     *          }
     *      }, 'davglass');
     */
    addGroup: function(o, name) {
        var mods = o.modules,
            self = this,
            defaultBase = o.defaultBase || Y.config.defaultBase,
            i, v;

        name = name || o.name;
        o.name = name;
        self.groups[name] = o;

        if (!o.base && defaultBase && o.root) {
            o.base = defaultBase + o.root;
        }

        if (o.patterns) {
            for (i in o.patterns) {
                if (o.patterns.hasOwnProperty(i)) {
                    o.patterns[i].group = name;
                    self.patterns[i] = o.patterns[i];
                }
            }
        }

        if (mods) {
            for (i in mods) {
                if (mods.hasOwnProperty(i)) {
                    v = mods[i];
                    if (typeof v === 'string') {
                        v = { name: i, fullpath: v };
                    }
                    v.group = name;
                    self.addModule(v, i);
                }
            }
        }
    },

    /**
     * Add a new module to the component metadata.
     * @method addModule
     * @param {Object} config An object containing the module data.
     * @param {String} config.name Required, the component name
     * @param {String} config.type Required, the component type (js or css)
     * @param {String} config.path Required, the path to the script from `base`
     * @param {Array} config.requires Array of modules required by this component
     * @param {Array} [config.optional] Array of optional modules for this component
     * @param {Array} [config.supersedes] Array of the modules this component replaces
     * @param {Array} [config.after] Array of modules the components which, if present, should be sorted above this one
     * @param {Object} [config.after_map] Faster alternative to 'after' -- supply a hash instead of an array
     * @param {Number} [config.rollup] The number of superseded modules required for automatic rollup
     * @param {String} [config.fullpath] If `fullpath` is specified, this is used instead of the configured `base + path`
     * @param {Boolean} [config.skinnable] Flag to determine if skin assets should automatically be pulled in
     * @param {Object} [config.submodules] Hash of submodules
     * @param {String} [config.group] The group the module belongs to -- this is set automatically when it is added as part of a group configuration.
     * @param {Array} [config.lang] Array of BCP 47 language tags of languages for which this module has localized resource bundles, e.g., `["en-GB", "zh-Hans-CN"]`
     * @param {Object} [config.condition] Specifies that the module should be loaded automatically if a condition is met. This is an object with up to four fields:
     * @param {String} [config.condition.trigger] The name of a module that can trigger the auto-load
     * @param {Function} [config.condition.test] A function that returns true when the module is to be loaded.
     * @param {String} [config.condition.ua] The UA name of <a href="UA.html">Y.UA</a> object that returns true when the module is to be loaded. e.g., `"ie"`, `"nodejs"`.
     * @param {String} [config.condition.when] Specifies the load order of the conditional module
     *  with regard to the position of the trigger module.
     *  This should be one of three values: `before`, `after`, or `instead`.  The default is `after`.
     * @param {Object} [config.testresults] A hash of test results from `Y.Features.all()`
     * @param {Function} [config.configFn] A function to exectute when configuring this module
     * @param {Object} config.configFn.mod The module config, modifying this object will modify it's config. Returning false will delete the module's config.
     * @param {String[]} [config.optionalRequires] List of dependencies that
        may optionally be loaded by this loader. This is targeted mostly at
        polyfills, since they should not be in the list of requires because
        polyfills are assumed to be available in the global scope.
     * @param {Function} [config.test] Test to be called when this module is
        added as an optional dependency of another module. If the test function
        returns `false`, the module will be ignored and will not be attached to
        this YUI instance.
     * @param {String} [name] The module name, required if not in the module data.
     * @return {Object} the module definition or null if the object passed in did not provide all required attributes.
     */
    addModule: function(o, name) {
        name = name || o.name;

        if (typeof o === 'string') {
            o = { name: name, fullpath: o };
        }


        var subs, i, l, t, sup, s, smod, plugins, plug,
            j, langs, packName, supName, flatSup, flatLang, lang, ret,
            overrides, skinname, when, g, p,
            modInfo = this.moduleInfo[name],
            conditions = this.conditions, trigger;

        //Only merge this data if the temp flag is set
        //from an earlier pass from a pattern or else
        //an override module (YUI_config) can not be used to
        //replace a default module.
        if (modInfo && modInfo.temp) {
            //This catches temp modules loaded via a pattern
            // The module will be added twice, once from the pattern and
            // Once from the actual add call, this ensures that properties
            // that were added to the module the first time around (group: gallery)
            // are also added the second time around too.
            o = Y.merge(modInfo, o);
        }

        o.name = name;

        if (!o || !o.name) {
            return null;
        }

        if (!o.type) {
            //Always assume it's javascript unless the CSS pattern is matched.
            o.type = JS;
            p = o.path || o.fullpath;
            if (p && this.REGEX_CSS.test(p)) {
                Y.log('Auto determined module type as CSS', 'warn', 'loader');
                o.type = CSS;
            }
        }

        if (!o.path && !o.fullpath) {
            o.path = _path(name, name, o.type);
        }
        o.supersedes = o.supersedes || o.use;

        o.ext = ('ext' in o) ? o.ext : (this._internal) ? false : true;

        // Handle submodule logic
        subs = o.submodules;

        this.moduleInfo[name] = o;

        o.requires = o.requires || [];

        /*
        Only allowing the cascade of requires information, since
        optional and supersedes are far more fine grained than
        a blanket requires is.
        */
        if (this.requires) {
            for (i = 0; i < this.requires.length; i++) {
                o.requires.push(this.requires[i]);
            }
        }
        if (o.group && this.groups && this.groups[o.group]) {
            g = this.groups[o.group];
            if (g.requires) {
                for (i = 0; i < g.requires.length; i++) {
                    o.requires.push(g.requires[i]);
                }
            }
        }


        if (!o.defaults) {
            o.defaults = {
                requires: o.requires ? [].concat(o.requires) : null,
                supersedes: o.supersedes ? [].concat(o.supersedes) : null,
                optional: o.optional ? [].concat(o.optional) : null
            };
        }

        if (o.skinnable && o.ext && o.temp) {
            skinname = this._addSkin(this.skin.defaultSkin, name);
            o.requires.unshift(skinname);
        }

        if (o.requires.length) {
            o.requires = this.filterRequires(o.requires) || [];
        }

        if (!o.langPack && o.lang) {
            langs = yArray(o.lang);
            for (j = 0; j < langs.length; j++) {
                lang = langs[j];
                packName = this.getLangPackName(lang, name);
                smod = this.getModuleInfo(packName);
                if (!smod) {
                    smod = this._addLangPack(lang, o, packName);
                }
            }
        }


        if (subs) {
            sup = o.supersedes || [];
            l = 0;

            for (i in subs) {
                if (subs.hasOwnProperty(i)) {
                    s = subs[i];

                    s.path = s.path || _path(name, i, o.type);
                    s.pkg = name;
                    s.group = o.group;

                    if (s.supersedes) {
                        sup = sup.concat(s.supersedes);
                    }

                    smod = this.addModule(s, i);
                    sup.push(i);

                    if (smod.skinnable) {
                        o.skinnable = true;
                        overrides = this.skin.overrides;
                        if (overrides && overrides[i]) {
                            for (j = 0; j < overrides[i].length; j++) {
                                skinname = this._addSkin(overrides[i][j],
                                         i, name);
                                sup.push(skinname);
                            }
                        }
                        skinname = this._addSkin(this.skin.defaultSkin,
                                        i, name);
                        sup.push(skinname);
                    }

                    // looks like we are expected to work out the metadata
                    // for the parent module language packs from what is
                    // specified in the child modules.
                    if (s.lang && s.lang.length) {

                        langs = yArray(s.lang);
                        for (j = 0; j < langs.length; j++) {
                            lang = langs[j];
                            packName = this.getLangPackName(lang, name);
                            supName = this.getLangPackName(lang, i);
                            smod = this.getModuleInfo(packName);

                            if (!smod) {
                                smod = this._addLangPack(lang, o, packName);
                            }

                            flatSup = flatSup || yArray.hash(smod.supersedes);

                            if (!(supName in flatSup)) {
                                smod.supersedes.push(supName);
                            }

                            o.lang = o.lang || [];

                            flatLang = flatLang || yArray.hash(o.lang);

                            if (!(lang in flatLang)) {
                                o.lang.push(lang);
                            }

// Y.log('pack ' + packName + ' should supersede ' + supName);
// Add rollup file, need to add to supersedes list too

                            // default packages
                            packName = this.getLangPackName(ROOT_LANG, name);
                            supName = this.getLangPackName(ROOT_LANG, i);

                            smod = this.getModuleInfo(packName);

                            if (!smod) {
                                smod = this._addLangPack(lang, o, packName);
                            }

                            if (!(supName in flatSup)) {
                                smod.supersedes.push(supName);
                            }

// Y.log('pack ' + packName + ' should supersede ' + supName);
// Add rollup file, need to add to supersedes list too

                        }
                    }

                    l++;
                }
            }
            //o.supersedes = YObject.keys(yArray.hash(sup));
            o.supersedes = yArray.dedupe(sup);
            if (this.allowRollup) {
                o.rollup = (l < 4) ? l : Math.min(l - 1, 4);
            }
        }

        plugins = o.plugins;
        if (plugins) {
            for (i in plugins) {
                if (plugins.hasOwnProperty(i)) {
                    plug = plugins[i];
                    plug.pkg = name;
                    plug.path = plug.path || _path(name, i, o.type);
                    plug.requires = plug.requires || [];
                    plug.group = o.group;
                    this.addModule(plug, i);
                    if (o.skinnable) {
                        this._addSkin(this.skin.defaultSkin, i, name);
                    }

                }
            }
        }

        if (o.condition) {
            t = this._expandAliases(o.condition.trigger);
            for (i = 0; i < t.length; i++) {
                trigger = t[i];
                when = o.condition.when;
                conditions[trigger] = conditions[trigger] || {};
                conditions[trigger][name] = o.condition;
                // the 'when' attribute can be 'before', 'after', or 'instead'
                // the default is after.
                if (when && when !== 'after') {
                    if (when === 'instead') { // replace the trigger
                        o.supersedes = o.supersedes || [];
                        o.supersedes.push(trigger);
                    }
                    // before the trigger
                        // the trigger requires the conditional mod,
                        // so it should appear before the conditional
                        // mod if we do not intersede.
                } else { // after the trigger
                    o.after = o.after || [];
                    o.after.push(trigger);
                }
            }
        }

        if (o.supersedes) {
            o.supersedes = this.filterRequires(o.supersedes);
        }

        if (o.after) {
            o.after = this.filterRequires(o.after);
            o.after_map = yArray.hash(o.after);
        }

        // this.dirty = true;

        if (o.configFn) {
            ret = o.configFn(o);
            if (ret === false) {
                Y.log('Config function returned false for ' + name + ', skipping.', 'info', 'loader');
                delete this.moduleInfo[name];
                delete GLOBAL_ENV._renderedMods[name];
                o = null;
            }
        }
        //Add to global cache
        if (o) {
            if (!GLOBAL_ENV._renderedMods) {
                GLOBAL_ENV._renderedMods = {};
            }
            GLOBAL_ENV._renderedMods[name] = Y.mix(GLOBAL_ENV._renderedMods[name] || {}, o);
            GLOBAL_ENV._conditions = conditions;
        }

        return o;
    },

    /**
     * Add a requirement for one or more module
     * @method require
     * @param {string[] | string*} what the modules to load.
     */
    require: function(what) {
        var a = (typeof what === 'string') ? yArray(arguments) : what;
        this.dirty = true;
        this.required = Y.merge(this.required, yArray.hash(this.filterRequires(a)));

        this._explodeRollups();
    },
    /**
    * Grab all the items that were asked for, check to see if the Loader
    * meta-data contains a "use" array. If it doesm remove the asked item and replace it with
    * the content of the "use".
    * This will make asking for: "dd"
    * Actually ask for: "dd-ddm-base,dd-ddm,dd-ddm-drop,dd-drag,dd-proxy,dd-constrain,dd-drop,dd-scroll,dd-drop-plugin"
    * @private
    * @method _explodeRollups
    */
    _explodeRollups: function() {
        var self = this, m, m2, i, a, v, len, len2,
        r = self.required;

        if (!self.allowRollup) {
            for (i in r) {
                if (r.hasOwnProperty(i)) {
                    m = self.getModule(i);
                    if (m && m.use) {
                        len = m.use.length;
                        for (a = 0; a < len; a++) {
                            m2 = self.getModule(m.use[a]);
                            if (m2 && m2.use) {
                                len2 = m2.use.length;
                                for (v = 0; v < len2; v++) {
                                    r[m2.use[v]] = true;
                                }
                            } else {
                                r[m.use[a]] = true;
                            }
                        }
                    }
                }
            }
            self.required = r;
        }

    },
    /**
    * Explodes the required array to remove aliases and replace them with real modules
    * @method filterRequires
    * @param {Array} r The original requires array
    * @return {Array} The new array of exploded requirements
    */
    filterRequires: function(r) {
        if (r) {
            if (!Y.Lang.isArray(r)) {
                r = [r];
            }
            r = Y.Array(r);
            var c = [], i, mod, o, m;

            for (i = 0; i < r.length; i++) {
                mod = this.getModule(r[i]);
                if (mod && mod.use) {
                    for (o = 0; o < mod.use.length; o++) {
                        //Must walk the other modules in case a module is a rollup of rollups (datatype)
                        m = this.getModule(mod.use[o]);
                        if (m && m.use && (m.name !== mod.name)) {
                            c = Y.Array.dedupe([].concat(c, this.filterRequires(m.use)));
                        } else {
                            c.push(mod.use[o]);
                        }
                    }
                } else {
                    c.push(r[i]);
                }
            }
            r = c;
        }
        return r;
    },

    /**
    Returns `true` if the module can be attached to the YUI instance. Runs
    the module's test if there is one and caches its result.

    @method _canBeAttached
    @param {String} module Name of the module to check.
    @return {Boolean} Result of the module's test if it has one, or `true`.
    **/
    _canBeAttached: function (m) {
        m = this.getModule(m);
        if (m && m.test) {
            if (!m.hasOwnProperty('_testResult')) {
                m._testResult = m.test(Y);
            }
            return m._testResult;
        }
        // return `true` for modules not registered as Loader will know what
        // to do with them later on
        return true;
    },

    /**
     * Returns an object containing properties for all modules required
     * in order to load the requested module
     * @method getRequires
     * @param {object}  mod The module definition from moduleInfo.
     * @return {array} the expanded requirement list.
     */
    getRequires: function(mod) {

        if (!mod) {
            //console.log('returning no reqs for ' + mod.name);
            return NO_REQUIREMENTS;
        }

        if (mod._parsed) {
            //console.log('returning requires for ' + mod.name, mod.requires);
            return mod.expanded || NO_REQUIREMENTS;
        }

        //TODO add modue cache here out of scope..

        var i, m, j, length, add, packName, lang, testresults = this.testresults,
            name = mod.name, cond,
            adddef = ON_PAGE[name] && ON_PAGE[name].details,
            optReqs = mod.optionalRequires,
            d, go, def,
            r, old_mod,
            o, skinmod, skindef, skinpar, skinname,
            intl = mod.lang || mod.intl,
            ftests = Y.Features && Y.Features.tests.load,
            hash, reparse;

        // console.log(name);

        // pattern match leaves module stub that needs to be filled out
        if (mod.temp && adddef) {
            old_mod = mod;
            mod = this.addModule(adddef, name);
            mod.group = old_mod.group;
            mod.pkg = old_mod.pkg;
            delete mod.expanded;
        }

        // console.log('cache: ' + mod.langCache + ' == ' + this.lang);

        //If a skin or a lang is different, reparse..
        reparse = !((!this.lang || mod.langCache === this.lang) && (mod.skinCache === this.skin.defaultSkin));

        if (mod.expanded && !reparse) {
            //Y.log('Already expanded ' + name + ', ' + mod.expanded);
            return mod.expanded;
        }

        // Optional dependencies are dependencies that may or may not be
        // available.
        // This feature was designed specifically to be used when transpiling
        // ES6 modules, in order to use polyfills and regular scripts that define
        // global variables without having to import them since they should be
        // available in the global scope.
        if (optReqs) {
            for (i = 0, length = optReqs.length; i < length; i++) {
                if (this._canBeAttached(optReqs[i])) {
                    mod.requires.push(optReqs[i]);
                }
            }
        }

        d = [];
        hash = {};
        r = this.filterRequires(mod.requires);
        if (mod.lang) {
            //If a module has a lang attribute, auto add the intl requirement.
            d.unshift('intl');
            r.unshift('intl');
            intl = true;
        }
        o = this.filterRequires(mod.optional);

        // Y.log("getRequires: " + name + " (dirty:" + this.dirty +
        // ", expanded:" + mod.expanded + ")");

        mod._parsed = true;
        mod.langCache = this.lang;
        mod.skinCache = this.skin.defaultSkin;

        for (i = 0; i < r.length; i++) {
            //Y.log(name + ' requiring ' + r[i], 'info', 'loader');
            if (!hash[r[i]]) {
                d.push(r[i]);
                hash[r[i]] = true;
                m = this.getModule(r[i]);
                if (m) {
                    add = this.getRequires(m);
                    intl = intl || (m.expanded_map &&
                        (INTL in m.expanded_map));
                    for (j = 0; j < add.length; j++) {
                        d.push(add[j]);
                    }
                }
            }
        }

        // get the requirements from superseded modules, if any
        r = this.filterRequires(mod.supersedes);
        if (r) {
            for (i = 0; i < r.length; i++) {
                if (!hash[r[i]]) {
                    // if this module has submodules, the requirements list is
                    // expanded to include the submodules.  This is so we can
                    // prevent dups when a submodule is already loaded and the
                    // parent is requested.
                    if (mod.submodules) {
                        d.push(r[i]);
                    }

                    hash[r[i]] = true;
                    m = this.getModule(r[i]);

                    if (m) {
                        add = this.getRequires(m);
                        intl = intl || (m.expanded_map &&
                            (INTL in m.expanded_map));
                        for (j = 0; j < add.length; j++) {
                            d.push(add[j]);
                        }
                    }
                }
            }
        }

        if (o && this.loadOptional) {
            for (i = 0; i < o.length; i++) {
                if (!hash[o[i]]) {
                    d.push(o[i]);
                    hash[o[i]] = true;
                    m = this.getModuleInfo(o[i]);
                    if (m) {
                        add = this.getRequires(m);
                        intl = intl || (m.expanded_map &&
                            (INTL in m.expanded_map));
                        for (j = 0; j < add.length; j++) {
                            d.push(add[j]);
                        }
                    }
                }
            }
        }

        cond = this.conditions[name];

        if (cond) {
            //Set the module to not parsed since we have conditionals and this could change the dependency tree.
            mod._parsed = false;
            if (testresults && ftests) {
                oeach(testresults, function(result, id) {
                    var condmod = ftests[id].name;
                    if (!hash[condmod] && ftests[id].trigger === name) {
                        if (result && ftests[id]) {
                            hash[condmod] = true;
                            d.push(condmod);
                        }
                    }
                });
            } else {
                for (i in cond) {
                    if (cond.hasOwnProperty(i)) {
                        if (!hash[i]) {
                            def = cond[i];
                            //first see if they've specfied a ua check
                            //then see if they've got a test fn & if it returns true
                            //otherwise just having a condition block is enough
                            go = def && ((!def.ua && !def.test) || (def.ua && Y.UA[def.ua]) ||
                                        (def.test && def.test(Y, r)));

                            if (go) {
                                hash[i] = true;
                                d.push(i);
                                m = this.getModule(i);
                                if (m) {
                                    add = this.getRequires(m);
                                    for (j = 0; j < add.length; j++) {
                                        d.push(add[j]);
                                    }

                                }
                            }
                        }
                    }
                }
            }
        }

        // Create skin modules
        if (mod.skinnable) {
            skindef = this.skin.overrides;
            for (i in YUI.Env.aliases) {
                if (YUI.Env.aliases.hasOwnProperty(i)) {
                    if (Y.Array.indexOf(YUI.Env.aliases[i], name) > -1) {
                        skinpar = i;
                    }
                }
            }
            if (skindef && (skindef[name] || (skinpar && skindef[skinpar]))) {
                skinname = name;
                if (skindef[skinpar]) {
                    skinname = skinpar;
                }
                for (i = 0; i < skindef[skinname].length; i++) {
                    skinmod = this._addSkin(skindef[skinname][i], name);
                    if (!this.isCSSLoaded(skinmod, this._boot)) {
                        d.push(skinmod);
                    }
                }
            } else {
                skinmod = this._addSkin(this.skin.defaultSkin, name);
                if (!this.isCSSLoaded(skinmod, this._boot)) {
                    d.push(skinmod);
                }
            }
        }

        mod._parsed = false;

        if (intl) {

            if (mod.lang && !mod.langPack && Y.Intl) {
                lang = Y.Intl.lookupBestLang(this.lang || ROOT_LANG, mod.lang);
                //Y.log('Best lang: ' + lang + ', this.lang: ' + this.lang + ', mod.lang: ' + mod.lang);
                packName = this.getLangPackName(lang, name);
                if (packName) {
                    d.unshift(packName);
                }
            }
            d.unshift(INTL);
        }

        mod.expanded_map = yArray.hash(d);

        mod.expanded = YObject.keys(mod.expanded_map);

        return mod.expanded;
    },
    /**
    * Check to see if named css module is already loaded on the page
    * @method isCSSLoaded
    * @param {String} name The name of the css file
    * @param {Boolean} skip To skip the short-circuit for ignoreRegister
    * @return Boolean
    */
    isCSSLoaded: function(name, skip) {
        //TODO - Make this call a batching call with name being an array
        if (!name || !YUI.Env.cssStampEl || (!skip && this.ignoreRegistered)) {
            Y.log('isCSSLoaded was skipped for ' + name, 'warn', 'loader');
            return false;
        }
        var el = YUI.Env.cssStampEl,
            ret = false,
            mod = YUI.Env._cssLoaded[name],
            style = el.currentStyle; //IE


        if (mod !== undefined) {
            //Y.log('isCSSLoaded was cached for ' + name, 'warn', 'loader');
            return mod;
        }

        //Add the classname to the element
        el.className = name;

        if (!style) {
            style = Y.config.doc.defaultView.getComputedStyle(el, null);
        }

        if (style && style.display === 'none') {
            ret = true;
        }

        Y.log('Has Skin? ' + name + ' : ' + ret, 'info', 'loader');

        el.className = ''; //Reset the classname to ''

        YUI.Env._cssLoaded[name] = ret;

        return ret;
    },

    /**
     * Returns a hash of module names the supplied module satisfies.
     * @method getProvides
     * @param {string} name The name of the module.
     * @return {object} what this module provides.
     */
    getProvides: function(name) {
        var m = this.getModule(name), o, s;
            // supmap = this.provides;

        if (!m) {
            return NOT_FOUND;
        }

        if (m && !m.provides) {
            o = {};
            s = m.supersedes;

            if (s) {
                yArray.each(s, function(v) {
                    Y.mix(o, this.getProvides(v));
                }, this);
            }

            o[name] = true;
            m.provides = o;

        }

        return m.provides;
    },

    /**
     * Calculates the dependency tree, the result is stored in the sorted
     * property.
     * @method calculate
     * @param {object} o optional options object.
     * @param {string} type optional argument to prune modules.
     */
    calculate: function(o, type) {
        if (o || type || this.dirty) {

            if (o) {
                this._config(o);
            }

            if (!this._init) {
                this._setup();
            }

            this._explode();

            if (this.allowRollup) {
                this._rollup();
            } else {
                this._explodeRollups();
            }
            this._reduce();
            this._sort();
        }
    },
    /**
    * Creates a "psuedo" package for languages provided in the lang array
    * @method _addLangPack
    * @private
    * @param {String} lang The language to create
    * @param {Object} m The module definition to create the language pack around
    * @param {String} packName The name of the package (e.g: lang/datatype-date-en-US)
    * @return {Object} The module definition
    */
    _addLangPack: function(lang, m, packName) {
        var name = m.name,
            packPath, conf,
            existing = this.getModuleInfo(packName);

        if (!existing) {

            packPath = _path((m.pkg || name), packName, JS, true);

            conf = {
                path: packPath,
                intl: true,
                langPack: true,
                ext: m.ext,
                group: m.group,
                supersedes: []
            };
            if (m.root) {
                conf.root = m.root;
            }
            if (m.base) {
                conf.base = m.base;
            }

            if (m.configFn) {
                conf.configFn = m.configFn;
            }

            this.addModule(conf, packName);

            if (lang) {
                Y.Env.lang = Y.Env.lang || {};
                Y.Env.lang[lang] = Y.Env.lang[lang] || {};
                Y.Env.lang[lang][name] = true;
            }
        }

        return this.getModuleInfo(packName);
    },

    /**
     * Investigates the current YUI configuration on the page.  By default,
     * modules already detected will not be loaded again unless a force
     * option is encountered.  Called by calculate()
     * @method _setup
     * @private
     */
    _setup: function() {
        var info = this.moduleInfo, name, i, j, m, l,
            packName;

        for (name in info) {
            if (info.hasOwnProperty(name)) {
                m = info[name];
                if (m) {

                    // remove dups
                    //m.requires = YObject.keys(yArray.hash(m.requires));
                    m.requires = yArray.dedupe(m.requires);

                    // Create lang pack modules
                    //if (m.lang && m.lang.length) {
                    if (m.lang) {
                        // Setup root package if the module has lang defined,
                        // it needs to provide a root language pack
                        packName = this.getLangPackName(ROOT_LANG, name);
                        this._addLangPack(null, m, packName);
                    }

                }
            }
        }


        //l = Y.merge(this.inserted);
        l = {};

        // available modules
        if (!this.ignoreRegistered) {
            Y.mix(l, GLOBAL_ENV.mods);
        }

        // add the ignore list to the list of loaded packages
        if (this.ignore) {
            Y.mix(l, yArray.hash(this.ignore));
        }

        // expand the list to include superseded modules
        for (j in l) {
            if (l.hasOwnProperty(j)) {
                Y.mix(l, this.getProvides(j));
            }
        }

        // remove modules on the force list from the loaded list
        if (this.force) {
            for (i = 0; i < this.force.length; i++) {
                if (this.force[i] in l) {
                    delete l[this.force[i]];
                }
            }
        }

        Y.mix(this.loaded, l);

        this._init = true;
    },

    /**
     * Builds a module name for a language pack
     * @method getLangPackName
     * @param {string} lang the language code.
     * @param {string} mname the module to build it for.
     * @return {string} the language pack module name.
     */
    getLangPackName: function(lang, mname) {
        return ('lang/' + mname + ((lang) ? '_' + lang : ''));
    },
    /**
     * Inspects the required modules list looking for additional
     * dependencies.  Expands the required list to include all
     * required modules.  Called by calculate()
     * @method _explode
     * @private
     */
    _explode: function() {
        //TODO Move done out of scope
        var r = this.required, m, reqs, done = {},
            self = this, name, expound;

        // the setup phase is over, all modules have been created
        self.dirty = false;

        self._explodeRollups();
        r = self.required;

        for (name in r) {
            if (r.hasOwnProperty(name)) {
                if (!done[name]) {
                    done[name] = true;
                    m = self.getModule(name);
                    if (m) {
                        expound = m.expound;

                        if (expound) {
                            r[expound] = self.getModule(expound);
                            reqs = self.getRequires(r[expound]);
                            Y.mix(r, yArray.hash(reqs));
                        }

                        reqs = self.getRequires(m);
                        Y.mix(r, yArray.hash(reqs));
                    }
                }
            }
        }

        // Y.log('After explode: ' + YObject.keys(r));
    },
    /**
    * The default method used to test a module against a pattern
    * @method _patternTest
    * @private
    * @param {String} mname The module being tested
    * @param {String} pname The pattern to match
    */
    _patternTest: function(mname, pname) {
        return (Y.Array.indexOf(mname, pname) > -1);
    },
    /**
    * Get's the loader meta data for the requested module
    * @method getModule
    * @param {String} mname The module name to get
    * @return {Object} The module metadata
    */
    getModule: function(mname) {
        //TODO: Remove name check - it's a quick hack to fix pattern WIP
        if (!mname) {
            return null;
        }

        var p, found, pname,
            m = this.getModuleInfo(mname),
            patterns = this.patterns;

        // check the patterns library to see if we should automatically add
        // the module with defaults
        if (!m || (m && m.ext)) {
           // Y.log('testing patterns ' + YObject.keys(patterns));
            for (pname in patterns) {
                if (patterns.hasOwnProperty(pname)) {
                    // Y.log('testing pattern ' + i);
                    p = patterns[pname];

                    //There is no test method, create a default one that tests
                    // the pattern against the mod name
                    if (!p.test) {
                        p.test = this._patternTest;
                    }

                    if (p.test(mname, pname)) {
                        // use the metadata supplied for the pattern
                        // as the module definition.
                        found = p;
                        break;
                    }
                }
            }
        }

        if (!m) {
            if (found) {
                if (p.action) {
                    // Y.log('executing pattern action: ' + pname);
                    p.action.call(this, mname, pname);
                } else {
Y.log('Undefined module: ' + mname + ', matched a pattern: ' +
    pname, 'info', 'loader');
                    // ext true or false?
                    m = this.addModule(Y.merge(found, {
                        test: void 0,
                        temp: true
                    }), mname);
                    if (m && found.configFn) {
                        m.configFn = found.configFn;
                    }
                }
            }
        } else {
            if (found && m && found.configFn && !m.configFn) {
                m.configFn = found.configFn;
                m.configFn(m);
            }
        }

        return m;
    },

    // impl in rollup submodule
    _rollup: function() { },

    /**
     * Remove superceded modules and loaded modules.  Called by
     * calculate() after we have the mega list of all dependencies
     * @method _reduce
     * @return {object} the reduced dependency hash.
     * @private
     */
    _reduce: function(r) {

        r = r || this.required;

        var i, j, s, m, type = this.loadType,
        ignore = this.ignore ? yArray.hash(this.ignore) : false;

        for (i in r) {
            if (r.hasOwnProperty(i)) {
                m = this.getModule(i);
                // remove if already loaded
                if (((this.loaded[i] || ON_PAGE[i]) &&
                        !this.forceMap[i] && !this.ignoreRegistered) ||
                        (type && m && m.type !== type)) {
                    delete r[i];
                }
                if (ignore && ignore[i]) {
                    delete r[i];
                }
                // remove anything this module supersedes
                s = m && m.supersedes;
                if (s) {
                    for (j = 0; j < s.length; j++) {
                        if (s[j] in r) {
                            delete r[s[j]];
                        }
                    }
                }
            }
        }

        return r;
    },
    /**
    * Handles the queue when a module has been loaded for all cases
    * @method _finish
    * @private
    * @param {String} msg The message from Loader
    * @param {Boolean} success A boolean denoting success or failure
    */
    _finish: function(msg, success) {
        Y.log('loader finishing: ' + msg + ', ' + Y.id + ', ' +
            this.data, 'info', 'loader');

        _queue.running = false;

        var onEnd = this.onEnd;
        if (onEnd) {
            onEnd.call(this.context, {
                msg: msg,
                data: this.data,
                success: success
            });
        }
        this._continue();
    },
    /**
    * The default Loader onSuccess handler, calls this.onSuccess with a payload
    * @method _onSuccess
    * @private
    */
    _onSuccess: function() {
        var self = this, skipped = Y.merge(self.skipped), fn,
            failed = [], rreg = self.requireRegistration,
            success, msg, i, mod;

        for (i in skipped) {
            if (skipped.hasOwnProperty(i)) {
                delete self.inserted[i];
            }
        }

        self.skipped = {};

        for (i in self.inserted) {
            if (self.inserted.hasOwnProperty(i)) {
                mod = self.getModule(i);
                if (mod && rreg && mod.type === JS && !(i in YUI.Env.mods)) {
                    failed.push(i);
                } else {
                    Y.mix(self.loaded, self.getProvides(i));
                }
            }
        }

        fn = self.onSuccess;
        msg = (failed.length) ? 'notregistered' : 'success';
        success = !(failed.length);
        if (fn) {
            fn.call(self.context, {
                msg: msg,
                data: self.data,
                success: success,
                failed: failed,
                skipped: skipped
            });
        }
        self._finish(msg, success);
    },
    /**
    * The default Loader onProgress handler, calls this.onProgress with a payload
    * @method _onProgress
    * @private
    */
    _onProgress: function(e) {
        var self = this, i;
        //set the internal cache to what just came in.
        if (e.data && e.data.length) {
            for (i = 0; i < e.data.length; i++) {
                e.data[i] = self.getModule(e.data[i].name);
            }
        }
        if (self.onProgress) {
            self.onProgress.call(self.context, {
                name: e.url,
                data: e.data
            });
        }
    },
    /**
    * The default Loader onFailure handler, calls this.onFailure with a payload
    * @method _onFailure
    * @private
    */
    _onFailure: function(o) {
        var f = this.onFailure, msg = [], i = 0, len = o.errors.length;

        for (i; i < len; i++) {
            msg.push(o.errors[i].error);
        }

        msg = msg.join(',');

        Y.log('load error: ' + msg + ', ' + Y.id, 'error', 'loader');

        if (f) {
            f.call(this.context, {
                msg: msg,
                data: this.data,
                success: false
            });
        }

        this._finish(msg, false);

    },

    /**
    * The default Loader onTimeout handler, calls this.onTimeout with a payload
    * @method _onTimeout
    * @param {Get.Transaction} transaction The Transaction object from `Y.Get`
    * @private
    */
    _onTimeout: function(transaction) {
        Y.log('loader timeout: ' + Y.id, 'error', 'loader');
        var f = this.onTimeout;
        if (f) {
            f.call(this.context, {
                msg: 'timeout',
                data: this.data,
                success: false,
                transaction: transaction
            });
        }
    },

    /**
     * Sorts the dependency tree.  The last step of calculate()
     * @method _sort
     * @private
     */
    _sort: function() {
        var name,

            // Object containing module names.
            required = this.required,

            // Keep track of whether we've visited a module.
            visited = {};

        // Will contain modules names, in the correct order,
        // according to dependencies.
        this.sorted = [];

        for (name in required) {
            if (!visited[name] && required.hasOwnProperty(name)) {
                this._visit(name, visited);
            }
        }
    },

    /**
     * Recursively visits the dependencies of the module name
     * passed in, and appends each module name to the `sorted` property.
     * @param {String} name The name of a module.
     * @param {Object} visited Keeps track of whether a module was visited.
     * @method _visit
     * @private
     */
    _visit: function (name, visited) {
        var required, condition, moduleInfo, dependency, dependencies,
            trigger, isAfter, i, l;

        visited[name] = true;
        required = this.required;
        moduleInfo = this.moduleInfo[name];
        condition = this.conditions[name] || {};

        if (moduleInfo) {
            // Recurse on each dependency of this module,
            // figuring out its dependencies, and so on.
            dependencies = moduleInfo.expanded || moduleInfo.requires;

            for (i = 0, l = dependencies.length; i < l; ++i) {
                dependency = dependencies[i];
                trigger = condition[dependency];

                // We cannot process this dependency yet if it must
                // appear after our current module.
                isAfter = trigger && (!trigger.when || trigger.when === "after");

                // Is this module name in the required list of modules,
                // and have we not already visited it?
                if (required[dependency] && !visited[dependency] && !isAfter) {
                    this._visit(dependency, visited);
                }
            }
        }

        this.sorted.push(name);
    },

    /**
    * Handles the actual insertion of script/link tags
    * @method _insert
    * @private
    * @param {Object} source The YUI instance the request came from
    * @param {Object} o The metadata to include
    * @param {String} type JS or CSS
    * @param {Boolean} [skipcalc=false] Do a Loader.calculate on the meta
    */
    _insert: function(source, o, type, skipcalc) {

        Y.log('private _insert() ' + (type || '') + ', ' + Y.id, "info", "loader");

        // restore the state at the time of the request
        if (source) {
            this._config(source);
        }

        // build the dependency list
        // don't include type so we can process CSS and script in
        // one pass when the type is not specified.

        var modules = this.resolve(!skipcalc),
            self = this, comp = 0, actions = 0,
            mods = {}, deps, complete;

        self._refetch = [];

        if (type) {
            //Filter out the opposite type and reset the array so the checks later work
            modules[((type === JS) ? CSS : JS)] = [];
        }
        if (!self.fetchCSS) {
            modules.css = [];
        }
        if (modules.js.length) {
            comp++;
        }
        if (modules.css.length) {
            comp++;
        }

        //console.log('Resolved Modules: ', modules);

        complete = function(d) {
            actions++;
            var errs = {}, i = 0, o = 0, u = '', fn,
                modName, resMods;

            if (d && d.errors) {
                for (i = 0; i < d.errors.length; i++) {
                    if (d.errors[i].request) {
                        u = d.errors[i].request.url;
                    } else {
                        u = d.errors[i];
                    }
                    errs[u] = u;
                }
            }

            if (d && d.data && d.data.length && (d.type === 'success')) {
                for (i = 0; i < d.data.length; i++) {
                    self.inserted[d.data[i].name] = true;
                    //If the external module has a skin or a lang, reprocess it
                    if (d.data[i].lang || d.data[i].skinnable) {
                        delete self.inserted[d.data[i].name];
                        self._refetch.push(d.data[i].name);
                    }
                }
            }

            if (actions === comp) {
                self._loading = null;
                Y.log('Loader actions complete!', 'info', 'loader');
                if (self._refetch.length) {
                    //Get the deps for the new meta-data and reprocess
                    Y.log('Found potential modules to refetch', 'info', 'loader');
                    for (i = 0; i < self._refetch.length; i++) {
                        deps = self.getRequires(self.getModule(self._refetch[i]));
                        for (o = 0; o < deps.length; o++) {
                            if (!self.inserted[deps[o]]) {
                                //We wouldn't be to this point without the module being here
                                mods[deps[o]] = deps[o];
                            }
                        }
                    }
                    mods = Y.Object.keys(mods);
                    if (mods.length) {
                        Y.log('Refetching modules with new meta-data', 'info', 'loader');
                        self.require(mods);
                        resMods = self.resolve(true);
                        if (resMods.cssMods.length) {
                            for (i=0; i <  resMods.cssMods.length; i++) {
                                modName = resMods.cssMods[i].name;
                                delete YUI.Env._cssLoaded[modName];
                                if (self.isCSSLoaded(modName)) {
                                    self.inserted[modName] = true;
                                    delete self.required[modName];
                                }
                            }
                            self.sorted = [];
                            self._sort();
                        }
                        d = null; //bail
                        self._insert(); //insert the new deps
                    }
                }
                if (d && d.fn) {
                    Y.log('Firing final Loader callback!', 'info', 'loader');
                    fn = d.fn;
                    delete d.fn;
                    fn.call(self, d);
                }
            }
        };

        this._loading = true;

        if (!modules.js.length && !modules.css.length) {
            Y.log('No modules resolved..', 'warn', 'loader');
            actions = -1;
            complete({
                fn: self._onSuccess
            });
            return;
        }


        if (modules.css.length) { //Load CSS first
            Y.log('Loading CSS modules', 'info', 'loader');
            Y.Get.css(modules.css, {
                data: modules.cssMods,
                attributes: self.cssAttributes,
                insertBefore: self.insertBefore,
                charset: self.charset,
                timeout: self.timeout,
                context: self,
                onProgress: function(e) {
                    self._onProgress.call(self, e);
                },
                onTimeout: function(d) {
                    self._onTimeout.call(self, d);
                },
                onSuccess: function(d) {
                    d.type = 'success';
                    d.fn = self._onSuccess;
                    complete.call(self, d);
                },
                onFailure: function(d) {
                    d.type = 'failure';
                    d.fn = self._onFailure;
                    complete.call(self, d);
                }
            });
        }

        if (modules.js.length) {
            Y.log('Loading JS modules', 'info', 'loader');
            Y.Get.js(modules.js, {
                data: modules.jsMods,
                insertBefore: self.insertBefore,
                attributes: self.jsAttributes,
                charset: self.charset,
                timeout: self.timeout,
                autopurge: false,
                context: self,
                async: self.async,
                onProgress: function(e) {
                    self._onProgress.call(self, e);
                },
                onTimeout: function(d) {
                    self._onTimeout.call(self, d);
                },
                onSuccess: function(d) {
                    d.type = 'success';
                    d.fn = self._onSuccess;
                    complete.call(self, d);
                },
                onFailure: function(d) {
                    d.type = 'failure';
                    d.fn = self._onFailure;
                    complete.call(self, d);
                }
            });
        }
    },
    /**
    * Once a loader operation is completely finished, process any additional queued items.
    * @method _continue
    * @private
    */
    _continue: function() {
        if (!(_queue.running) && _queue.size() > 0) {
            _queue.running = true;
            _queue.next()();
        }
    },

    /**
     * inserts the requested modules and their dependencies.
     * <code>type</code> can be "js" or "css".  Both script and
     * css are inserted if type is not provided.
     * @method insert
     * @param {object} o optional options object.
     * @param {string} type the type of dependency to insert.
     */
    insert: function(o, type, skipsort) {
        Y.log('public insert() ' + (type || '') + ', ' + Y.Object.keys(this.required), "info", "loader");
        var self = this, copy = Y.merge(this);
        delete copy.require;
        delete copy.dirty;
        _queue.add(function() {
            self._insert(copy, o, type, skipsort);
        });
        this._continue();
    },

    /**
     * Executed every time a module is loaded, and if we are in a load
     * cycle, we attempt to load the next script.  Public so that it
     * is possible to call this if using a method other than
     * Y.register to determine when scripts are fully loaded
     * @method loadNext
     * @deprecated
     * @param {string} mname optional the name of the module that has
     * been loaded (which is usually why it is time to load the next
     * one).
     */
    loadNext: function() {
        Y.log('loadNext was called..', 'error', 'loader');
        return;
    },

    /**
     * Apply filter defined for this instance to a url/path
     * @method _filter
     * @param {string} u the string to filter.
     * @param {string} name the name of the module, if we are processing
     * a single module as opposed to a combined url.
     * @return {string} the filtered string.
     * @private
     */
    _filter: function(u, name, group) {
        var f = this.filter,
            hasFilter = name && (name in this.filters),
            modFilter = hasFilter && this.filters[name],
            groupName = group || (this.getModuleInfo(name) || {}).group || null;

        if (groupName && this.groups[groupName] && this.groups[groupName].filter) {
            modFilter = this.groups[groupName].filter;
            hasFilter = true;
        }

        if (u) {
            if (hasFilter) {
                f = (L.isString(modFilter)) ? this.FILTER_DEFS[modFilter.toUpperCase()] || null : modFilter;
            }
            if (f) {
                u = u.replace(new RegExp(f.searchExp, 'g'), f.replaceStr);
            }
        }
        return u;
    },

    /**
     * Generates the full url for a module
     * @method _url
     * @param {string} path the path fragment.
     * @param {String} name The name of the module
     * @param {String} [base] The base url to use. Defaults to self.base
     * @return {string} the full url.
     * @private
     */
    _url: function(path, name, base) {
        return this._filter((base || this.base || '') + path, name);
    },
    /**
    * Returns an Object hash of file arrays built from `loader.sorted` or from an arbitrary list of sorted modules.
    * @method resolve
    * @param {Boolean} [calc=false] Perform a loader.calculate() before anything else
    * @param {Array} [sorted=loader.sorted] An override for the loader.sorted array
    * @return {Object} Object hash (js and css) of two arrays of file lists
    * @example This method can be used as an off-line dep calculator
    *
    *        var Y = YUI();
    *        var loader = new Y.Loader({
    *            filter: 'debug',
    *            base: '../../',
    *            root: 'build/',
    *            combine: true,
    *            require: ['node', 'dd', 'console']
    *        });
    *        var out = loader.resolve(true);
    *
    */
    resolve: function(calc, sorted) {
        var self     = this,
            resolved = { js: [], jsMods: [], css: [], cssMods: [] },
            addSingle,
            usePathogen = Y.config.comboLoader && Y.config.customComboBase;

        if (self.skin.overrides || self.skin.defaultSkin !== DEFAULT_SKIN || self.ignoreRegistered) {
            self._resetModules();
        }

        if (calc) {
            self.calculate();
        }
        sorted = sorted || self.sorted;

        addSingle = function(mod) {
            if (mod) {
                var group = (mod.group && self.groups[mod.group]) || NOT_FOUND,
                    url;

                //Always assume it's async
                if (group.async === false) {
                    mod.async = group.async;
                }

                url = (mod.fullpath) ? self._filter(mod.fullpath, mod.name) :
                      self._url(mod.path, mod.name, group.base || mod.base);

                if (mod.attributes || mod.async === false) {
                    url = {
                        url: url,
                        async: mod.async
                    };
                    if (mod.attributes) {
                        url.attributes = mod.attributes;
                    }
                }
                resolved[mod.type].push(url);
                resolved[mod.type + 'Mods'].push(mod);
            } else {
                Y.log('Undefined Module', 'warn', 'loader');
            }

        };

        /*jslint vars: true */
        var inserted     = (self.ignoreRegistered) ? {} : self.inserted,
            comboSources,
            maxURLLength,
            comboMeta,
            comboBase,
            comboSep,
            group,
            mod,
            len,
            i,
            hasComboModule = false;

        /*jslint vars: false */

        for (i = 0, len = sorted.length; i < len; i++) {
            mod = self.getModule(sorted[i]);
            if (!mod || inserted[mod.name]) {
                continue;
            }

            group = self.groups[mod.group];

            comboBase = self.comboBase;

            if (group) {
                if (!group.combine || mod.fullpath) {
                    //This is not a combo module, skip it and load it singly later.
                    addSingle(mod);
                    continue;
                }
                mod.combine = true;

                if (typeof group.root === 'string') {
                    mod.root = group.root;
                }

                comboBase    = group.comboBase || comboBase;
                comboSep     = group.comboSep;
                maxURLLength = group.maxURLLength;
            } else {
                if (!self.combine) {
                    //This is not a combo module, skip it and load it singly later.
                    addSingle(mod);
                    continue;
                }
            }

            if (!mod.combine && mod.ext) {
                addSingle(mod);
                continue;
            }
            hasComboModule = true;
            comboSources = comboSources || {};
            comboSources[comboBase] = comboSources[comboBase] ||
                { js: [], jsMods: [], css: [], cssMods: [] };

            comboMeta               = comboSources[comboBase];
            comboMeta.group         = mod.group;
            comboMeta.comboSep      = comboSep || self.comboSep;
            comboMeta.maxURLLength  = maxURLLength || self.maxURLLength;

            comboMeta[mod.type + 'Mods'].push(mod);
            if (mod.type === JS || mod.type === CSS) {
                resolved[mod.type + 'Mods'].push(mod);
            }
        }
        //only encode if we have something to encode
        if (hasComboModule) {
            if (usePathogen) {
                resolved = this._pathogenEncodeComboSources(resolved);
            } else {
                resolved = this._encodeComboSources(resolved, comboSources);
            }
        }
        return resolved;
    },

    /**
     * Encodes combo sources and appends them to an object hash of arrays from `loader.resolve`.
     *
     * @method _encodeComboSources
     * @param {Object} resolved The object hash of arrays in which to attach the encoded combo sources.
     * @param {Object} comboSources An object containing relevant data about modules.
     * @return Object
     * @private
     */
    _encodeComboSources: function(resolved, comboSources) {
        var fragSubset,
            modules,
            tmpBase,
            baseLen,
            frags,
            frag,
            type,
            mod,
            maxURLLength,
            comboBase,
            comboMeta,
            comboSep,
            i,
            len,
            self = this;

        for (comboBase in comboSources) {
            if (comboSources.hasOwnProperty(comboBase)) {
                comboMeta    = comboSources[comboBase];
                comboSep     = comboMeta.comboSep;
                maxURLLength = comboMeta.maxURLLength;
                Y.log('Using maxURLLength of ' + maxURLLength, 'info', 'loader');
                for (type in comboMeta) {
                    if (type === JS || type === CSS) {
                        modules = comboMeta[type + 'Mods'];
                        frags = [];
                        for (i = 0, len = modules.length; i < len; i += 1) {
                            mod = modules[i];
                            frag = ((typeof mod.root === 'string') ? mod.root : self.root) + (mod.path || mod.fullpath);
                            frags.push(
                                self._filter(frag, mod.name)
                            );
                        }
                        tmpBase = comboBase + frags.join(comboSep);
                        baseLen = tmpBase.length;
                        if (maxURLLength <= comboBase.length) {
                            Y.log('maxURLLength (' + maxURLLength + ') is lower than the comboBase length (' + comboBase.length + '), resetting to default (' + MAX_URL_LENGTH + ')', 'error', 'loader');
                            maxURLLength = MAX_URL_LENGTH;
                        }

                        if (frags.length) {
                            if (baseLen > maxURLLength) {
                                Y.log('Exceeded maxURLLength (' + maxURLLength + ') for ' + type + ', splitting', 'info', 'loader');
                                fragSubset = [];
                                for (i = 0, len = frags.length; i < len; i++) {
                                    fragSubset.push(frags[i]);
                                    tmpBase = comboBase + fragSubset.join(comboSep);

                                    if (tmpBase.length > maxURLLength) {
                                        frag = fragSubset.pop();
                                        tmpBase = comboBase + fragSubset.join(comboSep);
                                        resolved[type].push(self._filter(tmpBase, null, comboMeta.group));
                                        fragSubset = [];
                                        if (frag) {
                                            fragSubset.push(frag);
                                        }
                                    }
                                }
                                if (fragSubset.length) {
                                    tmpBase = comboBase + fragSubset.join(comboSep);
                                    resolved[type].push(self._filter(tmpBase, null, comboMeta.group));
                                }
                            } else {
                                resolved[type].push(self._filter(tmpBase, null, comboMeta.group));
                            }
                        }
                    }
                }
            }
        }
        return resolved;
    },

    /**
    Shortcut to calculate, resolve and load all modules.

        var loader = new Y.Loader({
            ignoreRegistered: true,
            modules: {
                mod: {
                    path: 'mod.js'
                }
            },
            requires: [ 'mod' ]
        });
        loader.load(function() {
            console.log('All modules have loaded..');
        });


    @method load
    @param {Function} cb Executed after all load operations are complete
    */
    load: function(cb) {
        if (!cb) {
            Y.log('No callback supplied to load()', 'error', 'loader');
            return;
        }
        var self = this,
            out = self.resolve(true);

        self.data = out;

        self.onEnd = function() {
            cb.apply(self.context || self, arguments);
        };

        self.insert();
    }
};
