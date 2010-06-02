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
		},

        lazyAdd: false
	}
};

/**
 * Need to refactor to augment Attribute
 */
Y.extend(Axis, Y.SWFWidget, 
{
    _getArgs: function()
    {
        this._dataId = this._id + "data";
        this.createInstance(this._dataId, this.get("axisType") + "Data", ["$" + this.get("app")._dataId]);
        return ["$" + this._dataId];
    },
	
    GUID:"yuiaxis",

    /**
     * @private
     * Storage for axisType
     */
	_axisType: "Numeric",

    /**
     * @private 
     * Storage for keys
     */
	_keys: null,

	/**
	 * Reference to corresponding Actionscript class.
	 */
	AS_CLASS:  "Axis",
	
	/**
	 * Uses key to lookup and extract specified data from a data source.
	 *
	 * @method addKey
	 * @param {String} key identifier used to specify data set.
	 */
	addKey: function(key) 
	{
		this.get("keys").push(key);
        this.applyMethod(this._dataId, "addKey", [key]);
	}
});


Y.augment(Axis, Y.SWFWidget);
Y.Axis = Axis;
