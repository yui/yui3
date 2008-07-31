/**
 * Y.Animation Utility.
 * @module anim
 */

    /**
     * Handles animation _queueing and threading.
     * @class Anim
     * @constructor
     * @extends Base
     */

    var RUNNING = 'running',
        START_TIME = 'startTime',
        ELAPSED_TIME = 'elapsedTime',
        START = 'start',
        TWEEN = 'tween',
        END = 'end',
        NODE = 'node',
        PAUSED = 'paused',
        REVERSE = 'reverse', // TODO: cleanup
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


    /**
     * Bucket for custom getters and setters
     *
     * @property behaviors
     * @static
     */
    Y.Anim.behaviors = {
        left: {
            get: function(anim, attr) {
                return anim._getOffset(attr);
            }
        }
    };

    Y.Anim.behaviors.top = Y.Anim.behaviors.left;

    /**
     * The default setter to use when setting object properties.
     *
     * @property DEFAULT_SETTER
     * @static
     */
    Y.Anim.DEFAULT_SETTER = function(anim, att, from, to, elapsed, duration, fn, unit) {
        unit = unit || '';
        anim._node.setStyle(att, fn(elapsed, NUM(from), NUM(to) - NUM(from), duration) + unit);
    };

    /**
     * The default getter to use when getting object properties.
     *
     * @property DEFAULT_GETTER
     * @static
     */
    Y.Anim.DEFAULT_GETTER = function(anim, prop) {
        return anim._node.getComputedStyle(prop);
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
                this._node = node;
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
         * @attribute reverse
         * @type Boolean
         * @default false 
         */
        reverse: {
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
                _running[anim]._runFrame();
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
            _setPrivate(this, REVERSE, false);

            delete _running[Y.stamp(this)];
            this.fire(END, {elapsed: this.get(ELAPSED_TIME)});
        },

        _runFrame: function() {
            var attr = this._runtimeAttr,
                customAttr = Y.Anim.behaviors,
                easing = attr.easing,
                d = attr.duration,
                t = new Date() - this.get(START_TIME),
                reversed = this.get('reverse'),
                done = (t >= d),
                lastFrame = d,
                attribute,
                setter;
                
            if (reversed) {
                t = d - t;
                done = (t <= 0);
                lastFrame = 0;
            }

            for (var i in attr) {
                if (attr[i].to) { // testing if attribute
                    attribute = attr[i];
                    setter = (i in customAttr && 'set' in customAttr[i]) ?
                            customAttr[i].set : Y.Anim.DEFAULT_SETTER;

                    if (!done) {
                        setter(this, i, attribute.from, attribute.to, t, d, easing, attribute.unit); 
                    } else { // ensure final value is set
                       // TODO: handle keyframes 
                        setter(this, i, attribute.from, attribute.to, lastFrame, d, easing, attribute.unit); 
                    }
                }
            }

            this._actualFrames += 1;
            _setPrivate(this, ELAPSED_TIME, t);

            this.fire(TWEEN);
            if (done) {
                this._lastFrame();
            }
        },

        _lastFrame: function() {
            var iter = this.get('iterations'),
                iterCount = this.get(ITERATION_COUNT);

            iterCount += 1;
            if (iter === 'infinite' || iterCount < iter) {
                if (this.get('direction') === 'alternate') {
                    this.set(REVERSE, !this.get(REVERSE)); // flip it
                }
                this.fire('iteration', { frames: this._actualFrames });
            } else {
                iterCount = 0;
                this._end();
            }

            _setPrivate(this, START_TIME, new Date());
            _setPrivate(this, ITERATION_COUNT, iterCount);
        },

        _initAttr: function() {
            var from = this.get('from') || {},
                to = this.get('to') || {},
                dur = this.get('duration') * 1000,
                node = this.get(NODE),
                easing = this.get('easing') || {},
                attr = {},
                customAttr = Y.Anim.behaviors,
                unit, begin, end;

            Y.each(to, function(val, name) {
                if (typeof val === 'function') {
                    val = val.call(this, node);
                }

                begin = from[name];
                if (begin === undefined) {
                    begin = (name in customAttr && 'get' in customAttr[name])  ?
                            customAttr[name].get(this, name) : Y.Anim.DEFAULT_GETTER(this, name);
                } else if (typeof begin === 'function') {
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

                if (!begin || !end) {
                    Y.fail('invalid from or to passed given for ' + name, 'Anim');
                    return;
                }

                attr[name] = {
                    from: begin,
                    to: end,
                    unit: unit
                };

                attr.duration = dur;
                attr.easing = easing;

            }, this);

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
        }
    };

    Y.extend(Y.Anim, Y.Base, proto);
