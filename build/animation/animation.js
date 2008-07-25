YUI.add('animation', function(Y) {

/**
 * Y.Animation Utility.
 * @module anim
 */

    /**
     * Handles animation _queueing and threading.
     * @class Anim
     */

    var RUNNING = 'running',
        START_TIME = 'startTime',
        ELAPSED_TIME = 'elapsedTime',
        START = 'start',
        TWEEN = 'tween',
        END = 'end',
        NODE = 'node',
        PAUSED = 'paused',
        REVERSED = 'reversed',
        ITERATION_COUNT = 'iterationCount',

        NUM = Number;

    var _running = {},
        _instances = {},
        _timer;

    var _setPrivate = function(anim, prop, val) {
        if (typeof prop == 'string') {
            anim._conf.add(prop, { value: val });
        } else {
            Y.each(prop, function(v, n) {
                _setPrivate(anim, n, v);
            });
        }
    };

    /**
     * Provides an API for animating objects.
     * Usage:
     * <pre>
     *  var anim = new Y.Anim({
     *      node: '#foo',
     *
     *      from: {
     *          opacity: 0
     *      },
     *
     *      to: {
     *          height: 200,
     *
     *          width: function(node) {
     *              return node.get('offsetHeight') / 2;
     *          },
     *
     *          opacity: 1
     *       },
     *
     *       easing: Y.Easing.easeOut
     *  });
     *   
     *  anim.run(); 
     * </pre>
     *
     * @class Y.Anim
     */
    Y.Anim = function() {
        Y.Anim.superclass.constructor.apply(this, arguments);
        _instances[Y.stamp(this)] = this;
    };

    /**
     * The lowercase name of the class.
     *
     * @property NAME
     * @static
     */
    Y.Anim.NAME = 'anim';

    /**
     * Regex of properties that should use the default unit.
     *
     * @property RE_DEFAULT_UNIT
     * @static
     */
    Y.Anim.RE_DEFAULT_UNIT = /^width|height|top|right|bottom|left|margin.*|padding.*|border.*$/i;

    /**
     * The default unit to use with properties that pass the RE_DEFAULT_UNIT test.
     *
     * @property DEFAULT_UNIT
     * @static
     */
    Y.Anim.DEFAULT_UNIT = 'px';

    // TODO: move to computedStyle? (browsers dont agree on default computed offsets)
    var _getOffset = function(node, attr) {
        var val = node.getComputedStyle(attr),
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
    };

    /**
     * Bucket for custom getters and setters
     *
     * @property behaviors
     * @static
     */
    Y.Anim.behaviors = {
        left: { get: _getOffset },
        top: { get: _getOffset }
    };

    /**
     * The default setter to use when setting object properties.
     *
     * @property DEFAULT_SETTER
     * @static
     */
    Y.Anim.DEFAULT_SETTER = function(node, att, from, to, elapsed, duration, fn, unit) {
        unit = unit || '';
        node.setStyle(att, fn(elapsed, NUM(from), NUM(to) - NUM(from), duration) + unit);
    };

    /**
     * The default getter to use when getting object properties.
     *
     * @property DEFAULT_GETTER
     * @static
     */
    Y.Anim.DEFAULT_GETTER = function(node, prop) {
        return node.getComputedStyle(prop);
    };

    Y.Anim.ATTRS = {
        /**
         * The object to be animated.
         * @attribute node
         * @type Node
         */
        node: {
            set: function(node) {
                node = Y.Node.get(node);
                if (!node) {
                    Y.fail('Y.Anim: invalid node: ' + node);
                }
                return node;
            }
        },

        /**
         * The length of the animation.  Defaults to "1" (second).
         * @attribute duration
         * @type NUM
         */
        duration: {
            value: 1
        },

        /**
         * The method that will provide values to the attribute(s) during the animation. 
         * Defaults to "Easing.easeNone".
         * @attribute easing
         * @type Function
         */
        easing: {
            value: function (t, b, c, d) {
                return c * t / d + b; // linear easing
            }
        },

        /**
         * The starting values for the animated properties. 
         * Fields may be strings, numbers, or functions.
         * If a function is used, the return value becomes the from value.
         * If no from value is specified, the DEFAULT_GETTER will be used. 
         * @attribute from
         * @type Object
         */
        from: {},

        /**
         * The ending values for the animated properties. 
         * Fields may be strings, numbers, or functions.
         * @attribute to
         * @type Object
         */
        to: {},

        keyframes: {},

        /**
         * Date stamp for the first frame of the animation.
         * @attribute startTime
         * @type Int
         * @default 0 
         */
        startTime: {
            value: 0,
            readOnly: true
        },

        /**
         * Current time the animation has been running.
         * @attribute elapsedTime
         * @type Int
         * @default 0 
         */
        elapsedTime: {
            value: 0,
            readOnly: true
        },

        /**
         * Whether or not the animation is currently running.
         * @attribute running 
         * @type Boolean
         * @default false 
         */
        running: {
            get: function() {
                return !!_running[Y.stamp(this)];
            },
            value: false,
            readOnly: true
        },

        /**
         * The number of times the animation should run 
         * @attribute iterations
         * @type Int
         * @default 1 
         */
        iterations: {
            value: 1
        },

        /**
         * The number of iterations that have occurred.
         * Resets when an animation ends (reaches iteration count or stop() called). 
         * @attribute iterationCount
         * @type Int
         * @default 0
         */
        iterationCount: {
            value: 0,
            readOnly: true
        },

        /**
         * How iterations of the animation should behave. 
         * Possible values are "normal" and "alternate".
         * Normal will repeat the animation, alternate will reverse on every other pass.
         *
         * @attribute direction
         * @type String
         * @default "normal"
         */
        direction: {
            value: 'normal' // | alternate (fwd on odd, rev on even per spec)
        },

        /**
         * Whether or not the animation is currently paused.
         * @attribute running 
         * @type Boolean
         * @default false 
         */
        paused: {
            readOnly: true,
            value: false
        },

        /**
         * Whether or not the animation is currently reversed.
         * Only applies when iterations is greater than 1 and direction is "alternate"
         * @attribute reversed 
         * @type Boolean
         * @default false 
         */
        reversed: {
            readOnly: true,
            value: false
        }


    };

    /**
     * Starts all animation instances.
     * Only one thread can run at a time.
     * @method start
     * @static
     */    
    Y.Anim.run = function() {
        for (var i in _instances) {
            if (_instances[i].run) {
                _instances[i].run();
            }
        }
    };

    /**
     * Pauses all animation instances.
     * @method pause
     * @static
     */    
    Y.Anim.pause = function() {
        for (var i in _running) { // stop timer if nothing running
            if (_running[i].pause) {
                _running[i].pause();
            }
        }
        Y.Anim._stopTimer();
    };

    /**
     * Stops all animation instances.
     * @method stop
     * @static
     */    
    Y.Anim.stop = function() {
        for (var i in _running) { // stop timer if nothing running
            if (_running[i].stop) {
                _running[i].stop();
            }
        }
        Y.Anim._stopTimer();
    };
    
    Y.Anim._startTimer = function() {
        if (!_timer) {
            _timer = setInterval(Y.Anim._runFrame, 1);
        }
    };

    Y.Anim._stopTimer = function() {
        clearInterval(_timer);
        _timer = 0;
    };

    /**
     * Called per Interval to handle each animation frame.
     * @method _runFrame
     * @private
     * @static
     */    
    Y.Anim._runFrame = function() {
        var done = true;
        for (var anim in _running) {
            if (_running[anim]._runFrame) {
                done = false;
                _running[anim]._runFrame(new Date() - _running[anim].get(START_TIME));
            }
        }

        if (done) {
            Y.Anim._stopTimer();
        }
    };

    Y.Anim.RE_UNITS = /^(-?\d*\.?\d*){1}(em|ex|px|in|cm|mm|pt|pc|%)*$/;

    var proto = {
        /**
         * Starts or resumes an animation.
         * @param {NUM|String} elapsed optional Millisecond or
         * percent start time marker.
         * @method run
         */    
        run: function() {
            if (!this.get(RUNNING)) {
                this._start();
            } else if (this.get(PAUSED)) {
                this._resume();
            }
        },

        /**
         * Pauses the animation and
         * freezes it in its current state and time.
         * Calling run() will continue where it left off.
         * @method pause
         */    
        pause: function() {
            if (this.get(RUNNING)) {
                this._pause();
            }
        },

        /**
         * Stops the animation and resets its state.
         * Calling run() will restart from the beginning.
         * @method stop
         */    
        stop: function(finish) {
            if (this.get(RUNNING) || this.get(PAUSED)) {
                this._end(finish);
            }
        },

        _added: false,

        _start: function() {
            _setPrivate(this, START_TIME, new Date() - this.get(ELAPSED_TIME));
            this._actualFrames = 0;
            if (!this.get(PAUSED)) {
                this._initAttr();
            }
            _running[Y.stamp(this)] = this;
            Y.Anim._startTimer();

            this.fire(START);
        },

        _pause: function() {
            _setPrivate(this, START_TIME, null);
            _setPrivate(this, PAUSED, true);
            delete _running[Y.stamp(this)];
            this.fire('pause');
        },

        _resume: function() {
            _setPrivate(this, PAUSED, false);
            _running[Y.stamp(this)] = this;
            this.fire('resume');
        },

        _end: function(finish) {
            _setPrivate(this, START_TIME, null);
            _setPrivate(this, ELAPSED_TIME, 0);
            _setPrivate(this, PAUSED, false);
            _setPrivate(this, REVERSED, false);

            delete _running[Y.stamp(this)];
            this.fire(END, {elapsed: this.get(ELAPSED_TIME)});
        },

        _runFrame: function(t) {
            var attr = this._runtimeAttr,
                customAttr = Y.Anim.behaviors,
                node = this.get(NODE),
                attribute,
                setter,
                d;
                
            for (var i in attr) {
                if (attr.hasOwnProperty(i)) {
                    attribute = attr[i][0];
                    d = attribute.duration;

                    setter = (i in customAttr && 'set' in customAttr[i]) ?
                            customAttr[i].set : Y.Anim.DEFAULT_SETTER;

                    if (t < d) {
                        setter(node, i, attribute.from, attribute.to, t, d, attribute.easing, attribute.unit); 
                    } else { // set to final value
                       // TODO: handle keyframes 
                        setter(node, i, attribute.from, attribute.to, d, d, attribute.easing, attribute.unit); 
                    }
                }
            }

            this._actualFrames += 1;
            _setPrivate(this, ELAPSED_TIME, t);

            this.fire(TWEEN);
            if (t >= d) {
                this._lastFrame();
            }
        },

        _lastFrame: function() {
            var iter = this.get('iterations'),
                iterCount = this.get(ITERATION_COUNT);

            iterCount += 1;
            if (iter == 'infinite' || iterCount < iter) {
                if (this.get('direction') == 'alternate') {
                    this._flip();
                }
                this.fire('iteration', { frames: this._actualFrames });
            } else {
                iterCount = 0;
                this._end();
            }

            _setPrivate(this, START_TIME, new Date());
            _setPrivate(this, ITERATION_COUNT, iterCount);
        },

        _flip: function() {
            var to = this.get('to') || {},
                keyframes = this.get('keyframes') || {},
                attr = Y.merge(this._attr, {}),
                customAttr = Y.Anim.behaviors;

            if (to) {
                keyframes[100] = to;
            }

            Y.each(attr, function(val, name) {
                Y.each(val, function(v, n) {
                    if (name in customAttr && customAttr[name].reverse) {
                        val[n] = customAttr[name].reverse(val[n]);
                    } else {
                        var b = val[n].to;
                        var e = val[n].from;
                        attr[name][n].from = b;
                        attr[name][n].to = e;
                    }
                });

            }); // to is required TODO: by?

            this._runtimeAttr = Y.merge(attr, {});
            _setPrivate(this, REVERSED, !this.get(REVERSED)); // flip reverse flag
        },

        _initAttr: function() {
            var from = this.get('from') || {},
                to = this.get('to') || {},
                duration = this.get('duration'),
                node = this.get(NODE),
                easing = this.get('easing') || {},
                keyframes = this.get('keyframes') || {},
                attr = {},
                customAttr = Y.Anim.behaviors,
                unit, begin, end;

            if (to) {
                keyframes[100] = to;
            }

            var prev = {};
            Y.each(keyframes, function(v, frame) {
                Y.each(v, function(val, name) {
                    if (Y.Lang.isFunction(val)) {
                        val = val.call(this, node);
                    }

                    var dur = duration * (parseInt(frame, 10) / 100) * 1000;
                    var begin = prev[name] ? prev[name].to : from[name];

                    if (begin === undefined) {
                        begin = (name in customAttr && 'get' in customAttr[name])  ?
                                customAttr[name].get(node, name) : Y.Anim.DEFAULT_GETTER(node, name);
                    } else if (Y.Lang.isFunction(begin)) {
                        begin = begin.call(this, node);
                    }

                    var mFrom = Y.Anim.RE_UNITS.exec(begin);
                    var mTo = Y.Anim.RE_UNITS.exec(val);

                    begin = mFrom ? mFrom[1] : begin;
                    var end = mTo ? mTo[1] : val,
                        unit = mTo ? mTo[2] : mFrom ?  mFrom[2] : ''; // one might be zero TODO: mixed units

                    if (!unit && Y.Anim.RE_DEFAULT_UNIT.test(name)) {
                        unit = Y.Anim.DEFAULT_UNIT;
                    }

                    attr[name] = attr[name] || [];
                    attr[name].push({
                        easing: v.easing || easing,
                        to: end,
                        duration: dur,
                        unit: unit,
                        from: begin
                    });

                    prev[name] = attr[name];

                });
            });

            this._attr = attr;
            this._runtimeAttr = Y.merge(attr, {});
        }
    };

    Y.extend(Y.Anim, Y.Base, proto);
/*
TERMS OF USE - EASING EQUATIONS
Open source under the BSD License.
Copyright 2001 Robert Penner All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * Neither the name of the author nor the names of contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * Singleton that determines how an animation proceeds from start to end.
 * @module anim-easing
*/
/**
 * Singleton that determines how an animation proceeds from start to end.
 * @class Easing
*/

Y.Easing = {

    /**
     * Uniform speed between points.
     * @method easeNone
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeNone: function (t, b, c, d) {
        return c*t/d + b;
    },
    
    /**
     * Begins slowly and accelerates towards end. (quadratic)
     * @method easeIn
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeIn: function (t, b, c, d) {
        return c*(t/=d)*t + b;
    },

    /**
     * Begins quickly and decelerates towards end.  (quadratic)
     * @method easeOut
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeOut: function (t, b, c, d) {
        return -c *(t/=d)*(t-2) + b;
    },
    
    /**
     * Begins slowly and decelerates towards end. (quadratic)
     * @method easeBoth
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeBoth: function (t, b, c, d) {
        if ((t/=d/2) < 1) {
            return c/2*t*t + b;
        }
        
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    
    /**
     * Begins slowly and accelerates towards end. (quartic)
     * @method easeInStrong
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeInStrong: function (t, b, c, d) {
        return c*(t/=d)*t*t*t + b;
    },
    
    /**
     * Begins quickly and decelerates towards end.  (quartic)
     * @method easeOutStrong
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeOutStrong: function (t, b, c, d) {
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    
    /**
     * Begins slowly and decelerates towards end. (quartic)
     * @method easeBothStrong
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeBothStrong: function (t, b, c, d) {
        if ((t/=d/2) < 1) {
            return c/2*t*t*t*t + b;
        }
        
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },

    /**
     * Snap in elastic effect.
     * @method elasticIn
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} a Amplitude (optional)
     * @param {Number} p Period (optional)
     * @return {Number} The computed value for the current animation frame
     */

    elasticIn: function (t, b, c, d, a, p) {
        var s;
        if (t === 0) {
            return b;
        }
        if ( (t /= d) === 1 ) {
            return b+c;
        }
        if (!p) {
            p = d* 0.3;
        }
        
        if (!a || a < Math.abs(c)) {
            a = c; 
            s = p/4;
        }
        else {
            s = p/(2*Math.PI) * Math.asin (c/a);
        }
        
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },

    /**
     * Snap out elastic effect.
     * @method elasticOut
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} a Amplitude (optional)
     * @param {Number} p Period (optional)
     * @return {Number} The computed value for the current animation frame
     */
    elasticOut: function (t, b, c, d, a, p) {
        var s;
        if (t === 0) {
            return b;
        }
        if ( (t /= d) === 1 ) {
            return b+c;
        }
        if (!p) {
            p=d * 0.3;
        }
        
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = p/(2*Math.PI) * Math.asin (c/a);
        }
        
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    },
    
    /**
     * Snap both elastic effect.
     * @method elasticBoth
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} a Amplitude (optional)
     * @param {Number} p Period (optional)
     * @return {Number} The computed value for the current animation frame
     */
    elasticBoth: function (t, b, c, d, a, p) {
        var s;
        if (t === 0) {
            return b;
        }
        
        if ( (t /= d/2) === 2 ) {
            return b+c;
        }
        
        if (!p) {
            p = d*(0.3*1.5);
        }
        
        if ( !a || a < Math.abs(c) ) {
            a = c; 
            s = p/4;
        }
        else {
            s = p/(2*Math.PI) * Math.asin (c/a);
        }
        
        if (t < 1) {
            return -.5*(a*Math.pow(2,10*(t-=1)) * 
                    Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        }
        return a*Math.pow(2,-10*(t-=1)) * 
                Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    },


    /**
     * Backtracks slightly, then reverses direction and moves to end.
     * @method backIn
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} s Overshoot (optional)
     * @return {Number} The computed value for the current animation frame
     */
    backIn: function (t, b, c, d, s) {
        if (typeof s === 'undefined') {
            s = 1.70158;
        }
        return c*(t/=d)*t*((s+1)*t - s) + b;
    },

    /**
     * Overshoots end, then reverses and comes back to end.
     * @method backOut
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} s Overshoot (optional)
     * @return {Number} The computed value for the current animation frame
     */
    backOut: function (t, b, c, d, s) {
        if (typeof s === 'undefined') {
            s = 1.70158;
        }
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },
    
    /**
     * Backtracks slightly, then reverses direction, overshoots end, 
     * then reverses and comes back to end.
     * @method backBoth
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} s Overshoot (optional)
     * @return {Number} The computed value for the current animation frame
     */
    backBoth: function (t, b, c, d, s) {
        if (typeof s === 'undefined') {
            s = 1.70158; 
        }
        
        if ((t /= d/2 ) < 1) {
            return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        }
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },

    /**
     * Bounce off of start.
     * @method bounceIn
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    bounceIn: function (t, b, c, d) {
        return c - Y.Easing.bounceOut(d-t, 0, c, d) + b;
    },
    
    /**
     * Bounces off end.
     * @method bounceOut
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    bounceOut: function (t, b, c, d) {
        if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
        } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
        }
        return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
    },
    
    /**
     * Bounces off start and end.
     * @method bounceBoth
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    bounceBoth: function (t, b, c, d) {
        if (t < d/2) {
            return Y.Easing.bounceIn(t * 2, 0, c, d) * 0.5 + b;
        }
        return Y.Easing.bounceOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    }
};
/**
 * Adds xy position behaviors to Y.Anim.
 * @module anim-xy
 */

Y.Anim.behaviors.xy = {
    set: function(node, att, from, to, elapsed, duration, fn) {
        node.setXY([
            fn(elapsed, NUM(from[0]), NUM(to[0]) - NUM(from[0]), duration),
            fn(elapsed, NUM(from[1]), NUM(to[1]) - NUM(from[1]), duration)
        ]);
    },
    get: function(node) {
        return node.getXY();
    }
};

/**
 * Adds color behaviors to Y.Anim.
 * @module anim-color
 */


Y.Anim.behaviors.color = {
    set: function(node, att, from, to, elapsed, duration, fn) {
        from = Y.Color.re_RGB.exec(Y.Color.toRGB(from));
        to = Y.Color.re_RGB.exec(Y.Color.toRGB(to));

        node.setStyle(att, 'rgb(' + [
            Math.floor(fn(elapsed, NUM(from[1]), NUM(to[1]) - NUM(from[1]), duration)),
            Math.floor(fn(elapsed, NUM(from[2]), NUM(to[2]) - NUM(from[2]), duration)),
            Math.floor(fn(elapsed, NUM(from[3]), NUM(to[3]) - NUM(from[3]), duration))
        ].join(', ') + ')');
    },
    
    // TODO: default bgcolor const
    get: function(node, att) {
        var val = node.getComputedStyle(att);
        val = (val === 'transparent') ? 'rgb(255, 255, 255)' : val;
        return val;
    }
};

Y.each(['backgroundColor',
        'borderTopColor',
        'borderRightColor', 
        'borderBottomColor', 
        'borderLeftColor'],
        function(v, i) {
            Y.Anim.behaviors[v] = Y.Anim.behaviors.color;
        }
);
/**
 * Adds scroll behaviors to Y.Anim.
 * @module anim-scroll
 */
Y.Anim.behaviors.scroll = {
    set: function(node, att, from, to, elapsed, duration, fn) {
        var val = ([
            fn(elapsed, NUM(from[0]), NUM(to[0]) - NUM(from[0]), duration),
            fn(elapsed, NUM(from[1]), NUM(to[1]) - NUM(from[1]), duration)
        ]);

        node.set('scrollLeft', val[0]);
        node.set('scrollTop', val[1]);
    },
    get: function(node) {
        return [node.get('scrollLeft'), node.get('scrollTop')];
    }
};

/**
 * Adds bezier curve behaviors to Y.Anim.
 * @module anim-curve
 */

/**
 * Usage:
 * <pre>
 *  var anim = new Y.Anim({
 *      node: '#foo',
 *
 *      to: {
 *          curve: [ [0, 100], [500, 200], [800, 300] ]
 *       }
 *  });
 *   
 *  anim.run(); 
 * </pre>
 *
 */

Y.Anim.behaviors.curve = {
    set: function(node, att, from, to, elapsed, duration, fn) {
        var t = fn(elapsed, 0, 100, duration) / 100;
        node.setXY(Y.Anim.getBezier(to, t));
    },

    get: function(node, att) {
        return node.getXY();
    },

    reverse: function(val) {
        var to = [],
            from  = val.from;
       for (var i = 0, len = val.to.length; i < len; ++i) {
            to.unshift(val.to[i]); 
        } 

        val.from = val.to.pop();
        val.to = to;
        return val;
    }
};

/**
 * Get the current position of the animated element based on t.
 * Each point is an array of "x" and "y" values (0 = x, 1 = y)
 * At least 2 points are required (start and end).
 * First point is start. Last point is end.
 * Additional control points are optional.     
 * @method getBezier
 * @static
 * @param {Array} points An array containing Bezier points
 * @param {Number} t A number between 0 and 1 which is the basis for determining current position
 * @return {Array} An array containing int x and y member data
 */
Y.Anim.getBezier = function(points, t) {  
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

};
Y.namespace('Plugin');
Y.Plugin.NodeFX = function(config) {
    config.node = config.owner;
    Y.Plugin.NodeFX.superclass.constructor.apply(this, arguments);
};

Y.Plugin.NodeFX.NAME = "nodefxplugin";
Y.Plugin.NodeFX.NS = "fx";

Y.extend(Y.Plugin.NodeFX, Y.Anim);



}, '@VERSION@' ,{requires:['base', 'node']});
