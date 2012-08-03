YUI.add('graphics-violin-manual-tests', function(Y) {
    var suite = new Y.Test.Suite('graphics-violin-manual-tests example test suite');

    suite.add(new Y.Test.Case({
        name: "Manual Tests",

        "Test violin" : function()
        {
            Y.Assert.isTrue((false), "Ensure there is a picture of a violin on the page."); 
        }
    }));

    Y.Test.Runner.add(suite);
}, '');

