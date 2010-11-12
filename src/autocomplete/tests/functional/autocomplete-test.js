YUI.add('autocomplete-test', function (Y) {

var ArrayAssert = Y.ArrayAssert,
    Assert      = Y.Assert,
    YArray      = Y.Array,

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

    '_parseResponse should preserve duplicates in text when using resultTextLocator': function () {
        var response = {
                results: [
                    {"City":"La Habra","State":"CA","County":"Orange","Zip":"90631"},
                    {"City":"La Habra Heights","State":"CA","County":"Orange","Zip":"90631"},
                    {"City":"La Habra Hgts","State":"CA","County":"Orange","Zip":"90631"}
                ]
            };

        this.ac.set('resultTextLocator', 'Zip');

        this.ac.on('results', function (e) {
            Assert.areNotEqual(e.results[0].raw.City, e.results[1].raw.City, 
              "The raw result values should be different.");
            Assert.areNotEqual(e.results[1].raw.City, e.results[2].raw.City,
              "The raw result values should be different.");
        });

        this.ac._parseResponse('90631', response);
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

    // 'maxResults should enforce a maximum number of results': function () {
    //     
    // },
    // 
    // 'maxResults should do nothing if <= 0': function () {
    //     
    // },

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

function arrayToResults(array) {
    return YArray.map(array, function (item) {
        return {
            display: item,
            raw    : item,
            text   : item
        };
    });
}

function resultsToArray(results, key) {
    if (!key) {
        key = 'text';
    }

    return YArray.map(results, function (item) {
        return item[key];
    });
}

// -- Filters: API -------------------------------------------------------------
filtersSuite.add(new Y.Test.Case({
    name: 'API',

    // -- charMatch() ----------------------------------------------------------
    'charMatch() should match all characters in the query, in any order': function () {
        ArrayAssert.isEmpty(
            Filters.charMatch('abc', arrayToResults(['foo', 'bar', 'baz']))
        );

        ArrayAssert.itemsAreEqual(
            ['cab', 'taxi cab'],
            resultsToArray(Filters.charMatch('abc', arrayToResults(['foo', 'cab', 'bar', 'taxi cab'])))
        );
    },

    'charMatch() should be case-insensitive': function () {
        ArrayAssert.itemsAreSame(
            ['Foo', 'foo'],
            resultsToArray(Filters.charMatch('f', arrayToResults(['Foo', 'foo'])))
        );
    },

    'charMatchCase() should be case-sensitive': function () {
        ArrayAssert.itemsAreSame(
            ['foo'],
            resultsToArray(Filters.charMatchCase('f', arrayToResults(['Foo', 'foo'])))
        );
    },

    'charMatchFold() should match accent-folded characters': function () {
        ArrayAssert.itemsAreSame(
            ['fóó', 'föö', 'foo'],
            resultsToArray(Filters.charMatchFold('o', arrayToResults(['fóó', 'föö', 'foo', 'bar'])))
        );

        // Accent-folded matches are always case-insensitive.
        ArrayAssert.itemsAreSame(
            ['FÓÓ', 'FÖÖ', 'FOO'],
            resultsToArray(Filters.charMatchFold('o', arrayToResults(['FÓÓ', 'FÖÖ', 'FOO', 'BAR'])))
        );
    },

    // -- phraseMatch() --------------------------------------------------------
    'phraseMatch() should match the complete query as a phrase': function () {
        ArrayAssert.isEmpty(
            Filters.phraseMatch('foo baz',
                arrayToResults(['foo', 'bar', 'foo bar']))
        );

        ArrayAssert.itemsAreSame(
            ['foo bar'],
            resultsToArray(Filters.phraseMatch('foo bar', arrayToResults(['foo', 'bar', 'foo bar'])))
        );

        ArrayAssert.itemsAreSame(
            ['xxfoo barxx'],
            resultsToArray(Filters.phraseMatch('foo bar', arrayToResults(['foo', 'bar', 'xxfoo barxx'])))
        );

        ArrayAssert.itemsAreSame(
            ['foo barxx'],
            resultsToArray(Filters.phraseMatch('foo bar', arrayToResults(['foo', 'bar', 'foo barxx'])))
        );

        ArrayAssert.itemsAreSame(
            ['xxfoo bar'],
            resultsToArray(Filters.phraseMatch('foo bar', arrayToResults(['foo', 'bar', 'xxfoo bar'])))
        );
    },

    'phraseMatch() should be case-insensitive': function () {
        ArrayAssert.itemsAreSame(
            ['Foo', 'foo'],
            resultsToArray(Filters.phraseMatch('foo', arrayToResults(['Foo', 'foo'])))
        );
    },

    'phraseMatchCase() should be case-sensitive': function () {
        ArrayAssert.itemsAreSame(
            ['foo'],
            resultsToArray(Filters.phraseMatchCase('foo', arrayToResults(['Foo', 'foo'])))
        );
    },

    'phraseMatchFold() should match accent-folded characters': function () {
        ArrayAssert.itemsAreSame(
            ['fóó', 'föö', 'foo'],
            resultsToArray(Filters.phraseMatchFold('foo', arrayToResults(['fóó', 'föö', 'foo', 'bar'])))
        );

        // Accent-folded matches are always case-insensitive.
        ArrayAssert.itemsAreSame(
            ['FÓÓ', 'FÖÖ', 'FOO'],
            resultsToArray(Filters.phraseMatchFold('foo', arrayToResults(['FÓÓ', 'FÖÖ', 'FOO', 'BAR'])))
        );
    },

    // -- startsWith() ---------------------------------------------------------
    'startsWith() should match the complete query at the start of a result': function () {
        ArrayAssert.isEmpty(
            Filters.startsWith('foo', arrayToResults(['xx foo', 'bar', 'xx foo bar']))
        );

        ArrayAssert.itemsAreSame(
            ['foo', 'foo bar'],
            resultsToArray(Filters.startsWith('foo', arrayToResults(['foo', 'bar', 'foo bar'])))
        );
    },

    'startsWith() should be case-insensitive': function () {
        ArrayAssert.itemsAreSame(
            ['Foo', 'foo'],
            resultsToArray(Filters.startsWith('foo', arrayToResults(['Foo', 'foo'])))
        );
    },

    'startsWithCase() should be case-sensitive': function () {
        ArrayAssert.itemsAreSame(
            ['foo'],
            resultsToArray(Filters.startsWithCase('foo', arrayToResults(['Foo', 'foo'])))
        );
    },

    'startsWithFold() should match accent-folded characters': function () {
        ArrayAssert.itemsAreSame(
            ['fóó', 'föö', 'foo'],
            resultsToArray(Filters.startsWithFold('foo', arrayToResults(['fóó', 'föö', 'foo', 'barfoo'])))
        );

        // Accent-folded matches are always case-insensitive.
        ArrayAssert.itemsAreSame(
            ['FÓÓ', 'FÖÖ', 'FOO'],
            resultsToArray(Filters.startsWithFold('foo', arrayToResults(['FÓÓ', 'FÖÖ', 'FOO', 'BARFOO'])))
        );
    },

    // -- wordMatch() ----------------------------------------------------------
    'wordMatch() should match results that contain all words in the query in any order': function () {
        ArrayAssert.isEmpty(
            Filters.wordMatch('foo bar baz', arrayToResults(['foo', 'bar', 'baz']))
        );

        ArrayAssert.itemsAreSame(
            ['foo bar baz'],
            resultsToArray(Filters.wordMatch('baz foo bar', arrayToResults(['foo', 'bar', 'foo bar baz', 'foobar baz'])))
        );

        ArrayAssert.itemsAreSame(
            ['foo', 'foo bar baz'],
            resultsToArray(Filters.wordMatch('foo', arrayToResults(['foo', 'bar', 'foo bar baz', 'foobar baz'])))
        );
    },

    'wordMatch() should be case-insensitive': function () {
        ArrayAssert.itemsAreSame(
            ['Foo', 'foo'],
            resultsToArray(Filters.wordMatch('foo', arrayToResults(['Foo', 'foo'])))
        );
    },

    'wordMatchCase() should be case-sensitive': function () {
        ArrayAssert.itemsAreSame(
            ['foo'],
            resultsToArray(Filters.wordMatchCase('foo', arrayToResults(['Foo', 'foo'])))
        );
    },

    'wordMatchFold() should match accent-folded characters': function () {
        ArrayAssert.itemsAreSame(
            ['fóó', 'föö', 'foo'],
            resultsToArray(Filters.wordMatchFold('foo', arrayToResults(['fóó', 'föö', 'foo', 'barfoo'])))
        );

        // Accent-folded matches are always case-insensitive.
        ArrayAssert.itemsAreSame(
            ['FÓÓ', 'FÖÖ', 'FOO'],
            resultsToArray(Filters.wordMatchFold('foo', arrayToResults(['FÓÓ', 'FÖÖ', 'FOO', 'BARFOO'])))
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
            Hi.charMatch('abc', arrayToResults(['foo', 'bar', 'baz']))
        );
    },

    'charMatch() should be case-insensitive': function () {
        ArrayAssert.itemsAreSame(
            ['<b class="yui3-highlight">F</b>oo', '<b class="yui3-highlight">f</b>oo'],
            Hi.charMatch('f', arrayToResults(['Foo', 'foo']))
        );
    },

    // -- charMatchCase() ------------------------------------------------------
    'charMatchCase() should be case-sensitive': function () {
        ArrayAssert.itemsAreSame(
            ['Foo', '<b class="yui3-highlight">f</b>oo'],
            Hi.charMatchCase('f', arrayToResults(['Foo', 'foo']))
        );
    },

    // -- charMatchFold() ------------------------------------------------------
    'charMatchFold() should highlight accent-folded characters': function () {
        ArrayAssert.itemsAreSame(
            ['f<b class="yui3-highlight">ó</b><b class="yui3-highlight">ó</b>', 'f<b class="yui3-highlight">o</b><b class="yui3-highlight">o</b>', 'bar'],
            Hi.charMatchFold('o', arrayToResults(['fóó', 'foo', 'bar']))
        );

        ArrayAssert.itemsAreSame(
            ['f<b class="yui3-highlight">o</b><b class="yui3-highlight">o</b>', 'f<b class="yui3-highlight">o</b><b class="yui3-highlight">o</b>', 'bar'],
            Hi.charMatchFold('ö', arrayToResults(['foo', 'foo', 'bar']))
        );
    },

    // -- phraseMatch() --------------------------------------------------------
    'phraseMatch() should highlight the complete query as a phrase': function () {
        ArrayAssert.itemsAreSame(
            ['foo', 'bar', 'foo bar'],
            Hi.phraseMatch('foo baz', arrayToResults(['foo', 'bar', 'foo bar']))
        );

        ArrayAssert.itemsAreSame(
            ['foo', 'bar', '<b class="yui3-highlight">foo bar</b>'],
            Hi.phraseMatch('foo bar', arrayToResults(['foo', 'bar', 'foo bar']))
        );

        ArrayAssert.itemsAreSame(
            ['<b class="yui3-highlight">foo</b>', 'bar', '<b class="yui3-highlight">foo</b> bar'],
            Hi.phraseMatch('foo', arrayToResults(['foo', 'bar', 'foo bar']))
        );

        ArrayAssert.itemsAreSame(
            ['foo', 'bar', 'xx<b class="yui3-highlight">foo bar</b>'],
            Hi.phraseMatch('foo bar', arrayToResults(['foo', 'bar', 'xxfoo bar']))
        );
    },

    'phraseMatch() should be case-insensitive': function () {
        ArrayAssert.itemsAreSame(
            ['<b class="yui3-highlight">Foo</b>', '<b class="yui3-highlight">foo</b>'],
            Hi.phraseMatch('foo', arrayToResults(['Foo', 'foo']))
        );
    },

    // -- phraseMatchCase() ----------------------------------------------------
    'phraseMatchCase() should be case-sensitive': function () {
        ArrayAssert.itemsAreSame(
            ['Foo', '<b class="yui3-highlight">foo</b>'],
            Hi.phraseMatchCase('foo', arrayToResults(['Foo', 'foo']))
        );
    },

    // -- phraseMatchFold() ----------------------------------------------------
    'phraseMatchFold() should match accent-folded characters': function () {
        ArrayAssert.itemsAreSame(
            ['<b class="yui3-highlight">fóó</b>bar', 'bar<b class="yui3-highlight">foo</b>', 'bar'],
            Hi.phraseMatchFold('foo', arrayToResults(['fóóbar', 'barfoo', 'bar']))
        );

        ArrayAssert.itemsAreSame(
            ['<b class="yui3-highlight">foo</b>bar', 'bar<b class="yui3-highlight">foo</b>', 'bar'],
            Hi.phraseMatchFold('föö', arrayToResults(['foobar', 'barfoo', 'bar']))
        );
    },

    // -- startsWith() ---------------------------------------------------------
    'startsWith() should highlight the complete query at the start of a result': function () {
        ArrayAssert.itemsAreSame(
            ['xx foo', 'bar', 'xx foo bar'],
            Hi.startsWith('foo', arrayToResults(['xx foo', 'bar', 'xx foo bar']))
        );

        ArrayAssert.itemsAreSame(
            ['<b class="yui3-highlight">foo</b>', 'bar foo', '<b class="yui3-highlight">foo</b> bar'],
            Hi.startsWith('foo', arrayToResults(['foo', 'bar foo', 'foo bar']))
        );
    },

    'startsWith() should be case-insensitive': function () {
        ArrayAssert.itemsAreSame(
            ['<b class="yui3-highlight">Foo</b>', '<b class="yui3-highlight">foo</b>'],
            Hi.startsWith('foo', arrayToResults(['Foo', 'foo']))
        );
    },

    // -- startsWithCase() -----------------------------------------------------
    'startsWithCase() should be case-sensitive': function () {
        ArrayAssert.itemsAreSame(
            ['Foo', '<b class="yui3-highlight">foo</b>'],
            Hi.startsWithCase('foo', arrayToResults(['Foo', 'foo']))
        );
    },

    // -- startsWithFold() -----------------------------------------------------
    'startsWithFold() should match accent-folded characters': function () {
        ArrayAssert.itemsAreSame(
            ['<b class="yui3-highlight">fóó</b>', 'barfoo', 'bar'],
            Hi.startsWithFold('foo', arrayToResults(['fóó', 'barfoo', 'bar']))
        );

        ArrayAssert.itemsAreSame(
            ['<b class="yui3-highlight">foo</b>', 'barfoo', 'bar'],
            Hi.startsWithFold('föö', arrayToResults(['foo', 'barfoo', 'bar']))
        );
    },

    // -- wordMatch() ----------------------------------------------------------
    'wordMatch() should highlight complete words in the query': function () {
        ArrayAssert.itemsAreSame(
            ['foobar', 'barbaz'],
            Hi.wordMatch('foo bar baz', arrayToResults(['foobar', 'barbaz']))
        );

        ArrayAssert.itemsAreSame(
            ['<b class="yui3-highlight">foo</b>', '<b class="yui3-highlight">bar</b>', '<b class="yui3-highlight">foo</b> <b class="yui3-highlight">bar</b> <b class="yui3-highlight">baz</b>', 'foobar <b class="yui3-highlight">baz</b>'],
            Hi.wordMatch('baz foo bar', arrayToResults(['foo', 'bar', 'foo bar baz', 'foobar baz']))
        );
    },

    'wordMatch() should be case-insensitive': function () {
        ArrayAssert.itemsAreSame(
            ['<b class="yui3-highlight">Foo</b>', '<b class="yui3-highlight">foo</b>'],
            Hi.wordMatch('foo', arrayToResults(['Foo', 'foo']))
        );
    },

    // -- wordMatchCase() ------------------------------------------------------
    'wordMatchCase() should be case-sensitive': function () {
        ArrayAssert.itemsAreSame(
            ['Foo', '<b class="yui3-highlight">foo</b>'],
            Hi.wordMatchCase('foo', arrayToResults(['Foo', 'foo']))
        );
    },

    'wordMatchFold() should match accent-folded characters': function () {
        ArrayAssert.itemsAreSame(
            ['<b class="yui3-highlight">fóó</b>', '<b class="yui3-highlight">foo</b>', 'barfoo'],
            Hi.wordMatchFold('foo', arrayToResults(['fóó', 'foo', 'barfoo']))
        );

        ArrayAssert.itemsAreSame(
            ['<b class="yui3-highlight">foo</b>', '<b class="yui3-highlight">fóó</b>', 'barfoo'],
            Hi.wordMatchFold('föö', arrayToResults(['foo', 'fóó', 'barfoo']))
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
        'autocomplete-highlighters-accentfold', 'autocomplete-test-data', 
        'datasource-local', 'node', 'jsonp', 'test', 'yql'
    ]
});
