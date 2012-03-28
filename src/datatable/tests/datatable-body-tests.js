YUI.add('datatable-body-tests', function(Y) {

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
    },

    "Shared ModelList should not generate duplicate ids": function () {
        var table1 = new Y.DataTable({
                columns: ['a'],
                data: [{ a: 1 }]
            }).render(),
            table2 = new Y.DataTable({
                columns: ['a'],
                data: table1.data
            }).render(),
            ids = Y.Array.hash(table1.get('boundingBox').all('[id]').get('id')),
            dups = 0;

        Y.Array.each(table2.get('boundingBox').all('[id]').get('id'),
            function (id) {
                if (ids[id]) {
                    dups++;
                }
            });

        table1.destroy();
        table2.destroy();

        Y.Assert.areSame(0, dups, dups + " duplicate IDs found");
    }
}));

suite.add(new Y.Test.Case({
    name: "getCell",

    setUp: function () {
        this.table = new Y.DataTable.Base({
            columns: [
                { key: 'a', formatter: '<em>{value}</em>', allowHTML: true },
                'b',
                'c'
            ],
            data: [
                { a: 1, b: 1, c: 1 },
                { a: 2, b: 2, c: 2 },
                { a: 3, b: 3, c: 3 }
            ]
        }).render();
    },

    tearDown: function () {
        this.table.destroy();
    },

    "getCell([row, col]) should return <td>": function () {
        Y.Assert.isTrue(this.table._tbodyNode.one('td').compareTo(
            this.table.getCell([0,0])));
    },

    "getCell(tdNode) should return <td>": function () {
        Y.Assert.isTrue(this.table._tbodyNode.one('td').compareTo(
            this.table.getCell(
                this.table._tbodyNode.one('td'))));
    },

    "getCell(childNode) should return <td>": function () {
        Y.Assert.isTrue(this.table._tbodyNode.one('td').compareTo(
            this.table.getCell(
                this.table._tbodyNode.one('em'))));
    },

    "getCell([row, col], shiftString) should return relative <td>": function () {
        Y.Assert.isTrue(this.table._tbodyNode.one('td').compareTo(
            this.table.getCell([1,0], 'above')));
        Y.Assert.isTrue(this.table._tbodyNode.all('tr').item(1).one('td').compareTo(
            this.table.getCell([0,0], 'below')));
        Y.Assert.isTrue(this.table._tbodyNode.one('td').next().compareTo(
            this.table.getCell([0,0], 'next')));
        Y.Assert.isTrue(this.table._tbodyNode.one('td').compareTo(
            this.table.getCell([0,1], 'previous')));
    },

    "getCell(tdNode, shiftString) should return the relative <td>": function () {
        Y.Assert.isTrue(this.table._tbodyNode.one('td').compareTo(
            this.table.getCell(
                this.table._tbodyNode.all('tr').item(1).one('td'),
                'above')));

        Y.Assert.isTrue(this.table._tbodyNode.all('tr').item(1).one('td').compareTo(
            this.table.getCell(
                this.table._tbodyNode.one('td'), 'below')));

        Y.Assert.isTrue(this.table._tbodyNode.one('td').next().compareTo(
            this.table.getCell(
                this.table._tbodyNode.one('td'), 'next')));

        Y.Assert.isTrue(this.table._tbodyNode.one('td').compareTo(
            this.table.getCell(
                this.table._tbodyNode.all('td').item(1), 'previous')));
    },

    "getCell(childNode, shiftString) should return the relative <td>": function () {
        Y.Assert.isTrue(this.table._tbodyNode.one('td').compareTo(
            this.table.getCell(
                this.table._tbodyNode.all('tr').item(1).one('em'),
                'above')));

        Y.Assert.isTrue(this.table._tbodyNode.all('tr').item(1).one('td').compareTo(
            this.table.getCell(
                this.table._tbodyNode.one('em'), 'below')));
    },

    "getCell([row, col], shiftArray) should return relative <td>": function () {
        Y.Assert.isTrue(this.table._tbodyNode.all('td').item(2).compareTo(
            this.table.getCell([1, 0], [-1, 2])));
    },

    "getCell(tdNode, shiftArray) should return the relative <td>": function () {
        Y.Assert.isTrue(
            this.table._tbodyNode.all('tr').item(1).all('td').item(2).compareTo(
                this.table.getCell(
                    this.table._tbodyNode.one('td'), [1, 2])));
    },

    "getCell(childNode, shiftArray) should return the relative <td>": function () {
        Y.Assert.isTrue(
            this.table._tbodyNode.all('tr').item(1).all('td').item(2).compareTo(
                this.table.getCell(
                    this.table._tbodyNode.one('em'), [1, 2])));
    }
}));

suite.add(new Y.Test.Case({
    name: "getRow",

    setUp: function () {
        this.table = new Y.DataTable.Base({
            columns: [
                { key: 'a', formatter: '<em>{value}</em>', allowHTML: true },
                'b',
                'c'
            ],
            data: [
                { a: 1, b: 1, c: 1 },
                { a: 2, b: 2, c: 2 },
                { a: 3, b: 3, c: 3 }
            ]
        }).render();
    },

    tearDown: function () {
        this.table.destroy();
    },

    "getRow(index) should return <tr>": function () {
        Y.Assert.isTrue(
            this.table._tbodyNode.one('tr').compareTo(
                this.table.getRow(0)));

        Y.Assert.isTrue(
            this.table._tbodyNode.all('tr').item(1).compareTo(
                this.table.getRow(1)));
    },

    "getRow(model) should return the <tr>": function () {
        Y.Assert.isTrue(
            this.table._tbodyNode.one('tr').compareTo(
                this.table.getRow(this.table.data.item(0))));
    },
        
    "getRow(model.clientId) should return the <tr>": function () {
        Y.Assert.isTrue(
            this.table._tbodyNode.one('tr').compareTo(
                this.table.getRow(this.table.data.item(0).get('clientId'))));
    }
        
}));

