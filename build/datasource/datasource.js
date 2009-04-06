YUI.add('datasource-base', function(Y) {

/**
 * The DataSource utility provides a common configurable interface for widgets to
 * access a variety of data, from JavaScript arrays to online database servers.
 *
 * @module datasource
 * @requires base
 * @title DataSource Utility
 */
var LANG = Y.Lang,
    
/**
 * Base class for the YUI DataSource utility.
 * @class DataSource
 * @extends Base
 * @constructor
 */    
DSLocal = function() {
    DSLocal.superclass.constructor.apply(this, arguments);
};
    
    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource static properties
    //
    /////////////////////////////////////////////////////////////////////////////
Y.mix(DSLocal, {
    /**
     * Class name.
     *
     * @property DataSource.NAME
     * @type String
     * @static     
     * @final
     * @value "DataSource.Local"
     */
    NAME: "DataSource.Local",

    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource Attributes
    //
    /////////////////////////////////////////////////////////////////////////////

    ATTRS: {
        /**
        * @attribute source
        * @description Pointer to live data.
        * @type MIXED
        * @default null        
        */
        source: {
            value: null
        }
    },

    /**
     * Global transaction counter.
     *
     * @property DataSource._tId
     * @type Number
     * @static
     * @private
     * @default 0
     */
    _tId: 0,

    /**
     * Executes a given callback.  The third param determines whether to execute
     *
     * @method DataSource.issueCallback
     * @param callback {Object} The callback object.
     * @param params {Array} params to be passed to the callback method
     * @param error {Boolean} whether an error occurred
     * @static
     */
    issueCallback: function (response) {
        if(response.callback) {
            var scope = response.callback.scope || window,
                callbackFunc = (response.error && response.callback.failure) || response.callback.success;
            if (callbackFunc) {
                callbackFunc.apply(scope, [response]);
            }
        }
    }
});
    
Y.extend(DSLocal, Y.Base, {
    /**
    * @property _queue
    * @description Object literal to manage asynchronous request/response
    * cycles enabled if queue needs to be managed (asyncMode/xhrConnMode):
        <dl>
            <dt>interval {Number}</dt>
                <dd>Interval ID of in-progress queue.</dd>
            <dt>conn</dt>
                <dd>In-progress connection identifier (if applicable).</dd>
            <dt>requests {Object[]}</dt>
                <dd>Array of queued request objects: {request:oRequest, callback:_xhrCallback}.</dd>
        </dl>
    * @type Object
    * @default {interval:null, conn:null, requests:[]}    
    * @private     
    */
    _queue: null,
    
    /**
    * @method initializer
    * @description Internal init() handler.
    * @private        
    */
    initializer: function() {
        this._queue = {interval:null, conn:null, requests:[]};
        this._initEvents();
    },

    /**
    * @method destructor
    * @description Internal destroy() handler.
    * @private        
    */
    destructor: function() {
    },

    /**
    * @method _createEvents
    * @description This method creates all the events for this module
    * Target and publishes them so we get Event Bubbling.
    * @private        
    */
    _initEvents: function() {
        /**
         * Fired when a data request is received.
         *
         * @event request
         * @param e {Event.Facade} Event Facade.         
         * @param o {Object} Object with the following properties:
         * <dl>                          
         * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
         * <dt>request (Object)</dt> <dd>The request.</dd>
         * <dt>callback (Object)</dt> <dd>The callback object.</dd>
         * </dl>
         * @preventable _defRequestFn
         */
        //this.publish("request", {defaultFn: this._defRequestFn});
        this.publish("request", {defaultFn:function(e, o){
            this._defRequestFn(e, o);
        }});
         
        /**
         * Fired when raw data is received.
         *
         * @event data
         * @param e {Event.Facade} Event Facade.
         * @param o {Object} Object with the following properties:
         * <dl>                          
         * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
         * <dt>request (Object)</dt> <dd>The request.</dd>
         * <dt>callback (Object)</dt> <dd>The callback object.</dd>
         * <dt>data (Object)</dt> <dd>The raw data.</dd>
         * </dl>
         * @preventable _defDataFn
         */
        //this.publish("data", {defaultFn: this._defDataFn});
         this.publish("data", {defaultFn:function(e, o){
            this._defDataFn(e, o);
        }});

        /**
         * Fired when response is returned.
         *
         * @event response
         * @param e {Event.Facade} Event Facade.
         * @param o {Object} Object with the following properties:
         * <dl>
         * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
         * <dt>request (Object)</dt> <dd>The request.</dd>
         * <dt>callback (Object)</dt> <dd>The callback object.</dd>
         * <dt>data (Object)</dt> <dd>The raw data.</dd>
         * <dt>results (Object)</dt> <dd>Parsed results.</dd>
         * <dt>meta (Object)</dt> <dd>Parsed meta results data.</dd>
         * <dt>error (Boolean)</dt> <dd>Error flag.</dd>
         * </dl>
         * @preventable _defResponseFn
         */
         //this.publish("response", {defaultFn: this._defResponseFn});
         this.publish("response", {defaultFn:function(e, o){
            this._defResponseFn(e, o);
        }});

        /**
         * Fired when an error is encountered.
         *
         * @event error
         * @param e {Event.Facade} Event Facade.
         * @param o {Object} Object with the following properties:
         * <dl>
         * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
         * <dt>request (Object)</dt> <dd>The request.</dd>
         * <dt>callback (Object)</dt> <dd>The callback object.</dd>
         * <dt>data (Object)</dt> <dd>The raw data (if available).</dd>
         * <dt>results (Object)</dt> <dd>Parsed results (if available).</dd>
         * <dt>meta (Object)</dt> <dd>Parsed meta results data (if available).</dd>
         * <dt>error (Boolean)</dt> <dd>Error flag.</dd>
         * </dl>
         */

    },

    /**
     * Manages request/response transaction. Must fire <code>response</code>
     * event when response is received. This method should be implemented by
     * subclasses to achieve more complex behavior such as accessing remote data.
     *
     * @method _defRequestFn
     * @param e {Event.Facade} Event Facade.         
     * @param o {Object} Object with the following properties:
     * <dl>                          
     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
     * <dt>request (Object)</dt> <dd>The request.</dd>
     * <dt>callback (Object)</dt> <dd>The callback object.</dd>
     * </dl>
     * @protected
     */
    _defRequestFn: function(e, o) {
        var data = this.get("source");
        
        // Problematic data
        if(LANG.isUndefined(data)) {
            o.error = true;
        }
        if(o.error) {
            this.fire("error", null, o);
        }

        this.fire("data", null, Y.mix(o, {data:data}));
    },

    /**
     * Normalizes raw data into a response that includes results and meta properties.
     *
     * @method _defDataFn
     * @param e {Event.Facade} Event Facade.
     * @param o {Object} Object with the following properties:
     * <dl>                          
     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
     * <dt>request (Object)</dt> <dd>The request.</dd>
     * <dt>callback (Object)</dt> <dd>The callback object.</dd>
     * <dt>data (Object)</dt> <dd>The raw response data.</dd>
     * </dl>
     * @protected
     */
    _defDataFn: function(e, o) {
        // Pass through data as-is
        o.results = o.data;
        
        // Normalize
        if(!o.results) {
            o.results = [];
        }
        if(!o.meta) {
            o.meta = {};
        }
        
        this.fire("response", null, o);
    },

    /**
     * Sends data as a normalized response to callback.
     *
     * @method _defResponseFn
     * @param e {Event.Facade} Event Facade.
     * @param o {Object} Object with the following properties:
     * <dl>
     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
     * <dt>request (Object)</dt> <dd>The request.</dd>
     * <dt>callback (Object)</dt> <dd>The callback object.</dd>
     * <dt>data (Object)</dt> <dd>Raw data.</dd>
     * <dt>results (Object)</dt> <dd>Parsed results.</dd>
     * <dt>meta (Object)</dt> <dd>Parsed meta data.</dd>
     * </dl>
     * @protected
     */
    _defResponseFn: function(e, o) {
        // Send the response back to the callback
        DSLocal.issueCallback(o);
    },
    /**
     * Generates a unique transaction ID and fires <code>request</code> event.
     *
     * @method sendRequest
     * @param request {Object} Request.
     * @param callback {Object} An object literal with the following properties:
     *     <dl>
     *     <dt><code>success</code></dt>
     *     <dd>The function to call when the data is ready.</dd>
     *     <dt><code>failure</code></dt>
     *     <dd>The function to call upon a response failure condition.</dd>
     *     <dt><code>scope</code></dt>
     *     <dd>The object to serve as the scope for the success and failure handlers.</dd>
     *     <dt><code>argument</code></dt>
     *     <dd>Arbitrary data payload that will be passed back to the success and failure handlers.</dd>
     *     </dl>
     * @return {Number} Transaction ID.
     */
    sendRequest: function(request, callback) {
        var tId = DSLocal._tId++;
        this.fire("request", null, {tId:tId, request:request,callback:callback});
        return tId;
    }
});
    
Y.namespace("DataSource");
Y.DataSource.Local = DSLocal;
    



}, '@VERSION@' ,{requires:['base']});

