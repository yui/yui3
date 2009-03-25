/**
 * Extends DataSource with caching functionality.
 *
 * @module datasource-cache
 * @requires datasource-base,cache
 * @title DataSource Cache Extension
 */
    var LANG = Y.Lang,
        BASE = Y.DataSource,
    
    /**
     * Adds cacheability to the YUI DataSource utility.
     * @class Cacheable
     */    
    Cacheable = function() {};

Cacheable.ATTRS = {
    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource Attributes
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
            this.on("request", this._beforeRequest);
            this.on("response", this._beforeResponse);

            //TODO: Cleanup for destroy()?
        }
    }
};
    
Cacheable.prototype = {
    /**
     * First look for cached response, then send request to live data.
     *
     * @method _beforeRequest
     * @param e {Event.Facade} Event Facade.
     * @param o {Object} Object with the following properties:
     * <dl>
     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
     * <dt>request (Object)</dt> <dd>The request.</dd>
     * <dt>callback (Object)</dt> <dd>The callback object.</dd>
     * </dl>
     * @protected
     */
    _beforeRequest: function(e, o) {
        // Is response already in the Cache?
        var entry = (this.get("cache") && this.get("cache").retrieve(o.request, o.callback)) || null;
        if(entry && entry.response) {
            e.stopImmediatePropagation();
            this.fire("response", null, Y.mix(o, entry.response));
            //BASE.issueCallback(entry.response);
            //return new Y.Do.Halt("msg", "newRetVal");
        }
    },
    
    /**
     * Adds data to cache before returning data.
     *
     * @method _beforeResponse
     * @param e {Event.Facade} Event Facade.
     * @param o {Object} Object with the following properties:
     * <dl>
     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
     * <dt>request (Object)</dt> <dd>The request.</dd>
     * <dt>callback (Object)</dt> <dd>The callback object.</dd>
     * <dt>data (Object)</dt> <dd>Raw data.</dd>
     * <dt>results (Object)</dt> <dd>Parsed results.</dd>
     * <dt>meta (Object)</dt> <dd>Parsed meta data.</dd>
     * </dl>
     * @protected
     */
     _beforeResponse: function(e, o) {
        // Add to Cache before returning
        if(this.get("cache")) {
            this.get("cache").add(o.request, o, (o.callback && o.callback.argument));
        }
     }
};
    
Y.Base.build(BASE, [Cacheable], {
    dynamic: false
});
