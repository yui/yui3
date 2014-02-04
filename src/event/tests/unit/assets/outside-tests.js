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
            var fired, handle;

            handle = node.on('clickoutside', function(e) {
                fired = true;
                Assert.areSame('clickoutside', e.type);
                Assert.areSame(node, e.currentTarget);
                Assert.areSame(body, e.target);
            });

            body.simulate('click');
            Assert.isTrue(fired);

            fired = false;
            node.one('.included').simulate('click');
            Assert.isFalse(fired);

            handle.detach();
        },

        'test: delegate without selector': function() {
            var fired, handle;

            handle = node.delegate('clickoutside', function(e) {
                fired = true;
                Assert.areSame('clickoutside', e.type);
                Assert.areSame(node, e.currentTarget, 'e.currentTarget should be the node');
                Assert.areSame(body, e.target, 'e.target should be the body element');
            });

            body.simulate('click');
            Assert.isTrue(fired);

            fired = false;
            node.simulate('click');
            Assert.isFalse(fired);

            fired = false;
            node.one('.included').simulate('click');
            Assert.isFalse(fired);

            handle.detach();
        },

        'test: delegate with selector': function() {
            var fired, handle, clickTarget,
                filter = '.included',
                included = node.one(filter),
                inIncludedDiv = node.one('.included div'),
                outIncludedDiv = node.one('.excluded div');

            handle = node.delegate('clickoutside', function(e) {
                fired = true;
                Assert.areSame('clickoutside', e.type);
                Assert.areSame(node, e.currentTarget, 'e.currentTarget should be the node');
                Assert.areSame(clickTarget, e.target, 'e.target should be the click target');
            }, filter);

            clickTarget = outIncludedDiv;
            outIncludedDiv.simulate('click');
            Assert.isTrue(fired);

            fired = false;
            clickTarget = node;
            node.simulate('click');
            Assert.isTrue(fired);

            fired = false;
            included.simulate('click');
            Assert.isFalse(fired);

            fired = false;
            inIncludedDiv.simulate('click');
            Assert.isFalse(fired);

            handle.detach();
        },
    }));

    Y.Test.Runner.add(suite);

});
