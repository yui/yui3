Y.StackedAreaSplineSeries = Y.Base.create("stackedAreaSplineSeries", Y.AreaSeries, [], {
	/**
	 * @private
	 */
	drawSeries: function()
	{
        this.get("graphic").clear();
        this._stackCoordinates();
        this.drawStackedAreaSpline();
    }
}, {
    ATTRS : {
        type: {
            /**
             * Indicates the type of graph.
             */
            value:"stackedAreaSpline"
        }
    }
});

