YUI.add('charts-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts"),
    
    ChartTests = new Y.Test.Case({
        name: "Chart Tests",
        
        setUp: function () {
            Y.one("body").append('<div id="testbed"></div>');
            Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="graphiccontainer"></div>');
            var myDataValues = [ 
                {category:"5/1/2010", values:2000, expenses:3700, revenue:2200}, 
                {category:"5/2/2010", values:50, expenses:9100, revenue:100}, 
                {category:"5/3/2010", values:400, expenses:1100, revenue:1500}, 
                {category:"5/4/2010", values:200, expenses:1900, revenue:2800}, 
                {category:"5/5/2010", values:5000, expenses:5000, revenue:2650}
            ];
            var mychart = new Y.Chart({width:400, height:300, dataProvider:myDataValues});
            mychart.render("#mychart");
            this.chart = mychart;
        },

        tearDown: function () {
            this.chart.destroy(true);
            Y.one("#testbed").destroy(true);
        },

        //Test to ensure that all items in the series collection are of the correct type.
        testGetSeriesByIndex: function()
        {
            var series = this.chart.getSeries(0),
                assert = Y.Assert;
                assert.isInstanceOf(Y.CartesianSeries, series);
        },
        
        //Test to ensure that all items in the series collection are of the correct type.
        testGetSeriesByKey: function()
        {
            var series = this.chart.getSeries("revenue"),
                assert = Y.Assert;
                assert.isInstanceOf(Y.CartesianSeries, series);
        },
        
        //Test to ensure the series axes are numeric and the category axis is of type category
        testGetAxesByKey: function()
        {
            var category = this.chart.getAxisByKey("category"),
                values = this.chart.getAxisByKey("values"),
                assert = Y.Assert;
            assert.isInstanceOf(Y.CategoryAxis, category);
            assert.isInstanceOf(Y.NumericAxis, values);
        },

        //Test to ensure that getCategoryAxis returns a category axis
        testGetCategoryAxis: function()
        {
            var category = this.chart.get("categoryAxis"),
                assert = Y.Assert;
            assert.isInstanceOf(Y.CategoryAxis, category);
        },
        
        //Test that the graph attribute is of type Graph
        testGetGraph: function()
        {
            Y.Assert.isInstanceOf(Y.Graph, this.chart.get("graph"));
        },
        
        //Test to ensure that the axes hash contains AxisRenderer instances
        testGetAxes: function()
        {
            var assert = Y.Assert,
                axes = this.chart.get("axes"),
                i;
            for(i in axes)
            {
                if(axes.hasOwnProperty(i))
                {
                    assert.isInstanceOf(Y.Axis, axes[i]);
                }
            }
        },

        //Test to ensure that default series keys are correct
        testGetSeriesKeys: function()
        {
            var assert = Y.Assert,
                YArray = Y.Array,
                selectedIndex,
                testKeys = ['values', 'expenses', 'revenue'],
                newArray = [],
                actualKeys = this.chart.get("seriesKeys"),
                i = 0,
                len = testKeys.length;
            assert.areEqual(actualKeys.length, testKeys.length, "Actual seriesKeys array is not the correct length.");
            for(; i < len; ++i)
            {
                selectedIndex = YArray.indexOf(actualKeys, testKeys[i]);
                assert.isNotNull(selectedIndex + 1, "The seriesKeys array should contain the following key: " + testKeys[i] + ".");
                if(selectedIndex > -1)
                {
                    newArray.push(actualKeys[selectedIndex]);
                }
                else
                {
                    throw new Error("The actual seriesKeys array should but does not contain " + testKeys[i] + ".");
                }
            }
            assert.areEqual(newArray.length, actualKeys.length, "The seriesKeys array has more keys than it should.");
        },

        //Test to ensure default attributes are correct
        testGetDefaultAttributes: function()
        {
            var assert = Y.Assert,
                attrs = {
                    direction: "horizontal",
                    type: "combo",
                    valueAxisName: "values",
                    categoryAxisName: "category",
                    categoryKey: "category",
                    categoryType: "category",
                    interactionType: "marker"
                },
                chart = this.chart,
                i;
            for(i in attrs)
            {
                if(attrs.hasOwnProperty(i))
                {
                    assert.areEqual(chart.get(i), attrs[i], "The attribute " + i + " should equal " + attrs[i] + ".");
                }
            }
        }
    });

    suite.add(ChartTests);
    Y.Test.Runner.add( suite );
}, '@VERSION@' ,{requires:['charts', 'test']});
