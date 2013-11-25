YUI.add('spline-legend-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: SplineLegend"),
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
            {date:"5/1/2010", miscellaneous:2000, expenses:3700, revenue:2200}, 
            {date:"5/2/2010", miscellaneous:50, expenses:9100, revenue:100}, 
            {date:"5/3/2010", miscellaneous:400, expenses:1100, revenue:1500}, 
            {date:"5/4/2010", miscellaneous:200, expenses:1900, revenue:2800}, 
            {date:"5/5/2010", miscellaneous:5000, expenses:5000, revenue:2650}
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
        };
        return new LegendTestTemplate(cfg, {
            name: "Test with " + position + " positioned, " + align + " aligned legend",

            legendPosition: position,

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
    
    suite.add(NoLegendTest("spline"));
    suite.add(LegendTest("spline", "top", topLegend(), "center"));
    suite.add(LegendTest("spline", "right", rightLegend(), "middle"));
    suite.add(LegendTest("spline", "bottom", bottomLegend(), "center"));
    suite.add(LegendTest("spline", "left", leftLegend(), "middle"));
    suite.add(LegendTest("spline", "top", topLegendLeft(), "left"));
    suite.add(LegendTest("spline", "right", rightLegendTop(), "top"));
    suite.add(LegendTest("spline", "bottom", bottomLegendLeft(), "left"));
    suite.add(LegendTest("spline", "left", leftLegendTop(), "top"));
    suite.add(LegendTest("spline", "top", topLegendRight(), "right"));
    suite.add(LegendTest("spline", "right", rightLegendBottom(), "bottom"));
    suite.add(LegendTest("spline", "bottom", bottomLegendRight(), "right"));
    suite.add(LegendTest("spline", "left",  leftLegendBottom(), "bottom"));
    suite.add(LegendPositionTest("spline"));
    
    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['charts-legend', 'test']});
