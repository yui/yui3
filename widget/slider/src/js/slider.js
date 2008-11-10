var RAIL  = 'rail',
    THUMB = 'thumb',
    VALUE = 'value',
    MIN   = 'min',
    MAX   = 'max',
    THUMB_IMAGE = 'thumbImage',
    RAIL_WIDTH  = 'railWidth',
    RAIL_HEIGHT = 'railHeight',
    SLIDE_START = 'slideStart',
    SLIDE_END   = 'slideEnd',
    SYNC        = 'sync',
    THUMB_DRAG  = 'thumbDrag',
    VALUE_SET   = 'valueSet',
    RENDERED    = 'rendered',

    DOT    = '.',
    PX     = 'px',
    WIDTH  = 'width',
    HEIGHT = 'height',
    OFFSET_WIDTH  = 'offsetWidth',
    OFFSET_HEIGHT = 'offsetHeight',
    POSITION      = 'position',

    DIM_RE = /^\d+(?:p[xtc]|%|e[mx]|in|[mc]m)$/,

    L = Y.Lang,
    isArray  = L.isArray,
    isString = L.isString,
    isNumber = L.isNumber,
    
    M        = Math,
    round    = M.round,
    floor    = M.floor,
    ceil     = M.ceil,
    abs      = M.abs;

function Slider() {
    Slider.superclass.constructor.apply(this,arguments);
}

Y.mix(Slider, {

    NAME : 'slider',

    AXIS_KEYS : {
        x : {
            offsetEdge    : 'left',
            dim           : WIDTH,
            offAxisDim    : HEIGHT,
            axisDim       : RAIL_WIDTH,
            offsetDim     : OFFSET_WIDTH,
            posMethod     : 'getX',
            eventPageAxis : 'pageX',
            ddStick       : 'stickX',
            xyIndex       : 0
        },
        y : {
            offsetEdge    : 'top',
            dim           : HEIGHT,
            offAxisDim    : WIDTH,
            axisDim       : RAIL_HEIGHT,
            offsetDim     : OFFSET_HEIGHT,
            posMethod     : 'getY',
            eventPageAxis : 'pageY',
            ddStick       : 'stickY',
            xyIndex       : 1
        }
    },

    HTML_PARSER : {
        // implemented as functions due to a timing issue with instance-based
        // ClassNameManager
        rail : function (cb) {
            return cb.query(DOT+this.getClassName(RAIL));
        },
        thumb : function (cb) {
            return cb.quer(DOT+this.getClassName(THUMB));
        },
        thumbImage : function (cb) {
            return cb.query(DOT+this.getClassName(THUMB)+' img');
        }
    },

    ATTRS : {
        axis : {
            value : 'x',
            writeOnce : true,
            validator : function (v) {
                return this._validateNewAxis(v);
            },
            set : function (v) {
                return this._setAxisFn(v);
            }
        },

        min : {
            value : 0,
            validator : function (v) {
                return this._validateNewMin(v);
            }
        },

        max : {
            value : 100,
            validator : function (v) {
                return this._validateNewMax(v);
            }
        },

        value : {
            value : null,
            validator : function (v) {
                return this._validateNewValue(v);
            },
            set : function (v) {
                return this._setValueFn(v);
            }
        },

        rail : {
            value : null,
            set : function (v) {
                return this._setRailFn(v);
            }
        },

        thumb : {
            value : null,
            set : function (v) {
                return this._setThumbFn(v);
            }
        },

        thumbImage : {
            value : null,
            set : function (v) {
                return this._setThumbImageFn(v);
            }
        },

        railHeight : {
            value : '0',
            validator : function (v) {
                return this._validateNewRailHeight(v);
            }
        },

        railWidth : {
            value : '0',
            validator : function (v) {
                return this._validateNewRailWidth(v);
            }
        },

        backgroundEnabled : {
            value : true,
            validator : L.isBoolean
        }
    }
});

