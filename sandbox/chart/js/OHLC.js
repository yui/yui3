function OHLCSeries(config)
{
	OHLCSeries.superclass.constructor.apply(this, arguments);
}

OHLCSeries.NAME = "ohlcSeries";

OHLCSeries.ATTRS = {
	type: {
        value: "ohlc"
    }
};

Y.extend(OHLCSeries, Y.RangeSeries, {
	/**
	 * @private
	 */
    drawMarker: function(graphic, hloc, left, style)
    {
        var h = hloc.h,
            o = hloc.o,
            l = hloc.l,
            c = hloc.c,
            w = style.width,
            color,
            upColor = style.upColor,
            downColor = style.downColor,
            alpha,
            upAlpha = style.upAlpha,
            downAlpha = style.downAlpha,
            up = c < o,
            thickness = style.thickness,
            center = left + w * 0.5;
            color = up ? upColor : downColor;
            alpha = up ? upAlpha : downAlpha;
        graphic.lineStyle(thickness, color, alpha);
        graphic.moveTo(left, o);
        graphic.lineTo(center, o);
        graphic.moveTo(center, h);
        graphic.lineTo(center, l);
        graphic.moveTo(center, c);
        graphic.lineTo(left + w, c);
        graphic.end();
    },
	
	/**
	 * @private
	 */
	_getDefaultStyles: function()
    {
        return {
            marker: {
                upColor: "#aaaaaa",
                upAlpha: 1,
                thickness:1,
                borderAlpha:1,
                downColor: "#000000",
                downAlpha: 1,
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

Y.OHLCSeries = OHLCSeries;
