function noop() {
}

function MemoryStore(config) {
    /**
    Name of the object store

    @property name
    @type String
    **/
    this.name = config.name;

    /**
    Object that contains all keys and values for this store

    @property _data
    @type Promise
    @private
    **/
    this._data = new Y.Promise(function (fulfill) {
        fulfill({});
    });
}
Y.mix(MemoryStore.prototype, {
    /**
    Resets the data object of this store

    @method _resetData
    @private
    **/
    _transaction: function (action) {
        return this._data.then(action);
    },
    get: function (key) {
        return this._transaction(function (data) {
            return data[key];
        });
    },
    put: function (key, value) {
        return this._transaction(function (data) {
            data[key] = value;
        });
    },
    remove: function (key) {
        return this._transaction(function (data) {
            delete data[key];
        });
    },
    _countKeys: function (data) {
        // Counting own properties is faster than using Object.keys(data).length
        var count = 0,
            prop;

        for (prop in data) {
            if (data.hasOwnProperty(prop)) {
                count++;
            }
        }
        
        return count;
    },
    count: function () {
        return this._transaction(this._countKeys);
    },
    _createData: function () {
        return {};
    },
    clear: function () {
        // Returning a new object from the then() callback of the previous data
        // object ensures that we maintain the rejected state if there was one
        this._data = this._data.then(this._createData);
        return this._transaction(noop);
    },
    _close: function () {
        this._data = new Y.Promise(function (fulfill, reject) {
            reject(new Error('Database is closed'));
        });
    }
});

Y.Storage.Store = MemoryStore;
