YUI.add('charts-customizedtooltip-tests', function(Y) {
    var suite = new Y.Test.Suite('charts-customizedtooltip-tests example test suite'),
        _getClassName = Y.ClassNameManager.getClassName,
        CHART_BOUNDINGBOX = "." + _getClassName("cartesianchart"),
        CHART_CONTENTBOX = "." + _getClassName("cartesianchart-content"),
        CHART_SERIESMARKER = "." + _getClassName("seriesmarker"),
        CHART_TOOLTIP = "." + _getClassName("chart-tooltip"),
        CONFIG = Y.config,
        WINDOW = CONFIG.win,
        DOCUMENT = CONFIG.doc,
        isTouch = ((WINDOW && ("ontouchstart" in WINDOW)) && !(Y.UA.chrome && Y.UA.chrome < 6)),
        isMouse = !isTouch,
        SHOWTOOLTIPEVENT = isTouch ? "tap" : "mouseover",
        HIDETOOLTIPEVENT = isTouch ? "tap" : "mouseout",
        TOTAL_MARKERS = 15,
        ONE = 1;

    suite.add(new Y.Test.Case({
        name: "Charts Customized Tooltip Tests",

        dataProvider: [
            {category:"5/1/2010", Miscellaneous:2000, Expenses:3700, Revenue:2200}, 
            {category:"5/2/2010", Miscellaneous:50, Expenses:9100, Revenue:100}, 
            {category:"5/3/2010", Miscellaneous:400, Expenses:1100, Revenue:1500}, 
            {category:"5/4/2010", Miscellaneous:200, Expenses:1900, Revenue:2800}, 
            {category:"5/5/2010", Miscellaneous:5000, Expenses:5000, Revenue:2650} 
        ],

        seriesKeys: [
            "Miscellaneous",
            "Expenses",
            "Revenue"
        ],

        seriesDisplayNames: {
            Miscellaneous: "Miscellaneous",
            Expenses: "Expenses",
            Revenue: "Revenue"
        },

        getSeriesDisplayName: function(seriesKey)
        {
            return this.seriesDisplayNames[seriesKey];
        },

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
            var seriesMarkers = Y.all(CHART_SERIESMARKER);
            Y.Assert.areEqual(TOTAL_MARKERS, seriesMarkers.size(), "There should be " + TOTAL_MARKERS + " markers.");
        },

        testMouseEvents: function()
        {
            var result = null,
                eventNode = CHART_SERIESMARKER,
                handleEvent = function(event) 
                {
                    result = event;
                },
                seriesIndex,
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
                contents = this.markerLabelFunction(seriesIndex, index);
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
                lastDash,
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
            var parent = Y.Node.create('<div></div>'),
                msg = Y.Node.create('<div></div>'),
                underlinedTextBlock = document.createElement("span"),
                boldTextBlock = document.createElement("div"),
                seriesKey = this.seriesKeys[seriesIndex],
                seriesDisplayName = this.getSeriesDisplayName(seriesKey),
                item = this.dataProvider[index];
            underlinedTextBlock.style.textDecoration = "underline";
            boldTextBlock.style.marginTop = "5px";
            boldTextBlock.style.fontWeight = "bold";
            underlinedTextBlock.appendChild(document.createTextNode(seriesDisplayName + " for " + item.category));
            boldTextBlock.appendChild(document.createTextNode("$" + item[seriesKey] + ".00"));   
            msg.appendChild(underlinedTextBlock);
            msg.appendChild(document.createElement("br"));
            msg.appendChild(boldTextBlock); 
            parent.appendChild(msg);
            return parent.get("innerHTML"); 
        }
    }));
    
    Y.Test.Runner.add(suite);
}, '' ,{requires:['classnamemanager', 'event-touch', 'node', 'node-event-simulate']});

