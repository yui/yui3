    
    Y.namespace("Test.Format");
    
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
    
    /**
     * Contains specific formatting options for test result information.
     * @namespace Test
     * @class Format
     * @static
     */        
    
    /**
     * Returns test results formatted as a JSON string. Requires JSON utility.
     * @param {Object} result The results object created by TestRunner.
     * @return {String} A JSON-formatted string of results.
     * @method JSON
     * @static
     */
    Y.Test.Format.JSON = function(results) {
        return Y.JSON.stringify(results);
    };
    
    /**
     * Returns test results formatted as an XML string.
     * @param {Object} result The results object created by TestRunner.
     * @return {String} An XML-formatted string of results.
     * @method XML
     * @static
     */
    Y.Test.Format.XML = function(results) {

        function serializeToXML(results){
            var l   = Y.Lang,
                xml = "<" + results.type + " name=\"" + xmlEscape(results.name) + "\"";
            
            if (l.isNumber(results.duration)){
                xml += " duration=\"" + results.duration + "\"";
            }
            
            if (results.type == "test"){
                xml += " result=\"" + results.result + "\" message=\"" + xmlEscape(results.message) + "\">";
            } else {
                xml += " passed=\"" + results.passed + "\" failed=\"" + results.failed + "\" ignored=\"" + results.ignored + "\" total=\"" + results.total + "\">";
                Y.Object.each(results, function(value){
                    if (l.isObject(value) && !l.isArray(value)){
                        xml += serializeToXML(value);
                    }
                });       
            }

            xml += "</" + results.type + ">";
            
            return xml;    
        }

        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + serializeToXML(results);

    };


    /**
     * Returns test results formatted in JUnit XML format.
     * @param {Object} result The results object created by TestRunner.
     * @return {String} An XML-formatted string of results.
     * @method JUnitXML
     * @static
     */
    Y.Test.Format.JUnitXML = function(results) {

        function serializeToJUnitXML(results){
            var l   = Y.Lang,
                xml = "";
                
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
                    
                    Y.Object.each(results, function(value){
                        if (l.isObject(value) && !l.isArray(value)){
                            xml += serializeToJUnitXML(value);
                        }
                    });             
                    
                    xml += "</testsuite>";
                    break;
                
                //no JUnit equivalent, don't output anything
                case "testsuite":
                    Y.Object.each(results, function(value){
                        if (l.isObject(value) && !l.isArray(value)){
                            xml += serializeToJUnitXML(value);
                        }
                    });                                                     
                    break;
                    
                //top-level, equivalent to testsuites in JUnit
                case "report":
                
                    xml = "<testsuites>";
                
                    Y.Object.each(results, function(value){
                        if (l.isObject(value) && !l.isArray(value)){
                            xml += serializeToJUnitXML(value);
                        }
                    });             
                    
                    xml += "</testsuites>";            
                
                //no default
            }
            
            return xml;
     
        }

        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + serializeToJUnitXML(results);
    };
    
    /**
     * Returns test results formatted in TAP format.
     * For more information, see <a href="http://testanything.org/">Test Anything Protocol</a>.
     * @param {Object} result The results object created by TestRunner.
     * @return {String} A TAP-formatted string of results.
     * @method TAP
     * @static
     */
    Y.Test.Format.TAP = function(results) {
    
        var currentTestNum = 1;

        function serializeToTAP(results){
            var l   = Y.Lang,
                text = "";
                
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
                                    
                    Y.Object.each(results, function(value){
                        if (l.isObject(value) && !l.isArray(value)){
                            text += serializeToTAP(value);
                        }
                    });             
                    
                    text += "#End testcase " + results.name + "\n";
                    
                    
                    break;
                
                case "testsuite":

                    text = "#Begin testsuite " + results.name + "(" + results.failed + " failed of " + results.total + ")\n";                
                
                    Y.Object.each(results, function(value){
                        if (l.isObject(value) && !l.isArray(value)){
                            text += serializeToTAP(value);
                        }
                    });                                                     

                    text += "#End testsuite " + results.name + "\n";
                    break;

                case "report":
                
                    Y.Object.each(results, function(value){
                        if (l.isObject(value) && !l.isArray(value)){
                            text += serializeToTAP(value);
                        }
                    });             
                    
                //no default
            }
            
            return text;
     
        }

        return "1.." + results.total + "\n" + serializeToTAP(results);
    };
        