YUI.add('datasource-xhr', function(Y) {

/**
 * The DataSource utility provides a common configurable interface for widgets to
 * access a variety of data, from JavaScript arrays to online database servers.
 *
 * @module datasource-xhr
 * @requires datasource-base
 * @title DataSource XHR Submodule
 */
    
/**
 * XHR subclass for the YUI DataSource utility.
 * @class DataSource.XHR
 * @extends DataSource
 * @constructor
 */    
var DSXHR = function() {
    DSXHR.superclass.constructor.apply(this, arguments);
};
    

    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource.XHR static properties
    //
    /////////////////////////////////////////////////////////////////////////////
Y.mix(DSXHR, {
    /**
     * Class name.
     *
     * @property DataSource.XHR.NAME
     * @type String
     * @static     
     * @final
     * @value "DataSource.XHR"
     */
    NAME: "DataSource.XHR",


    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource.XHR Attributes
    //
    /////////////////////////////////////////////////////////////////////////////

    ATTRS: {
        /**
         * Pointer to IO Utility.
         *
         * @attribute io
         * @type Y.io
         * @default Y.io
         */
        io: {
            value: Y.io
        }
    }
});
    
Y.extend(DSXHR, Y.DataSource.Local, {
    /**
     * Passes query string to IO. Fires <code>response</code> event when
     * response is received asynchronously.
     *
     * @method _defRequestFn
     * @param e {Event.Facade} Event Facade.
     * @param o {Object} Object with the following properties:
     * <dl>
     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
     * <dt>request (Object)</dt> <dd>The request.</dd>
     * <dt>callback (Object)</dt> <dd>The callback object.</dd>
     * </dl>
     * @protected
     */
    _defRequestFn: function(e, o) {
        var uri = this.get("source"),
            cfg = {
                on: {
                    success: function (id, response, o) {
                        this.fire("data", null, Y.mix(o, {data:response}));
                        //{tId:args.tId, request:args.request, callback:args.callback, response:response}
                        //this.handleResponse(args.tId, args.request, args.callback, response);
                    },
                    failure: function (id, response, o) {
                        o.error = true;
                        this.fire("error", null, Y.mix(o, {data:response}));
                        this.fire("data", null, Y.mix(o, {data:response}));
                        //{tId:args.tId, request:args.request, callback:args.callback, response:response}
                        //this.handleResponse(args.tId, args.request, args.callback, response);
                    }
                },
                context: this,
                arguments: {
                    tId: o.tId,
                    request: o.request,
                    callback: o.callback
                }
            };
        
        this.get("io")(uri, cfg);
        return o.tId;
    }
});
  
Y.DataSource.XHR = DSXHR;
    



}, '@VERSION@' ,{requires:['datasource-base']});

