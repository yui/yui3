Y.mix(Y.Promise.Resolver.prototype, {
    _makeAsync: function (fn) {
        return function () {
            var args = arguments;
            Y.soon(function () {
                fn.apply(undefined, args);
            });
        };
    },
    done: function (callback, errback) {
        var callbackList = this._callbacks || [],
                errbackList  = this._errbacks  || [];
        
        if (typeof callback === 'function') {
            callbackList.push(this._makeAsync(callback));
        }
        errbackList.push(this._makeAsync(
            typeof errback === 'function' ? errback : function (e) {
                throw e;
            }
        ));
        
        if (this._status === 'fulfilled') {
            this.fulfill(this._result);
        } else if (this._status === 'rejected') {
            this.reject(this._result);
        }
    }
});

Y.Promise.prototype.done = function (callback, errback) {
    return this._resolver.done(callback, errback);
};

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
