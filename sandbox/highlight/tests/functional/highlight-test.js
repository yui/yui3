YUI.add('highlight-test', function (Y) {

var Assert = Y.Assert,
    Hi     = Y.Highlight,

    suite = new Y.Test.Suite('Y.Highlight');

suite.add(new Y.Test.Case({
    name: 'Everything',

    // -- all() and friends ----------------------------------------------------
    'all() should highlight all occurrences of needles in haystack': function () {
        // Array of needles.
        Assert.areSame(
            'f<b class="yui3-highlight">oo</b> <b class="yui3-highlight">ba</b>r <b class="yui3-highlight">ba</b>z',
            Hi.all('foo bar baz', ['oo', 'ba'])
        );

        // Single string as needle.
        Assert.areSame(
            'f<b class="yui3-highlight">oo</b> bar baz',
            Hi.all('foo bar baz', 'oo')
        );
    },

    'all() should escape HTML characters': function () {
        Assert.areSame(
            '&lt;f<b class="yui3-highlight">oo</b>&gt; &amp; &lt;<b class="yui3-highlight">ba</b>r&gt;',
            Hi.all('<foo> & <bar>', ['oo', 'ba'])
        );
    },

    'all() should be case-insensitive by default': function () {
        Assert.areSame(
            'f<b class="yui3-highlight">oo</b> <b class="yui3-highlight">BA</b>R <b class="yui3-highlight">ba</b>z',
            Hi.all('foo BAR baz', ['oo', 'ba'])
        );
    },

    'all() should support a caseSensitive option': function () {
        Assert.areSame(
            'f<b class="yui3-highlight">oo</b> BAR <b class="yui3-highlight">ba</b>z',
            Hi.all('foo BAR baz', ['oo', 'ba'], {caseSensitive: true})
        );
    },

    'allCase() should be a shortcut for case-sensitive all()': function () {
        Assert.areSame(
            'f<b class="yui3-highlight">oo</b> BAR <b class="yui3-highlight">ba</b>z',
            Hi.allCase('foo BAR baz', ['oo', 'ba'])
        );
    },

    'all() should support a startsWith option': function () {
        Assert.areSame(
            '<b class="yui3-highlight">fo</b>o bar baz',
            Hi.all('foo bar baz', ['fo', 'ba'], {startsWith: true})
        );
    },

    'start() should be a shortcut for all() with startsWith option': function () {
        Assert.areSame(
            '<b class="yui3-highlight">fo</b>o bar baz',
            Hi.start('foo bar baz', ['fo', 'ba'])
        );
    },

    'all() should support caseSensitive and startsWith together': function () {
        Assert.areSame(
            'FOO bar baz',
            Hi.all('FOO bar baz', ['fo', 'ba'], {caseSensitive: true, startsWith: true})
        );

        Assert.areSame(
            '<b class="yui3-highlight">FO</b>O bar baz',
            Hi.all('FOO bar baz', ['FO', 'ba'], {caseSensitive: true, startsWith: true})
        );
    },

    'startCase() should be a shortcut for caseSensitive + startsWith all()': function () {
        Assert.areSame(
            'FOO bar baz',
            Hi.startCase('FOO bar baz', ['fo', 'ba'])
        );

        Assert.areSame(
            '<b class="yui3-highlight">FO</b>O bar baz',
            Hi.startCase('FOO bar baz', ['FO', 'ba'])
        );
    },

    // -- words() and friends --------------------------------------------------
    'words() should highlight complete words': function () {
        // Array of words.
        Assert.areSame(
            'foo <b class="yui3-highlight">bar</b> baz',
            Hi.words('foo bar baz', ['oo', 'ba', 'bar'])
        );

        // String with single word.
        Assert.areSame(
            'foo <b class="yui3-highlight">bar</b> baz',
            Hi.words('foo bar baz', 'bar')
        );

        // String with multiple words.
        Assert.areSame(
            '<b class="yui3-highlight">foo</b> <b class="yui3-highlight">bar</b> baz',
            Hi.words('foo bar baz', 'bar foo')
        );

        // Repeated word.
        Assert.areSame(
            'foo <b class="yui3-highlight">bar</b> baz <b class="yui3-highlight">bar</b>',
            Hi.words('foo bar baz bar', 'bar')
        );
    },

    'words() should escape HTML characters': function () {
        Assert.areSame(
            '&lt;foo&gt; &amp; &lt;<b class="yui3-highlight">bar</b>&gt;',
            Hi.words('<foo> & <bar>', 'bar')
        );
    },

    'words() should be case-insensitive by default': function () {
        Assert.areSame(
            'foo <b class="yui3-highlight">BAR</b> baz',
            Hi.words('foo BAR baz', 'bar')
        );
    },

    'words() should support a caseSensitive option': function () {
        Assert.areSame(
            'foo BAR baz',
            Hi.words('foo BAR baz', 'bar', {caseSensitive: true})
        );

        Assert.areSame(
            'foo <b class="yui3-highlight">BAR</b> baz',
            Hi.words('foo BAR baz', 'BAR', {caseSensitive: true})
        );
    },

    'wordsCase() should be a shortcut for case-sensitive words()': function () {
        Assert.areSame(
            'foo BAR baz',
            Hi.wordsCase('foo BAR baz', 'bar')
        );

        Assert.areSame(
            'foo <b class="yui3-highlight">BAR</b> baz',
            Hi.wordsCase('foo BAR baz', 'BAR')
        );
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {requires:['highlight', 'test']});
