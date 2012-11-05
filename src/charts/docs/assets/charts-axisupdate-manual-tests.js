YUI.add('charts-axisupdate-manual-tests', function(Y) {
    var suite = new Y.Test.Suite('charts-axisupdate-manual-tests example test suite');
    
    suite.add(new Y.Test.Case({
        name: "Manual Tests",

        "Test chart loaded" : function()
        {
            Y.Assert.isTrue((false), "Ensure there is a column chart on the page. There should be a category axis on the bottom of the chart. There should be a numeric axis to the right."); 
        },

        "Test marker interactivity" : function()
        {
            Y.Assert.isTrue((false), "Mouse over markers and ensure a tooltip appears."); 
        },

        "Test category axis update" : function()
        {
            Y.Assert.isTrue((false), "Select dateRange from the drop down menu. Enter a hex color value in the color field and numeric value between -90 and 90 in the rotation field. When the Update Axis button is pressed, the labels in the category (bottom) axis should update to reflect the values entered.");
        },

        "Test numeric axis update" : function()
        {
            Y.Assert.isTrue((false), "Select financials from the drop down menu. Enter a hex color value in the color field and numeric value between -90 and 90 in the rotation field. When the Update Axis button is pressed, the labels in the numeric (right) axis should update to reflect the values entered.");
        }
    }));

    Y.Test.Runner.add(suite);
}, '');

