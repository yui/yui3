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
    _indices: null,

	/**
	 * Constant used to generate unique id.
	 */
	GUID: "yuicategoryaxis",
	
    /**
	 * @private
	 */
	_dataType: "category",
		
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
	    if(!this._indices)
        {
            this._indices = {};
        }
        for(i = 0; i < len; ++i)
		{
			obj = dv[i];
			arr[i] = i;
			labels[i] = obj[key];
		}
        this._indices[key] = arr;
		this.get("keys")[key] = labels.concat();
		this._data = this._data.concat(labels);
	},

	/**
	 * Returns an array of values based on an identifier key.
	 */
	getDataByKey: function (value)
	{
		var keys = this._indices;
		if(keys[value])
		{
			return keys[value];
		}
		return null;
	},

    getTotalMajorUnits: function(majorUnit, len)
    {
        return this._data.length;
    },
    
    getMajorUnitDistance: function(len, uiLen, majorUnit)
    {
        var dist;
        if(majorUnit.determinant === "count")
        {
            dist = uiLen/len;
        }
        else if(majorUnit.determinant === "distance")
        {
            dist = majorUnit.distance;
        }
        return dist;
    },
   
    getEdgeOffset: function(ct, l)
    {
        return l/ct;
    },
    
    getLabelAtPosition: function(pos, len, format)
    {
        var count = this._data.length - 1,
        i = Math.round(pos/(len/count));
        return this._data[i];
    }
});

Y.CategoryAxis = CategoryAxis;
		
