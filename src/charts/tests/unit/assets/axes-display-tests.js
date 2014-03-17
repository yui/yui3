YUI.add('axes-display-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: AxesDisplay"),
    ENGINE = "VML",
    DOCUMENT = Y.config.doc,
    canvas = DOCUMENT && DOCUMENT.createElement("canvas"),
    parentDiv = Y.DOM.create('<div style="position:absolute;top:500px;left:0px;width:500px;height:400px" id="testdiv"></div>'),
    DOC = Y.config.doc,
    TestSVGNodes = function(lineStyles, tickStyles, valueLinePath, valueTickPath, catLinePath, catTickPath)
    {
            var lineColor = lineStyles.color,
                lineWeight = lineStyles.weight,
                lineOpacity = lineStyles.alpha,
                tickColor = tickStyles.color,
                tickWeight = tickStyles.weight,
                tickOpacity = tickStyles.alpha,
                valueLineNode,
                valueTickNode,
                catLineNode,
                catTickNode,
                valueLineNodeWeight,
                valueLineNodeOpacity,
                valueLineNodeColor,
                catLineNodeWeight,
                catLineNodeOpacity,
                catLineNodeColor,
                valueTickNodeWeight,
                valueTickNodeOpacity,
                valueTickNodeColor,
                catTickNodeWeight,
                catTickNodeOpacity,
                catTickNodeColor;
            
            if(valueTickPath)
            {
                valueTickNode = valueTickPath.get("node");
                valueTickNodeWeight = parseFloat(valueTickNode.getAttribute("stroke-width"));
                valueTickNodeOpacity = parseFloat(valueTickNode.getAttribute("stroke-opacity"));
                valueTickNodeColor = valueTickNode.getAttribute("stroke");
                Y.Assert.areEqual(tickColor, valueTickNodeColor, "The color of the value axis tick should be " + tickColor + ".");
                Y.Assert.areEqual(tickWeight, valueTickNodeWeight, "The weight of the value axis tick should be " + tickWeight + ".");
                Y.Assert.areEqual(tickOpacity, valueTickNodeOpacity, "The opacity of the value axis tick should be " + tickOpacity + ".");
            }
            
            if(catTickPath)
            {
                catTickNode = catTickPath.get("node");
                catTickNodeWeight = parseFloat(catTickNode.getAttribute("stroke-width"));
                catTickNodeOpacity = parseFloat(catTickNode.getAttribute("stroke-opacity"));
                catTickNodeColor = catTickNode.getAttribute("stroke");
                Y.Assert.areEqual(tickColor, catTickNodeColor, "The color of the category axis tick should be " + tickColor + ".");
                Y.Assert.areEqual(tickWeight, catTickNodeWeight, "The weight of the category axis tick should be " + tickWeight + ".");
                Y.Assert.areEqual(tickOpacity, catTickNodeOpacity, "The opacity of the category axis tick should be " + tickOpacity + ".");
            }

            if(valueLinePath)
            {
                valueLineNode = valueLinePath.get("node");
                valueLineNodeWeight = parseFloat(valueLineNode.getAttribute("stroke-width"));
                valueLineNodeOpacity = parseFloat(valueLineNode.getAttribute("stroke-opacity"));
                valueLineNodeColor = valueLineNode.getAttribute("stroke");
                Y.Assert.areEqual(lineColor, valueLineNodeColor, "The color of the value axis line should be " + lineColor + ".");
                Y.Assert.areEqual(lineWeight, valueLineNodeWeight, "The weight of the value axis line should be " + lineWeight + ".");
                Y.Assert.areEqual(lineOpacity, valueLineNodeOpacity, "The opacity of the value axis line should be " + lineOpacity + ".");
            }

            if(catLinePath)
            {
                catLineNode = catLinePath.get("node");
                catLineNodeWeight = parseFloat(catLineNode.getAttribute("stroke-width"));
                catLineNodeOpacity = parseFloat(catLineNode.getAttribute("stroke-opacity"));
                catLineNodeColor = catLineNode.getAttribute("stroke");
                Y.Assert.areEqual(lineColor, catLineNodeColor, "The color of the category axis line should be " + lineColor + ".");
                Y.Assert.areEqual(lineWeight, catLineNodeWeight, "The weight of the category axis line should be " + lineWeight + ".");
                Y.Assert.areEqual(lineOpacity, catLineNodeOpacity, "The opacity of the category axis line should be " + lineOpacity + ".");
            }
            
            if(tickStyles.display == "none")
            {
                Y.Assert.isTrue(!valueTickPath, "There should not be a path element for the value axis ticks.");
                Y.Assert.isTrue(!catTickPath, "There should not be a path element for the category axis ticks.");
            }
    },

    compareVMLColors = function(color, strokeNode, node)
    {
        var toHex = Y.Color.toHex;
        color = toHex(color);
        return (color == toHex(strokeNode.color) || color == toHex(strokeNode.color.value)) ||
        (color == toHex(node.strokecolor) || color == toHex(node.strokecolor.value));
    },

    compareVMLStrokeWeight = function(weight, strokeNode, node)
    {
        weight = parseFloat(weight);
        return weight === parseFloat(strokeNode.weight) || weight === parseFloat(node.strokeWeight);
    },

    TestVMLNodes = function(lineStyles, tickStyles, valueLinePath, valueTickPath, catLinePath, catTickPath)
    {
            var lineColor = lineStyles.color,
                lineWeight = lineStyles.weight,
                lineOpacity = lineStyles.alpha,
                tickColor = tickStyles.color,
                tickWeight = tickStyles.weight,
                tickOpacity = tickStyles.alpha,
                valueTickStrokeNode,
                valueTickNode,
                catTickStrokeNode,
                catTickNode,
                valueLineStrokeNode,
                valueLineNode,
                catLineStrokeNode,
                catLineNode;
            
            if(valueTickPath)
            {
                valueTickNode = valueTickPath.get("stroke");
                valueTickStrokeNode = valueTickPath._strokeNode;
                Y.Assert.isTrue(compareVMLColors(tickColor, valueTickStrokeNode, valueTickNode), "The color of the value axis ticks should be " + tickColor + ".");
                //Y.Assert.isTrue(compareVMLStrokeWeight(tickWeight, valueTickStrokeNode, valueTickNode), "The weight of the value axis ticks should be " + tickWeight + ".");
                Y.Assert.areEqual(parseFloat(tickOpacity), parseFloat(valueTickStrokeNode.opacity), "The opacity of the value axis ticks should be " + tickOpacity + ".");
            }
            if(catTickPath)
            {
                catTickStrokeNode = catTickPath._strokeNode;
                catTickNode = catTickPath.get("node");
                Y.Assert.isTrue(compareVMLColors(tickColor, catTickStrokeNode, catTickNode), "The color of the category axis ticks should be " + tickColor + ".");
                //Y.Assert.isTrue(compareVMLStrokeWeight(tickWeight, catTickStrokeNode, catTickNode), "The weight of the category axis ticks should be " + tickWeight + ".");
                Y.Assert.areEqual(parseFloat(tickOpacity), parseFloat(catTickStrokeNode.opacity), "The opacity of the category axis ticks should be " + tickOpacity + ".");
            }

            if(valueLinePath)
            {
                valueLineStrokeNode = valueLinePath._strokeNode;
                valueLineNode = valueLinePath.get("stroke");
                Y.Assert.isTrue(compareVMLColors(lineColor, valueLineStrokeNode, valueLineNode), "The value axis line color should be " + lineColor + ".");
                //Y.Assert.isTrue(compareVMLStrokeWeight(lineWeight, valueLineStrokeNode, valueLineNode), "The value axis line weight should be " + lineWeight + ".");
                Y.Assert.areEqual(parseFloat(lineOpacity), parseFloat(valueLineStrokeNode.opacity), "The opacity of the value axis line should be " + lineOpacity + ".");
            }

            if(catLinePath)
            {
                catLineStrokeNode = catLinePath._strokeNode;
                catLineNode = catLinePath.get("node");
                Y.Assert.isTrue(compareVMLColors(lineColor, catLineStrokeNode, catLineNode), "The color of the category axis line should be " + lineColor + ".");
                //Y.Assert.isTrue(compareVMLStrokeWeight(lineWeight, catLineStrokeNode, catLineNode), "The weight of the category axis line should be " + lineWeight + ".");
                Y.Assert.areEqual(parseFloat(lineOpacity), parseFloat(catLineStrokeNode.opacity), "The opacity of the category axis line should be " + lineOpacity + ".");
            }
            
            if(tickStyles.display == "none")
            {
                Y.Assert.isTrue(!valueTickPath, "There should not be a path element for the value axis ticks.");
                Y.Assert.isTrue(!catTickPath, "There should not be a path element for the category axis ticks.");
            }
    },

    toRGBA = function(val, alpha) {
        alpha = (alpha !== undefined) ? alpha : 1;
        if (!Y.Color.re_RGB.test(val)) {
            val = Y.Color.toHex(val);
        }

        if(Y.Color.re_hex.exec(val)) {
            val = 'rgba(' + [
                parseInt(RegExp.$1, 16),
                parseInt(RegExp.$2, 16),
                parseInt(RegExp.$3, 16)
            ].join(',') + ',' + alpha + ')';
        }
        return val;
    },

    TestCanvasNodes = function(lineStyles, tickStyles, valueLinePath, valueTickPath, catLinePath, catTickPath)
    {
            var toHex = Y.Color.toHex,
                lineColor = toHex(lineStyles.color),
                lineWeight = lineStyles.weight,
                lineOpacity = lineStyles.alpha,
                tickColor = toHex(tickStyles.color),
                tickWeight = tickStyles.weight,
                tickOpacity = tickStyles.alpha,
                valueLineContext,
                valueTickContext,
                catLineContext,
                catTickContext,
                valueLineColor,
                valueTickColor,
                catLineColor,
                catTickColor;

            lineOpacity = Y.Lang.isNumber(lineOpacity) ? lineOpacity : 1;
            tickOpacity = Y.Lang.isNumber(tickOpacity) ? tickOpacity : 1;

            if(valueLinePath)
            {
                valueLineContext = valueLinePath._context;
                valueLineColor = valueLineContext.strokeStyle;
                //Test values line color and alpha 
                if(valueLineColor.indexOf("RGBA") > -1 || valueLineColor.indexOf("rgba") > -1)
                {
                    valueLineColor = valueLineColor.toLowerCase();
                    valueLineColor = valueLineColor.replace(/, /g, ",");
                    Y.Assert.areEqual(valueLineColor, toRGBA(toHex(lineColor), lineOpacity), "The line color of the value axis should be " + lineColor + ".");
                }
                else
                {
                    Y.Assert.areEqual(toHex(valueLineColor), lineColor, "The line color of the value axis should be " + lineColor + ".");
                }
                Y.Assert.areEqual(lineWeight, valueLineContext.lineWidth, "The width of the value axis line should be " + lineWeight + ".");
            }

            if(catLinePath)
            {
                catLineContext = catLinePath._context;
                catLineColor = catLineContext.strokeStyle;
                //Test category line color and alpha 
                if(catLineColor.indexOf("RGBA") > -1 || catLineColor.indexOf("rgba") > -1)
                {
                    catLineColor = catLineColor.toLowerCase();
                    catLineColor = catLineColor.replace(/, /g, ",");
                    Y.Assert.areEqual(catLineColor, toRGBA(toHex(lineColor), lineOpacity), "The line color of the category axis should be " + lineColor + ".");
                }
                else
                {
                    Y.Assert.areEqual(toHex(catLineColor), lineColor, "The line color of the category axis should be " + lineColor + ".");
                }
                Y.Assert.areEqual(lineWeight, catLineContext.lineWidth, "The width of the category axis line should be " + lineWeight + ".");
            }

            if(valueTickPath)
            {
                valueTickContext = valueTickPath._context;
                valueTickColor = valueTickContext.strokeStyle;
                //Test values ticks color and alpha 
                if(valueTickColor.indexOf("RGBA") > -1 || valueTickColor.indexOf("rgba") > -1)
                {
                    valueTickColor = valueTickColor.toLowerCase();
                    valueTickColor = valueTickColor.replace(/, /g, ",");
                    Y.Assert.areEqual(valueTickColor, toRGBA(toHex(tickColor), tickOpacity), "The color of the value axis ticks should be " + tickColor + ".");
                }
                else
                {
                    Y.Assert.areEqual(toHex(valueTickColor), tickColor, "The color of the value axis ticks should be " + tickColor + ".");
                }
                Y.Assert.areEqual(tickWeight, valueTickContext.lineWidth, "The width of the value axis ticks should be " + lineWeight + ".");
            }
            
            

            //Test category ticks color and alpha 
            if(catTickPath)
            {
                catTickContext = catTickPath._context;
                catTickColor = catTickContext.strokeStyle;
                if(catTickColor.indexOf("RGBA") > -1 || catTickColor.indexOf("rgba") > -1)
                {
                    catTickColor = catTickColor.toLowerCase();
                    catTickColor = catTickColor.replace(/, /g, ",");
                    Y.Assert.areEqual(catTickColor, toRGBA(toHex(tickColor), tickOpacity), "The color of the category axis ticks should be " + catTickColor + ".");
                }
                else
                {
                    Y.Assert.areEqual(toHex(catTickColor), tickColor, "The color of the category axis ticks should be " + tickColor + ".");
                }
                Y.Assert.areEqual(tickWeight, catTickContext.lineWidth, "The width of the category axis ticks should be " + lineWeight + ".");
            }
            
            if(tickStyles.display == "none")
            {
                Y.Assert.isTrue(!valueTickPath, "There should not be a path element for the value axis ticks.");
                Y.Assert.isTrue(!catTickPath, "There should not be a path element for the category axis ticks.");
            }
    };
    DOC.body.appendChild(parentDiv);

    if(Y.config.defaultGraphicEngine != "canvas" && DOCUMENT && DOCUMENT.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"))
    {
        ENGINE = "SVG";
    }
    else if(canvas && canvas.getContext && canvas.getContext("2d"))
    {
        ENGINE = "Canvas";
    }
    
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
            this.chart = new Y.Chart(this.attrCfg);
        },
        
        tearDown: function() {
            this.eventListener.detach();
            this.chart.destroy(true);
            Y.Event.purgeElement(DOC, false);
        }
    });
    
    function AxisDataProviderTemplate()
    {
        AxisDataProviderTemplate.superclass.constructor.apply(this, arguments);
    }

    Y.extend(AxisDataProviderTemplate, AxisTestTemplate, {
        testAxesMinAndMax: function()
        {
            var chart = this.chart,
                maxValues = this.maxValues,
                minValues = this.minValues;
            this.eventListener = this.chart.on("chartRendered", function(e) {
                var axes = chart.get("axes"),
                    catKey = chart.get("categoryKey"),
                    axis,
                    dataMin,
                    dataMax,
                    key,
                    keys,
                    len,
                    seriesKey;
                for(key in axes)
                {
                    if(axes.hasOwnProperty(key) && key != catKey)
                    {
                        axis = axes[key];
                        keys = axis.get("keys");
                        for(seriesKey in keys)
                        {
                            if(keys.hasOwnProperty(seriesKey))
                            {
                                maxValue = maxValues[seriesKey];
                                minValue = minValues[seriesKey];
                                Y.assert(axis.get("maximum") >= maxValue);
                                Y.assert(axis.get("minimum") <= minValue);
                            }

                        }
                    }
                }
            });
            this.chart.render("#testdiv");
        }
    });

    Y.AxisDataProviderTemplate = AxisDataProviderTemplate;

    function AxisGraphicStylesTemplate()
    {
        AxisGraphicStylesTemplate.superclass.constructor.apply(this, arguments);
        switch(ENGINE)
        {
            case "SVG" :
                this._testNodes = TestSVGNodes;
            break;
            case "Canvas" : 
                this._testNodes = TestCanvasNodes;
            break;
            case "VML" :
                this._testNodes = TestVMLNodes;
            break;
        }
    }

    Y.extend(AxisGraphicStylesTemplate, AxisTestTemplate, {
        testGraphicStyles: function()
        {
            var chart = this.chart,
                lineStyles = this.lineStyles,
                tickStyles = this.tickStyles,
                testNodes = this._testNodes;
            this.eventListener = this.chart.on("chartRendered", function(e) {
                var valueAxis = chart.getAxisByKey("values"),
                    catAxis = chart.getAxisByKey("category"),
                    valueLinePath = valueAxis._path,
                    valueTickPath = valueAxis._tickPath,
                    catLinePath = catAxis._path,
                    catTickPath = catAxis._tickPath;
                testNodes.apply(this, [
                    lineStyles, 
                    tickStyles, 
                    valueLinePath, 
                    valueTickPath, 
                    catLinePath, 
                    catTickPath
                ]);
            });
            this.chart.render("#testdiv");
        }
    
    });
    
    Y.AxisGraphicStylesTemplate = AxisGraphicStylesTemplate;

    var AxesTests = new Y.Test.Case({
        name: "Axes Tests",
        
        setUp: function() {
            var myDataValues = [ 
                {category:"5/1/2010", values:2000, expenses:3700, revenue:2200}, 
                {category:"5/2/2010", values:50, expenses:9100, revenue:100}, 
                {category:"5/3/2010", values:400, expenses:1100, revenue:1500}, 
                {category:"5/4/2010", values:200, expenses:1900, revenue:2800}, 
                {category:"5/5/2010", values:5000, expenses:5000, revenue:2650}
            ];
            var mychart = new Y.Chart({width:400, height:300, dataProvider:myDataValues, seriesKeys:["values", "revenue"]});
            mychart.render("#testdiv");
            this.chart = mychart;
        },

        tearDown: function() {
            this.chart.destroy(true);
            Y.Event.purgeElement(DOC, false);
        },

        //Test axes data classes
        testRemoveKey: function()
        {
            var assert = Y.Assert,
                xAxis = this.chart.getCategoryAxis(),
                yAxis = this.chart.getAxisByKey("values"),
                keys,
                l,
                i;
            this.xHandle = xAxis.on("dataUpdate", Y.bind(function(e) {
                l = xAxis.get("keyCollection").length || 0;
                assert.areEqual(0, 0, "The value should be zero");
            }, this));
            this.yHandle = yAxis.on("dataUpdate", Y.bind(function(e) {
                keys = yAxis.get("keyCollection");
                assert.areEqual(1, keys.length, "The length should be 1");
                assert.areEqual(Y.Array.indexOf(keys, "revenue"), -1, "The key revenue should be removed");
            }));
            xAxis.removeKey("category");
            yAxis.removeKey("revenue");
            this.xHandle.detach();
            this.yHandle.detach();
        },
        
        testAddKey: function()
        {       
            var assert = Y.Assert,
                yAxis = this.chart.getAxisByKey("values"),
                keys,
                pattern = [3700, 9100, 1100, 1900],
                testarray,
                i = 0;
                l = 4;
            this.yHandle = yAxis.on("dataUpdate", Y.bind(function(e) {
                keys = yAxis.get("keyCollection");
                testarray = yAxis.getDataByKey("expenses");
                assert.areEqual(3, keys.length);
                assert.areEqual(Y.Array.indexOf(keys, "expenses"), 2);
                for(; i < l; ++i)
                {
                    assert.areEqual(pattern[i], testarray[i]);
                }
            }, this));
            yAxis.addKey("expenses");
            this.yHandle.detach();
        }
    }), 

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
            this.chart = new Y.Chart({
                width:400, 
                height:300, 
                dataProvider:myDataValues
            });
        },

        tearDown: function() {
            this.eventListener.detach();
            this.chart.destroy(true);
            Y.Event.purgeElement(DOC, false);
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
                Y.Assert.areEqual(0, label, "The value should be zero.");
            });
            this.chart.render("#testdiv");
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
            Y.Event.purgeElement(DOC, false);
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
            this.chart.render("#testdiv");
        }
    }),

    allPositiveDataProvider =  [ 
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
    
    missingDataSmallDataProvider = [
        {date: "1/1/2010", expenses: 3700},
        {date: "1/2/2010", revenue: 2200},
        {date: "2/1/2010", expenses: 9100},
        {date: "2/2/2010", revenue: 100}
    ],

    missingDataLargeDataProvider = [
        {date: "1/1/2010", expenses: 3700},
        {date: "1/2/2010", revenue: 2200},
        {date: "1/3/2010", expenses: 3000},
        {date: "1/4/2010", revenue: 400},
        {date: "2/1/2010", expenses: 9100},
        {date: "2/2/2010", revenue: 100},
        {date: "2/3/2010", expenses: 3300},
        {date: "2/4/2010", revenue: 1500}
    ],
    
    AxisNoMinOrMaxTest = new Y.AxisDataProviderTemplate({
        dataProvider: allNegativeDataProvider
    }),

    DualAxesMissingDataSmallTest = new Y.AxisDataProviderTemplate({
        axes: {
            leftAxis: {
                keys: ["expenses"],
                type: "numeric",
                position: "left"
            },
            rightAxis: {
                keys: ["revenue"],
                type: "numeric",
                position: "right"
            }
        },
        categoryKey: "date",
        dataProvider: missingDataSmallDataProvider
    },
    {
        name: "Dual Axes Missing Data (small dataProvider) Test",
        maxValues: {
            expenses: 9100,
            revenue: 2200
        },
        minValues: {
            expenses: 3700,
            revenue: 100
        },
        seriesKeys: ["expenses", "revenue"]
    });
    
    DualAxesMissingDataLargeTest = new Y.AxisDataProviderTemplate({
        axes: {
            leftAxis: {
                keys: ["expenses"],
                type: "numeric",
                position: "left"
            },
            rightAxis: {
                keys: ["revenue"],
                type: "numeric",
                position: "right"
            }
        },
        categoryKey: "date",
        dataProvider: missingDataLargeDataProvider
    },
    {
        name: "Dual Axes Missing Data (large dataProvider) Test",
        maxValues: {
            expenses: 9100,
            revenue: 2200
        },
        minValues: {
            expenses: 3700,
            revenue: 100
        },
        seriesKeys: ["expenses", "revenue"]
    });
    
    DualAxesMissingDataSmallAlwaysShowZeroFalseTest = new Y.AxisDataProviderTemplate({
        axes: {
            leftAxis: {
                keys: ["expenses"],
                type: "numeric",
                position: "left",
                alwaysShowZero: false
            },
            rightAxis: {
                keys: ["revenue"],
                type: "numeric",
                position: "right",
                alwaysShowZero: false
            }
        },
        categoryKey: "date",
        dataProvider: missingDataSmallDataProvider
    },
    {
        name: "Dual Axes Missing Data (small dataProvider) Test with alwaysShowZero=false",
        maxValues: {
            expenses: 9100,
            revenue: 2200
        },
        minValues: {
            expenses: 3700,
            revenue: 100
        },
        seriesKeys: ["expenses", "revenue"]
    });
    
    DualAxesMissingDataLargeAlwaysShowZeroFalseTest = new Y.AxisDataProviderTemplate({
        axes: {
            leftAxis: {
                keys: ["expenses"],
                type: "numeric",
                position: "left",
                alwaysShowZero: false
            },
            rightAxis: {
                keys: ["revenue"],
                type: "numeric",
                position: "right",
                alwaysShowZero: false
            }
        },
        categoryKey: "date",
        dataProvider: missingDataLargeDataProvider
    },
    {
        name: "Dual Axes Missing Data (large dataProvider) Test with alwaysShowZero=false",
        maxValues: {
            expenses: 9100,
            revenue: 2200
        },
        minValues: {
            expenses: 3700,
            revenue: 100
        },
        seriesKeys: ["expenses", "revenue"]
    }),
    
    LeftAndBottomAxisCustomTickAndLinesInsideTicks = new Y.AxisGraphicStylesTemplate({
        axes: {
            category: {
                position: "bottom",
                type: "category",
                keys: ["category"],
                styles: {
                    line: {
                        weight: 2,
                        color: "#ff0000",
                        alpha: 1
                    },
                    majorTicks: {
                        weight: 1,
                        color: "#0000ff",
                        alpha: 0.5,
                        display: "inside"
                    }
                }
            },
            values: {
                position: "left",
                type: "numeric",
                keys: ["expenses", "revenue"],
                styles: {
                    line: {
                        weight: 2,
                        color: "#ff0000",
                        alpha: 1
                    },
                    majorTicks: {
                        weight: 1,
                        color: "#0000ff",
                        alpha: 0.5,
                        display: "inside"
                    }
                }
            }
        },
        dataProvider: allPositiveDataProvider
    },
    {
        name: "Custom Left and Bottom Axes with inside ticks",

        lineStyles: {
            weight: 2,
            color: "#ff0000",
            alpha: 1
        },
        tickStyles: {
            weight: 1,
            color: "#0000ff",
            alpha: 0.5,
            display: "inside"
        }
    }),

    LeftAndBottomAxisCustomTickAndLinesOutsideTicks = new Y.AxisGraphicStylesTemplate({
        axes: {
            category: {
                position: "bottom",
                type: "category",
                keys: ["category"],
                styles: {
                    line: {
                        weight: 2,
                        color: "#ff0000",
                        alpha: 1
                    },
                    majorTicks: {
                        weight: 1,
                        color: "#0000ff",
                        alpha: 0.5,
                        display: "outside"
                    }
                }
            },
            values: {
                position: "left",
                type: "numeric",
                keys: ["expenses", "revenue"],
                styles: {
                    line: {
                        weight: 2,
                        color: "#ff0000",
                        alpha: 1
                    },
                    majorTicks: {
                        weight: 1,
                        color: "#0000ff",
                        alpha: 0.5,
                        display: "outside"
                    }
                }
            }
        },
        dataProvider: allPositiveDataProvider
    },
    {
        name: "Custom Left and Bottom Axes with outside ticks",

        lineStyles: {
            weight: 2,
            color: "#ff0000",
            alpha: 1
        },
        tickStyles: {
            weight: 1,
            color: "#0000ff",
            alpha: 0.5,
            display: "outside"
        }
    }),

    LeftAndBottomAxisCustomTickAndLinesCrossTicks = new Y.AxisGraphicStylesTemplate({
        axes: {
            category: {
                position: "bottom",
                type: "category",
                keys: ["category"],
                styles: {
                    line: {
                        weight: 2,
                        color: "#ff0000",
                        alpha: 1
                    },
                    majorTicks: {
                        weight: 1,
                        color: "#0000ff",
                        alpha: 0.5,
                        display: "cross"
                    }
                }
            },
            values: {
                position: "left",
                type: "numeric",
                keys: ["expenses", "revenue"],
                styles: {
                    line: {
                        weight: 2,
                        color: "#ff0000",
                        alpha: 1
                    },
                    majorTicks: {
                        weight: 1,
                        color: "#0000ff",
                        alpha: 0.5,
                        display: "cross"
                    }
                }
            }
        },
        dataProvider: allPositiveDataProvider
    },
    {
        name: "Custom Left and Bottom Axes with cross ticks",

        lineStyles: {
            weight: 2,
            color: "#ff0000",
            alpha: 1
        },
        tickStyles: {
            weight: 1,
            color: "#0000ff",
            alpha: 0.5,
            display: "cross"
        }
    }),

    RightAndBottomAxisCustomTickAndLinesInsideTicks = new Y.AxisGraphicStylesTemplate({
        axes: {
            category: {
                position: "bottom",
                type: "category",
                keys: ["category"],
                styles: {
                    line: {
                        weight: 2,
                        color: "#ff0000",
                        alpha: 1
                    },
                    majorTicks: {
                        weight: 1,
                        color: "#0000ff",
                        alpha: 0.5,
                        display: "inside"
                    }
                }
            },
            values: {
                position: "right",
                type: "numeric",
                keys: ["expenses", "revenue"],
                styles: {
                    line: {
                        weight: 2,
                        color: "#ff0000",
                        alpha: 1
                    },
                    majorTicks: {
                        weight: 1,
                        color: "#0000ff",
                        alpha: 0.5,
                        display: "inside"
                    }
                }
            }
        },
        dataProvider: allPositiveDataProvider
    },
    {
        name: "Custom Right and Bottom Axes with inside ticks",

        lineStyles: {
            weight: 2,
            color: "#ff0000",
            alpha: 1
        },
        tickStyles: {
            weight: 1,
            color: "#0000ff",
            alpha: 0.5,
            display: "inside"
        }
    }),

    RightAndBottomAxisCustomTickAndLinesOutsideTicks = new Y.AxisGraphicStylesTemplate({
        axes: {
            category: {
                position: "bottom",
                type: "category",
                keys: ["category"],
                styles: {
                    line: {
                        weight: 2,
                        color: "#ff0000",
                        alpha: 1
                    },
                    majorTicks: {
                        weight: 1,
                        color: "#0000ff",
                        alpha: 0.5,
                        display: "outside"
                    }
                }
            },
            values: {
                position: "right",
                type: "numeric",
                keys: ["expenses", "revenue"],
                styles: {
                    line: {
                        weight: 2,
                        color: "#ff0000",
                        alpha: 1
                    },
                    majorTicks: {
                        weight: 1,
                        color: "#0000ff",
                        alpha: 0.5,
                        display: "outside"
                    }
                }
            }
        },
        dataProvider: allPositiveDataProvider
    },
    {
        name: "Custom Right and Bottom Axes with outside ticks",

        lineStyles: {
            weight: 2,
            color: "#ff0000",
            alpha: 1
        },
        tickStyles: {
            weight: 1,
            color: "#0000ff",
            alpha: 0.5,
            display: "outside"
        }
    }),

    RightAndBottomAxisCustomTickAndLinesCrossTicks = new Y.AxisGraphicStylesTemplate({
        axes: {
            category: {
                position: "bottom",
                type: "category",
                keys: ["category"],
                styles: {
                    line: {
                        weight: 2,
                        color: "#ff0000",
                        alpha: 1
                    },
                    majorTicks: {
                        weight: 1,
                        color: "#0000ff",
                        alpha: 0.5,
                        display: "cross"
                    }
                }
            },
            values: {
                position: "left",
                type: "numeric",
                keys: ["expenses", "revenue"],
                styles: {
                    line: {
                        weight: 2,
                        color: "#ff0000",
                        alpha: 1
                    },
                    majorTicks: {
                        weight: 1,
                        color: "#0000ff",
                        alpha: 0.5,
                        display: "cross"
                    }
                }
            }
        },
        dataProvider: allPositiveDataProvider
    },
    {
        name: "Custom Right and Bottom Axes with cross ticks",

        lineStyles: {
            weight: 2,
            color: "#ff0000",
            alpha: 1
        },
        tickStyles: {
            weight: 1,
            color: "#0000ff",
            alpha: 0.5,
            display: "inside"
        }
    }),

    LeftAndTopAxisCustomTickAndLinesInsideTicks = new Y.AxisGraphicStylesTemplate({
        axes: {
            category: {
                position: "top",
                type: "category",
                keys: ["category"],
                styles: {
                    line: {
                        weight: 2,
                        color: "#ff0000",
                        alpha: 1
                    },
                    majorTicks: {
                        weight: 1,
                        color: "#0000ff",
                        alpha: 0.5,
                        display: "inside"
                    }
                }
            },
            values: {
                position: "left",
                type: "numeric",
                keys: ["expenses", "revenue"],
                styles: {
                    line: {
                        weight: 2,
                        color: "#ff0000",
                        alpha: 1
                    },
                    majorTicks: {
                        weight: 1,
                        color: "#0000ff",
                        alpha: 0.5,
                        display: "inside"
                    }
                }
            }
        },
        dataProvider: allPositiveDataProvider
    },
    {
        name: "Custom Left and Top Axes with inside ticks",

        lineStyles: {
            weight: 2,
            color: "#ff0000",
            alpha: 1
        },
        tickStyles: {
            weight: 1,
            color: "#0000ff",
            alpha: 0.5,
            display: "inside"
        }
    }),

    LeftAndTopAxisCustomTickAndLinesOutsideTicks = new Y.AxisGraphicStylesTemplate({
        axes: {
            category: {
                position: "top",
                type: "category",
                keys: ["category"],
                styles: {
                    line: {
                        weight: 2,
                        color: "#ff0000",
                        alpha: 1
                    },
                    majorTicks: {
                        weight: 1,
                        color: "#0000ff",
                        alpha: 0.5,
                        display: "outside"
                    }
                }
            },
            values: {
                position: "left",
                type: "numeric",
                keys: ["expenses", "revenue"],
                styles: {
                    line: {
                        weight: 2,
                        color: "#ff0000",
                        alpha: 1
                    },
                    majorTicks: {
                        weight: 1,
                        color: "#0000ff",
                        alpha: 0.5,
                        display: "outside"
                    }
                }
            }
        },
        dataProvider: allPositiveDataProvider
    },
    {
        name: "Custom Left and Top Axes with outside ticks",

        lineStyles: {
            weight: 2,
            color: "#ff0000",
            alpha: 1
        },
        tickStyles: {
            weight: 1,
            color: "#0000ff",
            alpha: 0.5,
            display: "outside"
        }
    }),

    LeftAndTopAxisCustomTickAndLinesCrossTicks = new Y.AxisGraphicStylesTemplate({
        axes: {
            category: {
                position: "top",
                type: "category",
                keys: ["category"],
                styles: {
                    line: {
                        weight: 2,
                        color: "#ff0000",
                        alpha: 1
                    },
                    majorTicks: {
                        weight: 1,
                        color: "#0000ff",
                        alpha: 0.5,
                        display: "cross"
                    }
                }
            },
            values: {
                position: "left",
                type: "numeric",
                keys: ["expenses", "revenue"],
                styles: {
                    line: {
                        weight: 2,
                        color: "#ff0000",
                        alpha: 1
                    },
                    majorTicks: {
                        weight: 1,
                        color: "#0000ff",
                        alpha: 0.5,
                        display: "cross"
                    }
                }
            }
        },
        dataProvider: allPositiveDataProvider
    },
    {
        name: "Custom Left and Top Axes with cross ticks",

        lineStyles: {
            weight: 2,
            color: "#ff0000",
            alpha: 1
        },
        tickStyles: {
            weight: 1,
            color: "#0000ff",
            alpha: 0.5,
            display: "cross"
        }
    }),

    RightAndTopAxisCustomTickAndLinesInsideTicks = new Y.AxisGraphicStylesTemplate({
        axes: {
            category: {
                position: "top",
                type: "category",
                keys: ["category"],
                styles: {
                    line: {
                        weight: 2,
                        color: "#ff0000",
                        alpha: 1
                    },
                    majorTicks: {
                        weight: 1,
                        color: "#0000ff",
                        alpha: 0.5,
                        display: "inside"
                    }
                }
            },
            values: {
                position: "right",
                type: "numeric",
                keys: ["expenses", "revenue"],
                styles: {
                    line: {
                        weight: 2,
                        color: "#ff0000",
                        alpha: 1
                    },
                    majorTicks: {
                        weight: 1,
                        color: "#0000ff",
                        alpha: 0.5,
                        display: "inside"
                    }
                }
            }
        },
        dataProvider: allPositiveDataProvider
    },
    {
        name: "Custom Right and Top Axes with inside ticks",

        lineStyles: {
            weight: 2,
            color: "#ff0000",
            alpha: 1
        },
        tickStyles: {
            weight: 1,
            color: "#0000ff",
            alpha: 0.5,
            display: "inside"
        }
    }),

    RightAndTopAxisCustomTickAndLinesOutsideTicks = new Y.AxisGraphicStylesTemplate({
        axes: {
            category: {
                position: "top",
                type: "category",
                keys: ["category"],
                styles: {
                    line: {
                        weight: 2,
                        color: "#ff0000",
                        alpha: 1
                    },
                    majorTicks: {
                        weight: 1,
                        color: "#0000ff",
                        alpha: 0.5,
                        display: "outside"
                    }
                }
            },
            values: {
                position: "right",
                type: "numeric",
                keys: ["expenses", "revenue"],
                styles: {
                    line: {
                        weight: 2,
                        color: "#ff0000",
                        alpha: 1
                    },
                    majorTicks: {
                        weight: 1,
                        color: "#0000ff",
                        alpha: 0.5,
                        display: "outside"
                    }
                }
            }
        },
        dataProvider: allPositiveDataProvider
    },
    {
        name: "Custom Right and Top Axes with outside ticks",

        lineStyles: {
            weight: 2,
            color: "#ff0000",
            alpha: 1
        },
        tickStyles: {
            weight: 1,
            color: "#0000ff",
            alpha: 0.5,
            display: "outside"
        }
    }),

    RightAndTopAxisCustomTickAndLinesCrossTicks = new Y.AxisGraphicStylesTemplate({
        axes: {
            category: {
                position: "top",
                type: "category",
                keys: ["category"],
                styles: {
                    line: {
                        weight: 2,
                        color: "#ff0000",
                        alpha: 1
                    },
                    majorTicks: {
                        weight: 1,
                        color: "#0000ff",
                        alpha: 0.5,
                        display: "cross"
                    }
                }
            },
            values: {
                position: "right",
                type: "numeric",
                keys: ["expenses", "revenue"],
                styles: {
                    line: {
                        weight: 2,
                        color: "#ff0000",
                        alpha: 1
                    },
                    majorTicks: {
                        weight: 1,
                        color: "#0000ff",
                        alpha: 0.5,
                        display: "cross"
                    }
                }
            }
        },
        dataProvider: allPositiveDataProvider
    },
    {
        name: "Custom Right and Top Axes with cross ticks",

        lineStyles: {
            weight: 2,
            color: "#ff0000",
            alpha: 1
        },
        tickStyles: {
            weight: 1,
            color: "#0000ff",
            alpha: 0.5,
            display: "cross"
        }
    });

    RightAndTopAxisCustomTickAndLinesNoneTicks = new Y.AxisGraphicStylesTemplate({
        axes: {
            category: {
                position: "top",
                type: "category",
                keys: ["category"],
                styles: {
                    line: {
                        weight: 2,
                        color: "#ff0000",
                        alpha: 1
                    },
                    majorTicks: {
                        weight: 1,
                        color: "#0000ff",
                        alpha: 0.5,
                        display: "none"
                    }
                }
            },
            values: {
                position: "right",
                type: "numeric",
                keys: ["expenses", "revenue"],
                styles: {
                    line: {
                        weight: 2,
                        color: "#ff0000",
                        alpha: 1
                    },
                    majorTicks: {
                        weight: 1,
                        color: "#0000ff",
                        alpha: 0.5,
                        display: "none"
                    }
                }
            }
        },
        dataProvider: allPositiveDataProvider
    },
    {
        name: "Custom Right and Top Axes with ticks set to none",

        lineStyles: {
            weight: 2,
            color: "#ff0000",
            alpha: 1
        },
        tickStyles: {
            weight: 1,
            color: "#0000ff",
            alpha: 0.5,
            display: "none"
        }
    });
    
    suite.add(AxesTests);
    suite.add(AxisAlwaysShowZero);
    suite.add(AxisAlwaysShowZeroFalse);
    suite.add(DualAxesMissingDataSmallTest);
    suite.add(DualAxesMissingDataLargeTest);
    suite.add(DualAxesMissingDataSmallAlwaysShowZeroFalseTest);
    suite.add(DualAxesMissingDataLargeAlwaysShowZeroFalseTest);
    suite.add(LeftAndBottomAxisCustomTickAndLinesInsideTicks);
    suite.add(LeftAndBottomAxisCustomTickAndLinesOutsideTicks);
    suite.add(LeftAndBottomAxisCustomTickAndLinesCrossTicks);
    suite.add(RightAndBottomAxisCustomTickAndLinesInsideTicks);
    suite.add(RightAndBottomAxisCustomTickAndLinesOutsideTicks);
    suite.add(RightAndBottomAxisCustomTickAndLinesCrossTicks);
    suite.add(LeftAndTopAxisCustomTickAndLinesInsideTicks);
    suite.add(LeftAndTopAxisCustomTickAndLinesOutsideTicks);
    suite.add(LeftAndTopAxisCustomTickAndLinesCrossTicks);
    suite.add(RightAndTopAxisCustomTickAndLinesInsideTicks);
    suite.add(RightAndTopAxisCustomTickAndLinesOutsideTicks);
    suite.add(RightAndTopAxisCustomTickAndLinesCrossTicks);
    suite.add(RightAndTopAxisCustomTickAndLinesNoneTicks);
    
    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['charts', 'color-base', 'test']});
