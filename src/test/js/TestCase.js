/**
 * Test case containing various tests to run.
 * @param template An object containing any number of test methods, other methods,
 *                 an optional name, and anything else the test case needs.
 * @module test
 * @class TestCase
 * @namespace Test
 * @constructor
 */



YUITest.TestCase = function (template) {

    /*
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
    if (typeof this.name != "string") {
        this.name = YUITest.guid("testCase_");
    }

};

/**
Default delay for a test failure when `wait()` is called without a _delay_.

@property DEFAULT_WAIT
@type {Number}
@default 10000
@static
**/
YUITest.TestCase.DEFAULT_WAIT = 10000;

/**
Calls `YUITest.Assert.fail()` with a message indicating `wait()` was called,
but `resume()` was never called.

@method _waitTimeout
@static
@protected
**/
YUITest.TestCase._waitTimeout = function () {
     YUITest.Assert.fail("Timeout: wait() called but resume() never called.");
};

YUITest.TestCase.prototype = {

    //restore constructor
    constructor: YUITest.TestCase,

    /**
     * Method to call from an async init method to
     * restart the test case. When called, returns a function
     * that should be called when tests are ready to continue.
     * @method callback
     * @return {Function} The function to call as a callback.
     */
    callback: function(){
        return YUITest.TestRunner.callback.apply(YUITest.TestRunner,arguments);
    },

    /**
     * Resumes a paused test and runs the given function.
     * @param {Function} segment (Optional) The function to run.
     *      If omitted, the test automatically passes.
     * @method resume
     */
    resume : function (segment) {
        YUITest.TestRunner.resume(segment);
    },

    /**
     * Causes the test case to wait a specified amount of time and then
     * continue executing the given code.
     * @param {Function} segment (Optional) The function to run after the delay.
     *      If omitted, the TestRunner will wait until resume() is called.
     * @param {Number} delay (Optional) The number of milliseconds to wait before running
     *      the function. If omitted, defaults to `DEFAULT_WAIT` ms (10s).
     * @method wait
     */
    wait : function (segment, delay){
        delay = (typeof segment === 'number') ? segment :
                (typeof delay   === 'number') ? delay :
                YUITest.TestCase.DEFAULT_WAIT;

        if (typeof segment !== 'function') {
            segment = YUITest.TestCase._waitTimeout;
        }

        throw new YUITest.Wait(segment, delay);
    },

    /**
    Creates a callback that automatically resumes the test. Parameters as passed
    on to the callback.

    @method next
    @param {Function} callback Callback to call after resuming the test.
    @param {Object} [context] The value of `this` inside the callback.
        If not given, the original context of the function will be used.
    @return {Function} wrapped callback that resumes the test.
    @example
    ```
    // using test.resume()
    Y.jsonp(uri, function (response) {
        test.resume(function () {
            Y.Assert.isObject(response);
        });
    });
    test.wait();

    // using test.next()
    Y.jsonp(uri, test.next(function (response) {
        Y.Assert.isObject(response);
    }));
    test.wait();
    ```
    **/
    next: function (callback, context) {
        var self = this;
        context = arguments.length >= 2 ? arguments[1] : undefined;
        return function () {
            var args = arguments;
            if (context === undefined) {
                context = this;
            }
            self.resume(function () {
                callback.apply(context, args);
            });
        };
    },

    /**
    Delays the current test until _condition_ returns a truthy value. If
    _condition_ fails to return a truthy value before _timeout_ milliseconds
    have passed, the test fails. Default _timeout_ is 10s.

    _condition_ will be executed every _increment_ milliseconds (default 100).

    @method waitFor
    @param {Function} condition Function executed to indicate whether to
                        execute _segment_
    @param {Function} segment Function to check the success or failure of this
                        test
    @param {Number} [timeout=10000] Maximum number of milliseconds to wait for
                        _condition_ to return true
    @param {Number} [increment=100] Milliseconds to wait before checking
                        _condition_
    **/
    waitFor: function (condition, segment, timeout, increment) {
        var self = this,
            endTime;

        if ((typeof condition !== 'function') ||
            (typeof segment !== 'function')) {
            self.fail('waitFor() called with invalid parameters.');
        }

        if (typeof timeout !== 'number') {
            timeout = YUITest.TestCase.DEFAULT_WAIT;
        }

        endTime = (+new Date()) + timeout;

        if (typeof increment !== 'number') {
            increment = 100;
        }

        self.wait(function () {
            var now;

            if (condition.call(self)) {
                segment.call(self);
            } else {
                now = (+new Date());

                if (now > endTime) {
                    YUITest.TestCase._waitTimeout();
                } else {
                    self.waitFor(condition, segment, endTime - now, increment);
                }
            }
        }, increment);
    },

    //-------------------------------------------------------------------------
    // Assertion Methods
    //-------------------------------------------------------------------------

    /**
     * Asserts that a given condition is true. If not, then a YUITest.AssertionError object is thrown
     * and the test fails.
     * @method assert
     * @param {Boolean} condition The condition to test.
     * @param {String} message The message to display if the assertion fails.
     */
    assert : function (condition, message){
        YUITest.Assert._increment();
        if (!condition){
            throw new YUITest.AssertionError(YUITest.Assert._formatMessage(message, "Assertion failed."));
        }
    },

    /**
     * Forces an assertion error to occur. Shortcut for YUITest.Assert.fail().
     * @method fail
     * @param {String} message (Optional) The message to display with the failure.
     */
    fail: function (message) {
        YUITest.Assert.fail(message);
    },

    //-------------------------------------------------------------------------
    // Stub Methods
    //-------------------------------------------------------------------------

    /**
     * Function to run once before tests start to run.
     * This executes before the first call to setUp().
     * @method init
     */
    init: function(){
        //noop
    },

    /**
     * Function to run once after tests finish running.
     * This executes after the last call to tearDown().
     * @method destroy
     */
    destroy: function(){
        //noop
    },

    /**
     * Function to run before each test is executed.
     * @method setUp
     */
    setUp : function () {
        //noop
    },

    /**
     * Function to run after each test is executed.
     * @method tearDown
     */
    tearDown: function () {
        //noop
    }
};
