YUI.add('charts-groupmarkers-manual-tests', function(Y) {
    var suite = new Y.Test.Suite('charts-groupmarkers-manual-tests example test suite');
    
    suite.add(new Y.Test.Case({
        name: "Manual Tests",

        "Test chart loaded" : function()
        {
            Y.Assert.isTrue((false), "Ensure there is a combo (lines and markers) chart with two series on the page."); 
        },

        "Test marker interactivity" : function()
        {
            Y.Assert.isTrue((false), "Mouse over the chart to ensure a tooltip appears. The tooltip should contain the corresponding data for both series."); 
        }
    }));

    Y.Test.Runner.add(suite);
}, '');

