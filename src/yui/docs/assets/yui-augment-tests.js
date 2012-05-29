YUI.add('yui-augment-tests', function(Y) {

    var suite = new Y.Test.Suite('yui-augment example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'check button click': function() {
            var button = Y.one('#demo_btn'),
                before = Y.one('#demo').get('innerHTML');

            button.simulate('click');

            Assert.areNotEqual(Y.one('#demo').get('innerHTML'), before, 'Button click failed to execute example');
        },
        'check example output': function() {
            Assert.areEqual(Y.one('#demo_p1').get('innerHTML'), 'I was notified of an interesting moment: bar', 'Failed to render');
            Assert.areEqual(Y.one('#demo_p2').get('innerHTML'), 'I was also notified of an interesting moment: bar', 'Failed to render');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
