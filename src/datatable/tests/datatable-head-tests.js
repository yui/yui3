YUI.add('datatable-head-tests', function(Y) {

var suite = new Y.Test.Suite("datatable-head");

suite.add(new Y.Test.Case({
    name: "datatable-head",

    "test non-DataTable construction": function () {
        var view = new Y.DataTable.HeaderView({
            columns: [{ key: 'a' }]
        });

        Y.Assert.isInstanceOf(Y.DataTable.HeaderView, view);
    },

    "DataTable.Base default headerView should be DataTable.HeaderView": function () {
        var table = new Y.DataTable.Base({
            columns: ['a'],
            data: [{ a: 1 }]
        });

        Y.Assert.areSame(Y.DataTable.HeaderView, table.get('headerView'));

        table.render();

        Y.Assert.isInstanceOf(Y.DataTable.HeaderView, table.head);

        table.destroy();
    },

    "DataTable default headerView should be DataTable.HeaderView": function () {
        var table = new Y.DataTable({
            columns: ['a'],
            data: [{ a: 1 }]
        });

        Y.Assert.areSame(Y.DataTable.HeaderView, table.get('headerView'));

        table.render();

        Y.Assert.isInstanceOf(Y.DataTable.HeaderView, table.head);

        table.destroy();
    }

}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['datatable-base', 'test']});
