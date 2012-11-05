YUI.add('model-list-test', function (Y) {

var ArrayAssert  = Y.ArrayAssert,
    Assert       = Y.Assert,
    ObjectAssert = Y.ObjectAssert,

    suite,
    modelListSuite;

// -- Global Suite -------------------------------------------------------------
suite = Y.AppTestSuite || (Y.AppTestSuite = new Y.Test.Suite('App'));

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

    'constructor: should add a model instance, array of model instances, or ModelList instance to the list when passed in the `items` config property': function () {
        var a = new Y.Model({name: 'a'}),
            b = new Y.Model({name: 'b'}),
            list;

        list = new Y.ModelList({items: {name: 'a'}});
        Assert.areSame(1, list.size(), 'list should contain one model');
        Assert.areSame('a', list.item(0).get('name'), 'single model as object should be added correctly on init');

        list = new Y.ModelList({items: [{name: 'a'}, {name: 'b'}]});
        Assert.areSame(2, list.size(), 'list should contain two models');
        Assert.areSame('a', list.item(0).get('name'), 'first model of multiple models as objects should be added correctly on init');
        Assert.areSame('b', list.item(1).get('name'), 'second model of multiple models as objects should be added correctly on init');

        list = new Y.ModelList({items: a});
        Assert.areSame(1, list.size(), 'list should contain one model');
        Assert.areSame('a', list.item(0).get('name'), 'single model should be added correctly on init');

        list = new Y.ModelList({items: [a, b]});
        Assert.areSame(2, list.size(), 'list should contain two models');
        Assert.areSame('a', list.item(0).get('name'), 'first model of multiple models should be added correctly on init');
        Assert.areSame('b', list.item(1).get('name'), 'second model of multiple models should be added correctly on init');

        list = new Y.ModelList({items: new Y.ModelList({items: [a, b]})});
        Assert.areSame(2, list.size(), 'list should contain two models');
        Assert.areSame('a', list.item(0).get('name'), 'first model of ModelList should be added correctly on init');
        Assert.areSame('b', list.item(1).get('name'), 'second model of ModelList should be added correctly on init');
    },

    'destructor should detach all models from the list': function () {
        var model = new Y.Model();

        this.list.add(model);
        Assert.areSame(this.list, model.lists[0]);

        this.list.destroy();
        ArrayAssert.isEmpty(model.lists);
    }
}));

