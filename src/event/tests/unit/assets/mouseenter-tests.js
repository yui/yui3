YUI.add('mouseenter-tests', function(Y) {

    var suite = new Y.Test.Suite('Event: mouseenter'),
    Assert = Y.Assert,
    noop = function() {},
    node = Y.one('#tester'),
    eventDef = {
        enter: Y.Node.DOM_EVENTS.mouseenter.eventDef,
        leave: Y.Node.DOM_EVENTS.mouseleave.eventDef
    };
    

    suite.add(new Y.Test.Case({
        name: 'mouseenter',
        setUp: function() {
            var handles = [];
            handles.push(node.on('mouseenter', noop));
            handles.push(node.on('mouseleave', noop));
            handles.push(node.delegate('mouseenter', noop));
            handles.push(node.delegate('mouseleave', noop));
            this.handles = handles;
        },
        tearDown: function() {
            Y.Array.each(this.handles, function(h) {
                h.detach();
            });
        },
        'test: _filterNotify': function() {
            var fired = false;
            eventDef.enter.filter = function() { return node; };
            eventDef.enter.args = [1, 2, 3]
            eventDef.enter._filterNotify(node, [{
                target: node,
                currentTarget: node
            }, {
                fire: function(e) {
                    fired = true;
                    Assert.isTrue(fired);
                    return false;
                }
            }], {});

            Assert.isTrue(fired);
        },
        'test: delegateDetach': function() {
            var fired = false;
            eventDef.enter.detachDelegate(node, {
                handle: {
                    detach: function() {
                        fired = true;
                        Assert.isTrue(fired);
                        return false;
                    }
                }
            });

            Assert.isTrue(fired);
        },
        'test: _notify': function() {
            var fired = false;
            eventDef.enter._node = Y.one('body');
            eventDef.enter._notify({
                relatedTarget: node
            }, 'fromElement', {
                fire: function() {
                    fired = true;
                    Y.Assert.isTrue(fired);
                }
            });
            Assert.isTrue(fired);
        }
    }));

    Y.Test.Runner.add(suite);

});
