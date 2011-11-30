YUI.add('app-test', function (Y) {

var ArrayAssert  = Y.ArrayAssert,
    Assert       = Y.Assert,
    ObjectAssert = Y.ObjectAssert,

    html5 = Y.Router.html5,

    win = Y.config.win,

    routerSuite,
    modelSuite,
    modelListSuite,
    suite,
    viewSuite;

// -- Global Suite -------------------------------------------------------------
suite = new Y.Test.Suite('App Framework');

// -- Model Suite --------------------------------------------------------------
modelSuite = new Y.Test.Suite('Model');

// -- Model: Lifecycle ---------------------------------------------------------
modelSuite.add(new Y.Test.Case({
    name: 'Lifecycle',

    'destroy() should destroy the model instance': function () {
        var model = new Y.Model();

        model.sync = function () {
            Assert.fail('sync should not be called unless the model is being deleted');
        };

        Assert.isFalse(model.get('destroyed'));
        Assert.areSame(model, model.destroy(), 'destroy() should be chainable');
        Assert.isTrue(model.get('destroyed'));
    },

    'destroy() should call a callback if provided as the only arg': function () {
        var mock  = Y.Mock(),
            model = new Y.Model();

        Y.Mock.expect(mock, {
            method: 'callback',
            args  : []
        });

        model.destroy(mock.callback);
        Y.Mock.verify(mock);
    },

    'destroy() should call a callback if provided as the second arg': function () {
        var mock  = Y.Mock(),
            model = new Y.Model();

        Y.Mock.expect(mock, {
            method: 'callback',
            args  : []
        });

        model.destroy({}, mock.callback);
        Y.Mock.verify(mock);
    },

    'destroy() should delete the model if the `delete` option is truthy': function () {
        var calls   = 0,
            mock    = Y.Mock(),
            model   = new Y.Model();

        Y.Mock.expect(mock, {
            method: 'callback',
            args  : []
        });

        model.sync = function (action, options, callback) {
            calls += 1;

            Assert.areSame('delete', action, 'sync action should be "delete"');
            Assert.isObject(options, 'options should be an object');
            Assert.isTrue(options['delete'], 'options.delete should be true');
            Assert.isFunction(callback, 'callback should be a function');

            callback();
        };

        model.destroy({'delete': true}, mock.callback);
        Y.Mock.verify(mock);
    },

    'destroy() should remove the model from all lists': function () {
        var model     = new Y.Model(),
            listOne   = new Y.ModelList(),
            listTwo   = new Y.ModelList(),
            listThree = new Y.ModelList();

        listOne.add(model);
        listTwo.add(model);
        listThree.add(model);

        Assert.areSame(1, listOne.size(), 'model should be added to list one');
        Assert.areSame(1, listTwo.size(), 'model should be added to list two');
        Assert.areSame(1, listThree.size(), 'model should be added to list three');

        model.destroy();

        Assert.areSame(0, listOne.size(), 'model should be removed from list one');
        Assert.areSame(0, listTwo.size(), 'model should be removed from list two');
        Assert.areSame(0, listThree.size(), 'model should be removed from list three');
    }
}));

// -- Model: Attributes and Properties -----------------------------------------
modelSuite.add(new Y.Test.Case({
    name: 'Attributes and Properties',

    setUp: function () {
        this.TestModel = Y.Base.create('testModel', Y.Model, [], {
            idAttribute: 'customId'
        }, {
            ATTRS: {
                customId: {value: ''},
                foo: {value: ''}
            }
        });
    },

    tearDown: function () {
        delete this.TestModel;
    },

    'Attributes should be settable at instantiation time': function () {
        var model = new this.TestModel({foo: 'foo'});
        Assert.areSame('foo', model.get('foo'));
    },

    'Custom id attribute should be settable at instantiation time': function () {
        var model;

        // We need to set and get the id and customId attributes in various
        // orders to ensure there are no issues due to the attributes being
        // lazily added.

        model = new this.TestModel({customId: 'foo'});
        Assert.areSame('foo', model.get('customId'));
        Assert.areSame('foo', model.get('id'));

        model = new this.TestModel({customId: 'foo'});
        Assert.areSame('foo', model.get('id'));
        Assert.areSame('foo', model.get('customId'));

        model = new this.TestModel({id: 'foo'});
        Assert.areSame('foo', model.get('customId'));
        Assert.areSame('foo', model.get('id'));

        model = new this.TestModel({id: 'foo'});
        Assert.areSame('foo', model.get('id'));
        Assert.areSame('foo', model.get('customId'));
    },

    '`id` attribute should be an alias for the custom id attribute': function () {
        var calls = 0,
            model = new this.TestModel();

        model.on('change', function (e) {
            calls += 1;

            Assert.areSame('foo', e.changed.customId.newVal);
            Assert.areSame('foo', e.changed.id.newVal);
        });

        model.set('id', 'foo');

        Assert.areSame(1, calls);
    },

    '`changed` property should be a hash of attributes that have changed since last save() or load()': function () {
        var model = new this.TestModel();

        Assert.isObject(model.changed);
        ObjectAssert.ownsNoKeys(model.changed);

        model.set('foo', 'foo');
        Assert.areSame('foo', model.changed.foo);

        model.setAttrs({foo: 'bar', bar: 'baz'});
        ObjectAssert.areEqual({foo: 'bar', bar: 'baz'}, model.changed);

        model.save();
        ObjectAssert.ownsNoKeys(model.changed);

        model.set('foo', 'foo');
        model.load();
        ObjectAssert.ownsNoKeys(model.changed);
    },

    'clientId attribute should be automatically generated': function () {
        var model = new Y.Model();

        Assert.isString(model.get('clientId'));
        Assert.isTrue(!!model.get('clientId'));
    },

    '`lastChange` property should contain attributes that changed in the last `change` event': function () {
        var model = new this.TestModel();

        Assert.isObject(model.lastChange);
        ObjectAssert.ownsNoKeys(model.lastChange);

        model.set('foo', 'foo');
        Assert.areSame(1, Y.Object.size(model.lastChange));
        ObjectAssert.ownsKeys(['newVal', 'prevVal', 'src'], model.lastChange.foo);
        Assert.areSame('', model.lastChange.foo.prevVal);
        Assert.areSame('foo', model.lastChange.foo.newVal);
        Assert.isNull(model.lastChange.foo.src);

        model.set('bar', 'bar', {src: 'test'});
        Assert.areSame(1, Y.Object.size(model.lastChange));
        Assert.areSame('test', model.lastChange.bar.src);

        model.set('foo', 'bar', {silent: true});
        Assert.areSame(1, Y.Object.size(model.lastChange));
        Assert.areSame('bar', model.lastChange.foo.newVal);
    },

    '`lists` property should be an array of ModelList instances that contain this model': function () {
        var calls = 0,
            model = new this.TestModel(),

            lists = [
                new Y.ModelList({model: this.TestModel}),
                new Y.ModelList({model: this.TestModel})
            ];

        Assert.isArray(model.lists);

        function onChange() {
            calls += 1;
        }

        lists[0].on('*:change', onChange);
        lists[1].on('*:change', onChange);

        lists[0].add(model);
        lists[1].add(model);

        ArrayAssert.itemsAreSame(lists, model.lists);

        model.set('foo', 'foo');

        Assert.areSame(2, calls);
    }
}));

// -- Model: Methods -----------------------------------------------------------
modelSuite.add(new Y.Test.Case({
    name: 'Methods',

    setUp: function () {
        this.TestModel = Y.Base.create('testModel', Y.Model, [], {}, {
            ATTRS: {
                foo: {value: ''},
                bar: {value: ''}
            }
        });
    },

    tearDown: function () {
        delete this.TestModel;
    },

    'generateClientId() should generate a unique client id': function () {
        var model    = new this.TestModel(),
            firstId  = model.generateClientId(),
            secondId = model.generateClientId();

        Assert.isString(firstId);
        Assert.areNotSame(firstId, secondId);
        Assert.isTrue(firstId.indexOf(this.TestModel.NAME) === 0);
    },

    'getAsHTML() should return an HTML-escaped attribute value': function () {
        var value = '<div id="foo">hello!</div>',
            model = new this.TestModel({foo: value});

        Assert.areSame(Y.Escape.html(value), model.getAsHTML('foo'));
    },

    'getAsURL() should return a URL-encoded attribute value': function () {
        var value = 'foo & bar = baz',
            model = new this.TestModel({foo: value});

        Assert.areSame(encodeURIComponent(value), model.getAsURL('foo'));
    },

    'isModified() should return true if the model is new': function () {
        var model = new this.TestModel();
        Assert.isTrue(model.isModified());

        model = new this.TestModel({id: 'foo'});
        Assert.isFalse(model.isModified());
    },

    'isModified() should return true if the model has changed since it was last saved': function () {
        var model = new this.TestModel({id: 'foo'});
        Assert.isFalse(model.isModified());

        model.set('foo', 'bar');
        Assert.isTrue(model.isModified());

        model.save();
        Assert.isFalse(model.isModified());
    },

    'isNew() should return true if the model is new': function () {
        var model = new this.TestModel();
        Assert.isTrue(model.isNew());

        model = new this.TestModel({id: 'foo'});
        Assert.isFalse(model.isNew());

        model = new this.TestModel({id: 0});
        Assert.isFalse(model.isNew());
    },

    'load() should delegate to sync()': function () {
        var calls = 0,
            model = new this.TestModel(),
            opts  = {};

        model.sync = function (action, options, callback) {
            calls += 1;

            Assert.areSame('read', action);
            Assert.areSame(opts, options);
            Assert.isFunction(callback);

            callback();
        };

        model.load(opts);
        Assert.areSame(1, calls);
    },

    'load() should reset this.changed when loading succeeds': function () {
        var model = new this.TestModel();

        model.set('foo', 'bar');
        Assert.areSame(1, Y.Object.size(model.changed));

        model.load();
        Assert.areSame(0, Y.Object.size(model.changed));
    },

    'load() should be chainable and should call the callback if one was provided': function () {
        var calls = 0,
            model = new this.TestModel();

        Assert.areSame(model, model.load());
        Assert.areSame(model, model.load({}));

        Assert.areSame(model, model.load(function (err) {
            calls += 1;
            Assert.isUndefined(err);
        }));

        Assert.areSame(model, model.load({}, function () {
            calls += 1;
        }));

        Assert.areSame(2, calls);
    },

    'parse() should parse a JSON string and return an object': function () {
        var model    = new this.TestModel(),
            response = model.parse('{"foo": "bar"}');

        Assert.isObject(response);
        Assert.areSame('bar', response.foo);
    },

    'parse() should not try to parse non-strings': function () {
        var model  = new this.TestModel(),
            array  = ['foo', 'bar'],
            object = {foo: 'bar'};

        Assert.areSame(array, model.parse(array));
        Assert.areSame(object, model.parse(object));
    },

    'save() should delegate to sync()': function () {
        var calls = 0,
            model = new this.TestModel(),
            opts  = {};

        model.sync = function (action, options, callback) {
            calls += 1;

            Assert.areSame('create', action);
            Assert.areSame(opts, options);
            Assert.isFunction(callback);

            // Give the model an id so it will no longer be new.
            callback(null, {id: 'foo'});
        };

        model.save(opts);

        Assert.areSame('foo', model.get('id'), "model id should be updated after save");

        model.sync = function (action) {
            calls += 1;
            Assert.areSame('update', action);
        };

        model.save();

        Assert.areSame(2, calls);
    },

    'save() should reset this.changed when saving succeeds': function () {
        var model = new this.TestModel();

        model.set('foo', 'bar');
        Assert.areSame(1, Y.Object.size(model.changed));

        model.save();
        Assert.areSame(0, Y.Object.size(model.changed));
    },

    'save() should be chainable and should call the callback if one was provided': function () {
        var calls = 0,
            model = new this.TestModel();

        Assert.areSame(model, model.save());
        Assert.areSame(model, model.save({}));

        Assert.areSame(model, model.save(function (err) {
            calls += 1;
            Assert.isUndefined(err);
        }));

        Assert.areSame(model, model.save({}, function () {
            calls += 1;
        }));

        Assert.areSame(2, calls);
    },

    'set() should set the value of a single attribute': function () {
        var model = new this.TestModel();

        Assert.areSame('', model.get('foo'));
        Assert.areSame(model, model.set('foo', 'bar'), 'set() should be chainable');
        Assert.areSame('bar', model.get('foo'));
    },

    'setAttrs() should set the values of multiple attributes': function () {
        var model = new this.TestModel();

        Assert.areSame('', model.get('foo'));
        Assert.areSame('', model.get('bar'));
        Assert.areSame(model, model.setAttrs({foo: 'foo', bar: 'bar'}), 'setAttrs() should be chainable');
        Assert.areSame('foo', model.get('foo'));
        Assert.areSame('bar', model.get('bar'));
    },

    'sync() should just call the supplied callback by default': function () {
        var calls = 0,
            model = new this.TestModel();

        model.sync(function (err) {
            calls += 1;
            Assert.isUndefined(err);
        });

        Assert.areSame(1, calls);
    },

    "toJSON() should return a copy of the model's attributes, minus excluded ones": function () {
        var attrs = {id: 'id', foo: 'foo', bar: 'bar'},
            model = new this.TestModel(attrs),
            CustomTestModel, json;

        json = model.toJSON();
        Assert.areSame(3, Y.Object.size(json));
        ObjectAssert.ownsKeys(['id', 'foo', 'bar'], json);
        ObjectAssert.areEqual(attrs, json);

        // When there's a custom id attribute, the 'id' attribute should be
        // excluded.
        CustomTestModel = Y.Base.create('customTestModel', Y.Model, [], {
            idAttribute: 'customId'
        }, {
            ATTRS: {
                customId: {value: ''},
                foo     : {value: ''},
                bar     : {value: ''}
            }
        });

        attrs = {customId: 'id', foo: 'foo', bar: 'bar'};
        model = new CustomTestModel(attrs);
        json  = model.toJSON();

        Assert.areSame(3, Y.Object.size(json));
        ObjectAssert.ownsKeys(['customId', 'foo', 'bar'], json);
        ObjectAssert.areEqual(attrs, json);
    },

    'undo() should revert the previous change to the model': function () {
        var attrs = {id: 'id', foo: 'foo', bar: 'bar'},
            model = new this.TestModel(attrs);

        ObjectAssert.areEqual(attrs, model.toJSON());

        model.setAttrs({foo: 'moo', bar: 'quux'});
        ObjectAssert.areEqual({id: 'id', foo: 'moo', bar: 'quux'}, model.toJSON());

        Assert.areSame(model, model.undo(), 'undo() should be chainable');
        ObjectAssert.areEqual(attrs, model.toJSON());
    },

    'undo() should revert only the specified attributes when attributes are specified': function () {
        var model = new this.TestModel({id: 'id', foo: 'foo', bar: 'bar'});

        model.setAttrs({foo: 'moo', bar: 'quux'});

        model.undo(['foo']);
        ObjectAssert.areEqual({id: 'id', foo: 'foo', bar: 'quux'}, model.toJSON());
    },

    'undo() should pass options to setAttrs()': function () {
        var calls = 0,
            model = new this.TestModel({id: 'id', foo: 'foo', bar: 'bar'});

        model.setAttrs({foo: 'moo', bar: 'quux'});

        model.on('change', function (e) {
            calls += 1;
            Assert.areSame('test', e.changed.foo.src);
        });

        model.undo(null, {src: 'test'});
        Assert.areSame(1, calls);
    },

    'undo() should do nothing when there is no previous change to revert': function () {
        var model = new this.TestModel();

        model.on('change', function () {
            Assert.fail('`change` should not be called');
        });

        model.undo();
    },

    'validate() should only be called on save()': function () {
        var calls = 0,
            model = new this.TestModel();

        model.validate = function (attrs, callback) {
            calls += 1;
            Y.ObjectAssert.areEqual(model.toJSON(), attrs);
            callback();
        };

        model.set('foo', 'bar');
        model.set('foo', 'baz');
        model.save();

        Assert.areSame(1, calls);
    },

    'a validation failure should abort a save() call': function () {
        var calls         = 0,
            errors        = 0,
            model         = new this.TestModel(),
            saveCallbacks = 0;

        model.validate = function (attrs, callback) {
            calls += 1;
            callback('OMG invalid!');
        };

        model.sync = function () {
            Assert.fail('sync() should not be called on validation failure');
        };

        model.on('error', function (e) {
            errors += 1;
            Assert.areSame('OMG invalid!', e.error);
            Assert.areSame('validate', e.src);
        });

        model.save(function (err, res) {
            saveCallbacks += 1;
            Assert.areSame('OMG invalid!', err);
            Assert.isUndefined(res);
        });

        Assert.areSame(1, calls);
        Assert.areSame(1, saveCallbacks);
        Assert.areSame(1, errors);
    },

    'validate() should be backwards compatible with the 3.4.x synchronous style': function () {
        var errors = 0,
            saves  = 0,
            model  = new this.TestModel();

        model.on('error', function (e) {
            errors += 1;

        });

        model.on('save', function (e) {
            saves += 1;
        });

        model.validate = function (attrs) {
            if (attrs.foo !== 'bar') {
                return 'No no no!';
            }
        };

        model.set('foo', 'bar');
        model.save();
        Assert.areSame(0, errors);
        Assert.areSame(1, saves);

        model.set('foo', 'baz');
        model.save();
        Assert.areSame(1, errors);
        Assert.areSame(1, saves);
    }
}));

// -- Model: Events ------------------------------------------------------------
modelSuite.add(new Y.Test.Case({
    name: 'Events',

    setUp: function () {
        this.TestModel = Y.Base.create('testModel', Y.Model, [], {}, {
            ATTRS: {
                foo: {value: ''},
                bar: {value: ''},
                baz: {value: ''}
            }
        });
    },

    tearDown: function () {
        delete this.TestModel;
    },

    '`change` event should contain coalesced attribute changes': function () {
        var calls = 0,
            model = new this.TestModel();

        model.on('change', function (e) {
            calls += 1;

            ObjectAssert.ownsKeys(['foo', 'bar'], e.changed);
            Assert.areSame(2, Y.Object.size(e.changed));
            ObjectAssert.ownsKeys(['newVal', 'prevVal', 'src'], e.changed.foo);
            ObjectAssert.ownsKeys(['newVal', 'prevVal', 'src'], e.changed.bar);
            Assert.areSame('foo', e.changed.foo.newVal);
            Assert.areSame('', e.changed.foo.prevVal);
            Assert.areSame('bar', e.changed.bar.newVal);
            Assert.areSame('', e.changed.bar.prevVal);
            Assert.areSame('test', e.changed.foo.src);
            Assert.areSame('test', e.changed.bar.src);
        });

        model.setAttrs({
            foo: 'foo',
            bar: 'bar'
        }, {src: 'test'});

        Assert.areSame(1, calls);
    },

    '`change` event should not fire when the _silent_ option is truthy': function () {
        var model = new this.TestModel();

        model.on('change', function (e) {
            Assert.fail('`change` should not fire');
        });

        model.set('foo', 'bar', {silent: true});
        model.setAttrs({bar: 'baz'}, {silent: true});
    },

    '`error` event should fire when validation fails': function () {
        var calls = 0,
            model = new this.TestModel();

        model.validate = function (hash, callback) {
            callback('ERROR. ERROR. DOES NOT COMPUTE.');
        };

        model.on('error', function (e) {
            calls += 1;

            Assert.areSame('validate', e.src);
            ObjectAssert.ownsKey('foo', e.attributes);
            Assert.areSame('bar', e.attributes.foo);
            Assert.areSame('ERROR. ERROR. DOES NOT COMPUTE.', e.error);
        });

        model.set('foo', 'bar');
        model.save();

        Assert.areSame(1, calls);
    },

    '`error` event should fire when parsing fails': function () {
        var calls = 0,
            model = new this.TestModel();

        model.on('error', function (e) {
            calls += 1;

            Assert.areSame('parse', e.src);
            Y.assert(e.error instanceof Error);
            Assert.areSame('moo', e.response);
        });

        model.parse('moo');

        Assert.areSame(1, calls);
    },

    '`error` event should fire when a load operation fails': function () {
        var calls = 0,
            model = new this.TestModel();

        model.on('error', function (e) {
            calls += 1;

            Assert.areSame('load', e.src);
            Assert.areSame('foo', e.error);
            Assert.areSame('{"error": true}', e.response);
            Assert.isObject(e.options);
        });

        model.sync = function (action, options, callback) {
            callback('foo', '{"error": true}');
        };

        model.load();

        Assert.areSame(1, calls);
    },

    '`error` event should fire when a save operation fails': function () {
        var calls = 0,
            model = new this.TestModel();

        model.on('error', function (e) {
            calls += 1;

            Assert.areSame('save', e.src);
            Assert.areSame('foo', e.error);
            Assert.areSame('{"error": true}', e.response);
            Assert.isObject(e.options);
        });

        model.sync = function (action, options, callback) {
            callback('foo', '{"error": true}');
        };

        model.save();

        Assert.areSame(1, calls);
    },

    '`load` event should fire after a successful load operation': function () {
        var calls = 0,
            model = new this.TestModel();

        model.on('load', function (e) {
            calls += 1;

            Assert.areSame('{"foo": "bar"}', e.response);
            Assert.isObject(e.options);
            Assert.isObject(e.parsed);
            Assert.areSame('bar', e.parsed.foo);
            Assert.areSame('bar', model.get('foo'), 'load event should fire after attribute changes are applied');
        });

        model.sync = function (action, options, callback) {
            callback(null, '{"foo": "bar"}');
        };

        model.load(function () {
            Assert.areSame(1, calls, 'load event should fire before the callback runs');
        });

        Assert.areSame(1, calls, 'load event never fired');
    },

    '`save` event should fire after a successful save operation': function () {
        var calls = 0,
            model = new this.TestModel();

        model.on('save', function (e) {
            calls += 1;

            Assert.areSame('{"foo": "bar"}', e.response);
            Assert.isObject(e.options);
            Assert.isObject(e.parsed);
            Assert.areSame('bar', e.parsed.foo);
            Assert.areSame('bar', model.get('foo'), 'save event should fire after attribute changes are applied');
        });

        model.sync = function (action, options, callback) {
            callback(null, '{"foo": "bar"}');
        };

        model.save(function () {
            Assert.areSame(1, calls, 'save event should fire before the callback runs');
        });

        Assert.areSame(1, calls, 'save event never fired');
    }
}));

// -- ModelList Suite ----------------------------------------------------------
modelListSuite = new Y.Test.Suite('ModelList');

// -- ModelList: Lifecycle -----------------------------------------------------
modelListSuite.add(new Y.Test.Case({
    name: 'Lifecycle',

    setUp: function () {
        this.list = new Y.ModelList({model: Y.Model});
    },

    tearDown: function () {
        delete this.list;
    },

    'ModelLists should have a `model` property': function () {
        Assert.isNull(new Y.ModelList().model);
    },

    'destructor should detach all models from the list': function () {
        var model = new Y.Model();

        this.list.add(model);
        Assert.areSame(this.list, model.lists[0]);

        this.list.destroy();
        ArrayAssert.isEmpty(model.lists);
    }
}));

// -- ModelList: Methods -------------------------------------------------------
modelListSuite.add(new Y.Test.Case({
    name: 'Methods',

    setUp: function () {
        this.TestModel = Y.Base.create('testModel', Y.Model, [], {}, {
            ATTRS: {
                foo: {value: ''},
                bar: {value: ''}
            }
        });

        this.TestList = Y.Base.create('testList', Y.ModelList, []);

        this.createList = function (modelClass) {
            return new this.TestList({model: modelClass || this.TestModel});
        };

        this.createModel = function (config) {
            return new this.TestModel(config);
        };
    },

    tearDown: function () {
        delete this.createList;
        delete this.createModel;
        delete this.TestList;
        delete this.TestModel;
    },

    'add() should add a model to the list': function () {
        var list  = this.createList(),
            model = this.createModel(),
            added;

        Assert.areSame(model, list.add(model));
        Assert.areSame(1, list.size());

        added = list.add({foo: 'foo'});
        Assert.isInstanceOf(this.TestModel, added);
        Assert.areSame(2, list.size());
        Assert.areSame('foo', added.get('foo'));
    },

    'add() should add an array of models to the list': function () {
        var list   = this.createList(),
            models = [this.createModel(), this.createModel()],
            added;

        ArrayAssert.itemsAreSame(models, list.add(models));
        Assert.areSame(2, list.size());

        added = list.add([{foo: 'foo'}, {bar: 'bar'}]);
        Assert.isInstanceOf(this.TestModel, added[0]);
        Assert.isInstanceOf(this.TestModel, added[1]);
        Assert.areSame(4, list.size());
        Assert.areSame('foo', added[0].get('foo'));
        Assert.areSame('bar', added[1].get('bar'));
    },

    'comparator() should be undefined by default': function () {
        Assert.isUndefined(this.createList().comparator);
    },

    'models should be added in the proper position based on the comparator': function () {
        var list = this.createList();

        list.comparator = function (model) {
            return model.get('foo');
        };

        list.add([{foo: 'z'}, {foo: 'a'}, {foo: 'x'}, {foo: 'y'}]);

        ArrayAssert.itemsAreSame(['a', 'x', 'y', 'z'], list.get('foo'));
    },

    'create() should create or update a model, then add it to the list': function () {
        var list  = this.createList(),
            model = this.createModel();

        Assert.areSame(model, list.create(model));
        Assert.areSame(1, list.size());

        Assert.isInstanceOf(this.TestModel, list.create({foo: 'foo'}));
        Assert.areSame(2, list.size());
    },

    'create() should call the callback if one is provided': function () {
        var calls = 0,
            list  = this.createList();

        list.create({}, {}, function (err) {
            calls += 1;
            Assert.isUndefined(err);
        });

        list.create({}, function () { calls += 1; });

        Assert.areSame(2, calls);
    },

    'create() should pass an error to the callback if one occurs': function () {
        var calls = 0,
            list  = this.createList(),
            model = this.createModel();

        model.sync = function (action, options, callback) {
            callback('Oh noes!');
        };

        list.create(model, function (err) {
            calls += 1;
            Assert.areSame('Oh noes!', err);
        });

        Assert.areSame(1, calls);
    },

    'filter() should filter the list and return an array': function () {
        var list = this.createList(),
            filtered;

        list.add([{foo: 'a'}, {foo: 'b'}, {foo: 'c'}, {foo: 'd'}]);
        Assert.areSame(4, list.size());

        filtered = list.filter(function (model, i, myList) {
            var foo = model.get('foo');

            Assert.areSame(model, list.item(i));
            Assert.areSame(list, myList);
            Assert.areSame(list, this);

            return foo === 'a' || foo === 'd';
        });

        Assert.isArray(filtered);
        Assert.areSame(2, filtered.length);
        Assert.areSame('a', filtered[0].get('foo'));
        Assert.areSame('d', filtered[1].get('foo'));
    },

    'filter() should accept a custom `this` object': function () {
        var list = this.createList(),
            obj  = {};

        list.add({foo: 'a'});

        list.filter(function () {
            Assert.areSame(obj, this);
        }, obj);
    },

    'filter() should return an empty array if the callback never returns a truthy value': function () {
        var list = this.createList();

        list.add({foo: 'a'});
        Assert.areSame(0, list.filter(function () {}).length);
    },

    'get() should return an array of attribute values from all models in the list': function () {
        var list = this.createList();

        list.add([{foo: 'one'}, {foo: 'two'}]);
        ArrayAssert.itemsAreSame(['one', 'two'], list.get('foo'));
    },

    'get() should return a list attribute if there is one': function () {
        var list = this.createList();

        list.addAttr('foo', {value: '<listfoo>'});
        list.add([{foo: 'modelfoo-one'}, {foo: 'modelfoo-two'}]);

        Assert.areSame('<listfoo>', list.get('foo'));
    },

    'getAsHTML() should return an array of HTML-escaped attribute values': function () {
        var list = this.createList();

        list.add([{foo: '<foo>'}, {foo: '<bar>'}]);
        ArrayAssert.itemsAreSame(['&lt;foo&gt;', '&lt;bar&gt;'], list.getAsHTML('foo'));
    },

    'getAsHTML() should return a list attribute if there is one': function () {
        var list = this.createList();

        list.addAttr('foo', {value: '<listfoo>'});
        list.add([{foo: 'modelfoo-one'}, {foo: 'modelfoo-two'}]);

        Assert.areSame('&lt;listfoo&gt;', list.getAsHTML('foo'));
    },

    'getAsURL() should return an array of URL-encoded attribute values': function () {
        var list = this.createList();

        list.add([{foo: 'a b'}, {foo: 'c d'}]);
        ArrayAssert.itemsAreSame(['a%20b', 'c%20d'], list.getAsURL('foo'));
    },

    'getAsURL() should return a list attribute if there is one': function () {
        var list = this.createList();

        list.addAttr('foo', {value: 'list foo'});
        list.add([{foo: 'modelfoo-one'}, {foo: 'modelfoo-two'}]);

        Assert.areSame('list%20foo', list.getAsURL('foo'));
    },

    'getByClientId() should look up a model by its clientId': function () {
        var list  = this.createList(),
            model = list.add({});

        Assert.areSame(model, list.getByClientId(model.get('clientId')));
        Assert.isNull(list.getByClientId('bogus'));
    },

    'getById() should look up a model by its id': function () {
        var list  = this.createList(),
            model = list.add({id: 'foo'});

        Assert.areSame(model, list.getById(model.get('id')));
        Assert.isNull(list.getById('bogus'));
    },

    'getById() should work with numeric ids': function () {
        var list  = this.createList(),
            model = list.add({id: 0});

        Assert.areSame(model, list.getById(0));
    },

    'getById() should work with custom ids': function () {
        var CustomModel = Y.Base.create('customModel', Y.Model, [], {
                idAttribute: 'customId'
            }, {
                ATTRS: {
                    customId: {value: ''}
                }
            }),

            list  = this.createList(CustomModel),
            model = list.add({customId: 'foo'});

        Assert.areSame(model, list.getById(model.get('customId')));
    },

    'invoke() should call the named method on every model in the list': function () {
        var list = this.createList(),
            results;

        list.add([{}, {}]);
        results = list.invoke('set', 'foo', 'foo');

        ArrayAssert.itemsAreSame(list.toArray(), results, 'invoke should return an array of return values');
        ArrayAssert.itemsAreSame(['foo', 'foo'], list.get('foo'));
    },

    'item() should return the model at the specified index': function () {
        var list = this.createList();

        list.add([{foo: 'zero'}, {foo: 'one'}]);

        Assert.areSame('zero', list.item(0).get('foo'));
        Assert.areSame('one', list.item(1).get('foo'));
    },

    'load() should delegate to sync()': function () {
        var calls = 0,
            list  = this.createList(),
            opts  = {};

        list.sync = function (action, options, callback) {
            calls += 1;

            Assert.areSame('read', action);
            Assert.areSame(opts, options);
            Assert.isFunction(callback);

            callback();
        };

        list.load(opts);
        Assert.areSame(1, calls);
    },

    'load() should be chainable and should call the callback if one was provided': function () {
        var calls = 0,
            list  = this.createList();

        Assert.areSame(list, list.load());
        Assert.areSame(list, list.load({}));

        Assert.areSame(list, list.load(function (err) {
            calls += 1;
            Assert.isUndefined(err);
        }));

        Assert.areSame(list, list.load({}, function () {
            calls += 1;
        }));

        Assert.areSame(2, calls);
    },

    'map() should execute a function on every model in the list and return an array of return values': function () {
        var list = this.createList(),
            obj  = {},
            results;

        list.add([{foo: 'zero'}, {foo: 'one'}]);

        results = list.map(function (model) {
            Assert.areSame(obj, this);
            return model.get('foo');
        }, obj);

        ArrayAssert.itemsAreSame(['zero', 'one'], results);
    },

    'parse() should parse a JSON string and return an object': function () {
        var list     = this.createList(),
            response = list.parse('[{"foo": "bar"}]');

        Assert.isArray(response);
        Assert.areSame('bar', response[0].foo);
    },

    'parse() should not try to parse non-strings': function () {
        var list   = this.createList(),
            array  = ['foo', 'bar'],
            object = {foo: 'bar'};

        Assert.areSame(array, list.parse(array));
        Assert.areSame(object, list.parse(object));
    },

    'reset() should replace all models in the list': function () {
        var list   = this.createList(),
            models = list.add([{foo: 'zero'}, {foo: 'one'}]);

        Assert.areSame(list, list.reset([{foo: 'two'}, {foo: 'three'}]));
        ArrayAssert.itemsAreSame(['two', 'three'], list.get('foo'));

        // Removed models should be cleanly detached.
        Assert.isUndefined(models[0].list);
        Assert.isUndefined(models[1].list);

        // And we should be able to re-add them.
        list.reset(models);
        ArrayAssert.itemsAreSame(['zero', 'one'], list.get('foo'));
    },

    'reset() should sort the new models in the list': function () {
        var list = this.createList();

        list.comparator = function (model) {
            return model.get('bar');
        };

        list.reset([
            {foo: 'item 1', bar: 1},
            {foo: 'item 4', bar: 4},
            {foo: 'item 3', bar: 3},
            {foo: 'item 5', bar: 5},
            {foo: 'item 2', bar: 2}
        ]);

        ArrayAssert.itemsAreSame([1, 2, 3, 4, 5], list.get('bar'));
    },

    'reset() with no args should clear the list': function () {
        var list   = this.createList(),
            models = list.add([{foo: 'zero'}, {foo: 'one'}]);

        Assert.areSame(2, list.size());
        list.reset();
        Assert.areSame(0, list.size());
    },

    'remove() should remove a single model from the list': function () {
        var list = this.createList();

        list.add([{foo: 'zero'}, {foo: 'one'}]);

        Assert.areSame('zero', list.remove(list.item(0)).get('foo'));
        Assert.areSame(1, list.size());
    },

    'remove() should remove an array of models from the list': function () {
        var list = this.createList(),
            removed;

        list.add([{foo: 'zero'}, {foo: 'one'}]);
        removed = list.remove([list.item(0), list.item(1)]);

        Assert.areSame('zero', removed[0].get('foo'));
        Assert.areSame('one', removed[1].get('foo'));
        Assert.areSame(0, list.size());
    },

    // 'set() should set a single attribute value on all models in the list': function () {
    //
    // },
    //
    // 'setAttrs() should set multiple attribute values on all models in the list': function () {
    //
    // },

    'sort() should re-sort the list': function () {
        var list = this.createList();

        list.add([{foo: 'z'}, {foo: 'a'}, {foo: 'x'}, {foo: 'y'}]);

        ArrayAssert.itemsAreSame(['z', 'a', 'x', 'y'], list.get('foo'));

        list.comparator = function (model) {
            return model.get('foo');
        };

        Assert.areSame(list, list.sort(), 'sort() should be chainable');
        ArrayAssert.itemsAreSame(['a', 'x', 'y', 'z'], list.get('foo'));

    },

    'sync() should just call the supplied callback by default': function () {
        var calls = 0,
            list  = this.createList();

        list.sync(function (err) {
            calls += 1;
            Assert.isUndefined(err);
        });

        Assert.areSame(1, calls);
    },

    'toArray() should return an array containing all the models in the list': function () {
        var list   = this.createList(),
            models = list.add([{}, {}]);

        ArrayAssert.itemsAreSame(models, list.toArray());
    },

    'toJSON() should return an array of model hashes': function () {
        var list   = this.createList(),
            models = list.add([{foo: 'zero'}, {foo: 'one'}]),
            json   = list.toJSON();

        Assert.isArray(json);
        ObjectAssert.areEqual(models[0].toJSON(), json[0]);
        ObjectAssert.areEqual(models[1].toJSON(), json[1]);
    }
}));

// -- ModelList: Events --------------------------------------------------------
modelListSuite.add(new Y.Test.Case({
    name: 'Events',

    setUp: function () {
        this.TestModel = Y.Base.create('testModel', Y.Model, [], {}, {
            ATTRS: {
                foo: {value: ''},
                bar: {value: ''}
            }
        });

        this.TestList = Y.Base.create('testList', Y.ModelList, []);

        this.createList = function (modelClass) {
            return new this.TestList({model: modelClass || this.TestModel});
        };

        this.createModel = function (config) {
            return new this.TestModel(config);
        };
    },

    tearDown: function () {
        delete this.createList;
        delete this.createModel;
        delete this.TestList;
        delete this.TestModel;
    },

    '`add` event should fire when a model is added': function () {
        var calls = 0,
            list  = this.createList(),
            model = this.createModel();

        list.once('add', function (e) {
            calls += 1;

            Assert.areSame(model, e.model);
            Assert.areSame(0, e.index);
            Assert.areSame('test', e.src);
        });

        list.add(model, {src: 'test'});

        list.after('add', function (e) {
            calls += 1;
        });

        list.add([{}, {}]);

        Assert.areSame(3, calls);
    },

    '`add` event should be preventable': function () {
        var calls = 0,
            list  = this.createList();

        list.on('add', function (e) {
            calls += 1;
            e.preventDefault();
        });

        list.after('add', function () {
            Assert.fail('add event should be prevented');
        });

        list.add({});

        Assert.areSame(1, calls);
        Assert.areSame(0, list.size());
    },

    '`add` event should not fire when a model is added silently': function () {
        var list = this.createList();

        list.on('add', function () {
            Assert.fail('add event should not fire');
        });

        list.add({}, {silent: true});
        list.add([{}, {}], {silent: true});

        Assert.areSame(3, list.size());
    },

    '`change` event should bubble up from models': function () {
        var calls = 0,
            list  = this.createList(),
            model = list.add({});

        list.on('*:change', function (e) {
            calls += 1;

            Assert.areSame(model, e.target);
            Assert.areSame(list, e.currentTarget);
        });

        model.set('foo', 'foo').set('bar', 'bar');

        Assert.areSame(2, calls);
    },

    '`error` event should bubble up from models': function () {
        var calls = 0,
            list  = this.createList(),
            model = list.add({});

        model.validate = function (hash, callback) {
            if (hash.foo === 'invalid') {
                callback('fail!');
            }
        };

        list.on('*:error', function (e) {
            calls += 1;

            Assert.areSame(model, e.target);
            Assert.areSame(list, e.currentTarget);
        });

        model.set('foo', 'invalid');
        model.save();

        Assert.areSame(1, calls);
    },

    '`error` event should fire when a duplicate model is added': function () {
        var calls = 0,
            list  = this.createList(),
            model = this.createModel();

        list.on('error', function (e) {
            calls += 1;

            Assert.areSame(model, e.model);
            Assert.areSame('add', e.src);
        });

        list.add(model);
        list.add(model, {src: 'test'});
        list.add({});

        Assert.areSame(1, calls);
    },

    "`error` event should fire when a model that isn't in the list is removed": function () {
        var calls = 0,
            list  = this.createList(),
            model = this.createModel();

        list.on('error', function (e) {
            calls += 1;

            Assert.areSame(model, e.model);
            Assert.areSame('remove', e.src);
        });

        list.add(model);
        list.remove(model);
        list.remove(model, {src: 'test'});

        Assert.areSame(1, calls);
    },

    "`error` event should fire when a sync layer response can't be parsed": function () {
        var calls    = 0,
            list     = this.createList(),
            response = 'foo bar baz';

        list.once('error', function (e) {
            calls += 1;

            Assert.areSame(response, e.response);
            Assert.areSame('parse', e.src);
        });

        list.parse(response);
        list.parse('{"foo": "bar"}');

        Assert.areSame(1, calls);
    },

    '`reset` event should fire when the list is reset or sorted': function () {
        var calls  = 0,
            list   = this.createList(),
            models = [this.createModel(), this.createModel()];

        list.once('reset', function (e) {
            calls += 1;

            ArrayAssert.itemsAreSame(models, e.models);
            Assert.areSame('reset', e.src);
            Assert.areSame('test', e.test);
        });

        list.reset(models, {test: 'test'});

        list.after('reset', function (e) {
            calls += 1;

            Assert.areSame('sort', e.src);
            Assert.areSame('test', e.test);
        });

        list.comparator = function (model) {
            return model.get('clientId');
        };

        list.sort({test: 'test'});

        Assert.areSame(2, calls);
    },

    '`reset` event facade should contain sorted models': function () {
        var calls = 0,
            list  = this.createList();

        list.comparator = function (model) {
            return model.get('bar');
        };

        list.once('reset', function (e) {
            var values = [];

            calls += 1;

            Y.Array.each(e.models, function (model) {
                values.push(model.get('bar'));
            });

            ArrayAssert.itemsAreSame([1, 2, 3, 4, 5], values);
        });

        list.reset([
            {foo: 'item 1', bar: 1},
            {foo: 'item 4', bar: 4},
            {foo: 'item 3', bar: 3},
            {foo: 'item 5', bar: 5},
            {foo: 'item 2', bar: 2}
        ]);

        Assert.areSame(1, calls);
    },

    '`reset` event should be preventable': function () {
        var calls = 0,
            list  = this.createList();

        list.on('reset', function (e) {
            calls += 1;
            e.preventDefault();
        });

        list.after('reset', function () {
            Assert.fail('reset event should be prevented');
        });

        list.reset([{}]);

        Assert.areSame(1, calls);
        Assert.areSame(0, list.size());
    },

    '`reset` event should not fire when the list is reset silently': function () {
        var list = this.createList();

        list.on('reset', function () {
            Assert.fail('reset event should not fire');
        });

        list.reset([{}], {silent: true});

        Assert.areSame(1, list.size());
    },

    '`remove` event should fire when a model is removed': function () {
        var calls = 0,
            list  = this.createList(),
            model = list.add({});

        list.once('remove', function (e) {
            calls += 1;

            Assert.areSame(model, e.model);
            Assert.areSame(0, e.index);
            Assert.areSame('test', e.src);
        });

        list.remove(model, {src: 'test'});

        list.after('remove', function (e) {
            calls += 1;
        });

        list.remove(list.add([{}, {}]));

        Assert.areSame(3, calls);
    },

    '`remove` event should be preventable': function () {
        var calls = 0,
            list  = this.createList();

        list.on('remove', function (e) {
            calls += 1;
            e.preventDefault();
        });

        list.after('remove', function () {
            Assert.fail('remove event should be prevented');
        });

        list.remove(list.add({}));

        Assert.areSame(1, calls);
        Assert.areSame(1, list.size());
    },

    '`remove` event should not fire when a model is removed silently': function () {
        var list = this.createList();

        list.on('remove', function () {
            Assert.fail('remove event should not fire');
        });

        list.remove(list.add({}), {silent: true});
        list.remove(list.add([{}, {}]), {silent: true});

        Assert.areSame(0, list.size());
    }
}));

// -- Router Suite ---------------------------------------------------------
routerSuite = new Y.Test.Suite({
    name: 'Router',

    setUp: function () {
        this.oldPath = Y.config.win.location.toString();

        if (!html5) {
            Y.config.win.location.hash = '';
        }
    },

    tearDown: function () {
        if (html5) {
            Y.config.win.history.replaceState(null, null, this.oldPath);
        } else {
            Y.config.win.location.hash = '';
        }
    }
});

// -- Router: Lifecycle ----------------------------------------------------
routerSuite.add(new Y.Test.Case({
    name: 'Lifecycle',

    tearDown: function () {
        this.router && this.router.destroy();
        delete this.router;
    },

    'initializer should set attributes based on config options': function () {
        var router = this.router = new Y.Router({
                html5: false,

                root: '/foo',

                routes: [
                    {path: '/', callback: function () {}},
                    {path: '/foo', callback: function () {}}
                ]
            });

        Assert.isFalse(router.get('html5'));

        Assert.areSame('/foo', router.get('root'));

        Assert.areSame(2, router.get('routes').length);
        Assert.areSame(2, router._routes.length);
        Assert.areSame('/', router.get('routes')[0].path);
        Assert.areSame('/', router._routes[0].path);
        Assert.areSame('/foo', router.get('routes')[1].path);
        Assert.areSame('/foo', router._routes[1].path);
    },

    'subclass with default routes should work': function () {
        var MyRouter = Y.Base.create('myRouter', Y.Router, [], {}, {
                ATTRS: {
                    routes: {
                        value: [
                            {path: '/',    callback: 'index'},
                            {path: '/pie', callback: 'pie'}
                        ]
                    }
                }
            }),

            router = this.router = new MyRouter();

        Assert.areSame(2, router.get('routes').length);
        Assert.areSame(2, router._routes.length);
        Assert.areSame('/', router.get('routes')[0].path);
        Assert.areSame('/', router._routes[0].path);
        Assert.areSame('/pie', router.get('routes')[1].path);
        Assert.areSame('/pie', router._routes[1].path);
    }
}));

// -- Router: Attributes ---------------------------------------------------
routerSuite.add(new Y.Test.Case({
    name: 'Attributes',

    tearDown: function () {
        this.router && this.router.destroy();
        delete this.router;
    },

    '`html5` attribute should have a default value': function () {
        var router = this.router = new Y.Router();
        Assert.areSame(Y.Router.html5, router.get('html5'));
    },

    '`root` attribute should have a default value': function () {
        var router = this.router = new Y.Router();
        Assert.areSame('', router.get('root'));
    },

    '`routes` attribute should have a default value': function () {
        var router = this.router = new Y.Router();

        Assert.isArray(router.get('routes'));
        ArrayAssert.isEmpty(router.get('routes'));
    },

    'setting the `routes` attribute should reset all routes': function () {
        var router = this.router = new Y.Router();

        router.set('routes', [
            {path: '/', callback: function () {}},
            {path: '/foo', callback: function () {}}
        ]);

        ArrayAssert.itemsAreSame(router._routes, router.get('routes'));
        Assert.areSame(2, router._routes.length);
        Assert.areSame(router.get('routes')[0].callback, router._routes[0].callback);
        Assert.areSame(router.get('routes')[1].callback, router._routes[1].callback);
    }
}));

// -- Router: Events -------------------------------------------------------
routerSuite.add(new Y.Test.Case({
    name: 'Events',

    tearDown: function () {
        this.router && this.router.destroy();
        delete this.router;
    },

    '`ready` event should fire when the router is ready to dispatch': function () {
        var test = this,

            router = this.router = new Y.Router({
                on: {
                    ready: function (e) {
                        test.resume(function () {
                            Assert.isFalse(e.dispatched);
                        });
                    }
                }
            });

        this.wait(1000);
    },

    '`ready` event should set e.dispatched to true if called after dispatch': function () {
        var test = this,

            router = this.router = new Y.Router({
                on: {
                    initializedChange: function () {
                        this._dispatch('/fake', {});
                    },

                    ready: function (e) {
                        test.resume(function () {
                            Assert.isTrue(e.dispatched);
                        });
                    }
                }
            });

        this.wait(1000);
    }
}));

// -- Router: Methods ------------------------------------------------------
routerSuite.add(new Y.Test.Case({
    name: 'Methods',

    startUp: function () {
        this.errorFn   = Y.config.errorFn;
        this.throwFail = Y.config.throwFail;
    },

    tearDown: function () {
        this.router && this.router.destroy();
        delete this.router;

        Y.config.errorFn = this.errorFn;
        delete this.errorFn;

        Y.config.throwFail = this.throwFail;
        delete this.throwFail;
    },

    'route() should add a route': function () {
        var router = this.router = new Y.Router();

        router.one = function () {};
        function two() {}

        Assert.areSame(0, router._routes.length);

        Assert.areSame(router, router.route('/foo', 'one'));
        Assert.areSame(1, router._routes.length);

        router.route(/bar/, two);
        Assert.areSame(2, router._routes.length);

        Assert.areSame('one', router._routes[0].callback);
        Assert.areSame(two, router._routes[1].callback);
    },

    'match() should return an array of routes that match the given path': function () {
        var router = this.router = new Y.Router(),
            routes;

        function one() {}
        function two() {}
        function three() {}

        router.route('/:foo', one);
        router.route(/foo/, two);
        router.route('/bar', three);

        routes = router.match('/foo');

        Assert.areSame(2, routes.length);
        Assert.areSame(one, routes[0].callback);
        Assert.areSame(two, routes[1].callback);
    },

    'hasRoute() should return `true` if one or more routes match the given path': function () {
        var router = this.router = new Y.Router();

        function noop () {}

        router.route('/:foo', noop);
        router.route(/foo/, noop);
        router.route('/bar', noop);

        Assert.isTrue(router.hasRoute('/foo'));
        Assert.isTrue(router.hasRoute('/bar'));
        Assert.isFalse(router.hasRoute('/baz/quux'));
    },

    'hasRoute() should support full URLs': function () {
        var router = this.router = new Y.Router(),
            loc    = win && win.location,
            origin = loc ? (loc.origin || (loc.protocol + '//' + loc.host)) : '';

        function noop () {}

        router.route('/:foo', noop);
        router.route(/foo/, noop);
        router.route('/bar', noop);

        Assert.isTrue(router.hasRoute(origin + '/foo'));
        Assert.isTrue(router.hasRoute(origin + '/bar'));
        Assert.isFalse(router.hasRoute(origin + '/baz/quux'));

        // Scheme-relative URL.
        Assert.isTrue(router.hasRoute('//' + loc.host + '/foo'));
    },

    'hasRoute() should always return `false` for URLs with different origins': function () {
        var router = this.router = new Y.Router(),
            origin = 'http://something.really.random.com';

        function noop () {}

        router.route('/:foo', noop);
        router.route(/foo/, noop);
        router.route('/bar', noop);

        Assert.isFalse(router.hasRoute(origin + '/foo'));
        Assert.isFalse(router.hasRoute(origin + '/bar'));
        Assert.isFalse(router.hasRoute(origin + '/baz/quux'));
    },

    'dispatch() should dispatch to the first route that matches the current URL': function () {
        var test       = this,
            router = this.router = new Y.Router();

        router.route(/./, function () {
            test.resume();
        });

        setTimeout(function () {
            router.dispatch();
        }, 1);

        this.wait(1000);
    },

    'dispatch() should upgrade hash URLs to HTML5 URLs in HTML5 browsers': function () {
        if (!html5) {
            Assert.isTrue(true);
            return;
        }

        Y.HistoryHash.setHash('/hashpath');

        var test       = this,
            router = this.router = new Y.Router();

        router.route('/hashpath', function (req) {
            test.resume(function () {
                Assert.areSame('/hashpath', req.path);
                Assert.areSame(Y.config.win.location.pathname, '/hashpath');
            });
        });

        router.dispatch();
        this.wait(500);
    },

    'removeRoot() should remove the root URL from a given path': function () {
        var router = this.router = new Y.Router();

        router.set('root', '/');
        Assert.areSame('/bar', router.removeRoot('/bar'));
        Assert.areSame('/bar', router.removeRoot('bar'));

        router.set('root', '/foo');
        Assert.areSame('/bar', router.removeRoot('/foo/bar'));

        router.set('root', '/foo/');
        Assert.areSame('/bar', router.removeRoot('/foo/bar'));

        router.set('root', '/moo');
        Assert.areSame('/foo/bar', router.removeRoot('/foo/bar'));
    },

    'removeRoot() should strip the origin ("http://foo.com") portion of the URL, if any': function () {
        var router = this.router = new Y.Router();

        Assert.areSame('/foo/bar', router.removeRoot('http://example.com/foo/bar'));
        Assert.areSame('/foo/bar', router.removeRoot('https://example.com/foo/bar'));
        Assert.areSame('/foo/bar', router.removeRoot('http://user:pass@example.com/foo/bar'));
        Assert.areSame('/foo/bar', router.removeRoot('http://example.com:8080/foo/bar'));
        Assert.areSame('/foo/bar', router.removeRoot('http://user:pass@example.com:8080/foo/bar'));
        Assert.areSame('/foo/bar', router.removeRoot('file:///foo/bar'));
        Assert.areSame('/foo/bar', router.removeRoot('/foo/bar'));

        router.set('root', '/foo');
        Assert.areSame('/bar', router.removeRoot('http://example.com/foo/bar'));
        Assert.areSame('/bar', router.removeRoot('https://example.com/foo/bar'));
        Assert.areSame('/bar', router.removeRoot('http://user:pass@example.com/foo/bar'));
        Assert.areSame('/bar', router.removeRoot('http://example.com:8080/foo/bar'));
        Assert.areSame('/bar', router.removeRoot('http://user:pass@example.com:8080/foo/bar'));
        Assert.areSame('/bar', router.removeRoot('file:///foo/bar'));
        Assert.areSame('/bar', router.removeRoot('/foo/bar'));
    },

    'replace() should replace the current history entry': function () {
        var test   = this,
            router = this.router = new Y.Router();

        router.route('/replace', function (req) {
            test.resume(function () {
                Assert.areSame('/replace', req.path);
                Assert.isObject(req.query);
            });
        });

        // Wrapped in a setTimeout to make the async test work on iOS<5, which
        // performs this action synchronously.
        setTimeout(function () {
            router.replace('/replace');
        }, 1);

        this.wait(1000);
    },

    'save() should create a new history entry': function () {
        var test   = this,
            router = this.router = new Y.Router();

        router.route('/save', function (req) {
            test.resume(function () {
                Assert.areSame('/save', req.path);
                Assert.isObject(req.query);
            });
        });

        // Wrapped in a setTimeout to make the async test work on iOS<5, which
        // performs this action synchronously.
        setTimeout(function () {
            router.save('/save');
        }, 1);

        this.wait(1000);
    },

    'consecutive save() calls should dispatch to the correct routes': function () {
        var paths      = [],
            test       = this,
            router = this.router = new Y.Router();

        router.route('/one', function (req) {
            paths.push(req.path);
        });

        router.route('/two', function (req) {
            paths.push(req.path);
        });

        router.route('/three', function (req) {
            paths.push(req.path);

            test.resume(function () {
                ArrayAssert.itemsAreSame(['/one', '/two', '/three'], paths);
            });
        });

        // Wrapped in a setTimeout to make the async test work on iOS<5, which
        // performs this action synchronously.
        setTimeout(function () {
            router.save('/one');
            router.save('/two');
            router.save('/three');
        }, 1);

        this.wait(2000);
    },

    'replace() should error when the URL is not from the same origin': function () {
        var router = this.router = new Y.Router(),
            origin = 'http://something.really.random.com',
            test   = this;

        // We don't want the uncaught error line noise because we expect an
        // error to be thrown, and it won't be caught because `save()` is async.
        Y.config.throwFail = false;
        Y.config.errorFn   = function (e) {
            test.resume(function () {
                Assert.areSame(e, 'Security error: The new URL must be of the same origin as the current URL.');
            });
        };

        router.route('/foo', function () {
            test.resume(function () {
                Assert.fail('Should not route when URL has different origin.');
            });
        });

        // Wrapped in a setTimeout to make the async test work on iOS<5, which
        // performs this action synchronously.
        setTimeout(function () {
            router.replace(origin + '/foo');
        }, 1);

        this.wait(500);
    },

    'save() should error when the URL is not from the same origin': function () {
        var router = this.router = new Y.Router(),
            origin = 'http://something.really.random.com',
            test   = this;

        // We don't want the uncaught error line noise because we expect an
        // error to be thrown, and it won't be caught because `save()` is async.
        Y.config.throwFail = false;
        Y.config.errorFn   = function (e) {
            test.resume(function () {
                Assert.areSame(e, 'Security error: The new URL must be of the same origin as the current URL.');
            });
        };

        router.route('/foo', function () {
            test.resume(function () {
                Assert.fail('Should not route when URL has different origin.');
            });
        });

        // Wrapped in a setTimeout to make the async test work on iOS<5, which
        // performs this action synchronously.
        setTimeout(function () {
            router.save(origin + '/foo');
        }, 1);

        this.wait(500);
    },

    '_joinURL() should normalize "/" separators': function () {
        var router = this.router = new Y.Router();

        router.set('root', '/foo');
        Assert.areSame('/foo/bar', router._joinURL('bar'));
        Assert.areSame('/foo/bar', router._joinURL('/bar'));
        Assert.areSame('/foo/bar', router._joinURL('/foo/bar'));
        Assert.areSame('/foo/foo/bar', router._joinURL('foo/bar'));

        router.set('root', '/foo/');
        Assert.areSame('/foo/bar', router._joinURL('bar'));
        Assert.areSame('/foo/bar', router._joinURL('/bar'));
        Assert.areSame('/foo/bar', router._joinURL('/foo/bar'));
        Assert.areSame('/foo/foo/bar', router._joinURL('foo/bar'));
    },

    '_dispatch() should pass `src` through to request object passed to route handlers': function () {
        var router = this.router = new Y.Router(),
            calls      = 0,
            src        = 'API';

        router.route('/foo', function (req, res, next) {
            Assert.areSame(src, req.src);
        });

        router._dispatch('/foo', {}, src);
    }
}));

// -- Router: Routes -------------------------------------------------------
routerSuite.add(new Y.Test.Case({
    name: 'Routes',

    tearDown: function () {
        this.router && this.router.destroy();
        this.router2 && this.router2.destroy();

        delete this.router;
        delete this.router2;
    },

    'routes should be called in the context of the router': function () {
        var calls      = 0,
            router = this.router = new Y.Router({
                routes: [{path: '/foo', callback: 'foo'}]
            });

        router.foo = function () {
            calls += 1;
            Assert.areSame(router, this);
        };

        router.route('/bar', router.foo);
        router._dispatch('/foo', {});
        router._dispatch('/bar', {});

        Assert.areSame(2, calls);
    },

    'routes should receive a request object, response object, and `next` function as params': function () {
        var calls      = 0,
            router = this.router = new Y.Router();

        router.route('/foo', function (req, res, next) {
            calls += 1;

            Assert.isObject(req);
            Assert.isObject(res);
            Assert.isFunction(next);
            Assert.areSame(next, req.next);
            Assert.isObject(req.params);
            Assert.isTrue(Y.Object.isEmpty(req.params));
            Assert.areSame('/foo', req.path);
            ObjectAssert.areEqual({bar: 'baz quux', moo: ''}, req.query);
        });

        // Duckpunching _getQuery so we can test req.query.
        router._getQuery = function () {
            return 'bar=baz%20quux&moo';
        };

        router._dispatch('/foo', {foo: 'foo'});

        Assert.areSame(1, calls);
    },

    'request object should contain captured route parameters': function () {
        var calls      = 0,
            router = this.router = new Y.Router();

        router.route('/foo/:bar/:baz', function (req) {
            calls += 1;

            ArrayAssert.itemsAreSame(['bar', 'baz'], Y.Object.keys(req.params));
            ArrayAssert.itemsAreSame(['one', 'two'], Y.Object.values(req.params));
        });

        router.route('/bar/*path', function (req) {
            calls += 1;

            Assert.isObject(req.params);
            ArrayAssert.itemsAreSame(['path'], Y.Object.keys(req.params));
            ArrayAssert.itemsAreSame(['one/two'], Y.Object.values(req.params));
        });

        router.route(/^\/(baz)\/(quux)$/, function (req) {
            calls += 1;

            Assert.isArray(req.params);
            ArrayAssert.itemsAreSame(['/baz/quux', 'baz', 'quux'], req.params);
        });

        router._dispatch('/foo/one/two', {});
        router._dispatch('/bar/one/two', {});
        router._dispatch('/baz/quux', {});

        Assert.areSame(3, calls);
    },

    'calling `res()` should have the same result as calling `next()`': function () {
        var calls      = 0;
            router = this.router = new Y.Router();

        router.route('/foo', function (req, res, next) {
            calls += 1;
            Assert.isFunction(res);
            res();
        });

        router.route('/foo', function (req, res, next) {
            calls += 1;
            Assert.isFunction(next);
            next();
        });

        router.route('/foo', function () {
            calls += 1;
        });

        router._dispatch('/foo', {});

        Assert.areSame(3, calls);
    },

    'calling `next()` should pass control to the next matching route': function () {
        var calls      = 0,
            router = this.router = new Y.Router();

        router.route('/foo', function (req, res, next) {
            calls += 1;
            next();
        });

        router.route(/foo/, function (req, res, next) {
            calls += 1;
            next();
        });

        router.route('/foo', function (req, res, next) {
            calls += 1;
        });

        router.route('/foo', function (req, res, next) {
            calls += 1;
            Assert.fail('final route should not be called');
        });

        router._dispatch('/foo', {});

        Assert.areSame(3, calls);
    },

    '"*" should be a catch-all route': function () {
        var calls      = 0,
            router = this.router = new Y.Router();

        router.route('*', function (req) {
            calls += 1;
        });

        router._dispatch('/foo', {});
        router._dispatch('/bar', {});

        Assert.areSame(2, calls);
    },

    'multiple routers should be able to coexist and have duplicate route handlers': function () {
        var calls = 0,
            routerOne = this.router  = new Y.Router(),
            routerTwo = this.router2 = new Y.Router();

        routerOne.route('/baz', function () {
            calls += 1;
        });

        routerTwo.route('/baz', function () {
            calls += 1;
        });

        routerOne.save('/baz');

        this.wait(function () {
            Assert.areSame(2, calls);
        }, 200);
    }
}));

// -- View Suite ---------------------------------------------------------------
viewSuite = new Y.Test.Suite('View');

// -- View: Lifecycle ----------------------------------------------------------
viewSuite.add(new Y.Test.Case({
    name: 'Lifecycle',

    'container should be a <div> node by default': function () {
        var view = new Y.View();

        Assert.isInstanceOf(Y.Node, view.get('container'));
        Assert.areSame('div', view.get('container').get('tagName').toLowerCase());
    },

    'events property should be an empty object by default': function () {
        var view = new Y.View();

        Assert.isObject(view.events);
        Assert.isTrue(Y.Object.isEmpty(view.events));
    },

    'model attribute should be null by default': function () {
        Assert.isNull(new Y.View().get('model'));
    },

    'initializer should allow setting a model reference at init': function () {
        var model = new Y.Model(),
            view  = new Y.View({model: model});

        Assert.areSame(model, view.get('model'));
    },

    'initializer should allow setting a model list reference at init': function () {
        var modelList = new Y.ModelList(),
            view      = new Y.View({modelList: modelList});

        Assert.areSame(modelList, view.get('modelList'));
    },

    'initializer should allow setting a template at init': function () {
        var template = {},
            view     = new Y.View({template: template});

        Assert.areSame(template, view.template);
    },

    'initializer should call create() to create the container node': function () {
        var calls = 0,

            TestView = Y.Base.create('testView', Y.View, [], {
                create: function (container) {
                    calls += 1;
                    Assert.areSame('<b/>', container);
                }
            });

        new TestView({container: '<b/>'});

        Assert.areSame(1, calls);
    },

    'initializer should call attachEvents()': function () {
        var calls  = 0,
            events = {'#foo': {click: 'handler'}},

            TestView = Y.Base.create('testView', Y.View, [], {
                events: {'#bar': {click: 'handler'}},

                attachEvents: function (events) {
                    calls += 1;

                    Assert.areSame(this.events, events);

                    // Ensure that events specified at instantiation time are
                    // merged into any default events, rather than overwriting
                    // all default events.
                    Assert.areSame('handler', events['#foo'].click);
                    Assert.isObject(events['#bar'], 'Events passed at init should be merged into default events.');
                    Assert.areSame('handler', events['#bar'].click);
                }
            });

        new TestView({events: events});

        Assert.areSame(1, calls);
    },

    'destructor should remove the container from the DOM': function () {
        var view = new Y.View();

        Y.one('body').append(view.get('container'));
        Assert.isTrue(view.get('container').inDoc());

        view.destroy();
        Assert.isNull(view.get('container')._node);
    }
}));

viewSuite.add(new Y.Test.Case({
    name: 'Methods',

    'create() should create and return a container node': function () {
        var view = new Y.View(),
            node = Y.Node.create('<div/>');

        Assert.areSame(node, view.create(node), "should return the same node if it's already a node");

        node = view.create('#test');
        Assert.isInstanceOf(Y.Node, node, "should support selector strings");
        Assert.areSame('div', node.get('tagName').toLowerCase());

        node = view.create(Y.config.doc.createElement('div'));
        Assert.isInstanceOf(Y.Node, node, "should support DOM elements");
        Assert.areSame('div', node.get('tagName').toLowerCase());
    },

    'remove() should remove the container node from the DOM': function () {
        var view = new Y.View();

        Y.one('body').append(view.get('container'));
        Assert.isTrue(view.get('container').inDoc());

        view.remove();
        Assert.isFalse(view.get('container').inDoc());
    },

    'render() should be a chainable noop': function () {
        var view = new Y.View();
        Assert.areSame(view, view.render());
    }
}));

suite.add(modelSuite);
suite.add(modelListSuite);
suite.add(routerSuite);
suite.add(viewSuite);

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['model', 'model-list', 'router', 'view', 'test']
});
