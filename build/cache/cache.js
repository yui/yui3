YUI.add('cache-base', function(Y) {

/**
 * The Cache utility provides a common configurable interface for components to
 * cache and retrieve data from a local JavaScript struct.
 *
 * @module cache
 */
var LANG = Y.Lang,

/**
 * Base class for the YUI Cache utility.
 * @class Cache
 * @extends Base
 * @constructor
 */
Cache = function() {
    Cache.superclass.constructor.apply(this, arguments);
};

    /////////////////////////////////////////////////////////////////////////////
    //
    // Cache static properties
    //
    /////////////////////////////////////////////////////////////////////////////
Y.mix(Cache, {
    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static
     * @final
     * @value "cache"
     */
    NAME: "cache",


    ATTRS: {
        /////////////////////////////////////////////////////////////////////////////
        //
        // Cache Attributes
        //
        /////////////////////////////////////////////////////////////////////////////

        /**
        * @attribute max
        * @description Maximum number of entries the Cache can hold.
        * Set to 0 to turn off caching.
        * @type Number
        * @default 0
        */
        max: {
            value: 0,
            setter: "_setMax"
        },

        /**
        * @attribute size
        * @description Number of entries currently cached.
        * @type Number
        */
        size: {
            readOnly: true,
            getter: "_getSize"
        },

        /**
        * @attribute uniqueKeys
        * @description Validate uniqueness of stored keys. Default is false and
        * is more performant.
        * @type Boolean
        */
        uniqueKeys: {
            value: false,
            validator: function(value) {
                return (LANG.isBoolean(value));
            }
        },

        /**
         * @attribute entries
         * @description Cached entries.
         * @type Array
         */
        entries: {
            readOnly: true,
            getter: "_getEntries"
        }
    }
});

Y.extend(Cache, Y.Base, {
    /////////////////////////////////////////////////////////////////////////////
    //
    // Cache private properties
    //
    /////////////////////////////////////////////////////////////////////////////

    /**
     * Array of request/response objects indexed chronologically.
     *
     * @property _entries
     * @type Object[]
     * @private
     */
    _entries: null,

    /////////////////////////////////////////////////////////////////////////////
    //
    // Cache private methods
    //
    /////////////////////////////////////////////////////////////////////////////

    /**
    * @method initializer
    * @description Internal init() handler.
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config) {

        /**
        * @event add
        * @description Fired when an entry is added.
        * @param e {Event.Facade} Event Facade with the following properties:
         * <dl>
         * <dt>entry (Object)</dt> <dd>The cached entry.</dd>
         * </dl>
        * @preventable _defAddFn
        */
        this.publish("add", {defaultFn: this._defAddFn});

        /**
        * @event flush
        * @description Fired when the cache is flushed.
        * @param e {Event.Facade} Event Facade object.
        * @preventable _defFlushFn
        */
        this.publish("flush", {defaultFn: this._defFlushFn});

        /**
        * @event request
        * @description Fired when an entry is requested from the cache.
        * @param e {Event.Facade} Event Facade with the following properties:
        * <dl>
        * <dt>request (Object)</dt> <dd>The request object.</dd>
        * </dl>
        */

        /**
        * @event retrieve
        * @description Fired when an entry is retrieved from the cache.
        * @param e {Event.Facade} Event Facade with the following properties:
        * <dl>
        * <dt>entry (Object)</dt> <dd>The retrieved entry.</dd>
        * </dl>
        */

        // Initialize internal values
        this._entries = [];
    },

    /**
    * @method destructor
    * @description Internal destroy() handler.
    * @private
    */
    destructor: function() {
        this._entries = null;
    },

    /////////////////////////////////////////////////////////////////////////////
    //
    // Cache protected methods
    //
    /////////////////////////////////////////////////////////////////////////////

    /**
     * Sets max.
     *
     * @method _setMax
     * @protected
     */
    _setMax: function(value) {
        // If the cache is full, make room by removing stalest element (index=0)
        var entries = this._entries;
        if(value > 0) {
            if(entries) {
                while(entries.length > value) {
                    entries.shift();
                }
            }
        }
        else {
            value = 0;
            this._entries = [];
        }
        return value;
    },

    /**
     * Gets size.
     *
     * @method _getSize
     * @protected
     */
    _getSize: function() {
        return this._entries.length;
    },

    /**
     * Gets all entries.
     *
     * @method _getEntries
     * @protected
     */
    _getEntries: function() {
        return this._entries;
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
        var entries = this._entries,
            max = this.get("max"),
            entry = e.entry;

        if(this.get("uniqueKeys") && (this.retrieve(e.entry.request))) {
            entries.shift();
        }


        // If the cache at or over capacity, make room by removing stalest element (index=0)
        while(max && entries.length>=max) {
            entries.shift();
        }

        // Add entry to cache in the newest position, at the end of the array
        entries[entries.length] = entry;
    },

    /**
     * Flushes cache.
     *
     * @method _defFlushFn
     * @param e {Event.Facade} Event Facade object.
     * @protected
     */
    _defFlushFn: function(e) {
        this._entries = [];
    },

    /**
     * Default overridable method compares current request with given cache entry.
     * Returns true if current request matches the cached request, otherwise
     * false. Implementers should override this method to customize the
     * cache-matching algorithm.
     *
     * @method _isMatch
     * @param request {Object} Request object.
     * @param entry {Object} Cached entry.
     * @return {Boolean} True if current request matches given cached request, false otherwise.
     * @protected
     */
    _isMatch: function(request, entry) {
        return (request === entry.request);
    },

    /////////////////////////////////////////////////////////////////////////////
    //
    // Cache public methods
    //
    /////////////////////////////////////////////////////////////////////////////

    /**
     * Adds a new entry to the cache of the format
     * {request:request, response:response}.
     * If cache is full, evicts the stalest entry before adding the new one.
     *
     * @method add
     * @param request {Object} Request value.
     * @param response {Object} Response value.
     */
    add: function(request, response) {
        if(this.get("entries") && ((this.get("max") === null) || this.get("max") > 0) &&
                (LANG.isValue(request) || LANG.isNull(request) || LANG.isUndefined(request))) {
            this.fire("add", {entry: {request:request, response:response}});
        }
        else {
        }
    },

    /**
     * Flushes cache.
     *
     * @method flush
     */
    flush: function() {
        this.fire("flush");
    },

    /**
     * Retrieves cached object for given request, if available, and refreshes
     * entry in the cache. Returns null if there is no cache match.
     *
     * @method retrieve
     * @param request {Object} Request object.
     * @return {Object} Cached object with the properties request and response, or null.
     */
    retrieve: function(request) {
        // If cache is enabled...
        var entries = this._entries,
            length = entries.length,
            entry = null,
            i = length-1;

        if((length > 0) && ((this.get("max") === null) || (this.get("max") > 0))) {
            this.fire("request", {request: request});

            // Loop through each cached entry starting from the newest
            for(; i >= 0; i--) {
                entry = entries[i];

                // Execute matching function
                if(this._isMatch(request, entry)) {
                    this.fire("retrieve", {entry: entry});

                    // Refresh the position of the cache hit
                    if(i < length-1) {
                        // Remove element from its original location
                        entries.splice(i,1);
                        // Add as newest
                        entries[entries.length] = entry;
                    }

                    return entry;
                }
            }
        }
        return null;
    }
});

Y.Cache = Cache;



}, '@VERSION@' ,{requires:['base']});

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



YUI.add('cache', function(Y){}, '@VERSION@' ,{use:['cache-base','cache-offline']});

