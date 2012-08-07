if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js",
    code: []
};
_yuitest_coverage["/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js"].code=["YUI.add('loader-base', function(Y) {","","/**"," * The YUI loader core"," * @module loader"," * @submodule loader-base"," */","","if (!YUI.Env[Y.version]) {","","    (function() {","        var VERSION = Y.version,","            BUILD = '/build/',","            ROOT = VERSION + BUILD,","            CDN_BASE = Y.Env.base,","            GALLERY_VERSION = 'gallery-2012.08.01-13-16',","            TNT = '2in3',","            TNT_VERSION = '4',","            YUI2_VERSION = '2.9.0',","            COMBO_BASE = CDN_BASE + 'combo?',","            META = { version: VERSION,","                              root: ROOT,","                              base: Y.Env.base,","                              comboBase: COMBO_BASE,","                              skin: { defaultSkin: 'sam',","                                           base: 'assets/skins/',","                                           path: 'skin.css',","                                           after: ['cssreset',","                                                          'cssfonts',","                                                          'cssgrids',","                                                          'cssbase',","                                                          'cssreset-context',","                                                          'cssfonts-context']},","                              groups: {},","                              patterns: {} },","            groups = META.groups,","            yui2Update = function(tnt, yui2, config) {","                    ","                var root = TNT + '.' +","                        (tnt || TNT_VERSION) + '/' +","                        (yui2 || YUI2_VERSION) + BUILD,","                    base = (config && config.base) ? config.base : CDN_BASE,","                    combo = (config && config.comboBase) ? config.comboBase : COMBO_BASE;","","                groups.yui2.base = base + root;","                groups.yui2.root = root;","                groups.yui2.comboBase = combo;","            },","            galleryUpdate = function(tag, config) {","                var root = (tag || GALLERY_VERSION) + BUILD,","                    base = (config && config.base) ? config.base : CDN_BASE,","                    combo = (config && config.comboBase) ? config.comboBase : COMBO_BASE;","","                groups.gallery.base = base + root;","                groups.gallery.root = root;","                groups.gallery.comboBase = combo;","            };","","","        groups[VERSION] = {};","","        groups.gallery = {","            ext: false,","            combine: true,","            comboBase: COMBO_BASE,","            update: galleryUpdate,","            patterns: { 'gallery-': { },","                        'lang/gallery-': {},","                        'gallerycss-': { type: 'css' } }","        };","","        groups.yui2 = {","            combine: true,","            ext: false,","            comboBase: COMBO_BASE,","            update: yui2Update,","            patterns: {","                'yui2-': {","                    configFn: function(me) {","                        if (/-skin|reset|fonts|grids|base/.test(me.name)) {","                            me.type = 'css';","                            me.path = me.path.replace(/\\.js/, '.css');","                            // this makes skins in builds earlier than","                            // 2.6.0 work as long as combine is false","                            me.path = me.path.replace(/\\/yui2-skin/,","                                             '/assets/skins/sam/yui2-skin');","                        }","                    }","                }","            }","        };","","        galleryUpdate();","        yui2Update();","","        YUI.Env[VERSION] = META;","    }());","}","","","/*jslint forin: true */","","/**"," * Loader dynamically loads script and css files.  It includes the dependency"," * information for the version of the library in use, and will automatically pull in"," * dependencies for the modules requested. It can also load the"," * files from the Yahoo! CDN, and it can utilize the combo service provided on"," * this network to reduce the number of http connections required to download"," * YUI files."," *"," * @module loader"," * @main loader"," * @submodule loader-base"," */","","var NOT_FOUND = {},","    NO_REQUIREMENTS = [],","    MAX_URL_LENGTH = 1024,","    GLOBAL_ENV = YUI.Env,","    GLOBAL_LOADED = GLOBAL_ENV._loaded,","    CSS = 'css',","    JS = 'js',","    INTL = 'intl',","    DEFAULT_SKIN = 'sam',","    VERSION = Y.version,","    ROOT_LANG = '',","    YObject = Y.Object,","    oeach = YObject.each,","    YArray = Y.Array,","    _queue = GLOBAL_ENV._loaderQueue,","    META = GLOBAL_ENV[VERSION],","    SKIN_PREFIX = 'skin-',","    L = Y.Lang,","    ON_PAGE = GLOBAL_ENV.mods,","    modulekey,","    cache,","    _path = function(dir, file, type, nomin) {","        var path = dir + '/' + file;","        if (!nomin) {","            path += '-min';","        }","        path += '.' + (type || CSS);","","        return path;","    };","","","    if (!YUI.Env._cssLoaded) {","        YUI.Env._cssLoaded = {};","    }","","","/**"," * The component metadata is stored in Y.Env.meta."," * Part of the loader module."," * @property meta"," * @for YUI"," */","Y.Env.meta = META;","","/**"," * Loader dynamically loads script and css files.  It includes the dependency"," * info for the version of the library in use, and will automatically pull in"," * dependencies for the modules requested. It can load the"," * files from the Yahoo! CDN, and it can utilize the combo service provided on"," * this network to reduce the number of http connections required to download"," * YUI files. You can also specify an external, custom combo service to host"," * your modules as well.","","        var Y = YUI();","        var loader = new Y.Loader({","            filter: 'debug',","            base: '../../',","            root: 'build/',","            combine: true,","            require: ['node', 'dd', 'console']","        });","        var out = loader.resolve(true);"," "," * @constructor"," * @class Loader"," * @param {Object} config an optional set of configuration options."," * @param {String} config.base The base dir which to fetch this module from"," * @param {String} config.comboBase The Combo service base path. Ex: `http://yui.yahooapis.com/combo?`"," * @param {String} config.root The root path to prepend to module names for the combo service. Ex: `2.5.2/build/`"," * @param {String|Object} config.filter A filter to apply to result urls. <a href=\"#property_filter\">See filter property</a>"," * @param {Object} config.filters Per-component filter specification.  If specified for a given component, this overrides the filter config."," * @param {Boolean} config.combine Use a combo service to reduce the number of http connections required to load your dependencies"," * @param {Boolean} [config.async=true] Fetch files in async"," * @param {Array} config.ignore: A list of modules that should never be dynamically loaded"," * @param {Array} config.force A list of modules that should always be loaded when required, even if already present on the page"," * @param {HTMLElement|String} config.insertBefore Node or id for a node that should be used as the insertion point for new nodes"," * @param {Object} config.jsAttributes Object literal containing attributes to add to script nodes"," * @param {Object} config.cssAttributes Object literal containing attributes to add to link nodes"," * @param {Number} config.timeout The number of milliseconds before a timeout occurs when dynamically loading nodes.  If not set, there is no timeout"," * @param {Object} config.context Execution context for all callbacks"," * @param {Function} config.onSuccess Callback for the 'success' event"," * @param {Function} config.onFailure Callback for the 'failure' event"," * @param {Function} config.onCSS Callback for the 'CSSComplete' event.  When loading YUI components with CSS the CSS is loaded first, then the script.  This provides a moment you can tie into to improve the presentation of the page while the script is loading."," * @param {Function} config.onTimeout Callback for the 'timeout' event"," * @param {Function} config.onProgress Callback executed each time a script or css file is loaded"," * @param {Object} config.modules A list of module definitions.  See <a href=\"#method_addModule\">Loader.addModule</a> for the supported module metadata"," * @param {Object} config.groups A list of group definitions.  Each group can contain specific definitions for `base`, `comboBase`, `combine`, and accepts a list of `modules`."," * @param {String} config.2in3 The version of the YUI 2 in 3 wrapper to use.  The intrinsic support for YUI 2 modules in YUI 3 relies on versions of the YUI 2 components inside YUI 3 module wrappers.  These wrappers change over time to accomodate the issues that arise from running YUI 2 in a YUI 3 sandbox."," * @param {String} config.yui2 When using the 2in3 project, you can select the version of YUI 2 to use.  Valid values are `2.2.2`, `2.3.1`, `2.4.1`, `2.5.2`, `2.6.0`, `2.7.0`, `2.8.0`, `2.8.1` and `2.9.0` [default] -- plus all versions of YUI 2 going forward."," */","Y.Loader = function(o) {","","    var self = this;","    ","    //Catch no config passed.","    o = o || {};","","    modulekey = META.md5;","","    /**","     * Internal callback to handle multiple internal insert() calls","     * so that css is inserted prior to js","     * @property _internalCallback","     * @private","     */","    // self._internalCallback = null;","","    /**","     * Callback that will be executed when the loader is finished","     * with an insert","     * @method onSuccess","     * @type function","     */","    // self.onSuccess = null;","","    /**","     * Callback that will be executed if there is a failure","     * @method onFailure","     * @type function","     */","    // self.onFailure = null;","","    /**","     * Callback for the 'CSSComplete' event.  When loading YUI components","     * with CSS the CSS is loaded first, then the script.  This provides","     * a moment you can tie into to improve the presentation of the page","     * while the script is loading.","     * @method onCSS","     * @type function","     */","    // self.onCSS = null;","","    /**","     * Callback executed each time a script or css file is loaded","     * @method onProgress","     * @type function","     */","    // self.onProgress = null;","","    /**","     * Callback that will be executed if a timeout occurs","     * @method onTimeout","     * @type function","     */","    // self.onTimeout = null;","","    /**","     * The execution context for all callbacks","     * @property context","     * @default {YUI} the YUI instance","     */","    self.context = Y;","","    /**","     * Data that is passed to all callbacks","     * @property data","     */","    // self.data = null;","","    /**","     * Node reference or id where new nodes should be inserted before","     * @property insertBefore","     * @type string|HTMLElement","     */","    // self.insertBefore = null;","","    /**","     * The charset attribute for inserted nodes","     * @property charset","     * @type string","     * @deprecated , use cssAttributes or jsAttributes.","     */","    // self.charset = null;","","    /**","     * An object literal containing attributes to add to link nodes","     * @property cssAttributes","     * @type object","     */","    // self.cssAttributes = null;","","    /**","     * An object literal containing attributes to add to script nodes","     * @property jsAttributes","     * @type object","     */","    // self.jsAttributes = null;","","    /**","     * The base directory.","     * @property base","     * @type string","     * @default http://yui.yahooapis.com/[YUI VERSION]/build/","     */","    self.base = Y.Env.meta.base + Y.Env.meta.root;","","    /**","     * Base path for the combo service","     * @property comboBase","     * @type string","     * @default http://yui.yahooapis.com/combo?","     */","    self.comboBase = Y.Env.meta.comboBase;","","    /*","     * Base path for language packs.","     */","    // self.langBase = Y.Env.meta.langBase;","    // self.lang = \"\";","","    /**","     * If configured, the loader will attempt to use the combo","     * service for YUI resources and configured external resources.","     * @property combine","     * @type boolean","     * @default true if a base dir isn't in the config","     */","    self.combine = o.base &&","        (o.base.indexOf(self.comboBase.substr(0, 20)) > -1);","    ","    /**","    * The default seperator to use between files in a combo URL","    * @property comboSep","    * @type {String}","    * @default Ampersand","    */","    self.comboSep = '&';","    /**","     * Max url length for combo urls.  The default is 1024. This is the URL","     * limit for the Yahoo! hosted combo servers.  If consuming","     * a different combo service that has a different URL limit","     * it is possible to override this default by supplying","     * the maxURLLength config option.  The config option will","     * only take effect if lower than the default.","     *","     * @property maxURLLength","     * @type int","     */","    self.maxURLLength = MAX_URL_LENGTH;","","    /**","     * Ignore modules registered on the YUI global","     * @property ignoreRegistered","     * @default false","     */","    self.ignoreRegistered = o.ignoreRegistered;","","    /**","     * Root path to prepend to module path for the combo","     * service","     * @property root","     * @type string","     * @default [YUI VERSION]/build/","     */","    self.root = Y.Env.meta.root;","","    /**","     * Timeout value in milliseconds.  If set, self value will be used by","     * the get utility.  the timeout event will fire if","     * a timeout occurs.","     * @property timeout","     * @type int","     */","    self.timeout = 0;","","    /**","     * A list of modules that should not be loaded, even if","     * they turn up in the dependency tree","     * @property ignore","     * @type string[]","     */","    // self.ignore = null;","","    /**","     * A list of modules that should always be loaded, even","     * if they have already been inserted into the page.","     * @property force","     * @type string[]","     */","    // self.force = null;","","    self.forceMap = {};","","    /**","     * Should we allow rollups","     * @property allowRollup","     * @type boolean","     * @default false","     */","    self.allowRollup = false;","","    /**","     * A filter to apply to result urls.  This filter will modify the default","     * path for all modules.  The default path for the YUI library is the","     * minified version of the files (e.g., event-min.js).  The filter property","     * can be a predefined filter or a custom filter.  The valid predefined","     * filters are:","     * <dl>","     *  <dt>DEBUG</dt>","     *  <dd>Selects the debug versions of the library (e.g., event-debug.js).","     *      This option will automatically include the Logger widget</dd>","     *  <dt>RAW</dt>","     *  <dd>Selects the non-minified version of the library (e.g., event.js).","     *  </dd>","     * </dl>","     * You can also define a custom filter, which must be an object literal","     * containing a search expression and a replace string:","     *","     *      myFilter: {","     *          'searchExp': \"-min\\\\.js\",","     *          'replaceStr': \"-debug.js\"","     *      }","     *","     * @property filter","     * @type string| {searchExp: string, replaceStr: string}","     */","    // self.filter = null;","","    /**","     * per-component filter specification.  If specified for a given","     * component, this overrides the filter config.","     * @property filters","     * @type object","     */","    self.filters = {};","","    /**","     * The list of requested modules","     * @property required","     * @type {string: boolean}","     */","    self.required = {};","","    /**","     * If a module name is predefined when requested, it is checked againsts","     * the patterns provided in this property.  If there is a match, the","     * module is added with the default configuration.","     *","     * At the moment only supporting module prefixes, but anticipate","     * supporting at least regular expressions.","     * @property patterns","     * @type Object","     */","    // self.patterns = Y.merge(Y.Env.meta.patterns);","    self.patterns = {};","","    /**","     * The library metadata","     * @property moduleInfo","     */","    // self.moduleInfo = Y.merge(Y.Env.meta.moduleInfo);","    self.moduleInfo = {};","","    self.groups = Y.merge(Y.Env.meta.groups);","","    /**","     * Provides the information used to skin the skinnable components.","     * The following skin definition would result in 'skin1' and 'skin2'","     * being loaded for calendar (if calendar was requested), and","     * 'sam' for all other skinnable components:","     *","     *      skin: {","     *          // The default skin, which is automatically applied if not","     *          // overriden by a component-specific skin definition.","     *          // Change this in to apply a different skin globally","     *          defaultSkin: 'sam',","     *","     *          // This is combined with the loader base property to get","     *          // the default root directory for a skin. ex:","     *          // http://yui.yahooapis.com/2.3.0/build/assets/skins/sam/","     *          base: 'assets/skins/',","     *          ","     *          // Any component-specific overrides can be specified here,","     *          // making it possible to load different skins for different","     *          // components.  It is possible to load more than one skin","     *          // for a given component as well.","     *          overrides: {","     *              calendar: ['skin1', 'skin2']","     *          }","     *      }","     * @property skin","     * @type {Object}","     */","    self.skin = Y.merge(Y.Env.meta.skin);","","    /*","     * Map of conditional modules","     * @since 3.2.0","     */","    self.conditions = {};","","    // map of modules with a hash of modules that meet the requirement","    // self.provides = {};","","    self.config = o;","    self._internal = true;","","    self._populateCache();","","    /**","     * Set when beginning to compute the dependency tree.","     * Composed of what YUI reports to be loaded combined","     * with what has been loaded by any instance on the page","     * with the version number specified in the metadata.","     * @property loaded","     * @type {string: boolean}","     */","    self.loaded = GLOBAL_LOADED[VERSION];","","    ","    /**","    * Should Loader fetch scripts in `async`, defaults to `true`","    * @property async","    */","","    self.async = true;","","    self._inspectPage();","","    self._internal = false;","","    self._config(o);","","    self.forceMap = (self.force) ? Y.Array.hash(self.force) : {};	","","    self.testresults = null;","","    if (Y.config.tests) {","        self.testresults = Y.config.tests;","    }","    ","    /**","     * List of rollup files found in the library metadata","     * @property rollups","     */","    // self.rollups = null;","","    /**","     * Whether or not to load optional dependencies for","     * the requested modules","     * @property loadOptional","     * @type boolean","     * @default false","     */","    // self.loadOptional = false;","","    /**","     * All of the derived dependencies in sorted order, which","     * will be populated when either calculate() or insert()","     * is called","     * @property sorted","     * @type string[]","     */","    self.sorted = [];","","    /*","     * A list of modules to attach to the YUI instance when complete.","     * If not supplied, the sorted list of dependencies are applied.","     * @property attaching","     */","    // self.attaching = null;","","    /**","     * Flag to indicate the dependency tree needs to be recomputed","     * if insert is called again.","     * @property dirty","     * @type boolean","     * @default true","     */","    self.dirty = true;","","    /**","     * List of modules inserted by the utility","     * @property inserted","     * @type {string: boolean}","     */","    self.inserted = {};","","    /**","     * List of skipped modules during insert() because the module","     * was not defined","     * @property skipped","     */","    self.skipped = {};","","    // Y.on('yui:load', self.loadNext, self);","","    self.tested = {};","","    /*","     * Cached sorted calculate results","     * @property results","     * @since 3.2.0","     */","    //self.results = {};","","    if (self.ignoreRegistered) {","        //Clear inpage already processed modules.","        self._resetModules();","    }","","};","","Y.Loader.prototype = {","    /**","    * Checks the cache for modules and conditions, if they do not exist","    * process the default metadata and populate the local moduleInfo hash.","    * @method _populateCache","    * @private","    */","    _populateCache: function() {","        var self = this,","            defaults = META.modules,","            cache = GLOBAL_ENV._renderedMods,","            i;","","        if (cache && !self.ignoreRegistered) {","            for (i in cache) {","                if (cache.hasOwnProperty(i)) {","                    self.moduleInfo[i] = Y.merge(cache[i]);","                }","            }","","            cache = GLOBAL_ENV._conditions;","            for (i in cache) {","                if (cache.hasOwnProperty(i)) {","                    self.conditions[i] = Y.merge(cache[i]);","                }","            }","","        } else {","            for (i in defaults) {","                if (defaults.hasOwnProperty(i)) {","                    self.addModule(defaults[i], i);","                }","            }","        }","","    },","    /**","    * Reset modules in the module cache to a pre-processed state so additional","    * computations with a different skin or language will work as expected.","    * @private _resetModules","    */","    _resetModules: function() {","        var self = this, i, o;","        for (i in self.moduleInfo) {","            if (self.moduleInfo.hasOwnProperty(i)) {","                var mod = self.moduleInfo[i],","                    name = mod.name,","                    details  = (YUI.Env.mods[name] ? YUI.Env.mods[name].details : null);","","                if (details) {","                    self.moduleInfo[name]._reset = true;","                    self.moduleInfo[name].requires = details.requires || [];","                    self.moduleInfo[name].optional = details.optional || [];","                    self.moduleInfo[name].supersedes = details.supercedes || [];","                }","","                if (mod.defaults) {","                    for (o in mod.defaults) {","                        if (mod.defaults.hasOwnProperty(o)) {","                            if (mod[o]) {","                                mod[o] = mod.defaults[o];","                            }","                        }","                    }","                }","                delete mod.langCache;","                delete mod.skinCache;","                if (mod.skinnable) {","                    self._addSkin(self.skin.defaultSkin, mod.name);","                }","            }","        }","    },","    /**","    Regex that matches a CSS URL. Used to guess the file type when it's not","    specified.","","    @property REGEX_CSS","    @type RegExp","    @final","    @protected","    @since 3.5.0","    **/","    REGEX_CSS: /\\.css(?:[?;].*)?$/i,","    ","    /**","    * Default filters for raw and debug","    * @property FILTER_DEFS","    * @type Object","    * @final","    * @protected","    */","    FILTER_DEFS: {","        RAW: {","            'searchExp': '-min\\\\.js',","            'replaceStr': '.js'","        },","        DEBUG: {","            'searchExp': '-min\\\\.js',","            'replaceStr': '-debug.js'","        }","    },","    /*","    * Check the pages meta-data and cache the result.","    * @method _inspectPage","    * @private","    */","    _inspectPage: function() {","        var self = this, v, m, req, mr, i;","","        //Inspect the page for CSS only modules and mark them as loaded.","        for (i in self.moduleInfo) {","            if (self.moduleInfo.hasOwnProperty(i)) {","                v = self.moduleInfo[i];","                if (v.type && v.type === CSS) {","                    if (self.isCSSLoaded(v.name)) {","                        self.loaded[i] = true;","                    }","                }","            }","        }","        for (i in ON_PAGE) {","            if (ON_PAGE.hasOwnProperty(i)) {","                v = ON_PAGE[i];","                if (v.details) {","                    m = self.moduleInfo[v.name];","                    req = v.details.requires;","                    mr = m && m.requires;","","                   if (m) {","                       if (!m._inspected && req && mr.length != req.length) {","                           // console.log('deleting ' + m.name);","                           delete m.expanded;","                       }","                   } else {","                       m = self.addModule(v.details, i);","                   }","                   m._inspected = true;","               }","            }","        }","    },","    /*","    * returns true if b is not loaded, and is required directly or by means of modules it supersedes.","    * @private","    * @method _requires","    * @param {String} mod1 The first module to compare","    * @param {String} mod2 The second module to compare","    */","   _requires: function(mod1, mod2) {","","        var i, rm, after_map, s,","            info = this.moduleInfo,","            m = info[mod1],","            other = info[mod2];","","        if (!m || !other) {","            return false;","        }","","        rm = m.expanded_map;","        after_map = m.after_map;","","        // check if this module should be sorted after the other","        // do this first to short circut circular deps","        if (after_map && (mod2 in after_map)) {","            return true;","        }","","        after_map = other.after_map;","","        // and vis-versa","        if (after_map && (mod1 in after_map)) {","            return false;","        }","","        // check if this module requires one the other supersedes","        s = info[mod2] && info[mod2].supersedes;","        if (s) {","            for (i = 0; i < s.length; i++) {","                if (this._requires(mod1, s[i])) {","                    return true;","                }","            }","        }","","        s = info[mod1] && info[mod1].supersedes;","        if (s) {","            for (i = 0; i < s.length; i++) {","                if (this._requires(mod2, s[i])) {","                    return false;","                }","            }","        }","","        // check if this module requires the other directly","        // if (r && YArray.indexOf(r, mod2) > -1) {","        if (rm && (mod2 in rm)) {","            return true;","        }","","        // external css files should be sorted below yui css","        if (m.ext && m.type == CSS && !other.ext && other.type == CSS) {","            return true;","        }","","        return false;","    },","    /**","    * Apply a new config to the Loader instance","    * @method _config","    * @private","    * @param {Object} o The new configuration","    */","    _config: function(o) {","        var i, j, val, a, f, group, groupName, self = this;","        // apply config values","        if (o) {","            for (i in o) {","                if (o.hasOwnProperty(i)) {","                    val = o[i];","                    if (i == 'require') {","                        self.require(val);","                    } else if (i == 'skin') {","                        //If the config.skin is a string, format to the expected object","                        if (typeof val === 'string') {","                            self.skin.defaultSkin = o.skin;","                            val = {","                                defaultSkin: val","                            };","                        }","","                        Y.mix(self.skin, val, true);","                    } else if (i == 'groups') {","                        for (j in val) {","                            if (val.hasOwnProperty(j)) {","                                groupName = j;","                                group = val[j];","                                self.addGroup(group, groupName);","                                if (group.aliases) {","                                    for (a in group.aliases) {","                                        if (group.aliases.hasOwnProperty(a)) {","                                            self.addAlias(group.aliases[a], a);","                                        }","                                    }","                                }","                            }","                        }","","                    } else if (i == 'modules') {","                        // add a hash of module definitions","                        for (j in val) {","                            if (val.hasOwnProperty(j)) {","                                self.addModule(val[j], j);","                            }","                        }","                    } else if (i === 'aliases') {","                        for (j in val) {","                            if (val.hasOwnProperty(j)) {","                                self.addAlias(val[j], j);","                            }","                        }","                    } else if (i == 'gallery') {","                        this.groups.gallery.update(val, o);","                    } else if (i == 'yui2' || i == '2in3') {","                        this.groups.yui2.update(o['2in3'], o.yui2, o);","                    } else {","                        self[i] = val;","                    }","                }","            }","        }","","        // fix filter","        f = self.filter;","","        if (L.isString(f)) {","            f = f.toUpperCase();","            self.filterName = f;","            self.filter = self.FILTER_DEFS[f];","            if (f == 'DEBUG') {","                self.require('yui-log', 'dump');","            }","        }","        ","","        if (self.lang) {","            //Removed this so that when Loader is invoked","            //it doesn't request what it doesn't need.","            //self.require('intl-base', 'intl');","        }","","    },","","    /**","     * Returns the skin module name for the specified skin name.  If a","     * module name is supplied, the returned skin module name is","     * specific to the module passed in.","     * @method formatSkin","     * @param {string} skin the name of the skin.","     * @param {string} mod optional: the name of a module to skin.","     * @return {string} the full skin module name.","     */","    formatSkin: function(skin, mod) {","        var s = SKIN_PREFIX + skin;","        if (mod) {","            s = s + '-' + mod;","        }","","        return s;","    },","","    /**","     * Adds the skin def to the module info","     * @method _addSkin","     * @param {string} skin the name of the skin.","     * @param {string} mod the name of the module.","     * @param {string} parent parent module if this is a skin of a","     * submodule or plugin.","     * @return {string} the module name for the skin.","     * @private","     */","    _addSkin: function(skin, mod, parent) {","        var mdef, pkg, name, nmod,","            info = this.moduleInfo,","            sinf = this.skin,","            ext = info[mod] && info[mod].ext;","","        // Add a module definition for the module-specific skin css","        if (mod) {","            name = this.formatSkin(skin, mod);","            if (!info[name]) {","                mdef = info[mod];","                pkg = mdef.pkg || mod;","                nmod = {","                    skin: true,","                    name: name,","                    group: mdef.group,","                    type: 'css',","                    after: sinf.after,","                    path: (parent || pkg) + '/' + sinf.base + skin +","                          '/' + mod + '.css',","                    ext: ext","                };","                if (mdef.base) {","                    nmod.base = mdef.base;","                }","                if (mdef.configFn) {","                    nmod.configFn = mdef.configFn;","                }","                this.addModule(nmod, name);","","            }","        }","","        return name;","    },","    /**","    * Adds an alias module to the system","    * @method addAlias","    * @param {Array} use An array of modules that makes up this alias","    * @param {String} name The name of the alias","    * @example","    *       var loader = new Y.Loader({});","    *       loader.addAlias([ 'node', 'yql' ], 'davglass');","    *       loader.require(['davglass']);","    *       var out = loader.resolve(true);","    *","    *       //out.js will contain Node and YQL modules","    */","    addAlias: function(use, name) {","        YUI.Env.aliases[name] = use;","        this.addModule({","            name: name,","            use: use","        });","    },","    /**","     * Add a new module group","     * @method addGroup","     * @param {Object} config An object containing the group configuration data","     * @param {String} config.name required, the group name","     * @param {String} config.base The base directory for this module group","     * @param {String} config.root The root path to add to each combo resource path","     * @param {Boolean} config.combine Should the request be combined","     * @param {String} config.comboBase Combo service base path","     * @param {Object} config.modules The group of modules","     * @param {String} name the group name.","     * @example","     *      var loader = new Y.Loader({});","     *      loader.addGroup({","     *          name: 'davglass',","     *          combine: true,","     *          comboBase: '/combo?',","     *          root: '',","     *          modules: {","     *              //Module List here","     *          }","     *      }, 'davglass');","     */","    addGroup: function(o, name) {","        var mods = o.modules,","            self = this, i, v;","","        name = name || o.name;","        o.name = name;","        self.groups[name] = o;","","        if (o.patterns) {","            for (i in o.patterns) {","                if (o.patterns.hasOwnProperty(i)) {","                    o.patterns[i].group = name;","                    self.patterns[i] = o.patterns[i];","                }","            }","        }","","        if (mods) {","            for (i in mods) {","                if (mods.hasOwnProperty(i)) {","                    v = mods[i];","                    if (typeof v === 'string') {","                        v = { name: i, fullpath: v };","                    }","                    v.group = name;","                    self.addModule(v, i);","                }","            }","        }","    },","","    /**","     * Add a new module to the component metadata.","     * @method addModule","     * @param {Object} config An object containing the module data.","     * @param {String} config.name Required, the component name","     * @param {String} config.type Required, the component type (js or css)","     * @param {String} config.path Required, the path to the script from `base`","     * @param {Array} config.requires Array of modules required by this component","     * @param {Array} [config.optional] Array of optional modules for this component","     * @param {Array} [config.supersedes] Array of the modules this component replaces","     * @param {Array} [config.after] Array of modules the components which, if present, should be sorted above this one","     * @param {Object} [config.after_map] Faster alternative to 'after' -- supply a hash instead of an array","     * @param {Number} [config.rollup] The number of superseded modules required for automatic rollup","     * @param {String} [config.fullpath] If `fullpath` is specified, this is used instead of the configured `base + path`","     * @param {Boolean} [config.skinnable] Flag to determine if skin assets should automatically be pulled in","     * @param {Object} [config.submodules] Hash of submodules","     * @param {String} [config.group] The group the module belongs to -- this is set automatically when it is added as part of a group configuration.","     * @param {Array} [config.lang] Array of BCP 47 language tags of languages for which this module has localized resource bundles, e.g., `[\"en-GB\", \"zh-Hans-CN\"]`","     * @param {Object} [config.condition] Specifies that the module should be loaded automatically if a condition is met.  This is an object with up to three fields:","     * @param {String} [config.condition.trigger] The name of a module that can trigger the auto-load","     * @param {Function} [config.condition.test] A function that returns true when the module is to be loaded.","     * @param {String} [config.condition.when] Specifies the load order of the conditional module","     *  with regard to the position of the trigger module.","     *  This should be one of three values: `before`, `after`, or `instead`.  The default is `after`.","     * @param {Object} [config.testresults] A hash of test results from `Y.Features.all()`","     * @param {Function} [config.configFn] A function to exectute when configuring this module","     * @param {Object} config.configFn.mod The module config, modifying this object will modify it's config. Returning false will delete the module's config.","     * @param {String} [name] The module name, required if not in the module data.","     * @return {Object} the module definition or null if the object passed in did not provide all required attributes.","     */","    addModule: function(o, name) {","        name = name || o.name;","","        if (typeof o === 'string') {","            o = { name: name, fullpath: o };","        }","        ","        //Only merge this data if the temp flag is set","        //from an earlier pass from a pattern or else","        //an override module (YUI_config) can not be used to","        //replace a default module.","        if (this.moduleInfo[name] && this.moduleInfo[name].temp) {","            //This catches temp modules loaded via a pattern","            // The module will be added twice, once from the pattern and","            // Once from the actual add call, this ensures that properties","            // that were added to the module the first time around (group: gallery)","            // are also added the second time around too.","            o = Y.merge(this.moduleInfo[name], o);","        }","","        o.name = name;","","        if (!o || !o.name) {","            return null;","        }","","        if (!o.type) {","            //Always assume it's javascript unless the CSS pattern is matched.","            o.type = JS;","            var p = o.path || o.fullpath;","            if (p && this.REGEX_CSS.test(p)) {","                o.type = CSS;","            }","        }","","        if (!o.path && !o.fullpath) {","            o.path = _path(name, name, o.type);","        }","        o.supersedes = o.supersedes || o.use;","","        o.ext = ('ext' in o) ? o.ext : (this._internal) ? false : true;","","        // Handle submodule logic","        var subs = o.submodules, i, l, t, sup, s, smod, plugins, plug,","            j, langs, packName, supName, flatSup, flatLang, lang, ret,","            overrides, skinname, when, g,","            conditions = this.conditions, trigger;","            // , existing = this.moduleInfo[name], newr;","        ","        this.moduleInfo[name] = o;","","        o.requires = o.requires || [];","        ","        /*","        Only allowing the cascade of requires information, since","        optional and supersedes are far more fine grained than","        a blanket requires is.","        */","        if (this.requires) {","            for (i = 0; i < this.requires.length; i++) {","                o.requires.push(this.requires[i]);","            }","        }","        if (o.group && this.groups && this.groups[o.group]) {","            g = this.groups[o.group];","            if (g.requires) {","                for (i = 0; i < g.requires.length; i++) {","                    o.requires.push(g.requires[i]);","                }","            }","        }","","","        if (!o.defaults) {","            o.defaults = {","                requires: o.requires ? [].concat(o.requires) : null,","                supersedes: o.supersedes ? [].concat(o.supersedes) : null,","                optional: o.optional ? [].concat(o.optional) : null","            };","        }","","        if (o.skinnable && o.ext && o.temp) {","            skinname = this._addSkin(this.skin.defaultSkin, name);","            o.requires.unshift(skinname);","        }","        ","        if (o.requires.length) {","            o.requires = this.filterRequires(o.requires) || [];","        }","","        if (!o.langPack && o.lang) {","            langs = YArray(o.lang);","            for (j = 0; j < langs.length; j++) {","                lang = langs[j];","                packName = this.getLangPackName(lang, name);","                smod = this.moduleInfo[packName];","                if (!smod) {","                    smod = this._addLangPack(lang, o, packName);","                }","            }","        }","","","        if (subs) {","            sup = o.supersedes || [];","            l = 0;","","            for (i in subs) {","                if (subs.hasOwnProperty(i)) {","                    s = subs[i];","","                    s.path = s.path || _path(name, i, o.type);","                    s.pkg = name;","                    s.group = o.group;","","                    if (s.supersedes) {","                        sup = sup.concat(s.supersedes);","                    }","","                    smod = this.addModule(s, i);","                    sup.push(i);","","                    if (smod.skinnable) {","                        o.skinnable = true;","                        overrides = this.skin.overrides;","                        if (overrides && overrides[i]) {","                            for (j = 0; j < overrides[i].length; j++) {","                                skinname = this._addSkin(overrides[i][j],","                                         i, name);","                                sup.push(skinname);","                            }","                        }","                        skinname = this._addSkin(this.skin.defaultSkin,","                                        i, name);","                        sup.push(skinname);","                    }","","                    // looks like we are expected to work out the metadata","                    // for the parent module language packs from what is","                    // specified in the child modules.","                    if (s.lang && s.lang.length) {","","                        langs = YArray(s.lang);","                        for (j = 0; j < langs.length; j++) {","                            lang = langs[j];","                            packName = this.getLangPackName(lang, name);","                            supName = this.getLangPackName(lang, i);","                            smod = this.moduleInfo[packName];","","                            if (!smod) {","                                smod = this._addLangPack(lang, o, packName);","                            }","","                            flatSup = flatSup || YArray.hash(smod.supersedes);","","                            if (!(supName in flatSup)) {","                                smod.supersedes.push(supName);","                            }","","                            o.lang = o.lang || [];","","                            flatLang = flatLang || YArray.hash(o.lang);","","                            if (!(lang in flatLang)) {","                                o.lang.push(lang);","                            }","","// Add rollup file, need to add to supersedes list too","","                            // default packages","                            packName = this.getLangPackName(ROOT_LANG, name);","                            supName = this.getLangPackName(ROOT_LANG, i);","","                            smod = this.moduleInfo[packName];","","                            if (!smod) {","                                smod = this._addLangPack(lang, o, packName);","                            }","","                            if (!(supName in flatSup)) {","                                smod.supersedes.push(supName);","                            }","","// Add rollup file, need to add to supersedes list too","","                        }","                    }","","                    l++;","                }","            }","            //o.supersedes = YObject.keys(YArray.hash(sup));","            o.supersedes = YArray.dedupe(sup);","            if (this.allowRollup) {","                o.rollup = (l < 4) ? l : Math.min(l - 1, 4);","            }","        }","","        plugins = o.plugins;","        if (plugins) {","            for (i in plugins) {","                if (plugins.hasOwnProperty(i)) {","                    plug = plugins[i];","                    plug.pkg = name;","                    plug.path = plug.path || _path(name, i, o.type);","                    plug.requires = plug.requires || [];","                    plug.group = o.group;","                    this.addModule(plug, i);","                    if (o.skinnable) {","                        this._addSkin(this.skin.defaultSkin, i, name);","                    }","","                }","            }","        }","","        if (o.condition) {","            t = o.condition.trigger;","            if (YUI.Env.aliases[t]) {","                t = YUI.Env.aliases[t];","            }","            if (!Y.Lang.isArray(t)) {","                t = [t];","            }","","            for (i = 0; i < t.length; i++) {","                trigger = t[i];","                when = o.condition.when;","                conditions[trigger] = conditions[trigger] || {};","                conditions[trigger][name] = o.condition;","                // the 'when' attribute can be 'before', 'after', or 'instead'","                // the default is after.","                if (when && when != 'after') {","                    if (when == 'instead') { // replace the trigger","                        o.supersedes = o.supersedes || [];","                        o.supersedes.push(trigger);","                    } else { // before the trigger","                        // the trigger requires the conditional mod,","                        // so it should appear before the conditional","                        // mod if we do not intersede.","                    }","                } else { // after the trigger","                    o.after = o.after || [];","                    o.after.push(trigger);","                }","            }","        }","","        if (o.supersedes) {","            o.supersedes = this.filterRequires(o.supersedes);","        }","","        if (o.after) {","            o.after = this.filterRequires(o.after);","            o.after_map = YArray.hash(o.after);","        }","","        // this.dirty = true;","","        if (o.configFn) {","            ret = o.configFn(o);","            if (ret === false) {","                delete this.moduleInfo[name];","                delete GLOBAL_ENV._renderedMods[name];","                o = null;","            }","        }","        //Add to global cache","        if (o) {","            if (!GLOBAL_ENV._renderedMods) {","                GLOBAL_ENV._renderedMods = {};","            }","            GLOBAL_ENV._renderedMods[name] = Y.mix(GLOBAL_ENV._renderedMods[name] || {}, o);","            GLOBAL_ENV._conditions = conditions;","        }","","        return o;","    },","","    /**","     * Add a requirement for one or more module","     * @method require","     * @param {string[] | string*} what the modules to load.","     */","    require: function(what) {","        var a = (typeof what === 'string') ? YArray(arguments) : what;","        this.dirty = true;","        this.required = Y.merge(this.required, YArray.hash(this.filterRequires(a)));","","        this._explodeRollups();","    },","    /**","    * Grab all the items that were asked for, check to see if the Loader","    * meta-data contains a \"use\" array. If it doesm remove the asked item and replace it with ","    * the content of the \"use\".","    * This will make asking for: \"dd\"","    * Actually ask for: \"dd-ddm-base,dd-ddm,dd-ddm-drop,dd-drag,dd-proxy,dd-constrain,dd-drop,dd-scroll,dd-drop-plugin\"","    * @private","    * @method _explodeRollups","    */","    _explodeRollups: function() {","        var self = this, m, i, a, v, len, len2,","        r = self.required;","","        if (!self.allowRollup) {","            for (i in r) {","                if (r.hasOwnProperty(i)) {","                    m = self.getModule(i);","                    if (m && m.use) {","                        len = m.use.length;","                        for (a = 0; a < len; a++) {","                            m = self.getModule(m.use[a]);","                            if (m && m.use) {","                                len2 = m.use.length;","                                for (v = 0; v < len2; v++) {","                                    r[m.use[v]] = true;","                                }","                            } else {","                                r[m.use[a]] = true;","                            }","                        }","                    }","                }","            }","            self.required = r;","        }","","    },","    /**","    * Explodes the required array to remove aliases and replace them with real modules","    * @method filterRequires","    * @param {Array} r The original requires array","    * @return {Array} The new array of exploded requirements","    */","    filterRequires: function(r) {","        if (r) {","            if (!Y.Lang.isArray(r)) {","                r = [r];","            }","            r = Y.Array(r);","            var c = [], i, mod, o, m;","","            for (i = 0; i < r.length; i++) {","                mod = this.getModule(r[i]);","                if (mod && mod.use) {","                    for (o = 0; o < mod.use.length; o++) {","                        //Must walk the other modules in case a module is a rollup of rollups (datatype)","                        m = this.getModule(mod.use[o]);","                        if (m && m.use) {","                            c = Y.Array.dedupe([].concat(c, this.filterRequires(m.use)));","                        } else {","                            c.push(mod.use[o]);","                        }","                    }","                } else {","                    c.push(r[i]);","                }","            }","            r = c;","        }","        return r;","    },","    /**","     * Returns an object containing properties for all modules required","     * in order to load the requested module","     * @method getRequires","     * @param {object}  mod The module definition from moduleInfo.","     * @return {array} the expanded requirement list.","     */","    getRequires: function(mod) {","","        if (!mod) {","            //console.log('returning no reqs for ' + mod.name);","            return NO_REQUIREMENTS;","        }","","        if (mod._parsed) {","            //console.log('returning requires for ' + mod.name, mod.requires);","            return mod.expanded || NO_REQUIREMENTS;","        }","","        //TODO add modue cache here out of scope..","","        var i, m, j, add, packName, lang, testresults = this.testresults,","            name = mod.name, cond,","            adddef = ON_PAGE[name] && ON_PAGE[name].details,","            d, k, m1, go, def,","            r, old_mod,","            o, skinmod, skindef, skinpar, skinname,","            intl = mod.lang || mod.intl,","            info = this.moduleInfo,","            ftests = Y.Features && Y.Features.tests.load,","            hash, reparse;","","        // console.log(name);","","        // pattern match leaves module stub that needs to be filled out","        if (mod.temp && adddef) {","            old_mod = mod;","            mod = this.addModule(adddef, name);","            mod.group = old_mod.group;","            mod.pkg = old_mod.pkg;","            delete mod.expanded;","        }","","        // console.log('cache: ' + mod.langCache + ' == ' + this.lang);","        ","        //If a skin or a lang is different, reparse..","        reparse = !((!this.lang || mod.langCache === this.lang) && (mod.skinCache === this.skin.defaultSkin));","","        if (mod.expanded && !reparse) {","            return mod.expanded;","        }","        ","","        d = [];","        hash = {};","        r = this.filterRequires(mod.requires);","        if (mod.lang) {","            //If a module has a lang attribute, auto add the intl requirement.","            d.unshift('intl');","            r.unshift('intl');","            intl = true;","        }","        o = this.filterRequires(mod.optional);","","","        mod._parsed = true;","        mod.langCache = this.lang;","        mod.skinCache = this.skin.defaultSkin;","","        for (i = 0; i < r.length; i++) {","            if (!hash[r[i]]) {","                d.push(r[i]);","                hash[r[i]] = true;","                m = this.getModule(r[i]);","                if (m) {","                    add = this.getRequires(m);","                    intl = intl || (m.expanded_map &&","                        (INTL in m.expanded_map));","                    for (j = 0; j < add.length; j++) {","                        d.push(add[j]);","                    }","                }","            }","        }","","        // get the requirements from superseded modules, if any","        r = this.filterRequires(mod.supersedes);","        if (r) {","            for (i = 0; i < r.length; i++) {","                if (!hash[r[i]]) {","                    // if this module has submodules, the requirements list is","                    // expanded to include the submodules.  This is so we can","                    // prevent dups when a submodule is already loaded and the","                    // parent is requested.","                    if (mod.submodules) {","                        d.push(r[i]);","                    }","","                    hash[r[i]] = true;","                    m = this.getModule(r[i]);","","                    if (m) {","                        add = this.getRequires(m);","                        intl = intl || (m.expanded_map &&","                            (INTL in m.expanded_map));","                        for (j = 0; j < add.length; j++) {","                            d.push(add[j]);","                        }","                    }","                }","            }","        }","","        if (o && this.loadOptional) {","            for (i = 0; i < o.length; i++) {","                if (!hash[o[i]]) {","                    d.push(o[i]);","                    hash[o[i]] = true;","                    m = info[o[i]];","                    if (m) {","                        add = this.getRequires(m);","                        intl = intl || (m.expanded_map &&","                            (INTL in m.expanded_map));","                        for (j = 0; j < add.length; j++) {","                            d.push(add[j]);","                        }","                    }","                }","            }","        }","","        cond = this.conditions[name];","","        if (cond) {","            //Set the module to not parsed since we have conditionals and this could change the dependency tree.","            mod._parsed = false;","            if (testresults && ftests) {","                oeach(testresults, function(result, id) {","                    var condmod = ftests[id].name;","                    if (!hash[condmod] && ftests[id].trigger == name) {","                        if (result && ftests[id]) {","                            hash[condmod] = true;","                            d.push(condmod);","                        }","                    }","                });","            } else {","                for (i in cond) {","                    if (cond.hasOwnProperty(i)) {","                        if (!hash[i]) {","                            def = cond[i];","                            //first see if they've specfied a ua check","                            //then see if they've got a test fn & if it returns true","                            //otherwise just having a condition block is enough","                            go = def && ((!def.ua && !def.test) || (def.ua && Y.UA[def.ua]) ||","                                        (def.test && def.test(Y, r)));","","                            if (go) {","                                hash[i] = true;","                                d.push(i);","                                m = this.getModule(i);","                                if (m) {","                                    add = this.getRequires(m);","                                    for (j = 0; j < add.length; j++) {","                                        d.push(add[j]);","                                    }","","                                }","                            }","                        }","                    }","                }","            }","        }","","        // Create skin modules","        if (mod.skinnable) {","            skindef = this.skin.overrides;","            for (i in YUI.Env.aliases) {","                if (YUI.Env.aliases.hasOwnProperty(i)) {","                    if (Y.Array.indexOf(YUI.Env.aliases[i], name) > -1) {","                        skinpar = i;","                    }","                }","            }","            if (skindef && (skindef[name] || (skinpar && skindef[skinpar]))) {","                skinname = name;","                if (skindef[skinpar]) {","                    skinname = skinpar;","                }","                for (i = 0; i < skindef[skinname].length; i++) {","                    skinmod = this._addSkin(skindef[skinname][i], name);","                    if (!this.isCSSLoaded(skinmod, this._boot)) {","                        d.push(skinmod);","                    }","                }","            } else {","                skinmod = this._addSkin(this.skin.defaultSkin, name);","                if (!this.isCSSLoaded(skinmod, this._boot)) {","                    d.push(skinmod);","                }","            }","        }","","        mod._parsed = false;","","        if (intl) {","","            if (mod.lang && !mod.langPack && Y.Intl) {","                lang = Y.Intl.lookupBestLang(this.lang || ROOT_LANG, mod.lang);","                packName = this.getLangPackName(lang, name);","                if (packName) {","                    d.unshift(packName);","                }","            }","            d.unshift(INTL);","        }","","        mod.expanded_map = YArray.hash(d);","","        mod.expanded = YObject.keys(mod.expanded_map);","","        return mod.expanded;","    },","    /**","    * Check to see if named css module is already loaded on the page","    * @method isCSSLoaded","    * @param {String} name The name of the css file","    * @return Boolean","    */","    isCSSLoaded: function(name, skip) {","        //TODO - Make this call a batching call with name being an array","        if (!name || !YUI.Env.cssStampEl || (!skip && this.ignoreRegistered)) {","            return false;","        }","        var el = YUI.Env.cssStampEl,","            ret = false,","            mod = YUI.Env._cssLoaded[name],","            style = el.currentStyle; //IE","","        ","        if (mod !== undefined) {","            return mod;","        }","","        //Add the classname to the element","        el.className = name;","","        if (!style) {","            style = Y.config.doc.defaultView.getComputedStyle(el, null);","        }","","        if (style && style.display === 'none') {","            ret = true;","        }","","","        el.className = ''; //Reset the classname to ''","","        YUI.Env._cssLoaded[name] = ret;","","        return ret;","    },","","    /**","     * Returns a hash of module names the supplied module satisfies.","     * @method getProvides","     * @param {string} name The name of the module.","     * @return {object} what this module provides.","     */","    getProvides: function(name) {","        var m = this.getModule(name), o, s;","            // supmap = this.provides;","","        if (!m) {","            return NOT_FOUND;","        }","","        if (m && !m.provides) {","            o = {};","            s = m.supersedes;","","            if (s) {","                YArray.each(s, function(v) {","                    Y.mix(o, this.getProvides(v));","                }, this);","            }","","            o[name] = true;","            m.provides = o;","","        }","","        return m.provides;","    },","","    /**","     * Calculates the dependency tree, the result is stored in the sorted","     * property.","     * @method calculate","     * @param {object} o optional options object.","     * @param {string} type optional argument to prune modules.","     */","    calculate: function(o, type) {","        if (o || type || this.dirty) {","","            if (o) {","                this._config(o);","            }","","            if (!this._init) {","                this._setup();","            }","","            this._explode();","","            if (this.allowRollup) {","                this._rollup();","            } else {","                this._explodeRollups();","            }","            this._reduce();","            this._sort();","        }","    },","    /**","    * Creates a \"psuedo\" package for languages provided in the lang array","    * @method _addLangPack","    * @private","    * @param {String} lang The language to create","    * @param {Object} m The module definition to create the language pack around","    * @param {String} packName The name of the package (e.g: lang/datatype-date-en-US)","    * @return {Object} The module definition","    */","    _addLangPack: function(lang, m, packName) {","        var name = m.name,","            packPath, conf,","            existing = this.moduleInfo[packName];","","        if (!existing) {","","            packPath = _path((m.pkg || name), packName, JS, true);","","            conf = {","                path: packPath,","                intl: true,","                langPack: true,","                ext: m.ext,","                group: m.group,","                supersedes: []","            };","            if (m.root) {","                conf.root = m.root;","            }","            if (m.base) {","                conf.base = m.base;","            }","","            if (m.configFn) {","                conf.configFn = m.configFn;","            }","","            this.addModule(conf, packName);","","            if (lang) {","                Y.Env.lang = Y.Env.lang || {};","                Y.Env.lang[lang] = Y.Env.lang[lang] || {};","                Y.Env.lang[lang][name] = true;","            }","        }","","        return this.moduleInfo[packName];","    },","","    /**","     * Investigates the current YUI configuration on the page.  By default,","     * modules already detected will not be loaded again unless a force","     * option is encountered.  Called by calculate()","     * @method _setup","     * @private","     */","    _setup: function() {","        var info = this.moduleInfo, name, i, j, m, l,","            packName;","","        for (name in info) {","            if (info.hasOwnProperty(name)) {","                m = info[name];","                if (m) {","","                    // remove dups","                    //m.requires = YObject.keys(YArray.hash(m.requires));","                    m.requires = YArray.dedupe(m.requires);","","                    // Create lang pack modules","                    //if (m.lang && m.lang.length) {","                    if (m.lang) {","                        // Setup root package if the module has lang defined,","                        // it needs to provide a root language pack","                        packName = this.getLangPackName(ROOT_LANG, name);","                        this._addLangPack(null, m, packName);","                    }","","                }","            }","        }","","","        //l = Y.merge(this.inserted);","        l = {};","","        // available modules","        if (!this.ignoreRegistered) {","            Y.mix(l, GLOBAL_ENV.mods);","        }","","        // add the ignore list to the list of loaded packages","        if (this.ignore) {","            Y.mix(l, YArray.hash(this.ignore));","        }","","        // expand the list to include superseded modules","        for (j in l) {","            if (l.hasOwnProperty(j)) {","                Y.mix(l, this.getProvides(j));","            }","        }","","        // remove modules on the force list from the loaded list","        if (this.force) {","            for (i = 0; i < this.force.length; i++) {","                if (this.force[i] in l) {","                    delete l[this.force[i]];","                }","            }","        }","","        Y.mix(this.loaded, l);","","        this._init = true;","    },","","    /**","     * Builds a module name for a language pack","     * @method getLangPackName","     * @param {string} lang the language code.","     * @param {string} mname the module to build it for.","     * @return {string} the language pack module name.","     */","    getLangPackName: function(lang, mname) {","        return ('lang/' + mname + ((lang) ? '_' + lang : ''));","    },","    /**","     * Inspects the required modules list looking for additional","     * dependencies.  Expands the required list to include all","     * required modules.  Called by calculate()","     * @method _explode","     * @private","     */","    _explode: function() {","        //TODO Move done out of scope","        var r = this.required, m, reqs, done = {},","            self = this, name;","","        // the setup phase is over, all modules have been created","        self.dirty = false;","","        self._explodeRollups();","        r = self.required;","       ","        for (name in r) {","            if (r.hasOwnProperty(name)) {","                if (!done[name]) {","                    done[name] = true;","                    m = self.getModule(name);","                    if (m) {","                        var expound = m.expound;","","                        if (expound) {","                            r[expound] = self.getModule(expound);","                            reqs = self.getRequires(r[expound]);","                            Y.mix(r, YArray.hash(reqs));","                        }","","                        reqs = self.getRequires(m);","                        Y.mix(r, YArray.hash(reqs));","                    }","                }","            }","        }","","    },","    /**","    * The default method used to test a module against a pattern","    * @method _patternTest","    * @private","    * @param {String} mname The module being tested","    * @param {String} pname The pattern to match","    */","    _patternTest: function(mname, pname) {","        return (mname.indexOf(pname) > -1);","    },","    /**","    * Get's the loader meta data for the requested module","    * @method getModule","    * @param {String} mname The module name to get","    * @return {Object} The module metadata","    */","    getModule: function(mname) {","        //TODO: Remove name check - it's a quick hack to fix pattern WIP","        if (!mname) {","            return null;","        }","","        var p, found, pname,","            m = this.moduleInfo[mname],","            patterns = this.patterns;","","        // check the patterns library to see if we should automatically add","        // the module with defaults","        if (!m || (m && m.ext)) {","            for (pname in patterns) {","                if (patterns.hasOwnProperty(pname)) {","                    p = patterns[pname];","                    ","                    //There is no test method, create a default one that tests","                    // the pattern against the mod name","                    if (!p.test) {","                        p.test = this._patternTest;","                    }","","                    if (p.test(mname, pname)) {","                        // use the metadata supplied for the pattern","                        // as the module definition.","                        found = p;","                        break;","                    }","                }","            }","        }","","        if (!m) {","            if (found) {","                if (p.action) {","                    p.action.call(this, mname, pname);","                } else {","                    // ext true or false?","                    m = this.addModule(Y.merge(found), mname);","                    if (found.configFn) {","                        m.configFn = found.configFn;","                    }","                    m.temp = true;","                }","            }","        } else {","            if (found && m && found.configFn && !m.configFn) {","                m.configFn = found.configFn;","                m.configFn(m);","            }","        }","","        return m;","    },","","    // impl in rollup submodule","    _rollup: function() { },","","    /**","     * Remove superceded modules and loaded modules.  Called by","     * calculate() after we have the mega list of all dependencies","     * @method _reduce","     * @return {object} the reduced dependency hash.","     * @private","     */","    _reduce: function(r) {","","        r = r || this.required;","","        var i, j, s, m, type = this.loadType,","        ignore = this.ignore ? YArray.hash(this.ignore) : false;","","        for (i in r) {","            if (r.hasOwnProperty(i)) {","                m = this.getModule(i);","                // remove if already loaded","                if (((this.loaded[i] || ON_PAGE[i]) &&","                        !this.forceMap[i] && !this.ignoreRegistered) ||","                        (type && m && m.type != type)) {","                    delete r[i];","                }","                if (ignore && ignore[i]) {","                    delete r[i];","                }","                // remove anything this module supersedes","                s = m && m.supersedes;","                if (s) {","                    for (j = 0; j < s.length; j++) {","                        if (s[j] in r) {","                            delete r[s[j]];","                        }","                    }","                }","            }","        }","","        return r;","    },","    /**","    * Handles the queue when a module has been loaded for all cases","    * @method _finish","    * @private","    * @param {String} msg The message from Loader","    * @param {Boolean} success A boolean denoting success or failure","    */","    _finish: function(msg, success) {","","        _queue.running = false;","","        var onEnd = this.onEnd;","        if (onEnd) {","            onEnd.call(this.context, {","                msg: msg,","                data: this.data,","                success: success","            });","        }","        this._continue();","    },","    /**","    * The default Loader onSuccess handler, calls this.onSuccess with a payload","    * @method _onSuccess","    * @private","    */","    _onSuccess: function() {","        var self = this, skipped = Y.merge(self.skipped), fn,","            failed = [], rreg = self.requireRegistration,","            success, msg, i, mod;","        ","        for (i in skipped) {","            if (skipped.hasOwnProperty(i)) {","                delete self.inserted[i];","            }","        }","","        self.skipped = {};","        ","        for (i in self.inserted) {","            if (self.inserted.hasOwnProperty(i)) {","                mod = self.getModule(i);","                if (mod && rreg && mod.type == JS && !(i in YUI.Env.mods)) {","                    failed.push(i);","                } else {","                    Y.mix(self.loaded, self.getProvides(i));","                }","            }","        }","","        fn = self.onSuccess;","        msg = (failed.length) ? 'notregistered' : 'success';","        success = !(failed.length);","        if (fn) {","            fn.call(self.context, {","                msg: msg,","                data: self.data,","                success: success,","                failed: failed,","                skipped: skipped","            });","        }","        self._finish(msg, success);","    },","    /**","    * The default Loader onProgress handler, calls this.onProgress with a payload","    * @method _onProgress","    * @private","    */","    _onProgress: function(e) {","        var self = this;","        if (self.onProgress) {","            self.onProgress.call(self.context, {","                name: e.url,","                data: e.data","            });","        }","    },","    /**","    * The default Loader onFailure handler, calls this.onFailure with a payload","    * @method _onFailure","    * @private","    */","    _onFailure: function(o) {","        var f = this.onFailure, msg = [], i = 0, len = o.errors.length;","        ","        for (i; i < len; i++) {","            msg.push(o.errors[i].error);","        }","","        msg = msg.join(',');","","        ","        if (f) {","            f.call(this.context, {","                msg: msg,","                data: this.data,","                success: false","            });","        }","        ","        this._finish(msg, false);","","    },","","    /**","    * The default Loader onTimeout handler, calls this.onTimeout with a payload","    * @method _onTimeout","    * @private","    */","    _onTimeout: function() {","        var f = this.onTimeout;","        if (f) {","            f.call(this.context, {","                msg: 'timeout',","                data: this.data,","                success: false","            });","        }","    },","","    /**","     * Sorts the dependency tree.  The last step of calculate()","     * @method _sort","     * @private","     */","    _sort: function() {","","        // create an indexed list","        var s = YObject.keys(this.required),","            // loaded = this.loaded,","            //TODO Move this out of scope","            done = {},","            p = 0, l, a, b, j, k, moved, doneKey;","","        // keep going until we make a pass without moving anything","        for (;;) {","","            l = s.length;","            moved = false;","","            // start the loop after items that are already sorted","            for (j = p; j < l; j++) {","","                // check the next module on the list to see if its","                // dependencies have been met","                a = s[j];","","                // check everything below current item and move if we","                // find a requirement for the current item","                for (k = j + 1; k < l; k++) {","                    doneKey = a + s[k];","","                    if (!done[doneKey] && this._requires(a, s[k])) {","","                        // extract the dependency so we can move it up","                        b = s.splice(k, 1);","","                        // insert the dependency above the item that","                        // requires it","                        s.splice(j, 0, b[0]);","","                        // only swap two dependencies once to short circut","                        // circular dependencies","                        done[doneKey] = true;","","                        // keep working","                        moved = true;","","                        break;","                    }","                }","","                // jump out of loop if we moved something","                if (moved) {","                    break;","                // this item is sorted, move our pointer and keep going","                } else {","                    p++;","                }","            }","","            // when we make it here and moved is false, we are","            // finished sorting","            if (!moved) {","                break;","            }","","        }","","        this.sorted = s;","    },","","    /**","    * Handles the actual insertion of script/link tags","    * @method _insert","    * @private","    * @param {Object} source The YUI instance the request came from","    * @param {Object} o The metadata to include","    * @param {String} type JS or CSS","    * @param {Boolean} [skipcalc=false] Do a Loader.calculate on the meta","    */","    _insert: function(source, o, type, skipcalc) {","","","        // restore the state at the time of the request","        if (source) {","            this._config(source);","        }","","        // build the dependency list","        // don't include type so we can process CSS and script in","        // one pass when the type is not specified.","        if (!skipcalc) {","            //this.calculate(o);","        }","","        var modules = this.resolve(!skipcalc),","            self = this, comp = 0, actions = 0;","","        if (type) {","            //Filter out the opposite type and reset the array so the checks later work","            modules[((type === JS) ? CSS : JS)] = [];","        }","        if (modules.js.length) {","            comp++;","        }","        if (modules.css.length) {","            comp++;","        }","","        //console.log('Resolved Modules: ', modules);","","        var complete = function(d) {","            actions++;","            var errs = {}, i = 0, u = '', fn;","","            if (d && d.errors) {","                for (i = 0; i < d.errors.length; i++) {","                    if (d.errors[i].request) {","                        u = d.errors[i].request.url;","                    } else {","                        u = d.errors[i];","                    }","                    errs[u] = u;","                }","            }","            ","            if (d && d.data && d.data.length && (d.type === 'success')) {","                for (i = 0; i < d.data.length; i++) {","                    self.inserted[d.data[i].name] = true;","                }","            }","","            if (actions === comp) {","                self._loading = null;","                if (d && d.fn) {","                    fn = d.fn;","                    delete d.fn;","                    fn.call(self, d);","                }","            }","        };","","        this._loading = true;","","        if (!modules.js.length && !modules.css.length) {","            actions = -1;","            complete({","                fn: self._onSuccess","            });","            return;","        }","        ","","        if (modules.css.length) { //Load CSS first","            Y.Get.css(modules.css, {","                data: modules.cssMods,","                attributes: self.cssAttributes,","                insertBefore: self.insertBefore,","                charset: self.charset,","                timeout: self.timeout,","                context: self,","                onProgress: function(e) {","                    self._onProgress.call(self, e);","                },","                onTimeout: function(d) {","                    self._onTimeout.call(self, d);","                },","                onSuccess: function(d) {","                    d.type = 'success';","                    d.fn = self._onSuccess;","                    complete.call(self, d);","                },","                onFailure: function(d) {","                    d.type = 'failure';","                    d.fn = self._onFailure;","                    complete.call(self, d);","                }","            });","        }","","        if (modules.js.length) {","            Y.Get.js(modules.js, {","                data: modules.jsMods,","                insertBefore: self.insertBefore,","                attributes: self.jsAttributes,","                charset: self.charset,","                timeout: self.timeout,","                autopurge: false,","                context: self,","                async: self.async,","                onProgress: function(e) {","                    self._onProgress.call(self, e);","                },","                onTimeout: function(d) {","                    self._onTimeout.call(self, d);","                },","                onSuccess: function(d) {","                    d.type = 'success';","                    d.fn = self._onSuccess;","                    complete.call(self, d);","                },","                onFailure: function(d) {","                    d.type = 'failure';","                    d.fn = self._onFailure;","                    complete.call(self, d);","                }","            });","        }","    },","    /**","    * Once a loader operation is completely finished, process any additional queued items.","    * @method _continue","    * @private","    */","    _continue: function() {","        if (!(_queue.running) && _queue.size() > 0) {","            _queue.running = true;","            _queue.next()();","        }","    },","","    /**","     * inserts the requested modules and their dependencies.","     * <code>type</code> can be \"js\" or \"css\".  Both script and","     * css are inserted if type is not provided.","     * @method insert","     * @param {object} o optional options object.","     * @param {string} type the type of dependency to insert.","     */","    insert: function(o, type, skipsort) {","        var self = this, copy = Y.merge(this);","        delete copy.require;","        delete copy.dirty;","        _queue.add(function() {","            self._insert(copy, o, type, skipsort);","        });","        this._continue();","    },","","    /**","     * Executed every time a module is loaded, and if we are in a load","     * cycle, we attempt to load the next script.  Public so that it","     * is possible to call this if using a method other than","     * Y.register to determine when scripts are fully loaded","     * @method loadNext","     * @deprecated","     * @param {string} mname optional the name of the module that has","     * been loaded (which is usually why it is time to load the next","     * one).","     */","    loadNext: function(mname) {","        return;","    },","","    /**","     * Apply filter defined for this instance to a url/path","     * @method _filter","     * @param {string} u the string to filter.","     * @param {string} name the name of the module, if we are processing","     * a single module as opposed to a combined url.","     * @return {string} the filtered string.","     * @private","     */","    _filter: function(u, name, group) {","        var f = this.filter,","            hasFilter = name && (name in this.filters),","            modFilter = hasFilter && this.filters[name],","            groupName = group || (this.moduleInfo[name] ? this.moduleInfo[name].group : null);","","        if (groupName && this.groups[groupName] && this.groups[groupName].filter) {","            modFilter = this.groups[groupName].filter;","            hasFilter = true;","        }","","        if (u) {","            if (hasFilter) {","                f = (L.isString(modFilter)) ? this.FILTER_DEFS[modFilter.toUpperCase()] || null : modFilter;","            }","            if (f) {","                u = u.replace(new RegExp(f.searchExp, 'g'), f.replaceStr);","            }","        }","        return u;","    },","","    /**","     * Generates the full url for a module","     * @method _url","     * @param {string} path the path fragment.","     * @param {String} name The name of the module","     * @param {String} [base=self.base] The base url to use","     * @return {string} the full url.","     * @private","     */","    _url: function(path, name, base) {","        return this._filter((base || this.base || '') + path, name);","    },","    /**","    * Returns an Object hash of file arrays built from `loader.sorted` or from an arbitrary list of sorted modules.","    * @method resolve","    * @param {Boolean} [calc=false] Perform a loader.calculate() before anything else","    * @param {Array} [s=loader.sorted] An override for the loader.sorted array","    * @return {Object} Object hash (js and css) of two arrays of file lists","    * @example This method can be used as an off-line dep calculator","    *","    *        var Y = YUI();","    *        var loader = new Y.Loader({","    *            filter: 'debug',","    *            base: '../../',","    *            root: 'build/',","    *            combine: true,","    *            require: ['node', 'dd', 'console']","    *        });","    *        var out = loader.resolve(true);","    *","    */","    resolve: function(calc, s) {","","        var len, i, m, url, fn, msg, attr, group, groupName, j, frag,","            comboSource, comboSources, mods, comboBase,","            base, urls, u = [], tmpBase, baseLen, resCombos = {},","            self = this, comboSep, maxURLLength, singles = [],","            inserted = (self.ignoreRegistered) ? {} : self.inserted,","            resolved = { js: [], jsMods: [], css: [], cssMods: [] },","            type = self.loadType || 'js';","","        if (self.skin.overrides || self.skin.defaultSkin !== DEFAULT_SKIN || self.ignoreRegistered) { ","            self._resetModules();","        }","","        if (calc) {","            self.calculate();","        }","        s = s || self.sorted;","","        var addSingle = function(m) {","            ","            if (m) {","                group = (m.group && self.groups[m.group]) || NOT_FOUND;","                ","                //Always assume it's async","                if (group.async === false) {","                    m.async = group.async;","                }","","                url = (m.fullpath) ? self._filter(m.fullpath, s[i]) :","                      self._url(m.path, s[i], group.base || m.base);","                ","                if (m.attributes || m.async === false) {","                    url = {","                        url: url,","                        async: m.async","                    };","                    if (m.attributes) {","                        url.attributes = m.attributes;","                    }","                }","                resolved[m.type].push(url);","                resolved[m.type + 'Mods'].push(m);","            } else {","            }","            ","        };","","        len = s.length;","","        // the default combo base","        comboBase = self.comboBase;","","        url = comboBase;","","        comboSources = {};","","        for (i = 0; i < len; i++) {","            comboSource = comboBase;","            m = self.getModule(s[i]);","            groupName = m && m.group;","            group = self.groups[groupName];","            if (groupName && group) {","","                if (!group.combine || m.fullpath) {","                    //This is not a combo module, skip it and load it singly later.","                    //singles.push(s[i]);","                    addSingle(m);","                    continue;","                }","                m.combine = true;","                if (group.comboBase) {","                    comboSource = group.comboBase;","                }","","                if (\"root\" in group && L.isValue(group.root)) {","                    m.root = group.root;","                }","                m.comboSep = group.comboSep || self.comboSep;","                m.maxURLLength = group.maxURLLength || self.maxURLLength;","            } else {","                if (!self.combine) {","                    //This is not a combo module, skip it and load it singly later.","                    //singles.push(s[i]);","                    addSingle(m);","                    continue;","                }","            }","","            comboSources[comboSource] = comboSources[comboSource] || [];","            comboSources[comboSource].push(m);","        }","","        for (j in comboSources) {","            if (comboSources.hasOwnProperty(j)) {","                resCombos[j] = resCombos[j] || { js: [], jsMods: [], css: [], cssMods: [] };","                url = j;","                mods = comboSources[j];","                len = mods.length;","                ","                if (len) {","                    for (i = 0; i < len; i++) {","                        if (inserted[mods[i]]) {","                            continue;","                        }","                        m = mods[i];","                        // Do not try to combine non-yui JS unless combo def","                        // is found","                        if (m && (m.combine || !m.ext)) {","                            resCombos[j].comboSep = m.comboSep;","                            resCombos[j].group = m.group;","                            resCombos[j].maxURLLength = m.maxURLLength;","                            frag = ((L.isValue(m.root)) ? m.root : self.root) + (m.path || m.fullpath);","                            frag = self._filter(frag, m.name);","                            resCombos[j][m.type].push(frag);","                            resCombos[j][m.type + 'Mods'].push(m);","                        } else {","                            //Add them to the next process..","                            if (mods[i]) {","                                //singles.push(mods[i].name);","                                addSingle(mods[i]);","                            }","                        }","","                    }","                }","            }","        }","","","        for (j in resCombos) {","            base = j;","            comboSep = resCombos[base].comboSep || self.comboSep;","            maxURLLength = resCombos[base].maxURLLength || self.maxURLLength;","            for (type in resCombos[base]) {","                if (type === JS || type === CSS) {","                    urls = resCombos[base][type];","                    mods = resCombos[base][type + 'Mods'];","                    len = urls.length;","                    tmpBase = base + urls.join(comboSep);","                    baseLen = tmpBase.length;","                    if (maxURLLength <= base.length) {","                        maxURLLength = MAX_URL_LENGTH;","                    }","                    ","                    if (len) {","                        if (baseLen > maxURLLength) {","                            u = [];","                            for (s = 0; s < len; s++) {","                                u.push(urls[s]);","                                tmpBase = base + u.join(comboSep);","","                                if (tmpBase.length > maxURLLength) {","                                    m = u.pop();","                                    tmpBase = base + u.join(comboSep);","                                    resolved[type].push(self._filter(tmpBase, null, resCombos[base].group));","                                    u = [];","                                    if (m) {","                                        u.push(m);","                                    }","                                }","                            }","                            if (u.length) {","                                tmpBase = base + u.join(comboSep);","                                resolved[type].push(self._filter(tmpBase, null, resCombos[base].group));","                            }","                        } else {","                            resolved[type].push(self._filter(tmpBase, null, resCombos[base].group));","                        }","                    }","                    resolved[type + 'Mods'] = resolved[type + 'Mods'].concat(mods);","                }","            }","        }","","        resCombos = null;","","        return resolved;","    },","    /**","    Shortcut to calculate, resolve and load all modules.","","        var loader = new Y.Loader({","            ignoreRegistered: true,","            modules: {","                mod: {","                    path: 'mod.js'","                }","            },","            requires: [ 'mod' ]","        });","        loader.load(function() {","            console.log('All modules have loaded..');","        });","","","    @method load","    @param {Callback} cb Executed after all load operations are complete","    */","    load: function(cb) {","        if (!cb) {","            return;","        }","        var self = this,","            out = self.resolve(true);","        ","        self.data = out;","","        self.onEnd = function() {","            cb.apply(self.context || self, arguments);","        };","","        self.insert();","    }","};","","","","}, '@VERSION@' ,{requires:['get', 'features']});","YUI.add('loader-rollup', function(Y) {","","/**"," * Optional automatic rollup logic for reducing http connections"," * when not using a combo service."," * @module loader"," * @submodule rollup"," */","","/**"," * Look for rollup packages to determine if all of the modules a"," * rollup supersedes are required.  If so, include the rollup to"," * help reduce the total number of connections required.  Called"," * by calculate().  This is an optional feature, and requires the"," * appropriate submodule to function."," * @method _rollup"," * @for Loader"," * @private"," */","Y.Loader.prototype._rollup = function() {","    var i, j, m, s, r = this.required, roll,","        info = this.moduleInfo, rolled, c, smod;","","    // find and cache rollup modules","    if (this.dirty || !this.rollups) {","        this.rollups = {};","        for (i in info) {","            if (info.hasOwnProperty(i)) {","                m = this.getModule(i);","                // if (m && m.rollup && m.supersedes) {","                if (m && m.rollup) {","                    this.rollups[i] = m;","                }","            }","        }","    }","","    // make as many passes as needed to pick up rollup rollups","    for (;;) {","        rolled = false;","","        // go through the rollup candidates","        for (i in this.rollups) {","            if (this.rollups.hasOwnProperty(i)) {","                // there can be only one, unless forced","                if (!r[i] && ((!this.loaded[i]) || this.forceMap[i])) {","                    m = this.getModule(i);","                    s = m.supersedes || [];","                    roll = false;","","                    // @TODO remove continue","                    if (!m.rollup) {","                        continue;","                    }","","                    c = 0;","","                    // check the threshold","                    for (j = 0; j < s.length; j++) {","                        smod = info[s[j]];","","                        // if the superseded module is loaded, we can't","                        // load the rollup unless it has been forced.","                        if (this.loaded[s[j]] && !this.forceMap[s[j]]) {","                            roll = false;","                            break;","                        // increment the counter if this module is required.","                        // if we are beyond the rollup threshold, we will","                        // use the rollup module","                        } else if (r[s[j]] && m.type == smod.type) {","                            c++;","                            roll = (c >= m.rollup);","                            if (roll) {","                                break;","                            }","                        }","                    }","","                    if (roll) {","                        // add the rollup","                        r[i] = true;","                        rolled = true;","","                        // expand the rollup's dependencies","                        this.getRequires(m);","                    }","                }","            }","        }","","        // if we made it here w/o rolling up something, we are done","        if (!rolled) {","            break;","        }","    }","};","","","}, '@VERSION@' ,{requires:['loader-base']});","YUI.add('loader-yui3', function(Y) {","","/* This file is auto-generated by src/loader/scripts/meta_join.js */","","/**"," * YUI 3 module metadata"," * @module loader"," * @submodule yui3"," */","YUI.Env[Y.version].modules = YUI.Env[Y.version].modules || {","    \"align-plugin\": {","        \"requires\": [","            \"node-screen\",","            \"node-pluginhost\"","        ]","    },","    \"anim\": {","        \"use\": [","            \"anim-base\",","            \"anim-color\",","            \"anim-curve\",","            \"anim-easing\",","            \"anim-node-plugin\",","            \"anim-scroll\",","            \"anim-xy\"","        ]","    },","    \"anim-base\": {","        \"requires\": [","            \"base-base\",","            \"node-style\"","        ]","    },","    \"anim-color\": {","        \"requires\": [","            \"anim-base\"","        ]","    },","    \"anim-curve\": {","        \"requires\": [","            \"anim-xy\"","        ]","    },","    \"anim-easing\": {","        \"requires\": [","            \"anim-base\"","        ]","    },","    \"anim-node-plugin\": {","        \"requires\": [","            \"node-pluginhost\",","            \"anim-base\"","        ]","    },","    \"anim-scroll\": {","        \"requires\": [","            \"anim-base\"","        ]","    },","    \"anim-shape-transform\": {","        \"requires\": [","            \"anim-base\",","            \"anim-easing\",","            \"matrix\"","        ]","    },","    \"anim-xy\": {","        \"requires\": [","            \"anim-base\",","            \"node-screen\"","        ]","    },","    \"app\": {","        \"use\": [","            \"app-base\",","            \"app-transitions\",","            \"lazy-model-list\",","            \"model\",","            \"model-list\",","            \"model-sync-rest\",","            \"router\",","            \"view\",","            \"view-node-map\"","        ]","    },","    \"app-base\": {","        \"requires\": [","            \"classnamemanager\",","            \"pjax-base\",","            \"router\",","            \"view\"","        ]","    },","    \"app-transitions\": {","        \"requires\": [","            \"app-base\"","        ]","    },","    \"app-transitions-css\": {","        \"type\": \"css\"","    },","    \"app-transitions-native\": {","        \"condition\": {","            \"name\": \"app-transitions-native\",","            \"test\": function (Y) {","    var doc  = Y.config.doc,","        node = doc ? doc.documentElement : null;","","    if (node && node.style) {","        return ('MozTransition' in node.style || 'WebkitTransition' in node.style);","    }","","    return false;","},","            \"trigger\": \"app-transitions\"","        },","        \"requires\": [","            \"app-transitions\",","            \"app-transitions-css\",","            \"parallel\",","            \"transition\"","        ]","    },","    \"array-extras\": {","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"array-invoke\": {","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"arraylist\": {","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"arraylist-add\": {","        \"requires\": [","            \"arraylist\"","        ]","    },","    \"arraylist-filter\": {","        \"requires\": [","            \"arraylist\"","        ]","    },","    \"arraysort\": {","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"async-queue\": {","        \"requires\": [","            \"event-custom\"","        ]","    },","    \"attribute\": {","        \"use\": [","            \"attribute-base\",","            \"attribute-complex\"","        ]","    },","    \"attribute-base\": {","        \"requires\": [","            \"attribute-core\",","            \"attribute-events\",","            \"attribute-extras\"","        ]","    },","    \"attribute-complex\": {","        \"requires\": [","            \"attribute-base\"","        ]","    },","    \"attribute-core\": {","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"attribute-events\": {","        \"requires\": [","            \"event-custom\"","        ]","    },","    \"attribute-extras\": {","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"autocomplete\": {","        \"use\": [","            \"autocomplete-base\",","            \"autocomplete-sources\",","            \"autocomplete-list\",","            \"autocomplete-plugin\"","        ]","    },","    \"autocomplete-base\": {","        \"optional\": [","            \"autocomplete-sources\"","        ],","        \"requires\": [","            \"array-extras\",","            \"base-build\",","            \"escape\",","            \"event-valuechange\",","            \"node-base\"","        ]","    },","    \"autocomplete-filters\": {","        \"requires\": [","            \"array-extras\",","            \"text-wordbreak\"","        ]","    },","    \"autocomplete-filters-accentfold\": {","        \"requires\": [","            \"array-extras\",","            \"text-accentfold\",","            \"text-wordbreak\"","        ]","    },","    \"autocomplete-highlighters\": {","        \"requires\": [","            \"array-extras\",","            \"highlight-base\"","        ]","    },","    \"autocomplete-highlighters-accentfold\": {","        \"requires\": [","            \"array-extras\",","            \"highlight-accentfold\"","        ]","    },","    \"autocomplete-list\": {","        \"after\": [","            \"autocomplete-sources\"","        ],","        \"lang\": [","            \"en\"","        ],","        \"requires\": [","            \"autocomplete-base\",","            \"event-resize\",","            \"node-screen\",","            \"selector-css3\",","            \"shim-plugin\",","            \"widget\",","            \"widget-position\",","            \"widget-position-align\"","        ],","        \"skinnable\": true","    },","    \"autocomplete-list-keys\": {","        \"condition\": {","            \"name\": \"autocomplete-list-keys\",","            \"test\": function (Y) {","    // Only add keyboard support to autocomplete-list if this doesn't appear to","    // be an iOS or Android-based mobile device.","    //","    // There's currently no feasible way to actually detect whether a device has","    // a hardware keyboard, so this sniff will have to do. It can easily be","    // overridden by manually loading the autocomplete-list-keys module.","    //","    // Worth noting: even though iOS supports bluetooth keyboards, Mobile Safari","    // doesn't fire the keyboard events used by AutoCompleteList, so there's","    // no point loading the -keys module even when a bluetooth keyboard may be","    // available.","    return !(Y.UA.ios || Y.UA.android);","},","            \"trigger\": \"autocomplete-list\"","        },","        \"requires\": [","            \"autocomplete-list\",","            \"base-build\"","        ]","    },","    \"autocomplete-plugin\": {","        \"requires\": [","            \"autocomplete-list\",","            \"node-pluginhost\"","        ]","    },","    \"autocomplete-sources\": {","        \"optional\": [","            \"io-base\",","            \"json-parse\",","            \"jsonp\",","            \"yql\"","        ],","        \"requires\": [","            \"autocomplete-base\"","        ]","    },","    \"base\": {","        \"use\": [","            \"base-base\",","            \"base-pluginhost\",","            \"base-build\"","        ]","    },","    \"base-base\": {","        \"after\": [","            \"attribute-complex\"","        ],","        \"requires\": [","            \"base-core\",","            \"attribute-base\"","        ]","    },","    \"base-build\": {","        \"requires\": [","            \"base-base\"","        ]","    },","    \"base-core\": {","        \"requires\": [","            \"attribute-core\"","        ]","    },","    \"base-pluginhost\": {","        \"requires\": [","            \"base-base\",","            \"pluginhost\"","        ]","    },","    \"button\": {","        \"requires\": [","            \"button-core\",","            \"cssbutton\",","            \"widget\"","        ]","    },","    \"button-core\": {","        \"requires\": [","            \"attribute-core\",","            \"classnamemanager\",","            \"node-base\"","        ]","    },","    \"button-group\": {","        \"requires\": [","            \"button-plugin\",","            \"cssbutton\",","            \"widget\"","        ]","    },","    \"button-plugin\": {","        \"requires\": [","            \"button-core\",","            \"cssbutton\",","            \"node-pluginhost\"","        ]","    },","    \"cache\": {","        \"use\": [","            \"cache-base\",","            \"cache-offline\",","            \"cache-plugin\"","        ]","    },","    \"cache-base\": {","        \"requires\": [","            \"base\"","        ]","    },","    \"cache-offline\": {","        \"requires\": [","            \"cache-base\",","            \"json\"","        ]","    },","    \"cache-plugin\": {","        \"requires\": [","            \"plugin\",","            \"cache-base\"","        ]","    },","    \"calendar\": {","        \"lang\": [","            \"de\",","            \"en\",","            \"fr\",","            \"ja\",","            \"nb-NO\",","            \"pt-BR\",","            \"ru\",","            \"zh-HANT-TW\"","        ],","        \"requires\": [","            \"calendar-base\",","            \"calendarnavigator\"","        ],","        \"skinnable\": true","    },","    \"calendar-base\": {","        \"lang\": [","            \"de\",","            \"en\",","            \"fr\",","            \"ja\",","            \"nb-NO\",","            \"pt-BR\",","            \"ru\",","            \"zh-HANT-TW\"","        ],","        \"requires\": [","            \"widget\",","            \"substitute\",","            \"datatype-date\",","            \"datatype-date-math\",","            \"cssgrids\"","        ],","        \"skinnable\": true","    },","    \"calendarnavigator\": {","        \"requires\": [","            \"plugin\",","            \"classnamemanager\",","            \"datatype-date\",","            \"node\",","            \"substitute\"","        ],","        \"skinnable\": true","    },","    \"charts\": {","        \"requires\": [","            \"charts-base\"","        ]","    },","    \"charts-base\": {","        \"requires\": [","            \"dom\",","            \"datatype-number\",","            \"datatype-date\",","            \"event-custom\",","            \"event-mouseenter\",","            \"event-touch\",","            \"widget\",","            \"widget-position\",","            \"widget-stack\",","            \"graphics\"","        ]","    },","    \"charts-legend\": {","        \"requires\": [","            \"charts-base\"","        ]","    },","    \"classnamemanager\": {","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"clickable-rail\": {","        \"requires\": [","            \"slider-base\"","        ]","    },","    \"collection\": {","        \"use\": [","            \"array-extras\",","            \"arraylist\",","            \"arraylist-add\",","            \"arraylist-filter\",","            \"array-invoke\"","        ]","    },","    \"console\": {","        \"lang\": [","            \"en\",","            \"es\",","            \"ja\"","        ],","        \"requires\": [","            \"yui-log\",","            \"widget\",","            \"substitute\"","        ],","        \"skinnable\": true","    },","    \"console-filters\": {","        \"requires\": [","            \"plugin\",","            \"console\"","        ],","        \"skinnable\": true","    },","    \"controller\": {","        \"use\": [","            \"router\"","        ]","    },","    \"cookie\": {","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"createlink-base\": {","        \"requires\": [","            \"editor-base\"","        ]","    },","    \"cssbase\": {","        \"after\": [","            \"cssreset\",","            \"cssfonts\",","            \"cssgrids\",","            \"cssreset-context\",","            \"cssfonts-context\",","            \"cssgrids-context\"","        ],","        \"type\": \"css\"","    },","    \"cssbase-context\": {","        \"after\": [","            \"cssreset\",","            \"cssfonts\",","            \"cssgrids\",","            \"cssreset-context\",","            \"cssfonts-context\",","            \"cssgrids-context\"","        ],","        \"type\": \"css\"","    },","    \"cssbutton\": {","        \"type\": \"css\"","    },","    \"cssfonts\": {","        \"type\": \"css\"","    },","    \"cssfonts-context\": {","        \"type\": \"css\"","    },","    \"cssgrids\": {","        \"optional\": [","            \"cssreset\",","            \"cssfonts\"","        ],","        \"type\": \"css\"","    },","    \"cssgrids-base\": {","        \"optional\": [","            \"cssreset\",","            \"cssfonts\"","        ],","        \"type\": \"css\"","    },","    \"cssgrids-units\": {","        \"optional\": [","            \"cssreset\",","            \"cssfonts\"","        ],","        \"requires\": [","            \"cssgrids-base\"","        ],","        \"type\": \"css\"","    },","    \"cssreset\": {","        \"type\": \"css\"","    },","    \"cssreset-context\": {","        \"type\": \"css\"","    },","    \"dataschema\": {","        \"use\": [","            \"dataschema-base\",","            \"dataschema-json\",","            \"dataschema-xml\",","            \"dataschema-array\",","            \"dataschema-text\"","        ]","    },","    \"dataschema-array\": {","        \"requires\": [","            \"dataschema-base\"","        ]","    },","    \"dataschema-base\": {","        \"requires\": [","            \"base\"","        ]","    },","    \"dataschema-json\": {","        \"requires\": [","            \"dataschema-base\",","            \"json\"","        ]","    },","    \"dataschema-text\": {","        \"requires\": [","            \"dataschema-base\"","        ]","    },","    \"dataschema-xml\": {","        \"requires\": [","            \"dataschema-base\"","        ]","    },","    \"datasource\": {","        \"use\": [","            \"datasource-local\",","            \"datasource-io\",","            \"datasource-get\",","            \"datasource-function\",","            \"datasource-cache\",","            \"datasource-jsonschema\",","            \"datasource-xmlschema\",","            \"datasource-arrayschema\",","            \"datasource-textschema\",","            \"datasource-polling\"","        ]","    },","    \"datasource-arrayschema\": {","        \"requires\": [","            \"datasource-local\",","            \"plugin\",","            \"dataschema-array\"","        ]","    },","    \"datasource-cache\": {","        \"requires\": [","            \"datasource-local\",","            \"plugin\",","            \"cache-base\"","        ]","    },","    \"datasource-function\": {","        \"requires\": [","            \"datasource-local\"","        ]","    },","    \"datasource-get\": {","        \"requires\": [","            \"datasource-local\",","            \"get\"","        ]","    },","    \"datasource-io\": {","        \"requires\": [","            \"datasource-local\",","            \"io-base\"","        ]","    },","    \"datasource-jsonschema\": {","        \"requires\": [","            \"datasource-local\",","            \"plugin\",","            \"dataschema-json\"","        ]","    },","    \"datasource-local\": {","        \"requires\": [","            \"base\"","        ]","    },","    \"datasource-polling\": {","        \"requires\": [","            \"datasource-local\"","        ]","    },","    \"datasource-textschema\": {","        \"requires\": [","            \"datasource-local\",","            \"plugin\",","            \"dataschema-text\"","        ]","    },","    \"datasource-xmlschema\": {","        \"requires\": [","            \"datasource-local\",","            \"plugin\",","            \"dataschema-xml\"","        ]","    },","    \"datatable\": {","        \"use\": [","            \"datatable-core\",","            \"datatable-table\",","            \"datatable-head\",","            \"datatable-body\",","            \"datatable-base\",","            \"datatable-column-widths\",","            \"datatable-message\",","            \"datatable-mutable\",","            \"datatable-sort\",","            \"datatable-datasource\"","        ]","    },","    \"datatable-base\": {","        \"requires\": [","            \"datatable-core\",","            \"datatable-table\",","            \"base-build\",","            \"widget\"","        ],","        \"skinnable\": true","    },","    \"datatable-base-deprecated\": {","        \"requires\": [","            \"recordset-base\",","            \"widget\",","            \"substitute\",","            \"event-mouseenter\"","        ],","        \"skinnable\": true","    },","    \"datatable-body\": {","        \"requires\": [","            \"datatable-core\",","            \"view\",","            \"classnamemanager\"","        ]","    },","    \"datatable-column-widths\": {","        \"requires\": [","            \"datatable-base\"","        ]","    },","    \"datatable-core\": {","        \"requires\": [","            \"escape\",","            \"model-list\",","            \"node-event-delegate\"","        ]","    },","    \"datatable-datasource\": {","        \"requires\": [","            \"datatable-base\",","            \"plugin\",","            \"datasource-local\"","        ]","    },","    \"datatable-datasource-deprecated\": {","        \"requires\": [","            \"datatable-base-deprecated\",","            \"plugin\",","            \"datasource-local\"","        ]","    },","    \"datatable-deprecated\": {","        \"use\": [","            \"datatable-base-deprecated\",","            \"datatable-datasource-deprecated\",","            \"datatable-sort-deprecated\",","            \"datatable-scroll-deprecated\"","        ]","    },","    \"datatable-head\": {","        \"requires\": [","            \"datatable-core\",","            \"view\",","            \"classnamemanager\"","        ]","    },","    \"datatable-message\": {","        \"lang\": [","            \"en\"","        ],","        \"requires\": [","            \"datatable-base\"","        ],","        \"skinnable\": true","    },","    \"datatable-mutable\": {","        \"requires\": [","            \"datatable-base\"","        ]","    },","    \"datatable-scroll\": {","        \"requires\": [","            \"datatable-base\",","            \"datatable-column-widths\",","            \"dom-screen\"","        ],","        \"skinnable\": true","    },","    \"datatable-scroll-deprecated\": {","        \"requires\": [","            \"datatable-base-deprecated\",","            \"plugin\"","        ]","    },","    \"datatable-sort\": {","        \"lang\": [","            \"en\"","        ],","        \"requires\": [","            \"datatable-base\"","        ],","        \"skinnable\": true","    },","    \"datatable-sort-deprecated\": {","        \"lang\": [","            \"en\"","        ],","        \"requires\": [","            \"datatable-base-deprecated\",","            \"plugin\",","            \"recordset-sort\"","        ]","    },","    \"datatable-table\": {","        \"requires\": [","            \"datatable-core\",","            \"datatable-head\",","            \"datatable-body\",","            \"view\",","            \"classnamemanager\"","        ]","    },","    \"datatype\": {","        \"use\": [","            \"datatype-number\",","            \"datatype-date\",","            \"datatype-xml\"","        ]","    },","    \"datatype-date\": {","        \"supersedes\": [","            \"datatype-date-format\"","        ],","        \"use\": [","            \"datatype-date-parse\",","            \"datatype-date-format\"","        ]","    },","    \"datatype-date-format\": {","        \"lang\": [","            \"ar\",","            \"ar-JO\",","            \"ca\",","            \"ca-ES\",","            \"da\",","            \"da-DK\",","            \"de\",","            \"de-AT\",","            \"de-DE\",","            \"el\",","            \"el-GR\",","            \"en\",","            \"en-AU\",","            \"en-CA\",","            \"en-GB\",","            \"en-IE\",","            \"en-IN\",","            \"en-JO\",","            \"en-MY\",","            \"en-NZ\",","            \"en-PH\",","            \"en-SG\",","            \"en-US\",","            \"es\",","            \"es-AR\",","            \"es-BO\",","            \"es-CL\",","            \"es-CO\",","            \"es-EC\",","            \"es-ES\",","            \"es-MX\",","            \"es-PE\",","            \"es-PY\",","            \"es-US\",","            \"es-UY\",","            \"es-VE\",","            \"fi\",","            \"fi-FI\",","            \"fr\",","            \"fr-BE\",","            \"fr-CA\",","            \"fr-FR\",","            \"hi\",","            \"hi-IN\",","            \"id\",","            \"id-ID\",","            \"it\",","            \"it-IT\",","            \"ja\",","            \"ja-JP\",","            \"ko\",","            \"ko-KR\",","            \"ms\",","            \"ms-MY\",","            \"nb\",","            \"nb-NO\",","            \"nl\",","            \"nl-BE\",","            \"nl-NL\",","            \"pl\",","            \"pl-PL\",","            \"pt\",","            \"pt-BR\",","            \"ro\",","            \"ro-RO\",","            \"ru\",","            \"ru-RU\",","            \"sv\",","            \"sv-SE\",","            \"th\",","            \"th-TH\",","            \"tr\",","            \"tr-TR\",","            \"vi\",","            \"vi-VN\",","            \"zh-Hans\",","            \"zh-Hans-CN\",","            \"zh-Hant\",","            \"zh-Hant-HK\",","            \"zh-Hant-TW\"","        ]","    },","    \"datatype-date-math\": {","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"datatype-date-parse\": {},","    \"datatype-number\": {","        \"use\": [","            \"datatype-number-parse\",","            \"datatype-number-format\"","        ]","    },","    \"datatype-number-format\": {},","    \"datatype-number-parse\": {},","    \"datatype-xml\": {","        \"use\": [","            \"datatype-xml-parse\",","            \"datatype-xml-format\"","        ]","    },","    \"datatype-xml-format\": {},","    \"datatype-xml-parse\": {},","    \"dd\": {","        \"use\": [","            \"dd-ddm-base\",","            \"dd-ddm\",","            \"dd-ddm-drop\",","            \"dd-drag\",","            \"dd-proxy\",","            \"dd-constrain\",","            \"dd-drop\",","            \"dd-scroll\",","            \"dd-delegate\"","        ]","    },","    \"dd-constrain\": {","        \"requires\": [","            \"dd-drag\"","        ]","    },","    \"dd-ddm\": {","        \"requires\": [","            \"dd-ddm-base\",","            \"event-resize\"","        ]","    },","    \"dd-ddm-base\": {","        \"requires\": [","            \"node\",","            \"base\",","            \"yui-throttle\",","            \"classnamemanager\"","        ]","    },","    \"dd-ddm-drop\": {","        \"requires\": [","            \"dd-ddm\"","        ]","    },","    \"dd-delegate\": {","        \"requires\": [","            \"dd-drag\",","            \"dd-drop-plugin\",","            \"event-mouseenter\"","        ]","    },","    \"dd-drag\": {","        \"requires\": [","            \"dd-ddm-base\"","        ]","    },","    \"dd-drop\": {","        \"requires\": [","            \"dd-drag\",","            \"dd-ddm-drop\"","        ]","    },","    \"dd-drop-plugin\": {","        \"requires\": [","            \"dd-drop\"","        ]","    },","    \"dd-gestures\": {","        \"condition\": {","            \"name\": \"dd-gestures\",","            \"test\": function(Y) {","    return ((Y.config.win && (\"ontouchstart\" in Y.config.win)) && !(Y.UA.chrome && Y.UA.chrome < 6));","},","            \"trigger\": \"dd-drag\"","        },","        \"requires\": [","            \"dd-drag\",","            \"event-synthetic\",","            \"event-gestures\"","        ]","    },","    \"dd-plugin\": {","        \"optional\": [","            \"dd-constrain\",","            \"dd-proxy\"","        ],","        \"requires\": [","            \"dd-drag\"","        ]","    },","    \"dd-proxy\": {","        \"requires\": [","            \"dd-drag\"","        ]","    },","    \"dd-scroll\": {","        \"requires\": [","            \"dd-drag\"","        ]","    },","    \"dial\": {","        \"lang\": [","            \"en\",","            \"es\"","        ],","        \"requires\": [","            \"widget\",","            \"dd-drag\",","            \"substitute\",","            \"event-mouseenter\",","            \"event-move\",","            \"event-key\",","            \"transition\",","            \"intl\"","        ],","        \"skinnable\": true","    },","    \"dom\": {","        \"use\": [","            \"dom-base\",","            \"dom-screen\",","            \"dom-style\",","            \"selector-native\",","            \"selector\"","        ]","    },","    \"dom-base\": {","        \"requires\": [","            \"dom-core\"","        ]","    },","    \"dom-core\": {","        \"requires\": [","            \"oop\",","            \"features\"","        ]","    },","    \"dom-deprecated\": {","        \"requires\": [","            \"dom-base\"","        ]","    },","    \"dom-screen\": {","        \"requires\": [","            \"dom-base\",","            \"dom-style\"","        ]","    },","    \"dom-style\": {","        \"requires\": [","            \"dom-base\"","        ]","    },","    \"dom-style-ie\": {","        \"condition\": {","            \"name\": \"dom-style-ie\",","            \"test\": function (Y) {","","    var testFeature = Y.Features.test,","        addFeature = Y.Features.add,","        WINDOW = Y.config.win,","        DOCUMENT = Y.config.doc,","        DOCUMENT_ELEMENT = 'documentElement',","        ret = false;","","    addFeature('style', 'computedStyle', {","        test: function() {","            return WINDOW && 'getComputedStyle' in WINDOW;","        }","    });","","    addFeature('style', 'opacity', {","        test: function() {","            return DOCUMENT && 'opacity' in DOCUMENT[DOCUMENT_ELEMENT].style;","        }","    });","","    ret =  (!testFeature('style', 'opacity') &&","            !testFeature('style', 'computedStyle'));","","    return ret;","},","            \"trigger\": \"dom-style\"","        },","        \"requires\": [","            \"dom-style\"","        ]","    },","    \"dump\": {","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"editor\": {","        \"use\": [","            \"frame\",","            \"editor-selection\",","            \"exec-command\",","            \"editor-base\",","            \"editor-para\",","            \"editor-br\",","            \"editor-bidi\",","            \"editor-tab\",","            \"createlink-base\"","        ]","    },","    \"editor-base\": {","        \"requires\": [","            \"base\",","            \"frame\",","            \"node\",","            \"exec-command\",","            \"editor-selection\"","        ]","    },","    \"editor-bidi\": {","        \"requires\": [","            \"editor-base\"","        ]","    },","    \"editor-br\": {","        \"requires\": [","            \"editor-base\"","        ]","    },","    \"editor-lists\": {","        \"requires\": [","            \"editor-base\"","        ]","    },","    \"editor-para\": {","        \"requires\": [","            \"editor-para-base\"","        ]","    },","    \"editor-para-base\": {","        \"requires\": [","            \"editor-base\"","        ]","    },","    \"editor-para-ie\": {","        \"condition\": {","            \"name\": \"editor-para-ie\",","            \"trigger\": \"editor-para\",","            \"ua\": \"ie\",","            \"when\": \"instead\"","        },","        \"requires\": [","            \"editor-para-base\"","        ]","    },","    \"editor-selection\": {","        \"requires\": [","            \"node\"","        ]","    },","    \"editor-tab\": {","        \"requires\": [","            \"editor-base\"","        ]","    },","    \"escape\": {","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"event\": {","        \"after\": [","            \"node-base\"","        ],","        \"use\": [","            \"event-base\",","            \"event-delegate\",","            \"event-synthetic\",","            \"event-mousewheel\",","            \"event-mouseenter\",","            \"event-key\",","            \"event-focus\",","            \"event-resize\",","            \"event-hover\",","            \"event-outside\",","            \"event-touch\",","            \"event-move\",","            \"event-flick\",","            \"event-valuechange\"","        ]","    },","    \"event-base\": {","        \"after\": [","            \"node-base\"","        ],","        \"requires\": [","            \"event-custom-base\"","        ]","    },","    \"event-base-ie\": {","        \"after\": [","            \"event-base\"","        ],","        \"condition\": {","            \"name\": \"event-base-ie\",","            \"test\": function(Y) {","    var imp = Y.config.doc && Y.config.doc.implementation;","    return (imp && (!imp.hasFeature('Events', '2.0')));","},","            \"trigger\": \"node-base\"","        },","        \"requires\": [","            \"node-base\"","        ]","    },","    \"event-contextmenu\": {","        \"requires\": [","            \"event-synthetic\",","            \"dom-screen\"","        ]","    },","    \"event-custom\": {","        \"use\": [","            \"event-custom-base\",","            \"event-custom-complex\"","        ]","    },","    \"event-custom-base\": {","        \"requires\": [","            \"oop\"","        ]","    },","    \"event-custom-complex\": {","        \"requires\": [","            \"event-custom-base\"","        ]","    },","    \"event-delegate\": {","        \"requires\": [","            \"node-base\"","        ]","    },","    \"event-flick\": {","        \"requires\": [","            \"node-base\",","            \"event-touch\",","            \"event-synthetic\"","        ]","    },","    \"event-focus\": {","        \"requires\": [","            \"event-synthetic\"","        ]","    },","    \"event-gestures\": {","        \"use\": [","            \"event-flick\",","            \"event-move\"","        ]","    },","    \"event-hover\": {","        \"requires\": [","            \"event-mouseenter\"","        ]","    },","    \"event-key\": {","        \"requires\": [","            \"event-synthetic\"","        ]","    },","    \"event-mouseenter\": {","        \"requires\": [","            \"event-synthetic\"","        ]","    },","    \"event-mousewheel\": {","        \"requires\": [","            \"node-base\"","        ]","    },","    \"event-move\": {","        \"requires\": [","            \"node-base\",","            \"event-touch\",","            \"event-synthetic\"","        ]","    },","    \"event-outside\": {","        \"requires\": [","            \"event-synthetic\"","        ]","    },","    \"event-resize\": {","        \"requires\": [","            \"node-base\",","            \"event-synthetic\"","        ]","    },","    \"event-simulate\": {","        \"requires\": [","            \"event-base\"","        ]","    },","    \"event-synthetic\": {","        \"requires\": [","            \"node-base\",","            \"event-custom-complex\"","        ]","    },","    \"event-touch\": {","        \"requires\": [","            \"node-base\"","        ]","    },","    \"event-valuechange\": {","        \"requires\": [","            \"event-focus\",","            \"event-synthetic\"","        ]","    },","    \"exec-command\": {","        \"requires\": [","            \"frame\"","        ]","    },","    \"features\": {","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"file\": {","        \"requires\": [","            \"file-flash\",","            \"file-html5\"","        ]","    },","    \"file-flash\": {","        \"requires\": [","            \"base\"","        ]","    },","    \"file-html5\": {","        \"requires\": [","            \"base\"","        ]","    },","    \"frame\": {","        \"requires\": [","            \"base\",","            \"node\",","            \"selector-css3\",","            \"substitute\",","            \"yui-throttle\"","        ]","    },","    \"get\": {","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"graphics\": {","        \"requires\": [","            \"node\",","            \"event-custom\",","            \"pluginhost\",","            \"matrix\",","            \"classnamemanager\"","        ]","    },","    \"graphics-canvas\": {","        \"condition\": {","            \"name\": \"graphics-canvas\",","            \"test\": function(Y) {","    var DOCUMENT = Y.config.doc,","        useCanvas = Y.config.defaultGraphicEngine && Y.config.defaultGraphicEngine == \"canvas\",","		canvas = DOCUMENT && DOCUMENT.createElement(\"canvas\"),","        svg = (DOCUMENT && DOCUMENT.implementation.hasFeature(\"http://www.w3.org/TR/SVG11/feature#BasicStructure\", \"1.1\"));","    return (!svg || useCanvas) && (canvas && canvas.getContext && canvas.getContext(\"2d\"));","},","            \"trigger\": \"graphics\"","        },","        \"requires\": [","            \"graphics\"","        ]","    },","    \"graphics-canvas-default\": {","        \"condition\": {","            \"name\": \"graphics-canvas-default\",","            \"test\": function(Y) {","    var DOCUMENT = Y.config.doc,","        useCanvas = Y.config.defaultGraphicEngine && Y.config.defaultGraphicEngine == \"canvas\",","		canvas = DOCUMENT && DOCUMENT.createElement(\"canvas\"),","        svg = (DOCUMENT && DOCUMENT.implementation.hasFeature(\"http://www.w3.org/TR/SVG11/feature#BasicStructure\", \"1.1\"));","    return (!svg || useCanvas) && (canvas && canvas.getContext && canvas.getContext(\"2d\"));","},","            \"trigger\": \"graphics\"","        }","    },","    \"graphics-svg\": {","        \"condition\": {","            \"name\": \"graphics-svg\",","            \"test\": function(Y) {","    var DOCUMENT = Y.config.doc,","        useSVG = !Y.config.defaultGraphicEngine || Y.config.defaultGraphicEngine != \"canvas\",","		canvas = DOCUMENT && DOCUMENT.createElement(\"canvas\"),","        svg = (DOCUMENT && DOCUMENT.implementation.hasFeature(\"http://www.w3.org/TR/SVG11/feature#BasicStructure\", \"1.1\"));","    ","    return svg && (useSVG || !canvas);","},","            \"trigger\": \"graphics\"","        },","        \"requires\": [","            \"graphics\"","        ]","    },","    \"graphics-svg-default\": {","        \"condition\": {","            \"name\": \"graphics-svg-default\",","            \"test\": function(Y) {","    var DOCUMENT = Y.config.doc,","        useSVG = !Y.config.defaultGraphicEngine || Y.config.defaultGraphicEngine != \"canvas\",","		canvas = DOCUMENT && DOCUMENT.createElement(\"canvas\"),","        svg = (DOCUMENT && DOCUMENT.implementation.hasFeature(\"http://www.w3.org/TR/SVG11/feature#BasicStructure\", \"1.1\"));","    ","    return svg && (useSVG || !canvas);","},","            \"trigger\": \"graphics\"","        }","    },","    \"graphics-vml\": {","        \"condition\": {","            \"name\": \"graphics-vml\",","            \"test\": function(Y) {","    var DOCUMENT = Y.config.doc,","		canvas = DOCUMENT && DOCUMENT.createElement(\"canvas\");","    return (DOCUMENT && !DOCUMENT.implementation.hasFeature(\"http://www.w3.org/TR/SVG11/feature#BasicStructure\", \"1.1\") && (!canvas || !canvas.getContext || !canvas.getContext(\"2d\")));","},","            \"trigger\": \"graphics\"","        },","        \"requires\": [","            \"graphics\"","        ]","    },","    \"graphics-vml-default\": {","        \"condition\": {","            \"name\": \"graphics-vml-default\",","            \"test\": function(Y) {","    var DOCUMENT = Y.config.doc,","		canvas = DOCUMENT && DOCUMENT.createElement(\"canvas\");","    return (DOCUMENT && !DOCUMENT.implementation.hasFeature(\"http://www.w3.org/TR/SVG11/feature#BasicStructure\", \"1.1\") && (!canvas || !canvas.getContext || !canvas.getContext(\"2d\")));","},","            \"trigger\": \"graphics\"","        }","    },","    \"handlebars\": {","        \"use\": [","            \"handlebars-compiler\"","        ]","    },","    \"handlebars-base\": {","        \"requires\": [","            \"escape\"","        ]","    },","    \"handlebars-compiler\": {","        \"requires\": [","            \"handlebars-base\"","        ]","    },","    \"highlight\": {","        \"use\": [","            \"highlight-base\",","            \"highlight-accentfold\"","        ]","    },","    \"highlight-accentfold\": {","        \"requires\": [","            \"highlight-base\",","            \"text-accentfold\"","        ]","    },","    \"highlight-base\": {","        \"requires\": [","            \"array-extras\",","            \"classnamemanager\",","            \"escape\",","            \"text-wordbreak\"","        ]","    },","    \"history\": {","        \"use\": [","            \"history-base\",","            \"history-hash\",","            \"history-hash-ie\",","            \"history-html5\"","        ]","    },","    \"history-base\": {","        \"requires\": [","            \"event-custom-complex\"","        ]","    },","    \"history-hash\": {","        \"after\": [","            \"history-html5\"","        ],","        \"requires\": [","            \"event-synthetic\",","            \"history-base\",","            \"yui-later\"","        ]","    },","    \"history-hash-ie\": {","        \"condition\": {","            \"name\": \"history-hash-ie\",","            \"test\": function (Y) {","    var docMode = Y.config.doc && Y.config.doc.documentMode;","","    return Y.UA.ie && (!('onhashchange' in Y.config.win) ||","            !docMode || docMode < 8);","},","            \"trigger\": \"history-hash\"","        },","        \"requires\": [","            \"history-hash\",","            \"node-base\"","        ]","    },","    \"history-html5\": {","        \"optional\": [","            \"json\"","        ],","        \"requires\": [","            \"event-base\",","            \"history-base\",","            \"node-base\"","        ]","    },","    \"imageloader\": {","        \"requires\": [","            \"base-base\",","            \"node-style\",","            \"node-screen\"","        ]","    },","    \"intl\": {","        \"requires\": [","            \"intl-base\",","            \"event-custom\"","        ]","    },","    \"intl-base\": {","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"io\": {","        \"use\": [","            \"io-base\",","            \"io-xdr\",","            \"io-form\",","            \"io-upload-iframe\",","            \"io-queue\"","        ]","    },","    \"io-base\": {","        \"requires\": [","            \"event-custom-base\",","            \"querystring-stringify-simple\"","        ]","    },","    \"io-form\": {","        \"requires\": [","            \"io-base\",","            \"node-base\"","        ]","    },","    \"io-nodejs\": {","        \"condition\": {","            \"name\": \"io-nodejs\",","            \"trigger\": \"io-base\",","            \"ua\": \"nodejs\"","        },","        \"requires\": [","            \"io-base\"","        ]","    },","    \"io-queue\": {","        \"requires\": [","            \"io-base\",","            \"queue-promote\"","        ]","    },","    \"io-upload-iframe\": {","        \"requires\": [","            \"io-base\",","            \"node-base\"","        ]","    },","    \"io-xdr\": {","        \"requires\": [","            \"io-base\",","            \"datatype-xml-parse\"","        ]","    },","    \"json\": {","        \"use\": [","            \"json-parse\",","            \"json-stringify\"","        ]","    },","    \"json-parse\": {","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"json-stringify\": {","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"jsonp\": {","        \"requires\": [","            \"get\",","            \"oop\"","        ]","    },","    \"jsonp-url\": {","        \"requires\": [","            \"jsonp\"","        ]","    },","    \"lazy-model-list\": {","        \"requires\": [","            \"model-list\"","        ]","    },","    \"loader\": {","        \"use\": [","            \"loader-base\",","            \"loader-rollup\",","            \"loader-yui3\"","        ]","    },","    \"loader-base\": {","        \"requires\": [","            \"get\",","            \"features\"","        ]","    },","    \"loader-rollup\": {","        \"requires\": [","            \"loader-base\"","        ]","    },","    \"loader-yui3\": {","        \"requires\": [","            \"loader-base\"","        ]","    },","    \"matrix\": {","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"model\": {","        \"requires\": [","            \"base-build\",","            \"escape\",","            \"json-parse\"","        ]","    },","    \"model-list\": {","        \"requires\": [","            \"array-extras\",","            \"array-invoke\",","            \"arraylist\",","            \"base-build\",","            \"escape\",","            \"json-parse\",","            \"model\"","        ]","    },","    \"model-sync-rest\": {","        \"requires\": [","            \"model\",","            \"io-base\",","            \"json-stringify\"","        ]","    },","    \"node\": {","        \"use\": [","            \"node-base\",","            \"node-event-delegate\",","            \"node-pluginhost\",","            \"node-screen\",","            \"node-style\"","        ]","    },","    \"node-base\": {","        \"requires\": [","            \"event-base\",","            \"node-core\",","            \"dom-base\"","        ]","    },","    \"node-core\": {","        \"requires\": [","            \"dom-core\",","            \"selector\"","        ]","    },","    \"node-deprecated\": {","        \"requires\": [","            \"node-base\"","        ]","    },","    \"node-event-delegate\": {","        \"requires\": [","            \"node-base\",","            \"event-delegate\"","        ]","    },","    \"node-event-html5\": {","        \"requires\": [","            \"node-base\"","        ]","    },","    \"node-event-simulate\": {","        \"requires\": [","            \"node-base\",","            \"event-simulate\"","        ]","    },","    \"node-flick\": {","        \"requires\": [","            \"classnamemanager\",","            \"transition\",","            \"event-flick\",","            \"plugin\"","        ],","        \"skinnable\": true","    },","    \"node-focusmanager\": {","        \"requires\": [","            \"attribute\",","            \"node\",","            \"plugin\",","            \"node-event-simulate\",","            \"event-key\",","            \"event-focus\"","        ]","    },","    \"node-load\": {","        \"requires\": [","            \"node-base\",","            \"io-base\"","        ]","    },","    \"node-menunav\": {","        \"requires\": [","            \"node\",","            \"classnamemanager\",","            \"plugin\",","            \"node-focusmanager\"","        ],","        \"skinnable\": true","    },","    \"node-pluginhost\": {","        \"requires\": [","            \"node-base\",","            \"pluginhost\"","        ]","    },","    \"node-screen\": {","        \"requires\": [","            \"dom-screen\",","            \"node-base\"","        ]","    },","    \"node-style\": {","        \"requires\": [","            \"dom-style\",","            \"node-base\"","        ]","    },","    \"oop\": {","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"overlay\": {","        \"requires\": [","            \"widget\",","            \"widget-stdmod\",","            \"widget-position\",","            \"widget-position-align\",","            \"widget-stack\",","            \"widget-position-constrain\"","        ],","        \"skinnable\": true","    },","    \"panel\": {","        \"requires\": [","            \"widget\",","            \"widget-autohide\",","            \"widget-buttons\",","            \"widget-modality\",","            \"widget-position\",","            \"widget-position-align\",","            \"widget-position-constrain\",","            \"widget-stack\",","            \"widget-stdmod\"","        ],","        \"skinnable\": true","    },","    \"parallel\": {","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"pjax\": {","        \"requires\": [","            \"pjax-base\",","            \"io-base\"","        ]","    },","    \"pjax-base\": {","        \"requires\": [","            \"classnamemanager\",","            \"node-event-delegate\",","            \"router\"","        ]","    },","    \"pjax-plugin\": {","        \"requires\": [","            \"node-pluginhost\",","            \"pjax\",","            \"plugin\"","        ]","    },","    \"plugin\": {","        \"requires\": [","            \"base-base\"","        ]","    },","    \"pluginhost\": {","        \"use\": [","            \"pluginhost-base\",","            \"pluginhost-config\"","        ]","    },","    \"pluginhost-base\": {","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"pluginhost-config\": {","        \"requires\": [","            \"pluginhost-base\"","        ]","    },","    \"profiler\": {","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"querystring\": {","        \"use\": [","            \"querystring-parse\",","            \"querystring-stringify\"","        ]","    },","    \"querystring-parse\": {","        \"requires\": [","            \"yui-base\",","            \"array-extras\"","        ]","    },","    \"querystring-parse-simple\": {","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"querystring-stringify\": {","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"querystring-stringify-simple\": {","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"queue-promote\": {","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"range-slider\": {","        \"requires\": [","            \"slider-base\",","            \"slider-value-range\",","            \"clickable-rail\"","        ]","    },","    \"recordset\": {","        \"use\": [","            \"recordset-base\",","            \"recordset-sort\",","            \"recordset-filter\",","            \"recordset-indexer\"","        ]","    },","    \"recordset-base\": {","        \"requires\": [","            \"base\",","            \"arraylist\"","        ]","    },","    \"recordset-filter\": {","        \"requires\": [","            \"recordset-base\",","            \"array-extras\",","            \"plugin\"","        ]","    },","    \"recordset-indexer\": {","        \"requires\": [","            \"recordset-base\",","            \"plugin\"","        ]","    },","    \"recordset-sort\": {","        \"requires\": [","            \"arraysort\",","            \"recordset-base\",","            \"plugin\"","        ]","    },","    \"resize\": {","        \"use\": [","            \"resize-base\",","            \"resize-proxy\",","            \"resize-constrain\"","        ]","    },","    \"resize-base\": {","        \"requires\": [","            \"base\",","            \"widget\",","            \"substitute\",","            \"event\",","            \"oop\",","            \"dd-drag\",","            \"dd-delegate\",","            \"dd-drop\"","        ],","        \"skinnable\": true","    },","    \"resize-constrain\": {","        \"requires\": [","            \"plugin\",","            \"resize-base\"","        ]","    },","    \"resize-plugin\": {","        \"optional\": [","            \"resize-constrain\"","        ],","        \"requires\": [","            \"resize-base\",","            \"plugin\"","        ]","    },","    \"resize-proxy\": {","        \"requires\": [","            \"plugin\",","            \"resize-base\"","        ]","    },","    \"router\": {","        \"optional\": [","            \"querystring-parse\"","        ],","        \"requires\": [","            \"array-extras\",","            \"base-build\",","            \"history\"","        ]","    },","    \"scrollview\": {","        \"requires\": [","            \"scrollview-base\",","            \"scrollview-scrollbars\"","        ]","    },","    \"scrollview-base\": {","        \"requires\": [","            \"widget\",","            \"event-gestures\",","            \"event-mousewheel\",","            \"transition\"","        ],","        \"skinnable\": true","    },","    \"scrollview-base-ie\": {","        \"condition\": {","            \"name\": \"scrollview-base-ie\",","            \"trigger\": \"scrollview-base\",","            \"ua\": \"ie\"","        },","        \"requires\": [","            \"scrollview-base\"","        ]","    },","    \"scrollview-list\": {","        \"requires\": [","            \"plugin\",","            \"classnamemanager\"","        ],","        \"skinnable\": true","    },","    \"scrollview-paginator\": {","        \"requires\": [","            \"plugin\",","            \"classnamemanager\"","        ]","    },","    \"scrollview-scrollbars\": {","        \"requires\": [","            \"classnamemanager\",","            \"transition\",","            \"plugin\"","        ],","        \"skinnable\": true","    },","    \"selector\": {","        \"requires\": [","            \"selector-native\"","        ]","    },","    \"selector-css2\": {","        \"condition\": {","            \"name\": \"selector-css2\",","            \"test\": function (Y) {","    var DOCUMENT = Y.config.doc,","        ret = DOCUMENT && !('querySelectorAll' in DOCUMENT);","","    return ret;","},","            \"trigger\": \"selector\"","        },","        \"requires\": [","            \"selector-native\"","        ]","    },","    \"selector-css3\": {","        \"requires\": [","            \"selector-native\",","            \"selector-css2\"","        ]","    },","    \"selector-native\": {","        \"requires\": [","            \"dom-base\"","        ]","    },","    \"shim-plugin\": {","        \"requires\": [","            \"node-style\",","            \"node-pluginhost\"","        ]","    },","    \"slider\": {","        \"use\": [","            \"slider-base\",","            \"slider-value-range\",","            \"clickable-rail\",","            \"range-slider\"","        ]","    },","    \"slider-base\": {","        \"requires\": [","            \"widget\",","            \"dd-constrain\",","            \"substitute\",","            \"event-key\"","        ],","        \"skinnable\": true","    },","    \"slider-value-range\": {","        \"requires\": [","            \"slider-base\"","        ]","    },","    \"sortable\": {","        \"requires\": [","            \"dd-delegate\",","            \"dd-drop-plugin\",","            \"dd-proxy\"","        ]","    },","    \"sortable-scroll\": {","        \"requires\": [","            \"dd-scroll\",","            \"sortable\"","        ]","    },","    \"stylesheet\": {","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"substitute\": {","        \"optional\": [","            \"dump\"","        ],","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"swf\": {","        \"requires\": [","            \"event-custom\",","            \"node\",","            \"swfdetect\",","            \"escape\"","        ]","    },","    \"swfdetect\": {","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"tabview\": {","        \"requires\": [","            \"widget\",","            \"widget-parent\",","            \"widget-child\",","            \"tabview-base\",","            \"node-pluginhost\",","            \"node-focusmanager\"","        ],","        \"skinnable\": true","    },","    \"tabview-base\": {","        \"requires\": [","            \"node-event-delegate\",","            \"classnamemanager\",","            \"skin-sam-tabview\"","        ]","    },","    \"tabview-plugin\": {","        \"requires\": [","            \"tabview-base\"","        ]","    },","    \"test\": {","        \"requires\": [","            \"event-simulate\",","            \"event-custom\",","            \"substitute\",","            \"json-stringify\"","        ],","        \"skinnable\": true","    },","    \"test-console\": {","        \"requires\": [","            \"console-filters\",","            \"test\"","        ],","        \"skinnable\": true","    },","    \"text\": {","        \"use\": [","            \"text-accentfold\",","            \"text-wordbreak\"","        ]","    },","    \"text-accentfold\": {","        \"requires\": [","            \"array-extras\",","            \"text-data-accentfold\"","        ]","    },","    \"text-data-accentfold\": {","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"text-data-wordbreak\": {","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"text-wordbreak\": {","        \"requires\": [","            \"array-extras\",","            \"text-data-wordbreak\"","        ]","    },","    \"transition\": {","        \"requires\": [","            \"node-style\"","        ]","    },","    \"transition-timer\": {","        \"condition\": {","            \"name\": \"transition-timer\",","            \"test\": function (Y) {","    var DOCUMENT = Y.config.doc,","        node = (DOCUMENT) ? DOCUMENT.documentElement: null,","        ret = true;","","    if (node && node.style) {","        ret = !('MozTransition' in node.style || 'WebkitTransition' in node.style);","    } ","","    return ret;","},","            \"trigger\": \"transition\"","        },","        \"requires\": [","            \"transition\"","        ]","    },","    \"uploader\": {","        \"requires\": [","            \"uploader-html5\",","            \"uploader-flash\"","        ]","    },","    \"uploader-deprecated\": {","        \"requires\": [","            \"event-custom\",","            \"node\",","            \"base\",","            \"swf\"","        ]","    },","    \"uploader-flash\": {","        \"requires\": [","            \"swf\",","            \"widget\",","            \"substitute\",","            \"base\",","            \"cssbutton\",","            \"node\",","            \"event-custom\",","            \"file-flash\",","            \"uploader-queue\"","        ]","    },","    \"uploader-html5\": {","        \"requires\": [","            \"widget\",","            \"node-event-simulate\",","            \"substitute\",","            \"file-html5\",","            \"uploader-queue\"","        ]","    },","    \"uploader-queue\": {","        \"requires\": [","            \"base\"","        ]","    },","    \"view\": {","        \"requires\": [","            \"base-build\",","            \"node-event-delegate\"","        ]","    },","    \"view-node-map\": {","        \"requires\": [","            \"view\"","        ]","    },","    \"widget\": {","        \"use\": [","            \"widget-base\",","            \"widget-htmlparser\",","            \"widget-skin\",","            \"widget-uievents\"","        ]","    },","    \"widget-anim\": {","        \"requires\": [","            \"anim-base\",","            \"plugin\",","            \"widget\"","        ]","    },","    \"widget-autohide\": {","        \"requires\": [","            \"base-build\",","            \"event-key\",","            \"event-outside\",","            \"widget\"","        ]","    },","    \"widget-base\": {","        \"requires\": [","            \"attribute\",","            \"base-base\",","            \"base-pluginhost\",","            \"classnamemanager\",","            \"event-focus\",","            \"node-base\",","            \"node-style\"","        ],","        \"skinnable\": true","    },","    \"widget-base-ie\": {","        \"condition\": {","            \"name\": \"widget-base-ie\",","            \"trigger\": \"widget-base\",","            \"ua\": \"ie\"","        },","        \"requires\": [","            \"widget-base\"","        ]","    },","    \"widget-buttons\": {","        \"requires\": [","            \"button-plugin\",","            \"cssbutton\",","            \"widget-stdmod\"","        ]","    },","    \"widget-child\": {","        \"requires\": [","            \"base-build\",","            \"widget\"","        ]","    },","    \"widget-htmlparser\": {","        \"requires\": [","            \"widget-base\"","        ]","    },","    \"widget-locale\": {","        \"requires\": [","            \"widget-base\"","        ]","    },","    \"widget-modality\": {","        \"requires\": [","            \"base-build\",","            \"event-outside\",","            \"widget\"","        ],","        \"skinnable\": true","    },","    \"widget-parent\": {","        \"requires\": [","            \"arraylist\",","            \"base-build\",","            \"widget\"","        ]","    },","    \"widget-position\": {","        \"requires\": [","            \"base-build\",","            \"node-screen\",","            \"widget\"","        ]","    },","    \"widget-position-align\": {","        \"requires\": [","            \"widget-position\"","        ]","    },","    \"widget-position-constrain\": {","        \"requires\": [","            \"widget-position\"","        ]","    },","    \"widget-skin\": {","        \"requires\": [","            \"widget-base\"","        ]","    },","    \"widget-stack\": {","        \"requires\": [","            \"base-build\",","            \"widget\"","        ],","        \"skinnable\": true","    },","    \"widget-stdmod\": {","        \"requires\": [","            \"base-build\",","            \"widget\"","        ]","    },","    \"widget-uievents\": {","        \"requires\": [","            \"node-event-delegate\",","            \"widget-base\"","        ]","    },","    \"yql\": {","        \"requires\": [","            \"jsonp\",","            \"jsonp-url\"","        ]","    },","    \"yui\": {},","    \"yui-base\": {},","    \"yui-later\": {","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"yui-log\": {","        \"requires\": [","            \"yui-base\"","        ]","    },","    \"yui-throttle\": {","        \"requires\": [","            \"yui-base\"","        ]","    }","};","YUI.Env[Y.version].md5 = '5a681478005a2bdc375c61ddfa610d1e';","","","}, '@VERSION@' ,{requires:['loader-base']});","","","YUI.add('loader', function(Y){}, '@VERSION@' ,{use:['loader-base', 'loader-rollup', 'loader-yui3' ]});",""];
_yuitest_coverage["/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js"].lines = {"1":0,"9":0,"11":0,"12":0,"39":0,"45":0,"46":0,"47":0,"50":0,"54":0,"55":0,"56":0,"60":0,"62":0,"72":0,"80":0,"81":0,"82":0,"85":0,"93":0,"94":0,"96":0,"116":0,"138":0,"139":0,"140":0,"142":0,"144":0,"148":0,"149":0,"159":0,"207":0,"209":0,"212":0,"214":0,"268":0,"311":0,"319":0,"334":0,"343":0,"355":0,"362":0,"371":0,"380":0,"398":0,"406":0,"441":0,"448":0,"461":0,"468":0,"470":0,"500":0,"506":0,"511":0,"512":0,"514":0,"524":0,"532":0,"534":0,"536":0,"538":0,"540":0,"542":0,"544":0,"545":0,"570":0,"586":0,"593":0,"600":0,"604":0,"613":0,"615":0,"620":0,"628":0,"633":0,"634":0,"635":0,"636":0,"640":0,"641":0,"642":0,"643":0,"648":0,"649":0,"650":0,"662":0,"663":0,"664":0,"665":0,"669":0,"670":0,"671":0,"672":0,"673":0,"676":0,"677":0,"678":0,"679":0,"680":0,"685":0,"686":0,"687":0,"688":0,"728":0,"731":0,"732":0,"733":0,"734":0,"735":0,"736":0,"741":0,"742":0,"743":0,"744":0,"745":0,"746":0,"747":0,"749":0,"750":0,"752":0,"755":0,"757":0,"771":0,"776":0,"777":0,"780":0,"781":0,"785":0,"786":0,"789":0,"792":0,"793":0,"797":0,"798":0,"799":0,"800":0,"801":0,"806":0,"807":0,"808":0,"809":0,"810":0,"817":0,"818":0,"822":0,"823":0,"826":0,"835":0,"837":0,"838":0,"839":0,"840":0,"841":0,"842":0,"843":0,"845":0,"846":0,"847":0,"852":0,"853":0,"854":0,"855":0,"856":0,"857":0,"858":0,"859":0,"860":0,"861":0,"862":0,"869":0,"871":0,"872":0,"873":0,"876":0,"877":0,"878":0,"879":0,"882":0,"883":0,"884":0,"885":0,"887":0,"894":0,"896":0,"897":0,"898":0,"899":0,"900":0,"901":0,"906":0,"924":0,"925":0,"926":0,"929":0,"943":0,"949":0,"950":0,"951":0,"952":0,"953":0,"954":0,"964":0,"965":0,"967":0,"968":0,"970":0,"975":0,"991":0,"992":0,"1021":0,"1024":0,"1025":0,"1026":0,"1028":0,"1029":0,"1030":0,"1031":0,"1032":0,"1037":0,"1038":0,"1039":0,"1040":0,"1041":0,"1042":0,"1044":0,"1045":0,"1082":0,"1084":0,"1085":0,"1092":0,"1098":0,"1101":0,"1103":0,"1104":0,"1107":0,"1109":0,"1110":0,"1111":0,"1112":0,"1116":0,"1117":0,"1119":0,"1121":0,"1124":0,"1130":0,"1132":0,"1139":0,"1140":0,"1141":0,"1144":0,"1145":0,"1146":0,"1147":0,"1148":0,"1154":0,"1155":0,"1162":0,"1163":0,"1164":0,"1167":0,"1168":0,"1171":0,"1172":0,"1173":0,"1174":0,"1175":0,"1176":0,"1177":0,"1178":0,"1184":0,"1185":0,"1186":0,"1188":0,"1189":0,"1190":0,"1192":0,"1193":0,"1194":0,"1196":0,"1197":0,"1200":0,"1201":0,"1203":0,"1204":0,"1205":0,"1206":0,"1207":0,"1208":0,"1210":0,"1213":0,"1215":0,"1221":0,"1223":0,"1224":0,"1225":0,"1226":0,"1227":0,"1228":0,"1230":0,"1231":0,"1234":0,"1236":0,"1237":0,"1240":0,"1242":0,"1244":0,"1245":0,"1251":0,"1252":0,"1254":0,"1256":0,"1257":0,"1260":0,"1261":0,"1269":0,"1273":0,"1274":0,"1275":0,"1279":0,"1280":0,"1281":0,"1282":0,"1283":0,"1284":0,"1285":0,"1286":0,"1287":0,"1288":0,"1289":0,"1290":0,"1297":0,"1298":0,"1299":0,"1300":0,"1302":0,"1303":0,"1306":0,"1307":0,"1308":0,"1309":0,"1310":0,"1313":0,"1314":0,"1315":0,"1316":0,"1323":0,"1324":0,"1329":0,"1330":0,"1333":0,"1334":0,"1335":0,"1340":0,"1341":0,"1342":0,"1343":0,"1344":0,"1345":0,"1349":0,"1350":0,"1351":0,"1353":0,"1354":0,"1357":0,"1366":0,"1367":0,"1368":0,"1370":0,"1382":0,"1385":0,"1386":0,"1387":0,"1388":0,"1389":0,"1390":0,"1391":0,"1392":0,"1393":0,"1394":0,"1395":0,"1396":0,"1399":0,"1405":0,"1416":0,"1417":0,"1418":0,"1420":0,"1421":0,"1423":0,"1424":0,"1425":0,"1426":0,"1428":0,"1429":0,"1430":0,"1432":0,"1436":0,"1439":0,"1441":0,"1452":0,"1454":0,"1457":0,"1459":0,"1464":0,"1478":0,"1479":0,"1480":0,"1481":0,"1482":0,"1483":0,"1489":0,"1491":0,"1492":0,"1496":0,"1497":0,"1498":0,"1499":0,"1501":0,"1502":0,"1503":0,"1505":0,"1508":0,"1509":0,"1510":0,"1512":0,"1513":0,"1514":0,"1515":0,"1516":0,"1517":0,"1518":0,"1519":0,"1521":0,"1522":0,"1529":0,"1530":0,"1531":0,"1532":0,"1537":0,"1538":0,"1541":0,"1542":0,"1544":0,"1545":0,"1546":0,"1548":0,"1549":0,"1556":0,"1557":0,"1558":0,"1559":0,"1560":0,"1561":0,"1562":0,"1563":0,"1564":0,"1566":0,"1567":0,"1574":0,"1576":0,"1578":0,"1579":0,"1580":0,"1581":0,"1582":0,"1583":0,"1584":0,"1585":0,"1590":0,"1591":0,"1592":0,"1593":0,"1597":0,"1600":0,"1601":0,"1602":0,"1603":0,"1604":0,"1605":0,"1606":0,"1607":0,"1619":0,"1620":0,"1621":0,"1622":0,"1623":0,"1624":0,"1628":0,"1629":0,"1630":0,"1631":0,"1633":0,"1634":0,"1635":0,"1636":0,"1640":0,"1641":0,"1642":0,"1647":0,"1649":0,"1651":0,"1652":0,"1653":0,"1654":0,"1655":0,"1658":0,"1661":0,"1663":0,"1665":0,"1675":0,"1676":0,"1678":0,"1684":0,"1685":0,"1689":0,"1691":0,"1692":0,"1695":0,"1696":0,"1700":0,"1702":0,"1704":0,"1714":0,"1717":0,"1718":0,"1721":0,"1722":0,"1723":0,"1725":0,"1726":0,"1727":0,"1731":0,"1732":0,"1736":0,"1747":0,"1749":0,"1750":0,"1753":0,"1754":0,"1757":0,"1759":0,"1760":0,"1762":0,"1764":0,"1765":0,"1778":0,"1782":0,"1784":0,"1786":0,"1794":0,"1795":0,"1797":0,"1798":0,"1801":0,"1802":0,"1805":0,"1807":0,"1808":0,"1809":0,"1810":0,"1814":0,"1825":0,"1828":0,"1829":0,"1830":0,"1831":0,"1835":0,"1839":0,"1842":0,"1843":0,"1852":0,"1855":0,"1856":0,"1860":0,"1861":0,"1865":0,"1866":0,"1867":0,"1872":0,"1873":0,"1874":0,"1875":0,"1880":0,"1882":0,"1893":0,"1904":0,"1908":0,"1910":0,"1911":0,"1913":0,"1914":0,"1915":0,"1916":0,"1917":0,"1918":0,"1919":0,"1921":0,"1922":0,"1923":0,"1924":0,"1927":0,"1928":0,"1943":0,"1953":0,"1954":0,"1957":0,"1963":0,"1964":0,"1965":0,"1966":0,"1970":0,"1971":0,"1974":0,"1977":0,"1978":0,"1984":0,"1985":0,"1986":0,"1987":0,"1990":0,"1991":0,"1992":0,"1994":0,"1998":0,"1999":0,"2000":0,"2004":0,"2019":0,"2021":0,"2024":0,"2025":0,"2026":0,"2028":0,"2031":0,"2033":0,"2034":0,"2037":0,"2038":0,"2039":0,"2040":0,"2041":0,"2048":0,"2059":0,"2061":0,"2062":0,"2063":0,"2069":0,"2077":0,"2081":0,"2082":0,"2083":0,"2087":0,"2089":0,"2090":0,"2091":0,"2092":0,"2093":0,"2095":0,"2100":0,"2101":0,"2102":0,"2103":0,"2104":0,"2112":0,"2120":0,"2121":0,"2122":0,"2134":0,"2136":0,"2137":0,"2140":0,"2143":0,"2144":0,"2151":0,"2161":0,"2162":0,"2163":0,"2179":0,"2186":0,"2188":0,"2189":0,"2192":0,"2196":0,"2200":0,"2201":0,"2203":0,"2206":0,"2210":0,"2214":0,"2217":0,"2219":0,"2224":0,"2225":0,"2228":0,"2234":0,"2235":0,"2240":0,"2256":0,"2257":0,"2263":0,"2267":0,"2270":0,"2272":0,"2274":0,"2275":0,"2277":0,"2278":0,"2283":0,"2284":0,"2285":0,"2287":0,"2288":0,"2289":0,"2290":0,"2292":0,"2294":0,"2298":0,"2299":0,"2300":0,"2304":0,"2305":0,"2306":0,"2307":0,"2308":0,"2309":0,"2314":0,"2316":0,"2317":0,"2318":0,"2321":0,"2325":0,"2326":0,"2334":0,"2337":0,"2340":0,"2341":0,"2342":0,"2345":0,"2346":0,"2347":0,"2352":0,"2353":0,"2363":0,"2366":0,"2369":0,"2370":0,"2371":0,"2374":0,"2375":0,"2376":0,"2387":0,"2388":0,"2389":0,"2402":0,"2403":0,"2404":0,"2405":0,"2406":0,"2408":0,"2423":0,"2436":0,"2441":0,"2442":0,"2443":0,"2446":0,"2447":0,"2448":0,"2450":0,"2451":0,"2454":0,"2467":0,"2490":0,"2498":0,"2499":0,"2502":0,"2503":0,"2505":0,"2507":0,"2509":0,"2510":0,"2513":0,"2514":0,"2517":0,"2520":0,"2521":0,"2525":0,"2526":0,"2529":0,"2530":0,"2536":0,"2539":0,"2541":0,"2543":0,"2545":0,"2546":0,"2547":0,"2548":0,"2549":0,"2550":0,"2552":0,"2555":0,"2556":0,"2558":0,"2559":0,"2560":0,"2563":0,"2564":0,"2566":0,"2567":0,"2569":0,"2572":0,"2573":0,"2577":0,"2578":0,"2581":0,"2582":0,"2583":0,"2584":0,"2585":0,"2586":0,"2588":0,"2589":0,"2590":0,"2591":0,"2593":0,"2596":0,"2597":0,"2598":0,"2599":0,"2600":0,"2601":0,"2602":0,"2603":0,"2606":0,"2608":0,"2618":0,"2619":0,"2620":0,"2621":0,"2622":0,"2623":0,"2624":0,"2625":0,"2626":0,"2627":0,"2628":0,"2629":0,"2630":0,"2633":0,"2634":0,"2635":0,"2636":0,"2637":0,"2638":0,"2640":0,"2641":0,"2642":0,"2643":0,"2644":0,"2645":0,"2646":0,"2650":0,"2651":0,"2652":0,"2655":0,"2658":0,"2663":0,"2665":0,"2688":0,"2689":0,"2691":0,"2694":0,"2696":0,"2697":0,"2700":0,"2707":0,"2726":0,"2727":0,"2731":0,"2732":0,"2733":0,"2734":0,"2735":0,"2737":0,"2738":0,"2745":0,"2746":0,"2749":0,"2750":0,"2752":0,"2753":0,"2754":0,"2755":0,"2758":0,"2759":0,"2762":0,"2765":0,"2766":0,"2770":0,"2771":0,"2772":0,"2776":0,"2777":0,"2778":0,"2779":0,"2780":0,"2785":0,"2787":0,"2788":0,"2791":0,"2798":0,"2799":0,"2806":0,"2815":0,"2911":0,"2914":0,"2915":0,"2918":0,"3076":0,"3805":0,"3892":0,"3899":0,"3901":0,"3905":0,"3907":0,"3911":0,"3914":0,"4036":0,"4037":0,"4203":0,"4207":0,"4219":0,"4223":0,"4232":0,"4237":0,"4249":0,"4254":0,"4263":0,"4265":0,"4277":0,"4279":0,"4346":0,"4348":0,"4876":0,"4879":0,"5041":0,"5045":0,"5046":0,"5049":0,"5257":0,"5263":0};
_yuitest_coverage["/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js"].functions = {"yui2Update:37":0,"galleryUpdate:49":0,"configFn:79":0,"(anonymous 2):11":0,"_path:137":0,"Loader:207":0,"_populateCache:627":0,"_resetModules:661":0,"_inspectPage:727":0,"_requires:769":0,"_config:834":0,"formatSkin:923":0,"_addSkin:942":0,"addAlias:990":0,"addGroup:1020":0,"addModule:1081":0,"require:1365":0,"_explodeRollups:1381":0,"filterRequires:1415":0,"(anonymous 3):1580":0,"getRequires:1450":0,"isCSSLoaded:1673":0,"(anonymous 4):1726":0,"getProvides:1713":0,"calculate:1746":0,"_addLangPack:1777":0,"_setup:1824":0,"getLangPackName:1892":0,"_explode:1902":0,"_patternTest:1942":0,"getModule:1951":0,"_reduce:2017":0,"_finish:2057":0,"_onSuccess:2076":0,"_onProgress:2119":0,"_onFailure:2133":0,"_onTimeout:2160":0,"_sort:2176":0,"complete:2283":0,"onProgress:2333":0,"onTimeout:2336":0,"onSuccess:2339":0,"onFailure:2344":0,"onProgress:2362":0,"onTimeout:2365":0,"onSuccess:2368":0,"onFailure:2373":0,"_insert:2252":0,"_continue:2386":0,"(anonymous 5):2405":0,"insert:2401":0,"loadNext:2422":0,"_filter:2435":0,"_url:2466":0,"addSingle:2507":0,"resolve:2488":0,"onEnd:2696":0,"load:2687":0,"(anonymous 1):1":0,"_rollup:2726":0,"(anonymous 6):2707":0,"\"test\":2910":0,"\"test\":3064":0,"\"test\":3804":0,"test:3900":0,"test:3906":0,"\"test\":3890":0,"\"test\":4035":0,"\"test\":4202":0,"\"test\":4218":0,"\"test\":4231":0,"\"test\":4248":0,"\"test\":4262":0,"\"test\":4276":0,"\"test\":4345":0,"\"test\":4875":0,"\"test\":5040":0,"(anonymous 7):2806":0};
_yuitest_coverage["/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js"].coveredLines = 951;
_yuitest_coverage["/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js"].coveredFunctions = 78;
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1);
YUI.add('loader-base', function(Y) {

/**
 * The YUI loader core
 * @module loader
 * @submodule loader-base
 */

_yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "(anonymous 1)", 1);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 9);
if (!YUI.Env[Y.version]) {

    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 11);
