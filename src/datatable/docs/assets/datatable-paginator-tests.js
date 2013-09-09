YUI.add('datatable-paginator-tests', function(Y) {

    var suite = new Y.Test.Suite('datatable-paginator'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'DataTable Paginator',

        'test clearing selection': function() {
            Assert.isTrue(false);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
