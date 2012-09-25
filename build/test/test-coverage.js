if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/test/test.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/test/test.js",
    code: []
};
_yuitest_coverage["build/test/test.js"].code=["YUI.add('test', function (Y, NAME) {","","","","/**"," * YUI Test Framework"," * @module test"," * @main test"," */","","/*"," * The root namespace for YUI Test."," */","","//So we only ever have one YUITest object that's shared","if (YUI.YUITest) {","    Y.Test = YUI.YUITest;","","    if (Y.Test.prototype.debugWinJS === true) {","        var winJS = new Y.Test.WinJS();","    }","","","} else { //Ends after the YUITest definitions","","    //Make this global for back compat","    YUITest = {","        version: \"@VERSION@\",","        guid: function(pre) {","            return Y.guid(pre);","        }","    };","","Y.namespace('Test');","","","//Using internal YUI methods here","YUITest.Object = Y.Object;","YUITest.Array = Y.Array;","YUITest.Util = {","    mix: Y.mix,","    JSON: Y.JSON","};","","/**"," * Simple custom event implementation."," * @namespace Test"," * @module test"," * @class EventTarget"," * @constructor"," */","YUITest.EventTarget = function(){","","    /**","     * Event handlers for the various events.","     * @type Object","     * @private","     * @property _handlers","     * @static","     */","    this._handlers = {};","","};","    ","YUITest.EventTarget.prototype = {","","    //restore prototype","    constructor: YUITest.EventTarget,","            ","    //-------------------------------------------------------------------------","    // Event Handling","    //-------------------------------------------------------------------------","    ","    /**","     * Adds a listener for a given event type.","     * @param {String} type The type of event to add a listener for.","     * @param {Function} listener The function to call when the event occurs.","     * @return {void}","     * @method attach","     */","    attach: function(type, listener){","        if (typeof this._handlers[type] == \"undefined\"){","            this._handlers[type] = [];","        }","","        this._handlers[type].push(listener);","    },","    ","    /**","     * Adds a listener for a given event type.","     * @param {String} type The type of event to add a listener for.","     * @param {Function} listener The function to call when the event occurs.","     * @return {void}","     * @method subscribe","     * @deprecated","     */","    subscribe: function(type, listener){","        this.attach.apply(this, arguments);","    },","    ","    /**","     * Fires an event based on the passed-in object.","     * @param {Object|String} event An object with at least a 'type' attribute","     *      or a string indicating the event name.","     * @return {void}","     * @method fire","     */    ","    fire: function(event){","        if (typeof event == \"string\"){","            event = { type: event };","        }","        if (!event.target){","            event.target = this;","        }","        ","        if (!event.type){","            throw new Error(\"Event object missing 'type' property.\");","        }","        ","        if (this._handlers[event.type] instanceof Array){","            var handlers = this._handlers[event.type];","            for (var i=0, len=handlers.length; i < len; i++){","                handlers[i].call(this, event);","            }","        }            ","    },","","    /**","     * Removes a listener for a given event type.","     * @param {String} type The type of event to remove a listener from.","     * @param {Function} listener The function to remove from the event.","     * @return {void}","     * @method detach","     */","    detach: function(type, listener){","        if (this._handlers[type] instanceof Array){","            var handlers = this._handlers[type];","            for (var i=0, len=handlers.length; i < len; i++){","                if (handlers[i] === listener){","                    handlers.splice(i, 1);","                    break;","                }","            }","        }            ","    },","    ","    /**","     * Removes a listener for a given event type.","     * @param {String} type The type of event to remove a listener from.","     * @param {Function} listener The function to remove from the event.","     * @return {void}","     * @method unsubscribe","     * @deprecated","     */","    unsubscribe: function(type, listener){","        this.detach.apply(this, arguments);          ","    }    ","","};","","    ","/**"," * A test suite that can contain a collection of TestCase and TestSuite objects."," * @param {String||Object} data The name of the test suite or an object containing"," *      a name property as well as setUp and tearDown methods."," * @namespace Test"," * @module test"," * @class TestSuite"," * @constructor"," */","YUITest.TestSuite = function (data) {","","    /**","     * The name of the test suite.","     * @type String","     * @property name","     */","    this.name = \"\";","","    /**","     * Array of test suites and test cases.","     * @type Array","     * @property items","     * @private","     */","    this.items = [];","","    //initialize the properties","    if (typeof data == \"string\"){","        this.name = data;","    } else if (data instanceof Object){","        for (var prop in data){","            if (data.hasOwnProperty(prop)){","                this[prop] = data[prop];","            }","        }","    }","","    //double-check name","    if (this.name === \"\" || !this.name) {","        this.name = YUITest.guid(\"testSuite_\");","    }","","};","    ","YUITest.TestSuite.prototype = {","    ","    //restore constructor","    constructor: YUITest.TestSuite,","    ","    /**","     * Adds a test suite or test case to the test suite.","     * @param {Test.TestSuite||YUITest.TestCase} testObject The test suite or test case to add.","     * @return {Void}","     * @method add","     */","    add : function (testObject) {","        if (testObject instanceof YUITest.TestSuite || testObject instanceof YUITest.TestCase) {","            this.items.push(testObject);","        }","        return this;","    },","    ","    //-------------------------------------------------------------------------","    // Stub Methods","    //-------------------------------------------------------------------------","","    /**","     * Function to run before each test is executed.","     * @return {Void}","     * @method setUp","     */","    setUp : function () {","    },","    ","    /**","     * Function to run after each test is executed.","     * @return {Void}","     * @method tearDown","     */","    tearDown: function () {","    }","    ","};","/**"," * Test case containing various tests to run."," * @param template An object containing any number of test methods, other methods,"," *                 an optional name, and anything else the test case needs."," * @module test"," * @class TestCase"," * @namespace Test"," * @constructor"," */","","","","YUITest.TestCase = function (template) {","    ","    /*","     * Special rules for the test case. Possible subobjects","     * are fail, for tests that should fail, and error, for","     * tests that should throw an error.","     */","    this._should = {};","    ","    //copy over all properties from the template to this object","    for (var prop in template) {","        this[prop] = template[prop];","    }    ","    ","    //check for a valid name","    if (typeof this.name != \"string\") {","        this.name = YUITest.guid(\"testCase_\");","    }","","};","","        ","YUITest.TestCase.prototype = {  ","","    //restore constructor","    constructor: YUITest.TestCase,","    ","    /**","     * Method to call from an async init method to","     * restart the test case. When called, returns a function","     * that should be called when tests are ready to continue.","     * @method callback","     * @return {Function} The function to call as a callback.","     */","    callback: function(){","        return YUITest.TestRunner.callback.apply(YUITest.TestRunner,arguments);","    },","","    /**","     * Resumes a paused test and runs the given function.","     * @param {Function} segment (Optional) The function to run.","     *      If omitted, the test automatically passes.","     * @return {Void}","     * @method resume","     */","    resume : function (segment) {","        YUITest.TestRunner.resume(segment);","    },","","    /**","     * Causes the test case to wait a specified amount of time and then","     * continue executing the given code.","     * @param {Function} segment (Optional) The function to run after the delay.","     *      If omitted, the TestRunner will wait until resume() is called.","     * @param {int} delay (Optional) The number of milliseconds to wait before running","     *      the function. If omitted, defaults to zero.","     * @return {Void}","     * @method wait","     */","    wait : function (segment, delay){","        ","        var actualDelay = (typeof segment == \"number\" ? segment : delay);","        actualDelay = (typeof actualDelay == \"number\" ? actualDelay : 10000);","    ","		if (typeof segment == \"function\"){","            throw new YUITest.Wait(segment, actualDelay);","        } else {","            throw new YUITest.Wait(function(){","                YUITest.Assert.fail(\"Timeout: wait() called but resume() never called.\");","            }, actualDelay);","        }","    },","    ","    //-------------------------------------------------------------------------","    // Assertion Methods","    //-------------------------------------------------------------------------","","    /**","     * Asserts that a given condition is true. If not, then a YUITest.AssertionError object is thrown","     * and the test fails.","     * @method assert","     * @param {Boolean} condition The condition to test.","     * @param {String} message The message to display if the assertion fails.","     */","    assert : function (condition, message){","        YUITest.Assert._increment();","        if (!condition){","            throw new YUITest.AssertionError(YUITest.Assert._formatMessage(message, \"Assertion failed.\"));","        }    ","    },","    ","    /**","     * Forces an assertion error to occur. Shortcut for YUITest.Assert.fail().","     * @method fail","     * @param {String} message (Optional) The message to display with the failure.","     */","    fail: function (message) {    ","        YUITest.Assert.fail(message);","    },","    ","    //-------------------------------------------------------------------------","    // Stub Methods","    //-------------------------------------------------------------------------","","    /**","     * Function to run once before tests start to run.","     * This executes before the first call to setUp().","     * @method init","     */","    init: function(){","        //noop","    },","    ","    /**","     * Function to run once after tests finish running.","     * This executes after the last call to tearDown().","     * @method destroy","     */","    destroy: function(){","        //noop","    },","","    /**","     * Function to run before each test is executed.","     * @return {Void}","     * @method setUp","     */","    setUp : function () {","        //noop","    },","    ","    /**","     * Function to run after each test is executed.","     * @return {Void}","     * @method tearDown","     */","    tearDown: function () {    ","        //noop","    }","};","/**"," * An object object containing test result formatting methods."," * @namespace Test"," * @module test"," * @class TestFormat"," * @static"," */","YUITest.TestFormat = function(){","    ","    /* (intentionally not documented)","     * Basic XML escaping method. Replaces quotes, less-than, greater-than,","     * apostrophe, and ampersand characters with their corresponding entities.","     * @param {String} text The text to encode.","     * @return {String} The XML-escaped text.","     */","    function xmlEscape(text){","    ","        return text.replace(/[<>\"'&]/g, function(value){","            switch(value){","                case \"<\":   return \"&lt;\";","                case \">\":   return \"&gt;\";","                case \"\\\"\":  return \"&quot;\";","                case \"'\":   return \"&apos;\";","                case \"&\":   return \"&amp;\";","            }","        });","    ","    }","        ","        ","    return {","    ","        /**","         * Returns test results formatted as a JSON string. Requires JSON utility.","         * @param {Object} result The results object created by TestRunner.","         * @return {String} A JSON-formatted string of results.","         * @method JSON","         * @static","         */","        JSON: function(results) {","            return YUITest.Util.JSON.stringify(results);","        },","        ","        /**","         * Returns test results formatted as an XML string.","         * @param {Object} result The results object created by TestRunner.","         * @return {String} An XML-formatted string of results.","         * @method XML","         * @static","         */","        XML: function(results) {","","            function serializeToXML(results){","                var xml = \"<\" + results.type + \" name=\\\"\" + xmlEscape(results.name) + \"\\\"\";","                ","                if (typeof(results.duration)==\"number\"){","                    xml += \" duration=\\\"\" + results.duration + \"\\\"\";","                }","                ","                if (results.type == \"test\"){","                    xml += \" result=\\\"\" + results.result + \"\\\" message=\\\"\" + xmlEscape(results.message) + \"\\\">\";","                } else {","                    xml += \" passed=\\\"\" + results.passed + \"\\\" failed=\\\"\" + results.failed + \"\\\" ignored=\\\"\" + results.ignored + \"\\\" total=\\\"\" + results.total + \"\\\">\";","                    for (var prop in results){","                        if (results.hasOwnProperty(prop)){","                            if (results[prop] && typeof results[prop] == \"object\" && !(results[prop] instanceof Array)){","                                xml += serializeToXML(results[prop]);","                            }","                        }","                    }       ","                }","","                xml += \"</\" + results.type + \">\";","                ","                return xml;    ","            }","","            return \"<?xml version=\\\"1.0\\\" encoding=\\\"UTF-8\\\"?>\" + serializeToXML(results);","","        },","","","        /**","         * Returns test results formatted in JUnit XML format.","         * @param {Object} result The results object created by TestRunner.","         * @return {String} An XML-formatted string of results.","         * @method JUnitXML","         * @static","         */","        JUnitXML: function(results) {","","            function serializeToJUnitXML(results){","                var xml = \"\";","                    ","                switch (results.type){","                    //equivalent to testcase in JUnit","                    case \"test\":","                        if (results.result != \"ignore\"){","                            xml = \"<testcase name=\\\"\" + xmlEscape(results.name) + \"\\\" time=\\\"\" + (results.duration/1000) + \"\\\">\";","                            if (results.result == \"fail\"){","                                xml += \"<failure message=\\\"\" + xmlEscape(results.message) + \"\\\"><![CDATA[\" + results.message + \"]]></failure>\";","                            }","                            xml+= \"</testcase>\";","                        }","                        break;","                        ","                    //equivalent to testsuite in JUnit","                    case \"testcase\":","                    ","                        xml = \"<testsuite name=\\\"\" + xmlEscape(results.name) + \"\\\" tests=\\\"\" + results.total + \"\\\" failures=\\\"\" + results.failed + \"\\\" time=\\\"\" + (results.duration/1000) + \"\\\">\";","                        ","                        for (var prop in results){","                            if (results.hasOwnProperty(prop)){","                                if (results[prop] && typeof results[prop] == \"object\" && !(results[prop] instanceof Array)){","                                    xml += serializeToJUnitXML(results[prop]);","                                }","                            }","                        }            ","                        ","                        xml += \"</testsuite>\";","                        break;","                    ","                    //no JUnit equivalent, don't output anything","                    case \"testsuite\":","                        for (var prop in results){","                            if (results.hasOwnProperty(prop)){","                                if (results[prop] && typeof results[prop] == \"object\" && !(results[prop] instanceof Array)){","                                    xml += serializeToJUnitXML(results[prop]);","                                }","                            }","                        }                                                     ","                        break;","                        ","                    //top-level, equivalent to testsuites in JUnit","                    case \"report\":","                    ","                        xml = \"<testsuites>\";","                    ","                        for (var prop in results){","                            if (results.hasOwnProperty(prop)){","                                if (results[prop] && typeof results[prop] == \"object\" && !(results[prop] instanceof Array)){","                                    xml += serializeToJUnitXML(results[prop]);","                                }","                            }","                        }            ","                        ","                        xml += \"</testsuites>\";            ","                    ","                    //no default","                }","                ","                return xml;","         ","            }","","            return \"<?xml version=\\\"1.0\\\" encoding=\\\"UTF-8\\\"?>\" + serializeToJUnitXML(results);","        },","    ","        /**","         * Returns test results formatted in TAP format.","         * For more information, see <a href=\"http://testanything.org/\">Test Anything Protocol</a>.","         * @param {Object} result The results object created by TestRunner.","         * @return {String} A TAP-formatted string of results.","         * @method TAP","         * @static","         */","        TAP: function(results) {","        ","            var currentTestNum = 1;","","            function serializeToTAP(results){","                var text = \"\";","                    ","                switch (results.type){","","                    case \"test\":","                        if (results.result != \"ignore\"){","","                            text = \"ok \" + (currentTestNum++) + \" - \" + results.name;","                            ","                            if (results.result == \"fail\"){","                                text = \"not \" + text + \" - \" + results.message;","                            }","                            ","                            text += \"\\n\";","                        } else {","                            text = \"#Ignored test \" + results.name + \"\\n\";","                        }","                        break;","                        ","                    case \"testcase\":","                    ","                        text = \"#Begin testcase \" + results.name + \"(\" + results.failed + \" failed of \" + results.total + \")\\n\";","                                        ","                        for (var prop in results){","                            if (results.hasOwnProperty(prop)){","                                if (results[prop] && typeof results[prop] == \"object\" && !(results[prop] instanceof Array)){","                                    text += serializeToTAP(results[prop]);","                                }","                            }","                        }            ","                        ","                        text += \"#End testcase \" + results.name + \"\\n\";","                        ","                        ","                        break;","                    ","                    case \"testsuite\":","","                        text = \"#Begin testsuite \" + results.name + \"(\" + results.failed + \" failed of \" + results.total + \")\\n\";                ","                    ","                        for (var prop in results){","                            if (results.hasOwnProperty(prop)){","                                if (results[prop] && typeof results[prop] == \"object\" && !(results[prop] instanceof Array)){","                                    text += serializeToTAP(results[prop]);","                                }","                            }","                        }                                                      ","","                        text += \"#End testsuite \" + results.name + \"\\n\";","                        break;","","                    case \"report\":","                    ","                        for (var prop in results){","                            if (results.hasOwnProperty(prop)){","                                if (results[prop] && typeof results[prop] == \"object\" && !(results[prop] instanceof Array)){","                                    text += serializeToTAP(results[prop]);","                                }","                            }","                        }              ","                        ","                    //no default","                }","                ","                return text;","         ","            }","","            return \"1..\" + results.total + \"\\n\" + serializeToTAP(results);","        }","    ","    };","}();","    ","    /**","     * An object capable of sending test results to a server.","     * @param {String} url The URL to submit the results to.","     * @param {Function} format (Optiona) A function that outputs the results in a specific format.","     *      Default is YUITest.TestFormat.XML.","     * @constructor","     * @namespace Test","     * @module test"," * @class Reporter","     */","    YUITest.Reporter = function(url, format) {","    ","        /**","         * The URL to submit the data to.","         * @type String","         * @property url","         */","        this.url = url;","    ","        /**","         * The formatting function to call when submitting the data.","         * @type Function","         * @property format","         */","        this.format = format || YUITest.TestFormat.XML;","    ","        /**","         * Extra fields to submit with the request.","         * @type Object","         * @property _fields","         * @private","         */","        this._fields = new Object();","        ","        /**","         * The form element used to submit the results.","         * @type HTMLFormElement","         * @property _form","         * @private","         */","        this._form = null;","    ","        /**","         * Iframe used as a target for form submission.","         * @type HTMLIFrameElement","         * @property _iframe","         * @private","         */","        this._iframe = null;","    };","    ","    YUITest.Reporter.prototype = {","    ","        //restore missing constructor","        constructor: YUITest.Reporter,","    ","        /**","         * Adds a field to the form that submits the results.","         * @param {String} name The name of the field.","         * @param {Variant} value The value of the field.","         * @return {Void}","         * @method addField","         */","        addField : function (name, value){","            this._fields[name] = value;    ","        },","        ","        /**","         * Removes all previous defined fields.","         * @return {Void}","         * @method clearFields","         */","        clearFields : function(){","            this._fields = new Object();","        },","    ","        /**","         * Cleans up the memory associated with the TestReporter, removing DOM elements","         * that were created.","         * @return {Void}","         * @method destroy","         */","        destroy : function() {","            if (this._form){","                this._form.parentNode.removeChild(this._form);","                this._form = null;","            }        ","            if (this._iframe){","                this._iframe.parentNode.removeChild(this._iframe);","                this._iframe = null;","            }","            this._fields = null;","        },","    ","        /**","         * Sends the report to the server.","         * @param {Object} results The results object created by TestRunner.","         * @return {Void}","         * @method report","         */","        report : function(results){","        ","            //if the form hasn't been created yet, create it","            if (!this._form){","                this._form = document.createElement(\"form\");","                this._form.method = \"post\";","                this._form.style.visibility = \"hidden\";","                this._form.style.position = \"absolute\";","                this._form.style.top = 0;","                document.body.appendChild(this._form);","            ","                //IE won't let you assign a name using the DOM, must do it the hacky way","                try {","                    this._iframe = document.createElement(\"<iframe name=\\\"yuiTestTarget\\\" />\");","                } catch (ex){","                    this._iframe = document.createElement(\"iframe\");","                    this._iframe.name = \"yuiTestTarget\";","                }","    ","                this._iframe.src = \"javascript:false\";","                this._iframe.style.visibility = \"hidden\";","                this._iframe.style.position = \"absolute\";","                this._iframe.style.top = 0;","                document.body.appendChild(this._iframe);","    ","                this._form.target = \"yuiTestTarget\";","            }","    ","            //set the form's action","            this._form.action = this.url;","        ","            //remove any existing fields","            while(this._form.hasChildNodes()){","                this._form.removeChild(this._form.lastChild);","            }","            ","            //create default fields","            this._fields.results = this.format(results);","            this._fields.useragent = navigator.userAgent;","            this._fields.timestamp = (new Date()).toLocaleString();","    ","            //add fields to the form","            for (var prop in this._fields){","                var value = this._fields[prop];","                if (this._fields.hasOwnProperty(prop) && (typeof value != \"function\")){","                    var input = document.createElement(\"input\");","                    input.type = \"hidden\";","                    input.name = prop;","                    input.value = value;","                    this._form.appendChild(input);","                }","            }","    ","            //remove default fields","            delete this._fields.results;","            delete this._fields.useragent;","            delete this._fields.timestamp;","            ","            if (arguments[1] !== false){","                this._form.submit();","            }","        ","        }","    ","    };","    ","    /**","     * Runs test suites and test cases, providing events to allowing for the","     * interpretation of test results.","     * @namespace Test","     * @module test"," * @class TestRunner","     * @static","     */","    YUITest.TestRunner = function(){","","        /*(intentionally not documented)","         * Determines if any of the array of test groups appears","         * in the given TestRunner filter.","         * @param {Array} testGroups The array of test groups to","         *      search for.","         * @param {String} filter The TestRunner groups filter.","         */","        function inGroups(testGroups, filter){","            if (!filter.length){","                return true;","            } else {                ","                if (testGroups){","                    for (var i=0, len=testGroups.length; i < len; i++){","                        if (filter.indexOf(\",\" + testGroups[i] + \",\") > -1){","                            return true;","                        }","                    }","                }","                return false;","            }","        }","    ","        /**","         * A node in the test tree structure. May represent a TestSuite, TestCase, or","         * test function.","         * @param {Variant} testObject A TestSuite, TestCase, or the name of a test function.","         * @module test"," * @class TestNode","         * @constructor","         * @private","         */","        function TestNode(testObject){","        ","            /**","             * The TestSuite, TestCase, or test function represented by this node.","             * @type Variant","             * @property testObject","             */","            this.testObject = testObject;","            ","            /**","             * Pointer to this node's first child.","             * @type TestNode","             * @property firstChild","             */        ","            this.firstChild = null;","            ","            /**","             * Pointer to this node's last child.","             * @type TestNode","             * @property lastChild","             */        ","            this.lastChild = null;","            ","            /**","             * Pointer to this node's parent.","             * @type TestNode","             * @property parent","             */        ","            this.parent = null; ","       ","            /**","             * Pointer to this node's next sibling.","             * @type TestNode","             * @property next","             */        ","            this.next = null;","            ","            /**","             * Test results for this test object.","             * @type object","             * @property results","             */                ","            this.results = new YUITest.Results();","            ","            //initialize results","            if (testObject instanceof YUITest.TestSuite){","                this.results.type = \"testsuite\";","                this.results.name = testObject.name;","            } else if (testObject instanceof YUITest.TestCase){","                this.results.type = \"testcase\";","                this.results.name = testObject.name;","            }","           ","        }","        ","        TestNode.prototype = {","        ","            /**","             * Appends a new test object (TestSuite, TestCase, or test function name) as a child","             * of this node.","             * @param {Variant} testObject A TestSuite, TestCase, or the name of a test function.","             * @return {Void}","             * @method appendChild","             */","            appendChild : function (testObject){","                var node = new TestNode(testObject);","                if (this.firstChild === null){","                    this.firstChild = this.lastChild = node;","                } else {","                    this.lastChild.next = node;","                    this.lastChild = node;","                }","                node.parent = this;","                return node;","            }       ","        };","    ","        /**","         * Runs test suites and test cases, providing events to allowing for the","         * interpretation of test results.","         * @namespace Test","         * @module test"," * @class Runner","         * @static","         */","        function TestRunner(){","        ","            //inherit from EventTarget","            YUITest.EventTarget.call(this);","            ","            /**","             * Suite on which to attach all TestSuites and TestCases to be run.","             * @type YUITest.TestSuite","             * @property masterSuite","             * @static","             * @private","             */","            this.masterSuite = new YUITest.TestSuite(YUITest.guid('testSuite_'));","    ","            /**","             * Pointer to the current node in the test tree.","             * @type TestNode","             * @private","             * @property _cur","             * @static","             */","            this._cur = null;","            ","            /**","             * Pointer to the root node in the test tree.","             * @type TestNode","             * @private","             * @property _root","             * @static","             */","            this._root = null;","            ","            /**","             * Indicates if the TestRunner will log events or not.","             * @type Boolean","             * @property _log","             * @private","             * @static","             */","            this._log = true;","            ","            /**","             * Indicates if the TestRunner is waiting as a result of","             * wait() being called.","             * @type Boolean","             * @property _waiting","             * @private","             * @static","             */","            this._waiting = false;","            ","            /**","             * Indicates if the TestRunner is currently running tests.","             * @type Boolean","             * @private","             * @property _running","             * @static","             */","            this._running = false;","            ","            /**","             * Holds copy of the results object generated when all tests are","             * complete.","             * @type Object","             * @private","             * @property _lastResults","             * @static","             */","            this._lastResults = null;       ","            ","            /**","             * Data object that is passed around from method to method.","             * @type Object","             * @private","             * @property _data","             * @static","             */","            this._context = null;","            ","            /**","             * The list of test groups to run. The list is represented","             * by a comma delimited string with commas at the start and","             * end.","             * @type String","             * @private","             * @property _groups","             * @static","             */","            this._groups = \"\";","","        }","        ","        TestRunner.prototype = YUITest.Util.mix(new YUITest.EventTarget(), {","            ","            /**","            * If true, YUITest will not fire an error for tests with no Asserts.","            * @prop _ignoreEmpty","            * @private","            * @type Boolean","            * @static","            */","            _ignoreEmpty: false,","","            //restore prototype","            constructor: YUITest.TestRunner,","        ","            //-------------------------------------------------------------------------","            // Constants","            //-------------------------------------------------------------------------","             ","            /**","             * Fires when a test case is opened but before the first ","             * test is executed.","             * @event testcasebegin","             * @static","             */         ","            TEST_CASE_BEGIN_EVENT : \"testcasebegin\",","            ","            /**","             * Fires when all tests in a test case have been executed.","             * @event testcasecomplete","             * @static","             */        ","            TEST_CASE_COMPLETE_EVENT : \"testcasecomplete\",","            ","            /**","             * Fires when a test suite is opened but before the first ","             * test is executed.","             * @event testsuitebegin","             * @static","             */        ","            TEST_SUITE_BEGIN_EVENT : \"testsuitebegin\",","            ","            /**","             * Fires when all test cases in a test suite have been","             * completed.","             * @event testsuitecomplete","             * @static","             */        ","            TEST_SUITE_COMPLETE_EVENT : \"testsuitecomplete\",","            ","            /**","             * Fires when a test has passed.","             * @event pass","             * @static","             */        ","            TEST_PASS_EVENT : \"pass\",","            ","            /**","             * Fires when a test has failed.","             * @event fail","             * @static","             */        ","            TEST_FAIL_EVENT : \"fail\",","            ","            /**","             * Fires when a non-test method has an error.","             * @event error","             * @static","             */        ","            ERROR_EVENT : \"error\",","            ","            /**","             * Fires when a test has been ignored.","             * @event ignore","             * @static","             */        ","            TEST_IGNORE_EVENT : \"ignore\",","            ","            /**","             * Fires when all test suites and test cases have been completed.","             * @event complete","             * @static","             */        ","            COMPLETE_EVENT : \"complete\",","            ","            /**","             * Fires when the run() method is called.","             * @event begin","             * @static","             */        ","            BEGIN_EVENT : \"begin\",                           ","","            //-------------------------------------------------------------------------","            // Test Tree-Related Methods","            //-------------------------------------------------------------------------","    ","            /**","             * Adds a test case to the test tree as a child of the specified node.","             * @param {TestNode} parentNode The node to add the test case to as a child.","             * @param {Test.TestCase} testCase The test case to add.","             * @return {Void}","             * @static","             * @private","             * @method _addTestCaseToTestTree","             */","           _addTestCaseToTestTree : function (parentNode, testCase){","                ","                //add the test suite","                var node = parentNode.appendChild(testCase),","                    prop,","                    testName;","                ","                //iterate over the items in the test case","                for (prop in testCase){","                    if ((prop.indexOf(\"test\") === 0 || prop.indexOf(\" \") > -1) && typeof testCase[prop] == \"function\"){","                        node.appendChild(prop);","                    }","                }","             ","            },","            ","            /**","             * Adds a test suite to the test tree as a child of the specified node.","             * @param {TestNode} parentNode The node to add the test suite to as a child.","             * @param {Test.TestSuite} testSuite The test suite to add.","             * @return {Void}","             * @static","             * @private","             * @method _addTestSuiteToTestTree","             */","            _addTestSuiteToTestTree : function (parentNode, testSuite) {","                ","                //add the test suite","                var node = parentNode.appendChild(testSuite);","                ","                //iterate over the items in the master suite","                for (var i=0; i < testSuite.items.length; i++){","                    if (testSuite.items[i] instanceof YUITest.TestSuite) {","                        this._addTestSuiteToTestTree(node, testSuite.items[i]);","                    } else if (testSuite.items[i] instanceof YUITest.TestCase) {","                        this._addTestCaseToTestTree(node, testSuite.items[i]);","                    }                   ","                }            ","            },","            ","            /**","             * Builds the test tree based on items in the master suite. The tree is a hierarchical","             * representation of the test suites, test cases, and test functions. The resulting tree","             * is stored in _root and the pointer _cur is set to the root initially.","             * @return {Void}","             * @static","             * @private","             * @method _buildTestTree","             */","            _buildTestTree : function () {","            ","                this._root = new TestNode(this.masterSuite);","                //this._cur = this._root;","                ","                //iterate over the items in the master suite","                for (var i=0; i < this.masterSuite.items.length; i++){","                    if (this.masterSuite.items[i] instanceof YUITest.TestSuite) {","                        this._addTestSuiteToTestTree(this._root, this.masterSuite.items[i]);","                    } else if (this.masterSuite.items[i] instanceof YUITest.TestCase) {","                        this._addTestCaseToTestTree(this._root, this.masterSuite.items[i]);","                    }                   ","                }            ","            ","            }, ","        ","            //-------------------------------------------------------------------------","            // Private Methods","            //-------------------------------------------------------------------------","            ","            /**","             * Handles the completion of a test object's tests. Tallies test results ","             * from one level up to the next.","             * @param {TestNode} node The TestNode representing the test object.","             * @return {Void}","             * @method _handleTestObjectComplete","             * @private","             */","            _handleTestObjectComplete : function (node) {","                var parentNode;","                ","                if (node && (typeof node.testObject == \"object\")) {","                    parentNode = node.parent;","                ","                    if (parentNode){","                        parentNode.results.include(node.results); ","                        parentNode.results[node.testObject.name] = node.results;","                    }","                ","                    if (node.testObject instanceof YUITest.TestSuite){","                        this._execNonTestMethod(node, \"tearDown\", false);","                        node.results.duration = (new Date()) - node._start;","                        this.fire({ type: this.TEST_SUITE_COMPLETE_EVENT, testSuite: node.testObject, results: node.results});","                    } else if (node.testObject instanceof YUITest.TestCase){","                        this._execNonTestMethod(node, \"destroy\", false);","                        node.results.duration = (new Date()) - node._start;","                        this.fire({ type: this.TEST_CASE_COMPLETE_EVENT, testCase: node.testObject, results: node.results});","                    }      ","                } ","            },                ","            ","            //-------------------------------------------------------------------------","            // Navigation Methods","            //-------------------------------------------------------------------------","            ","            /**","             * Retrieves the next node in the test tree.","             * @return {TestNode} The next node in the test tree or null if the end is reached.","             * @private","             * @static","             * @method _next","             */","            _next : function () {","            ","                if (this._cur === null){","                    this._cur = this._root;","                } else if (this._cur.firstChild) {","                    this._cur = this._cur.firstChild;","                } else if (this._cur.next) {","                    this._cur = this._cur.next;            ","                } else {","                    while (this._cur && !this._cur.next && this._cur !== this._root){","                        this._handleTestObjectComplete(this._cur);","                        this._cur = this._cur.parent;","                    }","                    ","                    this._handleTestObjectComplete(this._cur);               ","                        ","                    if (this._cur == this._root){","                        this._cur.results.type = \"report\";","                        this._cur.results.timestamp = (new Date()).toLocaleString();","                        this._cur.results.duration = (new Date()) - this._cur._start;   ","                        this._lastResults = this._cur.results;","                        this._running = false;                         ","                        this.fire({ type: this.COMPLETE_EVENT, results: this._lastResults});","                        this._cur = null;","                    } else if (this._cur) {","                        this._cur = this._cur.next;                ","                    }","                }","            ","                return this._cur;","            },","            ","            /**","             * Executes a non-test method (init, setUp, tearDown, destroy)","             * and traps an errors. If an error occurs, an error event is","             * fired.","             * @param {Object} node The test node in the testing tree.","             * @param {String} methodName The name of the method to execute.","             * @param {Boolean} allowAsync Determines if the method can be called asynchronously.","             * @return {Boolean} True if an async method was called, false if not.","             * @method _execNonTestMethod","             * @private","             */","            _execNonTestMethod: function(node, methodName, allowAsync){","                var testObject = node.testObject,","                    event = { type: this.ERROR_EVENT };","                try {","                    if (allowAsync && testObject[\"async:\" + methodName]){","                        testObject[\"async:\" + methodName](this._context);","                        return true;","                    } else {","                        testObject[methodName](this._context);","                    }","                } catch (ex){","                    node.results.errors++;","                    event.error = ex;","                    event.methodName = methodName;","                    if (testObject instanceof YUITest.TestCase){","                        event.testCase = testObject;","                    } else {","                        event.testSuite = testSuite;","                    }","                    ","                    this.fire(event);","                }  ","","                return false;","            },","            ","            /**","             * Runs a test case or test suite, returning the results.","             * @param {Test.TestCase|YUITest.TestSuite} testObject The test case or test suite to run.","             * @return {Object} Results of the execution with properties passed, failed, and total.","             * @private","             * @method _run","             * @static","             */","            _run : function () {","            ","                //flag to indicate if the TestRunner should wait before continuing","                var shouldWait = false;","                ","                //get the next test node","                var node = this._next();","                ","                if (node !== null) {","                ","                    //set flag to say the testrunner is running","                    this._running = true;","                    ","                    //eliminate last results","                    this._lastResult = null;                  ","                ","                    var testObject = node.testObject;","                    ","                    //figure out what to do","                    if (typeof testObject == \"object\" && testObject !== null){","                        if (testObject instanceof YUITest.TestSuite){","                            this.fire({ type: this.TEST_SUITE_BEGIN_EVENT, testSuite: testObject });","                            node._start = new Date();","                            this._execNonTestMethod(node, \"setUp\" ,false);","                        } else if (testObject instanceof YUITest.TestCase){","                            this.fire({ type: this.TEST_CASE_BEGIN_EVENT, testCase: testObject });","                            node._start = new Date();","                            ","                            //regular or async init","                            /*try {","                                if (testObject[\"async:init\"]){","                                    testObject[\"async:init\"](this._context);","                                    return;","                                } else {","                                    testObject.init(this._context);","                                }","                            } catch (ex){","                                node.results.errors++;","                                this.fire({ type: this.ERROR_EVENT, error: ex, testCase: testObject, methodName: \"init\" });","                            }*/","                            if(this._execNonTestMethod(node, \"init\", true)){","                                return;","                            }","                        }","                        ","                        //some environments don't support setTimeout","                        if (typeof setTimeout != \"undefined\"){                    ","                            setTimeout(function(){","                                YUITest.TestRunner._run();","                            }, 0);","                        } else {","                            this._run();","                        }","                    } else {","                        this._runTest(node);","                    }","    ","                }","            },","            ","            _resumeTest : function (segment) {","            ","                //get relevant information","                var node = this._cur;                ","                ","                //we know there's no more waiting now","                this._waiting = false;","                ","                //if there's no node, it probably means a wait() was called after resume()","                if (!node){","                    //TODO: Handle in some way?","                    //console.log(\"wait() called after resume()\");","                    //this.fire(\"error\", { testCase: \"(unknown)\", test: \"(unknown)\", error: new Error(\"wait() called after resume()\")} );","                    return;","                }","                ","                var testName = node.testObject;","                var testCase = node.parent.testObject;","            ","                //cancel other waits if available","                if (testCase.__yui_wait){","                    clearTimeout(testCase.__yui_wait);","                    delete testCase.__yui_wait;","                }","","                //get the \"should\" test cases","                var shouldFail = testName.indexOf(\"fail:\") === 0 ||","                                    (testCase._should.fail || {})[testName];","                var shouldError = (testCase._should.error || {})[testName];","                ","                //variable to hold whether or not the test failed","                var failed = false;","                var error = null;","                    ","                //try the test","                try {","                ","                    //run the test","                    segment.call(testCase, this._context);                    ","                ","                    //if the test hasn't already failed and doesn't have any asserts...","                    if(YUITest.Assert._getCount() == 0 && !this._ignoreEmpty){","                        throw new YUITest.AssertionError(\"Test has no asserts.\");","                    }                                                        ","                    //if it should fail, and it got here, then it's a fail because it didn't","                     else if (shouldFail){","                        error = new YUITest.ShouldFail();","                        failed = true;","                    } else if (shouldError){","                        error = new YUITest.ShouldError();","                        failed = true;","                    }","                               ","                } catch (thrown){","","                    //cancel any pending waits, the test already failed","                    if (testCase.__yui_wait){","                        clearTimeout(testCase.__yui_wait);","                        delete testCase.__yui_wait;","                    }                    ","                ","                    //figure out what type of error it was","                    if (thrown instanceof YUITest.AssertionError) {","                        if (!shouldFail){","                            error = thrown;","                            failed = true;","                        }","                    } else if (thrown instanceof YUITest.Wait){","                    ","                        if (typeof thrown.segment == \"function\"){","                            if (typeof thrown.delay == \"number\"){","                            ","                                //some environments don't support setTimeout","                                if (typeof setTimeout != \"undefined\"){","                                    testCase.__yui_wait = setTimeout(function(){","                                        YUITest.TestRunner._resumeTest(thrown.segment);","                                    }, thrown.delay);","                                    this._waiting = true;","                                } else {","                                    throw new Error(\"Asynchronous tests not supported in this environment.\");","                                }","                            }","                        }","                        ","                        return;","                    ","                    } else {","                        //first check to see if it should error","                        if (!shouldError) {                        ","                            error = new YUITest.UnexpectedError(thrown);","                            failed = true;","                        } else {","                            //check to see what type of data we have","                            if (typeof shouldError == \"string\"){","                                ","                                //if it's a string, check the error message","                                if (thrown.message != shouldError){","                                    error = new YUITest.UnexpectedError(thrown);","                                    failed = true;                                    ","                                }","                            } else if (typeof shouldError == \"function\"){","                            ","                                //if it's a function, see if the error is an instance of it","                                if (!(thrown instanceof shouldError)){","                                    error = new YUITest.UnexpectedError(thrown);","                                    failed = true;","                                }","                            ","                            } else if (typeof shouldError == \"object\" && shouldError !== null){","                            ","                                //if it's an object, check the instance and message","                                if (!(thrown instanceof shouldError.constructor) || ","                                        thrown.message != shouldError.message){","                                    error = new YUITest.UnexpectedError(thrown);","                                    failed = true;                                    ","                                }","                            ","                            }","                        ","                        }","                    }","                    ","                }","                ","                //fire appropriate event","                if (failed) {","                    this.fire({ type: this.TEST_FAIL_EVENT, testCase: testCase, testName: testName, error: error });","                } else {","                    this.fire({ type: this.TEST_PASS_EVENT, testCase: testCase, testName: testName });","                }","                ","                //run the tear down","                this._execNonTestMethod(node.parent, \"tearDown\", false);","                ","                //reset the assert count","                YUITest.Assert._reset();","                ","                //calculate duration","                var duration = (new Date()) - node._start;","                ","                //update results","                node.parent.results[testName] = { ","                    result: failed ? \"fail\" : \"pass\",","                    message: error ? error.getMessage() : \"Test passed\",","                    type: \"test\",","                    name: testName,","                    duration: duration","                };","                ","                if (failed){","                    node.parent.results.failed++;","                } else {","                    node.parent.results.passed++;","                }","                node.parent.results.total++;","    ","                //set timeout not supported in all environments","                if (typeof setTimeout != \"undefined\"){","                    setTimeout(function(){","                        YUITest.TestRunner._run();","                    }, 0);","                } else {","                    this._run();","                }","            ","            },","            ","            /**","             * Handles an error as if it occurred within the currently executing","             * test. This is for mock methods that may be called asynchronously","             * and therefore out of the scope of the TestRunner. Previously, this","             * error would bubble up to the browser. Now, this method is used","             * to tell TestRunner about the error. This should never be called","             * by anyplace other than the Mock object.","             * @param {Error} error The error object.","             * @return {Void}","             * @method _handleError","             * @private","             * @static","             */","            _handleError: function(error){","            ","                if (this._waiting){","                    this._resumeTest(function(){","                        throw error;","                    });","                } else {","                    throw error;","                }           ","            ","            },","                    ","            /**","             * Runs a single test based on the data provided in the node.","             * @method _runTest","             * @param {TestNode} node The TestNode representing the test to run.","             * @return {Void}","             * @static","             * @private","             */","            _runTest : function (node) {","            ","                //get relevant information","                var testName = node.testObject,","                    testCase = node.parent.testObject,","                    test = testCase[testName],","                ","                    //get the \"should\" test cases","                    shouldIgnore = testName.indexOf(\"ignore:\") === 0 ||","                                    !inGroups(testCase.groups, this._groups) ||","                                    (testCase._should.ignore || {})[testName];   //deprecated","                ","                //figure out if the test should be ignored or not","                if (shouldIgnore){","                ","                    //update results","                    node.parent.results[testName] = { ","                        result: \"ignore\",","                        message: \"Test ignored\",","                        type: \"test\",","                        name: testName.indexOf(\"ignore:\") === 0 ? testName.substring(7) : testName","                    };","                    ","                    node.parent.results.ignored++;","                    node.parent.results.total++;","                ","                    this.fire({ type: this.TEST_IGNORE_EVENT,  testCase: testCase, testName: testName });","                    ","                    //some environments don't support setTimeout","                    if (typeof setTimeout != \"undefined\"){                    ","                        setTimeout(function(){","                            YUITest.TestRunner._run();","                        }, 0);              ","                    } else {","                        this._run();","                    }","    ","                } else {","                ","                    //mark the start time","                    node._start = new Date();","                ","                    //run the setup","                    this._execNonTestMethod(node.parent, \"setUp\", false);","                    ","                    //now call the body of the test","                    this._resumeTest(test);                ","                }","    ","            },            ","","            //-------------------------------------------------------------------------","            // Misc Methods","            //-------------------------------------------------------------------------   ","","            /**","             * Retrieves the name of the current result set.","             * @return {String} The name of the result set.","             * @method getName","             */","            getName: function(){","                return this.masterSuite.name;","            },         ","","            /**","             * The name assigned to the master suite of the TestRunner. This is the name","             * that is output as the root's name when results are retrieved.","             * @param {String} name The name of the result set.","             * @return {Void}","             * @method setName","             */","            setName: function(name){","                this.masterSuite.name = name;","            },            ","            ","            //-------------------------------------------------------------------------","            // Public Methods","            //-------------------------------------------------------------------------   ","        ","            /**","             * Adds a test suite or test case to the list of test objects to run.","             * @param testObject Either a TestCase or a TestSuite that should be run.","             * @return {Void}","             * @method add","             * @static","             */","            add : function (testObject) {","                this.masterSuite.add(testObject);","                return this;","            },","            ","            /**","             * Removes all test objects from the runner.","             * @return {Void}","             * @method clear","             * @static","             */","            clear : function () {","                this.masterSuite = new YUITest.TestSuite(YUITest.guid('testSuite_'));","            },","            ","            /**","             * Indicates if the TestRunner is waiting for a test to resume","             * @return {Boolean} True if the TestRunner is waiting, false if not.","             * @method isWaiting","             * @static","             */","            isWaiting: function() {","                return this._waiting;","            },","            ","            /**","             * Indicates that the TestRunner is busy running tests and therefore can't","             * be stopped and results cannot be gathered.","             * @return {Boolean} True if the TestRunner is running, false if not.","             * @method isRunning","             */","            isRunning: function(){","                return this._running;","            },","            ","            /**","             * Returns the last complete results set from the TestRunner. Null is returned","             * if the TestRunner is running or no tests have been run.","             * @param {Function} format (Optional) A test format to return the results in.","             * @return {Object|String} Either the results object or, if a test format is ","             *      passed as the argument, a string representing the results in a specific","             *      format.","             * @method getResults","             */","            getResults: function(format){","                if (!this._running && this._lastResults){","                    if (typeof format == \"function\"){","                        return format(this._lastResults);                    ","                    } else {","                        return this._lastResults;","                    }","                } else {","                    return null;","                }","            },            ","            ","            /**","             * Returns the coverage report for the files that have been executed.","             * This returns only coverage information for files that have been","             * instrumented using YUI Test Coverage and only those that were run","             * in the same pass.","             * @param {Function} format (Optional) A coverage format to return results in.","             * @return {Object|String} Either the coverage object or, if a coverage","             *      format is specified, a string representing the results in that format.","             * @method getCoverage","             */","            getCoverage: function(format){","                if (!this._running && typeof _yuitest_coverage == \"object\"){","                    if (typeof format == \"function\"){","                        return format(_yuitest_coverage);                    ","                    } else {","                        return _yuitest_coverage;","                    }","                } else {","                    return null;","                }            ","            },","            ","            /**","             * Used to continue processing when a method marked with","             * \"async:\" is executed. This should not be used in test","             * methods, only in init(). Each argument is a string, and","             * when the returned function is executed, the arguments","             * are assigned to the context data object using the string","             * as the key name (value is the argument itself).","             * @private","             * @return {Function} A callback function.","             * @method callback","             */","            callback: function(){","                var names   = arguments,","                    data    = this._context,","                    that    = this;","                    ","                return function(){","                    for (var i=0; i < arguments.length; i++){","                        data[names[i]] = arguments[i];","                    }","                    that._run();","                };","            },","            ","            /**","             * Resumes the TestRunner after wait() was called.","             * @param {Function} segment The function to run as the rest","             *      of the haulted test.","             * @return {Void}","             * @method resume","             * @static","             */","            resume : function (segment) {","                if (this._waiting){","                    this._resumeTest(segment || function(){});","                } else {","                    throw new Error(\"resume() called without wait().\");","                }","            },","        ","            /**","             * Runs the test suite.","             * @param {Object|Boolean} options (Optional) Options for the runner:","             *      <code>oldMode</code> indicates the TestRunner should work in the YUI <= 2.8 way","             *      of internally managing test suites. <code>groups</code> is an array","             *      of test groups indicating which tests to run.","             * @return {Void}","             * @method run","             * @static","             */","            run : function (options) {","","                options = options || {};","                ","                //pointer to runner to avoid scope issues ","                var runner  = YUITest.TestRunner,","                    oldMode = options.oldMode;","                ","                ","                //if there's only one suite on the masterSuite, move it up","                if (!oldMode && this.masterSuite.items.length == 1 && this.masterSuite.items[0] instanceof YUITest.TestSuite){","                    this.masterSuite = this.masterSuite.items[0];","                }                ","                ","                //determine if there are any groups to filter on","                runner._groups = (options.groups instanceof Array) ? \",\" + options.groups.join(\",\") + \",\" : \"\";","                ","                //initialize the runner","                runner._buildTestTree();","                runner._context = {};","                runner._root._start = new Date();","                ","                //fire the begin event","                runner.fire(runner.BEGIN_EVENT);","           ","                //begin the testing","                runner._run();","            }    ","        });","        ","        return new TestRunner();","        ","    }();","","/**"," * The ArrayAssert object provides functions to test JavaScript array objects"," * for a variety of cases."," * @namespace Test"," * @module test"," * @class ArrayAssert"," * @static"," */"," ","YUITest.ArrayAssert = {","","    //=========================================================================","    // Private methods","    //=========================================================================","    ","    /**","     * Simple indexOf() implementation for an array. Defers to native","     * if available.","     * @param {Array} haystack The array to search.","     * @param {Variant} needle The value to locate.","     * @return {int} The index of the needle if found or -1 if not.","     * @method _indexOf","     * @private","     */","    _indexOf: function(haystack, needle){","        if (haystack.indexOf){","            return haystack.indexOf(needle);","        } else {","            for (var i=0; i < haystack.length; i++){","                if (haystack[i] === needle){","                    return i;","                }","            }","            return -1;","        }","    },","    ","    /**","     * Simple some() implementation for an array. Defers to native","     * if available.","     * @param {Array} haystack The array to search.","     * @param {Function} matcher The function to run on each value.","     * @return {Boolean} True if any value, when run through the matcher,","     *      returns true.","     * @method _some","     * @private","     */","    _some: function(haystack, matcher){","        if (haystack.some){","            return haystack.some(matcher);","        } else {","            for (var i=0; i < haystack.length; i++){","                if (matcher(haystack[i])){","                    return true;","                }","            }","            return false;","        }","    },    ","","    /**","     * Asserts that a value is present in an array. This uses the triple equals ","     * sign so no type coercion may occur.","     * @param {Object} needle The value that is expected in the array.","     * @param {Array} haystack An array of values.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method contains","     * @static","     */","    contains : function (needle, haystack, ","                           message) {","        ","        YUITest.Assert._increment();               ","","        if (this._indexOf(haystack, needle) == -1){","            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Value \" + needle + \" (\" + (typeof needle) + \") not found in array [\" + haystack + \"].\"));","        }","    },","","    /**","     * Asserts that a set of values are present in an array. This uses the triple equals ","     * sign so no type coercion may occur. For this assertion to pass, all values must","     * be found.","     * @param {Object[]} needles An array of values that are expected in the array.","     * @param {Array} haystack An array of values to check.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method containsItems","     * @static","     */","    containsItems : function (needles, haystack, ","                           message) {","        YUITest.Assert._increment();               ","","        //begin checking values","        for (var i=0; i < needles.length; i++){","            if (this._indexOf(haystack, needles[i]) == -1){","                YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Value \" + needles[i] + \" (\" + (typeof needles[i]) + \") not found in array [\" + haystack + \"].\"));","            }","        }","    },","","    /**","     * Asserts that a value matching some condition is present in an array. This uses","     * a function to determine a match.","     * @param {Function} matcher A function that returns true if the items matches or false if not.","     * @param {Array} haystack An array of values.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method containsMatch","     * @static","     */","    containsMatch : function (matcher, haystack, ","                           message) {","        ","        YUITest.Assert._increment();               ","        //check for valid matcher","        if (typeof matcher != \"function\"){","            throw new TypeError(\"ArrayAssert.containsMatch(): First argument must be a function.\");","        }","        ","        if (!this._some(haystack, matcher)){","            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"No match found in array [\" + haystack + \"].\"));","        }","    },","","    /**","     * Asserts that a value is not present in an array. This uses the triple equals ","     * Asserts that a value is not present in an array. This uses the triple equals ","     * sign so no type coercion may occur.","     * @param {Object} needle The value that is expected in the array.","     * @param {Array} haystack An array of values.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method doesNotContain","     * @static","     */","    doesNotContain : function (needle, haystack, ","                           message) {","        ","        YUITest.Assert._increment();               ","","        if (this._indexOf(haystack, needle) > -1){","            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Value found in array [\" + haystack + \"].\"));","        }","    },","","    /**","     * Asserts that a set of values are not present in an array. This uses the triple equals ","     * sign so no type coercion may occur. For this assertion to pass, all values must","     * not be found.","     * @param {Object[]} needles An array of values that are not expected in the array.","     * @param {Array} haystack An array of values to check.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method doesNotContainItems","     * @static","     */","    doesNotContainItems : function (needles, haystack, ","                           message) {","","        YUITest.Assert._increment();               ","","        for (var i=0; i < needles.length; i++){","            if (this._indexOf(haystack, needles[i]) > -1){","                YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Value found in array [\" + haystack + \"].\"));","            }","        }","","    },","        ","    /**","     * Asserts that no values matching a condition are present in an array. This uses","     * a function to determine a match.","     * @param {Function} matcher A function that returns true if the item matches or false if not.","     * @param {Array} haystack An array of values.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method doesNotContainMatch","     * @static","     */","    doesNotContainMatch : function (matcher, haystack, ","                           message) {","        ","        YUITest.Assert._increment();     ","      ","        //check for valid matcher","        if (typeof matcher != \"function\"){","            throw new TypeError(\"ArrayAssert.doesNotContainMatch(): First argument must be a function.\");","        }","        ","        if (this._some(haystack, matcher)){","            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Value found in array [\" + haystack + \"].\"));","        }","    },","        ","    /**","     * Asserts that the given value is contained in an array at the specified index.","     * This uses the triple equals sign so no type coercion will occur.","     * @param {Object} needle The value to look for.","     * @param {Array} haystack The array to search in.","     * @param {int} index The index at which the value should exist.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method indexOf","     * @static","     */","    indexOf : function (needle, haystack, index, message) {","    ","        YUITest.Assert._increment();     ","","        //try to find the value in the array","        for (var i=0; i < haystack.length; i++){","            if (haystack[i] === needle){","                if (index != i){","                    YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Value exists at index \" + i + \" but should be at index \" + index + \".\"));                    ","                }","                return;","            }","        }","        ","        //if it makes it here, it wasn't found at all","        YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Value doesn't exist in array [\" + haystack + \"].\"));","    },","        ","    /**","     * Asserts that the values in an array are equal, and in the same position,","     * as values in another array. This uses the double equals sign","     * so type coercion may occur. Note that the array objects themselves","     * need not be the same for this test to pass.","     * @param {Array} expected An array of the expected values.","     * @param {Array} actual Any array of the actual values.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method itemsAreEqual","     * @static","     */","    itemsAreEqual : function (expected, actual, ","                           message) {","        ","        YUITest.Assert._increment();     ","        ","        //first make sure they're array-like (this can probably be improved)","        if (typeof expected != \"object\" || typeof actual != \"object\"){","            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Value should be an array.\"));","        }","        ","        //next check array length","        if (expected.length != actual.length){","            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Array should have a length of \" + expected.length + \" but has a length of \" + actual.length + \".\"));","        }","       ","        //begin checking values","        for (var i=0; i < expected.length; i++){","            if (expected[i] != actual[i]){","                throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, \"Values in position \" + i + \" are not equal.\"), expected[i], actual[i]);","            }","        }","    },","    ","    /**","     * Asserts that the values in an array are equivalent, and in the same position,","     * as values in another array. This uses a function to determine if the values","     * are equivalent. Note that the array objects themselves","     * need not be the same for this test to pass.","     * @param {Array} expected An array of the expected values.","     * @param {Array} actual Any array of the actual values.","     * @param {Function} comparator A function that returns true if the values are equivalent","     *      or false if not.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @return {Void}","     * @method itemsAreEquivalent","     * @static","     */","    itemsAreEquivalent : function (expected, actual, ","                           comparator, message) {","        ","        YUITest.Assert._increment();     ","","        //make sure the comparator is valid","        if (typeof comparator != \"function\"){","            throw new TypeError(\"ArrayAssert.itemsAreEquivalent(): Third argument must be a function.\");","        }","        ","        //first check array length","        if (expected.length != actual.length){","            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Array should have a length of \" + expected.length + \" but has a length of \" + actual.length));","        }","        ","        //begin checking values","        for (var i=0; i < expected.length; i++){","            if (!comparator(expected[i], actual[i])){","                throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, \"Values in position \" + i + \" are not equivalent.\"), expected[i], actual[i]);","            }","        }","    },","    ","    /**","     * Asserts that an array is empty.","     * @param {Array} actual The array to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isEmpty","     * @static","     */","    isEmpty : function (actual, message) {        ","        YUITest.Assert._increment();     ","        if (actual.length > 0){","            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Array should be empty.\"));","        }","    },    ","    ","    /**","     * Asserts that an array is not empty.","     * @param {Array} actual The array to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isNotEmpty","     * @static","     */","    isNotEmpty : function (actual, message) {        ","        YUITest.Assert._increment();     ","        if (actual.length === 0){","            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Array should not be empty.\"));","        }","    },    ","    ","    /**","     * Asserts that the values in an array are the same, and in the same position,","     * as values in another array. This uses the triple equals sign","     * so no type coercion will occur. Note that the array objects themselves","     * need not be the same for this test to pass.","     * @param {Array} expected An array of the expected values.","     * @param {Array} actual Any array of the actual values.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method itemsAreSame","     * @static","     */","    itemsAreSame : function (expected, actual, ","                          message) {","        ","        YUITest.Assert._increment();     ","","        //first check array length","        if (expected.length != actual.length){","            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Array should have a length of \" + expected.length + \" but has a length of \" + actual.length));","        }","                    ","        //begin checking values","        for (var i=0; i < expected.length; i++){","            if (expected[i] !== actual[i]){","                throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, \"Values in position \" + i + \" are not the same.\"), expected[i], actual[i]);","            }","        }","    },","    ","    /**","     * Asserts that the given value is contained in an array at the specified index,","     * starting from the back of the array.","     * This uses the triple equals sign so no type coercion will occur.","     * @param {Object} needle The value to look for.","     * @param {Array} haystack The array to search in.","     * @param {int} index The index at which the value should exist.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method lastIndexOf","     * @static","     */","    lastIndexOf : function (needle, haystack, index, message) {","    ","        //try to find the value in the array","        for (var i=haystack.length; i >= 0; i--){","            if (haystack[i] === needle){","                if (index != i){","                    YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Value exists at index \" + i + \" but should be at index \" + index + \".\"));                    ","                }","                return;","            }","        }","        ","        //if it makes it here, it wasn't found at all","        YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Value doesn't exist in array.\"));        ","    }","    ","};","  ","/**"," * The Assert object provides functions to test JavaScript values against"," * known and expected results. Whenever a comparison (assertion) fails,"," * an error is thrown."," * @namespace Test"," * @module test"," * @class Assert"," * @static"," */","YUITest.Assert = {","","    /**","     * The number of assertions performed.","     * @property _asserts","     * @type int","     * @private","     */","    _asserts: 0,","","    //-------------------------------------------------------------------------","    // Helper Methods","    //-------------------------------------------------------------------------","    ","    /**","     * Formats a message so that it can contain the original assertion message","     * in addition to the custom message.","     * @param {String} customMessage The message passed in by the developer.","     * @param {String} defaultMessage The message created by the error by default.","     * @return {String} The final error message, containing either or both.","     * @protected","     * @static","     * @method _formatMessage","     */","    _formatMessage : function (customMessage, defaultMessage) {","        if (typeof customMessage == \"string\" && customMessage.length > 0){","            return customMessage.replace(\"{message}\", defaultMessage);","        } else {","            return defaultMessage;","        }        ","    },","    ","    /**","     * Returns the number of assertions that have been performed.","     * @method _getCount","     * @protected","     * @static","     */","    _getCount: function(){","        return this._asserts;","    },","    ","    /**","     * Increments the number of assertions that have been performed.","     * @method _increment","     * @protected","     * @static","     */","    _increment: function(){","        this._asserts++;","    },","    ","    /**","     * Resets the number of assertions that have been performed to 0.","     * @method _reset","     * @protected","     * @static","     */","    _reset: function(){","        this._asserts = 0;","    },","    ","    //-------------------------------------------------------------------------","    // Generic Assertion Methods","    //-------------------------------------------------------------------------","    ","    /** ","     * Forces an assertion error to occur.","     * @param {String} message (Optional) The message to display with the failure.","     * @method fail","     * @static","     */","    fail : function (message) {","        throw new YUITest.AssertionError(YUITest.Assert._formatMessage(message, \"Test force-failed.\"));","    },       ","    ","    /** ","     * A marker that the test should pass.","     * @method pass","     * @static","     */","    pass : function (message) {","        YUITest.Assert._increment();","    },       ","    ","    //-------------------------------------------------------------------------","    // Equality Assertion Methods","    //-------------------------------------------------------------------------    ","    ","    /**","     * Asserts that a value is equal to another. This uses the double equals sign","     * so type coercion may occur.","     * @param {Object} expected The expected value.","     * @param {Object} actual The actual value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method areEqual","     * @static","     */","    areEqual : function (expected, actual, message) {","        YUITest.Assert._increment();","        if (expected != actual) {","            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, \"Values should be equal.\"), expected, actual);","        }","    },","    ","    /**","     * Asserts that a value is not equal to another. This uses the double equals sign","     * so type coercion may occur.","     * @param {Object} unexpected The unexpected value.","     * @param {Object} actual The actual value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method areNotEqual","     * @static","     */","    areNotEqual : function (unexpected, actual, ","                         message) {","        YUITest.Assert._increment();","        if (unexpected == actual) {","            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, \"Values should not be equal.\"), unexpected);","        }","    },","    ","    /**","     * Asserts that a value is not the same as another. This uses the triple equals sign","     * so no type coercion may occur.","     * @param {Object} unexpected The unexpected value.","     * @param {Object} actual The actual value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method areNotSame","     * @static","     */","    areNotSame : function (unexpected, actual, message) {","        YUITest.Assert._increment();","        if (unexpected === actual) {","            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, \"Values should not be the same.\"), unexpected);","        }","    },","","    /**","     * Asserts that a value is the same as another. This uses the triple equals sign","     * so no type coercion may occur.","     * @param {Object} expected The expected value.","     * @param {Object} actual The actual value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method areSame","     * @static","     */","    areSame : function (expected, actual, message) {","        YUITest.Assert._increment();","        if (expected !== actual) {","            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, \"Values should be the same.\"), expected, actual);","        }","    },    ","    ","    //-------------------------------------------------------------------------","    // Boolean Assertion Methods","    //-------------------------------------------------------------------------    ","    ","    /**","     * Asserts that a value is false. This uses the triple equals sign","     * so no type coercion may occur.","     * @param {Object} actual The actual value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isFalse","     * @static","     */","    isFalse : function (actual, message) {","        YUITest.Assert._increment();","        if (false !== actual) {","            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, \"Value should be false.\"), false, actual);","        }","    },","    ","    /**","     * Asserts that a value is true. This uses the triple equals sign","     * so no type coercion may occur.","     * @param {Object} actual The actual value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isTrue","     * @static","     */","    isTrue : function (actual, message) {","        YUITest.Assert._increment();","        if (true !== actual) {","            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, \"Value should be true.\"), true, actual);","        }","","    },","    ","    //-------------------------------------------------------------------------","    // Special Value Assertion Methods","    //-------------------------------------------------------------------------    ","    ","    /**","     * Asserts that a value is not a number.","     * @param {Object} actual The value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isNaN","     * @static","     */","    isNaN : function (actual, message){","        YUITest.Assert._increment();","        if (!isNaN(actual)){","            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, \"Value should be NaN.\"), NaN, actual);","        }    ","    },","    ","    /**","     * Asserts that a value is not the special NaN value.","     * @param {Object} actual The value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isNotNaN","     * @static","     */","    isNotNaN : function (actual, message){","        YUITest.Assert._increment();","        if (isNaN(actual)){","            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, \"Values should not be NaN.\"), NaN);","        }    ","    },","    ","    /**","     * Asserts that a value is not null. This uses the triple equals sign","     * so no type coercion may occur.","     * @param {Object} actual The actual value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isNotNull","     * @static","     */","    isNotNull : function (actual, message) {","        YUITest.Assert._increment();","        if (actual === null) {","            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, \"Values should not be null.\"), null);","        }","    },","","    /**","     * Asserts that a value is not undefined. This uses the triple equals sign","     * so no type coercion may occur.","     * @param {Object} actual The actual value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isNotUndefined","     * @static","     */","    isNotUndefined : function (actual, message) {","        YUITest.Assert._increment();","        if (typeof actual == \"undefined\") {","            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, \"Value should not be undefined.\"), undefined);","        }","    },","","    /**","     * Asserts that a value is null. This uses the triple equals sign","     * so no type coercion may occur.","     * @param {Object} actual The actual value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isNull","     * @static","     */","    isNull : function (actual, message) {","        YUITest.Assert._increment();","        if (actual !== null) {","            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, \"Value should be null.\"), null, actual);","        }","    },","        ","    /**","     * Asserts that a value is undefined. This uses the triple equals sign","     * so no type coercion may occur.","     * @param {Object} actual The actual value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isUndefined","     * @static","     */","    isUndefined : function (actual, message) {","        YUITest.Assert._increment();","        if (typeof actual != \"undefined\") {","            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, \"Value should be undefined.\"), undefined, actual);","        }","    },    ","    ","    //--------------------------------------------------------------------------","    // Instance Assertion Methods","    //--------------------------------------------------------------------------    ","   ","    /**","     * Asserts that a value is an array.","     * @param {Object} actual The value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isArray","     * @static","     */","    isArray : function (actual, message) {","        YUITest.Assert._increment();","        var shouldFail = false;","        if (Array.isArray){","            shouldFail = !Array.isArray(actual);","        } else {","            shouldFail = Object.prototype.toString.call(actual) != \"[object Array]\";","        }","        if (shouldFail){","            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, \"Value should be an array.\"), actual);","        }    ","    },","   ","    /**","     * Asserts that a value is a Boolean.","     * @param {Object} actual The value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isBoolean","     * @static","     */","    isBoolean : function (actual, message) {","        YUITest.Assert._increment();","        if (typeof actual != \"boolean\"){","            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, \"Value should be a Boolean.\"), actual);","        }    ","    },","   ","    /**","     * Asserts that a value is a function.","     * @param {Object} actual The value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isFunction","     * @static","     */","    isFunction : function (actual, message) {","        YUITest.Assert._increment();","        if (!(actual instanceof Function)){","            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, \"Value should be a function.\"), actual);","        }    ","    },","   ","    /**","     * Asserts that a value is an instance of a particular object. This may return","     * incorrect results when comparing objects from one frame to constructors in","     * another frame. For best results, don't use in a cross-frame manner.","     * @param {Function} expected The function that the object should be an instance of.","     * @param {Object} actual The object to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isInstanceOf","     * @static","     */","    isInstanceOf : function (expected, actual, message) {","        YUITest.Assert._increment();","        if (!(actual instanceof expected)){","            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, \"Value isn't an instance of expected type.\"), expected, actual);","        }","    },","    ","    /**","     * Asserts that a value is a number.","     * @param {Object} actual The value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isNumber","     * @static","     */","    isNumber : function (actual, message) {","        YUITest.Assert._increment();","        if (typeof actual != \"number\"){","            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, \"Value should be a number.\"), actual);","        }    ","    },    ","    ","    /**","     * Asserts that a value is an object.","     * @param {Object} actual The value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isObject","     * @static","     */","    isObject : function (actual, message) {","        YUITest.Assert._increment();","        if (!actual || (typeof actual != \"object\" && typeof actual != \"function\")){","            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, \"Value should be an object.\"), actual);","        }","    },","    ","    /**","     * Asserts that a value is a string.","     * @param {Object} actual The value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isString","     * @static","     */","    isString : function (actual, message) {","        YUITest.Assert._increment();","        if (typeof actual != \"string\"){","            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, \"Value should be a string.\"), actual);","        }","    },","    ","    /**","     * Asserts that a value is of a particular type. ","     * @param {String} expectedType The expected type of the variable.","     * @param {Object} actualValue The actual value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isTypeOf","     * @static","     */","    isTypeOf : function (expectedType, actualValue, message){","        YUITest.Assert._increment();","        if (typeof actualValue != expectedType){","            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, \"Value should be of type \" + expectedType + \".\"), expectedType, typeof actualValue);","        }","    },","    ","    //--------------------------------------------------------------------------","    // Error Detection Methods","    //--------------------------------------------------------------------------    ","   ","    /**","     * Asserts that executing a particular method should throw an error of","     * a specific type. This is a replacement for _should.error.","     * @param {String|Function|Object} expectedError If a string, this","     *      is the error message that the error must have; if a function, this","     *      is the constructor that should have been used to create the thrown","     *      error; if an object, this is an instance of a particular error type","     *      with a specific error message (both must match).","     * @param {Function} method The method to execute that should throw the error.","     * @param {String} message (Optional) The message to display if the assertion","     *      fails.","     * @method throwsError","     * @return {void}","     * @static","     */","    throwsError: function(expectedError, method, message){","        YUITest.Assert._increment();","        var error = false;","    ","        try {","            method();        ","        } catch (thrown) {","            ","            //check to see what type of data we have","            if (typeof expectedError == \"string\"){","                ","                //if it's a string, check the error message","                if (thrown.message != expectedError){","                    error = true;","                }","            } else if (typeof expectedError == \"function\"){","            ","                //if it's a function, see if the error is an instance of it","                if (!(thrown instanceof expectedError)){","                    error = true;","                }","            ","            } else if (typeof expectedError == \"object\" && expectedError !== null){","            ","                //if it's an object, check the instance and message","                if (!(thrown instanceof expectedError.constructor) || ","                        thrown.message != expectedError.message){","                    error = true;","                }","            ","            } else { //if it gets here, the argument could be wrong","                error = true;","            }","            ","            if (error){","                throw new YUITest.UnexpectedError(thrown);                    ","            } else {","                return;","            }","        }","        ","        //if it reaches here, the error wasn't thrown, which is a bad thing","        throw new YUITest.AssertionError(YUITest.Assert._formatMessage(message, \"Error should have been thrown.\"));","    }","","};","/**"," * Error is thrown whenever an assertion fails. It provides methods"," * to more easily get at error information and also provides a base class"," * from which more specific assertion errors can be derived."," *"," * @param {String} message The message to display when the error occurs."," * @namespace Test"," * @module test"," * @class AssertionError"," * @constructor"," */ ","YUITest.AssertionError = function (message){","    ","    /**","     * Error message. Must be duplicated to ensure browser receives it.","     * @type String","     * @property message","     */","    this.message = message;","    ","    /**","     * The name of the error that occurred.","     * @type String","     * @property name","     */","    this.name = \"Assert Error\";","};","","YUITest.AssertionError.prototype = {","","    //restore constructor","    constructor: YUITest.AssertionError,","","    /**","     * Returns a fully formatted error for an assertion failure. This should","     * be overridden by all subclasses to provide specific information.","     * @method getMessage","     * @return {String} A string describing the error.","     */","    getMessage : function () {","        return this.message;","    },","    ","    /**","     * Returns a string representation of the error.","     * @method toString","     * @return {String} A string representation of the error.","     */","    toString : function () {","        return this.name + \": \" + this.getMessage();","    }","","};/**"," * ComparisonFailure is subclass of Error that is thrown whenever"," * a comparison between two values fails. It provides mechanisms to retrieve"," * both the expected and actual value."," *"," * @param {String} message The message to display when the error occurs."," * @param {Object} expected The expected value."," * @param {Object} actual The actual value that caused the assertion to fail."," * @namespace Test "," * @extends AssertionError"," * @module test"," * @class ComparisonFailure"," * @constructor"," */ ","YUITest.ComparisonFailure = function (message, expected, actual){","","    //call superclass","    YUITest.AssertionError.call(this, message);","    ","    /**","     * The expected value.","     * @type Object","     * @property expected","     */","    this.expected = expected;","    ","    /**","     * The actual value.","     * @type Object","     * @property actual","     */","    this.actual = actual;","    ","    /**","     * The name of the error that occurred.","     * @type String","     * @property name","     */","    this.name = \"ComparisonFailure\";","    ","};","","//inherit from YUITest.AssertionError","YUITest.ComparisonFailure.prototype = new YUITest.AssertionError;","","//restore constructor","YUITest.ComparisonFailure.prototype.constructor = YUITest.ComparisonFailure;","","/**"," * Returns a fully formatted error for an assertion failure. This message"," * provides information about the expected and actual values."," * @method getMessage"," * @return {String} A string describing the error."," */","YUITest.ComparisonFailure.prototype.getMessage = function(){","    return this.message + \"\\nExpected: \" + this.expected + \" (\" + (typeof this.expected) + \")\"  +","            \"\\nActual: \" + this.actual + \" (\" + (typeof this.actual) + \")\";","};","/**"," * An object object containing coverage result formatting methods."," * @namespace Test"," * @module test"," * @class CoverageFormat"," * @static"," */","YUITest.CoverageFormat = {","","    /**","     * Returns the coverage report in JSON format. This is the straight","     * JSON representation of the native coverage report.","     * @param {Object} coverage The coverage report object.","     * @return {String} A JSON-formatted string of coverage data.","     * @method JSON","     * @namespace Test.CoverageFormat","     */","    JSON: function(coverage){","        return YUITest.Util.JSON.stringify(coverage);","    },","    ","    /**","     * Returns the coverage report in a JSON format compatible with","     * Xdebug. See <a href=\"http://www.xdebug.com/docs/code_coverage\">Xdebug Documentation</a>","     * for more information. Note: function coverage is not available","     * in this format.","     * @param {Object} coverage The coverage report object.","     * @return {String} A JSON-formatted string of coverage data.","     * @method XdebugJSON","     * @namespace Test.CoverageFormat","     */    ","    XdebugJSON: function(coverage){","    ","        var report = {};","        for (var prop in coverage){","            if (coverage.hasOwnProperty(prop)){","                report[prop] = coverage[prop].lines;","            }","        }","","        return YUITest.Util.JSON.stringify(coverage);","    }","","};","","/**"," * The DateAssert object provides functions to test JavaScript Date objects"," * for a variety of cases."," * @namespace Test"," * @module test"," * @class DateAssert"," * @static"," */"," ","YUITest.DateAssert = {","","    /**","     * Asserts that a date's month, day, and year are equal to another date's.","     * @param {Date} expected The expected date.","     * @param {Date} actual The actual date to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method datesAreEqual","     * @static","     */","    datesAreEqual : function (expected, actual, message){","        YUITest.Assert._increment();        ","        if (expected instanceof Date && actual instanceof Date){","            var msg = \"\";","            ","            //check years first","            if (expected.getFullYear() != actual.getFullYear()){","                msg = \"Years should be equal.\";","            }","            ","            //now check months","            if (expected.getMonth() != actual.getMonth()){","                msg = \"Months should be equal.\";","            }                ","            ","            //last, check the day of the month","            if (expected.getDate() != actual.getDate()){","                msg = \"Days of month should be equal.\";","            }                ","            ","            if (msg.length){","                throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, msg), expected, actual);","            }","        } else {","            throw new TypeError(\"YUITest.DateAssert.datesAreEqual(): Expected and actual values must be Date objects.\");","        }","    },","","    /**","     * Asserts that a date's hour, minutes, and seconds are equal to another date's.","     * @param {Date} expected The expected date.","     * @param {Date} actual The actual date to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method timesAreEqual","     * @static","     */","    timesAreEqual : function (expected, actual, message){","        YUITest.Assert._increment();","        if (expected instanceof Date && actual instanceof Date){","            var msg = \"\";","            ","            //check hours first","            if (expected.getHours() != actual.getHours()){","                msg = \"Hours should be equal.\";","            }","            ","            //now check minutes","            if (expected.getMinutes() != actual.getMinutes()){","                msg = \"Minutes should be equal.\";","            }                ","            ","            //last, check the seconds","            if (expected.getSeconds() != actual.getSeconds()){","                msg = \"Seconds should be equal.\";","            }                ","            ","            if (msg.length){","                throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, msg), expected, actual);","            }","        } else {","            throw new TypeError(\"YUITest.DateAssert.timesAreEqual(): Expected and actual values must be Date objects.\");","        }","    }","    ","};/**"," * Creates a new mock object."," * @namespace Test"," * @module test"," * @class Mock"," * @constructor"," * @param {Object} template (Optional) An object whose methods"," *      should be stubbed out on the mock object."," */","YUITest.Mock = function(template){","","    //use blank object is nothing is passed in","    template = template || {};","    ","    var mock,","        name;","    ","    //try to create mock that keeps prototype chain intact","    //fails in the case of ActiveX objects","    try {","        function f(){}","        f.prototype = template;","        mock = new f();","    } catch (ex) {","        mock = {};","    }","","    //create stubs for all methods","    for (name in template){","        if (template.hasOwnProperty(name)){","            if (typeof template[name] == \"function\"){","                mock[name] = function(name){","                    return function(){","                        YUITest.Assert.fail(\"Method \" + name + \"() was called but was not expected to be.\");","                    };","                }(name);","            }","        }","    }","","    //return it","    return mock;    ","};","    ","/**"," * Assigns an expectation to a mock object. This is used to create"," * methods and properties on the mock object that are monitored for"," * calls and changes, respectively."," * @param {Object} mock The object to add the expectation to."," * @param {Object} expectation An object defining the expectation. For"," *      properties, the keys \"property\" and \"value\" are required. For a"," *      method the \"method\" key defines the method's name, the optional \"args\""," *      key provides an array of argument types. The \"returns\" key provides"," *      an optional return value. An optional \"run\" key provides a function"," *      to be used as the method body. The return value of a mocked method is"," *      determined first by the \"returns\" key, then the \"run\" function's return"," *      value. If neither \"returns\" nor \"run\" is provided undefined is returned."," *      An optional 'error' key defines an error type to be thrown in all cases."," *      The \"callCount\" key provides an optional number of times the method is"," *      expected to be called (the default is 1)."," * @return {void}"," * @method expect"," * @static"," */ ","YUITest.Mock.expect = function(mock /*:Object*/, expectation /*:Object*/){","","    //make sure there's a place to store the expectations","    if (!mock.__expectations) {","        mock.__expectations = {};","    }","","    //method expectation","    if (expectation.method){","        var name = expectation.method,","            args = expectation.args || [],","            result = expectation.returns,","            callCount = (typeof expectation.callCount == \"number\") ? expectation.callCount : 1,","            error = expectation.error,","            run = expectation.run || function(){},","            runResult,","            i;","","        //save expectations","        mock.__expectations[name] = expectation;","        expectation.callCount = callCount;","        expectation.actualCallCount = 0;","            ","        //process arguments","        for (i=0; i < args.length; i++){","             if (!(args[i] instanceof YUITest.Mock.Value)){","                args[i] = YUITest.Mock.Value(YUITest.Assert.areSame, [args[i]], \"Argument \" + i + \" of \" + name + \"() is incorrect.\");","            }       ","        }","    ","        //if the method is expected to be called","        if (callCount > 0){","            mock[name] = function(){   ","                try {","                    expectation.actualCallCount++;","                    YUITest.Assert.areEqual(args.length, arguments.length, \"Method \" + name + \"() passed incorrect number of arguments.\");","                    for (var i=0, len=args.length; i < len; i++){","                        args[i].verify(arguments[i]);","                    }                ","","                    runResult = run.apply(this, arguments);","                    ","                    if (error){","                        throw error;","                    }","                } catch (ex){","                    //route through TestRunner for proper handling","                    YUITest.TestRunner._handleError(ex);","                }","","                // Any value provided for 'returns' overrides any value returned","                // by our 'run' function. ","                return expectation.hasOwnProperty('returns') ? result : runResult;","            };","        } else {","        ","            //method should fail if called when not expected","            mock[name] = function(){","                try {","                    YUITest.Assert.fail(\"Method \" + name + \"() should not have been called.\");","                } catch (ex){","                    //route through TestRunner for proper handling","                    YUITest.TestRunner._handleError(ex);","                }                    ","            };","        }","    } else if (expectation.property){","        //save expectations","        mock.__expectations[expectation.property] = expectation;","    }","};","","/**"," * Verifies that all expectations of a mock object have been met and"," * throws an assertion error if not."," * @param {Object} mock The object to verify.."," * @return {void}"," * @method verify"," * @static"," */ ","YUITest.Mock.verify = function(mock){    ","    try {","    ","        for (var name in mock.__expectations){","            if (mock.__expectations.hasOwnProperty(name)){","                var expectation = mock.__expectations[name];","                if (expectation.method) {","                    YUITest.Assert.areEqual(expectation.callCount, expectation.actualCallCount, \"Method \" + expectation.method + \"() wasn't called the expected number of times.\");","                } else if (expectation.property){","                    YUITest.Assert.areEqual(expectation.value, mock[expectation.property], \"Property \" + expectation.property + \" wasn't set to the correct value.\"); ","                }                ","            }","        }","","    } catch (ex){","        //route through TestRunner for proper handling","        YUITest.TestRunner._handleError(ex);","    }","};","","/**"," * Creates a new value matcher."," * @param {Function} method The function to call on the value."," * @param {Array} originalArgs (Optional) Array of arguments to pass to the method."," * @param {String} message (Optional) Message to display in case of failure."," * @namespace Test.Mock"," * @module test"," * @class Value"," * @constructor"," */","YUITest.Mock.Value = function(method, originalArgs, message){","    if (this instanceof YUITest.Mock.Value){","        this.verify = function(value){","            var args = [].concat(originalArgs || []);","            args.push(value);","            args.push(message);","            method.apply(null, args);","        };","    } else {","        return new YUITest.Mock.Value(method, originalArgs, message);","    }","};","","/**"," * Predefined matcher to match any value."," * @property Any"," * @static"," * @type Function"," */","YUITest.Mock.Value.Any        = YUITest.Mock.Value(function(){});","","/**"," * Predefined matcher to match boolean values."," * @property Boolean"," * @static"," * @type Function"," */","YUITest.Mock.Value.Boolean    = YUITest.Mock.Value(YUITest.Assert.isBoolean);","","/**"," * Predefined matcher to match number values."," * @property Number"," * @static"," * @type Function"," */","YUITest.Mock.Value.Number     = YUITest.Mock.Value(YUITest.Assert.isNumber);","","/**"," * Predefined matcher to match string values."," * @property String"," * @static"," * @type Function"," */","YUITest.Mock.Value.String     = YUITest.Mock.Value(YUITest.Assert.isString);","","/**"," * Predefined matcher to match object values."," * @property Object"," * @static"," * @type Function"," */","YUITest.Mock.Value.Object     = YUITest.Mock.Value(YUITest.Assert.isObject);","","/**"," * Predefined matcher to match function values."," * @property Function"," * @static"," * @type Function"," */","YUITest.Mock.Value.Function   = YUITest.Mock.Value(YUITest.Assert.isFunction);","","/**"," * The ObjectAssert object provides functions to test JavaScript objects"," * for a variety of cases."," * @namespace Test"," * @module test"," * @class ObjectAssert"," * @static"," */","YUITest.ObjectAssert = {","","    /**","     * Asserts that an object has all of the same properties","     * and property values as the other.","     * @param {Object} expected The object with all expected properties and values.","     * @param {Object} actual The object to inspect.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method areEqual","     * @static","     * @deprecated","     */","    areEqual: function(expected, actual, message) {","        YUITest.Assert._increment();         ","        ","        var expectedKeys = YUITest.Object.keys(expected),","            actualKeys = YUITest.Object.keys(actual);","        ","        //first check keys array length","        if (expectedKeys.length != actualKeys.length){","            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Object should have \" + expectedKeys.length + \" keys but has \" + actualKeys.length));","        }","        ","        //then check values","        for (var name in expected){","            if (expected.hasOwnProperty(name)){","                if (expected[name] != actual[name]){","                    throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, \"Values should be equal for property \" + name), expected[name], actual[name]);","                }            ","            }","        }           ","    },","    ","    /**","     * Asserts that an object has a property with the given name.","     * @param {String} propertyName The name of the property to test.","     * @param {Object} object The object to search.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method hasKey","     * @static","     * @deprecated Use ownsOrInheritsKey() instead","     */    ","    hasKey: function (propertyName, object, message) {","        YUITest.ObjectAssert.ownsOrInheritsKey(propertyName, object, message);   ","    },","    ","    /**","     * Asserts that an object has all properties of a reference object.","     * @param {Array} properties An array of property names that should be on the object.","     * @param {Object} object The object to search.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method hasKeys","     * @static","     * @deprecated Use ownsOrInheritsKeys() instead","     */    ","    hasKeys: function (properties, object, message) {","        YUITest.ObjectAssert.ownsOrInheritsKeys(properties, object, message);","    },","    ","    /**","     * Asserts that a property with the given name exists on an object's prototype.","     * @param {String} propertyName The name of the property to test.","     * @param {Object} object The object to search.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method inheritsKey","     * @static","     */    ","    inheritsKey: function (propertyName, object, message) {","        YUITest.Assert._increment();               ","        if (!(propertyName in object && !object.hasOwnProperty(propertyName))){","            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Property '\" + propertyName + \"' not found on object instance.\"));","        }     ","    },","    ","    /**","     * Asserts that all properties exist on an object prototype.","     * @param {Array} properties An array of property names that should be on the object.","     * @param {Object} object The object to search.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method inheritsKeys","     * @static","     */    ","    inheritsKeys: function (properties, object, message) {","        YUITest.Assert._increment();        ","        for (var i=0; i < properties.length; i++){","            if (!(propertyName in object && !object.hasOwnProperty(properties[i]))){","                YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Property '\" + properties[i] + \"' not found on object instance.\"));","            }      ","        }","    },","    ","    /**","     * Asserts that a property with the given name exists on an object instance (not on its prototype).","     * @param {String} propertyName The name of the property to test.","     * @param {Object} object The object to search.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method ownsKey","     * @static","     */    ","    ownsKey: function (propertyName, object, message) {","        YUITest.Assert._increment();               ","        if (!object.hasOwnProperty(propertyName)){","            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Property '\" + propertyName + \"' not found on object instance.\"));","        }     ","    },","    ","    /**","     * Asserts that all properties exist on an object instance (not on its prototype).","     * @param {Array} properties An array of property names that should be on the object.","     * @param {Object} object The object to search.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method ownsKeys","     * @static","     */    ","    ownsKeys: function (properties, object, message) {","        YUITest.Assert._increment();        ","        for (var i=0; i < properties.length; i++){","            if (!object.hasOwnProperty(properties[i])){","                YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Property '\" + properties[i] + \"' not found on object instance.\"));","            }      ","        }","    },","    ","    /**","     * Asserts that an object owns no properties.","     * @param {Object} object The object to check.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method ownsNoKeys","     * @static","     */    ","    ownsNoKeys : function (object, message) {","        YUITest.Assert._increment();  ","        var count = 0,","            name;","        for (name in object){","            if (object.hasOwnProperty(name)){","                count++;","            }","        }","        ","        if (count !== 0){","            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Object owns \" + count + \" properties but should own none.\"));        ","        }","","    },","","    /**","     * Asserts that an object has a property with the given name.","     * @param {String} propertyName The name of the property to test.","     * @param {Object} object The object to search.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method ownsOrInheritsKey","     * @static","     */    ","    ownsOrInheritsKey: function (propertyName, object, message) {","        YUITest.Assert._increment();               ","        if (!(propertyName in object)){","            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Property '\" + propertyName + \"' not found on object.\"));","        }    ","    },","    ","    /**","     * Asserts that an object has all properties of a reference object.","     * @param {Array} properties An array of property names that should be on the object.","     * @param {Object} object The object to search.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method ownsOrInheritsKeys","     * @static","     */    ","    ownsOrInheritsKeys: function (properties, object, message) {","        YUITest.Assert._increment();  ","        for (var i=0; i < properties.length; i++){","            if (!(properties[i] in object)){","                YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Property '\" + properties[i] + \"' not found on object.\"));","            }      ","        }","    }    ","};","/**"," * Convenience type for storing and aggregating"," * test result information."," * @private"," * @namespace Test"," * @module test"," * @class Results"," * @constructor"," * @param {String} name The name of the test."," */","YUITest.Results = function(name){","","    /**","     * Name of the test, test case, or test suite.","     * @type String","     * @property name","     */","    this.name = name;","    ","    /**","     * Number of passed tests.","     * @type int","     * @property passed","     */","    this.passed = 0;","    ","    /**","     * Number of failed tests.","     * @type int","     * @property failed","     */","    this.failed = 0;","    ","    /**","     * Number of errors that occur in non-test methods.","     * @type int","     * @property errors","     */","    this.errors = 0;","    ","    /**","     * Number of ignored tests.","     * @type int","     * @property ignored","     */","    this.ignored = 0;","    ","    /**","     * Number of total tests.","     * @type int","     * @property total","     */","    this.total = 0;","    ","    /**","     * Amount of time (ms) it took to complete testing.","     * @type int","     * @property duration","     */","    this.duration = 0;","};","","/**"," * Includes results from another results object into this one."," * @param {Test.Results} result The results object to include."," * @method include"," * @return {void}"," */","YUITest.Results.prototype.include = function(results){","    this.passed += results.passed;","    this.failed += results.failed;","    this.ignored += results.ignored;","    this.total += results.total;","    this.errors += results.errors;","};","/**"," * ShouldError is subclass of Error that is thrown whenever"," * a test is expected to throw an error but doesn't."," *"," * @param {String} message The message to display when the error occurs."," * @namespace Test "," * @extends AssertionError"," * @module test"," * @class ShouldError"," * @constructor"," */ ","YUITest.ShouldError = function (message){","","    //call superclass","    YUITest.AssertionError.call(this, message || \"This test should have thrown an error but didn't.\");","    ","    /**","     * The name of the error that occurred.","     * @type String","     * @property name","     */","    this.name = \"ShouldError\";","    ","};","","//inherit from YUITest.AssertionError","YUITest.ShouldError.prototype = new YUITest.AssertionError();","","//restore constructor","YUITest.ShouldError.prototype.constructor = YUITest.ShouldError;","/**"," * ShouldFail is subclass of AssertionError that is thrown whenever"," * a test was expected to fail but did not."," *"," * @param {String} message The message to display when the error occurs."," * @namespace Test "," * @extends YUITest.AssertionError"," * @module test"," * @class ShouldFail"," * @constructor"," */ ","YUITest.ShouldFail = function (message){","","    //call superclass","    YUITest.AssertionError.call(this, message || \"This test should fail but didn't.\");","    ","    /**","     * The name of the error that occurred.","     * @type String","     * @property name","     */","    this.name = \"ShouldFail\";","    ","};","","//inherit from YUITest.AssertionError","YUITest.ShouldFail.prototype = new YUITest.AssertionError();","","//restore constructor","YUITest.ShouldFail.prototype.constructor = YUITest.ShouldFail;","/**"," * UnexpectedError is subclass of AssertionError that is thrown whenever"," * an error occurs within the course of a test and the test was not expected"," * to throw an error."," *"," * @param {Error} cause The unexpected error that caused this error to be "," *                      thrown."," * @namespace Test "," * @extends YUITest.AssertionError"," * @module test"," * @class UnexpectedError"," * @constructor"," */  ","YUITest.UnexpectedError = function (cause){","","    //call superclass","    YUITest.AssertionError.call(this, \"Unexpected error: \" + cause.message);","    ","    /**","     * The unexpected error that occurred.","     * @type Error","     * @property cause","     */","    this.cause = cause;","    ","    /**","     * The name of the error that occurred.","     * @type String","     * @property name","     */","    this.name = \"UnexpectedError\";","    ","    /**","     * Stack information for the error (if provided).","     * @type String","     * @property stack","     */","    this.stack = cause.stack;","    ","};","","//inherit from YUITest.AssertionError","YUITest.UnexpectedError.prototype = new YUITest.AssertionError();","","//restore constructor","YUITest.UnexpectedError.prototype.constructor = YUITest.UnexpectedError;","/**"," * UnexpectedValue is subclass of Error that is thrown whenever"," * a value was unexpected in its scope. This typically means that a test"," * was performed to determine that a value was *not* equal to a certain"," * value."," *"," * @param {String} message The message to display when the error occurs."," * @param {Object} unexpected The unexpected value."," * @namespace Test "," * @extends AssertionError"," * @module test"," * @class UnexpectedValue"," * @constructor"," */ ","YUITest.UnexpectedValue = function (message, unexpected){","","    //call superclass","    YUITest.AssertionError.call(this, message);","    ","    /**","     * The unexpected value.","     * @type Object","     * @property unexpected","     */","    this.unexpected = unexpected;","    ","    /**","     * The name of the error that occurred.","     * @type String","     * @property name","     */","    this.name = \"UnexpectedValue\";","    ","};","","//inherit from YUITest.AssertionError","YUITest.UnexpectedValue.prototype = new YUITest.AssertionError();","","//restore constructor","YUITest.UnexpectedValue.prototype.constructor = YUITest.UnexpectedValue;","","/**"," * Returns a fully formatted error for an assertion failure. This message"," * provides information about the expected and actual values."," * @method getMessage"," * @return {String} A string describing the error."," */","YUITest.UnexpectedValue.prototype.getMessage = function(){","    return this.message + \"\\nUnexpected: \" + this.unexpected + \" (\" + (typeof this.unexpected) + \") \";","};","","/**"," * Represents a stoppage in test execution to wait for an amount of time before"," * continuing."," * @param {Function} segment A function to run when the wait is over."," * @param {int} delay The number of milliseconds to wait before running the code."," * @module test"," * @class Wait"," * @namespace Test"," * @constructor"," *"," */","YUITest.Wait = function (segment, delay) {","    ","    /**","     * The segment of code to run when the wait is over.","     * @type Function","     * @property segment","     */","    this.segment = (typeof segment == \"function\" ? segment : null);","","    /**","     * The delay before running the segment of code.","     * @type int","     * @property delay","     */","    this.delay = (typeof delay == \"number\" ? delay : 0);        ","};","","","//Setting up our aliases..","Y.Test = YUITest;","Y.Object.each(YUITest, function(item, name) {","    var name = name.replace('Test', '');","    Y.Test[name] = item;","});","","} //End of else in top wrapper","","Y.Assert = YUITest.Assert;","Y.Assert.Error = Y.Test.AssertionError;","Y.Assert.ComparisonFailure = Y.Test.ComparisonFailure;","Y.Assert.UnexpectedValue = Y.Test.UnexpectedValue;","Y.Mock = Y.Test.Mock;","Y.ObjectAssert = Y.Test.ObjectAssert;","Y.ArrayAssert = Y.Test.ArrayAssert;","Y.DateAssert = Y.Test.DateAssert;","Y.Test.ResultsFormat = Y.Test.TestFormat;","","var itemsAreEqual = Y.Test.ArrayAssert.itemsAreEqual;","","Y.Test.ArrayAssert.itemsAreEqual = function(expected, actual, message) {","    return itemsAreEqual.call(this, Y.Array(expected), Y.Array(actual), message);","};","","","/**"," * Asserts that a given condition is true. If not, then a Y.Assert.Error object is thrown"," * and the test fails."," * @method assert"," * @param {Boolean} condition The condition to test."," * @param {String} message The message to display if the assertion fails."," * @for YUI"," * @static"," */","Y.assert = function(condition, message){","    Y.Assert._increment();","    if (!condition){","        throw new Y.Assert.Error(Y.Assert._formatMessage(message, \"Assertion failed.\"));","    }","};","","/**"," * Forces an assertion error to occur. Shortcut for Y.Assert.fail()."," * @method fail"," * @param {String} message (Optional) The message to display with the failure."," * @for YUI"," * @static"," */","Y.fail = Y.Assert.fail; ","","Y.Test.Runner.once = Y.Test.Runner.subscribe;","","Y.Test.Runner.disableLogging = function() {","    Y.Test.Runner._log = false;","};","","Y.Test.Runner.enableLogging = function() {","    Y.Test.Runner._log = true;","};","","Y.Test.Runner._ignoreEmpty = true;","Y.Test.Runner._log = true;","","Y.Test.Runner.on = Y.Test.Runner.attach;","","//Only allow one instance of YUITest","if (!YUI.YUITest) {","","    if (Y.config.win) {","        Y.config.win.YUITest = YUITest;","    }","","    YUI.YUITest = Y.Test;","","    ","    //Only setup the listeners once.","    var logEvent = function(event) {","        ","        //data variables","        var message = \"\";","        var messageType = \"\";","        ","        switch(event.type){","            case this.BEGIN_EVENT:","                message = \"Testing began at \" + (new Date()).toString() + \".\";","                messageType = \"info\";","                break;","                ","            case this.COMPLETE_EVENT:","                message = Y.Lang.sub(\"Testing completed at \" +","                    (new Date()).toString() + \".\\n\" +","                    \"Passed:{passed} Failed:{failed} \" +","                    \"Total:{total} ({ignored} ignored)\",","                    event.results);","                messageType = \"info\";","                break;","                ","            case this.TEST_FAIL_EVENT:","                message = event.testName + \": failed.\\n\" + event.error.getMessage();","                messageType = \"fail\";","                break;","                ","            case this.TEST_IGNORE_EVENT:","                message = event.testName + \": ignored.\";","                messageType = \"ignore\";","                break;","                ","            case this.TEST_PASS_EVENT:","                message = event.testName + \": passed.\";","                messageType = \"pass\";","                break;","                ","            case this.TEST_SUITE_BEGIN_EVENT:","                message = \"Test suite \\\"\" + event.testSuite.name + \"\\\" started.\";","                messageType = \"info\";","                break;","                ","            case this.TEST_SUITE_COMPLETE_EVENT:","                message = Y.Lang.sub(\"Test suite \\\"\" +","                    event.testSuite.name + \"\\\" completed\" + \".\\n\" +","                    \"Passed:{passed} Failed:{failed} \" +","                    \"Total:{total} ({ignored} ignored)\",","                    event.results);","                messageType = \"info\";","                break;","                ","            case this.TEST_CASE_BEGIN_EVENT:","                message = \"Test case \\\"\" + event.testCase.name + \"\\\" started.\";","                messageType = \"info\";","                break;","                ","            case this.TEST_CASE_COMPLETE_EVENT:","                message = Y.Lang.sub(\"Test case \\\"\" +","                    event.testCase.name + \"\\\" completed.\\n\" +","                    \"Passed:{passed} Failed:{failed} \" +","                    \"Total:{total} ({ignored} ignored)\",","                    event.results);","                messageType = \"info\";","                break;","            default:","                message = \"Unexpected event \" + event.type;","                message = \"info\";","        }","        ","        if (Y.Test.Runner._log) {","            Y.log(message, messageType, \"TestRunner\");","        }","    };","","    var i, name;","","    for (i in Y.Test.Runner) {","        name = Y.Test.Runner[i];","        if (i.indexOf('_EVENT') > -1) {","            Y.Test.Runner.subscribe(name, logEvent);","        }","    };","","} //End if for YUI.YUITest","","    ","/**"," * The Win8 namespace encapsulates functionality that is necessary to run unit tests"," * in a WinJS environment on Windows 8. (WinJS refers to a native HTML/CSS/JS runtime on Win8)"," * @param {JSON||Object} jsonObj A JSON object with atleast a property \"tests\" that contains an URL of all unit test HTML pages"," * @namespace Test"," * @module test"," * @class WinJS"," * @constructor"," */","YUITest.WinJS = function (jsonObj) {","","    this.tests = (jsonObj && jsonObj.tests) ? jsonObj.tests : [];","    this.results = {};","","    this.listen();","","};","    ","YUITest.WinJS.prototype = {","    ","    //restore constructor","    constructor: YUITest.WinJS,","","    //read from localstorage and populate tests array","    read: function() {","        var o = WinJS.Application.local.readText(\"YUI.Tests\", JSON.stringify({","            tests: []","        }));","","        this.tests = o.tests;","    },","","    //pop the first element off tests array and save it to local storage","    pop: function() {","        this.tests.pop();","    },","","    //Listen for TestRunner Events and append to a testResults array","    listen: function() {","        var runner = YUI.YUITest.TestRunner;","        runner.subscribe(runner.COMPLETE_EVENT, function() {","            console.log(\"Test Suite Completed.\")","        });","","        runner.subscribe(runner.BEGIN_EVENT, function() {","            console.log(\"Test Suite About to Begin.\")","        });","    },","","    //save to localstorage","    save: function() {","","    },","","    //Navigate to the next unit test HTML","    navigate: function() {","","    }","    ","};","","","}, '@VERSION@', {\"requires\": [\"event-simulate\", \"event-custom\", \"json-stringify\"]});"];
_yuitest_coverage["build/test/test.js"].lines = {"1":0,"16":0,"17":0,"19":0,"20":0,"27":0,"30":0,"34":0,"38":0,"39":0,"40":0,"52":0,"61":0,"65":0,"82":0,"83":0,"86":0,"98":0,"109":0,"110":0,"112":0,"113":0,"116":0,"117":0,"120":0,"121":0,"122":0,"123":0,"136":0,"137":0,"138":0,"139":0,"140":0,"141":0,"156":0,"171":0,"178":0,"186":0,"189":0,"190":0,"191":0,"192":0,"193":0,"194":0,"200":0,"201":0,"206":0,"218":0,"219":0,"221":0,"257":0,"264":0,"267":0,"268":0,"272":0,"273":0,"279":0,"292":0,"303":0,"318":0,"319":0,"321":0,"322":0,"324":0,"325":0,"342":0,"343":0,"344":0,"354":0,"404":0,"412":0,"414":0,"415":0,"416":0,"417":0,"418":0,"419":0,"420":0,"427":0,"437":0,"449":0,"450":0,"452":0,"453":0,"456":0,"457":0,"459":0,"460":0,"461":0,"462":0,"463":0,"469":0,"471":0,"474":0,"488":0,"489":0,"491":0,"494":0,"495":0,"496":0,"497":0,"499":0,"501":0,"506":0,"508":0,"509":0,"510":0,"511":0,"516":0,"517":0,"521":0,"522":0,"523":0,"524":0,"528":0,"533":0,"535":0,"536":0,"537":0,"538":0,"543":0,"548":0,"552":0,"565":0,"567":0,"568":0,"570":0,"573":0,"575":0,"577":0,"578":0,"581":0,"583":0,"585":0,"589":0,"591":0,"592":0,"593":0,"594":0,"599":0,"602":0,"606":0,"608":0,"609":0,"610":0,"611":0,"616":0,"617":0,"621":0,"622":0,"623":0,"624":0,"632":0,"636":0,"652":0,"659":0,"666":0,"674":0,"682":0,"690":0,"693":0,"706":0,"715":0,"725":0,"726":0,"727":0,"729":0,"730":0,"731":0,"733":0,"745":0,"746":0,"747":0,"748":0,"749":0,"750":0,"751":0,"754":0,"755":0,"757":0,"758":0,"761":0,"762":0,"763":0,"764":0,"765":0,"767":0,"771":0,"774":0,"775":0,"779":0,"780":0,"781":0,"784":0,"785":0,"786":0,"787":0,"788":0,"789":0,"790":0,"791":0,"796":0,"797":0,"798":0,"800":0,"801":0,"816":0,"825":0,"826":0,"827":0,"829":0,"830":0,"831":0,"832":0,"836":0,"849":0,"856":0,"863":0,"870":0,"877":0,"884":0,"891":0,"894":0,"895":0,"896":0,"897":0,"898":0,"899":0,"904":0,"914":0,"915":0,"916":0,"918":0,"919":0,"921":0,"922":0,"934":0,"937":0,"946":0,"955":0,"964":0,"973":0,"983":0,"992":0,"1002":0,"1011":0,"1022":0,"1026":0,"1133":0,"1138":0,"1139":0,"1140":0,"1158":0,"1161":0,"1162":0,"1163":0,"1164":0,"1165":0,"1181":0,"1185":0,"1186":0,"1187":0,"1188":0,"1189":0,"1208":0,"1210":0,"1211":0,"1213":0,"1214":0,"1215":0,"1218":0,"1219":0,"1220":0,"1221":0,"1222":0,"1223":0,"1224":0,"1225":0,"1243":0,"1244":0,"1245":0,"1246":0,"1247":0,"1248":0,"1250":0,"1251":0,"1252":0,"1255":0,"1257":0,"1258":0,"1259":0,"1260":0,"1261":0,"1262":0,"1263":0,"1264":0,"1265":0,"1266":0,"1270":0,"1285":0,"1287":0,"1288":0,"1289":0,"1290":0,"1292":0,"1295":0,"1296":0,"1297":0,"1298":0,"1299":0,"1301":0,"1304":0,"1307":0,"1321":0,"1324":0,"1326":0,"1329":0,"1332":0,"1334":0,"1337":0,"1338":0,"1339":0,"1340":0,"1341":0,"1342":0,"1343":0,"1344":0,"1358":0,"1359":0,"1364":0,"1365":0,"1366":0,"1369":0,"1372":0,"1381":0,"1384":0,"1387":0,"1391":0,"1394":0,"1395":0,"1398":0,"1399":0,"1400":0,"1404":0,"1406":0,"1409":0,"1410":0,"1413":0,"1416":0,"1419":0,"1420":0,"1423":0,"1424":0,"1425":0,"1426":0,"1427":0,"1428":0,"1434":0,"1435":0,"1436":0,"1440":0,"1441":0,"1442":0,"1443":0,"1445":0,"1447":0,"1448":0,"1451":0,"1452":0,"1453":0,"1455":0,"1457":0,"1462":0,"1466":0,"1467":0,"1468":0,"1471":0,"1474":0,"1475":0,"1476":0,"1478":0,"1481":0,"1482":0,"1483":0,"1486":0,"1489":0,"1491":0,"1492":0,"1503":0,"1504":0,"1506":0,"1510":0,"1513":0,"1516":0,"1519":0,"1527":0,"1528":0,"1530":0,"1532":0,"1535":0,"1536":0,"1537":0,"1540":0,"1560":0,"1561":0,"1562":0,"1565":0,"1581":0,"1591":0,"1594":0,"1601":0,"1602":0,"1604":0,"1607":0,"1608":0,"1609":0,"1612":0,"1618":0,"1621":0,"1624":0,"1639":0,"1650":0,"1665":0,"1666":0,"1676":0,"1686":0,"1696":0,"1709":0,"1710":0,"1711":0,"1713":0,"1716":0,"1731":0,"1732":0,"1733":0,"1735":0,"1738":0,"1754":0,"1758":0,"1759":0,"1760":0,"1762":0,"1775":0,"1776":0,"1778":0,"1794":0,"1797":0,"1802":0,"1803":0,"1807":0,"1810":0,"1811":0,"1812":0,"1815":0,"1818":0,"1822":0,"1835":0,"1851":0,"1852":0,"1854":0,"1855":0,"1856":0,"1859":0,"1874":0,"1875":0,"1877":0,"1878":0,"1879":0,"1882":0,"1898":0,"1900":0,"1901":0,"1917":0,"1920":0,"1921":0,"1922":0,"1939":0,"1941":0,"1942":0,"1945":0,"1946":0,"1963":0,"1965":0,"1966":0,"1983":0,"1985":0,"1986":0,"1987":0,"2005":0,"2008":0,"2009":0,"2012":0,"2013":0,"2029":0,"2032":0,"2033":0,"2034":0,"2035":0,"2037":0,"2042":0,"2059":0,"2062":0,"2063":0,"2067":0,"2068":0,"2072":0,"2073":0,"2074":0,"2096":0,"2099":0,"2100":0,"2104":0,"2105":0,"2109":0,"2110":0,"2111":0,"2124":0,"2125":0,"2126":0,"2138":0,"2139":0,"2140":0,"2158":0,"2161":0,"2162":0,"2166":0,"2167":0,"2168":0,"2187":0,"2188":0,"2189":0,"2190":0,"2192":0,"2197":0,"2211":0,"2236":0,"2237":0,"2239":0,"2250":0,"2260":0,"2270":0,"2284":0,"2293":0,"2310":0,"2311":0,"2312":0,"2327":0,"2328":0,"2329":0,"2343":0,"2344":0,"2345":0,"2359":0,"2360":0,"2361":0,"2378":0,"2379":0,"2380":0,"2393":0,"2394":0,"2395":0,"2412":0,"2413":0,"2414":0,"2426":0,"2427":0,"2428":0,"2441":0,"2442":0,"2443":0,"2456":0,"2457":0,"2458":0,"2471":0,"2472":0,"2473":0,"2486":0,"2487":0,"2488":0,"2504":0,"2505":0,"2506":0,"2507":0,"2509":0,"2511":0,"2512":0,"2524":0,"2525":0,"2526":0,"2538":0,"2539":0,"2540":0,"2555":0,"2556":0,"2557":0,"2569":0,"2570":0,"2571":0,"2583":0,"2584":0,"2585":0,"2597":0,"2598":0,"2599":0,"2612":0,"2613":0,"2614":0,"2638":0,"2639":0,"2641":0,"2642":0,"2646":0,"2649":0,"2650":0,"2652":0,"2655":0,"2656":0,"2659":0,"2662":0,"2664":0,"2668":0,"2671":0,"2672":0,"2674":0,"2679":0,"2694":0,"2701":0,"2708":0,"2711":0,"2723":0,"2732":0,"2749":0,"2752":0,"2759":0,"2766":0,"2773":0,"2778":0,"2781":0,"2789":0,"2790":0,"2800":0,"2811":0,"2826":0,"2827":0,"2828":0,"2829":0,"2833":0,"2847":0,"2858":0,"2859":0,"2860":0,"2863":0,"2864":0,"2868":0,"2869":0,"2873":0,"2874":0,"2877":0,"2878":0,"2881":0,"2894":0,"2895":0,"2896":0,"2899":0,"2900":0,"2904":0,"2905":0,"2909":0,"2910":0,"2913":0,"2914":0,"2917":0,"2930":0,"2933":0,"2935":0,"2940":0,"2941":0,"2942":0,"2943":0,"2945":0,"2949":0,"2950":0,"2951":0,"2952":0,"2953":0,"2954":0,"2962":0,"2985":0,"2988":0,"2989":0,"2993":0,"2994":0,"3004":0,"3005":0,"3006":0,"3009":0,"3010":0,"3011":0,"3016":0,"3017":0,"3018":0,"3019":0,"3020":0,"3021":0,"3022":0,"3025":0,"3027":0,"3028":0,"3032":0,"3037":0,"3042":0,"3043":0,"3044":0,"3047":0,"3051":0,"3053":0,"3065":0,"3066":0,"3068":0,"3069":0,"3070":0,"3071":0,"3072":0,"3073":0,"3074":0,"3081":0,"3095":0,"3096":0,"3097":0,"3098":0,"3099":0,"3100":0,"3101":0,"3104":0,"3114":0,"3122":0,"3130":0,"3138":0,"3146":0,"3154":0,"3164":0,"3177":0,"3179":0,"3183":0,"3184":0,"3188":0,"3189":0,"3190":0,"3191":0,"3207":0,"3220":0,"3232":0,"3233":0,"3234":0,"3247":0,"3248":0,"3249":0,"3250":0,"3264":0,"3265":0,"3266":0,"3279":0,"3280":0,"3281":0,"3282":0,"3295":0,"3296":0,"3298":0,"3299":0,"3300":0,"3304":0,"3305":0,"3319":0,"3320":0,"3321":0,"3334":0,"3335":0,"3336":0,"3337":0,"3352":0,"3359":0,"3366":0,"3373":0,"3380":0,"3387":0,"3394":0,"3401":0,"3410":0,"3411":0,"3412":0,"3413":0,"3414":0,"3415":0,"3428":0,"3431":0,"3438":0,"3443":0,"3446":0,"3458":0,"3461":0,"3468":0,"3473":0,"3476":0,"3490":0,"3493":0,"3500":0,"3507":0,"3514":0,"3519":0,"3522":0,"3537":0,"3540":0,"3547":0,"3554":0,"3559":0,"3562":0,"3570":0,"3571":0,"3585":0,"3592":0,"3599":0,"3604":0,"3605":0,"3606":0,"3607":0,"3612":0,"3613":0,"3614":0,"3615":0,"3616":0,"3617":0,"3618":0,"3619":0,"3620":0,"3622":0,"3624":0,"3625":0,"3638":0,"3639":0,"3640":0,"3641":0,"3652":0,"3654":0,"3656":0,"3657":0,"3660":0,"3661":0,"3664":0,"3665":0,"3667":0,"3670":0,"3672":0,"3673":0,"3676":0,"3680":0,"3683":0,"3684":0,"3686":0,"3688":0,"3689":0,"3690":0,"3693":0,"3698":0,"3699":0,"3702":0,"3703":0,"3704":0,"3707":0,"3708":0,"3709":0,"3712":0,"3713":0,"3714":0,"3717":0,"3718":0,"3719":0,"3722":0,"3727":0,"3728":0,"3731":0,"3732":0,"3733":0,"3736":0,"3741":0,"3742":0,"3744":0,"3745":0,"3748":0,"3749":0,"3753":0,"3755":0,"3756":0,"3757":0,"3758":0,"3760":0,"3774":0,"3776":0,"3777":0,"3779":0,"3783":0,"3790":0,"3794":0,"3799":0,"3804":0,"3805":0,"3806":0,"3809":0,"3810":0};
_yuitest_coverage["build/test/test.js"].functions = {"guid:29":0,"EventTarget:52":0,"attach:81":0,"subscribe:97":0,"fire:108":0,"detach:135":0,"unsubscribe:155":0,"TestSuite:171":0,"add:217":0,"TestCase:257":0,"callback:291":0,"resume:302":0,"(anonymous 2):324":0,"wait:316":0,"assert:341":0,"fail:353":0,"(anonymous 3):414":0,"xmlEscape:412":0,"JSON:436":0,"serializeToXML:449":0,"XML:447":0,"serializeToJUnitXML:488":0,"JUnitXML:486":0,"serializeToTAP:567":0,"TAP:563":0,"TestFormat:404":0,"Reporter:652":0,"addField:705":0,"clearFields:714":0,"destroy:724":0,"report:742":0,"inGroups:825":0,"TestNode:849":0,"appendChild:913":0,"TestRunner:934":0,"_addTestCaseToTestTree:1130":0,"_addTestSuiteToTestTree:1155":0,"_buildTestTree:1179":0,"_handleTestObjectComplete:1207":0,"_next:1241":0,"_execNonTestMethod:1284":0,"(anonymous 4):1365":0,"_run:1318":0,"(anonymous 5):1452":0,"(anonymous 6):1536":0,"_resumeTest:1378":0,"(anonymous 7):1561":0,"_handleError:1558":0,"(anonymous 8):1608":0,"_runTest:1578":0,"getName:1638":0,"setName:1649":0,"add:1664":0,"clear:1675":0,"isWaiting:1685":0,"isRunning:1695":0,"getResults:1708":0,"getCoverage:1730":0,"(anonymous 9):1758":0,"callback:1753":0,"resume:1774":0,"run:1792":0,"TestRunner:816":0,"_indexOf:1850":0,"_some:1873":0,"contains:1895":0,"containsItems:1915":0,"containsMatch:1936":0,"doesNotContain:1960":0,"doesNotContainItems:1980":0,"doesNotContainMatch:2002":0,"indexOf:2027":0,"itemsAreEqual:2056":0,"itemsAreEquivalent:2093":0,"isEmpty:2123":0,"isNotEmpty:2137":0,"itemsAreSame:2155":0,"lastIndexOf:2184":0,"_formatMessage:2235":0,"_getCount:2249":0,"_increment:2259":0,"_reset:2269":0,"fail:2283":0,"pass:2292":0,"areEqual:2309":0,"areNotEqual:2325":0,"areNotSame:2342":0,"areSame:2358":0,"isFalse:2377":0,"isTrue:2392":0,"isNaN:2411":0,"isNotNaN:2425":0,"isNotNull:2440":0,"isNotUndefined:2455":0,"isNull:2470":0,"isUndefined:2485":0,"isArray:2503":0,"isBoolean:2523":0,"isFunction:2537":0,"isInstanceOf:2554":0,"isNumber:2568":0,"isObject:2582":0,"isString:2596":0,"isTypeOf:2611":0,"throwsError:2637":0,"AssertionError:2694":0,"getMessage:2722":0,"toString:2731":0,"ComparisonFailure:2749":0,"getMessage:2789":0,"JSON:2810":0,"XdebugJSON:2824":0,"datesAreEqual:2857":0,"timesAreEqual:2893":0,"(anonymous 11):2953":0,"]:2952":0,"Mock:2930":0,"]:3017":0,"]:3042":0,"expect:2985":0,"verify:3065":0,"verify:3097":0,"Value:3095":0,"areEqual:3176":0,"hasKey:3206":0,"hasKeys:3219":0,"inheritsKey:3231":0,"inheritsKeys:3246":0,"ownsKey:3263":0,"ownsKeys:3278":0,"ownsNoKeys:3294":0,"ownsOrInheritsKey:3318":0,"ownsOrInheritsKeys:3333":0,"Results:3352":0,"include:3410":0,"ShouldError:3428":0,"ShouldFail:3458":0,"UnexpectedError:3490":0,"UnexpectedValue:3537":0,"getMessage:3570":0,"Wait:3585":0,"(anonymous 14):3605":0,"itemsAreEqual:3624":0,"assert:3638":0,"disableLogging:3656":0,"enableLogging:3660":0,"logEvent:3680":0,"WinJS:3774":0,"read:3789":0,"pop:3798":0,"(anonymous 15):3805":0,"(anonymous 16):3809":0,"listen:3803":0,"(anonymous 1):1":0};
_yuitest_coverage["build/test/test.js"].coveredLines = 908;
_yuitest_coverage["build/test/test.js"].coveredFunctions = 154;
_yuitest_coverline("build/test/test.js", 1);
YUI.add('test', function (Y, NAME) {



/**
 * YUI Test Framework
 * @module test
 * @main test
 */

/*
 * The root namespace for YUI Test.
 */

//So we only ever have one YUITest object that's shared
_yuitest_coverfunc("build/test/test.js", "(anonymous 1)", 1);
_yuitest_coverline("build/test/test.js", 16);
if (YUI.YUITest) {
    _yuitest_coverline("build/test/test.js", 17);
Y.Test = YUI.YUITest;

    _yuitest_coverline("build/test/test.js", 19);
if (Y.Test.prototype.debugWinJS === true) {
        _yuitest_coverline("build/test/test.js", 20);
var winJS = new Y.Test.WinJS();
    }


} else { //Ends after the YUITest definitions

    //Make this global for back compat
    _yuitest_coverline("build/test/test.js", 27);
YUITest = {
        version: "@VERSION@",
        guid: function(pre) {
            _yuitest_coverfunc("build/test/test.js", "guid", 29);
_yuitest_coverline("build/test/test.js", 30);
return Y.guid(pre);
        }
    };

_yuitest_coverline("build/test/test.js", 34);
Y.namespace('Test');


//Using internal YUI methods here
_yuitest_coverline("build/test/test.js", 38);
YUITest.Object = Y.Object;
_yuitest_coverline("build/test/test.js", 39);
YUITest.Array = Y.Array;
_yuitest_coverline("build/test/test.js", 40);
YUITest.Util = {
    mix: Y.mix,
    JSON: Y.JSON
};

/**
 * Simple custom event implementation.
 * @namespace Test
 * @module test
 * @class EventTarget
 * @constructor
 */
_yuitest_coverline("build/test/test.js", 52);
YUITest.EventTarget = function(){

    /**
     * Event handlers for the various events.
     * @type Object
     * @private
     * @property _handlers
     * @static
     */
    _yuitest_coverfunc("build/test/test.js", "EventTarget", 52);
_yuitest_coverline("build/test/test.js", 61);
this._handlers = {};

};
    
_yuitest_coverline("build/test/test.js", 65);
YUITest.EventTarget.prototype = {

    //restore prototype
    constructor: YUITest.EventTarget,
            
    //-------------------------------------------------------------------------
    // Event Handling
    //-------------------------------------------------------------------------
    
    /**
     * Adds a listener for a given event type.
     * @param {String} type The type of event to add a listener for.
     * @param {Function} listener The function to call when the event occurs.
     * @return {void}
     * @method attach
     */
    attach: function(type, listener){
        _yuitest_coverfunc("build/test/test.js", "attach", 81);
_yuitest_coverline("build/test/test.js", 82);
if (typeof this._handlers[type] == "undefined"){
            _yuitest_coverline("build/test/test.js", 83);
this._handlers[type] = [];
        }

        _yuitest_coverline("build/test/test.js", 86);
this._handlers[type].push(listener);
    },
    
    /**
     * Adds a listener for a given event type.
     * @param {String} type The type of event to add a listener for.
     * @param {Function} listener The function to call when the event occurs.
     * @return {void}
     * @method subscribe
     * @deprecated
     */
    subscribe: function(type, listener){
        _yuitest_coverfunc("build/test/test.js", "subscribe", 97);
_yuitest_coverline("build/test/test.js", 98);
this.attach.apply(this, arguments);
    },
    
    /**
     * Fires an event based on the passed-in object.
     * @param {Object|String} event An object with at least a 'type' attribute
     *      or a string indicating the event name.
     * @return {void}
     * @method fire
     */    
    fire: function(event){
        _yuitest_coverfunc("build/test/test.js", "fire", 108);
_yuitest_coverline("build/test/test.js", 109);
if (typeof event == "string"){
            _yuitest_coverline("build/test/test.js", 110);
event = { type: event };
        }
        _yuitest_coverline("build/test/test.js", 112);
if (!event.target){
            _yuitest_coverline("build/test/test.js", 113);
event.target = this;
        }
        
        _yuitest_coverline("build/test/test.js", 116);
if (!event.type){
            _yuitest_coverline("build/test/test.js", 117);
throw new Error("Event object missing 'type' property.");
        }
        
        _yuitest_coverline("build/test/test.js", 120);
if (this._handlers[event.type] instanceof Array){
            _yuitest_coverline("build/test/test.js", 121);
var handlers = this._handlers[event.type];
            _yuitest_coverline("build/test/test.js", 122);
for (var i=0, len=handlers.length; i < len; i++){
                _yuitest_coverline("build/test/test.js", 123);
handlers[i].call(this, event);
            }
        }            
    },

    /**
     * Removes a listener for a given event type.
     * @param {String} type The type of event to remove a listener from.
     * @param {Function} listener The function to remove from the event.
     * @return {void}
     * @method detach
     */
    detach: function(type, listener){
        _yuitest_coverfunc("build/test/test.js", "detach", 135);
_yuitest_coverline("build/test/test.js", 136);
if (this._handlers[type] instanceof Array){
            _yuitest_coverline("build/test/test.js", 137);
var handlers = this._handlers[type];
            _yuitest_coverline("build/test/test.js", 138);
for (var i=0, len=handlers.length; i < len; i++){
                _yuitest_coverline("build/test/test.js", 139);
if (handlers[i] === listener){
                    _yuitest_coverline("build/test/test.js", 140);
handlers.splice(i, 1);
                    _yuitest_coverline("build/test/test.js", 141);
break;
                }
            }
        }            
    },
    
    /**
     * Removes a listener for a given event type.
     * @param {String} type The type of event to remove a listener from.
     * @param {Function} listener The function to remove from the event.
     * @return {void}
     * @method unsubscribe
     * @deprecated
     */
    unsubscribe: function(type, listener){
        _yuitest_coverfunc("build/test/test.js", "unsubscribe", 155);
_yuitest_coverline("build/test/test.js", 156);
this.detach.apply(this, arguments);          
    }    

};

    
/**
 * A test suite that can contain a collection of TestCase and TestSuite objects.
 * @param {String||Object} data The name of the test suite or an object containing
 *      a name property as well as setUp and tearDown methods.
 * @namespace Test
 * @module test
 * @class TestSuite
 * @constructor
 */
_yuitest_coverline("build/test/test.js", 171);
YUITest.TestSuite = function (data) {

    /**
     * The name of the test suite.
     * @type String
     * @property name
     */
    _yuitest_coverfunc("build/test/test.js", "TestSuite", 171);
_yuitest_coverline("build/test/test.js", 178);
this.name = "";

    /**
     * Array of test suites and test cases.
     * @type Array
     * @property items
     * @private
     */
    _yuitest_coverline("build/test/test.js", 186);
this.items = [];

    //initialize the properties
    _yuitest_coverline("build/test/test.js", 189);
if (typeof data == "string"){
        _yuitest_coverline("build/test/test.js", 190);
this.name = data;
    } else {_yuitest_coverline("build/test/test.js", 191);
if (data instanceof Object){
        _yuitest_coverline("build/test/test.js", 192);
for (var prop in data){
            _yuitest_coverline("build/test/test.js", 193);
if (data.hasOwnProperty(prop)){
                _yuitest_coverline("build/test/test.js", 194);
this[prop] = data[prop];
            }
        }
    }}

    //double-check name
    _yuitest_coverline("build/test/test.js", 200);
if (this.name === "" || !this.name) {
        _yuitest_coverline("build/test/test.js", 201);
this.name = YUITest.guid("testSuite_");
    }

};
    
_yuitest_coverline("build/test/test.js", 206);
YUITest.TestSuite.prototype = {
    
    //restore constructor
    constructor: YUITest.TestSuite,
    
    /**
     * Adds a test suite or test case to the test suite.
     * @param {Test.TestSuite||YUITest.TestCase} testObject The test suite or test case to add.
     * @return {Void}
     * @method add
     */
    add : function (testObject) {
        _yuitest_coverfunc("build/test/test.js", "add", 217);
_yuitest_coverline("build/test/test.js", 218);
if (testObject instanceof YUITest.TestSuite || testObject instanceof YUITest.TestCase) {
            _yuitest_coverline("build/test/test.js", 219);
this.items.push(testObject);
        }
        _yuitest_coverline("build/test/test.js", 221);
return this;
    },
    
    //-------------------------------------------------------------------------
    // Stub Methods
    //-------------------------------------------------------------------------

    /**
     * Function to run before each test is executed.
     * @return {Void}
     * @method setUp
     */
    setUp : function () {
    },
    
    /**
     * Function to run after each test is executed.
     * @return {Void}
     * @method tearDown
     */
    tearDown: function () {
    }
    
};
/**
 * Test case containing various tests to run.
 * @param template An object containing any number of test methods, other methods,
 *                 an optional name, and anything else the test case needs.
 * @module test
 * @class TestCase
 * @namespace Test
 * @constructor
 */



_yuitest_coverline("build/test/test.js", 257);
YUITest.TestCase = function (template) {
    
    /*
     * Special rules for the test case. Possible subobjects
     * are fail, for tests that should fail, and error, for
     * tests that should throw an error.
     */
    _yuitest_coverfunc("build/test/test.js", "TestCase", 257);
_yuitest_coverline("build/test/test.js", 264);
this._should = {};
    
    //copy over all properties from the template to this object
    _yuitest_coverline("build/test/test.js", 267);
for (var prop in template) {
        _yuitest_coverline("build/test/test.js", 268);
this[prop] = template[prop];
    }    
    
    //check for a valid name
    _yuitest_coverline("build/test/test.js", 272);
if (typeof this.name != "string") {
        _yuitest_coverline("build/test/test.js", 273);
this.name = YUITest.guid("testCase_");
    }

};

        
_yuitest_coverline("build/test/test.js", 279);
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
        _yuitest_coverfunc("build/test/test.js", "callback", 291);
_yuitest_coverline("build/test/test.js", 292);
return YUITest.TestRunner.callback.apply(YUITest.TestRunner,arguments);
    },

    /**
     * Resumes a paused test and runs the given function.
     * @param {Function} segment (Optional) The function to run.
     *      If omitted, the test automatically passes.
     * @return {Void}
     * @method resume
     */
    resume : function (segment) {
        _yuitest_coverfunc("build/test/test.js", "resume", 302);
_yuitest_coverline("build/test/test.js", 303);
YUITest.TestRunner.resume(segment);
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
        
        _yuitest_coverfunc("build/test/test.js", "wait", 316);
_yuitest_coverline("build/test/test.js", 318);
var actualDelay = (typeof segment == "number" ? segment : delay);
        _yuitest_coverline("build/test/test.js", 319);
actualDelay = (typeof actualDelay == "number" ? actualDelay : 10000);
    
		_yuitest_coverline("build/test/test.js", 321);
if (typeof segment == "function"){
            _yuitest_coverline("build/test/test.js", 322);
throw new YUITest.Wait(segment, actualDelay);
        } else {
            _yuitest_coverline("build/test/test.js", 324);
throw new YUITest.Wait(function(){
                _yuitest_coverfunc("build/test/test.js", "(anonymous 2)", 324);
_yuitest_coverline("build/test/test.js", 325);
YUITest.Assert.fail("Timeout: wait() called but resume() never called.");
            }, actualDelay);
        }
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
        _yuitest_coverfunc("build/test/test.js", "assert", 341);
_yuitest_coverline("build/test/test.js", 342);
YUITest.Assert._increment();
        _yuitest_coverline("build/test/test.js", 343);
if (!condition){
            _yuitest_coverline("build/test/test.js", 344);
throw new YUITest.AssertionError(YUITest.Assert._formatMessage(message, "Assertion failed."));
        }    
    },
    
    /**
     * Forces an assertion error to occur. Shortcut for YUITest.Assert.fail().
     * @method fail
     * @param {String} message (Optional) The message to display with the failure.
     */
    fail: function (message) {    
        _yuitest_coverfunc("build/test/test.js", "fail", 353);
_yuitest_coverline("build/test/test.js", 354);
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
/**
 * An object object containing test result formatting methods.
 * @namespace Test
 * @module test
 * @class TestFormat
 * @static
 */
_yuitest_coverline("build/test/test.js", 404);
YUITest.TestFormat = function(){
    
    /* (intentionally not documented)
     * Basic XML escaping method. Replaces quotes, less-than, greater-than,
     * apostrophe, and ampersand characters with their corresponding entities.
     * @param {String} text The text to encode.
     * @return {String} The XML-escaped text.
     */
    _yuitest_coverfunc("build/test/test.js", "TestFormat", 404);
_yuitest_coverline("build/test/test.js", 412);
function xmlEscape(text){
    
        _yuitest_coverfunc("build/test/test.js", "xmlEscape", 412);
_yuitest_coverline("build/test/test.js", 414);
return text.replace(/[<>"'&]/g, function(value){
            _yuitest_coverfunc("build/test/test.js", "(anonymous 3)", 414);
_yuitest_coverline("build/test/test.js", 415);
switch(value){
                case "<":   _yuitest_coverline("build/test/test.js", 416);
return "&lt;";
                case ">":   _yuitest_coverline("build/test/test.js", 417);
return "&gt;";
                case "\"":  _yuitest_coverline("build/test/test.js", 418);
return "&quot;";
                case "'":   _yuitest_coverline("build/test/test.js", 419);
return "&apos;";
                case "&":   _yuitest_coverline("build/test/test.js", 420);
return "&amp;";
            }
        });
    
    }
        
        
    _yuitest_coverline("build/test/test.js", 427);
return {
    
        /**
         * Returns test results formatted as a JSON string. Requires JSON utility.
         * @param {Object} result The results object created by TestRunner.
         * @return {String} A JSON-formatted string of results.
         * @method JSON
         * @static
         */
        JSON: function(results) {
            _yuitest_coverfunc("build/test/test.js", "JSON", 436);
_yuitest_coverline("build/test/test.js", 437);
return YUITest.Util.JSON.stringify(results);
        },
        
        /**
         * Returns test results formatted as an XML string.
         * @param {Object} result The results object created by TestRunner.
         * @return {String} An XML-formatted string of results.
         * @method XML
         * @static
         */
        XML: function(results) {

            _yuitest_coverfunc("build/test/test.js", "XML", 447);
_yuitest_coverline("build/test/test.js", 449);
function serializeToXML(results){
                _yuitest_coverfunc("build/test/test.js", "serializeToXML", 449);
_yuitest_coverline("build/test/test.js", 450);
var xml = "<" + results.type + " name=\"" + xmlEscape(results.name) + "\"";
                
                _yuitest_coverline("build/test/test.js", 452);
if (typeof(results.duration)=="number"){
                    _yuitest_coverline("build/test/test.js", 453);
xml += " duration=\"" + results.duration + "\"";
                }
                
                _yuitest_coverline("build/test/test.js", 456);
if (results.type == "test"){
                    _yuitest_coverline("build/test/test.js", 457);
xml += " result=\"" + results.result + "\" message=\"" + xmlEscape(results.message) + "\">";
                } else {
                    _yuitest_coverline("build/test/test.js", 459);
xml += " passed=\"" + results.passed + "\" failed=\"" + results.failed + "\" ignored=\"" + results.ignored + "\" total=\"" + results.total + "\">";
                    _yuitest_coverline("build/test/test.js", 460);
for (var prop in results){
                        _yuitest_coverline("build/test/test.js", 461);
if (results.hasOwnProperty(prop)){
                            _yuitest_coverline("build/test/test.js", 462);
if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                _yuitest_coverline("build/test/test.js", 463);
xml += serializeToXML(results[prop]);
                            }
                        }
                    }       
                }

                _yuitest_coverline("build/test/test.js", 469);
xml += "</" + results.type + ">";
                
                _yuitest_coverline("build/test/test.js", 471);
return xml;    
            }

            _yuitest_coverline("build/test/test.js", 474);
return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + serializeToXML(results);

        },


        /**
         * Returns test results formatted in JUnit XML format.
         * @param {Object} result The results object created by TestRunner.
         * @return {String} An XML-formatted string of results.
         * @method JUnitXML
         * @static
         */
        JUnitXML: function(results) {

            _yuitest_coverfunc("build/test/test.js", "JUnitXML", 486);
_yuitest_coverline("build/test/test.js", 488);
function serializeToJUnitXML(results){
                _yuitest_coverfunc("build/test/test.js", "serializeToJUnitXML", 488);
_yuitest_coverline("build/test/test.js", 489);
var xml = "";
                    
                _yuitest_coverline("build/test/test.js", 491);
switch (results.type){
                    //equivalent to testcase in JUnit
                    case "test":
                        _yuitest_coverline("build/test/test.js", 494);
if (results.result != "ignore"){
                            _yuitest_coverline("build/test/test.js", 495);
xml = "<testcase name=\"" + xmlEscape(results.name) + "\" time=\"" + (results.duration/1000) + "\">";
                            _yuitest_coverline("build/test/test.js", 496);
if (results.result == "fail"){
                                _yuitest_coverline("build/test/test.js", 497);
xml += "<failure message=\"" + xmlEscape(results.message) + "\"><![CDATA[" + results.message + "]]></failure>";
                            }
                            _yuitest_coverline("build/test/test.js", 499);
xml+= "</testcase>";
                        }
                        _yuitest_coverline("build/test/test.js", 501);
break;
                        
                    //equivalent to testsuite in JUnit
                    case "testcase":
                    
                        _yuitest_coverline("build/test/test.js", 506);
xml = "<testsuite name=\"" + xmlEscape(results.name) + "\" tests=\"" + results.total + "\" failures=\"" + results.failed + "\" time=\"" + (results.duration/1000) + "\">";
                        
                        _yuitest_coverline("build/test/test.js", 508);
for (var prop in results){
                            _yuitest_coverline("build/test/test.js", 509);
if (results.hasOwnProperty(prop)){
                                _yuitest_coverline("build/test/test.js", 510);
if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                    _yuitest_coverline("build/test/test.js", 511);
xml += serializeToJUnitXML(results[prop]);
                                }
                            }
                        }            
                        
                        _yuitest_coverline("build/test/test.js", 516);
xml += "</testsuite>";
                        _yuitest_coverline("build/test/test.js", 517);
break;
                    
                    //no JUnit equivalent, don't output anything
                    case "testsuite":
                        _yuitest_coverline("build/test/test.js", 521);
for (var prop in results){
                            _yuitest_coverline("build/test/test.js", 522);
if (results.hasOwnProperty(prop)){
                                _yuitest_coverline("build/test/test.js", 523);
if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                    _yuitest_coverline("build/test/test.js", 524);
xml += serializeToJUnitXML(results[prop]);
                                }
                            }
                        }                                                     
                        _yuitest_coverline("build/test/test.js", 528);
break;
                        
                    //top-level, equivalent to testsuites in JUnit
                    case "report":
                    
                        _yuitest_coverline("build/test/test.js", 533);
xml = "<testsuites>";
                    
                        _yuitest_coverline("build/test/test.js", 535);
for (var prop in results){
                            _yuitest_coverline("build/test/test.js", 536);
if (results.hasOwnProperty(prop)){
                                _yuitest_coverline("build/test/test.js", 537);
if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                    _yuitest_coverline("build/test/test.js", 538);
xml += serializeToJUnitXML(results[prop]);
                                }
                            }
                        }            
                        
                        _yuitest_coverline("build/test/test.js", 543);
xml += "</testsuites>";            
                    
                    //no default
                }
                
                _yuitest_coverline("build/test/test.js", 548);
return xml;
         
            }

            _yuitest_coverline("build/test/test.js", 552);
return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + serializeToJUnitXML(results);
        },
    
        /**
         * Returns test results formatted in TAP format.
         * For more information, see <a href="http://testanything.org/">Test Anything Protocol</a>.
         * @param {Object} result The results object created by TestRunner.
         * @return {String} A TAP-formatted string of results.
         * @method TAP
         * @static
         */
        TAP: function(results) {
        
            _yuitest_coverfunc("build/test/test.js", "TAP", 563);
_yuitest_coverline("build/test/test.js", 565);
var currentTestNum = 1;

            _yuitest_coverline("build/test/test.js", 567);
function serializeToTAP(results){
                _yuitest_coverfunc("build/test/test.js", "serializeToTAP", 567);
_yuitest_coverline("build/test/test.js", 568);
var text = "";
                    
                _yuitest_coverline("build/test/test.js", 570);
switch (results.type){

                    case "test":
                        _yuitest_coverline("build/test/test.js", 573);
if (results.result != "ignore"){

                            _yuitest_coverline("build/test/test.js", 575);
text = "ok " + (currentTestNum++) + " - " + results.name;
                            
                            _yuitest_coverline("build/test/test.js", 577);
if (results.result == "fail"){
                                _yuitest_coverline("build/test/test.js", 578);
text = "not " + text + " - " + results.message;
                            }
                            
                            _yuitest_coverline("build/test/test.js", 581);
text += "\n";
                        } else {
                            _yuitest_coverline("build/test/test.js", 583);
text = "#Ignored test " + results.name + "\n";
                        }
                        _yuitest_coverline("build/test/test.js", 585);
break;
                        
                    case "testcase":
                    
                        _yuitest_coverline("build/test/test.js", 589);
text = "#Begin testcase " + results.name + "(" + results.failed + " failed of " + results.total + ")\n";
                                        
                        _yuitest_coverline("build/test/test.js", 591);
for (var prop in results){
                            _yuitest_coverline("build/test/test.js", 592);
if (results.hasOwnProperty(prop)){
                                _yuitest_coverline("build/test/test.js", 593);
if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                    _yuitest_coverline("build/test/test.js", 594);
text += serializeToTAP(results[prop]);
                                }
                            }
                        }            
                        
                        _yuitest_coverline("build/test/test.js", 599);
text += "#End testcase " + results.name + "\n";
                        
                        
                        _yuitest_coverline("build/test/test.js", 602);
break;
                    
                    case "testsuite":

                        _yuitest_coverline("build/test/test.js", 606);
text = "#Begin testsuite " + results.name + "(" + results.failed + " failed of " + results.total + ")\n";                
                    
                        _yuitest_coverline("build/test/test.js", 608);
for (var prop in results){
                            _yuitest_coverline("build/test/test.js", 609);
if (results.hasOwnProperty(prop)){
                                _yuitest_coverline("build/test/test.js", 610);
if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                    _yuitest_coverline("build/test/test.js", 611);
text += serializeToTAP(results[prop]);
                                }
                            }
                        }                                                      

                        _yuitest_coverline("build/test/test.js", 616);
text += "#End testsuite " + results.name + "\n";
                        _yuitest_coverline("build/test/test.js", 617);
break;

                    case "report":
                    
                        _yuitest_coverline("build/test/test.js", 621);
for (var prop in results){
                            _yuitest_coverline("build/test/test.js", 622);
if (results.hasOwnProperty(prop)){
                                _yuitest_coverline("build/test/test.js", 623);
if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                    _yuitest_coverline("build/test/test.js", 624);
text += serializeToTAP(results[prop]);
                                }
                            }
                        }              
                        
                    //no default
                }
                
                _yuitest_coverline("build/test/test.js", 632);
return text;
         
            }

            _yuitest_coverline("build/test/test.js", 636);
