var win = Y.config.win,
        indexedDB = win.indexedDB || win.webkitIndexedDB || win.mozIndexedDB || win.oIndexedDB || win.msIndexedDB;

function IndexedDBStorage(config) {
    config = config || {};
    
    this.name = config.name;
    this.version = config.version;
    this._stores = config.stores;
    
    this._db = new Y.Promise(Y.bind(this._open, this));
    this._initStores(config.stores);
}
Y.mix(IndexedDBStorage.prototype, {
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
    _initStores: function (stores) {
        for (var i = 0, length = stores.length; i < length; i++) {
            this[stores[i]] = new IndexedDBStorage.Store({
                db: this._db,
                name: stores[i]
            });
        }
    },
    _open: function (resolve, reject) {
        var request = indexedDB.open(this.name, this.version);
        
        request.onupgradeneeded = Y.bind(this._onUpgradeNeeded, this);
        request.onsuccess = function (e) {
            resolve(e.target.result);
        };
        request.onerror = function (e) {
            reject(e);
        };
    },
    close: function () {
        this._db.then(function (db) {
            db.close();
        });
    }
});

Y.Storage = IndexedDBStorage;