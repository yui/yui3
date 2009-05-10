    
    Y.namespace("Test.Format");
    
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
        var xml = "<" + results.type + " name=\"" + results.name.replace(/"/g, "&quot;").replace(/'/g, "&apos;") + "\"";
        
        if (results.type == "test"){
            xml += " result=\"" + results.result + "\" message=\"" + results.message + "\">";
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