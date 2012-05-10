YUI.add('charts-legend-tests', function(Y) {
    var suite = new Y.Test.Suite("Y.Charts.Legend"),

    LegendTestTemplate = function(cfg, globalCfg)
    {
        var i;
        LegendTestTemplate.superclass.constructor.apply(this);
        cfg.width = cfg.width || 800;
        cfg.height = cfg.height || 600;
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
            Y.one("body").append('<div id="testbed"></div>');
            Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:800px;height:600px" id="mychart"></div>');
            this.chart = new Y.Chart(this.attrCfg);
        },
        
        tearDown: function() {
            this.chart.destroy(true);
            Y.one("#testbed").remove(true);
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
    
    bottomLegend = function()
    {
        return {
            position: "bottom",
            styles: {
                hAlign: "center"
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

    rightLegend = function()
    {
        return {
            position: "right",
            styles: {
                vAlign: "middle"
            }
        };
    },

    testLegend = function()
    {
        var assert = Y.Assert,
            chart = this.chart,
            legend = chart.get("legend");
        assert.isTrue(legend instanceof Y.ChartLegend);
    },

    testLegendPosition = function()
    {
        var assert = Y.Assert,
            chart = this.chart,
            legend = chart.get("legend");
        assert.areEqual(legend.get("position"), this.legendPosition);
    },

    testLegendItemsLength = function()
    {
        var assert = Y.Assert,
            chart = this.chart,
            legend = chart.get("legend"),
            chartSC = chart.get("seriesCollection"),
            legendItems = legend.get("items");
        assert.areEqual(chartSC.length, legendItems.length);
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
    
    NoLegendTest = new LegendTestTemplate({
        dataProvider: basicDataValues,
        render: "#mychart"
    }, {
        name: "No Legend Tests",

        testNoLegend: function()
        {
            var assert = Y.Assert,
                chart = this.chart,
                legend = chart.get("legend");
            assert.isUndefined(legend);
        }
    }),
    
    TopLegendTest = new LegendTestTemplate({
        dataProvider: basicDataValues,
        render: "#mychart",
        legend: topLegend()
    }, {
        name: "Top Legend Test",

        testDefault: testLegend
    }),
    
    RightLegendTest = new LegendTestTemplate({
        dataProvider: basicDataValues,
        render: "#mychart",
        legend: rightLegend()
    }, {
        name: "Right Legend Test",

        testDefault: testLegend
    }),
    
    BottomLegendTest = new LegendTestTemplate({
        dataProvider: basicDataValues,
        render: "#mychart",
        legend: bottomLegend()
    }, {
        name: "Bottom Legend Test",

        testDefault: testLegend
    }),
    
    LeftLegendTest = new LegendTestTemplate({
        dataProvider: basicDataValues,
        render: "#mychart",
        legend: leftLegend()
    }, {
        name: "Left Legend Test",

        testDefault: testLegend
    }),
    
    TopLegendPositionTest = new LegendTestTemplate({
        dataProvider: basicDataValues,
        render: "#mychart",
        legend: topLegend()
    }, {
        name: "Top Legend Position Test",

        legendPosition: "top",

        testDefault: testLegendPosition
    }),
    
    RightLegendPositionTest = new LegendTestTemplate({
        dataProvider: basicDataValues,
        render: "#mychart",
        legend: rightLegend()
    }, {
        name: "Right Legend Position Test",

        legendPosition: "right",

        testDefault: testLegendPosition
    }),
    
    BottomLegendPositionTest = new LegendTestTemplate({
        dataProvider: basicDataValues,
        render: "#mychart",
        legend: bottomLegend()
    }, {
        name: "Bottom Legend Position Test",

        legendPosition: "bottom",

        testDefault: testLegendPosition
    }),
    
    LeftLegendPositionTest = new LegendTestTemplate({
        dataProvider: basicDataValues,
        render: "#mychart",
        legend: leftLegend()
    }, {
        name: "Left Legend Position Test",
        
        legendPosition: "left",

        testDefault: testLegendPosition
    }),

    TopLegendItemsLengthTest = new LegendTestTemplate({
        dataProvider: basicDataValues,
        render: "#mychart",
        legend: topLegend()
    }, {
        name: "Top Legend Items Length Test",

        testDefault: testLegendItemsLength
    }),
    
    RightLegendItemsLengthTest = new LegendTestTemplate({
        dataProvider: basicDataValues,
        render: "#mychart",
        legend: rightLegend()
    }, {
        name: "Right Legend Items Length Test",

        testDefault: testLegendItemsLength
    }),
    
    BottomLegendItemsLengthTest = new LegendTestTemplate({
        dataProvider: basicDataValues,
        render: "#mychart",
        legend: bottomLegend()
    }, {
        name: "Bottom Legend Items Length Test",

        testDefault: testLegendItemsLength
    }),
    
    LeftLegendItemsLengthTest = new LegendTestTemplate({
        dataProvider: basicDataValues,
        render: "#mychart",
        legend: leftLegend()
    }, {
        name: "Left Legend Items Length Test",

        testDefault: testLegendItemsLength
    }),
    
    TopLegendItemsTextTest = new LegendTestTemplate({
        dataProvider: basicDataValues,
        render: "#mychart",
        legend: topLegend()
    }, {
        name: "Top Legend Items Text Test",

        testDefault: testLegendItemsText
    }),
    
    RightLegendItemsTextTest = new LegendTestTemplate({
        dataProvider: basicDataValues,
        render: "#mychart",
        legend: rightLegend()
    }, {
        name: "Right Legend Items Text Test",

        testDefault: testLegendItemsText
    }),
    
    BottomLegendItemsTextTest = new LegendTestTemplate({
        dataProvider: basicDataValues,
        render: "#mychart",
        legend: bottomLegend()
    }, {
        name: "Bottom Legend Items Text Test",

        testDefault: testLegendItemsText
    }),
    
    LeftLegendItemsTextTest = new LegendTestTemplate({
        dataProvider: basicDataValues,
        render: "#mychart",
        legend: leftLegend()
    }, {
        name: "Left Legend Items Text Test",

        testDefault: testLegendItemsText
    });
    
    suite.add(NoLegendTest);
    suite.add(TopLegendTest);
    suite.add(RightLegendTest);
    suite.add(BottomLegendTest);
    suite.add(LeftLegendTest);
    suite.add(TopLegendPositionTest);
    suite.add(RightLegendPositionTest);
    suite.add(BottomLegendPositionTest);
    suite.add(LeftLegendPositionTest);
    suite.add(TopLegendItemsLengthTest);
    suite.add(RightLegendItemsLengthTest);
    suite.add(BottomLegendItemsLengthTest);
    suite.add(LeftLegendItemsLengthTest);
    suite.add(TopLegendItemsTextTest);
    suite.add(RightLegendItemsTextTest);
    suite.add(BottomLegendItemsTextTest);
    suite.add(LeftLegendItemsTextTest);
    
    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['charts-legend', 'test']});
