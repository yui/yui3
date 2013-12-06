
/**
 * Provides functions to test JavaScript strings for a variety of cases.
 *
 * @namespace Test
 * @module test
 * @class StringAssert
 * @static
 */
YUITest.StringAssert = {

    /**
     * Asserts that a string is empty.
     *
     * If `excl_whitespace` is set to true the string will be trimmed first, which will
     * pass the test if the string only contains whitespaces.
     *
     * @example
     *      Y.StringAssert.isEmpty("");                // pass
     *      Y.StringAssert.isEmpty(" \r\n \t ", true); // pass
     *      Y.StringAssert.isEmpty("hello world");     // fail
     *      Y.StringAssert.isEmpty(" \r\n \t ");       // fail
     *
     * @param {String} str The string to test.
     * @param {Boolean} [excl_whitespace=false] If true the string will be trimmed first.
     * @param {String} [message] The message to display if the assertion fails.
     * @method isEmpty
     * @static
     */
    isEmpty: function (str, excl_whitespace, message) {

        Y.Assert._increment();

        excl_whitespace = (Y.Lang.isBoolean(excl_whitespace) && excl_whitespace);

        if (!Y.Lang.isString(str)) {
            throw new TypeError("StringAssert.isEmpty(): str is not a string");
        }

        if (excl_whitespace) {
            str = Y.Lang.trim(str);
        }

        if (str.length) {
            message = Y.Assert._formatMessage(message, "String is not empty");
            Y.fail(message);
        }
    },

    /**
     * Asserts that a string is not empty.
     *
     * If `excl_whitespace` is set to true the string will be trimmed first, which will
     * fail the test if the string only contains whitespaces.
     *
     * @example
     *      Y.StringAssert.isNotEmpty("hello world");     // pass
     *      Y.StringAssert.isNotEmpty(" \r\n \t ");       // pass
     *      Y.StringAssert.isNotEmpty("");                // fail
     *      Y.StringAssert.isNotEmpty(" \r\n \t ", true); // fail
     *
     * @param {String} str The string to test.
     * @param {Boolean} [excl_whitespace=false] If true the string will be trimmed first.
     * @param {String} [message] The message to display if the assertion fails.
     * @method isNotEmpty
     * @static
     */
    isNotEmpty: function (str, excl_whitespace, message) {

        Y.Assert._increment();

        excl_whitespace = (Y.Lang.isBoolean(excl_whitespace) && excl_whitespace);

        if (!Y.Lang.isString(str)) {
            throw new TypeError("StringAssert.isNotEmpty(): str is not a string");
        }

        if (excl_whitespace) {
            str = Y.Lang.trim(str);
        }

        if (!str.length) {
            message = Y.Assert._formatMessage(message, "String is empty");
            Y.fail(message);
        }
    },

    /**
     * Asserts that a string has no leading and/or trailing whitespaces.
     *
     * @example
     *      Y.StringAssert.isTrimmed("abc");     // pass
     *      Y.StringAssert.isTrimmed("\r\nabc"); // fail
     *      Y.StringAssert.isTrimmed("abc\r\n"); // fail
     *      Y.StringAssert.isTrimmed("\tabc\t"); // fail
     *
     * @param {String} str The string to test.
     * @param {String} [message] The message to display if the assertion fails.
     * @method isTrimmed
     * @static
     */
    isTrimmed: function (str, message) {

        Y.Assert._increment();

        if (!Y.Lang.isString(str)) {
            throw new TypeError("StringAssert.isTrimmed(): str is not a string");
        }

        if (Y.Lang.trim(str).length != str.length) {
            message = Y.Assert._formatMessage(message, "String is not trimmed");
            Y.fail(message);
        }
    },

    /**
     * Asserts that a string contains another string.
     *
     * @example
     *      Y.StringAssert.contains("bbb", "aaa bbb ccc"); // pass
     *      Y.StringAssert.contains("aaa", "aaa bbb ccc"); // pass
     *      Y.StringAssert.contains("ccc", "aaa bbb ccc"); // pass
     *      Y.StringAssert.contains("aaa", "aaa");         // pass
     *      Y.StringAssert.contains("zzz", "aaa bbb ccc"); // fail
     *
     * @param {String} needle The string to look for.
     * @param {String} haystack The string to test.
     * @param {String} [message] The message to display if the assertion fails.
     * @method contains
     * @static
     */
    contains: function (needle, haystack, message) {

        Y.Assert._increment();

        if (!Y.Lang.isString(needle)) {
            throw new TypeError('StringAssert.contains(): needle is not a string');
        }

        if (!Y.Lang.isString(haystack)) {
            throw new TypeError('StringAssert.contains(): haystack is not a string');
        }

        if (haystack.indexOf(needle) < 0) {
            message = Y.Assert._formatMessage(message, "'"+haystack+"' does not contain '"+needle+"'");
            Y.fail(message);
        }
    },

    /**
     * Asserts that a string does not contain another string.
     *
     * @example
     *      Y.StringAssert.doesNotContain("zzz", "aaa bbb ccc"); // pass
     *      Y.StringAssert.doesNotContain("bbb", "aaa bbb ccc"); // fail
     *      Y.StringAssert.doesNotContain("aaa", "aaa bbb ccc"); // fail
     *      Y.StringAssert.doesNotContain("ccc", "aaa bbb ccc"); // fail
     *      Y.StringAssert.doesNotContain("aaa", "aaa");         // fail
     *
     * @param {String} needle The string to look for.
     * @param {String} haystack The string to test.
     * @param {String} [message] The message to display if the assertion fails.
     * @method doesNotContain
     * @static
     */
    doesNotContain: function (needle, haystack, message) {

        Y.Assert._increment();

        if (!Y.Lang.isString(needle)) {
            throw new TypeError('StringAssert.doesNotContain(): needle is not a string');
        }

        if (!Y.Lang.isString(haystack)) {
            throw new TypeError('StringAssert.doesNotContain(): haystack is not a string');
        }

        if (haystack.indexOf(needle) >= 0) {
            message = Y.Assert._formatMessage(message, "'"+haystack+"' contains '"+needle+"'");
            Y.fail(message);
        }
    },

    /**
     * Asserts that a string does match a regular expression.
     *
     * @example
     *      Y.StringAssert.matches(/^[0-9]+$/, "123"); // pass
     *      Y.StringAssert.matches(/^[a-z]+$/, "123"); // fail
     *
     * @param {RegExp} re The regular expression to use.
     * @param {String} str The string to test.
     * @param {String} [message] The message to display if the assertion fails.
     * @method matches
     * @static
     */
    matches: function (re, str, message) {

        Y.Assert._increment();

        if (!Y.Lang.isRegExp(re)) {
            throw new TypeError("StringAssert.matches(): re is not a regular expression");
        }

        if (!Y.Lang.isString(str)) {
            throw new TypeError("StringAssert.matches(): str is not a string");
        }

        if (!re.test(str)) {
            message = Y.Assert._formatMessage(message, "String does not match the regular expression");
            Y.fail(message);
        }
    },

    /**
     * Asserts that a string does not match a regular expression.
     *
     * @example
     *      Y.StringAssert.doesNotMatch(/^[a-z]+$/, "123"); // pass
     *      Y.StringAssert.doesNotMatch(/^[a-z]+$/, "abc"); // fail
     *
     * @param {RegExp} re The regular expression to use.
     * @param {String} str The string to test.
     * @param {String} [message] The message to display if the assertion fails.
     * @method doesNotMatch
     * @static
     */
    doesNotMatch: function (re, str, message) {

        Y.Assert._increment();

        if (!Y.Lang.isRegExp(re)) {
            throw new TypeError("StringAssert.matches(): re is not a regular expression");
        }

        if (!Y.Lang.isString(str)) {
            throw new TypeError("StringAssert.matches(): str is not a string");
        }

        if (re.test(str)) {
            message = Y.Assert._formatMessage(message, "String does match the regular expression");
            Y.fail(message);
        }
    },

    /**
     * Asserts that a string starts with another string.
     *
     * @example
     *      Y.StringAssert.startsWith("foo", "foobar"); // pass
     *      Y.StringAssert.startsWith("foo", "foo");    // pass
     *      Y.StringAssert.startsWith("zzz", "foobar"); // fail
     *
     * @param {String} needle The string to look for.
     * @param {String} haystack The string to test.
     * @param {String} [message] The message to display if the assertion fails.
     * @method startsWith
     * @static
     */
    startsWith: function (needle, haystack, message) {

        Y.Assert._increment();

        if (!Y.Lang.isString(needle)) {
            throw new TypeError("StringAssert.startsWith(): needle is not a string");
        }

        if (!Y.Lang.isString(haystack)) {
            throw new TypeError("StringAssert.startsWith(): haystack is not a string");
        }

        if (haystack.indexOf(needle) != 0) {
            message = Y.Assert._formatMessage(message, "'"+haystack+"' does not start with '"+needle+"'");
            Y.fail(message);
        }
    },

    /**
     * Asserts that a string does not start with another string.
     *
     * @example
     *      Y.StringAssert.doesNotStartWith("zzz", "foobar"); // pass
     *      Y.StringAssert.doesNotStartWith("foo", "foobar"); // fail
     *      Y.StringAssert.doesNotStartWith("foo", "foo");    // fail
     *
     * @param {String} needle The string to for.
     * @param {String} haystack The string to test.
     * @param {String} [message] The message to display if the assertion fails.
     * @method doesNotStartWith
     * @static
     */
    doesNotStartWith: function (needle, haystack, message) {

        Y.Assert._increment();

        if (!Y.Lang.isString(needle)){
            throw new TypeError("StringAssert.doesNotStartWith(): needle is not a string");
        }

        if (!Y.Lang.isString(haystack)) {
            throw new TypeError("StringAssert.doesNotStartWith(): haystack is not a string");
        }

        if (haystack.indexOf(needle) == 0) {
            message = Y.Assert._formatMessage(message, "'"+haystack+"' does start with '"+needle+"'");
            Y.fail(message);
        }
    },

    /**
     * Asserts that a string does end with another string.
     *
     * @example
     *      Y.StringAssert.endsWith("bar", "foobar"); // pass
     *      Y.StringAssert.endsWith("foo", "foo");    // pass
     *      Y.StringAssert.endsWith("zzz", "foobar"); // fail
     *
     * @param {String} needle The string to look for.
     * @param {String} haystack The string to test.
     * @param {String} [message] The message to display if the assertion fails.
     * @method endsWidth
     * @static
     */
    endsWith: function (needle, haystack, message) {

        Y.Assert._increment();

        if (!Y.Lang.isString(needle)) {
            throw new TypeError("StringAssert.endsWith(): needle is not a string");
        }

        if (!Y.Lang.isString(haystack)) {
            throw new TypeError("StringAssert.endsWith(): haystack is not a string");
        }

        if (haystack.substr(haystack.length - needle.length) != needle) {
            message = Y.Assert._formatMessage(message, "'"+haystack+"' does not end with '"+needle+"'");
            Y.fail(message);
        }
    },

    /**
     * Asserts that a string does not end with another string.
     *
     * @example
     *      Y.StringAssert.doesNotEndWith("zzz", "foobar"); // pass
     *      Y.StringAssert.doesNotEndWith("bar", "foobar"); // fail
     *      Y.StringAssert.doesNotEndWith("foo", "foo");    // fail
     *
     * @param {String} needle The string to look for.
     * @param {String} haystack The string to test.
     * @param {String} [message] The message to display if the assertion fails.
     * @method doesNotEndWith
     * @static
     */
    doesNotEndWith: function (needle, haystack, message) {

        Y.Assert._increment();

        if (!Y.Lang.isString(needle)) {
            throw new TypeError("StringAssert.doesNotEndWith(): needle is not a string");
        }

        if (!Y.Lang.isString(haystack)) {
            throw new TypeError("StringAssert.doesNotEndWith(): haystack is not a string");
        }

        if (haystack.substr(haystack.length - needle.length) == needle) {
            message = Y.Assert._formatMessage(message, "'"+haystack+"' does end with '"+needle+"'");
            Y.fail(message);
        }
    }
};
