YUI.add('arraysort-tests', function(Y) {
    var Assert      = Y.Assert,
        ArrayAssert = Y.ArrayAssert,

        suite = new Y.Test.Suite('ArraySort');

    suite.add(new Y.Test.Case({
        name: 'compare()',

        'should compare numbers': function () {
            var array = [2,1,3,5,4];
            array.sort(Y.ArraySort.compare)
            ArrayAssert.itemsAreSame([1,2,3,4,5], array, "Expected sorted numbers.");
        },

        'should compare strings': function () {
            var array = ["caa", "baa", "bba", "aba", "cba", "aaa", "abc"];
            array.sort(Y.ArraySort.compare)
            ArrayAssert.itemsAreSame(["aaa","aba","abc","baa","bba","caa","cba"], array, "Expected sorted strings.");
        },

        'should compare mixed alpha and numeric strings': function() {
            var array = ["attic", "Aardvark", "1", "0", "Zoo", "zebra"];
            array.sort(Y.ArraySort.compare)
            ArrayAssert.itemsAreSame(["0", "1", "Aardvark","attic","zebra","Zoo"], array, "Expected sorted mixed strings.");
        }
    }));

    Y.Test.Runner.add(suite);
});
