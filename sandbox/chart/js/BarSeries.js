function BarSeries(config)
{
	BarSeries.superclass.constructor.apply(this, arguments);
}

BarSeries.NAME = "barSeries";

BarSeries.ATTRS = {
	type: {
        value: "bar"
    },
    direction: {
        value: "vertical"
    }
};

Y.extend(BarSeries, Y.CartesianSeries, {
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
    renderUI: function()
    {
        this._setNode();
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
            seriesHeight = 0,
            totalHeight = 0,
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
            seriesHeight += renderer.get("styles").height;
            if(order > i) 
            {
                offset = seriesHeight;
            }
        }
        totalHeight = len * seriesHeight;
        if(totalHeight > node.offsetHeight)
        {
            ratio = this.height/totalHeight;
            seriesHeight *= ratio;
            offset *= ratio;
            h *= ratio;
            h = Math.max(h, 1);
        }
        offset -= seriesHeight/2;
        for(i = 0; i < len; ++i)
        {
            top = ycoords[i] + offset;
            left = xcoords[i];
            w = left - this._leftOrigin;
            style.width = w;
            style.height = h;
            marker = this.getMarker.apply(this, [{index:i, styles:style}]);
            bb = marker.get("boundingBox");
            bb.setStyle("position", "absolute");
            bb.setStyle("left", 0 + "px");
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
            seriesHeight = 0,
            offset = 0,
            renderer,
            n = 0,
            ys = [],
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
        marker.set("styles", {over:{width:(xcoords[i] - this._leftOrigin)}});
        for(; n < seriesLen; ++n)
        {
            renderer = seriesCollection[n].get("markers")[i];
            ys[n] = ycoords[i] + seriesHeight;
            seriesHeight += parseInt(renderer.get("boundingBox").getStyle("height"), 10);
            if(order > n)
            {
                offset = seriesHeight;
            }
            offset -= seriesHeight/2;
        }
        for(n = 0; n < seriesLen; ++n)
        {
            renderer = seriesCollection[n].get("markers")[i];
            renderer.get("boundingBox").setStyle("top", (ys[n] - seriesHeight/2) + "px");
        }
    },

	/**
	 * @private
	 */
    drawMarker: function(graphic, func, left, top, w, h)
    {
        graphic.drawRect(this._leftOrigin, top, w, h);
    },
	
	/**
	 * @private
	 */
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

Y.BarSeries = BarSeries;
