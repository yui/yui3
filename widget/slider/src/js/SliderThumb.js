(function() {

    var Y = YAHOO,
        U = Y.util,
        D = U.Dom,
        L = Y.lang,
        W = Y.widget;
/*
    var isNum = L.isNumber,
        isStr = L.isString;
*/
    function SliderThumb(node, attr) {
        this.constructor.superclass.constructor.apply(this, arguments);
    };

    SliderThumb.NAME = "SliderThumb";

    SliderThumb.X = "X";
    SliderThumb.Y = "Y";

    SliderThumb.CONFIG = {
        'group' : {
           // validator : isStr
        },

        'minX' : {
           // validator : isNum,
            value : 0
        },

        'maxX' : {
          //  validator : isNum,
            value : 0
        },

        'minY' : {
          //  validator : isNum,
            value : 0
        },

        'maxY' : {
          //  validator : isNum,
            value : 0
        },

        'tickSize' : {
          //  validator : function(val) {
          //      return (isNum(val) && val >= 0);
          //  },
            value : 0
        },

        'x' : {
            set : function(val) {
                return this.constrain(val, SliderThumb.X);
            },
         //   validator : isNum,
            value : 0
        },

        'y' : {
            set : function(val) {
                return this.constrain(val, SliderThumb.Y);
            },
          //  validator : isNum,
            value : 0
        }
    };

    L.extend(SliderThumb, W.Widget, {

        viewClass : SliderThumbView,
        controllerClass : SliderThumbController,

        initializer: function (attributes) {
/*
            if (L.isUndefined(this.get("group"))) {
                throw "Required Attributes Missing";
            }
*/
            this.initProps();
        },

        initProps : function() {
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

        constrain : function(val, axis) {
            var min = this.get("min" + axis);
            var max = this.get("max" + axis);
            var tSize = this.get("tickSize");

            if(val < min) {
                val = min;
            } else if (val > max){
                val = max;
            } else {
                if (tSize > 0) {
                    var diff = val % tSize;
                    if (diff > 0) {
                        if (diff < Math.round(tSize/2)) {
                            val = val - diff;
                        } else {
                            val = val + (tSize - diff);
                        }
                    }
                }
            }
            return val;
        },

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
        _isRegion: false
    });

    function SliderThumbView(widget) {
        this.superApply(widget);
    }

    L.extend(SliderThumbView, W.WidgetView, {

        _dd : null,

        render : function() {
            // this.update();
            this.centerPoint = this.findCenter();
            this.initDD();
        },

        update : function() {
            // Set XY Position, based on X, Y values
            this.setXOffset();
            this.setYOffset();
        },

        initDD : function() {

            var w = this.widget,
                xs = this.getXScale(),
                ys = this.getYScale();

            var dd = new U.DD( this.getThumbEl().id, w.get("group"));

            dd.setXConstraint( w.get("minX") * xs, w.get("maxX") * xs, w.get("tickSize") * xs);
            dd.setYConstraint( w.get("minY") * ys, w.get("maxY") * ys, w.get("tickSize") * ys);
            dd.isTarget = false;
            dd.maintainOffset = true;
            dd.scroll = false;

            this._dd = dd;
        },

        getOffsetFromParent: function(parentPos) {

            var thumbEl = this.getThumbEl();
            var offset;

            if (!this.deltaOffset) {

                var thumbPos = D.getXY(thumbEl);
                var parentPos = parentPos || D.getXY(this.getParentEl());

                offset = [ (thumbPos[0] - parentPos[0]), (thumbPos[1] - parentPos[1]) ];

                var l = parseInt( D.getStyle(thumbEl, "left"), 10 );
                var t = parseInt( D.getStyle(thumbEl, "top" ), 10 );

                var deltaX = l - offset[0];
                var deltaY = t - offset[1];

                if (!isNaN(deltaX) && !isNaN(deltaY)) {
                    this.deltaOffset = [deltaX, deltaY];
                }
            } else {
                var left = parseInt( D.getStyle(thumbEl, "left"), 10 );
                var top  = parseInt( D.getStyle(thumbEl, "top" ), 10 );
    
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
            return Math.round(this.getOffsetFromParent()[0]/this.getXScale());
        },

        getYValue : function() {
            return Math.round(this.getOffsetFromParent()[1]/this.getYScale());
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
                var uirange = this.getParentEl().offsetWidth - this.getThumbEl().offsetWidth;
                return Math.round(uirange/range);
            } else {
                return 0;
            }
        },

        getYScale : function() {
            var range = this.widget.getYRange();
            if (range > 0) {
                var uirange = this.getParentEl().offsetHeight - this.getThumbEl().offsetHeight;
                return Math.round(uirange/range);
            } else {
                return 0;
            }
        },

        getOffsetForX : function(x) {
            var diff = this.widget.getXValue() - this.widget.get("minX");
            var offset = diff * this.getXScale() + this.centerPoint.x;

            var parentOffsetX = D.getXY(this.getParentEl())[0];
            return parentOffsetX + offset;
        },

        getOffsetForY : function(y) {
            var diff = this.widget.getYValue() - this.widget.get("minY");
            var offset = diff * this.getYScale() + this.centerPoint.y;
            var parentOffsetY = D.getXY(this.getParentEl())[1];
            return parentOffsetY + offset;
        },

        findCenter : function() {
            var t = this.getThumbEl();
            return {
                x: parseInt(t.offsetWidth/2, 10),
                y: parseInt(t.offsetHeight/2, 10) 
            }
        },

        moveThumb: function(x, y, skipAnim, midMove) {

            var thumb = this.widget;
            var thumbView = this;

            var curCoord = D.getXY(this.getThumbEl());
            if (!x && x !== 0) {
                x = curCoord[0];
            }

            if (!y && y !== 0) {
                y = curCoord[1];
            }

            var cp = this.centerPoint;
            this._dd.setDelta(cp.x, cp.y);

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

                var oAnim = new U.Motion( 
                        thumb.get("node").get("id"), 
                        { points: { to: p } }, 
                        thumb.get("animationDuration"), 
                        U.Easing.easeOut );

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

        getParentEl : function() {
            return this.widget.parent.get('node').get('node');
        },

        centerPoint : null,
        curCoord : null
    });

    function SliderThumbController(widget, view) {
        this.superApply(widget, view);
    }

    L.extend(SliderThumbController, W.WidgetController, {

        apply : function() {
            // Events Fired in the Model, Update/Refresh View            
            this.addViewListeners();
        },

        addViewListeners : function() {
            var w = this.widget;
            var v = this.view;
            w.on("xChange", v.setXOffset, v, true);
            w.on("yChange", v.setYOffset, v, true);

            w.on("tickSize", this.onTickSizeChange, this, true);
            w.on("lockedChange", this.onLockChange, this, true);
        },

        onLockChange: function() {
            var dd = this.view._dd;
            if (this.get("locked")) {
                dd.lock();
            } else {
                dd.unlock();
            }
        },

        onTickSizeChange : function() {
            if (this.get("tickSize") == 0) {
                this.view._dd.clearTicks();
            }
        }
    });

    W.SliderThumb = SliderThumb;
    W.SliderThumbView = SliderThumbView;
    W.SliderThumbController = SliderThumbController;

})();
