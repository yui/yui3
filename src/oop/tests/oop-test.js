YUI.add('oop-test', function (Y) {

var Assert       = Y.Assert,
    ObjectAssert = Y.ObjectAssert,

    suite  = new Y.Test.Suite('oop');

suite.add(new Y.Test.Case({
    name: 'Core',

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

        Assert.isFalse(b.node.foo === a.node.foo);
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

    'test: no overwrite, no whitelist, no merge': function () {
        var receiver = {a: 'a'},
            supplier = {a: 'z', foo: 'foo', bar: 'bar', toString: function () {}};

        Y.mix(receiver, supplier);

        Assert.areSame(4, Y.Object.size(receiver), 'should own four keys');
        ObjectAssert.ownsKeys(['a', 'foo', 'bar', 'toString'], receiver, 'should own new keys');
        Assert.areSame('a', receiver.a, '"a" should not be overwritten');
        Assert.areSame(supplier.toString, receiver.toString, '"toString" should be the same');

        receiver = {};
        Y.mix(receiver, Y.Object(supplier));

        Assert.areSame(0, Y.Object.size(receiver), 'prototype properties should not get mixed');
    },

    'test: overwrite, no whitelist, no merge': function () {
        var receiver = {a: 'a', obj: {a: 'a', b: 'b'}},
            supplier = {a: 'z', foo: 'foo', bar: 'bar', obj: {a: 'z'}};

        Y.mix(receiver, supplier, true);

        Assert.areSame(4, Y.Object.size(receiver), 'should own four keys');
        ObjectAssert.ownsKeys(['a', 'foo', 'bar', 'obj'], receiver, 'should own new keys');
        Assert.areSame('z', receiver.a, '"a" should be overwritten');
        Assert.areSame(receiver.obj, supplier.obj, 'objects should be overwritten, not merged');
    },

    'test: overwrite, whitelist, no merge': function () {
        var receiver = {a: 'a', bar: 'a', obj: {a: 'a', b: 'b'}},
            supplier = {a: 'z', foo: 'foo', bar: 'bar', obj: {a: 'z'}};

        Y.mix(receiver, supplier, true, ['a', 'obj']);

        Assert.areSame(3, Y.Object.size(receiver), 'should own three keys');
        ObjectAssert.ownsKeys(['a', 'bar', 'obj'], receiver, 'should own whitelisted keys');
        Assert.areSame('z', receiver.a, '"a" should be overwritten');
        Assert.areSame('a', receiver.bar, '"bar" should not be overwritten');
        Assert.areSame(receiver.obj, supplier.obj, 'objects should be overwritten, not merged');
    },

    'test: no overwrite, whitelist, no merge': function () {
        var receiver = {a: 'a', bar: 'a', obj: {a: 'a', b: 'b'}},
            supplier = {a: 'z', foo: 'foo', moo: 'cow', bar: 'bar', obj: {a: 'z'}};

        Y.mix(receiver, supplier, false, ['a', 'obj', 'foo']);

        Assert.areSame(4, Y.Object.size(receiver), 'should own four keys');
        ObjectAssert.ownsKeys(['a', 'foo', 'bar', 'obj'], receiver, 'should own whitelisted keys');
        Assert.areSame('a', receiver.a, '"a" should not be overwritten');
        Assert.areSame('foo', receiver.foo, '"foo" should be received');
        Assert.areNotSame(receiver.obj, supplier.obj, '"obj" should not be overwritten');
        Assert.areSame('a', receiver.obj.a, '"obj" should not be merged');
    },

    'test: no overwrite, no whitelist, merge': function () {
        var receiver = {a: 'a', obj: {a: 'a', b: 'b', deep: {foo: 'foo', deeper: {bar: 'bar'}}}},
            supplier = {a: 'z', foo: 'foo', bar: 'bar', obj: {a: 'z', deep: {deeper: {bar: 'z', baz: 'baz'}}}};

        Y.mix(receiver, supplier, false, null, 0, true);

        Assert.areSame(4, Y.Object.size(receiver), 'should own four keys');
        ObjectAssert.ownsKeys(['a', 'foo', 'bar', 'obj'], receiver, 'should own new keys');
        Assert.areSame('a', receiver.a, '"a" should not be overwritten');
        Assert.areSame('foo', receiver.foo, '"foo" should be received');

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

    'test: overwrite, no whitelist, merge': function () {
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

    'test: overwrite, whitelist, merge': function () {
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
    }

    // Test: mode 1: prototype to prototype, no overwrite, no whitelist, no merge
    // Test: mode 1: prototype to prototype, overwrite, no whitelist, no merge
    // Test: mode 1: prototype to prototype, overwrite, whitelist, no merge
    // Test: mode 1: prototype to prototype, no overwrite, whitelist, no merge
    // Test: mode 1: prototype to prototype, no overwrite, no whitelist, merge
    // Test: mode 1: prototype to prototype, overwrite, no whitelist, merge
    // Test: mode 1: prototype to prototype, overwrite, whitelist, merge
    // Test: mode 1: prototype to prototype, no overwrite, whitelist, merge

    // Test: mode 2: prototype to prototype & object to object, no overwrite, no whitelist, no merge
    // Test: mode 2: prototype to prototype & object to object, overwrite, no whitelist, no merge
    // Test: mode 2: prototype to prototype & object to object, overwrite, whitelist, no merge
    // Test: mode 2: prototype to prototype & object to object, no overwrite, whitelist, no merge
    // Test: mode 2: prototype to prototype & object to object, no overwrite, no whitelist, merge
    // Test: mode 2: prototype to prototype & object to object, overwrite, no whitelist, merge
    // Test: mode 2: prototype to prototype & object to object, overwrite, whitelist, merge
    // Test: mode 2: prototype to prototype & object to object, no overwrite, whitelist, merge

    // Test: mode 3: prototype to object, no overwrite, no whitelist, no merge
    // Test: mode 3: prototype to object, overwrite, no whitelist, no merge
    // Test: mode 3: prototype to object, overwrite, whitelist, no merge
    // Test: mode 3: prototype to object, no overwrite, whitelist, no merge
    // Test: mode 3: prototype to object, no overwrite, no whitelist, merge
    // Test: mode 3: prototype to object, overwrite, no whitelist, merge
    // Test: mode 3: prototype to object, overwrite, whitelist, merge
    // Test: mode 3: prototype to object, no overwrite, whitelist, merge

    // Test: mode 4: object to prototype, no overwrite, no whitelist, no merge
    // Test: mode 4: object to prototype, overwrite, no whitelist, no merge
    // Test: mode 4: object to prototype, overwrite, whitelist, no merge
    // Test: mode 4: object to prototype, no overwrite, whitelist, no merge
    // Test: mode 4: object to prototype, no overwrite, no whitelist, merge
    // Test: mode 4: object to prototype, overwrite, no whitelist, merge
    // Test: mode 4: object to prototype, overwrite, whitelist, merge
    // Test: mode 4: object to prototype, no overwrite, whitelist, merge
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {requires: ['test']});
