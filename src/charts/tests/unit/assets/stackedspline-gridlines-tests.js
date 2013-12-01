YUI.add('stackedspline-gridlines-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: StackedSplineGridlines"),
        GridlinesTestTemplate,
        parentDiv = Y.DOM.create('<div style="position:absolute;top:500px;left:0px;width:500px;height:400px" id="testdiv"></div>'),
        DOC = Y.config.doc;
    DOC.body.appendChild(parentDiv);

    GridlinesTestTemplate = function(cfg, globalCfg)
    {
        var i;
        GridlinesTestTemplate.superclass.constructor.apply(this);
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

    Y.extend(GridlinesTestTemplate, Y.Test.Case, {
        setUp: function() {
            this.chart = new Y.Chart(this.attrCfg);
        },
        
        testDefault: function()
        {
            var chart = this.chart.get("graph"),
                chartHasHorizontalGridlines = chart.get("horizontalGridlines") ? true : false,
                chartHasVerticalGridlines = chart.get("verticalGridlines") ? true : false,
                shouldHaveHorizontal = this.hasHorizontal,
                shouldHaveVertical = this.hasVertical,
                hFailMessage = shouldHaveHorizontal ? "The chart should have horizontal gridlines." : "The chart should not have horizontal gridlines.",
                vFailMessage = shouldHaveVertical ? "The chart should have vertical gridlines." : "The chart should not have vertical gridlines.";
            Y.Assert.areEqual(shouldHaveHorizontal, chartHasHorizontalGridlines, hFailMessage);
            Y.Assert.areEqual(shouldHaveVertical, chartHasVerticalGridlines, vFailMessage);
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
    
    styledGridlines = {
        styles: {
            line: {
                color: "#9aa"
            }
        }
    },

    getGridlinesTest = function(chartType, categoryAxisType, hGridlines, vGridlines)
    {
        var cfg = {
            stacked: true,
            type: chartType,
            dataProvider: basicDataValues,
            render: "#testdiv"
        },
        globalCfg = {
            hasHorizontal: false,
            hasVertical: false
        };
        if(categoryAxisType)
        {
            cfg.categoryType = categoryAxisType;
        }
        if(hGridlines)
        {
            cfg.horizontalGridlines = hGridlines;
            globalCfg.hasHorizontal = true;
        }
        if(vGridlines)
        {
            cfg.verticalGridlines = vGridlines;
            globalCfg.hasVertical = true;
        }
        return new GridlinesTestTemplate(cfg, globalCfg);
    };
    
    suite.add(getGridlinesTest("spline", null, true, false));
    suite.add(getGridlinesTest("spline", null, true, true));
    suite.add(getGridlinesTest("spline", null, false, true));
    suite.add(getGridlinesTest("spline", null, styledGridlines, false));
    suite.add(getGridlinesTest("spline", null, styledGridlines, true));
    suite.add(getGridlinesTest("spline", null, styledGridlines, true));
    suite.add(getGridlinesTest("spline", null, true, styledGridlines));
    suite.add(getGridlinesTest("spline", null, true, styledGridlines));
    suite.add(getGridlinesTest("spline", null, false, styledGridlines));
    suite.add(getGridlinesTest("spline", "time", true, false));
    suite.add(getGridlinesTest("spline", "time", true, true));
    suite.add(getGridlinesTest("spline", "time", false, true));
    suite.add(getGridlinesTest("spline", "time", styledGridlines, false));
    suite.add(getGridlinesTest("spline", "time", styledGridlines, true));
    suite.add(getGridlinesTest("spline", "time", styledGridlines, true));
    suite.add(getGridlinesTest("spline", "time", true, styledGridlines));
    suite.add(getGridlinesTest("spline", "time", true, styledGridlines));
    suite.add(getGridlinesTest("spline", "time", false, styledGridlines));
    
    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['charts', 'test']});
