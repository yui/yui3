YUI.add('datatable-sort-tests', function(Y) {

var suite = new Y.Test.Suite("Y.Plugin.DataTableSort");

suite.add(new Y.Test.Case({
    name: "DataTableSort tests",

    "datatable-sort should not rely on a link in the template": function () {
        var table, link, th;
        
        table = new Y.DataTable.Base({
            columnset: [{ key: 'a', sortable: true }],
            recordset: [{ a: "a1" }, { a: "a2" }, { a: "a3" }]
        }).plug(Y.Plugin.DataTableSort);

        Y.one('#testbed').empty();

        table.render('#testbed');

        th = table._theadNode.one('th');

        Y.Assert.isInstanceOf(Y.Node, th);

        link = th.one('a');
        Y.Assert.isInstanceOf(Y.Node, link);

        // Should not error
        link.simulate('click');

        table.destroy();

        Y.one('#testbed').empty();

        table = new Y.DataTable.Base({
            columnset: [{ key: 'a', sortable: true }],
            recordset: [{ a: "a1" }, { a: "a2" }, { a: "a3" }]
        }).plug(Y.Plugin.DataTableSort, {
            trigger: {
                selector: 'th',
                event: 'click'
            },
            template: '{value}' // override the template with link
        });

        table.render('#testbed');

        th = table._theadNode.one('th');

        Y.Assert.isInstanceOf(Y.Node, th);

        link = th.one('a');
        Y.Assert.isNull(link);

        // Should not error
        th.simulate('click');

        table.destroy();

        Y.one('#testbed').empty();
    }

    // test direction classes
    // test trigger event
    // test unplug
}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['datatable-sort', 'test', 'node-event-simulate']});
