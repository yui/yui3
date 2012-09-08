YUI.add('numericaxis-minandmax-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: NumericAxisMinAndMax"),
    
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
    
    var AxisMinAndMaxTestTemplate = function()
    {
        AxisMinAndMaxTestTemplate.superclass.constructor.apply(this, arguments);
    };
    
    Y.extend(AxisMinAndMaxTestTemplate, AxisTestTemplate, {
        testMinAndMax: function()
        {
            var chart = this.chart,
                setMax = this.setMax,
                setMin = this.setMin;
            this.eventListener = this.chart.on("chartRendered", function(e) {
                var axis = chart.getAxisByKey("values"),
                    majorUnit = axis.get("styles").majorUnit,
                    count = majorUnit.count - 1,
                    labels = axis.get("labels");
                Y.assert(labels[0].innerHTML == axis.get("labelFunction").apply(axis, [setMin, axis.get("labelFormat")]));
                Y.assert(labels[count].innerHTML == axis.get("labelFunction").apply(axis, [setMax, axis.get("labelFormat")])); 
            });
            this.chart.render("#mychart");
        }
    });

    Y.AxisMinAndMaxTestTemplate = AxisMinAndMaxTestTemplate;

    AxisAlwaysShowZero = new Y.Test.Case({
        name: "Axis alwaysShowZero Test",
        
        setUp: function() 
        {
            var myDataValues = [ 
                {category:"5/1/2010", values:2000, expenses:3700, revenue:2200}, 
                {category:"5/2/2010", values:50, expenses:9100, revenue:-100}, 
                {category:"5/3/2010", values:-400, expenses:-1100, revenue:1500}, 
                {category:"5/4/2010", values:200, expenses:1900, revenue:-2800}, 
                {category:"5/5/2010", values:5000, expenses:-5000, revenue:2650}
            ];
            Y.one("body").append('<div id="testbed"></div>');
            Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="mychart"></div>');
            this.chart = new Y.Chart({
                width:400, 
                height:300, 
                dataProvider:myDataValues
            });
        },

        tearDown: function() {
            this.eventListener.detach();
            this.chart.destroy(true);
            Y.one("#testbed").destroy(true);
        },

        testAlwaysShowZero: function()
        {
            var chart = this.chart;
            this.eventListener = this.chart.on("chartRendered", function(e) {
                var i = 0,
                    yAxis = chart.getAxisByKey("values"),
                    majorUnit = yAxis.get("styles").majorUnit,
                    count = majorUnit.count,
                    labels = yAxis.get("labels"),
                    label;
                for(; i < count; ++i)
                {
                    label = parseFloat(labels[i].innerHTML);
                    if(label === 0)
                    {
                        break;
                    }
                }
                Y.assert(label === 0);
            });
            this.chart.render("#mychart");
        }
    }),
    
    AxisAlwaysShowZeroFalse = new Y.Test.Case({
        name: "Axis alwaysShowZero = false Test",
        
        setUp: function() 
        {
            var myDataValues = [ 
                {category:"5/1/2010", values:2000, expenses:3700, revenue:2200}, 
                {category:"5/2/2010", values:50, expenses:9100, revenue:-100}, 
                {category:"5/3/2010", values:-400, expenses:-1100, revenue:1500}, 
                {category:"5/4/2010", values:200, expenses:1900, revenue:-2800}, 
                {category:"5/5/2010", values:5000, expenses:-5000, revenue:2650}
            ];
            Y.one("body").append('<div id="testbed"></div>');
            Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="mychart"></div>');
            this.chart = new Y.Chart({
                width:400, 
                height:300, 
                axes: {
                    values: {
                        alwaysShowZero: false
                    }
                },
                dataProvider:myDataValues
            });
        },

        tearDown: function() {
            this.eventListener.detach();
            this.chart.destroy(true);
            Y.one("#testbed").destroy(true);
        },
        
        testAlwaysShowZeroEqualsFalse: function()
        {
            var chart = this.chart;
            this.eventListener = this.chart.on("chartRendered", function(e) {
                var i = 0,
                    yAxis = chart.getAxisByKey("values"),
                    majorUnit = yAxis.get("styles").majorUnit,
                    count = majorUnit.count,
                    labels = yAxis.get("labels"),
                    label;
                for(; i < count; ++i)
                {
                    label = parseFloat(labels[i].innerHTML);
                    if(label === 0)
                    {
                        break;
                    }
                }
                Y.assert(label !== 0);
            });
            this.chart.render("#mychart");
        }
    });

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

    AxisMinAndMaxTest = new Y.AxisMinAndMaxTestTemplate({
        axes: {
            values: {
                minimum: 10,
                maximum: 8000
            }
        },
        dataProvider: allPositiveDataProvider    
    },
    {
        name: "Axes Min and Max Test",
        setMin: 10,
        setMax: 8000
    }),

    AxisNegativeMinAndPositiveMaxTest = new Y.AxisMinAndMaxTestTemplate({
        axes: {
            values: {
                minimum: -500,
                maximum: 8000
            }
        },
        dataProvider: allPositiveDataProvider    
    },
    {
        name: "Axes Negative Min and Positive Max Test",
        setMin: -500,
        setMax: 8000
    }),
   
    AxisMinAndMaxWithDecimalsTest = new Y.AxisMinAndMaxTestTemplate({
        axes: {
            values: {
                maximum: 7.5,
                minimum: 2.5
            }
        },
        dataProvider: decimalDataProvider
    },
    {
        name: "Axes Min and Max with Decimals Test",
        setMin: 2.5,
        setMax: 7.5
    }),
    
    AxisNegativeMinAndMaxTest = new Y.AxisMinAndMaxTestTemplate({
        axes: {
            values: {
                minimum: -5000,
                maximum: -500
            }
        },
        dataProvider: allNegativeDataProvider
    },
    {
        name: "Axes Negative Min an Max Test",
        setMin: -5000,
        setMax: -500
    }),

    AxisMinAndMaxWithDecimalsTest = new Y.AxisMinAndMaxTestTemplate({
        axes: {
            values: {
                maximum: 7.5,
                minimum: 2.5
            }
        },
        dataProvider: decimalDataProvider
    },
    {
        name: "Axes Min and Max with Decimals Test",
        setMin: 2.5,
        setMax: 7.5
    }),
    
    AxisNegativeMinAndMaxTest = new Y.AxisMinAndMaxTestTemplate({
        axes: {
            values: {
                minimum: -5000,
                maximum: -500
            }
        },
        dataProvider: allNegativeDataProvider
    },
    {
        name: "Axes Negative Min an Max Test",
        setMin: -5000,
        setMax: -500
    });
    
    suite.add(AxisMinAndMaxTest);
    suite.add(AxisNegativeMinAndPositiveMaxTest);
    suite.add(AxisNegativeMinAndMaxTest);
    suite.add(AxisMinAndMaxWithDecimalsTest);
    suite.add(AxisAlwaysShowZero);
    suite.add(AxisAlwaysShowZeroFalse);

    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['charts', 'test']});
