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
	_type: "category",
		
	/**
	 * @private
	 */
	_updateMinAndMax: function()
	{
		this._dataMaximum = Math.max(this.get("data").length - 1, 0);
		this._dataMinimum = 0;
	},

    _getKeyArray: function(key, data)
    {
        var i = 0,
            obj,
            keyArr = [],
            labels = [],
            len = data.length;
        if(!this._indices)
        {
            this._indices = {};
        }
        for(; i < len; ++i)
        {
            obj = data[i];
            keyArr[i] = i;
            labels[i] = obj[key];
        }
        this._indices[key] = keyArr;
        return labels;
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
	    this._updateTotalDataFlag = true;
    },

    /**
     * Returns an array of values based on an identifier key.
     */
    getDataByKey: function (value)
    {
        if(!this._indices)
        {
            this.get("keys");
        }
        var keys = this._indices;
        if(keys[value])
        {
            return keys[value];
        }
        return null;
    },

    getTotalMajorUnits: function(majorUnit, len)
    {
        return this.get("data").length;
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
   
    getLabelByIndex: function(i, l, format)
    {
        return this.get("data")[i];
    },

    getLabelAtPosition: function(pos, len, format)
    {
        var count = this.get("data").length - 1,
        i = Math.round(pos/(len/count));
        return this.get("data")[i];
    }
});

Y.CategoryAxis = CategoryAxis;
		
