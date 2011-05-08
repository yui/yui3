YUI.add('object-test', function (Y) {

var Assert = Y.Assert,
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
            d = Y.Object(b);

        Y.ObjectAssert.areEqual({a: 1}, c.o);
        Y.ObjectAssert.areEqual({a: 1}, c.y);
        Assert.isUndefined(c.x);

        Y.ObjectAssert.areEqual({b: 1}, d.o);
        Y.ObjectAssert.areEqual({b: 1}, d.x);
        Assert.isUndefined(d.y);
    },

    test_getValue: function () {
        Assert.areEqual('c', Y.Object.getValue(this.o, 'c1'));
        Assert.areEqual('a', Y.Object.getValue(this.o, ['a1', 'a2', 'a3']));
        Assert.areEqual(undefined, Y.Object.getValue(this.o, ['b1', 'b2', 'b3']));
        Assert.areEqual(undefined, Y.Object.getValue(null, ['b1', 'b2', 'b3']));
    },

    test_setValue: function () {
        Y.Object.setValue(this.o, 'c1', 'changed_c');
        Y.Object.setValue(this.o, ['a1', 'a2', 'a3'], 'changed_a');
        Y.Object.setValue(this.o, ['b1', 'b2', 'b3'], 'changed_b');

        Assert.areEqual('changed_c', Y.Object.getValue(this.o, 'c1'));
        Assert.areEqual('changed_a', Y.Object.getValue(this.o, ['a1', 'a2', 'a3']));
        Assert.areEqual(undefined, Y.Object.getValue(this.o, ['b1', 'b2', 'b3']));
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
