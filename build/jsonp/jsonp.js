YUI.add('jsonp-base', function(Y) {

var isFunction = Y.Lang.isFunction;

/**
 * <p>Provides a JSONPRequest class for repeated JSONP calls, and a convenience
 * method Y.jsonp(url, callback) to instantiate and send a JSONP request.</p>
 *
 * <p>Both the constructor as well as the convenience function take two
 * parameters: a url string and a callback.</p>
 *
 * <p>The url provided must include the placeholder string
 * &quot;{callback}&quot; which will be replaced by a dynamically
 * generated routing function to pass the data to your callback function.
 * An example url might look like
 * &quot;http://example.com/service?callback={callback}&quot;.</p>
 *
 * <p>The second parameter can be a callback function that accepts the JSON
 * payload as its argument, or a configuration object supporting the keys:</p>
 * <ul>
 *   <li>on - map of callback subscribers
 *      <ul>
 *         <li>success - function handler for successful transmission</li>
 *         <li>failure - function handler for failed transmission</li>
 *         <li>timeout - function handler for transactions that timeout</li>
 *      </ul>
 *  </li>
 *  <li>format  - override function for inserting the proxy name in the url</li>
 *  <li>timeout - the number of milliseconds to wait before giving up</li>
 *  <li>context - becomes <code>this</code> in the callbacks</li>
 *  <li>args    - array of subsequent parameters to pass to the callbacks</li>
 * </ul>
 *
 * @module jsonp
 * @submodule jsonp-base
 * @class JSONPRequest
 * @constructor
 * @param url {String} the url of the JSONP service
 * @param callback {Object|Function} the default callback configuration or
 *                                   success handler
 */
function JSONPRequest() {
    this._init.apply(this, arguments);
}

JSONPRequest.prototype = {
    /**
     * Set up the success and failure handlers and the regex pattern used
     * to insert the temporary callback name in the url.
     *
     * @method _init
     * @param url {String} the url of the JSONP service
     * @param callback {Object|Function} Optional success callback or config
     *                  object containing success and failure functions and
     *                  the url regex.
     * @protected
     */
    _init : function (url, callback) {
        this.url = url;

        // Accept a function, an object, or nothing
        callback = (isFunction(callback)) ?
            { on: { success: callback } } :
            callback || {};

        var subs = callback.on || {};

        if (!subs.success) {
            subs.success = this._defaultCallback(url, callback);
        }

        // Apply defaults and store
        this._config = Y.merge({
                context: this,
                args   : [],
                format : this._format
            }, callback, { on: subs });
    },

    /** 
     * Override this method to provide logic to default the success callback if
     * it is not provided at construction.  This is overridden by jsonp-url to
     * parse the callback from the url string.
     * 
     * @method _defaultCallback
     * @param url {String} the url passed at construction
     * @param config {Object} (optional) the config object passed at
     *                        construction
     * @return {Function}
     */
    _defaultCallback: function () {},

    /** 
     * Issues the JSONP request.
     *
     * @method send
     * @chainable
     */
    send : function () {
        var proxy  = Y.guid(),
            config = this._config,
            url    = config.format.call(this,
                        this.url, 'YUI.Env.JSONP.' + proxy);

        if (!config.on.success) {
            return this;
        }

        function wrap(fn) {
            return (isFunction(fn)) ?
                function (data) {
                    delete YUI.Env.JSONP[proxy];
                    fn.apply(config.context, [data].concat(config.args));
                } :
                null;
        }

        // Temporary un-sandboxed function alias
        // TODO: queuing
        YUI.Env.JSONP[proxy] = wrap(config.on.success);

        Y.Get.script(url, {
            onFailure: wrap(config.on.failure),
            onTimeout: wrap(config.on.timeout),
            timeout  : config.timeout
        });

        return this;
    },

    /**
     * Default url formatter.  Looks for callback= in the url and appends it
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
        return url.replace(/\{callback\}/, proxy);
    }
};

Y.JSONPRequest = JSONPRequest;

/**
 *
 * @method Y.jsonp
 * @param url {String} the url of the JSONP service with the {callback}
 *          placeholder where the callback function name typically goes.
 * @param c {Function|Object} Callback function accepting the JSON payload
 *          as its argument, or a configuration object (see above).
 * @return {JSONPRequest}
 * @static
 */
Y.jsonp = function (url,c) {
    return new Y.JSONPRequest(url,c).send();
};

if (!YUI.Env.JSONP) {
    YUI.Env.JSONP = {};
}


}, '@VERSION@' ,{requires:['get','oop']});
YUI.add('jsonp-url', function(Y) {

var JSONPRequest = Y.JSONPRequest,
    getByPath    = Y.Object.getValue,
    noop         = function () {};

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
            keys  = [],
            i = 0,
            locator, path, callback;

        if (match) {
            // Strip the ["string keys"] and [1] array indexes
            locator = match[1]
                .replace(/\[(['"])(.*?)\1\]/g,
                    function (x, $1, $2) {
                        keys[i] = $2;
                        return '.@' + (i++);
                    })
                .replace(/\[(\d+)\]/g,
                    function (x, $1) {
                        keys[i] = parseInt($1, 10) | 0;
                        return '.@' + (i++);
                    })
                .replace(/^\./, ''); // remove leading dot

            // Validate against problematic characters.
            if (!/[^\w\.\$@]/.test(locator)) {
                path = locator.split('.');
                for (i = path.length - 1; i >= 0; --i) {
                    if (path[i].charAt(0) === '@') {
                        path[i] = keys[parseInt(path[i].substr(1), 10)];
                    }
                }

                // First look for a global function, then the Y, then try the Y
                // again from the second token (to support "callback=Y.handler")
                callback = getByPath(Y.config.win, path) ||
                           getByPath(Y, path) ||
                           getByPath(Y, path.slice(1));
            }
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


}, '@VERSION@' ,{requires:['jsonp-base']});


YUI.add('jsonp', function(Y){}, '@VERSION@' ,{use:['jsonp-base', 'jsonp-url']});

