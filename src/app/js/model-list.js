YUI.add('model-list', function (Y) {

/**
@module model-list
@class ModelList
@constructor
@uses ArrayList
@uses Base
**/

var Lang   = Y.Lang,
    YArray = Y.Array,

/**
Fired when a model is added to the list.

Listen to the `on` phase of this event to be notified before a model is added to
the list. Calling `e.preventDefault()` during the `on` phase will prevent the
model from being added.

Listen to the `after` phase of this event to be notified after a model has been
added to the list.

@event add
@param {Model} model The model being added.
@param {int} index The index at which the model will be added.
@preventable _defAddFn
**/
EVT_ADD = 'add',

/**
Fired when the list is completely refreshed via the `refresh()` method or sorted
via the `sort()` method.

Listen to the `on` phase of this event to be notified before the list is
refreshed. Calling `e.preventDefault()` during the `on` phase will prevent the
list from being refreshed.

Listen to the `after` phase of this event to be notified after the list has been
refreshed.

@event refresh
@param {Model[]} models Array of the list's new models after the refresh.
@param {String} src Source of the event. May be either `'refresh'` or `'sort'`.
@preventable _defRefreshFn
**/
EVT_REFRESH = 'refresh';

/**
Fired when a model is removed from the list.

Listen to the `on` phase of this event to be notified before a model is removed
from the list. Calling `e.preventDefault()` during the `on` phase will prevent
the model from being removed.

Listen to the `after` phase of this event to be notified after a model has been
removed from the list.

@event remove
@param {Model} model The model being removed.
@param {int} index The index of the model being removed.
@preventable _defAddFn
**/
EVT_REMOVE = 'remove';

function ModelList() {
    ModelList.superclass.constructor.apply(this, arguments);
}

Y.ModelList = Y.extend(ModelList, Y.Base, {
    // -- Public Properties ----------------------------------------------------

    /**
    The `Model` class or subclass of the models in this list.

    This property is `null` by default, and is intended to be overridden in a
    subclass or specified as a config property at instantiation time. It's not
    required, but if provided it will be used to create model instances
    automatically based on attribute hashes passed to the `add()`, `create()`,
    and `remove()` methods.

    @property model
    @type Model
    @default `null`
    **/
    model: null,

    // -- Lifecycle Methods ----------------------------------------------------
    initializer: function (config) {
        this.model = config.model || this.model;

        this.publish(EVT_ADD,    {defaultFn: this._defAddFn});
        this.publish(EVT_REMOVE, {defaultFn: this._defRemoveFn});

        this._clear();
    },

    // TODO: destructor?

    // -- Public Methods -------------------------------------------------------

    /**
    Adds the specified model or array of models to this list.

    _models_ may be a `Model` instance or an array of `Model` instances. If the
    `model` property of this list is set to a model class, then _models_ may
    also be an attribute hash or array of attribute hashes, in which case each
    hash will be automatically converted into a model instance.

    @method add
    @param {Model|Model[]|Object|Object[]} models Models to add.
    @param {Object} [options] Data to be mixed into the event facade of the
        `add` event(s) for the added models.
      @param {Boolean} [options.silent=false] If `true`, no `add` event(s) will
          be fired.
    @chainable
    **/
    add: function (models, options) {
        var i, len;

        if (Lang.isArray(models)) {
            for (i = 0, len = models.length; i < len; ++i) {
                this._add(models[i], options);
            }
        } else {
            this._add(model, options);
        }

        return this;
    },

    /**
    Define this method to provide a function that takes a model as a parameter
    and returns a value by which that model should be sorted relative to other
    models in this list.

    By default, no comparator is defined, meaning that models will not be sorted
    (they'll be stored in the order they're added).

    @example
        var list = new Y.ModelList;

        list.comparator = function (model) {
            return model.get('id'); // Sort models by id.
        };

    @method comparator
    @param {Model} model Model being sorted.
    @return {Number|String} Value by which the model should be sorted relative
      to other models in this list.
    **/

    // comparator is not defined by default

    create: function (models, options) {
    },

    /**
    Returns the model with the specified _clientId_, or `null` if not found.

    @method getByClientId
    @param {String} clientId Client id.
    @return {Model} Model, or `null` if not found.
    **/
    getByClientId: function (clientId) {
        return this._clientIdMap[clientId] || null;
    },

    /**
    Returns the model with the specified _id_, or `null` if not found.

    Note that models aren't expected to have an id until they're saved, so if
    you're working with unsaved models, it may be safer to call
    `getByClientId()`.

    @method getById
    @param {String} id Model id.
    @return {Model} Model, or `null` if not found.
    **/
    getById: function (id) {
        return this._idMap[id] || null;
    },

    /**
    Calls the named method on every model in the list. Any arguments provided
    after _name_ will be passed on to the invoked method.

    @method invoke
    @param {String} name Name of the method to call on each model.
    @param {*any} [args] Zero or more arguments to pass to the invoked method.
    @return {Array} Array of return values, indexed according to the index of
      the model on which the method was called.
    **/
    invoke: function (name /*, *args */) {
        return YArray.invoke(this._items, name, YArray(arguments, 1, true));
    },

    /**
    Returns the model at the specified _index_.

    @method item
    @param {int} index Index of the model to fetch.
    @return {Model} The model at the specified index, or `undefined` if there
      isn't a model there.
    **/

    // item() is inherited from ArrayList.

    load: function () {
    },

    map: function (fn, thisObj) {
    },

    parse: function (response) {
    },

    refresh: function (models, options) {
    },

    remove: function (models, options) {
    },

    /**
    Forcibly re-sorts the list.

    Usually it shouldn't be necessary to call this method since the list
    maintains its sort order when items are added and removed, but if you change
    the `comparator` function after items are already in the list, you'll need
    to re-sort.

    @method sort
    @param {Object} [options] Data to be mixed into the event facade of the
        `refresh` event.
      @param {Boolean} [options.silent=false] If `true`, no `refresh` event will
          be fired.
    @chainable
    **/
    sort: function (options) {
        var comparator = this.comparator,
            models     = this._items.concat(),
            facade;

        if (!comparator) {
            return;
        }

        options || (options = {});

        models.sort(function (a, b) {
            var aValue = comparator(a),
                bValue = comparator(b);

            return a < b ? -1 : (a > b ? 1 : 0);
        });

        facade = Y.merge(options, {
            models: models,
            src   : 'sort'
        });

        options.silent ? this._defRefreshFn(facade) :
                this.fire(EVT_REFRESH, facade);

        return this;
    },

    /**
    Returns an array containing the models in this list.

    @method toArray
    @return {Array} Array containing the models in this list.
    **/
    toArray: function () {
        return this._items.concat();
    },

    /**
    Override this method to return a URL corresponding to this list's location
    on the server. The default implementation simply returns an empty string.

    The URL returned by this method will be used to make requests to the server
    or other persistence layer when this list is loaded.

    @method url
    @return {String} URL for this list.
    **/
    url: function () { return ''; },

    // -- Protected Methods ----------------------------------------------------

    /**
    Adds the specified _model_ if it isn't already in this list.

    @method _add
    @param {Model|Object} model Model or object to add.
    @param {Object} [options] Data to be mixed into the event facade of the
        `add` event for the added model.
      @param {Boolean} [options.silent=false] If `true`, no `add` event will be
          fired.
    @protected
    **/
    _add: function (model, options) {
        var facade;

        options || (options = {});

        if (!(model instanceof Y.Model)) {
            model = new this.model(model);
        }

        if (this._clientIdMap[model.get('clientId')]) {
            Y.error('Model already in list.');
            return;
        }

        facade = Y.merge(options, {
            index: this._findIndex(model),
            model: model
        });

        options.silent ? this._defAddFn(facade) : this.fire(EVT_ADD, facade);
    },

    /**
    Sets the specified model's `list` attribute to point to this list and adds
    this list as a bubble target for the model's events. Also removes the model
    from any other list it's currently in.

    @method _attachList
    @param {Model} model Model to attach to this list.
    @protected
    **/
    _attachList: function (model) {
        // If the model is already attached to a list, remove it from that list.

        // TODO: It really should be possible for a model to exist in multiple
        // lists. That would be super powerful. Need to rethink this.
        if (model.list) {
            model.list.remove(model);
        }

        // Attach this list and make it a bubble target for the model.
        model.list = this;
        model.addTarget(this);
    },

    /**
    Unsets the specified model's `list` attribute and removes this list as a
    bubble target for the model's events.

    @method _detachList
    @param {Model} model Model to detach.
    @protected
    **/
    _detachList: function (model) {
        delete model.list;
        model.removeTarget(this);
    },

    /**
    Clears all internal state and the internal list of models, returning this
    list to an empty state. Does _not_ go through the process of detaching any
    models that may be targeting this list as a bubble target.

    @method _clear
    @protected
    **/
    _clear: function () {
        this._clientIdMap = {};
        this._idMap       = {};
        this._items       = [];
    },

    /**
    Returns the index at which the given _model_ should be inserted to maintain
    the sort order of the list.

    @method _findIndex
    @param {Model} model The model being inserted.
    @return {int} Index at which the model should be inserted.
    @protected
    **/
    _findIndex: function (model) {
        if (!this._items.length) { return 0; }
        if (!this.comparator)    { return this._items.length; }

        var comparator = this.comparator,
            items      = this._items,
            max        = items.length,
            min        = 0,
            needle     = comparator(model),
            middle;

        // Perform an iterative binary search to determine the correct position
        // based on the return value of the `comparator` function.
        while (min < max) {
            middle = (min + max) / 2;

            if (comparator(items[middle]) < needle) {
                min = middle + 1;
            } else {
                max = middle;
            }
        }

        return min;
    },

    /**
    Removes the specified _model_ if it's in this list.

    @method _remove
    @param {Model} model Model to remove.
    @param {Object} [options] Data to be mixed into the event facade of the
        `remove` event for the removed model.
      @param {Boolean} [options.silent=false] If `true`, no `remove` event will
          be fired.
    @protected
    **/
    _remove: function (model, options) {
        var index = this.indexOf(model),
            facade;

        options || (options = {});

        if (index === -1) {
            Y.error('Model not in list.');
            return;
        }
    
        facade = Y.merge(options, {
            index: index,
            model: model
        });
    
        options.silent ? this._defRemoveFn(facade) :
                this.fire(EVT_REMOVE, facade);
    },

    // -- Default Event Handlers -----------------------------------------------

    /**
    Default event handler for `add` events.

    @method _defAddFn
    @param {EventFacade} e
    @protected
    **/
    _defAddFn: function (e) {
        var model = e.model,
            id    = model.get('id');

        this._clientIdMap[model.get('clientId')] = model;

        if (id) {
            this._idMap[id] = model;
        }

        this._attachList(model);
        this._items.splice(e.index, 0, model);
    },

    /**
    Default event handler for `refresh` events.

    @method _defRefreshFn
    @param {EventFacade} e
    @protected
    **/
    _defRefreshFn: function (e) {
        this._clear();

        if (e.models.length) {
            this.add(e.models, {silent: true});
        }
    },

    /**
    Default event handler for `remove` events.

    @method _defRemoveFn
    @param {EventFacade} e
    @protected
    **/
    _defRemoveFn: function (e) {
        var model = e.model,
            id    = model.get('id');

        this._detachList(model);
        delete this._clientIdMap[model.get('clientId')];

        if (id) {
            delete this._idMap[id];
        }

        this._items.splice(e.index, 1);
    }
}, {
    NAME: 'modelList'
});

Y.augment(ModelList, Y.ArrayList);

// TODO: Document these.
Y.ArrayList.addMethod(ModelList.prototype, [
    'get', 'getAsHTML', 'getAsURL', 'toJSON'
]);

}, '@VERSION@', {
    requires: ['array-invoke', 'arraylist', 'base-build', 'model']
});
