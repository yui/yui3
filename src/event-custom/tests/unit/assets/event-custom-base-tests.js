YUI.add('event-custom-base-tests', function(Y) {

// Continue on line 3645

var baseSuite = new Y.Test.Suite("Custom Event: Base"),
    keys = Y.Object.keys;

baseSuite.add(new Y.Test.Case({

    name: "Event Target Constructor",

    "test new Y.EventTarget()": function () {
        var target = new Y.EventTarget();

        Y.Assert.isInstanceOf(Y.EventTarget, target);
        Y.Assert.isObject(target._yuievt);
    },

    "test new Y.EventTarget(config)": function () {
        var target1 = new Y.EventTarget(),

            target2 = new Y.EventTarget({
                broadcast: 2,
                bubbles: false,
                context: target1,
                defaultTargetOnly: true,
                emitFacade: true,
                fireOnce: true,
                monitored: true,
                queuable: true,
                async: true
            }),
            config1 = target1._yuievt,
            config2 = target2._yuievt;

        Y.Assert.isObject(config1.events);
        Y.Assert.isNull(config1.targets);
        Y.Assert.isObject(config1.config);
        Y.Assert.isUndefined(config1.bubbling);

        Y.Assert.isUndefined(config1.config.broadcast);
        Y.Assert.areSame(target1, config2.config.context);
        Y.Assert.isUndefined(config1.config.defaultTargetOnly);
        Y.Assert.isUndefined(config1.config.emitFacade);
        Y.Assert.isUndefined(config1.config.fireOnce);
        Y.Assert.isUndefined(config1.config.monitored);
        Y.Assert.isUndefined(config1.config.queuable);

        Y.Assert.areSame(2, config2.config.broadcast);
        Y.Assert.isFalse(config2.config.bubbles);
        Y.Assert.areSame(target1, config2.config.context);
        Y.Assert.isTrue(config2.config.defaultTargetOnly);
        Y.Assert.isTrue(config2.config.emitFacade);
        Y.Assert.isTrue(config2.config.fireOnce);
        Y.Assert.isTrue(config2.config.monitored);
        Y.Assert.isTrue(config2.config.queuable);
        Y.Assert.isTrue(config2.config.async);
    },

    "test Y.augment(Clz, Y.EventTarget)": function () {
        var instance,
            thisObj;

        function TestClass1() {}
        TestClass1.prototype = {
            method: function() {
                thisObj = this;
            }
        };

        Y.augment(TestClass1, Y.EventTarget);

        instance = new TestClass1();

        Y.Assert.isUndefined(instance._yuievt);
        Y.Assert.isFunction(instance.on);
        Y.Assert.areNotSame(instance.on, Y.EventTarget.prototype.on);

        instance.on("test", instance.method);
        instance.fire("test");

        Y.Assert.isObject(instance._yuievt);
        Y.Assert.isUndefined(instance._yuievt.config.fireOnce);
        Y.Assert.areSame(instance.on, Y.EventTarget.prototype.on);
        Y.Assert.areSame(instance, thisObj);

        function TestClass2() {}
        TestClass2.prototype = {
            method: function () {
                thisObj = this;
            }
        };

        Y.augment(TestClass2, Y.EventTarget, true, null, {
            fireOnce: true
        });

        instance = new TestClass2();
        thisObj = null;

        Y.Assert.isUndefined(instance._yuievt);
        Y.Assert.isFunction(instance.on);
        Y.Assert.areNotSame(instance.on, Y.EventTarget.prototype.on);

        instance.on("test", instance.method);
        instance.fire("test");

        Y.Assert.isObject(instance._yuievt);
        Y.Assert.isTrue(instance._yuievt.config.fireOnce);
        Y.Assert.areSame(instance.on, Y.EventTarget.prototype.on);
        Y.Assert.areSame(instance, thisObj);
    },

    "test Y.extend(Clz, Y.EventTarget)": function () {
        var instance, thisObj;

        function TestClass() {
            TestClass.superclass.constructor.apply(this, arguments);
        }
        Y.extend(TestClass, Y.EventTarget, {
            method: function () {
                thisObj = this;
            }
        });

        instance = new TestClass();

        Y.Assert.isInstanceOf(TestClass, instance);
        Y.Assert.isInstanceOf(Y.EventTarget, instance);
        Y.Assert.isObject(instance._yuievt);
        Y.Assert.areSame(instance.on, Y.EventTarget.prototype.on);

        instance.on("test", instance.method);
        instance.fire("test");

        Y.Assert.areSame(instance, thisObj);
    }
}));

baseSuite.add(new Y.Test.Case({
    name: "target.on()",

    _should: {
        ignore: {
            // As of 3.4.1, creates a subscription to a custom event named
            // "[object Object]"
            "test target.on([{ fn: fn, context: obj }]) does nothing": true,

            // Not (yet) implemented
            "test target.on(type, { handleEvents: fn })": true
        }
    },

    "test auto-publish on subscribe": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            publishCalled;

        target.publish = (function (original) {
            return function (type) {
                if (type === 'test') {
                    publishCalled = true;
                }
                return original.apply(this, arguments);
            };
        })(target.publish);

        Y.Assert.isUndefined(events.test);

        target.on("test", function () {});

        Y.Assert.isTrue(publishCalled);
        Y.Assert.isObject(events.test);
        Y.Assert.isInstanceOf(Y.CustomEvent, events.test);
    },

    "test target.on(type, fn)": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            subs,
            subscribers,
            afters,
            handle,
            thisObj,
            fired,
            argCount,
            testEvent;

        function callback() {
            fired = true;
            thisObj = this;
            argCount = arguments.length;
        }

        handle = target.on("test", callback);

        testEvent = events.test;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(subscribers);
        Y.Assert.areSame(1, subscribers.length);
        Y.Assert.areSame(0, afters.length);
        Y.Assert.areSame(1, testEvent.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.areSame(testEvent, handle.evt);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.sub);

        target.fire("test");

        Y.Assert.isTrue(fired);
        Y.Assert.areSame(target, thisObj);
        Y.Assert.areSame(0, argCount);

        // Test that fire() did not change the subscription state of the
        // custom event
        testEvent = events.test;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(subscribers);
        Y.Assert.areSame(1, subscribers.length);
        Y.Assert.areSame(0, afters.length);
        Y.Assert.areSame(1, testEvent.hasSubs());
    },

    "test target.on(type, fn) allows duplicate subs": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            count  = 0,
            subs,
            subscribers,
            afters,
            testEvent, handle1, handle2;

        function callback() {
            count++;
        }

        handle1 = target.on("test", callback);
        handle2 = target.on("test", callback);

        testEvent = events.test;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(subscribers);
        Y.Assert.areSame(2, subscribers.length);
        Y.Assert.areSame(0, afters.length);
        Y.Assert.areSame(2, testEvent.hasSubs());

        Y.Assert.areNotSame(handle1, handle2);
        Y.Assert.areSame(testEvent, handle1.evt);
        Y.Assert.areSame(handle1.evt, handle2.evt);
        Y.Assert.areNotSame(handle1.sub, handle2.sub);

        target.fire("test");

        Y.Assert.areSame(2, count);

        // Test that fire() did not change the subscription state of the
        // custom event
        testEvent = events.test;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(subscribers);
        Y.Assert.areSame(2, subscribers.length);
        Y.Assert.areSame(0, afters.length);
        Y.Assert.areSame(2, testEvent.hasSubs());
    },

    "test target.on(type, fn, obj)": function () {
        var target = new Y.EventTarget(),
            obj = {},
            count = 0,
            thisObj1, thisObj2, argCount, testEvent;

        function callback() {
            count++;
            thisObj1 = this;
            argCount = arguments.length;
        }

        target.on("test", callback, obj);

        target.fire("test");

        Y.Assert.areSame(1, count);
        Y.Assert.areSame(obj, thisObj1);
        Y.Assert.areSame(0, argCount);

        target.on("test", function () {
            thisObj2 = this;
        });

        target.fire("test");

        Y.Assert.areSame(2, count);
        Y.Assert.areSame(obj, thisObj1);
        Y.Assert.areSame(target, thisObj2);
        Y.Assert.areSame(0, argCount);
    },

    "test target.on(type, fn, obj, args)": function () {
        var target = new Y.EventTarget(),
            obj = {},
            count = 0,
            args = '',
            argCount,
            thisObj1, thisObj2, testEvent;

        function callback() {
            count++;
            thisObj1 = this;
            argCount = arguments.length;
            for (var i = 0, len = argCount; i < len; ++i) {
                args += arguments[i];
            }
        }

        target.on("test", callback, obj, "A");

        target.fire("test");

        Y.Assert.areSame(1, count);
        Y.Assert.areSame(obj, thisObj1);
        Y.Assert.areSame("A", args);

        target.on("test", function () {
            thisObj2 = this;
        });

        target.fire("test");

        Y.Assert.areSame(2, count);
        Y.Assert.areSame(obj, thisObj1);
        Y.Assert.areSame(target, thisObj2);
        Y.Assert.areSame(1, argCount);
    },

    "test target.on([type], fn)": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            subs,
            subscribers,
            afters,
            handle, thisObj, fired, argCount, testEvent;

        function callback() {
            fired = true;
            thisObj = this;
            argCount = arguments.length;
        }

        handle = target.on(["test"], callback);

        testEvent = events.test;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(subscribers);
        Y.Assert.areSame(1, subscribers.length);
        Y.Assert.areSame(0, afters.length);
        Y.Assert.areSame(1, testEvent.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(testEvent, handle.evt[0].evt);
        Y.Assert.isUndefined(handle.sub);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.evt[0].sub);

        target.fire("test");

        Y.Assert.isTrue(fired);
        Y.Assert.areSame(target, thisObj);
        Y.Assert.areSame(0, argCount);
    },

    "test target.on([typeA, typeB], fn)": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            count = 0,
            subs,
            subscribers,
            afters,
            handle, thisObj, testEvent1, testEvent2;

        function callback() {
            count++;
            thisObj = this;
        }

        handle = target.on(["test1", "test2"], callback);

        testEvent1 = events.test1;

        subs = testEvent1.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent1);
        Y.Assert.isArray(subscribers);
        Y.Assert.areSame(1, subscribers.length);
        Y.Assert.areSame(0, afters.length);
        Y.Assert.areSame(1, testEvent1.hasSubs());

        testEvent2 = events.test2;

        subs = testEvent2.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent2);
        Y.Assert.isArray(subscribers);
        Y.Assert.areSame(1, subscribers.length);
        Y.Assert.areSame(0, afters.length);
        Y.Assert.areSame(1, testEvent2.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(testEvent1, handle.evt[0].evt);
        Y.Assert.areSame(testEvent2, handle.evt[1].evt);
        Y.Assert.areNotSame(testEvent1, testEvent2);
        Y.Assert.isUndefined(handle.sub);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.evt[0].sub);

        target.fire("test1");

        Y.Assert.areSame(1, count);
        Y.Assert.areSame(target, thisObj);

        target.fire("test2");

        Y.Assert.areSame(2, count);
        Y.Assert.areSame(target, thisObj);
    },

    "test target.on([typeA, typeA], fn)": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            count = 0,
            subs,
            subscribers,
            afters,
            handle, thisObj, testEvent;

        function callback() {
            count++;
            thisObj = this;
        }

        handle = target.on(["test", "test"], callback);

        testEvent = events.test;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(subscribers);
        Y.Assert.areSame(2, subscribers.length);
        Y.Assert.areSame(0, afters.length);
        Y.Assert.areSame(2, testEvent.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(testEvent, handle.evt[0].evt);
        Y.Assert.areSame(testEvent, handle.evt[1].evt);
        Y.Assert.isUndefined(handle.sub);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.evt[0].sub);

        target.fire("test");

        Y.Assert.areSame(2, count);
        Y.Assert.areSame(target, thisObj);
    },

    "test target.on([], fn) does nothing": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            count = 0,
            handle, name, subs, i;

        function callback() {
            Y.Assert.fail("I don't know how this got called");
        }

        handle = target.on([], callback);

        for (name in events) {
            if (events.hasOwnProperty(name)) {
                subs = events[name]._subscribers;
                if (subs) {
                    for (i = subs.length - 1; i >= 0; --i) {
                        if (subs[i].fn === callback) {
                            Y.Assert.fail("subscription registered for '" + name + "' event");
                        }
                    }
                }
            }
        }

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(0, handle.evt.length);
        Y.Assert.isUndefined(handle.sub);
    },

    "test target.on([{ fn: fn, context: obj }]) does nothing": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            count = 0,
            handle, name, subs, i;

        function callback() {
            Y.Assert.fail("I don't know how this got called");
        }

        handle = target.on([{ fn: callback, context: {} }]);

        for (name in events) {
            if (events.hasOwnProperty(name)) {
                subs = events[name]._subscribers;
                if (subs) {
                    for (i = subs.length - 1; i >= 0; --i) {
                        if (subs[i].fn === callback) {
                            Y.Assert.fail("subscription registered for '" + name + "' event");
                        }
                    }
                }
            }
        }

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(0, handle.evt.length);
        Y.Assert.isUndefined(handle.sub);
    },

    "test target.on({ type: fn })": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            subs,
            subscribers,
            afters,
            handle, thisObj, fired, argCount, testEvent;

        function callback() {
            fired = true;
            thisObj = this;
            argCount = arguments.length;
        }

        handle = target.on({ "test1": callback });

        testEvent = events.test1;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(subscribers);
        Y.Assert.areSame(1, subscribers.length);
        Y.Assert.areSame(0, afters.length);
        Y.Assert.areSame(1, testEvent.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(1, handle.evt.length);
        Y.Assert.areSame(testEvent, handle.evt[0].evt);
        Y.Assert.isUndefined(handle.sub);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.evt[0].sub);

        target.fire("test1");

        Y.Assert.isTrue(fired);
        Y.Assert.areSame(target, thisObj);
        Y.Assert.areSame(0, argCount);

        handle = target.on({
            "test2": callback,
            "test3": callback
        });

        Y.Assert.isInstanceOf(Y.CustomEvent, events.test2);
        Y.Assert.isInstanceOf(Y.CustomEvent, events.test3);
        Y.Assert.areSame(1, events.test2._subscribers.length);
        Y.Assert.areSame(1, events.test3._subscribers.length);

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(2, handle.evt.length);
        Y.Assert.areSame(events.test2, handle.evt[0].evt);
        Y.Assert.areSame(events.test3, handle.evt[1].evt);
        Y.Assert.isUndefined(handle.sub);
    },

    "test target.on({ type: true }, fn)": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            subs,
            subscribers,
            afters,
            handle, thisObj, fired, argCount, testEvent;

        function callback() {
            fired = true;
            thisObj = this;
            argCount = arguments.length;
        }

        handle = target.on({ "test1": true }, callback);

        testEvent = events.test1;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(subscribers);
        Y.Assert.areSame(1, subscribers.length);
        Y.Assert.areSame(0, afters.length);
        Y.Assert.areSame(1, testEvent.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(1, handle.evt.length);
        Y.Assert.areSame(testEvent, handle.evt[0].evt);
        Y.Assert.isUndefined(handle.sub);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.evt[0].sub);

        target.fire("test1");

        Y.Assert.isTrue(fired);
        Y.Assert.areSame(target, thisObj);
        Y.Assert.areSame(0, argCount);

        handle = target.on({ "test2": 1, "test3": false }, callback);

        Y.Assert.isInstanceOf(Y.CustomEvent, events.test2);
        Y.Assert.isInstanceOf(Y.CustomEvent, events.test3);
        Y.Assert.areSame(1, events.test2._subscribers.length);
        Y.Assert.areSame(1, events.test3._subscribers.length);

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(2, handle.evt.length);
        Y.Assert.areSame(events.test2, handle.evt[0].evt);
        Y.Assert.areSame(events.test3, handle.evt[1].evt);
        Y.Assert.isUndefined(handle.sub);
    },

    "test target.on({ type: { fn: wins } }, fn)": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            subs,
            subscribers,
            afters,
            handle, thisObj, fired, argCount, testEvent;

        function callback() {
            fired = true;
            thisObj = this;
            argCount = arguments.length;
        }

        handle = target.on({ "test1": { fn: callback } }, function () {
            Y.Assert.fail("This callback should not have been called.");
        });

        testEvent = events.test1;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(subscribers);
        Y.Assert.areSame(1, subscribers.length);
        Y.Assert.areSame(0, afters.length);
        Y.Assert.areSame(1, testEvent.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(1, handle.evt.length);
        Y.Assert.areSame(testEvent, handle.evt[0].evt);
        Y.Assert.isUndefined(handle.sub);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.evt[0].sub);

        target.fire("test1");

        Y.Assert.isTrue(fired);
        Y.Assert.areSame(target, thisObj);
        Y.Assert.areSame(0, argCount);
    },

    "test target.on({ type: { fn: wins } }, fn, obj, args)": function () {
        var target = new Y.EventTarget(),
            obj = {},
            subs,
            subscribers,
            afters,
            events = target._yuievt.events,
            handle, thisObj, fired, argCount, testEvent;

        function callback() {
            fired = true;
            thisObj = this;
            argCount = arguments.length;
        }

        handle = target.on({ "test1": { fn: callback } }, function () {
            Y.Assert.fail("This callback should not have been called.");
        }, obj, 'ARG!');

        testEvent = events.test1;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(subscribers);
        Y.Assert.areSame(1, subscribers.length);
        Y.Assert.areSame(0, afters.length);
        Y.Assert.areSame(1, testEvent.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(1, handle.evt.length);
        Y.Assert.areSame(testEvent, handle.evt[0].evt);
        Y.Assert.isUndefined(handle.sub);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.evt[0].sub);

        target.fire("test1");

        Y.Assert.isTrue(fired);
        Y.Assert.areSame(obj, thisObj);
        Y.Assert.areSame(1, argCount);
    },

    "test target.on({ type: { fn: wins, context: wins } }, fn, ctx, args)": function () {
        var target = new Y.EventTarget(),
            obj = {},
            subs,
            subscribers,
            afters,
            events = target._yuievt.events,
            handle, thisObj, fired, argCount, testEvent;

        function callback() {
            fired = true;
            thisObj = this;
            argCount = arguments.length;
        }

        handle = target.on({ "test1": { fn: callback, context: obj } },
            function () {
                Y.Assert.fail("This callback should not have been called.");
            }, {}, 'ARG!');

        testEvent = events.test1;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(subscribers);
        Y.Assert.areSame(1, subscribers.length);
        Y.Assert.areSame(0, afters.length);
        Y.Assert.areSame(1, testEvent.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(1, handle.evt.length);
        Y.Assert.areSame(testEvent, handle.evt[0].evt);
        Y.Assert.isUndefined(handle.sub);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.evt[0].sub);

        target.fire("test1");

        Y.Assert.isTrue(fired);
        Y.Assert.areSame(obj, thisObj);
        Y.Assert.areSame(1, argCount);
    },

    "test target.on({ type: { context: wins } }, callback, ctx, args)": function () {
        var target = new Y.EventTarget(),
            obj = {},
            subs,
            subscribers,
            afters,
            events = target._yuievt.events,
            handle, thisObj, fired, argCount, testEvent;

        function callback() {
            fired = true;
            thisObj = this;
            argCount = arguments.length;
        }

        handle = target.on({ "test1": { context: obj } }, callback, {}, 'ARG!');

        testEvent = events.test1;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(subscribers);
        Y.Assert.areSame(1, subscribers.length);
        Y.Assert.areSame(0, afters.length);
        Y.Assert.areSame(1, testEvent.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(1, handle.evt.length);
        Y.Assert.areSame(testEvent, handle.evt[0].evt);
        Y.Assert.isUndefined(handle.sub);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.evt[0].sub);

        target.fire("test1");

        Y.Assert.isTrue(fired);
        Y.Assert.areSame(obj, thisObj);
        Y.Assert.areSame(1, argCount);
    },

    "test target.on(type, { handleEvents: fn })": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            subs,
            subscribers,
            afters,
            obj, handle, thisObj, fired, argCount, testEvent;

        function callback() {
            fired = true;
            thisObj = this;
            argCount = arguments.length;
        }

        obj = { handleEvents: callback };

        handle = target.on("test", obj);

        testEvent = events.test;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(subscribers);
        Y.Assert.areSame(1, subscribers.length);
        Y.Assert.areSame(0, afters.length);
        Y.Assert.areSame(1, testEvent.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.areSame(testEvent, handle.evt);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.sub);

        // Barring support, this is where the error will be thrown.
        // ET.on() doesn't verify the second arg is a function, and
        // Subscriber doesn't type check before treating it as a function.
        target.fire("test");

        Y.Assert.isTrue(fired);
        Y.Assert.areSame(obj, thisObj);
        Y.Assert.areSame(0, argCount);

        // Test that fire() did not change the subscription state of the
        // custom event
        testEvent = events.test;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(subscribers);
        Y.Assert.areSame(1, subscribers.length);
        Y.Assert.areSame(0, afters.length);
        Y.Assert.areSame(1, testEvent.hasSubs());
    },

    "test callback context": function () {
        var target = new Y.EventTarget(),
            targetCount = 0,
            objCount = 0,
            obj = {};

        function isTarget() {
            Y.Assert.areSame(target, this);
            targetCount++;
        }
        function isObj() {
            Y.Assert.areSame(obj, this);
            objCount++;
        }

        target.on("test1", isTarget);
        target.fire("test1"); // targetCount 1

        target.on("test2", isObj, obj);
        target.fire("test2"); // objCount 1

        target.on("test3", isObj, obj, {});
        target.fire("test3"); // objCount 2

        target.on("test4", isObj, obj, null, {}, {});
        target.fire("test4"); // objCount 3

        target.on("test5", isTarget, null, {});
        target.fire("test5"); // targetCount 2

        target.on("prefix:test6", isTarget);
        target.fire("prefix:test6", obj); // targetCount 3

        target.on(["test7", "prefix:test8"], isObj, obj);
        target.fire("test7"); // objCount 4
        target.fire("prefix:test8"); // objCount 5

        target.on({ "test9": isObj }, null, obj);
        target.fire("test9"); // objCount 6

        target.on({
            "test10": { fn: isTarget },
            "test11": { fn: isObj, context: obj }
        });
        target.fire("test10"); // targetCount 4
        target.fire("test11"); // objCount 7

        target.on({
            "test12": { fn: isObj },
            "prefix:test13": { fn: isTarget, context: target }
        }, null, obj);
        target.fire("test12"); // objCount 8
        target.fire("prefix:test13"); // targetCount 5

        Y.Assert.areSame(5, targetCount);
        Y.Assert.areSame(8, objCount);
    },

    "test subscription bound args": function () {
        var target = new Y.EventTarget(),
            obj = {},
            args;

        function callback() {
            args = Y.Array(arguments, 0, true);
        }

        target.on("test1", callback, {}, "a", 1, obj, null);
        target.fire("test1");
        Y.ArrayAssert.itemsAreSame(["a", 1, obj, null], args);

        target.on(["test2", "test3"], callback, null, "a", 2.3, obj, null);
        target.fire("test2");
        Y.ArrayAssert.itemsAreSame(["a", 2.3, obj, null], args);
        args = [];
        target.fire("test3");
        Y.ArrayAssert.itemsAreSame(["a", 2.3, obj, null], args);

        // ugh, requiring two placeholders for (unused) fn and context is ooogly
        target.on({
            "test4": callback,
            "test5": callback
        }, null, null, "a", 4.5, obj, null);
        target.fire("test4");
        Y.ArrayAssert.itemsAreSame(["a", 4.5, obj, null], args);
        args = [];
        target.fire("test5");
        Y.ArrayAssert.itemsAreSame(["a", 4.5, obj, null], args);

        target.on({
            "test6": true,
            "test7": false
        }, callback, {}, "a", 6.7, obj, null);
        target.fire("test6");
        Y.ArrayAssert.itemsAreSame(["a", 6.7, obj, null], args);
        args = [];
        target.fire("test7");
        Y.ArrayAssert.itemsAreSame(["a", 6.7, obj, null], args);
    },

    "test target.on('click', fn) registers custom event only": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events;

        target.on("click", function () {});

        Y.Assert.isInstanceOf(Y.CustomEvent, events.click);
        Y.Assert.isUndefined(events.click.domkey);
        Y.Assert.areSame(1, events.click._subscribers.length);
    }

}));

