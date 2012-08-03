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
_yuitest_coverage["/home/yui/src/yui3/src/test/build_tmp/test.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/home/yui/src/yui3/src/test/build_tmp/test.js",
    code: []
};
_yuitest_coverage["/home/yui/src/yui3/src/test/build_tmp/test.js"].code=["YUI.add('test', function(Y) {","","","","/**"," * YUI Test Framework"," * @module test"," * @main test"," */","","/*"," * The root namespace for YUI Test."," */","","//So we only ever have one YUITest object that's shared","if (YUI.YUITest) {","    Y.Test = YUI.YUITest;","} else { //Ends after the YUITest definitions","","    //Make this global for back compat","    YUITest = {","        version: \"@VERSION@\"","    };","","Y.namespace('Test');","","","//Using internal YUI methods here","YUITest.Object = Y.Object;","YUITest.Array = Y.Array;","YUITest.Util = {","    mix: Y.mix,","    JSON: Y.JSON","};","","/**"," * Simple custom event implementation."," * @namespace Test"," * @module test"," * @class EventTarget"," * @constructor"," */","YUITest.EventTarget = function(){","","    /**","     * Event handlers for the various events.","     * @type Object","     * @private","     * @property _handlers","     * @static","     */","    this._handlers = {};","","};","    ","YUITest.EventTarget.prototype = {","","    //restore prototype","    constructor: YUITest.EventTarget,","            ","    //-------------------------------------------------------------------------","    // Event Handling","    //-------------------------------------------------------------------------","    ","    /**","     * Adds a listener for a given event type.","     * @param {String} type The type of event to add a listener for.","     * @param {Function} listener The function to call when the event occurs.","     * @return {void}","     * @method attach","     */","    attach: function(type, listener){","        if (typeof this._handlers[type] == \"undefined\"){","            this._handlers[type] = [];","        }","","        this._handlers[type].push(listener);","    },","    ","    /**","     * Adds a listener for a given event type.","     * @param {String} type The type of event to add a listener for.","     * @param {Function} listener The function to call when the event occurs.","     * @return {void}","     * @method subscribe","     * @deprecated","     */","    subscribe: function(type, listener){","        this.attach.apply(this, arguments);","    },","    ","    /**","     * Fires an event based on the passed-in object.","     * @param {Object|String} event An object with at least a 'type' attribute","     *      or a string indicating the event name.","     * @return {void}","     * @method fire","     */    ","    fire: function(event){","        if (typeof event == \"string\"){","            event = { type: event };","        }","        if (!event.target){","            event.target = this;","        }","        ","        if (!event.type){","            throw new Error(\"Event object missing 'type' property.\");","        }","        ","        if (this._handlers[event.type] instanceof Array){","            var handlers = this._handlers[event.type];","            for (var i=0, len=handlers.length; i < len; i++){","                handlers[i].call(this, event);","            }","        }            ","    },","","    /**","     * Removes a listener for a given event type.","     * @param {String} type The type of event to remove a listener from.","     * @param {Function} listener The function to remove from the event.","     * @return {void}","     * @method detach","     */","    detach: function(type, listener){","        if (this._handlers[type] instanceof Array){","            var handlers = this._handlers[type];","            for (var i=0, len=handlers.length; i < len; i++){","                if (handlers[i] === listener){","                    handlers.splice(i, 1);","                    break;","                }","            }","        }            ","    },","    ","    /**","     * Removes a listener for a given event type.","     * @param {String} type The type of event to remove a listener from.","     * @param {Function} listener The function to remove from the event.","     * @return {void}","     * @method unsubscribe","     * @deprecated","     */","    unsubscribe: function(type, listener){","        this.detach.apply(this, arguments);          ","    }    ","","};","","    ","/**"," * A test suite that can contain a collection of TestCase and TestSuite objects."," * @param {String||Object} data The name of the test suite or an object containing"," *      a name property as well as setUp and tearDown methods."," * @namespace Test"," * @module test"," * @class TestSuite"," * @constructor"," */","YUITest.TestSuite = function (data) {","","    /**","     * The name of the test suite.","     * @type String","     * @property name","     */","    this.name = \"\";","","    /**","     * Array of test suites and test cases.","     * @type Array","     * @property items","     * @private","     */","    this.items = [];","","    //initialize the properties","    if (typeof data == \"string\"){","        this.name = data;","    } else if (data instanceof Object){","        for (var prop in data){","            if (data.hasOwnProperty(prop)){","                this[prop] = data[prop];","            }","        }","    }","","    //double-check name","    if (this.name === \"\"){","        this.name = \"testSuite\" + (+new Date());","    }","","};","    ","YUITest.TestSuite.prototype = {","    ","    //restore constructor","    constructor: YUITest.TestSuite,","    ","    /**","     * Adds a test suite or test case to the test suite.","     * @param {Test.TestSuite||YUITest.TestCase} testObject The test suite or test case to add.","     * @return {Void}","     * @method add","     */","    add : function (testObject) {","        if (testObject instanceof YUITest.TestSuite || testObject instanceof YUITest.TestCase) {","            this.items.push(testObject);","        }","        return this;","    },","    ","    //-------------------------------------------------------------------------","    // Stub Methods","    //-------------------------------------------------------------------------","","    /**","     * Function to run before each test is executed.","     * @return {Void}","     * @method setUp","     */","    setUp : function () {","    },","    ","    /**","     * Function to run after each test is executed.","     * @return {Void}","     * @method tearDown","     */","    tearDown: function () {","    }","    ","};","/**"," * Test case containing various tests to run."," * @param template An object containing any number of test methods, other methods,"," *                 an optional name, and anything else the test case needs."," * @module test"," * @class TestCase"," * @namespace Test"," * @constructor"," */","YUITest.TestCase = function (template) {","    ","    /*","     * Special rules for the test case. Possible subobjects","     * are fail, for tests that should fail, and error, for","     * tests that should throw an error.","     */","    this._should = {};","    ","    //copy over all properties from the template to this object","    for (var prop in template) {","        this[prop] = template[prop];","    }    ","    ","    //check for a valid name","    if (typeof this.name != \"string\"){","        this.name = \"testCase\" + (+new Date());","    }","","};","        ","YUITest.TestCase.prototype = {  ","","    //restore constructor","    constructor: YUITest.TestCase,","    ","    /**","     * Method to call from an async init method to","     * restart the test case. When called, returns a function","     * that should be called when tests are ready to continue.","     * @method callback","     * @return {Function} The function to call as a callback.","     */","    callback: function(){","        return YUITest.TestRunner.callback.apply(YUITest.TestRunner,arguments);","    },","","    /**","     * Resumes a paused test and runs the given function.","     * @param {Function} segment (Optional) The function to run.","     *      If omitted, the test automatically passes.","     * @return {Void}","     * @method resume","     */","    resume : function (segment) {","        YUITest.TestRunner.resume(segment);","    },","","    /**","     * Causes the test case to wait a specified amount of time and then","     * continue executing the given code.","     * @param {Function} segment (Optional) The function to run after the delay.","     *      If omitted, the TestRunner will wait until resume() is called.","     * @param {int} delay (Optional) The number of milliseconds to wait before running","     *      the function. If omitted, defaults to zero.","     * @return {Void}","     * @method wait","     */","    wait : function (segment, delay){","        ","        var actualDelay = (typeof segment == \"number\" ? segment : delay);","        actualDelay = (typeof actualDelay == \"number\" ? actualDelay : 10000);","    ","		if (typeof segment == \"function\"){","            throw new YUITest.Wait(segment, actualDelay);","        } else {","            throw new YUITest.Wait(function(){","                YUITest.Assert.fail(\"Timeout: wait() called but resume() never called.\");","            }, actualDelay);","        }","    },","    ","    //-------------------------------------------------------------------------","    // Assertion Methods","    //-------------------------------------------------------------------------","","    /**","     * Asserts that a given condition is true. If not, then a YUITest.AssertionError object is thrown","     * and the test fails.","     * @method assert","     * @param {Boolean} condition The condition to test.","     * @param {String} message The message to display if the assertion fails.","     */","    assert : function (condition, message){","        YUITest.Assert._increment();","        if (!condition){","            throw new YUITest.AssertionError(YUITest.Assert._formatMessage(message, \"Assertion failed.\"));","        }    ","    },","    ","    /**","     * Forces an assertion error to occur. Shortcut for YUITest.Assert.fail().","     * @method fail","     * @param {String} message (Optional) The message to display with the failure.","     */","    fail: function (message) {    ","        YUITest.Assert.fail(message);","    },","    ","    //-------------------------------------------------------------------------","    // Stub Methods","    //-------------------------------------------------------------------------","","    /**","     * Function to run once before tests start to run.","     * This executes before the first call to setUp().","     * @method init","     */","    init: function(){","        //noop","    },","    ","    /**","     * Function to run once after tests finish running.","     * This executes after the last call to tearDown().","     * @method destroy","     */","    destroy: function(){","        //noop","    },","","    /**","     * Function to run before each test is executed.","     * @return {Void}","     * @method setUp","     */","    setUp : function () {","        //noop","    },","    ","    /**","     * Function to run after each test is executed.","     * @return {Void}","     * @method tearDown","     */","    tearDown: function () {    ","        //noop","    }","};","/**"," * An object object containing test result formatting methods."," * @namespace Test"," * @module test"," * @class TestFormat"," * @static"," */","YUITest.TestFormat = function(){","    ","    /* (intentionally not documented)","     * Basic XML escaping method. Replaces quotes, less-than, greater-than,","     * apostrophe, and ampersand characters with their corresponding entities.","     * @param {String} text The text to encode.","     * @return {String} The XML-escaped text.","     */","    function xmlEscape(text){","    ","        return text.replace(/[<>\"'&]/g, function(value){","            switch(value){","                case \"<\":   return \"&lt;\";","                case \">\":   return \"&gt;\";","                case \"\\\"\":  return \"&quot;\";","                case \"'\":   return \"&apos;\";","                case \"&\":   return \"&amp;\";","            }","        });","    ","    }","        ","        ","    return {","    ","        /**","         * Returns test results formatted as a JSON string. Requires JSON utility.","         * @param {Object} result The results object created by TestRunner.","         * @return {String} A JSON-formatted string of results.","         * @method JSON","         * @static","         */","        JSON: function(results) {","            return YUITest.Util.JSON.stringify(results);","        },","        ","        /**","         * Returns test results formatted as an XML string.","         * @param {Object} result The results object created by TestRunner.","         * @return {String} An XML-formatted string of results.","         * @method XML","         * @static","         */","        XML: function(results) {","","            function serializeToXML(results){","                var xml = \"<\" + results.type + \" name=\\\"\" + xmlEscape(results.name) + \"\\\"\";","                ","                if (typeof(results.duration)==\"number\"){","                    xml += \" duration=\\\"\" + results.duration + \"\\\"\";","                }","                ","                if (results.type == \"test\"){","                    xml += \" result=\\\"\" + results.result + \"\\\" message=\\\"\" + xmlEscape(results.message) + \"\\\">\";","                } else {","                    xml += \" passed=\\\"\" + results.passed + \"\\\" failed=\\\"\" + results.failed + \"\\\" ignored=\\\"\" + results.ignored + \"\\\" total=\\\"\" + results.total + \"\\\">\";","                    for (var prop in results){","                        if (results.hasOwnProperty(prop)){","                            if (results[prop] && typeof results[prop] == \"object\" && !(results[prop] instanceof Array)){","                                xml += serializeToXML(results[prop]);","                            }","                        }","                    }       ","                }","","                xml += \"</\" + results.type + \">\";","                ","                return xml;    ","            }","","            return \"<?xml version=\\\"1.0\\\" encoding=\\\"UTF-8\\\"?>\" + serializeToXML(results);","","        },","","","        /**","         * Returns test results formatted in JUnit XML format.","         * @param {Object} result The results object created by TestRunner.","         * @return {String} An XML-formatted string of results.","         * @method JUnitXML","         * @static","         */","        JUnitXML: function(results) {","","            function serializeToJUnitXML(results){","                var xml = \"\";","                    ","                switch (results.type){","                    //equivalent to testcase in JUnit","                    case \"test\":","                        if (results.result != \"ignore\"){","                            xml = \"<testcase name=\\\"\" + xmlEscape(results.name) + \"\\\" time=\\\"\" + (results.duration/1000) + \"\\\">\";","                            if (results.result == \"fail\"){","                                xml += \"<failure message=\\\"\" + xmlEscape(results.message) + \"\\\"><![CDATA[\" + results.message + \"]]></failure>\";","                            }","                            xml+= \"</testcase>\";","                        }","                        break;","                        ","                    //equivalent to testsuite in JUnit","                    case \"testcase\":","                    ","                        xml = \"<testsuite name=\\\"\" + xmlEscape(results.name) + \"\\\" tests=\\\"\" + results.total + \"\\\" failures=\\\"\" + results.failed + \"\\\" time=\\\"\" + (results.duration/1000) + \"\\\">\";","                        ","                        for (var prop in results){","                            if (results.hasOwnProperty(prop)){","                                if (results[prop] && typeof results[prop] == \"object\" && !(results[prop] instanceof Array)){","                                    xml += serializeToJUnitXML(results[prop]);","                                }","                            }","                        }            ","                        ","                        xml += \"</testsuite>\";","                        break;","                    ","                    //no JUnit equivalent, don't output anything","                    case \"testsuite\":","                        for (var prop in results){","                            if (results.hasOwnProperty(prop)){","                                if (results[prop] && typeof results[prop] == \"object\" && !(results[prop] instanceof Array)){","                                    xml += serializeToJUnitXML(results[prop]);","                                }","                            }","                        }                                                     ","                        break;","                        ","                    //top-level, equivalent to testsuites in JUnit","                    case \"report\":","                    ","                        xml = \"<testsuites>\";","                    ","                        for (var prop in results){","                            if (results.hasOwnProperty(prop)){","                                if (results[prop] && typeof results[prop] == \"object\" && !(results[prop] instanceof Array)){","                                    xml += serializeToJUnitXML(results[prop]);","                                }","                            }","                        }            ","                        ","                        xml += \"</testsuites>\";            ","                    ","                    //no default","                }","                ","                return xml;","         ","            }","","            return \"<?xml version=\\\"1.0\\\" encoding=\\\"UTF-8\\\"?>\" + serializeToJUnitXML(results);","        },","    ","        /**","         * Returns test results formatted in TAP format.","         * For more information, see <a href=\"http://testanything.org/\">Test Anything Protocol</a>.","         * @param {Object} result The results object created by TestRunner.","         * @return {String} A TAP-formatted string of results.","         * @method TAP","         * @static","         */","        TAP: function(results) {","        ","            var currentTestNum = 1;","","            function serializeToTAP(results){","                var text = \"\";","                    ","                switch (results.type){","","                    case \"test\":","                        if (results.result != \"ignore\"){","","                            text = \"ok \" + (currentTestNum++) + \" - \" + results.name;","                            ","                            if (results.result == \"fail\"){","                                text = \"not \" + text + \" - \" + results.message;","                            }","                            ","                            text += \"\\n\";","                        } else {","                            text = \"#Ignored test \" + results.name + \"\\n\";","                        }","                        break;","                        ","                    case \"testcase\":","                    ","                        text = \"#Begin testcase \" + results.name + \"(\" + results.failed + \" failed of \" + results.total + \")\\n\";","                                        ","                        for (var prop in results){","                            if (results.hasOwnProperty(prop)){","                                if (results[prop] && typeof results[prop] == \"object\" && !(results[prop] instanceof Array)){","                                    text += serializeToTAP(results[prop]);","                                }","                            }","                        }            ","                        ","                        text += \"#End testcase \" + results.name + \"\\n\";","                        ","                        ","                        break;","                    ","                    case \"testsuite\":","","                        text = \"#Begin testsuite \" + results.name + \"(\" + results.failed + \" failed of \" + results.total + \")\\n\";                ","                    ","                        for (var prop in results){","                            if (results.hasOwnProperty(prop)){","                                if (results[prop] && typeof results[prop] == \"object\" && !(results[prop] instanceof Array)){","                                    text += serializeToTAP(results[prop]);","                                }","                            }","                        }                                                      ","","                        text += \"#End testsuite \" + results.name + \"\\n\";","                        break;","","                    case \"report\":","                    ","                        for (var prop in results){","                            if (results.hasOwnProperty(prop)){","                                if (results[prop] && typeof results[prop] == \"object\" && !(results[prop] instanceof Array)){","                                    text += serializeToTAP(results[prop]);","                                }","                            }","                        }              ","                        ","                    //no default","                }","                ","                return text;","         ","            }","","            return \"1..\" + results.total + \"\\n\" + serializeToTAP(results);","        }","    ","    };","}();","    ","    /**","     * An object capable of sending test results to a server.","     * @param {String} url The URL to submit the results to.","     * @param {Function} format (Optiona) A function that outputs the results in a specific format.","     *      Default is YUITest.TestFormat.XML.","     * @constructor","     * @namespace Test","     * @module test"," * @class Reporter","     */","    YUITest.Reporter = function(url, format) {","    ","        /**","         * The URL to submit the data to.","         * @type String","         * @property url","         */","        this.url = url;","    ","        /**","         * The formatting function to call when submitting the data.","         * @type Function","         * @property format","         */","        this.format = format || YUITest.TestFormat.XML;","    ","        /**","         * Extra fields to submit with the request.","         * @type Object","         * @property _fields","         * @private","         */","        this._fields = new Object();","        ","        /**","         * The form element used to submit the results.","         * @type HTMLFormElement","         * @property _form","         * @private","         */","        this._form = null;","    ","        /**","         * Iframe used as a target for form submission.","         * @type HTMLIFrameElement","         * @property _iframe","         * @private","         */","        this._iframe = null;","    };","    ","    YUITest.Reporter.prototype = {","    ","        //restore missing constructor","        constructor: YUITest.Reporter,","    ","        /**","         * Adds a field to the form that submits the results.","         * @param {String} name The name of the field.","         * @param {Variant} value The value of the field.","         * @return {Void}","         * @method addField","         */","        addField : function (name, value){","            this._fields[name] = value;    ","        },","        ","        /**","         * Removes all previous defined fields.","         * @return {Void}","         * @method clearFields","         */","        clearFields : function(){","            this._fields = new Object();","        },","    ","        /**","         * Cleans up the memory associated with the TestReporter, removing DOM elements","         * that were created.","         * @return {Void}","         * @method destroy","         */","        destroy : function() {","            if (this._form){","                this._form.parentNode.removeChild(this._form);","                this._form = null;","            }        ","            if (this._iframe){","                this._iframe.parentNode.removeChild(this._iframe);","                this._iframe = null;","            }","            this._fields = null;","        },","    ","        /**","         * Sends the report to the server.","         * @param {Object} results The results object created by TestRunner.","         * @return {Void}","         * @method report","         */","        report : function(results){","        ","            //if the form hasn't been created yet, create it","            if (!this._form){","                this._form = document.createElement(\"form\");","                this._form.method = \"post\";","                this._form.style.visibility = \"hidden\";","                this._form.style.position = \"absolute\";","                this._form.style.top = 0;","                document.body.appendChild(this._form);","            ","                //IE won't let you assign a name using the DOM, must do it the hacky way","                try {","                    this._iframe = document.createElement(\"<iframe name=\\\"yuiTestTarget\\\" />\");","                } catch (ex){","                    this._iframe = document.createElement(\"iframe\");","                    this._iframe.name = \"yuiTestTarget\";","                }","    ","                this._iframe.src = \"javascript:false\";","                this._iframe.style.visibility = \"hidden\";","                this._iframe.style.position = \"absolute\";","                this._iframe.style.top = 0;","                document.body.appendChild(this._iframe);","    ","                this._form.target = \"yuiTestTarget\";","            }","    ","            //set the form's action","            this._form.action = this.url;","        ","            //remove any existing fields","            while(this._form.hasChildNodes()){","                this._form.removeChild(this._form.lastChild);","            }","            ","            //create default fields","            this._fields.results = this.format(results);","            this._fields.useragent = navigator.userAgent;","            this._fields.timestamp = (new Date()).toLocaleString();","    ","            //add fields to the form","            for (var prop in this._fields){","                var value = this._fields[prop];","                if (this._fields.hasOwnProperty(prop) && (typeof value != \"function\")){","                    var input = document.createElement(\"input\");","                    input.type = \"hidden\";","                    input.name = prop;","                    input.value = value;","                    this._form.appendChild(input);","                }","            }","    ","            //remove default fields","            delete this._fields.results;","            delete this._fields.useragent;","            delete this._fields.timestamp;","            ","            if (arguments[1] !== false){","                this._form.submit();","            }","        ","        }","    ","    };","    ","    /**","     * Runs test suites and test cases, providing events to allowing for the","     * interpretation of test results.","     * @namespace Test","     * @module test"," * @class TestRunner","     * @static","     */","    YUITest.TestRunner = function(){","","        /*(intentionally not documented)","         * Determines if any of the array of test groups appears","         * in the given TestRunner filter.","         * @param {Array} testGroups The array of test groups to","         *      search for.","         * @param {String} filter The TestRunner groups filter.","         */","        function inGroups(testGroups, filter){","            if (!filter.length){","                return true;","            } else {                ","                if (testGroups){","                    for (var i=0, len=testGroups.length; i < len; i++){","                        if (filter.indexOf(\",\" + testGroups[i] + \",\") > -1){","                            return true;","                        }","                    }","                }","                return false;","            }","        }","    ","        /**","         * A node in the test tree structure. May represent a TestSuite, TestCase, or","         * test function.","         * @param {Variant} testObject A TestSuite, TestCase, or the name of a test function.","         * @module test"," * @class TestNode","         * @constructor","         * @private","         */","        function TestNode(testObject){","        ","            /**","             * The TestSuite, TestCase, or test function represented by this node.","             * @type Variant","             * @property testObject","             */","            this.testObject = testObject;","            ","            /**","             * Pointer to this node's first child.","             * @type TestNode","             * @property firstChild","             */        ","            this.firstChild = null;","            ","            /**","             * Pointer to this node's last child.","             * @type TestNode","             * @property lastChild","             */        ","            this.lastChild = null;","            ","            /**","             * Pointer to this node's parent.","             * @type TestNode","             * @property parent","             */        ","            this.parent = null; ","       ","            /**","             * Pointer to this node's next sibling.","             * @type TestNode","             * @property next","             */        ","            this.next = null;","            ","            /**","             * Test results for this test object.","             * @type object","             * @property results","             */                ","            this.results = new YUITest.Results();","            ","            //initialize results","            if (testObject instanceof YUITest.TestSuite){","                this.results.type = \"testsuite\";","                this.results.name = testObject.name;","            } else if (testObject instanceof YUITest.TestCase){","                this.results.type = \"testcase\";","                this.results.name = testObject.name;","            }","           ","        }","        ","        TestNode.prototype = {","        ","            /**","             * Appends a new test object (TestSuite, TestCase, or test function name) as a child","             * of this node.","             * @param {Variant} testObject A TestSuite, TestCase, or the name of a test function.","             * @return {Void}","             * @method appendChild","             */","            appendChild : function (testObject){","                var node = new TestNode(testObject);","                if (this.firstChild === null){","                    this.firstChild = this.lastChild = node;","                } else {","                    this.lastChild.next = node;","                    this.lastChild = node;","                }","                node.parent = this;","                return node;","            }       ","        };","    ","        /**","         * Runs test suites and test cases, providing events to allowing for the","         * interpretation of test results.","         * @namespace Test","         * @module test"," * @class Runner","         * @static","         */","        function TestRunner(){","        ","            //inherit from EventTarget","            YUITest.EventTarget.call(this);","            ","            /**","             * Suite on which to attach all TestSuites and TestCases to be run.","             * @type YUITest.TestSuite","             * @property masterSuite","             * @static","             * @private","             */","            this.masterSuite = new YUITest.TestSuite(\"yuitests\" + (new Date()).getTime());        ","    ","            /**","             * Pointer to the current node in the test tree.","             * @type TestNode","             * @private","             * @property _cur","             * @static","             */","            this._cur = null;","            ","            /**","             * Pointer to the root node in the test tree.","             * @type TestNode","             * @private","             * @property _root","             * @static","             */","            this._root = null;","            ","            /**","             * Indicates if the TestRunner will log events or not.","             * @type Boolean","             * @property _log","             * @private","             * @static","             */","            this._log = true;","            ","            /**","             * Indicates if the TestRunner is waiting as a result of","             * wait() being called.","             * @type Boolean","             * @property _waiting","             * @private","             * @static","             */","            this._waiting = false;","            ","            /**","             * Indicates if the TestRunner is currently running tests.","             * @type Boolean","             * @private","             * @property _running","             * @static","             */","            this._running = false;","            ","            /**","             * Holds copy of the results object generated when all tests are","             * complete.","             * @type Object","             * @private","             * @property _lastResults","             * @static","             */","            this._lastResults = null;       ","            ","            /**","             * Data object that is passed around from method to method.","             * @type Object","             * @private","             * @property _data","             * @static","             */","            this._context = null;","            ","            /**","             * The list of test groups to run. The list is represented","             * by a comma delimited string with commas at the start and","             * end.","             * @type String","             * @private","             * @property _groups","             * @static","             */","            this._groups = \"\";","","        }","        ","        TestRunner.prototype = YUITest.Util.mix(new YUITest.EventTarget(), {","            ","            /**","            * If true, YUITest will not fire an error for tests with no Asserts.","            * @prop _ignoreEmpty","            * @private","            * @type Boolean","            * @static","            */","            _ignoreEmpty: false,","","            //restore prototype","            constructor: YUITest.TestRunner,","        ","            //-------------------------------------------------------------------------","            // Constants","            //-------------------------------------------------------------------------","             ","            /**","             * Fires when a test case is opened but before the first ","             * test is executed.","             * @event testcasebegin","             * @static","             */         ","            TEST_CASE_BEGIN_EVENT : \"testcasebegin\",","            ","            /**","             * Fires when all tests in a test case have been executed.","             * @event testcasecomplete","             * @static","             */        ","            TEST_CASE_COMPLETE_EVENT : \"testcasecomplete\",","            ","            /**","             * Fires when a test suite is opened but before the first ","             * test is executed.","             * @event testsuitebegin","             * @static","             */        ","            TEST_SUITE_BEGIN_EVENT : \"testsuitebegin\",","            ","            /**","             * Fires when all test cases in a test suite have been","             * completed.","             * @event testsuitecomplete","             * @static","             */        ","            TEST_SUITE_COMPLETE_EVENT : \"testsuitecomplete\",","            ","            /**","             * Fires when a test has passed.","             * @event pass","             * @static","             */        ","            TEST_PASS_EVENT : \"pass\",","            ","            /**","             * Fires when a test has failed.","             * @event fail","             * @static","             */        ","            TEST_FAIL_EVENT : \"fail\",","            ","            /**","             * Fires when a non-test method has an error.","             * @event error","             * @static","             */        ","            ERROR_EVENT : \"error\",","            ","            /**","             * Fires when a test has been ignored.","             * @event ignore","             * @static","             */        ","            TEST_IGNORE_EVENT : \"ignore\",","            ","            /**","             * Fires when all test suites and test cases have been completed.","             * @event complete","             * @static","             */        ","            COMPLETE_EVENT : \"complete\",","            ","            /**","             * Fires when the run() method is called.","             * @event begin","             * @static","             */        ","            BEGIN_EVENT : \"begin\",                           ","","            //-------------------------------------------------------------------------","            // Test Tree-Related Methods","            //-------------------------------------------------------------------------","    ","            /**","             * Adds a test case to the test tree as a child of the specified node.","             * @param {TestNode} parentNode The node to add the test case to as a child.","             * @param {Test.TestCase} testCase The test case to add.","             * @return {Void}","             * @static","             * @private","             * @method _addTestCaseToTestTree","             */","           _addTestCaseToTestTree : function (parentNode, testCase){","                ","                //add the test suite","                var node = parentNode.appendChild(testCase),","                    prop,","                    testName;","                ","                //iterate over the items in the test case","                for (prop in testCase){","                    if ((prop.indexOf(\"test\") === 0 || prop.indexOf(\" \") > -1) && typeof testCase[prop] == \"function\"){","                        node.appendChild(prop);","                    }","                }","             ","            },","            ","            /**","             * Adds a test suite to the test tree as a child of the specified node.","             * @param {TestNode} parentNode The node to add the test suite to as a child.","             * @param {Test.TestSuite} testSuite The test suite to add.","             * @return {Void}","             * @static","             * @private","             * @method _addTestSuiteToTestTree","             */","            _addTestSuiteToTestTree : function (parentNode, testSuite) {","                ","                //add the test suite","                var node = parentNode.appendChild(testSuite);","                ","                //iterate over the items in the master suite","                for (var i=0; i < testSuite.items.length; i++){","                    if (testSuite.items[i] instanceof YUITest.TestSuite) {","                        this._addTestSuiteToTestTree(node, testSuite.items[i]);","                    } else if (testSuite.items[i] instanceof YUITest.TestCase) {","                        this._addTestCaseToTestTree(node, testSuite.items[i]);","                    }                   ","                }            ","            },","            ","            /**","             * Builds the test tree based on items in the master suite. The tree is a hierarchical","             * representation of the test suites, test cases, and test functions. The resulting tree","             * is stored in _root and the pointer _cur is set to the root initially.","             * @return {Void}","             * @static","             * @private","             * @method _buildTestTree","             */","            _buildTestTree : function () {","            ","                this._root = new TestNode(this.masterSuite);","                //this._cur = this._root;","                ","                //iterate over the items in the master suite","                for (var i=0; i < this.masterSuite.items.length; i++){","                    if (this.masterSuite.items[i] instanceof YUITest.TestSuite) {","                        this._addTestSuiteToTestTree(this._root, this.masterSuite.items[i]);","                    } else if (this.masterSuite.items[i] instanceof YUITest.TestCase) {","                        this._addTestCaseToTestTree(this._root, this.masterSuite.items[i]);","                    }                   ","                }            ","            ","            }, ","        ","            //-------------------------------------------------------------------------","            // Private Methods","            //-------------------------------------------------------------------------","            ","            /**","             * Handles the completion of a test object's tests. Tallies test results ","             * from one level up to the next.","             * @param {TestNode} node The TestNode representing the test object.","             * @return {Void}","             * @method _handleTestObjectComplete","             * @private","             */","            _handleTestObjectComplete : function (node) {","                var parentNode;","                ","                if (node && (typeof node.testObject == \"object\")) {","                    parentNode = node.parent;","                ","                    if (parentNode){","                        parentNode.results.include(node.results); ","                        parentNode.results[node.testObject.name] = node.results;","                    }","                ","                    if (node.testObject instanceof YUITest.TestSuite){","                        this._execNonTestMethod(node, \"tearDown\", false);","                        node.results.duration = (new Date()) - node._start;","                        this.fire({ type: this.TEST_SUITE_COMPLETE_EVENT, testSuite: node.testObject, results: node.results});","                    } else if (node.testObject instanceof YUITest.TestCase){","                        this._execNonTestMethod(node, \"destroy\", false);","                        node.results.duration = (new Date()) - node._start;","                        this.fire({ type: this.TEST_CASE_COMPLETE_EVENT, testCase: node.testObject, results: node.results});","                    }      ","                } ","            },                ","            ","            //-------------------------------------------------------------------------","            // Navigation Methods","            //-------------------------------------------------------------------------","            ","            /**","             * Retrieves the next node in the test tree.","             * @return {TestNode} The next node in the test tree or null if the end is reached.","             * @private","             * @static","             * @method _next","             */","            _next : function () {","            ","                if (this._cur === null){","                    this._cur = this._root;","                } else if (this._cur.firstChild) {","                    this._cur = this._cur.firstChild;","                } else if (this._cur.next) {","                    this._cur = this._cur.next;            ","                } else {","                    while (this._cur && !this._cur.next && this._cur !== this._root){","                        this._handleTestObjectComplete(this._cur);","                        this._cur = this._cur.parent;","                    }","                    ","                    this._handleTestObjectComplete(this._cur);               ","                        ","                    if (this._cur == this._root){","                        this._cur.results.type = \"report\";","                        this._cur.results.timestamp = (new Date()).toLocaleString();","                        this._cur.results.duration = (new Date()) - this._cur._start;   ","                        this._lastResults = this._cur.results;","                        this._running = false;                         ","                        this.fire({ type: this.COMPLETE_EVENT, results: this._lastResults});","                        this._cur = null;","                    } else if (this._cur) {","                        this._cur = this._cur.next;                ","                    }","                }","            ","                return this._cur;","            },","            ","            /**","             * Executes a non-test method (init, setUp, tearDown, destroy)","             * and traps an errors. If an error occurs, an error event is","             * fired.","             * @param {Object} node The test node in the testing tree.","             * @param {String} methodName The name of the method to execute.","             * @param {Boolean} allowAsync Determines if the method can be called asynchronously.","             * @return {Boolean} True if an async method was called, false if not.","             * @method _execNonTestMethod","             * @private","             */","            _execNonTestMethod: function(node, methodName, allowAsync){","                var testObject = node.testObject,","                    event = { type: this.ERROR_EVENT };","                try {","                    if (allowAsync && testObject[\"async:\" + methodName]){","                        testObject[\"async:\" + methodName](this._context);","                        return true;","                    } else {","                        testObject[methodName](this._context);","                    }","                } catch (ex){","                    node.results.errors++;","                    event.error = ex;","                    event.methodName = methodName;","                    if (testObject instanceof YUITest.TestCase){","                        event.testCase = testObject;","                    } else {","                        event.testSuite = testSuite;","                    }","                    ","                    this.fire(event);","                }  ","","                return false;","            },","            ","            /**","             * Runs a test case or test suite, returning the results.","             * @param {Test.TestCase|YUITest.TestSuite} testObject The test case or test suite to run.","             * @return {Object} Results of the execution with properties passed, failed, and total.","             * @private","             * @method _run","             * @static","             */","            _run : function () {","            ","                //flag to indicate if the TestRunner should wait before continuing","                var shouldWait = false;","                ","                //get the next test node","                var node = this._next();","                ","                if (node !== null) {","                ","                    //set flag to say the testrunner is running","                    this._running = true;","                    ","                    //eliminate last results","                    this._lastResult = null;                  ","                ","                    var testObject = node.testObject;","                    ","                    //figure out what to do","                    if (typeof testObject == \"object\" && testObject !== null){","                        if (testObject instanceof YUITest.TestSuite){","                            this.fire({ type: this.TEST_SUITE_BEGIN_EVENT, testSuite: testObject });","                            node._start = new Date();","                            this._execNonTestMethod(node, \"setUp\" ,false);","                        } else if (testObject instanceof YUITest.TestCase){","                            this.fire({ type: this.TEST_CASE_BEGIN_EVENT, testCase: testObject });","                            node._start = new Date();","                            ","                            //regular or async init","                            /*try {","                                if (testObject[\"async:init\"]){","                                    testObject[\"async:init\"](this._context);","                                    return;","                                } else {","                                    testObject.init(this._context);","                                }","                            } catch (ex){","                                node.results.errors++;","                                this.fire({ type: this.ERROR_EVENT, error: ex, testCase: testObject, methodName: \"init\" });","                            }*/","                            if(this._execNonTestMethod(node, \"init\", true)){","                                return;","                            }","                        }","                        ","                        //some environments don't support setTimeout","                        if (typeof setTimeout != \"undefined\"){                    ","                            setTimeout(function(){","                                YUITest.TestRunner._run();","                            }, 0);","                        } else {","                            this._run();","                        }","                    } else {","                        this._runTest(node);","                    }","    ","                }","            },","            ","            _resumeTest : function (segment) {","            ","                //get relevant information","                var node = this._cur;                ","                ","                //we know there's no more waiting now","                this._waiting = false;","                ","                //if there's no node, it probably means a wait() was called after resume()","                if (!node){","                    //TODO: Handle in some way?","                    //console.log(\"wait() called after resume()\");","                    //this.fire(\"error\", { testCase: \"(unknown)\", test: \"(unknown)\", error: new Error(\"wait() called after resume()\")} );","                    return;","                }","                ","                var testName = node.testObject;","                var testCase = node.parent.testObject;","            ","                //cancel other waits if available","                if (testCase.__yui_wait){","                    clearTimeout(testCase.__yui_wait);","                    delete testCase.__yui_wait;","                }","","                //get the \"should\" test cases","                var shouldFail = testName.indexOf(\"fail:\") === 0 ||","                                    (testCase._should.fail || {})[testName];","                var shouldError = (testCase._should.error || {})[testName];","                ","                //variable to hold whether or not the test failed","                var failed = false;","                var error = null;","                    ","                //try the test","                try {","                ","                    //run the test","                    segment.call(testCase, this._context);                    ","                ","                    //if the test hasn't already failed and doesn't have any asserts...","                    if(YUITest.Assert._getCount() == 0 && !this._ignoreEmpty){","                        throw new YUITest.AssertionError(\"Test has no asserts.\");","                    }                                                        ","                    //if it should fail, and it got here, then it's a fail because it didn't","                     else if (shouldFail){","                        error = new YUITest.ShouldFail();","                        failed = true;","                    } else if (shouldError){","                        error = new YUITest.ShouldError();","                        failed = true;","                    }","                               ","                } catch (thrown){","","                    //cancel any pending waits, the test already failed","                    if (testCase.__yui_wait){","                        clearTimeout(testCase.__yui_wait);","                        delete testCase.__yui_wait;","                    }                    ","                ","                    //figure out what type of error it was","                    if (thrown instanceof YUITest.AssertionError) {","                        if (!shouldFail){","                            error = thrown;","                            failed = true;","                        }","                    } else if (thrown instanceof YUITest.Wait){","                    ","                        if (typeof thrown.segment == \"function\"){","                            if (typeof thrown.delay == \"number\"){","                            ","                                //some environments don't support setTimeout","                                if (typeof setTimeout != \"undefined\"){","                                    testCase.__yui_wait = setTimeout(function(){","                                        YUITest.TestRunner._resumeTest(thrown.segment);","                                    }, thrown.delay);","                                    this._waiting = true;","                                } else {","                                    throw new Error(\"Asynchronous tests not supported in this environment.\");","                                }","                            }","                        }","                        ","                        return;","                    ","                    } else {","                        //first check to see if it should error","                        if (!shouldError) {                        ","                            error = new YUITest.UnexpectedError(thrown);","                            failed = true;","                        } else {","                            //check to see what type of data we have","                            if (typeof shouldError == \"string\"){","                                ","                                //if it's a string, check the error message","                                if (thrown.message != shouldError){","                                    error = new YUITest.UnexpectedError(thrown);","                                    failed = true;                                    ","                                }","                            } else if (typeof shouldError == \"function\"){","                            ","                                //if it's a function, see if the error is an instance of it","                                if (!(thrown instanceof shouldError)){","                                    error = new YUITest.UnexpectedError(thrown);","                                    failed = true;","                                }","                            ","                            } else if (typeof shouldError == \"object\" && shouldError !== null){","                            ","                                //if it's an object, check the instance and message","                                if (!(thrown instanceof shouldError.constructor) || ","                                        thrown.message != shouldError.message){","                                    error = new YUITest.UnexpectedError(thrown);","                                    failed = true;                                    ","                                }","                            ","                            }","                        ","                        }","                    }","                    ","                }","                ","                //fire appropriate event","                if (failed) {","                    this.fire({ type: this.TEST_FAIL_EVENT, testCase: testCase, testName: testName, error: error });","                } else {","                    this.fire({ type: this.TEST_PASS_EVENT, testCase: testCase, testName: testName });","                }","                ","                //run the tear down","                this._execNonTestMethod(node.parent, \"tearDown\", false);","                ","                //reset the assert count","                YUITest.Assert._reset();","                ","                //calculate duration","                var duration = (new Date()) - node._start;","                ","                //update results","                node.parent.results[testName] = { ","                    result: failed ? \"fail\" : \"pass\",","                    message: error ? error.getMessage() : \"Test passed\",","                    type: \"test\",","                    name: testName,","                    duration: duration","                };","                ","                if (failed){","                    node.parent.results.failed++;","                } else {","                    node.parent.results.passed++;","                }","                node.parent.results.total++;","    ","                //set timeout not supported in all environments","                if (typeof setTimeout != \"undefined\"){","                    setTimeout(function(){","                        YUITest.TestRunner._run();","                    }, 0);","                } else {","                    this._run();","                }","            ","            },","            ","            /**","             * Handles an error as if it occurred within the currently executing","             * test. This is for mock methods that may be called asynchronously","             * and therefore out of the scope of the TestRunner. Previously, this","             * error would bubble up to the browser. Now, this method is used","             * to tell TestRunner about the error. This should never be called","             * by anyplace other than the Mock object.","             * @param {Error} error The error object.","             * @return {Void}","             * @method _handleError","             * @private","             * @static","             */","            _handleError: function(error){","            ","                if (this._waiting){","                    this._resumeTest(function(){","                        throw error;","                    });","                } else {","                    throw error;","                }           ","            ","            },","                    ","            /**","             * Runs a single test based on the data provided in the node.","             * @method _runTest","             * @param {TestNode} node The TestNode representing the test to run.","             * @return {Void}","             * @static","             * @private","             */","            _runTest : function (node) {","            ","                //get relevant information","                var testName = node.testObject,","                    testCase = node.parent.testObject,","                    test = testCase[testName],","                ","                    //get the \"should\" test cases","                    shouldIgnore = testName.indexOf(\"ignore:\") === 0 ||","                                    !inGroups(testCase.groups, this._groups) ||","                                    (testCase._should.ignore || {})[testName];   //deprecated","                ","                //figure out if the test should be ignored or not","                if (shouldIgnore){","                ","                    //update results","                    node.parent.results[testName] = { ","                        result: \"ignore\",","                        message: \"Test ignored\",","                        type: \"test\",","                        name: testName.indexOf(\"ignore:\") === 0 ? testName.substring(7) : testName","                    };","                    ","                    node.parent.results.ignored++;","                    node.parent.results.total++;","                ","                    this.fire({ type: this.TEST_IGNORE_EVENT,  testCase: testCase, testName: testName });","                    ","                    //some environments don't support setTimeout","                    if (typeof setTimeout != \"undefined\"){                    ","                        setTimeout(function(){","                            YUITest.TestRunner._run();","                        }, 0);              ","                    } else {","                        this._run();","                    }","    ","                } else {","                ","                    //mark the start time","                    node._start = new Date();","                ","                    //run the setup","                    this._execNonTestMethod(node.parent, \"setUp\", false);","                    ","                    //now call the body of the test","                    this._resumeTest(test);                ","                }","    ","            },            ","","            //-------------------------------------------------------------------------","            // Misc Methods","            //-------------------------------------------------------------------------   ","","            /**","             * Retrieves the name of the current result set.","             * @return {String} The name of the result set.","             * @method getName","             */","            getName: function(){","                return this.masterSuite.name;","            },         ","","            /**","             * The name assigned to the master suite of the TestRunner. This is the name","             * that is output as the root's name when results are retrieved.","             * @param {String} name The name of the result set.","             * @return {Void}","             * @method setName","             */","            setName: function(name){","                this.masterSuite.name = name;","            },            ","            ","            //-------------------------------------------------------------------------","            // Public Methods","            //-------------------------------------------------------------------------   ","        ","            /**","             * Adds a test suite or test case to the list of test objects to run.","             * @param testObject Either a TestCase or a TestSuite that should be run.","             * @return {Void}","             * @method add","             * @static","             */","            add : function (testObject) {","                this.masterSuite.add(testObject);","                return this;","            },","            ","            /**","             * Removes all test objects from the runner.","             * @return {Void}","             * @method clear","             * @static","             */","            clear : function () {","                this.masterSuite = new YUITest.TestSuite(\"yuitests\" + (new Date()).getTime());","            },","            ","            /**","             * Indicates if the TestRunner is waiting for a test to resume","             * @return {Boolean} True if the TestRunner is waiting, false if not.","             * @method isWaiting","             * @static","             */","            isWaiting: function() {","                return this._waiting;","            },","            ","            /**","             * Indicates that the TestRunner is busy running tests and therefore can't","             * be stopped and results cannot be gathered.","             * @return {Boolean} True if the TestRunner is running, false if not.","             * @method isRunning","             */","            isRunning: function(){","                return this._running;","            },","            ","            /**","             * Returns the last complete results set from the TestRunner. Null is returned","             * if the TestRunner is running or no tests have been run.","             * @param {Function} format (Optional) A test format to return the results in.","             * @return {Object|String} Either the results object or, if a test format is ","             *      passed as the argument, a string representing the results in a specific","             *      format.","             * @method getResults","             */","            getResults: function(format){","                if (!this._running && this._lastResults){","                    if (typeof format == \"function\"){","                        return format(this._lastResults);                    ","                    } else {","                        return this._lastResults;","                    }","                } else {","                    return null;","                }","            },            ","            ","            /**","             * Returns the coverage report for the files that have been executed.","             * This returns only coverage information for files that have been","             * instrumented using YUI Test Coverage and only those that were run","             * in the same pass.","             * @param {Function} format (Optional) A coverage format to return results in.","             * @return {Object|String} Either the coverage object or, if a coverage","             *      format is specified, a string representing the results in that format.","             * @method getCoverage","             */","            getCoverage: function(format){","                if (!this._running && typeof _yuitest_coverage == \"object\"){","                    if (typeof format == \"function\"){","                        return format(_yuitest_coverage);                    ","                    } else {","                        return _yuitest_coverage;","                    }","                } else {","                    return null;","                }            ","            },","            ","            /**","             * Used to continue processing when a method marked with","             * \"async:\" is executed. This should not be used in test","             * methods, only in init(). Each argument is a string, and","             * when the returned function is executed, the arguments","             * are assigned to the context data object using the string","             * as the key name (value is the argument itself).","             * @private","             * @return {Function} A callback function.","             * @method callback","             */","            callback: function(){","                var names   = arguments,","                    data    = this._context,","                    that    = this;","                    ","                return function(){","                    for (var i=0; i < arguments.length; i++){","                        data[names[i]] = arguments[i];","                    }","                    that._run();","                };","            },","            ","            /**","             * Resumes the TestRunner after wait() was called.","             * @param {Function} segment The function to run as the rest","             *      of the haulted test.","             * @return {Void}","             * @method resume","             * @static","             */","            resume : function (segment) {","                if (this._waiting){","                    this._resumeTest(segment || function(){});","                } else {","                    throw new Error(\"resume() called without wait().\");","                }","            },","        ","            /**","             * Runs the test suite.","             * @param {Object|Boolean} options (Optional) Options for the runner:","             *      <code>oldMode</code> indicates the TestRunner should work in the YUI <= 2.8 way","             *      of internally managing test suites. <code>groups</code> is an array","             *      of test groups indicating which tests to run.","             * @return {Void}","             * @method run","             * @static","             */","            run : function (options) {","","                options = options || {};","                ","                //pointer to runner to avoid scope issues ","                var runner  = YUITest.TestRunner,","                    oldMode = options.oldMode;","                ","                ","                //if there's only one suite on the masterSuite, move it up","                if (!oldMode && this.masterSuite.items.length == 1 && this.masterSuite.items[0] instanceof YUITest.TestSuite){","                    this.masterSuite = this.masterSuite.items[0];","                }                ","                ","                //determine if there are any groups to filter on","                runner._groups = (options.groups instanceof Array) ? \",\" + options.groups.join(\",\") + \",\" : \"\";","                ","                //initialize the runner","                runner._buildTestTree();","                runner._context = {};","                runner._root._start = new Date();","                ","                //fire the begin event","                runner.fire(runner.BEGIN_EVENT);","           ","                //begin the testing","                runner._run();","            }    ","        });","        ","        return new TestRunner();","        ","    }();","","/**"," * The ArrayAssert object provides functions to test JavaScript array objects"," * for a variety of cases."," * @namespace Test"," * @module test"," * @class ArrayAssert"," * @static"," */"," ","YUITest.ArrayAssert = {","","    //=========================================================================","    // Private methods","    //=========================================================================","    ","    /**","     * Simple indexOf() implementation for an array. Defers to native","     * if available.","     * @param {Array} haystack The array to search.","     * @param {Variant} needle The value to locate.","     * @return {int} The index of the needle if found or -1 if not.","     * @method _indexOf","     * @private","     */","    _indexOf: function(haystack, needle){","        if (haystack.indexOf){","            return haystack.indexOf(needle);","        } else {","            for (var i=0; i < haystack.length; i++){","                if (haystack[i] === needle){","                    return i;","                }","            }","            return -1;","        }","    },","    ","    /**","     * Simple some() implementation for an array. Defers to native","     * if available.","     * @param {Array} haystack The array to search.","     * @param {Function} matcher The function to run on each value.","     * @return {Boolean} True if any value, when run through the matcher,","     *      returns true.","     * @method _some","     * @private","     */","    _some: function(haystack, matcher){","        if (haystack.some){","            return haystack.some(matcher);","        } else {","            for (var i=0; i < haystack.length; i++){","                if (matcher(haystack[i])){","                    return true;","                }","            }","            return false;","        }","    },    ","","    /**","     * Asserts that a value is present in an array. This uses the triple equals ","     * sign so no type coercion may occur.","     * @param {Object} needle The value that is expected in the array.","     * @param {Array} haystack An array of values.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method contains","     * @static","     */","    contains : function (needle, haystack, ","                           message) {","        ","        YUITest.Assert._increment();               ","","        if (this._indexOf(haystack, needle) == -1){","            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Value \" + needle + \" (\" + (typeof needle) + \") not found in array [\" + haystack + \"].\"));","        }","    },","","    /**","     * Asserts that a set of values are present in an array. This uses the triple equals ","     * sign so no type coercion may occur. For this assertion to pass, all values must","     * be found.","     * @param {Object[]} needles An array of values that are expected in the array.","     * @param {Array} haystack An array of values to check.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method containsItems","     * @static","     */","    containsItems : function (needles, haystack, ","                           message) {","        YUITest.Assert._increment();               ","","        //begin checking values","        for (var i=0; i < needles.length; i++){","            if (this._indexOf(haystack, needles[i]) == -1){","                YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Value \" + needles[i] + \" (\" + (typeof needles[i]) + \") not found in array [\" + haystack + \"].\"));","            }","        }","    },","","    /**","     * Asserts that a value matching some condition is present in an array. This uses","     * a function to determine a match.","     * @param {Function} matcher A function that returns true if the items matches or false if not.","     * @param {Array} haystack An array of values.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method containsMatch","     * @static","     */","    containsMatch : function (matcher, haystack, ","                           message) {","        ","        YUITest.Assert._increment();               ","        //check for valid matcher","        if (typeof matcher != \"function\"){","            throw new TypeError(\"ArrayAssert.containsMatch(): First argument must be a function.\");","        }","        ","        if (!this._some(haystack, matcher)){","            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"No match found in array [\" + haystack + \"].\"));","        }","    },","","    /**","     * Asserts that a value is not present in an array. This uses the triple equals ","     * Asserts that a value is not present in an array. This uses the triple equals ","     * sign so no type coercion may occur.","     * @param {Object} needle The value that is expected in the array.","     * @param {Array} haystack An array of values.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method doesNotContain","     * @static","     */","    doesNotContain : function (needle, haystack, ","                           message) {","        ","        YUITest.Assert._increment();               ","","        if (this._indexOf(haystack, needle) > -1){","            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Value found in array [\" + haystack + \"].\"));","        }","    },","","    /**","     * Asserts that a set of values are not present in an array. This uses the triple equals ","     * sign so no type coercion may occur. For this assertion to pass, all values must","     * not be found.","     * @param {Object[]} needles An array of values that are not expected in the array.","     * @param {Array} haystack An array of values to check.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method doesNotContainItems","     * @static","     */","    doesNotContainItems : function (needles, haystack, ","                           message) {","","        YUITest.Assert._increment();               ","","        for (var i=0; i < needles.length; i++){","            if (this._indexOf(haystack, needles[i]) > -1){","                YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Value found in array [\" + haystack + \"].\"));","            }","        }","","    },","        ","    /**","     * Asserts that no values matching a condition are present in an array. This uses","     * a function to determine a match.","     * @param {Function} matcher A function that returns true if the item matches or false if not.","     * @param {Array} haystack An array of values.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method doesNotContainMatch","     * @static","     */","    doesNotContainMatch : function (matcher, haystack, ","                           message) {","        ","        YUITest.Assert._increment();     ","      ","        //check for valid matcher","        if (typeof matcher != \"function\"){","            throw new TypeError(\"ArrayAssert.doesNotContainMatch(): First argument must be a function.\");","        }","        ","        if (this._some(haystack, matcher)){","            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Value found in array [\" + haystack + \"].\"));","        }","    },","        ","    /**","     * Asserts that the given value is contained in an array at the specified index.","     * This uses the triple equals sign so no type coercion will occur.","     * @param {Object} needle The value to look for.","     * @param {Array} haystack The array to search in.","     * @param {int} index The index at which the value should exist.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method indexOf","     * @static","     */","    indexOf : function (needle, haystack, index, message) {","    ","        YUITest.Assert._increment();     ","","        //try to find the value in the array","        for (var i=0; i < haystack.length; i++){","            if (haystack[i] === needle){","                if (index != i){","                    YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Value exists at index \" + i + \" but should be at index \" + index + \".\"));                    ","                }","                return;","            }","        }","        ","        //if it makes it here, it wasn't found at all","        YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Value doesn't exist in array [\" + haystack + \"].\"));","    },","        ","    /**","     * Asserts that the values in an array are equal, and in the same position,","     * as values in another array. This uses the double equals sign","     * so type coercion may occur. Note that the array objects themselves","     * need not be the same for this test to pass.","     * @param {Array} expected An array of the expected values.","     * @param {Array} actual Any array of the actual values.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method itemsAreEqual","     * @static","     */","    itemsAreEqual : function (expected, actual, ","                           message) {","        ","        YUITest.Assert._increment();     ","        ","        //first make sure they're array-like (this can probably be improved)","        if (typeof expected != \"object\" || typeof actual != \"object\"){","            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Value should be an array.\"));","        }","        ","        //next check array length","        if (expected.length != actual.length){","            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Array should have a length of \" + expected.length + \" but has a length of \" + actual.length + \".\"));","        }","       ","        //begin checking values","        for (var i=0; i < expected.length; i++){","            if (expected[i] != actual[i]){","                throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, \"Values in position \" + i + \" are not equal.\"), expected[i], actual[i]);","            }","        }","    },","    ","    /**","     * Asserts that the values in an array are equivalent, and in the same position,","     * as values in another array. This uses a function to determine if the values","     * are equivalent. Note that the array objects themselves","     * need not be the same for this test to pass.","     * @param {Array} expected An array of the expected values.","     * @param {Array} actual Any array of the actual values.","     * @param {Function} comparator A function that returns true if the values are equivalent","     *      or false if not.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @return {Void}","     * @method itemsAreEquivalent","     * @static","     */","    itemsAreEquivalent : function (expected, actual, ","                           comparator, message) {","        ","        YUITest.Assert._increment();     ","","        //make sure the comparator is valid","        if (typeof comparator != \"function\"){","            throw new TypeError(\"ArrayAssert.itemsAreEquivalent(): Third argument must be a function.\");","        }","        ","        //first check array length","        if (expected.length != actual.length){","            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Array should have a length of \" + expected.length + \" but has a length of \" + actual.length));","        }","        ","        //begin checking values","        for (var i=0; i < expected.length; i++){","            if (!comparator(expected[i], actual[i])){","                throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, \"Values in position \" + i + \" are not equivalent.\"), expected[i], actual[i]);","            }","        }","    },","    ","    /**","     * Asserts that an array is empty.","     * @param {Array} actual The array to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isEmpty","     * @static","     */","    isEmpty : function (actual, message) {        ","        YUITest.Assert._increment();     ","        if (actual.length > 0){","            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Array should be empty.\"));","        }","    },    ","    ","    /**","     * Asserts that an array is not empty.","     * @param {Array} actual The array to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isNotEmpty","     * @static","     */","    isNotEmpty : function (actual, message) {        ","        YUITest.Assert._increment();     ","        if (actual.length === 0){","            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Array should not be empty.\"));","        }","    },    ","    ","    /**","     * Asserts that the values in an array are the same, and in the same position,","     * as values in another array. This uses the triple equals sign","     * so no type coercion will occur. Note that the array objects themselves","     * need not be the same for this test to pass.","     * @param {Array} expected An array of the expected values.","     * @param {Array} actual Any array of the actual values.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method itemsAreSame","     * @static","     */","    itemsAreSame : function (expected, actual, ","                          message) {","        ","        YUITest.Assert._increment();     ","","        //first check array length","        if (expected.length != actual.length){","            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Array should have a length of \" + expected.length + \" but has a length of \" + actual.length));","        }","                    ","        //begin checking values","        for (var i=0; i < expected.length; i++){","            if (expected[i] !== actual[i]){","                throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, \"Values in position \" + i + \" are not the same.\"), expected[i], actual[i]);","            }","        }","    },","    ","    /**","     * Asserts that the given value is contained in an array at the specified index,","     * starting from the back of the array.","     * This uses the triple equals sign so no type coercion will occur.","     * @param {Object} needle The value to look for.","     * @param {Array} haystack The array to search in.","     * @param {int} index The index at which the value should exist.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method lastIndexOf","     * @static","     */","    lastIndexOf : function (needle, haystack, index, message) {","    ","        //try to find the value in the array","        for (var i=haystack.length; i >= 0; i--){","            if (haystack[i] === needle){","                if (index != i){","                    YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Value exists at index \" + i + \" but should be at index \" + index + \".\"));                    ","                }","                return;","            }","        }","        ","        //if it makes it here, it wasn't found at all","        YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Value doesn't exist in array.\"));        ","    }","    ","};","  ","/**"," * The Assert object provides functions to test JavaScript values against"," * known and expected results. Whenever a comparison (assertion) fails,"," * an error is thrown."," * @namespace Test"," * @module test"," * @class Assert"," * @static"," */","YUITest.Assert = {","","    /**","     * The number of assertions performed.","     * @property _asserts","     * @type int","     * @private","     */","    _asserts: 0,","","    //-------------------------------------------------------------------------","    // Helper Methods","    //-------------------------------------------------------------------------","    ","    /**","     * Formats a message so that it can contain the original assertion message","     * in addition to the custom message.","     * @param {String} customMessage The message passed in by the developer.","     * @param {String} defaultMessage The message created by the error by default.","     * @return {String} The final error message, containing either or both.","     * @protected","     * @static","     * @method _formatMessage","     */","    _formatMessage : function (customMessage, defaultMessage) {","        if (typeof customMessage == \"string\" && customMessage.length > 0){","            return customMessage.replace(\"{message}\", defaultMessage);","        } else {","            return defaultMessage;","        }        ","    },","    ","    /**","     * Returns the number of assertions that have been performed.","     * @method _getCount","     * @protected","     * @static","     */","    _getCount: function(){","        return this._asserts;","    },","    ","    /**","     * Increments the number of assertions that have been performed.","     * @method _increment","     * @protected","     * @static","     */","    _increment: function(){","        this._asserts++;","    },","    ","    /**","     * Resets the number of assertions that have been performed to 0.","     * @method _reset","     * @protected","     * @static","     */","    _reset: function(){","        this._asserts = 0;","    },","    ","    //-------------------------------------------------------------------------","    // Generic Assertion Methods","    //-------------------------------------------------------------------------","    ","    /** ","     * Forces an assertion error to occur.","     * @param {String} message (Optional) The message to display with the failure.","     * @method fail","     * @static","     */","    fail : function (message) {","        throw new YUITest.AssertionError(YUITest.Assert._formatMessage(message, \"Test force-failed.\"));","    },       ","    ","    /** ","     * A marker that the test should pass.","     * @method pass","     * @static","     */","    pass : function (message) {","        YUITest.Assert._increment();","    },       ","    ","    //-------------------------------------------------------------------------","    // Equality Assertion Methods","    //-------------------------------------------------------------------------    ","    ","    /**","     * Asserts that a value is equal to another. This uses the double equals sign","     * so type coercion may occur.","     * @param {Object} expected The expected value.","     * @param {Object} actual The actual value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method areEqual","     * @static","     */","    areEqual : function (expected, actual, message) {","        YUITest.Assert._increment();","        if (expected != actual) {","            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, \"Values should be equal.\"), expected, actual);","        }","    },","    ","    /**","     * Asserts that a value is not equal to another. This uses the double equals sign","     * so type coercion may occur.","     * @param {Object} unexpected The unexpected value.","     * @param {Object} actual The actual value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method areNotEqual","     * @static","     */","    areNotEqual : function (unexpected, actual, ","                         message) {","        YUITest.Assert._increment();","        if (unexpected == actual) {","            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, \"Values should not be equal.\"), unexpected);","        }","    },","    ","    /**","     * Asserts that a value is not the same as another. This uses the triple equals sign","     * so no type coercion may occur.","     * @param {Object} unexpected The unexpected value.","     * @param {Object} actual The actual value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method areNotSame","     * @static","     */","    areNotSame : function (unexpected, actual, message) {","        YUITest.Assert._increment();","        if (unexpected === actual) {","            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, \"Values should not be the same.\"), unexpected);","        }","    },","","    /**","     * Asserts that a value is the same as another. This uses the triple equals sign","     * so no type coercion may occur.","     * @param {Object} expected The expected value.","     * @param {Object} actual The actual value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method areSame","     * @static","     */","    areSame : function (expected, actual, message) {","        YUITest.Assert._increment();","        if (expected !== actual) {","            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, \"Values should be the same.\"), expected, actual);","        }","    },    ","    ","    //-------------------------------------------------------------------------","    // Boolean Assertion Methods","    //-------------------------------------------------------------------------    ","    ","    /**","     * Asserts that a value is false. This uses the triple equals sign","     * so no type coercion may occur.","     * @param {Object} actual The actual value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isFalse","     * @static","     */","    isFalse : function (actual, message) {","        YUITest.Assert._increment();","        if (false !== actual) {","            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, \"Value should be false.\"), false, actual);","        }","    },","    ","    /**","     * Asserts that a value is true. This uses the triple equals sign","     * so no type coercion may occur.","     * @param {Object} actual The actual value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isTrue","     * @static","     */","    isTrue : function (actual, message) {","        YUITest.Assert._increment();","        if (true !== actual) {","            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, \"Value should be true.\"), true, actual);","        }","","    },","    ","    //-------------------------------------------------------------------------","    // Special Value Assertion Methods","    //-------------------------------------------------------------------------    ","    ","    /**","     * Asserts that a value is not a number.","     * @param {Object} actual The value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isNaN","     * @static","     */","    isNaN : function (actual, message){","        YUITest.Assert._increment();","        if (!isNaN(actual)){","            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, \"Value should be NaN.\"), NaN, actual);","        }    ","    },","    ","    /**","     * Asserts that a value is not the special NaN value.","     * @param {Object} actual The value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isNotNaN","     * @static","     */","    isNotNaN : function (actual, message){","        YUITest.Assert._increment();","        if (isNaN(actual)){","            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, \"Values should not be NaN.\"), NaN);","        }    ","    },","    ","    /**","     * Asserts that a value is not null. This uses the triple equals sign","     * so no type coercion may occur.","     * @param {Object} actual The actual value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isNotNull","     * @static","     */","    isNotNull : function (actual, message) {","        YUITest.Assert._increment();","        if (actual === null) {","            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, \"Values should not be null.\"), null);","        }","    },","","    /**","     * Asserts that a value is not undefined. This uses the triple equals sign","     * so no type coercion may occur.","     * @param {Object} actual The actual value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isNotUndefined","     * @static","     */","    isNotUndefined : function (actual, message) {","        YUITest.Assert._increment();","        if (typeof actual == \"undefined\") {","            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, \"Value should not be undefined.\"), undefined);","        }","    },","","    /**","     * Asserts that a value is null. This uses the triple equals sign","     * so no type coercion may occur.","     * @param {Object} actual The actual value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isNull","     * @static","     */","    isNull : function (actual, message) {","        YUITest.Assert._increment();","        if (actual !== null) {","            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, \"Value should be null.\"), null, actual);","        }","    },","        ","    /**","     * Asserts that a value is undefined. This uses the triple equals sign","     * so no type coercion may occur.","     * @param {Object} actual The actual value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isUndefined","     * @static","     */","    isUndefined : function (actual, message) {","        YUITest.Assert._increment();","        if (typeof actual != \"undefined\") {","            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, \"Value should be undefined.\"), undefined, actual);","        }","    },    ","    ","    //--------------------------------------------------------------------------","    // Instance Assertion Methods","    //--------------------------------------------------------------------------    ","   ","    /**","     * Asserts that a value is an array.","     * @param {Object} actual The value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isArray","     * @static","     */","    isArray : function (actual, message) {","        YUITest.Assert._increment();","        var shouldFail = false;","        if (Array.isArray){","            shouldFail = !Array.isArray(actual);","        } else {","            shouldFail = Object.prototype.toString.call(actual) != \"[object Array]\";","        }","        if (shouldFail){","            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, \"Value should be an array.\"), actual);","        }    ","    },","   ","    /**","     * Asserts that a value is a Boolean.","     * @param {Object} actual The value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isBoolean","     * @static","     */","    isBoolean : function (actual, message) {","        YUITest.Assert._increment();","        if (typeof actual != \"boolean\"){","            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, \"Value should be a Boolean.\"), actual);","        }    ","    },","   ","    /**","     * Asserts that a value is a function.","     * @param {Object} actual The value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isFunction","     * @static","     */","    isFunction : function (actual, message) {","        YUITest.Assert._increment();","        if (!(actual instanceof Function)){","            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, \"Value should be a function.\"), actual);","        }    ","    },","   ","    /**","     * Asserts that a value is an instance of a particular object. This may return","     * incorrect results when comparing objects from one frame to constructors in","     * another frame. For best results, don't use in a cross-frame manner.","     * @param {Function} expected The function that the object should be an instance of.","     * @param {Object} actual The object to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isInstanceOf","     * @static","     */","    isInstanceOf : function (expected, actual, message) {","        YUITest.Assert._increment();","        if (!(actual instanceof expected)){","            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, \"Value isn't an instance of expected type.\"), expected, actual);","        }","    },","    ","    /**","     * Asserts that a value is a number.","     * @param {Object} actual The value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isNumber","     * @static","     */","    isNumber : function (actual, message) {","        YUITest.Assert._increment();","        if (typeof actual != \"number\"){","            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, \"Value should be a number.\"), actual);","        }    ","    },    ","    ","    /**","     * Asserts that a value is an object.","     * @param {Object} actual The value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isObject","     * @static","     */","    isObject : function (actual, message) {","        YUITest.Assert._increment();","        if (!actual || (typeof actual != \"object\" && typeof actual != \"function\")){","            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, \"Value should be an object.\"), actual);","        }","    },","    ","    /**","     * Asserts that a value is a string.","     * @param {Object} actual The value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isString","     * @static","     */","    isString : function (actual, message) {","        YUITest.Assert._increment();","        if (typeof actual != \"string\"){","            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, \"Value should be a string.\"), actual);","        }","    },","    ","    /**","     * Asserts that a value is of a particular type. ","     * @param {String} expectedType The expected type of the variable.","     * @param {Object} actualValue The actual value to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method isTypeOf","     * @static","     */","    isTypeOf : function (expectedType, actualValue, message){","        YUITest.Assert._increment();","        if (typeof actualValue != expectedType){","            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, \"Value should be of type \" + expectedType + \".\"), expectedType, typeof actualValue);","        }","    },","    ","    //--------------------------------------------------------------------------","    // Error Detection Methods","    //--------------------------------------------------------------------------    ","   ","    /**","     * Asserts that executing a particular method should throw an error of","     * a specific type. This is a replacement for _should.error.","     * @param {String|Function|Object} expectedError If a string, this","     *      is the error message that the error must have; if a function, this","     *      is the constructor that should have been used to create the thrown","     *      error; if an object, this is an instance of a particular error type","     *      with a specific error message (both must match).","     * @param {Function} method The method to execute that should throw the error.","     * @param {String} message (Optional) The message to display if the assertion","     *      fails.","     * @method throwsError","     * @return {void}","     * @static","     */","    throwsError: function(expectedError, method, message){","        YUITest.Assert._increment();","        var error = false;","    ","        try {","            method();        ","        } catch (thrown) {","            ","            //check to see what type of data we have","            if (typeof expectedError == \"string\"){","                ","                //if it's a string, check the error message","                if (thrown.message != expectedError){","                    error = true;","                }","            } else if (typeof expectedError == \"function\"){","            ","                //if it's a function, see if the error is an instance of it","                if (!(thrown instanceof expectedError)){","                    error = true;","                }","            ","            } else if (typeof expectedError == \"object\" && expectedError !== null){","            ","                //if it's an object, check the instance and message","                if (!(thrown instanceof expectedError.constructor) || ","                        thrown.message != expectedError.message){","                    error = true;","                }","            ","            } else { //if it gets here, the argument could be wrong","                error = true;","            }","            ","            if (error){","                throw new YUITest.UnexpectedError(thrown);                    ","            } else {","                return;","            }","        }","        ","        //if it reaches here, the error wasn't thrown, which is a bad thing","        throw new YUITest.AssertionError(YUITest.Assert._formatMessage(message, \"Error should have been thrown.\"));","    }","","};","/**"," * Error is thrown whenever an assertion fails. It provides methods"," * to more easily get at error information and also provides a base class"," * from which more specific assertion errors can be derived."," *"," * @param {String} message The message to display when the error occurs."," * @namespace Test"," * @module test"," * @class AssertionError"," * @constructor"," */ ","YUITest.AssertionError = function (message){","    ","    /**","     * Error message. Must be duplicated to ensure browser receives it.","     * @type String","     * @property message","     */","    this.message = message;","    ","    /**","     * The name of the error that occurred.","     * @type String","     * @property name","     */","    this.name = \"Assert Error\";","};","","YUITest.AssertionError.prototype = {","","    //restore constructor","    constructor: YUITest.AssertionError,","","    /**","     * Returns a fully formatted error for an assertion failure. This should","     * be overridden by all subclasses to provide specific information.","     * @method getMessage","     * @return {String} A string describing the error.","     */","    getMessage : function () {","        return this.message;","    },","    ","    /**","     * Returns a string representation of the error.","     * @method toString","     * @return {String} A string representation of the error.","     */","    toString : function () {","        return this.name + \": \" + this.getMessage();","    }","","};","/**"," * ComparisonFailure is subclass of Error that is thrown whenever"," * a comparison between two values fails. It provides mechanisms to retrieve"," * both the expected and actual value."," *"," * @param {String} message The message to display when the error occurs."," * @param {Object} expected The expected value."," * @param {Object} actual The actual value that caused the assertion to fail."," * @namespace Test "," * @extends AssertionError"," * @module test"," * @class ComparisonFailure"," * @constructor"," */ ","YUITest.ComparisonFailure = function (message, expected, actual){","","    //call superclass","    YUITest.AssertionError.call(this, message);","    ","    /**","     * The expected value.","     * @type Object","     * @property expected","     */","    this.expected = expected;","    ","    /**","     * The actual value.","     * @type Object","     * @property actual","     */","    this.actual = actual;","    ","    /**","     * The name of the error that occurred.","     * @type String","     * @property name","     */","    this.name = \"ComparisonFailure\";","    ","};","","//inherit from YUITest.AssertionError","YUITest.ComparisonFailure.prototype = new YUITest.AssertionError;","","//restore constructor","YUITest.ComparisonFailure.prototype.constructor = YUITest.ComparisonFailure;","","/**"," * Returns a fully formatted error for an assertion failure. This message"," * provides information about the expected and actual values."," * @method getMessage"," * @return {String} A string describing the error."," */","YUITest.ComparisonFailure.prototype.getMessage = function(){","    return this.message + \"\\nExpected: \" + this.expected + \" (\" + (typeof this.expected) + \")\"  +","            \"\\nActual: \" + this.actual + \" (\" + (typeof this.actual) + \")\";","};","/**"," * An object object containing coverage result formatting methods."," * @namespace Test"," * @module test"," * @class CoverageFormat"," * @static"," */","YUITest.CoverageFormat = {","","    /**","     * Returns the coverage report in JSON format. This is the straight","     * JSON representation of the native coverage report.","     * @param {Object} coverage The coverage report object.","     * @return {String} A JSON-formatted string of coverage data.","     * @method JSON","     * @namespace Test.CoverageFormat","     */","    JSON: function(coverage){","        return YUITest.Util.JSON.stringify(coverage);","    },","    ","    /**","     * Returns the coverage report in a JSON format compatible with","     * Xdebug. See <a href=\"http://www.xdebug.com/docs/code_coverage\">Xdebug Documentation</a>","     * for more information. Note: function coverage is not available","     * in this format.","     * @param {Object} coverage The coverage report object.","     * @return {String} A JSON-formatted string of coverage data.","     * @method XdebugJSON","     * @namespace Test.CoverageFormat","     */    ","    XdebugJSON: function(coverage){","    ","        var report = {};","        for (var prop in coverage){","            if (coverage.hasOwnProperty(prop)){","                report[prop] = coverage[prop].lines;","            }","        }","","        return YUITest.Util.JSON.stringify(coverage);","    }","","};","","","/**"," * The DateAssert object provides functions to test JavaScript Date objects"," * for a variety of cases."," * @namespace Test"," * @module test"," * @class DateAssert"," * @static"," */"," ","YUITest.DateAssert = {","","    /**","     * Asserts that a date's month, day, and year are equal to another date's.","     * @param {Date} expected The expected date.","     * @param {Date} actual The actual date to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method datesAreEqual","     * @static","     */","    datesAreEqual : function (expected, actual, message){","        YUITest.Assert._increment();        ","        if (expected instanceof Date && actual instanceof Date){","            var msg = \"\";","            ","            //check years first","            if (expected.getFullYear() != actual.getFullYear()){","                msg = \"Years should be equal.\";","            }","            ","            //now check months","            if (expected.getMonth() != actual.getMonth()){","                msg = \"Months should be equal.\";","            }                ","            ","            //last, check the day of the month","            if (expected.getDate() != actual.getDate()){","                msg = \"Days of month should be equal.\";","            }                ","            ","            if (msg.length){","                throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, msg), expected, actual);","            }","        } else {","            throw new TypeError(\"YUITest.DateAssert.datesAreEqual(): Expected and actual values must be Date objects.\");","        }","    },","","    /**","     * Asserts that a date's hour, minutes, and seconds are equal to another date's.","     * @param {Date} expected The expected date.","     * @param {Date} actual The actual date to test.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method timesAreEqual","     * @static","     */","    timesAreEqual : function (expected, actual, message){","        YUITest.Assert._increment();","        if (expected instanceof Date && actual instanceof Date){","            var msg = \"\";","            ","            //check hours first","            if (expected.getHours() != actual.getHours()){","                msg = \"Hours should be equal.\";","            }","            ","            //now check minutes","            if (expected.getMinutes() != actual.getMinutes()){","                msg = \"Minutes should be equal.\";","            }                ","            ","            //last, check the seconds","            if (expected.getSeconds() != actual.getSeconds()){","                msg = \"Seconds should be equal.\";","            }                ","            ","            if (msg.length){","                throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, msg), expected, actual);","            }","        } else {","            throw new TypeError(\"YUITest.DateAssert.timesAreEqual(): Expected and actual values must be Date objects.\");","        }","    }","    ","};","/**"," * Creates a new mock object."," * @namespace Test"," * @module test"," * @class Mock"," * @constructor"," * @param {Object} template (Optional) An object whose methods"," *      should be stubbed out on the mock object."," */","YUITest.Mock = function(template){","","    //use blank object is nothing is passed in","    template = template || {};","    ","    var mock,","        name;","    ","    //try to create mock that keeps prototype chain intact","    //fails in the case of ActiveX objects","    try {","        function f(){}","        f.prototype = template;","        mock = new f();","    } catch (ex) {","        mock = {};","    }","","    //create stubs for all methods","    for (name in template){","        if (template.hasOwnProperty(name)){","            if (typeof template[name] == \"function\"){","                mock[name] = function(name){","                    return function(){","                        YUITest.Assert.fail(\"Method \" + name + \"() was called but was not expected to be.\");","                    };","                }(name);","            }","        }","    }","","    //return it","    return mock;    ","};","    ","/**"," * Assigns an expectation to a mock object. This is used to create"," * methods and properties on the mock object that are monitored for"," * calls and changes, respectively."," * @param {Object} mock The object to add the expectation to."," * @param {Object} expectation An object defining the expectation. For"," *      properties, the keys \"property\" and \"value\" are required. For a"," *      method the \"method\" key defines the method's name, the optional \"args\""," *      key provides an array of argument types. The \"returns\" key provides"," *      an optional return value. An optional \"run\" key provides a function"," *      to be used as the method body. The return value of a mocked method is"," *      determined first by the \"returns\" key, then the \"run\" function's return"," *      value. If neither \"returns\" nor \"run\" is provided undefined is returned."," *      An optional 'error' key defines an error type to be thrown in all cases."," *      The \"callCount\" key provides an optional number of times the method is"," *      expected to be called (the default is 1)."," * @return {void}"," * @method expect"," * @static"," */ ","YUITest.Mock.expect = function(mock /*:Object*/, expectation /*:Object*/){","","    //make sure there's a place to store the expectations","    if (!mock.__expectations) {","        mock.__expectations = {};","    }","","    //method expectation","    if (expectation.method){","        var name = expectation.method,","            args = expectation.args || [],","            result = expectation.returns,","            callCount = (typeof expectation.callCount == \"number\") ? expectation.callCount : 1,","            error = expectation.error,","            run = expectation.run || function(){},","            runResult,","            i;","","        //save expectations","        mock.__expectations[name] = expectation;","        expectation.callCount = callCount;","        expectation.actualCallCount = 0;","            ","        //process arguments","        for (i=0; i < args.length; i++){","             if (!(args[i] instanceof YUITest.Mock.Value)){","                args[i] = YUITest.Mock.Value(YUITest.Assert.areSame, [args[i]], \"Argument \" + i + \" of \" + name + \"() is incorrect.\");","            }       ","        }","    ","        //if the method is expected to be called","        if (callCount > 0){","            mock[name] = function(){   ","                try {","                    expectation.actualCallCount++;","                    YUITest.Assert.areEqual(args.length, arguments.length, \"Method \" + name + \"() passed incorrect number of arguments.\");","                    for (var i=0, len=args.length; i < len; i++){","                        args[i].verify(arguments[i]);","                    }                ","","                    runResult = run.apply(this, arguments);","                    ","                    if (error){","                        throw error;","                    }","                } catch (ex){","                    //route through TestRunner for proper handling","                    YUITest.TestRunner._handleError(ex);","                }","","                // Any value provided for 'returns' overrides any value returned","                // by our 'run' function. ","                return expectation.hasOwnProperty('returns') ? result : runResult;","            };","        } else {","        ","            //method should fail if called when not expected","            mock[name] = function(){","                try {","                    YUITest.Assert.fail(\"Method \" + name + \"() should not have been called.\");","                } catch (ex){","                    //route through TestRunner for proper handling","                    YUITest.TestRunner._handleError(ex);","                }                    ","            };","        }","    } else if (expectation.property){","        //save expectations","        mock.__expectations[expectation.property] = expectation;","    }","};","","/**"," * Verifies that all expectations of a mock object have been met and"," * throws an assertion error if not."," * @param {Object} mock The object to verify.."," * @return {void}"," * @method verify"," * @static"," */ ","YUITest.Mock.verify = function(mock){    ","    try {","    ","        for (var name in mock.__expectations){","            if (mock.__expectations.hasOwnProperty(name)){","                var expectation = mock.__expectations[name];","                if (expectation.method) {","                    YUITest.Assert.areEqual(expectation.callCount, expectation.actualCallCount, \"Method \" + expectation.method + \"() wasn't called the expected number of times.\");","                } else if (expectation.property){","                    YUITest.Assert.areEqual(expectation.value, mock[expectation.property], \"Property \" + expectation.property + \" wasn't set to the correct value.\"); ","                }                ","            }","        }","","    } catch (ex){","        //route through TestRunner for proper handling","        YUITest.TestRunner._handleError(ex);","    }","};","","/**"," * Creates a new value matcher."," * @param {Function} method The function to call on the value."," * @param {Array} originalArgs (Optional) Array of arguments to pass to the method."," * @param {String} message (Optional) Message to display in case of failure."," * @namespace Test.Mock"," * @module test"," * @class Value"," * @constructor"," */","YUITest.Mock.Value = function(method, originalArgs, message){","    if (this instanceof YUITest.Mock.Value){","        this.verify = function(value){","            var args = [].concat(originalArgs || []);","            args.push(value);","            args.push(message);","            method.apply(null, args);","        };","    } else {","        return new YUITest.Mock.Value(method, originalArgs, message);","    }","};","","/**"," * Predefined matcher to match any value."," * @property Any"," * @static"," * @type Function"," */","YUITest.Mock.Value.Any        = YUITest.Mock.Value(function(){});","","/**"," * Predefined matcher to match boolean values."," * @property Boolean"," * @static"," * @type Function"," */","YUITest.Mock.Value.Boolean    = YUITest.Mock.Value(YUITest.Assert.isBoolean);","","/**"," * Predefined matcher to match number values."," * @property Number"," * @static"," * @type Function"," */","YUITest.Mock.Value.Number     = YUITest.Mock.Value(YUITest.Assert.isNumber);","","/**"," * Predefined matcher to match string values."," * @property String"," * @static"," * @type Function"," */","YUITest.Mock.Value.String     = YUITest.Mock.Value(YUITest.Assert.isString);","","/**"," * Predefined matcher to match object values."," * @property Object"," * @static"," * @type Function"," */","YUITest.Mock.Value.Object     = YUITest.Mock.Value(YUITest.Assert.isObject);","","/**"," * Predefined matcher to match function values."," * @property Function"," * @static"," * @type Function"," */","YUITest.Mock.Value.Function   = YUITest.Mock.Value(YUITest.Assert.isFunction);","","/**"," * The ObjectAssert object provides functions to test JavaScript objects"," * for a variety of cases."," * @namespace Test"," * @module test"," * @class ObjectAssert"," * @static"," */","YUITest.ObjectAssert = {","","    /**","     * Asserts that an object has all of the same properties","     * and property values as the other.","     * @param {Object} expected The object with all expected properties and values.","     * @param {Object} actual The object to inspect.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method areEqual","     * @static","     * @deprecated","     */","    areEqual: function(expected, actual, message) {","        YUITest.Assert._increment();         ","        ","        var expectedKeys = YUITest.Object.keys(expected),","            actualKeys = YUITest.Object.keys(actual);","        ","        //first check keys array length","        if (expectedKeys.length != actualKeys.length){","            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Object should have \" + expectedKeys.length + \" keys but has \" + actualKeys.length));","        }","        ","        //then check values","        for (var name in expected){","            if (expected.hasOwnProperty(name)){","                if (expected[name] != actual[name]){","                    throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, \"Values should be equal for property \" + name), expected[name], actual[name]);","                }            ","            }","        }           ","    },","    ","    /**","     * Asserts that an object has a property with the given name.","     * @param {String} propertyName The name of the property to test.","     * @param {Object} object The object to search.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method hasKey","     * @static","     * @deprecated Use ownsOrInheritsKey() instead","     */    ","    hasKey: function (propertyName, object, message) {","        YUITest.ObjectAssert.ownsOrInheritsKey(propertyName, object, message);   ","    },","    ","    /**","     * Asserts that an object has all properties of a reference object.","     * @param {Array} properties An array of property names that should be on the object.","     * @param {Object} object The object to search.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method hasKeys","     * @static","     * @deprecated Use ownsOrInheritsKeys() instead","     */    ","    hasKeys: function (properties, object, message) {","        YUITest.ObjectAssert.ownsOrInheritsKeys(properties, object, message);","    },","    ","    /**","     * Asserts that a property with the given name exists on an object's prototype.","     * @param {String} propertyName The name of the property to test.","     * @param {Object} object The object to search.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method inheritsKey","     * @static","     */    ","    inheritsKey: function (propertyName, object, message) {","        YUITest.Assert._increment();               ","        if (!(propertyName in object && !object.hasOwnProperty(propertyName))){","            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Property '\" + propertyName + \"' not found on object instance.\"));","        }     ","    },","    ","    /**","     * Asserts that all properties exist on an object prototype.","     * @param {Array} properties An array of property names that should be on the object.","     * @param {Object} object The object to search.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method inheritsKeys","     * @static","     */    ","    inheritsKeys: function (properties, object, message) {","        YUITest.Assert._increment();        ","        for (var i=0; i < properties.length; i++){","            if (!(propertyName in object && !object.hasOwnProperty(properties[i]))){","                YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Property '\" + properties[i] + \"' not found on object instance.\"));","            }      ","        }","    },","    ","    /**","     * Asserts that a property with the given name exists on an object instance (not on its prototype).","     * @param {String} propertyName The name of the property to test.","     * @param {Object} object The object to search.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method ownsKey","     * @static","     */    ","    ownsKey: function (propertyName, object, message) {","        YUITest.Assert._increment();               ","        if (!object.hasOwnProperty(propertyName)){","            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Property '\" + propertyName + \"' not found on object instance.\"));","        }     ","    },","    ","    /**","     * Asserts that all properties exist on an object instance (not on its prototype).","     * @param {Array} properties An array of property names that should be on the object.","     * @param {Object} object The object to search.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method ownsKeys","     * @static","     */    ","    ownsKeys: function (properties, object, message) {","        YUITest.Assert._increment();        ","        for (var i=0; i < properties.length; i++){","            if (!object.hasOwnProperty(properties[i])){","                YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Property '\" + properties[i] + \"' not found on object instance.\"));","            }      ","        }","    },","    ","    /**","     * Asserts that an object owns no properties.","     * @param {Object} object The object to check.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method ownsNoKeys","     * @static","     */    ","    ownsNoKeys : function (object, message) {","        YUITest.Assert._increment();  ","        var count = 0,","            name;","        for (name in object){","            if (object.hasOwnProperty(name)){","                count++;","            }","        }","        ","        if (count !== 0){","            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Object owns \" + count + \" properties but should own none.\"));        ","        }","","    },","","    /**","     * Asserts that an object has a property with the given name.","     * @param {String} propertyName The name of the property to test.","     * @param {Object} object The object to search.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method ownsOrInheritsKey","     * @static","     */    ","    ownsOrInheritsKey: function (propertyName, object, message) {","        YUITest.Assert._increment();               ","        if (!(propertyName in object)){","            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Property '\" + propertyName + \"' not found on object.\"));","        }    ","    },","    ","    /**","     * Asserts that an object has all properties of a reference object.","     * @param {Array} properties An array of property names that should be on the object.","     * @param {Object} object The object to search.","     * @param {String} message (Optional) The message to display if the assertion fails.","     * @method ownsOrInheritsKeys","     * @static","     */    ","    ownsOrInheritsKeys: function (properties, object, message) {","        YUITest.Assert._increment();  ","        for (var i=0; i < properties.length; i++){","            if (!(properties[i] in object)){","                YUITest.Assert.fail(YUITest.Assert._formatMessage(message, \"Property '\" + properties[i] + \"' not found on object.\"));","            }      ","        }","    }    ","};","/**"," * Convenience type for storing and aggregating"," * test result information."," * @private"," * @namespace Test"," * @module test"," * @class Results"," * @constructor"," * @param {String} name The name of the test."," */","YUITest.Results = function(name){","","    /**","     * Name of the test, test case, or test suite.","     * @type String","     * @property name","     */","    this.name = name;","    ","    /**","     * Number of passed tests.","     * @type int","     * @property passed","     */","    this.passed = 0;","    ","    /**","     * Number of failed tests.","     * @type int","     * @property failed","     */","    this.failed = 0;","    ","    /**","     * Number of errors that occur in non-test methods.","     * @type int","     * @property errors","     */","    this.errors = 0;","    ","    /**","     * Number of ignored tests.","     * @type int","     * @property ignored","     */","    this.ignored = 0;","    ","    /**","     * Number of total tests.","     * @type int","     * @property total","     */","    this.total = 0;","    ","    /**","     * Amount of time (ms) it took to complete testing.","     * @type int","     * @property duration","     */","    this.duration = 0;","}","","/**"," * Includes results from another results object into this one."," * @param {Test.Results} result The results object to include."," * @method include"," * @return {void}"," */","YUITest.Results.prototype.include = function(results){","    this.passed += results.passed;","    this.failed += results.failed;","    this.ignored += results.ignored;","    this.total += results.total;","    this.errors += results.errors;","};","/**"," * ShouldError is subclass of Error that is thrown whenever"," * a test is expected to throw an error but doesn't."," *"," * @param {String} message The message to display when the error occurs."," * @namespace Test "," * @extends AssertionError"," * @module test"," * @class ShouldError"," * @constructor"," */ ","YUITest.ShouldError = function (message){","","    //call superclass","    YUITest.AssertionError.call(this, message || \"This test should have thrown an error but didn't.\");","    ","    /**","     * The name of the error that occurred.","     * @type String","     * @property name","     */","    this.name = \"ShouldError\";","    ","};","","//inherit from YUITest.AssertionError","YUITest.ShouldError.prototype = new YUITest.AssertionError();","","//restore constructor","YUITest.ShouldError.prototype.constructor = YUITest.ShouldError;","/**"," * ShouldFail is subclass of AssertionError that is thrown whenever"," * a test was expected to fail but did not."," *"," * @param {String} message The message to display when the error occurs."," * @namespace Test "," * @extends YUITest.AssertionError"," * @module test"," * @class ShouldFail"," * @constructor"," */ ","YUITest.ShouldFail = function (message){","","    //call superclass","    YUITest.AssertionError.call(this, message || \"This test should fail but didn't.\");","    ","    /**","     * The name of the error that occurred.","     * @type String","     * @property name","     */","    this.name = \"ShouldFail\";","    ","};","","//inherit from YUITest.AssertionError","YUITest.ShouldFail.prototype = new YUITest.AssertionError();","","//restore constructor","YUITest.ShouldFail.prototype.constructor = YUITest.ShouldFail;","/**"," * UnexpectedError is subclass of AssertionError that is thrown whenever"," * an error occurs within the course of a test and the test was not expected"," * to throw an error."," *"," * @param {Error} cause The unexpected error that caused this error to be "," *                      thrown."," * @namespace Test "," * @extends YUITest.AssertionError"," * @module test"," * @class UnexpectedError"," * @constructor"," */  ","YUITest.UnexpectedError = function (cause){","","    //call superclass","    YUITest.AssertionError.call(this, \"Unexpected error: \" + cause.message);","    ","    /**","     * The unexpected error that occurred.","     * @type Error","     * @property cause","     */","    this.cause = cause;","    ","    /**","     * The name of the error that occurred.","     * @type String","     * @property name","     */","    this.name = \"UnexpectedError\";","    ","    /**","     * Stack information for the error (if provided).","     * @type String","     * @property stack","     */","    this.stack = cause.stack;","    ","};","","//inherit from YUITest.AssertionError","YUITest.UnexpectedError.prototype = new YUITest.AssertionError();","","//restore constructor","YUITest.UnexpectedError.prototype.constructor = YUITest.UnexpectedError;","/**"," * UnexpectedValue is subclass of Error that is thrown whenever"," * a value was unexpected in its scope. This typically means that a test"," * was performed to determine that a value was *not* equal to a certain"," * value."," *"," * @param {String} message The message to display when the error occurs."," * @param {Object} unexpected The unexpected value."," * @namespace Test "," * @extends AssertionError"," * @module test"," * @class UnexpectedValue"," * @constructor"," */ ","YUITest.UnexpectedValue = function (message, unexpected){","","    //call superclass","    YUITest.AssertionError.call(this, message);","    ","    /**","     * The unexpected value.","     * @type Object","     * @property unexpected","     */","    this.unexpected = unexpected;","    ","    /**","     * The name of the error that occurred.","     * @type String","     * @property name","     */","    this.name = \"UnexpectedValue\";","    ","};","","//inherit from YUITest.AssertionError","YUITest.UnexpectedValue.prototype = new YUITest.AssertionError();","","//restore constructor","YUITest.UnexpectedValue.prototype.constructor = YUITest.UnexpectedValue;","","/**"," * Returns a fully formatted error for an assertion failure. This message"," * provides information about the expected and actual values."," * @method getMessage"," * @return {String} A string describing the error."," */","YUITest.UnexpectedValue.prototype.getMessage = function(){","    return this.message + \"\\nUnexpected: \" + this.unexpected + \" (\" + (typeof this.unexpected) + \") \";","};","","/**"," * Represents a stoppage in test execution to wait for an amount of time before"," * continuing."," * @param {Function} segment A function to run when the wait is over."," * @param {int} delay The number of milliseconds to wait before running the code."," * @module test"," * @class Wait"," * @namespace Test"," * @constructor"," *"," */","YUITest.Wait = function (segment, delay) {","    ","    /**","     * The segment of code to run when the wait is over.","     * @type Function","     * @property segment","     */","    this.segment = (typeof segment == \"function\" ? segment : null);","","    /**","     * The delay before running the segment of code.","     * @type int","     * @property delay","     */","    this.delay = (typeof delay == \"number\" ? delay : 0);        ","};","","","//Setting up our aliases..","Y.Test = YUITest;","Y.Object.each(YUITest, function(item, name) {","    var name = name.replace('Test', '');","    Y.Test[name] = item;","});","","} //End of else in top wrapper","","Y.Assert = YUITest.Assert;","Y.Assert.Error = Y.Test.AssertionError;","Y.Assert.ComparisonFailure = Y.Test.ComparisonFailure;","Y.Assert.UnexpectedValue = Y.Test.UnexpectedValue;","Y.Mock = Y.Test.Mock;","Y.ObjectAssert = Y.Test.ObjectAssert;","Y.ArrayAssert = Y.Test.ArrayAssert;","Y.DateAssert = Y.Test.DateAssert;","Y.Test.ResultsFormat = Y.Test.TestFormat;","","var itemsAreEqual = Y.Test.ArrayAssert.itemsAreEqual;","","Y.Test.ArrayAssert.itemsAreEqual = function(expected, actual, message) {","    return itemsAreEqual.call(this, Y.Array(expected), Y.Array(actual), message);","};","","","/**"," * Asserts that a given condition is true. If not, then a Y.Assert.Error object is thrown"," * and the test fails."," * @method assert"," * @param {Boolean} condition The condition to test."," * @param {String} message The message to display if the assertion fails."," * @for YUI"," * @static"," */","Y.assert = function(condition, message){","    Y.Assert._increment();","    if (!condition){","        throw new Y.Assert.Error(Y.Assert._formatMessage(message, \"Assertion failed.\"));","    }","};","","/**"," * Forces an assertion error to occur. Shortcut for Y.Assert.fail()."," * @method fail"," * @param {String} message (Optional) The message to display with the failure."," * @for YUI"," * @static"," */","Y.fail = Y.Assert.fail; ","","Y.Test.Runner.once = Y.Test.Runner.subscribe;","","Y.Test.Runner.disableLogging = function() {","    Y.Test.Runner._log = false;","};","","Y.Test.Runner.enableLogging = function() {","    Y.Test.Runner._log = true;","};","","Y.Test.Runner._ignoreEmpty = true;","Y.Test.Runner._log = true;","","Y.Test.Runner.on = Y.Test.Runner.attach;","","//Only allow one instance of YUITest","if (!YUI.YUITest) {","","    if (Y.config.win) {","        Y.config.win.YUITest = YUITest;","    }","","    YUI.YUITest = Y.Test;","","    ","    //Only setup the listeners once.","    var logEvent = function(event) {","        ","        //data variables","        var message = \"\";","        var messageType = \"\";","        ","        switch(event.type){","            case this.BEGIN_EVENT:","                message = \"Testing began at \" + (new Date()).toString() + \".\";","                messageType = \"info\";","                break;","                ","            case this.COMPLETE_EVENT:","                message = Y.substitute(\"Testing completed at \" +","                    (new Date()).toString() + \".\\n\" +","                    \"Passed:{passed} Failed:{failed} \" +","                    \"Total:{total} ({ignored} ignored)\",","                    event.results);","                messageType = \"info\";","                break;","                ","            case this.TEST_FAIL_EVENT:","                message = event.testName + \": failed.\\n\" + event.error.getMessage();","                messageType = \"fail\";","                break;","                ","            case this.TEST_IGNORE_EVENT:","                message = event.testName + \": ignored.\";","                messageType = \"ignore\";","                break;","                ","            case this.TEST_PASS_EVENT:","                message = event.testName + \": passed.\";","                messageType = \"pass\";","                break;","                ","            case this.TEST_SUITE_BEGIN_EVENT:","                message = \"Test suite \\\"\" + event.testSuite.name + \"\\\" started.\";","                messageType = \"info\";","                break;","                ","            case this.TEST_SUITE_COMPLETE_EVENT:","                message = Y.substitute(\"Test suite \\\"\" +","                    event.testSuite.name + \"\\\" completed\" + \".\\n\" +","                    \"Passed:{passed} Failed:{failed} \" +","                    \"Total:{total} ({ignored} ignored)\",","                    event.results);","                messageType = \"info\";","                break;","                ","            case this.TEST_CASE_BEGIN_EVENT:","                message = \"Test case \\\"\" + event.testCase.name + \"\\\" started.\";","                messageType = \"info\";","                break;","                ","            case this.TEST_CASE_COMPLETE_EVENT:","                message = Y.substitute(\"Test case \\\"\" +","                    event.testCase.name + \"\\\" completed.\\n\" +","                    \"Passed:{passed} Failed:{failed} \" +","                    \"Total:{total} ({ignored} ignored)\",","                    event.results);","                messageType = \"info\";","                break;","            default:","                message = \"Unexpected event \" + event.type;","                message = \"info\";","        }","        ","        if (Y.Test.Runner._log) {","            Y.log(message, messageType, \"TestRunner\");","        }","    }","","    var i, name;","","    for (i in Y.Test.Runner) {","        name = Y.Test.Runner[i];","        if (i.indexOf('_EVENT') > -1) {","            Y.Test.Runner.subscribe(name, logEvent);","        }","    };","","} //End if for YUI.YUITest","","","}, '@VERSION@' ,{requires:['event-simulate','event-custom','substitute','json-stringify']});"];
_yuitest_coverage["/home/yui/src/yui3/src/test/build_tmp/test.js"].lines = {"1":0,"16":0,"17":0,"21":0,"25":0,"29":0,"30":0,"31":0,"43":0,"52":0,"56":0,"73":0,"74":0,"77":0,"89":0,"100":0,"101":0,"103":0,"104":0,"107":0,"108":0,"111":0,"112":0,"113":0,"114":0,"127":0,"128":0,"129":0,"130":0,"131":0,"132":0,"147":0,"162":0,"169":0,"177":0,"180":0,"181":0,"182":0,"183":0,"184":0,"185":0,"191":0,"192":0,"197":0,"209":0,"210":0,"212":0,"245":0,"252":0,"255":0,"256":0,"260":0,"261":0,"266":0,"279":0,"290":0,"305":0,"306":0,"308":0,"309":0,"311":0,"312":0,"329":0,"330":0,"331":0,"341":0,"391":0,"399":0,"401":0,"402":0,"403":0,"404":0,"405":0,"406":0,"407":0,"414":0,"424":0,"436":0,"437":0,"439":0,"440":0,"443":0,"444":0,"446":0,"447":0,"448":0,"449":0,"450":0,"456":0,"458":0,"461":0,"475":0,"476":0,"478":0,"481":0,"482":0,"483":0,"484":0,"486":0,"488":0,"493":0,"495":0,"496":0,"497":0,"498":0,"503":0,"504":0,"508":0,"509":0,"510":0,"511":0,"515":0,"520":0,"522":0,"523":0,"524":0,"525":0,"530":0,"535":0,"539":0,"552":0,"554":0,"555":0,"557":0,"560":0,"562":0,"564":0,"565":0,"568":0,"570":0,"572":0,"576":0,"578":0,"579":0,"580":0,"581":0,"586":0,"589":0,"593":0,"595":0,"596":0,"597":0,"598":0,"603":0,"604":0,"608":0,"609":0,"610":0,"611":0,"619":0,"623":0,"639":0,"646":0,"653":0,"661":0,"669":0,"677":0,"680":0,"693":0,"702":0,"712":0,"713":0,"714":0,"716":0,"717":0,"718":0,"720":0,"732":0,"733":0,"734":0,"735":0,"736":0,"737":0,"738":0,"741":0,"742":0,"744":0,"745":0,"748":0,"749":0,"750":0,"751":0,"752":0,"754":0,"758":0,"761":0,"762":0,"766":0,"767":0,"768":0,"771":0,"772":0,"773":0,"774":0,"775":0,"776":0,"777":0,"778":0,"783":0,"784":0,"785":0,"787":0,"788":0,"803":0,"812":0,"813":0,"814":0,"816":0,"817":0,"818":0,"819":0,"823":0,"836":0,"843":0,"850":0,"857":0,"864":0,"871":0,"878":0,"881":0,"882":0,"883":0,"884":0,"885":0,"886":0,"891":0,"901":0,"902":0,"903":0,"905":0,"906":0,"908":0,"909":0,"921":0,"924":0,"933":0,"942":0,"951":0,"960":0,"970":0,"979":0,"989":0,"998":0,"1009":0,"1013":0,"1120":0,"1125":0,"1126":0,"1127":0,"1145":0,"1148":0,"1149":0,"1150":0,"1151":0,"1152":0,"1168":0,"1172":0,"1173":0,"1174":0,"1175":0,"1176":0,"1195":0,"1197":0,"1198":0,"1200":0,"1201":0,"1202":0,"1205":0,"1206":0,"1207":0,"1208":0,"1209":0,"1210":0,"1211":0,"1212":0,"1230":0,"1231":0,"1232":0,"1233":0,"1234":0,"1235":0,"1237":0,"1238":0,"1239":0,"1242":0,"1244":0,"1245":0,"1246":0,"1247":0,"1248":0,"1249":0,"1250":0,"1251":0,"1252":0,"1253":0,"1257":0,"1272":0,"1274":0,"1275":0,"1276":0,"1277":0,"1279":0,"1282":0,"1283":0,"1284":0,"1285":0,"1286":0,"1288":0,"1291":0,"1294":0,"1308":0,"1311":0,"1313":0,"1316":0,"1319":0,"1321":0,"1324":0,"1325":0,"1326":0,"1327":0,"1328":0,"1329":0,"1330":0,"1331":0,"1345":0,"1346":0,"1351":0,"1352":0,"1353":0,"1356":0,"1359":0,"1368":0,"1371":0,"1374":0,"1378":0,"1381":0,"1382":0,"1385":0,"1386":0,"1387":0,"1391":0,"1393":0,"1396":0,"1397":0,"1400":0,"1403":0,"1406":0,"1407":0,"1410":0,"1411":0,"1412":0,"1413":0,"1414":0,"1415":0,"1421":0,"1422":0,"1423":0,"1427":0,"1428":0,"1429":0,"1430":0,"1432":0,"1434":0,"1435":0,"1438":0,"1439":0,"1440":0,"1442":0,"1444":0,"1449":0,"1453":0,"1454":0,"1455":0,"1458":0,"1461":0,"1462":0,"1463":0,"1465":0,"1468":0,"1469":0,"1470":0,"1473":0,"1476":0,"1478":0,"1479":0,"1490":0,"1491":0,"1493":0,"1497":0,"1500":0,"1503":0,"1506":0,"1514":0,"1515":0,"1517":0,"1519":0,"1522":0,"1523":0,"1524":0,"1527":0,"1547":0,"1548":0,"1549":0,"1552":0,"1568":0,"1578":0,"1581":0,"1588":0,"1589":0,"1591":0,"1594":0,"1595":0,"1596":0,"1599":0,"1605":0,"1608":0,"1611":0,"1626":0,"1637":0,"1652":0,"1653":0,"1663":0,"1673":0,"1683":0,"1696":0,"1697":0,"1698":0,"1700":0,"1703":0,"1718":0,"1719":0,"1720":0,"1722":0,"1725":0,"1741":0,"1745":0,"1746":0,"1747":0,"1749":0,"1762":0,"1763":0,"1765":0,"1781":0,"1784":0,"1789":0,"1790":0,"1794":0,"1797":0,"1798":0,"1799":0,"1802":0,"1805":0,"1809":0,"1822":0,"1838":0,"1839":0,"1841":0,"1842":0,"1843":0,"1846":0,"1861":0,"1862":0,"1864":0,"1865":0,"1866":0,"1869":0,"1885":0,"1887":0,"1888":0,"1904":0,"1907":0,"1908":0,"1909":0,"1926":0,"1928":0,"1929":0,"1932":0,"1933":0,"1950":0,"1952":0,"1953":0,"1970":0,"1972":0,"1973":0,"1974":0,"1992":0,"1995":0,"1996":0,"1999":0,"2000":0,"2016":0,"2019":0,"2020":0,"2021":0,"2022":0,"2024":0,"2029":0,"2046":0,"2049":0,"2050":0,"2054":0,"2055":0,"2059":0,"2060":0,"2061":0,"2083":0,"2086":0,"2087":0,"2091":0,"2092":0,"2096":0,"2097":0,"2098":0,"2111":0,"2112":0,"2113":0,"2125":0,"2126":0,"2127":0,"2145":0,"2148":0,"2149":0,"2153":0,"2154":0,"2155":0,"2174":0,"2175":0,"2176":0,"2177":0,"2179":0,"2184":0,"2198":0,"2223":0,"2224":0,"2226":0,"2237":0,"2247":0,"2257":0,"2271":0,"2280":0,"2297":0,"2298":0,"2299":0,"2314":0,"2315":0,"2316":0,"2330":0,"2331":0,"2332":0,"2346":0,"2347":0,"2348":0,"2365":0,"2366":0,"2367":0,"2380":0,"2381":0,"2382":0,"2399":0,"2400":0,"2401":0,"2413":0,"2414":0,"2415":0,"2428":0,"2429":0,"2430":0,"2443":0,"2444":0,"2445":0,"2458":0,"2459":0,"2460":0,"2473":0,"2474":0,"2475":0,"2491":0,"2492":0,"2493":0,"2494":0,"2496":0,"2498":0,"2499":0,"2511":0,"2512":0,"2513":0,"2525":0,"2526":0,"2527":0,"2542":0,"2543":0,"2544":0,"2556":0,"2557":0,"2558":0,"2570":0,"2571":0,"2572":0,"2584":0,"2585":0,"2586":0,"2599":0,"2600":0,"2601":0,"2625":0,"2626":0,"2628":0,"2629":0,"2633":0,"2636":0,"2637":0,"2639":0,"2642":0,"2643":0,"2646":0,"2649":0,"2651":0,"2655":0,"2658":0,"2659":0,"2661":0,"2666":0,"2681":0,"2688":0,"2695":0,"2698":0,"2710":0,"2719":0,"2737":0,"2740":0,"2747":0,"2754":0,"2761":0,"2766":0,"2769":0,"2777":0,"2778":0,"2788":0,"2799":0,"2814":0,"2815":0,"2816":0,"2817":0,"2821":0,"2836":0,"2847":0,"2848":0,"2849":0,"2852":0,"2853":0,"2857":0,"2858":0,"2862":0,"2863":0,"2866":0,"2867":0,"2870":0,"2883":0,"2884":0,"2885":0,"2888":0,"2889":0,"2893":0,"2894":0,"2898":0,"2899":0,"2902":0,"2903":0,"2906":0,"2920":0,"2923":0,"2925":0,"2930":0,"2931":0,"2932":0,"2933":0,"2935":0,"2939":0,"2940":0,"2941":0,"2942":0,"2943":0,"2944":0,"2952":0,"2975":0,"2978":0,"2979":0,"2983":0,"2984":0,"2994":0,"2995":0,"2996":0,"2999":0,"3000":0,"3001":0,"3006":0,"3007":0,"3008":0,"3009":0,"3010":0,"3011":0,"3012":0,"3015":0,"3017":0,"3018":0,"3022":0,"3027":0,"3032":0,"3033":0,"3034":0,"3037":0,"3041":0,"3043":0,"3055":0,"3056":0,"3058":0,"3059":0,"3060":0,"3061":0,"3062":0,"3063":0,"3064":0,"3071":0,"3085":0,"3086":0,"3087":0,"3088":0,"3089":0,"3090":0,"3091":0,"3094":0,"3104":0,"3112":0,"3120":0,"3128":0,"3136":0,"3144":0,"3154":0,"3167":0,"3169":0,"3173":0,"3174":0,"3178":0,"3179":0,"3180":0,"3181":0,"3197":0,"3210":0,"3222":0,"3223":0,"3224":0,"3237":0,"3238":0,"3239":0,"3240":0,"3254":0,"3255":0,"3256":0,"3269":0,"3270":0,"3271":0,"3272":0,"3285":0,"3286":0,"3288":0,"3289":0,"3290":0,"3294":0,"3295":0,"3309":0,"3310":0,"3311":0,"3324":0,"3325":0,"3326":0,"3327":0,"3342":0,"3349":0,"3356":0,"3363":0,"3370":0,"3377":0,"3384":0,"3391":0,"3400":0,"3401":0,"3402":0,"3403":0,"3404":0,"3405":0,"3418":0,"3421":0,"3428":0,"3433":0,"3436":0,"3448":0,"3451":0,"3458":0,"3463":0,"3466":0,"3480":0,"3483":0,"3490":0,"3497":0,"3504":0,"3509":0,"3512":0,"3527":0,"3530":0,"3537":0,"3544":0,"3549":0,"3552":0,"3560":0,"3561":0,"3575":0,"3582":0,"3589":0,"3594":0,"3595":0,"3596":0,"3597":0,"3602":0,"3603":0,"3604":0,"3605":0,"3606":0,"3607":0,"3608":0,"3609":0,"3610":0,"3612":0,"3614":0,"3615":0,"3628":0,"3629":0,"3630":0,"3631":0,"3642":0,"3644":0,"3646":0,"3647":0,"3650":0,"3651":0,"3654":0,"3655":0,"3657":0,"3660":0,"3662":0,"3663":0,"3666":0,"3670":0,"3673":0,"3674":0,"3676":0,"3678":0,"3679":0,"3680":0,"3683":0,"3688":0,"3689":0,"3692":0,"3693":0,"3694":0,"3697":0,"3698":0,"3699":0,"3702":0,"3703":0,"3704":0,"3707":0,"3708":0,"3709":0,"3712":0,"3717":0,"3718":0,"3721":0,"3722":0,"3723":0,"3726":0,"3731":0,"3732":0,"3734":0,"3735":0,"3738":0,"3739":0,"3743":0,"3745":0,"3746":0,"3747":0,"3748":0,"3750":0};
_yuitest_coverage["/home/yui/src/yui3/src/test/build_tmp/test.js"].functions = {"EventTarget:43":0,"attach:72":0,"subscribe:88":0,"fire:99":0,"detach:126":0,"unsubscribe:146":0,"TestSuite:162":0,"add:208":0,"TestCase:245":0,"callback:278":0,"resume:289":0,"(anonymous 2):311":0,"wait:303":0,"assert:328":0,"fail:340":0,"(anonymous 3):401":0,"xmlEscape:399":0,"JSON:423":0,"serializeToXML:436":0,"XML:434":0,"serializeToJUnitXML:475":0,"JUnitXML:473":0,"serializeToTAP:554":0,"TAP:550":0,"TestFormat:391":0,"Reporter:639":0,"addField:692":0,"clearFields:701":0,"destroy:711":0,"report:729":0,"inGroups:812":0,"TestNode:836":0,"appendChild:900":0,"TestRunner:921":0,"_addTestCaseToTestTree:1117":0,"_addTestSuiteToTestTree:1142":0,"_buildTestTree:1166":0,"_handleTestObjectComplete:1194":0,"_next:1228":0,"_execNonTestMethod:1271":0,"(anonymous 4):1352":0,"_run:1305":0,"(anonymous 5):1439":0,"(anonymous 6):1523":0,"_resumeTest:1365":0,"(anonymous 7):1548":0,"_handleError:1545":0,"(anonymous 8):1595":0,"_runTest:1565":0,"getName:1625":0,"setName:1636":0,"add:1651":0,"clear:1662":0,"isWaiting:1672":0,"isRunning:1682":0,"getResults:1695":0,"getCoverage:1717":0,"(anonymous 9):1745":0,"callback:1740":0,"resume:1761":0,"run:1779":0,"TestRunner:803":0,"_indexOf:1837":0,"_some:1860":0,"contains:1882":0,"containsItems:1902":0,"containsMatch:1923":0,"doesNotContain:1947":0,"doesNotContainItems:1967":0,"doesNotContainMatch:1989":0,"indexOf:2014":0,"itemsAreEqual:2043":0,"itemsAreEquivalent:2080":0,"isEmpty:2110":0,"isNotEmpty:2124":0,"itemsAreSame:2142":0,"lastIndexOf:2171":0,"_formatMessage:2222":0,"_getCount:2236":0,"_increment:2246":0,"_reset:2256":0,"fail:2270":0,"pass:2279":0,"areEqual:2296":0,"areNotEqual:2312":0,"areNotSame:2329":0,"areSame:2345":0,"isFalse:2364":0,"isTrue:2379":0,"isNaN:2398":0,"isNotNaN:2412":0,"isNotNull:2427":0,"isNotUndefined:2442":0,"isNull:2457":0,"isUndefined:2472":0,"isArray:2490":0,"isBoolean:2510":0,"isFunction:2524":0,"isInstanceOf:2541":0,"isNumber:2555":0,"isObject:2569":0,"isString:2583":0,"isTypeOf:2598":0,"throwsError:2624":0,"AssertionError:2681":0,"getMessage:2709":0,"toString:2718":0,"ComparisonFailure:2737":0,"getMessage:2777":0,"JSON:2798":0,"XdebugJSON:2812":0,"datesAreEqual:2846":0,"timesAreEqual:2882":0,"(anonymous 11):2943":0,"]:2942":0,"Mock:2920":0,"]:3007":0,"]:3032":0,"expect:2975":0,"verify:3055":0,"verify:3087":0,"Value:3085":0,"areEqual:3166":0,"hasKey:3196":0,"hasKeys:3209":0,"inheritsKey:3221":0,"inheritsKeys:3236":0,"ownsKey:3253":0,"ownsKeys:3268":0,"ownsNoKeys:3284":0,"ownsOrInheritsKey:3308":0,"ownsOrInheritsKeys:3323":0,"Results:3342":0,"include:3400":0,"ShouldError:3418":0,"ShouldFail:3448":0,"UnexpectedError:3480":0,"UnexpectedValue:3527":0,"getMessage:3560":0,"Wait:3575":0,"(anonymous 14):3595":0,"itemsAreEqual:3614":0,"assert:3628":0,"disableLogging:3646":0,"enableLogging:3650":0,"logEvent:3670":0,"(anonymous 1):1":0};
_yuitest_coverage["/home/yui/src/yui3/src/test/build_tmp/test.js"].coveredLines = 892;
_yuitest_coverage["/home/yui/src/yui3/src/test/build_tmp/test.js"].coveredFunctions = 147;
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1);
YUI.add('test', function(Y) {



/**
 * YUI Test Framework
 * @module test
 * @main test
 */

/*
 * The root namespace for YUI Test.
 */

//So we only ever have one YUITest object that's shared
_yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "(anonymous 1)", 1);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 16);
if (YUI.YUITest) {
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 17);
Y.Test = YUI.YUITest;
} else { //Ends after the YUITest definitions

    //Make this global for back compat
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 21);
YUITest = {
        version: "@VERSION@"
    };