(function() {
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "(anonymous 2)", 11);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 12);
var VERSION = Y.version,
            BUILD = '/build/',
            ROOT = VERSION + BUILD,
            CDN_BASE = Y.Env.base,
            GALLERY_VERSION = 'gallery-2012.08.01-13-16',
            TNT = '2in3',
            TNT_VERSION = '4',
            YUI2_VERSION = '2.9.0',
            COMBO_BASE = CDN_BASE + 'combo?',
            META = { version: VERSION,
                              root: ROOT,
                              base: Y.Env.base,
                              comboBase: COMBO_BASE,
                              skin: { defaultSkin: 'sam',
                                           base: 'assets/skins/',
                                           path: 'skin.css',
                                           after: ['cssreset',
                                                          'cssfonts',
                                                          'cssgrids',
                                                          'cssbase',
                                                          'cssreset-context',
                                                          'cssfonts-context']},
                              groups: {},
                              patterns: {} },
            groups = META.groups,
            yui2Update = function(tnt, yui2, config) {
                    
                _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "yui2Update", 37);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 39);
var root = TNT + '.' +
                        (tnt || TNT_VERSION) + '/' +
                        (yui2 || YUI2_VERSION) + BUILD,
                    base = (config && config.base) ? config.base : CDN_BASE,
                    combo = (config && config.comboBase) ? config.comboBase : COMBO_BASE;

                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 45);
