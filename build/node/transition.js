YUI.add('transition', function(Y) {

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

        if (anim._totalDuration) { // only fire when duration > 0 (per spec)
            anim._node.fire(START, {
                type: START,
                config: anim._config 
            });
        }

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
        var t = new Date() - this._startTime,
            done = (t >= this._totalDuration);
            
        this._runAttrs(t);

        if (done) {
            this._end();
        }
    },

    _runAttrs: function(time) {
        var anim = this,
            attr = anim._runtimeAttr,
            customAttr = Transition.behaviors,
            node = anim._node,
            done = false,
            allDone = false,
            attribute,
            setter,
            actualDuration,
            elapsed,
            d,
            t,
            i;

        for (i in attr) {
            if (attr[i].to) {
                attribute = attr[i];
                d = attribute.duration;
                actualDuration = d;
                elapsed = time / 1000;
                t = time;
                setter = (i in customAttr && 'set' in customAttr[i]) ?
                        customAttr[i].set : Transition.DEFAULT_SETTER;

                done = (t >= d);

                if (d === 0) { // set instantly
                    d = t = 1; // avoid dividing by zero in easings
                } else if (t > d) {
                    t = d; 
                }

                if (!anim._skip[i]) {
                    setter(anim, i, attribute.from, attribute.to, t, d,
                        attribute.easing, attribute.unit); 

                    if (done) {
                        anim._skip[i] = true;
                        anim._count--;

                        if (actualDuration > 0) { // match native behavior which doesnt fire for zero duration
                            node.fire(PROPERTY_END, {
                                type: PROPERTY_END,
                                elapsedTime: elapsed,
                                propertyName: i,
                                config: anim._config
                            });

                            if (!allDone && anim._count <= 0) {
                                allDone = true;
                                node.fire(END, {
                                    type: END,
                                    elapsedTime: elapsed,
                                    config: anim._config
                                });
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
            duration,
            val,
            name,
            unit, begin, end;

        for (name in attrs) {
            if (attrs.hasOwnProperty(name)) {
                val = attrs[name];
                duration = this._duration * 1000;
                if (typeof val.value !== 'undefined') {
                    duration = (('duration' in val) ? val.duration : this._duration) * 1000;
                    easing = val.easing || easing;
                    val = val.value;
                }
                
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
                    return;
                }

                if (typeof easing === 'string') {
                    if (easing.indexOf('cubic-bezier') > -1) {
                        easing = easing.substring(13, easing.length - 1).split(',');
                    } else if (Transition.easings[easing]) {
                        easing = Transition.easings[easing];
                    }
                }

                attr[name] = {
                    from: begin,
                    to: end,
                    unit: unit,
                    duration: duration,
                    easing: easing
                };

                if (duration > this._totalDuration) {
                    this._totalDuration = duration;
                }
                this._count++;
            }
        }
        this._skip = {};
        this._runtimeAttr = attr;
    },

    _getOffset: function(attr) {
        var node = this._node,
            domNode = node._node,
            val = node.getComputedStyle(attr),
            position,
            offsetParent,
            parentOffset,
            offset;

        if (val === 'auto') {
            position = node.getStyle('position');
            if (position === 'static' || position === 'relative') {
                val = 0;    
            } else if (domNode.getBoundingClientRect) {
                offsetParent = domNode.offsetParent;
                parentOffset = offsetParent.getBoundingClientRect()[attr];
                offset = domNode.getBoundingClientRect()[attr];
                if (attr === 'left' || attr === 'top') {
                    val = offset - parentOffset;
                } else {
                    val = parentOffset - domNode.getBoundingClientRect()[attr];
                }
            }
        }

        return val;
    },

    destroy: function() {
        this.detachAll();
        this._node = null;
    }
}, true);

Y.mix(Y.Transition, {
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
                return anim._getOffset(attr);
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
