/**
 * ShouldError is subclass of Error that is thrown whenever
 * a test is expected to throw an error but doesn't.
 *
 * @param {String} message The message to display when the error occurs.
 * @namespace Test
 * @extends AssertionError
 * @module test
 * @class ShouldError
 * @constructor
 */
YUITest.ShouldError = function (message){

    //call superclass
    YUITest.AssertionError.call(this, message || "This test should have thrown an error but didn't.");

    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    this.name = "ShouldError";

};

//inherit from YUITest.AssertionError
YUITest.ShouldError.prototype = new YUITest.AssertionError();

//restore constructor
YUITest.ShouldError.prototype.constructor = YUITest.ShouldError;
