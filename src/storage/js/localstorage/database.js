var localStorage = Y.config.win.localStorage;

/**
localStorage based storage.

@class LocalStorage
@constructor
@param {Object} config Object literal specifying configuration properties
@param {String} config.name Name of the database
@param {Number} config.version Version of the database. *Note: use only integer
                    numbers because some implementations round them up*
@param {String*} config.stores An array with the name of the stores that this
                    database will contain. Do not modify this array without
                    changing the version of the database.
**/
function LocalStorage(config) {
    var self = this;
    /**
    Name of the database. Read-only.

    @property name
    @type String
    **/
    this.name = config.name;
    /**
    Version of the database

    @property version
    @type Number
    **/
    this.version = config.version;
    /**
    An array containing the name of all object stores in this database

    @property _stores
    @type String*
    @private
    **/
    this._stores = config.stores;

    this._db = new Y.Promise(function () {
        self._open.apply(self, arguments);
    });
    this._db.name = 'yui_' + this.name;

    this._initStores(config.stores);
}
Y.mix(LocalStorage.prototype, {
    _open: function (fulfill) {
        var i = 0, stores = this._stores, count = stores.length,
            storeName;
        for (; i < count; i++) {
            storeName = 'yui_' + this.name + '_' + stores[i];
            if (!localStorage.getItem(storeName)) {
                localStorage.setItem(storeName, '{}');
            }
        }
        fulfill();
    },
    /**
    Starts initializing the object stores

    @method _initStores
    @private
    @param {Array} stores The names of the stores to initialize
    **/
    _initStores: function (stores) {
        for (var i = 0, length = stores.length; i < length; i++) {
            this[stores[i]] = new LocalStorage.Store({
                db: this._db,
                name: stores[i]
            });
        }
    },
    /**
    Closes the database. Subsequent operations will fail.

    @method close
    **/
    close: function () {
        var i = 0, stores = this._stores, count = stores.length;
        for (; i < count; i++) {
            this[stores[i]]._close();
        }
    }
});

Y.Storage = LocalStorage;
