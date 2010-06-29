
    /**
     * This class adds a sugar class to allow access to YQL (http://developer.yahoo.com/yql/).
     * @module yql
     */     
    /**
     * Utility Class used under the hood my the YQL class
     * @class YQLRequest
     * @constructor
     * @param {String} sql The SQL statement to execute
     * @param {Function/Object} callback The callback to execute after the query (Falls through to JSONP).
     * @param {Object} params An object literal of extra parameters to pass along (optional).
     * @param {Object} params An object literal of configuration options (optional): proto (http|https), base (url)
     */
    var YQLRequest = function (sql, callback, params, opts) {
        var qs = '', url = ((opts && opts.proto) ? opts.proto : Y.YQLRequest.PROTO);
        
        if (!params) {
            params = {};
        }
        params.q = sql;
        params.format = 'json';
        if (!params.env) {
            params.env = Y.YQLRequest.ENV;
        }

        Y.each(params, function(v, k) {
            qs += k + '=' + encodeURIComponent(v) + '&';
        });
        
        url += ((opts && opts.base) ? opts.base : Y.YQLRequest.BASE_URL) + qs;

        Y.jsonp(url, callback);
    };

    /**
    * @static
    * @property PROTO
    * @description Default protocol to use: http
    */
    YQLRequest.PROTO = 'http';
    /**
    * @static
    * @property BASE_URL
    * @description The base URL to query: query.yahooapis.com/v1/public/yql?
    */
    YQLRequest.BASE_URL = ':/'+'/query.yahooapis.com/v1/public/yql?';
    /**
    * @static
    * @property ENV
    * @description The environment file to load: http://datatables.org/alltables.env
    */
    YQLRequest.ENV = 'http:/'+'/datatables.org/alltables.env';
    
    Y.YQLRequest = YQLRequest;
	
    /**
     * This class adds a sugar class to allow access to YQL (http://developer.yahoo.com/yql/).
     * @class YQL
     * @constructor
     * @param {String} sql The SQL statement to execute
     * @param {Function} callback The callback to execute after the query (optional).
     * @param {Object} params An object literal of extra parameters to pass along (optional).
     */
	Y.YQL = function(sql, callback, params) {
        return new Y.YQLRequest(sql, callback, params);
    };

