YUI.add('datasource-base', function(Y) {

/**
 * The DataSource utility provides a common configurable interface for widgets to
 * access a variety of data, from JavaScript arrays to online database servers.
 *
 * @module datasource
 * @requires base
 * @title DataSource Utility
 */
    Y.namespace("DataSource");
    var DS = Y.DataSource;
    
    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource static properties
    //
    /////////////////////////////////////////////////////////////////////////////
    
Y.mix(DS, { 
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
     * Indicates null data response.
     *
     * @property DataSource.ERROR_DATANULL
     * @type Number
     * @static     
     * @final
     * @default 0     
     */
    ERROR_DATANULL: 0,

    /**
     * Indicates invalid data response.
     *
     * @property DataSource.ERROR_DATAINVALID
     * @type Number
     * @static     
     * @final
     * @default 1    
     */
    ERROR_DATAINVALID: 1
});
    
    var LANG = Y.Lang,
    
    /**
     * Base class for the YUI DataSource utility.
     * @class DataSource.Base
     * @extends Base
     * @constructor
     */    
    Base = function() {
        Base.superclass.constructor.apply(this, arguments);
    };
    

    /////////////////////////////////////////////////////////////////////////////
    //
    // Base static properties
    //
    /////////////////////////////////////////////////////////////////////////////
Y.mix(Base, {    
    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static     
     * @final
     * @value "DataSource.Base"
     */
    NAME: "DataSource.Base",

    /////////////////////////////////////////////////////////////////////////////
    //
    // Base Attributes
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
        },
        
        /**
        * @attribute ERROR_DATAINVALID
        * @description Error message for invalid data responses.
        * @type String
        * @default "Invalid data"
        */
        ERROR_DATAINVALID: {
            value: "Invalid data"
        },


        /**
        * @attribute ERROR_DATANULL
        * @description Error message for null data responses.
        * @type String
        * @default "Null data"        
        */
        ERROR_DATANULL: {
            value: "Null data"
        }
    },

    /**
     * Executes a given callback.  For object literal callbacks, the third
     * param determines whether to execute the success handler or failure handler.
     *
     * @method issueCallback
     * @param callback {Function|Object} the callback to execute
     * @param params {Array} params to be passed to the callback method
     * @param error {Boolean} whether an error occurred
     * @static
     */
    issueCallback: function (callback, params, error) {
        if(callback) {
            var scope = callback.scope || window,
                callbackFunc = (error && callback.failure) || callback.success;
            if (callbackFunc) {
                callbackFunc.apply(scope, params.concat([callback.argument]));
            }
        }
    }
});
    
Y.extend(Base, Y.Base, {
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
         * Fired when an error is encountered.
         *
         * @event error
         * @param args {Object} Object literal data payload.         
         * @param args.request {MIXED} The request.
         * @param args.response {Object} The response object.
         * @param args.callback {Object} The callback object.
         */
         
        /**
         * Fired when a request is sent to the live data source.
         *
         * @event request
         * @param e {Event.Facade} Event Facade.         
         * @param e.tId {Number} Unique transaction ID.             
         * @param e.request {MIXED} The request.
         * @param e.callback {Object} The callback object.
         */
        this.publish("request", {
            //emitFacade: false,
            defaultFn: this._makeConnection
        });
         
        /**
         * Fired when a response is received from the live data source.
         *
         * @event response
         * @param e {Event.Facade} Event Facade.         
         * @param e.tId {Number} Unique transaction ID.             
         * @param e.request {MIXED} The request.
         * @param e.callback {Object} The callback object.
         * @param e.response {Object} The raw response data.         
         */
        this.publish("response", {
            //emitFacade: false,
            defaultFn: this._handleResponse
        });
    },

    /**
     * Overridable default <code>request</code> event handler manages request/response
     * transaction. Must fire <code>response</code> event when response is received. This
     * method should be implemented by subclasses to achieve more complex
     * behavior such as accessing remote data.
     *
     * @method _makeConnection
     * @protected
     * @param e {Event.Facade} Custom Event Facade for <code>request</code> event.
     * @param e.tId {Number} Transaction ID.
     * @param e.request {MIXED} Request.
     * @param e.callback {Object} Callback object.
     */
    _makeConnection: function(e) {
        this.fire("response", Y.mix(e.details[0], {response:this.get("source")}));
    },

    /**
     * Overridable default <code>response</code> event handler receives raw data response and
     * by default, passes it as-is to returnData.
     *
     * @method _handleResponse
     * @protected
     * @param args.tId {Number} Transaction ID.
     * @param args.request {MIXED} Request.
     * @param args.callback {Object} Callback object.
     * @param args.response {MIXED} Raw data response.
     */
    _handleResponse: function(args) {
        this.returnData(args.tId, args.request, args.callback, {results: args.response});

    },

    /**
     * Generates a unique transaction ID and fires <code>request</code> event.
     *
     * @method sendRequest
     * @param request {MIXED} Request.
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
        var tId = DS._tId++;
        this.fire("request", {tId:tId, request:request,callback:callback});
        return tId;
    },

    /**
     * Overridable method returns data to callback.
     *
     * @method returnData
     * @param tId {Number} Transaction ID.
     * @param request {MIXED} Request.
     * @param callback {Object} Callback object.
     * @param response {MIXED} Raw data response.
     */
    returnData: function(tId, request, callback, response) {
        // Problemic response
        if(!response) {
            response = {error:true};
        }
        // Handle any error
        if(response.error) {
            this.fire("error", {tId:tId, request:request, callback:callback, response:response});
        }

        // Normalize
        response.tId = tId;
        if(!response.results) {
            response.results = [];
        }
        if(!response.meta) {
            response.meta = {};
        }

        // Send the response back to the callback
        Base.issueCallback(callback, [request, response, (callback && callback.argument)], response.error);
    }

});
    
    DS.Base = Base;
    



}, '@VERSION@' ,{requires:['base']});

