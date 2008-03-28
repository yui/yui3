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