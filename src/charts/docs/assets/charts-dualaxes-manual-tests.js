YUI.add('charts-dualaxes-manual-tests', function(Y) {
    var suite = new Y.Test.Suite('charts-dualaxes-manual-tests example test suite');
    
    suite.add(new Y.Test.Case({
        name: "Manual Tests",

        "Test chart loaded" : function()
        {
            Y.Assert.isTrue((false), "Ensure there is a combo (lines and markers) chart with multiple series on the page. There should be a numerica axis on either side of the chart."); 
        },

        "Test marker interactivity" : function()
        {
            Y.Assert.isTrue((false), "Mouse over markers and ensure a tooltip appears. The data in the tooltip of the yellow series should correspond to the right axis. The data in the tooltip of the blue series should correspond to the axis on the left."); 
        }
    }));

    Y.Test.Runner.add(suite);
}, '');

