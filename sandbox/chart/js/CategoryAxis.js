function CategoryAxis(config)
{
	CategoryAxis.superclass.constructor.apply(this, arguments);
}

CategoryAxis.NAME = "categoryAxis";

Y.extend(CategoryAxis, Y.BaseAxis,
{
	/**
	 * Constant used to generate unique id.
	 */
	GUID: "yuicategoryaxis",
	
    /**
	 * @private
	 */
	_dataType: "category",
		
	/**
	 * @private (override)
	 * Returns a numeric value based of a key value and an index.
	 */
	_getKeyValueAt: function(key, index)
	{
		var value = NaN;
		if(this.keys[key])
		{
			value = index;
		}
		return value;
	},

	/**
	 * @private
	 */
	_updateMinAndMax: function()
	{
		this._dataMaximum = Math.max(this._data.length - 1, 0);
		this._dataMinimum = 0;
	},

	/**
	 * @private
	 */
	_setDataByKey: function(key)
	{
		var i,
			obj, 
			arr = [], 
			labels = [], 
			dv = this._dataClone.concat(), 
			len = dv.length;
		for(i = 0; i < len; ++i)
		{
			obj = dv[i];
			arr[i] = i;
			labels[i] = obj[key];
		}
		this._keys[key] = arr;
		this._data = this._data.concat(labels);
	},

    getTotalMajorUnits: function(majorUnit, len)
    {
        return this._data.length;
    },
    
    getLabelAtPosition: function(pos, len, format)
    {
        var count = this._data.length - 1,
        i = Math.round(pos/(len/count));
        return this._data[i];
    }
			
});

Y.CategoryAxis = CategoryAxis;
		
