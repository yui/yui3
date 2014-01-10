YUI.add('verticalarea-globalstyles-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: VerticalAreaGlobalStyles"),
        GlobalStylesTestTemplate,
        parentDiv = Y.DOM.create('<div style="position:absolute;top:500px;left:0px;width:500px;height:400px" id="testdiv"></div>'),
        DOC = Y.config.doc;
    DOC.body.appendChild(parentDiv);

    GlobalStylesTestTemplate = function(cfg, globalCfg)
    {
        var i;
        GlobalStylesTestTemplate.superclass.constructor.apply(this);
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

    Y.extend(GlobalStylesTestTemplate, Y.Test.Case, {
        setUp: function() {
            this.chart = new Y.Chart(this.attrCfg);
        },
       
        testGlobalStyles: function()
        {
            var chart = this.chart,
                testStyles = this.testStyles,
                axesTestStyles = testStyles.axes,
                seriesTestStyles = testStyles.series,
                graphTestStyles = testStyles.graph,
                styles = chart.get("styles"),
                axesStyles = styles.axes,
                seriesStyles = styles.series,
                graphStyles = styles.graph,
                i;
            Y.Assert.areEqual(axesTestStyles.values.label.rotation, axesStyles.values.label.rotation, "The rotation of the axis label should be " + axesTestStyles.values.label.rotation + "."); 
            Y.Assert.areEqual(axesTestStyles.date.label.rotation, axesStyles.date.label.rotation, "The rotation of the axis label should be " + axesTestStyles.date.label.rotation + "."); 
            Y.Assert.areEqual(graphTestStyles.background.fill.color, graphStyles.background.fill.color, "The background color should be " + graphTestStyles.background.fill.color + ".");
            for(i in seriesTestStyles)
            {
                if(seriesTestStyles.hasOwnProperty(i))
                {
                    testStyles = seriesTestStyles[i];
                    styles = seriesStyles[i];
                    if(styles)
                    {
                        Y.Assert.areEqual(testStyles.area.color, styles.area.color, "The area color should be " + testStyles.area.color + ".");
                    }
                }
            }
        },

        testStylesByComponent: function()
        {
            var chart = this.chart,
                testStyles = this.testStyles,
                axesTestStyles = testStyles.axes,
                seriesTestStyles = testStyles.series,
                graphTestStyles = testStyles.graph,
                valueAxisStyles = chart.getAxisByKey("values").get("styles"),
                categoryAxisStyles = chart.getAxisByKey("date").get("styles"),
                graphStyles = chart.get("graph").get("styles"),
                series,
                styles,
                i;
            Y.Assert.areEqual(axesTestStyles.values.label.rotation, valueAxisStyles.label.rotation, "The rotation of the axis label should be " + axesTestStyles.values.label.rotation + ".");
            Y.Assert.areEqual(axesTestStyles.date.label.rotation, categoryAxisStyles.label.rotation, "The rotation of the axis label should be " + axesTestStyles.date.label.rotation + "."); 
            Y.Assert.areEqual(graphTestStyles.background.fill.color, graphStyles.background.fill.color, "The background color should be " + graphTestStyles.background.fill.color + ".");
            for(i in seriesTestStyles)
            {
                if(seriesTestStyles.hasOwnProperty(i))
                {
                    testStyles = seriesTestStyles[i];
                    series = chart.getSeries(i);
                    styles = series.get("styles");
                    if(styles)
                    {
                        Y.Assert.areEqual(testStyles.area.color, styles.area.color, "The area color should be " + testStyles.area.color + ".");
                    }
                }
            }
        },

        tearDown: function() {
            this.chart.destroy(true);
            Y.Event.purgeElement(DOC, false);
        }
    });

    var basicDataValues = [ 
        {date:"5/1/2010", international:2000, expenses:3700, domestic:2200}, 
        {date:"5/2/2010", international:50, expenses:9100, domestic:100}, 
        {date:"5/3/2010", international:400, expenses:1100, domestic:1500}, 
        {date:"5/4/2010", international:200, expenses:1900, domestic:2800}, 
        {date:"5/5/2010", international:5000, expenses:5000, domestic:2650}
    ],
    
    hashSeriesStyles = {
        international:{
            area:{
                color:"#ff0000"
            }
        },
        expenses:{
            area:{
                color:"#999"
            }
        },
        domestic: {
            area: {
                color: "#5aa"
            }
        }
    },
    
    arraySeriesStyles = [
        {
            area:{
                color:"#ff0000"
            }
        },
        {
            area:{
                color:"#999"
            }
        },
        {
            area: {
                color: "#5aa"
            }
        }
    ],
    
    axesStyles = {
        values:{
            label:{
                rotation:45,
                color:"#ff0000"
            }
        },
        date:{
            label:{
                rotation:-45,
                color: "#ff0000"
            }
        }
    },
    
    graphStyles = {
        background: {
            fill:{
                color:"#ffff33"
            },
            border: {
                color:"#9aa",
                weight: 2
            }
        }
    },

    getGlobalStylesTest = function(chartType, categoryAxisType, seriesStyles, direction, stacked)
    {
        var cfg = {
            type: chartType,
            dataProvider: basicDataValues,
            render: "#testdiv",
            horizontalGridlines: true,
            verticalGridlines: true,
            styles: {
                graph: graphStyles,
                axes: axesStyles,
                series: seriesStyles
            }
        },
        globalCfg = {
            testStyles: {
                graph: graphStyles,
                axes: axesStyles,
                series: hashSeriesStyles
            }
        };
        if(direction)
        {
            cfg.direction = direction;
        }
        if(stacked)
        {
            cfg.stacked = stacked;
        }
        if(categoryAxisType)
        {
            cfg.categoryType = categoryAxisType;
        }
        return new GlobalStylesTestTemplate(cfg, globalCfg);
    };
    
    suite.add(getGlobalStylesTest("area", null, hashSeriesStyles, "vertical", false));
    suite.add(getGlobalStylesTest("area", null, arraySeriesStyles, "vertical", false));
    suite.add(getGlobalStylesTest("area", null, hashSeriesStyles, "vertical", true));
    suite.add(getGlobalStylesTest("area", null, arraySeriesStyles, "vertical", true));
    suite.add(getGlobalStylesTest("area", "time", hashSeriesStyles, "vertical", false));
    suite.add(getGlobalStylesTest("area", "time", arraySeriesStyles, "vertical", false));
    suite.add(getGlobalStylesTest("area", "time", hashSeriesStyles, "vertical", true));
    suite.add(getGlobalStylesTest("area", "time", arraySeriesStyles, "vertical", true));

    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['charts', 'test']});
