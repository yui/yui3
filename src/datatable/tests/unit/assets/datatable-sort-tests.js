YUI.add('datatable-sort-tests', function(Y) {

var suite = new Y.Test.Suite("DataTable: Sortable");

suite.add(new Y.Test.Case({
    name: "lifecycle and instantiation",

    "Y.DataTable should be augmented": function () {
        Y.Assert.isTrue(
            new Y.DataTable().hasImpl(Y.DataTable.Sortable));
    },

    "Y.DataTable.Base should not be augmented": function () {
        Y.Assert.isFalse(
            new Y.DataTable.Base().hasImpl(Y.DataTable.Sortable));
    },

    "Y.DataTable constructor should not error": function () {
        var table = new Y.DataTable({
            columns: ['a'],
            data: [{a:1}]
        });

        Y.Assert.isInstanceOf(Y.DataTable, table);
        Y.Assert.isTrue(table.hasImpl(Y.DataTable.Sortable));
    },

    "test sortable values": function () {
        var config = {
                columns: ['a'],
                data: [{a:1}]
            }, table;

        table = new Y.DataTable(config);

        Y.Assert.areSame('auto', table.get('sortable'));

        config.sortable = false;
        table = new Y.DataTable(config);

        Y.Assert.isFalse(table.get('sortable'));

        config.sortable = true;
        table = new Y.DataTable(config);

        Y.Assert.isTrue(table.get('sortable'));

        config.sortable = 'auto';
        table = new Y.DataTable(config);

        Y.Assert.areSame('auto', table.get('sortable'));

        config.sortable = ['a', 'b'];
        table = new Y.DataTable(config);

        Y.ArrayAssert.itemsAreSame(['a', 'b'], table.get('sortable'));

        /*
         * Commented out until #2528732 is fixed
        config.sortable = 'a';
        table = new Y.DataTable(config);

        Y.Assert.areSame('auto', table.get('sortable'));

        config.sortable = { a: -1 };
        table = new Y.DataTable(config);

        Y.Assert.areSame('auto', table.get('sortable'));
        */
    },

    "test set('sortable')": function () {
        var table = new Y.DataTable({
                columns: ['a'],
                data: [{a:1}]
            });

        Y.Assert.areSame('auto', table.get('sortable'));

        table.set('sortable', false);
        Y.Assert.isFalse(table.get('sortable'));

        table.set('sortable', ['a', 'b']);
        Y.ArrayAssert.itemsAreSame(['a', 'b'], table.get('sortable'));

        table.set('sortable', true);
        Y.Assert.isTrue(table.get('sortable'));

        table.set('sortable', 'a');
        Y.Assert.isTrue(table.get('sortable'));

        table.set('sortable', { a: -1 });
        Y.Assert.isTrue(table.get('sortable'));
    },

    "test sortBy values": function () {
        var config = {
                columns: ['a', 'b'],
                data: [{ a: 1, b: 1 }]
            }, table;

        table = new Y.DataTable(config);

        Y.Assert.isUndefined(table.get('sortBy'));

        config.sortBy = null;
        table = new Y.DataTable(config);

        Y.Assert.isNull(table.get('sortBy'));

        config.sortBy = 'a';
        table = new Y.DataTable(config);

        Y.Assert.areSame('a', table.get('sortBy'));

        config.sortBy = { a: -1 };
        table = new Y.DataTable(config);

        Y.Assert.isObject(table.get('sortBy'));
        Y.Assert.areSame(-1, table.get('sortBy').a);

        config.sortBy = ['a', 'b'];
        table = new Y.DataTable(config);

        Y.ArrayAssert.itemsAreSame(['a', 'b'], table.get('sortBy'));

        config.sortBy = [{ a: 1 }, { b: -1 }];
        table = new Y.DataTable(config);

        Y.Assert.areSame(1, table.get('sortBy')[0].a);
        Y.Assert.areSame(-1, table.get('sortBy')[1].b);
    },

    "test set('sortBy')": function () {
        var table = new Y.DataTable({
                columns: ['a', 'b'],
                data: [{ a:1, b: 1 }]
            });

        Y.Assert.isUndefined(table.get('sortBy'));

        table.set('sortBy', null);
        Y.Assert.isNull(table.get('sortBy'));

        table.set('sortBy', 'a');
        Y.Assert.areSame('a', table.get('sortBy'));

        table.set('sortBy', { a: -1 });
        Y.Assert.isObject(table.get('sortBy'));
        Y.Assert.areSame(-1, table.get('sortBy').a);

        table.set('sortBy', ['a', 'b']);
        Y.ArrayAssert.itemsAreSame(['a', 'b'], table.get('sortBy'));

        table.set('sortBy', [{ a: -1 }, { b: -1 }]);
        Y.Assert.areSame(-1, table.get('sortBy')[0].a);
        Y.Assert.areSame(-1, table.get('sortBy')[1].b);

        // TODO: test invalid values, non-existant columns
    }
}));

suite.add(new Y.Test.Case({
    name: "DataTable.Sortable tests",

    "test ui triggered sort": function () {
        var table, link, th;

        table = new Y.DataTable({
            columns: [{ key: 'a', sortable: true }],
            data: [{ a: "a1" }, { a: "a2" }, { a: "a3" }]
        }).render();

        th = table._theadNode.one('th');

        Y.Assert.isTrue(th.hasClass(table.getClassName('sortable', 'column')));

        // Should not error
        th.all('*').pop().simulate('click');

        Y.Assert.isArray(table.get('sortBy'));
        Y.Assert.areSame(1, table.get('sortBy')[0].a);

        table.destroy();
    },

    "sorting a column with null values should group the nulls": function () {
        var table = new Y.DataTable({
            columns: ['a', 'b'],
            data: [
                { a: 'a1', b: null },
                { a: null, b: 'b1' },
                { a: null, b: 'b4' },
                { a: 'a6', b: 'b3' },
                { a: 'a4', b: null },
                { a: 'a5', b: 'b6' }
            ],
            sortable: true
        });

        // Unsorted
        Y.Assert.isNull(table.data.item(0).get('b'));
        Y.Assert.isNull(table.data.item(1).get('a'));
        Y.Assert.isNull(table.data.item(2).get('a'));
        Y.Assert.isNull(table.data.item(4).get('b'));

        table.sort('a');

        Y.Assert.isNull(table.data.item(0).get('a'));
        Y.Assert.isNull(table.data.item(1).get('a'));
        Y.Assert.isNull(table.data.item(2).get('b'));
        Y.Assert.isNull(table.data.item(3).get('b'));

        table.toggleSort();

        Y.Assert.isNull(table.data.item(4).get('a'));
        Y.Assert.isNull(table.data.item(5).get('a'));
        Y.Assert.isNull(table.data.item(2).get('b'));
        Y.Assert.isNull(table.data.item(3).get('b'));

        table.sort('b');

        Y.Assert.isNull(table.data.item(2).get('a'));
        Y.Assert.isNull(table.data.item(4).get('a'));
        Y.Assert.isNull(table.data.item(0).get('b'));
        Y.Assert.isNull(table.data.item(1).get('b'));

        table.toggleSort();

        Y.Assert.isNull(table.data.item(1).get('a'));
        Y.Assert.isNull(table.data.item(3).get('a'));
        Y.Assert.isNull(table.data.item(4).get('b'));
        Y.Assert.isNull(table.data.item(5).get('b'));

        table.destroy();
    },


    // reverse sorting a column
    "reverse sorting a column": function () {
        var table = new Y.DataTable({
                columns: ['a', 'b'],
                data: [
                    { a: 'a1', b: null },
                    { a: null, b: 'b1' },
                    { a: null, b: 'b4' },
                    { a: 'a6', b: 'b3' },
                    { a: 'a4', b: null },
                    { a: 'a5', b: 'b6' }
                ],
                sortable: true
            }).render(),

            th = table._theadNode.one('th'),

            isSorted = th.hasClass('yui3-datatable-sorted'),

            sortedDescending;



        if (!isSorted) {
            th.simulate('click');
        }

        sortedDescending = th.hasClass('yui3-datatable-sorted-desc');

        // sort once
        th.simulate('click');

        Y.Assert.areSame(!sortedDescending, th.hasClass('yui3-datatable-sorted-desc'), 'sort once');

        // sort sort again
        th.simulate('click');

        Y.Assert.areSame(sortedDescending, th.hasClass('yui3-datatable-sorted-desc'), 'sort again.');

        // sort sort again
        th.simulate('click');

        Y.Assert.areSame(!sortedDescending, th.hasClass('yui3-datatable-sorted-desc'), 'sort yet again.');

        table.destroy();
    },

    // shift clicking the same column
    "shift clicking same column should only toggle the sort order, not add to array of sorted columns": function () {
        var table = new Y.DataTable({
                columns: ['a', 'b'],
                data: [
                    { a: 'a1', b: null },
                    { a: null, b: 'b1' },
                    { a: null, b: 'b4' },
                    { a: 'a6', b: 'b3' },
                    { a: 'a4', b: null },
                    { a: 'a5', b: 'b6' }
                ],
                sortable: true
            }).render(),

            th = table._theadNode.one('th'),
            td,

            isSorted = th.hasClass('yui3-datatable-sorted'),
            sortDir;



        if (!isSorted) {
            th.simulate('click');
        }

        sortedDescending = th.hasClass('yui3-datatable-sorted-desc');
        sortDir = table.get('sortBy')[0]['a'];
        Y.Assert.areSame(1, table.get('sortBy').length, 'initially sorted');

        // sort once
        th.simulate('click', { shiftKey: true });
        Y.Assert.areSame(1, table.get('sortBy').length, 'sort once');
        Y.Assert.areSame(-(sortDir), table.get('sortBy')[0]['a']);
        sortDir = table.get('sortBy')[0]['a'];

        // sort sort again
        th.simulate('click', { shiftKey: true });
        Y.Assert.areSame(1, table.get('sortBy').length, 'sort again.');
        Y.Assert.areSame(-(sortDir), table.get('sortBy')[0]['a']);


        // click next column and update ui for first column
        td = table._tbodyNode.one('td');
        Y.Assert.isTrue(td.hasClass('yui3-datatable-sorted'), 'first cell should have sorted class.');
        th.next().simulate('click');
        td = table._tbodyNode.one('td');
        Y.Assert.isFalse(td.hasClass('yui3-datatable-sorted'), 'first cell should not have sorted class any longer.');

        table.destroy();
    }

    // test sort state classes
    // test sort event
    // test sort(...)
    // test toggleSort(...)
}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['datatable-sort', 'test', 'node-event-simulate']});
