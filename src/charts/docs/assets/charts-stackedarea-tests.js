YUI.add('charts-stackedarea-tests', function(Y) {
    var suite = new Y.Test.Suite('charts-stackedarea-tests example test suite'),
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
        name: "Charts Stacked Area Tests",

        dataProvider: [
            {date:"1/1/2010", miscellaneous:2000, expenses:3700, revenue:2200}, 
            {date:"2/1/2010", miscellaneous:3000, expenses:3100, revenue:4100}, 
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

        testMouseEvents: function()
        {
            var overlays = Y.all(OVERLAY),
                overlay,
                id,
                item,
                contents,
                index = 0,
                wid,
                ht,
                dataProvider = this.dataProvider,
                len = dataProvider.length,
                multiple,
                currentDate,
                startDate = new Date(dataProvider[0].date).valueOf(),
                range = new Date(dataProvider[len - 1].date).valueOf() - startDate;
                tooltip = Y.all(CHART_TOOLTIP).shift();
            overlays.each(function(node) {
                overlay = node;
                xy = overlay.getXY();
                wid = parseFloat(overlay.getComputedStyle("width"));
                ht = parseFloat(overlay.getComputedStyle("height"));
                multiple = Math.ceil(wid/len) + 1;
                y = xy[1] + 10 - Y.one('document').get('scrollLeft'); 
                x = xy[0] + 2 - Y.one('document').get('scrollTop');
            }, this);
            for(; index < len; index = index + 1)
            {
                item = dataProvider[index];
                currentDate = new Date(item.date).valueOf();
                overlay.simulate(SHOWTOOLTIPEVENT, {
                    clientX:index > 0 ? x + ((currentDate - startDate) /range * wid) : x,
                    clientY:y
                });
                if(tooltip.getStyle("visibility") == "visible")
                {
                    contents = Y.Node.create("<div><div>" + this.getFormattedDate(index) + "<br>miscellaneous: " + item.miscellaneous + 
                        "<br>expenses: " + item.expenses + "<br>revenue: " + item.revenue + "</div></div>").get("innerHTML");
                    Y.Assert.areEqual(contents, tooltip.get("innerHTML"), "The contents of the tooltip should be " + contents);
                }
            }
            overlay.simulate(SHOWTOOLTIPEVENT, {
                clientX:x + 10,
                clientY:y
            });
        },

        testTouchEvents: function()
        {
            var overlays = Y.all(OVERLAY),
                overlay = overlays.shift(),
                result = null,
                test = this,
                timeout = 1000,
                interval = 10,
                x = 2,
                y = 10,
                eventNode = CHART_SERIESMARKER,
                index = 0,
                id,
                lastDash,
                contents,
                node,
                dataProvider = this.dataProvider,
                len = dataProvider.length,
                currentDate,
                startDate = new Date(dataProvider[0].date).valueOf(),
                range = new Date(dataProvider[len - 1].date).valueOf() - startDate;
                wid = parseFloat(overlay.getComputedStyle("width"));
                ht = parseFloat(overlay.getComputedStyle("height"));
                multiple = Math.ceil(wid/len) + 1;
                tooltip = Y.all(CHART_TOOLTIP).shift(),
                condition = function() {
                    return tooltip.getStyle("visibility") == "visible";
                },
                checkAndFireEvent = function()
                {
                    if(index < len)
                    {
                        item = dataProvider[index];
                        currentDate = new Date(item.date).valueOf();
                        index = index + 1;
                        overlay.simulateGesture("tap", {
                            point: [index > 0 ? x + ((currentDate - startDate) /range * wid) : x, y]
                        }, function() {
                           test.resume(function() {
                                test.poll(condition, interval, timeout, success, failure);
                            });
                        }); 
                        test.wait();        
                    }

                },
                success = function() {
                    contents = Y.Node.create("<div><div>" + this.getFormattedDate(index - 1) + "<br>miscellaneous: " + item.miscellaneous + 
                        "<br>expenses: " + item.expenses + "<br>revenue: " + item.revenue + "</div></div>").get("innerHTML");
                    Y.Assert.areEqual(contents, tooltip.get("innerHTML"), "The contents of the tooltip should be " + contents);
                    checkAndFireEvent();
                },
                failure = function() {
                    Y.Assert.fail("Example does not seem to have executed within " + timeout + " seconds.");
                };
            checkAndFireEvent();
        }
    }));

    Y.Test.Runner.add(suite);
}, '' ,{requires:['classnamemanager', 'event-touch', 'node', 'node-event-simulate']});
