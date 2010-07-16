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
 * @extends Base
 */

var START = 'transitionstart',
    END = 'transitionend',

    TransitionNative = Y.TransitionNative,

    NUM = Number;

var _running = {},
    _timer,

Transition = function() {
    this.init.apply(this, arguments);
};

Y.extend(Transition, TransitionNative, {
    _start: function() {
        _running[Y.stamp(this)] = this;
        this._startTime = new Date();
        Transition._startTimer();
    },

    _end: function(finish) {
        var duration = this._duration * 1000;
        if (finish) { // jump to last frame
            this._runAttrs(duration, duration);
        }

        delete _running[Y.stamp(this)];
        this._running = false;
        this._startTime = null;
    },

    _runFrame: function() {
        var t = new Date() - this._startTime,
            done = (t >= this._totalDuration),
            attribute,
            setter;
            
        this._runAttrs(t);

        if (done) {
            this._end();
        }
    },

    _runAttrs: function(time) {
        var attr = this._runtimeAttr,
            customAttr = Transition.behaviors,
            easing = attr.easing,
            node = this._node,
            done = false,
            attribute,
            setter,
            d,
            t,
            i;

        for (i in attr) {
            if (attr[i].to) {
                attribute = attr[i];
                d = attribute.duration;
                t = time;
                setter = (i in customAttr && 'set' in customAttr[i]) ?
                        customAttr[i].set : Transition.DEFAULT_SETTER;

                done = (t >= d);

                if (t > d) {
                    t = d; 
                }

                if (!this._skip[i]) {
                    setter(this, i, attribute.from, attribute.to, t, d,
                        attribute.easing, attribute.unit); 

                    if (done) {
                        this._skip[i] = true;

                        node.fire(END, {
                            elapsedTime: d,
                            propertyName: i
                        });
                    }
                }

            }
        }
    },

    _initAttrs: function() {
        var from = {},
            to =  {},
            easing = (typeof this._easing === 'string') ?
                    Y.Easing[this._easing] : this._easing,
            attr = {},
            customAttr = Transition.behaviors,
            config = this._config,
            duration,
            unit, begin, end;

        this._totalDuration = 0;

        for (name in config) {
            val = config[name];
            if (!/^(?:node|duration|iterations|easing)$/.test(name)) {
                duration = this._duration * 1000;
                if (typeof val === 'function') {
                    val = val.call(this, node);
                } else if (typeof val === 'object') {
                    duration = val.duration * 1000 || this._duration * 1000;
                    easing = (typeof val.easing === 'string') ?
                            Y.Easing[val.easing] : val.easing || easing;
                    val = val.value;
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
            }
        }
        this._skip = {};
        this._runtimeAttr = attr;
    },


    // TODO: move to computedStyle? (browsers dont agree on default computed offsets)
    _getOffset: function(attr) {
        var node = this._node,
            val = node.getComputedStyle(attr),
            get = (attr === 'left') ? 'getX': 'getY',
            set = (attr === 'left') ? 'setX': 'setY';

        if (val === 'auto') {
            var position = node.getStyle('position');
            if (position === 'absolute' || position === 'fixed') {
                val = node[get]();
                node[set](val);
            } else {
                val = 0;
            }
        }

        return val;
    },

    destroy: function() {
        this.detachAll();
        this._node = null;
    }
},

{
    NAME: 'transition',
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

    DEFAULT_EASING: function (t, b, c, d) {
        // easeBoth
        if ((t/=d/2) < 1) {
            return c/2*t*t + b;
        }
        
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },

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
        var node = anim._node,
            val = fn(elapsed, NUM(from), NUM(to) - NUM(from), duration);

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
        if (!_timer) {
            _timer = setInterval(Transition._runFrame, Transition._intervalTime);
        }
    },

    _stopTimer: function() {
        clearInterval(_timer);
        _timer = 0;
    },

    /**
     * Called per Interval to handle each animation frame.
     * @method _runFrame
     * @private
     * @static
     */    
    _runFrame: function() {
        var done = true;
        for (var anim in _running) {
            if (_running[anim]._runFrame) {
                done = false;
                _running[anim]._runFrame();
            }
        }

        if (done) {
            Transition._stopTimer();
        }
    },

    RE_UNITS: /^(-?\d*\.?\d*){1}(em|ex|px|in|cm|mm|pt|pc|%)*$/
}, true); 

Transition.behaviors.top = Transition.behaviors.left;

Y.Transition = Transition;

Y.Node.prototype.transition = function(config) {
    var Constructor = (TransitionNative.supported &&
            TransitionNative.useNative) ? TransitionNative : Transition,
        anim = new Constructor(this, config);

    anim.run();
    return this;
};


}, '@VERSION@' ,{requires:['transition-native', 'node-style', 'anim-easing']});
