(function() {

    var Event = YAHOO.util.Event,
        Dom = YAHOO.util.Dom,
        Lang = YAHOO.lang;

    function SliderThumb(node, attributes) {
        this.constructor.superclass.constructor.apply(this, arguments);
    };

    SliderThumb.NAME = "SliderThumb";

    SliderThumb.CONFIG = {
        'group' : {
            validator : Lang.isString
        },

        'minX' : {
            validator : Lang.isNumber,
            value : 0
        },

        'maxX' : {
            validator : Lang.isNumber,
            value : 0
        },

        'minY' : {
            validator : Lang.isNumber,
            value : 0
        },

        'maxY' : {
            validator : Lang.isNumber,
            value : 0
        },

        'tickSize' : {
            validator : function(val) {
                return (Lang.isNumber(val) && val >= 0);
            },
            value : 0
        },

        'x' : {
            set : function(val) {
                var min = this.get("minX");
                var max = this.get("maxX");

                if(val < min) {
                    return min;
                } else if (val > max){
                    return max;
                } else {
                    return val;
                }
            },
            validator : function(val) {
                if (Lang.isNumber(val)) {
                    if (this.get("tickSize") > 0) {
                        return (val % this.get("tickSize") === 0);
                    }
                    return true;
                } else {
                    return false;
                }
            },
            value : 0
        },

        'y' : {
            set : function(val) {
                var min = this.get("minY");
                var max = this.get("maxY");

                if(val < min) {
                    return min;
                } else if (val > max){
                    return max;
                } else {
                    return val;
                }
            },
            validator : function(val) {
                if (Lang.isNumber(val)) {
                    if (this.get("tickSize") > 0) {
                        return (val % this.get("tickSize") === 0);
                    }
                    return true;
                } else {
                    return false;
                }
            },
            value : 0
        }
    };

    var widgetProto = {

        viewClass : SliderThumbView,
        controllerClass : SliderThumbController,

        initializer: function (attributes) {
            if (Lang.isUndefined(this.get("group"))) {
                throw "Required Attributes Missing";
            }
            this.initProperties();
        },

        initProperties : function() {
            var xR = this.getXRange();
            var yR = this.getYRange();

            if (xR !== 0 && yR !== 0) {
                this._isRegion = true;
            } else if (xR !== 0) {
                this._isHoriz = true;
            } else {
                this._isVert = true;
            }
        },

/*
        initDragDrop : function() {
            this._dd = new YAHOO.util.DD(
                this.get("node").get("id"),
                this.get("group")
            );

            // Set dd state
            this._dd.isTarget = false;
            this._dd.maintainOffset = true;
            this._dd.scroll = false;
        },
*/
        clearTicks: function () {
            this.set("tickSize", 0);
        },

        lock : function() {
            this.set("locked", true);
        },

        unlock : function() {
            this.set("locked", false);            
        },

        isLocked : function() {
            return this.get("locked");
        },

        getValue: function () {
            if (this._isHoriz) {
                return this.getXValue();
            } else if (this._isVert){
                return this.getYValue();
            } else {
                return [this.getXValue(), this.getYValue()];
            }
        },

        getXValue: function () {
            return this.get("x");
        },

        getYValue: function () {
            return this.get("y");
        },
        
        getXRange :  function() {
            return this.get("maxX") - this.get("minX");
        },

        getYRange : function() {
            return this.get("maxY") - this.get("minY");
        },

        getXRatio: function(x) {
            if (Lang.isUndefined(x)) {
                x = this.getXValue();                
            }

            var r = this.getXRange();
            if (r === 0) {
                return 0;
            } else {
                return x/r;
            }
        },

        getYRatio: function(y) {
            if (Lang.isUndefined(y)) {
                y = this.getYValue();                
            }
            var r = this.getYRange();
            if (r === 0) {
                return 0;
            } else {
                return y/r;
            }
        },

        getTickPause : function() {
            var ticks = this.get("tickSize");
            if (ticks > 0) {
                var range = (this._isHoriz) ? this.getXRange() : this.getYRange();
                var nTicks = Math.round(range/ticks);
                if (nTicks > 0) {
                    return Math.round(360 / nTicks);
                }
            }
            return 0;
        },

        endMove : function() {
            this.parent.endMove();
        },

        _isHoriz: false,
        _isVert: false,
        _isRegion: false,
    };

    Lang.extend(SliderThumb, YAHOO.widget.Widget, widgetProto);

    function SliderThumbView(widget) {
        this.super(widget);
    }

    var viewProto = {

        _dd : null,

        render : function() {
            // this.update();
            this.centerPoint = this.findCenterPoint();
            this.initDragDrop();
        },

        update : function() {
            // Set XY Position, based on X, Y values
            this.setXOffset();
            this.setYOffset();
        },

        initDragDrop : function() {

            this._dd = new YAHOO.util.DD(
                this.getThumbEl().id,
                this.widget.get("group")
            );

            this._dd.setXConstraint(
                this.widget.get("minX")*this.getXScale(),
                this.widget.get("maxX")*this.getXScale(),
                this.widget.get("tickSize")*this.getXScale());

            this._dd.setYConstraint(
                this.widget.get("minY")*this.getYScale(),
                this.widget.get("maxY")*this.getYScale(),
                this.widget.get("tickSize")*this.getYScale());

            // Set dd state
            this._dd.isTarget = false;
            this._dd.maintainOffset = true;
            this._dd.scroll = false;
        },

        getParentRegion : function() {
            return Dom.getRegion(this.getParentId());
        },

        getOffsetFromParent: function(parentPos) {

            var thumbEl = this.getThumbEl();
            var offset;

            if (!this.deltaOffset) {

                var thumbPos = Dom.getXY(thumbEl);
                var parentPos = parentPos || Dom.getXY(this.getParentId());

                offset = [ (thumbPos[0] - parentPos[0]), (thumbPos[1] - parentPos[1]) ];

                var l = parseInt( Dom.getStyle(thumbEl, "left"), 10 );
                var t = parseInt( Dom.getStyle(thumbEl, "top" ), 10 );

                var deltaX = l - offset[0];
                var deltaY = t - offset[1];

                if (!isNaN(deltaX) && !isNaN(deltaY)) {
                    this.deltaOffset = [deltaX, deltaY];
                }
            } else {
                var left = parseInt( Dom.getStyle(thumbEl, "left"), 10 );
                var top  = parseInt( Dom.getStyle(thumbEl, "top" ), 10 );
    
                offset  = [left + this.deltaOffset[0], top + this.deltaOffset[1]];
            }

            return offset;
        },

        getValue : function() {
            if (this.widget._isHoriz) {
                return this.getXValue();
            } else if (this.widget._isVert) {
                return this.getYValue();
            } else {
                return [this.getXValue(), this.getYValue()];
            }
        },

        // Get Data from the DOM for this VIEW
        getXValue : function() {
            var offset = this.getXOffset();
            var val = Math.round(offset/this.getXScale());
            return val;
        },

        getYValue : function() {
            /*
            var y = this.getYOffset();

            var range = Dom.get(this.getParentId()).offsetHeight - this.getThumbEl().offsetHeight;
            var valRange = this.widget.getYRange();
            var val = (y * valRange)/range; 
            return val;
            */
            var offset = this.getYOffset();
            var val = Math.round(offset/this.getYScale());
            return val;
        },

        setXOffset : function() {
            this.moveThumb(this.getOffsetForX(), null, false, false);
        },

        setYOffset : function() {
            this.moveThumb(null, this.getOffsetForY(), false, false);
        },
        
        getXScale : function() {
            var range = this.widget.getXRange();
            if (range > 0) {
                var uirange = Dom.get(this.getParentId()).offsetWidth - this.getThumbEl().offsetWidth;
                return Math.round(uirange/range);
            } else {
                return 0;
            }
        },

        getYScale : function() {
            var range = this.widget.getYRange();
            if (range > 0) {
                var uirange = Dom.get(this.getParentId()).offsetHeight - this.getThumbEl().offsetHeight;
                return Math.round(uirange/range);
            } else {
                return 0;
            }
        },

        getXOffset : function() {
            var offset = this.getOffsetFromParent();
            return offset[0];
        },

        getYOffset : function() {
            var offset = this.getOffsetFromParent();
            return offset[1];
        },

        getOffsetForX : function(x) {
            var diff = this.widget.getXValue() - this.widget.get("minX");
            var offset = diff * this.getXScale() + this.centerPoint.x;

            var parentOffsetX = Dom.getXY(this.getParentId())[0];
            return parentOffsetX + offset;
        },

        getOffsetForY : function(y) {
            /*
            var ratio = this.widget.getYRatio(y);
            var size = Dom.get(this.getParentId()).offsetHeight - this.getThumbEl().offsetHeight;
            var offset = Math.round(ratio*size) + this.centerPoint.y;
            
            var parentOffsetY = Dom.getXY(this.getParentId())[1];
            return parentOffsetY + offset;
            */

            var diff = this.widget.getYValue() - this.widget.get("minY");
            var offset = diff * this.getYScale() + this.centerPoint.x;
            var parentOffsetY = Dom.getXY(this.getParentId())[1];
            return parentOffsetY + offset;
        },

        findCenterPoint : function() {
            var thumbEl = this.getThumbEl();
            return {
                x: parseInt(thumbEl.offsetWidth/2, 10),
                y: parseInt(thumbEl.offsetHeight/2, 10) 
            }
        },

        moveThumb: function(x, y, skipAnim, midMove) {

            var thumb = this.widget;
            var thumbView = this;

            var curCoord = Dom.getXY(this.getThumbEl());
            if (!x && x !== 0) {
                x = curCoord[0];
            }

            if (!y && y !== 0) {
                y = curCoord[1];
            }

            this._dd.setDelta(this.centerPoint.x, this.centerPoint.y);

            var _p = this._dd.getTargetCoord(x, y);
            var p = [_p.x, _p.y];

            var animate = thumb.parent.get("animate");
            if (animate && thumb.get("tickSize") > 0 && !skipAnim) {
                thumb.lock();

                // cache the current thumb pos
                this.curCoord = curCoord;
                setTimeout( function() { thumbView.moveOneTick(p); }, thumb.parent.get("tickPause"));

            } else if (animate && !skipAnim) {

                thumb.lock();

                var oAnim = new YAHOO.util.Motion( 
                        thumb.get("node").get("id"), 
                        { points: { to: p } }, 
                        thumb.get("animationDuration"), 
                        YAHOO.util.Easing.easeOut );

                oAnim.onComplete.subscribe(function() { 
                    thumb.endMove(); 
                });
                oAnim.animate();

            } else {
                this._dd.setDragElPos(x, y);
                if (!midMove) {
                    thumb.endMove();
                }
            }
        },

        moveOneTick: function(finalCoord) {

            var thumb = this.widget, tmp;
            var nextCoord = null;

            if (thumb._isRegion) {
                nextCoord = this._getNextX(this.curCoord, finalCoord);
                var tmpX = (nextCoord) ? nextCoord[0] : this.curCoord[0];
                nextCoord = this._getNextY([tmpX, this.curCoord[1]], finalCoord);
            } else if (thumb._isHoriz) {
                nextCoord = this._getNextX(this.curCoord, finalCoord);
            } else {
                nextCoord = this._getNextY(this.curCoord, finalCoord);
            }

            if (nextCoord) {
                // cache the position
                this.curCoord = nextCoord;
                this._dd.alignElWithMouse(this.getThumbEl(), nextCoord[0], nextCoord[1]);

                // check if we are in the final position, if not make a recursive call
                if (!(nextCoord[0] == finalCoord[0] && nextCoord[1] == finalCoord[1])) {
                    var self = this;
                    setTimeout(function() { self.moveOneTick(finalCoord); },  thumb.parent.get("tickPause"));
                } else {
                    thumb.endMove();
                }
            } else {
                thumb.endMove();
            }
        },

        _getNextX: function(curCoord, finalCoord) {
            var thumb = this.widget;
            var thresh;
            var tmp = [];

            var nextCoord = null;
            if (curCoord[0] > finalCoord[0]) {
                thresh = thumb.get("tickSize") - this.centerPoint.x;
                tmp = this._dd.getTargetCoord( curCoord[0] - thresh, curCoord[1] );
                nextCoord = [tmp.x, tmp.y];
            } else if (curCoord[0] < finalCoord[0]) {
                thresh = thumb.get("tickSize") + this.centerPoint.x;
                tmp = this._dd.getTargetCoord( curCoord[0] + thresh, curCoord[1] );
                nextCoord = [tmp.x, tmp.y];
            } else {
                // equal, do nothing
            }

            return nextCoord;
        },

        _getNextY: function(curCoord, finalCoord) {
            var thumb = this.widget;
            var thresh;
            var tmp = [];
            var nextCoord = null;

            if (curCoord[1] > finalCoord[1]) {
                thresh = thumb.get("tickSize") - this.centerPoint.y;
                tmp = this._dd.getTargetCoord( curCoord[0], curCoord[1] - thresh );
                nextCoord = [tmp.x, tmp.y];
            } else if (curCoord[1] < finalCoord[1]) {
                thresh = thumb.get("tickSize") + this.centerPoint.y;
                tmp = this._dd.getTargetCoord( curCoord[0], curCoord[1] + thresh );
                nextCoord = [tmp.x, tmp.y];
            } else {
                // equal, do nothing
            }
            return nextCoord;
        },

        getThumbEl : function() {
            return this.widget.get('node').get('node');
        },

        getParentId : function() {
            return this.widget.get('group');
        },

        centerPoint : null,
        curCoord : null
    };

    Lang.extend(SliderThumbView, YAHOO.widget.WidgetView, viewProto);

    function SliderThumbController(widget, view) {
        this.super(widget, view);
    }

    var controllerProto = {

        apply : function() {
            // Events Fired in the Model, Update/Refresh View            
            this.applyViewUpdateListeners();
        },

        applyViewUpdateListeners : function() {
            this.widget.subscribe("xChange", this.view.setXOffset, this.view, true);
            this.widget.subscribe("yChange", this.view.setYOffset, this.view, true);

            this.widget.subscribe("tickSize", this.onTickSizeChange, this, true);
            this.widget.subscribe("lockedChange", this.onLockChange, this, true);
        },

        onLockChange: function() {
            if (this.get("locked")) {
                this.view._dd.lock();
            } else {
                this.view._dd.unlock();
            }
        },

        onTickSizeChange : function() {
            if (this.get("tickSize") == 0) {
                this.view._dd.clearTicks();
            }
        }
    };

    Lang.extend(SliderThumbController, YAHOO.widget.WidgetController, controllerProto);

    YAHOO.widget.SliderThumb = SliderThumb;
    YAHOO.widget.SliderThumbView = SliderThumbView;
    YAHOO.widget.SliderThumbController = SliderThumbController;

})();
