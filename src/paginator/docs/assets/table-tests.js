YUI.add('table-tests', function(Y) {

    var suite = new Y.Test.Suite('table-tests');

    suite.add(new Y.Test.Case({
        name: 'table',

        'test passes': function (){
            Y.Assert.isTrue(true);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'event', 'node-event-simulate' ] });
