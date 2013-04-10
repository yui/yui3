var win        = Y.config.win,
    indexedDB  = win.indexedDB || win.webkitIndexedDB || win.mozIndexedDB ||
                 win.oIndexedDB || win.msIndexedDB,
    READ_ONLY  = IDBTransaction.READ_ONLY || "readonly",
    READ_WRITE = IDBTransaction.READ_WRITE || "readwrite";

/**
IndexedDB based storage.

@class IndexedDBStorage
@constructor
@param {Object} config Object literal specifying configuration properties
@param {String} config.name Name of the database
@param {Number} config.version Version of the database. *Note: use only integer
                    numbers because some implementations round them up*
@param {String*} config.stores An array with the name of the stores that this
                    database will contain. Do not modify this array without
                    changing the version of the database.
**/
function IndexedDBStorage(config) {
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
    
    /**
    A promise representing the database instance

    @property _db
    @private
    @type Promise
    **/
    this._db = new Y.Promise(function () {
        self._open.apply(self, arguments);
    });
    this._initStores(config.stores);
}
Y.mix(IndexedDBStorage.prototype, {
    /**
    Initializes the object stores during the `upgradeneeded` event

    @method _onUpgradeNeeded
    @param {Object} e Event facade for the upgradeneeded event
    @private
    **/
    _onUpgradeNeeded: function (e) {
        var db = e.target.result,
                stores = this._stores,
                i = 0, count = stores.length;
        
        for (; i < count; i++) {
            if (!db.objectStoreNames.contains(stores[i])) {
                db.createObjectStore(stores[i]);
            }
        }
    },
    /**
    Initialization function for the `_db` promise. Fulfills or rejects the
    promise based on the result of opening the database.

    @method _open
    @param {Function} fulfill Fulfill callback
    @param {Function} reject Reject callback
    @private
    **/
    _open: function (fulfill, reject) {
        var request = indexedDB.open(this.name, this.version),
            self = this;
        
        request.onupgradeneeded = function () {
            self._onUpgradeNeeded.apply(self, arguments);
        };
        request.onsuccess = function (e) {
            fulfill(e.target.result);
        };
        request.onerror = function (e) {
            reject(e);
        };
    },
    /**
    Starts initializing the object stores

    @method _initStores
    @private
    @param {Array} stores The names of the stores to initialize
    **/
    _initStores: function (stores) {
        for (var i = 0, length = stores.length; i < length; i++) {
            this[stores[i]] = new IndexedDBStorage.Store({
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
        this._db.then(function (db) {
            db.close();
        });
    }
});

Y.Storage = IndexedDBStorage;