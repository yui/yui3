YUI.add('series-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: SeriesMarker"),
        ASSERT = Y.Assert,
        ObjectAssert = Y.ObjectAssert;
            
            
    //-------------------------------------------------------------------------
    // Chart Event Test Case
    //-------------------------------------------------------------------------
    function ChartEventTestCase(cfg, type)
    {
        ChartEventTestCase.superclass.constructor.call(this);
        this.eventType = type;
        this.attrCfg = cfg;
        this.name = "Event '" + type + "' Tests";
        this.result = null;
    }

    Y.extend(ChartEventTestCase, Y.Test.Case, {
        //---------------------------------------------------------------------
        // Setup and teardown of test harnesses
        //---------------------------------------------------------------------
        
        /*
         * Sets up several event handlers used to test UserAction mouse events.
         */
        setUp : function() 
        {
            Y.one("body").append('<div id="testbed"></div>');
            Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="mychart"></div>');
            
            //create the chart 
            this.chart = new Y.Chart(this.attrCfg);

            this.contentBox = this.chart.get("contentBox");
        
            //reset the result
            this.result = null;
            
            //assign event handler                
            this.handler = Y.delegate(this.eventType, Y.bind(this.handleEvent, this), this.contentBox, this.eventNode);
        },
        
        /*
         * Removes event handlers that were used during the test.
         */
        tearDown : function() 
        {
            Y.detach(this.handler);
            this.chart.destroy(true);
            Y.one("#testbed").destroy(true);
        },
        
        //---------------------------------------------------------------------
        // Event handler
        //---------------------------------------------------------------------
        
        /*
         * Uses to trap and assign the event object for interrogation.
         * @param {Event} event The event object created from the event.
         */
        handleEvent : function(event) 
        {
            this.result = event;
        }
    });

    function ChartMarkerEventTestCase()
    {
        ChartMarkerEventTestCase.superclass.constructor.apply(this, arguments);
        this.eventNode = "." + Y.ClassNameManager.getClassName("seriesmarker");
    }

    Y.extend(ChartMarkerEventTestCase, ChartEventTestCase, {
        getMarkerData: function(e)
        {
            var type = e.type,
                cb = this.chart.get("contentBox"),
                markerNode = e.currentTarget,
                strArr = markerNode.getAttribute("id").split("_"),
                index = strArr.pop(),
                seriesIndex = strArr.pop(),
                series = this.chart.getSeries(parseInt(seriesIndex, 10)),
                items = this.chart.getSeriesItems(series, index),
                pageX = e.pageX,
                pageY = e.pageY,
                x = pageX - cb.getX(),
                y = pageY - cb.getY();
            return { 
                type: "markerEvent:" + type, 
                originEvent: e,
                pageX:pageX, 
                pageY:pageY, 
                categoryItem:items.category, 
                valueItem:items.value, 
                node:markerNode, 
                x:x, 
                y:y, 
                series:series, 
                index:index, 
                seriesIndex:seriesIndex
            };
        },

        seriesKeys: ["miscellaneous", "expenses", "revenue"],

        //Simulate a mousemove event to test to ensure that the correct series data is associated with
        //the correct markers.
        testDefault: function()
        {
            var currentSeries,
                keys = {},
                key,
                i = 0,
                len = this.seriesKeys.length,
                categoryKey,
                seriesKey,
                categoryDisplayName,
                seriesDisplayName,
                categoryValue,
                seriesValue,
                marker,
                markers,
                markerData,
                //determine category and series axes by direction of chart
                direction = this.chart.get("direction"),
                categoryAxis = direction == "horizontal" ? "x" : "y",
                seriesAxis = direction == "horizontal" ? "y" : "x",
                markerXY,
                markerWidth,
                markerHeight
                getNumber = Y.TimeAxis.prototype._getNumber;
            for(; i < len; ++i)
            {
                keys[this.seriesKeys[i]] = i;
            }
            
            for(key in keys)
            {
                if(keys.hasOwnProperty(key))
                {
                    currentSeries = this.chart.getSeries(key);
                    if(currentSeries)
                    {
                        i = 0;
                        markers = currentSeries.get("markers");
                        if(markers)
                        {
                            len = markers.length || 0;
                            categoryKey = currentSeries.get(categoryAxis + "Key");
                            seriesKey = currentSeries.get(seriesAxis + "Key");
                            categoryDisplayName = currentSeries.get(categoryAxis + "DisplayName");
                            seriesDisplayName = currentSeries.get(seriesAxis + "DisplayName");
                            for(; i < len; ++i)
                            {
                                marker = markers[i];
                                if(marker)
                                {
                                    markerWidth = marker.get("width");
                                    markerHeight = marker.get("height");
                                    markerXY = marker.getXY();
                                    Y.Assert.isNumber(marker.get("width"));
                                    Y.Assert.isNumber(marker.get("height"));
                                    Y.Event.simulate(marker.get("node"), "mouseover", {
                                        clientX: markerXY[0] + markerWidth/2,
                                        clientY: markerXY[1] + markerHeight/2
                                    }); 
                                    markerData = this.getMarkerData(this.result);                
                                    categoryValue = this.chart.get("dataProvider")[markerData.index][categoryKey];
                                    if(this.chart.get("categoryType") == "time")
                                    {
                                        categoryValue = getNumber(categoryValue);
                                    }
                                    seriesValue = parseFloat(this.chart.get("dataProvider")[markerData.index][seriesKey]);
                                    Y.assert(markerData.categoryItem.displayName == categoryDisplayName);
                                    Y.assert(markerData.valueItem.displayName == seriesDisplayName);
                                    Y.assert(markerData.series == currentSeries);
                                    Y.assert(markerData.categoryItem.key == categoryKey);
                                    Y.assert(markerData.valueItem.key == seriesKey);
                                    Y.assert(markerData.categoryItem.value == categoryValue);
                                    Y.assert(markerData.valueItem.value == seriesValue);
                                    Y.assert(markerData.pageX === markerData.originEvent.pageX);
                                    Y.assert(markerData.pageY === markerData.originEvent.pageY);
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    Y.ChartMarkerEventTestCase = ChartMarkerEventTestCase;
    
    var DataProviderWithZeros = [
                {category:"1/1/2010", miscellaneous:1000, expenses:0, revenue:2200},
                {category:"2/1/2010", miscellaneous:0, expenses:0, revenue:100},
                {category:"3/1/2010", miscellaneous:0, expenses:0, revenue:1500},
                {category:"4/1/2010", miscellaneous:0, expenses:500, revenue:2800},
                {category:"5/1/2010", miscellaneous:0, expenses:0, revenue:2650},
                {category:"6/1/2010", miscellaneous:0, expenses:0, revenue:1200}
        ],
    SeriesKeys = ["miscellaneous", "expenses", "revenue"],
    DataProviderWithNull = [
            {category:"1/1/2010", miscellaneous:1000, expenses:null, revenue:2200},
            {category:"2/1/2010", expenses:null, revenue:100},
            {category:"3/1/2010", expenses:null, revenue:1500},
            {category:"4/1/2010", expenses:500, revenue:2800},
            {category:"5/1/2010", expenses:null, revenue:2650},
            {category:"6/1/2010", expenses:null, revenue:1200}
    ],
    DataProviderWithMissingKeyEntries = [
            {category:"1/1/2010"},
            {category:"2/1/2010", revenue:100},
            {category:"3/1/2010", expenses:400, revenue:1500},
            {category:"4/1/2010", expenses:500, revenue:2800},
            {category:"5/1/2010", expenses:1000, revenue:2650},
            {category:"6/1/2010", expenses:900, revenue:1200}
    ],
    MissingSeriesAndSeriesStartingWithZeroConfig = {
        dataProvider: [
                {
                    "Time":new Date(2011,09,01,19,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,01,20,00,00,000),
                    "miscellaneous":5
                },
                {
                    "Time":new Date(2011,09,01,21,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,01,22,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,01,23,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,02,00,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,02,01,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,02,02,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,02,03,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,02,04,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,02,05,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,02,06,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,02,07,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,02,08,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,02,09,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,02,10,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,02,11,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,02,12,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,02,13,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,02,14,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,02,15,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,02,16,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,02,17,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,02,18,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,02,19,00,00,000),
                    "miscellaneous": 0
                },
                {
                    "Time":new Date(2011,09,02,20,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,02,21,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,02,22,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,02,23,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,03,00,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,03,01,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,03,02,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,03,03,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,03,04,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,03,05,00,00,000),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,09,03,06,00,00,000),
                    "miscellaneous":0
                }
        ],
        type: "column",
        stacked: true,
        render: "#mychart",
        categoryType: "time",
        axes: {
            values:{
                position :"left",
                type :"stacked"
            },
            dateRange:{
                keys : [
                    "Time"
                ],
                position :"bottom",
                type :"time",
                labelFormat :"%a %l:%M %p"
            }
        },
        seriesCollection : [
            {
                xAxis : "dateRange",
                yAxis : "values",
                xKey : "Time",
                yKey : "expenses"
            },
            {
                xAxis : "dateRange",
                yAxis : "values",
                xKey : "Time",
                yKey : "miscellaneous"
            }
        ]
    },
    numericCategoryValuesDataProvider = [
        {category: 1, miscellaneous: 3000},
        {category: 2, miscellaneous: 3500},
        {category: 3, miscellaneous: 3750},
        {category: 4, miscellaneous: 4233},
        {category: 5, miscellaneous: 3800},
        {category: 6, miscellaneous: 4899},
        {category: 7, miscellaneous: 3333}, 
        {category: 8, miscellaneous: 5210},
        {category: 9, miscellaneous: 2011},
        {category: 10, miscellaneous: 3100}
    ],
    regularDataProvider = [
        {category:"5/1/2010", miscellaneous:2000, expenses:3700, revenue:2200}, 
        {category:"5/2/2010", miscellaneous:50, expenses:9100, revenue:100}, 
        {category:"5/3/2010", miscellaneous:400, expenses:1100, revenue:1500}, 
        {category:"5/4/2010", miscellaneous:200, expenses:1900, revenue:2800}, 
        {category:"5/5/2010", miscellaneous:5000, expenses:5000, revenue:2650}
    ],
    DataProvider,
    suite  = new Y.Test.Suite("Charts: Series Marker"),
    zeroValueColumnMouseOverTests = new Y.ChartMarkerEventTestCase({
        type: "column",
        render: "#mychart",
        dataProvider: DataProviderWithZeros,
        seriesKeys: SeriesKeys
    }, "mouseover"),
    zeroValueBarMouseOverTests = new Y.ChartMarkerEventTestCase({
        type: "bar",
        render: "#mychart",
        dataProvider: DataProviderWithZeros,
        seriesKeys: SeriesKeys
    }, "mouseover"),
    zeroValueStackedColumnMouseOverTests = new Y.ChartMarkerEventTestCase({
        type: "column",
        stacked: true,
        render: "#mychart",
        dataProvider: DataProviderWithZeros,
        seriesKeys: SeriesKeys
    }, "mouseover"),
    zeroValueStackedBarMouseOverTests = new Y.ChartMarkerEventTestCase({
        type: "bar",
        stacked: true,
        render: "#mychart",
        dataProvider: DataProviderWithZeros,
        seriesKeys: SeriesKeys
    }, "mouseover"),
    nullValueColumnMouseOverTests = new Y.ChartMarkerEventTestCase({
        type: "column",
        render: "#mychart",
        dataProvider: DataProviderWithNull,
        seriesKeys: SeriesKeys
    }, "mouseover"),
    nullValueBarMouseOverTests = new Y.ChartMarkerEventTestCase({
        type: "bar",
        render: "#mychart",
        dataProvider: DataProviderWithNull,
        seriesKeys: SeriesKeys
    }, "mouseover"),
    nullValueStackedColumnMouseOverTests = new Y.ChartMarkerEventTestCase({
        type: "column",
        stacked: true,
        render: "#mychart",
        dataProvider: DataProviderWithNull,
        seriesKeys: SeriesKeys
    }, "mouseover"),
    nullValueStackedBarMouseOverTests = new Y.ChartMarkerEventTestCase({
        type: "bar",
        stacked: true,
        render: "#mychart",
        dataProvider: DataProviderWithNull,
        seriesKeys: SeriesKeys
    }, "mouseover"),
    zeroValueComboMouseOverTests = new Y.ChartMarkerEventTestCase({
        render: "#mychart",
        dataProvider: DataProviderWithZeros,
        seriesKeys: SeriesKeys
    }, "mouseover"),
    nullValueComboMouseOverTests = new Y.ChartMarkerEventTestCase({
        render: "#mychart",
        dataProvider: DataProviderWithNull,
        seriesKeys: SeriesKeys
    }, "mouseover"),
    missingSeriesAndSeriesStartingWithZero = new Y.ChartMarkerEventTestCase(MissingSeriesAndSeriesStartingWithZeroConfig, "mouseover"),
    categoryWithNumericValuesChart = new Y.ChartMarkerEventTestCase({
        dataProvider: numericCategoryValuesDataProvider,
        render: "#mychart"
    }, "mouseover"),
    missingValueComboMouseOverTests = new Y.ChartMarkerEventTestCase({
        render: "#mychart",
        dataProvider: DataProviderWithNull,
        seriesKeys: SeriesKeys
    }, "mouseover"),
    missingValueColumnMouseOverTests = new Y.ChartMarkerEventTestCase({
        type: "column",
        render: "#mychart",
        dataProvider: DataProviderWithMissingKeyEntries,
        testKeys: SeriesKeys
    }, "mouseover"),
    missingValueBarMouseOverTests = new Y.ChartMarkerEventTestCase({
        type: "bar",
        render: "#mychart",
        dataProvider: DataProviderWithMissingKeyEntries,
        testKeys: SeriesKeys
    }, "mouseover"),
    missingValueStackedColumnMouseOverTests = new Y.ChartMarkerEventTestCase({
        type: "column",
        stacked: true,
        render: "#mychart",
        dataProvider: DataProviderWithMissingKeyEntries,
        testKeys: SeriesKeys
    }, "mouseover"),
    missingValueStackedBarMouseOverTests = new Y.ChartMarkerEventTestCase({
        type: "bar",
        stacked: true,
        render: "#mychart",
        dataProvider: DataProviderWithMissingKeyEntries,
        testKeys: SeriesKeys
    }, "mouseover"),
    categoryAndValueDisplayName = function(direction)
    {
        var cfg = {
            dataProvider: regularDataProvider,
            seriesCollection: [
                {
                    xKey: "category",
                    yKey: "miscellaneous",
                    categoryDisplayName: "Date",
                    valueDisplayName: "Miscellaneous"
                },
                {
                    xKey: "category",
                    yKey: "expenses",
                    categoryDisplayName: "Date",
                    valueDisplayName: "Expenses"
                },
                {
                    xKey: "category",
                    yKey: "revenue",
                    categoryDisplayName: "Date",
                    valueDisplayName: "Revenue"
                }
            ],
            render: "#mychart"
        };
        if(direction && direction == "vertical")
        {
            cfg.direction = direction;
        }
        return new Y.ChartMarkerEventTestCase(cfg, "mouseover");
    },
    xAndYDisplayName = new Y.ChartMarkerEventTestCase({
        dataProvider: regularDataProvider,
        seriesCollection: [
            {
                xKey: "category",
                yKey: "miscellaneous",
                xDisplayName: "Date",
                yDisplayName: "Miscellaneous"
            },
            {
                xKey: "category",
                yKey: "expenses",
                xDisplayName: "Date",
                yDisplayName: "Expenses"
            },
            {
                xKey: "category",
                yKey: "revenue",
                xDisplayName: "Date",
                yDisplayName: "Revenue"
            }
        ],
        render: "#mychart"
    }, "mouseover");
    
    suite.add(zeroValueColumnMouseOverTests);
    suite.add(zeroValueBarMouseOverTests);
    suite.add(zeroValueStackedColumnMouseOverTests);
    suite.add(zeroValueStackedBarMouseOverTests);
    suite.add(nullValueColumnMouseOverTests);
    suite.add(nullValueBarMouseOverTests);
    suite.add(nullValueStackedColumnMouseOverTests);
    suite.add(nullValueStackedBarMouseOverTests);
    suite.add(zeroValueComboMouseOverTests);
    suite.add(nullValueComboMouseOverTests);
    suite.add(missingSeriesAndSeriesStartingWithZero); 
    suite.add(missingValueComboMouseOverTests);
    suite.add(missingValueColumnMouseOverTests);
    suite.add(missingValueBarMouseOverTests);
    suite.add(missingValueStackedColumnMouseOverTests);
    suite.add(missingValueStackedBarMouseOverTests);
    suite.add(categoryWithNumericValuesChart);
    suite.add(categoryAndValueDisplayName());
    suite.add(categoryAndValueDisplayName("vertical"));
    suite.add(xAndYDisplayName);


    //add to the testrunner and run
    //Y.Test.Runner.add(Y.Tests.SeriesMarkerTests);
    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['charts', 'test']});
