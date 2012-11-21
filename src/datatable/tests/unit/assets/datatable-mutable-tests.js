YUI.add('datatable-mutable-tests', function(Y) {

var suite = new Y.Test.Suite("DataTable: Mutable");

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
        Y.Assert.areSame('d', table.get('columns.d').key);
        Y.Assert.areSame(column.key, table.get('columns.d').key);
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

    setUp: function () {
        this.table = new Y.DataTable({
            columns: [ 'a', 'b', 'c', { children: [ 'd', 'e' ] } ],
            data: [{ a: 1, b: 1, c: 1, d: 1, e: 1 }]
        });
    },

    tearDown: function () {
        this.table.destroy();
    },

    "test moveColumn() does nothing": function () {
        var table = this.table;

        table.moveColumn();

        Y.Assert.areSame('a', table.getColumn(0).key);
        Y.Assert.areSame('b', table.getColumn(1).key);
        Y.Assert.areSame('c', table.getColumn(2).key);
        Y.Assert.areSame('d', table.getColumn([3, 0]).key);
        Y.Assert.areSame('e', table.getColumn([3, 1]).key);
    },

    "test moveColumn(name) does nothing": function () {
        var table = this.table;

        table.moveColumn('c');

        Y.Assert.areSame('a', table.getColumn(0).key);
        Y.Assert.areSame('b', table.getColumn(1).key);
        Y.Assert.areSame('c', table.getColumn(2).key);
        Y.Assert.areSame('d', table.getColumn([3, 0]).key);
        Y.Assert.areSame('e', table.getColumn([3, 1]).key);
    },

    "test moveColumn(string, number)": function () {
        var table = this.table;

        table.moveColumn('a', 2);

        Y.Assert.areSame('b', table.getColumn(0).key);
        Y.Assert.areSame('c', table.getColumn(1).key);
        Y.Assert.areSame('a', table.getColumn(2).key);
        Y.Assert.areSame('d', table.getColumn([3, 0]).key);
        Y.Assert.areSame('e', table.getColumn([3, 1]).key);
        Y.Assert.areSame(2, table.getColumn(3).children.length);

        table.moveColumn('d', 0);

        Y.Assert.areSame('d', table.getColumn(0).key);
        Y.Assert.areSame('b', table.getColumn(1).key);
        Y.Assert.areSame('c', table.getColumn(2).key);
        Y.Assert.areSame('a', table.getColumn(3).key);
        Y.Assert.areSame('e', table.getColumn([4, 0]).key);
        Y.Assert.areSame(1, table.getColumn(4).children.length);
    },

    "test moveColumn(number, number)": function () {
        var table = this.table;

        table.moveColumn(0, 2);

        Y.Assert.areSame('b', table.getColumn(0).key);
        Y.Assert.areSame('c', table.getColumn(1).key);
        Y.Assert.areSame('a', table.getColumn(2).key);
        Y.Assert.areSame('d', table.getColumn([3, 0]).key);
        Y.Assert.areSame('e', table.getColumn([3, 1]).key);
        Y.Assert.areSame(2, table.getColumn(3).children.length);
    },

    "test moveColumn([number, number], number)": function () {
        var table = this.table;

        table.moveColumn([3, 1], 0);

        Y.Assert.areSame('e', table.getColumn(0).key);
        Y.Assert.areSame('a', table.getColumn(1).key);
        Y.Assert.areSame('b', table.getColumn(2).key);
        Y.Assert.areSame('c', table.getColumn(3).key);
        Y.Assert.areSame('d', table.getColumn([4, 0]).key);
        Y.Assert.areSame(1, table.getColumn(4).children.length);
    },

    "test moveColumn(string, [number, number])": function () {
        var table = this.table;

        table.moveColumn('b', [3, 1]);

        Y.Assert.areSame('a', table.getColumn(0).key);
        Y.Assert.areSame('c', table.getColumn(1).key);
        Y.Assert.areSame('d', table.getColumn([2, 0]).key);
        Y.Assert.areSame('b', table.getColumn([2, 1]).key);
        Y.Assert.areSame('e', table.getColumn([2, 2]).key);
        Y.Assert.areSame(3, table.getColumn(2).children.length);
    },

    "test moveColumn(number, [number, number])": function () {
        var table = this.table;

        table.moveColumn(1, [3, 1]);

        Y.Assert.areSame('a', table.getColumn(0).key);
        Y.Assert.areSame('c', table.getColumn(1).key);
        Y.Assert.areSame('d', table.getColumn([2, 0]).key);
        Y.Assert.areSame('b', table.getColumn([2, 1]).key);
        Y.Assert.areSame('e', table.getColumn([2, 2]).key);
        Y.Assert.areSame(3, table.getColumn(2).children.length);
    },

    "test moveColumn([number, number], [number, number])": function () {
        var table = this.table;

        table.moveColumn([3, 1], [3, 0]);

        Y.Assert.areSame('a', table.getColumn(0).key);
        Y.Assert.areSame('b', table.getColumn(1).key);
        Y.Assert.areSame('c', table.getColumn(2).key);
        Y.Assert.areSame('e', table.getColumn([3, 0]).key);
        Y.Assert.areSame('d', table.getColumn([3, 1]).key);
        Y.Assert.areSame(2, table.getColumn(3).children.length);
    },

    "moveColumn event should fire": function () {
        var table = this.table,
            onFired = false,
            afterFired = false;

        table.on('moveColumn', function () {
            onFired = true;
        });
        table.after('moveColumn', function () {
            afterFired = true;
        });

        table.moveColumn('a', 2);

        Y.Assert.isTrue(onFired);
        Y.Assert.isTrue(afterFired);
    },

    "moveColumn event should have column and index": function () {
        var table = this.table,
            column, index;

        table.on('moveColumn', function (e) {
            column = e.column;
            index = e.index;
        });

        table.moveColumn('c', 3);

        Y.Assert.areSame('c', column);
        Y.Assert.areSame(3, index);
    },

    "moveColumn event should be preventable": function () {
        var table = this.table;

        table.on('moveColumn', function (e) {
            e.preventDefault();
        });

        table.moveColumn('a', 2);

        Y.Assert.areSame('a', table.getColumn(0).key);
        Y.Assert.areSame('b', table.getColumn(1).key);
        Y.Assert.areSame('c', table.getColumn(2).key);
        Y.Assert.areSame('d', table.getColumn([3, 0]).key);
        Y.Assert.areSame('e', table.getColumn([3, 1]).key);
        Y.Assert.areSame(2, table.getColumn(3).children.length);
    },

    "moveColumn event e.column modification should apply": function () {
        var table = this.table;

        table.on('moveColumn', function (e) {
            e.column = 'a';
        });

        table.moveColumn('b', 3);

        Y.Assert.areSame('b', table.getColumn(0).key);
        Y.Assert.areSame('c', table.getColumn(1).key);
        Y.Assert.areSame('d', table.getColumn([2, 0]).key);
        Y.Assert.areSame('e', table.getColumn([2, 1]).key);
        Y.Assert.areSame('a', table.getColumn(3).key);
    },

    "moveColumn event e.index modification should apply": function () {
        var table = this.table;

        table.on('moveColumn', function (e) {
            e.index = 0;
        });

        table.moveColumn('d', 2);

        Y.Assert.areSame('d', table.getColumn(0).key);
        Y.Assert.areSame('a', table.getColumn(1).key);
        Y.Assert.areSame('b', table.getColumn(2).key);
        Y.Assert.areSame('c', table.getColumn(3).key);
        Y.Assert.areSame('e', table.getColumn([4, 0]).key);
    },

    "moveColumn should be chainable": function () {
        Y.Assert.areSame(this.table, this.table.moveColumn('a', 2));
    }
}));

