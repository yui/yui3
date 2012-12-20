/**
 * Provides functionality for the handling of time axis data for a chart.
 *
 * @module charts
 * @submodule axis-time-base
 */

var Y_Lang = Y.Lang;
/**
 * TimeImpl manages time data on an axis.
 *
 * @class TimeImpl
 * @constructor
 * @submodule axis-time-base
 */
function TimeImpl()
{
}

TimeImpl.NAME = "timeImpl";

TimeImpl.ATTRS =
{
    /**
     * Method used for formatting a label. This attribute allows for the default label formatting method to overridden.
     * The method use would need to implement the arguments below and return a `String` or an `HTMLElement`. The default
     * implementation of the method returns a `String`. The output of this method will be rendered to the DOM using
     * `appendChild`. If you override the `labelFunction` method and return an html string, you will also need to override
     * the Axis' `appendLabelFunction` to accept html as a `String`.
     * <dl>
     *      <dt>val</dt><dd>Label to be formatted. (`String`)</dd>
     *      <dt>format</dt><dd>STRFTime string used to format the label. (optional)</dd>
     * </dl>
     *
     * @attribute labelFunction
     * @type Function
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
     * Pattern used by the `labelFunction` to format a label.
     *
     * @attribute labelFormat
     * @type String
     */
    labelFormat: {
        value: "%b %d, %y"
    }
};

TimeImpl.prototype = {
    _maximumGetter: function ()
    {
        var max = this._getNumber(this._setMaximum);
        if(!Y_Lang.isNumber(max))
        {
            max = this._getNumber(this.get("dataMaximum"));
        }
        return parseFloat(max);
    },
   
    _maximumSetter: function (value)
    {
        this._setMaximum = this._getNumber(value);
        return value;
    },
   
    _minimumGetter: function ()
    {
        var min = this._getNumber(this._setMinimum);
        if(!Y_Lang.isNumber(min))
        {
            min = this._getNumber(this.get("dataMinimum"));
        }
        return parseFloat(min);
    },

    _minimumSetter: function (value)
    {
        this._setMinimum = this._getNumber(value);
        return value;
    },

    _getSetMax: function()
    {
        var max = this._getNumber(this._setMaximum);
        return (Y_Lang.isNumber(max));
    },

    _getSetMin: function()
    {
        var min = this._getNumber(this._setMinimum);
        return (Y_Lang.isNumber(min));
    },

    /**
     * Formats a label based on the axis type and optionally specified format.
     *
     * @method formatLabel
     * @param {Object} value
     * @param {Object} format Pattern used to format the value.
     * @return String
     */
    formatLabel: function(val, format)
    {
        val = Y.DataType.Date.parse(val);
        if(format)
        {
            return Y.DataType.Date.format(val, {format:format});
        }
        return val;
    },

    /**
     * Constant used to generate unique id.
     *
     * @property GUID
     * @type String
     * @private
     */
    GUID: "yuitimeaxis",

    /**
     * Type of data used in `Axis`.
     *
     * @property _dataType
     * @readOnly
     * @private
     */
    _dataType: "time",

    /**
     * Calculates and returns a value based on the number of labels and the index of
     * the current label.
     *
     * @method _getLabelByIndex
     * @param {Number} i Index of the label.
     * @param {Number} l Total number of labels.
     * @param {String} direction The direction of the axis. (vertical or horizontal)
     * @return String
     * @private
     */
    _getLabelByIndex: function(i, l, direction)
    {
        var min = this.get("minimum"),
            max = this.get("maximum"),
            increm,
            label;
            l -= 1;
        increm = ((max - min)/l) * i;
        if(direction && direction == "vertical")
        {
            label = max - increm;
        }
        else
        {
            label = min + increm;
        }
        return label;
    },

    /**
     * Gets an array of values based on a key.
     *
     * @method _getKeyArray
     * @param {String} key Value key associated with the data array.
     * @param {Array} data Array in which the data resides.
     * @return Array
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
            if(Y_Lang.isDate(obj))
            {
                val = obj.valueOf();
            }
            else
            {
                val = new Date(obj);
                if(Y_Lang.isDate(val))
                {
                    val = val.valueOf();
                }
                else if(!Y_Lang.isNumber(obj))
                {
                    if(Y_Lang.isNumber(parseFloat(obj)))
                    {
                        val = parseFloat(obj);
                    }
                    else
                    {
                        if(typeof obj != "string")
                        {
                            obj = obj;
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
     * Sets data by key
     *
     * @method _setDataByKey
     * @param {String} key Key value to use.
     * @param {Array} data Array to use.
     * @private
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
            if(Y_Lang.isDate(obj))
            {
                val = obj.valueOf();
            }
            else
            {
                val = new Date(obj);
                if(Y_Lang.isDate(val))
                {
                    val = val.valueOf();
                }
                else if(!Y_Lang.isNumber(obj))
                {
                    if(Y_Lang.isNumber(parseFloat(obj)))
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
     * Parses value into a number.
     *
     * @method _getNumber
     * @param val {Object} Value to parse into a number
     * @return Number
     * @private
     */
    _getNumber: function(val)
    {
        if(Y_Lang.isDate(val))
        {
            val = val.valueOf();
        }
        else if(!Y_Lang.isNumber(val) && val)
        {
            val = new Date(val).valueOf();
        }

        return val;
    }
};

Y.TimeImpl = TimeImpl;