baseSuite.add(new Y.Test.Case({
    name: "target.after",

    _should: {
        ignore: {
            // As of 3.4.1, creates a subscription to a custom event named
            // "[object Object]"
            "test target.after([{ fn: fn, context: obj }]) does nothing": true,

            // Not (yet) implemented
            "test target.after(type, { handleEvents: fn })": true
        }
    },

    "test auto-publish on subscribe": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            publishCalled;

        target.publish = (function (original) {
            return function (type) {
                if (type === 'test') {
                    publishCalled = true;
                }
                return original.apply(this, arguments);
            };
        })(target.publish);

        Y.Assert.isUndefined(events.test);

        target.after("test", function () {});

        Y.Assert.isTrue(publishCalled);
        Y.Assert.isObject(events.test);
        Y.Assert.isInstanceOf(Y.CustomEvent, events.test);
    },

    "test target.after(type, fn)": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            subs,
            subscribers,
            afters,
            handle, thisObj, fired, argCount, testEvent;

        function callback() {
            fired = true;
            thisObj = this;
            argCount = arguments.length;
        }

        handle = target.after("test", callback);

        testEvent = events.test;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(afters);
        Y.Assert.areSame(0, subscribers.length);
        Y.Assert.areSame(1, afters.length);
        Y.Assert.areSame(1, testEvent.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.areSame(testEvent, handle.evt);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.sub);

        target.fire("test");

        Y.Assert.isTrue(fired);
        Y.Assert.areSame(target, thisObj);
        Y.Assert.areSame(0, argCount);

        // Test that fire() did not change the subscription state of the
        // custom event
        testEvent = events.test;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(afters);
        Y.Assert.areSame(0, subscribers.length);
        Y.Assert.areSame(1, afters.length);
        Y.Assert.areSame(1, testEvent.hasSubs());
    },

    "test target.after(type, fn) allows duplicate subs": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            count  = 0,
            subs,
            subscribers,
            afters,
            testEvent, handle1, handle2;

        function callback() {
            count++;
        }

        handle1 = target.after("test", callback);
        handle2 = target.after("test", callback);

        testEvent = events.test;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(afters);
        Y.Assert.areSame(0, subscribers.length);
        Y.Assert.areSame(2, afters.length);
        Y.Assert.areSame(2, testEvent.hasSubs());

        Y.Assert.areNotSame(handle1, handle2);
        Y.Assert.areSame(testEvent, handle1.evt);
        Y.Assert.areSame(handle1.evt, handle2.evt);
        Y.Assert.areNotSame(handle1.sub, handle2.sub);

        target.fire("test");

        Y.Assert.areSame(2, count);

        // Test that fire() did not change the subscription state of the
        // custom event
        testEvent = events.test;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(afters);
        Y.Assert.areSame(0, subscribers.length);
        Y.Assert.areSame(2, afters.length);
        Y.Assert.areSame(2, testEvent.hasSubs());
    },

    "test target.after(type, fn, obj)": function () {
        var target = new Y.EventTarget(),
            obj = {},
            count = 0,
            thisObj1, thisObj2, argCount, testEvent;

        function callback() {
            count++;
            thisObj1 = this;
            argCount = arguments.length;
        }

        target.after("test", callback, obj);

        target.fire("test");

        Y.Assert.areSame(1, count);
        Y.Assert.areSame(obj, thisObj1);
        Y.Assert.areSame(0, argCount);

        target.after("test", function () {
            thisObj2 = this;
        });

        target.fire("test");

        Y.Assert.areSame(2, count);
        Y.Assert.areSame(obj, thisObj1);
        Y.Assert.areSame(target, thisObj2);
        Y.Assert.areSame(0, argCount);
    },

    "test target.after(type, fn, obj, args)": function () {
        var target = new Y.EventTarget(),
            obj = {},
            count = 0,
            args = '',
            argCount,
            thisObj1, thisObj2, testEvent;

        function callback() {
            count++;
            thisObj1 = this;
            argCount = arguments.length;
            for (var i = 0, len = argCount; i < len; ++i) {
                args += arguments[i];
            }
        }

        target.after("test", callback, obj, "A");

        target.fire("test");

        Y.Assert.areSame(1, count);
        Y.Assert.areSame(obj, thisObj1);
        Y.Assert.areSame(1, argCount);
        Y.Assert.areSame("A", args);

        target.after("test", function () {
            thisObj2 = this;
        });

        target.fire("test");

        Y.Assert.areSame(2, count);
        Y.Assert.areSame(obj, thisObj1);
        Y.Assert.areSame(target, thisObj2);
    },

    "test target.after([type], fn)": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            subs,
            subscribers,
            afters,
            handle, thisObj, fired, argCount, testEvent;

        function callback() {
            fired = true;
            thisObj = this;
            argCount = arguments.length;
        }

        handle = target.after(["test"], callback);

        testEvent = events.test;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(afters);
        Y.Assert.areSame(0, subscribers.length);
        Y.Assert.areSame(1, afters.length);
        Y.Assert.areSame(1, testEvent.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(testEvent, handle.evt[0].evt);
        Y.Assert.isUndefined(handle.sub);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.evt[0].sub);

        target.fire("test");

        Y.Assert.isTrue(fired);
        Y.Assert.areSame(target, thisObj);
        Y.Assert.areSame(0, argCount);
    },

    "test target.after([typeA, typeB], fn)": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            count = 0,
            subs,
            subscribers,
            afters,
            handle, thisObj, testEvent1, testEvent2;

        function callback() {
            count++;
            thisObj = this;
        }

        handle = target.after(["test1", "test2"], callback);

        testEvent1 = events.test1;

        subs = testEvent1.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent1);
        Y.Assert.isArray(afters);
        Y.Assert.areSame(0, subscribers.length);
        Y.Assert.areSame(1, afters.length);
        Y.Assert.areSame(1, testEvent1.hasSubs());

        testEvent2 = events.test2;

        subs = testEvent2.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent2);
        Y.Assert.isArray(afters);
        Y.Assert.areSame(0, subscribers.length);
        Y.Assert.areSame(1, afters.length);
        Y.Assert.areSame(1, testEvent2.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(testEvent1, handle.evt[0].evt);
        Y.Assert.areSame(testEvent2, handle.evt[1].evt);
        Y.Assert.areNotSame(testEvent1, testEvent2);
        Y.Assert.isUndefined(handle.sub);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.evt[0].sub);

        target.fire("test1");

        Y.Assert.areSame(1, count);
        Y.Assert.areSame(target, thisObj);

        target.fire("test2");

        Y.Assert.areSame(2, count);
        Y.Assert.areSame(target, thisObj);
    },

    "test target.after([typeA, typeA], fn)": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            count = 0,
            subs,
            subscribers,
            afters,
            handle, thisObj, testEvent;

        function callback() {
            count++;
            thisObj = this;
        }

        handle = target.after(["test", "test"], callback);

        testEvent = events.test;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(afters);
        Y.Assert.areSame(0, subscribers.length);
        Y.Assert.areSame(2, afters.length);
        Y.Assert.areSame(2, testEvent.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(testEvent, handle.evt[0].evt);
        Y.Assert.areSame(testEvent, handle.evt[1].evt);
        Y.Assert.isUndefined(handle.sub);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.evt[0].sub);

        target.fire("test");

        Y.Assert.areSame(2, count);
        Y.Assert.areSame(target, thisObj);
    },

    "test target.after([], fn) does nothing": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            count = 0,
            handle, name, subs, i;

        function callback() {
            Y.Assert.fail("I don't know how this got called");
        }

        handle = target.after([], callback);

        for (name in events) {
            if (events.hasOwnProperty(name)) {
                subs = events[name]._afters;
                for (i = subs.length - 1; i >= 0; --i) {
                    if (subs[i].fn === callback) {
                        Y.Assert.fail("subscription registered for '" + name + "' event");
                    }
                }
            }
        }

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(0, handle.evt.length);
        Y.Assert.isUndefined(handle.sub);
    },

    "test target.after([{ fn: fn, context: obj }]) does nothing": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            count = 0,
            handle, name, subs, i;

        function callback() {
            Y.Assert.fail("I don't know how this got called");
        }

        handle = target.after([{ fn: callback, context: {} }]);

        for (name in events) {
            if (events.hasOwnProperty(name)) {
                subs = events[name]._afters;
                for (i = subs.length - 1; i >= 0; --i) {
                    if (subs[i].fn === callback) {
                        Y.Assert.fail("subscription registered for '" + name + "' event");
                    }
                }
            }
        }

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(0, handle.evt.length);
        Y.Assert.isUndefined(handle.sub);
    },

    "test target.after({ type: fn })": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            subs,
            subscribers,
            afters,
            handle, thisObj, fired, argCount, testEvent;

        function callback() {
            fired = true;
            thisObj = this;
            argCount = arguments.length;
        }

        handle = target.after({ "test1": callback });

        testEvent = events.test1;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(afters);
        Y.Assert.areSame(0, subscribers.length);
        Y.Assert.areSame(1, afters.length);
        Y.Assert.areSame(1, testEvent.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(1, handle.evt.length);
        Y.Assert.areSame(testEvent, handle.evt[0].evt);
        Y.Assert.isUndefined(handle.sub);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.evt[0].sub);

        target.fire("test1");

        Y.Assert.isTrue(fired);
        Y.Assert.areSame(target, thisObj);
        Y.Assert.areSame(0, argCount);

        handle = target.after({
            "test2": callback,
            "test3": callback
        });

        Y.Assert.isInstanceOf(Y.CustomEvent, events.test2);
        Y.Assert.isInstanceOf(Y.CustomEvent, events.test3);
        Y.Assert.areSame(1, events.test2._afters.length);
        Y.Assert.areSame(1, events.test3._afters.length);

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(2, handle.evt.length);
        Y.Assert.areSame(events.test2, handle.evt[0].evt);
        Y.Assert.areSame(events.test3, handle.evt[1].evt);
        Y.Assert.isUndefined(handle.sub);
    },

    "test target.after({ type: true }, fn)": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            subs,
            subscribers,
            afters,
            handle, thisObj, fired, argCount, testEvent;

        function callback() {
            fired = true;
            thisObj = this;
            argCount = arguments.length;
        }

        handle = target.after({ "test1": true }, callback);

        testEvent = events.test1;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(afters);
        Y.Assert.areSame(0, subscribers.length);
        Y.Assert.areSame(1, afters.length);
        Y.Assert.areSame(1, testEvent.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(1, handle.evt.length);
        Y.Assert.areSame(testEvent, handle.evt[0].evt);
        Y.Assert.isUndefined(handle.sub);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.evt[0].sub);

        target.fire("test1");

        Y.Assert.isTrue(fired);
        Y.Assert.areSame(target, thisObj);
        Y.Assert.areSame(0, argCount);

        handle = target.after({ "test2": 1, "test3": false }, callback);

        Y.Assert.isInstanceOf(Y.CustomEvent, events.test2);
        Y.Assert.isInstanceOf(Y.CustomEvent, events.test3);
        Y.Assert.areSame(1, events.test2._afters.length);
        Y.Assert.areSame(1, events.test3._afters.length);

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(2, handle.evt.length);
        Y.Assert.areSame(events.test2, handle.evt[0].evt);
        Y.Assert.areSame(events.test3, handle.evt[1].evt);
        Y.Assert.isUndefined(handle.sub);
    },

    "test target.after(type, { handleEvents: fn })": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            subs,
            subscribers,
            afters,
            obj, handle, thisObj, fired, argCount, testEvent;

        function callback() {
            fired = true;
            thisObj = this;
            argCount = arguments.length;
        }

        obj = { handleEvents: callback };

        handle = target.after("test", obj);

        testEvent = events.test;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(afters);
        Y.Assert.areSame(0, subscribers.length);
        Y.Assert.areSame(1, afters.length);
        Y.Assert.areSame(1, testEvent.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.areSame(testEvent, handle.evt);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.sub);

        // Barring support, this is where the error will be thrown.
        // ET.after() doesn't verify the second arg is a function, and
        // Subscriber doesn't type check before treating it as a function.
        target.fire("test");

        Y.Assert.isTrue(fired);
        Y.Assert.areSame(obj, thisObj);
        Y.Assert.areSame(0, argCount);

        // Test that fire() did not change the subscription state of the custom event
        testEvent = events.test;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(afters);
        Y.Assert.areSame(0, subscribers.length);
        Y.Assert.areSame(1, afters.length);
        Y.Assert.areSame(1, testEvent.hasSubs());
    },

    "test callback context": function () {
        var target = new Y.EventTarget(),
            targetCount = 0,
            objCount = 0,
            obj = {};

        function isTarget() {
            Y.Assert.areSame(target, this);
            targetCount++;
        }
        function isObj() {
            Y.Assert.areSame(obj, this);
            objCount++;
        }

        target.after("test1", isTarget);
        target.fire("test1");

        target.after("test2", isObj, obj);
        target.fire("test2");

        target.after("test3", isObj, obj, {});
        target.fire("test3");

        target.after("test4", isObj, obj, null, {}, {});
        target.fire("test4");

        target.after("test5", isTarget, null, {});
        target.fire("test5");

        target.after("prefix:test6", isTarget);
        target.fire("prefix:test6", obj);

        target.after(["test7", "prefix:test8"], isObj, obj);
        target.fire("test7");
        target.fire("prefix:test8");

        target.after({ "test9": isObj }, null, obj);
        target.fire("test9");

        target.after({
            "test10": { fn: isTarget },
            "test11": { fn: isObj, context: obj }
        });
        target.fire("test10");
        target.fire("test11");

        target.after({
            "test12": { fn: isObj },
            "prefix:test13": { fn: isTarget, context: target }
        }, null, obj);
        target.fire("test12");
        target.fire("prefix:test13");

        Y.Assert.areSame(5, targetCount);
        Y.Assert.areSame(8, objCount);
    },

    "test subscription bound args": function () {
        var target = new Y.EventTarget(),
            obj = {},
            args;

        function callback() {
            args = Y.Array(arguments, 0, true);
        }

        target.after("test1", callback, {}, "a", 1, obj, null);
        target.fire("test1");
        Y.ArrayAssert.itemsAreSame(["a", 1, obj, null], args);

        target.after(["test2", "test3"], callback, null, "a", 2.3, obj, null);
        target.fire("test2");
        Y.ArrayAssert.itemsAreSame(["a", 2.3, obj, null], args);
        args = [];
        target.fire("test3");
        Y.ArrayAssert.itemsAreSame(["a", 2.3, obj, null], args);

        // ugh, requiring two placeholders for (unused) fn and context is ooogly
        target.after({
            "test4": callback,
            "test5": callback
        }, null, null, "a", 4.5, obj, null);
        target.fire("test4");
        Y.ArrayAssert.itemsAreSame(["a", 4.5, obj, null], args);
        args = [];
        target.fire("test5");
        Y.ArrayAssert.itemsAreSame(["a", 4.5, obj, null], args);

        target.after({
            "test6": true,
            "test7": false
        }, callback, {}, "a", 6.7, obj, null);
        target.fire("test6");
        Y.ArrayAssert.itemsAreSame(["a", 6.7, obj, null], args);
        args = [];
        target.fire("test7");
        Y.ArrayAssert.itemsAreSame(["a", 6.7, obj, null], args);
    },

    "test target.after('click', fn) registers custom event only": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events;

        target.after("click", function () {});

        Y.Assert.isInstanceOf(Y.CustomEvent, events.click);
        Y.Assert.isUndefined(events.click.domkey);
        Y.Assert.areSame(1, events.click._afters.length);
    }

}));

