YUI.add('arrayassert-tests', function(Y) {

    var Assert          = Y.Assert,
        ArrayAssert     = Y.ArrayAssert;

    //-------------------------------------------------------------------------
    // Base Test Suite
    //-------------------------------------------------------------------------

    var suite = new Y.Test.Suite("Array Assert Tests");

    //-------------------------------------------------------------------------
    // Test Case for contains()
    //-------------------------------------------------------------------------

    suite.add(new Y.Test.Case({

        name: "Contains Assert Tests",

        setUp: function(){
            this.testArray = ["1", 0, false, "text"];
        },

        tearDown: function(){
            delete this.testArray;
        },

        "contains() should pass when the given item exists": function () {
            ArrayAssert.contains("1", this.testArray);
        },

        "contains() should fail when a similar item exists": function () {
            ArrayAssert.contains(1, this.testArray);
        },

        "contains() should fail when the item doesn't exist": function() {
            ArrayAssert.contains(true, this.testArray);
        },

        "contains() should throw a custom error message during failure": function(){
            ArrayAssert.contains(true, this.testArray, "True should not be there: {message}");
        },
        "test: doesNotContain()": function() {
            ArrayAssert.doesNotContain(999, this.testArray);
        },
        "test: doesNotContainItems()": function() {
            ArrayAssert.doesNotContainItems([999, 998, 997], this.testArray);
        },
        "test: doesNotContainMatch()": function() {
            ArrayAssert.doesNotContainMatch(function() { return false; }, this.testArray);
        },
        "test: indexOf()": function() {
            ArrayAssert.indexOf("1", this.testArray, 0);
        },
        "test: indexOf() fail": function() {
            ArrayAssert.indexOf("1", this.testArray, 1);
        },
        "test: lastIndexOf()": function() {
            ArrayAssert.lastIndexOf("1", this.testArray, 0);
        },
        "test: lastIndexOf() fail": function() {
            ArrayAssert.lastIndexOf("1", this.testArray, 1);
        },
        "test: doesNotContain() fail": function() {
            ArrayAssert.doesNotContain('1', this.testArray);
        },
        "test: doesNotContainItems() fail": function() {
            ArrayAssert.doesNotContainItems(["1", 0], this.testArray);
        },
        "test: doesNotContainMatch() fail": function() {
            ArrayAssert.doesNotContainMatch(function() { return true; }, this.testArray);
        },
        "test: doesNotContainMatch() fail 2": function() {
            ArrayAssert.doesNotContainMatch(null, this.testArray);
        },
        "test: isEmpty()": function() {
            ArrayAssert.isEmpty([]);
        },
        "test: isNotEmpty()": function() {
            ArrayAssert.isNotEmpty(this.testArray);
        },
        "test: isEmpty() fail": function() {
            ArrayAssert.isEmpty(this.testArray);
        },
        "test: isNotEmpty() fail": function() {
            ArrayAssert.isNotEmpty([]);
        },
        _should: {
            fail: {
                "contains() should fail when a similar item exists": new Y.Assert.Error("Value 1 (number) not found in array [1,0,false,text]."),
                "contains() should throw a custom error message during failure": new Y.Assert.Error("True should not be there: Value 1 (number) not found in array [1,0,false,text]."),
                "contains() should fail when the item doesn't exist": new Y.Assert.Error("Value true (boolean) not found in array [1,0,false,text]."),
                "test: doesNotContain() fail": true,
                "test: doesNotContainItems() fail": true,
                "test: doesNotContainMatch() fail": true,
                "test: indexOf() fail": true,
                "test: lastIndexOf() fail": true,
                "test: isEmpty() fail": true,
                "test: isNotEmpty() fail": true
            },
            error: {
                "test: doesNotContainMatch() fail 2": true
            }
        }
    }));

    //-------------------------------------------------------------------------
    // Test Case for contains()
    //-------------------------------------------------------------------------

    suite.add(new Y.Test.Case({

        name: "ContainsItems Assert Tests",

        _should: {
            fail: {
                testSimilarItems: new Y.Assert.Error("Value 1 (number) not found in array [1,0,false,text]."),
                testNonExistingItems: new Y.Assert.Error("Value true (boolean) not found in array [1,0,false,text].")
            }
        },

        setUp: function(){
            this.testArray = ["1", 0, false, "text"];
        },

        tearDown: function(){
            delete this.testArray;
        },

        testExistingItems: function () {
            ArrayAssert.containsItems(["1",0], this.testArray);
        },

        testSimilarItems: function () {
            ArrayAssert.containsItems([1,0], this.testArray);
        },

        testNonExistingItems: function() {
            ArrayAssert.containsItems([true], this.testArray);
        }
    }));

    //-------------------------------------------------------------------------
    // Test Case for containsMatch()
    //-------------------------------------------------------------------------

    suite.add(new Y.Test.Case({

        name: "ContainsMatch Assert Tests",

        _should: {
            fail: {
                testNonExistingItems: new Y.Assert.Error("No match found in array [1,0,false,text].")
            }
        },

        setUp: function(){
            this.testArray = ["1", 0, false, "text"];
        },

        tearDown: function(){
            delete this.testArray;
        },

        testExistingItems: function () {
            ArrayAssert.containsMatch(function(value){
                return Y.Lang.isString(value);
            }, this.testArray);
        },

        testNonExistingItems: function() {
            ArrayAssert.containsMatch(function(value){
                return Y.Lang.isObject(value);
            }, this.testArray);
        }
    }));

    //-------------------------------------------------------------------------
    // Test Case for itemsAreSame()
    //-------------------------------------------------------------------------

    suite.add(new Y.Test.Case({

        name: "itemsAreSame Assert Tests",

        _should: {
            fail: {
                testMissingItem: new Y.Assert.Error("Values in position 3 are not the same."),
                testArrayAgainstObject: new Y.Assert.Error("Values in position 0 are not the same.")
            }
        },

        setUp: function(){
            this.testArray = ["1", 0, false, "text"];
        },

        tearDown: function(){
            delete this.testArray;
        },

        testItemsAreSame: function () {
            ArrayAssert.itemsAreSame(this.testArray,["1", 0, false, "text"]);
        },

        testMissingItem: function() {
            ArrayAssert.itemsAreSame(this.testArray, ["1", 0, false]);
        },

        testArrayAgainstObject: function(){
            ArrayAssert.itemsAreSame(this.testArray, {});
        }
    }));

    //-------------------------------------------------------------------------
    // Test Case for itemsAreEqual()
    //-------------------------------------------------------------------------

    suite.add(new Y.Test.Case({

        name: "itemsAreEqual Assert Tests",

        _should: {
            fail: {
                testMissingItem: new Y.Assert.Error("Values in position 3 are not equal."),
                testArrayAgainstObject: new Y.Assert.Error("Values in position 0 are not equal.")
            }
        },

        setUp: function(){
            this.testArray = ["1", 0, false, "text"];
        },

        tearDown: function(){
            delete this.testArray;
        },

        testItemsAreEqual: function () {
            ArrayAssert.itemsAreEqual(this.testArray,["1", 0, false, "text"]);
        },

        testMissingItem: function() {
            ArrayAssert.itemsAreEqual(this.testArray, ["1", 0, false]);
        },

        testArrayAgainstObject: function(){
            ArrayAssert.itemsAreEqual(this.testArray, {});
        },
        'test: Against a NodeList': function() {
            var els = document.getElementsByTagName('div'),
                els2 = document.getElementsByTagName('div');

            ArrayAssert.itemsAreEqual(els, els2);
        }
    }));

    //-------------------------------------------------------------------------
    // Test Case for itemsAreEquivalent()
    //-------------------------------------------------------------------------

    suite.add(new Y.Test.Case({

        name: "itemsAreEquivalent Assert Tests",

        _should: {
            fail: {
                testMissingItem: new Y.Assert.Error("Values in position 3 are not equal."),
                testArrayAgainstObject: new Y.Assert.Error("Values in position 0 are not equal.")
            }
        },

        setUp: function(){
            this.testArray = ["1", 0, false, "text"];
            this.comparator = function(a,b){
                return a == b;
            };
        },

        tearDown: function(){
            delete this.testArray;
            delete this.comparator;
        },

        testItemsAreEqual: function () {
            ArrayAssert.itemsAreEquivalent(this.testArray,["1", 0, false, "text"], this.comparator);
        },

        testMissingItem: function() {
            ArrayAssert.itemsAreEquivalent(this.testArray, ["1", 0, false], this.comparator);
        },

        testArrayAgainstObject: function(){
            ArrayAssert.itemsAreEquivalent(this.testArray, {}, this.comparator);
        }
    }));


    Y.Test.Runner.add(suite);

});
