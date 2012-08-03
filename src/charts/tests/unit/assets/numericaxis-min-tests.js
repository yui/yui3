YUI.add('numericaxis-min-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: NumericAxisMin"),
    
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
    
    var AxisMinTestTemplate = function()
    {
        AxisMinTestTemplate.superclass.constructor.apply(this, arguments);
    };
    
    Y.extend(AxisMinTestTemplate, AxisTestTemplate, {
        //Tests a NumericAxis minimum by applying the labelFunction of the axis to the set minimum value to the innerHTML of the first label.
        //Tests a NumericAxis maximum (unset) by checking to ensure the last label has a numeric value greater than or equal to the largest value in the data set.
        testMin: function()
        {
            var chart = this.chart,
                setMin = this.setMin,
                dataMax = this.dataMax;
            this.eventListener = this.chart.on("chartRendered", function(e) {
                var axis = chart.getAxisByKey("values"),
                    majorUnit = axis.get("styles").majorUnit,
                    count = majorUnit.count - 1,
                    labels = axis.get("labels"),
                    min = parseFloat(labels[0].innerHTML),
                    max = labels[count].innerHTML,
                    roundingMethod = axis.get("roundingMethod"),
                    setIntervals = Y.Lang.isNumber(roundingMethod);
                Y.assert(min == axis.get("labelFunction").apply(axis, [setMin, axis.get("labelFormat")]));
                if(setIntervals)
                {
                    Y.assert((max - min) % roundingMethod === 0);
                }
                //if the roundingMethod is numeric the axis cannot guarantee that the maximum will be greater than the data maximum
                if(!setIntervals || (count * roundingMethod) >= dataMax - setMin)
                {
                    Y.assert(max >= dataMax); 
                }
            });
            this.chart.render("#mychart");
        }
    });

    Y.AxisMinTestTemplate = AxisMinTestTemplate;
    
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
    
    AxisMinTest = new Y.AxisMinTestTemplate({
        axes: {
            values: {
                minimum: 7
            }
        },
        dataProvider: allPositiveDataProvider    
    },
    {
        name: "Axes Min Test",
        setMin: 7,
        dataMax: allPositiveDataProviderDataMax
    }),

    //Tests setting a NumericAxis minimum with alwaysShowZero as false
    AxisMinAlwaysShowZeroFalseTest = new Y.AxisMinTestTemplate({
        axes: {
            values: {
                minimum: 7,
                alwaysShowZero: false
            }
        },
        dataProvider: allPositiveDataProvider    
    },
    {
        name: "Axes Min Test",
        setMin: 7,
        dataMax: allPositiveDataProviderDataMax
    }),

    AxisNegativeMinTest = new Y.AxisMinTestTemplate({
        axes: {
            values: {
                minimum: -1721
            }
        },
        dataProvider: positiveAndNegativeDataProvider
    },
    {    
        name: "Axes Negative Min Test",
        setMin: -1721,
        dataMax: positiveAndNegativeDataProviderDataMax
    }),

    AxisPositiveAndNegativeMinTest = new Y.AxisMinTestTemplate({
        axes: {
            values: {
                minimum: -1721
            }
        },
        dataProvider: positiveAndNegativeDataProvider
    },
    {    
        name: "Axes Negative Min Test",
        setMin: -1721,
        dataMax: positiveAndNegativeDataProviderDataMax
    }),

    AxisPositiveAndNegativeAlwaysShowZeroFalseMinTest = new Y.AxisMinTestTemplate({
        axes: {
            values: {
                minimum: -1721,
                alwaysShowZero: false
            }
        },
        dataProvider: positiveAndNegativeDataProvider
    },
    {    
        name: "Axes Negative Min Test",
        setMin: -1721,
        dataMax: positiveAndNegativeDataProviderDataMax
    }),

    AxisNegativeMinWithAllNegativeDataTest = new Y.AxisMinTestTemplate({
        axes: {
            values: {
                minimum: -1721
            }
        },
        dataProvider: allNegativeDataProvider
    },
    {
        name: "Axes Negative Min with All Negative Data Test",
        setMin: -1721,
        dataMax: allNegativeDataProviderDataMax 
    }),

    AxisNegativeMinAlwaysShowZeroFalseTest = new Y.AxisMinTestTemplate({
        axes: {
            values: {
                minimum: -1721,
                alwaysShowZero: false
            }
        },
        dataProvider: allNegativeDataProvider
    },
    {
        name: "Axes Negative Min with All Negative Data and alwaysShowZero=false Test",
        setMin: -1721,
        dataMax: allNegativeDataProviderDataMax 
    }),

    AxisMinWithDecimalsTest = new Y.AxisMinTestTemplate({
        axes: {
            values: {
                minimum: 1.5
            }
        },
        dataProvider: decimalDataProvider
    },
    {
        name: "Axes Min with Decimals Test",
        dataMax: decimalDataProviderDataMax,
        setMin: 1.5
    }),

    AxisMinIntegerDecimalDataTest = new Y.AxisMinTestTemplate({
        axes: {
            values: {
                minimum: 1
            }
        },
        dataProvider: decimalDataProvider
    },
    {
        name: "Axes Integer Min with Decimal Data Test",
        dataMax: decimalDataProviderDataMax,
        setMin: 1
    }),
    
    //Tests setting a NumericAxis' minimum to a negative value with a data set of all positive values
    AxisNegativeMinPositiveDataTest =  new Y.AxisMinTestTemplate({
        axes: {
            values: {
                minimum: -100
            }
        },
        dataProvider: allPositiveDataProvider    
    },
    {
        name: "Axes Negative Min with Positive Data Test",
        setMin: -100,
        dataMax: allPositiveDataProviderDataMax
    }),

    AxisMinRoundingAutoTest = new Y.AxisMinTestTemplate({
        axes: {
            values: {
                minimum: 7,
                roundingMethod: "auto"
            }
        },
        dataProvider: allPositiveDataProvider    
    },
    {
        name: "Axes Min Test",
        setMin: 7,
        dataMax: allPositiveDataProviderDataMax
    }),

    //Tests setting a NumericAxis minimum with alwaysShowZero as false
    AxisMinAlwaysShowZeroFalseRoundingMethodAutoTest = new Y.AxisMinTestTemplate({
        axes: {
            values: {
                minimum: 7,
                roundingMethod: "auto",
                alwaysShowZero: false
            }
        },
        dataProvider: allPositiveDataProvider    
    },
    {
        name: "Axes Min Test with roundingMethod=auto",
        setMin: 7,
        dataMax: allPositiveDataProviderDataMax
    }),
 
    //Tests setting a NumericAxis' minimum to a negative value
    AxisNegativeMinRoundingMethodAutoTest = new Y.AxisMinTestTemplate({
        axes: {
            values: {
                minimum: -1721,
                roundingMethod: "auto"
            }
        },
        dataProvider: positiveAndNegativeDataProvider
    },
    {    
        name: "Axes Negative Min Test with roundingMethod=auto",
        setMin: -1721,
        dataMax: positiveAndNegativeDataProviderDataMax
    }),
    
    //Tests setting a NumericAxis' minimum to a negative values with all negative values in it's dataProvider
    AxisNegativeMinWithAllNegativeDataRoundingMethodAutoTest = new Y.AxisMinTestTemplate({
        axes: {
            values: {
                minimum: -1721,
                roundingMethod: "auto"
            }
        },
        dataProvider: allNegativeDataProvider
    },
    {
        name: "Axes Negative Min with All Negative Data Test with roundingMethod=auto",
        setMin: -1721,
        dataMax: allNegativeDataProviderDataMax 
    }),

    //Tests setting a NumericAxis' minimum to a value with decimals
    AxisMinWithDecimalsRoundingMethodAutoTest = new Y.AxisMinTestTemplate({
        axes: {
            values: {
                minimum: 1.5,
                roundingMethod: "auto"
            }
        },
        dataProvider: decimalDataProvider
    },
    {
        name: "Axes Min with Decimals Test with roundingMethod=auto",
        dataMax: decimalDataProviderDataMax,
        setMin: 1.5
    }),

    //Tests setting a NumericAxis' minimum to an integer value with a data set that contains decimal values
    AxisMinIntegerDecimalDataRoundingMethodAutoTest = new Y.AxisMinTestTemplate({
        axes: {
            values: {
                minimum: 1,
                roundingMethod: "auto"
            }
        },
        dataProvider: decimalDataProvider
    },
    {
        name: "Axes Integer Min with Decimal Data Test with roundingMethod=auto",
        dataMax: decimalDataProviderDataMax,
        setMin: 1
    }),

    AxisNegativeMinPositiveDataRoundingMethodAutoTest =  new Y.AxisMinTestTemplate({
        axes: {
            values: {
                minimum: -100,
                roundingMethod: "auto"
            }
        },
        dataProvider: allPositiveDataProvider    
    },
    {
        name: "Axes Negative Min with Positive Data Test with roundingMethod=auto",
        setMin: -100,
        dataMax: allPositiveDataProviderDataMax
    }),
    
    AxisMinRoundingNullTest = new Y.AxisMinTestTemplate({
        axes: {
            values: {
                minimum: 7,
                roundingMethod: null
            }
        },
        dataProvider: allPositiveDataProvider    
    },
    {
        name: "Axes Min Test with roundingMethod=null",
        setMin: 7,
        dataMax: allPositiveDataProviderDataMax
    }),

    AxisMinAlwaysShowZeroFalseRoundingMethodNullTest = new Y.AxisMinTestTemplate({
        axes: {
            values: {
                minimum: 7,
                roundingMethod: null,
                alwaysShowZero: false
            }
        },
        dataProvider: allPositiveDataProvider    
    },
    {
        name: "Axes Min Test with roundingMethod=null",
        setMin: 7,
        dataMax: allPositiveDataProviderDataMax
    }),
    
    AxisNegativeMinRoundingMethodNullTest = new Y.AxisMinTestTemplate({
        axes: {
            values: {
                minimum: -1721,
                roundingMethod: null
            }
        },
        dataProvider: positiveAndNegativeDataProvider
    },
    {    
        name: "Axes Negative Min Test with roundingMethod=null",
        setMin: -1721,
        dataMax: positiveAndNegativeDataProviderDataMax
    }),

    AxisNegativeMinWithAllNegativeDataRoundingMethodNullTest = new Y.AxisMinTestTemplate({
        axes: {
            values: {
                minimum: -1721,
                roundingMethod: null
            }
        },
        dataProvider: allNegativeDataProvider
    },
    {
        name: "Axes Negative Min with All Negative Data Test with roundingMethod=null",
        setMin: -1721,
        dataMax: allNegativeDataProviderDataMax 
    }),

    AxisMinWithDecimalsRoundingMethodNullTest = new Y.AxisMinTestTemplate({
        axes: {
            values: {
                minimum: 1.5,
                roundingMethod: null
            }
        },
        dataProvider: decimalDataProvider
    },
    {
        name: "Axes Min with Decimals Test with roundingMethod=null",
        dataMax: decimalDataProviderDataMax,
        setMin: 1.5
    }),
    
    AxisMinIntegerDecimalDataRoundingMethodNullTest = new Y.AxisMinTestTemplate({
        axes: {
            values: {
                minimum: 1,
                roundingMethod: null
            }
        },
        dataProvider: decimalDataProvider
    },
    {
        name: "Axes Integer Min with Decimal Data Test with roundingMethod=null",
        dataMax: decimalDataProviderDataMax,
        setMin: 1
    }),
    
    AxisNegativeMinPositiveDataRoundingMethodNullTest =  new Y.AxisMinTestTemplate({
        axes: {
            values: {
                minimum: -100,
                roundingMethod: null
            }
        },
        dataProvider: allPositiveDataProvider    
    },
    {
        name: "Axes Negative Min with Positive Data Test with roundingMethod=null",
        setMin: -100,
        dataMax: allPositiveDataProviderDataMax
    }),
    
    AxisMinRoundingNumericTest = new Y.AxisMinTestTemplate({
        axes: {
            values: {
                minimum: 7,
                roundingMethod: 1000
            }
        },
        dataProvider: allPositiveDataProvider    
    },
    {
        name: "Axes Min Test with roundingMethod=1000",
        setMin: 7,
        dataMax: allPositiveDataProviderDataMax
    }),
    
    AxisMinAlwaysShowZeroFalseRoundingMethodNumericTest = new Y.AxisMinTestTemplate({
        axes: {
            values: {
                minimum: 7,
                roundingMethod: 1000,
                alwaysShowZero: false
            }
        },
        dataProvider: allPositiveDataProvider    
    },
    {
        name: "Axes Min Test with roundingMethod=1000",
        setMin: 7,
        dataMax: allPositiveDataProviderDataMax
    }),
 
    AxisNegativeMinRoundingMethodNumericTest = new Y.AxisMinTestTemplate({
        axes: {
            values: {
                minimum: -1721,
                roundingMethod: 1000
            }
        },
        dataProvider: positiveAndNegativeDataProvider
    },
    {    
        name: "Axes Negative Min Test with roundingMethod=1000",
        setMin: -1721,
        dataMax: positiveAndNegativeDataProviderDataMax
    }),

    AxisNegativeMinWithAllNegativeDataRoundingMethodNumericTest = new Y.AxisMinTestTemplate({
        axes: {
            values: {
                minimum: -1721,
                roundingMethod: 1000
            }
        },
        dataProvider: allNegativeDataProvider
    },
    {
        name: "Axes Negative Min with All Negative Data Test with roundingMethod=1000",
        setMin: -1721,
        dataMax: allNegativeDataProviderDataMax 
    }),

    AxisMinWithDecimalsRoundingMethodNumericTest = new Y.AxisMinTestTemplate({
        axes: {
            values: {
                minimum: 1.5,
                roundingMethod: 2
            }
        },
        dataProvider: decimalDataProvider
    },
    {
        name: "Axes Min with Decimals Test with roundingMethod=2",
        dataMax: decimalDataProviderDataMax,
        setMin: 1.5
    }),

    AxisMinIntegerDecimalDataRoundingMethodNumericTest = new Y.AxisMinTestTemplate({
        axes: {
            values: {
                minimum: 1,
                roundingMethod: 2
            }
        },
        dataProvider: decimalDataProvider
    },
    {
        name: "Axes Integer Min with Decimal Data Test with roundingMethod=2",
        dataMax: decimalDataProviderDataMax,
        setMin: 1
    }),
    
    AxisNegativeMinPositiveDataRoundingMethodNumericTest =  new Y.AxisMinTestTemplate({
        axes: {
            values: {
                minimum: -100,
                roundingMethod: 1000 
            }
        },
        dataProvider: allPositiveDataProvider    
    },
    {
        name: "Axes Negative Min with Positive Data Test with roundingMethod=1000",
        setMin: -100,
        dataMax: allPositiveDataProviderDataMax
    });
    
    suite.add(AxisMinTest);
    suite.add(AxisMinAlwaysShowZeroFalseTest);
    suite.add(AxisNegativeMinTest);
    suite.add(AxisNegativeMinAlwaysShowZeroFalseTest);
    suite.add(AxisNegativeMinWithAllNegativeDataTest);
    suite.add(AxisMinWithDecimalsTest);
    suite.add(AxisMinIntegerDecimalDataTest);
    suite.add(AxisNegativeMinPositiveDataTest);
    suite.add(AxisMinRoundingAutoTest);
    suite.add(AxisMinAlwaysShowZeroFalseRoundingMethodAutoTest);
    suite.add(AxisNegativeMinRoundingMethodAutoTest);
    suite.add(AxisNegativeMinWithAllNegativeDataRoundingMethodAutoTest);
    suite.add(AxisMinWithDecimalsRoundingMethodAutoTest);
    suite.add(AxisMinIntegerDecimalDataRoundingMethodAutoTest);
    suite.add(AxisNegativeMinPositiveDataRoundingMethodAutoTest);
    suite.add(AxisMinRoundingNullTest);
    suite.add(AxisMinAlwaysShowZeroFalseRoundingMethodNullTest);
    suite.add(AxisNegativeMinRoundingMethodNullTest);
    suite.add(AxisNegativeMinWithAllNegativeDataRoundingMethodNullTest);
    suite.add(AxisMinWithDecimalsRoundingMethodNullTest);
    suite.add(AxisMinIntegerDecimalDataRoundingMethodNullTest);
    suite.add(AxisNegativeMinPositiveDataRoundingMethodNullTest);
    suite.add(AxisMinRoundingNumericTest);
    suite.add(AxisMinAlwaysShowZeroFalseRoundingMethodNumericTest);
    suite.add(AxisNegativeMinRoundingMethodNumericTest);
    suite.add(AxisNegativeMinWithAllNegativeDataRoundingMethodNumericTest);
    suite.add(AxisMinWithDecimalsRoundingMethodNumericTest);
    suite.add(AxisMinIntegerDecimalDataRoundingMethodNumericTest);
    suite.add(AxisNegativeMinPositiveDataRoundingMethodNumericTest);
    suite.add(AxisPositiveAndNegativeMinTest); 
    suite.add(AxisPositiveAndNegativeAlwaysShowZeroFalseMinTest); 
    
    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['charts', 'test']});
