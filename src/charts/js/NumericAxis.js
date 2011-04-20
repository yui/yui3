/**
 * NumericAxis manages numeric data on an axis.
 *
 * @param {Object} config (optional) Configuration parameters for the Chart.
 * @class NumericAxis
 * @constructor
 * @extends AxisType
 */
function NumericAxis(config)
{
	NumericAxis.superclass.constructor.apply(this, arguments);
}

NumericAxis.NAME = "numericAxis";

NumericAxis.ATTRS = {
    /**
     * Indicates whether 0 should always be displayed.
     *
     * @attribute alwaysShowZero
     * @type Boolean
     */
	alwaysShowZero: {
	    value: true	
	},
    
    /**
     * Formats a label.
     *
     * @attribute labelFunction
     * @type Function
     * @param {Object} val Value to be formatted. 
     * @param {Object} format Hasho of properties used to format the label.
     */
    labelFunction: { 
        value: function(val, format)
        {
            if(format)
            {
                return Y.DataType.Number.format(val, format);
            }
            return val;
        }
    },

    /**
     * Hash of properties used by the <code>labelFunction</code> to format a
     * label.
     *
     * @attribute labelFormat
     * @type Object
     */
    labelFormat: {
        value: {
            prefix: "",
            thousandsSeparator: "",
            decimalSeparator: "",
            decimalPlaces: "0",
            suffix: ""
        }
    }
};

