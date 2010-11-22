Y.SplineSeries = Y.Base.create("splineSeries",  Y.CartesianSeries, [Y.CurveUtil, Y.Lines], {
	/**
	 * @private
	 */
	drawSeries: function()
	{
        this.get("graphic").clear();
        this.drawSpline();
    }
}, {
	ATTRS : {
        type : {
            /**
             * Indicates the type of graph.
             */
            value:"spline"
        }
    }
});



		

		
