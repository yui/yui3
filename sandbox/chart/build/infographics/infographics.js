YUI.add('infographics', function(Y) {

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
function BaseAxis (config)
{
    this._createId();
    this._keys = {};
    this._data = [];
    this._keyCollection = [];
    BaseAxis.superclass.constructor.apply(this, arguments);
}

BaseAxis.NAME = "baseAxis";

/**
 * Attribute config
 * @private
 */
BaseAxis.ATTRS = {
	/**
	 * Parent element for the BaseAxis instance.
	 */
	parent:{
		lazyAdd:false,
		
		value:null
	},

	/**
	 * @private 
	 * Storage for rounding unit
	 */
	roundingUnit:{
		getter: function ()
		{
			return this._roundingUnit;
		},
		setter: function (val)
		{
			this._roundingUnit = val;
			if(this._roundMinAndMax) 
			{
				this._updateMinAndMax();
			}
			return val;
		}
 	},

	/**
	 * Indicates whether or not to round values when calculating
	 * <code>maximum</code> and <code>minimum</code>.
	 */
	roundMinAndMax:{
		getter: function ()
		{
			return this._roundMinAndMax;
		},
		setter: function (val)
		{
			if(this._roundMinAndMax == val) 
			{
				return val;
			}
			this._roundMinAndMax = val;
			this._updateMinAndMax();
		}
  	},

	/**
	 * Returns the type of axis data
	 * <ul>
	 * 	<li><code>time</code></li>
	 * 	<li><code>numeric</code></li>
	 * 	<li><code>category</code></li>
	 * </ul>
	 */
	dataType:
	{
		getter: function ()
		{
			return this._dataType;
		}
	},

	/**
	 * Instance of <code>ChartDataProvider</code> that the class uses
	 * to build its own data.
	 */
	dataProvider:{
		getter: function ()
		{
			return this._dataProvider;
		},
		setter: function (value)
		{
			if(value === this._dataProvider) 
			{
				return;
			}
			if(this._dataProvider) 
			{
				//remove listeners
			}
			if(value.hasOwnProperty("data") && Y.Lang.isArray(value.data))
            {
                value = Y.merge(value);
                value = value.data;
            }
            this._dataProvider = {data:value.concat()};
			this._dataClone = this._dataProvider.data.concat();
			return value;
		},
		lazyAdd: false
	},

	/**
	 * The maximum value contained in the <code>data</code> array. Used for
	 * <code>maximum</code> when <code>autoMax</code> is true.
	 */
	dataMaximum: {
		getter: function ()
		{
			return this._dataMaximum;
		}
	},

	/**
	 * The maximum value that will appear on an axis.
	 */
	maximum: {
		getter: function ()
		{
			if(this._autoMax || !this._setMaximum) 
			{
				return this._dataMaximum;
			}
			return this._setMaximum;
		},
		setter: function (value)
		{
			this._setMaximum = value;
		}
	},

	/**
	 * The minimum value contained in the <code>data</code> array. Used for
	 * <code>minimum</code> when <code>autoMin</code> is true.
	 */
	dataMinimum: {
		getter: function ()
		{
			return this._dataMinimum;
		}
	},

	/**
	 * The minimum value that will appear on an axis.
	 */
	minimum: {
		getter: function ()
		{
			if(this._autoMin || !this._setMinimum) 
			{
				return this._dataMinimum;
			}
			return this._setMinimum;
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
	autoMax: {
		getter: function ()
		{
			return this._autoMax;
		},
		setter: function (value)
		{
			this._autoMax = value;
		}
	},

	/**
	 * Determines whether the minimum is calculated or explicitly
	 * set by the user.
	 */
	autoMin: {
		getter: function ()
		{
			return this._autoMin;
		},
		setter: function (value)
		{
			this._autoMin = value;
		}
	},

	/**
	 * Array of axis data
	 */
	data: {
		getter: function ()
		{
			return this._data;
		}
	},

	/**
	 * Hash of array identifed by a string value.
	 */
	keys: {
		lazyAdd: false,

        getter: function ()
		{
			return this._keys;
		},

        setter: function(val)
        {
            var i, l;
            if(Y.Lang.isArray(val))
            {
                l = val.length;
                for(i = 0; i < l; ++i)
                {
                    this.addKey(val[i]);
                }
                return;
            }
            for(i in val)
            {
                if(val.hasOwnProperty(i))
                {
                    this.addKey(val[i]);
                }
            }
        }
	},

    keyCollection: {
        getter: function()
        {
            return this._keyCollection;
        },
        readOnly: true
    },

    labelFunction: {
        getter: function()
        {
            if(this._labelFunction)
            {
                return this._labelFunction;
            }
            return this._defaultLabelFunction;
        },

        setter: function(val)
        {
            this._labelFunction = val;
        }
    }
};

Y.extend(BaseAxis, Y.Base,
{
	/**
	 * Constant used to generate unique id.
	 */
	GUID: "yuibaseaxis",
	
    /**
	 * Creates unique id for class instance.
	 *
	 * @private
	 */
	_createId: function()
	{
		this._id = Y.guid(this.GUID);
	},
	/**
	 * @private
	 * Storaga for roundingUnit
	 */
	_roundingUnit: NaN,
	/**
	 * @private 
	 * Storage for round min and max
	 */
	_roundMinAndMax: true,
	/**
	 * @private 
	 * Storage for dataType
	 */
	_dataType: null,
	/**
	 * @private
	 * Storage for dataProvider
	 */
	_dataProvider: null,
	/**
	 * @private 
	 * Instance copy of the ChartDataProvider's data array.
	 */
	_dataClone: null,
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
	 * Storage for autoMax
	 */
	_autoMax: true,
	/**
	 * @private
	 * Storage for minimum when autoMin is false.
	 */
	_setMinimum: null,
	/**
	 * @private
	 * Storage for dataMinimum. 
	 */
	_dataMinimum: null,
	/**
	 * @private 
	 * Storage for autoMin.
	 */
	_autoMin: true,
	/**
	 * @private
	 * Storage for data
	 */
	_data: null,
	/**
	 * @private
	 * Storage for keys
	 */
	_keys: null,

	/**
	 * @private
	 * Indicates that the axis has a data source and at least one
	 * key.
	 */
	_axisReady: false,
	/**
	 * Adds an array to the key hash.
	 *
	 * @param value Indicates what key to use in retrieving
	 * the array.
	 */
	addKey: function (value)
	{
		if(this.get("keys").hasOwnProperty(value)) 
		{
			return;
		}
        this._keyCollection.push(value);
		this._dataClone = this.get("dataProvider").data.concat();
		var keys = this.get("keys"),
			eventKeys = {},
			event = {axis:this};
		this._setDataByKey(value);
		eventKeys[value] = keys[value].concat();
		this._updateMinAndMax();
		event.keysAdded = eventKeys;
		if(!this._dataReady)
		{
			this._dataReady = true;
			this.publish("axisReady", {fireOnce:true});
			this.fire("axisReady", event);
		}
		else
		{
			this.fire("axisUpdate", event);
		}
	},

	/**
	 * @private 
	 *
	 * Creates an array of data based on a key value.
	 */
	_setDataByKey: function(key)
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
		this._data = this._data.concat(arr);
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
		if(!this.get("keys").hasOwnProperty(value)) 
		{
			return;
		}
		var key,
			oldKey,
			newKeys = {},
			newData = [],
			removedKeys = {},
			keys = this.get("keys"),
			event = {},
            keyCollection = this.get("keyCollection"),
            i = Y.Array.indexOf(keyCollection, value);
        if(keyCollection && keyCollection.length > 0 && i > -1)
        {
            keyCollection.splice(i, 1);
        }
        removedKeys[value] = keys[value].concat();
        for(key in keys)
        {
            if(keys.hasOwnProperty(key))
            {
                if(key == value) 
                {
                    continue;
                }
                oldKey = keys[key];
                newData = newData.concat(oldKey);
                newKeys[key] = oldKey;
            }
        }
        keys = newKeys;
        this._data = newData;
        this._updateMinAndMax();
        event.keysRemoved = removedKeys;
        this.fire("axisUpdate", event);
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
	_updateMinAndMax: function ()
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
	 * @private 
	 * Handles updates axis data properties based on the <code>DataEvent.NEW_DATA</code>
	 * event from the <code>dataProvider</code>.
	 */
	newDataUpdateHandler: function()
	{
		var i,
			keys = this.get("keys"),
			event = {}; 
		this._data = [];
		this._dataClone = this.get("dataProvider").data.concat();
		for(i in keys)
		{
			if(keys.hasOwnProperty(i))
			{
				keys[i] = this._setDataByKey(i);
				this._data = this._data.concat(keys[i]);
			}
		}
		this._updateMinAndMax();
		event.keysAdded = keys;
		this.fire("axisUpdate", event);
	},
	/**
	 * @private 
	 * Updates axis data properties based on the <code>DataEvent.DATA_CHANGE</code>
	 * event from the <code>dataProvider</code>.
	 */
	_keyDataUpdateHandler: function ()
	{
		var hasKey = false,
			event = {},
			keysAdded = event.keysAdded,
			keysRemoved = event.keysRemoved,
			keys = this.get("keys"),
            i;
		for(i in keys)
		{
			if(keys.hasOwnProperty(i))
			{
				if(keysAdded.hasOwnProperty(i))
				{
					hasKey = true;
					keys[i] = keys[i];
				}
				if(keysRemoved.hasOwnProperty(i))
				{
					hasKey = true;
					keys[i] = [];
				}
			}
		}
		if(!hasKey) 
		{
			return;
		}
		this._data = [];
		for(i in keys) 
		{
			if(keys.hasOwnProperty(i))
			{
				this._data = this._data.concat(keys[i]);
			}
		}
		this._updateMinAndMax();
		event.keysAdded = keysAdded;
		event.keysRemoved = keysRemoved;
		this.fire("axisUpdate", event);
    },

    getTotalMajorUnits: function(majorUnit, len)
    {
        var units;
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

    getLabelAtPosition:function(pos, len, format)
    {
        var min = this.get("minimum"),
            max = this.get("maximum"),
            val = (pos/len * (max - min)) + min;
        return this.get("labelFunction")(val, format);
    },

    _labelFunction: this._defaultLabelFunction,
    
    _defaultLabelFunction: function(val, format)
    {
        return val;
    }
});
Y.BaseAxis = BaseAxis;

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
		getter: function()
		{
			return this._alwaysShowZero;
		},
		setter: function(value)
		{
			if(value == this._alwaysShowZero) 
			{
				return;
			}
			this._alwaysShowZero = value;
			this._updateMinAndMax();
			return value;
		}
	}


};

Y.extend(NumericAxis, Y.BaseAxis,
{
	/**
	 * @private
	 */
	_dataType: "numeric",
	
	/**
	 * @private
	 * Storage for alwaysShowZero
	 */
	_alwaysShowZero: true,

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
		if(this._roundMinAndMax && !isNaN(this._roundingUnit))
		{
			this._dataMaximum = this._roundUpToNearest(max, this._roundingUnit);
			this._dataMinimum = this._roundDownToNearest(min, this._roundingUnit);
		}
		else
		{
			this._dataMaximum = max;
			this._dataMinimum = min;
		}
		if(this._alwaysShowZero)
		{
			this._dataMinimum = Math.min(0, this._dataMinimum);
		}
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
	},
    
    _defaultLabelFunction: function(val, format)
    {
        return Y.DataType.Number.format(val, format);
    }
});

Y.NumericAxis = NumericAxis;
		
function StackedAxis(config)
{
	StackedAxis.superclass.constructor.apply(this, arguments);
}

StackedAxis.NAME = "stackedAxis";


Y.extend(StackedAxis, Y.NumericAxis,
{
    /**
	 * @private
	 * Determines the maximum and minimum values for the axis.
	 */
	_updateMinAndMax: function()
	{
		var max = 0,
			min = 0,
			pos = 0,
            neg = 0,
            len = 0,
			i = 0,
            key,
            num,
            keys = this.get("keys");

        for(key in keys)
        {
            if(keys.hasOwnProperty(key))
            {
                len = Math.max(len, keys[key].length);
            }
        }
        for(; i < len; ++i)
        {
            pos = 0;
            neg = 0;
            for(key in keys)
            {
                if(keys.hasOwnProperty(key))
                {
                    num = keys[key][i];
					if(isNaN(num))
					{
                        continue;
					}
                    if(num >= 0)
                    {
                        pos += num;
                    }
                    else
                    {
                        neg += num;
                    }
                }
            }
            if(pos > 0)
            {
                max = Math.max(max, pos);
            }
            else 
            {
                max = Math.max(max, neg);
            }
            if(neg < 0)
            {
                min = Math.min(min, neg);
            }
            else
            {
                min = Math.min(min, pos);
            }
        }
        if(this._roundMinAndMax && !isNaN(this._roundingUnit))
		{
			this._dataMaximum = this._roundUpToNearest(max, this._roundingUnit);
			this._dataMinimum = this._roundDownToNearest(min, this._roundingUnit);
		}
		else
		{
			this._dataMaximum = max;
			this._dataMinimum = min;
		}
		if(this._alwaysShowZero && min > 0)
		{
			this._dataMinimum = Math.min(0, this._dataMinimum);
		}
	}
});

Y.StackedAxis = StackedAxis;
		
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
		
function Renderer(config)
{
    Renderer.superclass.constructor.apply(this, arguments);
}

Renderer.NAME = "renderer";

Renderer.ATTRS = {
    padding: {
        getter: function()
        {
            return this._padding || this._getDefPadding();
        },

        setter: function(val)
        {
            var def = this._padding || this._getDefPadding();
            this._padding = Y.merge(def, val);
        }
    },

    node: {
        value: null
    },
    
    /**
	 * The graphic in which the series will be rendered.
	 */
	graphic: {
        value: null
    },
	
    /**
	 * Hash of style properties for class
	 */
	styles:
	{
		value: {},

		getter: function()
		{
            this._styles = this._styles || this._getDefaultStyles();
			return this._styles;
		},
			   
		setter: function(val)
		{
			this._styles = this._setStyles(val);
			return this._styles;
		},
		
		validator: function(val)
		{
			return Y.Lang.isObject(val);
		}
	}
};

Y.extend(Renderer, Y.Widget, {
    /**
     * @private
     */
    renderUI: function()
    {
        this._setNode();
        if(!this.get("graphic"))
        {
            this._setCanvas();
        }
    },
    
    /**
     * @private
     */
    bindUI: function()
    {
        this.after("stylesChange", Y.bind(this._updateHandler, this));
    },
   
    /**
     * @private
     */
    syncUI: function()
    {
        this.draw();
    },

    /**
     * @private
     */
    _updateHandler: function(e)
    {
        if(this.get("rendered"))
        {
            this.draw();
        }
    },

    _setNode: function()
    {
       var cb = this.get("contentBox"),
            n = document.createElement("div"),
            style = n.style;
        cb.appendChild(n);
        style.position = "absolute";
        style.display = "block";
        style.top = "0px"; 
        style.left = "0px";
        style.width = "100%";
        style.height = "100%";
        this.set("node", n);
    },

    /**
     * @private
     * Creates a <code>Graphic</code> instance.
     */
    _setCanvas: function()
    {
        this.set("graphic", new Y.Graphic());
        this.get("graphic").render(this.get("contentBox"));
    },
	
    /**
     * @private
     * @description Hash of newly set styles.
     */
    _newStyles: null,

    /**
     * @private
     * @description Storage for styles
     */
	_styles: null,
	
    /**
	 * Sets multiple style properties on the instance.
	 *
	 * @method _setStyles
	 * @param {Object} styles Hash of styles to be applied.
	 */
	_setStyles: function(newstyles)
	{
		var styles = this.get("styles");
        return this._mergeStyles(newstyles, styles);
	},

	/**
	 * Merges to object literals only overriding properties explicitly.
	 * 
	 * @private
	 * @param {Object} newHash hash of properties to set
	 * @param {Object} default hash of properties to be overwritten
	 * @return {Object}
	 */
	_mergeStyles: function(a, b)
	{
        this._newStyles = {};
		if(!b)
        {
            b = {};
        }
        Y.Object.each(a, function(value, key, a)
		{
			if(b.hasOwnProperty(key) && Y.Lang.isObject(value) && !Y.Lang.isArray(value))
			{
				b[key] = this._mergeStyles(value, b[key]);
			}
			else
			{
				b[key] = value;
			    this._newStyles[key] = value;
            }
		}, this);
		return b;
	},

    /**
     * @private
     * @description Default style values.
     */
    _getDefaultStyles: function()
    {
        return {};
    },

    /**
     * @private
     */
    _getDefPadding: function()
    {
        return {
            top:0,
            right: 0,
            bottom: 0,
            left: 0
        };
    }
});

Y.Renderer = Renderer;

function Marker(config)
{
	Marker.superclass.constructor.apply(this, arguments);
}

Marker.NAME = "marker";

Marker.ATTRS = {
    series: {
        value: null
    },

    drawMethod: {
        getter: function()
        {
            return this._drawMethod;
        },
        setter: function(val)
        {
            this._drawMethod = val;
            return val;
        }
    },

    index: {
        value: null
    },

    colorIndex: {
        value: null
    },
    
    state: {
        value:"off"
    }
};

Y.extend(Marker, Y.Renderer, {
    bindUI: function()
    {
        this.after("stylesChange", Y.bind(this._updateHandler, this));
        this.after("stateChange", Y.bind(this._updateHandler, this));
    },

    /**
     * @private
     */
    renderUI: function()
    {
        if(!this.get("graphic"))
        {
            this._setCanvas();
        }
    },

    /**
     * @private
     */
    _updateHandler: function(e)
    {
        if(this.get("rendered"))
        {
            this._update();
        }
    },
    
    /**
	 * @private
	 */
    _handleMouseOver: function(e)
    { 
        this.set("state", "over");
    },

    /**
	 * @private
	 */
    _handleMouseDown: function(e)
    {
        this.set("state", "down");
    },

    /**
	 * @private
	 */
    _handleMouseOut: function(e)
    {
        this.set("state", "off");
    },

    _getStateStyles: function()
    {
        var styles = this._mergeStyles(this.get("styles"), {}),
            state = this.get("state"),
            stateStyles,
            w,
            h,
            x = 0,
            y = 0,
            fill = this._mergeStyles(styles.fill, {}),
            border = this._mergeStyles(styles.border, {}),
            dc = this.get("series")._getDefaultColor(this.get("colorIndex"));
            fill.color = fill.color || dc;
            border.color = border.color || dc;
        stateStyles = {
                fill:fill,                
                border:border, 
                shape: styles.shape,
                width: styles.width,
                height: styles.height,
                props: this._mergeStyles(styles.props, {})
        };
        if((state === "over" || state === "down") && styles[state])
        {
            stateStyles = this._mergeStyles(styles[state], stateStyles);
        }
        w = stateStyles.width;
        h = stateStyles.height;
        stateStyles.x = x;
        stateStyles.y = y;
        stateStyles.width = w;
        stateStyles.height = h;
        this.set("width", w);
        this.set("height", h);
        return stateStyles;
    },

    /**
	 * @private (override)
	 */
	draw: function()
    {
        var stateStyles = this._getStateStyles(),
            w = stateStyles.width,
            h = stateStyles.height,
            graphic = this.get("graphic");
        this._shape = graphic.getShape(stateStyles);
        Y.one(this._shape.node).addClass("yui3-seriesmarker");

	},

    /**
     * @private
     * @description Reference to the graphic object.
     */
    _shape: null,

    /**
     * @private
     * @description Updates the properties of an existing state.
     */
    _update: function()
    {
        this.get("graphic").updateShape(this._shape, this._getStateStyles());
    }
});

Y.Marker = Marker;
function Lines(cfg)
{
    var attrs = {
        line: {
            getter: function()
            {
                return this._lineDefaults || this._getLineDefaults();
            },

            setter: function(val)
            {
                var defaults = this._defaults || this._getLineDefaults();
                this._lineDefaults = Y.merge(defaults, val);
            }
        }
    };
    this.addAttrs(attrs, cfg);
    this.get("styles");
}

Lines.prototype = {
    /**
     * @private
     */
    _lineDefaults: null,

    /**
	 * @private
	 */
	drawLines: function()
	{
        if(this.get("xcoords").length < 1) 
		{
			return;
		}
        var xcoords = this.get("xcoords").concat(),
			ycoords = this.get("ycoords").concat(),
            direction = this.get("direction"),
			len = direction === "vertical" ? ycoords.length : xcoords.length,
			lastX,
			lastY,
			lastValidX = lastX,
			lastValidY = lastY,
			nextX,
			nextY,
			i,
			styles = this.get("line"),
			lineType = styles.lineType,
            lc = styles.color || this._getDefaultColor(this.get("graphOrder")),
			dashLength = styles.dashLength,
			gapSpace = styles.gapSpace,
			connectDiscontinuousPoints = styles.connectDiscontinuousPoints,
			discontinuousType = styles.discontinuousType,
			discontinuousDashLength = styles.discontinuousDashLength,
			discontinuousGapSpace = styles.discontinuousGapSpace,
			graphic = this.get("graphic");
        lastX = lastValidX = xcoords[0];
        lastY = lastValidY = ycoords[0];
        graphic.lineStyle(styles.weight, lc);
        graphic.moveTo(lastX, lastY);
        for(i = 1; i < len; i = ++i)
		{
			nextX = xcoords[i];
			nextY = ycoords[i];
            if(isNaN(nextY))
			{
				lastValidX = nextX;
				lastValidY = nextY;
				continue;
			}
			if(lastValidX == lastX)
			{
                if(lineType != "dashed")
				{
                    graphic.lineTo(nextX, nextY);
				}
				else
				{
					this.drawDashedLine(lastValidX, lastValidY, nextX, nextY, 
												dashLength, 
												gapSpace);
				}
			}
			else if(!connectDiscontinuousPoints)
			{
				graphic.moveTo(nextX, nextY);
			}
			else
			{
				if(discontinuousType != "solid")
				{
					this.drawDashedLine(lastValidX, lastValidY, nextX, nextY, 
												discontinuousDashLength, 
												discontinuousGapSpace);
				}
				else
				{
                    graphic.lineTo(nextX, nextY);
				}
			}
		
			lastX = lastValidX = nextX;
			lastY = lastValidY = nextY;
        }
        graphic.end();
	},
    
    /**
	 * @private
	 */
	drawSpline: function()
	{
        if(this.get("xcoords").length < 1) 
		{
			return;
		}
        var xcoords = this.get("xcoords"),
			ycoords = this.get("ycoords"),
            curvecoords = this.getCurveControlPoints(xcoords, ycoords),
			len = curvecoords.length,
            cx1,
            cx2,
            cy1,
            cy2,
            x,
            y,
            i = 0,
			styles = this.get("line"),
			graphic = this.get("graphic"),
            color = styles.color || this._getDefaultColor(this.get("graphOrder"));
        graphic.lineStyle(styles.weight, color);
        graphic.moveTo(xcoords[0], ycoords[0]);
        for(; i < len; i = ++i)
		{
            x = curvecoords[i].endx;
            y = curvecoords[i].endy;
            cx1 = curvecoords[i].ctrlx1;
            cx2 = curvecoords[i].ctrlx2;
            cy1 = curvecoords[i].ctrly1;
            cy2 = curvecoords[i].ctrly2;
            graphic.curveTo(cx1, cy1, cx2, cy2, x, y);
        }
        graphic.end();
	},
    
    /**
	 * Draws a dashed line between two points.
	 * 
	 * @param xStart	The x position of the start of the line
	 * @param yStart	The y position of the start of the line
	 * @param xEnd		The x position of the end of the line
	 * @param yEnd		The y position of the end of the line
	 * @param dashSize	the size of dashes, in pixels
	 * @param gapSize	the size of gaps between dashes, in pixels
	 */
	drawDashedLine: function(xStart, yStart, xEnd, yEnd, dashSize, gapSize)
	{
		dashSize = dashSize || 10;
		gapSize = gapSize || 10;
		var segmentLength = dashSize + gapSize,
			xDelta = xEnd - xStart,
			yDelta = yEnd - yStart,
			delta = Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta, 2)),
			segmentCount = Math.floor(Math.abs(delta / segmentLength)),
			radians = Math.atan2(yDelta, xDelta),
			xCurrent = xStart,
			yCurrent = yStart,
			i,
			graphic = this.get("graphic");
		xDelta = Math.cos(radians) * segmentLength;
		yDelta = Math.sin(radians) * segmentLength;
		
		for(i = 0; i < segmentCount; ++i)
		{
			graphic.moveTo(xCurrent, yCurrent);
			graphic.lineTo(xCurrent + Math.cos(radians) * dashSize, yCurrent + Math.sin(radians) * dashSize);
			xCurrent += xDelta;
			yCurrent += yDelta;
		}
		
		graphic.moveTo(xCurrent, yCurrent);
		delta = Math.sqrt((xEnd - xCurrent) * (xEnd - xCurrent) + (yEnd - yCurrent) * (yEnd - yCurrent));
		
		if(delta > dashSize)
		{
			graphic.lineTo(xCurrent + Math.cos(radians) * dashSize, yCurrent + Math.sin(radians) * dashSize);
		}
		else if(delta > 0)
		{
			graphic.lineTo(xCurrent + Math.cos(radians) * delta, yCurrent + Math.sin(radians) * delta);
		}
		
		graphic.moveTo(xEnd, yEnd);
	},

	_getLineDefaults: function()
    {
        return {
            alpha: 1,
            weight: 1,
            lineType:"solid", 
            dashLength:10, 
            gapSpace:10, 
            connectDiscontinuousPoint:true, 
            discontinuousType:"dashed", 
            discontinuousDashLength:10, 
            discontinuousGapSpace:10
        };
    }
};
Y.augment(Lines, Y.Attribute);
Y.Lines = Lines;
function Fills(cfg)
{
    var attrs = {
        area: {
            getter: function()
            {
                return this._defaults || this._getAreaDefaults();
            },

            setter: function(val)
            {
                var defaults = this._defaults || this._getAreaDefaults();
                this._defaults = Y.merge(defaults, val);
            }
        }
    };
    this.addAttrs(attrs, cfg);
    this.get("styles");
}

