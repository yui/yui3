/**
 * Test case containing various tests to run.
 * @param template An object containing any number of test methods, other methods,
 *                 an optional name, and anything else the test case needs.
 * @class TestCase
 * @namespace Test
 * @constructor
 */
Test.TestCase = function (template) {
    
    /**
     * Special rules for the test case. Possible subobjects
     * are fail, for tests that should fail, and error, for
     * tests that should throw an error.
     */
    this._should = {};
    
    //copy over all properties from the template to this object
    for (var prop in template) {
        this[prop] = template[prop];
    }    
    
    //check for a valid name
    if (typeof this.name != "string"){
        this.name = "testCase" + (+new Date());
    }

};
        
Test.TestCase.prototype = {  

    //restore constructor
    constructor: Test.TestCase,
    
    /**
     * Method to call from an async init method to
     * restart the test case. When called, returns a function
     * that should be called when tests are ready to continue.
     * @method callback
     * @return {Function} The function to call as a callback.
     */
    callback: function(){
        return Test.TestRunner.callback.apply(Test.TestRunner,arguments);
    },

    /**
     * Resumes a paused test and runs the given function.
     * @param {Function} segment (Optional) The function to run.
     *      If omitted, the test automatically passes.
     * @return {Void}
     * @method resume
     */
    resume : function (segment) {
        Test.TestRunner.resume(segment);
    },

    /**
     * Causes the test case to wait a specified amount of time and then
     * continue executing the given code.
     * @param {Function} segment (Optional) The function to run after the delay.
     *      If omitted, the TestRunner will wait until resume() is called.
     * @param {int} delay (Optional) The number of milliseconds to wait before running
     *      the function. If omitted, defaults to zero.
     * @return {Void}
     * @method wait
     */
    wait : function (segment, delay){
        
        var actualDelay = (typeof segment == "number" ? segment : delay);
        actualDelay = (typeof actualDelay == "number" ? actualDelay : 10000);
    
		if (typeof segment == "function"){
            throw new Test.Wait(segment, actualDelay);
        } else {
            throw new Test.Wait(function(){
                Test.Assert.fail("Timeout: wait() called but resume() never called.");
            }, actualDelay);
        }
    },
    
    //-------------------------------------------------------------------------
    // Assertion Methods
    //-------------------------------------------------------------------------

    /**
     * Asserts that a given condition is true. If not, then a Test.AssertionError object is thrown
     * and the test fails.
     * @method assert
     * @param {Boolean} condition The condition to test.
     * @param {String} message The message to display if the assertion fails.
     */
    assert : function (condition, message){
        Test.Assert._increment();
        if (!condition){
            throw new Test.AssertionError(Test.Assert._formatMessage(message, "Assertion failed."));
        }    
    },
    
    /**
     * Forces an assertion error to occur. Shortcut for Test.Assert.fail().
     * @method fail
     * @param {String} message (Optional) The message to display with the failure.
     */
    fail: function (message) {    
        Test.Assert.fail(message);
    },
    
    //-------------------------------------------------------------------------
    // Stub Methods
    //-------------------------------------------------------------------------

    /**
     * Function to run once before tests start to run.
     * This executes before the first call to setUp().
     */
    init: function(){
        //noop
    },
    
    /**
     * Function to run once after tests finish running.
     * This executes after the last call to tearDown().
     */
    destroy: function(){
        //noop
    },

    /**
     * Function to run before each test is executed.
     * @return {Void}
     * @method setUp
     */
    setUp : function () {
        //noop
    },
    
    /**
     * Function to run after each test is executed.
     * @return {Void}
     * @method tearDown
     */
    tearDown: function () {    
        //noop
    }
};
