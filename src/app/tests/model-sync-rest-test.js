YUI.add('model-sync-rest-test', function (Y) {

var ArrayAssert  = Y.ArrayAssert,
    Assert       = Y.Assert,
    ObjectAssert = Y.ObjectAssert,

    suite,
    modelSyncRESTSuite;

// -- Global Suite -------------------------------------------------------------
suite = Y.AppTestSuite || (Y.AppTestSuite = new Y.Test.Suite('App Framework'));

// -- ModelSync.REST Suite -----------------------------------------------------
modelSyncRESTSuite = new Y.Test.Suite('ModelSync.REST');

// -- ModelSync.REST: Lifecycle ------------------------------------------------
modelSyncRESTSuite.add(new Y.Test.Case({
    name: 'Lifecycle',

    setUp: function () {
        Y.TestModel = Y.Base.create('customModel', Y.Model, [Y.ModelSync.REST]);

        Y.TestModelList = Y.Base.create('testModelList', Y.ModelList, [Y.ModelSync.REST], {
            model: Y.TestModel
        });
    },

    tearDown: function () {
        delete Y.TestModel;
        delete Y.TestModelList;
    },

    'initializer should set the `root` property on the instance': function () {
        var model     = new Y.TestModel({root: '/model/'}),
            modelList = new Y.TestModelList({root: '/list/'});

        Assert.areSame('/model/', model.root);
        Assert.areSame('/list/', modelList.root);
    },

    'initializer should set the `url` property on the instance': function () {
        var model     = new Y.TestModel({url: '/model/123'}),
            modelList = new Y.TestModelList({url: '/model'});

        Assert.areSame('/model/123', model.url);
        Assert.areSame('/model', modelList.url);
    }
}));

// -- ModelSync.REST: Properties -----------------------------------------------
modelSyncRESTSuite.add(new Y.Test.Case({
    name: 'Properties',

    setUp: function () {
        Y.TestModel = Y.Base.create('customModel', Y.Model, [Y.ModelSync.REST]);

        Y.TestModelList = Y.Base.create('testModelList', Y.ModelList, [Y.ModelSync.REST], {
            model: Y.TestModel
        });
    },

    tearDown: function () {
        delete Y.TestModel;
        delete Y.TestModelList;
    },

    '`root` property should be an empty string by default': function () {
        var model     = new Y.TestModel(),
            modelList = new Y.TestModelList();

        Assert.areSame('', model.root);
        Assert.areSame('', modelList.root);
    },

    '`url` property should be an empty string by default': function () {
        var model     = new Y.TestModel(),
            modelList = new Y.TestModelList();

        Assert.areSame('', model.url);
        Assert.areSame('', modelList.url);
    },

    'Static `CSRF_TOKEN` should default to the value of `YUI.Env.CSRF_TOKEN`': function () {
        Assert.areSame('asdf1234', YUI.Env.CSRF_TOKEN);
        Assert.areSame(YUI.Env.CSRF_TOKEN, Y.ModelSync.REST.CSRF_TOKEN);
    }
}));

// -- ModelSync.REST: Methods --------------------------------------------------
modelSyncRESTSuite.add(new Y.Test.Case({
    name: 'Methods',

    setUp: function () {
        Y.TestModel = Y.Base.create('customModel', Y.Model, [Y.ModelSync.REST]);

        Y.TestModelList = Y.Base.create('testModelList', Y.ModelList, [Y.ModelSync.REST], {
            model: Y.TestModel
        });
    },

    tearDown: function () {
        delete Y.TestModel;
        delete Y.TestModelList;
    },

    'getURL() should return an empty string by default': function () {
        var model     = new Y.TestModel(),
            modelList = new Y.TestModelList();

        Assert.isString(model.getURL());
        Assert.isString(modelList.getURL());

        Assert.areSame('', model.getURL());
        Assert.areSame('', modelList.getURL());
    },

    'getURL() of a model list should return the `root` of its model by default': function () {
        Y.TestModel.prototype.root = '/root/';

        var modelList = new Y.TestModelList();

        Assert.areSame('/root/', modelList.getURL());
    },

    'getURL() of a model list should return its `url` if defined': function () {
        Y.TestModel.prototype.root    = '/root/';
        Y.TestModelList.prototype.url = '/list/';

        var modelList = new Y.TestModelList();

        Assert.areSame('/list/', modelList.getURL());

        modelList.url = '/users/';

        Assert.areSame('/users/', modelList.getURL());
    },

    'getURL() of a new model should return its `root` if defined': function () {
        Y.TestModel.prototype.root = '/root/';

        var model = new Y.TestModel();

        Assert.isTrue(model.isNew());
        Assert.areSame('/root/', model.getURL());

        model.root = '/users/';

        Assert.areSame('/users/', model.getURL());
    },

    'getURL() of a model should return its `root` when the `action` is "create"': function () {
        Y.TestModel.prototype.root = '/root/';

        var model = new Y.TestModel({id: 1});

        Assert.isFalse(model.isNew());
        Assert.areSame('/root/', model.getURL('create'));

        model.root = '/users/';

        Assert.areSame('/users/', model.getURL('create'));
    },

    'getURL() of a model should return its `root` joined with its `id` by default': function () {
        Y.TestModel.prototype.root = '/root';

        var model = new Y.TestModel({id: 1});

        Assert.isFalse(model.isNew());
        Assert.areSame('/root/1', model.getURL());

        model.root = '/users';

        Assert.areSame('/users/1', model.getURL());
    },

    'getURL() of a model should return its `root` joined with its `id` and normalize slashes': function () {
        var model = new Y.TestModel({id: 1});

        model.root = 'users';
        Assert.areSame('users/1', model.getURL());

        model.root = 'users/';
        Assert.areSame('users/1/', model.getURL());

        model.root = '/users';
        Assert.areSame('/users/1', model.getURL());

        model.root = '/users/';
        Assert.areSame('/users/1/', model.getURL());
    },

    'getURL() of a model should return its `url` if defined': function () {
        Y.TestModel.prototype.url = '/users/1';

        var model = new Y.TestModel({id: 'foo'});

        Assert.isFalse(model.isNew());
        Assert.areSame('/users/1', model.getURL());

        model.url = '/users/bar';

        Assert.areSame('/users/bar', model.getURL());
    },

    'getURL() should substitute tokenized `url`s with attribute values': function () {
        var modelList = new Y.TestModelList({url: '/{type}/'}),
            model;

        modelList.addAttr('type', {value: 'users'});

        Assert.areSame('users', modelList.get('type'));
        Assert.areSame('/users/', modelList.getURL());

        model = modelList.add({
            id  : 1,
            type: modelList.get('type'),
            url : '/{type}/items/{id}/'
        });

        Assert.areSame(1, modelList.size());
        Assert.areSame('users', model.get('type'));
        Assert.areSame('/users/items/1/', model.getURL());
    },

    'getURL() should substitute tokenized `url`s with `options` values': function () {
        var model     = new Y.TestModel({url: '/{type}/foo/'}),
            modelList = new Y.TestModelList({url: '/{type}/'});

        Assert.areSame('/users/foo/', model.getURL(null, {type: 'users'}));
        Assert.areSame('/users/', modelList.getURL(null, {type: 'users'}));
    },

    'getURL() should substitute tokenized `url`s with attribute and `options` values': function () {
        var modelList = new Y.TestModelList({url: '/{type}/?num={num}'}),
            model;

        modelList.addAttr('type', {value: 'users'});

        Assert.areSame('users', modelList.get('type'));
        Assert.areSame('/users/?num=10', modelList.getURL(null, {num: 10}));

        Assert.areSame('/losers/?num=10', modelList.getURL(null, {
            num : 10,
            type: 'losers'
        }));

        model = modelList.add({
            id : 1,
            url: '/{type}/items/{id}/'
        });

        Assert.areSame(1, modelList.size());
        Assert.areSame(1, model.get('id'));
        Assert.areSame('/users/items/1/', model.getURL(null, {type: 'users'}));

        Assert.areSame('/losers/items/foo/', model.getURL(null, {
            id  : 'foo',
            type: 'losers'
        }));
    },

    'getURL() should URL-encode the `url` substitution values': function () {
        var model = new Y.TestModel({
            id : '123 456',
            url: '/model/{id}'
        });

        Assert.areSame('/model/123%20456', model.getURL());
    },

    'getURL() should not substitute Arrays, Objects, or Boolean values into the `url`' : function () {
        var model = new Y.TestModel({
            id : 'asdf',
            url: '/model/{foo}/{bar}/{baz}/{id}'
        });

        model.addAttrs({
            foo : {value: [1, 2, 3]},
            bar : {value: {zee: 'zee'}},
            baz : {value: true}
        });

        Assert.areSame('/model/{foo}/{bar}/{baz}/asdf', model.getURL());
    },

    'serialize() should return a JSON string by default': function () {
        var model = new Y.TestModel({id: 123});

        Assert.isString(model.serialize());
        Assert.areSame(Y.JSON.stringify(model), model.serialize());
        Assert.areSame(Y.JSON.stringify(model.toJSON()), model.serialize());
    }

}));

suite.add(modelSyncRESTSuite);

}, '@VERSION@', {
    requires: ['model-sync-rest', 'model', 'model-list', 'test']
});
