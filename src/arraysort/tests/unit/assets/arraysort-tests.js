YUI.add('arraysort-tests', function(Y) {

    var ASSERT = Y.Assert,
        ARRAYASSERT = Y.ArrayAssert;

    var testBasic = new Y.Test.Case({
        name: "Basic Tests",
    
        testNumbers: function() {
            var array = [2,1,3,5,4];
            array.sort(Y.ArraySort.compare)
            ARRAYASSERT.itemsAreSame([1,2,3,4,5], array, "Expected sorted numbers.");
        },

        testStrings: function() {
            var array = ["caa", "baa", "bba", "aba", "cba", "aaa", "abc"];
            array.sort(Y.ArraySort.compare)
            ARRAYASSERT.itemsAreSame(["aaa","aba","abc","baa","bba","caa","cba"], array, "Expected sorted strings.");
        },
        
        testMixedStrings: function() {
            var array = ["attic", "Aardvark", "1", "0", "Zoo", "zebra"];
            array.sort(Y.ArraySort.compare)
            ARRAYASSERT.itemsAreSame(["0", "1", "Aardvark","attic","zebra","Zoo"], array, "Expected sorted mixed strings.");
        }
    });

    var suite = new Y.Test.Suite("ArraySort");
    suite.add(testBasic);

    Y.Test.Runner.add(suite);

});
