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
            value = Y.merge(value);
			this._dataProvider = {data:value.data.concat()};
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
		getter: function ()
		{
			return this._keys;
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
		if(this._keys.hasOwnProperty(value)) 
		{
			return;
		}
		this._dataClone = this._dataProvider.data.concat();
		var keys = this._keys,
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
		this._keys[key] = arr;
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
		if(!this._keys.hasOwnProperty(value)) 
		{
			return;
		}
		var key,
			oldKey,
			newKeys = {},
			newData = [],
			removedKeys = {},
			keys = this._keys,
			event = {};
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
			keys = this.keys;
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
		var keys = this._keys;
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
			keys = this._keys,
			event = {}; 
		this._data = [];
		this._dataClone = this._dataProvider.data.concat();
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
			keys = this._keys,
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
        
        return Math.min(units, this._data.length);
    },

    getLabelAtPosition:function(pos, len, format)
    {
        var min = this.get("minimum"),
            max = this.get("maximum"),
            val = (pos/len * (max - min)) + min;
        return this.getFormattedLabel(val, format);
    },

    getFormattedLabel: function(val, format)
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
			str = "";
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
					str += "\n" + num;
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
    
    getFormattedLabel: function(val, format)
    {
        return Y.DataType.Number.format(val, format);
    }
});

Y.NumericAxis = NumericAxis;
		
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
		this._keys[key] = arr;
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
    
    getFormattedLabel: function(val, format)
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
		
function Renderer(config)
{
}

Renderer.NAME = "renderer";

