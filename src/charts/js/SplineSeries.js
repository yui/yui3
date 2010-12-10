Y.SplineSeries = Y.Base.create("splineSeries",  Y.CartesianSeries, [Y.CurveUtil, Y.Lines], {
    /**
     * @protected
     *
     * Draws the series.
     *
     * @method drawSeries
     */
    drawSeries: function()
    {
        this.get("graphic").clear();
        this.drawSpline();
    }
}, {
	ATTRS : {
        /**
         * Read-only attribute indicating the type of series.
         *
         * @attribute type
         * @type String
         * @default spline
         */
        type : {
            value:"spline"
        }
    }
});



		

		
