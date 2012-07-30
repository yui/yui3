YUI.add('charts-objectstyles-manual-tests', function(Y) {
    var suite = new Y.Test.Suite('charts-objectstyles-manual-tests example test suite');
    
    suite.add(new Y.Test.Case({
        name: "Manual Tests",

        "Test chart loaded" : function()
        {
            Y.Assert.isTrue((false), "Ensure there is a column chart with a single combo (line and markers) series on the page. The columns should be purple and grey. The line and its markers should be orange."); 
        },

        "Test axes" : function()
        {
            Y.Assert.isTrue((false), "Ensure the bottom axis' labels have a rotation of -45 degrees. Ensure the numeric axis is on the right of the chart."); 
        },

        "Test marker interactivity" : function()
        {
            Y.Assert.isTrue((false), "Mouse over markers and ensure a tooltip appears."); 
        }
    }));
    
    Y.Test.Runner.add(suite);
}, '');

