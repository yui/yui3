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
        Y.log("Invalid JSON passed to parse","warn","JSON");
    }
});


}, '@VERSION@' );
YUI.add('json-stringify', function(Y) {

/**
 * Provides Y.JSON.stringify method for converting objects to JSON strings.
 * @module json
 * @submodule json-stringify
 * @for JSON
 * @static
 */
var _toString = Object.prototype.toString,
    STRING    = 'string',
    NUMBER    = 'number',
    BOOLEAN   = 'boolean',
    OBJECT    = 'object',
    ARRAY     = 'array',
    REGEXP    = 'regexp',
    ERROR     = 'error',
    NULL      = 'null',
    DATE      = 'date',
    EMPTY     = '',
    OPEN_O    = '{',
    CLOSE_O   = '}',
    OPEN_A    = '[',
    CLOSE_A   = ']',
    COMMA     = ',',
    COLON     = ':',
    QUOTE     = '"';

Y.mix(Y.namespace('JSON'),{
    /**
     * Regex used to capture characters that need escaping before enclosing
     * their containing string in quotes.
     * @property _SPECIAL_CHARS
     * @type {RegExp}
     * @private
     */
    _SPECIAL_CHARS : /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,

    /**
     * Character substitution map for common escapes and special characters.
     * @property _CHARS
     * @type {Object}
     * @static
     * @private
     */
    _CHARS : {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    },

    /**
     * Serializes a Date instance as a UTC date string.  Used internally by
     * stringify.  Override this method if you need Dates serialized in a
     * different format.
     * @method dateToString
     * @param d {Date} The Date to serialize
     * @return {String} stringified Date in UTC format YYYY-MM-DDTHH:mm:SSZ
     * @static
     */
    dateToString : function (d) {
        function _zeroPad(v) {
            return v < 10 ? '0' + v : v;
        }

        return QUOTE + d.getUTCFullYear()   + '-' +
              _zeroPad(d.getUTCMonth() + 1) + '-' +
              _zeroPad(d.getUTCDate())      + 'T' +
              _zeroPad(d.getUTCHours())     + COLON +
              _zeroPad(d.getUTCMinutes())   + COLON +
              _zeroPad(d.getUTCSeconds())   + 'Z' + QUOTE;
    },

    /**
     * Converts an arbitrary value to a JSON string representation.
     * Cyclical object or array references are replaced with null.
     * If a whitelist is provided, only matching object keys will be included.
     * If a depth limit is provided, objects and arrays at that depth will
     * be stringified as empty.
     * @method stringify
     * @param o {MIXED} any arbitrary object to convert to JSON string
     * @param w {Array|Function} (optional) whitelist of acceptable object
     *                  keys to include, or a replacer function to modify the
     *                  raw value before serialization
     * @param d {number} (optional) depth limit to recurse objects/arrays
     *                   (practical minimum 1)
     * @return {string} JSON string representation of the input
     * @static
     * @public
     */
    stringify : function (o,w,d) {

        var m      = Y.JSON._CHARS,
            str_re = Y.JSON._SPECIAL_CHARS,
            rep    = Y.Lang.isFunction(w) ? w : null,
            pstack = [], // Processing stack used for cyclical ref protection
            _date = Y.JSON.dateToString; // Use configured date serialization

        if (rep || typeof w !== 'object') {
            w = undefined;
        }

        // escape encode special characters
        function _char(c) {
            if (!m[c]) {
                m[c]='\\u'+('0000'+(+(c.charCodeAt(0))).toString(16)).slice(-4);
            }
            return m[c];
        }

        // Enclose the escaped string in double quotes
        function _string(s) {
            return QUOTE + s.replace(str_re, _char) + QUOTE;
        }

        // Check for cyclical references
        function _cyclical(o) {
            for (var i = pstack.length - 1; i >= 0; --i) {
                if (pstack[i] === o) {
                    return true;
                }
            }
            return false;
        }

        function _object(o,d,arr) {
            // Add the object to the processing stack
            pstack.push(o);

            var a = [], i, j, len, k, v;

            // Only recurse if we're above depth config
            if (d > 0) {
                if (arr) { // Array
                    for (i = o.length - 1; i >= 0; --i) {
                        a[i] = _stringify(o,i,d-1) || NULL;
                    }
                } else {   // Object

                    // If whitelist provided, take only those keys
                    k = Y.Lang.isArray(w) ? w : Y.Object.keys(w || o);

                    for (i = 0, j = 0, len = k.length; i < len; ++i) {
                        if (typeof k[i] === STRING) {
                            v = _stringify(o,k[i],d-1);
                            if (v) {
                                a[j++] = _string(k[i]) + COLON + v;
                            }
                        }
                    }

                    a.sort();
                }
            }

            // remove the array from the stack
            pstack.pop();

            return arr ?
                OPEN_A + a.join(COMMA) + CLOSE_A :
                OPEN_O + a.join(COMMA) + CLOSE_O;
        }

        // Worker function.  Fork behavior on data type and recurse objects and
        // arrays per the configured depth.
        function _stringify(h,key,d) {
            var o = Y.Lang.isFunction(rep) ? rep.call(h,key,h[key]) : h[key],
                t = Y.Lang.type(o);

            if (t === OBJECT) {
                if (/String|Number|Boolean/.test(_toString.call(o))) {
                    o = o.valueOf();
                    t = Y.Lang.type(o);
                }
            }

            switch (t) {
                case STRING  : return _string(o);
                case NUMBER  : return isFinite(o) ? o+EMPTY : NULL;
                case BOOLEAN : return o+EMPTY;
                case DATE    : return _date(o);
                case NULL    : return NULL;
                case ARRAY   : return _cyclical(o) ? NULL : _object(o,d,true);
                case REGEXP  : // intentional fall through
                case ERROR   : // intentional fall through
                case OBJECT  : return _cyclical(o) ? NULL : _object(o,d);
                default      : return undefined;
            }
        }

        // Default depth to POSITIVE_INFINITY
        d = d >= 0 ? d : 1/0;

        // process the input
        return _stringify({'':o},EMPTY,d);
    }
});


}, '@VERSION@' );


YUI.add('json', function(Y){}, '@VERSION@' ,{use:['json-parse', 'json-stringify']});

