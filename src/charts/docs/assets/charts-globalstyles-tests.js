YUI.add('charts-globalstyles-tests', function(Y) {
    var suite = new Y.Test.Suite('charts-globalstyles-tests example test suite'),
        _getClassName = Y.ClassNameManager.getClassName,
        CHART_BOUNDINGBOX = "." + _getClassName("cartesianchart"),
        CHART_CONTENTBOX = "." + _getClassName("cartesianchart-content"),
        CHART_SERIESMARKER = "." + _getClassName("seriesmarker"),
        CHART_TOOLTIP = "." + _getClassName("chart-tooltip"),
        OVERLAY = "." + _getClassName("overlay"),
        CONFIG = Y.config,
        WINDOW = CONFIG.win,
        DOCUMENT = CONFIG.doc,
        isTouch = ((WINDOW && ("ontouchstart" in WINDOW)) && !(Y.UA.chrome && Y.UA.chrome < 6)),
        isMouse = !isTouch,
        SHOWTOOLTIPEVENT = isTouch ? "tap" : "mousemove",
        HIDETOOLTIPEVENT = isTouch ? "tap" : "mouseout",
        TOTAL_MARKERS = 15,
        ONE = 1,
        IE = Y.UA.ie,
        IGNORETOOLTIPTEST = IE && IE >= 9 ? true : false;

    suite.add(new Y.Test.Case({
        name: "Charts Global Styles Tests",

        dataProvider: [
            {date:"5/1/2010", international:2000, expenses:3700, domestic:2200}, 
            {date:"5/2/2010", international:50, expenses:9100, domestic:100}, 
            {date:"5/3/2010", international:400, expenses:1100, domestic:1500}, 
            {date:"5/4/2010", international:200, expenses:1900, domestic:2800}, 
            {date:"5/5/2010", international:5000, expenses:5000, domestic:2650} 
        ],

        seriesKeys: [
            "international",
            "expenses",
            "domestic"
        ],

        seriesDisplayNames: {
            international: "Miscellaneous",
            expenses: "Expenses",
            domestic: "Deductions"
        },

        getSeriesDisplayName: function(seriesKey)
        {
            return this.seriesDisplayNames[seriesKey];
        },
        
        _should: {
            ignore: {
                testMouseEvents:  isTouch || IGNORETOOLTIPTEST,
                testTouchEvents: isMouse || IGNORETOOLTIPTEST
            }
        },
        
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

        _handleEvent: function(e) {
            this._result = e;
        },

        testMouseEvents: function()
        {
            var result = null,
                eventNode = CHART_SERIESMARKER,
                handleEvent = function(event) 
                {
                    result = event;
                },
                overlays = Y.all(OVERLAY),
                overlay,
                seriesIndex,
                index,
                id,
                lastDash,
                seriesKey,
                contents,
                handler,
                seriesMarkers = Y.all(CHART_SERIESMARKER),
                tooltip = Y.all(CHART_TOOLTIP).shift();
            overlays.each(function(node) {
                overlay = node;
            }, this);
            handler = overlay.on(SHOWTOOLTIPEVENT, handleEvent);
            seriesMarkers.each(function(node) {
                var domNode = node.getDOMNode(),
                    x,
                    y;
                id = node.get("id");
                lastDash = id.lastIndexOf("_");
                index = id.substr(lastDash + 1);
                seriesIndex = id.charAt(lastDash - 1);
                if(seriesIndex == 0)
                {
                    xy = node.getXY();
                    x = xy[0] + 3 - Y.one('document').get('scrollLeft');
                    y = xy[1] + 3 - Y.one('document').get('scrollTop');
                    overlay.simulate(SHOWTOOLTIPEVENT, {
                        clientX:x,
                        clientY:y
                    });
                    contents = this.markerLabelFunction(seriesIndex, index);
                    Y.Assert.areEqual(contents, tooltip.get("innerHTML"), "The contents of the tooltip should be " + contents);
                    overlay.simulate(SHOWTOOLTIPEVENT, {
                        clientX: 0,
                        clientY: 0
                    });
                }
            }, this);
        },

        testTouchEvents: function()
        {
            var result = null,
                test = this,
                timeout = 1000,
                interval = 10,
                eventNode = CHART_SERIESMARKER,
                index,
                id,
                lastDash,
                contents,
                node,
                xy,
                nodeXY,
                x,
                y,
                overlays = Y.all(OVERLAY),
                overlay = overlays.shift(),
                seriesMarkers = Y.all(CHART_SERIESMARKER),
                tooltip = Y.all(CHART_TOOLTIP).shift(),
                condition = function() {
                    return tooltip.getStyle("visibility") == "visible";
                },
                checkAndFireEvent = function(seriesMarkers)
                {
                    node = seriesMarkers.shift();
                    if(node)
                    {
                        id = node.get("id");
                        lastDash = id.lastIndexOf("_");
                        index = id.substr(lastDash + 1);
                        seriesIndex = id.charAt(lastDash - 1);
                        if(seriesIndex > 0)
                        {
                            checkAndFireEvent(seriesMarkers);
                        }
                        else
                        {
                            xy = overlay.getXY();
                            nodeXY = node.getXY();
                            x = nodeXY[0] - xy[0] + 3;
                            y = nodeXY[1] - xy[1] + 3;
                            overlay.simulateGesture("tap", {
                                point: [x, y],
                                duration: 0
                            }, function() {
                               test.resume(function() {
                                    test.poll(condition, interval, timeout, success, failure);
                                });
                            }); 
                            test.wait();        
                        }
                    }
                },
                success = function() {
                    id = node.get("id");
                    lastDash = id.lastIndexOf("_");
                    index = id.substr(id.lastIndexOf("_") + 1);
                    seriesIndex = id.charAt(lastDash - 1);
                    seriesKey = this.seriesKeys[seriesIndex];
                    item = this.dataProvider[index];
                    contents = this.markerLabelFunction(seriesIndex, index);
                    Y.Assert.areEqual(contents, tooltip.get("innerHTML"), "The contents of the tooltip should be " + contents);
                    checkAndFireEvent(seriesMarkers);
                },
                failure = function() {
                    Y.Assert.fail("Example does not seem to have executed within " + timeout + " seconds.");
                };
            checkAndFireEvent(seriesMarkers);
        },
        
        markerLabelFunction: function(seriesIndex, index)
        {
            var item = this.dataProvider[index];
            return Y.Node.create("<div><div>" + item.date + "<br>international: " + item.international + 
                    "<br>expenses: " + item.expenses + "<br>domestic: " + item.domestic + "</div></div>").get("innerHTML");
        }
    }));

    Y.Test.Runner.add(suite);
}, '' ,{requires:['classnamemanager', 'event-touch', 'node', 'node-event-simulate']});
