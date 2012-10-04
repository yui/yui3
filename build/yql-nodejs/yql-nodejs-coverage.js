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
_yuitest_coverage["build/yql-nodejs/yql-nodejs.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/yql-nodejs/yql-nodejs.js",
    code: []
};
_yuitest_coverage["build/yql-nodejs/yql-nodejs.js"].code=["YUI.add('yql-nodejs', function (Y, NAME) {","","/**","* NodeJS plugin for YQL to use native request to make requests instead of JSONP.","* Not required by the user, it's conditionally loaded and should \"just work\".","* @module yql","* @submodule yql-nodejs","*/","","var request = require('request');","","//Over writes Y.YQLRequest._send to use request instead of JSONP","Y.YQLRequest.prototype._send = function (url, o) {","    //No need to \"call\" this, YQL handles the context","    request(url, {","        method: 'GET',","        timeout: o.timeout || (30 * 1000)","    }, function(err, res) {","        if (err) {","            //The signature that YQL requires","            o.on.success({","                error: err","            });","        } else {","            o.on.success(JSON.parse(res.body));","        }","    });","};","","","}, '@VERSION@');"];
_yuitest_coverage["build/yql-nodejs/yql-nodejs.js"].lines = {"1":0,"10":0,"13":0,"15":0,"19":0,"21":0,"25":0};
_yuitest_coverage["build/yql-nodejs/yql-nodejs.js"].functions = {"(anonymous 2):18":0,"_send:13":0,"(anonymous 1):1":0};
_yuitest_coverage["build/yql-nodejs/yql-nodejs.js"].coveredLines = 7;
_yuitest_coverage["build/yql-nodejs/yql-nodejs.js"].coveredFunctions = 3;
_yuitest_coverline("build/yql-nodejs/yql-nodejs.js", 1);
YUI.add('yql-nodejs', function (Y, NAME) {

/**
* NodeJS plugin for YQL to use native request to make requests instead of JSONP.
* Not required by the user, it's conditionally loaded and should "just work".
* @module yql
* @submodule yql-nodejs
*/

_yuitest_coverfunc("build/yql-nodejs/yql-nodejs.js", "(anonymous 1)", 1);
_yuitest_coverline("build/yql-nodejs/yql-nodejs.js", 10);
var request = require('request');

//Over writes Y.YQLRequest._send to use request instead of JSONP
_yuitest_coverline("build/yql-nodejs/yql-nodejs.js", 13);
Y.YQLRequest.prototype._send = function (url, o) {
    //No need to "call" this, YQL handles the context
    _yuitest_coverfunc("build/yql-nodejs/yql-nodejs.js", "_send", 13);
_yuitest_coverline("build/yql-nodejs/yql-nodejs.js", 15);
request(url, {
        method: 'GET',
        timeout: o.timeout || (30 * 1000)
    }, function(err, res) {
        _yuitest_coverfunc("build/yql-nodejs/yql-nodejs.js", "(anonymous 2)", 18);
_yuitest_coverline("build/yql-nodejs/yql-nodejs.js", 19);
if (err) {
            //The signature that YQL requires
            _yuitest_coverline("build/yql-nodejs/yql-nodejs.js", 21);
o.on.success({
                error: err
            });
        } else {
            _yuitest_coverline("build/yql-nodejs/yql-nodejs.js", 25);
o.on.success(JSON.parse(res.body));
        }
    });
};


}, '@VERSION@');
