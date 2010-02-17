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
	 * @param {String} axisType type of axis: numeric, category or time.
	 * @param {Object} config (optional) Configuration parameters for the Axis.
	 */
	function Axis (axisType, config) 
	{
		this._id = Y.guid("yuiaxis");
		this._dataId = this._id + "data";
		this.axisType = axisType || "Numeric";
		this.keys = [];
		this.swfowner = null;
		this._parseConfigs(config);
	}

	/**
	 * Need to refactor to augment Attribute
	 */
	Axis.prototype = 
	{
	
		/**
		 * Reference to corresponding Actionscript class.
		 */
		className:  "Axis",
		
		/**
		 * @private
		 * Called when the Axis is initialized
		 * @method _axisInit
		 * @param swfowner {Object} The class with a direct reference to the application swf. 
		 */
		_init: function(swfowner)
		{
			this.swfowner = swfowner;
			this.appswf = this.swfowner.appswf;
			this.appswf.createInstance(this._dataId, this.axisType + "Data", ["$" + this.swfowner._dataId]);
			for (var i in this.keys) 
			{
				if(this.keys.hasOwnProperty(i))
				{
					this.appswf.applyMethod(this._dataId, "addKey", [this.keys[i]]);
				}
			}
			this.appswf.createInstance(this._id, "Axis", ["$" + this._dataId]);
			if(this._defaultStyles !== null) 
			{
				this.appswf.applyMethod(this._id, "setStyles", [this._defaultStyles]);
				this._defaultStyles = null;
			}
		},
		
		/**
		 * Sets properties based on a configuration hash.
		 * @private
		 */
		_parseConfigs: function(config)
		{
			if(config && config.hasOwnProperty("styles"))
			{
				this.setStyles(config.styles);
			}
		},
		
		/**
		 * Uses key to lookup and extract specified data from a data source.
		 *
		 * @method addKey
		 * @param {String} key identifier used to specify data set.
		 */
		addKey: function(key) 
		{
			this.keys.push(key);
			if(this.appswf)
			{
				this.appswf.applyMethod("$" + this._dataId, "addKey", [key]);
			}
		},

		/**
		 * @private
		 *
		 * Hash of default styles for the instance.
		 */
		_defaultStyles: null,
		
		/**
		 * Sets a style property for the instance.
		 *
		 * @method setStyle
		 * @param {String} style name of the style to be set
		 * @param {Object} value value to be set for the style
		 */
		setStyle: function(style, value)
		{
			if(this.appswf) 
			{
				this.appswf.applyMethod(this._id, "setStyle", [style, value]);
			}
			else
			{
				if(!this._defaultStyles)
				{
					this._defaultStyles = {};
				}
				this._defaultStyles[style] = value;
			}
	  	},

		/**
		 * Sets multiple style properties on the instance.
		 *
		 * @method setStyles
		 * @param {Object} styles Hash of styles to be applied.
		 */
		setStyles: function(styles)
		{
			var i;
			if(this.appswf)
			{
				this.appswf.applyMethod(this._id, "setStyles", [styles]);
				this._defaultStyles = null;
			}
			else
			{
				for(i in styles) 
				{
					if(styles.hasOwnProperty(i))
					{
						if(!this._defaultStyles)
						{
							this._defaultStyles = {};
						}
						this._defaultStyles[i] = styles[i];
					}
				}
			}
		},

		/**
		 * Public accessor to the unique name of the Axis instance.
		 *
		 * @method toString
		 * @return {String} Unique name of the Axis instance.
		 */
		toString: function()
		{
			return "Axis " + this._id;
		}
	};


	Y.augment(Axis, Y.EventTarget);
	Y.Axis = Axis;
