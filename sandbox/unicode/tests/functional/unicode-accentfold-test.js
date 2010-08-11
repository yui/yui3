YUI.add('unicode-accentfold-test', function (Y) {

var AccentFold = Y.Unicode.AccentFold;

Y.Test.Runner.add(new Y.Test.Case({
    name: 'Unicode.AccentFold',

    // -- canFold() -------------------------------------------------------
    'canFold() should return true if any characters can be folded': function () {
        Y.Assert.isTrue(AccentFold.canFold('aåa'));
    },

    'canFold() should return false when no characters can be folded': function () {
        Y.Assert.isFalse(AccentFold.canFold('aaa'));
    },

    // -- fold() ---------------------------------------------------------------
    'fold() should fold lowercase accented letters to ASCII': function () {
        Y.Assert.areSame('aaaaaaaaaaaaaaaaaaaaaaaaaa', AccentFold.fold('àåāăąǎǟǡǻȁȃȧḁẚạảấầẩẫậắằẳẵặ'));
        Y.Assert.areSame('zzzzzz', AccentFold.fold('źżžẑẓẕ'));
        Y.Assert.areSame('abcd', AccentFold.fold('abcd'));
    },

    'fold() should fold uppercase accented letters to lowercase ASCII': function () {
        Y.Assert.areSame('aaaaaaaaaaaaaaaaaaaaaaaa', AccentFold.fold('ÀÅĀĂĄǍǞǠǺȀȂḀẠẢẤẦẨẪẬẮẰẲẴẶ'));
        Y.Assert.areSame('zzzzzz', AccentFold.fold('ŹŻŽẐẒẔ'));
        Y.Assert.areSame('abcd', AccentFold.fold('ABCD'));
    }
}));

}, '@VERSION@', {requires:['unicode-accentfold', 'test']});
