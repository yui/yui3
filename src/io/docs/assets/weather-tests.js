YUI.add('weather-tests', function(Y) {

    var suite = new Y.Test.Suite('weather example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test initial render' : function() {
            //test to ensure an flash object for the io swf is added to the dom.
            Y.Assert.isNotNull(Y.DOM.byId('io_swf'), "An object for the io.swf should be in the dom.");
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
