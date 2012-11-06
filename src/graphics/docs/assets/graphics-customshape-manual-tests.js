YUI.add('graphics-customshape-manual-tests', function(Y) {
    var suite = new Y.Test.Suite('graphics-customshape-manual-tests example test suite');

    suite.add(new Y.Test.Case({
        name: "Manual Tests",

        "Test custom shape loaded" : function()
        {
            Y.Assert.isTrue((false), "Ensure there is an rounded rectangle with a gradient on the page."); 
        }
    }));

    Y.Test.Runner.add(suite);
}, '');

