YUI.add('highlight-test', function (Y) {

var Assert = Y.Assert,
    Hi     = Y.Highlight,

    suite = new Y.Test.Suite('Y.Highlight');

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
    },

    'allFold() should not choke when single chars are folded into multiple chars': function () {
        Assert.areSame(
            'encyclo<b class="yui3-highlight">pædia</b> set',
            Hi.allFold('encyclopædia set', ['paedia'])
        );

        Assert.areSame(
            'encyclo<b class="yui3-highlight">paedia</b> set',
            Hi.allFold('encyclopaedia set', ['pædia'])
        );

        Assert.areSame(
            '<b class="yui3-highlight">ae</b><b class="yui3-highlight">ae</b><b class="yui3-highlight">ae</b>bbb<b class="yui3-highlight">ae</b><b class="yui3-highlight">ae</b><b class="yui3-highlight">ae</b>',
            Hi.allFold('aeaeaebbbaeaeae', ['æ'])
        );
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
    },

    'wordsFold() should not choke when single chars are folded into multiple chars': function () {
        Assert.areSame(
            '<b class="yui3-highlight">Encyclopædia</b> <b class="yui3-highlight">Brittænicæ</b>',
            Hi.wordsFold('Encyclopædia Brittænicæ', 'encyclopaedia brittaenicae')
        );

        Assert.areSame(
            '<b class="yui3-highlight">Encyclopaedia</b> <b class="yui3-highlight">Brittaenicae</b>',
            Hi.wordsFold('Encyclopaedia Brittaenicae', 'encyclopædia brittænicæ')
        );
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {requires:['highlight', 'highlight-accentfold', 'test']});
