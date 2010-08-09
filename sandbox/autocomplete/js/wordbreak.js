YUI.add('wordbreak', function (Y) {

var YArray = Y.Array,

// Word break property value constants.
// See http://unicode.org/reports/tr29/#Default_Word_Boundaries for definitions.
ALETTER   = 0,
MIDNUMLET = 1,
MIDLETTER = 2,
MIDNUM    = 3,
NUMERIC   = 4,
CR        = 5,
LF        = 6,
NEWLINE   = 7,
EXTEND    = 8,
FORMAT    = 9,
OTHER     = 10,

WordBreak = Y.WordBreak = {
    // -- Private Static Properties --------------------------------------------
    _REGEX: [
        // The UnicodeSet utility is helpful for enumerating the specific code
        // points covered by each of these regular expressions:
        // http://unicode.org/cldr/utility/list-unicodeset.jsp
        //
        // The code sets from which these regexes were derived can be generated
        // by the UnicodeSet utility using the links here:
        // http://unicode.org/cldr/utility/properties.jsp?a=Word_Break#Word_Break

        // ALetter (subset only; doesn't include all code points)
        /[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u01BF\u01C0-\u02AF\u02B0-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u048A-\u0523\u1D00-\u1DBF\u1E00-\u1F15\u2160-\u2188\u2C60-\u2C6F\u2C71-\u2C7D]/,

        // MidNumLet
        /['\.\u2018\u2019\u2024\uFE52\uFF07\uFF0E]/,

        // MidLetter
        /[:\u00B7\u0387\u05F4\u2027\uFE13\uFE55\uFF1A]/,

        // MidNum
        /[,;\u037E\u0589\u060C\u060D\u066C\u07F8\u2044\uFE10\uFE14\uFE50\uFE54\uFF0C\uFF1B]/,

        // Numeric (subset only; doesn't include all code points)
        /[0-9]/,

        // CR
        /\u000D/,

        // LF
        /\u000A/,

        // Newline
        /[\u000B\u000C\u0085\u2028\u2029]/,

        // Extend (subset only; doesn't include all code points)
        /[\u0300-\u036F\u0483-\u0489\u1DC0-\u1DE6\u1DFE-\u1DFF\u200C\u200D\u20D0-\u20DC\u20DD-\u20F0\u2DE0-\u2DFF]/,

        // Format
        /[\u00AD\u0600-\u0603\u06DD\u070F\u17B4\u17B5\u200E\u200F\u202A-\u202E\u2060-\u2064\u206A-\u206F\uFEFF\uFFF9-\uFFFB]/

        // Missing: Katakana, ExtendNumLet
    ],

    // -- Public Static Methods ------------------------------------------------
    getWords: function (string, preserveCase) {
        var i,
            isBreak,
            len,
            map = WordBreak._mapChars(string),
            nextType,
            type,
            word = '',
            words = [];

        if (!preserveCase) {
            string = string.toLowerCase();
        }

        // Loop through each character type and determine whether it indicates a
        // word boundary, following the rules defined in the Unicode Text
        // Segmentation guidelines (Unicode Standard Annex #29):
        // http://unicode.org/reports/tr29/#Word_Boundaries
        for (i = 0, len = map.length; i < len; ++i) {
            type     = map[i];
            nextType = map[i + 1];

            // WB5. Don't break between most letters.
            if (type === ALETTER && nextType === ALETTER) {
                isBreak = false;
            }

            // WB6. Don't break letters across certain punctuation.
            else if (type === ALETTER &&
                    (nextType === MIDLETTER || nextType === MIDNUMLET) &&
                    map[i + 2] === ALETTER) {
                isBreak = false;
            }

            // WB7. Don't break letters across certain punctuation.
            else if ((type === MIDLETTER || type === MIDNUMLET) &&
                    nextType === ALETTER && map[i - 1] === ALETTER) {
                isBreak = false;
            }

            // WB8/WB9/WB10. Don't break inside sequences of digits or digits
            // adjacent to letters.
            else if ((type === NUMERIC || type === ALETTER) &&
                    (nextType === NUMERIC || nextType === ALETTER)) {
                isBreak = false;
            }

            // WB11. Don't break inside numeric sequences like "3.2" or
            // "3,456.789".
            else if ((type === MIDNUM || type === MIDNUMLET) &&
                    nextType === NUMERIC && map[i - 1] === NUMERIC) {
                isBreak = false;
            }

            // WB12. Don't break inside numeric sequences like "3.2" or
            // "3,456.789".
            else if (type === NUMERIC &&
                    (nextType === MIDNUM || nextType === MIDNUMLET) &&
                    map[i + 2] === NUMERIC) {
                isBreak = false;
            }

            // WB4. Ignore format and extend characters.
            else if (type === EXTEND || type === FORMAT) {
                isBreak = false;
            }

            // WB3. Don't break inside CRLF.
            else if (type === CR && nextType === LF) {
                isBreak = false;
            }

            // WB3a. Break before newlines (including CR and LF).
            else if (type === NEWLINE || type === CR || type === LF) {
                isBreak = true;
            }

            // WB3b. Break after newlines (including CR and LF).
            else if (nextType === NEWLINE || nextType === CR || nextType === LF) {
                isBreak = true;
            }

            // Missing: WB13/WB13a/WB13b. Katakana

            else {
                isBreak = true;
            }

            word += string.charAt(i);

            if (isBreak) {
                if (!(/^\s+$/.test(word))) {
                    words[words.length] = word;
                }

                word = '';
            }
        }

        if (word) {
            words[words.length] = word;
        }

        return words;
    },

    getUniqueWords: function (string, preserveCase) {
        return YArray.unique(WordBreak.getWords(string, preserveCase));
    },

    // -- Protected Static Methods ---------------------------------------------
    _mapChars: function (string) {
        var chr,
            map          = [],
            i            = 0,
            j,
            stringLength = string.length,
            regex        = WordBreak._REGEX,
            regexLength  = regex.length,
            type;

        for (; i < stringLength; ++i) {
            chr  = string.charAt(i);
            type = OTHER;

            for (j = 0; j < regexLength; ++j) {
                if (regex[j].test(chr)) {
                    type = j;
                    break;
                }
            }

            map[map.length] = type;
        }

        return map;
    }
};

}, '@VERSION@', {
    requires: ['collection']
});
