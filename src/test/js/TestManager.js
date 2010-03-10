
    Y.namespace("Test");

    /**
     * Runs pages containing test suite definitions.
     * @namespace Test
     * @class Manager
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
        TEST_PAGE_BEGIN_EVENT : "testpagebegin",
    
        /**
         * Constant for the testpagecomplete custom event
         * @property TEST_PAGE_COMPLETE_EVENT
         * @static
         * @type string
         * @final
         */
        TEST_PAGE_COMPLETE_EVENT : "testpagecomplete",
    
        /**
         * Constant for the testmanagerbegin custom event
         * @property TEST_MANAGER_BEGIN_EVENT
         * @static
         * @type string
         * @final
         */
        TEST_MANAGER_BEGIN_EVENT : "testmanagerbegin",
    
        /**
         * Constant for the testmanagercomplete custom event
         * @property TEST_MANAGER_COMPLETE_EVENT
         * @static
         * @type string
         * @final
         */
        TEST_MANAGER_COMPLETE_EVENT : "testmanagercomplete",
    
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
        _curPage : null,
        
        /**
         * The frame used to load and run tests.
         * @type Window
         * @private
         * @property _frame
         * @static
         */
        _frame : null,
        
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
        _timeoutId : 0,
        
        /**
         * Array of pages to load.
         * @type String[]
         * @private
         * @property _pages
         * @static
         */
        _pages : [],
        
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
        _handleTestRunnerComplete : function (data) {
    
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
        _processResults : function (page, results) {
    
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
        _run : function () {
        
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
        load : function () {
            if (parent.YAHOO.tool.TestManager !== this){
                parent.YAHOO.tool.TestManager.load();
            } else {
                
                if (this._frame) {
                    //assign event handling
                    var TestRunner = this._frame.YAHOO.tool.TestRunner;
    
                    this._logger.setTestRunner(TestRunner);
                    TestRunner.on(TestRunner.COMPLETE_EVENT, this._handleTestRunnerComplete, this, true);
                    
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
        setPages : function (pages) {
            this._pages = pages;
        },
        
        /**
         * Begins the process of running the tests.
         * @return {Void}
         * @static
         */
        start : function () {
    
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
                    var frame = document.createElement("iframe");
                    frame.style.visibility = "hidden";
                    frame.style.position = "absolute";
                    document.body.appendChild(frame);
                    this._frame = frame.contentWindow || frame.contentDocument.parentWindow;
                }
                
                //create test logger if not already available
                //if (!this._logger){
                //    this._logger = new YAHOO.tool.TestLogger();
                //}
    
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
        stop : function () {
            clearTimeout(this._timeoutId);
        }
    
    };
    
    Y.mix(Y.Test.Manager, Y.Event.Target.prototype);
