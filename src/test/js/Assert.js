  
    /**
     * The Assert object provides functions to test JavaScript values against
     * known and expected results. Whenever a comparison (assertion) fails,
     * an error is thrown.
     *
     * @class Assert
     * @static
     */
    Y.Assert = {
    
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
            var message = customMessage;
            if (Y.Lang.isString(customMessage) && customMessage.length > 0){
                return Y.Lang.substitute(customMessage, { message: defaultMessage });
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
            throw new Y.Assert.Error(Y.Assert._formatMessage(message, "Test force-failed."));
        },       
        
        //-------------------------------------------------------------------------
        // Equality Assertion Methods
        //-------------------------------------------------------------------------    
        
        /**
         * Asserts that a value is equal to another. This uses the double equals sign
         * so type cohersion may occur.
         * @param {Object} expected The expected value.
         * @param {Object} actual The actual value to test.
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @method areEqual
         * @static
         */
        areEqual : function (expected, actual, message) {
            Y.Assert._increment();
            if (expected != actual) {
                throw new Y.Assert.ComparisonFailure(Y.Assert._formatMessage(message, "Values should be equal."), expected, actual);
            }
        },
        
        /**
         * Asserts that a value is not equal to another. This uses the double equals sign
         * so type cohersion may occur.
         * @param {Object} unexpected The unexpected value.
         * @param {Object} actual The actual value to test.
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @method areNotEqual
         * @static
         */
        areNotEqual : function (unexpected, actual, 
                             message) {
            Y.Assert._increment();
            if (unexpected == actual) {
                throw new Y.Assert.UnexpectedValue(Y.Assert._formatMessage(message, "Values should not be equal."), unexpected);
            }
        },
        
        /**
         * Asserts that a value is not the same as another. This uses the triple equals sign
         * so no type cohersion may occur.
         * @param {Object} unexpected The unexpected value.
         * @param {Object} actual The actual value to test.
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @method areNotSame
         * @static
         */
        areNotSame : function (unexpected, actual, message) {
            Y.Assert._increment();
            if (unexpected === actual) {
                throw new Y.Assert.UnexpectedValue(Y.Assert._formatMessage(message, "Values should not be the same."), unexpected);
            }
        },
    
        /**
         * Asserts that a value is the same as another. This uses the triple equals sign
         * so no type cohersion may occur.
         * @param {Object} expected The expected value.
         * @param {Object} actual The actual value to test.
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @method areSame
         * @static
         */
        areSame : function (expected, actual, message) {
            Y.Assert._increment();
            if (expected !== actual) {
                throw new Y.Assert.ComparisonFailure(Y.Assert._formatMessage(message, "Values should be the same."), expected, actual);
            }
        },    
        
        //-------------------------------------------------------------------------
        // Boolean Assertion Methods
        //-------------------------------------------------------------------------    
        
        /**
         * Asserts that a value is false. This uses the triple equals sign
         * so no type cohersion may occur.
         * @param {Object} actual The actual value to test.
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @method isFalse
         * @static
         */
        isFalse : function (actual, message) {
            Y.Assert._increment();
            if (false !== actual) {
                throw new Y.Assert.ComparisonFailure(Y.Assert._formatMessage(message, "Value should be false."), false, actual);
            }
        },
        
        /**
         * Asserts that a value is true. This uses the triple equals sign
         * so no type cohersion may occur.
         * @param {Object} actual The actual value to test.
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @method isTrue
         * @static
         */
        isTrue : function (actual, message) {
            Y.Assert._increment();
            if (true !== actual) {
                throw new Y.Assert.ComparisonFailure(Y.Assert._formatMessage(message, "Value should be true."), true, actual);
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
            Y.Assert._increment();
            if (!isNaN(actual)){
                throw new Y.Assert.ComparisonFailure(Y.Assert._formatMessage(message, "Value should be NaN."), NaN, actual);
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
            Y.Assert._increment();
            if (isNaN(actual)){
                throw new Y.Assert.UnexpectedValue(Y.Assert._formatMessage(message, "Values should not be NaN."), NaN);
            }    
        },
        
        /**
         * Asserts that a value is not null. This uses the triple equals sign
         * so no type cohersion may occur.
         * @param {Object} actual The actual value to test.
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @method isNotNull
         * @static
         */
        isNotNull : function (actual, message) {
            Y.Assert._increment();
            if (Y.Lang.isNull(actual)) {
                throw new Y.Assert.UnexpectedValue(Y.Assert._formatMessage(message, "Values should not be null."), null);
            }
        },
    
        /**
         * Asserts that a value is not undefined. This uses the triple equals sign
         * so no type cohersion may occur.
         * @param {Object} actual The actual value to test.
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @method isNotUndefined
         * @static
         */
        isNotUndefined : function (actual, message) {
            Y.Assert._increment();
            if (Y.Lang.isUndefined(actual)) {
                throw new Y.Assert.UnexpectedValue(Y.Assert._formatMessage(message, "Value should not be undefined."), undefined);
            }
        },
    
        /**
         * Asserts that a value is null. This uses the triple equals sign
         * so no type cohersion may occur.
         * @param {Object} actual The actual value to test.
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @method isNull
         * @static
         */
        isNull : function (actual, message) {
            Y.Assert._increment();
            if (!Y.Lang.isNull(actual)) {
                throw new Y.Assert.ComparisonFailure(Y.Assert._formatMessage(message, "Value should be null."), null, actual);
            }
        },
            
        /**
         * Asserts that a value is undefined. This uses the triple equals sign
         * so no type cohersion may occur.
         * @param {Object} actual The actual value to test.
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @method isUndefined
         * @static
         */
        isUndefined : function (actual, message) {
            Y.Assert._increment();
            if (!Y.Lang.isUndefined(actual)) {
                throw new Y.Assert.ComparisonFailure(Y.Assert._formatMessage(message, "Value should be undefined."), undefined, actual);
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
            Y.Assert._increment();
            if (!Y.Lang.isArray(actual)){
                throw new Y.Assert.UnexpectedValue(Y.Assert._formatMessage(message, "Value should be an array."), actual);
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
            Y.Assert._increment();
            if (!Y.Lang.isBoolean(actual)){
                throw new Y.Assert.UnexpectedValue(Y.Assert._formatMessage(message, "Value should be a Boolean."), actual);
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
            Y.Assert._increment();
            if (!Y.Lang.isFunction(actual)){
                throw new Y.Assert.UnexpectedValue(Y.Assert._formatMessage(message, "Value should be a function."), actual);
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
            Y.Assert._increment();
            if (!(actual instanceof expected)){
                throw new Y.Assert.ComparisonFailure(Y.Assert._formatMessage(message, "Value isn't an instance of expected type."), expected, actual);
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
            Y.Assert._increment();
            if (!Y.Lang.isNumber(actual)){
                throw new Y.Assert.UnexpectedValue(Y.Assert._formatMessage(message, "Value should be a number."), actual);
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
            Y.Assert._increment();
            if (!Y.Lang.isObject(actual)){
                throw new Y.Assert.UnexpectedValue(Y.Assert._formatMessage(message, "Value should be an object."), actual);
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
            Y.Assert._increment();
            if (!Y.Lang.isString(actual)){
                throw new Y.Assert.UnexpectedValue(Y.Assert._formatMessage(message, "Value should be a string."), actual);
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
            Y.Assert._increment();
            if (typeof actualValue != expectedType){
                throw new Y.Assert.ComparisonFailure(Y.Assert._formatMessage(message, "Value should be of type " + expectedType + "."), expected, typeof actualValue);
            }
        }
    };
    
    /**
     * Asserts that a given condition is true. If not, then a Y.Assert.Error object is thrown
     * and the test fails.
     * @method Y.assert
     * @param {Boolean} condition The condition to test.
     * @param {String} message The message to display if the assertion fails.
     * @static
     */
    Y.assert = function(condition, message){
        Y.Assert._increment();
        if (!condition){
            throw new Y.Assert.Error(Y.Assert._formatMessage(message, "Assertion failed."));
        }
    };

    /**
     * Forces an assertion error to occur. Shortcut for Y.Assert.fail().
     * @method Y.fail
     * @param {String} message (Optional) The message to display with the failure.
     * @static
     */
    Y.fail = Y.Assert.fail;   
    
    //-----------------------------------------------------------------------------
    // Assertion errors
    //-----------------------------------------------------------------------------
    
    /**
     * Error is thrown whenever an assertion fails. It provides methods
     * to more easily get at error information and also provides a base class
     * from which more specific assertion errors can be derived.
     *
     * @param {String} message The message to display when the error occurs.
     * @namespace Assert
     * @class Error
     * @constructor
     */ 
    Y.Assert.Error = function (message){
    
        //call superclass
        arguments.callee.superclass.constructor.call(this, message);
        
        /*
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
    
    //inherit methods
    Y.extend(Y.Assert.Error, Error, {
    
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
        },
        
        /**
         * Returns a primitive value version of the error. Same as toString().
         * @method valueOf
         * @return {String} A primitive value version of the error.
         */
        valueOf : function () {
            return this.toString();
        }
    
    });
    
    /**
     * ComparisonFailure is subclass of Error that is thrown whenever
     * a comparison between two values fails. It provides mechanisms to retrieve
     * both the expected and actual value.
     *
     * @param {String} message The message to display when the error occurs.
     * @param {Object} expected The expected value.
     * @param {Object} actual The actual value that caused the assertion to fail.
     * @namespace Assert 
     * @extends Assert.Error
     * @class ComparisonFailure
     * @constructor
     */ 
    Y.Assert.ComparisonFailure = function (message, expected, actual){
    
        //call superclass
        arguments.callee.superclass.constructor.call(this, message);
        
        /**
         * The expected value.
         * @type Object
         * @property expected
         */
        this.expected = expected;
        
        /**
         * The actual value.
         * @type Object
         * @property actual
         */
        this.actual = actual;
        
        /**
         * The name of the error that occurred.
         * @type String
         * @property name
         */
        this.name = "ComparisonFailure";
        
    };
    
    //inherit methods
    Y.extend(Y.Assert.ComparisonFailure, Y.Assert.Error, {
    
        /**
         * Returns a fully formatted error for an assertion failure. This message
         * provides information about the expected and actual values.
         * @method toString
         * @return {String} A string describing the error.
         */
        getMessage : function () {
            return this.message + "\nExpected: " + this.expected + " (" + (typeof this.expected) + ")"  +
                "\nActual: " + this.actual + " (" + (typeof this.actual) + ")";
        }
    
    });
    
    /**
     * UnexpectedValue is subclass of Error that is thrown whenever
     * a value was unexpected in its scope. This typically means that a test
     * was performed to determine that a value was *not* equal to a certain
     * value.
     *
     * @param {String} message The message to display when the error occurs.
     * @param {Object} unexpected The unexpected value.
     * @namespace Assert
     * @extends Assert.Error
     * @class UnexpectedValue
     * @constructor
     */ 
    Y.Assert.UnexpectedValue = function (message, unexpected){
    
        //call superclass
        arguments.callee.superclass.constructor.call(this, message);
        
        /**
         * The unexpected value.
         * @type Object
         * @property unexpected
         */
        this.unexpected = unexpected;
        
        /**
         * The name of the error that occurred.
         * @type String
         * @property name
         */
        this.name = "UnexpectedValue";
        
    };
    
    //inherit methods
    Y.extend(Y.Assert.UnexpectedValue, Y.Assert.Error, {
    
        /**
         * Returns a fully formatted error for an assertion failure. The message
         * contains information about the unexpected value that was encountered.
         * @method getMessage
         * @return {String} A string describing the error.
         */
        getMessage : function () {
            return this.message + "\nUnexpected: " + this.unexpected + " (" + (typeof this.unexpected) + ") ";
        }
    
    });
    
    /**
     * ShouldFail is subclass of Error that is thrown whenever
     * a test was expected to fail but did not.
     *
     * @param {String} message The message to display when the error occurs.
     * @namespace Assert
     * @extends Assert.Error
     * @class ShouldFail
     * @constructor
     */  
    Y.Assert.ShouldFail = function (message){
    
        //call superclass
        arguments.callee.superclass.constructor.call(this, message || "This test should fail but didn't.");
        
        /**
         * The name of the error that occurred.
         * @type String
         * @property name
         */
        this.name = "ShouldFail";
        
    };
    
    //inherit methods
    Y.extend(Y.Assert.ShouldFail, Y.Assert.Error);
    
    /**
     * ShouldError is subclass of Error that is thrown whenever
     * a test is expected to throw an error but doesn't.
     *
     * @param {String} message The message to display when the error occurs.
     * @namespace Assert
     * @extends Assert.Error
     * @class ShouldError
     * @constructor
     */  
    Y.Assert.ShouldError = function (message){
    
        //call superclass
        arguments.callee.superclass.constructor.call(this, message || "This test should have thrown an error but didn't.");
        
        /**
         * The name of the error that occurred.
         * @type String
         * @property name
         */
        this.name = "ShouldError";
        
    };
    
    //inherit methods
    Y.extend(Y.Assert.ShouldError, Y.Assert.Error);
    
    /**
     * UnexpectedError is subclass of Error that is thrown whenever
     * an error occurs within the course of a test and the test was not expected
     * to throw an error.
     *
     * @param {Error} cause The unexpected error that caused this error to be 
     *                      thrown.
     * @namespace Assert
     * @extends Assert.Error
     * @class UnexpectedError
     * @constructor
     */  
    Y.Assert.UnexpectedError = function (cause){
    
        //call superclass
        arguments.callee.superclass.constructor.call(this, "Unexpected error: " + cause.message);
        
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
    
    //inherit methods
    Y.extend(Y.Assert.UnexpectedError, Y.Assert.Error);
    