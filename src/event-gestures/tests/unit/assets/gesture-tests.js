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
        getTouchAction = function(win) {
            var touchAction;
            if(win) {
                if("PointerEvent" in win) {
                    touchAction = "touchAction";
                } else if("msPointerEnabled" in win.navigator) {
                    touchAction = "msTouchAction";
                }
            }
            return touchAction;
        },
        TOUCH_ACTION = getTouchAction(Y.config.win),
        hasMsTouchActionSupport = (node.getDOMNode().style && (TOUCH_ACTION in node.getDOMNode().style)),
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
            ],
            _event: {}
        },

        eventNoTouch = {
            target: node,
            currentTarget: node,
            _event: {}
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

        'test: _onStart() without e.touches': function () {
            eventData.start._onStart(eventNoTouch,node, {
                _extra: {
                    minTime: 5,
                    minDistance: 5
                }
            }, {
                fire: function(e) {
                    Assert.areSame(eventNoTouch.target, e.target, 'Targets are not the same');
                    Assert.areSame('gesturemovestart', e.type, 'Event type not correct');                }
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
        },

        'test: stopPropagation should work as expected': function() {
            var currentEvent,
                mock = new Y.Mock(),
                node1 = Y.Node.create('<div />'),
                node2 = Y.Node.create('<div />');

            node2.append(node1);
            currentEvent = {
                currentTarget: node1,
                touches: event.touches,
                target: node1,
                _event: {}
            };

            eventData.start._start(currentEvent, node1, {
                fire: function(e) {
                    Assert.areSame('gesturemovestart', e.type, 'Event type not correct');
                    e.stopped = 1;
                }
            });

            Y.Mock.expect(mock, {
                callCount: 1,
                method: 'fire1',
                args: [Y.Mock.Value.Object]
            });
            eventData.start._start(currentEvent, node1, {fire: Y.bind(mock.fire1, mock)});
            Y.Mock.verify(mock);

            Y.Mock.expect(mock, {
                callCount: 0,
                method: 'fire2',
                args: [Y.Mock.Value.Object]
            });
            currentEvent.currentTarget = node2;
            eventData.start._start(currentEvent, node2, {fire: Y.bind(mock.fire2, mock)});
            Y.Mock.verify(mock);
        },

        'test: stopImmediatePropagation should work as expected': function() {
            var currentEvent,
                mock = new Y.Mock(),
                node1 = Y.Node.create('<div />'),
                node2 = Y.Node.create('<div />');

            node2.append(node1);
            currentEvent = {
                currentTarget: node1,
                touches: event.touches,
                target: node1,
                _event: {}
            };

            eventData.start._start(currentEvent, node1, {
                fire: function(e) {
                    Assert.areSame('gesturemovestart', e.type, 'Event type not correct');
                    e.stopped = 2;
                }
            });

            Y.Mock.expect(mock, {
                callCount: 0,
                method: 'fire1',
                args: [Y.Mock.Value.Object]
            });
            eventData.start._start(currentEvent, node1, {fire: Y.bind(mock.fire1, mock)});
            Y.Mock.verify(mock);

            Y.Mock.expect(mock, {
                callCount: 0,
                method: 'fire2',
                args: [Y.Mock.Value.Object]
            });
            currentEvent.currentTarget = node2;
            eventData.start._start(currentEvent, node2, {fire: Y.bind(mock.fire2, mock)});
            Y.Mock.verify(mock);
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
        },

        'test: _onMove() delegate': function() {
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

            }, Y.one('doc'));
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


    suite.add(new Y.Test.Case({
        name: 'mstouchaction',
        setUp: function() {
            this.handles = [];
            var elem = Y.Node.create('<div id="myNode"></div>');
            Y.one('body').append(elem);
        },
        tearDown: function() {
            Y.Array.each(this.handles, function(h) {
                h.detach();
            });

            Y.one('#myNode').remove();

            eventData.end.detachDelegate(node, {
                "_dmeh": {
                    detach: noop
                }
            });
            //reset the default touch action if no over-rides are provided to none
            Y.Event._DEFAULT_TOUCH_ACTION = 'none';
        },
        _should: {
            ignore: {
                'test: touchActions': !hasMsTouchActionSupport,
                'test: touchActions modify': !hasMsTouchActionSupport,
                'test: touchActions defaultModify': !hasMsTouchActionSupport,
                'test: touchActions multipleNodes': !hasMsTouchActionSupport,
                'test: touchActions document': !hasMsTouchActionSupport
            }
        },
        'test: touchActions': function () {

            var elem = Y.one('#myNode');
            var _node = elem.getDOMNode();

            //by default the touchaction property should be ""
            Assert.areEqual(_node.style[TOUCH_ACTION], '');

            this.handles.push(elem.on('gesturemovestart', noop));
            //After subscribing to gesturemovestart, the touchaction should be modified to 'none'
            Assert.areEqual(_node.style[TOUCH_ACTION], 'none');

            this.handles.push(elem.on('gesturemove', noop));
            //Subscribing to other gesture events should keep the touchaction to none
            Assert.areEqual(_node.style[TOUCH_ACTION], 'none');

            this.handles.push(elem.on('gesturemoveend', noop));
            Assert.areEqual(_node.style[TOUCH_ACTION], 'none');

            //Now we are going to detach all listeners
            Y.Array.each(this.handles, function(h) {
                h.detach();
            });
            //Upon detaching listeners, the touchAction should be back to ""
            Assert.areEqual(_node.style[TOUCH_ACTION], '');
        },

        'test: touchActions modify': function () {

            var elem = Y.one('#myNode'),
                _node = elem.getDOMNode(),
                flag = false;

            Assert.areSame(_node.style[TOUCH_ACTION], '');

            this.handles.push(node.on('gesturemovestart', noop));
            this.handles.push(node.on('gesturemove', noop));

            event.target = elem;
            event.currentTarget = elem;

            eventData.start._onStart(event,elem, {
                _extra: {
                    minTime: 5,
                    minDistance: 5
                }
            }, {
                fire: function(e) {
                    Assert.areSame(_node.style[TOUCH_ACTION], 'none');
                    flag = true;
                    _node.style[TOUCH_ACTION] = 'pan-x';
                }
            });

            eventData.move._onMove(event,elem, {
                _extra: {
                    minTime: 5,
                    minDistance: 5
                }
            }, {
                fire: function(e) {
                    Assert.isTrue(flag);
                    Assert.areSame(_node.style[TOUCH_ACTION], 'pan-x');
                }
            });

        },

        'test: touchActions defaultModify': function () {
            var elem = Y.one('#myNode'),
                _node = elem.getDOMNode();

            Assert.areSame(_node.style[TOUCH_ACTION], '');
            Y.Event._DEFAULT_TOUCH_ACTION = 'pan-x';
            this.handles.push(elem.on('gesturemovestart', noop));
            this.handles.push(elem.on('gesturemove', noop));
            this.handles.push(elem.on('gesturemoveend', noop));

            Assert.areSame('pan-x', _node.style[TOUCH_ACTION]);

            var h = this.handles.pop();
            h.detach();

            Assert.areSame('pan-x', _node.style[TOUCH_ACTION]);

            Y.Array.each(this.handles, function(h) {
                h.detach();
            });

            Assert.areSame('', _node.style[TOUCH_ACTION]);

        },

        'test: touchActions multipleNodes': function () {
            var elem1 = Y.one('#myNode'),
                _node1 = elem1.getDOMNode(),
                elem2,
                _node2;

            elem2 = Y.Node.create("<div id='myNode2'></div>");
            Y.one("body").append(elem2);
            _node2 = elem2.getDOMNode();



            Assert.areSame(_node1.style[TOUCH_ACTION], '');
            Assert.areSame(_node2.style[TOUCH_ACTION], '');

            this.handles.push(elem1.on('gesturemovestart', noop));
            this.handles.push(elem1.on('gesturemove', noop));
            this.handles.push(elem1.on('gesturemoveend', noop));

            Assert.areSame(_node1.style[TOUCH_ACTION], 'none');
            Assert.areSame(_node2.style[TOUCH_ACTION], '');

            var h = this.handles.pop();
            h.detach();

            Assert.areSame(_node1.style[TOUCH_ACTION], 'none');
            Assert.areSame(_node2.style[TOUCH_ACTION], '');

            Y.Array.each(this.handles, function(h) {
                h.detach();
            });

            Assert.areSame(_node1.style[TOUCH_ACTION], '');
            Assert.areSame(_node2.style[TOUCH_ACTION], '');

            this.handles.push(elem2.on('gesturemovestart', noop));

            Assert.areSame(_node1.style[TOUCH_ACTION], '');
            Assert.areSame(_node2.style[TOUCH_ACTION], 'none');

            this.handles.push(elem2.on('gesturemove', noop));
            this.handles.push(elem2.on('gesturemoveend', noop));

            Assert.areSame(_node1.style[TOUCH_ACTION], '');
            Assert.areSame(_node2.style[TOUCH_ACTION], 'none');

            Y.Array.each(this.handles, function(h) {
                h.detach();
            });

            Assert.areSame(_node1.style[TOUCH_ACTION], '');
            Assert.areSame(_node2.style[TOUCH_ACTION], '');

            Y.one('#myNode2').remove();

        },

        'test: touchActions document': function () {
            var doc = Y.one('doc'),
                docElem = doc.getDOMNode().documentElement;
            Assert.areSame(docElem.style[TOUCH_ACTION], '');

            this.handles.push(doc.on('gesturemovestart', noop));
            Assert.areNotSame(docElem.style[TOUCH_ACTION], 'none');

            this.handles.push(doc.on('gesturemove', noop));
            Assert.areNotSame(docElem.style[TOUCH_ACTION], 'none');

            this.handles.push(doc.on('gesturemoveend', noop));
            Assert.areNotSame(docElem.style[TOUCH_ACTION], 'none');

            var h = this.handles.pop();
            h.detach();

            Assert.areNotSame(docElem.style[TOUCH_ACTION], 'none');

            Y.Array.each(this.handles, function(h) {
                h.detach();
            });
            Assert.areSame(docElem.style[TOUCH_ACTION], '');


        }

    }));

    Y.Test.Runner.add(suite);

}, '', {requires:['test', 'node']});
