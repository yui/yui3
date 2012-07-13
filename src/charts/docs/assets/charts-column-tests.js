YUI.add('charts-column-tests', function(Y) {
    var suite = new Y.Test.Suite('charts-column-tests example test suite'),
        _getClassName = Y.ClassNameManager.getClassName,
        CHART_BOUNDINGBOX = "." + _getClassName("cartesianchart"),
        CHART_CONTENTBOX = "." + _getClassName("cartesianchart-content"),
        CHART_SERIESMARKER = "." + _getClassName("seriesmarker"),
        CHART_TOOLTIP = "." + _getClassName("chart-tooltip"),
        CONFIG = Y.config,
        WINDOW = CONFIG.win,
        DOCUMENT = CONFIG.doc,
        isTouch = ((WINDOW && ("ontouchstart" in WINDOW)) && !(Y.UA.chrome && Y.UA.chrome < 6)),
        SHOWTOOLTIPEVENT = isTouch ? "touchend" : "mouseover",
        HIDETOOLTIPEVENT = isTouch ? "touchend" : "mouseout",
        TOTAL_MARKERS = 15,
        ONE = 1;

    suite.add(new Y.Test.Case({
        name: "Charts Column Tests",

        dataProvider: [
            {category:"5/1/2010", miscellaneous:2000, expenses:3700, revenue:2200}, 
            {category:"5/2/2010", miscellaneous:50, expenses:9100, revenue:100}, 
            {category:"5/3/2010", miscellaneous:400, expenses:1100, revenue:1500}, 
            {category:"5/4/2010", miscellaneous:200, expenses:1900, revenue:2800}, 
            {category:"5/5/2010", miscellaneous:5000, expenses:5000, revenue:2650} 
        ],

        seriesKeys: [
            "miscellaneous",
            "expenses",
            "revenue"
        ],

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
        },

        testTooltip: function()
        {
            var result = null,
                eventNode = CHART_SERIESMARKER,
                handleEvent = function(event) 
                {
                    result = event;
                },
                seriesIndex,
                item,
                index,
                id,
                lastDash,
                seriesKey,
                contents,
                handler = Y.delegate(SHOWTOOLTIPEVENT, Y.bind(handleEvent, this), CHART_CONTENTBOX, eventNode),
                seriesMarkers = Y.all(CHART_SERIESMARKER),
                tooltip = Y.all(CHART_TOOLTIP).shift();
            seriesMarkers.each(function(node) {
                var domNode = node.getDOMNode(), 
                    xy = node.getXY(),
                    x = xy[0] - Y.one('document').get('scrollLeft'),
                    y = xy[1] - Y.one('document').get('scrollTop');
                Y.Event.simulate(domNode, SHOWTOOLTIPEVENT, {
                    clientX:x,
                    clientY:y
                });
                id = result.currentTarget.get("id");
                lastDash = id.lastIndexOf("_");
                index = id.substr(lastDash + 1);
                seriesIndex = id.charAt(lastDash - 1);
                seriesKey = this.seriesKeys[seriesIndex];
                item = this.dataProvider[index];
                contents = Y.Node.create("<div><div>category: " + item.category + "<br>" + seriesKey + ": " + item[seriesKey] + "</div></div>").get("innerHTML");
                Y.Assert.areEqual(contents, tooltip.get("innerHTML"), "The contents of the tooltip should be " + contents);
                Y.Event.simulate(domNode, HIDETOOLTIPEVENT);
            }, this);
        }
    }));

    Y.Test.Runner.add(suite);
}, '' ,{requires:['classnamemanager', 'node', 'event-simulate']});

