YUI.add('lang-test', function (Y) {

var Assert = Y.Assert,
    Lang   = Y.Lang,

    doc = Y.config.doc,

    suite = new Y.Test.Suite('Y.Lang');

suite.add(new Y.Test.Case({
    name: 'Lang tests',

    '_isNative() should return true for native functions': function () {
        Assert.isTrue(Lang._isNative(Object.prototype.toString), 'Object.prototype.toString is native');
        Assert.isTrue(Lang._isNative(Array.prototype.concat), 'Array.prototype.concat is native');
        Assert.isTrue(Lang._isNative(String.prototype.replace), 'String.prototype.replace is native');

        if (doc) { // may not exist in Node.js
            Assert.isTrue(Lang._isNative(doc.getElementById), 'document.getElementById is native');
            Assert.isTrue(Lang._isNative(doc.getElementsByTagName('body')[0].cloneNode), 'DOM cloneNode() is native');
        }
    },

    '_isNative() should return false for non-native functions': function () {
        Assert.isFalse(Lang._isNative(Lang._isNative), 'Lang._isNative is not native');
        Assert.isFalse(Lang._isNative(YUI), 'YUI is not native');
        Assert.isFalse(Lang._isNative(function () {}, 'An anonymous function is not native'));
        Assert.isFalse(Lang._isNative(function () { '[native code]' }, 'Tricky non-native function is not native'));
        Assert.isFalse(Lang._isNative(function () { return '[native code]'; }, 'Anothre tricky non-native function is not native'));
    },

    test_is_array: function() {
        Assert.isTrue(Lang.isArray([1, 2]), "Array literals are arrays");
        Assert.isFalse(Lang.isArray({"one": "two"}), "Object literals are not arrays");

        var a = [];
        a["one"] = "two";
        Assert.isTrue(Lang.isArray(a), "'Associative' arrays are arrays");

        Assert.isFalse(Lang.isArray(document.getElementsByTagName("body")),
                "Element collections are array-like, but not arrays");

        Assert.isFalse(Lang.isArray(null), "null is not an array");
        Assert.isFalse(Lang.isArray(''), "'' is not an array");
        Assert.isFalse(Lang.isArray(undefined), "undefined is not an array");

        Assert.isTrue(Lang.isArray(xframe.arr), "Cross frame array failure");
        Assert.isFalse(Lang.isArray(xframe.far), "Cross frame fake array failure");
        Assert.isFalse(Lang.isArray(xframe.obj), "Cross frame object failure");
        Assert.isFalse(Lang.isArray(xframe.fun), "Cross frame function failure");
        Assert.isFalse(Lang.isArray(xframe.boo), "Cross frame boolean failure");
        Assert.isFalse(Lang.isArray(xframe.str), "Cross frame string failure");
        Assert.isFalse(Lang.isArray(xframe.nul), "Cross frame null failure");
        Assert.isFalse(Lang.isArray(xframe.und), "Cross frame undefined failure");

        if (Array.isArray) {
            Assert.areSame(Array.isArray, Lang.isArray, 'Lang.isArray() should use native Array.isArray() when available');
        }
    },

    test_is_boolean: function() {
        Assert.isTrue(Lang.isBoolean(false), "false failed boolean check");
        Assert.isFalse(Lang.isBoolean(1), "the number 1 is not a boolean");
        Assert.isFalse(Lang.isBoolean("true"), "the string 'true' is not a boolean");
    },

    test_is_function: function() {
        Assert.isTrue(Lang.isFunction(function(){}), "a function is a function");
        Assert.isFalse(Lang.isFunction({foo: "bar"}), "an object is not a function");

        Assert.isTrue(Lang.isFunction(xframe.fun), "Cross frame function failure");
        Assert.isFalse(Lang.isFunction(xframe.arr), "Cross frame array failure");
        Assert.isFalse(Lang.isFunction(xframe.obj), "Cross frame object failure");
        Assert.isFalse(Lang.isFunction(xframe.boo), "Cross frame boolean failure");
        Assert.isFalse(Lang.isFunction(xframe.str), "Cross frame string failure");
        Assert.isFalse(Lang.isFunction(xframe.nul), "Cross frame null failure");
        Assert.isFalse(Lang.isFunction(xframe.und), "Cross frame undefined failure");
    },

    test_is_null: function() {
        Assert.isTrue(Lang.isNull(null), "null is null");
        Assert.isFalse(Lang.isNull(undefined), "undefined is not null");
        Assert.isFalse(Lang.isNull(""), "empty string is not null");
    },

    test_is_number: function() {
        Assert.isTrue(Lang.isNumber(0), "0 is a number");
        Assert.isTrue(Lang.isNumber(123.123), "123.123 is a number");
        Assert.isFalse(Lang.isNumber('123.123'), "the string '123.123' is not a number, even though it can be cast into one");
        Assert.isFalse(Lang.isNumber(1/0), "undefined numbers and infinity are not numbers we want to use");
    },

    test_is_object: function() {
        Assert.isTrue(Lang.isObject({}), "an object is an object");
        Assert.isTrue(Lang.isObject(function(){}), "a function is an object");
        Assert.isTrue(Lang.isObject([]), "an array is an object");
        Assert.isFalse(Lang.isObject(1), "numbers are not objects");
        Assert.isFalse(Lang.isObject(true), "boolean values are not objects");
        Assert.isFalse(Lang.isObject("{}"), "strings are not objects");
        Assert.isFalse(Lang.isObject(null), "null should return false even though it technically is an object");

        Assert.isTrue(Lang.isObject(xframe.obj), "Cross frame object failure");
        Assert.isTrue(Lang.isObject(xframe.fun), "Cross frame function failure");
        Assert.isTrue(Lang.isObject(xframe.arr), "Cross frame array failure");
        Assert.isFalse(Lang.isObject(xframe.boo), "Cross frame boolean failure");
        Assert.isFalse(Lang.isObject(xframe.str), "Cross frame string failure");
        Assert.isFalse(Lang.isObject(xframe.nul), "Cross frame null failure");
        Assert.isFalse(Lang.isObject(xframe.und), "Cross frame undefined failure");
    },

    test_is_string: function() {
        Assert.isTrue(Lang.isString("{}"), "a string is a string");
        Assert.isFalse(Lang.isString({foo: "bar"}), "an object is not a string");
        Assert.isFalse(Lang.isString(123), "a number is not a string");
        Assert.isFalse(Lang.isString(true), "boolean values are not strings");
    },

    test_is_undefined: function() {
        Assert.isTrue(Lang.isUndefined(undefined), "undefined is undefined");
        Assert.isFalse(Lang.isUndefined(false), "boolean false is not undefined");
        Assert.isFalse(Lang.isUndefined(null), "null is not undefined");
    },

    test_trim: function() {
        Assert.areEqual(Lang.trim("  My String"), "My String");
        Assert.areEqual(Lang.trim("My String  "), "My String");
        Assert.areEqual(Lang.trim("  My String  "), "My String");
        Assert.areEqual(Lang.trim(null), null);
        Assert.areEqual(Lang.trim(undefined), undefined);
        Assert.areEqual(Lang.trim({}), "[object Object]");
    },

    test_trim_left: function() {
        Assert.areEqual(Lang.trimLeft("  My String"), "My String");
        Assert.areEqual(Lang.trimLeft("My String  "), "My String  ");
        Assert.areEqual(Lang.trimLeft("  My String  "), "My String  ");
    },

    test_trim_right: function() {
        Assert.areEqual(Lang.trimRight("  My String"), "  My String");
        Assert.areEqual(Lang.trimRight("My String  "), "My String");
        Assert.areEqual(Lang.trimRight("  My String  "), "  My String");
    },

    test_is_value: function() {
        Assert.isFalse(Lang.isValue(null), "null should be false");
        Assert.isFalse(Lang.isValue(undefined), "undefined should be false");
        Assert.isFalse(Lang.isValue(parseInt("adsf", 10)), "NaN should be false");
        Assert.isFalse(Lang.isValue(1/0), "undefined numbers and infinity should be false");
        Assert.isTrue(Lang.isValue(new Date()), "date should be true");
        Assert.isTrue(Lang.isValue(""), "Empty string should be true");
        Assert.isTrue(Lang.isValue(false), "false should be true");
    },

    test_is_date: function() {
        Assert.isFalse(Lang.isDate(null), "null should be false");
        Assert.isFalse(Lang.isDate(undefined), "undefined should be false");
        Assert.isFalse(Lang.isDate(parseInt("adsf", 10)), "NaN should be false");
        Assert.isFalse(Lang.isDate(1/0), "undefined numbers and infinity should be false");
        Assert.isFalse(Lang.isDate(NaN), "NaN should be false");
        Assert.isTrue(Lang.isDate(new Date()), "date should be true");
        Assert.isFalse(Lang.isDate(""), "Empty string should be false");
        Assert.isFalse(Lang.isDate(false), "false should be false");
        Assert.isFalse(Lang.isDate(xframe.fun), "Cross frame function should be false");
        Assert.isTrue(Lang.isDate(xframe.dat), "Cross frame date should be true");

        var badDateObj = new Date('junk');
        Assert.isFalse(Lang.isDate(badDateObj), "A date object containing and invalid date should be false.");
    },

    test_now: function () {
        Assert.isNumber(Lang.now(), 'Lang.now() should return the current time in milliseconds');

        if (Date.now) {
            Assert.areSame(Date.now, Lang.now, 'Lang.now() should be native Date.now() when available');
        }
    },

    test_sub: function () {
        Assert.areSame(
            'foo foo bar bar {baz} false 0',
            Lang.sub('foo {foo} bar {bar} {baz} {moo} {zoo}', {foo: 'foo', bar: 'bar', moo: false, zoo: 0}),
            'should replace placeholders'
        );

        Assert.areSame(
            'foo foo bar {bar}',
            Lang.sub('foo { foo } bar {bar}', {foo: 'foo'}),
            'whitespace inside a placeholder is ignored'
        );

        Assert.areSame(
            'foo foo bar {bar}',
            Lang.sub('foo {foo|moo} bar {bar}', {foo: 'foo'}),
            'anything after a pipe inside a placeholder is ignored'
        );
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {requires: ['test']});
