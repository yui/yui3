(function(){

    var M = function(Y){
    
        var assert = Y.Assert;
        
        /**
         * The ArrayAssert object provides functions to test JavaScript array objects
         * for a variety of cases.
         *
         * @namespace Y
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
            contains : function (needle /*:Object*/, haystack /*:Array*/, 
                                   message /*:String*/) /*:Void*/ {
                
                var found /*:Boolean*/ = false;
                
                //begin checking values
                for (var i=0; i < haystack.length && !found; i++){
                    if (haystack[i] === needle) {
                        found = true;
                    }
                }
                
                if (!found){
                    assert.fail(assert._formatMessage(message, "Value " + needle + " (" + (typeof needle) + ") not found in array [" + haystack + "]."));
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
            containsItems : function (needles /*:Object[]*/, haystack /*:Array*/, 
                                   message /*:String*/) /*:Void*/ {
        
                //begin checking values
                for (var i=0; i < needles.length; i++){
                    this.contains(needles[i], haystack, message);
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
            containsMatch : function (matcher /*:Function*/, haystack /*:Array*/, 
                                   message /*:String*/) /*:Void*/ {
                
                //check for valid matcher
                if (typeof matcher != "function"){
                    throw new TypeError("ArrayAssert.containsMatch(): First argument must be a function.");
                }
                
                var found /*:Boolean*/ = false;
                
                //begin checking values
                for (var i=0; i < haystack.length && !found; i++){
                    if (matcher(haystack[i])) {
                        found = true;
                    }
                }
                
                if (!found){
                    assert.fail(Assert._formatMessage(message, "No match found in array [" + haystack + "]."));
                }
            },
        
            /**
             * Asserts that a value is not present in an array. This uses the triple equals 
             * sign so no type cohersion may occur.
             * @param {Object} needle The value that is expected in the array.
             * @param {Array} haystack An array of values.
             * @param {String} message (Optional) The message to display if the assertion fails.
             * @method doesNotContain
             * @static
             */
            doesNotContain : function (needle /*:Object*/, haystack /*:Array*/, 
                                   message /*:String*/) /*:Void*/ {
                
                var found /*:Boolean*/ = false;
                
                //begin checking values
                for (var i=0; i < haystack.length && !found; i++){
                    if (haystack[i] === needle) {
                        found = true;
                    }
                }
                
                if (found){
                    assert.fail(Assert._formatMessage(message, "Value found in array [" + haystack + "]."));
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
            doesNotContainItems : function (needles /*:Object[]*/, haystack /*:Array*/, 
                                   message /*:String*/) /*:Void*/ {
        
                for (var i=0; i < needles.length; i++){
                    this.doesNotContain(needles[i], haystack, message);
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
            doesNotContainMatch : function (matcher /*:Function*/, haystack /*:Array*/, 
                                   message /*:String*/) /*:Void*/ {
                
                //check for valid matcher
                if (typeof matcher != "function"){
                    throw new TypeError("ArrayAssert.doesNotContainMatch(): First argument must be a function.");
                }
        
                var found /*:Boolean*/ = false;
                
                //begin checking values
                for (var i=0; i < haystack.length && !found; i++){
                    if (matcher(haystack[i])) {
                        found = true;
                    }
                }
                
                if (found){
                    assert.fail(Assert._formatMessage(message, "Value found in array [" + haystack + "]."));
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
            indexOf : function (needle /*:Object*/, haystack /*:Array*/, index /*:int*/, message /*:String*/) /*:Void*/ {
            
                //try to find the value in the array
                for (var i=0; i < haystack.length; i++){
                    if (haystack[i] === needle){
                        assert.areEqual(index, i, message || "Value exists at index " + i + " but should be at index " + index + ".");
                        return;
                    }
                }
                
                //if it makes it here, it wasn't found at all
                assert.fail(Assert._formatMessage(message, "Value doesn't exist in array [" + haystack + "]."));
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
            itemsAreEqual : function (expected /*:Array*/, actual /*:Array*/, 
                                   message /*:String*/) /*:Void*/ {
                
                //one may be longer than the other, so get the maximum length
                var len /*:int*/ = Math.max(expected.length, actual.length);
               
                //begin checking values
                for (var i=0; i < len; i++){
                    assert.areEqual(expected[i], actual[i], 
                        assert._formatMessage(message, "Values in position " + i + " are not equal."));
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
            itemsAreEquivalent : function (expected /*:Array*/, actual /*:Array*/, 
                                   comparator /*:Function*/, message /*:String*/) /*:Void*/ {
                
                //make sure the comparator is valid
                if (typeof comparator != "function"){
                    throw new TypeError("ArrayAssert.itemsAreEquivalent(): Third argument must be a function.");
                }
                
                //one may be longer than the other, so get the maximum length
                var len /*:int*/ = Math.max(expected.length, actual.length);
                
                //begin checking values
                for (var i=0; i < len; i++){
                    if (!comparator(expected[i], actual[i])){
                        throw new assert.ComparisonFailure(YAHOO.util.Assert._formatMessage(message, "Values in position " + i + " are not equivalent."), expected[i], actual[i]);
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
            isEmpty : function (actual /*:Array*/, message /*:String*/) /*:Void*/ {        
                if (actual.length > 0){
                    assert.fail(assert._formatMessage(message, "Array should be empty."));
                }
            },    
            
            /**
             * Asserts that an array is not empty.
             * @param {Array} actual The array to test.
             * @param {String} message (Optional) The message to display if the assertion fails.
             * @method isNotEmpty
             * @static
             */
            isNotEmpty : function (actual /*:Array*/, message /*:String*/) /*:Void*/ {        
                if (actual.length === 0){
                    assert.fail(assert._formatMessage(message, "Array should not be empty."));
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
            itemsAreSame : function (expected /*:Array*/, actual /*:Array*/, 
                                  message /*:String*/) /*:Void*/ {
                
                //one may be longer than the other, so get the maximum length
                var len /*:int*/ = Math.max(expected.length, actual.length);
                
                //begin checking values
                for (var i=0; i < len; i++){
                    assert.areSame(expected[i], actual[i], 
                        assert._formatMessage(message, "Values in position " + i + " are not the same."));
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
            lastIndexOf : function (needle /*:Object*/, haystack /*:Array*/, index /*:int*/, message /*:String*/) /*:Void*/ {
            
                //try to find the value in the array
                for (var i=haystack.length; i >= 0; i--){
                    if (haystack[i] === needle){
                        assert.areEqual(index, i, assert._formatMessage(message, "Value exists at index " + i + " but should be at index " + index + "."));
                        return;
                    }
                }
                
                //if it makes it here, it wasn't found at all
                assert.fail(assert._formatMessage(message, "Value doesn't exist in array."));        
            }
            
        };
    };
    
    YUI.add("arrayassert", M, "@VERSION@");
})();