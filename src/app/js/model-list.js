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

@event add
@param {Model} model The model being added.
@param {int} index The index at which the model will be added.
@preventable _defAddFn
**/
EVT_ADD = 'add',

/**
Fired when a model is removed from the list.

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

    // comparator: null,

    create: function (models, options) {
    },

    getByClientId: function (clientId) {  
    },

    getById: function (id) {
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

    sort: function (options) {
        var comparator = this.comparator;

        if (!comparator) {
            Y.error("No comparator specified.");
            return;
        }

        // TODO: sort
    },

    /**
    Returns an array containing the models in this list.

    @method toArray
    @return {Array} Array containing the models in this list.
    **/
    toArray: function () {
        return this._items.concat();  
    },

    url: function () {
    },

    // -- Protected Methods ----------------------------------------------------

    _add: function (model, options) {
        var id, index;

        if (!(model instanceof Y.Model)) {
            model = new this.model(model);
        }

        if (this.getByClientId(model)) {
            Y.error('Model already exists in list.');
            return;
        }

        id    = model.get('id');
        index = this._findIndex(model);

        this._clientIdMap[model.get('clientId')] = model;

        if (id) {
            this._idMap[id] = model;
        }

        this._attachList(model);
        this._items.splice(index, 0, model);

        this.fire(EVT_ADD, Y.merge(options, {
            model: model,
            index: index
        }));
    },

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
    **/
    _findIndex: function (model) {
        if (!this._items.length) {
            return 0;
        }

        if (!this.comparator) {
            return this._items.length;
        }

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

    // -- Default Event Handlers -----------------------------------------------

    /**
    Default event handler for `add` events.

    @method _defAddFn
    @param {EventFacade} e
    @protected
    **/
    _defAddFn: function (e) {
        
    },

    /**
    Default event handler for `remove` events.

    @method _defRemoveFn
    @param {EventFacade} e
    @protected
    **/
    _defRemoveFn: function (e) {
        
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
