function StackedMarkerSeries(config)
{
	StackedMarkerSeries.superclass.constructor.apply(this, arguments);
}

StackedMarkerSeries.NAME = "stackedMarkerSeries";

StackedMarkerSeries.ATTRS = {
	type: {
		/**
		 * Indicates the type of graph.
		 */
        value:"stackedMarker"
    }
};

Y.extend(StackedMarkerSeries, Y.MarkerSeries, {
    setAreaData: function()
    {   
        StackedMarkerSeries.superclass.setAreaData.apply(this);
        this._stackCoordinates.apply(this);
    }
});

Y.StackedMarkerSeries = StackedMarkerSeries;
