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

suite.add(new Y.Test.Case({
    name: "nested headers",

    tearDown: function () {
        if (this.table) {
            this.table.destroy();
        }
    },

    "columns configured with children should result in multiple thead rows": function () {
        var table = this.table = new Y.DataTable({
            columns: [
                { label: 'abX', children: [ 'a', 'b' ] },
                'c', 'd'
            ],
            data: []
        }).render();

        Y.Assert.areSame(2, table._tableNode.all('thead > tr').size());
        Y.Assert.areSame(5, table._tableNode.all('thead th').size());
    }
}));

suite.add(new Y.Test.Case({
    name: "abbr column config",

    tearDown: function () {
        if (this.table) {
            this.table.destroy();
        }
    },

    "column abbr should be added to the <th> as attribute": function () {
        var table = this.table = new Y.DataTable({
            columns: [ { key: 'a', abbr: 'abbr content' } ],
            data: []
        }).render();

        Y.Assert.areSame('abbr content',
            table._tableNode.one('th').getAttribute('abbr'));
    }
}));

suite.add(new Y.Test.Case({
    name: "className column config",

    tearDown: function () {
        if (this.table) {
            this.table.destroy();
        }
    },

    "column className should be added to the <th>'s class attribute": function () {
        var table = this.table = new Y.DataTable({
            columns: [ { key: 'a', className: 'testClass' } ],
            data: []
        }).render();

        Y.Assert.isTrue(table._tableNode.one('th').hasClass('testClass'));
    }
}));

suite.add(new Y.Test.Case({
    name: "columns attribute",

    tearDown: function () {
        if (this.table) {
            this.table.destroy();
        }
    },

    "changing columns should rerender headers": function () {
        var table = this.table = new Y.DataTable({
            columns: [ 'a' ],
            data: []
        }).render();

        Y.Assert.areSame(1, table._tableNode.all('th').size());

        table.set('columns', ['a', 'b']);

        Y.Assert.areSame(2, table._tableNode.all('th').size());
    }
}));

suite.add(new Y.Test.Case({
    name: "destroy",

    tearDown: function () {
        if (this.table) {
            this.table.destroy();
        }
    },

    "destroying the headerView instance should prevent further column changes propagating to the UI": function () {
        var table = this.table = new Y.DataTable({
            columns: [ 'a' ],
            data: []
        }).render();

        Y.Assert.areSame(1, table._tableNode.all('th').size());

        table.head.destroy();

        table.set('columns', ['a', 'b']);

        Y.Assert.areSame(1, table._tableNode.all('th').size());
    }
}));

Y.Test.Runner.add(suite);
