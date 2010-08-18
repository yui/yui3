YUI.add('autocomplete-test', function (Y) {

var AutoComplete = Y.AutoComplete,
    Filters      = AutoComplete.Filters,

    suite,
    baseSuite,
    filtersSuite;

// -- Global Suite -------------------------------------------------------------
suite = new Y.Test.Suite('Y.AutoComplete');

// -- Base Suite ---------------------------------------------------------------
baseSuite = new Y.Test.Suite('Base');

// -- Base: Lifecycle ----------------------------------------------------------
baseSuite.add(new Y.Test.Case({
    name: 'Lifecycle',

    _should: {
        error: {
            'Initializer should require an inputNode': 'No input node specified.'
        }
    },

    setUp: function () {
        this.inputNode = Y.Node.create('<input id="ac" type="text">');
        Y.one(Y.config.doc.body).append(this.inputNode);
    },

    tearDown: function () {
        this.inputNode.remove().destroy(true);
        delete this.inputNode;
    },

    'Initializer should accept an inputNode': function () {
        var ac = new AutoComplete({inputNode: this.inputNode});
        Y.Assert.areSame(this.inputNode, ac.get('inputNode'));

        ac = new AutoComplete({inputNode: '#ac'});
        Y.Assert.areSame(this.inputNode, ac.get('inputNode'));
    },

    'Initializer should require an inputNode': function () {
        // Should fail.
        var ac = new AutoComplete();
    },

    'Browser autocomplete should be off by default': function () {
        var ac = new AutoComplete({inputNode: this.inputNode});
        Y.Assert.areSame('off', this.inputNode.getAttribute('autocomplete'));
    },

    'Browser autocomplete should be turned on when enabled': function () {
        var ac = new AutoComplete({
            inputNode: this.inputNode,
            allowBrowserAutocomplete: true
        });

        Y.Assert.areSame('on', this.inputNode.getAttribute('autocomplete'));
    }
}));

// -- Base: Attributes ---------------------------------------------------------
baseSuite.add(new Y.Test.Case({
    name: 'Attributes',

    setUp: function () {
        this.inputNode = Y.Node.create('<input id="ac" type="text">');
        Y.one(Y.config.doc.body).append(this.inputNode);

        this.ac = new AutoComplete({inputNode: this.inputNode});
    },

    tearDown: function () {
        this.ac.destroy();
        this.inputNode.remove().destroy(true);

        delete this.ac;
        delete this.inputNode;
    },

    'dataSource should only accept dataSource-like objects and null': function () {
        var ds = {sendRequest: function () {}};

        Y.Assert.isUndefined(this.ac.get('dataSource'));

        this.ac.set('dataSource', {});
        Y.Assert.isUndefined(this.ac.get('dataSource'));

        this.ac.set('dataSource', ds);
        Y.Assert.areSame(ds, this.ac.get('dataSource'));

        this.ac.set('dataSource', null);
        Y.Assert.isNull(this.ac.get('dataSource'));
    },

    'inputNode should be writable only on init': function () {
        this.ac.set('inputNode', Y.Node.create('<input>'));
        Y.Assert.areSame(this.inputNode, this.ac.get('inputNode'));
    },

    'requestTemplate should be encodeURIComponent by default': function () {
        Y.Assert.areSame(encodeURIComponent, this.ac.get('requestTemplate'));
    },

    'requestTemplate should accept a custom template function': function () {
        var fn = function (query) {
            return 'query: ' + query;
        };

        this.ac.set('requestTemplate', fn);
        Y.Assert.areSame(this.ac.get('requestTemplate'), fn);
        Y.Assert.areSame('query: foo', this.ac.get('requestTemplate')('foo'));
    },

    'requestTemplate should generate a template function when set to a string': function () {
        this.ac.set('requestTemplate', 'foo');
        Y.Assert.isFunction(this.ac.get('requestTemplate'));
        Y.Assert.areSame('foo', this.ac.get('requestTemplate')());
    },

    'requestTemplate function should replace {query} with the URI-encoded query': function () {
        var rt;

        this.ac.set('requestTemplate', '/ac?q={query}&a=aardvark');
        rt = this.ac.get('requestTemplate');

        Y.Assert.areSame('/ac?q=foo&a=aardvark', rt('foo'));
        Y.Assert.areSame('/ac?q=foo%20%26%20bar&a=aardvark', rt('foo & bar'));
    },

    'requestTemplate function should replace \\{query} with the literal string {query}': function () {
        this.ac.set('requestTemplate', 'foo\\{query}bar');
        Y.Assert.areSame('foo{query}bar', this.ac.get('requestTemplate')('test'));
    }
}));

// -- Filters Suite ------------------------------------------------------------
filtersSuite = new Y.Test.Suite('Filters');

// -- Filters: API -------------------------------------------------------------
filtersSuite.add(new Y.Test.Case({
    name: 'API',

    // -- charMatch() ----------------------------------------------------------
    'charMatch() should match all characters in the query, in any order': function () {
        Y.ArrayAssert.isEmpty(Filters.charMatch('abc', ['foo', 'bar', 'baz']));

        Y.ArrayAssert.itemsAreSame(
            ['cab', 'taxi cab'],
            Filters.charMatch('abc', ['foo', 'cab', 'bar', 'taxi cab'])
        );
    },

    'charMatch() should be case-insensitive': function () {
        Y.ArrayAssert.itemsAreSame(['Foo', 'foo'], Filters.charMatch('f', ['Foo', 'foo']));
    },

    'charMatchCase() should be case-sensitive': function () {
        Y.ArrayAssert.itemsAreSame(['foo'], Filters.charMatchCase('f', ['Foo', 'foo']));
    },

    // -- phraseMatch() --------------------------------------------------------
    'phraseMatch() should match the complete query as a phrase': function () {
        Y.ArrayAssert.isEmpty(Filters.phraseMatch('foo baz', ['foo', 'bar', 'foo bar']));

        Y.ArrayAssert.itemsAreSame(
            ['foo bar'],
            Filters.phraseMatch('foo bar', ['foo', 'bar', 'foo bar'])
        );

        Y.ArrayAssert.itemsAreSame(
            ['xxfoo barxx'],
            Filters.phraseMatch('foo bar', ['foo', 'bar', 'xxfoo barxx'])
        );

        Y.ArrayAssert.itemsAreSame(
            ['foo barxx'],
            Filters.phraseMatch('foo bar', ['foo', 'bar', 'foo barxx'])
        );

        Y.ArrayAssert.itemsAreSame(
            ['xxfoo bar'],
            Filters.phraseMatch('foo bar', ['foo', 'bar', 'xxfoo bar'])
        );
    },

    'phraseMatch() should be case-insensitive': function () {
        Y.ArrayAssert.itemsAreSame(['Foo', 'foo'], Filters.phraseMatch('foo', ['Foo', 'foo']));
    },

    'phraseMatchCase() should be case-sensitive': function () {
        Y.ArrayAssert.itemsAreSame(['foo'], Filters.phraseMatchCase('foo', ['Foo', 'foo']));
    },

    // -- startsWith() ---------------------------------------------------------
    'startsWith() should match the complete query at the start of a result': function () {
        Y.ArrayAssert.isEmpty(Filters.startsWith('foo', ['xx foo', 'bar', 'xx foo bar']));

        Y.ArrayAssert.itemsAreSame(
            ['foo', 'foo bar'],
            Filters.startsWith('foo', ['foo', 'bar', 'foo bar'])
        );
    },

    'startsWith() should be case-insensitive': function () {
        Y.ArrayAssert.itemsAreSame(['Foo', 'foo'], Filters.startsWith('foo', ['Foo', 'foo']));
    },

    'startsWithCase() should be case-sensitive': function () {
        Y.ArrayAssert.itemsAreSame(['foo'], Filters.startsWithCase('foo', ['Foo', 'foo']));
    },

    // -- wordMatch() ----------------------------------------------------------
    'wordMatch() should match results that contain all words in the query in any order': function () {
        Y.ArrayAssert.isEmpty(Filters.wordMatch('foo bar baz', ['foo', 'bar', 'baz']));

        Y.ArrayAssert.itemsAreSame(
            ['foo bar baz'],
            Filters.wordMatch('baz foo bar', ['foo', 'bar', 'foo bar baz', 'foobar baz'])
        );

        Y.ArrayAssert.itemsAreSame(
            ['foo', 'foo bar baz'],
            Filters.wordMatch('foo', ['foo', 'bar', 'foo bar baz', 'foobar baz'])
        );
    },

    'wordMatch() should be case-insensitive': function () {
        Y.ArrayAssert.itemsAreSame(['Foo', 'foo'], Filters.wordMatch('foo', ['Foo', 'foo']));
    },

    'wordMatchCase() should be case-sensitive': function () {
        Y.ArrayAssert.itemsAreSame(['foo'], Filters.wordMatchCase('foo', ['Foo', 'foo']));
    }
}));

suite.add(baseSuite);
suite.add(filtersSuite);

Y.Test.Runner.add(suite);

}, '@VERSION@', {requires:['autocomplete-base', 'autocomplete-filters', 'node', 'test']});
