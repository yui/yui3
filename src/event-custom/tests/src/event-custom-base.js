var suite = new Y.Test.Suite("Event Target");

suite.add(new Y.Test.Case({
    name: "Event Target constructor",

    "test new Y.EventTarget()": function () {
        var target = new Y.EventTarget();

        Y.Assert.isInstanceOf(target, Y.EventTarget);
        Y.Assert.isObject(target._yuievt);
    },

    "test new Y.EventTarget(config)": function () {
        var target1 = new Y.EventTarget(),
            target2 = new Y.EventTarget({
                // These are all the currently supported default overrides...
                broadcast: 2,
                bubbles: false,
                context: target1,
                defaultTargetOnly: true,
                emitFacade: true,
                fireOnce: true,
                monitored: true,
                queuable: true,
                // ...except this one
                async: "is not supported as a default (yet?)"
            }),
            config1 = target1._yuievt,
            config2 = target2._yuievt;

        Y.Assert.isString(config1.id);
        Y.Assert.isObject(config1.events);
        Y.Assert.isObject(config1.targets);
        Y.Assert.isObject(config1.config);
        Y.Assert.isFalse(config1.bubbling);
        Y.Assert.isObject(config1.defaults);

        Y.Assert.isUndefined(config2.defaults.broadcast);
        Y.Assert.isTrue(config2.defaults.bubbles);
        Y.Assert.areSame(target1, config2.defaults.context);
        Y.Assert.isUndefined(config2.defaults.defaultTargetOnly);
        Y.Assert.isUndefined(config2.defaults.emitFacade);
        Y.Assert.isUndefined(config2.defaults.fireOnce);
        Y.Assert.isUndefined(config2.defaults.monitored);
        Y.Assert.isUndefined(config2.defaults.queuable);

        Y.Assert.isObject(config2.defaults);
        Y.Assert.areSame(2, config2.defaults.broadcast);
        Y.Assert.isFalse(config2.defaults.bubbles);
        Y.Assert.areSame(target1, config2.defaults.context);
        Y.Assert.isTrue(config2.defaults.defaultTargetOnly);
        Y.Assert.isTrue(config2.defaults.emitFacade);
        Y.Assert.isTrue(config2.defaults.fireOnce);
        Y.Assert.isTrue(config2.defaults.monitored);
        Y.Assert.isTrue(config2.defaults.queuable);
        Y.Assert.isUndefined(config2.defaults.async);
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
        Y.Assert.isUndefined(instance._yuievt.defaults.fireOnce);
        Y.Assert.isFunction(instance.on);
        Y.Assert.areNotSame(instance.on, Y.EventTarget.prototype.on);

        instance.on("test", instance.method);
        instance.fire("test");

        Y.Assert.isObject(instance._yuievt);
        Y.Assert.isUndefined(instance._yuievt.defaults.fireOnce);
        Y.Assert.areSame(instance.on, Y.EventTarget.prototype.on);
        Y.Assert.areSame(instance, thisObj);

        function TestClass2() {}
        TestClass2.prototype = {
            method: function () {
                thisObj = this;
            }
        };

        Y.augment(TestClass2, Y.EventTarget, null, true, {
            fireOnce: true
        });

        instance = new TestClass2();
        thisObj = null;

        Y.Assert.isUndefined(instance._yuievt);
        Y.Assert.isUndefined(instance._yuievt.defaults.fireOnce);
        Y.Assert.isFunction(instance.on);
        Y.Assert.areNotSame(instance.on, Y.EventTarget.prototype.on);

        instance.on("test", instance.method);
        instance.fire("test");

        Y.Assert.isObject(instance._yuievt);
        Y.Assert.isTrue(instance._yuievt.defaults.fireOnce);
        Y.Assert.areSame(instance.on, Y.EventTarget.prototype.on);
        Y.Assert.areSame(instance, thisObj);
    },

    "test Y.extend(Clz, Y.EventTarget)": function () {
        var thisObj;

        function TestClass() {
            TestClass.superclass.constructor.apply(this, arguments);
        }
        Y.extend(TestClass, Y.EventTarget, {
            method: function () {
                thisObj = this;
            }
        });

        instance = new TestClass();

        Y.Assert.isInstanceOf(instance, TestClass);
        Y.Assert.isInstanceOf(instance, Y.EventTarget);
        Y.Assert.isObject(instance._yuievt);
        Y.Assert.areSame(instance.on, Y.EventTarget.prototype.on);

        instance.on("test", instance.method);
        instance.fire("test");

        Y.Assert.areSame(instance, thisObj);
    }
}));

