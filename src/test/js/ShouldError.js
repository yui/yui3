/**
 * ShouldError is subclass of Error that is thrown whenever
 * a test is expected to throw an error but doesn't.
 *
 * @param {String} message The message to display when the error occurs.
 * @namespace Test 
 * @extends AssertionError
 * @class ShouldError
 * @constructor
 */ 
Test.ShouldError = function (message){

    //call superclass
    Test.AssertionError.call(this, message || "This test should have thrown an error but didn't.");
    
    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    this.name = "ShouldError";
    
};

//inherit from Test.AssertionError
Test.ShouldError.prototype = new Test.AssertionError();

//restore constructor
Test.ShouldError.prototype.constructor = Test.ShouldError;