_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 25);
Y.namespace('Test');


//Using internal YUI methods here
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 29);
YUITest.Object = Y.Object;
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 30);
YUITest.Array = Y.Array;
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 31);
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
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 43);
YUITest.EventTarget = function(){

    /**
     * Event handlers for the various events.
     * @type Object
     * @private
     * @property _handlers
     * @static
     */
    _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "EventTarget", 43);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 52);
this._handlers = {};

};
    
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 56);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "attach", 72);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 73);
if (typeof this._handlers[type] == "undefined"){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 74);
this._handlers[type] = [];
        }

        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 77);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "subscribe", 88);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 89);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "fire", 99);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 100);
if (typeof event == "string"){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 101);
event = { type: event };
        }
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 103);
if (!event.target){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 104);
event.target = this;
        }
        
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 107);
if (!event.type){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 108);
throw new Error("Event object missing 'type' property.");
        }
        
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 111);
if (this._handlers[event.type] instanceof Array){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 112);
var handlers = this._handlers[event.type];
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 113);
for (var i=0, len=handlers.length; i < len; i++){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 114);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "detach", 126);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 127);
if (this._handlers[type] instanceof Array){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 128);
var handlers = this._handlers[type];
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 129);
for (var i=0, len=handlers.length; i < len; i++){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 130);
if (handlers[i] === listener){
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 131);
handlers.splice(i, 1);
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 132);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "unsubscribe", 146);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 147);
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
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 162);
YUITest.TestSuite = function (data) {

    /**
     * The name of the test suite.
     * @type String
     * @property name
     */
    _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "TestSuite", 162);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 169);
