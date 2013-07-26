var suite = new PerfSuite({
    name: 'Charts PerfArea',
    assets: ['assets/generatedataprovider.js'],
    yui: {
        config: {
            modules: {
                'generate-dataprovider': 'assets/generatedataprovider.js'
            }
        },
        use: ['generate-dataprovider', 'charts']
    },
    global: {
        setup: function () {
            var dataProvider = Y.GeneratePerfTestDataProvider.getData(),
                container = Y.Node.create('<div id="container">'),
                chart;

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
            name: 'Create',
            fn: function () {
                chart = new Y.Chart({
                    dataProvider: dataProvider,
                    type: "area",
                    categoryType: "time",
                    categoryKey: "date",
                    render: container
                });
            }
        }
    ]
});
