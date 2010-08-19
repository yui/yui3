YUI.add('transition-native', function(Y) {

/**
* The Native Transition Utility provides an API wrapper for CSS transitions.
* It is also the base module for the timer-based transition module.
* @module node
*/

/**
* Provides the base Transition class.
*
* @module node
* @submodule transition-native
*/

/**
 * A class for constructing transition instances.
 * @class Transition
 * @for Transition
 * @constructor
 * @extends Base
 */

var TRANSITION = '-webkit-transition',
    TRANSITION_CAMEL = 'WebkitTransition',
    TRANSITION_PROPERTY = '-webkit-transition-property',
    TRANSITION_DURATION = '-webkit-transition-duration',
    TRANSITION_TIMING_FUNCTION = '-webkit-transition-timing-function',
    TRANSITION_DELAY = '-webkit-transition-delay',
    TRANSITION_END = 'webkitTransitionEnd',

Transition = function() {
    this.init.apply(this, arguments);
};

Transition._reKeywords = /^(?:node|duration|iterations|easing|delay)$/;

Transition.useNative = false;

if (TRANSITION in Y.config.doc.documentElement.style) {
    Transition.useNative = true;
    Transition.supported = true; // TODO: remove
}

Y.Node.DOM_EVENTS[TRANSITION_END] = 1; 

Transition.NAME = 'transition';

Transition.DEFAULT_EASING = 'ease-in-out';
Transition.DEFAULT_DURATION = 0.5;
Transition.DEFAULT_DELAY = 0;

Transition._nodeAttrs = {};

Transition._count = 0;

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

    initAttrs: function(config) {
        var anim = this,
            node = anim._node,
            uid = Y.stamp(node),
            attrs = Transition._nodeAttrs[uid],
            duration,
            delay,
            easing,
            val,
            transition,
            attr;

        if (!attrs) {
            attrs = Transition._nodeAttrs[uid] = {};
        }

        if (config.transform && !config['-webkit-transform']) {
            config['-webkit-transform'] = config.transform;
            delete config.transform; // TODO: copy
        }

        for (attr in config) {
            if (config.hasOwnProperty(attr) && !Transition._reKeywords.test(attr)) {
                val = transition = config[attr];

                if (attrs[attr] && attrs[attr].transition) {
                    attrs[attr].transition._count--; // remapping attr to this transition
                } else {
                    Transition._count += 1;
                }

                if (typeof transition.value !== 'undefined') {
                    val = transition.value; 
                }

                if (typeof val === 'function') {
                    val = val.call(node, node);
                }

                duration = (typeof transition.duration !== 'undefined') ? transition.duration :
                        anim._duration;

                delay = (typeof transition.delay !== 'undefined') ? transition.delay :
                        anim._delay;

                if (!duration) { // make async and fire events
                    duration = 0.00001;
                }

                easing = transition.easing || anim._easing;
                anim._count++; // track number of bound properties

                attrs[attr] = {
                    value: val,
                    duration: duration,
                    delay: delay,
                    easing: easing,
                    transition: anim
                };
            }

        }
    },

    /**
     * Starts or an animation.
     * @method run
     * @chainable
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
            attr = attrs[name];
            if (attrs.hasOwnProperty(name) && attr.transition === anim) {
                duration += anim._prepDur(attr.duration) + ',';
                delay += anim._prepDur(attr.delay) + ',';
                easing += (attr.easing) + ',';

                transitionText += name + ',';
                cssText += name + ': ' + attr.value + '; ';
            }
        }

        transitionText = transitionText.replace(/,$/, ';');
        duration = duration.replace(/,$/, ';');
        easing = easing.replace(/,$/, ';');
        delay = delay.replace(/,$/, ';');

        // only one native end event per node
        if (!node._hasTransitionEnd) {
            node.on(TRANSITION_END, anim._onNativeEnd);
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

    _endNative: function() {
        var node = this._node;
        if (Transition._count <= 0) {
            node._node.style[TRANSITION_CAMEL] = '';
        }
    },

    _onNativeEnd: function(e) {
        var node = this,
            uid = Y.stamp(node),
            event = e._event,
            name = event.propertyName,
            elapsed = event.elapsedTime,
            attrs = Transition._nodeAttrs[uid],
            attr = attrs[name],
            anim = (attr) ? attr.transition :null,
            callback;

        if (anim) {
            callback = anim._callback;
            anim._count--;
            delete attrs[name];
            Transition._count--;
            node.fire('transition:propertyEnd', {
                type: 'propertyEnd',
                propertyName: name,
                elapsedTime: elapsed
            });

            if (anim._count <= 0)  {
                
                anim._endNative();
                anim._end(elapsed);
            }
        }
    },

    destroy: function() {
        this.detachAll();
        this._node = null;
    }
};

Y.Transition = Transition;
Y.TransitionNative = Transition; // TODO: remove

/** 
    Animate one or more css properties to a given value.
    <pre>example usage:
        Y.one('#demo').transition({
            duration: 1, // seconds
            easing: 'ease-out',
            height: '10px',
            width: '10px',
            opacity: { // per property duration and/or easing
                value: 0,
                duration: 2,
                easing: 'ease-in'
            }
        });
    </pre>
    @for node
    @method transition
    @param {Object} An object containing one or more style properties, a duration and an easing.
    @chainable
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



}, '@VERSION@' ,{requires:['node-base']});
YUI.add('transition-timer', function(Y) {

/**
* The Transition Utility provides an API for creating advanced transitions.
* @module node
*/

/**
* Provides the base Transition class, for animating numeric properties.
*
* @module node
* @submodule transition
*/

/**
 * A class for constructing animation instances.
 * @class Transition
 * @for Transition
 * @constructor
 */

var PROPERTY_END = 'transition:propertyEnd',
    Transition = Y.Transition;

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
            callback = anim._callback,
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
            uid = Y.stamp(this._node),
            attrs = Transition._nodeAttrs[uid],
            attribute,
            duration,
            delay,
            easing,
            val,
            name,
            unit, begin, end;

        for (name in attrs) {
            attribute = attrs[name];
            if (attrs.hasOwnProperty(name) && (attribute && attribute.transition === anim)) {
                duration = attribute.duration * 1000;
                delay = attribute.delay * 1000;
                easing = attribute.easing;
                val = attribute.value;

                begin = (name in customAttr && 'get' in customAttr[name])  ?
                        customAttr[name].get(anim, name) : Transition.DEFAULT_GETTER(anim, name);

                var mFrom = Transition.RE_UNITS.exec(begin);
                var mTo = Transition.RE_UNITS.exec(val);

                begin = mFrom ? mFrom[1] : begin;
                end = mTo ? mTo[1] : val;
                unit = mTo ? mTo[2] : mFrom ?  mFrom[2] : ''; // one might be zero TODO: mixed units

                if (!unit && Transition.RE_DEFAULT_UNIT.test(name)) {
                    unit = Transition.DEFAULT_UNIT;
                }

                if (!begin || !end) {
                    return;
                }

                if (typeof easing === 'string') {
                    if (easing.indexOf('cubic-bezier') > -1) {
                        easing = easing.substring(13, easing.length - 1).split(',');
                    } else if (Transition.easings[easing]) {
                        easing = Transition.easings[easing];
                    }
                }

                attribute.from = begin;
                attribute.to = end;
                attribute.unit = unit;
                attribute.easing = easing;
                attribute.duration = duration + delay;
                attribute.delay = delay;
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
    /**
     * Regex of properties that should use the default unit.
     *
     * @property RE_DEFAULT_UNIT
     * @static
     */
    RE_DEFAULT_UNIT: /^width|height|top|right|bottom|left|margin.*|padding.*|border.*$/i,

    /**
     * The default unit to use with properties that pass the RE_DEFAULT_UNIT test.
     *
     * @property DEFAULT_UNIT
     * @static
     */
    DEFAULT_UNIT: 'px',

    /**
     * Time in milliseconds passed to setInterval for frame processing 
     *
     * @property intervalTime
     * @default 20
     * @static
     */
    intervalTime: 20,

    /**
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

    /**
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

    /**
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

    /**
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