Y.extend(NumericAxis, Y.AxisType,
{
    /**
     * @private
     */
    _type: "numeric",

    /**
     * Returns a value based of a key value and an index.
     *
     * @method getKeyValueAt
     * @param {String} key value used to look up the correct array
     * @param {Number} index within the array
     * @return Object
     */
    getKeyValueAt: function(key, index)
    {
        var value = NaN,
            keys = this.get("keys");
        if(keys[key] && Y.Lang.isNumber(parseFloat(keys[key][index])))
        {
            value = keys[key][index];
        }
        return value;
    },

    /**
     * @private
     */
    _getMinimumUnit:function(max, min, units)
    {
        return this._getNiceNumber(Math.ceil((max - min)/units));
    },

    /**
     * @private
     */
    _getNiceNumber: function(roundingUnit)
    {
        var tempMajorUnit = roundingUnit,
            order = Math.ceil(Math.log(tempMajorUnit) * 0.4342944819032518),
            roundedMajorUnit = Math.pow(10, order),
            roundedDiff;

        if (roundedMajorUnit / 2 >= tempMajorUnit) 
        {
            roundedDiff = Math.floor((roundedMajorUnit / 2 - tempMajorUnit) / (Math.pow(10,order-1)/2));
            tempMajorUnit = roundedMajorUnit/2 - roundedDiff*Math.pow(10,order-1)/2;
        }
        else 
        {
            tempMajorUnit = roundedMajorUnit;
        }
        if(!isNaN(tempMajorUnit))
        {
            return tempMajorUnit;
        }
        return roundingUnit;

    },

    /**
     * @private
     */
    _updateMinAndMax: function()
    {
        var data = this.get("data"),
            max = 0,
            min = 0,
            len,
            num,
            i,
            key,
            setMax = this.get("setMax"),
            setMin = this.get("setMin");
        if(!setMax && !setMin)
        {
            if(data && data.length && data.length > 0)
            {
                len = data.length;
                max = min = data[0];
                if(len > 1)
                {
                    for(i = 1; i < len; i++)
                    {	
                        num = data[i];
                        if(isNaN(num))
                        {
                            if(Y.Lang.isObject(num))
                            {
                                min = max = 0;
                                //hloc values
                                for(key in num)
                                {
                                   if(num.hasOwnProperty(key))
                                   {
                                        max = Math.max(num[key], max);
                                        min = Math.min(num[key], min);
                                   }
                                }
                            }
                            max = setMax ? this._setMaximum : max;
                            min = setMin ? this._setMinimum : min;
                            continue;
                        }
                        max = setMax ? this._setMaximum : Math.max(num, max);
                        min = setMin ? this._setMinimum : Math.min(num, min);
                    }
                }
            }
            this._roundMinAndMax(min, max);
        }
    },

    /**
     * @private
     */
    _roundMinAndMax: function(min, max)
    {
        var roundingUnit,
            minimumRange,
            minGreaterThanZero = min >= 0,
            maxGreaterThanZero = max > 0,
            dataRangeGreater,
            maxRound,
            minRound,
            topTicks,
            botTicks,
            tempMax,
            tempMin,
            units = this.getTotalMajorUnits() - 1,
            alwaysShowZero = this.get("alwaysShowZero"),
            roundingMethod = this.get("roundingMethod"),
            useIntegers = (max - min)/units >= 1;
        if(roundingMethod)
        {
            if(roundingMethod == "niceNumber")
            {
                roundingUnit = this._getMinimumUnit(max, min, units);
                if(minGreaterThanZero && maxGreaterThanZero)
                {
                    if(alwaysShowZero || min < roundingUnit)
                    {
                        min = 0;
                    }
                    roundingUnit = this._getMinimumUnit(max, min, units);
                    max = this._roundUpToNearest(max, roundingUnit);
                }
                else if(maxGreaterThanZero && !minGreaterThanZero)
                {
                        topTicks = Math.round( units / ((-1 * min)/max + 1)    );
                        topTicks = Math.max(Math.min(topTicks, units - 1), 1);
                        botTicks = units - topTicks;
                        tempMax = Math.ceil( max/topTicks );

                        tempMin = Math.floor( min/botTicks ) * -1;
                        
                        roundingUnit = Math.max(tempMax, tempMin);
                        roundingUnit = this._getNiceNumber(roundingUnit);  
                        max = roundingUnit * topTicks;
                        min = roundingUnit * botTicks * -1;
                }
                else
                {
                    if(alwaysShowZero || max === 0 || max + roundingUnit > 0)
                    {
                        max = 0;
                        roundingUnit = this._getMinimumUnit(max, min, units);
                    }
                    else
                    {
                        max = this._roundUpToNearest(max, roundingUnit);
                    }
                    min = max - (roundingUnit * units);
                }
            }
            else if(roundingMethod == "auto") 
            {
                if(minGreaterThanZero && maxGreaterThanZero)
                {
                    if(alwaysShowZero || min < (max-min)/units)
                    {
                        min = 0;
                    }
                
                    roundingUnit = (max - min)/units;
                    if(useIntegers)
                    {
                        roundingUnit = Math.ceil(roundingUnit);
                    }
                    max = min + (roundingUnit * units);
                }
                else if(maxGreaterThanZero && !minGreaterThanZero)
                {
                    if(alwaysShowZero)
                    {
                        topTicks = Math.round( units / ( (-1 * min) /max + 1) );
                        topTicks = Math.max(Math.min(topTicks, units - 1), 1);
                        botTicks = units - topTicks;

                        if(useIntegers)
                        {
                            tempMax = Math.ceil( max/topTicks );
                            tempMin = Math.floor( min/botTicks ) * -1;
                        }
                        else
                        {
                            tempMax = max/topTicks;
                            tempMin = min/botTicks * -1;
                        }
                        roundingUnit = Math.max(tempMax, tempMin);
                        max = roundingUnit * topTicks;
                        min = roundingUnit * botTicks * -1;
                    }
                    else
                    {
                        roundingUnit = (max - min)/units;
                        if(useIntegers)
                        {
                            roundingUnit = Math.ceil(roundingUnit);
                        }
                        min = this._roundDownToNearest(min, roundingUnit);
                        max = this._roundUpToNearest(max, roundingUnit);
                    }
                }
                else
                {
                    roundingUnit = (max - min)/units;
                    if(useIntegers)
                    {   
                        roundingUnit = Math.ceil(roundingUnit);
                    }
                    if(alwaysShowZero || max === 0 || max + roundingUnit > 0)
                    {
                        max = 0;
                        roundingUnit = (max - min)/units;
                        if(useIntegers)
                        {
                            Math.ceil(roundingUnit);
                        }
                    }
                    else
                    {
                        max = this._roundUpToNearest(max, roundingUnit);
                    }
                    min = max - (roundingUnit * units);

                }
            }
            else if(!isNaN(roundingMethod) && isFinite(roundingMethod))
            {
                roundingUnit = roundingMethod;
                minimumRange = roundingUnit * units;
                dataRangeGreater = (max - min) > minimumRange;
                minRound = this._roundDownToNearest(min, roundingUnit);
                maxRound = this._roundUpToNearest(max, roundingUnit);
                if(minGreaterThanZero && maxGreaterThanZero)
                {
                    if(alwaysShowZero || minRound <= 0)
                    {
                        min = 0;
                    }
                    else
                    {
                        min = minRound;
                    }
                    if(!dataRangeGreater)
                    {
                        max = min + minimumRange;
                    }
                    else
                    {
                        max = maxRound;
                    }
                }
                else if(maxGreaterThanZero && !minGreaterThanZero)
                {
                    min = minRound;
                    if(!dataRangeGreater)
                    {
                        max = min + minimumRange;
                    }
                    else
                    {
                        max = maxRound;
                    }
                }
                else
                {
                    if(max === 0 || alwaysShowZero)
                    {
                        max = 0;
                    }
                    else
                    {
                        max = maxRound;
                    }
                    if(!dataRangeGreater)
                    {
                        min = max - minimumRange;
                    }
                    else
                    {
                        min = minRound;
                    }
                }
            }
        }
        this._dataMaximum = max;
        this._dataMinimum = min;
    },

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
            increm = (max - min)/(l-1),
            label;
            l -= 1;
        label = min + (i * increm);
        if(i > 0)
        {
            label = this._roundToNearest(label, increm);
        }
        return label;
    },

    /**
     * @private
     *
     * Rounds a Number to the nearest multiple of an input. For example, by rounding
     * 16 to the nearest 10, you will receive 20. Similar to the built-in function Math.round().
     */
    _roundToNearest: function(number, nearest)
    {
        nearest = nearest || 1;
        if(nearest === 0)
        {
            return number;
        }
        var roundedNumber = Math.round(this._roundToPrecision(number / nearest, 10)) * nearest;
        return this._roundToPrecision(roundedNumber, 10);
    },
	
    /**
     * @private
     *
     * Rounds a Number <em>up</em> to the nearest multiple of an input. For example, by rounding
     * 16 up to the nearest 10, you will receive 20. Similar to the built-in function Math.ceil().
     */
    _roundUpToNearest: function(number, nearest)
    {
        nearest = nearest || 1;
        if(nearest === 0)
        {
            return number;
        }
        return Math.ceil(this._roundToPrecision(number / nearest, 10)) * nearest;
    },
	
    /**
     * @private
     *
     * Rounds a Number <em>down</em> to the nearest multiple of an input. For example, by rounding
     * 16 down to the nearest 10, you will receive 10. Similar to the built-in function Math.floor().
     */
    _roundDownToNearest: function(number, nearest)
    {
        nearest = nearest || 1;
        if(nearest === 0)
        {
            return number;
        }
        return Math.floor(this._roundToPrecision(number / nearest, 10)) * nearest;
    },

    /**
     * @private
     *
     * Rounds a number to a certain level of precision. Useful for limiting the number of
     * decimal places on a fractional number.
     */
    _roundToPrecision: function(number, precision)
    {
        precision = precision || 0;
        var decimalPlaces = Math.pow(10, precision);
        return Math.round(decimalPlaces * number) / decimalPlaces;
    }
});

Y.NumericAxis = NumericAxis;
		
