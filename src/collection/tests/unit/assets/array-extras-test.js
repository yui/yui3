YUI.add('array-extras-test', function (Y) {

var Assert       = Y.Assert,
    ArrayAssert  = Y.ArrayAssert,
    A            = Y.Array,
    ObjectAssert = Y.ObjectAssert,

    suite;

suite = new Y.Test.Suite('Collection');

suite.add(new Y.Test.Case({
    name: "General",

    setUp: function () {
        this.data = [1, 2, 3, 4, 5];
    },

    tearDown: function () {
        delete this.data;
    },

    testLastIndexOf: function () {
        var data = ['a', 'a', null, 'c', 'c', 'd'];

        Assert.areSame(1, A.lastIndexOf(data, 'a'));
        Assert.areSame(2, A.lastIndexOf(data, null));
        Assert.areSame(-1, A.lastIndexOf(data, false));
        Assert.areSame(4, A.lastIndexOf(data, 'c'));
        Assert.areSame(5, A.lastIndexOf(data, 'd'));
        Assert.areSame(-1, A.lastIndexOf(data, 'x'));
        Assert.areSame(-1, A.lastIndexOf([], 'x'));
    },

    testLastIndexOf_fromIndex: function () {
        var data = ['a', 'a', null, 'c', 'c', 'd'];

        Assert.areSame(1, A.lastIndexOf(data, 'a', 20));
        Assert.areSame(1, A.lastIndexOf(data, 'a', -3));
        Assert.areSame(-1, A.lastIndexOf(data, 'c', -4));
        Assert.areSame(3, A.lastIndexOf(data, 'c', -3));
        Assert.areSame(-1, A.lastIndexOf(data, 'a', -10));
        Assert.areSame(-1, A.lastIndexOf([], 'a', -10));
    },

    'lastIndexOf() should handle sparse arrays correctly': function () {
        var array = ['a'];

        array[1] = undefined;
        array[3] = 'd';

        Y.Assert.areSame(1, A.lastIndexOf(array, undefined));
    },

    testMap: function () {
        var data = this.data;
        var results = A.map(data, function (item, i, array) {
            Assert.isNumber(item);
            Assert.isNumber(i);
            Assert.areSame(data, array);
            return item * 2;
        });
        Assert.isArray(results);
        ArrayAssert.itemsAreEqual([2, 4, 6, 8, 10], results);
    },

    testMapContext: function() {
        var data = this.data;
        var results = A.map(data, function(item) {
            Assert.areEqual(5, this.x);
            Assert.areNotEqual(6, this.x);
        }, { x: 5 });
    },

    'map() should handle sparse arrays correctly': function () {
        var calls = 0,
            foo   = Array(5);

        foo.push('foo');

        Y.Array.map(foo, function () {
            calls += 1;
        });

        Assert.areSame(1, calls);
    },

    'map() should work on array-like objects': function () {
        var calls = 0;

        (function () {
            var results = Y.Array.map(arguments, function () {
                    calls += 1;
                    return 'z';
                });

            Y.ArrayAssert.itemsAreSame(['z', 'z', 'z'], results);
        }('a', 'b', 'c'));

        Assert.areSame(3, calls);
    },

    testReduce: function () {
        var obj = {};

        Assert.areSame(15, A.reduce(this.data, 0, function (sum, item, i, array) {
            Assert.isNumber(item);
            Assert.isNumber(i);
            Assert.isArray(array);
            if (Y.config.win) {
                Assert.areSame(Y.config.win, this);
            }
            return sum + item;
        }));

        A.reduce([1], 0, function () {
            Assert.areSame(obj, this);
        }, obj);
    },

    testReduceContext: function() {
        var data = this.data;
        var result = A.reduce(data, 0, function (sum, item) {
            Assert.areEqual("asdf", this.y);
        }, { y: "asdf" });
    },

    'reduce() should handle sparse arrays correctly': function () {
        var calls = 0,
            foo   = Array(5);

        foo.push('foo');

        Y.Array.reduce(foo, true, function () {
            calls += 1;
            return true;
        });

        Assert.areSame(1, calls);
    },

    'reduce() should work on array-like objects': function () {
        var calls = 0;

        (function () {
            Y.Array.reduce(arguments, true, function () {
                calls += 1;
                return true;
            });
        }('a', 'b', 'c'));

        Assert.areSame(3, calls);
    },

    testFind: function () {
        var data = this.data;
        var result = A.find(data, function (item) {
            return item % 2 == 0;
        });
        Assert.areEqual(2, result);
    },

    testFindNoMatch: function () {
        var data = this.data;
        var result = A.find(data, function (item) {
            return item % 7 == 0;
        });
        Assert.areEqual(null, result);
    },

    testFindFirst: function () {
        var data = this.data;
        var result = A.find(data, function(item) {
            return item % 2 == 1;
        });
        Assert.areEqual(1, result, 'First item not found!');
    },

    testFindLast: function () {
        var data = this.data;
        var result = A.find(data, function(item) {
            return item % 5 == 0;
        });
        Assert.areEqual(5, result, 'Last item not found!');
    },

    'find() should handle sparse arrays correctly': function () {
        var calls = 0,
            foo   = Array(5);

        foo.push('foo');

        Y.Array.find(foo, function () {
            calls += 1;
        });

        Assert.areSame(1, calls);
    },

    testFilter: function () {
        var data   = this.data,
            obj    = {},
            result = A.filter(data, function (item, i, array) {
                Assert.isNumber(item);
                Assert.isNumber(i);
                Assert.areSame(data, array);
                if (Y.config.win) {
                    Assert.areSame(this, Y.config.win);
                }

                return item % 2 == 0;
            });

        Assert.isArray(result);
        ArrayAssert.itemsAreEqual([2, 4], result);

        A.filter(data, function () {
            Assert.areSame(obj, this);
        }, obj);
    },

    testFilterNoMatch: function () {
        var data = this.data;
        var result = A.filter(data, function (item) {
            return item % 7 == 0;
        });
        Assert.isArray(result);
        ArrayAssert.isEmpty(result);
    },

    'filter() should handle sparse arrays correctly': function () {
        var calls = 0,
            foo   = Array(5);

        foo.push('foo');

        Y.Array.filter(foo, function () {
            calls += 1;
        });

        Assert.areSame(1, calls);
    },

    'filter() should work on array-like objects': function () {
        var calls = 0;

        (function () {
            var results = Y.Array.filter(arguments, function (value) {
                    calls += 1;
                    return value === 'a';
                });

            Y.ArrayAssert.itemsAreSame(['a'], results);
        }('a', 'b', 'c'));

        Assert.areSame(3, calls);
    },

    testReject: function () {
        var data = this.data;
        var result = A.reject(data, function (item) {
            return item % 2 == 0;
        });
        Assert.isArray(result);
        ArrayAssert.itemsAreEqual([1, 3, 5], result);
    },

    testRejectNoMatch: function () {
        var data = this.data;
        var result = A.reject(data, function (item) {
            return item % 7 == 0;
        });
        Assert.isArray(result);
        ArrayAssert.itemsAreEqual(data, result);
    },

    testGrepMatches: function () {
        var data = ['ruby', 'perl', 'python'];
        var results = A.grep(data, /p(erl|ython)/);
        Assert.isArray(results);
        ArrayAssert.itemsAreEqual(['perl', 'python'], results);
    },

    testGrepNoMatches: function () {
        var data = ['ruby', 'perl', 'python'];
        var results = A.grep(data, /j(ruby|ython)/);
        Assert.isArray(results);
        ArrayAssert.isEmpty(results);
    },

    testPartition: function () {
        var data = this.data;
        var results = A.partition(data, function (item) {
            return item % 2 == 0;
        });
        Assert.isArray(results.matches);
        ArrayAssert.itemsAreEqual([2, 4], results.matches);
        Assert.isArray(results.rejects);
        ArrayAssert.itemsAreEqual([1, 3, 5], results.rejects);
    },

    testZip: function () {
        var results = A.zip([1, 2, 3], ['a', 'b', 'c']);
        var expected = [[1, 'a'], [2, 'b'], [3, 'c']];
        Assert.isArray(results);
        A.each(expected, function (item, index) {
            Assert.isArray(item);
            ArrayAssert.itemsAreEqual(item, results[index]);
        });
    },

    testEvery: function() {
        var data = [5, 10, 20, 540];
        var result = A.every(data, function(item, i, a) {
            return item % 5 == 0;
        });

        Assert.isTrue(result);
    },

    testEveryNoMatches: function() {
        var data = [5, 10, 20, 541];
        var result = A.every(data, function(item, i, a) {
            return item % 5 == 0;
        });

        Assert.isFalse(result);
    },

    'every() should handle sparse arrays correctly': function () {
        var calls = 0,
            foo   = Array(5);

        foo.push('foo');

        Y.Array.every(foo, function () {
            calls += 1;
            return true;
        });

        Assert.areSame(1, calls);
    },

    'every() should work on array-like objects': function () {
        var calls = 0;

        (function () {
            var result = Y.Array.every(arguments, function (value) {
                    calls += 1;
                    return value === 'a';
                });

            Assert.isFalse(result);
        }('a', 'b', 'c'));

        Assert.areSame(2, calls);
    },

    'unique() should return a copy of an array with duplicate items removed': function() {
        var array = [],
            obj   = {};

        Assert.areNotSame(array, A.unique(array), 'returned array should be a copy');

        ArrayAssert.itemsAreSame(
            [2, 1, 3, 5, 4],
            A.unique([2, 1, 2, 3, 5, 4, 4])
        );

        ArrayAssert.itemsAreSame(
            ['foo', null, obj, undefined, false],
            A.unique(['foo', 'foo', null, null, obj, obj, undefined, false, false])
        );
    },

    'unique() should support a custom test function': function () {
        var obj    = {},
            values = [{value: 'a'}, {value: 'a'}, {value: 'b'}],
            results;

        results = A.unique(values, function (a, b, index, array) {
            Assert.isObject(a, '`a` should be an object');
            Assert.isObject(b, '`b` should be an object');
            Assert.isNumber(index, '`index` should be a number');
            Assert.areSame(values, array, '`array` should be the input array');
            Assert.areSame(values, this, '`this` should be the input array');

            return a.value === b.value;
        });

        Assert.areSame(2, results.length);
        Assert.areSame('a', results[0].value);
        Assert.areSame('b', results[1].value);
    },

    'flatten() should flatten nested arrays into a single-level array': function () {
        Assert.isArray(A.flatten());
        Assert.isArray(A.flatten(null));

        ArrayAssert.itemsAreSame(
            ['foo', 'bar', null],
            A.flatten(['foo', 'bar', null])
        );

        ArrayAssert.itemsAreSame(
            ['foo', 'bar', null],
            A.flatten(['foo', ['bar', null]])
        );

        ArrayAssert.itemsAreSame(
            ['foo', 'bar', null],
            A.flatten([[['foo', ['bar', null]]]])
        );

        ArrayAssert.itemsAreSame(
            ['foo', 'bar', null],
            A.flatten([[[[['foo']], [['bar'], [null]]]]])
        );
    }
}));

Y.Test.Runner.add(suite);

}, '3.5.0', {
    requires: ['array-extras', 'test']
});
