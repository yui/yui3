YUI.add('json-parse', function(Y) {

/**
 * The JSON Utility provides methods to serialize JavaScript objects into
 * JSON strings and parse JavaScript objects from strings containing JSON data.
 * Three modules are available for inclusion:
 * <ol>
 * <li>1. <code>json-parse</code> for parsing JSON strings into native JavaScript data</li>
 * <li>2. <code>json-stringify</code> for stringification of JavaScript objects into JSON strings</li>
 * <li>3. <code>json</code> for both parsing and stringification</li>
 * </ol>
 * 
 * Both <code>json-parse</code> and <code>json-stringify</code> create functions in a static JSON class under your YUI instance (e.g. Y.JSON.parse(..)).
 * @module json
 * @class JSON
 * @static
 */

/**
 * Provides Y.JSON.parse method to take JSON strings and return native
 * JavaScript objects.
 * @module json
 * @submodule json-parse
 * @for JSON
 * @static
 */

// All internals kept private for security reasons

    /**
     * Replace certain Unicode characters that JavaScript may handle incorrectly
     * during eval--either by deleting them or treating them as line
     * endings--with escape sequences.
     * IMPORTANT NOTE: This regex will be used to modify the input if a match is
     * found.
     * @property _UNICODE_EXCEPTIONS
     * @type {RegExp}
     * @private
     */
var _UNICODE_EXCEPTIONS = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,


    /**
     * First step in the validation.  Regex used to replace all escape
     * sequences (i.e. "\\", etc) with '@' characters (a non-JSON character).
     * @property _ESCAPES
     * @type {RegExp}
     * @private
     */
    _ESCAPES = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,

    /**
     * Second step in the validation.  Regex used to replace all simple
     * values with ']' characters.
     * @property _VALUES
     * @type {RegExp}
     * @private
     */
    _VALUES  = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,

    /**
     * Third step in the validation.  Regex used to remove all open square
     * brackets following a colon, comma, or at the beginning of the string.
     * @property _BRACKETS
     * @type {RegExp}
     * @private
     */
    _BRACKETS = /(?:^|:|,)(?:\s*\[)+/g,

    /**
     * Final step in the validation.  Regex used to test the string left after
     * all previous replacements for invalid characters.
     * @property _INVALID
     * @type {RegExp}
     * @private
     */
    _INVALID = /[^\],:{}\s]/;

/**
 * Traverses nested objects, applying a reviver function to each (key,value)
 * from the scope if the key:value's containing object.  The value returned
 * from the function will replace the original value in the key:value pair.
 * If the value returned is undefined, the key will be omitted from the
 * returned object.
 * @method _revive
 * @param data {MIXED} Any JavaScript data
 * @param reviver {Function} filter or mutation function
 * @return {MIXED} The results of the filtered data
 * @private
 */
function _revive(data, reviver) {
    var walk = function (o,key) {
        var k,v,value = o[key];
        if (value && typeof value === 'object') {
            for (k in value) {
                if (value.hasOwnProperty(k)) {
                    v = walk(value, k);
                    if (v === undefined) {
                        delete value[k];
                    } else {
                        value[k] = v;
                    }
                }
            }
        }
        return reviver.call(o,key,value);
    };

    return typeof reviver === 'function' ? walk({'':data},'') : data;
}

/**
 * Replaces specific unicode characters with their appropriate \unnnn format.
 * Some browsers ignore certain characters during eval.
 *
 * @method escapeException
 * @param c {String} Unicode character
 * @return {String} the \unnnn escapement of the character
 * @private
 */
function escapeException(c) {
    return '\\u'+('0000'+(+(c.charCodeAt(0))).toString(16)).slice(-4);
}

Y.mix(Y.namespace('JSON'),{
    /**
     * Parse a JSON string, returning the native JavaScript representation.
     * @param s {string} JSON string data
     * @param reviver {function} (optional) function(k,v) passed each key value
     *          pair of object literals, allowing pruning or altering values
     * @return {MIXED} the native JavaScript representation of the JSON string
     * @throws SyntaxError
     * @method parse
     * @static
     * @public
     */
    parse : function (s,reviver) {
        // Ensure valid JSON
        if (typeof s === 'string') {
            // Replace certain Unicode characters that are otherwise handled
            // incorrectly by some browser implementations.
            // NOTE: This modifies the input if such characters are found!
            s = s.replace(_UNICODE_EXCEPTIONS, escapeException);
            
            // Test for validity
            if (!_INVALID.test(s.replace(_ESCAPES,'@').
                                 replace(_VALUES,']').
                                 replace(_BRACKETS,''))) {

                // Eval the text into a JavaScript data structure, apply any
                // reviver function, and return
                return _revive( eval('(' + s + ')'), reviver );
            }
        }

        // The text is not JSON parsable
        Y.JSON.handleParseError(s,reviver);

        throw new SyntaxError('JSON.parse');
    },

    /**
     * Hook for plugins to add more detailed error reporting.  Note this will
     * only catch a subset of JSON format errors.  Others are expressed via
     * failure to eval.
     *
     * @method handleParseError
     * @param s {String} the JSON string
     * @param reviver {Function} (optional) the reviver passed to parse(..)
     * @static
     * @protected
     */
    handleParseError : function (s,reviver) {
    }
});


}, '@VERSION@' );