this.name = "";

    /**
     * Array of test suites and test cases.
     * @type Array
     * @property items
     * @private
     */
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 177);
this.items = [];

    //initialize the properties
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 180);
if (typeof data == "string"){
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 181);
this.name = data;
    } else {_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 182);
if (data instanceof Object){
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 183);
for (var prop in data){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 184);
if (data.hasOwnProperty(prop)){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 185);
this[prop] = data[prop];
            }
        }
    }}

    //double-check name
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 191);
if (this.name === ""){
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 192);
this.name = "testSuite" + (+new Date());
    }

};
    
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 197);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "add", 208);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 209);
if (testObject instanceof YUITest.TestSuite || testObject instanceof YUITest.TestCase) {
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 210);
this.items.push(testObject);
        }
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 212);
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
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 245);
YUITest.TestCase = function (template) {
    
    /*
     * Special rules for the test case. Possible subobjects
     * are fail, for tests that should fail, and error, for
     * tests that should throw an error.
     */
    _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "TestCase", 245);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 252);
this._should = {};
    
    //copy over all properties from the template to this object
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 255);
for (var prop in template) {
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 256);
this[prop] = template[prop];
    }    
    
    //check for a valid name
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 260);
if (typeof this.name != "string"){
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 261);
this.name = "testCase" + (+new Date());
    }

};
        
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 266);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "callback", 278);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 279);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "resume", 289);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 290);
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
        
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "wait", 303);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 305);
var actualDelay = (typeof segment == "number" ? segment : delay);
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 306);
actualDelay = (typeof actualDelay == "number" ? actualDelay : 10000);
    
		_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 308);
