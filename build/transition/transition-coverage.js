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
_yuitest_coverage["build/transition/transition.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/transition/transition.js",
    code: []
};
_yuitest_coverage["build/transition/transition.js"].code=["YUI.add('transition', function (Y, NAME) {","","/**","* Provides the transition method for Node.","* Transition has no API of its own, but adds the transition method to Node.","*","* @module transition","* @requires node-style","*/","","var CAMEL_VENDOR_PREFIX = '',","    VENDOR_PREFIX = '',","    DOCUMENT = Y.config.doc,","    DOCUMENT_ELEMENT = 'documentElement',","    DOCUMENT_STYLE = DOCUMENT[DOCUMENT_ELEMENT].style,","    TRANSITION_CAMEL = 'transition',","    TRANSITION_PROPERTY_CAMEL = 'transitionProperty',","    TRANSFORM_CAMEL = 'transform',","    TRANSITION_PROPERTY,","    TRANSITION_DURATION,","    TRANSITION_TIMING_FUNCTION,","    TRANSITION_DELAY,","    TRANSITION_END,","    ON_TRANSITION_END,","","    EMPTY_OBJ = {},","","    VENDORS = [","        'Webkit',","        'Moz'","    ],","","    VENDOR_TRANSITION_END = {","        Webkit: 'webkitTransitionEnd'","    },","","/**"," * A class for constructing transition instances."," * Adds the \"transition\" method to Node."," * @class Transition"," * @constructor"," */","","Transition = function() {","    this.init.apply(this, arguments);","};","","Transition._toCamel = function(property) {","    property = property.replace(/-([a-z])/gi, function(m0, m1) {","        return m1.toUpperCase();","    });","","    return property;","};","","Transition._toHyphen = function(property) {","    property = property.replace(/([A-Z]?)([a-z]+)([A-Z]?)/g, function(m0, m1, m2, m3) {","        var str = ((m1) ? '-' + m1.toLowerCase() : '') + m2;","","        if (m3) {","            str += '-' + m3.toLowerCase();","        }","","        return str;","    });","","    return property;","};","","Transition.SHOW_TRANSITION = 'fadeIn';","Transition.HIDE_TRANSITION = 'fadeOut';","","Transition.useNative = false;","","if ('transition' in DOCUMENT_STYLE ","    && 'transitionProperty' in DOCUMENT_STYLE ","    && 'transitionDuration' in DOCUMENT_STYLE","    && 'transitionTimingFunction' in DOCUMENT_STYLE","    && 'transitionDelay' in DOCUMENT_STYLE) {","    Transition.useNative = true;","    Transition.supported = true; // TODO: remove","} else {","    Y.Array.each(VENDORS, function(val) { // then vendor specific","        var property = val + 'Transition';","        if (property in DOCUMENT[DOCUMENT_ELEMENT].style) {","            CAMEL_VENDOR_PREFIX = val;","            VENDOR_PREFIX       = Transition._toHyphen(val) + '-';","","            Transition.useNative = true;","            Transition.supported = true; // TODO: remove","            Transition._VENDOR_PREFIX = val;","        }","    });","}","","if (CAMEL_VENDOR_PREFIX) {","    TRANSITION_CAMEL          = CAMEL_VENDOR_PREFIX + 'Transition';","    TRANSITION_PROPERTY_CAMEL = CAMEL_VENDOR_PREFIX + 'TransitionProperty';","    TRANSFORM_CAMEL           = CAMEL_VENDOR_PREFIX + 'Transform';","}","","TRANSITION_PROPERTY        = VENDOR_PREFIX + 'transition-property';","TRANSITION_DURATION        = VENDOR_PREFIX + 'transition-duration';","TRANSITION_TIMING_FUNCTION = VENDOR_PREFIX + 'transition-timing-function';","TRANSITION_DELAY           = VENDOR_PREFIX + 'transition-delay';","","TRANSITION_END    = 'transitionend';","ON_TRANSITION_END = 'on' + CAMEL_VENDOR_PREFIX.toLowerCase() + 'transitionend';","TRANSITION_END    = VENDOR_TRANSITION_END[CAMEL_VENDOR_PREFIX] || TRANSITION_END;","","Transition.fx = {};","Transition.toggles = {};","","Transition._hasEnd = {};","","Transition._reKeywords = /^(?:node|duration|iterations|easing|delay|on|onstart|onend)$/i;","","Y.Node.DOM_EVENTS[TRANSITION_END] = 1;","","Transition.NAME = 'transition';","","Transition.DEFAULT_EASING = 'ease';","Transition.DEFAULT_DURATION = 0.5;","Transition.DEFAULT_DELAY = 0;","","Transition._nodeAttrs = {};","","Transition.prototype = {","    constructor: Transition,","    init: function(node, config) {","        var anim = this;","        anim._node = node;","        if (!anim._running && config) {","            anim._config = config;","            node._transition = anim; // cache for reuse","","            anim._duration = ('duration' in config) ?","                config.duration: anim.constructor.DEFAULT_DURATION;","","            anim._delay = ('delay' in config) ?","                config.delay: anim.constructor.DEFAULT_DELAY;","","            anim._easing = config.easing || anim.constructor.DEFAULT_EASING;","            anim._count = 0; // track number of animated properties","            anim._running = false;","","        }","","        return anim;","    },","","    addProperty: function(prop, config) {","        var anim = this,","            node = this._node,","            uid = Y.stamp(node),","            nodeInstance = Y.one(node),","            attrs = Transition._nodeAttrs[uid],","            computed,","            compareVal,","            dur,","            attr,","            val;","","        if (!attrs) {","            attrs = Transition._nodeAttrs[uid] = {};","        }","","        attr = attrs[prop];","","        // might just be a value","        if (config && config.value !== undefined) {","            val = config.value;","        } else if (config !== undefined) {","            val = config;","            config = EMPTY_OBJ;","        }","","        if (typeof val === 'function') {","            val = val.call(nodeInstance, nodeInstance);","        }","","        if (attr && attr.transition) {","            // take control if another transition owns this property","            if (attr.transition !== anim) {","                attr.transition._count--; // remapping attr to this transition","            }","        }","","        anim._count++; // properties per transition","","        // make 0 async and fire events","        dur = ((typeof config.duration !== 'undefined') ? config.duration :","                    anim._duration) || 0.0001;","","        attrs[prop] = {","            value: val,","            duration: dur,","            delay: (typeof config.delay !== 'undefined') ? config.delay :","                    anim._delay,","","            easing: config.easing || anim._easing,","","            transition: anim","        };","","        // native end event doesnt fire when setting to same value","        // supplementing with timer","        // val may be a string or number (height: 0, etc), but computedStyle is always string","        computed = Y.DOM.getComputedStyle(node, prop);","        compareVal = (typeof val === 'string') ? computed : parseFloat(computed);","","        if (Transition.useNative && compareVal === val) {","            setTimeout(function() {","                anim._onNativeEnd.call(node, {","                    propertyName: prop,","                    elapsedTime: dur","                });","            }, dur * 1000);","        }","    },","","    removeProperty: function(prop) {","        var anim = this,","            attrs = Transition._nodeAttrs[Y.stamp(anim._node)];","","        if (attrs && attrs[prop]) {","            delete attrs[prop];","            anim._count--;","        }","","    },","","    initAttrs: function(config) {","        var attr,","            node = this._node;","","        if (config.transform && !config[TRANSFORM_CAMEL]) {","            config[TRANSFORM_CAMEL] = config.transform;","            delete config.transform; // TODO: copy","        }","","        for (attr in config) {","            if (config.hasOwnProperty(attr) && !Transition._reKeywords.test(attr)) {","                this.addProperty(attr, config[attr]);","","                // when size is auto or % webkit starts from zero instead of computed","                // (https://bugs.webkit.org/show_bug.cgi?id=16020)","                // TODO: selective set","                if (node.style[attr] === '') {","                    Y.DOM.setStyle(node, attr, Y.DOM.getComputedStyle(node, attr));","                }","            }","        }","    },","","    /**","     * Starts or an animation.","     * @method run","     * @chainable","     * @private","     */","    run: function(callback) {","        var anim = this,","            node = anim._node,","            config = anim._config,","            data = {","                type: 'transition:start',","                config: config","            };","","","        if (!anim._running) {","            anim._running = true;","","            if (config.on && config.on.start) {","                config.on.start.call(Y.one(node), data);","            }","","            anim.initAttrs(anim._config);","","            anim._callback = callback;","            anim._start();","        }","","","        return anim;","    },","","    _start: function() {","        this._runNative();","    },","","    _prepDur: function(dur) {","        dur = parseFloat(dur) * 1000;","","        return dur + 'ms';","    },","","    _runNative: function() {","        var anim = this,","            node = anim._node,","            uid = Y.stamp(node),","            style = node.style,","            computed = node.ownerDocument.defaultView.getComputedStyle(node),","            attrs = Transition._nodeAttrs[uid],","            cssText = '',","            cssTransition = computed[Transition._toCamel(TRANSITION_PROPERTY)],","","            transitionText = TRANSITION_PROPERTY + ': ',","            duration = TRANSITION_DURATION + ': ',","            easing = TRANSITION_TIMING_FUNCTION + ': ',","            delay = TRANSITION_DELAY + ': ',","            hyphy,","            attr,","            name;","","        // preserve existing transitions","        if (cssTransition !== 'all') {","            transitionText += cssTransition + ',';","            duration += computed[Transition._toCamel(TRANSITION_DURATION)] + ',';","            easing += computed[Transition._toCamel(TRANSITION_TIMING_FUNCTION)] + ',';","            delay += computed[Transition._toCamel(TRANSITION_DELAY)] + ',';","","        }","","        // run transitions mapped to this instance","        for (name in attrs) {","            hyphy = Transition._toHyphen(name);","            attr = attrs[name];","            if ((attr = attrs[name]) && attr.transition === anim) {","                if (name in node.style) { // only native styles allowed","                    duration += anim._prepDur(attr.duration) + ',';","                    delay += anim._prepDur(attr.delay) + ',';","                    easing += (attr.easing) + ',';","","                    transitionText += hyphy + ',';","                    cssText += hyphy + ': ' + attr.value + '; ';","                } else {","                    this.removeProperty(name);","                }","            }","        }","","        transitionText = transitionText.replace(/,$/, ';');","        duration = duration.replace(/,$/, ';');","        easing = easing.replace(/,$/, ';');","        delay = delay.replace(/,$/, ';');","","        // only one native end event per node","        if (!Transition._hasEnd[uid]) {","            node.addEventListener(TRANSITION_END, anim._onNativeEnd, '');","            Transition._hasEnd[uid] = true;","","        }","","        style.cssText += transitionText + duration + easing + delay + cssText;","","    },","","    _end: function(elapsed) {","        var anim = this,","            node = anim._node,","            callback = anim._callback,","            config = anim._config,","            data = {","                type: 'transition:end',","                config: config,","                elapsedTime: elapsed","            },","","            nodeInstance = Y.one(node);","","        anim._running = false;","        anim._callback = null;","","        if (node) {","            if (config.on && config.on.end) {","                setTimeout(function() { // IE: allow previous update to finish","                    config.on.end.call(nodeInstance, data);","","                    // nested to ensure proper fire order","                    if (callback) {","                        callback.call(nodeInstance, data);","                    }","","                }, 1);","            } else if (callback) {","                setTimeout(function() { // IE: allow previous update to finish","                    callback.call(nodeInstance, data);","                }, 1);","            }","        }","","    },","","    _endNative: function(name) {","        var node = this._node,","            value = node.ownerDocument.defaultView.getComputedStyle(node, '')[Transition._toCamel(TRANSITION_PROPERTY)];","","        name = Transition._toHyphen(name);","        if (typeof value === 'string') {","            value = value.replace(new RegExp('(?:^|,\\\\s)' + name + ',?'), ',');","            value = value.replace(/^,|,$/, '');","            node.style[TRANSITION_CAMEL] = value;","        }","    },","","    _onNativeEnd: function(e) {","        var node = this,","            uid = Y.stamp(node),","            event = e,//e._event,","            name = Transition._toCamel(event.propertyName),","            elapsed = event.elapsedTime,","            attrs = Transition._nodeAttrs[uid],","            attr = attrs[name],","            anim = (attr) ? attr.transition : null,","            data,","            config;","","        if (anim) {","            anim.removeProperty(name);","            anim._endNative(name);","            config = anim._config[name];","","            data = {","                type: 'propertyEnd',","                propertyName: name,","                elapsedTime: elapsed,","                config: config","            };","","            if (config && config.on && config.on.end) {","                config.on.end.call(Y.one(node), data);","            }","","            if (anim._count <= 0)  { // after propertyEnd fires","                anim._end(elapsed);","                node.style[TRANSITION_PROPERTY_CAMEL] = ''; // clean up style","            }","        }","    },","","    destroy: function() {","        var anim = this,","            node = anim._node;","","        if (node) {","            node.removeEventListener(TRANSITION_END, anim._onNativeEnd, false);","            anim._node = null;","        }","    }","};","","Y.Transition = Transition;","Y.TransitionNative = Transition; // TODO: remove","","/**"," *   Animate one or more css properties to a given value. Requires the \"transition\" module."," *   <pre>example usage:"," *       Y.one('#demo').transition({"," *           duration: 1, // in seconds, default is 0.5"," *           easing: 'ease-out', // default is 'ease'"," *           delay: '1', // delay start for 1 second, default is 0"," *"," *           height: '10px',"," *           width: '10px',"," *"," *           opacity: { // per property"," *               value: 0,"," *               duration: 2,"," *               delay: 2,"," *               easing: 'ease-in'"," *           }"," *       });"," *   </pre>"," *   @for Node"," *   @method transition"," *   @param {Object} config An object containing one or more style properties, a duration and an easing."," *   @param {Function} callback A function to run after the transition has completed."," *   @chainable","*/","Y.Node.prototype.transition = function(name, config, callback) {","    var","        transitionAttrs = Transition._nodeAttrs[Y.stamp(this._node)],","        anim = (transitionAttrs) ? transitionAttrs.transition || null : null,","        fxConfig,","        prop;","","    if (typeof name === 'string') { // named effect, pull config from registry","        if (typeof config === 'function') {","            callback = config;","            config = null;","        }","","        fxConfig = Transition.fx[name];","","        if (config && typeof config !== 'boolean') {","            config = Y.clone(config);","","            for (prop in fxConfig) {","                if (fxConfig.hasOwnProperty(prop)) {","                    if (! (prop in config)) {","                        config[prop] = fxConfig[prop];","                    }","                }","            }","        } else {","            config = fxConfig;","        }","","    } else { // name is a config, config is a callback or undefined","        callback = config;","        config = name;","    }","","    if (anim && !anim._running) {","        anim.init(this, config);","    } else {","        anim = new Transition(this._node, config);","    }","","    anim.run(callback);","    return this;","};","","Y.Node.prototype.show = function(name, config, callback) {","    this._show(); // show prior to transition","    if (name && Y.Transition) {","        if (typeof name !== 'string' && !name.push) { // named effect or array of effects supercedes default","            if (typeof config === 'function') {","                callback = config;","                config = name;","            }","            name = Transition.SHOW_TRANSITION;","        }","        this.transition(name, config, callback);","    }","    return this;","};","","Y.NodeList.prototype.show = function(name, config, callback) {","    var nodes = this._nodes,","        i = 0,","        node;","","    while ((node = nodes[i++])) {","        Y.one(node).show(name, config, callback);","    }","","    return this;","};","","","","var _wrapCallBack = function(anim, fn, callback) {","    return function() {","        if (fn) {","            fn.call(anim);","        }","        if (callback && typeof callback === 'function') {","            callback.apply(anim._node, arguments);","        }","    };","};","","Y.Node.prototype.hide = function(name, config, callback) {","    if (name && Y.Transition) {","        if (typeof config === 'function') {","            callback = config;","            config = null;","        }","","        callback = _wrapCallBack(this, this._hide, callback); // wrap with existing callback","        if (typeof name !== 'string' && !name.push) { // named effect or array of effects supercedes default","            if (typeof config === 'function') {","                callback = config;","                config = name;","            }","            name = Transition.HIDE_TRANSITION;","        }","        this.transition(name, config, callback);","    } else {","        this._hide();","    }","    return this;","};","","Y.NodeList.prototype.hide = function(name, config, callback) {","    var nodes = this._nodes,","        i = 0,","        node;","","    while ((node = nodes[i++])) {","        Y.one(node).hide(name, config, callback);","    }","","    return this;","};","","/**"," *   Animate one or more css properties to a given value. Requires the \"transition\" module."," *   <pre>example usage:"," *       Y.all('.demo').transition({"," *           duration: 1, // in seconds, default is 0.5"," *           easing: 'ease-out', // default is 'ease'"," *           delay: '1', // delay start for 1 second, default is 0"," *"," *           height: '10px',"," *           width: '10px',"," *"," *           opacity: { // per property"," *               value: 0,"," *               duration: 2,"," *               delay: 2,"," *               easing: 'ease-in'"," *           }"," *       });"," *   </pre>"," *   @for NodeList"," *   @method transition"," *   @param {Object} config An object containing one or more style properties, a duration and an easing."," *   @param {Function} callback A function to run after the transition has completed. The callback fires"," *       once per item in the NodeList."," *   @chainable","*/","Y.NodeList.prototype.transition = function(config, callback) {","    var nodes = this._nodes,","        i = 0,","        node;","","    while ((node = nodes[i++])) {","        Y.one(node).transition(config, callback);","    }","","    return this;","};","","Y.Node.prototype.toggleView = function(name, on, callback) {","    this._toggles = this._toggles || [];","    callback = arguments[arguments.length - 1];","","    if (typeof name !== 'string') { // no transition, just toggle","        on = name;","        this._toggleView(on, callback); // call original _toggleView in Y.Node","        return;","    }","","    if (typeof on === 'function') { // Ignore \"on\" if used for callback argument.","        on = undefined;","    }","","    if (typeof on === 'undefined' && name in this._toggles) { // reverse current toggle","        on = ! this._toggles[name];","    }","","    on = (on) ? 1 : 0;","    if (on) {","        this._show();","    }  else {","        callback = _wrapCallBack(this, this._hide, callback);","    }","","    this._toggles[name] = on;","    this.transition(Y.Transition.toggles[name][on], callback);","","    return this;","};","","Y.NodeList.prototype.toggleView = function(name, on, callback) {","    var nodes = this._nodes,","        i = 0,","        node;","","    while ((node = nodes[i++])) {","        node = Y.one(node);","        node.toggleView.apply(node, arguments);","    }","","    return this;","};","","Y.mix(Transition.fx, {","    fadeOut: {","        opacity: 0,","        duration: 0.5,","        easing: 'ease-out'","    },","","    fadeIn: {","        opacity: 1,","        duration: 0.5,","        easing: 'ease-in'","    },","","    sizeOut: {","        height: 0,","        width: 0,","        duration: 0.75,","        easing: 'ease-out'","    },","","    sizeIn: {","        height: function(node) {","            return node.get('scrollHeight') + 'px';","        },","        width: function(node) {","            return node.get('scrollWidth') + 'px';","        },","        duration: 0.5,","        easing: 'ease-in',","","        on: {","            start: function() {","                var overflow = this.getStyle('overflow');","                if (overflow !== 'hidden') { // enable scrollHeight/Width","                    this.setStyle('overflow', 'hidden');","                    this._transitionOverflow = overflow;","                }","            },","","            end: function() {","                if (this._transitionOverflow) { // revert overridden value","                    this.setStyle('overflow', this._transitionOverflow);","                    delete this._transitionOverflow;","                }","            }","        }","    }","});","","Y.mix(Transition.toggles, {","    size: ['sizeOut', 'sizeIn'],","    fade: ['fadeOut', 'fadeIn']","});","","","}, '@VERSION@', {\"requires\": [\"node-style\"]});"];
_yuitest_coverage["build/transition/transition.js"].lines = {"1":0,"11":0,"45":0,"48":0,"49":0,"50":0,"53":0,"56":0,"57":0,"58":0,"60":0,"61":0,"64":0,"67":0,"70":0,"71":0,"73":0,"75":0,"80":0,"81":0,"83":0,"84":0,"85":0,"86":0,"87":0,"89":0,"90":0,"91":0,"96":0,"97":0,"98":0,"99":0,"102":0,"103":0,"104":0,"105":0,"107":0,"108":0,"109":0,"111":0,"112":0,"114":0,"116":0,"118":0,"120":0,"122":0,"123":0,"124":0,"126":0,"128":0,"131":0,"132":0,"133":0,"134":0,"135":0,"137":0,"140":0,"143":0,"144":0,"145":0,"149":0,"153":0,"164":0,"165":0,"168":0,"171":0,"172":0,"173":0,"174":0,"175":0,"178":0,"179":0,"182":0,"184":0,"185":0,"189":0,"192":0,"195":0,"209":0,"210":0,"212":0,"213":0,"214":0,"223":0,"226":0,"227":0,"228":0,"234":0,"237":0,"238":0,"239":0,"242":0,"243":0,"244":0,"249":0,"250":0,"263":0,"272":0,"273":0,"275":0,"276":0,"279":0,"281":0,"282":0,"286":0,"290":0,"294":0,"296":0,"300":0,"318":0,"319":0,"320":0,"321":0,"322":0,"327":0,"328":0,"329":0,"330":0,"331":0,"332":0,"333":0,"334":0,"336":0,"337":0,"339":0,"344":0,"345":0,"346":0,"347":0,"350":0,"351":0,"352":0,"356":0,"361":0,"373":0,"374":0,"376":0,"377":0,"378":0,"379":0,"382":0,"383":0,"387":0,"388":0,"389":0,"397":0,"400":0,"401":0,"402":0,"403":0,"404":0,"409":0,"420":0,"421":0,"422":0,"423":0,"425":0,"432":0,"433":0,"436":0,"437":0,"438":0,"444":0,"447":0,"448":0,"449":0,"454":0,"455":0,"482":0,"483":0,"489":0,"490":0,"491":0,"492":0,"495":0,"497":0,"498":0,"500":0,"501":0,"502":0,"503":0,"508":0,"512":0,"513":0,"516":0,"517":0,"519":0,"522":0,"523":0,"526":0,"527":0,"528":0,"529":0,"530":0,"531":0,"532":0,"534":0,"536":0,"538":0,"541":0,"542":0,"546":0,"547":0,"550":0,"555":0,"556":0,"557":0,"558":0,"560":0,"561":0,"566":0,"567":0,"568":0,"569":0,"570":0,"573":0,"574":0,"575":0,"576":0,"577":0,"579":0,"581":0,"583":0,"585":0,"588":0,"589":0,"593":0,"594":0,"597":0,"626":0,"627":0,"631":0,"632":0,"635":0,"638":0,"639":0,"640":0,"642":0,"643":0,"644":0,"645":0,"648":0,"649":0,"652":0,"653":0,"656":0,"657":0,"658":0,"660":0,"663":0,"664":0,"666":0,"669":0,"670":0,"674":0,"675":0,"676":0,"679":0,"682":0,"704":0,"707":0,"714":0,"715":0,"716":0,"717":0,"722":0,"723":0,"724":0,"731":0};
_yuitest_coverage["build/transition/transition.js"].functions = {"Transition:44":0,"(anonymous 2):49":0,"_toCamel:48":0,"(anonymous 3):57":0,"_toHyphen:56":0,"(anonymous 4):83":0,"init:130":0,"(anonymous 5):213":0,"addProperty:152":0,"removeProperty:222":0,"initAttrs:233":0,"run:262":0,"_start:289":0,"_prepDur:293":0,"_runNative:299":0,"(anonymous 6):378":0,"(anonymous 7):388":0,"_end:360":0,"_endNative:396":0,"_onNativeEnd:408":0,"destroy:443":0,"transition:482":0,"show:526":0,"show:541":0,"(anonymous 8):556":0,"_wrapCallBack:555":0,"hide:566":0,"hide:588":0,"transition:626":0,"toggleView:638":0,"toggleView:669":0,"height:703":0,"width:706":0,"start:713":0,"end:721":0,"(anonymous 1):1":0};
_yuitest_coverage["build/transition/transition.js"].coveredLines = 269;
_yuitest_coverage["build/transition/transition.js"].coveredFunctions = 36;
_yuitest_coverline("build/transition/transition.js", 1);
YUI.add('transition', function (Y, NAME) {

/**
* Provides the transition method for Node.
* Transition has no API of its own, but adds the transition method to Node.
*
* @module transition
* @requires node-style
*/

_yuitest_coverfunc("build/transition/transition.js", "(anonymous 1)", 1);
_yuitest_coverline("build/transition/transition.js", 11);
var CAMEL_VENDOR_PREFIX = '',
    VENDOR_PREFIX = '',
    DOCUMENT = Y.config.doc,
    DOCUMENT_ELEMENT = 'documentElement',
    DOCUMENT_STYLE = DOCUMENT[DOCUMENT_ELEMENT].style,
    TRANSITION_CAMEL = 'transition',
    TRANSITION_PROPERTY_CAMEL = 'transitionProperty',
    TRANSFORM_CAMEL = 'transform',
    TRANSITION_PROPERTY,
    TRANSITION_DURATION,
    TRANSITION_TIMING_FUNCTION,
    TRANSITION_DELAY,
    TRANSITION_END,
    ON_TRANSITION_END,

    EMPTY_OBJ = {},

    VENDORS = [
        'Webkit',
        'Moz'
    ],

    VENDOR_TRANSITION_END = {
        Webkit: 'webkitTransitionEnd'
    },

/**
 * A class for constructing transition instances.
 * Adds the "transition" method to Node.
 * @class Transition
 * @constructor
 */

Transition = function() {
    _yuitest_coverfunc("build/transition/transition.js", "Transition", 44);
_yuitest_coverline("build/transition/transition.js", 45);
this.init.apply(this, arguments);
};

_yuitest_coverline("build/transition/transition.js", 48);
Transition._toCamel = function(property) {
    _yuitest_coverfunc("build/transition/transition.js", "_toCamel", 48);
_yuitest_coverline("build/transition/transition.js", 49);
property = property.replace(/-([a-z])/gi, function(m0, m1) {
        _yuitest_coverfunc("build/transition/transition.js", "(anonymous 2)", 49);
_yuitest_coverline("build/transition/transition.js", 50);
return m1.toUpperCase();
    });

    _yuitest_coverline("build/transition/transition.js", 53);
return property;
};

_yuitest_coverline("build/transition/transition.js", 56);
Transition._toHyphen = function(property) {
    _yuitest_coverfunc("build/transition/transition.js", "_toHyphen", 56);
_yuitest_coverline("build/transition/transition.js", 57);
property = property.replace(/([A-Z]?)([a-z]+)([A-Z]?)/g, function(m0, m1, m2, m3) {
        _yuitest_coverfunc("build/transition/transition.js", "(anonymous 3)", 57);
_yuitest_coverline("build/transition/transition.js", 58);
var str = ((m1) ? '-' + m1.toLowerCase() : '') + m2;

        _yuitest_coverline("build/transition/transition.js", 60);
if (m3) {
            _yuitest_coverline("build/transition/transition.js", 61);
str += '-' + m3.toLowerCase();
        }

        _yuitest_coverline("build/transition/transition.js", 64);
return str;
    });

    _yuitest_coverline("build/transition/transition.js", 67);
return property;
};

_yuitest_coverline("build/transition/transition.js", 70);
Transition.SHOW_TRANSITION = 'fadeIn';
_yuitest_coverline("build/transition/transition.js", 71);
Transition.HIDE_TRANSITION = 'fadeOut';

_yuitest_coverline("build/transition/transition.js", 73);
Transition.useNative = false;

_yuitest_coverline("build/transition/transition.js", 75);
if ('transition' in DOCUMENT_STYLE 
    && 'transitionProperty' in DOCUMENT_STYLE 
    && 'transitionDuration' in DOCUMENT_STYLE
    && 'transitionTimingFunction' in DOCUMENT_STYLE
    && 'transitionDelay' in DOCUMENT_STYLE) {
    _yuitest_coverline("build/transition/transition.js", 80);
Transition.useNative = true;
    _yuitest_coverline("build/transition/transition.js", 81);
Transition.supported = true; // TODO: remove
} else {
    _yuitest_coverline("build/transition/transition.js", 83);
Y.Array.each(VENDORS, function(val) { // then vendor specific
        _yuitest_coverfunc("build/transition/transition.js", "(anonymous 4)", 83);
_yuitest_coverline("build/transition/transition.js", 84);
var property = val + 'Transition';
        _yuitest_coverline("build/transition/transition.js", 85);
if (property in DOCUMENT[DOCUMENT_ELEMENT].style) {
            _yuitest_coverline("build/transition/transition.js", 86);
CAMEL_VENDOR_PREFIX = val;
            _yuitest_coverline("build/transition/transition.js", 87);
VENDOR_PREFIX       = Transition._toHyphen(val) + '-';

            _yuitest_coverline("build/transition/transition.js", 89);
Transition.useNative = true;
            _yuitest_coverline("build/transition/transition.js", 90);
Transition.supported = true; // TODO: remove
            _yuitest_coverline("build/transition/transition.js", 91);
Transition._VENDOR_PREFIX = val;
        }
    });
}

_yuitest_coverline("build/transition/transition.js", 96);
if (CAMEL_VENDOR_PREFIX) {
    _yuitest_coverline("build/transition/transition.js", 97);
TRANSITION_CAMEL          = CAMEL_VENDOR_PREFIX + 'Transition';
    _yuitest_coverline("build/transition/transition.js", 98);
TRANSITION_PROPERTY_CAMEL = CAMEL_VENDOR_PREFIX + 'TransitionProperty';
    _yuitest_coverline("build/transition/transition.js", 99);
TRANSFORM_CAMEL           = CAMEL_VENDOR_PREFIX + 'Transform';
}

_yuitest_coverline("build/transition/transition.js", 102);
TRANSITION_PROPERTY        = VENDOR_PREFIX + 'transition-property';
_yuitest_coverline("build/transition/transition.js", 103);
TRANSITION_DURATION        = VENDOR_PREFIX + 'transition-duration';
_yuitest_coverline("build/transition/transition.js", 104);
TRANSITION_TIMING_FUNCTION = VENDOR_PREFIX + 'transition-timing-function';
_yuitest_coverline("build/transition/transition.js", 105);
TRANSITION_DELAY           = VENDOR_PREFIX + 'transition-delay';

_yuitest_coverline("build/transition/transition.js", 107);
TRANSITION_END    = 'transitionend';
_yuitest_coverline("build/transition/transition.js", 108);
ON_TRANSITION_END = 'on' + CAMEL_VENDOR_PREFIX.toLowerCase() + 'transitionend';
_yuitest_coverline("build/transition/transition.js", 109);
TRANSITION_END    = VENDOR_TRANSITION_END[CAMEL_VENDOR_PREFIX] || TRANSITION_END;

_yuitest_coverline("build/transition/transition.js", 111);
Transition.fx = {};
_yuitest_coverline("build/transition/transition.js", 112);
Transition.toggles = {};

_yuitest_coverline("build/transition/transition.js", 114);
Transition._hasEnd = {};

_yuitest_coverline("build/transition/transition.js", 116);
Transition._reKeywords = /^(?:node|duration|iterations|easing|delay|on|onstart|onend)$/i;

_yuitest_coverline("build/transition/transition.js", 118);
Y.Node.DOM_EVENTS[TRANSITION_END] = 1;

_yuitest_coverline("build/transition/transition.js", 120);
Transition.NAME = 'transition';

_yuitest_coverline("build/transition/transition.js", 122);
Transition.DEFAULT_EASING = 'ease';
_yuitest_coverline("build/transition/transition.js", 123);
Transition.DEFAULT_DURATION = 0.5;
_yuitest_coverline("build/transition/transition.js", 124);
Transition.DEFAULT_DELAY = 0;

_yuitest_coverline("build/transition/transition.js", 126);
Transition._nodeAttrs = {};

_yuitest_coverline("build/transition/transition.js", 128);
Transition.prototype = {
    constructor: Transition,
    init: function(node, config) {
        _yuitest_coverfunc("build/transition/transition.js", "init", 130);
_yuitest_coverline("build/transition/transition.js", 131);
var anim = this;
        _yuitest_coverline("build/transition/transition.js", 132);
anim._node = node;
        _yuitest_coverline("build/transition/transition.js", 133);
if (!anim._running && config) {
            _yuitest_coverline("build/transition/transition.js", 134);
anim._config = config;
            _yuitest_coverline("build/transition/transition.js", 135);
node._transition = anim; // cache for reuse

            _yuitest_coverline("build/transition/transition.js", 137);
anim._duration = ('duration' in config) ?
                config.duration: anim.constructor.DEFAULT_DURATION;

            _yuitest_coverline("build/transition/transition.js", 140);
anim._delay = ('delay' in config) ?
                config.delay: anim.constructor.DEFAULT_DELAY;

            _yuitest_coverline("build/transition/transition.js", 143);
anim._easing = config.easing || anim.constructor.DEFAULT_EASING;
            _yuitest_coverline("build/transition/transition.js", 144);
anim._count = 0; // track number of animated properties
            _yuitest_coverline("build/transition/transition.js", 145);
anim._running = false;

        }

        _yuitest_coverline("build/transition/transition.js", 149);
return anim;
    },

    addProperty: function(prop, config) {
        _yuitest_coverfunc("build/transition/transition.js", "addProperty", 152);
_yuitest_coverline("build/transition/transition.js", 153);
var anim = this,
            node = this._node,
            uid = Y.stamp(node),
            nodeInstance = Y.one(node),
            attrs = Transition._nodeAttrs[uid],
            computed,
            compareVal,
            dur,
            attr,
            val;

        _yuitest_coverline("build/transition/transition.js", 164);
if (!attrs) {
            _yuitest_coverline("build/transition/transition.js", 165);
attrs = Transition._nodeAttrs[uid] = {};
        }

        _yuitest_coverline("build/transition/transition.js", 168);
attr = attrs[prop];

        // might just be a value
        _yuitest_coverline("build/transition/transition.js", 171);
if (config && config.value !== undefined) {
            _yuitest_coverline("build/transition/transition.js", 172);
val = config.value;
        } else {_yuitest_coverline("build/transition/transition.js", 173);
if (config !== undefined) {
            _yuitest_coverline("build/transition/transition.js", 174);
val = config;
            _yuitest_coverline("build/transition/transition.js", 175);
config = EMPTY_OBJ;
        }}

        _yuitest_coverline("build/transition/transition.js", 178);
if (typeof val === 'function') {
            _yuitest_coverline("build/transition/transition.js", 179);
val = val.call(nodeInstance, nodeInstance);
        }

        _yuitest_coverline("build/transition/transition.js", 182);
if (attr && attr.transition) {
            // take control if another transition owns this property
            _yuitest_coverline("build/transition/transition.js", 184);
if (attr.transition !== anim) {
                _yuitest_coverline("build/transition/transition.js", 185);
attr.transition._count--; // remapping attr to this transition
            }
        }

        _yuitest_coverline("build/transition/transition.js", 189);
anim._count++; // properties per transition

        // make 0 async and fire events
        _yuitest_coverline("build/transition/transition.js", 192);
dur = ((typeof config.duration !== 'undefined') ? config.duration :
                    anim._duration) || 0.0001;

        _yuitest_coverline("build/transition/transition.js", 195);
attrs[prop] = {
            value: val,
            duration: dur,
            delay: (typeof config.delay !== 'undefined') ? config.delay :
                    anim._delay,

            easing: config.easing || anim._easing,

            transition: anim
        };

        // native end event doesnt fire when setting to same value
        // supplementing with timer
        // val may be a string or number (height: 0, etc), but computedStyle is always string
        _yuitest_coverline("build/transition/transition.js", 209);
computed = Y.DOM.getComputedStyle(node, prop);
        _yuitest_coverline("build/transition/transition.js", 210);
compareVal = (typeof val === 'string') ? computed : parseFloat(computed);

        _yuitest_coverline("build/transition/transition.js", 212);
if (Transition.useNative && compareVal === val) {
            _yuitest_coverline("build/transition/transition.js", 213);
setTimeout(function() {
                _yuitest_coverfunc("build/transition/transition.js", "(anonymous 5)", 213);
_yuitest_coverline("build/transition/transition.js", 214);
anim._onNativeEnd.call(node, {
                    propertyName: prop,
                    elapsedTime: dur
                });
            }, dur * 1000);
        }
    },

    removeProperty: function(prop) {
        _yuitest_coverfunc("build/transition/transition.js", "removeProperty", 222);
_yuitest_coverline("build/transition/transition.js", 223);
var anim = this,
            attrs = Transition._nodeAttrs[Y.stamp(anim._node)];

        _yuitest_coverline("build/transition/transition.js", 226);
if (attrs && attrs[prop]) {
            _yuitest_coverline("build/transition/transition.js", 227);
delete attrs[prop];
            _yuitest_coverline("build/transition/transition.js", 228);
anim._count--;
        }

    },

    initAttrs: function(config) {
        _yuitest_coverfunc("build/transition/transition.js", "initAttrs", 233);
_yuitest_coverline("build/transition/transition.js", 234);
var attr,
            node = this._node;

        _yuitest_coverline("build/transition/transition.js", 237);
if (config.transform && !config[TRANSFORM_CAMEL]) {
            _yuitest_coverline("build/transition/transition.js", 238);
config[TRANSFORM_CAMEL] = config.transform;
            _yuitest_coverline("build/transition/transition.js", 239);
delete config.transform; // TODO: copy
        }

        _yuitest_coverline("build/transition/transition.js", 242);
for (attr in config) {
            _yuitest_coverline("build/transition/transition.js", 243);
if (config.hasOwnProperty(attr) && !Transition._reKeywords.test(attr)) {
                _yuitest_coverline("build/transition/transition.js", 244);
this.addProperty(attr, config[attr]);

                // when size is auto or % webkit starts from zero instead of computed
                // (https://bugs.webkit.org/show_bug.cgi?id=16020)
                // TODO: selective set
                _yuitest_coverline("build/transition/transition.js", 249);
if (node.style[attr] === '') {
                    _yuitest_coverline("build/transition/transition.js", 250);
Y.DOM.setStyle(node, attr, Y.DOM.getComputedStyle(node, attr));
                }
            }
        }
    },

    /**
     * Starts or an animation.
     * @method run
     * @chainable
     * @private
     */
    run: function(callback) {
        _yuitest_coverfunc("build/transition/transition.js", "run", 262);
_yuitest_coverline("build/transition/transition.js", 263);
var anim = this,
            node = anim._node,
            config = anim._config,
            data = {
                type: 'transition:start',
                config: config
            };


        _yuitest_coverline("build/transition/transition.js", 272);
if (!anim._running) {
            _yuitest_coverline("build/transition/transition.js", 273);
anim._running = true;

            _yuitest_coverline("build/transition/transition.js", 275);
if (config.on && config.on.start) {
                _yuitest_coverline("build/transition/transition.js", 276);
config.on.start.call(Y.one(node), data);
            }

            _yuitest_coverline("build/transition/transition.js", 279);
anim.initAttrs(anim._config);

            _yuitest_coverline("build/transition/transition.js", 281);
anim._callback = callback;
            _yuitest_coverline("build/transition/transition.js", 282);
anim._start();
        }


        _yuitest_coverline("build/transition/transition.js", 286);
return anim;
    },

    _start: function() {
        _yuitest_coverfunc("build/transition/transition.js", "_start", 289);
_yuitest_coverline("build/transition/transition.js", 290);
this._runNative();
    },

    _prepDur: function(dur) {
        _yuitest_coverfunc("build/transition/transition.js", "_prepDur", 293);
_yuitest_coverline("build/transition/transition.js", 294);
dur = parseFloat(dur) * 1000;

        _yuitest_coverline("build/transition/transition.js", 296);
return dur + 'ms';
    },

    _runNative: function() {
        _yuitest_coverfunc("build/transition/transition.js", "_runNative", 299);
_yuitest_coverline("build/transition/transition.js", 300);
var anim = this,
            node = anim._node,
            uid = Y.stamp(node),
            style = node.style,
            computed = node.ownerDocument.defaultView.getComputedStyle(node),
            attrs = Transition._nodeAttrs[uid],
            cssText = '',
            cssTransition = computed[Transition._toCamel(TRANSITION_PROPERTY)],

            transitionText = TRANSITION_PROPERTY + ': ',
            duration = TRANSITION_DURATION + ': ',
            easing = TRANSITION_TIMING_FUNCTION + ': ',
            delay = TRANSITION_DELAY + ': ',
            hyphy,
            attr,
            name;

        // preserve existing transitions
        _yuitest_coverline("build/transition/transition.js", 318);
if (cssTransition !== 'all') {
            _yuitest_coverline("build/transition/transition.js", 319);
transitionText += cssTransition + ',';
            _yuitest_coverline("build/transition/transition.js", 320);
duration += computed[Transition._toCamel(TRANSITION_DURATION)] + ',';
            _yuitest_coverline("build/transition/transition.js", 321);
easing += computed[Transition._toCamel(TRANSITION_TIMING_FUNCTION)] + ',';
            _yuitest_coverline("build/transition/transition.js", 322);
delay += computed[Transition._toCamel(TRANSITION_DELAY)] + ',';

        }

        // run transitions mapped to this instance
        _yuitest_coverline("build/transition/transition.js", 327);
for (name in attrs) {
            _yuitest_coverline("build/transition/transition.js", 328);
hyphy = Transition._toHyphen(name);
            _yuitest_coverline("build/transition/transition.js", 329);
attr = attrs[name];
            _yuitest_coverline("build/transition/transition.js", 330);
if ((attr = attrs[name]) && attr.transition === anim) {
                _yuitest_coverline("build/transition/transition.js", 331);
if (name in node.style) { // only native styles allowed
                    _yuitest_coverline("build/transition/transition.js", 332);
duration += anim._prepDur(attr.duration) + ',';
                    _yuitest_coverline("build/transition/transition.js", 333);
delay += anim._prepDur(attr.delay) + ',';
                    _yuitest_coverline("build/transition/transition.js", 334);
easing += (attr.easing) + ',';

                    _yuitest_coverline("build/transition/transition.js", 336);
transitionText += hyphy + ',';
                    _yuitest_coverline("build/transition/transition.js", 337);
cssText += hyphy + ': ' + attr.value + '; ';
                } else {
                    _yuitest_coverline("build/transition/transition.js", 339);
this.removeProperty(name);
                }
            }
        }

        _yuitest_coverline("build/transition/transition.js", 344);
transitionText = transitionText.replace(/,$/, ';');
        _yuitest_coverline("build/transition/transition.js", 345);
duration = duration.replace(/,$/, ';');
        _yuitest_coverline("build/transition/transition.js", 346);
easing = easing.replace(/,$/, ';');
        _yuitest_coverline("build/transition/transition.js", 347);
delay = delay.replace(/,$/, ';');

        // only one native end event per node
        _yuitest_coverline("build/transition/transition.js", 350);
if (!Transition._hasEnd[uid]) {
            _yuitest_coverline("build/transition/transition.js", 351);
node.addEventListener(TRANSITION_END, anim._onNativeEnd, '');
            _yuitest_coverline("build/transition/transition.js", 352);
Transition._hasEnd[uid] = true;

        }

        _yuitest_coverline("build/transition/transition.js", 356);
style.cssText += transitionText + duration + easing + delay + cssText;

    },

    _end: function(elapsed) {
        _yuitest_coverfunc("build/transition/transition.js", "_end", 360);
_yuitest_coverline("build/transition/transition.js", 361);
var anim = this,
            node = anim._node,
            callback = anim._callback,
            config = anim._config,
            data = {
                type: 'transition:end',
                config: config,
                elapsedTime: elapsed
            },

            nodeInstance = Y.one(node);

        _yuitest_coverline("build/transition/transition.js", 373);
anim._running = false;
        _yuitest_coverline("build/transition/transition.js", 374);
anim._callback = null;

        _yuitest_coverline("build/transition/transition.js", 376);
if (node) {
            _yuitest_coverline("build/transition/transition.js", 377);
if (config.on && config.on.end) {
                _yuitest_coverline("build/transition/transition.js", 378);
setTimeout(function() { // IE: allow previous update to finish
                    _yuitest_coverfunc("build/transition/transition.js", "(anonymous 6)", 378);
_yuitest_coverline("build/transition/transition.js", 379);
config.on.end.call(nodeInstance, data);

                    // nested to ensure proper fire order
                    _yuitest_coverline("build/transition/transition.js", 382);
if (callback) {
                        _yuitest_coverline("build/transition/transition.js", 383);
callback.call(nodeInstance, data);
                    }

                }, 1);
            } else {_yuitest_coverline("build/transition/transition.js", 387);
if (callback) {
                _yuitest_coverline("build/transition/transition.js", 388);
setTimeout(function() { // IE: allow previous update to finish
                    _yuitest_coverfunc("build/transition/transition.js", "(anonymous 7)", 388);
_yuitest_coverline("build/transition/transition.js", 389);
callback.call(nodeInstance, data);
                }, 1);
            }}
        }

    },

    _endNative: function(name) {
        _yuitest_coverfunc("build/transition/transition.js", "_endNative", 396);
_yuitest_coverline("build/transition/transition.js", 397);
var node = this._node,
            value = node.ownerDocument.defaultView.getComputedStyle(node, '')[Transition._toCamel(TRANSITION_PROPERTY)];

        _yuitest_coverline("build/transition/transition.js", 400);
name = Transition._toHyphen(name);
        _yuitest_coverline("build/transition/transition.js", 401);
if (typeof value === 'string') {
            _yuitest_coverline("build/transition/transition.js", 402);
value = value.replace(new RegExp('(?:^|,\\s)' + name + ',?'), ',');
            _yuitest_coverline("build/transition/transition.js", 403);
value = value.replace(/^,|,$/, '');
            _yuitest_coverline("build/transition/transition.js", 404);
node.style[TRANSITION_CAMEL] = value;
        }
    },

    _onNativeEnd: function(e) {
        _yuitest_coverfunc("build/transition/transition.js", "_onNativeEnd", 408);
_yuitest_coverline("build/transition/transition.js", 409);
var node = this,
            uid = Y.stamp(node),
            event = e,//e._event,
            name = Transition._toCamel(event.propertyName),
            elapsed = event.elapsedTime,
            attrs = Transition._nodeAttrs[uid],
            attr = attrs[name],
            anim = (attr) ? attr.transition : null,
            data,
            config;

        _yuitest_coverline("build/transition/transition.js", 420);
if (anim) {
            _yuitest_coverline("build/transition/transition.js", 421);
anim.removeProperty(name);
            _yuitest_coverline("build/transition/transition.js", 422);
anim._endNative(name);
            _yuitest_coverline("build/transition/transition.js", 423);
config = anim._config[name];

            _yuitest_coverline("build/transition/transition.js", 425);
data = {
                type: 'propertyEnd',
                propertyName: name,
                elapsedTime: elapsed,
                config: config
            };

            _yuitest_coverline("build/transition/transition.js", 432);
if (config && config.on && config.on.end) {
                _yuitest_coverline("build/transition/transition.js", 433);
config.on.end.call(Y.one(node), data);
            }

            _yuitest_coverline("build/transition/transition.js", 436);
if (anim._count <= 0)  { // after propertyEnd fires
                _yuitest_coverline("build/transition/transition.js", 437);
anim._end(elapsed);
                _yuitest_coverline("build/transition/transition.js", 438);
node.style[TRANSITION_PROPERTY_CAMEL] = ''; // clean up style
            }
        }
    },

    destroy: function() {
        _yuitest_coverfunc("build/transition/transition.js", "destroy", 443);
_yuitest_coverline("build/transition/transition.js", 444);
var anim = this,
            node = anim._node;

        _yuitest_coverline("build/transition/transition.js", 447);
if (node) {
            _yuitest_coverline("build/transition/transition.js", 448);
node.removeEventListener(TRANSITION_END, anim._onNativeEnd, false);
            _yuitest_coverline("build/transition/transition.js", 449);
anim._node = null;
        }
    }
};

_yuitest_coverline("build/transition/transition.js", 454);
Y.Transition = Transition;
_yuitest_coverline("build/transition/transition.js", 455);
Y.TransitionNative = Transition; // TODO: remove

/**
 *   Animate one or more css properties to a given value. Requires the "transition" module.
 *   <pre>example usage:
 *       Y.one('#demo').transition({
 *           duration: 1, // in seconds, default is 0.5
 *           easing: 'ease-out', // default is 'ease'
 *           delay: '1', // delay start for 1 second, default is 0
 *
 *           height: '10px',
 *           width: '10px',
 *
 *           opacity: { // per property
 *               value: 0,
 *               duration: 2,
 *               delay: 2,
 *               easing: 'ease-in'
 *           }
 *       });
 *   </pre>
 *   @for Node
 *   @method transition
 *   @param {Object} config An object containing one or more style properties, a duration and an easing.
 *   @param {Function} callback A function to run after the transition has completed.
 *   @chainable
*/
_yuitest_coverline("build/transition/transition.js", 482);
Y.Node.prototype.transition = function(name, config, callback) {
    _yuitest_coverfunc("build/transition/transition.js", "transition", 482);
_yuitest_coverline("build/transition/transition.js", 483);
var
        transitionAttrs = Transition._nodeAttrs[Y.stamp(this._node)],
        anim = (transitionAttrs) ? transitionAttrs.transition || null : null,
        fxConfig,
        prop;

    _yuitest_coverline("build/transition/transition.js", 489);
if (typeof name === 'string') { // named effect, pull config from registry
        _yuitest_coverline("build/transition/transition.js", 490);
if (typeof config === 'function') {
            _yuitest_coverline("build/transition/transition.js", 491);
callback = config;
            _yuitest_coverline("build/transition/transition.js", 492);
config = null;
        }

        _yuitest_coverline("build/transition/transition.js", 495);
fxConfig = Transition.fx[name];

        _yuitest_coverline("build/transition/transition.js", 497);
if (config && typeof config !== 'boolean') {
            _yuitest_coverline("build/transition/transition.js", 498);
config = Y.clone(config);

            _yuitest_coverline("build/transition/transition.js", 500);
for (prop in fxConfig) {
                _yuitest_coverline("build/transition/transition.js", 501);
if (fxConfig.hasOwnProperty(prop)) {
                    _yuitest_coverline("build/transition/transition.js", 502);
if (! (prop in config)) {
                        _yuitest_coverline("build/transition/transition.js", 503);
config[prop] = fxConfig[prop];
                    }
                }
            }
        } else {
            _yuitest_coverline("build/transition/transition.js", 508);
config = fxConfig;
        }

    } else { // name is a config, config is a callback or undefined
        _yuitest_coverline("build/transition/transition.js", 512);
callback = config;
        _yuitest_coverline("build/transition/transition.js", 513);
config = name;
    }

    _yuitest_coverline("build/transition/transition.js", 516);
if (anim && !anim._running) {
        _yuitest_coverline("build/transition/transition.js", 517);
anim.init(this, config);
    } else {
        _yuitest_coverline("build/transition/transition.js", 519);
anim = new Transition(this._node, config);
    }

    _yuitest_coverline("build/transition/transition.js", 522);
anim.run(callback);
    _yuitest_coverline("build/transition/transition.js", 523);
return this;
};

_yuitest_coverline("build/transition/transition.js", 526);
Y.Node.prototype.show = function(name, config, callback) {
    _yuitest_coverfunc("build/transition/transition.js", "show", 526);
_yuitest_coverline("build/transition/transition.js", 527);
this._show(); // show prior to transition
    _yuitest_coverline("build/transition/transition.js", 528);
if (name && Y.Transition) {
        _yuitest_coverline("build/transition/transition.js", 529);
if (typeof name !== 'string' && !name.push) { // named effect or array of effects supercedes default
            _yuitest_coverline("build/transition/transition.js", 530);
if (typeof config === 'function') {
                _yuitest_coverline("build/transition/transition.js", 531);
callback = config;
                _yuitest_coverline("build/transition/transition.js", 532);
config = name;
            }
            _yuitest_coverline("build/transition/transition.js", 534);
name = Transition.SHOW_TRANSITION;
        }
        _yuitest_coverline("build/transition/transition.js", 536);
this.transition(name, config, callback);
    }
    _yuitest_coverline("build/transition/transition.js", 538);
return this;
};

_yuitest_coverline("build/transition/transition.js", 541);
Y.NodeList.prototype.show = function(name, config, callback) {
    _yuitest_coverfunc("build/transition/transition.js", "show", 541);
_yuitest_coverline("build/transition/transition.js", 542);
var nodes = this._nodes,
        i = 0,
        node;

    _yuitest_coverline("build/transition/transition.js", 546);
while ((node = nodes[i++])) {
        _yuitest_coverline("build/transition/transition.js", 547);
Y.one(node).show(name, config, callback);
    }

    _yuitest_coverline("build/transition/transition.js", 550);
return this;
};



_yuitest_coverline("build/transition/transition.js", 555);
var _wrapCallBack = function(anim, fn, callback) {
    _yuitest_coverfunc("build/transition/transition.js", "_wrapCallBack", 555);
_yuitest_coverline("build/transition/transition.js", 556);
return function() {
        _yuitest_coverfunc("build/transition/transition.js", "(anonymous 8)", 556);
_yuitest_coverline("build/transition/transition.js", 557);
if (fn) {
            _yuitest_coverline("build/transition/transition.js", 558);
fn.call(anim);
        }
        _yuitest_coverline("build/transition/transition.js", 560);
if (callback && typeof callback === 'function') {
            _yuitest_coverline("build/transition/transition.js", 561);
callback.apply(anim._node, arguments);
        }
    };
};

_yuitest_coverline("build/transition/transition.js", 566);
Y.Node.prototype.hide = function(name, config, callback) {
    _yuitest_coverfunc("build/transition/transition.js", "hide", 566);
_yuitest_coverline("build/transition/transition.js", 567);
if (name && Y.Transition) {
        _yuitest_coverline("build/transition/transition.js", 568);
if (typeof config === 'function') {
            _yuitest_coverline("build/transition/transition.js", 569);
callback = config;
            _yuitest_coverline("build/transition/transition.js", 570);
config = null;
        }

        _yuitest_coverline("build/transition/transition.js", 573);
callback = _wrapCallBack(this, this._hide, callback); // wrap with existing callback
        _yuitest_coverline("build/transition/transition.js", 574);
if (typeof name !== 'string' && !name.push) { // named effect or array of effects supercedes default
            _yuitest_coverline("build/transition/transition.js", 575);
if (typeof config === 'function') {
                _yuitest_coverline("build/transition/transition.js", 576);
callback = config;
                _yuitest_coverline("build/transition/transition.js", 577);
config = name;
            }
            _yuitest_coverline("build/transition/transition.js", 579);
name = Transition.HIDE_TRANSITION;
        }
        _yuitest_coverline("build/transition/transition.js", 581);
this.transition(name, config, callback);
    } else {
        _yuitest_coverline("build/transition/transition.js", 583);
this._hide();
    }
    _yuitest_coverline("build/transition/transition.js", 585);
return this;
};

_yuitest_coverline("build/transition/transition.js", 588);
Y.NodeList.prototype.hide = function(name, config, callback) {
    _yuitest_coverfunc("build/transition/transition.js", "hide", 588);
_yuitest_coverline("build/transition/transition.js", 589);
var nodes = this._nodes,
        i = 0,
        node;

    _yuitest_coverline("build/transition/transition.js", 593);
while ((node = nodes[i++])) {
        _yuitest_coverline("build/transition/transition.js", 594);
Y.one(node).hide(name, config, callback);
    }

    _yuitest_coverline("build/transition/transition.js", 597);
return this;
};

/**
 *   Animate one or more css properties to a given value. Requires the "transition" module.
 *   <pre>example usage:
 *       Y.all('.demo').transition({
 *           duration: 1, // in seconds, default is 0.5
 *           easing: 'ease-out', // default is 'ease'
 *           delay: '1', // delay start for 1 second, default is 0
 *
 *           height: '10px',
 *           width: '10px',
 *
 *           opacity: { // per property
 *               value: 0,
 *               duration: 2,
 *               delay: 2,
 *               easing: 'ease-in'
 *           }
 *       });
 *   </pre>
 *   @for NodeList
 *   @method transition
 *   @param {Object} config An object containing one or more style properties, a duration and an easing.
 *   @param {Function} callback A function to run after the transition has completed. The callback fires
 *       once per item in the NodeList.
 *   @chainable
*/
_yuitest_coverline("build/transition/transition.js", 626);
Y.NodeList.prototype.transition = function(config, callback) {
    _yuitest_coverfunc("build/transition/transition.js", "transition", 626);
_yuitest_coverline("build/transition/transition.js", 627);
var nodes = this._nodes,
        i = 0,
        node;

    _yuitest_coverline("build/transition/transition.js", 631);
while ((node = nodes[i++])) {
        _yuitest_coverline("build/transition/transition.js", 632);
Y.one(node).transition(config, callback);
    }

    _yuitest_coverline("build/transition/transition.js", 635);
return this;
};

_yuitest_coverline("build/transition/transition.js", 638);
Y.Node.prototype.toggleView = function(name, on, callback) {
    _yuitest_coverfunc("build/transition/transition.js", "toggleView", 638);
_yuitest_coverline("build/transition/transition.js", 639);
this._toggles = this._toggles || [];
    _yuitest_coverline("build/transition/transition.js", 640);
callback = arguments[arguments.length - 1];

    _yuitest_coverline("build/transition/transition.js", 642);
if (typeof name !== 'string') { // no transition, just toggle
        _yuitest_coverline("build/transition/transition.js", 643);
on = name;
        _yuitest_coverline("build/transition/transition.js", 644);
this._toggleView(on, callback); // call original _toggleView in Y.Node
        _yuitest_coverline("build/transition/transition.js", 645);
return;
    }

    _yuitest_coverline("build/transition/transition.js", 648);
if (typeof on === 'function') { // Ignore "on" if used for callback argument.
        _yuitest_coverline("build/transition/transition.js", 649);
on = undefined;
    }

    _yuitest_coverline("build/transition/transition.js", 652);
if (typeof on === 'undefined' && name in this._toggles) { // reverse current toggle
        _yuitest_coverline("build/transition/transition.js", 653);
on = ! this._toggles[name];
    }

    _yuitest_coverline("build/transition/transition.js", 656);
on = (on) ? 1 : 0;
    _yuitest_coverline("build/transition/transition.js", 657);
if (on) {
        _yuitest_coverline("build/transition/transition.js", 658);
this._show();
    }  else {
        _yuitest_coverline("build/transition/transition.js", 660);
callback = _wrapCallBack(this, this._hide, callback);
    }

    _yuitest_coverline("build/transition/transition.js", 663);
this._toggles[name] = on;
    _yuitest_coverline("build/transition/transition.js", 664);
this.transition(Y.Transition.toggles[name][on], callback);

    _yuitest_coverline("build/transition/transition.js", 666);
return this;
};

_yuitest_coverline("build/transition/transition.js", 669);
Y.NodeList.prototype.toggleView = function(name, on, callback) {
    _yuitest_coverfunc("build/transition/transition.js", "toggleView", 669);
_yuitest_coverline("build/transition/transition.js", 670);
var nodes = this._nodes,
        i = 0,
        node;

    _yuitest_coverline("build/transition/transition.js", 674);
while ((node = nodes[i++])) {
        _yuitest_coverline("build/transition/transition.js", 675);
node = Y.one(node);
        _yuitest_coverline("build/transition/transition.js", 676);
node.toggleView.apply(node, arguments);
    }

    _yuitest_coverline("build/transition/transition.js", 679);
return this;
};

_yuitest_coverline("build/transition/transition.js", 682);
Y.mix(Transition.fx, {
    fadeOut: {
        opacity: 0,
        duration: 0.5,
        easing: 'ease-out'
    },

    fadeIn: {
        opacity: 1,
        duration: 0.5,
        easing: 'ease-in'
    },

    sizeOut: {
        height: 0,
        width: 0,
        duration: 0.75,
        easing: 'ease-out'
    },

    sizeIn: {
        height: function(node) {
            _yuitest_coverfunc("build/transition/transition.js", "height", 703);
_yuitest_coverline("build/transition/transition.js", 704);
return node.get('scrollHeight') + 'px';
        },
        width: function(node) {
            _yuitest_coverfunc("build/transition/transition.js", "width", 706);
_yuitest_coverline("build/transition/transition.js", 707);
return node.get('scrollWidth') + 'px';
        },
        duration: 0.5,
        easing: 'ease-in',

        on: {
            start: function() {
                _yuitest_coverfunc("build/transition/transition.js", "start", 713);
_yuitest_coverline("build/transition/transition.js", 714);
var overflow = this.getStyle('overflow');
                _yuitest_coverline("build/transition/transition.js", 715);
if (overflow !== 'hidden') { // enable scrollHeight/Width
                    _yuitest_coverline("build/transition/transition.js", 716);
this.setStyle('overflow', 'hidden');
                    _yuitest_coverline("build/transition/transition.js", 717);
this._transitionOverflow = overflow;
                }
            },

            end: function() {
                _yuitest_coverfunc("build/transition/transition.js", "end", 721);
_yuitest_coverline("build/transition/transition.js", 722);
if (this._transitionOverflow) { // revert overridden value
                    _yuitest_coverline("build/transition/transition.js", 723);
this.setStyle('overflow', this._transitionOverflow);
                    _yuitest_coverline("build/transition/transition.js", 724);
delete this._transitionOverflow;
                }
            }
        }
    }
});

_yuitest_coverline("build/transition/transition.js", 731);
Y.mix(Transition.toggles, {
    size: ['sizeOut', 'sizeIn'],
    fade: ['fadeOut', 'fadeIn']
});


}, '@VERSION@', {"requires": ["node-style"]});
