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
        hasMsTouchActionSupport = (node.getDOMNode().style && ("msTouchAction" in node.getDOMNode().style)),
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

        eventNoTouch = {
            target: node,
            currentTarget: node
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

});
