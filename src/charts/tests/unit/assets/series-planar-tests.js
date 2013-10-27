YUI.add('series-planar-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: SeriesPlanar"),
        ASSERT = Y.Assert,
        ObjectAssert = Y.ObjectAssert,
        parentDiv = Y.DOM.create('<div style="position:absolute;top:500px;left:0px;width:500px;height:400px" id="testdiv"></div>'),
        DOC = Y.config.doc;
    DOC.body.appendChild(parentDiv);
            
            
    //-------------------------------------------------------------------------
    // Chart Event Test Case
    //-------------------------------------------------------------------------
    function ChartEventTestCase(cfg)
    {
        ChartEventTestCase.superclass.constructor.call(this);
        this.attrCfg = cfg;
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
            var chart,
                overlay,
                win = Y.config.win,
                isTouch = ((win && ("ontouchstart" in win)) && !(Y.UA.chrome && Y.UA.chrome < 6));
            //create the chart 
            this.chart = new Y.Chart(this.attrCfg);
            chart = this.chart;
            overlay = chart._overlay;
            this.contentBox = chart.get("contentBox");
            //reset the result
            this.result = null;
            
            //assign event handler                
            this.eventType = isTouch ? "touchend" : "mousemove";
            this.name = "Event '" + this.eventType + "' Tests";
            this.chart.on("planarEvent:mouseover", Y.bind(this.handleEvent, this));
        },
        
        /*
         * Removes event handlers that were used during the test.
         */
        tearDown : function() 
        {
            Y.detach(this.handler);
            this.chart.destroy(true);
            Y.Event.purgeElement(DOC, false);
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

    function ChartPlanarEventTestCase()
    {
        ChartPlanarEventTestCase.superclass.constructor.apply(this, arguments);
        this.eventNode = "div." + Y.ClassNameManager.getClassName("overlay");
    }

    Y.extend(ChartPlanarEventTestCase, ChartEventTestCase, {
        seriesKeys: ["miscellaneous", "expenses", "revenue"],

        testDefault: function()
        {
            var chart = this.chart,
                overlay = chart._overlay,
                dataProvider = chart.get("dataProvider"),
                len = dataProvider.length,
                dataItem,
                i = 0,
                direction = chart.get("direction"),
                graph = chart.get("graph"),
                graphWidth = graph.get("width"),
                graphHeight = graph.get("height"),
                layoutLength = direction == "vertical" ? graphHeight : graphWidth,
                categoryType = chart.get("categoryType"),
                edgeOffset = categoryType == "time" ? 0 : (layoutLength/len)/2,
                distance,
                pageX,
                pageY,
                clientX,
                clientY,
                planarData,
                categoryItem,
                valueItem,
                dataValue,
                key,
                j,
                getNumber = Y.TimeAxis.prototype._getNumber,
                itemLength;
                xy = graph.get("contentBox").getXY();
            layoutLength = layoutLength - (edgeOffset * 2);
            distance = layoutLength/(len - 1);
            for(; i < len; ++i)
            {
                if(direction == "vertical")
                {
                    pageX = xy[0] + graphWidth/2;
                    pageY = (xy[1] + edgeOffset) + ((distance * (i + 1)) - distance);
                }
                else
                {
                    pageX = (xy[0] + edgeOffset) + ((distance * (i + 1)) - distance);
                    pageY = xy[1] + graphHeight/2;
                }
                clientX = pageX - Y.DOM.docScrollX();
                clientY = pageY - Y.DOM.docScrollY();
                if(this.eventType == "touchend")
                {
                    //simulate does not work for touch events
                    //need to add
                    return;
                }
                else if(Y.UA.ie && Y.UA.ie >= 9)
                {
                    //simulate does not work for ie9 (pageX/pageY always equals 0)
                    //need to add
                    return;
                }
                else
                {
                    overlay.simulate(this.eventType, {
                        clientX: clientX,
                        clientY: clientY
                    });
                }
                planarData = this.result;
                categoryItem = planarData.categoryItem;
                valueItem = planarData.valueItem;
                dataItem = dataProvider[i];
                if(dataItem)
                {
                    if(valueItem && valueItem.length)
                    {
                        itemLength = valueItem.length;
                        for(j = 0; j < itemLength; ++j)
                        {
                            key = valueItem[j].key;
                            dataValue = dataItem[key];
                            if(dataItem.hasOwnProperty(key) && Y.Lang.isNumber(dataValue))
                            {
                                Y.Assert.areEqual(dataValue, valueItem[j].value, "The value of the series item should be " + dataValue + ".");
                            }
                        }
                    }

                    if(categoryItem && categoryItem.length)
                    {
                        itemLength = categoryItem.length;
                        for(j = 0; j < itemLength; ++j)
                        {
                            key = categoryItem[j].key;
                            dataValue = dataItem[key];
                            if(this.chart.get("categoryType") == "time")
                            {
                                dataValue = getNumber(dataValue);
                            }
                            if(dataItem.hasOwnProperty(key) && (Y.Lang.isNumber(dataValue) || dataValue))
                            {
                                Y.Assert.areEqual(dataValue, categoryItem[j].value, "The value of the series item should be " + dataValue + ".");
                            }
                        }
                    }
                }
            }
        }
    });
    Y.ChartPlanarEventTestCase = ChartPlanarEventTestCase;
    
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
        stacked: true,
        interactionType: "planar",
        dataProvider: [
                {
                    "Time":new Date(2011,9,1,19,0,0,0),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,9,1,20,0,0,0),
                    "miscellaneous":5
                },
                {
                    "Time":new Date(2011,9,01,21,0,0,0),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,9,01,22,0,0,0),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,9,01,23,0,0,0),
                    "miscellaneous":0
                },
                {
                    "Time":new Date(2011,9,02,0,0,0,0),
                    "miscellaneous":0
                }
        ],
        type: "column",
        render: "#testdiv",
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
    DataProvider,
    zeroValueColumnMouseOverTests = new Y.ChartPlanarEventTestCase({
        interactionType: "planar",
        type: "column",
        render: "#testdiv",
        dataProvider: DataProviderWithZeros,
        seriesKeys: SeriesKeys
    }),
    zeroValueBarMouseOverTests = new Y.ChartPlanarEventTestCase({
        interactionType: "planar",
        type: "bar",
        render: "#testdiv",
        dataProvider: DataProviderWithZeros,
        seriesKeys: SeriesKeys
    }),
    zeroValueStackedColumnMouseOverTests = new Y.ChartPlanarEventTestCase({
        interactionType: "planar",
        type: "column",
        stacked: true,
        render: "#testdiv",
        dataProvider: DataProviderWithZeros,
        seriesKeys: SeriesKeys
    }),
    zeroValueStackedBarMouseOverTests = new Y.ChartPlanarEventTestCase({
        interactionType: "planar",
        type: "bar",
        stacked: true,
        render: "#testdiv",
        dataProvider: DataProviderWithZeros,
        seriesKeys: SeriesKeys
    }),
    nullValueColumnMouseOverTests = new Y.ChartPlanarEventTestCase({
        interactionType: "planar",
        type: "column",
        render: "#testdiv",
        dataProvider: DataProviderWithNull,
        seriesKeys: SeriesKeys
    }),
    nullValueBarMouseOverTests = new Y.ChartPlanarEventTestCase({
        interactionType: "planar",
        type: "bar",
        render: "#testdiv",
        dataProvider: DataProviderWithNull,
        seriesKeys: SeriesKeys
    }),
    nullValueStackedColumnMouseOverTests = new Y.ChartPlanarEventTestCase({
        interactionType: "planar",
        type: "column",
        stacked: true,
        render: "#testdiv",
        dataProvider: DataProviderWithNull,
        seriesKeys: SeriesKeys
    }),
    nullValueStackedBarMouseOverTests = new Y.ChartPlanarEventTestCase({
        interactionType: "planar",
        type: "bar",
        stacked: true,
        render: "#testdiv",
        dataProvider: DataProviderWithNull,
        seriesKeys: SeriesKeys
    }),
    zeroValueComboMouseOverTests = new Y.ChartPlanarEventTestCase({
        interactionType: "planar",
        render: "#testdiv",
        dataProvider: DataProviderWithZeros,
        seriesKeys: SeriesKeys
    }),
    nullValueComboMouseOverTests = new Y.ChartPlanarEventTestCase({
        interactionType: "planar",
        render: "#testdiv",
        dataProvider: DataProviderWithNull,
        seriesKeys: SeriesKeys
    }),
    missingSeriesAndSeriesStartingWithZero = new Y.ChartPlanarEventTestCase(MissingSeriesAndSeriesStartingWithZeroConfig),
    missingValueComboMouseOverTests = new Y.ChartPlanarEventTestCase({
        interactionType: "planar",
        render: "#testdiv",
        dataProvider: DataProviderWithMissingKeyEntries
    }),
    missingValueColumnMouseOverTests = new Y.ChartPlanarEventTestCase({
        interactionType: "planar",
        type: "column",
        render: "#testdiv",
        dataProvider: DataProviderWithMissingKeyEntries
    }),
    missingValueBarMouseOverTests = new Y.ChartPlanarEventTestCase({
        interactionType: "planar",
        type: "bar",
        render: "#testdiv",
        dataProvider: DataProviderWithMissingKeyEntries
    }),
    missingValueStackedColumnMouseOverTests = new Y.ChartPlanarEventTestCase({
        interactionType: "planar",
        type: "column",
        stacked: true,
        render: "#testdiv",
        dataProvider: DataProviderWithMissingKeyEntries
    }),
    missingValueStackedBarMouseOverTests = new Y.ChartPlanarEventTestCase({
        interactionType: "planar",
        type: "bar",
        stacked: true,
        render: "#testdiv",
        dataProvider: DataProviderWithMissingKeyEntries
    }),
    categoryWithNumericValuesChart = new Y.ChartPlanarEventTestCase({
        interactionType: "planar",
        dataProvider: numericCategoryValuesDataProvider,
        render: "#testdiv"
    });
   
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
    suite.add(missingSeriesAndSeriesStartingWithZero); 
    suite.add(missingValueComboMouseOverTests);
    suite.add(missingValueColumnMouseOverTests);
    suite.add(missingValueBarMouseOverTests);
    suite.add(missingValueStackedColumnMouseOverTests);
    suite.add(missingValueStackedBarMouseOverTests);
    suite.add(categoryWithNumericValuesChart); 
    
    //add to the testrunner and run
    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['node-event-simulate', 'charts', 'test']});
