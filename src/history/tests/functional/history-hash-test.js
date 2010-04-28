YUI.add('history-hash-test', function (Y) {

var Obj = Y.Object,

    win      = Y.config.win,
    location = win.location,
    waitTime = 100;

Y.HistoryTest = new Y.Test.Case({
    name: 'history-hash',

    _should: {
        ignore: {
            'hashchange should expose appropriate properties on its event facade': !Y.History.nativeHashChange
        }
    },

    setUp: function () {
        this.history = new Y.History();
    },

    tearDown: function () {
        delete this.history;
    },

    // -- Static Properties and Methods ----------------------------------------
    'History should have a static boolean nativeHashChange property': function () {
        Y.Assert.isBoolean(Y.History.nativeHashChange);
    },

    'createHash() should create a hash string from an object': function () {
        Y.Assert.areSame('#foo=bar&baz=qu+ux', Y.History.createHash({foo: 'bar', baz: 'qu ux'}));
    },

    'decode() should decode URI components with + for space': function () {
        Y.Assert.areSame('foo bar&baz/quux@moo+', Y.History.decode('foo+bar%26baz%2Fquux%40moo%2B'));
    },

    'encode() should encode URI components with + for space': function () {
        Y.Assert.areSame('foo+bar%26baz%2Fquux%40moo%2B', Y.History.encode('foo bar&baz/quux@moo+'));
    },

    'getHash() should get the current raw (not decoded) hash string': function () {
        location.hash = Y.History.encode('foo bar&baz/quux@moo+');
        Y.Assert.areSame('#foo+bar%26baz%2Fquux%40moo%2B', Y.History.getHash());
    },

    'parseHash() should parse a hash string into an object': function () {
        var parsed = Y.History.parseHash('#foo=bar&baz=qu+ux');

        Y.Assert.isObject(parsed);
        Y.Assert.areSame(2, Obj.size(parsed));
        Y.Assert.areSame('bar', parsed.foo);
        Y.Assert.areSame('qu ux', parsed.baz);
    },

    'parseHash() should use the current hash if no argument is provided': function () {
        location.hash = '#foo=bar&kittens=cute';

        var parsed = Y.History.parseHash();

        Y.Assert.isObject(parsed);
        Y.Assert.areSame(2, Obj.size(parsed));
        Y.Assert.areSame('bar', parsed.foo);
        Y.Assert.areSame('cute', parsed.kittens);

        location.hash = '';
    },

    'replaceHash() should replace the hash': function () {
        var hash = '#foo+bar%26baz%2Fquux%40moo%2B' + Y.guid();

        Y.History.replaceHash(hash);
        Y.Assert.areSame(hash, Y.History.getHash());
    },

    'setHash() should set the hash': function () {
        var hash = '#foo+bar%26baz%2Fquux%40moo%2B' + Y.guid();

        Y.History.setHash(hash);
        Y.Assert.areSame(hash, Y.History.getHash());
    },

    // -- hashchange Event -----------------------------------------------------
    'hashchange should fire when location.hash changes': function () {
        Y.once('hashchange', Y.bind(function (e) {
            this.resume();
        }, this), win);

        location.hash = '#foo=' + Y.guid();

        this.wait(waitTime);
    },

    // This test is ignored in browsers without native hashchange, since it can
    // fail depending on the timing of other tests that change the hash.
    'hashchange should expose appropriate properties on its event facade': function () {
        var oldHash = Y.History.getHash();
            oldUrl  = location.href;

        Y.once('hashchange', Y.bind(function (e) {
            this.resume(function () {
                Y.Assert.isObject(e);

                Y.Array.each(['oldHash', 'oldUrl', 'newHash', 'newUrl'], function (prop) {
                    Y.assert(Obj.owns(e, prop), "Event facade doesn't have the expected " + prop + " property.");
                });

                Y.Assert.areSame(oldHash, e.oldHash);
                Y.Assert.areSame(oldUrl, e.oldUrl);
                Y.Assert.areSame(Y.History.getHash(), e.newHash);
                Y.Assert.areSame(location.href, e.newUrl);
            });
        }, this), win);

        location.hash = '#foo=' + Y.guid();

        this.wait(waitTime);
    },

    // -- Instance Methods -----------------------------------------------------
    'add() should change the hash': function () {
        location.hash = '#';
        this.history.add({a: 'apple', b: 'bumblebee'});

        Y.Assert.areSame('apple', this.history.get('a'));
        Y.Assert.areSame('bumblebee', this.history.get('b'));
    },

    'replace() should replace the hash': function () {
        this.history.replace({a: 'aardvark', b: 'boomerang'});

        Y.Assert.areSame('aardvark', this.history.get('a'));
        Y.Assert.areSame('boomerang', this.history.get('b'));
    }
});

}, '@VERSION@', {requires:['test', 'history-hash']});
