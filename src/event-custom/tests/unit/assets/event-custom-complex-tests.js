YUI.add("event-custom-complex-tests", function(Y) {

    var suite = new Y.Test.Suite("Custom Event: Complex");

    suite.add(new Y.Test.Case({

        name: "Custom Event Complex",

        _should: {
            ignore : {
                test_node_publish: Y.UA.nodejs
            },
            fail: {
                testStopFnOnceFromBubbleTarget: "ticket pending",
                testStopFnFromBubbleTarget: "ticket pending"
            }
        },

        testAugment: function() {

            var fired = false;

            var O = function(id) {
                this.id = id;
                Y.log('O constructor executed ' + id);
            };

            O.prototype = {
                oOo: function(ok) {
                    Y.log('oOo');
                }
            };

            // pass configuration info into EventTarget with the following
            // construct
            Y.augment(O, Y.EventTarget, null, null, {
                emitFacade: true
            });

            var o = new O(),
            handle = o.on('testAugment', function(e, arg1, arg2) {
                Y.Assert.isTrue(this instanceof O);
                Y.Assert.isTrue(e instanceof Y.EventFacade);
                Y.Assert.isTrue(e.foo === 'afoo');
                Y.Assert.isTrue(e.details[1] === 1);
                Y.Assert.isTrue(arg1 === 1);
                Y.Assert.isTrue(arg2 === 2);
                fired = true;
            });

            o.fire('testAugment', { foo: 'afoo' }, 1, 2);

            Y.Assert.isTrue(fired);

            handle.detach();

            // if the first argument is not an object, the
            // event facade is moved in front of the args rather
            // than overwriting existing object.
            o.on('testAugment', function(e, arg1, arg2) {
                Y.Assert.areEqual(1, arg1);
                Y.Assert.areEqual(2, arg2);
            });

            o.fire('testAugment', 1, 2);

        },

        testExtend: function() {

            var fired = false;

            var Base = function() {
                Y.log('Base constructor executed');
                arguments.callee.superclass.constructor.apply(this, arguments);
            };

            Y.extend(Base, Y.EventTarget, {
                base: function() {
                    Y.log('all your base...');
                }
            });

            var b = new Base();
            b.on('testExtend', function(arg1, arg2) {
                Y.Assert.isTrue(this instanceof Base);
                Y.Assert.isTrue(arg1 === 1);
                Y.Assert.isTrue(arg2 === 2);
                fired = true;
            });

            b.fire('testExtend', 1, 2);

            Y.Assert.isTrue(fired);
        },

        testPrefix: function() {

            var fired1 = false,
                fired2 = false;

            var O = function(id) {
                this.id = id;
                Y.log('O constructor executed ' + id);
            };

            O.prototype = {
                oOo: function(ok) {
                    Y.log('oOo');
                }
            };

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
            YUI({
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

        testObjType: function() {
            var f1, f2;
            Y.on({
                'y:click': function() {f1 = true;},
                'y:clack': function() {f2 = true;}
            });

            Y.fire('y:click');
            Y.fire('y:clack');

            Y.Assert.isTrue(f1);
            Y.Assert.isTrue(f2);
        },

        testBubble: function() {
            var count = 0,
                ret,
                config = {
                    emitFacade: true,
                    bubbles: true
                },
                a = new Y.EventTarget(config),
                b = new Y.EventTarget(config);

            b.addTarget(a);

            // this should not be necessary // fixed
            // b.publish('test:foo');

            a.on('test:foo', function(e) {
                count++;
                // we will fire this on the parent, so that should be the target
                Y.Assert.areEqual(b, e.target);
                Y.Assert.areEqual(a, e.currentTarget);
            });

            ret = b.fire('test:foo', {}, b);

            Y.Assert.areEqual(1, count);
            Y.Assert.isTrue(ret);

            b.on('test:foo', function(e) {
                e.stopPropagation();
            });

            ret = b.fire('test:foo', {}, b);

            Y.Assert.areEqual(1, count);
            Y.Assert.isFalse(ret);
        },

        testPreventFnOnce: function() {
            var count = 0;
            Y.publish('y:foo1', {
                emitFacade: true,
                preventedFn: function() {
                    count++;
                    Y.Assert.isTrue(this instanceof YUI);
                }
            });

            Y.on('y:foo1', function(e) {
                e.preventDefault();
            });

            Y.on('y:foo1', function(e) {
                e.preventDefault();
            });

            Y.fire('y:foo1');

            Y.Assert.areEqual(1, count);
        },

        testPreventFromBubbleTarget: function () {
            var count = 0,
                target = new Y.EventTarget({ prefix: 'x' });

            target.publish('foo', {
                emitFacade: true,
                preventedFn: function() {
                    count++;
                }
            });

            target.addTarget(Y);

            Y.on('x:foo', function(e) {
                e.preventDefault();
            });

            target.fire('foo');

            Y.Assert.areEqual(1, count);
        },

        testPreventedFnOnceFromBubbleTarget: function () {
            var count = 0,
                target = new Y.EventTarget({ prefix: 'x' });

            target.publish('foo', {
                emitFacade: true,
                preventedFn: function() {
                    count++;
                }
            });

            target.addTarget(Y);

            Y.on('x:foo', function(e) {
                e.preventDefault();
            });

            Y.on('x:foo', function(e) {
                e.preventDefault();
            });

            target.fire('foo');

            Y.Assert.areEqual(1, count);

            target.on('foo', function (e) {
                e.preventDefault();
            });

            target.fire('foo');

            Y.Assert.areEqual(2, count);
        },

        testStopFnOnce: function () {
            var count = 0,
                target = new Y.EventTarget({ prefix: 'a' });

            target.publish('foo', {
                emitFacade: true,
                stoppedFn: function () {
                    count++;
                }
            });

            target.on('foo', function (e) {
                e.stopPropagation();
            });

            target.on('foo', function (e) {
                e.stopPropagation();
            });

            target.fire('foo');

            Y.Assert.areEqual(1, count);
        },

        testStopFnFromBubbleTarget: function () {
            var count = 0,
                origin = new Y.EventTarget({ prefix: 'a' }),
                targetB = new Y.EventTarget({ prefix: 'b' });

            origin.publish('foo', {
                emitFacade: true,
                stoppedFn: function () {
                    count++;
                }
            });

            targetB.on('foo', function (e) {
                e.stopPropagation();
            });

            origin.fire('foo');

            Y.Assert.areEqual(1, count);
        },

        testStopFnOnceFromBubbleTarget: function () {
            var count = 0,
                origin = new Y.EventTarget({ prefix: 'a' }),
                targetB = new Y.EventTarget({ prefix: 'b' }),
                targetC = new Y.EventTarget({ prefix: 'c' });

            origin.publish('foo', {
                emitFacade: true,
                stoppedFn: function() {
                    count++;
                }
            });

            targetB.addTarget(targetC);
            origin.addTarget(targetB);

            targetB.on('foo', function (e) {
                e.stopPropagation();
            });

            targetB.on('foo', function (e) {
                e.stopPropagation();
            });

            origin.fire('foo');

            Y.Assert.areEqual(1, count, "stopProp called twice from bubble target resulted in stoppedFn called wrong number of times");

            count = 0;

            targetC.on('foo', function (e) {
                e.stopPropagation();
            });

            origin.fire('foo');

            Y.Assert.areEqual(1, count, "stopProp called from intermediate bubble target didn't prevent stoppedFn call from subsequent bubble target");

            count = 0;

            origin.on('foo', function (e) {
                e.stopPropagation();
            });

            origin.fire('foo');

            Y.Assert.areEqual(1, count, "stopProp called from event origin subscription didn't prevent calls to stoppedFn from bubble target");
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

            handle3 = Y.on('y:click', function() {
                count++;
            });

            // detachAll can't be allowed to work on the YUI instance.
            Y.detachAll();

            Y.fire('y:click');

            Y.Assert.areEqual(1, count);
        },

        testFireArgsWithFacade : function() {

            var o = new Y.EventTarget({emitFacade:true}),
                args,
                facade,
                fired = [];

            o.after("foo", function() {
                fired.push(Y.Array(arguments));
            });

            o.fire("foo");
            o.fire("foo", {a:1, b:2});
            o.fire("foo", {a:10, b:20}, {c:30});
            o.fire("foo", {a:100, b:200}, {c:300}, {d:400});

            args = fired[0];
            facade = args[0];

            Y.Assert.areEqual(1, args.length);
            Y.Assert.isTrue(facade instanceof Y.EventFacade);
            Y.Assert.areEqual("foo", facade.type);
            Y.Assert.areEqual(0, facade.details.length);

            args = fired[1];
            facade = args[0];

            Y.Assert.areEqual(1, args.length);
            Y.Assert.isTrue(facade instanceof Y.EventFacade);
            Y.Assert.areEqual("foo", facade.type);
            Y.Assert.areEqual(1, facade.details.length);
            Y.ObjectAssert.areEqual({a:1, b:2}, facade.details[0]);
            Y.Assert.areEqual(1, facade.a);
            Y.Assert.areEqual(2, facade.b);

            args = fired[2];
            facade = args[0];

            Y.Assert.areEqual(2, args.length);
            Y.ObjectAssert.areEqual({c:30}, args[1]);

            Y.Assert.isTrue(facade instanceof Y.EventFacade);
            Y.Assert.areEqual("foo", facade.type);
            Y.Assert.areEqual(2, facade.details.length);
            Y.ObjectAssert.areEqual({a:10, b:20}, facade.details[0]);
            Y.ObjectAssert.areEqual({c:30}, facade.details[1]);
            Y.Assert.areEqual(10, facade.a);
            Y.Assert.areEqual(20, facade.b);
            Y.Assert.isFalse("c" in facade);

            args = fired[3];
            facade = args[0];

            Y.Assert.areEqual(3, args.length);
            Y.ObjectAssert.areEqual({c:300}, args[1]);
            Y.ObjectAssert.areEqual({d:400}, args[2]);

            Y.Assert.isTrue(facade instanceof Y.EventFacade);
            Y.Assert.areEqual("foo", facade.type);
            Y.Assert.areEqual(3, facade.details.length);
            Y.ObjectAssert.areEqual({a:100, b:200}, facade.details[0]);
            Y.ObjectAssert.areEqual({c:300}, facade.details[1]);
            Y.ObjectAssert.areEqual({d:400}, facade.details[2]);
            Y.Assert.areEqual(100, facade.a);
            Y.Assert.areEqual(200, facade.b);
            Y.Assert.isFalse("c" in facade);
            Y.Assert.isFalse("d" in facade);
        },

        testFireArgsWithoutFacade : function() {

            var o = new Y.EventTarget({emitFacade:false}),
                args,
                facade,
                fired = [];

            o.after("foo", function() {
                fired.push(Y.Array(arguments));
            });

            o.fire("foo");
            o.fire("foo", {a:1, b:2});
            o.fire("foo", {a:10, b:20}, {c:30});
            o.fire("foo", {a:100, b:200}, {c:300}, {d:400});

            args = fired[0];

            Y.Assert.areEqual(0, args.length);

            args = fired[1];

            Y.Assert.areEqual(1, args.length);
            Y.ObjectAssert.areEqual({a:1, b:2}, args[0]);

            args = fired[2];

            Y.Assert.areEqual(2, args.length);
            Y.ObjectAssert.areEqual({a:10, b:20}, args[0]);
            Y.ObjectAssert.areEqual({c:30}, args[1]);

            args = fired[3];

            Y.Assert.areEqual(3, args.length);
            Y.ObjectAssert.areEqual({a:100, b:200}, args[0]);
            Y.ObjectAssert.areEqual({c:300}, args[1]);
            Y.ObjectAssert.areEqual({d:400}, args[2]);
        },

        testBroadcast: function() {
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

        },

        // SRC, ON
        // BUBBLE, ON
        // BUBBLE, DEFAULT BEHAVIOR
        // BUBBLE, AFTER
        // SRC, DEFAULT BEHAVIOR
        // SRC, AFTER
        __testBubbleSequence300GA: function() {
            var count = 0,
                called = null,
                fn = function() {
                    called = this.name;
                },
                config = {
                    emitFacade: true,
                    bubbles: true
                },
                leaf = new Y.EventTarget(config),
                branch = new Y.EventTarget(config),
                root = new Y.EventTarget(config);

            leaf.name = 'leaf';
            branch.name = 'branch';
            root.name = 'root';

            leaf.addTarget(branch);
            branch.addTarget(root);

            leaf.publish('test:foo', { defaultFn: fn});
            branch.publish('test:foo', { defaultFn: fn});
            root.publish('test:foo', { defaultFn: fn});

            leaf.on('test:foo', function(e) {
                Y.Assert.areEqual(0, count, 'leaf.on should be first');
                Y.Assert.isNull(called, 'leaf.on should be executed before any default function');
                count++;
            });

            branch.on('test:foo', function() {
                Y.Assert.areEqual(1, count, 'branch.on should be second');
                Y.Assert.isNull(called, 'branch.on should be executed before any default function');
                count++;
            });

            root.on('test:foo', function() {
                Y.Assert.areEqual(2, count, 'root.on should be third');
                Y.Assert.isNull(called, 'root.on should be executed before any default function');
                count++;
            });

            root.after('test:foo', function() {
                Y.Assert.areEqual(3, count, 'root.after should be fourth');
                Y.Assert.areEqual('root', called, 'root.after should be executed after the root default function');
                count++;
            });

            branch.after('test:foo', function() {
                Y.Assert.areEqual(4, count, 'branch.after should be fifth');
                Y.Assert.areEqual('branch', called, 'branch.after should be executed after the branch default function');
                count++;
            });

            leaf.after('test:foo', function(e) {
                Y.Assert.areEqual(5, count, 'leaf.after should be sixth and last');
                Y.Assert.areEqual('leaf', called, 'leaf.after should be executed after the leaf default function');
                count++;
            });

            leaf.fire('test:foo', {}, leaf);
            Y.Assert.areEqual(6, count);

        },

        // Ideally it should be this, but the defaultFn order is the least important bit
        // and there are issues changing the order.
        // SRC, ON
        // BUBBLE, ON
        // SRC, DEFAULT BEHAVIOR
        // BUBBLE, DEFAULT BEHAVIOR (unless configured to only execute the default function on the target)
        // SRC, AFTER
        // BUBBLE, AFTER

        // The actual order is this:
        // SRC, ON
        // BUBBLE, ON
        // BUBBLE, DEFAULT BEHAVIOR
        // SRC, DEFAULT BEHAVIOR (unless configured to only execute the default function on the target)
        // SRC, AFTER
        // BUBBLE, AFTER
        testAlternativeSequencePost300GA: function() {
            var count = 0,
                called = null,
                fn = function() {
                    called = this.name;
                },
                config = {
                    emitFacade: true,
                    bubbles: true
                },
                leaf = new Y.EventTarget(config),
                branch = new Y.EventTarget(config),
                root = new Y.EventTarget(config);

            leaf.name = 'leaf';
            branch.name = 'branch';
            root.name = 'root';

            leaf.addTarget(branch);
            branch.addTarget(root);

            leaf.publish('test:foo', { defaultFn: fn});
            branch.publish('test:foo', { defaultFn: fn});
            root.publish('test:foo', { defaultFn: fn});

            leaf.on('test:foo', function(e) {
                Y.Assert.areEqual(0, count, 'leaf.on should be first');
                Y.Assert.isNull(called, 'leaf.on should be executed before any default function');
                count++;
            });

            branch.on('test:foo', function() {
                Y.Assert.areEqual(1, count, 'branch.on should be second');
                Y.Assert.isNull(called, 'branch.on should be executed before any default function');
                count++;
            });

            root.on('test:foo', function() {
                Y.Assert.areEqual(2, count, 'root.on should be third');
                Y.Assert.isNull(called, 'root.on should be executed before any default function');
                count++;
            });

            leaf.after('test:foo', function(e) {
                Y.Assert.areEqual(3, count, 'leaf.after should be fourth');
                // Y.Assert.areEqual('root', called, 'leaf.after should be executed after the root default function');
                Y.Assert.areEqual('leaf', called, 'leaf.after should be executed after the root default function');
                count++;
            });

            branch.after('test:foo', function() {
                Y.Assert.areEqual(4, count, 'branch.after should be fifth');
                // Y.Assert.areEqual('root', called, 'leaf.after should be executed after the root default function');
                Y.Assert.areEqual('leaf', called, 'leaf.after should be executed after the root default function');
                count++;
            });

            root.after('test:foo', function() {
                Y.Assert.areEqual(5, count, 'root.after should be sixth and last');
                // Y.Assert.areEqual('root', called, 'leaf.after should be executed after the root default function');
                Y.Assert.areEqual('leaf', called, 'leaf.after should be executed after the root default function');
                count++;
            });

            leaf.fire('test:foo', {}, leaf);
            Y.Assert.areEqual(6, count, 'total subscriber count');

        },

        testStarSubscriber: function() {
            var count = 0,
                ret,
                config = {
                    emitFacade: true,
                    bubbles: true,
                    prefix: 'stars'
                },
                z = new Y.EventTarget(config),
                a = new Y.EventTarget(config),
                b = new Y.EventTarget(config);

            b.addTarget(a);
            a.addTarget(z);

            z.on('*:foo', function(e) {
                count++;
                // b -> a -> z -- the parent's parent should be the target
                Y.Assert.areEqual(b, e.target);
                Y.Assert.areEqual(z, e.currentTarget);
                switch (count) {
                    case 1:
                        Y.Assert.areEqual('a:foo', e.type);
                        break;
                    case 2:
                        Y.Assert.areEqual('b:foo', e.type);
                        break;
                    case 3:
                        Y.Assert.areEqual('stars:foo', e.type);
                        break;
                }
            });

            ret = b.fire('a:foo', {}, b);

            Y.Assert.areEqual(1, count);
            Y.Assert.isTrue(ret);

            ret = b.fire('b:foo', {}, b);

            Y.Assert.areEqual(2, count);
            Y.Assert.isTrue(ret);

            // if the event target is not configured with a prefix, this won't work by design.
            ret = b.fire('foo', {}, b);
            Y.Assert.areEqual(3, count);

            Y.Assert.isTrue(ret);
        },

        testPreventBubble: function() {
            var count = 0,
                ret,
                config = {
                    emitFacade: true,
                    bubbles: true,
                    prefix: 'stars'
                },
                z = new Y.EventTarget(config),
                a = new Y.EventTarget(config),
                b = new Y.EventTarget(config);

            b.addTarget(a);
            a.addTarget(z);

            z.after('*:foo', function(e) {

                // e.preventDefault();
                Y.Assert.areEqual(b, e.target);

            });

            ret = b.fire('a:foo', {}, b);

            Y.Assert.areEqual(0, count);
        },

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

        test_array_type_param: function() {
            var result = '';

            var handle1 = Y.after(['foo', 'bar'], function(type) {
                result += 'after' + type;
            });

            var handle2 = Y.on(['foo', 'bar'], function(type) {
                result += 'on' + type;
            });

            Y.fire('foo', 'foo');
            Y.fire('bar', 'bar');

            Y.Assert.areEqual('onfooafterfooonbarafterbar', result);

            handle1.detach();
            handle2.detach();

            Y.fire('foo', 'foo');
            Y.fire('bar', 'bar');

            Y.Assert.areEqual('onfooafterfooonbarafterbar', result);
        },

        testFireWithFacadeAndNull : function() {
            var a = new Y.EventTarget({emitFacade:true}),
                args;

            a.after("foo", function() {
                args = Y.Array(arguments);
            });

            a.fire("foo", null);

            Y.Assert.areEqual(2, args.length);

            Y.Assert.isTrue(args[0] instanceof Y.EventFacade);
            Y.Assert.isNull(args[1]);

            Y.Assert.areEqual(1, args[0].details.length);
            Y.Assert.isNull(args[0].details[0]);

            a.fire("foo", null, 10);

            Y.Assert.areEqual(3, args.length);

            Y.Assert.isTrue(args[0] instanceof Y.EventFacade);
            Y.Assert.isNull(args[1]);
            Y.Assert.areEqual(10, args[2]);

            Y.Assert.areEqual(2, args[0].details.length);
            Y.Assert.isNull(args[0].details[0]);
            Y.Assert.areEqual(10, args[0].details[1]);
        },

        testDefaultFnWithoutSubscribers : function() {
            var a = new Y.EventTarget(),
                count = 0;

            a.publish("foo", {
                emitFacade: true,
                defaultFn : function(e) {
                    Y.Assert.areEqual(1, e.bar, "incorrect payload");
                    Y.Assert.areSame(a, e.target, "incorrect target");
                    Y.Assert.areSame(a, e.currentTarget, "incorrect currentTarget");
                    count = 1;
                }
            });

            a.fire("foo", {
                bar:1
            });

            Y.Assert.areEqual(1, count);
        },

        testFreshPayloadWithoutSubscribers : function() {

            var a = new Y.EventTarget(),
                payload,
                defaultPayload = [];

            a.publish("foo", {
                emitFacade: true,

                defaultFn : function(e) {
                    defaultPayload.push(e);
                }
            });

            a.fire("foo", {
                foo:1
            });

            a.fire("foo", {
                bar:2
            });

            Y.Assert.areEqual(defaultPayload[0].foo, 1);
            Y.Assert.isFalse("bar" in defaultPayload[0]);

            Y.Assert.isFalse("foo" in defaultPayload[1]);
            Y.Assert.areEqual(defaultPayload[1].bar, 2);
        },

        testFreshPayloadWithAfterSubscriber : function() {

            var a = new Y.EventTarget(),
                payload,

                listenerPayload = [],
                defaultPayload = [];

            a.publish("foo", {
                emitFacade: true,

                defaultFn : function(e) {
                    defaultPayload.push(e);
                }
            });

            a.after("foo", function(e) {
                listenerPayload.push(e);
            });

            a.fire("foo", {
                foo:1
            });

            a.fire("foo", {
                bar:2
            });

            Y.Assert.areEqual(defaultPayload[0].foo, 1);
            Y.Assert.isFalse("bar" in defaultPayload[0]);

            Y.Assert.isFalse("foo" in defaultPayload[1]);
            Y.Assert.areEqual(defaultPayload[1].bar, 2);

            Y.Assert.areSame(defaultPayload[0], listenerPayload[0]);

            Y.ObjectAssert.areEqual(defaultPayload[0], listenerPayload[0]);
            Y.ObjectAssert.areEqual(defaultPayload[1], listenerPayload[1]);
        },

        testFreshPayloadWithOnSubscriber : function() {

            var a = new Y.EventTarget(),
                payload,

                listenerPayload = [],
                defaultPayload = [];

            a.publish("foo", {
                emitFacade: true,

                defaultFn : function(e) {
                    defaultPayload.push(e);
                }
            });

            a.on("foo", function(e) {
                listenerPayload.push(e);
            });

            a.fire("foo", {
                foo:1
            });

            a.fire("foo", {
                bar:2
            });

            Y.Assert.areEqual(defaultPayload[0].foo, 1);
            Y.Assert.isFalse("bar" in defaultPayload[0]);

            Y.Assert.isFalse("foo" in defaultPayload[1]);
            Y.Assert.areEqual(defaultPayload[1].bar, 2);

            Y.Assert.areSame(defaultPayload[0], listenerPayload[0]);

            Y.ObjectAssert.areEqual(defaultPayload[0], listenerPayload[0]);
            Y.ObjectAssert.areEqual(defaultPayload[1], listenerPayload[1]);
        },

        test_bubble_config: function() {

            var a = new Y.EventTarget(),
                b = new Y.EventTarget(),
                result;

            a.publish("foo", {
                emitFacade: true
            });
            a.addTarget(b);

            b.on("foo", function(e) {
                result = (e instanceof Y.EventFacade);
            });

            a.fire("foo");

            Y.Assert.isTrue(result);

        },

        test_get_targets: function () {
            var a = new Y.EventTarget(),
                b = new Y.EventTarget();

            Y.Assert.isArray(a.getTargets());

            a.addTarget(b);
            Y.ArrayAssert.itemsAreSame([b], a.getTargets());
        },

        test_remove_target_after_add: function () {
            var a = new Y.EventTarget(),
                b = new Y.EventTarget();

            a.addTarget(b);
            Y.ArrayAssert.contains(b, a.getTargets());

            a.removeTarget(b);
            Y.ArrayAssert.doesNotContain(b, a.getTargets());
        },

        test_remove_target_no_add: function () {
            var a = new Y.EventTarget(),
                b = new Y.EventTarget();

            Y.ArrayAssert.doesNotContain(b, a.getTargets());

            a.removeTarget(b);
            Y.ArrayAssert.doesNotContain(b, a.getTargets());
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

        test_multiple_object_publish: function () {
            var target = new Y.EventTarget({ emitFacade: true, prefix: 'a' }),
                pass;

            target.publish({ foo: {} });
            target.publish({
                bar: {
                    defaultFn: function () { pass = true; }
                }
            });

            target.fire('bar');

            Y.Assert.isTrue(pass);
        },

        testIndividualCustomEventMonitoring: function () {
            var target = new Y.EventTarget({
                    emitFacade: true,
                    prefix: 'a'
                }),
                actual = [],
                expected = ["a:foo_publish", "et-a:foo_publish", "a:foo_attach", "et-a:foo_attach", "a:foo_attach", "et-a:foo_attach", "a:foo_fire", "et-a:foo_fire", "a:foo_detach", "et-a:foo_detach", "a:foo_detach", "et-a:foo_detach"],
                handleOn,
                handleAfter;

            var ce = target.publish("foo", {
                defaultFn: function origDefFn() {}
            });

            // --

            ce.monitor("attach", function(e) {
                actual.push(e.type);
                Y.Assert.areEqual(e.monitored, "attach");
            });

            ce.monitor("fire", function(e) {
                actual.push(e.type);

                Y.ObjectAssert.areEqual(e.args[0], {
                    a:1,
                    b:2,
                    c:3
                });

                Y.Assert.areEqual(e.monitored, "fire");
            });

            ce.monitor("publish", function(e) {
                actual.push(e.type);
                Y.Assert.areEqual(e.monitored, "publish");
            });

            ce.monitor("detach", function(e) {
                actual.push(e.type);
                Y.Assert.areEqual(e.monitored, "detach");
            });

            // --

            target.on("a:foo_attach", function(e) {
                actual.push("et-" + e.type);
                Y.Assert.areEqual(e.monitored, "attach");
            });

            target.on("a:foo_fire", function(e) {
                actual.push("et-" + e.type);
                Y.Assert.areEqual(e.monitored, "fire");
            });

            target.on("a:foo_publish", function(e) {
                actual.push("et-" + e.type);
                Y.Assert.areEqual(e.monitored, "publish");
            });

            target.on("a:foo_detach", function(e) {
                actual.push("et-" + e.type);
                Y.Assert.areEqual(e.monitored, "detach");
            });

            // --

            target.publish("foo", {
                defaultFn : function newDefFn() {}
            });

            handleOn = target.on("foo", function() {});
            handleAfter = target.after("foo", function() {});

            target.fire("foo", {a:1, b:2, c:3});

            handleOn.detach();
            handleAfter.detach();
        },

        'ignore: Does not work currently due to infinite recursion - testEventTargetMonitoring': function () {

            var target = new Y.EventTarget({
                    monitored:true, // Doesn't work currently. Causes infinite recursion
                    emitFacade: true,
                    prefix: 'a'
                }),
                actual = [],
                expected = ["a:foo_publish", "a:foo_attach", "a:foo_attach", "a:foo_fire", "a:foo_detach", "a:foo_detach"],
                handleOn,
                handleAfter;

            target.on("a:foo_attach", function(e) {
                actual.push(e.type);
            });

            target.on("a:foo_fire", function(e) {
                actual.push(e.type);
            });

            target.on("a:foo_publish", function(e) {
                actual.push(e.type);
            });

            target.on("a:foo_detach", function(e) {
                actual.push(e.type);
            });

            target.publish("foo", {
                defaultFn: function origDefFn() {}
            });

            handleOn = target.on("foo", function() {});
            handleAfter = target.after("foo", function() {});

            target.fire("foo", {a:1, b:2, c:3});

            handleOn.detach();
            handleAfter.detach();
        },

        test_node_publish: function() {

            var node = Y.Node.create("<div>a div</div>");
            Y.one("body").append(node);

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

            node.remove(true);
        },

        // Ticket #676 - this was throwing an error in 3.10.0
        "test sibling once() subscriptions - once('*:type')": function () {
            var target = new Y.EventTarget({ emitFacade: true });

            target.once('*:foo', function (e) {
                Y.Assert.isTrue(true);
            });

            target.fire('x:foo');
        }

    }));

    suite.add(new Y.Test.Case({

        name: "Fire Once",

        test_fire_once_with_initial_listeners: function() {

            var notified = [],
                test = this,
                et = new Y.EventTarget({emitFacade:true});

            et.publish('fireonce', {
                fireOnce: true
            });

            et.on('fireonce', function(e, arg) {

                notified.push("before");

                Y.Assert.isTrue(e instanceof Y.EventFacade);
                Y.Assert.areEqual('bar', e.foo, 'first arg not correct for early fireOnce listener');
                Y.Assert.areSame(et, e.target);
                Y.Assert.areEqual('baz', arg, 'second arg not correct for early fireOnce listener');
            });

            et.fire('fireonce', {foo:'bar'}, 'baz');

            et.on('fireonce', function(e, arg) {

                notified.push("after");

                Y.Assert.isTrue(e instanceof Y.EventFacade);
                Y.Assert.areEqual('bar', e.foo, 'first arg not correct for late fireOnce listener');
                Y.Assert.areSame(et, e.target);
                Y.Assert.areEqual('baz', arg, 'second arg not correct for late fireOnce listener');
            });

            Y.ArrayAssert.itemsAreEqual(["before", "after"], notified);

        },

        test_fire_once_without_initial_listeners: function() {

            var notified = 0,
                test = this,
                et = new Y.EventTarget({emitFacade:true});

            et.publish('fireonce', {
                fireOnce: true
            });

            et.fire('fireonce', {foo:'bar'}, 'baz');

            et.on('fireonce', function(e, arg) {

                notified++;

                Y.Assert.isTrue(e instanceof Y.EventFacade);
                Y.Assert.areEqual('bar', e.foo);
                Y.Assert.areSame(et, e.target);
                Y.Assert.areEqual('baz', arg);
            });

            Y.Assert.areEqual(1, notified);
        },

        test_fire_once_with_initial_listeners_and_no_args: function() {

            var notified = [],
                test = this,
                et = new Y.EventTarget({emitFacade:true});

            et.publish('fireonce', {
                fireOnce: true
            });

            et.on('fireonce', function(e) {

                notified.push("before");

                Y.Assert.areEqual(1, arguments.length, 'arg length not correct for early listener');
                Y.Assert.isTrue(e instanceof Y.EventFacade, 'facade not found for early listener');
                Y.Assert.areSame(et, e.target, 'target not correct for early listener');
            });

            et.fire('fireonce');

            et.on('fireonce', function(e) {

                notified.push("after");

                Y.Assert.areEqual(1, arguments.length, 'arg length not correct for late listener');
                Y.Assert.isTrue(e instanceof Y.EventFacade, 'facade not found for late listener');
                Y.Assert.areSame(et, e.target, 'target not correct for late listener');
            });

            Y.ArrayAssert.itemsAreEqual(["before", "after"], notified);
        },

        test_fire_once_without_initial_listeners_and_no_args: function() {

            var notified = 0,
                test = this,
                et = new Y.EventTarget({emitFacade:true});

            et.publish('fireonce', {
                fireOnce: true
            });

            et.fire('fireonce');

            et.on('fireonce', function(e) {

                notified++;

                Y.Assert.areEqual(1, arguments.length);
                Y.Assert.isTrue(e instanceof Y.EventFacade);
                Y.Assert.areSame(et, e.target);
            });

            Y.Assert.areEqual(1, notified);
        },

        test_fire_once_no_facade_with_initial_listeners: function() {

            var notified = [],
                test = this,
                et = new Y.EventTarget();

            et.publish('fireonce', {
                fireOnce: true
            });

            et.on('fireonce', function(arg1, arg2) {

                notified.push("before");

                Y.Assert.areEqual(2, arguments.length, 'arg length not correct for early listener');
                Y.ObjectAssert.areEqual({foo:'bar'}, arg1, 'first arg not correct for early listener');
                Y.Assert.areEqual('baz', arg2, 'second arg not correct for early listener');
            });

            et.fire('fireonce', {foo:'bar'}, 'baz');

            et.on('fireonce', function(arg1, arg2) {

                notified.push("after");

                Y.Assert.areEqual(2, arguments.length, 'arg length not correct for late listener');
                Y.ObjectAssert.areEqual({foo:'bar'}, arg1, 'first arg not correct for late listener');
                Y.Assert.areEqual('baz', arg2, 'second arg not correct for late listener');
            });

            Y.ArrayAssert.itemsAreEqual(["before", "after"], notified);

        },

        test_fire_once_no_facade_without_initial_listeners: function() {

            var notified = 0,
                test = this,
                et = new Y.EventTarget();

            et.publish('fireonce', {
                fireOnce: true
            });

            et.fire('fireonce', {foo:'bar'}, 'baz');

            et.on('fireonce', function(arg1, arg2) {

                notified++;

                Y.Assert.areEqual(2, arguments.length);
                Y.ObjectAssert.areEqual({foo:'bar'}, arg1);
                Y.Assert.areEqual('baz', arg2);
            });

            Y.Assert.areEqual(1, notified);
        },

        test_fire_once_no_facade_with_initial_listeners_and_no_args: function() {

            var notified = [],
                test = this,
                et = new Y.EventTarget();

            et.publish('fireonce', {
                fireOnce: true
            });

            et.on('fireonce', function() {
                notified.push("before");
                Y.Assert.areEqual(0, arguments.length, 'arg length not correct for early listener');
            });

            et.fire('fireonce');

            et.on('fireonce', function() {
                notified.push("after");
                Y.Assert.areEqual(0, arguments.length, 'arg length not correct for late listener');
            });

            Y.ArrayAssert.itemsAreEqual(["before", "after"], notified);
        },

        test_fire_once_no_facade_without_initial_listeners_and_no_args: function() {

            var notified = 0,
                test = this,
                et = new Y.EventTarget();

            et.publish('fireonce', {
                fireOnce: true
            });

            et.fire('fireonce');

            et.on('fireonce', function() {
                notified++;
                Y.Assert.areEqual(0, arguments.length);
            });

            Y.Assert.areEqual(1, notified);
        },

        test_Y_fire_once: function() {

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
                Y.log('the notification is asynchronous, so I need to wait for this test');
                Y.Assert.areEqual(1, notified, 'listener notified more than once.');
                test.global_notified = true;
            });

            // it is no longer asynchronous
            // Y.Assert.isFalse(global_notified, 'notification was not asynchronous');
        },

        test_async_fireonce: function() {
            Y.Assert.isTrue(this.global_notified, 'asynchronous notification did not seem to work.');
        }

    }));

    Y.Test.Runner.add(suite);

}, '@VERSION@' ,{requires:['event-custom', 'test']});
