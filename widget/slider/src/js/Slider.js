(function() {

    var Event = YAHOO.util.Event,
        Dom = YAHOO.util.Dom,
        Lang = YAHOO.lang;

    function Slider(node, attributes) {
        this.constructor.superclass.constructor.apply(this, arguments);
        this.get("thumb").parent = this;
    };

    Slider.NAME = "Slider";

    Slider.CONFIG = {
        // Built-in "required" support for AttrProvider?
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
        }
    };

    Slider.SOURCE_UI_EVENT = 1;
    Slider.SOURCE_SET_VALUE = 2;

    Slider.getHorizSlider = function (sBGElId, sHandleElId, iLeft, iRight, iTickSize) {
        var thumb = new YAHOO.widget.SliderThumb(sHandleElId, { group: sBGElId, minX: iLeft, maxX: iRight,tickSize: iTickSize});

        return new Slider(sBGElId, { group: sBGElId, thumb : thumb, type: "horiz"});
    };

    Slider.getVertSlider = function (sBGElId, sHandleElId, iUp, iDown, iTickSize) {
        var thumb = new YAHOO.widget.SliderThumb(sHandleElId, { group: sBGElId,  minY: iUp, maxY: iDown, tickSize: iTickSize });

        return new Slider(sBGElId, { group: sBGElId, thumb : thumb, type: "vert" });
    };

    var wProto = {

        viewClass : SliderView,
        controllerClass : SliderController,

        initializer : function(attributes) {
            if (this.get("group")) {
                this.initProperties();
                this.initDragDrop();
                this.initThumb();
            } else {
                throw "Required Attributes missing";
            }
        },

        initDragDrop : function() {
            this._dd = new YAHOO.util.DragDrop(
                this.get("node").get("id"), 
                this.get("group"), 
                true);

            this._dd.isTarget = false;
        },

        initProperties : function() {
            this.valueChangeSource = 0;
            this._silent = false;
        },

        initThumb: function() {
            this.set("tickPause", this.getThumb().getTickPause());
        },

        getThumb: function() {
            return this.get("thumb");
        },

        lock: function() {
            this.getThumb().lock();
            this._dd.locked = true;
        },

        unlock: function() {
            this.getThumb().unlock();
            this._dd.locked = false;
        },

        isLocked : function() {
            return this._dd.isLocked();
        },

        focus: function() {
            this.valueChangeSource = Slider.SOURCE_UI_EVENT;
            this.view.focus();

            if (this.isLocked()) {
                return false;
            } else {
                this._slideStart();
                return true;
            }
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
            if (this.getThumb()._isHoriz || this.getThumb()._isRegion) {
                this.setValue(this.getXValue() - this.get("keyIncrement"));
            }
        },

        decrementYValue : function() {
            if (this.getThumb()._isVert || this.getThumb()._isRegion) {            
                this.setValue(this.getYValue() - this.get("keyIncrement"));
            }
        },

        incrementXValue : function() {
            if (this.getThumb()._isHoriz || this.getThumb()._isRegion) {
                this.setValue(this.getXValue() + this.get("keyIncrement"));
            }
        },

        incrementYValue : function() {
            if (this.getThumb()._isVert || this.getThumb()._isRegion) {
                this.setValue(this.getYValue() + this.get("keyIncrement"));
            }
        },

        setToMin : function() {        
            if (this.getThumb()._isHoriz || this.getThumb()._isRegion) {
                this.setValue(this.getThumb().get("minX"));
            }
            if (this.getThumb()._isVert || this.getThumb()._isRegion) {
                this.setValue(this.getThumb().get("minY"));
            }
        },

        setToMax : function() {
            if (this.getThumb()._isHoriz || this.getThumb()._isRegion) {
                this.setValue(this.getThumb().get("maxX"));
            }
            if (this.getThumb()._isVert || this.getThumb()._isRegion) {
                this.setValue(this.getThumb().get("maxY"));
            }
        },

        setValue: function(val, skipAnim, force, silent) {

            this._silent = silent;
            this.valueChangeSource = Slider.SOURCE_SET_VALUE;

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

        setRegionValue: function(valX, valY, skipAnim, force, silent) {

            this._silent = silent;
            this.valueChangeSource = Slider.SOURCE_SET_VALUE;

            if (this.isLocked() && !force) {
                return false;
            }

            if ( isNaN(valX) ) {
                return false;
            }

            this.getThumb().set("x", valX, silent);
            this.getThumb().set("y", valY, silent);
        },

        _slideStart: function() {
            if (!this._sliding) {
                if (!this._silent) {
                    this.fireEvent("slideStart");
                }
                this._sliding = true;
            }
        },

        _slideEnd: function() {
            if (this._sliding && this.moveComplete) {
                if (!this._silent) {
                    this.fireEvent("slideEnd");
                }
                this._sliding = false;
                this._silent = false;
                this.moveComplete = false;
            }
        },

        endMove: function () {
            this.unlock();
            this.moveComplete = true;
            this.fireEvents();
        },

        fireEvents: function (thumbEvent) {

            var t = this.getThumb();

            if (!thumbEvent) {
                t._dd.cachePosition();
            }

            if (! this.isLocked()) {
                if (t._isRegion) {
                    var newX = t.getXValue();
                    var newY = t.getYValue();

                    if (newX != this.previousX || newY != this.previousY) {
                        if (!this._silent) {
                            this.fireEvent("change", { x: newX, y: newY });
                        }
                    }
                    this.previousX = newX;
                    this.previousY = newY;
                } else {
                    var newVal = t.getValue();
                    if (newVal != this.previousVal) {
                        if (!this._silent) {
                            this.fireEvent("change", newVal);
                        }
                    }
                    this.previousVal = newVal;
                }
                this._slideEnd();
            }
        },
        
        _dd : null
    };

    Lang.extend(Slider, YAHOO.widget.Widget, wProto);
    
    function SliderView(widget) {
        this.super(widget);

        this.thumb = widget.getThumb();

    }

    var vProto = {

        render : function() {
            this.baselinePos = this.getBaselinePosition();
            this.thumb.render();
            this.thumbView = this.thumb.view;
        },

        update : function() {
            this.thumbView.update();
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
                    this.thumb._dd.resetConstraints();
                    this.baselinePos = newPos;
                    return false;
                }
            }
            return true;
        },

        getBackgroundEl : function() {
            return this.widget.get("node").get("node");
        }
    };

    Lang.extend(SliderView, YAHOO.widget.WidgetView, vProto);

    function SliderController(widget, view) {
        this.super(widget, view);
        this.thumb = this.widget.getThumb();
    }

    var cProto = {

        apply : function() {
            this.applyKeyListeners();
            this.applyDragDropListeners();
            this.applyThumbDragDropListeners();
        },

        applyKeyListeners: function() {
            Event.on(this.view.getBackgroundEl(), "keydown",  this.handleKeyDown,  this, true);
            Event.on(this.view.getBackgroundEl(), "keypress", this.handleKeyPress, this, true);
        },

        applyDragDropListeners : function() {
            var c = this;
            this.widget._dd.onMouseUp = function(e) {c.onBackgroundMouseUp(e);};
            this.widget._dd.b4MouseDown = function(e) {c.onBeforeBackgroundMouseDown(e);};
            this.widget._dd.onDrag = function(e) {c.onBackgroundDrag(e);};
            this.widget._dd.onMouseDown = function(e) {c.onBackgroundMouseDown(e);};            
        },

        applyThumbDragDropListeners : function() {
            var c = this;
            this.thumb._dd.onMouseDown = function(e) {c.onThumbMouseDown(e);};
            this.thumb._dd.startDrag = function(e) {c.onThumbStartDrag(e);};
            this.thumb._dd.onDrag = function(e) {c.onThumbDrag(e);};
            this.thumb._dd.onMouseUp = function(e) {c.onThumbMouseUp(e);};
        },

        onBeforeBackgroundMouseDown: function(e) {
            this.thumb._dd.autoOffset();
            this.thumb._dd.resetConstraints();
        },

        onBackgroundMouseDown: function(e) {
            if (!this.widget.isLocked() && this.widget.get("backgroundEnabled")) {
                var x = YAHOO.util.Event.getPageX(e);
                var y = YAHOO.util.Event.getPageY(e);
                this.widget.focus();

                // Set Thumb XY instead of moveThumb forcing view update? Perf?
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
                        this.widget.setToMin();
                        break;
                    case 0x23:  // end
                        this.widget.setToMax();
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

    Lang.extend(SliderController, YAHOO.widget.WidgetController, cProto);
    
    YAHOO.widget.Slider = Slider;
    YAHOO.widget.SliderView = SliderView;
    YAHOO.widget.SliderController = SliderController;

})();