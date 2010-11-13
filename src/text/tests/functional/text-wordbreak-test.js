YUI.add('text-wordbreak-test', function (Y) {

var Assert      = Y.Assert,
    ArrayAssert = Y.ArrayAssert,
    WB          = Y.Text.WordBreak;

Y.Test.Runner.add(new Y.Test.Case({
    name: 'Text.WordBreak',

    // -- isWordBoundary() -----------------------------------------------------
    'isWordBoundary() should not break between most letters': function () {
        Assert.isFalse(WB.isWordBoundary('aaa', 1));
        Assert.isFalse(WB.isWordBoundary('áåä', 1));
        Assert.isFalse(WB.isWordBoundary('aäa', 1));
    },

    'isWordBoundary() should not break letters across certain punctuation': function () {
        Assert.isFalse(WB.isWordBoundary("can't", 2));
        Assert.isFalse(WB.isWordBoundary("can’t", 2));
        Assert.isFalse(WB.isWordBoundary('foo.bar', 2));
        Assert.isFalse(WB.isWordBoundary('foo:bar', 2));
    },

    'isWordBoundary() should not break across sequences of digits or digits adjacent to letters': function () {
        Assert.isFalse(WB.isWordBoundary('123', 1));
        Assert.isFalse(WB.isWordBoundary('a123', 1));
        Assert.isFalse(WB.isWordBoundary('1a23', 1));
    },

    'isWordBoundary() should not break inside numeric sequences': function () {
        Assert.isFalse(WB.isWordBoundary('3.14', 1));
        Assert.isFalse(WB.isWordBoundary('1,024', 1));
    },

    'isWordBoundary() should ignore format and extend characters': function () {
        Assert.isFalse(WB.isWordBoundary('foo\u00ADbar', 2));
        Assert.isFalse(WB.isWordBoundary('foo\u0300bar', 2));
    },

    'isWordBoundary() should not break inside CRLF': function () {
        Assert.isFalse(WB.isWordBoundary('foo\r\nbar', 3));
    },

    'isWordBoundary() should break before newlines': function () {
        Assert.isTrue(WB.isWordBoundary('foo\rbar', 2));
        Assert.isTrue(WB.isWordBoundary('foo\nbar', 2));
        Assert.isTrue(WB.isWordBoundary('foo\r\nbar', 2));
    },

    'isWordBoundary() should break after newlines': function () {
        Assert.isTrue(WB.isWordBoundary('foo\rbar', 3));
        Assert.isTrue(WB.isWordBoundary('foo\nbar', 3));
        Assert.isTrue(WB.isWordBoundary('foo\r\nbar', 4));
    },

    'isWordBoundary() should not break between Katakana characters': function () {
        Assert.isFalse(WB.isWordBoundary('パイ', 0));
    },

    'isWordBoundary() should not break from extenders': function () {
        Assert.isFalse(WB.isWordBoundary('foo_bar', 2));
        Assert.isFalse(WB.isWordBoundary('__', 0));
    },

    'isWordBoundary() should break everywhere else': function () {
        Assert.isTrue(WB.isWordBoundary('foo bar', 2));
        Assert.isTrue(WB.isWordBoundary('foo\tbar', 2));
        Assert.isTrue(WB.isWordBoundary('foo&bar', 2));
        Assert.isTrue(WB.isWordBoundary('foo"bar"', 2));
        Assert.isTrue(WB.isWordBoundary('foo(bar)', 2));
        Assert.isTrue(WB.isWordBoundary('foo/bar', 2));
    },

    'isWordBoundary() should return false when given an out-of-bounds index': function () {
        Assert.isFalse(WB.isWordBoundary('', 5));
        Assert.isFalse(WB.isWordBoundary('', -1));
    },

    'isWordBoundary() should return true for index 0 of an empty string': function () {
        Assert.isTrue(WB.isWordBoundary('', 0));
    },

    // -- getWords() -----------------------------------------------------------
    'getWords() should split a string into words': function () {
        // Also tests default exclusion of whitespace.
        ArrayAssert.itemsAreSame(['foo', 'bar', 'baz'], WB.getWords('foo bar baz'));
        ArrayAssert.itemsAreSame(['パイ', 'が', '良', 'い', 'で', 'す'], WB.getWords('パイが良いです'));
    },

    'getWords() should preserve case by default': function () {
        ArrayAssert.itemsAreSame(['foo', 'BAR', 'baz'], WB.getWords('foo BAR baz'));
    },

    'getWords() should support an ignoreCase option': function () {
        ArrayAssert.itemsAreSame(['foo', 'bar'], WB.getWords('Foo Bar', {ignoreCase: true}));
    },

    'getWords() should exclude punctuation-only words by default': function () {
        ArrayAssert.itemsAreSame(
            ['Tut', 'tut', 'it', 'looks', 'like', 'rain'],
            WB.getWords('Tut-tut, it looks like rain.')
        );
    },

    'getWords() should support an includePunctuation option': function () {
        ArrayAssert.itemsAreSame(
            ['Tut', '-', 'tut', ',', 'it', 'looks', 'like', 'rain', '.'],
            WB.getWords('Tut-tut, it looks like rain.', {includePunctuation: true})
        );
    },

    'getWords() should support an includeWhitespace option': function () {
        ArrayAssert.itemsAreSame(
            ['foo', ' ', 'bar', ' ', 'baz'],
            WB.getWords('foo bar baz', {includeWhitespace: true})
        );

        ArrayAssert.itemsAreSame(
            ['foo', ' ', ' ', 'bar'],
            WB.getWords('foo  bar', {includeWhitespace: true})
        );

        ArrayAssert.itemsAreSame(
            ['foo', '\t', 'bar'],
            WB.getWords('foo\tbar', {includeWhitespace: true})
        );

        ArrayAssert.itemsAreSame(
            ['foo', '\n', 'bar'],
            WB.getWords('foo\nbar', {includeWhitespace: true})
        );
    },

    // -- getUniqueWords() -----------------------------------------------------
    'getUniqueWords() should only return unique words': function () {
        ArrayAssert.itemsAreSame(['hungry', 'hippo'], WB.getUniqueWords('hungry hungry hippo'));
    }
}));

}, '@VERSION@', {requires:['text-wordbreak', 'test']});
