YUI.add('autocomplete-test', function (Y) {

var Assert      = Y.Assert,
    ArrayAssert = Y.ArrayAssert,

    ACBase,
    Filters      = Y.AutoCompleteFilters,
    Hi           = Y.AutoCompleteHighlighters,

    suite,
    baseSuite,
    filtersSuite,
    highlightSuite;

// Simple, bare AutoCompleteBase implementation for testing.
ACBase = Y.Base.create('autocomplete', Y.Base, [Y.AutoCompleteBase], {
    initializer: function () {
        this._bindUIACBase();
        this._syncUIACBase();
    },

    destructor: function () {
        this._destructorACBase();
    }
});

// -- Global Suite -------------------------------------------------------------
suite = new Y.Test.Suite('Y.AutoComplete');

// -- Base Suite ---------------------------------------------------------------
baseSuite = new Y.Test.Suite('Base');

// -- Base: Lifecycle ----------------------------------------------------------
baseSuite.add(new Y.Test.Case({
    name: 'Lifecycle',

    _should: {
        error: {
            'Initializer should require an inputNode': 'No inputNode specified.'
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
        var ac = new ACBase({inputNode: this.inputNode});
        Assert.areSame(this.inputNode, ac.get('inputNode'));

        ac = new ACBase({inputNode: '#ac'});
        Assert.areSame(this.inputNode, ac.get('inputNode'));
    },

    'Initializer should require an inputNode': function () {
        // Should fail.
        var ac = new ACBase();
    }
}));

// -- Base: Attributes ---------------------------------------------------------
baseSuite.add(new Y.Test.Case({
    name: 'Attributes',

    setUp: function () {
        this.inputNode = Y.Node.create('<input id="ac" type="text">');
        Y.one(Y.config.doc.body).append(this.inputNode);

        this.ac = new ACBase({inputNode: this.inputNode});
    },

    tearDown: function () {
        this.ac.destroy();
        this.inputNode.remove().destroy(true);

        delete this.ac;
        delete this.inputNode;
    },

    'Browser autocomplete should be off by default': function () {
        Assert.isFalse(this.ac.get('allowBrowserAutocomplete'));
        Assert.areSame('off', this.inputNode.getAttribute('autocomplete'));
    },

    'Browser autocomplete should be turned on when enabled': function () {
        var ac = new ACBase({
            inputNode: this.inputNode,
            allowBrowserAutocomplete: true
        });

        Assert.areSame('on', this.inputNode.getAttribute('autocomplete'));
    },

    'Browser autocomplete should be settable after init': function () {
        var ac = new ACBase({inputNode: this.inputNode});
        Assert.areSame('off', this.inputNode.getAttribute('autocomplete'));

        ac.set('allowBrowserAutocomplete', true);
        Assert.areSame('on', this.inputNode.getAttribute('autocomplete'));
    },

    'inputNode should be writable only on init': function () {
        this.ac.set('inputNode', Y.Node.create('<input>'));
        Assert.areSame(this.inputNode, this.ac.get('inputNode'));
    },

    'requestTemplate should accept a custom template function': function () {
        var fn = function (query) {
            return 'query: ' + query;
        };

        this.ac.set('requestTemplate', fn);
        Assert.areSame(this.ac.get('requestTemplate'), fn);
        Assert.areSame('query: foo', this.ac.get('requestTemplate')('foo'));
    },

    'requestTemplate should generate a template function when set to a string': function () {
        this.ac.set('requestTemplate', 'foo');
        Assert.isFunction(this.ac.get('requestTemplate'));
        Assert.areSame('foo', this.ac.get('requestTemplate')());
    },

    'requestTemplate function should replace {query} with the URI-encoded query': function () {
        var rt;

        this.ac.set('requestTemplate', '/ac?q={query}&a=aardvark');
        rt = this.ac.get('requestTemplate');

        Assert.areSame('/ac?q=foo&a=aardvark', rt('foo'));
        Assert.areSame('/ac?q=foo%20%26%20bar&a=aardvark', rt('foo & bar'));
    },

    'resultFilters should accept a filter, array of filters, string, array of strings, or null': function () {
        var filter = function () {};

        this.ac.set('resultFilters', filter);
        ArrayAssert.itemsAreSame([filter], this.ac.get('resultFilters'));

        this.ac.set('resultFilters', null);
        ArrayAssert.isEmpty(this.ac.get('resultFilters'));

        this.ac.set('resultFilters', [filter]);
        ArrayAssert.itemsAreSame([filter], this.ac.get('resultFilters'));

        this.ac.set('resultFilters', 'phraseMatch');
        ArrayAssert.itemsAreSame([Y.AutoCompleteFilters.phraseMatch], this.ac.get('resultFilters'));

        this.ac.set('resultFilters', ['phraseMatch', 'charMatch']);
        ArrayAssert.itemsAreSame([Y.AutoCompleteFilters.phraseMatch, Y.AutoCompleteFilters.charMatch], this.ac.get('resultFilters'));

        this.ac.set('resultFilters', null);
        this.ac.set('resultFilters', ['foo', 'bar']);
        ArrayAssert.isEmpty(this.ac.get('resultFilters'));
    },

    // -- Generic setters and validators ---------------------------------------
    '_functionValidator() should accept a function or null': function () {
        Assert.isTrue(this.ac._functionValidator(function () {}));
        Assert.isTrue(this.ac._functionValidator(null));
        Assert.isFalse(this.ac._functionValidator('foo'));
    },

    '_setSource() should accept a DataSource': function () {
        var ds = new Y.DataSource.Local({source: []});
        Assert.areSame(ds, this.ac._setSource(ds));
    },

    '_setSource() should accept an array': function () {
        Assert.isFunction(this.ac._setSource(['foo']).sendRequest);
    },

    '_setSource() should accept an object': function () {
        Assert.isFunction(this.ac._setSource({foo: ['bar']}).sendRequest);
    },

    '_setSource() should accept a URL string': function () {
        Assert.isFunction(this.ac._setSource('http://example.com/').sendRequest);
    },

    '_setSource() should accept a YQL string': function () {
        Assert.isFunction(this.ac._setSource('select * from foo where query="{query}"').sendRequest);
    },

    '_setSource() should accept a Y.JSONPRequest instance': function () {
        Assert.isFunction(this.ac._setSource(new Y.JSONPRequest('http://example.com/')).sendRequest);
    },

    // -- Miscellaneous protected methods that aren't testable otherwise -------
    '_jsonpFormatter should correctly format URLs both with and without a requestTemplate set': function () {
        Assert.areSame('foo?q=bar%20baz&cb=callback', this.ac._jsonpFormatter('foo?q={query}&cb={callback}', 'callback', 'bar baz'));
        this.ac.set('requestTemplate', '?q={query}&cb={callback}');
        Assert.areSame('foo?q=bar%20baz&cb=callback', this.ac._jsonpFormatter('foo', 'callback', 'bar baz'));
    }
}));

// -- Filters Suite ------------------------------------------------------------
filtersSuite = new Y.Test.Suite('Filters');

// -- Filters: API -------------------------------------------------------------
filtersSuite.add(new Y.Test.Case({
    name: 'API',

    // -- charMatch() ----------------------------------------------------------
    'charMatch() should match all characters in the query, in any order': function () {
        ArrayAssert.isEmpty(Filters.charMatch('abc', ['foo', 'bar', 'baz']));

        ArrayAssert.itemsAreSame(
            ['cab', 'taxi cab'],
            Filters.charMatch('abc', ['foo', 'cab', 'bar', 'taxi cab'])
        );
    },

    'charMatch() should be case-insensitive': function () {
        ArrayAssert.itemsAreSame(
            ['Foo', 'foo'],
            Filters.charMatch('f', ['Foo', 'foo'])
        );
    },

    'charMatchCase() should be case-sensitive': function () {
        ArrayAssert.itemsAreSame(
            ['foo'],
            Filters.charMatchCase('f', ['Foo', 'foo'])
        );
    },

    'charMatchFold() should match accent-folded characters': function () {
        ArrayAssert.itemsAreSame(
            ['fóó', 'föö', 'foo'],
            Filters.charMatchFold('o', ['fóó', 'föö', 'foo', 'bar'])
        );

        // Accent-folded matches are always case-insensitive.
        ArrayAssert.itemsAreSame(
            ['FÓÓ', 'FÖÖ', 'FOO'],
            Filters.charMatchFold('o', ['FÓÓ', 'FÖÖ', 'FOO', 'BAR'])
        );
    },

    // -- phraseMatch() --------------------------------------------------------
    'phraseMatch() should match the complete query as a phrase': function () {
        ArrayAssert.isEmpty(Filters.phraseMatch('foo baz', ['foo', 'bar', 'foo bar']));

        ArrayAssert.itemsAreSame(
            ['foo bar'],
            Filters.phraseMatch('foo bar', ['foo', 'bar', 'foo bar'])
        );

        ArrayAssert.itemsAreSame(
            ['xxfoo barxx'],
            Filters.phraseMatch('foo bar', ['foo', 'bar', 'xxfoo barxx'])
        );

        ArrayAssert.itemsAreSame(
            ['foo barxx'],
            Filters.phraseMatch('foo bar', ['foo', 'bar', 'foo barxx'])
        );

        ArrayAssert.itemsAreSame(
            ['xxfoo bar'],
            Filters.phraseMatch('foo bar', ['foo', 'bar', 'xxfoo bar'])
        );
    },

    'phraseMatch() should be case-insensitive': function () {
        ArrayAssert.itemsAreSame(
            ['Foo', 'foo'],
            Filters.phraseMatch('foo', ['Foo', 'foo'])
        );
    },

    'phraseMatchCase() should be case-sensitive': function () {
        ArrayAssert.itemsAreSame(
            ['foo'],
            Filters.phraseMatchCase('foo', ['Foo', 'foo'])
        );
    },

    'phraseMatchFold() should match accent-folded characters': function () {
        ArrayAssert.itemsAreSame(
            ['fóó', 'föö', 'foo'],
            Filters.phraseMatchFold('foo', ['fóó', 'föö', 'foo', 'bar'])
        );

        // Accent-folded matches are always case-insensitive.
        ArrayAssert.itemsAreSame(
            ['FÓÓ', 'FÖÖ', 'FOO'],
            Filters.phraseMatchFold('foo', ['FÓÓ', 'FÖÖ', 'FOO', 'BAR'])
        );
    },

    // -- startsWith() ---------------------------------------------------------
    'startsWith() should match the complete query at the start of a result': function () {
        ArrayAssert.isEmpty(Filters.startsWith('foo', ['xx foo', 'bar', 'xx foo bar']));

        ArrayAssert.itemsAreSame(
            ['foo', 'foo bar'],
            Filters.startsWith('foo', ['foo', 'bar', 'foo bar'])
        );
    },

    'startsWith() should be case-insensitive': function () {
        ArrayAssert.itemsAreSame(
            ['Foo', 'foo'],
            Filters.startsWith('foo', ['Foo', 'foo'])
        );
    },

    'startsWithCase() should be case-sensitive': function () {
        ArrayAssert.itemsAreSame(
            ['foo'],
            Filters.startsWithCase('foo', ['Foo', 'foo'])
        );
    },

    'startsWithFold() should match accent-folded characters': function () {
        ArrayAssert.itemsAreSame(
            ['fóó', 'föö', 'foo'],
            Filters.startsWithFold('foo', ['fóó', 'föö', 'foo', 'barfoo'])
        );

        // Accent-folded matches are always case-insensitive.
        ArrayAssert.itemsAreSame(
            ['FÓÓ', 'FÖÖ', 'FOO'],
            Filters.startsWithFold('foo', ['FÓÓ', 'FÖÖ', 'FOO', 'BARFOO'])
        );
    },

    // -- wordMatch() ----------------------------------------------------------
    'wordMatch() should match results that contain all words in the query in any order': function () {
        ArrayAssert.isEmpty(Filters.wordMatch('foo bar baz', ['foo', 'bar', 'baz']));

        ArrayAssert.itemsAreSame(
            ['foo bar baz'],
            Filters.wordMatch('baz foo bar', ['foo', 'bar', 'foo bar baz', 'foobar baz'])
        );

        ArrayAssert.itemsAreSame(
            ['foo', 'foo bar baz'],
            Filters.wordMatch('foo', ['foo', 'bar', 'foo bar baz', 'foobar baz'])
        );
    },

    'wordMatch() should be case-insensitive': function () {
        ArrayAssert.itemsAreSame(
            ['Foo', 'foo'],
            Filters.wordMatch('foo', ['Foo', 'foo'])
        );
    },

    'wordMatchCase() should be case-sensitive': function () {
        ArrayAssert.itemsAreSame(
            ['foo'],
            Filters.wordMatchCase('foo', ['Foo', 'foo'])
        );
    },

    'wordMatchFold() should match accent-folded characters': function () {
        ArrayAssert.itemsAreSame(
            ['fóó', 'föö', 'foo'],
            Filters.wordMatchFold('foo', ['fóó', 'föö', 'foo', 'barfoo'])
        );

        // Accent-folded matches are always case-insensitive.
        ArrayAssert.itemsAreSame(
            ['FÓÓ', 'FÖÖ', 'FOO'],
            Filters.wordMatchFold('foo', ['FÓÓ', 'FÖÖ', 'FOO', 'BARFOO'])
        );
    }
}));

// -- Highlighters Suite -------------------------------------------------------
highlightSuite = new Y.Test.Suite('Highlighters');

// -- Highlighters: API --------------------------------------------------------
highlightSuite.add(new Y.Test.Case({
    name: 'API',

    // -- charMatch() ----------------------------------------------------------
    'charMatch() should highlight all characters in the query, in any order': function () {
        ArrayAssert.itemsAreSame(
            ['foo', '<b class="yui3-highlight">b</b><b class="yui3-highlight">a</b>r', '<b class="yui3-highlight">b</b><b class="yui3-highlight">a</b>z'],
            Hi.charMatch('abc', ['foo', 'bar', 'baz'])
        );
    },

    'charMatch() should be case-insensitive': function () {
        ArrayAssert.itemsAreSame(
            ['<b class="yui3-highlight">F</b>oo', '<b class="yui3-highlight">f</b>oo'],
            Hi.charMatch('f', ['Foo', 'foo'])
        );
    },

    // -- charMatchCase() ------------------------------------------------------
    'charMatchCase() should be case-sensitive': function () {
        ArrayAssert.itemsAreSame(
            ['Foo', '<b class="yui3-highlight">f</b>oo'],
            Hi.charMatchCase('f', ['Foo', 'foo'])
        );
    },

    // -- charMatchFold() ------------------------------------------------------
    'charMatchFold() should highlight accent-folded characters': function () {
        ArrayAssert.itemsAreSame(
            ['f<b class="yui3-highlight">ó</b><b class="yui3-highlight">ó</b>', 'f<b class="yui3-highlight">o</b><b class="yui3-highlight">o</b>', 'bar'],
            Hi.charMatchFold('o', ['fóó', 'foo', 'bar'])
        );

        ArrayAssert.itemsAreSame(
            ['f<b class="yui3-highlight">o</b><b class="yui3-highlight">o</b>', 'f<b class="yui3-highlight">o</b><b class="yui3-highlight">o</b>', 'bar'],
            Hi.charMatchFold('ö', ['foo', 'foo', 'bar'])
        );
    },

    // -- phraseMatch() --------------------------------------------------------
    'phraseMatch() should highlight the complete query as a phrase': function () {
        ArrayAssert.itemsAreSame(
            ['foo', 'bar', 'foo bar'],
            Hi.phraseMatch('foo baz', ['foo', 'bar', 'foo bar'])
        );

        ArrayAssert.itemsAreSame(
            ['foo', 'bar', '<b class="yui3-highlight">foo bar</b>'],
            Hi.phraseMatch('foo bar', ['foo', 'bar', 'foo bar'])
        );

        ArrayAssert.itemsAreSame(
            ['<b class="yui3-highlight">foo</b>', 'bar', '<b class="yui3-highlight">foo</b> bar'],
            Hi.phraseMatch('foo', ['foo', 'bar', 'foo bar'])
        );

        ArrayAssert.itemsAreSame(
            ['foo', 'bar', 'xx<b class="yui3-highlight">foo bar</b>'],
            Hi.phraseMatch('foo bar', ['foo', 'bar', 'xxfoo bar'])
        );
    },

    'phraseMatch() should be case-insensitive': function () {
        ArrayAssert.itemsAreSame(
            ['<b class="yui3-highlight">Foo</b>', '<b class="yui3-highlight">foo</b>'],
            Hi.phraseMatch('foo', ['Foo', 'foo'])
        );
    },

    // -- phraseMatchCase() ----------------------------------------------------
    'phraseMatchCase() should be case-sensitive': function () {
        ArrayAssert.itemsAreSame(
            ['Foo', '<b class="yui3-highlight">foo</b>'],
            Hi.phraseMatchCase('foo', ['Foo', 'foo'])
        );
    },

    // -- phraseMatchFold() ----------------------------------------------------
    'phraseMatchFold() should match accent-folded characters': function () {
        ArrayAssert.itemsAreSame(
            ['<b class="yui3-highlight">fóó</b>bar', 'bar<b class="yui3-highlight">foo</b>', 'bar'],
            Hi.phraseMatchFold('foo', ['fóóbar', 'barfoo', 'bar'])
        );

        ArrayAssert.itemsAreSame(
            ['<b class="yui3-highlight">foo</b>bar', 'bar<b class="yui3-highlight">foo</b>', 'bar'],
            Hi.phraseMatchFold('föö', ['foobar', 'barfoo', 'bar'])
        );
    },

    // -- startsWith() ---------------------------------------------------------
    'startsWith() should highlight the complete query at the start of a result': function () {
        ArrayAssert.itemsAreSame(
            ['xx foo', 'bar', 'xx foo bar'],
            Hi.startsWith('foo', ['xx foo', 'bar', 'xx foo bar'])
        );

        ArrayAssert.itemsAreSame(
            ['<b class="yui3-highlight">foo</b>', 'bar foo', '<b class="yui3-highlight">foo</b> bar'],
            Hi.startsWith('foo', ['foo', 'bar foo', 'foo bar'])
        );
    },

    'startsWith() should be case-insensitive': function () {
        ArrayAssert.itemsAreSame(
            ['<b class="yui3-highlight">Foo</b>', '<b class="yui3-highlight">foo</b>'],
            Hi.startsWith('foo', ['Foo', 'foo'])
        );
    },

    // -- startsWithCase() -----------------------------------------------------
    'startsWithCase() should be case-sensitive': function () {
        ArrayAssert.itemsAreSame(
            ['Foo', '<b class="yui3-highlight">foo</b>'],
            Hi.startsWithCase('foo', ['Foo', 'foo'])
        );
    },

    // -- startsWithFold() -----------------------------------------------------
    'startsWithFold() should match accent-folded characters': function () {
        ArrayAssert.itemsAreSame(
            ['<b class="yui3-highlight">fóó</b>', 'barfoo', 'bar'],
            Hi.startsWithFold('foo', ['fóó', 'barfoo', 'bar'])
        );

        ArrayAssert.itemsAreSame(
            ['<b class="yui3-highlight">foo</b>', 'barfoo', 'bar'],
            Hi.startsWithFold('föö', ['foo', 'barfoo', 'bar'])
        );
    },

    // -- wordMatch() ----------------------------------------------------------
    'wordMatch() should highlight complete words in the query': function () {
        ArrayAssert.itemsAreSame(
            ['foobar', 'barbaz'],
            Hi.wordMatch('foo bar baz', ['foobar', 'barbaz'])
        );

        ArrayAssert.itemsAreSame(
            ['<b class="yui3-highlight">foo</b>', '<b class="yui3-highlight">bar</b>', '<b class="yui3-highlight">foo</b> <b class="yui3-highlight">bar</b> <b class="yui3-highlight">baz</b>', 'foobar <b class="yui3-highlight">baz</b>'],
            Hi.wordMatch('baz foo bar', ['foo', 'bar', 'foo bar baz', 'foobar baz'])
        );
    },

    'wordMatch() should be case-insensitive': function () {
        ArrayAssert.itemsAreSame(
            ['<b class="yui3-highlight">Foo</b>', '<b class="yui3-highlight">foo</b>'],
            Hi.wordMatch('foo', ['Foo', 'foo'])
        );
    },

    // -- wordMatchCase() ------------------------------------------------------
    'wordMatchCase() should be case-sensitive': function () {
        ArrayAssert.itemsAreSame(
            ['Foo', '<b class="yui3-highlight">foo</b>'],
            Hi.wordMatchCase('foo', ['Foo', 'foo'])
        );
    },

    'wordMatchFold() should match accent-folded characters': function () {
        ArrayAssert.itemsAreSame(
            ['<b class="yui3-highlight">fóó</b>', '<b class="yui3-highlight">foo</b>', 'barfoo'],
            Hi.wordMatchFold('foo', ['fóó', 'foo', 'barfoo'])
        );

        ArrayAssert.itemsAreSame(
            ['<b class="yui3-highlight">foo</b>', '<b class="yui3-highlight">fóó</b>', 'barfoo'],
            Hi.wordMatchFold('föö', ['foo', 'fóó', 'barfoo'])
        );
    }
}));

suite.add(baseSuite);
suite.add(filtersSuite);
suite.add(highlightSuite);

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: [
        'autocomplete-base', 'autocomplete-filters',
        'autocomplete-filters-accentfold', 'autocomplete-highlighters',
        'autocomplete-highlighters-accentfold', 'datasource-local', 'node',
        'jsonp', 'test', 'yql'
    ]
});
