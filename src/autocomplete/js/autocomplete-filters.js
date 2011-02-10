/**
 * Provides pre-built result matching filters for AutoComplete.
 *
 * @module autocomplete
 * @submodule autocomplete-filters
 * @class AutoCompleteFilters
 * @static
 */

var YArray     = Y.Array,
    YObject    = Y.Object,
    WordBreak  = Y.Text.WordBreak,

Filters = Y.mix(Y.namespace('AutoCompleteFilters'), {
    // -- Public Methods -------------------------------------------------------

    /**
     * Returns an array of results that contain all of the characters in the
     * query, in any order (not necessarily consecutive). Case-insensitive.
     *
     * @method charMatch
     * @param {String} query Query to match
     * @param {Array} results Results to filter
     * @return {Array} Filtered results
     * @static
     */
    charMatch: function (query, results, caseSensitive) {
        // The caseSensitive parameter is only intended for use by
        // charMatchCase(). It's intentionally undocumented.

        var queryChars = YArray.unique((caseSensitive ? query :
                query.toLowerCase()).split(''));

        return YArray.filter(results, function (result) {
            result = result.text;

            if (!caseSensitive) {
                result = result.toLowerCase();
            }

            return YArray.every(queryChars, function (chr) {
                return result.indexOf(chr) !== -1;
            });
        });
    },

    /**
     * Case-sensitive version of <code>charMatch()</code>.
     *
     * @method charMatchCase
     * @param {String} query Query to match
     * @param {Array} results Results to filter
     * @return {Array} Filtered results
     * @static
     */
    charMatchCase: function (query, results) {
        return Filters.charMatch(query, results, true);
    },

    /**
     * Returns an array of results that contain the complete query as a phrase.
     * Case-insensitive.
     *
     * @method phraseMatch
     * @param {String} query Query to match
     * @param {Array} results Results to filter
     * @return {Array} Filtered results
     * @static
     */
    phraseMatch: function (query, results, caseSensitive) {
        // The caseSensitive parameter is only intended for use by
        // phraseMatchCase(). It's intentionally undocumented.

        if (!caseSensitive) {
            query = query.toLowerCase();
        }

        return YArray.filter(results, function (result) {
            return (caseSensitive ? result.text : result.text.toLowerCase()).indexOf(query) !== -1;
        });
    },

    /**
     * Case-sensitive version of <code>phraseMatch()</code>.
     *
     * @method phraseMatchCase
     * @param {String} query Query to match
     * @param {Array} results Results to filter
     * @return {Array} Filtered results
     * @static
     */
    phraseMatchCase: function (query, results) {
        return Filters.phraseMatch(query, results, true);
    },

    /**
     * Returns an array of results that start with the complete query as a
     * phrase. Case-insensitive.
     *
     * @method startsWith
     * @param {String} query Query to match
     * @param {Array} results Results to filter
     * @return {Array} Filtered results
     * @static
     */
    startsWith: function (query, results, caseSensitive) {
        // The caseSensitive parameter is only intended for use by
        // startsWithCase(). It's intentionally undocumented.

        if (!caseSensitive) {
            query = query.toLowerCase();
        }

        return YArray.filter(results, function (result) {
            return (caseSensitive ? result.text : result.text.toLowerCase()).indexOf(query) === 0;
        });
    },

    /**
     * Case-sensitive version of <code>startsWith()</code>.
     *
     * @method startsWithCase
     * @param {String} query Query to match
     * @param {Array} results Results to filter
     * @return {Array} Filtered results
     * @static
     */
    startsWithCase: function (query, results) {
        return Filters.startsWith(query, results, true);
    },

    /**
     * Returns an array of results that contain all of the words in the query,
     * in any order. Non-word characters like whitespace and certain punctuation
     * are ignored. Case-insensitive.
     *
     * @method wordMatch
     * @param {String} query Query to match
     * @param {Array} results Results to filter
     * @return {Array} Filtered results
     * @static
     */
    wordMatch: function (query, results, caseSensitive) {
        // The caseSensitive parameter is only intended for use by
        // wordMatchCase(). It's intentionally undocumented.

        var options    = {ignoreCase: !caseSensitive},
            queryWords = WordBreak.getUniqueWords(query, options);

        return YArray.filter(results, function (result) {
            // Convert resultWords array to a hash for fast lookup.
            var resultWords = YArray.hash(WordBreak.getUniqueWords(result.text,
                                options));

            return YArray.every(queryWords, function (word) {
                return YObject.owns(resultWords, word);
            });
        });
    },

    /**
     * Case-sensitive version of <code>wordMatch()</code>.
     *
     * @method wordMatchCase
     * @param {String} query Query to match
     * @param {Array} results Results to filter
     * @return {Array} Filtered results
     * @static
     */
    wordMatchCase: function (query, results) {
        return Filters.wordMatch(query, results, true);
    },

    /**
     * Returns an array of results where all the words of the query are partially found in any word of the result. 
     * Non-word characters like whitespace and certain punctuation are ignored. Case-insensitive.
     * This is basically a combination of <code>wordMatch()</code> (by ignoring whitespace and word order) and <code>phraseMatch()</code> (by allowing partial matching instead of whole words).
     * Example use case: Trying to find personal names independently of name order (Western or Eastern order)  and supporting immediate feedback by allowing partial occurences. So queries like "J. Doe" and "Deo, John" and "J. D." would all not exclude "John Doe".
     *
     * @method partialWord
     * @param {String} query Query to match
     * @param {Array} results Results to filter
     * @return {Array} Filtered results
     * @static
     */
    partialWord: function (query, results, caseSensitive) {
        // The caseSensitive parameter is only intended for use by
        // partialWordCase(). It's intentionally undocumented.
	
        if (query == '') return results; // performance optimization because the following calls will not have any effect in this case anyway
	
        if (!caseSensitive) {
            query = query.toLowerCase();
        }

        var queryWords = WordBreak.getUniqueWords(query);

        return YArray.filter(results, function (result) {
            var resultWords = WordBreak.getUniqueWords(caseSensitive ? result.text : result.text.toLowerCase());

            return queryWords.every(function (queryWord) {
                return resultWords.some(function (resultWord) {
                    return resultWord.indexOf(queryWord) !== -1;
                });
            });
        });
    },

    /**
     * Case-sensitive version of <code>partialWord()</code>.
     *
     * @method partialWordCase
     * @param {String} query Query to match
     * @param {Array} results Results to filter
     * @return {Array} Filtered results
     * @static
     */
    partialWordCase: function (query, results) {
        return Filters.partialWord(query, results, true);
    }
});