suite.add(new Y.Test.Case({
    name: "addRow",

    setUp: function () {
        this.table = new Y.DataTable({
            columns: [ 'a', 'b', 'c' ],
            data: [{ a: 1, b: 1, c: 1 }]
        });
    },

    tearDown: function () {
        this.table.destroy();
    },

    "addRow() should do nothing": function () {
        var table = this.table,
            count = table.data.size();

        table.after('*:add', function () {
            Y.Assert.fail("ModelList add event triggered");
        });

        table.addRow();

        Y.Assert.areSame(count, table.data.size());
    },

    "addRow(data) should create a new Model in the data": function () {
        var table = this.table,
            count = table.data.size();

        table.addRow({ a: 2, b: 2, c: 2 });

        Y.Assert.areSame(count + 1, table.data.size());
    },

    "addRow(data) should fire the data's add event": function () {
        var table = this.table,
            beforeFired, afterFired;

        table.on('*:add', function () {
            beforeFired = true;
        });
        table.after('*:add', function () {
            afterFired = true;
        });

        table.addRow({ a: 2, b: 2, c: 2 });

        Y.Assert.isTrue(beforeFired);
        Y.Assert.isTrue(afterFired);
    },

    "addRow(data, { sync: true }) should trigger Model sync": function () {
        var table = this.table,
            syncCalled;

        table.data.model.prototype.sync = function (action) {
            Y.Assert.areSame('create', action);
            syncCalled = true;
        };

        table.addRow({ a: 2, b: 2, c: 2 }, { sync: true });

        Y.Assert.isTrue(syncCalled);
    },

    "addRow(data) with autoSync:true should trigger Model sync": function () {
        var table = this.table,
            syncCalled;

        table.set('autoSync', true);

        table.data.model.prototype.sync = function (action) {
            Y.Assert.areSame('create', action);
            syncCalled = true;
        };

        table.addRow({ a: 2, b: 2, c: 2 });

        Y.Assert.isTrue(syncCalled);
    },

    "addRow(...) should be chainable": function () {
        Y.Assert.areSame(this.table, this.table.addRow({ a: 2, b: 2, c: 2 }));
    }
}));

