YUI.add('node-view-tests', function(Y) {

    var suite = new Y.Test.Suite('node-view example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test click hide button': function() {
            Y.one('.example #hide').simulate('click');
            Assert.areEqual('true', Y.one('.example #demo').getAttribute('hidden'),'failed to hide node');
        },
        'test click show button': function() {
            Y.one('.example #show').simulate('click');
            Assert.areEqual('', Y.one('.example #demo').getAttribute('hidden'),'failed to show node');
        },
        'test click toggle button': function() {
            var node    = Y.one('.example #demo'),
                button  = Y.one('.example #toggle');

            node.removeAttribute('hidden');

            button.simulate('click');
            Assert.areEqual('true', node.getAttribute('hidden'),'failed to show node');

            button.simulate('click');
            Assert.areEqual('', node.getAttribute('hidden'),'failed to hide node');

        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
