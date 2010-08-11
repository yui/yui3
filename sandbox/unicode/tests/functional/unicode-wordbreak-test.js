YUI.add('unicode-wordbreak-test', function (Y) {

var WB = Y.Unicode.WordBreak;

Y.Test.Runner.add(new Y.Test.Case({
    name: 'Unicode.WordBreak',

    // -- isWordBoundary() -----------------------------------------------------
    'isWordBoundary() should not break between most letters': function () {
        Y.Assert.isFalse(WB.isWordBoundary('aaa', 1));
        Y.Assert.isFalse(WB.isWordBoundary('áåä', 1));
        Y.Assert.isFalse(WB.isWordBoundary('aäa', 1));
    },

    'isWordBoundary() should not break letters across certain punctuation': function () {
        Y.Assert.isFalse(WB.isWordBoundary("can't", 2));
        Y.Assert.isFalse(WB.isWordBoundary("can’t", 2));
        Y.Assert.isFalse(WB.isWordBoundary('foo.bar', 2));
        Y.Assert.isFalse(WB.isWordBoundary('foo:bar', 2));
    },

    'isWordBoundary() should not break across sequences of digits or digits adjacent to letters': function () {
        Y.Assert.isFalse(WB.isWordBoundary('123', 1));
        Y.Assert.isFalse(WB.isWordBoundary('a123', 1));
        Y.Assert.isFalse(WB.isWordBoundary('1a23', 1));
    },

    'isWordBoundary() should not break inside numeric sequences': function () {
        Y.Assert.isFalse(WB.isWordBoundary('3.14', 1));
        Y.Assert.isFalse(WB.isWordBoundary('1,024', 1));
    },

    'isWordBoundary() should ignore format and extend characters': function () {
        Y.Assert.isFalse(WB.isWordBoundary('foo\u00ADbar', 2));
        Y.Assert.isFalse(WB.isWordBoundary('foo\u0300bar', 2));
    },

    'isWordBoundary() should not break inside CRLF': function () {
        Y.Assert.isFalse(WB.isWordBoundary('foo\r\nbar', 3));
    },

    'isWordBoundary() should break before newlines': function () {
        Y.Assert.isTrue(WB.isWordBoundary('foo\rbar', 2));
        Y.Assert.isTrue(WB.isWordBoundary('foo\nbar', 2));
        Y.Assert.isTrue(WB.isWordBoundary('foo\r\nbar', 2));
    },

    'isWordBoundary() should break after newlines': function () {
        Y.Assert.isTrue(WB.isWordBoundary('foo\rbar', 3));
        Y.Assert.isTrue(WB.isWordBoundary('foo\nbar', 3));
        Y.Assert.isTrue(WB.isWordBoundary('foo\r\nbar', 4));
    },

    'isWordBoundary() should break everywhere else': function () {
        Y.Assert.isTrue(WB.isWordBoundary('foo bar', 2));
        Y.Assert.isTrue(WB.isWordBoundary('foo\tbar', 2));
        Y.Assert.isTrue(WB.isWordBoundary('foo&bar', 2));
        Y.Assert.isTrue(WB.isWordBoundary('foo"bar"', 2));
        Y.Assert.isTrue(WB.isWordBoundary('foo(bar)', 2));
        Y.Assert.isTrue(WB.isWordBoundary('foo/bar', 2));
    },

    // -- getWords() -----------------------------------------------------------
    'getWords() should split a string into words': function () {
        // Also tests default exclusion of whitespace.
        Y.ArrayAssert.itemsAreSame(['foo', 'bar', 'baz'], WB.getWords('foo bar baz'));
    },

    'getWords() should preserve case by default': function () {
        Y.ArrayAssert.itemsAreSame(['foo', 'BAR', 'baz'], WB.getWords('foo BAR baz'));
    },

    'getWords() should support an ignoreCase option': function () {
        Y.ArrayAssert.itemsAreSame(['foo', 'bar'], WB.getWords('Foo Bar', {ignoreCase: true}));
    },

    'getWords() should exclude punctuation-only words by default': function () {
        Y.ArrayAssert.itemsAreSame(
            ['Tut', 'tut', 'it', 'looks', 'like', 'rain'],
            WB.getWords('Tut-tut, it looks like rain.')
        );
    },

    'getWords() should support an includePunctuation option': function () {
        Y.ArrayAssert.itemsAreSame(
            ['Tut', '-', 'tut', ',', 'it', 'looks', 'like', 'rain', '.'],
            WB.getWords('Tut-tut, it looks like rain.', {includePunctuation: true})
        );
    },

    'getWords() should support an includeWhitespace option': function () {
        Y.ArrayAssert.itemsAreSame(
            ['foo', ' ', 'bar', ' ', 'baz'],
            WB.getWords('foo bar baz', {includeWhitespace: true})
        );

        Y.ArrayAssert.itemsAreSame(
            ['foo', ' ', ' ', 'bar'],
            WB.getWords('foo  bar', {includeWhitespace: true})
        );

        Y.ArrayAssert.itemsAreSame(
            ['foo', '\t', 'bar'],
            WB.getWords('foo\tbar', {includeWhitespace: true})
        );

        Y.ArrayAssert.itemsAreSame(
            ['foo', '\n', 'bar'],
            WB.getWords('foo\nbar', {includeWhitespace: true})
        );
    },

    // -- getUniqueWords() -----------------------------------------------------
    'getUniqueWords() should only return unique words': function () {
        Y.ArrayAssert.itemsAreSame(['hungry', 'hippo'], WB.getUniqueWords('hungry hungry hippo'));
    }
}));

}, '@VERSION@', {requires:['unicode-wordbreak', 'test']});
