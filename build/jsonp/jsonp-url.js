YUI.add('jsonp-url', function(Y) {

var isObject   = Y.Lang.isObject,
    isFunction = Y.Lang.isFunction,
    DOT = '.',
    AT  = '@';

/**
 * Adds support for parsing complex callback identifiers from the jsonp url.
 * This includes callback=foo[1]bar.baz["goo"] as well as referencing methods
 * in the YUI instance.
 *
 * @module jsonp
 * @submodule jsonp-url
 * @for JSONPRequest
 */

function _resolve(root, path, aliases) {
    var i = path.length - 1,
        callbackName = path[0],
        bit;

    if (callbackName.charAt(0) === AT) {
        callbackName = aliases[callbackName];
    }

    // Stop at index 1.  Index 0 is the function name.
    for (; i > 0; --i) {
        bit = path[i];
        if (bit.charAt(0) === AT) {
            bit = aliases[bit];
        }
        root = root[bit];
        if (!isObject(root)) {
            return null;
        }
    }

    // Bind to preserve context declared inline, so
    // callback=foo.bar.func => 'this' is foo.bar in func.
    return (isObject(root) && isFunction(root[callbackName])) ?
            Y.bind(callbackName, root) :
            null;
}

/**
 * <p>Parses the url for a callback named explicitly in the string.
 * Override this if the target JSONP service uses a different query
 * parameter or url format.</p>
 *
 * <p>If the callback is declared inline, the corresponding function will
 * be returned.  Otherwise null.</p>
 *
 * @method _defaultCallback
 * @param url {String} the url to search in
 * @return {Function} the callback function if found, or null
 * @protected
 */
Y.JSONPRequest.prototype._defaultCallback = function (url) {
    var match = url.match(Y.JSONPRequest._pattern),
        bracketAlias = {},
        i = 0,
        path, callback;

    if (match) {
        // callback=foo[2].bar["baz"]func => ['func','baz','bar','2','foo']
        // TODO: Doesn't handle escaping or url encoding
        path = match[1].replace(/\[(?:(['"])([^\]\1]+)\1|(\d+))\]/g,
                    function (_, quote, name, idx) {
                        var nextChar = (RegExp.rightContext||'.').charAt(0),
                            token = AT + (++i);

                        bracketAlias[token] = name || idx;

                        if (nextChar !== DOT && nextChar !== '[') {
                            token += DOT;
                        }
                        return DOT + token;
                    }).split(/\./).reverse();

        // First look for a global function
        callback = _resolve(Y.config.win, path, bracketAlias);

        if (!callback) {
            // Then for function relative to Y, but excluding "Y"
            callback = _resolve(Y, path, bracketAlias);
            
            if (!callback && path.length > 1) {
                // Finally, assume the first path bit is Y.  It's either this or
                // look for a particular pattern, such as "Y", but the YUI
                // instance could be named anything in the implementation
                path.pop();
                callback = _resolve(Y, path, bracketAlias);
            }
        }
    }

    return callback || function () {};
};
            


}, '@VERSION@' ,{requires:['jsonp-base']});
