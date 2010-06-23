function StackedBarSeries(config)
{
	StackedBarSeries.superclass.constructor.apply(this, arguments);
}

StackedBarSeries.NAME = "stackedBarSeries";

StackedBarSeries.ATTRS = {
	type: {
        value: "stackedBar"
    },
    direction: {
        value: "vertical"
    },

    negativeBaseValues: {
        value: null
    },

    positiveBaseValues: {
        value: null
    }
};

Y.extend(StackedBarSeries, Y.CartesianSeries, {
    drawMarkers: function()
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
            totalHeight = 0,
            ratio,
            order = this.get("order"),
            lastCollection,
            negativeBaseValues,
            positiveBaseValues,
            useOrigin = order === 0,
            node = Y.Node.one(this._parentNode).get("parentNode"),
            left;
        totalHeight = len * h;
        if(totalHeight > node.offsetHeight)
        {
            ratio = this.height/totalHeight;
            h *= ratio;
            h = Math.max(h, 1);
        }
        if(!useOrigin)
        {
            lastCollection = seriesCollection[order - 1];
            negativeBaseValues = lastCollection.get("negativeBaseValues");
            positiveBaseValues = lastCollection.get("positiveBaseValues");
        }
        else
        {
            negativeBaseValues = [];
            positiveBaseValues = [];
        }
        this.set("negativeBaseValues", negativeBaseValues);
        this.set("positiveBaseValues", positiveBaseValues);
        for(i = 0; i < len; ++i)
        {
            top = ycoords[i];
            left = xcoords[i];
            
            if(useOrigin)
            {
                w = left - this._leftOrigin;
                if(left > this._leftOrigin)
                {
                    positiveBaseValues[i] = left;
                    negativeBaseValues[i] = this._leftOrigin;
                }
                else if(left < this._leftOrigin)
                {   
                    positiveBaseValues[i] = this._leftOrigin;
                    negativeBaseValues[i] = left;
                }
                else
                {
                    positiveBaseValues[i] = left;
                    negativeBaseValues[i] = this._leftOrigin;
                }
                left -= w;
            }
            else
            {
                if(left < this._leftOrigin)
                {
                    left = negativeBaseValues[i] - (this._leftOrigin - xcoords[i]);
                    w = negativeBaseValues[i] - left;
                    negativeBaseValues[i] = left;
                }
                else if(left > this._leftOrigin)
                {
                    left += (positiveBaseValues[i] - this._leftOrigin);
                    w = left - positiveBaseValues[i];
                    positiveBaseValues[i] = left;
                    left -= w;
                }
            }
            top -= h/2;        
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
    
    drawMarker: function(graphic, func, left, top, w, h)
    {
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

Y.StackedBarSeries = StackedBarSeries;
