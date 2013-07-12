YUI.add('perfbarseries-benchmark', function (Y) {
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
  
    suite.add("PerfBarSeries", function() {
        var i,
            key,
            series,
            seriesTypeCollection = [];
            len = seriesKeys.length;
         seriesObject = {};
        for(i = 0; i < len; i = i + 1)
        {
            key = seriesKeys[i];
            series = new Y.BarSeries({
                graphOrder: i,
                xAxis: xAxis,
                yAxis: yAxis,
                graph: mockGraph,
                seriesTypeCollection: seriesTypeCollection,
                xKey: key,
                yKey: "date"
            });
            seriesTypeCollection.push(series);
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
            yAxis = new Y.TimeAxis({
                dataProvider: dataProvider,
                keys: ["date"],
                position: "none"
            });
            xAxis = new Y.NumericAxis({
                dataProvider: dataProvider,
                keys: ["expenses", "revenue"],
                position: "none"
            });
            mockGraph = {
                seriesTypes: {
                    bar: []   
                }
            };
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
