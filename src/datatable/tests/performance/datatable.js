var suite = new PerfSuite({
    name: 'DataTable performance tests',
    html:'<div id="container"></div>',
    yui: {
        use: ['datatable']
    },
    global: {
        setup: function () {
            var data = [], i;

            for (i = 0; i < 1000; i++) {
                data.push({ id: 'ga-3475' + i, name: 'gadget', price: '$6.99'});
            }
        },
        teardown: function () {
            Y.one('#container').empty(true);
        }
    },
    tests: [
        {
            name: 'Instantiate a bare data table',
            fn: function () {
                new Y.DataTable();
            }
        },
        {
            name: 'Render a bare data table',
            fn: function () {
                var dt = new Y.DataTable();
                dt.render('#container');
            }
        },
        {
            name: 'Instantiate with 1 x 3 data',
            fn: function () {
                var dt = new Y.DataTable({
                    columns: ['id', 'name', 'price'],
                    data: [{ id: 'ga-3475', name: 'gadget', price: '$6.99'}]
                });
            }
        },
        {
            name: 'Instantiate with 1 x 3 data rendered',
            fn: function () {
                var dt = new Y.DataTable({
                    columns: ['id', 'name', 'price'],
                    data: [{ id: 'ga-3475', name: 'gadget', price: '$6.99'}]
                });
                dt.render('#container');
            }
        },
        {
            name: 'Instantiate with 1 x 3 data rendered and destroyed',
            fn: function () {
                var dt = new Y.DataTable({
                    columns: ['id', 'name', 'price'],
                    data: [{ id: 'ga-3475', name: 'gadget', price: '$6.99'}]
                });
                dt.render('#container');
                dt.destroy();
            }
        },
        {
            name: 'Instantiate with 1000 x 3 data',
            fn: function () {
                new Y.DataTable({
                    columns: ['id', 'name', 'price'],
                    data: data
                });
            }
        }
    ]
});
