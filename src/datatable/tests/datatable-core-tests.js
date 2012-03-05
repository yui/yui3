YUI.add('datatable-core-tests', function(Y) {

var suite = new Y.Test.Suite("Y.Plugin.DataTableSort");

suite.add(new Y.Test.Case({
    name: "DataTable.Core tests",

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

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['widget', 'base-build', 'datatable-core']});
