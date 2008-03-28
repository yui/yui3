(function() {

    // object utils
    var M = function(Y) {
    
        Y.namespace("Test");
        
        /**
         * Test case containing various tests to run.
         * @param template An object containing any number of test methods, other methods,
         *                 an optional name, and anything else the test case needs.
         * @class Case
         * @namespace Y.Test
         * @constructor
         */
        Y.Test.Case = function (template /*:Object*/) {
            
            /**
             * Special rules for the test case. Possible subobjects
             * are fail, for tests that should fail, and error, for
             * tests that should throw an error.
             */
            this._should /*:Object*/ = {};
            
            //copy over all properties from the template to this object
            for (var prop in template) {
                this[prop] = template[prop];
            }    
            
            //check for a valid name
            if (!Y.lang.isString(this.name)){
                /**
                 * Name for the test case.
                 */
                this.name /*:String*/ = "testCase" + Y.guid();
            }
        
        };
        
        
        Y.Test.Case.prototype = {  
        
            /**
             * Resumes a paused test and runs the given function.
             * @param {Function} segment (Optional) The function to run.
             *      If omitted, the test automatically passes.
             * @return {Void}
             * @method resume
             */
            resume : function (segment /*:Function*/) /*:Void*/ {
                Y.Test.Runner.resume(segment);
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
            wait : function (segment /*:Function*/, delay /*:int*/) /*:Void*/{
                throw new Y.Test.Wait(segment, delay);
            },
        
            //-------------------------------------------------------------------------
            // Stub Methods
            //-------------------------------------------------------------------------
        
            /**
             * Function to run before each test is executed.
             * @return {Void}
             * @method setUp
             */
            setUp : function () /*:Void*/ {
            },
            
            /**
             * Function to run after each test is executed.
             * @return {Void}
             * @method tearDown
             */
            tearDown: function () /*:Void*/ {    
            }
        };
        
        /**
         * Represents a stoppage in test execution to wait for an amount of time before
         * continuing.
         * @param {Function} segment A function to run when the wait is over.
         * @param {int} delay The number of milliseconds to wait before running the code.
         * @class Wait
         * @namespace Y.Test
         * @constructor
         *
         */
        Y.Test.Wait = function (segment /*:Function*/, delay /*:int*/) {
            
            /**
             * The segment of code to run when the wait is over.
             * @type Function
             * @property segment
             */
            this.segment /*:Function*/ = (Y.lang.isFunction(segment) ? segment : null);
        
            /**
             * The delay before running the segment of code.
             * @type int
             * @property delay
             */
            this.delay /*:int*/ = (Y.lang.isNumber(delay) ? delay : 0);
        
        };
    };
    
    YUI.add("testcase", M, "3.0.0", { use: ["lang"] });
})();

(function(){

    var M = function(Y){
        
        Y.namespace("Test");
        
        /**
         * A test suite that can contain a collection of TestCase and TestSuite objects.
         * @param {String||Object} data The name of the test suite or an object containing
         *      a name property as well as setUp and tearDown methods.
         * @namespace YAHOO.tool
         * @class TestSuite
         * @constructor
         */
        Y.Test.Suite = function (data /*:String||Object*/) {
        
            /**
             * The name of the test suite.
             * @type String
             * @property name
             */
            this.name /*:String*/ = "";
        
            /**
             * Array of test suites and
             * @private
             */
            this.items /*:Array*/ = [];
        
            //initialize the properties
            if (Y.lang.isString(data)){
                this.name = data;
            } else if (Y.lang.isObject(data)){
                Y.mix(this, data, true);
            }
        
            //double-check name
            if (this.name === ""){
                this.name = "testSuite" + Y.guid();
            }
        
        };
        
        Y.Test.Suite.prototype = {
            
            /**
             * Adds a test suite or test case to the test suite.
             * @param {Y.Test.Suite||Y.Test.Case} testObject The test suite or test case to add.
             * @return {Void}
             * @method add
             */
            add : function (testObject /*:Y.Test.Suite*/) /*:Void*/ {
                if (testObject instanceof Y.Test.Suite || testObject instanceof Y.Test.Case) {
                    this.items.push(testObject);
                }
            },
            
            //-------------------------------------------------------------------------
            // Stub Methods
            //-------------------------------------------------------------------------
        
            /**
             * Function to run before each test is executed.
             * @return {Void}
             * @method setUp
             */
            setUp : function () /*:Void*/ {
            },
            
            /**
             * Function to run after each test is executed.
             * @return {Void}
             * @method tearDown
             */
            tearDown: function () /*:Void*/ {
            }
            
        };
    };
    
    YUI.add("testsuite", M, "3.0.0", { requires: ["lang", "testcase"] });
})();

(function(){

    var M = function(Y){
        
        Y.namespace("Test");
        
        //prevent duplicates
        if (Y.Test.Runner) return;
        
        /**
         * Runs test suites and test cases, providing events to allowing for the
         * interpretation of test results.
         * @namespace Y.Test
         * @class Runner
         * @static
         */
        Y.Test.Runner = (function(){
        
            /**
             * A node in the test tree structure. May represent a TestSuite, TestCase, or
             * test function.
             * @param {Variant} testObject A TestSuite, TestCase, or the name of a test function.
             * @class TestNode
             * @constructor
             * @private
             */
            function TestNode(testObject /*:Variant*/){
            
                /**
                 * The TestSuite, TestCase, or test function represented by this node.
                 * @type Variant
                 * @property testObject
                 */
                this.testObject = testObject;
                
                /**
                 * Pointer to this node's first child.
                 * @type TestNode
                 * @property firstChild
                 */        
                this.firstChild /*:TestNode*/ = null;
                
                /**
                 * Pointer to this node's last child.
                 * @type TestNode
                 * @property lastChild
                 */        
                this.lastChild = null;
                
                /**
                 * Pointer to this node's parent.
                 * @type TestNode
                 * @property parent
                 */        
                this.parent = null; 
           
                /**
                 * Pointer to this node's next sibling.
                 * @type TestNode
                 * @property next
                 */        
                this.next = null;
                
                /**
                 * Test results for this test object.
                 * @type object
                 * @property results
                 */                
                this.results /*:Object*/ = {
                    passed : 0,
                    failed : 0,
                    total : 0,
                    ignored : 0
                };
                
                //initialize results
                if (testObject instanceof Y.Test.Suite){
                    this.results.type = "testsuite";
                    this.results.name = testObject.name;
                } else if (testObject instanceof Y.Test.Case){
                    this.results.type = "testcase";
                    this.results.name = testObject.name;
                }
               
            }
            
            TestNode.prototype = {
            
                /**
                 * Appends a new test object (TestSuite, TestCase, or test function name) as a child
                 * of this node.
                 * @param {Variant} testObject A TestSuite, TestCase, or the name of a test function.
                 * @return {Void}
                 */
                appendChild : function (testObject /*:Variant*/) /*:Void*/{
                    var node = new TestNode(testObject);
                    if (this.firstChild === null){
                        this.firstChild = this.lastChild = node;
                    } else {
                        this.lastChild.next = node;
                        this.lastChild = node;
                    }
                    node.parent = this;
                    return node;
                }       
            };
        
            function TestRunner(){
            
                //inherit from EventProvider
                TestRunner.superclass.constructor.apply(this,arguments);
                
                /**
                 * Suite on which to attach all TestSuites and TestCases to be run.
                 * @type Y.Test.Suite
                 * @property masterSuite
                 * @private
                 */
                this.masterSuite /*:Y.Test.Suite*/ = new Y.Test.Suite("YUI Test Results");        
        
                /**
                 * Pointer to the current node in the test tree.
                 * @type TestNode
                 * @private
                 * @property _cur
                 */
                this._cur = null;
                
                /**
                 * Pointer to the root node in the test tree.
                 * @type TestNode
                 * @private
                 * @property _root
                 */
                this._root = null;
                
                //create events
                /*var events = [
                    this.TEST_CASE_BEGIN_EVENT,
                    this.TEST_CASE_COMPLETE_EVENT,
                    this.TEST_SUITE_BEGIN_EVENT,
                    this.TEST_SUITE_COMPLETE_EVENT,
                    this.TEST_PASS_EVENT,
                    this.TEST_FAIL_EVENT,
                    this.TEST_IGNORE_EVENT,
                    this.COMPLETE_EVENT,
                    this.BEGIN_EVENT
                ];
                for (var i=0; i < events.length; i++){
                    this.createEvent(events[i], { scope: this });
                }  */     
           
            }
            
            Y.lang.extend(TestRunner, Y.Event.Target, {
            
                //-------------------------------------------------------------------------
                // Constants
                //-------------------------------------------------------------------------
                 
                /**
                 * Fires when a test case is opened but before the first 
                 * test is executed.
                 * @event testcasebegin
                 */         
                TEST_CASE_BEGIN_EVENT /*:String*/ : "testcasebegin",
                
                /**
                 * Fires when all tests in a test case have been executed.
                 * @event testcasecomplete
                 */        
                TEST_CASE_COMPLETE_EVENT /*:String*/ : "testcasecomplete",
                
                /**
                 * Fires when a test suite is opened but before the first 
                 * test is executed.
                 * @event testsuitebegin
                 */        
                TEST_SUITE_BEGIN_EVENT /*:String*/ : "testsuitebegin",
                
                /**
                 * Fires when all test cases in a test suite have been
                 * completed.
                 * @event testsuitecomplete
                 */        
                TEST_SUITE_COMPLETE_EVENT /*:String*/ : "testsuitecomplete",
                
                /**
                 * Fires when a test has passed.
                 * @event pass
                 */        
                TEST_PASS_EVENT /*:String*/ : "pass",
                
                /**
                 * Fires when a test has failed.
                 * @event fail
                 */        
                TEST_FAIL_EVENT /*:String*/ : "fail",
                
                /**
                 * Fires when a test has been ignored.
                 * @event ignore
                 */        
                TEST_IGNORE_EVENT /*:String*/ : "ignore",
                
                /**
                 * Fires when all test suites and test cases have been completed.
                 * @event complete
                 */        
                COMPLETE_EVENT /*:String*/ : "complete",
                
                /**
                 * Fires when the run() method is called.
                 * @event begin
                 */        
                BEGIN_EVENT /*:String*/ : "begin",    
                
                //-------------------------------------------------------------------------
                // Test Tree-Related Methods
                //-------------------------------------------------------------------------
        
                /**
                 * Adds a test case to the test tree as a child of the specified node.
                 * @param {TestNode} parentNode The node to add the test case to as a child.
                 * @param {Y.Test.Case} testCase The test case to add.
                 * @return {Void}
                 * @static
                 * @private
                 * @method _addTestCaseToTestTree
                 */
               _addTestCaseToTestTree : function (parentNode /*:TestNode*/, testCase /*:Y.Test.Case*/) /*:Void*/{
                    
                    //add the test suite
                    var node = parentNode.appendChild(testCase);
                    
                    //iterate over the items in the test case
                    for (var prop in testCase){
                        if (prop.indexOf("test") === 0 && Y.lang.isFunction(testCase[prop])){
                            node.appendChild(prop);
                        }
                    }
                 
                },
                
                /**
                 * Adds a test suite to the test tree as a child of the specified node.
                 * @param {TestNode} parentNode The node to add the test suite to as a child.
                 * @param {Y.Test.Suite} testSuite The test suite to add.
                 * @return {Void}
                 * @static
                 * @private
                 * @method _addTestSuiteToTestTree
                 */
                _addTestSuiteToTestTree : function (parentNode /*:TestNode*/, testSuite /*:Y.Test.Suite*/) /*:Void*/ {
                    
                    //add the test suite
                    var node = parentNode.appendChild(testSuite);
                    
                    //iterate over the items in the master suite
                    for (var i=0; i < testSuite.items.length; i++){
                        if (testSuite.items[i] instanceof Y.Test.Suite) {
                            this._addTestSuiteToTestTree(node, testSuite.items[i]);
                        } else if (testSuite.items[i] instanceof Y.Test.Case) {
                            this._addTestCaseToTestTree(node, testSuite.items[i]);
                        }                   
                    }            
                },
                
                /**
                 * Builds the test tree based on items in the master suite. The tree is a hierarchical
                 * representation of the test suites, test cases, and test functions. The resulting tree
                 * is stored in _root and the pointer _cur is set to the root initially.
                 * @return {Void}
                 * @static
                 * @private
                 * @method _buildTestTree
                 */
                _buildTestTree : function () /*:Void*/ {
                
                    this._root = new TestNode(this.masterSuite);
                    this._cur = this._root;
                    
                    //iterate over the items in the master suite
                    for (var i=0; i < this.masterSuite.items.length; i++){
                        if (this.masterSuite.items[i] instanceof Y.Test.Suite) {
                            this._addTestSuiteToTestTree(this._root, this.masterSuite.items[i]);
                        } else if (this.masterSuite.items[i] instanceof Y.Test.Case) {
                            this._addTestCaseToTestTree(this._root, this.masterSuite.items[i]);
                        }                   
                    }            
                
                }, 
            
                //-------------------------------------------------------------------------
                // Private Methods
                //-------------------------------------------------------------------------
                
                /**
                 * Handles the completion of a test object's tests. Tallies test results 
                 * from one level up to the next.
                 * @param {TestNode} node The TestNode representing the test object.
                 * @return {Void}
                 * @method _handleTestObjectComplete
                 * @private
                 */
                _handleTestObjectComplete : function (node /*:TestNode*/) /*:Void*/ {
                    if (Y.lang.isObject(node.testObject)){
                        node.parent.results.passed += node.results.passed;
                        node.parent.results.failed += node.results.failed;
                        node.parent.results.total += node.results.total;                
                        node.parent.results.ignored += node.results.ignored;                
                        node.parent.results[node.testObject.name] = node.results;
                    
                        if (node.testObject instanceof Y.Test.Suite){
                            node.testObject.tearDown();
                            this.fire(this.TEST_SUITE_COMPLETE_EVENT, { testSuite: node.testObject, results: node.results});
                        } else if (node.testObject instanceof Y.Test.Case){
                            this.fire(this.TEST_CASE_COMPLETE_EVENT, { testCase: node.testObject, results: node.results});
                        }      
                    } 
                },                
                
                //-------------------------------------------------------------------------
                // Navigation Methods
                //-------------------------------------------------------------------------
                
                /**
                 * Retrieves the next node in the test tree.
                 * @return {TestNode} The next node in the test tree or null if the end is reached.
                 * @private
                 * @static
                 * @method _next
                 */
                _next : function () /*:TestNode*/ {
                
                    if (this._cur.firstChild) {
                        this._cur = this._cur.firstChild;
                    } else if (this._cur.next) {
                        this._cur = this._cur.next;            
                    } else {
                        while (this._cur && !this._cur.next && this._cur !== this._root){
                            this._handleTestObjectComplete(this._cur);
                            this._cur = this._cur.parent;
                        }
                        
                        if (this._cur == this._root){
                            this._cur.results.type = "report";
                            this._cur.results.timestamp = (new Date()).toLocaleString();
                            this.fire(this.COMPLETE_EVENT, { results: this._cur.results});
                            this._cur = null;
                        } else {
                            this._handleTestObjectComplete(this._cur);               
                            this._cur = this._cur.next;                
                        }
                    }
                
                    return this._cur;
                },
                
                /**
                 * Runs a test case or test suite, returning the results.
                 * @param {Y.Test.Case|Y.Test.Suite} testObject The test case or test suite to run.
                 * @return {Object} Results of the execution with properties passed, failed, and total.
                 * @private
                 * @method _run
                 * @static
                 */
                _run : function () /*:Void*/ {
                
                    //flag to indicate if the TestRunner should wait before continuing
                    var shouldWait /*:Boolean*/ = false;
                    
                    //get the next test node
                    var node = this._next();
                    
                    if (node !== null) {
                        var testObject = node.testObject;
                        
                        //figure out what to do
                        if (Y.lang.isObject(testObject)){
                            if (testObject instanceof Y.Test.Suite){
                                this.fire(this.TEST_SUITE_BEGIN_EVENT, { testSuite: testObject });
                                testObject.setUp();
                            } else if (testObject instanceof Y.Test.Case){
                                this.fire(this.TEST_CASE_BEGIN_EVENT, { testCase: testObject });
                            }
                            
                            //some environments don't support setTimeout
                            if (typeof setTimeout != "undefined"){                    
                                setTimeout(function(){
                                    Y.Test.Runner._run();
                                }, 0);
                            } else {
                                this._run();
                            }
                        } else {
                            this._runTest(node);
                        }
        
                    }
                },
                
                _resumeTest : function (segment /*:Function*/) /*:Void*/ {
                
                    //get relevant information
                    var node /*:TestNode*/ = this._cur;
                    var testName /*:String*/ = node.testObject;
                    var testCase /*:Y.Test.Case*/ = node.parent.testObject;
                    
                    //get the "should" test cases
                    var shouldFail /*:Object*/ = (testCase._should.fail || {})[testName];
                    var shouldError /*:Object*/ = (testCase._should.error || {})[testName];
                    
                    //variable to hold whether or not the test failed
                    var failed /*:Boolean*/ = false;
                    var error /*:Error*/ = null;
                        
                    //try the test
                    try {
                    
                        //run the test
                        segment.apply(testCase);
                        
                        //if it should fail, and it got here, then it's a fail because it didn't
                        if (shouldFail){
                            error = new Y.Assert.ShouldFail();
                            failed = true;
                        } else if (shouldError){
                            error = new Y.Assert.ShouldError();
                            failed = true;
                        }
                                   
                    } catch (thrown /*:Error*/){
                        if (thrown instanceof Y.Assert.Error) {
                            if (!shouldFail){
                                error = thrown;
                                failed = true;
                            }
                        } else if (thrown instanceof Y.Test.Case.Wait){
                        
                            if (Y.lang.isFunction(thrown.segment)){
                                if (Y.lang.isNumber(thrown.delay)){
                                
                                    //some environments don't support setTimeout
                                    if (typeof setTimeout != "undefined"){
                                        setTimeout(function(){
                                            Y.Test.Runner._resumeTest(thrown.segment);
                                        }, thrown.delay);
                                    } else {
                                        throw new Error("Asynchronous tests not supported in this environment.");
                                    }
                                }
                            }
                            
                            return;
                        
                        } else {
                            //first check to see if it should error
                            if (!shouldError) {                        
                                error = new Y.Assert.UnexpectedError(thrown);
                                failed = true;
                            } else {
                                //check to see what type of data we have
                                if (Y.lang.isString(shouldError)){
                                    
                                    //if it's a string, check the error message
                                    if (thrown.message != shouldError){
                                        error = new YAHOO.util.UnexpectedError(thrown);
                                        failed = true;                                    
                                    }
                                } else if (Y.lang.isFunction(shouldError)){
                                
                                    //if it's a function, see if the error is an instance of it
                                    if (!(thrown instanceof shouldError)){
                                        error = new YAHOO.util.UnexpectedError(thrown);
                                        failed = true;
                                    }
                                
                                } else if (Y.lang.isObject(shouldError)){
                                
                                    //if it's an object, check the instance and message
                                    if (!(thrown instanceof shouldError.constructor) || 
                                            thrown.message != shouldError.message){
                                        error = new YAHOO.util.UnexpectedError(thrown);
                                        failed = true;                                    
                                    }
                                
                                }
                            
                            }
                        }
                        
                    }
                    
                    //fire appropriate event
                    if (failed) {
                        this.fire(this.TEST_FAIL_EVENT, { testCase: testCase, testName: testName, error: error });
                    } else {
                        this.fire(this.TEST_PASS_EVENT, { testCase: testCase, testName: testName });
                    }
                    
                    //run the tear down
                    testCase.tearDown();
                    
                    //update results
                    node.parent.results[testName] = { 
                        result: failed ? "fail" : "pass",
                        message: error ? error.getMessage() : "Test passed",
                        type: "test",
                        name: testName
                    };
                    
                    if (failed){
                        node.parent.results.failed++;
                    } else {
                        node.parent.results.passed++;
                    }
                    node.parent.results.total++;
        
                    //set timeout not supported in all environments
                    if (typeof setTimeout != "undefined"){
                        setTimeout(function(){
                            Y.Test.Runner._run();
                        }, 0);
                    } else {
                        this._run();
                    }
                
                },
                        
                /**
                 * Runs a single test based on the data provided in the node.
                 * @param {TestNode} node The TestNode representing the test to run.
                 * @return {Void}
                 * @static
                 * @private
                 * @name _runTest
                 */
                _runTest : function (node /*:TestNode*/) /*:Void*/ {
                
                    //get relevant information
                    var testName /*:String*/ = node.testObject;
                    var testCase /*:Y.Test.Case*/ = node.parent.testObject;
                    var test /*:Function*/ = testCase[testName];
                    
                    //get the "should" test cases
                    var shouldIgnore /*:Object*/ = (testCase._should.ignore || {})[testName];
                    
                    //figure out if the test should be ignored or not
                    if (shouldIgnore){
                    
                        //update results
                        node.parent.results[testName] = { 
                            result: "ignore",
                            message: "Test ignored",
                            type: "test",
                            name: testName
                        };
                        
                        node.parent.results.ignored++;
                        node.parent.results.total++;
                    
                        this.fire(this.TEST_IGNORE_EVENT, { testCase: testCase, testName: testName });
                        
                        //some environments don't support setTimeout
                        if (typeof setTimeout != "undefined"){                    
                            setTimeout(function(){
                                Y.Test.Runner._run();
                            }, 0);              
                        } else {
                            this._run();
                        }
        
                    } else {
                    
                        //run the setup
                        testCase.setUp();
                        
                        //now call the body of the test
                        this._resumeTest(test);                
                    }
        
                },        
                
                //-------------------------------------------------------------------------
                // Protected Methods
                //-------------------------------------------------------------------------   
            
                /*
                 * Fires events for the TestRunner. This overrides the default fire()
                 * method from EventProvider to add the type property to the data that is
                 * passed through on each event call.
                 * @param {String} type The type of event to fire.
                 * @param {Object} data (Optional) Data for the event.
                 * @method fire
                 * @static
                 * @protected
                 */
                fire : function (type /*:String*/, data /*:Object*/) /*:Void*/ {
                    data = data || {};
                    data.type = type;
                    TestRunner.superclass.fire.call(this, type, data);
                },
                
                //-------------------------------------------------------------------------
                // Public Methods
                //-------------------------------------------------------------------------   
            
                /**
                 * Adds a test suite or test case to the list of test objects to run.
                 * @param testObject Either a TestCase or a TestSuite that should be run.
                 * @return {Void}
                 * @method add
                 * @static
                 */
                add : function (testObject /*:Object*/) /*:Void*/ {
                    this.masterSuite.add(testObject);
                },
                
                /**
                 * Removes all test objects from the runner.
                 * @return {Void}
                 * @method clear
                 * @static
                 */
                clear : function () /*:Void*/ {
                    this.masterSuite.items = [];
                },
                
                /**
                 * Resumes the TestRunner after wait() was called.
                 * @param {Function} segment The function to run as the rest
                 *      of the haulted test.
                 * @return {Void}
                 * @method resume
                 * @static
                 */
                resume : function (segment /*:Function*/) /*:Void*/ {
                    this._resumeTest(segment || function(){});
                },
            
                /**
                 * Runs the test suite.
                 * @return {Void}
                 * @method run
                 * @static
                 */
                run : function (testObject /*:Object*/) /*:Void*/ {
                    
                    //pointer to runner to avoid scope issues 
                    var runner = Y.Test.Runner;
        
                    //build the test tree
                    runner._buildTestTree();
                    
                    //fire the begin event
                    runner.fire(runner.BEGIN_EVENT);
               
                    //begin the testing
                    runner._run();
                }    
            });
            
            return new TestRunner();
            
        })();
    };
    
    YUI.add("testrunner", M, "3.0.0", { requires: ["event"] });
})();

(function(){

    var M = function(Y){
        
        /**
         * The Assert object provides functions to test JavaScript values against
         * known and expected results. Whenever a comparison (assertion) fails,
         * an error is thrown.
         *
         * @namespace Y
         * @class Assert
         * @static
         */
        Y.Assert = {
        
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
            _formatMessage : function (customMessage /*:String*/, defaultMessage /*:String*/) /*:String*/ {
                var message = customMessage;
                if (Y.lang.isString(customMessage) && customMessage.length > 0){
                    return Y.lang.substitute(customMessage, { message: defaultMessage });
                } else {
                    return defaultMessage;
                }        
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
            fail : function (message /*:String*/) /*:Void*/ {
                throw new Y.Assert.Error(this._formatMessage(message, "Test force-failed."));
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
            areEqual : function (expected /*:Object*/, actual /*:Object*/, message /*:String*/) /*:Void*/ {
                if (expected != actual) {
                    throw new Y.Assert.ComparisonFailure(this._formatMessage(message, "Values should be equal."), expected, actual);
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
            areNotEqual : function (unexpected /*:Object*/, actual /*:Object*/, 
                                 message /*:String*/) /*:Void*/ {
                if (unexpected == actual) {
                    throw new Y.Assert.UnexpectedValue(this._formatMessage(message, "Values should not be equal."), unexpected);
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
            areNotSame : function (unexpected /*:Object*/, actual /*:Object*/, message /*:String*/) /*:Void*/ {
                if (unexpected === actual) {
                    throw new Y.Assert.UnexpectedValue(this._formatMessage(message, "Values should not be the same."), unexpected);
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
            areSame : function (expected /*:Object*/, actual /*:Object*/, message /*:String*/) /*:Void*/ {
                if (expected !== actual) {
                    throw new Y.Assert.ComparisonFailure(this._formatMessage(message, "Values should be the same."), expected, actual);
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
            isFalse : function (actual /*:Boolean*/, message /*:String*/) {
                if (false !== actual) {
                    throw new Y.Assert.ComparisonFailure(this._formatMessage(message, "Value should be false."), false, actual);
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
            isTrue : function (actual /*:Boolean*/, message /*:String*/) /*:Void*/ {
                if (true !== actual) {
                    throw new Y.Assert.ComparisonFailure(this._formatMessage(message, "Value should be true."), true, actual);
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
            isNaN : function (actual /*:Object*/, message /*:String*/) /*:Void*/{
                if (!isNaN(actual)){
                    throw new Y.Assert.ComparisonFailure(this._formatMessage(message, "Value should be NaN."), NaN, actual);
                }    
            },
            
            /**
             * Asserts that a value is not the special NaN value.
             * @param {Object} actual The value to test.
             * @param {String} message (Optional) The message to display if the assertion fails.
             * @method isNotNaN
             * @static
             */
            isNotNaN : function (actual /*:Object*/, message /*:String*/) /*:Void*/{
                if (isNaN(actual)){
                    throw new Y.Assert.UnexpectedValue(this._formatMessage(message, "Values should not be NaN."), NaN);
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
            isNotNull : function (actual /*:Object*/, message /*:String*/) /*:Void*/ {
                if (Y.lang.isNull(actual)) {
                    throw new Y.Assert.UnexpectedValue(this._formatMessage(message, "Values should not be null."), null);
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
            isNotUndefined : function (actual /*:Object*/, message /*:String*/) /*:Void*/ {
                if (Y.lang.isUndefined(actual)) {
                    throw new Y.Assert.UnexpectedValue(this._formatMessage(message, "Value should not be undefined."), undefined);
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
            isNull : function (actual /*:Object*/, message /*:String*/) /*:Void*/ {
                if (!Y.lang.isNull(actual)) {
                    throw new Y.Assert.ComparisonFailure(this._formatMessage(message, "Value should be null."), null, actual);
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
            isUndefined : function (actual /*:Object*/, message /*:String*/) /*:Void*/ {
                if (!Y.lang.isUndefined(actual)) {
                    throw new Y.Assert.ComparisonFailure(this._formatMessage(message, "Value should be undefined."), undefined, actual);
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
            isArray : function (actual /*:Object*/, message /*:String*/) /*:Void*/ {
                if (!Y.lang.isArray(actual)){
                    throw new Y.Assert.UnexpectedValue(this._formatMessage(message, "Value should be an array."), actual);
                }    
            },
           
            /**
             * Asserts that a value is a Boolean.
             * @param {Object} actual The value to test.
             * @param {String} message (Optional) The message to display if the assertion fails.
             * @method isBoolean
             * @static
             */
            isBoolean : function (actual /*:Object*/, message /*:String*/) /*:Void*/ {
                if (!Y.lang.isBoolean(actual)){
                    throw new Y.Assert.UnexpectedValue(this._formatMessage(message, "Value should be a Boolean."), actual);
                }    
            },
           
            /**
             * Asserts that a value is a function.
             * @param {Object} actual The value to test.
             * @param {String} message (Optional) The message to display if the assertion fails.
             * @method isFunction
             * @static
             */
            isFunction : function (actual /*:Object*/, message /*:String*/) /*:Void*/ {
                if (!Y.lang.isFunction(actual)){
                    throw new Y.Assert.UnexpectedValue(this._formatMessage(message, "Value should be a function."), actual);
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
            isInstanceOf : function (expected /*:Function*/, actual /*:Object*/, message /*:String*/) /*:Void*/ {
                if (!(actual instanceof expected)){
                    throw new Y.Assert.ComparisonFailure(this._formatMessage(message, "Value isn't an instance of expected type."), expected, actual);
                }
            },
            
            /**
             * Asserts that a value is a number.
             * @param {Object} actual The value to test.
             * @param {String} message (Optional) The message to display if the assertion fails.
             * @method isNumber
             * @static
             */
            isNumber : function (actual /*:Object*/, message /*:String*/) /*:Void*/ {
                if (!Y.lang.isNumber(actual)){
                    throw new Y.Assert.UnexpectedValue(this._formatMessage(message, "Value should be a number."), actual);
                }    
            },    
            
            /**
             * Asserts that a value is an object.
             * @param {Object} actual The value to test.
             * @param {String} message (Optional) The message to display if the assertion fails.
             * @method isObject
             * @static
             */
            isObject : function (actual /*:Object*/, message /*:String*/) /*:Void*/ {
                if (!Y.lang.isObject(actual)){
                    throw new Y.Assert.UnexpectedValue(this._formatMessage(message, "Value should be an object."), actual);
                }
            },
            
            /**
             * Asserts that a value is a string.
             * @param {Object} actual The value to test.
             * @param {String} message (Optional) The message to display if the assertion fails.
             * @method isString
             * @static
             */
            isString : function (actual /*:Object*/, message /*:String*/) /*:Void*/ {
                if (!Y.lang.isString(actual)){
                    throw new Y.Assert.UnexpectedValue(this._formatMessage(message, "Value should be a string."), actual);
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
            isTypeOf : function (expectedType /*:String*/, actualValue /*:Object*/, message /*:String*/) /*:Void*/{
                if (typeof actualValue != expectedType){
                    throw new Y.Assert.ComparisonFailure(this._formatMessage(message, "Value should be of type " + expected + "."), expected, typeof actual);
                }
            }
        };
        
        //-----------------------------------------------------------------------------
        // Assertion errors
        //-----------------------------------------------------------------------------
        
        /**
         * Error is thrown whenever an assertion fails. It provides methods
         * to more easily get at error information and also provides a base class
         * from which more specific assertion errors can be derived.
         *
         * @param {String} message The message to display when the error occurs.
         * @namespace Y
         * @class Error
         * @extends Error
         * @constructor
         */ 
        Y.Assert.Error = function (message /*:String*/){
        
            //call superclass
            arguments.callee.superclass.constructor.call(this, message);
            
            /*
             * Error message. Must be duplicated to ensure browser receives it.
             * @type String
             * @property message
             */
            this.message /*:String*/ = message;
            
            /**
             * The name of the error that occurred.
             * @type String
             * @property name
             */
            this.name /*:String*/ = "Assert Error";
        };
        
        //inherit methods
        Y.extend(Y.Assert.Error, Error, {
        
            /**
             * Returns a fully formatted error for an assertion failure. This should
             * be overridden by all subclasses to provide specific information.
             * @method getMessage
             * @return {String} A string describing the error.
             */
            getMessage : function () /*:String*/ {
                return this.message;
            },
            
            /**
             * Returns a string representation of the error.
             * @method toString
             * @return {String} A string representation of the error.
             */
            toString : function () /*:String*/ {
                return this.name + ": " + this.getMessage();
            },
            
            /**
             * Returns a primitive value version of the error. Same as toString().
             * @method valueOf
             * @return {String} A primitive value version of the error.
             */
            valueOf : function () /*:String*/ {
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
         * @namespace Y
         * @extends Y.Assert.Error
         * @class ComparisonFailure
         * @constructor
         */ 
        Y.Assert.ComparisonFailure = function (message /*:String*/, expected /*:Object*/, actual /*:Object*/){
        
            //call superclass
            arguments.callee.superclass.constructor.call(this, message);
            
            /**
             * The expected value.
             * @type Object
             * @property expected
             */
            this.expected /*:Object*/ = expected;
            
            /**
             * The actual value.
             * @type Object
             * @property actual
             */
            this.actual /*:Object*/ = actual;
            
            /**
             * The name of the error that occurred.
             * @type String
             * @property name
             */
            this.name /*:String*/ = "ComparisonFailure";
            
        };
        
        //inherit methods
        Y.extend(Y.Assert.ComparisonFailure, Y.Assert.Error, {
        
            /**
             * Returns a fully formatted error for an assertion failure. This message
             * provides information about the expected and actual values.
             * @method toString
             * @return {String} A string describing the error.
             */
            getMessage : function () /*:String*/ {
                return this.message + "\nExpected: " + this.expected + " (" + (typeof this.expected) + ")"  +
                    "\nActual:" + this.actual + " (" + (typeof this.actual) + ")";
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
         * @namespace Y
         * @extends Y.Assert.Error
         * @class UnexpectedValue
         * @constructor
         */ 
        Y.Assert.UnexpectedValue = function (message /*:String*/, unexpected /*:Object*/){
        
            //call superclass
            arguments.callee.superclass.constructor.call(this, message);
            
            /**
             * The unexpected value.
             * @type Object
             * @property unexpected
             */
            this.unexpected /*:Object*/ = unexpected;
            
            /**
             * The name of the error that occurred.
             * @type String
             * @property name
             */
            this.name /*:String*/ = "UnexpectedValue";
            
        };
        
        //inherit methods
        Y.extend(Y.Assert.UnexpectedValue, Y.Assert.Error, {
        
            /**
             * Returns a fully formatted error for an assertion failure. The message
             * contains information about the unexpected value that was encountered.
             * @method getMessage
             * @return {String} A string describing the error.
             */
            getMessage : function () /*:String*/ {
                return this.message + "\nUnexpected: " + this.unexpected + " (" + (typeof this.unexpected) + ") ";
            }
        
        });
        
        /**
         * ShouldFail is subclass of Error that is thrown whenever
         * a test was expected to fail but did not.
         *
         * @param {String} message The message to display when the error occurs.
         * @namespace Y
         * @extends Y.Assert.Error
         * @class ShouldFail
         * @constructor
         */  
        Y.Assert.ShouldFail = function (message /*:String*/){
        
            //call superclass
            arguments.callee.superclass.constructor.call(this, message || "This test should fail but didn't.");
            
            /**
             * The name of the error that occurred.
             * @type String
             * @property name
             */
            this.name /*:String*/ = "ShouldFail";
            
        };
        
        //inherit methods
        Y.extend(Y.Assert.ShouldFail, Y.Assert.Error);
        
        /**
         * ShouldError is subclass of Error that is thrown whenever
         * a test is expected to throw an error but doesn't.
         *
         * @param {String} message The message to display when the error occurs.
         * @namespace Y
         * @extends Y.Assert.Error
         * @class ShouldError
         * @constructor
         */  
        Y.Assert.ShouldError = function (message /*:String*/){
        
            //call superclass
            arguments.callee.superclass.constructor.call(this, message || "This test should have thrown an error but didn't.");
            
            /**
             * The name of the error that occurred.
             * @type String
             * @property name
             */
            this.name /*:String*/ = "ShouldError";
            
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
         * @namespace Y
         * @extends Y.Assert.Error
         * @class UnexpectedError
         * @constructor
         */  
        Y.Assert.UnexpectedError = function (cause /*:Object*/){
        
            //call superclass
            arguments.callee.superclass.constructor.call(this, "Unexpected error: " + cause.message);
            
            /**
             * The unexpected error that occurred.
             * @type Error
             * @property cause
             */
            this.cause /*:Error*/ = cause;
            
            /**
             * The name of the error that occurred.
             * @type String
             * @property name
             */
            this.name /*:String*/ = "UnexpectedError";
            
            /**
             * Stack information for the error (if provided).
             * @type String
             * @property stack
             */
            this.stack /*:String*/ = cause.stack;
            
        };
        
        //inherit methods
        Y.extend(Y.Assert.UnexpectedError, Y.Assert.Error);
    };
    
    YUI.add("assert", M, "3.0.0");
})();

(function(){

    var M = function(Y){
    
        var Assert = Y.Assert;
        
        /**
         * The ArrayAssert object provides functions to test JavaScript array objects
         * for a variety of cases.
         *
         * @namespace YAHOO.util
         * @class ArrayAssert
         * @static
         */
         
        Y.ArrayAssert = {
        
            /**
             * Asserts that a value is present in an array. This uses the triple equals 
             * sign so no type cohersion may occur.
             * @param {Object} needle The value that is expected in the array.
             * @param {Array} haystack An array of values.
             * @param {String} message (Optional) The message to display if the assertion fails.
             * @method contains
             * @static
             */
            contains : function (needle /*:Object*/, haystack /*:Array*/, 
                                   message /*:String*/) /*:Void*/ {
                
                var found /*:Boolean*/ = false;
                
                //begin checking values
                for (var i=0; i < haystack.length && !found; i++){
                    if (haystack[i] === needle) {
                        found = true;
                    }
                }
                
                if (!found){
                    Assert.fail(Assert._formatMessage(message, "Value " + needle + " (" + (typeof needle) + ") not found in array [" + haystack + "]."));
                }
            },
        
            /**
             * Asserts that a set of values are present in an array. This uses the triple equals 
             * sign so no type cohersion may occur. For this assertion to pass, all values must
             * be found.
             * @param {Object[]} needles An array of values that are expected in the array.
             * @param {Array} haystack An array of values to check.
             * @param {String} message (Optional) The message to display if the assertion fails.
             * @method containsItems
             * @static
             */
            containsItems : function (needles /*:Object[]*/, haystack /*:Array*/, 
                                   message /*:String*/) /*:Void*/ {
        
                //begin checking values
                for (var i=0; i < needles.length; i++){
                    this.contains(needles[i], haystack, message);
                }
            },
        
            /**
             * Asserts that a value matching some condition is present in an array. This uses
             * a function to determine a match.
             * @param {Function} matcher A function that returns true if the items matches or false if not.
             * @param {Array} haystack An array of values.
             * @param {String} message (Optional) The message to display if the assertion fails.
             * @method containsMatch
             * @static
             */
            containsMatch : function (matcher /*:Function*/, haystack /*:Array*/, 
                                   message /*:String*/) /*:Void*/ {
                
                //check for valid matcher
                if (typeof matcher != "function"){
                    throw new TypeError("ArrayAssert.containsMatch(): First argument must be a function.");
                }
                
                var found /*:Boolean*/ = false;
                
                //begin checking values
                for (var i=0; i < haystack.length && !found; i++){
                    if (matcher(haystack[i])) {
                        found = true;
                    }
                }
                
                if (!found){
                    Assert.fail(Assert._formatMessage(message, "No match found in array [" + haystack + "]."));
                }
            },
        
            /**
             * Asserts that a value is not present in an array. This uses the triple equals 
             * sign so no type cohersion may occur.
             * @param {Object} needle The value that is expected in the array.
             * @param {Array} haystack An array of values.
             * @param {String} message (Optional) The message to display if the assertion fails.
             * @method doesNotContain
             * @static
             */
            doesNotContain : function (needle /*:Object*/, haystack /*:Array*/, 
                                   message /*:String*/) /*:Void*/ {
                
                var found /*:Boolean*/ = false;
                
                //begin checking values
                for (var i=0; i < haystack.length && !found; i++){
                    if (haystack[i] === needle) {
                        found = true;
                    }
                }
                
                if (found){
                    Assert.fail(Assert._formatMessage(message, "Value found in array [" + haystack + "]."));
                }
            },
        
            /**
             * Asserts that a set of values are not present in an array. This uses the triple equals 
             * sign so no type cohersion may occur. For this assertion to pass, all values must
             * not be found.
             * @param {Object[]} needles An array of values that are not expected in the array.
             * @param {Array} haystack An array of values to check.
             * @param {String} message (Optional) The message to display if the assertion fails.
             * @method doesNotContainItems
             * @static
             */
            doesNotContainItems : function (needles /*:Object[]*/, haystack /*:Array*/, 
                                   message /*:String*/) /*:Void*/ {
        
                for (var i=0; i < needles.length; i++){
                    this.doesNotContain(needles[i], haystack, message);
                }
        
            },
                
            /**
             * Asserts that no values matching a condition are present in an array. This uses
             * a function to determine a match.
             * @param {Function} matcher A function that returns true if the items matches or false if not.
             * @param {Array} haystack An array of values.
             * @param {String} message (Optional) The message to display if the assertion fails.
             * @method doesNotContainMatch
             * @static
             */
            doesNotContainMatch : function (matcher /*:Function*/, haystack /*:Array*/, 
                                   message /*:String*/) /*:Void*/ {
                
                //check for valid matcher
                if (typeof matcher != "function"){
                    throw new TypeError("ArrayAssert.doesNotContainMatch(): First argument must be a function.");
                }
        
                var found /*:Boolean*/ = false;
                
                //begin checking values
                for (var i=0; i < haystack.length && !found; i++){
                    if (matcher(haystack[i])) {
                        found = true;
                    }
                }
                
                if (found){
                    Assert.fail(Assert._formatMessage(message, "Value found in array [" + haystack + "]."));
                }
            },
                
            /**
             * Asserts that the given value is contained in an array at the specified index.
             * This uses the triple equals sign so no type cohersion will occur.
             * @param {Object} needle The value to look for.
             * @param {Array} haystack The array to search in.
             * @param {int} index The index at which the value should exist.
             * @param {String} message (Optional) The message to display if the assertion fails.
             * @method indexOf
             * @static
             */
            indexOf : function (needle /*:Object*/, haystack /*:Array*/, index /*:int*/, message /*:String*/) /*:Void*/ {
            
                //try to find the value in the array
                for (var i=0; i < haystack.length; i++){
                    if (haystack[i] === needle){
                        Assert.areEqual(index, i, message || "Value exists at index " + i + " but should be at index " + index + ".");
                        return;
                    }
                }
                
                //if it makes it here, it wasn't found at all
                Assert.fail(Assert._formatMessage(message, "Value doesn't exist in array [" + haystack + "]."));
            },
                
            /**
             * Asserts that the values in an array are equal, and in the same position,
             * as values in another array. This uses the double equals sign
             * so type cohersion may occur. Note that the array objects themselves
             * need not be the same for this test to pass.
             * @param {Array} expected An array of the expected values.
             * @param {Array} actual Any array of the actual values.
             * @param {String} message (Optional) The message to display if the assertion fails.
             * @method itemsAreEqual
             * @static
             */
            itemsAreEqual : function (expected /*:Array*/, actual /*:Array*/, 
                                   message /*:String*/) /*:Void*/ {
                
                //one may be longer than the other, so get the maximum length
                var len /*:int*/ = Math.max(expected.length, actual.length);
               
                //begin checking values
                for (var i=0; i < len; i++){
                    Assert.areEqual(expected[i], actual[i], 
                        Assert._formatMessage(message, "Values in position " + i + " are not equal."));
                }
            },
            
            /**
             * Asserts that the values in an array are equivalent, and in the same position,
             * as values in another array. This uses a function to determine if the values
             * are equivalent. Note that the array objects themselves
             * need not be the same for this test to pass.
             * @param {Array} expected An array of the expected values.
             * @param {Array} actual Any array of the actual values.
             * @param {Function} comparator A function that returns true if the values are equivalent
             *      or false if not.
             * @param {String} message (Optional) The message to display if the assertion fails.
             * @return {Void}
             * @method itemsAreEquivalent
             * @static
             */
            itemsAreEquivalent : function (expected /*:Array*/, actual /*:Array*/, 
                                   comparator /*:Function*/, message /*:String*/) /*:Void*/ {
                
                //make sure the comparator is valid
                if (typeof comparator != "function"){
                    throw new TypeError("ArrayAssert.itemsAreEquivalent(): Third argument must be a function.");
                }
                
                //one may be longer than the other, so get the maximum length
                var len /*:int*/ = Math.max(expected.length, actual.length);
                
                //begin checking values
                for (var i=0; i < len; i++){
                    if (!comparator(expected[i], actual[i])){
                        throw new Y.Assert.ComparisonFailure(YAHOO.util.Assert._formatMessage(message, "Values in position " + i + " are not equivalent."), expected[i], actual[i]);
                    }
                }
            },
            
            /**
             * Asserts that an array is empty.
             * @param {Array} actual The array to test.
             * @param {String} message (Optional) The message to display if the assertion fails.
             * @method isEmpty
             * @static
             */
            isEmpty : function (actual /*:Array*/, message /*:String*/) /*:Void*/ {        
                if (actual.length > 0){
                    Assert.fail(Assert._formatMessage(message, "Array should be empty."));
                }
            },    
            
            /**
             * Asserts that an array is not empty.
             * @param {Array} actual The array to test.
             * @param {String} message (Optional) The message to display if the assertion fails.
             * @method isNotEmpty
             * @static
             */
            isNotEmpty : function (actual /*:Array*/, message /*:String*/) /*:Void*/ {        
                if (actual.length === 0){
                    Assert.fail(Assert._formatMessage(message, "Array should not be empty."));
                }
            },    
            
            /**
             * Asserts that the values in an array are the same, and in the same position,
             * as values in another array. This uses the triple equals sign
             * so no type cohersion will occur. Note that the array objects themselves
             * need not be the same for this test to pass.
             * @param {Array} expected An array of the expected values.
             * @param {Array} actual Any array of the actual values.
             * @param {String} message (Optional) The message to display if the assertion fails.
             * @method itemsAreSame
             * @static
             */
            itemsAreSame : function (expected /*:Array*/, actual /*:Array*/, 
                                  message /*:String*/) /*:Void*/ {
                
                //one may be longer than the other, so get the maximum length
                var len /*:int*/ = Math.max(expected.length, actual.length);
                
                //begin checking values
                for (var i=0; i < len; i++){
                    Assert.areSame(expected[i], actual[i], 
                        Assert._formatMessage(message, "Values in position " + i + " are not the same."));
                }
            },
            
            /**
             * Asserts that the given value is contained in an array at the specified index,
             * starting from the back of the array.
             * This uses the triple equals sign so no type cohersion will occur.
             * @param {Object} needle The value to look for.
             * @param {Array} haystack The array to search in.
             * @param {int} index The index at which the value should exist.
             * @param {String} message (Optional) The message to display if the assertion fails.
             * @method lastIndexOf
             * @static
             */
            lastIndexOf : function (needle /*:Object*/, haystack /*:Array*/, index /*:int*/, message /*:String*/) /*:Void*/ {
            
                //try to find the value in the array
                for (var i=haystack.length; i >= 0; i--){
                    if (haystack[i] === needle){
                        Assert.areEqual(index, i, Assert._formatMessage(message, "Value exists at index " + i + " but should be at index " + index + "."));
                        return;
                    }
                }
                
                //if it makes it here, it wasn't found at all
                Assert.fail(Assert._formatMessage(message, "Value doesn't exist in array."));        
            }
            
        };
    };
    
    YUI.add("arrayassert", M, "3.0.0");
})();

(function(){

    var M = function(Y){
    
        var Assert = Y.Assert;

        /**
         * The ObjectAssert object provides functions to test JavaScript objects
         * for a variety of cases.
         *
         * @namespace YAHOO.util
         * @class ObjectAssert
         * @static
         */
        Y.ObjectAssert = {
                
            /**
             * Asserts that all properties in the object exist in another object.
             * @param {Object} expected An object with the expected properties.
             * @param {Object} actual An object with the actual properties.
             * @param {String} message (Optional) The message to display if the assertion fails.
             * @method propertiesAreEqual
             * @static
             */
            propertiesAreEqual : function (expected /*:Object*/, actual /*:Object*/, 
                                   message /*:String*/) /*:Void*/ {
                
                //get all properties in the object
                var properties /*:Array*/ = [];        
                for (var property in expected){
                    properties.push(property);
                }
                
                //see if the properties are in the expected object
                for (var i=0; i < properties.length; i++){
                    Assert.isNotUndefined(actual[properties[i]], 
                        Assert._formatMessage(message, "Property '" + properties[i] + "' expected."));
                }
        
            },
            
            /**
             * Asserts that an object has a property with the given name.
             * @param {String} propertyName The name of the property to test.
             * @param {Object} object The object to search.
             * @param {String} message (Optional) The message to display if the assertion fails.
             * @method hasProperty
             * @static
             */    
            hasProperty : function (propertyName /*:String*/, object /*:Object*/, message /*:String*/) /*:Void*/ {
                if (!(propertyName in object)){
                    Assert.fail(Assert._formatMessage(message, "Property '" + propertyName + "' not found on object."));
                }    
            },
            
            /**
             * Asserts that a property with the given name exists on an object instance (not on its prototype).
             * @param {String} propertyName The name of the property to test.
             * @param {Object} object The object to search.
             * @param {String} message (Optional) The message to display if the assertion fails.
             * @method hasProperty
             * @static
             */    
            hasOwnProperty : function (propertyName /*:String*/, object /*:Object*/, message /*:String*/) /*:Void*/ {
                if (!Y.object.owns(object, propertyName)){
                    Assert.fail(Assert._formatMessage(message, "Property '" + propertyName + "' not found on object instance."));
                }     
            }
        };

    };
    
    YUI.add("objectassert", M, "3.0.0");
    
})();

(function(){

    var M = function(Y){
    
        var Assert = Y.Assert;
        
        /**
         * The DateAssert object provides functions to test JavaScript Date objects
         * for a variety of cases.
         *
         * @namespace YAHOO.util
         * @class DateAssert
         * @static
         */
         
        Y.DateAssert = {
        
            /**
             * Asserts that a date's month, day, and year are equal to another date's.
             * @param {Date} expected The expected date.
             * @param {Date} actual The actual date to test.
             * @param {String} message (Optional) The message to display if the assertion fails.
             * @method datesAreEqual
             * @static
             */
            datesAreEqual : function (expected /*:Date*/, actual /*:Date*/, message /*:String*/){
                if (expected instanceof Date && actual instanceof Date){
                    Assert.areEqual(expected.getFullYear(), actual.getFullYear(), Assert._formatMessage(message, "Years should be equal."));
                    Assert.areEqual(expected.getMonth(), actual.getMonth(), Assert._formatMessage(message, "Months should be equal."));
                    Assert.areEqual(expected.getDate(), actual.getDate(), Assert._formatMessage(message, "Day of month should be equal."));
                } else {
                    throw new TypeError("DateAssert.datesAreEqual(): Expected and actual values must be Date objects.");
                }
            },
        
            /**
             * Asserts that a date's hour, minutes, and seconds are equal to another date's.
             * @param {Date} expected The expected date.
             * @param {Date} actual The actual date to test.
             * @param {String} message (Optional) The message to display if the assertion fails.
             * @method timesAreEqual
             * @static
             */
            timesAreEqual : function (expected /*:Date*/, actual /*:Date*/, message /*:String*/){
                if (expected instanceof Date && actual instanceof Date){
                    Assert.areEqual(expected.getHours(), actual.getHours(), Assert._formatMessage(message, "Hours should be equal."));
                    Assert.areEqual(expected.getMinutes(), actual.getMinutes(), Assert._formatMessage(message, "Minutes should be equal."));
                    Assert.areEqual(expected.getSeconds(), actual.getSeconds(), Assert._formatMessage(message, "Seconds should be equal."));
                } else {
                    throw new TypeError("DateAssert.timesAreEqual(): Expected and actual values must be Date objects.");
                }
            }
            
        };
    };
    
    YUI.add("dateassert", M, "3.0.0");
    
})();

(function(){

    var M = function(Y){

        /**
         * The UserAction object provides functions that simulate events occurring in
         * the browser. Since these are simulated events, they do not behave exactly
         * as regular, user-initiated events do, but can be used to test simple
         * user interactions safely.
         *
         * @namespace YAHOO.util
         * @class UserAction
         * @static
         */
        Y.UserAction = {
        
            //--------------------------------------------------------------------------
            // Generic event methods
            //--------------------------------------------------------------------------
        
            /**
             * Simulates a key event using the given event information to populate
             * the generated event object. This method does browser-equalizing
             * calculations to account for differences in the DOM and IE event models
             * as well as different browser quirks. Note: keydown causes Safari 2.x to
             * crash.
             * @method simulateKeyEvent
             * @private
             * @static
             * @param {HTMLElement} target The target of the given event.
             * @param {String} type The type of event to fire. This can be any one of
             *      the following: keyup, keydown, and keypress.
             * @param {Boolean} bubbles (Optional) Indicates if the event can be
             *      bubbled up. DOM Level 3 specifies that all key events bubble by
             *      default. The default is true.
             * @param {Boolean} cancelable (Optional) Indicates if the event can be
             *      canceled using preventDefault(). DOM Level 3 specifies that all
             *      key events can be cancelled. The default 
             *      is true.
             * @param {Window} view (Optional) The view containing the target. This is
             *      typically the window object. The default is window.
             * @param {Boolean} ctrlKey (Optional) Indicates if one of the CTRL keys
             *      is pressed while the event is firing. The default is false.
             * @param {Boolean} altKey (Optional) Indicates if one of the ALT keys
             *      is pressed while the event is firing. The default is false.
             * @param {Boolean} shiftKey (Optional) Indicates if one of the SHIFT keys
             *      is pressed while the event is firing. The default is false.
             * @param {Boolean} metaKey (Optional) Indicates if one of the META keys
             *      is pressed while the event is firing. The default is false.
             * @param {int} keyCode (Optional) The code for the key that is in use. 
             *      The default is 0.
             * @param {int} charCode (Optional) The Unicode code for the character
             *      associated with the key being used. The default is 0.
             */
            simulateKeyEvent : function (target /*:HTMLElement*/, type /*:String*/, 
                                         bubbles /*:Boolean*/,  cancelable /*:Boolean*/,    
                                         view /*:Window*/,
                                         ctrlKey /*:Boolean*/,    altKey /*:Boolean*/, 
                                         shiftKey /*:Boolean*/,   metaKey /*:Boolean*/, 
                                         keyCode /*:int*/,        charCode /*:int*/) /*:Void*/                             
            {
                //check target
                if (!Y.lang.isObject(target)){
                    throw new Error("simulateKeyEvent(): Invalid target.");
                }
                
                //check event type
                if (Y.lang.isString(type)){
                    type = type.toLowerCase();
                    switch(type){
                        case "keyup":
                        case "keydown":
                        case "keypress":
                            break;
                        case "textevent": //DOM Level 3
                            type = "keypress";
                            break;
                            // @TODO was the fallthrough intentional, if so throw error
                        default:
                            throw new Error("simulateKeyEvent(): Event type '" + type + "' not supported.");
                    }
                } else {
                    throw new Error("simulateKeyEvent(): Event type must be a string.");
                }
                
                //setup default values
                if (!Y.lang.isBoolean(bubbles)){
                    bubbles = true; //all key events bubble
                }
                if (!Y.lang.isBoolean(cancelable)){
                    cancelable = true; //all key events can be cancelled
                }
                if (!Y.lang.isObject(view)){
                    view = window; //view is typically window
                }
                if (!Y.lang.isBoolean(ctrlKey)){
                    ctrlKey = false;
                }
                if (!Y.lang.isBoolean(altKey)){
                    altKey = false;
                }
                if (!Y.lang.isBoolean(shiftKey)){
                    shiftKey = false;
                }
                if (!Y.lang.isBoolean(metaKey)){
                    metaKey = false;
                }
                if (!Y.lang.isNumber(keyCode)){
                    keyCode = 0;
                }
                if (!Y.lang.isNumber(charCode)){
                    charCode = 0; 
                }
        
                //try to create a mouse event
                var customEvent /*:MouseEvent*/ = null;
                    
                //check for DOM-compliant browsers first
                if (Y.lang.isFunction(document.createEvent)){
                
                    try {
                        
                        //try to create key event
                        customEvent = document.createEvent("KeyEvents");
                        
                        /*
                         * Interesting problem: Firefox implemented a non-standard
                         * version of initKeyEvent() based on DOM Level 2 specs.
                         * Key event was removed from DOM Level 2 and re-introduced
                         * in DOM Level 3 with a different interface. Firefox is the
                         * only browser with any implementation of Key Events, so for
                         * now, assume it's Firefox if the above line doesn't error.
                         */
                        //TODO: Decipher between Firefox's implementation and a correct one.
                        customEvent.initKeyEvent(type, bubbles, cancelable, view, ctrlKey,
                            altKey, shiftKey, metaKey, keyCode, charCode);       
                        
                    } catch (ex /*:Error*/){
        
                        /*
                         * If it got here, that means key events aren't officially supported. 
                         * Safari/WebKit is a real problem now. WebKit 522 won't let you
                         * set keyCode, charCode, or other properties if you use a
                         * UIEvent, so we first must try to create a generic event. The
                         * fun part is that this will throw an error on Safari 2.x. The
                         * end result is that we need another try...catch statement just to
                         * deal with this mess.
                         */
                        try {
        
                            //try to create generic event - will fail in Safari 2.x
                            customEvent = document.createEvent("Events");
        
                        } catch (uierror /*:Error*/){
        
                            //the above failed, so create a UIEvent for Safari 2.x
                            customEvent = document.createEvent("UIEvents");
        
                        } finally {
        
                            customEvent.initEvent(type, bubbles, cancelable);
            
                            //initialize
                            customEvent.view = view;
                            customEvent.altKey = altKey;
                            customEvent.ctrlKey = ctrlKey;
                            customEvent.shiftKey = shiftKey;
                            customEvent.metaKey = metaKey;
                            customEvent.keyCode = keyCode;
                            customEvent.charCode = charCode;
                  
                        }          
                     
                    }
                    
                    //fire the event
                    target.dispatchEvent(customEvent);
        
                } else if (Y.lang.isObject(document.createEventObject)){ //IE
                
                    //create an IE event object
                    customEvent = document.createEventObject();
                    
                    //assign available properties
                    customEvent.bubbles = bubbles;
                    customEvent.cancelable = cancelable;
                    customEvent.view = view;
                    customEvent.ctrlKey = ctrlKey;
                    customEvent.altKey = altKey;
                    customEvent.shiftKey = shiftKey;
                    customEvent.metaKey = metaKey;
                    
                    /*
                     * IE doesn't support charCode explicitly. CharCode should
                     * take precedence over any keyCode value for accurate
                     * representation.
                     */
                    customEvent.keyCode = (charCode > 0) ? charCode : keyCode;
                    
                    //fire the event
                    target.fireEvent("on" + type, customEvent);  
                            
                } else {
                    throw new Error("simulateKeyEvent(): No event simulation framework present.");
                }
            },
        
            /**
             * Simulates a mouse event using the given event information to populate
             * the generated event object. This method does browser-equalizing
             * calculations to account for differences in the DOM and IE event models
             * as well as different browser quirks.
             * @method simulateMouseEvent
             * @private
             * @static
             * @param {HTMLElement} target The target of the given event.
             * @param {String} type The type of event to fire. This can be any one of
             *      the following: click, dblclick, mousedown, mouseup, mouseout,
             *      mouseover, and mousemove.
             * @param {Boolean} bubbles (Optional) Indicates if the event can be
             *      bubbled up. DOM Level 2 specifies that all mouse events bubble by
             *      default. The default is true.
             * @param {Boolean} cancelable (Optional) Indicates if the event can be
             *      canceled using preventDefault(). DOM Level 2 specifies that all
             *      mouse events except mousemove can be cancelled. The default 
             *      is true for all events except mousemove, for which the default 
             *      is false.
             * @param {Window} view (Optional) The view containing the target. This is
             *      typically the window object. The default is window.
             * @param {int} detail (Optional) The number of times the mouse button has
             *      been used. The default value is 1.
             * @param {int} screenX (Optional) The x-coordinate on the screen at which
             *      point the event occured. The default is 0.
             * @param {int} screenY (Optional) The y-coordinate on the screen at which
             *      point the event occured. The default is 0.
             * @param {int} clientX (Optional) The x-coordinate on the client at which
             *      point the event occured. The default is 0.
             * @param {int} clientY (Optional) The y-coordinate on the client at which
             *      point the event occured. The default is 0.
             * @param {Boolean} ctrlKey (Optional) Indicates if one of the CTRL keys
             *      is pressed while the event is firing. The default is false.
             * @param {Boolean} altKey (Optional) Indicates if one of the ALT keys
             *      is pressed while the event is firing. The default is false.
             * @param {Boolean} shiftKey (Optional) Indicates if one of the SHIFT keys
             *      is pressed while the event is firing. The default is false.
             * @param {Boolean} metaKey (Optional) Indicates if one of the META keys
             *      is pressed while the event is firing. The default is false.
             * @param {int} button (Optional) The button being pressed while the event
             *      is executing. The value should be 0 for the primary mouse button
             *      (typically the left button), 1 for the terciary mouse button
             *      (typically the middle button), and 2 for the secondary mouse button
             *      (typically the right button). The default is 0.
             * @param {HTMLElement} relatedTarget (Optional) For mouseout events,
             *      this is the element that the mouse has moved to. For mouseover
             *      events, this is the element that the mouse has moved from. This
             *      argument is ignored for all other events. The default is null.
             */
            simulateMouseEvent : function (target /*:HTMLElement*/, type /*:String*/, 
                                           bubbles /*:Boolean*/,  cancelable /*:Boolean*/,    
                                           view /*:Window*/,        detail /*:int*/, 
                                           screenX /*:int*/,        screenY /*:int*/, 
                                           clientX /*:int*/,        clientY /*:int*/,       
                                           ctrlKey /*:Boolean*/,    altKey /*:Boolean*/, 
                                           shiftKey /*:Boolean*/,   metaKey /*:Boolean*/, 
                                           button /*:int*/,         relatedTarget /*:HTMLElement*/) /*:Void*/
            {
                
                //check target
                if (!Y.lang.isObject(target)){
                    throw new Error("simulateMouseEvent(): Invalid target.");
                }
                
                //check event type
                if (Y.lang.isString(type)){
                    type = type.toLowerCase();
                    switch(type){
                        case "mouseover":
                        case "mouseout":
                        case "mousedown":
                        case "mouseup":
                        case "click":
                        case "dblclick":
                        case "mousemove":
                            break;
                        default:
                            throw new Error("simulateMouseEvent(): Event type '" + type + "' not supported.");
                    }
                } else {
                    throw new Error("simulateMouseEvent(): Event type must be a string.");
                }
                
                //setup default values
                if (!Y.lang.isBoolean(bubbles)){
                    bubbles = true; //all mouse events bubble
                }
                if (!Y.lang.isBoolean(cancelable)){
                    cancelable = (type != "mousemove"); //mousemove is the only one that can't be cancelled
                }
                if (!Y.lang.isObject(view)){
                    view = window; //view is typically window
                }
                if (!Y.lang.isNumber(detail)){
                    detail = 1;  //number of mouse clicks must be at least one
                }
                if (!Y.lang.isNumber(screenX)){
                    screenX = 0; 
                }
                if (!Y.lang.isNumber(screenY)){
                    screenY = 0; 
                }
                if (!Y.lang.isNumber(clientX)){
                    clientX = 0; 
                }
                if (!Y.lang.isNumber(clientY)){
                    clientY = 0; 
                }
                if (!Y.lang.isBoolean(ctrlKey)){
                    ctrlKey = false;
                }
                if (!Y.lang.isBoolean(altKey)){
                    altKey = false;
                }
                if (!Y.lang.isBoolean(shiftKey)){
                    shiftKey = false;
                }
                if (!Y.lang.isBoolean(metaKey)){
                    metaKey = false;
                }
                if (!Y.lang.isNumber(button)){
                    button = 0; 
                }
        
                //try to create a mouse event
                var customEvent /*:MouseEvent*/ = null;
                    
                //check for DOM-compliant browsers first
                if (Y.lang.isFunction(document.createEvent)){
                
                    customEvent = document.createEvent("MouseEvents");
                
                    //Safari 2.x (WebKit 418) still doesn't implement initMouseEvent()
                    if (customEvent.initMouseEvent){
                        customEvent.initMouseEvent(type, bubbles, cancelable, view, detail,
                                             screenX, screenY, clientX, clientY, 
                                             ctrlKey, altKey, shiftKey, metaKey, 
                                             button, relatedTarget);
                    } else { //Safari
                    
                        //the closest thing available in Safari 2.x is UIEvents
                        customEvent = document.createEvent("UIEvents");
                        customEvent.initEvent(type, bubbles, cancelable);
                        customEvent.view = view;
                        customEvent.detail = detail;
                        customEvent.screenX = screenX;
                        customEvent.screenY = screenY;
                        customEvent.clientX = clientX;
                        customEvent.clientY = clientY;
                        customEvent.ctrlKey = ctrlKey;
                        customEvent.altKey = altKey;
                        customEvent.metaKey = metaKey;
                        customEvent.shiftKey = shiftKey;
                        customEvent.button = button;
                        customEvent.relatedTarget = relatedTarget;
                    }
                    
                    /*
                     * Check to see if relatedTarget has been assigned. Firefox
                     * versions less than 2.0 don't allow it to be assigned via
                     * initMouseEvent() and the property is readonly after event
                     * creation, so in order to keep YAHOO.util.getRelatedTarget()
                     * working, assign to the IE proprietary toElement property
                     * for mouseout event and fromElement property for mouseover
                     * event.
                     */
                    if (relatedTarget && !customEvent.relatedTarget){
                        if (type == "mouseout"){
                            customEvent.toElement = relatedTarget;
                        } else if (type == "mouseover"){
                            customEvent.fromElement = relatedTarget;
                        }
                    }
                    
                    //fire the event
                    target.dispatchEvent(customEvent);
        
                } else if (Y.lang.isObject(document.createEventObject)){ //IE
                
                    //create an IE event object
                    customEvent = document.createEventObject();
                    
                    //assign available properties
                    customEvent.bubbles = bubbles;
                    customEvent.cancelable = cancelable;
                    customEvent.view = view;
                    customEvent.detail = detail;
                    customEvent.screenX = screenX;
                    customEvent.screenY = screenY;
                    customEvent.clientX = clientX;
                    customEvent.clientY = clientY;
                    customEvent.ctrlKey = ctrlKey;
                    customEvent.altKey = altKey;
                    customEvent.metaKey = metaKey;
                    customEvent.shiftKey = shiftKey;
        
                    //fix button property for IE's wacky implementation
                    switch(button){
                        case 0:
                            customEvent.button = 1;
                            break;
                        case 1:
                            customEvent.button = 4;
                            break;
                        case 2:
                            //leave as is
                            break;
                        default:
                            customEvent.button = 0;                    
                    }    
        
                    /*
                     * Have to use relatedTarget because IE won't allow assignment
                     * to toElement or fromElement on generic events. This keeps
                     * YAHOO.util.customEvent.getRelatedTarget() functional.
                     */
                    customEvent.relatedTarget = relatedTarget;
                    
                    //fire the event
                    target.fireEvent("on" + type, customEvent);
                            
                } else {
                    throw new Error("simulateMouseEvent(): No event simulation framework present.");
                }
            },
           
            //--------------------------------------------------------------------------
            // Mouse events
            //--------------------------------------------------------------------------
        
            /**
             * Simulates a mouse event on a particular element.
             * @param {HTMLElement} target The element to click on.
             * @param {String} type The type of event to fire. This can be any one of
             *      the following: click, dblclick, mousedown, mouseup, mouseout,
             *      mouseover, and mousemove.
             * @param {Object} options Additional event options (use DOM standard names).
             * @method mouseEvent
             * @static
             */
            fireMouseEvent : function (target /*:HTMLElement*/, type /*:String*/, 
                                   options /*:Object*/) /*:Void*/
            {
                options = options || {};
                this.simulateMouseEvent(target, type, options.bubbles,
                    options.cancelable, options.view, options.detail, options.screenX,        
                    options.screenY, options.clientX, options.clientY, options.ctrlKey,
                    options.altKey, options.shiftKey, options.metaKey, options.button,         
                    options.relatedTarget);        
            },
        
            /**
             * Simulates a click on a particular element.
             * @param {HTMLElement} target The element to click on.
             * @param {Object} options Additional event options (use DOM standard names).
             * @method click
             * @static     
             */
            click : function (target /*:HTMLElement*/, options /*:Object*/) /*:Void*/ {
                this.fireMouseEvent(target, "click", options);
            },
            
            /**
             * Simulates a double click on a particular element.
             * @param {HTMLElement} target The element to double click on.
             * @param {Object} options Additional event options (use DOM standard names).
             * @method dblclick
             * @static
             */
            dblclick : function (target /*:HTMLElement*/, options /*:Object*/) /*:Void*/ {
                this.fireMouseEvent( target, "dblclick", options);
            },
            
            /**
             * Simulates a mousedown on a particular element.
             * @param {HTMLElement} target The element to act on.
             * @param {Object} options Additional event options (use DOM standard names).
             * @method mousedown
             * @static
             */
            mousedown : function (target /*:HTMLElement*/, options /*Object*/) /*:Void*/ {
                this.fireMouseEvent(target, "mousedown", options);
            },
            
            /**
             * Simulates a mousemove on a particular element.
             * @param {HTMLElement} target The element to act on.
             * @param {Object} options Additional event options (use DOM standard names).
             * @method mousemove
             * @static
             */
            mousemove : function (target /*:HTMLElement*/, options /*Object*/) /*:Void*/ {
                this.fireMouseEvent(target, "mousemove", options);
            },
            
            /**
             * Simulates a mouseout event on a particular element. Use "relatedTarget"
             * on the options object to specify where the mouse moved to.
             * Quirks: Firefox less than 2.0 doesn't set relatedTarget properly, so
             * toElement is assigned in its place. IE doesn't allow toElement to be
             * be assigned, so relatedTarget is assigned in its place. Both of these
             * concessions allow YAHOO.util.Event.getRelatedTarget() to work correctly
             * in both browsers.
             * @param {HTMLElement} target The element to act on.
             * @param {Object} options Additional event options (use DOM standard names).
             * @method mouseout
             * @static
             */
            mouseout : function (target /*:HTMLElement*/, options /*Object*/) /*:Void*/ {
                this.fireMouseEvent(target, "mouseout", options);
            },
            
            /**
             * Simulates a mouseover event on a particular element. Use "relatedTarget"
             * on the options object to specify where the mouse moved from.
             * Quirks: Firefox less than 2.0 doesn't set relatedTarget properly, so
             * fromElement is assigned in its place. IE doesn't allow fromElement to be
             * be assigned, so relatedTarget is assigned in its place. Both of these
             * concessions allow YAHOO.util.Event.getRelatedTarget() to work correctly
             * in both browsers.
             * @param {HTMLElement} target The element to act on.
             * @param {Object} options Additional event options (use DOM standard names).
             * @method mouseover
             * @static
             */
            mouseover : function (target /*:HTMLElement*/, options /*Object*/) /*:Void*/ {
                this.fireMouseEvent(target, "mouseover", options);
            },
            
            /**
             * Simulates a mouseup on a particular element.
             * @param {HTMLElement} target The element to act on.
             * @param {Object} options Additional event options (use DOM standard names).
             * @method mouseup
             * @static
             */
            mouseup : function (target /*:HTMLElement*/, options /*Object*/) /*:Void*/ {
                this.fireMouseEvent(target, "mouseup", options);
            },
            
            //--------------------------------------------------------------------------
            // Key events
            //--------------------------------------------------------------------------
        
            /**
             * Fires an event that normally would be fired by the keyboard (keyup,
             * keydown, keypress). Make sure to specify either keyCode or charCode as
             * an option.
             * @private
             * @param {String} type The type of event ("keyup", "keydown" or "keypress").
             * @param {HTMLElement} target The target of the event.
             * @param {Object} options Options for the event. Either keyCode or charCode
             *                         are required.
             * @method fireKeyEvent
             * @static
             */     
            fireKeyEvent : function (type /*:String*/, target /*:HTMLElement*/,
                                     options /*:Object*/) /*:Void*/ 
            {
                options = options || {};
                this.simulateKeyEvent(target, type, options.bubbles,
                    options.cancelable, options.view, options.ctrlKey,
                    options.altKey, options.shiftKey, options.metaKey, 
                    options.keyCode, options.charCode);    
            },
            
            /**
             * Simulates a keydown event on a particular element.
             * @param {HTMLElement} target The element to act on.
             * @param {Object} options Additional event options (use DOM standard names).
             * @method keydown
             * @static
             */
            keydown : function (target /*:HTMLElement*/, options /*:Object*/) /*:Void*/ {
                this.fireKeyEvent("keydown", target, options);
            },
            
            /**
             * Simulates a keypress on a particular element.
             * @param {HTMLElement} target The element to act on.
             * @param {Object} options Additional event options (use DOM standard names).
             * @method keypress
             * @static
             */
            keypress : function (target /*:HTMLElement*/, options /*:Object*/) /*:Void*/ {
                this.fireKeyEvent("keypress", target, options);
            },
            
            /**
             * Simulates a keyup event on a particular element.
             * @param {HTMLElement} target The element to act on.
             * @param {Object} options Additional event options (use DOM standard names).
             * @method keyup
             * @static
             */
            keyup : function (target /*:HTMLElement*/, options /*Object*/) /*:Void*/ {
                this.fireKeyEvent("keyup", target, options);
            }
            
        
        };
    };
    
    YUI.add("useraction", M, "3.0.0");
})();

(function(){

    var M = function(Y){
        
        Y.namespace("Test");

        /**
         * Runs pages containing test suite definitions.
         * @namespace YAHOO.tool
         * @class TestManager
         * @static
         */
        Y.Test.Manager = {
        
            /**
             * Constant for the testpagebegin custom event
             * @property TEST_PAGE_BEGIN_EVENT
             * @static
             * @type string
             * @final
             */
            TEST_PAGE_BEGIN_EVENT /*:String*/ : "testpagebegin",
        
            /**
             * Constant for the testpagecomplete custom event
             * @property TEST_PAGE_COMPLETE_EVENT
             * @static
             * @type string
             * @final
             */
            TEST_PAGE_COMPLETE_EVENT /*:String*/ : "testpagecomplete",
        
            /**
             * Constant for the testmanagerbegin custom event
             * @property TEST_MANAGER_BEGIN_EVENT
             * @static
             * @type string
             * @final
             */
            TEST_MANAGER_BEGIN_EVENT /*:String*/ : "testmanagerbegin",
        
            /**
             * Constant for the testmanagercomplete custom event
             * @property TEST_MANAGER_COMPLETE_EVENT
             * @static
             * @type string
             * @final
             */
            TEST_MANAGER_COMPLETE_EVENT /*:String*/ : "testmanagercomplete",
        
            //-------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------
            
            
            /**
             * The URL of the page currently being executed.
             * @type String
             * @private
             * @property _curPage
             * @static
             */
            _curPage /*:String*/ : null,
            
            /**
             * The frame used to load and run tests.
             * @type Window
             * @private
             * @property _frame
             * @static
             */
            _frame /*:Window*/ : null,
            
            /**
             * The logger used to output results from the various tests.
             * @type YAHOO.tool.TestLogger
             * @private
             * @property _logger
             * @static
             */
            _logger : null,
            
            /**
             * The timeout ID for the next iteration through the tests.
             * @type int
             * @private
             * @property _timeoutId
             * @static
             */
            _timeoutId /*:int*/ : 0,
            
            /**
             * Array of pages to load.
             * @type String[]
             * @private
             * @property _pages
             * @static
             */
            _pages /*:String[]*/ : [],
            
            /**
             * Aggregated results
             * @type Object
             * @private
             * @property _results
             * @static
             */
            _results: null,
            
            //-------------------------------------------------------------------------
            // Private Methods
            //-------------------------------------------------------------------------
            
            /**
             * Handles TestRunner.COMPLETE_EVENT, storing the results and beginning
             * the loop again.
             * @param {Object} data Data about the event.
             * @return {Void}
             * @private
             * @static
             */
            _handleTestRunnerComplete : function (data /*:Object*/) /*:Void*/ {
        
                this.fireEvent(this.TEST_PAGE_COMPLETE_EVENT, {
                        page: this._curPage,
                        results: data.results
                    });
            
                //save results
                //this._results[this.curPage] = data.results;
                
                //process 'em
                this._processResults(this._curPage, data.results);
                
                this._logger.clearTestRunner();
            
                //if there's more to do, set a timeout to begin again
                if (this._pages.length){
                    this._timeoutId = setTimeout(function(){
                        YAHOO.tool.TestManager._run();
                    }, 1000);
                } else {
                    this.fireEvent(this.TEST_MANAGER_COMPLETE_EVENT, this._results);
                }
            },
            
            /**
             * Processes the results of a test page run, outputting log messages
             * for failed tests.
             * @return {Void}
             * @private
             * @static
             */
            _processResults : function (page /*:String*/, results /*:Object*/) /*:Void*/ {
        
                var r = this._results;
                
                r.passed += results.passed;
                r.failed += results.failed;
                r.ignored += results.ignored;
                r.total += results.total;
                
                if (results.failed){
                    r.failedPages.push(page);
                } else {
                    r.passedPages.push(page);
                }
                
                results.name = page;
                results.type = "page";
                
                r[page] = results;
            },
            
            /**
             * Loads the next test page into the iframe.
             * @return {Void}
             * @static
             * @private
             */
            _run : function () /*:Void*/ {
            
                //set the current page
                this._curPage = this._pages.shift();
        
                this.fireEvent(this.TEST_PAGE_BEGIN_EVENT, this._curPage);
                
                //load the frame - destroy history in case there are other iframes that
                //need testing
                this._frame.location.replace(this._curPage);
            
            },
                
            //-------------------------------------------------------------------------
            // Public Methods
            //-------------------------------------------------------------------------
            
            /**
             * Signals that a test page has been loaded. This should be called from
             * within the test page itself to notify the TestManager that it is ready.
             * @return {Void}
             * @static
             */
            load : function () /*:Void*/ {
                if (parent.YAHOO.tool.TestManager !== this){
                    parent.YAHOO.tool.TestManager.load();
                } else {
                    
                    if (this._frame) {
                        //assign event handling
                        var TestRunner = this._frame.YAHOO.tool.TestRunner;
        
                        this._logger.setTestRunner(TestRunner);
                        TestRunner.subscribe(TestRunner.COMPLETE_EVENT, this._handleTestRunnerComplete, this, true);
                        
                        //run it
                        TestRunner.run();
                    }
                }
            },
            
            /**
             * Sets the pages to be loaded.
             * @param {String[]} pages An array of URLs to load.
             * @return {Void}
             * @static
             */
            setPages : function (pages /*:String[]*/) /*:Void*/ {
                this._pages = pages;
            },
            
            /**
             * Begins the process of running the tests.
             * @return {Void}
             * @static
             */
            start : function () /*:Void*/ {
        
                if (!this._initialized) {
        
                    /**
                     * Fires when loading a test page
                     * @event testpagebegin
                     * @param curPage {string} the page being loaded
                     * @static
                     */
                    this.createEvent(this.TEST_PAGE_BEGIN_EVENT);
        
                    /**
                     * Fires when a test page is complete
                     * @event testpagecomplete
                     * @param obj {page: string, results: object} the name of the
                     * page that was loaded, and the test suite results
                     * @static
                     */
                    this.createEvent(this.TEST_PAGE_COMPLETE_EVENT);
        
                    /**
                     * Fires when the test manager starts running all test pages
                     * @event testmanagerbegin
                     * @static
                     */
                    this.createEvent(this.TEST_MANAGER_BEGIN_EVENT);
        
                    /**
                     * Fires when the test manager finishes running all test pages.  External
                     * test runners should subscribe to this event in order to get the
                     * aggregated test results.
                     * @event testmanagercomplete
                     * @param obj { pages_passed: int, pages_failed: int, tests_passed: int
                     *              tests_failed: int, passed: string[], failed: string[],
                     *              page_results: {} }
                     * @static
                     */
                    this.createEvent(this.TEST_MANAGER_COMPLETE_EVENT);
        
                    //create iframe if not already available
                    if (!this._frame){
                        var frame /*:HTMLElement*/ = document.createElement("iframe");
                        frame.style.visibility = "hidden";
                        frame.style.position = "absolute";
                        document.body.appendChild(frame);
                        this._frame = frame.contentWindow || frame.contentDocument.ownerWindow;
                    }
                    
                    //create test logger if not already available
                    if (!this._logger){
                        this._logger = new YAHOO.tool.TestLogger();
                    }
        
                    this._initialized = true;
                }
        
        
                // reset the results cache
                this._results = {
                
                    passed: 0,
                    failed: 0,
                    ignored: 0,
                    total: 0,
                    type: "report",
                    name: "YUI Test Results",
                    failedPages:[],
                    passedPages:[]
                    /*
                    // number of pages that pass
                    pages_passed: 0,
                    // number of pages that fail
                    pages_failed: 0,
                    // total number of tests passed
                    tests_passed: 0,
                    // total number of tests failed
                    tests_failed: 0,
                    // array of pages that passed
                    passed: [],
                    // array of pages that failed
                    failed: [],
                    // map of full results for each page
                    page_results: {}*/
                };
        
                this.fireEvent(this.TEST_MANAGER_BEGIN_EVENT, null);
                this._run();
            
            },
        
            /**
             * Stops the execution of tests.
             * @return {Void}
             * @static
             */
            stop : function () /*:Void*/ {
                clearTimeout(this._timeoutId);
            }
        
        };
        
        Y.mix(Y.Test.Manager, Y.Event.Target.prototype);
        
    };
    
    YUI.add("testmanager", M, "3.0.0");
})();    
    

YUI.add("testconsolelogger", function(Y){

    var TestRunner = Y.Test.Runner;
    
    function handleTestRunnerEvent(data){
        //data variables
        var message /*:String*/ = "";
        var messageType /*:String*/ = "";
        
        switch(data.type){
            case TestRunner.BEGIN_EVENT:
                console.info("Testing began at " + (new Date()).toString() + ".");
                break;
                
            case TestRunner.COMPLETE_EVENT:
                console.info("Testing completed at " + (new Date()).toString() + ".\nPassed:" + 
                    data.results.passed + " Failed:" + data.results.failed + " Total:" + data.results.total);
                break;
                
            case TestRunner.TEST_FAIL_EVENT:
                console.error("FAIL: " + data.testName + ": " + data.error.getMessage());
                break;
                
            case TestRunner.TEST_IGNORE_EVENT:
                console.info(data.testName + ": ignored.");
                break;
                
            case TestRunner.TEST_PASS_EVENT:
                console.warn("PASS: " + data.testName + ": passed.");
                break;
                
            case TestRunner.TEST_SUITE_BEGIN_EVENT:
                console.info("Test suite \"" + data.testSuite.name + "\" started.");
                break;
                
            case TestRunner.TEST_SUITE_COMPLETE_EVENT:
                console.info("Test suite \"" + data.testSuite.name + "\" completed.\nPassed:" + 
                    data.results.passed + " Failed:" + data.results.failed + " Total:" + data.results.total);
                break;
                
            case TestRunner.TEST_CASE_BEGIN_EVENT:
                console.info("Test case \"" + data.testCase.name + "\" started.");
                break;
                
            case TestRunner.TEST_CASE_COMPLETE_EVENT:
                console.info("Test case \"" + data.testCase.name + "\" completed.\nPassed:" + 
                    data.results.passed + " Failed:" + data.results.failed + " Total:" + data.results.total);
                break;
        }
    
        YAHOO.log(message, messageType, "TestRunner");       
    
    
    }
    
    TestRunner.subscribe(TestRunner.TEST_PASS_EVENT, handleTestRunnerEvent);
    TestRunner.subscribe(TestRunner.TEST_FAIL_EVENT, handleTestRunnerEvent);
    TestRunner.subscribe(TestRunner.TEST_IGNORE_EVENT, handleTestRunnerEvent);
    TestRunner.subscribe(TestRunner.BEGIN_EVENT, handleTestRunnerEvent);
    TestRunner.subscribe(TestRunner.COMPLETE_EVENT, handleTestRunnerEvent);
    TestRunner.subscribe(TestRunner.TEST_SUITE_BEGIN_EVENT, handleTestRunnerEvent);
    TestRunner.subscribe(TestRunner.TEST_SUITE_COMPLETE_EVENT, handleTestRunnerEvent);
    TestRunner.subscribe(TestRunner.TEST_CASE_BEGIN_EVENT, handleTestRunnerEvent);
    TestRunner.subscribe(TestRunner.TEST_CASE_COMPLETE_EVENT, handleTestRunnerEvent);



}, "3.0.0", { use: ["testrunner"] });

(function(){

    var M = function(Y){
        
        Y.namespace("Test.Format");
        
        /**
         * Returns test results formatted as a JSON string. Requires JSON utility.
         * @param {Object} result The results object created by TestRunner.
         * @return {String} An XML-formatted string of results.
         * @namespace YAHOO.tool.TestFormat
         * @method JSON
         * @static
         */
        Y.Test.Format.JSON = function(results /*:Object*/) /*:String*/ {
            //TODO: Implement
            //return YAHOO.lang.JSON.stringify(results);
        };
        
        /**
         * Returns test results formatted as an XML string.
         * @param {Object} result The results object created by TestRunner.
         * @return {String} An XML-formatted string of results.
         * @namespace YAHOO.tool.TestFormat
         * @method XML
         * @static
         */
        Y.Test.Format.XML = function(results /*:Object*/) /*:String*/ {
        
            var l = Y.lang;
            var xml /*:String*/ = "<" + results.type + " name=\"" + results.name.replace(/"/g, "&quot;").replace(/'/g, "&apos;") + "\"";
            
            if (results.type == "test"){
                xml += " result=\"" + results.result + "\" message=\"" + results.message + "\">";
            } else {
                xml += " passed=\"" + results.passed + "\" failed=\"" + results.failed + "\" ignored=\"" + results.ignored + "\" total=\"" + results.total + "\">";
                for (var prop in results) {
                    if (Y.object.owns(results, prop) && l.isObject(results[prop]) && !l.isArray(results[prop])){
                        xml += arguments.callee(results[prop]);
                    }
                }        
            }
        
            xml += "</" + results.type + ">";
            
            return xml;
        
        };
    };
    
    YUI.add("testformat", M, "3.0.0");
    
})();

(function(){

    var M = function(Y){
        
        Y.namespace("Test");
        
        /**
         * An object capable of sending test results to a server.
         * @param {String} url The URL to submit the results to.
         * @param {Function} format (Optiona) A function that outputs the results in a specific format.
         *      Default is Y.Test.Format.XML.
         * @constructor
         * @namespace YAHOO.tool
         * @class TestReporter
         */
        Y.Test.Reporter = function(url /*:String*/, format /*:Function*/) {
        
            /**
             * The URL to submit the data to.
             * @type String
             * @property url
             */
            this.url /*:String*/ = url;
        
            /**
             * The formatting function to call when submitting the data.
             * @type Function
             * @property format
             */
            this.format /*:Function*/ = format || Y.Test.Format.XML;
        
            /**
             * Extra fields to submit with the request.
             * @type Object
             * @property _fields
             * @private
             */
            this._fields /*:Object*/ = new Object();
            
            /**
             * The form element used to submit the results.
             * @type HTMLFormElement
             * @property _form
             * @private
             */
            this._form /*:HTMLElement*/ = null;
        
            /**
             * Iframe used as a target for form submission.
             * @type HTMLIFrameElement
             * @property _iframe
             * @private
             */
            this._iframe /*:HTMLElement*/ = null;
        };
        
        Y.Test.Reporter.prototype = {
        
            //restore missing constructor
            constructor: Y.Test.Reporter,
        
            /**
             * Adds a field to the form that submits the results.
             * @param {String} name The name of the field.
             * @param {Variant} value The value of the field.
             * @return {Void}
             * @method addField
             */
            addField : function (name /*:String*/, value /*:Variant*/) /*:Void*/{
                this._fields[name] = value;    
            },
            
            /**
             * Removes all previous defined fields.
             * @return {Void}
             * @method addField
             */
            clearFields : function() /*:Void*/{
                this._fields = new Object();
            },
        
            /**
             * Cleans up the memory associated with the TestReporter, removing DOM elements
             * that were created.
             * @return {Void}
             * @method destroy
             */
            destroy : function() /*:Void*/ {
                if (this._form){
                    this._form.parentNode.removeChild(this._form);
                    this._form = null;
                }        
                if (this._iframe){
                    this._iframe.parentNode.removeChild(this._iframe);
                    this._iframe = null;
                }
                this._fields = null;
            },
        
            /**
             * Sends the report to the server.
             * @param {Object} results The results object created by TestRunner.
             * @return {Void}
             * @method report
             */
            report : function(results /*:Object*/) /*:Void*/{
            
                //if the form hasn't been created yet, create it
                if (!this._form){
                    this._form = document.createElement("form");
                    this._form.method = "post";
                    this._form.style.visibility = "hidden";
                    this._form.style.position = "absolute";
                    this._form.style.top = 0;
                    document.body.appendChild(this._form);
                
                    //IE won't let you assign a name using the DOM, must do it the hacky way
                    if (Y.ua.ie){
                        this._iframe = document.createElement("<iframe name=\"yuiTestTarget\" />");
                    } else {
                        this._iframe = document.createElement("iframe");
                        this._iframe.name = "yuiTestTarget";
                    }
        
                    this._iframe.src = "javascript:false";
                    this._iframe.style.visibility = "hidden";
                    this._iframe.style.position = "absolute";
                    this._iframe.style.top = 0;
                    document.body.appendChild(this._iframe);
        
                    this._form.target = "yuiTestTarget";
                }
        
                //set the form's action
                this._form.action = this.url;
            
                //remove any existing fields
                while(this._form.hasChildNodes()){
                    this._form.removeChild(this._form.lastChild);
                }
                
                //create default fields
                this._fields.results = this.format(results);
                this._fields.useragent = navigator.userAgent;
                this._fields.timestamp = (new Date()).toLocaleString();
        
                //add fields to the form
                for (var prop in this._fields){
                    if (Y.object.owns(this._fields, prop) && typeof this._fields[prop] != "function"){
                        input = document.createElement("input");
                        input.type = "hidden";
                        input.name = prop;
                        input.value = this._fields[prop];
                        this._form.appendChild(input);
                    }
                }
        
                //remove default fields
                delete this._fields.results;
                delete this._fields.useragent;
                delete this._fields.timestamp;
                
                if (arguments[1] !== false){
                    this._form.submit();
                }
            
            }
        
        };
    };
    
    YUI.add("testreporter", M, "3.0.0");
})();

YUI.add("yuitest", function(){}, "3.0.0", { use: ["assert", "objectassert", "arrayassert", "dateassert", "testcase", "testsuite", "testrunner"] });

