function StackedSplineSeries(config)
{
	StackedSplineSeries.superclass.constructor.apply(this, arguments);
}

StackedSplineSeries.NAME = "stackedSplineSeries";

StackedSplineSeries.ATTRS = {
	type: {
		/**
		 * Indicates the type of graph.
		 */
        value:"stackedSpline"
    }
};

Y.extend(StackedSplineSeries, Y.SplineSeries, {
    setAreaData: function()
    {   
        StackedSplineSeries.superclass.setAreaData.apply(this);
        this._stackCoordinates.apply(this);
    }
});

Y.StackedSplineSeries = StackedSplineSeries;
