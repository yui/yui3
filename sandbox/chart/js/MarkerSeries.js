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
            fillColor = style.fill.color,
            fillAlpha = style.fill.alpha,
            fillType = style.fill.type || "solid",
            borderWeight = style.border.weight,
            borderColor = style.border.color,
            borderAlpha = style.border.alpha || 1,
            colors = style.fill.colors,
            alphas = style.fill.alphas || [],
            ratios = style.fill.ratios || [],
            rotation = style.fill.rotation || 0,
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            shapeMethod = style.func || "drawCircle",
            i = 0,
            len = xcoords.length,
            top = ycoords[0],
            left;
        for(; i < len; ++i)
        {
            top = ycoords[i];
            left = xcoords[i];
            if(borderWeight > 0)
            {
                graphic.lineStyle(borderWeight, borderColor, borderAlpha);
            }
            if(fillType === "solid")
            {
                graphic.beginFill(fillColor, fillAlpha);
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
     * @description Draws a marker
     */
    drawMarker: function(graphic, func, left, top, w, h)
    {
        if(func === "drawCircle")
        {
            graphic.drawCircle(left, top, w/2);
        }
        else
        {
            left -= w/2;
            top -= h/2;
            graphic[func].call(graphic, left, top, w, h);
        }
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


		

		
