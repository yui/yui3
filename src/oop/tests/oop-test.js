YUI.add('oop-test', function (Y) {

var Assert = Y.Assert,

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
            Y.log('Base constructor executed');
            arguments.callee.superclass.constructor.apply(this, arguments);

            // bind by string in order to allow the subclass
            this.on('testStringFn', Y.bind('base', this));
        };

        Y.extend(Base, Y.EventTarget, {
            base: function() {
                Y.log('base function');
                firedbase = true;
            }
        });

        var Extended = function() {
            Y.log('Extended constructor executed');
            arguments.callee.superclass.constructor.apply(this, arguments);
        };

        Y.extend(Extended, Base, {
            base: function() {
                Y.log('extended function');
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
    },

    test_mix: function () {
        var a = {
            'bool' : false,
            'num'  : 0,
            'nul' : null,
            'undef': undefined,
            'T'    : 'blabber'
        };

        var b = {
            'bool' : 'oops',
            'num'  : 'oops',
            'nul' : 'oops',
            'undef': 'oops',
            'T'    : 'oops'
        };

        Y.mix(a, b, false);

        Assert.isFalse((a.bool === 'oops'));
        Assert.isFalse((a.num === 'oops'));
        Assert.isFalse((a.nul === 'oops'));
        Assert.isFalse((a.undef === 'oops'));
        Assert.isFalse((a.T === 'oops'));

        Y.mix(a, b, true);
        Assert.isTrue((a.bool === 'oops'));
        Assert.isTrue((a.num === 'oops'));
        Assert.isTrue((a.nul === 'oops'));
        Assert.isTrue((a.undef === 'oops'));
        Assert.isTrue((a.T === 'oops'));
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {requires: ['test']});
