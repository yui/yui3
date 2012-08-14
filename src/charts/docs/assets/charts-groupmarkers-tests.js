YUI.add('charts-groupmarkers-tests', function(Y) {
    var suite = new Y.Test.Suite('charts-groupmarkers-tests example test suite'),
        _getClassName = Y.ClassNameManager.getClassName,
        CHART_BOUNDINGBOX = "." + _getClassName("cartesianchart"),
        CHART_CONTENTBOX = "." + _getClassName("cartesianchart-content"),
        CHART_SERIESMARKER = "." + _getClassName("circleGroup"),
        TOTAL_MARKERS = 2,
        ONE = 1;

    suite.add(new Y.Test.Case({
        name: "Charts GroupMarkers Tests",

        testChartLoaded : function()
        {
            var boundingBox = Y.all(CHART_BOUNDINGBOX),
                contentBox = Y.all(CHART_CONTENTBOX); 
            Y.Assert.areEqual(ONE, boundingBox.size(), "There should be one chart bounding box.");
            Y.Assert.areEqual(ONE, contentBox.size(), "There should be one chart contentBox.");
        },

        testSeriesMarkerLoaded : function()
        {
            var seriesMarkers = Y.all(CHART_SERIESMARKER);
            Y.Assert.areEqual(TOTAL_MARKERS, seriesMarkers.size(), "There should be " + TOTAL_MARKERS + " markers.");
        }
    }));

    Y.Test.Runner.add(suite);
}, '' ,{requires:['classnamemanager', 'node', 'event-simulate']});

