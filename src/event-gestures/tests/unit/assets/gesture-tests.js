YUI.add('gesture-tests', function(Y) {

    var eventData = {
            start: Y.Node.DOM_EVENTS.gesturemovestart.eventDef,
            move: Y.Node.DOM_EVENTS.gesturemove.eventDef,
            end: Y.Node.DOM_EVENTS.gesturemoveend.eventDef
        },
        Assert = Y.Assert,
        noop = function() { },
        resetEvents = function () {
            event = {
                target: node,
                currentTarget: node,
                type: "touchstart",
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

            moveEvent = {
                target: node,
                currentTarget: node,
                type: "mousemove",
                pageX: 201,
                pageY: 100,
                clientX: 201,
                clientY: 100,
                screenX: 201,
                screenY: 100
            },

            moveEvent2 = {
                target: node,
                currentTarget: node,
                type: "mousemove",
                pageX: 111,
                pageY: 110,
                clientX: 111,
                clientY: 110,
                screenX: 111,
                screenY: 110
            },

            moveEventMSPointer = {
                target: node,
                currentTarget: node,
                type: "MSPointerMove",
                pageX: 201,
                pageY: 100,
                clientX: 201,
                clientY: 100,
                screenX: 201,
                screenY: 100
            },

            eventNoTouch = {
                target: node,
                currentTarget: node,
                type: "mousedown",
                pageX: 101,
                pageY: 101,
                clientX: 101,
                clientY: 101,
                screenX: 101,
                screenY: 101
            };

            eventMSPointer = {
                target: node,
                currentTarget: node,
                type: "MSPointerDown",
                pageX: 100,
                pageY: 100,
                clientX: 100,
                clientY: 100,
                screenX: 100,
                screenY: 100
            };

            endEventMSPointer = {
                target: node,
                currentTarget: node,
                type: "MSPointerUp",
                pageX: 100,
                pageY: 100,
                clientX: 100,
                clientY: 100,
                screenX: 100,
                screenY: 100
            }
        },
        CE = {
            fire: noop
        },
        node = Y.one('#tester'),
        hasMsTouchActionSupport = (node.getDOMNode().style && ("msTouchAction" in node.getDOMNode().style)),
        event = {},
        moveEvent = {},
        moveEvent2 = {},
        eventNoTouch = {},
        eventMSPointer = {},
        moveEventMSPointer = {},
        endEventMSPointer = {},
        suite = new Y.Test.Suite('Gesture Event Suite');

    suite.add(new Y.Test.Case({
        name: 'movestart',
        setUp: function() {
            this.handles = [];
            this.handles.push(node.on('gesturemovestart', noop));
            this.handles.push(node.delegate('gesturemovestart', noop));
            resetEvents();
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
        'test: _onStart() with no params': function() {
            var flag = false;
            var retVal;
            eventData.start._onStart(event,node, {
                _extra: {
                    minTime: 0,
                    minDistance: 0
                }
            }, {
                fire: function(e) {
                    flag = true;
                    retVal = e;
                }
            });
            Assert.isTrue(flag);
            Assert.areSame(event.target, retVal.target, 'Targets are not the same');
            Assert.areSame('gesturemovestart', retVal.type, 'Event type not correct');
        },

        'test: _onStart() with minTime only': function() {
            var flag = false;
            var retVal;
            eventData.start._onStart(event,node, {
                _extra: {
                    minTime: 1000,
                    minDistance: 0
                }
            }, {
                fire: function(e) {
                    flag = true;
                    retVal = e;
                }
            });

            //The event should not fire right away.
            Assert.isFalse(flag, 'Event should not fire before 1000 ms');

            //since the default hold duration is 500ms, we'll do something at 550ms.
            this.wait(function(){
                Assert.isTrue(flag);
                Assert.areSame(event.target, retVal.target, 'Targets are not the same');
                Assert.areSame('gesturemovestart', retVal.type, 'Event type not correct');
            }, 1100);
        },

        'test: _onStart() with minDistance only': function() {
            var flag = false;
            var retVal;
            eventData.start._onStart(event,node, {
                _extra: {
                    minDistance: 100,
                    minTime: 0
                }
            }, {
                fire: function(e) {
                    flag = true;
                    retVal = e;
                }
            });

            //The event should not fire right away.
            Assert.isFalse(flag, 'Event should not fire before distance threshold');

        },

        'test: _onStart() with minDistance and not sufficient movement': function() {
            var flag = false;
            var retVal;
            eventData.start._onStart(eventNoTouch,node, {
                _extra: {
                    minDistance: 400,
                    minTime: 0
                }
            }, {
                fire: function(e) {
                    flag = true;
                    retVal = e;
                }
            });

            Assert.isFalse(flag, 'Event should not fire before distance threshold');

            //fire a touchMove event
            Y.Event.simulate(node.getDOMNode(), 'mousemove', moveEvent2);
            Assert.isFalse(flag, 'Event should not fire since minDistance threshold was not met');
            Assert.isUndefined(retVal);
        },

        'test: _onStart() with minDistance and sufficient movement': function() {
            var flag = false;
            var retVal;
            eventData.start._onStart(eventNoTouch,node, {
                _extra: {
                    minDistance: 75,
                    minTime: 0
                }
            }, {
                fire: function(e) {
                    flag = true;
                    retVal = e;
                }
            });

            Assert.isFalse(flag, 'Event should not fire before distance threshold');

            //fire a touchMove event
            if (hasMsTouchActionSupport) {
                Y.Event.simulate(node.getDOMNode(), 'MSPointerMove', moveEventMSPointer);
            }
            else {
                Y.Event.simulate(node.getDOMNode(), 'mousemove', moveEvent);
            }
            Assert.isTrue(flag, 'Event should fire after minDistance threshold is met');
            Assert.areSame(eventNoTouch.target, retVal.target, 'Targets are not the same');
            Assert.areSame('gesturemovestart', retVal.type, 'Event type not correct');
        },

        'test: _onStart() with minDistance and end event': function() {
            var flag = false;
            var retVal;
            eventData.start._onStart(eventNoTouch,node, {
                _extra: {
                    minDistance: 75,
                    minTime: 0
                }
            }, {
                fire: function(e) {
                    flag = true;
                    retVal = e;
                }
            });

            Assert.isFalse(flag, 'Event should not fire before distance threshold');

            //fire an end event
            if (hasMsTouchActionSupport) {
                Y.Event.simulate(node.getDOMNode(), 'MSPointerUp', endEventMSPointer);
            }
            else {
                Y.Event.simulate(node.getDOMNode(), 'mouseup', moveEvent2);
            }
            Assert.isFalse(flag, 'Event should not fire before distance threshold');
        },

        'test: _onStart() with minTime and minDistance': function() {
            var flag = false;
            var retVal;
            eventData.start._onStart(eventNoTouch,node, {
                _extra: {
                    minTime: 500,
                    minDistance: 75
                }
            }, {
                fire: function(e) {
                    flag = true;
                    retVal = e;
                }
            });

            Assert.isFalse(flag, 'Event should not fire before distance and time thresholds');

            //fire a touchmove to set up Y.later call
            if (hasMsTouchActionSupport) {
                Y.Event.simulate(node.getDOMNode(), 'MSPointerMove', moveEventMSPointer);
            }
            else {
                Y.Event.simulate(node.getDOMNode(), 'mousemove', moveEvent);
            }
            Assert.isFalse(flag, 'Event should not fire before time threshold');
            this.wait(function(){
                Assert.isTrue(flag);
                Assert.areSame(eventNoTouch.target, retVal.target, 'Targets are not the same');
                Assert.areSame('gesturemovestart', retVal.type, 'Event type not correct');
            }, 600);


        },

        'test: _onStart() with minDistance and minTime and end event': function() {
            var flag = false;
            var retVal;
            eventData.start._onStart(eventNoTouch,node, {
                _extra: {
                    minDistance: 100,
                    minTime: 5000
                }
            }, {
                fire: function(e) {
                    flag = true;
                    retVal = e;
                }
            });

            Assert.isFalse(flag, 'Event should not fire before distance threshold');

            //fire an end event
            if (hasMsTouchActionSupport) {
                Y.Event.simulate(node.getDOMNode(), 'MSPointerUp', endEventMSPointer);
            }
            else {
                Y.Event.simulate(node.getDOMNode(), 'mouseup', moveEvent2);
            }
            Assert.isFalse(flag, 'Event should not fire before distance threshold');
        },

        'test: _onStart() with preventDefault': function() {
            var flag = false;
            var prevDefaultFlag = false;
            var retVal;
            var customEvent = event;

            customEvent.preventDefault = function () {
                prevDefaultFlag = true;
            };

            eventData.start._onStart(customEvent,node, {
                _extra: {
                    minDistance: 0,
                    minTime: 0,
                    preventDefault: true
                }
            }, {
                fire: function(e) {
                    flag = true;
                    retVal = e;
                }
            });

            //The event should not fire right away.
            Assert.isTrue(flag, 'Event should have fired');
            Assert.isTrue(prevDefaultFlag, 'event.preventDefault() should be called');
            Assert.areSame(customEvent.target, retVal.target, 'Targets are not the same');
            Assert.areSame('gesturemovestart', retVal.type, 'Event type not correct');
        },


        'test: _start() with touch': function() {
            var flag = false,
                retVal,
                _htFlag = false,
                _hmFlag = false,
                _hmeFlag = false,
                _ht = {
                    cancel: function () {
                        _htFlag = true;
                    }
                },

                _hm = {
                    detach: function () {
                        _hmFlag = true;
                    }
                },

                _hme = {
                    detach: function () {
                        _hmeFlag = true;
                    }
                };

            eventData.start._start(event,node, {}, {
                fire: function(e) {
                    flag = true;
                    retVal = e;
                }
            }, {
                _ht: _ht,
                _hme: _hme,
                _hm: _hm
            });

            Assert.isTrue(_hmFlag, 'cancel() not called');
            Assert.isTrue(_htFlag, 'cancel() not called');
            Assert.isTrue(_hmeFlag, 'cancel() not called');
            Assert.isTrue(flag, 'gesturemovestart not fired');
            Assert.areSame('gesturemovestart', retVal.type, 'Event type not correct');

        }
    }));

    suite.add(new Y.Test.Case({
        name: 'move',
        setUp: function() {
            this.handles = [];
            this.handles.push(node.on('gesturemove', noop));
            this.handles.push(node.delegate('gesturemove', noop));
            resetEvents();
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
            var flag = false,
            retVal;
            eventData.move._onMove(event,node, {
                _extra: {}
            }, {
                fire: function(e) {
                    flag = true;
                    retVal = e;
                }
            });
            Assert.isTrue(flag, 'gesturemove should fire')
            Assert.areSame(event.target, retVal.target, 'Targets are not the same');
            Assert.areSame('gesturemove', retVal.type, 'Event type not correct');
        },

        'test: _onMove() with mouse and preventMouse = true': function() {
            var flag = false,
            retVal;
            eventData.move._onMove(eventNoTouch,node, {
                _extra: {},
                preventMouse: true
            }, {
                fire: function(e) {
                    flag = true;
                    retVal = e;
                }
            });
            Assert.isFalse(flag, 'gesturemove should not fire');
            Assert.isUndefined(retVal, 'gesturemove should not fire');
        },

        'test: _onMove() with mouse and preventMouse = false': function() {
            var flag = false,
            retVal;
            eventData.move._onMove(eventNoTouch,node, {
                _extra: {}
            }, {
                fire: function(e) {
                    flag = true;
                    retVal = e;
                }
            });
            Assert.isTrue(flag, 'gesturemove should fire');
            Assert.areSame(event.target, retVal.target, 'Targets are not the same');
            Assert.areSame('gesturemove', retVal.type, 'Event type not correct');
        },

        'test: _onMove() with MSPointer': function() {
            var flag = false,
            retVal;
            eventData.move._onMove(eventMSPointer,node, {
                _extra: {}
            }, {
                fire: function(e) {
                    flag = true;
                    retVal = e;
                }
            });
            Assert.isTrue(flag, 'gesturemove should fire');
            Assert.areSame(event.target, retVal.target, 'Targets are not the same');
            Assert.areSame('gesturemove', retVal.type, 'Event type not correct');
        },

        'test: _onMove() delegate': function() {
            eventData.move._onMove(event,node, {
                _extra: {}
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
            var flag = false,
            retVal,
            en = event;
            en.changedTouches = en.touches;
            eventData.end._onEnd(en,node, {
                _extra: {}
            }, {
                fire: function(e) {
                    flag = true;
                    retVal = e;
                }
            });
            Assert.isTrue(flag, 'gesturemoveend should fire')
            Assert.areSame(en.target, retVal.target, 'Targets are not the same');
            Assert.areSame('gesturemoveend', retVal.type, 'Event type not correct');
        },

        'test: _onEnd() with mouse and preventMouse = true': function() {
            var flag = false,
            retVal,
            en = eventNoTouch;
            eventData.end._onEnd(en,node, {
                _extra: {
                    standAlone: true
                },
                preventMouse: true
            }, {
                fire: function(e) {
                    flag = true;
                    retVal = e;
                }
            });
            Assert.isFalse(flag, 'gesturemoveend should not fire');
            Assert.isUndefined(retVal, 'gesturemoveend should not fire');
        },

        'test: _onEnd() with mouse and preventMouse = false': function() {
            var flag = false,
            retVal,
            en = eventNoTouch;
            eventData.end._onEnd(en,node, {
                _extra: {
                    standAlone: true
                }
            }, {
                fire: function(e) {
                    flag = true;
                    retVal = e;
                }
            });
            Assert.isTrue(flag, 'gesturemoveend should fire');
            Assert.areSame(en.target, retVal.target, 'Targets are not the same');
            Assert.areSame('gesturemoveend', retVal.type, 'Event type not correct');
        },

        'test: _onEnd() with MSPointer': function() {
            var flag = false,
            retVal;
            eventData.end._onEnd(endEventMSPointer,node, {
                _extra: {
                    standAlone: true
                }
            }, {
                fire: function(e) {
                    flag = true;
                    retVal = e;
                }
            });
            Assert.isTrue(flag, 'gesturemoveend should fire');
            Assert.areSame(endEventMSPointer.target, retVal.target, 'Targets are not the same');
            Assert.areSame('gesturemoveend', retVal.type, 'Event type not correct');
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
            Assert.areEqual(_node.style.msTouchAction, '');

            this.handles.push(elem.on('gesturemovestart', noop));
            //After subscribing to gesturemovestart, the touchaction should be modified to 'none'
            Assert.areEqual(_node.style.msTouchAction, 'none');

            this.handles.push(elem.on('gesturemove', noop));
            //Subscribing to other gesture events should keep the touchaction to none
            Assert.areEqual(_node.style.msTouchAction, 'none');

            this.handles.push(elem.on('gesturemoveend', noop));
            Assert.areEqual(_node.style.msTouchAction, 'none');

            //Now we are going to detach all listeners
            Y.Array.each(this.handles, function(h) {
                h.detach();
            });
            //Upon detaching listeners, the touchAction should be back to ""
            Assert.areEqual(_node.style.msTouchAction, '');
        },

        'test: touchActions modify': function () {

            var elem = Y.one('#myNode'),
                _node = elem.getDOMNode(),
                flag = false;

            Assert.areSame(_node.style.msTouchAction, '');

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
                    Assert.areSame(_node.style.msTouchAction, 'none');
                    flag = true;
                    _node.style.msTouchAction = 'pan-x';
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
                    Assert.areSame(_node.style.msTouchAction, 'pan-x');
                }
            });

        },

        'test: touchActions defaultModify': function () {
            var elem = Y.one('#myNode'),
                _node = elem.getDOMNode();

            Assert.areSame(_node.style.msTouchAction, '');
            Y.Event._DEFAULT_TOUCH_ACTION = 'pan-x';
            this.handles.push(elem.on('gesturemovestart', noop));
            this.handles.push(elem.on('gesturemove', noop));
            this.handles.push(elem.on('gesturemoveend', noop));

            Assert.areSame('pan-x', _node.style.msTouchAction);

            var h = this.handles.pop();
            h.detach();

            Assert.areSame('pan-x', _node.style.msTouchAction);

            Y.Array.each(this.handles, function(h) {
                h.detach();
            });

            Assert.areSame('', _node.style.msTouchAction);

        },

        'test: touchActions multipleNodes': function () {
            var elem1 = Y.one('#myNode'),
                _node1 = elem1.getDOMNode(),
                elem2,
                _node2;

            elem2 = Y.Node.create("<div id='myNode2'></div>");
            Y.one("body").append(elem2);
            _node2 = elem2.getDOMNode();



            Assert.areSame(_node1.style.msTouchAction, '');
            Assert.areSame(_node2.style.msTouchAction, '');

            this.handles.push(elem1.on('gesturemovestart', noop));
            this.handles.push(elem1.on('gesturemove', noop));
            this.handles.push(elem1.on('gesturemoveend', noop));

            Assert.areSame(_node1.style.msTouchAction, 'none');
            Assert.areSame(_node2.style.msTouchAction, '');

            var h = this.handles.pop();
            h.detach();

            Assert.areSame(_node1.style.msTouchAction, 'none');
            Assert.areSame(_node2.style.msTouchAction, '');

            Y.Array.each(this.handles, function(h) {
                h.detach();
            });

            Assert.areSame(_node1.style.msTouchAction, '');
            Assert.areSame(_node2.style.msTouchAction, '');

            this.handles.push(elem2.on('gesturemovestart', noop));

            Assert.areSame(_node1.style.msTouchAction, '');
            Assert.areSame(_node2.style.msTouchAction, 'none');

            this.handles.push(elem2.on('gesturemove', noop));
            this.handles.push(elem2.on('gesturemoveend', noop));

            Assert.areSame(_node1.style.msTouchAction, '');
            Assert.areSame(_node2.style.msTouchAction, 'none');

            Y.Array.each(this.handles, function(h) {
                h.detach();
            });

            Assert.areSame(_node1.style.msTouchAction, '');
            Assert.areSame(_node2.style.msTouchAction, '');

            Y.one('#myNode2').remove();

        },

        'test: touchActions document': function () {
            var doc = Y.one('doc'),
                docElem = doc.getDOMNode().documentElement;
            Assert.areSame(docElem.style.msTouchAction, '');

            this.handles.push(doc.on('gesturemovestart', noop));
            Assert.areSame(docElem.style.msTouchAction, 'none');

            this.handles.push(doc.on('gesturemove', noop));
            Assert.areSame(docElem.style.msTouchAction, 'none');

            this.handles.push(doc.on('gesturemoveend', noop));
            Assert.areSame(docElem.style.msTouchAction, 'none');

            var h = this.handles.pop();
            h.detach();

            Assert.areSame(docElem.style.msTouchAction, 'none');

            Y.Array.each(this.handles, function(h) {
                h.detach();
            });
            Assert.areSame(docElem.style.msTouchAction, '');


        }

    }));

    Y.Test.Runner.add(suite);

}, '', {requires:['event-move', 'test', 'node', 'event-simulate']});
