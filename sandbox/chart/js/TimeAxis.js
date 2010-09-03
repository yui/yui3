function TimeAxis(config)
{
	TimeAxis.superclass.constructor.apply(this, arguments);
}

TimeAxis.NAME = "timeAxis";

TimeAxis.ATTRS = 
{
    maximum: {
		getter: function ()
		{
			if(this._autoMax || this._setMaximum === null) 
			{
                return this._getNumber(this._dataMaximum);
			}
			return this._setMaximum;
		},
		setter: function (value)
		{
            this._setMaximum = this._getNumber(value);
            this.fire("dataChange");
		}
    },

    minimum: {
		getter: function ()
		{
			if(this._autoMin || this._setMinimum === null) 
			{
				return this._dataMinimum;
			}
			return this._setMinimum;
		},
		setter: function (value)
		{
            this._setMinimum = this._getNumber(value);
            this.fire("dataChange");
        }
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
		
	/**
	 * @private (override)
	 */
	_setDataByKey: function(key)
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
		this._data = this._data.concat(arr);
	},

    _getNumber: function(val)
    {
        if(Y.Lang.isDate(val))
        {
            val = val.valueOf();
        }
        else if(!Y.Lang.isNumber(val))
        {
            val = new Date(val.toString()).valueOf();
        }

        return val;
    },

    updateMaxByPosition:function(pos)
    {
        var range = this._dataMaximum - this._dataMinimum;
            pos = Math.round(pos * 100)/100;
            pos = pos * range;
            pos += this._dataMinimum;
        this.set("maximum", pos);
    },

    updateMinByPosition:function(pos)
    {
        var range = this._dataMaximum - this._dataMinimum;
            pos = Math.round(pos * 100)/100;
            pos = pos * range;
            pos += this._dataMinimum;
        this.set("minimum", pos);
    },

    updateMinAndMaxByPosition: function(minVal, maxVal, len)
    {
        var min = minVal / len,
            max = maxVal / len;
        min += this._dataMinimum;
        max += this._dataMaximum;
        this._setMaximum = this._getNumber(max);
        this._setMinimum = this._getNumber(min);
        this.fire("dataChange");
    },
    
    _defaultLabelFunction: function(val, format)
    {
        return Y.DataType.Date.format(Y.DataType.Date.parse(val), {format:format});
    }
});

Y.TimeAxis = TimeAxis;
		
