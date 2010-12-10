/**
 * AreaSplineSeries renders an area graph with data points connected by a curve.
 *
 * @class AreaSplineSeries
 * @constructor
 * @extends CartesianSeries
 * @uses Fills
 * @uses CurveUtil
 */
Y.AreaSplineSeries = Y.Base.create("areaSplineSeries", Y.CartesianSeries, [Y.Fills, Y.CurveUtil], {
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
        this.drawAreaSpline();
    }
}, {
	ATTRS : {
        /**
         * Read-only attribute indicating the type of series.
         *
         * @attribute type
         * @type String
         * @default areaSpline
         */
        type: {
            value:"areaSpline"
        }
    }
});

