YUI.add('datatable-scroll-tests', function(Y) {

var suite = new Y.Test.Suite("datatable-scroll"),
    keys = Y.Object.keys;

suite.add(new Y.Test.Case({
    name: "datatable-scroll",

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

    "Y.DataTable should be augmented": function () {
        Y.Assert.isTrue(
            new Y.DataTable().hasImpl(Y.DataTable.Scrollable));
    },

    "Y.DataTable.Base should not be augmented": function () {
        Y.Assert.isFalse(
            new Y.DataTable.Base().hasImpl(Y.DataTable.Scrollable));
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
