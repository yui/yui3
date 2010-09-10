YUI.add('unicode-accentfold', function(Y) {

/**
 * Unicode utilities.
 *
 * @module unicode
 * @since 3.3.0
 */

/**
 * <p>
 * Provides a basic Unicode accent folding implementation that converts common
 * accented letters (like "á") to their non-accented forms (like "a").
 * </p>
 *
 * <p>
 * This implementation is not comprehensive, and should only be used as a last
 * resort when accent folding can't be done on the server. A comprehensive
 * accent folding implementation would require much more character data to be
 * sent to the browser, resulting in a significant performance penalty. This
 * implementation strives for a compromise between usefulness and performance.
 * </p>
 *
 * <p>
 * Accent folding is a destructive operation that can't be reversed, and may
 * change or destroy the actual meaning of the text depending on the language.
 * It should not be used on strings that will later be displayed to a user,
 * unless this is done with the understanding that linguistic meaning may be
 * lost and that you may in fact confuse or insult the user by doing so.
 * </p>
 *
 * @module unicode
 * @submodule unicode-accentfold
 * @class Unicode.AccentFold
 * @static
 */

var YArray   = Y.Array,
    Unicode  = Y.Unicode,
    FoldData = Unicode.Data.AccentFold,

AccentFold = {
    // -- Public Static Methods ------------------------------------------------

    /**
     * Returns <code>true</code> if the specified string contains one or more
     * characters that can be folded, <code>false</code> otherwise.
     *
     * @method canFold
     * @param {String} string String to test.
     * @return {Boolean}
     * @static
     */
    canFold: function (string) {
        var letter;

        for (letter in FoldData) {
            if (FoldData.hasOwnProperty(letter) &&
                    string.search(FoldData[letter]) !== -1) {
                return true;
            }
        }

        return false;
    },

    /**
     * Compares the accent-folded versions of two strings and returns
     * <code>true</code> if they're the same, <code>false</code> otherwise. If
     * a custom comparison function is supplied, the accent-folded strings will
     * be passed to that function for comparison.
     *
     * @method compare
     * @param {String} a First string to compare.
     * @param {String} b Second string to compare.
     * @param {Function} func (optional) Custom comparison function. Should
     *   return a truthy or falsy value.
     * @return {Boolean} Results of the comparison.
     * @static
     */
    compare: function (a, b, func) {
        var aFolded = AccentFold.fold(a),
            bFolded = AccentFold.fold(b);

        return func ? !!func(aFolded, bFolded) : aFolded === bFolded;
    },

    /**
     * <p>
     * Returns a copy of <em>haystack</em> containing only the strings for which
     * the supplied function returns <code>true</code>.
     * </p>
     *
     * <p>
     * While comparisons will be made using accent-folded strings, the returned
     * array of matches will contain the original strings that were passed in.
     * </p>
     *
     * @method filter
     * @param {Array} haystack Array of strings to filter.
     * @param {Function} func Comparison function. Will receive an accent-folded
     *   haystack string as an argument, and should return a truthy or falsy
     *   value.
     * @return {Array} Filtered copy of <em>haystack</em>.
     * @static
     */
    filter: function (haystack, func) {
        return YArray.filter(haystack, function (item) {
            return func(AccentFold.fold(item));
        });
    },

    /**
     * Accent-folds the specified string or array of strings and returns a copy
     * in which common accented letters have been converted to their closest
     * non-accented, lowercase forms.
     *
     * @method fold
     * @param {String|Array} input String or array of strings to be folded.
     * @return {String|Array} Folded string or array of strings.
     * @static
     */
    fold: function (input) {
        if (Y.Lang.isArray(input)) {
            return YArray.map(input, AccentFold.fold);
        }

        input = input.toLowerCase();

        Y.Object.each(FoldData, function (regex, letter) {
            input = input.replace(regex, letter);
        });

        return input;
    }
};

Unicode.AccentFold = AccentFold;


}, '@VERSION@' ,{requires:['collection', 'unicode-data-accentfold']});
YUI.add('unicode-data-accentfold', function(Y) {

/**
 * <p>
 * An imperfect, incomplete reverse mapping of ASCII characters to
 * case-insensitive regexes that match their most common accented forms.
 * </p>
 *
 * <p>
 * The goal of this module is to provide a pragmatic and generally useful set of
 * accent folding data, since serving and performing lookups on a complete
 * dataset would be impractical in client-side JavaScript.
 * </p>
 *
 * <p>
 * Whenever possible, accent folding should be done on the server, where it's
 * possible to use tools that are both more complete and more performant. It
 * should only be done on the client as an absolute last resort.
 * </p>
 *
 * @module unicode
 * @submodule unicode-data-accentfold
 * @class Unicode.Data.AccentFold
 * @static
 */

// The following tool was very helpful in creating these mappings:
// http://unicode.org/cldr/utility/list-unicodeset.jsp?a=[:toNFKD%3D/^a/:]&abb=on

Y.namespace('Unicode.Data').AccentFold = {
    0: /[⁰₀⓪０]/gi,
    1: /[¹₁①１]/gi,
    2: /[²₂②２]/gi,
    3: /[³₃③３]/gi,
    4: /[⁴₄④４]/gi,
    5: /[⁵₅⑤５]/gi,
    6: /[⁶₆⑥６]/gi,
    7: /[⁷₇⑦７]/gi,
    8: /[⁸₈⑧８]/gi,
    9: /[⁹₉⑨９]/gi,
    a: /[ªà-åāăąǎǟǡǻȁȃȧᵃḁẚạảấầẩẫậắằẳẵặⓐａ]/gi,
    b: /[ᵇḃḅḇⓑｂ]/gi,
    c: /[çćĉċčᶜḉⓒｃ]/gi,
    d: /[ďᵈḋḍḏḑḓⅾⓓｄ]/gi,
    e: /[è-ëēĕėęěȅȇȩᵉḕḗḙḛḝẹẻẽếềểễệₑℯⓔｅ]/gi,
    f: /[ᶠḟⓕｆ]/gi,
    g: /[ĝğġģǧǵᵍḡℊⓖｇ]/gi,
    h: /[ĥȟʰḣḥḧḩḫẖℎⓗｈ]/gi,
    i: /[ì-ïĩīĭįĳǐȉȋᵢḭḯỉịⁱℹⅰⓘｉ]/gi,
    j: /[ĵǰʲⓙⱼｊ]/gi,
    k: /[ķǩᵏḱḳḵⓚｋ]/gi,
    l: /[ĺļľŀǉˡḷḹḻḽℓⅼⓛｌ]/gi,
    m: /[ᵐḿṁṃⅿⓜｍ]/gi,
    n: /[ñńņňǹṅṇṉṋⁿⓝｎ]/gi,
    o: /[ºò-öōŏőơǒǫǭȍȏȫȭȯȱᵒṍṏṑṓọỏốồổỗộớờởỡợₒℴⓞｏ]/gi,
    p: /[ᵖṕṗⓟｐ]/gi,
    q: /[ʠⓠｑ]/gi,
    r: /[ŕŗřȑȓʳᵣṙṛṝṟⓡｒ]/gi,
    s: /[śŝşšſșˢṡṣṥṧṩẛⓢｓ]/gi,
    t: /[ţťțᵗṫṭṯṱẗⓣｔ]/gi,
    u: /[ù-üũūŭůűųưǔǖǘǚǜȕȗᵘᵤṳṵṷṹṻụủứừửữựⓤｕ]/gi,
    v: /[ᵛᵥṽṿⅴⓥｖ]/gi,
    w: /[ŵʷẁẃẅẇẉẘⓦｗ]/gi,
    x: /[ˣẋẍₓⅹⓧｘ]/gi,
    y: /[ýÿŷȳʸẏẙỳỵỷỹⓨｙ]/gi,
    z: /[źżžᶻẑẓẕⓩｚ]/gi
};


}, '@VERSION@' );
YUI.add('unicode-data-wordbreak', function(Y) {

/**
 * <p>
 * Unicode data used by the word breaking algorithm.
 * </p>
 *
 * <p>
 * Whenever possible, word breaking should be done on the server, where it's
 * possible to use tools that are both more complete and more performant. It
 * should only be done on the client as an absolute last resort.
 * </p>
 *
 * @module unicode
 * @submodule unicode-data-wordbreak
 * @class Unicode.Data.WordBreak
 * @static
 */

Y.namespace('Unicode.Data').WordBreak = {
    // The UnicodeSet utility is helpful for enumerating the specific code
    // points covered by each of these regular expressions:
    // http://unicode.org/cldr/utility/list-unicodeset.jsp
    //
    // The code sets from which these regexes were derived can be generated
    // by the UnicodeSet utility using the links here:
    // http://unicode.org/cldr/utility/properties.jsp?a=Word_Break#Word_Break

    aletter    : '[A-Za-zÀ-ÖØ-öø-ƿǀ-ʯʰ-ˁˆ-ˑˠ-ˤˬˮҊ-ԣᴀ-ᶿḀ-ἕⅠ-ↈⱠ-Ɐⱱ-ⱽ]',
    midnumlet  : "['\\.‘’․﹒＇．]",
    midletter  : '[:··״‧︓﹕：]',
    midnum     : '[,;;։،؍٬߸⁄︐︔﹐﹔，；]',
    numeric    : '[0-9]', // Subset only.
    cr         : '\r',
    lf         : '\n',
    newline    : '[\u000B\u000C\u0085\u2028\u2029]',
    extend     : '[\u0300-\u036F\u0483-\u0489\u1DC0-\u1DE6\u1DFE-\u1DFF\u200C\u200D\u20D0-\u20DC\u20DD-\u20F0\u2DE0-\u2DFF]', // Subset only.
    format     : '[\u00AD\u0600-\u0603\u06DD\u070F\u17B4\u17B5\u200E\u200F\u202A-\u202E\u2060-\u2064\u206A-\u206F\uFEFF\uFFF9-\uFFFB]',

    // Katakana and ExtendNumLet data are not yet included.

    punctuation: '[!-#%-\\*,-/\\:;\\?@\\[-\\]_\\{\\}¡«·»¿\\‐-―‖-‧‰-※‽-⁆⁊-⁕⁗⸘]' // ASCII and Latin only.
};


}, '@VERSION@' );
YUI.add('unicode-wordbreak', function(Y) {

/**
 * Provides utility methods for splitting strings on word breaks and determining
 * whether a character represents a word boundary, using the algorithm defined
 * in the Unicode Text Segmentation guidelines
 * (<a href="http://unicode.org/reports/tr29/#Word_Boundaries">Unicode Standard
 * Annex #29</a>).
 *
 * @module unicode
 * @submodule unicode-wordbreak
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

WordBreak = {
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

Unicode.WordBreak = WordBreak;


}, '@VERSION@' ,{requires:['collection', 'unicode-data-wordbreak']});


YUI.add('unicode', function(Y){}, '@VERSION@' ,{use:['unicode-accentfold', 'unicode-wordbreak']});

