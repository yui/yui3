YUI.add('yql', function(Y) {


    /**
     * This class adds a sugar class to allow access to YQL (http://developer.yahoo.com/yql/).
     * @module yql
     */     
    /**
     * Utility Class used under the hood my the YQL class
     * @class YQLRequest
     * @constructor
     * @param {String} sql The SQL statement to execute
     * @param {Function} callback The callback to execute after the query (optional).
     * @param {Object} params An object literal of extra parameters to pass along (optional).
     */
    var yql = function (sql, callback, params) {
        this.query(sql, callback, params);
    };

    /**
    * @method query
    * @description Builds the query and fire the Get call.
    * @param {String} sql The SQL statement to execute
    * @param {Function} callback The callback to execute after the query (optional).
    * @param {Object} params An object literal of extra parameters to pass along (optional).
    */
    yql.prototype.query = function(sql, callback, params) {
        var qs = '', url = Y.YQLRequest.PROTO;
        
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
        
        url += Y.YQLRequest.BASE_URL + qs;

        Y.jsonp(url, callback);
    };

    /**
    * @static
    * @property PROTO
    * @description Default protocol to use: http
    */
    yql.PROTO = 'http';
    /**
    * @static
    * @property BASE_URL
    * @description The base URL to query: query.yahooapis.com/v1/public/yql?
    */
    yql.BASE_URL = ':/'+'/query.yahooapis.com/v1/public/yql?';
    /**
    * @static
    * @property ENV
    * @description The environment file to load: http://datatables.org/alltables.env
    */
    yql.ENV = 'http:/'+'/datatables.org/alltables.env';
    
    Y.YQLRequest = yql;
	
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



}, '@VERSION@' ,{requires:['jsonp']});
