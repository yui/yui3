YUI.add('charts-dataprovider-tests', function(Y) {
    //-------------------------------------------------------------------------
    // Chart dataProvider Test Case
    //-------------------------------------------------------------------------
    function ChartDataProviderTestCase(cfg, type)
    {
        ChartDataProviderTestCase.superclass.constructor.call(this);
        this.attrCfg = cfg;
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
                i;
            for(i in testKeys)
            {
                Y.Assert.isTrue(seriesCollection.hasOwnProperty(i));
                Y.assert(seriesCollection[i] instanceof Y.CartesianSeries);
            }
        }
    });

    Y.ChartDataProviderTestCase = ChartDataProviderTestCase;             
    
    var suite = new Y.Test.Suite("Charts: DataProvider"),

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
    },

    NullValuesDataProviderWithDashedLineTest = new Y.ChartDataProviderTestCase({
        seriesCollection: [
            {
                styles: {
                    line: {
                        discontinuousType: "dashed",
                        discontinuousDashLength: 3,
                        discontinuousGapSpace: 4,
                        connectDiscontinuousPoints: true
                    }
                }
            },
            {
                styles: {
                    line: {
                        discontinuousType: "dashed",
                        discontinuousDashLength: 3,
                        discontinuousGapSpace: 4,
                        connectDiscontinuousPoints: true
                    }
                }
            },
            {
                styles: {
                    line: {
                        discontinuousType: "dashed",
                        discontinuousDashLength: 3,
                        discontinuousGapSpace: 4,
                        connectDiscontinuousPoints: true
                    }
                }
            }
        ],
        dataProvider: nullValuesDataProvider
    }, "Null Values"),
    
    NullValuesDataProviderNullConnectDiscontinuousPointsFalseTest = new Y.ChartDataProviderTestCase({
        seriesCollection: [
            {
                styles: {
                    line: {
                        connectDiscontinuousPoints: false
                    }
                }
            },
            {
                styles: {
                    line: {
                        connectDiscontinuousPoints: false
                    }
                }
            },
            {
                styles: {
                    line: {
                        connectDiscontinuousPoints: false
                    }
                }
            }
        ],
        dataProvider: nullValuesDataProvider
    }, "Null Values"),
    
    DataProviderWithDashedLineTest = new Y.ChartDataProviderTestCase({
        seriesCollection: [
            {
                styles: {
                    line: {
                        lineType: "dashed",
                        dashLength: 3,
                        gapSpace: 4
                    }
                }
            },
            {
                styles: {
                    line: {
                        lineType: "dashed",
                        dashLength: 3,
                        gapSpace: 4
                    }
                }
            },
            {
                styles: {
                    line: {
                        lineType: "dashed",
                        dashLength: 3,
                        gapSpace: 4
                    }
                }
            }
        ],
        dataProvider: allPositiveDataProvider
    }, "Null Values");
    
    suite.add(getDataProviderTest(allPositiveDataProvider, "All Positive"));
    suite.add(getDataProviderTest(allNegativeDataProvider, "All Negative"));
    suite.add(getDataProviderTest(positiveAndNegativeDataProvider, "Positive and Negative"));      
    suite.add(getDataProviderTest(decimalDataProvider, "Decimal"));
    suite.add(getDataProviderTest(missingDataSmallDataProvider, "Missing Small"));
    suite.add(getDataProviderTest(missingDataLargeDataProvider, "Missing Large"));
    suite.add(getDataProviderTest(nullValuesDataProvider, "Null Values"));
    suite.add(getDataProviderTest(missingFirstValuesDataProvider, "Missing First Values"));
    suite.add(NullValuesDataProviderWithDashedLineTest);
    suite.add(NullValuesDataProviderNullConnectDiscontinuousPointsFalseTest);
    suite.add(DataProviderWithDashedLineTest);
    suite.add(getDataProviderTest(allPositiveDataProvider, "All Positive", true));
    suite.add(getDataProviderTest(allNegativeDataProvider, "All Negative", true));
    suite.add(getDataProviderTest(positiveAndNegativeDataProvider, "Positive and Negative", true));      
    suite.add(getDataProviderTest(decimalDataProvider, "Decimal", true));
    suite.add(getDataProviderTest(missingDataSmallDataProvider, "Missing Small", true));
    suite.add(getDataProviderTest(missingDataLargeDataProvider, "Missing Large", true));
    suite.add(getDataProviderTest(nullValuesDataProvider, "Null Values", true));
    suite.add(getDataProviderTest(missingFirstValuesDataProvider, "Missing First Values", true));
    
    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['charts', 'test']});
