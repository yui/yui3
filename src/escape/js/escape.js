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
    Returns an encoded string that can be used in JavaScript context,
    all alphanumeric characters are not encoded, all character less than
    256 (hex) are encoded with \\xHH and everything else with \\uHHHH
    
    This implementation is based on OWASP's JavaScript Codec implementation,
    found at http://code.google.com/p/owasp-esapi-java/source/browse/trunk/src/main/java/org/owasp/esapi/codecs/JavaScriptCodec.java
    
    If _string_ is not already a string, it will be coerced to a string.
    
    @method js
    @param {String} string String to escape.
    @return {String} Escaped string.
    @static
    **/
    js: function (string) {
            string += "";
            var str_len = string.length,
            encoded_string = "";
            for (i=0;i<str_len;i++) {
                    if(Escape._isAplhaNum(string[i])==false) {
                        if(string[i].charCodeAt(0) < 256) {
                            var hex_value = string[i].charCodeAt(0).toString(16).toUpperCase();
                            encoded_string += "\\x" + "00".substring(hex_value.length) + hex_value;
                        }
                        else {
                            var hex_value = string[i].charCodeAt(0).toString(16).toUpperCase();
                            encoded_string += "\\u" + "0000".substring(hex_value.length) + hex_value;
                        }
                    }
                    else {
                            encoded_string += string[i];
                    }
                     
            }
            return encoded_string;
    },
    
    /**
    Returns a copy of the specified string with http:// prepended to it if 
    the string does not start with a http:// or https://
    
    If _string_ is not already a string, it will be coerced to a string.
    
    @method uri
    @param {String} string String to escape.
    @return {String} Escaped string.
    @static
    **/
    uri: function (string) {
        string += '';
        if(string.indexOf('http://')==0)
            return string;
        else if(string.indexOf('https://')==0)
            return string;
        else if(decodeURIComponent(string).indexOf('/')==0)
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
    Method to check if a character is Alpha-Numeric using regex.

    @method _isAlphaNum
    @param {String} match Matched character (match in regex: [a-zA-Z0-9]*).
    @returns {Boolean} true if match is successful; else false.
    @static
    @protected
    **/
    _isAplhaNum: function (match) {
        if(match.match(/[a-zA-Z0-9]*/g)[0]==match) {
            return true;
        }
        else {
            return false;
        }
    }
};

Escape.regexp = Escape.regex;

Y.Escape = Escape;
