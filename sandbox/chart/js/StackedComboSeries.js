Y.StackedComboSeries = Y.Base.create("stackedComboSeries", Y.ComboSeries, [], {
    setAreaData: function()
    {   
        Y.StackedComboSeries.superclass.setAreaData.apply(this);
        this._stackCoordinates.apply(this);
    },
	
    drawSeries: function()
    {
        this.get("graphic").clear();
        if(this.get("showAreaFill"))
        {
            this.drawFill.apply(this, this._getStackedClosingPoints());
        }
        if(this.get("showLines")) 
        {
            this.drawLines();
        }
        if(this.get("showMarkers"))
        {
            this.drawPlots();
        }   
    }
    
}, {
    ATTRS : {
        type: {
            value: "stackedCombo"
        },

        showAreaFill: {
            value: true
        }
    }
});
