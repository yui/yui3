(function() {

    var Y = YAHOO,
        U = Y.util,
        E = U.Event,
        D = U.Dom,
        L = Y.lang,
        C = L.CONST,
        W = Y.widget;

    function Slider(attributes) {
        this.constructor.superclass.constructor.apply(this, arguments);
    }

    // Widget API
    Slider.NAME = "Slider";

    // Widget API - Event Strings
    Slider.E = {
        SlideStart : "slideStart",
        SlideEnd : "sliderEnd",
        EndMove: "endMove",
        Change: C.Change
    };

    // Widget API
    Slider.CONFIG = {
        group : {},
        thumb : {},
        type : {
            set : function(val) {
                // Setup obj props
                if (val == "region") {
                    this._isRegion = true;
                } else if (val == "horiz") {
                    this._isHoriz = true;
                } else {
                    this._isVert = true;
                }
            },
            value : "horiz",
            validator : function(val) {
                return (val == "horiz" || val == "vert" || val == "region");
            }
        },
        bgEnabled : {
            value:true
        },
        keysEnabled : {
            value:true 
        },
        keyIncrement : {
            value:20
        },
        tickPause : {
            value:40
        },
        animationDuration : {
            value:0.2
        },
        animate : {
            value: !L.isUndefined(U.Anim)
        },
        locked : {
            value: false
        }
    };

    L.extend(Slider, W.Widget, {

        // Widget API
        initializer : function(attributes) {
            if (this.get("group")) {
                this.initThumb();
            }
        },

        // Widget API
        renderer : function() {
            this.baselinePos = D.getXY(this.getBackgroundEl());

            this.getThumb().render();

            this.initDD();
            this.apply();
        },
        
        initThumb: function() {
            var t =  this.getThumb();
            t.parent = this;
            this.set("tickPause", t.getTickPause());
        },

        getThumb: function() {
            return this.get("thumb");
        },

        lock: function() {
            this.set("locked", true);
        },

        unlock: function() {
            this.set("locked", false);
        },

        isLocked : function() {
            return this.get("locked");
        },
        
        getValue: function () { 
            return this.getThumb().getValue();
        },

        getXValue: function () { 
            return this.getThumb().getXValue();
        },

        getYValue: function () {
            return this.getThumb().getYValue();
        },

        setValueToMin : function() {
            this._setValToLimit(false);
        },

        setValueToMax : function() {
            this._setValToLimit(true);
        },

        setValue: function(val, force, silent) {
            if ( this.isLocked() && !force ) {
                return false;
            }
            if ( isNaN(val) ) {
                return false;
            }
            var t = this.getThumb();
            if (this._isRegion) {
                return false;
            } else if (this._isHoriz) {
                t.set("x", val, silent);
            } else if (this._isVert) {
                t.set("y", val, silent);
            }
        },

        setRegionValue: function(valX, valY, force, silent) {
            if (this.isLocked() && !force) {
                return false;
            }
            if ( isNaN(valX) && isNaN(valY)) {
                return false;
            }
            var t = this.getThumb();
            if (valX || valX === 0) {
                t.set("x", valX, silent);
            }
            if (valY || valY === 0) {
                t.set("y", valY, silent);
            }
        },

        stepYValue : function(dir) {
            var i = this.get("keyIncrement") * dir;

            var newY = this.getYValue() + i; 
            if (this._isVert) {
                this.setValue(newY);
            } else if (this._isRegion) {
                this.setRegionValue(null, newY);
            }
        },

        stepXValue : function(dir) {
            var i = this.get("keyIncrement") * dir;

            var newX = this.getXValue() + i;
            if (this._isHoriz) {
                this.setValue(newX);
            } else if (this._isRegion) {
                this.setRegionValue(newX, null);
            }
        },

        _setValToLimit : function(minOrMax) {
            var str = (minOrMax) ? "max" : "min",
                t = this.getThumb(),
                s = W.SliderThumb,
                x = s.X,
                y = s.Y;

            if (this._isRegion) {
                this.setRegionValue(t.get(str + x), t.get(str + y));
            } else if (this._isVert) {
                this.setValue(t.get(str + y));
            } else {
                this.setValue(t.get(str + x));
            }
        },

        _slideStart: function() {
            if (!this._sliding) {
                this.fireEvent(Slider.E.SlideStart);
                this._sliding = true;
            }
        },

        _slideEnd: function() {
            if (this._sliding && this.moveComplete) {
                this.fireEvent(Slider.E.SlideEnd);
                this._sliding = false;
                this.moveComplete = false;
            }
        },

        _endMove: function () {
            this.unlock();
            this.moveComplete = true;

            this.fireEvent(Slider.E.EndMove);
            this.fireEvents();
        },

        fireEvents: function (thumbEvent) {
            var t = this.getThumb();

            if (!thumbEvent) {
                this.cachePosition();
            }

            if (!this.isLocked()) {
                if (this._isRegion) {
                    var newX = t.getXValue();
                    var newY = t.getYValue();

                    if (newX != this.previousX || newY != this.previousY) {
                      this.fireEvent(Slider.E.Change, { x: newX, y: newY });
                    }

                    this.previousX = newX;
                    this.previousY = newY;
                } else {
                    var newVal = t.getValue();
                      if (newVal != this.previousVal) {
                        this.fireEvent(Slider.E.Change, newVal);
                      }
                      this.previousVal = newVal;
                }
                this._slideEnd();
            }
        },

        focus: function() {
            this.focusEl();
            if (this.isLocked()) {
                return false;
            } else {
                this._slideStart();
                return true;
            }
        },

        initDD : function() {
            this._dd = new U.DragDrop(
                this.getBackgroundEl().id, 
                this.get("group"), 
                true);

            this._dd.setInitPosition();
            this._dd.isTarget = false;
        },

        focusEl : function() {
            var el = this.getBackgroundEl();
            if (el.focus) {
                try {
                    el.focus();
                } catch(e) {
                }
            }
            this.verifyOffset();
        },

        verifyOffset: function(checkPos) {
            var newPos = D.getXY(this.getBackgroundEl());
            if (newPos) {
                if (newPos[0] != this.baselinePos[0] || newPos[1] != this.baselinePos[1]) {
                    this.getThumb()._dd.resetConstraints();
                    this.baselinePos = newPos;
                    return false;
                }
            }
            return true;
        },

        cachePosition : function() {
            this.getThumb()._dd.cachePosition();        
        },

        getBackgroundEl : function() {
            return this._node;
        },

        apply : function() {
            // Events Fired in the UI, Update Model
            this.addKeyListeners();
            this.addDDListeners();
            this.addThumbDDListeners();

            // Events Fired in the Model, Update/Refresh View
            this.addViewListeners();
        },

        addKeyListeners: function() {
            var bg = this.getBackgroundEl();
            E.on(bg, "keydown",  this.onKeyDown,  this, true);
            E.on(bg, "keypress", this.onKeyPress, this, true);
        },

        addDDListeners : function() {
            var self = this,
                sDD = this._dd;

            sDD.b4MouseDown = function(e) {self.beforeBGMouseDown(e);};
            sDD.onDrag = function(e) {self.onBGDrag(e);};
            sDD.onMouseDown = function(e) {self.onBGMouseDown(e);};

            this.on(Slider.E.EndMove, this.sync, this, true);
        },

        addThumbDDListeners : function() {
            var self = this,
                tDD = this.getThumb()._dd;

            tDD.onMouseDown = function(e) {self.onThumbMouseDown(e);};
            tDD.startDrag = function(e) {self.onThumbStartDrag(e);};
            tDD.onDrag = function(e) {self.onThumbDrag(e);};
            tDD.onMouseUp = function(e) {self.onThumbMouseUp(e);};
        },

        addViewListeners : function() {
            this.on("lockedChange", this.onLockChange, this, true);
        },

        onLockChange : function() {
            var dd = this._dd;
            var t = this.getThumb();
            if (this.get("locked")) {
                dd.lock();
                t.lock();
            } else {
                dd.unlock();
                t.unlock();
            }
        },

        beforeBGMouseDown: function(e) {
            var dd = this.getThumb()._dd;
            dd.autoOffset();
            dd.resetConstraints();
        },

        onBGMouseDown: function(e) {
            if (!this.isLocked() && this.get("bgEnabled")) {
                this.focus();
                this._moveThumb(e);
            }
        },

        onBGDrag: function(e) {
            if (!this.isLocked()) {
                this._moveThumb(e);
            }
        },

        onThumbMouseDown : function (e) { 
            return this.focus(); 
        },

        onThumbStartDrag : function(e) { 
            this._slideStart(); 
        },

        onThumbDrag : function(e) {
            this.sync();
            this.fireEvents(true);
        },

        onThumbMouseUp: function(e) {
            if (!this.isLocked() && !this.moveComplete) {
                this._endMove();
            }
        },

        onKeyPress: function(e) {
            if (this.get("keysEnabled")) {
                switch (E.getCharCode(e)) {
                    case 0x25: // left
                    case 0x26: // up
                    case 0x27: // right
                    case 0x28: // down
                    case 0x24: // home
                    case 0x23: // end
                        E.preventDefault(e);
                        break;
                    default:
                }
            }
    
        },

        onKeyDown: function(e) {
            var s = Slider;

            if (this.get("keysEnabled")) {
                var changed = true;
                switch (E.getCharCode(e)) {
                    case 0x25:  // left 
                        this.stepXValue(s.DEC);
                        break;
                    case 0x26:  // up
                        this.stepYValue(s.DEC);
                        break;
                    case 0x27:  // right
                        this.stepXValue(s.INC);
                        break;
                    case 0x28:  // down
                        this.stepYValue(s.INC);
                        break;
                    case 0x24:  // home
                        this.setValueToMin();
                        break;
                    case 0x23:  // end
                        this.setValueToMax();
                        break;
                    default:
                        changed = false;
                }
                if (changed) {
                    E.stopEvent(e);
                }
            }
        },

        sync : function() {
            var val = this.getThumb().getUIValue();
            if (this._isRegion) {
                this.setRegionValue(val[0], val[1], false, true);
            } else {
                this.setValue(val, false, true);
            }
        },

        _moveThumb : function(e) {
            var x = E.getPageX(e);
            var y = E.getPageY(e);
            this.getThumb().moveThumb(x, y);
        },

        _dd : null
    });

    // Widget Specific Constants
    Slider.INC = 1;
    Slider.DEC = -1;

    // Widget Specific Static Methods    
    Slider.getHorizSlider = function (sliderId, thumbId, minX, maxX, iTickSize) {
        var thumb = new W.SliderThumb({
                node: thumbId,  
                group: sliderId,
                minX: minX,
                maxX: maxX,
                minY: 0,
                maxY: 0,
                tickSize: iTickSize
        });
        return new Slider({ node: sliderId, group: sliderId, thumb : thumb, type: "horiz" });
    };

    Slider.getVertSlider = function (sliderId, thumbId, minY, maxY, iTickSize) {
        var thumb = new W.SliderThumb({ 
                node: thumbId,  
                group: sliderId,
                minY: minY,
                maxY: maxY,
                minX: 0,
                maxX: 0,
                tickSize: iTickSize
        });
        return new Slider({ node: sliderId, group: sliderId, thumb : thumb, type: "vert" });
    };

    Slider.getRegionSlider = function (sliderId, thumbId, minX, maxX, minY, maxY, iTickSize) {
        var thumb = new W.SliderThumb({  
                node : thumbId,
                group: sliderId, 
                minX: minX,
                maxX: maxX,
                minY: minY,
                maxY: maxY,
                tickSize: iTickSize
        });
        return new Slider({ node: sliderId, group: sliderId, thumb : thumb, type: "region" });
    };

    W.Slider = Slider;

})();