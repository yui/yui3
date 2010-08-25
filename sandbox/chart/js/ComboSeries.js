Y.ComboSeries = Y.Base.create("comboSeries", Y.CartesianSeries, [Y.Fills, Y.Lines, Y.Plots], {
	drawSeries: function()
    {
        if(this.get("showFill"))
        {
            this.drawFill();
        }
        if(this.get("showLines")) 
        {
            this.drawLines();
        }
        if(this.get("showMarkers"))
        {
            this.drawPlots();
        }   
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
            alpha: 1,
            weight: 1,
            lineType:"solid", 
            dashLength:10, 
            gapSpace:10, 
            connectDiscontinuousPoint:true, 
            discontinuousType:"dashed", 
            discontinuousDashLength:10, 
            discontinuousGapSpace:10,
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
            value:"combo"
        },

        showFill: {
            value: false
        },

        showLines: {
            value: true
        },

        showMarkers: {
            value: true
        }
    }

});



		

		
