YUI.add('datatable-base-tests', function(Y) {

var suite = new Y.Test.Suite("datatable-base");

suite.add(new Y.Test.Case({
    name: "DataTable.Base tests",

    setUp: function () {
        this.table = new Y.DataTable.Base();
    },

    "DataTable.Base should implement Core": function () {
        Y.assert(this.table.hasImpl(Y.DataTable.Core));
    },

    "DataTable.Base should set default bodyView": function () {
        Y.Assert.isFunction(this.table.get('bodyView'));
    },

    "DataTable.Base should set default headerView": function () {
        Y.Assert.isFunction(this.table.get('headerView'));
    },

    "DataTable.Base should not set default footerView": function () {
        Y.Assert.isUndefined(this.table.get('footerView'));
    },

    "DataTable.Base should preserve properties on the namespace": function () {
        var assert = Y.Assert;

        YUI.add('test-dt-namespace-is-preserved', function (Y) {
            assert.isUndefined(Y.DataTable);
            Y.namespace('DataTable').testProperty = true;
        });

        YUI().use('test-dt-namespace-is-preserved', function (Y) {
            assert.isObject(Y.DataTable);
            assert.isFalse(Y.Lang.isFunction(Y.DataTable));

            Y.use('datatable-base', function () {
                assert.isFunction(Y.DataTable);
                assert.isFunction(Y.DataTable.Base);
                assert.isTrue(Y.DataTable.testProperty);
            });
        });
    }

}));

suite.add(new Y.Test.Case({
    name: "DataTable tests",

    setUp: function () {
        this.table = new Y.DataTable();
    },

    "DataTable should implement Core": function () {
        Y.assert(this.table.hasImpl(Y.DataTable.Core));
    },

    "DataTable should be a subclass of Y.DataTable.Base": function () {
        Y.assert(this.table.hasImpl(Y.DataTable.Core));
    },

    "DataTable should default bodyView": function () {
        Y.Assert.isFunction(this.table.get('bodyView'));
    },

    "DataTable should default headerView": function () {
        Y.Assert.isFunction(this.table.get('headerView'));
    },

    "DataTable should not have default footerView": function () {
        Y.Assert.isUndefined(this.table.get('footerView'));
    }

}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['datatable-base', 'test']});
