YUI.add('datasource-local', function(Y) {

/**
 * The DataSource utility provides a common configurable interface for widgets to
 * access a variety of data, from JavaScript arrays to online database servers.
 *
 * @module datasource
 */
var LANG = Y.Lang,
    
/**
 * Base class for the YUI DataSource utility.
 * @class DataSource.Local
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
     * @property NAME
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
    }
});
    
Y.extend(DSLocal, Y.Base, {
    /**
    * Internal init() handler.
    *
    * @method initializer
    * @param config {Object} Config object.
    * @private        
    */
    initializer: function(config) {
        this._initTransactionSchema();
    },

    /**
    * This method creates all the events for this module.
    * @method _initTransactionSchema
    * @private        
    */
    _initTransactionSchema: function() {
        this._transactionSchema = {
            host : this,

            events : {
                /**
                 * Fired when a data request is received before the request is
                 * dispatched.  The event object is decorated with the
                 * following properties:
                 * <dl>
                 *  <dt>request</dt> <dd>The request</dd>
                 *  <dt>transaction</dt>
                 *      <dd>The Transaction object managing the lifecycle of
                 *      the request/response</dd>
                 * </dl>
                 *
                 * @event start
                 * @param e {Event.Facade} Event Facade.         
                 * @preventable _defStartFn
                 */
                start : "_defStartFn",

                /**
                 * Fired when a data request is received.  The event object is
                 * decorated with the following properties:
                 * <dl>
                 *  <dt>request</dt> <dd>The request</dd>
                 *  <dt>transaction</dt>
                 *      <dd>The Transaction object managing the lifecycle of
                 *      the request/response</dd>
                 * </dl>
                 *
                 * @event request
                 * @param e {Event.Facade} Event Facade.         
                 * @preventable _defequestFn
                 */
                request  : "_defRequestFn",

                /**
                 * Fired when a response is received.
                 *
                 * The event object is decorated with the following properties:
                 * <dl>
                 *  <dt>request</dt> <dd>The request</dd>
                 *  <dt>data (Object)</dt> <dd>Raw data</dd>
                 *  <dt>transaction</dt>
                 *      <dd>The Transaction object managing the lifecycle of
                 *      the request/response</dd>
                 *  <dt>response (Object)</dt>
                 *     <dd>Undefined for <code>on</code> subscribers.
                 *     For <code>after</code> subscribers, contains the
                 *     normalized response object with these properties:
                 *     <dl>
                 *         <dt>results (Object)</dt> <dd>Parsed results.</dd>
                 *         <dt>meta (Object)</dt> <dd>Parsed meta data.</dd>
                 *         <dt>error (Boolean)</dt> <dd>Error flag.</dd>
                 *     </dl>
                 *  </dd>
                 * </dl>
                 *
                 * @event success
                 * @param e {Event.Facade} Event Facade
                 * @preventable _defResponseFn
                 *
                 */
                response : "_defResponseFn",

                /**
                 * Fired when a request/response transaction is successful.
                 * The event object is decorated with the following properties:
                 * <dl>
                 *  <dt>request</dt> <dd>The request</dd>
                 *  <dt>data (Object)</dt> <dd>Raw data</dd>
                 *  <dt>transaction</dt>
                 *      <dd>The Transaction object managing the lifecycle of
                 *      the request/response</dd>
                 *  <dt>response (Object)</dt>
                 *     <dd>The normalized response object with these properties:
                 *     <dl>
                 *         <dt>results (Object)</dt> <dd>Parsed results.</dd>
                 *         <dt>meta (Object)</dt> <dd>Parsed meta data.</dd>
                 *         <dt>error (Boolean)</dt> <dd>Error flag.</dd>
                 *     </dl>
                 *  </dd>
                 * </dl>
                 *
                 * @event success
                 * @param e {Event.Facade} Event Facade
                 * @preventable _defResponseFn
                 *
                 */
                success : "_defSuccessFn",

                /**
                 * Fired when a request/response transaction is not successful.
                 * The event object is decorated with the following properties:
                 * <dl>
                 *  <dt>request</dt> <dd>The request</dd>
                 *  <dt>data (Object)</dt> <dd>Raw data</dd>
                 *  <dt>transaction</dt>
                 *      <dd>The Transaction object managing the lifecycle of
                 *      the request/response</dd>
                 *  <dt>response (Object)</dt>
                 *     <dd><code>undefined</code> for <code>subscribers</code>.
                 *     For <code>after</code> subscribers, this holds the
                 *     normalized response object with the following properties:
                 *     <dl>
                 *         <dt>results (Object)</dt> <dd>Parsed results.</dd>
                 *         <dt>meta (Object)</dt> <dd>Parsed meta data.</dd>
                 *         <dt>error (Boolean)</dt> <dd>Error flag.</dd>
                 *     </dl>
                 *  </dd>
                 * </dl>
                 *
                 * @event success
                 * @param e {Event.Facade} Event Facade
                 * @preventable _defResponseFn
                 *
                 */
                failure : "_defFailureFn",

                /**
                 * Fired when an error is encountered. The event object is
                 * decorated with the following properties:
                 *
                 * <dl>
                 *  <dt>request</dt> <dd>The request</dd>
                 *  <dt>data (Object)</dt> <dd>Raw data</dd>
                 *  <dt>transaction</dt>
                 *      <dd>The Transaction object managing the lifecycle of
                 *      the request/response</dd>
                 *  <dt>response (Object)</dt>
                 *     <dd><code>undefined</code> for <code>subscribers</code>.
                 *     For <code>after</code> subscribers, this holds the
                 *     normalized response object with the following
                 *     properties:
                 *     <dl>
                 *         <dt>results (Object)</dt> <dd>Parsed results.</dd>
                 *         <dt>meta (Object)</dt> <dd>Parsed meta data.</dd>
                 *         <dt>error (Boolean)</dt> <dd>Error flag.</dd>
                 *     </dl>
                 *  </dd>
                 * </dl>
                 *
                 * @event error
                 * @param e {Event.Facade} Event Facade
                 * @preventable _defErrorFn
                 */
                error : "_defErrorFn",

                /**
                 * Fired upon completion of the request/response life cycle.
                 * 
                 * The event object is decorated with the following properties:
                 * <dl>
                 *  <dt>request</dt> <dd>The request</dd>
                 *  <dt>data (Object)</dt> <dd>Raw data</dd>
                 *  <dt>transaction</dt>
                 *      <dd>The Transaction object managing the lifecycle of
                 *      the request/response</dd>
                 *  <dt>response (Object)</dt>
                 *     <dd>The normalized response object with these properties:
                 *     <dl>
                 *         <dt>results (Object)</dt> <dd>Parsed results.</dd>
                 *         <dt>meta (Object)</dt> <dd>Parsed meta data.</dd>
                 *         <dt>error (Boolean)</dt> <dd>Error flag.</dd>
                 *     </dl>
                 *  </dd>
                 * </dl>
                 *
                 * @event end
                 * @param e {Event.Facade} Event Facade
                 * @preventable _defEndFn
                 */
                end : "_defEndFn"
            }
        };
    },

    /**
     * Initiates the transaction logic, firing the <code>request</code> event.
     * Implementers or plugins looking to circumvent the usual transaction
     * workflow can override this method.  Subscribers to this event can stop
     * the request before it starts by calling <code>e.preventDefault()</code>.
     *
     * The event object is decorated with the following properties:
     * <dl>
     *  <dt>request</dt> <dd>The request</dd>
     *  <dt>transaction</dt>
     *      <dd>The Transaction object managing the lifecycle of
     *      the request/response</dd>
     * </dl>
     *
     * @method _defStartFn
     * @param e {Event.Facade} the event object
     * @protected
     */
    _defStartFn : function (e) {
        e.transaction.fire('request',e);
    },

    /**
     * Manages request/response transaction. Must fire <code>response</code>
     * event when response is received. This method should be implemented by
     * subclasses to achieve more complex behavior such as accessing remote
     * data.
     *
     * The event object is decorated with the following properties:
     * <dl>
     *  <dt>request</dt> <dd>The request</dd>
     *  <dt>transaction</dt>
     *      <dd>The Transaction object managing the lifecycle of
     *      the request/response</dd>
     * </dl>
     *
     * @method _defRequestFn
     * @param e {Event.Facade} the event object
     * @protected
     */
    _defRequestFn: function(e) {
        var data = this.get("source");
        
        // Problematic data
        if(LANG.isUndefined(data)) {
            e.error = new Error(this.toString() + " Source undefined");
        }
        if (e.error) {
            e.transaction.fire("error", e);
        } else {
            e.data = data;

            e.transaction.fire("response", e);
        }
    },

    /**
     * Normalizes raw data into a response that includes results and meta
     * properties.
     *
     * The event object is decorated with the following properties:
     * <dl>
     *  <dt>request</dt> <dd>The request</dd>
     *  <dt>transaction</dt>
     *      <dd>The Transaction object managing the lifecycle of
     *      the request/response</dd>
     *  <dt>data</dt> <dd>The raw data response</dd>
     *  <dt>response</dt>
     *     <dd><code>undefined</code> for <code>on</code> subscribers.  For
     *         <code>after</code> subscribers, holds the normalized response
     *         object with these properties:
     *         <dl>
     *             <dt>results (Object)</dt> <dd>Parsed results.</dd>
     *             <dt>meta (Object)</dt> <dd>Parsed meta data.</dd>
     *             <dt>error (Boolean)</dt> <dd>Error flag.</dd>
     *         </dl>
     *     </dd>
     * </dl>
     *
     * @method _defResponseFn
     * @param e {Event.Facade} the event object
     * @protected
     */
    _defResponseFn: function(e) {
        e.response = {
            results : Y.Array(this.get('source')),
            meta : e.meta || {}
        };


        e.transaction.fire("success", e);
    },

    /**
     * Reports successful request/response transactions.
     *
     * The event object will be decorated with the following properties:
     * <dl>
     *  <dt>request</dt> <dd>The request</dd>
     *  <dt>data (Object)</dt> <dd>Raw data</dd>
     *  <dt>transaction</dt>
     *      <dd>The Transaction object managing the lifecycle of
     *      the request/response</dd>
     *  <dt>response (Object)</dt>
     *     <dd><code>undefined</code> for <code>subscribers</code>.  For
     *     <code>after</code> subscribers, this holds the normalized
     *     response object with the following properties:
     *     <dl>
     *         <dt>results (Object)</dt> <dd>Parsed results.</dd>
     *         <dt>meta (Object)</dt> <dd>Parsed meta data.</dd>
     *         <dt>error (Boolean)</dt> <dd>Error flag.</dd>
     *     </dl>
     *  </dd>
     * </dl>
     *
     * @method _defSuccessFn
     * @param e {Event.Facade} the event object
     * @protected
     */
    _defSuccessFn : function (e) {
        e.transaction.fire("end",e);
    },

    /**
     * Reports unsuccessful request/response transactions.
     *
     * The event object will be decorated with the following properties:
     * <dl>
     *  <dt>request</dt> <dd>The request</dd>
     *  <dt>data (Object)</dt> <dd>Raw data</dd>
     *  <dt>transaction</dt>
     *      <dd>The Transaction object managing the lifecycle of
     *      the request/response</dd>
     *  <dt>response (Object)</dt>
     *     <dd><code>undefined</code> for <code>subscribers</code>.  For
     *     <code>after</code> subscribers, this holds the normalized
     *     response object with the following properties:
     *     <dl>
     *         <dt>results (Object)</dt> <dd>Parsed results.</dd>
     *         <dt>meta (Object)</dt> <dd>Parsed meta data.</dd>
     *         <dt>error (Boolean)</dt> <dd>Error flag.</dd>
     *     </dl>
     *  </dd>
     * </dl>
     *
     * @method _defFailureFn
     * @param e {Event.Facade} the event object
     * @protected
     */
    _defFailureFn : function (e) {
        e.transaction.fire("end",e);
    },

    /**
     * Reports errors in the request/response.  Subclasses should override this
     * if there is specific error handling logic required.
     *
     * The event object may be decorated with the following properties
     * depending on the point of failure:
     * <dl>
     *  <dt>request</dt> <dd>The request</dd>
     *  <dt>data (Object)</dt> <dd>Raw data</dd>
     *  <dt>transaction</dt>
     *      <dd>The Transaction object managing the lifecycle of
     *      the request/response</dd>
     *  <dt>response (Object)</dt>
     *     <dd><code>undefined</code> for <code>subscribers</code>.  For
     *     <code>after</code> subscribers, this holds the normalized
     *     response object with the following properties:
     *     <dl>
     *         <dt>results (Object)</dt> <dd>Parsed results.</dd>
     *         <dt>meta (Object)</dt> <dd>Parsed meta data.</dd>
     *         <dt>error (Boolean)</dt> <dd>Error flag.</dd>
     *     </dl>
     *  </dd>
     * </dl>
     *
     * @method _defErrorFn
     * @param e {Event.Facade} the event object
     * @protected
     */
    _defErrorFn : function (e) {
        if (e.error) {
            e.transaction.fire("end",e);
        }
    },

    _defEndFn : function (e) {
    },

    /**
     * Initiates a unique Y.Transaction for the supplied request.
     *
     * Callers may subscribe to the transaction events by passing a callback object in the following form:
     * <pre><code>{
     *    on : { eventName : function, ... },
     *    after : { eventName : fn, ... }
     * }</code></pre>
     *
     * Available transaction events are:
     * <dl>
     *   <dt>start</dt><dd>Signals the initiation of a request transaction</dd>
     *   <dt>request</dt><dd>Triggers the request</dd>
     *   <dt>response</dt><dd>Processes the data response</dd>
     *   <dt>success</dt><dd>Fired for successful transactions</dd>
     *   <dt>failure</dt><dd>Fired if a failure condition is encountered</dd>
     *   <dt>error</dt><dd>Fired if there is an unexpected error</dd>
     * </dl>
     *
     * @method sendRequest
     * @param request {Object} Request
     * @param callback {Object} event subscriber map
     * @param payload {Object} Additional information to be carried through the
     * transaction
     * @return {Transaction} Transaction instance
     */
    sendRequest: function(request, callback, payload) {
        var t = new Y.Transaction(this._transactionSchema, callback),
            info = { request : request };

        Y.mix(info, payload);


        return t.start(info);
    }
});
    
Y.namespace("DataSource").Local = DSLocal;


}, '@VERSION@' ,{requires:['base','transaction']});
