
/**
 * The Assert object provides functions to test JavaScript values against
 * known and expected results. Whenever a comparison (assertion) fails,
 * an error is thrown.
 * @namespace Test
 * @module test
 * @class Assert
 * @static
 */
YUITest.Assert = {

    /**
     * The number of assertions performed.
     * @property _asserts
     * @type int
     * @private
     */
    _asserts: 0,

    //-------------------------------------------------------------------------
    // Helper Methods
    //-------------------------------------------------------------------------

    /**
     * Formats a message so that it can contain the original assertion message
     * in addition to the custom message.
     * @param {String} customMessage The message passed in by the developer.
     * @param {String} defaultMessage The message created by the error by default.
     * @return {String} The final error message, containing either or both.
     * @protected
     * @static
     * @method _formatMessage
     */
    _formatMessage : function (customMessage, defaultMessage) {
        if (typeof customMessage == "string" && customMessage.length > 0){
            return customMessage.replace("{message}", defaultMessage);
        } else {
            return defaultMessage;
        }
    },

    /**
     * Returns the number of assertions that have been performed.
     * @method _getCount
     * @protected
     * @static
     */
    _getCount: function(){
        return this._asserts;
    },

    /**
     * Increments the number of assertions that have been performed.
     * @method _increment
     * @protected
     * @static
     */
    _increment: function(){
        this._asserts++;
    },

    /**
     * Resets the number of assertions that have been performed to 0.
     * @method _reset
     * @protected
     * @static
     */
    _reset: function(){
        this._asserts = 0;
    },

    //-------------------------------------------------------------------------
    // Generic Assertion Methods
    //-------------------------------------------------------------------------

    /**
     * Forces an assertion error to occur.
     * @param {String} message (Optional) The message to display with the failure.
     * @method fail
     * @static
     */
    fail : function (message) {
        throw new YUITest.AssertionError(YUITest.Assert._formatMessage(message, "Test force-failed."));
    },

    /**
     * A marker that the test should pass.
     * @method pass
     * @static
     */
    pass : function (message) {
        YUITest.Assert._increment();
    },

    //-------------------------------------------------------------------------
    // Equality Assertion Methods
    //-------------------------------------------------------------------------

    /**
     * Asserts that a value is equal to another. This uses the double equals sign
     * so type coercion may occur.
     * @param {Object} expected The expected value.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method areEqual
     * @static
     */
    areEqual : function (expected, actual, message) {
        YUITest.Assert._increment();
        if (expected != actual) {
            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Values should be equal."), expected, actual);
        }
    },

    /**
     * Asserts that a value is not equal to another. This uses the double equals sign
     * so type coercion may occur.
     * @param {Object} unexpected The unexpected value.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method areNotEqual
     * @static
     */
    areNotEqual : function (unexpected, actual,
                         message) {
        YUITest.Assert._increment();
        if (unexpected == actual) {
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Values should not be equal."), unexpected);
        }
    },

    /**
     * Asserts that a value is not the same as another. This uses the triple equals sign
     * so no type coercion may occur.
     * @param {Object} unexpected The unexpected value.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method areNotSame
     * @static
     */
    areNotSame : function (unexpected, actual, message) {
        YUITest.Assert._increment();
        if (unexpected === actual) {
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Values should not be the same."), unexpected);
        }
    },

    /**
     * Asserts that a value is the same as another. This uses the triple equals sign
     * so no type coercion may occur.
     * @param {Object} expected The expected value.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method areSame
     * @static
     */
    areSame : function (expected, actual, message) {
        YUITest.Assert._increment();
        if (expected !== actual) {
            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Values should be the same."), expected, actual);
        }
    },

    //-------------------------------------------------------------------------
    // Boolean Assertion Methods
    //-------------------------------------------------------------------------

    /**
     * Asserts that a value is false. This uses the triple equals sign
     * so no type coercion may occur.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isFalse
     * @static
     */
    isFalse : function (actual, message) {
        YUITest.Assert._increment();
        if (false !== actual) {
            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Value should be false."), false, actual);
        }
    },

    /**
     * Asserts that a value is true. This uses the triple equals sign
     * so no type coercion may occur.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isTrue
     * @static
     */
    isTrue : function (actual, message) {
        YUITest.Assert._increment();
        if (true !== actual) {
            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Value should be true."), true, actual);
        }

    },

    //-------------------------------------------------------------------------
    // Special Value Assertion Methods
    //-------------------------------------------------------------------------

    /**
     * Asserts that a value is not a number.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isNaN
     * @static
     */
    isNaN : function (actual, message){
        YUITest.Assert._increment();
        if (!isNaN(actual)){
            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Value should be NaN."), NaN, actual);
        }
    },

    /**
     * Asserts that a value is not the special NaN value.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isNotNaN
     * @static
     */
    isNotNaN : function (actual, message){
        YUITest.Assert._increment();
        if (isNaN(actual)){
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Values should not be NaN."), NaN);
        }
    },

    /**
     * Asserts that a value is not null. This uses the triple equals sign
     * so no type coercion may occur.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isNotNull
     * @static
     */
    isNotNull : function (actual, message) {
        YUITest.Assert._increment();
        if (actual === null) {
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Values should not be null."), null);
        }
    },

    /**
     * Asserts that a value is not undefined. This uses the triple equals sign
     * so no type coercion may occur.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isNotUndefined
     * @static
     */
    isNotUndefined : function (actual, message) {
        YUITest.Assert._increment();
        if (typeof actual == "undefined") {
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Value should not be undefined."), undefined);
        }
    },

    /**
     * Asserts that a value is null. This uses the triple equals sign
     * so no type coercion may occur.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isNull
     * @static
     */
    isNull : function (actual, message) {
        YUITest.Assert._increment();
        if (actual !== null) {
            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Value should be null."), null, actual);
        }
    },

    /**
     * Asserts that a value is undefined. This uses the triple equals sign
     * so no type coercion may occur.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isUndefined
     * @static
     */
    isUndefined : function (actual, message) {
        YUITest.Assert._increment();
        if (typeof actual != "undefined") {
            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Value should be undefined."), undefined, actual);
        }
    },

    //--------------------------------------------------------------------------
    // Instance Assertion Methods
    //--------------------------------------------------------------------------

    /**
     * Asserts that a value is an array.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isArray
     * @static
     */
    isArray : function (actual, message) {
        YUITest.Assert._increment();
        var shouldFail = false;
        if (Array.isArray){
            shouldFail = !Array.isArray(actual);
        } else {
            shouldFail = Object.prototype.toString.call(actual) != "[object Array]";
        }
        if (shouldFail){
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Value should be an array."), actual);
        }
    },

    /**
     * Asserts that a value is a Boolean.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isBoolean
     * @static
     */
    isBoolean : function (actual, message) {
        YUITest.Assert._increment();
        if (typeof actual != "boolean"){
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Value should be a Boolean."), actual);
        }
    },

    /**
     * Asserts that a value is a function.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isFunction
     * @static
     */
    isFunction : function (actual, message) {
        YUITest.Assert._increment();
        if (!(actual instanceof Function)){
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Value should be a function."), actual);
        }
    },

    /**
     * Asserts that a value is an instance of a particular object. This may return
     * incorrect results when comparing objects from one frame to constructors in
     * another frame. For best results, don't use in a cross-frame manner.
     * @param {Function} expected The function that the object should be an instance of.
     * @param {Object} actual The object to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isInstanceOf
     * @static
     */
    isInstanceOf : function (expected, actual, message) {
        YUITest.Assert._increment();
        if (!(actual instanceof expected)){
            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Value isn't an instance of expected type."), expected, actual);
        }
    },

    /**
     * Asserts that a value is a number.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isNumber
     * @static
     */
    isNumber : function (actual, message) {
        YUITest.Assert._increment();
        if (typeof actual != "number"){
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Value should be a number."), actual);
        }
    },

    /**
     * Asserts that a value is an object.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isObject
     * @static
     */
    isObject : function (actual, message) {
        YUITest.Assert._increment();
        if (!actual || (typeof actual != "object" && typeof actual != "function")){
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Value should be an object."), actual);
        }
    },

    /**
     * Asserts that a value is a string.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isString
     * @static
     */
    isString : function (actual, message) {
        YUITest.Assert._increment();
        if (typeof actual != "string"){
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Value should be a string."), actual);
        }
    },

    /**
     * Asserts that a value is of a particular type.
     * @param {String} expectedType The expected type of the variable.
     * @param {Object} actualValue The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isTypeOf
     * @static
     */
    isTypeOf : function (expectedType, actualValue, message){
        YUITest.Assert._increment();
        if (typeof actualValue != expectedType){
            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Value should be of type " + expectedType + "."), expectedType, typeof actualValue);
        }
    },

    //--------------------------------------------------------------------------
    // Error Detection Methods
    //--------------------------------------------------------------------------

    /**
     * Asserts that executing a particular method should throw an error of
     * a specific type. This is a replacement for _should.error.
     * @param {String|Function|Object} expectedError If a string, this
     *      is the error message that the error must have; if a function, this
     *      is the constructor that should have been used to create the thrown
     *      error; if an object, this is an instance of a particular error type
     *      with a specific error message (both must match).
     * @param {Function} method The method to execute that should throw the error.
     * @param {String} message (Optional) The message to display if the assertion
     *      fails.
     * @method throwsError
     * @static
     */
    throwsError: function(expectedError, method, message){
        YUITest.Assert._increment();
        var error = false;

        try {
            method();
        } catch (thrown) {

            //check to see what type of data we have
            if (typeof expectedError == "string"){

                //if it's a string, check the error message
                if (thrown.message != expectedError){
                    error = true;
                }
            } else if (typeof expectedError == "function"){

                //if it's a function, see if the error is an instance of it
                if (!(thrown instanceof expectedError)){
                    error = true;
                }

            } else if (typeof expectedError == "object" && expectedError !== null){

                //if it's an object, check the instance and message
                if (!(thrown instanceof expectedError.constructor) ||
                        thrown.message != expectedError.message){
                    error = true;
                }

            } else { //if it gets here, the argument could be wrong
                error = true;
            }

            if (error){
                throw new YUITest.UnexpectedError(thrown);
            } else {
                return;
            }
        }

        //if it reaches here, the error wasn't thrown, which is a bad thing
        throw new YUITest.AssertionError(YUITest.Assert._formatMessage(message, "Error should have been thrown."));
    }

};