groups.yui2.base = base + root;
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 46);
groups.yui2.root = root;
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 47);
groups.yui2.comboBase = combo;
            },
            galleryUpdate = function(tag, config) {
                _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "galleryUpdate", 49);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 50);
var root = (tag || GALLERY_VERSION) + BUILD,
                    base = (config && config.base) ? config.base : CDN_BASE,
                    combo = (config && config.comboBase) ? config.comboBase : COMBO_BASE;

                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 54);
groups.gallery.base = base + root;
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 55);
groups.gallery.root = root;
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 56);
groups.gallery.comboBase = combo;
            };


        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 60);
groups[VERSION] = {};

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 62);
groups.gallery = {
            ext: false,
            combine: true,
            comboBase: COMBO_BASE,
            update: galleryUpdate,
            patterns: { 'gallery-': { },
                        'lang/gallery-': {},
                        'gallerycss-': { type: 'css' } }
        };

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 72);
groups.yui2 = {
            combine: true,
            ext: false,
            comboBase: COMBO_BASE,
            update: yui2Update,
            patterns: {
                'yui2-': {
                    configFn: function(me) {
                        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "configFn", 79);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 80);
if (/-skin|reset|fonts|grids|base/.test(me.name)) {
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 81);
me.type = 'css';
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 82);
me.path = me.path.replace(/\.js/, '.css');
                            // this makes skins in builds earlier than
                            // 2.6.0 work as long as combine is false
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 85);
me.path = me.path.replace(/\/yui2-skin/,
                                             '/assets/skins/sam/yui2-skin');
                        }
                    }
                }
            }
        };

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 93);
galleryUpdate();
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 94);
yui2Update();

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 96);
YUI.Env[VERSION] = META;
    }());
}


