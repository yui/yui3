YUI.add('autocomplete-filters', function (Y) {

/**
 * Provides pre-built result matching filters and highlighters for AutoComplete.
 *
 * @module autocomplete
 * @submodule autocomplete-filters
 * @class AutoComplete.Filters
 * @static
 */

var YArray = Y.Array;

Y.namespace('AutoComplete').Filters = {
    /**
     * Returns an array of results that contain the specified query.
     * Case-insensitive.
     *
     * @method contains
     * @param {String} query query to match
     * @param {Array} results results to filter
     * @return {Array} filtered results
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
     */
    startsWithCase: function (query, results) {
        return YArray.filter(results, function (result) {
            return result.indexOf(query) === 0;
        });
    }
};

}, '@VERSION@', {
    requires: ['autocomplete-base', 'collection']
});
