YUI.add('search-tests', function(Y) {

    var suite = new Y.Test.Suite('search-tests');

    suite.add(new Y.Test.Case({
        name: 'search',

        'test passes': function (){
            Y.Assert.isTrue(true);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'event', 'node-event-simulate' ] });
