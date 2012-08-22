YUI.add('format-tests', function(Y) {

    var Assert          = Y.Assert,
        ObjectAssert    = Y.ObjectAssert;

    //-------------------------------------------------------------------------
    // Base Test Suite
    //-------------------------------------------------------------------------

    var suite = new Y.Test.Suite("Formatting Tests");

    //-------------------------------------------------------------------------
    // Test Case
    //-------------------------------------------------------------------------

    suite.add(new Y.Test.Case({

        name: "Test Results Formatting Tests",

        setUp : function(){
            this.simpleReport = {
                passed: 2,
                failed: 2,
                ignored: 1,
                total: 5,
                type: "report",
                name: "YUI Test Results",
                duration: 500,

                "Some Suite":{
                    passed: 2,
                    failed: 2,
                    ignored: 1,
                    total: 5,
                    type: "testsuite",
                    name: "Some Suite",
                    duration: 356,

                    "Some Tests": {
                        passed: 2,
                        failed: 2,
                        ignored: 1,
                        total: 5,
                        type: "testcase",
                        name: "Some Tests",
                        duration: 250,

                        test1:{
                            result: "pass",
                            message: "Test passed.",
                            type: "test",
                            name: "test1",
                            duration: 25
                        },

                        test2:{
                            result: "pass",
                            message: "Test passed.",
                            type: "test",
                            name: "test2",
                            duration: 30
                        },

                        test3:{
                            result: "ignore",
                            message: "Test ignored.",
                            type: "test",
                            name: "test3",
                            duration: 35
                        },

                        test4:{
                            result: "fail",
                            message: "Test failed.",
                            type: "test",
                            name: "test4",
                            duration: 45
                        },

                        test5:{
                            result: "fail",
                            message: "Test failed.",
                            type: "test",
                            name: "test5",
                            duration: 50
                        }
                    }
                }
            }
        },

        tearDown : function(){
            delete this.simpleReport;
        },


        /*testJsonFormat : function(){
            var json = Y.Test.Format.JSON(this.report);
            var expectedJson =
            "{\"passed\":2,\"failed\":2,\"ignored\":1,\"total\":5,\"type\":\"report\",\"name\":\"YUI Test Results\"," +
                "\"Some Suite\":{\"passed\":2,\"failed\":2,\"ignored\":1,\"total\":5,\"type\":\"testsuite\",\"name\":\"Some Suite\"," +
                    "\"Some Tests\":{\"passed\":2,\"failed\":2,\"ignored\":1,\"total\":5,\"type\":\"testcase\",\"name\":\"Some Tests\"," +
                        "\"test1\":{\"result\":\"pass\",\"message\":\"Test passed.\",\"type\":\"test\",\"name\":\"test1\"}," +
                        "\"test2\":{\"result\":\"pass\",\"message\":\"Test passed.\",\"type\":\"test\",\"name\":\"test2\"}," +
                        "\"test3\":{\"result\":\"ignore\",\"message\":\"Test ignored.\",\"type\":\"test\",\"name\":\"test3\"}," +
                        "\"test4\":{\"result\":\"fail\",\"message\":\"Test failed.\",\"type\":\"test\",\"name\":\"test4\"}," +
                        "\"test5\":{\"result\":\"fail\",\"message\":\"Test failed.\",\"type\":\"test\",\"name\":\"test5\"}" +
                    "}" +
                "}" +
            "}";
            Assert.areEqual(expectedJson, json, "JSON formatting is incorrect.");
        },*/

        testXmlFormat : function(){
            var xml = Y.Test.Format.XML(this.simpleReport);
            var expectedXml =
                "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<report name=\"YUI Test Results\" duration=\"500\" passed=\"2\" failed=\"2\" ignored=\"1\" total=\"5\">" +
                    "<testsuite name=\"Some Suite\" duration=\"356\" passed=\"2\" failed=\"2\" ignored=\"1\" total=\"5\">" +
                        "<testcase name=\"Some Tests\" duration=\"250\" passed=\"2\" failed=\"2\" ignored=\"1\" total=\"5\">" +
                            "<test name=\"test1\" duration=\"25\" result=\"pass\" message=\"Test passed.\"></test>" +
                            "<test name=\"test2\" duration=\"30\" result=\"pass\" message=\"Test passed.\"></test>" +
                            "<test name=\"test3\" duration=\"35\" result=\"ignore\" message=\"Test ignored.\"></test>" +
                            "<test name=\"test4\" duration=\"45\" result=\"fail\" message=\"Test failed.\"></test>" +
                            "<test name=\"test5\" duration=\"50\" result=\"fail\" message=\"Test failed.\"></test>" +
                        "</testcase>" +
                    "</testsuite>" +
                "</report>";

            Assert.areEqual(expectedXml, xml, "XML formatting is incorrect.");

        },

        testJUnitXmlFormat : function(){
            var xml = Y.Test.Format.JUnitXML(this.simpleReport);
            var expectedXml =
                "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<testsuites>" +
                    "<testsuite name=\"Some Tests\" tests=\"5\" failures=\"2\" time=\"0.25\">" +
                        "<testcase name=\"test1\" time=\"0.025\"></testcase>" +
                        "<testcase name=\"test2\" time=\"0.03\"></testcase>" +
                        "<testcase name=\"test4\" time=\"0.045\">" +
                            "<failure message=\"Test failed.\"><![CDATA[Test failed.]]></failure>" +
                        "</testcase>" +
                        "<testcase name=\"test5\" time=\"0.05\">" +
                            "<failure message=\"Test failed.\"><![CDATA[Test failed.]]></failure>" +
                        "</testcase>" +
                    "</testsuite>" +
                "</testsuites>";


            Assert.areEqual(expectedXml, xml, "JUnit XML formatting is incorrect.");

        },

        testTAPFormat : function(){
            var text = Y.Test.Format.TAP(this.simpleReport);
            var expectedText =
                "1..5\n" +
                "#Begin testsuite Some Suite(2 failed of 5)\n" +
                "#Begin testcase Some Tests(2 failed of 5)\n" +
                "ok 1 - test1\n" +
                "ok 2 - test2\n" +
                "#Ignored test test3\n" +
                "not ok 3 - test4 - Test failed.\n" +
                "not ok 4 - test5 - Test failed.\n" +
                "#End testcase Some Tests\n" +
                "#End testsuite Some Suite\n";

            Assert.areEqual(expectedText, text, "TAP formatting is incorrect.");
        }
    }));


    Y.Test.Runner.add(suite);

});
