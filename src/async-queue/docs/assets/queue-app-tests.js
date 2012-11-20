YUI.add('queue-app-tests', function(Y) {

    var suite = new Y.Test.Suite('queue-app example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',

        'check button click': function() {
            var button = Y.one('#init'),
                before = Y.one('#demo').getHTML(),
                test   = this;

            button.simulate('click');

            Assert.areEqual(Y.one('#demo').getHTML(), before,
                'UI update should happen asynchronously');

            // Account for artificial timeouts in the render process
            setTimeout(function () {
                test.resume(function () {
                    Assert.areNotEqual(before,
                        Y.one('#demo').getHTML(),
                        'Button click failed to execute example');
                });
            }, 2000); // 2000 is arbitrary, but > 1400ms delays from example src

            this.wait();
        },

        'check example output': function() {
            var demo = Y.one('#demo');

            Assert.areEqual('[ App content here ]',
                demo.one('.yui3-content').get('text'),
                'Failed to render');

            Assert.areEqual('App initialized',
                demo.one('.yui3-status').getHTML(),
                'Failed to render');

            Assert.areSame('Re-initialize Application',
                Y.one('#init').get('text'),
                'Failed to update button text');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