suite.add(new Y.Test.Case({
    name: "addRows",

    setUp: function () {
        this.table = new Y.DataTable({
            columns: [ 'a', 'b', 'c' ],
            data: [{ a: 1, b: 1, c: 1 }]
        });
    },

    tearDown: function () {
        this.table.destroy();
    },

    "addRows() should do nothing": function () {
        var table = this.table,
            count = table.data.size();

        table.after('*:add', function () {
            Y.Assert.fail("ModelList add event triggered");
        });

        table.addRows();

        Y.Assert.areSame(count, table.data.size());
    },

    "addRows([data]) should create a new Model in the data": function () {
        var table = this.table,
            count = table.data.size();

        table.addRows([
            { a: 2, b: 2, c: 2 },
            { a: 3, b: 3, c: 3 }
        ]);

        Y.Assert.areSame(count + 2, table.data.size());
    },

    "addRows([data]) should fire the data's add event": function () {
        var table = this.table,
            beforeFired, afterFired;

        table.on('*:add', function () {
            beforeFired = true;
        });
        table.after('*:add', function () {
            afterFired = true;
        });

        table.addRows([
            { a: 2, b: 2, c: 2 },
            { a: 3, b: 3, c: 3 }
        ]);

        Y.Assert.isTrue(beforeFired);
        Y.Assert.isTrue(afterFired);
    },

    "addRows([data], { sync: true }) should trigger Model sync": function () {
        var table = this.table,
            syncCalled;

        table.data.model.prototype.sync = function (action) {
            Y.Assert.areSame('create', action);
            syncCalled = true;
        };

        table.addRows([
            { a: 2, b: 2, c: 2 },
            { a: 3, b: 3, c: 3 }
        ], { sync: true });

        Y.Assert.isTrue(syncCalled);
    },

    "addRows([data]) with autoSync:true should trigger Model sync": function () {
        var table = this.table,
            syncCalled;

        table.set('autoSync', true);

        table.data.model.prototype.sync = function (action) {
            Y.Assert.areSame('create', action);
            syncCalled = true;
        };

        table.addRows([
            { a: 2, b: 2, c: 2 },
            { a: 3, b: 3, c: 3 }
        ]);

        Y.Assert.isTrue(syncCalled);
    },

    "addRows(...) should be chainable": function () {
        Y.Assert.areSame(this.table, this.table.addRows([
            { a: 2, b: 2, c: 2 },
            { a: 3, b: 3, c: 3 }
        ]));
    }

}));

