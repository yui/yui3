YUI.add('charts-legend-manual-tests', function(Y) {
    var suite = new Y.Test.Suite('charts-legend-manual-tests example test suite');
    
    suite.add(new Y.Test.Case({
        name: "Manual Tests",

        "Test chart loaded" : function()
        {
            Y.Assert.isTrue((false), "Ensure there is a combo (lines and markers) chart with multiple series on the page."); 
        },

        "Test legend loaded" : function()
        {
            Y.Assert.isTrue((false), "Ensure there is a legend to the right of the chart. The colors in the legend should correspond to the series colors of the chart."); 
        },
        
        "Test marker interactivity" : function()
        {
            Y.Assert.isTrue((false), "Mouse over markers and ensure a tooltip appears. The series value name in the tooltip should correspond to the legend item with a bullet that is the same color as the series that triggered the tooltip."); 
        }
    }));

    Y.Test.Runner.add(suite);
}, '');

