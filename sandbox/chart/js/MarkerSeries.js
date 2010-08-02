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
     */
    renderUI: function()
    {
        this._setNode();
    },
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
        var style = this.get("styles"),
            w = style.width,
            h = style.height,
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            i = 0,
            len = xcoords.length,
            top = ycoords[0],
            left,
            marker,
            mnode,
            offsetWidth = w/2,
            offsetHeight = h/2;
            this._createMarkerCache();
        for(; i < len; ++i)
        {
            top = (ycoords[i] - offsetWidth) + "px";
            left = (xcoords[i] - offsetHeight) + "px";
            marker = this.getMarker(style);
            mnode = marker.get("boundingBox");
            mnode.setStyle("position", "absolute"); 
            mnode.setStyle("top", top);
            mnode.setStyle("left", left);
        }
        this._clearMarkerCache();
 	},

    _markerEventHandler: function(e)
    {
        var type = e.type,
            marker = e.currentTarget,
            mnode = marker.get("boundingBox"),
            w,
            h,
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            i = Y.Array.indexOf(this._markers, marker);
            switch(type)
            {
                case "marker:mouseout" :
                    marker.set("state", "off");
                break;
                case "marker:mouseover" :
                    marker.set("state", "over");
                break;
                case "marker:mouseup" :
                    marker.set("state", "over");
                break;
                case "marker:mousedown" :
                    marker.set("state", "down");
                break;
            }
            w = marker.get("width");
            h = marker.get("height");
            mnode.setStyle("left", (xcoords[i] - w/2) + "px");
            mnode.setStyle("top", (ycoords[i] - h/2) + "px");    
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