return "1.." + results.total + "\n" + serializeToTAP(results);
        }
    
    };
}();
    
    /**
     * An object capable of sending test results to a server.
     * @param {String} url The URL to submit the results to.
     * @param {Function} format (Optiona) A function that outputs the results in a specific format.
     *      Default is YUITest.TestFormat.XML.
     * @constructor
     * @namespace Test
     * @module test
 * @class Reporter
     */
    _yuitest_coverline("build/test/test.js", 652);
YUITest.Reporter = function(url, format) {
    
        /**
         * The URL to submit the data to.
         * @type String
         * @property url
         */
        _yuitest_coverfunc("build/test/test.js", "Reporter", 652);
_yuitest_coverline("build/test/test.js", 659);
this.url = url;
    
        /**
         * The formatting function to call when submitting the data.
         * @type Function
         * @property format
         */
        _yuitest_coverline("build/test/test.js", 666);
this.format = format || YUITest.TestFormat.XML;
    
        /**
         * Extra fields to submit with the request.
         * @type Object
         * @property _fields
         * @private
         */
        _yuitest_coverline("build/test/test.js", 674);
this._fields = new Object();
        
        /**
         * The form element used to submit the results.
         * @type HTMLFormElement
         * @property _form
         * @private
         */
        _yuitest_coverline("build/test/test.js", 682);
this._form = null;
    
        /**
         * Iframe used as a target for form submission.
         * @type HTMLIFrameElement
         * @property _iframe
         * @private
         */
        _yuitest_coverline("build/test/test.js", 690);
this._iframe = null;
    };
    
    _yuitest_coverline("build/test/test.js", 693);
