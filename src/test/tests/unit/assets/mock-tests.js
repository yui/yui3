YUI.add('mock-tests', function(Y) {

    var Assert          = Y.Assert,
        ObjectAssert    = Y.ObjectAssert;

    //-------------------------------------------------------------------------
    // Base Test Suite
    //-------------------------------------------------------------------------

    var suite = new Y.Test.Suite("Mock Tests");

    //-------------------------------------------------------------------------
    // Test Case for call count
    //-------------------------------------------------------------------------

    suite.add(new Y.Test.Case({

        name : "Call Count Tests",

        _should: {
            fail: {
                "Call count should default to 1 and fail": 1,
                "Call count set to 1 should fail when method isn't called": 1,
                "Call count set to 1 should fail when method is called twice": 1,
                "Call count set to 0 should fail when method is called once": 1
            }
        },

        /*
         * Tests that leaving off callCount results in a callCount of 1, so
         * calling the mock method once should make the test pass.
         */
        "Call count should default to 1 and pass": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method"
            });

            mock.method();
            Y.Mock.verify(mock);
        },

        /*
         * Tests that leaving off callCount results in a callCount of 1, so
         * not calling the mock method once should make the test fail.
         */
        "Call count should default to 1 and fail": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method"
            });

            Y.Mock.verify(mock);
        },

        /*
         * Tests that setting callCount to 1 and
         * calling the mock method once should make the test pass.
         */
        "Call count set to 1 should pass when method is called once": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                callCount: 1
            });

            mock.method();
            Y.Mock.verify(mock);
        },

        /*
         * Tests that setting callCount to 1 and not
         * calling the mock method once should make the test fail.
         */
        "Call count set to 1 should fail when method isn't called": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                callCount: 1
            });

            Y.Mock.verify(mock);
        },

        /*
         * Tests that setting callCount to 1 and not
         * calling the mock method twice should make the test fail.
         */
        "Call count set to 1 should fail when method is called twice": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                callCount: 1
            });

            mock.method();
            mock.method();

            Y.Mock.verify(mock);
        },

        /*
         * Tests that setting callCount to 0 and
         * calling the mock method once should make the test fail.
         */
        "Call count set to 0 should fail when method is called once": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                callCount: 0
            });

            mock.method();
            Y.Mock.verify(mock);
        },

        /*
         * Tests that setting callCount to 0 and not
         * calling the mock method once should make the test pass.
         */
        "Call count set to 0 should pass when method isn't called": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                callCount: 0
            });

            Y.Mock.verify(mock);
        }

    }));

    //-------------------------------------------------------------------------
    // Test Case for arguments
    //-------------------------------------------------------------------------

    suite.add(new Y.Test.Case({

        name : "Arguments Tests",

        _should: {
            fail: {
                "Passing an incorrect number of arguments should make the test fail": 1,
                "Passing an inexact argument should make the test fail" : 1,

                "Passing a number to an Boolean argument should make the test fail": 1,
                "Passing a string to an Boolean argument should make the test fail": 1,
                "Passing a object to an Boolean argument should make the test fail": 1,
                "Passing a function to an Boolean argument should make the test fail": 1,
                "Passing a null to an Boolean argument should make the test fail": 1,

                "Passing a number to an String argument should make the test fail": 1,
                "Passing a boolean to an String argument should make the test fail": 1,
                "Passing a object to an String argument should make the test fail": 1,
                "Passing a function to an String argument should make the test fail": 1,
                "Passing a null to an String argument should make the test fail": 1,

                "Passing a string to an Number argument should make the test fail": 1,
                "Passing a boolean to an Number argument should make the test fail": 1,
                "Passing a object to an Number argument should make the test fail": 1,
                "Passing a function to an Number argument should make the test fail": 1,
                "Passing a null to an Number argument should make the test fail": 1,

                "Passing a string to an Object argument should make the test fail": 1,
                "Passing a boolean to an Object argument should make the test fail": 1,
                "Passing a number to an Object argument should make the test fail": 1,
                "Passing a null to an Object argument should make the test fail": 1,

                "Passing a string to an Function argument should make the test fail": 1,
                "Passing a boolean to an Function argument should make the test fail": 1,
                "Passing a number to an Function argument should make the test fail": 1,
                "Passing a object to an Function argument should make the test fail": 1,
                "Passing a null to an Function argument should make the test fail": 1


            }
        },

        /*
         * Tests that when the number of arguments is verified, the test passes.
         */
        "Passing correct number of arguments should make the test pass": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Any ]
            });

            mock.method(1);
            Y.Mock.verify(mock);
        },

        /*
         * Tests that when the number of arguments is not verified, the test fails.
         */
        "Passing an incorrect number of arguments should make the test fail": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Any ]
            });

            mock.method(1, 2);
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing the exactly specified argument causes the test to pass.
         */
        "Passing the exact argument should make the test pass": function(){

            var arg = {};
            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ arg ]
            });

            mock.method(arg);
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing an argument that isn't exactly specified argument causes the test to fail.
         */
        "Passing an inexact argument should make the test fail": function(){

            var arg = {};
            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ arg ]
            });

            mock.method({});
            Y.Mock.verify(mock);
        },

        //Y.Mock.Value.Any tests --------------------------------------

        /*
         * Tests that passing a number to an argument specified as Y.Mock.Value.Any
         * results cause the test to pass.
         */
        "Passing a number to an Any argument should make the test pass": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Any ]
            });

            mock.method(1);
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing a boolean to an argument specified as Y.Mock.Value.Any
         * results cause the test to pass.
         */
        "Passing a boolean to an Any argument should make the test pass": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Any ]
            });

            mock.method(true);
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing a string to an argument specified as Y.Mock.Value.Any
         * results cause the test to pass.
         */
        "Passing a string to an Any argument should make the test pass": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Any ]
            });

            mock.method("");
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing an object to an argument specified as Y.Mock.Value.Any
         * results cause the test to pass.
         */
        "Passing a object to an Any argument should make the test pass": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Any ]
            });

            mock.method({});
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing a function to an argument specified as Y.Mock.Value.Any
         * results cause the test to pass.
         */
        "Passing a function to an Any argument should make the test pass": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Any ]
            });

            mock.method(function(){});
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing a null to an argument specified as Y.Mock.Value.Any
         * results cause the test to pass.
         */
        "Passing a null to an Any argument should make the test pass": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Any ]
            });

            mock.method(null);
            Y.Mock.verify(mock);
        },

        //Y.Mock.Value.Boolean tests --------------------------------------

        /*
         * Tests that passing a number to an argument specified as Y.Mock.Value.Boolean
         * results cause the test to fail.
         */
        "Passing a number to an Boolean argument should make the test fail": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Boolean ]
            });

            mock.method(1);
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing a boolean to an argument specified as Y.Mock.Value.Boolean
         * results cause the test to pass.
         */
        "Passing a boolean to an Boolean argument should make the test pass": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Boolean ]
            });

            mock.method(true);
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing a string to an argument specified as Y.Mock.Value.Boolean
         * results cause the test to fail.
         */
        "Passing a string to an Boolean argument should make the test fail": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Boolean ]
            });

            mock.method("");
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing an object to an argument specified as Y.Mock.Value.Boolean
         * results cause the test to fail.
         */
        "Passing a object to an Boolean argument should make the test fail": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Boolean ]
            });

            mock.method({});
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing a function to an argument specified as Y.Mock.Value.Boolean
         * results cause the test to fail.
         */
        "Passing a function to an Boolean argument should make the test fail": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Boolean ]
            });

            mock.method(function(){});
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing a null to an argument specified as Y.Mock.Value.Boolean
         * results cause the test to fail.
         */
        "Passing a null to an Boolean argument should make the test fail": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Boolean ]
            });

            mock.method(null);
            Y.Mock.verify(mock);
        },

        //Y.Mock.Value.String tests --------------------------------------

        /*
         * Tests that passing a number to an argument specified as Y.Mock.Value.String
         * results cause the test to fail.
         */
        "Passing a number to an String argument should make the test fail": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.String ]
            });

            mock.method(1);
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing a boolean to an argument specified as Y.Mock.Value.String
         * results cause the test to fail.
         */
        "Passing a boolean to an String argument should make the test fail": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.String ]
            });

            mock.method(true);
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing a string to an argument specified as Y.Mock.Value.String
         * results cause the test to pass.
         */
        "Passing a string to an String argument should make the test pass": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.String ]
            });

            mock.method("");
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing an object to an argument specified as Y.Mock.Value.String
         * results cause the test to fail.
         */
        "Passing a object to an String argument should make the test fail": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.String ]
            });

            mock.method({});
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing a function to an argument specified as Y.Mock.Value.String
         * results cause the test to fail.
         */
        "Passing a function to an String argument should make the test fail": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.String ]
            });

            mock.method(function(){});
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing a null to an argument specified as Y.Mock.Value.String
         * results cause the test to fail.
         */
        "Passing a null to an String argument should make the test fail": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.String ]
            });

            mock.method(null);
            Y.Mock.verify(mock);
        },

        //Y.Mock.Value.Number tests --------------------------------------

        /*
         * Tests that passing a number to an argument specified as Y.Mock.Value.Number
         * results cause the test to pass.
         */
        "Passing a number to an Number argument should make the test pass": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Number ]
            });

            mock.method(1);
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing a boolean to an argument specified as Y.Mock.Value.Number
         * results cause the test to fail.
         */
        "Passing a boolean to an Number argument should make the test fail": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Number ]
            });

            mock.method(true);
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing a string to an argument specified as Y.Mock.Value.Number
         * results cause the test to fail.
         */
        "Passing a string to an Number argument should make the test fail": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Number ]
            });

            mock.method("");
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing an object to an argument specified as Y.Mock.Value.Number
         * results cause the test to fail.
         */
        "Passing a object to an Number argument should make the test fail": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Number ]
            });

            mock.method({});
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing a function to an argument specified as Y.Mock.Value.Number
         * results cause the test to fail.
         */
        "Passing a function to an Number argument should make the test fail": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Number ]
            });

            mock.method(function(){});
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing a null to an argument specified as Y.Mock.Value.Number
         * results cause the test to fail.
         */
        "Passing a null to an Number argument should make the test fail": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Number ]
            });

            mock.method(null);
            Y.Mock.verify(mock);
        },

        //Y.Mock.Value.Function tests --------------------------------------

        /*
         * Tests that passing a number to an argument specified as Y.Mock.Value.Function
         * results cause the test to fail.
         */
        "Passing a number to an Function argument should make the test fail": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Function ]
            });

            mock.method(1);
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing a boolean to an argument specified as Y.Mock.Value.Function
         * results cause the test to fail.
         */
        "Passing a boolean to an Function argument should make the test fail": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Function ]
            });

            mock.method(true);
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing a string to an argument specified as Y.Mock.Value.Function
         * results cause the test to fail.
         */
        "Passing a string to an Function argument should make the test fail": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Function ]
            });

            mock.method("");
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing an object to an argument specified as Y.Mock.Value.Function
         * results cause the test to fail.
         */
        "Passing a object to an Function argument should make the test fail": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Function ]
            });

            mock.method({});
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing a function to an argument specified as Y.Mock.Value.Function
         * results cause the test to pass.
         */
        "Passing a function to an Function argument should make the test pass": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Function ]
            });

            mock.method(function(){});
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing a null to an argument specified as Y.Mock.Value.Function
         * results cause the test to fail.
         */
        "Passing a null to an Function argument should make the test fail": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Function ]
            });

            mock.method(null);
            Y.Mock.verify(mock);
        },

        //Y.Mock.Value.Object tests --------------------------------------

        /*
         * Tests that passing a number to an argument specified as Y.Mock.Value.Object
         * results cause the test to fail.
         */
        "Passing a number to an Object argument should make the test fail": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Object ]
            });

            mock.method(1);
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing a boolean to an argument specified as Y.Mock.Value.Object
         * results cause the test to fail.
         */
        "Passing a boolean to an Object argument should make the test fail": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Object ]
            });

            mock.method(true);
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing a string to an argument specified as Y.Mock.Value.Object
         * results cause the test to fail.
         */
        "Passing a string to an Object argument should make the test fail": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Object ]
            });

            mock.method("");
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing an object to an argument specified as Y.Mock.Value.Object
         * results cause the test to pass.
         */
        "Passing a object to an Object argument should make the test pass": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Object ]
            });

            mock.method({});
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing a function to an argument specified as Y.Mock.Value.Object
         * results cause the test to pass.
         */
        "Passing a function to an Object argument should make the test pass": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Object ]
            });

            mock.method(function(){});
            Y.Mock.verify(mock);
        },

        /*
         * Tests that passing a null to an argument specified as Y.Mock.Value.Object
         * results cause the test to fail.
         */
        "Passing a null to an Object argument should make the test fail": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.Object ]
            });

            mock.method(null);
            Y.Mock.verify(mock);
        }
    }));

    //-------------------------------------------------------------------------
    // Test Case for asynchronous mock calls
    //-------------------------------------------------------------------------

    suite.add(new Y.Test.Case({

        name : "Asynchronous Tests",

        _should: {

            fail: {
                "A mock method called asynchronously shouldn't cause an error": 1
            }
        },

        /*
         * Tests that when a mock method is called asynchronously, either via
         * timeout or XHR callback, that its error is properly handled and
         * the failure is logged to the test.
         */
        "A mock method called asynchronously shouldn't cause an error": function(){

            var mock = Y.Mock();
            Y.Mock.expect(mock, {
                method: "method",
                args: [ Y.Mock.Value.String ]
            });

            setTimeout(function(){
                mock.method(null);
            }, 250);

            this.wait(function(){
                Y.Mock.verify(mock);
            }, 500);
        }

    }));


    //-------------------------------------------------------------------------
    // Test Case for returns expectations
    //-------------------------------------------------------------------------
    
    suite.add(new Y.Test.Case({
    
        name : "Returns Tests",
        groups: ["mock", "common"],

        /*
         * Test that when no 'returns' expectation is given it is undefined.
         */
        "Value for 'returns' should default to undefined": function(){
            var mock = Y.Test.Mock(),
                result;

            Y.Test.Mock.expect(mock, {
                method: "method"
            });

            result = mock.method();
            Assert.isUndefined(result);
        },

        /*
         * Test that when a 'returns' expectation is given it is used.
         */
        "Value for 'returns' should be used as return value": function(){
            var mock = Y.Test.Mock(),
                result;

            Y.Test.Mock.expect(mock, {
                method: "method",
                returns: true
            });

            result = mock.method();
            Assert.isTrue(result);
        },

        /*
         * Test that when a 'returns' expectation is given it is used regardless
         * of the return value of any run function provided.
         */
        "Value for 'returns' should be used rather than run value": function(){
            var mock = Y.Test.Mock(),
                result;

            Y.Test.Mock.expect(mock, {
                method: "method",
                returns: true,
                run: function() {
                    return false;
                }
            });

            result = mock.method();
            Assert.isTrue(result);
        }

    }));

    //-------------------------------------------------------------------------
    // Test Case for run expectations
    //-------------------------------------------------------------------------
    
    suite.add(new Y.Test.Case({
    
        name : "Run Tests",
        groups: ["mock", "common"],

        /*
         * Test that when run is given it is executed.
         */
        "A supplied run function should be invoked": function(){
            var mock = Y.Test.Mock(),
                invoked = false;

            Y.Test.Mock.expect(mock, {
                method: "method",
                run: function() {
                    invoked = true;
                }
            });

            mock.method();
            Assert.isTrue(invoked);
        },

        /*
         * Test that run function return value is used when no 'returns' key is
         * present.
         */
        "A supplied run function's return value should be used.": function(){
            var mock = Y.Test.Mock(),
                result;

            Y.Test.Mock.expect(mock, {
                method: "method",
                run: function() {
                    return 'invoked';
                }
            });

            result = mock.method();
            Assert.areEqual(result, 'invoked');
        }

    }));


    Y.Test.Runner.add(suite);

});
