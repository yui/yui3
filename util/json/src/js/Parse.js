/**
 * Provides Y.json.parse method to take JSON strings and return native
 * JavaScript objects.
 * @module json
 * @class Y.json
 * @static
 */
YUI.add(function (Y) {

Y.json = Y.json || {};

// All internals kept private for security reasons

/**
 * First step in the validation.  Regex used to replace all escape
 * sequences (i.e. "\\", etc) with '@' characters (a non-JSON character).
 * @property _ESCAPES
 * @type {RegExp}
 * @static
 * @private
 */
var _ESCAPES = /\\["\\\/bfnrtu]/g,

/**
 * Second step in the validation.  Regex used to replace all simple
 * values with ']' characters.
 * @property _VALUES
 * @type {RegExp}
 * @static
 * @private
 */
    _VALUES  = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,

/**
 * Third step in the validation.  Regex used to remove all open square
 * brackets following a colon, comma, or at the beginning of the string.
 * @property _BRACKETS
 * @type {RegExp}
 * @static
 * @private
 */

    _BRACKETS = /(?:^|:|,)(?:\s*\[)+/g,

/**
 * Final step in the validation.  Regex used to test the string left after
 * all previous replacements for invalid characters.
 * @property _INVALID
 * @type {RegExp}
 * @static
 * @private
 */
    _INVALID  = /^[\],:{}\s]*$/,

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
 * @static
 * @private
 */
    _revive = function (data, reviver) {
        var walk = function (o,key) {
            var k,v,value = o[key];
            if (value && typeof value === 'object') {
                for (k in value) {
                    if (YAHOO.lang.hasOwnProperty(value,k)) {
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
    };

/**
 * Parse a JSON string, returning the native JavaScript representation.
 * @param s {string} JSON string data
 * @param reviver {function} (optional) function(k,v) passed each key value pair of object literals, allowing pruning or altering values
 * @return {MIXED} the native JavaScript representation of the JSON string
 * @throws SyntaxError
 * @method parse
 * @static
 * @public
 */
Y.json.parse = function (s,reviver) {
    // Ensure valid JSON
    if (typeof s === 'string' && this._INVALID.test(s.
                                    replace(_ESCAPES,'@').
                                    replace(_VALUES,']').
                                    replace(_BRACKETS,''))) {
        // Eval the text into a JavaScript data structure, apply any
        // reviver function, and return
        return this._revive( eval('(' + s + ')'), reviver );
    }

    // The text is not JSON parsable
    throw new SyntaxError('parseJSON');
};

},'3.0.0');
