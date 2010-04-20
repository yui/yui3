YUI.add('history-base-test', function (Y) {

Y.HistoryBaseTest = new Y.Test.Case({
    name: 'history-base',

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

    'Constructor should accept an object hash as the initial state': function () {
        var history = new Y.HistoryBase({foo: 'bar'});
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

        Y.Global.on('history:change', handler.onGlobalChange);
        this.history.on('change', handler.onChange);
        this.history.on('fooChange', handler.onFooChange);
        this.history.on('bazChange', handler.onBazChange);

        this.history._resolveChanges({foo: 'bar', baz: 'quux'});
        Y.Assert.areSame(this.history.get().foo, 'bar');

        Y.Mock.verify(handler);
    },

    '_resolveChanges(true) should change the state silently': function () {
        Y.Global.on('history:change', function () {
            Y.Assert.fail("Global change event fired when it shouldn't have.");
        });

        this.history.on('change', function () {
            Y.Assert.fail("Local change event fired when it shouldn't have.");
        });

        this.history.on('fooChange', function () {
            Y.Assert.fail("fooChange event fired when it shouldn't have.");
        });

        this.history._resolveChanges({foo: 'bar'}, true);
        Y.Assert.areSame(this.history.get().foo, 'bar');
    },

    '_resolveChanges() should not fire events when there are no changes': function () {
        Y.Global.on('history:change', function () {
            Y.Assert.fail("Global change event fired when it shouldn't have.");
        });

        this.history.on('change', function () {
            Y.Assert.fail("Local change event fired when it shouldn't have.");
        });

        this.history.on('fooChange', function () {
            Y.Assert.fail("fooChange event fired when it shouldn't have.");
        });

        this.history._resolveChanges({});
        this.history._resolveChanges({foo: 'bar'}, true); // silent
        this.history._resolveChanges({foo: 'bar'});
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

        history2.on('change', handler.onChange);
        history2._resolveChanges({foo: 'bar'});

        Y.Mock.verify(handler);
    }
});

}, '@VERSION@', {requires:['test', 'history-base']});
