YUI.add('arraysort-tests', function(Y) {
    var ArrayAssert = Y.ArrayAssert,

        suite = new Y.Test.Suite('ArraySort');

    suite.add(new Y.Test.Case({
        name: 'compare()',

        'should compare numbers': function () {
            var array = [2,1,3,5,4];
            array.sort(Y.ArraySort.compare);
            ArrayAssert.itemsAreSame([1,2,3,4,5], array, "Expected sorted numbers.");
        },

        'should compare strings': function () {
            var array = ["caa", "baa", "bba", "aba", "cba", "aaa", "abc"];
            array.sort(Y.ArraySort.compare);
            ArrayAssert.itemsAreSame(["aaa","aba","abc","baa","bba","caa","cba"], array, "Expected sorted strings.");
        },

        'should compare mixed alpha and numeric strings': function() {
            var array = ["attic", "Aardvark", "1", "0", "Zoo", "zebra"];
            array.sort(Y.ArraySort.compare);
            ArrayAssert.itemsAreSame(["0", "1", "Aardvark","attic","zebra","Zoo"], array, "Expected sorted mixed strings.");
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'naturalCompare()',

        'should sort strings in natural order': function () {
            var items = [
                'foo', 'foo10', 'foo2', 'foo1', 'foo200', 'bar', '2', '1', '10',
                '1foo', '10foo', 'foo2', 'bar', '1'
            ];

            items.sort(Y.ArraySort.naturalCompare);

            ArrayAssert.itemsAreSame([
                '1', '1', '1foo', '2', '10', '10foo', 'bar', 'bar', 'foo',
                'foo1', 'foo2', 'foo2', 'foo10', 'foo200'
            ], items);
        },

        'should sort mixed strings and numbers': function () {
            var items = [100, '100', '1', 0, '5', 10, 'a', '9a'];

            items.sort(Y.ArraySort.naturalCompare);

            ArrayAssert.itemsAreSame([
                0, '1', '5', '9a', 10, 100, '100', 'a'
            ], items);
        },

        'should be case-insensitive by default': function () {
            var items = ['Foo', 'bar', 'Baz', 'quux'];

            items.sort(Y.ArraySort.naturalCompare);

            ArrayAssert.itemsAreSame(['bar', 'Baz', 'Foo', 'quux'], items);
        },

        'should be case-sensitive when `options.caseSensitive` is truthy': function () {
            var items = ['Foo', 'bar', 'Baz', 'quux'];

            items.sort(function (a, b) {
                return Y.ArraySort.naturalCompare(a, b, {caseSensitive: true});
            });

            ArrayAssert.itemsAreSame(['Baz', 'Foo', 'bar', 'quux'], items);
        },

        'should sort in descending order when `options.descending` is truthy': function () {
            var items = [
                'foo', 'foo10', 'foo2', 'foo1', 'foo200', 'bar', '2', '1', '10',
                '1foo', '10foo', 'foo2', 'bar', '1'
            ];

            items.sort(function (a, b) {
                return Y.ArraySort.naturalCompare(a, b, {descending: true});
            });

            ArrayAssert.itemsAreSame([
                'foo200', 'foo10', 'foo2', 'foo2', 'foo1', 'foo', 'bar', 'bar',
                '10foo', '10', '2', '1foo', '1', '1'
            ], items);
        }
    }));

    Y.Test.Runner.add(suite);
});