baseSuite.add(new Y.Test.Case({
    name: "target.once",

    _should: {
        ignore: {
            // As of 3.4.1, creates a subscription to a custom event named
            // "[object Object]"
            "test target.once([{ fn: fn, context: obj }]) does nothing": true,

            // Not (yet) implemented
            "test target.once(type, { handleEvents: fn })": true
        }
    },

    "test auto-publish on subscribe": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            publishCalled;

        target.publish = (function (original) {
            return function (type) {
                if (type === 'test') {
                    publishCalled = true;
                }
                return original.apply(this, arguments);
            };
        })(target.publish);

        Y.Assert.isUndefined(events.test);

        target.once("test", function () {});

        Y.Assert.isTrue(publishCalled);
        Y.Assert.isObject(events.test);
        Y.Assert.isInstanceOf(Y.CustomEvent, events.test);
    },

    "test target.once(type, fn)": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            subs,
            subscribers,
            afters,
            handle, thisObj, fired, argCount, testEvent;

        function callback() {
            fired = true;
            thisObj = this;
            argCount = arguments.length;
        }

        handle = target.once("test", callback);

        testEvent = events.test;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(subscribers);
        Y.Assert.areSame(1, subscribers.length);
        Y.Assert.areSame(0, afters.length);
        Y.Assert.areSame(1, testEvent.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.areSame(testEvent, handle.evt);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.sub);

        target.fire("test");

        Y.Assert.isTrue(fired);
        Y.Assert.areSame(target, thisObj);
        Y.Assert.areSame(0, argCount);

        // Test that fire() resulted in immediate detach of once() sub
        testEvent = events.test;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(subscribers);
        Y.Assert.areSame(0, subscribers.length);
        Y.Assert.areSame(0, afters.length);
        Y.Assert.areSame(0, testEvent.hasSubs());
    },

    "test target.once(type, fn) allows duplicate subs": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            count  = 0,
            subs,
            subscribers,
            afters,
            testEvent, handle1, handle2;

        function callback() {
            count++;
        }

        handle1 = target.once("test", callback);
        handle2 = target.once("test", callback);

        testEvent = events.test;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(subscribers);
        Y.Assert.areSame(2, subscribers.length);
        Y.Assert.areSame(0, afters.length);
        Y.Assert.areSame(2, testEvent.hasSubs());

        Y.Assert.areNotSame(handle1, handle2);
        Y.Assert.areSame(testEvent, handle1.evt);
        Y.Assert.areSame(handle1.evt, handle2.evt);
        Y.Assert.areNotSame(handle1.sub, handle2.sub);

        target.fire("test");

        Y.Assert.areSame(2, count);

        // Test that fire() resulted in immediate detach of once() sub
        testEvent = events.test;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(subscribers);
        Y.Assert.areSame(0, subscribers.length);
        Y.Assert.areSame(0, afters.length);
        Y.Assert.areSame(0, testEvent.hasSubs());

        target.fire("test");

        Y.Assert.areSame(2, count);
    },

    "test target.once(type, fn, obj)": function () {
        var target = new Y.EventTarget(),
            obj = {},
            count = 0,
            thisObj1, thisObj2, argCount, testEvent;

        function callback() {
            count++;
            thisObj1 = this;
            argCount = arguments.length;
        }

        target.once("test", callback, obj);

        target.fire("test");

        Y.Assert.areSame(1, count);
        Y.Assert.areSame(obj, thisObj1);
        Y.Assert.areSame(0, argCount);

        // Subscriber should be detached, so count should not increment
        target.fire("test");

        Y.Assert.areSame(1, count);

        target.once("test", function () {
            thisObj2 = this;
        });

        target.fire("test");

        Y.Assert.areSame(1, count);
        Y.Assert.areSame(obj, thisObj1);
        Y.Assert.areSame(target, thisObj2);

        // Subscriber should be detached, so count should not increment
        target.fire("test");

        Y.Assert.areSame(1, count);
    },

    "test target.once(type, fn, obj, args)": function () {
        var target = new Y.EventTarget(),
            obj = {},
            count = 0,
            args = '',
            argCount,
            thisObj1, thisObj2, testEvent;

        function callback() {
            count++;
            thisObj1 = this;
            argCount = arguments.length;
            for (var i = 0, len = argCount; i < len; ++i) {
                args += arguments[i];
            }
        }

        target.once("test", callback, obj, "A");

        target.fire("test");

        Y.Assert.areSame(1, count);
        Y.Assert.areSame(obj, thisObj1);
        Y.Assert.areSame("A", args);

        // Subscriber should be detached, so count should not increment
        target.fire("test");

        Y.Assert.areSame(1, count);

        target.once("test", function () {
            thisObj2 = this;
        });

        target.fire("test");

        Y.Assert.areSame(1, count);
        Y.Assert.areSame(obj, thisObj1);
        Y.Assert.areSame(target, thisObj2);

        // Subscriber should be detached, so count should not increment
        target.fire("test");

        Y.Assert.areSame(1, count);
    },

    "test target.once([type], fn)": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            subs,
            subscribers,
            afters,
            handle, thisObj, fired, argCount, testEvent;

        function callback() {
            fired = true;
            thisObj = this;
            argCount = arguments.length;
        }

        handle = target.once(["test"], callback);

        testEvent = events.test;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);

        Y.Assert.isArray(subscribers);
        Y.Assert.areSame(1, subscribers.length);
        Y.Assert.areSame(0, afters.length);
        Y.Assert.areSame(1, testEvent.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(testEvent, handle.evt[0].evt);
        Y.Assert.isUndefined(handle.sub);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.evt[0].sub);

        target.fire("test");

        Y.Assert.isTrue(fired);
        Y.Assert.areSame(target, thisObj);
        Y.Assert.areSame(0, argCount);
        Y.Assert.areSame(0, testEvent._subscribers && testEvent._subscribers.length);

        fired = false;

        target.fire("test");

        Y.Assert.isFalse(fired);
    },

    "test target.once([typeA, typeB], fn)": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            count = 0,
            subs,
            subscribers,
            afters,
            handle, thisObj, testEvent1, testEvent2;

        function callback() {
            count++;
            thisObj = this;
        }

        handle = target.once(["test1", "test2"], callback);

        testEvent1 = events.test1;

        subs = testEvent1.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent1);
        Y.Assert.isArray(subscribers);
        Y.Assert.areSame(1, subscribers.length);
        Y.Assert.areSame(0, afters.length);
        Y.Assert.areSame(1, testEvent1.hasSubs());

        testEvent2 = events.test2;

        subs = testEvent2.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent2);
        Y.Assert.isArray(subscribers);
        Y.Assert.areSame(1, subscribers.length);
        Y.Assert.areSame(0, afters.length);
        Y.Assert.areSame(1, testEvent2.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(testEvent1, handle.evt[0].evt);
        Y.Assert.areSame(testEvent2, handle.evt[1].evt);
        Y.Assert.areNotSame(testEvent1, testEvent2);
        Y.Assert.isUndefined(handle.sub);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.evt[0].sub);

        target.fire("test1");

        Y.Assert.areSame(1, count);
        Y.Assert.areSame(target, thisObj);
        Y.Assert.areSame(0, testEvent1._subscribers && testEvent1._subscribers.length);

        target.fire("test2");

        Y.Assert.areSame(2, count);
        Y.Assert.areSame(target, thisObj);
        Y.Assert.areSame(0, testEvent2._subscribers && testEvent2._subscribers.length);
    },

    "test target.once([typeA, typeA], fn)": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            subs,
            subscribers,
            afters,
            count = 0,
            handle, thisObj, testEvent;

        function callback() {
            count++;
            thisObj = this;
        }

        handle = target.once(["test", "test"], callback);

        testEvent = events.test;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(subscribers);
        Y.Assert.areSame(2, subscribers.length);
        Y.Assert.areSame(0, afters.length);
        Y.Assert.areSame(2, testEvent.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(testEvent, handle.evt[0].evt);
        Y.Assert.areSame(testEvent, handle.evt[1].evt);
        Y.Assert.isUndefined(handle.sub);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.evt[0].sub);

        target.fire("test");

        Y.Assert.areSame(2, count);
        Y.Assert.areSame(target, thisObj);
        Y.Assert.areSame(0, testEvent._subscribers && testEvent._subscribers.length);
    },

    "test target.once([], fn) does nothing": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            count = 0,
            handle, name, subs, i;

        function callback() {
            Y.Assert.fail("I don't know how this got called");
        }

        handle = target.once([], callback);

        for (name in events) {
            if (events.hasOwnProperty(name)) {
                subs = events[name]._subscribers;
                if (subs) {
                    for (i = subs.length - 1; i >= 0; --i) {
                        if (subs[i].fn === callback) {
                            Y.Assert.fail("subscription registered for '" + name + "' event");
                        }
                    }
                }
            }
        }

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(0, handle.evt.length);
        Y.Assert.isUndefined(handle.sub);
    },

    "test target.once([{ fn: fn, context: obj }]) does nothing": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            count = 0,
            handle, name, subs, i;

        function callback() {
            Y.Assert.fail("I don't know how this got called");
        }

        handle = target.once([{ fn: callback, context: {} }]);

        for (name in events) {
            if (events.hasOwnProperty(name)) {
                subs = events[name]._subscribers;
                if (subs) {
                    for (i = subs.length - 1; i >= 0; --i) {
                        if (subs[i].fn === callback) {
                            Y.Assert.fail("subscription registered for '" + name + "' event");
                        }
                    }
                }
            }
        }

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(0, handle.evt.length);
        Y.Assert.isUndefined(handle.sub);
    },

    "test target.once({ type: fn })": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            subs,
            subscribers,
            afters,
            handle, thisObj, fired, argCount, testEvent;

        function callback() {
            fired = true;
            thisObj = this;
            argCount = arguments.length;
        }

        handle = target.once({ "test1": callback });

        testEvent = events.test1;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(subscribers);
        Y.Assert.areSame(1, subscribers.length);
        Y.Assert.areSame(0, afters.length);
        Y.Assert.areSame(1, testEvent.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(1, handle.evt.length);
        Y.Assert.areSame(testEvent, handle.evt[0].evt);
        Y.Assert.isUndefined(handle.sub);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.evt[0].sub);

        target.fire("test1");

        Y.Assert.isTrue(fired);
        Y.Assert.areSame(target, thisObj);
        Y.Assert.areSame(0, argCount);
        Y.Assert.areSame(0, testEvent._subscribers && testEvent._subscribers.length);

        handle = target.once({
            "test2": callback,
            "test3": callback
        });

        Y.Assert.isInstanceOf(Y.CustomEvent, events.test2);
        Y.Assert.isInstanceOf(Y.CustomEvent, events.test3);
        Y.Assert.areSame(1, events.test2._subscribers.length);
        Y.Assert.areSame(1, events.test3._subscribers.length);

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(2, handle.evt.length);
        Y.Assert.areSame(events.test2, handle.evt[0].evt);
        Y.Assert.areSame(events.test3, handle.evt[1].evt);
        Y.Assert.isUndefined(handle.sub);

        target.fire("test2");

        Y.Assert.areSame(0, events.test2._subscribers && events.test2._subscribers.length);
        Y.Assert.areSame(1, events.test3._subscribers.length);

        target.fire("test3");

        Y.Assert.areSame(0, events.test2._subscribers && events.test2._subscribers.length);
        Y.Assert.areSame(0, events.test3._subscribers && events.test3._subscribers.length);
    },

    "test target.once({ type: true }, fn)": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            subs,
            subscribers,
            afters,
            handle, thisObj, fired, argCount, testEvent;

        function callback() {
            fired = true;
            thisObj = this;
            argCount = arguments.length;
        }

        handle = target.once({ "test1": true }, callback);

        testEvent = events.test1;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(subscribers);
        Y.Assert.areSame(1, subscribers.length);
        Y.Assert.areSame(0, afters.length);
        Y.Assert.areSame(1, testEvent.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(1, handle.evt.length);
        Y.Assert.areSame(testEvent, handle.evt[0].evt);
        Y.Assert.isUndefined(handle.sub);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.evt[0].sub);

        target.fire("test1");

        Y.Assert.isTrue(fired);
        Y.Assert.areSame(target, thisObj);
        Y.Assert.areSame(0, argCount);
        Y.Assert.areSame(0, testEvent._subscribers && testEvent._subscribers.length);

        handle = target.once({ "test2": 1, "test3": false }, callback);

        Y.Assert.isInstanceOf(Y.CustomEvent, events.test2);
        Y.Assert.isInstanceOf(Y.CustomEvent, events.test3);
        Y.Assert.areSame(1, events.test2._subscribers.length);
        Y.Assert.areSame(1, events.test3._subscribers.length);

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(2, handle.evt.length);
        Y.Assert.areSame(events.test2, handle.evt[0].evt);
        Y.Assert.areSame(events.test3, handle.evt[1].evt);
        Y.Assert.isUndefined(handle.sub);

        target.fire("test2");

        Y.Assert.areSame(0, events.test2._subscribers && events.test2._subscribers.length);
        Y.Assert.areSame(1, events.test3._subscribers && events.test3._subscribers.length);

        target.fire("test3");

        Y.Assert.areSame(0, events.test2._subscribers && events.test2._subscribers.length);
        Y.Assert.areSame(0, events.test3._subscribers && events.test3._subscribers.length);
    },

    "test target.once(type, { handleEvents: fn })": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            subs,
            subscribers,
            afters,
            obj, handle, thisObj, fired, argCount, testEvent;

        function callback() {
            fired = true;
            thisObj = this;
            argCount = arguments.length;
        }

        obj = { handleEvents: callback };

        handle = target.once("test", obj);

        testEvent = events.test;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(subscribers);
        Y.Assert.areSame(1, subscribers.length);
        Y.Assert.areSame(0, afters.length);
        Y.Assert.areSame(1, testEvent.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.areSame(testEvent, handle.evt);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.sub);

        // Barring support, this is where the error will be thrown.
        // ET.once() doesn't verify the second arg is a function, and
        // Subscriber doesn't type check before treating it as a function.
        target.fire("test");

        Y.Assert.isTrue(fired);
        Y.Assert.areSame(obj, thisObj);
        Y.Assert.areSame(0, argCount);

        // Fire should immediate detach the subscription
        testEvent = events.test;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(subscribers);
        Y.Assert.areSame(0, subscribers.length);
        Y.Assert.areSame(0, afters.length);
        Y.Assert.areSame(1, testEvent.hasSubs());
    },

    "test callback context": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            targetCount = 0,
            objCount = 0,
            obj = {};

        function isTarget() {
            Y.Assert.areSame(target, this);
            targetCount++;
        }
        function isObj() {
            Y.Assert.areSame(obj, this);
            objCount++;
        }

        target.once("test1", isTarget);
        target.fire("test1");

        Y.Assert.areSame(1, targetCount);
        Y.Assert.areSame(0, objCount);

        target.once("test2", isObj, obj);
        target.fire("test2");

        Y.Assert.areSame(1, targetCount);
        Y.Assert.areSame(1, objCount);

        target.once("test3", isObj, obj, {});
        target.fire("test3");

        Y.Assert.areSame(1, targetCount);
        Y.Assert.areSame(2, objCount);

        target.once("test4", isObj, obj, null, {}, {});
        target.fire("test4");

        Y.Assert.areSame(1, targetCount);
        Y.Assert.areSame(3, objCount);

        target.once("test5", isTarget, null, {});
        target.fire("test5");

        Y.Assert.areSame(2, targetCount);
        Y.Assert.areSame(3, objCount);

        target.once("prefix:test6", isTarget);
        target.fire("prefix:test6", obj);

        Y.Assert.areSame(3, targetCount);
        Y.Assert.areSame(3, objCount);

        target.once(["test7", "prefix:test8"], isObj, obj);
        target.fire("test7");
        target.fire("prefix:test8");

        Y.Assert.areSame(3, targetCount);
        Y.Assert.areSame(5, objCount);

        target.once({ "test9": isObj }, null, obj);
        target.fire("test9");

        Y.Assert.areSame(3, targetCount);
        Y.Assert.areSame(6, objCount);

        target.once({
            "test10": { fn: isTarget },
            "test11": { fn: isObj, context: obj }
        });
        target.fire("test10");
        target.fire("test11");

        Y.Assert.areSame(4, targetCount);
        Y.Assert.areSame(7, objCount);

        target.once({
            "test12": { fn: isObj },
            "prefix:test13": { fn: isTarget, context: target }
        }, null, obj);
        target.fire("test12");
        target.fire("prefix:test13");

        Y.Assert.areSame(5, targetCount);
        Y.Assert.areSame(8, objCount);

        Y.Assert.areSame(0, events.test1._subscribers && events.test1._subscribers.length);
        Y.Assert.areSame(0, events.test2._subscribers && events.test2._subscribers.length);
        Y.Assert.areSame(0, events.test3._subscribers && events.test3._subscribers.length);
        Y.Assert.areSame(0, events.test4._subscribers && events.test4._subscribers.length);
        Y.Assert.areSame(0, events.test5._subscribers && events.test5._subscribers.length);
        Y.Assert.areSame(0, events['prefix:test6']._subscribers && events['prefix:test6']._subscribers.length);
        Y.Assert.areSame(0, events.test7._subscribers && events.test7._subscribers.length);
        Y.Assert.areSame(0, events['prefix:test8']._subscribers && events['prefix:test8']._subscribers.length);
        Y.Assert.areSame(0, events.test9._subscribers && events.test9._subscribers.length);
        Y.Assert.areSame(0, events.test10._subscribers && events.test10._subscribers.length);
        Y.Assert.areSame(0, events.test11._subscribers && events.test11._subscribers.length);
        Y.Assert.areSame(0, events.test12._subscribers && events.test12._subscribers.length);
        Y.Assert.areSame(0, events['prefix:test13']._subscribers && events['prefix:test13']._subscribers.length);
    },

    "test subscription bound args": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            obj = {},
            args;

        function callback() {
            args = Y.Array(arguments, 0, true);
        }

        target.once("test1", callback, {}, "a", 1, obj, null);
        target.fire("test1");
        Y.ArrayAssert.itemsAreSame(["a", 1, obj, null], args);

        target.once(["test2", "test3"], callback, null, "a", 2.3, obj, null);
        target.fire("test2");
        Y.ArrayAssert.itemsAreSame(["a", 2.3, obj, null], args);
        args = [];
        target.fire("test3");
        Y.ArrayAssert.itemsAreSame(["a", 2.3, obj, null], args);

        // ugh, requiring two placeholders for (unused) fn and context is ooogly
        target.once({
            "test4": callback,
            "test5": callback
        }, null, null, "a", 4.5, obj, null);
        target.fire("test4");
        Y.ArrayAssert.itemsAreSame(["a", 4.5, obj, null], args);
        args = [];
        target.fire("test5");
        Y.ArrayAssert.itemsAreSame(["a", 4.5, obj, null], args);

        target.once({
            "test6": true,
            "test7": false
        }, callback, {}, "a", 6.7, obj, null);
        target.fire("test6");
        Y.ArrayAssert.itemsAreSame(["a", 6.7, obj, null], args);
        args = [];
        target.fire("test7");
        Y.ArrayAssert.itemsAreSame(["a", 6.7, obj, null], args);

        Y.Assert.areSame(0, events.test1._subscribers && events.test1._subscribers.length);
        Y.Assert.areSame(0, events.test2._subscribers && events.test2._subscribers.length);
        Y.Assert.areSame(0, events.test3._subscribers && events.test3._subscribers.length);
        Y.Assert.areSame(0, events.test4._subscribers && events.test4._subscribers.length);
        Y.Assert.areSame(0, events.test5._subscribers && events.test5._subscribers.length);
        Y.Assert.areSame(0, events.test6._subscribers && events.test6._subscribers.length);
        Y.Assert.areSame(0, events.test7._subscribers && events.test7._subscribers.length);
    },

    "test target.once('click', fn) registers custom event only": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            fired = false;

        target.once("click", function () {
            fired = true;
            // Not an emitFacade event, so there's no e to verify type
        });

        Y.Assert.isInstanceOf(Y.CustomEvent, events.click);
        Y.Assert.isUndefined(events.click.domkey);
        Y.Assert.areSame(1, events.click._subscribers.length);

        target.fire("click");

        Y.Assert.isTrue(fired);
        Y.Assert.areSame(0, events.click._subscribers && events.click._subscribers.length);
    }
}));

