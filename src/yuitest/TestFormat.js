(function(){

    var M = function(Y){
      
        Y.namespace("Test.Format");
 
        /**
         * Returns test results formatted as a JSON string. Requires JSON utility.
         * @param {Object} result The results object created by TestRunner.
         * @return {String} A JSON-formatted string of results.
         * @method Test.Format.JSON
         * @static
         */
        Y.Test.Format.JSON = function(results /*:Object*/) /*:String*/ {
            return Y.JSON.stringify(results);
        };
        
        /**
         * Returns test results formatted as an XML string.
         * @param {Object} result The results object created by TestRunner.
         * @return {String} An XML-formatted string of results.
         * @method Test.Format.XML
         * @static
         */
        Y.Test.Format.XML = function(results /*:Object*/) /*:String*/ {
        
            var l = Y.Lang;
            var xml /*:String*/ = "<" + results.type + " name=\"" + results.name.replace(/"/g, "&quot;").replace(/'/g, "&apos;") + "\"";
            
            if (results.type == "test"){
                xml += " result=\"" + results.result + "\" message=\"" + results.message + "\">";
            } else {
                xml += " passed=\"" + results.passed + "\" failed=\"" + results.failed + "\" ignored=\"" + results.ignored + "\" total=\"" + results.total + "\">";
                for (var prop in results) {
                    if (Y.Object.owns(results, prop) && l.isObject(results[prop]) && !l.isArray(results[prop])){
                        xml += arguments.callee(results[prop]);
                    }
                }        
            }
        
            xml += "</" + results.type + ">";
            
            return xml;
        
        };
    };
    
    YUI.add("testformat", M, "@VERSION@");
    
})();
