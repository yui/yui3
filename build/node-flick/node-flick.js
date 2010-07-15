YUI.add('node-flick', function(Y) {

    var HOST = "host",
        PARENT_NODE = "parentNode",
        BOUNDING_BOX = "boundingBox",
        OFFSET_HEIGHT = "offsetHeight",
        OFFSET_WIDTH = "offsetWidth",
        BOUNCE = "bounce",
        MIN_DISTANCE = "minDistance",
        MIN_VELOCITY = "minVelocity",
        BOUNCE_DISTANCE = "bounceDistance",
        DECELERATION = "deceleration",
        STEP = "step",
        DURATION = "duration",
        EASING = "easing",
        FLICK = "flick";

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

        duration : {},

        easing : {}
    };

    Flick.NAME = "pluginFlick";
    Flick.NS = "flick";

    Y.extend(Flick, Y.Plugin.Base, {

        initializer : function() {
            this._node = this.get(HOST);

            this.setBounds();
            this._setStyles();

            this._node.on(FLICK, Y.bind(this._onFlick, this), {
                minDistance : this.get(MIN_DISTANCE),
                minVelocity : this.get(MIN_VELOCITY)
            });
        },

        setBounds : function () {
            var box = this.get(BOUNDING_BOX),

                boxHeight = box.get(OFFSET_HEIGHT),
                boxWidth = box.get(OFFSET_WIDTH),

                contentHeight = this._node.get(OFFSET_HEIGHT),
                contentWidth = this._node.get(OFFSET_WIDTH);

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
        },

        _setStyles : function() {
            var box = this.get(BOUNDING_BOX);

            // TODO: Cross-browser and class based
            box.setStyle("overflow", "hidden");

            if (box.getStyle("position") !== "absolute") {
                box.setStyle("position", "relative");
            }

            this._node.setStyle("position", "absolute");
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
            this._v = e.flick.velocity * e.flick.direction;
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

            if (this._scrollX) {
                x = x - (velocity * step);
            }
    
            if (this._scrollY) {
                y = y - (velocity * step);
            }

            if (Math.abs(velocity).toFixed(4) <= 0.015) {

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

            duration = duration || this._snapToEdge ? 400 : 0;
            easing = easing || this._snapToEdge ? 'ease-out' : null;

            this._x = x;
            this._y = y;

            this._anim(x, y, duration, easing);
        },

        _anim : function(x, y, duration, easing) {
            var node = this._node;

            // TODO: Integrate Anim, once done

            if(duration) {
                easing = easing || 'cubic-bezier(0, 0.1, 0, 1.0)';
                node.setStyle('-webkit-transition', duration+'ms -webkit-transform');
                node.setStyle('-webkit-transition-timing-function', easing);
            } else {
                node.setStyle('-webkit-transition', null);
                node.setStyle('-webkit-transition-timing-function', null);
            }
            node.setStyle('-webkit-transform', 'translate3d('+(x*-1)+'px,'+(y*-1)+'px,0)');            
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

            if(fireEvent) {
                // this.fire(EV_SCROLL_END);
            }
        }
    });

    Y.Plugin.Flick = Flick;


}, '@VERSION@' ,{requires:['event-flick', 'plugin']});
