YUI.add('graphics-drag-manual-tests', function(Y) {
    var suite = new Y.Test.Suite('graphics-drag-manual-tests example test suite');
    
    suite.add(new Y.Test.Case({
        name: "Manual Tests",

        "Test rectangle loaded" : function()
        {
            Y.Assert.isTrue((false), "Ensure there is yellow rectangle with black border on the page."); 
        },

        "Test Drag": function()
        {
            Y.Assert.isTrue((false), "Drag the rectangle and make sure it drags.");
        }
    }));

    Y.Test.Runner.add(suite);
}, '');

