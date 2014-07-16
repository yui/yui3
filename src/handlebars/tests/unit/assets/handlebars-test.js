YUI.add('handlebars-test', function (Y) {

var Assert = Y.Assert,
    H      = Y.Handlebars,

    suite;

suite = new Y.Test.Suite({
    name: 'Handlebars'
});

// -- Sanity -------------------------------------------------------------------

// This functionality is already covered by Handlebars' own unit tests, but we
// double-check it here just to ensure that nothing has gone horribly wrong in
// the import process.

suite.add(new Y.Test.Case({
    name: 'Sanity',

    _should: {
        ignore: {
            'precompile() should precompile a template string to JS': !!Y.UA.ie
        }
    },

    // Ignoring this test in IE until we can come up with a way to test it that
    // doesn't break.
    'precompile() should precompile a template string to JS': function () {
        var precompiled = H.precompile('foo {{bar}}');
            template    = H.template(eval('(' + precompiled + ')'));

        Assert.areSame(
            "foo bar",
            template({bar: 'bar'})
        );
    },

    'compile() should compile a template string to a function': function () {
        var template = H.compile('foo {{bar}}');

        Assert.areSame(
            "foo bar",
            template({bar: 'bar'})
        );
    },

    '`0` should be considered a non-empty value': function () {
        var template = H.compile('foo {{bar}}');

        Assert.areSame(
            "foo 0",
            template({bar: 0})
        );
    },

    '`false` should be considered empty': function () {
        Assert.areSame('', H.render('{{value}}', {value: false}));
    },

    '`null` should be considered empty': function () {
        Assert.areSame('', H.render('{{value}}', {value: null}));
    },

    '`undefined` should be considered empty': function () {
        Assert.areSame('', H.render('{{value}}', {}));
        Assert.areSame('', H.render('{{value}}', {value: undefined}));
    }
}));

// -- Functionality added or overridden by YUI ---------------------------------
suite.add(new Y.Test.Case({
    name: 'YUI Extras',

    _should: {
        error: {
            'malformed template strings should throw an exception': true
        }
    },

    'isEmpty() should be true for `false`': function () {
        Assert.isTrue(H.Utils.isEmpty(false));
    },

    'isEmpty() should be true for `null`': function () {
        Assert.isTrue(H.Utils.isEmpty(null));
    },

    'isEmpty() should be true for `undefined`': function () {
        Assert.isTrue(H.Utils.isEmpty(undefined));
    },

    'isEmpty() should be true for empty arrays': function () {
        Assert.isTrue(H.Utils.isEmpty([]));
    },

    'isEmpty() should be false for non-empty arrays': function () {
        Assert.isFalse(H.Utils.isEmpty(['foo']));
    },

    'isEmpty() should be false for objects and functions': function () {
        Assert.isFalse(H.Utils.isEmpty({}));
        Assert.isFalse(H.Utils.isEmpty(function () {}));
        Assert.isFalse(H.Utils.isEmpty(new Date()));
    },

    'isEmpty() should be false for all numbers': function () {
        Assert.isFalse(H.Utils.isEmpty(0));
        Assert.isFalse(H.Utils.isEmpty(42));
        Assert.isFalse(H.Utils.isEmpty(3.14));
        Assert.isFalse(H.Utils.isEmpty(new Number(0)));
        Assert.isFalse(H.Utils.isEmpty(new Number(42)));
        Assert.isFalse(H.Utils.isEmpty(new Number(3.14)));
    },

    'isEmpty() should be false for all strings': function () {
        // Ignoring this test to match the following change in Handlebars:
        // https://github.com/wycats/handlebars.js/commit/5f56d6
        //
        // Assert.isFalse(H.Utils.isEmpty(''));

        Assert.isFalse(H.Utils.isEmpty('foo'));
        Assert.isFalse(H.Utils.isEmpty(new String('')));
        Assert.isFalse(H.Utils.isEmpty(new String('foo')));
    },

    'render() should compile and render a template string': function () {
        Assert.areSame(
            "Frankly, my dear, I don't give a damn.",

            H.render(
                "Frankly, {{person}}, I don't give a {{mildExpletive}}.",
                {person: 'my dear', mildExpletive: 'damn'}
            )
        );
    },

    'malformed template strings should throw an exception': function () {
        H.render('foo {{bar', {bar: 'bar'});
    }
}));

suite.add(new Y.Test.Case({
    name: 'Escaping',

    'HTML characters should be escaped by default': function () {
        Assert.areSame(
            "&amp;&lt;&gt;&quot;&#x27;&#x60;",
            H.render('{{input}}', {input: "&<>\"'`"})
        );
    },

    'Existing &amp; entities should be double-escaped': function () {
        Assert.areSame(
            "&amp;amp;",
            H.render('{{code}}', {code: '&amp;'})
        );
    },

    'SafeStrings should not be escaped': function () {
        Assert.areSame(
            "&<>\"'`",
            H.render('{{safe}}', {safe: new Y.Handlebars.SafeString("&<>\"'`")})
        );
    }
}));

suite.add(new Y.Test.Case({
    name: 'Scope',

    'this and . should refer to the context object in a with block': function() {
        var data = { test: "test" },
            expectedOutput = "test";

        Assert.areSame(expectedOutput, H.render('{{#with test}}{{this}}{{/with}}', data));
        Assert.areSame(expectedOutput, H.render('{{#with test}}{{.}}{{/with}}', data));
    },

    'this and . should refer to the context object in a with block when used within a call to a helper function': function() {
        var data = { author: { firstName: "Bob", lastName: "McTest" } },
            expectedOutput = "Bob McTest";

        H.registerHelper('formatName', function(person) {
            return person.firstName + " " + person.lastName;
        });
        Assert.areSame(expectedOutput, H.render('{{#with author}}{{formatName this}}{{/with}}', data));
        Assert.areSame(expectedOutput, H.render('{{#with author}}{{formatName .}}{{/with}}', data));
    },

    'Arrays as context objects should be supported': function () {
        var data           = [1, 2, 3],
            expectedOutput = "123";

        Assert.areSame(expectedOutput, H.render('{{#each .}}{{.}}{{/each}}', data));
    },

    'Nested blocks should be rendered correctly with the correct scope': function () {
        var template =
                '{{#with this}}{{#with this}}FOO{{/with}}{{/with}}' +
                '{{#with this}}{{#with this}}BAR{{/with}}{{/with}}';

        // NOTE: As of v1.0.11, a context object must not be empty for the body
        // of a `{{#with}}` statement to be executed.
        // See: https://github.com/wycats/handlebars.js/issues/518
        //
        // Assert.areSame('FOOBAR', H.render(template));
        Assert.areSame('FOOBAR', H.render(template, {}));
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['handlebars', 'test']
});
