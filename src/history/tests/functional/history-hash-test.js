YUI.add('history-hash-test', function (Y) {

var Obj = Y.Object,

    defaultPrefix = Y.HistoryHash.hashPrefix,
    win           = Y.config.win,
    location      = win.location;

Y.Test.Runner.add(new Y.Test.Case({
    name: 'HistoryHash',

    setUp: function () {
        location.hash = '';
        this.history = new Y.HistoryHash();
    },

    tearDown: function () {
        delete this.history;
        Y.HistoryHash.hashPrefix = defaultPrefix;
    },

    _should: {
        ignore: {
            'onhashchange should be case-sensitive (except in IE8+)': Y.UA.ie >= 8,
            'onhashchange should NOT be case-sensitive in IE8+': !Y.UA.ie || Y.UA.ie < 8
        }
    },

    // -- Static Properties and Methods ----------------------------------------
    'createHash() should create a hash string from an object': function () {
        Y.Assert.areSame('foo=bar&baz=qu+ux', Y.HistoryHash.createHash({foo: 'bar', baz: 'qu ux'}));
    },

    'decode() should decode URI components with + for space': function () {
        Y.Assert.areSame('foo bar&baz/quux@moo+', Y.HistoryHash.decode('foo+bar%26baz%2Fquux%40moo%2B'));
    },

    'encode() should encode URI components with + for space': function () {
        Y.Assert.areSame('foo+bar%26baz%2Fquux%40moo%2B', Y.HistoryHash.encode('foo bar&baz/quux@moo+'));
    },

    'getHash() should get the current raw (not decoded) hash string': function () {
        location.hash = Y.HistoryHash.encode('foo bar&baz/quux@moo+');
        Y.Assert.areSame('foo+bar%26baz%2Fquux%40moo%2B', Y.HistoryHash.getHash());

        location.hash = '!withprefix';
        Y.Assert.areSame('!withprefix', Y.HistoryHash.getHash());

        Y.HistoryHash.hashPrefix = '!';
        Y.Assert.areSame('withprefix', Y.HistoryHash.getHash());
    },

    'getUrl() should get the current URL': function () {
        Y.Assert.areSame(location.href, Y.HistoryHash.getUrl());
    },

    'parseHash() should parse a hash string into an object': function () {
        var parsed = Y.HistoryHash.parseHash('#foo=bar&baz=qu+ux');

        Y.Assert.isObject(parsed);
        Y.Assert.areSame(2, Obj.size(parsed));
        Y.Assert.areSame('bar', parsed.foo);
        Y.Assert.areSame('qu ux', parsed.baz);

        Y.HistoryHash.hashPrefix = '!';
        parsed = Y.HistoryHash.parseHash('#!foo=bar&baz=qu+ux');

        Y.Assert.isObject(parsed);
        Y.Assert.areSame(2, Obj.size(parsed));
        Y.Assert.areSame('bar', parsed.foo);
        Y.Assert.areSame('qu ux', parsed.baz);
    },

    'parseHash() should use the current hash if no argument is provided': function () {
        location.hash = '#foo=bar&kittens=cute';

        var parsed = Y.HistoryHash.parseHash();

        Y.Assert.isObject(parsed);
        Y.Assert.areSame(2, Obj.size(parsed));
        Y.Assert.areSame('bar', parsed.foo);
        Y.Assert.areSame('cute', parsed.kittens);

        location.hash = '';
    },

    'replaceHash() should replace the hash': function () {
        var hash = 'foo+bar%26baz%2Fquux%40moo%2B' + Y.guid();

        Y.HistoryHash.replaceHash(hash);
        Y.Assert.areSame(hash, Y.HistoryHash.getHash());

        Y.HistoryHash.hashPrefix = '!';

        Y.HistoryHash.replaceHash('#withprefix');
        Y.Assert.areSame('#!withprefix', location.hash);

        Y.HistoryHash.replaceHash('withprefix');
        Y.Assert.areSame('#!withprefix', location.hash);
    },

    'setHash() should set the hash': function () {
        var hash = 'foo+bar%26baz%2Fquux%40moo%2B' + Y.guid();

        Y.HistoryHash.setHash(hash);
        Y.Assert.areSame(hash, Y.HistoryHash.getHash());

        Y.HistoryHash.hashPrefix = '!';

        Y.HistoryHash.setHash('#withprefix');
        Y.Assert.areSame('#!withprefix', location.hash);

        Y.HistoryHash.setHash('withprefix');
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
    },

    // -- Bug Tests ------------------------------------------------------------

    // http://yuilibrary.com/projects/yui3/ticket/2528444
    'onhashchange should be case-sensitive (except in IE8+)': function () {
        var changed;

        Y.once('hashchange', function () {
            changed = true;
            Y.Assert.areSame('foo=bar', Y.HistoryHash.getHash());
        }, win);

        location.hash = '#foo=bar';

        this.wait(function () {
            Y.Assert.isTrue(changed);

            changed = false;

            Y.once('hashchange', function () {
                changed = true;
                Y.Assert.areSame('foo=baR', Y.HistoryHash.getHash());
            }, win);

            location.hash = '#foo=baR';

            this.wait(function () {
                Y.Assert.isTrue(changed);
            }, 50);
        }, 50);
    },

    // http://yuilibrary.com/projects/yui3/ticket/2528444
    'onhashchange should NOT be case-sensitive in IE8+': function () {
        var changed;

        Y.once('hashchange', function () {
            changed = true;
            Y.Assert.areSame('foo=bar', Y.HistoryHash.getHash());
        }, win);

        location.hash = '#foo=bar';

        this.wait(function () {
            Y.Assert.isTrue(changed);

            changed = false;

            Y.once('hashchange', function () {
                changed = true;
                Y.Assert.fail();
            }, win);

            location.hash = '#foo=baR';

            this.wait(function () {
                Y.Assert.isFalse(changed);
            }, 50);
        }, 50);
    }
}));

}, '@VERSION@', {requires:['test', 'history-hash']});
