YUI.add('autocomplete-filters', function (Y) {

/**
 * Provides pre-built result matching filters for AutoComplete.
 *
 * @module autocomplete
 * @submodule autocomplete-filters
 * @class AutoComplete.Filters
 * @static
 */

var YArray = Y.Array;

Y.namespace('AutoComplete').Filters = {
    // -- Public Methods -------------------------------------------------------

    /**
     * Returns an array of results that contain the specified query.
     * Case-insensitive.
     *
     * @method contains
     * @param {String} query query to match
     * @param {Array} results results to filter
     * @return {Array} filtered results
     * @static
     */
    contains: function (query, results) {
        var queryLower = query.toLowerCase();

        return YArray.filter(results, function (result) {
            return result.toLowerCase().indexOf(queryLower) !== -1;
        });
    },

    /**
     * Case-sensitive version of <code>contains()</code>.
     *
     * @method containsCase
     * @param {String} query query to match
     * @param {Array} results results to filter
     * @return {Array} filtered results
     * @static
     */
    containsCase: function (query, results) {
        return YArray.filter(results, function (result) {
            return result.indexOf(query) !== -1;
        });
    },

    /**
     * Returns an array of results that start with the specified query.
     * Case-insensitive.
     *
     * @method startsWith
     * @param {String} query query to match
     * @param {Array} results results to filter
     * @return {Array} filtered results
     * @static
     */
    startsWith: function (query, results) {
        var queryLower = query.toLowerCase();

        return YArray.filter(results, function (result) {
            return result.toLowerCase().indexOf(queryLower) === 0;
        });
    },

    /**
     * Case-sensitive version of <code>startsWith()</code>.
     *
     * @method startsWithCase
     * @param {String} query query to match
     * @param {Array} results results to filter
     * @return {Array} filtered results
     * @static
     */
    startsWithCase: function (query, results) {
        return YArray.filter(results, function (result) {
            return result.indexOf(query) === 0;
        });
    },

    /**
     * Returns an array of results that contain a subset of any or all of the
     * characters in the query, in any order. Case-insensitive.
     *
     * @method subset
     * @param {String} query query to match
     * @param {Array} results results to filter
     * @return {Array} filtered results
     * @static
     */
    subset: function (query, results) {
        var queryChars = YArray.unique(query.toLowerCase().split(''));

        return YArray.filter(results, function (result) {
            var resultLower = result.toLowerCase();

            return YArray.every(queryChars, function (chr) {
                return resultLower.indexOf(chr) !== -1;
            });
        });
    },

    /**
     * Case-sensitive version of <code>subset()</code>.
     *
     * @method subsetCase
     * @param {String} query query to match
     * @param {Array} results results to filter
     * @return {Array} filtered results
     * @static
     */
    subsetCase: function (query, results) {
        var queryChars = YArray.unique(query.split(''));

        return YArray.filter(results, function (result) {
            return YArray.every(queryChars, function (chr) {
                return result.indexOf(chr) !== -1;
            });
        });
    }
};

}, '@VERSION@', {
    requires: ['autocomplete-base', 'collection']
});
