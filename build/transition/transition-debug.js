YUI.add('transition-native', function(Y) {

/**
* Provides the transition method for Node.
* Transition has no API of its own, but adds the transition method to Node.
*
* @module transition
* @requires node
*/

var TRANSITION = '-webkit-transition',
    TRANSITION_PROPERTY_CAMEL = 'WebkitTransition',
    TRANSITION_PROPERTY = '-webkit-transition-property',
    TRANSITION_DURATION = '-webkit-transition-duration',
    TRANSITION_TIMING_FUNCTION = '-webkit-transition-timing-function',
    TRANSITION_DELAY = '-webkit-transition-delay',
    TRANSITION_END = 'webkitTransitionEnd',
    TRANSFORM_CAMEL = 'WebkitTransform',

    EMPTY_OBJ = {},

/**
 * A class for constructing transition instances.
 * Adds the "transition" method to Node.
 * @class Transition
 * @constructor
 */

Transition = function() {
    this.init.apply(this, arguments);
};

Transition._toCamel = function(property) {
    property = property.replace(/-([a-z])/gi, function(m0, m1) {
        return m1.toUpperCase();
    });

    return property;
};

Transition._toHyphen = function(property) {
    property = property.replace(/([A-Z]?)([a-z]+)([A-Z]?)/g, function(m0, m1, m2, m3) {
        var str = '';
        if (m1) {
            str += '-' + m1.toLowerCase();
        }
        str += m2;
        
        if (m3) {
            str += '-' + m3.toLowerCase();
        }

        return str;
    }); 

    return property;
};


Transition._reKeywords = /^(?:node|duration|iterations|easing|delay)$/;

Transition.useNative = false;

if (TRANSITION in Y.config.doc.documentElement.style) {
    Transition.useNative = true;
    Transition.supported = true; // TODO: remove
}

Y.Node.DOM_EVENTS[TRANSITION_END] = 1; 

Transition.NAME = 'transition';

Transition.DEFAULT_EASING = 'ease';
Transition.DEFAULT_DURATION = 0.5;
Transition.DEFAULT_DELAY = 0;

Transition._nodeAttrs = {};

Transition.prototype = {
    constructor: Transition,
    init: function(node, config) {
        var anim = this;
        if (!anim._running) {
            anim._node = node;
            anim._config = config;
            node._transition = anim; // cache for reuse

            anim._duration = ('duration' in config) ?
                config.duration: anim.constructor.DEFAULT_DURATION;

            anim._delay = ('delay' in config) ?
                config.delay: anim.constructor.DEFAULT_DELAY;

            anim._easing = config.easing || anim.constructor.DEFAULT_EASING;
            anim._count = 0; // track number of animated properties
            anim._running = false;

            anim.initAttrs(config);

        }

        return anim;
    },

    addProperty: function(prop, config) {
        var anim = this,
            node = this._node,
            uid = Y.stamp(node),
            attrs = Transition._nodeAttrs[uid],
            attr,
            val;

        if (!attrs) {
            attrs = Transition._nodeAttrs[uid] = {};
        }

        attr = attrs[prop];

        // might just be a value
        if (config && config.value !== undefined) {
            val = config.value;
        } else if (config !== undefined) {
            val = config; 
            config = EMPTY_OBJ;
        }

        if (typeof val === 'function') {
            val = val.call(node, node);
        }

        // take control if another transition owns this property
        if (attr && attr.transition && attr.transition !== anim) {
            attr.transition._count--; // remapping attr to this transition
        }

        anim._count++; // properties per transition

        attrs[prop] = {
            value: val,
            duration: ((typeof config.duration !== 'undefined') ? config.duration :
                    anim._duration) || 0.0001, // make 0 async and fire events

            delay: (typeof config.delay !== 'undefined') ? config.delay :
                    anim._delay,

            easing: config.easing || anim._easing,

            transition: anim
        };
    },

    removeProperty: function(prop) {
        var anim = this,
            attrs = Transition._nodeAttrs[Y.stamp(anim._node)];

        if (attrs && attrs[prop]) {
            delete attrs[prop];
            anim._count--;
        }

    },

    initAttrs: function(config) {
        var attr;

        if (config.transform && !config[TRANSFORM_CAMEL]) {
            config[TRANSFORM_CAMEL] = config.transform;
            delete config.transform; // TODO: copy
        }

        for (attr in config) {
            if (config.hasOwnProperty(attr) && !Transition._reKeywords.test(attr)) {
                this.addProperty(attr, config[attr]);
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
        var anim = this;

        if (!anim._running) {
            anim._running = true;

            anim._node.fire('transition:start', {
                type: 'transition:start',
                config: anim._config
            });

            anim._start();
            anim._callback = callback;
        }

        return anim;
    },

    _start: function() {
        this._runNative();
    },

    _prepDur: function(dur) {
        dur = parseFloat(dur);

        return dur + 's';
    },

    _runNative: function(time) {
        var anim = this,
            node = anim._node,
            uid = Y.stamp(node),
            domNode = node._node,
            style = domNode.style,
            computed = getComputedStyle(domNode),
            attrs = Transition._nodeAttrs[uid],
            cssText = '',
            cssTransition = computed[TRANSITION_PROPERTY],

            transitionText = TRANSITION_PROPERTY + ': ',
            duration = TRANSITION_DURATION + ': ',
            easing = TRANSITION_TIMING_FUNCTION + ': ',
            delay = TRANSITION_DELAY + ': ',
            hyphy,
            attr,
            name;

        // preserve existing transitions
        if (cssTransition !== 'all') {
            transitionText += cssTransition + ',';
            duration += computed[TRANSITION_DURATION] + ',';
            easing += computed[TRANSITION_TIMING_FUNCTION] + ',';
            delay += computed[TRANSITION_DELAY] + ',';

        }

        // run transitions mapped to this instance
        for (name in attrs) {
            hyphy = Transition._toHyphen(name);
            attr = attrs[name];
            if (attrs.hasOwnProperty(name) && attr.transition === anim) {
                if (name in domNode.style) { // only native styles allowed
                    duration += anim._prepDur(attr.duration) + ',';
                    delay += anim._prepDur(attr.delay) + ',';
                    easing += (attr.easing) + ',';

                    transitionText += hyphy + ',';
                    cssText += hyphy + ': ' + attr.value + '; ';
                } else {
                    this.removeProperty(name);
                }
            }
        }

        transitionText = transitionText.replace(/,$/, ';');
        duration = duration.replace(/,$/, ';');
        easing = easing.replace(/,$/, ';');
        delay = delay.replace(/,$/, ';');

        // only one native end event per node
        if (!node._hasTransitionEnd) {
            anim._detach = node.on(TRANSITION_END, anim._onNativeEnd);
            node._hasTransitionEnd = true;

        }

        style.cssText += transitionText + duration + easing + delay + cssText;

    },

    _end: function(elapsed) {
        var anim = this,
            node = anim._node,
            callback = anim._callback,
            data = {
                type: 'transition:end',
                config: anim._config,
                elapsedTime: elapsed 
            };

        anim._running = false;
        if (callback) {
            anim._callback = null;
            setTimeout(function() { // IE: allow previous update to finish
                callback.call(node, data);
            }, 1);
        }

        node.fire('transition:end', data);
    },

    _endNative: function(name) {
        var node = this._node,
            value = node.getComputedStyle(TRANSITION_PROPERTY);

        if (typeof value === 'string') {
            value = value.replace(new RegExp('(?:^|,\\s)' + name + ',?'), ',');
            value = value.replace(/^,|,$/, '');
            node.setStyle(TRANSITION_PROPERTY_CAMEL, value);
        }
    },

    _onNativeEnd: function(e) {
        var node = this,
            uid = Y.stamp(node),
            event = e._event,
            name = Transition._toCamel(event.propertyName),
            elapsed = event.elapsedTime,
            attrs = Transition._nodeAttrs[uid],
            attr = attrs[name],
            anim = (attr) ? attr.transition : null;

        if (anim) {
            anim.removeProperty(name);
            anim._endNative(name);

            node.fire('transition:propertyEnd', {
                type: 'propertyEnd',
                propertyName: name,
                elapsedTime: elapsed
            });

            if (anim._count <= 0)  { // after propertEnd fires
                anim._end(elapsed);
            }

        }
    },

    destroy: function() {
        var anim = this;
        if (anim._detach) {
            anim._detach.detach();
        }
        anim._node = null;
    }
};

Y.Transition = Transition;
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
Y.Node.prototype.transition = function(config, callback) {
    var anim = this._transition;
    
    if (anim && !anim._running) {
        anim.init(this, config);
    } else {
        anim = new Transition(this, config);
    }

    anim.run(callback);
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
Y.NodeList.prototype.transition = function(config, callback) {
    this.each(function(node) {
        node.transition(config, callback);
    });

    return this;
};


}, '@VERSION@' ,{requires:['node-base']});
YUI.add('transition-timer', function(Y) {

/*
* The Transition Utility provides an API for creating advanced transitions.
* @module transition
*/

/*
* Provides the base Transition class, for animating numeric properties.
*
* @module transition
* @submodule transition-timer
*/


var Transition = Y.Transition;

Y.mix(Transition.prototype, {
    _start: function() {
        if (Transition.useNative) {
            this._runNative();
        } else {
            this._runTimer();
        }
    },

    _runTimer: function() {
        var anim = this;
        anim._initAttrs();

        Transition._running[Y.stamp(anim)] = anim;
        anim._startTime = new Date();
        Transition._startTimer();
    },

    _endTimer: function() {
        var anim = this;
        delete Transition._running[Y.stamp(anim)];
        anim._startTime = null;
    },

    _runFrame: function() {
        var t = new Date() - this._startTime;
        this._runAttrs(t);
    },

    _runAttrs: function(time) {
        var anim = this,
            node = anim._node,
            uid = Y.stamp(node),
            attrs = Transition._nodeAttrs[uid],
            customAttr = Transition.behaviors,
            done = false,
            allDone = false,
            name,
            attribute,
            setter,
            elapsed,
            delay,
            d,
            t,
            i;

        for (name in attrs) {
            attribute = attrs[name];
            if ((attribute && attribute.transition === anim)) {
                d = attribute.duration;
                delay = attribute.delay;
                elapsed = (time - delay) / 1000;
                t = time;
                setter = (i in customAttr && 'set' in customAttr[i]) ?
                        customAttr[i].set : Transition.DEFAULT_SETTER;

                done = (t >= d);

                if (t > d) {
                    t = d;
                }

                if (!delay || time >= delay) {
                    setter(anim, name, attribute.from, attribute.to, t - delay, d - delay,
                        attribute.easing, attribute.unit); 

                    if (done) {
                        delete attrs[name];
                        anim._count--;

                        node.fire('transition:propertyEnd', {
                            type: 'propertyEnd',
                            propertyName: name,
                            config: anim._config,
                            elapsedTime: elapsed
                        });

                        if (!allDone && anim._count <= 0) {
                            allDone = true;
                            anim._end(elapsed);
                            anim._endTimer();
                        }
                    }
                }

            }
        }
    },

    _initAttrs: function() {
        var anim = this,
            customAttr = Transition.behaviors,
            uid = Y.stamp(anim._node),
            attrs = Transition._nodeAttrs[uid],
            attribute,
            duration,
            delay,
            easing,
            val,
            name,
            mTo,
            mFrom,
            unit, begin, end;

        for (name in attrs) {
            attribute = attrs[name];
            if (attrs.hasOwnProperty(name) && (attribute && attribute.transition === anim)) {
                duration = attribute.duration * 1000;
                delay = attribute.delay * 1000;
                easing = attribute.easing;
                val = attribute.value;

                // only allow supported properties
                if (name in anim._node._node.style || name in Y.DOM.CUSTOM_STYLES) {
                    begin = (name in customAttr && 'get' in customAttr[name])  ?
                            customAttr[name].get(anim, name) : Transition.DEFAULT_GETTER(anim, name);

                    mFrom = Transition.RE_UNITS.exec(begin);
                    mTo = Transition.RE_UNITS.exec(val);

                    begin = mFrom ? mFrom[1] : begin;
                    end = mTo ? mTo[1] : val;
                    unit = mTo ? mTo[2] : mFrom ?  mFrom[2] : ''; // one might be zero TODO: mixed units

                    if (!unit && Transition.RE_DEFAULT_UNIT.test(name)) {
                        unit = Transition.DEFAULT_UNIT;
                    }

                    if (typeof easing === 'string') {
                        if (easing.indexOf('cubic-bezier') > -1) {
                            easing = easing.substring(13, easing.length - 1).split(',');
                        } else if (Transition.easings[easing]) {
                            easing = Transition.easings[easing];
                        }
                    }

                    attribute.from = Number(begin);
                    attribute.to = Number(end);
                    attribute.unit = unit;
                    attribute.easing = easing;
                    attribute.duration = duration + delay;
                    attribute.delay = delay;
                } else {
                    delete attrs[name];
                    anim._count--;
                }
            }
        }
    },

    destroy: function() {
        this.detachAll();
        this._node = null;
    }
}, true);

Y.mix(Y.Transition, {
    _runtimeAttrs: {},
    /*
     * Regex of properties that should use the default unit.
     *
     * @property RE_DEFAULT_UNIT
     * @static
     */
    RE_DEFAULT_UNIT: /^width|height|top|right|bottom|left|margin.*|padding.*|border.*$/i,

    /*
     * The default unit to use with properties that pass the RE_DEFAULT_UNIT test.
     *
     * @property DEFAULT_UNIT
     * @static
     */
    DEFAULT_UNIT: 'px',

    /*
     * Time in milliseconds passed to setInterval for frame processing 
     *
     * @property intervalTime
     * @default 20
     * @static
     */
    intervalTime: 20,

    /*
     * Bucket for custom getters and setters
     *
     * @property behaviors
     * @static
     */
    behaviors: {
        left: {
            get: function(anim, attr) {
                return Y.DOM._getAttrOffset(anim._node._node, attr);
            }
        }
    },

    /*
     * The default setter to use when setting object properties.
     *
     * @property DEFAULT_SETTER
     * @static
     */
    DEFAULT_SETTER: function(anim, att, from, to, elapsed, duration, fn, unit) {
        from = Number(from);
        to = Number(to);

        var node = anim._node,
            val = Transition.cubicBezier(fn, elapsed / duration);

        val = from + val[0] * (to - from);

        if (att in node._node.style || att in Y.DOM.CUSTOM_STYLES) {
            unit = unit || '';
            node.setStyle(att, val + unit);
        } else if (node._node.attributes[att]) {
            node.setAttribute(att, val);
        } else {
            node.set(att, val);
        }
    },

    /*
     * The default getter to use when getting object properties.
     *
     * @property DEFAULT_GETTER
     * @static
     */
    DEFAULT_GETTER: function(anim, att) {
        var node = anim._node,
            val = '';

        if (att in node._node.style || att in Y.DOM.CUSTOM_STYLES) {
            val = node.getComputedStyle(att);
        } else if (node._node.attributes[att]) {
            val = node.getAttribute(att);
        } else {
            val = node.get(att);
        }

        return val;
    },

    _startTimer: function() {
        if (!Transition._timer) {
            Transition._timer = setInterval(Transition._runFrame, Transition.intervalTime);
        }
    },

    _stopTimer: function() {
        clearInterval(Transition._timer);
        Transition._timer = null;
    },

    /*
     * Called per Interval to handle each animation frame.
     * @method _runFrame
     * @private
     * @static
     */    
    _runFrame: function() {
        var done = true,
            anim;
        for (anim in Transition._running) {
            if (Transition._running[anim]._runFrame) {
                done = false;
                Transition._running[anim]._runFrame();
            }
        }

        if (done) {
            Transition._stopTimer();
        }
    },

    cubicBezier: function(p, t) {
        var x0 = 0,
            y0 = 0,
            x1 = p[0],
            y1 = p[1],
            x2 = p[2],
            y2 = p[3],
            x3 = 1,
            y3 = 0,

            A = x3 - 3 * x2 + 3 * x1 - x0,
            B = 3 * x2 - 6 * x1 + 3 * x0,
            C = 3 * x1 - 3 * x0,
            D = x0,
            E = y3 - 3 * y2 + 3 * y1 - y0,
            F = 3 * y2 - 6 * y1 + 3 * y0,
            G = 3 * y1 - 3 * y0,
            H = y0,

            x = (((A*t) + B)*t + C)*t + D,
            y = (((E*t) + F)*t + G)*t + H;

        return [x, y];
    },

    easings: {
        ease: [0.25, 0, 1, 0.25],
        linear: [0, 0, 1, 1],
        'ease-in': [0.42, 0, 1, 1],
        'ease-out': [0, 0, 0.58, 1],
        'ease-in-out': [0.42, 0, 0.58, 1]
    },

    _running: {},
    _timer: null,

    RE_UNITS: /^(-?\d*\.?\d*){1}(em|ex|px|in|cm|mm|pt|pc|%)*$/
}, true); 

Transition.behaviors.top = Transition.behaviors.bottom = Transition.behaviors.right = Transition.behaviors.left;

Y.Transition = Transition;


}, '@VERSION@' ,{requires:['transition-native', 'node-style']});


YUI.add('transition', function(Y){}, '@VERSION@' ,{use:['transition-native', 'transition-timer']});

