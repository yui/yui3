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
        var key = this._storeName,
            promise = this._db.then(function () {
                return action(Y.JSON.parse(localStorage.getItem(key)));
            });

        if (callback) {
            promise.done(function (value) {
                callback(undefined, value);
            }, callback);
        }
        return promise;
    },
    get: function (key, callback) {
        return this._transaction(function (store) {
            return store[key];
        }, callback);
    },
    put: function (key, value, callback) {
        var storeName = this._storeName;
        this._transaction(function (store) {
            store[key] = value;
            localStorage.setItem(storeName, Y.JSON.stringify(store));
        }, callback);
    },
    remove: function (key, callback) {
        var storeName = this._storeName;
        this._transaction(function (store) {
            delete store[key];
            localStorage.setItem(storeName, Y.JSON.stringify(store));
        }, callback);
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
    count: function (callback) {
        var self = this;
        return this._transaction(function (store) {
            return self._countKeys(store);
        }, callback);
    },
    clear: function (callback) {
        var storeName = this._storeName;
        this._transaction(function () {
            localStorage.setItem(storeName, '{}');
        }, callback);
    },
    _close: function () {
        this._db = new Y.Promise(function () {
            throw new Error('Database closed');
        });
    }
});

Y.Storage.Store = LocalStore;