Renderer.ATTRS = {
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

Renderer.prototype = {
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
		Y.Object.each(a, function(value, key, a)
		{
			if(b.hasOwnProperty(key) && Y.Lang.isObject(value))
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
    }
};

Y.Renderer = Renderer;
Y.CartesianSeries = Y.Base.create("cartesianSeries", Y.Widget, [Y.Renderer], {
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
    renderUI: function()
    {
        this._setCanvas();
    },
    
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
        this._parentNode.after("widthChange", Y.bind(this._resizeHandler, this));
        this._parentNode.after("heightChange", Y.bind(this._resizeHandler, this));
    },
   
    /**
     * @private
     */
    _resizeHandler: function(e)
    {
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

	/**
	 * Constant used to generate unique id.
	 */
	GUID: "yuicartesianseries",
	
    /**
     * @private
     * Creates a <code>Graphic</code> instance.
     */
    _setCanvas: function()
    {
        var cb = this.get("contentBox"),
            n = document.createElement("div"),
            style = n.style;
        cb.appendChild(n);
        style.position = "absolute";
        style.display = "block";
        style.top = "0px"; 
        style.left = "0px";
        style.width = "800px";
        style.height = "300px";
        this.set("node", n);
        this.set("graphic", new Y.Graphic());
        this.get("graphic").render(this.get("node"));
   },
	
	/**
	 * @private (protected)
	 * Handles updating the graph when the x < code>Axis</code> values
	 * change.
	 */
	_xAxisChangeHandler: function(event)
	{
        if(this.get("rendered") && this.get("xKey") && this.get("yKey"))
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
        if(this.get("rendered") && this.get("xKey") && this.get("yKey"))
		{
			this.draw();
		}
	},

	/**
	 * @private
	 */
	setAreaData: function()
	{
        var nextX, nextY,
            node = this.get("node"),
			w = node.offsetWidth,
            h = node.offsetHeight,
            padding = this.get("styles").padding,
			leftPadding = padding.left,
			topPadding = padding.top,
			dataWidth = w - (leftPadding + padding.right),
			dataHeight = h - (topPadding + padding.bottom),
			xcoords = [],
			ycoords = [],
            xAxis = this.get("xAxis"),
            yAxis = this.get("yAxis"),
			xMax = xAxis.get("maximum"),
			xMin = xAxis.get("minimum"),
			yMax = yAxis.get("maximum"),
			yMin = yAxis.get("minimum"),
			xKey = this.get("xKey"),
			yKey = this.get("yKey"),
			xScaleFactor = dataWidth / (xMax - xMin),
			yScaleFactor = dataHeight / (yMax - yMin),
			xData = xAxis.getDataByKey(xKey),
			yData = yAxis.getDataByKey(yKey),
			dataLength = xData.length, 	
            i;
        this._leftOrigin = Math.round(((0 - xMin) * xScaleFactor) + leftPadding);
        this._bottomOrigin =  Math.round((dataHeight + topPadding) - (0 - yMin) * yScaleFactor);
        for (i = 0; i < dataLength; ++i) 
		{
            nextX = Math.round((((xData[i] - xMin) * xScaleFactor) + leftPadding));
			nextY = Math.round(((dataHeight + topPadding) - (yData[i] - yMin) * yScaleFactor));
            xcoords.push(nextX);
            ycoords.push(nextY);
        }
        this.set("xcoords", xcoords);
		this.set("ycoords", ycoords);
    },

	/**
	 * @private
	 */
	drawGraph: function()
	{
        this.drawMarkers();
	},
	
	/**
	 * @private (override)
	 */
	draw: function()
    {
        var node = this.get("node"),
			w = node.offsetWidth,
            h = node.offsetHeight;
        if  (!isNaN(w) && !isNaN(h) && w > 0 && h > 0)
		{
            this.setAreaData();
            this.drawGraph();
		}
	},

	drawMarkers: function()
	{
	    if(!this.get("xcoords") || this.get("xcoords").length < 1) 
		{
			return;
		}
        var graphic = this.get("graphic"),
            style = this.get("styles").marker,
            w = style.width,
            h = style.height,
            fillColor = style.fillColor,
            alpha = style.fillAlpha,
            fillType = style.fillType || "solid",
            borderWidth = style.borderWidth,
            borderColor = style.borderColor,
            borderAlpha = style.borderAlpha || 1,
            colors = style.colors,
            alphas = style.alpha || [],
            ratios = style.ratios || [],
            rotation = style.rotation || 0,
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            shapeMethod = style.func || "drawCircle",
            i = 0,
            len = xcoords.length,
            top = ycoords[0],
            left;
        for(; i < len; ++i)
        {
            top = ycoords[i];
            left = xcoords[i];
            if(borderWidth > 0)
            {
                graphic.lineStyle(borderWidth, borderColor, borderAlpha);
            }
            if(fillType === "solid")
            {
                graphic.beginFill(fillColor, alpha);
            }
            else
            {
                graphic.beginGradientFill(fillType, colors, alphas, ratios, {rotation:rotation, width:w, height:h});
            }
            this.drawMarker(graphic, shapeMethod, left, top, w, h);
            graphic.endFill();
        }
 	},

    drawMarker: function(graphic, func, left, top, w, h)
    {
        if(func === "drawCircle")
        {
            graphic.drawCircle(left, top, w/2);
        }
        else
        {
            left -= w/2;
            top -= h/2;
            graphic[func].call(graphic, left, top, w, h);
        }
    },

    _getDefaultStyles: function()
    {
        return {padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }};
    }
}, {
ATTRS: {

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

    node: {
        value: null
    },
    
    /**
	 * The graphic in which the series will be rendered.
	 */
	graphic: {
        value: null
    }
}
});

function LineSeries(config)
{
	LineSeries.superclass.constructor.apply(this, arguments);
}

LineSeries.NAME = "lineSeries";

LineSeries.ATTRS = {
	type: {
		/**
		 * Indicates the type of graph.
		 */
        value:"line"
    }
};

Y.extend(LineSeries, Y.CartesianSeries, {
	
	/**
	 * @private
	 */
	drawGraph: function()
	{
		var styles = this.get("styles");
		if(styles.showLines) 
		{
			this.drawLines();
		}
		if(styles.showMarkers) 
		{
			this.drawMarkers();
		}
	},

	/**
	 * @protected
	 */
	drawLines: function()
	{
        if(this.get("xcoords").length < 1) 
		{
			return;
		}
        var	node = this.get("node"),
            ht = node.offsetHeight,
            xcoords = this.get("xcoords"),
			ycoords = this.get("ycoords"),
			len = xcoords.length,
			lastX = xcoords[0],
			lastY = ycoords[0],
			lastValidX = lastX,
			lastValidY = lastY,
			nextX,
			nextY,
			i,
			styles = this.get("styles"),
			lineType = styles.lineType,
			dashLength = styles.dashLength,
			gapSpace = styles.gapSpace,
			connectDiscontinuousPoints = styles.connectDiscontinuousPoints,
			discontinuousType = styles.discontinuousType,
			discontinuousDashLength = styles.discontinuousDashLength,
			discontinuousGapSpace = styles.discontinuousGapSpace,
			graphic = this.get("graphic");
        graphic.clear();
        graphic.lineStyle(styles.weight, styles.color);
        graphic.beginFill(styles.color, 0.5);
        graphic.moveTo (lastX, lastY);
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
       // graphic.lineStyle(0);
        graphic.lineTo(lastX, ht);
        graphic.lineTo(0, ht);
        graphic.lineTo(0, ycoords[0]);
        graphic.endFill();
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

	_getDefaultStyles: function()
    {
        return {
            color: "#000000",
            alpha: 1,
            weight: 1,
            marker: {
                fillColor: "#000000",
                alpha: 1,
                weight: 1,
                width: 6,
                height: 6
            },
            showMarkers: false,
            showLines: true,
            lineType:"solid", 
            dashLength:10, 
            gapSpace:10, 
            connectDiscontinuousPoint:true, 
            discontinuousType:"dashed", 
            discontinuousDashLength:10, 
            discontinuousGapSpace:10,
            padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }
        };
    }
});

Y.LineSeries = LineSeries;


		

		
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

	drawMarkers: function()
	{
	    if(this.get("xcoords").length < 1) 
		{
			return;
		}
        var graphic = this.get("graphic"),
            style = this.get("styles").marker,
            w = style.width,
            h = style.height,
            fillColor = style.fillColor,
            alpha = style.fillAlpha,
            fillType = style.fillType || "solid",
            borderWidth = style.borderWidth,
            borderColor = style.borderColor,
            borderAlpha = style.borderAlpha || 1,
            colors = style.colors,
            alphas = style.alpha || [],
            ratios = style.ratios || [],
            rotation = style.rotation || 0,
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            shapeMethod = style.func || "drawCircle",
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
            left;
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
        if(totalWidth > this.get("node").offsetWidth)
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
            left = xcoords[i] + offset;
            if(borderWidth > 0)
            {
                graphic.lineStyle(borderWidth, borderColor, borderAlpha);
            }
            if(fillType === "solid")
            {
                graphic.beginFill(fillColor, alpha);
            }
            else
            {
                graphic.beginGradientFill(fillType, colors, alphas, ratios, {rotation:rotation, width:w, height:h});
            }
            this.drawMarker(graphic, shapeMethod, left, top, w, h);
            graphic.endFill();
        }
 	},

    drawMarker: function(graphic, func, left, top, w, h)
    {
        h = this._bottomOrigin - top;
        graphic.drawRect(left, top, w, h);
    },
	
	_getDefaultStyles: function()
    {
        return {
            marker: {
                fillColor: "#000000",
                fillAlpha: 1,
                borderColor:"#ff0000",
                borderWidth:0,
                borderAlpha:1,
                colors:[],
                alpha:[],
                ratios:[],
                rotation:0,
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

Y.ColumnSeries = ColumnSeries;
function GraphStack(config)
{
    GraphStack.superclass.constructor.apply(this, arguments);
}

GraphStack.NAME = "graphstack";

GraphStack.ATTRS = {
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
        getter: function()
        {
            return this._parent;
        },

        setter: function(val)
        {
            this._parent = val;
            return val;
        }
    }
};

Y.extend(GraphStack, Y.Base, {
	/**
	 * Constant used to generate unique id.
	 */
	GUID: "yuigraphstack",
    
    _parent: null,

    _seriesCollection: null,

    seriesTypes: null,

    _parseSeriesCollection: function(val)
    {
        var len = val.length,
            i = 0,
            series;
        if(!val)
        {
            return;
        }	
        if(!this._seriesCollection)
        {
            this._seriesCollection = [];
        }
        if(!this.seriesTypes)
        {
            this.seriesTypes = [];
        }
        for(; i < len; ++i)
        {	
            series = val[i];
            if(Y.Lang.isObject(series))
            {
                this._createSeries(series);
                continue;
            }
            this.addSeries(series);
        }
        len = this._seriesCollection.length;
        for(i = 0; i < len; ++i)
        {
            this._seriesCollection[i].render(this.get("parent"));
        }
    },

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
        series.graphOrder = graphSeriesLength;
        seriesCollection.push(series);
        if(!seriesTypes.hasOwnProperty(type))
        {
            this.seriesTypes[type] = [];
        }
        typeSeriesCollection = this.seriesTypes[type];
        series.set("order", typeSeriesCollection.length);
        typeSeriesCollection.push(series);
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
            seriesData.parent = this.get("parent");
        if(!seriesTypes.hasOwnProperty(type))
        {
            seriesTypes[type] = [];
        }
        typeSeriesCollection = seriesTypes[type];
        seriesData.graph = this;
        seriesData.order = typeSeriesCollection.length;
        seriesType = this._getSeries(seriesData.type);
        series = new seriesType(seriesData);
        typeSeriesCollection.push(series);
        seriesCollection.push(series);
    },

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
            default:
                seriesClass = Y.CartesianSeries;
            break;
        }
        return seriesClass;
    }

});

Y.GraphStack = GraphStack;
/**
 * Renders an axis.
 */
Y.AxisRenderer = Y.Base.create("axisrenderer", Y.Widget, [Y.Renderer], {
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
                count:5,
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
            hideOverlappingLabelTicks: false
        };
    }

}, {
    NAME: "axisRenderer",

    ATTRS:
    {
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
    }
});
        
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
        graphic.endFill();
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
        tickPoint = this.getFirstPoint(lineStart);
        this.drawLine(lineStart, this.getLineEnd(tickPoint), this.get("styles").line);
        if(drawTicks) 
        {
           ui.drawTick(tickPoint, majorTickStyles);
        }
        len = axis.getTotalMajorUnits(majorUnit, uiLength);
        if(len < 1) 
        {
            return;
        }
        majorUnitDistance = uiLength/(len - 1);
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
            np.x += padding.left;
        }
        else
        {
            np.y += padding.top;
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
            pos = this.get("position");
        if(pos === "left" || pos === "right")
        {
            p = (h - (padding.top + padding.bottom)) - (point.y - padding.top);
        }
        else
        {
            p = point.x - padding.left;
        }
        return p;
    }
});




}, '@VERSION@' );
