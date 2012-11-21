YUI.add('querystring-tests', function(Y) {


    var J = Y.JSON.stringify;

    // [ wonkyQS, canonicalQS, obj ]
    var qsTestCases = [ //{
        ["foo=bar",  "foo=bar", {"foo" : "bar"}],
        ["foo=bar&foo=quux", "foo%5B%5D=bar&foo%5B%5D=quux", {"foo" : ["bar", "quux"]}],
        ["foo=1&bar=2", "foo=1&bar=2", {"foo" : 1, "bar" : 2}],
        ["my+weird+field=q1%212%22%27w%245%267%2Fz8%29%3F", "my%20weird%20field=q1!2%22'w%245%267%2Fz8)%3F", {"my weird field" : "q1!2\"'w$5&7/z8)?" }],
        ["foo%3Dbaz=bar", "foo%3Dbaz=bar", {"foo=baz" : "bar"}],
        ["foo=baz=bar", "foo=baz%3Dbar", {"foo" : "baz=bar"}],
        ["str=foo&arr[]=1&arr[]=2&arr[]=3&obj[a]=bar&obj[b][]=4&obj[b][]=5&obj[b][]=6&obj[b][]=&obj[c][]=4&obj[c][]=5&obj[c][][somestr]=baz&obj[objobj][objobjstr]=blerg&somenull=&undef=", "str=foo&arr%5B%5D=1&arr%5B%5D=2&arr%5B%5D=3&obj%5Ba%5D=bar&obj%5Bb%5D%5B%5D=4&obj%5Bb%5D%5B%5D=5&obj%5Bb%5D%5B%5D=6&obj%5Bb%5D%5B%5D=&obj%5Bc%5D%5B%5D=4&obj%5Bc%5D%5B%5D=5&obj%5Bc%5D%5B%5D%5Bsomestr%5D=baz&obj%5Bobjobj%5D%5Bobjobjstr%5D=blerg&somenull=&undef=", {
            "str":"foo",
            "arr":[1,2,3],
            "obj":{
                "a":"bar",
                "b":[4,5,6,""],
                "c":[4,5,{"somestr":"baz"}],
                "objobj":{"objobjstr":"blerg"}
            },
            "somenull":"",
            "undef":""
        }],
        ["foo[bar][bla]=baz&foo[bar][bla]=blo", "foo%5Bbar%5D%5Bbla%5D%5B%5D=baz&foo%5Bbar%5D%5Bbla%5D%5B%5D=blo", {"foo":{"bar":{"bla":["baz","blo"]}}}],
        ["foo[bar][][bla]=baz&foo[bar][][bla]=blo", "foo%5Bbar%5D%5B%5D%5Bbla%5D=baz&foo%5Bbar%5D%5B%5D%5Bbla%5D=blo", {"foo":{"bar":[{"bla":"baz"},{"bla":"blo"}]}}],
        ["foo[bar][bla][]=baz&foo[bar][bla][]=blo", "foo%5Bbar%5D%5Bbla%5D%5B%5D=baz&foo%5Bbar%5D%5Bbla%5D%5B%5D=blo", {"foo":{"bar":{"bla":["baz","blo"]}}}],
        [" foo = bar ", "foo=bar", {"foo":"bar"}]
    ]; //}
    // [ wonkyQS, canonicalQS, obj ]
    var qsColonTestCases = [ //{
        ["foo:bar", "foo:bar", {"foo":"bar"}],
        ["foo:bar;foo:quux", "foo%5B%5D:bar;foo%5B%5D:quux", {"foo" : ["bar", "quux"]}],
        ["foo:1&bar:2;baz:quux", "foo:1%26bar%3A2;baz:quux", {"foo":"1&bar:2", "baz":"quux"}],
        ["foo%3Abaz:bar", "foo%3Abaz:bar", {"foo:baz":"bar"}],
        ["foo:baz:bar", "foo:baz%3Abar", {"foo":"baz:bar"}]
    ]; //}

    // [ wonkyObj, qs, canonicalObj ]
    var extendedFunction = function () {};
    extendedFunction.prototype = {a:"b"};
    var qsWeirdObjects = [ //{
        [ {regexp:/./g}, "regexp=", {"regexp":""} ],
        [ {regexp: new RegExp(".", "g")}, "regexp=", {"regexp":""} ],
        [ {fn:function () {}}, "fn=", {"fn":""}],
        [ {fn:new Function("")}, "fn=", {"fn":""} ],
        [ {math:Math}, "math=", {"math":""} ],
        [ {e:extendedFunction}, "e=", {"e":""} ],
        [ {d:new Date()}, "d=", {"d":""} ],
        [ {d:Date}, "d=", {"d":""} ],
        [ {f:new Boolean(false), t:new Boolean(true)}, "f=0&t=1", {"f":0, "t":1} ],
        [ {f:false, t:true}, "f=0&t=1", {"f":0, "t":1} ]
    ]; //}

    // Tests Below...
    var suite = new Y.Test.Suite("QueryString");
    suite.add(new Y.Test.Case({
        name : "Parse Query Strings",

        testParseBasic : function() {
            Y.Array.forEach(qsTestCases, function (testCase) {
                Y.Assert.areSame(J(testCase[2]), J(Y.QueryString.parse(testCase[0])));
            });
        },
        testParseColon : function () {
            Y.Array.forEach(qsColonTestCases, function (testCase) {
                Y.Assert.areSame(J(testCase[2]), J(Y.QueryString.parse(testCase[0], ";", ":")));
            });
        },
        testParseWeird : function () {
            Y.Array.forEach(qsWeirdObjects, function (testCase) {
                Y.Assert.areSame(J(testCase[2]), J(Y.QueryString.parse(testCase[1])));
            });
        },
        testNested : function () {
            var f = Y.QueryString.parse("a=b&q=x%3Dy%26y%3Dz");
            f.q = Y.QueryString.parse(f.q);
            Y.Assert.areSame(J(f), J({ a : "b", q : { x : "y", y : "z" } }));
        },
        testNestedColon : function () {
            var f = Y.QueryString.parse("a:b;q:x%3Ay%3By%3Az", ";", ":");
            f.q = Y.QueryString.parse(f.q, ";", ":");
            Y.Assert.areSame(J(f), J({ a : "b", q : { x : "y", y : "z" } }));
        }
    }));
    suite.add(new Y.Test.Case({
        name : "Query Stringify Objects",

        _should:{error:{
            testStringifyCyclical : "QueryString.stringify. Cyclical reference"
        }},

        testStringifyBasic : function () {
            Y.Array.forEach(qsTestCases, function (testCase) {
                Y.Assert.areSame(testCase[1], Y.QueryString.stringify(testCase[2], { arrayKey: true }));
            });
        },
        testStringifyColon : function () {
            Y.Array.forEach(qsColonTestCases, function (testCase) {
                Y.Assert.areSame(testCase[1], Y.QueryString.stringify(testCase[2], { arrayKey: true, sep: ";", eq: ":" }));
            });
        },
        testStringifyWeird : function () {
            Y.Array.forEach(qsWeirdObjects, function (testCase) {
                Y.Assert.areSame(testCase[1], Y.QueryString.stringify(testCase[0]), { arrayKey: true });
            });
        },
        testStringifyCyclical : function () {
            var f = {};
            f.f = f;
            Y.QueryString.stringify(f);
        },
        testNested : function () {
            var f = Y.QueryString.stringify({
                a : "b",
                q : Y.QueryString.stringify({
                    x : "y",
                    y : "z"
                }, { arrayKey: true })
            });
            Y.Assert.areSame(f, "a=b&q=x%3Dy%26y%3Dz");
        },
        testNestedColon : function () {
            var f = Y.QueryString.stringify({
                a : "b",
                q : Y.QueryString.stringify({
                    x : "y",
                    y : "z"
                }, { arrayKey: true, sep: ";", eq: ":" })
            }, { arrayKey: true, sep: ";", eq: ":" });
            Y.Assert.areSame(f, "a:b;q:x%3Ay%3By%3Az");
        },
        testArrayKey : function () {
            var f = Y.QueryString.stringify({ foo: ["bar","baz"] });
            Y.Assert.areSame(f, "foo=bar&foo=baz");
        }
    }));

    Y.Test.Runner.add(suite);

});
