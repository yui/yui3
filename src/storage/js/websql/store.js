function WebSQLStore(config) {
    this._db = config.db;
    this.name = config.name;

    var db = this._db,
        name = this.name;

    this._table = new Y.Promise(function (fulfill, reject) {
        db.transaction(function (tx) {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS ' + name + ' (key unique, value);',
                [],
                function () {
                    fulfill(db);
                }, function (tx, err) {
                    reject(err);
                }
            );
        });
    });
}
Y.mix(WebSQLStore.prototype, {
    _executeSql: function (query, values, formatter, callback) {
        var promise = this._table.then(function (db) {
            return new Y.Promise(function (fulfill, reject) {
                db.transaction(function (tx) {
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
    _getFormatter: function (results) {
        return Y.JSON.parse(results.rows.item(0).value);
    },
    get: function (key, callback) {
        return this._executeSql(
            'SELECT value FROM ' + this.name + ' WHERE key=?',
            [key],
            this._getFormatter,
            callback
        );
    },
    _putFormatter: function (results) {
        return results.rowsAffected;
    },
    put: function (key, value, callback) {
        this._executeSql(
            'REPLACE INTO ' + this.name + ' (key, value) VALUES (?, ?);',
            [key, Y.JSON.stringify(value)],
            this._putFormatter,
            callback
        );
    },
    remove: function (key, callback) {
        this._executeSql(
            'DELETE FROM ' + this.name + ' WHERE key=?',
            [key],
            this._putFormatter,
            callback
        );
    },
    _countFormatter: function (result) {
        return result.rows.item(0)['COUNT(1)'];
    },
    count: function (callback) {
        return this._executeSql(
            'SELECT COUNT(1) FROM ' + this.name,
            [],
            this._countFormatter,
            callback
        );
    },
    clear: function (callback) {
        this._executeSql(
            'DELETE FROM ' + this.name, [], this._putFormatter, callback
        );
    }
});

Y.Storage.Store = WebSQLStore;
