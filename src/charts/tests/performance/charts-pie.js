var suite = new PerfSuite({
    name: 'Charts Pie',
    yui: {
        use: ['charts']
    },
    global: {
        setup: function () {
            var container = Y.Node.create('<div id="container">'),
                chart,
                pieDataProvider;

            pieDataProvider = [
                {category:"5/1/2010", revenue:2200},
                {category:"5/2/2010", revenue:100},
                {category:"5/3/2010", revenue:1500},
                {category:"5/4/2010", revenue:2800},
                {category:"5/5/2010", revenue:2650}
            ];

            container.setStyles({
                'left': '10px',
                'top': '10px',
                'width': '600px',
                'height': '300px'
            }).appendTo(document.body);
        },
        teardown: function () {
            chart.destroy(true);
            container.empty(true);
        }
    },
    tests: [
        {
            name: 'Pie Chart',
            fn: function () {
                chart = new Y.Chart({
                    dataProvider: pieDataProvider,
                    type: "pie",
                    render: container,
                    categoryKey: "category"
                });
                chart.destroy(true);
            }
        },
        {
            name: 'Pie Chart Legend',
            fn: function () {
                chart = new Y.Chart({
                    legend: {
                        position: "right"
                    },
                    dataProvider: pieDataProvider,
                    type: "pie",
                    render: container,
                    categoryKey: "category"
                });
                chart.destroy(true);
            }
        }
    ]
});