suite.add(new Y.Test.Case({
    name: "target.on()",

    _should: {
        error: {
            "test target.on(type, { handleEvents: fn })": "needs support"
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
        Y.Assert.isInstanceOf(events.test, Y.CustomEvent);
    },

    "test target.on(type, fn)": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            handle, thisObj, fired, argCount, testEvent;

        function callback() {
            fired = true;
            thisObj = this;
            argCount = arguments.length;
        }

        handle = target.on("test", callback);

        testEvent = events.test;
        Y.Assert.isInstanceOf(testEvent, Y.CustomEvent);
        Y.Assert.isArray(testEvent.subscribers);
        Y.Assert.areSame(1, testEvent.subscribers.length);
        Y.Assert.areSame(0, testEvent.afters.length);
        Y.Assert.isTrue(testEvent.hasSubs());

        Y.Assert.isInstanceOf(handle, Y.EventHandle);
        Y.Assert.areSame(testEvent, handle.evt);
        Y.Assert.isInstanceOf(handle.sub, Y.Subscriber);

        target.fire("test");

        Y.Assert.isTrue(fired);
        Y.Assert.areSame(target, thisObj);
        Y.Assert.areSame(0, argCount);

        // Test that fire() did not change the subscription state of the
        // custom event
        testEvent = events.test;
        Y.Assert.isInstanceOf(testEvent, Y.CustomEvent);
        Y.Assert.isArray(testEvent.subscribers);
        Y.Assert.areSame(1, testEvent.subscribers.length);
        Y.Assert.areSame(0, testEvent.afters.length);
        Y.Assert.isTrue(testEvent.hasSubs());
    },

    "test target.on(type, fn) allows duplicate subs": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            count  = 0,
            testEvent, handle1, handle2;

        function callback() {
            count++;
        }

        handle1 = target.on("test", callback);
        handle2 = target.on("test", callback);

        testEvent = events.test;
        Y.Assert.isInstanceOf(testEvent, Y.CustomEvent);
        Y.Assert.isArray(testEvent.subscribers);
        Y.Assert.areSame(2, testEvent.subscribers.length);
        Y.Assert.areSame(0, testEvent.afters.length);
        Y.Assert.isTrue(testEvent.hasSubs());

        Y.Assert.areNotSame(handle1, handle2);
        Y.Assert.areSame(testEvent, handle1.evt);
        Y.Assert.areSame(handle1.evt, handle2.evt);
        Y.Assert.areNotSame(handle1.sub, handle2.sub);

        target.fire("test");

        Y.Assert.areSame(2, count);

        // Test that fire() did not change the subscription state of the
        // custom event
        testEvent = events.test;
        Y.Assert.isInstanceOf(testEvent, Y.CustomEvent);
        Y.Assert.isArray(testEvent.subscribers);
        Y.Assert.areSame(2, testEvent.subscribers.length);
        Y.Assert.areSame(0, testEvent.afters.length);
        Y.Assert.isTrue(testEvent.hasSubs());
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
            thisObj1, thisObj2, testEvent;

        function callback() {
            count++;
            thisObj1 = this;
            for (var i = 0, len = arguments.length; i < len; ++i) {
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
        Y.Assert.areSame(0, argCount);
    },

    "test target.on([type], fn)": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            handle, thisObj, fired, argCount, testEvent;

        function callback() {
            fired = true;
            thisObj = this;
            argCount = arguments.length;
        }

        handle = target.on(["test"], callback);

        testEvent = events.test;
        Y.Assert.isInstanceOf(testEvent, Y.CustomEvent);
        Y.Assert.isArray(testEvent.subscribers);
        Y.Assert.areSame(1, testEvent.subscribers.length);
        Y.Assert.areSame(0, testEvent.afters.length);
        Y.Assert.isTrue(testEvent.hasSubs());

        Y.Assert.isInstanceOf(handle, Y.EventHandle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(testEvent, handle.evt[0].evt);
        Y.Assert.isUndefined(handle.sub);
        Y.Assert.isInstanceOf(handle.evt[0].sub, Y.Subscriber);

        target.fire("test");

        Y.Assert.isTrue(fired);
        Y.Assert.areSame(target, thisObj);
        Y.Assert.areSame(0, argCount);
    },

    "test target.on([typeA, typeB], fn)": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            count = 0,
            handle, thisObj, testEvent1, testEvent2;

        function callback() {
            count++;
            thisObj = this;
        }

        handle = target.on(["test1", "test2"], callback);

        testEvent1 = events.test1;
        Y.Assert.isInstanceOf(testEvent1, Y.CustomEvent);
        Y.Assert.isArray(testEvent1.subscribers);
        Y.Assert.areSame(1, testEvent1.subscribers.length);
        Y.Assert.areSame(0, testEvent1.afters.length);
        Y.Assert.isTrue(testEvent1.hasSubs());

        testEvent2 = events.test2;
        Y.Assert.isInstanceOf(testEvent2, Y.CustomEvent);
        Y.Assert.isArray(testEvent2.subscribers);
        Y.Assert.areSame(1, testEvent2.subscribers.length);
        Y.Assert.areSame(0, testEvent2.afters.length);
        Y.Assert.isTrue(testEvent2.hasSubs());

        Y.Assert.isInstanceOf(handle, Y.EventHandle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(testEvent1, handle.evt[0].evt);
        Y.Assert.areSame(testEvent2, handle.evt[1].evt);
        Y.Assert.areNotSame(testEvent1, testEvent2);
        Y.Assert.isUndefined(handle.sub);
        Y.Assert.isInstanceOf(handle.evt[0].sub, Y.Subscriber);

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
            handle, thisObj, testEvent;

        function callback() {
            count++;
            thisObj = this;
        }

        handle = target.on(["test", "test"], callback);

        testEvent = events.test;
        Y.Assert.isInstanceOf(testEvent, Y.CustomEvent);
        Y.Assert.isArray(testEvent.subscribers);
        Y.Assert.areSame(2, testEvent.subscribers.length);
        Y.Assert.areSame(0, testEvent.afters.length);
        Y.Assert.isTrue(testEvent.hasSubs());

        Y.Assert.isInstanceOf(handle, Y.EventHandle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(testEvent, handle.evt[0].evt);
        Y.Assert.areSame(testEvent, handle.evt[1].evt);
        Y.Assert.isUndefined(handle.sub);
        Y.Assert.isInstanceOf(handle.evt[0].sub, Y.Subscriber);

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
                subs = events[name].subscriptions;
                for (i = subs.length - 1; i >= 0; --i) {
                    if (subs[i].fn === callback) {
                        Y.Assert.fail("subscription registered for '" + name + "' event");
                    }
                }
            }
        }

        Y.Assert.isInstanceOf(handle, Y.EventHandle);
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
                subs = events[name].subscriptions;
                for (i = subs.length - 1; i >= 0; --i) {
                    if (subs[i].fn === callback) {
                        Y.Assert.fail("subscription registered for '" + name + "' event");
                    }
                }
            }
        }

        Y.Assert.isInstanceOf(handle, Y.EventHandle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(0, handle.evt.length);
        Y.Assert.isUndefined(handle.sub);
    },

    "test target.on({ type: fn })": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            handle, thisObj, fired, argCount, testEvent;

        function callback() {
            fired = true;
            thisObj = this;
            argCount = arguments.length;
        }

        handle = target.on({ "test1": callback });

        testEvent = events.test1;
        Y.Assert.isInstanceOf(testEvent, Y.CustomEvent);
        Y.Assert.isArray(testEvent.subscribers);
        Y.Assert.areSame(1, testEvent.subscribers.length);
        Y.Assert.areSame(0, testEvent.afters.length);
        Y.Assert.isTrue(testEvent.hasSubs());

        Y.Assert.isInstanceOf(handle, Y.EventHandle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(1, handle.evt.length);
        Y.Assert.areSame(testEvent, handle.evt[0].evt);
        Y.Assert.isUndefined(handle.sub);
        Y.Assert.isInstanceOf(handle.evt[0].sub, Y.Subscriber);

        target.fire("test1");

        Y.Assert.isTrue(fired);
        Y.Assert.areSame(target, thisObj);
        Y.Assert.areSame(0, argCount);

        handle = target.on({
            "test2": callback,
            "test3": callback
        });

        Y.Assert.isInstanceOf(events.test2, Y.CustomEvent);
        Y.Assert.isInstanceOf(events.test3, Y.CustomEvent);
        Y.Assert.areSame(1, events.test2.subscribers.length);
        Y.Assert.areSame(1, events.test3.subscribers.length);

        Y.Assert.isInstanceOf(handle, Y.EventHandle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(2, handle.evt.length);
        Y.Assert.areSame(events.test2, handle.evt[0].evt);
        Y.Assert.areSame(events.test3, handle.evt[1].evt);
        Y.Assert.isUndefined(handle.sub);
    },

    "test target.on({ type: true }, fn)": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            handle, thisObj, fired, argCount, testEvent;

        function callback() {
            fired = true;
            thisObj = this;
            argCount = arguments.length;
        }

        handle = target.on({ "test1": true }, callback);

        testEvent = events.test1;
        Y.Assert.isInstanceOf(testEvent, Y.CustomEvent);
        Y.Assert.isArray(testEvent.subscribers);
        Y.Assert.areSame(1, testEvent.subscribers.length);
        Y.Assert.areSame(0, testEvent.afters.length);
        Y.Assert.isTrue(testEvent.hasSubs());

        Y.Assert.isInstanceOf(handle, Y.EventHandle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(1, handle.evt.length);
        Y.Assert.areSame(testEvent, handle.evt[0].evt);
        Y.Assert.isUndefined(handle.sub);
        Y.Assert.isInstanceOf(handle.evt[0].sub, Y.Subscriber);

        target.fire("test1");

        Y.Assert.isTrue(fired);
        Y.Assert.areSame(target, thisObj);
        Y.Assert.areSame(0, argCount);

        handle = target.on({ "test2": 1, "test3": false }, callback);

        Y.Assert.isInstanceOf(events.test2, Y.CustomEvent);
        Y.Assert.isInstanceOf(events.test3, Y.CustomEvent);
        Y.Assert.areSame(1, events.test2.subscribers.length);
        Y.Assert.areSame(1, events.test3.subscribers.length);

        Y.Assert.isInstanceOf(handle, Y.EventHandle);
        Y.Assert.isArray(handle.evt);
        Y.Assert.areSame(2, handle.evt.length);
        Y.Assert.areSame(events.test2, handle.evt[0].evt);
        Y.Assert.areSame(events.test3, handle.evt[1].evt);
        Y.Assert.isUndefined(handle.sub);
    },

    "test target.on(type, { handleEvents: fn })": function () {
        var target = new Y.EventTarget(),
            events = target._yuievt.events,
            obj, handle, thisObj, fired, argCount, testEvent;

        function callback() {
            fired = true;
            thisObj = this;
            argCount = arguments.length;
        }

        obj = { handleEvents: callback };

        handle = target.on("test", obj);

        testEvent = events.test;
        Y.Assert.isInstanceOf(testEvent, Y.CustomEvent);
        Y.Assert.isArray(testEvent.subscribers);
        Y.Assert.areSame(1, testEvent.subscribers.length);
        Y.Assert.areSame(0, testEvent.afters.length);
        Y.Assert.isTrue(testEvent.hasSubs());

        Y.Assert.isInstanceOf(handle, Y.EventHandle);
        Y.Assert.areSame(testEvent, handle.evt);
        Y.Assert.isInstanceOf(handle.sub, Y.Subscriber);

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
        Y.Assert.isInstanceOf(testEvent, Y.CustomEvent);
        Y.Assert.isArray(testEvent.subscribers);
        Y.Assert.areSame(1, testEvent.subscribers.length);
        Y.Assert.areSame(0, testEvent.afters.length);
        Y.Assert.isTrue(testEvent.hasSubs());
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
        target.fire("test1");

        target.on("test2", isObj, obj);
        target.fire("test2");

        target.on("test3", isObj, obj, {});
        target.fire("test3");

        target.on("test4", isObj, obj, null, {}, {});
        target.fire("test4");

        target.on("test5", isTarget, null, {});
        target.fire("test5");

        target.on("prefix:test6", isTarget);
        target.fire("prefix:test6", obj);

        target.on(["test7", "prefix:test8"], isObj, obj);
        target.fire("test7");
        target.fire("prefix:test8");

        target.on({ "test9": isObj }, obj);
        target.fire("test9");

        target.on({
            "test10": { fn: isTarget },
            "test11": { fn: isObj, context: obj }
        });
        target.fire("test10");
        target.fire("test11");

        target.on({
            "test12": { fn: isObj },
            "prefix:test13": { fn: isTarget, context: target }
        }, obj);
        target.fire("test12");
        target.fire("prefix:test13");

        Y.Assert.areSame(5, targetCount);
        Y.Assert.areSame(7, objCount);
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

        Y.Assert.isInstanceOf(events.click, Y.CustomEvent);
        Y.Assert.isUndefined(events.click.domkey);
        Y.Assert.areSame(1, events.click.subscriptions.length);
    },

    "test event prefix": function() {
        var target1 = new Y.EventTarget()
            target2 = new Y.EventTaret({ prefix: 'test' });

        //target1.on(
        var fired1 = false,
            fired2 = false;

        var O = function(id) {
            this.id = id;
            Y.log('O constructor executed ' + id);
        }

        O.prototype = {
            oOo: function(ok) {
                Y.log('oOo');
            }
        }

        // pass configuration info into EventTarget with the following
        // construct
        Y.augment(O, Y.EventTarget, null, null, {
            emitFacade: true,
            prefix: 'prefix'
        });

        var o = new O();
        o.on('testPrefix', function(e, arg1, arg2) {
            Y.Assert.isTrue(this instanceof O);
            fired1 = true;
        });

        o.on('prefix:testPrefix', function(e, arg1, arg2) {
            Y.Assert.isTrue(this instanceof O);
            fired2 = true;
        });

        o.fire('testPrefix', { foo: 'afoo' }, 1, 2);

        Y.Assert.isTrue(fired1);
        // Y.Assert.isTrue(fired2);

        fired1 = false;
        fired2 = false;

        o.fire('prefix:testPrefix', { foo: 'afoo' }, 1, 2);
        Y.Assert.isTrue(fired1);
        Y.Assert.isTrue(fired2);
    },

    "test target.on(fn, host, methodName)": function () {
        var target = new Y.EventTarget(),
            called = [],
            handle, before;

        before = Y.Do.before;
        Y.Do.before = function () {
            called.push("before");
            return before.apply(this, arguments);
        };

        function callback() {
            called.push("callback");
        }

        function method() {
            called.push("method");
        }

        target.method = method;
            
        // awkward that you have to pass the target, and even more so
        // because this means every EventTarget is effectively an alias
        // for Y.Do
        handle = target.on(callback, target, "method");

        Y.Assert.areNotSame(method, target.method);
        Y.Assert.isObject(handle);
        Y.Assert.isInstanceOf(handle.evt, Y.Do.Method);

        target.method();

        Y.ArrayAssert.itemsAreSame(["before", "callback", "method"]);

        // restore the method for other tests
        Y.Do.before = before;
    },

    "test target.on(fn, host, methodName, context)": function () {
        var target = new Y.EventTarget(),
            called = [],
            handle, before;

        before = Y.Do.before;
        Y.Do.before = function () {
            called.push("before");
            return before.apply(this, arguments);
        };

        function callback() {
            called.push("callback");
        }

        function method() {
            called.push("method");
        }

        target.method = method;
            
        // awkward that you have to pass the target, and even more so
        // because this means every EventTarget is effectively an alias
        // for Y.Do
        handle = target.on(callback, target, "method");

        Y.Assert.areNotSame(method, target.method);
        Y.Assert.isObject(handle);
        Y.Assert.isInstanceOf(handle.evt, Y.Do.Method);

        target.method();

        Y.ArrayAssert.itemsAreSame(["before", "callback", "method"]);

        // restore the method for other tests
        Y.Do.before = before;
    },

    "test target.on(fn, host, noSuchMethod)": function () {
    },

    "test target.on([fnA, fnB, fnC], host, noSuchMethod)": function () {
    },

    "test target.before() is an alias for target.on()": function () {
    }

}));