// -- ModelList: Attributes and Properties -------------------------------------
modelListSuite.add(new Y.Test.Case({
    name: 'Attributes & Properties',

    setUp: function () {
        this.list = new Y.ModelList();
    },

    tearDown: function () {
        delete this.list;
        Y.CustomModel && delete Y.CustomModel;
        Y.Foo && delete Y.Foo;
    },

    'ModelList instances should have an `_isYUIModelList` property': function () {
        Assert.isTrue(this.list._isYUIModelList);
    },

    'ModelList instances should have a `model` property that defaults to Y.Model': function () {
        Assert.areSame(Y.Model, this.list.model);
    },

    '`model` property should be customizable on init': function () {
        var CustomModel = Y.Base.create('customModel', Y.Model, []),
            list = new Y.ModelList({model: CustomModel});

        Assert.areSame(CustomModel, list.model);
    },

    '`model` property should evaluate a string to a namespaced class on `Y`': function () {
        Y.CustomModel = Y.Base.create('customModel', Y.Model, []);

        var CustomList = Y.Base.create('customList', Y.ModelList, [], {
                model: 'CustomModel'
            }),

            list = new CustomList();

        Assert.areSame(Y.CustomModel, list.model);
    },

    '`model` property should support deeply-nested names': function () {
        Y.namespace('Foo.Bar').CustomModel = Y.Base.create('customModel', Y.Model, []);

        var CustomList = Y.Base.create('customList', Y.ModelList, [], {
                model: 'Foo.Bar.CustomModel'
            }),

            list = new CustomList();

        Assert.areSame(Y.Foo.Bar.CustomModel, list.model);
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

    'add() should add a model to the list at the specified index': function () {
        var list  = this.createList(),
            model = this.createModel();

        list.add([{name: 'first'}, {name: 'second'}, {name: 'third'}]);
        list.add(model, {index: 0});

        Assert.areSame(4, list.size(), 'list should contain 4 items');
        Assert.areSame(model, list.item(0), 'model should be inserted at index 0');
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

    'add() should add an array of models to the list at the specified index': function () {
        var list       = this.createList(),
            modelOne   = this.createModel(),
            modelTwo   = this.createModel(),
            modelThree = this.createModel();

        list.add([{name: 'first'}, {name: 'second'}, {name: 'third'}]);
        list.add([modelOne, modelTwo, modelThree], {index: 0});

        Assert.areSame(6, list.size(), 'list should contain 6 items');
        Assert.areSame(modelOne, list.item(0), 'modelOne should be inserted at index 0');
        Assert.areSame(modelTwo, list.item(1), 'modelTwo should be inserted at index 1');
        Assert.areSame(modelThree, list.item(2), 'modelThree should be inserted at index 2');
    },

    'add() should add models in another ModelList to the list': function () {
        var list        = this.createList(),
            otherList   = this.createList(),
            otherModels = [this.createModel(), this.createModel()];

        otherList.add(otherModels);

        ArrayAssert.itemsAreSame(otherModels, list.add(otherList), 'should return an array of added models');
        Assert.areSame(2, list.size(), 'list should contain 2 models');
        Assert.areSame(otherList.item(0), list.item(0));
        Assert.areSame(otherList.item(1), list.item(1));
    },

    'add() should add models in another ModelList to the list at the specified index': function () {
        var list       = this.createList(),
            otherList  = this.createList(),
            modelOne   = this.createModel(),
            modelTwo   = this.createModel(),
            modelThree = this.createModel();

        otherList.add([modelOne, modelTwo, modelThree]);

        list.add([{name: 'first'}, {name: 'second'}, {name: 'third'}]);
        list.add(otherList, {index: 0});

        Assert.areSame(6, list.size(), 'list should contain 6 items');
        Assert.areSame(modelOne, list.item(0), 'modelOne should be inserted at index 0');
        Assert.areSame(modelTwo, list.item(1), 'modelTwo should be inserted at index 1');
        Assert.areSame(modelThree, list.item(2), 'modelThree should be inserted at index 2');
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

    'each() should iterate over the models in the list': function () {
        var calls = 0,
            list  = this.createList();

        list.add([
            {name: 'one'},
            {name: 'two'},
            {name: 'three'}
        ]);

        list.each(function (item, index, _list) {
            calls += 1;

            Assert.areSame(list.item(index), item);
            Assert.areSame(list, _list);
            Assert.areSame(item, this, '`this` should be the current item');
        });

        Assert.areSame(3, calls);
    },

    'each() should accept an optional context': function () {
        var calls = 0,
            list  = this.createList();

        list.add([
            {name: 'one'},
            {name: 'two'},
            {name: 'three'}
        ]);

        list.each(function (item, index, _list) {
            calls += 1;

            Assert.areSame(list.item(index), item);
            Assert.areSame(list, _list);
            Assert.areSame(list, this, '`this` should be the list');
        }, list);

        Assert.areSame(3, calls);
    },

    'each() should iterate over a copy of the list': function () {
        var calls = 0,
            list  = this.createList();

        list.add([
            {name: 'one'},
            {name: 'two'},
            {name: 'three'}
        ]);

        list.each(function (item, index, _list) {
            calls += 1;
            list.remove(item);
        });

        Assert.areSame(3, calls);
    },

    'filter() should filter the list and return an array': function () {
        var list = this.createList(),
            filtered;

        list.add([{foo: 'a'}, {foo: 'b'}, {foo: 'c'}, {foo: 'd'}]);
        Assert.areSame(4, list.size());

        filtered = list.filter(function (model, i, myList) {
            var foo = model.get('foo');

            Assert.areSame(model, list.item(i), 'model should be the first arg and item index the second');
            Assert.areSame(list, myList, 'list should be the third arg');
            Assert.areSame(list, this, '`this` object should be the ModelList');

            return foo === 'a' || foo === 'd';
        });

        Assert.isArray(filtered, 'return value should be an array');
        Assert.areSame(2, filtered.length, 'filtered array should contain two models');
        Assert.areSame('a', filtered[0].get('foo'));
        Assert.areSame('d', filtered[1].get('foo'));
    },

    'filter() should return an empty array if the callback never returns a truthy value': function () {
        var list = this.createList();

        list.add({foo: 'a'});
        Assert.areSame(0, list.filter(function () {}).length);
    },

    'filter() should return a new ModelList when options.asList is truthy': function () {
        var list = this.createList(),
            filtered;

        list.add([{foo: 'a'}, {foo: 'b'}, {foo: 'c'}, {foo: 'd'}]);
        Assert.areSame(4, list.size());

        filtered = list.filter({asList: true}, function (model, i, myList) {
            var foo = model.get('foo');

            Assert.areSame(model, list.item(i), 'model should be the first arg and item index the second');
            Assert.areSame(list, myList, 'list should be the third arg');
            Assert.areSame(list, this, '`this` object should be the ModelList');

            return foo === 'a' || foo === 'd';
        });

        Assert.isTrue(filtered._isYUIModelList, 'return value should be a ModelList instance');
        Assert.areSame(list.model, filtered.model, 'filtered list should have the same `model` property as the original list');
        Assert.areSame(2, filtered.size(), 'filtered list should contain two models');
        Assert.areSame('a', filtered.item(0).get('foo'));
        Assert.areSame('d', filtered.item(1).get('foo'));
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

    'load() should reset the list with the loaded items': function () {
        var calls = 0,
            list  = this.createList();

        list.sync = function (action, options, callback) {
            if (action === 'read') {
                callback(null, '[{"foo":"modelOne"}, {"foo":"modelTwo"}]');
            }
        };

        list.load(function (err) {
            calls += 1;

            Assert.isNull(err, 'load error should be null');
            Assert.areSame(2, list.size(), 'list should contain two models');
            Assert.areSame('modelOne', list.item(0).get('foo'), 'modelOne should be loaded correctly');
            Assert.areSame('modelTwo', list.item(1).get('foo'), 'modelTwo should be loaded correctly');
        });

        Assert.areSame(1, calls);
    },

    'load() callback should receive an error when a sync error occurs': function () {
        var calls = 0,
            list  = this.createList();

        list.sync = function (action, options, callback) {
            callback(new Error('OMG!'));
        };

        list.load(function (err) {
            calls += 1;

            Assert.isInstanceOf(Error, err);
            Assert.areSame('OMG!', err.message);
        });

        Assert.areSame(1, calls);
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

    'remove() should remove a single model from the list': function () {
        var list = this.createList();

        list.add([{foo: 'zero'}, {foo: 'one'}]);

        Assert.areSame('zero', list.remove(list.item(0)).get('foo'));
        Assert.areSame(1, list.size());
        Assert.areSame('one', list.item(0).get('foo'));
    },

    'remove() should remove a single model from the list by index': function () {
        var list = this.createList();

        list.add([{foo: 'zero'}, {foo: 'one'}]);

        Assert.areSame('zero', list.remove(0).get('foo'));
        Assert.areSame(1, list.size());
        Assert.areSame('one', list.item(0).get('foo'));
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

    'remove() should remove an array of models from the list by index': function () {
        var list = this.createList(),
            removed;

        list.add([{foo: 'zero'}, {foo: 'one'}, {foo: 'two'}]);
        removed = list.remove([1, 2]);

        Assert.areSame('one', removed[0].get('foo'));
        Assert.areSame('two', removed[1].get('foo'));
        Assert.areSame(1, list.size());
    },

    'remove() should remove models in another ModelList from the list': function () {
        var list        = this.createList(),
            otherList   = this.createList(),
            otherModels = [this.createModel(), this.createModel()];

        list.add(otherModels);
        otherList.add(otherModels);

        ArrayAssert.itemsAreSame(otherModels, list.remove(otherList), 'should return an array of removed models');
        Assert.areSame(0, list.size(), 'list should contain 0 models');
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

    'reset() should add models in another ModelList to the list': function () {
        var list        = this.createList(),
            otherList   = this.createList(),
            otherModels = [this.createModel(), this.createModel()];

        otherList.add(otherModels);
        list.add(otherList);

        Assert.areSame(2, list.size(), 'list should contain 2 models');
        Assert.areSame(otherList.item(0), list.item(0));
        Assert.areSame(otherList.item(1), list.item(1));
    },

    'reset() should support models created in other windows': function () {
        var list   = this.createList(),
            iframe = document.getElementById('test-iframe'),
            model  = iframe.contentWindow.iframeModel;

        list.reset([model]);

        Assert.areSame(model, list.item(0));
    },

    // 'set() should set a single attribute value on all models in the list': function () {
    //
    // },
    //
    // 'setAttrs() should set multiple attribute values on all models in the list': function () {
    //
    // },

    'some() should iterate over the models in the list and stop when the callback returns `true`': function () {
        var calls = 0,
            list  = this.createList();

        list.add([
            {name: 'one'},
            {name: 'two'},
            {name: 'three'}
        ]);

        Assert.isTrue(list.some(function (item, index, _list) {
            calls += 1;

            Assert.areSame(list.item(index), item);
            Assert.areSame(list, _list);
            Assert.areSame(item, this, '`this` should be the current item');

            if (item.get('name') === 'two') {
                return true;
            }
        }));

        Assert.isFalse(list.some(function () {}));
        Assert.areSame(2, calls);
    },

    'some() should accept an optional context': function () {
        var calls = 0,
            list  = this.createList();

        list.add([
            {name: 'one'},
            {name: 'two'},
            {name: 'three'}
        ]);

        list.some(function (item, index, _list) {
            calls += 1;

            Assert.areSame(list.item(index), item);
            Assert.areSame(list, _list);
            Assert.areSame(list, this, '`this` should be the list');
        }, list);

        Assert.areSame(3, calls);
    },

    'some() should iterate over a copy of the list': function () {
        var calls = 0,
            list  = this.createList();

        list.add([
            {name: 'one'},
            {name: 'two'},
            {name: 'three'}
        ]);

        list.some(function (item, index, _list) {
            calls += 1;
            list.remove(item);
        });

        Assert.areSame(3, calls);
    },

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

    '`error` event should fire when a model with a duplicate clientId is added': function () {
        var calls  = 0,
            list   = this.createList(),
            model  = this.createModel(),
            model2 = this.createModel();

        list.on('error', function (e) {
            calls += 1;

            Assert.areSame(model, e.model);
            Assert.areSame('add', e.src);
        });

        list.add([model, model2]);
        list.add(model, {src: 'test'});
        list.add({});

        Assert.areSame(1, calls);
    },

    '`error` event should fire when a model with a duplicate id is added': function () {
        var calls  = 0,
            list   = this.createList(),
            model  = this.createModel(),
            model2 = this.createModel(),
            model3 = this.createModel();

        model.set('id', 0);
        model3.set('id', 0);

        list.on('error', function (e) {
            calls += 1;
            Assert.areSame(model3, e.model);
        });

        list.add([model, model2]);
        list.add(model3);
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

    '`reset` event should allow the caller to override the `src` property on the event facade': function () {
        var calls = 0,
            list  = this.createList();

        list.once('reset', function (e) {
            calls += 1;
            Assert.areSame('monkeys', e.src);
        });

        list.reset([], {src: 'monkeys'});

        Assert.areSame(1, calls);
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
    },

    'list should update its id map when a model id changes': function () {
        var list      = this.createList(),
            bareModel = list.add({}),
            idModel   = list.add({id: 1});

        Assert.areSame(idModel, list.getById(1), 'model should initially be retrievable by id');

        bareModel.set('id', 0);
        idModel.set('id', 4);

        Assert.areSame(bareModel, list.getById(0), 'model with no previous id should be retrievable by its new id');
        Assert.areSame(idModel, list.getById(4), 'model with previous id should be retrievable by its new id');
    },

    'list should ignore id changes for models not in the list': function () {
        var list      = this.createList(),
            otherList = this.createList(),
            bareModel = otherList.add({}),
            idModel   = otherList.add({id: 1});

        bareModel.addTarget(list);
        idModel.addTarget(list);

        bareModel.set('id', 0);
        idModel.set('id', 4);

        Assert.isNull(list.getById(0), 'model with no previous id should not suddenly appear in this list');
        Assert.isNull(list.getById(4), 'model with previous id should not suddenly appear in this list');
    }
}));

suite.add(modelListSuite);

}, '@VERSION@', {
    requires: ['model-list', 'test']
});
