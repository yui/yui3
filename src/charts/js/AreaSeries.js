/**
 * The AreaSeries class renders quantitative data on a graph by creating a fill between 0
 * and the relevant data points.
 *
 * @class AreaSeries
 * @extends CartesianSeries, Fills
 * @constructor
 */
Y.AreaSeries = Y.Base.create("areaSeries", Y.CartesianSeries, [Y.Fills], {
	/**
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
     * @private
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
     * @private
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
         * @private
         */
        type: {
            /**
             * Indicates the type of graph.
             */
            value:"area"
        }
    }
});



		

		
