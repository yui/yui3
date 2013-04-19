var mongo = require('mongodb-native');

function MongoStorage(config) {
    var self = this;

    config = config || {};

    this._db = new Y.Promise(function (resolve, reject) {
        self._open(config, resolve, reject);
    });
    this._initStores(config.stores);
}
Y.mix(MongoStorage.prototype, {
    _open: function (config, success, failure) {
        var client = new mongo.Db(
            config.name, new Server(config.host, config.port, {}), {}
        );

        client.open(function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(client);
            }
        });
    },
    _initStores: function (stores) {
        for (var i = 0, count = stores.length; i < count; i++) {
            this[stores[i]] = new MongoStorage.Store({
                db: this._db,
                name: stores[i]
            });
        }
    },
    close: function () {
        return this._db.then(function (db) {
            db.close();
        });
    }
});
