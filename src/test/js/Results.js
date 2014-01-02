/**
 * Convenience type for storing and aggregating
 * test result information.
 * @private
 * @namespace Test
 * @module test
 * @class Results
 * @constructor
 * @param {String} name The name of the test.
 */
YUITest.Results = function(name){

    /**
     * Name of the test, test case, or test suite.
     * @type String
     * @property name
     */
    this.name = name;

    /**
     * Number of passed tests.
     * @type int
     * @property passed
     */
    this.passed = 0;

    /**
     * Number of failed tests.
     * @type int
     * @property failed
     */
    this.failed = 0;

    /**
     * Number of errors that occur in non-test methods.
     * @type int
     * @property errors
     */
    this.errors = 0;

    /**
     * Number of ignored tests.
     * @type int
     * @property ignored
     */
    this.ignored = 0;

    /**
     * Number of total tests.
     * @type int
     * @property total
     */
    this.total = 0;

    /**
     * Amount of time (ms) it took to complete testing.
     * @type int
     * @property duration
     */
    this.duration = 0;
};

/**
 * Includes results from another results object into this one.
 * @param {Test.Results} result The results object to include.
 * @method include
 */
YUITest.Results.prototype.include = function(results){
    this.passed += results.passed;
    this.failed += results.failed;
    this.ignored += results.ignored;
    this.total += results.total;
    this.errors += results.errors;
};
