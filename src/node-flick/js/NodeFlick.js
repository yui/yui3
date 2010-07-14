//TODO
//    Is offsetLeft, offsetTop accurate with translate

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
                return this.get("host").get("parentNode");
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
            this.setBounds();
            this._uiSetStyle();

            this.get("host").on("flick", Y.bind(this._onFlick, this));
        },

        setBounds : function () {
            var boundingHeight = this.get("boundingBox").get("offsetHeight"),
                boundingWidth = this.get("boundingBox").get("offsetWidth"),
                contentHeight = this.get("host").get("offsetHeight"),
                contentWidth = this.get("host").get("offsetWidth");

            if(contentHeight > boundingHeight) {
                this._maxY = contentHeight - boundingHeight;
                this._minY = 0;
                this._scrollY = true;
            }

            if (contentWidth > boundingWidth) {
                this._maxX = contentWidth - boundingWidth;
                this._minX = 0;
                this._scrollX = true;
            }
            
            this._x = this._y = 0;
        },

        _uiSetStyle : function() {
            var bb = this.get("boundingBox"),
                node = this.get("host");

            // TODO: Cross-browser and class based
            bb.setStyle("overflow", "auto");

            if (bb.getStyle("position") !== "absolute") {
                bb.setStyle("position", "relative");
            }

            node.setStyle("position", "absolute");
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
            this._vel = e.velocity;
            this._flicking = true;
            this._move();
        },

        /**
         * Execute a single frame in the flick animation
         *
         * @method _flickFrame
         * @protected
         */
        _move: function() {
            var // content = this.get("host"),
                y = this._y || 0, //content.get("offsetTop"),
                x = this._x || 0, //content.get("offsetLeft"),
                step = this.get("step"),
                maxY = this._maxY,
                minY = this._minY,
                maxX = this._maxX,
                minX = this._minX;

            this._vel = (this._vel*this.get("deceleration"));

            if(this._scrollX) {
                x = x + (this._vel * step);
            }
    
            if(this._scrollY) {
                y = y + (this._vel * step);
            }

            if(Math.abs(this._vel).toFixed(4) <= 0.015) {
                this._flicking = false;

                // TODO
                this._killTimer(!(this._exceededYBoundary || this._exceededXBoundary));

                if(this._scrollX) {
                    if(x < minX) {
                        this._snapToEdge = true;
                        this._setOffsetX(minX);
                    } else if(x > maxX) {
                        this._snapToEdge = true;
                        this._setOffsetX(maxX);
                    }
                }
    
                if(this._scrollY) {
                    if(y < minY) {
                        this._snapToEdge = true;
                        this._setOffsetY(minY);
                    } else if(y > maxY) {
                        this._snapToEdge = true;
                        this._setOffsetY(maxY);
                    }
                }

            } else {

                if(this._scrollX && (x < minX || x > maxX)) {
                    this._exceededXBoundary = true;
                    this._vel *= this.get('bounce');
                }

                if(this._scrollY && (y < minY || y > maxY)) {
                    this._exceededYBoundary = true;
                    this._vel *= this.get('bounce');
                }


                if(this._scrollX) {
                    this._setOffsetX(x);
                }

                if(this._scrollY) {
                    this._setOffsetY(y);
                }

                this._flickTimer = Y.later(this.get("step"), this, this._move);
            }
        },

        _setOffsetX : function(val) {
            this._setOffset(val, null, this.get("duration"), this.get("easing"));
        },

        _setOffsetY : function(val) {
            this._setOffset(null, val, this.get("duration"), this.get("easing"));
        },

        _setOffset: function(x, y, duration, easing) {

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
            var node = this.get("host");

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
            var bounce = this.get("bounce"),
                dist = this.get("bounceDistance"),
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