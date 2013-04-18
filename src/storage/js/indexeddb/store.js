/**
An IndexedDB based object store

@class IndexedDBStore
@constructor
@param {Object} config Object literal specifying configuration properties
@param {String} config.name Name of the object store
@param {Promise} config.db A promise representing the IndexedDB database
**/
function IndexedDBStore(config) {
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
}
Y.mix(IndexedDBStore.prototype, {
    /**
    Requests an object store and passes it to a function. The value returned
    by this function must be the result of the operation over the object store.
    
    @method _transaction
    @param {Function} action Action to perform on the object store
    @param {Boolean} [readwrite=false] Whether this action requires read-write
                        privileges
    @return {Promise} A promise representing the result of the operation
                        performed by the provided `action` function
    **/
    _transaction: function (action, write) {
        var name = this.name,
            self = this;

        return new Y.Promise(function (resolve, reject) {
            self._db.then(function (db) {
                // The most straightforward design would be to return a promise
                // representing the object store and call then() on it to return
                // the desired value.
                // This cannot be done this way because IndexedDB expects the
                // action to be called during the same "tick" of the event loop
                // in which the transaction is requested
                var request = action(
                      db.transaction([name], write ? READ_WRITE : READ_ONLY)
                        .objectStore(name)
                    );

                request.onsuccess = function () {
                    // The result can be accessed both from the event facade
                    // received in the onsuccess event or as a property of the
                    // request object
                    resolve(request.result);
                };
                request.onerror = reject;
            });
        });
    },
    /**
    Gets the value associated with the provided key

    @method get
    @param {String} key Key for which to get a certain value
    @return {Promise} Promise representing the value retrieved from the
                        database
    **/
    get: function (key) {
        return this._transaction(function (store) {
            return store.get(key);
        });
    },
    /**
    Updates the value associated with the provided key

    @method put
    @param {String} key Key for the value to update
    @param {Any} value Value to store in the database
    **/
    put: function (key, value) {
        return this._transaction(function (store) {
            return store.put(value, key);
        }, true);
    },
    /**
    Removes from the database the value associated with the provided key

    @method remove
    @param {String} key Key to remove its value
    **/
    remove: function (key) {
        return this._transaction(function (store) {
            return store['delete'](key);
        }, true);
    },
    /**
    Gets the number of objects stored in this store

    @method count
    @return {Promise} Promise representing the value number of object in the
                        store
    **/
    count: function (callback) {
        return this._transaction(function (store) {
            return store.count();
        });
    },
    /**
    Clears the object store, removing all objects from it

    @method clear
    **/
    clear: function () {
        return this._transaction(function (store) {
            return store.clear();
        }, true);
    }
});

Y.Storage.Store = IndexedDBStore;
