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
    If provided, adds a Node.js-style callback to a promise

    @method _addCallback
    @param {Promise} promise The promise to add the callback to
    @param {Function} [callback] Callback to add to the promise
    @private
    @return {Promise}
    **/
    _addCallback: function (promise, callback) {
        if (callback) {
            promise.done(function (value) {
                callback(undefined, value);
            }, callback);
        }
        return promise;
    },
    /**
    Requests an object store and passes it to a function. The value returned
    by this function must be the result of the operation over the object store.
    
    @method _transaction
    @param {Function} action Action to perform on the object store
    @param {Boolean} [readwrite=false] Whether this action requires read-write
                        privileges
    @param {Function} [callback] Optional Node.js-style callback
    @return {Promise} A promise representing the result of the operation
                        performed by the provided `action` function
    **/
    _transaction: function (action, write, callback) {
        var name = this.name,
            promise = this._db.then(function (db) {
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

                return new Y.Promise(function (resolve, reject) {
                    request.onsuccess = function () {
                        // The result can be accessed both from the event facade
                        // received in the onsuccess event or as a property of the
                        // request object
                        resolve(request.result);
                    };
                    request.onerror = reject;
                });
            });

        return this._addCallback(promise, callback);
    },
    /**
    Gets the value associated with the provided key

    @method get
    @param {String} key Key for which to get a certain value
    @param {Function} [callback] Optional callback receiving an error as first
                        parameter if something went wrong, and the result as
                        second parameter if everything went well
    @return {Promise} Promise representing the value retrieved from the
                        database
    **/
    get: function (key, callback) {
        return this._transaction(function (store) {
            return store.get(key);
        }, false, callback);
    },
    /**
    Updates the value associated with the provided key

    @method put
    @param {String} key Key for the value to update
    @param {Any} value Value to store in the database
    @param {Function} [callback] Optional callback receiving an error as first
                        parameter if something went wrong
    **/
    put: function (key, value, callback) {
        this._transaction(function (store) {
            return store.put(value, key);
        }, true, callback);
    },
    /**
    Removes from the database the value associated with the provided key

    @method remove
    @param {String} key Key to remove its value
    @param {Function} [callback] Optional callback receiving an error as first
                        parameter if something went wrong
    **/
    remove: function (key, callback) {
        this._transaction(function (store) {
            return store['delete'](key);
        }, true, callback);
    },
    /**
    Gets the number of objects stored in this store

    @method count
    @param {Function} [callback] Optional callback receiving an error as first
                        parameter if something went wrong, and the result as
                        second parameter if everything went well
    @return {Promise} Promise representing the value number of object in the
                        store
    **/
    count: function (callback) {
        return this._transaction(function (store) {
            return store.count();
        }, false, callback);
    },
    /**
    Clears the object store, removing all objects from it

    @method clear
    @param {Function} [callback] Optional callback receiving an error as first
                        parameter if something went wrong
    **/
    clear: function (callback) {
        this._transaction(function (store) {
            return store.clear();
        }, true, callback);
    }
});

Y.Storage.Store = IndexedDBStore;
