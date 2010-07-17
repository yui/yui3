function StackedAreaSplineSeries(config)
{
	StackedAreaSplineSeries.superclass.constructor.apply(this, arguments);
}

StackedAreaSplineSeries.NAME = "stackedAreaSplineSeries";

StackedAreaSplineSeries.ATTRS = {
	type: {
		/**
		 * Indicates the type of graph.
		 */
        value:"stackedAreaSpline"
    }
};

Y.extend(StackedAreaSplineSeries, Y.CartesianSeries, {
	/**
	 * @private
	 */
	drawSeries: function()
	{
        if(this.get("xcoords").length < 1) 
		{
			return;
		}
        var xcoords = this.get("xcoords"),
			ycoords = this.get("ycoords"),
            curvecoords,
            order = this.get("order"),
            type = this.get("type"),
            graph = this.get("graph"),
            seriesCollection = graph.seriesTypes[type],
            prevXCoords,
            prevYCoords,
			len,
            cx1,
            cx2,
            cy1,
            cy2,
            x,
            y,
            i = 0,
			firstX,
            firstY,
            styles = this.get("styles"),
			graphic = this.get("graphic");
        this._stackCoordinates();
		firstX = xcoords[0];
        firstY = ycoords[0];
        curvecoords = this.getCurveControlPoints(xcoords, ycoords);
        len = curvecoords.length;
        graphic.clear();
        graphic.beginFill(styles.color, styles.alpha);
        graphic.moveTo(firstX, firstY);
        for(; i < len; i = ++i)
		{
            x = curvecoords[i].endx;
            y = curvecoords[i].endy;
            cx1 = curvecoords[i].ctrlx1;
            cx2 = curvecoords[i].ctrlx2;
            cy1 = curvecoords[i].ctrly1;
            cy2 = curvecoords[i].ctrly2;
            graphic.curveTo(cx1, cy1, cx2, cy2, x, y);
        }
        if(order > 0)
        {
            prevXCoords = seriesCollection[order - 1].get("xcoords").concat().reverse();
            prevYCoords = seriesCollection[order - 1].get("ycoords").concat().reverse();
            curvecoords = this.getCurveControlPoints(prevXCoords, prevYCoords);
            i = 0;
            len = curvecoords.length;
            graphic.lineTo(prevXCoords[0], prevYCoords[0]);
            for(; i < len; i = ++i)
            {
                x = curvecoords[i].endx;
                y = curvecoords[i].endy;
                cx1 = curvecoords[i].ctrlx1;
                cx2 = curvecoords[i].ctrlx2;
                cy1 = curvecoords[i].ctrly1;
                cy2 = curvecoords[i].ctrly2;
                graphic.curveTo(cx1, cy1, cx2, cy2, x, y);
            }
        }
        else
        {
            if(this.get("direction") === "vertical")
            {
                graphic.lineTo(this._leftOrigin, ycoords[ycoords.length-1]);
                graphic.lineTo(this._leftOrigin, firstY);
            }
            else
            {
                graphic.lineTo(xcoords[xcoords.length-1], this._bottomOrigin);
                graphic.lineTo(firstX, this._bottomOrigin);
            }

        }
        graphic.lineTo(firstX, firstY);
        graphic.end();
	},

	_getDefaultStyles: function()
    {
        return {
            color: "#000000",
            alpha: 1,
            padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }
        };
    }
});

Y.StackedAreaSplineSeries = StackedAreaSplineSeries;
