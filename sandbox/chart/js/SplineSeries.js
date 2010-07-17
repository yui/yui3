function SplineSeries(config)
{
	SplineSeries.superclass.constructor.apply(this, arguments);
}

SplineSeries.NAME = "splineSeries";

SplineSeries.ATTRS = {
	type: {
		/**
		 * Indicates the type of graph.
		 */
        value:"spline"
    }
};

Y.extend(SplineSeries, Y.CartesianSeries, {
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
            curvecoords = this.getCurveControlPoints(xcoords, ycoords),
			len = curvecoords.length,
            cx1,
            cx2,
            cy1,
            cy2,
            x,
            y,
            i = 0,
			styles = this.get("styles"),
			graphic = this.get("graphic");
        graphic.clear();
        graphic.lineStyle(styles.weight, styles.color);
        graphic.moveTo(xcoords[0], ycoords[0]);
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
        graphic.end();
	},
    
	_getDefaultStyles: function()
    {
        return {
            color: "#000000",
            alpha: 1,
            weight: 1,
            padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }
        };
    }
});

Y.SplineSeries = SplineSeries;


		

		
