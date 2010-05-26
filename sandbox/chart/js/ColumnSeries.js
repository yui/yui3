function ColumnSeries(config)
{
	ColumnSeries.superclass.constructor.apply(this, arguments);
}

ColumnSeries.name = "columnSeries";

ColumnSeries.ATTRS = {
	type: {
		/**
		 * Indicates the type of graph.
		 */
		getter: function()
		{
			return this._type;
		}
	}
};

Y.extend(ColumnSeries, Y.CartesianSeries, {
	/**
	 * Constant used to generate unique id.
	 */
	GUID: "yuicolumnseries",
	
    /**
	 * @private (protected)
	 */
	_type: "column",

	drawMarkers: function()
	{
	    if(this._xcoords.length < 1) 
		{
			return;
		}
        var graphic = this.get("graphic"),
            style = this.get("styles").marker,
            w = style.width,
            h = style.height,
            fillColor = style.fillColor,
            alpha = style.fillAlpha,
            fillType = style.fillType || "solid",
            borderWidth = style.borderWidth,
            borderColor = style.borderColor,
            borderAlpha = style.borderAlpha || 1,
            colors = style.colors,
            alphas = style.alpha || [],
            ratios = style.ratios || [],
            rotation = style.rotation || 0,
            xcoords = this._xcoords,
            ycoords = this._ycoords,
            shapeMethod = style.func || "drawCircle",
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
            left;
        for(; i < seriesLen; ++i)
        {
            renderer = seriesCollection[i];
            seriesWidth += renderer.get("styles").marker.width;
            if(order > i) 
            {
                offset = seriesWidth;
            }
        }
        totalWidth = len * seriesWidth;
        if(totalWidth > this.get("parent").offsetWidth)
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
            left = xcoords[i] + offset;
            if(borderWidth > 0)
            {
                graphic.lineStyle(borderWidth, borderColor, borderAlpha);
            }
            if(fillType === "solid")
            {
                graphic.beginFill(fillColor, alpha);
            }
            else
            {
                graphic.beginGradientFill(fillType, colors, alphas, ratios, {rotation:rotation, width:w, height:h});
            }
            this.drawMarker(graphic, shapeMethod, left, top, w, h);
            graphic.endFill();
        }
 	},

    drawMarker: function(graphic, func, left, top, w, h)
    {
		var origin = Math.min(this.get("parent").offsetHeight, this._bottomOrigin);
        left -= w/2;
        h = this._bottomOrigin - top;
        graphic.drawRect(left, top, w, h);
    },
	
	_getDefaultStyles: function()
    {
        return {
            marker: {
                fillColor: "#000000",
                fillAlpha: 1,
                borderColor:"#ff0000",
                borderWidth:0,
                borderAlpha:1,
                colors:[],
                alpha:[],
                ratios:[],
                rotation:0,
                width:6,
                height:6
            },
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
