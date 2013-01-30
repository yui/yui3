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
_yuitest_coverage["build/base-core/base-core.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/base-core/base-core.js",
    code: []
};
_yuitest_coverage["build/base-core/base-core.js"].code=["YUI.add('base-core', function (Y, NAME) {","","    /**","     * The base module provides the Base class, which objects requiring attribute and custom event support can extend.","     * The module also provides two ways to reuse code - It augments Base with the Plugin.Host interface which provides","     * plugin support and also provides the BaseCore.build method which provides a way to build custom classes using extensions.","     *","     * @module base","     */","","    /**","     * <p>The base-core module provides the BaseCore class, the lightest version of Base,","     * which provides Base's basic lifecycle management and ATTRS construction support,","     * but doesn't fire init/destroy or attribute change events.</p>","     *","     * <p>It mixes in AttributeCore, which is the lightest version of Attribute</p>","     *","     * @module base","     * @submodule base-core","     */","    var O = Y.Object,","        L = Y.Lang,","        DOT = \".\",","        INITIALIZED = \"initialized\",","        DESTROYED = \"destroyed\",","        INITIALIZER = \"initializer\",","        VALUE = \"value\",","        OBJECT_CONSTRUCTOR = Object.prototype.constructor,","        DEEP = \"deep\",","        SHALLOW = \"shallow\",","        DESTRUCTOR = \"destructor\",","","        AttributeCore = Y.AttributeCore,","","        _wlmix = function(r, s, wlhash) {","            var p;","            for (p in s) {","                if(wlhash[p]) {","                    r[p] = s[p];","                }","            }","            return r;","        };","","    /**","     * The BaseCore class, is the lightest version of Base, and provides Base's","     * basic lifecycle management and ATTRS construction support, but doesn't","     * fire init/destroy or attribute change events.","     *","     * BaseCore also handles the chaining of initializer and destructor methods across","     * the hierarchy as part of object construction and destruction. Additionally, attributes","     * configured through the static <a href=\"#property_BaseCore.ATTRS\">ATTRS</a>","     * property for each class in the hierarchy will be initialized by BaseCore.","     *","     * Classes which require attribute support, but don't intend to use/expose attribute","     * change events can extend BaseCore instead of Base for optimal kweight and","     * runtime performance.","     *","     * @class BaseCore","     * @constructor","     * @uses AttributeCore","     * @param {Object} cfg Object with configuration property name/value pairs.","     * The object can be used to provide initial values for the objects published","     * attributes.","     */","    function BaseCore(cfg) {","        if (!this._BaseInvoked) {","            this._BaseInvoked = true;","","            this._initBase(cfg);","        }","    }","","    /**","     * The list of properties which can be configured for each attribute","     * (e.g. setter, getter, writeOnce, readOnly etc.)","     *","     * @property _ATTR_CFG","     * @type Array","     * @static","     * @private","     */","    BaseCore._ATTR_CFG = AttributeCore._ATTR_CFG.concat(\"cloneDefaultValue\");","","    /**","     * The array of non-attribute configuration properties supported by this class.","     *","     * For example `BaseCore` defines a \"plugins\" configuration property which","     * should not be set up as an attribute. This property is primarily required so","     * that when <a href=\"#property__allowAdHocAttrs\">`_allowAdHocAttrs`</a> is enabled by a class,","     * non-attribute configuration properties don't get added as ad-hoc attributes.","     *","     * @property _NON_ATTRS_CFG","     * @type Array","     * @static","     * @private","     */","    BaseCore._NON_ATTRS_CFG = [\"plugins\"];","","    /**","     * This property controls whether or not instances of this class should","     * allow users to add ad-hoc attributes through the constructor configuration","     * hash.","     *","     * AdHoc attributes are attributes which are not defined by the class, and are","     * not handled by the MyClass._NON_ATTRS_CFG","     *","     * @property _allowAdHocAttrs","     * @type boolean","     * @default undefined (false)","     * @protected","     */","","    /**","     * The string to be used to identify instances of this class.","     *","     * Classes extending BaseCore, should define their own","     * static NAME property, which should be camelCase by","     * convention (e.g. MyClass.NAME = \"myClass\";).","     *","     * @property NAME","     * @type String","     * @static","     */","    BaseCore.NAME = \"baseCore\";","","    /**","     * The default set of attributes which will be available for instances of this class, and","     * their configuration. In addition to the configuration properties listed by","     * AttributeCore's <a href=\"AttributeCore.html#method_addAttr\">addAttr</a> method,","     * the attribute can also be configured with a \"cloneDefaultValue\" property, which","     * defines how the statically defined value field should be protected","     * (\"shallow\", \"deep\" and false are supported values).","     *","     * By default if the value is an object literal or an array it will be \"shallow\"","     * cloned, to protect the default value.","     *","     * @property ATTRS","     * @type Object","     * @static","     */","    BaseCore.ATTRS = {","        /**","         * Flag indicating whether or not this object","         * has been through the init lifecycle phase.","         *","         * @attribute initialized","         * @readonly","         * @default false","         * @type boolean","         */","        initialized: {","            readOnly:true,","            value:false","        },","","        /**","         * Flag indicating whether or not this object","         * has been through the destroy lifecycle phase.","         *","         * @attribute destroyed","         * @readonly","         * @default false","         * @type boolean","         */","        destroyed: {","            readOnly:true,","            value:false","        }","    };","","    BaseCore.prototype = {","","        /**","         * Internal construction logic for BaseCore.","         *","         * @method _initBase","         * @param {Object} config The constructor configuration object","         * @private","         */","        _initBase : function(config) {","","            Y.stamp(this);","","            this._initAttribute(config);","","            // If Plugin.Host has been augmented [ through base-pluginhost ], setup it's","            // initial state, but don't initialize Plugins yet. That's done after initialization.","            var PluginHost = Y.Plugin && Y.Plugin.Host;","            if (this._initPlugins && PluginHost) {","                PluginHost.call(this);","            }","","            if (this._lazyAddAttrs !== false) { this._lazyAddAttrs = true; }","","            /**","             * The string used to identify the class of this object.","             *","             * @deprecated Use this.constructor.NAME","             * @property name","             * @type String","             */","            this.name = this.constructor.NAME;","","            this.init.apply(this, arguments);","        },","","        /**","         * Initializes AttributeCore","         *","         * @method _initAttribute","         * @private","         */","        _initAttribute: function() {","            AttributeCore.call(this);","        },","","        /**","         * Init lifecycle method, invoked during construction. Sets up attributes","         * and invokes initializers for the class hierarchy.","         *","         * @method init","         * @chainable","         * @param {Object} cfg Object with configuration property name/value pairs","         * @return {BaseCore} A reference to this object","         */","        init: function(cfg) {","","            this._baseInit(cfg);","","            return this;","        },","","        /**","         * Internal initialization implementation for BaseCore","         *","         * @method _baseInit","         * @private","         */","        _baseInit: function(cfg) {","            this._initHierarchy(cfg);","","            if (this._initPlugins) {","                // Need to initPlugins manually, to handle constructor parsing, static Plug parsing","                this._initPlugins(cfg);","            }","            this._set(INITIALIZED, true);","        },","","        /**","         * Destroy lifecycle method. Invokes destructors for the class hierarchy.","         *","         * @method destroy","         * @return {BaseCore} A reference to this object","         * @chainable","         */","        destroy: function() {","            this._baseDestroy();","            return this;","        },","","        /**","         * Internal destroy implementation for BaseCore","         *","         * @method _baseDestroy","         * @private","         */","        _baseDestroy : function() {","            if (this._destroyPlugins) {","                this._destroyPlugins();","            }","            this._destroyHierarchy();","            this._set(DESTROYED, true);","        },","","        /**","         * Returns the class hierarchy for this object, with BaseCore being the last class in the array.","         *","         * @method _getClasses","         * @protected","         * @return {Function[]} An array of classes (constructor functions), making up the class hierarchy for this object.","         * This value is cached the first time the method, or _getAttrCfgs, is invoked. Subsequent invocations return the","         * cached value.","         */","        _getClasses : function() {","            if (!this._classes) {","                this._initHierarchyData();","            }","            return this._classes;","        },","","        /**","         * Returns an aggregated set of attribute configurations, by traversing","         * the class hierarchy.","         *","         * @method _getAttrCfgs","         * @protected","         * @return {Object} The hash of attribute configurations, aggregated across classes in the hierarchy","         * This value is cached the first time the method, or _getClasses, is invoked. Subsequent invocations return","         * the cached value.","         */","        _getAttrCfgs : function() {","            if (!this._attrs) {","                this._initHierarchyData();","            }","            return this._attrs;","        },","","        /**","         * A helper method used when processing ATTRS across the class hierarchy during","         * initialization. Returns a disposable object with the attributes defined for","         * the provided class, extracted from the set of all attributes passed in.","         *","         * @method _filterAttrCfgs","         * @private","         *","         * @param {Function} clazz The class for which the desired attributes are required.","         * @param {Object} allCfgs The set of all attribute configurations for this instance.","         * Attributes will be removed from this set, if they belong to the filtered class, so","         * that by the time all classes are processed, allCfgs will be empty.","         *","         * @return {Object} The set of attributes belonging to the class passed in, in the form","         * of an object with attribute name/configuration pairs.","         */","        _filterAttrCfgs : function(clazz, allCfgs) {","","            var cfgs = null,","                cfg,","                val,","                attr,","                attrs = clazz.ATTRS;","","            if (attrs) {","                for (attr in attrs) {","                    if (allCfgs[attr]) {","","                        if (!cfgs) {","                            cfgs = {};","                        }","","                        // PERF TODO:","                        // Revisit once all unit tests pass for further optimizations. See if we really need to isolate this.","                        cfg = cfgs[attr] = _wlmix({}, allCfgs[attr], this._attrCfgHash());","","                        val = cfg.value;","","                        if (val && (typeof val === \"object\")) {","                            this._cloneDefaultValue(attr, cfg);","                        }","                    }","                }","            }","","            return cfgs;","        },","","        /**","         * @method _filterAdHocAttrs","         * @private","         *","         * @param {Object} allAttrs The set of all attribute configurations for this instance.","         * Attributes will be removed from this set, if they belong to the filtered class, so","         * that by the time all classes are processed, allCfgs will be empty.","         * @param {Object} userVals The config object passed in by the user, from which adhoc attrs are to be filtered.","         * @return {Object} The set of adhoc attributes passed in, in the form","         * of an object with attribute name/configuration pairs.","         */","        _filterAdHocAttrs : function(allAttrs, userVals) {","            var adHocs,","                nonAttrs = this._nonAttrs,","                attr;","","            if (userVals) {","                adHocs = {};","                for (attr in userVals) {","                    if (!allAttrs[attr] && !nonAttrs[attr] && userVals.hasOwnProperty(attr)) {","                        adHocs[attr] = {","                            value:userVals[attr]","                        };","                    }","                }","            }","","            return adHocs;","        },","","        /**","         * A helper method used by _getClasses and _getAttrCfgs, which determines both","         * the array of classes and aggregate set of attribute configurations","         * across the class hierarchy for the instance.","         *","         * @method _initHierarchyData","         * @private","         */","        _initHierarchyData : function() {","","            var ctor = this.constructor,","                cachedClassData = ctor._CACHED_CLASS_DATA,","                c,","                i,","                l,","                attrCfg,","                attrCfgHash,","                needsAttrCfgHash = !ctor._ATTR_CFG_HASH,","                nonAttrsCfg,","                nonAttrs = {},","                classes = [],","                attrs = [];","","            // Start with `this` instance's constructor.","            c = ctor;","","            if (!cachedClassData) {","","                while (c) {","                    // Add to classes","                    classes[classes.length] = c;","","                    // Add to attributes","                    if (c.ATTRS) {","                        attrs[attrs.length] = c.ATTRS;","                    }","","                    // Aggregate ATTR cfg whitelist.","                    if (needsAttrCfgHash) {","                        attrCfg     = c._ATTR_CFG;","                        attrCfgHash = attrCfgHash || {};","","                        if (attrCfg) {","                            for (i = 0, l = attrCfg.length; i < l; i += 1) {","                                attrCfgHash[attrCfg[i]] = true;","                            }","                        }","                    }","","                    // Commenting out the if. We always aggregate, since we don't","                    // know if we'll be needing this on the instance or not.","                    // if (this._allowAdHocAttrs) {","                        nonAttrsCfg = c._NON_ATTRS_CFG;","                        if (nonAttrsCfg) {","                            for (i = 0, l = nonAttrsCfg.length; i < l; i++) {","                                nonAttrs[nonAttrsCfg[i]] = true;","                            }","                        }","                    //}","","                    c = c.superclass ? c.superclass.constructor : null;","                }","","                // Cache computed `_ATTR_CFG_HASH` on the constructor.","                if (needsAttrCfgHash) {","                    ctor._ATTR_CFG_HASH = attrCfgHash;","                }","","                cachedClassData = ctor._CACHED_CLASS_DATA = {","                    classes : classes,","                    nonAttrs : nonAttrs,","                    attrs : this._aggregateAttrs(attrs)","                };","","            }","","            this._classes = cachedClassData.classes;","            this._attrs = cachedClassData.attrs;","            this._nonAttrs = cachedClassData.nonAttrs;","        },","","        /**","         * Utility method to define the attribute hash used to filter/whitelist property mixes for","         * this class for iteration performance reasons.","         *","         * @method _attrCfgHash","         * @private","         */","        _attrCfgHash: function() {","            return this.constructor._ATTR_CFG_HASH;","        },","","        /**","         * This method assumes that the value has already been checked to be an object.","         * Since it's on a critical path, we don't want to re-do the check.","         *","         * @method _cloneDefaultValue","         * @param {Object} cfg","         * @private","         */","        _cloneDefaultValue : function(attr, cfg) {","","            var val = cfg.value,","                clone = cfg.cloneDefaultValue;","","            if (clone === DEEP || clone === true) {","                cfg.value = Y.clone(val);","            } else if (clone === SHALLOW) {","                cfg.value = Y.merge(val);","            } else if ((clone === undefined && (OBJECT_CONSTRUCTOR === val.constructor || L.isArray(val)))) {","                cfg.value = Y.clone(val);","            }","            // else if (clone === false), don't clone the static default value.","            // It's intended to be used by reference.","        },","","        /**","         * A helper method, used by _initHierarchyData to aggregate","         * attribute configuration across the instances class hierarchy.","         *","         * The method will protect the attribute configuration value to protect the statically defined","         * default value in ATTRS if required (if the value is an object literal, array or the","         * attribute configuration has cloneDefaultValue set to shallow or deep).","         *","         * @method _aggregateAttrs","         * @private","         * @param {Array} allAttrs An array of ATTRS definitions across classes in the hierarchy","         * (subclass first, Base last)","         * @return {Object} The aggregate set of ATTRS definitions for the instance","         */","        _aggregateAttrs : function(allAttrs) {","","            var attr,","                attrs,","                cfg,","                path,","                i,","                cfgPropsHash = this._attrCfgHash(),","                aggAttr,","                aggAttrs = {};","","            if (allAttrs) {","                for (i = allAttrs.length-1; i >= 0; --i) {","","                    attrs = allAttrs[i];","","                    for (attr in attrs) {","                        if (attrs.hasOwnProperty(attr)) {","","                            // PERF TODO: Do we need to merge here, since we're merging later in filterAttrCfg","                            // Should we move this down to only merge if we hit the path or valueFn ifs below?","                            cfg = _wlmix({}, attrs[attr], cfgPropsHash);","","                            path = null;","                            if (attr.indexOf(DOT) !== -1) {","                                path = attr.split(DOT);","                                attr = path.shift();","                            }","","                            aggAttr = aggAttrs[attr];","","                            if (path && aggAttr && aggAttr.value) {","","                                // PERF TODO: Is this really required here, since we need","                                // to clone again anyway when re-using the value for a new","                                // instance. Could we hold onto the raw reference here (\"a.b\":\"foo\")?","                                // That would move the setValue cost to the instance though, and we","                                // maybe take on an iteration cost also.","","                                if (typeof aggAttr.value === \"object\") {","                                    this._cloneDefaultValue(attr, aggAttr);","                                }","","                                O.setValue(aggAttr.value, path, cfg.value);","","                            } else if (!path) {","","                                if (!aggAttr) {","                                    aggAttrs[attr] = cfg;","                                } else {","                                    if (aggAttr.valueFn && VALUE in cfg) {","                                        aggAttr.valueFn = null;","                                    }","","                                    // Mix into existing config.","                                    _wlmix(aggAttr, cfg, cfgPropsHash);","                                }","                            }","                        }","                    }","                }","            }","","            return aggAttrs;","        },","","        /**","         * Initializes the class hierarchy for the instance, which includes","         * initializing attributes for each class defined in the class's","         * static <a href=\"#property_BaseCore.ATTRS\">ATTRS</a> property and","         * invoking the initializer method on the prototype of each class in the hierarchy.","         *","         * @method _initHierarchy","         * @param {Object} userVals Object with configuration property name/value pairs","         * @private","         */","        _initHierarchy : function(userVals) {","            var lazy = this._lazyAddAttrs,","                constr,","                constrProto,","                ci,","                ei,","                el,","                extProto,","                exts,","                classes = this._getClasses(),","                attrCfgs = this._getAttrCfgs(),","                cl = classes.length - 1;","","            for (ci = cl; ci >= 0; ci--) {","","                constr = classes[ci];","                constrProto = constr.prototype;","                exts = constr._yuibuild && constr._yuibuild.exts;","","                if (exts) {","                    for (ei = 0, el = exts.length; ei < el; ei++) {","                        exts[ei].apply(this, arguments);","                    }","                }","","                this.addAttrs(this._filterAttrCfgs(constr, attrCfgs), userVals, lazy);","","                if (this._allowAdHocAttrs && ci === cl) {","                    this.addAttrs(this._filterAdHocAttrs(attrCfgs, userVals), userVals, lazy);","                }","","                // Using INITIALIZER in hasOwnProperty check, for performance reasons (helps IE6 avoid GC thresholds when","                // referencing string literals). Not using it in apply, again, for performance \".\" is faster.","                if (constrProto.hasOwnProperty(INITIALIZER)) {","                    constrProto.initializer.apply(this, arguments);","                }","","                if (exts) {","                    for (ei = 0; ei < el; ei++) {","                        extProto = exts[ei].prototype;","                        if (extProto.hasOwnProperty(INITIALIZER)) {","                            extProto.initializer.apply(this, arguments);","                        }","                    }","                }","            }","        },","","        /**","         * Destroys the class hierarchy for this instance by invoking","         * the destructor method on the prototype of each class in the hierarchy.","         *","         * @method _destroyHierarchy","         * @private","         */","        _destroyHierarchy : function() {","            var constr,","                constrProto,","                ci, cl, ei, el, exts, extProto,","                classes = this._getClasses();","","            for (ci = 0, cl = classes.length; ci < cl; ci++) {","                constr = classes[ci];","                constrProto = constr.prototype;","                exts = constr._yuibuild && constr._yuibuild.exts;","","                if (exts) {","                    for (ei = 0, el = exts.length; ei < el; ei++) {","                        extProto = exts[ei].prototype;","                        if (extProto.hasOwnProperty(DESTRUCTOR)) {","                            extProto.destructor.apply(this, arguments);","                        }","                    }","                }","","                if (constrProto.hasOwnProperty(DESTRUCTOR)) {","                    constrProto.destructor.apply(this, arguments);","                }","            }","        },","","        /**","         * Default toString implementation. Provides the constructor NAME","         * and the instance guid, if set.","         *","         * @method toString","         * @return {String} String representation for this object","         */","        toString: function() {","            return this.name + \"[\" + Y.stamp(this, true) + \"]\";","        }","    };","","    // Straightup augment, no wrapper functions","    Y.mix(BaseCore, AttributeCore, false, null, 1);","","    // Fix constructor","    BaseCore.prototype.constructor = BaseCore;","","    Y.BaseCore = BaseCore;","","","}, '@VERSION@', {\"requires\": [\"attribute-core\"]});"];
_yuitest_coverage["build/base-core/base-core.js"].lines = {"1":0,"21":0,"36":0,"37":0,"38":0,"39":0,"42":0,"66":0,"67":0,"68":0,"70":0,"83":0,"98":0,"125":0,"142":0,"172":0,"183":0,"185":0,"189":0,"190":0,"191":0,"194":0,"203":0,"205":0,"215":0,"229":0,"231":0,"241":0,"243":0,"245":0,"247":0,"258":0,"259":0,"269":0,"270":0,"272":0,"273":0,"286":0,"287":0,"289":0,"303":0,"304":0,"306":0,"327":0,"333":0,"334":0,"335":0,"337":0,"338":0,"343":0,"345":0,"347":0,"348":0,"354":0,"369":0,"373":0,"374":0,"375":0,"376":0,"377":0,"384":0,"397":0,"411":0,"413":0,"415":0,"417":0,"420":0,"421":0,"425":0,"426":0,"427":0,"429":0,"430":0,"431":0,"439":0,"440":0,"441":0,"442":0,"447":0,"451":0,"452":0,"455":0,"463":0,"464":0,"465":0,"476":0,"489":0,"492":0,"493":0,"494":0,"495":0,"496":0,"497":0,"519":0,"528":0,"529":0,"531":0,"533":0,"534":0,"538":0,"540":0,"541":0,"542":0,"543":0,"546":0,"548":0,"556":0,"557":0,"560":0,"562":0,"564":0,"565":0,"567":0,"568":0,"572":0,"580":0,"594":0,"606":0,"608":0,"609":0,"610":0,"612":0,"613":0,"614":0,"618":0,"620":0,"621":0,"626":0,"627":0,"630":0,"631":0,"632":0,"633":0,"634":0,"649":0,"654":0,"655":0,"656":0,"657":0,"659":0,"660":0,"661":0,"662":0,"663":0,"668":0,"669":0,"682":0,"687":0,"690":0,"692":0};
_yuitest_coverage["build/base-core/base-core.js"].functions = {"_wlmix:35":0,"BaseCore:66":0,"_initBase:181":0,"_initAttribute:214":0,"init:227":0,"_baseInit:240":0,"destroy:257":0,"_baseDestroy:268":0,"_getClasses:285":0,"_getAttrCfgs:302":0,"_filterAttrCfgs:325":0,"_filterAdHocAttrs:368":0,"_initHierarchyData:395":0,"_attrCfgHash:475":0,"_cloneDefaultValue:487":0,"_aggregateAttrs:517":0,"_initHierarchy:593":0,"_destroyHierarchy:648":0,"toString:681":0,"(anonymous 1):1":0};
_yuitest_coverage["build/base-core/base-core.js"].coveredLines = 150;
_yuitest_coverage["build/base-core/base-core.js"].coveredFunctions = 20;
_yuitest_coverline("build/base-core/base-core.js", 1);
YUI.add('base-core', function (Y, NAME) {

    /**
     * The base module provides the Base class, which objects requiring attribute and custom event support can extend.
     * The module also provides two ways to reuse code - It augments Base with the Plugin.Host interface which provides
     * plugin support and also provides the BaseCore.build method which provides a way to build custom classes using extensions.
     *
     * @module base
     */

    /**
     * <p>The base-core module provides the BaseCore class, the lightest version of Base,
     * which provides Base's basic lifecycle management and ATTRS construction support,
     * but doesn't fire init/destroy or attribute change events.</p>
     *
     * <p>It mixes in AttributeCore, which is the lightest version of Attribute</p>
     *
     * @module base
     * @submodule base-core
     */
    _yuitest_coverfunc("build/base-core/base-core.js", "(anonymous 1)", 1);
_yuitest_coverline("build/base-core/base-core.js", 21);
var O = Y.Object,
        L = Y.Lang,
        DOT = ".",
        INITIALIZED = "initialized",
        DESTROYED = "destroyed",
        INITIALIZER = "initializer",
        VALUE = "value",
        OBJECT_CONSTRUCTOR = Object.prototype.constructor,
        DEEP = "deep",
        SHALLOW = "shallow",
        DESTRUCTOR = "destructor",

        AttributeCore = Y.AttributeCore,

        _wlmix = function(r, s, wlhash) {
            _yuitest_coverfunc("build/base-core/base-core.js", "_wlmix", 35);
_yuitest_coverline("build/base-core/base-core.js", 36);
var p;
            _yuitest_coverline("build/base-core/base-core.js", 37);
for (p in s) {
                _yuitest_coverline("build/base-core/base-core.js", 38);
if(wlhash[p]) {
                    _yuitest_coverline("build/base-core/base-core.js", 39);
r[p] = s[p];
                }
            }
            _yuitest_coverline("build/base-core/base-core.js", 42);
return r;
        };

    /**
     * The BaseCore class, is the lightest version of Base, and provides Base's
     * basic lifecycle management and ATTRS construction support, but doesn't
     * fire init/destroy or attribute change events.
     *
     * BaseCore also handles the chaining of initializer and destructor methods across
     * the hierarchy as part of object construction and destruction. Additionally, attributes
     * configured through the static <a href="#property_BaseCore.ATTRS">ATTRS</a>
     * property for each class in the hierarchy will be initialized by BaseCore.
     *
     * Classes which require attribute support, but don't intend to use/expose attribute
     * change events can extend BaseCore instead of Base for optimal kweight and
     * runtime performance.
     *
     * @class BaseCore
     * @constructor
     * @uses AttributeCore
     * @param {Object} cfg Object with configuration property name/value pairs.
     * The object can be used to provide initial values for the objects published
     * attributes.
     */
    _yuitest_coverline("build/base-core/base-core.js", 66);
function BaseCore(cfg) {
        _yuitest_coverfunc("build/base-core/base-core.js", "BaseCore", 66);
_yuitest_coverline("build/base-core/base-core.js", 67);
if (!this._BaseInvoked) {
            _yuitest_coverline("build/base-core/base-core.js", 68);
this._BaseInvoked = true;

            _yuitest_coverline("build/base-core/base-core.js", 70);
this._initBase(cfg);
        }
    }

    /**
     * The list of properties which can be configured for each attribute
     * (e.g. setter, getter, writeOnce, readOnly etc.)
     *
     * @property _ATTR_CFG
     * @type Array
     * @static
     * @private
     */
    _yuitest_coverline("build/base-core/base-core.js", 83);
BaseCore._ATTR_CFG = AttributeCore._ATTR_CFG.concat("cloneDefaultValue");

    /**
     * The array of non-attribute configuration properties supported by this class.
     *
     * For example `BaseCore` defines a "plugins" configuration property which
     * should not be set up as an attribute. This property is primarily required so
     * that when <a href="#property__allowAdHocAttrs">`_allowAdHocAttrs`</a> is enabled by a class,
     * non-attribute configuration properties don't get added as ad-hoc attributes.
     *
     * @property _NON_ATTRS_CFG
     * @type Array
     * @static
     * @private
     */
    _yuitest_coverline("build/base-core/base-core.js", 98);
BaseCore._NON_ATTRS_CFG = ["plugins"];

    /**
     * This property controls whether or not instances of this class should
     * allow users to add ad-hoc attributes through the constructor configuration
     * hash.
     *
     * AdHoc attributes are attributes which are not defined by the class, and are
     * not handled by the MyClass._NON_ATTRS_CFG
     *
     * @property _allowAdHocAttrs
     * @type boolean
     * @default undefined (false)
     * @protected
     */

    /**
     * The string to be used to identify instances of this class.
     *
     * Classes extending BaseCore, should define their own
     * static NAME property, which should be camelCase by
     * convention (e.g. MyClass.NAME = "myClass";).
     *
     * @property NAME
     * @type String
     * @static
     */
    _yuitest_coverline("build/base-core/base-core.js", 125);
BaseCore.NAME = "baseCore";

    /**
     * The default set of attributes which will be available for instances of this class, and
     * their configuration. In addition to the configuration properties listed by
     * AttributeCore's <a href="AttributeCore.html#method_addAttr">addAttr</a> method,
     * the attribute can also be configured with a "cloneDefaultValue" property, which
     * defines how the statically defined value field should be protected
     * ("shallow", "deep" and false are supported values).
     *
     * By default if the value is an object literal or an array it will be "shallow"
     * cloned, to protect the default value.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    _yuitest_coverline("build/base-core/base-core.js", 142);
BaseCore.ATTRS = {
        /**
         * Flag indicating whether or not this object
         * has been through the init lifecycle phase.
         *
         * @attribute initialized
         * @readonly
         * @default false
         * @type boolean
         */
        initialized: {
            readOnly:true,
            value:false
        },

        /**
         * Flag indicating whether or not this object
         * has been through the destroy lifecycle phase.
         *
         * @attribute destroyed
         * @readonly
         * @default false
         * @type boolean
         */
        destroyed: {
            readOnly:true,
            value:false
        }
    };

    _yuitest_coverline("build/base-core/base-core.js", 172);
BaseCore.prototype = {

        /**
         * Internal construction logic for BaseCore.
         *
         * @method _initBase
         * @param {Object} config The constructor configuration object
         * @private
         */
        _initBase : function(config) {

            _yuitest_coverfunc("build/base-core/base-core.js", "_initBase", 181);
_yuitest_coverline("build/base-core/base-core.js", 183);
Y.stamp(this);

            _yuitest_coverline("build/base-core/base-core.js", 185);
this._initAttribute(config);

            // If Plugin.Host has been augmented [ through base-pluginhost ], setup it's
            // initial state, but don't initialize Plugins yet. That's done after initialization.
            _yuitest_coverline("build/base-core/base-core.js", 189);
var PluginHost = Y.Plugin && Y.Plugin.Host;
            _yuitest_coverline("build/base-core/base-core.js", 190);
if (this._initPlugins && PluginHost) {
                _yuitest_coverline("build/base-core/base-core.js", 191);
PluginHost.call(this);
            }

            _yuitest_coverline("build/base-core/base-core.js", 194);
if (this._lazyAddAttrs !== false) { this._lazyAddAttrs = true; }

            /**
             * The string used to identify the class of this object.
             *
             * @deprecated Use this.constructor.NAME
             * @property name
             * @type String
             */
            _yuitest_coverline("build/base-core/base-core.js", 203);
this.name = this.constructor.NAME;

            _yuitest_coverline("build/base-core/base-core.js", 205);
this.init.apply(this, arguments);
        },

        /**
         * Initializes AttributeCore
         *
         * @method _initAttribute
         * @private
         */
        _initAttribute: function() {
            _yuitest_coverfunc("build/base-core/base-core.js", "_initAttribute", 214);
_yuitest_coverline("build/base-core/base-core.js", 215);
AttributeCore.call(this);
        },

        /**
         * Init lifecycle method, invoked during construction. Sets up attributes
         * and invokes initializers for the class hierarchy.
         *
         * @method init
         * @chainable
         * @param {Object} cfg Object with configuration property name/value pairs
         * @return {BaseCore} A reference to this object
         */
        init: function(cfg) {

            _yuitest_coverfunc("build/base-core/base-core.js", "init", 227);
_yuitest_coverline("build/base-core/base-core.js", 229);
this._baseInit(cfg);

            _yuitest_coverline("build/base-core/base-core.js", 231);
return this;
        },

        /**
         * Internal initialization implementation for BaseCore
         *
         * @method _baseInit
         * @private
         */
        _baseInit: function(cfg) {
            _yuitest_coverfunc("build/base-core/base-core.js", "_baseInit", 240);
_yuitest_coverline("build/base-core/base-core.js", 241);
this._initHierarchy(cfg);

            _yuitest_coverline("build/base-core/base-core.js", 243);
if (this._initPlugins) {
                // Need to initPlugins manually, to handle constructor parsing, static Plug parsing
                _yuitest_coverline("build/base-core/base-core.js", 245);
this._initPlugins(cfg);
            }
            _yuitest_coverline("build/base-core/base-core.js", 247);
this._set(INITIALIZED, true);
        },

        /**
         * Destroy lifecycle method. Invokes destructors for the class hierarchy.
         *
         * @method destroy
         * @return {BaseCore} A reference to this object
         * @chainable
         */
        destroy: function() {
            _yuitest_coverfunc("build/base-core/base-core.js", "destroy", 257);
_yuitest_coverline("build/base-core/base-core.js", 258);
this._baseDestroy();
            _yuitest_coverline("build/base-core/base-core.js", 259);
return this;
        },

        /**
         * Internal destroy implementation for BaseCore
         *
         * @method _baseDestroy
         * @private
         */
        _baseDestroy : function() {
            _yuitest_coverfunc("build/base-core/base-core.js", "_baseDestroy", 268);
_yuitest_coverline("build/base-core/base-core.js", 269);
if (this._destroyPlugins) {
                _yuitest_coverline("build/base-core/base-core.js", 270);
this._destroyPlugins();
            }
            _yuitest_coverline("build/base-core/base-core.js", 272);
this._destroyHierarchy();
            _yuitest_coverline("build/base-core/base-core.js", 273);
this._set(DESTROYED, true);
        },

        /**
         * Returns the class hierarchy for this object, with BaseCore being the last class in the array.
         *
         * @method _getClasses
         * @protected
         * @return {Function[]} An array of classes (constructor functions), making up the class hierarchy for this object.
         * This value is cached the first time the method, or _getAttrCfgs, is invoked. Subsequent invocations return the
         * cached value.
         */
        _getClasses : function() {
            _yuitest_coverfunc("build/base-core/base-core.js", "_getClasses", 285);
_yuitest_coverline("build/base-core/base-core.js", 286);
if (!this._classes) {
                _yuitest_coverline("build/base-core/base-core.js", 287);
this._initHierarchyData();
            }
            _yuitest_coverline("build/base-core/base-core.js", 289);
return this._classes;
        },

        /**
         * Returns an aggregated set of attribute configurations, by traversing
         * the class hierarchy.
         *
         * @method _getAttrCfgs
         * @protected
         * @return {Object} The hash of attribute configurations, aggregated across classes in the hierarchy
         * This value is cached the first time the method, or _getClasses, is invoked. Subsequent invocations return
         * the cached value.
         */
        _getAttrCfgs : function() {
            _yuitest_coverfunc("build/base-core/base-core.js", "_getAttrCfgs", 302);
_yuitest_coverline("build/base-core/base-core.js", 303);
if (!this._attrs) {
                _yuitest_coverline("build/base-core/base-core.js", 304);
this._initHierarchyData();
            }
            _yuitest_coverline("build/base-core/base-core.js", 306);
return this._attrs;
        },

        /**
         * A helper method used when processing ATTRS across the class hierarchy during
         * initialization. Returns a disposable object with the attributes defined for
         * the provided class, extracted from the set of all attributes passed in.
         *
         * @method _filterAttrCfgs
         * @private
         *
         * @param {Function} clazz The class for which the desired attributes are required.
         * @param {Object} allCfgs The set of all attribute configurations for this instance.
         * Attributes will be removed from this set, if they belong to the filtered class, so
         * that by the time all classes are processed, allCfgs will be empty.
         *
         * @return {Object} The set of attributes belonging to the class passed in, in the form
         * of an object with attribute name/configuration pairs.
         */
        _filterAttrCfgs : function(clazz, allCfgs) {

            _yuitest_coverfunc("build/base-core/base-core.js", "_filterAttrCfgs", 325);
_yuitest_coverline("build/base-core/base-core.js", 327);
var cfgs = null,
                cfg,
                val,
                attr,
                attrs = clazz.ATTRS;

            _yuitest_coverline("build/base-core/base-core.js", 333);
if (attrs) {
                _yuitest_coverline("build/base-core/base-core.js", 334);
for (attr in attrs) {
                    _yuitest_coverline("build/base-core/base-core.js", 335);
if (allCfgs[attr]) {

                        _yuitest_coverline("build/base-core/base-core.js", 337);
if (!cfgs) {
                            _yuitest_coverline("build/base-core/base-core.js", 338);
cfgs = {};
                        }

                        // PERF TODO:
                        // Revisit once all unit tests pass for further optimizations. See if we really need to isolate this.
                        _yuitest_coverline("build/base-core/base-core.js", 343);
cfg = cfgs[attr] = _wlmix({}, allCfgs[attr], this._attrCfgHash());

                        _yuitest_coverline("build/base-core/base-core.js", 345);
val = cfg.value;

                        _yuitest_coverline("build/base-core/base-core.js", 347);
if (val && (typeof val === "object")) {
                            _yuitest_coverline("build/base-core/base-core.js", 348);
this._cloneDefaultValue(attr, cfg);
                        }
                    }
                }
            }

            _yuitest_coverline("build/base-core/base-core.js", 354);
return cfgs;
        },

        /**
         * @method _filterAdHocAttrs
         * @private
         *
         * @param {Object} allAttrs The set of all attribute configurations for this instance.
         * Attributes will be removed from this set, if they belong to the filtered class, so
         * that by the time all classes are processed, allCfgs will be empty.
         * @param {Object} userVals The config object passed in by the user, from which adhoc attrs are to be filtered.
         * @return {Object} The set of adhoc attributes passed in, in the form
         * of an object with attribute name/configuration pairs.
         */
        _filterAdHocAttrs : function(allAttrs, userVals) {
            _yuitest_coverfunc("build/base-core/base-core.js", "_filterAdHocAttrs", 368);
_yuitest_coverline("build/base-core/base-core.js", 369);
var adHocs,
                nonAttrs = this._nonAttrs,
                attr;

            _yuitest_coverline("build/base-core/base-core.js", 373);
if (userVals) {
                _yuitest_coverline("build/base-core/base-core.js", 374);
adHocs = {};
                _yuitest_coverline("build/base-core/base-core.js", 375);
for (attr in userVals) {
                    _yuitest_coverline("build/base-core/base-core.js", 376);
if (!allAttrs[attr] && !nonAttrs[attr] && userVals.hasOwnProperty(attr)) {
                        _yuitest_coverline("build/base-core/base-core.js", 377);
adHocs[attr] = {
                            value:userVals[attr]
                        };
                    }
                }
            }

            _yuitest_coverline("build/base-core/base-core.js", 384);
return adHocs;
        },

        /**
         * A helper method used by _getClasses and _getAttrCfgs, which determines both
         * the array of classes and aggregate set of attribute configurations
         * across the class hierarchy for the instance.
         *
         * @method _initHierarchyData
         * @private
         */
        _initHierarchyData : function() {

            _yuitest_coverfunc("build/base-core/base-core.js", "_initHierarchyData", 395);
_yuitest_coverline("build/base-core/base-core.js", 397);
var ctor = this.constructor,
                cachedClassData = ctor._CACHED_CLASS_DATA,
                c,
                i,
                l,
                attrCfg,
                attrCfgHash,
                needsAttrCfgHash = !ctor._ATTR_CFG_HASH,
                nonAttrsCfg,
                nonAttrs = {},
                classes = [],
                attrs = [];

            // Start with `this` instance's constructor.
            _yuitest_coverline("build/base-core/base-core.js", 411);
c = ctor;

            _yuitest_coverline("build/base-core/base-core.js", 413);
if (!cachedClassData) {

                _yuitest_coverline("build/base-core/base-core.js", 415);
while (c) {
                    // Add to classes
                    _yuitest_coverline("build/base-core/base-core.js", 417);
classes[classes.length] = c;

                    // Add to attributes
                    _yuitest_coverline("build/base-core/base-core.js", 420);
if (c.ATTRS) {
                        _yuitest_coverline("build/base-core/base-core.js", 421);
attrs[attrs.length] = c.ATTRS;
                    }

                    // Aggregate ATTR cfg whitelist.
                    _yuitest_coverline("build/base-core/base-core.js", 425);
if (needsAttrCfgHash) {
                        _yuitest_coverline("build/base-core/base-core.js", 426);
attrCfg     = c._ATTR_CFG;
                        _yuitest_coverline("build/base-core/base-core.js", 427);
attrCfgHash = attrCfgHash || {};

                        _yuitest_coverline("build/base-core/base-core.js", 429);
if (attrCfg) {
                            _yuitest_coverline("build/base-core/base-core.js", 430);
for (i = 0, l = attrCfg.length; i < l; i += 1) {
                                _yuitest_coverline("build/base-core/base-core.js", 431);
attrCfgHash[attrCfg[i]] = true;
                            }
                        }
                    }

                    // Commenting out the if. We always aggregate, since we don't
                    // know if we'll be needing this on the instance or not.
                    // if (this._allowAdHocAttrs) {
                        _yuitest_coverline("build/base-core/base-core.js", 439);
nonAttrsCfg = c._NON_ATTRS_CFG;
                        _yuitest_coverline("build/base-core/base-core.js", 440);
if (nonAttrsCfg) {
                            _yuitest_coverline("build/base-core/base-core.js", 441);
for (i = 0, l = nonAttrsCfg.length; i < l; i++) {
                                _yuitest_coverline("build/base-core/base-core.js", 442);
nonAttrs[nonAttrsCfg[i]] = true;
                            }
                        }
                    //}

                    _yuitest_coverline("build/base-core/base-core.js", 447);
c = c.superclass ? c.superclass.constructor : null;
                }

                // Cache computed `_ATTR_CFG_HASH` on the constructor.
                _yuitest_coverline("build/base-core/base-core.js", 451);
if (needsAttrCfgHash) {
                    _yuitest_coverline("build/base-core/base-core.js", 452);
ctor._ATTR_CFG_HASH = attrCfgHash;
                }

                _yuitest_coverline("build/base-core/base-core.js", 455);
cachedClassData = ctor._CACHED_CLASS_DATA = {
                    classes : classes,
                    nonAttrs : nonAttrs,
                    attrs : this._aggregateAttrs(attrs)
                };

            }

            _yuitest_coverline("build/base-core/base-core.js", 463);
this._classes = cachedClassData.classes;
            _yuitest_coverline("build/base-core/base-core.js", 464);
this._attrs = cachedClassData.attrs;
            _yuitest_coverline("build/base-core/base-core.js", 465);
this._nonAttrs = cachedClassData.nonAttrs;
        },

        /**
         * Utility method to define the attribute hash used to filter/whitelist property mixes for
         * this class for iteration performance reasons.
         *
         * @method _attrCfgHash
         * @private
         */
        _attrCfgHash: function() {
            _yuitest_coverfunc("build/base-core/base-core.js", "_attrCfgHash", 475);
_yuitest_coverline("build/base-core/base-core.js", 476);
return this.constructor._ATTR_CFG_HASH;
        },

        /**
         * This method assumes that the value has already been checked to be an object.
         * Since it's on a critical path, we don't want to re-do the check.
         *
         * @method _cloneDefaultValue
         * @param {Object} cfg
         * @private
         */
        _cloneDefaultValue : function(attr, cfg) {

            _yuitest_coverfunc("build/base-core/base-core.js", "_cloneDefaultValue", 487);
_yuitest_coverline("build/base-core/base-core.js", 489);
var val = cfg.value,
                clone = cfg.cloneDefaultValue;

            _yuitest_coverline("build/base-core/base-core.js", 492);
if (clone === DEEP || clone === true) {
                _yuitest_coverline("build/base-core/base-core.js", 493);
cfg.value = Y.clone(val);
            } else {_yuitest_coverline("build/base-core/base-core.js", 494);
if (clone === SHALLOW) {
                _yuitest_coverline("build/base-core/base-core.js", 495);
cfg.value = Y.merge(val);
            } else {_yuitest_coverline("build/base-core/base-core.js", 496);
if ((clone === undefined && (OBJECT_CONSTRUCTOR === val.constructor || L.isArray(val)))) {
                _yuitest_coverline("build/base-core/base-core.js", 497);
cfg.value = Y.clone(val);
            }}}
            // else if (clone === false), don't clone the static default value.
            // It's intended to be used by reference.
        },

        /**
         * A helper method, used by _initHierarchyData to aggregate
         * attribute configuration across the instances class hierarchy.
         *
         * The method will protect the attribute configuration value to protect the statically defined
         * default value in ATTRS if required (if the value is an object literal, array or the
         * attribute configuration has cloneDefaultValue set to shallow or deep).
         *
         * @method _aggregateAttrs
         * @private
         * @param {Array} allAttrs An array of ATTRS definitions across classes in the hierarchy
         * (subclass first, Base last)
         * @return {Object} The aggregate set of ATTRS definitions for the instance
         */
        _aggregateAttrs : function(allAttrs) {

            _yuitest_coverfunc("build/base-core/base-core.js", "_aggregateAttrs", 517);
_yuitest_coverline("build/base-core/base-core.js", 519);
var attr,
                attrs,
                cfg,
                path,
                i,
                cfgPropsHash = this._attrCfgHash(),
                aggAttr,
                aggAttrs = {};

            _yuitest_coverline("build/base-core/base-core.js", 528);
if (allAttrs) {
                _yuitest_coverline("build/base-core/base-core.js", 529);
for (i = allAttrs.length-1; i >= 0; --i) {

                    _yuitest_coverline("build/base-core/base-core.js", 531);
attrs = allAttrs[i];

                    _yuitest_coverline("build/base-core/base-core.js", 533);
for (attr in attrs) {
                        _yuitest_coverline("build/base-core/base-core.js", 534);
if (attrs.hasOwnProperty(attr)) {

                            // PERF TODO: Do we need to merge here, since we're merging later in filterAttrCfg
                            // Should we move this down to only merge if we hit the path or valueFn ifs below?
                            _yuitest_coverline("build/base-core/base-core.js", 538);
cfg = _wlmix({}, attrs[attr], cfgPropsHash);

                            _yuitest_coverline("build/base-core/base-core.js", 540);
path = null;
                            _yuitest_coverline("build/base-core/base-core.js", 541);
if (attr.indexOf(DOT) !== -1) {
                                _yuitest_coverline("build/base-core/base-core.js", 542);
path = attr.split(DOT);
                                _yuitest_coverline("build/base-core/base-core.js", 543);
attr = path.shift();
                            }

                            _yuitest_coverline("build/base-core/base-core.js", 546);
aggAttr = aggAttrs[attr];

                            _yuitest_coverline("build/base-core/base-core.js", 548);
if (path && aggAttr && aggAttr.value) {

                                // PERF TODO: Is this really required here, since we need
                                // to clone again anyway when re-using the value for a new
                                // instance. Could we hold onto the raw reference here ("a.b":"foo")?
                                // That would move the setValue cost to the instance though, and we
                                // maybe take on an iteration cost also.

                                _yuitest_coverline("build/base-core/base-core.js", 556);
if (typeof aggAttr.value === "object") {
                                    _yuitest_coverline("build/base-core/base-core.js", 557);
this._cloneDefaultValue(attr, aggAttr);
                                }

                                _yuitest_coverline("build/base-core/base-core.js", 560);
O.setValue(aggAttr.value, path, cfg.value);

                            } else {_yuitest_coverline("build/base-core/base-core.js", 562);
if (!path) {

                                _yuitest_coverline("build/base-core/base-core.js", 564);
if (!aggAttr) {
                                    _yuitest_coverline("build/base-core/base-core.js", 565);
aggAttrs[attr] = cfg;
                                } else {
                                    _yuitest_coverline("build/base-core/base-core.js", 567);
if (aggAttr.valueFn && VALUE in cfg) {
                                        _yuitest_coverline("build/base-core/base-core.js", 568);
aggAttr.valueFn = null;
                                    }

                                    // Mix into existing config.
                                    _yuitest_coverline("build/base-core/base-core.js", 572);
_wlmix(aggAttr, cfg, cfgPropsHash);
                                }
                            }}
                        }
                    }
                }
            }

            _yuitest_coverline("build/base-core/base-core.js", 580);
return aggAttrs;
        },

        /**
         * Initializes the class hierarchy for the instance, which includes
         * initializing attributes for each class defined in the class's
         * static <a href="#property_BaseCore.ATTRS">ATTRS</a> property and
         * invoking the initializer method on the prototype of each class in the hierarchy.
         *
         * @method _initHierarchy
         * @param {Object} userVals Object with configuration property name/value pairs
         * @private
         */
        _initHierarchy : function(userVals) {
            _yuitest_coverfunc("build/base-core/base-core.js", "_initHierarchy", 593);
_yuitest_coverline("build/base-core/base-core.js", 594);
var lazy = this._lazyAddAttrs,
                constr,
                constrProto,
                ci,
                ei,
                el,
                extProto,
                exts,
                classes = this._getClasses(),
                attrCfgs = this._getAttrCfgs(),
                cl = classes.length - 1;

            _yuitest_coverline("build/base-core/base-core.js", 606);
for (ci = cl; ci >= 0; ci--) {

                _yuitest_coverline("build/base-core/base-core.js", 608);
constr = classes[ci];
                _yuitest_coverline("build/base-core/base-core.js", 609);
constrProto = constr.prototype;
                _yuitest_coverline("build/base-core/base-core.js", 610);
exts = constr._yuibuild && constr._yuibuild.exts;

                _yuitest_coverline("build/base-core/base-core.js", 612);
if (exts) {
                    _yuitest_coverline("build/base-core/base-core.js", 613);
for (ei = 0, el = exts.length; ei < el; ei++) {
                        _yuitest_coverline("build/base-core/base-core.js", 614);
exts[ei].apply(this, arguments);
                    }
                }

                _yuitest_coverline("build/base-core/base-core.js", 618);
this.addAttrs(this._filterAttrCfgs(constr, attrCfgs), userVals, lazy);

                _yuitest_coverline("build/base-core/base-core.js", 620);
if (this._allowAdHocAttrs && ci === cl) {
                    _yuitest_coverline("build/base-core/base-core.js", 621);
this.addAttrs(this._filterAdHocAttrs(attrCfgs, userVals), userVals, lazy);
                }

                // Using INITIALIZER in hasOwnProperty check, for performance reasons (helps IE6 avoid GC thresholds when
                // referencing string literals). Not using it in apply, again, for performance "." is faster.
                _yuitest_coverline("build/base-core/base-core.js", 626);
if (constrProto.hasOwnProperty(INITIALIZER)) {
                    _yuitest_coverline("build/base-core/base-core.js", 627);
constrProto.initializer.apply(this, arguments);
                }

                _yuitest_coverline("build/base-core/base-core.js", 630);
if (exts) {
                    _yuitest_coverline("build/base-core/base-core.js", 631);
for (ei = 0; ei < el; ei++) {
                        _yuitest_coverline("build/base-core/base-core.js", 632);
extProto = exts[ei].prototype;
                        _yuitest_coverline("build/base-core/base-core.js", 633);
if (extProto.hasOwnProperty(INITIALIZER)) {
                            _yuitest_coverline("build/base-core/base-core.js", 634);
extProto.initializer.apply(this, arguments);
                        }
                    }
                }
            }
        },

        /**
         * Destroys the class hierarchy for this instance by invoking
         * the destructor method on the prototype of each class in the hierarchy.
         *
         * @method _destroyHierarchy
         * @private
         */
        _destroyHierarchy : function() {
            _yuitest_coverfunc("build/base-core/base-core.js", "_destroyHierarchy", 648);
_yuitest_coverline("build/base-core/base-core.js", 649);
var constr,
                constrProto,
                ci, cl, ei, el, exts, extProto,
                classes = this._getClasses();

            _yuitest_coverline("build/base-core/base-core.js", 654);
for (ci = 0, cl = classes.length; ci < cl; ci++) {
                _yuitest_coverline("build/base-core/base-core.js", 655);
constr = classes[ci];
                _yuitest_coverline("build/base-core/base-core.js", 656);
constrProto = constr.prototype;
                _yuitest_coverline("build/base-core/base-core.js", 657);
exts = constr._yuibuild && constr._yuibuild.exts;

                _yuitest_coverline("build/base-core/base-core.js", 659);
if (exts) {
                    _yuitest_coverline("build/base-core/base-core.js", 660);
for (ei = 0, el = exts.length; ei < el; ei++) {
                        _yuitest_coverline("build/base-core/base-core.js", 661);
extProto = exts[ei].prototype;
                        _yuitest_coverline("build/base-core/base-core.js", 662);
if (extProto.hasOwnProperty(DESTRUCTOR)) {
                            _yuitest_coverline("build/base-core/base-core.js", 663);
extProto.destructor.apply(this, arguments);
                        }
                    }
                }

                _yuitest_coverline("build/base-core/base-core.js", 668);
if (constrProto.hasOwnProperty(DESTRUCTOR)) {
                    _yuitest_coverline("build/base-core/base-core.js", 669);
constrProto.destructor.apply(this, arguments);
                }
            }
        },

        /**
         * Default toString implementation. Provides the constructor NAME
         * and the instance guid, if set.
         *
         * @method toString
         * @return {String} String representation for this object
         */
        toString: function() {
            _yuitest_coverfunc("build/base-core/base-core.js", "toString", 681);
_yuitest_coverline("build/base-core/base-core.js", 682);
return this.name + "[" + Y.stamp(this, true) + "]";
        }
    };

    // Straightup augment, no wrapper functions
    _yuitest_coverline("build/base-core/base-core.js", 687);
Y.mix(BaseCore, AttributeCore, false, null, 1);

    // Fix constructor
    _yuitest_coverline("build/base-core/base-core.js", 690);
BaseCore.prototype.constructor = BaseCore;

    _yuitest_coverline("build/base-core/base-core.js", 692);
Y.BaseCore = BaseCore;


}, '@VERSION@', {"requires": ["attribute-core"]});
