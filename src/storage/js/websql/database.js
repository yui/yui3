function WebSQLStorage(config) {
    this.name = config.name;
    this.version = config.version;
    this.size = config.size;

    this._db = openDatabase(this.name, this.version, this.name + ' Database',
                this.size);
    this._initStores(config.stores);
}
Y.mix(WebSQLStorage.prototype, {
    _initStores: function (stores) {
        this._stores = stores;

        for (var i = 0, count = stores.length; i < count; i++) {
            this[stores[i]] = new WebSQLStorage.Store({
                db: this._db,
                name: stores[i]
            });
        }
    },
    close: function () {
        var stores = this._stores, i = 0, count = stores.length;
        for (; i < count; i++) {
            this[stores[i]]._close();
        }
        this._db = null;
    }
});

Y.Storage = WebSQLStorage;
