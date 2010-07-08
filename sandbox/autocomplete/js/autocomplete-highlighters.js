YUI.add('autocomplete-highlighters', function (Y) {

/**
 * <p>
 * Provides pre-built result highlighters for AutoComplete.
 * </p>
 *
 * <p>
 * All highlighters first escape any special HTML characters in the result
 * string and then highlight the appropriate portions of the string by wrapping
 * them in a
 * <code>&lt;strong class="yui3-autocomplete-highlight"&gt;&lt;/strong&gt;</code>
 * element.
 * </p>
 *
 * @module autocomplete
 * @submodule autocomplete-highlighters
 * @class AutoComplete.Highlighters
 * @static
 */

var AutoComplete = Y.AutoComplete,
    YArray       = Y.Array,
    escapeHTML   = AutoComplete._escapeHTML,
    escapeRegExp = AutoComplete._escapeRegExp,

    EMPTY_OBJECT = {}, // to avoid re-creating a new empty object whenever I need one

Highlighters = {
    // -- Protected Properties -------------------------------------------------

    /**
     * Regular expression template for highlighting start-of-string matches
     * (i.e., only matches that occur at the beginning of a string). The
     * placeholder <code>%needles</code> will be replaced with a list of needles
     * to match, joined by <code>|</code> characters.
     *
     * @property _START_REGEX
     * @type {String}
     * @protected
     * @static
     * @final
     */
    _START_REGEX: '^(%needles)',

    /**
     * Replacement template for start-of-string matches. Use regex match
     * placeholders to insert matched values.
     *
     * @property _START_REPLACE
     * @type {String}
     * @protected
     * @static
     * @final
     */
    _START_REPLACE: '<strong class="yui3-autocomplete-highlight">$1</strong>',

    /**
     * Regular expression template for highlighting subword matches (i.e.,
     * matches that can occur within a larger word). The placeholder
     * <code>%needles</code> will be replaced with a list of needles to match,
     * joined by <code>|</code> characters.
     *
     * @property _SUBWORD_REGEX
     * @type {String}
     * @protected
     * @static
     * @final
     */
    _SUBWORD_REGEX: '(%needles)',

    /**
     * Replacement template for subword matches. Use regex match placeholders to
     * insert matched values.
     *
     * @property _SUBWORD_REPLACE
     * @type {String}
     * @protected
     * @static
     * @final
     */
    _SUBWORD_REPLACE: '<strong class="yui3-autocomplete-highlight">$1</strong>',

    /**
     * Regular expression template for highlighting word matches (i.e., matches
     * bounded on both sides by a non-word character or string start/end). The
     * placeholder <code>%needles</code> will be replaced with a list of needles
     * to match, joined by <code>|</code> characters.
     *
     * @property _WORD_REGEX
     * @type {String}
     * @protected
     * @static
     * @final
     */
    _WORD_REGEX: '(^|\\W)(%needles)(\\W|$)',

    /**
     * Replacement template for word matches. Use regex match placeholders to
     * insert matched values.
     *
     * @property _WORD_REPLACE
     * @type {String}
     * @protected
     * @static
     * @final
     */
    _WORD_REPLACE: '$1<strong class="yui3-autocomplete-highlight">$2</strong>$3',

    // -- Public Methods -------------------------------------------------------

    /**
     * Highlights any individual query character that occurs anywhere in a
     * result. Case-insensitive.
     *
     * @method charMatch
     * @param {String} query Query to match
     * @param {Array} results Results to highlight
     * @return {Array} Highlighted results
     * @static
     */
    charMatch: function (query, results, caseSensitive) {
        // The caseSensitive parameter is only intended for use by
        // charMatchCase(). It's intentionally undocumented.

        var queryChars = YArray.unique((caseSensitive ? query :
                query.toLowerCase()).split(''));

        return YArray.map(results, function (result) {
            return Highlighters._highlight(result, queryChars, {
                caseSensitive: caseSensitive,
                subWordMatch : true
            });
        });
    },

    /**
     * Case-sensitive version of <code>charMatch()</code>.
     *
     * @method charMatchCase
     * @param {String} query Query to match
     * @param {Array} results Results to highlight
     * @return {Array} Highlighted results
     * @static
     */
    charMatchCase: function (query, results) {
        return Highlighters.charMatch(query, results, true);
    },

    /**
     * Highlights the complete query as a phrase anywhere within a result.
     * Case-insensitive.
     *
     * @method phraseMatch
     * @param {String} query Query to match
     * @param {Array} results Results to highlight
     * @return {Array} Highlighted results
     * @static
     */
    phraseMatch: function (query, results, caseSensitive) {
        // The caseSensitive parameter is only intended for use by
        // phraseMatchCase(). It's intentionally undocumented.

        return YArray.map(results, function (result) {
            return Highlighters._highlight(result, [query], {
                caseSensitive: caseSensitive
            });
        });
    },

    /**
     * Case-sensitive version of <code>phraseMatch()</code>.
     *
     * @method phraseMatchCase
     * @param {String} query Query to match
     * @param {Array} results Results to highlight
     * @return {Array} Highlighted results
     * @static
     */
    phraseMatchCase: function (query, results) {
        return Highlighters.phraseMatch(query, results, true);
    },

    /**
     * Highlights the complete query as a phrase at the beginning of a result.
     * Case-insensitive.
     *
     * @method startsWith
     * @param {String} query Query to match
     * @param {Array} results Results to highlight
     * @return {Array} Highlighted results
     * @static
     */
    startsWith: function (query, results, caseSensitive) {
        // The caseSensitive parameter is only intended for use by
        // startsWithCase(). It's intentionally undocumented.

        return YArray.map(results, function (result) {
            return Highlighters._highlight(result, [query], {
                caseSensitive: caseSensitive,
                startMatch   : true
            });
        });
    },

    /**
     * Case-sensitive version of <code>startsWith()</code>.
     *
     * @method startsWithCase
     * @param {String} query Query to match
     * @param {Array} results Results to highlight
     * @return {Array} Highlighted results
     * @static
     */
    startsWithCase: function (query, results) {
        return Highlighters.startsWith(query, results, true);
    },

    /**
     * Highlights individual words in results that are also in the query.
     * Non-word characters like punctuation are ignored. Case-insensitive.
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

        var queryWords = AutoComplete.getWords(query, true);

        return YArray.map(results, function (result) {
            return Highlighters._highlight(result, queryWords, {
                caseSensitive: caseSensitive
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
        return Highlighters.wordMatch(query, results, true);
    },

    // -- Protected Methods ----------------------------------------------------

    /**
     * Highlights occurrences in the <em>haystack</em> string of the items in
     * the <em>needles</em> array. The returned string will have all HTML
     * characters escaped except for the highlighting markup.
     *
     * @method _highlight
     * @param {String} haystack String to apply highlighting to.
     * @param {Array} needles Array containing strings that should be
     *   highlighted.
     * @param {Object} options (optional) Options object, which may contain
     *   zero or more of the following properties:
     *
     * <dl>
     *   <dt>caseSensitive (Boolean)</dt>
     *   <dd>
     *     If <code>true</code>, matching will be case-sensitive. Default is
     *     <code>false</code>.
     *   </dd>
     *
     *   <dt>startMatch (Boolean)</dt>
     *   <dd>
     *     If <code>true</code>, only matches at the start of the haystack will
     *     be highlighted. Default is <code>false</code>.
     *   </dd>
     *
     *   <dt>subWordMatch (Boolean)</dt>
     *   <dd>
     *     If <code>true</code>, subword matches (i.e., matches that aren't
     *     bordered by word boundaries) will be allowed. Default is
     *     <code>false</code>, meaning that only entire words or phrases of
     *     words will be matched.
     *   </dd>
     * </dl>
     * @return {String} Escaped and highlighted version of <em>haystack</em>.
     * @protected
     * @static
     */
    _highlight: function (haystack, needles, options) {
        var i, len, regex, replacement;

        if (!options) {
            options = EMPTY_OBJECT;
        }

        // Escape HTML characters in the haystack to prevent HTML injection.
        haystack = escapeHTML(haystack);

        // Create a local copy of needles so we can safely modify it in the next
        // step.
        needles = needles.concat();

        // Escape HTML characters and special regular expression characters in
        // the needles so they can be used in a regex and matched against the
        // escaped haystack.
        for (i = 0, len = needles.length; i < len; ++i) {
            needles[i] = escapeRegExp(escapeHTML(needles[i]));
        }

        if (options.subWordMatch) {
            regex       = Highlighters._SUBWORD_REGEX;
            replacement = Highlighters._SUBWORD_REPLACE;
        } else if (options.startMatch) {
            regex       = Highlighters._START_REGEX;
            replacement = Highlighters._START_REPLACE;
        } else {
            regex       = Highlighters._WORD_REGEX;
            replacement = Highlighters._WORD_REPLACE;
        }

        return haystack.replace(
            new RegExp(regex.replace('%needles', needles.join('|')),
                    options.caseSensitive ? 'g' : 'gi'),
            replacement
        );
    }
};

AutoComplete.Highlighters = Highlighters;

}, '@VERSION@', {
    requires: ['autocomplete-base', 'collection']
});
