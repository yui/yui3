YUI.add('charts-pie-tests', function(Y) {
    var suite = new Y.Test.Suite('charts-pie-tests example test suite'),
        _getClassName = Y.ClassNameManager.getClassName,
        CHART_BOUNDINGBOX = "." + _getClassName("piechart"),
        CHART_CONTENTBOX = "." + _getClassName("piechart-content"),
        CHART_SERIESMARKER = "." + _getClassName("seriesmarker"),
        CHART_TOOLTIP = "." + _getClassName("chart-tooltip"),
        CONFIG = Y.config,
        WINDOW = CONFIG.win,
        DOCUMENT = CONFIG.doc,
        isTouch = ((WINDOW && ("ontouchstart" in WINDOW)) && !(Y.UA.chrome && Y.UA.chrome < 6)),
        isMouse = !isTouch,
        SHOWTOOLTIPEVENT = isTouch ? "tap" : "mouseover",
        HIDETOOLTIPEVENT = isTouch ? "tap" : "mouseout",
        TOTAL_MARKERS = 5,
        ONE = 1;

    suite.add(new Y.Test.Case({
        name: "Charts Pie Tests",

        dataProvider: [
            {category:"5/1/2010", values:2000}, 
            {category:"5/2/2010", values:50}, 
            {category:"5/3/2010", values:400}, 
            {category:"5/4/2010", values:200}, 
            {category:"5/5/2010", values:5000}
        ],

        getContentByIndex: function(index)
        {
            return this._contentStrings[index];
        },

        _contentStrings: [
            "<div><div>day: Monday<br>taxes: 2000<br>24.24%</div></div>",
            "<div><div>day: Tuesday<br>taxes: 50<br>0.61%</div></div>",
            "<div><div>day: Wednesday<br>taxes: 4000<br>48.48%</div></div>",
            "<div><div>day: Thursday<br>taxes: 200<br>2.42%</div></div>",
            "<div><div>day: Friday<br>taxes: 2000<br>24.24%</div></div>"
        ],
        
        _should: {
            ignore: {
                testMouseEvents:  isTouch,
                testTouchEvents: isMouse
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
            var seriesMarkers = Y.all(CHART_SERIESMARKER),
                imageMaps = seriesMarkers.filter('area'),
                markers = seriesMarkers.size() - imageMaps.size();
            Y.Assert.areEqual(TOTAL_MARKERS, markers, "There should be " + TOTAL_MARKERS + " markers.");
        },

        testMouseEvents: function()
        {
            var result = null,
                eventNode = CHART_SERIESMARKER,
                handleEvent = function(event) 
                {
                    result = event;
                },
                index,
                id,
                contents,
                handler = Y.delegate(SHOWTOOLTIPEVENT, Y.bind(handleEvent, this), CHART_CONTENTBOX, eventNode),
                seriesMarkers = Y.all(CHART_SERIESMARKER),
                tooltip = Y.all(CHART_TOOLTIP).shift();
            seriesMarkers.each(function(node) {
                var domNode = node.getDOMNode(),
                    w = parseFloat(node.getComputedStyle("width")),
                    h = parseFloat(node.getComputedStyle("height")),
                    xy = node.getXY(),
                    x = xy[0] - Y.one('document').get('scrollLeft'),
                    y = xy[1] - Y.one('document').get('scrollTop');
                Y.Event.simulate(domNode, SHOWTOOLTIPEVENT, {
                    clientX:x,
                    clientY:y
                });
                id = result.currentTarget.get("id");
                index = id.substr(id.lastIndexOf("_") + 1);
                contents = Y.Node.create(this.getContentByIndex(index)).get("innerHTML");
                Y.Assert.areEqual(contents, tooltip.get("innerHTML"), "The contents of the tooltip should be " + contents);
                Y.Event.simulate(domNode, HIDETOOLTIPEVENT);
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
                contents,
                node,
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
                        node.simulateGesture("tap", {
                            point: [3, 3],
                            duration: 0
                        }, function() {
                           test.resume(function() {
                                test.poll(condition, interval, timeout, success, failure);
                            });
                        }); 
                        test.wait();        
                    }

                },
                success = function() {
                    id = node.get("id");
                    index = id.substr(id.lastIndexOf("_") + 1);
                    contents = Y.Node.create(this.getContentByIndex(index)).get("innerHTML");
                    Y.Assert.areEqual(contents, tooltip.get("innerHTML"), "The contents of the tooltip should be " + contents);
                    checkAndFireEvent(seriesMarkers);
                },
                failure = function() {
                    Y.Assert.fail("Example does not seem to have executed within " + timeout + " seconds.");
                };
            checkAndFireEvent(seriesMarkers);
        }
    }));

    Y.Test.Runner.add(suite);
}, '' ,{requires:['classnamemanager', 'event-touch', 'node', 'node-event-simulate']});
