YUI.add('unicode-wordbreak', function (Y) {

/**
 * Provides utility methods for splitting strings on word breaks and determining
 * whether a character represents a word boundary, using the algorithm defined
 * in the Unicode Text Segmentation guidelines
 * (<a href="http://unicode.org/reports/tr29/#Word_Boundaries">Unicode Standard
 * Annex #29</a>).
 *
 * @module unicode-wordbreak
 * @class Unicode.WordBreak
 * @static
 */

var YArray  = Y.Array,
    Unicode = Y.Unicode,
    WBData  = Unicode.Data.WordBreak,

// Constants representing code point classifications.
ALETTER      = 0,
MIDNUMLET    = 1,
MIDLETTER    = 2,
MIDNUM       = 3,
NUMERIC      = 4,
CR           = 5,
LF           = 6,
NEWLINE      = 7,
EXTEND       = 8,
FORMAT       = 9,
KATAKANA     = 10,
EXTENDNUMLET = 11,
OTHER        = 12,

// RegExp objects generated from code point data. Each regex matches a single
// character against a set of unicode code points. The index of each item in
// this array must match its corresponding code point constant value defined
// above.
SETS = [
    new RegExp(WBData.aletter),
    new RegExp(WBData.midnumlet),
    new RegExp(WBData.midletter),
    new RegExp(WBData.midnum),
    new RegExp(WBData.numeric),
    new RegExp(WBData.cr),
    new RegExp(WBData.lf),
    new RegExp(WBData.newline),
    new RegExp(WBData.extend),
    new RegExp(WBData.format),
    (WBData.katakana ? new RegExp(WBData.katakana) : null),
    (WBData.extendnumlet ? new RegExp(WBData.extendnumlet) : null)
],

EMPTY_STRING = '',
PUNCTUATION  = new RegExp('^' + WBData.punctuation + '$'),
WHITESPACE   = /\s/,

WordBreak = Unicode.WordBreak = {
    // -- Public Static Methods ------------------------------------------------
    getWords: function (string, options) {
        var i     = 0,
            map   = WordBreak._classify(string),
            len   = map.length,
            word  = [],
            words = [],
            chr,
            includePunctuation,
            includeWhitespace;

        if (!options) {
            options = {};
        }

        if (options.ignoreCase) {
            string = string.toLowerCase();
        }

        includePunctuation = options.includePunctuation;
        includeWhitespace  = options.includeWhitespace;

        // Loop through each character in the classification map and determine
        // whether it precedes a word boundary, building an array of distinct
        // words as we go.
        for (; i < len; ++i) {
            chr = string.charAt(i);

            // Append this character to the current word.
            word.push(chr);

            // If there's a word boundary between the current character and the
            // next character, append the current word to the words array and
            // start building a new word. 
            if (WordBreak._isWordBoundary(map, i)) {
                word = word.join(EMPTY_STRING);

                if (word &&
                        (includeWhitespace || !WHITESPACE.test(word)) &&
                        (includePunctuation || !PUNCTUATION.test(word))) {
                    words.push(word);
                }

                word = [];
            }
        }

        return words;
    },

    getUniqueWords: function (string, options) {
        return YArray.unique(WordBreak.getWords(string, options));
    },

    isWordBoundary: function (string, index) {
        return WordBreak._isWordBoundary(WordBreak._classify(string), index);
    },

    // -- Protected Static Methods ---------------------------------------------
    // TODO: come up with a way to memoize this function without leaking memory.
    _classify: function (string) {
        var chr,
            map          = [],
            i            = 0,
            j,
            set,
            stringLength = string.length,
            setsLength   = SETS.length,
            type;

        for (; i < stringLength; ++i) {
            chr  = string.charAt(i);
            type = OTHER;

            for (j = 0; j < setsLength; ++j) {
                set = SETS[j];

                if (set && set.test(chr)) {
                    type = j;
                    break;
                }
            }

            map.push(type);
        }

        return map;
    },

    _isWordBoundary: function (map, index) {
        var prevType,
            type     = map[index],
            nextType = map[index + 1],
            nextNextType;

        // WB5. Don't break between most letters.
        if (type === ALETTER && nextType === ALETTER) {
            return false;
        }

        nextNextType = map[index + 2];

        // WB6. Don't break letters across certain punctuation.
        if (type === ALETTER &&
                (nextType === MIDLETTER || nextType === MIDNUMLET) &&
                nextNextType === ALETTER) {
            return false;
        }

        prevType = map[index - 1];

        // WB7. Don't break letters across certain punctuation.
        if ((type === MIDLETTER || type === MIDNUMLET) &&
                nextType === ALETTER &&
                prevType === ALETTER) {
            return false;
        }

        // WB8/WB9/WB10. Don't break inside sequences of digits or digits
        // adjacent to letters.
        if ((type === NUMERIC || type === ALETTER) &&
                (nextType === NUMERIC || nextType === ALETTER)) {
            return false;
        }

        // WB11. Don't break inside numeric sequences like "3.2" or
        // "3,456.789".
        if ((type === MIDNUM || type === MIDNUMLET) &&
                nextType === NUMERIC &&
                prevType === NUMERIC) {
            return false;
        }

        // WB12. Don't break inside numeric sequences like "3.2" or
        // "3,456.789".
        if (type === NUMERIC &&
                (nextType === MIDNUM || nextType === MIDNUMLET) &&
                nextNextType === NUMERIC) {
            return false;
        }

        // WB4. Ignore format and extend characters.
        if (type === EXTEND || type === FORMAT ||
                prevType === EXTEND || prevType === FORMAT ||
                nextType === EXTEND || nextType === FORMAT) {
            return false;
        }

        // WB3. Don't break inside CRLF.
        if (type === CR && nextType === LF) {
            return false;
        }

        // WB3a. Break before newlines (including CR and LF).
        if (type === NEWLINE || type === CR || type === LF) {
            return true;
        }

        // WB3b. Break after newlines (including CR and LF).
        if (nextType === NEWLINE || nextType === CR || nextType === LF) {
            return true;
        }

        // Missing: WB13/WB13a/WB13b. Katakana

        // Break after any character not covered by the rules above.
        return true;
    }
};

}, '@VERSION@', {
    requires: ['collection', 'unicode-data-wordbreak'],
    optional: ['unicode-data-wordbreak-complete']
});