/*jslint forin: true */

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

_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 116);
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
    YArray = Y.Array,
    _queue = GLOBAL_ENV._loaderQueue,
    META = GLOBAL_ENV[VERSION],
    SKIN_PREFIX = 'skin-',
    L = Y.Lang,
    ON_PAGE = GLOBAL_ENV.mods,
    modulekey,
    cache,
    _path = function(dir, file, type, nomin) {
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "_path", 137);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 138);
var path = dir + '/' + file;
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 139);
if (!nomin) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 140);
path += '-min';
        }
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 142);
path += '.' + (type || CSS);

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 144);
return path;
    };


    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 148);
if (!YUI.Env._cssLoaded) {
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 149);
YUI.Env._cssLoaded = {};
    }


/**
 * The component metadata is stored in Y.Env.meta.
 * Part of the loader module.
 * @property meta
 * @for YUI
 */
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 159);
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
 * @param {Function} config.onCSS Callback for the 'CSSComplete' event.  When loading YUI components with CSS the CSS is loaded first, then the script.  This provides a moment you can tie into to improve the presentation of the page while the script is loading.
 * @param {Function} config.onTimeout Callback for the 'timeout' event
 * @param {Function} config.onProgress Callback executed each time a script or css file is loaded
 * @param {Object} config.modules A list of module definitions.  See <a href="#method_addModule">Loader.addModule</a> for the supported module metadata
 * @param {Object} config.groups A list of group definitions.  Each group can contain specific definitions for `base`, `comboBase`, `combine`, and accepts a list of `modules`.
 * @param {String} config.2in3 The version of the YUI 2 in 3 wrapper to use.  The intrinsic support for YUI 2 modules in YUI 3 relies on versions of the YUI 2 components inside YUI 3 module wrappers.  These wrappers change over time to accomodate the issues that arise from running YUI 2 in a YUI 3 sandbox.
 * @param {String} config.yui2 When using the 2in3 project, you can select the version of YUI 2 to use.  Valid values are `2.2.2`, `2.3.1`, `2.4.1`, `2.5.2`, `2.6.0`, `2.7.0`, `2.8.0`, `2.8.1` and `2.9.0` [default] -- plus all versions of YUI 2 going forward.
 */
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 207);
Y.Loader = function(o) {

    _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "Loader", 207);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 209);
