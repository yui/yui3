YUI.add('model-test', function (Y) {

var ArrayAssert  = Y.ArrayAssert,
    Assert       = Y.Assert,
    ObjectAssert = Y.ObjectAssert,

    suite,
    modelSuite;

// -- Global Suite -------------------------------------------------------------
suite = Y.AppTestSuite || (Y.AppTestSuite = new Y.Test.Suite('App'));

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

    'destroy() should delete the model if the `remove` option is truthy': function () {
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
            Assert.isTrue(options.remove, 'options.delete should be true');
            Assert.isFunction(callback, 'callback should be a function');

            callback();
        };

        model.destroy({remove: true}, mock.callback);
        Y.Mock.verify(mock);
        Assert.areSame(1, calls);
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
    },

    'destroy() should not remove the model lists when sync has an error': function () {
        var calls     = 0,
            model     = new Y.Model(),
            listOne   = new Y.ModelList(),
            listTwo   = new Y.ModelList(),
            listThree = new Y.ModelList();

        model.sync = function (action, options, callback) {
            calls += 1;
            Assert.areSame('delete', action, 'sync action should be "delete"');
            callback('Delete failed');
        };

        listOne.add(model);
        listTwo.add(model);
        listThree.add(model);

        Assert.areSame(1, listOne.size(), 'model should be added to list one');
        Assert.areSame(1, listTwo.size(), 'model should be added to list two');
        Assert.areSame(1, listThree.size(), 'model should be added to list three');

        model.destroy({remove: true}, function (err) {
            Assert.areSame('Delete failed', err, 'Sync err was not "Delete failed"');
        });

        Assert.areSame(1, listOne.size(), 'model should be removed from list one');
        Assert.areSame(1, listTwo.size(), 'model should be removed from list two');
        Assert.areSame(1, listThree.size(), 'model should be removed from list three');

        Assert.areSame(1, calls);
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

    'Models should allow ad-hoc attributes': function () {
        var created = new Date(),

            model = new Y.Model({
                foo: 'foo',
                bar: {a: 'bar'},
                baz: ['baz'],
                quux: null,
                zero: 0,
                created: created
            });

        Assert.areSame('foo', model.get('foo'), 'ad-hoc foo attribute should be set');
        Assert.areSame('bar', model.get('bar.a'), 'ad-hoc bar attribute should be set');
        Assert.areSame('baz', model.get('baz')[0], 'ad-hoc baz attribute should be set');
        Assert.isNull(model.get('quux'), 'ad-hoc quux attribute should be set');
        Assert.areSame(0, model.get('zero'), 'ad-hoc zero attribute should be set');
        Assert.areSame(created, model.get('created'), 'ad-hoc created attribute should be set');

        ObjectAssert.ownsKeys(['foo', 'bar', 'baz', 'quux', 'zero', 'created'], model.getAttrs(), 'ad-hoc attributes should be returned by getAttrs()');
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

    '`_isYUIModel` property should be true': function () {
        var model = new this.TestModel();
        Assert.isTrue(model._isYUIModel);
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
    },

    'Resetting the custom id attribute should reset `id`': function () {
        var model = new this.TestModel({id: '1'});

        model.set('id', '2');

        Assert.areSame('2', model.get('id'));
        Assert.areSame('2', model.get('customId'));

        model.reset('id');

        Assert.areSame('1', model.get('id'));
        Assert.areSame('1', model.get('customId'));

        model.set('customId', '2');

        Assert.areSame('2', model.get('id'));
        Assert.areSame('2', model.get('customId'));

        model.reset('customId');

        Assert.areSame('1', model.get('id'));
        Assert.areSame('1', model.get('customId'));

        model.setAttrs({
            id      : '2',
            customId: '2'
        });

        Assert.areSame('2', model.get('id'));
        Assert.areSame('2', model.get('customId'));

        // Reset all.
        model.reset();

        Assert.areSame('1', model.get('id'));
        Assert.areSame('1', model.get('customId'));
    },

    'A custom id attribute should not be set when `id` fails validation': function () {
        var CustomTestModel, model;

        CustomTestModel = Y.Base.create('customTestModel', Y.Model, [], {
            idAttribute: 'customId'
        }, {
            ATTRS: {
                id: {
                    validator: Y.Lang.isString,
                    value    : null
                },

                customId: {value: null}
            }
        });

        model = new CustomTestModel({id: 'foo'});
        Assert.areSame('foo', model.get('id'), '`id` is not "foo"');
        Assert.areSame('foo', model.get('customId'), '`customId` is not "foo"');

        model = new CustomTestModel({customId: 'bar'});
        Assert.areSame('bar', model.get('id'), '`id` is not "bar"');
        Assert.areSame('bar', model.get('customId'), '`customId` is not "bar"');

        model = new CustomTestModel({id: 1});
        Assert.isNull(model.get('id'), '`id` is not `null`');
        // BUG this *should* be `null`.
        Assert.areSame(1, model.get('customId'), '`customId` is not `null`');

        model.set('id', 1);
        Assert.isNull(model.get('id'), '`id` is not `null`');
        // BUG this *should* be `null`.
        Assert.areSame(1, model.get('customId'), '`customId` is not `null`');

        model = new CustomTestModel({customId: 1});
        Assert.isNull(model.get('id'), '`id` is not `null`');
        // BUG this *should* be `null`.
        Assert.areSame(1, model.get('customId'), '`customId` is not `null`');

        model.set('customId', 1);
        Assert.isNull(model.get('id'), '`id` is not `null`');
        // BUG this *should* be `null`.
        Assert.areSame(1, model.get('customId'), '`customId` is not `null`');
    },

    '`id` should not be set when the custom id attribute fails validation': function () {
        var CustomTestModel, model;

        CustomTestModel = Y.Base.create('customTestModel', Y.Model, [], {
            idAttribute: 'customId'
        }, {
            ATTRS: {
                id: {value: null},

                customId: {
                    validator: Y.Lang.isString,
                    value    : null
                }
            }
        });

        model = new CustomTestModel({id: 'foo'});
        Assert.areSame('foo', model.get('id'), '`id` is not "foo"');
        Assert.areSame('foo', model.get('customId'), '`customId` is not "foo"');

        model = new CustomTestModel({customId: 'bar'});
        Assert.areSame('bar', model.get('id'), '`id` is not "bar"');
        Assert.areSame('bar', model.get('customId'), '`customId` is not "bar"');

        model = new CustomTestModel({id: 1});
        Assert.isNull(model.get('customId'), '`customId` is not `null`');
        // BUG this *should* be `null`.
        Assert.areSame(1, model.get('id'), '`id` is not `null`');

        model.set('id', 1);
        Assert.isNull(model.get('customId'), '`customId` is not `null`');
        // BUG this *should* be `null`.
        Assert.areSame(1, model.get('id'), '`id` is not `null`');

        model = new CustomTestModel({customId: 1});
        Assert.isNull(model.get('customId'), '`customId` is not `null`');
        // BUG this *should* be `null`.
        Assert.areSame(1, model.get('id'), '`id` is not `null`');

        model.set('customId', 1);
        Assert.isNull(model.get('customId'), '`customId` is not `null`');
        // BUG this *should* be `null`.
        Assert.areSame(1, model.get('id'), '`id` is not `null`');
    },

    'A custom id attribute should be same as what is returned from `id` setter': function () {
        var CustomTestModel, model;

        function setId(id) {
            return 'foo' + id;
        }

        CustomTestModel = Y.Base.create('customTestModel', Y.Model, [], {
            idAttribute: 'customId'
        }, {
            ATTRS: {
                id: {
                    setter: setId,
                    value : null
                },

                customId: {value: null}
            }
        });

        model = new CustomTestModel({id: 1});
        Assert.areSame('foo1', model.get('id'), '`id` is not "foo1"');
        // BUG this *should* be `"foo1"`.
        Assert.areSame(1, model.get('customId'), '`customId` is not "foo1"');

        model.set('id', 2);
        Assert.areSame('foo2', model.get('id'), '`id` is not "foo2"');
        // BUG this *should* be `"foo2"`.
        Assert.areSame(2, model.get('customId'), '`customId` is not "foo2"');

        model = new CustomTestModel({customId: 1});
        Assert.areSame('foo1', model.get('id'), '`id` is not "foo1"');
        // BUG this *should* be `"foo1"`.
        Assert.areSame(1, model.get('customId'), '`customId` is not "foo1"');

        model.set('customId', 2);
        Assert.areSame('foo2', model.get('id'), '`id` is not "foo2"');
        // BUG this *should* be `"foo2"`.
        Assert.areSame(2, model.get('customId'), '`customId` is not "foo2"');
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

    'getAsHTML() should return an empty string for null attribute values': function () {
        var model = new this.TestModel({
            nullish1: undefined,
            nullish2: null,
            nullish3: NaN,

            falsy1: false,
            falsy2: 0,
            falsy3: ''
        });

        Assert.areSame('', model.getAsHTML('nullish1'));
        Assert.areSame('', model.getAsHTML('nullish2'));
        Assert.areSame('', model.getAsHTML('nullish3'));

        Assert.areSame('false', model.getAsHTML('falsy1'));
        Assert.areSame('0', model.getAsHTML('falsy2'));
        Assert.areSame('', model.getAsHTML('falsy3'));
    },

    'getAsURL() should return a URL-encoded attribute value': function () {
        var value = 'foo & bar = baz',
            model = new this.TestModel({foo: value});

        Assert.areSame(encodeURIComponent(value), model.getAsURL('foo'));
    },

    'getAsURL() should return an empty string for null attribute values': function () {
        var model = new this.TestModel({
            nullish1: undefined,
            nullish2: null,
            nullish3: NaN,

            falsy1: false,
            falsy2: 0,
            falsy3: ''
        });

        Assert.areSame('', model.getAsURL('nullish1'));
        Assert.areSame('', model.getAsURL('nullish2'));
        Assert.areSame('', model.getAsURL('nullish3'));

        Assert.areSame('false', model.getAsURL('falsy1'));
        Assert.areSame('0', model.getAsURL('falsy2'));
        Assert.areSame('', model.getAsURL('falsy3'));
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

    'setAttrs() should not modify the passed-in `options` object': function () {
        var model   = new this.TestModel(),
            options = {foo: 'foo'};

        ArrayAssert.itemsAreSame(['foo'], Y.Object.keys(options));

        model.setAttrs({bar: 'bar'}, options);

        Assert.areSame('bar', model.get('bar'));
        ArrayAssert.itemsAreSame(['foo'], Y.Object.keys(options));
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

    'undo() should only fire one change when a custom id attribute changes': function () {
        var calls = 0,
            CustomTestModel, model;

        // When there's a custom id attribute, the 'id' attribute should be
        // excluded.
        CustomTestModel = Y.Base.create('customTestModel', Y.Model, [], {
            idAttribute: 'userId'
        }, {
            ATTRS: {
                customId: {value: ''},
                foo     : {value: ''}
            }
        });

        model = new CustomTestModel({foo: 'foo'});
        model.setAttrs({userId: '1', foo: 'bar'});

        model.after('change', function (e) {
            calls += 1;
            Assert.isNull(this.get('userId'));
            Assert.areSame('foo', this.get('foo'));
        });

        model.undo();
        Assert.areSame(1, calls);
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

    '`change` event facade should contain options passed to set()/setAttrs()': function () {
        var calls = 0,
            model = new this.TestModel();

        model.on('change', function (e) {
            calls += 1;

            Assert.areSame(e.src, 'test');
            Assert.areSame(e.foo, 'bar');
        });

        model.setAttrs({
            foo: 'foo',
            bar: 'bar'
        }, {src: 'test', foo: 'bar'});

        model.set('foo', 'bar', {
            src: 'test',
            foo: 'bar'
        });

        Assert.areSame(2, calls);
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

suite.add(modelSuite);

}, '@VERSION@', {
    requires: ['model', 'model-list', 'test']
});
