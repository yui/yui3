/**
 * An object object containing test result formatting methods.
 * @namespace Test
 * @module test
 * @class TestFormat
 * @static
 */
YUITest.TestFormat = function(){

    /* (intentionally not documented)
     * Basic XML escaping method. Replaces quotes, less-than, greater-than,
     * apostrophe, and ampersand characters with their corresponding entities.
     * @param {String} text The text to encode.
     * @return {String} The XML-escaped text.
     */
    function xmlEscape(text){

        return text.replace(/[<>"'&]/g, function(value){
            switch(value){
                case "<":   return "&lt;";
                case ">":   return "&gt;";
                case "\"":  return "&quot;";
                case "'":   return "&apos;";
                case "&":   return "&amp;";
            }
        });

    }


    return {

        /**
         * Returns test results formatted as a JSON string. Requires JSON utility.
         * @param {Object} result The results object created by TestRunner.
         * @return {String} A JSON-formatted string of results.
         * @method JSON
         * @static
         */
        JSON: function(results) {
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

            function serializeToXML(results){
                var xml = "<" + results.type + " name=\"" + xmlEscape(results.name) + "\"";

                if (typeof(results.duration)=="number"){
                    xml += " duration=\"" + results.duration + "\"";
                }

                if (results.type == "test"){
                    xml += " result=\"" + results.result + "\" message=\"" + xmlEscape(results.message) + "\">";
                } else {
                    xml += " passed=\"" + results.passed + "\" failed=\"" + results.failed + "\" ignored=\"" + results.ignored + "\" total=\"" + results.total + "\">";
                    for (var prop in results){
                        if (results.hasOwnProperty(prop)){
                            if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                xml += serializeToXML(results[prop]);
                            }
                        }
                    }
                }

                xml += "</" + results.type + ">";

                return xml;
            }

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

            function serializeToJUnitXML(results){
                var xml = "";

                switch (results.type){
                    //equivalent to testcase in JUnit
                    case "test":
                        if (results.result != "ignore"){
                            xml = "<testcase name=\"" + xmlEscape(results.name) + "\" time=\"" + (results.duration/1000) + "\">";
                            if (results.result == "fail"){
                                xml += "<failure message=\"" + xmlEscape(results.message) + "\"><![CDATA[" + results.message + "]]></failure>";
                            }
                            xml+= "</testcase>";
                        }
                        break;

                    //equivalent to testsuite in JUnit
                    case "testcase":

                        xml = "<testsuite name=\"" + xmlEscape(results.name) + "\" tests=\"" + results.total + "\" failures=\"" + results.failed + "\" time=\"" + (results.duration/1000) + "\">";

                        for (var prop in results){
                            if (results.hasOwnProperty(prop)){
                                if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                    xml += serializeToJUnitXML(results[prop]);
                                }
                            }
                        }

                        xml += "</testsuite>";
                        break;

                    //no JUnit equivalent, don't output anything
                    case "testsuite":
                        for (var prop in results){
                            if (results.hasOwnProperty(prop)){
                                if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                    xml += serializeToJUnitXML(results[prop]);
                                }
                            }
                        }
                        break;

                    //top-level, equivalent to testsuites in JUnit
                    case "report":

                        xml = "<testsuites>";

                        for (var prop in results){
                            if (results.hasOwnProperty(prop)){
                                if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                    xml += serializeToJUnitXML(results[prop]);
                                }
                            }
                        }

                        xml += "</testsuites>";

                    //no default
                }

                return xml;

            }

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

            var currentTestNum = 1;

            function serializeToTAP(results){
                var text = "";

                switch (results.type){

                    case "test":
                        if (results.result != "ignore"){

                            text = "ok " + (currentTestNum++) + " - " + results.name;

                            if (results.result == "fail"){
                                text = "not " + text + " - " + results.message;
                            }

                            text += "\n";
                        } else {
                            text = "#Ignored test " + results.name + "\n";
                        }
                        break;

                    case "testcase":

                        text = "#Begin testcase " + results.name + "(" + results.failed + " failed of " + results.total + ")\n";

                        for (var prop in results){
                            if (results.hasOwnProperty(prop)){
                                if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                    text += serializeToTAP(results[prop]);
                                }
                            }
                        }

                        text += "#End testcase " + results.name + "\n";


                        break;

                    case "testsuite":

                        text = "#Begin testsuite " + results.name + "(" + results.failed + " failed of " + results.total + ")\n";

                        for (var prop in results){
                            if (results.hasOwnProperty(prop)){
                                if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                    text += serializeToTAP(results[prop]);
                                }
                            }
                        }

                        text += "#End testsuite " + results.name + "\n";
                        break;

                    case "report":

                        for (var prop in results){
                            if (results.hasOwnProperty(prop)){
                                if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                    text += serializeToTAP(results[prop]);
                                }
                            }
                        }

                    //no default
                }

                return text;

            }

            return "1.." + results.total + "\n" + serializeToTAP(results);
        }

    };
}();
