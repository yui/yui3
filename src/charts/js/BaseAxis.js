/**
 * BaseAxis is the base class for observable baseAxis classes.
 */



/**
 * Creates the BaseAxis instance and contains initialization data
 *
 * @param {Object} config (optional) Configuration parameters for the Chart.
 * @class SWFWidget
 * @constructor
 */
Y.BaseAxis = Y.Base.create("baseAxis", Y.Axis, [], {
    /**
     * @private
     */
    bindUI: function()
    {
        this.after("dataReady", Y.bind(this._dataChangeHandler, this));
        this.after("dataUpdate", Y.bind(this._dataChangeHandler, this));
        this.after("keysChange", this._keyChangeHandler);
        this.after("dataProviderChange", this._dataProviderChangeHandler);
        this.after("stylesChange", this._updateHandler);
        this.after("positionChange", this._positionChangeHandler);
        this.after("overlapGraphChange", this._updateHandler);
        this.after("widthChange", this._handleSizeChange);
        this.after("heightChange", this._handleSizeChange);
        this.after("alwaysShowZeroChange", this._keyChangeHandler);
        this.after("roundingMethodChange", this._keyChangeHandler);
    },

    _dataProviderChangeHandler: function(e)
    {
        var keyCollection = this.get("keyCollection").concat(),
            keys = this.get("keys"),
            i;
        if(keys)
        {
            for(i in keys)
            {
                if(keys.hasOwnProperty(i))
                {
                    delete keys[i];
                }
            }
        }
        if(keyCollection && keyCollection.length)
        {
            this.set("keys", keyCollection);
        }
    },

    /**
	 * Constant used to generate unique id.
	 */
	GUID: "yuibaseaxis",
	
	/**
	 * @private 
	 * Storage for type
	 */
	_type: null,
	/**
	 * @private
	 * Storage for maximum when autoMax is false.
	 */
	_setMaximum: null,
	/**
	 * @private
	 * Storage for dataMaximum
	 * is true.
	 */
	_dataMaximum: null,
	
    /**
	 * @private
	 * Storage for minimum when autoMin is false.
	 */
	_setMinimum: null,
	/**
	 * @private
	 * Storage for data
	 */
	_data: null,
	/**
	 * @private
	 * Storage for keys
	 */
    _updateTotalDataFlag: true,

	/**
	 * @private
	 * Indicates that the axis has a data source and at least one
	 * key.
	 */
	_dataReady: false,
	/**
	 * Adds an array to the key hash.
	 *
	 * @param value Indicates what key to use in retrieving
	 * the array.
	 */
	addKey: function (value)
	{
        this.set("keys", value);
	},

    /**
     * @private
     * @description Returns an array of values for a given key.
     */
    _getKeyArray: function(key, data)
    {
        var i = 0,
            obj,
            keyArray = [],
            len = data.length;
        for(; i < len; ++i)
        {
            obj = data[i];
            keyArray[i] = obj[key];
        }
        return keyArray;
    },

	/**
	 * @private 
	 *
	 * Creates an array of data based on a key value.
	 */
	_setDataByKey: function(key, data)
	{
		var i,
			obj, 
			arr = [], 
			dv = this._dataClone.concat(), 
			len = dv.length;
		for(i = 0; i < len; ++i)
		{
			obj = dv[i];
			arr[i] = obj[key];
		}
		this.get("keys")[key] = arr;
	    this._updateTotalDataFlag = true;
    },

    /**
     * @private
     */
    _updateTotalData: function()
    {
		var keys = this.get("keys"),
            i;
        this._data = [];
        for(i in keys)
        {
            if(keys.hasOwnProperty(i))
            {
                this._data = this._data.concat(keys[i]);
            }
        }
        this._updateTotalDataFlag = false;
    },

	/**
	 * Removes an array from the key hash.
	 * 
	 * @param value Indicates what key to use in removing from 
	 * the hash.
	 * @return Boolean
	 */
	removeKey: function(value)
	{
		var keys = this.get("keys");
        if(keys.hasOwnProperty(value)) 
		{
			delete keys[value];
		    this._keyChangeHandler();
        }
    },

	/**
	 * Returns a numeric value based of a key value and an index.
	 */
	getKeyValueAt: function(key, index)
	{
		var value = NaN,
			keys = this.get("keys");
		if(keys[key] && keys[key][index]) 
		{
			value = keys[key][index];
		}
		return value;
	},

	/**
	 * Returns an array of values based on an identifier key.
	 */
	getDataByKey: function (value)
	{
		var keys = this.get("keys");
		if(keys[value])
		{
			return keys[value];
		}
		return null;
	},

	/**
	 * @private 
	 * Updates the <code>dataMaximum</code> and <code>dataMinimum</code> values.
	 */
	_updateMinAndMax: function() 
	{
		var data = this.get("data"),
			max = 0,
			min = 0,
			len,
			num,
			i;
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
						continue;
					}
					max = Math.max(num, max);
					min = Math.min(num, min);
				}
			}
		}
		this._dataMaximum = max;
		this._dataMinimum = min;
	},

    /**
     * @description
     * Returns the total number of majorUnits that will appear on an axis.
     */
    getTotalMajorUnits: function()
    {
        var units,
            majorUnit = this.get("styles").majorUnit,
            len = this.get("length");
        if(majorUnit.determinant === "count") 
        {
            units = majorUnit.count;
        }
        else if(majorUnit.determinant === "distance") 
        {
            units = (len/majorUnit.distance) + 1;
        }
        return units; 
    },

    /**
     * @description Returns the distance between major units on an axis.
     */
    getMajorUnitDistance: function(len, uiLen, majorUnit)
    {
        var dist;
        if(majorUnit.determinant === "count")
        {
            dist = uiLen/(len - 1);
        }
        else if(majorUnit.determinant === "distance")
        {
            dist = majorUnit.distance;
        }
        return dist;
    },

    getEdgeOffset: function(ct, l)
    {
        return 0;
    },

    getLabelByIndex: function(i, l)
    {
        var min = this.get("minimum"),
            max = this.get("maximum"),
            increm = (max - min)/(l-1),
            label;
            l -= 1;
            label = min + (i * increm);
        return label;
    },

    _keyChangeHandler: function(e)
    {
        this._updateMinAndMax();
		this.fire("dataUpdate");
    }
}, {
    ATTRS: {
        /**
         * Hash of array identifed by a string value.
         */
        keys: {
            value: {},

            setter: function(val)
            {
                var keys = {},
                    i, 
                    len,
                    data = this.get("dataProvider");
                if(Y.Lang.isArray(val))
                {
                    len = val.length;
                    for(i = 0; i < len; ++i)
                    {
                        keys[val[i]] = this._getKeyArray(val[i], data);   
                    }
                    
                }
                else if(Y.Lang.isString(val))
                {
                    keys = this.get("keys");
                    keys[val] = this._getKeyArray(val, data);
                }
                else
                {
                    for(i in val)
                    {
                        if(val.hasOwnProperty(i))
                        {
                            keys[i] = this._getKeyArray(i, data);
                        }
                    }
                }
	            this._updateTotalDataFlag = true;
                return keys;
            }
        },

        /**
         *Indicates how to round unit values.
         *  <ul>
         *    <li>niceNumber</li>
         *    <li>auto</li>
         *    <li>numeric value</li>
         *    <li>null</li>
         *  </ul>
         */
        roundingMethod: {
            value: "niceNumber"
        },

        /**
         *Returns the type of axis data
         *  <ul>
         *    <li><code>time</code></li>
         *    <li><code>numeric</code></li>
         *    <li><code>category</code></li>
         *  </ul>
         */
        type:
        {
            readOnly: true,

            getter: function ()
            {
                return this._type;
            }
        },

        /**
         * Instance of <code>ChartDataProvider</code> that the class uses
         * to build its own data.
         */
        dataProvider:{
            setter: function (value)
            {
                return value;
            }
        },

        /**
         * The maximum value contained in the <code>data</code> array. Used for
         * <code>maximum</code> when <code>autoMax</code> is true.
         */
        dataMaximum: {
            getter: function ()
            {
                if(!this._dataMaximum)
                {   
                    this._updateMinAndMax();
                }
                return this._dataMaximum;
            }
        },

        /**
         * The maximum value that will appear on an axis.
         */
        maximum: {
            getter: function ()
            {
                var max = this.get("dataMaximum");
                if(this.get("setMax")) 
                {
                    max = this._setMaximum;
                }
                return max;
            },
            setter: function (value)
            {
                this._setMaximum = value;
                return value;
            }
        },

        /**
         * The minimum value contained in the <code>data</code> array. Used for
         * <code>minimum</code> when <code>autoMin</code> is true.
         */
        dataMinimum: {
            getter: function ()
            {
                if(!this._dataMinimum)
                {
                    this._updateMinAndMax();
                }
                return this._dataMinimum;
            }
        },

        /**
         * The minimum value that will appear on an axis.
         */
        minimum: {
            getter: function ()
            {
                var min = this.get("dataMinimum");
                if(this.get("setMin"))
                {
                    min = this._setMinimum;
                }
                return min;
            },
            setter: function(val)
            {
                this._setMinimum = val;
                return val;
            }
        },

        /**
         * Determines whether the maximum is calculated or explicitly 
         * set by the user.
         */
        setMax: {
            readOnly: true,

            getter: function()
            {
                return Y.Lang.isNumber(this._setMaximum);
            }
        },

        /**
         * Determines whether the minimum is calculated or explicitly
         * set by the user.
         */
        setMin: {
            readOnly: true,

            getter: function()
            {
                return Y.Lang.isNumber(this._setMinimum);
            }
        },

        /**
         * Array of axis data
         */
        data: {
            getter: function ()
            {
                if(!this._data || this._updateTotalDataFlag)
                {
                    this._updateTotalData();
                }
                return this._data;
            }
        },

        keyCollection: {
            getter: function()
            {
                var keys = this.get("keys"),
                    i, 
                    col = [];
                for(i in keys)
                {
                    if(keys.hasOwnProperty(i))
                    {
                        col.push(i);
                    }
                }
                return col;
            },
            readOnly: true
        },

        labelFunction: {
            value: function(val, format)
            {
                return val;
            }
        }
    }
});
