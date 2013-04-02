YUI.add('flick-tests', function(Y) {
 
    var eventData = {
            flick: Y.Node.DOM_EVENTS.flick.eventDef
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
                    Assert.areSame(event.target, e.target, 'Target not set properly');
                    Assert.areSame('flick', e.type, 'Event type is wrong');
                    Assert.areEqual(1, e.button, 'e.button is not set');
                }
            });
        },
        'test: _onMove()': function() {
            var sub = { '_fs': { flick: { } } };
            eventData.flick._onMove(event,node, sub);
            Assert.isTrue((sub._fs.flick.time > 0), 'Flick time was not set on move');
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
                    Assert.areSame('flick', e.type, 'Event type is incorrect');
                    Assert.isObject(e.flick, 'e.click is not an Object');
                    Assert.areSame('x', e.flick.axis, 'flick axis is not X');
                    Assert.areSame(95, e.flick.distance, 'Did not flick the proper distance');
                    Assert.isTrue((e.flick.time >- 3000), 'flick time is not set properly');
                    Assert.isTrue((e.flick.velocity >= 0.020), 'Failed to move in the proper velocity');
                    Assert.areSame(0, e.touches.length, 'e.touches.length should be 0');
                    Assert.areSame(1, e.changedTouches.length, 'e.changedTouches.length should be 1');
                    Assert.areSame(node, e.target, 'Event target is not set properly');
                    Assert.areSame(node, e.currentTarget, 'Event currentTarget is not set properly');
                }
            });
        }
    }));



    Y.Test.Runner.add(suite);

});
