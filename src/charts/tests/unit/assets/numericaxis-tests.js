YUI.add('numericaxis-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: NumericAxis"),
        AxisTestTemplate,
        parentDiv = Y.DOM.create('<div style="position:absolute;top:500px;left:0px;width:500px;height:400px" id="testdiv"></div>'),
        DOC = Y.config.doc;
    DOC.body.appendChild(parentDiv);
   
    AxisTestTemplate = function(cfg, globalCfg)
    {
        var i;
        AxisTestTemplate.superclass.constructor.apply(this);
        cfg.width = cfg.width || 400;
        cfg.height = cfg.height || 300;
        this.attrCfg = cfg;
        for(i in globalCfg)
        {
            if(globalCfg.hasOwnProperty(i))
            {
                this[i] = globalCfg[i];
            }
        }
    };

    Y.extend(AxisTestTemplate, Y.Test.Case, {
        setUp: function() {
            this.chart = new Y.Chart(this.attrCfg);
        },
        
        tearDown: function() {
            this.eventListener.detach();
            this.chart.destroy(true);
            Y.Event.purgeElement(DOC, false);
        }
    });
    
    var NumericAxisTestTemplate = function()
    {
        NumericAxisTestTemplate.superclass.constructor.apply(this, arguments);
    };

    Y.extend(NumericAxisTestTemplate, AxisTestTemplate, {
        //Tests a NumericAxis minimum and maximum by applying the labelFunction of the axis to the set minimum and maximum values and
        //then comparing the innerHTML of the first and last labels
        testMinAndMax: function()
        {
            var chart = this.chart,
                dataMax = this.dataMax,
                dataMin = this.dataMin;
            this.eventListener = this.chart.on("chartRendered", function(e) {
                var axis = chart.getAxisByKey("values"),
                    majorUnit = axis.get("styles").majorUnit,
                    labels = axis.get("labels"),
                    count = labels.length,
                    min = parseFloat(axis.getLabelByIndex(0, count)),
                    max = parseFloat(axis.getLabelByIndex(count - 1, count)),
                    roundingMethod = axis.get("roundingMethod"),
                    setIntervals = Y.Lang.isNumber(roundingMethod);
                Y.assert(max >= dataMax, max + " should be greater than or equal to " + dataMax); 
                Y.assert(min <= dataMin, min + " should be less than or equal to " + dataMin); 
                if(setIntervals)
                {
                    Y.assert((max - min) % roundingMethod === 0);
                }
                //if the roundingMethod is numeric the axis cannot guarantee that the minimum will be less than the data minimum
                if(!setIntervals || (count * roundingMethod) >= dataMax - dataMin)
                {
                    
                    Y.assert(min <= dataMin); 
                }
            });
            this.chart.render("#testdiv");
        }
    });

    Y.NumericAxisTestTemplate = NumericAxisTestTemplate;

    var allPositiveDataProvider =  [ 
        {category:"5/1/2010", values:2000, expenses:3700, revenue:2200}, 
        {category:"5/2/2010", values:50, expenses:9100, revenue:100}, 
        {category:"5/3/2010", values:400, expenses:1100, revenue:1500}, 
        {category:"5/4/2010", values:200, expenses:1900, revenue:2800}, 
        {category:"5/5/2010", values:5000, expenses:5000, revenue:2650}
    ],

    allPositiveDataProviderDataMax = 9100,

    allPositiveDataProviderDataMin = 50,

    allPositiveHighMinimumDataProvider =  [ 
        {category:"5/1/2010", values:2000, expenses:3700, revenue:2200}, 
        {category:"5/2/2010", values:5000, expenses:9100, revenue:5000}, 
        {category:"5/3/2010", values:4000, expenses:1100, revenue:1500}, 
        {category:"5/4/2010", values:2000, expenses:1900, revenue:2800}, 
        {category:"5/5/2010", values:5000, expenses:5000, revenue:2650}
    ],

    allPositiveDataProviderDataHighMin = 1100,
    
    positiveAndNegativeDataProvider = [ 
        {category:"5/1/2010", values:2000, expenses:3700, revenue:2200}, 
        {category:"5/2/2010", values:50, expenses:9100, revenue:-100}, 
        {category:"5/3/2010", values:-400, expenses:-1100, revenue:1500}, 
        {category:"5/4/2010", values:200, expenses:1900, revenue:-2800}, 
        {category:"5/5/2010", values:5000, expenses:-5000, revenue:2650}
    ],

    positiveAndNegativeDataProviderDataMax = 9100,

    positiveAndNegativeDataProviderDataMin = -5000,

    allNegativeDataProvider = [ 
        {category:"5/1/2010", values:-2000, expenses:-3700, revenue:-2200}, 
        {category:"5/2/2010", values:-500, expenses:-3100, revenue:-500}, 
        {category:"5/3/2010", values:-600, expenses:-1100, revenue:-1500}, 
        {category:"5/4/2010", values:-1200, expenses:-1900, revenue:-2800}, 
        {category:"5/5/2010", values:-5000, expenses:-5000, revenue:-2650}
    ],

    allNegativeDataProviderDataMax = -500,

    allNegativeDataProviderDataMin = -5000,

    allNegativeLowMaximumDataProvider = [ 
        {category:"5/1/2010", values:-2000, expenses:-3700, revenue:-2200}, 
        {category:"5/2/2010", values:-5000, expenses:-3100, revenue:-5000}, 
        {category:"5/3/2010", values:-6000, expenses:-1100, revenue:-1500}, 
        {category:"5/4/2010", values:-1200, expenses:-1900, revenue:-2800}, 
        {category:"5/5/2010", values:-5000, expenses:-5000, revenue:-2650}
    ],

    allNegativeDataProviderDataLowMax = -1100,

    allNegativeDataProviderNearZero = [ 
        {category:"5/1/2010", values:-2000, expenses:-3700, revenue:-2200}, 
        {category:"5/2/2010", values:-50, expenses:-9100, revenue:-100}, 
        {category:"5/3/2010", values:-400, expenses:-1100, revenue:-1500}, 
        {category:"5/4/2010", values:-200, expenses:-1900, revenue:-2800}, 
        {category:"5/5/2010", values:-5000, expenses:-5000, revenue:-2650}
    ],

    allNegativeDataProviderDataNearZeroMax = -50,

    allNegativeDataProviderDataNearZeroMin = -9100,
    
    decimalDataProvider = [ 
        {category:"5/1/2010", values:2.45, expenses:3.71, revenue:2.2}, 
        {category:"5/2/2010", values:0.5, expenses:9.1, revenue:0.16}, 
        {category:"5/3/2010", values:1.4, expenses:1.14, revenue:1.25}, 
        {category:"5/4/2010", values:0.05, expenses:1.9, revenue:2.8}, 
        {category:"5/5/2010", values:5.53, expenses:5.21, revenue:2.65}
    ],

    decimalDataProviderDataMax = 9.1,

    decimalDataProviderDataMin = 0.05,
   
    
    positiveAndNegativeDecimalDataProvider = [ 
        {category:"5/1/2010", values:-2.45, expenses:3.71, revenue:2.2}, 
        {category:"5/2/2010", values:0.5, expenses:-4.1, revenue:0.16}, 
        {category:"5/3/2010", values:1.4, expenses:1.14, revenue:-1.25}, 
        {category:"5/4/2010", values:-0.05, expenses:-1.9, revenue:2.8}, 
        {category:"5/5/2010", values:4.53, expenses:-5.21, revenue:2.65}
    ],

    positiveAndNegativeDecimalDataMax = 4.53,
    
    positiveAndNegativeDecimalDataMin = -4.1,
    
    AxisAllPositiveDataTest = new Y.NumericAxisTestTemplate({
        dataProvider: allPositiveDataProvider    
    },
    {
        name: "Axes All Positive Data Test",
        dataMax: allPositiveDataProviderDataMax,
        dataMin: allPositiveDataProviderDataMin
    }),
    
    AxisPositiveAndNegativeDataTest = new Y.NumericAxisTestTemplate({
        dataProvider: positiveAndNegativeDataProvider    
    },
    {
        name: "Axes Positive and Negative Data Test",
        dataMax: positiveAndNegativeDataProviderDataMax,
        dataMin: positiveAndNegativeDataProviderDataMin
    }),
    
    AxisAllNegativeDataTest = new Y.NumericAxisTestTemplate({
        dataProvider: allNegativeDataProvider    
    },
    {
        name: "Axes All Negative Data Test",
        dataMax: allNegativeDataProviderDataMax,
        dataMin: allNegativeDataProviderDataMin
    }),
   
    AxisAllNegativeDataNearZeroTest = new Y.NumericAxisTestTemplate({
        dataProvider: allNegativeDataProviderNearZero    
    },
    {
        name: "Axes All Negative Data Near Zero Test",
        dataMax: allNegativeDataProviderDataNearZeroMax,
        dataMin: allNegativeDataProviderDataNearZeroMax
    }),
   
    AxisAllPositiveDataAlwaysShowZeroFalseTest = new Y.NumericAxisTestTemplate({
        axes: {
            values: {
                alwaysShowZero: false
            }
        },
        dataProvider: allPositiveDataProvider
    },
    {
        name: "Axes All Positive Data, alwaysShowZero=false Test",
        dataMax: allPositiveDataProviderDataMax,
        dataMin: allPositiveDataProviderDataMin
    }),
    
    AxisPositiveAndNegativeDataAlwaysShowZeroFalseTest = new Y.NumericAxisTestTemplate({
        axes: {
            values: {
                alwaysShowZero: false
            }
        },
        dataProvider: positiveAndNegativeDataProvider    
    },
    {
        name: "Axes Positive and Negative Data, alwaysShowZero=false Test",
        dataMax: positiveAndNegativeDataProviderDataMax,
        dataMin: positiveAndNegativeDataProviderDataMin
    }),
    
    AxisAllNegativeDataAlwaysShowZeroFalseTest = new Y.NumericAxisTestTemplate({
        axes: {
            values: {
                alwaysShowZero: false
            }
        },
        dataProvider: allNegativeDataProvider    
    },
    {
        name: "Axes All Negative Data, alwaysShowZero=false Test",
        dataMax: allNegativeDataProviderDataMax,
        dataMin: allNegativeDataProviderDataMin
    }),
   
    AxisAllNegativeDataNearZeroAlwaysShowZeroFalseTest = new Y.NumericAxisTestTemplate({
        axes: {
            values: {
                alwaysShowZero: false
            }
        },
        dataProvider: allNegativeDataProviderNearZero    
    },
    {
        name: "Axes All Negative Data Near Zero, alwaysShowZero=false Test",
        dataMax: allNegativeDataProviderDataNearZeroMax,
        dataMin: allNegativeDataProviderDataNearZeroMin
    }),
    
    AxisAllPositiveDataNumericRoundingMethodTest = new Y.NumericAxisTestTemplate({
        axes: {
            values: {
                roundingMethod: 1000
            }
        },
        dataProvider: allPositiveDataProvider
    },
    {
        name: "Axes All Positive Data with Numeric roundingMethod Test",
        dataMax: allPositiveDataProviderDataMax,
        dataMin: allPositiveDataProviderDataMin
    }),
    
    AxisAllPositiveDataNumericRoundingMethodAlwaysShowZeroFalseTest = new Y.NumericAxisTestTemplate({
        axes: {
            values: {
                roundingMethod: 1000,
                alwaysShowZero: false
            }
        },
        dataProvider: allPositiveHighMinimumDataProvider
    },
    {
        name: "Axes All Positive Data with Numeric roundingMethod and alwaysShowZero=false Test",
        dataMax: allPositiveDataProviderDataMax,
        dataMin: allPositiveDataProviderDataHighMin
    }),
    
    AxisAllNegativeDataNumericRoundingMethodAlwaysShowZeroFalseTest = new Y.NumericAxisTestTemplate({
        axes: {
            values: {
                roundingMethod: 1000,
                alwaysShowZero: false
            }
        },
        dataProvider: allNegativeLowMaximumDataProvider
    },
    {
        name: "Axes All Negative Data with Numeric roundingMethod and alwaysShowZero=false Test",
        dataMax: allNegativeDataProviderDataLowMax,
        dataMin: allNegativeDataProviderDataMin
    }),
    
    AxisPositiveAndNegativeDataNumericRoundingMethodTest = new Y.NumericAxisTestTemplate({
        axes: {
            values: {
                roundingMethod: 1000
            }
        },
        dataProvider: positiveAndNegativeDataProvider    
    },
    {
        name: "Axes Positive and Negative Data with Numeric roundingMethod Test",
        dataMax: positiveAndNegativeDataProviderDataMax,
        dataMin: positiveAndNegativeDataProviderDataMin
    }),
    
    AxisAllNegativeDataNumericRoundingMethodTest = new Y.NumericAxisTestTemplate({
        axes: {
            values: {
                roundingMethod: 1000
            }
        },
        dataProvider: allNegativeDataProvider    
    },
    {
        name: "Axes All Negative Data with Numeric roundingMethod Test",
        dataMax: allNegativeDataProviderDataMax,
        dataMin: allNegativeDataProviderDataMin
    }),
    
    AxisAllPositiveDataAutoRoundingMethodTest = new Y.NumericAxisTestTemplate({
        axes: {
            values: {
                roundingMethod: "auto"
            }
        },
        dataProvider: allPositiveDataProvider
    },
    {
        name: "Axes All Positive Data with Numeric roundingMethod Test",
        dataMax: allPositiveDataProviderDataMax,
        dataMin: allPositiveDataProviderDataMin
    }),
    
    AxisPositiveAndNegativeDataAutoRoundingMethodTest = new Y.NumericAxisTestTemplate({
        axes: {
            values: {
                roundingMethod: "auto"
            }
        },
        dataProvider: positiveAndNegativeDataProvider    
    },
    {
        name: "Axes Positive and Negative Data with Auto roundingMethod Test",
        dataMax: positiveAndNegativeDataProviderDataMax,
        dataMin: positiveAndNegativeDataProviderDataMin
    }),
    
    AxisAllNegativeDataAutoRoundingMethodTest = new Y.NumericAxisTestTemplate({
        axes: {
            values: {
                roundingMethod: "auto"
            }
        },
        dataProvider: allNegativeDataProvider    
    },
    {
        name: "Axes All Negative Data with Numeric roundingMethod Test",
        dataMax: allNegativeDataProviderDataMax,
        dataMin: allNegativeDataProviderDataMin
    }),

    AxisPositiveAndNegativeDecimalDataAutoRoundingMethodTest = new Y.NumericAxisTestTemplate({
        axes: {
            values: {
                roundingMethod: "auto"
            }
        },
        dataProvider: positiveAndNegativeDecimalDataProvider    
    },
    {
        name: "Axes Positive and Negative Decimal Data with Numeric roundingMethod Test",
        dataMax: positiveAndNegativeDecimalDataMax,
        dataMin: positiveAndNegativeDecimalDataMin
    }),

    AxisAllPositiveDataAutoRoundingMethodAlwaysShowZeroFalseTest = new Y.NumericAxisTestTemplate({
        axes: {
            values: {
                alwaysShowZero: false,
                roundingMethod: "auto"
            }
        },
        dataProvider: allPositiveDataProvider
    },
    {
        name: "Axes All Positive Data with Auto roundingMethod alwaysShowZero=false Test",
        dataMax: allPositiveDataProviderDataMax,
        dataMin: allPositiveDataProviderDataMin
    }),
    
    AxisPositiveAndNegativeDataAutoRoundingMethodAlwaysShowZeroFalseTest = new Y.NumericAxisTestTemplate({
        axes: {
            values: {
                alwaysShowZero: false,
                roundingMethod: "auto"
            }
        },
        dataProvider: positiveAndNegativeDataProvider    
    },
    {
        name: "Axes Positive and Negative Data with Auto roundingMethod alwaysShowZero=false Test",
        dataMax: positiveAndNegativeDataProviderDataMax,
        dataMin: positiveAndNegativeDataProviderDataMin
    }),
    
    AxisAllNegativeDataAutoRoundingMethodAlwaysShowZeroFalseTest = new Y.NumericAxisTestTemplate({
        axes: {
            values: {
                alwaysShowZero: false,
                roundingMethod: "auto"
            }
        },
        dataProvider: allNegativeDataProvider    
    },
    {
        name: "Axes All Negative Data with Auto roundingMethod alwaysShowZero=false Test",
        dataMax: allNegativeDataProviderDataMax,
        dataMin: allNegativeDataProviderDataMin
    }),
    
    AxisWithEmptyDataProvider = new Y.NumericAxisTestTemplate({
        dataProvider: []
    },
    {
        name: "No Data"
    }),
    
    AxisWithNoDataProvider = new Y.NumericAxisTestTemplate({
    },
    {
        name: "No Data"
    });
    
    suite.add(AxisAllPositiveDataTest);
    suite.add(AxisPositiveAndNegativeDataTest);
    suite.add(AxisAllNegativeDataTest);
    suite.add(AxisAllNegativeDataNearZeroTest);
    suite.add(AxisAllPositiveDataAlwaysShowZeroFalseTest);
    suite.add(AxisPositiveAndNegativeDataAlwaysShowZeroFalseTest);
    suite.add(AxisAllNegativeDataAlwaysShowZeroFalseTest);
    suite.add(AxisAllNegativeDataNearZeroAlwaysShowZeroFalseTest);
    suite.add(AxisAllPositiveDataNumericRoundingMethodTest);
    suite.add(AxisPositiveAndNegativeDataNumericRoundingMethodTest);
    suite.add(AxisAllNegativeDataNumericRoundingMethodTest);
    suite.add(AxisAllPositiveDataAutoRoundingMethodTest);
    suite.add(AxisPositiveAndNegativeDataAutoRoundingMethodTest);
    suite.add(AxisPositiveAndNegativeDecimalDataAutoRoundingMethodTest);
    suite.add(AxisAllNegativeDataAutoRoundingMethodTest);
    suite.add(AxisAllPositiveDataAutoRoundingMethodAlwaysShowZeroFalseTest);
    suite.add(AxisPositiveAndNegativeDataAutoRoundingMethodAlwaysShowZeroFalseTest);
    suite.add(AxisAllNegativeDataAutoRoundingMethodAlwaysShowZeroFalseTest);
    suite.add(AxisAllPositiveDataNumericRoundingMethodAlwaysShowZeroFalseTest);
    suite.add(AxisAllNegativeDataNumericRoundingMethodAlwaysShowZeroFalseTest);
    suite.add(AxisWithEmptyDataProvider);
    suite.add(AxisWithNoDataProvider);

    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['charts', 'test']});
