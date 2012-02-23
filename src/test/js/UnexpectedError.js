/**
 * UnexpectedError is subclass of AssertionError that is thrown whenever
 * an error occurs within the course of a test and the test was not expected
 * to throw an error.
 *
 * @param {Error} cause The unexpected error that caused this error to be 
 *                      thrown.
 * @namespace Test 
 * @extends Test.AssertionError
 * @class UnexpectedError
 * @constructor
 */  
Test.UnexpectedError = function (cause){

    //call superclass
    Test.AssertionError.call(this, "Unexpected error: " + cause.message);
    
    /**
     * The unexpected error that occurred.
     * @type Error
     * @property cause
     */
    this.cause = cause;
    
    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    this.name = "UnexpectedError";
    
    /**
     * Stack information for the error (if provided).
     * @type String
     * @property stack
     */
    this.stack = cause.stack;
    
};

//inherit from Test.AssertionError
Test.UnexpectedError.prototype = new Test.AssertionError();

//restore constructor
Test.UnexpectedError.prototype.constructor = Test.UnexpectedError;
