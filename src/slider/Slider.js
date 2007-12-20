(function() {

    var Y = YAHOO,
        U = Y.util,
        E = U.Event,
        D = U.Dom,
        L = Y.lang,
        W = Y.widget;

/*
    var isStr = L.isString,
        isObj = L.isObject,
        isNum = L.isNumber,
        isBool = L.isBoolean;
*/

    function Slider(node, attributes) {
        this.constructor.superclass.constructor.apply(this, arguments);
    }

    Slider.NAME = "Slider";

    Slider.CONFIG = {
        group : {
//            validator : isStr
        },
        thumb : {
//            validator : isObj
        },
        type : {
            value : "horiz",
            validator : function(val) {
                return (val == "horiz" || val == "vert" || val == "region");
            }
        },
        bgEnabled : {
            value:true
//            validator : isBool
        },
        keysEnabled : {
            value:true 
//            validator : isBool
        },
        keyIncrement : {
            value:20
//            validator : isNum
        },
        tickPause : {
            value:40
//            validator : isNum
        },
        animationDuration : {
            value:0.2
//            validator : isNum
        },
        animate : {
            value: !L.isUndefined(U.Anim)
//            validator : isBool
        },
        locked : {
            value: false,
            set: function(val) {
                var t = this.getThumb();
                if (val) {
                    t.lock();
                } else {
                    t.unlock();
                }
            }
//            validator : isBool
        }
    };

    L.extend(Slider, W.Widget, {

        initializer : function(attr) {
            if (this.get("group")) {
                this.initThumb();
            } 
/*          
            else {
                throw "Required Attributes missing";
            }
*/
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

        _setValToLimit : function(minOrMax) {
            var str = (minOrMax) ? "max" : "min",
                t = this.getThumb(),
                s = W.SliderThumb,
                x = s.X,
                y = s.Y;

            if (t._isHoriz) {
                this.setValue(t.get(str + x));
            } else if (t._isVert) {
                this.setValue(t.get(str + y));
            } else {
                this.setRegionValue(t.get(str + x), t.get(str + y));
            }
        },

        setValue: function(val, force, silent) {
            if ( this.isLocked() && !force ) {
                return false;
            }
            if ( isNaN(val) ) {
                return false;
            }
            var t = this.getThumb();
            if (t._isRegion) {
                return false;
            } else if (t._isHoriz) {
                t.set("x", val, silent);
            } else if (t._isVert) {
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

        _slideStart: function() {
            if (!this._sliding) {
                this.fireEvent("slideStart");
                this._sliding = true;
            }
        },

        _slideEnd: function() {
            if (this._sliding && this.moveComplete) {
                this.fireEvent("slideEnd");
                this._sliding = false;
                this.moveComplete = false;
            }
        },

        stepYValue : function(dir) {
            var i = this.get("keyIncrement") * dir,
                t = this.getThumb();

            var newY = this.getYValue() + i; 
            if (t._isVert) {
                this.setValue(newY);
            } else if (t._isRegion) {
                this.setRegionValue(null, newY);
            }
        },

        stepXValue : function(dir) {
            var i = this.get("keyIncrement") * dir,
                t = this.getThumb();

            var newX = this.getXValue() + i;
            if (t._isHoriz) {
                this.setValue(newX);
            } else if (t._isRegion) {
                this.setRegionValue(newX, null);
            }
        },

        endMove: function () {
            this.unlock();
            this.moveComplete = true;

            this.fireEvent("endMove");
            this.fireEvents();
        },

        fireEvents: function (thumbEvent) {
            var t = this.getThumb();

            if (!thumbEvent) {
                this.view.cachePosition();
            }

            if (!this.isLocked()) {
                if (t._isRegion) {
                    var newX = t.getXValue();
                    var newY = t.getYValue();

                    if (newX != this.previousX || newY != this.previousY) {
                      this.fireEvent("change", { x: newX, y: newY });
                    }

                    this.previousX = newX;
                    this.previousY = newY;
                } else {
                    var newVal = t.getValue();
                      if (newVal != this.previousVal) {
                        this.fireEvent("change", newVal);
                      }
                      this.previousVal = newVal;
                }
                this._slideEnd();
            }
        },

        focus: function() {
            // Discuss
            this.view.focus();

            if (this.isLocked()) {
                return false;
            } else {
                this._slideStart();
                return true;
            }
        }
    });

    Slider.INC = 1;
    Slider.DEC = -1;

    Slider.getHorizSlider = function (sliderId, thumbId, minX, maxX, iTickSize) {
        var thumb = new W.SliderThumb(thumbId, { 
                group: sliderId,
                minX: minX,
                maxX: maxX,
                tickSize: iTickSize
        });
        return new Slider(sliderId, { group: sliderId, thumb : thumb, type: "horiz"});
    };

    Slider.getVertSlider = function (sliderId, thumbId, minY, maxY, iTickSize) {
        var thumb = new W.SliderThumb(thumbId, { 
                group: sliderId,
                minY: minY,
                maxY: maxY,
                tickSize: iTickSize
        });
        return new Slider(sliderId, { group: sliderId, thumb : thumb, type: "vert" });
    };

    Slider.getRegionSlider = function (sliderId, thumbId, minX, maxX, minY, maxY, iTickSize) {
        var thumb = new W.SliderThumb(thumbId, { 
                group: sliderId, 
                minX: minX,
                maxX: maxX,
                minY: minY,
                maxY: maxY,
                tickSize: iTickSize
        });
        return new Slider(sliderId, { group: sliderId, thumb : thumb, type: "region" });
    };

    function SliderView(widget) {
        this.superApply(widget);
        this.thumb = widget.getThumb();
    }

    L.extend(SliderView, W.WidgetView, {

        render : function() {
            this.baselinePos = D.getXY(this.getBackgroundEl());
            this.thumb.render();
            this.thumbView = this.thumb.view;
            this.initDD();
        },

        update : function() {
            this.thumbView.update();
        },

        initDD : function() {
            this._dd = new U.DragDrop(
                this.widget.get("node").get("id"), 
                this.widget.get("group"), 
                true);

            this._dd.isTarget = false;
        },

        focus : function() {
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
                    this.thumbView._dd.resetConstraints();
                    this.baselinePos = newPos;
                    return false;
                }
            }
            return true;
        },

        cachePosition : function() {
            this.thumbView._dd.cachePosition();        
        },

        getBackgroundEl : function() {
            return this.widget.get("node").get("node");
        },

        _dd : null
    });

    function SliderController(widget, view) {
        this.superApply(widget, view);
        this.thumb = this.widget.getThumb();
    }

    L.extend(SliderController, W.WidgetController, {

        apply : function() {

            // Events Fired in the UI, Update Model
            this.addKeyListeners();
            this.addDDListeners();
            this.addThumbDDListeners();

            // Events Fired in the Model, Update/Refresh View
            this.addViewListeners();
        },

        addKeyListeners: function() {
            var bg = this.view.getBackgroundEl();
            E.on(bg, "keydown",  this.onKeyDown,  this, true);
            E.on(bg, "keypress", this.onKeyPress, this, true);
        },
        
        addDDListeners : function() {
            var c = this,
                sDD = this.view._dd;

            sDD.onMouseUp = function(e) {c.onBGMouseUp(e);};
            sDD.b4MouseDown = function(e) {c.beforeBGMouseDown(e);};
            sDD.onDrag = function(e) {c.onBGDrag(e);};
            sDD.onMouseDown = function(e) {c.onBGMouseDown(e);};

            this.widget.on("endMove", this.sync, this, true);            
        },

        addThumbDDListeners : function() {
            var c = this,
                tDD = this.thumb.view._dd;

            tDD.onMouseDown = function(e) {c.onThumbMouseDown(e);};
            tDD.startDrag = function(e) {c.onThumbStartDrag(e);};
            tDD.onDrag = function(e) {c.onThumbDrag(e);};
            tDD.onMouseUp = function(e) {c.onThumbMouseUp(e);};
        },

        addViewListeners : function() {
            this.widget.on("lockedChange", this.onLockChange, this, true);
        },

        sync: function() {
            var val = this.thumb.view.getValue(),
                w = this.widget;
            if (this.thumb._isRegion) {
                w.setRegionValue(val[0], val[1], false, true);
            } else {
                w.setValue(val, false, true);
            }
        },

        beforeBGMouseDown: function(e) {
            var dd = this.thumb.view._dd;
            dd.autoOffset();
            dd.resetConstraints();
        },

        onBGMouseDown: function(e) {
            var w = this.widget;
            if (!w.isLocked() && w.get("bgEnabled")) {
                w.focus();
                this._moveThumb(e);
            }
        },

        _moveThumb : function(e) {
            var x = E.getPageX(e);
            var y = E.getPageY(e);
            this.thumb.view.moveThumb(x, y);
        },

        onBGDrag: function(e) {
            if (!this.widget.isLocked()) {
                this._moveThumb(e);
            }
        },

        onBGMouseUp: function(e) {
            var w = this.widget;
            if (!w.isLocked() && !w.moveComplete) {
                w.endMove();
            }
        },

        onThumbMouseDown : function (e) { 
            return this.widget.focus(); 
        },

        onThumbStartDrag : function(e) { 
            this.widget._slideStart(); 
        },

        onThumbDrag : function(e) {
            this.sync();
            this.widget.fireEvents(true);
        },

        onThumbMouseUp: function(e) {
            var w = this.widget;
            if (!w.isLocked() && !w.moveComplete) {
                w.endMove();
            }
        },

        onLockChange: function() {
            var dd = this.view._dd;
            if (this.get("locked")) {
                dd.lock();
            } else {
                dd.unlock();
            }
        },

        onKeyPress: function(e) {
            if (this.widget.get("keysEnabled")) {
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
            var w = this.widget,
                s = Slider;
            
            if (w.get("keysEnabled")) {
                var changed = true;
                switch (E.getCharCode(e)) {
                    case 0x25:  // left 
                        w.stepXValue(s.DEC);
                        break;
                    case 0x26:  // up
                        w.stepYValue(s.DEC);
                        break;
                    case 0x27:  // right
                        w.stepXValue(s.INC);
                        break;
                    case 0x28:  // down
                        w.stepYValue(s.INC);
                        break;
                    case 0x24:  // home
                        w.setValueToMin();
                        break;
                    case 0x23:  // end
                        w.setValueToMax();
                        break;
                    default:
                        changed = false;
                }
                if (changed) {
                    E.stopEvent(e);
                }
            }
        }
    });

    Slider.prototype.viewClass = SliderView;
    Slider.prototype.controllerClass = SliderController;

    W.Slider = Slider;
    W.SliderView = SliderView;
    W.SliderController = SliderController;

})();