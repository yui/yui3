YUI.add('lazy-model-list-test', function (Y) {

var ArrayAssert  = Y.ArrayAssert,
    Assert       = Y.Assert,
    ObjectAssert = Y.ObjectAssert,

    suite,
    lazyModelListSuite;

// -- Global Suite -------------------------------------------------------------
suite = Y.AppTestSuite || (Y.AppTestSuite = new Y.Test.Suite('App'));

// -- LazyModelList Suite ------------------------------------------------------
lazyModelListSuite = new Y.Test.Suite('LazyModelList');

// -- LazyModelList: Lifecycle -------------------------------------------------
lazyModelListSuite.add(new Y.Test.Case({
    name: 'Lifecycle',

    setUp: function () {
        this.list = new Y.LazyModelList({model: Y.Model});
    },

    tearDown: function () {
        delete this.list;
    },

    'destructor should detach all revived models from the list': function () {
        var model;

        this.list.add({foo: 'bar'});
        model = this.list.revive(0);

        Assert.areSame(this.list, model.lists[0]);

        this.list.destroy();
        ArrayAssert.isEmpty(model.lists);
    }
}));

// -- LazyModelList: Methods ---------------------------------------------------
lazyModelListSuite.add(new Y.Test.Case({
    name: 'Methods',

    setUp: function () {
        this.list = new Y.LazyModelList();
    },

    tearDown: function () {
        delete this.list;
    },

    'add() should add everything as objects, not models': function () {
        var item  = {foo: 'bar'},
            model = new Y.Model({foo: 'moo'}),
            modelObj,
            items;

        Assert.areSame(item, this.list.add(item), 'add() should return the added object');
        Assert.areSame(item, this.list.item(0), 'added item should be an object, not a model');

        modelObj = this.list.add(model);
        Assert.isObject(modelObj, 'added model should be converted to an object');
        Assert.areSame('moo', modelObj.foo);

        items = this.list.add([
            {foo: 'one'},
            {foo: 'two'},
            new Y.Model({foo: 'three'})
        ]);

        Assert.areSame('one', items[0].foo);
        Assert.areSame('two', items[1].foo);
        Assert.areSame('three', items[2].foo);
    },

    'add() should generate a clientId for added objects if necessary': function () {
        var item = {foo: 'bar'};

        this.list.add(item);
        Assert.isString(item.clientId);
    },

    'free() should free the given model or model index': function () {
        var model;

        this.list.add({foo: 'bar'});
        model = this.list.revive(0);

        Assert.areSame(model, this.list._models[0]);
        Assert.areSame(this.list, this.list.free(model));
        Assert.isUndefined(this.list._models[0]);

        model = this.list.revive(0);
        Assert.areSame(model, this.list._models[0]);
        this.list.free(0);
        Assert.isUndefined(this.list._models[0]);
    },

    'free() with no args should free all models': function () {
        this.list.add([{foo: 'bar'}, {foo: 'baz'}]);
        this.list.revive(0);
        this.list.revive(1);

        Assert.areSame('bar', this.list._models[0].get('foo'));
        Assert.areSame('baz', this.list._models[1].get('foo'));

        this.list.free();

        Assert.isUndefined(this.list._models[0]);
        Assert.isUndefined(this.list._models[1]);
    },

    'get() should get properties, not attributes': function () {
        this.list.add([{foo: 'one'}, {foo: 'two'}]);
        ArrayAssert.itemsAreSame(['one', 'two'], this.list.get('foo'));
    },

    'getAsHTML() should get properties, not attributes': function () {
        this.list.add([{foo: '<one'}, {foo: '<two'}]);
        ArrayAssert.itemsAreSame(['&lt;one', '&lt;two'], this.list.getAsHTML('foo'));
    },

    'getAsURL() should get properties, not attributes': function () {
        this.list.add([{foo: '?one'}, {foo: '?two'}]);
        ArrayAssert.itemsAreSame(['%3Fone', '%3Ftwo'], this.list.getAsURL('foo'));
    },

    'indexOf() should find objects in the list': function () {
        var item = {foo: 'bar'};

        this.list.add([{foo: 'baz'}, item]);

        Assert.areSame(1, this.list.indexOf(item));
        Assert.areSame(-1, this.list.indexOf({}));
    },

    'indexOf() should find revived models in the list': function () {
        var model;

        this.list.add([{foo: 'bar'}, {foo: 'baz'}]);
        model = this.list.revive(1);

        Assert.areSame(1, this.list.indexOf(model));
        Assert.areSame(-1, this.list.indexOf(new Y.Model()));
    },

    'remove() should accept both objects and models': function () {
        var item = {foo: 'bar'},
            model;

        this.list.add(item);

        Assert.areSame(1, this.list.size());
        Assert.areSame(item, this.list.remove(item));
        Assert.areSame(0, this.list.size());

        this.list.add(item);
        model = this.list.revive(0);

        Assert.areSame(1, this.list.size());
        Assert.areSame('bar', this.list.remove(model).foo);
        Assert.areSame(0, this.list.size());
    },

    'remove() should maintain indices for revived models': function () {
        this.list.add([{foo: 'zero'}, {foo: 'one'}, {foo: 'two'}]);

        Assert.areSame('one', this.list.revive(1).get('foo'));
        this.list.remove(0);

        Assert.areSame('two', this.list.item(1).foo);
        Assert.areSame('two', this.list.revive(1).get('foo'));
        Assert.areSame('one', this.list.revive(0).get('foo'))
    },

    'reset() should accept an array of objects/models or a ModelList': function () {
        var items     = [{foo: 'one'}, {foo: 'two'}],
            models    = [new Y.Model({foo: 'three'}), new Y.Model({foo: 'four'})],
            modelList = new Y.ModelList();

        modelList.add([{foo: 'five'}, {foo: 'six'}]);

        this.list.add({foo: 'bogus'});
        Assert.areSame(1, this.list.size());

        this.list.reset(items);
        Assert.areSame(2, this.list.size());
        Assert.areSame('one', this.list.item(0).foo);
        Assert.areSame('two', this.list.item(1).foo);

        this.list.reset(models);
        Assert.areSame(2, this.list.size());
        Assert.areSame('three', this.list.item(0).foo)
        Assert.areSame('four', this.list.item(1).foo);

        this.list.reset(modelList);
        Assert.areSame(2, this.list.size());
        Assert.areSame('five', this.list.item(0).foo)
        Assert.areSame('six', this.list.item(1).foo);
    },

    'revive() should revive an index into a model': function () {
        var model;

        this.list.add({foo: 'bar'});
        model = this.list.revive(0);

        Assert.isInstanceOf(Y.Model, model);
        Assert.areSame('bar', model.get('foo'));
        Assert.areSame(model, this.list._models[0], 'model instance should be cached');
        Assert.areSame(model, this.list.revive(0), 'model instance should still be cached');
        Assert.isNull(this.list.revive(1));
    },

    'revive() should revive an object into a model': function () {
        var model;

        this.list.add({foo: 'bar'});
        model = this.list.revive(this.list.item(0));

        Assert.isInstanceOf(Y.Model, model);
        Assert.areSame('bar', model.get('foo'));
        Assert.areSame(model, this.list._models[0], 'model instance should be cached');
        Assert.areSame(model, this.list.revive(this.list.item(0)), 'model instance should still be cached');
    },

    'revive() with no args should revive all models in the list': function () {
        var models;

        this.list.add([{foo: 'bar'}, {foo: 'baz'}]);
        models = this.list.revive();

        Assert.isArray(models);
        Assert.areSame(2, models.length);
        Assert.isInstanceOf(Y.Model, models[0]);
        Assert.isInstanceOf(Y.Model, models[1]);
        Assert.areSame('bar', models[0].get('foo'));
        Assert.areSame('baz', models[1].get('foo'));
    },

    'revive() should preserve clientIds': function () {
        this.list.add({foo: 'bar', clientId: 'model-foo'});

        var model = this.list.revive(0);

        Assert.areSame('model-foo', model.get('clientId'), 'revived model should have the same clientId as the original object');
    },

    'Changing an attribute on a revived model should update the original object': function () {
        this.list.add({foo: 'bar'});

        var model = this.list.revive(0);
        model.set('foo', 'baz');

        Assert.areSame('baz', this.list.item(0).foo, 'original object should have the new value');
    },

    '_isInList() should indicate whether an item is in the list': function () {
        var item = {foo: 'bar'};

        this.list.add(item);

        Assert.isTrue(this.list._isInList(item));
        Assert.isFalse(this.list._isInList({}));
    },

    '_modelToObject() should convert a model instance to a plain object': function () {
        var model = new Y.Model({foo: 'bar'}),
            item  = this.list._modelToObject(model);

        Assert.areSame('bar', item.foo);
    }
}));

suite.add(lazyModelListSuite);

}, '@VERSION@', {
    requires: ['lazy-model-list', 'test']
});
