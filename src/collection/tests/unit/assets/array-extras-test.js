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



suite.add(new Y.Test.Case({

    name: "Test set methods - intersection, union and diff",

    testNumbers: function () {
        var a1 = [1,2,3,4,5],
            a2 = [3,4,5,6],
            answer = Y.Array.intersect(a1, a2);

        ArrayAssert.itemsAreSame([3,4,5], answer, "Intersection of arrays of numbers.");

    },

    testStrings: function () {
        var a1 = ["a", "b", "c", "d"],
            a2 = ["a", "e", "c"],
            answer = Y.Array.intersect(a1, a2);

        ArrayAssert.itemsAreSame(["a", "c"], answer, "Intersection of arrays of strings.");

    },            

    testMixed: function () {
        var a1 = [1, "a", {}, "b", 2, "c", "d"],
            a2 = [2, "d", {}],
            answer = Y.Array.intersect(a1, a2);

        ArrayAssert.itemsAreSame([2, "d"], answer, "Intersection of arrays of strings.");

    },

    testNoIntersection: function () {
        var a1 = ["a", 1, 2, 3, "b", "c", "d"],
            a2 = [4, 5, "e", "f"],
            answer = Y.Array.intersect(a1, a2);

        ArrayAssert.itemsAreSame([], answer, "Intersection of arrays of strings.");

    },

    testError: function () {
        var a1 = "bob",
            a2 = function() {};
            answer = Y.Array.intersect(a1, a2);

        Assert.areEqual(false, answer, "Return false if not arrays passed.");

    },

   testThreeArraysOfNumbers: function () {
        var a1 = [1,2,3,4,5],
            a2 = [3,4,5,6],
            a3 = [3, 5];
            answer = Y.Array.intersect(a1, a2, a3);

        ArrayAssert.itemsAreSame([3,5], answer, "Intersection of 3 arrays of numbers.");

    },

    testThreeArraysOfStrings: function () {
        var a1 = ["a", "b", "c"],
            a2 = ["d", "c"],
            a3 = ["b", "c", "d"],
            answer = Y.Array.intersect(a1, a2, a3); 
        ArrayAssert.itemsAreSame(["c"], answer, "Intersections of 3 arrays of strings");
    },

    testThreeArraysWithNoIntersection: function () {
        var a1 = ["a", "b", "c"],
            a2 = [1, 2],
            a3 = [5, "d"],
            answer = Y.Array.intersect(a1, a2, a3);
        ArrayAssert.itemsAreSame([], answer, "Intersections of 3 arrays of strings");
    },

    testIntersectionOfThreeEmptyArray: function () {
        var a1 = ["a", "b", "c"],
            a2 = [],
            a3 = ["b", "c", "d"],
            answer = Y.Array.intersect(a1, a2, a3);
        ArrayAssert.itemsAreSame([], answer, "Intersections of an empty arrays is empty");

    },

    testIntersectNumbersNear: function () {
        var a1 = [1, 7, 13],
            a2 = [2, 3, 13, 14],
            com = function (a,b) { return ((a-b) < 2 && (a-b) > -2)},
            answer = Y.Array.intersect(a1, a2, com);

        // manually uniqueness using a === b:
        answer = Y.Array.unique(answer);
        ArrayAssert.itemsAreSame([1, 2, 13, 14], answer, "Intersection of 2 arrays of numbers that are close.");

    },

    testIntersectDates: function () {
        var a1 = [new Date("01/04/2012"), new Date("25/08/2012")],
            a2 = [new Date("01/04/2012"), new Date("02/04/2012")],//"2012-04-02")],
            com = function (a,b) { 
                return (a.getMonth() == b.getMonth() && a.getYear() == b.getYear() && a.getDay() == b.getDay());
            },
            answer = Y.Array.intersect(a1, a2, com),
            ansStr,
            expected = new Date("01/04/2012");


        answer = Y.Array.unique(answer, com);
        ansStr = answer[0];

        ArrayAssert.itemsAreSame(expected.toString(), ansStr.toString(), "Intersection of 2 arrays of date objects.");
        Assert.areEqual(1, answer.length, "One value in the answer");

    },

    testIntersectObjectPropertyWithMoreThanTwoArrays: function () {
        var a1 = [{p: 2}, {p: 3}, {p: 5}],
            a2 = [{p: 3}, {p: 10}, {p: 14}],
            a3 = [{p: 10}, {p: 3}, {p: 5}, {p: 14}],
            com = function (a, b) { return a.p === b.p;},
            answer = Y.Array.intersect(a1, a2, a3, com);

        // manually unique-ify the response
        answer = Y.Array.unique(answer, com);
        ArrayAssert.itemsAreSame(3, answer[0].p, "Intersection of 3 arrays of objects with custom comparison");           
        Assert.areEqual(1, answer.length, "One value in the answer");


    },

    testIntersectObjectPropertyWithMoreThanTwoArraysOrderDoesntMatter: function () {
        var a3 = [{p: 2}, {p: 3}, {p: 5}],
            a1 = [{p: 3}, {p: 10}, {p: 14}],
            a2 = [{p: 10}, {p: 3}, {p: 5}, {p: 14}],
            com = function (a, b) { return a.p === b.p;},
            answer = Y.Array.intersect(a1, a2, a3, com);

        answer = Y.Array.unique(answer, com);
        ArrayAssert.itemsAreSame(3, answer[0].p, "Intersection of 3 arrays of objects with custom comparison - order of args doesnt matter");            
        Assert.areEqual(1, answer.length, "One value in the answer");

    },


    "union of 2 numerical arrays with no duplicates should return one array" : function () {
        var a1 = [1,2,3],
            a2 = [4,5,6],
            answer = Y.Array.union(a1, a2);

        ArrayAssert.itemsAreSame([1,2,3,4,5,6], answer, "Straightforward union of distinct numbers");

    },


    "union of 2 numerical arrays should remove duplicates" : function () {
        var a1 = [1,4,2,3],
            a2 = [2,4,5,6],
            answer = Y.Array.union(a1, a2);

        ArrayAssert.itemsAreSame([1,4,2,3,5,6], answer, "Straightforward union of distinct numbers with duplicates removed");
    },


    "union of 2 arrays should remove duplicates with strict equality": function () {

        var a1 = [1,2,3, undefined, false],
            a2 = ["1", "2", "3", null, true, 0],
            answer = Y.Array.union(a1, a2);

        ArrayAssert.itemsAreSame([1,2,3, undefined, false, "1", "2", "3", null, true, 0], answer, "Test strict equality in removing duplicates");

    },


    "simple union of 3 arrays should return one array": function () {
        var a1 = [1,2,3],
            a2 = [4,5,6],
            a3 = [7,8,9],
            answer = Y.Array.union(a1, a2, a3);

        ArrayAssert.itemsAreSame([1,2,3, 4,5,6,7,8,9], answer);
    },


    "simple union of 3 arrays should remove duplicates": function () {
        var a1 = [1,2,3],
            a2 = [2,5,6],
            a3 = [7,1,9],
            answer = Y.Array.union(a1, a2, a3);

        ArrayAssert.itemsAreSame([1,2,3,5,6,7,9], answer);
    },

    "simple union of objects should not remove duplicates": function () {
        var a1 = [{a:2}],
            a2 = [{a:2}],
            a3 = [{a:3}],
            answer = Y.Array.union(a1, a2, a3);

        Assert.areEqual(2, answer[0].a);
        Assert.areEqual(2, answer[1].a);
        Assert.areEqual(3, answer[2].a);
        Assert.areEqual(3, answer.length);
    },

    "union of objects with comparison function should remove duplicates": function () {
        var a1 = [{a:2}],
            a2 = [{a:2}],
            a3 = [{a:3}],
            f = function (x, y) { return (x.a === y.a);},
            answer = Y.Array.union(a1, a2, a3, f);

        Assert.areEqual(2, answer[0].a);
        Assert.areEqual(3, answer[1].a);
        Assert.areEqual(2, answer.length);
    },


    "diff of two different numerical arrays should not remove any" : function () {
        var a1 = [1,2,3],
            a2 = [4,5,6],
            answer = Y.Array.diff(a1, a2);

        ArrayAssert.itemsAreSame([1,2,3], answer);

    },


    "diff of two identical numerical arrays should return empty array" : function () {
        var a1 = [1,2,3],
            a2 = [1,2,3],
            answer = Y.Array.diff(a1, a2);

        ArrayAssert.itemsAreSame([], answer);

    },   

    "diff of arrays of objects should not remove any": function () {
        var a1 = [{a:1}],
            a2 = [{a:1}],
            answer = Y.Array.diff(a1, a2);

       Assert.areEqual(1, answer[0].a, answer);
       Assert.areEqual(1, answer.length, answer);
    },

    "diff of arrays of objects with comparison function should remove some" : function () {
        var a1 = [{a:1}],
            a2 = [{a:1}],
            comp = function (x,y) { return (x.a === y.a);},
            answer = Y.Array.diff(a1, a2, comp);

       Assert.areEqual(0, answer.length);
    },

    "diff of mixed values with crazy comparison function should remove some" : function () {
        var a1 = [1, "abc", {a:5}, function () {return 2}, true, undefined],
            a2 = [{a:2}, "ab", 1],
            comp = function (x,y) {
                var c,d, L = Y.Lang;
                if (L.isFunction(x)) {
                    c = x();
                } else if (L.isObject(x)) {
                    c = x.a;
                } else {
                    c = x;
                }
                if (L.isFunction(y)) {
                    d = y();
                } else if (L.isObject(y)) {
                    d = y.a;
                } else {
                    d = y;
                }
                // note weak comparison
                ret = (c == d);

                return ret;

            },
            answer = Y.Array.diff(a1, a2, comp);
        // should be:
        // ["abc", {a:5}, undefined] 

        Assert.areEqual(3, answer.length, "3 items left");
        Assert.areEqual("abc", answer[0]);
        Assert.areEqual(5, answer[1].a);
        Assert.areEqual(undefined, answer[2]);
            

    }



}));

Y.Test.Runner.add(suite);

}, '3.5.0', {
    requires: ['array-extras', 'test']
});
