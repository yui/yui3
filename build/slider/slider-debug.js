YUI.add('slider', function(Y) {

var CLASS_RAIL  = 'rail',
    CLASS_THUMB = 'thumb',
    CLASS_INPUT = 'input',
    
    DIM_RE = /^\d+(?:p[xtc]|%|e[mx]|in|[mc]m)$/,

    L = Y.Lang,
    isString = L.isString,
    isNumber = L.isNumber;

function Slider() {
    this.constructor.superclass.constructor.apply(this,arguments);
}

Y.mix(Slider, {

    NAME : 'slider',

    // Expose via readOnly obj attribute axisProps.offsetEdge (e.g.)?
    AXIS_PROPS : {
        x : {
            offsetEdge    : 'left',
            dim           : 'width',
            axisDim       : 'railWidth',
            offAxisDim    : 'railHeight',
            offsetDim     : 'offsetWidth',
            posMethod     : 'getX',
            eventPageAxis : 'pageX',
            ddStick       : 'stickX',
            ticks         : 'tickX',
            xyIndex       : 0
        },
        y : {
            offsetEdge    : 'top',
            dim           : 'height',
            axisDim       : 'railHeight',
            offAxisDim    : 'railWIdth',
            offsetDim     : 'offsetHeight',
            posMethod     : 'getY',
            eventPageAxis : 'pageY',
            ddStick       : 'stickY',
            ticks         : 'tickY',
            xyIndex       : 1
        }
    },

    ATTRS : {
        axis : {
            value : 'x',
            writeOnce : true,
            validator : function (v) {
                return isString(v) &&
                       v.length === 1 && 'xy'.indexOf(v.toLowerCase()) > -1;
            },
            set : function (v) {
                return v.toLowerCase();
            }
        },

        min : {
            value : 0,
            validator : isNumber
        },

        max : {
            value : 100,
            validator : isNumber
        },

        value : {
            value : 0,
            validator : function (v) {
                return isNumber(v) &&
                       v >= this.get('min') && v <= this.get('max');
            },
            set : function (v) {
                var values = this.get('values'),x,i;

                if (values) {
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

                return v;
            }
        },

        values : {
            value : null,
            validator : function (v) {
                return v === null || L.isArray(v) || (
                    isNumber(v) && v > 1 && v <= this.get('max'));
            },
            set : function (v) {
                if (isNumber(v)) {
                    var min = this.get('min'),
                        max = this.get('max'),
                        inc = (max - min)/(v - 1),
                        vals = [min],
                        i,len;

                    for (i = 1, len = v - 1; i < len; ++i) {
                        vals[i] = Math.round(min + (i * inc));
                    }

                    vals[i] = max;

                    v = vals;
                }

                if (L.isArray(v)) {
                    v.sort(this._valueSorter);
                }

                return v;
            }
        },

        rail : {
            value : null,
            set : function (v) {
                return v ? Y.get(v) : null;
            }
        },

        thumb : {
            value : null,
            set : function (v) {
                return v ? Y.get(v) : null;
            }
        },

        thumbImage : {
            value : null,
            set : function (v) {
                return v ? Y.get(v) ||
                        Y.Node.create('<img src="'+v+'" alt="Slider thumb">') :
                        null;
            }
        },

        railHeight : {
            value : '20px',
            validator : function (v) {
                return isString(v) && (v === '0' || DIM_RE.test(v));
            }
        },

        railWidth : {
            value : '200px',
            validator : function (v) {
                return isString(v) && (v === '0' || DIM_RE.test(v));
            }
        },

        backgroundEnabled : {
            value : true,
            validator : L.isBoolean
        },

        edgeOffset : {
            value : 0,
            validator : isString
        }
    }
});

Y.extend(Slider, Y.Widget, {

    HTML_PARSER : {
        // implemented as functions due to a timing issue with instance-based
        // ClassNameManager
        rail : function (cb) {
            return cb.query('.'+this.getClassName(CLASS_RAIL));
        },
        thumb : function (cb) {
            return cb.quer('.'+this.getClassName(CLASS_THUMB));
        },
        thumbImage : function (cb) {
            return cb.query('.'+this.getClassName(CLASS_THUMB)+' img');
        }
    },

    _factor : 0.5,

    _tickSize : false,

    _thumbCenterOffset : null,

    _valueSorter : function (a,b) {
        return (+a < +b) ? -1 : (+a < +b) ? 1 : 0;
    },

    initializer : function () {
        // In initializer because render needs values, and these might update it
        this.on('minChange',this._onMinChange);
        this.on('maxChange',this._onMaxChange);

        this.publish('slideStart');
        this.publish('change');
        this.publish('slideEnd');
    },

    renderUI : function () {

        this.initRail();

        this.initThumb();

        this.initRailDims();
    },

    initRail : function () {
        var AP   = Slider.AXIS_PROPS[this.get('axis')],
            cb   = this.get('contentBox'),
            rail = this.get('rail');

        // Create rail if necessary. Make sure it's in the contentBox
        if (!rail) {
            rail = cb.appendChild(
                Y.Node.create('<div class="'+
                    this.getClassName(CLASS_RAIL)+'"></div>'));

            this.set('rail',rail);
        } else if (!cb.contains(rail)) {
            cb.appendChild(rail);
        }

        if ('absolute|relative'.indexOf(rail.getStyle('position')) === -1) {
            rail.setStyle('position','relative');
        }

        this._offsetXY = this.get('rail').getXY()[AP.xyIndex];
    },

    initRailDims : function () {
        var rail = this.get('rail'),
            w    = this.get('railWidth'),
            h    = this.get('railHeight'),
            fallback;

        if (!h) {
            // TODO: default from thumb height if possible?
            // FIXME: offsetHeight unreliable (hidden container)
            h = (parseInt(rail.getComputedStyle('height'),10) ||
                       rail.get('offsetHeight')) + 'px';

            this.set('railHeight',fallback);
        }

        rail.setStyle('height', h);

        if (!w) {
            // TODO: default from thumb width if possible?
            // FIXME: offsetWidth unreliable (hidden container)
            w = (parseInt(rail.getComputedStyle('width'),10) ||
                       rail.get('offsetWidth')) + 'px';

            this.set('railWidth',fallback);
        }

        rail.setStyle('width',w);
    },

    initThumb : function () {
        var AP      = Slider.AXIS_PROPS[this.get('axis')],
            rail    = this.get('rail'),
            thumb   = this.get('thumb'),
            img     = this.get('thumbImage'),
            dim;

        if (!thumb) {
            thumb = Y.Node.create(
                '<div class="'+this.getClassName(CLASS_THUMB)+'"></div>');

            this.set('thumb',thumb);
        }

        if (!rail.contains(thumb)) {
            rail.appendChild(thumb);
        }

        thumb.setStyle('position','absolute');
        thumb.setStyle(AP.offsetEdge,'0');

        if (img) {
            this.initThumbImage();
        } else {
            this.defaultThumbDimensions();
        }

        this._calcThumbCenterOffset();
    },

    initThumbImage : function () {
        var thumb = this.get('thumb'),
            img   = this.get('thumbImage');

        if (!thumb.contains(img)) {
            thumb.appendChild(img);
        }
    },

    defaultThumbDimensions : function () {
        var thumb = this.get('thumb'),
            AP    = Slider.AXIS_PROPS[this.get('axis')],
            xy    = parseInt(this.get(AP.offAxisDim),10) + 'px';

        if (parseInt(thumb.getStyle('height'),10) < 1) {
            thumb.setStyle('height',xy);
        }
        if (parseInt(thumb.getStyle('width'),10) < 1) {
            thumb.setStyle('width',xy);
        }
    },

    _calcThumbCenterOffset : function () {
        var oAxisDim = Slider.AXIS_PROPS[this.get('axis')].offAxisDim,
            dim      = this.get(oAxisDim);

        this._thumbCenterOffset = Math.round(parseInt(dim,10) / 2);
    },

    bindUI : function () {
        this.initThumbDD();

        this._setConvFactor();

        this.after('valueChange', this._onValueChange);
        this.after('valuesChange', this._onValuesChange);

        this.get('rail').on('mousedown',this.focus);
    },

    initThumbDD : function () {
        this._dd = new Y.DD.Drag({
            node : this.get('thumb'),
            constrain2node : this.get('rail')
        });

        this._dd.on('drag:start',Y.bind(this._onDDStartDrag, this));
        this._dd.on('drag:drag', Y.bind(this._onDDDrag,      this));
        this._dd.on('drag:end',  Y.bind(this._onDDEndDrag,   this));

        this._dd.set(Slider.AXIS_PROPS[this.get('axis')].ddStick, true);

        this._initBackgroundDD();
        this._setValueStops();
    },

    _initBackgroundDD : function () {
        var AP      = Slider.AXIS_PROPS[this.get('axis')],
            pageXY  = AP.eventPageAxis,
            xyIndex = AP.xyIndex,
            self    = this;

        // Temporary hack while dd doesn't support outer handles
        // TODO: coerce DD to fire drag:start
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
                xy[xyIndex] += self._thumbCenterOffset;

                this._setStartPosition(xy);

                this.start();
                this._moveNode([ev.pageX,ev.pageY]);
            }
        },this._dd),this.get('rail'));
    },

    _setValueStops : function () {
        var AP       = Slider.AXIS_PROPS[this.get('axis')] ,
            values   = this.get('values'),
            tickSize = false,
            dim;

        if (values) {
            // TODO: Should the stops be positioned relative to their value
            // within the min - max range, or evenly spaced?
            dim = parseInt(this.get(AP.axisDim),10) -
                    this.get('thumb').get(AP.offsetDim);
            tickSize = Math.floor(dim / (values.length - 1));
        }

        this._tickSize = tickSize;

        this._dd.set(AP.ticks, tickSize);
    },

    syncUI : function () {
        this.set('value',this.get('value'));
    },

    getValue : function () {
        return this.get('value');
    },

    setValue : function (val,silent) {
        this.set('value',val,{omitChangeEvent:silent});
    },

    _onValueChange : function (e) {
        // relies on e.src set by DD handler
        if (!e.src) {
            this._uiSetThumbPosition(e.newVal,e.omitChangeEvent);
        }
    },

    _onValuesChange : function (e) {
    },

    _onDDStartDrag : function (e) {
        var AP = Slider.AXIS_PROPS[this.get('axis')];

        this.fire('slideStart',{ddEvent:e});
        this._offsetXY = this.get('rail').getXY()[AP.xyIndex];
    },

    _onDDDrag : function (e) {
        var AP     = Slider.AXIS_PROPS[this.get('axis')],
            values = this.get('values'),
            val    = e[AP.eventPageAxis] - this._offsetXY,
            before = this.get('value'),
            i,len;
            
        if (values) {
            // cache last value or binary search if loop speed becomes an issue?
            for (i = 0,len = values.length - 1; i < len; ++i) {
                if (val - (i * this._tickSize) <= 0) {
                    break;
                }
            }

            val = values[i];
        } else {
            val *= this._factor;
        }

        this.set('value', val,{src:'dd'});
        val = this.get('value');

        if (before !== val) {
            this.fire('change', {value:val, ddEvent:e});
        }
    },

    _onDDEndDrag : function (e) {
        this.fire('slideEnd',{ddEvent:e});
    },

    _uiSetThumbPosition : function (v) {
        var AP     = Slider.AXIS_PROPS[this.get('axis')],
            values = this.get('values'),
            i,x;

        if (values) {
            for (i = values.length - 1; i >= 0; --i) {
                if (values[i] === v) {
                    break;
                }
            }

            v = this._tickSize * i;
        } else {
            v = Math.round(v / this._factor);
        }

        this.get('thumb').setStyle(AP.offsetEdge, v+'px');
    },

    _onMinChange: function (e) {
        this._updateValues(e.newVal, this.get('max'));
    },
    _onMaxChange: function (e) {
        this._updateValues(this.get('min'), e.newVal);
    },

    _updateValues : function(min,max,field) {
    },

    _setConvFactor : function () {
        var AP    = Slider.AXIS_PROPS[this.get('axis')],
            range = this.get('max') - this.get('min'),
            size  = parseInt(this.get(AP.axisDim),10) -
                    (2 * this._thumbCenterOffset);

        if (size) {
            this._factor = range / size;
        }
    }

});

Y.Slider = Slider;


}, '@VERSION@' ,{requires:['widget','dd']});