suite.add(new Y.Test.Case({
    name: "Y.Do",

    _should: {
        fail: {
            "test before/after with falsy context binds args": "ticket pending"
        },
        ignore: {
            // Trac ticket noted as value
            "test originalRetVal not overwritten by nested call": 2530030
        }
    },

    "test before/after with falsy context binds args": function () {
        //Y.Do.before(fn, obj, "method", null, "a", obj, null);
    },

    "test Y.AlterReturn": function() {
        var et = new Y.EventTarget(), count = 0;

        et.after(function() {
            count++;
            Y.Assert.isTrue(Y.Do.originalRetVal);
            Y.Assert.isTrue(Y.Do.currentRetVal);
            return new Y.Do.AlterReturn("altered return", "altered");
        }, et, 'fire');

        et.after(function() {
            count++;
            Y.Assert.isTrue(Y.Do.originalRetVal);
            Y.Assert.areEqual("altered", Y.Do.currentRetVal);
        }, et, 'fire');


        et.fire('yay');
        Y.Assert.areEqual(2, count);

    },

    "test originalRetVal not overwritten by nested call": function () {
        var obj = {
            a: function () {
                this.b();
                return 'A';
            },

            b: function () {
                return 'B';
            }
        }

        Y.Do.after(function () {
            return Y.Do.originalRetVal.toLowerCase();
        }, obj, 'a');

        Y.Do.after(function () {
            // It doesn't matter what happens here, but for example, we
            // don't interfere with the return value
        }, obj, 'b');

        Y.Assert.areSame('a', obj.a());
    }
}));

