YUI.add('charts-gridlines-manual-tests', function(Y) {
    var suite = new Y.Test.Suite('charts-gridlines-manual-tests example test suite');
    
    suite.add(new Y.Test.Case({
        name: "Manual Tests",

        "Test chart loaded" : function()
        {
            Y.Assert.isTrue((false), "Ensure there is a combo (lines and markers) chart with multiple series on the page."); 
        },

        "Test gridlines" : function()
        {
            Y.Assert.isTrue((false), "Ensure there are horizontal and vertical gridlines on the background of the chart."); 
        },
        
        "Test marker interactivity" : function()
        {
            Y.Assert.isTrue((false), "Mouse over markers and ensure a tooltip appears."); 
        }
    }));

    Y.Test.Runner.add(suite);
}, '');
