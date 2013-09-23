YUI.add('line-legendwrapitems-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: LineLegendWrapItems"),
        LegendTestTemplate,
        parentDiv = Y.DOM.create('<div style="position:absolute;top:500px;left:0px;width:500px;height:400px" id="testdiv"></div>'),
        DOC = Y.config.doc;
    DOC.body.appendChild(parentDiv);

    LegendTestTemplate = function(cfg, globalCfg)
    {
        var i;
        LegendTestTemplate.superclass.constructor.apply(this);
        cfg.categoryKey = "date";
        this.attrCfg = cfg;
        for(i in globalCfg)
        {
            if(globalCfg.hasOwnProperty(i))
            {
                this[i] = globalCfg[i];
            }
        }
    };

    Y.extend(LegendTestTemplate, Y.Test.Case, {
        setUp: function() {
            this.chart = new Y.Chart(this.attrCfg);
        },
        
        tearDown: function() {
            this.chart.destroy(true);
            Y.Event.purgeElement(DOC, false);
        }
    });

    var basicDataValues = [ 
        {date:"5/1/2010", values:400, expenses:1100, revenue:1500, dog:8230, cat:7005, bird:6500, fish:5200, horse:4500, man:3400, shoe:2010, boat:1400}, 
        {date:"5/2/2010", values:2000, expenses:3700, revenue:2200, dog:1230, cat:2005, bird:3500, fish:4200, horse:5500, man:6400, shoe:7010, boat:8400}, 
        {date:"5/3/2010", values:50, expenses:9100, revenue:100, dog:1230, cat:2005, bird:3500, fish:4200, horse:5500, man:6400, shoe:7010, boat:8400},
        {date:"5/4/2010", values:5000, expenses:5000, revenue:2650, dog:1230, cat:2005, bird:3500, fish:4200, horse:5500, man:6400},
        {date:"5/5/2010", values:200, expenses:1900, revenue:2800, dog:1230, cat:2005, bird:3500, fish:4200}, 
        {date:"5/6/2010", values:200, expenses:1900, revenue:2800, dog:1230, cat:4005}, 
        {date:"5/7/2010", values:200, expenses:1900, revenue:2800} 
    ],
    
    topLegend = function()
    {
        return {
            position: "top",
            styles: {
                hAlign: "center"
            }
        };
    },

    topLegendLeft = function()
    {
        return {
            position: "top",
            styles: {
                hAlign: "left"
            }
        };
    },

    topLegendRight = function()
    {
        return {
            position: "top",
            styles: {
                hAlign: "right"
            }
        };
    },

    bottomLegend = function()
    {
        return {
            position: "bottom",
            styles: {
                hAlign: "center"
            }
        };
    },

    bottomLegendLeft = function()
    {
        return {
            position: "bottom",
            styles: {
                hAlign: "left"
            }
        };
    },

    bottomLegendRight = function()
    {
        return {
            position: "bottom",
            styles: {
                hAlign: "right"
            }
        };
    },

    leftLegend = function()
    {
        return {
            position: "left",
            styles: {
                vAlign: "middle"
            }
        };
    },

    leftLegendTop = function()
    {
        return {
            position: "left",
            styles: {
                vAlign: "top"
            }
        };
    },

    leftLegendBottom = function()
    {
        return {
            position: "left",
            styles: {
                vAlign: "bottom"
            }
        };
    },

    rightLegend = function()
    {
        return {
            position: "right",
            styles: {
                vAlign: "middle"
            }
        };
    },

    rightLegendTop = function()
    {
        return {
            position: "right",
            styles: {
                vAlign: "top"
            }
        };
    },

    rightLegendBottom = function()
    {
        return {
            position: "right",
            styles: {
                vAlign: "bottom"
            }
        };
    },

    testLegend = function()
    {
        var chart = this.chart,
            legend = chart.get("legend"),
            chartSC = chart.get("seriesCollection"),
            legendItems = legend.get("items"),
            i = 0,
            len = chartSC.length,
            align = this.align,
            legendPosition = this.legendPosition;
        Y.Assert.isTrue(legend instanceof Y.ChartLegend);
        Y.Assert.areEqual(legend.get("position"), this.legendPosition);
        Y.Assert.areEqual(chartSC.length, legendItems.length);
        for(; i < len; ++i)
        {
            Y.Assert.areEqual(chartSC[i].get("displayName"), legendItems.text);
        }
    },

    testLegendPosition = function()
    {
        var assert = Y.Assert,
            chart = this.chart,
            legend = chart.get("legend");
    },

    testLegendItemsLength = function()
    {
        var assert = Y.Assert,
            chart = this.chart,
            legend = chart.get("legend"),
            chartSC = chart.get("seriesCollection"),
            legendItems = legend.get("items");
    },

    testLegendItemsText = function()
    {
        var assert = Y.Assert,
            chart = this.chart,
            legend = chart.get("legend"),
            chartSC = chart.get("seriesCollection"),
            legendItems = legend.get("items"),
            i = 0,
            len = chartSC.length;
        for(; i < len; ++i)
        {
            assert.areEqual(chartSC[i].get("displayName"), legendItems.text);
        }
    },
    
    NoLegendTest = function(type, dataProvider)
    {
        var cfg = {
            type: type,
            render: "#testdiv",
            dataProvider: basicDataValues
        }, 
        nameSuffix = " with basic dataProvider";
        if(dataProvider)
        {
            cfg.dataProvider = dataProvider;
            nameSuffix = " with large dataProvider";
        }
        return new LegendTestTemplate(cfg, {
            name: "No Legend Tests" + nameSuffix,
            
            _width: 500,

            _height: 400,

            testNoLegend: function()
            {
                var assert = Y.Assert,
                    chart = this.chart,
                    legend = chart.get("legend");
                assert.isUndefined(legend);
            }
        });
    },
    
    LegendTest = function(type, position, legend, align, dataProvider)
    {
        var cfg = {
            type: type,
            render: "#testdiv",
            dataProvider: basicDataValues,
            legend: legend
        },
        width,
        height;
        if(position == "top" || position == "bottom")
        {
            width = 225;
            height = 350;
        }
        else
        {
            width = 350;
            height = 225;
        }

        return new LegendTestTemplate(cfg, {
            name: "Test with " + position + " positioned, " + align + " aligned legend",

            legendPosition: position,
            
            _width: width,

            _height: height,

            testDefault: testLegend
        });
    },

    LegendPositionTest = function(type, dataProvider)
    {
        var cfg = {
            type: type,
            render: "#testdiv",
            dataProvider: basicDataValues,
            legend: leftLegend()
        }, 
        nameSuffix = " with basic dataProvider";
        if(dataProvider)
        {
            cfg.dataProvider = dataProvider;
            nameSuffix = " with large dataProvider";
        }
        return new LegendTestTemplate(cfg, {
            name: "Legend Position Test" + nameSuffix,
            
            _width: 250,

            _height: 225,

            testDefault: function()
            {
                var legend = this.chart.get("legend"),
                    left = "left",
                    right = "right",
                    top = "top",
                    bottom = "bottom";
                legend.set("position", top);
                Y.Assert.areEqual(top, legend.get("position"), "The position of the legend should be " + top + ".");
                legend.set("position", right);
                Y.Assert.areEqual(right, legend.get("position"), "The position of the legend should be " + right + ".");
                legend.set("position", bottom);
                Y.Assert.areEqual(bottom, legend.get("position"), "The position of the legend should be " + bottom + ".");
                legend.set("position", left);
                Y.Assert.areEqual(left, legend.get("position"), "The position of the legend should be " + left + ".");
            }
        });
    };
    
    suite.add(NoLegendTest("line"));
    suite.add(LegendTest("line", "top", topLegend(), "center"));
    suite.add(LegendTest("line", "right", rightLegend(), "middle"));
    suite.add(LegendTest("line", "bottom", bottomLegend(), "center"));
    suite.add(LegendTest("line", "left", leftLegend(), "middle"));
    suite.add(LegendTest("line", "top", topLegendLeft(), "left"));
    suite.add(LegendTest("line", "right", rightLegendTop(), "top"));
    suite.add(LegendTest("line", "bottom", bottomLegendLeft(), "left"));
    suite.add(LegendTest("line", "left", leftLegendTop(), "top"));
    suite.add(LegendTest("line", "top", topLegendRight(), "right"));
    suite.add(LegendTest("line", "right", rightLegendBottom(), "bottom"));
    suite.add(LegendTest("line", "bottom", bottomLegendRight(), "right"));
    suite.add(LegendTest("line", "left",  leftLegendBottom(), "bottom"));
    suite.add(LegendPositionTest("line"));
    
    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['charts-legend', 'test']});
