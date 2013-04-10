/**
A WebSQL based database that stores key-value pairs in object collections.

Important security note:
**It is possible to ibject code into the database from store names**, so do not
let the store names be defined by the user.

@class WebSQLStorage
@constructor
@param {Object} config Object literal specifying configuration properties
@param {String} config.name Name of the database
@param {Number} config.version Version of the database. *Note: use only integer
                    numbers because some implementations round them up*
@param {String*} config.stores An array with the name of the stores that this
                    database will contain. Do not modify this array without
                    changing the version of the database
@param {Number} [config.size=5242880] Size in bytes of the database. Some
                    implementations handle this automatically, others require
                    you to specify a size. Keep in mind that if you are allowing
                    localSotarge as a storage option then the maximum size will
                    always be 5 MB.
**/
function WebSQLStorage(config) {
    var self = this;
    /**
    The name of the database

    @property name
    @type String
    **/
    this.name = config.name;
    /**
    The version of the database

    @property version
    @type Number
    **/
    this.version = config.version;
    /**
    The size of the database

    @property size
    @type Number
    **/
    this.size = config.size || 5242880;
    /**
    An array containing the name of all object stores in this database

    @property _stores
    @type String*
    @private
    **/
    this._stores = config.stores;

    /**
    A promise representing the database instance

    @property _db
    @private
    @type Promise
    **/
    this._db = new Y.Promise(function () {
        self._open.apply(self, arguments);
    });
    this._initStores(config.stores);
}
Y.mix(WebSQLStorage.prototype, {
    /**
    Initialization function for the `_db` promise. Fulfills or rejects the
    promise based on the result of opening the database.

    @method _open
    @param {Function} fulfill Fulfill callback
    @param {Function} reject Reject callback
    @private
    **/
    _open: function (fulfill, reject) {
        var stores = this._stores,
            db = openDatabase(this.name, this.version, this.name + ' Database',
                this.size);

        db.transaction(function (tx) {
            for (var i = 0, count = stores.length; i < count; i++) {
                tx.executeSql(
                    'CREATE TABLE IF NOT EXISTS ' + stores[i] +
                    ' (key unique, value);', []
                );
            }
        }, reject, function () {
            fulfill(db);
        });
    },
    /**
    Starts initializing the object stores

    @method _initStores
    @private
    @param {Array} stores The names of the stores to initialize
    **/
    _initStores: function (stores) {
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
