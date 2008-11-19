YUI.add('slider', function(Y) {

/**
 * @class Slider
 */

var SLIDER = 'slider',
    RAIL   = 'rail',
    THUMB  = 'thumb',
    VALUE  = 'value',
    MIN    = 'min',
    MAX    = 'max',
    THUMB_IMAGE = 'thumbImage',
    RAIL_SIZE   = 'railSize',
    CONTENT_BOX = 'contentBox',

    SLIDE_START = 'slideStart',
    SLIDE_END   = 'slideEnd',

    THUMB_DRAG  = 'thumbDrag',
    SYNC        = 'sync',
    VALUE_SET   = 'valueSet',
    RENDERED    = 'rendered',
    DISABLED    = 'disabled',
    DISABLED_CHANGE = 'disabledChange',

    DOT      = '.',
    PX       = 'px',
    WIDTH    = 'width',
    HEIGHT   = 'height',
    COMPLETE = 'complete',

    L = Y.Lang,
    isArray  = L.isArray,
    isBoolean= L.isBoolean,
    isString = L.isString,
    isNumber = L.isNumber,
    
    getCN    = Y.ClassNameManager.getClassName,

    IMAGE         = 'image',
    C_RAIL        = getCN(SLIDER,RAIL),
    C_THUMB       = getCN(SLIDER,THUMB),
    C_THUMB_IMAGE = getCN(SLIDER,THUMB,IMAGE),
    C_IMAGE_ERROR = getCN(SLIDER,IMAGE,'error'),

    M        = Math,
    max      = M.max,
    round    = M.round,
    floor    = M.floor,
    ceil     = M.ceil,
    abs      = M.abs;

function Slider() {
    Slider.superclass.constructor.apply(this,arguments);
}

Y.mix(Slider, {

    NAME : SLIDER,

    AXIS_KEYS : {
        x : {
            offsetEdge    : 'left',
            dim           : WIDTH,
            offAxisDim    : HEIGHT,
            eventPageAxis : 'pageX',
            ddStick       : 'stickX',
            xyIndex       : 0
        },
        y : {
            offsetEdge    : 'top',
            dim           : HEIGHT,
            offAxisDim    : WIDTH,
            eventPageAxis : 'pageY',
            ddStick       : 'stickY',
            xyIndex       : 1
        }
    },

    HTML_PARSER : {
        rail       : DOT + C_RAIL,
        thumb      : DOT + C_THUMB,
        thumbImage : DOT + C_THUMB_IMAGE
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
            validator : function (v) {
                return this._validateNewRail(v);
            },
            set : function (v) {
                return this._setRailFn(v);
            }
        },

        thumb : {
            value : null,
            validator : function (v) {
                return this._validateNewThumb(v);
            },
            set : function (v) {
                return this._setThumbFn(v);
            }
        },

        thumbImage : {
            value : null,
            validator : function (v) {
                return this._validateNewThumbImage(v);
            },
            set : function (v) {
                return this._setThumbImageFn(v);
            }
        },

        railSize : {
            value : '0',
            validator : function (v) {
                return this._validateNewRailSize(v);
            }
        },

        railEnabled : {
            value : true,
            validator : isBoolean
        }
    }
});

Y.extend(Slider, Y.Widget, {

    _key : null,

    _factor : 1,

    _railSize : null,

    _thumbSize : null,

    _thumbOffset : 0,

    _stall : false,

    _disabled : false,

    initializer : function () {
        this._key = Slider.AXIS_KEYS[this.get('axis')];

        this.after('minChange',    this._afterMinChange);
        this.after('maxChange',    this._afterMaxChange);

        this.after('railSizeChange', this._afterRailSizeChange);

        this.publish(SLIDE_START);
        this.publish(SLIDE_END);

        this.publish(SYNC,       {defaultFn: this._defSyncUI});
        this.publish(VALUE_SET,  {defaultFn: this._defSetThumbPosition});
    },

    renderUI : function () {
        this._initRail();
        this._initThumb();
    },

    _initRail : function () {
        var cb   = this.get(CONTENT_BOX),
            rail = this.get(RAIL);

        // Create rail if necessary. Make sure it's in the contentBox
        if (!rail) {
            rail = cb.appendChild(
                Y.Node.create('<div class="'+C_RAIL+'"></div>'));

            this.set(RAIL,rail);
        } else if (!cb.contains(rail)) {
            cb.appendChild(rail);
        }

        rail.addClass(C_RAIL);
        rail.addClass(this.getClassName(RAIL,this.get('axis')));
    },

    _initThumb : function () {
        var rail    = this.get(RAIL),
            thumb   = this.get(THUMB);

        // Passed an img element as the thumb
        if (thumb && !this.get(THUMB_IMAGE) &&
            thumb.get('nodeName').toLowerCase() === 'img') {
            this.set(THUMB_IMAGE, thumb);
            this.set(THUMB,null);
            thumb = null;
        }

        if (!thumb) {
            thumb = Y.Node.create(
                '<div class="'+C_THUMB+'"></div>');

            this.set(THUMB,thumb);
        }

        thumb.addClass(C_THUMB);

        if (!rail.contains(thumb)) {
            rail.appendChild(thumb);
        }

        if (this.get(THUMB_IMAGE)) {
            this._initThumbImage();
        }
    },

    _initThumbImage : function () {
        var thumb = this.get(THUMB),
            img   = this.get(THUMB_IMAGE);

        if (img) {
            img.replaceClass(C_THUMB,C_THUMB_IMAGE);

            if (!thumb.contains(img)) {
                thumb.appendChild(img);
            }
        }
    },

    bindUI : function () {
        this.publish(THUMB_DRAG, {defaultFn: this._defUpdateValueFromDD});

        this._bindThumbDD();

        this.after('valueChange',      this._afterValueChange);
        this.after('thumbImageChange', this._afterThumbImageChange);
        this.after(DISABLED_CHANGE,   this._afterDisabledChange);
    },

    _bindThumbDD : function () {
        var ddConf = {
                node           : this.get(THUMB),
                constrain2node : this.get(RAIL)
            },
            dd;

        ddConf[this._key.ddStick] = true;

        this._dd = dd = new Y.DD.Drag(ddConf);
        dd.on('drag:start', Y.bind(this._onDDStartDrag, this));
        dd.on('drag:drag',  Y.bind(this._onDDDrag,      this));
        dd.on('drag:end',   Y.bind(this._onDDEndDrag,   this));

        this._initRailDD();
    },

    _initRailDD : function () {
        this.get(RAIL).on('mousedown',Y.bind(this._handleRailMouseDown,this));
    },

    // Parrot most of dd's onMouseDown behavior and manually move the
    // thumb node to the click location.  DD will take over from there.
    _handleRailMouseDown : function (e) {
        if (this.get('railEnabled') && !this.get(DISABLED)) {
            var dd      = this._dd,
                xyIndex = this._key.xyIndex,
                xy;

            if (dd.get('primaryButtonOnly') && e.button > 1) {
                Y.log('Mousedown was not produced by the primary button',
                      'warn', 'dd-drag');
                return false;
            }

            dd._dragThreshMet = true;

            dd._fixIEMouseDown();
            e.halt();

            Y.DD.DDM.activeDrag = dd;

            // Adjust registered starting position by half the thumb's x/y
            xy = dd.get('dragNode').getXY();
            xy[xyIndex] += this._thumbOffset;

            dd._setStartPosition(xy);

            dd.start();
            dd._moveNode([e.pageX,e.pageY]);
        }
    },

    syncUI : function () {
        var img = this.get(THUMB_IMAGE);

        if (this._isImageLoading(img)) {
            // Schedule the sync for when the image loads/errors
            this._scheduleSync();
        } else {
            this._ready(img);
        }
    },

    _scheduleSync : function () {
        var img, handler;

        if (!this._stall) {
            // disable the control until the image is loaded
            this._disabled = this.get(DISABLED);
            this.set(DISABLED,true);
            this._stall    = this.on(DISABLED_CHANGE,this._stallDisabledChange);

            img     = this.get(THUMB_IMAGE);
            handler = Y.bind(this._imageLoaded,this,img);
            img.on('load', handler);
            img.on('error',handler);
        }
    },

    _stallDisabledChange : function (e) {
        this._disabled = e.newVal;
        e.preventDefault();
    },

    _imageLoaded : function (e,img) {
        if (this._stall) {
            this._stall.detach();
        }

        this._stall = false;

        this._ready(img);

        this.set(DISABLED,this._disabled);
    },

    _ready : function (img) {
        // _isImageLoaded may return false because this is executed from the
        // image's onerror handler as well.
        var method = img && this._isImageLoaded(img) ?
                        'removeClass' : 'addClass';

        // If the thumb image url results in 404, assign a class to provide
        // default thumb dimensions/UI
        this.get(CONTENT_BOX)[method](C_IMAGE_ERROR);

        this.fire(SYNC);
    },

    _defSyncUI : function (e) {
        this._uiSetThumbSize();

        this._setThumbOffset();

        this._uiSetRailSize();

        this._setRailOffsetXY();

        this._setDDGutter();

        this._setFactor();

        this.set(VALUE,this.get(VALUE));
    },

    _uiSetThumbSize : function () {
        var thumb = this.get(THUMB),
            dim   = this._key.dim,
            img   = this.get(THUMB_IMAGE),
            size;

        // offsetWidth fails in hidden containers
        size = parseInt(thumb.getComputedStyle(dim),10);

        if (img && this._isImageLoaded(img)) {
            size = max(img.get(dim), size);
        }

        this._thumbSize = size;
    },

    _setThumbOffset : function () {
        this._thumbOffset = floor(this._thumbSize / 2);
    },

    _uiSetRailSize : function () {
        var rail  = this.get(RAIL),
            thumb = this.get(THUMB),
            img   = this.get(THUMB_IMAGE),
            dim   = this._key.dim,
            size  = this.get(RAIL_SIZE),
            setxy = false;

        if (parseInt(size,10)) {
            // Convert to pixels
            rail.setStyle(dim,size);
            size = parseInt(rail.getComputedStyle(dim),10);
        } else {
            // Default from height or width (axis respective), or dims assigned
            // via css to the rail or thumb, whichever is largest.
            // Dear implementers, please use railSize, not height/width to
            // set the rail dims
            size = this.get(dim);
            if (parseInt(size,10)) {
                setxy = true;
                rail.setStyle(dim,size);
                size = parseInt(rail.getComputedStyle(dim),10);
            }
            size = max(
                    size|0,
                    parseInt(thumb.getComputedStyle(dim),10),
                    parseInt(rail.getComputedStyle(dim),10));

            if (img && this._isImageLoaded(img)) {
                size = max(img.get(dim),size);
            }
        }

        rail.setStyle(dim, size + PX);

        this._railSize = size;

        // handle the (not recommended) fallback case of setting rail size via
        // widget height/width params.  This is the only case that sets the
        // off-axis rail dim in the code.
        if (setxy) {
            dim = this._key.offAxisDim;
            size = this.get(dim);
            if (size) {
                rail.set(dim,size);
            }
        }
    },

    _setRailOffsetXY : function () {
        this._offsetXY = this.get(RAIL).getXY()[this._key.xyIndex] -
                         this._thumbOffset;
    },

    _setDDGutter : function () {
        var gutter = [0,0,0,0],
            i      = this._key.xyIndex,
            dim    = this._thumbOffset,
            start  = -dim,
            end    = -1 * (this._thumbSize - dim);

        if (i) { // y axis
            gutter[0] = start;
            gutter[2] = end;
        } else {
            gutter[3] = start;
            gutter[1] = end;
        }
            
        this._dd.set('gutter', gutter.join(' '));
    },

    _setFactor : function () {
        this._factor = this._railSize ?
            (this.get(MAX) - this.get(MIN)) / this._railSize :
            1;
    },

    getValue : function () {
        return this.get(VALUE);
    },

    setValue : function (val) {
        this.set(VALUE,val);
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

        return !this.get(DISABLED) && isNumber(v) &&
                (min < max ? (v >= min && v <= max) : (v >= max && v <= min));
    },

    _validateNewRail : function (v) {
        return !this.get(RENDERED) || v;
    },

    _validateNewThumb : function (v) {
        return !this.get(RENDERED) || v;
    },

    _validateNewThumbImage : function (v) {
        return !this.get(RENDERED) || v;
    },

    _validateNewRailSize : function (v) {
        return isString(v) &&
            (v === '0' || /^\d+(?:p[xtc]|%|e[mx]|in|[mc]m)$/.test(v));
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
        this.fire(SLIDE_START,{ ddEvent: e });
    },

    _onDDDrag : function (e) {
        this.fire(THUMB_DRAG, { ddEvent: e });
    },

    _defUpdateValueFromDD : function (e) {
        var before = this.get(VALUE),
            val    = e.ddEvent[this._key.eventPageAxis] - this._offsetXY;

        Y.log("Raw value: "+val+" Current value: "+before+
              "Factored value: "+round(this.get(MIN) + (val * this._factor)));

        val = round(this.get(MIN) + (val * this._factor));

        if (before !== val) {
            this.set(VALUE, val, { ddEvent: e.ddEvent });
        }
    },

    _onDDEndDrag : function (e) {
        this.fire(SLIDE_END,{ ddEvent: e });
    },




    _defSetThumbPosition : function (e) {
        var min = this.get(MIN),
            max = this.get(MAX),
            v   = e.changeEv.newVal;

        v = round(((v - min) / (max - min)) * this._railSize);

        this._uiPositionThumb(v);
    },

    _uiPositionThumb : function (xy) {
        var dd  = this._dd;

        xy += this._offsetXY;

        dd._setStartPosition(dd.get('dragNode').getXY());

        // stickX/stickY config on DD instance will negate off-axis move
        dd._moveNode([xy,xy]);
    },



    _afterValueChange : function (e) {
        if (!e.ddEvent) {
            this.fire(VALUE_SET,{ changeEv: e });
        }
    },

    _afterThumbChange : function (e) {
        var thumb;

        if (this.get(RENDERED)) {
            if (e.prevValue) {
                e.prevValue.get('parentNode').removeChild(e.prevValue);
            }

            this._initThumb();
            
            thumb = this.get(THUMB);
            this._dd.set('node',thumb);
            this._dd.set('dragNode',thumb);

            this.syncUI();
        }
    },

    _afterThumbImageChange : function (e) {
        if (this.get(RENDERED)) {
            if (e.prevValue) {
                e.prevValue.get('parentNode').removeChild(e.prevValue);
            }

            this._initThumbImage();
            
            this.syncUI();
        }
    },

    _afterMinChange : function (e) {
        this._refresh(e);
    },

    _afterMaxChange : function (e) {
        this._refresh(e);
    },

    _afterRailSizeChange : function (e) {
        this._refresh(e);
    },

    _afterDisabledChange : function (e) {
        if (this._dd) {
            this._dd.set('lock',e.newVal);
        }
    },

    _refresh : function (e) {
        if (e.newVal !== e.prevVal && this.get(RENDERED)) {
            this.syncUI();
        }
    },

    // Used to determine if there will is a current or pending request for the
    // image resource.
    _isImageLoading : function (img) {
        return img && !img.get(COMPLETE);
    },

    // Used to determine if the image resource arrived successfully or there was
    // an error.
    // img load error detectable by:
    // !img.complete in IE
    // img.complete && img.naturalWidth == 0 in FF, Saf
    // img.complete && img.width == 0 in Opera
    _isImageLoaded : function (img) {
        if (img) {
            var w = img.get('naturalWidth');
            return img.get(COMPLETE) && (w === undefined ? img.get(WIDTH) : w);
        }

        return true;
    }

});

Y.Slider = Slider;


}, '@VERSION@' ,{requires:['widget','dd-constrain']});
