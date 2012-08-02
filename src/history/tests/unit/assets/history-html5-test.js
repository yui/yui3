YUI.add('history-html5-test', function (Y) {

var win              = Y.config.win,
    lastLength,
    location         = win.location,
    urlBug           = (Y.UA.chrome && Y.UA.chrome < 6) ||
                         (Y.UA.android && Y.UA.android < 2.4) ||
                         (Y.UA.webkit && navigator.vendor.indexOf('Apple') !== -1),
    noHTML5          = !Y.HistoryBase.html5,
    originalPath     = location.pathname;

Y.Test.Runner.add(new Y.Test.Case({
    name: 'HistoryHTML5',

    _should: {
        // Ignore all tests in browsers without HTML5 history support.
        ignore: {
            'Y.HistoryHTML5 constructor should accept an initialState config property': noHTML5,
            'Y.History should === Y.HistoryHTML5 when history-hash is not loaded': noHTML5,
            'add() should change state': noHTML5,
            'add() should set a custom URL': noHTML5 || urlBug,
            'replace() should change state without a new history entry':  noHTML5,
            'replace() should set a custom URL': noHTML5 || urlBug
        }
    },

    setUp: function () {
        YUI.Env.History._state = {};
        this.history = new Y.HistoryHTML5();
        lastLength = win.history.length;
    },

    tearDown: function () {
        Y.Global.detachAll('history:change');
        this.history.detachAll();
        delete this.history;

        if (!noHTML5) {
            win.history.pushState(null, '', originalPath); // reset the URL path
        }
    },

    // -- Constructor ----------------------------------------------------------
    // http://yuilibrary.com/projects/yui3/ticket/2529123
    'Y.HistoryHTML5 constructor should accept an initialState config property': function () {
        var history = new Y.HistoryHTML5({initialState: 'foo'});
        Y.Assert.areSame('foo', history.get());
    },

    // -- useHistoryHTML5 ------------------------------------------------------
    'Y.History should === Y.HistoryHTML5 by default except when not supported': function () {
        if (noHTML5) {
            Y.Assert.areSame(Y.HistoryHash, Y.History);
        } else {
            Y.Assert.areSame(Y.HistoryHTML5, Y.History);
        }
    },

    'Y.config.useHistoryHTML5 should specify the behavior of the Y.History alias': function () {
        var Z;

        // This gets a littly nutty, so just bear with me here.
        Z = YUI({useHistoryHTML5: false}).use('history-html5');
        Y.Assert.isNotUndefined(Z.HistoryHTML5);
        Y.Assert.isUndefined(Z.History);

        Z = YUI({useHistoryHTML5: false}).use('history-hash', 'history-html5');
        Y.Assert.isNotUndefined(Z.HistoryHash);
        Y.Assert.isNotUndefined(Z.HistoryHTML5);
        Y.Assert.areSame(Z.History, Z.HistoryHash);

        Z = YUI({useHistoryHTML5: true}).use('history-hash');
        Y.Assert.isNotUndefined(Z.HistoryHash);
        Y.Assert.isUndefined(Z.History);

        Z = YUI({useHistoryHTML5: true}).use('history-hash', 'history-html5');
        Y.Assert.isNotUndefined(Z.HistoryHash);
        Y.Assert.isNotUndefined(Z.HistoryHTML5);
        Y.Assert.areSame(Z.History, Z.HistoryHTML5);
    },

    // -- add() ----------------------------------------------------------------
    'add() should change state': function () {
        var changeFired = false;

        this.history.once('change', function (e) {
            changeFired = true;
            Y.Assert.areSame(Y.HistoryBase.SRC_ADD, e.src);
            Y.Assert.areSame('bar', e.newVal.foo);
            Y.Assert.areSame('quux', e.newVal.baz);
        });

        this.history.add({foo: 'bar', baz: 'quux'});
        Y.Assert.isTrue(changeFired);

        // Delay is necessary since the history:change event actually fires
        // before the new state is pushed. Also, some browsers limit
        // history.length to 50, so if we're already at 50 we have to skip this
        // assertion.
        if (lastLength < 50) {
            this.wait(function () {
                Y.Assert.areSame(lastLength + 1, win.history.length);
            }, 20);
        }
    },

    // Note: Google Chrome <= 5 is buggy and doesn't update location.href or
    // location.pathname when the URL is changed via pushState() or
    // replaceState(), so it's excluded from this test. This bug is not present
    // in Chrome 6.
    'add() should set a custom URL': function () {
        this.history.add({foo: 'bar', baz: 'quux'}, {url: '/foo'});
        Y.Assert.areSame('/foo', location.pathname);
    },

    // -- replace() ------------------------------------------------------------
    'replace() should change state without a new history entry': function () {
        var changeFired = false;

        this.history.once('change', function (e) {
            changeFired = true;
            Y.Assert.areSame(Y.HistoryBase.SRC_REPLACE, e.src);
            Y.Assert.areSame('bar', e.newVal.foo);
            Y.Assert.areSame('quux', e.newVal.baz);
        });

        this.history.replace({foo: 'bar', baz: 'quux'});
        Y.Assert.isTrue(changeFired);

        // Delay is necessary since the history:change event actually fires
        // before the new state is pushed. Also, some browsers limit
        // history.length to 50, so if we're already at 50 we have to skip this
        // assertion.
        if (lastLength < 50) {
            this.wait(function () {
                Y.Assert.areSame(lastLength, win.history.length);
            }, 20);
        }
    },

    // Note: Google Chrome <= 5 is buggy and doesn't update location.href or
    // location.pathname when the URL is changed via pushState() or
    // replaceState(), so it's excluded from this test. This bug is not present
    // in Chrome 6.
    'replace() should set a custom URL': function () {
        this.history.replace({foo: 'bar', baz: 'quux'}, {url: '/foo'});
        Y.Assert.areSame('/foo', location.pathname);
    }
}));

}, '@VERSION@', {requires:['test', 'history-hash', 'history-html5', 'json']});
