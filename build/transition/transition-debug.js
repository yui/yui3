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

var START = 'transition:start',
    END = 'transition:end',
    PROPERTY_END = 'transition:propertyEnd',

    TRANSITION = '-webkit-transition',
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

Transition.prototype = {
    constructor: Transition,
    init: function(node, config) {
        if (!this._running) {
            this._node = node;
            this._config = config;
            node._transition = this; // cache for reuse

            this.initAttrs(config);

            this._duration = ('duration' in config) ?
                config.duration: this.constructor.DEFAULT_DURATION;

            this._delay = ('delay' in config) ?
                config.delay: this.constructor.DEFAULT_DELAY;

            this._easing = config.easing || this.constructor.DEFAULT_EASING;
            this._count = 0; // track number of animated properties
            this._totalDuration = 0;
            this._running = false;
        }
        return this;
    },

    initAttrs: function(config) {
        var attrs = {},
            attr;
        for (attr in config) {
            if (!Transition._reKeywords.test(attr)) {
                attrs[attr] = config[attr];
            }
        }

        if (attrs.transform && !attrs['-webkit-transform']) {
            attrs['-webkit-transform'] = attrs.transform;
            delete attrs.transform;
        }

        this._attrs = attrs;
    },

    /**
     * Starts or an animation.
     * @method run
     * @chainable
     */    
    run: function(callback) {
        var anim = this,
            attrs = anim._attrs,
            attr;

        if (!anim._running) {
            anim._running = true;

            anim._start();
        }

        anim._callback = callback;
        return anim;
    },

    _start: function() {
        this._runNative();
    },

    _prepDur: function(dur) {
        dur = parseFloat(dur);

        if (dur > this._totalDuration) {
            this._totalDuration = dur;
        }

        return dur + 's';
    },

    _runNative: function(time) {
        var transitions = {}, 
            anim = this,
            node = anim._node,
            domNode = node._node,
            style = domNode.style,
            computed = getComputedStyle(domNode),
            attrs = anim._attrs,
            cssText = '',
            cssTransition = computed[TRANSITION_PROPERTY],

            transitionText = TRANSITION_PROPERTY + ': ',
            duration = TRANSITION_DURATION + ': ',
            easing = TRANSITION_TIMING_FUNCTION + ': ',
            delay = TRANSITION_DELAY + ': ',
            transition,
            val,
            dur,
            del,
            attr;

        if (cssTransition !== 'all') {
            transitionText += cssTransition + ',';
            duration += computed[TRANSITION_DURATION] + ',';
            easing += computed[TRANSITION_TIMING_FUNCTION] + ',';
            delay += computed[TRANSITION_DELAY] + ',';

        }

        for (attr in attrs) {
            if (attrs.hasOwnProperty(attr)) {
                transitions[attr] = attrs[attr];
                transition = transitions[attr];
                val = transition;
                anim._count++;

                if (typeof transition.value !== 'undefined') {
                    val = transition.value; 
                }

                if (typeof val === 'function') {
                    val = val.call(node, node);
                }

                dur = (typeof transition.duration !== 'undefined') ? transition.duration :
                        anim._duration;

                del = (typeof transition.delay !== 'undefined') ? transition.delay :
                        anim._delay;

                if (!dur) { // make async and fire events
                    dur = .00001;
                }

                duration += anim._prepDur(dur) + ',';
                delay += anim._prepDur(del) + ',';
                easing += (transition.easing || anim._easing) + ',';

                transitionText += attr + ',';
                cssText += attr + ': ' + val + '; ';
            }
        }

        transitionText = transitionText.replace(/,$/, ';');
        duration = duration.replace(/,$/, ';');
        easing = easing.replace(/,$/, ';');
        delay = delay.replace(/,$/, ';');

        if (!anim._hasEndEvent) {
            node.on(TRANSITION_END, this._onNativeEnd, this);
            anim._hasEndEvent = true;

        }

        //setTimeout(function() { // allow any style init to occur (setStyle, etc)
            style.cssText += transitionText + duration + easing + delay + cssText;
        //}, 0);

    },

    _onNativeEnd: function(e) {
        var event = e._event,
            anim = this,
            node = anim._node;

        anim._count--;
        if (anim._count <= 0)  {
            node._node.style[TRANSITION_CAMEL] = '';

            anim._running = false;

            if (anim._callback) {
                anim._callback.call(node, {
                    elapsedTime: event.elapsedTime
                });

                anim._callback = null;
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

var START = 'transition:start',
    END = 'transition:end',
    PROPERTY_END = 'transition:propertyEnd',
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

    _end: function(finish) {
        var duration = this._duration * 1000;
        if (finish) { // jump to last frame
            this._runAttrs(duration, duration);
        }

        delete Transition._running[Y.stamp(this)];
        this._running = false;
        this._startTime = null;
    },

    _runFrame: function() {
        var t = new Date() - this._startTime;
        this._runAttrs(t);
    },

    _runAttrs: function(time) {
        var anim = this,
            node = anim._node,
            attr = Transition._runtimeAttrs[Y.stamp(node)],
            customAttr = Transition.behaviors,
            done = false,
            allDone = false,
            attribute,
            setter,
            elapsed,
            eventElapsed,
            delay,
            d,
            t,
            i;

        for (i in attr) {
            if (attr[i].to) {
                attribute = attr[i];
                d = attribute.duration;
                delay = attribute.delay;
                elapsed = time / 1000;
                t = time;
                setter = (i in customAttr && 'set' in customAttr[i]) ?
                        customAttr[i].set : Transition.DEFAULT_SETTER;

                done = (t >= d);

                if (t > d) {
                    t = d; 
                }

                if (!anim._skip[i] && (!delay || time >= delay)) {
                    setter(anim, i, attribute.from, attribute.to, t - delay, d - delay,
                        attribute.easing, attribute.unit); 

                    if (done) {
                        anim._skip[i] = true;
                        anim._count--;

                        if (!allDone && anim._count <= 0) {
                            allDone = true;
                            anim._end();
                            if (anim._callback) {
                                anim._callback.call(anim._node, {
                                    elapsedTime: (time - delay) / 1000
                                });
                                anim._callback = null;
                            }
                        }
                    }
                }

            }
        }
    },

    _initAttrs: function() {
        var from = {},
            to =  {},
            easing = this._easing,
            attr = {},
            customAttr = Transition.behaviors,
            attrs = this._attrs,
            yuid = Y.stamp(this._node),
            runtimeAttrs = Transition._runtimeAttrs[yuid],
            duration,
            delay,
            val,
            name,
            unit, begin, end;

        if (!runtimeAttrs) {
            runtimeAttrs = Transition._runtimeAttrs[yuid] = {};
        }

        for (name in attrs) {
            if (attrs.hasOwnProperty(name)) {
                val = attrs[name];
                duration = this._duration * 1000;
                delay = this._delay * 1000;
                if (typeof val.value !== 'undefined') {
                    duration = (('duration' in val) ? val.duration : this._duration) * 1000;
                    delay = (('delay' in val) ? val.delay : this._delay) * 1000;
                    easing = val.easing || easing;
                    val = val.value;
                }

                duration = duration || 1; // default to 1ms for 0 duration
                duration += delay;
                
                if (typeof val === 'function') {
                    val = val.call(this._node, this._node);
                }

                begin = (name in customAttr && 'get' in customAttr[name])  ?
                        customAttr[name].get(this, name) : Transition.DEFAULT_GETTER(this, name);

                var mFrom = Transition.RE_UNITS.exec(begin);
                var mTo = Transition.RE_UNITS.exec(val);

                begin = mFrom ? mFrom[1] : begin;
                end = mTo ? mTo[1] : val;
                unit = mTo ? mTo[2] : mFrom ?  mFrom[2] : ''; // one might be zero TODO: mixed units

                if (!unit && Transition.RE_DEFAULT_UNIT.test(name)) {
                    unit = Transition.DEFAULT_UNIT;
                }

                if (!begin || !end) {
                    Y.log('invalid "from" or "to" for "' + name + '"', 'error', 'transition');
                    return;
                }

                if (typeof easing === 'string') {
                    if (easing.indexOf('cubic-bezier') > -1) {
                        easing = easing.substring(13, easing.length - 1).split(',');
                    } else if (Transition.easings[easing]) {
                        easing = Transition.easings[easing];
                    }
                }

                runtimeAttrs[name] = {
                    from: begin,
                    to: end,
                    unit: unit,
                    duration: duration,
                    delay: delay,
                    easing: easing
                };

                if (duration > this._totalDuration) {
                    this._totalDuration = duration;
                }
                this._count++;
            }
        }
        this._skip = {};
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

