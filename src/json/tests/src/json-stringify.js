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

    setUp: function () {
        Y.one("body").append('<form id="testbed" action="">' +
            '<h3>Form used for field value extraction, stringification</h3>' +
            '<input type="text" id="empty_text">' +
            '<input type="text" id="text" value="text">' +
            '<input type="radio" name="radio" id="unchecked_radio" value="unchecked">' +
            '<input type="radio" name="radio" id="checked_radio" value="radio" checked="checked">' +
            '<input type="checkbox" name="box" id="unchecked_box" value="unchecked">' +
            '<input type="checkbox" name="box" id="checked_box" value="box" checked="checked">' +
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
            '<!--input type="image" id="input_image" src="404.png" value="input image"-->' +
        '</form>');
    },

    tearDown: function () {
        Y.one("#testbed").remove(true);
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
