

    Y.namespace("Coverage.Format");

    /**
     * Contains specific formatting options for coverage information.
     * @namespace Coverage
     * @class Format
     * @static
     */
    
    /**
     * Returns the coverage report in JSON format. This is the straight
     * JSON representation of the native coverage report.
     * @param {Object} coverage The coverage report object.
     * @return {String} A JSON-formatted string of coverage data.
     * @method JSON
     * @static
     */
    Y.Coverage.Format.JSON = function(coverage){
        return Y.JSON.stringify(coverage);
    };

    /**
     * Returns the coverage report in a JSON format compatible with
     * Xdebug. See <a href="http://www.xdebug.com/docs/code_coverage">Xdebug Documentation</a>
     * for more information. Note: function coverage is not available
     * in this format.
     * @param {Object} coverage The coverage report object.
     * @return {String} A JSON-formatted string of coverage data.
     * @method XdebugJSON
     * @static
     */
    Y.Coverage.Format.XdebugJSON = function(coverage){
        var report = {};
        Y.Object.each(coverage, function(value, name){
            report[name] = coverage[name].lines;
        });
        return Y.JSON.stringify(report);        
    };


  