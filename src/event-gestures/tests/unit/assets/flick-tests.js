YUI.add('flick-tests', function(Y) {

    var eventData = {
            flick: Y.Node.DOM_EVENTS.flick.eventDef,
            flickleft: Y.Node.DOM_EVENTS.flickleft.eventDef,
            flickright: Y.Node.DOM_EVENTS.flickright.eventDef,
            flickup: Y.Node.DOM_EVENTS.flickup.eventDef,
            flickdown: Y.Node.DOM_EVENTS.flickdown.eventDef
        },
        Assert = Y.Assert,
        noop = function() { },
        CE = {
            fire: noop
        },
        node = Y.one('#tester'),
        event = {},
        invalidEvent = {},
        xAxisEvent = {},
        yAxisEvent = {},
        suite = new Y.Test.Suite('Flick Event Suite');

    suite.add(new Y.Test.Case({
        name: 'flick',
        setUp: function() {
            this.handles = [];
            this.handles.push(node.on('flick', noop));
            this.handles.push(node.delegate('flick', noop));
            event = {
                target: node,
                type: 'touchstart',
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

            invalidEvent = {
                target: node,
                type: 'touchstart',
                currentTarget: node,
                touches: [
                    {
                        pageX: 100,
                        pageY: 100,
                        clientX: 100,
                        clientY: 100,
                        screenX: 100,
                        screenY: 100
                    },
                    {
                        pageX: 200,
                        pageY: 200,
                        clientX: 200,
                        clientY: 200,
                        screenX: 200,
                        screenY: 200
                    }
                ]
            },
            xAxisEvent = {
                target: node,
                type: 'touchstart',
                currentTarget: node,
                touches: [
                    {
                        pageX: 300,
                        pageY: 100,
                        clientX: 300,
                        clientY: 100,
                        screenX: 300,
                        screenY: 100
                    }
                ]
            },

            yAxisEvent = {
                target: node,
                type: 'touchstart',
                currentTarget: node,
                touches: [
                    {
                        pageX: 100,
                        pageY: 300,
                        clientX: 100,
                        clientY: 300,
                        screenX: 100,
                        screenY: 300
                    }
                ]
            };
        },
        tearDown: function() {
            Y.Array.each(this.handles, function(h) {
                h.detach();
            });
        },
        'test: _onStart()': function() {
            var sub = {
                _extra: {
                    minDistance: 5,
                    minVelocity: 5
                }
            };
            eventData.flick._onStart(event, node, sub, {});
            Assert.isNotUndefined(sub['_feh'], 'End Event Handle not set');
            Assert.isNotUndefined(sub['_fs'], 'Event should be stored stored on sub[_fs]');
        },

        'test: _onStart() with preventDefault': function () {
            var flag = false,
                prevDefaultFlag = false,
                retVal,
                customEvent = event,
                sub = {
                    _extra: {
                        minDistance: 5,
                        minVelocity: 5,
                        preventDefault: true
                    }
                };
            customEvent.preventDefault = function () {
                prevDefaultFlag = true;
            };
            eventData.flick._onStart(event, node, sub, {});

            Assert.isTrue(prevDefaultFlag, 'PreventDefault was not called.');
            Assert.isNotUndefined(sub['_feh'], 'End Event Handle not set');
            Assert.isNotUndefined(sub['_fs'], 'Event should be stored stored on sub[_fs]');
        },
        'test: _onMove()': function() {
            var sub = { '_fs': { flick: { } } };
            eventData.flick._onMove(event,node, sub);
            Assert.isTrue((sub._fs.flick.time > 0), 'Flick time was not set on move');
        },

        'test: _onMove() without subscriber': function() {
            var sub = {};
            eventData.flick._onMove(event,node, sub);
            Assert.isUndefined(sub['_fs'], 'Flick time was not set on move');
        },

        'test: _onEnd()': function() {
            var flag = false,
                retVal,
                en = event;
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
                    flag = true;
                    retVal = e;
                }
            });

            Assert.isTrue(flag, 'Flick event should fire.');
            Assert.isNotUndefined(retVal, 'Flick event should have a valid payload');
            Assert.areSame('flick', retVal.type, 'Event type is incorrect');
            Assert.isObject(retVal.flick, 'e.click is not an Object');
            Assert.areSame('x', retVal.flick.axis, 'flick axis is not X');
            Assert.areSame(95, retVal.flick.distance, 'Did not flick the proper distance');
            Assert.isTrue((retVal.flick.time >- 3000), 'flick time is not set properly');
            Assert.isTrue((retVal.flick.velocity >= 0.020), 'Failed to move in the proper velocity');
            Assert.areSame(0, retVal.touches.length, 'e.touches.length should be 0');
            Assert.areSame(1, retVal.changedTouches.length, 'retVal.changedTouches.length should be 1');
            Assert.areSame(node, retVal.target, 'Event target is not set properly');
            Assert.areSame(node, retVal.currentTarget, 'Event currentTarget is not set properly');
        },

        'test: _onEnd() without defined axis (x)': function() {
            var flag = false,
                retVal,
                en = xAxisEvent;
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
                    minTime: 1,
                    minDistance: 0,
                    minVelocity: 0,
                    preventDefault: noop
                }
            }, {
                fire: function(e) {
                    flag = true;
                    retVal = e;
                }
            });

            Assert.isTrue(flag, 'Flick event should fire.');
            Assert.isNotUndefined(retVal, 'Flick event should have a valid payload');
            Assert.areSame('flick', retVal.type, 'Event type is incorrect');
            Assert.isObject(retVal.flick, 'e.click is not an Object');
            Assert.areSame('x', retVal.flick.axis, 'flick axis is not X');
            Assert.areSame(295, retVal.flick.distance, 'Did not flick the proper distance');
            Assert.isTrue((retVal.flick.time >- 3000), 'flick time is not set properly');
            Assert.isTrue((retVal.flick.velocity >= 0.020), 'Failed to move in the proper velocity');
            Assert.areSame(0, retVal.touches.length, 'e.touches.length should be 0');
            Assert.areSame(1, retVal.changedTouches.length, 'retVal.changedTouches.length should be 1');
            Assert.areSame(node, retVal.target, 'Event target is not set properly');
            Assert.areSame(node, retVal.currentTarget, 'Event currentTarget is not set properly');
        },

        'test: _onEnd() without defined axis (y)': function() {
            var flag = false,
                retVal,
                en = yAxisEvent;
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
                    minTime: 1,
                    minDistance: 0,
                    minVelocity: 0,
                    preventDefault: noop
                }
            }, {
                fire: function(e) {
                    flag = true;
                    retVal = e;
                }
            });

            Assert.isTrue(flag, 'Flick event should fire.');
            Assert.isNotUndefined(retVal, 'Flick event should have a valid payload');
            Assert.areSame('flick', retVal.type, 'Event type is incorrect');
            Assert.isObject(retVal.flick, 'e.click is not an Object');
            Assert.areSame('y', retVal.flick.axis, 'flick axis is not Y');
            Assert.areSame(295, retVal.flick.distance, 'Did not flick the proper distance');
            Assert.isTrue((retVal.flick.time >- 3000), 'flick time is not set properly');
            Assert.isTrue((retVal.flick.velocity >= 0.020), 'Failed to move in the proper velocity');
            Assert.areSame(0, retVal.touches.length, 'e.touches.length should be 0');
            Assert.areSame(1, retVal.changedTouches.length, 'retVal.changedTouches.length should be 1');
            Assert.areSame(node, retVal.target, 'Event target is not set properly');
            Assert.areSame(node, retVal.currentTarget, 'Event currentTarget is not set properly');
        },

        'test: _onEnd() with invalid event': function () {
            var flag = false,
                retVal,
                en = invalidEvent;
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
                    flag = true;
                    retVal = e;
                }
            });

            Assert.isFalse(flag, 'Flick event should not fire.');
            Assert.isUndefined(retVal, 'Flick event should not fire');
        },

        'test: _onEnd() with preventDefault': function () {
            var flag = false,
                prevDefaultFlag = false,
                retVal,
                en = event;
            en.changedTouches = en.touches;
            en.touches = [];
            en.preventDefault = function () {
                prevDefaultFlag = true;
            };

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
                    preventDefault: true
                }
            }, {
                fire: function(e) {
                    flag = true;
                    retVal = e;
                }
            });

            Assert.isTrue(flag, 'Flick event should fire.');
            Assert.isTrue(prevDefaultFlag, 'e.preventDefault() should fire.');
            Assert.isNotUndefined(retVal, 'Flick event should return a payload');
        },

        'test: _fireEvent() with valid flick': function () {
            var flag = false,
            retVal;

            eventData.flick._fireEvent(event, 'foo', 300, 3, 'x', 'bar', {
                minDistance: 200,
                minVelocity: 0.5
            }, {
                fire: function (e) {
                    flag = true;
                    retVal = e;
                }
            });


            Assert.isTrue(flag, 'Flick should fire');
            Assert.isNotUndefined(retVal, 'Flick should fire');
            Assert.areSame('foo', retVal.flick.time, 'Time value not the same.');
            Assert.areSame(300, retVal.flick.distance, 'Distance value not the same.');
            Assert.areSame('x', retVal.flick.axis, 'Axis value not the same.');
            Assert.areSame(3, retVal.flick.velocity, 'Velocity value not the same.');
            Assert.areSame('bar', retVal.flick.start, 'Start value not the same.');
        },

        'test: _fireEvent() with invalid flick': function () {
            var flag = false,
            retVal;

            eventData.flick._fireEvent(event, 'foo', 300, 3, 'x', 'bar', {
                minDistance: 400,
                minVelocity: 1
            }, {
                fire: function (e) {
                    flag = true;
                    retVal = e;
                }
            });


            Assert.isFalse(flag, 'Flick should not fire');
            Assert.isUndefined(retVal, 'Flick should not fire');
        },

        'test: _isValidFlick() invalid low Distance': function () {
            var retVal = eventData.flick._isValidFlick(3, 100, {
                minDistance: 200,
                minVelocity: 2
            }, 'x');

            Assert.isFalse(retVal, 'Flick should not be valid');
        },

        'test: _isValidFlick() invalid low velocity': function () {
            var retVal = eventData.flick._isValidFlick(3, 100, {
                minDistance: 50,
                minVelocity: 4
            }, 'y');

            Assert.isFalse(retVal, 'Flick should not be valid');
        },


        'test: detach()': function () {

            var fshDetached = false,
            fehDetached = false,
            sub = {
                '_fsh': {
                    flick: {},
                    detach: function () {
                        fshDetached = true;
                    }
                },
                '_feh': {
                    flick: {},
                    detach: function () {
                        fehDetached = true;
                    }
                }
            };
            eventData.flick.detach(node, sub, {});
            Assert.isNull(sub['_fsh'], 'Flick Start Handle was not detached');
            Assert.isNull(sub['_feh'], 'Flick End Handle was not detached');
            Assert.isTrue(fshDetached, 'fsh handle was not detached');
            Assert.isTrue(fehDetached, 'feh handle was not detached');
        },

        'test: processArgs() with no args': function () {
            var args = ['foo', 'bar', 'baz'];
            var retVal = eventData.flick.processArgs(args, false);

            Assert.areSame(100, retVal.minDistance, 'default minDistance should be 100px');
            Assert.areSame(0, retVal.minVelocity, 'default minVelocity should be 0');
            Assert.isFalse(retVal.preventDefault, 'default preventDefault should be false');
        },

        /* -----------*
         * FLICK LEFT *
         * -----------*/

        'test: flickleft _isValidFlick() with valid flick': function () {
            var retVal = eventData.flickleft._isValidFlick(3, -100, {
                minDistance: 97,
                minVelocity: 2
            }, 'x');

            Assert.isTrue(retVal, 'Flick should be valid');
        },

        'test: flickleft _isValidFlick() with invalid flick (axis)': function () {
            var retVal = eventData.flickleft._isValidFlick(3, -100, {
                minDistance: 97,
                minVelocity: 2
            }, 'y');

            Assert.isFalse(retVal, 'Flick should be invalid');
        },

        'test: flickleft _isValidFlick() with invalid flick (distance)': function () {
            var retVal = eventData.flickleft._isValidFlick(3, 100, {
                minDistance: 97,
                minVelocity: 2
            }, 'x');

            Assert.isFalse(retVal, 'Flick should be invalid');
        },

        /* ------------*
         * FLICK RIGHT *
         * ------------*/

        'test: flickright _isValidFlick() with valid flick': function () {
            var retVal = eventData.flickright._isValidFlick(3, 100, {
                minDistance: 97,
                minVelocity: 2
            }, 'x');

            Assert.isTrue(retVal, 'Flick should be valid');
        },

        'test: flickright _isValidFlick() with invalid flick (axis)': function () {
            var retVal = eventData.flickright._isValidFlick(3, 100, {
                minDistance: 97,
                minVelocity: 2
            }, 'y');

            Assert.isFalse(retVal, 'Flick should be invalid');
        },

        'test: flickright _isValidFlick() with invalid flick (distance)': function () {
            var retVal = eventData.flickright._isValidFlick(3, -100, {
                minDistance: 97,
                minVelocity: 2
            }, 'x');

            Assert.isFalse(retVal, 'Flick should be invalid');
        },

        /* ---------*
         * FLICK UP *
         * ---------*/

        'test: flickup _isValidFlick() with valid flick': function () {
            var retVal = eventData.flickup._isValidFlick(3, -100, {
                minDistance: 97,
                minVelocity: 2
            }, 'y');

            Assert.isTrue(retVal, 'Flick should be valid');
        },

        'test: flickup _isValidFlick() with invalid flick (axis)': function () {
            var retVal = eventData.flickup._isValidFlick(3, -100, {
                minDistance: 97,
                minVelocity: 2
            }, 'x');

            Assert.isFalse(retVal, 'Flick should be invalid');
        },

        'test: flickup _isValidFlick() with invalid flick (distance)': function () {
            var retVal = eventData.flickup._isValidFlick(3, 100, {
                minDistance: 97,
                minVelocity: 2
            }, 'y');

            Assert.isFalse(retVal, 'Flick should be invalid');
        },

        /* -----------*
         * FLICK DOWN *
         * -----------*/

        'test: flickdown _isValidFlick() with valid flick': function () {
            var retVal = eventData.flickdown._isValidFlick(3, 100, {
                minDistance: 97,
                minVelocity: 2
            }, 'y');

            Assert.isTrue(retVal, 'Flick should be valid');
        },

        'test: flickdown _isValidFlick() with invalid flick (axis)': function () {
            var retVal = eventData.flickdown._isValidFlick(3, 100, {
                minDistance: 97,
                minVelocity: 2
            }, 'x');

            Assert.isFalse(retVal, 'Flick should be invalid');
        },

        'test: flickdown _isValidFlick() with invalid flick (distance)': function () {
            var retVal = eventData.flickdown._isValidFlick(3, -100, {
                minDistance: 97,
                minVelocity: 2
            }, 'y');

            Assert.isFalse(retVal, 'Flick should be invalid');
        }
    }));



    Y.Test.Runner.add(suite);

});
