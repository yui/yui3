function MemoryStorage(config) {
    this.name    = config.name;
    this.version = config.version;
    this.size    = config.size;
    this._stores = config.stores;

    this._initStores(config.stores);
}
Y.mix(MemoryStorage.prototype, {
    _initStores: function (stores) {
        for (var i = 0, count = stores.length; i < count; i++) {
            this[stores[i]] = new MemoryStorage.Store({
                db: this,
                name: stores[i]
            });
        }
    },
    close: function () {
        var i = 0, stores = this._stores, count = stores.length;
        for (; i < count; i++) {
            this[stores[i]]._close();
        }
    }
});

Y.Storage = MemoryStorage;
