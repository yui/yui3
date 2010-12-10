/**
 * The AreaSeries class renders quantitative data on a graph by creating a fill between 0
 * and the relevant data points.
 *
 * @class AreaSeries
 * @extends CartesianSeries
 * @uses Fills
 * @constructor
 */
Y.AreaSeries = Y.Base.create("areaSeries", Y.CartesianSeries, [Y.Fills], {
    /**
     * @protected
     *
     * Renders the series. 
     *
     * @method drawSeries
     */
    drawSeries: function()
    {
        this.get("graphic").clear();
        this.drawFill.apply(this, this._getClosingPoints());
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
        if(!val.area)
        {
            val = {area:val};
        }
        return Y.AreaSeries.superclass._setStyles.apply(this, [val]);
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
        var styles = this._mergeStyles({area:this._getAreaDefaults()}, Y.AreaSeries.superclass._getDefaultStyles());
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
         * @default area
         */
        type: {
            value:"area"
        }
    }
});



		

		
