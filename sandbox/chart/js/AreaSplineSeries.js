Y.AreaSplineSeries = Y.Base.create("areaSplineSeries", Y.CartesianSeries, [Y.Fills], {
	/**
	 * @private
	 */
	drawSeries: function()
	{
        this.get("graphic").clear();
        this.drawAreaSpline();
    }
}, {
	ATTRS : {
        type: {
            /**
             * Indicates the type of graph.
             */
            value:"areaSpline"
        }
    }
});

