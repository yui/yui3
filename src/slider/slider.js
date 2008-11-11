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

    SLIDE_START = 'slideStart',
    SLIDE_END   = 'slideEnd',

    THUMB_DRAG  = 'thumbDrag',
    SYNC        = 'sync',
    VALUE_SET   = 'valueSet',
    RENDERED    = 'rendered',
    READY       = 'ready',

    DOT    = '.',
    PX     = 'px',
    WIDTH  = 'width',
    HEIGHT = 'height',
    OFFSET_WIDTH  = 'offsetWidth',
    OFFSET_HEIGHT = 'offsetHeight',
    POSITION      = 'position',

    L = Y.Lang,
    isArray  = L.isArray,
    isBoolean= L.isBoolean,
    isString = L.isString,
    isNumber = L.isNumber,
    
    CNM      = Y.ClassNameManager,

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
            offsetDim     : OFFSET_HEIGHT,
            posMethod     : 'getY',
            eventPageAxis : 'pageY',
            ddStick       : 'stickY',
            xyIndex       : 1
        }
    },

    HTML_PARSER : {
        rail       : CNM.getClassName(SLIDER,RAIL),
        thumb      : CNM.getClassName(SLIDER,THUMB),
        thumbImage : CNM.getClassName(SLIDER,THUMB_IMAGE)
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

        railSize : {
            value : '0',
            validator : function (v) {
                return this._validateNewRailSize(v);
            }
        },

        railEnabled : {
            value : true,
            validator : isBoolean
        },

        ready : {
            value : false,
            readOnly : true,
            validator : isBoolean
        }
    }
});

Y.extend(Slider, Y.Widget, {

    _key : null,

    _factor : 1,

    _railSize : null,

    _thumbSize : null,

    _loading : false,

    initializer : function () {
        this._key = Slider.AXIS_KEYS[this.get('axis')];

        this.after('minChange',    this._afterMinChange);
        this.after('maxChange',    this._afterMaxChange);

        this.after('railSizeChange', this._afterRailSizeChange);

        this.publish(SLIDE_START);
        this.publish(SLIDE_END);

        this.publish(SYNC,       {defaultFn: this._defSyncUI});
        this.publish(VALUE_SET,  {defaultFn: this._defSetThumbPosition});

        this.publish(READY);
    },

    renderUI : function () {
        this._initRail();
        this._initThumb();
    },

    _initRail : function () {
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

        rail.addClass(this.getClassName(RAIL));
        rail.addClass(this.getClassName(RAIL,this.get('axis')));

        // TODO: revisit, move to CSS
        if ('absolute|relative'.indexOf(rail.getStyle(POSITION)) === -1) {
            rail.setStyle(POSITION,'relative');
        }
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
                '<div class="'+this.getClassName(THUMB)+'"></div>');

            this.set(THUMB,thumb);
        }

        thumb.addClass(this.getClassName(THUMB));

        if (!rail.contains(thumb)) {
            rail.appendChild(thumb);
        }

        // TODO: revisit, move to css
        thumb.setStyle(POSITION,'absolute');

        if (this.get(THUMB_IMAGE)) {
            this._initThumbImage();
        }
    },

    _initThumbImage : function () {
        var thumb = this.get(THUMB),
            img   = this.get(THUMB_IMAGE);

        if (img) {
            if (!thumb.contains(img)) {
                thumb.appendChild(img);
            }
        }
    },

    bindUI : function () {
        this.publish(THUMB_DRAG, {defaultFn: this._defUpdateValueFromDD});

        this._bindThumbDD();

        this.after('valueChange', this._afterValueChange);
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
        if (this.get('railEnabled')) {
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
            xy[xyIndex] += floor(this._thumbSize / 2);

            dd._setStartPosition(xy);

            dd.start();
            dd._moveNode([e.pageX,e.pageY]);
        }
    },

    syncUI : function () {
        var img = this.get(THUMB_IMAGE);

        if (!img || img.get('complete')) {
            this._ready();
        } else {
            // Schedule the sync for when the image loads/errors
            this._scheduleSync();
        }
    },

    _scheduleSync : function () {
        var img = this.get(THUMB_IMAGE), handler;

        if (!this._loading) {
            this._loading = true;

            handler = Y.bind(this._ready,this);
            img.on('load',handler);
            img.on('error',handler);
        }
    },

    _ready : function () {
        this.fire(SYNC);
        this._loading = false;

        if (!this.get(READY)) {
            this.fire(READY);
            this._set(READY,true);
        }
    },

    _defSyncUI : function (e) {
        this._setRailSize();

        this._setThumbSize();

        this._setRailOffsetXY();

        this._setDDGutter();

        this._setFactor();

        this.set(VALUE,this.get(VALUE),{ddEvent:null});
    },

    _setRailSize : function () {
        var rail  = this.get(RAIL),
            thumb = this.get(THUMB),
            img   = this.get(THUMB_IMAGE),
            dim   = this._key.dim,
            size  = this.get(RAIL_SIZE);

        if (parseInt(size,10)) {
            // Convert to pixels
            rail.setStyle(dim,size);
            size = parseInt(rail.getComputedStyle(dim),10);
        } else {
            size = max(
                    parseInt(thumb.getComputedStyle(dim),10),
                    parseInt(rail.getComputedStyle(dim),10));

            if (this._isImageLoaded(img)) {
                size = max(img.get(dim),size);
            }
        }

        rail.setStyle(dim, size + PX);

        this._railSize = size;
    },

    _setRailOffsetXY : function () {
        this._offsetXY = this.get(RAIL).getXY()[this._key.xyIndex] -
                         floor(this._thumbSize / 2);
    },

    _setThumbSize : function () {
        var rail  = this.get(RAIL),
            thumb = this.get(THUMB),
            dim   = this._key.dim,
            img   = this.get(THUMB_IMAGE),
            size;

        // offsetWidth fails in hidden containers
        size = parseInt(thumb.getComputedStyle(dim),10);

        // TODO: Offer default dim in the case of x axis slider w/ no image or
        // specified thumb dims in css?  getCS would return the full rail width.
        if (this._isImageLoaded(img)) {
            size = max(img.get(dim), size);
        }

        this._thumbSize = size;
    },

    _setDDGutter : function () {
        var gutter = [0,0,0,0],
            i      = this._key.xyIndex,
            dim    = this._thumbSize / 2,
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

    _setFactor : function () {
        this._factor = this._railSize ?
            (this.get(MAX) - this.get(MIN)) / this._railSize :
            1;
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
        this.fire(SLIDE_START,{ddEvent:e});
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
            this.set(VALUE, val, {ddEvent:e.ddEvent});
        }
    },

    _onDDEndDrag : function (e) {
        this.fire(SLIDE_END,{ddEvent:e});
    },




    _defSetThumbPosition : function (e) {
        var min = this.get(MIN),
            max = this.get(MAX),
            v;

        v = round(((e.changeEv.newVal - min) / (max - min)) *
                this._railSize) - floor(this._thumbSize / 2);

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

    _afterRailSizeChange : function (e) {
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
