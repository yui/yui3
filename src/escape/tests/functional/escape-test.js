YUI.add('escape-test', function (Y) {

var Escape = Y.Escape;

Y.Test.Runner.add(new Y.Test.Case({
    name: 'Escape',

    'html() should escape HTML characters': function () {
        Y.Assert.areSame('&amp;&lt;&gt;&quot;&#x27;&#x2F;&#x60;', Escape.html('&<>"\'/`'));
        Y.Assert.areSame('&amp;&amp;&amp;', Escape.html('&&&'));
        Y.Assert.areSame('&lt;&lt;&lt;', Escape.html('<<<'));
        Y.Assert.areSame('&gt;&gt;&gt;', Escape.html('>>>'));
        Y.Assert.areSame('&quot;&quot;&quot;', Escape.html('"""'));
        Y.Assert.areSame('&#x27;&#x27;&#x27;', Escape.html("'''"));
        Y.Assert.areSame('&#x2F;&#x2F;&#x2F;', Escape.html("///"));
        Y.Assert.areSame('&#x60;&#x60;&#x60;', Escape.html('```'));
        Y.Assert.areSame('foo', Escape.html('foo'));
        Y.Assert.areSame('foo &amp; bar', Escape.html('foo & bar'));
    },

    'regex() should escape regular expression characters': function () {
        Y.Assert.areSame('\\-\\#\\$\\^\\*\\(\\)\\+\\[\\]\\{\\}\\|\\\\\\\,\\.\\?\\ \\\t', Escape.regex('-#$^*()+[]{}|\\,.? \t'));
        Y.Assert.areSame('\\*\\*\\*', Escape.regex('***'));
        Y.Assert.areSame('foo', Escape.regex('foo'));
        Y.Assert.areSame('foo\\-bar', Escape.regex('foo-bar'));
    },

    'regexp() should be an alias for regex()': function () {
        Y.Assert.areSame(Escape.regex, Escape.regexp);
    }
}));

}, '@VERSION@', {requires:['escape', 'test']});
