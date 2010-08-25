Y.MarkerSeries = Y.Base.create("markerSeries", Y.CartesianSeries, [Y.Plots], {
    /**
     * @private
     */
    renderUI: function()
    {
        this._setNode();
    },
    /**
     * @private
     */
	drawSeries: function()
	{
        this.drawPlots();
    },

	_getDefaultStyles: function()
    {
        return {
            fill:{
                type: "solid",
                alpha: 1,
                colors:null,
                alphas: null,
                ratios: null
            },
            border:{
                weight: 1,
                alpha: 1
            },
            width: 6,
            height: 6,
            shape: "circle",

            padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }
        };
    }
},{
    ATTRS : {
        type: {
            /**
             * Indicates the type of graph.
             */
            value:"marker"
        }
    }
});

