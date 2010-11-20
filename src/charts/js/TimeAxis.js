function TimeAxis(config)
{
	TimeAxis.superclass.constructor.apply(this, arguments);
}

TimeAxis.NAME = "timeAxis";

TimeAxis.ATTRS = 
{
    setMax: {
        readOnly: true,

        getter: function()
        {
            var max = this._getNumber(this._setMaximum);
            return (Y.Lang.isNumber(max));
        }
    },

    setMin: {
        readOnly: true,

        getter: function()
        {
            var min = this._getNumber(this._setMinimum);
            return (Y.Lang.isNumber(min));
        }
    },

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

    labelFormat: {
        value: "%b %d, %y"
    }
};

Y.extend(TimeAxis, Y.BaseAxis, {
	/**
	 * Constant used to generate unique id.
	 */
	GUID: "yuitimeaxis",
	
    /**
	 * @private
	 */
	_dataType: "time",
		
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
            else if(!Y.Lang.isNumber(obj))
            {
                val = new Date(obj.toString()).valueOf();
            }
            else
            {
                val = obj;
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
			else if(!Y.Lang.isNumber(obj))
			{
				val = new Date(obj.toString()).valueOf();
			}
			else
			{
				val = obj;
			}
			arr[i] = val;
		}
		this.get("keys")[key] = arr;
        this._updateTotalDataFlag = true;
    },

    _getNumber: function(val)
    {
        if(Y.Lang.isDate(val))
        {
            val = val.valueOf();
        }
        else if(!Y.Lang.isNumber(val) && val)
        {
            val = new Date(val.toString()).valueOf();
        }

        return val;
    }
});

Y.TimeAxis = TimeAxis;
		
