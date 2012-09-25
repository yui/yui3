
    
/**
 * The Win8 namespace encapsulates functionality that is necessary to run unit tests
 * in a WinJS environment on Windows 8. (WinJS refers to a native HTML/CSS/JS runtime on Win8)
 * @param {JSON||Object} jsonObj A JSON object with atleast a property "tests" that contains an URL of all unit test HTML pages
 * @namespace Test
 * @module test
 * @class WinJS
 * @constructor
 */
YUITest.WinJS = function (jsonObj) {
    this.tests = jsonObj.tests || [];
    this.results = {};

    this.listen();
    
};
    
YUITest.WinJS.prototype = {
    
    //restore constructor
    constructor: YUITest.WinJS,

    //read from localstorage and populate tests array
    read: function() {
        var o = WinJS.Application.local.readText("YUI.Tests", JSON.stringify({
            tests: []
        }));

        this.tests = o.tests;
    },

    //pop the first element off tests array and save it to local storage
    pop: function() {
        this.tests.pop();
    },

    //Listen for TestRunner Events and append to a testResults array
    listen: function() {
        var runner = YUI.YUITest.TestRunner;
        runner.subscribe(runner.COMPLETE_EVENT, function() {
            console.log("Test Suite Completed.")
        });

        runner.subscribe(runner.BEGIN_EVENT, function() {
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
