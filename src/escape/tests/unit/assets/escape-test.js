YUI.add('escape-test', function (Y) {

var Assert = Y.Assert,
    Escape = Y.Escape;

Y.Test.Runner.add(new Y.Test.Case({
    name: 'Escape',

    'html() should escape HTML characters': function () {
        Assert.areSame('&amp;&lt;&gt;&quot;&#x27;&#x2F;&#x60;', Escape.html('&<>"\'/`'));
        Assert.areSame('&amp;&amp;&amp;', Escape.html('&&&'));
        Assert.areSame('&lt;&lt;&lt;', Escape.html('<<<'));
        Assert.areSame('&gt;&gt;&gt;', Escape.html('>>>'));
        Assert.areSame('&quot;&quot;&quot;', Escape.html('"""'));
        Assert.areSame('&#x27;&#x27;&#x27;', Escape.html("'''"));
        Assert.areSame('&#x2F;&#x2F;&#x2F;', Escape.html("///"));
        Assert.areSame('&#x60;&#x60;&#x60;', Escape.html('```'));
        Assert.areSame('foo', Escape.html('foo'));
        Assert.areSame('foo &amp; bar', Escape.html('foo & bar'));
    },

    'html() should coerce non-strings to strings': function () {
        Assert.areSame('1', Escape.html(1));
        Assert.areSame('false', Escape.html(false));
        Assert.areSame('null', Escape.html(null));
        Assert.areSame('undefined', Escape.html());
    },

    'regex() should escape regular expression characters': function () {
        Assert.areSame('\\-#\\$\\^\\*\\(\\)\\+\\[\\]\\{\\}\\|\\\\\\\,\\.\\?\\ \\\t', Escape.regex('-#$^*()+[]{}|\\,.? \t'));
        Assert.areSame('\\*\\*\\*', Escape.regex('***'));
        Assert.areSame('foo', Escape.regex('foo'));
        Assert.areSame('foo\\-bar', Escape.regex('foo-bar'));
    },

    'regex() should coerce non-strings to strings': function () {
        Assert.areSame('1', Escape.regex(1));
        Assert.areSame('false', Escape.regex(false));
        Assert.areSame('null', Escape.regex(null));
        Assert.areSame('undefined', Escape.regex());
    },

    'regexp() should be an alias for regex()': function () {
        Assert.areSame(Escape.regex, Escape.regexp);
    }
}));

}, '@VERSION@', {requires:['escape', 'test']});