baseSuite.add(new Y.Test.Case({
    name: "target.onceAfter",

    _should: {
        ignore: {
            // As of 3.4.1, creates a subscription to a custom event named
            // "[object Object]"
            "test target.onceAfter([{ fn: fn, context: obj }]) does nothing": true,
            // Not (yet) implemented
            "test target.onceAfter(type, { handleEvents: fn })": true
        }
    },

    test_onceAfter: function () {
        var a = new Y.EventTarget({ emitFacade: true, prefix: 'a' }),
            result = '';

        a.on('foo', function () { result += 'A'; });
        a.once('foo', function () { result += 'B'; });
        a.after('foo', function () { result += 'C'; });
        a.onceAfter('foo', function () { result += 'D'; });

        a.fire('foo');
        a.fire('foo');

        Y.Assert.areSame("ABCDAC", result);
    },

    "test auto-publish on subscribe": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            publishCalled;

        target.publish = (function (original) {
            return function (type) {
                if (type === 'test') {
                    publishCalled = true;
                }
                return original.apply(this, arguments);
            };
        })(target.publish);

        Y.Assert.isUndefined(events.test);

        target.onceAfter("test", function () {});

        Y.Assert.isTrue(publishCalled);
        Y.Assert.isObject(events.test);
        Y.Assert.isInstanceOf(Y.CustomEvent, events.test);
    },

    "test target.onceAfter(type, fn)": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            subs,
            subscribers,
            afters,
            handle, thisObj, fired, argCount, testEvent;

        function callback() {
            fired = true;
            thisObj = this;
            argCount = arguments.length;
        }

        handle = target.onceAfter("test", callback);

        testEvent = events.test;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(afters);
        Y.Assert.areSame(0, subscribers.length);
        Y.Assert.areSame(1, afters.length);
        Y.Assert.areSame(1, testEvent.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.areSame(testEvent, handle.evt);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.sub);

        target.fire("test");

        Y.Assert.isTrue(fired);
        Y.Assert.areSame(target, thisObj);
        Y.Assert.areSame(0, argCount);

        // Test that fire() resulted in immediate detach of onceAfter() sub
        testEvent = events.test;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(afters);
        Y.Assert.areSame(0, subscribers.length);
        Y.Assert.areSame(0, afters.length);
        Y.Assert.areSame(0, testEvent.hasSubs());
    },

    "test target.onceAfter(type, fn) allows duplicate subs": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            count  = 0,
            subs,
            subscribers,
            afters,
            testEvent, handle1, handle2;

        function callback() {
            count++;
        }

        handle1 = target.onceAfter("test", callback);
        handle2 = target.onceAfter("test", callback);

        testEvent = events.test;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(afters);

        Y.Assert.areSame(0, subscribers.length);
        Y.Assert.areSame(2, afters.length);
        Y.Assert.areSame(2, testEvent.hasSubs());

        Y.Assert.areNotSame(handle1, handle2);
        Y.Assert.areSame(testEvent, handle1.evt);
        Y.Assert.areSame(handle1.evt, handle2.evt);
        Y.Assert.areNotSame(handle1.sub, handle2.sub);

        target.fire("test");

        Y.Assert.areSame(2, count);

        // Test that fire() resulted in immediate detach of onceAfter() sub
        testEvent = events.test;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(afters);
        Y.Assert.areSame(0, subscribers.length);
        Y.Assert.areSame(0, afters.length);
        Y.Assert.areSame(0, testEvent.hasSubs());

        target.fire("test");

        Y.Assert.areSame(2, count);
    },

    "test target.onceAfter(type, fn, obj)": function () {
        var target = new Y.EventTarget(),
            obj = {},
            count = 0,
            thisObj1, thisObj2, argCount, testEvent;

        function callback() {
            count++;
            thisObj1 = this;
            argCount = arguments.length;
        }

        target.onceAfter("test", callback, obj);

        target.fire("test");

        Y.Assert.areSame(1, count);
        Y.Assert.areSame(obj, thisObj1);
        Y.Assert.areSame(0, argCount);

        // Subscriber should be detached, so count should not increment
        target.fire("test");

        Y.Assert.areSame(1, count);

        target.onceAfter("test", function () {
            thisObj2 = this;
        });

        target.fire("test");

        Y.Assert.areSame(1, count);
        Y.Assert.areSame(obj, thisObj1);
        Y.Assert.areSame(target, thisObj2);

        // Subscriber should be detached, so count should not increment
        target.fire("test");

        Y.Assert.areSame(1, count);
    },

    "test target.onceAfter(type, fn, obj, args)": function () {
        var target = new Y.EventTarget(),
            obj = {},
            count = 0,
            args = '',
            argCount,
            thisObj1, thisObj2, testEvent;

        function callback() {
            count++;
            thisObj1 = this;
            argCount = arguments.length;
            for (var i = 0, len = argCount; i < len; ++i) {
                args += arguments[i];
            }
        }

        target.onceAfter("test", callback, obj, "A");

        target.fire("test");

        Y.Assert.areSame(1, count);
        Y.Assert.areSame(obj, thisObj1);
        Y.Assert.areSame("A", args);

        // Subscriber should be detached, so count should not increment
        target.fire("test");

        Y.Assert.areSame(1, count);

        target.onceAfter("test", function () {
            thisObj2 = this;
        });

        target.fire("test");

        Y.Assert.areSame(1, count);
        Y.Assert.areSame(obj, thisObj1);
        Y.Assert.areSame(target, thisObj2);

        // Subscriber should be detached, so count should not increment
        target.fire("test");

        Y.Assert.areSame(1, count);
    },

    "test target.onceAfter([type], fn)": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            subs,
            subscribers,
            afters,
            handle, thisObj, fired, argCount, testEvent;

        function callback() {
            fired = true;
            thisObj = this;
            argCount = arguments.length;
        }

        handle = target.onceAfter(["test"], callback);

        testEvent = events.test;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(afters);
        Y.Assert.areSame(0, subscribers.length);
        Y.Assert.areSame(1, afters.length);
        Y.Assert.areSame(1, testEvent.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(testEvent, handle.evt[0].evt);
        Y.Assert.isUndefined(handle.sub);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.evt[0].sub);

        target.fire("test");

        Y.Assert.isTrue(fired);
        Y.Assert.areSame(target, thisObj);
        Y.Assert.areSame(0, argCount);
        Y.Assert.areSame(0, testEvent._afters.length);

        fired = false;

        target.fire("test");

        Y.Assert.isFalse(fired);
    },

    "test target.onceAfter([typeA, typeB], fn)": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            count = 0,
            subs,
            subscribers,
            afters,
            handle,
            thisObj,
            testEvent1,
            testEvent2;

        function callback() {
            count++;
            thisObj = this;
        }

        handle = target.onceAfter(["test1", "test2"], callback);

        testEvent1 = events.test1;

        subs = testEvent1.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent1);
        Y.Assert.isArray(afters);
        Y.Assert.areSame(0, subscribers.length);
        Y.Assert.areSame(1, afters.length);
        Y.Assert.areSame(1, testEvent1.hasSubs());

        testEvent2 = events.test2;

        subs = testEvent2.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent2);
        Y.Assert.isArray(afters);
        Y.Assert.areSame(0,subscribers.length);
        Y.Assert.areSame(1, afters.length);
        Y.Assert.areSame(1, testEvent2.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(testEvent1, handle.evt[0].evt);
        Y.Assert.areSame(testEvent2, handle.evt[1].evt);
        Y.Assert.areNotSame(testEvent1, testEvent2);
        Y.Assert.isUndefined(handle.sub);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.evt[0].sub);

        target.fire("test1");

        Y.Assert.areSame(1, count);
        Y.Assert.areSame(target, thisObj);
        Y.Assert.areSame(0, testEvent1._afters && testEvent1._afters.length);

        target.fire("test2");

        Y.Assert.areSame(2, count);
        Y.Assert.areSame(target, thisObj);
        Y.Assert.areSame(0, testEvent2._afters.length);
    },

    "test target.onceAfter([typeA, typeA], fn)": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            count = 0,
            subs,
            subscribers,
            afters,
            handle, thisObj, testEvent;

        function callback() {
            count++;
            thisObj = this;
        }

        handle = target.onceAfter(["test", "test"], callback);

        testEvent = events.test;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(afters);
        Y.Assert.areSame(0, subscribers.length);
        Y.Assert.areSame(2, afters.length);
        Y.Assert.areSame(2, testEvent.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(testEvent, handle.evt[0].evt);
        Y.Assert.areSame(testEvent, handle.evt[1].evt);
        Y.Assert.isUndefined(handle.sub);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.evt[0].sub);

        target.fire("test");

        Y.Assert.areSame(2, count);
        Y.Assert.areSame(target, thisObj);
        Y.Assert.areSame(0, testEvent._afters && testEvent._afters.length);
    },

    "test target.onceAfter([], fn) does nothing": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            count = 0,
            handle, name, subs, i;

        function callback() {
            Y.Assert.fail("I don't know how this got called");
        }

        handle = target.onceAfter([], callback);

        for (name in events) {
            if (events.hasOwnProperty(name)) {
                subs = events[name]._afters;
                for (i = subs.length - 1; i >= 0; --i) {
                    if (subs[i].fn === callback) {
                        Y.Assert.fail("subscription registered for '" + name + "' event");
                    }
                }
            }
        }

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(0, handle.evt.length);
        Y.Assert.isUndefined(handle.sub);
    },

    "test target.onceAfter([{ fn: fn, context: obj }]) does nothing": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            count = 0,
            handle, name, subs, i;

        function callback() {
            Y.Assert.fail("I don't know how this got called");
        }

        handle = target.onceAfter([{ fn: callback, context: {} }]);

        for (name in events) {
            if (events.hasOwnProperty(name)) {
                subs = events[name]._afters;
                for (i = subs.length - 1; i >= 0; --i) {
                    if (subs[i].fn === callback) {
                        Y.Assert.fail("subscription registered for '" + name + "' event");
                    }
                }
            }
        }

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(0, handle.evt.length);
        Y.Assert.isUndefined(handle.sub);
    },

    "test target.onceAfter({ type: fn })": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            subs,
            subscribers,
            afters,
            handle, thisObj, fired, argCount, testEvent;

        function callback() {
            fired = true;
            thisObj = this;
            argCount = arguments.length;
        }

        handle = target.onceAfter({ "test1": callback });

        testEvent = events.test1;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(afters);
        Y.Assert.areSame(0, subscribers.length);
        Y.Assert.areSame(1, afters.length);
        Y.Assert.areSame(1, testEvent.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(1, handle.evt.length);
        Y.Assert.areSame(testEvent, handle.evt[0].evt);
        Y.Assert.isUndefined(handle.sub);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.evt[0].sub);

        target.fire("test1");

        Y.Assert.isTrue(fired);
        Y.Assert.areSame(target, thisObj);
        Y.Assert.areSame(0, argCount);
        Y.Assert.areSame(0, testEvent._afters.length);

        handle = target.onceAfter({
            "test2": callback,
            "test3": callback
        });

        Y.Assert.isInstanceOf(Y.CustomEvent, events.test2);
        Y.Assert.isInstanceOf(Y.CustomEvent, events.test3);
        Y.Assert.areSame(1, events.test2._afters.length);
        Y.Assert.areSame(1, events.test3._afters.length);

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(2, handle.evt.length);
        Y.Assert.areSame(events.test2, handle.evt[0].evt);
        Y.Assert.areSame(events.test3, handle.evt[1].evt);
        Y.Assert.isUndefined(handle.sub);

        target.fire("test2");

        Y.Assert.areSame(0, events.test2._afters.length);
        Y.Assert.areSame(1, events.test3._afters.length);

        target.fire("test3");

        Y.Assert.areSame(0, events.test2._afters.length);
        Y.Assert.areSame(0, events.test3._afters.length);
    },

    "test target.onceAfter({ type: true }, fn)": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            subs,
            subscribers,
            after,
            handle,
            thisObj,
            fired,
            argCount,
            testEvent;

        function callback() {
            fired = true;
            thisObj = this;
            argCount = arguments.length;
        }

        handle = target.onceAfter({ "test1": true }, callback);

        testEvent = events.test1;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(afters);
        Y.Assert.areSame(0, subscribers.length);
        Y.Assert.areSame(1, afters.length);
        Y.Assert.areSame(1, testEvent.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(1, handle.evt.length);
        Y.Assert.areSame(testEvent, handle.evt[0].evt);
        Y.Assert.isUndefined(handle.sub);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.evt[0].sub);

        target.fire("test1");

        Y.Assert.isTrue(fired);
        Y.Assert.areSame(target, thisObj);
        Y.Assert.areSame(0, argCount);
        Y.Assert.areSame(0, testEvent._afters.length);

        handle = target.onceAfter({ "test2": 1, "test3": false }, callback);

        Y.Assert.isInstanceOf(Y.CustomEvent, events.test2);
        Y.Assert.isInstanceOf(Y.CustomEvent, events.test3);
        Y.Assert.areSame(1, events.test2._afters.length);
        Y.Assert.areSame(1, events.test3._afters.length);

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(2, handle.evt.length);
        Y.Assert.areSame(events.test2, handle.evt[0].evt);
        Y.Assert.areSame(events.test3, handle.evt[1].evt);
        Y.Assert.isUndefined(handle.sub);

        target.fire("test2");

        Y.Assert.areSame(0, events.test2._afters.length);
        Y.Assert.areSame(1, events.test3._afters.length);

        target.fire("test3");

        Y.Assert.areSame(0, events.test2._afters.length);
        Y.Assert.areSame(0, events.test3._afters.length);
    },

    "test target.onceAfter(type, { handleEvents: fn })": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            subs,
            subscribers,
            afters,
            obj, handle, thisObj, fired, argCount, testEvent;

        function callback() {
            fired = true;
            thisObj = this;
            argCount = arguments.length;
        }

        obj = { handleEvents: callback };

        handle = target.onceAfter("test", obj);

        testEvent = events.test;

        subs = testEvent.getSubs();
        subscribers = subs[0];
        afters = subs[1];

        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(testEvent._afters);
        Y.Assert.areSame(0, testEvent._subscribers.length);
        Y.Assert.areSame(1, testEvent._afters.length);
        Y.Assert.areSame(1, testEvent.hasSubs());

        Y.Assert.isInstanceOf(Y.EventHandle, handle);
        Y.Assert.areSame(testEvent, handle.evt);
        Y.Assert.isInstanceOf(Y.Subscriber, handle.sub);

        // Barring support, this is where the error will be thrown.
        // ET.onceAfter() doesn't verify the second arg is a function, and
        // Subscriber doesn't type check before treating it as a function.
        target.fire("test");

        Y.Assert.isTrue(fired);
        Y.Assert.areSame(obj, thisObj);
        Y.Assert.areSame(0, argCount);

        // Fire should immediate detach the subscription
        testEvent = events.test;
        Y.Assert.isInstanceOf(Y.CustomEvent, testEvent);
        Y.Assert.isArray(testEvent._afters);
        Y.Assert.areSame(0, testEvent._subscribers.length);
        Y.Assert.areSame(0, testEvent._afters.length);
        Y.Assert.areSame(0, testEvent.hasSubs());
    },

    "test callback context": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            targetCount = 0,
            objCount = 0,
            obj = {};

        function isTarget() {
            Y.Assert.areSame(target, this);
            targetCount++;
        }
        function isObj() {
            Y.Assert.areSame(obj, this);
            objCount++;
        }

        target.onceAfter("test1", isTarget);
        target.fire("test1");

        Y.Assert.areSame(1, targetCount);
        Y.Assert.areSame(0, objCount);

        target.onceAfter("test2", isObj, obj);
        target.fire("test2");

        Y.Assert.areSame(1, targetCount);
        Y.Assert.areSame(1, objCount);

        target.onceAfter("test3", isObj, obj, {});
        target.fire("test3");

        Y.Assert.areSame(1, targetCount);
        Y.Assert.areSame(2, objCount);

        target.onceAfter("test4", isObj, obj, null, {}, {});
        target.fire("test4");

        Y.Assert.areSame(1, targetCount);
        Y.Assert.areSame(3, objCount);

        target.onceAfter("test5", isTarget, null, {});
        target.fire("test5");

        Y.Assert.areSame(2, targetCount);
        Y.Assert.areSame(3, objCount);

        target.onceAfter("prefix:test6", isTarget);
        target.fire("prefix:test6", obj);

        Y.Assert.areSame(3, targetCount);
        Y.Assert.areSame(3, objCount);

        target.onceAfter(["test7", "prefix:test8"], isObj, obj);
        target.fire("test7");
        target.fire("prefix:test8");

        Y.Assert.areSame(3, targetCount);
        Y.Assert.areSame(5, objCount);

        target.onceAfter({ "test9": isObj }, null, obj);
        target.fire("test9");

        Y.Assert.areSame(3, targetCount);
        Y.Assert.areSame(6, objCount);

        target.onceAfter({
            "test10": { fn: isTarget },
            "test11": { fn: isObj, context: obj }
        });
        target.fire("test10");
        target.fire("test11");

        Y.Assert.areSame(4, targetCount);
        Y.Assert.areSame(7, objCount);

        target.onceAfter({
            "test12": { fn: isObj },
            "prefix:test13": { fn: isTarget, context: target }
        }, null, obj);
        target.fire("test12");
        target.fire("prefix:test13");

        Y.Assert.areSame(5, targetCount);
        Y.Assert.areSame(8, objCount);

        Y.Assert.areSame(0, events.test1._afters.length);
        Y.Assert.areSame(0, events.test2._afters.length);
        Y.Assert.areSame(0, events.test3._afters.length);
        Y.Assert.areSame(0, events.test4._afters.length);
        Y.Assert.areSame(0, events.test5._afters.length);
        Y.Assert.areSame(0, events['prefix:test6']._afters.length);
        Y.Assert.areSame(0, events.test7._afters.length);
        Y.Assert.areSame(0, events['prefix:test8']._afters.length);
        Y.Assert.areSame(0, events.test9._afters.length);
        Y.Assert.areSame(0, events.test10._afters.length);
        Y.Assert.areSame(0, events.test11._afters.length);
        Y.Assert.areSame(0, events.test12._afters.length);
        Y.Assert.areSame(0, events['prefix:test13']._afters.length);
    },

    "test subscription bound args": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            obj = {},
            args;

        function callback() {
            args = Y.Array(arguments, 0, true);
        }

        target.onceAfter("test1", callback, {}, "a", 1, obj, null);
        target.fire("test1");
        Y.ArrayAssert.itemsAreSame(["a", 1, obj, null], args);

        target.onceAfter(["test2", "test3"], callback, null, "a", 2.3, obj, null);
        target.fire("test2");
        Y.ArrayAssert.itemsAreSame(["a", 2.3, obj, null], args);
        args = [];
        target.fire("test3");
        Y.ArrayAssert.itemsAreSame(["a", 2.3, obj, null], args);

        // ugh, requiring two placeholders for (unused) fn and context is ooogly
        target.onceAfter({
            "test4": callback,
            "test5": callback
        }, null, null, "a", 4.5, obj, null);
        target.fire("test4");
        Y.ArrayAssert.itemsAreSame(["a", 4.5, obj, null], args);
        args = [];
        target.fire("test5");
        Y.ArrayAssert.itemsAreSame(["a", 4.5, obj, null], args);

        target.onceAfter({
            "test6": true,
            "test7": false
        }, callback, {}, "a", 6.7, obj, null);
        target.fire("test6");
        Y.ArrayAssert.itemsAreSame(["a", 6.7, obj, null], args);
        args = [];
        target.fire("test7");
        Y.ArrayAssert.itemsAreSame(["a", 6.7, obj, null], args);

        Y.Assert.areSame(0, events.test1._afters.length);
        Y.Assert.areSame(0, events.test2._afters.length);
        Y.Assert.areSame(0, events.test3._afters.length);
        Y.Assert.areSame(0, events.test4._afters.length);
        Y.Assert.areSame(0, events.test5._afters.length);
        Y.Assert.areSame(0, events.test6._afters.length);
        Y.Assert.areSame(0, events.test7._afters.length);
    },

    "test target.onceAfter('click', fn) registers custom event only": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            fired = false;

        target.onceAfter("click", function () {
            fired = true;
            // Not an emitFacade event, so there's no e to verify type
        });

        Y.Assert.isInstanceOf(Y.CustomEvent, events.click);
        Y.Assert.isUndefined(events.click.domkey);
        Y.Assert.areSame(1, events.click._afters.length);

        target.fire("click");

        Y.Assert.isTrue(fired);
        Y.Assert.areSame(0, events.click._afters.length);
    }
}));

