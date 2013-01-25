/**
Provides utility methods for escaping strings.

@module escape
@class Escape
@static
@since 3.3.0
**/

var HTML_CHARS = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
        '`': '&#x60;'
    },
JS_CHARS = {
	'(': '\x28',
	')': '\x29',
	'{': '\x7B',
	'}': '\x7D',
	';': '\x3B',
	'"': '\x22',
	"'": '\x27',
	'`': '\x60',
	'\r': '\x5C\x72',
	'\n': '\x5C\x6E',
	'\t': '\x5C\x74'
    },
Escape = {
    // -- Public Static Methods ------------------------------------------------

    /**
    Returns a copy of the specified string with special HTML characters
    escaped. The following characters will be converted to their
    corresponding character entities:

        & < > " ' / `

    This implementation is based on the [OWASP HTML escaping
    recommendations][1]. In addition to the characters in the OWASP
    recommendations, we also escape the <code>&#x60;</code> character, since IE
    interprets it as an attribute delimiter.

    If _string_ is not already a string, it will be coerced to a string.

    [1]: http://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet

    @method html
    @param {String} string String to escape.
    @return {String} Escaped string.
    @static
    **/
    html: function (string) {
        return (string + '').replace(/[&<>"'\/`]/g, Escape._htmlReplacer);
    },
    /**
    Returns a copy of the specified string with special JS literals
    escaped. The following characters will be stripped off from the string:
	
	) ; = " ' ` } ( { \r \n \t
	
	This implementation is based on the Google Closure autoescaping template's implementation [1].
	
	If _string_ is not already a string, it will be coerced to a string.
	
	[1]: http://code.google.com/p/gdata-java-client/source/browse/trunk/java/src/com/google/gdata/util/common/base/CharEscapers.java
    **/
    js: function (string) {
	return (string + '').replace(/([\(\);="'`\{\}])|(\r)|(\n)|(\t)|/g, Escape._uriReplacer);
    },
    /**
    Returns a copy of the specified string with http:// prepended to it
    if the string does not start with a http:// or https://
	

	
	If _string_ is not already a string, it will be coerced to a string.
    **/
    uri: function (string) {
         string += '';
         if(string.indexOf('http://')==0)
         	return string;
         else if(string.indexOf('https://')==0)
         	return string;
         else
         	return 'http://' + string;
    },
    /**
    Returns a copy of the specified string with special regular expression
    characters escaped, allowing the string to be used safely inside a regex.
    The following characters, and all whitespace characters, are escaped:

        - $ ^ * ( ) + [ ] { } | \ , . ?

    If _string_ is not already a string, it will be coerced to a string.

    @method regex
    @param {String} string String to escape.
    @return {String} Escaped string.
    @static
    **/
    regex: function (string) {
        // There's no need to escape !, =, and : since they only have meaning
        // when they follow a parenthesized ?, as in (?:...), and we already
        // escape parens and question marks.
        return (string + '').replace(/[\-$\^*()+\[\]{}|\\,.?\s]/g, '\\$&');
    },

    // -- Protected Static Methods ---------------------------------------------

    /**
     * Regex replacer for HTML escaping.
     *
     * @method _htmlReplacer
     * @param {String} match Matched character (must exist in HTML_CHARS).
     * @returns {String} HTML entity.
     * @static
     * @protected
     */
    _htmlReplacer: function (match) {
        return HTML_CHARS[match];
    },
    /**
     * Regex replacer for URL escaping.
     *
     * @method _uriReplacer
     * @param {String} match Matched character (must exist in URI_HANDLERS).
     * @returns {String} escaped entity.
     * @static
     * @protected
     */
    _uriReplacer: function (match) {
	return URI_HANDLERS[match]
    },
    /**
     * Regex replacer for JavaScript escaping.
     *
     * @method _jsReplacer
     * @param {String} match Matched character (must exist in JS_CHARS).
     * @returns {String} escaped entity.
     * @static
     * @protected
     */
    _jsReplacer: function (match) {
       return JS_CHARS[match];
    }
};

Escape.regexp = Escape.regex;

Y.Escape = Escape;
