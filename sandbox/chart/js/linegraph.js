/**
 * The LineGraph is used in the chart visualization package
 * @module axis
 *
 * Note: LineGraph is a temporary class that has been created for the purposes of observing and testing the current state of the underlying flash chart rendering engine. This file
 * will be replaced in future iterations and its api will vary significantly. 
 */
	/**
	 * The LineGraph module allows creating single line cartesian graphs.
	 * @module linegraph
	 * @title Line Graph
	 * @namespace YAHOO.widget
	 */

	/**
	 * Creates the LineGraph instance and contains initialization data
	 *
	 * @class LineGraph
	 * @constructor
	 * @param xaxis {Axis} reference to the xaxis 
	 * @param yaxis {Axis} reference to the yaxis 
	 * @param xkey {String} pointer to the array of values contained in the xaxis
	 * @param ykey {String} point to ther array of values container in the yaxis
	 * @param {Object} config (optional) Configuration parameters for the Axis.
	 */
	function LineGraph (xaxis, yaxis, xkey, ykey, config) {
		this._id = Y.guid("yuilinegraph");
		this.xaxis = xaxis;
		this.yaxis = yaxis;
		this.xkey = xkey;
		this.ykey = ykey;
		this._parseConfigs(config);
		this.swfowner = null;
	}

	LineGraph.prototype = 
	{
		/**
		 * Reference to corresponding Actionscript class.
		 */
		className:  "LineGraph",

		/**
		 * @private
		 * Called by the class instance containing the application swf after the swf
		 * has been initialized.
		 *
		 * @method _init
		 * @param swfowner {Object} Class instance with direct access to the application swf.
		 */
		_init: function(swfowner)
		{
			this.swfowner = swfowner;
			this.appswf = this.swfowner.appswf;
			this.appswf.createInstance(this._id, "LineGraph", ["$" + this.xaxis._id + "data", "$" + this.yaxis._id + "data", this.xkey, this.ykey]);
			if(this._defaultStyles) 
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
			if(this.appswf)
			{
				this.appswf.applyMethod(this._id, "setStyles", [styles]);
				this._defaultStyles = null;
			}
			else
			{
				for(var i in styles) 
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
		 * Public accessor to the unique name of the LineGraph instance.
		 *
		 * @method toString
		 * @return {String} Unique name of the LineGraph instance.
		 */
		toString: function()
		{
			return "LineGraph " + this._id;
		}

	};


	Y.augment(LineGraph, Y.EventTarget);

	Y.LineGraph = LineGraph;
