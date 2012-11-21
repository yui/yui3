YUI.add('node-xy-tests', function(Y) {

    var suite = new Y.Test.Suite('node-xy example test suite'),
        Assert = Y.Assert,
        closeEnough = function(expected, actual) {
            if (Math.abs(expected - actual) < 2) {
                return true;
            } else {
                return false;
            }
        };

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test simulated clicking and #demo moving to XY': function() {
            Y.one('#demo').setXY([150, 250]);

            Assert.isTrue((closeEnough(150, Math.round(Y.one('#demo').getX()))),' - Failed to move to correct X');
            Assert.isTrue((closeEnough(250, Math.round(Y.one('#demo').getY()))),' - Failed to move to correct Y');


//             Assert.areEqual(150, Math.round(Y.one('#demo').getX()), 'failed to setX');
//             Assert.areEqual(250, Math.round(Y.one('#demo').getY()), 'failed to setY');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });







