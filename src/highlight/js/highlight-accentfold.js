/**
 * Adds accent-folding highlighters to <code>Y.Highlight</code>.
 *
 * @module highlight
 * @submodule highlight-accentfold
 */

/**
 * @class Highlight
 * @static
 */

var Unicode    = Y.Unicode,
    AccentFold = Unicode.AccentFold,
    Escape     = Y.Escape,

    EMPTY_OBJECT = {},

Highlight = Y.mix(Y.Highlight, {
    // -- Public Static Methods ------------------------------------------------

    /**
     * Accent-folding version of <code>all()</code>.
     *
     * @method allFold
     * @param {String} haystack String to apply highlighting to.
     * @param {String|Array} needles String or array of strings that should be
     *   highlighted.
     * @param {Object} options (optional) Options object, which may contain
     *   zero or more of the following properties:
     *
     * <dl>
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
    allFold: function (haystack, needles, options) {
        var aeRegex        = Unicode.Data.AccentFold.ae,
            foldedHaystack = AccentFold.fold(haystack),
            foldedNeedles  = AccentFold.fold(needles),
            offset         = 0,
            replacement,
            result         = [],
            startPos       = 0;

        options = Y.merge({
            // While the highlight regex operates on the accent-folded strings,
            // this replacer will highlight the matched positions in the
            // original string.
            replacer: function (substring, p1, pos) {
                pos -= offset;

                var len   = p1.length,
                    chunk = haystack.substr(pos, len),
                    aePos = chunk.search(aeRegex);

                // Edge case: if the chunk contains "æ" or a variant thereof, we
                // need to adjust the length to compensate, since "æ" is a
                // single char that folds into two chars.
                if (aePos !== -1 && aePos !== len - 1) {
                    offset += 1;
                    chunk   = haystack.substr(pos, --len);
                }

                result.push(haystack.substring(startPos, pos) +
                        replacement.replace('$1', chunk));

                startPos = pos + len;
            }
        }, options || EMPTY_OBJECT);

        // Respect the replacement template constants defined by the base
        // highlight module.
        replacement = options.startsWith ? Highlight._START_REPLACE :
                Highlight._REPLACE;

        // Run the highlighter on the folded strings. We don't care about the
        // output; our replacer function will build the canonical highlighted
        // string, with original accented characters.
        Highlight.all(foldedHaystack, foldedNeedles, options);

        // Tack on the remainder of the haystack that wasn't highlighted, if
        // any.
        if (startPos < haystack.length - 1) {
            result.push(haystack.substr(startPos));
        }

        return result.join('');
    },

    /**
     * Accent-folding version of <code>start()</code>.
     *
     * @method startFold
     * @param {String} haystack String to apply highlighting to.
     * @param {String|Array} needles String or array of strings that should be
     *   highlighted.
     * @return {String} Escaped and highlighted copy of <em>haystack</em>.
     * @static
     */
    startFold: function (haystack, needles) {
        return Highlight.allFold(haystack, needles, {startsWith: true});
    },

    /**
     * Accent-folding version of <code>words()</code>.
     *
     * @method wordsFold
     * @param {String} haystack String to apply highlighting to.
     * @param {String|Array} needles String or array of strings containing words
     *   that should be highlighted. If a string is passed, it will be split
     *   into words; if an array is passed, it is assumed to have already been
     *   split.
     * @return {String} Escaped and highlighted copy of <em>haystack</em>.
     * @static
     */
    wordsFold: function (haystack, needles) {
        var replacement = Highlight._WORD_REPLACE;

        return Highlight.words(haystack, AccentFold.fold(needles), {
            mapper: function (word, needles) {
                if (needles.hasOwnProperty(AccentFold.fold(word))) {
                    return replacement.replace('$1', Escape.html(word));
                }

                return Escape.html(word);
            }
        });
    }
});
