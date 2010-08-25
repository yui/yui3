
Y.LineSeries = Y.Base.create("lineSeries", Y.CartesianSeries, [Y.Lines], {
	drawSeries: function()
    {
        this.drawLines();
    },

	_getDefaultStyles: function()
    {
        return {
            alpha: 1,
            weight: 1,
            marker: {
                alpha: 1,
                weight: 1,
                width: 6,
                height: 6
            },
            showMarkers: false,
            showLines: true,
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
            value:"line"
        }
    }

});



		

		
