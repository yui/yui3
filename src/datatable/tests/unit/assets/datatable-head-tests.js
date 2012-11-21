YUI.add('datatable-head-tests', function(Y) {

var suite = new Y.Test.Suite("DataTable: Head");

suite.add(new Y.Test.Case({
    name: "datatable-head",

    "test non-DataTable construction": function () {
        var view = new Y.DataTable.HeaderView({
            columns: [{ key: 'a' }]
        });

        Y.Assert.isInstanceOf(Y.DataTable.HeaderView, view);
    }

}));

suite.add(new Y.Test.Case({
    name: "nested headers",

    tearDown: function () {
        if (this.view) {
            this.view.destroy();
        }
    },

    "columns configured with children should result in multiple thead rows": function () {
        var view = this.view = new Y.DataTable.HeaderView({
            container: Y.Node.create('<table></table>'),
            columns: [
                {
                    label: 'abX',
                    children: [
                        { key: 'a' },
                        { label: 'bX',
                          children: [
                            { key: 'b' }
                          ]
                        }
                    ]
                },
                { key: 'c' },
                { key: 'd' }
            ],
            modelList: new Y.ModelList().reset([{ a: 1, b: 1, c: 1, d: 1 }])
        }).render();

        Y.Assert.areSame(3, view.get('container').all('thead > tr').size());
        Y.Assert.areSame(6, view.get('container').all('thead th').size());
    }
}));

suite.add(new Y.Test.Case({
    name: "abbr column config",

    tearDown: function () {
        if (this.view) {
            this.view.destroy();
        }
    },

    "column abbr should be added to the <th> as attribute": function () {
        var view = this.view = new Y.DataTable.HeaderView({
            container: Y.Node.create('<table></table>'),
            columns: [{ key: 'a', abbr: 'abbr content' }],
            modelList: new Y.ModelList().reset([{ a: 1 }])
        }).render();

        Y.Assert.areSame('abbr content',
            view.get('container').one('th').getAttribute('abbr'));
    }
}));

suite.add(new Y.Test.Case({
    name: "className column config",

    tearDown: function () {
        if (this.view) {
            this.view.destroy();
        }
    },

    "column className should be added to the <th>'s class attribute": function () {
        var view = this.view = new Y.DataTable.HeaderView({
            container: Y.Node.create('<table></table>'),
            columns: [{ key: 'a', className: 'testClass' }],
            modelList: new Y.ModelList().reset([{ a: 1 }])
        }).render();

        Y.Assert.isTrue(view.get('container').one('th').hasClass('testClass'));
    }
}));

suite.add(new Y.Test.Case({
    name: "_id column config",

    tearDown: function () {
        if (this.view) {
            this.view.destroy();
        }
    },

    "column _id should be added to the <th>'s class attribute": function () {
        var view = this.view = new Y.DataTable.HeaderView({
            container: Y.Node.create('<table></table>'),
            columns: [{ key: 'a', _id: 'foo' }],
            modelList: new Y.ModelList().reset([{ a: 1 }])
        }).render();

        Y.Assert.isTrue(view.get('container').one('th').hasClass(
            view.getClassName('col', 'foo')));
    }
}));

suite.add(new Y.Test.Case({
    name: "columns attribute",

    setUp: function () {
        this.view = new Y.DataTable.HeaderView({
            container: Y.Node.create('<table></table>'),
            columns: [{ key: 'a' }],
            modelList: new Y.ModelList().reset([{ a: 1 }])
        }).render();
    },

    tearDown: function () {
        this.view.destroy();
    },

    "changing columns should rerender headers": function () {

        Y.Assert.areSame(1, this.view.get('container').all('th').size());

        this.view.set('columns', [{ key: 'a' }, { key: 'b' }]);

        Y.Assert.areSame(2, this.view.get('container').all('th').size());
    }
}));

suite.add(new Y.Test.Case({
    name: "getClassName",

    setUp: function () {
        this.view = new Y.DataTable.HeaderView({
            columns: [{ key: 'a' }],
            container: Y.Node.create('<table></table>'),
            modelList: new Y.ModelList().reset([{ a: 1 }])
        });
    },

    tearDown: function () {
        this.view.destroy();
    },

    "test standalone getClassName()": function () {
        Y.Assert.areSame('yui3-tableHeader-foo', this.view.getClassName('foo'));
        Y.Assert.areSame('yui3-tableHeader-foo-bar',
            this.view.getClassName('foo', 'bar'));
    },

    "test host-relayed getClassName()": function () {
        this.view.host = {
            getClassName: function () {
                return arguments.length;
            }
        };

        Y.Assert.areSame(1, this.view.getClassName('foo'));
        Y.Assert.areSame(2, this.view.getClassName('foo', 'bar'));
    }
}));

/*
suite.add(new Y.Test.Case({
    name: "destroy",

    setUp: function () {
        this.view = new Y.DataTable.HeaderView({
            container: Y.Node.create('<table></table>'),
            columns: [{ key: 'a' }],
            modelList: new Y.ModelList().reset([{ a: 1 }])
        });
    },

    tearDown: function () {
        this.view.destroy();
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
*/

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['datatable-head', 'test']});
