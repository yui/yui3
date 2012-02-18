var suite = new Y.Test.Suite("datatable-mutable");

suite.add(new Y.Test.Case({
    name: "lifecycle and instantiation",

    "Y.DataTable should be augmented": function () {
        Y.Assert.isTrue(
            new Y.DataTable().hasImpl(Y.DataTable.Mutable));
    },

    "Y.DataTable.Base should not be augmented": function () {
        Y.Assert.isFalse(
            new Y.DataTable.Base().hasImpl(Y.DataTable.Mutable));
    },

    "Y.DataTable constructor should not error": function () {
        var table = new Y.DataTable({
            columns: ['a'],
            data: [{a:1}]
        });

        Y.Assert.isInstanceOf(Y.DataTable, table);
        Y.Assert.isTrue(table.hasImpl(Y.DataTable.Mutable));
    },

    "test autoSync values": function () {
        var config = {
                columns: ['a'],
                data: [{a:1}]
            }, table;

        table = new Y.DataTable(config);

        Y.Assert.isFalse(table.get('autoSync'));

        config.autoSync = false;
        table = new Y.DataTable(config);

        Y.Assert.isFalse(table.get('autoSync'));

        config.autoSync = true;
        table = new Y.DataTable(config);

        Y.Assert.isTrue(table.get('autoSync'));

        config.autoSync = 'bogus';
        table = new Y.DataTable(config);

        Y.Assert.isFalse(table.get('autoSync'));

        config.autoSync = { create: true, update: true, 'delete': false };
        table = new Y.DataTable(config);

        Y.Assert.isFalse(table.get('autoSync'));
    },

    "test set('autoSync')": function () {
        var table = new Y.DataTable({
                columns: ['a'],
                data: [{a:1}]
            });

        Y.Assert.isFalse(table.get('autoSync'));

        table.set('autoSync', false);
        Y.Assert.isFalse(table.get('autoSync'));

        table.set('autoSync', true);
        Y.Assert.isTrue(table.get('autoSync'));

        table.set('autoSync', 'add');
        Y.Assert.isTrue(table.get('autoSync'));

        table.set('autoSync', { create: true, update: true, 'delete': false });
        Y.Assert.isTrue(table.get('autoSync'));
    }
}));