var self = this;
    
    //Catch no config passed.
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 212);
o = o || {};

    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 214);
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
     * Callback for the 'CSSComplete' event.  When loading YUI components
     * with CSS the CSS is loaded first, then the script.  This provides
     * a moment you can tie into to improve the presentation of the page
     * while the script is loading.
     * @method onCSS
     * @type function
     */
    // self.onCSS = null;

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
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 268);
self.context = Y;

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
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 311);
self.base = Y.Env.meta.base + Y.Env.meta.root;

    /**
     * Base path for the combo service
     * @property comboBase
     * @type string
     * @default http://yui.yahooapis.com/combo?
     */
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 319);
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
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 334);
self.combine = o.base &&
        (o.base.indexOf(self.comboBase.substr(0, 20)) > -1);
    
    /**
    * The default seperator to use between files in a combo URL
    * @property comboSep
    * @type {String}
    * @default Ampersand
    */
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 343);
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
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 355);
self.maxURLLength = MAX_URL_LENGTH;

    /**
     * Ignore modules registered on the YUI global
     * @property ignoreRegistered
     * @default false
     */
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 362);
self.ignoreRegistered = o.ignoreRegistered;

    /**
     * Root path to prepend to module path for the combo
     * service
     * @property root
     * @type string
     * @default [YUI VERSION]/build/
     */
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 371);
self.root = Y.Env.meta.root;

    /**
     * Timeout value in milliseconds.  If set, self value will be used by
     * the get utility.  the timeout event will fire if
     * a timeout occurs.
     * @property timeout
     * @type int
     */
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 380);
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

    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 398);
self.forceMap = {};

    /**
     * Should we allow rollups
     * @property allowRollup
     * @type boolean
     * @default false
     */
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 406);
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
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 441);
self.filters = {};

    /**
     * The list of requested modules
     * @property required
     * @type {string: boolean}
     */
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 448);
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
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 461);
self.patterns = {};

    /**
     * The library metadata
     * @property moduleInfo
     */
    // self.moduleInfo = Y.merge(Y.Env.meta.moduleInfo);
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 468);
self.moduleInfo = {};

    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 470);
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
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 500);
self.skin = Y.merge(Y.Env.meta.skin);

    /*
     * Map of conditional modules
     * @since 3.2.0
     */
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 506);
self.conditions = {};

    // map of modules with a hash of modules that meet the requirement
    // self.provides = {};

    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 511);
self.config = o;
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 512);
self._internal = true;

    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 514);
self._populateCache();

    /**
     * Set when beginning to compute the dependency tree.
     * Composed of what YUI reports to be loaded combined
     * with what has been loaded by any instance on the page
     * with the version number specified in the metadata.
     * @property loaded
     * @type {string: boolean}
     */
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 524);
self.loaded = GLOBAL_LOADED[VERSION];

    
    /**
    * Should Loader fetch scripts in `async`, defaults to `true`
    * @property async
    */

    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 532);
self.async = true;

    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 534);
self._inspectPage();

    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 536);
self._internal = false;

    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 538);
self._config(o);

    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 540);
self.forceMap = (self.force) ? Y.Array.hash(self.force) : {};	

    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 542);
self.testresults = null;

    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 544);
if (Y.config.tests) {
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 545);
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
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 570);
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
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 586);
self.dirty = true;

    /**
     * List of modules inserted by the utility
     * @property inserted
     * @type {string: boolean}
     */
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 593);
self.inserted = {};

    /**
     * List of skipped modules during insert() because the module
     * was not defined
     * @property skipped
     */
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 600);
self.skipped = {};

    // Y.on('yui:load', self.loadNext, self);

    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 604);
self.tested = {};

    /*
     * Cached sorted calculate results
     * @property results
     * @since 3.2.0
     */
    //self.results = {};

    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 613);
if (self.ignoreRegistered) {
        //Clear inpage already processed modules.
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 615);
self._resetModules();
    }

};

_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 620);
Y.Loader.prototype = {
    /**
    * Checks the cache for modules and conditions, if they do not exist
    * process the default metadata and populate the local moduleInfo hash.
    * @method _populateCache
    * @private
    */
    _populateCache: function() {
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "_populateCache", 627);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 628);
var self = this,
            defaults = META.modules,
            cache = GLOBAL_ENV._renderedMods,
            i;

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 633);
if (cache && !self.ignoreRegistered) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 634);
for (i in cache) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 635);
if (cache.hasOwnProperty(i)) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 636);
self.moduleInfo[i] = Y.merge(cache[i]);
                }
            }

            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 640);
cache = GLOBAL_ENV._conditions;
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 641);
for (i in cache) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 642);
if (cache.hasOwnProperty(i)) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 643);
self.conditions[i] = Y.merge(cache[i]);
                }
            }

        } else {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 648);
for (i in defaults) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 649);
if (defaults.hasOwnProperty(i)) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 650);
self.addModule(defaults[i], i);
                }
            }
        }

    },
    /**
    * Reset modules in the module cache to a pre-processed state so additional
    * computations with a different skin or language will work as expected.
    * @private _resetModules
    */
    _resetModules: function() {
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "_resetModules", 661);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 662);
var self = this, i, o;
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 663);
for (i in self.moduleInfo) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 664);
if (self.moduleInfo.hasOwnProperty(i)) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 665);
var mod = self.moduleInfo[i],
                    name = mod.name,
                    details  = (YUI.Env.mods[name] ? YUI.Env.mods[name].details : null);

                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 669);
if (details) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 670);
self.moduleInfo[name]._reset = true;
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 671);
self.moduleInfo[name].requires = details.requires || [];
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 672);
self.moduleInfo[name].optional = details.optional || [];
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 673);
self.moduleInfo[name].supersedes = details.supercedes || [];
                }

                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 676);
if (mod.defaults) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 677);
for (o in mod.defaults) {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 678);
if (mod.defaults.hasOwnProperty(o)) {
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 679);
if (mod[o]) {
                                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 680);
mod[o] = mod.defaults[o];
                            }
                        }
                    }
                }
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 685);
delete mod.langCache;
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 686);
delete mod.skinCache;
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 687);
if (mod.skinnable) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 688);
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
        }
    },
    /*
    * Check the pages meta-data and cache the result.
    * @method _inspectPage
    * @private
    */
    _inspectPage: function() {
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "_inspectPage", 727);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 728);
var self = this, v, m, req, mr, i;

        //Inspect the page for CSS only modules and mark them as loaded.
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 731);
for (i in self.moduleInfo) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 732);
if (self.moduleInfo.hasOwnProperty(i)) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 733);
v = self.moduleInfo[i];
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 734);
if (v.type && v.type === CSS) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 735);
if (self.isCSSLoaded(v.name)) {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 736);
self.loaded[i] = true;
                    }
                }
            }
        }
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 741);
for (i in ON_PAGE) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 742);
if (ON_PAGE.hasOwnProperty(i)) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 743);
v = ON_PAGE[i];
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 744);
if (v.details) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 745);
m = self.moduleInfo[v.name];
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 746);
req = v.details.requires;
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 747);
mr = m && m.requires;

                   _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 749);
if (m) {
                       _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 750);
if (!m._inspected && req && mr.length != req.length) {
                           // console.log('deleting ' + m.name);
                           _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 752);
delete m.expanded;
                       }
                   } else {
                       _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 755);
m = self.addModule(v.details, i);
                   }
                   _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 757);
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

        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "_requires", 769);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 771);
var i, rm, after_map, s,
            info = this.moduleInfo,
            m = info[mod1],
            other = info[mod2];

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 776);
if (!m || !other) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 777);
return false;
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 780);
rm = m.expanded_map;
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 781);
after_map = m.after_map;

        // check if this module should be sorted after the other
        // do this first to short circut circular deps
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 785);
if (after_map && (mod2 in after_map)) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 786);
return true;
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 789);
after_map = other.after_map;

        // and vis-versa
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 792);
if (after_map && (mod1 in after_map)) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 793);
return false;
        }

        // check if this module requires one the other supersedes
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 797);
s = info[mod2] && info[mod2].supersedes;
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 798);
if (s) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 799);
for (i = 0; i < s.length; i++) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 800);
if (this._requires(mod1, s[i])) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 801);
return true;
                }
            }
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 806);
s = info[mod1] && info[mod1].supersedes;
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 807);
if (s) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 808);
for (i = 0; i < s.length; i++) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 809);
if (this._requires(mod2, s[i])) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 810);
return false;
                }
            }
        }

        // check if this module requires the other directly
        // if (r && YArray.indexOf(r, mod2) > -1) {
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 817);
if (rm && (mod2 in rm)) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 818);
return true;
        }

        // external css files should be sorted below yui css
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 822);
if (m.ext && m.type == CSS && !other.ext && other.type == CSS) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 823);
return true;
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 826);
return false;
    },
    /**
    * Apply a new config to the Loader instance
    * @method _config
    * @private
    * @param {Object} o The new configuration
    */
    _config: function(o) {
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "_config", 834);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 835);
var i, j, val, a, f, group, groupName, self = this;
        // apply config values
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 837);
if (o) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 838);
for (i in o) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 839);
if (o.hasOwnProperty(i)) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 840);
val = o[i];
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 841);
if (i == 'require') {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 842);
self.require(val);
                    } else {_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 843);
if (i == 'skin') {
                        //If the config.skin is a string, format to the expected object
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 845);
if (typeof val === 'string') {
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 846);
self.skin.defaultSkin = o.skin;
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 847);
val = {
                                defaultSkin: val
                            };
                        }

                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 852);
Y.mix(self.skin, val, true);
                    } else {_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 853);
if (i == 'groups') {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 854);
for (j in val) {
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 855);
if (val.hasOwnProperty(j)) {
                                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 856);
groupName = j;
                                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 857);
group = val[j];
                                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 858);
self.addGroup(group, groupName);
                                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 859);
if (group.aliases) {
                                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 860);
for (a in group.aliases) {
                                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 861);
if (group.aliases.hasOwnProperty(a)) {
                                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 862);
