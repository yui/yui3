/**
 * <p>
 * Provides pre-built accent-folding result highlighters for AutoComplete.
 * </p>
 *
 * <p>
 * These highlighters are similar to the ones provided by the
 * <code>autocomplete-highlighters</code> module, but use accent-aware
 * comparisons. For example, "resume" and "résumé" will be considered equal when
 * using the accent-folding highlighters.
 * </p>
 *
 * @module autocomplete
 * @submodule autocomplete-highlighters-accentfold
 */

/**
 * @class AutoCompleteHighlighters
 * @static
 */

var Highlight = Y.Highlight,
    YArray    = Y.Array;

Y.mix(Y.namespace('AutoCompleteHighlighters'), {
    /**
     * Accent-folding version of <code>charMatch()</code>.
     *
     * @method charMatchFold
     * @param {String} query Query to match
     * @param {Array} results Results to highlight
     * @return {Array} Highlighted results
     * @static
     */
    charMatchFold: function (query, results) {
        var queryChars = YArray.unique(query.split(''));

        return YArray.map(results, function (result) {
            return Highlight.allFold(result, queryChars);
        });
    },

    /**
     * Accent-folding version of <code>phraseMatch()</code>.
     *
     * @method phraseMatchFold
     * @param {String} query Query to match
     * @param {Array} results Results to highlight
     * @return {Array} Highlighted results
     * @static
     */
    phraseMatchFold: function (query, results) {
        return YArray.map(results, function (result) {
            return Highlight.allFold(result, [query]);
        });
    },

    /**
     * Accent-folding version of <code>startsWith()</code>.
     *
     * @method startsWithFold
     * @param {String} query Query to match
     * @param {Array} results Results to highlight
     * @return {Array} Highlighted results
     * @static
     */
    startsWithFold: function (query, results) {
        return YArray.map(results, function (result) {
            return Highlight.allFold(result, [query], {
                startsWith: true
            });
        });
    },

    /**
     * Accent-folding version of <code>wordMatch()</code>.
     *
     * @method wordMatchFold
     * @param {String} query Query to match
     * @param {Array} results Results to highlight
     * @return {Array} Highlighted results
     * @static
     */
    wordMatchFold: function (query, results) {
        return YArray.map(results, function (result) {
            return Highlight.wordsFold(result, query);
        });
    }
});
