/**
 * The LineSeries class renders quantitative data on a graph by connecting relevant data points.
 *
 * @class LineSeries
 * @extends CartesianSeries
 * @uses Lines
 * @constructor
 */
Y.LineSeries = Y.Base.create("lineSeries", Y.CartesianSeries, [Y.Lines], {
    /**
     * @protected
     *
     * @method drawSeries
     */
    drawSeries: function()
    {
        this.get("graphic").clear();
        this.drawLines();
    },

    /**
     * @protected
     *
     * Method used by <code>styles</code> setter. Overrides base implementation.
     *
     * @method _setStyles
     * @param {Object} newStyles Hash of properties to update.
     * @return Object
     */
    _setStyles: function(val)
    {
        if(!val.line)
        {
            val = {line:val};
        }
        return Y.LineSeries.superclass._setStyles.apply(this, [val]);
    },

    /**
     * @protected
     *
     * Gets the default value for the <code>styles</code> attribute. Overrides
     * base implementation.
     *
     * @method _getDefaultStyles
     * @return Object
     */
    _getDefaultStyles: function()
    {
        var styles = this._mergeStyles({line:this._getLineDefaults()}, Y.LineSeries.superclass._getDefaultStyles());
        return styles;
    }
},
{
    ATTRS: {
        /**
         * Read-only attribute indicating the type of series.
         *
         * @attribute type
         * @type String
         * @default line
         */
        type: {
            value:"line"
        }

        /**
         * Style properties used for drawing lines. This attribute is inherited from <code>Renderer</code>. Below are the default values:
         *  <table width="100%">
         *      <tr><th>NAME</th><th>DESCRIPTION</th><th>VALUE</th></tr>
         *      <tr><td>color:</td><td>The color of the line.</td><td>The default value is determined by the order of the series on the graph. The color will be
         *      retrieved from the following array: 
         *      <code>["#426ab3", "#d09b2c", "#000000", "#b82837", "#b384b5", "#ff7200", "#779de3", "#cbc8ba", "#7ed7a6", "#007a6c"]</code>
         *      <tr><td>weight:</td><td>Number that indicates the width of the line.</td><td>6</td></tr>
         *      <tr><td>alpha:</td><td>Number between 0 and 1 that indicates the opacity of the line.</td><td>1</td></tr>
         *      <tr><td>lineType:</td><td>Indicates whether the line is solid or dashed.</td><td>solid</td></tr> 
         *      <tr><td>dashLength:</td><td>When the <code>lineType</code> is dashed, indicates the length of the dash.</td><td>10</td></tr>
         *      <tr><td>gapSpace:</td><td>When the <code>lineType</code> is dashed, indicates the distance between dashes.</td><td>10</td></tr>
         *      <tr><td>connectDiscontinuousPoints:</td><td>Indicates whether or not to connect lines when there is a missing or null value between points.</td><td>true</td></tr> 
         *      <tr><td>discontinuousType:</td><td>Indicates whether the line between discontinuous points is solid or dashed.</td><td>solid</td></tr>
         *      <tr><td>discontinuousDashLength:</td><td>When the <code>discontinuousType</code> is dashed, indicates the length of the dash.</td><td>10</td></tr>
         *      <tr><td>discontinuousGapSpace:</td><td>When the <code>discontinuousType</code> is dashed, indicates the distance between dashes.</td><td>10</td></tr>
         *  </table>
         *
         * @attribute styles
         * @type Object
         */
    }
});



		

		
