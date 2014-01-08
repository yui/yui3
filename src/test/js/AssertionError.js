/**
 * Error is thrown whenever an assertion fails. It provides methods
 * to more easily get at error information and also provides a base class
 * from which more specific assertion errors can be derived.
 *
 * @param {String} message The message to display when the error occurs.
 * @namespace Test
 * @module test
 * @class AssertionError
 * @constructor
 */
YUITest.AssertionError = function (message){

    /**
     * Error message. Must be duplicated to ensure browser receives it.
     * @type String
     * @property message
     */
    this.message = message;

    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    this.name = "Assert Error";
};

YUITest.AssertionError.prototype = {

    //restore constructor
    constructor: YUITest.AssertionError,

    /**
     * Returns a fully formatted error for an assertion failure. This should
     * be overridden by all subclasses to provide specific information.
     * @method getMessage
     * @return {String} A string describing the error.
     */
    getMessage : function () {
        return this.message;
    },

    /**
     * Returns a string representation of the error.
     * @method toString
     * @return {String} A string representation of the error.
     */
    toString : function () {
        return this.name + ": " + this.getMessage();
    }

};
