YUI.add('graphics-muddyglass-manual-tests', function(Y) {
    var suite = new Y.Test.Suite('graphics-muddyglass-manual-tests example test suite');

    suite.add(new Y.Test.Case({
        name: "Manual Tests",

        "Test glass" : function()
        {
            Y.Assert.isTrue((false), "Ensure there is a transparent glass with chocolate milk on the page. Note: IE 6 - 8 does not support transparency."); 
        }
    }));

    Y.Test.Runner.add(suite);
}, '');

