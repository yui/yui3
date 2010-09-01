Y.StackedComboSplineSeries = Y.Base.create("stackedComboSplineSeries", Y.StackedComboSeries, [], {
	drawSeries: function()
    {
        this.get("graphic").clear();
        if(this.get("showAreaFill"))
        {
            this.drawStackedAreaSpline();
        }
        if(this.get("showLines")) 
        {
            this.drawSpline();
        }
        if(this.get("showMarkers"))
        {
            this.drawPlots();
        }   
    }
}, {
    ATTRS: {
        type : {
            value : "stackedComboSpline"
        },

        showAreaFill: {
            value: true
        }
    }
});
