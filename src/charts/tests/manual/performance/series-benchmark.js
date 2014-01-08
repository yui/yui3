YUI.add('series-benchmark', function (Y) {
    Y.BenchmarkSuite = new Benchmark.Suite();
    var suite = Y.BenchmarkSuite,
        container,
        graphic,
        miscellaneous,
        mockChart,
        mockGraph,
        xAxis,
        yAxis,
        dataProvider,
        seriesObject,
        seriesKeys = ["miscellaneous", "expenses", "revenue"];
    container = document.createElement('div');
    dataProvider = [
        {category:"5/1/2010", miscellaneous:2000, expenses:3700, revenue:2200}, 
        {category:"5/2/2010", miscellaneous:50, expenses:9100, revenue:100}, 
        {category:"5/3/2010", miscellaneous:400, expenses:1100, revenue:1500}, 
        {category:"5/4/2010", miscellaneous:200, expenses:1900, revenue:2800}, 
        {category:"5/5/2010", miscellaneous:5000, expenses:5000, revenue:2650}
    ];
    container.style.left = "10px";
    container.style.top = "10px";
    container.style.width = "600px";
    container.style.height = "300px";
    container.id = "container";
    document.body.appendChild(container);
  
    
    suite.add("ComboSeries", function() {
        miscellaneous = new Y.ComboSeries({
            graphOrder: 0,
            xAxis: xAxis,
            yAxis: yAxis,
            graph: mockGraph,
            xKey: "category",
            yKey: "miscellaneous"
        });
        miscellaneous.render();
        graphic._redraw();
        miscellaneous.destroy(true);
    }, {
        onStart: function() {
            xAxis = new Y.CategoryAxis({
                dataProvider: dataProvider,
                keys: ["category"],
                position: "none"
            });
            yAxis = new Y.NumericAxis({
                dataProvider: dataProvider,
                keys: ["miscellaneous", "expenses", "revenue"],
                position: "none"
            });
            mockGraph = {};
            graphic = new Y.Graphic({
                render: container
            });
            mockChart = {};
            mockChart.get = function(attr) {
                var val = "yuichart";
                return val;
            };
            mockGraph.get = function(attr) {
                  var val;
                  switch(attr) {
                    case "width" :
                        val = 600;
                    break;
                    case "height" :
                        val = 300;
                    break;
                    case "graphic" :
                        val = graphic;
                    break;
                    case "chart" :
                        val = mockChart;
                    break;
                  }
                  return val;
            };
        }
    });
    
    suite.add("MultipleComboSeries", function() {
        var i,
            key,
            series,
            len = seriesKeys.length;
         seriesObject = {};
        for(i = 0; i < len; i = i + 1)
        {
            key = seriesKeys[i];
            series = new Y.ComboSeries({
                graphOrder: i,
                xAxis: xAxis,
                yAxis: yAxis,
                graph: mockGraph,
                xKey: "category",
                yKey: key
            });
            series.render();
            seriesObject[key] = series; 
        }
        graphic._redraw();
        for(key in seriesObject)
        {
           if(seriesObject.hasOwnProperty(key))
           {
                seriesObject[key].destroy(true);
           }
        }
    }, {
        onStart: function() {
            xAxis = new Y.CategoryAxis({
                dataProvider: dataProvider,
                keys: ["category"],
                position: "none"
            });
            yAxis = new Y.NumericAxis({
                dataProvider: dataProvider,
                keys: ["miscellaneous", "expenses", "revenue"],
                position: "none"
            });
            mockGraph = {};
            graphic = new Y.Graphic({
                render: container
            });
            mockChart = {};
            mockChart.get = function(attr) {
                var val = "yuichart";
                return val;
            };
            mockGraph.get = function(attr) {
                  var val;
                  switch(attr) {
                    case "width" :
                        val = 600;
                    break;
                    case "height" :
                        val = 300;
                    break;
                    case "graphic" :
                        val = graphic;
                    break;
                    case "chart" :
                        val = mockChart;
                    break;
                  }
                  return val;
            };
        }
    });
}, '@VERSION@', {requires: ['charts']});