if (typeof segment == "function"){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 309);
throw new YUITest.Wait(segment, actualDelay);
        } else {
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 311);
throw new YUITest.Wait(function(){
                _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "(anonymous 2)", 311);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 312);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "assert", 328);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 329);
YUITest.Assert._increment();
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 330);
if (!condition){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 331);
throw new YUITest.AssertionError(YUITest.Assert._formatMessage(message, "Assertion failed."));
        }    
    },
    
    /**
     * Forces an assertion error to occur. Shortcut for YUITest.Assert.fail().
     * @method fail
     * @param {String} message (Optional) The message to display with the failure.
     */
    fail: function (message) {    
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "fail", 340);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 341);
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
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 391);
YUITest.TestFormat = function(){
    
    /* (intentionally not documented)
     * Basic XML escaping method. Replaces quotes, less-than, greater-than,
     * apostrophe, and ampersand characters with their corresponding entities.
     * @param {String} text The text to encode.
     * @return {String} The XML-escaped text.
     */
    _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "TestFormat", 391);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 399);
function xmlEscape(text){
    
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "xmlEscape", 399);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 401);
return text.replace(/[<>"'&]/g, function(value){
            _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "(anonymous 3)", 401);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 402);
switch(value){
                case "<":   _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 403);
return "&lt;";
                case ">":   _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 404);
