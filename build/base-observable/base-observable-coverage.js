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
_yuitest_coverage["build/base-observable/base-observable.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/base-observable/base-observable.js",
    code: []
};
_yuitest_coverage["build/base-observable/base-observable.js"].code=["YUI.add('base-observable', function (Y, NAME) {","","    /**","    The `base-observable` submodule adds observability to Base's lifecycle and","    attributes, and also make it an `EventTarget`.","","    @module base","    @submodule base-observable","    **/","    var L = Y.Lang,","","        DESTROY = \"destroy\",","        INIT = \"init\",","","        BUBBLETARGETS = \"bubbleTargets\",","        _BUBBLETARGETS = \"_bubbleTargets\",","","        AttributeObservable = Y.AttributeObservable;","","    /**","    Provides an augmentable implementation of lifecycle and attribute events for","    `BaseCore`.","","    @class BaseObservable","    @extensionfor BaseCore","    @uses AttributeObservable","    @uses EventTarget","    @since 3.7.0","    **/","    function BaseObservable() {}","","    BaseObservable._ATTR_CFG      = AttributeObservable._ATTR_CFG.concat();","    BaseObservable._NON_ATTRS_CFG = [\"on\", \"after\", \"bubbleTargets\"];","","    BaseObservable.prototype = {","","        /**","         * Initializes Attribute","         *","         * @method _initAttribute","         * @private","         */","        _initAttribute: function(cfg) {","            Y.BaseCore.prototype._initAttribute.apply(this, arguments);","            Y.AttributeObservable.call(this);","","            this._eventPrefix = this.constructor.EVENT_PREFIX || this.constructor.NAME;","            this._yuievt.config.prefix = this._eventPrefix;","        },","","        /**","         * Init lifecycle method, invoked during construction.","         * Fires the init event prior to setting up attributes and","         * invoking initializers for the class hierarchy.","         *","         * @method init","         * @chainable","         * @param {Object} config Object with configuration property name/value pairs","         * @return {Base} A reference to this object","         */","        init: function(config) {","            /**","             * <p>","             * Lifecycle event for the init phase, fired prior to initialization.","             * Invoking the preventDefault() method on the event object provided","             * to subscribers will prevent initialization from occuring.","             * </p>","             * <p>","             * Subscribers to the \"after\" momemt of this event, will be notified","             * after initialization of the object is complete (and therefore","             * cannot prevent initialization).","             * </p>","             *","             * @event init","             * @preventable _defInitFn","             * @param {EventFacade} e Event object, with a cfg property which","             * refers to the configuration object passed to the constructor.","             */","            this.publish(INIT, {","                queuable:false,","                fireOnce:true,","                defaultTargetOnly:true,","                defaultFn:this._defInitFn","            });","","            this._preInitEventCfg(config);","","            this.fire(INIT, {cfg: config});","","            return this;","        },","","        /**","         * Handles the special on, after and target properties which allow the user to","         * easily configure on and after listeners as well as bubble targets during","         * construction, prior to init.","         *","         * @private","         * @method _preInitEventCfg","         * @param {Object} config The user configuration object","         */","        _preInitEventCfg : function(config) {","            if (config) {","                if (config.on) {","                    this.on(config.on);","                }","                if (config.after) {","                    this.after(config.after);","                }","            }","","            var i, l, target,","                userTargets = (config && BUBBLETARGETS in config);","","            if (userTargets || _BUBBLETARGETS in this) {","                target = userTargets ? (config && config.bubbleTargets) : this._bubbleTargets;","                if (L.isArray(target)) {","                    for (i = 0, l = target.length; i < l; i++) {","                        this.addTarget(target[i]);","                    }","                } else if (target) {","                    this.addTarget(target);","                }","            }","        },","","        /**","         * <p>","         * Destroy lifecycle method. Fires the destroy","         * event, prior to invoking destructors for the","         * class hierarchy.","         * </p>","         * <p>","         * Subscribers to the destroy","         * event can invoke preventDefault on the event object, to prevent destruction","         * from proceeding.","         * </p>","         * @method destroy","         * @return {Base} A reference to this object","         * @chainable","         */","        destroy: function() {","","            /**","             * <p>","             * Lifecycle event for the destroy phase,","             * fired prior to destruction. Invoking the preventDefault","             * method on the event object provided to subscribers will","             * prevent destruction from proceeding.","             * </p>","             * <p>","             * Subscribers to the \"after\" moment of this event, will be notified","             * after destruction is complete (and as a result cannot prevent","             * destruction).","             * </p>","             * @event destroy","             * @preventable _defDestroyFn","             * @param {EventFacade} e Event object","             */","            this.publish(DESTROY, {","                queuable:false,","                fireOnce:true,","                defaultTargetOnly:true,","                defaultFn: this._defDestroyFn","            });","            this.fire(DESTROY);","","            this.detachAll();","            return this;","        },","","        /**","         * Default init event handler","         *","         * @method _defInitFn","         * @param {EventFacade} e Event object, with a cfg property which","         * refers to the configuration object passed to the constructor.","         * @protected","         */","        _defInitFn : function(e) {","            this._baseInit(e.cfg);","        },","","        /**","         * Default destroy event handler","         *","         * @method _defDestroyFn","         * @param {EventFacade} e Event object","         * @protected","         */","        _defDestroyFn : function(e) {","            this._baseDestroy(e.cfg);","        }","    };","","    Y.mix(BaseObservable, AttributeObservable, false, null, 1);","","    Y.BaseObservable = BaseObservable;","","","}, '@VERSION@', {\"requires\": [\"attribute-observable\"]});"];
_yuitest_coverage["build/base-observable/base-observable.js"].lines = {"1":0,"10":0,"30":0,"32":0,"33":0,"35":0,"44":0,"45":0,"47":0,"48":0,"79":0,"86":0,"88":0,"90":0,"103":0,"104":0,"105":0,"107":0,"108":0,"112":0,"115":0,"116":0,"117":0,"118":0,"119":0,"121":0,"122":0,"160":0,"166":0,"168":0,"169":0,"181":0,"192":0,"196":0,"198":0};
_yuitest_coverage["build/base-observable/base-observable.js"].functions = {"BaseObservable:30":0,"_initAttribute:43":0,"init:61":0,"_preInitEventCfg:102":0,"destroy:142":0,"_defInitFn:180":0,"_defDestroyFn:191":0,"(anonymous 1):1":0};
_yuitest_coverage["build/base-observable/base-observable.js"].coveredLines = 35;
_yuitest_coverage["build/base-observable/base-observable.js"].coveredFunctions = 8;
_yuitest_coverline("build/base-observable/base-observable.js", 1);
YUI.add('base-observable', function (Y, NAME) {

    /**
    The `base-observable` submodule adds observability to Base's lifecycle and
    attributes, and also make it an `EventTarget`.

    @module base
    @submodule base-observable
    **/
    _yuitest_coverfunc("build/base-observable/base-observable.js", "(anonymous 1)", 1);
_yuitest_coverline("build/base-observable/base-observable.js", 10);
var L = Y.Lang,

        DESTROY = "destroy",
        INIT = "init",

        BUBBLETARGETS = "bubbleTargets",
        _BUBBLETARGETS = "_bubbleTargets",

        AttributeObservable = Y.AttributeObservable;

    /**
    Provides an augmentable implementation of lifecycle and attribute events for
    `BaseCore`.

    @class BaseObservable
    @extensionfor BaseCore
    @uses AttributeObservable
    @uses EventTarget
    @since 3.7.0
    **/
    _yuitest_coverline("build/base-observable/base-observable.js", 30);
function BaseObservable() {}

    _yuitest_coverline("build/base-observable/base-observable.js", 32);
BaseObservable._ATTR_CFG      = AttributeObservable._ATTR_CFG.concat();
    _yuitest_coverline("build/base-observable/base-observable.js", 33);
BaseObservable._NON_ATTRS_CFG = ["on", "after", "bubbleTargets"];

    _yuitest_coverline("build/base-observable/base-observable.js", 35);
BaseObservable.prototype = {

        /**
         * Initializes Attribute
         *
         * @method _initAttribute
         * @private
         */
        _initAttribute: function(cfg) {
            _yuitest_coverfunc("build/base-observable/base-observable.js", "_initAttribute", 43);
_yuitest_coverline("build/base-observable/base-observable.js", 44);
Y.BaseCore.prototype._initAttribute.apply(this, arguments);
            _yuitest_coverline("build/base-observable/base-observable.js", 45);
Y.AttributeObservable.call(this);

            _yuitest_coverline("build/base-observable/base-observable.js", 47);
this._eventPrefix = this.constructor.EVENT_PREFIX || this.constructor.NAME;
            _yuitest_coverline("build/base-observable/base-observable.js", 48);
this._yuievt.config.prefix = this._eventPrefix;
        },

        /**
         * Init lifecycle method, invoked during construction.
         * Fires the init event prior to setting up attributes and
         * invoking initializers for the class hierarchy.
         *
         * @method init
         * @chainable
         * @param {Object} config Object with configuration property name/value pairs
         * @return {Base} A reference to this object
         */
        init: function(config) {
            /**
             * <p>
             * Lifecycle event for the init phase, fired prior to initialization.
             * Invoking the preventDefault() method on the event object provided
             * to subscribers will prevent initialization from occuring.
             * </p>
             * <p>
             * Subscribers to the "after" momemt of this event, will be notified
             * after initialization of the object is complete (and therefore
             * cannot prevent initialization).
             * </p>
             *
             * @event init
             * @preventable _defInitFn
             * @param {EventFacade} e Event object, with a cfg property which
             * refers to the configuration object passed to the constructor.
             */
            _yuitest_coverfunc("build/base-observable/base-observable.js", "init", 61);
_yuitest_coverline("build/base-observable/base-observable.js", 79);
this.publish(INIT, {
                queuable:false,
                fireOnce:true,
                defaultTargetOnly:true,
                defaultFn:this._defInitFn
            });

            _yuitest_coverline("build/base-observable/base-observable.js", 86);
this._preInitEventCfg(config);

            _yuitest_coverline("build/base-observable/base-observable.js", 88);
this.fire(INIT, {cfg: config});

            _yuitest_coverline("build/base-observable/base-observable.js", 90);
return this;
        },

        /**
         * Handles the special on, after and target properties which allow the user to
         * easily configure on and after listeners as well as bubble targets during
         * construction, prior to init.
         *
         * @private
         * @method _preInitEventCfg
         * @param {Object} config The user configuration object
         */
        _preInitEventCfg : function(config) {
            _yuitest_coverfunc("build/base-observable/base-observable.js", "_preInitEventCfg", 102);
_yuitest_coverline("build/base-observable/base-observable.js", 103);
if (config) {
                _yuitest_coverline("build/base-observable/base-observable.js", 104);
if (config.on) {
                    _yuitest_coverline("build/base-observable/base-observable.js", 105);
this.on(config.on);
                }
                _yuitest_coverline("build/base-observable/base-observable.js", 107);
if (config.after) {
                    _yuitest_coverline("build/base-observable/base-observable.js", 108);
this.after(config.after);
                }
            }

            _yuitest_coverline("build/base-observable/base-observable.js", 112);
var i, l, target,
                userTargets = (config && BUBBLETARGETS in config);

            _yuitest_coverline("build/base-observable/base-observable.js", 115);
if (userTargets || _BUBBLETARGETS in this) {
                _yuitest_coverline("build/base-observable/base-observable.js", 116);
target = userTargets ? (config && config.bubbleTargets) : this._bubbleTargets;
                _yuitest_coverline("build/base-observable/base-observable.js", 117);
if (L.isArray(target)) {
                    _yuitest_coverline("build/base-observable/base-observable.js", 118);
for (i = 0, l = target.length; i < l; i++) {
                        _yuitest_coverline("build/base-observable/base-observable.js", 119);
this.addTarget(target[i]);
                    }
                } else {_yuitest_coverline("build/base-observable/base-observable.js", 121);
if (target) {
                    _yuitest_coverline("build/base-observable/base-observable.js", 122);
this.addTarget(target);
                }}
            }
        },

        /**
         * <p>
         * Destroy lifecycle method. Fires the destroy
         * event, prior to invoking destructors for the
         * class hierarchy.
         * </p>
         * <p>
         * Subscribers to the destroy
         * event can invoke preventDefault on the event object, to prevent destruction
         * from proceeding.
         * </p>
         * @method destroy
         * @return {Base} A reference to this object
         * @chainable
         */
        destroy: function() {

            /**
             * <p>
             * Lifecycle event for the destroy phase,
             * fired prior to destruction. Invoking the preventDefault
             * method on the event object provided to subscribers will
             * prevent destruction from proceeding.
             * </p>
             * <p>
             * Subscribers to the "after" moment of this event, will be notified
             * after destruction is complete (and as a result cannot prevent
             * destruction).
             * </p>
             * @event destroy
             * @preventable _defDestroyFn
             * @param {EventFacade} e Event object
             */
            _yuitest_coverfunc("build/base-observable/base-observable.js", "destroy", 142);
_yuitest_coverline("build/base-observable/base-observable.js", 160);
this.publish(DESTROY, {
                queuable:false,
                fireOnce:true,
                defaultTargetOnly:true,
                defaultFn: this._defDestroyFn
            });
            _yuitest_coverline("build/base-observable/base-observable.js", 166);
this.fire(DESTROY);

            _yuitest_coverline("build/base-observable/base-observable.js", 168);
this.detachAll();
            _yuitest_coverline("build/base-observable/base-observable.js", 169);
return this;
        },

        /**
         * Default init event handler
         *
         * @method _defInitFn
         * @param {EventFacade} e Event object, with a cfg property which
         * refers to the configuration object passed to the constructor.
         * @protected
         */
        _defInitFn : function(e) {
            _yuitest_coverfunc("build/base-observable/base-observable.js", "_defInitFn", 180);
_yuitest_coverline("build/base-observable/base-observable.js", 181);
this._baseInit(e.cfg);
        },

        /**
         * Default destroy event handler
         *
         * @method _defDestroyFn
         * @param {EventFacade} e Event object
         * @protected
         */
        _defDestroyFn : function(e) {
            _yuitest_coverfunc("build/base-observable/base-observable.js", "_defDestroyFn", 191);
_yuitest_coverline("build/base-observable/base-observable.js", 192);
this._baseDestroy(e.cfg);
        }
    };

    _yuitest_coverline("build/base-observable/base-observable.js", 196);
Y.mix(BaseObservable, AttributeObservable, false, null, 1);

    _yuitest_coverline("build/base-observable/base-observable.js", 198);
Y.BaseObservable = BaseObservable;


}, '@VERSION@', {"requires": ["attribute-observable"]});
