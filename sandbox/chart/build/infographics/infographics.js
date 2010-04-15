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
			this._dataProvider = value;
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
			if(this._autoMax) 
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
			if(this._autoMin) 
			{
				return this._dataMinimum;
			}
			return this._setMinimum;
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
	_data: [],
	/**
	 * @private
	 * Storage for keys
	 */
	_keys: {},

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
			keys = this._keys;
		for(var i in keys)
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
	}
});

Y.NumericAxis = NumericAxis;
		
function TimeAxis(config)
{
	TimeAxis.superclass.constructor.apply(this, arguments);
}

TimeAxis.NAME = "timeAxis";

Y.extend(TimeAxis, Y.BaseAxis, {
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
		
function Renderer(config)
{
	Renderer.superclass.constructor.apply(this, arguments);
}

Renderer.NAME = "renderer";

Renderer.ATTRS = {
	width: {
		getter: function()
		{
			return this._width;
		},
		setter: function(value)
		{
			this._width = value;
			return value;
		}
	},
	height: {
		getter: function()
		{
			return this._height;
		},
		setter: function(value)
		{
			this._height = value;
			return value;
		}
	},
	rendering: {
		getter: function()
		{
			return this._rendering;
		},
		setter: function(value)
		{
			this._rendering = value;
			return value;
		}
	},

	previousWidth: {
		getter: function()
		{
			return this._previousWidth;
		},
		validator: function(value)
		{
			return Y.Lang.isNumber(value) && (this._previousWidth !== value);
		},
		setter: function(value)
		{
			this._previousWidth = value;
			return value;
		}
	},

	previousHeight: {
		getter: function()
		{
			return this._previousHeight;
		},
		validator: function(value)
		{
			return Y.Lang.isNumber(value) && (this._previousHeight !== value);
		},
		setter: function(value)
		{
			this._previousHeight = value;
			return value;
		}
	},

	/**
	 * Hash of style properties for class
	 */
	styles:
	{
		value: {},

		lazyAdd: false,

		getter: function()
		{
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

Y.extend(Renderer, Y.Base, {
	_width: 0,

	_height: 0,

	_styles: null,
	/**
	 * @private
	 * Indicates whether or not the class is in the process or rendering.
	 */
	_rendering: false,
	
	/**
	 * @private
	 * Previous width of the object.
	 */
	_previousWidth: 0,
	
	/**
	 * @private
	 * Previous height of the object.
	 */
	_previousHeight: 0,
	
	/**
	 * Indicates whether or not any changes have occurred that would
	 * require a rendering.
	 */
	_hasFlag: false,
	
	/**
	 * @private
	 * Indicates whether a flag has been created for a later rendering.
	 */
	_hasLaterFlag: false,
	
	/**
	 * @private
	 * Hash of values that indicates which properties need to be updated.
	 */
	_renderFlags: {},
	
	/**
	 * @private
	 * Hash of values that indicates which properties need to be updated
	 * on the following render cycle.
	 */
	_laterFlags: {},
	
	/**
	 * @private
	 *
	 * Hash of child references with style objects.
	 */
	_styleObjHash: null,

	/**
	 * Sets multiple style properties on the instance.
	 *
	 * @method _setStyles
	 * @param {Object} styles Hash of styles to be applied.
	 */
	_setStyles: function(newstyles)
	{
		var styles = this.get("styles") || {};
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
		Y.Object.each(a, function(value, key, a)
		{
			if(b.hasOwnProperty(key) && Y.Lang.isObject(value))
			{
				b[key] = this._mergeStyles(value, b[key]);
			}
			else
			{
				b[key] = value;
			}
		}, this);
		return b;
	},
	/**
	 * @private
	 * Event handler for rendering. 
	 */
	callRender: function()
	{
		if(!this.get("rendering"))
		{
			this.set("rendering", true);
			this.render();
			this.clearFlags();
			this._updateRenderStatus();
		}
	},

	/**
	 * @private 
	 */
	_updateRenderStatus: function()
	{
		this.set("rendering", false);
		this._dispatchRenderEvents();
	},
	
	/**
	 * @private (protected)
	 * All the events that need to be dispatched after <code>render</code> has completed.
	 */
	_dispatchRenderEvents: function()
	{
		var event = {type:"renderComplete"};
		event.changeFlags = this._renderFlags;
		this.fire(event.type, event);
		if(this._hasFlag) 
		{
			this.callRender();
		}
	},
	
	/**
	 * @private
	 */
	setFlag: function(value)
	{
		if(!this._hasFlag)
		{
			this._hasFlag = true;
		}
		this._renderFlags[value] = true;
	},
	
	/**
	 * @private 
	 * Sets a flag to mark for rendering on a later enterFrame.
	 */
	setLaterFlag: function(value)
	{
		if(!this._hasLaterFlag)
		{
			this._hasLaterFlag = true;
		}
		this._laterFlags[value] = true;
	},

	/**
	 * @private
	 */
	setFlags: function(value)
	{
		for(var i = 0; i < value.length; i++)
		{
			this.setFlag(value[i]);
		}
	},	

	/**
	 * @private
	 */
	clearFlags: function()
	{
		this._renderFlags = {};
		this._hasFlag = false;
		for(var i in this._laterFlags)
		{
			if(this._laterFlags.hasOwnProperty(i))
			{
				this._renderFlags[i] = this._laterFlags[i];
				this._hasFlag = true;
			}
		}
		this._hasLaterFlag = false;
		this._laterFlags = {};
	},
	
	/**
	 * @private
	 */
	checkFlag: function(value)
	{
		return this._renderFlags[value];
	},

	/**
	 * @private (protected)
	 */
	checkFlags: function(flags)
	{
		var hasFlag = false;
		for(var i in flags)
		{
			if(this._renderFlags[i]) 
			{
				hasFlag = true;
				break;
			}
		}
		return hasFlag;
	}
});

Y.Renderer = Renderer;
function CartesianSeries(config)
{
	CartesianSeries.superclass.constructor.apply(this, arguments);
}

CartesianSeries.NAME = "cartesianSeries";

CartesianSeries.ATTRS = {
	parent: {
		lazyAdd: false,

		getter: function()
		{
			return this._parent;
		},

		setter: function(value)
		{
			if(Y.Lang.isString(value))
			{
				this._parent = document.getElementById(value);
			}
			else
			{
				this._parent = value;
			}
			this._canvas = document.createElement("canvas");
			this._canvas.width = parseInt(this._parent.style.width, 10) || this._parent.width;
			this._canvas.height = parseInt(this._parent.style.height, 10) || this._parent.height;
			this._parent.appendChild(this._canvas);
			return this._parent;
		}
	},

	type: {		
		getter: function()
		{
			return this._type;
		},
		setter: function(value)
		{
			this._type = value;
			return value;
		}
  	},
	/**
	 * Order of this ISeries instance of this <code>type</code>.
	 */
	order: {
		getter: function()
		{
			return this._order;
		},
		setter:function(value)
		{
			this._order = value;
			return value;
		}
	},
	/**
	 * x coordinates for the series.
	 */
	xcoords: {
		getter: function()
		{
			return this._xcoords;
		},

		setter: function(value)
		{
			this._xcoords = value;
			return value;
		}
	},
	/**
	 * y coordinates for the series
	 */
	ycoords: {
		getter: function()
		{
			return this._ycoords;
		},
		setter: function(value)
		{
			this._ycoords = value;
			return value;
		}
	},
	graph: {
		getter: function()
		{
			return this._graph;
		},
		setter: function(value)
		{
			this._graph = value;
			return value;
		}
	},
	/**
	 * Reference to the <code>Axis</code> instance used for assigning 
	 * x-values to the graph.
	 */
	xAxis: {
		getter: function()
		{ 
			return this._xAxis;
		},
		validator: function(value)
		{
			return value !== this._xAxis;
		},
		setter: function(value)
		{
			if(this._xAxis) 
			{
				//this.xAxis.removeEventListener(DataEvent.NEW_DATA, this.xAxisChangeHandler);
				//this.xAxis.removeEventListener(DataEvent.DATA_CHANGE, this.xAxisChangeHandler);
			}
			this._xAxis = value;			
			this._xAxis.on("axisReady", Y.bind(this.xAxisChangeHandler, this));
			//this.xAxis.addEventListener(DataEvent.NEW_DATA, this.xAxisChangeHandler);
			//this.xAxis.addEventListener(DataEvent.DATA_CHANGE, this.xAxisChangeHandler);
			this.setFlag("axisDataChange");
			return value;
		},
		lazyAdd: false
	},
	
	yAxis: {
		getter: function()
		{ 
			return this._yAxis;
		},
		validator: function(value)
		{
			return value !== this._yAxis;
		},
		setter: function(value)
		{
			if(this._yAxis) 
			{
	//			this.yAxis.removeEventListener(DataEvent.NEW_DATA, this.yAxisChangeHandler);
	//			this.yAxis.removeEventListener(DataEvent.DATA_CHANGE, this.yAxisChangeHandler);
			}
			this._yAxis = value;
			this._yAxis.on("axisReady", Y.bind(this.yAxisChangeHandler, this));
	//		this.yAxis.addEventListener(DataEvent.NEW_DATA, this.yAxisChangeHandler);
	//		this.yAxis.addEventListener(DataEvent.DATA_CHANGE, this.yAxisChangeHandler);
			this.setFlag("axisDataChange");
			return value;
		},
		lazyAdd: false
	},
	/**
	 * Indicates which array to from the hash of value arrays in 
	 * the x-axis <code>Axis</code> instance.
	 */
	xKey: {
		getter: function()
		{ 
			return this._xKey; 
		},
		validator: function(value)
		{
			return value !== this._xKey;
		},
		setter: function(value)
		{
			this._xKey = value;
			this.setFlag("xKeyChange");
			return value;
		}
	},
	/**
	 * Indicates which array to from the hash of value arrays in 
	 * the y-axis <code>Axis</code> instance.
	 */
	yKey: {
		getter: function()
		{ 
			return this._yKey; 
		},
		validator: function(value)
		{
			return value !== this._yKey;
		},
		setter: function(value)
		{
			this._yKey = value;
			this.setFlag("yKeyChange");
			return value;
		}
	},
	/**
	 * The canvas in which the line series will be rendered.
	 */
	canvas: {
		getter: function()
		{
			return this._canvas;
		},
		setter: function(value)
		{
			this._canvas = value;
			return value;
		}
	}
};

Y.extend(CartesianSeries, Y.Renderer, {
	_parent: null,

	_styles: {
		padding:{
			top: 0,
			left: 0,
			right: 0,
			bottom: 0
		}
	},
	
	/**
	 * @private
	 */
	_canvas: null,
	
	/**
	 * @private (protected)
	 * Handles updating the graph when the x < code>Axis</code> values
	 * change.
	 */
	xAxisChangeHandler: function(event)
	{
		if(this.get("xKey")) 
		{
			this.setFlag("axisDataChange");
		}
		if(this.get("yKey")) 
		{
			this.callRender();
		}
	},

	/**
	 * @private (protected)
	 * Handles updating the chart when the y <code>Axis</code> values
	 * change.
	 */
	yAxisChangeHandler: function(event)
	{
		if(this.get("yKey")) 
		{
			this.setFlag("axisDataChange");
		}
		if(this.get("xKey")) 
		{
			this.callRender();
		}
	},

	/**
	 * @private
	 */
	_type: "cartesian",

	/**
	 * @private 
	 * Storage for <code>order</code>
	 */
	_order: NaN,
	
	/**
	 * @private 
	 * Storage for <code>xcoords</code>.
	 */
	_xcoords: [],

	
	/**
	 * @private
	 * Storage for xKey
	 */
	_xKey: null,
	/**
	 * @private (protected)
	 * Storage for <code>ycoords</code>
	 */
	_ycoords: [],
	/**
	 * @private 
	 * Storage for <code>graph</code>.
	 */
	_graph: null,
	/**
	 * @private
	 * Storage for xAxis
	 */
	_xAxis: null,
	
	/**
	 * @private
	 * Storage for yAxis
	 */
	_yAxis: null,
	/**
	 * @private
	 * Storage for yKey
	 */
	_yKey: null,
	
	/**
	 * @private (protected)
	 */
	_xMin:NaN,
	
	/**
	 * @private (protected)
	 */
	_xMax: NaN,
	
	/**
	 * @private (protected)
	 */
	_yMin: NaN,
	
	/**
	 * @private (protected)
	 */
	_yMax: NaN,

	/**
	 * @private (protected)
	 * Storage for xCoords
	 */
	_xCoords: [],

	/**
	 * @private
	 */
	setAreaData: function()
	{
		var nextX, nextY,
			canvas = this.get("canvas"),
			w = canvas.width,
			h = canvas.height,
			padding = this.get("styles").padding,
			leftPadding = padding.left,
			topPadding = padding.top,
			dataWidth = w - (leftPadding + padding.right),
			dataHeight = h - (topPadding + padding.bottom),
			xcoords = [],
			ycoords = [],
			xMax = this.get("xAxis").get("maximum"),
			xMin = this.get("xAxis").get("minimum"),
			yMax = this.get("yAxis").get("maximum"),
			yMin = this.get("yAxis").get("minimum"),
			xKey = this.get("xKey"),
			yKey = this.get("yKey"),
			xScaleFactor = dataWidth / (xMax - xMin),
			yScaleFactor = dataHeight / (yMax - yMin),
			xData = this.get("xAxis").getDataByKey(xKey),
			yData = this.get("yAxis").getDataByKey(yKey),
			dataLength = xData.length, 	
			midY = dataHeight/2,
			i;
		for (i = 0; i < dataLength; ++i) 
		{
			nextX = Math.round(0.5 + (((xData[i] - xMin) * xScaleFactor) + leftPadding));
			nextY = Math.round(0.5 +((dataHeight + topPadding) - (yData[i] - yMin) * yScaleFactor));
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
	},
	
	/**
	 * @private (override)
	 */
	render: function()
	{
		var dataChange = this.checkDataFlags(),
			resize = this.checkResizeFlags(),
			styleChange = this.checkStyleFlags(),
			canvas = this.get("canvas"),
			context = canvas.getContext("2d"),
			w = canvas.width,
			h = canvas.height,
			xAxis = this.get("xAxis"),
			yAxis = this.get("yAxis");
	
		if(dataChange)
		{
			this._xMin = xAxis.minimum;
			this._xMax = xAxis.maximum;
			this._yMin = yAxis.minimum;
			this._yMax = yAxis.maximum;
		}
		
		if ((resize || dataChange) && (!isNaN(w) && !isNaN(h) && w > 0 && h > 0))
		{
			this.setAreaData();
			if(this.get("xcoords") && this.get("ycoords")) 
			{
				this.setLaterFlag("drawGraph");
			}
			return;
		}
		
		if(this.checkFlag("drawGraph") || (styleChange && this._xcoords && this._ycoords))
		{
			this.drawGraph();
		}
	},

	/**
	 * Determines whether a data change has occurred during this render cycle.
	 */
	checkDataFlags: function () 
	{
		return this.checkFlags({
			axisDataChange:true,
			xKeyChange:true,
			yKeyChange:true
		});
	},

	/**
	 * Indicates whether there has been a resize during the current render cycle.
	 */
	checkResizeFlags: function ()
	{
		return this.checkFlags({
			padding:true,
			resize:true
		});
	},

	/**
	 * Indicates whether there has been a style change during the current
	 * render cycle.
	 */
	checkStyleFlags: function () 
	{
		return false;
	}
});

Y.CartesianSeries = CartesianSeries;
function LineSeries(config)
{
	LineSeries.superclass.constructor.apply(this, arguments);
}

LineSeries.name = "lineSeries";

LineSeries.ATTRS = {
	type: {
		/**
		 * Indicates the type of graph.
		 */
		getter: function()
		{
			return this._type;
		}
	}
};

Y.extend(LineSeries, Y.CartesianSeries, {
	/**
	 * @private
	 * Default styles for the series.
	 */
	_styles: {
		color: "#000000",
		alpha: 1,
		weight: 1,
		marker: {
			fillColor: "#000000",
			alpha: 1,
			weight: 1
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
	},

	/**
	 * @private (protected)
	 */
	_type: "line",
	
	/**
	 * @private (override)
	 */
	checkStyleFlags: function()  
	{
		return this.checkFlags({
			color:true,
			weight:true,
			alpha:true,	
			type:true,
			marker:true,
			dashLength:true,
			gapLength:true,
			connectDiscontinuousPoints:true,
			discontinuousType:true,
			discontinuousDashLength:true,
			discontinuousGapLength:true
		});
	},

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
	//		this.drawMarkers();
		}
	},

	/**
	 * @protected
	 */
	drawLines: function()
	{
		if(this._xcoords.length < 1) 
		{
			return;
		}
		var	xcoords = this._xcoords,
			ycoords = this._ycoords,
			len = xcoords.length,
			lastValidX,
			lastValidY,
			lastX = xcoords[0],
			lastY = ycoords[0],
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
			canvas = this.get("canvas"),
			context = canvas.getContext("2d");
		lastValidX = lastX;
		lastValidY = lastY;
		context.lineWidth = styles.weight;
		context.strokeStyle = styles.color;
		context.moveTo (lastX, lastY);
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
					context.lineTo(nextX, nextY);
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
				context.moveTo(nextX, nextY);
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
					context.lineTo(nextX, nextY);
				}
			}
		
			lastX = lastValidX = nextX;
			lastY = lastValidY = nextY;
		}
		context.stroke();
	},

	drawMarkers: function()
	{
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
			canvas = this.get("canvas"),
			context = canvas.getContext("2d");
		xDelta = Math.cos(radians) * segmentLength;
		yDelta = Math.sin(radians) * segmentLength;
		
		for(i = 0; i < segmentCount; ++i)
		{
			context.moveTo(xCurrent, yCurrent);
			context.lineTo(xCurrent + Math.cos(radians) * dashSize, yCurrent + Math.sin(radians) * dashSize);
			xCurrent += xDelta;
			yCurrent += yDelta;
		}
		
		context.moveTo(xCurrent, yCurrent);
		delta = Math.sqrt((xEnd - xCurrent) * (xEnd - xCurrent) + (yEnd - yCurrent) * (yEnd - yCurrent));
		
		if(delta > dashSize)
		{
			context.lineTo(xCurrent + Math.cos(radians) * dashSize, yCurrent + Math.sin(radians) * dashSize);
		}
		else if(delta > 0)
		{
			context.lineTo(xCurrent + Math.cos(radians) * delta, yCurrent + Math.sin(radians) * delta);
		}
		
		context.moveTo(xEnd, yEnd);
	}
});

Y.LineSeries = LineSeries;


		

		


}, '@VERSION@' );
