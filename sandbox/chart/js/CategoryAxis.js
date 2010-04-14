function CategoryAxis(config)
{
	CategoryAxis.superclass.constructor.apply(this, arguments);
}

CategoryAxis.NAME = "categoryAxis";

Y.extend(CategoryAxis, Y.BaseAxis,
{
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
		this._dataMaximum = Math.max(this.data.length - 1, 0);
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
	}
});

Y.CategoryAxis = CategoryAxis;
		