self.addAlias(group.aliases[a], a);
                                        }
                                    }
                                }
                            }
                        }

                    } else {_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 869);
if (i == 'modules') {
                        // add a hash of module definitions
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 871);
for (j in val) {
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 872);
if (val.hasOwnProperty(j)) {
                                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 873);
self.addModule(val[j], j);
                            }
                        }
                    } else {_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 876);
if (i === 'aliases') {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 877);
for (j in val) {
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 878);
if (val.hasOwnProperty(j)) {
                                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 879);
self.addAlias(val[j], j);
                            }
                        }
                    } else {_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 882);
if (i == 'gallery') {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 883);
this.groups.gallery.update(val, o);
                    } else {_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 884);
if (i == 'yui2' || i == '2in3') {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 885);
this.groups.yui2.update(o['2in3'], o.yui2, o);
                    } else {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 887);
self[i] = val;
                    }}}}}}}
                }
            }
        }

        // fix filter
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 894);
f = self.filter;

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 896);
if (L.isString(f)) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 897);
f = f.toUpperCase();
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 898);
self.filterName = f;
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 899);
self.filter = self.FILTER_DEFS[f];
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 900);
if (f == 'DEBUG') {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 901);
self.require('yui-log', 'dump');
            }
        }
        

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 906);
if (self.lang) {
            //Removed this so that when Loader is invoked
            //it doesn't request what it doesn't need.
            //self.require('intl-base', 'intl');
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "formatSkin", 923);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 924);
var s = SKIN_PREFIX + skin;
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 925);
if (mod) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 926);
s = s + '-' + mod;
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 929);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "_addSkin", 942);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 943);
var mdef, pkg, name, nmod,
            info = this.moduleInfo,
            sinf = this.skin,
            ext = info[mod] && info[mod].ext;

        // Add a module definition for the module-specific skin css
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 949);
if (mod) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 950);
name = this.formatSkin(skin, mod);
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 951);
if (!info[name]) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 952);
mdef = info[mod];
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 953);
pkg = mdef.pkg || mod;
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 954);
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
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 964);
if (mdef.base) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 965);
nmod.base = mdef.base;
                }
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 967);
if (mdef.configFn) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 968);
nmod.configFn = mdef.configFn;
                }
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 970);
this.addModule(nmod, name);

            }
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 975);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "addAlias", 990);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 991);
YUI.Env.aliases[name] = use;
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 992);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "addGroup", 1020);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1021);
var mods = o.modules,
            self = this, i, v;

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1024);
name = name || o.name;
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1025);
o.name = name;
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1026);
self.groups[name] = o;

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1028);
if (o.patterns) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1029);
for (i in o.patterns) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1030);
if (o.patterns.hasOwnProperty(i)) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1031);
o.patterns[i].group = name;
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1032);
self.patterns[i] = o.patterns[i];
                }
            }
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1037);
if (mods) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1038);
for (i in mods) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1039);
if (mods.hasOwnProperty(i)) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1040);
v = mods[i];
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1041);
if (typeof v === 'string') {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1042);
v = { name: i, fullpath: v };
                    }
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1044);
v.group = name;
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1045);
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
     * @param {Object} [config.condition] Specifies that the module should be loaded automatically if a condition is met.  This is an object with up to three fields:
     * @param {String} [config.condition.trigger] The name of a module that can trigger the auto-load
     * @param {Function} [config.condition.test] A function that returns true when the module is to be loaded.
     * @param {String} [config.condition.when] Specifies the load order of the conditional module
     *  with regard to the position of the trigger module.
     *  This should be one of three values: `before`, `after`, or `instead`.  The default is `after`.
     * @param {Object} [config.testresults] A hash of test results from `Y.Features.all()`
     * @param {Function} [config.configFn] A function to exectute when configuring this module
     * @param {Object} config.configFn.mod The module config, modifying this object will modify it's config. Returning false will delete the module's config.
     * @param {String} [name] The module name, required if not in the module data.
     * @return {Object} the module definition or null if the object passed in did not provide all required attributes.
     */
    addModule: function(o, name) {
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "addModule", 1081);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1082);
name = name || o.name;

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1084);
if (typeof o === 'string') {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1085);
o = { name: name, fullpath: o };
        }
        
        //Only merge this data if the temp flag is set
        //from an earlier pass from a pattern or else
        //an override module (YUI_config) can not be used to
        //replace a default module.
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1092);
if (this.moduleInfo[name] && this.moduleInfo[name].temp) {
            //This catches temp modules loaded via a pattern
            // The module will be added twice, once from the pattern and
            // Once from the actual add call, this ensures that properties
            // that were added to the module the first time around (group: gallery)
            // are also added the second time around too.
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1098);
o = Y.merge(this.moduleInfo[name], o);
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1101);
o.name = name;

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1103);
if (!o || !o.name) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1104);
return null;
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1107);
if (!o.type) {
            //Always assume it's javascript unless the CSS pattern is matched.
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1109);
o.type = JS;
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1110);
var p = o.path || o.fullpath;
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1111);
if (p && this.REGEX_CSS.test(p)) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1112);
o.type = CSS;
            }
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1116);
if (!o.path && !o.fullpath) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1117);
o.path = _path(name, name, o.type);
        }
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1119);
o.supersedes = o.supersedes || o.use;

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1121);
o.ext = ('ext' in o) ? o.ext : (this._internal) ? false : true;

        // Handle submodule logic
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1124);
var subs = o.submodules, i, l, t, sup, s, smod, plugins, plug,
            j, langs, packName, supName, flatSup, flatLang, lang, ret,
            overrides, skinname, when, g,
            conditions = this.conditions, trigger;
            // , existing = this.moduleInfo[name], newr;
        
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1130);
this.moduleInfo[name] = o;

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1132);
o.requires = o.requires || [];
        
        /*
        Only allowing the cascade of requires information, since
        optional and supersedes are far more fine grained than
        a blanket requires is.
        */
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1139);
if (this.requires) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1140);
for (i = 0; i < this.requires.length; i++) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1141);
o.requires.push(this.requires[i]);
            }
        }
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1144);
if (o.group && this.groups && this.groups[o.group]) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1145);
g = this.groups[o.group];
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1146);
if (g.requires) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1147);
for (i = 0; i < g.requires.length; i++) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1148);
o.requires.push(g.requires[i]);
                }
            }
        }


        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1154);
if (!o.defaults) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1155);
o.defaults = {
                requires: o.requires ? [].concat(o.requires) : null,
                supersedes: o.supersedes ? [].concat(o.supersedes) : null,
                optional: o.optional ? [].concat(o.optional) : null
            };
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1162);
if (o.skinnable && o.ext && o.temp) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1163);
skinname = this._addSkin(this.skin.defaultSkin, name);
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1164);
o.requires.unshift(skinname);
        }
        
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1167);
if (o.requires.length) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1168);
o.requires = this.filterRequires(o.requires) || [];
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1171);
if (!o.langPack && o.lang) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1172);
langs = YArray(o.lang);
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1173);
for (j = 0; j < langs.length; j++) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1174);
lang = langs[j];
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1175);
packName = this.getLangPackName(lang, name);
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1176);
smod = this.moduleInfo[packName];
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1177);
if (!smod) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1178);
smod = this._addLangPack(lang, o, packName);
                }
            }
        }


        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1184);
if (subs) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1185);
sup = o.supersedes || [];
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1186);
l = 0;

            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1188);
for (i in subs) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1189);
if (subs.hasOwnProperty(i)) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1190);
s = subs[i];

                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1192);
s.path = s.path || _path(name, i, o.type);
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1193);
s.pkg = name;
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1194);
s.group = o.group;

                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1196);
if (s.supersedes) {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1197);
sup = sup.concat(s.supersedes);
                    }

                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1200);
smod = this.addModule(s, i);
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1201);
sup.push(i);

                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1203);
if (smod.skinnable) {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1204);
o.skinnable = true;
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1205);
overrides = this.skin.overrides;
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1206);
if (overrides && overrides[i]) {
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1207);
for (j = 0; j < overrides[i].length; j++) {
                                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1208);
skinname = this._addSkin(overrides[i][j],
                                         i, name);
                                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1210);
sup.push(skinname);
                            }
                        }
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1213);
skinname = this._addSkin(this.skin.defaultSkin,
                                        i, name);
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1215);
sup.push(skinname);
                    }

                    // looks like we are expected to work out the metadata
                    // for the parent module language packs from what is
                    // specified in the child modules.
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1221);
if (s.lang && s.lang.length) {

                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1223);
langs = YArray(s.lang);
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1224);
for (j = 0; j < langs.length; j++) {
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1225);
lang = langs[j];
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1226);
packName = this.getLangPackName(lang, name);
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1227);
supName = this.getLangPackName(lang, i);
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1228);
smod = this.moduleInfo[packName];

                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1230);
if (!smod) {
                                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1231);
smod = this._addLangPack(lang, o, packName);
                            }

                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1234);
flatSup = flatSup || YArray.hash(smod.supersedes);

                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1236);
if (!(supName in flatSup)) {
                                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1237);
smod.supersedes.push(supName);
                            }

                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1240);
o.lang = o.lang || [];

                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1242);
flatLang = flatLang || YArray.hash(o.lang);

                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1244);
if (!(lang in flatLang)) {
                                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1245);
o.lang.push(lang);
                            }

// Add rollup file, need to add to supersedes list too

                            // default packages
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1251);
packName = this.getLangPackName(ROOT_LANG, name);
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1252);
supName = this.getLangPackName(ROOT_LANG, i);

                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1254);
smod = this.moduleInfo[packName];

                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1256);
if (!smod) {
                                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1257);
smod = this._addLangPack(lang, o, packName);
                            }

                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1260);
if (!(supName in flatSup)) {
                                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1261);
smod.supersedes.push(supName);
                            }

// Add rollup file, need to add to supersedes list too

                        }
                    }

                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1269);
l++;
                }
            }
            //o.supersedes = YObject.keys(YArray.hash(sup));
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1273);
o.supersedes = YArray.dedupe(sup);
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1274);
if (this.allowRollup) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1275);
o.rollup = (l < 4) ? l : Math.min(l - 1, 4);
            }
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1279);
plugins = o.plugins;
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1280);
if (plugins) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1281);
for (i in plugins) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1282);
if (plugins.hasOwnProperty(i)) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1283);
plug = plugins[i];
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1284);
plug.pkg = name;
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1285);
plug.path = plug.path || _path(name, i, o.type);
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1286);
plug.requires = plug.requires || [];
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1287);
plug.group = o.group;
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1288);
this.addModule(plug, i);
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1289);
if (o.skinnable) {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1290);
this._addSkin(this.skin.defaultSkin, i, name);
                    }

                }
            }
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1297);
if (o.condition) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1298);
t = o.condition.trigger;
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1299);
if (YUI.Env.aliases[t]) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1300);
t = YUI.Env.aliases[t];
            }
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1302);
if (!Y.Lang.isArray(t)) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1303);
t = [t];
            }

            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1306);
for (i = 0; i < t.length; i++) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1307);
trigger = t[i];
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1308);
when = o.condition.when;
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1309);
conditions[trigger] = conditions[trigger] || {};
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1310);
conditions[trigger][name] = o.condition;
                // the 'when' attribute can be 'before', 'after', or 'instead'
                // the default is after.
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1313);
if (when && when != 'after') {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1314);
if (when == 'instead') { // replace the trigger
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1315);
o.supersedes = o.supersedes || [];
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1316);
o.supersedes.push(trigger);
                    } else { // before the trigger
                        // the trigger requires the conditional mod,
                        // so it should appear before the conditional
                        // mod if we do not intersede.
                    }
                } else { // after the trigger
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1323);
o.after = o.after || [];
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1324);
o.after.push(trigger);
                }
            }
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1329);
if (o.supersedes) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1330);
o.supersedes = this.filterRequires(o.supersedes);
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1333);
if (o.after) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1334);
o.after = this.filterRequires(o.after);
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1335);
o.after_map = YArray.hash(o.after);
        }

        // this.dirty = true;

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1340);
if (o.configFn) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1341);
ret = o.configFn(o);
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1342);
if (ret === false) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1343);
delete this.moduleInfo[name];
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1344);
delete GLOBAL_ENV._renderedMods[name];
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1345);
o = null;
            }
        }
        //Add to global cache
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1349);
if (o) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1350);
if (!GLOBAL_ENV._renderedMods) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1351);
GLOBAL_ENV._renderedMods = {};
            }
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1353);
GLOBAL_ENV._renderedMods[name] = Y.mix(GLOBAL_ENV._renderedMods[name] || {}, o);
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1354);
GLOBAL_ENV._conditions = conditions;
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1357);
return o;
    },

    /**
     * Add a requirement for one or more module
     * @method require
     * @param {string[] | string*} what the modules to load.
     */
    require: function(what) {
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "require", 1365);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1366);
var a = (typeof what === 'string') ? YArray(arguments) : what;
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1367);
this.dirty = true;
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1368);
this.required = Y.merge(this.required, YArray.hash(this.filterRequires(a)));

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1370);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "_explodeRollups", 1381);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1382);
var self = this, m, i, a, v, len, len2,
        r = self.required;

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1385);
if (!self.allowRollup) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1386);
for (i in r) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1387);
if (r.hasOwnProperty(i)) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1388);
m = self.getModule(i);
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1389);
if (m && m.use) {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1390);
len = m.use.length;
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1391);
for (a = 0; a < len; a++) {
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1392);
m = self.getModule(m.use[a]);
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1393);
if (m && m.use) {
                                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1394);
len2 = m.use.length;
                                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1395);
for (v = 0; v < len2; v++) {
                                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1396);
r[m.use[v]] = true;
                                }
                            } else {
                                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1399);
r[m.use[a]] = true;
                            }
                        }
                    }
                }
            }
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1405);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "filterRequires", 1415);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1416);
if (r) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1417);
if (!Y.Lang.isArray(r)) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1418);
r = [r];
            }
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1420);
r = Y.Array(r);
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1421);
var c = [], i, mod, o, m;

            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1423);
for (i = 0; i < r.length; i++) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1424);
mod = this.getModule(r[i]);
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1425);
if (mod && mod.use) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1426);
for (o = 0; o < mod.use.length; o++) {
                        //Must walk the other modules in case a module is a rollup of rollups (datatype)
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1428);
m = this.getModule(mod.use[o]);
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1429);
if (m && m.use) {
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1430);
c = Y.Array.dedupe([].concat(c, this.filterRequires(m.use)));
                        } else {
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1432);
c.push(mod.use[o]);
                        }
                    }
                } else {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1436);
c.push(r[i]);
                }
            }
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1439);
r = c;
        }
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1441);
return r;
    },
    /**
     * Returns an object containing properties for all modules required
     * in order to load the requested module
     * @method getRequires
     * @param {object}  mod The module definition from moduleInfo.
     * @return {array} the expanded requirement list.
     */
    getRequires: function(mod) {

        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "getRequires", 1450);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1452);
if (!mod) {
            //console.log('returning no reqs for ' + mod.name);
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1454);
return NO_REQUIREMENTS;
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1457);
if (mod._parsed) {
            //console.log('returning requires for ' + mod.name, mod.requires);
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1459);
return mod.expanded || NO_REQUIREMENTS;
        }

        //TODO add modue cache here out of scope..

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1464);
var i, m, j, add, packName, lang, testresults = this.testresults,
            name = mod.name, cond,
            adddef = ON_PAGE[name] && ON_PAGE[name].details,
            d, k, m1, go, def,
            r, old_mod,
            o, skinmod, skindef, skinpar, skinname,
            intl = mod.lang || mod.intl,
            info = this.moduleInfo,
            ftests = Y.Features && Y.Features.tests.load,
            hash, reparse;

        // console.log(name);

        // pattern match leaves module stub that needs to be filled out
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1478);
if (mod.temp && adddef) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1479);
old_mod = mod;
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1480);
mod = this.addModule(adddef, name);
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1481);
mod.group = old_mod.group;
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1482);
mod.pkg = old_mod.pkg;
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1483);
delete mod.expanded;
        }

        // console.log('cache: ' + mod.langCache + ' == ' + this.lang);
        
        //If a skin or a lang is different, reparse..
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1489);
reparse = !((!this.lang || mod.langCache === this.lang) && (mod.skinCache === this.skin.defaultSkin));

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1491);
if (mod.expanded && !reparse) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1492);
return mod.expanded;
        }
        

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1496);
d = [];
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1497);
hash = {};
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1498);
r = this.filterRequires(mod.requires);
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1499);
if (mod.lang) {
            //If a module has a lang attribute, auto add the intl requirement.
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1501);
d.unshift('intl');
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1502);
r.unshift('intl');
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1503);
intl = true;
        }
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1505);
o = this.filterRequires(mod.optional);


        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1508);
mod._parsed = true;
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1509);
mod.langCache = this.lang;
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1510);
mod.skinCache = this.skin.defaultSkin;

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1512);
for (i = 0; i < r.length; i++) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1513);
if (!hash[r[i]]) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1514);
d.push(r[i]);
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1515);
hash[r[i]] = true;
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1516);
m = this.getModule(r[i]);
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1517);
if (m) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1518);
add = this.getRequires(m);
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1519);
intl = intl || (m.expanded_map &&
                        (INTL in m.expanded_map));
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1521);
for (j = 0; j < add.length; j++) {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1522);
d.push(add[j]);
                    }
                }
            }
        }

        // get the requirements from superseded modules, if any
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1529);
r = this.filterRequires(mod.supersedes);
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1530);
if (r) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1531);
for (i = 0; i < r.length; i++) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1532);
if (!hash[r[i]]) {
                    // if this module has submodules, the requirements list is
                    // expanded to include the submodules.  This is so we can
                    // prevent dups when a submodule is already loaded and the
                    // parent is requested.
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1537);
if (mod.submodules) {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1538);
d.push(r[i]);
                    }

                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1541);
hash[r[i]] = true;
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1542);
m = this.getModule(r[i]);

                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1544);
if (m) {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1545);
add = this.getRequires(m);
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1546);
intl = intl || (m.expanded_map &&
                            (INTL in m.expanded_map));
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1548);
for (j = 0; j < add.length; j++) {
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1549);
d.push(add[j]);
                        }
                    }
                }
            }
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1556);
if (o && this.loadOptional) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1557);
for (i = 0; i < o.length; i++) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1558);
if (!hash[o[i]]) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1559);
d.push(o[i]);
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1560);
hash[o[i]] = true;
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1561);
m = info[o[i]];
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1562);
if (m) {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1563);
add = this.getRequires(m);
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1564);
intl = intl || (m.expanded_map &&
                            (INTL in m.expanded_map));
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1566);
for (j = 0; j < add.length; j++) {
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1567);
d.push(add[j]);
                        }
                    }
                }
            }
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1574);
cond = this.conditions[name];

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1576);
if (cond) {
            //Set the module to not parsed since we have conditionals and this could change the dependency tree.
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1578);
mod._parsed = false;
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1579);
if (testresults && ftests) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1580);
oeach(testresults, function(result, id) {
                    _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "(anonymous 3)", 1580);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1581);
var condmod = ftests[id].name;
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1582);
if (!hash[condmod] && ftests[id].trigger == name) {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1583);
if (result && ftests[id]) {
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1584);
hash[condmod] = true;
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1585);
d.push(condmod);
                        }
                    }
                });
            } else {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1590);
for (i in cond) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1591);
if (cond.hasOwnProperty(i)) {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1592);
if (!hash[i]) {
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1593);
def = cond[i];
                            //first see if they've specfied a ua check
                            //then see if they've got a test fn & if it returns true
                            //otherwise just having a condition block is enough
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1597);
go = def && ((!def.ua && !def.test) || (def.ua && Y.UA[def.ua]) ||
                                        (def.test && def.test(Y, r)));

                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1600);
if (go) {
                                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1601);
hash[i] = true;
                                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1602);
d.push(i);
                                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1603);
m = this.getModule(i);
                                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1604);
if (m) {
                                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1605);
add = this.getRequires(m);
                                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1606);
for (j = 0; j < add.length; j++) {
                                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1607);
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
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1619);
if (mod.skinnable) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1620);
skindef = this.skin.overrides;
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1621);
for (i in YUI.Env.aliases) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1622);
if (YUI.Env.aliases.hasOwnProperty(i)) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1623);
if (Y.Array.indexOf(YUI.Env.aliases[i], name) > -1) {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1624);
skinpar = i;
                    }
                }
            }
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1628);
if (skindef && (skindef[name] || (skinpar && skindef[skinpar]))) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1629);
skinname = name;
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1630);
if (skindef[skinpar]) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1631);
skinname = skinpar;
                }
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1633);
for (i = 0; i < skindef[skinname].length; i++) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1634);
skinmod = this._addSkin(skindef[skinname][i], name);
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1635);
if (!this.isCSSLoaded(skinmod, this._boot)) {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1636);
d.push(skinmod);
                    }
                }
            } else {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1640);
skinmod = this._addSkin(this.skin.defaultSkin, name);
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1641);
if (!this.isCSSLoaded(skinmod, this._boot)) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1642);
d.push(skinmod);
                }
            }
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1647);
mod._parsed = false;

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1649);
if (intl) {

            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1651);
if (mod.lang && !mod.langPack && Y.Intl) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1652);
lang = Y.Intl.lookupBestLang(this.lang || ROOT_LANG, mod.lang);
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1653);
packName = this.getLangPackName(lang, name);
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1654);
if (packName) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1655);
d.unshift(packName);
                }
            }
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1658);
d.unshift(INTL);
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1661);
mod.expanded_map = YArray.hash(d);

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1663);
mod.expanded = YObject.keys(mod.expanded_map);

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1665);
return mod.expanded;
    },
    /**
    * Check to see if named css module is already loaded on the page
    * @method isCSSLoaded
    * @param {String} name The name of the css file
    * @return Boolean
    */
    isCSSLoaded: function(name, skip) {
        //TODO - Make this call a batching call with name being an array
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "isCSSLoaded", 1673);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1675);
if (!name || !YUI.Env.cssStampEl || (!skip && this.ignoreRegistered)) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1676);
return false;
        }
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1678);
var el = YUI.Env.cssStampEl,
            ret = false,
            mod = YUI.Env._cssLoaded[name],
            style = el.currentStyle; //IE

        
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1684);
if (mod !== undefined) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1685);
return mod;
        }

        //Add the classname to the element
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1689);
el.className = name;

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1691);
if (!style) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1692);
style = Y.config.doc.defaultView.getComputedStyle(el, null);
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1695);
if (style && style.display === 'none') {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1696);
ret = true;
        }


        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1700);
el.className = ''; //Reset the classname to ''

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1702);
YUI.Env._cssLoaded[name] = ret;

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1704);
return ret;
    },

    /**
     * Returns a hash of module names the supplied module satisfies.
     * @method getProvides
     * @param {string} name The name of the module.
     * @return {object} what this module provides.
     */
    getProvides: function(name) {
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "getProvides", 1713);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1714);
var m = this.getModule(name), o, s;
            // supmap = this.provides;

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1717);
if (!m) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1718);
return NOT_FOUND;
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1721);
if (m && !m.provides) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1722);
o = {};
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1723);
s = m.supersedes;

            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1725);
if (s) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1726);
YArray.each(s, function(v) {
                    _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "(anonymous 4)", 1726);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1727);
Y.mix(o, this.getProvides(v));
                }, this);
            }

            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1731);
o[name] = true;
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1732);
m.provides = o;

        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1736);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "calculate", 1746);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1747);
if (o || type || this.dirty) {

            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1749);
if (o) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1750);
this._config(o);
            }

            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1753);
if (!this._init) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1754);
this._setup();
            }

            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1757);
this._explode();

            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1759);
if (this.allowRollup) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1760);
this._rollup();
            } else {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1762);
this._explodeRollups();
            }
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1764);
this._reduce();
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1765);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "_addLangPack", 1777);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1778);
var name = m.name,
            packPath, conf,
            existing = this.moduleInfo[packName];

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1782);
if (!existing) {

            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1784);
packPath = _path((m.pkg || name), packName, JS, true);

            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1786);
conf = {
                path: packPath,
                intl: true,
                langPack: true,
                ext: m.ext,
                group: m.group,
                supersedes: []
            };
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1794);
if (m.root) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1795);
conf.root = m.root;
            }
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1797);
if (m.base) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1798);
conf.base = m.base;
            }

            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1801);
if (m.configFn) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1802);
conf.configFn = m.configFn;
            }

            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1805);
this.addModule(conf, packName);

            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1807);
if (lang) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1808);
Y.Env.lang = Y.Env.lang || {};
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1809);
Y.Env.lang[lang] = Y.Env.lang[lang] || {};
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1810);
Y.Env.lang[lang][name] = true;
            }
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1814);
return this.moduleInfo[packName];
    },

    /**
     * Investigates the current YUI configuration on the page.  By default,
     * modules already detected will not be loaded again unless a force
     * option is encountered.  Called by calculate()
     * @method _setup
     * @private
     */
    _setup: function() {
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "_setup", 1824);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1825);
var info = this.moduleInfo, name, i, j, m, l,
            packName;

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1828);
for (name in info) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1829);
if (info.hasOwnProperty(name)) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1830);
m = info[name];
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1831);
if (m) {

                    // remove dups
                    //m.requires = YObject.keys(YArray.hash(m.requires));
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1835);
m.requires = YArray.dedupe(m.requires);

                    // Create lang pack modules
                    //if (m.lang && m.lang.length) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1839);
if (m.lang) {
                        // Setup root package if the module has lang defined,
                        // it needs to provide a root language pack
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1842);
packName = this.getLangPackName(ROOT_LANG, name);
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1843);
this._addLangPack(null, m, packName);
                    }

                }
            }
        }


        //l = Y.merge(this.inserted);
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1852);
l = {};

        // available modules
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1855);
if (!this.ignoreRegistered) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1856);
Y.mix(l, GLOBAL_ENV.mods);
        }

        // add the ignore list to the list of loaded packages
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1860);
if (this.ignore) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1861);
Y.mix(l, YArray.hash(this.ignore));
        }

        // expand the list to include superseded modules
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1865);
for (j in l) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1866);
if (l.hasOwnProperty(j)) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1867);
Y.mix(l, this.getProvides(j));
            }
        }

        // remove modules on the force list from the loaded list
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1872);
if (this.force) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1873);
for (i = 0; i < this.force.length; i++) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1874);
if (this.force[i] in l) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1875);
delete l[this.force[i]];
                }
            }
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1880);
Y.mix(this.loaded, l);

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1882);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "getLangPackName", 1892);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1893);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "_explode", 1902);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1904);
var r = this.required, m, reqs, done = {},
            self = this, name;

        // the setup phase is over, all modules have been created
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1908);
self.dirty = false;

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1910);
self._explodeRollups();
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1911);
r = self.required;
       
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1913);
for (name in r) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1914);
if (r.hasOwnProperty(name)) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1915);
if (!done[name]) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1916);
done[name] = true;
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1917);
m = self.getModule(name);
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1918);
if (m) {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1919);
var expound = m.expound;

                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1921);
if (expound) {
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1922);
r[expound] = self.getModule(expound);
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1923);
reqs = self.getRequires(r[expound]);
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1924);
Y.mix(r, YArray.hash(reqs));
                        }

                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1927);
reqs = self.getRequires(m);
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1928);
Y.mix(r, YArray.hash(reqs));
                    }
                }
            }
        }

    },
    /**
    * The default method used to test a module against a pattern
    * @method _patternTest
    * @private
    * @param {String} mname The module being tested
    * @param {String} pname The pattern to match
    */
    _patternTest: function(mname, pname) {
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "_patternTest", 1942);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1943);
return (mname.indexOf(pname) > -1);
    },
    /**
    * Get's the loader meta data for the requested module
    * @method getModule
    * @param {String} mname The module name to get
    * @return {Object} The module metadata
    */
    getModule: function(mname) {
        //TODO: Remove name check - it's a quick hack to fix pattern WIP
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "getModule", 1951);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1953);
if (!mname) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1954);
return null;
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1957);
var p, found, pname,
            m = this.moduleInfo[mname],
            patterns = this.patterns;

        // check the patterns library to see if we should automatically add
        // the module with defaults
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1963);
if (!m || (m && m.ext)) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1964);
for (pname in patterns) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1965);
if (patterns.hasOwnProperty(pname)) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1966);
p = patterns[pname];
                    
                    //There is no test method, create a default one that tests
                    // the pattern against the mod name
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1970);
if (!p.test) {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1971);
p.test = this._patternTest;
                    }

                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1974);
if (p.test(mname, pname)) {
                        // use the metadata supplied for the pattern
                        // as the module definition.
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1977);
found = p;
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1978);
break;
                    }
                }
            }
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1984);
if (!m) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1985);
if (found) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1986);
if (p.action) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1987);
p.action.call(this, mname, pname);
                } else {
                    // ext true or false?
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1990);
m = this.addModule(Y.merge(found), mname);
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1991);
if (found.configFn) {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1992);
m.configFn = found.configFn;
                    }
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1994);
m.temp = true;
                }
            }
        } else {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1998);
if (found && m && found.configFn && !m.configFn) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 1999);
m.configFn = found.configFn;
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2000);
m.configFn(m);
            }
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2004);
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

        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "_reduce", 2017);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2019);
r = r || this.required;

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2021);
var i, j, s, m, type = this.loadType,
        ignore = this.ignore ? YArray.hash(this.ignore) : false;

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2024);
for (i in r) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2025);
if (r.hasOwnProperty(i)) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2026);
m = this.getModule(i);
                // remove if already loaded
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2028);
if (((this.loaded[i] || ON_PAGE[i]) &&
                        !this.forceMap[i] && !this.ignoreRegistered) ||
                        (type && m && m.type != type)) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2031);
delete r[i];
                }
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2033);
if (ignore && ignore[i]) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2034);
delete r[i];
                }
                // remove anything this module supersedes
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2037);
s = m && m.supersedes;
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2038);
if (s) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2039);
for (j = 0; j < s.length; j++) {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2040);
if (s[j] in r) {
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2041);
delete r[s[j]];
                        }
                    }
                }
            }
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2048);
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

        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "_finish", 2057);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2059);
_queue.running = false;

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2061);
var onEnd = this.onEnd;
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2062);
if (onEnd) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2063);
onEnd.call(this.context, {
                msg: msg,
                data: this.data,
                success: success
            });
        }
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2069);
this._continue();
    },
    /**
    * The default Loader onSuccess handler, calls this.onSuccess with a payload
    * @method _onSuccess
    * @private
    */
    _onSuccess: function() {
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "_onSuccess", 2076);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2077);
var self = this, skipped = Y.merge(self.skipped), fn,
            failed = [], rreg = self.requireRegistration,
            success, msg, i, mod;
        
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2081);
for (i in skipped) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2082);
if (skipped.hasOwnProperty(i)) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2083);
delete self.inserted[i];
            }
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2087);
self.skipped = {};
        
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2089);
for (i in self.inserted) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2090);
if (self.inserted.hasOwnProperty(i)) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2091);
mod = self.getModule(i);
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2092);
if (mod && rreg && mod.type == JS && !(i in YUI.Env.mods)) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2093);
failed.push(i);
                } else {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2095);
