

//Setting up our aliases..
Y.Test = YUITest;
Y.Object.each(YUITest, function(item, name) {
    var name = name.replace('Test', '');
    Y.Test[name] = item;
});

} //End of else in top wrapper

Y.Assert = YUITest.Assert;
Y.Assert.Error = Y.Test.AssertionError;
Y.Assert.ComparisonFailure = Y.Test.ComparisonFailure;
Y.Assert.UnexpectedValue = Y.Test.UnexpectedValue;
Y.Mock = Y.Test.Mock;
Y.ObjectAssert = Y.Test.ObjectAssert;
Y.ArrayAssert = Y.Test.ArrayAssert;
Y.DateAssert = Y.Test.DateAssert;
Y.Test.ResultsFormat = Y.Test.TestFormat;

var itemsAreEqual = Y.Test.ArrayAssert.itemsAreEqual;

Y.Test.ArrayAssert.itemsAreEqual = function(expected, actual, message) {
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
Y.assert = function(condition, message){
    Y.Assert._increment();
    if (!condition){
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
Y.fail = Y.Assert.fail;

Y.Test.Runner.once = Y.Test.Runner.subscribe;

Y.Test.Runner.disableLogging = function() {
    Y.Test.Runner._log = false;
};

Y.Test.Runner.enableLogging = function() {
    Y.Test.Runner._log = true;
};

Y.Test.Runner._ignoreEmpty = true;
Y.Test.Runner._log = true;

Y.Test.Runner.on = Y.Test.Runner.attach;

//Only allow one instance of YUITest
if (!YUI.YUITest) {

    if (Y.config.win) {
        Y.config.win.YUITest = YUITest;
    }

    YUI.YUITest = Y.Test;


    //Only setup the listeners once.
    var logEvent = function(event) {

        //data variables
        var message = "";
        var messageType = "";

        switch(event.type){
            case this.BEGIN_EVENT:
                message = "Testing began at " + (new Date()).toString() + ".";
                messageType = "info";
                break;

            case this.COMPLETE_EVENT:
                message = Y.Lang.sub("Testing completed at " +
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
                message = Y.Lang.sub("Test suite \"" +
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
                message = Y.Lang.sub("Test case \"" +
                    event.testCase.name + "\" completed.\n" +
                    "Passed:{passed} Failed:{failed} " +
                    "Total:{total} ({ignored} ignored)",
                    event.results);
                messageType = "info";
                break;
            default:
                message = "Unexpected event " + event.type;
                messageType = "info";
        }

        if (Y.Test.Runner._log) {
            Y.log(message, messageType, "TestRunner");
        }
    };

    var i, name;

    for (i in Y.Test.Runner) {
        name = Y.Test.Runner[i];
        if (i.indexOf('_EVENT') > -1) {
            Y.Test.Runner.subscribe(name, logEvent);
        }
    };

} //End if for YUI.YUITest
