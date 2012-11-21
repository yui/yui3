YUI.add('node-view-tests', function(Y) {

    var suite = new Y.Test.Suite('node-view example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test click hide button': function() {
            Y.one('.example #hide').simulate('click');
            Assert.areEqual('none', Y.one('.example #demo').getComputedStyle('display'),'failed to hide node');
        },
        'test click show button': function() {
            Y.one('.example #show').simulate('click');
            Assert.areEqual('block', Y.one('.example #demo').getComputedStyle('display'),'failed to show node');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
