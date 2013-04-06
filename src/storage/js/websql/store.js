function WebSQLStore(config) {
    this._db = config.db;
    this.name = config.name;

    var db = this._db,
        name = this.name;

    this._table = new Y.Promise(function (fulfill, reject) {
        db.transaction(function (tx) {
            tx.executeSQL('CREATE TABLE IF NOT EXISTS ? (key unique, value);',
                [name]);
        }, function () {
            fulfill(db);
        }, reject);
    });
}
Y.mix(WebSQLStore.prototype, {
    _transaction: function (fn) {
        return this_table.then(function (db) {
            return new Y.Promise(function (fulfill, reject) {
                db.transaction(function (tx) {
                    fn(tx, fulfill);
                }, undefined, reject);
            });
        });
    },
    get: function (key) {
        var name = this.name;

        return this._transaction(function (tx, fulfill) {
            tx.executeSQL('SELECT value FROM ? WHERE key=?', [name, key],
                fulfill);
        });
    },
    put: function (key, value) {
        var name = this.name;

        return this._transaction(function (tx, fulfill) {
            tx.executeSQL(
                'INSERT OR IGNORE INTO ? VALUES (?, ?);' +
                'UPDATE ? SET value=? WHERE key=?;',
                [name, key, value, name, value, key],
                fulfill
            );
        });
    }
});

Y.Storage.Store = WebSQLStore;