baseSuite.add(new Y.Test.Case({
    name: "target.detach",

    "test target.detach() with not subs is harmless": function () {
        var target = new Y.EventTarget();

        function fn() {}

        target.detach('test');
        target.detach('category|test');
        target.detach('prefix:test');
        target.detach('category|prefix:test');
        target.detach('test', fn);
        target.detach('category|test', fn);
        target.detach('prefix:test', fn);
        target.detach('category|prefix:test', fn);
        target.detach();

        Y.Assert.isTrue(true);
    },

    "test target.detachAll() with not subs is harmless": function () {
        var target = new Y.EventTarget();

        target.detachAll();
        target.detachAll('test');
        target.detachAll('prefix:test');
        target.detachAll('category|test');
        target.detachAll('category|prefix:test');

        Y.Assert.isTrue(true);
    },

    "test target.on() + target.detach(type, fn)": function () {
        var count = 0,
            target = new Y.EventTarget();

        function fn() {
            count++;
        }

        target.on('test', fn);

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.detach('test', fn);

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.on('test', fn);
        target.on('test', fn);

        target.fire('test');

        Y.Assert.areSame(3, count);

        target.detach('test', fn);

        target.fire('test');

        Y.Assert.areSame(3, count);
    },

    "test target.on(type, fn, thisObj) + target.detach(type, fn)": function () {
        var count = 0,
            a = {},
            b = {},
            target = new Y.EventTarget();

        function fn() {
            count++;
        }

        target.on('test', fn, a);

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.detach('test', fn);

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.on('test', fn, a);
        target.on('test', fn, b);

        target.fire('test');

        Y.Assert.areSame(3, count);

        target.detach('test', fn);

        target.fire('test');

        Y.Assert.areSame(3, count);
    },

    "test target.on() + target.detach(type)": function () {
        var count = 0,
            target = new Y.EventTarget();

        function fn() {
            count++;
        }

        target.on('test', fn);

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.detach('test');

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.on('test', fn);
        target.on('test', fn);

        target.fire('test');

        Y.Assert.areSame(3, count);

        target.detach('test');

        target.fire('test');

        Y.Assert.areSame(3, count);
    },

    "test target.on() + target.detach()": function () {
        var count = 0,
            target = new Y.EventTarget();

        function fn() {
            count++;
        }

        target.on('test', fn);

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.detach();

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.on('test', fn);
        target.on('test', fn);

        target.fire('test');

        Y.Assert.areSame(3, count);

        target.detach();

        target.fire('test');

        Y.Assert.areSame(3, count);
    },

    "test target.on() + target.detachAll()": function () {
        var count = 0,
            target = new Y.EventTarget();

        function fn() {
            count++;
        }

        target.on('test', fn);

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.detachAll();

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.on('test', fn);
        target.on('test', fn);

        target.fire('test');

        Y.Assert.areSame(3, count);

        target.detachAll();

        target.fire('test');

        Y.Assert.areSame(3, count);
    },

    "test target.on() + handle.detach()": function () {
        var count = 0,
            target = new Y.EventTarget(),
            sub;

        function increment() {
            count++;
        }

        sub = target.on('test', increment);

        target.fire('test');

        Y.Assert.areSame(1, count);

        sub.detach();

        target.fire('test');

        Y.Assert.areSame(1, count);
    },

    "test target.on('cat|__', fn) + target.detach('cat|___')": function () {
        var count = 0,
            target = new Y.EventTarget();

        function increment() {
            count++;
        }

        target.on('cat|test', increment);

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.detach('cat|test');

        target.fire('test');

        Y.Assert.areSame(1, count);
    },

    "test target.on('cat|__', fn) + target.detach('cat|___', fn)": function () {
        var count = 0,
            target = new Y.EventTarget();

        function increment() {
            count++;
        }

        target.on('cat|test', increment);

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.detach('cat|test', increment);

        target.fire('test');

        Y.Assert.areSame(1, count);
    },

    "test target.on('cat|__', fn) + target.detach('cat|*')": function () {
        var count = 0,
            target = new Y.EventTarget();

        function increment() {
            count++;
        }

        target.on('cat|test', increment);

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.detach('cat|*');

        target.fire('test');

        Y.Assert.areSame(1, count);
    },

    "test target.on({...}) + target.detach(type)": function () {
        var count = 0,
            target = new Y.EventTarget();

        function increment() {
            count++;
        }

        target.on({
            test1: increment,
            test2: increment
        });

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(2, count);

        target.detach('test1');

        target.fire('test1');

        Y.Assert.areSame(2, count);

        target.fire('test2');

        Y.Assert.areSame(3, count);

        target.detach('test2');

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(3, count);
    },

    "test target.on({...}) + target.detach(type, fn)": function () {
        var count = 0,
            target = new Y.EventTarget();

        function increment() {
            count++;
        }

        target.on({
            test1: increment,
            test2: increment
        });

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(2, count);

        target.detach('test1', increment);

        target.fire('test1');

        Y.Assert.areSame(2, count);

        target.fire('test2');

        Y.Assert.areSame(3, count);

        target.detach('test2', increment);

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(3, count);
    },

    "test target.on({...}) + target.detachAll()": function () {
        var count = 0,
            target = new Y.EventTarget();

        function increment() {
            count++;
        }

        target.on({
            test1: increment,
            test2: increment
        });

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(2, count);

        target.detachAll();

        target.fire('test1');

        Y.Assert.areSame(2, count);

        target.fire('test2');

        Y.Assert.areSame(2, count);
    },

    "test target.on({'cat|type': fn}) + target.detach(type, fn)": function () {
        var count = 0,
            target = new Y.EventTarget();

        function increment() {
            count++;
        }

        target.on({
            'cat|test1': increment,
            test2: increment
        });

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(2, count);

        target.detach('test1');

        target.fire('test1');

        Y.Assert.areSame(2, count);

        target.fire('test2');

        Y.Assert.areSame(3, count);
    },

    "test target.on({'cat|type': fn}) + target.detach('cat|type')": function () {
        var count = 0,
            target = new Y.EventTarget();

        function increment() {
            count++;
        }

        target.on({
            'cat|test1': increment,
            test2: increment
        });

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(2, count);

        target.detach('cat|test1');

        target.fire('test1');

        Y.Assert.areSame(2, count);

        target.fire('test2');

        Y.Assert.areSame(3, count);
    },

    "test target.on({'cat|type': fn}) + target.detach('cat|*')": function () {
        var count = 0,
            target = new Y.EventTarget();

        function increment() {
            count++;
        }

        target.on({
            'cat|test1': increment,
            'cat|test2': increment,
            test3: increment
        });

        target.fire('test1');
        target.fire('test2');
        target.fire('test3');

        Y.Assert.areSame(3, count);

        target.detach('cat|*');

        target.fire('test1');

        Y.Assert.areSame(3, count);

        target.fire('test2');

        Y.Assert.areSame(3, count);

        target.fire('test3');

        Y.Assert.areSame(4, count);
    },

    "test target.on([type], fn) + target.detach(type, fn)": function () {
        var count = 0,
            target = new Y.EventTarget();

        function increment() {
            count++;
        }

        target.on(['test'], increment);

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.detach('test', increment);

        target.fire('test');

        Y.Assert.areSame(1, count);
    },

    "test target.on([type], fn) + target.detach(type)": function () {
        var count = 0,
            target = new Y.EventTarget();

        function increment() {
            count++;
        }

        target.on(['test'], increment);

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.detach('test');

        target.fire('test');

        Y.Assert.areSame(1, count);
    },

    "test target.on([typeA, typeB], fn) + target.detach(typeA)": function () {
        var count = 0,
            target = new Y.EventTarget();

        function increment() {
            count++;
        }

        target.on(['test1', 'test2'], increment);

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(2, count);

        target.detach('test1');

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(3, count);

        target.detach('test2');

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(3, count);
    },

    "test target.on([typeA, typeB], fn) + target.detach()": function () {
        var count = 0,
            target = new Y.EventTarget();

        function increment() {
            count++;
        }

        target.on(['test1', 'test2'], increment);

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(2, count);

        target.detach();

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(2, count);
    },

    "test target.on({}) + target.detach() is harmless": function () {
        var count = 0,
            target = new Y.EventTarget();

        target.on({});
        target.detach();

        Y.Assert.areSame(0, count);
    },

    "test target.on([], fn) + target.detach() is harmless": function () {
        var count = 0,
            target = new Y.EventTarget();

        function increment() {
            count++;
        }

        target.on([], increment);
        target.detach();

        Y.Assert.areSame(0, count);
    },

    "test target.on({}) + handle.detach() is harmless": function () {
        var target = new Y.EventTarget(),
            handle;

        handle = target.on({});
        handle.detach();

        Y.Assert.isTrue(true);
    },

    "test target.on([], fn) + handle.detach() is harmless": function () {
        var target = new Y.EventTarget(),
            handle;

        handle = target.on([], function () {});
        handle.detach();

        Y.Assert.isTrue(true);
    },

    "test target.on({...}) + handle.detach()": function () {
        var count = 0,
            target = new Y.EventTarget(),
            handle;

        function increment() {
            count++;
        }

        handle = target.on({
            test1: increment,
            test2: increment
        });

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(2, count);

        handle.detach();

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(2, count);
    },

    "test target.on([typeA, typeB], fn) + handle.detach()": function () {
        var count = 0,
            target = new Y.EventTarget(),
            handle;

        function increment() {
            count++;
        }

        handle = target.on(['test1', 'test2'], increment);

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(2, count);

        handle.detach();

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(2, count);
    },

    "test target.on([typeA, typeA], fn) + handle.detach()": function () {
        var count = 0,
            target = new Y.EventTarget(),
            handle;

        function increment() {
            count++;
        }

        handle = target.on(['test1', 'test2'], increment);

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(2, count);

        handle.detach();

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(2, count);
    },

    "test target.on(type) + target.detach(prefix:type)": function () {
        var target = new Y.EventTarget({ prefix: 'pre' }),
            count = 0;

        function increment() {
            count++;
        }

        target.on('test', increment);

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.detach('test');

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.on('test', increment);

        target.fire('test');

        Y.Assert.areSame(2, count);

        target.detach('pre:test');

        target.fire('test');

        Y.Assert.areSame(2, count);
    },

    "test target.after() + target.detach(type, fn)": function () {
        var count = 0,
            target = new Y.EventTarget();

        function fn() {
            count++;
        }

        target.after('test', fn);

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.detach('test', fn);

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.after('test', fn);
        target.after('test', fn);

        target.fire('test');

        Y.Assert.areSame(3, count);

        target.detach('test', fn);

        target.fire('test');

        Y.Assert.areSame(3, count);
    },

    "test target.after(type, fn, thisObj) + target.detach(type, fn)": function () {
        var count = 0,
            a = {},
            b = {},
            target = new Y.EventTarget();

        function fn() {
            count++;
        }

        target.after('test', fn, a);

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.detach('test', fn);

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.after('test', fn, a);
        target.after('test', fn, b);

        target.fire('test');

        Y.Assert.areSame(3, count);

        target.detach('test', fn);

        target.fire('test');

        Y.Assert.areSame(3, count);
    },

    "test target.after() + target.detach(type)": function () {
        var count = 0,
            target = new Y.EventTarget();

        function fn() {
            count++;
        }

        target.after('test', fn);

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.detach('test');

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.after('test', fn);
        target.after('test', fn);

        target.fire('test');

        Y.Assert.areSame(3, count);

        target.detach('test');

        target.fire('test');

        Y.Assert.areSame(3, count);
    },

    "test target.after() + target.detach()": function () {
        var count = 0,
            target = new Y.EventTarget();

        function fn() {
            count++;
        }

        target.after('test', fn);

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.detach();

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.after('test', fn);
        target.after('test', fn);

        target.fire('test');

        Y.Assert.areSame(3, count);

        target.detach();

        target.fire('test');

        Y.Assert.areSame(3, count);
    },

    "test target.after() + target.detachAll()": function () {
        var count = 0,
            target = new Y.EventTarget();

        function fn() {
            count++;
        }

        target.after('test', fn);

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.detachAll();

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.after('test', fn);
        target.after('test', fn);

        target.fire('test');

        Y.Assert.areSame(3, count);

        target.detachAll();

        target.fire('test');

        Y.Assert.areSame(3, count);
    },

    "test target.after() + handle.detach()": function () {
        var count = 0,
            target = new Y.EventTarget(),
            sub;

        function increment() {
            count++;
        }

        sub = target.after('test', increment);

        target.fire('test');

        Y.Assert.areSame(1, count);

        sub.detach();

        target.fire('test');

        Y.Assert.areSame(1, count);
    },

    "test target.after('cat|__', fn) + target.detach('cat|___')": function () {
        var count = 0,
            target = new Y.EventTarget();

        function increment() {
            count++;
        }

        target.after('cat|test', increment);

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.detach('cat|test');

        target.fire('test');

        Y.Assert.areSame(1, count);
    },

    "test target.after('cat|__', fn) + target.detach('cat|___', fn)": function () {
        var count = 0,
            target = new Y.EventTarget();

        function increment() {
            count++;
        }

        target.after('cat|test', increment);

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.detach('cat|test', increment);

        target.fire('test');

        Y.Assert.areSame(1, count);
    },

    "test target.after('cat|__', fn) + target.detach('cat|*')": function () {
        var count = 0,
            target = new Y.EventTarget();

        function increment() {
            count++;
        }

        target.after('cat|test', increment);

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.detach('cat|*');

        target.fire('test');

        Y.Assert.areSame(1, count);
    },

    "test target.after('cat|__', fn) + target.detach('cat|*'), with prefix": function () {
        var count = 0,
            target = new Y.EventTarget({prefix:"foo"});

        function increment() {
            count++;
        }

        target.after('cat|test', increment);

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.detach('cat|*');

        target.fire('test');

        Y.Assert.areSame(1, count);
    },


    "test target.after({...}) + target.detach(type)": function () {
        var count = 0,
            target = new Y.EventTarget();

        function increment() {
            count++;
        }

        target.after({
            test1: increment,
            test2: increment
        });

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(2, count);

        target.detach('test1');

        target.fire('test1');

        Y.Assert.areSame(2, count);

        target.fire('test2');

        Y.Assert.areSame(3, count);

        target.detach('test2');

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(3, count);
    },

    "test target.after({...}) + target.detach(type, fn)": function () {
        var count = 0,
            target = new Y.EventTarget();

        function increment() {
            count++;
        }

        target.after({
            test1: increment,
            test2: increment
        });

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(2, count);

        target.detach('test1', increment);

        target.fire('test1');

        Y.Assert.areSame(2, count);

        target.fire('test2');

        Y.Assert.areSame(3, count);

        target.detach('test2', increment);

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(3, count);
    },

    "test target.after({...}) + target.detachAll()": function () {
        var count = 0,
            target = new Y.EventTarget();

        function increment() {
            count++;
        }

        target.after({
            test1: increment,
            test2: increment
        });

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(2, count);

        target.detachAll();

        target.fire('test1');

        Y.Assert.areSame(2, count);

        target.fire('test2');

        Y.Assert.areSame(2, count);
    },

    "test target.after({'cat|type': fn}) + target.detach(type, fn)": function () {
        var count = 0,
            target = new Y.EventTarget();

        function increment() {
            count++;
        }

        target.after({
            'cat|test1': increment,
            test2: increment
        });

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(2, count);

        target.detach('test1');

        target.fire('test1');

        Y.Assert.areSame(2, count);

        target.fire('test2');

        Y.Assert.areSame(3, count);
    },

    "test target.after({'cat|type': fn}) + target.detach('cat|type')": function () {
        var count = 0,
            target = new Y.EventTarget();

        function increment() {
            count++;
        }

        target.after({
            'cat|test1': increment,
            test2: increment
        });

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(2, count);

        target.detach('cat|test1');

        target.fire('test1');

        Y.Assert.areSame(2, count);

        target.fire('test2');

        Y.Assert.areSame(3, count);
    },

    "test target.after({'cat|type': fn}) + target.detach('cat|*')": function () {
        var count = 0,
            target = new Y.EventTarget();

        function increment() {
            count++;
        }

        target.after({
            'cat|test1': increment,
            'cat|test2': increment,
            test3: increment
        });

        target.fire('test1');
        target.fire('test2');
        target.fire('test3');

        Y.Assert.areSame(3, count);

        target.detach('cat|*');

        target.fire('test1');

        Y.Assert.areSame(3, count);

        target.fire('test2');

        Y.Assert.areSame(3, count);

        target.fire('test3');

        Y.Assert.areSame(4, count);
    },

    "test target.after([type], fn) + target.detach(type, fn)": function () {
        var count = 0,
            target = new Y.EventTarget();

        function increment() {
            count++;
        }

        target.after(['test'], increment);

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.detach('test', increment);

        target.fire('test');

        Y.Assert.areSame(1, count);
    },

    "test target.after([type], fn) + target.detach(type)": function () {
        var count = 0,
            target = new Y.EventTarget();

        function increment() {
            count++;
        }

        target.after(['test'], increment);

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.detach('test');

        target.fire('test');

        Y.Assert.areSame(1, count);
    },

    "test target.after([typeA, typeB], fn) + target.detach(typeA)": function () {
        var count = 0,
            target = new Y.EventTarget();

        function increment() {
            count++;
        }

        target.after(['test1', 'test2'], increment);

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(2, count);

        target.detach('test1');

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(3, count);

        target.detach('test2');

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(3, count);
    },

    "test target.after([typeA, typeB], fn) + target.detach()": function () {
        var count = 0,
            target = new Y.EventTarget();

        function increment() {
            count++;
        }

        target.after(['test1', 'test2'], increment);

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(2, count);

        target.detach();

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(2, count);
    },

    "test target.after({}) + target.detach() is harmless": function () {
        var count = 0,
            target = new Y.EventTarget();

        target.after({});
        target.detach();

        Y.Assert.areSame(0, count);
    },

    "test target.after([], fn) + target.detach() is harmless": function () {
        var count = 0,
            target = new Y.EventTarget();

        function increment() {
            count++;
        }

        target.after([], increment);
        target.detach();

        Y.Assert.areSame(0, count);
    },

    "test target.after({}) + handle.detach() is harmless": function () {
        var target = new Y.EventTarget(),
            handle;

        handle = target.after({});
        handle.detach();

        Y.Assert.isTrue(true);
    },

    "test target.after([], fn) + handle.detach() is harmless": function () {
        var target = new Y.EventTarget(),
            handle;

        handle = target.after([], function () {});
        handle.detach();

        Y.Assert.isTrue(true);
    },

    "test target.after({...}) + handle.detach()": function () {
        var count = 0,
            target = new Y.EventTarget(),
            handle;

        function increment() {
            count++;
        }

        handle = target.after({
            test1: increment,
            test2: increment
        });

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(2, count);

        handle.detach();

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(2, count);
    },

    "test target.after([typeA, typeB], fn) + handle.detach()": function () {
        var count = 0,
            target = new Y.EventTarget(),
            handle;

        function increment() {
            count++;
        }

        handle = target.after(['test1', 'test2'], increment);

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(2, count);

        handle.detach();

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(2, count);
    },

    "test target.after([typeA, typeA], fn) + handle.detach()": function () {
        var count = 0,
            target = new Y.EventTarget(),
            handle;

        function increment() {
            count++;
        }

        handle = target.after(['test1', 'test2'], increment);

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(2, count);

        handle.detach();

        target.fire('test1');
        target.fire('test2');

        Y.Assert.areSame(2, count);
    },

    "test target.after(type) + target.detach(prefix:type)": function () {
        var target = new Y.EventTarget({ prefix: 'pre' }),
            count = 0;

        function increment() {
            count++;
        }

        target.after('test', increment);

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.detach('test');

        target.fire('test');

        Y.Assert.areSame(1, count);

        target.after('test', increment);

        target.fire('test');

        Y.Assert.areSame(2, count);

        target.detach('pre:test');

        target.fire('test');

        Y.Assert.areSame(2, count);
    },

    "test target.on() + target.after() + target.detach(type) detaches both": function () {
        var target = new Y.EventTarget(),
            count = 0;

        function incrementOn() {
            count++;
        }

        function incrementAfter() {
            count++;
        }

        target.on('test', incrementOn);
        target.after('test', incrementAfter);

        target.fire('test');

        Y.Assert.areSame(2, count);

        target.detach('test');

        target.fire('test');

        Y.Assert.areSame(2, count);
    },

    "test target.detach('~AFTER~')": function () {
        var target = new Y.EventTarget(),
            count = 0;

        target.after('test', function () {
            count++;
        });

        target.detach('~AFTER~');

        target.fire('test');

        Y.Assert.areSame(1, count);
    },

    "test Y.detach(type, fn)": function() {
        var count = 0;
            tester = function() {
                count++;
                Y.detach('foo', tester);
            };

        Y.on('foo', tester);

        Y.fire('foo');
        Y.fire('foo');

        Y.Assert.areEqual(1, count);
    }

}));