YUI.add('datasource-local', function(Y) {

/**
 * The DataSource utility provides a common configurable interface for widgets to
 * access a variety of data, from JavaScript arrays to online database servers.
 *
 * @module datasource-local
 * @requires datasource-base
 * @title DataSource Local Submodule
 */
    var LANG = Y.Lang,
    
    /**
     * Local subclass for the YUI DataSource utility.
     * @class DataSource.Local
     * @extends DataSource.Base
     * @constructor
     */    
    Local = function() {
        Local.superclass.constructor.apply(this, arguments);
    };
    

    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource.Local static properties
    //
    /////////////////////////////////////////////////////////////////////////////
Y.mix(Local, {    
    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static     
     * @final
     * @value "DataSource.Local"
     */
    NAME: "DataSource.Local",


    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource.Local Attributes
    //
    /////////////////////////////////////////////////////////////////////////////

    ATTRS: {
    }
});
    
Y.extend(Local, Y.DataSource.Base, {
});
  
    Y.DataSource.Local = Local;
    



}, '@VERSION@' ,{requires:['datasource-base']});

YUI.add('datasource-xhr', function(Y) {

/**
 * The DataSource utility provides a common configurable interface for widgets to
 * access a variety of data, from JavaScript arrays to online database servers.
 *
 * @module datasource-xhr
 * @requires datasource-base
 * @title DataSource XHR Submodule
 */
    var LANG = Y.Lang,
    
    /**
     * XHR subclass for the YUI DataSource utility.
     * @class DataSource.XHR
     * @extends DataSource.Base
     * @constructor
     */    
    XHR = function() {
        XHR.superclass.constructor.apply(this, arguments);
    };
    

    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource.XHR static properties
    //
    /////////////////////////////////////////////////////////////////////////////
Y.mix(XHR, {    
    /**
     * Class name.
     *
     * @property NAME
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
    
Y.extend(XHR, Y.DataSource.Base, {
    /**
     * Overriding <code>request</code> event handler passes query string to IO. Fires
     * <code>response</code> event when response is received.     
     *
     * @method _makeConnection
     * @protected     
     * @param args.tId {Number} Transaction ID.     
     * @param args.request {MIXED} Request.     
     * @param args.callback {Object} Callback object.
     */
    _makeConnection: function(args) {
        var uri = this.get("source"),
            cfg = {
                on: {
                    complete: function (id, response, args) {
                        this.fire("response", Y.mix(args, {response:response}));
                        //{tId:args.tId, request:args.request, callback:args.callback, response:response}
                        //this.handleResponse(args.tId, args.request, args.callback, response);
                    }
                },
                context: this,
                arguments: {
                    tId: args.tId,
                    request: args.request,
                    callback: args.callback
                }
            };
        
        this.get("io")(uri, cfg);
        return args.tId;
    }
});
  
    Y.DataSource.XHR = XHR;
    



}, '@VERSION@' ,{requires:['datasource-base']});

