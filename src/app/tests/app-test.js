YUI.add('app-test', function (Y) {

var ArrayAssert  = Y.ArrayAssert,
    Assert       = Y.Assert,
    ObjectAssert = Y.ObjectAssert,

    suite,
    modelSuite,
    modelListSuite,
    viewSuite;

// -- Global Suite -------------------------------------------------------------
suite = new Y.Test.Suite('App Framework');

// -- Model Suite --------------------------------------------------------------
modelSuite = new Y.Test.Suite('Model');

// -- Model: Lifecycle ---------------------------------------------------------
modelSuite.add(new Y.Test.Case({
    name: 'Lifecycle',

    'Models should have `changed` and `lastChange` properties': function () {
        var model = new Y.Model();

        ObjectAssert.ownsKeys(['changed', 'lastChange'], model);
        Assert.isObject(model.changed);
        Assert.isObject(model.lastChange);
        ObjectAssert.ownsNoKeys(model.changed);
        ObjectAssert.ownsNoKeys(model.lastChange);
    },

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
    }
}));

// -- Model: Attributes --------------------------------------------------------
modelSuite.add(new Y.Test.Case({
    name: 'Attributes',

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

    'id attribute should be an alias for the custom id attribute': function () {
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

    'clientId attribute should be automatically generated': function () {
        var model = new Y.Model();

        Assert.isString(model.get('clientId'));
        Assert.isTrue(!!model.get('clientId'));
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

        model.validate = function (hash) {
            return 'ERROR. ERROR. DOES NOT COMPUTE.';
        };

        model.on('error', function (e) {
            calls += 1;

            Assert.areSame('validate', e.type);
            ObjectAssert.ownsKey('foo', e.attributes);
            Assert.areSame('bar', e.attributes.foo);
            Assert.areSame('ERROR. ERROR. DOES NOT COMPUTE.', e.error);
        });

        model.set('foo', 'bar');

        Assert.areSame(1, calls);
    },

    '`error` event should fire when parsing fails': function () {
        var calls = 0,
            model = new this.TestModel();

        model.on('error', function (e) {
            calls += 1;

            Assert.areSame('parse', e.type);
            Y.assert(e.error instanceof Error);
            Assert.areSame('moo', e.response);
        });

        model.parse('moo');

        Assert.areSame(1, calls);
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

    'validate() should be a noop function by default': function () {
        var model = new this.TestModel();

        Assert.isFunction(model.validate);
        Assert.isUndefined(model.validate());
    },

    'Setting an attribute should call validate() and fire an error if it returns a value': function () {
        var calls  = 0,
            errors = 0,
            model  = new this.TestModel();

        model.validate = function (attributes) {
            calls += 1;
            Assert.isObject(attributes);

            return attributes.foo === 'invalid' ? 'Invalid!' : null;
        };

        model.on('error', function (e) {
            errors += 1;

            Assert.areSame('validate', e.type);
            Assert.areSame('Invalid!', e.error);
        });

        model.set('foo', 'bar');
        model.set('foo', 'invalid');

        Assert.areSame(3, calls);
        Assert.areSame(1, errors);
    }
}));

suite.add(modelSuite);

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['controller', 'model', 'model-list', 'view', 'test']
});
