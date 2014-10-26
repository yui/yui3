YUI.add('datatable-filter-tests', function(Y) {

var suite = new Y.Test.Suite("DataTable: filter");

var dt = new Y.DataTable({
        columns: [ 'name', 'qty', {
            key: 'join',
            formatter: function (o) {
                return o.data.name + ':' + o.data.qty;
            }
        } ],
        data: [
            { name: 'Apple', qty: 7 },
            { name: 'Banana', qty: 6 },
            { name: 'Cherry', qty: 5 },
            { name: 'Grape', qty: 4 },
            { name: 'Orange', qty: 3 },
            { name: 'Pineapple', qty: 2 }
        ],
        render: true
    }),

    areSame = Y.Assert.areSame;



suite.add(new Y.Test.Case({

    name: "filter",

    'setUp': function () {
        dt.clearFilters();
    },

    'tearDown': function () {
        //dt.clearFilters();
    },

    'test single match filter (String)': function () {
        areSame(6, dt.get('data').size(), 'There are not 6 records');

        dt.filter('name', 'Apple');

        areSame(1, dt.get('data').size(), 'There is not 1 record');
        areSame('Apple', dt.get('data').item(0).get('name'), 'The item found is not an Apple');

    },

    'test single match filter (Number)': function () {
        areSame(6, dt.get('data').size(), 'There are not 6 records');

        dt.filter('qty', 5);

        areSame(1, dt.get('data').size(), 'There is not 1 record');
        areSame('Cherry', dt.get('data').item(0).get('name'), 'The item found is not a Cherry');
    },

    'test single match filter (Array)': function () {
        areSame(6, dt.get('data').size(), 'There are not 6 records');

        dt.filter('qty', [3,4,5]);

        areSame(3, dt.get('data').size(), 'There are not 3 records');
        // matches first item is still a cherry because the filter array does not determin order
        areSame('Cherry', dt.get('data').item(0).get('name'), 'The first item found is not a Cherry');
        areSame('Grape', dt.get('data').item(1).get('name'), 'The first item found is not a Grape');
        areSame('Orange', dt.get('data').item(2).get('name'), 'The first item found is not an Orange');
    },

    'test single match filter (RegExp)': function () {
        areSame(6, dt.get('data').size(), 'There are not 6 records');

        dt.filter('name', /ple/);

        areSame(2, dt.get('data').size(), 'There are not 2 records');
        areSame('Apple', dt.get('data').item(0).get('name'), 'The first item found is not an Apple');
        areSame('Pineapple', dt.get('data').item(1).get('name'), 'The second item found is not a Pineapple');
    },

    'test values not included (String)': function () {
        areSame(6, dt.get('data').size(), 'There are not 6 records');

        dt.filter('name', 'Zebra');

        areSame(0, dt.get('data').size(), 'The ModelList is not empty');
    },

    'test custom filter function': function () {
        areSame(6, dt.get('data').size(), 'There are not 6 records');

        dt.filter(function (row) {
            var name = row.get('name'),
                qty = row.get('qty');

            return (name === 'Cherry') || (qty === 3) || (qty === 1);
        });

        var data = dt.get('data');

        areSame(2, data.size(), 'There are not 2 records');
        areSame('Cherry', data.item(0).get('name'), 'The first item is not a Cherry');
        areSame('Orange', data.item(1).get('name'), 'The second item is not a Orange');
    },

    'test filter between a range (Number)': function () {
        areSame(6, dt.get('data').size(), 'There are not 6 records');

        dt.filter('qty', 2, 3);

        areSame(2, dt.get('data').size(), 'There are not 2 items');
    },

    'test filter between a range with use formatter as true (Number)': function () {
        areSame(6, dt.get('data').size(), 'There are not 6 records');

        dt.filter('qty', 2, 3, true);

        areSame(2, dt.get('data').size(), 'There are not 2 items');
    },

    'test consecutive filters (String)': function () {
        areSame(6, dt.get('data').size(), 'There are not 6 records');

        dt.filter('name', 'Apple');

        areSame(1, dt.get('data').size(), 'There is not 1 record');
        areSame('Apple', dt.get('data').item(0).get('name'), 'The item found is not an Apple');

        dt.filter('name', 'Banana');

        areSame(1, dt.get('data').size(), 'There is not 1 record');
        areSame('Banana', dt.get('data').item(0).get('name'), 'The item found is not a Banana');
    },

    'test add filter then run': function () {
        areSame(6, dt.get('data').size(), 'There are not 6 records');

        dt.addFilter('qty', [3,4,5]);

        areSame(6, dt.get('data').size(), 'There are not 6 records');

        dt.filter();

        areSame(3, dt.get('data').size(), 'There are not 3 records');
        // matches first item is still a cherry because the filter array does not determin order
        areSame('Cherry', dt.get('data').item(0).get('name'), 'The first item found is not a Cherry');
        areSame('Grape', dt.get('data').item(1).get('name'), 'The second item found is not a Grape');
        areSame('Orange', dt.get('data').item(2).get('name'), 'The third item found is not an Orange');
    },

    'test adding multiple filters and running them': function () {
        areSame(6, dt.get('data').size(), 'There are not 6 records');

        dt.addFilter('qty', [3,4,5]);
        dt.addFilter('name', /a/);

        areSame(6, dt.get('data').size(), 'There are not 6 records');

        dt.filter();

        areSame(2, dt.get('data').size(), 'There are not 2 records');

        areSame('Grape', dt.get('data').item(0).get('name'), 'The first item found is not a Grape');
        areSame('Orange', dt.get('data').item(1).get('name'), 'The second item found is not an Orange');

    },

    'test adding multiple filters, removing one and running them': function () {
        areSame(6, dt.get('data').size(), 'There are not 6 records');

        dt.addFilter('name', /n/);
        dt.addFilter('qty', [3,4,5]);
        dt.addFilter('name', /a/);

        dt.removeFilter(0);

        areSame(6, dt.get('data').size(), 'There are not 6 records (2nd)');

        dt.filter();

        areSame(2, dt.get('data').size(), 'There are not 2 records');

        areSame('Grape', dt.get('data').item(0).get('name'), 'The first item found is not a Grape');
        areSame('Orange', dt.get('data').item(1).get('name'), 'The second item found is not an Orange');

    },

    'test adding multiple filters, removing one that doesn\'t exist and running them': function () {
        areSame(6, dt.get('data').size(), 'There are not 6 records');

        dt.addFilter('qty', [3,4,5]);
        dt.addFilter('name', /a/);

        dt.removeFilter(5);

        areSame(6, dt.get('data').size(), 'There are not 6 records');

        dt.filter();

        areSame(2, dt.get('data').size(), 'There are not 2 records');

        areSame('Grape', dt.get('data').item(0).get('name'), 'The first item found is not a Grape');
        areSame('Orange', dt.get('data').item(1).get('name'), 'The second item found is not an Orange');

    },

    'test applying filters that do not exist': function () {
        var d = new Y.DataTable({
            columns: ['name', 'qty'],
            data: [
                {name: 'a', qty: 1},
                {name: 'b', qty: 2}
            ],
            render: true
        });

        d.applyFilter();

        areSame(2, d.get('data').size());

        d.destroy();
    },

    'test filter on no data column': function () {
        areSame(6, dt.get('data').size(), 'There are not 6 records');

        dt.filter('join', /a/); // banana, orange, pineapple

        areSame(0, dt.get('data').size(), 'There recordset is not empy');
    },

    'test filter on no data column': function () {
        areSame(6, dt.get('data').size(), 'There are not 6 records');

        dt.filter('join', /a/, null, true); // banana, grape, orange, pineapple

        areSame(4, dt.get('data').size(), 'There are not 4 items');
    }


}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['datatable', 'datatable-filter', 'test']});
