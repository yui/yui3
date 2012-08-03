YUI.add('graphics-path-manual-tests', function(Y) {
    var suite = new Y.Test.Suite('graphics-path-manual-tests example test suite');

    suite.add(new Y.Test.Case({
        name: "Manual Tests",

        "Test paths loaded" : function()
        {
            Y.Assert.isTrue((false), "Ensure there are two black bordered red diamonds connected by a dashed line segment on the page."); 
        }
    }));

    Y.Test.Runner.add(suite);
}, '');