YUI.add('datasource-cache', function(Y) {

/**
 * Extends DataSource with caching functionality.
 *
 * @module datasource-cache
 * @requires plugin, cache
 * @title DataSource Cache Extension
 */

/**
 * Adds cacheability to the YUI DataSource utility.
 * @class DataSourceCache
 */    
var DataSourceCache = function() {
    DataSourceCache.superclass.constructor.apply(this, arguments);
};

Y.mix(DataSourceCache, {
    /**
     * The namespace for the plugin. This will be the property on the host which
     * references the plugin instance.
     *
     * @property NS
     * @type String
     * @static
     * @final
     * @value "cache"
     */
    NS: "cache",

    /**
     * Class name.
     *
     * @property DataParser.Base.NAME
     * @type String
     * @static
     * @final
     * @value "DataSourceCache"
     */
    NAME: "DataSourceCache",

    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSourceCache Attributes
    //
    /////////////////////////////////////////////////////////////////////////////

    ATTRS: {

    }
});

Y.extend(DataSourceCache, Y.Cache, {
    /**
    * @method initializer
    * @description Internal init() handler.
    * @private
    */
    initializer: function(config) {
        this.doBefore("_defRequestFn", this._beforeDefRequestFn);
        this.doBefore("_defResponseFn", this._beforeDefResponseFn);
    },

    /**
     * First look for cached response, then send request to live data.
     *
     * @method _beforeDefRequestFn
     * @param e {Event.Facade} Event Facade.
     * @param o {Object} Object with the following properties:
     * <dl>
     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
     * <dt>request (Object)</dt> <dd>The request.</dd>
     * <dt>callback (Object)</dt> <dd>The callback object.</dd>
     * </dl>
     * @protected
     */
    _beforeDefRequestFn: function(e, o) {
        // Is response already in the Cache?
        var entry = (this.retrieve(o.request)) || null;
        if(entry && entry.response) {
            this._owner.fire("response", null, Y.mix(o, entry.response));
            return new Y.Do.Halt("DataSourceCache plugin halted _defRequestFn");
            //BASE.issueCallback(entry.response);
            //return new Y.Do.Halt("msg", "newRetVal");
        }
    },
    
    /**
     * Adds data to cache before returning data.
     *
     * @method _beforeResponse
     * @param e {Event.Facade} Event Facade.
     * @param o {Object} Object with the following properties:
     * <dl>
     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
     * <dt>request (Object)</dt> <dd>The request.</dd>
     * <dt>callback (Object)</dt> <dd>The callback object.</dd>
     * <dt>data (Object)</dt> <dd>Raw data.</dd>
     * <dt>results (Object)</dt> <dd>Parsed results.</dd>
     * <dt>meta (Object)</dt> <dd>Parsed meta data.</dd>
     * </dl>
     * @protected
     */
     _beforeDefResponseFn: function(e, o) {
        // Add to Cache before returning
        this.add(o.request, o, (o.callback && o.callback.argument));
     }
});

Y.namespace('plugin');
Y.plugin.DataSourceCache = DataSourceCache;



}, '@VERSION@' ,{requires:['plugin', 'datasource-base']});

