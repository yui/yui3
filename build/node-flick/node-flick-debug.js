YUI.add('node-flick', function(Y) {

    var HOST = "host",
        PARENT_NODE = "parentNode",
        BOUNDING_BOX = "boundingBox",
        OFFSET_HEIGHT = "offsetHeight",
        OFFSET_WIDTH = "offsetWidth",
        SCROLL_HEIGHT = "scrollHeight",
        SCROLL_WIDTH = "scrollWidth",
        BOUNCE = "bounce",
        MIN_DISTANCE = "minDistance",
        MIN_VELOCITY = "minVelocity",
        BOUNCE_DISTANCE = "bounceDistance",
        DECELERATION = "deceleration",
        STEP = "step",
        DURATION = "duration",
        EASING = "easing",
        FLICK = "flick",
        
        getClassName = Y.ClassNameManager.getClassName;

    function Flick(config) {
        Flick.superclass.constructor.apply(this, arguments);
    }

    Flick.ATTRS = {

        deceleration : {
            value: 0.98
        },

        bounce : {
            value: 0.7
        },

        bounceDistance : {
            value: 150
        },

        minVelocity : {
            value: 0
        },

        minDistance : {
            value: 10
        },

        boundingBox : {
            valueFn : function() {
                return this.get(HOST).get(PARENT_NODE);
            }
        },

        step : {
            value:10
        },

        duration : {
            value:null
        },

        easing : {
            value:null
        }
    };
    
    Flick.NAME = "pluginFlick";
    Flick.NS = "flick";

    Y.extend(Flick, Y.Plugin.Base, {

        initializer : function() {
            this._node = this.get(HOST);

            this._renderClasses();
            this.setBounds();

            this._node.on(FLICK, Y.bind(this._onFlick, this), {
                minDistance : this.get(MIN_DISTANCE),
                minVelocity : this.get(MIN_VELOCITY)
            });
        },

        setBounds : function () {
            var box = this.get(BOUNDING_BOX),
                node = this._node,

                boxHeight = box.get(OFFSET_HEIGHT),
                boxWidth = box.get(OFFSET_WIDTH),

                contentHeight = node.get(SCROLL_HEIGHT),
                contentWidth = node.get(SCROLL_WIDTH);

            if (contentHeight > boxHeight) {
                this._maxY = contentHeight - boxHeight;
                this._minY = 0;
                this._scrollY = true;
            }

            if (contentWidth > boxWidth) {
                this._maxX = contentWidth - boxWidth;
                this._minX = 0;
                this._scrollX = true;
            }

            this._x = this._y = 0;

            node.set("top", this._y + "px");
            node.set("left", this._x + "px");
        },

        _renderClasses : function() {
            this.get(BOUNDING_BOX).addClass(Flick.CLASS_NAMES.box);
            this._node.addClass(Flick.CLASS_NAMES.content);
        },

        /**
         * Execute a flick at the end of a scroll action
         *
         * @method _flick
         * @param distance {Number} The distance (in px) the user scrolled before the flick
         * @param time {Number} The number of ms the scroll event lasted before the flick
         * @protected
         */
        _onFlick: function(e) {
            this._v = e.flick.velocity;
            this._flick = true;
            this._flickAnim();
        },

        /**
         * Execute a single frame in the flick animation
         *
         * @method _flickFrame
         * @protected
         */
        _flickAnim: function() {

            var y = this._y,
                x = this._x,

                maxY = this._maxY,
                minY = this._minY,
                maxX = this._maxX,
                minX = this._minX,
                velocity = this._v,

                step = this.get(STEP),
                deceleration = this.get(DECELERATION),
                bounce = this.get(BOUNCE);

            this._v = (velocity * deceleration);

            this._snapToEdge = false;

            if (this._scrollX) {
                x = x - (velocity * step);
            }
    
            if (this._scrollY) {
                y = y - (velocity * step);
            }

            if (Math.abs(velocity).toFixed(4) <= Flick.VELOCITY_THRESHOLD) {

                this._flick = false;

                this._killTimer(!(this._exceededYBoundary || this._exceededXBoundary));

                if (this._scrollX) {
                    if (x < minX) {
                        this._snapToEdge = true;
                        this._setX(minX);
                    } else if (x > maxX) {
                        this._snapToEdge = true;
                        this._setX(maxX);
                    }
                }

                if (this._scrollY) {
                    if (y < minY) {
                        this._snapToEdge = true;
                        this._setY(minY);
                    } else if (y > maxY) {
                        this._snapToEdge = true;
                        this._setY(maxY);
                    }
                }

            } else {

                if (this._scrollX && (x < minX || x > maxX)) {
                    this._exceededXBoundary = true;
                    this._v *= bounce;
                }

                if (this._scrollY && (y < minY || y > maxY)) {
                    this._exceededYBoundary = true;
                    this._v *= bounce;
                }

                if (this._scrollX) {
                    this._setX(x);
                }

                if (this._scrollY) {
                    this._setY(y);
                }

                this._flickTimer = Y.later(step, this, this._flickAnim);
            }
        },

        _setX : function(val) {
            this._move(val, null, this.get(DURATION), this.get(EASING));
        },

        _setY : function(val) {
            this._move(null, val, this.get(DURATION), this.get(EASING));
        },

        _move: function(x, y, duration, easing) {

            if (x !== null) {
                x = this._bounce(x);
            } else {
                x = this._x; 
            }

            if (y !== null) {
                y = this._bounce(y);
            } else {
                y = this._y;
            }

            duration = duration || this._snapToEdge ? Flick.SNAP_DURATION : 0;
            easing = easing || this._snapToEdge ? Flick.SNAP_EASING : Flick.EASING;

            this._x = x;
            this._y = y;

            this._anim(x, y, duration, easing);
        },

        _anim : function(x, y, duration, easing) {
            var xn = x * -1,
                yn = y * -1,

                transition = {
                    duration : duration / 1000,
                    easing : easing
                };

            Y.log("Transition: duration, easing:" + transition.duration, transition.easing, "node-flick");

            if (Y.Transition.useNative) {
                transition.transform = 'translate('+ (xn) + 'px,' + (yn) +'px)'; 
            } else {
                transition.left = xn + 'px';
                transition.top = yn + 'px';
            }

            this._node.transition(transition);
        },

        _bounce : function(val, max) {
            var bounce = this.get(BOUNCE),
                dist = this.get(BOUNCE_DISTANCE),
                min = bounce ? -dist : 0;

            max = bounce ? max + dist : max;
    
            if(!bounce) {
                if(val < min) {
                    val = min;
                } else if(val > max) {
                    val = max;
                }            
            }
            return val;
        },

        /**
         * Stop the animation timer
         *
         * @method _killTimer
         * @param fireEvent {Boolean} If true, fire the scrollEnd event
         * @private
         */
        _killTimer: function(fireEvent) {
            if(this._flickTimer) {
                this._flickTimer.cancel();
            }
        }

    }, {
        VELOCITY_THRESHOLD : 0.015,
        SNAP_DURATION : 400,
        EASING : 'cubic-bezier(0, 0.1, 0, 1.0)',
        SNAP_EASING : 'ease-out',
        CLASS_NAMES : {
            box: getClassName(Flick.NS),
            content: getClassName(Flick.NS, "content")
        }
    });

    Y.Plugin.Flick = Flick;


}, '@VERSION@' ,{requires:['classnamemanager', 'transition', 'event-flick', 'plugin']});
