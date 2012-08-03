if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["/home/yui/src/yui3/src/test-console/build_tmp/test-console.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/home/yui/src/yui3/src/test-console/build_tmp/test-console.js",
    code: []
};
_yuitest_coverage["/home/yui/src/yui3/src/test-console/build_tmp/test-console.js"].code=["YUI.add('test-console', function(Y) {","","/**","Provides a specialized log console widget that's pre-configured to display YUI","Test output with no extra configuration.","","@example","","    <div id=\"log\" class=\"yui3-skin-sam\"></div>","","    <script>","    YUI().use('test-console', function (Y) {","        // ... set up your test cases here ...","","        // Render the console inside the #log div, then run the tests.","        new Y.Test.Console().render('#log');","        Y.Test.Runner.run();","    });","    </script>","","@module test-console","@namespace Test","@class Console","@extends Console","@constructor","","@param {Object} [config] Config attributes.","    @param {Object} [config.filters] Category filter configuration.","","@since 3.5.0","**/","","function TestConsole() {","    TestConsole.superclass.constructor.apply(this, arguments);","}","","Y.namespace('Test').Console = Y.extend(TestConsole, Y.Console, {","    initializer: function (config) {","        this.on('entry', this._onEntry);","","        this.plug(Y.Plugin.ConsoleFilters, {","            category: Y.merge({","                info  : true,","                pass  : false,","                fail  : true,","                status: false","            }, (config && config.filters) || {}),","","            defaultVisibility: false,","","            source: {","                TestRunner: true","            }","        });","    },","","    // -- Protected Event Handlers ---------------------------------------------","    _onEntry: function (e) {","        var msg = e.message;","","        if (msg.category === 'info'","                && /\\s(?:case|suite)\\s|yuitests\\d+|began/.test(msg.message)) {","            msg.category = 'status';","        } else if (msg.category === 'fail') {","            this.printBuffer();","        }","    }","}, {","    NAME: 'testConsole',","","    ATTRS: {","        entryTemplate: {","            value:","                '<div class=\"{entry_class} {cat_class} {src_class}\">' +","                    '<div class=\"{entry_content_class}\">{message}</div>' +","                '</div>'","        },","","        height: {","            value: '350px'","        },","","        newestOnTop: {","            value: false","        },","","        style: {","            value: 'block'","        },","","        width: {","            value: Y.UA.ie && Y.UA.ie < 9 ? '100%' : 'inherit'","        }","    }","});","","","}, '@VERSION@' ,{requires:['console-filters', 'test'], skinnable:true});"];
_yuitest_coverage["/home/yui/src/yui3/src/test-console/build_tmp/test-console.js"].lines = {"1":0,"33":0,"34":0,"37":0,"39":0,"41":0,"59":0,"61":0,"63":0,"64":0,"65":0};
_yuitest_coverage["/home/yui/src/yui3/src/test-console/build_tmp/test-console.js"].functions = {"TestConsole:33":0,"initializer:38":0,"_onEntry:58":0,"(anonymous 1):1":0};
_yuitest_coverage["/home/yui/src/yui3/src/test-console/build_tmp/test-console.js"].coveredLines = 11;
_yuitest_coverage["/home/yui/src/yui3/src/test-console/build_tmp/test-console.js"].coveredFunctions = 4;
_yuitest_coverline("/home/yui/src/yui3/src/test-console/build_tmp/test-console.js", 1);
YUI.add('test-console', function(Y) {

/**
Provides a specialized log console widget that's pre-configured to display YUI
Test output with no extra configuration.

@example

    <div id="log" class="yui3-skin-sam"></div>

    <script>
    YUI().use('test-console', function (Y) {
        // ... set up your test cases here ...

        // Render the console inside the #log div, then run the tests.
        new Y.Test.Console().render('#log');
        Y.Test.Runner.run();
    });
    </script>

@module test-console
@namespace Test
@class Console
@extends Console
@constructor

@param {Object} [config] Config attributes.
    @param {Object} [config.filters] Category filter configuration.

@since 3.5.0
**/

_yuitest_coverfunc("/home/yui/src/yui3/src/test-console/build_tmp/test-console.js", "(anonymous 1)", 1);
_yuitest_coverline("/home/yui/src/yui3/src/test-console/build_tmp/test-console.js", 33);
function TestConsole() {
    _yuitest_coverfunc("/home/yui/src/yui3/src/test-console/build_tmp/test-console.js", "TestConsole", 33);
_yuitest_coverline("/home/yui/src/yui3/src/test-console/build_tmp/test-console.js", 34);
TestConsole.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("/home/yui/src/yui3/src/test-console/build_tmp/test-console.js", 37);
Y.namespace('Test').Console = Y.extend(TestConsole, Y.Console, {
    initializer: function (config) {
        _yuitest_coverfunc("/home/yui/src/yui3/src/test-console/build_tmp/test-console.js", "initializer", 38);
_yuitest_coverline("/home/yui/src/yui3/src/test-console/build_tmp/test-console.js", 39);
this.on('entry', this._onEntry);

        _yuitest_coverline("/home/yui/src/yui3/src/test-console/build_tmp/test-console.js", 41);
this.plug(Y.Plugin.ConsoleFilters, {
            category: Y.merge({
                info  : true,
                pass  : false,
                fail  : true,
                status: false
            }, (config && config.filters) || {}),

            defaultVisibility: false,

            source: {
                TestRunner: true
            }
        });
    },

    // -- Protected Event Handlers ---------------------------------------------
    _onEntry: function (e) {
        _yuitest_coverfunc("/home/yui/src/yui3/src/test-console/build_tmp/test-console.js", "_onEntry", 58);
_yuitest_coverline("/home/yui/src/yui3/src/test-console/build_tmp/test-console.js", 59);
var msg = e.message;

        _yuitest_coverline("/home/yui/src/yui3/src/test-console/build_tmp/test-console.js", 61);
if (msg.category === 'info'
                && /\s(?:case|suite)\s|yuitests\d+|began/.test(msg.message)) {
            _yuitest_coverline("/home/yui/src/yui3/src/test-console/build_tmp/test-console.js", 63);
msg.category = 'status';
        } else {_yuitest_coverline("/home/yui/src/yui3/src/test-console/build_tmp/test-console.js", 64);
if (msg.category === 'fail') {
            _yuitest_coverline("/home/yui/src/yui3/src/test-console/build_tmp/test-console.js", 65);
this.printBuffer();
        }}
    }
}, {
    NAME: 'testConsole',

    ATTRS: {
        entryTemplate: {
            value:
                '<div class="{entry_class} {cat_class} {src_class}">' +
                    '<div class="{entry_content_class}">{message}</div>' +
                '</div>'
        },

        height: {
            value: '350px'
        },

        newestOnTop: {
            value: false
        },

        style: {
            value: 'block'
        },

        width: {
            value: Y.UA.ie && Y.UA.ie < 9 ? '100%' : 'inherit'
        }
    }
});


}, '@VERSION@' ,{requires:['console-filters', 'test'], skinnable:true});