return "&gt;";
                case "\"":  _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 405);
return "&quot;";
                case "'":   _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 406);
return "&apos;";
                case "&":   _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 407);
return "&amp;";
            }
        });
    
    }
        
        
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 414);
return {
    
        /**
         * Returns test results formatted as a JSON string. Requires JSON utility.
         * @param {Object} result The results object created by TestRunner.
         * @return {String} A JSON-formatted string of results.
         * @method JSON
         * @static
         */
        JSON: function(results) {
            _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "JSON", 423);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 424);
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

            _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "XML", 434);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 436);
function serializeToXML(results){
                _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "serializeToXML", 436);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 437);
var xml = "<" + results.type + " name=\"" + xmlEscape(results.name) + "\"";
                
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 439);
if (typeof(results.duration)=="number"){
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 440);
xml += " duration=\"" + results.duration + "\"";
                }
                
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 443);
if (results.type == "test"){
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 444);
xml += " result=\"" + results.result + "\" message=\"" + xmlEscape(results.message) + "\">";
                } else {
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 446);
xml += " passed=\"" + results.passed + "\" failed=\"" + results.failed + "\" ignored=\"" + results.ignored + "\" total=\"" + results.total + "\">";
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 447);
for (var prop in results){
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 448);
if (results.hasOwnProperty(prop)){
                            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 449);
