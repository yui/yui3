YUI.add('axis-title-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: AxisTitle"),
   
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
    
    var AxisTitleTestTemplate = function()
    {
        AxisTitleTestTemplate.superclass.constructor.apply(this, arguments);
    };

    Y.extend(AxisTitleTestTemplate, AxisTestTemplate, {
        testTitleRotation: function()
        {
            var chart = this.chart,
                specifiedRotation = this.specifiedLabelRotation,
                valueAxisTitleRotation = chart.getAxisByKey("values").get("styles").title.rotation,
                categoryAxisTitleRotation = chart.getAxisByKey("category").get("styles").title.rotation;
            this.eventListener = this.chart.on("chartRendered", function(e) {
                Y.Assert.areEqual(specifiedRotation, categoryAxisTitleRotation, "The value axis' title rotation should equal specified " + specifiedRotation + "."); 
                Y.Assert.areEqual(specifiedRotation, valueAxisTitleRotation, "The category axis' title rotation should equal specified " + specifiedRotation + "."); 
            });
            this.chart.render("#mychart");
        }
    });

    Y.AxisTitleTestTemplate = AxisTitleTestTemplate;

    var dataProvider =  [ 
        {category:"5/1/2010", values:2000, expenses:3700, revenue:2200}, 
        {category:"5/2/2010", values:50, expenses:9100, revenue:100}, 
        {category:"5/3/2010", values:400, expenses:1100, revenue:1500}, 
        {category:"5/4/2010", values:200, expenses:1900, revenue:2800}, 
        {category:"5/5/2010", values:5000, expenses:5000, revenue:2650}
    ],

    LeftBottomAxisTitleRotationTest = function(rotation)
    {
        var axes = {
            values: {
                title: "Numeric Axis",
                position: "left"
            },
            category: {
                title: "Category Axis",
                position: "bottom"
            }
        },
        styles;
        if(Y.Lang.isNumber(rotation))
        {
            styles = getRotationStyles(rotation);
            axes.values.styles = styles;
            axes.category.styles = styles;
        }
        return new Y.AxisTitleTestTemplate({
            axes: axes,
            dataProvider: dataProvider 
        },
        {
            name: "Left and Bottom Axes with " + rotation + " degree title rotation",
            specifiedLabelRotation: rotation
        });
    },
  
    RightTopAxisTitleRotationTest = function(rotation)
    {
        var axes = {
            values: {
                title: "Numeric Axis",
                position: "right"
            },
            category: {
                title: "Category Axis",
                position: "top"
            }
        },
        styles;
        if(Y.Lang.isNumber(rotation))
        {
            styles = getRotationStyles(rotation);
            axes.values.styles = styles;
            axes.category.styles = styles;
        }
        return new Y.AxisTitleTestTemplate({
            axes: axes,
            dataProvider: dataProvider 
        },
        {
            name: "Right and Top Axes with " + rotation + " degree title rotation",
            specifiedLabelRotation: rotation
        });
    },

    getRotationStyles = function(rotation)
    {
        return {
                title: {
                    rotation: rotation
                }
            };
    },

    LeftBottomUndefinedDegreeTest = LeftBottomAxisTitleRotationTest();
    LeftBottom15DegreeTest = LeftBottomAxisTitleRotationTest(15),
    LeftBottom30DegreeTest = LeftBottomAxisTitleRotationTest(30),
    LeftBottom45DegreeTest = LeftBottomAxisTitleRotationTest(45),
    LeftBottom60DegreeTest = LeftBottomAxisTitleRotationTest(60),
    LeftBottom75DegreeTest = LeftBottomAxisTitleRotationTest(75),
    LeftBottom90DegreeTest = LeftBottomAxisTitleRotationTest(90),
    LeftBottomNegative15DegreeTest = LeftBottomAxisTitleRotationTest(-15),
    LeftBottomNegative30DegreeTest = LeftBottomAxisTitleRotationTest(-30),
    LeftBottomNegative45DegreeTest = LeftBottomAxisTitleRotationTest(-45),
    LeftBottomNegative60DegreeTest = LeftBottomAxisTitleRotationTest(-60),
    LeftBottomNegative75DegreeTest = LeftBottomAxisTitleRotationTest(-75),
    LeftBottomNegative90DegreeTest = LeftBottomAxisTitleRotationTest(-90),
    
    RightTopUndefinedDegreeTest = RightTopAxisTitleRotationTest();
    RightTop15DegreeTest = RightTopAxisTitleRotationTest(15),
    RightTop30DegreeTest = RightTopAxisTitleRotationTest(30),
    RightTop45DegreeTest = RightTopAxisTitleRotationTest(45),
    RightTop60DegreeTest = RightTopAxisTitleRotationTest(60),
    RightTop75DegreeTest = RightTopAxisTitleRotationTest(75),
    RightTop90DegreeTest = RightTopAxisTitleRotationTest(90),
    RightTopNegative15DegreeTest = RightTopAxisTitleRotationTest(-15),
    RightTopNegative30DegreeTest = RightTopAxisTitleRotationTest(-30),
    RightTopNegative45DegreeTest = RightTopAxisTitleRotationTest(-45),
    RightTopNegative60DegreeTest = RightTopAxisTitleRotationTest(-60),
    RightTopNegative75DegreeTest = RightTopAxisTitleRotationTest(-75),
    RightTopNegative90DegreeTest = RightTopAxisTitleRotationTest(-90);
    
    suite.add(LeftBottomUndefinedDegreeTest);
    suite.add(LeftBottom15DegreeTest);
    suite.add(LeftBottom30DegreeTest);
    suite.add(LeftBottom45DegreeTest);
    suite.add(LeftBottom60DegreeTest);
    suite.add(LeftBottom75DegreeTest);
    suite.add(LeftBottom90DegreeTest);
    suite.add(LeftBottomNegative15DegreeTest);
    suite.add(LeftBottomNegative30DegreeTest);
    suite.add(LeftBottomNegative45DegreeTest);
    suite.add(LeftBottomNegative60DegreeTest);
    suite.add(LeftBottomNegative75DegreeTest);
    suite.add(LeftBottomNegative90DegreeTest);

    suite.add(RightTopUndefinedDegreeTest);
    suite.add(RightTop15DegreeTest);
    suite.add(RightTop30DegreeTest);
    suite.add(RightTop45DegreeTest);
    suite.add(RightTop60DegreeTest);
    suite.add(RightTop75DegreeTest);
    suite.add(RightTop90DegreeTest);
    suite.add(RightTopNegative15DegreeTest);
    suite.add(RightTopNegative30DegreeTest);
    suite.add(RightTopNegative45DegreeTest);
    suite.add(RightTopNegative60DegreeTest);
    suite.add(RightTopNegative75DegreeTest);
    suite.add(RightTopNegative90DegreeTest);
    
    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['charts', 'test']});
