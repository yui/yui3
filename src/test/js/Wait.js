
/**
 * Represents a stoppage in test execution to wait for an amount of time before
 * continuing.
 * @param {Function} segment A function to run when the wait is over.
 * @param {Number} delay The number of milliseconds to wait before running the code.
 * @module test
 * @class Wait
 * @namespace Test
 * @constructor
 *
 */
YUITest.Wait = function (segment, delay) {

    /**
     * The segment of code to run when the wait is over.
     * @type Function
     * @property segment
     */
    this.segment = (typeof segment == "function" ? segment : null);

    /**
     * The delay before running the segment of code.
     * @type int
     * @property delay
     */
    this.delay = (typeof delay == "number" ? delay : 0);
};
