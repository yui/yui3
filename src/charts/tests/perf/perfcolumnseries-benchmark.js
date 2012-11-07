YUI.add('perfcolumnseries-benchmark', function (Y) {
    Y.BenchmarkSuite = new Benchmark.Suite();
    var suite = Y.BenchmarkSuite,
        container,
        graphic,
        mockChart,
        mockGraph,
        xAxis,
        yAxis,
        dataProvider = Y.GeneratePerfTestDataProvider.getData(),
        seriesObject,
        seriesKeys = ["expenses", "revenue"];
    container = document.createElement('div');
    container.style.left = "10px";
    container.style.top = "10px";
    container.style.width = "600px";
    container.style.height = "300px";
    container.id = "container";
    document.body.appendChild(container);
  
    suite.add("PerfColumnSeries", function() {
        var i,
            key,
            series,
            len = seriesKeys.length;
         seriesObject = {};
        for(i = 0; i < len; i = i + 1)
        {
            key = seriesKeys[i];
            series = new Y.ColumnSeries({
                graphOrder: i,
                xAxis: xAxis,
                yAxis: yAxis,
                graph: mockGraph,
                xKey: "date",
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
            xAxis = new Y.TimeAxis({
                dataProvider: dataProvider,
                keys: ["date"],
                position: "none"
            });
            yAxis = new Y.NumericAxis({
                dataProvider: dataProvider,
                keys: ["expenses", "revenue"],
                position: "none"
            });
            mockGraph = {
                seriesTypes: {
                    column: []   
                }
            };
            graphic = new Y.Graphic({
                render: container,
                width: 600,
                height: 300
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
