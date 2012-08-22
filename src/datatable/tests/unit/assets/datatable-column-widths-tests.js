YUI.add('datatable-column-widths-tests', function(Y) {

var suite = new Y.Test.Suite("DataTable: Column Widths");

suite.add(new Y.Test.Case({
    name: "lifecycle and instantiation",

    "Y.DataTable should be augmented": function () {
        Y.Assert.isTrue(
            new Y.DataTable().hasImpl(Y.DataTable.ColumnWidths));
    },

    "Y.DataTable.Base should not be augmented": function () {
        Y.Assert.isFalse(
            new Y.DataTable.Base().hasImpl(Y.DataTable.ColumnWidths));
    },

    "Y.DataTable constructor should not error": function () {
        var table = new Y.DataTable({
            columns: ['a'],
            data: [{a:1}]
        });

        Y.Assert.isInstanceOf(Y.DataTable, table);
        Y.Assert.isTrue(table.hasImpl(Y.DataTable.ColumnWidths));

        table = new Y.DataTable({
            columns: [{ key: 'a', width: '100px' }],
            data: [{a:1}]
        });

        Y.Assert.isInstanceOf(Y.DataTable, table);
        Y.Assert.isTrue(table.hasImpl(Y.DataTable.ColumnWidths));
    }
}));

suite.add(new Y.Test.Case({
    name: "render",

    setUp: function () {
        this.plain = new Y.DataTable({
            columns: ['a', 'b', 'c'],
            data: [{ a: 'a', b: 'b', c: 'c' }]
        });

        this.withWidths = new Y.DataTable({
            columns: [
                { key: 'a', width: '100px' },
                { key: 'b' },
                { key: 'c', width: 200 }
            ],
            data: [{ a: 'a', b: 'b', c: 'c' }]
        });
    },

    tearDown: function () {
        this.plain.destroy();
        this.withWidths.destroy();
    },

    "colgroup should be added for all DataTables": function () {
       this.plain.render();

        Y.Assert.areSame(1, this.plain._tableNode.all('colgroup').size());
        Y.Assert.isInstanceOf(Y.Node, this.plain._colgroupNode);
        Y.Assert.areSame(3, this.plain._colgroupNode.all('col').size());

        this.withWidths.render();

        Y.Assert.areSame(1, this.withWidths._tableNode.all('colgroup').size());
        Y.Assert.isInstanceOf(Y.Node, this.withWidths._colgroupNode);
        Y.Assert.areSame(3, this.withWidths._colgroupNode.all('col').size());
    },

    "col width should be set from configuration": function () {
        var cols, cssText, width;

        this.withWidths.render();

        cols = this.withWidths._colgroupNode.all('col');

        cssText = cols.item(0)._node.style.cssText;
        width = (cssText.match(/\bwidth:\s*(\d+)px/i) || [])[1];

        // isString is sufficient to test that the regex matched numbers
        Y.Assert.isString(width);

        Y.Assert.isFalse(/width/i.test(cols.item(1)._node.style.cssText));

        cssText = cols.item(2)._node.style.cssText;
        width = (cssText.match(/\bwidth:\s*(\d+)px/i) || [])[1];

        // isString is sufficient to test that the regex matched numbers
        Y.Assert.isString(width);
    },

    "column changes should propagate to the <col>s": function () {
        var cols, width;

        this.withWidths.render();

        cols = this.withWidths._colgroupNode.all('col');
        width = cols.item(0).getStyle('width');

        this.withWidths.set('columns', [
            { key: 'a', width: '200px' },
            { key: 'b' }
        ]);

        cols = this.withWidths._colgroupNode.all('col');

        Y.Assert.areSame(2, cols.size());
        Y.Assert.areNotEqual(width, cols.item(0).getStyle('width'));
    }

}));

suite.add(new Y.Test.Case({
    name: "setColumnWidth",

    "test setColumnWidth": function () {
        var table = new Y.DataTable({
            columns: ['a', { key: 'b', width: '100px' }],
            data: [{ a: 'a', b: 'b' }]
        });

        Y.Assert.isUndefined(table.get('columns.a.width'));
        Y.Assert.areSame('100px', table.get('columns.b.width'));

        table.setColumnWidth('a', '200px');
        table.setColumnWidth('b', 300);

        Y.Assert.areSame('200px', table.get('columns.a.width'));
        Y.Assert.areSame('300px', table.get('columns.b.width'));
    },

    "setColumnWidth should be chainable": function () {
        var table = new Y.DataTable({
            columns: ['a', { key: 'b', width: '100px' }],
            data: [{ a: 'a', b: 'b' }]
        });

        Y.Assert.areSame(table, table.setColumnWidth('a', '100px'));
    }

}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['datatable-column-widths', 'test']});
