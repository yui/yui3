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
    ERROR_DATAINVALID: 1,

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
        * @attribute dataType
        * @description Where the live data is held:
            <ul>
                <li>"LOCAL" (in-memory data, such as an Array or object literal)</li>
                <li>"XHR" (remote data accessed via Connection Manager)</li>
                <li>"SCRIPTNODE" (remote data accessed via the Get Utility)</li>
                <li>"FUNCTION" (data accessed via a pre-defined JavaScript function)</li>
            </ul>
        * @type String
        * @default null
        */
        dataType: {
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
    * @property _intervals
    * @description Array of polling interval IDs that have been enabled,
    * stored here to be able to clear all intervals.
    * @private        
    */
    _intervals: null,

    /**
    * @method initializer
    * @description Internal init() handler.
    * @private        
    */
    initializer: function() {
        this._queue = {interval:null, conn:null, requests:[]};
        this._intervals = [];
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
    * @description This method creates all the events for this Event
    * Target and publishes them so we get Event Bubbling.
    * @private        
    */
    _initEvents: function() {
        /**
         * Fired when an error is encountered.
         *
         * @event errorEvent
         * @param args {Object} Object literal data payload.         
         * @param args.request {MIXED} The request.
         * @param args.response {Object} The response object.
         * @param args.callback {Object} The callback object.
         */
         
        /**
         * Fired when a request is sent to the live data source.
         *
         * @event requestEvent
         * @param e {Event.Facade} Event Facade.         
         * @param e.tId {Number} Unique transaction ID.             
         * @param e.request {MIXED} The request.
         * @param e.callback {Object} The callback object.
         */
        this.publish("requestEvent", {
            //emitFacade: false,
            defaultFn: this._makeConnection
        });
         
        /**
         * Fired when a response is received from the live data source.
         *
         * @event responseEvent
         * @param e {Event.Facade} Event Facade.         
         * @param e.tId {Number} Unique transaction ID.             
         * @param e.request {MIXED} The request.
         * @param e.callback {Object} The callback object.
         * @param e.response {Object} The raw response data.         
         */
        this.publish("responseEvent", {
            //emitFacade: false,
            defaultFn: this._handleResponse
        });
    },

    /**
     * Overridable default requestEvent handler manages request/response
     * transaction. Must fire responseEvent when response is received. This
     * method should be implemented by subclasses to achieve more complex
     * behavior such as accessing remote data.
     *
     * @method _makeConnection
     * @protected
     * @param e {Event.Facade} Custom Event Facade for requestEvent.
     * @param e.tId {Number} Transaction ID.
     * @param e.request {MIXED} Request.
     * @param e.callback {Object} Callback object.
     */
    _makeConnection: function(e) {
        this.fire("responseEvent", Y.mix(e.details[0], {response:this.get("source")}));
        Y.log("Transaction " + e.tId + " complete. Request: " +
                Y.dump(e.request) + " . Response: " + Y.dump(e.response), "info", this.toString());
    },

    /**
     * Overridable default responseEvent handler receives raw data response and
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
     * Generates a unique transaction ID and fires requestEvent.
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
        this.fire("requestEvent", {tId:tId, request:request,callback:callback});
        Y.log("Transaction " + tId + " sent request: " + Y.dump(request), "info", this.toString());
        return tId;
    },

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
            Y.log("Enabling polling to live data for \"" + Y.dump(request) + "\" at interval " + msec, "info", this.toString());
            var self = this,
                id = setInterval(function() {
                self._makeConnection(request, callback);
            }, msec);
            this._intervals.push(id);
            return id;
        }
        else {
            Y.log("Could not enable polling to live data for \"" + Y.dump(request) + "\" at interval " + msec, "info", this.toString());
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
            this.fire("errorEvent", {tId:tId, request:request, callback:callback, response:response});
            Y.log("Error in response", "error", this.toString());
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
        DS.issueCallback(callback, [request, response, (callback && callback.argument)], response.error);
    }

});
    
    DS.Base = Base;
    
