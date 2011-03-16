/**
 * TimeAxis manages time data on an axis.
 *
 * @param {Object} config (optional) Configuration parameters for the Chart.
 * @class TimeAxis
 * @constructor
 * @extends AxisType
 */
function TimeAxis(config)
{
	TimeAxis.superclass.constructor.apply(this, arguments);
}

TimeAxis.NAME = "timeAxis";

TimeAxis.ATTRS = 
{
    /**
     * @private
     */
    setMax: {
        readOnly: true,

        getter: function()
        {
            var max = this._getNumber(this._setMaximum);
            return (Y.Lang.isNumber(max));
        }
    },

    /**
     * @private
     */
    setMin: {
        readOnly: true,

        getter: function()
        {
            var min = this._getNumber(this._setMinimum);
            return (Y.Lang.isNumber(min));
        }
    },

    /**
     * The maximum value that will appear on an axis.
     *
     * @attribute maximum
     * @type Number
     */
    maximum: {
        getter: function ()
        {
            var max = this._getNumber(this._setMaximum);
            if(!Y.Lang.isNumber(max))
            {
                max = this._getNumber(this.get("dataMaximum"));
            }
            return max;
        },
        setter: function (value)
        {
            this._setMaximum = this._getNumber(value);
            return value;
        }
    },

    /**
     * The minimum value that will appear on an axis.
     *
     * @attribute minimum
     * @type Number
     */
    minimum: {
        getter: function ()
        {
            var min = this._getNumber(this._setMinimum);
            if(!Y.Lang.isNumber(min)) 
            {
                min = this._getNumber(this.get("dataMinimum"));
            }
                return min;
        },
        setter: function (value)
        {
            this._setMinimum = this._getNumber(value);
            return value;
        }
    },

    /**
     * Formats a label.
     *
     * @attribute labelFunction
     * @type Function
     * @param {Object} val Value to be formatted. 
     * @param {String} format Pattern used to format label.
     */
    labelFunction: {
        value: function(val, format)
        {
            val = Y.DataType.Date.parse(val);
            if(format)
            {
                return Y.DataType.Date.format(val, {format:format});
            }
            return val;
        }
    },

    /**
     * Pattern used by the <code>labelFunction</code> to format a label.
     *
     * @attribute labelFormat
     * @type String
     */
    labelFormat: {
        value: "%b %d, %y"
    }
};

Y.extend(TimeAxis, Y.AxisType, {
    /**
     * Constant used to generate unique id.
     *
     * @property GUID
     * @type String
     * @private
     */
    GUID: "yuitimeaxis",
	
    /**
     * @private
     */
    _dataType: "time",
	
    /**
     * Calculates and returns a value based on the number of labels and the index of
     * the current label.
     *
     * @method getLabelByIndex
     * @param {Number} i Index of the label.
     * @param {Number} l Total number of labels.
     * @return String
     */
    getLabelByIndex: function(i, l)
    {
        var min = this.get("minimum"),
            max = this.get("maximum"),
            position = this.get("position"),
            increm,
            label;
            l -= 1;
        increm = ((max - min)/l) * i;
        if(position == "bottom" || position == "top")
        {
            label = min + increm;
        }
        else
        {
            label = max - increm;
        }
        return label;
    },

    /**
     * @private
     */
    _getKeyArray: function(key, data)
    {
        var obj,
            keyArray = [],
            i = 0,
            val,
            len = data.length;
        for(; i < len; ++i)
        {
            obj = data[i][key];
            if(Y.Lang.isDate(obj))
            {   
                val = obj.valueOf();
            }
            else
            {
                val = new Date(obj);
                if(Y.Lang.isDate(val))
                {
                    val = val.valueOf();
                }
                else if(!Y.Lang.isNumber(obj))
                {
                    if(Y.Lang.isNumber(parseFloat(obj)))
                    {
                        val = parseFloat(obj);
                    }
                    else
                    {
                        if(typeof obj != "string")
                        {
                            obj = obj.toString();
                        }
                        val = new Date(obj).valueOf();
                    }
                }
                else
                {
                    val = obj;
                }
            }
            keyArray[i] = val;
        }
        return keyArray;
    },

    /**
     * @private (override)
     */
    _setDataByKey: function(key, data)
    {
        var obj, 
            arr = [], 
            dv = this._dataClone.concat(), 
            i, 
            val,
            len = dv.length;
        for(i = 0; i < len; ++i)
        {
            obj = dv[i][key];
            if(Y.Lang.isDate(obj))
            {   
                val = obj.valueOf();
            }
            else
            {
                val = new Date(obj);
                if(Y.Lang.isDate(val))
                {
                    val = val.valueOf();
                }
                else if(!Y.Lang.isNumber(obj))
                {
                    if(Y.Lang.isNumber(parseFloat(obj)))
                    {
                        val = parseFloat(obj);
                    }
                    else
                    {
                        if(typeof obj != "string")
                        {
                            obj = obj.toString();
                        }
                        val = new Date(obj).valueOf();
                    }
                }
                else
                {
                    val = obj;
                }
            }
            arr[i] = val;
        }
        this.get("keys")[key] = arr;
        this._updateTotalDataFlag = true;
    },

    /**
     * @private
     */
    _getNumber: function(val)
    {
        if(Y.Lang.isDate(val))
        {
            val = val.valueOf();
        }
        else if(!Y.Lang.isNumber(val) && val)
        {
            val = new Date(val).valueOf();
        }

        return val;
    }
});

Y.TimeAxis = TimeAxis;
		
