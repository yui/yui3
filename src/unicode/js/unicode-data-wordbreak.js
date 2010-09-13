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
