/**
 * Y.Animation Utility.
 * @module animation
 */
    /**
     * Handles animation _queueing and threading.
     */

    var IS_ANIMATED = 'isAnimated',
        START_TIME = 'startTime',
        ELAPSED_TIME = 'elapsedTime',
        START = 'start',
        TWEEN = 'tween',
        END = 'end',
        NODE = 'node',
        ITERATION_COUNT = 'iterationCount',

        RE_RGB = /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,
        NUM = Number;

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
     * @class Anim
     */
    Y.Anim = function() {
        Y.Anim.superclass.constructor.apply(this, arguments);
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

    /**
     * Bucket for custom getters and setters
     *
     * @property CUSTOM_ATTRIBUTES
     * @static
     */
    Y.Anim.CUSTOM_ATTRIBUTES = {};

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
                return Y.Node.get(node);
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
         * @attribute isY.Animated
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

    };

    /**
     * Starts the animation thread.
     * Only one thread can run at a time.
     * @method start
     * @static
     */    
    Y.Anim.start = function() {
        if (!_timer) {
            _timer = setInterval(this.run, 1);
        }
    };

    /**
     * Stops the _timer.
     * @method stop
     * @static
     */    
    Y.Anim.pause = function() {
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
    Y.Anim.stop = function() {
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
    Y.Anim.run = function() {
        var anim;

        for (var i = 0, len = _queue.length; i < len; ++i) {
            anim = _queue[i];
            if ( anim && anim.get(IS_ANIMATED)) {
                anim._runFrame();
                anim.fire(TWEEN);
            }
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
            if (!this.get(IS_ANIMATED)) {
                this._start();
            }
        },

        /**
         * Starts or resumes an animation.
         * @param {NUM|String} elapsed optional Millisecond or
         * percent start time marker.
         * @method run
         */    
        resume: function() { // TODO: test case
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
            Y.Anim.start(); // start animator

            if (!this.get(ELAPSED_TIME)) {
                this._actualFrames = 0;
                this._initAttr();
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

            this.fire(END, {elapsed: elapsed});
        },

        _runFrame: function() {
            var t = new Date() - this.get(START_TIME),
                attr = this._runtimeAttr,
                customAttr = Y.Anim.CUSTOM_ATTRIBUTES,
                node = this.get('node'),
                attribute,
                setter,
                d,
                val;
                
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

            if (t >= d) {
                this._lastFrame();
            }
        },

        _lastFrame: function() {
            var iter = this.get('iterations'),
                elapsed = this.get(ELAPSED_TIME),
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
            var from = this.get('from') || {},
                to = this.get('to') || {},
                duration = this.get('duration'),
                node = this.get('node'),
                easing = this.get('easing') || {},
                keyframes = this.get('keyframes') || {},
                attr = Y.merge(this._attr, {}),
                customAttr = Y.Anim.CUSTOM_ATTRIBUTES,
                unit, begin, end;

            if (to) {
                keyframes[100] = to;
            }

            var prev = {};
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

            }); // to is required TODO: by

            this._runtimeAttr = Y.merge(attr, {});
        },

        // TODO: support reverse in API?
        _initAttr: function() {
            var from = this.get('from') || {},
                to = this.get('to') || {},
                duration = this.get('duration'),
                node = this.get('node'),
                easing = this.get('easing') || {},
                keyframes = this.get('keyframes') || {},
                attr = {},
                customAttr = Y.Anim.CUSTOM_ATTRIBUTES,
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

                    if (!begin) {
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
