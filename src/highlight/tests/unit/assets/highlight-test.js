YUI.add('highlight-test', function (Y) {

var Assert = Y.Assert,
    Hi     = Y.Highlight,

    suite = new Y.Test.Suite('Highlight');

suite.add(new Y.Test.Case({
    name: 'API',

    // -- all() ----------------------------------------------------------------
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

    'all() should not highlight matches inside HTML entities': function () {
        Assert.areSame(
            '&amp;',
            Hi.all('&', 'amp')
        );

        Assert.areSame(
            '&#x2F;<b class="yui3-highlight">m</b>&amp;<b class="yui3-highlight">m</b>&#x2F;',
            Hi.all('/m&m/', ['a', 'm', 'x'])
        );
    },

    'all() should highlight complete HTML entities when part of a match': function () {
        Assert.areSame(
            '<b class="yui3-highlight">&amp;</b>',
            Hi.all('&', '&')
        );

        Assert.areSame(
            'foo <b class="yui3-highlight">&amp;</b> bar',
            Hi.all('foo & bar', '&')
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

    'all() should support a startsWith option': function () {
        Assert.areSame(
            '<b class="yui3-highlight">fo</b>o bar baz',
            Hi.all('foo bar baz', ['fo', 'ba'], {startsWith: true})
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

    // bug #2529945: http://yuilibrary.com/projects/yui3/ticket/2529945
    'all() should not attempt to highlight empty needles': function () {
        Assert.areSame('foo', Hi.all('foo', []));
        Assert.areSame('foo', Hi.all('foo', ['']));
        Assert.areSame('foo', Hi.all('foo', ''));
        Assert.areSame("O&#x27;Neal", Hi.all("O'Neal", ''));
    },

    // -- allCase() ------------------------------------------------------------
    'allCase() should be a shortcut for case-sensitive all()': function () {
        Assert.areSame(
            'f<b class="yui3-highlight">oo</b> BAR <b class="yui3-highlight">ba</b>z',
            Hi.allCase('foo BAR baz', ['oo', 'ba'])
        );
    },

    // -- allFold() ------------------------------------------------------------
    'allFold() should be an accent-folding variant of all()': function () {
        Assert.areSame(
            'föo <b class="yui3-highlight">bár</b> baz',
            Hi.allFold('föo bár baz', ['bar'])
        );

        Assert.areSame(
            'foo <b class="yui3-highlight">bar</b> baz',
            Hi.allFold('foo bar baz', ['bár'])
        );

        Assert.areSame(
            '&lt;foo&gt; <b class="yui3-highlight">bar</b>',
            Hi.allFold('<foo> bar', 'bar')
        );

        Assert.areSame(
            '<b class="yui3-highlight">ds</b>w',
            Hi.allFold('dsw', 'ds')
        );

        Assert.areSame('<b class="yui3-highlight">O&#x27;Neal</b>', Hi.allFold("O'Neal", "O'Neal"));
    },

    // bug #2529945: http://yuilibrary.com/projects/yui3/ticket/2529945
    'allFold() should not attempt to highlight empty needles': function () {
        Assert.areSame('foo', Hi.allFold('foo', []));
        Assert.areSame('foo', Hi.allFold('foo', ['']));
        Assert.areSame('foo', Hi.allFold('foo', ''));
        Assert.areSame("O&#x27;Neal", Hi.allFold("O'Neal", ''));
    },

    // -- start() --------------------------------------------------------------
    'start() should be a shortcut for all() with startsWith option': function () {
        Assert.areSame(
            '<b class="yui3-highlight">fo</b>o bar baz',
            Hi.start('foo bar baz', ['fo', 'ba'])
        );
    },

    // -- startCase() ----------------------------------------------------------
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

    // -- startFold() ----------------------------------------------------------
    'startFold() should be an accent-folding variant of start()': function () {
        Assert.areSame(
            'föo bár baz',
            Hi.startFold('föo bár baz', ['bar'])
        );

        Assert.areSame(
            '<b class="yui3-highlight">föo</b> bár baz',
            Hi.startFold('föo bár baz', ['foo'])
        );

        Assert.areSame(
            '<b class="yui3-highlight">foo</b> bar baz',
            Hi.startFold('foo bar baz', ['föo'])
        );
    },

    // -- words() --------------------------------------------------------------
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

    'words() should not highlight matches inside HTML entities': function () {
        Assert.areSame(
            '&amp;',
            Hi.words('&', 'amp')
        );

        Assert.areSame(
            '&#x2F;<b class="yui3-highlight">m</b>&amp;<b class="yui3-highlight">m</b>&#x2F;',
            Hi.words('/m&m/', ['a', 'm', 'x'])
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

    // bug #2529945: http://yuilibrary.com/projects/yui3/ticket/2529945
    'words() should not attempt to highlight empty needles': function () {
        Assert.areSame('foo bar', Hi.words('foo bar', ''));
        Assert.areSame('foo bar', Hi.words('foo bar', []));
        Assert.areSame('foo bar', Hi.words('foo bar', ['']));
        Assert.areSame("O&#x27;Neal", Hi.words("O'Neal", ''));
    },

    // -- wordsCase() ----------------------------------------------------------
    'wordsCase() should be a shortcut for case-sensitive words()': function () {
        Assert.areSame(
            'foo BAR baz',
            Hi.wordsCase('foo BAR baz', 'bar')
        );

        Assert.areSame(
            'foo <b class="yui3-highlight">BAR</b> baz',
            Hi.wordsCase('foo BAR baz', 'BAR')
        );
    },

    // -- wordsFold() ----------------------------------------------------------
    'wordsFold() should be an accent-folding variant of words()': function () {
        Assert.areSame(
            'föo bár baz',
            Hi.wordsFold('föo bár baz', ['fo', 'ba'])
        );

        Assert.areSame(
            '<b class="yui3-highlight">föo</b> <b class="yui3-highlight">bár</b> baz',
            Hi.wordsFold('föo bár baz', 'foo bar')
        );

        Assert.areSame(
            '<b class="yui3-highlight">föo</b> <b class="yui3-highlight">bár</b> baz',
            Hi.wordsFold('föo bár baz', ['foo', 'bar'])
        );

        Assert.areSame(
            '<b class="yui3-highlight">foo</b> <b class="yui3-highlight">bar</b> baz',
            Hi.wordsFold('foo bar baz', ['föo', 'bár'])
        );

        Assert.areSame(
            '&lt;foo&gt; <b class="yui3-highlight">bar</b>',
            Hi.wordsFold('<foo> bar', 'bar')
        );

        Assert.areSame(
            '<b class="yui3-highlight">O&#x27;Neal</b>',
            Hi.wordsFold("O'Neal", "O'Neal")
        );
    },

    // bug #2529945: http://yuilibrary.com/projects/yui3/ticket/2529945
    'wordsFold() should not attempt to highlight empty needles': function () {
        Assert.areSame('foo bar', Hi.wordsFold('foo bar', ''));
        Assert.areSame('foo bar', Hi.wordsFold('foo bar', []));
        Assert.areSame('foo bar', Hi.wordsFold('foo bar', ['']));
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {requires:['highlight', 'test']});
