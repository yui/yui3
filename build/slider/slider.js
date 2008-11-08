YUI.add('slider', function(Y) {

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
    isNumber = L.isNumber;

function Slider() {
    this.constructor.superclass.constructor.apply(this,arguments);
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
            ticks         : 'tickX',
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
            ticks         : 'tickY',
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

        values : {
            value : null,
            validator : function (v) {
                return this._validateNewValues(v);
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
            value : 0,
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

    _values : null,

    _railDims : null,

    _thumbDims : null,

    _thumbCenterOffset : 10,

    initializer : function () {
        this._key = Slider.AXIS_KEYS[this.get('axis')];

        this.after('minChange',    this._afterMinChange);
        this.after('maxChange',    this._afterMaxChange);
        this.after('valuesChange', this._afterValuesChange);

        this.after(this._key.axisDim+'Change', this._afterRailDimChange);

        this.publish(SLIDE_START);
        this.publish(SLIDE_END);
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
        this.initThumbDD();

        this.after('valueChange', this._afterValueChange);
    },

    initThumbDD : function () {
        this._dd = new Y.DD.Drag({
            node : this.get(THUMB),
            constrain2node : this.get(RAIL)
        });

        this._dd.on('drag:start',Y.bind(this._onDDStartDrag, this));
        this._dd.on('drag:drag', Y.bind(this._onDDDrag,      this));
        this._dd.on('drag:end',  Y.bind(this._onDDEndDrag,   this));

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
                    return false;
                }

                this._dragThreshMet = true;

                this._fixIEMouseDown();
                ev.halt();

                Y.DD.DDM.activeDrag = this;

                // Adjust registered starting position by half the thumb's x/y
                xy = this.get('dragNode').getXY();
                xy[xyIndex] += self._thumbCenterOffset;

                this._setStartPosition(xy);

                this.start();
                this._moveNode([ev.pageX,ev.pageY]);
            }
        },this._dd),this.get(RAIL));
    },

    syncUI : function () {
        this._scheduleSync();
    },

    _scheduleSync : function () {
        var img = this.get(THUMB_IMAGE), handler;

        if (!img || img.get('complete')) {
            this._doSyncUI();
        } else {
            // Schedule the sync for when the image loads/errors
            handler = Y.bind(this._doSyncUI,this);
            img.on('load',handler);
            img.on('error',handler);
        }
    },

    _doSyncUI : function () {
        this._setRailDims();

        this._setThumbDims();

        this._setRailOffsetXY();

        this._calcThumbCenterOffset();

        this._updateValues();

        this._setValueStops();

        this._setConvFactor();

        this.set(VALUE,this.get(VALUE));
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
        this._offsetXY = this.get(RAIL).getXY()[this._key.xyIndex];
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

    _calcThumbCenterOffset : function () {
        this._thumbCenterOffset = Math.round(
            this._thumbDims[this._key.xyIndex] / 2);
    },

    _setValueStops : function () {
        var tickSize = false, dim;

        if (this._values) {
            dim = this._railDims[this._key.xyIndex] -
                  this._thumbDims[this._key.xyIndex];
            tickSize = Math.floor(dim / (this._values.length - 1));
        }

        this._tickSize = tickSize;

        this._dd.set(this._key.ticks, tickSize);
    },

    _updateValues : function() {
        var min  = this.get(MIN),
            max  = this.get(MAX),
            v    = this.get('values'),
            inc  = (max - min)/(v - 1),
            vals = null,
            i,len;

        if (v) {
            if (isArray(v)) {
                vals = v;
            } else {
                vals = [min];

                for (i = 1, len = v - 1; i < len; ++i) {
                    vals[i] = Math.round(min + (i * inc));
                }

                vals[i] = max;
            }

            // transform into a map struct for fast lookup
            vals = {
                arr    : vals,
                min    : vals[0],
                max    : vals[vals.length - 1],
                length : vals.length
            };

            for (i = vals.length - 1; i >= 0; --i) {
                vals[vals.arr[i]] = i;
            }
        }

        this._values = vals;
    },

    _setConvFactor : function () {
        var range = this.get(MAX) - this.get(MIN),
            size  = this._railDims[this._key.xyIndex] -
                    this._thumbDims[this._key.xyIndex];

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
        var pass   = isNumber(v),
            min    = this.get(MIN),
            max    = this.get(MAX);

        if (pass) {
            if (this._values) {
                pass = isNumber(this._values[v]);
            } else {
                pass = min < max ?
                    (v >= min && v <= max) :
                    (v >= max && v <= min);
            }
        }
            
        return pass;
    },

    _validateNewValues : function (v) {
        var max = this.get(MAX);

        // MAX is set after values to preserve array values
        if (v === null || isArray(v) ||
            (isNumber(v) && v > 1 && max === undefined)) {
            return true;
        }

        if (isNumber(v)) {
            return v > 1 && v <= Math.abs(max - this.get(MIN));
        }

        return false;
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
        var values = this.get('values'),x,i;

        if (values) {
            if (!this._values) {
                // For support of value validation during initialization
                this._updateValues();
            }
            values = this._values;

            if (!isNumber(+v)) {
                v = values.min;
            } else if (!values[v]) {
                values = values.arr;

                if (values[0] > values[values.length - 1]) {
                    values = Y.Array(values);
                    values.reverse();
                }
                x = values[values.length - 1];

                for (i = values.length - 1; i >= 0; --i) {
                    if (values[i] > v) {
                        x = values[i];
                    } else {
                        v = Math.abs(x - v) < Math.abs(values[i] - v) ?
                                x : values[i];
                        break;
                    }
                }
            }
        } else if (!isNumber(+v)) { 
            v = this.get('min');
        }

        return Math.round(v);
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
        this.fire(SLIDE_START,{ddEvent:e});
        this._offsetXY = this.get(RAIL).getXY()[this._key.xyIndex];
    },

    _onDDDrag : function (e) {
        var val    = e[this._key.eventPageAxis] - this._offsetXY,
            before = this.get(VALUE),
            i,len;
            
        if (this._values) {
            /*
            // cache last value or binary search if loop speed becomes an issue?
            for (i = 0,len = this._values.arr.length - 1; i < len; ++i) {
                if (val - (i * this._tickSize) <= 0) {
                    break;
                }
            }

            val = this._values.arr[i];
            */
            val = this._values.arr[Math.round(val/this._tickSize)];
        } else {
            val = Math.round(this.get(MIN) + (val * this._factor));
        }

        if (before !== val) {
            this.set(VALUE, val,{ddEvent:e});
        }
    },

    _onDDEndDrag : function (e) {
        this.fire(SLIDE_END,{ddEvent:e});
    },

    _uiSetThumbPosition : function (v) {
        var min,max,i,x;

        if (this._values) {
            /*
            for (i = this._values.length - 1; i >= 0; --i) {
                if (this._values[i] === v) {
                    break;
                }
            }

            v = this._tickSize * i;
            */
            v = Math.round(this._values[v] * this._tickSize);
        } else {
            min = this.get(MIN);
            max = this.get(MAX);

            v = Math.round(
                    ((v - min) / (max - min)) *
                    (this._railDims[this._key.xyIndex] -
                     this._thumbDims[this._key.xyIndex]));
        }

        this.get(THUMB).setStyle(this._key.offsetEdge, v + PX);
    },

    _afterValueChange : function (e) {
        if (!e.ddEvent) {
            this._uiSetThumbPosition(e.newVal);
        }
    },

    _afterMinChange : function (e) {
        this._refreshValues(e);
    },

    _afterMaxChange : function (e) {
        this._refreshValues(e);
    },

    _afterValuesChange : function (e) {
        this._refreshValues(e);
        if (this._values) {
            this.set('min',this._values[0]);
            this.set('max',this._values[this._values.length - 1]);
        }
    },

    _afterRailDimChange : function (e) {
        if (e.newVal !== e.prevVal) {
            this._setRailDims();
            
            if (this.get(RENDERED)) {
                this._setValueStops();
            }
        }
    },

    _refreshValues : function (e) {
        if (e.newVal !== e.prevVal) {
            if (this.get(RENDERED)) {
                this.syncUI();
            }
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


}, '@VERSION@' ,{requires:['widget','dd']});
