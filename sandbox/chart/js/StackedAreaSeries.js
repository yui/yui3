function StackedAreaSeries(config)
{
	StackedAreaSeries.superclass.constructor.apply(this, arguments);
}

StackedAreaSeries.NAME = "stackedAreaSeries";

StackedAreaSeries.ATTRS = {
	type: {
		/**
		 * Indicates the type of graph.
		 */
        value:"stackedArea"
    }
};

Y.extend(StackedAreaSeries, Y.AreaSeries, {
    setAreaData: function()
    {   
        StackedAreaSeries.superclass.setAreaData.apply(this);
        this._stackCoordinates.apply(this);
    },

	drawSeries: function()
    {
        this.get("graphic").clear();
        this.drawFill.apply(this, this._getStackedClosingPoints());
    }
});

Y.StackedAreaSeries = StackedAreaSeries;
