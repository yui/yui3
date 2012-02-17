YUI.add('datatable-scroll-tests', function(Y) {

var suite = new Y.Test.Suite("datatable-scroll"),
    keys = Y.Object.keys;

suite.add(new Y.Test.Case({
    name: "lifecycle and instantiation",

    "Y.DataTable should be augmented": function () {
        Y.Assert.isTrue(
            new Y.DataTable().hasImpl(Y.DataTable.Scrollable));
    },

    "Y.DataTable.Base should not be augmented": function () {
        Y.Assert.isFalse(
            new Y.DataTable.Base().hasImpl(Y.DataTable.Scrollable));
    },

    "Y.DataTable constructor should not error": function () {
        var table = new Y.DataTable({
            columns: ['a'],
            data: [{a:1}]
        });

        Y.Assert.isInstanceOf(Y.DataTable, table);
        Y.Assert.isTrue(table.hasImpl(Y.DataTable.Scrollable));
    },

    "test scrollable values": function () {
        var config = {
                columns: ['a'],
                data: [{a:1}]
            }, table;

        table = new Y.DataTable(config);

        Y.Assert.isFalse(table.get('scrollable'));

        config.scrollable = false;
        table = new Y.DataTable(config);

        Y.Assert.isFalse(table.get('scrollable'));

        config.scrollable = true;
        table = new Y.DataTable(config);

        Y.Assert.areSame('xy', table.get('scrollable'));

        config.scrollable = 'x';
        table = new Y.DataTable(config);

        Y.Assert.areSame('x', table.get('scrollable'));

        config.scrollable = 'y';
        table = new Y.DataTable(config);

        Y.Assert.areSame('y', table.get('scrollable'));

        config.scrollable = 'xy';
        table = new Y.DataTable(config);

        Y.Assert.areSame('xy', table.get('scrollable'));

        /*
         * Commented out until #2528732 is fixed
        config.scrollable = 'ab';
        table = new Y.DataTable(config);

        Y.Assert.isFalse(table.get('scrollable'));

        config.scrollable = ['x', 'y'];
        table = new Y.DataTable(config);

        Y.Assert.isFalse(table.get('scrollable'));

        config.scrollable = { x: true };
        table = new Y.DataTable(config);

        Y.Assert.isFalse(table.get('scrollable'));
        */
    },

    "test set('scrollable')": function () {
        var table = new Y.DataTable({
                columns: ['a'],
                data: [{a:1}]
            });

        Y.Assert.isFalse(table.get('scrollable'));

        table.set('scrollable', false);
        Y.Assert.isFalse(table.get('scrollable'));

        table.set('scrollable', true);
        Y.Assert.areSame('xy', table.get('scrollable'));

        table.set('scrollable', 'x');
        Y.Assert.areSame('x', table.get('scrollable'));

        table.set('scrollable', 'y');
        Y.Assert.areSame('y', table.get('scrollable'));

        table.set('scrollable', 'xy');
        Y.Assert.areSame('xy', table.get('scrollable'));

        table.set('scrollable', ['x','y']);
        Y.Assert.areSame('xy', table.get('scrollable'));

        table.set('scrollable', { x: true });
        Y.Assert.areSame('xy', table.get('scrollable'));

        table.set('scrollable', false);
        Y.Assert.isFalse(table.get('scrollable'));
    }
    // render()
    // destroy()

}));

Y.Test.Runner.add(suite);

suite = new Y.Test.Suite("y scrollable");

suite.add(new Y.Test.Case({
    name: "scrollTo",

    setUp: function () {
        var data = [], i;

        for (i = 0; i < 10; ++i) {
            data.push({ a: i, b: i, c: i });
        }

        this.shortData = data.slice();

        for (; i < 100; ++i) {
            data.push({ a: i, b: i, c: i });
        }

        this.longData = data;
    },

    "": function () {
    }
}));

suite.add(new Y.Test.Case({
    name: "y scroll",

    "": function () {
    }
}));

suite.add(new Y.Test.Case({
    name: "x scroll",

    "": function () {
    }
}));

suite.add(new Y.Test.Case({
    name: "xy scroll",

    "": function () {
    }
}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['datatable-scroll', 'test']});
