YUI.add('graphics-transforms-manual-tests', function(Y) {
    var suite = new Y.Test.Suite('graphics-transforms-manual-tests example test suite');

    suite.add(new Y.Test.Case({
        name: "Manual Tests",

        "Test circle loaded" : function()
        {
            Y.Assert.isTrue((false), "Ensure is a circle with a blue fill and light stroke on the page."); 
        },

        "Test rectangle loaded" : function()
        {
            Y.Assert.isTrue((false), "Ensure is a rectangle with a pink fill and black stroke on the page."); 
        },
        
        "Test ellipse loaded" : function()
        {
            Y.Assert.isTrue((false), "Ensure is a ellipse with a red fill and grey stroke on the page."); 
        },
        
        "Test rotation" : function()
        {
            Y.Assert.isTrue((false), "Press the button labeled rotate and ensure the rectangle and ellipse rotate 45 degrees."); 
        },
        
        "Test translate" : function()
        {
            Y.Assert.isTrue((false), "Press the button labeled translate and ensure the circle moves down and to the right."); 
        }
    }));

    Y.Test.Runner.add(suite);
}, '');

