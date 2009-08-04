
        
    Y.namespace("Test");
    
    /**
     * A test suite that can contain a collection of TestCase and TestSuite objects.
     * @param {String||Object} data The name of the test suite or an object containing
     *      a name property as well as setUp and tearDown methods.
     * @namespace Test
     * @class Suite
     * @constructor
     */
    Y.Test.Suite = function (data /*:String||Object*/) {
    
        /**
         * The name of the test suite.
         * @type String
         * @property name
         */
        this.name = "";
    
        /**
         * Array of test suites and
         * @private
         */
        this.items = [];
    
        //initialize the properties
        if (Y.Lang.isString(data)){
            this.name = data;
        } else if (Y.Lang.isObject(data)){
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
        add : function (testObject /*:Y.Test.Suite*/) {
            if (testObject instanceof Y.Test.Suite || testObject instanceof Y.Test.Case) {
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
