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
    var DS = Y.DataSource,
        LANG = Y.Lang,
    
    /**
     * Base class for the YUI DataSource utility.
     * @class DataSource.Base
     * @extends Base
     * @constructor
     */    
    DSBase = function() {
        DSBase.superclass.constructor.apply(this, arguments);
    };
    
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
    
    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource.Base static properties
    //
    /////////////////////////////////////////////////////////////////////////////
Y.mix(DSBase, {    
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
    // DataSource.Base Attributes
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
     * @param callback {Object} The callback object.
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
    
Y.extend(DSBase, Y.Base, {
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
         * Fired when a request is sent to the live data source.
         *
         * @event request
         * @param e {Event.Facade} Event Facade.         
         * @param o {Object} Object with the following properties:
         * <dl>                          
         * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
         * <dt>request (Object)</dt> <dd>The request.</dd>
         * <dt>callback (Object)</dt> <dd>The callback object.</dd>
         * </dl>                 
         */
        this.publish("request", {defaultFn: this._defRequestHandler});
         
        /**
         * Fired when a response is received from the live data source.
         *
         * @event response
         * @param e {Event.Facade} Event Facade.
         * @param o {Object} Object with the following properties:
         * <dl>                          
         * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
         * <dt>request (Object)</dt> <dd>The request.</dd>
         * <dt>callback (Object)</dt> <dd>The callback object.</dd>
         * <dt>response (Object)</dt> <dd>The raw response data.</dd>
         * </dl>                 
         */
        this.publish("response", {defaultFn: this._defResponseHandler});

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
         * <dt>response (Object)</dt> <dd>The raw response data.</dd>
         * <dt>error (Object)</dt> <dd>Error data.</dd>
         * </dl>
         */

    },

    /**
     * Overridable default <code>request</code> event handler manages request/response
     * transaction. Must fire <code>response</code> event when response is received. This
     * method should be implemented by subclasses to achieve more complex
     * behavior such as accessing remote data.
     *
     * @method _defRequestHandler
     * @protected
     * @param e {Event.Facade} Event Facade.         
     * @param o {Object} Object with the following properties:
     * <dl>                          
     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
     * <dt>request (Object)</dt> <dd>The request.</dd>
     * <dt>callback (Object)</dt> <dd>The callback object.</dd>
     * </dl>                 
     */
    _defRequestHandler: function(e, o) {
        this.fire("response", null, Y.mix(o, {response:this.get("source")}));
        Y.log("Transaction " + e.tId + " complete. Request: " +
                Y.dump(o.request) + " . Response: " + Y.dump(o.response), "info", this.toString());
    },

    /**
     * Overridable default <code>response</code> event handler receives raw data response and
     * by default, passes it as-is to returnData.
     *
     * @method _defResponseHandler
     * @protected
     * @param e {Event.Facade} Event Facade.
     * @param o {Object} Object with the following properties:
     * <dl>                          
     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
     * <dt>request (Object)</dt> <dd>The request.</dd>
     * <dt>callback (Object)</dt> <dd>The callback object.</dd>
     * <dt>response (Object)</dt> <dd>The raw response data.</dd>
     * </dl>                 
     */
    _defResponseHandler: function(e, o) {
        this.returnData(o.tId, o.request, o.callback, {results: o.response});

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
        var tId = DS._tId++;
        this.fire("request", null, {tId:tId, request:request,callback:callback});
        Y.log("Transaction " + tId + " sent request: " + Y.dump(request), "info", this.toString());
        return tId;
    },

    /**
     * Overridable method returns data to callback.
     *
     * @method returnData
     * @param tId {Number} Transaction ID.
     * @param request {Object} Request.
     * @param callback {Object} Callback object.
     * @param response {Object} Raw data response.
     */
    returnData: function(tId, request, callback, response) {
        // Problematic response
        if(!response || LANG.isUndefined(response.results)) {
            response = {error:true};
        }
        // Handle any error
        if(response.error) {
            this.fire("error", null, {tId:tId, request:request, response:response, callback:callback, error:response.error});
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
        DSBase.issueCallback(callback, [request, response, (callback && callback.argument)], response.error);
    }

});
    
    DS.Base = DSBase;
    



}, '@VERSION@' ,{requires:['base']});
