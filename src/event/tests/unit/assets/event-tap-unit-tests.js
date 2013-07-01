YUI.add('event-tap-unit-tests', function(Y) {

    var suite = new Y.Test.Suite('Event: Tap'),
    Assert = Y.Assert,
    flag = false,
    noop = function(e) {
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
            handles.push(node.on('tap', noop));
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
                type: 'touchstart'
            },
            h = [];
            eventDef.tap.touchStart(e, node, h, {}, {});
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
            eventDef.tap.touchStart(e, node, h, {}, {});
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
            eventDef.tap.touchStart(e, node, h, {}, {});
            Assert.isTrue(h.Y_TAP_ON_END_HANDLE instanceof Y.EventHandle);
            Assert.isTrue(h.Y_TAP_ON_CANCEL_HANDLE instanceof Y.EventHandle);
        },

        'test: tapstart no touch': function () {
            var e = {
                button: 1,
                touches: [],
                pageX: 100,
                pageY: 100,
                type: 'touchstart'
            },
            h = [];

            eventDef.tap.touchStart(e, node, h, {}, {});
            Assert.areSame(0, h.length, 'no new handles');
        },

        'test: tapstart right click': function () {
            var e = {
                button: 3,
                pageX: 100,
                pageY: 100,
                type: 'touchstart'
            },
            h = [];
            eventDef.tap.touchStart(e, node, h, {}, {});
            Assert.areSame(0, h.length, 'no new handles');
        },

        'test: touchend': function () {
            var fired = false,

            e = {
                button: 1,
                pageX: 100,
                pageY: 100,
                clientX: 100,
                clientY: 100,
                type: 'touchstart'
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

            eventDef.tap.touchStart(e, node, h, {}, {});
            eventDef.tap.touchEnd(e, node, h, notifier, {}, context);
            Assert.isNull(h.Y_TAP_ON_END_HANDLE);
            Assert.isNull(h.Y_TAP_ON_CANCEL_HANDLE);
        },

        'test: delegate': function () {
            var h = [];

            eventDef.tap.delegate(node, h, {}, {});
            Assert.isTrue(h.Y_TAP_ON_START_HANDLE instanceof Y.EventHandle);
        },

        'test: detachDelegate': function () {
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

        _should: {
            ignore: {

            }
        }

    }));

    Y.Test.Runner.add(suite);

}, '@VERSION@' ,{requires:['event-tap','test']});
