YUI.add('anim', function(Y) {
    /**
     * Handles animation _queueing and threading.
     * @class Anim
     */

    var IS_ANIMATED = 'isAnimated',
        START_TIME = 'startTime',
        ELAPSED_TIME = 'elapsedTime',
        START = 'start',
        TWEEN = 'tween',
        END = 'end',
        NODE = 'node',
        ITERATION_COUNT = 'iterationCount';

    var _queue = [],
        _fx = {},
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
     *  var anim = new Anim({
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
     * @class Anim
     */
    var Anim = function() {
        Anim.superclass.constructor.apply(this, arguments);
    };

    Anim.NAME = 'anim';

    /**
     * Regex of properties that should use the default unit.
     *
     * @property RE_DEFAULT_UNIT
     * @static
     */
    Anim.RE_DEFAULT_UNIT = /^width|height|top|right|bottom|left|margin.*|padding.*|border.*$/i;

    /**
     * The default unit to use with properties that pass the RE_DEFAULT_UNIT test.
     *
     * @property DEFAULT_UNIT
     * @static
     */
    Anim.DEFAULT_UNIT = 'px';

    /**
     * The default setter to use when setting object properties.
     *
     * @property DEFAULT_SETTER
     * @static
     */
    Anim.DEFAULT_SETTER = function(prop, val, u) {
        this.get(NODE).setStyle(prop, val + u);
    };

    /**
     * The default getter to use when getting object properties.
     *
     * @property DEFAULT_GETTER
     * @static
     */
    Anim.DEFAULT_GETTER = function(prop) {
        return this.get(NODE).getStyle(prop);
    };

    Anim.ATTRS = {
        /**
         * The object to be animated.
         * @attribute node
         * @type Node
         */
        node: {
            set: function(node) {
                return Y.Node.get(node);
            }
        },

        /**
         * The length of the animation.  Defaults to "1" (second).
         * @attribute duration
         * @type Number
         */
        duration: {
            value: 1
        },

        /**
         * The method that will provide values to the attribute(s) during the animation. 
         * Defaults to "YAHOO.util.Easing.easeNone".
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
        from: {

        },

        /**
         * The ending values for the animated properties. 
         * Fields may be strings, numbers, or functions.
         * @attribute to
         * @type Object
         */
        to: {

        },

        /**
         * Date stamp for the first frame of the animation.
         * @attribute startTime
         * @type Int
         * @default 0 
         */
        startTime: {
            value: 0,
            readonly: true
        },

        /**
         * Current time the animation has been running.
         * @attribute elapsedTime
         * @type Int
         * @default 0 
         */
        elapsedTime: {
            value: 0,
            readonly: true
        },

        /**
         * Whether or not the animation is currently animated.
         * @attribute isAnimated
         * @type Boolean
         * @default false 
         */
        isAnimated: {
            value: false,
            readonly: true
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
            readonly: true
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
        }

/*
        fx: {
            set: function(fx) {
                if (Y.lang.isString(fx)) {
                    var __fx = [];
                    __fx[0] = fx; 
                    return __fx;
                }
                return fx;
            }
        }
*/
    };

    /**
     * Starts the animation thread.
     * Only one thread can run at a time.
     * @method start
     * @static
     */    
    Anim.start = function() {
        if (!_timer) {
            _timer = setInterval(this.run, 1);
        }
    };

    /**
     * Stops the _timer.
     * @method stop
     * @static
     */    
    Anim.pause = function() {
        for (var i = 0, len = _queue.length; i < len; ++i) {
            if (_queue[i].get(IS_ANIMATED)) {
                _queue[i].pause();
            }
        }
    };

    /**
     * Stops the _timer.
     * @method stop
     * @static
     */    
    Anim.stop = function() {
        clearInterval(_timer);

        for (var i = 0, len = _queue.length; i < len; ++i) {
            if (_queue[i].get(IS_ANIMATED)) {
                _queue[i].stop();
            }
        }
    };
    
    /**
     * Called per Interval to handle each animation frame.
     * @method run
     * @static
     */    
    Anim.run = function() {
        var anim;

        for (var i = 0, len = _queue.length; i < len; ++i) {
            anim = _queue[i];
            if ( anim && anim.get(IS_ANIMATED)) {
                anim._runFrame();
                anim.fire(TWEEN);
            }
        }
    };

/*
    Anim.addFX = function(name, config) {
        if (typeof name == 'string') {
            _fx[name] = config;
        } else { // assume multiple effects
            Y.each(name, function(v, n) {
                Anim.addFX(n, v);
            });
        }
    };
*/

    Anim.RE_UNITS = /^(-?\d*\.?\d*){1}(em|ex|px|in|cm|mm|pt|pc|%)*$/;

    var proto = {
/*
        addFX: function(fx) {
            if (typeof fx == 'string') {
                this._addFX(fx);
            } else if (Y.lang.isObject(fx)) {
                Y.each(fx, this._addFX, this);
            }
        },

        _addFX: function(fx) {
            this._fx = this._fx || {};
            this._fx[fx] = fx;
        },
*/
        /**
         * Starts or resumes an animation.
         * @param {Number|String} elapsed optional Millisecond or
         * percent start time marker.
         * @method run
         */    
        run: function() {
            if (!this.get(IS_ANIMATED)) {
                this._start();
            }
        },

        /**
         * Pauses the animation and
         * freezes it in its current state and time.
         * Calling run() will continue where it left off.
         * @method pause
         */    
        pause: function() {
            if (this.get(IS_ANIMATED)) {
                this._pause();
            }
        },

        /**
         * Stops the animation and resets its state.
         * Calling run() will restart from the beginning.
         * @method stop
         */    
        stop: function() {
            if (this.get(IS_ANIMATED) || this.get(ELAPSED_TIME)) { // end if paused
                this._end();
            }
        },

        _added: false,

        _start: function() {
            _setPrivate(this, IS_ANIMATED, true);
            _setPrivate(this, START_TIME, new Date() - this.get(ELAPSED_TIME));
            Anim.start(); // start animator

            if (!this.get(ELAPSED_TIME)) {
                this._runtimeAttr();
                this.fire(START);
            } else {
                this.fire('resume');
            }

            if (!this._added) {
                _queue[_queue.length] = this;
                this._added = true;
            }
        },

        _pause: function(silent) {
            _setPrivate(this, START_TIME, null);
            _setPrivate(this, IS_ANIMATED, false);
            this.fire('pause');
        },

        _end: function() {
            var elapsed = this.get(ELAPSED_TIME);
            _setPrivate(this, IS_ANIMATED, false);
            _setPrivate(this, START_TIME, null);
            _setPrivate(this, ELAPSED_TIME, 0);

            this.fire(END, elapsed);
        },

        _runFrame: function() {
            var t = new Date() - this.get(START_TIME),
                d = this.get('duration') * 1000,
                attr = this._attr,
                setter = Anim.DEFAULT_SETTER;
                
            for (var i in attr) {
                if (t < d) {
                    if (attr.hasOwnProperty(i)) {
                        setter.call(this, i, attr[i].f(t, attr[i].b, attr[i].e - attr[i].b, d), attr[i].u); 
                    }
                } else { // set to final value
                    setter.call(this, i, attr[i].e, attr[i].u); 
                }
            }

            var elapsed = Number(this.get(ELAPSED_TIME) + t);
            _setPrivate(this, elapsed, t);

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
                this.fire('iteration', this.get(ELAPSED_TIME));
            } else {
                iterCount = 0;
                this._end();
            }

            _setPrivate(this, START_TIME, new Date());
            _setPrivate(this, ITERATION_COUNT, iterCount);
        },

        _flip: function() {
            Y.log('flipping to and from', 'info', 'Anim');
            var to = this.get('to'),
                from = this.get('from'),
                attr = this._attr,
                begin, end;

            Y.each(attr, function(v, n) { // to is required TODO: by
                begin = attr[n].e;
                end = attr[n].b;
                attr[n].b = begin;
                attr[n].e = end;
                attr[n].c = end - begin;
            }, this);
        },

        // TODO: support reverse in API?
        _runtimeAttr: function() {
            var from = this.get('from') || {},
                to = this.get('to') || {},
                fx = this.get('fx') || {},
                attr = {},
                unit, begin, end;

            this._attr = {};

/*
            this._initFX();
            Y.each(fx, function(v, n) { // to is required TODO: by
                var effect = _fx[v] || {};
                var easing = effect.easing || this.get('easing');

                if (effect.to) {
                    Y.each(effect.to, function(v, n) {
                        attr[n] = this._initAttr(n, effect.from[n], effect.to[n], easing);
                    }, this);
                }
            }, this);
*/
            Y.each(to, function(v, n) { // to is required TODO: by
                attr[n] = this._initAttr(n, from[n], to[n]);
            }, this);
            this._attr = attr;
        },

        _initAttr: function(n, from, to, easing) {
            easing = easing || this.get('easing');
            var node = this.get('node');

            if (Y.lang.isFunction(from)) {
                from = from.call(this, node);
            }

            if (Y.lang.isFunction(to)) {
                to = to.call(this, node);
            }

            if (from === undefined) {
                from = Anim.DEFAULT_GETTER.call(this, n); // TODO: unset onEnd?
            }

            // TODO: allow mixed units? (e.g. from: width:50%, to: width:10em)
            var mFrom = Anim.RE_UNITS.exec(from);
            var mTo = Anim.RE_UNITS.exec(to);

            var begin = mFrom[1],
                end = mTo[1],
                unit = mTo[2] || mFrom[2] || ''; // one might be zero TODO: mixed units


            if (!unit && Anim.RE_DEFAULT_UNIT.test(n)) {
                unit = Anim.DEFAULT_UNIT;
            }

            return {
                b: Number(begin),
                e: Number(end),
                c: end - begin,
                f: easing,
                u: unit
            };
        }
/*
        _initFX: function() {
            var fx = this.get('fx') || {};
            Y.each(fx, function(v, n) {
                if (v in _fx) {
                    if (_fx[v].onStart) {
                        this.on(START, _fx[v].onStart);
                    }

                    if (_fx[v].onTween) {
                        this.on(TWEEN, _fx[v].onTween);
                    }

                    if (_fx[v].onend) {
                        this.on(END, _fx[v].onEnd);
                    }
                }
            }, this);

        }
*/
    };


    Y.extend(Anim, Y.Base, proto);
    Y.Anim = Anim;
}, '3.0.0', { requires: ['base', 'easing'] });
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

YUI.add('easing', function(Y) {
    /**
     * Singleton that determines how an animation proceeds from start to end.
     * @class Easing
     * @namespace Y
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
}, '3.0.0');
YUI.add('nodefxplugin', function(Y) {

        Y.Plugin = Y.Plugin || {};

        function NodeFX(config) {
            config.node = config.owner;
            NodeFX.superclass.constructor.apply(this, arguments);
        }

        NodeFX.NAME = "nodefxplugin";
        NodeFX.NS = "fx";

        var proto = {
        };

        Y.extend(NodeFX, Y.Anim);
        Y.Plugin.NodeFX = NodeFX;

}, '3.0.0', { requires: ['anim'] });