YUI.add('datasource-dataparser', function(Y) {

/**
 * Extends DataSource with schema-based parsing functionality.
 *
 * @module datasource-dataparser
 * @requires datasource-base,dataparser-base
 * @title DataSource DataParser Extension
 */

/**
 * Adds parsability to the YUI DataSource utility.
 * @class Parsable
 */    
var Parsable = function() {};

Parsable.ATTRS = {
    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource Attributes
    //
    /////////////////////////////////////////////////////////////////////////////

    /**
     * Instance of DataParser.
     *
     * @attribute parser
     * @type Y.DataParser.Base
     * @default null
     */
    parser: {
        value: null,
        validator: function(value) {
            return ((value instanceof Y.DataParser.Base) || (value === null));
        }
    }
};
    
Parsable.prototype = {
    /**
     * Parses raw data into a normalized response.
     *
     * @method _defDataFn
     * @param e {Event.Facade} Event Facade.
     * @param o {Object} Object with the following properties:
     * <dl>
     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
     * <dt>request (Object)</dt> <dd>The request.</dd>
     * <dt>callback (Object)</dt> <dd>The callback object.</dd>
     * <dt>data (Object)</dt> <dd>The raw response.</dd>
     * </dl>
     * @protected
     */
    _defDataFn: function(e, o) {
        var response = (this.get("parser") && this.get("parser").parse(o.data));
        if(!response) {
            response = {
                meta: {},
                results: o.data
            };
        }
        this.fire("response", null, Y.mix(o, response));
    }
};
    
//Y.DataSource.Local = Y.Base.build(Y.DataSource.Local.NAME, Y.DataSource.Local, [Parsable]);



}, '@VERSION@' ,{requires:['datasource', 'dataparser']});