Fills.prototype = {
	/**
	 * @private
	 */
	drawFill: function(xcoords, ycoords)
	{
        if(xcoords.length < 1) 
		{
			return;
		}
        var len = xcoords.length,
			firstX = xcoords[0],
			firstY = ycoords[0],
            lastValidX = firstX,
			lastValidY = firstY,
			nextX,
			nextY,
			i = 1,
			styles = this.get("area"),
			graphic = this.get("graphic"),
            color = styles.color || this._getDefaultColor(this.get("graphOrder"));
        graphic.clear();
        graphic.beginFill(color, styles.alpha);
        graphic.moveTo(firstX, firstY);
        for(; i < len; i = ++i)
		{
			nextX = xcoords[i];
			nextY = ycoords[i];
			if(isNaN(nextY))
			{
				lastValidX = nextX;
				lastValidY = nextY;
				continue;
			}
            graphic.lineTo(nextX, nextY);
            lastValidX = nextX;
			lastValidY = nextY;
        }
        graphic.end();
	},
	
    /**
	 * @private
	 */
	drawAreaSpline: function()
	{
        if(this.get("xcoords").length < 1) 
		{
			return;
		}
        var xcoords = this.get("xcoords"),
			ycoords = this.get("ycoords"),
            curvecoords = this.getCurveControlPoints(xcoords, ycoords),
			len = curvecoords.length,
            cx1,
            cx2,
            cy1,
            cy2,
            x,
            y,
            i = 0,
			firstX = xcoords[0],
            firstY = ycoords[0],
            styles = this.get("area"),
			graphic = this.get("graphic"),
            color = styles.color || this._getDefaultColor(this.get("graphOrder"));
        graphic.beginFill(color, styles.alpha);
        graphic.moveTo(firstX, firstY);
        for(; i < len; i = ++i)
		{
            x = curvecoords[i].endx;
            y = curvecoords[i].endy;
            cx1 = curvecoords[i].ctrlx1;
            cx2 = curvecoords[i].ctrlx2;
            cy1 = curvecoords[i].ctrly1;
            cy2 = curvecoords[i].ctrly2;
            graphic.curveTo(cx1, cy1, cx2, cy2, x, y);
        }
        if(this.get("direction") === "vertical")
        {
            graphic.lineTo(this._leftOrigin, y);
            graphic.lineTo(this._leftOrigin, firstY);
        }
        else
        {
            graphic.lineTo(x, this._bottomOrigin);
            graphic.lineTo(firstX, this._bottomOrigin);
        }
        graphic.lineTo(firstX, firstY);
        graphic.end();
	},
    
    /**
	 * @private
	 */
	drawStackedAreaSpline: function()
	{
        if(this.get("xcoords").length < 1) 
		{
			return;
		}
        var xcoords = this.get("xcoords"),
			ycoords = this.get("ycoords"),
            curvecoords,
            order = this.get("order"),
            type = this.get("type"),
            graph = this.get("graph"),
            seriesCollection = graph.seriesTypes[type],
            prevXCoords,
            prevYCoords,
			len,
            cx1,
            cx2,
            cy1,
            cy2,
            x,
            y,
            i = 0,
			firstX,
            firstY,
            styles = this.get("area"),
			graphic = this.get("graphic"),
            color = styles.color || this._getDefaultColor(this.get("graphOrder"));
		firstX = xcoords[0];
        firstY = ycoords[0];
        curvecoords = this.getCurveControlPoints(xcoords, ycoords);
        len = curvecoords.length;
        graphic.beginFill(color, styles.alpha);
        graphic.moveTo(firstX, firstY);
        for(; i < len; i = ++i)
		{
            x = curvecoords[i].endx;
            y = curvecoords[i].endy;
            cx1 = curvecoords[i].ctrlx1;
            cx2 = curvecoords[i].ctrlx2;
            cy1 = curvecoords[i].ctrly1;
            cy2 = curvecoords[i].ctrly2;
            graphic.curveTo(cx1, cy1, cx2, cy2, x, y);
        }
        if(order > 0)
        {
            prevXCoords = seriesCollection[order - 1].get("xcoords").concat().reverse();
            prevYCoords = seriesCollection[order - 1].get("ycoords").concat().reverse();
            curvecoords = this.getCurveControlPoints(prevXCoords, prevYCoords);
            i = 0;
            len = curvecoords.length;
            graphic.lineTo(prevXCoords[0], prevYCoords[0]);
            for(; i < len; i = ++i)
            {
                x = curvecoords[i].endx;
                y = curvecoords[i].endy;
                cx1 = curvecoords[i].ctrlx1;
                cx2 = curvecoords[i].ctrlx2;
                cy1 = curvecoords[i].ctrly1;
                cy2 = curvecoords[i].ctrly2;
                graphic.curveTo(cx1, cy1, cx2, cy2, x, y);
            }
        }
        else
        {
            if(this.get("direction") === "vertical")
            {
                graphic.lineTo(this._leftOrigin, ycoords[ycoords.length-1]);
                graphic.lineTo(this._leftOrigin, firstY);
            }
            else
            {
                graphic.lineTo(xcoords[xcoords.length-1], this._bottomOrigin);
                graphic.lineTo(firstX, this._bottomOrigin);
            }

        }
        graphic.lineTo(firstX, firstY);
        graphic.end();
	},
    
    /**
     * @private
     */
    _defaults: null,

    _getClosingPoints: function()
    {
        var xcoords = this.get("xcoords").concat(),
            ycoords = this.get("ycoords").concat();
        if(this.get("direction") === "vertical")
        {
            xcoords.push(this._leftOrigin);
            xcoords.push(this._leftOrigin);
            ycoords.push(ycoords[ycoords.length - 1]);
            ycoords.push(ycoords[0]);
        }
        else
        {
            xcoords.push(xcoords[xcoords.length - 1]);
            xcoords.push(xcoords[0]);
            ycoords.push(this._bottomOrigin);
            ycoords.push(this._bottomOrigin);
        }
        xcoords.push(xcoords[0]);
        ycoords.push(ycoords[0]);
        return [xcoords, ycoords];
    },

    /**
     * @private
     * Concatenates coordinate array with the correct coordinates for closing an area stack.
     */
    _getStackedClosingPoints: function()
    {
        var order = this.get("order"),
            type = this.get("type"),
            graph = this.get("graph"),
            direction = this.get("direction"),
            seriesCollection = graph.seriesTypes[type],
            prevXCoords,
            prevYCoords,
            allXCoords = this.get("xcoords").concat(),
            allYCoords = this.get("ycoords").concat(),
            firstX = allXCoords[0],
            firstY = allYCoords[0];
        
        if(order > 0)
        {
            prevXCoords = seriesCollection[order - 1].get("xcoords").concat();
            prevYCoords = seriesCollection[order - 1].get("ycoords").concat();
            allXCoords = allXCoords.concat(prevXCoords.concat().reverse());
            allYCoords = allYCoords.concat(prevYCoords.concat().reverse());
            allXCoords.push(allXCoords[0]);
            allYCoords.push(allYCoords[0]);
        }
        else
        {
            if(direction === "vertical")
            {
                allXCoords.push(this._leftOrigin);
                allXCoords.push(this._leftOrigin);
                allYCoords.push(allYCoords[allYCoords.length-1]);
                allYCoords.push(firstY);
            }
            else
            {
                allXCoords.push(allXCoords[allXCoords.length-1]);
                allXCoords.push(firstX);
                allYCoords.push(this._bottomOrigin);
                allYCoords.push(this._bottomOrigin);
            }
        }
        return [allXCoords, allYCoords];
    },

    _getAreaDefaults: function()
    {
        return {
            alpha: 0.5
        };
    }
};
Y.augment(Fills, Y.Attribute);
Y.Fills = Fills;
function Plots(cfg)
{
    var attrs = {
        marker: {
            getter: function()
            {
                return this._plotDefaults || this._getPlotDefaults();
            },

            setter: function(val)
            {
                var defaults = this._plotDefaults || this._getPlotDefaults();
                this._plotDefaults = Y.merge(defaults, val);
            }
        }
    };
    this.addAttrs(attrs, cfg);
    this.get("styles");
}

