function RangeSeries(config)
{
	RangeSeries.superclass.constructor.apply(this, arguments);
}

RangeSeries.NAME = "rangeSeries";

RangeSeries.ATTRS = {
	type: {
        value: "range"
    }
};

Y.extend(RangeSeries, Y.CartesianSeries, {
	/**
	 * @private
	 */
	setAreaData: function()
	{
        var nextX, nextY,
            node = Y.Node.one(this._parentNode).get("parentNode"),
			w = node.get("offsetWidth"),
            h = node.get("offsetHeight"),
            padding = this.get("styles").padding,
			leftPadding = padding.left,
			topPadding = padding.top,
            xAxis = this.get("xAxis"),
            yAxis = this.get("yAxis"),
			xKey = this.get("xKey"),
			yKey = this.get("yKey"),
			xData = xAxis.getDataByKey(xKey).concat(),
			yData = yAxis.getDataByKey(yKey).concat(),
            xOffset = xAxis.getEdgeOffset(xData.length, w),
			dataWidth = w - (leftPadding + padding.right + xOffset),
			dataHeight = h - (topPadding + padding.bottom),
			xcoords = [],
			ycoords = [],
			xMax = xAxis.get("maximum"),
			xMin = xAxis.get("minimum"),
			yMax = yAxis.get("maximum"),
			yMin = yAxis.get("minimum"),
			xScaleFactor = dataWidth / (xMax - xMin),
			yScaleFactor = dataHeight / (yMax - yMin),
			dataLength = xData.length, 	
            i,
            yValues;
        xOffset *= 0.5;
        this.get("graphic").setSize(w, h);
        this._leftOrigin = Math.round(((0 - xMin) * xScaleFactor) + leftPadding);
        this._bottomOrigin =  Math.round((dataHeight + topPadding) - (0 - yMin) * yScaleFactor);
        for (i = 0; i < dataLength; ++i) 
		{
            yValues = yData[i];
            nextX = Math.round((((xData[i] - xMin) * xScaleFactor) + leftPadding + xOffset));
			nextY = {
                h: Math.round(((dataHeight + topPadding) - (yValues.high - yMin) * yScaleFactor)),
                l: Math.round(((dataHeight + topPadding) - (yValues.low - yMin) * yScaleFactor)),
                o: Math.round(((dataHeight + topPadding) - (yValues.open - yMin) * yScaleFactor)),
                c: Math.round(((dataHeight + topPadding) - (yValues.close - yMin) * yScaleFactor))
            };
            xcoords.push(nextX);
            ycoords.push(nextY);
        }
        this.set("xcoords", xcoords);
		this.set("ycoords", ycoords);
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
        var graphic = this.get("graphic"),
            style = this.get("styles").marker,
            w = style.width,
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            i = 0,
            len = xcoords.length,
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
            hloc;
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
            hloc = ycoords[i];
            left = xcoords[i] + offset;
            this.drawMarker(graphic, hloc, left, style);
        }
 	}
});

Y.RangeSeries = RangeSeries;