YUITest.Reporter.prototype = {
    
        //restore missing constructor
        constructor: YUITest.Reporter,
    
        /**
         * Adds a field to the form that submits the results.
         * @param {String} name The name of the field.
         * @param {Variant} value The value of the field.
         * @return {Void}
         * @method addField
         */
        addField : function (name, value){
            _yuitest_coverfunc("build/test/test.js", "addField", 705);
_yuitest_coverline("build/test/test.js", 706);
this._fields[name] = value;    
        },
        
        /**
         * Removes all previous defined fields.
         * @return {Void}
         * @method clearFields
         */
        clearFields : function(){
            _yuitest_coverfunc("build/test/test.js", "clearFields", 714);
_yuitest_coverline("build/test/test.js", 715);
this._fields = new Object();
        },
    
        /**
         * Cleans up the memory associated with the TestReporter, removing DOM elements
         * that were created.
         * @return {Void}
         * @method destroy
         */
        destroy : function() {
            _yuitest_coverfunc("build/test/test.js", "destroy", 724);
_yuitest_coverline("build/test/test.js", 725);
if (this._form){
                _yuitest_coverline("build/test/test.js", 726);
this._form.parentNode.removeChild(this._form);
                _yuitest_coverline("build/test/test.js", 727);
this._form = null;
            }        
            _yuitest_coverline("build/test/test.js", 729);
if (this._iframe){
                _yuitest_coverline("build/test/test.js", 730);
this._iframe.parentNode.removeChild(this._iframe);
                _yuitest_coverline("build/test/test.js", 731);
this._iframe = null;
            }
            _yuitest_coverline("build/test/test.js", 733);
this._fields = null;
        },
    
        /**
         * Sends the report to the server.
         * @param {Object} results The results object created by TestRunner.
         * @return {Void}
         * @method report
         */
        report : function(results){
        
            //if the form hasn't been created yet, create it
            _yuitest_coverfunc("build/test/test.js", "report", 742);
_yuitest_coverline("build/test/test.js", 745);
if (!this._form){
                _yuitest_coverline("build/test/test.js", 746);
this._form = document.createElement("form");
                _yuitest_coverline("build/test/test.js", 747);
this._form.method = "post";
                _yuitest_coverline("build/test/test.js", 748);
this._form.style.visibility = "hidden";
                _yuitest_coverline("build/test/test.js", 749);
this._form.style.position = "absolute";
                _yuitest_coverline("build/test/test.js", 750);
this._form.style.top = 0;
                _yuitest_coverline("build/test/test.js", 751);
document.body.appendChild(this._form);
            
                //IE won't let you assign a name using the DOM, must do it the hacky way
                _yuitest_coverline("build/test/test.js", 754);
try {
                    _yuitest_coverline("build/test/test.js", 755);
this._iframe = document.createElement("<iframe name=\"yuiTestTarget\" />");
                } catch (ex){
                    _yuitest_coverline("build/test/test.js", 757);
this._iframe = document.createElement("iframe");
                    _yuitest_coverline("build/test/test.js", 758);
this._iframe.name = "yuiTestTarget";
                }
    
                _yuitest_coverline("build/test/test.js", 761);
this._iframe.src = "javascript:false";
                _yuitest_coverline("build/test/test.js", 762);
this._iframe.style.visibility = "hidden";
                _yuitest_coverline("build/test/test.js", 763);
this._iframe.style.position = "absolute";
                _yuitest_coverline("build/test/test.js", 764);
this._iframe.style.top = 0;
                _yuitest_coverline("build/test/test.js", 765);
document.body.appendChild(this._iframe);
    
                _yuitest_coverline("build/test/test.js", 767);
this._form.target = "yuiTestTarget";
            }
    
            //set the form's action
            _yuitest_coverline("build/test/test.js", 771);
this._form.action = this.url;
        
            //remove any existing fields
            _yuitest_coverline("build/test/test.js", 774);
while(this._form.hasChildNodes()){
                _yuitest_coverline("build/test/test.js", 775);
this._form.removeChild(this._form.lastChild);
            }
            
            //create default fields
            _yuitest_coverline("build/test/test.js", 779);
this._fields.results = this.format(results);
            _yuitest_coverline("build/test/test.js", 780);
this._fields.useragent = navigator.userAgent;
            _yuitest_coverline("build/test/test.js", 781);
this._fields.timestamp = (new Date()).toLocaleString();
    
            //add fields to the form
            _yuitest_coverline("build/test/test.js", 784);
for (var prop in this._fields){
                _yuitest_coverline("build/test/test.js", 785);
var value = this._fields[prop];
                _yuitest_coverline("build/test/test.js", 786);
if (this._fields.hasOwnProperty(prop) && (typeof value != "function")){
                    _yuitest_coverline("build/test/test.js", 787);
var input = document.createElement("input");
                    _yuitest_coverline("build/test/test.js", 788);
input.type = "hidden";
                    _yuitest_coverline("build/test/test.js", 789);
input.name = prop;
                    _yuitest_coverline("build/test/test.js", 790);
input.value = value;
                    _yuitest_coverline("build/test/test.js", 791);
this._form.appendChild(input);
                }
            }
    
            //remove default fields
            _yuitest_coverline("build/test/test.js", 796);
delete this._fields.results;
            _yuitest_coverline("build/test/test.js", 797);
delete this._fields.useragent;
            _yuitest_coverline("build/test/test.js", 798);
delete this._fields.timestamp;
            
            _yuitest_coverline("build/test/test.js", 800);
if (arguments[1] !== false){
                _yuitest_coverline("build/test/test.js", 801);
this._form.submit();
            }
        
        }
    
    };
    
    /**
     * Runs test suites and test cases, providing events to allowing for the
     * interpretation of test results.
     * @namespace Test
     * @module test
 * @class TestRunner
     * @static
     */
    _yuitest_coverline("build/test/test.js", 816);
