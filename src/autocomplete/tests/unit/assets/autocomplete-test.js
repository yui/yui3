YUI.add('autocomplete-test', function (Y) {

var ArrayAssert  = Y.ArrayAssert,
    Assert       = Y.Assert,
    ObjectAssert = Y.ObjectAssert,
    YArray       = Y.Array,

    ACBase,
    Filters      = Y.AutoCompleteFilters,
    Hi           = Y.AutoCompleteHighlighters,

    suite,
    baseSuite,
    filtersSuite,
    highlightSuite,
    listSuite,
    pluginSuite;

// Simple, bare AutoCompleteBase implementation for testing.
ACBase = Y.Base.create('autocomplete', Y.Base, [Y.AutoCompleteBase], {
    initializer: function () {
        this._bindUIACBase();
        this._syncUIACBase();
    }
});

// Helper functions.
function arrayToResults(array) {
    return YArray.map(array, function (item) {
        return {
            display: item,
            raw    : item,
            text   : item
        };
    });
}

function makeRequest(query, callback) {
    return {
        request: query,
        callback: {success: callback || function () {}}
    };
}

function resultsToArray(results, key) {
    if (!key) {
        key = 'text';
    }

    return YArray.map(results, function (item) {
        return item[key];
    });
}

function setUpACInstance() {
    this.inputNode = Y.Node.create('<input id="ac" type="text">');

    Y.one('body').append('<div id="testbed"/>');
    Y.one('#testbed').append(this.inputNode);

    this.ac = new ACBase({
        inputNode : this.inputNode,
        queryDelay: 0 // makes queries synchronous; easier for testing
    });

    // Helper method that synchronously simulates a valueChange event on the
    // inputNode.
    this.simulateInput = function (value, ac) {
        ac || (ac = this.ac);
        this.inputNode.set('value', value);
        ac._onInputValueChange({newVal: value});
    };
}

function setUpACListInstance() {
    this.inputNode = Y.Node.create('<input id="ac" type="text">');

    Y.one('body').append('<div id="testbed"/>');
    Y.one('#testbed').append(this.inputNode);

    this.ac = new Y.AutoComplete({
        inputNode : this.inputNode,
        queryDelay: 0 // makes queries synchronous; easier for testing,
    });

    // Helper method that synchronously simulates a valueChange event on the
    // inputNode.
    this.simulateInput = function (value, ac) {
        ac || (ac = this.ac);
        this.inputNode.set('value', value);
        ac._onInputValueChange({newVal: value});
    };
}

function tearDownACInstance() {
    this.ac.destroy();
    Y.one('#testbed').remove(true);

    delete this.ac;
    delete this.inputNode;
}

function tearDownACListInstance() {
    this.ac.destroy();
    Y.one('#testbed').remove(true);

    delete this.ac;
    delete this.inputNode;
}

// -- Global Suite -------------------------------------------------------------
suite = new Y.Test.Suite('AutoComplete');

// -- Base Suite ---------------------------------------------------------------
baseSuite = new Y.Test.Suite('Base');

// -- Base: Lifecycle ----------------------------------------------------------
baseSuite.add(new Y.Test.Case({
    name: 'Lifecycle',

    _should: {
        // error: {
        //     'Initializer should require an inputNode': 'No inputNode specified.'
        // }
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

    'destructor should detach events': function () {
        var ac = new ACBase({inputNode: this.inputNode});
        ac.destroy();

        Assert.isUndefined(ac._acBaseEvents, '_acBaseEvents should be undefined');
        Assert.isUndefined(ac._cache, '_cache should be undefined');
        Assert.isUndefined(ac._inputNode, '_inputNode should be undefined');
        Assert.isUndefined(ac._rawSource, '_rawSource should be undefined');
    }

    // Note: This test is temporarily commented out since it appears to cause
    // the autocomplete:init event to remain on the event stack indefinitely,
    // preventing all queuable events from firing. It's not clear that this is
    // incorrect behavior, but it needs further investigation.

    // 'Initializer should require an inputNode': function () {
        // Should fail.
        // var ac = new ACBase();
    // }
}));

// -- Base: Attributes ---------------------------------------------------------
baseSuite.add(new Y.Test.Case({
    name: 'Attributes',

    setUp: setUpACInstance,
    tearDown: tearDownACInstance,

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

    'maxResults should enforce a maximum number of results': function () {
        this.ac.once('results', function (e) {
            Assert.areSame(3, e.results.length);
        });

        this.ac.set('maxResults', 3);
        this.ac._parseResponse('foo', {results: ['one', 'two', 'three', 'four']});
    },

    'maxResults should do nothing if <= 0': function () {
        this.ac.on('results', function (e) {
            Assert.areSame(4, e.results.length);
        });

        this.ac.set('maxResults', 0);
        this.ac._parseResponse('foo', {results: ['one', 'two', 'three', 'four']});
        this.ac.set('maxResults', -5);
        this.ac._parseResponse('foo', {results: ['one', 'two', 'three', 'four']});
    },

    'minQueryLength should enforce a minimum query length': function () {
        var fired = 0;

        this.ac.on('query', function (e) { fired += 1; });
        this.ac.set('minQueryLength', 3);

        this.simulateInput('foo');
        Assert.areSame(1, fired);

        this.ac.set('minQueryLength', 4);
        this.simulateInput('bar');
        Assert.areSame(1, fired);
    },

    'minQueryLength should allow empty queries if set to 0': function () {
        var fired = 0;

        this.ac.on('query', function (e) { fired += 1; });
        this.ac.set('minQueryLength', 0);

        this.simulateInput('foo');
        this.simulateInput('');

        Assert.areSame(2, fired);
    },

    'minQueryLength should prevent queries if negative': function () {
        var fired = 0;

        this.ac.on('query', function (e) { fired += 1; });
        this.ac.set('minQueryLength', -1);

        this.simulateInput('foo');
        this.simulateInput('bar');

        Assert.areSame(0, fired);
    },

    'queryDelay should delay query events': function () {
        var fired = 0;

        this.ac.on('query', function (e) {
            fired += 1;
            Assert.areSame('bar', e.query);
        });

        this.ac.set('queryDelay', 30);

        this.simulateInput('foo');
        this.simulateInput('bar');

        Assert.areSame(0, fired);

        this.wait(function () {
            Assert.areSame(1, fired);
        }, 35);
    },

    '_parseValue should return the rightmost token when using a queryDelimiter': function () {
        this.ac.set('queryDelimiter', ',');
        Assert.areSame('bar', this.ac._parseValue('foo, bar'));

        this.ac.set('queryDelimiter', '@@@');
        Assert.areSame('bar', this.ac._parseValue('foo@@@bar'));
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

    '`this` object in requestTemplate functions should be the AutoComplete instance': function () {
        var ac    = this.ac,
            calls = 0;

        this.ac.set('requestTemplate', function () {
            calls += 1;
            Assert.areSame(ac, this);
        });

        this.ac.set('source', ['foo', 'bar']);
        this.ac.sendRequest('foo');

        Assert.areSame(1, calls);
    },

    'resultFilters should accept a function, array of functions, string, array of strings, or null': function () {
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

    'result filters should receive the query and an array of result objects as parameters': function () {
        var called = 0,
            self   = this,
            filter = function (query, results) {
                called += 1;

                Assert.areSame('foo', query);
                Assert.isArray(results);

                ObjectAssert.areEqual({
                    display: 'foo&amp;bar',
                    raw    : 'foo&bar',
                    text   : 'foo&bar'
                }, results[0]);

                Assert.areSame(self.ac, this, '`this` object in filters should be the AutoComplete instance');

                return results;
            };

        this.ac.set('resultFilters', filter);
        this.ac._parseResponse('foo', {results: ['foo&bar']});

        Assert.areSame(1, called, 'filter was never called');
    },

    'resultFormatter should accept a function or null': function () {
        var formatter = function () {};

        this.ac.set('resultFormatter', formatter);
        Assert.areSame(formatter, this.ac.get('resultFormatter'));

        this.ac.set('resultFormatter', null);
        Assert.isNull(this.ac.get('resultFormatter'));
    },

    'result formatters should receive the query and an array of result objects as parameters': function () {
        var called = 0,
            self   = this,
            formatter = function (query, results) {
                called += 1;

                Assert.areSame('foo', query);
                Assert.isArray(results);

                ObjectAssert.areEqual({
                    display: 'foo&amp;bar',
                    raw    : 'foo&bar',
                    text   : 'foo&bar'
                }, results[0]);

                Assert.areSame(self.ac, this, '`this` object in formatters should be the AutoComplete instance');

                return ['|foo|'];
            };

        this.ac.set('resultFormatter', formatter);
        this.ac._parseResponse('foo', {results: ['foo&bar']});

        Assert.areSame(1, called, 'formatter was never called');
        Assert.areSame('|foo|', this.ac.get('results')[0].display);
    },

    'resultHighlighter should accept a function, string, or null': function () {
        var highlighter = function () {};

        this.ac.set('resultHighlighter', highlighter);
        Assert.areSame(highlighter, this.ac.get('resultHighlighter'));

        this.ac.set('resultHighlighter', null);
        Assert.isNull(this.ac.get('resultHighlighter'));

        this.ac.set('resultHighlighter', 'phraseMatch');
        Assert.areSame(Y.AutoCompleteHighlighters.phraseMatch, this.ac.get('resultHighlighter'));
    },

    'result highlighters should receive the query and an array of result objects as parameters': function () {
        var called = 0,
            self   = this,
            highlighter = function (query, results) {
                called += 1;

                Assert.areSame('foo', query);
                Assert.isArray(results);

                ObjectAssert.areEqual({
                    display: 'foo&amp;bar',
                    raw    : 'foo&bar',
                    text   : 'foo&bar'
                }, results[0]);

                Assert.areSame(self.ac, this, '`this` object in highlighters should be the AutoComplete instance');

                return ['|foo|'];
            };

        this.ac.set('resultHighlighter', highlighter);
        this.ac._parseResponse('foo', {results: ['foo&bar']});

        Assert.areSame(1, called, 'highlighter was never called');
        Assert.areSame('|foo|', this.ac.get('results')[0].highlighted);
    },

    'resultListLocator should accept a function, string, or null': function () {
        var locator = function () {};

        this.ac.set('resultListLocator', locator);
        Assert.areSame(locator, this.ac.get('resultListLocator'));

        this.ac.set('resultListLocator', null);
        Assert.isNull(this.ac.get('resultListLocator'));

        this.ac.set('resultListLocator', 'foo.bar');
        Assert.isFunction(this.ac.get('resultListLocator'));
    },

    'resultListLocator should locate results': function () {
        var self = this;

        this.ac.set('resultListLocator', 'foo.bar');
        this.ac._parseResponse('foo', {results: {foo: {bar: ['foo']}}});

        Assert.areSame(1, this.ac.get('results').length, 'results array is empty');
        Assert.areSame('foo', this.ac.get('results')[0].text);

        this.ac.set('resultListLocator', function () {
            Assert.areSame(self.ac, this, '`this` object should be the AutoComplete instance');
        });

        this.ac._parseResponse('foo', {results: {foo: {bar: ['foo']}}});
    },

    'resultTextLocator should locate result text': function () {
        var self = this;

        this.ac.set('resultTextLocator', 'foo.bar');
        this.ac._parseResponse('foo', {results: [{foo: {bar: 'foo'}}]});

        Assert.areSame(1, this.ac.get('results').length, 'results array is empty');
        Assert.areSame('foo', this.ac.get('results')[0].text);

        this.ac.set('resultTextLocator', function () {
            Assert.areSame(self.ac, this, '`this` object should be the AutoComplete instance');
        });

        this.ac._parseResponse('foo', {results: [{foo: {bar: 'foo'}}]});
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

    // See the "Built-in Sources" test case below for source and sourceType
    // tests.

    'value attribute should update the inputNode value and query attribute when set via the API, but should not fire a query event': function () {
        this.ac.on('query', function () {
            Assert.fail('query event was triggered');
        });

        this.ac.set('value', 'foo');
        Assert.areSame('foo', this.inputNode.get('value'));
        Assert.areSame('foo', this.ac.get('query'));

        this.ac.set('value', 'bar');
        Assert.areSame('bar', this.inputNode.get('value'));
        Assert.areSame('bar', this.ac.get('query'));

        this.ac.set('value', '');
        Assert.areSame('', this.inputNode.get('value'));
        Assert.isNull(this.ac.get('query'));
    },

    // -- Generic setters and validators ---------------------------------------
    '_functionValidator() should accept a function or null': function () {
        Assert.isTrue(this.ac._functionValidator(function () {}));
        Assert.isTrue(this.ac._functionValidator(null));
        Assert.isFalse(this.ac._functionValidator('foo'));
    }
}));

// -- Base: Events -------------------------------------------------------------
baseSuite.add(new Y.Test.Case({
    name: 'Events',

    setUp: setUpACInstance,
    tearDown: tearDownACInstance,

    'clear event should fire when the query is cleared': function () {
        var fired = 0;

        this.ac.on('clear', function (e) {
            fired += 1;
            Assert.areSame('foo', e.prevVal);
        });

        // Without delimiter.
        this.simulateInput('foo');
        Assert.areSame('foo', this.ac.get('query'));

        this.simulateInput('');
        Assert.areSame(1, fired);
        Assert.isNull(this.ac.get('query'));

        // With delimiter.
        this.ac.set('queryDelimiter', ',');

        this.simulateInput('bar,foo');
        this.simulateInput('');

        Assert.areSame(2, fired);
    },

    'clear event should fire when the value attribute is cleared via the API': function () {
        var fired = 0;

        this.ac.on('clear', function (e) {
            fired += 1;
            Assert.areSame('foo', e.prevVal);
        });

        this.simulateInput('foo');
        this.ac.set('value', '');

        Assert.areSame(1, fired);
    },

    'clear event should be preventable': function () {
        this.ac.on('clear', function (e) {
            e.preventDefault();
        });

        this.simulateInput('foo');
        this.simulateInput('');

        Assert.areSame('foo', this.ac.get('query'));
    },

    'query event should fire when the value attribute is changed via the UI': function () {
        var fired = 0;

        this.ac.on('query', function (e) {
            fired += 1;

            Assert.areSame(e.inputValue, 'foo');
            Assert.areSame(e.query, 'foo');
        });

        this.simulateInput('foo');

        Assert.areSame(1, fired);
        Assert.areSame('foo', this.ac.get('query'));
    },

    'query event should be preventable': function () {
        this.ac.sendRequest = function () {
            Assert.fail('query event was not prevented');
        };

        this.ac.on('query', function (e) {
            e.preventDefault();
        });

        this.simulateInput('foo');
    },

    'results event should fire when a source returns results': function () {
        var fired = 0;

        this.ac.set('source', ['foo', 'bar']);

        this.ac.on('results', function (e) {
            fired += 1;

            Assert.areSame('foo', e.query);
            ArrayAssert.itemsAreSame(['foo', 'bar'], e.data);
            ArrayAssert.itemsAreSame(['foo', 'bar'], resultsToArray(e.results));
        });

        this.simulateInput('foo');

        Assert.areSame(1, fired);
    },

    'results event should be preventable': function () {
        this.ac.set('source', ['foo', 'bar']);

        this.ac.on('results', function (e) {
            e.preventDefault();
        });

        this.simulateInput('foo');
        ArrayAssert.isEmpty(this.ac.get('results'));
    }
}));

// -- Base: Methods ------------------------------------------------------------
baseSuite.add(new Y.Test.Case({
    name: 'Methods',

    setUp: setUpACInstance,
    tearDown: tearDownACInstance,

    'sendRequest should provide a complete request object to source.sendRequest': function () {
        var mockSource = Y.Mock();

        // Create a mock DataSource-like source so we can test what gets passed
        // to source.sendRequest().
        Y.Mock.expect(mockSource, {
            method: 'sendRequest',
            args: [Y.Mock.Value(function (request) {
                ObjectAssert.hasKeys(['query', 'request', 'callback'], request);
                Assert.areSame('foo bar', request.query);
                Assert.areSame('?q=foo%20bar&baz=quux', request.request);
                Assert.isObject(request.callback);
                Assert.isFunction(request.callback.success);
            })]
        });

        this.ac.set('source', mockSource);
        this.ac.set('requestTemplate', '?q={query}&baz=quux');
        this.ac.sendRequest('foo bar');

        Y.Mock.verify(mockSource);
    }
}));

// -- Base: Built-in Sources ---------------------------------------------------
baseSuite.add(new Y.Test.Case({
    name: 'Built-in sources',

    setUp: setUpACInstance,
    tearDown: tearDownACInstance,

    // -- Behavior -------------------------------------------------------------
    'Array sources should return the full array regardless of query': function () {
        this.ac.set('source', ['foo', 'bar', 'baz']);

        Assert.areSame('array', this.ac.get('source').type);

        this.ac.sendRequest('foo');
        ArrayAssert.itemsAreSame(['foo', 'bar', 'baz'], resultsToArray(this.ac.get('results')));

        this.ac.sendRequest('bar');
        ArrayAssert.itemsAreSame(['foo', 'bar', 'baz'], resultsToArray(this.ac.get('results')));
    },

    'DataSource sources should work': function () {
        var ds = new Y.DataSource.Local({
                source: ['foo', 'bar']
            });

        this.ac.set('source', ds);
        this.ac.sendRequest('test');

        ArrayAssert.itemsAreSame(['foo', 'bar'], resultsToArray(this.ac.get('results')));
    },

    'Function sources should support synchronous return values': function () {
        var realQuery;

        this.ac.set('source', function (query) {
            Assert.areSame(realQuery, query);
            return ['foo', 'bar', 'baz'];
        });

        Assert.areSame('function', this.ac.get('source').type);

        realQuery = 'foo';
        this.ac.sendRequest(realQuery);
        ArrayAssert.itemsAreSame(['foo', 'bar', 'baz'], resultsToArray(this.ac.get('results')));
    },

    'Function sources should support asynchronous return values': function () {
        var realQuery;

        this.ac.set('source', function (query, callback) {
            Assert.areSame(realQuery, query);
            setTimeout(function () {
                callback(['foo', 'bar', 'baz']);
            }, 10);
        });

        Assert.areSame('function', this.ac.get('source').type);

        realQuery = 'foo';
        this.ac.sendRequest(realQuery);

        this.wait(function () {
            ArrayAssert.itemsAreSame(['foo', 'bar', 'baz'], resultsToArray(this.ac.get('results')));
        }, 15);
    },

    'Object sources should work': function () {
        this.ac.set('source', {
            foo: ['foo'],
            bar: ['bar']
        });

        Assert.areSame('object', this.ac.get('source').type);

        this.ac.sendRequest('foo');
        ArrayAssert.itemsAreSame(['foo'], resultsToArray(this.ac.get('results')));

        this.ac.sendRequest('bar');
        ArrayAssert.itemsAreSame(['bar'], resultsToArray(this.ac.get('results')));

        this.ac.sendRequest('baz');
        ArrayAssert.itemsAreSame([], resultsToArray(this.ac.get('results')));
    },

    'sourceType should override source type detection for built-in types': function () {
        this.ac.set('source', ['foo', 'bar']);
        Assert.areSame('array', this.ac.get('source').type);

        this.ac.set('sourceType', 'object');
        Assert.areSame('object', this.ac.get('source').type);
    }
}));

// -- Base: Extra Sources ------------------------------------------------------
baseSuite.add(new Y.Test.Case({
    name: 'Extra sources (autocomplete-sources)',

    setUp: setUpACInstance,
    tearDown: tearDownACInstance,

    // -- Source types ---------------------------------------------------------
    '<select> nodes should be turned into select source objects': function () {
        var select = Y.Node.create('<select><option>foo</option><option>bar</option><option>baz</option></select>');
        this.ac.set('source', select);
        Assert.areSame('select', this.ac.get('source').type);
    },

    'A <select> result should be an object with convenient properties': function () {
        var select = Y.Node.create('<select><option value="abc">foo &amp; bar</option><option>bar</option><option>baz</option></select>'),
            result;

        this.ac.set('source', select);
        this.ac.sendRequest('foo');
        result = this.ac.get('results')[0].raw;

        ObjectAssert.areEqual({
            html    : 'foo &amp; bar',
            index   : 0,
            node    : select.get('options').item(0),
            selected: true,
            text    : 'foo & bar',
            value   : 'abc'
        }, result);
    },

    'XHR strings should be turned into IO source objects': function () {
        // Absolute URL.
        this.ac.set('source', 'http://example.com/');
        Assert.areSame('io', this.ac.get('source').type);

        this.ac.set('source', 'http://example.com/?q={query}');
        Assert.areSame('io', this.ac.get('source').type);

        // Relative URL.
        this.ac.set('source', 'foo');
        Assert.areSame('io', this.ac.get('source').type);

        this.ac.set('source', 'foo?q={query}');
        Assert.areSame('io', this.ac.get('source').type);
    },

    // TODO: mock io requests

    'JSONP strings should be turned into JSONP source objects': function () {
        // Absolute URL.
        this.ac.set('source', 'http://example.com/?callback={callback}');
        Assert.areSame('jsonp', this.ac.get('source').type);

        this.ac.set('source', 'http://example.com/?q={query}&callback={callback}');
        Assert.areSame('jsonp', this.ac.get('source').type);

        // Relative URL.
        this.ac.set('source', 'foo?callback={callback}');
        Assert.areSame('jsonp', this.ac.get('source').type);

        this.ac.set('source', 'foo?q={query}&callback={callback}');
        Assert.areSame('jsonp', this.ac.get('source').type);
    },

    'Y.JSONPRequest instances should be turned into JSONP source objects': function () {
        this.ac.set('source', new Y.JSONPRequest('http://example.com/'));
        Assert.areSame('jsonp', this.ac.get('source').type);
    },

    // TODO: mock JSONP requests

    'YQL strings should be turned into YQL source objects': function () {
        this.ac.set('source', 'select * from search.suggest where q="{query}"');
        Assert.areSame('yql', this.ac.get('source').type);

        this.ac.set('source', 'select * from search.suggest where q="{request}"');
        Assert.areSame('yql', this.ac.get('source').type);

        this.ac.set('source', 'set foo="bar" on search; select * from search.suggest where q="{query}"');
        Assert.areSame('yql', this.ac.get('source').type);

        this.ac.set('source', 'use "http://example.com/foo.env"; select * from search.suggest where q="{query}"');
        Assert.areSame('yql', this.ac.get('source').type);
    },

    // TODO: mock YQL requests

    // -- Other stuff ----------------------------------------------------------
    'sourceType should override source type detection for extra types': function () {
        this.ac.set('source', 'moo');
        Assert.areSame('io', this.ac.get('source').type);

        this.ac.set('sourceType', 'jsonp');
        Assert.areSame('jsonp', this.ac.get('source').type);
    },

    '_jsonpFormatter should correctly format URLs both with and without a requestTemplate set': function () {
        Assert.areSame('foo?q=bar%20baz&cb=callback', this.ac._jsonpFormatter('foo?q={query}&cb={callback}', 'callback', 'bar baz'));

        this.ac.set('requestTemplate', '?q={query}&cb={callback}');
        Assert.areSame('foo?q=bar%20baz&cb=callback', this.ac._jsonpFormatter('foo', 'callback', 'bar baz'));

        this.ac.set('requestTemplate', '&cb={callback}');
        Assert.areSame('foo?q=bar%20baz&cb=callback', this.ac._jsonpFormatter('foo?q={query}', 'callback', 'bar baz'));
    },

    'requestTemplate should be appended to XHR source URLs': function () {
        var query  = 'monkey pants',
            source = '/foo?q={query}';

        this.ac.set('source', source);
        this.ac.set('requestTemplate', '&bar=baz');

        Assert.areSame(
            '/foo?q=' + encodeURIComponent(query) + '&bar=baz',
            this.ac._getXHRUrl(source, {
                query  : query,
                request: this.ac.get('requestTemplate').call(this.ac, query)
            })
        );
    }
}));

// -- Filters Suite ------------------------------------------------------------
filtersSuite = new Y.Test.Suite('Filters');

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

    // -- subWordMatch() -------------------------------------------------------
    'subWordMatch() should match results where all words in the query - ignoring whitespace and punctuation - occur partially in the text': function () {
        ArrayAssert.isEmpty(
            Filters.subWordMatch('foo bar baz', arrayToResults(['foo', 'bar', 'baz']))
        );

        ArrayAssert.itemsAreSame(
            ['foo bar baz', 'foobar baz'],
            resultsToArray(Filters.subWordMatch('baz foo bar', arrayToResults(['foo', 'bar', 'foo bar baz', 'foobar baz'])))
        );

        ArrayAssert.itemsAreSame(
            ['John Doe'],
            resultsToArray(Filters.subWordMatch('John', arrayToResults(['John Doe', 'Jon Doe', 'Richard Roe'])))
        );

        ArrayAssert.itemsAreSame(
            ['John Doe', 'Jon Doe'],
            resultsToArray(Filters.subWordMatch('J. Doe', arrayToResults(['John Doe', 'Jon Doe', 'Richard Roe'])))
        );

        ArrayAssert.itemsAreSame(
            ['John Doe', 'Jon Doe'],
            resultsToArray(Filters.subWordMatch('D., Jo.', arrayToResults(['John Doe', 'Jon Doe', 'Richard Roe'])))
        );

        ArrayAssert.itemsAreSame(
            ['John Doe', 'Jon Doe', 'Richard Roe [12345]'],
            resultsToArray(Filters.subWordMatch('oe', arrayToResults(['John Doe', 'Jon Doe', 'Richard Roe [12345]', 'O.E.'])))
        );

        ArrayAssert.itemsAreSame(
            ['Anne-Sophie'],
            resultsToArray(Filters.subWordMatch('(Sophie-Ann.)', arrayToResults(['Anne-Sophie', 'Ann-Christine'])))
        );
    },

    'subWordMatch() should be case-insensitive': function () {
        ArrayAssert.itemsAreSame(
            ['Foo', 'foo'],
            resultsToArray(Filters.subWordMatch('foo', arrayToResults(['Foo', 'foo'])))
        );
    },

    'subWordMatchCase() should be case-sensitive': function () {
        ArrayAssert.itemsAreSame(
            ['foo'],
            resultsToArray(Filters.subWordMatchCase('foo', arrayToResults(['Foo', 'foo'])))
        );
    },

    'subWordMatchFold() should match accent-folded characters': function () {
        ArrayAssert.itemsAreSame(
            [],
            resultsToArray(Filters.subWordMatchFold('foobaz', arrayToResults(['fóóbar [12345]', '.fóó-baz!'])))
        );

        ArrayAssert.itemsAreSame(
            ['fóó bar baz'],
            resultsToArray(Filters.subWordMatchFold('baz foo bar', arrayToResults(['fóó', 'fóó bar baz'])))
        );

        ArrayAssert.itemsAreSame(
            ['Anne-Sophie', 'Sophie, Anné'],
            resultsToArray(Filters.subWordMatchFold('Anné S.', arrayToResults(['Anne-Sophie', 'Sophie, Anné', 'Ann Sophie'])))
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

    // -- subWordMatch() -------------------------------------------------------
    'subWordMatch() should highlight partial words in the query': function () {
        ArrayAssert.itemsAreSame(
            ['foobar [12345]', '.foo-baz!'],
            Hi.subWordMatch('foobaz', arrayToResults(['foobar [12345]', '.foo-baz!']))
        );

        ArrayAssert.itemsAreSame(
            ['<b class="yui3-highlight">foo</b>', '<b class="yui3-highlight">foo</b> <b class="yui3-highlight">bar</b> <b class="yui3-highlight">baz</b>'],
            Hi.subWordMatch('baz foo bar', arrayToResults(['foo', 'foo bar baz']))
        );

        ArrayAssert.itemsAreSame(
            ['<b class="yui3-highlight">Anne</b>-<b class="yui3-highlight">S</b>ophie', '<b class="yui3-highlight">S</b>ophie, <b class="yui3-highlight">Anne</b>', 'Ann <b class="yui3-highlight">S</b>ophie'],
            Hi.subWordMatch('Anne S.', arrayToResults(['Anne-Sophie', 'Sophie, Anne', 'Ann Sophie']))
        );
    },

    'subWordMatch() should be case-insensitive': function () {
        ArrayAssert.itemsAreSame(
            ['<b class="yui3-highlight">Foo</b>', '<b class="yui3-highlight">foo</b>'],
            Hi.subWordMatch('foo', arrayToResults(['Foo', 'foo']))
        );
    },

    // -- subWordMatchCase() ---------------------------------------------------
    'subWordMatchCase() should be case-sensitive': function () {
        ArrayAssert.itemsAreSame(
            ['Foo', '<b class="yui3-highlight">foo</b>'],
            Hi.subWordMatchCase('foo', arrayToResults(['Foo', 'foo']))
        );
    },

    // -- subWordMatchFold() ---------------------------------------------------
    'subWordMatchFold() should match accent-folded characters': function () {
        ArrayAssert.itemsAreSame(
            ['fóóbar [12345]', '.fóó-baz!'],
            Hi.subWordMatchFold('foobaz', arrayToResults(['fóóbar [12345]', '.fóó-baz!']))
        );

        ArrayAssert.itemsAreSame(
            ['<b class="yui3-highlight">fóó</b>', '<b class="yui3-highlight">fóó</b> <b class="yui3-highlight">bar</b> <b class="yui3-highlight">baz</b>'],
            Hi.subWordMatchFold('baz foo bar', arrayToResults(['fóó', 'fóó bar baz']))
        );

        ArrayAssert.itemsAreSame(
            ['<b class="yui3-highlight">Anne</b>-<b class="yui3-highlight">S</b>ophie', '<b class="yui3-highlight">S</b>ophie, <b class="yui3-highlight">Anné</b>', 'Ann <b class="yui3-highlight">S</b>ophie'],
            Hi.subWordMatchFold('Anné S.', arrayToResults(['Anne-Sophie', 'Sophie, Anné', 'Ann Sophie']))
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

// -- List Suite ---------------------------------------------------------------
listSuite = new Y.Test.Suite('List');

// -- List: Lifecycle ----------------------------------------------------------
listSuite.add(new Y.Test.Case({
    name: 'Lifecycle',

    setUp: setUpACListInstance,
    tearDown: tearDownACListInstance,

    'List should render inside the same parent as the inputNode by default': function () {
        this.ac.render();
        Assert.areSame(this.inputNode.get('parentNode'), this.ac.get('boundingBox').get('parentNode'));
    },

    'List width should match the width of the inputNode by default': function () {
        this.ac.render();
        Assert.areSame(this.inputNode.get('offsetWidth'), this.ac.get('boundingBox').get('offsetWidth'));
    },

    'Explicit list widths should be supported': function () {
        this.ac.set('width', '142px');
        this.ac.render();
        Assert.areSame(142, this.ac.get('boundingBox').get('offsetWidth'));
    },

    'List should default to a sane width if the inputNode width is 0 or unknown': function () {
        this.inputNode.setStyle('display', 'none');
        this.ac.render();
        Y.assert(this.ac.get('boundingBox').get('offsetWidth') > 0, 'List widget width should be greater than 0px');
    },

    // Ticket #2529692
    'List should not appear automatically when attached to an inputNode with text': function () {
        this.inputNode.set('value', 'foo');

        var ac = new Y.AutoComplete({
            inputNode: this.inputNode,
            queryDelay: 0,
            render: true,
            source: ['foo', 'bar']
        });

        Assert.isFalse(ac.get('visible'));
    },

    'test: verify list markup': function () {
        this.ac.render();

        // Verify DOM hierarchy and class names.
        Assert.isTrue(this.inputNode.hasClass('yui3-aclist-input'));
        Assert.isNotNull(Y.one('#testbed > div.yui3-aclist.yui3-aclist-hidden > div.yui3-aclist-content > ul.yui3-aclist-list'));

        // Verify ARIA markup on the input node.
        Assert.areSame('list', this.inputNode.get('aria-autocomplete'));
        Assert.areSame('false', this.inputNode.get('aria-expanded'));
        Assert.areSame(this.ac.get('listNode').get('id'), this.inputNode.get('aria-owns'));

        // Verify ARIA markup on the bounding box and list node.
        Assert.areSame('true', this.ac.get('boundingBox').get('aria-hidden'));
        Assert.areSame('listbox', this.ac.get('listNode').get('role'));

        // Verify that a live region node exists.
        var liveRegion = Y.one('#testbed > div.yui3-aclist-aria');

        Assert.isNotNull(liveRegion);
        Assert.areSame('polite', liveRegion.get('aria-live'));
        Assert.areSame('status', liveRegion.get('role'));
    },

    'test: verify result item markup': function () {
        this.ac.render();
        this.ac._set('results', arrayToResults(['foo', 'bar']));

        var listNode = this.ac.get('listNode');

        Assert.areSame(2, listNode.all('> li.yui3-aclist-item').size());
        Assert.areSame('option', listNode.one('> li.yui3-aclist-item').get('role'));
    }
}));

// -- List: Attributes ---------------------------------------------------------
listSuite.add(new Y.Test.Case({
    name: 'Attributes',

    setUp: setUpACListInstance,
    tearDown: tearDownACListInstance,

    _should: {
        ignore: {
            'test: tabSelect': Y.UA.ios || Y.UA.android
        }
    },

    'test: activateFirstItem': function () {
        this.ac.render();

        this.ac._set('results', arrayToResults(['foo', 'bar']));
        Assert.isNull(this.ac.get('activeItem'));

        this.ac.set('activateFirstItem', true);
        this.ac._set('results', arrayToResults(['bar', 'baz']));
        Assert.areSame(this.ac.get('listNode').one('> li.yui3-aclist-item'), this.ac.get('activeItem'));
    },

    'test: activeItem': function () {
        this.ac.render();
        this.ac._set('results', arrayToResults(['foo', 'bar']));

        Assert.isNull(this.ac.get('activeItem'));
        Assert.isNull(this.inputNode.get('aria-activedescendant'));

        var items = this.ac.get('listNode').all('> li.yui3-aclist-item');

        this.ac.set('activeItem', items.item(0));
        Assert.areSame(items.item(0), this.ac.get('activeItem'));
        Assert.areSame(items.item(0).get('id'), this.inputNode.get('aria-activedescendant'));
        Assert.isTrue(items.item(0).hasClass('yui3-aclist-item-active'));

        this.ac.set('activeItem', items.item(1));
        Assert.areSame(items.item(1), this.ac.get('activeItem'));
        Assert.areSame(items.item(1).get('id'), this.inputNode.get('aria-activedescendant'));
        Assert.isFalse(items.item(0).hasClass('yui3-aclist-item-active'));
        Assert.isTrue(items.item(1).hasClass('yui3-aclist-item-active'));

        this.ac.set('activeItem', null);
        Assert.isNull(this.ac.get('activeItem'));
        Assert.isNull(this.inputNode.get('aria-activedescendant'));
        Assert.isFalse(items.item(0).hasClass('yui3-aclist-item-active'));
        Assert.isFalse(items.item(1).hasClass('yui3-aclist-item-active'));
    },

    'test: alwaysShowList': function () {
        this.ac.set('alwaysShowList', true);

        this.ac.render();
        Assert.isTrue(this.ac.get('visible'));

        this.ac.hide();
        Assert.isTrue(this.ac.get('visible'));
    },

    'test: circular': function () {
        this.ac.render();
        this.ac._set('results', arrayToResults(['foo', 'bar']));

        var items = this.ac.get('listNode').all('> li.yui3-aclist-item');

        // circular === true, going down.
        this.ac._activateNextItem();
        Assert.areSame(items.item(0), this.ac.get('activeItem'));
        this.ac._activateNextItem();
        Assert.areSame(items.item(1), this.ac.get('activeItem'));
        this.ac._activateNextItem();
        Assert.isNull(this.ac.get('activeItem'));
        this.ac._activateNextItem();
        Assert.areSame(items.item(0), this.ac.get('activeItem'));
        this.ac.set('activeItem', null);

        // circular == true, going up
        this.ac._activatePrevItem();
        Assert.areSame(items.item(1), this.ac.get('activeItem'));
        this.ac._activatePrevItem();
        Assert.areSame(items.item(0), this.ac.get('activeItem'));
        this.ac._activatePrevItem();
        Assert.isNull(this.ac.get('activeItem'));
        this.ac._activatePrevItem();
        Assert.areSame(items.item(1), this.ac.get('activeItem'));
        this.ac.set('activeItem', null);

        // circular === false, going down
        this.ac.set('circular', false);
        this.ac._activateNextItem();
        Assert.areSame(items.item(0), this.ac.get('activeItem'));
        this.ac._activateNextItem();
        Assert.areSame(items.item(1), this.ac.get('activeItem'));
        this.ac._activateNextItem();
        Assert.areSame(items.item(1), this.ac.get('activeItem'));
        this.ac.set('activeItem', null);

        // circular === false, going up
        this.ac._activatePrevItem();
        Assert.isNull(this.ac.get('activeItem'));
        this.ac.set('activeItem', items.item(1));
        this.ac._activatePrevItem();
        Assert.areSame(items.item(0), this.ac.get('activeItem'));
        this.ac._activatePrevItem();
        Assert.isNull(this.ac.get('activeItem'));
    },

    'test: hoveredItem': function () {
        this.ac.render();
        this.ac._set('results', arrayToResults(['foo', 'bar']));

        var items = this.ac.get('listNode').all('> li.yui3-aclist-item');

        Assert.isNull(this.ac.get('hoveredItem'));

        items.item(0).simulate('mouseover');
        Assert.areSame(items.item(0), this.ac.get('hoveredItem'));
        Assert.isTrue(items.item(0).hasClass('yui3-aclist-item-hover'));

        items.item(0).simulate('mouseout');
        Assert.isNull(this.ac.get('hoveredItem'));
        Assert.isFalse(items.item(0).hasClass('yui3-aclist-item-hover'));

        items.item(1).simulate('mouseover');
        Assert.areSame(items.item(1), this.ac.get('hoveredItem'));
        Assert.isTrue(items.item(1).hasClass('yui3-aclist-item-hover'));

        items.item(1).simulate('mouseout');
        Assert.isNull(this.ac.get('hoveredItem'));
        Assert.isFalse(items.item(1).hasClass('yui3-aclist-item-hover'));
    },

    'test: tabSelect': function () {
        this.ac.render();
        this.ac._set('results', arrayToResults(['foo', 'bar']));
        this.ac.set('alwaysShowList', true);

        var fired = 0,
            items = this.ac.get('listNode').all('> li.yui3-aclist-item');

        this.ac.on('select', function (e) {
            fired += 1;
            Assert.areSame(items.item(0), e.itemNode);
        });

        this.ac.set('activeItem', items.item(0));
        this.inputNode.simulate('keydown', {keyCode: 9});
        Assert.areSame(1, fired);

        this.ac.set('tabSelect', false);
        this.ac.set('activeItem', items.item(0));
        this.inputNode.simulate('keydown', {keyCode: 9});
        Assert.areSame(1, fired);

        this.ac.set('tabSelect', true);
        this.ac.set('activeItem', items.item(0));
        this.inputNode.simulate('keydown', {keyCode: 9});
        Assert.areSame(2, fired);
    },

    'test: visible': function () {
        this.ac.render();

        Assert.isFalse(this.ac.get('visible'));
        Assert.areSame('false', this.inputNode.get('aria-expanded'));
        Assert.isTrue(this.ac.get('boundingBox').hasClass('yui3-aclist-hidden'));
        Assert.areSame('true', this.ac.get('boundingBox').get('aria-hidden'));

        this.ac.set('visible', true);

        Assert.isTrue(this.ac.get('visible'));
        Assert.areSame('true', this.inputNode.get('aria-expanded'));
        Assert.isFalse(this.ac.get('boundingBox').hasClass('yui3-aclist-hidden'));
        Assert.areSame('false', this.ac.get('boundingBox').get('aria-hidden'));
    }
}));

// -- List: Events -------------------------------------------------------------
listSuite.add(new Y.Test.Case({
    name: 'Events',

    setUp: setUpACListInstance,
    tearDown: tearDownACListInstance,

    'select event should fire when a result is selected': function () {
        // Note: this test also covers the selectItem() method.
        this.ac.render();
        this.ac._set('results', arrayToResults(['foo', 'bar']));

        var fired = 0,
            items = this.ac.get('listNode').all('> li.yui3-aclist-item');

        this.ac.on('select', function (e) {
            fired += 1;
            Assert.areSame(items.item(0), e.itemNode);
            Assert.areSame('foo', e.result.text);
        });

        this.ac.selectItem(items.item(0));
        Assert.areSame(1, fired);
    },

    'list events should be detached when the list is destroyed': function () {
        this.ac.render();

        Assert.isTrue(this.ac._listEvents.length > 0);
        this.ac.destroy();
        Assert.areSame(0, this.ac._listEvents.length);

    }
}));

// -- List: API ----------------------------------------------------------------

listSuite.add(new Y.Test.Case({
    name: 'API',

    setUp: setUpACListInstance,
    tearDown: tearDownACListInstance,

    'hide() should hide the list, except when alwaysShowList is true': function () {
        this.ac.render();

        Assert.isFalse(this.ac.get('visible'));
        this.ac.show();
        Assert.isTrue(this.ac.get('visible'));
        this.ac.hide();
        Assert.isFalse(this.ac.get('visible'));

        this.ac.set('alwaysShowList', true);
        Assert.isTrue(this.ac.get('visible'));
        this.ac.hide();
        Assert.isTrue(this.ac.get('visible'));
    },

    '_ariaSay() should insert text only, not HTML': function () {
        this.ac.render();
        this.ac._set('results', arrayToResults(['<b>foo</b>']));

        var items = this.ac.get('listNode').all('> li.yui3-aclist-item');

        this.ac.selectItem(items.item(0));

        Assert.areSame('&lt;b&gt;foo&lt;/b&gt; selected.', this.ac._ariaNode.getHTML());
    }

    // Note: selectItem() is already covered by the select event test above. No
    // need to retest it.
}));

// -- Plugin Suite -------------------------------------------------------------
pluginSuite = new Y.Test.Suite('Plugin');

// -- Plugin: Lifecycle --------------------------------------------------------
pluginSuite.add(new Y.Test.Case({
    name: 'Lifecycle',

    setUp: function () {
        this.inputNode = Y.Node.create('<input id="ac" type="text">');
        Y.one(Y.config.doc.body).append(this.inputNode);
        this.inputNode.plug(Y.Plugin.AutoComplete);
    },

    tearDown: function () {
        this.inputNode.remove().destroy(true);
        delete this.inputNode;
    },

    'inputNode.ac should be an instance of Y.Plugin.AutoComplete': function () {
        Assert.isInstanceOf(Y.Plugin.AutoComplete, this.inputNode.ac);
    },

    'inputNode.ac should extend Y.AutoCompleteList': function () {
        Assert.isInstanceOf(Y.AutoCompleteList, this.inputNode.ac);
    },

    'The plugin should render itself immediately': function () {
        Assert.isTrue(this.inputNode.ac.get('rendered'));
    }
}));

suite.add(baseSuite);
suite.add(filtersSuite);
suite.add(highlightSuite);
suite.add(listSuite);
suite.add(pluginSuite);

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: [
        'autocomplete', 'autocomplete-filters',
        'autocomplete-filters-accentfold', 'autocomplete-highlighters',
        'autocomplete-highlighters-accentfold', 'autocomplete-test-data',
        'datasource-local', 'node', 'node-event-simulate', 'jsonp', 'test', 'yql'
    ]
});