suite.add(new Y.Test.Case({
    name: "target.once"

    test_listen_once: function() {

        var count = 0;

        Y.once(['foo', 'bar'], function(e) {
            count++;
        });

        Y.fire('foo', 'bar');
        Y.fire('bar', 'bar');

        Y.Assert.areEqual(2, count);

        Y.fire('foo', 'bar');
        Y.fire('bar', 'bar');

        Y.Assert.areEqual(2, count);

    },

}));

suite.add(new Y.Test.Case({
    name: "target.after"

}));

suite.add(new Y.Test.Case({
    name: "target.onceAfter"

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
    }
}));

suite.add(new Y.Test.Case({
    name: "target.detach"

    test_detach_by_signature: function() {

        var anim = new Y.Anim({
                node: '#demo',
                to: { opacity: 0 }
            }),
            count = 0;
            tester = function() {
                count++;
                Y.detach('foo', tester);
            };

        Y.on('foo', tester);

        Y.fire('foo');
        Y.fire('foo');
        Y.Assert.areEqual(1, count);

        var onEnd = function() {
            count++;
            // this.detach('anim:end', onEnd);
            this.detach('end', onEnd);
            this.setAttrs({
                to: { height: 1 },
                easing: Y.Easing.bounceOut
            });
            this.run();

            if (count > 2) {
                throw new Error('onEnd should only have happened once');
            }
        };

        // anim.on('end', onEnd);

        anim.run();
        anim.run();


    },

    testDetachKey: function() {

        var fired1 = false,
            fired2 = false;

        Y.on('handle|test:event', function() {
            fired1 = true;
        });

        // one listener
        Y.fire('test:event');
        Y.Assert.isTrue(fired1);
        Y.Assert.isFalse(fired2);

        Y.detach('handle|test:event');

        fired1 = false;
        fired2 = false;

        Y.on('handle|test:event', function() {
            fired2 = true;
        });

        // first lisener detached, added a new listener
        Y.fire('test:event');
        Y.Assert.isFalse(fired1);
        Y.Assert.isTrue(fired2);

        Y.detach('handle|test:event');
        fired1 = false;
        fired2 = false;

        Y.after('handle|test:event', function(arg1) {
            Y.Assert.areEqual('orange', arg1);
            Y.Assert.isTrue(fired1);
            fired2 = true;
        });

        // comma or pipe
        Y.on('handle|test:event', function(arg1) {
            Y.Assert.areEqual('orange', arg1);
            Y.Assert.isFalse(fired2);
            fired1 = true;
        });

        // testing on and after order
        Y.fire('test:event', 'orange');

        fired1 = false;
        fired2 = false;

        // spaces after the comma or lack thereof should have
        // no effect on the addition or removal of listeners
        var ret = Y.detach('handle|test:event');

        Y.Assert.areEqual(Y, ret);

        // added both an on listener and an after listener,
        // then detached both
        Y.fire('test:event', 'orange');
        Y.Assert.isFalse(fired1);
        Y.Assert.isFalse(fired2);

    },

    testDetachAllByKey: function() {

        var fired1 = false,
            fired2 = false;

        Y.after('handle|event2', function() {
            fired2 = true;
        });

        Y.on('handle|event2', function() {
            fired1 = true;
        });

        // detachAll
        Y.detach('handle|*');

        Y.fire('event2');

        Y.Assert.isFalse(fired1, 'fired1, the after listener should not have fired.');
        Y.Assert.isFalse(fired2, 'fired2, the on listener should not have fired.');

    },

    testDetachHandle: function() {
        var count = 0, handle, handle2;
        Y.publish('y:foo', {
            emitFacade: true
        });

        Y.on('y:foo', function(e) {
            count++;
            handle2.detach();
        });

        handle = Y.on('y:foo', function(e) {
            count += 100;
        });

        handle2 = Y.on('y:foo', function(e) {
            count += 1000;
        });

        Y.detach(handle);

        Y.fire('y:foo');

        Y.Assert.areEqual(1, count);

        count = 0;

        var handle3 = Y.on('y:click', function() {
            count++;
            handle3.detach();
        });

        Y.fire('y:click');
        Y.fire('y:click');

        var o = new Y.EventTarget();

        count = 0;

        o.on('foo', function(e) {
            count++;
        });

        o.on('foo', function(e) {
            count++;
        });

        o.detachAll();

        o.fire('foo');

        Y.Assert.areEqual(0, count);

        var handle3 = Y.on('y:click', function() {
            count++;
        });

        // detachAll can't be allowed to work on the YUI instance.
        Y.detachAll();

        Y.fire('y:click');

        Y.Assert.areEqual(1, count);
    }

    // detach handle wrapping multiple events
    // target.detach('~AFTER~')
    // handle = target.on([], fn); handle.detach() doesn't throw an error
}));

