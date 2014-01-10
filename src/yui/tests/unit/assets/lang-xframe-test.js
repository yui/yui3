YUI.add('lang-xframe-test', function (Y) {

var Assert = Y.Assert,
    Lang   = Y.Lang,

    suite = new Y.Test.Suite('YUI: Lang - CrossFrame');

suite.add(new Y.Test.Case({

    name: 'Lang Cross Frame Tests',

    "async:init": function() {

        var startTests = this.callback();

        YUI.Env._StartFrameTests = function() {
            startTests();
        };

        Y.one('body').append('<iframe name="xframe" id="xframe" src="assets/xframe.html" style="visibility: hidden;"></iframe>');
    },

    test_is_array_xframe: function() {
        Assert.isTrue(Lang.isArray(xframe.arr), "Cross frame array failure");
        Assert.isFalse(Lang.isArray(xframe.far), "Cross frame fake array failure");
        Assert.isFalse(Lang.isArray(xframe.obj), "Cross frame object failure");
        Assert.isFalse(Lang.isArray(xframe.fun), "Cross frame function failure");
        Assert.isFalse(Lang.isArray(xframe.boo), "Cross frame boolean failure");
        Assert.isFalse(Lang.isArray(xframe.str), "Cross frame string failure");
        Assert.isFalse(Lang.isArray(xframe.nul), "Cross frame null failure");
        Assert.isFalse(Lang.isArray(xframe.und), "Cross frame undefined failure");

    },

    test_is_function_xframe: function() {
        Assert.isTrue(Lang.isFunction(xframe.fun), "Cross frame function failure");
        Assert.isFalse(Lang.isFunction(xframe.arr), "Cross frame array failure");
        Assert.isFalse(Lang.isFunction(xframe.obj), "Cross frame object failure");
        Assert.isFalse(Lang.isFunction(xframe.boo), "Cross frame boolean failure");
        Assert.isFalse(Lang.isFunction(xframe.str), "Cross frame string failure");
        Assert.isFalse(Lang.isFunction(xframe.nul), "Cross frame null failure");
        Assert.isFalse(Lang.isFunction(xframe.und), "Cross frame undefined failure");
    },

    test_is_object_xframe: function() {
        Assert.isTrue(Lang.isObject(xframe.obj), "Cross frame object failure");
        Assert.isTrue(Lang.isObject(xframe.fun), "Cross frame function failure");
        Assert.isTrue(Lang.isObject(xframe.arr), "Cross frame array failure");
        Assert.isFalse(Lang.isObject(xframe.boo), "Cross frame boolean failure");
        Assert.isFalse(Lang.isObject(xframe.str), "Cross frame string failure");
        Assert.isFalse(Lang.isObject(xframe.nul), "Cross frame null failure");
        Assert.isFalse(Lang.isObject(xframe.und), "Cross frame undefined failure");
    },

    test_is_date_xframe: function() {
        Assert.isFalse(Lang.isDate(xframe.fun), "Cross frame function should be false");
        Assert.isTrue(Lang.isDate(xframe.dat), "Cross frame date should be true");
    },

    test_is_regexp_xframe: function() {
        Assert.isTrue(Lang.isRegExp(xframe.re), "Cross frame regexp is a regexp");
        Assert.isTrue(Lang.isRegExp(xframe.nre), "Cross frame  new RegExp is a regexp");
        Assert.isFalse(Lang.isRegExp(xframe.obj), "Cross frame  object is not a regexp");
        Assert.isFalse(Lang.isRegExp(xframe.arr), "Cross frame  array is not a regexp");
        Assert.isFalse(Lang.isRegExp(xframe.fun), "Cross frame  function is not a regexp");
        Assert.isFalse(Lang.isRegExp(xframe.nul), "Cross frame null is not a regexp");
        Assert.isFalse(Lang.isRegExp(xframe.und), "Cross frame undefined is not a regexp");
        Assert.isFalse(Lang.isRegExp(xframe.num), "Cross frame  number is not a regexp");
    },
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {requires: ['test']});
