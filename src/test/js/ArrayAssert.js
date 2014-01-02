
/**
 * The ArrayAssert object provides functions to test JavaScript array objects
 * for a variety of cases.
 * @namespace Test
 * @module test
 * @class ArrayAssert
 * @static
 */

YUITest.ArrayAssert = {

    //=========================================================================
    // Private methods
    //=========================================================================

    /**
     * Simple indexOf() implementation for an array. Defers to native
     * if available.
     * @param {Array} haystack The array to search.
     * @param {Any} needle The value to locate.
     * @return {Number} The index of the needle if found or -1 if not.
     * @method _indexOf
     * @private
     */
    _indexOf: function(haystack, needle){
        if (haystack.indexOf){
            return haystack.indexOf(needle);
        } else {
            for (var i=0; i < haystack.length; i++){
                if (haystack[i] === needle){
                    return i;
                }
            }
            return -1;
        }
    },

    /**
     * Simple some() implementation for an array. Defers to native
     * if available.
     * @param {Array} haystack The array to search.
     * @param {Function} matcher The function to run on each value.
     * @return {Boolean} True if any value, when run through the matcher,
     *      returns true.
     * @method _some
     * @private
     */
    _some: function(haystack, matcher){
        if (haystack.some){
            return haystack.some(matcher);
        } else {
            for (var i=0; i < haystack.length; i++){
                if (matcher(haystack[i])){
                    return true;
                }
            }
            return false;
        }
    },

    /**
     * Asserts that a value is present in an array. This uses the triple equals
     * sign so no type coercion may occur.
     * @param {Object} needle The value that is expected in the array.
     * @param {Array} haystack An array of values.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method contains
     * @static
     */
    contains : function (needle, haystack,
                           message) {

        YUITest.Assert._increment();

        if (this._indexOf(haystack, needle) == -1){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value " + needle + " (" + (typeof needle) + ") not found in array [" + haystack + "]."));
        }
    },

    /**
     * Asserts that a set of values are present in an array. This uses the triple equals
     * sign so no type coercion may occur. For this assertion to pass, all values must
     * be found.
     * @param {Object[]} needles An array of values that are expected in the array.
     * @param {Array} haystack An array of values to check.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method containsItems
     * @static
     */
    containsItems : function (needles, haystack,
                           message) {
        YUITest.Assert._increment();

        //begin checking values
        for (var i=0; i < needles.length; i++){
            if (this._indexOf(haystack, needles[i]) == -1){
                YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value " + needles[i] + " (" + (typeof needles[i]) + ") not found in array [" + haystack + "]."));
            }
        }
    },

    /**
     * Asserts that a value matching some condition is present in an array. This uses
     * a function to determine a match.
     * @param {Function} matcher A function that returns true if the items matches or false if not.
     * @param {Array} haystack An array of values.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method containsMatch
     * @static
     */
    containsMatch : function (matcher, haystack,
                           message) {

        YUITest.Assert._increment();
        //check for valid matcher
        if (typeof matcher != "function"){
            throw new TypeError("ArrayAssert.containsMatch(): First argument must be a function.");
        }

        if (!this._some(haystack, matcher)){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "No match found in array [" + haystack + "]."));
        }
    },

    /**
     * Asserts that a value is not present in an array. This uses the triple equals
     * Asserts that a value is not present in an array. This uses the triple equals
     * sign so no type coercion may occur.
     * @param {Object} needle The value that is expected in the array.
     * @param {Array} haystack An array of values.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method doesNotContain
     * @static
     */
    doesNotContain : function (needle, haystack,
                           message) {

        YUITest.Assert._increment();

        if (this._indexOf(haystack, needle) > -1){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value found in array [" + haystack + "]."));
        }
    },

    /**
     * Asserts that a set of values are not present in an array. This uses the triple equals
     * sign so no type coercion may occur. For this assertion to pass, all values must
     * not be found.
     * @param {Object[]} needles An array of values that are not expected in the array.
     * @param {Array} haystack An array of values to check.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method doesNotContainItems
     * @static
     */
    doesNotContainItems : function (needles, haystack,
                           message) {

        YUITest.Assert._increment();

        for (var i=0; i < needles.length; i++){
            if (this._indexOf(haystack, needles[i]) > -1){
                YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value found in array [" + haystack + "]."));
            }
        }

    },

    /**
     * Asserts that no values matching a condition are present in an array. This uses
     * a function to determine a match.
     * @param {Function} matcher A function that returns true if the item matches or false if not.
     * @param {Array} haystack An array of values.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method doesNotContainMatch
     * @static
     */
    doesNotContainMatch : function (matcher, haystack,
                           message) {

        YUITest.Assert._increment();

        //check for valid matcher
        if (typeof matcher != "function"){
            throw new TypeError("ArrayAssert.doesNotContainMatch(): First argument must be a function.");
        }

        if (this._some(haystack, matcher)){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value found in array [" + haystack + "]."));
        }
    },

    /**
     * Asserts that the given value is contained in an array at the specified index.
     * This uses the triple equals sign so no type coercion will occur.
     * @param {Object} needle The value to look for.
     * @param {Array} haystack The array to search in.
     * @param {Number} index The index at which the value should exist.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method indexOf
     * @static
     */
    indexOf : function (needle, haystack, index, message) {

        YUITest.Assert._increment();

        //try to find the value in the array
        for (var i=0; i < haystack.length; i++){
            if (haystack[i] === needle){
                if (index != i){
                    YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value exists at index " + i + " but should be at index " + index + "."));
                }
                return;
            }
        }

        //if it makes it here, it wasn't found at all
        YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value doesn't exist in array [" + haystack + "]."));
    },

    /**
     * Asserts that the values in an array are equal, and in the same position,
     * as values in another array. This uses the double equals sign
     * so type coercion may occur. Note that the array objects themselves
     * need not be the same for this test to pass.
     * @param {Array} expected An array of the expected values.
     * @param {Array} actual Any array of the actual values.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method itemsAreEqual
     * @static
     */
    itemsAreEqual : function (expected, actual,
                           message) {

        YUITest.Assert._increment();

        //first make sure they're array-like (this can probably be improved)
        if (typeof expected != "object" || typeof actual != "object"){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value should be an array."));
        }

        //next check array length
        if (expected.length != actual.length){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Array should have a length of " + expected.length + " but has a length of " + actual.length + "."));
        }

        //begin checking values
        for (var i=0; i < expected.length; i++){
            if (expected[i] != actual[i]){
                throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Values in position " + i + " are not equal."), expected[i], actual[i]);
            }
        }
    },

    /**
     * Asserts that the values in an array are equivalent, and in the same position,
     * as values in another array. This uses a function to determine if the values
     * are equivalent. Note that the array objects themselves
     * need not be the same for this test to pass.
     * @param {Array} expected An array of the expected values.
     * @param {Array} actual Any array of the actual values.
     * @param {Function} comparator A function that returns true if the values are equivalent
     *      or false if not.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method itemsAreEquivalent
     * @static
     */
    itemsAreEquivalent : function (expected, actual,
                           comparator, message) {

        YUITest.Assert._increment();

        //make sure the comparator is valid
        if (typeof comparator != "function"){
            throw new TypeError("ArrayAssert.itemsAreEquivalent(): Third argument must be a function.");
        }

        //first check array length
        if (expected.length != actual.length){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Array should have a length of " + expected.length + " but has a length of " + actual.length));
        }

        //begin checking values
        for (var i=0; i < expected.length; i++){
            if (!comparator(expected[i], actual[i])){
                throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Values in position " + i + " are not equivalent."), expected[i], actual[i]);
            }
        }
    },

    /**
     * Asserts that an array is empty.
     * @param {Array} actual The array to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isEmpty
     * @static
     */
    isEmpty : function (actual, message) {
        YUITest.Assert._increment();
        if (actual.length > 0){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Array should be empty."));
        }
    },

    /**
     * Asserts that an array is not empty.
     * @param {Array} actual The array to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isNotEmpty
     * @static
     */
    isNotEmpty : function (actual, message) {
        YUITest.Assert._increment();
        if (actual.length === 0){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Array should not be empty."));
        }
    },

    /**
     * Asserts that the values in an array are the same, and in the same position,
     * as values in another array. This uses the triple equals sign
     * so no type coercion will occur. Note that the array objects themselves
     * need not be the same for this test to pass.
     * @param {Array} expected An array of the expected values.
     * @param {Array} actual Any array of the actual values.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method itemsAreSame
     * @static
     */
    itemsAreSame : function (expected, actual,
                          message) {

        YUITest.Assert._increment();

        //first check array length
        if (expected.length != actual.length){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Array should have a length of " + expected.length + " but has a length of " + actual.length));
        }

        //begin checking values
        for (var i=0; i < expected.length; i++){
            if (expected[i] !== actual[i]){
                throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Values in position " + i + " are not the same."), expected[i], actual[i]);
            }
        }
    },

    /**
     * Asserts that the given value is contained in an array at the specified index,
     * starting from the back of the array.
     * This uses the triple equals sign so no type coercion will occur.
     * @param {Object} needle The value to look for.
     * @param {Array} haystack The array to search in.
     * @param {Number} index The index at which the value should exist.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method lastIndexOf
     * @static
     */
    lastIndexOf : function (needle, haystack, index, message) {

        //try to find the value in the array
        for (var i=haystack.length; i >= 0; i--){
            if (haystack[i] === needle){
                if (index != i){
                    YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value exists at index " + i + " but should be at index " + index + "."));
                }
                return;
            }
        }

        //if it makes it here, it wasn't found at all
        YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value doesn't exist in array."));
    },

    /**
     * Asserts that given array doesn't contain duplicate items.
     * @param {Array} array The array to check.
     * @param {Function} [comparator=null] A custom function to use to test the equality of two values.
     *      This function is similar to the one given to {{#crossLink "Array/unique:method"}}Y.Array.unique{{/crossLink}}.
     * @param {String} [message] The message to display if the assertion fails.
     * @method isUnique
     * @static
     */
    isUnique: function (array, comparator, message) {

        YUITest.Assert._increment();

        if (!Y.Lang.isArray(array)){
            throw new TypeError("ArrayAssert.isUnique(): First argument must be an array");
        }

        if (Y.Lang.isValue(comparator) && !Y.Lang.isFunction(comparator)){
            throw new TypeError("ArrayAssert.isUnique(): Second argument must be a function");
        }

        if (Y.Array.unique(array, comparator).length < array.length){
            message = YUITest.Assert._formatMessage(message, "Array contains duplicate(s)");
            YUITest.Assert.fail(message);
        }
    }

};
