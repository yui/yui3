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
	 * @param {Object} config Configuration parameters for the Axis.
	 */
	function LineGraph (config) 
	{
		LineGraph.superclass.constructor.apply(this, arguments);
	}

	LineGraph.NAME = "lineGraph";

	LineGraph.ATTRS = {
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
	};

	Y.extend(LineGraph, Y.SWFWidget, 
	{
		/**
		 * Reference to corresponding Actionscript class.
		 */
		AS_CLASS:  "LineSeries",

		GUID: "yuilinechart",

		/**
		 * @private
		 * Called by the class instance containing the application swf after the swf
		 * has been initialized.
		 *
		 * @method _init
		 * @param swfowner {Object} Class instance with direct access to the application swf.
		 */
		initializer: function(cfg)
		{
			this.createInstance(this._id, 
				"LineSeries", 
				[
					{
						xAxisData:"$" + this.get("xaxis")._id + "data", 
						yAxisData:"$" + this.get("yaxis")._id + "data", 
						xKey:this.get("xkey"), 
						yKey:this.get("ykey")
					}
				]);
			this._updateStyles();
		}

	});

	Y.LineGraph = LineGraph;
