YUI.add('charts-timeaxis-manual-tests', function(Y) {
    var suite = new Y.Test.Suite('charts-timeaxis-manual-tests example test suite');
    
    suite.add(new Y.Test.Case({
        name: "Manual Tests",

        "Test chart loaded" : function()
        {
            Y.Assert.isTrue((false), "Ensure there is a combo (lines and markers) chart with multiple series on the page."); 
        },

        "Test time axis" : function()
        {
            Y.Assert.isTrue((false), "Ensure there is a time axis at the bottom of the chart. The labels should have a rotation of -45 degrees."); 
        },
        
        "Test marker interactivity" : function()
        {
            Y.Assert.isTrue((false), "Mouse over markers and ensure a tooltip appears."); 
        }
    }));

    Y.Test.Runner.add(suite);
}, '');