suite.add(new Y.Test.Case({
    name: "modifyRow",

    setUp: function () {
        this.table = new Y.DataTable({
            columns: [ 'a', 'b', 'c' ],
            data: [{ id: 'item1', a: 1, b: 1, c: 1 }]
        });
    },

    tearDown: function () {
        this.table.destroy();
    },

    "modifyRow() should do nothing": function () {
        var table = this.table,
            count = table.data.size();

        table.after('*:change', function () {
            Y.Assert.fail("ModelList change event triggered");
        });

        table.modifyRow();

        Y.Assert.areSame(count, table.data.size());
    },

    "modifyRow(index, data) should change the Model attributes": function () {
        var table = this.table,
            model = table.data.item(0);

        table.modifyRow(0, { a: 2, b: 2, c: 2 });

        Y.Assert.areSame(2, model.get('a'));
        Y.Assert.areSame(2, model.get('b'));
        Y.Assert.areSame(2, model.get('c'));
    },

    "modifyRow(id, data) should change the Model attributes": function () {
        var table = this.table,
            model = table.data.item(0);

        table.modifyRow(model.get('id'), { a: 2, b: 2, c: 2 });

        Y.Assert.areSame(2, model.get('a'));
        Y.Assert.areSame(2, model.get('b'));
        Y.Assert.areSame(2, model.get('c'));
    },

    "modifyRow(clientId, data) should change the Model attributes": function () {
        var table = this.table,
            model = table.data.item(0);

        table.modifyRow(model.get('clientId'), { a: 2, b: 2, c: 2 });

        Y.Assert.areSame(2, model.get('a'));
        Y.Assert.areSame(2, model.get('b'));
        Y.Assert.areSame(2, model.get('c'));
    },

    "modifyRow(model, data) should change the Model attributes": function () {
        var table = this.table,
            model = table.data.item(0);

        table.modifyRow(model, { a: 2, b: 2, c: 2 });

        Y.Assert.areSame(2, model.get('a'));
        Y.Assert.areSame(2, model.get('b'));
        Y.Assert.areSame(2, model.get('c'));
    },

    "modifyRow(index, data) should fire the model's change event": function () {
        var table = this.table,
            model = table.data.item(0),
            beforeFired, afterFired;

        table.on('*:change', function () {
            beforeFired = true;
        });
        table.after('*:change', function () {
            afterFired = true;
        });

        table.modifyRow(0, { a: 2, b: 2, c: 2 });

        Y.Assert.isTrue(beforeFired);
        Y.Assert.isTrue(afterFired);
    },

    "modifyRow(id, data) should fire the model's change event": function () {
        var table = this.table,
            model = table.data.item(0),
            beforeFired, afterFired;

        table.on('*:change', function () {
            beforeFired = true;
        });
        table.after('*:change', function () {
            afterFired = true;
        });

        table.modifyRow(model.get('id'), { a: 2, b: 2, c: 2 });

        Y.Assert.isTrue(beforeFired);
        Y.Assert.isTrue(afterFired);
    },

    "modifyRow(clientId, data) should fire the model's model event": function () {
        var table = this.table,
            model = table.data.item(0),
            beforeFired, afterFired;

        table.on('*:change', function () {
            beforeFired = true;
        });
        table.after('*:change', function () {
            afterFired = true;
        });

        table.modifyRow(model.get('clientId'), { a: 2, b: 2, c: 2 });

        Y.Assert.isTrue(beforeFired);
        Y.Assert.isTrue(afterFired);
    },

    "modifyRow(model, data) should fire the model's change event": function () {
        var table = this.table,
            model = table.data.item(0),
            beforeFired, afterFired;

        table.on('*:change', function () {
            beforeFired = true;
        });
        table.after('*:change', function () {
            afterFired = true;
        });

        table.modifyRow(model, { a: 2, b: 2, c: 2 });

        Y.Assert.isTrue(beforeFired);
        Y.Assert.isTrue(afterFired);
    },

    "modifyRow(index, data, { sync: true }) should trigger Model sync": function () {
        var table = this.table,
            model = table.data.item(0),
            syncCalled;

        table.data.model.prototype.sync = function (action) {
            Y.Assert.areSame('update', action);
            syncCalled = true;
        };

        table.modifyRow(0, { a: 2, b: 2, c: 2 }, { sync: true });

        Y.Assert.isTrue(syncCalled);
    },

    "modifyRow(id, data, { sync: true }) should trigger Model sync": function () {
        var table = this.table,
            model = table.data.item(0),
            syncCalled;

        table.data.model.prototype.sync = function (action) {
            Y.Assert.areSame('update', action);
            syncCalled = true;
        };

        table.modifyRow(model.get('id'), { a: 2, b: 2, c: 2 }, { sync: true });

        Y.Assert.isTrue(syncCalled);
    },

    "modifyRow(clientId, data, { sync: true }) should trigger Model sync": function () {
        var table = this.table,
            model = table.data.item(0),
            syncCalled;

        table.data.model.prototype.sync = function (action) {
            Y.Assert.areSame('update', action);
            syncCalled = true;
        };

        table.modifyRow(model.get('clientId'), { a: 2, b: 2, c: 2 }, { sync: true });

        Y.Assert.isTrue(syncCalled);
    },

    "modifyRow(model, data, { sync: true }) should trigger Model sync": function () {
        var table = this.table,
            model = table.data.item(0),
            syncCalled;

        table.data.model.prototype.sync = function (action) {
            Y.Assert.areSame('update', action);
            syncCalled = true;
        };

        table.modifyRow(model, { a: 2, b: 2, c: 2 }, { sync: true });

        Y.Assert.isTrue(syncCalled);
    },

    "modifyRow(index, data) with autoSync: true should trigger Model sync": function () {
        var table = this.table,
            model = table.data.item(0),
            syncCalled;

        table.set('autoSync', true);

        table.data.model.prototype.sync = function (action) {
            Y.Assert.areSame('update', action);
            syncCalled = true;
        };

        table.modifyRow(0, { a: 2, b: 2, c: 2 });

        Y.Assert.isTrue(syncCalled);
    },

    "modifyRow(id, data) with autoSync: true should trigger Model sync": function () {
        var table = this.table,
            model = table.data.item(0),
            syncCalled;

        table.set('autoSync', true);

        table.data.model.prototype.sync = function (action) {
            Y.Assert.areSame('update', action);
            syncCalled = true;
        };

        table.modifyRow(model.get('id'), { a: 2, b: 2, c: 2 });

        Y.Assert.isTrue(syncCalled);
    },

    "modifyRow(clientId, data) with autoSync: true should trigger Model sync": function () {
        var table = this.table,
            model = table.data.item(0),
            syncCalled;

        table.set('autoSync', true);

        table.data.model.prototype.sync = function (action) {
            Y.Assert.areSame('update', action);
            syncCalled = true;
        };

        table.modifyRow(model.get('clientId'), { a: 2, b: 2, c: 2 });

        Y.Assert.isTrue(syncCalled);
    },

    "modifyRow(model, data) with autoSync: true should trigger Model sync": function () {
        var table = this.table,
            model = table.data.item(0),
            syncCalled;

        table.set('autoSync', true);

        table.data.model.prototype.sync = function (action) {
            Y.Assert.areSame('update', action);
            syncCalled = true;
        };

        table.modifyRow(model, { a: 2, b: 2, c: 2 });

        Y.Assert.isTrue(syncCalled);
    },

    "modifyRow(...) should be chainable": function () {
        Y.Assert.areSame(this.table, this.table.modifyRow(0, { a: 2 }));
    }

}));

