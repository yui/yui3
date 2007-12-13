(function() {

    var Event = YAHOO.util.Event,
        Dom = YAHOO.util.Dom,
        Lang = YAHOO.lang;

    function Slider(node, attributes) {
        this.constructor.superclass.constructor.apply(this, arguments);
    };

    Slider.NAME = "Slider";

    Slider.CONFIG = {
        group : {
            validator : Lang.isString
        },
        thumb : {
            validator : Lang.isObject
        },
        type : {
            value : "horiz",
            validator : function(val) {
                return (val == "horiz" || val == "vert" || val == "region");
            }
        },
        backgroundEnabled : {
            value:true, 
            validator : Lang.isBoolean
        },
        enableKeys : {
            value:true, 
            validator : Lang.isBoolean
        },
        keyIncrement : {
            value:20,
            validator : Lang.isNumber
        },
        tickPause : {
            value:40,
            validator : Lang.isNumber
        },
        animationDuration : {
            value:0.2,
            validator : Lang.isNumber
        },
        animate : {
            value: !Lang.isUndefined(YAHOO.util.Anim),
            validator : Lang.isBoolean
        },
        locked : {
            value: false,
            set: function(val) {
                if (val) {
                    this.getThumb().lock();
                } else {
                    this.getThumb().unlock();
                }
            },
            validator : Lang.isBoolean
        }
    };

    var widgetProto = {

        viewClass : SliderView,
        controllerClass : SliderController,

        initializer : function(attributes) {
            if (this.get("group")) {
                this.initThumb();
            } else {
                throw "Required Attributes missing";
            }
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

        decrementXValue : function() {
            var newX = this.getXValue() - this.get("keyIncrement");
            if (this.getThumb()._isHoriz) {
                this.setValue(newX);
            } else if (this.getThumb()._isRegion) {
                this.setRegionValue(newX, null);
            }
        },

        decrementYValue : function() {
            var newY = this.getYValue() - this.get("keyIncrement");
            if (this.getThumb()._isVert) {
                this.setValue(newY);
            } else if (this.getThumb()._isRegion) {
                this.setRegionValue(null, newY);
            }
        },

        incrementXValue : function() {
            var newX = this.getXValue() + this.get("keyIncrement");
            if (this.getThumb()._isHoriz) {
                this.setValue(newX);
            } else if (this.getThumb()._isRegion) {
                this.setRegionValue(newX, null);
            }
        },

        incrementYValue : function() {
            var newY = this.getYValue() + this.get("keyIncrement");
            if (this.getThumb()._isVert) {
                this.setValue(newY);
            } else if (this.getThumb()._isRegion) {
                this.setRegionValue(null, newY);
            }
        },

        setValueToMin : function() {        
            if (this.getThumb()._isHoriz) {
                this.setValue(this.getThumb().get("minX"));
            } else if (this.getThumb()._isVert) {
                this.setValue(this.getThumb().get("minY"));
            } else {
                this.setRegionValue(this.getThumb().get("minX"), this.getThumb().get("minY"));
            }
        },

        setValueToMax : function() {
            if (this.getThumb()._isHoriz) {
                this.setValue(this.getThumb().get("maxX"));
            } else if (this.getThumb()._isVert) {
                this.setValue(this.getThumb().get("maxY"));
            } else {
                this.setRegionValue(this.getThumb().get("maxX"), this.getThumb().get("maxY"));
            }
        },

        setValue: function(val, force, silent) {
            if ( this.isLocked() && !force ) {
                return false;
            }
            if ( isNaN(val) ) {
                return false;
            }

            if (this.getThumb()._isRegion) {
                return false;
            } else if (this.getThumb()._isHoriz) {
                this.getThumb().set("x", val, silent);
            } else if (this.getThumb()._isVert) {
                this.getThumb().set("y", val, silent);
            }
        },

        setRegionValue: function(valX, valY, force, silent) {
            if (this.isLocked() && !force) {
                return false;
            }

            if ( isNaN(valX) && isNaN(valY)) {
                return false;
            }

            if (valX || valX === 0) {
                this.getThumb().set("x", valX, silent);
            }
            if (valY || valY === 0) {
                this.getThumb().set("y", valY, silent);
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
    };

    Lang.extend(Slider, YAHOO.widget.Widget, widgetProto);

    Slider.getHorizSlider = function (sliderId, thumbId, minX, maxX, iTickSize) {
        var thumb = new YAHOO.widget.SliderThumb(thumbId, { 
                group: sliderId, 
                minX: minX, 
                maxX: maxX,
                tickSize: iTickSize
        });
        return new Slider(sliderId, { group: sliderId, thumb : thumb, type: "horiz"});
    };

    Slider.getVertSlider = function (sliderId, thumbId, minY, maxY, iTickSize) {
        var thumb = new YAHOO.widget.SliderThumb(thumbId, { 
                group: sliderId,  
                minY: minY, 
                maxY: maxY, 
                tickSize: iTickSize 
        });
        return new Slider(sliderId, { group: sliderId, thumb : thumb, type: "vert" });
    };

    Slider.getRegionSlider = function (sliderId, thumbId, minX, maxX, minY, maxY, iTickSize) {
        var thumb = new YAHOO.widget.SliderThumb(thumbId, { 
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
        this.super(widget);
        this.thumb = widget.getThumb();
    }

    var viewProto = {

        render : function() {
            this.baselinePos = this.getBaselinePosition();
            this.thumb.render();
            this.thumbView = this.thumb.view;
            this.initDragDrop();
        },

        update : function() {
            this.thumbView.update();
        },

        initDragDrop : function() {
            this._dd = new YAHOO.util.DragDrop(
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

        getBaselinePosition : function() {
            return YAHOO.util.Dom.getXY(this.getBackgroundEl());
        },

        verifyOffset: function(checkPos) {
            var newPos = YAHOO.util.Dom.getXY(this.getBackgroundEl());
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
    };

    Lang.extend(SliderView, YAHOO.widget.WidgetView, viewProto);

    function SliderController(widget, view) {
        this.super(widget, view);
        this.thumb = this.widget.getThumb();
    }

    var controllerProto = {

        apply : function() {
            // Events Fired in the UI, Update Model
            this.applyKeyListeners();
            this.applyDragDropListeners();
            this.applyThumbDragDropListeners();
            this.applyModelUpdateListeners();

            // Events Fired in the Model, Update/Refresh View
            this.applyViewUpdateListeners();
        },

        applyKeyListeners: function() {
            Event.on(this.view.getBackgroundEl(), "keydown",  this.handleKeyDown,  this, true);
            Event.on(this.view.getBackgroundEl(), "keypress", this.handleKeyPress, this, true);
        },

        applyDragDropListeners : function() {
            var c = this;
            var sDD = this.view._dd;

            sDD.onMouseUp = function(e) {c.onBackgroundMouseUp(e);};
            sDD.b4MouseDown = function(e) {c.onBeforeBackgroundMouseDown(e);};
            sDD.onDrag = function(e) {c.onBackgroundDrag(e);};
            sDD.onMouseDown = function(e) {c.onBackgroundMouseDown(e);};

            this.widget.subscribe("endMove", this.onEndMove, this, true);            
        },

        applyThumbDragDropListeners : function() {
            var c = this;
            var tDD = this.thumb.view._dd;

            tDD.onMouseDown = function(e) {c.onThumbMouseDown(e);};
            tDD.startDrag = function(e) {c.onThumbStartDrag(e);};
            tDD.onDrag = function(e) {c.onThumbDrag(e);};
            tDD.onMouseUp = function(e) {c.onThumbMouseUp(e);};
        },

        applyViewUpdateListeners : function() {
            this.widget.subscribe("lockedChange", this.onLockChange, this, true);
        },

        onLockChange: function() {
            if (this.get("locked")) {
                this.view._dd.lock();
            } else {
                this.view._dd.unlock();
            }
        },

        onEndMove: function() {
            var val = this.thumb.view.getValue();
            if (this.thumb._isRegion) {
                this.widget.setRegionValue(val[0], val[1], false, true);
            } else {
                this.widget.setValue(val, false, true);
            }
        },

        onBeforeBackgroundMouseDown: function(e) {
            this.thumb.view._dd.autoOffset();
            this.thumb.view._dd.resetConstraints();
        },

        onBackgroundMouseDown: function(e) {
            if (!this.widget.isLocked() && this.widget.get("backgroundEnabled")) {
                var x = YAHOO.util.Event.getPageX(e);
                var y = YAHOO.util.Event.getPageY(e);
                this.widget.focus();

                // Set Thumb XY forcing view update instead of moveThumb? Perf?
                this.thumb.view.moveThumb(x, y);
            }
        },

        onBackgroundDrag: function(e) {
            if (!this.widget.isLocked()) {
                var x = YAHOO.util.Event.getPageX(e);
                var y = YAHOO.util.Event.getPageY(e);

                // Set Thumb XY instead of moveThumb forcing view update? Perf?
                this.thumb.view.moveThumb(x, y, true, true);
            }
        },

        onBackgroundMouseUp: function(e) {
            if (!this.widget.isLocked() && !this.widget.moveComplete) {
                this.widget.endMove();
            }
        },

        onThumbMouseDown : function (e) { 
            return this.widget.focus(); 
        },

        onThumbStartDrag : function(e) { 
            this.widget._slideStart(); 
        },

        onThumbDrag : function(e) {
            this.widget.fireEvents(true); 
        },

        onThumbMouseUp: function(e) {
            if (!this.widget.isLocked() && !this.widget.moveComplete) {
                this.widget.endMove();
            }
        },

        handleKeyPress: function(e) {
            if (this.widget.get("enableKeys")) {
                switch (Event.getCharCode(e)) {
                    case 0x25: // left
                    case 0x26: // up
                    case 0x27: // right
                    case 0x28: // down
                    case 0x24: // home
                    case 0x23: // end
                        Event.preventDefault(e);
                        break;
                    default:
                }
            }
    
        },

        handleKeyDown: function(e) {
            if (this.widget.get("enableKeys")) {
                var changeValue = true;
                switch (Event.getCharCode(e)) {
                    case 0x25:  // left 
                        this.widget.decrementXValue();
                        break;
                    case 0x26:  // up
                        this.widget.decrementYValue();
                        break;
                    case 0x27:  // right
                        this.widget.incrementXValue();
                        break;
                    case 0x28:  // down
                        this.widget.incrementYValue();
                        break;
                    case 0x24:  // home
                        this.widget.setValueToMin();
                        break;
                    case 0x23:  // end
                        this.widget.setValueToMax();
                        break;
                    default:
                        changeValue = false;
                }
                if (changeValue) {
                    Event.stopEvent(e);
                }
            }
        }
    };

    Lang.extend(SliderController, YAHOO.widget.WidgetController, controllerProto);
    
    YAHOO.widget.Slider = Slider;
    YAHOO.widget.SliderView = SliderView;
    YAHOO.widget.SliderController = SliderController;

})();