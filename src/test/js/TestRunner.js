    
    /*
     * Runs test suites and test cases, providing events to allowing for the
     * interpretation of test results.
     * @namespace Test
     * @class Runner
     * @static
     */
    Y.Test.Runner = (function(){
    
        /* (intentionally not documented)
         * A node in the test tree structure. May represent a TestSuite, TestCase, or
         * test function.
         * @param {Variant} testObject A TestSuite, TestCase, or the name of a test function.
         * @class TestNode
         * @constructor
         * @private
         */
        function TestNode(testObject){
        
            /* (intentionally not documented)
             * The TestSuite, TestCase, or test function represented by this node.
             * @type Variant
             * @property testObject
             */
            this.testObject = testObject;
            
            /* (intentionally not documented)
             * Pointer to this node's first child.
             * @type TestNode
             * @property firstChild
             */        
            this.firstChild = null;
            
            /* (intentionally not documented)
             * Pointer to this node's last child.
             * @type TestNode
             * @property lastChild
             */        
            this.lastChild = null;
            
            /* (intentionally not documented)
             * Pointer to this node's parent.
             * @type TestNode
             * @property parent
             */        
            this.parent = null; 
       
            /* (intentionally not documented)
             * Pointer to this node's next sibling.
             * @type TestNode
             * @property next
             */        
            this.next = null;
            
            /* (intentionally not documented)
             * Test results for this test object.
             * @type object
             * @property results
             */                
            this.results = {
                passed : 0,
                failed : 0,
                total : 0,
                ignored : 0,
                duration: 0
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
        
            /* (intentionally not documented)
             * Appends a new test object (TestSuite, TestCase, or test function name) as a child
             * of this node.
             * @param {Variant} testObject A TestSuite, TestCase, or the name of a test function.
             * @return {Void}
             */
            appendChild : function (testObject){
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
    
        /**
         * Runs test suites and test cases, providing events to allowing for the
         * interpretation of test results.
         * @namespace Test
         * @class Runner
         * @static
         */
        function TestRunner(){
        
            //inherit from EventProvider
            TestRunner.superclass.constructor.apply(this,arguments);
            
            /**
             * Suite on which to attach all TestSuites and TestCases to be run.
             * @type Y.Test.Suite
             * @property masterSuite
             * @static
             * @private
             */
            this.masterSuite /*:Y.Test.Suite*/ = new Y.Test.Suite("yuitests" + (new Date()).getTime());        
    
            /**
             * Pointer to the current node in the test tree.
             * @type TestNode
             * @private
             * @property _cur
             * @static
             */
            this._cur = null;
            
            /**
             * Pointer to the root node in the test tree.
             * @type TestNode
             * @private
             * @property _root
             * @static
             */
            this._root = null;
            
            /**
             * Indicates if the TestRunner will log events or not.
             * @type Boolean
             * @property _log
             * @private
             * @static
             */
            this._log = true;
            
            /**
             * Indicates if the TestRunner is waiting as a result of
             * wait() being called.
             * @type Boolean
             * @property _waiting
             * @private
             * @static
             */
            this._waiting = false;
            
            /**
             * Indicates if the TestRunner is currently running tests.
             * @type Boolean
             * @private
             * @property _running
             * @static
             */
            this._running = false;
            
            /**
             * Holds copy of the results object generated when all tests are
             * complete.
             * @type Object
             * @private
             * @property _lastResults
             * @static
             */
            this._lastResults = null;            
            
            //create events
            var events = [
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
                this.on(events[i], this._logEvent, this, true);
            }      
       
        }
        
        Y.extend(TestRunner, Y.Event.Target, {
        
            //-------------------------------------------------------------------------
            // Constants
            //-------------------------------------------------------------------------
             
            /**
             * Fires when a test case is opened but before the first 
             * test is executed.
             * @event testcasebegin
             * @static
             */         
            TEST_CASE_BEGIN_EVENT : "testcasebegin",
            
            /**
             * Fires when all tests in a test case have been executed.
             * @event testcasecomplete
             * @static
             */        
            TEST_CASE_COMPLETE_EVENT : "testcasecomplete",
            
            /**
             * Fires when a test suite is opened but before the first 
             * test is executed.
             * @event testsuitebegin
             * @static
             */        
            TEST_SUITE_BEGIN_EVENT : "testsuitebegin",
            
            /**
             * Fires when all test cases in a test suite have been
             * completed.
             * @event testsuitecomplete
             * @static
             */        
            TEST_SUITE_COMPLETE_EVENT : "testsuitecomplete",
            
            /**
             * Fires when a test has passed.
             * @event pass
             * @static
             */        
            TEST_PASS_EVENT : "pass",
            
            /**
             * Fires when a test has failed.
             * @event fail
             * @static
             */        
            TEST_FAIL_EVENT : "fail",
            
            /**
             * Fires when a test has been ignored.
             * @event ignore
             * @static
             */        
            TEST_IGNORE_EVENT : "ignore",
            
            /**
             * Fires when all test suites and test cases have been completed.
             * @event complete
             * @static
             */        
            COMPLETE_EVENT : "complete",
            
            /**
             * Fires when the run() method is called.
             * @event begin
             * @static
             */        
            BEGIN_EVENT : "begin",    
            
            //-------------------------------------------------------------------------
            // Logging-Related Methods
            //-------------------------------------------------------------------------
    
            
            /**
             * Disable logging via Y.log(). Test output will not be visible unless
             * TestRunner events are subscribed to.
             * @return {Void}
             * @method disableLogging
             * @static
             */
            disableLogging: function(){
                this._log = false;
            },    
            
            /**
             * Enable logging via Y.log(). Test output is published and can be read via
             * logreader.
             * @return {Void}
             * @method enableLogging
             * @static
             */
            enableLogging: function(){
                this._log = true;
            },
            
            /**
             * Logs TestRunner events using Y.log().
             * @param {Object} event The event object for the event.
             * @return {Void}
             * @method _logEvent
             * @private
             * @static
             */
            _logEvent: function(event){
                
                //data variables
                var message = "";
                var messageType = "";
                
                switch(event.type){
                    case this.BEGIN_EVENT:
                        message = "Testing began at " + (new Date()).toString() + ".";
                        messageType = "info";
                        break;
                        
                    case this.COMPLETE_EVENT:
                        message = Y.substitute("Testing completed at " +
                            (new Date()).toString() + ".\n" +
                            "Passed:{passed} Failed:{failed} " +
                            "Total:{total} ({ignored} ignored)",
                            event.results);
                        messageType = "info";
                        break;
                        
                    case this.TEST_FAIL_EVENT:
                        message = event.testName + ": failed.\n" + event.error.getMessage();
                        messageType = "fail";
                        break;
                        
                    case this.TEST_IGNORE_EVENT:
                        message = event.testName + ": ignored.";
                        messageType = "ignore";
                        break;
                        
                    case this.TEST_PASS_EVENT:
                        message = event.testName + ": passed.";
                        messageType = "pass";
                        break;
                        
                    case this.TEST_SUITE_BEGIN_EVENT:
                        message = "Test suite \"" + event.testSuite.name + "\" started.";
                        messageType = "info";
                        break;
                        
                    case this.TEST_SUITE_COMPLETE_EVENT:
                        message = Y.substitute("Test suite \"" +
                            event.testSuite.name + "\" completed" + ".\n" +
                            "Passed:{passed} Failed:{failed} " +
                            "Total:{total} ({ignored} ignored)",
                            event.results);
                        messageType = "info";
                        break;
                        
                    case this.TEST_CASE_BEGIN_EVENT:
                        message = "Test case \"" + event.testCase.name + "\" started.";
                        messageType = "info";
                        break;
                        
                    case this.TEST_CASE_COMPLETE_EVENT:
                        message = Y.substitute("Test case \"" +
                            event.testCase.name + "\" completed.\n" +
                            "Passed:{passed} Failed:{failed} " +
                            "Total:{total} ({ignored} ignored)",
                            event.results);
                        messageType = "info";
                        break;
                    default:
                        message = "Unexpected event " + event.type;
                        message = "info";
                }
            
                //only log if required
                if (this._log){
                    Y.log(message, messageType, "TestRunner");
                }
            },

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
           _addTestCaseToTestTree : function (parentNode, testCase /*:Y.Test.Case*/){
                
                //add the test suite
                var node = parentNode.appendChild(testCase),
                    prop,
                    testName;
                
                //iterate over the items in the test case
                for (prop in testCase){
                    if ((prop.indexOf("test") === 0 || (prop.toLowerCase().indexOf("should") > -1 && prop.indexOf(" ") > -1 ))&& Y.Lang.isFunction(testCase[prop])){
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
            _addTestSuiteToTestTree : function (parentNode, testSuite /*:Y.Test.Suite*/) {
                
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
            _buildTestTree : function () {
            
                this._root = new TestNode(this.masterSuite);
                //this._cur = this._root;
                
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
            _handleTestObjectComplete : function (node) {
                if (Y.Lang.isObject(node.testObject)){
                
                    if (node.parent){
                        node.parent.results.passed += node.results.passed;
                        node.parent.results.failed += node.results.failed;
                        node.parent.results.total += node.results.total;                
                        node.parent.results.ignored += node.results.ignored;       
                        //node.parent.results.duration += node.results.duration;
                        node.parent.results[node.testObject.name] = node.results;
                    }
                
                    if (node.testObject instanceof Y.Test.Suite){
                        node.testObject.tearDown();
                        node.results.duration = (new Date()) - node._start;
                        this.fire(this.TEST_SUITE_COMPLETE_EVENT, { testSuite: node.testObject, results: node.results});
                    } else if (node.testObject instanceof Y.Test.Case){
                        node.results.duration = (new Date()) - node._start;
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
            _next : function () {
            
                if (this._cur === null){
                    this._cur = this._root;
                } else if (this._cur.firstChild) {
                    this._cur = this._cur.firstChild;
                } else if (this._cur.next) {
                    this._cur = this._cur.next;            
                } else {
                    while (this._cur && !this._cur.next && this._cur !== this._root){
                        this._handleTestObjectComplete(this._cur);
                        this._cur = this._cur.parent;
                    }

                    this._handleTestObjectComplete(this._cur);               
                    
                    if (this._cur == this._root){
                        this._cur.results.type = "report";
                        this._cur.results.timestamp = (new Date()).toLocaleString();
                        this._cur.results.duration = (new Date()) - this._cur._start;   
                        this._lastResults = this._cur.results;
                        this._running = false;                         
                        this.fire(this.COMPLETE_EVENT, { results: this._lastResults});
                        this._cur = null;
                    } else {
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
            _run : function () {
            
                //flag to indicate if the TestRunner should wait before continuing
                var shouldWait = false;
                
                //get the next test node
                var node = this._next();
                
                if (node !== null) {
                
                    //set flag to say the testrunner is running
                    this._running = true;
                    
                    //eliminate last results
                    this._lastResult = null;                  
                
                    var testObject = node.testObject;
                    
                    //figure out what to do
                    if (Y.Lang.isObject(testObject)){
                        if (testObject instanceof Y.Test.Suite){
                            this.fire(this.TEST_SUITE_BEGIN_EVENT, { testSuite: testObject });
                            node._start = new Date();
                            testObject.setUp();
                        } else if (testObject instanceof Y.Test.Case){
                            this.fire(this.TEST_CASE_BEGIN_EVENT, { testCase: testObject });
                            node._start = new Date();
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
            
            _resumeTest : function (segment) {
            
                //get relevant information
                var node = this._cur;                
                
                //we know there's no more waiting now
                this._waiting = false;
                
                //if there's no node, it probably means a wait() was called after resume()
                if (!node){
                    //TODO: Handle in some way?
                    //console.log("wait() called after resume()");
                    //this.fire("error", { testCase: "(unknown)", test: "(unknown)", error: new Error("wait() called after resume()")} );
                    return;
                }
                
                var testName = node.testObject;
                var testCase /*:Y.Test.Case*/ = node.parent.testObject;
            
                //cancel other waits if available
                if (testCase.__yui_wait){
                    clearTimeout(testCase.__yui_wait);
                    delete testCase.__yui_wait;
                }

                //get the "should" test cases
                var shouldFail = (testCase._should.fail || {})[testName];
                var shouldError = (testCase._should.error || {})[testName];
                
                //variable to hold whether or not the test failed
                var failed = false;
                var error = null;
                    
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
                               
                } catch (thrown){

                    //cancel any pending waits, the test already failed
                    if (testCase.__yui_wait){
                        clearTimeout(testCase.__yui_wait);
                        delete testCase.__yui_wait;
                    }                    
                
                    //figure out what type of error it was
                    if (thrown instanceof Y.Assert.Error) {
                        if (!shouldFail){
                            error = thrown;
                            failed = true;
                        }
                    } else if (thrown instanceof Y.Test.Wait){
                    
                        if (Y.Lang.isFunction(thrown.segment)){
                            if (Y.Lang.isNumber(thrown.delay)){
                            
                                //some environments don't support setTimeout
                                if (typeof setTimeout != "undefined"){
                                    testCase.__yui_wait = setTimeout(function(){
                                        Y.Test.Runner._resumeTest(thrown.segment);
                                    }, thrown.delay);
                                    this._waiting = true;
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
                            if (Y.Lang.isString(shouldError)){
                                
                                //if it's a string, check the error message
                                if (thrown.message != shouldError){
                                    error = new Y.Assert.UnexpectedError(thrown);
                                    failed = true;                                    
                                }
                            } else if (Y.Lang.isFunction(shouldError)){
                            
                                //if it's a function, see if the error is an instance of it
                                if (!(thrown instanceof shouldError)){
                                    error = new Y.Assert.UnexpectedError(thrown);
                                    failed = true;
                                }
                            
                            } else if (Y.Lang.isObject(shouldError)){
                            
                                //if it's an object, check the instance and message
                                if (!(thrown instanceof shouldError.constructor) || 
                                        thrown.message != shouldError.message){
                                    error = new Y.Assert.UnexpectedError(thrown);
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
                
                //calculate duration
                var duration = (new Date()) - node._start;
                
                //update results
                node.parent.results[testName] = { 
                    result: failed ? "fail" : "pass",
                    message: error ? error.getMessage() : "Test passed",
                    type: "test",
                    name: testName,
                    duration: duration
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
             * Handles an error as if it occurred within the currently executing
             * test. This is for mock methods that may be called asynchronously
             * and therefore out of the scope of the TestRunner. Previously, this
             * error would bubble up to the browser. Now, this method is used
             * to tell TestRunner about the error. This should never be called
             * by anyplace other than the Mock object.
             * @param {Error} error The error object.
             * @return {Void}
             * @method _handleError
             * @private
             * @static
             */
            _handleError: function(error){
            
                if (this._waiting){
                    this._resumeTest(function(){
                        throw error;
                    });
                } else {
                    throw error;
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
            _runTest : function (node) {
            
                //get relevant information
                var testName = node.testObject;
                var testCase /*:Y.Test.Case*/ = node.parent.testObject;
                var test = testCase[testName];
                
                //get the "should" test cases
                var shouldIgnore = (testCase._should.ignore || {})[testName];
                
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
                
                    //mark the start time
                    node._start = new Date();
                
                    //run the setup
                    testCase.setUp();
                    
                    //now call the body of the test
                    this._resumeTest(test);                
                }
    
            },            

            //-------------------------------------------------------------------------
            // Misc Methods
            //-------------------------------------------------------------------------   

            /**
             * Retrieves the name of the current result set.
             * @return {String} The name of the result set.
             * @method getName
             */
            getName: function(){
                return this.masterSuite.name;
            },         

            /**
             * The name assigned to the master suite of the TestRunner. This is the name
             * that is output as the root's name when results are retrieved.
             * @param {String} name The name of the result set.
             * @return {Void}
             * @method setName
             */
            setName: function(name){
                this.masterSuite.name = name;
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
            fire : function (type, data) {
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
            add : function (testObject) {
                this.masterSuite.add(testObject);
                return this;
            },
            
            /**
             * Removes all test objects from the runner.
             * @return {Void}
             * @method clear
             * @static
             */
            clear : function () {
                this.masterSuite = new Y.Test.Suite("yuitests" + (new Date()).getTime());
            },
            
            /**
             * Indicates if the TestRunner is waiting for a test to resume
             * @return {Boolean} True if the TestRunner is waiting, false if not.
             * @method isWaiting
             * @static
             */
            isWaiting: function() {
                return this._waiting;
            },
            
            /**
             * Indicates that the TestRunner is busy running tests and therefore can't
             * be stopped and results cannot be gathered.
             * @return {Boolean} True if the TestRunner is running, false if not.
             * @method isRunning
             */
            isRunning: function(){
                return this._running;
            },
            
            /**
             * Returns the last complete results set from the TestRunner. Null is returned
             * if the TestRunner is running or no tests have been run.
             * @param {Function} format (Optional) A test format to return the results in.
             * @return {Object|String} Either the results object or, if a test format is 
             *      passed as the argument, a string representing the results in a specific
             *      format.
             * @method getResults
             */
            getResults: function(format){
                if (!this._running && this._lastResults){
                    if (Y.Lang.isFunction(format)){
                        return format(this._lastResults);                    
                    } else {
                        return this._lastResults;
                    }
                } else {
                    return null;
                }
            },            
            
            /**
             * Returns the coverage report for the files that have been executed.
             * This returns only coverage information for files that have been
             * instrumented using YUI Test Coverage and only those that were run
             * in the same pass.
             * @param {Function} format (Optional) A coverage format to return results in.
             * @return {Object|String} Either the coverage object or, if a coverage
             *      format is specified, a string representing the results in that format.
             * @method getCoverage
             */
            getCoverage: function(format){
                if (!this._running && typeof _yuitest_coverage == "object"){
                    if (Y.Lang.isFunction(format)){
                        return format(_yuitest_coverage);                    
                    } else {
                        return _yuitest_coverage;
                    }
                } else {
                    return null;
                }            
            },
            
            /**
             * Resumes the TestRunner after wait() was called.
             * @param {Function} segment The function to run as the rest
             *      of the haulted test.
             * @return {Void}
             * @method resume
             * @static
             */
            resume : function (segment) {
                if (Y.Test.Runner._waiting){
                    this._resumeTest(segment || function(){});
                } else {
                    throw new Error("resume() called without wait().");
                }
            },
        
            /**
             * Runs the test suite.
             * @param {Boolean} oldMode (Optional) Specifies that the <= 2.8 way of
             *      internally managing test suites should be used.             
             * @return {Void}
             * @method run
             * @static
             */
            run : function (oldMode) {
                
                //pointer to runner to avoid scope issues 
                var runner = Y.Test.Runner;
                
                //if there's only one suite on the masterSuite, move it up
                if (!oldMode && this.masterSuite.items.length == 1 && this.masterSuite.items[0] instanceof Y.Test.Suite){
                    this.masterSuite = this.masterSuite.items[0];
                }                
    
                //build the test tree
                runner._buildTestTree();
                            
                //set when the test started
                runner._root._start = new Date();
                
                //fire the begin event
                runner.fire(runner.BEGIN_EVENT);
           
                //begin the testing
                runner._run();
            }    
        });
        
        return new TestRunner();
        
    })();
