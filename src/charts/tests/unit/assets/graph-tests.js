YUI.add('graph-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: Graph"),
        parentDiv = Y.DOM.create('<div style="position:absolute;top:500px;left:0px;width:500px;height:400px" id="testdiv"></div>'),
        DOC = Y.config.doc;
    DOC.body.appendChild(parentDiv);

    GraphTests = new Y.Test.Case({
        name: "Graph Tests",
        
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

        "test:graph._getSeries(line)": function()
        {
            var graph = this.chart.get("graph"),
                series = graph._getSeries("line");
            Y.Assert.areEqual(series, Y.LineSeries, "The series type should be Y.LineSeries");
        },
        
        "test:graph._getSeries(column)": function()
        {
            var graph = this.chart.get("graph"),
                series = graph._getSeries("column");
            Y.Assert.areEqual(series, Y.ColumnSeries, "The series type should be Y.ColumnSeries");
        },
        
        "test:graph._getSeries(bar)": function()
        {
            var graph = this.chart.get("graph"),
                series = graph._getSeries("bar");
            Y.Assert.areEqual(series, Y.BarSeries, "The series type should be Y.BarSeries");
        },
        
        "test:graph._getSeries(area)": function()
        {
            var graph = this.chart.get("graph"),
                series = graph._getSeries("area");
            Y.Assert.areEqual(series, Y.AreaSeries, "The series type should be Y.AreaSeries");
        },
        
        "test:graph._getSeries(stackedarea)": function()
        {
            var graph = this.chart.get("graph"),
                series = graph._getSeries("stackedarea");
            Y.Assert.areEqual(series, Y.StackedAreaSeries, "The series type should be Y.StackedAreaSeries");
        },
        
        "test:graph._getSeries(stackedcolumn)": function()
        {
            var graph = this.chart.get("graph"),
                series = graph._getSeries("stackedcolumn");
            Y.Assert.areEqual(series, Y.StackedColumnSeries, "The series type should be Y.StackedColumnSeries");
        },
        
        "test:graph._getSeries(stackedbar)": function()
        {
            var graph = this.chart.get("graph"),
                series = graph._getSeries("stackedbar");
            Y.Assert.areEqual(series, Y.StackedBarSeries, "The series type should be Y.StackedBarSeries");
        },
        
        "test:graph._getSeries(stackedline)": function()
        {
            var graph = this.chart.get("graph"),
                series = graph._getSeries("stackedline");
            Y.Assert.areEqual(series, Y.StackedLineSeries, "The series type should be Y.StackedLineSeries");
        },
        
        "test:graph._getSeries(markerseries)": function()
        {
            var graph = this.chart.get("graph"),
                series = graph._getSeries("markerseries");
            Y.Assert.areEqual(series, Y.MarkerSeries, "The series type should be Y.MarkerSeries");
        },
        
        "test:graph._getSeries(stackedmarkerseries)": function()
        {
            var graph = this.chart.get("graph"),
                series = graph._getSeries("stackedmarkerseries");
            Y.Assert.areEqual(series, Y.StackedMarkerSeries, "The series type should be Y.StackedMarkerSeries");
        },
        
        "test:graph._getSeries(spline)": function()
        {
            var graph = this.chart.get("graph"),
                series = graph._getSeries("spline");
            Y.Assert.areEqual(series, Y.SplineSeries, "The series type should be Y.SplineSeries");
        },
        
        "test:graph._getSeries(areaspline)": function()
        {
            var graph = this.chart.get("graph"),
                series = graph._getSeries("areaspline");
            Y.Assert.areEqual(series, Y.AreaSplineSeries, "The series type should be Y.AreaSplineSeries");
        },
        
        "test:graph._getSeries(stackedspline)": function()
        {
            var graph = this.chart.get("graph"),
                series = graph._getSeries("stackedspline");
            Y.Assert.areEqual(series, Y.StackedSplineSeries, "The series type should be Y.StackedSplineSeries");
        },
        
        "test:graph._getSeries(stackedareapline)": function()
        {
            var graph = this.chart.get("graph"),
                series = graph._getSeries("stackedareaspline");
            Y.Assert.areEqual(series, Y.StackedAreaSplineSeries, "The series type should be Y.StackedAreaSplineSeries");
        },
        
        "test:graph._getSeries(pie)": function()
        {
            var graph = this.chart.get("graph"),
                series = graph._getSeries("pie");
            Y.Assert.areEqual(series, Y.PieSeries, "The series type should be Y.PieSeries");
        },
        
        "test:graph._getSeries(combo)": function()
        {
            var graph = this.chart.get("graph"),
                series = graph._getSeries("combo");
            Y.Assert.areEqual(series, Y.ComboSeries, "The series type should be Y.ComboSeries");
        },
        
        "test:graph._getSeries(stackedcombo)": function()
        {
            var graph = this.chart.get("graph"),
                series = graph._getSeries("stackedcombo");
            Y.Assert.areEqual(series, Y.StackedComboSeries, "The series type should be Y.StackedComboSeries");
        },
        "test:graph._getSeries(combospline)": function()
        {
            var graph = this.chart.get("graph"),
                series = graph._getSeries("combospline");
            Y.Assert.areEqual(series, Y.ComboSplineSeries, "The series type should be Y.ComboSplineSeries");
        },
        
        "test:graph._getSeries(stackedcombospline)": function()
        {
            var graph = this.chart.get("graph"),
                series = graph._getSeries("stackedcombospline");
            Y.Assert.areEqual(series, Y.StackedComboSplineSeries, "The series type should be Y.StackedComboSplineSeries");
        },

        "test:graph._getSeries(customclass)" : function()
        {
            var graph = this.chart.get("graph"),
                series;

            Y.CustomLineSeries = Y.Base.create("customLineSeries", Y.LineSeries, [], {
                mycustomprop: null,

                mycustommethod: function()
                {
                    var yaypie = "mmmm";
                    yaypie += "Pie";
                }
            });

            series = graph._getSeries(Y.CustomLineSeries);
            Y.Assert.areEqual(series, Y.CustomLineSeries, "The series type should be Y.CustomLineSeries");
        },

        "test:graph._drawSeries()" : function() 
        {
            var chart = this.chart,
                graph = chart.get("graph"),
                graphic = graph.get("graphic"),
                width = chart.get("width") + 100,
                height = chart.get("height") + 100,
                graphWidth,
                graphHeight;
            chart.set("width", width);
            chart.set("height", height);
            graphWidth = graph.get("width");
            graphHeight = graph.get("height");
            Y.Assert.areEqual(graphWidth, graphic.get("width"), "The width of the graphic should be equal to the width of the graph.");
            Y.Assert.areEqual(graphHeight, graphic.get("height"), "The height of the graphic should be equal to the height of the graph.");
            width = width + 50;
            height = height - 50;
            graph.set("width", width);
            graph.set("height", height);
            Y.Assert.areEqual(width, graphic.get("width"), "The width of the graphic should be equal to the width of the graph.");
            Y.Assert.areEqual(height, graphic.get("height"), "The height of the graphic should be equal to the height of the graph.");
        }
    });

    suite.add(GraphTests);

    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['charts', 'test']});
