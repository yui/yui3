Y.StackedMarkerSeries = Y.Base.create("stackedMarkerSeries", Y.MarkerSeries, [Y.StackingUtil], {
    setAreaData: function()
    {   
        Y.StackedMarkerSeries.superclass.setAreaData.apply(this);
        this._stackCoordinates.apply(this);
    }
}, {
    ATTRS: {
        /**
         * Indicates the type of graph.
         */
        type: {
            value:"stackedMarker"
        }
    }
});

