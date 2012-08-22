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
_yuitest_coverage["simpleyui"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "simpleyui",
    code: []
};
_yuitest_coverage["simpleyui"].code=["YUI.add('simpleyui', function (Y, NAME) {","","// empty","","","","}, '@VERSION@', {\"use\": [\"yui\", \"oop\", \"dom\", \"event-custom-base\", \"event-base\", \"pluginhost\", \"node\", \"event-delegate\", \"io-base\", \"json-parse\", \"transition\", \"selector-css3\", \"dom-style-ie\", \"querystring-stringify-simple\"]});"];
_yuitest_coverage["simpleyui"].lines = {"1":0};
_yuitest_coverage["simpleyui"].functions = {};
_yuitest_coverage["simpleyui"].coveredLines = 1;
_yuitest_coverage["simpleyui"].coveredFunctions = 0;
_yuitest_coverline("simpleyui", 1);
YUI.add('simpleyui', function (Y, NAME) {

// empty



}, '@VERSION@', {"use": ["yui", "oop", "dom", "event-custom-base", "event-base", "pluginhost", "node", "event-delegate", "io-base", "json-parse", "transition", "selector-css3", "dom-style-ie", "querystring-stringify-simple"]});
