YUI.add('dd-scroll', function(Y) {

    /**
     * The Drag & Drop Utility allows you to create a draggable interface efficiently, buffering you from browser-level abnormalities and enabling you to focus on the interesting logic surrounding your particular implementation. This component enables you to create a variety of standard draggable objects with just a few lines of code and then, using its extensive API, add your own specific implementation logic.
     * @module dd
     * @submodule dd-scroll
     */
    /**
     * This class extends the dd-drag module to add the ability to scroll the window.
     * @class DragScroll
     * @extends Drag
     * @constructor
     */

    var S = function() {
        S.superclass.constructor.apply(this, arguments);

    },
    SCROLL_TOP = 'scrollTop',
    SCROLL_LEFT = 'scrollLeft';
    S.NAME = 'DragScroll';
    

    S.ATTRS = {
        /**
        * @attribute scrollWindow
        * @description Turn on window scroll support
        * @type Boolean
        */
        windowScroll: {
            value: false
        },
        /**
        * @attribute buffer
        * @description The number of pixels from the edge of the screen to turn on scrolling. Default: 30
        * @type Number
        */
        buffer: {
            value: 30
        },
        /**
        * @attribute scrollDelay
        * @description The number of milliseconds delay to pass to the auto scroller. Default: 90
        * @type Number
        */
        scrollDelay: {
            value: 90
        }
    };

    Y.extend(S, Y.DD.Drag, {
        /**
        * @property _scrolling
        * @description Tells if we are actively scrolling or not.
        * @type Boolean
        */
        _scrolling: null,
        /**
        * @property _vpRegionCache
        * @description Cache of the Viewport dims.
        * @type Object
        */
        _vpRegionCache: null,
        /**
        * @property _dimCache
        * @description Cache of the dragNode dims.
        * @type Object
        */
        _dimCache: null,
        /**
        * @property _scrollTimer
        * @description Holder for the Timer object returned from Y.later.
        * @type {Y.later}
        */
        _scrollTimer: null,
        /**
        * @private
        * @method _getVPRegion
        * @description Sets the _vpRegionCache property with an Object containing the dims from the viewport.
        */        
        _getVPRegion: function() {
            var r = {};
            if (!this._vpRegionCache) {
                var n = Y.Node.get(window),
                b = this.get('buffer');

                r = {
                    top: n.get(SCROLL_TOP) + b,
                    right: n.get('winWidth') + n.get(SCROLL_LEFT) - b,
                    bottom: (n.get('winHeight') + n.get(SCROLL_TOP)) - b,
                    left: n.get(SCROLL_LEFT) + b
                };
                this._vpRegionCache = r;
            } else {
                r = this._vpRegionCache;
            }
            return r;
        },
        initializer: function() {
            Y.Node.get(window).on('scroll', function() {
                this._vpRegionCache = null;
            }, this);
        },
        /**
        * @private
        * @method _checkWinScroll
        * @description Check to see if we need to fire the scroll timer. If scroll timer is running this will scroll the window.
        * @param {Boolean} move Should we move the window. From Y.later
        */        
        _checkWinScroll: function(move) {
            var r = this._getVPRegion(),
                xy = this.realXY,
                scroll = false,
                b = this.get('buffer'),
                win = Y.Node.get(window),
                sTop = win.get(SCROLL_TOP),
                sLeft = win.get(SCROLL_LEFT),
                w = this._dimCache.w,
                h = this._dimCache.h,
                bottom = this.realXY[1] + h,
                top = this.realXY[1],
                right = this.realXY[0] + w,
                left = this.realXY[0],
                nt = xy[1],
                nl = xy[0],
                st = sTop,
                sl = sLeft;

            if (left <= r.left) {
                scroll = true;
                nl = xy[0] - b;
                sl = sLeft - b;
            }
            if (right >= r.right) {
                scroll = true;
                nl = xy[0] + b;
                sl = sLeft + b;
            }
            if (bottom >= r.bottom) {
                scroll = true;
                nt = xy[1] + b;
                st = sTop + b;
            }
            if (top <= r.top) {
                scroll = true;
                nt = xy[1] - b;
                st = sTop - b;
            }
            if (nt < 0) {
                nt = xy[1];
            }
            if (nl < 0) {
                nl = xy[0];
            }
            if (move) {
                this._moveNode([nl, nt]);
                win.set(SCROLL_TOP, st);
                win.set(SCROLL_LEFT, sl);
            } else {
                if (scroll) {
                    this._initScroll();
                } else {
                    this._cancelScroll();
                }
            }
        },
        /**
        * @private
        * @method _initScroll
        * @description Cancel a previous scroll timer and init a new one.
        */        
        _initScroll: function() {
            this._cancelScroll();
            this._scrollTimer = Y.Lang.later(this.get('scrollDelay'), this, this._checkWinScroll, [true], true);

        },
        /**
        * @private
        * @method _cancelScroll
        * @description Cancel a currently running scroll timer.
        */        
        _cancelScroll: function() {
            this._scrolling = false;
            if (this._scrollTimer) {
                this._scrollTimer.cancel();
                this._scrollTimer = false;
            }
        },
        _align: function(xy) {
            if (this._scrolling) {
                this._cancelScroll();
            } else {
                //Only call align if we are not scrolling..
                xy = S.superclass._align.apply(this, arguments);
            }
            if (this.get('windowScroll')) {
                if (!this._scrolling) {
                    this._checkWinScroll();
                }
            }
            return xy;
        },
        /**
        * @private
        * @method _setDimCache
        * @description Set the cache of the dragNode dims.
        */        
        _setDimCache: function() {
            var node = this.get('dragNode');
            this._dimCache = {
                h: node.get('offsetHeight'),
                w: node.get('offsetWidth')
            };
        },
        start: function() {
            S.superclass.start.apply(this, arguments);
            this._setDimCache();
        },
        end: function(xy) {
            this._dimCache = null;
            this._cancelScroll();
            S.superclass.end.apply(this, arguments);
            return this;
        },
        /**
        * @method toString
        * @description General toString method for logging
        * @return String name for the object
        */
        toString: function() {
            return S.NAME + ' #' + this.get('node').get('id');
        }
    });
    Y.DD.DragScroll = S;

}, '3.0.0', { requires: ['dd-drag'] });