suite.add(new Y.Test.Case({
    name: "target.detachAll"

}));

suite.add(new Y.Test.Case({
    name: "target.fire"

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
        target.fire("test2")
        Y.ArrayAssert.itemsAreSame([], args);

        target.on("test2", callback, {}, "x");
        target.fire("test2")
        Y.ArrayAssert.itemsAreSame(["x"], args);

        target.on("test3", callback, {}, "x", false, null);
        target.fire("test3")
        Y.ArrayAssert.itemsAreSame(["x", false, null], args);

        target.on("test4", callback);
        target.fire("test4", "a")
        Y.ArrayAssert.itemsAreSame(["a"], args);

        target.on("test5", callback);
        target.fire("test5", "a", false, null)
        Y.ArrayAssert.itemsAreSame(["a", false, null], args);

        target.on("test6", callback, {}, "x", false, null);
        target.fire("test6", "a", true, target)
        Y.ArrayAssert.itemsAreSame(["a", true, target, "x", false, null], args);

        target.on("test6", callback, null, "x", false, null);
        target.fire("test6", "a", true, target)
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
            Y.log('Y foo2 executed');
            s1 = 1;
        });

        Y.Global.on('y:foo2', function() {
            Y.log('GLOBAL foo2 executed');
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
            Y.log('Y bar executed');
            s3 = 1;
        });

        Y.Global.on('y:bar', function() {
            Y.log('GLOBAL bar executed');
            s4 = 1;
        });

        o.fire('y:bar');

        Y.Assert.areEqual(1, s3);
        Y.Assert.areEqual(1, s4);

        Y.Global.on('y:bar', function(e) {
            Y.Assert.areEqual(0, e.stopped);
            // Y.Assert.areEqual(0, e._event.stopped);
            Y.log('GLOBAL bar executed');
            e.stopPropagation();
        });

        o.fire('y:bar');
        o.fire('y:bar');

        Y.Global.detachAll();

    }
}));

