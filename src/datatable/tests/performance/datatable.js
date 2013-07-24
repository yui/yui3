{
    title: 'DataTable performance tests',
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
            title: 'Instantiate a bare data table',
            fn: function () {
                new Y.DataTable();
            }
        },
        {
            title: 'Render a bare data table',
            fn: function () {
                var dt = new Y.DataTable();
                dt.render('#container');
            }
        },
        {
            title: 'Instantiate with 1 x 3 data',
            fn: function () {
                var dt = new Y.DataTable({
                    columns: ['id', 'name', 'price'],
                    data: [{ id: 'ga-3475', name: 'gadget', price: '$6.99'}]
                });
            }
        },
        {
            title: 'Instantiate with 1 x 3 data rendered',
            fn: function () {
                var dt = new Y.DataTable({
                    columns: ['id', 'name', 'price'],
                    data: [{ id: 'ga-3475', name: 'gadget', price: '$6.99'}]
                });
                dt.render('#container');
            }
        },
        {
            title: 'Instantiate with 1 x 3 data rendered and destroyed',
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
            title: 'Instantiate with 1000 x 3 data',
            fn: function () {
                new Y.DataTable({
                    columns: ['id', 'name', 'price'],
                    data: data
                });
            }
        }
    ]
};
