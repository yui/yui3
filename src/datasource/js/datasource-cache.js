/**
 * Extends DataSource with caching functionality.
 *
 * @module datasource
 */

/**
 * Adds cacheability to the YUI DataSource utility.
 * @class DataSourceCache
 * @extends Cache
 */    
var DataSourceCache = function() {
    DataSourceCache.superclass.constructor.apply(this, arguments);
};

Y.mix(DataSourceCache, {
    /**
     * The namespace for the plugin. This will be the property on the host which
     * references the plugin instance.
     *
     * @property NS
     * @type String
     * @static
     * @final
     * @value "cache"
     */
    NS: "cache",

    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static
     * @final
     * @value "DataSourceCache"
     */
    NAME: "DataSourceCache",

    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSourceCache Attributes
    //
    /////////////////////////////////////////////////////////////////////////////

    ATTRS: {

    }
});

Y.extend(DataSourceCache, Y.Cache, {
    /**
    * @method initializer
    * @description Internal init() handler.
    * @private
    */
    initializer: function(config) {
        this.doBefore("_defRequestFn", this._beforeDefRequestFn);
        this.doBefore("_defResponseFn", this._beforeDefResponseFn);
    },

    /**
     * First look for cached response, then send request to live data.
     *
     * @method _beforeDefRequestFn
     * @param e {Event.Facade} Event Facade.
     * @param o {Object} Object with the following properties:
     * <dl>
     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
     * <dt>request (Object)</dt> <dd>The request.</dd>
     * <dt>callback (Object)</dt> <dd>The callback object.</dd>
     * </dl>
     * @protected
     */
    _beforeDefRequestFn: function(e, o) {
        // Is response already in the Cache?
        var entry = (this.retrieve(o.request)) || null;
        if(entry && entry.response) {
            this._owner.fire("response", null, Y.mix(o, entry.response));
            return new Y.Do.Halt("DataSourceCache plugin halted _defRequestFn");
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
     _beforeDefResponseFn: function(e, o) {
        // Add to Cache before returning
        this.add(o.request, o, (o.callback && o.callback.argument));
     }
});

Y.namespace('plugin');
Y.plugin.DataSourceCache = DataSourceCache;