baseSuite.add(new Y.Test.Case({
    name: "target.fire",

    "test target.fire() with no subscribers": function () {
        var target = new Y.EventTarget();

        target.fire("test1");
        target.fire("test2", "a");
        target.fire("test3", {});
        target.fire("foo:test4");
        target.fire("*:test5");
        target.fire(":test6");
        target.fire("|test7");
        target.fire("~AFTER~test8");
        target.fire("test9 test10");
        target.fire("test11_fire");

        Y.Assert.isTrue(true);
    },

    "test on() and fire() argument aggregation": function () {
        var target = new Y.EventTarget(),
            args;

        function callback () {
            args = Y.Array(arguments, 0, true);
        }

        target.on("test1", callback);
        target.fire("test1");
        Y.ArrayAssert.itemsAreSame([], args);

        target.on("test2", callback, {});
        target.fire("test2");
        Y.ArrayAssert.itemsAreSame([], args);

        target.on("test2", callback, {}, "x");
        target.fire("test2");
        Y.ArrayAssert.itemsAreSame(["x"], args);

        target.on("test3", callback, {}, "x", false, null);
        target.fire("test3");
        Y.ArrayAssert.itemsAreSame(["x", false, null], args);

        target.on("test4", callback);
        target.fire("test4", "a");
        Y.ArrayAssert.itemsAreSame(["a"], args);

        target.on("test5", callback);
        target.fire("test5", "a", false, null);
        Y.ArrayAssert.itemsAreSame(["a", false, null], args);

        target.on("test6", callback, {}, "x", false, null);
        target.fire("test6", "a", true, target);
        Y.ArrayAssert.itemsAreSame(["a", true, target, "x", false, null], args);

        target.on("test6", callback, null, "x", false, null);
        target.fire("test6", "a", true, target);
        Y.ArrayAssert.itemsAreSame(["a", true, target, "x", false, null], args);
    },

    "test target.fire(*) arg is passed as is": function () {
        var target = new Y.EventTarget(),
            values = [
                "a", 1.7, true, {k:"v"}, ["val"], /abc/, new Date(),
                "", 0, false, {}, [], null, undefined],
            received = [],
            i, len;

        function callback () {
            received.push(arguments[0]);
        }

        target.on("test1", callback);
        for (i = 0, len = values.length; i < len; ++i) {
            target.fire("test1", values[i]);
        }
        Y.ArrayAssert.itemsAreSame(values, received);


        received = [];

        target.on("test2", callback, {});
        for (i = 0, len = values.length; i < len; ++i) {
            target.fire("test2", values[i]);
        }
        Y.ArrayAssert.itemsAreSame(values, received);


        received = [];

        target.on("test3", callback, {}, "x");
        for (i = 0, len = values.length; i < len; ++i) {
            target.fire("test3", values[i]);
        }
        Y.ArrayAssert.itemsAreSame(values, received);
    },

    // TODO: break out facade logic to event-custom-complex.js
    "test broadcast": function() {
        var o = new Y.EventTarget(), s1, s2, s3, s4;

        o.publish('y:foo2', {
            emitFacade: true,
            broadcast: 1
        });

        Y.on('y:foo2', function() {
            //Y.log('Y foo2 executed');
            s1 = 1;
        });

        Y.Global.on('y:foo2', function() {
            //Y.log('GLOBAL foo2 executed');
            s2 = 1;
        });

        o.fire('y:foo2');

        Y.Assert.areEqual(1, s1);
        Y.Assert.areNotEqual(1, s2);

        s1 = 0;
        s2 = 0;

        o.publish('y:bar', {
            emitFacade: true,
            broadcast: 2
        });

        Y.on('y:bar', function() {
            //Y.log('Y bar executed');
            s3 = 1;
        });

        Y.Global.on('y:bar', function() {
            //Y.log('GLOBAL bar executed');
            s4 = 1;
        });

        o.fire('y:bar');

        Y.Assert.areEqual(1, s3);
        Y.Assert.areEqual(1, s4);

        Y.Global.on('y:bar', function(e) {
            Y.Assert.areEqual(0, e.stopped);
            // Y.Assert.areEqual(0, e._event.stopped);
            //Y.log('GLOBAL bar executed');
            e.stopPropagation();
        });

        o.fire('y:bar');
        o.fire('y:bar');

        Y.Global.detachAll();

    }

    // on/after lifecycle
    // on/after prevention with return false
}));

