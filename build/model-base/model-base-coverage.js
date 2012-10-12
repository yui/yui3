if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/model-base/model-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/model-base/model-base.js",
    code: []
};
_yuitest_coverage["build/model-base/model-base.js"].code=["YUI.add('model-base', function (Y, NAME) {","","/**","TODO: Update description.","","Attribute-based data model with APIs for getting, setting, validating, and","syncing attribute values, as well as events for being notified of model changes.","","@module app","@submodule model-base","@since 3.8.0","**/","","var GlobalEnv = YUI.namespace('Env.Model'),","","    AttributeExtras = Y.AttributeExtras,","    Lang            = Y.Lang,","    YArray          = Y.Array,","    YObject         = Y.Object;","","/**","TODO: Update description.","","Attribute-based data model with APIs for getting, setting, validating, and","syncing attribute values, as well as events for being notified of model changes.","","In most cases, you'll want to create your own subclass of `Y.Model` and","customize it to meet your needs. In particular, the `sync()` and `validate()`","methods are meant to be overridden by custom implementations. You may also want","to override the `parse()` method to parse non-generic server responses.","","@class Model.Base","@constructor","@extends BaseCore","@since 3.8.0","**/","function ModelBase() {","    ModelBase.superclass.constructor.apply(this, arguments);","    AttributeExtras.apply(this, arguments);","}","","Y.namespace('Model').Base = Y.extend(ModelBase, Y.BaseCore, {","    // -- Public Properties ----------------------------------------------------","","    /**","    Hash of attributes that have changed since the last time this model was","    saved.","","    @property changed","    @type Object","    @default {}","    **/","","    /**","    Name of the attribute to use as the unique id (or primary key) for this","    model.","","    The default is `id`, but if your persistence layer uses a different name for","    the primary key (such as `_id` or `uid`), you can specify that here.","","    The built-in `id` attribute will always be an alias for whatever attribute","    name you specify here, so getting and setting `id` will always behave the","    same as getting and setting your custom id attribute.","","    @property idAttribute","    @type String","    @default `'id'`","    **/","    idAttribute: 'id',","","    /**","    Hash of attributes that were changed in the last `change` event. Each item","    in this hash is an object with the following properties:","","      * `newVal`: The new value of the attribute after it changed.","      * `prevVal`: The old value of the attribute before it changed.","      * `src`: The source of the change, or `null` if no source was specified.","","    @property lastChange","    @type Object","    @default {}","    **/","","    /**","    Array of `ModelList` instances that contain this model.","","    When a model is in one or more lists, the model's events will bubble up to","    those lists. You can subscribe to a model event on a list to be notified","    when any model in the list fires that event.","","    This property is updated automatically when this model is added to or","    removed from a `ModelList` instance. You shouldn't alter it manually. When","    working with models in a list, you should always add and remove models using","    the list's `add()` and `remove()` methods.","","    @example Subscribing to model events on a list:","","        // Assuming `list` is an existing Y.ModelList instance.","        list.on('*:change', function (e) {","            // This function will be called whenever any model in the list","            // fires a `change` event.","            //","            // `e.target` will refer to the model instance that fired the","            // event.","        });","","    @property lists","    @type ModelList[]","    @default `[]`","    **/","","    // -- Protected Properties -------------------------------------------------","","    /**","    This tells `Y.Base` that it should create ad-hoc attributes for config","    properties passed to Model's constructor. This makes it possible to","    instantiate a model and set a bunch of attributes without having to subclass","    `Y.Model` and declare all those attributes first.","","    @property _allowAdHocAttrs","    @type Boolean","    @default true","    @protected","    @since 3.5.0","    **/","    _allowAdHocAttrs: true,","","    /**","    Total hack to allow us to identify Model instances without using","    `instanceof`, which won't work when the instance was created in another","    window or YUI sandbox.","","    @property _isYUIModel","    @type Boolean","    @default true","    @protected","    @since 3.5.0","    **/","    _isYUIModel: true,","","    // -- Lifecycle Methods ----------------------------------------------------","","    initializer: function (config) {","        this.changed    = {};","        this.lastChange = {};","        this.lists      = [];","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Destroys this model instance and removes it from its containing lists, if","    any.","","    The _callback_, if one is provided, will be called after the model is","    destroyed.","","    If `options.remove` is `true`, then this method delegates to the `sync()`","    method to delete the model from the persistence layer, which is an","    asynchronous action. In this case, the _callback_ (if provided) will be","    called after the sync layer indicates success or failure of the delete","    operation.","","    @method destroy","    @param {Object} [options] Sync options. It's up to the custom sync","        implementation to determine what options it supports or requires, if","        any.","      @param {Boolean} [options.remove=false] If `true`, the model will be","        deleted via the sync layer in addition to the instance being destroyed.","    @param {callback} [callback] Called after the model has been destroyed (and","        deleted via the sync layer if `options.remove` is `true`).","      @param {Error|null} callback.err If an error occurred, this parameter will","        contain the error. Otherwise _err_ will be `null`.","    @chainable","    **/","    destroy: function (options, callback) {","        this._destroy(options, callback);","        return ModelBase.superclass.destroy.call(this);","    },","","    /**","    Returns a clientId string that's unique among all models on the current page","    (even models in other YUI instances). Uniqueness across pageviews is","    unlikely.","","    @method generateClientId","    @return {String} Unique clientId.","    **/","    generateClientId: function () {","        GlobalEnv.lastId || (GlobalEnv.lastId = 0);","        return this.constructor.NAME + '_' + (GlobalEnv.lastId += 1);","    },","","    /**","    Returns the value of the specified attribute.","","    If the attribute's value is an object, _name_ may use dot notation to","    specify the path to a specific property within the object, and the value of","    that property will be returned.","","    @example","        // Set the 'foo' attribute to an object.","        myModel.set('foo', {","            bar: {","                baz: 'quux'","            }","        });","","        // Get the value of 'foo'.","        myModel.get('foo');","        // => {bar: {baz: 'quux'}}","","        // Get the value of 'foo.bar.baz'.","        myModel.get('foo.bar.baz');","        // => 'quux'","","    @method get","    @param {String} name Attribute name or object property path.","    @return {Any} Attribute value, or `undefined` if the attribute doesn't","      exist.","    **/","","    // get() is defined by Y.Attribute.","","    /**","    Returns an HTML-escaped version of the value of the specified string","    attribute. The value is escaped using `Y.Escape.html()`.","","    @method getAsHTML","    @param {String} name Attribute name or object property path.","    @return {String} HTML-escaped attribute value.","    **/","    getAsHTML: function (name) {","        var value = this.get(name);","        return Y.Escape.html(Lang.isValue(value) ? String(value) : '');","    },","","    /**","    Returns a URL-encoded version of the value of the specified string","    attribute. The value is encoded using the native `encodeURIComponent()`","    function.","","    @method getAsURL","    @param {String} name Attribute name or object property path.","    @return {String} URL-encoded attribute value.","    **/","    getAsURL: function (name) {","        var value = this.get(name);","        return encodeURIComponent(Lang.isValue(value) ? String(value) : '');","    },","","    /**","    Returns `true` if any attribute of this model has been changed since the","    model was last saved.","","    New models (models for which `isNew()` returns `true`) are implicitly","    considered to be \"modified\" until the first time they're saved.","","    @method isModified","    @return {Boolean} `true` if this model has changed since it was last saved,","      `false` otherwise.","    **/","    isModified: function () {","        return this.isNew() || !YObject.isEmpty(this.changed);","    },","","    /**","    Returns `true` if this model is \"new\", meaning it hasn't been saved since it","    was created.","","    Newness is determined by checking whether the model's `id` attribute has","    been set. An empty id is assumed to indicate a new model, whereas a","    non-empty id indicates a model that was either loaded or has been saved","    since it was created.","","    @method isNew","    @return {Boolean} `true` if this model is new, `false` otherwise.","    **/","    isNew: function () {","        return !Lang.isValue(this.get('id'));","    },","","    /**","    Loads this model from the server.","","    This method delegates to the `sync()` method to perform the actual load","    operation, which is an asynchronous action. Specify a _callback_ function to","    be notified of success or failure.","","    A successful load operation will fire a `load` event, while an unsuccessful","    load operation will fire an `error` event with the `src` value \"load\".","","    If the load operation succeeds and one or more of the loaded attributes","    differ from this model's current attributes, a `change` event will be fired.","","    @method load","    @param {Object} [options] Options to be passed to `sync()` and to `set()`","      when setting the loaded attributes. It's up to the custom sync","      implementation to determine what options it supports or requires, if any.","    @param {callback} [callback] Called when the sync operation finishes.","      @param {Error|null} callback.err If an error occurred, this parameter will","        contain the error. If the sync operation succeeded, _err_ will be","        `null`.","      @param {Any} callback.response The server's response. This value will","        be passed to the `parse()` method, which is expected to parse it and","        return an attribute hash.","    @chainable","    **/","    load: function (options, callback) {","        var self = this;","","        // Allow callback as only arg.","        if (typeof options === 'function') {","            callback = options;","            options  = {};","        }","","        options || (options = {});","","        self.sync('read', options, function (err, response) {","            self._handleRead(err, response, options, callback);","        });","","        return self;","    },","","    /**","    Called to parse the _response_ when the model is loaded from the server.","    This method receives a server _response_ and is expected to return an","    attribute hash.","","    The default implementation assumes that _response_ is either an attribute","    hash or a JSON string that can be parsed into an attribute hash. If","    _response_ is a JSON string and either `Y.JSON` or the native `JSON` object","    are available, it will be parsed automatically. If a parse error occurs, an","    `error` event will be fired and the model will not be updated.","","    You may override this method to implement custom parsing logic if necessary.","","    @method parse","    @param {Any} response Server response.","    @return {Object} Attribute hash.","    **/","    parse: function (response) {","        if (typeof response === 'string') {","            try {","                return Y.JSON.parse(response);","            } catch (ex) {","                return null;","            }","        }","","        return response;","    },","","    /**","    Saves this model to the server.","","    This method delegates to the `sync()` method to perform the actual save","    operation, which is an asynchronous action. Specify a _callback_ function to","    be notified of success or failure.","","    A successful save operation will fire a `save` event, while an unsuccessful","    save operation will fire an `error` event with the `src` value \"save\".","","    If the save operation succeeds and one or more of the attributes returned in","    the server's response differ from this model's current attributes, a","    `change` event will be fired.","","    @method save","    @param {Object} [options] Options to be passed to `sync()` and to `set()`","      when setting synced attributes. It's up to the custom sync implementation","      to determine what options it supports or requires, if any.","    @param {Function} [callback] Called when the sync operation finishes.","      @param {Error|null} callback.err If an error occurred or validation","        failed, this parameter will contain the error. If the sync operation","        succeeded, _err_ will be `null`.","      @param {Any} callback.response The server's response. This value will","        be passed to the `parse()` method, which is expected to parse it and","        return an attribute hash.","    @chainable","    **/","    save: function (options, callback) {","        var self = this;","","        // Allow callback as only arg.","        if (typeof options === 'function') {","            callback = options;","            options  = {};","        }","","        options || (options = {});","","        self._validate(self.toJSON(), function (err) {","            var action;","","            if (err) {","                if (callback) {","                    callback.call(null, err);","                }","","                return;","            }","","            action = self.isNew() ? 'create' : 'update';","","            self.sync(action, options, function (err, response) {","                self._handleSave(err, response, options, callback);","            });","        });","","        return self;","    },","","    /**","    Sets the value of a single attribute. If model validation fails, the","    attribute will not be set and an `error` event will be fired.","","    Use `setAttrs()` to set multiple attributes at once.","","    @example","        model.set('foo', 'bar');","","    @method set","    @param {String} name Attribute name or object property path.","    @param {any} value Value to set.","    @param {Object} [options] Data to be mixed into the event facade of the","        `change` event(s) for these attributes.","      @param {Boolean} [options.silent=false] If `true`, no `change` event will","          be fired.","    @chainable","    **/","    set: function (name, value, options) {","        var attributes = {};","","        attributes[name] = value;","","        return this.setAttrs(attributes, options);","    },","","    /**","    TODO: Update description.","","    Sets the values of multiple attributes at once. If model validation fails,","    the attributes will not be set and an `error` event will be fired.","","    @example","        model.setAttrs({","            foo: 'bar',","            baz: 'quux'","        });","","    @method setAttrs","    @param {Object} attributes Hash of attribute names and values to set.","    @param {Object} [options] Data to be mixed into the event facade of the","        `change` event(s) for these attributes.","      @param {Boolean} [options.silent=false] If `true`, no `change` event will","          be fired.","    @chainable","    **/","    setAttrs: function (attributes, options) {","        var idAttribute = this.idAttribute,","            changed, e, key, lastChange, transaction;","","        options || (options = {});","        transaction = options._transaction = {};","","        // When a custom id attribute is in use, always keep the default `id`","        // attribute in sync.","        if (idAttribute !== 'id') {","            // So we don't modify someone else's object.","            attributes = Y.merge(attributes);","","            if (YObject.owns(attributes, idAttribute)) {","                attributes.id = attributes[idAttribute];","            } else if (YObject.owns(attributes, 'id')) {","                attributes[idAttribute] = attributes.id;","            }","        }","","        for (key in attributes) {","            if (YObject.owns(attributes, key)) {","                this._setAttr(key, attributes[key], options);","            }","        }","","        this._processAttrsTransaction(transaction, options);","","        return this;","    },","","    /**","    Override this method to provide a custom persistence implementation for this","    model. The default just calls the callback without actually doing anything.","","    This method is called internally by `load()`, `save()`, and `destroy()`.","","    @method sync","    @param {String} action Sync action to perform. May be one of the following:","","      * `create`: Store a newly-created model for the first time.","      * `delete`: Delete an existing model.","      * `read`  : Load an existing model.","      * `update`: Update an existing model.","","    @param {Object} [options] Sync options. It's up to the custom sync","      implementation to determine what options it supports or requires, if any.","    @param {Function} [callback] Called when the sync operation finishes.","      @param {Error|null} callback.err If an error occurred, this parameter will","        contain the error. If the sync operation succeeded, _err_ will be","        falsy.","      @param {Any} [callback.response] The server's response.","    **/","    sync: function (/* action, options, callback */) {","        var callback = YArray(arguments, 0, true).pop();","","        if (typeof callback === 'function') {","            callback();","        }","    },","","    /**","    Returns a copy of this model's attributes that can be passed to","    `Y.JSON.stringify()` or used for other nefarious purposes.","","    The `clientId` attribute is not included in the returned object.","","    If you've specified a custom attribute name in the `idAttribute` property,","    the default `id` attribute will not be included in the returned object.","","    Note: The ECMAScript 5 specification states that objects may implement a","    `toJSON` method to provide an alternate object representation to serialize","    when passed to `JSON.stringify(obj)`.  This allows class instances to be","    serialized as if they were plain objects.  This is why Model's `toJSON`","    returns an object, not a JSON string.","","    See <http://es5.github.com/#x15.12.3> for details.","","    @method toJSON","    @return {Object} Copy of this model's attributes.","    **/","    toJSON: function () {","        var attrs = this.getAttrs();","","        delete attrs.clientId;","        delete attrs.destroyed;","        delete attrs.initialized;","","        if (this.idAttribute !== 'id') {","            delete attrs.id;","        }","","        return attrs;","    },","","    /**","    Reverts the last change to the model.","","    If an _attrNames_ array is provided, then only the named attributes will be","    reverted (and only if they were modified in the previous change). If no","    _attrNames_ array is provided, then all changed attributes will be reverted","    to their previous values.","","    Note that only one level of undo is available: from the current state to the","    previous state. If `undo()` is called when no previous state is available,","    it will simply do nothing.","","    @method undo","    @param {Array} [attrNames] Array of specific attribute names to revert. If","      not specified, all attributes modified in the last change will be","      reverted.","    @param {Object} [options] Data to be mixed into the event facade of the","        change event(s) for these attributes.","      @param {Boolean} [options.silent=false] If `true`, no `change` event will","          be fired.","    @chainable","    **/","    undo: function (attrNames, options) {","        var lastChange  = this.lastChange,","            idAttribute = this.idAttribute,","            toUndo      = {},","            needUndo;","","        attrNames || (attrNames = YObject.keys(lastChange));","","        YArray.each(attrNames, function (name) {","            if (YObject.owns(lastChange, name)) {","                // Don't generate a double change for custom id attributes.","                name = name === idAttribute ? 'id' : name;","","                needUndo     = true;","                toUndo[name] = lastChange[name].prevVal;","            }","        });","","        return needUndo ? this.setAttrs(toUndo, options) : this;","    },","","    /**","    Override this method to provide custom validation logic for this model.","","    While attribute-specific validators can be used to validate individual","    attributes, this method gives you a hook to validate a hash of all","    attributes before the model is saved. This method is called automatically","    before `save()` takes any action. If validation fails, the `save()` call","    will be aborted.","","    In your validation method, call the provided `callback` function with no","    arguments to indicate success. To indicate failure, pass a single argument,","    which may contain an error message, an array of error messages, or any other","    value. This value will be passed along to the `error` event.","","    @example","","        model.validate = function (attrs, callback) {","            if (attrs.pie !== true) {","                // No pie?! Invalid!","                callback('Must provide pie.');","                return;","            }","","            // Success!","            callback();","        };","","    @method validate","    @param {Object} attrs Attribute hash containing all model attributes to","        be validated.","    @param {Function} callback Validation callback. Call this function when your","        validation logic finishes. To trigger a validation failure, pass any","        value as the first argument to the callback (ideally a meaningful","        validation error of some kind).","","        @param {Any} [callback.err] Validation error. Don't provide this","            argument if validation succeeds. If validation fails, set this to an","            error message or some other meaningful value. It will be passed","            along to the resulting `error` event.","    **/","    validate: function (attrs, callback) {","        if (callback) {","            callback();","        }","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Duckpunches the `addAttr` method provided by `Y.Attribute` to keep the","    `id` attribute’s value and a custom id attribute’s (if provided) value","    in sync when adding the attributes to the model instance object.","","    Marked as protected to hide it from Model's public API docs, even though","    this is a public method in Attribute.","","    @method addAttr","    @param {String} name The name of the attribute.","    @param {Object} config An object with attribute configuration property/value","      pairs, specifying the configuration for the attribute.","    @param {Boolean} lazy (optional) Whether or not to add this attribute lazily","      (on the first call to get/set).","    @return {Object} A reference to the host object.","    @chainable","    @protected","    **/","    addAttr: function (name, config, lazy) {","        var idAttribute = this.idAttribute,","            idAttrCfg, id;","","        if (idAttribute && name === idAttribute) {","            idAttrCfg = this._isLazyAttr('id') || this._getAttrCfg('id');","            id        = config.value === config.defaultValue ? null : config.value;","","            if (!Lang.isValue(id)) {","                // Hunt for the id value.","                id = idAttrCfg.value === idAttrCfg.defaultValue ? null : idAttrCfg.value;","","                if (!Lang.isValue(id)) {","                    // No id value provided on construction, check defaults.","                    id = Lang.isValue(config.defaultValue) ?","                        config.defaultValue :","                        idAttrCfg.defaultValue;","                }","            }","","            config.value = id;","","            // Make sure `id` is in sync.","            if (idAttrCfg.value !== id) {","                idAttrCfg.value = id;","","                if (this._isLazyAttr('id')) {","                    this._state.add('id', 'lazy', idAttrCfg);","                } else {","                    this._state.add('id', 'value', id);","                }","            }","        }","","        return ModelBase.superclass.addAttr.apply(this, arguments);","    },","","    // TODO: Document `_destroy()` method.","    _destroy: function (options, callback) {","        var self = this;","","        // Allow callback as only arg.","        if (typeof options === 'function') {","            callback = options;","            options  = null;","        }","","        function finish(err) {","            if (!err) {","                YArray.each(self.lists.concat(), function (list) {","                    list.remove(self, options);","                });","            }","","            if (callback) {","                callback.apply(null, arguments);","            }","        }","","        if (options && (options.remove || options['delete'])) {","            self.sync('delete', options, finish);","        } else {","            finish();","        }","    },","","    /**","    Calls the public, overrideable `parse()` method and returns the result.","","    Override this method to provide a custom pre-parsing implementation. This","    provides a hook for custom persistence implementations to \"prep\" a response","    before calling the `parse()` method.","","    @method _parse","    @param {Any} response Server response.","    @return {Object} Attribute hash.","    @protected","    @see Model.parse()","    @since 3.7.0","    **/","    _parse: function (response) {","        return this.parse(response);","    },","","    // TODO: Document method.","    // TODO: Think if this is a good name.","    _processAttrsTransaction: function (transaction, options) {","        var changed, e, key, lastChange;","","        if (!YObject.isEmpty(transaction)) {","            changed    = this.changed;","            lastChange = this.lastChange = {};","","            for (key in transaction) {","                if (YObject.owns(transaction, key)) {","                    e = transaction[key];","","                    changed[key] = e.newVal;","","                    lastChange[key] = {","                        newVal : e.newVal,","                        prevVal: e.prevVal,","                        src    : e.src || null","                    };","                }","            }","        }","    },","","    // TODO: Document method.","    // TODO: Think if this is a good name.","    _handleRead: function (err, response, options, callback) {","        var parsed;","","        if (!err) {","            parsed = this._parse(response);","            this.setAttrs(parsed, options);","            this.changed = {};","        }","","        if (callback) {","            callback(err, response);","        }","    },","","    // TODO: Document method.","    // TODO: Think if this is a good name.","    _handleSave: function (err, response, options, callback) {","        var parsed;","","        if (!err) {","            if (response) {","                parsed = this._parse(response);","                this.setAttrs(parsed, options);","            }","","            this.changed = {};","        }","","        if (callback) {","            callback(err, response);","        }","    },","","    /**","    TODO: Update method description.","","    Calls the public, overridable `validate()` method and fires an `error` event","    if validation fails.","","    @method _validate","    @param {Object} attributes Attribute hash.","    @param {Function} callback Validation callback.","        @param {Any} [callback.err] Value on failure, non-value on success.","    @protected","    **/","    _validate: function (attributes, callback) {","        this.validate(attributes, function (err) {","            if (Lang.isValue(err)) {","                callback(err);","            } else {","                callback();","            }","        });","    }","}, {","    // TODO: Should this be `modelBase`?","    NAME: 'model',","","    ATTRS: {","        /**","        A client-only identifier for this model.","","        Like the `id` attribute, `clientId` may be used to retrieve model","        instances from lists. Unlike the `id` attribute, `clientId` is","        automatically generated, and is only intended to be used on the client","        during the current pageview.","","        @attribute clientId","        @type String","        @readOnly","        **/","        clientId: {","            valueFn : 'generateClientId',","            readOnly: true","        },","","        /**","        A unique identifier for this model. Among other things, this id may be","        used to retrieve model instances from lists, so it should be unique.","","        If the id is empty, this model instance is assumed to represent a new","        item that hasn't yet been saved.","","        If you would prefer to use a custom attribute as this model's id instead","        of using the `id` attribute (for example, maybe you'd rather use `_id`","        or `uid` as the primary id), you may set the `idAttribute` property to","        the name of your custom id attribute. The `id` attribute will then","        act as an alias for your custom attribute.","","        @attribute id","        @type String|Number|null","        @default `null`","        **/","        id: {value: null}","    }","});","","// Mix-in AttributeExtras' prototype.","Y.mix(Y.Model.Base, AttributeExtras, false, null, 1);","","","}, '@VERSION@', {\"requires\": [\"attribute-extras\", \"base-core\", \"escape\", \"json-parse\"]});"];
_yuitest_coverage["build/model-base/model-base.js"].lines = {"1":0,"14":0,"37":0,"38":0,"39":0,"42":0,"144":0,"145":0,"146":0,"177":0,"178":0,"190":0,"191":0,"234":0,"235":0,"248":0,"249":0,"264":0,"280":0,"310":0,"313":0,"314":0,"315":0,"318":0,"320":0,"321":0,"324":0,"345":0,"346":0,"347":0,"349":0,"353":0,"384":0,"387":0,"388":0,"389":0,"392":0,"394":0,"395":0,"397":0,"398":0,"399":0,"402":0,"405":0,"407":0,"408":0,"412":0,"434":0,"436":0,"438":0,"462":0,"465":0,"466":0,"470":0,"472":0,"474":0,"475":0,"476":0,"477":0,"481":0,"482":0,"483":0,"487":0,"489":0,"515":0,"517":0,"518":0,"543":0,"545":0,"546":0,"547":0,"549":0,"550":0,"553":0,"579":0,"584":0,"586":0,"587":0,"589":0,"591":0,"592":0,"596":0,"640":0,"641":0,"666":0,"669":0,"670":0,"671":0,"673":0,"675":0,"677":0,"679":0,"685":0,"688":0,"689":0,"691":0,"692":0,"694":0,"699":0,"704":0,"707":0,"708":0,"709":0,"712":0,"713":0,"714":0,"715":0,"719":0,"720":0,"724":0,"725":0,"727":0,"746":0,"752":0,"754":0,"755":0,"756":0,"758":0,"759":0,"760":0,"762":0,"764":0,"777":0,"779":0,"780":0,"781":0,"782":0,"785":0,"786":0,"793":0,"795":0,"796":0,"797":0,"798":0,"801":0,"804":0,"805":0,"822":0,"823":0,"824":0,"826":0,"874":0};
_yuitest_coverage["build/model-base/model-base.js"].functions = {"ModelBase:37":0,"initializer:143":0,"destroy:176":0,"generateClientId:189":0,"getAsHTML:233":0,"getAsURL:247":0,"isModified:263":0,"isNew:279":0,"(anonymous 2):320":0,"load:309":0,"parse:344":0,"(anonymous 4):407":0,"(anonymous 3):394":0,"save:383":0,"set:433":0,"setAttrs:461":0,"sync:514":0,"toJSON:542":0,"(anonymous 5):586":0,"undo:578":0,"validate:639":0,"addAttr:665":0,"(anonymous 6):714":0,"finish:712":0,"_destroy:703":0,"_parse:745":0,"_processAttrsTransaction:751":0,"_handleRead:776":0,"_handleSave:792":0,"(anonymous 7):822":0,"_validate:821":0,"(anonymous 1):1":0};
_yuitest_coverage["build/model-base/model-base.js"].coveredLines = 142;
_yuitest_coverage["build/model-base/model-base.js"].coveredFunctions = 32;
_yuitest_coverline("build/model-base/model-base.js", 1);
YUI.add('model-base', function (Y, NAME) {

/**
TODO: Update description.

Attribute-based data model with APIs for getting, setting, validating, and
syncing attribute values, as well as events for being notified of model changes.

@module app
@submodule model-base
@since 3.8.0
**/

_yuitest_coverfunc("build/model-base/model-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/model-base/model-base.js", 14);
var GlobalEnv = YUI.namespace('Env.Model'),

    AttributeExtras = Y.AttributeExtras,
    Lang            = Y.Lang,
    YArray          = Y.Array,
    YObject         = Y.Object;

/**
TODO: Update description.

Attribute-based data model with APIs for getting, setting, validating, and
syncing attribute values, as well as events for being notified of model changes.

In most cases, you'll want to create your own subclass of `Y.Model` and
customize it to meet your needs. In particular, the `sync()` and `validate()`
methods are meant to be overridden by custom implementations. You may also want
to override the `parse()` method to parse non-generic server responses.

@class Model.Base
@constructor
@extends BaseCore
@since 3.8.0
**/
_yuitest_coverline("build/model-base/model-base.js", 37);
function ModelBase() {
    _yuitest_coverfunc("build/model-base/model-base.js", "ModelBase", 37);
_yuitest_coverline("build/model-base/model-base.js", 38);
ModelBase.superclass.constructor.apply(this, arguments);
    _yuitest_coverline("build/model-base/model-base.js", 39);
AttributeExtras.apply(this, arguments);
}

_yuitest_coverline("build/model-base/model-base.js", 42);
Y.namespace('Model').Base = Y.extend(ModelBase, Y.BaseCore, {
    // -- Public Properties ----------------------------------------------------

    /**
    Hash of attributes that have changed since the last time this model was
    saved.

    @property changed
    @type Object
    @default {}
    **/

    /**
    Name of the attribute to use as the unique id (or primary key) for this
    model.

    The default is `id`, but if your persistence layer uses a different name for
    the primary key (such as `_id` or `uid`), you can specify that here.

    The built-in `id` attribute will always be an alias for whatever attribute
    name you specify here, so getting and setting `id` will always behave the
    same as getting and setting your custom id attribute.

    @property idAttribute
    @type String
    @default `'id'`
    **/
    idAttribute: 'id',

    /**
    Hash of attributes that were changed in the last `change` event. Each item
    in this hash is an object with the following properties:

      * `newVal`: The new value of the attribute after it changed.
      * `prevVal`: The old value of the attribute before it changed.
      * `src`: The source of the change, or `null` if no source was specified.

    @property lastChange
    @type Object
    @default {}
    **/

    /**
    Array of `ModelList` instances that contain this model.

    When a model is in one or more lists, the model's events will bubble up to
    those lists. You can subscribe to a model event on a list to be notified
    when any model in the list fires that event.

    This property is updated automatically when this model is added to or
    removed from a `ModelList` instance. You shouldn't alter it manually. When
    working with models in a list, you should always add and remove models using
    the list's `add()` and `remove()` methods.

    @example Subscribing to model events on a list:

        // Assuming `list` is an existing Y.ModelList instance.
        list.on('*:change', function (e) {
            // This function will be called whenever any model in the list
            // fires a `change` event.
            //
            // `e.target` will refer to the model instance that fired the
            // event.
        });

    @property lists
    @type ModelList[]
    @default `[]`
    **/

    // -- Protected Properties -------------------------------------------------

    /**
    This tells `Y.Base` that it should create ad-hoc attributes for config
    properties passed to Model's constructor. This makes it possible to
    instantiate a model and set a bunch of attributes without having to subclass
    `Y.Model` and declare all those attributes first.

    @property _allowAdHocAttrs
    @type Boolean
    @default true
    @protected
    @since 3.5.0
    **/
    _allowAdHocAttrs: true,

    /**
    Total hack to allow us to identify Model instances without using
    `instanceof`, which won't work when the instance was created in another
    window or YUI sandbox.

    @property _isYUIModel
    @type Boolean
    @default true
    @protected
    @since 3.5.0
    **/
    _isYUIModel: true,

    // -- Lifecycle Methods ----------------------------------------------------

    initializer: function (config) {
        _yuitest_coverfunc("build/model-base/model-base.js", "initializer", 143);
_yuitest_coverline("build/model-base/model-base.js", 144);
this.changed    = {};
        _yuitest_coverline("build/model-base/model-base.js", 145);
this.lastChange = {};
        _yuitest_coverline("build/model-base/model-base.js", 146);
this.lists      = [];
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Destroys this model instance and removes it from its containing lists, if
    any.

    The _callback_, if one is provided, will be called after the model is
    destroyed.

    If `options.remove` is `true`, then this method delegates to the `sync()`
    method to delete the model from the persistence layer, which is an
    asynchronous action. In this case, the _callback_ (if provided) will be
    called after the sync layer indicates success or failure of the delete
    operation.

    @method destroy
    @param {Object} [options] Sync options. It's up to the custom sync
        implementation to determine what options it supports or requires, if
        any.
      @param {Boolean} [options.remove=false] If `true`, the model will be
        deleted via the sync layer in addition to the instance being destroyed.
    @param {callback} [callback] Called after the model has been destroyed (and
        deleted via the sync layer if `options.remove` is `true`).
      @param {Error|null} callback.err If an error occurred, this parameter will
        contain the error. Otherwise _err_ will be `null`.
    @chainable
    **/
    destroy: function (options, callback) {
        _yuitest_coverfunc("build/model-base/model-base.js", "destroy", 176);
_yuitest_coverline("build/model-base/model-base.js", 177);
this._destroy(options, callback);
        _yuitest_coverline("build/model-base/model-base.js", 178);
return ModelBase.superclass.destroy.call(this);
    },

    /**
    Returns a clientId string that's unique among all models on the current page
    (even models in other YUI instances). Uniqueness across pageviews is
    unlikely.

    @method generateClientId
    @return {String} Unique clientId.
    **/
    generateClientId: function () {
        _yuitest_coverfunc("build/model-base/model-base.js", "generateClientId", 189);
_yuitest_coverline("build/model-base/model-base.js", 190);
GlobalEnv.lastId || (GlobalEnv.lastId = 0);
        _yuitest_coverline("build/model-base/model-base.js", 191);
return this.constructor.NAME + '_' + (GlobalEnv.lastId += 1);
    },

    /**
    Returns the value of the specified attribute.

    If the attribute's value is an object, _name_ may use dot notation to
    specify the path to a specific property within the object, and the value of
    that property will be returned.

    @example
        // Set the 'foo' attribute to an object.
        myModel.set('foo', {
            bar: {
                baz: 'quux'
            }
        });

        // Get the value of 'foo'.
        myModel.get('foo');
        // => {bar: {baz: 'quux'}}

        // Get the value of 'foo.bar.baz'.
        myModel.get('foo.bar.baz');
        // => 'quux'

    @method get
    @param {String} name Attribute name or object property path.
    @return {Any} Attribute value, or `undefined` if the attribute doesn't
      exist.
    **/

    // get() is defined by Y.Attribute.

    /**
    Returns an HTML-escaped version of the value of the specified string
    attribute. The value is escaped using `Y.Escape.html()`.

    @method getAsHTML
    @param {String} name Attribute name or object property path.
    @return {String} HTML-escaped attribute value.
    **/
    getAsHTML: function (name) {
        _yuitest_coverfunc("build/model-base/model-base.js", "getAsHTML", 233);
_yuitest_coverline("build/model-base/model-base.js", 234);
var value = this.get(name);
        _yuitest_coverline("build/model-base/model-base.js", 235);
return Y.Escape.html(Lang.isValue(value) ? String(value) : '');
    },

    /**
    Returns a URL-encoded version of the value of the specified string
    attribute. The value is encoded using the native `encodeURIComponent()`
    function.

    @method getAsURL
    @param {String} name Attribute name or object property path.
    @return {String} URL-encoded attribute value.
    **/
    getAsURL: function (name) {
        _yuitest_coverfunc("build/model-base/model-base.js", "getAsURL", 247);
_yuitest_coverline("build/model-base/model-base.js", 248);
var value = this.get(name);
        _yuitest_coverline("build/model-base/model-base.js", 249);
return encodeURIComponent(Lang.isValue(value) ? String(value) : '');
    },

    /**
    Returns `true` if any attribute of this model has been changed since the
    model was last saved.

    New models (models for which `isNew()` returns `true`) are implicitly
    considered to be "modified" until the first time they're saved.

    @method isModified
    @return {Boolean} `true` if this model has changed since it was last saved,
      `false` otherwise.
    **/
    isModified: function () {
        _yuitest_coverfunc("build/model-base/model-base.js", "isModified", 263);
_yuitest_coverline("build/model-base/model-base.js", 264);
return this.isNew() || !YObject.isEmpty(this.changed);
    },

    /**
    Returns `true` if this model is "new", meaning it hasn't been saved since it
    was created.

    Newness is determined by checking whether the model's `id` attribute has
    been set. An empty id is assumed to indicate a new model, whereas a
    non-empty id indicates a model that was either loaded or has been saved
    since it was created.

    @method isNew
    @return {Boolean} `true` if this model is new, `false` otherwise.
    **/
    isNew: function () {
        _yuitest_coverfunc("build/model-base/model-base.js", "isNew", 279);
_yuitest_coverline("build/model-base/model-base.js", 280);
return !Lang.isValue(this.get('id'));
    },

    /**
    Loads this model from the server.

    This method delegates to the `sync()` method to perform the actual load
    operation, which is an asynchronous action. Specify a _callback_ function to
    be notified of success or failure.

    A successful load operation will fire a `load` event, while an unsuccessful
    load operation will fire an `error` event with the `src` value "load".

    If the load operation succeeds and one or more of the loaded attributes
    differ from this model's current attributes, a `change` event will be fired.

    @method load
    @param {Object} [options] Options to be passed to `sync()` and to `set()`
      when setting the loaded attributes. It's up to the custom sync
      implementation to determine what options it supports or requires, if any.
    @param {callback} [callback] Called when the sync operation finishes.
      @param {Error|null} callback.err If an error occurred, this parameter will
        contain the error. If the sync operation succeeded, _err_ will be
        `null`.
      @param {Any} callback.response The server's response. This value will
        be passed to the `parse()` method, which is expected to parse it and
        return an attribute hash.
    @chainable
    **/
    load: function (options, callback) {
        _yuitest_coverfunc("build/model-base/model-base.js", "load", 309);
_yuitest_coverline("build/model-base/model-base.js", 310);
var self = this;

        // Allow callback as only arg.
        _yuitest_coverline("build/model-base/model-base.js", 313);
if (typeof options === 'function') {
            _yuitest_coverline("build/model-base/model-base.js", 314);
callback = options;
            _yuitest_coverline("build/model-base/model-base.js", 315);
options  = {};
        }

        _yuitest_coverline("build/model-base/model-base.js", 318);
options || (options = {});

        _yuitest_coverline("build/model-base/model-base.js", 320);
self.sync('read', options, function (err, response) {
            _yuitest_coverfunc("build/model-base/model-base.js", "(anonymous 2)", 320);
_yuitest_coverline("build/model-base/model-base.js", 321);
self._handleRead(err, response, options, callback);
        });

        _yuitest_coverline("build/model-base/model-base.js", 324);
return self;
    },

    /**
    Called to parse the _response_ when the model is loaded from the server.
    This method receives a server _response_ and is expected to return an
    attribute hash.

    The default implementation assumes that _response_ is either an attribute
    hash or a JSON string that can be parsed into an attribute hash. If
    _response_ is a JSON string and either `Y.JSON` or the native `JSON` object
    are available, it will be parsed automatically. If a parse error occurs, an
    `error` event will be fired and the model will not be updated.

    You may override this method to implement custom parsing logic if necessary.

    @method parse
    @param {Any} response Server response.
    @return {Object} Attribute hash.
    **/
    parse: function (response) {
        _yuitest_coverfunc("build/model-base/model-base.js", "parse", 344);
_yuitest_coverline("build/model-base/model-base.js", 345);
if (typeof response === 'string') {
            _yuitest_coverline("build/model-base/model-base.js", 346);
try {
                _yuitest_coverline("build/model-base/model-base.js", 347);
return Y.JSON.parse(response);
            } catch (ex) {
                _yuitest_coverline("build/model-base/model-base.js", 349);
return null;
            }
        }

        _yuitest_coverline("build/model-base/model-base.js", 353);
return response;
    },

    /**
    Saves this model to the server.

    This method delegates to the `sync()` method to perform the actual save
    operation, which is an asynchronous action. Specify a _callback_ function to
    be notified of success or failure.

    A successful save operation will fire a `save` event, while an unsuccessful
    save operation will fire an `error` event with the `src` value "save".

    If the save operation succeeds and one or more of the attributes returned in
    the server's response differ from this model's current attributes, a
    `change` event will be fired.

    @method save
    @param {Object} [options] Options to be passed to `sync()` and to `set()`
      when setting synced attributes. It's up to the custom sync implementation
      to determine what options it supports or requires, if any.
    @param {Function} [callback] Called when the sync operation finishes.
      @param {Error|null} callback.err If an error occurred or validation
        failed, this parameter will contain the error. If the sync operation
        succeeded, _err_ will be `null`.
      @param {Any} callback.response The server's response. This value will
        be passed to the `parse()` method, which is expected to parse it and
        return an attribute hash.
    @chainable
    **/
    save: function (options, callback) {
        _yuitest_coverfunc("build/model-base/model-base.js", "save", 383);
_yuitest_coverline("build/model-base/model-base.js", 384);
var self = this;

        // Allow callback as only arg.
        _yuitest_coverline("build/model-base/model-base.js", 387);
if (typeof options === 'function') {
            _yuitest_coverline("build/model-base/model-base.js", 388);
callback = options;
            _yuitest_coverline("build/model-base/model-base.js", 389);
options  = {};
        }

        _yuitest_coverline("build/model-base/model-base.js", 392);
options || (options = {});

        _yuitest_coverline("build/model-base/model-base.js", 394);
self._validate(self.toJSON(), function (err) {
            _yuitest_coverfunc("build/model-base/model-base.js", "(anonymous 3)", 394);
_yuitest_coverline("build/model-base/model-base.js", 395);
var action;

            _yuitest_coverline("build/model-base/model-base.js", 397);
if (err) {
                _yuitest_coverline("build/model-base/model-base.js", 398);
if (callback) {
                    _yuitest_coverline("build/model-base/model-base.js", 399);
callback.call(null, err);
                }

                _yuitest_coverline("build/model-base/model-base.js", 402);
return;
            }

            _yuitest_coverline("build/model-base/model-base.js", 405);
action = self.isNew() ? 'create' : 'update';

            _yuitest_coverline("build/model-base/model-base.js", 407);
self.sync(action, options, function (err, response) {
                _yuitest_coverfunc("build/model-base/model-base.js", "(anonymous 4)", 407);
_yuitest_coverline("build/model-base/model-base.js", 408);
self._handleSave(err, response, options, callback);
            });
        });

        _yuitest_coverline("build/model-base/model-base.js", 412);
return self;
    },

    /**
    Sets the value of a single attribute. If model validation fails, the
    attribute will not be set and an `error` event will be fired.

    Use `setAttrs()` to set multiple attributes at once.

    @example
        model.set('foo', 'bar');

    @method set
    @param {String} name Attribute name or object property path.
    @param {any} value Value to set.
    @param {Object} [options] Data to be mixed into the event facade of the
        `change` event(s) for these attributes.
      @param {Boolean} [options.silent=false] If `true`, no `change` event will
          be fired.
    @chainable
    **/
    set: function (name, value, options) {
        _yuitest_coverfunc("build/model-base/model-base.js", "set", 433);
_yuitest_coverline("build/model-base/model-base.js", 434);
var attributes = {};

        _yuitest_coverline("build/model-base/model-base.js", 436);
attributes[name] = value;

        _yuitest_coverline("build/model-base/model-base.js", 438);
return this.setAttrs(attributes, options);
    },

    /**
    TODO: Update description.

    Sets the values of multiple attributes at once. If model validation fails,
    the attributes will not be set and an `error` event will be fired.

    @example
        model.setAttrs({
            foo: 'bar',
            baz: 'quux'
        });

    @method setAttrs
    @param {Object} attributes Hash of attribute names and values to set.
    @param {Object} [options] Data to be mixed into the event facade of the
        `change` event(s) for these attributes.
      @param {Boolean} [options.silent=false] If `true`, no `change` event will
          be fired.
    @chainable
    **/
    setAttrs: function (attributes, options) {
        _yuitest_coverfunc("build/model-base/model-base.js", "setAttrs", 461);
_yuitest_coverline("build/model-base/model-base.js", 462);
var idAttribute = this.idAttribute,
            changed, e, key, lastChange, transaction;

        _yuitest_coverline("build/model-base/model-base.js", 465);
options || (options = {});
        _yuitest_coverline("build/model-base/model-base.js", 466);
transaction = options._transaction = {};

        // When a custom id attribute is in use, always keep the default `id`
        // attribute in sync.
        _yuitest_coverline("build/model-base/model-base.js", 470);
if (idAttribute !== 'id') {
            // So we don't modify someone else's object.
            _yuitest_coverline("build/model-base/model-base.js", 472);
attributes = Y.merge(attributes);

            _yuitest_coverline("build/model-base/model-base.js", 474);
if (YObject.owns(attributes, idAttribute)) {
                _yuitest_coverline("build/model-base/model-base.js", 475);
attributes.id = attributes[idAttribute];
            } else {_yuitest_coverline("build/model-base/model-base.js", 476);
if (YObject.owns(attributes, 'id')) {
                _yuitest_coverline("build/model-base/model-base.js", 477);
attributes[idAttribute] = attributes.id;
            }}
        }

        _yuitest_coverline("build/model-base/model-base.js", 481);
for (key in attributes) {
            _yuitest_coverline("build/model-base/model-base.js", 482);
if (YObject.owns(attributes, key)) {
                _yuitest_coverline("build/model-base/model-base.js", 483);
this._setAttr(key, attributes[key], options);
            }
        }

        _yuitest_coverline("build/model-base/model-base.js", 487);
this._processAttrsTransaction(transaction, options);

        _yuitest_coverline("build/model-base/model-base.js", 489);
return this;
    },

    /**
    Override this method to provide a custom persistence implementation for this
    model. The default just calls the callback without actually doing anything.

    This method is called internally by `load()`, `save()`, and `destroy()`.

    @method sync
    @param {String} action Sync action to perform. May be one of the following:

      * `create`: Store a newly-created model for the first time.
      * `delete`: Delete an existing model.
      * `read`  : Load an existing model.
      * `update`: Update an existing model.

    @param {Object} [options] Sync options. It's up to the custom sync
      implementation to determine what options it supports or requires, if any.
    @param {Function} [callback] Called when the sync operation finishes.
      @param {Error|null} callback.err If an error occurred, this parameter will
        contain the error. If the sync operation succeeded, _err_ will be
        falsy.
      @param {Any} [callback.response] The server's response.
    **/
    sync: function (/* action, options, callback */) {
        _yuitest_coverfunc("build/model-base/model-base.js", "sync", 514);
_yuitest_coverline("build/model-base/model-base.js", 515);
var callback = YArray(arguments, 0, true).pop();

        _yuitest_coverline("build/model-base/model-base.js", 517);
if (typeof callback === 'function') {
            _yuitest_coverline("build/model-base/model-base.js", 518);
callback();
        }
    },

    /**
    Returns a copy of this model's attributes that can be passed to
    `Y.JSON.stringify()` or used for other nefarious purposes.

    The `clientId` attribute is not included in the returned object.

    If you've specified a custom attribute name in the `idAttribute` property,
    the default `id` attribute will not be included in the returned object.

    Note: The ECMAScript 5 specification states that objects may implement a
    `toJSON` method to provide an alternate object representation to serialize
    when passed to `JSON.stringify(obj)`.  This allows class instances to be
    serialized as if they were plain objects.  This is why Model's `toJSON`
    returns an object, not a JSON string.

    See <http://es5.github.com/#x15.12.3> for details.

    @method toJSON
    @return {Object} Copy of this model's attributes.
    **/
    toJSON: function () {
        _yuitest_coverfunc("build/model-base/model-base.js", "toJSON", 542);
_yuitest_coverline("build/model-base/model-base.js", 543);
var attrs = this.getAttrs();

        _yuitest_coverline("build/model-base/model-base.js", 545);
delete attrs.clientId;
        _yuitest_coverline("build/model-base/model-base.js", 546);
delete attrs.destroyed;
        _yuitest_coverline("build/model-base/model-base.js", 547);
delete attrs.initialized;

        _yuitest_coverline("build/model-base/model-base.js", 549);
if (this.idAttribute !== 'id') {
            _yuitest_coverline("build/model-base/model-base.js", 550);
delete attrs.id;
        }

        _yuitest_coverline("build/model-base/model-base.js", 553);
return attrs;
    },

    /**
    Reverts the last change to the model.

    If an _attrNames_ array is provided, then only the named attributes will be
    reverted (and only if they were modified in the previous change). If no
    _attrNames_ array is provided, then all changed attributes will be reverted
    to their previous values.

    Note that only one level of undo is available: from the current state to the
    previous state. If `undo()` is called when no previous state is available,
    it will simply do nothing.

    @method undo
    @param {Array} [attrNames] Array of specific attribute names to revert. If
      not specified, all attributes modified in the last change will be
      reverted.
    @param {Object} [options] Data to be mixed into the event facade of the
        change event(s) for these attributes.
      @param {Boolean} [options.silent=false] If `true`, no `change` event will
          be fired.
    @chainable
    **/
    undo: function (attrNames, options) {
        _yuitest_coverfunc("build/model-base/model-base.js", "undo", 578);
_yuitest_coverline("build/model-base/model-base.js", 579);
var lastChange  = this.lastChange,
            idAttribute = this.idAttribute,
            toUndo      = {},
            needUndo;

        _yuitest_coverline("build/model-base/model-base.js", 584);
attrNames || (attrNames = YObject.keys(lastChange));

        _yuitest_coverline("build/model-base/model-base.js", 586);
YArray.each(attrNames, function (name) {
            _yuitest_coverfunc("build/model-base/model-base.js", "(anonymous 5)", 586);
_yuitest_coverline("build/model-base/model-base.js", 587);
if (YObject.owns(lastChange, name)) {
                // Don't generate a double change for custom id attributes.
                _yuitest_coverline("build/model-base/model-base.js", 589);
name = name === idAttribute ? 'id' : name;

                _yuitest_coverline("build/model-base/model-base.js", 591);
needUndo     = true;
                _yuitest_coverline("build/model-base/model-base.js", 592);
toUndo[name] = lastChange[name].prevVal;
            }
        });

        _yuitest_coverline("build/model-base/model-base.js", 596);
return needUndo ? this.setAttrs(toUndo, options) : this;
    },

    /**
    Override this method to provide custom validation logic for this model.

    While attribute-specific validators can be used to validate individual
    attributes, this method gives you a hook to validate a hash of all
    attributes before the model is saved. This method is called automatically
    before `save()` takes any action. If validation fails, the `save()` call
    will be aborted.

    In your validation method, call the provided `callback` function with no
    arguments to indicate success. To indicate failure, pass a single argument,
    which may contain an error message, an array of error messages, or any other
    value. This value will be passed along to the `error` event.

    @example

        model.validate = function (attrs, callback) {
            if (attrs.pie !== true) {
                // No pie?! Invalid!
                callback('Must provide pie.');
                return;
            }

            // Success!
            callback();
        };

    @method validate
    @param {Object} attrs Attribute hash containing all model attributes to
        be validated.
    @param {Function} callback Validation callback. Call this function when your
        validation logic finishes. To trigger a validation failure, pass any
        value as the first argument to the callback (ideally a meaningful
        validation error of some kind).

        @param {Any} [callback.err] Validation error. Don't provide this
            argument if validation succeeds. If validation fails, set this to an
            error message or some other meaningful value. It will be passed
            along to the resulting `error` event.
    **/
    validate: function (attrs, callback) {
        _yuitest_coverfunc("build/model-base/model-base.js", "validate", 639);
_yuitest_coverline("build/model-base/model-base.js", 640);
if (callback) {
            _yuitest_coverline("build/model-base/model-base.js", 641);
callback();
        }
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Duckpunches the `addAttr` method provided by `Y.Attribute` to keep the
    `id` attribute’s value and a custom id attribute’s (if provided) value
    in sync when adding the attributes to the model instance object.

    Marked as protected to hide it from Model's public API docs, even though
    this is a public method in Attribute.

    @method addAttr
    @param {String} name The name of the attribute.
    @param {Object} config An object with attribute configuration property/value
      pairs, specifying the configuration for the attribute.
    @param {Boolean} lazy (optional) Whether or not to add this attribute lazily
      (on the first call to get/set).
    @return {Object} A reference to the host object.
    @chainable
    @protected
    **/
    addAttr: function (name, config, lazy) {
        _yuitest_coverfunc("build/model-base/model-base.js", "addAttr", 665);
_yuitest_coverline("build/model-base/model-base.js", 666);
var idAttribute = this.idAttribute,
            idAttrCfg, id;

        _yuitest_coverline("build/model-base/model-base.js", 669);
if (idAttribute && name === idAttribute) {
            _yuitest_coverline("build/model-base/model-base.js", 670);
idAttrCfg = this._isLazyAttr('id') || this._getAttrCfg('id');
            _yuitest_coverline("build/model-base/model-base.js", 671);
id        = config.value === config.defaultValue ? null : config.value;

            _yuitest_coverline("build/model-base/model-base.js", 673);
if (!Lang.isValue(id)) {
                // Hunt for the id value.
                _yuitest_coverline("build/model-base/model-base.js", 675);
id = idAttrCfg.value === idAttrCfg.defaultValue ? null : idAttrCfg.value;

                _yuitest_coverline("build/model-base/model-base.js", 677);
if (!Lang.isValue(id)) {
                    // No id value provided on construction, check defaults.
                    _yuitest_coverline("build/model-base/model-base.js", 679);
id = Lang.isValue(config.defaultValue) ?
                        config.defaultValue :
                        idAttrCfg.defaultValue;
                }
            }

            _yuitest_coverline("build/model-base/model-base.js", 685);
config.value = id;

            // Make sure `id` is in sync.
            _yuitest_coverline("build/model-base/model-base.js", 688);
if (idAttrCfg.value !== id) {
                _yuitest_coverline("build/model-base/model-base.js", 689);
idAttrCfg.value = id;

                _yuitest_coverline("build/model-base/model-base.js", 691);
if (this._isLazyAttr('id')) {
                    _yuitest_coverline("build/model-base/model-base.js", 692);
this._state.add('id', 'lazy', idAttrCfg);
                } else {
                    _yuitest_coverline("build/model-base/model-base.js", 694);
this._state.add('id', 'value', id);
                }
            }
        }

        _yuitest_coverline("build/model-base/model-base.js", 699);
return ModelBase.superclass.addAttr.apply(this, arguments);
    },

    // TODO: Document `_destroy()` method.
    _destroy: function (options, callback) {
        _yuitest_coverfunc("build/model-base/model-base.js", "_destroy", 703);
_yuitest_coverline("build/model-base/model-base.js", 704);
var self = this;

        // Allow callback as only arg.
        _yuitest_coverline("build/model-base/model-base.js", 707);
if (typeof options === 'function') {
            _yuitest_coverline("build/model-base/model-base.js", 708);
callback = options;
            _yuitest_coverline("build/model-base/model-base.js", 709);
options  = null;
        }

        _yuitest_coverline("build/model-base/model-base.js", 712);
function finish(err) {
            _yuitest_coverfunc("build/model-base/model-base.js", "finish", 712);
_yuitest_coverline("build/model-base/model-base.js", 713);
if (!err) {
                _yuitest_coverline("build/model-base/model-base.js", 714);
YArray.each(self.lists.concat(), function (list) {
                    _yuitest_coverfunc("build/model-base/model-base.js", "(anonymous 6)", 714);
_yuitest_coverline("build/model-base/model-base.js", 715);
list.remove(self, options);
                });
            }

            _yuitest_coverline("build/model-base/model-base.js", 719);
if (callback) {
                _yuitest_coverline("build/model-base/model-base.js", 720);
callback.apply(null, arguments);
            }
        }

        _yuitest_coverline("build/model-base/model-base.js", 724);
if (options && (options.remove || options['delete'])) {
            _yuitest_coverline("build/model-base/model-base.js", 725);
self.sync('delete', options, finish);
        } else {
            _yuitest_coverline("build/model-base/model-base.js", 727);
finish();
        }
    },

    /**
    Calls the public, overrideable `parse()` method and returns the result.

    Override this method to provide a custom pre-parsing implementation. This
    provides a hook for custom persistence implementations to "prep" a response
    before calling the `parse()` method.

    @method _parse
    @param {Any} response Server response.
    @return {Object} Attribute hash.
    @protected
    @see Model.parse()
    @since 3.7.0
    **/
    _parse: function (response) {
        _yuitest_coverfunc("build/model-base/model-base.js", "_parse", 745);
_yuitest_coverline("build/model-base/model-base.js", 746);
return this.parse(response);
    },

    // TODO: Document method.
    // TODO: Think if this is a good name.
    _processAttrsTransaction: function (transaction, options) {
        _yuitest_coverfunc("build/model-base/model-base.js", "_processAttrsTransaction", 751);
_yuitest_coverline("build/model-base/model-base.js", 752);
var changed, e, key, lastChange;

        _yuitest_coverline("build/model-base/model-base.js", 754);
if (!YObject.isEmpty(transaction)) {
            _yuitest_coverline("build/model-base/model-base.js", 755);
changed    = this.changed;
            _yuitest_coverline("build/model-base/model-base.js", 756);
lastChange = this.lastChange = {};

            _yuitest_coverline("build/model-base/model-base.js", 758);
for (key in transaction) {
                _yuitest_coverline("build/model-base/model-base.js", 759);
if (YObject.owns(transaction, key)) {
                    _yuitest_coverline("build/model-base/model-base.js", 760);
e = transaction[key];

                    _yuitest_coverline("build/model-base/model-base.js", 762);
changed[key] = e.newVal;

                    _yuitest_coverline("build/model-base/model-base.js", 764);
lastChange[key] = {
                        newVal : e.newVal,
                        prevVal: e.prevVal,
                        src    : e.src || null
                    };
                }
            }
        }
    },

    // TODO: Document method.
    // TODO: Think if this is a good name.
    _handleRead: function (err, response, options, callback) {
        _yuitest_coverfunc("build/model-base/model-base.js", "_handleRead", 776);
_yuitest_coverline("build/model-base/model-base.js", 777);
var parsed;

        _yuitest_coverline("build/model-base/model-base.js", 779);
if (!err) {
            _yuitest_coverline("build/model-base/model-base.js", 780);
parsed = this._parse(response);
            _yuitest_coverline("build/model-base/model-base.js", 781);
this.setAttrs(parsed, options);
            _yuitest_coverline("build/model-base/model-base.js", 782);
this.changed = {};
        }

        _yuitest_coverline("build/model-base/model-base.js", 785);
if (callback) {
            _yuitest_coverline("build/model-base/model-base.js", 786);
callback(err, response);
        }
    },

    // TODO: Document method.
    // TODO: Think if this is a good name.
    _handleSave: function (err, response, options, callback) {
        _yuitest_coverfunc("build/model-base/model-base.js", "_handleSave", 792);
_yuitest_coverline("build/model-base/model-base.js", 793);
var parsed;

        _yuitest_coverline("build/model-base/model-base.js", 795);
if (!err) {
            _yuitest_coverline("build/model-base/model-base.js", 796);
if (response) {
                _yuitest_coverline("build/model-base/model-base.js", 797);
parsed = this._parse(response);
                _yuitest_coverline("build/model-base/model-base.js", 798);
this.setAttrs(parsed, options);
            }

            _yuitest_coverline("build/model-base/model-base.js", 801);
this.changed = {};
        }

        _yuitest_coverline("build/model-base/model-base.js", 804);
if (callback) {
            _yuitest_coverline("build/model-base/model-base.js", 805);
callback(err, response);
        }
    },

    /**
    TODO: Update method description.

    Calls the public, overridable `validate()` method and fires an `error` event
    if validation fails.

    @method _validate
    @param {Object} attributes Attribute hash.
    @param {Function} callback Validation callback.
        @param {Any} [callback.err] Value on failure, non-value on success.
    @protected
    **/
    _validate: function (attributes, callback) {
        _yuitest_coverfunc("build/model-base/model-base.js", "_validate", 821);
_yuitest_coverline("build/model-base/model-base.js", 822);
this.validate(attributes, function (err) {
            _yuitest_coverfunc("build/model-base/model-base.js", "(anonymous 7)", 822);
_yuitest_coverline("build/model-base/model-base.js", 823);
if (Lang.isValue(err)) {
                _yuitest_coverline("build/model-base/model-base.js", 824);
callback(err);
            } else {
                _yuitest_coverline("build/model-base/model-base.js", 826);
callback();
            }
        });
    }
}, {
    // TODO: Should this be `modelBase`?
    NAME: 'model',

    ATTRS: {
        /**
        A client-only identifier for this model.

        Like the `id` attribute, `clientId` may be used to retrieve model
        instances from lists. Unlike the `id` attribute, `clientId` is
        automatically generated, and is only intended to be used on the client
        during the current pageview.

        @attribute clientId
        @type String
        @readOnly
        **/
        clientId: {
            valueFn : 'generateClientId',
            readOnly: true
        },

        /**
        A unique identifier for this model. Among other things, this id may be
        used to retrieve model instances from lists, so it should be unique.

        If the id is empty, this model instance is assumed to represent a new
        item that hasn't yet been saved.

        If you would prefer to use a custom attribute as this model's id instead
        of using the `id` attribute (for example, maybe you'd rather use `_id`
        or `uid` as the primary id), you may set the `idAttribute` property to
        the name of your custom id attribute. The `id` attribute will then
        act as an alias for your custom attribute.

        @attribute id
        @type String|Number|null
        @default `null`
        **/
        id: {value: null}
    }
});

// Mix-in AttributeExtras' prototype.
_yuitest_coverline("build/model-base/model-base.js", 874);
Y.mix(Y.Model.Base, AttributeExtras, false, null, 1);


}, '@VERSION@', {"requires": ["attribute-extras", "base-core", "escape", "json-parse"]});
