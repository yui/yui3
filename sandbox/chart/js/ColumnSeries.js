function ColumnSeries(config)
{
	ColumnSeries.superclass.constructor.apply(this, arguments);
}

ColumnSeries.NAME = "columnSeries";

ColumnSeries.ATTRS = {
	type: {
        value: "column"
    }
};

Y.extend(ColumnSeries, Y.CartesianSeries, {
    /**
     * @private
     */
    renderUI: function()
    {
        this._setNode();
    },

    bindUI: function()
    {
        Y.delegate("mouseover", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
        Y.delegate("mousedown", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
        Y.delegate("mouseup", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
        Y.delegate("mouseout", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
    },

    /**
	 * @private
	 */
	drawSeries: function()
	{
	    if(this.get("xcoords").length < 1) 
		{
			return;
		}
        var style = this._mergeStyles(this.get("styles"), {}),
            w = style.width,
            h = style.height,
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            i = 0,
            len = xcoords.length,
            top = ycoords[0],
            type = this.get("type"),
            graph = this.get("graph"),
            seriesCollection = graph.seriesTypes[type],
            seriesLen = seriesCollection.length,
            seriesWidth = 0,
            totalWidth = 0,
            offset = 0,
            ratio,
            renderer,
            order = this.get("order"),
            node = Y.Node.one(this._parentNode).get("parentNode"),
            left,
            marker,
            bb;
            this._createMarkerCache();
        for(; i < seriesLen; ++i)
        {
            renderer = seriesCollection[i];
            seriesWidth += renderer.get("styles").width;
            if(order > i) 
            {
                offset = seriesWidth;
            }
        }
        totalWidth = len * seriesWidth;
        if(totalWidth > node.offsetWidth)
        {
            ratio = this.width/totalWidth;
            seriesWidth *= ratio;
            offset *= ratio;
            w *= ratio;
            w = Math.max(w, 1);
        }
        offset -= seriesWidth/2;
        for(i = 0; i < len; ++i)
        {
            top = ycoords[i];
            h = this._bottomOrigin - top;
            left = xcoords[i] + offset;
            style.width = w;
            style.height = h;
            marker = this.getMarker.apply(this, [{index:i, styles:style}]);
            bb = marker.get("boundingBox");
            bb.setStyle("position", "absolute");
            bb.setStyle("left", left + "px");
            bb.setStyle("top", top + "px");
        }
        this._clearMarkerCache();
 	},

    /**
     * @private
     * Resizes and positions markers based on a mouse interaction.
     */
    _markerEventHandler: function(e)
    {
        var type = e.type,
            marker = Y.Widget.getByNode(e.currentTarget),
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            i = marker.get("index") || Y.Array.indexOf(this.get("markers"), marker),
            graph = this.get("graph"),
            seriesCollection = graph.seriesTypes[this.get("type")],
            seriesLen = seriesCollection.length,
            seriesWidth = 0,
            offset = 0,
            renderer,
            n = 0,
            xs = [],
            order = this.get("order");
        switch(type)
        {
            case "mouseout" :
                marker.set("state", "off");
            break;
            case "mouseover" :
                marker.set("state", "over");
            break;
            case "mouseup" :
                marker.set("state", "over");
            break;
            case "mousedown" :
                marker.set("state", "down");
            break;
        }
        marker.set("styles", {over:{height: (this._bottomOrigin - ycoords[i])}});
        for(; n < seriesLen; ++n)
        {
            renderer = seriesCollection[n].get("markers")[i];
            xs[n] = xcoords[i] + seriesWidth;
            seriesWidth += parseInt(renderer.get("boundingBox").getStyle("width"), 10);
            if(order > n)
            {
                offset = seriesWidth;
            }
            offset -= seriesWidth/2;
        }
        for(n = 0; n < seriesLen; ++n)
        {
            renderer = seriesCollection[n].get("markers")[i];
            renderer.get("boundingBox").setStyle("left", (xs[n] - seriesWidth/2) + "px");
        }
    },
    
    _getDefaultStyles: function()
    {
        return {
            fill: {
                alpha: "1",
                colors: [],
                alphas: [],
                ratios: [],
                rotation: 0
            },
            width: 6,
            height: 6,
            shape: "rect",
            padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }
        };
    }
});

Y.ColumnSeries = ColumnSeries;
