/**
 * UnexpectedValue is subclass of Error that is thrown whenever
 * a value was unexpected in its scope. This typically means that a test
 * was performed to determine that a value was *not* equal to a certain
 * value.
 *
 * @param {String} message The message to display when the error occurs.
 * @param {Object} unexpected The unexpected value.
 * @namespace Test 
 * @extends AssertionError
 * @class UnexpectedValue
 * @constructor
 */ 
Test.UnexpectedValue = function (message, unexpected){

    //call superclass
    Test.AssertionError.call(this, message);
    
    /**
     * The unexpected value.
     * @type Object
     * @property unexpected
     */
    this.unexpected = unexpected;
    
    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    this.name = "UnexpectedValue";
    
};

//inherit from Test.AssertionError
Test.UnexpectedValue.prototype = new Test.AssertionError();

//restore constructor
Test.UnexpectedValue.prototype.constructor = Test.UnexpectedValue;

/**
 * Returns a fully formatted error for an assertion failure. This message
 * provides information about the expected and actual values.
 * @method getMessage
 * @return {String} A string describing the error.
 */
Test.UnexpectedValue.prototype.getMessage = function(){
    return this.message + "\nUnexpected: " + this.unexpected + " (" + (typeof this.unexpected) + ") ";
};
