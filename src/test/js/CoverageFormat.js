/**
 * An object object containing coverage result formatting methods.
 * @namespace Test
 * @module test
 * @class CoverageFormat
 * @static
 */
YUITest.CoverageFormat = {

    /**
     * Returns the coverage report in JSON format. This is the straight
     * JSON representation of the native coverage report.
     * @param {Object} coverage The coverage report object.
     * @return {String} A JSON-formatted string of coverage data.
     * @method JSON
     * @namespace Test.CoverageFormat
     */
    JSON: function(coverage){
        return YUITest.Util.JSON.stringify(coverage);
    },

    /**
     * Returns the coverage report in a JSON format compatible with
     * Xdebug. See <a href="http://www.xdebug.com/docs/code_coverage">Xdebug Documentation</a>
     * for more information. Note: function coverage is not available
     * in this format.
     * @param {Object} coverage The coverage report object.
     * @return {String} A JSON-formatted string of coverage data.
     * @method XdebugJSON
     * @namespace Test.CoverageFormat
     */
    XdebugJSON: function(coverage){

        var report = {};
        for (var prop in coverage){
            if (coverage.hasOwnProperty(prop)){
                report[prop] = coverage[prop].lines;
            }
        }

        return YUITest.Util.JSON.stringify(coverage);
    }

};
