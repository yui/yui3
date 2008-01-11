(function() {

    var Y = YAHOO,
        U = Y.util,
        L = Y.lang;

    // TODO: Is this a plugin for Slider or SliderThumb. The code really works 
    // with SliderThumb more than Slider but it's easier for the user to bind it 
    // to a Slider impl
    function AnimatedSlider(config) {
        this.constructor.superclass.constructor.apply(this, arguments);
    }

    AnimatedSlider.CONFIG = {
        tickPause: {
            value: 40
        },
        animate: {
            value: !L.isUndefined(U.Anim)
        },
        duration: {
            value: 0.2
        },
        name: { // PluginBase
            value: 'anim'
        }
    };

    L.extend(AnimatedSlider, YAHOO.plugin.PluginBase, {

        initializer : function() {
            this._slider = this.get("owner");
            this._thumb = this._slider.getThumb();

            this.listen(this._thumb, 'beforeMove', this.move, this, true);
        },

        move : function(args) {

            var x = args[0];
            var y = args[1];
            var curCoord = args[2];

            var animate = this.get("animate") && !L.isUndefined(U.Anim);

            if (animate) {

                var plugin = this,
                    thumb = this._thumb,
                    slider = this._slider,
                    duration = this.get("duration"),
                    tickPause = this.get("tickPause"),
                    tickSize = thumb.get("tickSize"),
                    tId = thumb.getThumbEl().id,
                    dd = this._dd;

                var fc = thumb._dd.getTargetCoord(x, y),
                    finalCoord = [fc.x, fc.y];

                thumb.lock();

                if (tickSize > 0) {
                    // cache the current this pos
                    this._curCoord = curCoord;
                    setTimeout( function() { plugin._moveOneTick(finalCoord); }, tickPause);
                } else {
                    var anim = new U.Motion( tId, { points: { to: finalCoord } },
                                                duration,
                                                U.Easing.easeOut );

                    anim.onComplete.subscribe(this._onAnimComplete, this, true);
                    anim.animate();
                }
                // Stop default move
                return false;
            } else {
                // Execute default move
                return true;
            }
        },

        _onAnimComplete : function() { 
            this.get("owner").getThumb()._endMove();
            thumb.fireEvent("move");
        },

        _moveOneTick: function(finalCoord) {
            var nextCoord,
                thumb = this._thumb,
                slider = this._slider;

            if (slider._isRegion) {
                nextCoord = this._getNextX(this._curCoord, finalCoord);
                var tmpX = (nextCoord) ? nextCoord[0] : this._curCoord[0];
                nextCoord = this._getNextY([tmpX, this._curCoord[1]], finalCoord);
            } else if (slider._isVert) {
                nextCoord = this._getNextY(this._curCoord, finalCoord);
            } else {
                nextCoord = this._getNextX(this._curCoord, finalCoord);
            }

            if (nextCoord) {
                // cache the position
                this._curCoord = nextCoord;
                thumb._dd.alignElWithMouse(thumb.getThumbEl(), nextCoord[0], nextCoord[1]);

                // check if we are in the final position, if not make a recursive call
                if (!(nextCoord[0] == finalCoord[0] && nextCoord[1] == finalCoord[1])) {
                    var self = this;
                    setTimeout(function() { self._moveOneTick(finalCoord); },  this.get("tickPause"));
                } else {
                    thumb._endMove();
                    thumb.fireEvent("move");
                }
            } else {
                thumb._endMove();
                thumb.fireEvent("move");                
            }
        },

        _getNextX: function(curCoord, finalCoord) {
            var thresh, 
                tmp = [],
                nextCoord = null,
                thumb = this._thumb,
                slider = this._slider,
                cp = thumb._centerPoint,
                ts = thumb.get("tickSize"),
                dd = thumb._dd;

            if (curCoord[0] > finalCoord[0]) {
                thresh = 2*ts - cp.x;
                tmp = dd.getTargetCoord( curCoord[0] - thresh, curCoord[1] );
                nextCoord = [tmp.x, tmp.y];
            } else if (curCoord[0] < finalCoord[0]) {
                thresh = ts + cp.x;
                tmp = dd.getTargetCoord( curCoord[0] + thresh, curCoord[1] );
                nextCoord = [tmp.x, tmp.y];
            } else {
                // equal, do nothing
            }

            return nextCoord;
        },

        _getNextY: function(curCoord, finalCoord) {
            var thresh,
                tmp = [],
                nextCoord = null,
                thumb = this._thumb,
                slider = this._slider,
                cp = thumb._centerPoint,
                ts = thumb.get("tickSize"),
                dd = thumb._dd;

            if (curCoord[1] > finalCoord[1]) {
                thresh = 2*ts - cp.y;
                tmp = dd.getTargetCoord( curCoord[0], curCoord[1] - thresh );
                nextCoord = [tmp.x, tmp.y];
            } else if (curCoord[1] < finalCoord[1]) {
                thresh = ts + cp.y;
                tmp = dd.getTargetCoord( curCoord[0], curCoord[1] + thresh );
                nextCoord = [tmp.x, tmp.y];
            } else {
                // equal, do nothing
            }
            return nextCoord;
        },

        _curCoord : null,

        _thumb : null,
        _slider : null
    });

    YAHOO.plugin.AnimatedSlider = AnimatedSlider;
})();