/**
 * ShouldFail is subclass of AssertionError that is thrown whenever
 * a test was expected to fail but did not.
 *
 * @param {String} message The message to display when the error occurs.
 * @namespace Test
 * @extends YUITest.AssertionError
 * @module test
 * @class ShouldFail
 * @constructor
 */
YUITest.ShouldFail = function (message){

    //call superclass
    YUITest.AssertionError.call(this, message || "This test should fail but didn't.");

    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    this.name = "ShouldFail";

};

//inherit from YUITest.AssertionError
YUITest.ShouldFail.prototype = new YUITest.AssertionError();

//restore constructor
YUITest.ShouldFail.prototype.constructor = YUITest.ShouldFail;
