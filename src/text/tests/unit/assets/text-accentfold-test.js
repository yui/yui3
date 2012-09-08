YUI.add('text-accentfold-test', function (Y) {

var AccentFold = Y.Text.AccentFold;

Y.Test.Runner.add(new Y.Test.Case({
    name: 'Text.AccentFold',

    // -- canFold() -------------------------------------------------------
    'canFold() should return true if any characters can be folded': function () {
        Y.Assert.isTrue(AccentFold.canFold('aåa'));
        Y.Assert.isTrue(AccentFold.canFold('AÅA'));
    },

    'canFold() should return false when no characters can be folded': function () {
        Y.Assert.isFalse(AccentFold.canFold('aaa'));
        Y.Assert.isFalse(AccentFold.canFold('AAA'));
    },

    // -- compare() ------------------------------------------------------------
    'compare() should return true when folded strings match': function () {
        Y.Assert.isTrue(AccentFold.compare('aaa', 'aåa'));
        Y.Assert.isTrue(AccentFold.compare('aaa', 'AÅA'));
        Y.Assert.isTrue(AccentFold.compare('AAA', 'aåa'));
    },

    "compare() should return false when folded strings don't match": function () {
        Y.Assert.isFalse(AccentFold.compare('aaa', 'abc'));
    },

    'compare() should support a custom comparison function': function () {
        Y.Assert.isTrue(AccentFold.compare('aåa', 'åaë', function (a, b) {
            Y.Assert.areSame('aaa', a);
            Y.Assert.areSame('aae', b);
            return true;
        }));
    },

    // -- filter() -------------------------------------------------------------
    'filter() should pass accent-folded items to the supplied function': function () {
        var items = [];

        AccentFold.filter(['aáa', 'eée'], function (item) {
            items.push(item);
        });

        Y.ArrayAssert.itemsAreSame(['aaa', 'eee'], items);
    },

    'filter() should filter the supplied array': function () {
        Y.ArrayAssert.itemsAreSame(['eée'], AccentFold.filter(['aáa', 'eée'], function (item) {
            return item === 'eee';
        }));
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

}, '@VERSION@', {requires:['text-accentfold', 'test']});
