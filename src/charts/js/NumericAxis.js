function NumericAxis(config)
{
	NumericAxis.superclass.constructor.apply(this, arguments);
}

NumericAxis.NAME = "numericAxis";

NumericAxis.ATTRS = {
	/**
	 * Indicates whether 0 should always be displayed.
	 */
	alwaysShowZero: {
	    value: true	
	},
    
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

Y.extend(NumericAxis, Y.BaseAxis,
{
	/**
	 * @private
	 */
	_type: "numeric",
	
	/**
	 * @private
	 * Storage for alwaysShowZero
	 */
	_alwaysShowZero: true,

    _getMinimumUnit:function(max, min, units)
    {
        return this._getNiceNumber(Math.ceil((max - min)/units));
    },

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
	 * Determines the maximum and minimum values for the axis.
	 */
	_updateMinAndMax: function()
	{
		var data = this.get("data"),
			max = 0,
			min = 0,
			len,
			num,
			i,
            key;
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
                        continue;
					}
					max = Math.max(num, max);
					min = Math.min(num, min);
				}
			}
		}
        this._roundMinAndMax(min, max);
	},

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
            roundMinAndMax = this.get("roundMinAndMax"),
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
                
                    //roundingUnit = Math.ceil((max - min)/units);
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
                        //roundingUnit = Math.ceil((max - min)/units);
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
	 * Rounds a Number to the nearest multiple of an input. For example, by rounding
	 * 16 to the nearest 10, you will receive 20. Similar to the built-in function Math.round().
	 * 
	 * @param	numberToRound		the number to round
	 * @param	nearest				the number whose mutiple must be found
	 * @return	the rounded number
	 * 
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
	 * Rounds a Number <em>up</em> to the nearest multiple of an input. For example, by rounding
	 * 16 up to the nearest 10, you will receive 20. Similar to the built-in function Math.ceil().
	 * 
	 * @param	numberToRound		the number to round up
	 * @param	nearest				the number whose mutiple must be found
	 * @return	the rounded number
	 * 
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
	 * Rounds a Number <em>down</em> to the nearest multiple of an input. For example, by rounding
	 * 16 down to the nearest 10, you will receive 10. Similar to the built-in function Math.floor().
	 * 
	 * @param	numberToRound		the number to round down
	 * @param	nearest				the number whose mutiple must be found
	 * @return	the rounded number
	 * 
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
	 * Rounds a number to a certain level of precision. Useful for limiting the number of
	 * decimal places on a fractional number.
	 * 
	 * @param		number		the input number to round.
	 * @param		precision	the number of decimal digits to keep
	 * @return		the rounded number, or the original input if no rounding is needed
	 * 
	 */
	_roundToPrecision: function(number, precision)
	{
		precision = precision || 0;
		var decimalPlaces = Math.pow(10, precision);
		return Math.round(decimalPlaces * number) / decimalPlaces;
	}
});

Y.NumericAxis = NumericAxis;
		
