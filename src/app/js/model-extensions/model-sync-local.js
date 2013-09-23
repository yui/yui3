/*
An extension which provides a sync implementation through locally stored
key value pairs, either through the HTML localStorage API or falling back
onto an in-memory cache, that can be mixed into a Model or ModelList subclass.

@module app
@submodule model-sync-local
@since @VERSION@
**/

/**
An extension which provides a sync implementation through locally stored
key value pairs, either through the HTML localStorage API or falling back
onto an in-memory cache, that can be mixed into a Model or ModelList subclass.

A group of Models/ModelLists is serialized in localStorage by either its
class name, or a specified 'root' that is provided.

    var User = Y.Base.create('user', Y.Model, [Y.ModelSync.Local], {
        root: 'user'
    });

    var Users = Y.Base.create('users', Y.ModelList, [Y.ModelSync.Local], {
        model: User,
    });

@class ModelSync.Local
@extensionfor Model
@extensionfor ModelList
@since @VERSION@
**/
function LocalSync() {}

/**
Properties that shouldn't be turned into ad-hoc attributes when passed to a
Model or ModelList constructor.

@property _NON_ATTRS_CFG
@type Array
@default ['root'']
@static
@protected
@since @VERSION@
**/
LocalSync._NON_ATTRS_CFG = ['root'];

/**
Feature detection for `localStorage` availability.

@property _hasLocalStorage
@type Boolean
@private
**/
LocalSync._hasLocalStorage = (function () {
    try {
        return 'localStorage' in Y.config.win && Y.config.win.localStorage !== null;
    } catch (e) {
        return false;
    }
})(),

/**
Object of key/value pairs to fall back on when localStorage is not available.

@property _data
@type Object
@private
**/
LocalSync._data = {};

LocalSync.prototype = {

    // -- Public Methods -------------------------------------------------------
    
    /**
    Root used as the key inside of localStorage and/or the in-memory store.
    
    @property root
    @type String
    @default ""
    @since @VERSION@
    **/
    root: '',

    /**
    Shortcut for access to localStorage.
    
    @property storage
    @type Storage
    @default null
    @since @VERSION@
    **/
    storage: null,

    // -- Lifecycle Methods -----------------------------------------------------
    initializer: function (config) {
        var store;

        config || (config = {});

        if ('root' in config) {
            this.root = config.root || '';
        }

        if (this.model && this.model.prototype.root) {
            this.root = this.model.prototype.root;
        }

        if (LocalSync._hasLocalStorage) {
            this.storage = Y.config.win.localStorage;
            store = this.storage.getItem(this.root);
        } else {
            Y.log("Could not access localStorage.", "warn");
        }

        // Pull in existing data from localStorage, if possible.
        // Otherwise, see if there's existing data on the local cache.
        if (store) {
            LocalSync._data[this.root] = Y.JSON.parse(store);
        } else {
            LocalSync._data[this.root] = (LocalSync._data[this.root] || {});
        }
    },
    
    // -- Public Methods -----------------------------------------------------------
    
    /**
    Creates a synchronization layer with the localStorage API, if available.
    Otherwise, falls back to a in-memory data store.

    This method is called internally by load(), save(), and destroy().

    @method sync
    @param {String} action Sync action to perform. May be one of the following:

      * **create**: Store a newly-created model for the first time.
      * **read**  : Load an existing model.
      * **update**: Update an existing model.
      * **delete**: Delete an existing model.

    @param {Object} [options] Sync options
    @param {callback} [callback] Called when the sync operation finishes.
      @param {Error|null} callback.err If an error occurred, this parameter will
        contain the error. If the sync operation succeeded, _err_ will be
        falsy.
      @param {Any} [callback.response] The response from our sync. This value will
        be passed to the parse() method, which is expected to parse it and
        return an attribute hash.
    **/
    sync: function (action, options, callback) {
        options || (options = {});
        var response, errorInfo;

        try {
            switch (action) {
                case 'read':
                    if (this._isYUIModelList) {
                        response = this._index(options);
                    } else {
                        response = this._show(options);
                    }
                    break;
                case 'create':
                    response = this._create(options);
                    break;
                case 'update':
                    response = this._update(options);
                    break;
                case 'delete':
                    response = this._destroy(options);
                    break;
            }
        } catch (error) {
            errorInfo = error.message;
        }

        if (response) {
            callback(null, response);
        } else {
            if (errorInfo) {
                callback(errorInfo);
            } else {
                callback("Data not found in LocalStorage");
            }
        }
    },

    /**
    Generate a random GUID for our Models. This can be overriden if you have
    another method of generating different IDs.
    
    @method generateID
    @protected
    @param {String} pre Optional GUID prefix
    **/
    generateID: function (pre) {
        return Y.guid(pre + '_');
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Sync method correlating to the "read" operation, for a Model List
    
    @method _index
    @return {Object[]} Array of objects found for that root key
    @protected
    @since @VERSION@
    **/
    _index: function (options) {
        return Y.Object.values(LocalSync._data[this.root]);
    },

    /**
    Sync method correlating to the "read" operation, for a Model
    
    @method _show
    @return {Object} Object found for that root key and model ID
    @protected
    @since @VERSION@
    **/
    _show: function (options) {
        return LocalSync._data[this.root][this.get('id')];
    },
    
    /**
    Sync method correlating to the "create" operation
    
    @method _show
    @return {Object} The new object created.
    @protected
    @since @VERSION@
    **/
    _create: function (options) {
        var hash = this.toJSON();
        hash.id = this.generateID(this.root);
        LocalSync._data[this.root][hash.id] = hash;

        this._save();
        return hash;
    },

    /**
    Sync method correlating to the "update" operation

    @method _update
    @return {Object} The updated object.
    @protected
    @since @VERSION@
    **/
    _update: function (options) {
        var hash = Y.merge(this.toJSON(), options);
        LocalSync._data[this.root][this.get('id')] = hash;
        
        this._save();
        return hash;
    },

    /**
    Sync method correlating to the "delete" operation.  Deletes the data
    from the in-memory object, and saves into localStorage if available.
    
    @method _destroy
    @return {Object} The deleted object.
    @protected
    @since @VERSION@
    **/
    _destroy: function (options) {
        delete LocalSync._data[this.root][this.get('id')];
        this._save();
        return this.toJSON();
    },
    
    /**
    Saves the current in-memory store into a localStorage key/value pair
    if localStorage is available; otherwise, does nothing.
    
    @method _save
    @protected
    @since @VERSION@
    **/
    _save: function () {
        if (LocalSync._hasLocalStorage) {
            this.storage && this.storage.setItem(
                this.root,
                Y.JSON.stringify(LocalSync._data[this.root])
            );
        }
    }
};

// -- Namespace ---------------------------------------------------------------

Y.namespace('ModelSync').Local = LocalSync;
