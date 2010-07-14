YUI.add('history-base-test', function (Y) {

var Obj = Y.Object;

Y.Test.Runner.add(new Y.Test.Case({
    name: 'HistoryBase',

    setUp: function () {
        YUI.Env.History._state = {};
        this.history = new Y.HistoryBase();
    },

    tearDown: function () {
        Y.Global.detachAll('history:change');
        this.history.detachAll();
        delete this.history;
    },

    // -- Constructor ----------------------------------------------------------
    'Initial state should be an empty object by default': function () {
        var state = this.history.get();

        Y.Assert.isObject(state);
        Y.ObjectAssert.ownsNoKeys(state);
    },

    'Constructor should accept a config object containing an initial state': function () {
        var history = new Y.HistoryBase({initialState: {foo: 'bar'}});
        Y.Assert.areSame('bar', history.get().foo);

        history = new Y.HistoryBase({initialState: 'kittens'});
        Y.Assert.areSame('kittens', history.get());
    },

    "Constructor should ignore an argument that isn't an object hash": function () {
        var history = new Y.HistoryBase('foo');
        Y.ObjectAssert.ownsNoKeys(history.get());

        history = new Y.HistoryBase(['foo']);
        Y.ObjectAssert.ownsNoKeys(history.get());

        history = new Y.HistoryBase(function () {});
        Y.ObjectAssert.ownsNoKeys(history.get());
    },

    // -- Static Properties ----------------------------------------------------
    'HistoryBase should have a static boolean html5 property': function () {
        Y.Assert.isBoolean(Y.HistoryBase.html5);
    },

    'HistoryBase should have a static boolean nativeHashChange property': function () {
        Y.Assert.isBoolean(Y.HistoryBase.nativeHashChange);
    },

    // -- _resolveChanges() ----------------------------------------------------
    '_resolveChanges() should change the state and fire events': function () {
        var handler = Y.Mock();

        Y.Mock.expect(handler, {
            method: 'onGlobalChange',
            args  : [Y.Mock.Value.Object]
        });

        Y.Mock.expect(handler, {
            method: 'onChange',
            args  : [Y.Mock.Value.Object]
        });

        Y.Mock.expect(handler, {
            method: 'onFooChange',
            args  : [Y.Mock.Value.Object]
        });

        Y.Mock.expect(handler, {
            method: 'onBazChange',
            args  : [Y.Mock.Value.Object]
        });

        Y.Mock.expect(handler, {
            method: 'onFooRemove',
            args  : [Y.Mock.Value.Object]
        });

        Y.Global.once('history:change', handler.onGlobalChange);
        this.history.once('change', handler.onChange);
        this.history.once('fooChange', handler.onFooChange);
        this.history.once('bazChange', handler.onBazChange);
        this.history.once('fooRemove', handler.onFooRemove);

        this.history._resolveChanges('test', {foo: 'bar', baz: 'quux'});
        Y.Assert.areSame('bar', this.history.get().foo);

        this.history._resolveChanges('test', {foo: null});
        Y.Assert.isUndefined(this.history.get().foo);

        Y.Mock.verify(handler);
    },

    '_resolveChanges() should pass the src param to events': function () {
        Y.Global.once('history:change', function (e) {
            Y.Assert.areSame('test', e.src);
        });

        this.history.once('change', function (e) {
            Y.Assert.areSame('test', e.src);
        });

        this.history.once('fooChange', function (e) {
            Y.Assert.areSame('test', e.src);
        });

        this.history.once('fooRemove', function (e) {
            Y.Assert.areSame('another test', e.src);
        });

        this.history._resolveChanges('test', {foo: 'bar'});
        Y.Assert.areSame('bar', this.history.get().foo);

        this.history._resolveChanges('another test', {foo: null});
        Y.Assert.isUndefined(this.history.get().foo);
    },

    '_resolveChanges() should not fire events when there are no changes': function () {
        this.history._resolveChanges('test', {foo: 'bar'});

        Y.Global.on('history:change', function () {
            Y.Assert.fail("Global change event fired when it shouldn't have.");
        });

        this.history.on('change', function () {
            Y.Assert.fail("Local change event fired when it shouldn't have.");
        });

        this.history.on('fooChange', function () {
            Y.Assert.fail("fooChange event fired when it shouldn't have.");
        });

        this.history._resolveChanges('test', {foo: 'bar'});
    },

    'local events should not fire for changes in other HistoryBase instances': function () {
        var handler  = new Y.Mock(),
            history2 = new Y.HistoryBase();

        Y.Mock.expect(handler, {
            method: 'onChange',
            args  : [Y.Mock.Value.Object]
        });

        this.history.on('change', function () {
            Y.Assert.fail("Local change event fired when it shouldn't have.");
        });

        this.history.on('fooChange', function () {
            Y.Assert.fail("fooChange event fired when it shouldn't have.");
        });

        this.history.on('fooRemove', function () {
            Y.Assert.fail("fooRemove event fired when it shouldn't have.");
        });

        history2.once('change', handler.onChange);
        history2._resolveChanges('test', {foo: 'bar'});
        history2._resolveChanges('test', {foo: null});

        Y.Mock.verify(handler);
    },

    // -- add() ----------------------------------------------------------------
    'add() should change state with the correct event src': function () {
        var changeFired = false;

        this.history.on('change', function (e) {
            changeFired = true;
            Y.Assert.areSame(Y.HistoryBase.SRC_ADD, e.src);
        });

        this.history.add({foo: 'bar'});
        Y.Assert.isTrue(changeFired);
    },

    'add() should merge states when the "merge" option is true': function () {
        this.history.add({foo: 'bar'});
        Y.Assert.areSame('bar', this.history.get('foo'));
        Y.Assert.areSame(1, Obj.size(this.history.get()));

        this.history.add({baz: 'quux'});
        Y.Assert.areSame('quux', this.history.get('baz'));
        Y.Assert.areSame(2, Obj.size(this.history.get()));
    },

    'add() should not merge states when the "merge" option is false': function () {
        this.history.add({foo: 'bar'});
        Y.Assert.areSame('bar', this.history.get('foo'));
        Y.Assert.areSame(1, Obj.size(this.history.get()));

        this.history.add({baz: 'quux'}, {merge: false});
        Y.Assert.areSame('quux', this.history.get('baz'));
        Y.Assert.areSame(1, Obj.size(this.history.get()));
    },

    'add() should allow non-object states': function () {
        this.history.add('pants');
        Y.Assert.areSame('pants', this.history.get());
    },

    // -- addValue() -----------------------------------------------------------
    'addValue() should change state with the correct event src': function () {
        var changeFired = false;

        this.history.on('change', function (e) {
            changeFired = true;
            Y.Assert.areSame(Y.HistoryBase.SRC_ADD, e.src);
        });

        this.history.addValue('foo', 'bar');
        Y.Assert.isTrue(changeFired);
    },

    'addValue() should merge states when the "merge" option is true': function () {
        this.history.addValue('foo', 'bar');
        Y.Assert.areSame('bar', this.history.get('foo'));
        Y.Assert.areSame(1, Obj.size(this.history.get()));

        this.history.addValue('baz', 'quux');
        Y.Assert.areSame('quux', this.history.get('baz'));
        Y.Assert.areSame(2, Obj.size(this.history.get()));
    },

    'addValue() should not merge states when the "merge" option is false': function () {
        this.history.addValue('foo', 'bar');
        Y.Assert.areSame('bar', this.history.get('foo'));
        Y.Assert.areSame(1, Obj.size(this.history.get()));

        this.history.addValue('baz', 'quux', {merge: false});
        Y.Assert.areSame('quux', this.history.get('baz'));
        Y.Assert.areSame(1, Obj.size(this.history.get()));
    },

    // -- replace() ------------------------------------------------------------
    'replace() should change state with the correct event src': function () {
        var changeFired = false;

        this.history.on('change', function (e) {
            changeFired = true;
            Y.Assert.areSame(Y.HistoryBase.SRC_REPLACE, e.src);
        });

        this.history.replace({foo: 'bar'});
        Y.Assert.isTrue(changeFired);
    },

    'replace() should merge states when the "merge" option is true': function () {
        this.history.replace({foo: 'bar'});
        Y.Assert.areSame('bar', this.history.get('foo'));
        Y.Assert.areSame(1, Obj.size(this.history.get()));

        this.history.replace({baz: 'quux'});
        Y.Assert.areSame('quux', this.history.get('baz'));
        Y.Assert.areSame(2, Obj.size(this.history.get()));
    },

    'replace() should not merge states when the "merge" option is false': function () {
        this.history.replace({foo: 'bar'});
        Y.Assert.areSame('bar', this.history.get('foo'));
        Y.Assert.areSame(1, Obj.size(this.history.get()));

        this.history.replace({baz: 'quux'}, {merge: false});
        Y.Assert.areSame('quux', this.history.get('baz'));
        Y.Assert.areSame(1, Obj.size(this.history.get()));
    },

    // -- replaceValue() -------------------------------------------------------
    'replaceValue() should change state with the correct event src': function () {
        var changeFired = false;

        this.history.on('change', function (e) {
            changeFired = true;
            Y.Assert.areSame(Y.HistoryBase.SRC_REPLACE, e.src);
        });

        this.history.replaceValue('foo', 'bar');
        Y.Assert.isTrue(changeFired);
    },

    'replaceValue() should merge states when the "merge" option is true': function () {
        this.history.replaceValue('foo', 'bar');
        Y.Assert.areSame('bar', this.history.get('foo'));
        Y.Assert.areSame(1, Obj.size(this.history.get()));

        this.history.replaceValue('baz', 'quux');
        Y.Assert.areSame('quux', this.history.get('baz'));
        Y.Assert.areSame(2, Obj.size(this.history.get()));
    },

    'replaceValue() should not merge states when the "merge" option is false': function () {
        this.history.replaceValue('foo', 'bar');
        Y.Assert.areSame('bar', this.history.get('foo'));
        Y.Assert.areSame(1, Obj.size(this.history.get()));

        this.history.replaceValue('baz', 'quux', {merge: false});
        Y.Assert.areSame('quux', this.history.get('baz'));
        Y.Assert.areSame(1, Obj.size(this.history.get()));
    }
}));

}, '@VERSION@', {requires:['test', 'history-base']});
