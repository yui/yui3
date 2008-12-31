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
    Cacheable = function() {
        this._initCacheable();
    };

Cacheable.ATTRS = {    
    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource.Base Attributes
    //
    /////////////////////////////////////////////////////////////////////////////

    /**
     * Max size of the local cache.  Set to 0 to turn off caching.  Caching is
     * useful to reduce the number of server connections.  Recommended only for data
     * sources that return comprehensive results for queries or when stale data is
     * not an issue.
     *
     * @attribute maxCacheEntries
     * @type Number
     * @default 0
     */
    maxCacheEntries: {
        value: 0,
        set: function(value) {
            return this._cache.set("size", value).get("size");
        }
    }
};
    
Cacheable.prototype = {
    /**
     * Internal pointer to Cache instance.
     *
     * @attribute _cache
     * @type YAHOO.util.Cache
     * @private
     */
    _cache: null, 
    
    /**
    * @method initializer
    * @description Initializes cache.
    * @private        
    */
    _initCacheable: function() {
        this._cache = new Y.Cache();
        this.subscribe("requestEvent", this._onRequestEvent, this);
        Y.log("DataSource Cache initialized", "info", this.toString());
    },

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
    _onRequestEvent: function(e) {
        // First look in cache
        var cachedresponse = this._cache.retrieve(e.request, e.callback);
        if(cachedresponse && cachedresponse.entry) {
            e.preventDefault();
            Y.DataSource.issueCallback(e.callback,[e.request,cachedresponse.entry],false);
            //return false;
        }  

        // Not in cache, so forward request to live data
        Y.log("Making connection to live data for \"" + e.request + "\"", "info", this.toString());
        return true;
    },
    
    /**
     * Overwrites DataSource's returnData method to first cache then return data
     *
     */
    returnData: function(callback, params, error) {
        this._cache.cache(params[0], params[1]);
        Y.DataSource.issueCallback(callback, params, error);
   }
};
    
Y.Base.build(BASE, [Cacheable], {
    dynamic: false
});



}, '@VERSION@' ,{requires:['datasource-base']});
