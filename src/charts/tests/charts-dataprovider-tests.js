YUI.add('charts-dataprovider-tests', function(Y) {
    //-------------------------------------------------------------------------
    // Chart dataProvider Test Case
    //-------------------------------------------------------------------------
    function ChartDataProviderTestCase(cfg, type)
    {
        ChartDataProviderTestCase.superclass.constructor.call(this);
        this.attrCfg = cfg;
        this.name = type + " DataProvider Tests";
    }
        
    Y.extend(ChartDataProviderTestCase, Y.Test.Case, {
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
            this.chart = new Y.Chart(this.attrCfg);
            this.contentBox = this.chart.get("contentBox");
        },
        
        /*
         * Removes event handlers that were used during the test.
         */
        tearDown : function() 
        {
            this.chart.destroy(true);
            Y.one("#testbed").remove(true);
        },

        testKeys: ["revenue", "expenses", "miscellaneous"],

        testDefault: function()
        {
            var chart = this.chart,
                testKeys = this.testKeys,
                seriesCollection = chart.get("seriesCollection"),
                i;
            for(i in testKeys)
            {
                Y.Assert.isTrue(seriesCollection.hasOwnProperty(i));
                Y.assert(seriesCollection[i] instanceof Y.CartesianSeries);
            }
        }
    });

    Y.ChartDataProviderTestCase = ChartDataProviderTestCase;             
    
    var suite = new Y.Test.Suite("Y.Charts.DataProvider"),

    allPositiveDataProvider =  [ 
        {category:"5/1/2010", values:2000, expenses:3700, revenue:2200}, 
        {category:"5/2/2010", values:50, expenses:9100, revenue:100}, 
        {category:"5/3/2010", values:400, expenses:1100, revenue:1500}, 
        {category:"5/4/2010", values:200, expenses:1900, revenue:2800}, 
        {category:"5/5/2010", values:5000, expenses:5000, revenue:2650}
    ],

    positiveAndNegativeDataProvider = [ 
        {category:"5/1/2010", values:2000, expenses:3700, revenue:2200}, 
        {category:"5/2/2010", values:50, expenses:9100, revenue:-100}, 
        {category:"5/3/2010", values:-400, expenses:-1100, revenue:1500}, 
        {category:"5/4/2010", values:200, expenses:1900, revenue:-2800}, 
        {category:"5/5/2010", values:5000, expenses:-5000, revenue:2650}
    ],

    allNegativeDataProvider = [ 
        {category:"5/1/2010", values:-2000, expenses:-3700, revenue:-2200}, 
        {category:"5/2/2010", values:-50, expenses:-9100, revenue:-100}, 
        {category:"5/3/2010", values:-400, expenses:-1100, revenue:-1500}, 
        {category:"5/4/2010", values:-200, expenses:-1900, revenue:-2800}, 
        {category:"5/5/2010", values:-5000, expenses:-5000, revenue:-2650}
    ],

    decimalDataProvider = [ 
        {category:"5/1/2010", values:2.45, expenses:3.71, revenue:2.2}, 
        {category:"5/2/2010", values:0.5, expenses:9.1, revenue:0.16}, 
        {category:"5/3/2010", values:1.4, expenses:1.14, revenue:1.25}, 
        {category:"5/4/2010", values:0.05, expenses:1.9, revenue:2.8}, 
        {category:"5/5/2010", values:5.53, expenses:5.21, revenue:2.65}
    ],
    
    missingDataSmallDataProvider = [
        {date: "1/1/2010", expenses: 3700},
        {date: "1/2/2010", revenue: 2200},
        {date: "2/1/2010", expenses: 9100},
        {date: "2/2/2010", revenue: 100}
    ],

    missingDataLargeDataProvider = [
        {date: "1/1/2010", expenses: 3700},
        {date: "1/2/2010", revenue: 2200},
        {date: "1/3/2010", expenses: 3000},
        {date: "1/4/2010", revenue: 400},
        {date: "2/1/2010", expenses: 9100},
        {date: "2/2/2010", revenue: 100},
        {date: "2/3/2010", expenses: 3300},
        {date: "2/4/2010", revenue: 1500}
    ],

    nullValuesDataProvider =  [ 
        {category:"5/1/2010", values:null, expenses:3700, revenue:2200}, 
        {category:"5/2/2010", values:50, expenses:null, revenue:100}, 
        {category:"5/3/2010", values:400, expenses:1100, revenue:null}, 
        {category:"5/4/2010", values:200, expenses:1900, revenue:2800}, 
        {category:"5/5/2010", values:5000, expenses:5000, revenue:2650}
    ],

    missingFirstValuesDataProvider =  [ 
        {category:"5/1/2010"}, 
        {category:"5/2/2010", values:50, expenses:9100, revenue:100}, 
        {category:"5/3/2010", values:400, expenses:1100, revenue:1500}, 
        {category:"5/4/2010", values:200, expenses:1900, revenue:2800}, 
        {category:"5/5/2010", values:5000, expenses:5000, revenue:2650}
    ],
    
    AllPositiveDataProviderTest = new Y.ChartDataProviderTestCase({
        dataProvider: allPositiveDataProvider
    }, "All Positive"),

    AllNegativeDataProviderTest = new Y.ChartDataProviderTestCase({
        dataProvider: allNegativeDataProvider
    }, "All Negative"),
    
    PositiveAndNegativeDataProviderTest = new Y.ChartDataProviderTestCase({
        dataProvider: positiveAndNegativeDataProvider
    }, "Positive and Negative"),

    DecimalDataProviderTest = new Y.ChartDataProviderTestCase({
        dataProvider: decimalDataProvider
    }, "Decimal");
    
    MissingSmallDataProviderTest = new Y.ChartDataProviderTestCase({
        dataProvider: missingDataSmallDataProvider
    }, "Missing Small");
    
    MissingLargeDataProviderTest = new Y.ChartDataProviderTestCase({
        dataProvider: missingDataLargeDataProvider
    }, "Missing Large"),
    
    NullValuesDataProviderTest = new Y.ChartDataProviderTestCase({
        dataProvider: nullValuesDataProvider
    }, "Null Values"),
    
    MissingFirstValuesDataProviderTest = new Y.ChartDataProviderTestCase({
        dataProvider: missingFirstValuesDataProvider
    }, "Missing First Values");
    
    suite.add(AllPositiveDataProviderTest);
    suite.add(PositiveAndNegativeDataProviderTest);
    suite.add(AllNegativeDataProviderTest);
    suite.add(DecimalDataProviderTest);
    suite.add(MissingSmallDataProviderTest);
    suite.add(MissingLargeDataProviderTest);
    suite.add(NullValuesDataProviderTest);
    suite.add(MissingFirstValuesDataProviderTest);

    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['charts', 'test']});