suite.add(new Y.Test.Case({
    name: "removeRow",

    setUp: function () {
        this.table = new Y.DataTable({
            columns: [ 'a', 'b', 'c' ],
            data: [
                { id: 'item1', a: 1, b: 1, c: 1 },
                { id: 'item2', a: 2, b: 2, c: 2 }
            ]
        });
    },

    tearDown: function () {
        this.table.destroy();
    },

    "removeRow() should do nothing": function () {
        var table = this.table,
            count = table.data.size();

        table.after('*:delete', function () {
            Y.Assert.fail("ModelList delete event triggered");
        });

        table.removeRow();

        Y.Assert.areSame(count, table.data.size());
    },

    "removeRow(index) should delete the Model": function () {
        var table = this.table,
            model = table.data.item(1),
            count = table.data.size();

        table.removeRow(0);

        Y.Assert.areSame(count - 1, table.data.size());
        Y.Assert.areSame(model, table.data.item(0));
    },

    "removeRow(id) should delete the Model attributes": function () {
        var table = this.table,
            model = table.data.item(1),
            count = table.data.size();

        table.removeRow(table.data.item(0).get('id'));

        Y.Assert.areSame(count - 1, table.data.size());
        Y.Assert.areSame(model, table.data.item(0));
    },

    "removeRow(clientId) should delete the Model attributes": function () {
        var table = this.table,
            model = table.data.item(1),
            count = table.data.size();

        table.removeRow(table.data.item(0).get('clientId'));

        Y.Assert.areSame(count - 1, table.data.size());
        Y.Assert.areSame(model, table.data.item(0));
    },

    "removeRow(model) should delete the Model attributes": function () {
        var table = this.table,
            model = table.data.item(1),
            count = table.data.size();

        table.removeRow(table.data.item(0));

        Y.Assert.areSame(count - 1, table.data.size());
        Y.Assert.areSame(model, table.data.item(0));
    },

    "removeRow(index) should fire the data's remove event": function () {
        var table = this.table,
            beforeFired, afterFired;

        table.on('*:remove', function () {
            beforeFired = true;
        });
        table.after('*:remove', function () {
            afterFired = true;
        });

        table.removeRow(0);

        Y.Assert.isTrue(beforeFired);
        Y.Assert.isTrue(afterFired);
    },

    "removeRow(id, data) should fire the data's remove event": function () {
        var table = this.table,
            model = table.data.item(0),
            beforeFired, afterFired;

        table.on('*:remove', function () {
            beforeFired = true;
        });
        table.after('*:remove', function () {
            afterFired = true;
        });

        table.removeRow(model.get('id'));

        Y.Assert.isTrue(beforeFired);
        Y.Assert.isTrue(afterFired);
    },

    "removeRow(clientId, data) should fire the data's remove event": function () {
        var table = this.table,
            model = table.data.item(0),
            beforeFired, afterFired;

        table.on('*:remove', function () {
            beforeFired = true;
        });
        table.after('*:remove', function () {
            afterFired = true;
        });

        table.removeRow(model.get('clientId'));

        Y.Assert.isTrue(beforeFired);
        Y.Assert.isTrue(afterFired);
    },

    "removeRow(model, data) should fire the data's remove event": function () {
        var table = this.table,
            model = table.data.item(0),
            beforeFired, afterFired;

        table.on('*:remove', function () {
            beforeFired = true;
        });
        table.after('*:remove', function () {
            afterFired = true;
        });

        table.removeRow(model);

        Y.Assert.isTrue(beforeFired);
        Y.Assert.isTrue(afterFired);
    },

    "removeRow(index, { sync: true }) should trigger Model sync": function () {
        var table = this.table,
            syncCalled;

        table.data.model.prototype.sync = function (action) {
            Y.Assert.areSame('delete', action);
            syncCalled = true;
        };

        table.removeRow(0, { sync: true });

        Y.Assert.isTrue(syncCalled);
    },

    "removeRow(id, { sync: true }) should trigger Model sync": function () {
        var table = this.table,
            model = table.data.item(0),
            syncCalled;

        table.data.model.prototype.sync = function (action) {
            Y.Assert.areSame('delete', action);
            syncCalled = true;
        };

        table.removeRow(model.get('id'), { sync: true });

        Y.Assert.isTrue(syncCalled);
    },

    "removeRow(clientId, { sync: true }) should trigger Model sync": function () {
        var table = this.table,
            model = table.data.item(0),
            syncCalled;

        table.data.model.prototype.sync = function (action) {
            Y.Assert.areSame('delete', action);
            syncCalled = true;
        };

        table.removeRow(model.get('clientId'), { sync: true });

        Y.Assert.isTrue(syncCalled);
    },

    "removeRow(model, { sync: true }) should trigger Model sync": function () {
        var table = this.table,
            model = table.data.item(0),
            syncCalled;

        table.data.model.prototype.sync = function (action) {
            Y.Assert.areSame('delete', action);
            syncCalled = true;
        };

        table.removeRow(model, { sync: true });

        Y.Assert.isTrue(syncCalled);
    },

    "removeRow(index) with autoSync: true should trigger Model sync": function () {
        var table = this.table,
            model = table.data.item(0),
            syncCalled;

        table.set('autoSync', true);

        table.data.model.prototype.sync = function (action) {
            Y.Assert.areSame('delete', action);
            syncCalled = true;
        };

        table.removeRow(0);

        Y.Assert.isTrue(syncCalled);
    },

    "removeRow(id) with autoSync: true should trigger Model sync": function () {
        var table = this.table,
            model = table.data.item(0),
            syncCalled;

        table.set('autoSync', true);

        table.data.model.prototype.sync = function (action) {
            Y.Assert.areSame('delete', action);
            syncCalled = true;
        };

        table.removeRow(model.get('id'));

        Y.Assert.isTrue(syncCalled);
    },

    "removeRow(clientId) with autoSync: true should trigger Model sync": function () {
        var table = this.table,
            model = table.data.item(0),
            syncCalled;

        table.set('autoSync', true);

        table.data.model.prototype.sync = function (action) {
            Y.Assert.areSame('delete', action);
            syncCalled = true;
        };

        table.removeRow(model.get('clientId'));

        Y.Assert.isTrue(syncCalled);
    },

    "removeRow(model) with autoSync: true should trigger Model sync": function () {
        var table = this.table,
            model = table.data.item(0),
            syncCalled;

        table.set('autoSync', true);

        table.data.model.prototype.sync = function (action) {
            Y.Assert.areSame('delete', action);
            syncCalled = true;
        };

        table.removeRow(model);

        Y.Assert.isTrue(syncCalled);
    },

    "removeRow(...) should be chainable": function () {
        Y.Assert.areSame(this.table, this.table.removeRow(0, { a: 2 }));
    }

}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['datatable-mutable', 'test']});
