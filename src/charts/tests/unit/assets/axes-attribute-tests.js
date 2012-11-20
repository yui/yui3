YUI.add('axes-attribute-tests', function(Y) {
    function AxisTestTemplate(cfg, globalCfg)
    {
        var i;
        AxisTestTemplate.superclass.constructor.apply(this);
        this.attrCfg = cfg;
        this.attrCfg.render = "#mychart";
        for(i in globalCfg)
        {
            if(globalCfg.hasOwnProperty(i))
            {
                this[i] = globalCfg[i];
            }
        }
    }
    Y.extend(AxisTestTemplate, Y.Test.Case, {
        setUp: function()
        {
            this.renderTestBed();;
        },

        renderTestBed: function()
        {
            Y.one("body").append('<div id="testbed"></div>');
            Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="mychart"></div>');
            var mychart = new Y.Chart(this.attrCfg); 
            this.chart = mychart;
        },
        
        tearDown: function() {
            this.chart.destroy(true);
            Y.one("#testbed").destroy(true);
        }
    });

    var suite = new Y.Test.Suite("Charts: AxesAttrs"),

    preferredMethod = function(val, format)
    {
        var myspan = document.createElement("span");
        myspan.appendChild(document.createTextNode(val));
        return myspan;
    },
    
    innerHTMLMethod = function(val, format)
    {
        return '<span>' + val + '</span>';
    },
   
    appendTextMethod = function(textField, val)
    {
        textField.innerHTML = val;
    },

    getRightAxis = function(explicitWidth)
    {
        var financials = {
            keys:["miscellaneous", "revenue", "expenses"],
            position:"right",
            type:"numeric",
            styles:{
                majorTicks:{
                    display: "none"
                }
            }
        };
        if(explicitWidth)
        {
            financials.width = explicitWidth;
        }
        return financials;
    },

    getBottomAxis = function(explicitHeight)
    {
        var dateRange = {
            keys:["date"],
            position:"bottom",
            type:"category",
            styles:{
                majorTicks:{
                    display: "none"
                },
                label: {
                    rotation:-45,
                    margin:{top:5}
                }
            }
        };
        if(explicitHeight)
        {
            dateRange.height = explicitHeight;
        }
        return dateRange;
    },

    getLeftAxis = function(explicitWidth)
    {
        var financials = {
           keys:["miscellaneous", "revenue", "expenses"],
           position:"left",
           type:"numeric",
           styles:{
               majorTicks:{
                   display: "none"
               },
               label: {
                    margin: {
                        left: 0,
                        right: 4
                    }
               }
           }
        };
        if(explicitWidth)
        {
            financials.width = explicitWidth;
        }
        return financials;
    },

    getTopAxis = function(explicitHeight)
    {
        var dateRange = {
           keys:["date"],
           position:"top",
           type:"category",
           styles:{
               majorTicks:{
                   display: "none"
               },
               label: {
                   rotation:-90,
                   margin:{top:5}
               }
           }
        };
        if(explicitHeight)
        {
            dateRange.height = explicitHeight;
        }
        return dateRange;
    },

    myDataValues = [ 
            {date:"5/1/2010", miscellaneous:2000, expenses:3700, revenue:2200}, 
            {date:"5/2/2010", miscellaneous:50, expenses:9100, revenue:100}, 
            {date:"5/3/2010", miscellaneous:400, expenses:1100, revenue:1500}, 
            {date:"5/4/2010", miscellaneous:200, expenses:1900, revenue:2800}, 
            {date:"5/5/2010", miscellaneous:5000, expenses:5000, revenue:2650}
    ],
    
    testBottomCatAxes = function()
    {
        var assert = Y.Assert,
            chart = this.chart,
            axis = chart.get("categoryAxis"),
            i,
            defaults = getBottomAxis(),
            position = defaults.position,
            type = defaults.type,
            styles = defaults.styles,
            majorTickDisplay = styles.majorTicks.display,
            label = styles.label,
            labelRotation = label.rotation,
            labelMarginTop = label.margin.top,
            axisStyles = axis.get("styles"),
            axisPosition = axis.get("position");
        assert.areEqual(position, axis.get("position"), "The value of position should be " + position);
        assert.areEqual(type, axis.get("type"), "The value of type should be " + type);
        assert.areEqual(majorTickDisplay, axisStyles.majorTicks.display, "The axis style majorTickDisplay.top should be " + majorTickDisplay);
        assert.areEqual(labelRotation, axisStyles.label.rotation, "The axis label style rotation should be " + labelRotation);
        assert.areEqual(labelMarginTop, axisStyles.label.margin.top, "The axis label style margin.top should be " + labelMarginTop);
    },

    testRightValueAxes = function()
    {
        var assert = Y.Assert,
            chart = this.chart,
            axis = chart.getAxisByKey("financials"),
            i,
            defaults = getRightAxis(),
            position = defaults.position,
            type = defaults.type,
            styles = defaults.styles,
            majorTickDisplay = styles.majorTicks.display,
            axisStyles = axis.get("styles");
        assert.areEqual(position, axis.get("position"), "The value of position should be " + position);
        assert.areEqual(type, axis.get("type"), "The value of type should be " + type);
        assert.areEqual(majorTickDisplay, axisStyles.majorTicks.display, "The axis style majorTickDisplay.top should be " + majorTickDisplay);
    },
    
    testTopCatAxes = function()
    {
        this.chart.set("axes", {
            financials: getLeftAxis(),
            dateRange: getTopAxis()
        });
        var assert = Y.Assert,
            chart = this.chart,
            axis = chart.get("categoryAxis"),
            i,
            defaults = getTopAxis(),
            position = defaults.position,
            type = defaults.type,
            styles = defaults.styles,
            majorTickDisplay = styles.majorTicks.display,
            label = styles.label,
            labelRotation = label.rotation,
            labelMarginTop = label.margin.top,
            axisStyles = axis.get("styles");
        assert.areEqual(position, axis.get("position"), "The value of position should be " + position);
        assert.areEqual(type, axis.get("type"), "The value of type should be " + type);
        assert.areEqual(majorTickDisplay, axisStyles.majorTicks.display, "The axis style majorTickDisplay.top should be " + majorTickDisplay);
        assert.areEqual(labelRotation, axisStyles.label.rotation, "The axis label style rotation should be " + labelRotation);
        assert.areEqual(labelMarginTop, axisStyles.label.margin.top, "The axis label style margin.top should be " + labelMarginTop);
    },

    testLeftValueAxes = function()
    {
        this.chart.set("axes", {
            financials: getLeftAxis(),
            dateRange: getTopAxis()
        });
        var assert = Y.Assert,
            chart = this.chart,
            axis = chart.getAxisByKey("financials"),
            i,
            defaults = getLeftAxis(),
            position = defaults.position,
            type = defaults.type,
            styles = defaults.styles,
            majorTickDisplay = styles.majorTicks.display,
            labelMargin = styles.label.margin,
            labelMarginLeft = labelMargin.left,
            labelMarginRight = labelMargin.right,
            axisStyles = axis.get("styles");
        assert.areEqual(position, axis.get("position"), "The value of position should be " + position);
        assert.areEqual(type, axis.get("type"), "The value of type should be " + type);
        assert.areEqual(majorTickDisplay, axisStyles.majorTicks.display, "The axis style majorTick.display should be " + majorTickDisplay);
        assert.areEqual(labelMarginLeft, axisStyles.label.margin.left, "The axis label style margin.left should be " + labelMarginLeft);
        assert.areEqual(labelMarginRight, axisStyles.label.margin.right, "The axis label style margin.right should be " + labelMarginRight);
    },

    testExplicitWidth = function()
    {
        var chart = this.chart,
            setWidth = this.setWidth,
            axis = chart.getAxisByKey("financials"),
            actualWidth = axis.get("width");
        Y.Assert.areEqual(setWidth, actualWidth, "The actual width of the axis should be " + setWidth + ".");
    },

    testExplicitHeight = function()
    {
        var chart = this.chart,
            setHeight = this.setHeight,
            axis = chart.getAxisByKey("dateRange"),
            actualHeight = axis.get("height");
        Y.Assert.areEqual(setHeight, actualHeight, "The axis height should be " + setHeight + ".");
    },
    
    AxesAttributeTests = new AxisTestTemplate({
        axes: {
            financials: getRightAxis(),
            dateRange: getBottomAxis()
        },
        dataProvider: myDataValues
    }, {
        name: "Axes Attribute Tests",
       
        testBottomCatAxes: testBottomCatAxes,
        
        testRightValueAxes: testRightValueAxes,
        
        testTopCatAxes: testTopCatAxes,
        
        testLeftValueAxes: testLeftValueAxes
    }),
    
    AxesSetExplicitWidthRight = new AxisTestTemplate({
        axes: {
            financials: getRightAxis(),
            dateRange: getBottomAxis()
        },
        dataProvider: myDataValues
    },
    {
        name: "Axes Test Right Explicit Width",

        setWidth: 100,

        setUp: function()
        {
            this.renderTestBed();
            var axis = this.chart.getAxisByKey("financials");
            axis.set("width", this.setWidth);
        },

        testDefault: testExplicitWidth
    }),
    
    AxesSetExplicitHeightBottom = new AxisTestTemplate({
        axes: {
            financials: getRightAxis(),
            dateRange: getBottomAxis()
        },
        dataProvider: myDataValues
    },
    {
        name: "Axes Test Bottom Explicit Height",

        setHeight: 100,

        setUp: function()
        {
            this.renderTestBed();
            var axis = this.chart.getAxisByKey("dateRange");
            axis.set("height", this.setHeight);
        },

        testDefault: testExplicitHeight
    }),
    
    AxesSetExplicitWidthLeft = new AxisTestTemplate({
        axes: {
            financials: getLeftAxis(),
            dateRange: getTopAxis()
        },
        dataProvider: myDataValues
    },
    {
        name: "Axes Test Left Explicit Width",

        setWidth: 100,

        setUp: function()
        {
            this.renderTestBed();
            var axis = this.chart.getAxisByKey("financials");
            axis.set("width", this.setWidth);
        },

        testDefault: testExplicitWidth
    }),
    
    AxesSetExplicitHeightTop = new AxisTestTemplate({
        axes: {
            financials: getLeftAxis(),
            dateRange: getTopAxis()
        },
        dataProvider: myDataValues
    },
    {
        name: "Axes Test Top Explicit Height",

        setHeight: 100,

        setUp: function()
        {
            this.renderTestBed();
            var axis = this.chart.getAxisByKey("dateRange");
            axis.set("height", this.setHeight);
        },

        testDefault: testExplicitHeight
    }),
    
    AxesSetExplicitWidthUpFrontRight = new AxisTestTemplate({
        axes: {
            financials: getRightAxis(100),
            dateRange: getBottomAxis()
        },
        dataProvider: myDataValues
    },
    {
        name: "Axes Test Right Explicit Width Up Front",

        setWidth: 100,

        testDefault: testExplicitWidth
    }),
    
    AxesSetExplicitHeightUpFrontBottom = new AxisTestTemplate({
        axes: {
            financials: getRightAxis(),
            dateRange: getBottomAxis(100)
        },
        dataProvider: myDataValues
    },
    {
        name: "Axes Test Bottom Explicit Height Up Front",

        setHeight: 100,

        testDefault: testExplicitHeight
    }),
    
    AxesSetExplicitWidthUpFrontLeft = new AxisTestTemplate({
        axes: {
            financials: getLeftAxis(100),
            dateRange: getTopAxis()
        },
        dataProvider: myDataValues
    },
    {
        name: "Axes Test Left Explicit Width Up Front",

        setWidth: 100,

        testDefault: testExplicitWidth
    }),
    
    AxesSetExplicitHeightUpFrontTop = new AxisTestTemplate({
        axes: {
            financials: getLeftAxis(),
            dateRange: getTopAxis(100)
        },
        dataProvider: myDataValues
    },
    {
        name: "Axes Test Top Explicit Height Up Front",

        setHeight: 100,

        testDefault: testExplicitHeight
    }),
    
    AxisWithLabelAndTitleFunction = new AxisTestTemplate({
        categoryKey: "date",
        render: "#mychart",
        axes: {
            category: {
                type: "category",
                keys: ["date"],
                labelFunction: preferredMethod,
                titleFunction: preferredMethod,
                title: "Category Axis"
            },
            values: {
                keys: ["miscellaneous", "revenue", "expenses"],
                labelFunction: preferredMethod,
                titleFunction: preferredMethod,
                title: "Value Axis"
            }
        },
        dataProvider: myDataValues 
    }, {
        name: "Axis labelFunction and titleFunction tests.",

        getParentDiv: function(val)
        {
            var myparentdiv = document.createElement("div"),
                myspan = document.createElement("span");
            myspan.appendChild(document.createTextNode(val));
            myparentdiv.appendChild(myspan);
            return myparentdiv;
        },

        testCategoryLabels: function()
        {
            this.checkLabels("category", "labels");
        },

        testNumericLabels: function()
        {
            this.checkLabels("values", "labels");
        },

        checkLabels: function(axisKey, labelType)
        {
            var chart = this.chart,
                axis = chart.getAxisByKey(axisKey),
                labels = axis.get(labelType),
                i = 0,
                len = labels.length,
                parentDiv,
                innerHTML,
                rawLabel;
            for(; i < len; i = i + 1)
            {
                rawLabel = axis.getLabelByIndex(i, len);
                parentDiv = this.getParentDiv(rawLabel);
                innerHTML = parentDiv.innerHTML;
                Y.Assert.areEqual(innerHTML, (axis.get("labels")[i]).innerHTML, "The axis label should equal " + innerHTML + ".");
            }

        }
    }),
    
    TimeAxisWithLabelAndTitleFunction = new AxisTestTemplate({
        categoryKey: "date",
        categoryType: "time",
        render: "#mychart",
        axes: {
            category: {
                type: "time",
                keys: ["date"],
                labelFunction: preferredMethod,
                titleFunction: preferredMethod,
                title: "Category Axis"
            },
            values: {
                keys: ["miscellaneous", "revenue", "expenses"],
                labelFunction: preferredMethod,
                titleFunction: preferredMethod,
                title: "Value Axis"
            }
        },
        dataProvider: myDataValues 
    }, {
        name: "Axis labelFunction and titleFunction tests.",

        getParentDiv: function(val)
        {
            var myparentdiv = document.createElement("div"),
                myspan = document.createElement("span");
            myspan.appendChild(document.createTextNode(val));
            myparentdiv.appendChild(myspan);
            return myparentdiv;
        },

        testCategoryLabels: function()
        {
            this.checkLabels("category", "labels");
        },

        testNumericLabels: function()
        {
            this.checkLabels("values", "labels");
        },

        checkLabels: function(axisKey, labelType)
        {
            var chart = this.chart,
                axis = chart.getAxisByKey(axisKey),
                labels = axis.get(labelType),
                i = 0,
                len = labels.length,
                parentDiv,
                innerHTML,
                rawLabel;
            for(; i < len; i = i + 1)
            {
                rawLabel = axis.getLabelByIndex(i, len);
                parentDiv = this.getParentDiv(rawLabel);
                innerHTML = parentDiv.innerHTML;
                Y.Assert.areEqual(innerHTML, (axis.get("labels")[i]).innerHTML, "The axis label should equal " + innerHTML + ".");
            }

        }
    }),
    
    AxisWithLabelAndTitleInnerHTMLFunctionFail = new AxisTestTemplate({
        categoryKey: "date",
        render: "#mychart",
        axes: {
            category: {
                type: "category",
                keys: ["date"],
                labelFunction: innerHTMLMethod,
                titleFunction: innerHTMLMethod,
                title: "Category Axis"
            },
            values: {
                keys: ["miscellaneous", "revenue", "expenses"],
                labelFunction: innerHTMLMethod,
                titleFunction: innerHTMLMethod,
                title: "Value Axis"
            }
        },
        dataProvider: myDataValues 
    }, {
        name: "Axis labelFunction and titleFunction tests.",

        getParentDiv: function(val)
        {
            var myparentdiv = document.createElement("div"),
                myspan = document.createElement("span");
            myspan.appendChild(document.createTextNode(val));
            myparentdiv.appendChild(myspan);
            return myparentdiv;
        },

        testCategoryLabels: function()
        {
            this.checkLabels("category", "labels");
        },

        testNumericLabels: function()
        {
            this.checkLabels("values", "labels");
        },

        checkLabels: function(axisKey, labelType)
        {
            var chart = this.chart,
                axis = chart.getAxisByKey(axisKey),
                labels = axis.get(labelType),
                i = 0,
                len = labels.length,
                parentDiv,
                innerHTML,
                rawLabel;
            for(; i < len; i = i + 1)
            {
                rawLabel = axis.getLabelByIndex(i, len);
                parentDiv = this.getParentDiv(rawLabel);
                innerHTML = parentDiv.innerHTML;
                Y.Assert.areNotEqual(innerHTML, (axis.get("labels")[i]).innerHTML, "The axis label should equal " + innerHTML + ".");
            }

        }
    }),
    
    TimeAxisWithLabelAndTitleInnerHTMLFunctionFail = new AxisTestTemplate({
        categoryKey: "date",
        categoryType: "time",
        render: "#mychart",
        axes: {
            category: {
                type: "time",
                keys: ["date"],
                labelFunction: innerHTMLMethod,
                titleFunction: innerHTMLMethod,
                title: "Category Axis"
            },
            values: {
                keys: ["miscellaneous", "revenue", "expenses"],
                labelFunction: innerHTMLMethod,
                titleFunction: innerHTMLMethod,
                title: "Value Axis"
            }
        },
        dataProvider: myDataValues 
    }, {
        name: "Axis labelFunction and titleFunction tests.",

        getParentDiv: function(val)
        {
            var myparentdiv = document.createElement("div"),
                myspan = document.createElement("span");
            myspan.appendChild(document.createTextNode(val));
            myparentdiv.appendChild(myspan);
            return myparentdiv;
        },

        testCategoryLabels: function()
        {
            this.checkLabels("category", "labels");
        },

        testNumericLabels: function()
        {
            this.checkLabels("values", "labels");
        },

        checkLabels: function(axisKey, labelType)
        {
            var chart = this.chart,
                axis = chart.getAxisByKey(axisKey),
                labels = axis.get(labelType),
                i = 0,
                len = labels.length,
                parentDiv,
                innerHTML,
                rawLabel;
            for(; i < len; i = i + 1)
            {
                rawLabel = axis.getLabelByIndex(i, len);
                parentDiv = this.getParentDiv(rawLabel);
                innerHTML = parentDiv.innerHTML;
                Y.Assert.areNotEqual(innerHTML, (axis.get("labels")[i]).innerHTML, "The axis label should equal " + innerHTML + ".");
            }

        }
    }),
    
    AxisWithLabelAndTitleInnerHTMLFunctionWithAppendMethods = new AxisTestTemplate({
        categoryKey: "date",
        render: "#mychart",
        axes: {
            category: {
                type: "category",
                keys: ["date"],
                labelFunction: innerHTMLMethod,
                titleFunction: innerHTMLMethod,
                title: "Category Axis",
                appendLabelFunction: appendTextMethod,
                appendTitleFunction: appendTextMethod
            },
            values: {
                keys: ["miscellaneous", "revenue", "expenses"],
                labelFunction: innerHTMLMethod,
                titleFunction: innerHTMLMethod,
                title: "Value Axis",
                appendLabelFunction: appendTextMethod,
                appendTitleFunction: appendTextMethod
            }
        },
        dataProvider: myDataValues 
    }, {
        name: "Axis labelFunction and titleFunction tests.",

        getParentDiv: function(val)
        {
            var myparentdiv = document.createElement("div"),
                myspan = document.createElement("span");
            myspan.appendChild(document.createTextNode(val));
            myparentdiv.appendChild(myspan);
            return myparentdiv;
        },

        testCategoryLabels: function()
        {
            this.checkLabels("category", "labels");
        },

        testNumericLabels: function()
        {
            this.checkLabels("values", "labels");
        },

        checkLabels: function(axisKey, labelType)
        {
            var chart = this.chart,
                axis = chart.getAxisByKey(axisKey),
                labels = axis.get(labelType),
                i = 0,
                len = labels.length,
                parentDiv,
                innerHTML,
                rawLabel;
            for(; i < len; i = i + 1)
            {
                rawLabel = axis.getLabelByIndex(i, len);
                parentDiv = this.getParentDiv(rawLabel);
                innerHTML = parentDiv.innerHTML;
                Y.Assert.areEqual(innerHTML, (axis.get("labels")[i]).innerHTML, "The axis label should equal " + innerHTML + ".");
            }

        }
    }),
    
    TimeAxisWithLabelAndTitleInnerHTMLFunctionWithAppendMethods = new AxisTestTemplate({
        categoryKey: "date",
        categoryType: "time",
        render: "#mychart",
        axes: {
            category: {
                type: "time",
                keys: ["date"],
                labelFunction: innerHTMLMethod,
                titleFunction: innerHTMLMethod,
                title: "Category Axis",
                appendLabelFunction: appendTextMethod,
                appendTitleFunction: appendTextMethod
            },
            values: {
                keys: ["miscellaneous", "revenue", "expenses"],
                labelFunction: innerHTMLMethod,
                titleFunction: innerHTMLMethod,
                title: "Value Axis",
                appendLabelFunction: appendTextMethod,
                appendTitleFunction: appendTextMethod
            }
        },
        dataProvider: myDataValues 
    }, {
        name: "Axis labelFunction and titleFunction tests.",

        getParentDiv: function(val)
        {
            var myparentdiv = document.createElement("div"),
                myspan = document.createElement("span");
            myspan.appendChild(document.createTextNode(val));
            myparentdiv.appendChild(myspan);
            return myparentdiv;
        },

        testCategoryLabels: function()
        {
            this.checkLabels("category", "labels");
        },

        testNumericLabels: function()
        {
            this.checkLabels("values", "labels");
        },

        checkLabels: function(axisKey, labelType)
        {
            var chart = this.chart,
                axis = chart.getAxisByKey(axisKey),
                labels = axis.get(labelType),
                i = 0,
                len = labels.length,
                parentDiv,
                innerHTML,
                rawLabel;
            for(; i < len; i = i + 1)
            {
                rawLabel = axis.getLabelByIndex(i, len);
                parentDiv = this.getParentDiv(rawLabel);
                innerHTML = parentDiv.innerHTML;
                Y.Assert.areEqual(innerHTML, (axis.get("labels")[i]).innerHTML, "The axis label should equal " + innerHTML + ".");
            }

        }
    });
    
    suite.add(AxesAttributeTests);
    suite.add(AxesSetExplicitWidthRight);
    suite.add(AxesSetExplicitHeightBottom);
    suite.add(AxesSetExplicitWidthLeft);
    suite.add(AxesSetExplicitHeightTop);
    suite.add(AxesSetExplicitWidthUpFrontRight);
    suite.add(AxesSetExplicitHeightUpFrontBottom);
    suite.add(AxesSetExplicitWidthUpFrontLeft);
    suite.add(AxesSetExplicitHeightUpFrontTop);
    suite.add(AxisWithLabelAndTitleFunction);
    suite.add(TimeAxisWithLabelAndTitleFunction);
    suite.add(AxisWithLabelAndTitleInnerHTMLFunctionFail);
    suite.add(TimeAxisWithLabelAndTitleInnerHTMLFunctionFail);
    suite.add(AxisWithLabelAndTitleInnerHTMLFunctionWithAppendMethods);
    suite.add(TimeAxisWithLabelAndTitleInnerHTMLFunctionWithAppendMethods);
    
    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['charts', 'test']});
