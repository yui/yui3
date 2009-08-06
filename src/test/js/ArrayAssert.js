   
    /**
     * The ArrayAssert object provides functions to test JavaScript array objects
     * for a variety of cases.
     *
     * @class ArrayAssert
     * @static
     */
     
    Y.ArrayAssert = {
    
        /**
         * Asserts that a value is present in an array. This uses the triple equals 
         * sign so no type cohersion may occur.
         * @param {Object} needle The value that is expected in the array.
         * @param {Array} haystack An array of values.
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @method contains
         * @static
         */
        contains : function (needle, haystack, 
                               message) {
            
            Y.Assert._increment();               

            if (Y.Array.indexOf(haystack, needle) == -1){
                Y.Assert.fail(Y.Assert._formatMessage(message, "Value " + needle + " (" + (typeof needle) + ") not found in array [" + haystack + "]."));
            }
        },
    
        /**
         * Asserts that a set of values are present in an array. This uses the triple equals 
         * sign so no type cohersion may occur. For this assertion to pass, all values must
         * be found.
         * @param {Object[]} needles An array of values that are expected in the array.
         * @param {Array} haystack An array of values to check.
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @method containsItems
         * @static
         */
        containsItems : function (needles, haystack, 
                               message) {
            Y.Assert._increment();               
    
            //begin checking values
            for (var i=0; i < needles.length; i++){
                if (Y.Array.indexOf(haystack, needles[i]) == -1){
                    Y.Assert.fail(Y.Assert._formatMessage(message, "Value " + needles[i] + " (" + (typeof needles[i]) + ") not found in array [" + haystack + "]."));
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
            
            Y.Assert._increment();               
            //check for valid matcher
            if (typeof matcher != "function"){
                throw new TypeError("ArrayAssert.containsMatch(): First argument must be a function.");
            }
            
            if (!Y.Array.some(haystack, matcher)){
                Y.Assert.fail(Y.Assert._formatMessage(message, "No match found in array [" + haystack + "]."));
            }
        },
    
        /**
         * Asserts that a value is not present in an array. This uses the triple equals 
         * Asserts that a value is not present in an array. This uses the triple equals 
         * sign so no type cohersion may occur.
         * @param {Object} needle The value that is expected in the array.
         * @param {Array} haystack An array of values.
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @method doesNotContain
         * @static
         */
        doesNotContain : function (needle, haystack, 
                               message) {
            
            Y.Assert._increment();               

            if (Y.Array.indexOf(haystack, needle) > -1){
                Y.Assert.fail(Y.Assert._formatMessage(message, "Value found in array [" + haystack + "]."));
            }
        },
    
        /**
         * Asserts that a set of values are not present in an array. This uses the triple equals 
         * sign so no type cohersion may occur. For this assertion to pass, all values must
         * not be found.
         * @param {Object[]} needles An array of values that are not expected in the array.
         * @param {Array} haystack An array of values to check.
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @method doesNotContainItems
         * @static
         */
        doesNotContainItems : function (needles, haystack, 
                               message) {
    
            Y.Assert._increment();               
    
            for (var i=0; i < needles.length; i++){
                if (Y.Array.indexOf(haystack, needles[i]) > -1){
                    Y.Assert.fail(Y.Assert._formatMessage(message, "Value found in array [" + haystack + "]."));
                }
            }
    
        },
            
        /**
         * Asserts that no values matching a condition are present in an array. This uses
         * a function to determine a match.
         * @param {Function} matcher A function that returns true if the items matches or false if not.
         * @param {Array} haystack An array of values.
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @method doesNotContainMatch
         * @static
         */
        doesNotContainMatch : function (matcher, haystack, 
                               message) {
            
            Y.Assert._increment();     
          
            //check for valid matcher
            if (typeof matcher != "function"){
                throw new TypeError("ArrayAssert.doesNotContainMatch(): First argument must be a function.");
            }
            
            if (Y.Array.some(haystack, matcher)){
                Y.Assert.fail(Y.Assert._formatMessage(message, "Value found in array [" + haystack + "]."));
            }
        },
            
        /**
         * Asserts that the given value is contained in an array at the specified index.
         * This uses the triple equals sign so no type cohersion will occur.
         * @param {Object} needle The value to look for.
         * @param {Array} haystack The array to search in.
         * @param {int} index The index at which the value should exist.
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @method indexOf
         * @static
         */
        indexOf : function (needle, haystack, index, message) {
        
            Y.Assert._increment();     

            //try to find the value in the array
            for (var i=0; i < haystack.length; i++){
                if (haystack[i] === needle){
                    if (index != i){
                        Y.Assert.fail(Y.Assert._formatMessage(message, "Value exists at index " + i + " but should be at index " + index + "."));                    
                    }
                    return;
                }
            }
            
            //if it makes it here, it wasn't found at all
            Y.Assert.fail(Y.Assert._formatMessage(message, "Value doesn't exist in array [" + haystack + "]."));
        },
            
        /**
         * Asserts that the values in an array are equal, and in the same position,
         * as values in another array. This uses the double equals sign
         * so type cohersion may occur. Note that the array objects themselves
         * need not be the same for this test to pass.
         * @param {Array} expected An array of the expected values.
         * @param {Array} actual Any array of the actual values.
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @method itemsAreEqual
         * @static
         */
        itemsAreEqual : function (expected, actual, 
                               message) {
            
            Y.Assert._increment();     
            
            //first check array length
            if (expected.length != actual.length){
                Y.Assert.fail(Y.Assert._formatMessage(message, "Array should have a length of " + expected.length + " but has a length of " + actual.length));
            }
           
            //begin checking values
            for (var i=0; i < expected.length; i++){
                if (expected[i] != actual[i]){
                    throw new Y.Assert.ComparisonFailure(Y.Assert._formatMessage(message, "Values in position " + i + " are not equal."), expected[i], actual[i]);
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
         * @return {Void}
         * @method itemsAreEquivalent
         * @static
         */
        itemsAreEquivalent : function (expected, actual, 
                               comparator, message) {
            
            Y.Assert._increment();     

            //make sure the comparator is valid
            if (typeof comparator != "function"){
                throw new TypeError("ArrayAssert.itemsAreEquivalent(): Third argument must be a function.");
            }
            
            //first check array length
            if (expected.length != actual.length){
                Y.Assert.fail(Y.Assert._formatMessage(message, "Array should have a length of " + expected.length + " but has a length of " + actual.length));
            }
            
            //begin checking values
            for (var i=0; i < expected.length; i++){
                if (!comparator(expected[i], actual[i])){
                    throw new Y.Assert.ComparisonFailure(Y.Assert._formatMessage(message, "Values in position " + i + " are not equivalent."), expected[i], actual[i]);
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
            Y.Assert._increment();     
            if (actual.length > 0){
                Y.Assert.fail(Y.Assert._formatMessage(message, "Array should be empty."));
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
            Y.Assert._increment();     
            if (actual.length === 0){
                Y.Assert.fail(Y.Assert._formatMessage(message, "Array should not be empty."));
            }
        },    
        
        /**
         * Asserts that the values in an array are the same, and in the same position,
         * as values in another array. This uses the triple equals sign
         * so no type cohersion will occur. Note that the array objects themselves
         * need not be the same for this test to pass.
         * @param {Array} expected An array of the expected values.
         * @param {Array} actual Any array of the actual values.
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @method itemsAreSame
         * @static
         */
        itemsAreSame : function (expected, actual, 
                              message) {
            
            Y.Assert._increment();     

            //first check array length
            if (expected.length != actual.length){
                Y.Assert.fail(Y.Assert._formatMessage(message, "Array should have a length of " + expected.length + " but has a length of " + actual.length));
            }
                        
            //begin checking values
            for (var i=0; i < expected.length; i++){
                if (expected[i] !== actual[i]){
                    throw new Y.Assert.ComparisonFailure(Y.Assert._formatMessage(message, "Values in position " + i + " are not the same."), expected[i], actual[i]);
                }
            }
        },
        
        /**
         * Asserts that the given value is contained in an array at the specified index,
         * starting from the back of the array.
         * This uses the triple equals sign so no type cohersion will occur.
         * @param {Object} needle The value to look for.
         * @param {Array} haystack The array to search in.
         * @param {int} index The index at which the value should exist.
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @method lastIndexOf
         * @static
         */
        lastIndexOf : function (needle, haystack, index, message) {
        
            //try to find the value in the array
            for (var i=haystack.length; i >= 0; i--){
                if (haystack[i] === needle){
                    if (index != i){
                        Y.Assert.fail(Y.Assert._formatMessage(message, "Value exists at index " + i + " but should be at index " + index + "."));                    
                    }
                    return;
                }
            }
            
            //if it makes it here, it wasn't found at all
            Y.Assert.fail(Y.Assert._formatMessage(message, "Value doesn't exist in array."));        
        }
        
    };