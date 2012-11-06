YUI.add('charts-globalstyles-manual-tests', function(Y) {
    var suite = new Y.Test.Suite('charts-globalstyles-manual-tests example test suite');
    
    suite.add(new Y.Test.Case({
        name: "Manual Tests",

        "Test chart loaded" : function()
        {
            Y.Assert.isTrue((false), "Ensure there is a combo (lines and markers) chart with multiple series on the page. The lines should be styles red, grey and black."); 
        },

        "Test axes styled" : function()
        {
            Y.Assert.isTrue((false), "Ensure all labels are red and rotated -45 degrees.");
        },

        "Test gridlines" : function()
        {
            Y.Assert.isTrue((false), "Ensure there are horizontal and vertical gridlines on the background of the chart."); 
        },
        
        "Test marker interactivity" : function()
        {
            Y.Assert.isTrue((false), "Drag the cursor horizontally accross the chart. When the cursor intersects with the vertical plane of the markers, a tooltip should display containing data for all series."); 
        }
    }));

    Y.Test.Runner.add(suite);
}, '');
