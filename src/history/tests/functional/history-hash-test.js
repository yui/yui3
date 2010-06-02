YUI.add('history-hash-test', function (Y) {

var Obj = Y.Object,

    defaultPrefix = Y.History.hashPrefix,
    win           = Y.config.win,
    location      = win.location,
    waitTime      = 100;

Y.Test.Runner.add(new Y.Test.Case({
    name: 'HistoryHash',

    setUp: function () {
        location.hash = '';
        this.history = new Y.History();
    },

    tearDown: function () {
        delete this.history;
        Y.History.hashPrefix = defaultPrefix;
    },

    // -- Static Properties and Methods ----------------------------------------
    'History should have a static boolean nativeHashChange property': function () {
        Y.Assert.isBoolean(Y.History.nativeHashChange);
    },

    'createHash() should create a hash string from an object': function () {
        Y.Assert.areSame('foo=bar&baz=qu+ux', Y.History.createHash({foo: 'bar', baz: 'qu ux'}));
    },

    'decode() should decode URI components with + for space': function () {
        Y.Assert.areSame('foo bar&baz/quux@moo+', Y.History.decode('foo+bar%26baz%2Fquux%40moo%2B'));
    },

    'encode() should encode URI components with + for space': function () {
        Y.Assert.areSame('foo+bar%26baz%2Fquux%40moo%2B', Y.History.encode('foo bar&baz/quux@moo+'));
    },

    'getHash() should get the current raw (not decoded) hash string': function () {
        location.hash = Y.History.encode('foo bar&baz/quux@moo+');
        Y.Assert.areSame('foo+bar%26baz%2Fquux%40moo%2B', Y.History.getHash());

        location.hash = '!withprefix';
        Y.Assert.areSame('!withprefix', Y.History.getHash());

        Y.History.hashPrefix = '!';
        Y.Assert.areSame('withprefix', Y.History.getHash());
    },

    'getUrl() should get the current URL': function () {
        Y.Assert.areSame(location.href, Y.History.getUrl());
    },

    'parseHash() should parse a hash string into an object': function () {
        var parsed = Y.History.parseHash('#foo=bar&baz=qu+ux');

        Y.Assert.isObject(parsed);
        Y.Assert.areSame(2, Obj.size(parsed));
        Y.Assert.areSame('bar', parsed.foo);
        Y.Assert.areSame('qu ux', parsed.baz);

        Y.History.hashPrefix = '!';
        parsed = Y.History.parseHash('#!foo=bar&baz=qu+ux');

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
        var hash = 'foo+bar%26baz%2Fquux%40moo%2B' + Y.guid();

        Y.History.replaceHash(hash);
        Y.Assert.areSame(hash, Y.History.getHash());

        Y.History.hashPrefix = '!';

        Y.History.replaceHash('#withprefix');
        Y.Assert.areSame('#!withprefix', location.hash);

        Y.History.replaceHash('withprefix');
        Y.Assert.areSame('#!withprefix', location.hash);
    },

    'setHash() should set the hash': function () {
        var hash = 'foo+bar%26baz%2Fquux%40moo%2B' + Y.guid();

        Y.History.setHash(hash);
        Y.Assert.areSame(hash, Y.History.getHash());

        Y.History.hashPrefix = '!';

        Y.History.setHash('#withprefix');
        Y.Assert.areSame('#!withprefix', location.hash);

        Y.History.setHash('withprefix');
        Y.Assert.areSame('#!withprefix', location.hash);
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
}));

}, '@VERSION@', {requires:['test', 'history-hash']});
