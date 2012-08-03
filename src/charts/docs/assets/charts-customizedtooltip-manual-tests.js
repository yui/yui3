YUI.add('charts-customizedtooltip-manual-tests', function(Y) {
    var suite = new Y.Test.Suite('charts-customizedtooltip-manual-tests example test suite');
    
    suite.add(new Y.Test.Case({
        name: "Manual Tests",

        "Test chart loaded" : function()
        {
            Y.Assert.isTrue((false), "Ensure there is a bar chart on the page."); 
        },

        "Test marker interactivity" : function()
        {
            Y.Assert.isTrue((false), "Mouse over markers and ensure a tooltip appears. The tooltip should have light text and a dark background. The first line of text should be underlined and the second line should be bold."); 
        }
    }));
    
    Y.Test.Runner.add(suite);
}, '');

