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
    maxCacheEntries : {
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
    },

    /**
     * Overwrites DataSource's sendRequest method to first look for cached
     * response, then send request to live data.
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
    sendRequest: function(request, callback) {
        // First look in cache
        var cachedresponse = this._cache.retrieve(request, callback);
        if(cachedresponse) {
            Y.DataSource.issueCallback(callback,[request,cachedresponse],false);
            return cachedresponse.payload.id;
        }  

        // Not in cache, so forward request to live data
        return this.makeConnection(request, callback);
    }
};
    
Y.Base.build(BASE, [Cacheable], {
    dynamic: false
});



}, '@VERSION@' ,{requires:['datasource-base']});
