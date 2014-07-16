YUI.add('oop-test', function (Y) {

var Assert       = Y.Assert,
    ArrayAssert  = Y.ArrayAssert,
    ObjectAssert = Y.ObjectAssert,

    suite  = new Y.Test.Suite('OOP');

suite.add(new Y.Test.Case({
    name: 'Core',
    _should: {
        ignore: {
            test_clone_node: Y.UA.nodejs
        }
    },

    test_clone: function () {
        var a = {
            'bool' : false,
            'num'  : 0,
            'nul' : null,
            'undef': undefined,
            'T'    : 'blabber'
        };

        Assert.isTrue((a.T === 'blabber'));

        var b = Y.clone(a);

        var c = (function() {
            var _c = 3;

            return {
                a: 1,
                b: 2,
                c: function() {
                    return _c;
                }
            };
        }());

        var d = Y.clone(c);

        Assert.isTrue((d.a === 1));
        Assert.isTrue((d.c() === 3));

    },

    test_clone_node: function () {
        var a = {
            node: Y.one(document.createElement('div')),
            y: Y,
            w: window,
            d: document,
            el: document.createElement('div')
        };

        var b = Y.clone(a);
        b.node.foo = 'bar';

        // We don't try to clone DOM nodes.
        Assert.areNotSame(b.node.foo, a.node.foo);
        Assert.isObject(b.node._node.style, 'Could not access cloned node.');
    },

    test_each: function () {
        var count = 0;

        Y.each(null, function(v, k) {
            // should not throw
        });

        Y.each('string', function(v, k) {
            // should not throw
        });

        Y.each(12345, function(v, k) {
            // should not throw
        });

        Y.each({ foo: 1 }, function(v, k) {
            count++;
        });

        Assert.areEqual(1, count);
    },

    test_extend: function () {
        var firedbase = false;
        var firedextended = false;

        var Base = function() {
            arguments.callee.superclass.constructor.apply(this, arguments);

            // bind by string in order to allow the subclass
            this.on('testStringFn', Y.bind('base', this));
        };

        Y.extend(Base, Y.EventTarget, {
            base: function() {
                firedbase = true;
            }
        });

        var Extended = function() {
            arguments.callee.superclass.constructor.apply(this, arguments);
        };

        Y.extend(Extended, Base, {
            base: function() {
                firedextended = true;
            }
        });

        var b = new Extended();
        b.fire('testStringFn', 1, 2);

        Y.Assert.isFalse(firedbase);
        Y.Assert.isTrue(firedextended);
    },

    test_merge: function () {
        Object.prototype.foo = 'hello!';

        var o1 = { one: "one" },
            o2 = { two: "two" },
            o3 = { two: "twofromthree", three: "three" },
            o4 = { one: "one", two: "twofromthree", three: "three" },
            o123 = Y.merge(o1, o2, o3);

        Y.ObjectAssert.areEqual(o123, o4);
        Assert.areEqual(o123.two, o4.two);

        Y.Assert.isFalse((o123.hasOwnProperty('foo')), 'prototype properties added to Object should not be iterable');
        delete Object.prototype.foo;
    }
}));

suite.add(new Y.Test.Case({
    name: 'augment()',

    _should: {
        ignore: {
            'augmenting a Y.Node instance should not overwrite existing properties by default': Y.UA.nodejs
        }
    },

    setUp: function () {
        this.receiver = function () {};
        this.supplier = function () {};
    },

    tearDown: function () {
        delete this.receiver;
        delete this.supplier;
    },

    "receiver object should be augmented with supplier's prototype properties": function () {
        var receiver = {},
            supplier = this.supplier;

        supplier.prototype.foo = 'foo';
        supplier.prototype.bar = function () { return 'bar'; };

        Assert.areSame(receiver, Y.augment(receiver, supplier));
        Assert.areSame(2, Y.Object.size(receiver));
        ArrayAssert.itemsAreSame(['foo', 'bar'], Y.Object.keys(receiver));
        ArrayAssert.itemsAreSame(['foo', supplier.prototype.bar], Y.Object.values(receiver));
    },

    "receiver object properties should not be overwritten when `overwrite` is not `true`": function () {
        var receiver = {foo: 'moo'},
            supplier = this.supplier;

        supplier.prototype.foo = 'foo';
        supplier.prototype.bar = 'bar';

        Y.augment(receiver, supplier);

        Assert.areSame('moo', receiver.foo);
        Assert.areSame('bar', receiver.bar);
    },

    "receiver object properties should be overwritten when `overwrite` is `true`": function () {
        var receiver = {foo: 'moo'},
            supplier = this.supplier;

        supplier.prototype.foo = 'foo';
        supplier.prototype.bar = 'bar';

        Y.augment(receiver, supplier, true);

        Assert.areSame('foo', receiver.foo);
        Assert.areSame('bar', receiver.bar);
    },

    "only whitelisted properties should be copied to a receiver object": function () {
        var receiver = {},
            supplier = this.supplier;

        supplier.prototype.foo = 'a';
        supplier.prototype.bar = 'b';
        supplier.prototype.baz = 'c';

        Y.augment(receiver, supplier, false, ['foo', 'baz']);

        ArrayAssert.itemsAreSame(['foo', 'baz'], Y.Object.keys(receiver));
    },

    "supplier constructor should be called immediately when augmenting a receiver object": function () {
        var calls    = 0,
            receiver = {};

        function supplier() { calls += 1; }

        Y.augment(receiver, supplier);
        Assert.areSame(1, calls);
    },

    "supplier constructor should receive supplied args when augmenting a receiver object": function () {
        var calls    = 0,
            receiver = {};

        function supplier(foo) {
            calls += 1;
            Assert.areSame('foo', foo);
        }

        function supplierTwo(foo, bar) {
            calls += 1;
            Assert.areSame('foo', foo);
            Assert.areSame('bar', bar);
        }

        Y.augment(receiver, supplier, false, null, 'foo');

        receiver = {};
        Y.augment(receiver, supplierTwo, false, null, ['foo', 'bar']);

        Assert.areSame(2, calls);
    },

    "receiver function prototype should be augmented with supplier's prototype properties": function () {
        var receiverCalls = 0,
            supplierCalls = 0,
            instance;

        function receiver() { receiverCalls += 1; }
        function supplier() { supplierCalls += 1; }

        supplier.prototype.foo = 'foo';
        supplier.prototype.bar = function () { return 'bar'; };
        supplier.prototype.baz = function () { return 'baz'; };

        Assert.areSame(receiver, Y.augment(receiver, supplier));
        ArrayAssert.itemsAreSame(['foo', 'bar', 'baz'], Y.Object.keys(receiver.prototype));
        Assert.areSame('foo', receiver.prototype.foo);
        Assert.areNotSame(supplier.prototype.bar, receiver.prototype.bar, '`bar()` should be sequestered on `receiver.prototype`');
        Assert.areNotSame(supplier.prototype.baz, receiver.prototype.baz, '`baz()` should be sequestered on `receiver.prototype`');
        Assert.isFunction(receiver.prototype.bar);
        Assert.isFunction(receiver.prototype.baz);

        instance = new receiver();
        Assert.areSame(1, receiverCalls, "receiver's constructor should be called once");
        Assert.areSame(0, supplierCalls, "supplier's constructor should not be called yet");

        Assert.areNotSame(supplier.prototype.bar, instance.bar, '`bar()` should be sequestered on a new instance of `receiver`');
        Assert.areNotSame(supplier.prototype.baz, instance.baz, '`baz()` should be sequestered on a new instance of `receiver`');
        Assert.isFunction(instance.bar);
        Assert.isFunction(instance.baz);
        Assert.areSame('bar', instance.bar(), 'calling `bar()` on a new instance of `receiver` should work');
        Assert.areSame(1, supplierCalls, "supplier's constructor should be called on first use of a sequestered function");
        Assert.areSame(supplier.prototype.bar, instance.bar, 'after the first call, `instance.bar` and `supplier.prototype.bar` should be the same');
        Assert.areSame(supplier.prototype.baz, instance.baz, 'after the first call, `instance.baz` and `supplier.prototype.baz` should be the same');
        Assert.areSame('baz', instance.baz());
        Assert.areSame(1, supplierCalls, "supplier's constructor should not be called twice");
    },

    "receiver function prototype properties should not be overwritten when `overwrite` is not `true`": function () {
        var receiver = this.receiver,
            supplier = this.supplier;

        function quux() {}

        receiver.prototype.foo  = 'moo';
        receiver.prototype.quux = quux;

        supplier.prototype.foo  = 'foo';
        supplier.prototype.bar  = 'bar';
        supplier.prototype.quux = function () {};

        Y.augment(receiver, supplier);

        Assert.areSame('moo', receiver.prototype.foo);
        Assert.areSame('bar', receiver.prototype.bar);
        Assert.areSame(quux, receiver.prototype.quux);
    },

    "receiver function prototype properties should be overwritten when `overwrite` is `true`": function () {
        var receiver = this.receiver,
            supplier = this.supplier;

        function quux() {}

        receiver.prototype.foo  = 'moo';
        receiver.prototype.quux = quux;

        supplier.prototype.foo  = 'foo';
        supplier.prototype.bar  = 'bar';
        supplier.prototype.quux = function () {};

        Y.augment(receiver, supplier, true);

        Assert.areSame('foo', receiver.prototype.foo);
        Assert.areSame('bar', receiver.prototype.bar);
        Assert.areNotSame(quux, receiver.prototype.quux);
    },

    "only whitelisted properties should be copied to a receiver function": function () {
        var receiver = this.receiver,
            supplier = this.supplier;

        supplier.prototype.foo = 'a';
        supplier.prototype.bar = 'b';
        supplier.prototype.baz = 'c';

        Y.augment(receiver, supplier, false, ['foo', 'baz']);

        ArrayAssert.itemsAreSame(['foo', 'baz'], Y.Object.keys(receiver.prototype));
    },

    "supplier constructor should receive supplied args when augmenting a receiver function": function () {
        var calls    = 0,
            receiver = function () {};

        function supplier(foo) {
            calls += 1;
            Assert.areSame('foo', foo);
        }

        function supplierTwo(foo, bar) {
            calls += 1;
            Assert.areSame('foo', foo);
            Assert.areSame('bar', bar);
        }

        supplier.prototype.foo    = function () {};
        supplierTwo.prototype.foo = function () {};

        Y.augment(receiver, supplier, false, null, 'foo');
        new receiver().foo();

        receiver = function () {};
        Y.augment(receiver, supplierTwo, false, null, ['foo', 'bar']);
        new receiver().foo();

        Assert.areSame(2, calls);
    },

    // http://yuilibrary.com/projects/yui3/ticket/2530501
    'augmenting a Y.Node instance should not overwrite existing properties by default': function () {
        var node = Y.one('#test');

        Assert.isInstanceOf(Y.Node, node.get('parentNode'), 'parentNode attribute should be a Node instance before augment');
        Y.augment(node, Y.Attribute);
        Assert.isInstanceOf(Y.Node, node.get('parentNode'), 'parentNode attribute should be a Node instance after augment');
    }
}));

// TODO: mix tests should be moved to the tests for yui-core.js, where mix()
// lives now. Need to refactor yui-core tests first though.

suite.add(new Y.Test.Case({
    name: 'mix: default mode (object to object)',

    setUp: function () {
        Object.prototype.foo = "I'm on Object.prototype!";
        Object.prototype.zoo = "I'm on Object.prototype!";
    },

    tearDown: function () {
        delete Object.prototype.foo;
        delete Object.prototype.zoo;
    },

    'test [mode 0]: missing receiver or supplier': function () {
        var receiver = {a: 'a'},
            supplier = {z: 'z'};

        Assert.areSame(receiver, Y.mix(receiver), 'returns receiver when no supplier is passed');
        Assert.areSame(Y, Y.mix(null, supplier), 'returns Y when no receiver is passed');
        Assert.areSame(Y, Y.mix(), 'returns Y when neither receiver nor supplier is passed');
    },

    'test [mode 0]: returns receiver': function () {
        var receiver = {a: 'a'},
            supplier = {z: 'z'};

        Assert.areSame(receiver, Y.mix(receiver, supplier));
    },

    'test [mode 0]: no overwrite, no whitelist, no merge': function () {
        var receiver = {a: 'a'},
            supplier = {a: 'z', foo: 'foo', bar: 'bar', toString: function () {}};

        Y.mix(receiver, supplier);

        Assert.areSame(2, Y.Object.size(receiver), 'should own two keys');
        ObjectAssert.ownsKeys(['a', 'bar'], receiver, 'should own new keys');
        Assert.areSame('a', receiver.a, '"a" should not be overwritten');

        receiver = {};
        Y.mix(receiver, Y.Object(supplier));

        Assert.areSame(0, Y.Object.size(receiver), 'prototype properties should not get mixed');
    },

    'test [mode 0]: overwrite, no whitelist, no merge': function () {
        var receiver = {a: 'a', obj: {a: 'a', b: 'b'}},
            supplier = {a: 'z', foo: 'foo', bar: 'bar', obj: {a: 'z'}, toString: function () {}};

        Y.mix(receiver, supplier, true);

        Assert.areSame(5, Y.Object.size(receiver), 'should own five keys');
        ObjectAssert.ownsKeys(['a', 'foo', 'bar', 'obj', 'toString'], receiver, 'should own new keys');
        Assert.areSame('z', receiver.a, '"a" should be overwritten');
        Assert.areSame(receiver.obj, supplier.obj, 'objects should be overwritten, not merged');
        Assert.areSame(supplier.toString, receiver.toString, '"toString" should be the same');
    },

    'test [mode 0]: overwrite, whitelist, no merge': function () {
        var receiver = {a: 'a', bar: 'a', obj: {a: 'a', b: 'b'}},
            supplier = {a: 'z', foo: 'foo', bar: 'bar', obj: {a: 'z'}};

        Y.mix(receiver, supplier, true, ['a', 'obj']);

        Assert.areSame(3, Y.Object.size(receiver), 'should own three keys');
        ObjectAssert.ownsKeys(['a', 'bar', 'obj'], receiver, 'should own whitelisted keys');
        Assert.areSame('z', receiver.a, '"a" should be overwritten');
        Assert.areSame('a', receiver.bar, '"bar" should not be overwritten');
        Assert.areSame(receiver.obj, supplier.obj, 'objects should be overwritten, not merged');
    },

    'test [mode 0]: no overwrite, whitelist, no merge': function () {
        var receiver = {a: 'a', bar: 'a', obj: {a: 'a', b: 'b'}},
            supplier = {a: 'z', foo: 'foo', moo: 'cow', bar: 'bar', obj: {a: 'z'}};

        Y.mix(receiver, supplier, false, ['a', 'obj', 'foo']);

        Assert.areSame(3, Y.Object.size(receiver), 'should own three keys');
        ObjectAssert.ownsKeys(['a', 'bar', 'obj'], receiver, 'should own whitelisted keys');
        Assert.areSame('a', receiver.a, '"a" should not be overwritten');
        Assert.areNotSame(receiver.obj, supplier.obj, '"obj" should not be overwritten');
        Assert.areSame('a', receiver.obj.a, '"obj" should not be merged');
    },

    'test [mode 0]: no overwrite, no whitelist, merge': function () {
        var receiver = {a: 'a', fakeout: {a: 'a'}, obj: {a: 'a', b: 'b', deep: {foo: 'foo', deeper: {bar: 'bar'}}}},
            supplier = {a: 'z', foo: 'foo', bar: 'bar', fakeout: 'moo', obj: {a: 'z', deep: {deeper: {bar: 'z', baz: 'baz'}}}};

        Y.mix(receiver, supplier, false, null, 0, true);

        Assert.areSame(4, Y.Object.size(receiver), 'should own four keys');
        ObjectAssert.ownsKeys(['a', 'bar', 'fakeout', 'obj'], receiver, 'should own new keys');
        Assert.areSame('a', receiver.a, '"a" should not be overwritten');
        Assert.areSame(1, Y.Object.size(receiver.fakeout), 'non-objects should not be merged into objects');

        Assert.areNotSame(receiver.obj, supplier.obj, 'objects should be merged, not overwritten');
        Assert.areNotSame(receiver.obj.deep, supplier.obj.deep, 'deep objects should be merged, not overwritten');
        Assert.areNotSame(receiver.obj.deep.deeper, supplier.obj.deep.deeper, 'deeper objects should be merged, not overwritten');

        Assert.areSame('a', receiver.obj.a, 'merged properties should not be overwritten');
        Assert.areSame('b', receiver.obj.b, 'objects should be merged');
        Assert.areSame('foo', receiver.obj.deep.foo, 'deep objects should be merged');
        Assert.areSame('bar', receiver.obj.deep.deeper.bar, 'deeper merged properties should not be overwritten');
        Assert.areSame('baz', receiver.obj.deep.deeper.baz, 'deeper objects should be merged');

        // Array merge (see http://yuilibrary.com/projects/yui3/ticket/2528405)
        receiver = {a: [{x: 1}, {x: 2}]};
        supplier = {a: [{y: 99}, {y: 98}]};

        Y.mix(receiver, supplier, false, null, 0, true);

        Assert.areSame(1, receiver.a[0].x, 'objects in arrays should be merged');
        Assert.areSame(99, receiver.a[0].y, 'objects in arrays should be merged');
    },

    'test [mode 0]: overwrite, no whitelist, merge': function () {
        var receiver = {a: 'a', obj: {a: 'a', b: 'b', deep: {foo: 'foo', deeper: {bar: 'bar'}}}},
            supplier = {a: 'z', foo: 'foo', bar: 'bar', obj: {a: 'z', deep: {deeper: {bar: 'z'}}}};

        Y.mix(receiver, supplier, true, null, 0, true);

        Assert.areSame(4, Y.Object.size(receiver), 'should own four keys');
        ObjectAssert.ownsKeys(['a', 'foo', 'bar', 'obj'], receiver, 'should own new keys');
        Assert.areSame('z', receiver.a, '"a" should be overwritten');
        Assert.areSame('foo', receiver.foo, '"foo" should be received');

        Assert.areNotSame(receiver.obj, supplier.obj, 'objects should be merged, not overwritten');
        Assert.areNotSame(receiver.obj.deep, supplier.obj.deep, 'deep objects should be merged, not overwritten');
        Assert.areNotSame(receiver.obj.deep.deeper, supplier.obj.deep.deeper, 'deeper objects should be merged, not overwritten');

        Assert.areSame('z', receiver.obj.a, 'objects should be merged');
        Assert.areSame('b', receiver.obj.b, 'objects should be merged');
        Assert.areSame('foo', receiver.obj.deep.foo, 'deep objects should be merged');
        Assert.areSame('z', receiver.obj.deep.deeper.bar, 'deeper objects should be merged');

        // Array merge (see http://yuilibrary.com/projects/yui3/ticket/2528405)
        receiver = {a: [{x: 1}, {x: 2}]};
        supplier = {a: [{y: 99}, {y: 98}]};

        Y.mix(receiver, supplier, true, null, 0, true);

        Assert.areSame(1, receiver.a[0].x, 'objects in arrays should be merged');
        Assert.areSame(99, receiver.a[0].y, 'objects in arrays should be merged');
    },

    'test [mode 0]: overwrite, whitelist, merge': function () {
        var receiver = {a: 'a', obj: {a: 'a', b: 'b', deep: {foo: 'foo', deeper: {bar: 'bar'}}}},
            supplier = {a: 'z', foo: 'foo', bar: 'bar', obj: {a: 'z', deep: {deeper: {bar: 'z'}}}};

        Y.mix(receiver, supplier, true, ['a', 'foo', 'deeper'], 0, true);

        Assert.areSame(3, Y.Object.size(receiver), 'should own three keys');
        ObjectAssert.ownsKeys(['a', 'foo', 'obj'], receiver, 'should own new keys');
        Assert.areSame('z', receiver.a, '"a" should be overwritten');
        Assert.areSame('foo', receiver.foo, '"foo" should be received');

        Assert.areNotSame(receiver.obj, supplier.obj, 'objects should be merged, not overwritten');
        Assert.areNotSame(receiver.obj.deep, supplier.obj.deep, 'deep objects should be merged, not overwritten');
        Assert.areNotSame(receiver.obj.deep.deeper, supplier.obj.deep.deeper, 'deeper objects should be merged, not overwritten');

        Assert.areSame('a', receiver.obj.a, 'non-whitelisted deep properties should not be overwritten');
        Assert.areSame('b', receiver.obj.b, 'objects should be merged');
        Assert.areSame('foo', receiver.obj.deep.foo, 'deep objects should be merged');
        Assert.areSame('bar', receiver.obj.deep.deeper.bar, 'non-whitelisted deeper objects should be merged');
    },

    'test [mode 0]: overwrite, whitelist, toplevel merge': function() {
        var receiver = {bar: true, foo:{a:1, b:2}},
            supplier = {bar: false, foo:{c:3}};

        Y.aggregate(receiver, supplier, true, ['foo']);
        Y.mix(receiver, supplier, true, ['foo'], 0, true);

        ObjectAssert.hasKeys(['a', 'b', 'c'], receiver.foo, "merge property with an object value from whitelist is missing properties");
        ObjectAssert.areEqual({a:1, b:2, c:3}, receiver.foo, "merge property with an object value from whitelist doesn't have expected properties/values");
    }
}));

suite.add(new Y.Test.Case({
    name: 'mix: mode 1 (prototype to prototype)',

    setUp: function () {
        this.supplier = function () {};
        this.supplier.prototype = {a: 'z', foo: 'foo', bar: 'bar', obj: {a: 'z', deep: {deeper: {bar: 'z'}}}};
        this.supplier.owned = "I'm an owned property!";
    },

    tearDown: function () {
        delete this.supplier;
    },

    'test [mode 1]: no overwrite, no whitelist, no merge': function () {
        var receiver = function () {};
        receiver.a = 'a';

        Y.mix(receiver, this.supplier, false, null, 1);

        Assert.areSame(1, Y.Object.size(receiver), 'should own one key');
        Assert.areSame('a', receiver.a, '"a" should not be overwritten');
        ObjectAssert.ownsKeys(['a', 'foo', 'bar', 'obj'], receiver.prototype, 'prototype should own new keys');
        Assert.areSame('z', receiver.prototype.a, '"a" should exist on prototype');
    },

    'test [mode 1]: overwrite, no whitelist, no merge': function () {
        var receiver = function () {};

        receiver.a = 'a';
        receiver.prototype.a = 'a';
        receiver.prototype.obj = {a: 'a', foo: 'foo'};

        Y.mix(receiver, this.supplier, true, null, 1);

        Assert.areSame(1, Y.Object.size(receiver), 'should own one key');
        Assert.areSame('a', receiver.a, '"a" should not be overwritten on receiver');
        Assert.areSame('z', receiver.prototype.a, '"a" should be overwritten on receiver\'s prototype');
        Assert.areSame(this.supplier.prototype.obj, receiver.prototype.obj);
    },

    'test [mode 1]: overwrite, whitelist, no merge': function () {
        var receiver = function () {};

        receiver.prototype.a = 'a';

        Y.mix(receiver, this.supplier, true, ['a', 'foo'], 1);

        ObjectAssert.ownsNoKeys(receiver);
        Assert.areSame(2, Y.Object.size(receiver.prototype));
        Assert.areSame('z', receiver.prototype.a);
        Assert.areSame('foo', receiver.prototype.foo);
    },

    'test [mode 1]: no overwrite, whitelist, no merge': function () {
        var receiver = function () {};

        receiver.prototype.a = 'a';

        Y.mix(receiver, this.supplier, false, ['a', 'foo'], 1);

        ObjectAssert.ownsNoKeys(receiver);
        Assert.areSame(2, Y.Object.size(receiver.prototype));
        Assert.areSame('a', receiver.prototype.a);
        Assert.areSame('foo', receiver.prototype.foo);
    },

    'test [mode 1]: no overwrite, no whitelist, merge': function () {
        var receiver = function () {};

        receiver.prototype.obj = {a: 'a', foo: 'foo', deep: {deeper: {a: 'a'}}};

        Y.mix(receiver, this.supplier, false, null, 1, true);

        Assert.areNotSame(this.supplier.prototype.obj, receiver.prototype.obj);
        Assert.areSame('a', receiver.prototype.obj.a);
        Assert.areSame('foo', receiver.prototype.obj.foo);
        Assert.areSame('a', receiver.prototype.obj.deep.deeper.a);
        Assert.areSame('z', receiver.prototype.obj.deep.deeper.bar);
    },

    'test [mode 1]: overwrite, no whitelist, merge': function () {
        var receiver = function () {};

        receiver.prototype.obj = {a: 'a', foo: 'foo', deep: {deeper: {bar: 'a'}}};

        Y.mix(receiver, this.supplier, true, null, 1, true);

        Assert.areNotSame(this.supplier.prototype.obj, receiver.prototype.obj);
        Assert.areSame('z', receiver.prototype.obj.a);
        Assert.areSame('foo', receiver.prototype.obj.foo);
        Assert.areSame('z', receiver.prototype.obj.deep.deeper.bar);
    },

    'test [mode 1]: overwrite, whitelist, merge': function () {
        var receiver = function () {};

        receiver.prototype.obj = {a: 'a', foo: 'foo', deep: {deeper: {bar: 'a'}}};

        Y.mix(receiver, this.supplier, true, ['a', 'obj', 'deep'], 1, true);

        Assert.isUndefined(receiver.prototype.bar);
        Assert.areNotSame(this.supplier.prototype.obj, receiver.prototype.obj);
        Assert.areSame('z', receiver.prototype.obj.a);
        Assert.areSame('foo', receiver.prototype.obj.foo);
    }
}));

// The tests for other modes above cover the various mix options exhaustively.
// From here on, we're just doing sanity checks of the remaining modes.

suite.add(new Y.Test.Case({
    name: 'mix: mode 2 (object to object and prototype to prototype)',

    setUp: function () {
        this.supplier = function () {};
        this.supplier.prototype = {a: 'z', foo: 'foo', bar: 'bar', obj: {a: 'z', deep: {deeper: {bar: 'z'}}}};
        this.supplier.owned = "I'm an owned property!";
    },

    tearDown: function () {
        delete this.supplier;
    },

    'test [mode 2]: basic sanity check': function () {
        var receiver = function () {};

        Y.mix(receiver, this.supplier, false, null, 2);

        ObjectAssert.ownsKeys(['a', 'foo', 'bar', 'obj'], receiver.prototype);
        ObjectAssert.ownsKey('owned', receiver);
    }
}));

suite.add(new Y.Test.Case({
    name: 'mix: mode 3 (prototype to object)',

    setUp: function () {
        this.supplier = function () {};
        this.supplier.prototype = {a: 'z', foo: 'foo', bar: 'bar', obj: {a: 'z', deep: {deeper: {bar: 'z'}}}};
        this.supplier.owned = "I'm an owned property!";
    },

    tearDown: function () {
        delete this.supplier;
    },

    'test [mode 3]: basic sanity check': function () {
        var receiver = function () {};

        Y.mix(receiver, this.supplier, false, null, 3);

        ObjectAssert.ownsKeys(['a', 'foo', 'bar', 'obj'], receiver);
        ObjectAssert.ownsNoKeys(receiver.prototype);
        Assert.isUndefined(receiver.owned);
    }
}));

suite.add(new Y.Test.Case({
    name: 'mix: mode 4 (object to prototype)',

    setUp: function () {
        this.supplier = function () {};
        this.supplier.prototype = {a: 'z', foo: 'foo', bar: 'bar', obj: {a: 'z', deep: {deeper: {bar: 'z'}}}};
        this.supplier.owned = "I'm an owned property!";
    },

    tearDown: function () {
        delete this.supplier;
    },

    'test [mode 4]: basic sanity check': function () {
        var receiver = function () {};

        Y.mix(receiver, this.supplier, false, null, 4);

        ObjectAssert.ownsKey('owned', receiver.prototype);
        ObjectAssert.ownsNoKeys(receiver);
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {requires: ['attribute', 'test']});
