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
            set : function(val) {
                if (val > 0) {
                    this._isHoriz = true;
                    if (this._isVert) {
                        this._isRegion = true;
                    }
                }
            },
            validator : Lang.isNumber,
            value : 0
        },

        'maxX' : {
            set : function(val) {
                if (val > 0) {
                    this._isHoriz = true;
                    if (this._isVert) {
                        this._isRegion = true;
                    }
                }
            },
            validator : Lang.isNumber,
            value : 0
        },

        'minY' : {
            set : function(val) {
                if (val > 0) {
                    this._isVert = true;
                    if (this._isHoriz) {
                        this._isRegion = true;
                    }
                }
            },
            validator : Lang.isNumber,
            value : 0
        },

        'maxY' : {
            set : function(val) {
                if (val > 0) {
                    this._isVert = true;
                    if (this._isHoriz) {
                        this._isRegion = true;
                    }
                }
            },
            validator : Lang.isNumber,
            value : 0
        },

        'tickSize' : {
            set : function (val) {
                if (val === 0 && this._dd) {
                    this._dd.clearTicks();
                }
            },
            validator : Lang.isNumber,
            value : 0
        },

        'x' : {
            validator : function(val) {
                var min = this.get("minX");
                var max = this.get("maxX");
                return (Lang.isNumber(val) && val >= min && val <= max);   
            },
            value : 0
        },

        'y' : {
            validator : function(val) {
                var min = this.get("minY");
                var max = this.get("maxY");
                return (Lang.isNumber(val) && val >= min && val <= max);
            },
            value : 0
        }
    };

    var wProto = {

        viewClass : SliderThumbView,
        controllerClass : SliderThumbController,

        initializer: function (attributes) {
            if (Lang.isUndefined(this.get("group"))) {
                throw "Required Attributes Missing";
            }
            this.initDragDrop();
        },

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

        clearTicks: function () {
            this.set("tickSize", 0);
        },

        lock : function() {
            this._dd.lock();
        },

        unlock : function() {
            this._dd.unlock();
        },

        getValue: function () {
            return (this._isHoriz) ? this.getXValue() : this.getYValue();
        },

        getXValue: function () {
            return this.get("x");
        },

        getYValue: function () {
            return this.get("y");
        },
        
        getXRange :  function() {
            return (this.get("maxX") - this.get("minX"));
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
            var ticks = (this._isHoriz) ? this._dd.xTicks : this._dd.yTicks;
            if (ticks && ticks.length) {
                return Math.round(360 / xTicks.length);
            }
        },

        endMove : function() {
            this.parent.endMove();
        },
        
        _isHoriz: false,
        _isVert: false,
        _isRegion: false,
        _dd : null
    };

    Lang.extend(SliderThumb, YAHOO.widget.Widget, wProto);

    function SliderThumbView(widget) {
        this.super(widget);
    }

    var vProto = {

        centerPoint : null,

        render : function() {
            this.centerPoint = this.getCenterPoint();

            this.widget._dd.setXConstraint(
                this.widget.get("minX"),
                this.widget.get("maxX"),
                this.widget.get("tickSize"));

            this.widget._dd.setYConstraint(
                this.widget.get("minY"),
                this.widget.get("maxY"),
                this.widget.get("tickSize"));
        },

        update : function() {
            this.setXOffset();
            this.setYOffset();
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

                var l = parseInt( Dom.getStyle(el, "left"), 10 );
                var t = parseInt( Dom.getStyle(el, "top" ), 10 );

                var deltaX = l - offset[0];
                var deltaY = t - offset[1];

                if (!isNaN(deltaX) && !isNaN(deltaY)) {
                    this.deltaOffset = [deltaX, deltaY];
                }
            } else {
                var left = parseInt( Dom.getStyle(el, "left"), 10 );
                var top  = parseInt( Dom.getStyle(el, "top" ), 10 );
    
                offset  = [left + this.deltaOffset[0], top + this.deltaOffset[1]];
            }

            return offset;
        },

        getXValue : function() {
            var x = this.getXOffset();
            var range = Dom.get(this.getParentId()).offsetWidth;
            var valRange = this.widget.getXRange();
            return (x * valRange)/range;
        },

        getYValue : function() {
            var y = this.getXOffset();
            var range = Dom.get(this.getParentId()).offsetHeight;
            var valRange = this.widget.getYRange();
            return (y * valRange)/range;
        },

        getXOffset : function() {
            var offset = this.getOffsetFromParent();
            return this.offset[0];
        },

        getYOffset : function() {
            var offset = this.getOffsetFromParent();
            return this.offset[1];
        },

        setXOffset : function() {
            this.moveThumb(this.getOffsetForX(), null, false, false);
        },

        setYOffset : function() {
            this.moveThumb(null, this.getOffsetForY(), false, false);
        },

        getOffsetForX : function(x) {
            var ratio = this.widget.getXRatio(x);
            var size = Dom.get(this.getParentId()).offsetWidth;
            var offset = Math.round(ratio*size) + this.centerPoint.x;

            var parentOffsetX = Dom.getXY(this.getParentId())[0];
            
            return parentOffsetX + offset;
        },

        getOffsetForY : function(y) {
            var ratio = this.widget.getYRatio(y);
            var size = Dom.get(this.getParentId()).offsetHeight;
            var offset = Math.round(ratio*size) + this.centerPoint.y;

            var parentOffsetY = Dom.getXY(this.getParentId())[1];
            return parentOffsetY + offset;
        },

        getCenterPoint : function() {
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

            thumb._dd.setDelta(this.centerPoint.x, this.centerPoint.y);

            var _p = thumb._dd.getTargetCoord(x, y);
            var p = [_p.x, _p.y];

            if (this.animate && t._graduated && !skipAnim) {
                t.lock();

                // cache the current thumb pos
                this.curCoord = curCoord;
                setTimeout( function() { thumbView.moveOneTick(p); }, thumb.get("tickPause"));

            } else if (this.animate && !skipAnim) {

                t.lock();

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
                thumb._dd.setDragElPos(x, y);
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
            } else if (t._isHoriz) {
                nextCoord = this._getNextX(this.curCoord, finalCoord);
            } else {
                nextCoord = this._getNextY(this.curCoord, finalCoord);
            }

            if (nextCoord) {
                // cache the position
                this.curCoord = nextCoord;
                thumb._dd.alignElWithMouse(this.getThumbEl(), nextCoord[0], nextCoord[1]);

                // check if we are in the final position, if not make a recursive call
                if (!(nextCoord[0] == finalCoord[0] && nextCoord[1] == finalCoord[1])) {
                    var self = thumbView;
                    setTimeout(function() { thumbView.moveOneTick(finalCoord); },  thumb.get("tickPause"));
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
                tmp = thumb._dd.getTargetCoord( curCoord[0] - thresh, curCoord[1] );
                nextCoord = [tmp.x, tmp.y];
            } else if (curCoord[0] < finalCoord[0]) {
                thresh = thumb.get("tickSize") + this.centerPoint.x;
                tmp = thumb._dd.getTargetCoord( curCoord[0] + thresh, curCoord[1] );
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
                tmp = thumb._dd.getTargetCoord( curCoord[0], curCoord[1] - thresh );
                nextCoord = [tmp.x, tmp.y];
            } else if (curCoord[1] < finalCoord[1]) {
                thresh = thumb.get("tickSize") + this.centerPoint.y;
                tmp = thumb._dd.getTargetCoord( curCoord[0], curCoord[1] + thresh );
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
        }
    };

    Lang.extend(SliderThumbView, YAHOO.widget.WidgetView, vProto);

    function SliderThumbController(widget, view) {
        this.super(widget, view);
    }

    var cProto = {

        apply : function() {
            this.applyViewUpdateListeners();
        },

        applyViewUpdateListeners : function() {
            this.widget.subscribe("xChange", this.view.setXOffset, this.view, true);
            this.widget.subscribe("yChange", this.view.setYOffset, this.view, true);
        }
    };

    Lang.extend(SliderThumbController, YAHOO.widget.WidgetController, cProto);

    YAHOO.widget.SliderThumb = SliderThumb;
    YAHOO.widget.SliderThumbView = SliderThumbView;
    YAHOO.widget.SliderThumbController = SliderThumbController;

})();
