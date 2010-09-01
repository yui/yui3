Y.ComboSplineSeries = Y.Base.create("comboSplineSeries", Y.ComboSeries, [], {
	drawSeries: function()
    {
        this.get("graphic").clear();
        if(this.get("showAreaFill"))
        {
            this.drawAreaSpline();
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
        type: {
            value : "comboSpline"
        }
    }
});
