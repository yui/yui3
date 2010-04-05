
function Graph (config) 
{
	Graph.superclass.constructor.apply(this, arguments);

}

Graph.NAME = "graph";

Graph.ATTRS = {
	/**
	 * Reference to the layout strategy used for displaying child items.
	 */
	layout:  
	{
		value:"LayerStack",

		//needs a setter

		validator: function(val)
		{
			return Y.Array.indexOf(this.LAYOUTS, val) > -1;
		}
	},

	seriesCollection:
	{
		validator: function(val)
		{
			return Y.Lang.isArray(val);
		},

		setter: function(val)
		{
			this._seriesCollection = this._convertReferences(val);
		}
	}
};

/**
 * Need to refactor to augment Attribute
 */
Y.extend(Graph, Y.Container, 
{
	GUID:"yuigraph",

	/**
	 * Reference to corresponding Actionscript class.
	 */
	AS_CLASS: "Graph",

	_seriesCollection:null,
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
		if(this.get("seriesCollection"))
		{
			this.appswf.createInstance(this._id, "Graph", [Y.JSON.stringify(this.get("seriesCollection"))]);
		}
	},

	/**
	 * Converts references of AS class wrappers to string references to used with 
	 * ExternalInterface.
	 */
	_convertReferences: function(collection)
	{
		var i,
			len = collection.length,
			series,
			arr = [];
		for(i = 0; i < len; ++i)
		{
			series = collection[i];
			series.xAxisData = "$" + series.xAxisData._id + "data";
			series.yAxisData = "$" + series.yAxisData._id + "data";
			arr.push(series);
		}
		return arr;
	}
});

Y.Graph = Graph;
