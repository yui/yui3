YUI.add('graphics-simple-manual-tests', function(Y) {
    var suite = new Y.Test.Suite('graphics-simple-manual-tests example test suite');

    suite.add(new Y.Test.Case({
        name: "Manual Tests",

        "Test ellipse loaded" : function()
        {
            Y.Assert.isTrue((false), "Ensure there is an ellipse on the page."); 
        }
    }));

    Y.Test.Runner.add(suite);
}, '');