if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 450);
xml += serializeToXML(results[prop]);
                            }
                        }
                    }       
                }

                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 456);
xml += "</" + results.type + ">";
                
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 458);
return xml;    
            }

            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 461);
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

            _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "JUnitXML", 473);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 475);
function serializeToJUnitXML(results){
                _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "serializeToJUnitXML", 475);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 476);
var xml = "";
                    
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 478);
switch (results.type){
                    //equivalent to testcase in JUnit
                    case "test":
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 481);
if (results.result != "ignore"){
                            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 482);
xml = "<testcase name=\"" + xmlEscape(results.name) + "\" time=\"" + (results.duration/1000) + "\">";
                            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 483);
if (results.result == "fail"){
                                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 484);
xml += "<failure message=\"" + xmlEscape(results.message) + "\"><![CDATA[" + results.message + "]]></failure>";
                            }
                            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 486);
xml+= "</testcase>";
                        }
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 488);
break;
                        
                    //equivalent to testsuite in JUnit
                    case "testcase":
                    
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 493);
xml = "<testsuite name=\"" + xmlEscape(results.name) + "\" tests=\"" + results.total + "\" failures=\"" + results.failed + "\" time=\"" + (results.duration/1000) + "\">";
                        
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 495);
for (var prop in results){
                            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 496);
if (results.hasOwnProperty(prop)){
                                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 497);
if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 498);
xml += serializeToJUnitXML(results[prop]);
                                }
                            }
                        }            
                        
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 503);
xml += "</testsuite>";
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 504);
break;
                    
                    //no JUnit equivalent, don't output anything
                    case "testsuite":
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 508);
for (var prop in results){
                            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 509);
if (results.hasOwnProperty(prop)){
                                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 510);
if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 511);
xml += serializeToJUnitXML(results[prop]);
                                }
                            }
                        }                                                     
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 515);
break;
                        
                    //top-level, equivalent to testsuites in JUnit
                    case "report":
                    
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 520);
xml = "<testsuites>";
                    
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 522);
for (var prop in results){
                            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 523);
if (results.hasOwnProperty(prop)){
                                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 524);
if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 525);
xml += serializeToJUnitXML(results[prop]);
                                }
                            }
                        }            
                        
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 530);
xml += "</testsuites>";            
                    
                    //no default
                }
                
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 535);
return xml;
         
            }

            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 539);
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
        
            _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "TAP", 550);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 552);
var currentTestNum = 1;

            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 554);
function serializeToTAP(results){
                _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "serializeToTAP", 554);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 555);
var text = "";
                    
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 557);
switch (results.type){

                    case "test":
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 560);
if (results.result != "ignore"){

                            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 562);
text = "ok " + (currentTestNum++) + " - " + results.name;
                            
                            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 564);
if (results.result == "fail"){
                                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 565);
text = "not " + text + " - " + results.message;
                            }
                            
                            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 568);
text += "\n";
                        } else {
                            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 570);
text = "#Ignored test " + results.name + "\n";
                        }
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 572);
break;
                        
                    case "testcase":
                    
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 576);
text = "#Begin testcase " + results.name + "(" + results.failed + " failed of " + results.total + ")\n";
                                        
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 578);
for (var prop in results){
                            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 579);
if (results.hasOwnProperty(prop)){
                                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 580);
if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 581);
text += serializeToTAP(results[prop]);
                                }
                            }
                        }            
                        
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 586);
text += "#End testcase " + results.name + "\n";
                        
                        
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 589);
break;
                    
                    case "testsuite":

                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 593);
text = "#Begin testsuite " + results.name + "(" + results.failed + " failed of " + results.total + ")\n";                
                    
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 595);
for (var prop in results){
                            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 596);
if (results.hasOwnProperty(prop)){
                                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 597);
if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 598);
text += serializeToTAP(results[prop]);
                                }
                            }
                        }                                                      

                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 603);
text += "#End testsuite " + results.name + "\n";
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 604);
break;

                    case "report":
                    
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 608);
for (var prop in results){
                            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 609);
if (results.hasOwnProperty(prop)){
                                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 610);
if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 611);
text += serializeToTAP(results[prop]);
                                }
                            }
                        }              
                        
                    //no default
                }
                
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 619);
return text;
         
            }

            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 623);
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
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 639);
YUITest.Reporter = function(url, format) {
    
        /**
         * The URL to submit the data to.
         * @type String
         * @property url
         */
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "Reporter", 639);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 646);
this.url = url;
    
        /**
         * The formatting function to call when submitting the data.
         * @type Function
         * @property format
         */
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 653);
this.format = format || YUITest.TestFormat.XML;
    
        /**
         * Extra fields to submit with the request.
         * @type Object
         * @property _fields
         * @private
         */
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 661);
this._fields = new Object();
        
        /**
         * The form element used to submit the results.
         * @type HTMLFormElement
         * @property _form
         * @private
         */
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 669);
this._form = null;
    
        /**
         * Iframe used as a target for form submission.
         * @type HTMLIFrameElement
         * @property _iframe
         * @private
         */
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 677);
this._iframe = null;
    };
    
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 680);
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
            _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "addField", 692);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 693);
this._fields[name] = value;    
        },
        
        /**
         * Removes all previous defined fields.
         * @return {Void}
         * @method clearFields
         */
        clearFields : function(){
            _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "clearFields", 701);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 702);
this._fields = new Object();
        },
    
        /**
         * Cleans up the memory associated with the TestReporter, removing DOM elements
         * that were created.
         * @return {Void}
         * @method destroy
         */
        destroy : function() {
            _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "destroy", 711);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 712);
if (this._form){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 713);
this._form.parentNode.removeChild(this._form);
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 714);
this._form = null;
            }        
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 716);
if (this._iframe){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 717);
this._iframe.parentNode.removeChild(this._iframe);
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 718);
this._iframe = null;
            }
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 720);
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
            _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "report", 729);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 732);
if (!this._form){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 733);
this._form = document.createElement("form");
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 734);
this._form.method = "post";
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 735);
this._form.style.visibility = "hidden";
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 736);
this._form.style.position = "absolute";
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 737);
this._form.style.top = 0;
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 738);
document.body.appendChild(this._form);
            
                //IE won't let you assign a name using the DOM, must do it the hacky way
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 741);
try {
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 742);
this._iframe = document.createElement("<iframe name=\"yuiTestTarget\" />");
                } catch (ex){
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 744);
this._iframe = document.createElement("iframe");
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 745);
this._iframe.name = "yuiTestTarget";
                }
    
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 748);
this._iframe.src = "javascript:false";
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 749);
this._iframe.style.visibility = "hidden";
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 750);
this._iframe.style.position = "absolute";
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 751);
this._iframe.style.top = 0;
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 752);
document.body.appendChild(this._iframe);
    
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 754);
this._form.target = "yuiTestTarget";
            }
    
            //set the form's action
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 758);
this._form.action = this.url;
        
            //remove any existing fields
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 761);
while(this._form.hasChildNodes()){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 762);
this._form.removeChild(this._form.lastChild);
            }
            
            //create default fields
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 766);
this._fields.results = this.format(results);
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 767);
this._fields.useragent = navigator.userAgent;
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 768);
this._fields.timestamp = (new Date()).toLocaleString();
    
            //add fields to the form
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 771);
for (var prop in this._fields){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 772);
var value = this._fields[prop];
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 773);
if (this._fields.hasOwnProperty(prop) && (typeof value != "function")){
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 774);
var input = document.createElement("input");
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 775);
input.type = "hidden";
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 776);
input.name = prop;
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 777);
input.value = value;
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 778);
this._form.appendChild(input);
                }
            }
    
            //remove default fields
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 783);
delete this._fields.results;
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 784);
delete this._fields.useragent;
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 785);
delete this._fields.timestamp;
            
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 787);
if (arguments[1] !== false){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 788);
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
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 803);
YUITest.TestRunner = function(){

        /*(intentionally not documented)
         * Determines if any of the array of test groups appears
         * in the given TestRunner filter.
         * @param {Array} testGroups The array of test groups to
         *      search for.
         * @param {String} filter The TestRunner groups filter.
         */
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "TestRunner", 803);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 812);
function inGroups(testGroups, filter){
            _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "inGroups", 812);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 813);
if (!filter.length){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 814);
return true;
            } else {                
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 816);
if (testGroups){
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 817);
for (var i=0, len=testGroups.length; i < len; i++){
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 818);
if (filter.indexOf("," + testGroups[i] + ",") > -1){
                            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 819);
return true;
                        }
                    }
                }
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 823);
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
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 836);
function TestNode(testObject){
        
            /**
             * The TestSuite, TestCase, or test function represented by this node.
             * @type Variant
             * @property testObject
             */
            _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "TestNode", 836);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 843);
this.testObject = testObject;
            
            /**
             * Pointer to this node's first child.
             * @type TestNode
             * @property firstChild
             */        
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 850);
this.firstChild = null;
            
            /**
             * Pointer to this node's last child.
             * @type TestNode
             * @property lastChild
             */        
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 857);
this.lastChild = null;
            
            /**
             * Pointer to this node's parent.
             * @type TestNode
             * @property parent
             */        
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 864);
this.parent = null; 
       
            /**
             * Pointer to this node's next sibling.
             * @type TestNode
             * @property next
             */        
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 871);
this.next = null;
            
            /**
             * Test results for this test object.
             * @type object
             * @property results
             */                
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 878);
this.results = new YUITest.Results();
            
            //initialize results
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 881);
if (testObject instanceof YUITest.TestSuite){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 882);
this.results.type = "testsuite";
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 883);
this.results.name = testObject.name;
            } else {_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 884);
if (testObject instanceof YUITest.TestCase){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 885);
this.results.type = "testcase";
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 886);
this.results.name = testObject.name;
            }}
           
        }
        
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 891);
TestNode.prototype = {
        
            /**
             * Appends a new test object (TestSuite, TestCase, or test function name) as a child
             * of this node.
             * @param {Variant} testObject A TestSuite, TestCase, or the name of a test function.
             * @return {Void}
             * @method appendChild
             */
            appendChild : function (testObject){
                _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "appendChild", 900);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 901);
var node = new TestNode(testObject);
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 902);
if (this.firstChild === null){
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 903);
this.firstChild = this.lastChild = node;
                } else {
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 905);
this.lastChild.next = node;
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 906);
this.lastChild = node;
                }
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 908);
node.parent = this;
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 909);
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
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 921);
function TestRunner(){
        
            //inherit from EventTarget
            _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "TestRunner", 921);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 924);
YUITest.EventTarget.call(this);
            
            /**
             * Suite on which to attach all TestSuites and TestCases to be run.
             * @type YUITest.TestSuite
             * @property masterSuite
             * @static
             * @private
             */
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 933);
this.masterSuite = new YUITest.TestSuite("yuitests" + (new Date()).getTime());        
    
            /**
             * Pointer to the current node in the test tree.
             * @type TestNode
             * @private
             * @property _cur
             * @static
             */
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 942);
this._cur = null;
            
            /**
             * Pointer to the root node in the test tree.
             * @type TestNode
             * @private
             * @property _root
             * @static
             */
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 951);
this._root = null;
            
            /**
             * Indicates if the TestRunner will log events or not.
             * @type Boolean
             * @property _log
             * @private
             * @static
             */
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 960);
this._log = true;
            
            /**
             * Indicates if the TestRunner is waiting as a result of
             * wait() being called.
             * @type Boolean
             * @property _waiting
             * @private
             * @static
             */
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 970);
this._waiting = false;
            
            /**
             * Indicates if the TestRunner is currently running tests.
             * @type Boolean
             * @private
             * @property _running
             * @static
             */
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 979);
this._running = false;
            
            /**
             * Holds copy of the results object generated when all tests are
             * complete.
             * @type Object
             * @private
             * @property _lastResults
             * @static
             */
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 989);
this._lastResults = null;       
            
            /**
             * Data object that is passed around from method to method.
             * @type Object
             * @private
             * @property _data
             * @static
             */
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 998);
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
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1009);
this._groups = "";

        }
        
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1013);
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
                _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "_addTestCaseToTestTree", 1117);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1120);
var node = parentNode.appendChild(testCase),
                    prop,
                    testName;
                
                //iterate over the items in the test case
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1125);
for (prop in testCase){
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1126);
if ((prop.indexOf("test") === 0 || prop.indexOf(" ") > -1) && typeof testCase[prop] == "function"){
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1127);
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
                _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "_addTestSuiteToTestTree", 1142);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1145);
var node = parentNode.appendChild(testSuite);
                
                //iterate over the items in the master suite
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1148);
for (var i=0; i < testSuite.items.length; i++){
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1149);
if (testSuite.items[i] instanceof YUITest.TestSuite) {
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1150);
this._addTestSuiteToTestTree(node, testSuite.items[i]);
                    } else {_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1151);
if (testSuite.items[i] instanceof YUITest.TestCase) {
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1152);
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
            
                _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "_buildTestTree", 1166);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1168);