suite.add(new Y.Test.Case({
    name: "getRecord",

    setUp: function () {
        this.table = new Y.DataTable.Base({
            columns: [
                { key: 'a', formatter: '<em id="em{value}">{value}</em>', allowHTML: true },
                'b',
                'c'
            ],
            data: [
                { a: 'a1', b: 1, c: 1 },
                { a: 'a2', b: 2, c: 2 },
                { a: 'a3', b: 3, c: 3 }
            ]
        }).render();
    },

    tearDown: function () {
        this.table.destroy();
    },

    "getRecord(index) should return modelList.item(index)": function () {
        Y.Assert.areSame(this.table.data.item(0), this.table.getRecord(0));

        Y.Assert.areSame(this.table.data.item(1), this.table.getRecord(1));
    },

    "getRecord(node) should return the corresponding Model": function () {
        Y.Assert.areSame(this.table.data.item(0),
            this.table.getRecord(
                this.table._tbodyNode.one('tr')));
    },
        
    "getRecord(childNode) should return the corresponding Model": function () {
        Y.Assert.areSame(this.table.data.item(0),
            this.table.getRecord(
                this.table._tbodyNode.one('em')));
    },

    "getRecord(model.id) should return the corresponding Model": function () {
        var M = Y.Base.create('testModel', Y.Model, [], {
                idAttribute: 'a'
            }, {
                ATTRS: {
                    a: {},
                    b: {},
                    c: {}
                }
            }),
            table = new Y.DataTable({
                columns: [ 'a', 'b', 'c' ],
                data: [
                    { a: 'a1', b: 1, c: 1 },
                    { a: 'a2', b: 2, c: 2 },
                    { a: 'a3', b: 3, c: 3 }
                ],
                recordType: M
            });

        // For proper cleanup
        this.table.destroy();
        this.table = table;

        Y.Assert.areSame(table.data.item(0), table.getRecord('a1'));
    },

    "getRecord(model.clientId) should return the corresponding Model": function () {
        Y.Assert.areSame(this.table.data.item(0),
            this.table.getRecord(
                this.table.data.item(0).get('clientId')));
    },
        
    "getRecord(rowId) should return the corresponding Model": function () {
        Y.Assert.areSame(this.table.data.item(0),
            this.table.getRecord(
                this.table._tbodyNode.one('tr').get('id')));
    },
        
    "getRecord(childElId) should return the corresponding Model": function () {
        Y.Assert.areSame(this.table.data.item(0),
            this.table.getRecord(
                this.table._tbodyNode.one('em').get('id')));
    }
        
}));

suite.add(new Y.Test.Case({
    name: "columns attribute",

    setUp: function () {
        this.table = new Y.DataTable.Base({
            columns: [
                { key: 'a', formatter: '<em id="em{value}">{value}</em>', allowHTML: true },
                { label: 'formatters', children: [
                    { key: 'b',
                      formatter: function (o) {
                        o.rowClass += 'testRowClass';
                        o.className += 'testCellClass';
                      }
                    },
                    { key: 'c', nodeFormatter: function (o) {
                        o.cell
                            .addClass('testCellClass')
                            .setContent(o.value)
                            .ancestor()
                                .addClass('testRowClass2');

                        return false;
                      }
                    }
                  ]
                },
                'd'
            ],
            data: [
                { a: 'a1', b: 'b1', c: 'c1', d: 'd1' }
            ]
        }).render();
    },

    tearDown: function () {
        this.table.destroy();
    },

    "formatter adding to o.className should add to cell classes": function () {
        var node = this.table._tbodyNode.one('.yui3-datatable-col-b');

        Y.Assert.isTrue(node.hasClass('testCellClass'));
        Y.Assert.areSame('b1', node.get('text'));
    },

    "formatter adding to o.rowClass should add to row classes": function () {
        var node = this.table._tbodyNode.one('tr');

        Y.Assert.isTrue(node.hasClass('testRowClass'));
    },

    "nodeFormatter should be able to add classes to o.cell": function () {
        var node = this.table._tbodyNode.one('.yui3-datatable-col-c');

        Y.Assert.isTrue(node.hasClass('testCellClass'));
        Y.Assert.areSame('c1', node.get('text'));
    },

    "nodeFormatter should be able to add row classes from o.cell.ancestor()": function () {
        var node = this.table._tbodyNode.one('tr');

        Y.Assert.isTrue(node.hasClass('testRowClass2'));
    },

    "changing columns config propagates to the UI": function () {
        Y.Assert.areSame(4, this.table._tbodyNode.all('.yui3-datatable-cell').size());

        this.table.set('columns', ['d']);

        Y.Assert.areSame(1, this.table._tbodyNode.all('.yui3-datatable-cell').size());
    }
}));

suite.add(new Y.Test.Case({
    name: "destroy",

    tearDown: function () {
        if (this.table) {
            this.table.destroy();
        }
    },

    "destroying the bodyView instance should prevent further changes propagating to the UI": function () {
        var table = this.table = new Y.DataTable({
            columns: [ 'a' ],
            data: [{ a: 1, b: 1 }]
        }).render();

        Y.Assert.areSame(1, table._tbodyNode.all('td').size());

        table.body.destroy();

        table.set('columns', ['a', 'b']);

        Y.Assert.areSame(1, table._tbodyNode.all('td').size());
    }
}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['datatable-base', 'test']});
