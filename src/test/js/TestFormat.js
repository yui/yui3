    
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
     * Returns test results formatted as a JSON string. Requires JSON utility.
     * @param {Object} result The results object created by TestRunner.
     * @return {String} A JSON-formatted string of results.
     * @namespace Test.Format
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
     * @namespace Test.Format
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
                Y.Object.each(results, function(value, prop){
                    if (l.isObject(value) && !l.isArray(value)){
                        xml += serializeToXML(value);
                    }
                });       
            }

            xml += "</" + results.type + ">";
            
            return xml;    
        }

        return "<?xml version=\"1.0\" charset=\"UTF-8\"?>" + serializeToXML(results);

    };


    /**
     * Returns test results formatted in JUnit XML format.
     * @param {Object} result The results object created by TestRunner.
     * @return {String} An XML-formatted string of results.
     * @namespace Test.Format
     * @method JUnitXML
     * @static
     */
    Y.Test.Format.JUnitXML = function(results) {


        function serializeToJUnitXML(results){
            var l   = Y.Lang,
                xml = "",
                prop;
                
            switch (results.type){
                //equivalent to testcase in JUnit
                case "test":
                    if (results.result != "ignore"){
                        xml = "<testcase name=\"" + xmlEscape(results.name) + "\">";
                        if (results.result == "fail"){
                            xml += "<failure message=\"" + xmlEscape(results.message) + "\"><![CDATA[" + results.message + "]]></failure>";
                        }
                        xml+= "</testcase>";
                    }
                    break;
                    
                //equivalent to testsuite in JUnit
                case "testcase":
                
                    xml = "<testsuite name=\"" + xmlEscape(results.name) + "\" tests=\"" + results.total + "\" failures=\"" + results.failed + "\">";
                    
                    Y.Object.each(results, function(value, prop){
                        if (l.isObject(value) && !l.isArray(value)){
                            xml += serializeToJUnitXML(value);
                        }
                    });             
                    
                    xml += "</testsuite>";
                    break;
                
                case "testsuite":
                    Y.Object.each(results, function(value, prop){
                        if (l.isObject(value) && !l.isArray(value)){
                            xml += serializeToJUnitXML(value);
                        }
                    });             

                    //skip output - no JUnit equivalent                    
                    break;
                    
                case "report":
                
                    xml = "<testsuites>";
                
                    Y.Object.each(results, function(value, prop){
                        if (l.isObject(value) && !l.isArray(value)){
                            xml += serializeToJUnitXML(value);
                        }
                    });             
                    
                    xml += "</testsuites>";            
                
                //no default
            }
            
            return xml;
     
        }

        return "<?xml version=\"1.0\" charset=\"UTF-8\"?>" + serializeToJUnitXML(results);
    };
    