this._root = new TestNode(this.masterSuite);
                //this._cur = this._root;
                
                //iterate over the items in the master suite
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1172);
for (var i=0; i < this.masterSuite.items.length; i++){
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1173);
if (this.masterSuite.items[i] instanceof YUITest.TestSuite) {
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1174);
this._addTestSuiteToTestTree(this._root, this.masterSuite.items[i]);
                    } else {_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1175);
if (this.masterSuite.items[i] instanceof YUITest.TestCase) {
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1176);
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
                _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "_handleTestObjectComplete", 1194);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1195);
var parentNode;
                
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1197);
if (node && (typeof node.testObject == "object")) {
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1198);
parentNode = node.parent;
                
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1200);
if (parentNode){
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1201);
parentNode.results.include(node.results); 
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1202);
parentNode.results[node.testObject.name] = node.results;
                    }
                
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1205);
if (node.testObject instanceof YUITest.TestSuite){
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1206);
this._execNonTestMethod(node, "tearDown", false);
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1207);
node.results.duration = (new Date()) - node._start;
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1208);
this.fire({ type: this.TEST_SUITE_COMPLETE_EVENT, testSuite: node.testObject, results: node.results});
                    } else {_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1209);
if (node.testObject instanceof YUITest.TestCase){
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1210);
this._execNonTestMethod(node, "destroy", false);
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1211);
node.results.duration = (new Date()) - node._start;
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1212);
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
            
                _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "_next", 1228);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1230);
if (this._cur === null){
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1231);
this._cur = this._root;
                } else {_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1232);
if (this._cur.firstChild) {
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1233);
this._cur = this._cur.firstChild;
                } else {_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1234);
if (this._cur.next) {
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1235);
this._cur = this._cur.next;            
                } else {
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1237);
while (this._cur && !this._cur.next && this._cur !== this._root){
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1238);
this._handleTestObjectComplete(this._cur);
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1239);
this._cur = this._cur.parent;
                    }
                    
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1242);
this._handleTestObjectComplete(this._cur);               
                        
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1244);
if (this._cur == this._root){
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1245);
this._cur.results.type = "report";
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1246);
this._cur.results.timestamp = (new Date()).toLocaleString();
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1247);
this._cur.results.duration = (new Date()) - this._cur._start;   
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1248);
this._lastResults = this._cur.results;
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1249);
this._running = false;                         
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1250);
this.fire({ type: this.COMPLETE_EVENT, results: this._lastResults});
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1251);
this._cur = null;
                    } else {_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1252);
if (this._cur) {
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1253);
this._cur = this._cur.next;                
                    }}
                }}}
            
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1257);
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
                _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "_execNonTestMethod", 1271);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1272);
var testObject = node.testObject,
                    event = { type: this.ERROR_EVENT };
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1274);
try {
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1275);
if (allowAsync && testObject["async:" + methodName]){
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1276);
testObject["async:" + methodName](this._context);
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1277);
return true;
                    } else {
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1279);
testObject[methodName](this._context);
                    }
                } catch (ex){
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1282);
node.results.errors++;
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1283);
event.error = ex;
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1284);
event.methodName = methodName;
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1285);
if (testObject instanceof YUITest.TestCase){
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1286);
event.testCase = testObject;
                    } else {
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1288);
event.testSuite = testSuite;
                    }
                    
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1291);
this.fire(event);
                }  

                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1294);
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
                _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "_run", 1305);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1308);
var shouldWait = false;
                
                //get the next test node
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1311);
var node = this._next();
                
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1313);
if (node !== null) {
                
                    //set flag to say the testrunner is running
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1316);
this._running = true;
                    
                    //eliminate last results
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1319);
this._lastResult = null;                  
                
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1321);
var testObject = node.testObject;
                    
                    //figure out what to do
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1324);
if (typeof testObject == "object" && testObject !== null){
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1325);
if (testObject instanceof YUITest.TestSuite){
                            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1326);
this.fire({ type: this.TEST_SUITE_BEGIN_EVENT, testSuite: testObject });
                            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1327);
node._start = new Date();
                            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1328);
this._execNonTestMethod(node, "setUp" ,false);
                        } else {_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1329);
if (testObject instanceof YUITest.TestCase){
                            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1330);
this.fire({ type: this.TEST_CASE_BEGIN_EVENT, testCase: testObject });
                            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1331);
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
                            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1345);
if(this._execNonTestMethod(node, "init", true)){
                                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1346);
return;
                            }
                        }}
                        
                        //some environments don't support setTimeout
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1351);
if (typeof setTimeout != "undefined"){                    
                            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1352);
setTimeout(function(){
                                _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "(anonymous 4)", 1352);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1353);
YUITest.TestRunner._run();
                            }, 0);
                        } else {
                            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1356);
this._run();
                        }
                    } else {
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1359);
this._runTest(node);
                    }
    
                }
            },
            
            _resumeTest : function (segment) {
            
                //get relevant information
                _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "_resumeTest", 1365);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1368);
var node = this._cur;                
                
                //we know there's no more waiting now
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1371);
this._waiting = false;
                
                //if there's no node, it probably means a wait() was called after resume()
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1374);
if (!node){
                    //TODO: Handle in some way?
                    //console.log("wait() called after resume()");
                    //this.fire("error", { testCase: "(unknown)", test: "(unknown)", error: new Error("wait() called after resume()")} );
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1378);
return;
                }
                
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1381);
var testName = node.testObject;
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1382);
var testCase = node.parent.testObject;
            
                //cancel other waits if available
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1385);
if (testCase.__yui_wait){
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1386);
clearTimeout(testCase.__yui_wait);
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1387);
delete testCase.__yui_wait;
                }

                //get the "should" test cases
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1391);
var shouldFail = testName.indexOf("fail:") === 0 ||
                                    (testCase._should.fail || {})[testName];
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1393);
var shouldError = (testCase._should.error || {})[testName];
                
                //variable to hold whether or not the test failed
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1396);
var failed = false;
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1397);
var error = null;
                    
                //try the test
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1400);
try {
                
                    //run the test
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1403);
segment.call(testCase, this._context);                    
                
                    //if the test hasn't already failed and doesn't have any asserts...
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1406);
if(YUITest.Assert._getCount() == 0 && !this._ignoreEmpty){
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1407);
throw new YUITest.AssertionError("Test has no asserts.");
                    }                                                        
                    //if it should fail, and it got here, then it's a fail because it didn't
                     else {_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1410);
if (shouldFail){
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1411);
error = new YUITest.ShouldFail();
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1412);
failed = true;
                    } else {_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1413);
if (shouldError){
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1414);
error = new YUITest.ShouldError();
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1415);
failed = true;
                    }}}
                               
                } catch (thrown){

                    //cancel any pending waits, the test already failed
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1421);
if (testCase.__yui_wait){
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1422);
clearTimeout(testCase.__yui_wait);
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1423);
delete testCase.__yui_wait;
                    }                    
                
                    //figure out what type of error it was
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1427);
if (thrown instanceof YUITest.AssertionError) {
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1428);
if (!shouldFail){
                            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1429);
error = thrown;
                            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1430);
failed = true;
                        }
                    } else {_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1432);
if (thrown instanceof YUITest.Wait){
                    
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1434);
if (typeof thrown.segment == "function"){
                            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1435);
if (typeof thrown.delay == "number"){
                            
                                //some environments don't support setTimeout
                                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1438);
if (typeof setTimeout != "undefined"){
                                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1439);
testCase.__yui_wait = setTimeout(function(){
                                        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "(anonymous 5)", 1439);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1440);
YUITest.TestRunner._resumeTest(thrown.segment);
                                    }, thrown.delay);
                                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1442);
this._waiting = true;
                                } else {
                                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1444);
throw new Error("Asynchronous tests not supported in this environment.");
                                }
                            }
                        }
                        
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1449);
return;
                    
                    } else {
                        //first check to see if it should error
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1453);
if (!shouldError) {                        
                            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1454);
error = new YUITest.UnexpectedError(thrown);
                            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1455);
failed = true;
                        } else {
                            //check to see what type of data we have
                            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1458);
if (typeof shouldError == "string"){
                                
                                //if it's a string, check the error message
                                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1461);
if (thrown.message != shouldError){
                                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1462);
error = new YUITest.UnexpectedError(thrown);
                                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1463);
failed = true;                                    
                                }
                            } else {_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1465);
if (typeof shouldError == "function"){
                            
                                //if it's a function, see if the error is an instance of it
                                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1468);
if (!(thrown instanceof shouldError)){
                                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1469);
error = new YUITest.UnexpectedError(thrown);
                                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1470);
failed = true;
                                }
                            
                            } else {_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1473);
if (typeof shouldError == "object" && shouldError !== null){
                            
                                //if it's an object, check the instance and message
                                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1476);
if (!(thrown instanceof shouldError.constructor) || 
                                        thrown.message != shouldError.message){
                                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1478);
error = new YUITest.UnexpectedError(thrown);
                                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1479);
failed = true;                                    
                                }
                            
                            }}}
                        
                        }
                    }}
                    
                }
                
                //fire appropriate event
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1490);
if (failed) {
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1491);
this.fire({ type: this.TEST_FAIL_EVENT, testCase: testCase, testName: testName, error: error });
                } else {
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1493);
this.fire({ type: this.TEST_PASS_EVENT, testCase: testCase, testName: testName });
                }
                
                //run the tear down
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1497);
this._execNonTestMethod(node.parent, "tearDown", false);
                
                //reset the assert count
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1500);
YUITest.Assert._reset();
                
                //calculate duration
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1503);
var duration = (new Date()) - node._start;
                
                //update results
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1506);
node.parent.results[testName] = { 
                    result: failed ? "fail" : "pass",
                    message: error ? error.getMessage() : "Test passed",
                    type: "test",
                    name: testName,
                    duration: duration
                };
                
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1514);
if (failed){
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1515);
node.parent.results.failed++;
                } else {
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1517);
node.parent.results.passed++;
                }
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1519);
node.parent.results.total++;
    
                //set timeout not supported in all environments
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1522);
if (typeof setTimeout != "undefined"){
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1523);
setTimeout(function(){
                        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "(anonymous 6)", 1523);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1524);
YUITest.TestRunner._run();
                    }, 0);
                } else {
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1527);
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
            
                _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "_handleError", 1545);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1547);
if (this._waiting){
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1548);
this._resumeTest(function(){
                        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "(anonymous 7)", 1548);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1549);
throw error;
                    });
                } else {
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1552);
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
                _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "_runTest", 1565);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1568);
var testName = node.testObject,
                    testCase = node.parent.testObject,
                    test = testCase[testName],
                
                    //get the "should" test cases
                    shouldIgnore = testName.indexOf("ignore:") === 0 ||
                                    !inGroups(testCase.groups, this._groups) ||
                                    (testCase._should.ignore || {})[testName];   //deprecated
                
                //figure out if the test should be ignored or not
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1578);
if (shouldIgnore){
                
                    //update results
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1581);
node.parent.results[testName] = { 
                        result: "ignore",
                        message: "Test ignored",
                        type: "test",
                        name: testName.indexOf("ignore:") === 0 ? testName.substring(7) : testName
                    };
                    
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1588);
node.parent.results.ignored++;
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1589);
node.parent.results.total++;
                
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1591);
this.fire({ type: this.TEST_IGNORE_EVENT,  testCase: testCase, testName: testName });
                    
                    //some environments don't support setTimeout
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1594);
if (typeof setTimeout != "undefined"){                    
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1595);
setTimeout(function(){
                            _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "(anonymous 8)", 1595);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1596);
YUITest.TestRunner._run();
                        }, 0);              
                    } else {
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1599);
this._run();
                    }
    
                } else {
                
                    //mark the start time
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1605);
node._start = new Date();
                
                    //run the setup
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1608);
this._execNonTestMethod(node.parent, "setUp", false);
                    
                    //now call the body of the test
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1611);
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
                _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "getName", 1625);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1626);
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
                _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "setName", 1636);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1637);
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
                _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "add", 1651);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1652);
this.masterSuite.add(testObject);
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1653);
return this;
            },
            
            /**
             * Removes all test objects from the runner.
             * @return {Void}
             * @method clear
             * @static
             */
            clear : function () {
                _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "clear", 1662);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1663);
this.masterSuite = new YUITest.TestSuite("yuitests" + (new Date()).getTime());
            },
            
            /**
             * Indicates if the TestRunner is waiting for a test to resume
             * @return {Boolean} True if the TestRunner is waiting, false if not.
             * @method isWaiting
             * @static
             */
            isWaiting: function() {
                _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "isWaiting", 1672);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1673);
return this._waiting;
            },
            
            /**
             * Indicates that the TestRunner is busy running tests and therefore can't
             * be stopped and results cannot be gathered.
             * @return {Boolean} True if the TestRunner is running, false if not.
             * @method isRunning
             */
            isRunning: function(){
                _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "isRunning", 1682);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1683);
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
                _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "getResults", 1695);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1696);
if (!this._running && this._lastResults){
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1697);
if (typeof format == "function"){
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1698);
return format(this._lastResults);                    
                    } else {
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1700);
return this._lastResults;
                    }
                } else {
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1703);
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
                _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "getCoverage", 1717);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1718);
if (!this._running && typeof _yuitest_coverage == "object"){
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1719);
if (typeof format == "function"){
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1720);
return format(_yuitest_coverage);                    
                    } else {
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1722);
return _yuitest_coverage;
                    }
                } else {
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1725);
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
                _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "callback", 1740);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1741);
var names   = arguments,
                    data    = this._context,
                    that    = this;
                    
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1745);
return function(){
                    _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "(anonymous 9)", 1745);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1746);
for (var i=0; i < arguments.length; i++){
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1747);
data[names[i]] = arguments[i];
                    }
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1749);
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
                _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "resume", 1761);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1762);
if (this._waiting){
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1763);
this._resumeTest(segment || function(){});
                } else {
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1765);
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

                _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "run", 1779);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1781);
options = options || {};
                
                //pointer to runner to avoid scope issues 
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1784);
var runner  = YUITest.TestRunner,
                    oldMode = options.oldMode;
                
                
                //if there's only one suite on the masterSuite, move it up
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1789);
if (!oldMode && this.masterSuite.items.length == 1 && this.masterSuite.items[0] instanceof YUITest.TestSuite){
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1790);
this.masterSuite = this.masterSuite.items[0];
                }                
                
                //determine if there are any groups to filter on
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1794);
runner._groups = (options.groups instanceof Array) ? "," + options.groups.join(",") + "," : "";
                
                //initialize the runner
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1797);
runner._buildTestTree();
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1798);
runner._context = {};
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1799);
runner._root._start = new Date();
                
                //fire the begin event
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1802);
runner.fire(runner.BEGIN_EVENT);
           
                //begin the testing
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1805);
runner._run();
            }    
        });
        
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1809);
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
 
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1822);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "_indexOf", 1837);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1838);
if (haystack.indexOf){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1839);
return haystack.indexOf(needle);
        } else {
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1841);
for (var i=0; i < haystack.length; i++){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1842);
if (haystack[i] === needle){
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1843);
return i;
                }
            }
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1846);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "_some", 1860);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1861);
if (haystack.some){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1862);
return haystack.some(matcher);
        } else {
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1864);
for (var i=0; i < haystack.length; i++){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1865);
if (matcher(haystack[i])){
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1866);
return true;
                }
            }
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1869);
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
        
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "contains", 1882);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1885);
YUITest.Assert._increment();               

        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1887);
if (this._indexOf(haystack, needle) == -1){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1888);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "containsItems", 1902);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1904);
YUITest.Assert._increment();               

        //begin checking values
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1907);
for (var i=0; i < needles.length; i++){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1908);
if (this._indexOf(haystack, needles[i]) == -1){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1909);
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
        
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "containsMatch", 1923);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1926);
YUITest.Assert._increment();               
        //check for valid matcher
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1928);
if (typeof matcher != "function"){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1929);
throw new TypeError("ArrayAssert.containsMatch(): First argument must be a function.");
        }
        
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1932);
if (!this._some(haystack, matcher)){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1933);
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
        
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "doesNotContain", 1947);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1950);
YUITest.Assert._increment();               

        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1952);
if (this._indexOf(haystack, needle) > -1){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1953);
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

        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "doesNotContainItems", 1967);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1970);
YUITest.Assert._increment();               

        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1972);
for (var i=0; i < needles.length; i++){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1973);
if (this._indexOf(haystack, needles[i]) > -1){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1974);
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
        
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "doesNotContainMatch", 1989);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1992);
YUITest.Assert._increment();     
      
        //check for valid matcher
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1995);
if (typeof matcher != "function"){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1996);
throw new TypeError("ArrayAssert.doesNotContainMatch(): First argument must be a function.");
        }
        
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 1999);
if (this._some(haystack, matcher)){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2000);
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
    
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "indexOf", 2014);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2016);
YUITest.Assert._increment();     

        //try to find the value in the array
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2019);
for (var i=0; i < haystack.length; i++){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2020);
if (haystack[i] === needle){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2021);
if (index != i){
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2022);
YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value exists at index " + i + " but should be at index " + index + "."));                    
                }
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2024);
return;
            }
        }
        
        //if it makes it here, it wasn't found at all
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2029);
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
        
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "itemsAreEqual", 2043);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2046);
YUITest.Assert._increment();     
        
        //first make sure they're array-like (this can probably be improved)
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2049);
if (typeof expected != "object" || typeof actual != "object"){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2050);
YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value should be an array."));
        }
        
        //next check array length
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2054);
if (expected.length != actual.length){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2055);
YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Array should have a length of " + expected.length + " but has a length of " + actual.length + "."));
        }
       
        //begin checking values
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2059);
for (var i=0; i < expected.length; i++){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2060);
if (expected[i] != actual[i]){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2061);
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
        
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "itemsAreEquivalent", 2080);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2083);
YUITest.Assert._increment();     

        //make sure the comparator is valid
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2086);
if (typeof comparator != "function"){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2087);
throw new TypeError("ArrayAssert.itemsAreEquivalent(): Third argument must be a function.");
        }
        
        //first check array length
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2091);
if (expected.length != actual.length){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2092);
YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Array should have a length of " + expected.length + " but has a length of " + actual.length));
        }
        
        //begin checking values
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2096);
for (var i=0; i < expected.length; i++){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2097);
if (!comparator(expected[i], actual[i])){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2098);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "isEmpty", 2110);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2111);
YUITest.Assert._increment();     
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2112);
if (actual.length > 0){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2113);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "isNotEmpty", 2124);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2125);
YUITest.Assert._increment();     
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2126);
if (actual.length === 0){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2127);
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
        
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "itemsAreSame", 2142);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2145);
YUITest.Assert._increment();     

        //first check array length
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2148);
if (expected.length != actual.length){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2149);
YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Array should have a length of " + expected.length + " but has a length of " + actual.length));
        }
                    
        //begin checking values
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2153);
for (var i=0; i < expected.length; i++){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2154);
if (expected[i] !== actual[i]){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2155);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "lastIndexOf", 2171);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2174);
for (var i=haystack.length; i >= 0; i--){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2175);
if (haystack[i] === needle){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2176);
if (index != i){
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2177);
YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value exists at index " + i + " but should be at index " + index + "."));                    
                }
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2179);
return;
            }
        }
        
        //if it makes it here, it wasn't found at all
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2184);
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
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2198);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "_formatMessage", 2222);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2223);
if (typeof customMessage == "string" && customMessage.length > 0){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2224);
return customMessage.replace("{message}", defaultMessage);
        } else {
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2226);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "_getCount", 2236);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2237);
return this._asserts;
    },
    
    /**
     * Increments the number of assertions that have been performed.
     * @method _increment
     * @protected
     * @static
     */
    _increment: function(){
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "_increment", 2246);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2247);
this._asserts++;
    },
    
    /**
     * Resets the number of assertions that have been performed to 0.
     * @method _reset
     * @protected
     * @static
     */
    _reset: function(){
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "_reset", 2256);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2257);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "fail", 2270);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2271);
throw new YUITest.AssertionError(YUITest.Assert._formatMessage(message, "Test force-failed."));
    },       
    
    /** 
     * A marker that the test should pass.
     * @method pass
     * @static
     */
    pass : function (message) {
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "pass", 2279);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2280);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "areEqual", 2296);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2297);
YUITest.Assert._increment();
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2298);
if (expected != actual) {
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2299);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "areNotEqual", 2312);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2314);
YUITest.Assert._increment();
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2315);
if (unexpected == actual) {
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2316);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "areNotSame", 2329);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2330);
YUITest.Assert._increment();
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2331);
if (unexpected === actual) {
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2332);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "areSame", 2345);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2346);
YUITest.Assert._increment();
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2347);
if (expected !== actual) {
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2348);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "isFalse", 2364);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2365);
YUITest.Assert._increment();
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2366);
if (false !== actual) {
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2367);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "isTrue", 2379);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2380);
YUITest.Assert._increment();
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2381);
if (true !== actual) {
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2382);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "isNaN", 2398);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2399);
YUITest.Assert._increment();
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2400);
if (!isNaN(actual)){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2401);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "isNotNaN", 2412);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2413);
YUITest.Assert._increment();
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2414);
if (isNaN(actual)){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2415);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "isNotNull", 2427);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2428);
YUITest.Assert._increment();
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2429);
if (actual === null) {
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2430);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "isNotUndefined", 2442);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2443);
YUITest.Assert._increment();
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2444);
if (typeof actual == "undefined") {
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2445);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "isNull", 2457);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2458);
YUITest.Assert._increment();
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2459);
if (actual !== null) {
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2460);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "isUndefined", 2472);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2473);
YUITest.Assert._increment();
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2474);
if (typeof actual != "undefined") {
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2475);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "isArray", 2490);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2491);
YUITest.Assert._increment();
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2492);
var shouldFail = false;
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2493);
if (Array.isArray){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2494);
shouldFail = !Array.isArray(actual);
        } else {
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2496);
shouldFail = Object.prototype.toString.call(actual) != "[object Array]";
        }
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2498);
if (shouldFail){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2499);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "isBoolean", 2510);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2511);
YUITest.Assert._increment();
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2512);
if (typeof actual != "boolean"){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2513);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "isFunction", 2524);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2525);
YUITest.Assert._increment();
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2526);
if (!(actual instanceof Function)){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2527);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "isInstanceOf", 2541);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2542);
YUITest.Assert._increment();
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2543);
if (!(actual instanceof expected)){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2544);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "isNumber", 2555);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2556);
YUITest.Assert._increment();
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2557);
if (typeof actual != "number"){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2558);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "isObject", 2569);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2570);
YUITest.Assert._increment();
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2571);
if (!actual || (typeof actual != "object" && typeof actual != "function")){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2572);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "isString", 2583);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2584);
YUITest.Assert._increment();
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2585);
if (typeof actual != "string"){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2586);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "isTypeOf", 2598);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2599);
YUITest.Assert._increment();
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2600);
if (typeof actualValue != expectedType){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2601);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "throwsError", 2624);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2625);
YUITest.Assert._increment();
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2626);
var error = false;
    
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2628);
try {
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2629);
method();        
        } catch (thrown) {
            
            //check to see what type of data we have
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2633);
if (typeof expectedError == "string"){
                
                //if it's a string, check the error message
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2636);
if (thrown.message != expectedError){
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2637);
error = true;
                }
            } else {_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2639);
