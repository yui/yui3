/**
 * Creates a new mock object.
 * @namespace Test
 * @module test
 * @class Mock
 * @constructor
 * @param {Object} template (Optional) An object whose methods
 *      should be stubbed out on the mock object.
 */
YUITest.Mock = function(template){

    //use blank object is nothing is passed in
    template = template || {};

    var mock,
        name;

    //try to create mock that keeps prototype chain intact
    //fails in the case of ActiveX objects
    try {
        function f(){}
        f.prototype = template;
        mock = new f();
    } catch (ex) {
        mock = {};
    }

    //create stubs for all methods
    for (name in template){
        if (template.hasOwnProperty(name)){
            if (typeof template[name] == "function"){
                mock[name] = function(name){
                    return function(){
                        YUITest.Assert.fail("Method " + name + "() was called but was not expected to be.");
                    };
                }(name);
            }
        }
    }

    //return it
    return mock;
};

/**
 * Assigns an expectation to a mock object. This is used to create
 * methods and properties on the mock object that are monitored for
 * calls and changes, respectively.
 * @param {Object} mock The object to add the expectation to.
 * @param {Object} expectation An object defining the expectation. For
 *      properties, the keys "property" and "value" are required. For a
 *      method the "method" key defines the method's name, the optional "args"
 *      key provides an array of argument types. The "returns" key provides
 *      an optional return value. An optional "run" key provides a function
 *      to be used as the method body. The return value of a mocked method is
 *      determined first by the "returns" key, then the "run" function's return
 *      value. If neither "returns" nor "run" is provided undefined is returned.
 *      An optional 'error' key defines an error type to be thrown in all cases.
 *      The "callCount" key provides an optional number of times the method is
 *      expected to be called (the default is 1).
 * @method expect
 * @static
 */
YUITest.Mock.expect = function(mock /*:Object*/, expectation /*:Object*/){

    //make sure there's a place to store the expectations
    if (!mock.__expectations) {
        mock.__expectations = {};
    }

    //method expectation
    if (expectation.method){
        var name = expectation.method,
            args = expectation.args || [],
            result = expectation.returns,
            callCount = (typeof expectation.callCount == "number") ? expectation.callCount : 1,
            error = expectation.error,
            run = expectation.run || function(){},
            runResult,
            i;

        //save expectations
        mock.__expectations[name] = expectation;
        expectation.callCount = callCount;
        expectation.actualCallCount = 0;

        //process arguments
        for (i=0; i < args.length; i++){
             if (!(args[i] instanceof YUITest.Mock.Value)){
                args[i] = YUITest.Mock.Value(YUITest.Assert.areSame, [args[i]], "Argument " + i + " of " + name + "() is incorrect.");
            }
        }

        //if the method is expected to be called
        if (callCount > 0){
            mock[name] = function(){
                try {
                    expectation.actualCallCount++;
                    YUITest.Assert.areEqual(args.length, arguments.length, "Method " + name + "() passed incorrect number of arguments.");
                    for (var i=0, len=args.length; i < len; i++){
                        args[i].verify(arguments[i]);
                    }

                    runResult = run.apply(this, arguments);

                    if (error){
                        throw error;
                    }
                } catch (ex){
                    //route through TestRunner for proper handling
                    YUITest.TestRunner._handleError(ex);
                }

                // Any value provided for 'returns' overrides any value returned
                // by our 'run' function.
                return expectation.hasOwnProperty('returns') ? result : runResult;
            };
        } else {

            //method should fail if called when not expected
            mock[name] = function(){
                try {
                    YUITest.Assert.fail("Method " + name + "() should not have been called.");
                } catch (ex){
                    //route through TestRunner for proper handling
                    YUITest.TestRunner._handleError(ex);
                }
            };
        }
    } else if (expectation.property){
        //save expectations
        mock.__expectations[expectation.property] = expectation;
    }
};

/**
 * Verifies that all expectations of a mock object have been met and
 * throws an assertion error if not.
 * @param {Object} mock The object to verify..
 * @method verify
 * @static
 */
YUITest.Mock.verify = function(mock){
    try {

        for (var name in mock.__expectations){
            if (mock.__expectations.hasOwnProperty(name)){
                var expectation = mock.__expectations[name];
                if (expectation.method) {
                    YUITest.Assert.areEqual(expectation.callCount, expectation.actualCallCount, "Method " + expectation.method + "() wasn't called the expected number of times.");
                } else if (expectation.property){
                    YUITest.Assert.areEqual(expectation.value, mock[expectation.property], "Property " + expectation.property + " wasn't set to the correct value.");
                }
            }
        }

    } catch (ex){
        //route through TestRunner for proper handling
        YUITest.TestRunner._handleError(ex);
    }
};

/**
 * Creates a new value matcher.
 * @param {Function} method The function to call on the value.
 * @param {Array} originalArgs (Optional) Array of arguments to pass to the method.
 * @param {String} message (Optional) Message to display in case of failure.
 * @namespace Test.Mock
 * @module test
 * @class Value
 * @constructor
 */
YUITest.Mock.Value = function(method, originalArgs, message){
    if (this instanceof YUITest.Mock.Value){
        this.verify = function(value){
            var args = [].concat(originalArgs || []);
            args.push(value);
            args.push(message);
            method.apply(null, args);
        };
    } else {
        return new YUITest.Mock.Value(method, originalArgs, message);
    }
};

/**
 * Predefined matcher to match any value.
 * @property Any
 * @static
 * @type Function
 */
YUITest.Mock.Value.Any        = YUITest.Mock.Value(function(){});

/**
 * Predefined matcher to match boolean values.
 * @property Boolean
 * @static
 * @type Function
 */
YUITest.Mock.Value.Boolean    = YUITest.Mock.Value(YUITest.Assert.isBoolean);

/**
 * Predefined matcher to match number values.
 * @property Number
 * @static
 * @type Function
 */
YUITest.Mock.Value.Number     = YUITest.Mock.Value(YUITest.Assert.isNumber);

/**
 * Predefined matcher to match string values.
 * @property String
 * @static
 * @type Function
 */
YUITest.Mock.Value.String     = YUITest.Mock.Value(YUITest.Assert.isString);

/**
 * Predefined matcher to match object values.
 * @property Object
 * @static
 * @type Function
 */
YUITest.Mock.Value.Object     = YUITest.Mock.Value(YUITest.Assert.isObject);

/**
 * Predefined matcher to match function values.
 * @property Function
 * @static
 * @type Function
 */
YUITest.Mock.Value.Function   = YUITest.Mock.Value(YUITest.Assert.isFunction);
