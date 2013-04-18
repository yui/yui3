function LocalStore(config) {
    /**
    Name of the object store

    @property name
    @type String
    **/
    this.name = config.name;
    /**
    Promise representing the IndexedDB database

    @property _db
    @type Promise
    @private
    **/
    this._db = config.db;

    this._storeName = this._db.name + '_' + this.name;
}
Y.mix(LocalStore.prototype, {
    _transaction: function (action, callback) {
        var key = this._storeName;

        return this._db.then(function () {
            return action(Y.JSON.parse(localStorage.getItem(key)));
        });
    },
    get: function (key) {
        return this._transaction(function (store) {
            return store[key];
        });
    },
    put: function (key, value) {
        var storeName = this._storeName;
        return this._transaction(function (store) {
            store[key] = value;
            localStorage.setItem(storeName, Y.JSON.stringify(store));
        });
    },
    remove: function (key) {
        var storeName = this._storeName;
        return this._transaction(function (store) {
            delete store[key];
            localStorage.setItem(storeName, Y.JSON.stringify(store));
        });
    },
    _countKeys: function (obj) {
        var count = 0,
            prop;

        for (prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                count++;
            }
        }

        return count;
    },
    count: function () {
        var self = this;
        return this._transaction(function (store) {
            return self._countKeys(store);
        });
    },
    clear: function () {
        var storeName = this._storeName;
        return this._transaction(function () {
            localStorage.setItem(storeName, '{}');
        });
    },
    _close: function () {
        this._db = new Y.Promise(function (resolve, reject) {
            reject(new Error('Database closed'));
        });
    }
});

Y.Storage.Store = LocalStore;
