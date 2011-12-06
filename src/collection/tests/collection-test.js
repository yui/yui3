YUI.add('collection-test', function (Y) {

var Assert      = Y.Assert,
    ArrayAssert = Y.ArrayAssert,
    A           = Y.Array,

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

    testReduce: function () {
        var obj = {};

        Assert.areSame(15, A.reduce(this.data, 0, function (sum, item, i, array) {
            Assert.isNumber(item);
            Assert.isNumber(i);
            Assert.isArray(array);
            Assert.areSame(Y.config.win, this);
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
                Assert.areSame(this, Y.config.win);

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

    testUnique: function() {
        var obj = {};

        ArrayAssert.itemsAreSame([2, 1, 3, 5, 4], A.unique([2, 1, 2, 3, 5, 4, 4]));
        ArrayAssert.itemsAreSame(['foo', null, obj, false], A.unique(['foo', 'foo', null, null, obj, obj, undefined, false, false]));
    },

    testUniqueWithSort: function() {
        ArrayAssert.itemsAreSame([1, 2, 3, 4, 5], A.unique([2, 1, 2, 3, 5, 4, 4], true));
    }
}));

Y.Test.Runner.add(suite);

}, '3.5.0', {
    requires: ['collection', 'test']
});
