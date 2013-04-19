YUI.add('json-parse-tests', function(Y) {

// Automated tests should only cover js API.  Use a manual test for native API
Y.JSON.useNativeParse = false;

var suite = new Y.Test.Suite("Y.JSON.parse (JavaScript implementation)"),

    JSON_STRING = '[' +
    '"JSON Test Pattern pass1",' +
    '{"object with 1 member":["array with 1 element"]},' +
    '{},' +
    '[],' +
    '-42,' +
    'true,' +
    'false,' +
    'null,' +
    '{' +
        '"integer": 1234567890,' +
        '"real": -9876.543210,' +
        '"e": 0.123456789e-12,' +
        '"E": 1.234567890E+34,' +
        '"":  23456789012E66,' +
        '"zero": 0,' +
        '"one": 1,' +
        '"space": " ",' +
        '"quote": "\\"",' +
        '"backslash": "\\\\",' +
        '"controls": "\\b\\f\\n\\r\\t",' +
        '"slash": "/ & \\/",' +
        '"alpha": "abcdefghijklmnopqrstuvwxyz",' +
        '"ALPHA": "ABCDEFGHIJKLMNOPQRSTUVWXYZ",' +
        '"digit": "0123456789",' +
        '"0123456789": "digit",' +
        '"special": "`1~!@#$%^&*()_+-={\':[,]}|;.</>?",' +
        '"hex": "\\u0123\\u4567\\u89AB\\uCDEF\\uabcd\\uef4A",' +
        '"true": true,' +
        '"false": false,' +
        '"null": null,' +
        '"array":[  ],' +
        '"object":{  },' +
        '"address": "50 St. James Street",' +
        '"url": "http://www.JSON.org/",' +
        '"comment": "// /* <!-- --",' +
        '"# -- --> */": " ",' +
        '" s p a c e d " :[1,2 , 3,4 , 5        ,          6           ,7        ],' +
        '"compact":[1,2,3,4,5,6,7],' +
        '"jsontext": "{\\\"object with 1 member\\\":[\\\"array with 1 element\\\"]}",' +
        '"quotes": "&#34; \\u0022 %22 0x22 034 &#x22;",' +
        '"\\/\\\\\\"\\uCAFE\\uBABE\\uAB98\\uFCDE\\ubcda\\uef4A\\b\\f\\n\\r\\t`1~!@#$%^&*()_+-=[]{}|;:\',./<>?" : "A key can be any string"' +
    '},' +
    '0.5 ,98.6,' +
    '99.44,' +
    '1066,' +
    '1e1,' +
    '0.1e1,' +
    '1e-1,' +
    '1e00,' +
    '2e+00,' +
    '2e-00,' +
    '"rosebud"]';

/*****************************/
/*     Tests begin here      */
/*****************************/
suite.add(new Y.Test.Case({
    name : "parse",

    _should : {
        error : {
            test_failOnEmptyString              : true,
            test_failOnFunction                 : true,
            test_failOnRegex                    : true,
            test_failOnNew                      : true,
            test_failOnUnquotedVal              : true,
            test_failOnUnquotedKey              : true,
            test_failOnUnclosedObject           : true,
            test_failOnUnclosedArray            : true,
            test_failOnExtraCommaInObject       : true,
            test_failOnDoubleExtraCommaInObject : true,
            test_failOnExtraCommaInArray        : true,
            test_failOnDoubleExtraCommaInArray  : true,
            test_failOnMissingValue             : true,
            test_failOnCommaAfterClose          : true,
            test_failOnValueAfterClose          : true,
            test_failOnExtraClose               : true,
            test_failOnExpression               : true,
            test_failOnZeroPrefixedNumber       : true,
            test_failOnHex                      : true,
            test_failOnIllegalBackslashEscape   : true,
            test_failOnMissingColon             : true,
            test_failOnDoubleColon              : true,
            test_failOnCommaInsteadOfColon      : true,
            test_failOnColonInsteadOfComma      : true,
            test_failOnSingleQuote              : true,
            test_failOnTabCharacter             : true,
            test_failOnLineBreakChar            : true,
            test_failOnMismatchedClose          : true,
            test_failOnObjectInput              : true,
            test_failOnArrayInput               : true,
            test_failOnDateInput                : true,
            test_failOnRegExpInput              : true,
            test_failOnErrorInput               : true,
            test_failOnFunctionInput            : true,
            test_failOnNaNInput                 : true,
            test_failOnInfinityInput            : true,
            test_failOnUndefinedInput           : true
        }
    },

    test_emptyObject : function () {
        Y.Assert.isObject(Y.JSON.parse("{}"));
    },
    test_emptyArray : function () {
        Y.Assert.isObject(Y.JSON.parse("[]"));
    },
    test_JSONNatives : function () {
        // Note: backslashes are double escaped to emulate string returned from
        // server.
        var data = Y.JSON.parse('{"obj":{},"arr":[],"f":false,"t":true,"n":null,"int":12345,"fl":1.2345,"str":"String\\nwith\\tescapes"}');
        Y.Assert.isObject(data);
        Y.Assert.isObject(data.obj);
        Y.Assert.isArray(data.arr);
        Y.Assert.isNull(data.n);
        Y.Assert.areSame(false,data.f);
        Y.Assert.areSame(true,data.t);
        Y.Assert.areSame(12345,data["int"]);
        Y.Assert.areSame(1.2345,data.fl);
        Y.Assert.areSame("String\nwith\tescapes",data.str);
    },
    test_basics : function () {
        var data = Y.JSON.parse(JSON_STRING);

        Y.Assert.isArray(data);
        Y.Assert.areSame(20,data.length);
        Y.Assert.isString(data[0]);
        Y.Assert.isObject(data[1]);
        Y.Assert.isArray(data[1]["object with 1 member"]);
        Y.Assert.areSame(1,data[1]["object with 1 member"].length);
        Y.Assert.isNumber(data[4]);
        Y.Assert.isBoolean(data[5]);
        Y.Assert.isBoolean(data[6]);
        Y.Assert.isNull(data[7]);
        Y.Assert.areSame(1234567890,data[8].integer);
        Y.Assert.areSame(-9876.543210,data[8].real);
        Y.Assert.areSame(0.123456789e-12,data[8].e);
        Y.Assert.areSame(1.234567890e+34,data[8].E);
        Y.Assert.areSame(23456789012E66,data[8][""]);
        Y.Assert.areSame(0,data[8].zero);
        Y.Assert.areSame(1,data[8].one);
        Y.Assert.areSame(" ",data[8].space);
        Y.Assert.areSame('"',data[8].quote);
        Y.Assert.areSame("\\",data[8].backslash);
        Y.Assert.areSame("\b\f\n\r\t",data[8].controls);
        Y.Assert.areSame("/ & \/",data[8].slash);
        Y.Assert.areSame("abcdefghijklmnopqrstuvwxyz",data[8].alpha);
        Y.Assert.areSame("ABCDEFGHIJKLMNOPQRSTUVWXYZ",data[8].ALPHA);
        Y.Assert.areSame("0123456789",data[8].digit);
        Y.Assert.areSame("digit",data[8]["0123456789"]);

        Y.Assert.areSame(1234567890,data[8].integer);
        Y.Assert.areSame("`1~!@#$%^&*()_+-={':[,]}|;.</>?",data[8].special);
        Y.Assert.areSame("\u0123\u4567\u89AB\uCDEF\uabcd\uef4A",data[8].hex);
        Y.Assert.areSame(true,data[8]["true"]);
        Y.Assert.areSame(false,data[8]["false"]);
        Y.Assert.isNull(data[8]["null"]);
        Y.Assert.isArray(data[8]["array"]);
        Y.Assert.isObject(data[8]["object"]);
        Y.Assert.areSame("http://www.JSON.org/",data[8].url);
        Y.Assert.areSame("// /* <!-- --",data[8].comment);
        Y.Assert.areSame(" ",data[8]["# -- --> */"]);
        Y.ArrayAssert.itemsAreSame([1,2,3,4,5,6,7],data[8][" s p a c e d "]);
        Y.ArrayAssert.itemsAreSame([1,2,3,4,5,6,7],data[8].compact);
        Y.Assert.areSame("{\"object with 1 member\":[\"array with 1 element\"]}",data[8].jsontext);
        Y.Assert.areSame("&#34; \u0022 %22 0x22 034 &#x22;",data[8].quotes);
        Y.Assert.areSame("A key can be any string",data[8]["\/\\\"\uCAFE\uBABE\uAB98\uFCDE\ubcda\uef4A\b\f\n\r\t`1~!@#$%^&*()_+-=[]{}|;:',./<>?"]);

        Y.Assert.areSame(0.5,data[9]);
        Y.Assert.areSame(98.6,data[10]);
        Y.Assert.areSame(99.44,data[11]);
        Y.Assert.areSame(1066,data[12]);
        Y.Assert.areSame(1e1,data[13]);
        Y.Assert.areSame(0.1e1,data[14]);
        Y.Assert.areSame(1e-1,data[15]);
        Y.Assert.areSame(1e00,data[16]);
        Y.Assert.areSame(2e+00,data[17]);
        Y.Assert.areSame(2e-00,data[18]);
        Y.Assert.areSame("rosebud",data[19]);
    },
    test_nonObjectWrapper : function () {
        //Y.Assert.areSame('this is a string',Y.JSON.parse('"this is a string"'));
        //Y.Assert.areSame(true,Y.JSON.parse('true'));
        //Y.Assert.areSame(12345,Y.JSON.parse("12345"));
        //Y.Assert.areSame(1.2345,Y.JSON.parse("1.2345"));
        Y.Assert.areSame(null,Y.JSON.parse("null"));
    },
    test_failOnEmptyString : function () {
        // parse should throw an error 
        Y.Assert.isString(Y.JSON.parse(""));
       // Y.log("Parsed empty string, but should have failed.","warn","TestRunner");
    },
    test_failOnFunction : function () {
        // parse should throw an error 
        Y.JSON.parse('{"fn":function(){}}');
        //Y.log("Parsed a function, but should have failed.","warn","TestRunner");
    },
    test_failOnRegex : function () {
        // parse should throw an error 
        Y.JSON.parse('{"re":/abc/}');
        //Y.log("Parsed regular expression literal, but should have failed.","warn","TestRunner");
    },
    test_failOnNew : function () {
        // parse should throw an error 
        Y.JSON.parse('{"dt":new Date()}');
        //Y.log("Parsed <code>new Date()</code>, but should have failed.","warn","TestRunner");
    },
    test_failOnUnquotedVal : function () {
        // parse should throw an error 
        Y.JSON.parse('{"foo":bar}');
        //Y.log("Parsed unquoted non-native value, but should have failed.","warn","TestRunner");
    },
    test_failOnUnquotedKey : function () {
        // parse should throw an error 
        Y.JSON.parse('{foo:1}');
        //Y.log("Parsed unquoted object key, but should have failed.","warn","TestRunner");
    },
    test_failOnUnclosedObject : function () {
        // parse should throw an error 
        Y.JSON.parse('{"unclosed":"object"');
        //Y.log("Parsed unclosed object, but should have failed.","warn","TestRunner");
    },
    test_failOnUnclosedArray : function () {
        // parse should throw an error 
        Y.JSON.parse('["unclosed array"');
        //Y.log("Parsed unclosed array, but should have failed.","warn","TestRunner");
    },
    test_failOnExtraCommaInObject : function () {
        // JS validator will allow, FF 3.1b2 native will allow.  IE8 errors.
        // eval will fail in IE6-7, but pass in others
        // Trailing commas are invalid, but not a security risk, so acceptable
        Y.JSON.parse('{"extra":"comma",}');
        //Y.log("Parsed object with extra comma, but should have failed.","warn","TestRunner");
        throw new Error("Parsed object with extra comma, but should have failed.");
    },
    test_failOnDoubleExtraCommaInObject : function () {
        // parse should throw an error 
        Y.JSON.parse('{"extra":"commas",,}');
        //Y.log("Parsed object with two extra commas, but should have failed.","warn","TestRunner");
    },
    test_failOnExtraCommaInArray : function () {
        // Correct failure in IE6-8.  FF accepts trailing commas without error
        // Trailing commas are invalid, but not a security risk, so acceptable
        Y.JSON.parse('["extra","comma",]');
        //Y.log("Parsed array with extra comma, but should have failed.","warn","TestRunner");
        throw new Error("Parsed array with extra comma, but should have failed.");
    },
    test_failOnDoubleExtraCommaInArray : function () {
        // Correct failure in IE6-8.  FF accepts trailing commas without error
        // Trailing commas are invalid, but not a security risk, so acceptable
        Y.JSON.parse('["extra","commas",,]');
        //Y.log("Parsed array with two extra commas, but should have failed.","warn","TestRunner");
        throw new Error("Parsed array with two extra commas, but should have failed.");
    },
    test_failOnMissingValue : function () {
        // Correct failure in IE6-8.  FF accepts trailing commas without error
        // Trailing commas are invalid, but not a security risk, so acceptable
        var data = Y.JSON.parse('[,"<-- missing value"]');
        //Y.log("Parsed array with missing value ("+data[0]+"), but should have failed.","warn","TestRunner");
        throw new Error("Parsed array with missing value ("+data[0]+"), but should have failed.");
    },
    test_failOnCommaAfterClose : function () {
        // parse should throw an error 
        Y.JSON.parse('["comma","after","close"],');
        //Y.log("Parsed comma after array close, but should have failed.","warn","TestRunner");
    },
    test_failOnValueAfterClose : function () {
        // parse should throw an error 
        Y.JSON.parse('{"misplaced":"value"}" after close"');
        //Y.log("Parsed string value after object close, but should have failed.","warn","TestRunner");
    },
    test_failOnExtraClose : function () {
        // parse should throw an error 
        var data = Y.JSON.parse('{"foo":1}}');
        //Y.log("Parsed extra closing curly brace on object, but should have failed.","warn","TestRunner");
        throw new Error("Parsed extra closing curly brace on object, but should have failed.");
    },
    test_failOnExpression : function () {
        // parse should throw an error 
        Y.JSON.parse('{"foo":1+2}');
        //Y.log("Parsed expression, but should have failed.","warn","TestRunner");
    },
    test_failOnZeroPrefixedNumber : function () {
        // Correct failure in IE8.  FF accepts leading zeros without error
        // Leading zeros are invalid, but not a security risk, so acceptable
        Y.JSON.parse('{"foo":01}');
        //Y.log("Parsed zero prefixed number, but should have failed.","warn","TestRunner");
        throw new Error("Parsed zero prefixed number, but should have failed.");
    },
    test_failOnHex : function () {
        // parse should throw an error 
        Y.JSON.parse('{"foo":0x14}');
        //Y.log("Parsed hex value, but should have failed.","warn","TestRunner");
    },
    test_failOnIllegalBackslashEscape : function () {
        // Correctly fails in all but IE8's native parse.
        // The spec does not specify a limitation to the escape characters a
        // decoder supports, so either is acceptable.
        var data = Y.JSON.parse('["illegal backslash escape: \\x15"]');
        //Y.log("Parsed illegal backslash escape \\x15, but should have failed.","warn","TestRunner");
        throw new Error("Parsed illegal backslash escape \\x15, but should have failed.");
    },
    test_failOnMissingColon : function () {
        // parse should throw an error 
        Y.JSON.parse('{"foo" null}');
        //Y.log("Parsed object with missing colon, but should have failed.","warn","TestRunner");
    },
    test_failOnDoubleColon : function () {
        // parse should throw an error 
        Y.JSON.parse('{"foo"::1}');
        //Y.log("Parsed double colon in object, but should have failed.","warn","TestRunner");
    },
    test_failOnCommaInsteadOfColon : function () {
        // parse should throw an error 
        Y.JSON.parse('{"foo",1}');
        //Y.log("Parsed comma in place of colon, but should have failed.","warn","TestRunner");
    },
    test_failOnColonInsteadOfComma : function () {
        // parse should throw an error 
        Y.JSON.parse('["colon instead of":"comma"]');
        //Y.log("Parsed colon in place of comma, but should have failed.","warn","TestRunner");
    },
    test_failOnSingleQuote : function () {
        // parse should throw an error 
        Y.JSON.parse("{'foo':1}");
        //Y.log("Parsed single quote, but should have failed.","warn","TestRunner");
    },
    test_failOnLineBreakChar : function () {
        // FF3.1b2 currently allows linebreak chars in native implementation
        // Harmless, so permissable
        Y.JSON.parse("[\"line\nbreak\"]");
        //Y.log("Parsed unescaped line break character, but should have failed.","warn","TestRunner");
        throw new Error("Parsed unescaped line break character, but should have failed.");
    },
    test_failOnMismatchedClose : function () {
        // parse should throw an error 
        Y.JSON.parse('["mismatched"}');
        //Y.log("Parsed curly brace close for array, but should have failed.","warn","TestRunner");
    },
    test_failOnObjectInput: function () {
        // parse should throw an error 
        Y.JSON.parse({"should": "be treated as [object Object]"});
        //Y.log("Parsed object input, but should have failed.","warn","TestRunner");
    },
    test_arrayContainingValidJSON: function () {
        // Should be ToString'ed to '{"foo":"bar"}' which is valid
        var o = Y.JSON.parse(['{"foo":"bar"}']);

        Y.Assert.isObject(o);
        Y.Assert.areSame("bar", o.foo);
    },
    test_failOnArrayInput: function () {
        // parse should throw an error 
        Y.JSON.parse(['x', 'y']); // should be treated as "x,y");
        //Y.log("Parsed array input, but should have failed.","warn","TestRunner");
    },
    test_failOnDateInput: function () {
        // parse should throw an error 
        Y.JSON.parse(new Date()); // should be treated as date string
        //Y.log("Parsed Date input, but should have failed.","warn","TestRunner");
    },
    test_failOnRegExpInput: function () {
        // parse should throw an error 
        Y.JSON.parse(/should fail/); // should ToString to '/should fail/'
        Y.JSON.parse(/true/); // should ToString to '/true/'
        //Y.log("Parsed RegExp input, but should have failed.","warn","TestRunner");
    },
    test_failOnErrorInput: function () {
        // parse should throw an error 
        Y.JSON.parse(new Error("Boom")); // ToString to 'Error: Boom'
        Y.JSON.parse(new Error("true")); // ToString to 'Error: true'
        Y.JSON.parse(new SyntaxError("true")); // ToString to 'Error: true'
        //Y.log("Parsed Error input, but should have failed.","warn","TestRunner");
    },
    test_failOnFunctionInput: function () {
        // parse should throw an error 
        Y.JSON.parse(function () { return "decompiled!"; }); // ToString 'function ...'
        //Y.log("Parsed function input, but should have failed.","warn","TestRunner");
    },
    test_failOnNaNInput: function () {
        // parse should throw an error 
        Y.JSON.parse(NaN); // ToString to 'NaN', but not a valid JSON number
        //Y.log("Parsed NaN input, but should have failed.","warn","TestRunner");
    },
    test_failOnInfinityInput: function () {
        // parse should throw an error 
        Y.JSON.parse(Infinity); // ToString to 'Infinity', but not valid JSON
        //Y.log("Parsed Infinity input, but should have failed.","warn","TestRunner");
    },
    test_failOnUndefinedInput: function () {
        // Should be ToString'ed to 'undefined'
        Y.JSON.parse(undefined);
        Y.JSON.parse();
        //Y.log("Parsed undefined input, but should have failed.","warn","TestRunner");
    },
    test_booleanInput: function () {
        // Should be ToString'ed to 'true'
        var bool = Y.JSON.parse(true);

        Y.Assert.isBoolean(bool);
        Y.Assert.isTrue(bool);

        bool = Y.JSON.parse(false);

        Y.Assert.isBoolean(bool);
        Y.Assert.isFalse(bool);

        // Should be ToString'ed to 'true'
        bool = Y.JSON.parse(new Boolean(true));

        Y.Assert.isBoolean(bool);
        Y.Assert.isTrue(bool);

        bool = Y.JSON.parse(new Boolean(false));

        Y.Assert.isBoolean(bool);
        Y.Assert.isFalse(bool);
    },
    test_stringObjectInput: function () {
        // Should be ToString'ed to '{"foo":"bar"}' which is valid
        var o = Y.JSON.parse(new String('{"foo":"bar"}'));

        Y.Assert.isObject(o);
        Y.Assert.areSame("bar", o.foo);
    },
    test_numberInput: function () {
        Y.Assert.areSame(0, Y.JSON.parse(0));
        Y.Assert.areSame(100, Y.JSON.parse(100));
        Y.Assert.areSame(-100, Y.JSON.parse(-100));
        Y.Assert.areSame(-1.05e2, Y.JSON.parse(-1.05e2));
    },
    test_nullInput: function () {
        // Should be ToString'ed to 'null'
        Y.Assert.isNull(Y.JSON.parse(null));
    },
    test_objectWithToStringInput: function () {
        // Should be ToString'ed to '{"foo":"bar"}' which is valid
        var o = Y.JSON.parse({
            toString: function () {
                return '{"foo":"bar"}';
            }
        });

        Y.Assert.isObject(o);
        Y.Assert.areSame("bar", o.foo);
    }
}));

suite.add(new Y.Test.Case({
    name : "reviver",

    test_reviver : function () {
        var data = Y.JSON.parse(JSON_STRING, function (k,v) {
            switch (k) {
                case "alpha" : return "LOWER CASE";
                case "ALPHA" : return "upper case";
                case "true"  :
                case "false" :
                case "null"  : return undefined;
            }

            if (typeof v === 'number') {
                return -(Math.abs(v|0));
            }

            if (Y.Lang.isArray(v)) {
                v[99] = "NEW ITEM";
            }

            return v;
        });

        Y.Assert.areSame("LOWER CASE", data[8].alpha);
        Y.Assert.areSame("upper case", data[8].ALPHA);
        Y.Assert.isUndefined(data[8]["true"]);
        Y.Assert.isUndefined(data[8]["false"]);
        Y.Assert.isUndefined(data[8]["null"]);
        Y.Assert.areSame(-42, data[4]);
        Y.Assert.areSame(-1234567890, data[8].integer);
        Y.Assert.areSame(-9876, data[8].real);
        Y.Assert.areSame(-1, data[8].one);
        Y.Assert.areSame(-3, data[8][" s p a c e d "][2]);

        Y.Assert.areSame("NEW ITEM", data[99]);
        Y.Assert.areSame("NEW ITEM", data[8][" s p a c e d "][99]);
        Y.Assert.areSame("NEW ITEM", data[8].compact[99]);
    }
}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['json-parse-shim', 'test']});
YUI.add('json-stringify-tests', function(Y) {

// Automated tests should only cover js API.  Use a manual test for native API
Y.JSON.useNativeStringify = false;

var suite = new Y.Test.Suite("Y.JSON.stringify (JavaScript implementation)");

suite.add(new Y.Test.Case({
    name : "stringify",

    _should : {
        error : {
            test_failOnStringifyCyclicalRef1    : true,
            test_failOnStringifyCyclicalRef2    : true,
            test_failOnStringifyCyclicalRef3    : true
        }
    },

    test_stringifyNatives: function () {
        Y.Assert.areSame('[true,false,null,-0.12345,"string",{"object with one member":["array with one element"]}]',
            Y.JSON.stringify([true,false,null,-0.12345,"string",{"object with one member":["array with one element"]}]));
    },

    test_stringifyEscapes: function () {
        Y.Assert.areSame('["\\\\","\\\\\'","\\\\\\\"","\\\\\\\"","\\b","\\b","\\\\b","\\\\\\b","\\\\\\b","\\b","\\\\x08","\\\\\\b","\\\\\\\\x08","\\n","\\\\n","\\\\\\n"]',
            Y.JSON.stringify(['\\','\\\'', "\\\"", '\\"', "\b", '\b', "\\b","\\\b", '\\\b', "\x08", "\\x08", "\\\x08","\\\\x08", "\n", "\\n", "\\\n"]));
    },

    test_stringifyObject : function () {
        // stringify sorts the keys
        Y.Assert.areSame('{"one":1,"two":true,"three":false,"four":null,"five":"String with\\nnewline","six":{"nested":-0.12345}}',
            Y.JSON.stringify({one:1,two:true,three:false,four:null,five:"String with\nnewline",six :  {nested:-0.12345}}));
    },

    test_failOnStringifyCyclicalRef1 : function () {
        var o = { key: 'value' };
        o.recurse = o;

        // Should throw an error
        Y.JSON.stringify(o);
        Y.log("Stringified Object with cyclical reference, but should have failed.","warn","TestRunner");
    },

    test_failOnStringifyCyclicalRef2 : function () {
        var o = [1,2,3];
        o[3] = o;

        // Should throw an error
        Y.JSON.stringify(o);
        Y.log("Stringified Array with cyclical reference, but should have failed.","warn","TestRunner");
    },

    test_failOnStringifyCyclicalRef3 : function () {
        var o = [1,2,3,{key:"value",nest:[4,5,6,{foo:"bar"}]}];
        o[4] = o[3].x = o[3].nest[4] =
        o[3].nest[3].y = o[3].nest[3].z = o;

        // Should throw an error
        Y.JSON.stringify(o);
        Y.log("Stringified Object with cyclical reference, but should have failed.","warn","TestRunner");
    },

    test_stringifyFunction : function () {
        Y.Assert.areSame('{"arr":[null]}',
            Y.JSON.stringify({
                functions : function (are,ignored) {},
                arr       : [ function () {} ]
            }));
    },

    test_stringifyRegex : function () {
        Y.Assert.areSame('{"regex":{},"arr":[{}]}',
            Y.JSON.stringify({
                regex : /are treated as objects/,
                arr   : [ new RegExp("in array") ]
            }));
    },

    test_stringifyUndefined : function () {
        Y.Assert.areSame('{"arr":[null]}',
            Y.JSON.stringify({
                undef : undefined,
                arr   : [ undefined ]
            }));
    },

    test_stringifyDate : function () {
        // native toJSON method should be called if available
        var d = new Date(Date.UTC(1946,6,6)),
            ref = d.toJSON ? d.toJSON() : "1946-07-06T00:00:00Z";

        Y.Assert.areSame('{"dt":"'+ref+'"}', Y.JSON.stringify({dt : d}));
    }
}));

//Don't add the test if win and doc are not available
if (Y.config.win && Y.config.doc) {
    suite.add(new Y.Test.Case({
        name: "DOM based tests",
        setUp: function () {
            // `action` is not allowed via innerHTML on Win8 apps.
            // See: http://msdn.microsoft.com/en-us/library/windows/apps/hh465388.aspx

            var f = Y.Node.one(Y.config.doc.createElement("form"));

            f.set("id", "testbed");
            f.setAttribute("action", "");

            Y.one("body").append(f);

            f.setHTML(
                '<p>' +
                '<input type="text" id="empty_text">' +
                '<input type="text" id="text" value="text">' +
                '<input type="radio" id="unchecked_radio" value="unchecked">' +
                '<input type="radio" id="checked_radio" value="radio" checked="checked">' +
                '<input type="checkbox" id="unchecked_box" value="unchecked">' +
                '<input type="checkbox" id="checked_box" value="box" checked="checked">' +
                '<textarea id="empty_textarea"></textarea>' +
                '<textarea id="textarea">textarea</textarea>' +
                '<select id="select">' +
                    '<option value="unselected">Unselected</option>' +
                    '<option value="selected" selected="selected">Selected</option>' +
                '</select>' +
                '<select id="multiple_select" multiple="multiple" size="3">' +
                    '<option value="unselected">Unselected</option>' +
                    '<option value="selected" selected="selected">Selected</option>' +
                    '<option value="selected also" selected="selected">Selected also</option>' +
                '</select>' +
                '<button id="button" type="button">content; no value</button>' +
                '<button id="button_with_value" type="button" value="button value">content and value</button>' +
                '<button id="button_submit" type="submit">content; no value</button>' +
                '<button id="button_submit_with_value" type="submit" value="submit button value">content and value</button>' +
                '<input type="button" id="input_button" value="input button">' +
                '<input type="submit" id="input_submit" value="input submit">' +
                '</p>');

            // For now, setting `name` outside of innerHTML so we don't fail in Win 8 Apps.
            // TODO: Clean up based on final resolution of this: https://connect.microsoft.com/IE/feedback/details/765964/win8-app-msapphost-cannot-set-secure-valid-html-using-innerhtml-if-it-contains-form-fields-with-name-set

            Y.one("#unchecked_radio").setAttribute("name", "radio");
            Y.one("#checked_radio").setAttribute("name", "radio");
            Y.one("#unchecked_box").setAttribute("name", "box");
            Y.one("#checked_box").setAttribute("name", "box");
        },

        tearDown: function () {
            Y.one("#testbed").remove(true);
        },

        test_stringifyFormValue : function () {
            function $(id) { return document.getElementById(id); }

            var data = {
                empty_text              : $('empty_text').value,
                text                    : $('text').value,
                unchecked_radio         : $('unchecked_radio').value,
                checked_radio           : $('checked_radio').value,
                unchecked_box           : $('unchecked_box').value,
                checked_box             : $('checked_box').value,
                empty_textarea          : $('empty_textarea').value,
                textarea                : $('textarea').value,
                select                  : $('select').value,
                multiple_select         : $('multiple_select').value,
                // Buttons commented out for now because IE reports values
                // differently
                //button                  : $('button').value,
                //button_with_value       : $('button_with_value').value,
                //button_submit           : $('button_submit').value,
                //button_submit_with_value: $('button_submit_with_value').value,
                input_button            : $('input_button').value,
                input_submit            : $('input_submit').value//,
                //input_image             : $('input_image').value
            };

            Y.Assert.areSame('{'+
                '"empty_text":"",'+
                '"text":"text",'+
                '"unchecked_radio":"unchecked",'+
                '"checked_radio":"radio",'+
                '"unchecked_box":"unchecked",'+
                '"checked_box":"box",'+
                '"empty_textarea":"",'+
                '"textarea":"textarea",'+
                '"select":"selected",'+
                '"multiple_select":"selected",'+
                //'"button":"",'+
                //'"button_with_value":"button value",'+
                //'"button_submit":"",'+
                //'"button_submit_with_value":"submit button value",'+
                '"input_button":"input button",'+
                '"input_submit":"input submit"}',
                //'"input_image":"input image"}',
                Y.JSON.stringify(data));
        }
    }));
}

suite.add(new Y.Test.Case({
    name : "whitelist",

    test_emptyWhitelistArray : function () {
        Y.Assert.areSame('{}',
            Y.JSON.stringify({foo:1,bar:[1,2,3],baz:true},[]));

        Y.Assert.areSame('[1,true,null,{},["string",null,{}]]',
            Y.JSON.stringify([
                1,true,null,{
                    foo : false,
                    bar : -0.12345
                },["string",undefined,/some regex/]
            ],[]));
    },

    test_whitelistArray : function () {
        Y.Assert.areSame('{"foo":[1,2,3,{"foo":"FOO"}]}',
            Y.JSON.stringify({
                foo : [
                    1,2,3,{
                        foo : "FOO",
                        baz : true
                    }
                ],
                bar : [1,2,3],
                baz : true
            },["foo"]));

        Y.Assert.areSame('{"foo":[1,2,3,{"foo":"FOO","baz":true}],"baz":true}',
            Y.JSON.stringify({
                foo : [
                    1,2,3,{
                        foo : "FOO",
                        baz : true
                    }
                ],
                bar : [
                    1,2,3,{
                        foo : "FOO",
                        baz : true
                    }
                ],
                baz : true},["foo","baz"]));

    }

    /*
    // REMOVED for spec compatibility
    test_whitelistObject : function () {
        // (undocumented) supports an obj literal as well
        Y.Assert.areSame('{"foo":[1,2,3,{"foo":"FOO","baz":true}],"baz":true}',
            Y.JSON.stringify({
                foo : [
                    1,2,3,{
                        foo : "FOO",
                        baz : true
                    }
                ],
                bar : [
                    1,2,3,{
                        foo : "FOO",
                        baz : true
                    }
                ],
                baz : true
            }, {foo : true, baz : false})); // values ignored
    }
    */

}));

suite.add(new Y.Test.Case({
    name : "formatting",

    test_falseyIndents : function () {
        Y.Assert.areSame('{"foo0":[2,{"bar":[4,{"baz":[6,{"deep enough":7}]}]}]}',
            Y.JSON.stringify({
                foo0 : [ 2, {
                    bar : [ 4, {
                        baz : [ 6, {
                            "deep enough" : 7
                        }]
                    }]
                }]
            },null,0));

        /* Commented out because FF3.5 has infinite loop bug for neg indents
         * Fixed in FF for next version.
        Y.Assert.areSame('{"foo-4":[2,{"bar":[4,{"baz":[6,{"deep enough":7}]}]}]}',
            Y.JSON.stringify({
                "foo-4" : [ 2, {
                    bar : [ 4, {
                        baz : [ 6, {
                            "deep enough" : 7
                        }]
                    }]
                }]
            },null,-4));
        */

        Y.Assert.areSame('{"foo_false":[2,{"bar":[4,{"baz":[6,{"deep enough":7}]}]}]}',
            Y.JSON.stringify({
                foo_false : [ 2, {
                    bar : [ 4, {
                        baz : [ 6, {
                            "deep enough" : 7
                        }]
                    }]
                }]
            },null,false));

        Y.Assert.areSame('{"foo_empty":[2,{"bar":[4,{"baz":[6,{"deep enough":7}]}]}]}',
            Y.JSON.stringify({
                foo_empty : [ 2, {
                    bar : [ 4, {
                        baz : [ 6, {
                            "deep enough" : 7
                        }]
                    }]
                }]
            },null,""));

    },

    test_indentNumber : function () {
        Y.Assert.areSame("{\n" +
"  \"foo\": [\n" +
"    2,\n" +
"    {\n" +
"      \"bar\": [\n" +
"        4,\n" +
"        {\n" +
"          \"baz\": [\n" +
"            6,\n" +
"            {\n" +
"              \"deep enough\": 7\n" +
"            }\n" +
"          ]\n" +
"        }\n" +
"      ]\n" +
"    }\n" +
"  ]\n" +
"}",
            Y.JSON.stringify({
                foo : [ 2, {
                    bar : [ 4, {
                        baz : [ 6, {
                            "deep enough" : 7
                        }]
                    }]
                }]
            },null,2));
    },
    test_indentString : function () {
        Y.Assert.areSame("{\n" +
"Xo\"foo\": [\n" +
"XoXo2,\n" +
"XoXo{\n" +
"XoXoXo\"bar\": [\n" +
"XoXoXoXo4,\n" +
"XoXoXoXo{\n" +
"XoXoXoXoXo\"baz\": [\n" +
"XoXoXoXoXoXo6,\n" +
"XoXoXoXoXoXo{\n" +
"XoXoXoXoXoXoXo\"deep enough\": 7\n" +
"XoXoXoXoXoXo}\n" +
"XoXoXoXoXo]\n" +
"XoXoXoXo}\n" +
"XoXoXo]\n" +
"XoXo}\n" +
"Xo]\n" +
"}",
            Y.JSON.stringify({
                foo : [ 2, {
                    bar : [ 4, {
                        baz : [ 6, {
                            "deep enough" : 7
                        }]
                    }]
                }]
            },null,"Xo"));
    }
}));

suite.add(new Y.Test.Case({
    name : "toJSON",

    test_toJSON_on_object: function () {
        Y.Assert.areSame('"toJSON"',
            Y.JSON.stringify({ toJSON: function () { return "toJSON"; } }));

        // TODO: complex object with toJSON
    },

    test_toJSON_on_proto: function () {
        function A() {}
        A.prototype.toJSON = function () { return "A"; };
        
        function B() {}
        B.prototype = new A();

        function C() {
            this.x = "X";
            this.y = "Y";
            this.z = "Z";
        }
        C.prototype = new B();

        Y.Assert.areSame('"A"', Y.JSON.stringify(new C()));
    }
}));

suite.add(new Y.Test.Case({
    name : "replacer",

    test_replacer : function () {
        // replacer applies to even simple value stringifications
        Y.Assert.areSame("20",
            Y.JSON.stringify(10,function (k,v) {
                return typeof(v) === 'number' ? v * 2 : v;
            }));

        // replacer is applied to every nested property as well.
        // can modify the host object en route
        // executes from the context of the key:value container
        Y.Assert.areSame('{"num":2,"alpha":"ABC","obj":{"nested_num":100,"alpha":"abc"},"arr":[2,null,4]}',
            Y.JSON.stringify({
                    num: 1,
                    alpha: "abc",
                    ignore: "me",
                    change: "to a function",
                    toUpper: true,
                    obj: {
                        nested_num: 50,
                        undef: undefined,
                        alpha: "abc"
                    },
                    arr: [1, 7, 2]
                },
                function (k,v) {
                    var t = typeof v;

                    if (k === 'change') {
                        // this property should then be ignored
                        return function () {};
                    } else if (k === 'ignore') {
                        // this property should then be ignored
                        return undefined;
                    } else if (t === 'number') {
                        // undefined returned to arrays should become null
                        return v % 7 ? v * 2 : undefined;

                    // this refers to the object containing the key:value
                    } else if (t === 'string' && (this.toUpper)) {
                        // modify the object during stringification
                        delete this.toUpper;
                        return v.toUpperCase();
                    } else {
                        return v;
                    }
                }));

        // replacer works in conjunction with indent
        Y.Assert.areSame("{\n_\"num\": 2,\n_\"alpha\": \"ABC\",\n_\"obj\": {\n__\"nested_num\": 100,\n__\"alpha\": \"abc\"\n_},\n_\"arr\": [\n__2,\n__null,\n__4\n_]\n}",
            Y.JSON.stringify({
                    num: 1,
                    alpha: "abc",
                    ignore: "me",
                    change: "to a function",
                    toUpper: true,
                    obj: {
                        nested_num: 50,
                        undef: undefined,
                        alpha: "abc"
                    },
                    arr: [1, 7, 2]
                },
                function (k,v) {
                    var t = typeof v;

                    if (k === 'change') {
                        // this property should then be ignored
                        return function () {};
                    } else if (k === 'ignore') {
                        // this property should then be ignored
                        return undefined;
                    } else if (t === 'number') {
                        // undefined returned to arrays should become null
                        return v % 7 ? v * 2 : undefined;

                    // this refers to the object containing the key:value
                    } else if (t === 'string' && (this.toUpper)) {
                        // modify the object during stringification
                        delete this.toUpper;
                        return v.toUpperCase();
                    } else {
                        return v;
                    }
                },'_'));
    },

    test_replacer_after_toJSON : function () {
        Y.Assert.areSame('{"a":"ABC"}',
            Y.JSON.stringify({a:{ toJSON: function () { return "abc"; } } },
                function (k,v) {
                    return typeof v === 'string' ? v.toUpperCase() : v;
                }));

        // Date instances in ES5 have toJSON that outputs toISOString, which
        // means the replacer should never receive a Date instance
        var str = Y.JSON.stringify([new Date()], function (k,v) {
            return (v instanceof Date) ? "X" : v;
        });
        Y.Assert.areSame(-1, str.indexOf("X"), "Date incorrectly received by replacer");
    },

    test_replacer_returning_Date : function () {
        var d = new Date(),
            ref = Y.JSON.stringify(d);

        Y.Assert.areSame('{"dt":'+ref+',"date_from_replacer":{}}',
            Y.JSON.stringify({ dt: d, date_from_replacer: 1 },
                function (k,v) {
                    return typeof v === 'number' ? d : v;
                }));
    }
}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['json-stringify-shim', 'test']});


YUI.add('json-tests', function(Y){}, '@VERSION@' ,{use:['json-parse-tests', 'json-stringify-tests']});

