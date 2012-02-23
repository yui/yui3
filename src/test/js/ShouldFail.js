/**
 * ShouldFail is subclass of AssertionError that is thrown whenever
 * a test was expected to fail but did not.
 *
 * @param {String} message The message to display when the error occurs.
 * @namespace Test 
 * @extends Test.AssertionError
 * @class ShouldFail
 * @constructor
 */ 
Test.ShouldFail = function (message){

    //call superclass
    Test.AssertionError.call(this, message || "This test should fail but didn't.");
    
    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    this.name = "ShouldFail";
    
};

//inherit from Test.AssertionError
Test.ShouldFail.prototype = new Test.AssertionError();

//restore constructor
Test.ShouldFail.prototype.constructor = Test.ShouldFail;