YUI.add('datasource-polling', function(Y) {

/**
 * Extends DataSource with polling functionality.
 *
 * @module datasource-polling
 * @requires datasource-base
 * @title DataSource Polling Extension
 */
    var LANG = Y.Lang,
    
    /**
     * Adds polling to the YUI DataSource utility.
     * @class Pollable
     */    
    Pollable = function() {};

    
Pollable.prototype = {

    /**
    * @property _intervals
    * @description Array of polling interval IDs that have been enabled,
    * stored here to be able to clear all intervals.
    * @private
    */
    _intervals: null,

    /**
     * Sets up a polling mechanism to send requests at set intervals and forward
     * responses to given callback.
     *
     * @method setInterval
     * @param msec {Number} Length of interval in milliseconds.
     * @param request {Object} Request object.
     * @param callback {Object} An object literal with the following properties:
     *     <dl>
     *     <dt><code>success</code></dt>
     *     <dd>The function to call when the data is ready.</dd>
     *     <dt><code>failure</code></dt>
     *     <dd>The function to call upon a response failure condition.</dd>
     *     <dt><code>scope</code></dt>
     *     <dd>The object to serve as the scope for the success and failure handlers.</dd>
     *     <dt><code>argument</code></dt>
     *     <dd>Arbitrary data that will be passed back to the success and failure handlers.</dd>
     *     </dl>
     * @return {Number} Interval ID.
     */
    setInterval: function(msec, request, callback) {
        if(LANG.isNumber(msec) && (msec >= 0)) {
            var self = this,
                id = setInterval(function() {
                    self.sendRequest(request, callback);
                    //self._makeConnection(request, callback);
                }, msec);
            if(!this._intervals) {
                this._intervals = [];
            }
            this._intervals.push(id);
            return id;
        }
        else {
        }
    },

    /**
     * Disables polling mechanism associated with the given interval ID.
     *
     * @method clearInterval
     * @param id {Number} Interval ID.
     */
    clearInterval: function(id) {
        // Remove from tracker if there
        var tracker = this._intervals || [],
            i = tracker.length-1;

        for(; i>-1; i--) {
            if(tracker[i] === id) {
                tracker.splice(i,1);
                clearInterval(id);
            }
        }
    }
};
    
//Y.DataSource.Local = Y.Base.build(Y.DataSource.Local.NAME, Y.DataSource.Local, [Pollable]);



}, '@VERSION@' ,{requires:['datasource-base']});



YUI.add('datasource', function(Y){}, '@VERSION@' ,{use:['datasource-base','datasource-xhr','datasource-cache', 'datasource-dataparser', 'datasource-polling']});

