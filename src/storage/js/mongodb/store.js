function MongoStore(config) {
    this.name = config.name;

    var name = config.name;

    this._collection = config.db.then(function (db) {
        return new Y.Promise(function (resolve, reject) {
            db.collection(name, function (err, collection) {
                if (err) {
                    reject(err);
                } else {
                    resolve(collection);
                }
            });
        });
    });
}
Y.mix(MongoStore.prototype, {
    _transaction: function (action) {
        return this._collection.then(function (collection) {
            return new Y.Promise(function (resolve, reject) {
                action(collection, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        });
    },
    get: function (key) {
        return this._transaction(function (collection, callback) {
            collection.find({
                key: key
            }, callback);
        });
    },
    count: function () {
        return this._transaction(function (collection, callback) {
            collection.count(callback);
        });
    }
});
