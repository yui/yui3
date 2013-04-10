/**
A fallback to simple JS objects for when the environment lacks a native storage
mechanism.

@class MemoryStorage
@constructor
@param {Object} config Object literal specifying configuration properties
@param {String} config.name Name of the database
@param {Number} config.version Version of the database. *Note: use only integer
                    numbers because some implementations round them up*
@param {String*} config.stores An array with the name of the stores that this
                    database will contain. Do not modify this array without
                    changing the version of the database
@param {Number} [config.size=5242880] Size in bytes of the database. Some
                    implementations handle this automatically, others require
                    you to specify a size. Keep in mind that if you are allowing
                    localSotarge as a storage option then the maximum size will
                    always be 5 MB.
**/
function MemoryStorage(config) {
    /**
    The name of the database

    @property name
    @type String
    **/
    this.name = config.name;
    /**
    The version of the database

    @property version
    @type Number
    **/
    this.version = config.version;
    /**
    The size of the database

    @property size
    @type Number
    **/
    this.size = config.size || 5242880;
    /**
    An array containing the name of all object stores in this database

    @property _stores
    @type String*
    @private
    **/
    this._stores = config.stores;

    this._initStores(config.stores);
}
Y.mix(MemoryStorage.prototype, {
    /**
    Starts initializing the object stores

    @method _initStores
    @private
    @param {Array} stores The names of the stores to initialize
    **/
    _initStores: function (stores) {
        for (var i = 0, count = stores.length; i < count; i++) {
            this[stores[i]] = new MemoryStorage.Store({
                db: this,
                name: stores[i]
            });
        }
    },
    /**
    Closes the database.

    @method close
    **/
    close: function () {
        var i = 0, stores = this._stores, count = stores.length;
        for (; i < count; i++) {
            this[stores[i]]._close();
        }
    }
});

Y.Storage = MemoryStorage;
