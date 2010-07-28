function MarkerSeries(config)
{
	MarkerSeries.superclass.constructor.apply(this, arguments);
}

MarkerSeries.NAME = "markerSeries";

MarkerSeries.ATTRS = {
	type: {
		/**
		 * Indicates the type of graph.
		 */
        value:"marker"
    }
};

Y.extend(MarkerSeries, Y.CartesianSeries, {
    /**
     * @private
     * @description Draws the markers for the graph
     */
	drawSeries: function()
	{
	    if(!this.get("xcoords") || this.get("xcoords").length < 1) 
		{
			return;
		}
        var graphic = this.get("graphic"),
            style = this.get("styles"),
            w = style.width,
            h = style.height,
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            i = 0,
            len = xcoords.length,
            top = ycoords[0],
            left,
            markers = [],
            marker,
            mnode;
        for(; i < len; ++i)
        {
            top = ycoords[i];
            left = xcoords[i];
            marker = new Y.Marker({styles:this.get("styles")});
            marker.render(this.get("node"));
            mnode = marker.get("node");
            mnode.style.top = (top - marker.get("height")/2) + "px";
            mnode.style.left = (left - marker.get("width")/2) + "px";
            marker.on("mouseover", Y.bind(this._markerEventHandler, this));
            marker.on("mousedown", Y.bind(this._markerEventHandler, this));
            marker.on("mouseup", Y.bind(this._markerEventHandler, this));
            marker.on("mouseout", Y.bind(this._markerEventHandler, this));
            markers.push(marker);
        }
        this._markers = markers;
 	},

    _markerEventHandler: function(e)
    {
        var type = e.type,
            marker = e.currentTarget,
            mnode = marker.get("node"),
            w = marker.get("width"),
            h = marker.get("height"),
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            i = Y.Array.indexOf(this._markers, marker);
            mnode.style.left = (xcoords[i] - w/2) + "px";
            mnode.style.top = (ycoords[i] - h/2) + "px";    
    },

	_getDefaultStyles: function()
    {
        return {
            fill:{
                type: "solid",
                color: "#000000",
                alpha: 1,
                colors:null,
                alphas: null,
                ratios: null
            },
            border:{
                color: "#000000",
                weight: 1,
                alpha: 1
            },
            width: 6,
            height: 6,
            shape: "circle",

            padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }
        };
    }
});

Y.MarkerSeries = MarkerSeries;
