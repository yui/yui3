YUI.add('unicode-data-wordbreak', function (Y) {

Y.namespace('Unicode.Data').WordBreak = {
    // The UnicodeSet utility is helpful for enumerating the specific code
    // points covered by each of these regular expressions:
    // http://unicode.org/cldr/utility/list-unicodeset.jsp
    //
    // The code sets from which these regexes were derived can be generated
    // by the UnicodeSet utility using the links here:
    // http://unicode.org/cldr/utility/properties.jsp?a=Word_Break#Word_Break

    // Subset only. Use unicode-data-wordbreak-complete for the complete set of
    // code points.
    aletter: '[A-Za-zÀ-ÖØ-öø-ƿǀ-ʯʰ-ˁˆ-ˑˠ-ˤˬˮҊ-ԣᴀ-ᶿḀ-ἕⅠ-ↈⱠ-Ɐⱱ-ⱽ]',

    midnumlet: "['\\.‘’․﹒＇．]",

    midletter: '[:··״‧︓﹕：]',

    midnum: '[,;;։،؍٬߸⁄︐︔﹐﹔，；]',

    // Subset only. Use unicode-data-wordbreak-complete for the complete set of
    // code points.
    numeric: '[0-9]',

    cr: '\r',

    lf: '\n',

    newline: '[\u000B\u000C\u0085\u2028\u2029]',

    // Subset only. Use unicode-data-wordbreak-complete for the complete set of
    // code points.
    extend: '[\u0300-\u036F\u0483-\u0489\u1DC0-\u1DE6\u1DFE-\u1DFF\u200C\u200D\u20D0-\u20DC\u20DD-\u20F0\u2DE0-\u2DFF]',

    format: '[\u00AD\u0600-\u0603\u06DD\u070F\u17B4\u17B5\u200E\u200F\u202A-\u202E\u2060-\u2064\u206A-\u206F\uFEFF\uFFF9-\uFFFB]',

    // For Katakana and ExtendNumLet data, use the
    // unicode-data-wordbreak-complete module.

    // ASCII and Latin only.
    punctuation: '[!-#%-\\*,-/\\:;\\?@\\[-\\]_\\{\\}¡«·»¿\\‐-―‖-‧‰-※‽-⁆⁊-⁕⁗⸘]'
};

}, '@VERSION@');
