Y.LineSeries = Y.Base.create("lineSeries", Y.CartesianSeries, [Y.Lines], {
	drawSeries: function()
    {
        this.get("graphic").clear();
        this.drawLines();
    }
},
{
    ATTRS: {
        type: {
            /**
             * Indicates the type of graph.
             */
            value:"line"
        },

        styles: {
            getter: function()
            {
                var styles = this.get("line");
                styles.padding = this.get("padding");
            },

            setter: function(val)
            {
                this.set("line", val);
                if(val.hasOwnProperty("padding"))
                {
                    this.set("padding", val.padding);
                }
            }
        }
    }
});



		

		
