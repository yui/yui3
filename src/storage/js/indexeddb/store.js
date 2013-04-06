var READ_ONLY  = IDBTransaction.READ_ONLY || "readonly",
    READ_WRITE = IDBTransaction.READ_WRITE || "readwrite",
    Lang       = Y.Lang;

function Store(config) {
    this.name = config.name;
    this.db = config.db;
}
Y.mix(Store.prototype, {
    _transaction: function (fn, write) {
        var name = this.name;
        return this.db.then(function (db) {
            var request = fn(db.transaction([name],
                            write ? READ_WRITE : READ_ONLY).objectStore(name));
            return new Y.Promise(function (resolve, reject) {
                request.onsuccess = function (e) {
                    resolve(request.result);
                };
                request.onerror = reject;
            });
        });
    },
    _transactionRW: function (fn) {
        return this._transaction(fn, true);
    },
    _addCallback: function (transaction, fn) {
        if (fn) {
            transaction.done(function (value) {
                fn(undefined, value);
            }, fn);
        }
        return transaction;
    },
    get: function (index, fn) {
        return this._addCallback(this._transaction(function (store) {
            return store.get(index);
        }), fn);
    },
    put: function (index, value, fn) {
        this._addCallback(this._transactionRW(function (store) {
            return store.put(value, index);
        }), fn);
    },
    remove: function (index, fn) {
        this._addCallback(this._transactionRW(function (store) {
            return store['delete'](index);
        }), fn);
    },
    count: function (key, fn) {
        return this._addCallback(this._transaction(function (store) {
            return store.count(key);
        }), fn);
    },
    clear: function (fn) {
        this._addCallback(this._transactionRW(function (store) {
            return store.clear();
        }));
    }
});

Y.Storage.Store = Store;
