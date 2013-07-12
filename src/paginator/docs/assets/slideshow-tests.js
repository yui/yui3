YUI.add('slideshow-tests', function(Y) {

    var suite = new Y.Test.Suite('slideshow-tests');

    suite.add(new Y.Test.Case({
        name: 'slideshow',

        'test passes': function (){
            Y.Assert.isTrue(true);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'event', 'node-event-simulate' ] });
