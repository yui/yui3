YUI.add('dd-scroll', function(Y) {
    var S = function() {
        S.superclass.constructor.apply(this, arguments);

    };
    S.NAME = 'DragScroll';
    

    S.ATTRS = {
        windowScroll: {
            value: false
        },
        buffer: {
            value: 30
        }
    };

    Y.extend(S, Y.DD.Drag, {
        _scrollTimer: null,
        _getVPRegion: function() {
            var n = Y.Node.get('body'),
            r = {
                top: n.get('docScrollX'),
                right: n.get('winWidth') + n.get('docScrollY'),
                bottom: (n.get('winHeight') + n.get('docScrollX')),
                left: n.get('docScrollY')
            };
            return r;
        },
        _scrollWindow: function(l, t) {
            //TODO
            this._scrollTimer = Y.Lang.later(0, this, function(l, t) {
                console.log('scrollTo:: ' + l + ' ' + t);
                window.scrollTo(l, t);
            }, [l, t]);

        },
        _checkWinScroll: function(xy) {
            var r = this._getVPRegion(),
                scroll = false,
                buffer = this.get('buffer'),
                sTop = this.get('dragNode').get('docScrollX'),
                sLeft = this.get('dragNode').get('docScrollY'),
                t = sTop, l = sLeft,
                bottom = this.lastXY[1] + sTop + this.get('dragNode').get('offsetHeight') + buffer,
                top = this.lastXY[1] + sTop - buffer,
                right = this.lastXY[0] + sLeft + this.get('dragNode').get('offsetWidth') + buffer,
                left = this.lastXY[0] + sLeft - buffer;

            if (left <= r.left) {
                l = (sLeft - this.get('dragNode').get('offsetWidth') - buffer);
                scroll = true;
                if (l < 0) {
                    l = 0;
                }
            }
            if (right >= r.right) {
                l = (sLeft + this.get('dragNode').get('offsetWidth') + buffer);
                scroll = true;
            }
            if (bottom >= r.bottom) {
                t = (sTop + this.get('dragNode').get('offsetHeight') + buffer);
                scroll = true;
            }
            if (top <= r.top) {
                t = (sTop - this.get('dragNode').get('offsetHeight') - buffer);
                scroll = true;
                if (t < 0) {
                    t = 0;
                }
            }

            if (scroll) {
                l = 0;
                this._scrollWindow(l, t);
                console.log(xy[1], sTop, t, (xy[1] + t - sTop));
                console.log(xy[0], sLeft , l, (xy[0] + l - sLeft));
                xy[1] = xy[1] + t;
                xy[0] = xy[0] + l;
            }
            return xy;
        },
        _align: function(xy) {
            var _xy = S.superclass._align.apply(this, arguments);
            if (this.get('windowScroll')) {
                _xy = this._checkWinScroll(_xy);
            }
            return _xy;
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
