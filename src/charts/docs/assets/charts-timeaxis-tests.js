YUI.add('charts-timeaxis-tests', function(Y) {
    var suite = new Y.Test.Suite('charts-timeaxis-tests example test suite'),
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
        TOTAL_MARKERS = 36,
        ONE = 1;

    suite.add(new Y.Test.Case({
        name: "Charts Time Axis Tests",

        dataProvider: [
            {date:"1/1/2010", miscellaneous:2000, expenses:3700, revenue:2200}, 
            {date:"2/1/2010", miscellaneous:50, expenses:9100, revenue:100}, 
            {date:"3/1/2010", miscellaneous:400, expenses:1100, revenue:1500}, 
            {date:"4/1/2010", miscellaneous:200, expenses:1900, revenue:2800}, 
            {date:"5/1/2010", miscellaneous:500, expenses:7000, revenue:2650},
            {date:"6/1/2010", miscellaneous:3000, expenses:4700, revenue:1200}, 
            {date:"7/1/2010", miscellaneous:6550, expenses:6500, revenue:1100}, 
            {date:"8/1/2010", miscellaneous:4005, expenses:2600, revenue:3500}, 
            {date:"9/1/2010", miscellaneous:1200, expenses:8900, revenue:3800}, 
            {date:"10/1/2010", miscellaneous:2000, expenses:1000, revenue:3650},
            {date:"11/1/2010", miscellaneous:2000, expenses:3700, revenue:2200}, 
            {date:"12/1/2010", miscellaneous:5000, expenses:3100, revenue:4100} 
        ],

        seriesKeys: [
            "miscellaneous",
            "expenses",
            "revenue"
        ],

        getFormattedDate: function(index)
        {
            return this._formattedDates[index];
        },
        
        _formattedDates: [
            "Jan 01, 10",
            "Feb 01, 10",
            "Mar 01, 10",
            "Apr 01, 10",
            "May 01, 10",
            "Jun 01, 10",
            "Jul 01, 10",
            "Aug 01, 10",
            "Sep 01, 10",
            "Oct 01, 10",
            "Nov 01, 10",
            "Dec 01, 10"
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
            Y.Assert.areEqual(TOTAL_MARKERS, seriesMarkers.size(), "There should be 5 markers.");
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
                datevalue,
                dataProvider = this.dataProvider,
                labelFunction = this.labelFunction,
                seriesKeys = this.seriesKeys,
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
                seriesKey = seriesKeys[seriesIndex];
                item = dataProvider[index];
                datevalue = this.getFormattedDate(index);
                contents = Y.Node.create("<div><div>date: " + datevalue + "<br>" + seriesKey + ": " + item[seriesKey] + "</div></div>").get("innerHTML");
                Y.Assert.areEqual(contents, tooltip.get("innerHTML"), "The contents of the tooltip should be " + contents);
                Y.Event.simulate(domNode, HIDETOOLTIPEVENT);
            }, this);
        }
    }));

    Y.Test.Runner.add(suite);
}, '' ,{requires:['classnamemanager', 'node', 'event-simulate', 'datatype-date']});