Y.mix(self.loaded, self.getProvides(i));
                }
            }
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2100);
fn = self.onSuccess;
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2101);
msg = (failed.length) ? 'notregistered' : 'success';
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2102);
success = !(failed.length);
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2103);
if (fn) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2104);
fn.call(self.context, {
                msg: msg,
                data: self.data,
                success: success,
                failed: failed,
                skipped: skipped
            });
        }
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2112);
self._finish(msg, success);
    },
    /**
    * The default Loader onProgress handler, calls this.onProgress with a payload
    * @method _onProgress
    * @private
    */
    _onProgress: function(e) {
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "_onProgress", 2119);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2120);
var self = this;
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2121);
if (self.onProgress) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2122);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "_onFailure", 2133);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2134);
var f = this.onFailure, msg = [], i = 0, len = o.errors.length;
        
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2136);
for (i; i < len; i++) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2137);
msg.push(o.errors[i].error);
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2140);
msg = msg.join(',');

        
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2143);
if (f) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2144);
f.call(this.context, {
                msg: msg,
                data: this.data,
                success: false
            });
        }
        
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2151);
this._finish(msg, false);

    },

    /**
    * The default Loader onTimeout handler, calls this.onTimeout with a payload
    * @method _onTimeout
    * @private
    */
    _onTimeout: function() {
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "_onTimeout", 2160);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2161);
var f = this.onTimeout;
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2162);
if (f) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2163);
f.call(this.context, {
                msg: 'timeout',
                data: this.data,
                success: false
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "_sort", 2176);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2179);
var s = YObject.keys(this.required),
            // loaded = this.loaded,
            //TODO Move this out of scope
            done = {},
            p = 0, l, a, b, j, k, moved, doneKey;

        // keep going until we make a pass without moving anything
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2186);
for (;;) {

            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2188);
l = s.length;
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2189);
moved = false;

            // start the loop after items that are already sorted
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2192);
for (j = p; j < l; j++) {

                // check the next module on the list to see if its
                // dependencies have been met
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2196);
a = s[j];

                // check everything below current item and move if we
                // find a requirement for the current item
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2200);
for (k = j + 1; k < l; k++) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2201);
doneKey = a + s[k];

                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2203);
if (!done[doneKey] && this._requires(a, s[k])) {

                        // extract the dependency so we can move it up
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2206);
b = s.splice(k, 1);

                        // insert the dependency above the item that
                        // requires it
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2210);
s.splice(j, 0, b[0]);

                        // only swap two dependencies once to short circut
                        // circular dependencies
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2214);
done[doneKey] = true;

                        // keep working
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2217);
moved = true;

                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2219);
break;
                    }
                }

                // jump out of loop if we moved something
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2224);
if (moved) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2225);
break;
                // this item is sorted, move our pointer and keep going
                } else {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2228);
p++;
                }
            }

            // when we make it here and moved is false, we are
            // finished sorting
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2234);
if (!moved) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2235);
break;
            }

        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2240);
this.sorted = s;
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


        // restore the state at the time of the request
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "_insert", 2252);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2256);
if (source) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2257);
this._config(source);
        }

        // build the dependency list
        // don't include type so we can process CSS and script in
        // one pass when the type is not specified.
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2263);
if (!skipcalc) {
            //this.calculate(o);
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2267);
var modules = this.resolve(!skipcalc),
            self = this, comp = 0, actions = 0;

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2270);
if (type) {
            //Filter out the opposite type and reset the array so the checks later work
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2272);
modules[((type === JS) ? CSS : JS)] = [];
        }
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2274);
if (modules.js.length) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2275);
comp++;
        }
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2277);
if (modules.css.length) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2278);
comp++;
        }

        //console.log('Resolved Modules: ', modules);

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2283);
var complete = function(d) {
            _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "complete", 2283);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2284);
actions++;
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2285);
var errs = {}, i = 0, u = '', fn;

            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2287);
if (d && d.errors) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2288);
for (i = 0; i < d.errors.length; i++) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2289);
if (d.errors[i].request) {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2290);
u = d.errors[i].request.url;
                    } else {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2292);
u = d.errors[i];
                    }
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2294);
errs[u] = u;
                }
            }
            
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2298);
if (d && d.data && d.data.length && (d.type === 'success')) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2299);
for (i = 0; i < d.data.length; i++) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2300);
self.inserted[d.data[i].name] = true;
                }
            }

            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2304);
if (actions === comp) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2305);
self._loading = null;
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2306);
if (d && d.fn) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2307);
fn = d.fn;
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2308);
delete d.fn;
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2309);
fn.call(self, d);
                }
            }
        };

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2314);
this._loading = true;

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2316);
if (!modules.js.length && !modules.css.length) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2317);
actions = -1;
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2318);
complete({
                fn: self._onSuccess
            });
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2321);
return;
        }
        

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2325);
if (modules.css.length) { //Load CSS first
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2326);
Y.Get.css(modules.css, {
                data: modules.cssMods,
                attributes: self.cssAttributes,
                insertBefore: self.insertBefore,
                charset: self.charset,
                timeout: self.timeout,
                context: self,
                onProgress: function(e) {
                    _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "onProgress", 2333);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2334);
self._onProgress.call(self, e);
                },
                onTimeout: function(d) {
                    _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "onTimeout", 2336);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2337);
self._onTimeout.call(self, d);
                },
                onSuccess: function(d) {
                    _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "onSuccess", 2339);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2340);
d.type = 'success';
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2341);
d.fn = self._onSuccess;
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2342);
complete.call(self, d);
                },
                onFailure: function(d) {
                    _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "onFailure", 2344);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2345);
d.type = 'failure';
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2346);
d.fn = self._onFailure;
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2347);
complete.call(self, d);
                }
            });
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2352);
if (modules.js.length) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2353);
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
                    _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "onProgress", 2362);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2363);
self._onProgress.call(self, e);
                },
                onTimeout: function(d) {
                    _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "onTimeout", 2365);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2366);
self._onTimeout.call(self, d);
                },
                onSuccess: function(d) {
                    _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "onSuccess", 2368);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2369);
d.type = 'success';
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2370);
d.fn = self._onSuccess;
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2371);
complete.call(self, d);
                },
                onFailure: function(d) {
                    _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "onFailure", 2373);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2374);
d.type = 'failure';
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2375);
d.fn = self._onFailure;
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2376);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "_continue", 2386);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2387);
if (!(_queue.running) && _queue.size() > 0) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2388);
_queue.running = true;
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2389);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "insert", 2401);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2402);
var self = this, copy = Y.merge(this);
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2403);
delete copy.require;
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2404);
delete copy.dirty;
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2405);
_queue.add(function() {
            _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "(anonymous 5)", 2405);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2406);
self._insert(copy, o, type, skipsort);
        });
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2408);
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
    loadNext: function(mname) {
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "loadNext", 2422);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2423);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "_filter", 2435);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2436);
var f = this.filter,
            hasFilter = name && (name in this.filters),
            modFilter = hasFilter && this.filters[name],
            groupName = group || (this.moduleInfo[name] ? this.moduleInfo[name].group : null);

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2441);
if (groupName && this.groups[groupName] && this.groups[groupName].filter) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2442);
modFilter = this.groups[groupName].filter;
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2443);
hasFilter = true;
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2446);
if (u) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2447);
if (hasFilter) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2448);
f = (L.isString(modFilter)) ? this.FILTER_DEFS[modFilter.toUpperCase()] || null : modFilter;
            }
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2450);
if (f) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2451);
u = u.replace(new RegExp(f.searchExp, 'g'), f.replaceStr);
            }
        }
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2454);
return u;
    },

    /**
     * Generates the full url for a module
     * @method _url
     * @param {string} path the path fragment.
     * @param {String} name The name of the module
     * @param {String} [base=self.base] The base url to use
     * @return {string} the full url.
     * @private
     */
    _url: function(path, name, base) {
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "_url", 2466);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2467);
return this._filter((base || this.base || '') + path, name);
    },
    /**
    * Returns an Object hash of file arrays built from `loader.sorted` or from an arbitrary list of sorted modules.
    * @method resolve
    * @param {Boolean} [calc=false] Perform a loader.calculate() before anything else
    * @param {Array} [s=loader.sorted] An override for the loader.sorted array
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
    resolve: function(calc, s) {

        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "resolve", 2488);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2490);
var len, i, m, url, fn, msg, attr, group, groupName, j, frag,
            comboSource, comboSources, mods, comboBase,
            base, urls, u = [], tmpBase, baseLen, resCombos = {},
            self = this, comboSep, maxURLLength, singles = [],
            inserted = (self.ignoreRegistered) ? {} : self.inserted,
            resolved = { js: [], jsMods: [], css: [], cssMods: [] },
            type = self.loadType || 'js';

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2498);
if (self.skin.overrides || self.skin.defaultSkin !== DEFAULT_SKIN || self.ignoreRegistered) { 
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2499);
self._resetModules();
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2502);
if (calc) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2503);
self.calculate();
        }
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2505);
s = s || self.sorted;

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2507);
var addSingle = function(m) {
            
            _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "addSingle", 2507);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2509);
if (m) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2510);
group = (m.group && self.groups[m.group]) || NOT_FOUND;
                
                //Always assume it's async
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2513);
if (group.async === false) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2514);
m.async = group.async;
                }

                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2517);
url = (m.fullpath) ? self._filter(m.fullpath, s[i]) :
                      self._url(m.path, s[i], group.base || m.base);
                
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2520);
if (m.attributes || m.async === false) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2521);
url = {
                        url: url,
                        async: m.async
                    };
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2525);
if (m.attributes) {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2526);
url.attributes = m.attributes;
                    }
                }
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2529);
resolved[m.type].push(url);
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2530);
resolved[m.type + 'Mods'].push(m);
            } else {
            }
            
        };

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2536);
len = s.length;

        // the default combo base
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2539);
comboBase = self.comboBase;

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2541);
url = comboBase;

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2543);
comboSources = {};

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2545);
for (i = 0; i < len; i++) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2546);
comboSource = comboBase;
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2547);
m = self.getModule(s[i]);
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2548);
groupName = m && m.group;
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2549);
group = self.groups[groupName];
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2550);
if (groupName && group) {

                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2552);
if (!group.combine || m.fullpath) {
                    //This is not a combo module, skip it and load it singly later.
                    //singles.push(s[i]);
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2555);
addSingle(m);
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2556);
continue;
                }
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2558);
m.combine = true;
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2559);
if (group.comboBase) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2560);
comboSource = group.comboBase;
                }

                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2563);
if ("root" in group && L.isValue(group.root)) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2564);
m.root = group.root;
                }
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2566);
m.comboSep = group.comboSep || self.comboSep;
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2567);
m.maxURLLength = group.maxURLLength || self.maxURLLength;
            } else {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2569);
if (!self.combine) {
                    //This is not a combo module, skip it and load it singly later.
                    //singles.push(s[i]);
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2572);
addSingle(m);
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2573);
continue;
                }
            }

            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2577);
comboSources[comboSource] = comboSources[comboSource] || [];
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2578);
comboSources[comboSource].push(m);
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2581);
for (j in comboSources) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2582);
if (comboSources.hasOwnProperty(j)) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2583);
resCombos[j] = resCombos[j] || { js: [], jsMods: [], css: [], cssMods: [] };
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2584);
url = j;
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2585);
mods = comboSources[j];
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2586);
len = mods.length;
                
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2588);
if (len) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2589);
for (i = 0; i < len; i++) {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2590);
if (inserted[mods[i]]) {
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2591);
continue;
                        }
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2593);
m = mods[i];
                        // Do not try to combine non-yui JS unless combo def
                        // is found
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2596);
if (m && (m.combine || !m.ext)) {
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2597);
resCombos[j].comboSep = m.comboSep;
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2598);
resCombos[j].group = m.group;
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2599);
resCombos[j].maxURLLength = m.maxURLLength;
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2600);
frag = ((L.isValue(m.root)) ? m.root : self.root) + (m.path || m.fullpath);
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2601);
frag = self._filter(frag, m.name);
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2602);
resCombos[j][m.type].push(frag);
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2603);
resCombos[j][m.type + 'Mods'].push(m);
                        } else {
                            //Add them to the next process..
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2606);
if (mods[i]) {
                                //singles.push(mods[i].name);
                                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2608);
addSingle(mods[i]);
                            }
                        }

                    }
                }
            }
        }


        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2618);
for (j in resCombos) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2619);
base = j;
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2620);
comboSep = resCombos[base].comboSep || self.comboSep;
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2621);
maxURLLength = resCombos[base].maxURLLength || self.maxURLLength;
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2622);
for (type in resCombos[base]) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2623);
if (type === JS || type === CSS) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2624);
urls = resCombos[base][type];
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2625);
mods = resCombos[base][type + 'Mods'];
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2626);
len = urls.length;
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2627);
tmpBase = base + urls.join(comboSep);
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2628);
baseLen = tmpBase.length;
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2629);
if (maxURLLength <= base.length) {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2630);
maxURLLength = MAX_URL_LENGTH;
                    }
                    
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2633);
if (len) {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2634);
if (baseLen > maxURLLength) {
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2635);
u = [];
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2636);
for (s = 0; s < len; s++) {
                                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2637);
u.push(urls[s]);
                                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2638);
tmpBase = base + u.join(comboSep);

                                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2640);
if (tmpBase.length > maxURLLength) {
                                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2641);
m = u.pop();
                                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2642);
tmpBase = base + u.join(comboSep);
                                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2643);
resolved[type].push(self._filter(tmpBase, null, resCombos[base].group));
                                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2644);
u = [];
                                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2645);
if (m) {
                                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2646);
u.push(m);
                                    }
                                }
                            }
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2650);
if (u.length) {
                                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2651);
tmpBase = base + u.join(comboSep);
                                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2652);
resolved[type].push(self._filter(tmpBase, null, resCombos[base].group));
                            }
                        } else {
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2655);
resolved[type].push(self._filter(tmpBase, null, resCombos[base].group));
                        }
                    }
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2658);
resolved[type + 'Mods'] = resolved[type + 'Mods'].concat(mods);
                }
            }
        }

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2663);
resCombos = null;

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2665);
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
    @param {Callback} cb Executed after all load operations are complete
    */
    load: function(cb) {
        _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "load", 2687);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2688);
if (!cb) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2689);
return;
        }
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2691);
var self = this,
            out = self.resolve(true);
        
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2694);
self.data = out;

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2696);
self.onEnd = function() {
            _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "onEnd", 2696);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2697);
cb.apply(self.context || self, arguments);
        };

        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2700);
self.insert();
    }
};



}, '@VERSION@' ,{requires:['get', 'features']});
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2707);
YUI.add('loader-rollup', function(Y) {

/**
 * Optional automatic rollup logic for reducing http connections
 * when not using a combo service.
 * @module loader
 * @submodule rollup
 */

/**
 * Look for rollup packages to determine if all of the modules a
 * rollup supersedes are required.  If so, include the rollup to
 * help reduce the total number of connections required.  Called
 * by calculate().  This is an optional feature, and requires the
 * appropriate submodule to function.
 * @method _rollup
 * @for Loader
 * @private
 */
_yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "(anonymous 6)", 2707);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2726);
Y.Loader.prototype._rollup = function() {
    _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "_rollup", 2726);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2727);
var i, j, m, s, r = this.required, roll,
        info = this.moduleInfo, rolled, c, smod;

    // find and cache rollup modules
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2731);
if (this.dirty || !this.rollups) {
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2732);
this.rollups = {};
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2733);
for (i in info) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2734);
if (info.hasOwnProperty(i)) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2735);
m = this.getModule(i);
                // if (m && m.rollup && m.supersedes) {
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2737);
if (m && m.rollup) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2738);
this.rollups[i] = m;
                }
            }
        }
    }

    // make as many passes as needed to pick up rollup rollups
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2745);
for (;;) {
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2746);
rolled = false;

        // go through the rollup candidates
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2749);
for (i in this.rollups) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2750);
if (this.rollups.hasOwnProperty(i)) {
                // there can be only one, unless forced
                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2752);
if (!r[i] && ((!this.loaded[i]) || this.forceMap[i])) {
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2753);
m = this.getModule(i);
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2754);
s = m.supersedes || [];
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2755);
roll = false;

                    // @TODO remove continue
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2758);
if (!m.rollup) {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2759);
continue;
                    }

                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2762);
c = 0;

                    // check the threshold
                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2765);
for (j = 0; j < s.length; j++) {
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2766);
smod = info[s[j]];

                        // if the superseded module is loaded, we can't
                        // load the rollup unless it has been forced.
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2770);
if (this.loaded[s[j]] && !this.forceMap[s[j]]) {
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2771);
roll = false;
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2772);
break;
                        // increment the counter if this module is required.
                        // if we are beyond the rollup threshold, we will
                        // use the rollup module
                        } else {_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2776);
if (r[s[j]] && m.type == smod.type) {
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2777);
c++;
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2778);
roll = (c >= m.rollup);
                            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2779);
if (roll) {
                                _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2780);
break;
                            }
                        }}
                    }

                    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2785);
if (roll) {
                        // add the rollup
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2787);
r[i] = true;
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2788);
rolled = true;

                        // expand the rollup's dependencies
                        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2791);
this.getRequires(m);
                    }
                }
            }
        }

        // if we made it here w/o rolling up something, we are done
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2798);
if (!rolled) {
            _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2799);
break;
        }
    }
};


}, '@VERSION@' ,{requires:['loader-base']});
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2806);
YUI.add('loader-yui3', function(Y) {

/* This file is auto-generated by src/loader/scripts/meta_join.js */

/**
 * YUI 3 module metadata
 * @module loader
 * @submodule yui3
 */
_yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "(anonymous 7)", 2806);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2815);
YUI.Env[Y.version].modules = YUI.Env[Y.version].modules || {
    "align-plugin": {
        "requires": [
            "node-screen",
            "node-pluginhost"
        ]
    },
    "anim": {
        "use": [
            "anim-base",
            "anim-color",
            "anim-curve",
            "anim-easing",
            "anim-node-plugin",
            "anim-scroll",
            "anim-xy"
        ]
    },
    "anim-base": {
        "requires": [
            "base-base",
            "node-style"
        ]
    },
    "anim-color": {
        "requires": [
            "anim-base"
        ]
    },
    "anim-curve": {
        "requires": [
            "anim-xy"
        ]
    },
    "anim-easing": {
        "requires": [
            "anim-base"
        ]
    },
    "anim-node-plugin": {
        "requires": [
            "node-pluginhost",
            "anim-base"
        ]
    },
    "anim-scroll": {
        "requires": [
            "anim-base"
        ]
    },
    "anim-shape-transform": {
        "requires": [
            "anim-base",
            "anim-easing",
            "matrix"
        ]
    },
    "anim-xy": {
        "requires": [
            "anim-base",
            "node-screen"
        ]
    },
    "app": {
        "use": [
            "app-base",
            "app-transitions",
            "lazy-model-list",
            "model",
            "model-list",
            "model-sync-rest",
            "router",
            "view",
            "view-node-map"
        ]
    },
    "app-base": {
        "requires": [
            "classnamemanager",
            "pjax-base",
            "router",
            "view"
        ]
    },
    "app-transitions": {
        "requires": [
            "app-base"
        ]
    },
    "app-transitions-css": {
        "type": "css"
    },
    "app-transitions-native": {
        "condition": {
            "name": "app-transitions-native",
            "test": function (Y) {
    _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "\"test\"", 2910);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2911);
var doc  = Y.config.doc,
        node = doc ? doc.documentElement : null;

    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2914);
if (node && node.style) {
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2915);
return ('MozTransition' in node.style || 'WebkitTransition' in node.style);
    }

    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 2918);
return false;
},
            "trigger": "app-transitions"
        },
        "requires": [
            "app-transitions",
            "app-transitions-css",
            "parallel",
            "transition"
        ]
    },
    "array-extras": {
        "requires": [
            "yui-base"
        ]
    },
    "array-invoke": {
        "requires": [
            "yui-base"
        ]
    },
    "arraylist": {
        "requires": [
            "yui-base"
        ]
    },
    "arraylist-add": {
        "requires": [
            "arraylist"
        ]
    },
    "arraylist-filter": {
        "requires": [
            "arraylist"
        ]
    },
    "arraysort": {
        "requires": [
            "yui-base"
        ]
    },
    "async-queue": {
        "requires": [
            "event-custom"
        ]
    },
    "attribute": {
        "use": [
            "attribute-base",
            "attribute-complex"
        ]
    },
    "attribute-base": {
        "requires": [
            "attribute-core",
            "attribute-events",
            "attribute-extras"
        ]
    },
    "attribute-complex": {
        "requires": [
            "attribute-base"
        ]
    },
    "attribute-core": {
        "requires": [
            "yui-base"
        ]
    },
    "attribute-events": {
        "requires": [
            "event-custom"
        ]
    },
    "attribute-extras": {
        "requires": [
            "yui-base"
        ]
    },
    "autocomplete": {
        "use": [
            "autocomplete-base",
            "autocomplete-sources",
            "autocomplete-list",
            "autocomplete-plugin"
        ]
    },
    "autocomplete-base": {
        "optional": [
            "autocomplete-sources"
        ],
        "requires": [
            "array-extras",
            "base-build",
            "escape",
            "event-valuechange",
            "node-base"
        ]
    },
    "autocomplete-filters": {
        "requires": [
            "array-extras",
            "text-wordbreak"
        ]
    },
    "autocomplete-filters-accentfold": {
        "requires": [
            "array-extras",
            "text-accentfold",
            "text-wordbreak"
        ]
    },
    "autocomplete-highlighters": {
        "requires": [
            "array-extras",
            "highlight-base"
        ]
    },
    "autocomplete-highlighters-accentfold": {
        "requires": [
            "array-extras",
            "highlight-accentfold"
        ]
    },
    "autocomplete-list": {
        "after": [
            "autocomplete-sources"
        ],
        "lang": [
            "en"
        ],
        "requires": [
            "autocomplete-base",
            "event-resize",
            "node-screen",
            "selector-css3",
            "shim-plugin",
            "widget",
            "widget-position",
            "widget-position-align"
        ],
        "skinnable": true
    },
    "autocomplete-list-keys": {
        "condition": {
            "name": "autocomplete-list-keys",
            "test": function (Y) {
    // Only add keyboard support to autocomplete-list if this doesn't appear to
    // be an iOS or Android-based mobile device.
    //
    // There's currently no feasible way to actually detect whether a device has
    // a hardware keyboard, so this sniff will have to do. It can easily be
    // overridden by manually loading the autocomplete-list-keys module.
    //
    // Worth noting: even though iOS supports bluetooth keyboards, Mobile Safari
    // doesn't fire the keyboard events used by AutoCompleteList, so there's
    // no point loading the -keys module even when a bluetooth keyboard may be
    // available.
    _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "\"test\"", 3064);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 3076);
return !(Y.UA.ios || Y.UA.android);
},
            "trigger": "autocomplete-list"
        },
        "requires": [
            "autocomplete-list",
            "base-build"
        ]
    },
    "autocomplete-plugin": {
        "requires": [
            "autocomplete-list",
            "node-pluginhost"
        ]
    },
    "autocomplete-sources": {
        "optional": [
            "io-base",
            "json-parse",
            "jsonp",
            "yql"
        ],
        "requires": [
            "autocomplete-base"
        ]
    },
    "base": {
        "use": [
            "base-base",
            "base-pluginhost",
            "base-build"
        ]
    },
    "base-base": {
        "after": [
            "attribute-complex"
        ],
        "requires": [
            "base-core",
            "attribute-base"
        ]
    },
    "base-build": {
        "requires": [
            "base-base"
        ]
    },
    "base-core": {
        "requires": [
            "attribute-core"
        ]
    },
    "base-pluginhost": {
        "requires": [
            "base-base",
            "pluginhost"
        ]
    },
    "button": {
        "requires": [
            "button-core",
            "cssbutton",
            "widget"
        ]
    },
    "button-core": {
        "requires": [
            "attribute-core",
            "classnamemanager",
            "node-base"
        ]
    },
    "button-group": {
        "requires": [
            "button-plugin",
            "cssbutton",
            "widget"
        ]
    },
    "button-plugin": {
        "requires": [
            "button-core",
            "cssbutton",
            "node-pluginhost"
        ]
    },
    "cache": {
        "use": [
            "cache-base",
            "cache-offline",
            "cache-plugin"
        ]
    },
    "cache-base": {
        "requires": [
            "base"
        ]
    },
    "cache-offline": {
        "requires": [
            "cache-base",
            "json"
        ]
    },
    "cache-plugin": {
        "requires": [
            "plugin",
            "cache-base"
        ]
    },
    "calendar": {
        "lang": [
            "de",
            "en",
            "fr",
            "ja",
            "nb-NO",
            "pt-BR",
            "ru",
            "zh-HANT-TW"
        ],
        "requires": [
            "calendar-base",
            "calendarnavigator"
        ],
        "skinnable": true
    },
    "calendar-base": {
        "lang": [
            "de",
            "en",
            "fr",
            "ja",
            "nb-NO",
            "pt-BR",
            "ru",
            "zh-HANT-TW"
        ],
        "requires": [
            "widget",
            "substitute",
            "datatype-date",
            "datatype-date-math",
            "cssgrids"
        ],
        "skinnable": true
    },
    "calendarnavigator": {
        "requires": [
            "plugin",
            "classnamemanager",
            "datatype-date",
            "node",
            "substitute"
        ],
        "skinnable": true
    },
    "charts": {
        "requires": [
            "charts-base"
        ]
    },
    "charts-base": {
        "requires": [
            "dom",
            "datatype-number",
            "datatype-date",
            "event-custom",
            "event-mouseenter",
            "event-touch",
            "widget",
            "widget-position",
            "widget-stack",
            "graphics"
        ]
    },
    "charts-legend": {
        "requires": [
            "charts-base"
        ]
    },
    "classnamemanager": {
        "requires": [
            "yui-base"
        ]
    },
    "clickable-rail": {
        "requires": [
            "slider-base"
        ]
    },
    "collection": {
        "use": [
            "array-extras",
            "arraylist",
            "arraylist-add",
            "arraylist-filter",
            "array-invoke"
        ]
    },
    "console": {
        "lang": [
            "en",
            "es",
            "ja"
        ],
        "requires": [
            "yui-log",
            "widget",
            "substitute"
        ],
        "skinnable": true
    },
    "console-filters": {
        "requires": [
            "plugin",
            "console"
        ],
        "skinnable": true
    },
    "controller": {
        "use": [
            "router"
        ]
    },
    "cookie": {
        "requires": [
            "yui-base"
        ]
    },
    "createlink-base": {
        "requires": [
            "editor-base"
        ]
    },
    "cssbase": {
        "after": [
            "cssreset",
            "cssfonts",
            "cssgrids",
            "cssreset-context",
            "cssfonts-context",
            "cssgrids-context"
        ],
        "type": "css"
    },
    "cssbase-context": {
        "after": [
            "cssreset",
            "cssfonts",
            "cssgrids",
            "cssreset-context",
            "cssfonts-context",
            "cssgrids-context"
        ],
        "type": "css"
    },
    "cssbutton": {
        "type": "css"
    },
    "cssfonts": {
        "type": "css"
    },
    "cssfonts-context": {
        "type": "css"
    },
    "cssgrids": {
        "optional": [
            "cssreset",
            "cssfonts"
        ],
        "type": "css"
    },
    "cssgrids-base": {
        "optional": [
            "cssreset",
            "cssfonts"
        ],
        "type": "css"
    },
    "cssgrids-units": {
        "optional": [
            "cssreset",
            "cssfonts"
        ],
        "requires": [
            "cssgrids-base"
        ],
        "type": "css"
    },
    "cssreset": {
        "type": "css"
    },
    "cssreset-context": {
        "type": "css"
    },
    "dataschema": {
        "use": [
            "dataschema-base",
            "dataschema-json",
            "dataschema-xml",
            "dataschema-array",
            "dataschema-text"
        ]
    },
    "dataschema-array": {
        "requires": [
            "dataschema-base"
        ]
    },
    "dataschema-base": {
        "requires": [
            "base"
        ]
    },
    "dataschema-json": {
        "requires": [
            "dataschema-base",
            "json"
        ]
    },
    "dataschema-text": {
        "requires": [
            "dataschema-base"
        ]
    },
    "dataschema-xml": {
        "requires": [
            "dataschema-base"
        ]
    },
    "datasource": {
        "use": [
            "datasource-local",
            "datasource-io",
            "datasource-get",
            "datasource-function",
            "datasource-cache",
            "datasource-jsonschema",
            "datasource-xmlschema",
            "datasource-arrayschema",
            "datasource-textschema",
            "datasource-polling"
        ]
    },
    "datasource-arrayschema": {
        "requires": [
            "datasource-local",
            "plugin",
            "dataschema-array"
        ]
    },
    "datasource-cache": {
        "requires": [
            "datasource-local",
            "plugin",
            "cache-base"
        ]
    },
    "datasource-function": {
        "requires": [
            "datasource-local"
        ]
    },
    "datasource-get": {
        "requires": [
            "datasource-local",
            "get"
        ]
    },
    "datasource-io": {
        "requires": [
            "datasource-local",
            "io-base"
        ]
    },
    "datasource-jsonschema": {
        "requires": [
            "datasource-local",
            "plugin",
            "dataschema-json"
        ]
    },
    "datasource-local": {
        "requires": [
            "base"
        ]
    },
    "datasource-polling": {
        "requires": [
            "datasource-local"
        ]
    },
    "datasource-textschema": {
        "requires": [
            "datasource-local",
            "plugin",
            "dataschema-text"
        ]
    },
    "datasource-xmlschema": {
        "requires": [
            "datasource-local",
            "plugin",
            "dataschema-xml"
        ]
    },
    "datatable": {
        "use": [
            "datatable-core",
            "datatable-table",
            "datatable-head",
            "datatable-body",
            "datatable-base",
            "datatable-column-widths",
            "datatable-message",
            "datatable-mutable",
            "datatable-sort",
            "datatable-datasource"
        ]
    },
    "datatable-base": {
        "requires": [
            "datatable-core",
            "datatable-table",
            "base-build",
            "widget"
        ],
        "skinnable": true
    },
    "datatable-base-deprecated": {
        "requires": [
            "recordset-base",
            "widget",
            "substitute",
            "event-mouseenter"
        ],
        "skinnable": true
    },
    "datatable-body": {
        "requires": [
            "datatable-core",
            "view",
            "classnamemanager"
        ]
    },
    "datatable-column-widths": {
        "requires": [
            "datatable-base"
        ]
    },
    "datatable-core": {
        "requires": [
            "escape",
            "model-list",
            "node-event-delegate"
        ]
    },
    "datatable-datasource": {
        "requires": [
            "datatable-base",
            "plugin",
            "datasource-local"
        ]
    },
    "datatable-datasource-deprecated": {
        "requires": [
            "datatable-base-deprecated",
            "plugin",
            "datasource-local"
        ]
    },
    "datatable-deprecated": {
        "use": [
            "datatable-base-deprecated",
            "datatable-datasource-deprecated",
            "datatable-sort-deprecated",
            "datatable-scroll-deprecated"
        ]
    },
    "datatable-head": {
        "requires": [
            "datatable-core",
            "view",
            "classnamemanager"
        ]
    },
    "datatable-message": {
        "lang": [
            "en"
        ],
        "requires": [
            "datatable-base"
        ],
        "skinnable": true
    },
    "datatable-mutable": {
        "requires": [
            "datatable-base"
        ]
    },
    "datatable-scroll": {
        "requires": [
            "datatable-base",
            "datatable-column-widths",
            "dom-screen"
        ],
        "skinnable": true
    },
    "datatable-scroll-deprecated": {
        "requires": [
            "datatable-base-deprecated",
            "plugin"
        ]
    },
    "datatable-sort": {
        "lang": [
            "en"
        ],
        "requires": [
            "datatable-base"
        ],
        "skinnable": true
    },
    "datatable-sort-deprecated": {
        "lang": [
            "en"
        ],
        "requires": [
            "datatable-base-deprecated",
            "plugin",
            "recordset-sort"
        ]
    },
    "datatable-table": {
        "requires": [
            "datatable-core",
            "datatable-head",
            "datatable-body",
            "view",
            "classnamemanager"
        ]
    },
    "datatype": {
        "use": [
            "datatype-number",
            "datatype-date",
            "datatype-xml"
        ]
    },
    "datatype-date": {
        "supersedes": [
            "datatype-date-format"
        ],
        "use": [
            "datatype-date-parse",
            "datatype-date-format"
        ]
    },
    "datatype-date-format": {
        "lang": [
            "ar",
            "ar-JO",
            "ca",
            "ca-ES",
            "da",
            "da-DK",
            "de",
            "de-AT",
            "de-DE",
            "el",
            "el-GR",
            "en",
            "en-AU",
            "en-CA",
            "en-GB",
            "en-IE",
            "en-IN",
            "en-JO",
            "en-MY",
            "en-NZ",
            "en-PH",
            "en-SG",
            "en-US",
            "es",
            "es-AR",
            "es-BO",
            "es-CL",
            "es-CO",
            "es-EC",
            "es-ES",
            "es-MX",
            "es-PE",
            "es-PY",
            "es-US",
            "es-UY",
            "es-VE",
            "fi",
            "fi-FI",
            "fr",
            "fr-BE",
            "fr-CA",
            "fr-FR",
            "hi",
            "hi-IN",
            "id",
            "id-ID",
            "it",
            "it-IT",
            "ja",
            "ja-JP",
            "ko",
            "ko-KR",
            "ms",
            "ms-MY",
            "nb",
            "nb-NO",
            "nl",
            "nl-BE",
            "nl-NL",
            "pl",
            "pl-PL",
            "pt",
            "pt-BR",
            "ro",
            "ro-RO",
            "ru",
            "ru-RU",
            "sv",
            "sv-SE",
            "th",
            "th-TH",
            "tr",
            "tr-TR",
            "vi",
            "vi-VN",
            "zh-Hans",
            "zh-Hans-CN",
            "zh-Hant",
            "zh-Hant-HK",
            "zh-Hant-TW"
        ]
    },
    "datatype-date-math": {
        "requires": [
            "yui-base"
        ]
    },
    "datatype-date-parse": {},
    "datatype-number": {
        "use": [
            "datatype-number-parse",
            "datatype-number-format"
        ]
    },
    "datatype-number-format": {},
    "datatype-number-parse": {},
    "datatype-xml": {
        "use": [
            "datatype-xml-parse",
            "datatype-xml-format"
        ]
    },
    "datatype-xml-format": {},
    "datatype-xml-parse": {},
    "dd": {
        "use": [
            "dd-ddm-base",
            "dd-ddm",
            "dd-ddm-drop",
            "dd-drag",
            "dd-proxy",
            "dd-constrain",
            "dd-drop",
            "dd-scroll",
            "dd-delegate"
        ]
    },
    "dd-constrain": {
        "requires": [
            "dd-drag"
        ]
    },
    "dd-ddm": {
        "requires": [
            "dd-ddm-base",
            "event-resize"
        ]
    },
    "dd-ddm-base": {
        "requires": [
            "node",
            "base",
            "yui-throttle",
            "classnamemanager"
        ]
    },
    "dd-ddm-drop": {
        "requires": [
            "dd-ddm"
        ]
    },
    "dd-delegate": {
        "requires": [
            "dd-drag",
            "dd-drop-plugin",
            "event-mouseenter"
        ]
    },
    "dd-drag": {
        "requires": [
            "dd-ddm-base"
        ]
    },
    "dd-drop": {
        "requires": [
            "dd-drag",
            "dd-ddm-drop"
        ]
    },
    "dd-drop-plugin": {
        "requires": [
            "dd-drop"
        ]
    },
    "dd-gestures": {
        "condition": {
            "name": "dd-gestures",
            "test": function(Y) {
    _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "\"test\"", 3804);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 3805);
return ((Y.config.win && ("ontouchstart" in Y.config.win)) && !(Y.UA.chrome && Y.UA.chrome < 6));
},
            "trigger": "dd-drag"
        },
        "requires": [
            "dd-drag",
            "event-synthetic",
            "event-gestures"
        ]
    },
    "dd-plugin": {
        "optional": [
            "dd-constrain",
            "dd-proxy"
        ],
        "requires": [
            "dd-drag"
        ]
    },
    "dd-proxy": {
        "requires": [
            "dd-drag"
        ]
    },
    "dd-scroll": {
        "requires": [
            "dd-drag"
        ]
    },
    "dial": {
        "lang": [
            "en",
            "es"
        ],
        "requires": [
            "widget",
            "dd-drag",
            "substitute",
            "event-mouseenter",
            "event-move",
            "event-key",
            "transition",
            "intl"
        ],
        "skinnable": true
    },
    "dom": {
        "use": [
            "dom-base",
            "dom-screen",
            "dom-style",
            "selector-native",
            "selector"
        ]
    },
    "dom-base": {
        "requires": [
            "dom-core"
        ]
    },
    "dom-core": {
        "requires": [
            "oop",
            "features"
        ]
    },
    "dom-deprecated": {
        "requires": [
            "dom-base"
        ]
    },
    "dom-screen": {
        "requires": [
            "dom-base",
            "dom-style"
        ]
    },
    "dom-style": {
        "requires": [
            "dom-base"
        ]
    },
    "dom-style-ie": {
        "condition": {
            "name": "dom-style-ie",
            "test": function (Y) {

    _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "\"test\"", 3890);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 3892);
var testFeature = Y.Features.test,
        addFeature = Y.Features.add,
        WINDOW = Y.config.win,
        DOCUMENT = Y.config.doc,
        DOCUMENT_ELEMENT = 'documentElement',
        ret = false;

    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 3899);
