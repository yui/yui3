YUI.add('event-tap-unit-tests', function(Y) {

    var suite = new Y.Test.Suite('Event: Tap'),
    Assert = Y.Assert,
    flag = false,
    prevDefaultFn = function(e) {
        e.preventDefault();
        flag = true;
    },
    node = Y.one('#clicker1'),
    eventDef = {
        tap: Y.Node.DOM_EVENTS.tap.eventDef
    };

    suite.add(new Y.Test.Case({
        name: 'Tap',
        setUp: function() {
            var handles = [];
            handles.push(node.on('tap', prevDefaultFn));
            this.handles = handles;
        },

        tearDown: function () {
            flag = false;
            Y.Array.each(this.handles, function(h) {
                h.detach();
            });
        },

        'test: tap init': function() {
            Assert.isObject(this.handles[0].evt);
        },

        'test: tap fire': function () {
            this.handles[0].evt.fire(this.handles[0].evt);
            Assert.isTrue(flag);
        },

        'test: tapstart fire with touch': function () {
            var e = {
                button: 1,
                pageX: 100,
                pageY: 100,
                type: 'touchstart',
                touches: [{}] //need to have e.touches.length > 0
            },
            h = [];
            eventDef.tap._start(e, node, h, {}, {});
            Assert.isTrue(h.Y_TAP_ON_END_HANDLE instanceof Y.EventHandle);
            Assert.isTrue(h.Y_TAP_ON_CANCEL_HANDLE instanceof Y.EventHandle);
        },

        'test: tapstart fire with mouse': function () {
            var e = {
                button: 1,
                pageX: 100,
                pageY: 100,
                type: 'mousedown'
            },
            h = [];
            eventDef.tap._start(e, node, h, {}, {});
            Assert.isTrue(h.Y_TAP_ON_END_HANDLE instanceof Y.EventHandle);
            Assert.isTrue(h.Y_TAP_ON_CANCEL_HANDLE instanceof Y.EventHandle);
        },

        'test: tapstart fire with mspointer': function () {
            var e = {
                button: 1,
                pageX: 100,
                pageY: 100,
                type: 'MSPointerDown'
            },
            h = [];
            eventDef.tap._start(e, node, h, {}, {});
            Assert.isTrue(h.Y_TAP_ON_END_HANDLE instanceof Y.EventHandle);
            Assert.isTrue(h.Y_TAP_ON_CANCEL_HANDLE instanceof Y.EventHandle);
        },

        'test: _start no touch': function () {
            var e = {
                button: 1,
                touches: [],
                pageX: 100,
                pageY: 100,
                type: 'touchstart'
            },
            h = [];

            eventDef.tap._start(e, node, h, {}, {});
            Assert.areSame(0, h.length, 'no new handles');
        },

        'test: _start right click': function () {
            var e = {
                button: 3,
                pageX: 100,
                pageY: 100,
                type: 'touchstart'
            },
            h = [];
            eventDef.tap._start(e, node, h, {}, {});
            Assert.areSame(0, h.length, 'no new handles');
        },

        'test: _end': function () {
            var fired = false,

            e = {
                button: 1,
                pageX: 100,
                pageY: 100,
                clientX: 100,
                clientY: 100,
                type: 'touchend',
                touches: [{}] //need to have e.touches.length > 0
            },

            notifier = {
                fire: function () {
                    fired = true;
                    Assert.isTrue(fired);
                }
            },

            context = {
                node: node,
                startXY: [100, 100]
            },

            h = [];

            eventDef.tap._start(e, node, h, {}, {});
            eventDef.tap._end(e, node, h, notifier, {}, context);
            Assert.isNull(h.Y_TAP_ON_END_HANDLE);
            Assert.isNull(h.Y_TAP_ON_CANCEL_HANDLE);
        },

        'test: _end with changedTouches': function () {
            var fired = false,

            e = {
                button: 1,
                pageX: 100,
                pageY: 100,
                clientX: 100,
                clientY: 100,
                type: 'touchend',
                touches: [{}], //need to have e.touches.length > 0
                changedTouches: [{
                    pageX: 100,
                    pageY: 100,
                    clientX: 100,
                    clientY: 100
                }]
            },

            notifier = {
                fire: function () {
                    fired = true;
                    Assert.isTrue(fired);
                }
            },

            context = {
                node: node,
                startXY: [100, 100]
            },

            h = [];

            eventDef.tap._start(e, node, h, {}, {});
            eventDef.tap._end(e, node, h, notifier, {}, context);
            Assert.isNull(h.Y_TAP_ON_END_HANDLE);
            Assert.isNull(h.Y_TAP_ON_CANCEL_HANDLE);
        },

        'test: delegate eventhandle': function () {
            var h = [];

            eventDef.tap.delegate(node, h, {}, '#test');
            Assert.isTrue(h.Y_TAP_ON_START_HANDLE instanceof Y.EventHandle);
        },

        'test: detachDelegate eventhandle': function () {
            var h = [];
            eventDef.tap.delegate(node, h, {}, {});
            Assert.isTrue(h.Y_TAP_ON_START_HANDLE instanceof Y.EventHandle);

            eventDef.tap.detachDelegate(node, h, {});
            Assert.isNull(h.Y_TAP_ON_START_HANDLE);

        },


        'test: notifier preventDefault': function () {
            var h = [],
                e = {
                    button: 1,
                    pageX: 100,
                    pageY: 100,
                    clientX: 100,
                    clientY: 100,
                    type: 'touchstart'
                };
            h.push(Y.one('#clicker2').on('tap', function (e) {
                e.preventDefault();
                flag = true;
            }));
            h[0].evt.fire(this.handles[0].evt);
            Assert.isTrue(flag);
            Assert.areEqual(Y.one('doc').get('URL').indexOf('tapped'), -1, '#tapped should not be appended to the URL');
        },

        'test: sensitivity too low': function () {
            var fired = false,

            startEvent = {
                button: 1,
                pageX: 100,
                pageY: 100,
                clientX: 100,
                clientY: 100,
                type: 'touchend',
                touches: [{}] //need to have e.touches.length > 0
            },
            endEvent = {
                button: 1,
                pageX: 150,
                pageY: 150,
                clientX: 150,
                clientY: 150,
                type: 'touchend',
                touches: [{}] //need to have e.touches.length > 0
            },


            notifier = {
                fire: function () {
                    fired = true;
                    Assert.isTrue(fired);
                }
            },

            context = {
                node: node,
                startXY: [100, 100]
            },

            h = {
                _extra: {
                    sensitivity: 30
                }
            };

            eventDef.tap._start(startEvent, node, h, {}, {});
            eventDef.tap._end(endEvent, node, h, notifier, {}, context);
            Assert.isFalse(fired, 'Tap should not fire because sensitivity is too low');
        },

        'test: sensitivity is fine': function () {
            var fired = false,

            startEvent = {
                button: 1,
                pageX: 100,
                pageY: 100,
                clientX: 100,
                clientY: 100,
                type: 'touchend',
                touches: [{}] //need to have e.touches.length > 0
            },
            endEvent = {
                button: 1,
                pageX: 110,
                pageY: 110,
                clientX: 110,
                clientY: 110,
                type: 'touchend',
                touches: [{}] //need to have e.touches.length > 0
            },


            notifier = {
                fire: function () {
                    fired = true;
                    Assert.isTrue(fired);
                }
            },

            context = {
                node: node,
                startXY: [100, 100]
            },

            h = {
                _extra: {
                    sensitivity: 18
                }
            };

            eventDef.tap._start(startEvent, node, h, {}, {});
            eventDef.tap._end(endEvent, node, h, notifier, {}, context);
            Assert.isTrue(fired, 'Tap should fire because sensitivity is within limits');
        },

        'test: preventedFn prevents default behavior': function () {
            var fired = false,
                clicker = Y.one('#clicker2'),
                e = {
                    target: clicker
                },
                url = Y.config.win.location.href;

            //call preventedFn()
            eventDef.tap.publishConfig.preventedFn(e);

            clicker.simulate('click');

            Assert.areSame(Y.config.win.location.href, url, 'The url should not change because preventDefault() should be called.');
        }

    }));

    suite.add(new Y.Test.Case({
        name: 'DOM event simulation',

        _should: {
            ignore: {
                'simulate MS Pointer events': Y.Event._GESTURE_MAP.start !== 'MSPointerDown',
                'simulate W3C Pointer events': Y.Event._GESTURE_MAP.start !== 'pointerdown'
            }
        },

        'simulate MS Pointer events': function () {
            var test = this;

            node.on('tap', function () {
                test.resume(function () {

                });
            });

            node.simulate('MSPointerDown');
            setTimeout(function () {
                node.simulate('MSPointerUp', {
                    pageX: 100,
                    pageY: 100
                });
            }, 0);
            test.wait();
        },

        'simulate W3C Pointer events': function () {
            var test = this;

            node.on('tap', function () {
                test.resume(function () {

                });
            });

            node.simulate('pointerdown');
            setTimeout(function () {
                node.simulate('pointerup', {
                    pageX: 100,
                    pageY: 100
                });
            }, 0);
            test.wait();
        }
    }));

    Y.Test.Runner.add(suite);

}, '@VERSION@' ,{requires:['event-tap','test', 'node-event-simulate']});