baseSuite.add(new Y.Test.Case({
    name: "target.publish()",

    // broadcast
    // monitored
    // context
    // contextFn
    // details
    // fireOnce
    // async
    // queuable
    // silent
    // type
    // default configs from ET constructor


    test_fire_once: function() {

        var notified = 0,
            test = this;

        Y.publish('fireonce', {
            fireOnce: true
        });

        Y.fire('fireonce', 'foo', 'bar');

        Y.on('fireonce', function(arg1, arg2) {
            notified++;
            Y.Assert.areEqual('foo', arg1, 'arg1 not correct for lazy fireOnce listener');
            Y.Assert.areEqual('bar', arg2, 'arg2 not correct for lazy fireOnce listener');
        });

        Y.fire('fireonce', 'foo2', 'bar2');
        Y.fire('fireonce', 'foo3', 'bar3');

        test.global_notified = false;

        Y.on('fireonce', function(arg1, arg2) {
            //Y.log('the notification is asynchronous, so I need to wait for this test');
            Y.Assert.areEqual(1, notified, 'listener notified more than once.');
            test.global_notified = true;
        });

        // it is no longer asynchronous
        // Y.Assert.isFalse(global_notified, 'notification was not asynchronous');

    },

    test_async_fireonce: function() {
        Y.Assert.isTrue(this.global_notified, 'asynchronous notification did not seem to work.');
    }

    // node.fire("click") does not fire click subscribers
}));

    /*
    testChain: function() {

        var fired1 = false,
            fired2 = false,
            fired3 = false,
            fired4 = false,
            fired5 = false;

        // should be executed once, after f2
        var f1 = function() {
            Y.Assert.isTrue(fired2);
            fired1 = true;
        };

        // should be executed once, before f1
        var f2 = function() {
            Y.Assert.isFalse(fired1);
            fired2 = true;
        };

        // should be executed once, different event from f1 and f2
        var f3 = function() {
            fired3 = true;
        };

        // detached before fired, should not executed
        var f4 = function() {
            fired4 = true;
        };

        // should fire once, preserving the custom prefix rather
        // than using the configured event target prefix
        var f5 = function() {
            fired5 = true;
        };

        // configure chaining via global default or on the event target
        YUI({ // chain: true
            base:'../../../build/',
            logInclude: {
                test: true
            }
        }).use('event-custom', function(Y2) {

            var o = new Y2.EventTarget({
                prefix: 'foo',
                chain : true
            });

            // without event target prefix manipulation (incomplete now)
            // @TODO an error here is throwing an uncaught exception rather than failing the test
            // Y2.after('p:e', f1).on('p:e', f2).on('p:e2', f3).on('detach, p:e', f4).detach('detach, p:e').fire('p:e').fire('p:e2');

            // with event target prefix manipulation ('e' is the same event as 'foo:e',
            // but 'pre:e' is a different event only accessible by using that exact name)
o.after('e', f1).on('foo:e', f2).on('foo:e2', f3).on('detach, e', f4).detach('detach,e').fire('foo:e').fire('e2').on('pre:e', f5).fire('pre:e');

            Y.Assert.isTrue(fired1);  // verifies chaining, on/after order, and adding the event target prefix
            Y.Assert.isTrue(fired2);  // verifies chaining, on/after order, and accepting the prefix in the event name
            Y.Assert.isTrue(fired3);  // verifies no interaction between events, and prefix manipulation
            Y.Assert.isFalse(fired4); // verifies detach works (regardless of spaces after comma)
            Y.Assert.isTrue(fired5);  // verifies custom prefix

        });

    },
    */

Y.Test.Runner.add(baseSuite);

}, '@VERSION@' ,{requires:['event-custom-base', 'test']});
