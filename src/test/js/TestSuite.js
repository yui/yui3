
    
/**
 * A test suite that can contain a collection of TestCase and TestSuite objects.
 * @param {String||Object} data The name of the test suite or an object containing
 *      a name property as well as setUp and tearDown methods.
 * @namespace Test
 * @class TestSuite
 * @constructor
 */
Test.TestSuite = function (data) {

    /**
     * The name of the test suite.
     * @type String
     * @property name
     */
    this.name = "";

    /**
     * Array of test suites and test cases.
     * @type Array
     * @property items
     * @private
     */
    this.items = [];

    //initialize the properties
    if (typeof data == "string"){
        this.name = data;
    } else if (data instanceof Object){
        for (var prop in data){
            if (data.hasOwnProperty(prop)){
                this[prop] = data[prop];
            }
        }
    }

    //double-check name
    if (this.name === ""){
        this.name = "testSuite" + (+new Date());
    }

};
    
Test.TestSuite.prototype = {
    
    //restore constructor
    constructor: Test.TestSuite,
    
    /**
     * Adds a test suite or test case to the test suite.
     * @param {Test.TestSuite||Test.TestCase} testObject The test suite or test case to add.
     * @return {Void}
     * @method add
     */
    add : function (testObject) {
        if (testObject instanceof Test.TestSuite || testObject instanceof Test.TestCase) {
            this.items.push(testObject);
        }
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
