YUI.add('charts-pie-manual-tests', function(Y) {
    var suite = new Y.Test.Suite('charts-pie-manual-tests example test suite');
    
    suite.add(new Y.Test.Case({
        name: "Manual Tests",

        "Test chart loaded" : function()
        {
            Y.Assert.isTrue((false), "Ensure there is a pie chart on the page."); 
        },

        "Test marker interactivity" : function()
        {
            Y.Assert.isTrue((false), "Mouse over pie slices and ensure a tooltip appears."); 
        }
    }));

    Y.Test.Runner.add(suite);
}, '');
