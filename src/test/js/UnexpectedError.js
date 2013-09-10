/**
 * UnexpectedError is subclass of AssertionError that is thrown whenever
 * an error occurs within the course of a test and the test was not expected
 * to throw an error.
 *
 * @param {Error} cause The unexpected error that caused this error to be
 *                      thrown.
 * @namespace Test
 * @extends YUITest.AssertionError
 * @module test
 * @class UnexpectedError
 * @constructor
 */
YUITest.UnexpectedError = function (cause){

    //call superclass
    YUITest.AssertionError.call(this, "Unexpected error: " + cause.message);

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

//inherit from YUITest.AssertionError
YUITest.UnexpectedError.prototype = new YUITest.AssertionError();

//restore constructor
YUITest.UnexpectedError.prototype.constructor = YUITest.UnexpectedError;
