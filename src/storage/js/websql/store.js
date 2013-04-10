/**
A WebSQL based object store

@class WebSQLStore
@constructor
@param {Object} config Object literal specifying configuration properties
@param {String} config.name Name of the object store
@param {Promise} config.db A promise representing the IndexedDB database
**/
function WebSQLStore(config) {
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
Y.mix(WebSQLStore.prototype, {
    /**
    Executes an SQL query.

    @method _executeSql
    @param {String} query Query to execute
    @param {String*} values Values to safely inject into the query
    @param {Function} Formatter function that translates the reqsult of the
                    query into the value expected by the user
    @param {Function} [callback] Node.js-style callback for this operation
    **/
    _executeSql: function (query, values, formatter, callback) {
        var promise = this._db.then(function (db) {
            return new Y.Promise(function (fulfill, reject) {
                db.transaction(function (tx) {
                    // Use the 
                    tx.executeSql(query, values, function (tx, result) {
                        fulfill(formatter(result));
                    }, function (tx, err) {
                        reject(err);
                    });
                });
            });
        });

        if (callback) {
            promise.done(function (result) {
                callback(undefined, result);
            }, callback);
        }
        return promise;
    },
    /**
    Formatterfor the SELECT operation.

    @param {Object} result Result from the operation
    @returns Any Value stored for a certain key
    **/
    _selectFormatter: function (result) {
        // In order to store objects in the database stringify them first
        // (see the put() method) and when retrieving them parse the JSON value
        return Y.JSON.parse(result.rows.item(0).value);
    },
    /**
    Formatter for the UPSERT operation.

    @param {Object} result Result from the operation
    @return {Number} Number of rows that where
    modified during this operation
    **/
    _putFormatter: function (result) {
        return result.rowsAffected;
    },
    /**
    Formatter for the COUNT operation.

    @param {Object} result Result from the operation
    @return {Number} Number of rows counted
    **/
    _countFormatter: function (result) {
        // Since count() uses SELECT COUNT(1) in its query, the result is stored
        // in a matching COUNT(1) property of the first item
        return result.rows.item(0)['COUNT(1)'];
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
        return this._executeSql(
            'SELECT value FROM ' + this.name + ' WHERE key=?',
            [key],
            this._selectFormatter,
            callback
        );
    },
    /**
    Updates the value associated with the provided key. Effectively an UPSERT
    operation.

    @method put
    @param {String} key Key for the value to update
    @param {Any} value Value to store in the database
    @param {Function} [callback] Optional callback receiving an error as first
                        parameter if something went wrong
    **/
    put: function (key, value, callback) {
        this._executeSql(
            'REPLACE INTO ' + this.name + ' (key, value) VALUES (?, ?);',
            [key, Y.JSON.stringify(value)],
            this._putFormatter,
            callback
        );
    },
    /**
    Removes from the database the value associated with the provided key

    @method remove
    @param {String} key Key to remove its value
    @param {Function} [callback] Optional callback receiving an error as first
                        parameter if something went wrong
    **/
    remove: function (key, callback) {
        this._executeSql(
            'DELETE FROM ' + this.name + ' WHERE key=?',
            [key],
            this._putFormatter,
            callback
        );
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
        return this._executeSql(
            'SELECT COUNT(1) FROM ' + this.name,
            [],
            this._countFormatter,
            callback
        );
    },
    /**
    Clears the object store, removing all objects from it

    @method clear
    @param {Function} [callback] Optional callback receiving an error as first
                        parameter if something went wrong
    **/
    clear: function (callback) {
        this._executeSql(
            'DELETE FROM ' + this.name, [], this._putFormatter, callback
        );
    }
});

Y.Storage.Store = WebSQLStore;
