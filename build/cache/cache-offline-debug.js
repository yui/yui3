YUI.add('cache-offline', function(Y) {

/**
 * Extends Cache utility with offline functionality.
 * @class CacheOffline
 * @extends Cache
 * @constructor
 */
function CacheOffline() {
    CacheOffline.superclass.constructor.apply(this, arguments);
}

    /////////////////////////////////////////////////////////////////////////////
    //
    // CacheOffline static properties
    //
    /////////////////////////////////////////////////////////////////////////////
Y.mix(CacheOffline, {
    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static
     * @final
     * @value "cacheOffline"
     */
    NAME: "cacheOffline",

    ATTRS: {
        /////////////////////////////////////////////////////////////////////////////
        //
        // CacheOffline Attributes
        //
        /////////////////////////////////////////////////////////////////////////////

        /**
        * @attribute expires
        * @description Absolute Date when data expires or
        * relative number of milliseconds. Zero disables expiration.
        * @type Date | Number
        * @default 0
        */
        expires: {
            value: 86400000, //one day
            validator: function(v) {
                return Y.Lang.isNumber(v) && v >= 0;
            }
        },

        /**
        * @attribute max
        * @description Disabled.
        * @readonly
        * @default null
        */
        max: {
            value: null,
            readonly: true,
            setter: function() {
                return null;
            }
        },

        /**
        * @attribute uniqueKeys
        * @description Always true for CacheOffline.
        * @readonly
        * @default true
        */
        uniqueKeys: {
            value: true,
            readonly: true,
            setter: function() {
                return true;
            }
        }
    }
});


var localStorage = Y.config.win.localStorage,
    isDate = Y.Lang.isDate,
    JSON = Y.JSON,
    cacheOfflinePrototype =  localStorage ? {
    /////////////////////////////////////////////////////////////////////////////
    //
    // CacheOffline protected methods
    //
    /////////////////////////////////////////////////////////////////////////////

    /**
     * Sets max.
     *
     * @method _setMax
     * @protected
     */
    //_setMax: function(value) {
        //return null;
    //},
    
    /**
     * Gets size.
     *
     * @method _getSize
     * @protected
     */
    _getSize: function() {
        return localStorage.length;
    },

    /**
     * Gets all entries.
     *
     * @method _getEntries
     * @protected
     */
    _getEntries: function() {
        var entries = this._entries,
            i=0,
            l=this._getSize();
        if(entries) { // Could be null if instance was destroyed
            for(; i<l; ++i) {
                entries[i] = JSON.parse(localStorage.key(i));
            }
        }
        return entries;
    },


    /**
     * Adds entry to cache.
     *
     * @method _defAddFn
     * @param e {Event.Facade} Event Facade with the following properties:
     * <dl>
     * <dt>entry (Object)</dt> <dd>The cached entry.</dd>
     * </dl>
     * @protected
     */
    _defAddFn: function(e) {
        var entry = e.entry,
            request = entry.request,
            expires = this.get("expires");
            
        entry.expires = isDate(expires) ? expires :
            (expires ? new Date().getTime() + expires : null);

        localStorage.setItem(JSON.stringify({"request":request}), JSON.stringify(entry));
        Y.log("Cached offline entry: " + Y.dump(entry), "info", "cache");
    },

    /**
     * Flushes cache.
     *
     * @method _defFlushFn
     * @param e {Event.Facade} Event Facade object.
     * @protected
     */
    _defFlushFn: function(e) {
        var store = localStorage, key;
        if(store) {
            if(store.clear) {
                store.clear();
            }
            // FF2.x and FF3.0.x
            else {
                for (key in store) {
                    if (store.hasOwnProperty(key)) {
                        store.removeItem(key);
                        delete store[key];
                    }
                }
            }
        }
        Y.log("OfflineCache flushed", "info", "cache");
    },

    /**
     * Adds a new entry to the cache of the format
     * {request:request, response:response, expires: expires}.
     *
     * @method add
     * @param request {Object} Request value must be a String or JSON.
     * @param response {Object} Response value must be a String or JSON.
     */

    /**
     * Retrieves cached object for given request, if available.
     * Returns null if there is no cache match.
     *
     * @method retrieve
     * @param request {Object} Request object.
     * @return {Object} Cached object with the properties request, response,
     * and expires, or null.
     */
    retrieve: function(request) {
        this.fire("request", {request: request});

        var entry, expires;

        try {
            request = JSON.stringify({"request":request});
            try {
                entry = JSON.parse(localStorage.getItem(request));
            }
            catch(e) {
            }
        }
        catch(e2) {
        }
        
        if(entry) {
            expires = entry.expires;
            if(!expires || new Date() < expires) {
                this.fire("retrieve", {entry: entry});
                Y.log("Retrieved offlinecached response: " + Y.dump(entry) +
                        " for request: " + Y.dump(request), "info", "cache");
                return entry;
            }
        }
        return null;
    }
} : {
    /**
     * Adds entry to cache with an expires property.
     *
     * @method _defAddFn
     * @param e {Event.Facade} Event Facade with the following properties:
     * <dl>
     * <dt>entry (Object)</dt> <dd>The cached entry.</dd>
     * </dl>
     * @protected
     */
    _defAddFn: function(e) {
        var expires = this.get("expires");
        e.entry.expires = isDate(expires) ? expires :
            (expires ? new Date().getTime() + this.get("expires") : null);
        Y.log("Added expires property: " + Y.dump(e.entry), "info", "cache");
        
        CacheOffline.superclass._defAddFn.call(this, e);
    },

    /**
     * Overrides the default method to check for expired entry.
     * Returns true if current request matches the cached request, otherwise
     * false. Implementers should override this method to customize the
     * cache-matching algorithm.
     *
     * @method _isMatch
     * @param request {Object} Request object.
     * @param entry {Object} Cached entry.
     * @return {Boolean} True if current request matches given cached request
     * and entry has not expired, false otherwise.
     * @protected
     */
    _isMatch: function(request, entry) {
        if(!entry.expires || new Date() < entry.expires) {
            return (request === entry.request);
        }
        return false;
    }
};

Y.extend(CacheOffline, Y.Cache, cacheOfflinePrototype);


Y.CacheOffline = CacheOffline;



}, '@VERSION@' ,{requires:['cache-base', 'json']});