suite.add(new Y.Test.Case({
    name: "target.publish()"

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

    test_node_publish: function() {
        var node = Y.one('#adiv');

        var preventCount = 0, heard = 0;
        node.publish('foo1', {
            emitFacade: true,
            // should only be called once
            preventedFn: function() {
                preventCount++;
                Y.Assert.isTrue(this instanceof Y.Node);
            }
        });

        node.on('foo1', function(e) {
            Y.Assert.areEqual('faking foo', e.type);
            Y.Assert.areEqual('foo1', e._type);
            heard++;
            e.preventDefault();
        });

        node.on('foo1', function(e) {
            heard++;
            e.preventDefault();
        });

        node.fire('foo1', {
            type: 'faking foo'
        });

        Y.Assert.areEqual(1, preventCount);
        Y.Assert.areEqual(2, heard);
    },

    test_fire_once: function() {

        var notified = 0;

        Y.publish('fireonce', {
            fireOnce: true
        });

        Y.fire('fireonce', 'foo', 'bar');

        Y.on('fireonce', function(arg1, arg2) {
            notified++;
            Y.Assert.areEqual('foo', arg1, 'arg1 not correct for lazy fireOnce listener')
            Y.Assert.areEqual('bar', arg2, 'arg2 not correct for lazy fireOnce listener')
        });

        Y.fire('fireonce', 'foo2', 'bar2');
        Y.fire('fireonce', 'foo3', 'bar3');

        global_notified = false;

        Y.on('fireonce', function(arg1, arg2) {
            Y.log('the notification is asynchronous, so I need to wait for this test');
            Y.Assert.areEqual(1, notified, 'listener notified more than once.');
            global_notified = true;
        });

        // it is no longer asynchronous
        // Y.Assert.isFalse(global_notified, 'notification was not asynchronous');

    },

    test_async_fireonce: function() {
        Y.Assert.isTrue(global_notified, 'asynchronous notification did not seem to work.');
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
        YUI({ /* chain: true *//*
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

Y.Test.Runner.add(suite);
