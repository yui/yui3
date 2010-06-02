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
	},

	handleEventListening: {
		validator: function(val)
		{
			return Y.Lang.isBoolean(val);
		},

		getter: function()
		{
			return this._handleEventListening;
		},

		setter: function(val)
		{
			this._handleEventListening = val;
			return val;
		}
	}
};

/**
 * Need to refactor to augment Attribute
 */
Y.extend(Graph, Y.Container, 
{
    _getArgs: function()
    {
        return [Y.JSON.stringify(this.get("seriesCollection")), this.get("handleEventListening")];
    },

	GUID:"yuigraph",

	/**
	 * @private
	 * Indicates whether the Graph will act as a delegate for
	 * mouse events.
	 */
	_handleEventListening: false,

	/**
	 * Reference to corresponding Actionscript class.
	 */
	AS_CLASS: "Graph",

	_seriesCollection:null,

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
