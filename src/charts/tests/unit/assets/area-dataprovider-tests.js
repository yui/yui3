YUI.add('area-dataprovider-tests', function(Y) {
    //-------------------------------------------------------------------------
    // Chart dataProvider Test Case
    //-------------------------------------------------------------------------
    function ChartDataProviderTestCase(cfg, type)
    {
        ChartDataProviderTestCase.superclass.constructor.call(this);
        this.attrCfg = cfg;
        this.attrCfg.type = "area";
        this.attrCfg.seriesKeys = ["miscellaneous", "revenue", "expenses"];
        this.attrCfg.render = "#mychart";
        this.name = type + " DataProvider Tests";
    }
        
    Y.extend(ChartDataProviderTestCase, Y.Test.Case, {
        //---------------------------------------------------------------------
        // Setup and teardown of test harnesses
        //---------------------------------------------------------------------
        
        setUp : function() 
        {
            Y.one("body").append('<div id="testbed"></div>');
            Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="mychart"></div>');
            this.chart = new Y.Chart(this.attrCfg);
            this.contentBox = this.chart.get("contentBox");
        },
        
        tearDown : function() 
        {
            this.chart.destroy(true);
            Y.one("#testbed").destroy(true);
        },

        testKeys: ["revenue", "expenses", "miscellaneous"],

        testDefault: function()
        {
            var chart = this.chart,
                testKeys = this.testKeys,
                seriesCollection = chart.get("seriesCollection"),
                i,
                len = testKeys.length;
            for(; i < len; i = i + 1)
            {
                Y.Assert.isTrue(seriesCollection[i].hasOwnProperty(testKeys[i]), "The series should include the property of " + testKeys[i] + ".");
                Y.Assert.isTrue(seriesCollection[i] instanceof Y.CartesianSeries, "The series should be an instance of CartesianSeries.");
            }
        }
    });

    Y.ChartDataProviderTestCase = ChartDataProviderTestCase;             
    
    var suite = new Y.Test.Suite("Charts: AreaDataProvider"),

    allPositiveDataProvider =  [ 
        {category:"5/1/2010", miscellaneous:2000, expenses:3700, revenue:2200}, 
        {category:"5/2/2010", miscellaneous:50, expenses:9100, revenue:100}, 
        {category:"5/3/2010", miscellaneous:400, expenses:1100, revenue:1500}, 
        {category:"5/4/2010", miscellaneous:200, expenses:1900, revenue:2800}, 
        {category:"5/5/2010", miscellaneous:5000, expenses:5000, revenue:2650}
    ],

    positiveAndNegativeDataProvider = [ 
        {category:"5/1/2010", miscellaneous:2000, expenses:3700, revenue:2200}, 
        {category:"5/2/2010", miscellaneous:50, expenses:9100, revenue:-100}, 
        {category:"5/3/2010", miscellaneous:-400, expenses:-1100, revenue:1500}, 
        {category:"5/4/2010", miscellaneous:200, expenses:1900, revenue:-2800}, 
        {category:"5/5/2010", miscellaneous:5000, expenses:-5000, revenue:2650}
    ],

    allNegativeDataProvider = [ 
        {category:"5/1/2010", miscellaneous:-2000, expenses:-3700, revenue:-2200}, 
        {category:"5/2/2010", miscellaneous:-50, expenses:-9100, revenue:-100}, 
        {category:"5/3/2010", miscellaneous:-400, expenses:-1100, revenue:-1500}, 
        {category:"5/4/2010", miscellaneous:-200, expenses:-1900, revenue:-2800}, 
        {category:"5/5/2010", miscellaneous:-5000, expenses:-5000, revenue:-2650}
    ],

    decimalDataProvider = [ 
        {category:"5/1/2010", miscellaneous:2.45, expenses:3.71, revenue:2.2}, 
        {category:"5/2/2010", miscellaneous:0.5, expenses:9.1, revenue:0.16}, 
        {category:"5/3/2010", miscellaneous:1.4, expenses:1.14, revenue:1.25}, 
        {category:"5/4/2010", miscellaneous:0.05, expenses:1.9, revenue:2.8}, 
        {category:"5/5/2010", miscellaneous:5.53, expenses:5.21, revenue:2.65}
    ],
    
    missingDataSmallDataProvider = [
        {category: "1/1/2010", expenses: 3700},
        {category: "1/2/2010", revenue: 2200},
        {category: "2/1/2010", expenses: 9100},
        {category: "2/2/2010", revenue: 100}
    ],

    missingDataLargeDataProvider = [
        {category:"1/1/2010", miscellaneous:2000, expenses:3000},
        {category:"2/1/2010", miscellaneous:3000, expenses:1200, revenue:3000},
        {category:"3/1/2010", miscellaneous:400, expenses:900,  revenue: 3500},
        {category:"4/1/2010", miscellaneous:200, expenses:2300, revenue:2200},
        {category:"5/1/2010", miscellaneous:500, expenses:1550, revenue: 2400},
        {category:"6/1/2010", expenses:1450, revenue:4400},
        {category:"7/1/2010", miscellaneous:3000, expenses:1250, revenue:1200},
        {category:"8/1/2010", miscellaneous:6550, expenses:1100, revenue:1400},
        {category:"9/1/2010", miscellaneous:4000, expenses:1900, revenue:3600},
        {category:"10/1/2010", expenses:1100, revenue:1500},
        {category:"11/1/2010", miscellaneous:1200, expenses:2500, revenue:2800},
        {category:"12/1/2010", revenue:2000, expenses:1200}
    ],

    nullValuesDataProvider =  [ 
        {category:"5/1/2010", miscellaneous:null, expenses:3700, revenue:2200}, 
        {category:"5/2/2010", miscellaneous:50, expenses:null, revenue:100}, 
        {category:"5/3/2010", miscellaneous:400, expenses:1100, revenue:null}, 
        {category:"5/4/2010", miscellaneous:200, expenses:1900, revenue:2800}, 
        {category:"5/5/2010", miscellaneous:5000, expenses:5000, revenue:2650}
    ],

    missingFirstValuesDataProvider =  [ 
        {category:"5/1/2010"}, 
        {category:"5/2/2010", miscellaneous:50, expenses:9100, revenue:100}, 
        {category:"5/3/2010", miscellaneous:400, expenses:1100, revenue:1500}, 
        {category:"5/4/2010", miscellaneous:200, expenses:1900, revenue:2800}, 
        {category:"5/5/2010", miscellaneous:5000, expenses:5000, revenue:2650}
    ],
    
    missingFirstValuesDataLargeDataProvider = [
        {category:"1/1/2010", miscellaneous:2000},
        {category:"2/1/2010", miscellaneous:3000},
        {category:"3/1/2010", expenses:900,  revenue: 3500},
        {category:"4/1/2010", expenses:2300, revenue:2200},
        {category:"5/1/2010", expenses:1550, revenue: 2400},
        {category:"6/1/2010", expenses:1450, revenue:4400},
        {category:"7/1/2010", expenses:1250, revenue:1200},
        {category:"8/1/2010", expenses:1100, revenue:1400},
        {category:"9/1/2010", expenses:1900, revenue:3600},
        {category:"10/1/2010", expenses:1100, revenue:1500},
        {category:"11/1/2010", expenses:2500, revenue:2800},
        {category:"12/1/2010", revenue:2000, expenses:1200}
    ],

    missingLastValuesDataLargeDataProvider = [
        {category:"1/1/2010", expenses:3000, revenue:3000},
        {category:"2/1/2010", expenses:1200, revenue:3000},
        {category:"3/1/2010", expenses:900,  revenue: 3500},
        {category:"4/1/2010", expenses:2300, revenue:2200},
        {category:"5/1/2010", expenses:1550, revenue: 2400},
        {category:"6/1/2010", expenses:1450, revenue:4400},
        {category:"7/1/2010", expenses:1250, revenue:1200},
        {category:"8/1/2010", expenses:1100, revenue:1400},
        {category:"9/1/2010", expenses:1900, revenue:3600},
        {category:"10/1/2010", expenses:1100, revenue:1500},
        {category:"11/1/2010", miscellaneous:1200},
        {category:"12/1/2010", miscellaneous:2000}
    ],
   
    splitTrailingSeriesDataProvider = [
        {category:"1/1/2010", revenue:1400},
        {category:"2/1/2010", revenue: 300},
        {category:"3/1/2010", revenue:400, expenses:900},
        {category:"4/1/2010", revenue:200, expenses:2300},
        {category:"5/1/2010", revenue:500, expenses:1550},
        {category:"6/1/2010", expenses:1450},
        {category:"7/1/2010", revenue:3000, expenses:1250},
        {category:"8/1/2010", revenue:6550, expenses:1100},
        {category:"9/1/2010", revenue:4000, expenses:1900},
        {category:"10/1/2010", expenses:1100},
        {category:"11/1/2010", miscellaneous:1200, expenses:2500},
        {category:"12/1/2010", miscellaneous: 1200, expenses:1200}

    ],
    
    twoSeriesEndTogetherDataProvider = [
        {category:"1/1/2010", revenue:2000, expenses:3000},
        {category:"2/1/2010", revenue:3000, expenses:1200, miscellaneous:3000},
        {category:"3/1/2010", revenue:400, expenses:900,  miscellaneous: 3500},
        {category:"4/1/2010", revenue:200, expenses:2300, miscellaneous:2200},
        {category:"5/1/2010", revenue:500, expenses:1550, miscellaneous: 2400},
        {category:"6/1/2010", expenses:1450, miscellaneous:4400},
        {category:"7/1/2010", revenue:3000, expenses:1250, miscellaneous:1200},
        {category:"8/1/2010", revenue:6550, expenses:1100, miscellaneous:1400},
        {category:"9/1/2010", revenue:4000, expenses:1900, miscellaneous:3600},
        {category:"10/1/2010", expenses:1100, miscellaneous:1500},
        {category:"11/1/2010", revenue:1200, expenses:2500, miscellaneous:2800},
        {category:"12/1/2010", expenses:1200}
    ],

    getDataProviderTest = function(dataProvider, name, stacked)
    {
        var cfg = {
            dataProvider: dataProvider 
        };
        if(stacked)
        {
            name += " Stacked";
            cfg.stacked = stacked;
        }
        return new Y.ChartDataProviderTestCase(cfg, name);
    };
    
    suite.add(getDataProviderTest(allPositiveDataProvider, "All Positive"));
    suite.add(getDataProviderTest(allNegativeDataProvider, "All Negative"));
    suite.add(getDataProviderTest(positiveAndNegativeDataProvider, "Positive and Negative"));      
    suite.add(getDataProviderTest(decimalDataProvider, "Decimal"));
    suite.add(getDataProviderTest(missingDataSmallDataProvider, "Missing Small"));
    suite.add(getDataProviderTest(missingDataLargeDataProvider, "Missing Large"));
    suite.add(getDataProviderTest(nullValuesDataProvider, "Null Values"));
    suite.add(getDataProviderTest(missingFirstValuesDataProvider, "Missing First Values"));
    suite.add(getDataProviderTest(allPositiveDataProvider, "All Positive", true));
    suite.add(getDataProviderTest(allNegativeDataProvider, "All Negative", true));
    suite.add(getDataProviderTest(positiveAndNegativeDataProvider, "Positive and Negative", true));      
    suite.add(getDataProviderTest(decimalDataProvider, "Decimal", true));
    suite.add(getDataProviderTest(missingDataSmallDataProvider, "Missing Small", true));
    suite.add(getDataProviderTest(missingDataLargeDataProvider, "Missing Large", true));
    suite.add(getDataProviderTest(nullValuesDataProvider, "Null Values", true));
    suite.add(getDataProviderTest(missingFirstValuesDataProvider, "Missing First Values", true));
    suite.add(getDataProviderTest(missingDataLargeDataProvider, "Missing Values Large Data"));
    suite.add(getDataProviderTest(missingDataLargeDataProvider, "Missing Values Large Data", true));
    suite.add(getDataProviderTest(missingFirstValuesDataLargeDataProvider, "Missing First Values Large Data"));
    suite.add(getDataProviderTest(missingFirstValuesDataLargeDataProvider, "Missing First Values Large Data", true));
    suite.add(getDataProviderTest(missingLastValuesDataLargeDataProvider, "Missing Last Values Large Data"));
    suite.add(getDataProviderTest(missingLastValuesDataLargeDataProvider, "Missing Last Values Large Data", true));
    suite.add(getDataProviderTest(splitTrailingSeriesDataProvider, "Split Trailing Series DataProvider"));
    suite.add(getDataProviderTest(splitTrailingSeriesDataProvider, "Split Trailing Series DataProvider", true));
    suite.add(getDataProviderTest(twoSeriesEndTogetherDataProvider, "Two Series End Together DataProvider"));
    suite.add(getDataProviderTest(twoSeriesEndTogetherDataProvider, "Two Series End Together DataProvider", true));
   
    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['charts', 'test']});
