YUI.add('model-list-test', function (Y) {

var ArrayAssert  = Y.ArrayAssert,
    Assert       = Y.Assert,
    ObjectAssert = Y.ObjectAssert,

    suite,
    modelListSuite;

// -- Global Suite -------------------------------------------------------------
suite = Y.AppTestSuite || (Y.AppTestSuite = new Y.Test.Suite('App Framework'));

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

    'add() should support models created in other windows': function () {
        var list   = this.createList(),
            iframe = document.getElementById('test-iframe'),
            model  = iframe.contentWindow.iframeModel;

        list.add(model);

        Assert.areSame(model, list.item(0));
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

    'create() should support models created in other windows': function () {
        var list   = this.createList(),
            iframe = document.getElementById('test-iframe'),
            model  = iframe.contentWindow.iframeModel;

        list.create(model);

        Assert.areSame(model, list.item(0));
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

    'reset() should support models created in other windows': function () {
        var list   = this.createList(),
            iframe = document.getElementById('test-iframe'),
            model  = iframe.contentWindow.iframeModel;

        list.reset([model]);

        Assert.areSame(model, list.item(0));
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

    '`create` event should fire when a model is created': function () {
        var calls = 0,
            list  = this.createList(),
            model = this.createModel();

        list.on('create', function (e) {
            calls += 1;
            Assert.areSame(model, e.model, 'Model should be passed in the event facade.');
        });

        list.on('add', function (e) {
            Assert.areSame(1, calls, '`add` should fire after `create`.');
        });

        list.create(model);

        Assert.areSame(1, calls, '`create` event should be fired.');
    },

    '`create` event should receive options passed to the create() method': function () {
        var calls = 0,
            list  = this.createList(),
            model = this.createModel();

        list.on('create', function (e) {
            calls += 1;
            Assert.areSame('foo', e.src, 'Options should be merged into the event facade.');
        });

        list.create(model, {src: 'foo'});

        Assert.areSame(1, calls, '`create` event should be fired.');
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

    '`load` event should fire after a successful load operation': function () {
        var calls = 0,
            list  = this.createList();

        list.on('load', function (e) {
            calls += 1;

            Assert.areSame('[{"foo": "bar"}]', e.response);
            Assert.isObject(e.options);
            Assert.isObject(e.parsed);
            Assert.areSame('bar', e.parsed[0].foo);
        });

        list.sync = function (action, options, callback) {
            callback(null, '[{"foo": "bar"}]');
        };

        list.load(function () {
            Assert.areSame(1, calls, 'load event should fire before the callback runs');
        });

        Assert.areSame(1, calls, 'load event never fired');
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

suite.add(modelListSuite);

}, '@VERSION@', {
    requires: ['model-list', 'test']
});