addFeature('style', 'computedStyle', {
        test: function() {
            _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "test", 3900);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 3901);
return WINDOW && 'getComputedStyle' in WINDOW;
        }
    });

    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 3905);
addFeature('style', 'opacity', {
        test: function() {
            _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "test", 3906);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 3907);
return DOCUMENT && 'opacity' in DOCUMENT[DOCUMENT_ELEMENT].style;
        }
    });

    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 3911);
ret =  (!testFeature('style', 'opacity') &&
            !testFeature('style', 'computedStyle'));

    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 3914);
return ret;
},
            "trigger": "dom-style"
        },
        "requires": [
            "dom-style"
        ]
    },
    "dump": {
        "requires": [
            "yui-base"
        ]
    },
    "editor": {
        "use": [
            "frame",
            "editor-selection",
            "exec-command",
            "editor-base",
            "editor-para",
            "editor-br",
            "editor-bidi",
            "editor-tab",
            "createlink-base"
        ]
    },
    "editor-base": {
        "requires": [
            "base",
            "frame",
            "node",
            "exec-command",
            "editor-selection"
        ]
    },
    "editor-bidi": {
        "requires": [
            "editor-base"
        ]
    },
    "editor-br": {
        "requires": [
            "editor-base"
        ]
    },
    "editor-lists": {
        "requires": [
            "editor-base"
        ]
    },
    "editor-para": {
        "requires": [
            "editor-para-base"
        ]
    },
    "editor-para-base": {
        "requires": [
            "editor-base"
        ]
    },
    "editor-para-ie": {
        "condition": {
            "name": "editor-para-ie",
            "trigger": "editor-para",
            "ua": "ie",
            "when": "instead"
        },
        "requires": [
            "editor-para-base"
        ]
    },
    "editor-selection": {
        "requires": [
            "node"
        ]
    },
    "editor-tab": {
        "requires": [
            "editor-base"
        ]
    },
    "escape": {
        "requires": [
            "yui-base"
        ]
    },
    "event": {
        "after": [
            "node-base"
        ],
        "use": [
            "event-base",
            "event-delegate",
            "event-synthetic",
            "event-mousewheel",
            "event-mouseenter",
            "event-key",
            "event-focus",
            "event-resize",
            "event-hover",
            "event-outside",
            "event-touch",
            "event-move",
            "event-flick",
            "event-valuechange"
        ]
    },
    "event-base": {
        "after": [
            "node-base"
        ],
        "requires": [
            "event-custom-base"
        ]
    },
    "event-base-ie": {
        "after": [
            "event-base"
        ],
        "condition": {
            "name": "event-base-ie",
            "test": function(Y) {
    _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "\"test\"", 4035);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 4036);
var imp = Y.config.doc && Y.config.doc.implementation;
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 4037);
return (imp && (!imp.hasFeature('Events', '2.0')));
},
            "trigger": "node-base"
        },
        "requires": [
            "node-base"
        ]
    },
    "event-contextmenu": {
        "requires": [
            "event-synthetic",
            "dom-screen"
        ]
    },
    "event-custom": {
        "use": [
            "event-custom-base",
            "event-custom-complex"
        ]
    },
    "event-custom-base": {
        "requires": [
            "oop"
        ]
    },
    "event-custom-complex": {
        "requires": [
            "event-custom-base"
        ]
    },
    "event-delegate": {
        "requires": [
            "node-base"
        ]
    },
    "event-flick": {
        "requires": [
            "node-base",
            "event-touch",
            "event-synthetic"
        ]
    },
    "event-focus": {
        "requires": [
            "event-synthetic"
        ]
    },
    "event-gestures": {
        "use": [
            "event-flick",
            "event-move"
        ]
    },
    "event-hover": {
        "requires": [
            "event-mouseenter"
        ]
    },
    "event-key": {
        "requires": [
            "event-synthetic"
        ]
    },
    "event-mouseenter": {
        "requires": [
            "event-synthetic"
        ]
    },
    "event-mousewheel": {
        "requires": [
            "node-base"
        ]
    },
    "event-move": {
        "requires": [
            "node-base",
            "event-touch",
            "event-synthetic"
        ]
    },
    "event-outside": {
        "requires": [
            "event-synthetic"
        ]
    },
    "event-resize": {
        "requires": [
            "node-base",
            "event-synthetic"
        ]
    },
    "event-simulate": {
        "requires": [
            "event-base"
        ]
    },
    "event-synthetic": {
        "requires": [
            "node-base",
            "event-custom-complex"
        ]
    },
    "event-touch": {
        "requires": [
            "node-base"
        ]
    },
    "event-valuechange": {
        "requires": [
            "event-focus",
            "event-synthetic"
        ]
    },
    "exec-command": {
        "requires": [
            "frame"
        ]
    },
    "features": {
        "requires": [
            "yui-base"
        ]
    },
    "file": {
        "requires": [
            "file-flash",
            "file-html5"
        ]
    },
    "file-flash": {
        "requires": [
            "base"
        ]
    },
    "file-html5": {
        "requires": [
            "base"
        ]
    },
    "frame": {
        "requires": [
            "base",
            "node",
            "selector-css3",
            "substitute",
            "yui-throttle"
        ]
    },
    "get": {
        "requires": [
            "yui-base"
        ]
    },
    "graphics": {
        "requires": [
            "node",
            "event-custom",
            "pluginhost",
            "matrix",
            "classnamemanager"
        ]
    },
    "graphics-canvas": {
        "condition": {
            "name": "graphics-canvas",
            "test": function(Y) {
    _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "\"test\"", 4202);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 4203);
var DOCUMENT = Y.config.doc,
        useCanvas = Y.config.defaultGraphicEngine && Y.config.defaultGraphicEngine == "canvas",
		canvas = DOCUMENT && DOCUMENT.createElement("canvas"),
        svg = (DOCUMENT && DOCUMENT.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"));
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 4207);
return (!svg || useCanvas) && (canvas && canvas.getContext && canvas.getContext("2d"));
},
            "trigger": "graphics"
        },
        "requires": [
            "graphics"
        ]
    },
    "graphics-canvas-default": {
        "condition": {
            "name": "graphics-canvas-default",
            "test": function(Y) {
    _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "\"test\"", 4218);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 4219);
var DOCUMENT = Y.config.doc,
        useCanvas = Y.config.defaultGraphicEngine && Y.config.defaultGraphicEngine == "canvas",
		canvas = DOCUMENT && DOCUMENT.createElement("canvas"),
        svg = (DOCUMENT && DOCUMENT.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"));
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 4223);
return (!svg || useCanvas) && (canvas && canvas.getContext && canvas.getContext("2d"));
},
            "trigger": "graphics"
        }
    },
    "graphics-svg": {
        "condition": {
            "name": "graphics-svg",
            "test": function(Y) {
    _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "\"test\"", 4231);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 4232);
var DOCUMENT = Y.config.doc,
        useSVG = !Y.config.defaultGraphicEngine || Y.config.defaultGraphicEngine != "canvas",
		canvas = DOCUMENT && DOCUMENT.createElement("canvas"),
        svg = (DOCUMENT && DOCUMENT.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"));
    
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 4237);
return svg && (useSVG || !canvas);
},
            "trigger": "graphics"
        },
        "requires": [
            "graphics"
        ]
    },
    "graphics-svg-default": {
        "condition": {
            "name": "graphics-svg-default",
            "test": function(Y) {
    _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "\"test\"", 4248);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 4249);
var DOCUMENT = Y.config.doc,
        useSVG = !Y.config.defaultGraphicEngine || Y.config.defaultGraphicEngine != "canvas",
		canvas = DOCUMENT && DOCUMENT.createElement("canvas"),
        svg = (DOCUMENT && DOCUMENT.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"));
    
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 4254);
return svg && (useSVG || !canvas);
},
            "trigger": "graphics"
        }
    },
    "graphics-vml": {
        "condition": {
            "name": "graphics-vml",
            "test": function(Y) {
    _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "\"test\"", 4262);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 4263);
var DOCUMENT = Y.config.doc,
		canvas = DOCUMENT && DOCUMENT.createElement("canvas");
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 4265);
return (DOCUMENT && !DOCUMENT.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") && (!canvas || !canvas.getContext || !canvas.getContext("2d")));
},
            "trigger": "graphics"
        },
        "requires": [
            "graphics"
        ]
    },
    "graphics-vml-default": {
        "condition": {
            "name": "graphics-vml-default",
            "test": function(Y) {
    _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "\"test\"", 4276);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 4277);
var DOCUMENT = Y.config.doc,
		canvas = DOCUMENT && DOCUMENT.createElement("canvas");
    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 4279);
return (DOCUMENT && !DOCUMENT.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") && (!canvas || !canvas.getContext || !canvas.getContext("2d")));
},
            "trigger": "graphics"
        }
    },
    "handlebars": {
        "use": [
            "handlebars-compiler"
        ]
    },
    "handlebars-base": {
        "requires": [
            "escape"
        ]
    },
    "handlebars-compiler": {
        "requires": [
            "handlebars-base"
        ]
    },
    "highlight": {
        "use": [
            "highlight-base",
            "highlight-accentfold"
        ]
    },
    "highlight-accentfold": {
        "requires": [
            "highlight-base",
            "text-accentfold"
        ]
    },
    "highlight-base": {
        "requires": [
            "array-extras",
            "classnamemanager",
            "escape",
            "text-wordbreak"
        ]
    },
    "history": {
        "use": [
            "history-base",
            "history-hash",
            "history-hash-ie",
            "history-html5"
        ]
    },
    "history-base": {
        "requires": [
            "event-custom-complex"
        ]
    },
    "history-hash": {
        "after": [
            "history-html5"
        ],
        "requires": [
            "event-synthetic",
            "history-base",
            "yui-later"
        ]
    },
    "history-hash-ie": {
        "condition": {
            "name": "history-hash-ie",
            "test": function (Y) {
    _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "\"test\"", 4345);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 4346);
var docMode = Y.config.doc && Y.config.doc.documentMode;

    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 4348);
return Y.UA.ie && (!('onhashchange' in Y.config.win) ||
            !docMode || docMode < 8);
},
            "trigger": "history-hash"
        },
        "requires": [
            "history-hash",
            "node-base"
        ]
    },
    "history-html5": {
        "optional": [
            "json"
        ],
        "requires": [
            "event-base",
            "history-base",
            "node-base"
        ]
    },
    "imageloader": {
        "requires": [
            "base-base",
            "node-style",
            "node-screen"
        ]
    },
    "intl": {
        "requires": [
            "intl-base",
            "event-custom"
        ]
    },
    "intl-base": {
        "requires": [
            "yui-base"
        ]
    },
    "io": {
        "use": [
            "io-base",
            "io-xdr",
            "io-form",
            "io-upload-iframe",
            "io-queue"
        ]
    },
    "io-base": {
        "requires": [
            "event-custom-base",
            "querystring-stringify-simple"
        ]
    },
    "io-form": {
        "requires": [
            "io-base",
            "node-base"
        ]
    },
    "io-nodejs": {
        "condition": {
            "name": "io-nodejs",
            "trigger": "io-base",
            "ua": "nodejs"
        },
        "requires": [
            "io-base"
        ]
    },
    "io-queue": {
        "requires": [
            "io-base",
            "queue-promote"
        ]
    },
    "io-upload-iframe": {
        "requires": [
            "io-base",
            "node-base"
        ]
    },
    "io-xdr": {
        "requires": [
            "io-base",
            "datatype-xml-parse"
        ]
    },
    "json": {
        "use": [
            "json-parse",
            "json-stringify"
        ]
    },
    "json-parse": {
        "requires": [
            "yui-base"
        ]
    },
    "json-stringify": {
        "requires": [
            "yui-base"
        ]
    },
    "jsonp": {
        "requires": [
            "get",
            "oop"
        ]
    },
    "jsonp-url": {
        "requires": [
            "jsonp"
        ]
    },
    "lazy-model-list": {
        "requires": [
            "model-list"
        ]
    },
    "loader": {
        "use": [
            "loader-base",
            "loader-rollup",
            "loader-yui3"
        ]
    },
    "loader-base": {
        "requires": [
            "get",
            "features"
        ]
    },
    "loader-rollup": {
        "requires": [
            "loader-base"
        ]
    },
    "loader-yui3": {
        "requires": [
            "loader-base"
        ]
    },
    "matrix": {
        "requires": [
            "yui-base"
        ]
    },
    "model": {
        "requires": [
            "base-build",
            "escape",
            "json-parse"
        ]
    },
    "model-list": {
        "requires": [
            "array-extras",
            "array-invoke",
            "arraylist",
            "base-build",
            "escape",
            "json-parse",
            "model"
        ]
    },
    "model-sync-rest": {
        "requires": [
            "model",
            "io-base",
            "json-stringify"
        ]
    },
    "node": {
        "use": [
            "node-base",
            "node-event-delegate",
            "node-pluginhost",
            "node-screen",
            "node-style"
        ]
    },
    "node-base": {
        "requires": [
            "event-base",
            "node-core",
            "dom-base"
        ]
    },
    "node-core": {
        "requires": [
            "dom-core",
            "selector"
        ]
    },
    "node-deprecated": {
        "requires": [
            "node-base"
        ]
    },
    "node-event-delegate": {
        "requires": [
            "node-base",
            "event-delegate"
        ]
    },
    "node-event-html5": {
        "requires": [
            "node-base"
        ]
    },
    "node-event-simulate": {
        "requires": [
            "node-base",
            "event-simulate"
        ]
    },
    "node-flick": {
        "requires": [
            "classnamemanager",
            "transition",
            "event-flick",
            "plugin"
        ],
        "skinnable": true
    },
    "node-focusmanager": {
        "requires": [
            "attribute",
            "node",
            "plugin",
            "node-event-simulate",
            "event-key",
            "event-focus"
        ]
    },
    "node-load": {
        "requires": [
            "node-base",
            "io-base"
        ]
    },
    "node-menunav": {
        "requires": [
            "node",
            "classnamemanager",
            "plugin",
            "node-focusmanager"
        ],
        "skinnable": true
    },
    "node-pluginhost": {
        "requires": [
            "node-base",
            "pluginhost"
        ]
    },
    "node-screen": {
        "requires": [
            "dom-screen",
            "node-base"
        ]
    },
    "node-style": {
        "requires": [
            "dom-style",
            "node-base"
        ]
    },
    "oop": {
        "requires": [
            "yui-base"
        ]
    },
    "overlay": {
        "requires": [
            "widget",
            "widget-stdmod",
            "widget-position",
            "widget-position-align",
            "widget-stack",
            "widget-position-constrain"
        ],
        "skinnable": true
    },
    "panel": {
        "requires": [
            "widget",
            "widget-autohide",
            "widget-buttons",
            "widget-modality",
            "widget-position",
            "widget-position-align",
            "widget-position-constrain",
            "widget-stack",
            "widget-stdmod"
        ],
        "skinnable": true
    },
    "parallel": {
        "requires": [
            "yui-base"
        ]
    },
    "pjax": {
        "requires": [
            "pjax-base",
            "io-base"
        ]
    },
    "pjax-base": {
        "requires": [
            "classnamemanager",
            "node-event-delegate",
            "router"
        ]
    },
    "pjax-plugin": {
        "requires": [
            "node-pluginhost",
            "pjax",
            "plugin"
        ]
    },
    "plugin": {
        "requires": [
            "base-base"
        ]
    },
    "pluginhost": {
        "use": [
            "pluginhost-base",
            "pluginhost-config"
        ]
    },
    "pluginhost-base": {
        "requires": [
            "yui-base"
        ]
    },
    "pluginhost-config": {
        "requires": [
            "pluginhost-base"
        ]
    },
    "profiler": {
        "requires": [
            "yui-base"
        ]
    },
    "querystring": {
        "use": [
            "querystring-parse",
            "querystring-stringify"
        ]
    },
    "querystring-parse": {
        "requires": [
            "yui-base",
            "array-extras"
        ]
    },
    "querystring-parse-simple": {
        "requires": [
            "yui-base"
        ]
    },
    "querystring-stringify": {
        "requires": [
            "yui-base"
        ]
    },
    "querystring-stringify-simple": {
        "requires": [
            "yui-base"
        ]
    },
    "queue-promote": {
        "requires": [
            "yui-base"
        ]
    },
    "range-slider": {
        "requires": [
            "slider-base",
            "slider-value-range",
            "clickable-rail"
        ]
    },
    "recordset": {
        "use": [
            "recordset-base",
            "recordset-sort",
            "recordset-filter",
            "recordset-indexer"
        ]
    },
    "recordset-base": {
        "requires": [
            "base",
            "arraylist"
        ]
    },
    "recordset-filter": {
        "requires": [
            "recordset-base",
            "array-extras",
            "plugin"
        ]
    },
    "recordset-indexer": {
        "requires": [
            "recordset-base",
            "plugin"
        ]
    },
    "recordset-sort": {
        "requires": [
            "arraysort",
            "recordset-base",
            "plugin"
        ]
    },
    "resize": {
        "use": [
            "resize-base",
            "resize-proxy",
            "resize-constrain"
        ]
    },
    "resize-base": {
        "requires": [
            "base",
            "widget",
            "substitute",
            "event",
            "oop",
            "dd-drag",
            "dd-delegate",
            "dd-drop"
        ],
        "skinnable": true
    },
    "resize-constrain": {
        "requires": [
            "plugin",
            "resize-base"
        ]
    },
    "resize-plugin": {
        "optional": [
            "resize-constrain"
        ],
        "requires": [
            "resize-base",
            "plugin"
        ]
    },
    "resize-proxy": {
        "requires": [
            "plugin",
            "resize-base"
        ]
    },
    "router": {
        "optional": [
            "querystring-parse"
        ],
        "requires": [
            "array-extras",
            "base-build",
            "history"
        ]
    },
    "scrollview": {
        "requires": [
            "scrollview-base",
            "scrollview-scrollbars"
        ]
    },
    "scrollview-base": {
        "requires": [
            "widget",
            "event-gestures",
            "event-mousewheel",
            "transition"
        ],
        "skinnable": true
    },
    "scrollview-base-ie": {
        "condition": {
            "name": "scrollview-base-ie",
            "trigger": "scrollview-base",
            "ua": "ie"
        },
        "requires": [
            "scrollview-base"
        ]
    },
    "scrollview-list": {
        "requires": [
            "plugin",
            "classnamemanager"
        ],
        "skinnable": true
    },
    "scrollview-paginator": {
        "requires": [
            "plugin",
            "classnamemanager"
        ]
    },
    "scrollview-scrollbars": {
        "requires": [
            "classnamemanager",
            "transition",
            "plugin"
        ],
        "skinnable": true
    },
    "selector": {
        "requires": [
            "selector-native"
        ]
    },
    "selector-css2": {
        "condition": {
            "name": "selector-css2",
            "test": function (Y) {
    _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "\"test\"", 4875);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 4876);
var DOCUMENT = Y.config.doc,
        ret = DOCUMENT && !('querySelectorAll' in DOCUMENT);

    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 4879);
return ret;
},
            "trigger": "selector"
        },
        "requires": [
            "selector-native"
        ]
    },
    "selector-css3": {
        "requires": [
            "selector-native",
            "selector-css2"
        ]
    },
    "selector-native": {
        "requires": [
            "dom-base"
        ]
    },
    "shim-plugin": {
        "requires": [
            "node-style",
            "node-pluginhost"
        ]
    },
    "slider": {
        "use": [
            "slider-base",
            "slider-value-range",
            "clickable-rail",
            "range-slider"
        ]
    },
    "slider-base": {
        "requires": [
            "widget",
            "dd-constrain",
            "substitute",
            "event-key"
        ],
        "skinnable": true
    },
    "slider-value-range": {
        "requires": [
            "slider-base"
        ]
    },
    "sortable": {
        "requires": [
            "dd-delegate",
            "dd-drop-plugin",
            "dd-proxy"
        ]
    },
    "sortable-scroll": {
        "requires": [
            "dd-scroll",
            "sortable"
        ]
    },
    "stylesheet": {
        "requires": [
            "yui-base"
        ]
    },
    "substitute": {
        "optional": [
            "dump"
        ],
        "requires": [
            "yui-base"
        ]
    },
    "swf": {
        "requires": [
            "event-custom",
            "node",
            "swfdetect",
            "escape"
        ]
    },
    "swfdetect": {
        "requires": [
            "yui-base"
        ]
    },
    "tabview": {
        "requires": [
            "widget",
            "widget-parent",
            "widget-child",
            "tabview-base",
            "node-pluginhost",
            "node-focusmanager"
        ],
        "skinnable": true
    },
    "tabview-base": {
        "requires": [
            "node-event-delegate",
            "classnamemanager",
            "skin-sam-tabview"
        ]
    },
    "tabview-plugin": {
        "requires": [
            "tabview-base"
        ]
    },
    "test": {
        "requires": [
            "event-simulate",
            "event-custom",
            "substitute",
            "json-stringify"
        ],
        "skinnable": true
    },
    "test-console": {
        "requires": [
            "console-filters",
            "test"
        ],
        "skinnable": true
    },
    "text": {
        "use": [
            "text-accentfold",
            "text-wordbreak"
        ]
    },
    "text-accentfold": {
        "requires": [
            "array-extras",
            "text-data-accentfold"
        ]
    },
    "text-data-accentfold": {
        "requires": [
            "yui-base"
        ]
    },
    "text-data-wordbreak": {
        "requires": [
            "yui-base"
        ]
    },
    "text-wordbreak": {
        "requires": [
            "array-extras",
            "text-data-wordbreak"
        ]
    },
    "transition": {
        "requires": [
            "node-style"
        ]
    },
    "transition-timer": {
        "condition": {
            "name": "transition-timer",
            "test": function (Y) {
    _yuitest_coverfunc("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", "\"test\"", 5040);
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 5041);
var DOCUMENT = Y.config.doc,
        node = (DOCUMENT) ? DOCUMENT.documentElement: null,
        ret = true;

    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 5045);
if (node && node.style) {
        _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 5046);
ret = !('MozTransition' in node.style || 'WebkitTransition' in node.style);
    } 

    _yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 5049);
return ret;
},
            "trigger": "transition"
        },
        "requires": [
            "transition"
        ]
    },
    "uploader": {
        "requires": [
            "uploader-html5",
            "uploader-flash"
        ]
    },
    "uploader-deprecated": {
        "requires": [
            "event-custom",
            "node",
            "base",
            "swf"
        ]
    },
    "uploader-flash": {
        "requires": [
            "swf",
            "widget",
            "substitute",
            "base",
            "cssbutton",
            "node",
            "event-custom",
            "file-flash",
            "uploader-queue"
        ]
    },
    "uploader-html5": {
        "requires": [
            "widget",
            "node-event-simulate",
            "substitute",
            "file-html5",
            "uploader-queue"
        ]
    },
    "uploader-queue": {
        "requires": [
            "base"
        ]
    },
    "view": {
        "requires": [
            "base-build",
            "node-event-delegate"
        ]
    },
    "view-node-map": {
        "requires": [
            "view"
        ]
    },
    "widget": {
        "use": [
            "widget-base",
            "widget-htmlparser",
            "widget-skin",
            "widget-uievents"
        ]
    },
    "widget-anim": {
        "requires": [
            "anim-base",
            "plugin",
            "widget"
        ]
    },
    "widget-autohide": {
        "requires": [
            "base-build",
            "event-key",
            "event-outside",
            "widget"
        ]
    },
    "widget-base": {
        "requires": [
            "attribute",
            "base-base",
            "base-pluginhost",
            "classnamemanager",
            "event-focus",
            "node-base",
            "node-style"
        ],
        "skinnable": true
    },
    "widget-base-ie": {
        "condition": {
            "name": "widget-base-ie",
            "trigger": "widget-base",
            "ua": "ie"
        },
        "requires": [
            "widget-base"
        ]
    },
    "widget-buttons": {
        "requires": [
            "button-plugin",
            "cssbutton",
            "widget-stdmod"
        ]
    },
    "widget-child": {
        "requires": [
            "base-build",
            "widget"
        ]
    },
    "widget-htmlparser": {
        "requires": [
            "widget-base"
        ]
    },
    "widget-locale": {
        "requires": [
            "widget-base"
        ]
    },
    "widget-modality": {
        "requires": [
            "base-build",
            "event-outside",
            "widget"
        ],
        "skinnable": true
    },
    "widget-parent": {
        "requires": [
            "arraylist",
            "base-build",
            "widget"
        ]
    },
    "widget-position": {
        "requires": [
            "base-build",
            "node-screen",
            "widget"
        ]
    },
    "widget-position-align": {
        "requires": [
            "widget-position"
        ]
    },
    "widget-position-constrain": {
        "requires": [
            "widget-position"
        ]
    },
    "widget-skin": {
        "requires": [
            "widget-base"
        ]
    },
    "widget-stack": {
        "requires": [
            "base-build",
            "widget"
        ],
        "skinnable": true
    },
    "widget-stdmod": {
        "requires": [
            "base-build",
            "widget"
        ]
    },
    "widget-uievents": {
        "requires": [
            "node-event-delegate",
            "widget-base"
        ]
    },
    "yql": {
        "requires": [
            "jsonp",
            "jsonp-url"
        ]
    },
    "yui": {},
    "yui-base": {},
    "yui-later": {
        "requires": [
            "yui-base"
        ]
    },
    "yui-log": {
        "requires": [
            "yui-base"
        ]
    },
    "yui-throttle": {
        "requires": [
            "yui-base"
        ]
    }
};
_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 5257);
YUI.Env[Y.version].md5 = '5a681478005a2bdc375c61ddfa610d1e';


}, '@VERSION@' ,{requires:['loader-base']});


_yuitest_coverline("/home/yui/src/yui3/src/loader/build_rollup_tmp/loader.js", 5263);
YUI.add('loader', function(Y){}, '@VERSION@' ,{use:['loader-base', 'loader-rollup', 'loader-yui3' ]});

