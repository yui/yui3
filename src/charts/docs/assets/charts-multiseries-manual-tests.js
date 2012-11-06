YUI.add('charts-multiseries-manual-tests', function(Y) {
    var suite = new Y.Test.Suite('charts-multiseries-manual-tests example test suite');
    
    suite.add(new Y.Test.Case({
        name: "Manual Tests",

        "Test chart loaded" : function()
        {
            Y.Assert.isTrue((false), "Ensure there is a combo (lines and markers) chart with multiple series on the page."); 
        },

        "Test marker interactivity" : function()
        {
            Y.Assert.isTrue((false), "Mouse over markers and ensure a tooltip appears."); 
        }
    }));

    Y.Test.Runner.add(suite);
}, '');

