Y.ComboSeries = Y.Base.create("comboSeries", Y.CartesianSeries, [Y.Fills, Y.Lines, Y.Plots], {
	drawSeries: function()
    {
        this.get("graphic").clear();
        if(this.get("showAreaFill"))
        {
            this.drawFill.apply(this, this._getClosingPoints());
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
},
{
    ATTRS: {
        type: {
            /**
             * Indicates the type of graph.
             */
            value:"combo"
        },

        showAreaFill: {
            value: false
        },

        showLines: {
            value: true
        },

        showMarkers: {
            value: true
        },

        styles: {
            getter: function()
            {
                var styles = this._styles || this._getDefaultStyles();
                styles.marker = this.get("marker");
                styles.line = this.get("line");
                styles.area = this.get("area");
                styles.padding = this.get("padding");
                return styles;
            },

            setter: function(val)
            {
                var col = {area:"area", line:"line", marker:"marker", padding:"padding"}, i;
                for(i in col)
                {
                    if(val.hasOwnProperty(i))
                    {
                        this.set(i, val[i]);
                    }
                }
                this.styles = val;
            }
        }
    }
});



		

		
