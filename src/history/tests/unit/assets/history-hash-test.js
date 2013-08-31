YUI.add('history-hash-test', function (Y) {

var Obj = Y.Object,

    defaultPrefix = Y.HistoryHash.hashPrefix,
    win           = Y.config.win,
    location      = win.location;

Y.Test.Runner.add(new Y.Test.Case({
    name: 'HistoryHash',

    setUp: function () {
        Y.HistoryHash.setHash('');
        this.history = new Y.HistoryHash();
    },

    tearDown: function () {
        delete this.history;
        Y.HistoryHash.hashPrefix = defaultPrefix;
    },

    _should: {
        ignore: {
            'hashchange should be case-sensitive (except in IE8+)': Y.UA.ie >= 8,
            'hashchange should NOT be case-sensitive in IE8+': !Y.UA.ie || Y.UA.ie < 8
        }
    },

    // -- onhashchange ---------------------------------------------------------
    'synthetic hashchange event should fire when the hash changes': function () {
        var changed;

        Y.once('hashchange', function (e) {
            changed = true;

            Y.Assert.areSame('foo=bar', Y.HistoryHash.getHash());

            Y.ObjectAssert.ownsKeys([
                'oldHash',
                'oldUrl',
                'newHash',
                'newUrl'
            ], e, 'Event facade is missing one or more properties');

            if (Y.HistoryBase.nativeHashChange) {
                Y.ObjectAssert.ownsKey('_event', e, 'Event facade is missing the _event property');
            }
        }, win);

        Y.HistoryHash.setHash('#foo=bar');

        this.wait(function () {
            Y.Assert.isTrue(changed, "Synthetic hashchange event wasn't fired.");
        }, 50);
    },

    // http://yuilibrary.com/projects/yui3/ticket/2528444
    'hashchange should be case-sensitive (except in IE8+)': function () {
        var changed;

        Y.once('hashchange', function () {
            changed = true;
            Y.Assert.areSame('a=b', Y.HistoryHash.getHash());
        }, win);

        Y.HistoryHash.setHash('#a=b');

        this.wait(function () {
            Y.Assert.isTrue(changed, "Synthetic hashchange event wasn't fired.");

            changed = false;

            Y.once('hashchange', function () {
                changed = true;
                Y.Assert.areSame('a=B', Y.HistoryHash.getHash());
            }, win);

            Y.HistoryHash.setHash('#a=B');

            this.wait(function () {
                Y.Assert.isTrue(changed, "Synthetic hashchange event wasn't fired.");
            }, 50);
        }, 50);
    },

    // http://yuilibrary.com/projects/yui3/ticket/2528444
    'hashchange should NOT be case-sensitive in IE8+': function () {
        var changed;

        Y.once('hashchange', function () {
            changed = true;
            Y.Assert.areSame('foo=bar', Y.HistoryHash.getHash());
        }, win);

        Y.HistoryHash.setHash('#foo=bar');

        this.wait(function () {
            Y.Assert.isTrue(changed);

            changed = false;

            Y.once('hashchange', function () {
                changed = true;
            }, win);

            Y.HistoryHash.setHash('#foo=baR');

            this.wait(function () {
                Y.Assert.isFalse(changed, "Synthetic hashchange event was fired when it shouldn't have been.");
            }, 50);
        }, 50);
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

    'getHash() should get the current raw (not decoded) hash string': function () {
        Y.HistoryHash.setHash(Y.HistoryHash.encode('foo bar&baz/quux@moo+'));
        Y.Assert.areSame('foo+bar%26baz%2Fquux%40moo%2B', Y.HistoryHash.getHash());

        Y.HistoryHash.setHash('!withprefix');
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

    'parseHash() should parse hash string properties with blank values': function () {
        var parsed = Y.HistoryHash.parseHash('#foo=bar&baz=&qu=ux');

        Y.Assert.isObject(parsed);
        Y.Assert.areSame(3, Obj.size(parsed));
        Y.Assert.areSame('', parsed.baz);
        Y.Assert.areSame('ux', parsed.qu);

        parsed = Y.HistoryHash.parseHash('#foo=bar&baz&qu=ux');

        Y.Assert.isObject(parsed);
        Y.Assert.areSame(3, Obj.size(parsed));
        Y.Assert.areSame('', parsed.baz);
        Y.Assert.areSame('ux', parsed.qu);
    },

    'parseHash() should use the current hash if no argument is provided': function () {
        Y.HistoryHash.setHash('#foo=bar&kittens=cute');

        var parsed = Y.HistoryHash.parseHash();

        Y.Assert.isObject(parsed);
        Y.Assert.areSame(2, Obj.size(parsed));
        Y.Assert.areSame('bar', parsed.foo);
        Y.Assert.areSame('cute', parsed.kittens);
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

    // -- Constructor ----------------------------------------------------------
    'bookmarked state should be merged into initialState': function () {
        Y.HistoryHash.setHash('a=aardvark&b=bumblebee');

        this.wait(function () {
            var h     = new Y.HistoryHash({initialState: {b: 'blowfish', c: 'cheetah'}}),
                state = h.get();

            Y.Assert.areSame(3, Obj.size(state));
            Y.Assert.areSame('aardvark', state.a);
            Y.Assert.areSame('bumblebee', state.b);
            Y.Assert.areSame('cheetah', state.c);
        }, 50);
    },

    // -- Instance Methods -----------------------------------------------------
    'add() should change the hash': function () {
        Y.HistoryHash.setHash('');
        this.history.add({a: 'apple', b: 'bumblebee'});

        Y.Assert.areSame('apple', this.history.get('a'));
        Y.Assert.areSame('bumblebee', this.history.get('b'));

        this.history.add({foo: 'bar/baz'}, {merge: false});
        Y.Assert.areSame('bar/baz', this.history.get('foo'));
        Y.Assert.areSame('foo=bar%2Fbaz', Y.HistoryHash.getHash());
    },

    'replace() should replace the hash': function () {
        this.history.replace({a: 'aardvark', b: 'boomerang'});

        Y.Assert.areSame('aardvark', this.history.get('a'));
        Y.Assert.areSame('boomerang', this.history.get('b'));
    },

    // -- Bugs -----------------------------------------------------------------

    // http://yuilibrary.com/projects/yui3/ticket/2529399
    'Setting an unencoded hash value outside of HistoryHash should not result in two history entries': function () {
        // Necessary to avoid catching a late-firing event from a previous test.
        this.wait(function () {
            var changes = 0,

            event = Y.on('hashchange', function (e) {
                changes += 1;
            }, win);

            location.href = '#foo=bar/baz';

            this.wait(function () {
                event.detach();
                Y.Assert.areSame(1, changes);
            }, 105);
        }, 51);
    },

    // http://yuilibrary.com/projects/yui3/ticket/2529436
    'Setting a non-string value should not result in two history entries': function () {
        this.wait(function () {
            var changes = 0,

            event = this.history.on('change', function (e) {
                changes += 1;
            });

            this.history.addValue('foo', '1');

            this.wait(function () {
                Y.Assert.areSame(1, changes);
                this.history.addValue('foo', 1);

                this.wait(function () {
                    event.detach();
                    Y.Assert.areSame(1, changes);
                }, 105);
            }, 105);
        }, 51);
    },

    // http://yuilibrary.com/projects/yui3/ticket/2532596
    'Subscribers of hashchange should not be called once for every YUI instance': function () {
        var test  = this,
            calls = 0;

        this.wait(function () {
            Y.on('hashchange', function () {
                calls += 1;
            }, Y.config.win);

            YUI().use('*', function (Y2) {
                Y.Assert.isFunction(Y2.HistoryHash);

                Y.HistoryHash.setHash('/foo/bar');

                test.wait(function () {
                    Y.Assert.areSame(1, calls);
                }, 51);
            });
        }, 51);
    }
}));

}, '@VERSION@', {requires:['test', 'history-hash-ie']});