Plots.prototype = {
    /**
     * @private
     */
    _plotDefaults: null,

    bindUI: function()
    {
        Y.delegate("mouseover", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
        Y.delegate("mousedown", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
        Y.delegate("mouseup", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
        Y.delegate("mouseout", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
    },
    
    drawPlots: function()
    {
	    if(!this.get("xcoords") || this.get("xcoords").length < 1) 
		{
			return;
		}
        var style = this.get("marker"),
            w = style.width,
            h = style.height,
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            i = 0,
            len = xcoords.length,
            top = ycoords[0],
            left,
            marker,
            mnode,
            offsetWidth = w/2,
            offsetHeight = h/2;
            this._createMarkerCache();
        for(; i < len; ++i)
        {
            top = (ycoords[i] - offsetWidth) + "px";
            left = (xcoords[i] - offsetHeight) + "px";
            marker = this.getMarker.apply(this, [{index:i, styles:style}]);
            mnode = marker.get("boundingBox");
            mnode.setStyle("position", "absolute"); 
            mnode.setStyle("top", top);
            mnode.setStyle("left", left);
        }
        this._clearMarkerCache();
 	},

	_getPlotDefaults: function()
    {
        return {
            fill:{
                type: "solid",
                alpha: 1,
                colors:null,
                alphas: null,
                ratios: null
            },
            border:{
                weight: 1,
                alpha: 1
            },
            width: 6,
            height: 6,
            shape: "circle",

            padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }
        };
    },

    _markerEventHandler: function(e)
    {
        var type = e.type,
            marker = Y.Widget.getByNode(e.currentTarget),
            w,
            h,
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            i = marker.get("index") || Y.Array.indexOf(this.get("markers"), marker),
            bb = marker.get("boundingBox");
            switch(type)
            {
                case "mouseout" :
                    marker.set("state", "off");
                break;
                case "mouseover" :
                    marker.set("state", "over");
                break;
                case "mouseup" :
                    marker.set("state", "over");
                break;
                case "mousedown" :
                    marker.set("state", "down");
                break;
            }
            w = marker.get("width");
            h = marker.get("height");
            bb.setStyle("left", (xcoords[i] - w/2) + "px");
            bb.setStyle("top", (ycoords[i] - h/2) + "px");    
    }
};

Y.augment(Plots, Y.Attribute);
Y.Plots = Plots;
function PieSeries(config)
{
    PieSeries.superclass.constructor.apply(this, arguments);
}

PieSeries.NAME = "pieSeries";

PieSeries.ATTRS = {

	type: {		
  	    value: "pie"
    },
	/**
	 * Order of this ISeries instance of this <code>type</code>.
	 */
	order: {
	    value:NaN
    },
	graph: {
        value: null
	},
	/**
	 * Reference to the <code>Axis</code> instance used for assigning 
	 * x-values to the graph.
	 */
	categoryAxis: {
		value: null,

        validator: function(value)
		{
			return value !== this.get("categoryAxis");
		},
		
        lazyAdd: false
	},
	
	valueAxis: {
		value: null,

        validator: function(value)
		{
			return value !== this.get("valueAxis");
		},
		
        lazyAdd: false
    },
	/**
	 * Indicates which array to from the hash of value arrays in 
	 * the category <code>Axis</code> instance.
	 */
	categoryKey: {
        value: null,

		validator: function(value)
		{
			return value !== this.get("categoryKey");
		}
	},
	/**
	 * Indicates which array to from the hash of value arrays in 
	 * the value <code>Axis</code> instance.
	 */
	valueKey: {
		value: null,

        validator: function(value)
		{
			return value !== this.get("valueKey");
		}
	},

    categoryDisplayName: {
        setter: function(val)
        {
            this._categoryDisplayName = val;
            return val;
        },

        getter: function()
        {
            return this._categoryDisplayName || this.get("categoryKey");
        }
    },

    valueDisplayName: {
        setter: function(val)
        {
            this._valueDisplayName = val;
            return val;
        },

        getter: function()
        {
            return this._valueDisplayName || this.get("valueKey");
        }
    },

    slices: null
};

Y.extend(PieSeries, Y.Renderer, {
    /**
     * @private
     */
    _categoryDisplayName: null,
    
    /**
     * @private
     */
    _valueDisplayName: null,

    /**
     * @private
     */
    renderUI: function()
    {
        this._setNode();
    },
    
    /**
     * @private
     */
    bindUI: function()
    {
        var categoryAxis = this.get("categoryAxis"),
            valueAxis = this.get("valueAxis");
        if(categoryAxis)
        {
            categoryAxis.after("axisReady", Y.bind(this._categoryAxisChangeHandler, this));
            categoryAxis.after("axisUpdate", Y.bind(this._categoryAxisChangeHandler, this));
        }
        if(valueAxis)
        {
            valueAxis.after("axisReady", Y.bind(this._valueAxisChangeHandler, this));
            valueAxis.after("axisUpdate", Y.bind(this._valueAxisChangeHandler, this));
        }
        this.after("categoryAxisChange", Y.bind(this.categoryAxisChangeHandler, this));
        this.after("valueAxisChange", Y.bind(this.valueAxisChangeHandler, this));
        this.after("stylesChange", Y.bind(this._updateHandler, this));
        
        Y.delegate("mouseover", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
        Y.delegate("mousedown", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
        Y.delegate("mouseup", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
        Y.delegate("mouseout", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
    },
   
	/**
	 * Constant used to generate unique id.
	 */
	GUID: "pieseries",
	
	/**
	 * @private (protected)
	 * Handles updating the graph when the x < code>Axis</code> values
	 * change.
	 */
	_categoryAxisChangeHandler: function(event)
	{
        if(this.get("rendered") && this.get("categoryKey") && this.get("valueKey"))
		{
			this.draw();
		}
	},

	/**
	 * @private (protected)
	 * Handles updating the chart when the y <code>Axis</code> values
	 * change.
	 */
	_valueAxisChangeHandler: function(event)
	{
        if(this.get("rendered") && this.get("categoryKey") && this.get("valueKey"))
		{
			this.draw();
		}
	},
    
	/**
	 * @private (override)
	 */
	draw: function()
    {
        var node = Y.Node.one(this._parentNode).get("parentNode"),
			w = node.get("offsetWidth"),
            h = node.get("offsetHeight");
        if  (!isNaN(w) && !isNaN(h) && w > 0 && h > 0)
		{
            this.drawSeries();
		}
	},
    
    /**
     * @private
     * @description Creates a marker based on its style properties.
     */
    getMarker: function(config)
    {
        var marker,
            cache = this._markerCache,
            styles = config.styles,
            index = config.index;
        config.colorIndex = index;
        if(cache.length > 0)
        {
            marker = cache.shift();
            marker.set("index", index);
            marker.set("series", this);
            marker.set("colorIndex", index);
            if(marker.get("styles") !== styles)
            {
                marker.set("styles", styles);
            }
        }
        else
        {
            config.series = this;
            marker = new Y.Marker(config);
            marker.render(Y.one(this.get("node")));
        }
        this._markers.push(marker);
        this._markerNodes.push(Y.one(marker.get("node")));
        return marker;
    },   
    
    /**
     * @private
     * Creates a cache of markers for reuse.
     */
    _createMarkerCache: function()
    {
        if(this._markers)
        {
            this._markerCache = this._markers.concat();
        }
        else
        {
            this._markerCache = [];
        }
        this._markers = [];
        this._markerNodes = [];
    },
    
    /**
     * @private
     * Removes unused markers from the marker cache
     */
    _clearMarkerCache: function()
    {
        var len = this._markerCache.length,
            i = 0,
            marker,
            markerCache;
        for(; i < len; ++i)
        {
            marker = markerCache[i];
            marker.parentNode.removeChild(marker);
        }
        this._markerCache = [];
    },
    
    /**
     * @private
     */
	drawSeries: function()
    {
        var values = this.get("valueAxis").getDataByKey(this.get("valueKey")).concat(),
            categories = this.get("categoryAxis").getDataByKey(this.get("categoryKey")).concat(),
            totalValue = 0,
            itemCount = values.length,
            styles = this.get("styles"),
            fillColors = styles.fillColors,
            fillAlphas = styles.fillAlphas || ["1"],
            borderColors = styles.borderColors,
            borderWeights = styles.borderWeights,
            borderAlphas = styles.borderAlphas,
            tbw = borderWeights.concat(),
            tbc = borderColors.concat(),
            tba = borderAlphas.concat(),
            tfc,
            tfa,
            padding = styles.padding,
            node = Y.Node.one(this._parentNode).get("parentNode"),
			w = node.get("offsetWidth") - (padding.left + padding.right),
            h = node.get("offsetHeight") - (padding.top + padding.bottom),
            totalAngle = 0,
            halfWidth = w / 2,
            halfHeight = h / 2,
            radius = Math.min(halfWidth, halfHeight),
            i = 0,
            value,
            angle = 0,
            lc,
            la,
            lw,
            wedgeStyle,
            marker;

        for(; i < itemCount; ++i)
        {
            value = values[i];
            
            values.push(value);
            if(!isNaN(value))
            {
                totalValue += value;
            }
        }
        
        tfc = fillColors ? fillColors.concat() : null;
        tfa = fillAlphas ? fillAlphas.concat() : null;
        this._createMarkerCache();
        for(i = 0; i < itemCount; i++)
        {
            value = values[i];
            if(totalValue === 0)
            {
                angle = 360 / values.length;
            }
            else
            {
                angle = 360 * (value / totalValue);
            }
            angle = Math.round(angle);
            if(tfc && tfc.length < 1)
            {
                tfc = fillColors.concat();
            }
            if(tfc && tfa.length < 1)
            {
                tfa = fillAlphas.concat();
            }
            if(tbw && tbw.length < 1)
            {
                tbw = borderWeights.concat();
            }
            if(tbw && tbc.length < 1)
            {
                tbc = borderColors.concat();
            }
            if(tba && tba.length < 1)
            {
                tba = borderAlphas.concat();
            }
            lw = tbw ? tbw.shift() : null;
            lc = tbc ? tbc.shift() : null;
            la = tba ? tba.shift() : null;
            wedgeStyle = {
                border: {
                    color:lc,
                    weight:lw,
                    alpha:la
                },
                fill: {
                    color:tfc ? tfc.shift() : null,
                    alpha:tfa ? tfa.shift() : null
                },
                shape: "wedge",
                props: {
                    arc: angle,
                    radius: radius,
                    startAngle: totalAngle,
                    x: halfWidth,
                    y: halfHeight
                },
                width: w,
                height: h
            };
            marker = this.getMarker.apply(this, [{index:i, styles:wedgeStyle}]);
            totalAngle += angle;    
        }
        this._clearMarkerCache();
    },

    _markerEventHandler: function(e)
    {
        var type = e.type,
            marker = Y.Widget.getByNode(e.currentTarget);

            switch(type)
            {
                case "mouseout" :
                    marker.set("state", "off");
                break;
                case "mouseover" :
                    marker.set("state", "over");
                break;
                case "mouseup" :
                    marker.set("state", "over");
                break;
                case "mousedown" :
                    marker.set("state", "down");
                break;
            }
    },
    /**
     * @private
     * @return Default styles for the widget
     */
    _getDefaultStyles: function()
    {
        return {
            padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            },
            fillAlphas:["1"],
            borderColors:["#000000"],
            borderWeights:["0"],
            borderAlphas:["1"],

            over: {
                borderColors:["#000000"],
                fillAlphas:[1]
            }
        };
    },

    /**
     * @private
     * @description Colors used if style colors are not specified
     */
    _getDefaultColor: function(index)
    {
        var colors = [
                "#2011e6", "#f5172c", "#00ff33", "#ff6600", "#7f03d6", "#f3f301",
				"#4982b8", "#f905eb", "#0af9da", "#fecb01", "#8e9a9b", "#d701fe",
				"#8cb3d1", "#d18cae", "#b3ddd3", "#fcc551", "#785a85", "#f86b0e"
            ];
        index = index || 0;
        return colors[index];
    }
});
	
Y.PieSeries = PieSeries;
function CartesianSeries(config)
{
    CartesianSeries.superclass.constructor.apply(this, arguments);
}
 
CartesianSeries.NAME = "cartesianSeries";

CartesianSeries.ATTRS = {
	xDisplayName: {
        getter: function()
        {
            return this._xDisplayName || this.get("xKey");
        },

        setter: function(val)
        {
            this._xDisplayName = val;
            return val;
        }
    },

    yDisplayName: {
        getter: function()
        {
            return this._yDisplayName || this.get("yKey");
        },

        setter: function(val)
        {
            this._yDisplayName = val;
            return val;
        }
    },

    type: {		
  	    value: "cartesian"
    },
	/**
	 * Order of this ISeries instance of this <code>type</code>.
	 */
	order: {
	    value:NaN
    },

    /**
     * Order of the ISeries instance
     */
    graphOrder: {
        value:NaN
    },

	/**
	 * x coordinates for the series.
	 */
	xcoords: {
        value: null
	},
	/**
	 * y coordinates for the series
	 */
	ycoords: {
        value: null
	},
	graph: {
        value: null
	},
	/**
	 * Reference to the <code>Axis</code> instance used for assigning 
	 * x-values to the graph.
	 */
	xAxis: {
		value: null,

        validator: function(value)
		{
			return value !== this.get("xAxis");
		},
		
        lazyAdd: false
	},
	
	yAxis: {
		value: null,

        validator: function(value)
		{
			return value !== this.get("yAxis");
		},
		
        lazyAdd: false
	},
	/**
	 * Indicates which array to from the hash of value arrays in 
	 * the x-axis <code>Axis</code> instance.
	 */
	xKey: {
        value: null,

		validator: function(value)
		{
			return value !== this.get("xKey");
		}
	},
	/**
	 * Indicates which array to from the hash of value arrays in 
	 * the y-axis <code>Axis</code> instance.
	 */
	yKey: {
		value: null,

        validator: function(value)
		{
			return value !== this.get("yKey");
		}
	},

    /**
     * Array of x values for the series.
     */
    xData: {
        value: null
    },

    /**
     * Array of y values for the series.
     */
    yData: {
        value: null
    },
    
    markers: {
        getter: function()
        {
            return this._markers;
        }
    },

    direction: {
        value: "horizontal"
    }
};

Y.extend(CartesianSeries, Y.Renderer, {
    /**
     * @private
     */
    _xDisplayName: null,

    /**
     * @private
     */
    _yDisplayName: null,
    
    /**
     * @private
     */
    _leftOrigin: null,

    /**
     * @private
     */
    _bottomOrigin: null,

    /**
     * @private
     */
    bindUI: function()
    {
        var xAxis = this.get("xAxis"),
            yAxis = this.get("yAxis");
        if(xAxis)
        {
            xAxis.after("axisReady", Y.bind(this._xAxisChangeHandler, this));
            xAxis.after("axisUpdate", Y.bind(this._xAxisChangeHandler, this));
        }
        if(yAxis)
        {
            yAxis.after("axisReady", Y.bind(this._yAxisChangeHandler, this));
            yAxis.after("axisUpdate", Y.bind(this._yAxisChangeHandler, this));
        }
        this.after("xAxisChange", Y.bind(this.xAxisChangeHandler, this));
        this.after("yAxisChange", Y.bind(this.yAxisChangeHandler, this));
        this.after("stylesChange", Y.bind(this._updateHandler, this));
    },

	/**
	 * Constant used to generate unique id.
	 */
	GUID: "yuicartesianseries",
	
	/**
	 * @private (protected)
	 * Handles updating the graph when the x < code>Axis</code> values
	 * change.
	 */
	_xAxisChangeHandler: function(event)
	{
        var axesReady = this._updateAxisData();
        if(this.get("rendered") && axesReady)
		{
			this.draw();
		}
	},

	/**
	 * @private (protected)
	 * Handles updating the chart when the y <code>Axis</code> values
	 * change.
	 */
	_yAxisChangeHandler: function(event)
	{
        var axesReady = this._updateAxisData();
        if(this.get("rendered") && axesReady)
		{
			this.draw();
		}
	},

    /**
     * @private 
     */
    _updateAxisData: function()
    {
        var xAxis = this.get("xAxis"),
            yAxis = this.get("yAxis"),
            xKey = this.get("xKey"),
            yKey = this.get("yKey");
        if(!xAxis || !yAxis || !xKey || !yKey)
        {
            return false;
        }
        
        this.set("xData", xAxis.getDataByKey(xKey));
        this.set("yData", yAxis.getDataByKey(yKey));
        return true;
    },

    syncUI: function()
    {
        if(this.get("xData") && this.get("yData"))
        {
            this.draw();
        }
        else if(this._updateAxisData())
        {
            this.draw();
        }
    },

    /**
     * @private
     * Collection of markers to be used in the series.
     */
    _markers: null,

    /**
     * @private
     * Collection of markers to be re-used on a series redraw.
     */
    _markerCache: null,

	/**
	 * @private
	 */
	setAreaData: function()
	{
        var nextX, nextY,
            node = Y.Node.one(this._parentNode).get("parentNode"),
            w = node.get("offsetWidth"),
            h = node.get("offsetHeight"),
            xAxis = this.get("xAxis"),
            yAxis = this.get("yAxis"),
            xData = this.get("xData").concat(),
            yData = this.get("yData").concat(),
            xOffset = xAxis.getEdgeOffset(xData.length, w),
            yOffset = yAxis.getEdgeOffset(yData.length, h),
            padding = this.get("padding"),
			leftPadding = padding.left,
			topPadding = padding.top,
			dataWidth = w - (leftPadding + padding.right + xOffset),
			dataHeight = h - (topPadding + padding.bottom + yOffset),
			xcoords = [],
			ycoords = [],
			xMax = xAxis.get("maximum"),
			xMin = xAxis.get("minimum"),
			yMax = yAxis.get("maximum"),
			yMin = yAxis.get("minimum"),
			xScaleFactor = dataWidth / (xMax - xMin),
			yScaleFactor = dataHeight / (yMax - yMin),
            dataLength,
            direction = this.get("direction"),
            i = 0;
            dataLength = xData.length; 	
            xOffset *= 0.5;
            yOffset *= 0.5;
        //Assuming a vertical graph has a range/category for its vertical axis.    
        if(direction === "vertical")
        {
            yData = yData.reverse();
        }
        if(this.get("graphic"))
        {
            this.get("graphic").setSize(w, h);
        }
        this._leftOrigin = Math.round(((0 - xMin) * xScaleFactor) + leftPadding + xOffset);
        this._bottomOrigin =  Math.round((dataHeight + topPadding + yOffset) - (0 - yMin) * yScaleFactor);
        for (; i < dataLength; ++i) 
		{
            nextX = Math.round((((xData[i] - xMin) * xScaleFactor) + leftPadding + xOffset));
			nextY = Math.round(((dataHeight + topPadding + yOffset) - (yData[i] - yMin) * yScaleFactor));
            xcoords.push(nextX);
            ycoords.push(nextY);
        }
        this.set("xcoords", xcoords);
		this.set("ycoords", ycoords);
    },

	/**
	 * @private (override)
	 */
	draw: function()
    {
        var node = Y.Node.one(this._parentNode).get("parentNode"),
			w = node.get("offsetWidth"),
            h = node.get("offsetHeight");
        if  (!isNaN(w) && !isNaN(h) && w > 0 && h > 0)
		{
            this.setAreaData();
            this.drawSeries();
            this.fire("drawingComplete");
		}
	},
    
    /**
     * @private
     * @return {Object}
     * Creates an array of start, end and control points for splines. 
     */
    getCurveControlPoints: function(xcoords, ycoords) 
    {
		var outpoints = [],
            i = 1,
            l = xcoords.length - 1,
		    xvals = [],
		    yvals = [];
		
		
		// Too few points, need at least two
		if (l < 1) 
        {
			return null;
		} 
        
        outpoints[0] = {
            startx: xcoords[0], 
            starty: ycoords[0],
            endx: xcoords[1],
            endy: ycoords[1]
        };
        
		// Special case, the Bezier should be a straight line
        if (l === 1) 
        {
			outpoints[0].ctrlx1 = (2.0*xcoords[0] + xcoords[1])/3.0;  
			outpoints[0].ctrly2 = (2.0*ycoords[0] + ycoords[1])/3.0;
			outpoints[0].ctrlx2 = 2.0*outpoints[0].ctrlx1 - xcoords[0];
            outpoints[0].ctrly2 = 2.0*outpoints[0].ctrly1 - ycoords[0];
            return outpoints;
		}

		for (; i < l; ++i) 
        {
			outpoints.push({startx: Math.round(xcoords[i]), starty: Math.round(ycoords[i]), endx: Math.round(xcoords[i+1]), endy: Math.round(ycoords[i+1])});
			xvals[i] = 4.0 * xcoords[i] + 2*xcoords[i+1];
			yvals[i] = 4.0*ycoords[i] + 2*ycoords[i+1];
		}
		
		xvals[0] = xcoords[0] + (2.0 * xcoords[1]);
		xvals[l-1] = (8.0 * xcoords[l-1] + xcoords[l]) / 2.0;
		xvals = this.getControlPoints(xvals.concat());
        yvals[0] = ycoords[0] + (2.0 * ycoords[1]);
		yvals[l-1] = (8.0 * ycoords[l-1] + ycoords[l]) / 2.0;	
		yvals = this.getControlPoints(yvals.concat());
		
        for (i = 0; i < l; ++i) 
        {
			outpoints[i].ctrlx1 = Math.round(xvals[i]);
            outpoints[i].ctrly1 = Math.round(yvals[i]);
			
			if (i < l-1) 
            {
				outpoints[i].ctrlx2 = Math.round(2*xcoords[i+1] - xvals[i+1]);
                outpoints[i].ctrly2 = Math.round(2*ycoords[i+1] - yvals[i+1]);
			}
			else 
            {
				outpoints[i].ctrlx2 = Math.round((xcoords[l] + xvals[l-1])/2);
                outpoints[i].ctrly2 = Math.round((ycoords[l] + yvals[l-1])/2);
			}
		}
		
		return outpoints;	
	},

    /**
     * @private
     */
	getControlPoints: function(vals) 
    {
		var l = vals.length,
            x = [],
            tmp = [],
            b = 2.0,
            i = 1;
		x[0] = vals[0] / b;
		for (; i < l; ++i) 
        {
			tmp[i] = 1/b;
			b = (i < l-1 ? 4.0 : 3.5) - tmp[i];
			x[i] = (vals[i] - x[i-1]) / b;
		}
		
		for (i = 1; i < l; ++i) 
        {
			x[l-i-1] -= tmp[l-i] * x[l-i];
		}
		
		return x;
	},
   
    /**
     * @private
     * Adjusts coordinate values for stacked series.
     */
    _stackCoordinates: function() 
    {
        var direction = this.get("direction"),
            node = Y.Node.one(this._parentNode).get("parentNode"),
            h = node.get("offsetHeight"),
            order = this.get("order"),
            type = this.get("type"),
            graph = this.get("graph"),
            seriesCollection = graph.seriesTypes[type],
            i = 0,
            len,
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            prevXCoords,
            prevYCoords;
        if(order === 0)
        {
            return;
        }
        prevXCoords = seriesCollection[order - 1].get("xcoords").concat();
        prevYCoords = seriesCollection[order - 1].get("ycoords").concat();
        if(direction === "vertical")
        {
            len = prevXCoords.length;
            for(; i < len; ++i)
            {
                if(!isNaN(prevXCoords[i]) && !isNaN(xcoords[i]))
                {
                    xcoords[i] += prevXCoords[i];
                }
            }
        }
        else
        {
            len = prevYCoords.length;
            for(; i < len; ++i)
            {
                if(!isNaN(prevYCoords[i]) && !isNaN(ycoords[i]))
                {
                    ycoords[i] = prevYCoords[i] - (h - ycoords[i]);
                }
            }
        }
    },

    /**
     * @private
     * @description Creates a marker based on its style properties.
     */
    getMarker: function(config)
    {
        var marker,
            colorIndex = this.get("graphOrder"),
            cache = this._markerCache,
            styles = config.styles,
            index = config.index;
        config.colorIndex = colorIndex;
        if(cache.length > 0)
        {
            marker = cache.shift();
            marker.set("index", index);
            marker.set("series", this);
            marker.set("colorIndex", colorIndex);
            if(marker.get("styles") !== styles)
            {
                marker.set("styles", styles);
            }
        }
        else
        {
            config.series = this;
            marker = new Y.Marker(config);
            marker.render(this.get("node"));
            Y.one(marker.get("boundingBox")).setStyle("zIndex", 2);
        }
        this._markers.push(marker);
        this._markerNodes.push(Y.one(marker.get("node")));
        return marker;
    },   
    
    /**
     * @private
     * Creates a cache of markers for reuse.
     */
    _createMarkerCache: function()
    {
        if(this._markers)
        {
            this._markerCache = this._markers.concat();
        }
        else
        {
            this._markerCache = [];
        }
        this._markers = [];
        this._markerNodes = [];
    },
    
    /**
     * @private
     * Removes unused markers from the marker cache
     */
    _clearMarkerCache: function()
    {
        var len = this._markerCache.length,
            i = 0,
            marker,
            markerCache;
        for(; i < len; ++i)
        {
            marker = markerCache[i];
            marker.parentNode.removeChild(marker);
        }
        this._markerCache = [];
    },

    /**
     * @private
     * @return Default styles for the widget
     */
    _getDefaultStyles: function()
    {
        return {padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }};
    },

    /**
     * @private
     * @description Colors used if style colors are not specified
     */
    _getDefaultColor: function(index)
    {
        var colors = [
                "#2011e6", "#f5172c", "#00ff33", "#ff6600", "#7f03d6", "#f3f301",
				"#4982b8", "#f905eb", "#0af9da", "#fecb01", "#8e9a9b", "#d701fe",
				"#8cb3d1", "#d18cae", "#b3ddd3", "#fcc551", "#785a85", "#f86b0e"
            ];
        index = index || 0;
        return colors[index];
    }
});

Y.CartesianSeries = CartesianSeries;
Y.MarkerSeries = Y.Base.create("markerSeries", Y.CartesianSeries, [Y.Plots], {
    /**
     * @private
     */
    renderUI: function()
    {
        this._setNode();
    },
    /**
     * @private
     */
	drawSeries: function()
	{
        this.drawPlots();
    }
},{
    ATTRS : {
        type: {
            /**
             * Indicates the type of graph.
             */
            value:"marker"
        },
        
        styles: {
            getter: function()
            {
                var styles = this.get("marker");
                styles.padding = this.get("padding");
            },
            
            setter: function(val)
            {
                this.set("marker", val);
                if(val.hasOwnProperty("padding"))
                {
                    this.set("padding", val.padding);
                }
            }
        }
    }
});

Y.LineSeries = Y.Base.create("lineSeries", Y.CartesianSeries, [Y.Lines], {
	drawSeries: function()
    {
        this.get("graphic").clear();
        this.drawLines();
    }
},
{
    ATTRS: {
        type: {
            /**
             * Indicates the type of graph.
             */
            value:"line"
        },

        styles: {
            getter: function()
            {
                var styles = this.get("line");
                styles.padding = this.get("padding");
            },

            setter: function(val)
            {
                this.set("line", val);
                if(val.hasOwnProperty("padding"))
                {
                    this.set("padding", val.padding);
                }
            }
        }
    }
});



		

		
Y.SplineSeries = Y.Base.create("splineSeries",  Y.CartesianSeries, [Y.Lines], {
	/**
	 * @private
	 */
	drawSeries: function()
	{
        this.get("graphic").clear();
        this.drawSpline();
    }
}, {
	ATTRS : {
        type : {
            /**
             * Indicates the type of graph.
             */
            value:"spline"
        }
    }
});



		

		
Y.AreaSplineSeries = Y.Base.create("areaSplineSeries", Y.CartesianSeries, [Y.Fills], {
	/**
	 * @private
	 */
	drawSeries: function()
	{
        this.get("graphic").clear();
        this.drawAreaSpline();
    }
}, {
	ATTRS : {
        type: {
            /**
             * Indicates the type of graph.
             */
            value:"areaSpline"
        }
    }
});

function StackedSplineSeries(config)
{
	StackedSplineSeries.superclass.constructor.apply(this, arguments);
}

StackedSplineSeries.NAME = "stackedSplineSeries";

StackedSplineSeries.ATTRS = {
	type: {
		/**
		 * Indicates the type of graph.
		 */
        value:"stackedSpline"
    }
};

Y.extend(StackedSplineSeries, Y.SplineSeries, {
    setAreaData: function()
    {   
        StackedSplineSeries.superclass.setAreaData.apply(this);
        this._stackCoordinates.apply(this);
    }
});

Y.StackedSplineSeries = StackedSplineSeries;
function StackedMarkerSeries(config)
{
	StackedMarkerSeries.superclass.constructor.apply(this, arguments);
}

StackedMarkerSeries.NAME = "stackedMarkerSeries";

StackedMarkerSeries.ATTRS = {
	type: {
		/**
		 * Indicates the type of graph.
		 */
        value:"stackedMarker"
    }
};

Y.extend(StackedMarkerSeries, Y.MarkerSeries, {
    setAreaData: function()
    {   
        StackedMarkerSeries.superclass.setAreaData.apply(this);
        this._stackCoordinates.apply(this);
    }
});

Y.StackedMarkerSeries = StackedMarkerSeries;
function ColumnSeries(config)
{
	ColumnSeries.superclass.constructor.apply(this, arguments);
}

ColumnSeries.NAME = "columnSeries";

ColumnSeries.ATTRS = {
	type: {
        value: "column"
    }
};

Y.extend(ColumnSeries, Y.CartesianSeries, {
    /**
     * @private
     */
    renderUI: function()
    {
        this._setNode();
    },

    bindUI: function()
    {
        Y.delegate("mouseover", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
        Y.delegate("mousedown", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
        Y.delegate("mouseup", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
        Y.delegate("mouseout", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
    },

    /**
	 * @private
	 */
	drawSeries: function()
	{
	    if(this.get("xcoords").length < 1) 
		{
			return;
		}
        var style = this._mergeStyles(this.get("styles"), {}),
            w = style.width,
            h = style.height,
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            i = 0,
            len = xcoords.length,
            top = ycoords[0],
            type = this.get("type"),
            graph = this.get("graph"),
            seriesCollection = graph.seriesTypes[type],
            seriesLen = seriesCollection.length,
            seriesWidth = 0,
            totalWidth = 0,
            offset = 0,
            ratio,
            renderer,
            order = this.get("order"),
            node = Y.Node.one(this._parentNode).get("parentNode"),
            left,
            marker,
            bb;
            this._createMarkerCache();
        for(; i < seriesLen; ++i)
        {
            renderer = seriesCollection[i];
            seriesWidth += renderer.get("styles").width;
            if(order > i) 
            {
                offset = seriesWidth;
            }
        }
        totalWidth = len * seriesWidth;
        if(totalWidth > node.offsetWidth)
        {
            ratio = this.width/totalWidth;
            seriesWidth *= ratio;
            offset *= ratio;
            w *= ratio;
            w = Math.max(w, 1);
        }
        offset -= seriesWidth/2;
        for(i = 0; i < len; ++i)
        {
            top = ycoords[i];
            h = this._bottomOrigin - top;
            left = xcoords[i] + offset;
            style.width = w;
            style.height = h;
            marker = this.getMarker.apply(this, [{index:i, styles:style}]);
            bb = marker.get("boundingBox");
            bb.setStyle("position", "absolute");
            bb.setStyle("left", left + "px");
            bb.setStyle("top", top + "px");
        }
        this._clearMarkerCache();
 	},

    /**
     * @private
     * Resizes and positions markers based on a mouse interaction.
     */
    _markerEventHandler: function(e)
    {
        var type = e.type,
            marker = Y.Widget.getByNode(e.currentTarget),
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            i = marker.get("index") || Y.Array.indexOf(this.get("markers"), marker),
            graph = this.get("graph"),
            seriesCollection = graph.seriesTypes[this.get("type")],
            seriesLen = seriesCollection.length,
            seriesWidth = 0,
            offset = 0,
            renderer,
            n = 0,
            xs = [],
            order = this.get("order");
        switch(type)
        {
            case "mouseout" :
                marker.set("state", "off");
            break;
            case "mouseover" :
                marker.set("state", "over");
            break;
            case "mouseup" :
                marker.set("state", "over");
            break;
            case "mousedown" :
                marker.set("state", "down");
            break;
        }
        marker.set("styles", {over:{height: (this._bottomOrigin - ycoords[i])}});
        for(; n < seriesLen; ++n)
        {
            renderer = seriesCollection[n].get("markers")[i];
            xs[n] = xcoords[i] + seriesWidth;
            seriesWidth += parseInt(renderer.get("boundingBox").getStyle("width"), 10);
            if(order > n)
            {
                offset = seriesWidth;
            }
            offset -= seriesWidth/2;
        }
        for(n = 0; n < seriesLen; ++n)
        {
            renderer = seriesCollection[n].get("markers")[i];
            renderer.get("boundingBox").setStyle("left", (xs[n] - seriesWidth/2) + "px");
        }
    },
    
    _getDefaultStyles: function()
    {
        return {
            fill: {
                alpha: "1",
                colors: [],
                alphas: [],
                ratios: [],
                rotation: 0
            },
            width: 6,
            height: 6,
            shape: "rect",
            padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }
        };
    }
});

Y.ColumnSeries = ColumnSeries;
function BarSeries(config)
{
	BarSeries.superclass.constructor.apply(this, arguments);
}

BarSeries.NAME = "barSeries";

BarSeries.ATTRS = {
	type: {
        value: "bar"
    },
    direction: {
        value: "vertical"
    }
};

Y.extend(BarSeries, Y.CartesianSeries, {
    bindUI: function()
    {
        Y.delegate("mouseover", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
        Y.delegate("mousedown", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
        Y.delegate("mouseup", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
        Y.delegate("mouseout", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
    },

    /**
     * @private
     */
    renderUI: function()
    {
        this._setNode();
    },
	/**
	 * @private
	 */
    drawSeries: function()
	{
	    if(this.get("xcoords").length < 1) 
		{
			return;
		}
        var style = this._mergeStyles(this.get("styles"), {}),
            w = style.width,
            h = style.height,
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            i = 0,
            len = xcoords.length,
            top = ycoords[0],
            type = this.get("type"),
            graph = this.get("graph"),
            seriesCollection = graph.seriesTypes[type],
            seriesLen = seriesCollection.length,
            seriesHeight = 0,
            totalHeight = 0,
            offset = 0,
            ratio,
            renderer,
            order = this.get("order"),
            node = Y.Node.one(this._parentNode).get("parentNode"),
            left,
            marker,
            bb;
            this._createMarkerCache();
        for(; i < seriesLen; ++i)
        {
            renderer = seriesCollection[i];
            seriesHeight += renderer.get("styles").height;
            if(order > i) 
            {
                offset = seriesHeight;
            }
        }
        totalHeight = len * seriesHeight;
        if(totalHeight > node.offsetHeight)
        {
            ratio = this.height/totalHeight;
            seriesHeight *= ratio;
            offset *= ratio;
            h *= ratio;
            h = Math.max(h, 1);
        }
        offset -= seriesHeight/2;
        for(i = 0; i < len; ++i)
        {
            top = ycoords[i] + offset;
            left = xcoords[i];
            w = left - this._leftOrigin;
            style.width = w;
            style.height = h;
            marker = this.getMarker.apply(this, [{index:i, styles:style}]);
            bb = marker.get("boundingBox");
            bb.setStyle("position", "absolute");
            bb.setStyle("left", 0 + "px");
            bb.setStyle("top", top + "px");
        }
        this._clearMarkerCache();
 	},

    /**
     * @private
     * Resizes and positions markers based on a mouse interaction.
     */
    _markerEventHandler: function(e)
    {
        var type = e.type,
            marker = Y.Widget.getByNode(e.currentTarget),
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            i = marker.get("index") || Y.Array.indexOf(this.get("markers"), marker),
            graph = this.get("graph"),
            seriesCollection = graph.seriesTypes[this.get("type")],
            seriesLen = seriesCollection.length,
            seriesHeight = 0,
            offset = 0,
            renderer,
            n = 0,
            ys = [],
            order = this.get("order");
        switch(type)
        {
            case "mouseout" :
                marker.set("state", "off");
            break;
            case "mouseover" :
                marker.set("state", "over");
            break;
            case "mouseup" :
                marker.set("state", "over");
            break;
            case "mousedown" :
                marker.set("state", "down");
            break;
        }
        marker.set("styles", {over:{width:(xcoords[i] - this._leftOrigin)}});
        for(; n < seriesLen; ++n)
        {
            renderer = seriesCollection[n].get("markers")[i];
            ys[n] = ycoords[i] + seriesHeight;
            seriesHeight += parseInt(renderer.get("boundingBox").getStyle("height"), 10);
            if(order > n)
            {
                offset = seriesHeight;
            }
            offset -= seriesHeight/2;
        }
        for(n = 0; n < seriesLen; ++n)
        {
            renderer = seriesCollection[n].get("markers")[i];
            renderer.get("boundingBox").setStyle("top", (ys[n] - seriesHeight/2) + "px");
        }
    },

	/**
	 * @private
	 */
    drawMarker: function(graphic, func, left, top, w, h)
    {
        graphic.drawRect(this._leftOrigin, top, w, h);
    },
	
	/**
	 * @private
	 */
    _getDefaultStyles: function()
    {
        return {
            fill: {
                alpha: "1",
                colors: [],
                alphas: [],
                ratios: [],
                rotation: 0
            },
            width: 6,
            height: 6,
            shape: "rect",
            padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }
        };
    }
});

Y.BarSeries = BarSeries;
Y.AreaSeries = Y.Base.create("areaSeries", Y.CartesianSeries, [Y.Fills], {
	drawSeries: function()
    {
        this.get("graphic").clear();
        this.drawFill.apply(this, this._getClosingPoints());
    }
},
{
    ATTRS: {
        type: {
            /**
             * Indicates the type of graph.
             */
            value:"area"
        },
        
        styles: {
            getter: function()
            {
                var styles = this.get("area");
                styles.padding = this.get("padding");
            },

            setter: function(val)
            {
                this.set("area", val);
                if(val.hasOwnProperty("padding"))
                {
                    this.set("padding", val.padding);
                }
            }
        }
    }
});



		

		
Y.StackedAreaSplineSeries = Y.Base.create("stackedAreaSplineSeries", Y.AreaSeries, [], {
	/**
	 * @private
	 */
	drawSeries: function()
	{
        this.get("graphic").clear();
        this._stackCoordinates();
        this.drawStackedAreaSpline();
    }
}, {
    ATTRS : {
        type: {
            /**
             * Indicates the type of graph.
             */
            value:"stackedAreaSpline"
        }
    }
});

Y.ComboSeries = Y.Base.create("comboSeries", Y.CartesianSeries, [Y.Fills, Y.Lines, Y.Plots], {
	drawSeries: function()
    {
        this.get("graphic").clear();
        if(this.get("showAreaFill"))
        {
            this.drawFill.apply(this, this._getClosingPoints());
        }
        if(this.get("showLines")) 
        {
            this.drawLines();
        }
        if(this.get("showMarkers"))
        {
            this.drawPlots();
        }   
    }
},
{
    ATTRS: {
        type: {
            /**
             * Indicates the type of graph.
             */
            value:"combo"
        },

        showAreaFill: {
            value: false
        },

        showLines: {
            value: true
        },

        showMarkers: {
            value: true
        },

        styles: {
            getter: function()
            {
                var styles = this._styles || this._getDefaultStyles();
                styles.marker = this.get("marker");
                styles.line = this.get("line");
                styles.area = this.get("area");
                styles.padding = this.get("padding");
                return styles;
            },

            setter: function(val)
            {
                var col = {area:"area", line:"line", marker:"marker", padding:"padding"}, i;
                for(i in col)
                {
                    if(val.hasOwnProperty(i))
                    {
                        this.set(i, val[i]);
                    }
                }
                this.styles = val;
            }
        }
    }
});



		

		
Y.StackedComboSeries = Y.Base.create("stackedComboSeries", Y.ComboSeries, [], {
    setAreaData: function()
    {   
        Y.StackedComboSeries.superclass.setAreaData.apply(this);
        this._stackCoordinates.apply(this);
    },
	
    drawSeries: function()
    {
        this.get("graphic").clear();
        if(this.get("showAreaFill"))
        {
            this.drawFill.apply(this, this._getStackedClosingPoints());
        }
        if(this.get("showLines")) 
        {
            this.drawLines();
        }
        if(this.get("showMarkers"))
        {
            this.drawPlots();
        }   
    }
    
}, {
    ATTRS : {
        type: {
            value: "stackedCombo"
        },

        showAreaFill: {
            value: true
        }
    }
});
Y.ComboSplineSeries = Y.Base.create("comboSplineSeries", Y.ComboSeries, [], {
	drawSeries: function()
    {
        this.get("graphic").clear();
        if(this.get("showAreaFill"))
        {
            this.drawAreaSpline();
        }
        if(this.get("showLines")) 
        {
            this.drawSpline();
        }
        if(this.get("showMarkers"))
        {
            this.drawPlots();
        }   
    }
}, {
    ATTRS: {
        type: {
            value : "comboSpline"
        }
    }
});
Y.StackedComboSplineSeries = Y.Base.create("stackedComboSplineSeries", Y.StackedComboSeries, [], {
	drawSeries: function()
    {
        this.get("graphic").clear();
        if(this.get("showAreaFill"))
        {
            this.drawStackedAreaSpline();
        }
        if(this.get("showLines")) 
        {
            this.drawSpline();
        }
        if(this.get("showMarkers"))
        {
            this.drawPlots();
        }   
    }
}, {
    ATTRS: {
        type : {
            value : "stackedComboSpline"
        },

        showAreaFill: {
            value: true
        }
    }
});
function RangeSeries(config)
{
	RangeSeries.superclass.constructor.apply(this, arguments);
}

RangeSeries.NAME = "rangeSeries";

RangeSeries.ATTRS = {
	type: {
        value: "range"
    }
};

Y.extend(RangeSeries, Y.CartesianSeries, {
	/**
	 * @private
	 */
	setAreaData: function()
	{
        var nextX, nextY,
            node = Y.Node.one(this._parentNode).get("parentNode"),
			w = node.get("offsetWidth"),
            h = node.get("offsetHeight"),
            padding = this.get("styles").padding,
			leftPadding = padding.left,
			topPadding = padding.top,
            xAxis = this.get("xAxis"),
            yAxis = this.get("yAxis"),
			xKey = this.get("xKey"),
			yKey = this.get("yKey"),
			xData = xAxis.getDataByKey(xKey).concat(),
			yData = yAxis.getDataByKey(yKey).concat(),
            xOffset = xAxis.getEdgeOffset(xData.length, w),
			dataWidth = w - (leftPadding + padding.right + xOffset),
			dataHeight = h - (topPadding + padding.bottom),
			xcoords = [],
			ycoords = [],
			xMax = xAxis.get("maximum"),
			xMin = xAxis.get("minimum"),
			yMax = yAxis.get("maximum"),
			yMin = yAxis.get("minimum"),
			xScaleFactor = dataWidth / (xMax - xMin),
			yScaleFactor = dataHeight / (yMax - yMin),
			dataLength = xData.length, 	
            i,
            yValues;
        xOffset *= 0.5;
        this.get("graphic").setSize(w, h);
        this._leftOrigin = Math.round(((0 - xMin) * xScaleFactor) + leftPadding);
        this._bottomOrigin =  Math.round((dataHeight + topPadding) - (0 - yMin) * yScaleFactor);
        for (i = 0; i < dataLength; ++i) 
		{
            yValues = yData[i];
            nextX = Math.round((((xData[i] - xMin) * xScaleFactor) + leftPadding + xOffset));
			nextY = {
                h: Math.round(((dataHeight + topPadding) - (yValues.high - yMin) * yScaleFactor)),
                l: Math.round(((dataHeight + topPadding) - (yValues.low - yMin) * yScaleFactor)),
                o: Math.round(((dataHeight + topPadding) - (yValues.open - yMin) * yScaleFactor)),
                c: Math.round(((dataHeight + topPadding) - (yValues.close - yMin) * yScaleFactor))
            };
            xcoords.push(nextX);
            ycoords.push(nextY);
        }
        this.set("xcoords", xcoords);
		this.set("ycoords", ycoords);
    },

    /**
     * @private
     */
	drawSeries: function()
	{
	    if(this.get("xcoords").length < 1) 
		{
			return;
		}
        var graphic = this.get("graphic"),
            style = this.get("styles").marker,
            w = style.width,
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            i = 0,
            len = xcoords.length,
            type = this.get("type"),
            graph = this.get("graph"),
            seriesCollection = graph.seriesTypes[type],
            seriesLen = seriesCollection.length,
            seriesWidth = 0,
            totalWidth = 0,
            offset = 0,
            ratio,
            renderer,
            order = this.get("order"),
            node = Y.Node.one(this._parentNode).get("parentNode"),
            left,
            hloc;
        for(; i < seriesLen; ++i)
        {
            renderer = seriesCollection[i];
            seriesWidth += renderer.get("styles").marker.width;
            if(order > i) 
            {
                offset = seriesWidth;
            }
        }
        totalWidth = len * seriesWidth;
        if(totalWidth > node.offsetWidth)
        {
            ratio = this.width/totalWidth;
            seriesWidth *= ratio;
            offset *= ratio;
            w *= ratio;
            w = Math.max(w, 1);
        }
        offset -= seriesWidth/2;
        for(i = 0; i < len; ++i)
        {
            hloc = ycoords[i];
            left = xcoords[i] + offset;
            this.drawMarker(graphic, hloc, left, style);
        }
 	}
});

Y.RangeSeries = RangeSeries;
function OHLCSeries(config)
{
	OHLCSeries.superclass.constructor.apply(this, arguments);
}

OHLCSeries.NAME = "ohlcSeries";

OHLCSeries.ATTRS = {
	type: {
        value: "ohlc"
    }
};

Y.extend(OHLCSeries, Y.RangeSeries, {
	/**
	 * @private
	 */
    drawMarker: function(graphic, hloc, left, style)
    {
        var h = hloc.h,
            o = hloc.o,
            l = hloc.l,
            c = hloc.c,
            w = style.width,
            color,
            upColor = style.upColor,
            downColor = style.downColor,
            alpha,
            upAlpha = style.upAlpha,
            downAlpha = style.downAlpha,
            up = c < o,
            thickness = style.thickness,
            center = left + w * 0.5;
            color = up ? upColor : downColor;
            alpha = up ? upAlpha : downAlpha;
        graphic.lineStyle(thickness, color, alpha);
        graphic.moveTo(left, o);
        graphic.lineTo(center, o);
        graphic.moveTo(center, h);
        graphic.lineTo(center, l);
        graphic.moveTo(center, c);
        graphic.lineTo(left + w, c);
        graphic.end();
    },
	
	/**
	 * @private
	 */
	_getDefaultStyles: function()
    {
        return {
            marker: {
                upColor: "#aaaaaa",
                upAlpha: 1,
                thickness:1,
                borderAlpha:1,
                downColor: "#000000",
                downAlpha: 1,
                width:6,
                height:6
            },
            padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }
        };
    }
});

Y.OHLCSeries = OHLCSeries;
function CandlestickSeries(config)
{
	CandlestickSeries.superclass.constructor.apply(this, arguments);
}

CandlestickSeries.NAME = "candlestickSeries";

CandlestickSeries.ATTRS = {
	type: {
        value: "candlestick"
    }
};

Y.extend(CandlestickSeries, Y.RangeSeries, {
    /**
     * @private
     */
    drawMarker: function(graphic, hloc, left, style)
    {
        var h = hloc.h,
            o = hloc.o,
            l = hloc.l,
            c = hloc.c,
            ht = Math.abs(c - o),
            w = style.width,
            fillColor,
            upFillColor = style.upFillColor,
            downFillColor = style.downFillColor,
            alpha,
            upAlpha = style.upFillAlpha,
            downAlpha = style.downFillAlpha,
            up = c < o,
            upFillType = style.upFillType || "solid",
            downFillType = style.downFillType || "solid",
            borderWidth = style.borderWidth,
            borderColor = style.borderColor,
            borderAlpha = style.borderAlpha || 1,
            colors,
            upColors = style.upColors,
            downColors = style.downColors,
            alphas,
            upAlphas = style.upAlphas || [],
            downAlphas = style.downAlphas || [],
            ratios,
            upRatios = style.upRatios || [],
            downRatios = style.downRatios || [],
            rotation,
            upRotation = style.upRotation || 0,
            downRotation = style.downRotation || 0,
            fillType = up ? upFillType : downFillType,
            top = c < o ? c : o,
            bottom = c < o ? o : c,
            center = left + w * 0.5;
        if(borderWidth > 0)
        {
            graphic.lineStyle(borderWidth, borderColor, borderAlpha);
        }
        if(fillType === "solid")
        {
            fillColor = up ? upFillColor : downFillColor;
            alpha = up ? upAlpha : downAlpha;
            graphic.beginFill(fillColor, alpha);
        }
        else
        {
            colors = up ? upColors : downColors;
            rotation = up ? upRotation : downRotation;
            ratios = up ? upRatios : downRatios;
            alphas = up ? upAlphas : downAlphas;
            graphic.beginGradientFill(fillType, colors, alphas, ratios, {rotation:rotation, width:w, height:ht});
        }
        if(top > h)
        {
            graphic.moveTo(center, h);
            graphic.lineTo(center, top);
        }
        graphic.drawRect(left, top, w, ht);
        if(l > c && l > o)
        {
            graphic.moveTo(center, bottom);
            graphic.lineTo(center, l);
        }
        graphic.end();
    },
	
	_getDefaultStyles: function()
    {
        return {
            marker: {
                upFillColor: "#ffffff",
                upFillAlpha: 1,
                borderColor:"#000000",
                borderWidth:1,
                borderAlpha:1,
                upColors:[],
                upAlphas:[],
                upRatios:[],
                upRotation:0,
                downFillColor: "#000000",
                downFillAlpha: 1,
                downBorderColor:"#000000",
                downBorderWidth:0,
                downBorderAlpha:1,
                downColors:[],
                downAlphas:[],
                downRatios:[],
                downRotation:0,
                width:6,
                height:6
            },
            padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }
        };
    }
});

Y.CandlestickSeries = CandlestickSeries;
function StackedLineSeries(config)
{
	StackedLineSeries.superclass.constructor.apply(this, arguments);
}

StackedLineSeries.NAME = "stackedLineSeries";

StackedLineSeries.ATTRS = {
	type: {
		/**
		 * Indicates the type of graph.
		 */
        value:"stackedLine"
    }
};

Y.extend(StackedLineSeries, Y.LineSeries, {
    setAreaData: function()
    {   
        StackedLineSeries.superclass.setAreaData.apply(this);
        this._stackCoordinates.apply(this);
    }
});

Y.StackedLineSeries = StackedLineSeries;
function StackedAreaSeries(config)
{
	StackedAreaSeries.superclass.constructor.apply(this, arguments);
}

StackedAreaSeries.NAME = "stackedAreaSeries";

StackedAreaSeries.ATTRS = {
	type: {
		/**
		 * Indicates the type of graph.
		 */
        value:"stackedArea"
    }
};

Y.extend(StackedAreaSeries, Y.AreaSeries, {
    setAreaData: function()
    {   
        StackedAreaSeries.superclass.setAreaData.apply(this);
        this._stackCoordinates.apply(this);
    },

	drawSeries: function()
    {
        this.get("graphic").clear();
        this.drawFill.apply(this, this._getStackedClosingPoints());
    }
});

Y.StackedAreaSeries = StackedAreaSeries;
function StackedColumnSeries(config)
{
	StackedColumnSeries.superclass.constructor.apply(this, arguments);
}

StackedColumnSeries.NAME = "stackedColumnSeries";

StackedColumnSeries.ATTRS = {
	type: {
        value: "stackedColumn"
    },

    negativeBaseValues: {
        value: null
    },

    positiveBaseValues: {
        value: null
    }
};

Y.extend(StackedColumnSeries, Y.CartesianSeries, {
    /**
     * @private
     */
    renderUI: function()
    {
        this._setNode();
    },
    
    bindUI: function()
    {
        Y.delegate("mouseover", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
        Y.delegate("mousedown", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
        Y.delegate("mouseup", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
        Y.delegate("mouseout", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
    },
	
    /**
	 * @private
	 */
	drawSeries: function()
	{
	    if(this.get("xcoords").length < 1) 
		{
			return;
		}
        var style = this._mergeStyles(this.get("styles"), {}),
            w = style.width,
            h = style.height,
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            i = 0,
            len = xcoords.length,
            top = ycoords[0],
            type = this.get("type"),
            graph = this.get("graph"),
            seriesCollection = graph.seriesTypes[type],
            ratio,
            order = this.get("order"),
            lastCollection,
            negativeBaseValues,
            positiveBaseValues,
            useOrigin = order === 0,
            node = Y.Node.one(this._parentNode).get("parentNode"),
            left,
            marker,
            bb,
            totalWidth = len * w;
        this._createMarkerCache();
        if(totalWidth > node.offsetWidth)
        {
            ratio = this.width/totalWidth;
            w *= ratio;
            w = Math.max(w, 1);
        }
        if(!useOrigin)
        {
            lastCollection = seriesCollection[order - 1];
            negativeBaseValues = lastCollection.get("negativeBaseValues");
            positiveBaseValues = lastCollection.get("positiveBaseValues");
        }
        else
        {
            negativeBaseValues = [];
            positiveBaseValues = [];
        }
        this.set("negativeBaseValues", negativeBaseValues);
        this.set("positiveBaseValues", positiveBaseValues);
        for(i = 0; i < len; ++i)
        {
            top = ycoords[i];
            if(useOrigin)
            {
                h = this._bottomOrigin - top;
                if(top < this._bottomOrigin)
                {
                    positiveBaseValues[i] = top;
                    negativeBaseValues[i] = this._bottomOrigin;
                }
                else if(top > this._bottomOrigin)
                {
                    positiveBaseValues[i] = this._bottomOrigin;
                    negativeBaseValues[i] = top;
                }
                else
                {
                    positiveBaseValues[i] = top;
                    negativeBaseValues[i] = top;
                }
            }
            else 
            {
                if(top > this._bottomOrigin)
                {
                    top += (negativeBaseValues[i] - this._bottomOrigin);
                    h = negativeBaseValues[i] - top;
                    negativeBaseValues[i] = top;
                }
                else if(top < this._bottomOrigin)
                {
                    top = positiveBaseValues[i] - (this._bottomOrigin - ycoords[i]);
                    h = positiveBaseValues[i] - top;
                    positiveBaseValues[i] = top;
                }
            }
            left = xcoords[i] - w/2;
            style.width = w;
            style.height = h;
            marker = this.getMarker.apply(this, [{index:i, styles:style}]);
            bb = marker.get("boundingBox");
            bb.setStyle("position", "absolute");
            bb.setStyle("left", left + "px");
            bb.setStyle("top", top + "px");
        }
        this._clearMarkerCache();
 	},

    /**
     * @private
     * Resizes and positions markers based on a mouse interaction.
     */
    _markerEventHandler: function(e)
    {
        var type = e.type,
            marker = Y.Widget.getByNode(e.currentTarget),
            xcoords = this.get("xcoords"),
            offset,
            i = marker.get("index") || Y.Array.indexOf(this.get("markers"), marker);
        switch(type)
        {
            case "mouseout" :
                marker.set("state", "off");
            break;
            case "mouseover" :
                marker.set("state", "over");
            break;
            case "mouseup" :
                marker.set("state", "over");
            break;
            case "mousedown" :
                marker.set("state", "down");
            break;
        }
        offset = marker.get("width") * 0.5;
        marker.get("boundingBox").setStyle("left", (xcoords[i] - offset) + "px");    
    },
	
	/**
	 * @private
	 */
    _getDefaultStyles: function()
    {
        return {
            fill: {
                alpha: "1",
                colors: [],
                alphas: [],
                ratios: [],
                rotation: 0
            },
            border: {
                weight:0
            },
            width: 6,
            height: 6,
            shape: "rect",
            padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }
        };
    }
});

Y.StackedColumnSeries = StackedColumnSeries;
function StackedBarSeries(config)
{
	StackedBarSeries.superclass.constructor.apply(this, arguments);
}

StackedBarSeries.NAME = "stackedBarSeries";

StackedBarSeries.ATTRS = {
	type: {
        value: "stackedBar"
    },
    direction: {
        value: "vertical"
    },

    negativeBaseValues: {
        value: null
    },

    positiveBaseValues: {
        value: null
    }
};

Y.extend(StackedBarSeries, Y.CartesianSeries, {
    /**
     * @private
     */
    renderUI: function()
    {
        this._setNode();
    },
    
    bindUI: function()
    {
        Y.delegate("mouseover", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
        Y.delegate("mousedown", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
        Y.delegate("mouseup", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
        Y.delegate("mouseout", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
    },
    
    drawSeries: function()
	{
	    if(this.get("xcoords").length < 1) 
		{
			return;
		}
        var style = this._mergeStyles(this.get("styles"), {}),
            w = style.width,
            h = style.height,
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            i = 0,
            len = xcoords.length,
            top = ycoords[0],
            type = this.get("type"),
            graph = this.get("graph"),
            seriesCollection = graph.seriesTypes[type],
            totalHeight = 0,
            ratio,
            order = this.get("order"),
            lastCollection,
            negativeBaseValues,
            positiveBaseValues,
            useOrigin = order === 0,
            node = Y.Node.one(this._parentNode).get("parentNode"),
            left,
            marker,
            bb;
        totalHeight = len * h;
        this._createMarkerCache();
        if(totalHeight > node.offsetHeight)
        {
            ratio = this.height/totalHeight;
            h *= ratio;
            h = Math.max(h, 1);
        }
        if(!useOrigin)
        {
            lastCollection = seriesCollection[order - 1];
            negativeBaseValues = lastCollection.get("negativeBaseValues");
            positiveBaseValues = lastCollection.get("positiveBaseValues");
        }
        else
        {
            negativeBaseValues = [];
            positiveBaseValues = [];
        }
        this.set("negativeBaseValues", negativeBaseValues);
        this.set("positiveBaseValues", positiveBaseValues);
        for(i = 0; i < len; ++i)
        {
            top = ycoords[i];
            left = xcoords[i];
            
            if(useOrigin)
            {
                w = left - this._leftOrigin;
                if(left > this._leftOrigin)
                {
                    positiveBaseValues[i] = left;
                    negativeBaseValues[i] = this._leftOrigin;
                }
                else if(left < this._leftOrigin)
                {   
                    positiveBaseValues[i] = this._leftOrigin;
                    negativeBaseValues[i] = left;
                }
                else
                {
                    positiveBaseValues[i] = left;
                    negativeBaseValues[i] = this._leftOrigin;
                }
                left -= w;
            }
            else
            {
                if(left < this._leftOrigin)
                {
                    left = negativeBaseValues[i] - (this._leftOrigin - xcoords[i]);
                    w = negativeBaseValues[i] - left;
                    negativeBaseValues[i] = left;
                }
                else if(left > this._leftOrigin)
                {
                    left += (positiveBaseValues[i] - this._leftOrigin);
                    w = left - positiveBaseValues[i];
                    positiveBaseValues[i] = left;
                    left -= w;
                }
            }
            top -= h/2;        
            style.width = w;
            style.height = h;
            marker = this.getMarker.apply(this, [{index:i, styles:style}]);
            bb = marker.get("boundingBox");
            bb.setStyle("position", "absolute");
            bb.setStyle("left", left + "px");
            bb.setStyle("top", top + "px");
        }
        this._clearMarkerCache();
 	},
    
    /**
     * @private
     * Resizes and positions markers based on a mouse interaction.
     */
    _markerEventHandler: function(e)
    {
        var type = e.type,
            marker = Y.Widget.getByNode(e.currentTarget),
            ycoords = this.get("ycoords"),
            i = marker.get("index") || Y.Array.indexOf(this.get("markers"), marker),
            h = marker.get("height");
        switch(type)
        {
            case "mouseout" :
                marker.set("state", "off");
            break;
            case "mouseover" :
                marker.set("state", "over");
            break;
            case "mouseup" :
                marker.set("state", "over");
            break;
            case "mousedown" :
                marker.set("state", "down");
            break;
        }
        marker.get("boundingBox").setStyle("top", (ycoords[i] - h/2) + "px");    
    },
	
	/**
	 * @private
	 */
    _getDefaultStyles: function()
    {
        return {
            fill: {
                alpha: "1",
                colors: [],
                alphas: [],
                ratios: [],
                rotation: 0
            },
            width: 6,
            height: 6,
            shape: "rect",
            padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }
        };
    }
});

Y.StackedBarSeries = StackedBarSeries;
function Graph(config)
{
    Graph.superclass.constructor.apply(this, arguments);
}

Graph.NAME = "graph";

Graph.ATTRS = {
    seriesCollection: {
        lazyAdd: false,

        getter: function()
        {
            return this._seriesCollection;
        },

        setter: function(val)
        {
            this._parseSeriesCollection(val);
            return this._seriesCollection;
        }
    },

    parent: {
        value: null
    }
};

Y.extend(Graph, Y.Base, {
    /**
     * Hash of arrays containing series mapped to a series type.
     */
    seriesTypes: null,

    /**
     * Returns a series instance based on an index.
     */
    getSeriesByIndex: function(val)
    {
        var col = this._seriesCollection,
            series;
        if(col && col.length > val)
        {
            series = col[val];
        }
        return series;
    },

    /**
     * Returns a series instance based on a key value.
     */
    getSeriesByKey: function(val)
    {
        var obj = this._seriesDictionary,
            series;
        if(obj && obj.hasOwnProperty(val))
        {
            series = obj[val];
        }
        return series;
    },

    /**
     * Adds dispatcher to collection
     */
    addDispatcher: function(val)
    {
        if(!this._dispatchers)
        {
            this._dispatchers = [];
        }
        this._dispatchers.push(val);
    },

    /**
     * @private 
     * @description Collection of series to be displayed in the graph.
     */
    _seriesCollection: null,
    
    /**
     * @private
     */
    _seriesDictionary: null,

    /**
     * @private
     * @description Parses series instances to be displayed in the graph.
     * @param {Array} Collection of series instances or object literals containing necessary properties for creating a series instance.
     */
    _parseSeriesCollection: function(val)
    {
        if(!val)
        {
            return;
        }	
        var len = val.length,
            i = 0,
            series,
            seriesKey;
        if(!this._seriesCollection)
        {
            this._seriesCollection = [];
        }
        if(!this._seriesDictionary)
        {
            this._seriesDictionary = {};
        }
        if(!this.seriesTypes)
        {
            this.seriesTypes = [];
        }
        for(; i < len; ++i)
        {	
            series = val[i];
            if(!(series instanceof Y.CartesianSeries) && !(series instanceof Y.PieSeries))
            {
                this._createSeries(series);
                continue;
            }
            this._addSeries(series);
        }
        len = this._seriesCollection.length;
        for(i = 0; i < len; ++i)
        {
            series = this._seriesCollection[i];
            seriesKey = series.get("direction") == "horizontal" ? "yKey" : "xKey";
            this._seriesDictionary[series.get(seriesKey)] = series;
            series.render(this.get("parent"));
        }
    },

    /**
     * @private
     * @description Adds a series to the graph.
     * @param {Series}
     */
    _addSeries: function(series)
    {
        var type = series.get("type"),
            seriesCollection = this._seriesCollection,
            graphSeriesLength = seriesCollection.length,
            seriesTypes = this.seriesTypes,
            typeSeriesCollection;	
        if(!series.get("graph")) 
        {
            series.set("graph", this);
        }
        seriesCollection.push(series);
        if(!seriesTypes.hasOwnProperty(type))
        {
            this.seriesTypes[type] = [];
        }
        typeSeriesCollection = this.seriesTypes[type];
        series.set("graphOrder", graphSeriesLength);
        series.set("order", typeSeriesCollection.length);
        typeSeriesCollection.push(series);
        this.addDispatcher(series);
        series.after("drawingComplete", Y.bind(this._drawingCompleteHandler, this));
        this.fire("seriesAdded", series);
    },

    _createSeries: function(seriesData)
    {
        var type = seriesData.type,
            seriesCollection = this._seriesCollection,
            seriesTypes = this.seriesTypes,
            typeSeriesCollection,
            seriesType,
            series;
            seriesData.graph = this;
        if(!seriesTypes.hasOwnProperty(type))
        {
            seriesTypes[type] = [];
        }
        typeSeriesCollection = seriesTypes[type];
        seriesData.graph = this;
        seriesData.order = typeSeriesCollection.length;
        seriesData.graphOrder = seriesCollection.length;
        seriesType = this._getSeries(seriesData.type);
        series = new seriesType(seriesData);
        this.addDispatcher(series);
        series.after("drawingComplete", Y.bind(this._drawingCompleteHandler, this));
        typeSeriesCollection.push(series);
        seriesCollection.push(series);
    },

    /**
     * @private
     * @description Creates a series instance based on a specified type.
     * @param {String} Indicates type of series instance to be created.
     * @return {Series} Series instance created.
     */
    _getSeries: function(type)
    {
        var seriesClass;
        switch(type)
        {
            case "line" :
                seriesClass = Y.LineSeries;
            break;
            case "column" :
                seriesClass = Y.ColumnSeries;
            break;
            case "bar" :
                seriesClass = Y.BarSeries;
            break;
            case "area" : 
                seriesClass = Y.AreaSeries;
            break;
            case "candlestick" :
                seriesClass = Y.CandlestickSeries;
            break;
            case "ohlc" :
                seriesClass = Y.OHLCSeries;
            break;
            case "stackedarea" :
                seriesClass = Y.StackedAreaSeries;
            break;
            case "stackedline" :
                seriesClass = Y.StackedLineSeries;
            break;
            case "stackedcolumn" :
                seriesClass = Y.StackedColumnSeries;
            break;
            case "stackedbar" :
                seriesClass = Y.StackedBarSeries;
            break;
            case "markerseries" :
                seriesClass = Y.MarkerSeries;
            break;
            case "spline" :
                seriesClass = Y.SplineSeries;
            break;
            case "areaspline" :
                seriesClass = Y.AreaSplineSeries;
            break;
            case "stackedspline" :
                seriesClass = Y.StackedSplineSeries;
            break;
            case "stackedareaspline" :
                seriesClass = Y.StackedAreaSplineSeries;
            break;
            case "stackedmarkerseries" :
                seriesClass = Y.StackedMarkerSeries;
            break;
            case "pieseries" :
                seriesClass = Y.PieSeries;
            break;
            case "combo" :
                seriesClass = Y.ComboSeries;
            break;
            case "stackedcombo" :
                seriesClass = Y.StackedComboSeries;
            break;
            case "combospline" :
                seriesClass = Y.ComboSplineSeries;
            break;
            case "stackedcombospline" :
                seriesClass = Y.StackedComboSplineSeries;
            break;
            default:
                seriesClass = Y.CartesianSeries;
            break;
        }
        return seriesClass;
    },

    /**
     * @private
     */
    _dispatchers: null,

    /**
     * @private
     */
    _drawingCompleteHandler: function(e)
    {
        var series = e.currentTarget,
            index = Y.Array.indexOf(this._dispatchers, series);
        if(index > -1)
        {
            this._dispatchers.splice(index, 1);
        }
        if(this._dispatchers.length < 1)
        {
            this.fire("chartRendered");
        }
    }
});

Y.Graph = Graph;
/**
 * Renders an axis.
 */
function AxisRenderer(config)
{
    AxisRenderer.superclass.constructor.apply(this, arguments);
}

AxisRenderer.NAME = "axisRenderer";

AxisRenderer.ATTRS = {
        edgeOffset: {
            value: 0
        },

        /**
         * The graphic in which the axis line and ticks will be rendered.
         */
        graphic: {
            value: null
        },
        
        /**
         * Reference to the <code>Axis</code> instance used for assigning 
         * <code>AxisRenderer</code>.
         */
        axis: {
            
            value: null,

            validator: function(value)
            {
                return value !== this.get("axis");
            }
        },

        /**
         * Contains the contents of the axis. 
         */
        node: {
            value: null
        },

        /**
         * Direction of the axis.
         */
        position: {
            value: "bottom",

            validator: function(val)
            {
                return ((val !== this.get("position")) && (val === "bottom" || val === "top" || val === "left" || val === "right"));
            }
        },

        /**
         * Distance determined by the tick styles used to calculate the distance between the axis
         * line in relation to the top of the axis.
         */
        topTickOffset: {
            value: 0
        },

        /**
         * Distance determined by the tick styles used to calculate the distance between the axis
         * line in relation to the bottom of the axis.
         */
        bottomTickOffset: {
            value: 0
        },

        /**
         * Distance determined by the tick styles used to calculate the distance between the axis
         * line in relation to the left of the axis.
         */
        leftTickOffset: {
            value: 0
        },

        /**
         * Distance determined by the tick styles used to calculate the distance between the axis
         * line in relation to the right side of the axis.
         */
        rightTickOffset: {
            value: 0
        },

        /**
         * Indicates whether the axis overlaps the graph. If an axis is the inner most axis on a given
         * position and the tick position is inside or cross, the axis will need to overlap the graph.
         */
        overlapGraph: {
            value:true,

            validator: function(val)
            {
                return Y.Lang.isBoolean(val);
            }
        }
    };
    Y.extend(AxisRenderer, Y.Renderer, {    
    /**
     * @private
     * @description Triggered by a change in the axis attribute. Removes any old axis listeners and sets up listeners for the new axis.
     */
    axisChangeHandler: function(e)
    {
       var axis = e.newVal,
            oldAxis = e.prevVal;
        if(oldAxis)
        {
            oldAxis.detach("axisReady", this._axisDataChangeHandler);
            oldAxis.detach("axisUpdate", this._axisDataChangeHandler);
        }
        axis.after("axisReady", Y.bind(this._axisDataChangeHandler, this));
        axis.after("axisUpdate", Y.bind(this._axisDataChangeHandler, this));
    },

    /**
     * @private
     * @description Handler for data changes.
     */
    _axisDataChangeHandler: function(e)
    {
        if(this.get("rendered"))
        {
            this._drawAxis();
        }
    },

    /**
     * @private
     */
    _updateHandler: function(e)
    {
        if(this.get("rendered"))
        {
            this._drawAxis();
        }
    },

    /**
     * @private
     */
    _positionChangeHandler: function(e)
    {
        this._ui =this.getLayout(this.get("position"));
        if(this.get("rendered"))
        {
            this._drawAxis();
        }
    },

    /**
     * @private
     */
    renderUI: function()
    {
        this._ui =this.getLayout(this.get("position"));
        this._setCanvas();
    },
    
    /**
     * @private
     */
    bindUI: function()
    {
        var axis = this.get("axis");
        if(axis)
        {
            axis.after("axisReady", Y.bind(this._axisDataChangeHandler, this));
            axis.after("axisUpdate", Y.bind(this._axisDataChangeHandler, this));
        }
        this.after("axisChange", this.axisChangeHandler);
        this.after("stylesChange", this._updateHandler);
        this.after("positionChange", this._positionChangeHandler);
        this.after("overlapGraphChange", this._updateHandler);
    },
   
    /**
     * @private
     */
    syncUI: function()
    {
        this._drawAxis();
    },

    /**
     * @private
     * Creates a <code>Graphic</code> instance.
     */
    _setCanvas: function()
    {
        var cb = this.get("contentBox"),
            p = this.get("position"),
            n = document.createElement("div"),
            style = n.style,
            pn = this._parentNode;
        cb.appendChild(n);
        style.position = "absolute";
        style.display = "block";
        style.top = "0px"; 
        style.left = "0px";
        style.border = "1px";
        if(p === "top" || p === "bottom")
        {
            cb.setStyle("width", pn.getStyle("width"));
        }
        else
        {
            cb.setStyle("height", pn.getStyle("height"));
        }
        style.width = cb.getStyle("width");
        style.height = cb.getStyle("height");
        this.set("node", n);
        this.set("graphic", new Y.Graphic());
        this.get("graphic").render(this.get("node"));
    },
	
    /**
     * @private
     * @description Returns the default style values for the axis.
     */
    _getDefaultStyles: function()
    {
        return {
            majorTicks: {
                display:"inside",
                length:4,
                color:"#000000",
                weight:1,
                alpha:1
            },
            minorTicks: {
                display:"none",
                length:2,
                color:"#000000",
                weight:1
            },
            line: {
                weight:1,
                color:"#000000",
                alpha:1
            },
            majorUnit: {
                determinant:"count",
                count:11,
                distance:75
            },
            padding: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            },
            top: "0px",
            left: "0px",
            width: "100px",
            height: "100px",
            label: {
                rotation: 0,
                margin: {
                    top:4,
                    right:4,
                    bottom:4,
                    left:4
                }
            },
            hideOverlappingLabelTicks: false
        };
    }

});

Y.AxisRenderer = AxisRenderer;        
/**
 * Contains algorithms for rendering a left axis.
 */
function LeftAxisLayout(config)
{
    LeftAxisLayout.superclass.constructor.apply(this, arguments);
}

LeftAxisLayout.ATTRS = {
    axisRenderer: {
        value: null
    },

    maxLabelSize: {
        value: 0
    }
};

Y.extend(LeftAxisLayout, Y.Base, {
    /**
     * Sets the length of the tick on either side of the axis line.
     */
    setTickOffsets: function()
    {
        var ar = this.get("axisRenderer"),
            majorTicks = ar.get("styles").majorTicks,
            tickLength = majorTicks.length,
            halfTick = tickLength * 0.5,
            display = majorTicks.display;
        ar.set("topTickOffset",  0);
        ar.set("bottomTickOffset",  0);
        
        switch(display)
        {
            case "inside" :
                ar.set("rightTickOffset",  tickLength);
            break;
            case "outside" : 
                ar.set("leftTickOffset",  tickLength);
            break;
            case "cross":
                ar.set("rightTickOffset", halfTick); 
                ar.set("leftTickOffset",  halfTick);
            break;
        }
    },

    /**
     * Calculates the coordinates for the first point on an axis.
     */
    getLineStart: function()
    {
        var ar = this.get("axisRenderer"),
            style = ar.get("styles"),
            padding = style.padding,
            majorTicks = style.majorTicks,
            tickLength = majorTicks.length,
            display = majorTicks.display,
            pt = {x:padding.left, y:0};
        if(display === "outside")
        {
            pt.x += tickLength;
        }
        else if(display === "cross")
        {
            pt.x += tickLength/2;
        }
        return pt; 
    },
    
    /**
     * Draws a tick
     */
    drawTick: function(pt, tickStyles)
    {
        var ar = this.get("axisRenderer"),
            style = ar.get("styles"),
            padding = style.padding,
            tickLength = tickStyles.length,
            start = {x:padding.left, y:pt.y},
            end = {x:tickLength + padding.left, y:pt.y};
        ar.drawLine(start, end, tickStyles);
    },
    
    /**
     * Calculates the point for a label.
     */
    getLabelPoint: function(point)
    {
        var ar = this.get("axisRenderer");
        return {x:point.x - ar.get("leftTickOffset"), y:point.y};
    },

    positionLabel: function(label, pt)
    {
        var ar = this.get("axisRenderer"),
            style = ar.get("styles").label,
            margin = 0,
            leftOffset = pt.x,
            topOffset = pt.y,
            rot =  Math.min(90, Math.max(-90, style.rotation)),
            absRot = Math.abs(rot),
            radCon = Math.PI/180,
            sinRadians = parseFloat(parseFloat(Math.sin(absRot * radCon)).toFixed(8)),
            cosRadians = parseFloat(parseFloat(Math.cos(absRot * radCon)).toFixed(8)),
            m11 = cosRadians,
            m12 = rot > 0 ? -sinRadians : sinRadians,
            m21 = -m12,
            m22 = m11,
            max = 0,
            maxLabelSize = this.get("maxLabelSize");
        if(style.margin && style.margin.right)
        {
            margin = style.margin.right;
        }
        if(Y.UA.ie)
        {
            label.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(rotation=0)";
            if(rot === 0)
            {
                leftOffset -= label.offsetWidth;
                topOffset -= label.offsetHeight * 0.5;
            }
            else if(absRot === 90)
            {
                leftOffset -= label.offsetHeight;
                topOffset -= label.offsetWidth * 0.5;
            }
            else if(rot === -90)
            {
                leftOffset -= label.offsetHeight;
                topOffset -= label.offsetWidth * 0.5;
            }
            else if(rot > 0)
            {
                leftOffset -= (cosRadians * label.offsetWidth) + (label.offsetHeight * rot/90);
                topOffset -= (sinRadians * label.offsetWidth) + (cosRadians * (label.offsetHeight * 0.5));
            }
            else
            {
                leftOffset -= (cosRadians * label.offsetWidth) + (absRot/90 * label.offsetHeight);
                topOffset -= cosRadians * (label.offsetHeight * 0.5);
            }
            leftOffset -= margin;
            label.style.left = leftOffset + "px";
            label.style.top = topOffset + "px";
            label.style.filter = 'progid:DXImageTransform.Microsoft.Matrix(M11=' + m11 + ' M12=' + m12 + ' M21=' + m21 + ' M22=' + m22 + ' sizingMethod="auto expand")';
            this.set("maxLabelSize", Math.max(maxLabelSize, label.offsetWidth));
            return;
        }
        if(rot === 0)
        {
            max = label.offsetWidth;
            leftOffset -= max;
            topOffset -= label.offsetHeight * 0.5;
        }
        else if(rot === 90)
        {
            max = label.offsetHeight;
            topOffset -= label.offsetWidth * 0.5;
        }
        else if(rot === -90)
        {
            max = label.offsetHeight;
            leftOffset -= max;
            topOffset += label.offsetWidth * 0.5;
        }
        else
        {
            max = (cosRadians * label.offsetWidth) + (sinRadians * label.offsetHeight);
            if(rot < 0)
            {
                leftOffset -= max;
                topOffset += (sinRadians * label.offsetWidth) - (cosRadians * (label.offsetHeight * 0.6)); 
            }
            else
            {
                leftOffset -= (cosRadians * label.offsetWidth);
                topOffset -= (sinRadians * label.offsetWidth) + (cosRadians * (label.offsetHeight * 0.6));
            }
        }
        leftOffset -= margin;
        label.style.left = leftOffset + "px";
        label.style.top = topOffset + "px";
        label.style.MozTransformOrigin =  "0 0";
        label.style.MozTransform = "rotate(" + rot + "deg)";
        label.style.webkitTransformOrigin = "0 0";
        label.style.webkitTransform = "rotate(" + rot + "deg)";
        this.set("maxLabelSize", Math.max(max, maxLabelSize));
    },

    /**
     * Calculates the size and positions the content elements.
     */
    setSizeAndPosition: function()
    {
        var labelSize = this.get("maxLabelSize"),
            ar = this.get("axisRenderer"),
            style = ar.get("styles"),
            sz = style.line.weight,
            majorTicks = style.majorTicks,
            display = majorTicks.display,
            tickLen = majorTicks.length;
        if(display === "outside")
        {
            sz += tickLen;
        }
        else if(display === "cross")
        {
            sz += tickLen * 0.5;
        }
        sz += labelSize;
        ar.get("node").style.left = labelSize + "px";
        ar.set("width", sz);
    },
    
    offsetNodeForTick: function(node)
    {
        var ar = this.get("axisRenderer"),
            majorTicks = ar.get("styles").majorTicks,
            tickLength = majorTicks.length,
            display = majorTicks.display;
        if(display === "inside")
        {
            node.style.marginRight = (0 - tickLength) + "px";
        }
        else if (display === "cross")
        {
            node.style.marginRight = (0 - (tickLength * 0.5)) + "px";
        }
    }
});

Y.LeftAxisLayout = LeftAxisLayout;
/**
 * Contains algorithms for rendering a right axis.
 */
function RightAxisLayout(config)
{
    RightAxisLayout.superclass.constructor.apply(this, arguments);
}

RightAxisLayout.ATTRS = {
    axisRenderer: {
        value: null
    }
};

Y.extend(RightAxisLayout, Y.Base, {
    /**
     * Sets the length of the tick on either side of the axis line.
     */
    setTickOffsets: function()
    {
        var ar = this.get("axisRenderer"),
            majorTicks = ar.get("styles").majorTicks,
            tickLength = majorTicks.length,
            halfTick = tickLength * 0.5,
            display = majorTicks.display;
        ar.set("topTickOffset",  0);
        ar.set("bottomTickOffset",  0);
        
        switch(display)
        {
            case "inside" :
                ar.set("leftTickOffset",  tickLength);
            break;
            case "outside" : 
                ar.set("rightTickOffset",  tickLength);
            break;
            case "cross":
                ar.set("rightTickOffset",  halfTick);
                ar.set("leftTickOffset",  halfTick);
            break;
        }
    },

    drawTick: function(pt, tickStyles)
    {
        var ar = this.get("axisRenderer"),
            style = ar.get("styles"),
            padding = style.padding,
            tickLength = tickStyles.length,
            start = {x:padding.left, y:pt.y},
            end = {x:padding.left + tickLength, y:pt.y};
        ar.drawLine(start, end, tickStyles);
    },
    
    /**
     * Calculates the coordinates for the first point on an axis.
     */
    getLineStart: function()
    {
        var ar = this.get("axisRenderer"),
            style = ar.get("styles"),
            padding = style.padding,
            majorTicks = style.majorTicks,
            tickLength = majorTicks.length,
            display = majorTicks.display,
            pt = {x:padding.left, y:padding.top};
        if(display === "inside")
        {
            pt.x += tickLength;
        }
        else if(display === "cross")
        {
            pt.x += tickLength/2;
        }
        return pt;
    },
    
    /**
     * Calculates the point for a label.
     */
    getLabelPoint: function(point)
    {
        var ar = this.get("axisRenderer");
        return {x:point.x + ar.get("rightTickOffset"), y:point.y};
    },

    positionLabel: function(label, pt)
    {
        var ar = this.get("axisRenderer"),
            style = ar.get("styles").label,
            margin = 0,
            leftOffset = pt.x,
            topOffset = pt.y,
            rot =  Math.min(Math.max(style.rotation, -90), 90),
            absRot = Math.abs(rot),
            radCon = Math.PI/180,
            sinRadians = parseFloat(parseFloat(Math.sin(absRot * radCon)).toFixed(8)),
            cosRadians = parseFloat(parseFloat(Math.cos(absRot * radCon)).toFixed(8)),
            m11 = cosRadians,
            m12 = rot > 0 ? -sinRadians : sinRadians,
            m21 = -m12,
            m22 = m11;
            if(style.margin && style.margin.right)
            {
                margin = style.margin.right;
            }
        if(Y.UA.ie)
        {
            label.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(rotation=0)";
            if(rot === 0)
            {
                topOffset -= label.offsetHeight * 0.5;
            }
            else if(absRot === 90)
            {
                topOffset -= label.offsetWidth * 0.5;
            }
            else if(rot > 0)
            {
                topOffset -= (cosRadians * (label.offsetHeight * 0.5));
            }
            else
            {
                topOffset -= (sinRadians * label.offsetWidth) +  (cosRadians * (label.offsetHeight * 0.5));
            }
            leftOffset += margin;
            label.style.left = leftOffset + "px";
            label.style.top = topOffset + "px";
            label.style.filter = 'progid:DXImageTransform.Microsoft.Matrix(M11=' + m11 + ' M12=' + m12 + ' M21=' + m21 + ' M22=' + m22 + ' sizingMethod="auto expand")';
            return;
        }
        if(rot === 0)
        {
            topOffset -= label.offsetHeight * 0.5;
        }
        else if(rot === 90)
        {
            leftOffset += label.offsetHeight;
            topOffset -= label.offsetWidth * 0.5;
        }
        else if(rot === -90)
        {
            topOffset += label.offsetWidth * 0.5;
        }
        else if(rot < 0)
        {
            topOffset -= (cosRadians * (label.offsetHeight * 0.6)); 
        }
        else
        {
            topOffset -= cosRadians * (label.offsetHeight * 0.6);
            leftOffset += sinRadians * label.offsetHeight;
        }
        leftOffset += margin;
        label.style.left = leftOffset + "px";
        label.style.top = topOffset + "px";
        label.style.MozTransformOrigin =  "0 0";
        label.style.MozTransform = "rotate(" + rot + "deg)";
        label.style.webkitTransformOrigin = "0 0";
        label.style.webkitTransform = "rotate(" + rot + "deg)";
    },

    /**
     * Calculates the size and positions the content elements.
     */
    setSizeAndPosition: function()
    {
        var ar = this.get("axisRenderer"),
            labelSize = this.get("maxLabelSize"),
            style = ar.get("styles"),
            sz = style.line.weight,
            majorTicks = style.majorTicks,
            display = majorTicks.display,
            tickLen = majorTicks.length;
        if(display === "outside")
        {
            sz += tickLen;
        }
        else if(display === "cross")
        {
            sz += tickLen * 0.5;
        }
        sz += labelSize;
        ar.set("width", sz);
    },
    
    offsetNodeForTick: function(node)
    {
        var ar = this.get("axisRenderer"),
            majorTicks = ar.get("styles").majorTicks,
            tickLength = majorTicks.length,
            display = majorTicks.display;
        if(display === "inside")
        {
            node.style.marginLeft = (0 - tickLength) + "px";
        }
        else if (display === "cross")
        {
            node.style.marginLeft = (0 - (tickLength * 0.5)) + "px";
        }
    }
});

Y.RightAxisLayout = RightAxisLayout;
/**
 * Contains algorithms for rendering a bottom axis.
 */
function BottomAxisLayout(config)
{
    BottomAxisLayout.superclass.constructor.apply(this, arguments);
}

BottomAxisLayout.ATTRS = {
    axisRenderer: {
        value:null
    },

    maxLabelSize: {
        value: 0
    }
};

Y.extend(BottomAxisLayout, Y.Base, {
    /**
     * Sets the length of the tick on either side of the axis line.
     */
    setTickOffsets: function()
    {
        var ar = this.get("axisRenderer"),
            majorTicks = ar.get("styles").majorTicks,
            tickLength = majorTicks.length,
            halfTick = tickLength * 0.5,
            display = majorTicks.display;
        ar.set("leftTickOffset",  0);
        ar.set("rightTickOffset",  0);

        switch(display)
        {
            case "inside" :
                ar.set("topTickOffset",  tickLength);
            break;
            case "outside" : 
                ar.set("bottomTickOffset",  tickLength);
            break;
            case "cross":
                ar.set("topTickOffset",  halfTick);
                ar.set("bottomTickOffset",  halfTick);
            break;
        }
    },
    
    /**
     * Calculates the size and positions the content elements.
     */
    setSizeAndPosition: function()
    {
        var labelSize = this.get("maxLabelSize"),
            ar = this.get("axisRenderer"),
            style = ar.get("styles"),
            sz = style.line.weight,
            majorTicks = style.majorTicks,
            display = majorTicks.display,
            tickLen = majorTicks.length;
        if(display === "outside")
        {
            sz += tickLen;
        }
        else if(display === "cross")
        {
            sz += tickLen * 0.5;
        }
        sz += labelSize;
        ar.set("height", sz);
    },

    /**
     * Calculates the coordinates for the first point on an axis.
     */
    getLineStart: function()
    {
        var ar = this.get("axisRenderer"),
            style = ar.get("styles"),
            padding = style.padding,
            majorTicks = style.majorTicks,
            tickLength = majorTicks.length,
            display = majorTicks.display,
            pt = {x:0, y:padding.top};
        if(display === "inside")
        {
            pt.y += tickLength;
        }
        else if(display === "cross")
        {
            pt.y += tickLength/2;
        }
        return pt; 
    },
    
    /**
     * Draws a tick
     */
    drawTick: function(pt, tickStyles)
    {
        var ar = this.get("axisRenderer"),
            style = ar.get("styles"),
            padding = style.padding,
            tickLength = tickStyles.length,
            start = {x:pt.x, y:padding.top},
            end = {x:pt.x, y:tickLength + padding.top};
        ar.drawLine(start, end, tickStyles);
    },

    /**
     * Calculates the point for a label.
     */
    getLabelPoint: function(point)
    {
        var ar = this.get("axisRenderer");
        return {x:point.x, y:point.y + ar.get("bottomTickOffset")};
    },
    
    /**
     * Rotate and position labels.
     */
    positionLabel: function(label, pt)
    {
        var ar = this.get("axisRenderer"),
            style = ar.get("styles").label,
            margin = 0,
            leftOffset = pt.x,
            topOffset = pt.y,
            rot =  Math.min(90, Math.max(-90, style.rotation)),
            absRot = Math.abs(rot),
            radCon = Math.PI/180,
            sinRadians = parseFloat(parseFloat(Math.sin(absRot * radCon)).toFixed(8)),
            cosRadians = parseFloat(parseFloat(Math.cos(absRot * radCon)).toFixed(8)),
            m11 = cosRadians,
            m12 = rot > 0 ? -sinRadians : sinRadians,
            m21 = -m12,
            m22 = m11,
            max = 0,
            maxLabelSize = this.get("maxLabelSize");
        if(label.margin && label.margin.top)
        {
            margin = label.margin.top;
        }
        if(Y.UA.ie)
        {
            m11 = cosRadians;
            m12 = rot > 0 ? -sinRadians : sinRadians;
            m21 = -m12;
            m22 = m11;
            label.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(rotation=0)";
            if(absRot === 90)
            {
                leftOffset -= label.offsetHeight * 0.5;
            }
            else if(rot < 0)
            {
                leftOffset -= cosRadians * label.offsetWidth;
                leftOffset -= sinRadians * (label.offsetHeight * 0.5);
            }
            else if(rot > 0)
            {
                leftOffset -= sinRadians * (label.offsetHeight * 0.5);
            }
            else
            {
                leftOffset -= label.offsetWidth * 0.5;
            }
            topOffset += margin;
            label.style.left = leftOffset + "px";
            label.style.top = topOffset + "px";
            label.style.filter = 'progid:DXImageTransform.Microsoft.Matrix(M11=' + m11 + ' M12=' + m12 + ' M21=' + m21 + ' M22=' + m22 + ' sizingMethod="auto expand")';
            this.set("maxLabelSize", Math.max(label.offsetHeight, maxLabelSize));
            return;
        }
        if(rot === 0)
        {
            leftOffset -= label.offsetWidth * 0.5;
            max = label.offsetHeight;
        }
        else if(absRot === 90)
        {
            max = label.offsetWidth;
            if(rot === 90)
            {
                leftOffset += label.offsetHeight * 0.5;
            }
            else
            {
                topOffset += max;
                leftOffset -= label.offsetHeight * 0.5;
            }
        }
        else 
        {
            max = (sinRadians * label.offsetWidth) + (cosRadians * label.offsetHeight); 
            if(rot < 0)
            {
                leftOffset -= (cosRadians * label.offsetWidth) + (sinRadians * (label.offsetHeight * 0.6));
                topOffset += sinRadians * label.offsetWidth;
            }
            else
            {
                leftOffset += sinRadians * (label.offsetHeight * 0.6);
            }
        }
        topOffset += margin;
        label.style.left = leftOffset + "px";
        label.style.top = topOffset + "px";
        label.style.MozTransformOrigin =  "0 0";
        label.style.MozTransform = "rotate(" + rot + "deg)";
        label.style.webkitTransformOrigin = "0 0";
        label.style.webkitTransform = "rotate(" + rot + "deg)";
        this.set("maxLabelSize", Math.max(max, maxLabelSize));
    },

    /**
     * Adjusts position for inner ticks.
     */
    offsetNodeForTick: function(node)
    {
        var ar = this.get("axisRenderer"),
            majorTicks = ar.get("styles").majorTicks,
            tickLength = majorTicks.length,
            display = majorTicks.display;
        if(display === "inside")
        {
            node.style.marginTop = (0 - tickLength) + "px";
        }
        else if (display === "cross")
        {
            node.style.marginTop = (0 - (tickLength * 0.5)) + "px";
        }
    }
});

Y.BottomAxisLayout = BottomAxisLayout;
/**
 * Contains algorithms for rendering a top axis.
 */
function TopAxisLayout(config)
{
    TopAxisLayout.superclass.constructor.apply(this, arguments);
}

TopAxisLayout.ATTRS = {
    axisRenderer: {
        value: null
    }
};

Y.extend(TopAxisLayout, Y.Base, {
    /**
     * Sets the length of the tick on either side of the axis line.
     */
    setTickOffsets: function()
    {
        var ar = this.get("axisRenderer"),
            majorTicks = ar.get("styles").majorTicks,
            tickLength = majorTicks.length,
            halfTick = tickLength * 0.5,
            display = majorTicks.display;
        ar.set("leftTickOffset",  0);
        ar.set("rightTickOffset",  0);
        
        switch(display)
        {
            case "inside" :
                ar.set("bottomTickOffset",  tickLength);
            break;
            case "outside" : 
                ar.set("topTickOffset",  tickLength);
            break;
            case "cross":
                ar.set("topTickOffset",  halfTick);
                ar.set("bottomTickOffset",  halfTick);
            break;
        }
    },

    /**
     * Calculates the coordinates for the first point on an axis.
     */
    getLineStart: function()
    {
        var ar = this.get("axisRenderer"),
            style = ar.get("styles"),
            padding = style.padding,
            majorTicks = style.majorTicks,
            tickLength = majorTicks.length,
            display = majorTicks.display,
            pt = {x:0, y:padding.top};
        if(display === "outside")
        {
            pt.y += tickLength;
        }
        else if(display === "cross")
        {
            pt.y += tickLength/2;
        }
        return pt; 
    },
    
    /**
     * Draws a tick
     */
    drawTick: function(pt, tickStyles)
    {
        var ar = this.get("axisRenderer"),
            style = ar.get("styles"),
            padding = style.padding,
            tickLength = tickStyles.length,
            start = {x:pt.x, y:padding.top},
            end = {x:pt.x, y:tickLength + padding.top};
        ar.drawLine(start, end, tickStyles);
    },
    
    /**
     * Calculates the point for a label.
     */
    getLabelPoint: function(pt)
    {
        var ar = this.get("axisRenderer");
        return {x:pt.x, y:pt.y - ar.get("topTickOffset")};
    },

    positionLabel: function(label, pt)
    {
        var ar = this.get("axisRenderer"),
            style = ar.get("styles").label,
            margin = 0,
            leftOffset = pt.x,
            topOffset = pt.y,
            rot =  Math.max(-90, Math.min(90, style.rotation)),
            absRot = Math.abs(rot),
            radCon = Math.PI/180,
            sinRadians = parseFloat(parseFloat(Math.sin(absRot * radCon)).toFixed(8)),
            cosRadians = parseFloat(parseFloat(Math.cos(absRot * radCon)).toFixed(8)),
            m11,
            m12,
            m21,
            m22;
        rot = Math.min(90, rot);
        rot = Math.max(-90, rot);
        if(style.margin && style.margin.bottom)
        {
            margin = style.margin.bottom;
        }
        if(Y.UA.ie)
        {
            label.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(rotation=0)";
            m11 = cosRadians;
            m12 = rot > 0 ? -sinRadians : sinRadians;
            m21 = -m12;
            m22 = m11;
            if(rot === 0)
            {
                leftOffset -= label.offsetWidth * 0.5;
                topOffset -= label.offsetHeight;
            }
            else if(absRot === 90)
            {
                leftOffset -= label.offsetHeight * 0.5;
                topOffset -= label.offsetWidth;
            }
            else if(rot > 0)
            {
                leftOffset -= (cosRadians * label.offsetWidth) + Math.min((sinRadians * label.offsetHeight), (rot/180 * label.offsetHeight));
                topOffset -= (sinRadians * label.offsetWidth) + (cosRadians * (label.offsetHeight));
            }
            else
            {
                leftOffset -= sinRadians * (label.offsetHeight * 0.5);
                topOffset -= (sinRadians * label.offsetWidth) + (cosRadians * (label.offsetHeight));
            }
            topOffset -= margin;
            label.style.left = leftOffset;
            label.style.top = topOffset;
            label.style.filter = 'progid:DXImageTransform.Microsoft.Matrix(M11=' + m11 + ' M12=' + m12 + ' M21=' + m21 + ' M22=' + m22 + ' sizingMethod="auto expand")';
            return;
        }
        if(rot === 0)
        {
            leftOffset -= label.offsetWidth * 0.5;
            topOffset -= label.offsetHeight;
        }
        else if(rot === 90)
        {
            leftOffset += label.offsetHeight * 0.5;
            topOffset -= label.offsetWidth;
        }
        else if(rot === -90)
        {
            leftOffset -= label.offsetHeight * 0.5;
            topOffset -= 0;
        }
        else if(rot < 0)
        {
            
            leftOffset -= (sinRadians * (label.offsetHeight * 0.6));
            topOffset -= (cosRadians * label.offsetHeight);
        }
        else
        {
            leftOffset -= (cosRadians * label.offsetWidth) - (sinRadians * (label.offsetHeight * 0.6));
            topOffset -= (sinRadians * label.offsetWidth) + (cosRadians * label.offsetHeight);
        }
        topOffset -= margin;
        label.style.left = leftOffset + "px";
        label.style.top =  topOffset + "px";
        label.style.MozTransformOrigin =  "0 0";
        label.style.MozTransform = "rotate(" + rot + "deg)";
        label.style.webkitTransformOrigin = "0 0";
        label.style.webkitTransform = "rotate(" + rot + "deg)";
    },

    /**
     * Calculates the size and positions the content elements.
     */
    setSizeAndPosition: function(labelSize)
    {
        var ar = this.get("axisRenderer"),
            style = ar.get("styles"),
            sz = style.line.weight,
            majorTicks = style.majorTicks,
            display = majorTicks.display,
            tickLen = majorTicks.length;
        if(display === "outside")
        {
            sz += tickLen;
        }
        else if(display === "cross")
        {
            sz += tickLen * 0.5;
        }
        sz += labelSize;
        ar.get("node").style.top = labelSize + "px";
        ar.set("height", sz);
    },
    
    offsetNodeForTick: function(node)
    {
        var ar = this.get("axisRenderer"),
            majorTicks = ar.get("styles").majorTicks,
            tickLength = majorTicks.length,
            display = majorTicks.display;
        if(display === "inside")
        {
            node.style.marginBottom = (0 - tickLength) + "px";
        }
        else if (display === "cross")
        {
            node.style.marginBottom = (0 - (tickLength * 0.5)) + "px";
        }
    }
});

Y.TopAxisLayout = TopAxisLayout;

Y.mix(Y.AxisRenderer.prototype, {
    /**
     * @private
     * @description Strategy for drawing the axis dependent upon the axis position.
     */
    _ui: null,

    /**
     * @private 
     * @description Returns the correct _ui class instance to be used for drawing the
     * axis.
     */
    getLayout: function(pos)
    {
        var l;
        switch(pos)
        {
            case "top" :
                l = new Y.TopAxisLayout({axisRenderer:this});
            break;
            case "bottom" : 
                l = new Y.BottomAxisLayout({axisRenderer:this});
            break;
            case "left" :
                l = new Y.LeftAxisLayout({axisRenderer:this});
            break;
            case "right" :
                l = new Y.RightAxisLayout({axisRenderer:this});
            break;
        }
        return l;
    },
    
    /**
     * @private
     * @description Draws line based on start point, end point and line object.
     */
    drawLine: function(startPoint, endPoint, line)
    {
        var graphic = this.get("graphic");
        graphic.lineStyle(line.weight, line.color, line.alpha);
        graphic.moveTo(startPoint.x, startPoint.y);
        graphic.lineTo(endPoint.x, endPoint.y);
        graphic.end();
    },

    /**
     * @private
     * Basic logic for drawing an axis.
     */
    _drawAxis: function ()
    {
        var style = this.get("styles"),
            majorTickStyles = style.majorTicks,
            drawTicks = majorTickStyles.display != "none",
            tickPoint,
            majorUnit = style.majorUnit,
            axis = this.get("axis"),
            len,
            majorUnitDistance,
            i = 0,
            uiLength,
            position,
            lineStart,
            label,
            ui = this._ui,
            graphic = this.get("graphic");
        graphic.clear();
		ui.setTickOffsets();
        uiLength = this.getLength();
        lineStart = ui.getLineStart();
        len = axis.getTotalMajorUnits(majorUnit, uiLength);
        majorUnitDistance = axis.getMajorUnitDistance(len, uiLength, majorUnit);
        this.set("edgeOffset", axis.getEdgeOffset(len, uiLength) * 0.5);
        tickPoint = this.getFirstPoint(lineStart);
        this.drawLine(lineStart, this.getLineEnd(tickPoint), this.get("styles").line);
        if(drawTicks) 
        {
           ui.drawTick(tickPoint, majorTickStyles);
        }
        if(len < 1) 
        {
            return;
        }
        this._createLabelCache();
        ui.set("maxLabelSize", 0);
        for(; i < len; ++i)
	    {
            if(drawTicks) 
            {
                ui.drawTick(tickPoint, majorTickStyles);
            }
            position = this.getPosition(tickPoint);
            label = this.getLabel(tickPoint, axis.getLabelAtPosition(position, uiLength));
            ui.positionLabel(label, ui.getLabelPoint(tickPoint));
            tickPoint = this.getNextPoint(tickPoint, majorUnitDistance);
        }
        ui.setSizeAndPosition();
        this._clearLabelCache();
        if(this.get("overlapGraph"))
        {
            ui.offsetNodeForTick(this.get("node"));
        }
        this.fire("axisRendered");
    },

    /**
     * @private
     * @description Collection of labels used in creating an axis.
     */
    _labels: null,

    /**
     * @private 
     * @description Collection of labels to be reused in creating an axis.
     */
    _labelCache: null,

    /**
     * @private
     * @description Draws and positions a label based on its style properties.
     */
    getLabel: function(pt, txt, pos)
    {
        var label,
            cache = this._labelCache;
        if(cache.length > 0)
        {
            label = cache.shift();
        }
        else
        {
            label = document.createElement("span");
        }
        label.innerHTML = txt;
        label.style.display = "block";
        label.style.position = "absolute";
        this.get("node").appendChild(label);
        this._labels.push(label);
        return label;
    },   
    
    /**
     * @private
     * Creates a cache of labels for reuse.
     */
    _createLabelCache: function()
    {
        if(this._labels)
        {
            this._labelCache = this._labels.concat();
        }
        else
        {
            this._labelCache = [];
        }
        this._labels = [];
    },
    
    /**
     * @private
     * Removes unused labels from the label cache
     */
    _clearLabelCache: function()
    {
        var len = this._labelCache.length,
            i = 0,
            label,
            labelCache;
        for(; i < len; ++i)
        {
            label = labelCache[i];
            label.parentNode.removeChild(label);
        }
        this._labelCache = [];
    },

    /**
     * @private
     * Indicates how to include tick length in the size calculation of an
     * axis. If set to true, the length of the tick is used to calculate
     * this size. If false, the offset of tick will be used.
     */
    _calculateSizeByTickLength: true,

    /**
     * Indicate the end point of the axis line
     */
    getLineEnd: function(pt)
    {
        var w = this.get("node").offsetWidth,
            h = this.get("node").offsetHeight,
            pos = this.get("position");
        if(pos === "top" || pos === "bottom")
        {
            return {x:w, y:pt.y};
        }
        else
        {
            return {x:pt.x, y:h};
        }
    },

    /**
     * Returns the distance between the first and last data points.
     */
    getLength: function()
    {
        var l,
            style = this.get("styles"),
            padding = style.padding,
            w = this.get("node").offsetWidth,
            h = this.get("node").offsetHeight,
            pos = this.get("position");
        if(pos === "top" || pos === "bottom")
        {
            l = w - (padding.left + padding.right);
        }
        else
        {
            l = h - (padding.top + padding.bottom);
        }
        return l;
    },

    /**
     * Calculates the coordinates for the first point on an axis.
     */
    getFirstPoint:function(pt)
    {
        var style = this.get("styles"),
            pos = this.get("position"),
            padding = style.padding,
            np = {x:pt.x, y:pt.y};
        if(pos === "top" || pos === "bottom")
        {
            np.x += padding.left + this.get("edgeOffset");
        }
        else
        {
            np.y += padding.top + this.get("edgeOffset");
        }
        return np;
    },

    /**
     * Returns the next majorUnit point.
     */
    getNextPoint: function(point, majorUnitDistance)
    {
        var pos = this.get("position");
        if(pos === "top" || pos === "bottom")
        {
            point.x = point.x + majorUnitDistance;		
        }
        else
        {
            point.y = point.y + majorUnitDistance;
        }
        return point;
    },

    /**
     * Calculates the coordinates for the last point on an axis.
     */
    getLastPoint: function()
    {
        var style = this.get("styles"),
            padding = style.padding,
            w = this.get("node").offsetWidth,
            pos = this.get("position");
        if(pos === "top" || pos === "bottom")
        {
            return {x:w - padding.right, y:padding.top};
        }
        else
        {
            return {x:padding.left, y:padding.top};
        }
    },

    /**
     * Calculates the position of a point on the axis.
     */
    getPosition: function(point)
    {
        var p,
            h = this.get("node").offsetHeight,
            style = this.get("styles"),
            padding = style.padding,
            pos = this.get("position"),
            dataType = this.get("axis").get("dataType");
        if(pos === "left" || pos === "right") 
        {
            //Numeric data on a vertical axis is displayed from bottom to top.
            //Categorical and Timeline data is displayed from top to bottom.
            if(dataType === "numeric")
            {
                p = (h - (padding.top + padding.bottom)) - (point.y - padding.top);
            }
            else
            {
                p = point.y - padding.top;
            }
        }
        else
        {
            p = point.x - padding.left;
        }
        return p;
    }
});


/**
 * A basic chart application.
 */
function CartesianChart(config)
{
    CartesianChart.superclass.constructor.apply(this, arguments);
}

CartesianChart.NAME = "cartesianChart";

CartesianChart.ATTRS = {
    /**
     * Data used to generate the chart.
     */
    dataProvider: {
        getter: function()
        {
            return this._dataProvider;
        },

        setter: function(val)
        {
            this._setDataValues(val);
        }
    },

    /**
     * Axes to appear in the chart. 
     */
    axes: {
        getter: function()
        {
            return this._axes;
        },

        setter: function(val)
        {
            this._parseAxes(val);
        }
    },

    /**
     * Collection of series to appear on the chart.
     */
    seriesCollection: {
        getter: function()
        {
            return this._getSeriesCollection();
        },

        setter: function(val)
        {
            return this._setSeriesCollection(val);
        }
    },

    /**
     * Element that contains left axes
     */
    leftAxesContainer: {
        value: null
    },

    /**
     * Element that contains bottom axes
     */
    bottomAxesContainer: {
        value: null
    },

    /**
     * Element that contains right axes
     */
    rightAxesContainer: {
        value: null
    },

    /**
     * Element that contains top axes
     */
    topAxesContainer: {
        value: null
    },

    /**
     * Element that contains graphs
     */
    graphContainer: {
        value: null
    },

    /**
     * Reference to graph stack instance
     */
    graph: {
        value: null
    },

    /**
     * Type of chart when there is no series collection specified.
     */
    type: {
        getter: function()
        {
            if(this.get("stacked"))
            {
                return "stacked" + this._type;
            }
            return this._type;
        },

        setter: function(val)
        {
            this._setChartType(val);
        }
    },
    
    stacked: {
        value: false
    },

    /**
     * Direction of chart when there is no series collection specified.
     */
    direction: {
        getter: function()
        {
            var type = this.get("type");
            if(type == "bar")
            {   
                return "vertical";
            }
            else if(type == "column")
            {
                return "horizontal";
            }
            return this._direction;
        },

        setter: function(val)
        {
            this._direction = val;
        }
    },

    /**
     * Indicates whether or not to show a tooltip.
     */
    showTooltip: {
        value:true
    },

    categoryKey: {
        value: "category"
    },

    seriesKeys: {
        value: null    
    },

    showAreaFill: {
        value: null
    }
};

Y.extend(CartesianChart, Y.Widget, {
    /**
     * Returns a series instance by index
     */
    getSeriesByIndex: function(val)
    {
        var series, 
            graph = this.get("graph");
        if(graph)
        {
            series = graph.getSeriesByIndex(val);
        }
        return series;
    },

    /**
     * Returns a series instance by key value.
     */
    getSeriesByKey: function(val)
    {
        var series, 
            graph = this.get("graph");
        if(graph)
        {
            series = graph.getSeriesByKey(val);
        }
        return series;
    },

    /**
     * Returns axis by key reference
     */
    getAxisByKey: function(val)
    {
        var axis,
            axes = this.get("axes");
        if(axes.hasOwnProperty(val))
        {
            axis = axes[val];
        }
        return axis;
    },

    /**
     * Returns the category axis for the chart.
     */
    getCategoryAxis: function()
    {
        var axis,
            key = this.get("categoryKey"),
            axes = this.get("axes");
        if(axes.hasOwnProperty(key))
        {
            axis = axes[key];
        }
        return axis;
    },

    /**
     * @private
     */
    _type: "combo",

    /**
     * @private
     */
    _direction: "horizontal",
    
    /**
     * @private
     */
    _dataProvider: null,

    /**
     * @private
     */
    _setDataValues: function(val)
    {
        if(Y.Lang.isArray(val[0]))
        {
            var hash, 
                dp = [], 
                cats = val[0], 
                i = 0, 
                l = cats.length, 
                n, 
                sl = val.length;
            for(; i < l; ++i)
            {
                hash = {category:cats[i]};
                for(n = 1; n < sl; ++n)
                {
                    hash["series" + n] = val[n][i];
                }
                dp[i] = hash; 
            }
            this._dataProvider = dp;
            return;
        }
        this._dataProvider = val;
    },

    /**
     * @private 
     */
    _seriesCollection: null,

    /**
     * @private
     */
    _setSeriesCollection: function(val)
    {
        this._seriesCollection = val;
    },

    /**
     * @private
     */
    _getSeriesCollection: function()
    {
        if(this._seriesCollection)
        {
            return this._seriesCollection;
        }
        var axes = this.get("axes"),
            dir = this.get("direction"), 
            sc = [], 
            catAxis,
            valAxis,
            seriesKeys,
            i = 0,
            l,
            type = this.get("type"),
            key,
            catKey,
            seriesKey,
            showAreaFill = this.get("showAreaFill");
        if(dir == "vertical")
        {
            catAxis = "yAxis";
            catKey = "yKey";
            valAxis = "xAxis";
            seriesKey = "xKey";
        }
        else
        {
            catAxis = "xAxis";
            catKey = "xKey";
            valAxis = "yAxis";
            seriesKey = "yKey";
        }
        if(axes)
        {
            seriesKeys = axes.values.get("axis").get("keyCollection");
            key = axes.category.get("axis").get("keyCollection")[0];
            l = seriesKeys.length;
            for(; i < l; ++i)
            {
                sc[i] = {type:type};
                sc[i][catAxis] = "category";
                sc[i][valAxis] = "values";
                sc[i][catKey] = key;
                sc[i][seriesKey] = seriesKeys[i];
                if((type == "combo" || type == "stackedcombo" || type == "combospline" || type == "stackedcombospline") && showAreaFill !== null)
                {
                    sc[i].showAreaFill = showAreaFill;
                }
            }
        }
        this._seriesCollection = sc;
        return sc;
    },

    /**
     * @private
     */
    _getDataClass: function(t)
    {
        return this._dataClass[t];
    },

    /**
     * @private
     */
    _dataClass: {
        stacked: Y.StackedAxis,
        numeric: Y.NumericAxis,
        category: Y.CategoryAxis,
        time: Y.TimeAxis
    },

    /**
     * @private
     */
    _parseAxes: function(hash)
    {
        if(!this._axes)
        {
            this._axes = {};
        }
        if(!this._dataAxes)
        {
            this._dataAxes = {};
        }
        var i, pos, axis, dataAxis, dh, config, dataClass;

        for(i in hash)
        {
            if(hash.hasOwnProperty(i))
            {
                dh = hash[i];
                pos = dh.position;
                dataClass = this._getDataClass(dh.type);
                config = {dataProvider:this.get("dataProvider"), keys:dh.keys};
                if(dh.hasOwnProperty("roundingUnit"))
                {
                    config.roundingUnit = dh.roundingUnit;
                }
                dataAxis = new dataClass(config);
                if(pos && pos != "none")
                {
                    axis = new Y.AxisRenderer({axis:dataAxis, position:dh.position, styles:dh.styles});
                    this._axes[i] = axis;
                }
                this._dataAxes[i] = dataAxis;
            }
        }
    },

    /**
     * @private
     */
    _dataAxes: null,

    /**
     * @private
     */
    _axes: null,

    /**
     * @private
     */
    renderUI: function()
    {
        this._createLayout();
    },
    
    /**
     * @private
     */
    bindUI: function()
    {
        this.after("showTooltipChange", Y.bind(this._showTooltipChangeHandler, this));
    },
   
    /**
     * @private
     */
    syncUI: function()
    {
        this._addAxes();
        this._addSeries();
        if(!this.tooltip && this.get("showTooltip"))
        {
            this._addTooltip();
        }
    },
    
    /**
     * @private
     */
    _setChartType: function(val)
    {
        if(val == this._type)
        {
            return;
        }
        if(this._type == "bar")
        {
            if(val != "bar")
            {
                this.set("direction", "horizontal");
            }
        }
        else
        {
            if(val == "bar")
            {
                this.set("direction", "vertical");
            }
        }
        this._type = val;
    },
    
    /**
     * @private
     */
    _addAxes: function()
    {
        var axes = this.get("axes"),
            containers = {
                left:this.get("leftAxesContainer"),
                bottom:this.get("bottomAxesContainer"),
                right:this.get("rightAxesContainer"),
                top:this.get("topAxesContainer")
            }, i, axis, p;
        if(!axes)
        {
            this.set("axes", this._getDefaultAxes());
            axes = this.get("axes");
        }
        for(i in axes)
        {
            if(axes.hasOwnProperty(i))
            {
                axis = axes[i];
                p = axis.get("position");
                axis.render(containers[p]);
            }
        }
    },

    /**
     * @private
     */
    _addSeries: function()
    {
        var seriesCollection = this.get("seriesCollection");
        this._parseSeriesAxes(seriesCollection);
        this.set("graph", new Y.Graph({parent:this.get("graphContainer")}));
        this.get("graph").on("chartRendered", Y.bind(function(e) {
            this.fire("chartRendered");
        }, this));
        this.get("graph").set("seriesCollection", seriesCollection);
        this._seriesCollection = this.get("graph").get("seriesCollection");
    },

    /**
     * @private
     */
    _parseSeriesAxes: function(c)
    {
        var i = 0, 
            len = c.length, 
            s;
        for(; i < len; ++i)
        {
            s = c[i];
            s.xAxis = this._dataAxes[s.xAxis];
            s.yAxis = this._dataAxes[s.yAxis];
        }
    },

    /**
     * @private
     * @description Creates the layout container for the chart.
     */
    _createLayout: function()
    {
        var cb = this.get("contentBox"),
            tbl = document.createElement("table"),
            tr = document.createElement("tr"),
            mr = document.createElement("tr"),
            br = document.createElement("tr"),
            tlc = document.createElement("td"),
            tcc = document.createElement("td"),
            trc = document.createElement("td"),
            mlc = document.createElement("td"),
            mcc = document.createElement("td"),
            mrc = document.createElement("td"),
            blc = document.createElement("td"),
            bcc = document.createElement("td"),
            brc = document.createElement("td"),
            la = document.createElement("div"),
            ba = document.createElement("div"),
            ra = document.createElement("div"),
            ta = document.createElement("div"),
            gc = document.createElement("div"),
            tblstyles = "vertical-align:top;border:0px;margin:0px;padding:0px;border-spacing:0px";
        tbl.setAttribute("style", tblstyles);
        tr.setAttribute("style", tblstyles);
        mr.setAttribute("style", tblstyles);
        br.setAttribute("style", tblstyles);
        tlc.setAttribute("style", tblstyles);
        tcc.setAttribute("style", tblstyles);
        trc.setAttribute("style", tblstyles);
        mlc.setAttribute("style", tblstyles);
        mcc.setAttribute("style", tblstyles);
        mrc.setAttribute("style", tblstyles);
        blc.setAttribute("style", tblstyles);
        bcc.setAttribute("style", tblstyles);
        brc.setAttribute("style", tblstyles);

        tr.id = "topRow";
        mr.id = "midRow";
        br.id = "bottomRow";
        cb.appendChild(tbl);
        tbl.appendChild(tr);
        tr.appendChild(tlc);
        tr.appendChild(tcc);
        tr.appendChild(trc);
        tbl.appendChild(mr);
        mr.appendChild(mlc);
        mr.appendChild(mcc);
        mr.appendChild(mrc);
        tbl.appendChild(br);
        br.appendChild(blc);
        br.appendChild(bcc);
        br.appendChild(brc);
        
        ta.setAttribute("style", "position:relative;width:800px;");
        ta.setAttribute("id", "topAxesContainer");
        la.setAttribute("style", "position:relative;height:300px;");
        la.setAttribute("id", "leftAxesContainer");
        ba.setAttribute("style", "position:relative;width:800px;");
        ba.setAttribute("id", "bottomAxesContainer");
        ra.setAttribute("style", "position:relative;height:300px;");
        ra.setAttribute("id", "rightAxesContainer");
        gc.setAttribute("style", "position:relative;width:100%;height:100%;");
        tcc.appendChild(ta);
        mlc.appendChild(la);
        bcc.appendChild(ba);
        mrc.appendChild(ra);
        mcc.appendChild(gc);

        this.set("leftAxesContainer", la);
        this.set("bottomAxesContainer", ba);
        this.set("rightAxesContainer", ra);
        this.set("topAxesContainer", ta);
        this.set("graphContainer", gc);
    },

    /**
     * @private
     */
    _getDefaultAxes: function()
    {
        var catKey = this.get("categoryKey"),
            seriesKeys = this.get("seriesKeys") || [], 
            i, 
            dv = this.get("dataProvider")[0],
            direction = this.get("direction"),
            seriesPosition,
            categoryPosition,
            seriesAxis = this.get("stacked") ? "stacked" : "numeric";
        if(direction == "vertical")
        {
            seriesPosition = "bottom";
            categoryPosition = "left";
        }
        else
        {
            seriesPosition = "left";
            categoryPosition = "bottom";
        }
        if(seriesKeys.length < 1)
        {
            for(i in dv)
            {
                if(i != catKey)
                {
                    seriesKeys.push(i);
                }
            }
            if(seriesKeys.length > 0)
            {
                this.set("seriesKeys", seriesKeys);
            }
        }
        return {
            values:{
                keys:seriesKeys,
                position:seriesPosition,
                type:seriesAxis
            },
            category:{
                keys:[catKey],
                position:categoryPosition,
                type:"category"
            }
        };
    },

    /**
     * Reference to the tooltip
     */
    tooltip: null,

    /**
     * @private
     */
    _addTooltip: function(e)
    {
        if(!Y.Tooltip)
        {
            return;
        }
        var tt = new Y.Tooltip({
            triggerNodes:".yui3-seriesmarker",
            delegate: "#" + this._parentNode.get("id"),
            shim:false,
            zIndex:2
        });
        
        tt.render();
        
        tt.on("triggerEnter", function(e) {
            var node = e.node,
            marker = Y.Widget.getByNode(node),
            index = marker.get("index"),
            series = marker.get("series"),
            xAxis = series.get("xAxis"),
            yAxis = series.get("yAxis"),
            xKey = series.get("xKey"),
            yKey = series.get("yKey"),
            msg = series.get("xDisplayName") + 
            ": " + xAxis.get("labelFunction")(xAxis.getKeyValueAt(xKey, index)) + 
            "<br/>" + series.get("yDisplayName") + 
            ": " + yAxis.get("labelFunction")(yAxis.getKeyValueAt(yKey, index));
            if (node) {
                this.setTriggerContent(msg);
            }
        });
        this.tooltip = tt;
    },

    /**
     * @private
     */
    _showTooltipChangeHandler: function(e)
    {
        if(this.get("showTooltip") && this.get("rendered"))
        {
            this._addTooltip();
        }
    }
});

Y.CartesianChart = CartesianChart;
function Chart(cfg)
{
    if(cfg.type != "pie")
    {
        return new Y.CartesianChart(cfg);
    }
}
Y.Chart = Chart;


}, '@VERSION@' ,{requires:['dom', 'datatype', 'event-custom', 'event-mouseenter', 'widget', 'widget-position', 'widget-stack', 'tooltip', 'graphics']});
