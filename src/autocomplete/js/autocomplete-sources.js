/**
 * Mixes support for JSONP and YQL result sources into AutoCompleteBase.
 *
 * @module autocomplete
 * @submodule autocomplete-sources
 */

var Lang = Y.Lang,

    _SOURCE_SUCCESS     = '_sourceSuccess',
    RESULT_LIST_LOCATOR = 'resultListLocator';

function ACSources() {}

ACSources.prototype = {
    /**
     * Regular expression used to determine whether a String source is a YQL
     * query.
     *
     * @property _YQL_SOURCE_REGEX
     * @type RegExp
     * @protected
     * @for AutoCompleteBase
     */
    _YQL_SOURCE_REGEX: /^(?:select|set|use)\s+/i,

    /**
     * Creates a DataSource-like object that uses the specified JSONPRequest
     * instance as a source. See the <code>source</code> attribute for more
     * details.
     *
     * @method _createJSONPSource
     * @param {JSONPRequest} source
     * @return {Object} DataSource-like object.
     * @protected
     * @for AutoCompleteBase
     */
    _createJSONPSource: function (source) {
        var cache       = {},
            jsonpSource = {},
            that        = this,
            lastRequest, loading;

        jsonpSource.sendRequest = function (request) {
            var _sendRequest = function (request) {
                var query = request.request;

                if (cache[query]) {
                    that[_SOURCE_SUCCESS](cache[query], request);
                } else {
                    // Hack alert: JSONPRequest currently doesn't support
                    // per-request callbacks, so we're reaching into the protected
                    // _config object to make it happen.
                    //
                    // This limitation is mentioned in the following JSONP
                    // enhancement ticket:
                    //
                    // http://yuilibrary.com/projects/yui3/ticket/2529371
                    source._config.on.success = function (data) {
                        cache[query] = data;
                        that[_SOURCE_SUCCESS](data, request);
                    };

                    source.send(query);
                }
            };

            // Keep track of the most recent request in case there are multiple
            // requests while we're waiting for the JSONP module to load. Only
            // the most recent request will be sent.
            lastRequest = request;

            if (!loading) {
                loading = true;

                // Lazy-load the JSONP module if necessary, then overwrite the
                // sendRequest method to bypass this check in the future.
                Y.use('jsonp', function () {
                    // Turn the source into a JSONPRequest instance if it isn't
                    // one already.
                    if (!(source instanceof Y.JSONPRequest)) {
                        source = new Y.JSONPRequest(source, {
                            format: Y.bind(that._jsonpFormatter, that)
                        });
                    }

                    jsonpSource.sendRequest = _sendRequest;
                    _sendRequest(lastRequest);
                });
            }
        };

        return jsonpSource;
    },

    /**
     * Creates a DataSource-like object that calls the specified JSONP
     * URL or executes the specified YQL query for results. If the string starts
     * with "select ", "use ", or "set " (case-insensitive), it's assumed to be
     * a YQL query; otherwise, it's assumed to be a URL (which may be absolute
     * or relative). See the <code>source</code> attribute for more details.
     *
     * @method _createStringSource
     * @param {String} source JSONP URL or YQL query.
     * @return {Object} DataSource-like object.
     * @protected
     * @for AutoCompleteBase
     */
    _createStringSource: function (source) {
        if (this._YQL_SOURCE_REGEX.test(source)) {
            // Looks like a YQL query.
            return this._createYQLSource(source);
        } else {
            // Doesn't look like a YQL query, so assume it's a URL.
            return this._createJSONPSource(source);
        }
    },

    /**
     * Creates a DataSource-like object that uses the specified YQL query string
     * to create a YQL-based source. See the <code>source</code> attribute for
     * details. If no <code>resultListLocator</code> is defined, this method
     * will set a best-guess locator that might work for many typical YQL
     * queries.
     *
     * @method _createYQLSource
     * @param {String} source YQL query.
     * @return {Object} DataSource-like object.
     * @protected
     * @for AutoCompleteBase
     */
    _createYQLSource: function (source) {
        var cache     = {},
            yqlSource = {},
            that      = this,
            lastRequest, loading;

        if (!this.get(RESULT_LIST_LOCATOR)) {
            this.set(RESULT_LIST_LOCATOR, this._defaultYQLLocator);
        }

        yqlSource.sendRequest = function (request) {
            var yqlRequest,

            _sendRequest = function (request) {
                var query = request.request,
                    callback, maxResults, opts, yqlQuery;

                if (cache[query]) {
                    that[_SOURCE_SUCCESS](cache[query], request);
                } else {
                    callback = function (data) {
                        cache[query] = data;
                        that[_SOURCE_SUCCESS](data, request);
                    };

                    maxResults = that.get('maxResults');
                    opts       = {proto: that.get('yqlProtocol')};

                    yqlQuery = Lang.sub(source, {
                        maxResults: maxResults > 0 ? maxResults : 1000,
                        query     : query
                    });

                    // Only create a new YQLRequest instance if this is the
                    // first request. For subsequent requests, we'll reuse the
                    // original instance.
                    if (yqlRequest) {
                        yqlRequest._callback = callback;
                        yqlRequest._opts     = opts;
                        yqlRequest._params.q = yqlQuery;
                    } else {
                        yqlRequest = new Y.YQLRequest(yqlQuery, callback, null, opts);
                    }

                    yqlRequest.send();
                }
            };

            // Keep track of the most recent request in case there are multiple
            // requests while we're waiting for the YQL module to load. Only the
            // most recent request will be sent.
            lastRequest = request;

            if (!loading) {
                // Lazy-load the YQL module if necessary, then overwrite the
                // sendRequest method to bypass this check in the future.
                loading = true;

                Y.use('yql', function () {
                    yqlSource.sendRequest = _sendRequest;
                    _sendRequest(lastRequest);
                });
            }
        };

        return yqlSource;
    },

    /**
     * Default resultListLocator used when a string-based YQL source is set and
     * the implementer hasn't already specified one.
     *
     * @method _defaultYQLLocator
     * @param {Object} response YQL response object.
     * @return {Array}
     * @protected
     * @for AutoCompleteBase
     */
    _defaultYQLLocator: function (response) {
        var results = response && response.query && response.query.results,
            values;

        if (results && Lang.isObject(results)) {
            // If there's only a single value on YQL's results object, that
            // value almost certainly contains the array of results we want. If
            // there are 0 or 2+ values, then the values themselves are most
            // likely the results we want.
            values  = Y.Object.values(results) || [];
            results = values.length === 1 ? values[0] : values;

            if (!Lang.isArray(results)) {
                results = [results];
            }
        } else {
            results = [];
        }

        return results;
    },

    /**
     * URL formatter passed to <code>JSONPRequest</code> instances.
     *
     * @method _jsonpFormatter
     * @param {String} url
     * @param {String} proxy
     * @param {String} query
     * @return {String} Formatted URL
     * @protected
     * @for AutoCompleteBase
     */
    _jsonpFormatter: function (url, proxy, query) {
        var maxResults      = this.get('maxResults'),
            requestTemplate = this.get('requestTemplate');

        if (requestTemplate) {
            url = url + requestTemplate(query);
        }

        return Lang.sub(url, {
            callback  : proxy,
            maxResults: maxResults > 0 ? maxResults : 1000,

            // If a requestTemplate is set, assume that it will
            // handle URI encoding if necessary. Otherwise,
            // encode the query.
            query: requestTemplate ? query : encodeURIComponent(query)
        });
    }
};

ACSources.ATTRS = {
    /**
     * URL protocol to use when the <code>source</code> is set to a YQL query.
     *
     * @attribute yqlProtocol
     * @type String
     * @default 'http'
     * @for AutoCompleteBase
     */
    yqlProtocol: {
        value: 'http'
    }
};

Y.Base.mix(Y.AutoCompleteBase, [ACSources]);
