var suite = new PerfSuite({
    name: 'Charts Series',
    yui: {
        use: ['charts']
    },
    global: {
        setup: function () {
            var container = Y.Node.create('<div id="container">'),
                graphic,
                miscellaneous,
                mockChart = {},
                mockGraph = {},
                xAxis,
                yAxis,
                dataProvider,
                seriesObject,
                seriesKeys = ["miscellaneous", "expenses", "revenue"];

            dataProvider = [
                {category:"5/1/2010", miscellaneous:2000, expenses:3700, revenue:2200},
                {category:"5/2/2010", miscellaneous:50, expenses:9100, revenue:100},
                {category:"5/3/2010", miscellaneous:400, expenses:1100, revenue:1500},
                {category:"5/4/2010", miscellaneous:200, expenses:1900, revenue:2800},
                {category:"5/5/2010", miscellaneous:5000, expenses:5000, revenue:2650}
            ];

            container.setStyles({
                'left': '10px',
                'top': '10px',
                'width': '600px',
                'height': '300px'
            }).appendTo(document.body);

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

            graphic = new Y.Graphic({
                render: container
            });

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
    },
    tests: [
        {
            name: 'ComboSeries',
            fn: function () {
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
            },
            teardown: function () {
                miscellaneous.destroy(true);
                container.empty(true);
            }
        },
        {
            name: 'MultipleComboSeries',
            fn: function () {
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
            },
            teardown: function () {
                container.empty(true);
            }
        }
    ]
});
