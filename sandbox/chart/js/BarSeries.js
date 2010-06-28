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
	/**
	 * @private
	 */
    drawSeries: function()
	{
	    if(this.get("xcoords").length < 1) 
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
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            shapeMethod = style.func || "drawRect",
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
            left;
        for(; i < seriesLen; ++i)
        {
            renderer = seriesCollection[i];
            seriesHeight += renderer.get("styles").marker.height;
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
            graphic.end();
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

Y.BarSeries = BarSeries;
