YUI.add('axes-attribute-tests', function(Y) {
    var suite = new Y.Test.Suite("Y.Charts.AxesAttrs"),

    AxesAttributeTests = new Y.Test.Case({

        name: "Axes Attribute Tests",

        myDataValues: [ 
                {date:"5/1/2010", miscellaneous:2000, expenses:3700, revenue:2200}, 
                {date:"5/2/2010", miscellaneous:50, expenses:9100, revenue:100}, 
                {date:"5/3/2010", miscellaneous:400, expenses:1100, revenue:1500}, 
                {date:"5/4/2010", miscellaneous:200, expenses:1900, revenue:2800}, 
                {date:"5/5/2010", miscellaneous:5000, expenses:5000, revenue:2650}
        ],

        startAxes: {
            financials:{
                keys:["miscellaneous", "revenue", "expenses"],
                position:"right",
                type:"numeric",
                styles:{
                    majorTicks:{
                        display: "none"
                    }
                }
            },
            dateRange:{
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
            }
        },

        updateAxes: {
            financials:{
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
            },
            dateRange:{
               keys:["date"],
               position:"bottom",
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
            }
        },

        setUp: function()
        {
            Y.one("body").append('<div id="testbed"></div>');
            Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="mychart"></div>');
            var mychart = new Y.Chart({width:400, height:300, 
                categoryKey: "date",
                dataProvider:this.myDataValues, 
                axes: this.startAxes,
                render:"#mychart"
            });
            this.chart = mychart;
        },
        
        tearDown: function() {
            this.chart.destroy(true);
            Y.one("#testbed").remove(true);
        },
        
        testStartCatAxes: function()
        {
            var assert = Y.Assert,
                chart = this.chart,
                axis = chart.get("categoryAxis"),
                i,
                defaults = this.startAxes.dateRange,
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

        testStartValueAxes: function()
        {
            var assert = Y.Assert,
                chart = this.chart,
                axis = chart.getAxisByKey("financials"),
                i,
                defaults = this.startAxes.financials,
                position = defaults.position,
                type = defaults.type,
                styles = defaults.styles,
                majorTickDisplay = styles.majorTicks.display,
                axisStyles = axis.get("styles");
            assert.areEqual(position, axis.get("position"), "The value of position should be " + position);
            assert.areEqual(type, axis.get("type"), "The value of type should be " + type);
            assert.areEqual(majorTickDisplay, axisStyles.majorTicks.display, "The axis style majorTickDisplay.top should be " + majorTickDisplay);
        },
        
        testUpdateCatAxes: function()
        {
            this.chart.set("axes", this.updateAxes);
            var assert = Y.Assert,
                chart = this.chart,
                axis = chart.get("categoryAxis"),
                i,
                defaults = this.updateAxes.dateRange,
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

        testUpdateValueAxes: function()
        {
            this.chart.set("axes", this.updateAxes);
            var assert = Y.Assert,
                chart = this.chart,
                axis = chart.getAxisByKey("financials"),
                i,
                defaults = this.updateAxes.financials,
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
        }
    });

    suite.add(AxesAttributeTests);

    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['charts', 'test']});
