YUI.add('auto-search-tests', function(Y) {

    var suite = new Y.Test.Suite('auto-search-tests');

    suite.add(new Y.Test.Case({
        name: 'auto',

        'test passes': function (){
            Y.Assert.isTrue(true);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'event', 'node-event-simulate' ] });
