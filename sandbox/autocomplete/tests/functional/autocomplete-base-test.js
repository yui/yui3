YUI.add('autocomplete-base-test', function (Y) {

var AutoComplete = Y.AutoComplete;

Y.Test.Runner.add(new Y.Test.Case({
    name: 'AutoComplete',

    _should: {
        error: {
            'Initializer should require an inputNode': 'No input node specified.'
        }
    },

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

    // -- Initialization -------------------------------------------------------
    'Initializer should accept an inputNode': function () {
        var ac = new AutoComplete({inputNode: this.inputNode});
        Y.Assert.areSame(this.inputNode, ac.get('inputNode'));

        ac = new AutoComplete({inputNode: '#ac'});
        Y.Assert.areSame(this.inputNode, ac.get('inputNode'));
    },

    'Initializer should require an inputNode': function () {
        // Should fail.
        new AutoComplete();
    },

    'Browser autocomplete should be off by default': function () {
        Y.Assert.areSame('off', this.inputNode.getAttribute('autocomplete'));
    },

    'Browser autocomplete should be turned on when enabled': function () {
        new AutoComplete({
            inputNode: this.inputNode,
            allowBrowserAutocomplete: true
        });

        Y.Assert.areSame('on', this.inputNode.getAttribute('autocomplete'));
    },

    // -- Attributes -----------------------------------------------------------
    'dataSource should only accept dataSource-like objects and null': function () {
        var ds = {sendRequest: function () {}};

        Y.Assert.isUndefined(this.dataSource);

        this.ac.set('dataSource', {});
        Y.Assert.isUndefined(this.dataSource);

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
    },

    // -- Static Methods -------------------------------------------------------
}));

}, '@VERSION@', {requires:['autocomplete-base', 'node', 'test']});