YUITest.TestRunner = function(){

        /*(intentionally not documented)
         * Determines if any of the array of test groups appears
         * in the given TestRunner filter.
         * @param {Array} testGroups The array of test groups to
         *      search for.
         * @param {String} filter The TestRunner groups filter.
         */
        _yuitest_coverfunc("build/test/test.js", "TestRunner", 816);
_yuitest_coverline("build/test/test.js", 825);
function inGroups(testGroups, filter){
            _yuitest_coverfunc("build/test/test.js", "inGroups", 825);
_yuitest_coverline("build/test/test.js", 826);
if (!filter.length){
                _yuitest_coverline("build/test/test.js", 827);
return true;
            } else {                
                _yuitest_coverline("build/test/test.js", 829);
if (testGroups){
                    _yuitest_coverline("build/test/test.js", 830);
for (var i=0, len=testGroups.length; i < len; i++){
                        _yuitest_coverline("build/test/test.js", 831);
if (filter.indexOf("," + testGroups[i] + ",") > -1){
                            _yuitest_coverline("build/test/test.js", 832);
return true;
                        }
                    }
                }
                _yuitest_coverline("build/test/test.js", 836);
return false;
            }
        }
    
        /**
         * A node in the test tree structure. May represent a TestSuite, TestCase, or
         * test function.
         * @param {Variant} testObject A TestSuite, TestCase, or the name of a test function.
         * @module test
 * @class TestNode
         * @constructor
         * @private
         */
        _yuitest_coverline("build/test/test.js", 849);
function TestNode(testObject){
        
            /**
             * The TestSuite, TestCase, or test function represented by this node.
             * @type Variant
             * @property testObject
             */
            _yuitest_coverfunc("build/test/test.js", "TestNode", 849);
_yuitest_coverline("build/test/test.js", 856);
this.testObject = testObject;
            
            /**
             * Pointer to this node's first child.
             * @type TestNode
             * @property firstChild
             */        
            _yuitest_coverline("build/test/test.js", 863);
this.firstChild = null;
            
            /**
             * Pointer to this node's last child.
             * @type TestNode
             * @property lastChild
             */        
            _yuitest_coverline("build/test/test.js", 870);
this.lastChild = null;
            
            /**
             * Pointer to this node's parent.
             * @type TestNode
             * @property parent
             */        
            _yuitest_coverline("build/test/test.js", 877);
this.parent = null; 
       
            /**
             * Pointer to this node's next sibling.
             * @type TestNode
             * @property next
             */        
            _yuitest_coverline("build/test/test.js", 884);
this.next = null;
            
            /**
             * Test results for this test object.
             * @type object
             * @property results
             */                
            _yuitest_coverline("build/test/test.js", 891);
this.results = new YUITest.Results();
            
            //initialize results
            _yuitest_coverline("build/test/test.js", 894);
if (testObject instanceof YUITest.TestSuite){
                _yuitest_coverline("build/test/test.js", 895);
this.results.type = "testsuite";
                _yuitest_coverline("build/test/test.js", 896);
this.results.name = testObject.name;
            } else {_yuitest_coverline("build/test/test.js", 897);
if (testObject instanceof YUITest.TestCase){
                _yuitest_coverline("build/test/test.js", 898);
this.results.type = "testcase";
                _yuitest_coverline("build/test/test.js", 899);
this.results.name = testObject.name;
            }}
           
        }
        
        _yuitest_coverline("build/test/test.js", 904);
TestNode.prototype = {
        
            /**
             * Appends a new test object (TestSuite, TestCase, or test function name) as a child
             * of this node.
             * @param {Variant} testObject A TestSuite, TestCase, or the name of a test function.
             * @return {Void}
             * @method appendChild
             */
            appendChild : function (testObject){
                _yuitest_coverfunc("build/test/test.js", "appendChild", 913);
_yuitest_coverline("build/test/test.js", 914);
var node = new TestNode(testObject);
                _yuitest_coverline("build/test/test.js", 915);
if (this.firstChild === null){
                    _yuitest_coverline("build/test/test.js", 916);
this.firstChild = this.lastChild = node;
                } else {
                    _yuitest_coverline("build/test/test.js", 918);
this.lastChild.next = node;
                    _yuitest_coverline("build/test/test.js", 919);
this.lastChild = node;
                }
                _yuitest_coverline("build/test/test.js", 921);
node.parent = this;
                _yuitest_coverline("build/test/test.js", 922);
return node;
            }       
        };
    
        /**
         * Runs test suites and test cases, providing events to allowing for the
         * interpretation of test results.
         * @namespace Test
         * @module test
 * @class Runner
         * @static
         */
        _yuitest_coverline("build/test/test.js", 934);
function TestRunner(){
        
            //inherit from EventTarget
            _yuitest_coverfunc("build/test/test.js", "TestRunner", 934);
_yuitest_coverline("build/test/test.js", 937);
YUITest.EventTarget.call(this);
            
            /**
             * Suite on which to attach all TestSuites and TestCases to be run.
             * @type YUITest.TestSuite
             * @property masterSuite
             * @static
             * @private
             */
            _yuitest_coverline("build/test/test.js", 946);
this.masterSuite = new YUITest.TestSuite(YUITest.guid('testSuite_'));
    
            /**
             * Pointer to the current node in the test tree.
             * @type TestNode
             * @private
             * @property _cur
             * @static
             */
            _yuitest_coverline("build/test/test.js", 955);
this._cur = null;
            
            /**
             * Pointer to the root node in the test tree.
             * @type TestNode
             * @private
             * @property _root
             * @static
             */
            _yuitest_coverline("build/test/test.js", 964);
this._root = null;
            
            /**
             * Indicates if the TestRunner will log events or not.
             * @type Boolean
             * @property _log
             * @private
             * @static
             */
            _yuitest_coverline("build/test/test.js", 973);
this._log = true;
            
            /**
             * Indicates if the TestRunner is waiting as a result of
             * wait() being called.
             * @type Boolean
             * @property _waiting
             * @private
             * @static
             */
            _yuitest_coverline("build/test/test.js", 983);
this._waiting = false;
            
            /**
             * Indicates if the TestRunner is currently running tests.
             * @type Boolean
             * @private
             * @property _running
             * @static
             */
            _yuitest_coverline("build/test/test.js", 992);
this._running = false;
            
            /**
             * Holds copy of the results object generated when all tests are
             * complete.
             * @type Object
             * @private
             * @property _lastResults
             * @static
             */
            _yuitest_coverline("build/test/test.js", 1002);
this._lastResults = null;       
            
            /**
             * Data object that is passed around from method to method.
             * @type Object
             * @private
             * @property _data
             * @static
             */
            _yuitest_coverline("build/test/test.js", 1011);
this._context = null;
            
            /**
             * The list of test groups to run. The list is represented
             * by a comma delimited string with commas at the start and
             * end.
             * @type String
             * @private
             * @property _groups
             * @static
             */
            _yuitest_coverline("build/test/test.js", 1022);
this._groups = "";

        }
        
        _yuitest_coverline("build/test/test.js", 1026);
TestRunner.prototype = YUITest.Util.mix(new YUITest.EventTarget(), {
            
            /**
            * If true, YUITest will not fire an error for tests with no Asserts.
            * @prop _ignoreEmpty
            * @private
            * @type Boolean
            * @static
            */
            _ignoreEmpty: false,

            //restore prototype
            constructor: YUITest.TestRunner,
        
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
             * Fires when a non-test method has an error.
             * @event error
             * @static
             */        
            ERROR_EVENT : "error",
            
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
            // Test Tree-Related Methods
            //-------------------------------------------------------------------------
    
            /**
             * Adds a test case to the test tree as a child of the specified node.
             * @param {TestNode} parentNode The node to add the test case to as a child.
             * @param {Test.TestCase} testCase The test case to add.
             * @return {Void}
             * @static
             * @private
             * @method _addTestCaseToTestTree
             */
           _addTestCaseToTestTree : function (parentNode, testCase){
                
                //add the test suite
                _yuitest_coverfunc("build/test/test.js", "_addTestCaseToTestTree", 1130);
_yuitest_coverline("build/test/test.js", 1133);
var node = parentNode.appendChild(testCase),
                    prop,
                    testName;
                
                //iterate over the items in the test case
                _yuitest_coverline("build/test/test.js", 1138);
for (prop in testCase){
                    _yuitest_coverline("build/test/test.js", 1139);
if ((prop.indexOf("test") === 0 || prop.indexOf(" ") > -1) && typeof testCase[prop] == "function"){
                        _yuitest_coverline("build/test/test.js", 1140);
node.appendChild(prop);
                    }
                }
             
            },
            
            /**
             * Adds a test suite to the test tree as a child of the specified node.
             * @param {TestNode} parentNode The node to add the test suite to as a child.
             * @param {Test.TestSuite} testSuite The test suite to add.
             * @return {Void}
             * @static
             * @private
             * @method _addTestSuiteToTestTree
             */
            _addTestSuiteToTestTree : function (parentNode, testSuite) {
                
                //add the test suite
                _yuitest_coverfunc("build/test/test.js", "_addTestSuiteToTestTree", 1155);
_yuitest_coverline("build/test/test.js", 1158);
var node = parentNode.appendChild(testSuite);
                
                //iterate over the items in the master suite
                _yuitest_coverline("build/test/test.js", 1161);
for (var i=0; i < testSuite.items.length; i++){
                    _yuitest_coverline("build/test/test.js", 1162);
if (testSuite.items[i] instanceof YUITest.TestSuite) {
                        _yuitest_coverline("build/test/test.js", 1163);
this._addTestSuiteToTestTree(node, testSuite.items[i]);
                    } else {_yuitest_coverline("build/test/test.js", 1164);
if (testSuite.items[i] instanceof YUITest.TestCase) {
                        _yuitest_coverline("build/test/test.js", 1165);
this._addTestCaseToTestTree(node, testSuite.items[i]);
                    }}                   
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
            
                _yuitest_coverfunc("build/test/test.js", "_buildTestTree", 1179);
_yuitest_coverline("build/test/test.js", 1181);
this._root = new TestNode(this.masterSuite);
                //this._cur = this._root;
                
                //iterate over the items in the master suite
                _yuitest_coverline("build/test/test.js", 1185);
for (var i=0; i < this.masterSuite.items.length; i++){
                    _yuitest_coverline("build/test/test.js", 1186);
if (this.masterSuite.items[i] instanceof YUITest.TestSuite) {
                        _yuitest_coverline("build/test/test.js", 1187);
this._addTestSuiteToTestTree(this._root, this.masterSuite.items[i]);
                    } else {_yuitest_coverline("build/test/test.js", 1188);
if (this.masterSuite.items[i] instanceof YUITest.TestCase) {
                        _yuitest_coverline("build/test/test.js", 1189);
this._addTestCaseToTestTree(this._root, this.masterSuite.items[i]);
                    }}                   
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
                _yuitest_coverfunc("build/test/test.js", "_handleTestObjectComplete", 1207);
_yuitest_coverline("build/test/test.js", 1208);
var parentNode;
                
                _yuitest_coverline("build/test/test.js", 1210);
if (node && (typeof node.testObject == "object")) {
                    _yuitest_coverline("build/test/test.js", 1211);
parentNode = node.parent;
                
                    _yuitest_coverline("build/test/test.js", 1213);
if (parentNode){
                        _yuitest_coverline("build/test/test.js", 1214);
parentNode.results.include(node.results); 
                        _yuitest_coverline("build/test/test.js", 1215);
parentNode.results[node.testObject.name] = node.results;
                    }
                
                    _yuitest_coverline("build/test/test.js", 1218);
if (node.testObject instanceof YUITest.TestSuite){
                        _yuitest_coverline("build/test/test.js", 1219);
this._execNonTestMethod(node, "tearDown", false);
                        _yuitest_coverline("build/test/test.js", 1220);
node.results.duration = (new Date()) - node._start;
                        _yuitest_coverline("build/test/test.js", 1221);
this.fire({ type: this.TEST_SUITE_COMPLETE_EVENT, testSuite: node.testObject, results: node.results});
                    } else {_yuitest_coverline("build/test/test.js", 1222);
if (node.testObject instanceof YUITest.TestCase){
                        _yuitest_coverline("build/test/test.js", 1223);
this._execNonTestMethod(node, "destroy", false);
                        _yuitest_coverline("build/test/test.js", 1224);
node.results.duration = (new Date()) - node._start;
                        _yuitest_coverline("build/test/test.js", 1225);
this.fire({ type: this.TEST_CASE_COMPLETE_EVENT, testCase: node.testObject, results: node.results});
                    }}      
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
            
                _yuitest_coverfunc("build/test/test.js", "_next", 1241);
_yuitest_coverline("build/test/test.js", 1243);
if (this._cur === null){
                    _yuitest_coverline("build/test/test.js", 1244);
this._cur = this._root;
                } else {_yuitest_coverline("build/test/test.js", 1245);
if (this._cur.firstChild) {
                    _yuitest_coverline("build/test/test.js", 1246);
this._cur = this._cur.firstChild;
                } else {_yuitest_coverline("build/test/test.js", 1247);
if (this._cur.next) {
                    _yuitest_coverline("build/test/test.js", 1248);
this._cur = this._cur.next;            
                } else {
                    _yuitest_coverline("build/test/test.js", 1250);
while (this._cur && !this._cur.next && this._cur !== this._root){
                        _yuitest_coverline("build/test/test.js", 1251);
this._handleTestObjectComplete(this._cur);
                        _yuitest_coverline("build/test/test.js", 1252);
this._cur = this._cur.parent;
                    }
                    
                    _yuitest_coverline("build/test/test.js", 1255);
this._handleTestObjectComplete(this._cur);               
                        
                    _yuitest_coverline("build/test/test.js", 1257);
if (this._cur == this._root){
                        _yuitest_coverline("build/test/test.js", 1258);
this._cur.results.type = "report";
                        _yuitest_coverline("build/test/test.js", 1259);
this._cur.results.timestamp = (new Date()).toLocaleString();
                        _yuitest_coverline("build/test/test.js", 1260);
this._cur.results.duration = (new Date()) - this._cur._start;   
                        _yuitest_coverline("build/test/test.js", 1261);
this._lastResults = this._cur.results;
                        _yuitest_coverline("build/test/test.js", 1262);
this._running = false;                         
                        _yuitest_coverline("build/test/test.js", 1263);
this.fire({ type: this.COMPLETE_EVENT, results: this._lastResults});
                        _yuitest_coverline("build/test/test.js", 1264);
this._cur = null;
                    } else {_yuitest_coverline("build/test/test.js", 1265);
if (this._cur) {
                        _yuitest_coverline("build/test/test.js", 1266);
this._cur = this._cur.next;                
                    }}
                }}}
            
                _yuitest_coverline("build/test/test.js", 1270);
return this._cur;
            },
            
            /**
             * Executes a non-test method (init, setUp, tearDown, destroy)
             * and traps an errors. If an error occurs, an error event is
             * fired.
             * @param {Object} node The test node in the testing tree.
             * @param {String} methodName The name of the method to execute.
             * @param {Boolean} allowAsync Determines if the method can be called asynchronously.
             * @return {Boolean} True if an async method was called, false if not.
             * @method _execNonTestMethod
             * @private
             */
            _execNonTestMethod: function(node, methodName, allowAsync){
                _yuitest_coverfunc("build/test/test.js", "_execNonTestMethod", 1284);
_yuitest_coverline("build/test/test.js", 1285);
var testObject = node.testObject,
                    event = { type: this.ERROR_EVENT };
                _yuitest_coverline("build/test/test.js", 1287);
try {
                    _yuitest_coverline("build/test/test.js", 1288);
if (allowAsync && testObject["async:" + methodName]){
                        _yuitest_coverline("build/test/test.js", 1289);
testObject["async:" + methodName](this._context);
                        _yuitest_coverline("build/test/test.js", 1290);
return true;
                    } else {
                        _yuitest_coverline("build/test/test.js", 1292);
testObject[methodName](this._context);
                    }
                } catch (ex){
                    _yuitest_coverline("build/test/test.js", 1295);
node.results.errors++;
                    _yuitest_coverline("build/test/test.js", 1296);
event.error = ex;
                    _yuitest_coverline("build/test/test.js", 1297);
event.methodName = methodName;
                    _yuitest_coverline("build/test/test.js", 1298);
if (testObject instanceof YUITest.TestCase){
                        _yuitest_coverline("build/test/test.js", 1299);
event.testCase = testObject;
                    } else {
                        _yuitest_coverline("build/test/test.js", 1301);
event.testSuite = testSuite;
                    }
                    
                    _yuitest_coverline("build/test/test.js", 1304);
this.fire(event);
                }  

                _yuitest_coverline("build/test/test.js", 1307);
return false;
            },
            
            /**
             * Runs a test case or test suite, returning the results.
             * @param {Test.TestCase|YUITest.TestSuite} testObject The test case or test suite to run.
             * @return {Object} Results of the execution with properties passed, failed, and total.
             * @private
             * @method _run
             * @static
             */
            _run : function () {
            
                //flag to indicate if the TestRunner should wait before continuing
                _yuitest_coverfunc("build/test/test.js", "_run", 1318);
_yuitest_coverline("build/test/test.js", 1321);
var shouldWait = false;
                
                //get the next test node
                _yuitest_coverline("build/test/test.js", 1324);
var node = this._next();
                
                _yuitest_coverline("build/test/test.js", 1326);
if (node !== null) {
                
                    //set flag to say the testrunner is running
                    _yuitest_coverline("build/test/test.js", 1329);
this._running = true;
                    
                    //eliminate last results
                    _yuitest_coverline("build/test/test.js", 1332);
this._lastResult = null;                  
                
                    _yuitest_coverline("build/test/test.js", 1334);
var testObject = node.testObject;
                    
                    //figure out what to do
                    _yuitest_coverline("build/test/test.js", 1337);
if (typeof testObject == "object" && testObject !== null){
                        _yuitest_coverline("build/test/test.js", 1338);
if (testObject instanceof YUITest.TestSuite){
                            _yuitest_coverline("build/test/test.js", 1339);
this.fire({ type: this.TEST_SUITE_BEGIN_EVENT, testSuite: testObject });
                            _yuitest_coverline("build/test/test.js", 1340);
node._start = new Date();
                            _yuitest_coverline("build/test/test.js", 1341);
this._execNonTestMethod(node, "setUp" ,false);
                        } else {_yuitest_coverline("build/test/test.js", 1342);
if (testObject instanceof YUITest.TestCase){
                            _yuitest_coverline("build/test/test.js", 1343);
this.fire({ type: this.TEST_CASE_BEGIN_EVENT, testCase: testObject });
                            _yuitest_coverline("build/test/test.js", 1344);
node._start = new Date();
                            
                            //regular or async init
                            /*try {
                                if (testObject["async:init"]){
                                    testObject["async:init"](this._context);
                                    return;
                                } else {
                                    testObject.init(this._context);
                                }
                            } catch (ex){
                                node.results.errors++;
                                this.fire({ type: this.ERROR_EVENT, error: ex, testCase: testObject, methodName: "init" });
                            }*/
                            _yuitest_coverline("build/test/test.js", 1358);
if(this._execNonTestMethod(node, "init", true)){
                                _yuitest_coverline("build/test/test.js", 1359);
return;
                            }
                        }}
                        
                        //some environments don't support setTimeout
                        _yuitest_coverline("build/test/test.js", 1364);
if (typeof setTimeout != "undefined"){                    
                            _yuitest_coverline("build/test/test.js", 1365);
setTimeout(function(){
                                _yuitest_coverfunc("build/test/test.js", "(anonymous 4)", 1365);
_yuitest_coverline("build/test/test.js", 1366);
YUITest.TestRunner._run();
                            }, 0);
                        } else {
                            _yuitest_coverline("build/test/test.js", 1369);
this._run();
                        }
                    } else {
                        _yuitest_coverline("build/test/test.js", 1372);
this._runTest(node);
                    }
    
                }
            },
            
            _resumeTest : function (segment) {
            
                //get relevant information
                _yuitest_coverfunc("build/test/test.js", "_resumeTest", 1378);
_yuitest_coverline("build/test/test.js", 1381);
var node = this._cur;                
                
                //we know there's no more waiting now
                _yuitest_coverline("build/test/test.js", 1384);
this._waiting = false;
                
                //if there's no node, it probably means a wait() was called after resume()
                _yuitest_coverline("build/test/test.js", 1387);
if (!node){
                    //TODO: Handle in some way?
                    //console.log("wait() called after resume()");
                    //this.fire("error", { testCase: "(unknown)", test: "(unknown)", error: new Error("wait() called after resume()")} );
                    _yuitest_coverline("build/test/test.js", 1391);
return;
                }
                
                _yuitest_coverline("build/test/test.js", 1394);
var testName = node.testObject;
                _yuitest_coverline("build/test/test.js", 1395);
var testCase = node.parent.testObject;
            
                //cancel other waits if available
                _yuitest_coverline("build/test/test.js", 1398);
if (testCase.__yui_wait){
                    _yuitest_coverline("build/test/test.js", 1399);
clearTimeout(testCase.__yui_wait);
                    _yuitest_coverline("build/test/test.js", 1400);
delete testCase.__yui_wait;
                }

                //get the "should" test cases
                _yuitest_coverline("build/test/test.js", 1404);
var shouldFail = testName.indexOf("fail:") === 0 ||
                                    (testCase._should.fail || {})[testName];
                _yuitest_coverline("build/test/test.js", 1406);
var shouldError = (testCase._should.error || {})[testName];
                
                //variable to hold whether or not the test failed
                _yuitest_coverline("build/test/test.js", 1409);
var failed = false;
                _yuitest_coverline("build/test/test.js", 1410);
var error = null;
                    
                //try the test
                _yuitest_coverline("build/test/test.js", 1413);
try {
                
                    //run the test
                    _yuitest_coverline("build/test/test.js", 1416);
segment.call(testCase, this._context);                    
                
                    //if the test hasn't already failed and doesn't have any asserts...
                    _yuitest_coverline("build/test/test.js", 1419);
if(YUITest.Assert._getCount() == 0 && !this._ignoreEmpty){
                        _yuitest_coverline("build/test/test.js", 1420);
throw new YUITest.AssertionError("Test has no asserts.");
                    }                                                        
                    //if it should fail, and it got here, then it's a fail because it didn't
                     else {_yuitest_coverline("build/test/test.js", 1423);
if (shouldFail){
                        _yuitest_coverline("build/test/test.js", 1424);
error = new YUITest.ShouldFail();
                        _yuitest_coverline("build/test/test.js", 1425);
failed = true;
                    } else {_yuitest_coverline("build/test/test.js", 1426);
if (shouldError){
                        _yuitest_coverline("build/test/test.js", 1427);
error = new YUITest.ShouldError();
                        _yuitest_coverline("build/test/test.js", 1428);
failed = true;
                    }}}
                               
                } catch (thrown){

                    //cancel any pending waits, the test already failed
                    _yuitest_coverline("build/test/test.js", 1434);
if (testCase.__yui_wait){
                        _yuitest_coverline("build/test/test.js", 1435);
clearTimeout(testCase.__yui_wait);
                        _yuitest_coverline("build/test/test.js", 1436);
delete testCase.__yui_wait;
                    }                    
                
                    //figure out what type of error it was
                    _yuitest_coverline("build/test/test.js", 1440);
if (thrown instanceof YUITest.AssertionError) {
                        _yuitest_coverline("build/test/test.js", 1441);
if (!shouldFail){
                            _yuitest_coverline("build/test/test.js", 1442);
error = thrown;
                            _yuitest_coverline("build/test/test.js", 1443);
failed = true;
                        }
                    } else {_yuitest_coverline("build/test/test.js", 1445);
if (thrown instanceof YUITest.Wait){
                    
                        _yuitest_coverline("build/test/test.js", 1447);
if (typeof thrown.segment == "function"){
                            _yuitest_coverline("build/test/test.js", 1448);
if (typeof thrown.delay == "number"){
                            
                                //some environments don't support setTimeout
                                _yuitest_coverline("build/test/test.js", 1451);
if (typeof setTimeout != "undefined"){
                                    _yuitest_coverline("build/test/test.js", 1452);
testCase.__yui_wait = setTimeout(function(){
                                        _yuitest_coverfunc("build/test/test.js", "(anonymous 5)", 1452);
_yuitest_coverline("build/test/test.js", 1453);
YUITest.TestRunner._resumeTest(thrown.segment);
                                    }, thrown.delay);
                                    _yuitest_coverline("build/test/test.js", 1455);
this._waiting = true;
                                } else {
                                    _yuitest_coverline("build/test/test.js", 1457);
throw new Error("Asynchronous tests not supported in this environment.");
                                }
                            }
                        }
                        
                        _yuitest_coverline("build/test/test.js", 1462);
return;
                    
                    } else {
                        //first check to see if it should error
                        _yuitest_coverline("build/test/test.js", 1466);
if (!shouldError) {                        
                            _yuitest_coverline("build/test/test.js", 1467);
error = new YUITest.UnexpectedError(thrown);
                            _yuitest_coverline("build/test/test.js", 1468);
failed = true;
                        } else {
                            //check to see what type of data we have
                            _yuitest_coverline("build/test/test.js", 1471);
if (typeof shouldError == "string"){
                                
                                //if it's a string, check the error message
                                _yuitest_coverline("build/test/test.js", 1474);
if (thrown.message != shouldError){
                                    _yuitest_coverline("build/test/test.js", 1475);
error = new YUITest.UnexpectedError(thrown);
                                    _yuitest_coverline("build/test/test.js", 1476);
failed = true;                                    
                                }
                            } else {_yuitest_coverline("build/test/test.js", 1478);
if (typeof shouldError == "function"){
                            
                                //if it's a function, see if the error is an instance of it
                                _yuitest_coverline("build/test/test.js", 1481);
if (!(thrown instanceof shouldError)){
                                    _yuitest_coverline("build/test/test.js", 1482);
error = new YUITest.UnexpectedError(thrown);
                                    _yuitest_coverline("build/test/test.js", 1483);
failed = true;
                                }
                            
                            } else {_yuitest_coverline("build/test/test.js", 1486);
if (typeof shouldError == "object" && shouldError !== null){
                            
                                //if it's an object, check the instance and message
                                _yuitest_coverline("build/test/test.js", 1489);
if (!(thrown instanceof shouldError.constructor) || 
                                        thrown.message != shouldError.message){
                                    _yuitest_coverline("build/test/test.js", 1491);
error = new YUITest.UnexpectedError(thrown);
                                    _yuitest_coverline("build/test/test.js", 1492);
failed = true;                                    
                                }
                            
                            }}}
                        
                        }
                    }}
                    
                }
                
                //fire appropriate event
                _yuitest_coverline("build/test/test.js", 1503);
if (failed) {
                    _yuitest_coverline("build/test/test.js", 1504);
this.fire({ type: this.TEST_FAIL_EVENT, testCase: testCase, testName: testName, error: error });
                } else {
                    _yuitest_coverline("build/test/test.js", 1506);
this.fire({ type: this.TEST_PASS_EVENT, testCase: testCase, testName: testName });
                }
                
                //run the tear down
                _yuitest_coverline("build/test/test.js", 1510);
this._execNonTestMethod(node.parent, "tearDown", false);
                
                //reset the assert count
                _yuitest_coverline("build/test/test.js", 1513);
YUITest.Assert._reset();
                
                //calculate duration
                _yuitest_coverline("build/test/test.js", 1516);
var duration = (new Date()) - node._start;
                
                //update results
                _yuitest_coverline("build/test/test.js", 1519);
node.parent.results[testName] = { 
                    result: failed ? "fail" : "pass",
                    message: error ? error.getMessage() : "Test passed",
                    type: "test",
                    name: testName,
                    duration: duration
                };
                
                _yuitest_coverline("build/test/test.js", 1527);
if (failed){
                    _yuitest_coverline("build/test/test.js", 1528);
node.parent.results.failed++;
                } else {
                    _yuitest_coverline("build/test/test.js", 1530);
node.parent.results.passed++;
                }
                _yuitest_coverline("build/test/test.js", 1532);
node.parent.results.total++;
    
                //set timeout not supported in all environments
                _yuitest_coverline("build/test/test.js", 1535);
if (typeof setTimeout != "undefined"){
                    _yuitest_coverline("build/test/test.js", 1536);
setTimeout(function(){
                        _yuitest_coverfunc("build/test/test.js", "(anonymous 6)", 1536);
_yuitest_coverline("build/test/test.js", 1537);
YUITest.TestRunner._run();
                    }, 0);
                } else {
                    _yuitest_coverline("build/test/test.js", 1540);
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
            
                _yuitest_coverfunc("build/test/test.js", "_handleError", 1558);
_yuitest_coverline("build/test/test.js", 1560);
if (this._waiting){
                    _yuitest_coverline("build/test/test.js", 1561);
this._resumeTest(function(){
                        _yuitest_coverfunc("build/test/test.js", "(anonymous 7)", 1561);
_yuitest_coverline("build/test/test.js", 1562);
throw error;
                    });
                } else {
                    _yuitest_coverline("build/test/test.js", 1565);
throw error;
                }           
            
            },
                    
            /**
             * Runs a single test based on the data provided in the node.
             * @method _runTest
             * @param {TestNode} node The TestNode representing the test to run.
             * @return {Void}
             * @static
             * @private
             */
            _runTest : function (node) {
            
                //get relevant information
                _yuitest_coverfunc("build/test/test.js", "_runTest", 1578);
_yuitest_coverline("build/test/test.js", 1581);
var testName = node.testObject,
                    testCase = node.parent.testObject,
                    test = testCase[testName],
                
                    //get the "should" test cases
                    shouldIgnore = testName.indexOf("ignore:") === 0 ||
                                    !inGroups(testCase.groups, this._groups) ||
                                    (testCase._should.ignore || {})[testName];   //deprecated
                
                //figure out if the test should be ignored or not
                _yuitest_coverline("build/test/test.js", 1591);
if (shouldIgnore){
                
                    //update results
                    _yuitest_coverline("build/test/test.js", 1594);
node.parent.results[testName] = { 
                        result: "ignore",
                        message: "Test ignored",
                        type: "test",
                        name: testName.indexOf("ignore:") === 0 ? testName.substring(7) : testName
                    };
                    
                    _yuitest_coverline("build/test/test.js", 1601);
node.parent.results.ignored++;
                    _yuitest_coverline("build/test/test.js", 1602);
node.parent.results.total++;
                
                    _yuitest_coverline("build/test/test.js", 1604);
this.fire({ type: this.TEST_IGNORE_EVENT,  testCase: testCase, testName: testName });
                    
                    //some environments don't support setTimeout
                    _yuitest_coverline("build/test/test.js", 1607);
if (typeof setTimeout != "undefined"){                    
                        _yuitest_coverline("build/test/test.js", 1608);
setTimeout(function(){
                            _yuitest_coverfunc("build/test/test.js", "(anonymous 8)", 1608);
_yuitest_coverline("build/test/test.js", 1609);
YUITest.TestRunner._run();
                        }, 0);              
                    } else {
                        _yuitest_coverline("build/test/test.js", 1612);
this._run();
                    }
    
                } else {
                
                    //mark the start time
                    _yuitest_coverline("build/test/test.js", 1618);
node._start = new Date();
                
                    //run the setup
                    _yuitest_coverline("build/test/test.js", 1621);
this._execNonTestMethod(node.parent, "setUp", false);
                    
                    //now call the body of the test
                    _yuitest_coverline("build/test/test.js", 1624);
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
                _yuitest_coverfunc("build/test/test.js", "getName", 1638);
_yuitest_coverline("build/test/test.js", 1639);
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
                _yuitest_coverfunc("build/test/test.js", "setName", 1649);
_yuitest_coverline("build/test/test.js", 1650);
this.masterSuite.name = name;
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
                _yuitest_coverfunc("build/test/test.js", "add", 1664);
_yuitest_coverline("build/test/test.js", 1665);
this.masterSuite.add(testObject);
                _yuitest_coverline("build/test/test.js", 1666);
return this;
            },
            
            /**
             * Removes all test objects from the runner.
             * @return {Void}
             * @method clear
             * @static
             */
            clear : function () {
                _yuitest_coverfunc("build/test/test.js", "clear", 1675);
_yuitest_coverline("build/test/test.js", 1676);
this.masterSuite = new YUITest.TestSuite(YUITest.guid('testSuite_'));
            },
            
            /**
             * Indicates if the TestRunner is waiting for a test to resume
             * @return {Boolean} True if the TestRunner is waiting, false if not.
             * @method isWaiting
             * @static
             */
            isWaiting: function() {
                _yuitest_coverfunc("build/test/test.js", "isWaiting", 1685);
_yuitest_coverline("build/test/test.js", 1686);
return this._waiting;
            },
            
            /**
             * Indicates that the TestRunner is busy running tests and therefore can't
             * be stopped and results cannot be gathered.
             * @return {Boolean} True if the TestRunner is running, false if not.
             * @method isRunning
             */
            isRunning: function(){
                _yuitest_coverfunc("build/test/test.js", "isRunning", 1695);
_yuitest_coverline("build/test/test.js", 1696);
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
                _yuitest_coverfunc("build/test/test.js", "getResults", 1708);
_yuitest_coverline("build/test/test.js", 1709);
if (!this._running && this._lastResults){
                    _yuitest_coverline("build/test/test.js", 1710);
if (typeof format == "function"){
                        _yuitest_coverline("build/test/test.js", 1711);
return format(this._lastResults);                    
                    } else {
                        _yuitest_coverline("build/test/test.js", 1713);
return this._lastResults;
                    }
                } else {
                    _yuitest_coverline("build/test/test.js", 1716);
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
                _yuitest_coverfunc("build/test/test.js", "getCoverage", 1730);
_yuitest_coverline("build/test/test.js", 1731);
if (!this._running && typeof _yuitest_coverage == "object"){
                    _yuitest_coverline("build/test/test.js", 1732);
if (typeof format == "function"){
                        _yuitest_coverline("build/test/test.js", 1733);
return format(_yuitest_coverage);                    
                    } else {
                        _yuitest_coverline("build/test/test.js", 1735);
return _yuitest_coverage;
                    }
                } else {
                    _yuitest_coverline("build/test/test.js", 1738);
return null;
                }            
            },
            
            /**
             * Used to continue processing when a method marked with
             * "async:" is executed. This should not be used in test
             * methods, only in init(). Each argument is a string, and
             * when the returned function is executed, the arguments
             * are assigned to the context data object using the string
             * as the key name (value is the argument itself).
             * @private
             * @return {Function} A callback function.
             * @method callback
             */
            callback: function(){
                _yuitest_coverfunc("build/test/test.js", "callback", 1753);
_yuitest_coverline("build/test/test.js", 1754);
var names   = arguments,
                    data    = this._context,
                    that    = this;
                    
                _yuitest_coverline("build/test/test.js", 1758);
return function(){
                    _yuitest_coverfunc("build/test/test.js", "(anonymous 9)", 1758);
_yuitest_coverline("build/test/test.js", 1759);
for (var i=0; i < arguments.length; i++){
                        _yuitest_coverline("build/test/test.js", 1760);
data[names[i]] = arguments[i];
                    }
                    _yuitest_coverline("build/test/test.js", 1762);
that._run();
                };
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
                _yuitest_coverfunc("build/test/test.js", "resume", 1774);
_yuitest_coverline("build/test/test.js", 1775);
if (this._waiting){
                    _yuitest_coverline("build/test/test.js", 1776);
this._resumeTest(segment || function(){});
                } else {
                    _yuitest_coverline("build/test/test.js", 1778);
throw new Error("resume() called without wait().");
                }
            },
        
            /**
             * Runs the test suite.
             * @param {Object|Boolean} options (Optional) Options for the runner:
             *      <code>oldMode</code> indicates the TestRunner should work in the YUI <= 2.8 way
             *      of internally managing test suites. <code>groups</code> is an array
             *      of test groups indicating which tests to run.
             * @return {Void}
             * @method run
             * @static
             */
            run : function (options) {

                _yuitest_coverfunc("build/test/test.js", "run", 1792);
_yuitest_coverline("build/test/test.js", 1794);
options = options || {};
                
                //pointer to runner to avoid scope issues 
                _yuitest_coverline("build/test/test.js", 1797);
var runner  = YUITest.TestRunner,
                    oldMode = options.oldMode;
                
                
                //if there's only one suite on the masterSuite, move it up
                _yuitest_coverline("build/test/test.js", 1802);
if (!oldMode && this.masterSuite.items.length == 1 && this.masterSuite.items[0] instanceof YUITest.TestSuite){
                    _yuitest_coverline("build/test/test.js", 1803);
this.masterSuite = this.masterSuite.items[0];
                }                
                
                //determine if there are any groups to filter on
                _yuitest_coverline("build/test/test.js", 1807);
runner._groups = (options.groups instanceof Array) ? "," + options.groups.join(",") + "," : "";
                
                //initialize the runner
                _yuitest_coverline("build/test/test.js", 1810);
runner._buildTestTree();
                _yuitest_coverline("build/test/test.js", 1811);
runner._context = {};
                _yuitest_coverline("build/test/test.js", 1812);
runner._root._start = new Date();
                
                //fire the begin event
                _yuitest_coverline("build/test/test.js", 1815);
runner.fire(runner.BEGIN_EVENT);
           
                //begin the testing
                _yuitest_coverline("build/test/test.js", 1818);
runner._run();
            }    
        });
        
        _yuitest_coverline("build/test/test.js", 1822);
return new TestRunner();
        
    }();

/**
 * The ArrayAssert object provides functions to test JavaScript array objects
 * for a variety of cases.
 * @namespace Test
 * @module test
 * @class ArrayAssert
 * @static
 */
 
_yuitest_coverline("build/test/test.js", 1835);
YUITest.ArrayAssert = {

    //=========================================================================
    // Private methods
    //=========================================================================
    
    /**
     * Simple indexOf() implementation for an array. Defers to native
     * if available.
     * @param {Array} haystack The array to search.
     * @param {Variant} needle The value to locate.
     * @return {int} The index of the needle if found or -1 if not.
     * @method _indexOf
     * @private
     */
    _indexOf: function(haystack, needle){
        _yuitest_coverfunc("build/test/test.js", "_indexOf", 1850);
_yuitest_coverline("build/test/test.js", 1851);
if (haystack.indexOf){
            _yuitest_coverline("build/test/test.js", 1852);
return haystack.indexOf(needle);
        } else {
            _yuitest_coverline("build/test/test.js", 1854);
for (var i=0; i < haystack.length; i++){
                _yuitest_coverline("build/test/test.js", 1855);
if (haystack[i] === needle){
                    _yuitest_coverline("build/test/test.js", 1856);
return i;
                }
            }
            _yuitest_coverline("build/test/test.js", 1859);
return -1;
        }
    },
    
    /**
     * Simple some() implementation for an array. Defers to native
     * if available.
     * @param {Array} haystack The array to search.
     * @param {Function} matcher The function to run on each value.
     * @return {Boolean} True if any value, when run through the matcher,
     *      returns true.
     * @method _some
     * @private
     */
    _some: function(haystack, matcher){
        _yuitest_coverfunc("build/test/test.js", "_some", 1873);
_yuitest_coverline("build/test/test.js", 1874);
if (haystack.some){
            _yuitest_coverline("build/test/test.js", 1875);
return haystack.some(matcher);
        } else {
            _yuitest_coverline("build/test/test.js", 1877);
for (var i=0; i < haystack.length; i++){
                _yuitest_coverline("build/test/test.js", 1878);
if (matcher(haystack[i])){
                    _yuitest_coverline("build/test/test.js", 1879);
return true;
                }
            }
            _yuitest_coverline("build/test/test.js", 1882);
return false;
        }
    },    

    /**
     * Asserts that a value is present in an array. This uses the triple equals 
     * sign so no type coercion may occur.
     * @param {Object} needle The value that is expected in the array.
     * @param {Array} haystack An array of values.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method contains
     * @static
     */
    contains : function (needle, haystack, 
                           message) {
        
        _yuitest_coverfunc("build/test/test.js", "contains", 1895);
_yuitest_coverline("build/test/test.js", 1898);
YUITest.Assert._increment();               

        _yuitest_coverline("build/test/test.js", 1900);
if (this._indexOf(haystack, needle) == -1){
            _yuitest_coverline("build/test/test.js", 1901);
YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value " + needle + " (" + (typeof needle) + ") not found in array [" + haystack + "]."));
        }
    },

    /**
     * Asserts that a set of values are present in an array. This uses the triple equals 
     * sign so no type coercion may occur. For this assertion to pass, all values must
     * be found.
     * @param {Object[]} needles An array of values that are expected in the array.
     * @param {Array} haystack An array of values to check.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method containsItems
     * @static
     */
    containsItems : function (needles, haystack, 
                           message) {
        _yuitest_coverfunc("build/test/test.js", "containsItems", 1915);
_yuitest_coverline("build/test/test.js", 1917);
YUITest.Assert._increment();               

        //begin checking values
        _yuitest_coverline("build/test/test.js", 1920);
for (var i=0; i < needles.length; i++){
            _yuitest_coverline("build/test/test.js", 1921);
if (this._indexOf(haystack, needles[i]) == -1){
                _yuitest_coverline("build/test/test.js", 1922);
YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value " + needles[i] + " (" + (typeof needles[i]) + ") not found in array [" + haystack + "]."));
            }
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
    containsMatch : function (matcher, haystack, 
                           message) {
        
        _yuitest_coverfunc("build/test/test.js", "containsMatch", 1936);
_yuitest_coverline("build/test/test.js", 1939);
YUITest.Assert._increment();               
        //check for valid matcher
        _yuitest_coverline("build/test/test.js", 1941);
if (typeof matcher != "function"){
            _yuitest_coverline("build/test/test.js", 1942);
throw new TypeError("ArrayAssert.containsMatch(): First argument must be a function.");
        }
        
        _yuitest_coverline("build/test/test.js", 1945);
if (!this._some(haystack, matcher)){
            _yuitest_coverline("build/test/test.js", 1946);
YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "No match found in array [" + haystack + "]."));
        }
    },

    /**
     * Asserts that a value is not present in an array. This uses the triple equals 
     * Asserts that a value is not present in an array. This uses the triple equals 
     * sign so no type coercion may occur.
     * @param {Object} needle The value that is expected in the array.
     * @param {Array} haystack An array of values.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method doesNotContain
     * @static
     */
    doesNotContain : function (needle, haystack, 
                           message) {
        
        _yuitest_coverfunc("build/test/test.js", "doesNotContain", 1960);
_yuitest_coverline("build/test/test.js", 1963);
YUITest.Assert._increment();               

        _yuitest_coverline("build/test/test.js", 1965);
if (this._indexOf(haystack, needle) > -1){
            _yuitest_coverline("build/test/test.js", 1966);
YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value found in array [" + haystack + "]."));
        }
    },

    /**
     * Asserts that a set of values are not present in an array. This uses the triple equals 
     * sign so no type coercion may occur. For this assertion to pass, all values must
     * not be found.
     * @param {Object[]} needles An array of values that are not expected in the array.
     * @param {Array} haystack An array of values to check.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method doesNotContainItems
     * @static
     */
    doesNotContainItems : function (needles, haystack, 
                           message) {

        _yuitest_coverfunc("build/test/test.js", "doesNotContainItems", 1980);
_yuitest_coverline("build/test/test.js", 1983);
YUITest.Assert._increment();               

        _yuitest_coverline("build/test/test.js", 1985);
for (var i=0; i < needles.length; i++){
            _yuitest_coverline("build/test/test.js", 1986);
if (this._indexOf(haystack, needles[i]) > -1){
                _yuitest_coverline("build/test/test.js", 1987);
YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value found in array [" + haystack + "]."));
            }
        }

    },
        
    /**
     * Asserts that no values matching a condition are present in an array. This uses
     * a function to determine a match.
     * @param {Function} matcher A function that returns true if the item matches or false if not.
     * @param {Array} haystack An array of values.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method doesNotContainMatch
     * @static
     */
    doesNotContainMatch : function (matcher, haystack, 
                           message) {
        
        _yuitest_coverfunc("build/test/test.js", "doesNotContainMatch", 2002);
_yuitest_coverline("build/test/test.js", 2005);
YUITest.Assert._increment();     
      
        //check for valid matcher
        _yuitest_coverline("build/test/test.js", 2008);
if (typeof matcher != "function"){
            _yuitest_coverline("build/test/test.js", 2009);
throw new TypeError("ArrayAssert.doesNotContainMatch(): First argument must be a function.");
        }
        
        _yuitest_coverline("build/test/test.js", 2012);
if (this._some(haystack, matcher)){
            _yuitest_coverline("build/test/test.js", 2013);
YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value found in array [" + haystack + "]."));
        }
    },
        
    /**
     * Asserts that the given value is contained in an array at the specified index.
     * This uses the triple equals sign so no type coercion will occur.
     * @param {Object} needle The value to look for.
     * @param {Array} haystack The array to search in.
     * @param {int} index The index at which the value should exist.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method indexOf
     * @static
     */
    indexOf : function (needle, haystack, index, message) {
    
        _yuitest_coverfunc("build/test/test.js", "indexOf", 2027);
_yuitest_coverline("build/test/test.js", 2029);
YUITest.Assert._increment();     

        //try to find the value in the array
        _yuitest_coverline("build/test/test.js", 2032);
for (var i=0; i < haystack.length; i++){
            _yuitest_coverline("build/test/test.js", 2033);
if (haystack[i] === needle){
                _yuitest_coverline("build/test/test.js", 2034);
if (index != i){
                    _yuitest_coverline("build/test/test.js", 2035);
YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value exists at index " + i + " but should be at index " + index + "."));                    
                }
                _yuitest_coverline("build/test/test.js", 2037);
return;
            }
        }
        
        //if it makes it here, it wasn't found at all
        _yuitest_coverline("build/test/test.js", 2042);
YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value doesn't exist in array [" + haystack + "]."));
    },
        
    /**
     * Asserts that the values in an array are equal, and in the same position,
     * as values in another array. This uses the double equals sign
     * so type coercion may occur. Note that the array objects themselves
     * need not be the same for this test to pass.
     * @param {Array} expected An array of the expected values.
     * @param {Array} actual Any array of the actual values.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method itemsAreEqual
     * @static
     */
    itemsAreEqual : function (expected, actual, 
                           message) {
        
        _yuitest_coverfunc("build/test/test.js", "itemsAreEqual", 2056);
_yuitest_coverline("build/test/test.js", 2059);
YUITest.Assert._increment();     
        
        //first make sure they're array-like (this can probably be improved)
        _yuitest_coverline("build/test/test.js", 2062);
if (typeof expected != "object" || typeof actual != "object"){
            _yuitest_coverline("build/test/test.js", 2063);
YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value should be an array."));
        }
        
        //next check array length
        _yuitest_coverline("build/test/test.js", 2067);
if (expected.length != actual.length){
            _yuitest_coverline("build/test/test.js", 2068);
YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Array should have a length of " + expected.length + " but has a length of " + actual.length + "."));
        }
       
        //begin checking values
        _yuitest_coverline("build/test/test.js", 2072);
for (var i=0; i < expected.length; i++){
            _yuitest_coverline("build/test/test.js", 2073);
if (expected[i] != actual[i]){
                _yuitest_coverline("build/test/test.js", 2074);
throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Values in position " + i + " are not equal."), expected[i], actual[i]);
            }
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
    itemsAreEquivalent : function (expected, actual, 
                           comparator, message) {
        
        _yuitest_coverfunc("build/test/test.js", "itemsAreEquivalent", 2093);
_yuitest_coverline("build/test/test.js", 2096);
YUITest.Assert._increment();     

        //make sure the comparator is valid
        _yuitest_coverline("build/test/test.js", 2099);
if (typeof comparator != "function"){
            _yuitest_coverline("build/test/test.js", 2100);
throw new TypeError("ArrayAssert.itemsAreEquivalent(): Third argument must be a function.");
        }
        
        //first check array length
        _yuitest_coverline("build/test/test.js", 2104);
if (expected.length != actual.length){
            _yuitest_coverline("build/test/test.js", 2105);
YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Array should have a length of " + expected.length + " but has a length of " + actual.length));
        }
        
        //begin checking values
        _yuitest_coverline("build/test/test.js", 2109);
for (var i=0; i < expected.length; i++){
            _yuitest_coverline("build/test/test.js", 2110);
if (!comparator(expected[i], actual[i])){
                _yuitest_coverline("build/test/test.js", 2111);
throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Values in position " + i + " are not equivalent."), expected[i], actual[i]);
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
    isEmpty : function (actual, message) {        
        _yuitest_coverfunc("build/test/test.js", "isEmpty", 2123);
_yuitest_coverline("build/test/test.js", 2124);
YUITest.Assert._increment();     
        _yuitest_coverline("build/test/test.js", 2125);
if (actual.length > 0){
            _yuitest_coverline("build/test/test.js", 2126);
YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Array should be empty."));
        }
    },    
    
    /**
     * Asserts that an array is not empty.
     * @param {Array} actual The array to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isNotEmpty
     * @static
     */
    isNotEmpty : function (actual, message) {        
        _yuitest_coverfunc("build/test/test.js", "isNotEmpty", 2137);
_yuitest_coverline("build/test/test.js", 2138);
YUITest.Assert._increment();     
        _yuitest_coverline("build/test/test.js", 2139);
if (actual.length === 0){
            _yuitest_coverline("build/test/test.js", 2140);
YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Array should not be empty."));
        }
    },    
    
    /**
     * Asserts that the values in an array are the same, and in the same position,
     * as values in another array. This uses the triple equals sign
     * so no type coercion will occur. Note that the array objects themselves
     * need not be the same for this test to pass.
     * @param {Array} expected An array of the expected values.
     * @param {Array} actual Any array of the actual values.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method itemsAreSame
     * @static
     */
    itemsAreSame : function (expected, actual, 
                          message) {
        
        _yuitest_coverfunc("build/test/test.js", "itemsAreSame", 2155);
_yuitest_coverline("build/test/test.js", 2158);
YUITest.Assert._increment();     

        //first check array length
        _yuitest_coverline("build/test/test.js", 2161);
if (expected.length != actual.length){
            _yuitest_coverline("build/test/test.js", 2162);
YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Array should have a length of " + expected.length + " but has a length of " + actual.length));
        }
                    
        //begin checking values
        _yuitest_coverline("build/test/test.js", 2166);
for (var i=0; i < expected.length; i++){
            _yuitest_coverline("build/test/test.js", 2167);
if (expected[i] !== actual[i]){
                _yuitest_coverline("build/test/test.js", 2168);
throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Values in position " + i + " are not the same."), expected[i], actual[i]);
            }
        }
    },
    
    /**
     * Asserts that the given value is contained in an array at the specified index,
     * starting from the back of the array.
     * This uses the triple equals sign so no type coercion will occur.
     * @param {Object} needle The value to look for.
     * @param {Array} haystack The array to search in.
     * @param {int} index The index at which the value should exist.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method lastIndexOf
     * @static
     */
    lastIndexOf : function (needle, haystack, index, message) {
    
        //try to find the value in the array
        _yuitest_coverfunc("build/test/test.js", "lastIndexOf", 2184);
_yuitest_coverline("build/test/test.js", 2187);
for (var i=haystack.length; i >= 0; i--){
            _yuitest_coverline("build/test/test.js", 2188);
if (haystack[i] === needle){
                _yuitest_coverline("build/test/test.js", 2189);
if (index != i){
                    _yuitest_coverline("build/test/test.js", 2190);
YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value exists at index " + i + " but should be at index " + index + "."));                    
                }
                _yuitest_coverline("build/test/test.js", 2192);
return;
            }
        }
        
        //if it makes it here, it wasn't found at all
        _yuitest_coverline("build/test/test.js", 2197);
YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value doesn't exist in array."));        
    }
    
};
  
/**
 * The Assert object provides functions to test JavaScript values against
 * known and expected results. Whenever a comparison (assertion) fails,
 * an error is thrown.
 * @namespace Test
 * @module test
 * @class Assert
 * @static
 */
_yuitest_coverline("build/test/test.js", 2211);
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
        _yuitest_coverfunc("build/test/test.js", "_formatMessage", 2235);
_yuitest_coverline("build/test/test.js", 2236);
if (typeof customMessage == "string" && customMessage.length > 0){
            _yuitest_coverline("build/test/test.js", 2237);
return customMessage.replace("{message}", defaultMessage);
        } else {
            _yuitest_coverline("build/test/test.js", 2239);
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
        _yuitest_coverfunc("build/test/test.js", "_getCount", 2249);
_yuitest_coverline("build/test/test.js", 2250);
return this._asserts;
    },
    
    /**
     * Increments the number of assertions that have been performed.
     * @method _increment
     * @protected
     * @static
     */
    _increment: function(){
        _yuitest_coverfunc("build/test/test.js", "_increment", 2259);
_yuitest_coverline("build/test/test.js", 2260);
this._asserts++;
    },
    
    /**
     * Resets the number of assertions that have been performed to 0.
     * @method _reset
     * @protected
     * @static
     */
    _reset: function(){
        _yuitest_coverfunc("build/test/test.js", "_reset", 2269);
_yuitest_coverline("build/test/test.js", 2270);
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
        _yuitest_coverfunc("build/test/test.js", "fail", 2283);
_yuitest_coverline("build/test/test.js", 2284);
throw new YUITest.AssertionError(YUITest.Assert._formatMessage(message, "Test force-failed."));
    },       
    
    /** 
     * A marker that the test should pass.
     * @method pass
     * @static
     */
    pass : function (message) {
        _yuitest_coverfunc("build/test/test.js", "pass", 2292);
_yuitest_coverline("build/test/test.js", 2293);
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
        _yuitest_coverfunc("build/test/test.js", "areEqual", 2309);
_yuitest_coverline("build/test/test.js", 2310);
YUITest.Assert._increment();
        _yuitest_coverline("build/test/test.js", 2311);
if (expected != actual) {
            _yuitest_coverline("build/test/test.js", 2312);
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
        _yuitest_coverfunc("build/test/test.js", "areNotEqual", 2325);
_yuitest_coverline("build/test/test.js", 2327);
YUITest.Assert._increment();
        _yuitest_coverline("build/test/test.js", 2328);
if (unexpected == actual) {
            _yuitest_coverline("build/test/test.js", 2329);
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
        _yuitest_coverfunc("build/test/test.js", "areNotSame", 2342);
_yuitest_coverline("build/test/test.js", 2343);
YUITest.Assert._increment();
        _yuitest_coverline("build/test/test.js", 2344);
if (unexpected === actual) {
            _yuitest_coverline("build/test/test.js", 2345);
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
        _yuitest_coverfunc("build/test/test.js", "areSame", 2358);
_yuitest_coverline("build/test/test.js", 2359);
YUITest.Assert._increment();
        _yuitest_coverline("build/test/test.js", 2360);
if (expected !== actual) {
            _yuitest_coverline("build/test/test.js", 2361);
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
        _yuitest_coverfunc("build/test/test.js", "isFalse", 2377);
_yuitest_coverline("build/test/test.js", 2378);
YUITest.Assert._increment();
        _yuitest_coverline("build/test/test.js", 2379);
if (false !== actual) {
            _yuitest_coverline("build/test/test.js", 2380);
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
        _yuitest_coverfunc("build/test/test.js", "isTrue", 2392);
_yuitest_coverline("build/test/test.js", 2393);
YUITest.Assert._increment();
        _yuitest_coverline("build/test/test.js", 2394);
if (true !== actual) {
            _yuitest_coverline("build/test/test.js", 2395);
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
        _yuitest_coverfunc("build/test/test.js", "isNaN", 2411);
_yuitest_coverline("build/test/test.js", 2412);
YUITest.Assert._increment();
        _yuitest_coverline("build/test/test.js", 2413);
if (!isNaN(actual)){
            _yuitest_coverline("build/test/test.js", 2414);
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
        _yuitest_coverfunc("build/test/test.js", "isNotNaN", 2425);
_yuitest_coverline("build/test/test.js", 2426);
YUITest.Assert._increment();
        _yuitest_coverline("build/test/test.js", 2427);
if (isNaN(actual)){
            _yuitest_coverline("build/test/test.js", 2428);
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
        _yuitest_coverfunc("build/test/test.js", "isNotNull", 2440);
_yuitest_coverline("build/test/test.js", 2441);
YUITest.Assert._increment();
        _yuitest_coverline("build/test/test.js", 2442);
if (actual === null) {
            _yuitest_coverline("build/test/test.js", 2443);
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
        _yuitest_coverfunc("build/test/test.js", "isNotUndefined", 2455);
_yuitest_coverline("build/test/test.js", 2456);
YUITest.Assert._increment();
        _yuitest_coverline("build/test/test.js", 2457);
if (typeof actual == "undefined") {
            _yuitest_coverline("build/test/test.js", 2458);
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
        _yuitest_coverfunc("build/test/test.js", "isNull", 2470);
_yuitest_coverline("build/test/test.js", 2471);
YUITest.Assert._increment();
        _yuitest_coverline("build/test/test.js", 2472);
if (actual !== null) {
            _yuitest_coverline("build/test/test.js", 2473);
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
        _yuitest_coverfunc("build/test/test.js", "isUndefined", 2485);
_yuitest_coverline("build/test/test.js", 2486);
YUITest.Assert._increment();
        _yuitest_coverline("build/test/test.js", 2487);
if (typeof actual != "undefined") {
            _yuitest_coverline("build/test/test.js", 2488);
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
        _yuitest_coverfunc("build/test/test.js", "isArray", 2503);
_yuitest_coverline("build/test/test.js", 2504);
YUITest.Assert._increment();
        _yuitest_coverline("build/test/test.js", 2505);
var shouldFail = false;
        _yuitest_coverline("build/test/test.js", 2506);
if (Array.isArray){
            _yuitest_coverline("build/test/test.js", 2507);
shouldFail = !Array.isArray(actual);
        } else {
            _yuitest_coverline("build/test/test.js", 2509);
shouldFail = Object.prototype.toString.call(actual) != "[object Array]";
        }
        _yuitest_coverline("build/test/test.js", 2511);
if (shouldFail){
            _yuitest_coverline("build/test/test.js", 2512);
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
        _yuitest_coverfunc("build/test/test.js", "isBoolean", 2523);
_yuitest_coverline("build/test/test.js", 2524);
YUITest.Assert._increment();
        _yuitest_coverline("build/test/test.js", 2525);
if (typeof actual != "boolean"){
            _yuitest_coverline("build/test/test.js", 2526);
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
        _yuitest_coverfunc("build/test/test.js", "isFunction", 2537);
_yuitest_coverline("build/test/test.js", 2538);
YUITest.Assert._increment();
        _yuitest_coverline("build/test/test.js", 2539);
if (!(actual instanceof Function)){
            _yuitest_coverline("build/test/test.js", 2540);
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
        _yuitest_coverfunc("build/test/test.js", "isInstanceOf", 2554);
_yuitest_coverline("build/test/test.js", 2555);
YUITest.Assert._increment();
        _yuitest_coverline("build/test/test.js", 2556);
if (!(actual instanceof expected)){
            _yuitest_coverline("build/test/test.js", 2557);
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
        _yuitest_coverfunc("build/test/test.js", "isNumber", 2568);
_yuitest_coverline("build/test/test.js", 2569);
YUITest.Assert._increment();
        _yuitest_coverline("build/test/test.js", 2570);
if (typeof actual != "number"){
            _yuitest_coverline("build/test/test.js", 2571);
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
        _yuitest_coverfunc("build/test/test.js", "isObject", 2582);
_yuitest_coverline("build/test/test.js", 2583);
YUITest.Assert._increment();
        _yuitest_coverline("build/test/test.js", 2584);
if (!actual || (typeof actual != "object" && typeof actual != "function")){
            _yuitest_coverline("build/test/test.js", 2585);
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
        _yuitest_coverfunc("build/test/test.js", "isString", 2596);
_yuitest_coverline("build/test/test.js", 2597);
YUITest.Assert._increment();
        _yuitest_coverline("build/test/test.js", 2598);
if (typeof actual != "string"){
            _yuitest_coverline("build/test/test.js", 2599);
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
        _yuitest_coverfunc("build/test/test.js", "isTypeOf", 2611);
_yuitest_coverline("build/test/test.js", 2612);
YUITest.Assert._increment();
        _yuitest_coverline("build/test/test.js", 2613);
if (typeof actualValue != expectedType){
            _yuitest_coverline("build/test/test.js", 2614);
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
     * @return {void}
     * @static
     */
    throwsError: function(expectedError, method, message){
        _yuitest_coverfunc("build/test/test.js", "throwsError", 2637);
_yuitest_coverline("build/test/test.js", 2638);
YUITest.Assert._increment();
        _yuitest_coverline("build/test/test.js", 2639);
var error = false;
    
        _yuitest_coverline("build/test/test.js", 2641);
try {
            _yuitest_coverline("build/test/test.js", 2642);
method();        
        } catch (thrown) {
            
            //check to see what type of data we have
            _yuitest_coverline("build/test/test.js", 2646);
if (typeof expectedError == "string"){
                
                //if it's a string, check the error message
                _yuitest_coverline("build/test/test.js", 2649);
if (thrown.message != expectedError){
                    _yuitest_coverline("build/test/test.js", 2650);
error = true;
                }
            } else {_yuitest_coverline("build/test/test.js", 2652);
if (typeof expectedError == "function"){
            
                //if it's a function, see if the error is an instance of it
                _yuitest_coverline("build/test/test.js", 2655);
if (!(thrown instanceof expectedError)){
                    _yuitest_coverline("build/test/test.js", 2656);
error = true;
                }
            
            } else {_yuitest_coverline("build/test/test.js", 2659);
if (typeof expectedError == "object" && expectedError !== null){
            
                //if it's an object, check the instance and message
                _yuitest_coverline("build/test/test.js", 2662);
if (!(thrown instanceof expectedError.constructor) || 
                        thrown.message != expectedError.message){
                    _yuitest_coverline("build/test/test.js", 2664);
error = true;
                }
            
            } else { //if it gets here, the argument could be wrong
                _yuitest_coverline("build/test/test.js", 2668);
error = true;
            }}}
            
            _yuitest_coverline("build/test/test.js", 2671);
if (error){
                _yuitest_coverline("build/test/test.js", 2672);
throw new YUITest.UnexpectedError(thrown);                    
            } else {
                _yuitest_coverline("build/test/test.js", 2674);
return;
            }
        }
        
        //if it reaches here, the error wasn't thrown, which is a bad thing
        _yuitest_coverline("build/test/test.js", 2679);
throw new YUITest.AssertionError(YUITest.Assert._formatMessage(message, "Error should have been thrown."));
    }

};
/**
 * Error is thrown whenever an assertion fails. It provides methods
 * to more easily get at error information and also provides a base class
 * from which more specific assertion errors can be derived.
 *
 * @param {String} message The message to display when the error occurs.
 * @namespace Test
 * @module test
 * @class AssertionError
 * @constructor
 */ 
_yuitest_coverline("build/test/test.js", 2694);
YUITest.AssertionError = function (message){
    
    /**
     * Error message. Must be duplicated to ensure browser receives it.
     * @type String
     * @property message
     */
    _yuitest_coverfunc("build/test/test.js", "AssertionError", 2694);
_yuitest_coverline("build/test/test.js", 2701);
this.message = message;
    
    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    _yuitest_coverline("build/test/test.js", 2708);
this.name = "Assert Error";
};

_yuitest_coverline("build/test/test.js", 2711);
YUITest.AssertionError.prototype = {

    //restore constructor
    constructor: YUITest.AssertionError,

    /**
     * Returns a fully formatted error for an assertion failure. This should
     * be overridden by all subclasses to provide specific information.
     * @method getMessage
     * @return {String} A string describing the error.
     */
    getMessage : function () {
        _yuitest_coverfunc("build/test/test.js", "getMessage", 2722);
_yuitest_coverline("build/test/test.js", 2723);
return this.message;
    },
    
    /**
     * Returns a string representation of the error.
     * @method toString
     * @return {String} A string representation of the error.
     */
    toString : function () {
        _yuitest_coverfunc("build/test/test.js", "toString", 2731);
_yuitest_coverline("build/test/test.js", 2732);
return this.name + ": " + this.getMessage();
    }

};/**
 * ComparisonFailure is subclass of Error that is thrown whenever
 * a comparison between two values fails. It provides mechanisms to retrieve
 * both the expected and actual value.
 *
 * @param {String} message The message to display when the error occurs.
 * @param {Object} expected The expected value.
 * @param {Object} actual The actual value that caused the assertion to fail.
 * @namespace Test 
 * @extends AssertionError
 * @module test
 * @class ComparisonFailure
 * @constructor
 */ 
_yuitest_coverline("build/test/test.js", 2749);
YUITest.ComparisonFailure = function (message, expected, actual){

    //call superclass
    _yuitest_coverfunc("build/test/test.js", "ComparisonFailure", 2749);
_yuitest_coverline("build/test/test.js", 2752);
YUITest.AssertionError.call(this, message);
    
    /**
     * The expected value.
     * @type Object
     * @property expected
     */
    _yuitest_coverline("build/test/test.js", 2759);
this.expected = expected;
    
    /**
     * The actual value.
     * @type Object
     * @property actual
     */
    _yuitest_coverline("build/test/test.js", 2766);
this.actual = actual;
    
    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    _yuitest_coverline("build/test/test.js", 2773);
this.name = "ComparisonFailure";
    
};

//inherit from YUITest.AssertionError
_yuitest_coverline("build/test/test.js", 2778);
YUITest.ComparisonFailure.prototype = new YUITest.AssertionError;

//restore constructor
_yuitest_coverline("build/test/test.js", 2781);
YUITest.ComparisonFailure.prototype.constructor = YUITest.ComparisonFailure;

/**
 * Returns a fully formatted error for an assertion failure. This message
 * provides information about the expected and actual values.
 * @method getMessage
 * @return {String} A string describing the error.
 */
_yuitest_coverline("build/test/test.js", 2789);
YUITest.ComparisonFailure.prototype.getMessage = function(){
    _yuitest_coverfunc("build/test/test.js", "getMessage", 2789);
_yuitest_coverline("build/test/test.js", 2790);
return this.message + "\nExpected: " + this.expected + " (" + (typeof this.expected) + ")"  +
            "\nActual: " + this.actual + " (" + (typeof this.actual) + ")";
};
/**
 * An object object containing coverage result formatting methods.
 * @namespace Test
 * @module test
 * @class CoverageFormat
 * @static
 */
_yuitest_coverline("build/test/test.js", 2800);
YUITest.CoverageFormat = {

    /**
     * Returns the coverage report in JSON format. This is the straight
     * JSON representation of the native coverage report.
     * @param {Object} coverage The coverage report object.
     * @return {String} A JSON-formatted string of coverage data.
     * @method JSON
     * @namespace Test.CoverageFormat
     */
    JSON: function(coverage){
        _yuitest_coverfunc("build/test/test.js", "JSON", 2810);
_yuitest_coverline("build/test/test.js", 2811);
return YUITest.Util.JSON.stringify(coverage);
    },
    
    /**
     * Returns the coverage report in a JSON format compatible with
     * Xdebug. See <a href="http://www.xdebug.com/docs/code_coverage">Xdebug Documentation</a>
     * for more information. Note: function coverage is not available
     * in this format.
     * @param {Object} coverage The coverage report object.
     * @return {String} A JSON-formatted string of coverage data.
     * @method XdebugJSON
     * @namespace Test.CoverageFormat
     */    
    XdebugJSON: function(coverage){
    
        _yuitest_coverfunc("build/test/test.js", "XdebugJSON", 2824);
_yuitest_coverline("build/test/test.js", 2826);
var report = {};
        _yuitest_coverline("build/test/test.js", 2827);
for (var prop in coverage){
            _yuitest_coverline("build/test/test.js", 2828);
if (coverage.hasOwnProperty(prop)){
                _yuitest_coverline("build/test/test.js", 2829);
report[prop] = coverage[prop].lines;
            }
        }

        _yuitest_coverline("build/test/test.js", 2833);
return YUITest.Util.JSON.stringify(coverage);
    }

};

/**
 * The DateAssert object provides functions to test JavaScript Date objects
 * for a variety of cases.
 * @namespace Test
 * @module test
 * @class DateAssert
 * @static
 */
 
_yuitest_coverline("build/test/test.js", 2847);
YUITest.DateAssert = {

    /**
     * Asserts that a date's month, day, and year are equal to another date's.
     * @param {Date} expected The expected date.
     * @param {Date} actual The actual date to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method datesAreEqual
     * @static
     */
    datesAreEqual : function (expected, actual, message){
        _yuitest_coverfunc("build/test/test.js", "datesAreEqual", 2857);
_yuitest_coverline("build/test/test.js", 2858);
YUITest.Assert._increment();        
        _yuitest_coverline("build/test/test.js", 2859);
if (expected instanceof Date && actual instanceof Date){
            _yuitest_coverline("build/test/test.js", 2860);
var msg = "";
            
            //check years first
            _yuitest_coverline("build/test/test.js", 2863);
if (expected.getFullYear() != actual.getFullYear()){
                _yuitest_coverline("build/test/test.js", 2864);
msg = "Years should be equal.";
            }
            
            //now check months
            _yuitest_coverline("build/test/test.js", 2868);
if (expected.getMonth() != actual.getMonth()){
                _yuitest_coverline("build/test/test.js", 2869);
msg = "Months should be equal.";
            }                
            
            //last, check the day of the month
            _yuitest_coverline("build/test/test.js", 2873);
if (expected.getDate() != actual.getDate()){
                _yuitest_coverline("build/test/test.js", 2874);
msg = "Days of month should be equal.";
            }                
            
            _yuitest_coverline("build/test/test.js", 2877);
if (msg.length){
                _yuitest_coverline("build/test/test.js", 2878);
throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, msg), expected, actual);
            }
        } else {
            _yuitest_coverline("build/test/test.js", 2881);
throw new TypeError("YUITest.DateAssert.datesAreEqual(): Expected and actual values must be Date objects.");
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
    timesAreEqual : function (expected, actual, message){
        _yuitest_coverfunc("build/test/test.js", "timesAreEqual", 2893);
_yuitest_coverline("build/test/test.js", 2894);
YUITest.Assert._increment();
        _yuitest_coverline("build/test/test.js", 2895);
if (expected instanceof Date && actual instanceof Date){
            _yuitest_coverline("build/test/test.js", 2896);
var msg = "";
            
            //check hours first
            _yuitest_coverline("build/test/test.js", 2899);
if (expected.getHours() != actual.getHours()){
                _yuitest_coverline("build/test/test.js", 2900);
msg = "Hours should be equal.";
            }
            
            //now check minutes
            _yuitest_coverline("build/test/test.js", 2904);
if (expected.getMinutes() != actual.getMinutes()){
                _yuitest_coverline("build/test/test.js", 2905);
msg = "Minutes should be equal.";
            }                
            
            //last, check the seconds
            _yuitest_coverline("build/test/test.js", 2909);
if (expected.getSeconds() != actual.getSeconds()){
                _yuitest_coverline("build/test/test.js", 2910);
msg = "Seconds should be equal.";
            }                
            
            _yuitest_coverline("build/test/test.js", 2913);
if (msg.length){
                _yuitest_coverline("build/test/test.js", 2914);
throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, msg), expected, actual);
            }
        } else {
            _yuitest_coverline("build/test/test.js", 2917);
throw new TypeError("YUITest.DateAssert.timesAreEqual(): Expected and actual values must be Date objects.");
        }
    }
    
};/**
 * Creates a new mock object.
 * @namespace Test
 * @module test
 * @class Mock
 * @constructor
 * @param {Object} template (Optional) An object whose methods
 *      should be stubbed out on the mock object.
 */
_yuitest_coverline("build/test/test.js", 2930);
YUITest.Mock = function(template){

    //use blank object is nothing is passed in
    _yuitest_coverfunc("build/test/test.js", "Mock", 2930);
_yuitest_coverline("build/test/test.js", 2933);
template = template || {};
    
    _yuitest_coverline("build/test/test.js", 2935);
var mock,
        name;
    
    //try to create mock that keeps prototype chain intact
    //fails in the case of ActiveX objects
    _yuitest_coverline("build/test/test.js", 2940);
try {
        _yuitest_coverline("build/test/test.js", 2941);
function f(){}
        _yuitest_coverline("build/test/test.js", 2942);
f.prototype = template;
        _yuitest_coverline("build/test/test.js", 2943);
mock = new f();
    } catch (ex) {
        _yuitest_coverline("build/test/test.js", 2945);
mock = {};
    }

    //create stubs for all methods
    _yuitest_coverline("build/test/test.js", 2949);
for (name in template){
        _yuitest_coverline("build/test/test.js", 2950);
if (template.hasOwnProperty(name)){
            _yuitest_coverline("build/test/test.js", 2951);
if (typeof template[name] == "function"){
                _yuitest_coverline("build/test/test.js", 2952);
mock[name] = function(name){
                    _yuitest_coverfunc("build/test/test.js", "]", 2952);
_yuitest_coverline("build/test/test.js", 2953);
return function(){
                        _yuitest_coverfunc("build/test/test.js", "(anonymous 11)", 2953);
_yuitest_coverline("build/test/test.js", 2954);
YUITest.Assert.fail("Method " + name + "() was called but was not expected to be.");
                    };
                }(name);
            }
        }
    }

    //return it
    _yuitest_coverline("build/test/test.js", 2962);
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
 * @return {void}
 * @method expect
 * @static
 */ 
_yuitest_coverline("build/test/test.js", 2985);
YUITest.Mock.expect = function(mock /*:Object*/, expectation /*:Object*/){

    //make sure there's a place to store the expectations
    _yuitest_coverfunc("build/test/test.js", "expect", 2985);
_yuitest_coverline("build/test/test.js", 2988);
if (!mock.__expectations) {
        _yuitest_coverline("build/test/test.js", 2989);
mock.__expectations = {};
    }

    //method expectation
    _yuitest_coverline("build/test/test.js", 2993);
if (expectation.method){
        _yuitest_coverline("build/test/test.js", 2994);
var name = expectation.method,
            args = expectation.args || [],
            result = expectation.returns,
            callCount = (typeof expectation.callCount == "number") ? expectation.callCount : 1,
            error = expectation.error,
            run = expectation.run || function(){},
            runResult,
            i;

        //save expectations
        _yuitest_coverline("build/test/test.js", 3004);
mock.__expectations[name] = expectation;
        _yuitest_coverline("build/test/test.js", 3005);
expectation.callCount = callCount;
        _yuitest_coverline("build/test/test.js", 3006);
expectation.actualCallCount = 0;
            
        //process arguments
        _yuitest_coverline("build/test/test.js", 3009);
for (i=0; i < args.length; i++){
             _yuitest_coverline("build/test/test.js", 3010);
if (!(args[i] instanceof YUITest.Mock.Value)){
                _yuitest_coverline("build/test/test.js", 3011);
args[i] = YUITest.Mock.Value(YUITest.Assert.areSame, [args[i]], "Argument " + i + " of " + name + "() is incorrect.");
            }       
        }
    
        //if the method is expected to be called
        _yuitest_coverline("build/test/test.js", 3016);
if (callCount > 0){
            _yuitest_coverline("build/test/test.js", 3017);
mock[name] = function(){   
                _yuitest_coverfunc("build/test/test.js", "]", 3017);
_yuitest_coverline("build/test/test.js", 3018);
try {
                    _yuitest_coverline("build/test/test.js", 3019);
expectation.actualCallCount++;
                    _yuitest_coverline("build/test/test.js", 3020);
YUITest.Assert.areEqual(args.length, arguments.length, "Method " + name + "() passed incorrect number of arguments.");
                    _yuitest_coverline("build/test/test.js", 3021);
for (var i=0, len=args.length; i < len; i++){
                        _yuitest_coverline("build/test/test.js", 3022);
args[i].verify(arguments[i]);
                    }                

                    _yuitest_coverline("build/test/test.js", 3025);
runResult = run.apply(this, arguments);
                    
                    _yuitest_coverline("build/test/test.js", 3027);
if (error){
                        _yuitest_coverline("build/test/test.js", 3028);
throw error;
                    }
                } catch (ex){
                    //route through TestRunner for proper handling
                    _yuitest_coverline("build/test/test.js", 3032);
YUITest.TestRunner._handleError(ex);
                }

                // Any value provided for 'returns' overrides any value returned
                // by our 'run' function. 
                _yuitest_coverline("build/test/test.js", 3037);
return expectation.hasOwnProperty('returns') ? result : runResult;
            };
        } else {
        
            //method should fail if called when not expected
            _yuitest_coverline("build/test/test.js", 3042);
mock[name] = function(){
                _yuitest_coverfunc("build/test/test.js", "]", 3042);
_yuitest_coverline("build/test/test.js", 3043);
try {
                    _yuitest_coverline("build/test/test.js", 3044);
YUITest.Assert.fail("Method " + name + "() should not have been called.");
                } catch (ex){
                    //route through TestRunner for proper handling
                    _yuitest_coverline("build/test/test.js", 3047);
YUITest.TestRunner._handleError(ex);
                }                    
            };
        }
    } else {_yuitest_coverline("build/test/test.js", 3051);
if (expectation.property){
        //save expectations
        _yuitest_coverline("build/test/test.js", 3053);
mock.__expectations[expectation.property] = expectation;
    }}
};

/**
 * Verifies that all expectations of a mock object have been met and
 * throws an assertion error if not.
 * @param {Object} mock The object to verify..
 * @return {void}
 * @method verify
 * @static
 */ 
_yuitest_coverline("build/test/test.js", 3065);
YUITest.Mock.verify = function(mock){    
    _yuitest_coverfunc("build/test/test.js", "verify", 3065);
_yuitest_coverline("build/test/test.js", 3066);
try {
    
        _yuitest_coverline("build/test/test.js", 3068);
for (var name in mock.__expectations){
            _yuitest_coverline("build/test/test.js", 3069);
if (mock.__expectations.hasOwnProperty(name)){
                _yuitest_coverline("build/test/test.js", 3070);
var expectation = mock.__expectations[name];
                _yuitest_coverline("build/test/test.js", 3071);
if (expectation.method) {
                    _yuitest_coverline("build/test/test.js", 3072);
YUITest.Assert.areEqual(expectation.callCount, expectation.actualCallCount, "Method " + expectation.method + "() wasn't called the expected number of times.");
                } else {_yuitest_coverline("build/test/test.js", 3073);
if (expectation.property){
                    _yuitest_coverline("build/test/test.js", 3074);
YUITest.Assert.areEqual(expectation.value, mock[expectation.property], "Property " + expectation.property + " wasn't set to the correct value."); 
                }}                
            }
        }

    } catch (ex){
        //route through TestRunner for proper handling
        _yuitest_coverline("build/test/test.js", 3081);
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
_yuitest_coverline("build/test/test.js", 3095);
YUITest.Mock.Value = function(method, originalArgs, message){
    _yuitest_coverfunc("build/test/test.js", "Value", 3095);
_yuitest_coverline("build/test/test.js", 3096);
if (this instanceof YUITest.Mock.Value){
        _yuitest_coverline("build/test/test.js", 3097);
this.verify = function(value){
            _yuitest_coverfunc("build/test/test.js", "verify", 3097);
_yuitest_coverline("build/test/test.js", 3098);
var args = [].concat(originalArgs || []);
            _yuitest_coverline("build/test/test.js", 3099);
args.push(value);
            _yuitest_coverline("build/test/test.js", 3100);
args.push(message);
            _yuitest_coverline("build/test/test.js", 3101);
method.apply(null, args);
        };
    } else {
        _yuitest_coverline("build/test/test.js", 3104);
return new YUITest.Mock.Value(method, originalArgs, message);
    }
};

/**
 * Predefined matcher to match any value.
 * @property Any
 * @static
 * @type Function
 */
_yuitest_coverline("build/test/test.js", 3114);
YUITest.Mock.Value.Any        = YUITest.Mock.Value(function(){});

/**
 * Predefined matcher to match boolean values.
 * @property Boolean
 * @static
 * @type Function
 */
_yuitest_coverline("build/test/test.js", 3122);
YUITest.Mock.Value.Boolean    = YUITest.Mock.Value(YUITest.Assert.isBoolean);

/**
 * Predefined matcher to match number values.
 * @property Number
 * @static
 * @type Function
 */
_yuitest_coverline("build/test/test.js", 3130);
YUITest.Mock.Value.Number     = YUITest.Mock.Value(YUITest.Assert.isNumber);

/**
 * Predefined matcher to match string values.
 * @property String
 * @static
 * @type Function
 */
_yuitest_coverline("build/test/test.js", 3138);
YUITest.Mock.Value.String     = YUITest.Mock.Value(YUITest.Assert.isString);

/**
 * Predefined matcher to match object values.
 * @property Object
 * @static
 * @type Function
 */
_yuitest_coverline("build/test/test.js", 3146);
YUITest.Mock.Value.Object     = YUITest.Mock.Value(YUITest.Assert.isObject);

/**
 * Predefined matcher to match function values.
 * @property Function
 * @static
 * @type Function
 */
_yuitest_coverline("build/test/test.js", 3154);
YUITest.Mock.Value.Function   = YUITest.Mock.Value(YUITest.Assert.isFunction);

/**
 * The ObjectAssert object provides functions to test JavaScript objects
 * for a variety of cases.
 * @namespace Test
 * @module test
 * @class ObjectAssert
 * @static
 */
_yuitest_coverline("build/test/test.js", 3164);
YUITest.ObjectAssert = {

    /**
     * Asserts that an object has all of the same properties
     * and property values as the other.
     * @param {Object} expected The object with all expected properties and values.
     * @param {Object} actual The object to inspect.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method areEqual
     * @static
     * @deprecated
     */
    areEqual: function(expected, actual, message) {
        _yuitest_coverfunc("build/test/test.js", "areEqual", 3176);
_yuitest_coverline("build/test/test.js", 3177);
YUITest.Assert._increment();         
        
        _yuitest_coverline("build/test/test.js", 3179);
var expectedKeys = YUITest.Object.keys(expected),
            actualKeys = YUITest.Object.keys(actual);
        
        //first check keys array length
        _yuitest_coverline("build/test/test.js", 3183);
if (expectedKeys.length != actualKeys.length){
            _yuitest_coverline("build/test/test.js", 3184);
YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Object should have " + expectedKeys.length + " keys but has " + actualKeys.length));
        }
        
        //then check values
        _yuitest_coverline("build/test/test.js", 3188);
for (var name in expected){
            _yuitest_coverline("build/test/test.js", 3189);
if (expected.hasOwnProperty(name)){
                _yuitest_coverline("build/test/test.js", 3190);
if (expected[name] != actual[name]){
                    _yuitest_coverline("build/test/test.js", 3191);
throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Values should be equal for property " + name), expected[name], actual[name]);
                }            
            }
        }           
    },
    
    /**
     * Asserts that an object has a property with the given name.
     * @param {String} propertyName The name of the property to test.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method hasKey
     * @static
     * @deprecated Use ownsOrInheritsKey() instead
     */    
    hasKey: function (propertyName, object, message) {
        _yuitest_coverfunc("build/test/test.js", "hasKey", 3206);
_yuitest_coverline("build/test/test.js", 3207);
YUITest.ObjectAssert.ownsOrInheritsKey(propertyName, object, message);   
    },
    
    /**
     * Asserts that an object has all properties of a reference object.
     * @param {Array} properties An array of property names that should be on the object.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method hasKeys
     * @static
     * @deprecated Use ownsOrInheritsKeys() instead
     */    
    hasKeys: function (properties, object, message) {
        _yuitest_coverfunc("build/test/test.js", "hasKeys", 3219);
_yuitest_coverline("build/test/test.js", 3220);
YUITest.ObjectAssert.ownsOrInheritsKeys(properties, object, message);
    },
    
    /**
     * Asserts that a property with the given name exists on an object's prototype.
     * @param {String} propertyName The name of the property to test.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method inheritsKey
     * @static
     */    
    inheritsKey: function (propertyName, object, message) {
        _yuitest_coverfunc("build/test/test.js", "inheritsKey", 3231);
_yuitest_coverline("build/test/test.js", 3232);
YUITest.Assert._increment();               
        _yuitest_coverline("build/test/test.js", 3233);
if (!(propertyName in object && !object.hasOwnProperty(propertyName))){
            _yuitest_coverline("build/test/test.js", 3234);
YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Property '" + propertyName + "' not found on object instance."));
        }     
    },
    
    /**
     * Asserts that all properties exist on an object prototype.
     * @param {Array} properties An array of property names that should be on the object.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method inheritsKeys
     * @static
     */    
    inheritsKeys: function (properties, object, message) {
        _yuitest_coverfunc("build/test/test.js", "inheritsKeys", 3246);
_yuitest_coverline("build/test/test.js", 3247);
YUITest.Assert._increment();        
        _yuitest_coverline("build/test/test.js", 3248);
for (var i=0; i < properties.length; i++){
            _yuitest_coverline("build/test/test.js", 3249);
if (!(propertyName in object && !object.hasOwnProperty(properties[i]))){
                _yuitest_coverline("build/test/test.js", 3250);
YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Property '" + properties[i] + "' not found on object instance."));
            }      
        }
    },
    
    /**
     * Asserts that a property with the given name exists on an object instance (not on its prototype).
     * @param {String} propertyName The name of the property to test.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method ownsKey
     * @static
     */    
    ownsKey: function (propertyName, object, message) {
        _yuitest_coverfunc("build/test/test.js", "ownsKey", 3263);
_yuitest_coverline("build/test/test.js", 3264);
YUITest.Assert._increment();               
        _yuitest_coverline("build/test/test.js", 3265);
if (!object.hasOwnProperty(propertyName)){
            _yuitest_coverline("build/test/test.js", 3266);
YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Property '" + propertyName + "' not found on object instance."));
        }     
    },
    
    /**
     * Asserts that all properties exist on an object instance (not on its prototype).
     * @param {Array} properties An array of property names that should be on the object.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method ownsKeys
     * @static
     */    
    ownsKeys: function (properties, object, message) {
        _yuitest_coverfunc("build/test/test.js", "ownsKeys", 3278);
_yuitest_coverline("build/test/test.js", 3279);
YUITest.Assert._increment();        
        _yuitest_coverline("build/test/test.js", 3280);
for (var i=0; i < properties.length; i++){
            _yuitest_coverline("build/test/test.js", 3281);
if (!object.hasOwnProperty(properties[i])){
                _yuitest_coverline("build/test/test.js", 3282);
YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Property '" + properties[i] + "' not found on object instance."));
            }      
        }
    },
    
    /**
     * Asserts that an object owns no properties.
     * @param {Object} object The object to check.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method ownsNoKeys
     * @static
     */    
    ownsNoKeys : function (object, message) {
        _yuitest_coverfunc("build/test/test.js", "ownsNoKeys", 3294);
_yuitest_coverline("build/test/test.js", 3295);
YUITest.Assert._increment();  
        _yuitest_coverline("build/test/test.js", 3296);
var count = 0,
            name;
        _yuitest_coverline("build/test/test.js", 3298);
for (name in object){
            _yuitest_coverline("build/test/test.js", 3299);
if (object.hasOwnProperty(name)){
                _yuitest_coverline("build/test/test.js", 3300);
count++;
            }
        }
        
        _yuitest_coverline("build/test/test.js", 3304);
if (count !== 0){
            _yuitest_coverline("build/test/test.js", 3305);
YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Object owns " + count + " properties but should own none."));        
        }

    },

    /**
     * Asserts that an object has a property with the given name.
     * @param {String} propertyName The name of the property to test.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method ownsOrInheritsKey
     * @static
     */    
    ownsOrInheritsKey: function (propertyName, object, message) {
        _yuitest_coverfunc("build/test/test.js", "ownsOrInheritsKey", 3318);
_yuitest_coverline("build/test/test.js", 3319);
YUITest.Assert._increment();               
        _yuitest_coverline("build/test/test.js", 3320);
if (!(propertyName in object)){
            _yuitest_coverline("build/test/test.js", 3321);
YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Property '" + propertyName + "' not found on object."));
        }    
    },
    
    /**
     * Asserts that an object has all properties of a reference object.
     * @param {Array} properties An array of property names that should be on the object.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method ownsOrInheritsKeys
     * @static
     */    
    ownsOrInheritsKeys: function (properties, object, message) {
        _yuitest_coverfunc("build/test/test.js", "ownsOrInheritsKeys", 3333);
_yuitest_coverline("build/test/test.js", 3334);
YUITest.Assert._increment();  
        _yuitest_coverline("build/test/test.js", 3335);
for (var i=0; i < properties.length; i++){
            _yuitest_coverline("build/test/test.js", 3336);
if (!(properties[i] in object)){
                _yuitest_coverline("build/test/test.js", 3337);
YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Property '" + properties[i] + "' not found on object."));
            }      
        }
    }    
};
/**
 * Convenience type for storing and aggregating
 * test result information.
 * @private
 * @namespace Test
 * @module test
 * @class Results
 * @constructor
 * @param {String} name The name of the test.
 */
_yuitest_coverline("build/test/test.js", 3352);
YUITest.Results = function(name){

    /**
     * Name of the test, test case, or test suite.
     * @type String
     * @property name
     */
    _yuitest_coverfunc("build/test/test.js", "Results", 3352);
_yuitest_coverline("build/test/test.js", 3359);
this.name = name;
    
    /**
     * Number of passed tests.
     * @type int
     * @property passed
     */
    _yuitest_coverline("build/test/test.js", 3366);
this.passed = 0;
    
    /**
     * Number of failed tests.
     * @type int
     * @property failed
     */
    _yuitest_coverline("build/test/test.js", 3373);
this.failed = 0;
    
    /**
     * Number of errors that occur in non-test methods.
     * @type int
     * @property errors
     */
    _yuitest_coverline("build/test/test.js", 3380);
this.errors = 0;
    
    /**
     * Number of ignored tests.
     * @type int
     * @property ignored
     */
    _yuitest_coverline("build/test/test.js", 3387);
this.ignored = 0;
    
    /**
     * Number of total tests.
     * @type int
     * @property total
     */
    _yuitest_coverline("build/test/test.js", 3394);
this.total = 0;
    
    /**
     * Amount of time (ms) it took to complete testing.
     * @type int
     * @property duration
     */
    _yuitest_coverline("build/test/test.js", 3401);
this.duration = 0;
};

/**
 * Includes results from another results object into this one.
 * @param {Test.Results} result The results object to include.
 * @method include
 * @return {void}
 */
_yuitest_coverline("build/test/test.js", 3410);
YUITest.Results.prototype.include = function(results){
    _yuitest_coverfunc("build/test/test.js", "include", 3410);
_yuitest_coverline("build/test/test.js", 3411);
this.passed += results.passed;
    _yuitest_coverline("build/test/test.js", 3412);
this.failed += results.failed;
    _yuitest_coverline("build/test/test.js", 3413);
this.ignored += results.ignored;
    _yuitest_coverline("build/test/test.js", 3414);
this.total += results.total;
    _yuitest_coverline("build/test/test.js", 3415);
this.errors += results.errors;
};
/**
 * ShouldError is subclass of Error that is thrown whenever
 * a test is expected to throw an error but doesn't.
 *
 * @param {String} message The message to display when the error occurs.
 * @namespace Test 
 * @extends AssertionError
 * @module test
 * @class ShouldError
 * @constructor
 */ 
_yuitest_coverline("build/test/test.js", 3428);
YUITest.ShouldError = function (message){

    //call superclass
    _yuitest_coverfunc("build/test/test.js", "ShouldError", 3428);
_yuitest_coverline("build/test/test.js", 3431);
YUITest.AssertionError.call(this, message || "This test should have thrown an error but didn't.");
    
    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    _yuitest_coverline("build/test/test.js", 3438);
this.name = "ShouldError";
    
};

//inherit from YUITest.AssertionError
_yuitest_coverline("build/test/test.js", 3443);
YUITest.ShouldError.prototype = new YUITest.AssertionError();

//restore constructor
_yuitest_coverline("build/test/test.js", 3446);
YUITest.ShouldError.prototype.constructor = YUITest.ShouldError;
/**
 * ShouldFail is subclass of AssertionError that is thrown whenever
 * a test was expected to fail but did not.
 *
 * @param {String} message The message to display when the error occurs.
 * @namespace Test 
 * @extends YUITest.AssertionError
 * @module test
 * @class ShouldFail
 * @constructor
 */ 
_yuitest_coverline("build/test/test.js", 3458);
YUITest.ShouldFail = function (message){

    //call superclass
    _yuitest_coverfunc("build/test/test.js", "ShouldFail", 3458);
_yuitest_coverline("build/test/test.js", 3461);
YUITest.AssertionError.call(this, message || "This test should fail but didn't.");
    
    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    _yuitest_coverline("build/test/test.js", 3468);
this.name = "ShouldFail";
    
};

//inherit from YUITest.AssertionError
_yuitest_coverline("build/test/test.js", 3473);
YUITest.ShouldFail.prototype = new YUITest.AssertionError();

//restore constructor
_yuitest_coverline("build/test/test.js", 3476);
YUITest.ShouldFail.prototype.constructor = YUITest.ShouldFail;
/**
 * UnexpectedError is subclass of AssertionError that is thrown whenever
 * an error occurs within the course of a test and the test was not expected
 * to throw an error.
 *
 * @param {Error} cause The unexpected error that caused this error to be 
 *                      thrown.
 * @namespace Test 
 * @extends YUITest.AssertionError
 * @module test
 * @class UnexpectedError
 * @constructor
 */  
_yuitest_coverline("build/test/test.js", 3490);
YUITest.UnexpectedError = function (cause){

    //call superclass
    _yuitest_coverfunc("build/test/test.js", "UnexpectedError", 3490);
_yuitest_coverline("build/test/test.js", 3493);
YUITest.AssertionError.call(this, "Unexpected error: " + cause.message);
    
    /**
     * The unexpected error that occurred.
     * @type Error
     * @property cause
     */
    _yuitest_coverline("build/test/test.js", 3500);
this.cause = cause;
    
    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    _yuitest_coverline("build/test/test.js", 3507);
this.name = "UnexpectedError";
    
    /**
     * Stack information for the error (if provided).
     * @type String
     * @property stack
     */
    _yuitest_coverline("build/test/test.js", 3514);
this.stack = cause.stack;
    
};

//inherit from YUITest.AssertionError
_yuitest_coverline("build/test/test.js", 3519);
YUITest.UnexpectedError.prototype = new YUITest.AssertionError();

//restore constructor
_yuitest_coverline("build/test/test.js", 3522);
YUITest.UnexpectedError.prototype.constructor = YUITest.UnexpectedError;
/**
 * UnexpectedValue is subclass of Error that is thrown whenever
 * a value was unexpected in its scope. This typically means that a test
 * was performed to determine that a value was *not* equal to a certain
 * value.
 *
 * @param {String} message The message to display when the error occurs.
 * @param {Object} unexpected The unexpected value.
 * @namespace Test 
 * @extends AssertionError
 * @module test
 * @class UnexpectedValue
 * @constructor
 */ 
_yuitest_coverline("build/test/test.js", 3537);
YUITest.UnexpectedValue = function (message, unexpected){

    //call superclass
    _yuitest_coverfunc("build/test/test.js", "UnexpectedValue", 3537);
_yuitest_coverline("build/test/test.js", 3540);
YUITest.AssertionError.call(this, message);
    
    /**
     * The unexpected value.
     * @type Object
     * @property unexpected
     */
    _yuitest_coverline("build/test/test.js", 3547);
this.unexpected = unexpected;
    
    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    _yuitest_coverline("build/test/test.js", 3554);
this.name = "UnexpectedValue";
    
};

//inherit from YUITest.AssertionError
_yuitest_coverline("build/test/test.js", 3559);
YUITest.UnexpectedValue.prototype = new YUITest.AssertionError();

//restore constructor
_yuitest_coverline("build/test/test.js", 3562);
YUITest.UnexpectedValue.prototype.constructor = YUITest.UnexpectedValue;

/**
 * Returns a fully formatted error for an assertion failure. This message
 * provides information about the expected and actual values.
 * @method getMessage
 * @return {String} A string describing the error.
 */
_yuitest_coverline("build/test/test.js", 3570);
YUITest.UnexpectedValue.prototype.getMessage = function(){
    _yuitest_coverfunc("build/test/test.js", "getMessage", 3570);
_yuitest_coverline("build/test/test.js", 3571);
return this.message + "\nUnexpected: " + this.unexpected + " (" + (typeof this.unexpected) + ") ";
};

/**
 * Represents a stoppage in test execution to wait for an amount of time before
 * continuing.
 * @param {Function} segment A function to run when the wait is over.
 * @param {int} delay The number of milliseconds to wait before running the code.
 * @module test
 * @class Wait
 * @namespace Test
 * @constructor
 *
 */
_yuitest_coverline("build/test/test.js", 3585);
YUITest.Wait = function (segment, delay) {
    
    /**
     * The segment of code to run when the wait is over.
     * @type Function
     * @property segment
     */
    _yuitest_coverfunc("build/test/test.js", "Wait", 3585);
_yuitest_coverline("build/test/test.js", 3592);
this.segment = (typeof segment == "function" ? segment : null);

    /**
     * The delay before running the segment of code.
     * @type int
     * @property delay
     */
    _yuitest_coverline("build/test/test.js", 3599);
this.delay = (typeof delay == "number" ? delay : 0);        
};


//Setting up our aliases..
_yuitest_coverline("build/test/test.js", 3604);
Y.Test = YUITest;
_yuitest_coverline("build/test/test.js", 3605);
Y.Object.each(YUITest, function(item, name) {
    _yuitest_coverfunc("build/test/test.js", "(anonymous 14)", 3605);
_yuitest_coverline("build/test/test.js", 3606);
var name = name.replace('Test', '');
    _yuitest_coverline("build/test/test.js", 3607);
Y.Test[name] = item;
});

} //End of else in top wrapper

_yuitest_coverline("build/test/test.js", 3612);
Y.Assert = YUITest.Assert;
_yuitest_coverline("build/test/test.js", 3613);
Y.Assert.Error = Y.Test.AssertionError;
_yuitest_coverline("build/test/test.js", 3614);
Y.Assert.ComparisonFailure = Y.Test.ComparisonFailure;
_yuitest_coverline("build/test/test.js", 3615);
Y.Assert.UnexpectedValue = Y.Test.UnexpectedValue;
_yuitest_coverline("build/test/test.js", 3616);
Y.Mock = Y.Test.Mock;
_yuitest_coverline("build/test/test.js", 3617);
Y.ObjectAssert = Y.Test.ObjectAssert;
_yuitest_coverline("build/test/test.js", 3618);
Y.ArrayAssert = Y.Test.ArrayAssert;
_yuitest_coverline("build/test/test.js", 3619);
Y.DateAssert = Y.Test.DateAssert;
_yuitest_coverline("build/test/test.js", 3620);
Y.Test.ResultsFormat = Y.Test.TestFormat;

_yuitest_coverline("build/test/test.js", 3622);
var itemsAreEqual = Y.Test.ArrayAssert.itemsAreEqual;

_yuitest_coverline("build/test/test.js", 3624);
Y.Test.ArrayAssert.itemsAreEqual = function(expected, actual, message) {
    _yuitest_coverfunc("build/test/test.js", "itemsAreEqual", 3624);
_yuitest_coverline("build/test/test.js", 3625);
return itemsAreEqual.call(this, Y.Array(expected), Y.Array(actual), message);
};


/**
 * Asserts that a given condition is true. If not, then a Y.Assert.Error object is thrown
 * and the test fails.
 * @method assert
 * @param {Boolean} condition The condition to test.
 * @param {String} message The message to display if the assertion fails.
 * @for YUI
 * @static
 */
_yuitest_coverline("build/test/test.js", 3638);
Y.assert = function(condition, message){
    _yuitest_coverfunc("build/test/test.js", "assert", 3638);
_yuitest_coverline("build/test/test.js", 3639);
Y.Assert._increment();
    _yuitest_coverline("build/test/test.js", 3640);
if (!condition){
        _yuitest_coverline("build/test/test.js", 3641);
throw new Y.Assert.Error(Y.Assert._formatMessage(message, "Assertion failed."));
    }
};

/**
 * Forces an assertion error to occur. Shortcut for Y.Assert.fail().
 * @method fail
 * @param {String} message (Optional) The message to display with the failure.
 * @for YUI
 * @static
 */
_yuitest_coverline("build/test/test.js", 3652);
Y.fail = Y.Assert.fail; 

_yuitest_coverline("build/test/test.js", 3654);
Y.Test.Runner.once = Y.Test.Runner.subscribe;

_yuitest_coverline("build/test/test.js", 3656);
Y.Test.Runner.disableLogging = function() {
    _yuitest_coverfunc("build/test/test.js", "disableLogging", 3656);
_yuitest_coverline("build/test/test.js", 3657);
Y.Test.Runner._log = false;
};

_yuitest_coverline("build/test/test.js", 3660);
Y.Test.Runner.enableLogging = function() {
    _yuitest_coverfunc("build/test/test.js", "enableLogging", 3660);
_yuitest_coverline("build/test/test.js", 3661);
Y.Test.Runner._log = true;
};

_yuitest_coverline("build/test/test.js", 3664);
Y.Test.Runner._ignoreEmpty = true;
_yuitest_coverline("build/test/test.js", 3665);
Y.Test.Runner._log = true;

_yuitest_coverline("build/test/test.js", 3667);
Y.Test.Runner.on = Y.Test.Runner.attach;

//Only allow one instance of YUITest
_yuitest_coverline("build/test/test.js", 3670);
if (!YUI.YUITest) {

    _yuitest_coverline("build/test/test.js", 3672);
if (Y.config.win) {
        _yuitest_coverline("build/test/test.js", 3673);
Y.config.win.YUITest = YUITest;
    }

    _yuitest_coverline("build/test/test.js", 3676);
YUI.YUITest = Y.Test;

    
    //Only setup the listeners once.
    _yuitest_coverline("build/test/test.js", 3680);
var logEvent = function(event) {
        
        //data variables
        _yuitest_coverfunc("build/test/test.js", "logEvent", 3680);
_yuitest_coverline("build/test/test.js", 3683);
var message = "";
        _yuitest_coverline("build/test/test.js", 3684);
var messageType = "";
        
        _yuitest_coverline("build/test/test.js", 3686);
switch(event.type){
            case this.BEGIN_EVENT:
                _yuitest_coverline("build/test/test.js", 3688);
message = "Testing began at " + (new Date()).toString() + ".";
                _yuitest_coverline("build/test/test.js", 3689);
messageType = "info";
                _yuitest_coverline("build/test/test.js", 3690);
break;
                
            case this.COMPLETE_EVENT:
                _yuitest_coverline("build/test/test.js", 3693);
message = Y.Lang.sub("Testing completed at " +
                    (new Date()).toString() + ".\n" +
                    "Passed:{passed} Failed:{failed} " +
                    "Total:{total} ({ignored} ignored)",
                    event.results);
                _yuitest_coverline("build/test/test.js", 3698);
messageType = "info";
                _yuitest_coverline("build/test/test.js", 3699);
break;
                
            case this.TEST_FAIL_EVENT:
                _yuitest_coverline("build/test/test.js", 3702);
message = event.testName + ": failed.\n" + event.error.getMessage();
                _yuitest_coverline("build/test/test.js", 3703);
messageType = "fail";
                _yuitest_coverline("build/test/test.js", 3704);
break;
                
            case this.TEST_IGNORE_EVENT:
                _yuitest_coverline("build/test/test.js", 3707);
message = event.testName + ": ignored.";
                _yuitest_coverline("build/test/test.js", 3708);
messageType = "ignore";
                _yuitest_coverline("build/test/test.js", 3709);
break;
                
            case this.TEST_PASS_EVENT:
                _yuitest_coverline("build/test/test.js", 3712);
message = event.testName + ": passed.";
                _yuitest_coverline("build/test/test.js", 3713);
messageType = "pass";
                _yuitest_coverline("build/test/test.js", 3714);
break;
                
            case this.TEST_SUITE_BEGIN_EVENT:
                _yuitest_coverline("build/test/test.js", 3717);
message = "Test suite \"" + event.testSuite.name + "\" started.";
                _yuitest_coverline("build/test/test.js", 3718);
messageType = "info";
                _yuitest_coverline("build/test/test.js", 3719);
break;
                
            case this.TEST_SUITE_COMPLETE_EVENT:
                _yuitest_coverline("build/test/test.js", 3722);
message = Y.Lang.sub("Test suite \"" +
                    event.testSuite.name + "\" completed" + ".\n" +
                    "Passed:{passed} Failed:{failed} " +
                    "Total:{total} ({ignored} ignored)",
                    event.results);
                _yuitest_coverline("build/test/test.js", 3727);
messageType = "info";
                _yuitest_coverline("build/test/test.js", 3728);
break;
                
            case this.TEST_CASE_BEGIN_EVENT:
                _yuitest_coverline("build/test/test.js", 3731);
message = "Test case \"" + event.testCase.name + "\" started.";
                _yuitest_coverline("build/test/test.js", 3732);
messageType = "info";
                _yuitest_coverline("build/test/test.js", 3733);
break;
                
            case this.TEST_CASE_COMPLETE_EVENT:
                _yuitest_coverline("build/test/test.js", 3736);
message = Y.Lang.sub("Test case \"" +
                    event.testCase.name + "\" completed.\n" +
                    "Passed:{passed} Failed:{failed} " +
                    "Total:{total} ({ignored} ignored)",
                    event.results);
                _yuitest_coverline("build/test/test.js", 3741);
messageType = "info";
                _yuitest_coverline("build/test/test.js", 3742);
break;
            default:
                _yuitest_coverline("build/test/test.js", 3744);
message = "Unexpected event " + event.type;
                _yuitest_coverline("build/test/test.js", 3745);
message = "info";
        }
        
        _yuitest_coverline("build/test/test.js", 3748);
if (Y.Test.Runner._log) {
            _yuitest_coverline("build/test/test.js", 3749);
Y.log(message, messageType, "TestRunner");
        }
    };

    _yuitest_coverline("build/test/test.js", 3753);
var i, name;

    _yuitest_coverline("build/test/test.js", 3755);
for (i in Y.Test.Runner) {
        _yuitest_coverline("build/test/test.js", 3756);
name = Y.Test.Runner[i];
        _yuitest_coverline("build/test/test.js", 3757);
if (i.indexOf('_EVENT') > -1) {
            _yuitest_coverline("build/test/test.js", 3758);
Y.Test.Runner.subscribe(name, logEvent);
        }
    }_yuitest_coverline("build/test/test.js", 3760);
;

} //End if for YUI.YUITest

    
/**
 * The Win8 namespace encapsulates functionality that is necessary to run unit tests
 * in a WinJS environment on Windows 8. (WinJS refers to a native HTML/CSS/JS runtime on Win8)
 * @param {JSON||Object} jsonObj A JSON object with atleast a property "tests" that contains an URL of all unit test HTML pages
 * @namespace Test
 * @module test
 * @class WinJS
 * @constructor
 */
_yuitest_coverline("build/test/test.js", 3774);
YUITest.WinJS = function (jsonObj) {

    _yuitest_coverfunc("build/test/test.js", "WinJS", 3774);
_yuitest_coverline("build/test/test.js", 3776);
this.tests = (jsonObj && jsonObj.tests) ? jsonObj.tests : [];
    _yuitest_coverline("build/test/test.js", 3777);
this.results = {};

    _yuitest_coverline("build/test/test.js", 3779);
this.listen();

};
    
_yuitest_coverline("build/test/test.js", 3783);
YUITest.WinJS.prototype = {
    
    //restore constructor
    constructor: YUITest.WinJS,

    //read from localstorage and populate tests array
    read: function() {
        _yuitest_coverfunc("build/test/test.js", "read", 3789);
_yuitest_coverline("build/test/test.js", 3790);
var o = WinJS.Application.local.readText("YUI.Tests", JSON.stringify({
            tests: []
        }));

        _yuitest_coverline("build/test/test.js", 3794);
this.tests = o.tests;
    },

    //pop the first element off tests array and save it to local storage
    pop: function() {
        _yuitest_coverfunc("build/test/test.js", "pop", 3798);
_yuitest_coverline("build/test/test.js", 3799);
this.tests.pop();
    },

    //Listen for TestRunner Events and append to a testResults array
    listen: function() {
        _yuitest_coverfunc("build/test/test.js", "listen", 3803);
_yuitest_coverline("build/test/test.js", 3804);
var runner = YUI.YUITest.TestRunner;
        _yuitest_coverline("build/test/test.js", 3805);
runner.subscribe(runner.COMPLETE_EVENT, function() {
            _yuitest_coverfunc("build/test/test.js", "(anonymous 15)", 3805);
_yuitest_coverline("build/test/test.js", 3806);
console.log("Test Suite Completed.")
        });

        _yuitest_coverline("build/test/test.js", 3809);
runner.subscribe(runner.BEGIN_EVENT, function() {
            _yuitest_coverfunc("build/test/test.js", "(anonymous 16)", 3809);
_yuitest_coverline("build/test/test.js", 3810);
console.log("Test Suite About to Begin.")
        });
    },

    //save to localstorage
    save: function() {

    },

    //Navigate to the next unit test HTML
    navigate: function() {

    }
    
};


}, '@VERSION@', {"requires": ["event-simulate", "event-custom", "json-stringify"]});
