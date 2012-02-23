YUI.add('touch-tests', function(Y) {

    var suite = new Y.Test.Suite('Touch Event'),
    Assert = Y.Assert,
    noop = function() {},
    node = Y.one('#tester');

    suite.add(new Y.Test.Case({
        name: 'Touch',
        setUp: function() {
            var touches = [
                    {
                        target: node,
                        pageX: 100,
                        pageY: 100
                    }
                ];

            var event = new Y.DOMEventFacade({
                type: 'touch',
                target: node.getDOMNode(),
                scale: 1,
                rotation: 1,
                identifier: 'foobar',
                pageX: 100,
                pageY: 100,
                touches: touches,
                targetTouches: touches,
                changedTouches: touches
            }, node.getDOMNode());

            this.event = event;
        },
        'test: touch init': function() {
            var event = this.event;
            Assert.isFunction(event._touch);
        },
        'test: touch properties': function() {
            var event = this.event;
            Assert.areEqual('touch', event.type);
            Assert.areEqual(1, event.touches.length);
            Assert.areEqual(1, event.changedTouches.length);
            Assert.areEqual(1, event.targetTouches.length);
            Assert.isUndefined(event.shiftKey);
            Assert.areSame(1, event.scale);
            Assert.areSame(1, event.rotation);

        },
        'test: touch nodes': function() {
            var event = this.event;
            Assert.isInstanceOf(Y.Node, event.target);
            Assert.isInstanceOf(Y.Node, event.currentTarget);
            Assert.areSame(node, event.target);
            Assert.areSame(node, event.currentTarget);
            Assert.areSame(node.getDOMNode(), event._currentTarget);

        }
    }));

    Y.Test.Runner.add(suite);

});