YUI.add('datasource-cache', function(Y) {

/**
 * Extends DataSource.Base with caching functionality.
 *
 * @module datasource-cache
 * @requires datasource-base,cache
 * @title DataSource Cache Extension
 */
    var LANG = Y.Lang,
        BASE = Y.DataSource.Base,
    
    /**
     * Adds cacheability to the YUI DataSource utility.
     * @class Cacheable
     */    
    Cacheable = function() {};

Cacheable.ATTRS = {
    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource.Base Attributes
    //
    /////////////////////////////////////////////////////////////////////////////

    /**
     * Instance of Y.Cache. Caching is useful to reduce the number of server
     * connections.  Recommended only for data sources that return comprehensive
     * results for queries or when stale data is not an issue.
     *
     * @attribute cache
     * @type Y.Cache
     * @default null
     */
    cache: {
        value: null,
        validator: function(value) {
            return ((value instanceof Y.Cache) || (value === null));
        },
        set: function(value) {
            var i=0,
                handlers = this._cacheHandlers;
            
            // Enabling...
            if(value !== null) {
                // for the first time
                if(handlers === null) {
                    handlers = [];
                    handlers.push(Y.before(this._beforeSendRequest, this, "sendRequest"));
                    handlers.push(Y.before(this._beforeReturnData, this, "returnData"));
                    this._cacheHandlers = handlers;
                }
            }
            // Disabling
            else if(handlers !== null){
                for(;i<handlers; i++) {
                    Y.detach(handlers[i]);
                }
                this._cacheHandlers = null;
            }
            
            //TODO: Handle the destroy() case
        }
    }
};
    
Cacheable.prototype = {
    /**
     * Internal reference to AOP subscriptions, for detaching.
     *
     * @property _cacheHandlers
     * @private
     * @type Array
     */
    _cacheHandlers: null,
    
    /**
     * First look for cached response, then send request to live data.
     *
     * @method _beforeSendRequest
     * @protected
     * @param request {MIXED} Request.
     * @param callback {Object} Callback object.
     */
    _beforeSendRequest: function(request, callback) {
        // Is response already in the Cache?
        var entry = (this.get("cache") && this.get("cache").retrieve(request, callback)) || null;
        if(entry && entry.response) {
            BASE.issueCallback(callback,[request,entry.response]);
            return new Y.Do.Halt("msg", "newRetVal");
        }
    },
    
    /**
     * Adds data to cache before returning data.
     *
     * @method _beforeReturnData
     * @protected
     * @param tId {Number} Transaction ID.
     * @param request {MIXED} Request.
     * @param callback {Object} Callback object.
     * @param response {MIXED} Raw data response.
     */
     _beforeReturnData: function(tId, request, callback, response) {
        // Add to Cache before returning
        if(this.get("cache")) {
            this.get("cache").add(request, response, (callback && callback.argument));
        }
     }
};
    
Y.Base.build(BASE, [Cacheable], {
    dynamic: false
});



}, '@VERSION@' ,{requires:['datasource-base']});

YUI.add('datasource-dataparser', function(Y) {

/**
 * Extends DataSource.Base with schema-based parsing functionality.
 *
 * @module datasource-dataparser
 * @requires datasource-base,dataparser-base
 * @title DataSource DataParser Extension
 */
    var LANG = Y.Lang,
        BASE = Y.DataSource.Base,
    
    /**
     * Adds parsability to the YUI DataSource utility.
     * @class Parsable
     */    
    Parsable = function() {};

Parsable.ATTRS = {
    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource.Base Attributes
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
     * Overriding <code>response</code> event handler parses raw data response before sending
     * to returnData().
     *
     * @method _handleResponse
     * @protected
     * @param args.tId {Number} Transaction ID.
     * @param args.request {MIXED} Request.
     * @param args.callback {Object} Callback object.
     * @param args.response {MIXED} Raw data response.
     */
    _handleResponse: function(args) {
        var response = args.response;

        response = (this.get("parser") && this.get("parser").parse(response)) || {results: response};

        this.returnData(args.tId, args.request, args.callback, response);
    }
};
    
Y.Base.build(BASE, [Parsable], {
    dynamic: false
});



}, '@VERSION@' ,{requires:['datasource', 'dataparser']});

YUI.add('datasource-polling', function(Y) {

/**
 * Extends DataSource.Base with polling functionality.
 *
 * @module datasource-polling
 * @requires datasource-base
 * @title DataSource Polling Extension
 */
    var LANG = Y.Lang,
        BASE = Y.DataSource.Base,
    
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
    
Y.Base.build(BASE, [Pollable], {
    dynamic: false
});



}, '@VERSION@' ,{requires:['datasource-base']});



YUI.add('datasource', function(Y){}, '@VERSION@' ,{use:['datasource-base','datasource-local','datasource-xhr','datasource-cache', 'datasource-dataparser', 'datasource-polling']});

