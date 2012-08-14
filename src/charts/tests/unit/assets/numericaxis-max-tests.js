YUI.add('numericaxis-max-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: NumericAxisMax"),    
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
            Y.one("body").append('<div id="testbed"></div>');
            Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="mychart"></div>');
            this.chart = new Y.Chart(this.attrCfg);
        },
        
        tearDown: function() {
            this.eventListener.detach();
            this.chart.destroy(true);
            Y.one("#testbed").destroy(true);
        }
    });
    
    var AxisMaxTestTemplate = function()
    {
        AxisMaxTestTemplate.superclass.constructor.apply(this, arguments);
    };

    Y.extend(AxisMaxTestTemplate, AxisTestTemplate, {
        //Tests a NumericAxis minimum and maximum by applying the labelFunction of the axis to the set minimum and maximum values and
        //then comparing the innerHTML of the first and last labels
        testMax: function()
        {
            var chart = this.chart,
                setMax = this.setMax,
                dataMin = this.dataMin;
            this.eventListener = this.chart.on("chartRendered", function(e) {
                var axis = chart.getAxisByKey("values"),
                    majorUnit = axis.get("styles").majorUnit,
                    count = majorUnit.count - 1,
                    labels = axis.get("labels"),
                    min = parseFloat(labels[0].innerHTML),
                    max = labels[count].innerHTML,
                    roundingMethod = axis.get("roundingMethod"),
                    setIntervals = Y.Lang.isNumber(roundingMethod);
                Y.assert(max == axis.get("labelFunction").apply(axis, [setMax, axis.get("labelFormat")])); 
                if(setIntervals)
                {
                    Y.assert((max - min) % roundingMethod === 0);
                }
                //if the roundingMethod is numeric the axis cannot guarantee that the minimum will be less than the data minimum
                if(!setIntervals || (count * roundingMethod) >= setMax - dataMin)
                {
                    Y.assert(min <= dataMin); 
                }
            });
            this.chart.render("#mychart");
        }
    });

    Y.AxisMaxTestTemplate = AxisMaxTestTemplate;

    var allPositiveDataProvider =  [ 
        {category:"5/1/2010", values:2000, expenses:3700, revenue:2200}, 
        {category:"5/2/2010", values:50, expenses:9100, revenue:100}, 
        {category:"5/3/2010", values:400, expenses:1100, revenue:1500}, 
        {category:"5/4/2010", values:200, expenses:1900, revenue:2800}, 
        {category:"5/5/2010", values:5000, expenses:5000, revenue:2650}
    ],

    allPositiveDataProviderDataMax = 9100,

    allPositiveDataProviderDataMin = 50,

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
        {category:"5/2/2010", values:-50, expenses:-9100, revenue:-100}, 
        {category:"5/3/2010", values:-400, expenses:-1100, revenue:-1500}, 
        {category:"5/4/2010", values:-200, expenses:-1900, revenue:-2800}, 
        {category:"5/5/2010", values:-5000, expenses:-5000, revenue:-2650}
    ],

    allNegativeDataProviderDataMax = -50,

    allNegativeDataProviderDataMin = -9100,

    decimalDataProvider = [ 
        {category:"5/1/2010", values:2.45, expenses:3.71, revenue:2.2}, 
        {category:"5/2/2010", values:0.5, expenses:9.1, revenue:0.16}, 
        {category:"5/3/2010", values:1.4, expenses:1.14, revenue:1.25}, 
        {category:"5/4/2010", values:0.05, expenses:1.9, revenue:2.8}, 
        {category:"5/5/2010", values:5.53, expenses:5.21, revenue:2.65}
    ],

    decimalDataProviderDataMax = 9.1,

    decimalDataProviderDataMin = 0.05,
    
    AxisMaxTest = new Y.AxisMaxTestTemplate({
        axes: {
            values: {
                maximum: 1492
            }
        },
        dataProvider: allPositiveDataProvider    
    },
    {
        name: "Axes Max Test",
        setMax: 1492,
        dataMin: allPositiveDataProviderDataMin
    }),

    //Tests setting a NumericAxis maximum with alwaysShowZero as false
    AxisMaxAlwaysShowZeroFalseTest = new Y.AxisMaxTestTemplate({
        axes: {
            values: {
                maximum: 1492,
                alwaysShowZero: false
            }
        },
        dataProvider: allPositiveDataProvider    
    },
    {
        name: "Axes Max Test with alwaysShowZero as false",
        setMax: 1492,
        dataMin: allPositiveDataProviderDataMin
    }),

    //tests negative maximum value 
    AxisNegativeMaxTest = new Y.AxisMaxTestTemplate({
        axes: {
            values: {
                maximum: -500
            }
        },
        dataProvider: allNegativeDataProvider
    },
    {    
        name: "Axes Negative Max Test",
        setMax: -500,
        dataMin: allNegativeDataProviderDataMin
    }),
    
    AxisMaxWithDecimalsTest = new Y.AxisMaxTestTemplate({
        axes: {
            values: {
                maximum: 7.5
            }
        },
        dataProvider: decimalDataProvider
    },
    {
        name: "Axes Max with Decimals Test",
        dataMin: decimalDataProviderDataMin,
        setMax: 7.5
    }),
    
    AxisMaxIntegerDecimalDataTest= new Y.AxisMaxTestTemplate({
        axes: {
            values: {
                maximum: 8 
            }
        },
        dataProvider: decimalDataProvider
    },
    {
        name: "Axes Integer Max with Decimal Data Test",
        dataMin: decimalDataProviderDataMin,
        setMax: 8
    }),
    
    AxisMaxWithPositiveAndNegativeDataTest = new Y.AxisMaxTestTemplate({
        axes: {
            values: {
                maximum: 1492
            }
        },
        dataProvider: positiveAndNegativeDataProvider   
    },
    {
        name: "Axes Max Test",
        setMax: 1492,
        dataMin: positiveAndNegativeDataProviderDataMin
    }),
    
    AxisMaxWithPositiveAndNegativeDataAlwaysShowZeroFalseTest = new Y.AxisMaxTestTemplate({
        axes: {
            values: {
                maximum: 1492,
                alwaysShowZero: false
            }
        },
        dataProvider: positiveAndNegativeDataProvider   
    },
    {
        name: "Axes Max Test with Positive and Negative values and alwaysShowZero=false",
        setMax: 1492,
        dataMin: positiveAndNegativeDataProviderDataMin
    }),
    
    AxisMaxWithPositiveAndNegativeDataAndLargeMaxTest = new Y.AxisMaxTestTemplate({
        axes: {
            values: {
                maximum: 10000
            }
        },
        dataProvider: positiveAndNegativeDataProvider   
    },
    {
        name: "Axes Max Test",
        setMax: 10000,
        dataMin: positiveAndNegativeDataProviderDataMin
    }),
    
    AxisMaxWithPositiveAndNegativeDataAndSmallMaxTest = new Y.AxisMaxTestTemplate({
        axes: {
            values: {
                maximum: 10
            }
        },
        dataProvider: positiveAndNegativeDataProvider   
    },
    {
        name: "Axes Max Test",
        setMax: 10,
        dataMin: positiveAndNegativeDataProviderDataMin
    }),
    
    AxisMaxRoundingMethodAutoTest = new Y.AxisMaxTestTemplate({
        axes: {
            values: {
                roundingMethod: "auto",
                maximum: 1492
            }
        },
        dataProvider: allPositiveDataProvider    
    },
    {
        name: "Axes Max Test with roundingMethod=auto",
        setMax: 1492,
        dataMin: allPositiveDataProviderDataMin
    }),
    
    AxisNegativeMaxRoundingMethodAutoTest = new Y.AxisMaxTestTemplate({
        axes: {
            values: {
                roundingMethod: "auto",
                maximum: -500
            }
        },
        dataProvider: allNegativeDataProvider
    },
    {    
        name: "Axes Negative Max Test with roundingMethod=auto",
        setMax: -500,
        dataMin: allNegativeDataProviderDataMin
    }),
    
    AxisMaxWithDecimalsRoundingMethodAutoTest = new Y.AxisMaxTestTemplate({
        axes: {
            values: {
                roundingMethod: "auto",
                maximum: 7.5
            }
        },
        dataProvider: decimalDataProvider
    },
    {
        name: "Axes Max with Decimals Test with roundingMethod=auto",
        dataMin: decimalDataProviderDataMin,
        setMax: 7.5
    }),
 
    AxisMaxIntegerDecimalDataRoundingMethodAutoTest= new Y.AxisMaxTestTemplate({
        axes: {
            values: {
                roundingMethod: "auto",
                maximum: 8 
            }
        },
        dataProvider: decimalDataProvider
    },
    {
        name: "Axes Integer Max with Decimal Data Test with roundingMethod=auto",
        dataMin: decimalDataProviderDataMin,
        setMax: 8
    }),

    AxisMaxWithPositiveAndNegativeDataRoundingMethodAutoTest = new Y.AxisMaxTestTemplate({
        axes: {
            values: {
                roundingMethod: "auto",
                maximum: 1492
            }
        },
        dataProvider: positiveAndNegativeDataProvider   
    },
    {
        name: "Axes Max Test with roundingMethod=auto",
        setMax: 1492,
        dataMin: positiveAndNegativeDataProviderDataMin
    }),
    
    AxisMaxRoundingMethodNullTest = new Y.AxisMaxTestTemplate({
        axes: {
            values: {
                roundingMethod: null,
                maximum: 1492
            }
        },
        dataProvider: allPositiveDataProvider    
    },
    {
        name: "Axes Max Test with roundingMethod=null",
        setMax: 1492,
        dataMin: allPositiveDataProviderDataMin
    }),
    
    AxisNegativeMaxRoundingMethodNullTest = new Y.AxisMaxTestTemplate({
        axes: {
            values: {
                roundingMethod: null,
                maximum: -500
            }
        },
        dataProvider: allNegativeDataProvider
    },
    {    
        name: "Axes Negative Max Test with roundingMethod=null",
        setMax: -500,
        dataMin: allNegativeDataProviderDataMin
    }),
    
    AxisMaxWithDecimalsRoundingMethodNullTest = new Y.AxisMaxTestTemplate({
        axes: {
            values: {
                roundingMethod: null,
                maximum: 7.5
            }
        },
        dataProvider: decimalDataProvider
    },
    {
        name: "Axes Max with Decimals Test with roundingMethod=null",
        dataMin: decimalDataProviderDataMin,
        setMax: 7.5
    }),
 
    AxisMaxIntegerDecimalDataRoundingMethodNullTest= new Y.AxisMaxTestTemplate({
        axes: {
            values: {
                roundingMethod: null,
                maximum: 8 
            }
        },
        dataProvider: decimalDataProvider
    },
    {
        name: "Axes Integer Max with Decimal Data Test with roundingMethod=null",
        dataMin: decimalDataProviderDataMin,
        setMax: 8
    }),

    AxisMaxWithPositiveAndNegativeDataRoundingMethodNullTest = new Y.AxisMaxTestTemplate({
        axes: {
            values: {
                roundingMethod: null,
                maximum: 1492
            }
        },
        dataProvider: positiveAndNegativeDataProvider   
    },
    {
        name: "Axes Max Test with roundingMethod=null",
        setMax: 1492,
        dataMin: positiveAndNegativeDataProviderDataMin
    }),
    
    AxisMaxRoundingMethodNumericTest = new Y.AxisMaxTestTemplate({
        axes: {
            values: {
                roundingMethod: 1000,
                maximum: 1492
            }
        },
        dataProvider: allPositiveDataProvider    
    },
    {
        name: "Axes Max Test with roundingMethod=1000",
        setMax: 1492,
        dataMin: allPositiveDataProviderDataMin
    }),
    
    AxisNegativeMaxRoundingMethodNumericTest = new Y.AxisMaxTestTemplate({
        axes: {
            values: {
                roundingMethod: 1000,
                maximum: -500
            }
        },
        dataProvider: allNegativeDataProvider
    },
    {    
        name: "Axes Negative Max Test with roundingMethod=1000",
        setMax: -500,
        dataMin: allNegativeDataProviderDataMin
    }),
    
    AxisMaxWithDecimalsRoundingMethodNumericTest = new Y.AxisMaxTestTemplate({
        axes: {
            values: {
                roundingMethod: 2,
                maximum: 7.5
            }
        },
        dataProvider: decimalDataProvider
    },
    {
        name: "Axes Max with Decimals Test with roundingMethod=2",
        dataMin: decimalDataProviderDataMin,
        setMax: 7.5
    }),
 
    AxisMaxIntegerDecimalDataRoundingMethodNumericTest= new Y.AxisMaxTestTemplate({
        axes: {
            values: {
                roundingMethod: 2,
                maximum: 8 
            }
        },
        dataProvider: decimalDataProvider
    },
    {
        name: "Axes Integer Max with Decimal Data Test with roundingMethod=2",
        dataMin: decimalDataProviderDataMin,
        setMax: 8
    }),

    AxisMaxWithPositiveAndNegativeDataRoundingMethodNumericTest = new Y.AxisMaxTestTemplate({
        axes: {
            values: {
                maximum: 1492,
                roundingMethod: 1000
            }
        },
        dataProvider: positiveAndNegativeDataProvider   
    },
    {
        name: "Axes Max with Positive and Negative Data Test with roundingMethod=1000",
        setMax: 1492,
        dataMin: positiveAndNegativeDataProviderDataMin
    });
   
    suite.add(AxisMaxTest);
    suite.add(AxisMaxAlwaysShowZeroFalseTest);
    suite.add(AxisNegativeMaxTest);
    suite.add(AxisMaxWithDecimalsTest);
    suite.add(AxisMaxIntegerDecimalDataTest);
    suite.add(AxisMaxWithPositiveAndNegativeDataTest); 
    suite.add(AxisMaxRoundingMethodAutoTest);
    suite.add(AxisNegativeMaxRoundingMethodAutoTest);
    suite.add(AxisMaxWithDecimalsRoundingMethodAutoTest);
    suite.add(AxisMaxIntegerDecimalDataRoundingMethodAutoTest);
    suite.add(AxisMaxWithPositiveAndNegativeDataRoundingMethodAutoTest);
    suite.add(AxisMaxRoundingMethodNullTest);
    suite.add(AxisNegativeMaxRoundingMethodNullTest);
    suite.add(AxisMaxWithDecimalsRoundingMethodNullTest);
    suite.add(AxisMaxIntegerDecimalDataRoundingMethodNullTest);
    suite.add(AxisMaxWithPositiveAndNegativeDataRoundingMethodNullTest);
    suite.add(AxisMaxRoundingMethodNumericTest);
    suite.add(AxisNegativeMaxRoundingMethodNumericTest);
    suite.add(AxisMaxWithDecimalsRoundingMethodNumericTest);
    suite.add(AxisMaxIntegerDecimalDataRoundingMethodNumericTest);
    suite.add(AxisMaxWithPositiveAndNegativeDataRoundingMethodNumericTest);
    suite.add(AxisMaxWithPositiveAndNegativeDataAndLargeMaxTest);
    suite.add(AxisMaxWithPositiveAndNegativeDataAndSmallMaxTest);
    suite.add(AxisMaxWithPositiveAndNegativeDataAlwaysShowZeroFalseTest);

    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['charts', 'test']});
