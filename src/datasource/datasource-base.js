/**
 * The DataSource utility provides a common configurable interface for widgets to
 * access a variety of data, from JavaScript arrays to online database servers.
 *
 * @module datasource
 * @requires base
 * @title DataSource Utility
 */
    Y.namespace("DataSource");
    
    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource static properties
    //
    /////////////////////////////////////////////////////////////////////////////
    
Y.mix(Y.DataSource, { 
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
     * Type is unknown.
     *
     * @property DataSource.TYPE_UNKNOWN
     * @type Number
     * @static     
     * @final
     * @default -1
     */
    TYPE_UNKNOWN: -1,
    
    /**
     * Type is a JavaScript Array.
     *
     * @property DataSource.TYPE_JSARRAY
     * @type Number
     * @static     
     * @final
     * @default 0
     */
    TYPE_JSARRAY: 0,
    
    /**
     * Type is a JavaScript Function.
     *
     * @property DataSource.TYPE_JSFUNCTION
     * @type Number
     * @static     
     * @final
     * @default 1
     */
    TYPE_JSFUNCTION: 1,
    
    /**
     * Type is hosted on a server via an XHR connection.
     *
     * @property DataSource.TYPE_XHR
     * @type Number
     * @static     
     * @final
     * @default 2
     */
    TYPE_XHR: 2,
    
    /**
     * Type is JSON.
     *
     * @property DataSource.TYPE_JSON
     * @type Number
     * @static     
     * @final
     * @default 3
     */
    TYPE_JSON: 3,
    
    /**
     * Type is XML.
     *
     * @property DataSource.TYPE_XML
     * @type Number
     * @static     
     * @final
     * @default 4
     */
    TYPE_XML: 4,
    
    /**
     * Type is plain text.
     *
     * @property DataSource.TYPE_TEXT
     * @type Number
     * @static     
     * @final
     * @default 5
     */
    TYPE_TEXT: 5,
    
    /**
     * Type is an HTML TABLE element. Data is parsed out of TR elements from all
     * TBODY elements.
     *
     * @property DataSource.TYPE_HTMLTABLE
     * @type Number
     * @static     
     * @final
     * @default 6
     */
    TYPE_HTMLTABLE: 6,
    
    /**
     * Type is hosted on a server via a dynamic script node.
     *
     * @property DataSource.TYPE_SCRIPTNODE
     * @type Number
     * @static     
     * @final
     * @default 7
     */
    TYPE_SCRIPTNODE: 7,
    
    /**
     * Type is local.
     *
     * @property DataSource.TYPE_LOCAL
     * @type Number
     * @static     
     * @final
     * @default 8
     */
    TYPE_LOCAL: 8,

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
    issueCallback: function (callback,params,error) {
        if(callback) {
            var scope = callback.scope || window,
                callbackFunc = (error) ? callback.failure : callback.success;
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
        * @attribute liveData
        * @description Pointer to live database.
        * @type MIXED
        */
        liveData: {
        },
        
        /**
        * @attribute dataType
        * @description Where the live data is held:
            <ul>
                <li>TYPE_UNKNOWN</li>
                <li>TYPE_LOCAL</li>
                <li>TYPE_XHR</li>
                <li>TYPE_SCRIPTNODE</li>
                <li>TYPE_JSFUNCTION</li>
            </ul>
        * @type Number
        * @default DataSource.TYPE_UNKNOWN        
        */
        dataType: {
            value: Y.DataSource.TYPE_UNKNOWN
        },

        /**
        * @attribute responseType
        * @description Format of response:
            <ul>
                <li>TYPE_UNKNOWN</li>
                <li>TYPE_JSARRAY</li>
                <li>TYPE_JSON</li>
                <li>TYPE_XML</li>
                <li>TYPE_TEXT</li>
                <li>TYPE_HTMLTABLE</li>
            </ul>
        * @type Number
        * @default DataSource.TYPE_UNKNOWN
        */
        responseType: {
            value: Y.DataSource.TYPE_UNKNOWN
        },

        /**
        * @attribute responseSchema
        * @description Response schema object literal takes a combination of
        * the following properties:
            <dl>
                <dt>resultsList {String}</dt>
                    <dd>Pointer to array of tabular data</dd>
                <dt>resultNode {String}</dt>
                    <dd>Pointer to node name of row data (XML data only)</dl>
                <dt>recordDelim {String}</dt>
                    <dd>Record delimiter (text data only)</dd>
                <dt>fieldDelim {String}</dt>
                    <dd>Field delimiter (text data only)</dd>
                <dt>fields {String[] | Object []}</dt>
                    <dd>Array of field names (aka keys), or array of object literals such as:
                    {key:"fieldname", parser:Date.parse}</dd>
                <dt>metaFields {Object}</dt>
                    <dd>Hash of field names (aka keys) to include in the 
                    oParsedResponse.meta collection</dd>
                <dt>metaNode {String}</dt>
                    <dd>Name of the node under which to search for meta
                    information in XML response data (XML data only)</dd>
            </dl>
        * @type Object
        * @default {}        
        */
        responseSchema: {
            value: {}
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
    * @method _createEvents
    * @description This method creates all the events for this Event
    * Target and publishes them so we get Event Bubbling.
    * @private        
    */
    _initEvents: function() {
        var events = [
            "dataErrorEvent",
            "requestEvent",
            "responseEvent",
            "responseParseEvent"
        ];
        
        Y.each(events, function(v, k) {
            this.publish(v, {
                type: v,
                emitFacade: true,
                bubbles: true,
                preventable: false,
                queuable: true
            });
        }, this);

        /*if (this.get('bubbles')) {
            this.addTarget(this.get('bubbles'));
        }*/           
    },

    /**
    * @method initializer
    * @description Internal init() handler.
    * @private        
    */
    initializer: function() {
        this._queue = {interval:null, conn:null, requests:[]};
        this._intervals = [];
        Y.log("DataSource initialized", "info", this.toString());
    },

    /**
    * @method destructor
    * @description Internal destroy() handler.
    * @private        
    */
    destructor: function() {
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
    setInterval : function(msec, request, callback) {
        if(LANG.isNumber(msec) && (msec >= 0)) {
            Y.log("Enabling polling to live data for \"" + Y.dump(request) + "\" at interval " + msec, "info", this.toString());
            var self = this,
                id = setInterval(function() {
                self.makeConnection(request, callback);
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
    clearInterval : function(id) {
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
     * First looks for cached response, then sends request to live data.
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
     *     <dd>Arbitrary data that will be passed back to the success and failure handlers.</dd>
     *     </dl> 
     * @return {Number} Transaction ID, or null if response found in cache.
     */
    sendRequest : function(request, callback) {
        // Forward request to live data
        Y.log("Making connection to live data for \"" + request + "\"", "info", this.toString());
        return this.makeConnection(request, callback);
    },

/**
 * Overridable default method generates a unique transaction ID and passes 
 * the live data reference directly to the  handleResponse function. This
 * method should be implemented by subclasses to achieve more complex behavior
 * or to access remote data.          
 *
 * @method makeConnection
 * @param request {MIXED} Request object.
 * @param callback {Object} Callback object literal.
 * @return {Number} Transaction ID.
 */
makeConnection : function(request, callback) {
    var tId = Y.DataSource._tId++;
    this.fire("requestEvent", {tId:tId, request:request,callback:callback});

    /* accounts for the following cases:
    DataSource.TYPE_UNKNOWN
    DataSource.TYPE_JSARRAY
    DataSource.TYPE_JSON
    DataSource.TYPE_HTMLTABLE
    DataSource.TYPE_XML
    DataSource.TYPE_TEXT
    */
    var rawresponse = this.get("liveData");
    
    this.handleResponse(request, rawresponse, callback, tId);
    return tId;
},

/**
 * Receives raw data response and type converts to XML, JSON, etc as necessary.
 * Forwards oFullResponse to appropriate parsing function to get turned into
 * oParsedResponse. Calls doBeforeCallback() and adds oParsedResponse to 
 * the cache when appropriate before calling issueCallback().
 * 
 * The oParsedResponse object literal has the following properties:
 * <dl>
 *     <dd><dt>tId {Number}</dt> Unique transaction ID</dd>
 *     <dd><dt>results {Array}</dt> Array of parsed data results</dd>
 *     <dd><dt>meta {Object}</dt> Object literal of meta values</dd> 
 *     <dd><dt>error {Boolean}</dt> (optional) True if there was an error</dd>
 *     <dd><dt>cached {Boolean}</dt> (optional) True if response was cached</dd>
 * </dl>
 *
 * @method handleResponse
 * @param oRequest {Object} Request object
 * @param oRawResponse {Object} The raw response from the live database.
 * @param oCallback {Object} Callback object literal.
 * @param tId {Number} Transaction ID.
 */
handleResponse : function(oRequest, oRawResponse, oCallback, tId) {
    this.fire("responseEvent", {tId:tId, request:oRequest, response:oRawResponse,
            callback:oCallback});
    Y.log("Received live data response for \"" + oRequest + "\"", "info", this.toString());
    var xhr = (this.dataType == Y.DataSource.TYPE_XHR) ? true : false;
    var oParsedResponse = null;
    var oFullResponse = oRawResponse;
    
    // Try to sniff data type if it has not been defined
    if(this.responseType === Y.DataSource.TYPE_UNKNOWN) {
        var ctype = (oRawResponse && oRawResponse.getResponseHeader) ? oRawResponse.getResponseHeader["Content-Type"] : null;
        if(ctype) {
             // xml
            if(ctype.indexOf("text/xml") > -1) {
                this.responseType = Y.DataSource.TYPE_XML;
            }
            else if(ctype.indexOf("application/json") > -1) { // json
                this.responseType = Y.DataSource.TYPE_JSON;
            }
            else if(ctype.indexOf("text/plain") > -1) { // text
                this.responseType = Y.DataSource.TYPE_TEXT;
            }
        }
        else {
            if(LANG.isArray(oRawResponse)) { // array
                this.responseType = Y.DataSource.TYPE_JSARRAY;
            }
             // xml
            else if(oRawResponse && oRawResponse.nodeType && oRawResponse.nodeType == 9) {
                this.responseType = Y.DataSource.TYPE_XML;
            }
            else if(oRawResponse && oRawResponse.nodeName && (oRawResponse.nodeName.toLowerCase() == "table")) { // table
                this.responseType = Y.DataSource.TYPE_HTMLTABLE;
            }    
            else if(LANG.isObject(oRawResponse)) { // json
                this.responseType = Y.DataSource.TYPE_JSON;
            }
            else if(LANG.isString(oRawResponse)) { // text
                this.responseType = Y.DataSourec.TYPE_TEXT;
            }
        }
    }

    switch(this.responseType) {
        case Y.DataSource.TYPE_JSARRAY:
            if(xhr && oRawResponse && oRawResponse.responseText) {
                oFullResponse = oRawResponse.responseText; 
            }
            try {
                // Convert to JS array if it's a string
                if(LANG.isString(oFullResponse)) {
                    // Check for YUI JSON Util
                    if(LANG.JSON) {
                        oFullResponse = LANG.JSON.parse(oFullResponse);
                    }
                    // Look for JSON parsers using an API similar to json2.js
                    else if(window.JSON && JSON.parse) {
                        oFullResponse = JSON.parse(oFullResponse);
                    }
                    // Look for JSON parsers using an API similar to json.js
                    else if(oFullResponse.parseJSON) {
                        oFullResponse = oFullResponse.parseJSON();
                    }
                    // No JSON lib found so parse the string
                    else {
                        // Trim leading spaces
                        while (oFullResponse.length > 0 &&
                                (oFullResponse.charAt(0) != "{") &&
                                (oFullResponse.charAt(0) != "[")) {
                            oFullResponse = oFullResponse.substring(1, oFullResponse.length);
                        }
    
                        if(oFullResponse.length > 0) {
                            // Strip extraneous stuff at the end
                            var arrayEnd = Math.max(oFullResponse.lastIndexOf("]"),oFullResponse.lastIndexOf("}"));
                            oFullResponse = oFullResponse.substring(0,arrayEnd+1);
    
                            // Turn the string into an object literal...
                            // ...eval is necessary here
                            oFullResponse = eval("(" + oFullResponse + ")");
    
                        }
                    }
                }
            }
            catch(e) {
            }
            oFullResponse = this.doBeforeParseData(oRequest, oFullResponse, oCallback);
            oParsedResponse = this.parseArrayData(oRequest, oFullResponse);
            break;
        case Y.DataSource.TYPE_JSON:
            if(xhr && oRawResponse && oRawResponse.responseText) {
                oFullResponse = oRawResponse.responseText;
            }
            try {
                // Convert to JSON object if it's a string
                if(LANG.isString(oFullResponse)) {
                    // Check for YUI JSON Util
                    if(LANG.JSON) {
                        oFullResponse = LANG.JSON.parse(oFullResponse);
                    }
                    // Look for JSON parsers using an API similar to json2.js
                    else if(window.JSON && JSON.parse) {
                        oFullResponse = JSON.parse(oFullResponse);
                    }
                    // Look for JSON parsers using an API similar to json.js
                    else if(oFullResponse.parseJSON) {
                        oFullResponse = oFullResponse.parseJSON();
                    }
                    // No JSON lib found so parse the string
                    else {
                        // Trim leading spaces
                        while (oFullResponse.length > 0 &&
                                (oFullResponse.charAt(0) != "{") &&
                                (oFullResponse.charAt(0) != "[")) {
                            oFullResponse = oFullResponse.substring(1, oFullResponse.length);
                        }
    
                        if(oFullResponse.length > 0) {
                            // Strip extraneous stuff at the end
                            var objEnd = Math.max(oFullResponse.lastIndexOf("]"),oFullResponse.lastIndexOf("}"));
                            oFullResponse = oFullResponse.substring(0,objEnd+1);
    
                            // Turn the string into an object literal...
                            // ...eval is necessary here
                            oFullResponse = eval("(" + oFullResponse + ")");
    
                        }
                    }
                }
            }
            catch(e) {
            }

            oFullResponse = this.doBeforeParseData(oRequest, oFullResponse, oCallback);
            oParsedResponse = this.parseJSONData(oRequest, oFullResponse);
            break;
        case Y.DataSource.TYPE_HTMLTABLE:
            if(xhr && oRawResponse.responseText) {
                oFullResponse = oRawResponse.responseText;
            }
            oFullResponse = this.doBeforeParseData(oRequest, oFullResponse, oCallback);
            oParsedResponse = this.parseHTMLTableData(oRequest, oFullResponse);
            break;
        case Y.DataSource.TYPE_XML:
            if(xhr && oRawResponse.responseXML) {
                oFullResponse = oRawResponse.responseXML;
            }
            oFullResponse = this.doBeforeParseData(oRequest, oFullResponse, oCallback);
            oParsedResponse = this.parseXMLData(oRequest, oFullResponse);
            break;
        case Y.DataSource.TYPE_TEXT:
            if(xhr && LANG.isString(oRawResponse.responseText)) {
                oFullResponse = oRawResponse.responseText;
            }
            oFullResponse = this.doBeforeParseData(oRequest, oFullResponse, oCallback);
            oParsedResponse = this.parseTextData(oRequest, oFullResponse);
            break;
        default:
            oFullResponse = this.doBeforeParseData(oRequest, oFullResponse, oCallback);
            oParsedResponse = this.parseData(oRequest, oFullResponse);
            break;
    }


    // Clean up for consistent signature
    oParsedResponse = oParsedResponse || {};
    if(!oParsedResponse.results) {
        oParsedResponse.results = [];
    }
    if(!oParsedResponse.meta) {
        oParsedResponse.meta = {};
    }

    // Success
    if(oParsedResponse && !oParsedResponse.error) {
        // Last chance to touch the raw response or the parsed response
        oParsedResponse = this.doBeforeCallback(oRequest, oFullResponse, oParsedResponse, oCallback);
        this.fire("responseParseEvent", {request:oRequest,
                response:oParsedResponse, callback:oCallback});
        // Cache the response
        //TODO: REINSTATE
        //this.addToCache(oRequest, oParsedResponse);
    }
    // Error
    else {
        // Be sure the error flag is on
        oParsedResponse.error = true;
        this.fire("dataErrorEvent", {request:oRequest, response: oRawResponse, callback:oCallback, 
                message:this.get("ERROR_DATANULL")});
        Y.log(this.get("ERROR_DATANULL"), "error", this.toString());
    }

    // Send the response back to the callback
    oParsedResponse.tId = tId;
    Y.DataSource.issueCallback(oCallback,[oRequest,oParsedResponse],oParsedResponse.error);
},

/**
 * Overridable method gives implementers access to the original full response
 * before the data gets parsed. Implementers should take care not to return an
 * unparsable or otherwise invalid response.
 *
 * @method doBeforeParseData
 * @param oRequest {Object} Request object.
 * @param oFullResponse {Object} The full response from the live database.
 * @param oCallback {Object} The callback object.  
 * @return {Object} Full response for parsing.
  
 */
doBeforeParseData : function(oRequest, oFullResponse, oCallback) {
    return oFullResponse;
},

/**
 * Overridable method gives implementers access to the original full response and
 * the parsed response (parsed against the given schema) before the data
 * is added to the cache (if applicable) and then sent back to callback function.
 * This is your chance to access the raw response and/or populate the parsed
 * response with any custom data.
 *
 * @method doBeforeCallback
 * @param oRequest {Object} Request object.
 * @param oFullResponse {Object} The full response from the live database.
 * @param oParsedResponse {Object} The parsed response to return to calling object.
 * @param oCallback {Object} The callback object. 
 * @return {Object} Parsed response object.
 */
doBeforeCallback : function(oRequest, oFullResponse, oParsedResponse, oCallback) {
    return oParsedResponse;
},

/**
 * Overridable method parses data of generic RESPONSE_TYPE into a response object.
 *
 * @method parseData
 * @param oRequest {Object} Request object.
 * @param oFullResponse {Object} The full Array from the live database.
 * @return {Object} Parsed response object with the following properties:<br>
 *     - results {Array} Array of parsed data results<br>
 *     - meta {Object} Object literal of meta values<br>
 *     - error {Boolean} (optional) True if there was an error<br>
 */
parseData : function(oRequest, oFullResponse) {
    if(LANG.isValue(oFullResponse)) {
        var oParsedResponse = {results:oFullResponse,meta:{}};
        Y.log("Parsed generic data is " +
                Y.dump(oParsedResponse), "info", this.toString());
        return oParsedResponse;

    }
    Y.log("Generic data could not be parsed: " + Y.dump(oFullResponse), 
            "error", this.toString());
    return null;
}


    });
    
    Y.DataSource.Base = Base;
    
