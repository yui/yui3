var suite = new Y.Test.Suite("datatable-body");

suite.add(new Y.Test.Case({
    name: "datatable-body",

    "test non-DataTable construction": function () {
        var view = new Y.DataTable.BodyView({
            columns: [{ key: 'a' }]
        });

        Y.Assert.isInstanceOf(Y.DataTable.BodyView, view);
    },

    "DataTable.Base default bodyView should be DataTable.BodyView": function () {
        var table = new Y.DataTable.Base({
            columns: ['a'],
            data: [{ a: 1 }]
        });

        Y.Assert.areSame(Y.DataTable.BodyView, table.get('bodyView'));

        table.render();

        Y.Assert.isInstanceOf(Y.DataTable.BodyView, table.body);

        table.destroy();
    },

    "DataTable default bodyView should be DataTable.BodyView": function () {
        var table = new Y.DataTable({
            columns: ['a'],
            data: [{ a: 1 }]
        });

        Y.Assert.areSame(Y.DataTable.BodyView, table.get('bodyView'));

        table.render();

        Y.Assert.isInstanceOf(Y.DataTable.BodyView, table.body);

        table.destroy();
    }


}));

Y.Test.Runner.add(suite);
