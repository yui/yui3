YUI.add('object-test', function (Y) {

var Assert = Y.Assert,
    doc    = Y.config.doc,

    suite  = new Y.Test.Suite('Y.Object');

suite.add(new Y.Test.Case({
    name: 'Core',

    setUp: function () {
        this.o = {
            a1: {
                a2: {
                    a3: 'a'
                }
            },
            b1: {
                b2: 'b'
            },
            c1: 'c'
        };
    },

    tearDown: function () {
        delete this.o;
    },

    test_create: function () {
        var a = {o: {a: 1}, y: {a: 1}},
            b = {o: {b: 1}, x: {b: 1}},
            c = Y.Object(a),
            d = Y.Object(b),
            cProto, dProto;

        Y.ObjectAssert.areEqual({a: 1}, c.o);
        Y.ObjectAssert.areEqual({a: 1}, c.y);
        Assert.isUndefined(c.x);

        Y.ObjectAssert.areEqual({b: 1}, d.o);
        Y.ObjectAssert.areEqual({b: 1}, d.x);
        Assert.isUndefined(d.y);

        // Verify the prototype in browsers that support it.
        if (Object.getPrototypeOf) {
            cProto = Object.getPrototypeOf(c);
            dProto = Object.getPrototypeOf(d);
        } else if (c.__proto__) {
            cProto = c.__proto__;
            dProto = d.__proto__;
        }

        if (cProto && dProto) {
            Assert.areSame(a, cProto, 'Prototype of object `a` should be `c`');
            Assert.areSame(b, dProto, 'Prototype of object `b` should be `d`');
        }
    },

    test_each: function () {
        var calls   = 0,
            data    = Y.Object(this.o),
            thisObj = {foo: 'bar'};

        data.a = 'foo';
        data.b = 'bar';
        data.c = null;
        data.d = undefined;

        Y.Object.each(data, function (value, key, obj) {
            calls += 1;

            Assert.areSame(data[key], value, 'the current value should be passed to the callback');
            Assert.areSame(data, obj, 'the object should be passed to the callback');
            Assert.areSame(Y, this, 'the `this` object should default to the YUI instance');
        });

        Assert.areSame(calls, 4, 'the callback should be called 4 times');

        Y.Object.each(data, function () {
            Assert.areSame(thisObj, this, 'the `this` object should be overridable');
        }, thisObj);

        calls = 0;

        Y.Object.each(data, function () {
            calls += 1;
        }, null, true);

        Assert.areSame(calls, 7, 'when the _proto_ argument is `true`, prototype properties should be iterated');
    },

    test_getValue: function () {
        Assert.areEqual('c', Y.Object.getValue(this.o, 'c1'));
        Assert.areEqual('a', Y.Object.getValue(this.o, ['a1', 'a2', 'a3']));
        Assert.areEqual(undefined, Y.Object.getValue(this.o, ['b1', 'b2', 'b3']));
        Assert.areEqual(undefined, Y.Object.getValue(null, ['b1', 'b2', 'b3']));
    },

    test_hasKey: function () {
        Assert.areSame(Y.Object.owns, Y.Object.hasKey, 'should be an alias for owns()');
    },

    test_hasValue: function () {
        Assert.isTrue(Y.Object.hasValue(this.o, 'c'), 'should return true if a value is present');
        Assert.isFalse(Y.Object.hasValue(this.o, 'z'), 'should return false if a value is not present');
    },

    test_isEmpty: function () {
        Assert.isTrue(Y.Object.isEmpty({}), 'should return true for empty objects');
        Assert.isFalse(Y.Object.isEmpty(this.o), 'should return false for non-empty objects');
        Assert.isTrue(Y.Object.isEmpty(Y.Object(this.o)), 'should return true for objects with no own properties');
    },

    test_keys: function () {
        Y.ArrayAssert.itemsAreSame(['a1', 'b1', 'c1'], Y.Object.keys(this.o), 'should return an array of keys');

        if (Object.keys) {
            Assert.areSame(Object.keys, Y.Object.keys, 'when native Object.keys is present, Y.Object.keys should be an alias');
        }

        // IE bugs.
        //   - http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
        //   - http://groups.google.com/group/prototype-core/browse_thread/thread/48400dbed4c1dd62?pli=1
        Y.ArrayAssert.itemsAreSame(['toString', 'valueOf'], Y.Object.keys({toString: 1, valueOf: 1}), 'should include toString, valueOf, etc.');
        Y.assert(Y.Object.keys(doc.body).length > 0, 'should return enumerable keys from DOM elements');
    },

    test_owns: function () {
        Assert.isTrue(Y.Object.owns(this.o, 'a1'), 'should return true if the key is owned by the object');
        Assert.isFalse(Y.Object.owns(this.o, 'z'), 'should return false if the key is not owned by the object');
        Assert.isFalse(Y.Object.owns(Y.Object(this.o), 'a1'), 'should return false for prototype properties');
    },

    test_setValue: function () {
        Y.Object.setValue(this.o, 'c1', 'changed_c');
        Y.Object.setValue(this.o, ['a1', 'a2', 'a3'], 'changed_a');
        Y.Object.setValue(this.o, ['b1', 'b2', 'b3'], 'changed_b');

        Assert.areEqual('changed_c', Y.Object.getValue(this.o, 'c1'));
        Assert.areEqual('changed_a', Y.Object.getValue(this.o, ['a1', 'a2', 'a3']));
        Assert.areEqual(undefined, Y.Object.getValue(this.o, ['b1', 'b2', 'b3']));
    },

    test_size: function () {
        Assert.areSame(3, Y.Object.size(this.o), 'should return the number of keys owned by an object');
    },

    test_some: function () {
        var calls   = 0,
            data    = Y.Object(this.o),
            thisObj = {foo: 'bar'};

        data.a = 'foo';
        data.b = 'bar';
        data.c = null;
        data.d = undefined;

        Assert.isTrue(Y.Object.some(data, function (value, key, obj) {
            calls += 1;

            Assert.areSame(data[key], value, 'the current value should be passed to the callback');
            Assert.areSame(data, obj, 'the object should be passed to the callback');
            Assert.areSame(Y, this, 'the `this` object should default to the YUI instance');

            if (calls === 3) { return 'truthy'; }
            if (calls > 3) { Y.fail('truthy value did not stop iteration'); }
        }), 'should return true');

        Assert.areSame(3, calls, 'callback should be called 3 times');

        Assert.isFalse(Y.Object.some(data, function () {
            Assert.areSame(thisObj, this, 'the `this` object should be overridable');
        }, thisObj), 'should return false');

        calls = 0;

        Y.Object.some(data, function () {
            calls += 1;
        });

        Assert.areSame(4, calls, 'prototype properties should not be iterated by default');

        calls = 0;

        Y.Object.some(data, function () {
            calls += 1;
        }, null, true);

        Assert.areSame(7, calls, 'prototype properties should be iterated when the _proto_ parameter is `true`');
    },

    test_values: function () {
        var data = {a: 'foo', b: 'bar', c: null, d: 'baz', e: undefined};
        Y.ArrayAssert.itemsAreSame(['foo', 'bar', null, 'baz', undefined], Y.Object.values(data), 'should return an array of values');
    },

    test_people_messing_up_object_prototype: function () {
        var count = 0;

        Object.prototype.foo = 'hello!';

        Assert.isFalse(Y.Object.hasKey({}, 'foo'), 'hasKey should not find proto props');
        Assert.areEqual(0, Y.Object.size({}), 'size should not count proto additions');
        Assert.areEqual(0, Y.Object.keys({}), 'keys should not include proto additions');
        Assert.areEqual(0, Y.Object.values({}), 'values should not count proto additions');
        Assert.isFalse(Y.Object.hasValue({}, 'hello!'), 'hasValue should not look at proto additions');

        Y.Object.each({}, function () {
            count++;
        });

        Assert.areEqual(0, count, 'each should not iterate proto props unless asked to do so.');
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {requires: ['test']});
