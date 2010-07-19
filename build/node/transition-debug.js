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

                if (d === 0) { // set instantly
                    d = 1; // avoid dividing by zero in easings
                    t = 1;
                } else if (t > d) {
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

    _initEasing: function(easing) {

    },

    _initAttrs: function() {
        var from = {},
            to =  {},
            easing = this._easing,
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
                    duration = ('duration' in val) ? val.duration * 1000 : this._duration * 1000;
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

    DEFAULT_EASING: 'ease-both',

    DEFAULT_DURATION: 0.5,

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
            //val = fn(elapsed, NUM(from), NUM(to) - NUM(from), duration);
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

    getBezier: function(points, t) {  
        var n = points.length;
        var tmp = [];

        for (var i = 0; i < n; ++i){
            tmp[i] = [points[i][0], points[i][1]]; // save input
        }
        
        for (var j = 1; j < n; ++j) {
            for (i = 0; i < n - j; ++i) {
                tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];
                tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1]; 
            }
        }

        return [ tmp[0][0], tmp[0][1] ]; 
    },

    cubicBezier: function(p, t) {
        var val = Y.Transition.getBezier([[0, 0], [p[0], p[2]], [p[1], p[3]], [1, 0]], t);
        return val;
    },

    easings: {
        ease: [0.25, 0, 1, 0.25],
        linear: [0, 0, 1, 1],
        'ease-in': [0.42, 0, 1, 1],
        'ease-out': [0, 0, 0.58, 1],
        'ease-in-out': [0.42, 0, 0.58, 1]
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


}, '@VERSION@' ,{requires:['transition-native', 'node-style']});
