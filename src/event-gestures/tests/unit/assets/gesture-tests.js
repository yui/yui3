YUI.add('gesture-tests', function(Y) {
 
    var eventData = {
            start: Y.Node.DOM_EVENTS.gesturemovestart.eventDef,
            move: Y.Node.DOM_EVENTS.gesturemove.eventDef,
            end: Y.Node.DOM_EVENTS.gesturemoveend.eventDef
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
        suite = new Y.Test.Suite('Gesture Event Suite');

    suite.add(new Y.Test.Case({
        name: 'movestart',
        setUp: function() {
            this.handles = [];
            this.handles.push(node.on('gesturemovestart', noop));
            this.handles.push(node.delegate('gesturemovestart', noop));
        },
        tearDown: function() {
            Y.Array.each(this.handles, function(h) {
                h.detach();
            });

            eventData.start.detachDelegate(node, {
                "_dmsh": {
                    detach: noop
                }
            });
        },
        'test: _onStart()': function() {
            eventData.start._onStart(event,node, {
                _extra: {
                    minTime: 5,
                    minDistance: 5
                }
            }, {
                fire: function(e) {
                    Assert.areSame(event.target, e.target, 'Targets are not the same');
                    Assert.areSame('gesturemovestart', e.type, 'Event type not correct');
                    Assert.areEqual(1, e.button, 'e.button is not set');
                }
            });
        },
        'test: _start()': function() {
            eventData.start._start(event,node, {
                fire: function(e) {
                    Assert.areSame(event.target, e.target, 'Targets are not the same');
                    Assert.areSame('gesturemovestart', e.type, 'Event type not correct');
                    Assert.areEqual(1, e.button, 'e.button is not set');
                }
            });
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'move',
        setUp: function() {
            this.handles = [];
            this.handles.push(node.on('gesturemove', noop));
            this.handles.push(node.delegate('gesturemove', noop));
        },
        tearDown: function() {
            Y.Array.each(this.handles, function(h) {
                h.detach();
            });

            eventData.move.detachDelegate(node, {
                "_dmh": {
                    detach: noop
                }
            });
        },
        'test: _onMove()': function() {
            eventData.move._onMove(event,node, {
                _extra: {
                    minTime: 5,
                    minDistance: 5
                }
            }, {
                fire: function(e) {
                    Assert.areSame(event.target, e.target, 'Targets are not the same');
                    Assert.areSame('gesturemove', e.type, 'Event type not correct');
                    Assert.areEqual(1, e.button, 'e.button is not set');
                }
            });
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'moveend',
        setUp: function() {
            this.handles = [];
            this.handles.push(node.on('gesturemoveend', noop));
            this.handles.push(node.delegate('gesturemoveend', noop));
        },
        tearDown: function() {
            Y.Array.each(this.handles, function(h) {
                h.detach();
            });

            eventData.end.detachDelegate(node, {
                "_dmeh": {
                    detach: noop
                }
            });
        },
        'test: _onEnd()': function() {
            var en = event;
            en.changedTouches = en.touches;

            eventData.end._onEnd(en,node, {
                _extra: {
                    minTime: 5,
                    minDistance: 5
                }
            }, {
                fire: function(e) {
                    Assert.areSame(event.target, e.target, 'Targets are not the same');
                    Assert.areSame('gesturemoveend', e.type, 'Event type not correct');
                    Assert.areEqual(1, e.button, 'e.button is not set');
                }
            });
        }
    }));

    Y.Test.Runner.add(suite);

});
