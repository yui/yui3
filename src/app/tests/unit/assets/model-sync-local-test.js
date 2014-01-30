YUI.add('model-sync-local-test', function (Y) {

var ArrayAssert  = Y.ArrayAssert,
    Assert       = Y.Assert,
    ObjectAssert = Y.ObjectAssert,
    hasLocalStorage = Y.ModelSync.Local._hasLocalStorage,

    suite,
    modelSyncLocalSuite;

// -- Global Suite -------------------------------------------------------------
suite = Y.AppTestSuite || (Y.AppTestSuite = new Y.Test.Suite('App Framework'));

// -- ModelSync.Local Suite ----------------------------------------------------
modelSyncLocalSuite = new Y.Test.Suite('ModelSync.Local');

// -- ModelSync.Local: Lifecycle -----------------------------------------------
modelSyncLocalSuite.add(new Y.Test.Case({
    name: 'Lifecycle',

    _should: {
        ignore: {
            '`localStorage` should be set to the `storage` property': !hasLocalStorage,
            '`data` property should be filled with any existing `localStorage` data': !hasLocalStorage
        }
    },
    
    setUp: function () {
        var store;

        try {
            store = Y.config.win.localStorage;
            store.clear();
        } catch (e) {
            Y.log("Could not access localStorage.", "warn");
        }

        Y.TestModel = Y.Base.create('customModel', Y.Model, [Y.ModelSync.Local]);

        Y.TestModelList = Y.Base.create('testModelList', Y.ModelList, [Y.ModelSync.Local], {
            model: Y.TestModel
        })
    },

    tearDown: function () {
        delete Y.TestModel;
        delete Y.TestModelList;

        try {
            Y.config.win.localStorage.clear();
        } catch (e) {
            Y.log("Could not access localStorage.", "warn");
        }
    },

    'initializer should set the `root` property on the instance': function () {
        var model     = new Y.TestModel({root: 'model'}),
            modelList = new Y.TestModelList({root: 'list'});

        Assert.areSame('model', model.root);
        Assert.areSame('list', modelList.root);
    },
    
    '`root` property should be an empty string by default': function () {
        var model     = new Y.TestModel(),
            modelList = new Y.TestModelList();
            
        Assert.areSame('', model.root);
        Assert.areSame('', modelList.root);
    },
    
    '`localStorage` should be set to the `storage` property': function () {
        var model      = new Y.TestModel(),
            modelList  = new Y.TestModelList(),
            test       = 'test',
            hasStorage = function(context) {
                if (context && context.storage && context.storage.setItem) {
                    context.storage.setItem(test, test);
                    context.storage.removeItem(test);
                    return true;
                } else {
                    return false;
                }
            };
            
        Assert.isTrue(hasStorage(model), 'Model storage not properly set');
        Assert.isTrue(hasStorage(modelList), 'List storage not properly set');
    },
    
    '`data` property should be filled with any existing `localStorage` data': function () {
        var testStore;
        try {
            testStore = Y.config.win.localStorage;
            testStore.setItem('users', 'users-1|users-2');
            testStore.setItem('users-1', '{"id": "users-1", "name": "clarle"}');
            testStore.setItem('users-2', '{"id": "users-2", "name": "eric"}');
        } catch (e) {
            Y.log("Could not access localStorage.", "warn");
        }
        
        var model     = new Y.TestModel({root: 'users', id: 'users-1'}),
            modelList = new Y.TestModelList({ root: 'users'}),
            data      = Y.ModelSync.Local._data;

        Assert.areSame('clarle', data['users-1']['name']);
    }
}));

// -- ModelSync.Local: Sync ----------------------------------------------------
modelSyncLocalSuite.add(new Y.Test.Case({
    name: 'Sync',

    setUp: function () {
        if (hasLocalStorage) { 
            testStore = Y.config.win.localStorage;
            testStore.clear();
            testStore.setItem('users', 'users-1|users-2|users-3');
            testStore.setItem('users-1', '{"id": "users-1", "name": "clarle"}');
            testStore.setItem('users-2', '{"id": "users-2", "name": "eric"}');
            testStore.setItem('users-3', '{"id": "users-3", "name": "ryan"}');
        } else { 
            Y.ModelSync.Local._store['users'] = ['users-1', 'users-2', 'users-3'];
            Y.ModelSync.Local._data['users-1'] = { id: 'users-1', name: 'clarle' };
            Y.ModelSync.Local._data['users-2'] = { id: 'users-2', name: 'eric' };
            Y.ModelSync.Local._data['users-3'] = { id: 'users-3', name: 'ryan' };
        }

        Y.TestModel = Y.Base.create('user', Y.Model, [Y.ModelSync.Local], {
            root: 'users'   
        });

        Y.TestModelList = Y.Base.create('users', Y.ModelList, [Y.ModelSync.Local], {
            model: Y.TestModel
        })
    },

    tearDown: function () {
        delete Y.TestModel;
        delete Y.TestModelList;
        try {
            Y.config.win.localStorage.clear();
        } catch (e) {
            Y.log("Could not access localStorage.", "warn");
        }
    },

    'load() of Model should get the stored local object': function () {
        var model = new Y.TestModel({id: 'users-1'});
        model.load();
        Assert.areSame('clarle', model.get('name'));
    },

    'load() of ModelList should get all stored local objects in the right order': function () {
        var modelList = new Y.TestModelList(),
            users = ['clarle', 'eric', 'ryan'];

        Assert.areSame('users', modelList.root);

        modelList.load();
        Assert.areSame(3, modelList.size());

        for (var i = 0; i < modelList.size(); i++) {
            Assert.areSame('users-' + (i+1), modelList.item(i).get('id'));
            Assert.areSame(users[i], modelList.item(i).get('name'));
        }
    },

    'save() of a new Model should create a new object with an ID': function () {
        var model = new Y.TestModel({name: 'dav'});
        
        Assert.isUndefined(model.get('id'), 'Initial model ID should be undefined.');
        model.save();
        Assert.isNotNull(model.get('id'), 'Model ID should not be null');
        Assert.areSame('dav', model.get('name'), 'Model should have correct name');
    },

    'save() of an existing Model should update the object': function () {
        var model = new Y.TestModel({id: 'users-2'});
        model.load();
        Assert.areSame('eric', model.get('name'), 'Model should have correct name');
        model.set('name', 'satyen');
        model.save();
        Assert.areSame('satyen', model.get('name'), 'Model should have updated name');
    },

    'destroy({remove: true}) of an existing Model should delete the object': function () {
        var model = new Y.TestModel({id: 'users-1'}),
            data;

        model.load();
        Assert.areSame('clarle', model.get('name'), 'Model should have correct name');
        model.destroy({remove: true});
        
        data = Y.ModelSync.Local._data;
        Assert.isUndefined(data['users-1'], 'Data should be deleted');
    },

    'Failed lookups should pass an error message to the callback': function () {
        var model = new Y.TestModel({id: 'users-4'});

        model.sync('read', {}, function (err, res) {
            Assert.areSame('Data not found in LocalStorage', err);
        });
    },

    'Failed syncs due to errors should pass an error message to the callback': function () {
        var model = new Y.TestModel({id: 'users-5'});

        model._save = function () {
            throw new Error('Failed sync');
        };

        model.set('name', 'jeff');
        model.save(function (err, res) {
            Assert.areSame('Failed sync', err);
        });
    }
}));


suite.add(modelSyncLocalSuite);

}, '@VERSION@', {
    requires: ['model-sync-local', 'model', 'model-list', 'test']
});