if (typeof expectedError == "function"){
            
                //if it's a function, see if the error is an instance of it
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2642);
if (!(thrown instanceof expectedError)){
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2643);
error = true;
                }
            
            } else {_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2646);
if (typeof expectedError == "object" && expectedError !== null){
            
                //if it's an object, check the instance and message
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2649);
if (!(thrown instanceof expectedError.constructor) || 
                        thrown.message != expectedError.message){
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2651);
error = true;
                }
            
            } else { //if it gets here, the argument could be wrong
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2655);
error = true;
            }}}
            
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2658);
if (error){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2659);
throw new YUITest.UnexpectedError(thrown);                    
            } else {
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2661);
return;
            }
        }
        
        //if it reaches here, the error wasn't thrown, which is a bad thing
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2666);
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
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2681);
YUITest.AssertionError = function (message){
    
    /**
     * Error message. Must be duplicated to ensure browser receives it.
     * @type String
     * @property message
     */
    _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "AssertionError", 2681);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2688);
this.message = message;
    
    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2695);
this.name = "Assert Error";
};

_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2698);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "getMessage", 2709);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2710);
return this.message;
    },
    
    /**
     * Returns a string representation of the error.
     * @method toString
     * @return {String} A string representation of the error.
     */
    toString : function () {
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "toString", 2718);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2719);
return this.name + ": " + this.getMessage();
    }

};
/**
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
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2737);
YUITest.ComparisonFailure = function (message, expected, actual){

    //call superclass
    _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "ComparisonFailure", 2737);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2740);
YUITest.AssertionError.call(this, message);
    
    /**
     * The expected value.
     * @type Object
     * @property expected
     */
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2747);
this.expected = expected;
    
    /**
     * The actual value.
     * @type Object
     * @property actual
     */
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2754);
this.actual = actual;
    
    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2761);
this.name = "ComparisonFailure";
    
};

//inherit from YUITest.AssertionError
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2766);
YUITest.ComparisonFailure.prototype = new YUITest.AssertionError;

//restore constructor
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2769);
YUITest.ComparisonFailure.prototype.constructor = YUITest.ComparisonFailure;

/**
 * Returns a fully formatted error for an assertion failure. This message
 * provides information about the expected and actual values.
 * @method getMessage
 * @return {String} A string describing the error.
 */
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2777);
YUITest.ComparisonFailure.prototype.getMessage = function(){
    _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "getMessage", 2777);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2778);
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
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2788);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "JSON", 2798);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2799);
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
    
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "XdebugJSON", 2812);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2814);
var report = {};
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2815);
for (var prop in coverage){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2816);
if (coverage.hasOwnProperty(prop)){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2817);
report[prop] = coverage[prop].lines;
            }
        }

        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2821);
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
 
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2836);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "datesAreEqual", 2846);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2847);
YUITest.Assert._increment();        
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2848);
if (expected instanceof Date && actual instanceof Date){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2849);
var msg = "";
            
            //check years first
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2852);
if (expected.getFullYear() != actual.getFullYear()){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2853);
msg = "Years should be equal.";
            }
            
            //now check months
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2857);
if (expected.getMonth() != actual.getMonth()){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2858);
msg = "Months should be equal.";
            }                
            
            //last, check the day of the month
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2862);
if (expected.getDate() != actual.getDate()){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2863);
msg = "Days of month should be equal.";
            }                
            
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2866);
if (msg.length){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2867);
throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, msg), expected, actual);
            }
        } else {
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2870);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "timesAreEqual", 2882);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2883);
YUITest.Assert._increment();
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2884);
if (expected instanceof Date && actual instanceof Date){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2885);
var msg = "";
            
            //check hours first
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2888);
if (expected.getHours() != actual.getHours()){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2889);
msg = "Hours should be equal.";
            }
            
            //now check minutes
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2893);
if (expected.getMinutes() != actual.getMinutes()){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2894);
msg = "Minutes should be equal.";
            }                
            
            //last, check the seconds
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2898);
if (expected.getSeconds() != actual.getSeconds()){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2899);
msg = "Seconds should be equal.";
            }                
            
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2902);
if (msg.length){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2903);
throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, msg), expected, actual);
            }
        } else {
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2906);
throw new TypeError("YUITest.DateAssert.timesAreEqual(): Expected and actual values must be Date objects.");
        }
    }
    
};
/**
 * Creates a new mock object.
 * @namespace Test
 * @module test
 * @class Mock
 * @constructor
 * @param {Object} template (Optional) An object whose methods
 *      should be stubbed out on the mock object.
 */
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2920);
YUITest.Mock = function(template){

    //use blank object is nothing is passed in
    _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "Mock", 2920);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2923);
template = template || {};
    
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2925);
var mock,
        name;
    
    //try to create mock that keeps prototype chain intact
    //fails in the case of ActiveX objects
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2930);
try {
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2931);
function f(){}
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2932);
f.prototype = template;
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2933);
mock = new f();
    } catch (ex) {
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2935);
mock = {};
    }

    //create stubs for all methods
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2939);
for (name in template){
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2940);
if (template.hasOwnProperty(name)){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2941);
if (typeof template[name] == "function"){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2942);
mock[name] = function(name){
                    _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "]", 2942);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2943);
return function(){
                        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "(anonymous 11)", 2943);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2944);
YUITest.Assert.fail("Method " + name + "() was called but was not expected to be.");
                    };
                }(name);
            }
        }
    }

    //return it
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2952);
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
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2975);
YUITest.Mock.expect = function(mock /*:Object*/, expectation /*:Object*/){

    //make sure there's a place to store the expectations
    _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "expect", 2975);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2978);
if (!mock.__expectations) {
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2979);
mock.__expectations = {};
    }

    //method expectation
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2983);
if (expectation.method){
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2984);
var name = expectation.method,
            args = expectation.args || [],
            result = expectation.returns,
            callCount = (typeof expectation.callCount == "number") ? expectation.callCount : 1,
            error = expectation.error,
            run = expectation.run || function(){},
            runResult,
            i;

        //save expectations
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2994);
mock.__expectations[name] = expectation;
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2995);
expectation.callCount = callCount;
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2996);
expectation.actualCallCount = 0;
            
        //process arguments
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 2999);
for (i=0; i < args.length; i++){
             _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3000);
if (!(args[i] instanceof YUITest.Mock.Value)){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3001);
args[i] = YUITest.Mock.Value(YUITest.Assert.areSame, [args[i]], "Argument " + i + " of " + name + "() is incorrect.");
            }       
        }
    
        //if the method is expected to be called
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3006);
if (callCount > 0){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3007);
mock[name] = function(){   
                _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "]", 3007);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3008);
try {
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3009);
expectation.actualCallCount++;
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3010);
YUITest.Assert.areEqual(args.length, arguments.length, "Method " + name + "() passed incorrect number of arguments.");
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3011);
for (var i=0, len=args.length; i < len; i++){
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3012);
args[i].verify(arguments[i]);
                    }                

                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3015);
runResult = run.apply(this, arguments);
                    
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3017);
if (error){
                        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3018);
throw error;
                    }
                } catch (ex){
                    //route through TestRunner for proper handling
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3022);
YUITest.TestRunner._handleError(ex);
                }

                // Any value provided for 'returns' overrides any value returned
                // by our 'run' function. 
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3027);
return expectation.hasOwnProperty('returns') ? result : runResult;
            };
        } else {
        
            //method should fail if called when not expected
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3032);
mock[name] = function(){
                _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "]", 3032);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3033);
try {
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3034);
YUITest.Assert.fail("Method " + name + "() should not have been called.");
                } catch (ex){
                    //route through TestRunner for proper handling
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3037);
YUITest.TestRunner._handleError(ex);
                }                    
            };
        }
    } else {_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3041);
if (expectation.property){
        //save expectations
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3043);
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
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3055);
YUITest.Mock.verify = function(mock){    
    _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "verify", 3055);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3056);
try {
    
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3058);
for (var name in mock.__expectations){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3059);
if (mock.__expectations.hasOwnProperty(name)){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3060);
var expectation = mock.__expectations[name];
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3061);
if (expectation.method) {
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3062);
YUITest.Assert.areEqual(expectation.callCount, expectation.actualCallCount, "Method " + expectation.method + "() wasn't called the expected number of times.");
                } else {_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3063);
if (expectation.property){
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3064);
YUITest.Assert.areEqual(expectation.value, mock[expectation.property], "Property " + expectation.property + " wasn't set to the correct value."); 
                }}                
            }
        }

    } catch (ex){
        //route through TestRunner for proper handling
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3071);
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
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3085);
YUITest.Mock.Value = function(method, originalArgs, message){
    _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "Value", 3085);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3086);
if (this instanceof YUITest.Mock.Value){
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3087);
this.verify = function(value){
            _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "verify", 3087);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3088);
var args = [].concat(originalArgs || []);
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3089);
args.push(value);
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3090);
args.push(message);
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3091);
method.apply(null, args);
        };
    } else {
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3094);
return new YUITest.Mock.Value(method, originalArgs, message);
    }
};

/**
 * Predefined matcher to match any value.
 * @property Any
 * @static
 * @type Function
 */
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3104);
YUITest.Mock.Value.Any        = YUITest.Mock.Value(function(){});

/**
 * Predefined matcher to match boolean values.
 * @property Boolean
 * @static
 * @type Function
 */
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3112);
YUITest.Mock.Value.Boolean    = YUITest.Mock.Value(YUITest.Assert.isBoolean);

/**
 * Predefined matcher to match number values.
 * @property Number
 * @static
 * @type Function
 */
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3120);
YUITest.Mock.Value.Number     = YUITest.Mock.Value(YUITest.Assert.isNumber);

/**
 * Predefined matcher to match string values.
 * @property String
 * @static
 * @type Function
 */
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3128);
YUITest.Mock.Value.String     = YUITest.Mock.Value(YUITest.Assert.isString);

/**
 * Predefined matcher to match object values.
 * @property Object
 * @static
 * @type Function
 */
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3136);
YUITest.Mock.Value.Object     = YUITest.Mock.Value(YUITest.Assert.isObject);

/**
 * Predefined matcher to match function values.
 * @property Function
 * @static
 * @type Function
 */
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3144);
YUITest.Mock.Value.Function   = YUITest.Mock.Value(YUITest.Assert.isFunction);

/**
 * The ObjectAssert object provides functions to test JavaScript objects
 * for a variety of cases.
 * @namespace Test
 * @module test
 * @class ObjectAssert
 * @static
 */
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3154);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "areEqual", 3166);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3167);
YUITest.Assert._increment();         
        
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3169);
var expectedKeys = YUITest.Object.keys(expected),
            actualKeys = YUITest.Object.keys(actual);
        
        //first check keys array length
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3173);
if (expectedKeys.length != actualKeys.length){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3174);
YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Object should have " + expectedKeys.length + " keys but has " + actualKeys.length));
        }
        
        //then check values
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3178);
for (var name in expected){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3179);
if (expected.hasOwnProperty(name)){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3180);
if (expected[name] != actual[name]){
                    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3181);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "hasKey", 3196);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3197);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "hasKeys", 3209);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3210);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "inheritsKey", 3221);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3222);
YUITest.Assert._increment();               
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3223);
if (!(propertyName in object && !object.hasOwnProperty(propertyName))){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3224);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "inheritsKeys", 3236);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3237);
YUITest.Assert._increment();        
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3238);
for (var i=0; i < properties.length; i++){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3239);
if (!(propertyName in object && !object.hasOwnProperty(properties[i]))){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3240);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "ownsKey", 3253);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3254);
YUITest.Assert._increment();               
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3255);
if (!object.hasOwnProperty(propertyName)){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3256);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "ownsKeys", 3268);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3269);
YUITest.Assert._increment();        
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3270);
for (var i=0; i < properties.length; i++){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3271);
if (!object.hasOwnProperty(properties[i])){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3272);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "ownsNoKeys", 3284);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3285);
YUITest.Assert._increment();  
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3286);
var count = 0,
            name;
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3288);
for (name in object){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3289);
if (object.hasOwnProperty(name)){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3290);
count++;
            }
        }
        
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3294);
if (count !== 0){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3295);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "ownsOrInheritsKey", 3308);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3309);
YUITest.Assert._increment();               
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3310);
if (!(propertyName in object)){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3311);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "ownsOrInheritsKeys", 3323);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3324);
YUITest.Assert._increment();  
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3325);
for (var i=0; i < properties.length; i++){
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3326);
if (!(properties[i] in object)){
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3327);
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
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3342);
YUITest.Results = function(name){

    /**
     * Name of the test, test case, or test suite.
     * @type String
     * @property name
     */
    _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "Results", 3342);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3349);
this.name = name;
    
    /**
     * Number of passed tests.
     * @type int
     * @property passed
     */
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3356);
this.passed = 0;
    
    /**
     * Number of failed tests.
     * @type int
     * @property failed
     */
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3363);
this.failed = 0;
    
    /**
     * Number of errors that occur in non-test methods.
     * @type int
     * @property errors
     */
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3370);
this.errors = 0;
    
    /**
     * Number of ignored tests.
     * @type int
     * @property ignored
     */
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3377);
this.ignored = 0;
    
    /**
     * Number of total tests.
     * @type int
     * @property total
     */
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3384);
this.total = 0;
    
    /**
     * Amount of time (ms) it took to complete testing.
     * @type int
     * @property duration
     */
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3391);
this.duration = 0;
}

/**
 * Includes results from another results object into this one.
 * @param {Test.Results} result The results object to include.
 * @method include
 * @return {void}
 */
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3400);
YUITest.Results.prototype.include = function(results){
    _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "include", 3400);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3401);
this.passed += results.passed;
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3402);
this.failed += results.failed;
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3403);
this.ignored += results.ignored;
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3404);
this.total += results.total;
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3405);
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
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3418);
YUITest.ShouldError = function (message){

    //call superclass
    _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "ShouldError", 3418);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3421);
YUITest.AssertionError.call(this, message || "This test should have thrown an error but didn't.");
    
    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3428);
this.name = "ShouldError";
    
};

//inherit from YUITest.AssertionError
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3433);
YUITest.ShouldError.prototype = new YUITest.AssertionError();

//restore constructor
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3436);
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
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3448);
YUITest.ShouldFail = function (message){

    //call superclass
    _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "ShouldFail", 3448);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3451);
YUITest.AssertionError.call(this, message || "This test should fail but didn't.");
    
    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3458);
this.name = "ShouldFail";
    
};

//inherit from YUITest.AssertionError
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3463);
YUITest.ShouldFail.prototype = new YUITest.AssertionError();

//restore constructor
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3466);
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
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3480);
YUITest.UnexpectedError = function (cause){

    //call superclass
    _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "UnexpectedError", 3480);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3483);
YUITest.AssertionError.call(this, "Unexpected error: " + cause.message);
    
    /**
     * The unexpected error that occurred.
     * @type Error
     * @property cause
     */
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3490);
this.cause = cause;
    
    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3497);
this.name = "UnexpectedError";
    
    /**
     * Stack information for the error (if provided).
     * @type String
     * @property stack
     */
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3504);
this.stack = cause.stack;
    
};

//inherit from YUITest.AssertionError
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3509);
YUITest.UnexpectedError.prototype = new YUITest.AssertionError();

//restore constructor
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3512);
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
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3527);
YUITest.UnexpectedValue = function (message, unexpected){

    //call superclass
    _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "UnexpectedValue", 3527);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3530);
YUITest.AssertionError.call(this, message);
    
    /**
     * The unexpected value.
     * @type Object
     * @property unexpected
     */
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3537);
this.unexpected = unexpected;
    
    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3544);
this.name = "UnexpectedValue";
    
};

//inherit from YUITest.AssertionError
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3549);
YUITest.UnexpectedValue.prototype = new YUITest.AssertionError();

//restore constructor
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3552);
YUITest.UnexpectedValue.prototype.constructor = YUITest.UnexpectedValue;

/**
 * Returns a fully formatted error for an assertion failure. This message
 * provides information about the expected and actual values.
 * @method getMessage
 * @return {String} A string describing the error.
 */
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3560);
YUITest.UnexpectedValue.prototype.getMessage = function(){
    _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "getMessage", 3560);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3561);
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
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3575);
YUITest.Wait = function (segment, delay) {
    
    /**
     * The segment of code to run when the wait is over.
     * @type Function
     * @property segment
     */
    _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "Wait", 3575);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3582);
this.segment = (typeof segment == "function" ? segment : null);

    /**
     * The delay before running the segment of code.
     * @type int
     * @property delay
     */
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3589);
this.delay = (typeof delay == "number" ? delay : 0);        
};


//Setting up our aliases..
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3594);
Y.Test = YUITest;
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3595);
Y.Object.each(YUITest, function(item, name) {
    _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "(anonymous 14)", 3595);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3596);
var name = name.replace('Test', '');
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3597);
Y.Test[name] = item;
});

} //End of else in top wrapper

_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3602);
Y.Assert = YUITest.Assert;
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3603);
Y.Assert.Error = Y.Test.AssertionError;
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3604);
Y.Assert.ComparisonFailure = Y.Test.ComparisonFailure;
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3605);
Y.Assert.UnexpectedValue = Y.Test.UnexpectedValue;
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3606);
Y.Mock = Y.Test.Mock;
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3607);
Y.ObjectAssert = Y.Test.ObjectAssert;
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3608);
Y.ArrayAssert = Y.Test.ArrayAssert;
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3609);
Y.DateAssert = Y.Test.DateAssert;
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3610);
Y.Test.ResultsFormat = Y.Test.TestFormat;

_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3612);
var itemsAreEqual = Y.Test.ArrayAssert.itemsAreEqual;

_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3614);
Y.Test.ArrayAssert.itemsAreEqual = function(expected, actual, message) {
    _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "itemsAreEqual", 3614);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3615);
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
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3628);
Y.assert = function(condition, message){
    _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "assert", 3628);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3629);
Y.Assert._increment();
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3630);
if (!condition){
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3631);
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
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3642);
Y.fail = Y.Assert.fail; 

_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3644);
Y.Test.Runner.once = Y.Test.Runner.subscribe;

_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3646);
Y.Test.Runner.disableLogging = function() {
    _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "disableLogging", 3646);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3647);
Y.Test.Runner._log = false;
};

_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3650);
Y.Test.Runner.enableLogging = function() {
    _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "enableLogging", 3650);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3651);
Y.Test.Runner._log = true;
};

_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3654);
Y.Test.Runner._ignoreEmpty = true;
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3655);
Y.Test.Runner._log = true;

_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3657);
Y.Test.Runner.on = Y.Test.Runner.attach;

//Only allow one instance of YUITest
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3660);
if (!YUI.YUITest) {

    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3662);
if (Y.config.win) {
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3663);
Y.config.win.YUITest = YUITest;
    }

    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3666);
YUI.YUITest = Y.Test;

    
    //Only setup the listeners once.
    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3670);
var logEvent = function(event) {
        
        //data variables
        _yuitest_coverfunc("/home/yui/src/yui3/src/test/build_tmp/test.js", "logEvent", 3670);
_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3673);
var message = "";
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3674);
var messageType = "";
        
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3676);
switch(event.type){
            case this.BEGIN_EVENT:
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3678);
message = "Testing began at " + (new Date()).toString() + ".";
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3679);
messageType = "info";
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3680);
break;
                
            case this.COMPLETE_EVENT:
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3683);
message = Y.substitute("Testing completed at " +
                    (new Date()).toString() + ".\n" +
                    "Passed:{passed} Failed:{failed} " +
                    "Total:{total} ({ignored} ignored)",
                    event.results);
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3688);
messageType = "info";
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3689);
break;
                
            case this.TEST_FAIL_EVENT:
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3692);
message = event.testName + ": failed.\n" + event.error.getMessage();
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3693);
messageType = "fail";
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3694);
break;
                
            case this.TEST_IGNORE_EVENT:
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3697);
message = event.testName + ": ignored.";
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3698);
messageType = "ignore";
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3699);
break;
                
            case this.TEST_PASS_EVENT:
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3702);
message = event.testName + ": passed.";
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3703);
messageType = "pass";
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3704);
break;
                
            case this.TEST_SUITE_BEGIN_EVENT:
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3707);
message = "Test suite \"" + event.testSuite.name + "\" started.";
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3708);
messageType = "info";
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3709);
break;
                
            case this.TEST_SUITE_COMPLETE_EVENT:
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3712);
message = Y.substitute("Test suite \"" +
                    event.testSuite.name + "\" completed" + ".\n" +
                    "Passed:{passed} Failed:{failed} " +
                    "Total:{total} ({ignored} ignored)",
                    event.results);
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3717);
messageType = "info";
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3718);
break;
                
            case this.TEST_CASE_BEGIN_EVENT:
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3721);
message = "Test case \"" + event.testCase.name + "\" started.";
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3722);
messageType = "info";
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3723);
break;
                
            case this.TEST_CASE_COMPLETE_EVENT:
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3726);
message = Y.substitute("Test case \"" +
                    event.testCase.name + "\" completed.\n" +
                    "Passed:{passed} Failed:{failed} " +
                    "Total:{total} ({ignored} ignored)",
                    event.results);
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3731);
messageType = "info";
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3732);
break;
            default:
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3734);
message = "Unexpected event " + event.type;
                _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3735);
message = "info";
        }
        
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3738);
if (Y.Test.Runner._log) {
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3739);
Y.log(message, messageType, "TestRunner");
        }
    }

    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3743);
var i, name;

    _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3745);
for (i in Y.Test.Runner) {
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3746);
name = Y.Test.Runner[i];
        _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3747);
if (i.indexOf('_EVENT') > -1) {
            _yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3748);
Y.Test.Runner.subscribe(name, logEvent);
        }
    }_yuitest_coverline("/home/yui/src/yui3/src/test/build_tmp/test.js", 3750);
;

} //End if for YUI.YUITest


}, '@VERSION@' ,{requires:['event-simulate','event-custom','substitute','json-stringify']});
