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
_yuitest_coverage["build/mod-A/mod-A.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/mod-A/mod-A.js",
    code: []
};
_yuitest_coverage["build/mod-A/mod-A.js"].code=["YUI.add('mod-A', function (Y, NAME) {","","","","}, '@VERSION@', {\"requires\": [\"yui-base\"]});"];
_yuitest_coverage["build/mod-A/mod-A.js"].lines = {"1":0};
_yuitest_coverage["build/mod-A/mod-A.js"].functions = {};
_yuitest_coverage["build/mod-A/mod-A.js"].coveredLines = 1;
_yuitest_coverage["build/mod-A/mod-A.js"].coveredFunctions = 0;
_yuitest_coverline("build/mod-A/mod-A.js", 1);
YUI.add('mod-A', function (Y, NAME) {



}, '@VERSION@', {"requires": ["yui-base"]});
