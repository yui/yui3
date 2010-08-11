/**
 * <p>
 * Provides methods for highlighting strings within other strings by wrapping
 * them in HTML.
 * </p>
 *
 * <p>
 * The highlight methods first escape any special HTML characters in the input
 * strings and then highlight the appropriate substrings by wrapping them in a
 * <code>&lt;b class="yui3-highlight"&gt;&lt;/b&gt;</code> element. The
 * <code>&lt;b&gt;</code> element is used rather than
 * <code>&lt;strong&gt;</code> in accordance with HTML5's definition of
 * <code>&lt;b&gt;</code> as being purely presentational, which is exactly what
 * highlighting is.
 * </p>
 *
 * @module highlight
 * @class Highlight
 * @static
 * @since 3.3.0
 */
YUI.add('highlight', function (Y) {

var YArray    = Y.Array,
    Escape    = Y.Escape,
    WordBreak = Y.Unicode.WordBreak,

    DEFAULT_REPLACE = '<b class="yui3-highlight">$1</b>',
    EMPTY_OBJECT    = {},

Highlight = Y.Highlight = {
    // -- Protected Static Properties ------------------------------------------

    /**
     * Regular expression template for highlighting a match that occurs anywhere
     * in a string. The placeholder <code>%needles</code> will be replaced with
     * a list of needles to match, joined by <code>|</code> characters.
     *
     * @property _REGEX
     * @type {String}
     * @protected
     * @static
     * @final
     */
    _REGEX: '(%needles)',

    /**
     * Replacement template for matches. Use regex match placeholders to insert
     * matched values.
     *
     * @property _REPLACE
     * @type {String}
     * @protected
     * @static
     * @final
     */
    _REPLACE: DEFAULT_REPLACE,

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
    _START_REPLACE: DEFAULT_REPLACE,

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
    _WORD_REPLACE: DEFAULT_REPLACE,

    // -- Public Static Methods ------------------------------------------------

    /**
     * Highlights occurrences in the <em>haystack</em> string of the items in
     * the <em>needles</em> array. The returned string will have all HTML
     * characters escaped except for the highlighting markup.
     *
     * @method highlight
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
     *   <dt>startsWith (Boolean)<dt>
     *   <dd>
     *     By default, needles are highlighted wherever they appear in the
     *     haystack. If <code>startsWith</code> is <code>true</code>, matches
     *     must be anchored to the beginning of the string.
     *   </dd>
     * </dl>
     *
     * @return {String} Escaped and highlighted copy of <em>haystack</em>.
     * @static
     */
    highlight: function (haystack, needles, options) {
        var i, len, regex, replacement;

        if (!options) {
            options = EMPTY_OBJECT;
        }

        // Escape HTML characters in the haystack to prevent HTML injection.
        haystack = Escape.html(haystack);

        // Create a local copy of needles so we can safely modify it in the next
        // step.
        needles = needles.concat();

        // Escape HTML characters and special regular expression characters in
        // the needles so they can be used in a regex and matched against the
        // escaped haystack.
        for (i = 0, len = needles.length; i < len; ++i) {
            needles[i] = Escape.regex(Escape.html(needles[i]));
        }

        if (options.startsWith) {
            regex       = Highlight._START_REGEX;
            replacement = Highlight._START_REPLACE;
        } else {
            regex       = Highlight._REGEX;
            replacement = Highlight._REPLACE;
        }

        return haystack.replace(
            new RegExp(
                regex.replace('%needles', needles.join('|')),
                options.caseSensitive ? 'g' : 'gi'
            ),
            replacement
        );
    },

    /**
     * Highlights complete words in the <em>haystack</em> string that are also
     * in the <em>needles</em> array. The returned string will have all HTML
     * characters escaped except for the highlighting markup.
     *
     * @method _highlightWords
     * @param {String} haystack String to apply highlighting to.
     * @param {Array} needles Array containing words that should be
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
     * </dl>
     *
     * @return {String} Escaped and highlighted copy of <em>haystack</em>.
     * @static
     */
    highlightWords: function (haystack, needles, options) {
        var replacement = Highlight._WORD_REPLACE,
            words;

        if (!options) {
            options = EMPTY_OBJECT;
        }

        // Convert the needles array to a hash for faster lookups.
        needles = YArray.hash(needles);

        // Split the haystack into an array of words, including punctuation and
        // whitespace so we can rebuild the string later.
        words = WordBreak.getWords(haystack, {
            ignoreCase        : !options.caseSensitive,
            includePunctuation: true,
            includeWhitespace : true
        });

        return YArray.map(words, function (word) {
            return needles.hasOwnProperty(word) ?
                replacement.replace('$1', Escape.html(word)) :
                Escape.html(word);
        }).join('');
    }
};

}, '@VERSION@', {
    requires: ['collection', 'escape', 'unicode-wordbreak']
});
