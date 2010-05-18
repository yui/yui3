function DataTip (config) 
{
	DataTip.superclass.constructor.apply(this, arguments);
}

DataTip.NAME = "dataTip";

DataTip.ATTRS = {
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

	graph: {
		lazyAdd: false,

		getter: function()
		{
			return this._graph;
		},

		setter: function(val)
		{
			this._graph = val;
			return val;
		}
	}
};

/**
 * Need to refactor to augment Attribute
 */
Y.extend(DataTip, Y.Container, 
{
	GUID:"yuidataTip",

	/**
	 * Reference to corresponding Actionscript class.
	 */
	AS_CLASS: "DataTip",

	_graph: null,

    _getArgs: function()
    {
        return ["$" + this.get("graph")._id];
	}
});

Y.DataTip = DataTip;
