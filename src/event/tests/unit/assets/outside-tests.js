YUI.add('outside-tests', function(Y) {

    var suite = new Y.Test.Suite('Event: outside'),
    Assert = Y.Assert,
    noop = function() {},
    body = Y.one('body'),
    node = Y.one('#tester');


    // Only testing the full logic with "clickoutside" as it's always the same
    // "tapoutside" regression test just checks that the "has no method
    // 'isOutside'" error is fixed.

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

    suite.add(new Y.Test.Case({
        name: 'tapoutside event regression test',

        setUp: function () {
            Y.Event.defineOutside('tap');
        },

        'test: on': function() {
            var handle, that = this;

            handle = node.on('tapoutside', function (e) {
                that.resume(function () {
                    Assert.areSame('tapoutside', e.type);
                    Assert.areSame(node, e.currentTarget);
                    Assert.areSame(body, e.target);
                    handle.detach();
                });
            });

            body.simulateGesture('tap');

            this.wait();
        },

        'test: delegate': function() {
            var handle, that = this;

            handle = node.delegate('tapoutside', function (e) {
                that.resume(function () {
                    Assert.areSame('tapoutside', e.type);
                    Assert.areSame(node, e.currentTarget);
                    Assert.areSame(body, e.target);
                    handle.detach();
                });
            });

            body.simulateGesture('tap');
            this.wait();
        }

    }));

    Y.Test.Runner.add(suite);

});
