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
            
            Y.extend(TestRunner, Y.Event.Target, {
            
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
                
                    //cancel other waits if available
                    if (testCase.__yui_wait){
                        clearTimeout(testCase.__yui_wait);
                        delete testCase.__yui_wait;
                    }
    
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
                        } else if (thrown instanceof Y.Test.Wait){
                        
                            if (Y.lang.isFunction(thrown.segment)){
                                if (Y.lang.isNumber(thrown.delay)){
                                
                                    //some environments don't support setTimeout
                                    if (typeof setTimeout != "undefined"){
                                        testCase.__yui_wait = setTimeout(function(){
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