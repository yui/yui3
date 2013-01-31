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
    
    'uri() should escape non whitelisted URLs': function () {
        Assert.areSame('http://www.yahoo.com', Escape.uri('http://www.yahoo.com'));
        Assert.areSame('https://www.yahoo.com', Escape.uri('https://www.yahoo.com'));
        Assert.areSame('http://www.yahoo.com', Escape.uri('http://www.yahoo.com'));
        Assert.areSame('/articles/blog.html', Escape.uri('/articles/blog.html'));
        Assert.areSame('//yahoo.com', Escape.uri('//yahoo.com'));
        Assert.areSame('http://javascript:1+1', Escape.uri('javascript:1+1'));
    },
    
    'uri() should coerce non-strings to strings': function () {
        Assert.areSame('http://1', Escape.uri(1));
        Assert.areSame('http://false', Escape.uri(false));
        Assert.areSame('http://null', Escape.uri(null));
        Assert.areSame('http://undefined', Escape.uri());
    },
    
    'js() should escape JS characters': function () {
        Assert.areSame('\u003E\u003C\u0029\u0028\u007D\u007B\u003B\u0022\u0060\u005C\u0072\u005C\u006E\u005C\u0074', Escape.js('><)(}{;"`\r\n\t'));
        Assert.areSame('\u0027\u0027\u0027', Escape.js("'''"));
        Assert.areSame('\u003C\u003C\u003C', Escape.js('<<<'));
        Assert.areSame('\u003E\u003E\u003E', Escape.js('>>>'));
        Assert.areSame('\u0022\u0022\u0022', Escape.js('"""'));
        Assert.areSame('\u0027\u0027\u0027', Escape.js("'''"));
        Assert.areSame('\u002F\u002F\u002F', Escape.js("///"));
        Assert.areSame('\u0060\u0060\u0060', Escape.js('```'));
        Assert.areSame('foo', Escape.js('foo'));
        Assert.areSame('foo \u0026 bar', Escape.js('foo & bar'));
    },
    
        
    'js() should coerce non-strings to strings': function () {
        Assert.areSame('1', Escape.js(1));
        Assert.areSame('false', Escape.js(false));
        Assert.areSame('null', Escape.js(null));
        Assert.areSame('undefined', Escape.js());
    }
}));

}, '@VERSION@', {requires:['escape', 'test']});
