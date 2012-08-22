if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["yql"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "yql",
    code: []
};
_yuitest_coverage["yql"].code=["YUI.add('yql', function (Y, NAME) {","","    /**","     * This class adds a sugar class to allow access to YQL (http://developer.yahoo.com/yql/).","     * @module yql","     */     ","    /**","     * Utility Class used under the hood my the YQL class","     * @class YQLRequest","     * @constructor","     * @param {String} sql The SQL statement to execute","     * @param {Function/Object} callback The callback to execute after the query (Falls through to JSONP).","     * @param {Object} params An object literal of extra parameters to pass along (optional).","     * @param {Object} opts An object literal of configuration options (optional): proto (http|https), base (url)","     */","    var YQLRequest = function (sql, callback, params, opts) {","        ","        if (!params) {","            params = {};","        }","        params.q = sql;","        //Allow format override.. JSON-P-X","        if (!params.format) {","            params.format = Y.YQLRequest.FORMAT;","        }","        if (!params.env) {","            params.env = Y.YQLRequest.ENV;","        }","","        this._context = this;","","        if (opts && opts.context) {","            this._context = opts.context;","            delete opts.context;","        }","        ","        if (params && params.context) {","            this._context = params.context;","            delete params.context;","        }","        ","        this._params = params;","        this._opts = opts;","        this._callback = callback;","","    };","    ","    YQLRequest.prototype = {","        /**","        * @private","        * @property _jsonp","        * @description Reference to the JSONP instance used to make the queries","        */","        _jsonp: null,","        /**","        * @private","        * @property _opts","        * @description Holder for the opts argument","        */","        _opts: null,","        /**","        * @private","        * @property _callback","        * @description Holder for the callback argument","        */","        _callback: null,","        /**","        * @private","        * @property _params","        * @description Holder for the params argument","        */","        _params: null,","        /**","        * @private","        * @property _context","        * @description The context to execute the callback in","        */","        _context: null,","        /**","        * @private","        * @method _internal","        * @description Internal Callback Handler","        */","        _internal: function() {","            this._callback.apply(this._context, arguments);","        },","        /**","        * @method send","        * @description The method that executes the YQL Request.","        * @chainable","        * @return {YQLRequest}","        */","        send: function() {","            var qs = [], url = ((this._opts && this._opts.proto) ? this._opts.proto : Y.YQLRequest.PROTO), o;","","            Y.each(this._params, function(v, k) {","                qs.push(k + '=' + encodeURIComponent(v));","            });","","            qs = qs.join('&');","            ","            url += ((this._opts && this._opts.base) ? this._opts.base : Y.YQLRequest.BASE_URL) + qs;","            ","            o = (!Y.Lang.isFunction(this._callback)) ? this._callback : { on: { success: this._callback } };","","            o.on = o.on || {};","            this._callback = o.on.success;","","            o.on.success = Y.bind(this._internal, this);","","            if (o.allowCache !== false) {","                o.allowCache = true;","            }","            ","            if (!this._jsonp) {","                this._jsonp = Y.jsonp(url, o);","            } else {","                this._jsonp.url = url;","                if (o.on && o.on.success) {","                    this._jsonp._config.on.success = o.on.success;","                }","                this._jsonp.send();","            }","            return this;","        }","    };","","    /**","    * @static","    * @property FORMAT","    * @description Default format to use: json","    */","    YQLRequest.FORMAT = 'json';","    /**","    * @static","    * @property PROTO","    * @description Default protocol to use: http","    */","    YQLRequest.PROTO = 'http';","    /**","    * @static","    * @property BASE_URL","    * @description The base URL to query: query.yahooapis.com/v1/public/yql?","    */","    YQLRequest.BASE_URL = ':/'+'/query.yahooapis.com/v1/public/yql?';","    /**","    * @static","    * @property ENV","    * @description The environment file to load: http://datatables.org/alltables.env","    */","    YQLRequest.ENV = 'http:/'+'/datatables.org/alltables.env';","    ","    Y.YQLRequest = YQLRequest;","	","    /**","     * This class adds a sugar class to allow access to YQL (http://developer.yahoo.com/yql/).","     * @class YQL","     * @constructor","     * @param {String} sql The SQL statement to execute","     * @param {Function} callback The callback to execute after the query (optional).","     * @param {Object} params An object literal of extra parameters to pass along (optional).","     * @param {Object} opts An object literal of configuration options (optional): proto (http|https), base (url)","     */","	Y.YQL = function(sql, callback, params, opts) {","        return new Y.YQLRequest(sql, callback, params, opts).send();","    };","","","","}, '@VERSION@', {\"requires\": [\"jsonp\", \"jsonp-url\"]});"];
_yuitest_coverage["yql"].lines = {"1":0,"16":0,"18":0,"19":0,"21":0,"23":0,"24":0,"26":0,"27":0,"30":0,"32":0,"33":0,"34":0,"37":0,"38":0,"39":0,"42":0,"43":0,"44":0,"48":0,"85":0,"94":0,"96":0,"97":0,"100":0,"102":0,"104":0,"106":0,"107":0,"109":0,"111":0,"112":0,"115":0,"116":0,"118":0,"119":0,"120":0,"122":0,"124":0,"133":0,"139":0,"145":0,"151":0,"153":0,"164":0,"165":0};
_yuitest_coverage["yql"].functions = {"YQLRequest:16":0,"_internal:84":0,"(anonymous 2):96":0,"send:93":0,"YQL:164":0,"(anonymous 1):1":0};
_yuitest_coverage["yql"].coveredLines = 46;
_yuitest_coverage["yql"].coveredFunctions = 6;
_yuitest_coverline("yql", 1);
YUI.add('yql', function (Y, NAME) {

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
     * @param {Object} opts An object literal of configuration options (optional): proto (http|https), base (url)
     */
    _yuitest_coverfunc("yql", "(anonymous 1)", 1);
_yuitest_coverline("yql", 16);
var YQLRequest = function (sql, callback, params, opts) {
        
        _yuitest_coverfunc("yql", "YQLRequest", 16);
_yuitest_coverline("yql", 18);
if (!params) {
            _yuitest_coverline("yql", 19);
params = {};
        }
        _yuitest_coverline("yql", 21);
params.q = sql;
        //Allow format override.. JSON-P-X
        _yuitest_coverline("yql", 23);
if (!params.format) {
            _yuitest_coverline("yql", 24);
params.format = Y.YQLRequest.FORMAT;
        }
        _yuitest_coverline("yql", 26);
if (!params.env) {
            _yuitest_coverline("yql", 27);
params.env = Y.YQLRequest.ENV;
        }

        _yuitest_coverline("yql", 30);
this._context = this;

        _yuitest_coverline("yql", 32);
if (opts && opts.context) {
            _yuitest_coverline("yql", 33);
this._context = opts.context;
            _yuitest_coverline("yql", 34);
delete opts.context;
        }
        
        _yuitest_coverline("yql", 37);
if (params && params.context) {
            _yuitest_coverline("yql", 38);
this._context = params.context;
            _yuitest_coverline("yql", 39);
delete params.context;
        }
        
        _yuitest_coverline("yql", 42);
this._params = params;
        _yuitest_coverline("yql", 43);
this._opts = opts;
        _yuitest_coverline("yql", 44);
this._callback = callback;

    };
    
    _yuitest_coverline("yql", 48);
YQLRequest.prototype = {
        /**
        * @private
        * @property _jsonp
        * @description Reference to the JSONP instance used to make the queries
        */
        _jsonp: null,
        /**
        * @private
        * @property _opts
        * @description Holder for the opts argument
        */
        _opts: null,
        /**
        * @private
        * @property _callback
        * @description Holder for the callback argument
        */
        _callback: null,
        /**
        * @private
        * @property _params
        * @description Holder for the params argument
        */
        _params: null,
        /**
        * @private
        * @property _context
        * @description The context to execute the callback in
        */
        _context: null,
        /**
        * @private
        * @method _internal
        * @description Internal Callback Handler
        */
        _internal: function() {
            _yuitest_coverfunc("yql", "_internal", 84);
_yuitest_coverline("yql", 85);
this._callback.apply(this._context, arguments);
        },
        /**
        * @method send
        * @description The method that executes the YQL Request.
        * @chainable
        * @return {YQLRequest}
        */
        send: function() {
            _yuitest_coverfunc("yql", "send", 93);
_yuitest_coverline("yql", 94);
var qs = [], url = ((this._opts && this._opts.proto) ? this._opts.proto : Y.YQLRequest.PROTO), o;

            _yuitest_coverline("yql", 96);
Y.each(this._params, function(v, k) {
                _yuitest_coverfunc("yql", "(anonymous 2)", 96);
_yuitest_coverline("yql", 97);
qs.push(k + '=' + encodeURIComponent(v));
            });

            _yuitest_coverline("yql", 100);
qs = qs.join('&');
            
            _yuitest_coverline("yql", 102);
url += ((this._opts && this._opts.base) ? this._opts.base : Y.YQLRequest.BASE_URL) + qs;
            
            _yuitest_coverline("yql", 104);
o = (!Y.Lang.isFunction(this._callback)) ? this._callback : { on: { success: this._callback } };

            _yuitest_coverline("yql", 106);
o.on = o.on || {};
            _yuitest_coverline("yql", 107);
this._callback = o.on.success;

            _yuitest_coverline("yql", 109);
o.on.success = Y.bind(this._internal, this);

            _yuitest_coverline("yql", 111);
if (o.allowCache !== false) {
                _yuitest_coverline("yql", 112);
o.allowCache = true;
            }
            
            _yuitest_coverline("yql", 115);
if (!this._jsonp) {
                _yuitest_coverline("yql", 116);
this._jsonp = Y.jsonp(url, o);
            } else {
                _yuitest_coverline("yql", 118);
this._jsonp.url = url;
                _yuitest_coverline("yql", 119);
if (o.on && o.on.success) {
                    _yuitest_coverline("yql", 120);
this._jsonp._config.on.success = o.on.success;
                }
                _yuitest_coverline("yql", 122);
this._jsonp.send();
            }
            _yuitest_coverline("yql", 124);
return this;
        }
    };

    /**
    * @static
    * @property FORMAT
    * @description Default format to use: json
    */
    _yuitest_coverline("yql", 133);
YQLRequest.FORMAT = 'json';
    /**
    * @static
    * @property PROTO
    * @description Default protocol to use: http
    */
    _yuitest_coverline("yql", 139);
YQLRequest.PROTO = 'http';
    /**
    * @static
    * @property BASE_URL
    * @description The base URL to query: query.yahooapis.com/v1/public/yql?
    */
    _yuitest_coverline("yql", 145);
YQLRequest.BASE_URL = ':/'+'/query.yahooapis.com/v1/public/yql?';
    /**
    * @static
    * @property ENV
    * @description The environment file to load: http://datatables.org/alltables.env
    */
    _yuitest_coverline("yql", 151);
YQLRequest.ENV = 'http:/'+'/datatables.org/alltables.env';
    
    _yuitest_coverline("yql", 153);
Y.YQLRequest = YQLRequest;
	
    /**
     * This class adds a sugar class to allow access to YQL (http://developer.yahoo.com/yql/).
     * @class YQL
     * @constructor
     * @param {String} sql The SQL statement to execute
     * @param {Function} callback The callback to execute after the query (optional).
     * @param {Object} params An object literal of extra parameters to pass along (optional).
     * @param {Object} opts An object literal of configuration options (optional): proto (http|https), base (url)
     */
	_yuitest_coverline("yql", 164);
Y.YQL = function(sql, callback, params, opts) {
        _yuitest_coverfunc("yql", "YQL", 164);
_yuitest_coverline("yql", 165);
return new Y.YQLRequest(sql, callback, params, opts).send();
    };



}, '@VERSION@', {"requires": ["jsonp", "jsonp-url"]});
