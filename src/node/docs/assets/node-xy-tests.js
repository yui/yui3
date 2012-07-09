YUI.add('node-xy-tests', function(Y) {

    var suite = new Y.Test.Suite('node-xy example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test simulated clicking and #demo moving to XY': function() {
            Y.one('#demo').setXY([150, 250]);
            Assert.areEqual(150, Math.round(Y.one('#demo').getX()), 'failed to setX');
            Assert.areEqual(250, Math.round(Y.one('#demo').getY()), 'failed to setY');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
