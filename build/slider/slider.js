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

    /**
     * Alternate value for attribute preserveField to convert the element to an
     * &lt;input type="hidden" ..&gt;
     */
    FIELD_HANDLER : {
        'replace' : function () { this._replaceField(); },
        'preserve': function () { this._preserveField(); },
        'hide'    : function () { this._hideField(); }
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
                            return Math.abs(x - v) < Math.abs(values[i] - v) ?
                                    x : values[i];
                        }
                    }
                }
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
                        inc = Math.round((max - min)/v),
                        vals = [min],
                        i,len;

                    for (i = 1, len = v - 1; i < len; ++i) {
                        vals[i] = min + (i * inc);
                    }

                    vals[i] = max;

                    v = vals;
                }

                if (v) {
                    v.sort();
                }

                return v;
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

        field : {
            value : null,
            validator : function (v) {
                if (this.get('rendered')) {
                    return false;
                }
                return true;
            },
            set : function (v) {
                // queryAll to support radio groups 'input[name=fooRadio]'
                var nodes = v ? Y.queryAll(v) : null;
                return nodes && nodes.length === 1 ? nodes.item(0) : nodes;
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

        preserveField : {
            value : function () { this._replaceField(); },
            writeOnce: true,
            validator : function (v) {
                return L.isFunction(v) || isString(v);
            },
            set : function (v) {
                v = L.isFunction(v) ? v : Slider.FIELD_HANDLER[v];
                return Y.bind(v,this);
            }
        },

        keyIncrement : {
            value : 5,
            validator : isNumber
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
        field : function (cb) {
            return cb.query('.'+this.getClassName(CLASS_INPUT));
        },
        thumbImage : function (cb) {
            return cb.query('.'+this.getClassName(CLASS_THUMB)+' img');
        }
    },

    _hasFieldValues : false,

    _factor : 0.5,

    _tickSize : false,

    _thumbCenterOffset : null,

    initializer : function () {
        // In initializer because render needs values, and these might update it
        this.on('fieldChange',this._onFieldChange);
        this.on('minChange',this._onMinChange);
        this.on('maxChange',this._onMaxChange);

        this.publish('slideStart');
        this.publish('change');
        this.publish('slideEnd');
    },

    renderUI : function () {

        this.initField();

        this.initRail();

        this.initThumb();

        this.initRailDims();
    },

    initField : function () {
        this.get('preserveField')(this.get('field'));
    },

    initRail : function () {
        var cb   = this.get('contentBox'),
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
        var rail    = this.get('rail'),
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

        this.on('valueChange', this._onValueChange);
        this.on('valuesChange', this._onValuesChange);
        this.on('backgroundEnabledChange', this._onBGEnabledChange);

        this.get('rail').on('mousedown',this.focus);

        // Hook the keyup listener to the document for xbrowser support
        Y.on('keyup', this._onKeyup, Y.config.doc);
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
            offset  = this._thumbCenterOffset;

        // Temporary hack while dd doesn't support outer handles
        // TODO: coerce DD to fire drag:start
        Y.on('mousedown',Y.bind(function (ev) {
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
            xy[xyIndex] += offset;

            this._setStartPosition(xy);

            this.start();
            this._moveNode([ev.pageX,ev.pageY]);
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
            dim      = parseInt(this.get(AP.axisDim),10) -
                        (this._thumbCenterOffset * 2);
            tickSize = Math.round(dim / (values.length - 1));
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

    initKeyListeners : function () {
    },

    _onValueChange : function (e) {
        // relies on e.src set by DD handler
        if (!e.src) {
            this._uiSetThumbPosition(e.newVal,e.omitChangeEvent);
        }
    },

    _onValuesChange : function (e) {
    },

    _onBGEnabledChange : function (e) {
    },

    _onKeyup : function (e) {

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

        this.set('value', Math.round(val),{src:'dd'});

        this.fire('change', {value:this.get('value'),ddEvent:e});
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

    _onFieldChange: function (e) {
        this._updateValues(this.get('min'), this.get('max'), e.newVal);
    },
    _onMinChange: function (e) {
        this._updateValues(e.newVal, this.get('max'), this.get('field'));
    },
    _onMaxChange: function (e) {
        this._updateValues(this.get('min'), e.newVal, this.get('field'));
    },

    _updateValues : function(min,max,field) {
    },

    _replaceField : function () {
    },

    _hideField : function () {
    },

    _preserveField : function () {},

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
