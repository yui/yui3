YUI.add('history-html5-test', function (Y) {

var win          = Y.config.win,
    lastLength,
    location     = win.location,
    noHTML5      = !Y.HistoryBase.html5,
    originalPath = location.pathname;

Y.Test.Runner.add(new Y.Test.Case({
    name: 'HistoryHTML5',

    _should: {
        // Ignore all tests in browsers without HTML5 history support.
        ignore: {
            'add() should change state': noHTML5,
            'add() should set a custom URL': noHTML5,
            'replace() should change state without a new history entry':  noHTML5,
            'replace() should set a custom URL': noHTML5
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
        win.history.pushState(null, '', originalPath); // reset the URL path
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
        // before the new state is pushed. Also, browsers limit history.length
        // to 50, so if we're already at 50 we have to skip this assertion.
        if (lastLength !== 50) {
            this.wait(function () {
                Y.Assert.areSame(lastLength + 1, win.history.length);
            }, 20);
        }
    },

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
        // before the new state is pushed. Also, browsers limit history.length
        // to 50, so if we're already at 50 we have to skip this assertion.
        if (lastLength !== 50) {
            this.wait(function () {
                Y.Assert.areSame(lastLength, win.history.length);
            }, 20);
        }
    },

    'replace() should set a custom URL': function () {
        this.history.replace({foo: 'bar', baz: 'quux'}, {url: '/foo'});
        Y.Assert.areSame('/foo', location.pathname);
    }
}));

}, '@VERSION@', {requires:['test', 'history-html5']});
