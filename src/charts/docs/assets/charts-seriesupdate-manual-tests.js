YUI.add('charts-seriesupdate-manual-tests', function(Y) {
    var suite = new Y.Test.Suite('charts-seriesupdate-manual-tests example test suite');
    
    suite.add(new Y.Test.Case({
        name: "Manual Tests",

        "Test chart loaded" : function()
        {
            Y.Assert.isTrue((false), "Ensure there is a bar chart on the page."); 
        },

        "Test marker interactivity" : function()
        {
            Y.Assert.isTrue((false), "Mouse over markers and ensure a tooltip appears."); 
        },

        "Test expenses series update" : function()
        {
            Y.Assert.isTrue((false), "Select expenses from the drop down menu. Enter a hex color value in the fill color and border color fields. Enter a numeric value between 1 and 3 in the border weight field. When the Update Series button is pressed, the bars in the expenses series should update to reflect the values entered.");
        },

        "Test revenue series update" : function()
        {
            Y.Assert.isTrue((false), "Select revenue from the drop down menu. Enter a hex color value in the fill color and border color fields. Enter a numeric value between 1 and 3 in the border weight field. When the Update Series button is pressed, the bars in the revenue series should update to reflect the values entered.");
        }
    }));

    Y.Test.Runner.add(suite);
}, '');

