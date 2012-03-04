YUI.add('flick-tests', function(Y) {
 
    var eventData = {
            flick: Y.Node.DOM_EVENTS.flick.eventDef,
        },
        Assert = Y.Assert,
        noop = function() { },
        CE = {
            fire: noop
        },
        node = Y.one('#tester'),
        event = {
            target: node,
            currentTarget: node,
            touches: [
                {
                    pageX: 100,
                    pageY: 100,
                    clientX: 100,
                    clientY: 100,
                    screenX: 100,
                    screenY: 100
                }
            ]
        },
        suite = new Y.Test.Suite('Flick Event Suite');

    suite.add(new Y.Test.Case({
        name: 'flick',
        setUp: function() {
            this.handles = [];
            this.handles.push(node.on('flick', noop));
            this.handles.push(node.delegate('flick', noop));
        },
        tearDown: function() {
            Y.Array.each(this.handles, function(h) {
                h.detach();
            });
        },
        'test: _onStart()': function() {
            eventData.flick._onStart(event,node, {
                _extra: {
                    minTime: 5,
                    minDistance: 5
                }
            }, {
                fire: function(e) {
                    Assert.areSame(event.target, e.target);
                    Assert.areSame('flick', e.type);
                    Assert.areEqual(1, e.button);
                }
            });
        },
        'test: _onMove()': function() {
            var sub = { '_fs': { flick: { } } };
            eventData.flick._onMove(event,node, sub);
            Assert.isTrue((sub['_fs'].flick.time > 0));
        },
        'test: _onEnd()': function() {
            var en = event;
            en.changedTouches = en.touches;
            en.touches = [];

            eventData.flick._onEnd(en,node, {
                _fs: {
                    flick: {
                        time: ((new Date().getTime()) - 3000)
                    },
                    pageX: 5,
                    pageY: 5,
                    detach: noop
                },
                _fmh: {
                    detach: noop
                },
                _extra: {
                    axis: 'x',
                    minTime: 1,
                    minDistance: 0,
                    minVelocity: 0,
                    preventDefault: noop
                }
            }, {
                fire: function(e) {
                    Assert.areSame('flick', e.type);
                    Assert.isObject(e.flick);
                    Assert.areSame('x', e.flick.axis);
                    Assert.areSame(95, e.flick.distance);
                    Assert.isTrue((e.flick.time >- 3000));
                    Assert.areSame(0.03166666666666667, e.flick.velocity);
                    Assert.areSame(0, e.touches.length);
                    Assert.areSame(1, e.changedTouches.length);
                    Assert.areSame(node, e.target);
                    Assert.areSame(node, e.currentTarget);
                }
            });
        }
    }));



    Y.Test.Runner.add(suite);

});
