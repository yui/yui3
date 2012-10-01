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
_yuitest_coverage["build/yql-winjs/yql-winjs.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/yql-winjs/yql-winjs.js",
    code: []
};
_yuitest_coverage["build/yql-winjs/yql-winjs.js"].code=["YUI.add('yql-winjs', function (Y, NAME) {","","/**","* WinJS plugin for YQL to use XHR to make requests","* @module yql","* @submodule yql-winjs","*/","","//Over writes Y.YQLRequest._send to use IO instead of JSONP","Y.YQLRequest.prototype._send = function (url, o) {","    Y.io(url, {","        on: {","            complete: function (id, e) {","                o.on.success(Y.JSON.parse(e.responseText));","            }","        }","    });","};","","","}, '@VERSION@', {\"requires\": [\"io-base\", \"json-parse\"]});"];
_yuitest_coverage["build/yql-winjs/yql-winjs.js"].lines = {"1":0,"10":0,"11":0,"14":0};
_yuitest_coverage["build/yql-winjs/yql-winjs.js"].functions = {"complete:13":0,"_send:10":0,"(anonymous 1):1":0};
_yuitest_coverage["build/yql-winjs/yql-winjs.js"].coveredLines = 4;
_yuitest_coverage["build/yql-winjs/yql-winjs.js"].coveredFunctions = 3;
_yuitest_coverline("build/yql-winjs/yql-winjs.js", 1);
YUI.add('yql-winjs', function (Y, NAME) {

/**
* WinJS plugin for YQL to use XHR to make requests
* @module yql
* @submodule yql-winjs
*/

//Over writes Y.YQLRequest._send to use IO instead of JSONP
_yuitest_coverfunc("build/yql-winjs/yql-winjs.js", "(anonymous 1)", 1);
_yuitest_coverline("build/yql-winjs/yql-winjs.js", 10);
Y.YQLRequest.prototype._send = function (url, o) {
    _yuitest_coverfunc("build/yql-winjs/yql-winjs.js", "_send", 10);
_yuitest_coverline("build/yql-winjs/yql-winjs.js", 11);
Y.io(url, {
        on: {
            complete: function (id, e) {
                _yuitest_coverfunc("build/yql-winjs/yql-winjs.js", "complete", 13);
_yuitest_coverline("build/yql-winjs/yql-winjs.js", 14);
o.on.success(Y.JSON.parse(e.responseText));
            }
        }
    });
};


}, '@VERSION@', {"requires": ["io-base", "json-parse"]});
