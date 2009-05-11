    
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
    
        var l = Y.Lang;
        var xml = "<" + results.type + " name=\"" + xmlEscape(results.name) + "\"";
        
        if (results.type == "test"){
            xml += " result=\"" + xmlEscape(results.result) + "\" message=\"" + xmlEscape(results.message) + "\">";
        } else {
            xml += " passed=\"" + results.passed + "\" failed=\"" + results.failed + "\" ignored=\"" + results.ignored + "\" total=\"" + results.total + "\">";
            Y.Object.each(results, function(value, prop){
                if (l.isObject(value) && !l.isArray(value)){
                    xml += arguments.callee(value);
                }
            });        
        }
    
        xml += "</" + results.type + ">";
        
        return xml;
    
    };