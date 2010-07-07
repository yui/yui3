var JSONPRequest = Y.JSONPRequest,
    getByPath    = Y.Object.getValue,
    noop         = function () {},
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

Y.mix(JSONPRequest.prototype, {
    /**
     * RegExp used by the default URL formatter to insert the generated callback
     * name into the JSONP url.  Looks for a query param callback=.  If a value
     * is assigned, it will be clobbered.
     *
     * @member _pattern
     * @type RegExp
     * @default /\bcallback=.*?(?=&|$)/i
     * @protected
     */
    _pattern: /\bcallback=(.*?)(?=&|$)/i,

    /**
     * Template used by the default URL formatter to add the callback function
     * name to the url.
     *
     * @member _template
     * @type String
     * @default "callback={callback}"
     * @protected
     */
    _template: "callback={callback}",

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
    _defaultCallback: function (url) {
        var match = url.match(this._pattern),
            bracketAlias = {},
            i = 0,
            path, callback;

        if (match) {
            // callback=foo[2].bar["baz"]func => ['foo','2','bar','baz','func']
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
                        }).split(/\./);
            
            // Restore tokens from brack notation
            Y.each(path, function (bit, i) {
                if (bit.charAt(0) === '@') {
                    path[i] = bracketAlias[bit];
                }
            });

            // First look for a global function, then the Y, then try the Y
            // again from the second token (to support "...?callback=Y.handler")
            callback = getByPath(Y.config.win, path) ||
                       getByPath(Y, path) ||
                       getByPath(Y, path.slice(1));
        }

        return callback || noop;
    },

    /**
     * URL formatter that looks for callback= in the url and appends it
     * if not present.  The supplied proxy name will be assigned to the query
     * param.  Override this method by passing a function as the
     * &quot;format&quot; property in the config object to the constructor.
     *
     * @method _format
     * @param url { String } the original url
     * @param proxy {String} the function name that will be used as a proxy to
     *      the configured callback methods.
     * @return {String} fully qualified JSONP url
     * @protected
     */
    _format: function (url, proxy) {
        var callback = this._template.replace(/\{callback\}/, proxy),
            lastChar;

        if (this._pattern.test(url)) {
            return url.replace(this._pattern, callback);
        } else {
            lastChar = url.slice(-1);
            if (lastChar !== '&' && lastChar !== '?') {
                url += (url.indexOf('?') > -1) ? '&' : '?';
            }
            return url + callback;
        }
    }

}, true);
