Y.AreaSeries = Y.Base.create("areaSeries", Y.CartesianSeries, [Y.Fills], {
	drawSeries: function()
    {
        this.get("graphic").clear();
        this.drawFill();
    },
	
	_getDefaultStyles: function()
    {
        return {
            color: "#000000",
            alpha: 1,
            padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }
        };
    }
},
{
    ATTRS: {
        type: {
            /**
             * Indicates the type of graph.
             */
            value:"area"
        },
        direction: {
            value:"horizontal"
        },
        
        styles: {
            getter: function()
            {
                return this.get("area");
            },

            setter: function(val)
            {
                this.set("area", val);
            }
        }
    }
});



		

		
