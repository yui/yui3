YUI.add('graphics-gradients-manual-tests', function(Y) {
    var suite = new Y.Test.Suite('graphics-gradients-manual-tests example test suite');
    
    suite.add(new Y.Test.Case({
        name: "Manual Tests",

        "Test rectangle loaded" : function()
        {
            Y.Assert.isTrue((false), "Ensure there is a rectangle with a linear gradient on the page."); 
        },

        "Test circle loaded": function()
        {
            Y.Assert.isTrue((false), "Ensure there is a circle with a radial gradient on the page.");
        }
    }));

    Y.Test.Runner.add(suite);
}, '' ,{requires:['classnamemanager', 'node']});

