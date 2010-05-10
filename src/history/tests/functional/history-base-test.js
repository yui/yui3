YUI.add('history-base-test', function (Y) {

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
        Y.Assert.areSame(history.get().foo, 'bar');
    },

    "Constructor should ignore an argument that isn't an object hash": function () {
        var history = new Y.HistoryBase('foo');
        Y.ObjectAssert.ownsNoKeys(history.get());

        history = new Y.HistoryBase(['foo']);
        Y.ObjectAssert.ownsNoKeys(history.get());

        history = new Y.HistoryBase(function () {});
        Y.ObjectAssert.ownsNoKeys(history.get());
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

    'add() should support changing a single item': function () {
        Y.Assert.isUndefined(this.history.get('foo'));
        this.history.add('foo', 'bar');
        Y.Assert.areSame('bar', this.history.get('foo'));
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

    'replace() should support changing a single item': function () {
        Y.Assert.isUndefined(this.history.get('foo'));
        this.history.replace('foo', 'bar');
        Y.Assert.areSame('bar', this.history.get('foo'));
    }
}));

}, '@VERSION@', {requires:['test', 'history-base']});
