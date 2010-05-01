/**
 * The Axis used in the chart visualization package
 * @module axis
 *
 *
 * Note: Axis is a temporary class that has been created for the purposes of observing and testing the current state of the underlying flash chart rendering engine. This file
 * will be replaced in future iterations and its api will vary significantly. 
 */
		/**
		 * The Axis module allows creating numeric, category and time axes in the Chart module.
		 * @module axis
		 * @title Axis
		 * @requires yahoo, dom, event
		 * @namespace YAHOO.widget
		 */

/**
 * Creates the Axis instance and contains initialization data
 *
 * @class Axis
 * @augments Y.Event.Target
 * @constructor
 * @param {Object} config Configuration parameters for the Axis.
 */
function Axis (config) 
{
	Axis.superclass.constructor.apply(this, arguments);
	this._dataId = this._id + "data";

}

Axis.NAME = "axis";

Axis.ATTRS = {
	keys:{
		value:[],
		
		setter: function(val)
		{
			this._keys = val;
		},

		getter: function()
		{
			return this._keys;
		}
	},
	axisType:{
		value: "Numeric",

		setter: function(val)
		{
			this._axisType = val;
		},

		getter: function()
		{
			return this._axisType;
		}
	}
};

/**
 * Need to refactor to augment Attribute
 */
Y.extend(Axis, Y.SWFWidget, 
{
	_events: {},

	GUID:"yuiaxis",

	_axisType: "Numeric",

	_keys: [],

	swfReadyFlag:false,


	/**
	 * Reference to corresponding Actionscript class.
	 */
	AS_CLASS:  "Axis",
	
	/**
	 * @private
	 * Called when the Axis is initialized
	 * @method _axisInit
	 * @param swfowner {Object} The class with a direct reference to the application swf. 
	 */
	_init: function()
	{
		this.get("app").createInstance(this._dataId, this.get("axisType") + "Data", ["$" + this.get("app")._dataId]);
		var i, keys = this.get("keys");
		for (i in keys) 
		{
			if(keys.hasOwnProperty(i))
			{
				this.get("app").applyMethod(this._dataId, "addKey", [keys[i]]);
			}
		}
		this.get("app").createInstance(this._id, "Axis", ["$" + this._dataId]);
		this._addSWFEventListeners();
		this.swfReadyFlag = true;
	},
	
	/**
	 * Uses key to lookup and extract specified data from a data source.
	 *
	 * @method addKey
	 * @param {String} key identifier used to specify data set.
	 */
	addKey: function(key) 
	{
		this.get("keys").push(key);
		if(this.get("app"))
		{
			this.get("app").applyMethod("$" + this._dataId, "addKey", [key]);
		}
	}
});


Y.augment(Axis, Y.SWFWidget);
Y.Axis = Axis;