suite.add(new Y.Test.Case({
    name: "addColumn",

    setUp: function () {
        this.table = new Y.DataTable({
            columns: ['a', 'b', 'c'],
            data: [{ a: 1, b: 2, c: 3 }]
        });
    },

    tearDown: function () {
        this.table.destroy();
    },

    "test addColumn() does nothing": function () {
        var columns = this.table.get('columns');

        this.table.addColumn();

        Y.Assert.areSame(columns, this.table.get('columns'));
        Y.Assert.areSame(3, this.table.get('columns').length);
    },

    "test addColumn(string)": function () {
        var table = this.table,
            columns;

        table.addColumn('d');

        Y.Assert.isObject(table.getColumn('d'));
        Y.Assert.areSame('d', table.get('columns.d.key'));

        columns = table.get('columns');
        Y.Assert.areSame(3, Y.Array.indexOf(columns, table.get('columns.d')));
        Y.Assert.areSame(4, columns.length);
    },

    "test addColumn(config)": function () {
        var table = this.table,
            columns;

        table.addColumn({ key: 'd' });

        Y.Assert.isObject(table.getColumn('d'));
        Y.Assert.areSame('d', table.get('columns.d.key'));

        columns = table.get('columns');
        Y.Assert.areSame(3, Y.Array.indexOf(columns, table.get('columns.d')));
        Y.Assert.areSame(4, columns.length);
    },

    "test addColumn(string, number)": function () {
        var table = this.table,
            columns;

        table.addColumn('d', 1);

        Y.Assert.isObject(table.getColumn('d'));
        Y.Assert.areSame('d', table.get('columns.d.key'));

        columns = table.get('columns');
        Y.Assert.areSame(1, Y.Array.indexOf(columns, table.get('columns.d')));
        Y.Assert.areSame(4, columns.length);
    },

    "test addColumn(config, number)": function () {
        var table = this.table,
            columns;

        table.addColumn({ key: 'd' }, 1);

        Y.Assert.isObject(table.getColumn('d'));
        Y.Assert.areSame('d', table.get('columns.d.key'));

        columns = table.get('columns');
        Y.Assert.areSame(1, Y.Array.indexOf(columns, table.get('columns.d')));
        Y.Assert.areSame(4, columns.length);
    },

    "test addColumn(string, [number, number])": function () {
        var table = this.table,
            columns, column;

        // Can't resolve [3, 1]
        table.addColumn('f', [3, 1]);

        Y.Assert.isNull(table.getColumn('f'));

        columns = table.get('columns');
        Y.Assert.areSame(3, columns.length);

        table.addColumn({ name: 'parent', children: ['d', 'e'] });

        table.addColumn('f', [3, 1]);

        Y.Assert.isObject(table.getColumn('f'));
        Y.Assert.areSame('f', table.get('columns.f.key'));

        columns = table.get('columns');
        column  = table.get('columns.f');
        Y.Assert.areSame(-1, Y.Array.indexOf(columns, column));
        Y.Assert.areSame(1, Y.Array.indexOf(columns[3].children, column));
        Y.Assert.areSame(4, columns.length);
        Y.Assert.areSame(6, table._displayColumns.length);
    },

    "test addColumn(config, [number, number])": function () {
        var table = this.table,
            columns, column;

        // Can't resolve [3, 1]
        table.addColumn({ key: 'f' }, [3, 1]);

        Y.Assert.isNull(table.getColumn('f'));

        columns = table.get('columns');
        Y.Assert.areSame(3, columns.length);

        table.addColumn({ name: 'parent', children: ['d', 'e'] });

        table.addColumn({ key: 'f' }, [3, 1]);

        Y.Assert.isObject(table.getColumn('f'));
        Y.Assert.areSame('f', table.get('columns.f.key'));

        columns = table.get('columns');
        column  = table.get('columns.f');
        Y.Assert.areSame(-1, Y.Array.indexOf(columns, column));
        Y.Assert.areSame(1, Y.Array.indexOf(columns[3].children, column));
        Y.Assert.areSame(4, columns.length);
        Y.Assert.areSame(6, table._displayColumns.length);
    },

    "addColumn event should fire": function () {
        var table = this.table,
            onFired = false,
            afterFired = false;

        table.on('addColumn', function () {
            onFired = true;
        });
        table.after('addColumn', function () {
            afterFired = true;
        });

        table.addColumn('d');

        Y.Assert.isTrue(onFired);
        Y.Assert.isTrue(afterFired);
    },

    "addColumn event should have column config and index": function () {
        var table = this.table,
            column, index;

        table.on('addColumn', function (e) {
            column = e.column;
            index = e.index;
        });

        table.addColumn('d');

        Y.Assert.isObject(table.get('columns.d'));
        Y.Assert.isObject(column);
        Y.Assert.areSame(column, table.get('columns.d'));
        Y.Assert.areSame(3, index);
    },

    "addColumn event should be preventable": function () {
        var table = this.table;

        table.on('addColumn', function (e) {
            e.preventDefault();
        });

        table.addColumn('d');

        Y.Assert.isUndefined(table.get('columns.d'));
    },

    "addColumn event e.index modification should update destination": function () {
        var table = this.table;

        table.on('addColumn', function (e) {
            e.index = 1;
        });

        table.addColumn('d', 2);

        Y.Assert.areSame(1, Y.Array.indexOf(table.get('columns'), table.get('columns.d')));
    },

    "addColumn should be chainable": function () {
        Y.Assert.areSame(this.table, this.table.addColumn('d'));
    }
}));

suite.add(new Y.Test.Case({
    name: "modifyColumn",

    setUp: function () {
        this.table = new Y.DataTable({
            columns: [{ key: 'a', foo: 'foo' }, 'b', 'c'],
            data: [{ a: 1, b: 2, c: 3 }]
        });
    },

    tearDown: function () {
        this.table.destroy();
    },

    "test modifyColumn() does nothing": function () {
        var columns = this.table.get('columns');

        this.table.modifyColumn();

        Y.Assert.areSame(columns, this.table.get('columns'));
        Y.Assert.areSame(3, this.table.get('columns').length);
        Y.Assert.areSame('foo', this.table.get('columns.a.foo'));
    },

    "test modifyColumn(string) does nothing": function () {
        var columns = this.table.get('columns');

        this.table.modifyColumn('a');

        Y.Assert.areSame(columns, this.table.get('columns'));
        Y.Assert.areSame(3, this.table.get('columns').length);
        Y.Assert.areSame('foo', this.table.get('columns.a.foo'));
    },

    "test modifyColumn(string, obj)": function () {
        var table = this.table;

        table.modifyColumn('a', { foo: 'bar' });

        Y.Assert.areSame('bar', table.get('columns.a.foo'));
    },

    "test modifyColumn(number, obj)": function () {
        var table = this.table;

        table.modifyColumn(0, { foo: 'bar' });

        Y.Assert.areSame('bar', table.get('columns.a.foo'));
    },

    "test modifyColumn([number, number], obj)": function () {
        var table = this.table;

        table.addColumn({ children: [ { key: 'd', foo: 'A' }, 'e' ] });

        table.modifyColumn([3, 0], { foo: 'B' });

        Y.Assert.areSame('B', table.get('columns.d.foo'));
    },

    "modifyColumn event should fire": function () {
        var table = this.table,
            onFired = false,
            afterFired = false;

        table.on('modifyColumn', function () {
            onFired = true;
        });
        table.after('modifyColumn', function () {
            afterFired = true;
        });

        table.modifyColumn('a', { foo: 'bar' });

        Y.Assert.isTrue(onFired);
        Y.Assert.isTrue(afterFired);
    },

    "modifyColumn event should have column config and newColumnDef": function () {
        var table = this.table,
            column, config;

        table.on('modifyColumn', function (e) {
            column = e.column;
            config = e.newColumnDef;
        });

        table.modifyColumn('a', { foo: 'bar' });

        Y.Assert.areSame('a', column);
        Y.Assert.isObject(config);
    },

    "modifyColumn event should be preventable": function () {
        var table = this.table;

        table.on('modifyColumn', function (e) {
            e.preventDefault();
        });

        table.modifyColumn('a', { foo: 'bar' });

        Y.Assert.areSame('foo', table.get('columns.a.foo'));
    },

    "modifyColumn event e.newColumnDef modification should apply": function () {
        var table = this.table;

        table.on('modifyColumn', function (e) {
            e.newColumnDef = { bar: 'bar' };
        });

        table.modifyColumn('a', { foo: 'bar' });

        Y.Assert.areSame('foo', table.get('columns.a.foo'));
        Y.Assert.areSame('bar', table.get('columns.a.bar'));
    },

    "modifyColumn should be chainable": function () {
        Y.Assert.areSame(this.table, this.table.modifyColumn('a', {foo: 'B'}));
    }

}));

