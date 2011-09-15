var complexSuite = new Y.Test.Suite("Complex Custom Event tests");

complexSuite.add(new Y.Test.Case({
    name: "EventTarget configured with emitFacade: true",

    "test event prefix": function() {
        var target1 = new Y.EventTarget()
            target2 = new Y.EventTaret({ prefix: 'test' });

        //target1.on(
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
    }

}));

complexSuite.add(new Y.Test.Case({
    name: "publish"

}));

complexSuite.add(new Y.Test.Case({
    name: "bubbling",

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

    }

    // bubbling without prefixes

}));

Y.Test.Runner.add(complexSuite);
