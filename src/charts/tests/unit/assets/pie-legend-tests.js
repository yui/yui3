YUI.add('pie-legend-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: PieLegend"),

    LegendTestTemplate = function(cfg, globalCfg)
    {
        var i;
        LegendTestTemplate.superclass.constructor.apply(this);
        cfg.width = cfg.width || 400;
        cfg.height = cfg.height || 300;
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
            Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="mychart"></div>');
            this.chart = new Y.Chart(this.attrCfg);
        },
        
        tearDown: function() {
            this.chart.destroy(true);
            Y.one("#testbed").destroy(true);
        }
    });

    var basicDataValues = [ 
            {date:"5/1/2010", miscellaneous:2000, expenses:3700, revenue:2200}, 
            {date:"5/2/2010", miscellaneous:50, expenses:9100, revenue:100}, 
            {date:"5/3/2010", miscellaneous:400, expenses:1100, revenue:1500}, 
            {date:"5/4/2010", miscellaneous:200, expenses:1900, revenue:2800}, 
            {date:"5/5/2010", miscellaneous:5000, expenses:5000, revenue:2650}
    ],
    
    pieDataValues = [ 
            {date:"5/1/2010", miscellaneous:2000}, 
            {date:"5/2/2010", miscellaneous:50}, 
            {date:"5/3/2010", miscellaneous:400}, 
            {date:"5/4/2010", miscellaneous:200}, 
            {date:"5/5/2010", miscellaneous:5000}
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

    testPieLegendItemsLength = function()
    {
        var assert = Y.Assert,
            chart = this.chart,
            legend = chart.get("legend"),
            chartSC = chart.get("seriesCollection")[0].get("markers"),
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

    testPieLegendItemsText = function()
    {
        var assert = Y.Assert,
            chart = this.chart,
            legend = chart.get("legend"),
            series = chart.get("seriesCollection")[0],
            displayName,
            legendItems = legend.get("items"),
            i = 0,
            len = legendItems.length;
        for(; i < len; ++i)
        {
            displayName = chart.getSeriesItems(series, i).category.value;
            assert.areEqual(displayName, legendItems[i].text);
        }
    },
    
    PieNoLegendTest = new LegendTestTemplate({
        type: "pie",
        dataProvider: pieDataValues,
        render: "#mychart"
    }, {
        name: "Pie No Legend Tests",

        testNoLegend: function()
        {
            var assert = Y.Assert,
                chart = this.chart,
                legend = chart.get("legend");
            assert.isUndefined(legend);
        }
    }),
    
    PieTopLegendTest = new LegendTestTemplate({
        type: "pie",
        dataProvider: pieDataValues,
        render: "#mychart",
        legend: topLegend()
    }, {
        name: "Top Legend Test",

        testLegend: testLegend
    }),
    
    PieRightLegendTest = new LegendTestTemplate({
        type: "pie",
        dataProvider: pieDataValues,
        render: "#mychart",
        legend: rightLegend()
    }, {
        name: "Pie Right Legend Test",

        testLegend: testLegend
    }),
    
    PieBottomLegendTest = new LegendTestTemplate({
        type: "pie",
        dataProvider: pieDataValues,
        render: "#mychart",
        legend: bottomLegend()
    }, {
        name: "Pie Bottom Legend Test",

        testLegend: testLegend
    }),
    
    PieLeftLegendTest = new LegendTestTemplate({
        type: "pie",
        dataProvider: pieDataValues,
        render: "#mychart",
        legend: leftLegend()
    }, {
        name: "Pie Left Legend Test",

        testLegend: testLegend
    }),
    
    PieTopLegendPositionTest = new LegendTestTemplate({
        type: "pie",
        dataProvider: pieDataValues,
        render: "#mychart",
        legend: topLegend()
    }, {
        name: "Pie Top Legend Position Test",

        legendPosition: "top",

        testLegendPosition: testLegendPosition
    }),
    
    PieRightLegendPositionTest = new LegendTestTemplate({
        type: "pie",
        dataProvider: pieDataValues,
        render: "#mychart",
        legend: rightLegend()
    }, {
        name: "Pie Right Legend Position Test",

        legendPosition: "right",

        testLegend: testLegendPosition
    }),
    
    PieBottomLegendPositionTest = new LegendTestTemplate({
        type: "pie",
        dataProvider: pieDataValues,
        render: "#mychart",
        legend: bottomLegend()
    }, {
        name: "Pie Bottom Legend Position Test",

        legendPosition: "bottom",

        testLegend: testLegendPosition
    }),
    
    PieLeftLegendPositionTest = new LegendTestTemplate({
        type: "pie",
        dataProvider: pieDataValues,
        render: "#mychart",
        legend: leftLegend()
    }, {
        name: "Pie Left Legend Position Test",
        
        legendPosition: "left",

        testLegend: testLegendPosition
    }),

    PieTopLegendItemsLengthTest = new LegendTestTemplate({
        type: "pie",
        dataProvider: pieDataValues,
        render: "#mychart",
        legend: topLegend()
    }, {
        name: "Pie Top Legend Items Length Test",

        testLegend: testPieLegendItemsLength
    }),
    
    PieRightLegendItemsLengthTest = new LegendTestTemplate({
        type: "pie",
        dataProvider: pieDataValues,
        render: "#mychart",
        legend: rightLegend()
    }, {
        name: "Pie Right Legend Items Length Test",

        testLegend: testPieLegendItemsLength
    }),
    
    PieBottomLegendItemsLengthTest = new LegendTestTemplate({
        type: "pie",
        dataProvider: pieDataValues,
        render: "#mychart",
        legend: bottomLegend()
    }, {
        name: "Pie Bottom Legend Items Length Test",

        testLegend: testPieLegendItemsLength
    }),
    
    PieLeftLegendItemsLengthTest = new LegendTestTemplate({
        type: "pie",
        dataProvider: pieDataValues,
        render: "#mychart",
        legend: leftLegend()
    }, {
        name: "Pie Left Legend Items Length Test",

        testLegend: testPieLegendItemsLength
    }),
    
    PieTopLegendItemsTextTest = new LegendTestTemplate({
        type: "pie",
        dataProvider: pieDataValues,
        render: "#mychart",
        legend: topLegend()
    }, {
        name: "Pie Top Legend Items Text Test",

        testLegend: testPieLegendItemsText
    }),
    
    PieRightLegendItemsTextTest = new LegendTestTemplate({
        type: "pie",
        dataProvider: pieDataValues,
        render: "#mychart",
        legend: rightLegend()
    }, {
        name: "Pie Right Legend Items Text Test",

        testLegend: testPieLegendItemsText
    }),
    
    PieBottomLegendItemsTextTest = new LegendTestTemplate({
        type: "pie",
        dataProvider: pieDataValues,
        render: "#mychart",
        legend: bottomLegend()
    }, {
        name: "Pie Bottom Legend Items Text Test",

        testLegend: testPieLegendItemsText
    }),
    
    PieLeftLegendItemsTextTest = new LegendTestTemplate({
        type: "pie",
        dataProvider: pieDataValues,
        render: "#mychart",
        legend: leftLegend()
    }, {
        name: "Pie Left Legend Items Text Test",

        testLegend: testPieLegendItemsText
    });
    
    suite.add(PieNoLegendTest);
    suite.add(PieTopLegendTest);
    suite.add(PieRightLegendTest);
    suite.add(PieBottomLegendTest);
    suite.add(PieLeftLegendTest);
    suite.add(PieTopLegendPositionTest);
    suite.add(PieRightLegendPositionTest);
    suite.add(PieBottomLegendPositionTest);
    suite.add(PieLeftLegendPositionTest);
    suite.add(PieTopLegendItemsLengthTest);
    suite.add(PieRightLegendItemsLengthTest);
    suite.add(PieBottomLegendItemsLengthTest);
    suite.add(PieLeftLegendItemsLengthTest);
    suite.add(PieTopLegendItemsTextTest);
    suite.add(PieRightLegendItemsTextTest);
    suite.add(PieBottomLegendItemsTextTest);
    suite.add(PieLeftLegendItemsTextTest);

    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['charts-legend', 'test']});
