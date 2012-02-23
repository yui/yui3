/**
 * ComparisonFailure is subclass of Error that is thrown whenever
 * a comparison between two values fails. It provides mechanisms to retrieve
 * both the expected and actual value.
 *
 * @param {String} message The message to display when the error occurs.
 * @param {Object} expected The expected value.
 * @param {Object} actual The actual value that caused the assertion to fail.
 * @namespace Test 
 * @extends AssertionError
 * @class ComparisonFailure
 * @constructor
 */ 
Test.ComparisonFailure = function (message, expected, actual){

    //call superclass
    Test.AssertionError.call(this, message);
    
    /**
     * The expected value.
     * @type Object
     * @property expected
     */
    this.expected = expected;
    
    /**
     * The actual value.
     * @type Object
     * @property actual
     */
    this.actual = actual;
    
    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    this.name = "ComparisonFailure";
    
};

//inherit from Test.AssertionError
Test.ComparisonFailure.prototype = new Test.AssertionError;

//restore constructor
Test.ComparisonFailure.prototype.constructor = Test.ComparisonFailure;

/**
 * Returns a fully formatted error for an assertion failure. This message
 * provides information about the expected and actual values.
 * @method getMessage
 * @return {String} A string describing the error.
 */
Test.ComparisonFailure.prototype.getMessage = function(){
    return this.message + "\nExpected: " + this.expected + " (" + (typeof this.expected) + ")"  +
            "\nActual: " + this.actual + " (" + (typeof this.actual) + ")";
};
