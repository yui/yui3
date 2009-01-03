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
