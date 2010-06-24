function CandlestickSeries(config)
{
	CandlestickSeries.superclass.constructor.apply(this, arguments);
}

CandlestickSeries.NAME = "candlestickSeries";

CandlestickSeries.ATTRS = {
	type: {
        value: "candlestick"
    }
};

Y.extend(CandlestickSeries, Y.RangeSeries, {
    /**
     * @private
     */
    drawMarker: function(graphic, hloc, left, style)
    {
        var h = hloc.h,
            o = hloc.o,
            l = hloc.l,
            c = hloc.c,
            ht = Math.abs(c - o),
            w = style.width,
            fillColor,
            upFillColor = style.upFillColor,
            downFillColor = style.downFillColor,
            alpha,
            upAlpha = style.upFillAlpha,
            downAlpha = style.downFillAlpha,
            up = c < o,
            upFillType = style.upFillType || "solid",
            downFillType = style.downFillType || "solid",
            borderWidth = style.borderWidth,
            borderColor = style.borderColor,
            borderAlpha = style.borderAlpha || 1,
            colors,
            upColors = style.upColors,
            downColors = style.downColors,
            alphas,
            upAlphas = style.upAlphas || [],
            downAlphas = style.downAlphas || [],
            ratios,
            upRatios = style.upRatios || [],
            downRatios = style.downRatios || [],
            rotation,
            upRotation = style.upRotation || 0,
            downRotation = style.downRotation || 0,
            fillType = up ? upFillType : downFillType,
            top = c < o ? c : o,
            bottom = c < o ? o : c,
            center = left + w * 0.5;
        if(borderWidth > 0)
        {
            graphic.lineStyle(borderWidth, borderColor, borderAlpha);
        }
        if(fillType === "solid")
        {
            fillColor = up ? upFillColor : downFillColor;
            alpha = up ? upAlpha : downAlpha;
            graphic.beginFill(fillColor, alpha);
        }
        else
        {
            colors = up ? upColors : downColors;
            rotation = up ? upRotation : downRotation;
            ratios = up ? upRatios : downRatios;
            alphas = up ? upAlphas : downAlphas;
            graphic.beginGradientFill(fillType, colors, alphas, ratios, {rotation:rotation, width:w, height:ht});
        }
        if(top > h)
        {
            graphic.moveTo(center, h);
            graphic.lineTo(center, top);
        }
        graphic.drawRect(left, top, w, ht);
        if(l > c && l > o)
        {
            graphic.moveTo(center, bottom);
            graphic.lineTo(center, l);
        }
        graphic.end();
    },
	
	_getDefaultStyles: function()
    {
        return {
            marker: {
                upFillColor: "#ffffff",
                upFillAlpha: 1,
                borderColor:"#000000",
                borderWidth:1,
                borderAlpha:1,
                upColors:[],
                upAlphas:[],
                upRatios:[],
                upRotation:0,
                downFillColor: "#000000",
                downFillAlpha: 1,
                downBorderColor:"#000000",
                downBorderWidth:0,
                downBorderAlpha:1,
                downColors:[],
                downAlphas:[],
                downRatios:[],
                downRotation:0,
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

Y.CandlestickSeries = CandlestickSeries;