suite.add(new Y.Test.Case({
    name: "removeColumn",

    setUp: function () {
        this.table = new Y.DataTable({
            columns: [ 'a', 'b', 'c', { children: [ 'd', 'e' ] } ],
            data: [{ a: 1, b: 1, c: 1, d: 1, e: 1 }]
        });
    },

    tearDown: function () {
        this.table.destroy();
    },

    "test removeColumn() does nothing": function () {
        var table = this.table,
            columns = table.get('columns');

        table.removeColumn();

        Y.Assert.areSame(columns, table.get('columns'));
        Y.Assert.areSame(4, table.get('columns').length);
        Y.Assert.isObject(table.getColumn('a'));
    },

    "test removeColumn(string)": function () {
        var table = this.table;

        table.removeColumn('a');

        Y.Assert.areSame(3, table.get('columns').length);
        Y.Assert.areSame(4, table._displayColumns.length);
        Y.Assert.isNull(table.getColumn('a'));

        table.removeColumn('d');

        Y.Assert.areSame(3, table._displayColumns.length);
        Y.Assert.isNull(table.getColumn('d'));
    },

    "test removeColumn(number)": function () {
        var table = this.table;

        table.removeColumn(0);

        Y.Assert.areSame(3, table.get('columns').length);
        Y.Assert.areSame(4, table._displayColumns.length);
        Y.Assert.isNull(table.getColumn('a'));
    },

    "test removeColumn([number, number])": function () {
        var table = this.table;

        table.removeColumn([3, 0]);

        Y.Assert.areSame(4, table.get('columns').length);
        Y.Assert.areSame(4, table._displayColumns.length);
        Y.Assert.isNull(table.getColumn('d'));
        Y.Assert.isObject(table.getColumn([3, 0]));
        Y.Assert.areSame('e', table.getColumn([3, 0]).key);
    },

    "removeColumn event should fire": function () {
        var table = this.table,
            onFired = false,
            afterFired = false;

        table.on('removeColumn', function () {
            onFired = true;
        });
        table.after('removeColumn', function () {
            afterFired = true;
        });

        table.removeColumn('a');

        Y.Assert.isTrue(onFired);
        Y.Assert.isTrue(afterFired);
    },

    "removeColumn event should have column config": function () {
        var table = this.table,
            column;

        table.on('removeColumn', function (e) {
            column = e.column;
        });

        table.removeColumn('a');

        Y.Assert.areSame('a', column);
    },

    "removeColumn event should be preventable": function () {
        var table = this.table;

        table.on('removeColumn', function (e) {
            e.preventDefault();
        });

        table.removeColumn('a');

        Y.Assert.isObject(table.getColumn('a'));
    },

    "removeColumn event e.column modification should apply": function () {
        var table = this.table;

        table.on('removeColumn', function (e) {
            e.column = 'a';
        });

        table.removeColumn('d');

        Y.Assert.isNull(table.getColumn('a'));
        Y.Assert.isObject(table.getColumn('d'));
    },

    "removeColumn should be chainable": function () {
        Y.Assert.areSame(this.table, this.table.removeColumn('a'));
    }
}));

suite.add(new Y.Test.Case({
    name: "moveColumn",

    "": function () {
    }


}));

suite.add(new Y.Test.Case({
    name: "addRow",

    "": function () {
    }


}));

suite.add(new Y.Test.Case({
    name: "addRows",

    "": function () {
    }


}));

suite.add(new Y.Test.Case({
    name: "modifyRow",

    "": function () {
    }


}));

suite.add(new Y.Test.Case({
    name: "removeRow",

    "": function () {
    }


}));

Y.Test.Runner.add(suite);
