function MemoryStore(config) {
    this.name = config.name;

    this._data = {};
}
Y.mix(MemoryStore.prototype, {
    _addCallback: function (promise, callback) {
        if (callback) {
            promise.done(function (result) {
                callback(undefined, result);
            }, callback);
        }
        return promise;
    },
    _getData: function () {
        var data = this._data;

        return new Y.Promise(function (fulfill) {
            fulfill(data);
        });
    },
    get: function (key, callback) {
        return this._addCallback(this._getData().then(function (data) {
            return data[key];
        }), callback);
    },
    put: function (key, value, callback) {
        this._addCallback(this._getData().then(function (data) {
            data[key] = value;
        }), callback);
    },
    remove: function (key, callback) {
        this._addCallback(this._getData().then(function (data) {
            delete data[key];
        }), callback);
    },
    count: function (callback) {
        return this._addCallback(this._getData().then(function (data) {
            return Y.Object.keys(data).length;
        }), callback);
    },
    clear: function (callback) {
        this._data = {};
        this._addCallback(this._getData(), callback);
    }
});

Y.Storage.Store = MemoryStore;
