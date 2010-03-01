/* The LineGraph is used in the chart visualization package
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
	function LineGraph (p_oElement, config) 
	{
		this._attributeConfig = Y.merge(this._attributeConfig, LineGraph.superclass._attributeConfig);
		LineGraph.superclass.constructor.apply(this, arguments);
	}


	Y.extend(LineGraph, Y.SWFWidget, 
	{
		_attributeConfig:
		{
			xaxis:
			{
				value:null
			},

			yaxis:
			{
				value:null
			},
			
			xkey:
			{
				value:null
			},

			ykey:
			{
				value:null
			}
		},

		/**
		 * Reference to corresponding Actionscript class.
		 */
		AS_CLASS:  "LineGraph",

		GUID: "yuilinechart",

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
			this.appswf.createInstance(this._id, "LineGraph", ["$" + this.get("xaxis")._id + "data", "$" + this.get("yaxis")._id + "data", this.get("xkey"), this.get("ykey")]);
			this._updateStyles();
		}

	});

	Y.LineGraph = LineGraph;
