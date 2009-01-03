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
     * @class Cachable
     * @constructor
     */    
    Cacheable = {};

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
                    handlers.push(Y.before(this.beforeSendRequest, this, "sendRequest"));
                    handlers.push(Y.before(this.beforeReturnData, this, "returnData"));
                }
            }
            // Disabling
            else if(handlers !== null){
                for(;i<handlers; i++) {
                    Y.detach(handlers[i]);
                }
                handlers = null;
            }
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
     * @method _onRequestEvent
     * @private
     * @param e {Event.Facade} Custom Event Facade for requestEvent.
     * @param e.tId {Number} Transaction ID.
     * @param e.request {MIXED} Request.
     * @param e.callback {Object} Callback object.
     */
    beforeSendRequest: function(e) {
        // First look in cache
        var cachedresponse = (this.get("cache")) ? this.get("cache").retrieve(e.request, e.callback): null;
        if(cachedresponse && cachedresponse.entry) {
            e.preventDefault();
            Y.DataSource.issueCallback(e.callback,[e.request,cachedresponse.entry],false);
            return new Y.Do.Halt("msg", "newRetVal");
        }

        // Not in cache, so forward request to live data
        Y.log("Making connection to live data for \"" + e.request + "\"", "info", this.toString());
    },
    
    /**
     * Adds data to cache before returning data.
     *
     * @method _onBeforeReturnData
     * @private
     * @param e {Event.Facade} Custom Event Facade for requestEvent.
     * @param e.tId {Number} Transaction ID.
     * @param e.request {MIXED} Request.
     * @param e.callback {Object} Callback object.
     */
     beforeReturnData: function(tId, callback, params, error) {
        // Add to cache before returning
        if(this.get("cache")) {
            this.get("cache").add(params[0], params[1], params[2]);
        }
     }

    /**
     * First look for cached response, then send request to live data.
     *
     * @method sendRequest
     * @private
     * @param e {Event.Facade} Custom Event Facade for requestEvent.     
     * @param e.tId {Number} Transaction ID.     
     * @param e.request {MIXED} Request.     
     * @param e.callback {Object} Callback object.
     */
    /*sendRequest: function(request, callback) {
        // First look in cache
        var cachedresponse = (this.get("cache")) ? this.get("cache").retrieve(request, callback): null;
        if(cachedresponse && cachedresponse.entry) {
            Y.DataSource.issueCallback(callback,[request,cachedresponse.entry]);
        }
        // Not in cache, so forward request to live data
        else {
            return Cacheable.prototype.sendRequest.apply(this, arguments);
        }
    },*/
    
    /**
     * Adds data to cache before returning data.
     *
     * @method _onBeforeReturnData
     * @private
     * @param e {Event.Facade} Custom Event Facade for requestEvent.
     * @param e.tId {Number} Transaction ID.
     * @param e.request {MIXED} Request.
     * @param e.callback {Object} Callback object.
     */
     /*returnData: function(tId, callback, params, error) {
        // Add to cache before returning
        if(this.get("cache")) {
            this.get("cache").add(params[0], params[1], params[2]);
        }
        
        Cacheable.prototype.returnData.apply(this, arguments);
     }*/
};
    
Y.Base.build(BASE, [Cacheable], {
    dynamic: false
});



}, '@VERSION@' ,{requires:['datasource-base']});
