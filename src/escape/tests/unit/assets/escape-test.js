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
    },
    
    'js() should escape JS characters': function () {
        Assert.areSame('\\x26\\x3C\\x3E\\x22\\x27\\x2F\\x60', Escape.js('&<>"\'/`'));
        Assert.areSame('\\x22\\x20onmouseover\\x3Dalert\\x281\\x29', Escape.js('" onmouseover=alert(1)'));
        Assert.areSame('alert', Escape.js('alert'));
        Assert.areSame('34234234', Escape.js('34234234'));
        Assert.areSame('foo', Escape.js('foo'));
        Assert.areSame('\\u0190\\u0122\\u016A\\u019B', Escape.js(String.fromCharCode(400,290,362,411)));
    },
    
    'js() should coerce non-strings to strings': function () {
        Assert.areSame('1', Escape.js(1));
        Assert.areSame('false', Escape.js(false));
        Assert.areSame('null', Escape.js(null));
        Assert.areSame('undefined', Escape.js());
    },
    
    'uri() should escape uri': function () {
        Assert.areSame('/article/show.php', Escape.uri('/article/show.php'));
        Assert.areSame('http://yuilibrary.com', Escape.uri('http://yuilibrary.com'));
        Assert.areSame('https://yuilibrary.com', Escape.uri('https://yuilibrary.com'));
        Assert.areSame('javascript%3Aalert(1)', Escape.uri('javascript:alert(1)'));
        Assert.areSame('data%3Atext%2Fhtml%3B%3Chtml%3E', Escape.uri('data:text/html;<html>'));
        Assert.areSame('%2Farticle%2Fshow.php', Escape.uri('%2Farticle%2Fshow.php'));
        Assert.areSame('//yahoo.com', Escape.uri('//yahoo.com'));
        Assert.areSame('india-yahoo#bookmark', Escape.uri('india-yahoo#bookmark'));
        Assert.areSame('yahoo.php?q=1', Escape.uri('yahoo.php?q=1'));
        Assert.areSame('?param=value', Escape.uri('?param=value'));
        Assert.areSame('#bookmark', Escape.uri('#bookmark'));
        Assert.areSame('HtTp://www.yahoo.com', Escape.uri('HtTp://www.yahoo.com'));
    },
    
    'uri() should coerce non-strings to strings': function () {
        Assert.areSame('1', Escape.uri(1));
        Assert.areSame('false', Escape.uri(false));
        Assert.areSame('null', Escape.uri(null));
        Assert.areSame('undefined', Escape.uri());
    }

}));

}, '@VERSION@', {requires:['escape', 'test']});
