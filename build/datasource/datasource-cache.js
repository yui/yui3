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
        this.subscribe("requestEvent", this._onRequestEvent, this);
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
    cache: {
        value: null
    }
};
    
Cacheable.prototype = {
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
        return true;
    }
    
    /**
     * Overwrites DataSource's returnData method to first cache then return data
     *
     */
     //TODO: hook into returndata event to add to cache
    //returnData: function(tId, callback, params, error) {
        //(this.get("cache") ? this.get("cache").cache(params[0], params[1]);)
        //Y.DataSource.issueCallback(callback, params, error);
   //}
};
    
Y.Base.build(BASE, [Cacheable], {
    dynamic: false
});



}, '@VERSION@' ,{requires:['datasource-base']});
