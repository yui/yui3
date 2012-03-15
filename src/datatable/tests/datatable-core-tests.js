YUI.add('datatable-core-tests', function(Y) {

var suite = new Y.Test.Suite("datatable-core");

suite.add(new Y.Test.Case({
    name: "datatable-core",

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
    },

    "set('data', modelList) should fire a dataChange": function () {
        var Class = Y.Base.create('test-class', Y.Widget, [ Y.DataTable.Core ]),
            model = Y.Base.create('test-model', Y.Model, [], {}, {
                ATTRS: { a: {}, b: {}, c: {} } }),
            modelList = new Y.ModelList(),
            instance  = new Class({
                columns: ['a', 'b', 'c'],
                data: [{ a: 1, b: 1, c: 1 }]
            }),
            fired;

        instance.after('dataChange', function (e) {
            Y.Assert.areSame(modelList, e.newVal);
            fired = true;
        });

        modelList.model = model;
        modelList.add([{ a: 2, b: 2, c: 2 }]);

        Y.Assert.isInstanceOf(Y.ModelList, instance.data);
        Y.Assert.areSame(1, instance.data.item(0).get('a'));

        instance.set('data', modelList);

        Y.Assert.areSame(modelList, instance.data);
        Y.Assert.areSame(2, instance.data.item(0).get('a'));
        Y.Assert.isTrue(fired);
    },

    "syncUI should call render() on all views": function () {
        function View(config) {
            this.container = config.container;
            this.count = 0;
        }
        View.prototype = {
            render: function () { this.count++; },
            addTarget: function () {},
            get: function () { return this.container; }
        };

        var table = new (Y.Base.create('test', Y.Widget, [Y.DataTable.Core]))({
                columns: ['a'],
                data: [{ a: 1 }],
                headerView: View,
                bodyView: View,
                footerView: View
            }).render();
            
        Y.Assert.areSame(1, table.head.count);
        Y.Assert.areSame(1, table.body.count);
        Y.Assert.areSame(1, table.foot.count);

        table.syncUI();

        Y.Assert.areSame(2, table.head.count);
        Y.Assert.areSame(2, table.body.count);
        Y.Assert.areSame(2, table.foot.count);

        table.destroy();
    }


}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['widget', 'base-build', 'datatable-core']});
