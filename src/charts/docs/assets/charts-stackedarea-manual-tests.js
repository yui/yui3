YUI.add('charts-stackedarea-manual-tests', function(Y) {
    var suite = new Y.Test.Suite('charts-stackedarea-manual-tests example test suite');
    
    suite.add(new Y.Test.Case({
        name: "Manual Tests",

        "Test chart loaded" : function()
        {
            Y.Assert.isTrue((false), "Ensure there is a stacked area chart on the page."); 
        },

        "Test planar interactivity" : function()
        {
            Y.Assert.isTrue((false), "Drag the cursor horizontally accross the chart. When the correct plane is crossed a tooltip should be containing data for all series."); 
        }
    }));

    Y.Test.Runner.add(suite);
}, '');