Y.extend(Slider, Y.Widget, {

    _key : null,

    _factor : 0.5,

    _tickSize : false,

    _railDims : null,

    _thumbDims : null,

    initializer : function () {
        this._key = Slider.AXIS_KEYS[this.get('axis')];

        this.after('minChange',    this._afterMinChange);
        this.after('maxChange',    this._afterMaxChange);

        this.after(this._key.axisDim+'Change', this._afterRailDimChange);

        this.publish(SLIDE_START);
        this.publish(SLIDE_END);
        this.publish(SYNC,      {defaultFn: this._doSyncUI});
        this.publish(VALUE_SET, {defaultFn: this._uiSetThumbPosition});
    },

    renderUI : function () {
        var img;

        this.initRail();

        this.initThumb();
    },

    initRail : function () {
        var cb   = this.get('contentBox'),
            rail = this.get(RAIL);

        // Create rail if necessary. Make sure it's in the contentBox
        if (!rail) {
            rail = cb.appendChild(
                Y.Node.create('<div class="'+
                    this.getClassName(RAIL)+'"></div>'));

            this.set(RAIL,rail);
        } else if (!cb.contains(rail)) {
            cb.appendChild(rail);
        }

        if ('absolute|relative'.indexOf(rail.getStyle(POSITION)) === -1) {
            rail.setStyle(POSITION,'relative');
        }
    },

    initThumb : function () {
        var rail    = this.get(RAIL),
            thumb   = this.get(THUMB);

        if (!thumb) {
            thumb = Y.Node.create(
                '<div class="'+this.getClassName(THUMB)+'"></div>');

            this.set(THUMB,thumb);
        }

        if (!rail.contains(thumb)) {
            rail.appendChild(thumb);
        }

        thumb.setStyle(POSITION,'absolute');

        if (this.get(THUMB_IMAGE)) {
            this.initThumbImage();
        }
    },

    initThumbImage : function () {
        var thumb = this.get(THUMB),
            img   = this.get(THUMB_IMAGE);

        if (img) {
            if (!thumb.contains(img)) {
                thumb.appendChild(img);
            }
        }
    },

    bindUI : function () {
        this.publish(THUMB_DRAG, {defaultFn: this._updateValueFromDD});

        this.initThumbDD();

        this.after('valueChange', this._afterValueChange);
    },

    initThumbDD : function () {
        this._dd = new Y.DD.Drag({
            node : this.get(THUMB),
            constrain2node : this.get(RAIL)
        });

        this._dd.on('drag:start', Y.bind(this._onDDStartDrag, this));
        this._dd.on('drag:drag',  Y.bind(this._onDDDrag,      this));
        this._dd.on('drag:end',   Y.bind(this._onDDEndDrag,   this));

        this._dd.set(this._key.ddStick, true);

        this._initBackgroundDD();
    },

    _initBackgroundDD : function () {
        var pageXY  = this._key.eventPageAxis,
            xyIndex = this._key.xyIndex,
            self    = this;

        // Temporary hack while dd doesn't support outer handles
        Y.on('mousedown',Y.bind(function (ev) {
            if (self.get('backgroundEnabled')) {
                var xy;

                if (this.get('primaryButtonOnly') && ev.button > 1) {
                    Y.log('Mousedown was not produced by the primary button',
                          'warn', 'dd-drag');
                    return false;
                }

                this._dragThreshMet = true;

                this._fixIEMouseDown();
                ev.halt();

                Y.DD.DDM.activeDrag = this;

                // Adjust registered starting position by half the thumb's x/y
                xy = this.get('dragNode').getXY();
                xy[xyIndex] += floor(self._thumbDims[self._key.xyIndex] / 2);

                this._setStartPosition(xy);

                this.start();
                this._moveNode([ev.pageX,ev.pageY]);
            }
        },this._dd),this.get(RAIL));
    },

    syncUI : function () {
        var img = this.get(THUMB_IMAGE), handler;

        if (!img || img.get('complete')) {
            this.fire(SYNC);
        } else {
            // Schedule the sync for when the image loads/errors
            handler = Y.bind(function () { this.fire(SYNC); }, this);
            img.on('load',handler);
            img.on('error',handler);
        }
    },

    _doSyncUI : function (e) {
        this._setRailDims();

        this._setThumbDims();

        this._setRailOffsetXY();

        this._setDDGutter();

        this._setConvFactor();

        this.set(VALUE,this.get(VALUE),{ddEvent:null});
    },

    _setRailDims : function () {
        var rail  = this.get(RAIL),
            thumb = this.get(THUMB),
            img   = this.get(THUMB_IMAGE),
            w     = this.get(RAIL_WIDTH),
            h     = this.get(RAIL_HEIGHT);

        if (parseInt(h,10)) {
            // Convert to pixels
            rail.setStyle(HEIGHT,h);
            h = rail.getComputedStyle(HEIGHT);
        } else {
            // offsetWidth fails in hidden containers
            h = ((this._isImageLoaded(img) && img.get(HEIGHT)) ||
                 parseInt(thumb.getComputedStyle(HEIGHT),10) ||
                 thumb.get(OFFSET_HEIGHT)) + PX;
        }

        rail.setStyle(HEIGHT, h);

        if (parseInt(w,10)) {
            // Convert to pixels
            rail.setStyle(WIDTH,w);
            w = rail.getComputedStyle(WIDTH);
        } else {
            // offsetHeight fails in hidden containers
            w = ((this._isImageLoaded(img) && img.get(WIDTH)) ||
                 parseInt(thumb.getComputedStyle(WIDTH),10) ||
                 thumb.get(OFFSET_WIDTH)) + PX;
        }

        rail.setStyle(WIDTH,w);

        this._railDims = [parseInt(w,10),parseInt(h,10)];
    },

    _setRailOffsetXY : function () {
        this._offsetXY = this.get(RAIL).getXY()[this._key.xyIndex] -
                         floor(this._thumbDims[this._key.xyIndex] / 2);
    },

    _setThumbDims : function () {
        var rail  = this.get(RAIL),
            thumb = this.get(THUMB),
            img   = this.get(THUMB_IMAGE),
            xy    = parseInt(rail.getComputedStyle(this._key.offAxisDim),10),
            w,h;

        // offsetWidth fails in hidden containers
        if (this._isImageLoaded(img)) {
            h = img.get(HEIGHT);
            w = img.get(WIDTH);
        } else {
            h = parseInt(thumb.getComputedStyle(HEIGHT),10) ||
                thumb.get(OFFSET_HEIGHT) || 
                xy;

            w = parseInt(thumb.getComputedStyle(WIDTH),10) ||
                thumb.get(OFFSET_WIDTH) || 
                xy;
        }

        thumb.setStyle(HEIGHT,h + PX);
        thumb.setStyle(WIDTH, w + PX);
        
        this._thumbDims = [w,h];
    },

    _setDDGutter : function () {
        var gutter = [0,0,0,0],
            i      = this._key.xyIndex,
            dim    = this._thumbDims[i] / 2,
            start  = -1 * floor(dim),
            end    = -1 * ceil(dim);

        if (i) { // y axis
            gutter[0] = start;
            gutter[2] = end;
        } else {
            gutter[3] = start;
            gutter[1] = end;
        }
            
        this._dd.set('gutter', gutter.join(' '));
    },

    _setConvFactor : function () {
        var range = this.get(MAX) - this.get(MIN),
            size  = this._railDims[this._key.xyIndex];// -
                    //this._thumbDims[this._key.xyIndex];

        this._factor = size ? range / size : 1;
    },

    getValue : function () {
        return this.get(VALUE);
    },

    // silent to omit firing slideStart and slideEnd
    setValue : function (val,silent) {
        this.set(VALUE,val,{omitEvents:silent});
    },

    _validateNewAxis : function (v) {
        return isString(v) &&
               v.length === 1 && 'xy'.indexOf(v.toLowerCase()) > -1;
    },

    _validateNewMin : function (v) {
        return isNumber(v);
    },

    _validateNewMax : function (v) {
        return isNumber(v);
    },

    _validateNewValue : function (v) {
        var min    = this.get(MIN),
            max    = this.get(MAX);

        return isNumber(v) &&
                (min < max ? (v >= min && v <= max) : (v >= max && v <= min));
    },

    _validateNewRailHeight : function (v) {
        return isString(v) && (v === '0' || DIM_RE.test(v));
    },

    _validateNewRailWidth : function (v) {
        return isString(v) && (v === '0' || DIM_RE.test(v));
    },

    _setAxisFn : function (v) {
        return v.toLowerCase();
    },

    _setValueFn : function (v) {
        if (!isNumber(v)) { 
            v = this.get(MIN);
        }

        return round(v);
    },

    _setRailFn : function (v) {
        return v ? Y.get(v) : null;
    },

    _setThumbFn : function (v) {
        return v ? Y.get(v) : null;
    },

    _setThumbImageFn : function (v) {
        return v ? Y.get(v) ||
                Y.Node.create('<img src="'+v+'" alt="Slider thumb">') :
                null;
    },

    _onDDStartDrag : function (e) {
        this._setRailOffsetXY();
        this.fire(SLIDE_START,{ddEvent:e});
    },

    _onDDDrag : function (e) {
        this.fire(THUMB_DRAG, { ddEvent: e });
    },

    _updateValueFromDD : function (e) {
        var before = this.get(VALUE),
            val    = e.ddEvent[this._key.eventPageAxis] - this._offsetXY;

        Y.log("Raw value: "+val+" Current value: "+before+
              "Factored value: "+round(this.get(MIN) + (val * this._factor)));

        val = round(this.get(MIN) + (val * this._factor));

        if (before !== val) {
            this.set(VALUE, val, {ddEvent:e.ddEvent});
        }
    },

    _onDDEndDrag : function (e) {
        this.fire(SLIDE_END,{ddEvent:e});
    },

    _uiSetThumbPosition : function (e) {
        var min = this.get(MIN),
            max = this.get(MAX),
            i   = this._key.xyIndex,
            v;

        v = round(((e.changeEv.newVal - min) / (max - min)) *
                this._railDims[i]) - floor(this._thumbDims[i] / 2);

        this.get(THUMB).setStyle(this._key.offsetEdge, v + PX);
    },

    _afterValueChange : function (e) {
        if (!e.ddEvent) {
            this.fire(VALUE_SET,{changeEv: e});
        }
        e.ddEvent = e.omitEvents = null;
    },

    _afterMinChange : function (e) {
        this._refresh(e);
    },

    _afterMaxChange : function (e) {
        this._refresh(e);
    },

    _afterRailDimChange : function (e) {
        this._refresh(e);
    },

    _refresh : function (e) {
        if (e.newVal !== e.prevVal && this.get(RENDERED)) {
            this.syncUI();
        }
    },

    // img load error detectable by:
    // !img.complete in IE
    // img.complete && img.naturalWidth == 0 in FF, Saf
    // img.complete && img.width == 0 in Opera
    _isImageLoaded : function (img) {
        var no = (!img || !img.get('complete')),w;

        if (!no) {
            w  = img.get('naturalWidth');
            no = w === undefined ? !img.get(WIDTH) : !w;
        }

        return !no;
    }

});

Y.Slider = Slider;
