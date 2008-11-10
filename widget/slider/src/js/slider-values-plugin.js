var MIN = 'min',
    MAX = 'max',
    VALUE = 'value',
    
    isNumber = Y.Lang.isNumber,
    
    abs = Math.abs;

function SliderValuesPlugin() {
    SliderValuesPlugin.superclass.apply(this,arguments);
}

Y.mix(SliderValuesPlugin,{
    NAME : 'slidervaluesplugin',
    NS : 'slidervalues',
    ATTRS : {
        values : {
            value : null,
            validator : function (v) {
                return this._validateNewValues(v);
            }
        }
    }
});

Y.extend(SliderValuesPlugin, {
    _values : null,

    _tickSize : null,

    initializer : function () {
        var slider = this.owner;

        slider.on('sync', this._doSyncUI);
        slider.on('thumbDrag', this._onDDDrag);
        slider.on('valueSet',  this._uiSetThumbPosition);

        this.after('valuesChange', this._afterValuesChange);

        this.addOverride(slider,'_validateNewValue',this._validateNewValue);

        slider._tickAxis = 'tick' + slider.get('axis').toUpperCase();
    },

    getValues : function () {
        return this._values ? Y.Array(this._values.arr) : null;
    },

    _doSyncUI : function (e) {
        var slider = this.owner;

        this._updateValues();

        if (this._values) {
            e.preventDefault();

            slider._setRailDims();

            slider._setThumbDims();

            slider._setRailOffsetXY();

            slider._setDDGutter();

            this._setValueStops();

            slider.set(VALUE,slider.get(VALUE),{ddEvent:null});
        }
    },

    _setValueStops : function () {
        var slider = this.owner,
            dim    = slider._railDims[slider._key.xyIndex];

        this._tickSize = floor(dim / (this._values.length - 1));

        slider._dd.set(this._tickAxis, this._tickSize);
    },

    _updateValues : function() {
        var slider = this.owner,
            min    = this.get(MIN),
            max    = this.get(MAX),
            v      = this.get('values'),
            inc    = (max - min)/(v - 1),
            vals   = null,
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
                length : vals.length
            };

            for (i = vals.length - 1; i >= 0; --i) {
                vals[vals.arr[i]] = i;
            }
        }

        this._values = vals;
    },

    _onDDDrag : function (e) {
        if (this._values) {
            e.preventDefault();

            var slider = this.owner,
                before = slider.get('value'),
                val    = e.ddEvent[this._key.eventPageAxis] - this._offsetXY;

            val = this._values.arr[round(val / this._tickSize)];

            if (before !== val) {
                slider.set(VALUE, val, {ddEvent: e.ddEvent});
            }
        }
    },

    _uiSetThumbPosition : function (e) {
        e.preventDefault();

        var slider = this.owner,
            i = this._key.xyIndex,
            v;

        v = round(this._values[e.changeEv.newVal] * this._tickSize) -
                floor(slider._thumbDims[i] / 2);

        slider.get(THUMB).setStyle(slider._key.offsetEdge, v + 'px');
    },

    _validateNewValue : function (v) {
        return isNumber(v) && isNumber(this._values[v]);
    },

    _setValueFn : function (v) {
        var slider = this.owner,
            values = slider.get('values'),
            x,i;

        if (values) {
            if (!this._values) {
                // For support of value validation during initialization
                this._updateValues();
            }
            values = this._values;

            if (!isNumber(v)) {
                v = values.arr[0];
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
                        v = abs(x - v) < abs(values[i] - v) ?
                                x : values[i];
                        break;
                    }
                }
            }
        }

        return Math.round(v);
    },

    _validateNewValues : function (v) {
        var slider = this.owner,
            max    = slider.get(MAX),
            pass   = v === null || Y.Lang.isArray(v);

        // TODO: timing issue with initial value set before values range
        // updates available range.  E.g. -50 is outside the default min/max,
        // so if values is set to an array and min/max are omitted, -50 is
        // not honored, and is replaced with default min.

        if (pass && isNumber(v)) {
            pass = v > 1 && v <= abs(max - slider.get(MIN));
        }

        return pass;
    },

    _afterValuesChange : function (e) {
        var slider = this.owner;

        this._updateValues();

        if (this._values) {
            slider.set(MIN,this._values[0]);
            slider.set(MAX,this._values[this._values.length - 1]);
        } else {
            slider._dd.set('',false);
        }

        slider._refresh(e);
    }

});

Y.Plugin.SliderValuesPlugin = SliderValuesPlugin;
