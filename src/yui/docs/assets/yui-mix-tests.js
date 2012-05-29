YUI.add('yui-mix-tests', function(Y) {

    var suite = new Y.Test.Suite('yui-mix example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'check button click': function() {
            var button = Y.one('#demo_btn'),
                before = Y.one('#demo_logger').get('innerHTML');

            button.simulate('click');

            Assert.areNotEqual(Y.one('#demo_logger').get('innerHTML'), before, 'Button click failed to execute example');
        },
        'check example output': function() {
            Assert.areEqual(Y.one('#demo_logger p').get('innerHTML'), 'PageController class constant = 12345, logged courtesy of object augmentation via Y.mix.', 'Failed to mix example');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
