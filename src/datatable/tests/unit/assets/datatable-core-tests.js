YUI.add('datatable-core-tests', function(Y) {

var suite = new Y.Test.Suite("DataTable: Core");

suite.add(new Y.Test.Case({
    name: "Class extension",

    testClassExtension: function () {
        var Class = Y.Base.create('test-class', Y.Widget, [ Y.DataTable.Core ]),
            instance = new Class(),
            props = Y.Object.keys(Y.DataTable.Core.prototype),
            attrs = Y.Object.keys(Y.DataTable.Core.ATTRS),
            i;

        instance = new Class();

        for (i = props.length - 1; i >= 0; --i) {
            Y.Assert.isNotUndefined(instance[props[i]]);
        }

        for (i = attrs.length - 1; i >= 0; --i) {
            Y.Assert.isTrue(instance.attrAdded(attrs[i]));
        }
    }

}));

suite.add(new Y.Test.Case({
    name: "getRecord",

    setUp: function () {
        var pass = this.pass = {},
            Table = Y.Base.create('table', Y.Widget, [Y.DataTable.Core]);

        this.table = new Table({
            columns: ['a'],
            data: [
                { id: 'a1', a: 1 },
                { id: 'a2', a: 2 },
                { id: 'a3', a: 3 }
            ]
        });
    },

    tearDown: function () {
        this.table.destroy();
    },

    "test getRecord(index)": function () {
        Y.Assert.areSame(this.table.data.item(0), this.table.getRecord(0));
        Y.Assert.areSame(this.table.data.item(1), this.table.getRecord(1));
    },

    "test getRecord(id)": function () {
        Y.Assert.areSame(this.table.data.item(0), this.table.getRecord('a1'));
        Y.Assert.areSame(this.table.data.item(1), this.table.getRecord('a2'));
    },

    "test getRecord(clientId)": function () {
        Y.Assert.areSame(this.table.data.item(0),
            this.table.getRecord(this.table.data.item(0).get('clientId')));
        Y.Assert.areSame(this.table.data.item(1),
            this.table.getRecord(this.table.data.item(1).get('clientId')));
    }

}));

suite.add(new Y.Test.Case({
    name: "getColumn",

    setUp: function () {
        var Table = Y.Base.create('table', Y.Widget, [Y.DataTable.Core]);

        this.columns = [
            'a',
            { key: 'bX', name: 'b' },
            { label: 'cdX', name: 'cd', children: [ 'c', 'd' ] }
        ];

        this.table = new Table({
            columns: this.columns,
            data: []
        });
    },

    "test getColumn(key)": function () {
        Y.Assert.areSame('a', this.table.getColumn('a').key);
        Y.Assert.areSame('bX', this.table.getColumn('bX').key);
    },

    "test getColumn(name)": function () {
        Y.Assert.areSame('bX', this.table.getColumn('b').key);
        Y.Assert.areSame('cdX', this.table.getColumn('cd').label);
    },

    "test getColumn(index)": function () {
        Y.Assert.areSame('a', this.table.getColumn(0).key);
        Y.Assert.areSame('cdX', this.table.getColumn(2).label);
    },

    "test getColumn([ index, index ])": function () {
        Y.Assert.areSame('d', this.table.getColumn([2,1]).key);
    },

    "test getColumn(column)": function () {
        Y.Assert.areSame('a',
            this.table.getColumn(this.table.getColumn('a')).key);
    }
}));

suite.add(new Y.Test.Case({
    name: "columns attribute",

    _should: {
        ignore: {
            "columns should default from data array after empty instantiation": true,
            "columns should default from data ModelList after empty instantiation": true
        }
    },

    setUp: function () {
        this.Table = Y.Base.create('table', Y.Widget, [Y.DataTable.Core]);
    },

    "columns should default from data array": function () {
        var table = new this.Table({ data: [{ a: 1, b: 2 }] }),
            columns = table.get('columns');

        Y.Assert.areSame(2, columns.length);
        Y.Assert.areSame('a', columns[0].key);
        Y.Assert.areSame('b', columns[1].key);
    },

    "columns should default from data ModelList's model class": function () {
        var table = new this.Table({
                data: new Y.ModelList({
                    model: Y.Base.create('record', Y.Model, [], {}, {
                        ATTRS: { a: {}, b: {} } })
                })
            }),
            columns = table.get('columns');

        Y.Assert.areSame(2, columns.length);
        Y.Assert.areSame('a', columns[0].key);
        Y.Assert.areSame('b', columns[1].key);
    },

    "columns should default from recordType": function () {
        var table = new this.Table({ recordType: [ 'a', 'b' ] }),
            columns = table.get('columns');

        Y.Assert.areSame(2, columns.length);
        Y.Assert.areSame('a', columns[0].key);
        Y.Assert.areSame('b', columns[1].key);

        table = new this.Table({ recordType: { a: {}, b: {} } });
        columns = table.get('columns');

        Y.Assert.areSame(2, columns.length);
        Y.Assert.areSame('a', columns[0].key);
        Y.Assert.areSame('b', columns[1].key);

        table = new this.Table({
            recordType: Y.Base.create('record', Y.Model, [], {}, {
                ATTRS: { a: {}, b: {} } })
        });
        columns = table.get('columns');

        Y.Assert.areSame(2, columns.length);
        Y.Assert.areSame('a', columns[0].key);
        Y.Assert.areSame('b', columns[1].key);
    },

    // IGNORED
    "columns should default from data array after empty instantiation": function () {
        var table = new this.Table(),
            columns;

        Y.Assert.isUndefined(table.get('columns'));

        table.set('data', [{ a: 1, b: 2 }]);
        columns = table.get('columns');

        Y.Assert.areSame(2, columns.length);
        Y.Assert.areSame('a', columns[0].key);
        Y.Assert.areSame('b', columns[1].key);
    },

    // IGNORED
    "columns should default from data ModelList after empty instantiation": function () {
        var TestModel = Y.Base.create('record', Y.Model, [], {}, {
                        ATTRS: { a: {}, b: {} } }),
            table = new this.Table(),
            columns;

        Y.Assert.isUndefined(table.get('columns'));

        table.set('data', new Y.ModelList({ model: TestModel }));
        columns = table.get('columns');

        Y.Assert.areSame(2, columns.length);
        Y.Assert.areSame('a', columns[0].key);
        Y.Assert.areSame('b', columns[1].key);
    },

    "columns should default from recordType after empty instantiation": function () {
        var table = new this.Table(),
            columns;

        Y.Assert.isUndefined(table.get('columns'));

        table.set('recordType', [ 'a', 'b' ]);
        columns = table.get('columns');

        Y.Assert.areSame(2, columns.length);
        Y.Assert.areSame('a', columns[0].key);
        Y.Assert.areSame('b', columns[1].key);

        table = new this.Table();
        table.set('recordType', { a: {}, b: {} });

        Y.Assert.areSame(2, columns.length);
        Y.Assert.areSame('a', columns[0].key);
        Y.Assert.areSame('b', columns[1].key);

        table = new this.Table();
        table.set('recordType', Y.Base.create('record', Y.Model, [], {}, {
            ATTRS: { a: {}, b: {} }
        }));
        columns = table.get('columns');

        Y.Assert.areSame(2, columns.length);
        Y.Assert.areSame('a', columns[0].key);
        Y.Assert.areSame('b', columns[1].key);
    },

    "string columns should be converted to objects": function () {
        var table = new this.Table({
                columns: ['a', { key: 'b' } ],
                data: []
            }),
            columns = table.get('columns'),
            column  = table.getColumn(0);

        Y.Assert.isObject(columns[0]);
        Y.Assert.isObject(column);
        Y.Assert.areSame(columns[0], column);
        Y.Assert.areSame('a', column.key);
    },

    "test columnset pass through": function () {
        var table = new this.Table({
                columnset: ['a', { key: 'b' } ],
                data: []
            }),
            columns = table.get('columns'),
            column  = table.getColumn(0);

        Y.Assert.areSame(columns, table.get('columnset'));
        Y.Assert.isObject(columns[0]);
        Y.Assert.isObject(column);
        Y.Assert.areSame(columns[0], column);
        Y.Assert.areSame('a', column.key);
    },

    "duplicate keys should have unique column ids": function () {
        var table = new this.Table({
                columns: [
                    'a',
                    { key: 'a' },
                    { children: [ 'a', { key: 'a' } ] }
                ],
                data: []
            }),
            columns = table.get('columns');

        Y.Assert.areSame(columns[0], table.getColumn('a'));

        Y.Assert.areSame('a', columns[0].key);
        Y.Assert.areSame('a', columns[1].key);
        Y.Assert.areSame('a', columns[2].children[0].key);
        Y.Assert.areSame('a', columns[2].children[1].key);

        Y.Assert.areSame('a', columns[0]._id);
        Y.Assert.areSame('a1', columns[1]._id);
        Y.Assert.areSame('a2', columns[2].children[0]._id);
        Y.Assert.areSame('a3', columns[2].children[1]._id);
    },

    "child columns should get _parent property pointing to their parent": function () {
        var table = new this.Table({
                columns: [
                    'a',
                    {
                        name: 'bcdX',
                        children: [
                            'b',
                            { name: 'cdX', children: [ 'c', 'd'] }
                        ]
                    }
                ],
                data: []
            }),
            columns = table.get('columns');

        Y.Assert.areSame(table.getColumn('bcdX'), table.getColumn('b')._parent);
        Y.Assert.areSame(table.getColumn('bcdX'), table.getColumn('cdX')._parent);
        Y.Assert.areSame(table.getColumn('cdX'), table.getColumn('c')._parent);
        Y.Assert.areSame(table.getColumn('cdX'), table.getColumn('d')._parent);
    },

    "set('columns', VALUE) should update getColumn(NAME) map": function () {
        var table = new this.Table({
                columns: ['a', 'b', 'a'],
                data: []
            }),
            columnA  = table.getColumn('a'),
            columnB  = table.getColumn('b'),
            columns;

        table.set('columns', ['b', 'a', 'c']);

        columns = table.get('columns');

        Y.Assert.areNotSame(columnA, table.getColumn('a'));
        Y.Assert.areNotSame(columnB, table.getColumn('b'));
        Y.Assert.isObject(table.getColumn('c'));
        Y.Assert.isNull(table.getColumn('a1'));
    },

    "get('columns.KEY') should return column object based on _id": function () {
        var table = new this.Table({
                columns: [
                    'a',
                    {
                        name: 'bcdX',
                        children: [
                            { key: 'b', name: 'bX' },
                            { name: 'cdX', children: [ 'c', 'a'] }
                        ]
                    }
                ],
                data: []
            });

        Y.Assert.isObject(table.get('columns.a'));
        Y.Assert.isObject(table.get('columns.bcdX'));
        Y.Assert.isObject(table.get('columns.b'));
        Y.Assert.isObject(table.get('columns.bX'));
        Y.Assert.isObject(table.get('columns.cdX'));
        Y.Assert.isObject(table.get('columns.c'));
        Y.Assert.isObject(table.get('columns.a1'));
    },

    "test col.field alias for col.name": function () {
        var table = new this.Table({
                columns: [
                    { key: 'a', field: 'aX' },
                    { key: 'b', name: 'aX' }
                ],
                data: []
            });

        Y.Assert.areSame('a', table.getColumn('aX').key);
        Y.Assert.areSame('b', table.getColumn('aX1').key);
    }

}));

suite.add(new Y.Test.Case({
    name: "data attribute",

    setUp: function () {
        var modelList = new Y.ModelList();

        this.Table = Y.Base.create('table', Y.Widget, [Y.DataTable.Core]);

        this.data = [
            { a: 1, b: true,  c: 'string #1' },
            { a: 2, b: false, c: 'string #2' }
        ];

        modelList.model = Y.Base.create('testModel', Y.Model, [], {}, {
            ATTRS: {
                a: {},
                b: {},
                c: {}
            }
        });
        modelList.reset(this.data, { silent: true });

        this.modelList = modelList;
    },

    "test array as data value": function () {
        var table = new this.Table({
            columns: ['a', 'b', 'c'],
            data   : this.data
        });

        Y.Assert.isInstanceOf(Y.ModelList, table.data);
        Y.Assert.isInstanceOf(Y.ModelList, table.get('data'));
        Y.Assert.areSame(1, table.getRecord(0).get('a'));
        Y.Assert.areSame(2, table.getRecord(1).get('a'));
        Y.Assert.areSame(true, table.getRecord(0).get('b'));
        Y.Assert.areSame(false, table.getRecord(1).get('b'));
        Y.Assert.areSame('string #1', table.getRecord(0).get('c'));
        Y.Assert.areSame('string #2', table.getRecord(1).get('c'));
    },

    "test ModelList passed as data value": function () {
        var table = new this.Table({
            columns: ['a', 'b', 'c'],
            data   : this.modelList
        });

        Y.Assert.isInstanceOf(Y.ModelList, table.data);
        Y.Assert.areSame(this.modelList, table.data);
        Y.Assert.isInstanceOf(Y.ModelList, table.get('data'));
        Y.Assert.areSame(1, table.getRecord(0).get('a'));
        Y.Assert.areSame(2, table.getRecord(1).get('a'));
        Y.Assert.areSame(true, table.getRecord(0).get('b'));
        Y.Assert.areSame(false, table.getRecord(1).get('b'));
        Y.Assert.areSame('string #1', table.getRecord(0).get('c'));
        Y.Assert.areSame('string #2', table.getRecord(1).get('c'));
    },

    "set('data', array) should update the existing ModelList": function () {
        var table = new this.Table({
                columns: ['a', 'b', 'c'],
                data: []
            }),
            modelList = table.data;

        Y.Assert.areSame(0, modelList.size());

        table.set('data', this.data);

        Y.Assert.areSame(modelList, table.data);
        Y.Assert.areSame(2, modelList.size());
    },

    "set('data', modelList) should replace the existing ModelList": function () {
        var table = new this.Table({
                columns: ['a', 'b', 'c'],
                data: []
            }),
            modelList = table.data;

        Y.Assert.areSame(0, modelList.size());

        table.set('data', this.modelList);

        Y.Assert.areSame(this.modelList, table.data);
        Y.Assert.areSame(2, table.data.size());
    },

    "set('data', garbage) should do nothing": function () {
        var table = new this.Table({
                columns: ['a', 'b', 'c'],
                data: this.data
            }),
            modelList = table.data;

        Y.Assert.areSame(2, modelList.size());

        table.set('data', new Date());

        Y.Assert.areSame(modelList, table.data);
        Y.Assert.areSame(2, modelList.size());

        table.set('data', "not an array or ModelList");

        Y.Assert.areSame(modelList, table.data);
        Y.Assert.areSame(2, modelList.size());

        table.set('data', NaN);

        Y.Assert.areSame(modelList, table.data);
        Y.Assert.areSame(2, modelList.size());
    },

    "set('data', modelList) should fire a dataChange": function () {
        var modelList = new Y.ModelList({
                    model: Y.Base.create('test-model', Y.Model, [], {}, {
                        ATTRS: { a: {}, b: {}, c: {} }
                    })
                }).reset([{ a: 2, b: 2, c: 2 }]),
            instance  = new this.Table({
                columns: ['a', 'b', 'c'],
                data: [{ a: 1, b: 1, c: 1 }]
            }),
            fired;

        instance.after('dataChange', function (e) {
            Y.Assert.areSame(modelList, e.newVal);
            fired = true;
        });

        Y.Assert.isInstanceOf(Y.ModelList, instance.data);
        Y.Assert.areSame(1, instance.data.item(0).get('a'));

        instance.set('data', modelList);

        Y.Assert.areSame(modelList, instance.data);
        Y.Assert.areSame(2, instance.data.item(0).get('a'));
        Y.Assert.isTrue(fired);
    },

    "test recordset pass through": function () {
        var table = new this.Table({
                columns: ['a', 'b', 'c'],
                recordset: this.data
            }),
            recordset = new Y.Recordset({
                records: [
                    { a: 4, b: 4, c: 4 }
                ]
            });
        
        Y.Assert.isInstanceOf(Y.ModelList, table.data);
        Y.Assert.isInstanceOf(Y.ModelList, table.get('data'));
        Y.Assert.areSame(2, table.data.size());
        Y.Assert.areSame(1, table.getRecord(0).get('a'));
        Y.Assert.areSame(2, table.getRecord(1).get('a'));
        Y.Assert.areSame(true, table.getRecord(0).get('b'));
        Y.Assert.areSame(false, table.getRecord(1).get('b'));
        Y.Assert.areSame('string #1', table.getRecord(0).get('c'));
        Y.Assert.areSame('string #2', table.getRecord(1).get('c'));

        table.set('recordset', recordset);
        Y.Assert.areSame(1, table.data.size());
        Y.Assert.areSame(4, table.getRecord(0).get('a'));
        Y.Assert.areSame(4, table.getRecord(0).get('b'));
        Y.Assert.areSame(4, table.getRecord(0).get('c'));
    }
}));

suite.add(new Y.Test.Case({
    name: "recordType attribute",

    _should: {
        ignore: {
            "recordType should default from keys of first object in data array": true
        }
    },

    setUp: function () {
        this.Table = Y.Base.create('table', Y.Widget, [Y.DataTable.Core]);
    },

    "test instantiation with recordType: object": function () {
        var table = new this.Table({
            recordType: {
                a: { setter: function (val) {
                    return +val;
                    } },
                b: { value: 'b default' },
                c: {}
            },
            data: [
                { a: 1, b: 'string', c: 1 },
                { a: '2', c: 2 }
            ]
        });

        Y.ArrayAssert.itemsAreSame(['a', 'b', 'c'],
            Y.Object.keys(table.get('recordType').ATTRS));

        Y.Assert.areSame(1, table.getRecord(0).get('a'));
        Y.Assert.areSame('string', table.getRecord(0).get('b'));
        Y.Assert.areSame(1, table.getRecord(0).get('c'));
        Y.Assert.areSame(2, table.getRecord(1).get('a'));
        Y.Assert.areSame('b default', table.getRecord(1).get('b'));
        Y.Assert.areSame(2, table.getRecord(1).get('c'));
    },

    "test instantiation with recordType: array": function () {
        var table = new this.Table({
            recordType: ['a', 'b', 'c'],
            data: [
                { a: 1, b: 1, c: 1 },
                { a: 2, b: 2, c: 2 }
            ]
        });

        Y.ArrayAssert.itemsAreSame(['a', 'b', 'c'],
            Y.Object.keys(table.get('recordType').ATTRS));

        Y.Assert.areSame(1, table.getRecord(0).get('a'));
        Y.Assert.areSame(2, table.getRecord(1).get('b'));
    },

    "test instantiation with recordType: Model": function () {
        var Model = Y.Base.create('testModel', Y.Model, [], {}, {
                ATTRS: {
                    a: { setter: function (val) { return +val; } },
                    b: { value: 'b default' },
                    c: {}
                }
            }),
            table = new this.Table({
            recordType: Model,
            data: [
                { a: 1, b: 'string', c: 1 },
                { a: '2', c: 2 }
            ]
        });

        Y.Assert.areSame(Model, table.data.model);

        Y.ArrayAssert.itemsAreSame(['a', 'b', 'c'],
            Y.Object.keys(table.get('recordType').ATTRS));

        Y.Assert.areSame(1, table.getRecord(0).get('a'));
        Y.Assert.areSame('string', table.getRecord(0).get('b'));
        Y.Assert.areSame(1, table.getRecord(0).get('c'));
        Y.Assert.areSame(2, table.getRecord(1).get('a'));
        Y.Assert.areSame('b default', table.getRecord(1).get('b'));
        Y.Assert.areSame(2, table.getRecord(1).get('c'));
    },

    "get('recordType') should return the data modelList.model": function () {
        var modelList = new Y.ModelList(),
            table;
            
        modelList.model = Y.Base.create('testModel', Y.Model, [], {}, {
            ATTRS: {
                a: { setter: function (val) { return +val; } },
                b: { value: 'b default' },
                c: {}
            }
        });

        modelList.reset([
            { a: 1, b: 'string', c: 1 },
            { a: '2', c: 2 }
        ]);

        table = new this.Table({
            columns: ['a', 'b', 'c'],
            data: modelList
        });

        Y.Assert.areSame(table.data.model, table.get('recordType'));

        table = new this.Table();
        modelList = new Y.ModelList({
            model: Y.Base.create('test-model', Y.Model, [], {}, {
                ATTRS: { a: {}, b: {}, c: {} }
            })
        });

        Y.Assert.areSame(table.data.model, table.get('recordType'));

        table.set('recordType', ['a', 'b', 'c']);

        Y.Assert.areSame(table.data.model, table.get('recordType'));
        Y.ArrayAssert.itemsAreSame(['a', 'b', 'c'],
            Y.Object.keys(table.get('recordType').ATTRS));
    },

    // IGNORED
    "recordType should default from keys of first object in data array": function () {
        var table = new this.Table({
                columns: ['a', 'b'],
                data: [
                    { a: 1, b: 1, c: 1 },
                    { a: 2, b: 2, c: 2 }
                ]
            });

        Y.ArrayAssert.itemsAreSame(['a', 'b', 'c'],
            Y.Object.keys(table.get('recordType').ATTRS));
    }

}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['widget', 'base-build', 'datatable-core', 'view', 'recordset']});
