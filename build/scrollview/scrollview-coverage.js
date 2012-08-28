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
_yuitest_coverage["scrollview"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "scrollview",
    code: []
};
_yuitest_coverage["scrollview"].code=["YUI.add('scrollview', function (Y, NAME) {","","/**"," * <p>"," * The scrollview module does not add any new classes. It simply plugs the ScrollViewScrollbars plugin into the "," * base ScrollView class implementation provided by the scrollview-base module, so that all scrollview instances "," * have scrollbars enabled."," * </p>"," *"," * <ul>"," *     <li><a href=\"../classes/ScrollView.html\">ScrollView API documentation</a></li>"," *     <li><a href=\"scrollview-base.html\">scrollview-base Module documentation</a></li>"," * </ul>"," *"," * @module scrollview"," */","","Y.Base.plug(Y.ScrollView, Y.Plugin.ScrollViewScrollbars);","","","}, '@VERSION@', {\"requires\": [\"scrollview-base\", \"scrollview-scrollbars\"]});"];
_yuitest_coverage["scrollview"].lines = {"1":0,"18":0};
_yuitest_coverage["scrollview"].functions = {"(anonymous 1):1":0};
_yuitest_coverage["scrollview"].coveredLines = 2;
_yuitest_coverage["scrollview"].coveredFunctions = 1;
_yuitest_coverline("scrollview", 1);
YUI.add('scrollview', function (Y, NAME) {

/**
 * <p>
 * The scrollview module does not add any new classes. It simply plugs the ScrollViewScrollbars plugin into the 
 * base ScrollView class implementation provided by the scrollview-base module, so that all scrollview instances 
 * have scrollbars enabled.
 * </p>
 *
 * <ul>
 *     <li><a href="../classes/ScrollView.html">ScrollView API documentation</a></li>
 *     <li><a href="scrollview-base.html">scrollview-base Module documentation</a></li>
 * </ul>
 *
 * @module scrollview
 */

_yuitest_coverfunc("scrollview", "(anonymous 1)", 1);
_yuitest_coverline("scrollview", 18);
Y.Base.plug(Y.ScrollView, Y.Plugin.ScrollViewScrollbars);


}, '@VERSION@', {"requires": ["scrollview-base", "scrollview-scrollbars"]});
