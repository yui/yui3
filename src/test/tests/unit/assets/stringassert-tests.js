YUI.add('stringassert-tests', function (Y) {

var suite = new Y.Test.Suite("String Assert Tests");

suite.add(new Y.Test.Case({

    name: "StringAssert.isEmpty(str)",

    "should pass if 'str' is empty": function () {
        Y.StringAssert.isEmpty("");
    },

    "should fail if 'str' is not empty": function () {
        Y.StringAssert.isEmpty("hello world");
    },

    "should fail even if 'str' only contains whitespaces": function () {
        Y.StringAssert.isEmpty(" \r\n \t ");
    },

    "should throw if 'str' is not a string": function () {
        Y.StringAssert.isEmpty({});
    },

    _should: {
        fail: {
            "should fail if 'str' is not empty": true,
            "should fail even if 'str' only contains whitespaces": true
        },
        error: {
            "should throw if 'str' is not a string": true
        }
    }
}));

suite.add(new Y.Test.Case({

    name: "StringAssert.isNotEmpty(str[, excl_whitespace])",

    "should pass if 'str' is not empty": function () {
        Y.StringAssert.isNotEmpty("hello world");
    },

    "should pass if 'str' only contains whitespaces and 'excl_whitespace' is not set": function () {
        Y.StringAssert.isNotEmpty(" \r\n \t ");
    },

    "should pass if 'str' only contains whitespaces and 'excl_whitespace' is false": function () {
        Y.StringAssert.isNotEmpty(" \r\n \t ", false);
    },

    "should fail if 'str' is empty": function () {
        Y.StringAssert.isNotEmpty("");
    },

    "should fail if 'str' only contains whitespaces and 'excl_whitespace' is true": function () {
        Y.StringAssert.isNotEmpty(" \r\n \t ", true);
    },

    "should throw if 'str' is not a string": function () {
        Y.StringAssert.isNotEmpty({});
    },

    _should: {
        fail: {
            "should fail if 'str' is empty": true,
            "should fail if 'str' only contains whitespaces and 'excl_whitespace' is true": true
        },
        error: {
            "should throw if 'str' is not a string": true
        }
    }
}));

suite.add(new Y.Test.Case({

    name: "StringAssert.isTrimmed(str)",

    "should pass if 'str' has no leading and trailing whitespaces": function () {
        Y.StringAssert.isTrimmed("abc");
    },

    "should fail if 'str' has leading whitespaces": function () {
        Y.StringAssert.isTrimmed("\r\nabc");
    },

    "should fail if 'str' has trailing whitespaces": function () {
        Y.StringAssert.isTrimmed("abc\r\n");
    },

    "should fail if 'str' has both leading and trailing whitespaces": function () {
        Y.StringAssert.isTrimmed("\tabc\t");
    },

    "should throw if 'str' is not a string": function () {
        Y.StringAssert.isTrimmed({});
    },

    _should: {
        fail: {
            "should fail if 'str' has leading whitespaces": true,
            "should fail if 'str' has trailing whitespaces": true,
            "should fail if 'str' has both leading and trailing whitespaces": true
        },
        error: {
            "should throw if 'str' is not a string": true
        },
    }
}));

suite.add(new Y.Test.Case({

    name: "StringAssert.contains(needle, haystack)",

    "should pass if 'haystack' contains 'needle'": function () {
        Y.StringAssert.contains("bbb", "aaa bbb ccc");
    },

    "should pass if 'haystack' starts with 'needle'": function () {
        Y.StringAssert.contains("aaa", "aaa bbb ccc");
    },

    "should pass if 'haystack' ends with 'needle'": function () {
        Y.StringAssert.contains("ccc", "aaa bbb ccc");
    },

    "should pass if 'haystack' and 'needle' are the same": function () {
        Y.StringAssert.contains("aaa", "aaa");
    },

    // this is because both `'aaa'.indexOf('')` and `'aaa'.lastIndexOf('')`
    // don't return -1 so it's probably safer to say in line.
    "should pass if 'needle' is empty": function () {
        Y.StringAssert.contains("", "aaa");
    },

    "should fail if 'haystack' does not contain 'needle'": function () {
        Y.StringAssert.contains("zzz", "aaa bbb ccc");
    },

    "should throw if 'needle' is not a string": function () {
        Y.StringAssert.contains({}, "abc");
    },

    "should throw if 'haystack' is not a string": function () {
        Y.StringAssert.contains("abc", {});
    },

    _should: {
        fail: {
            "should fail if 'haystack' does not contain 'needle'": true
        },
        error: {
            "should throw if 'haystack' is not a string": true,
            "should throw if 'needle' is not a string": true
        }
    }
}));

suite.add(new Y.Test.Case({

    name: "StringAssert.doesNotContain(needle, haystack)",

    "should pass if 'haystack' does not contain 'needle'": function () {
        Y.StringAssert.doesNotContain("zzz", "aaa bbb ccc");
    },

    "should fail if 'haystack' contains 'needle'": function () {
        Y.StringAssert.doesNotContain("bbb", "aaa bbb ccc");
    },

    "should fail if 'haystack' starts with 'needle'": function () {
        Y.StringAssert.doesNotContain("aaa", "aaa bbb ccc");
    },

    "should fail if 'haystack' ends with 'needle'": function () {
        Y.StringAssert.doesNotContain("ccc", "aaa bbb ccc");
    },

    "should fail if 'haystack' and 'needle' are the same": function () {
        Y.StringAssert.doesNotContain("aaa", "aaa");
    },

    // this is because both `'aaa'.indexOf('')` and `'aaa'.lastIndexOf('')`
    // don't return -1 so it's probably safer to say in line.
    "should fail if 'needle' is empty": function () {
        Y.StringAssert.doesNotContain("", "aaa");
    },

    "should throw if 'needle' is not a string": function () {
        Y.StringAssert.doesNotContain({}, "abc");
    },

    "should throw if 'haystack' is not a string": function () {
        Y.StringAssert.doesNotContain("abc", {});
    },

    _should: {
        fail: {
            "should fail if 'haystack' contains 'needle'": true,
            "should fail if 'haystack' starts with 'needle'": true,
            "should fail if 'haystack' ends with 'needle'": true,
            "should fail if 'haystack' and 'needle' are the same": true,
            "should fail if 'needle' is empty": true
        },
        error: {
            "should throw if 'haystack' is not a string": true,
            "should throw if 'needle' is not a string": true
        }
    }
}));

suite.add(new Y.Test.Case({

    name: "StringAssert.matches(re, str)",

    "should pass if 'str' matches the regular expression": function () {
        Y.StringAssert.matches(/^[0-9]+$/, "123");
    },

    "should fail if 'str' does not match the regular expression": function () {
        Y.StringAssert.matches(/^[a-z]+$/, "123");
    },

    "should throw if 're' is not a regular expression": function () {
        Y.StringAssert.matches({}, "abc");
    },

    "should throw if 'str' is not a string": function () {
        Y.StringAssert.matches(/^[0-9]+$/, {});
    },

    _should: {
        fail: {
            "should fail if 'str' does not match the regular expression": true
        },
        error: {
            "should throw if 're' is not a regular expression": true,
            "should throw if 'str' is not a string": true
        }
    }
}));

suite.add(new Y.Test.Case({

    name: "StringAssert.doesNotMatch(re, str)",

    "should pass if 'str' does not match the regular expression": function () {
        Y.StringAssert.doesNotMatch(/^[a-z]+$/, "123");
    },

    "should fail if 'str' does match the regular expression": function () {
        Y.StringAssert.doesNotMatch(/^[a-z]+$/, "abc");
    },

    "should throw if 're' is not a regular expression": function () {
        Y.StringAssert.doesNotMatch({}, "abc");
    },

    "should throw if 'str' is not a string": function () {
        Y.StringAssert.doesNotMatch(/^[0-9]+$/, {});
    },

    _should: {
        fail: {
            "should fail if 'str' does match the regular expression": true
        },
        error: {
            "should throw if 're' is not a regular expression": true,
            "should throw if 'str' is not a string": true
        }
    }
}));

suite.add(new Y.Test.Case({

    name: "StringAssert.startsWith(needle, haystack)",

    "should pass if 'haystack' starts with 'needle'": function () {
        Y.StringAssert.startsWith("foo", "foobar");
    },

    "should pass if 'haystack' and 'needle' are the same": function () {
        Y.StringAssert.startsWith("foo", "foo");
    },

    // this is because `'aaa'.indexOf('')` doesn't return -1 so it is probably safer to stay in line.
    "should pass if 'needle' is empty": function () {
        Y.StringAssert.startsWith("", "foo");
    },

    "should fail if 'haystack' does not start with 'needle'": function () {
        Y.StringAssert.startsWith("zzz", "foobar");
    },

    "should fail if 'needle' is longer than 'haystack'": function () {
        Y.StringAssert.startsWith("foobar", "foo");
    },

    "should throw if 'needle' is not a string": function () {
        Y.StringAssert.startsWith({}, "abc");
    },

    "should throw if 'haystack' is not a string": function () {
        Y.StringAssert.startsWith("abc", {});
    },

    _should: {
        fail: {
            "should fail if 'haystack' does not start with 'needle'": true,
            "should fail if 'needle' is longer than 'haystack'": true
        },
        error: {
            "should throw if 'needle' is not a string": true,
            "should throw if 'haystack' is not a string": true
        }
    }
}));

suite.add(new Y.Test.Case({

    name: "StringAssert.doesNotStartWith(needle, haystack)",

    "should pass if 'haystack' does not start with 'needle'": function () {
        Y.StringAssert.doesNotStartWith("zzz", "foobar");
    },

    "should fail if 'haystack' does start with 'needle'": function () {
        Y.StringAssert.doesNotStartWith("foo", "foobar");
    },

    "should fail if 'haystack' and 'needle' are the same": function () {
        Y.StringAssert.doesNotStartWith("foo", "foo");
    },

    // this is because `'aaa'.indexOf('')` doesn't return -1 so it is probably safer to stay in line.
    "should fail if 'needle' is empty": function () {
        Y.StringAssert.doesNotStartWith("", "foo");
    },

    "should throw if 'needle' is not a string": function () {
        Y.StringAssert.doesNotStartWith({}, "abc");
    },

    "should throw if 'haystack' is not a string": function () {
        Y.StringAssert.doesNotStartWith("abc", {});
    },

    _should: {
        fail: {
            "should fail if 'haystack' does start with 'needle'": true,
            "should fail if 'haystack' and 'needle' are the same": true,
            "should fail if 'needle' is empty": true
        },
        error: {
            "should throw if 'needle' is not a string": true,
            "should throw if 'haystack' is not a string": true
        }
    }
}));

suite.add(new Y.Test.Case({

    name: "StringAssert.endsWith(needle, haystack)",

    "should pass if 'haystack' ends with 'needle'": function () {
        Y.StringAssert.endsWith("bar", "foobar");
    },

    "should pass if 'haystack' and 'needle' are the same": function () {
        Y.StringAssert.endsWith("foo", "foo");
    },

    // this is because `'aaa'.lastIndexOf('')` doesn't return -1 so it is probably safer to stay in line.
    "should pass if 'needle' is empty": function () {
        Y.StringAssert.endsWith("", "foo");
    },

    "should fail if 'haystack' does not end with 'needle'": function () {
        Y.StringAssert.endsWith("zzz", "foobar");
    },

    "should fail if 'needle' is longer than 'haystack'": function () {
        Y.StringAssert.endsWith("foobar", "foo");
    },

    "should throw if 'needle' is not a string": function () {
        Y.StringAssert.endsWith({}, "abc");
    },

    "should throw if 'haystack' is not a string": function () {
        Y.StringAssert.endsWith("abc", {});
    },

    _should: {
        fail: {
            "should fail if 'haystack' does not end with 'needle'": true,
            "should fail if 'needle' is longer than 'haystack'": true
        },
        error: {
            "should throw if 'needle' is not a string": true,
            "should throw if 'haystack' is not a string": true
        }
    }
}));

suite.add(new Y.Test.Case({

    name: "StringAssert.doesNotEndWith(needle, haystack)",

    "should pass if 'haystack' does not end with 'needle'": function () {
        Y.StringAssert.doesNotEndWith("zzz", "foobar");
    },

    "should pass if 'needle' is longer than 'haystack'": function () {
        Y.StringAssert.doesNotEndWith("foobar", "foo");
    },

    "should fail if 'haystack' does end with 'needle'": function () {
        Y.StringAssert.doesNotEndWith("bar", "foobar");
    },

    "should fail if 'haystack' and 'needle' are the same": function () {
        Y.StringAssert.doesNotEndWith("foo", "foo");
    },

    // this is because `'aaa'.lastIndexOf('')` doesn't return -1 so it is probably safer to stay in line.
    "should fail if 'needle' is empty": function () {
        Y.StringAssert.doesNotEndWith("", "foo");
    },

    "should throw if 'needle' is not a string": function () {
        Y.StringAssert.doesNotEndWith({}, "abc");
    },

    "should throw if 'haystack' is not a string": function () {
        Y.StringAssert.doesNotEndWith("abc", {});
    },

    _should: {
        fail: {
            "should fail if 'haystack' does end with 'needle'": true,
            "should fail if 'haystack' and 'needle' are the same": true,
            "should fail if 'needle' is empty": true
        },
        error: {
            "should throw if 'needle' is not a string": true,
            "should throw if 'haystack' is not a string": true
        }
    }
}));

Y.Test.Runner.add(suite);

});
