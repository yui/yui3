YUI.add('axis-label-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: AxisLabel"),
   
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
    
    var AxisLabelTestTemplate = function()
    {
        AxisLabelTestTemplate.superclass.constructor.apply(this, arguments);
    };

    Y.extend(AxisLabelTestTemplate, AxisTestTemplate, {
        testLabelRotation: function()
        {
            var chart = this.chart,
                specifiedRotation = this.specifiedLabelRotation,
                valueAxisLabelRotation = chart.getAxisByKey("values").get("styles").label.rotation,
                categoryAxisLabelRotation = chart.getAxisByKey("category").get("styles").label.rotation;
            this.eventListener = this.chart.on("chartRendered", function(e) {
                Y.Assert.areEqual(specifiedRotation, categoryAxisLabelRotation, "The value axis' label rotation should equal specified " + specifiedRotation + "."); 
                Y.Assert.areEqual(specifiedRotation, valueAxisLabelRotation, "The category axis' label rotation should equal specified " + specifiedRotation + "."); 
            });
            this.chart.render("#mychart");
        }
    });

    Y.AxisLabelTestTemplate = AxisLabelTestTemplate;

    var dataProvider =  [ 
        {category:"5/1/2010", values:2000, expenses:3700, revenue:2200}, 
        {category:"5/2/2010", values:50, expenses:9100, revenue:100}, 
        {category:"5/3/2010", values:400, expenses:1100, revenue:1500}, 
        {category:"5/4/2010", values:200, expenses:1900, revenue:2800}, 
        {category:"5/5/2010", values:5000, expenses:5000, revenue:2650}
    ],

    LeftBottomAxisLabelRotationTest = function(rotation)
    {
        return new Y.AxisLabelTestTemplate({
            axes: {
                values: {
                    position: "left",
                    styles: {
                        label: {
                            rotation: rotation
                        }
                    }
                },
                category: {
                    position: "bottom",
                    styles: {
                        label: {
                            rotation: rotation
                        }
                    }
                }
            },
            dataProvider: dataProvider 
        },
        {
            name: "Left and Bottom Axes with " + rotation + " degree label rotation",
            specifiedLabelRotation: rotation
        });
    },
  
    RightTopAxisLabelRotationTest = function(rotation)
    {
        return new Y.AxisLabelTestTemplate({
            axes: {
                values: {
                    position: "right",
                    styles: {
                        label: {
                            rotation: rotation
                        }
                    }
                },
                category: {
                    position: "top",
                    styles: {
                        label: {
                            rotation: rotation
                        }
                    }
                }
            },
            dataProvider: dataProvider 
        },
        {
            name: "Right and Top Axes with " + rotation + " degree label rotation",
            specifiedLabelRotation: rotation
        });
    },

    LeftBottom15DegreeTest = LeftBottomAxisLabelRotationTest(15);
    LeftBottom30DegreeTest = LeftBottomAxisLabelRotationTest(30);
    LeftBottom45DegreeTest = LeftBottomAxisLabelRotationTest(45);
    LeftBottom60DegreeTest = LeftBottomAxisLabelRotationTest(60);
    LeftBottom75DegreeTest = LeftBottomAxisLabelRotationTest(75);
    LeftBottom90DegreeTest = LeftBottomAxisLabelRotationTest(90);
    LeftBottomNegative15DegreeTest = LeftBottomAxisLabelRotationTest(-15);
    LeftBottomNegative30DegreeTest = LeftBottomAxisLabelRotationTest(-30);
    LeftBottomNegative45DegreeTest = LeftBottomAxisLabelRotationTest(-45);
    LeftBottomNegative60DegreeTest = LeftBottomAxisLabelRotationTest(-60);
    LeftBottomNegative75DegreeTest = LeftBottomAxisLabelRotationTest(-75);
    LeftBottomNegative90DegreeTest = LeftBottomAxisLabelRotationTest(-90);
    
    RightTop15DegreeTest = RightTopAxisLabelRotationTest(15);
    RightTop30DegreeTest = RightTopAxisLabelRotationTest(30);
    RightTop45DegreeTest = RightTopAxisLabelRotationTest(45);
    RightTop60DegreeTest = RightTopAxisLabelRotationTest(60);
    RightTop75DegreeTest = RightTopAxisLabelRotationTest(75);
    RightTop90DegreeTest = RightTopAxisLabelRotationTest(90);
    RightTopNegative15DegreeTest = RightTopAxisLabelRotationTest(-15);
    RightTopNegative30DegreeTest = RightTopAxisLabelRotationTest(-30);
    RightTopNegative45DegreeTest = RightTopAxisLabelRotationTest(-45);
    RightTopNegative60DegreeTest = RightTopAxisLabelRotationTest(-60);
    RightTopNegative75DegreeTest = RightTopAxisLabelRotationTest(-75);
    RightTopNegative90DegreeTest = RightTopAxisLabelRotationTest(-90);
    
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
