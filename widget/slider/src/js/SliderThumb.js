(function() {

    var Y = YAHOO,
        U = Y.util,
        D = U.Dom,
        L = Y.lang,
        W = Y.widget;

    // Widget API
    function SliderThumb(attributes) {
        this.constructor.superclass.constructor.apply(this, arguments);
    }

    // Widget API
    SliderThumb.NAME = "SliderThumb";

    // Widget API
    SliderThumb.CONFIG = {
        'group' : {},

        'minX' : {
            value : 0
        },

        'maxX' : {
            value : 0
        },

        'minY' : {
            value : 0
        },

        'maxY' : {
            value : 0
        },

        'tickSize' : {
            validator : function(val) {
                return (L.isNumber(val) && val >= 0);
            },
            value : 0
        },

        'x' : {
            set : function(val) {
                return this._constrain(val, SliderThumb.X);
            },
            value : 0
        },

        'y' : {
            set : function(val) {
                return this._constrain(val, SliderThumb.Y);
            },
            value : 0
        },

        'locked' : {
            value : false
        }
    };

    // Widget Static Constants
    SliderThumb.X = "X";
    SliderThumb.Y = "Y";

    L.extend(SliderThumb, W.Widget, {

        // Widget API
        initializer: function (attributes) {
            // Can Remove. Left in for Ref Impl. readability
        },

        // Widget API
        renderer : function() {
            this._centerPoint = this.findCenter();

            this.initDD();
            this.initUI();
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
            var p = this.parent, v;
            if (p._isRegion) {
                v = [this.getXValue(), this.getYValue()];
            } else if (p._isVert){
                v = this.getYValue();
            } else {
                v = this.getXValue();
            }
            return v;
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

        // UI Methods

        initDD : function() {

            var w = this,
                xs = this.getXScale(),
                ys = this.getYScale();

            var dd = new U.DD( this.getThumbEl().id, w.get("group"));

            dd.isTarget = false;
            dd.maintainOffset = true;
            dd.scroll = false;

            dd.setInitPosition();

            dd.setXConstraint( w.get("minX") * xs, w.get("maxX") * xs, w.get("tickSize") * xs);
            dd.setYConstraint( w.get("minY") * ys, w.get("maxY") * ys, w.get("tickSize") * ys);

            this._dd = dd;
        },

        getOffsetFromParent: function(parentPos) {

            var thumbEl = this.getThumbEl();
            var offset;

            if (!this.deltaOffset) {
                var thumbPos = D.getXY(thumbEl);
                parentPos = parentPos || D.getXY(this.getParentEl());

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

        getUIValue : function() {
            var p = this.parent, v;
            if (p._isHoriz) {
                v = this.getUIXValue();
            } else if (p._isVert) {
                v = this.getUIYValue();
            } else {
                v = [this.getUIXValue(), this.getUIYValue()];
            }
            return v;
        },

        getUIXValue : function() {
            return Math.round(this.getOffsetFromParent()[0]/this.getXScale());
        },

        getUIYValue : function() {
            return Math.round(this.getOffsetFromParent()[1]/this.getYScale());
        },

        setXOffset : function() {
            this.moveThumb(this.getOffsetForX(), null);
        },

        setYOffset : function() {
            this.moveThumb(null, this.getOffsetForY());
        },

        getXScale : function() {
            var range = this.getXRange();
            if (range > 0) {
                var uirange = this.getParentEl().offsetWidth - this.getThumbEl().offsetWidth;
                return Math.round(uirange/range);
            } else {
                return 0;
            }
        },

        getYScale : function() {
            var range = this.getYRange();
            if (range > 0) {
                var uirange = this.getParentEl().offsetHeight - this.getThumbEl().offsetHeight;
                return Math.round(uirange/range);
            } else {
                return 0;
            }
        },

        getOffsetForX : function(x) {
            var diff = this.getXValue() - this.get("minX");
            var offset = diff * this.getXScale() + this._centerPoint.x;

            var parentOffsetX = D.getXY(this.getParentEl())[0];
            return parentOffsetX + offset;
        },

        getOffsetForY : function(y) {
            var diff = this.getYValue() - this.get("minY");
            var offset = diff * this.getYScale() + this._centerPoint.y;
            var parentOffsetY = D.getXY(this.getParentEl())[1];
            return parentOffsetY + offset;
        },
        
        getThumbEl : function() {
            return this._node;
        },

        getParentEl : function() {
            return this.parent._node;
        },

        initUI : function() {
            this.addUIListeners();
        },

        addUIListeners : function() {
            this.on("xChange", this.setXOffset, this, true);
            this.on("yChange", this.setYOffset, this, true);
            this.on("tickSize", this._uiSetTickSize, this, true);
            this.on("lockedChange", this._uiSetLock, this, true);

            this.on("render", this.syncUI, this, true);
        },

        syncUI : function() {
            this._uiSetTickSize();
            this._uiSetLock();
            this.setYOffset();
            this.setXOffset();
        },

        findCenter : function() {
            var t = this.getThumbEl();
            return {
                x: parseInt(t.offsetWidth/2, 10),
                y: parseInt(t.offsetHeight/2, 10) 
            };
        },

        moveThumb : function(x, y) {
            var curCoord = D.getXY(this.getThumbEl());
            var cp = this._centerPoint;

            if (!x && x !== 0) {
                x = curCoord[0] + cp.x;
            }
            if (!y && y !== 0) {
                y = curCoord[1] + cp.y;
            }
            this._dd.setDelta(cp.x, cp.y);

            if (this.fireEvent("beforeMove", [x, y, curCoord]) !== false) {
                this.move(x, y);
                this.fireEvent("move");
            }
        },

        move : function(x, y) {
            this._dd.setDragElPos(x, y);
            this._endMove();
        },

        // TODO: Setup as move listener
        _endMove : function() {
            this.parent._endMove();
        },

        _constrain : function(val, axis) {

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

        _uiSetTickSize : function() {
            if (this.get("tickSize") === 0) {
                this._dd.clearTicks();
            }
        },

        _uiSetLock : function() {
            var dd = this._dd;
            if (this.get("locked")) {
                dd.lock();
            } else {
                dd.unlock();
            }
        },

        _centerPoint : null,
        _dd : null
    });

    W.SliderThumb = SliderThumb;

})();
