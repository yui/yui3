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
    }
},{
    ATTRS : {
        type: {
            /**
             * Indicates the type of graph.
             */
            value:"marker"
        },
        
        styles: {
            getter: function()
            {
                var styles = this.get("marker");
                styles.padding = this.get("padding");
            },
            
            setter: function(val)
            {
                this.set("marker", val);
                if(val.hasOwnProperty("padding"))
                {
                    this.set("padding", val.padding);
                }
            }
        }
    }
});

