YUI.add('datatable-paginator-tests', function(Y) {

    var suite = new Y.Test.Suite('datatable-paginator'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'DataTable Paginator',

        'test datatable exists': function() {
            var dt = Y.all('#dtable .yui3-datatable');

            Y.Assert.areSame(1, dt.size());
            Y.Assert.isNotNull(dt[0]);
        },

        'test two paginators should be on the page': function () {
            var pgs = Y.all('#dtable .yui3-datatable-paginator');

            Y.Assert.areSame(2, pgs.size());
        },

        'test ten rows are on display': function () {
            var btn = Y.one('#dtable .yui3-datatable-paginator .yui3-datatable-paginator-control-first'),
                rows;

            btn.simulate('click');

            rows = Y.all('#dtable tbody.yui3-datatable-data tr');

            Y.Assert.areSame(10, rows.size());
        },

        'test last page click changes the number of rows': function () {
            var btn = Y.one('#dtable .yui3-datatable-paginator .yui3-datatable-paginator-control-last'),
                rows;

            btn.simulate('click');

            rows = Y.all('#dtable tbody.yui3-datatable-data tr');

            Y.Assert.areSame(5, rows.size());
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
