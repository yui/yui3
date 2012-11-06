YUI.add('datatable-body-tests', function(Y) {

var suite = new Y.Test.Suite("DataTable: Body");

suite.add(new Y.Test.Case({
    name: "datatable-body",

    "test non-DataTable construction": function () {
        var view = new Y.DataTable.BodyView({
            modelList: new Y.ModelList().reset([{ a: 1 }]),
            columns: [{ key: 'a' }]
        });

        Y.Assert.isInstanceOf(Y.DataTable.BodyView, view);
    }

}));

suite.add(new Y.Test.Case({
    name: "getCell",

    setUp: function () {
        this.view = new Y.DataTable.BodyView({
            container: Y.Node.create('<table></table>'),
            columns: [
                { key: 'a', formatter: '<em>{value}</em>', allowHTML: true },
                { key: 'b' },
                { key: 'c' }
            ],
            modelList: new Y.ModelList().reset([
                { a: 1, b: 1, c: 1 },
                { a: 2, b: 2, c: 2 },
                { a: 3, b: 3, c: 3 }
            ])
        }).render();
    },

    tearDown: function () {
        this.view.destroy();
    },

    "getCell([row, col]) should return <td>": function () {
        Y.Assert.isTrue(this.view.tbodyNode.one('td').compareTo(
            this.view.getCell([0,0])));
    },

    "getCell(tdNode) should return <td>": function () {
        Y.Assert.isTrue(this.view.tbodyNode.one('td').compareTo(
            this.view.getCell(
                this.view.tbodyNode.one('td'))));
    },

    "getCell(childNode) should return <td>": function () {
        Y.Assert.isTrue(this.view.tbodyNode.one('td').compareTo(
            this.view.getCell(
                this.view.tbodyNode.one('em'))));
    },

    "getCell([row, col], shiftString) should return relative <td>": function () {
        Y.Assert.isTrue(this.view.tbodyNode.one('td').compareTo(
            this.view.getCell([1,0], 'above')));
        Y.Assert.isTrue(this.view.tbodyNode.all('tr').item(1).one('td').compareTo(
            this.view.getCell([0,0], 'below')));
        Y.Assert.isTrue(this.view.tbodyNode.one('td').next().compareTo(
            this.view.getCell([0,0], 'next')));
        Y.Assert.isTrue(this.view.tbodyNode.one('td').compareTo(
            this.view.getCell([0,1], 'previous')));
    },

    "getCell(tdNode, shiftString) should return the relative <td>": function () {
        Y.Assert.isTrue(this.view.tbodyNode.one('td').compareTo(
            this.view.getCell(
                this.view.tbodyNode.all('tr').item(1).one('td'),
                'above')));

        Y.Assert.isTrue(this.view.tbodyNode.all('tr').item(1).one('td').compareTo(
            this.view.getCell(
                this.view.tbodyNode.one('td'), 'below')));

        Y.Assert.isTrue(this.view.tbodyNode.one('td').next().compareTo(
            this.view.getCell(
                this.view.tbodyNode.one('td'), 'next')));

        Y.Assert.isTrue(this.view.tbodyNode.one('td').compareTo(
            this.view.getCell(
                this.view.tbodyNode.all('td').item(1), 'previous')));
    },

    "getCell(childNode, shiftString) should return the relative <td>": function () {
        Y.Assert.isTrue(this.view.tbodyNode.one('td').compareTo(
            this.view.getCell(
                this.view.tbodyNode.all('tr').item(1).one('em'),
                'above')));

        Y.Assert.isTrue(this.view.tbodyNode.all('tr').item(1).one('td').compareTo(
            this.view.getCell(
                this.view.tbodyNode.one('em'), 'below')));
    },

    "getCell([row, col], shiftArray) should return relative <td>": function () {
        Y.Assert.isTrue(this.view.tbodyNode.all('td').item(2).compareTo(
            this.view.getCell([1, 0], [-1, 2])));
    },

    "getCell(tdNode, shiftArray) should return the relative <td>": function () {
        Y.Assert.isTrue(
            this.view.tbodyNode.all('tr').item(1).all('td').item(2).compareTo(
                this.view.getCell(
                    this.view.tbodyNode.one('td'), [1, 2])));
    },

    "getCell(childNode, shiftArray) should return the relative <td>": function () {
        Y.Assert.isTrue(
            this.view.tbodyNode.all('tr').item(1).all('td').item(2).compareTo(
                this.view.getCell(
                    this.view.tbodyNode.one('em'), [1, 2])));
    }
}));

suite.add(new Y.Test.Case({
    name: "getRow",

    setUp: function () {
        this.view = new Y.DataTable.BodyView({
            container: Y.Node.create('<table></table>'),
            columns: [
                { key: 'a', formatter: '<em>{value}</em>', allowHTML: true },
                { key: 'b' },
                { key: 'c' }
            ],
            modelList: new Y.ModelList().reset([
                { a: 1, b: 1, c: 1 },
                { a: 2, b: 2, c: 2 },
                { a: 3, b: 3, c: 3 }
            ])
        }).render();
    },

    tearDown: function () {
        this.view.destroy();
    },

    "getRow(index) should return <tr>": function () {
        Y.Assert.isTrue(
            this.view.tbodyNode.one('tr').compareTo(
                this.view.getRow(0)));

        Y.Assert.isTrue(
            this.view.tbodyNode.all('tr').item(1).compareTo(
                this.view.getRow(1)));
    },

    "getRow(model) should return the <tr>": function () {
        Y.Assert.isTrue(
            this.view.tbodyNode.one('tr').compareTo(
                this.view.getRow(this.view.get('modelList').item(0))));
    },
        
    "getRow(model.clientId) should return the <tr>": function () {
        Y.Assert.isTrue(
            this.view.tbodyNode.one('tr').compareTo(
                this.view.getRow(this.view.get('modelList').item(0).get('clientId'))));
    }
        
}));

suite.add(new Y.Test.Case({
    name: "getRecord",

    _should: {
        ignore: {
            // handled by Core
            "getRecord(index) should return modelList.item(index)": true,
            "getRecord(model.id) should return the corresponding Model": true,
            "getRecord(model.clientId) should return the corresponding Model": true
        }
    },

    setUp: function () {
        this.view = new Y.DataTable.BodyView({
            container: Y.Node.create('<table></table>'),
            columns: [
                { key: 'a', formatter: '<em>{value}</em>', allowHTML: true },
                { key: 'b' },
                { key: 'c' }
            ],
            modelList: new Y.ModelList().reset([
                { a: 1, b: 1, c: 1 },
                { a: 2, b: 2, c: 2 },
                { a: 3, b: 3, c: 3 }
            ])
        }).render();
    },

    tearDown: function () {
        this.view.destroy();
    },

    "getRecord(node) should return the corresponding Model": function () {
        Y.Assert.areSame(this.view.get('modelList').item(0),
            this.view.getRecord(
                this.view.tbodyNode.one('tr')));
    },
        
    "getRecord(childNode) should return the corresponding Model": function () {
        Y.Assert.areSame(this.view.get('modelList').item(0),
            this.view.getRecord(
                this.view.tbodyNode.one('em')));
    },
        
    "getRecord(rowId) should return the corresponding Model": function () {
        Y.Assert.areSame(this.view.get('modelList').item(0),
            this.view.getRecord(
                this.view.tbodyNode.one('tr').get('id')));
    },
        
    "getRecord(childElId) should return the corresponding Model": function () {
        var guid = Y.guid();

        this.view.tbodyNode.one('em').set('id', guid);

        Y.Assert.areSame(this.view.get('modelList').item(0),
            this.view.getRecord(guid));
    },

    "getRecord(index) should return modelList.item(index)": function () {
        Y.Assert.areSame(this.view.get('modelList').item(0), this.view.getRecord(0));

        Y.Assert.areSame(this.view.get('modelList').item(1), this.view.getRecord(1));
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
            table = new Y.DataTable.BodyView({
                container: Y.Node.create('<table></table>'),
                columns: [
                    { key: 'a' },
                    { key: 'b' },
                    { key: 'c' }
                ],
                modelList: new Y.ModelList({ model: M }).reset([
                    { a: 1, b: 1, c: 1 },
                    { a: 2, b: 2, c: 2 },
                    { a: 3, b: 3, c: 3 }
                ])
            });

        // For proper cleanup
        this.view.destroy();
        this.view = table;

        Y.Assert.areSame(table.get('modelList').item(0), table.getRecord('a1'));
    },

    "getRecord(model.clientId) should return the corresponding Model": function () {
        Y.Assert.areSame(this.view.get('modelList').item(0),
            this.view.getRecord(
                this.view.get('modelList').item(0).get('clientId')));
    }
        
}));

suite.add(new Y.Test.Case({
    name: "columns attribute",

    setUp: function () {
        this.view = new Y.DataTable.BodyView({
            container: Y.Node.create('<table></table>'),
            columns: [
                { key: 'a',
                  formatter: '<em id="em{value}">{value}</em>',
                  allowHTML: true
                },
                { key: 'b',
                  emptyCellValue: 'EMPTY',
                  formatter: function (o) {
                    o.rowClass += 'testRowClass';
                    o.className += 'testCellClass';
                  }
                },
                { key: 'c',
                  nodeFormatter: function (o) {
                    o.cell
                        .addClass('testCellClass')
                        .setContent(o.value)
                        .ancestor()
                            .addClass('testRowClass2');

                    return false;
                  }
                },
                { key: 'd' }
            ],
            modelList: new Y.ModelList().reset([
                { a: 'a1', b: 'b1', c: 'c1', d: 'd1' },
                { a: 'a2',          c: 'c2', d: 'd2' }
            ])
        }).render();
    },

    tearDown: function () {
        this.view.destroy();
    },

    "formatter adding to o.className should add to cell classes": function () {
        var view = this.view,
            node = view.tbodyNode.one('.' + view.getClassName('col', 'b'));

        Y.Assert.isTrue(node.hasClass('testCellClass'));
        Y.Assert.areSame('b1', node.get('text'));
    },

    "formatter adding to o.rowClass should add to row classes": function () {
        var node = this.view.tbodyNode.one('tr');

        Y.Assert.isTrue(node.hasClass('testRowClass'));
    },

    "nodeFormatter should be able to add classes to o.cell": function () {
        var view = this.view,
            node = view.tbodyNode.one('.' + view.getClassName('col', 'c'));

        Y.Assert.isTrue(node.hasClass('testCellClass'));
        Y.Assert.areSame('c1', node.get('text'));
    },

    "nodeFormatter should be able to add row classes from o.cell.ancestor()": function () {
        var node = this.view.tbodyNode.one('tr');

        Y.Assert.isTrue(node.hasClass('testRowClass2'));
    },

    "emptyCellValue should apply for missing, null, or empty string values": function () {
        var view = this.view,
            node = view.tbodyNode
                    .all('.' + view.getClassName('col', 'b'))
                    .item(1);

        Y.Assert.areSame('EMPTY', node.get('text'));
    },

    "changing columns config propagates to the UI": function () {
        var view      = this.view,
            tbody     = view.tbodyNode,
            className = '.' + view.getClassName('cell');

        Y.Assert.areSame(8, tbody.all(className).size());

        this.view.set('columns', [{ key: 'd' }]);

        Y.Assert.areSame(2, tbody.all(className).size());
    }
}));

suite.add(new Y.Test.Case({
    name: "getClassName",

    setUp: function () {
        this.view = new Y.DataTable.BodyView({
            columns: [{ key: 'a' }],
            container: Y.Node.create('<table></table>'),
            modelList: new Y.ModelList().reset([{ a: 1 }])
        });
    },

    tearDown: function () {
        this.view.destroy();
    },

    "test standalone getClassName()": function () {
        Y.Assert.areSame('yui3-tableBody-foo', this.view.getClassName('foo'));
        Y.Assert.areSame('yui3-tableBody-foo-bar',
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

suite.add(new Y.Test.Case({
    name: "modelList changes",

    setUp: function () {
        this.view = new Y.DataTable.BodyView({
            columns: [{ key: 'a' }],
            container: Y.Node.create('<table></table>'),
            modelList: new Y.ModelList().reset([{ a: 1 }])
        }).render();
    },

    tearDown: function () {
        this.view.destroy();
    },

    "replacing the modelList should update UI": function () {
        this.view.set('modelList', new Y.ModelList().reset([{ a: 5 }]));

        Y.Assert.areSame('5', this.view.tbodyNode.one('td').get('text'));
    },

    // Ref Ticket #2532523
    "changes to the modelList after replacing it should update the UI": function () {
        this.view.set('modelList', new Y.ModelList().reset([{ a: 5 }]));

        Y.Assert.areSame('5', this.view.tbodyNode.one('td').get('text'));

        this.view.get('modelList').item(0).set('a', 10);

        Y.Assert.areSame('10', this.view.tbodyNode.one('td').get('text'));
    },

    "reset()ing the modelList should update UI": function () {
        this.view.get('modelList').reset([{ a: 5 }]);

        Y.Assert.areSame('5', this.view.tbodyNode.one('td').get('text'));
    },

    "adding Models to the modelList should update UI": function () {
        this.view.get('modelList').add([{ a: 5 }]);

        Y.Assert.areSame('5', this.view.tbodyNode.all('td').item(1).get('text'));
    },

    "removing Models from the modelList should update UI": function () {
        var modelList = this.view.get('modelList'),
            model;

        modelList.add([ { a: 2 }, { a: 3 }, { a: 4 } ]);

        modelList.item(2).destroy();

        Y.Assert.areSame(3, this.view.tbodyNode.all('tr').size());
    },

    "changing Model attributes should update UI": function () {
        this.view.get('modelList').item(0).set('a', 5);

        Y.Assert.areSame('5', this.view.tbodyNode.one('td').get('text'));
    }
}));

/*
suite.add(new Y.Test.Case({
    name: "destroy",

    tearDown: function () {
        if (this.view) {
            this.view.destroy();
        }
    },

    "destroying the bodyView instance should prevent further changes propagating to the UI": function () {
        var view = this.view = new Y.DataTable.BodyView({
            columns: [ 'a' ],
            data: [{ a: 1, b: 1 }]
        }).render();

        Y.Assert.areSame(1, table.tbodyNode.all('td').size());

        table.body.destroy();

        table.set('columns', ['a', 'b']);

        Y.Assert.areSame(1, table.tbodyNode.all('td').size());
    }
}));
*/

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['datatable-base', 'test']});
