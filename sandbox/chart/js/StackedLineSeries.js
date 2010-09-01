function StackedLineSeries(config)
{
	StackedLineSeries.superclass.constructor.apply(this, arguments);
}

StackedLineSeries.NAME = "stackedLineSeries";

StackedLineSeries.ATTRS = {
	type: {
		/**
		 * Indicates the type of graph.
		 */
        value:"stackedLine"
    }
};

Y.extend(StackedLineSeries, Y.LineSeries, {
    setAreaData: function()
    {   
        StackedLineSeries.superclass.setAreaData.apply(this);
        this._stackCoordinates.apply(this);
    }
});

Y.StackedLineSeries = StackedLineSeries;
