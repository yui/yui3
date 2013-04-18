
/**
An asynchronous database abstraction layer. The Storage class implementation
will vary based on the environment in which YUI is running. It may be one of
IndexedDBStorage, WebSQLStorage, LocalStorage or MemoryStorage.

@class Storage
@constructor
@param {Object} config Object literal specifying configuration properties
@param {String} config.name Name of the database
@param {Number} config.version Version of the database. *Note: use only integer
                    numbers because some implementations round them up*
@param {String*} config.stores An array with the name of the stores that this
                    database will contain. Do not modify this array without
                    changing the version of the database.
@param {Number} [config.size=5242880] Size in bytes of the database. Some
                    implementations handle this automatically, others require
                    you to specify a size. Keep in mind that if you are allowing
                    localSotarge as a storage option then the maximum size will
                    always be 5 MB.
**/
    /**
    The name of the database

    @property name
    @type String
    **/
    /**
    The version of the database

    @property version
    @type Number
    **/
    /**
    The size of the database

    @property size
    @type Number
    **/
    /**
    Closes the database. All stores will still be available, but fail when
    doing any operation on them.

    @method close
    **/

/**
An asynchronous object store that saves values by keys. This class is not
intended to be instantiated by the user, but instead internally by Y.Storage.

@class Storage.Store
@constructor
@param {Object} config Object literal specifying configuration properties
@param {String} config.name Name of the database
@param {Object} config.db Corresponding database object
**/
    /**
    The name of the object store

    @property name
    @type String
    **/
    /**
    Gets a value by key

    @method get
    @param {String} key The key that points to the desired value
    @param {Function} callback Callback receiving an optional error object and
                        the stored value
    @return {Promise} promise Promise representing the requested value
    **/
    /**
    Inserts or updates a value by key

    @method put
    @param {String} key The key that points to the desired value
    @param {Any} value The value to store
    @param {Function} callback Callback receiving an optional error object
    **/
    /**
    Removes the value from the store

    @method remove
    @param {String} key The key that points to the removed value
    @param {Function} callback Callback receiving an optional error object
    **/
    /**
    Counts the number of values in the store

    @method count
    @param {Function} callback Callback receiving an optional error object and
                        a number with the number of values in the store
    **/
    /**
    Removes all values from the store

    @method clear
    @param {Function} callback Callback receiving an optional error object
    **/
