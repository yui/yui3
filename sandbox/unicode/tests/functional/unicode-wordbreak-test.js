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
        Y.ArrayAssert.itemsAreSame(['foo', 'bar', 'baz'], WB.getWords('foo bar baz'));
        Y.ArrayAssert.itemsAreSame(
            ["hey", ",", "ryan", ",", "be", "careful", "what", "you", "shoot", "at", ".", "most", "things", "in", "here", "don't", "react", "too", "well", "to", "bullets", "."],
            WB.getWords("Hey, Ryan, be careful what you shoot at. Most things in here don't react too well to bullets.")
        );
    },

    'getWords() should support a preserveCase option': function () {
        Y.ArrayAssert.itemsAreSame(['Foo', 'Bar'], WB.getWords('Foo Bar', {preserveCase: true}));
    },

    // -- getUniqueWords() -----------------------------------------------------
    'getUniqueWords() should only return unique words': function () {
        Y.ArrayAssert.itemsAreSame(['hungry', 'hippo'], WB.getUniqueWords('hungry hungry hippo'));
    }
}));

}, '@VERSION@', {requires:['unicode-wordbreak', 'test']});
