YUI.add('outside-tests', function(Y) {

    var suite = new Y.Test.Suite('Event: outside'),
    Assert = Y.Assert,
    noop = function() {},
    body = Y.one('body'),
    node = Y.one('#tester');


    //Only testing "clickoutside" since it's all the same logic.

    suite.add(new Y.Test.Case({
        name: 'outside events',
        'test: on': function() {
            var fired;
            var handle = node.on('clickoutside', function(e) {
                fired = true;
                Assert.areSame('clickoutside', e.type);
                Assert.areSame(node, e.currentTarget);
                Assert.areSame(body, e.target);
                handle.detach();
            });

            body.simulate('click');

            Assert.isTrue(fired);
        },
        'test: delegate': function() {
            var fired;
            var handle = node.delegate('clickoutside', function(e) {
                fired = true;
                Assert.areSame('clickoutside', e.type);
                Assert.areSame(node, e.currentTarget);
                Assert.areSame(body, e.target);
                handle.detach();
            });

            body.simulate('click');

        }
    }));

    Y.Test.Runner.add(suite);

});
