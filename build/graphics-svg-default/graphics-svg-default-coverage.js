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
_yuitest_coverage["graphics-svg-default"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "graphics-svg-default",
    code: []
};
_yuitest_coverage["graphics-svg-default"].code=["YUI.add('graphics-svg-default', function (Y, NAME) {","","Y.Graphic = Y.SVGGraphic;","Y.Shape = Y.SVGShape;","Y.Circle = Y.SVGCircle;","Y.Rect = Y.SVGRect;","Y.Ellipse = Y.SVGEllipse;","Y.Path = Y.SVGPath;","Y.Drawing = Y.SVGDrawing;","","","}, '@VERSION@', {});"];
_yuitest_coverage["graphics-svg-default"].lines = {"1":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0};
_yuitest_coverage["graphics-svg-default"].functions = {"(anonymous 1):1":0};
_yuitest_coverage["graphics-svg-default"].coveredLines = 8;
_yuitest_coverage["graphics-svg-default"].coveredFunctions = 1;
_yuitest_coverline("graphics-svg-default", 1);
YUI.add('graphics-svg-default', function (Y, NAME) {

_yuitest_coverfunc("graphics-svg-default", "(anonymous 1)", 1);
_yuitest_coverline("graphics-svg-default", 3);
Y.Graphic = Y.SVGGraphic;
_yuitest_coverline("graphics-svg-default", 4);
Y.Shape = Y.SVGShape;
_yuitest_coverline("graphics-svg-default", 5);
Y.Circle = Y.SVGCircle;
_yuitest_coverline("graphics-svg-default", 6);
Y.Rect = Y.SVGRect;
_yuitest_coverline("graphics-svg-default", 7);
Y.Ellipse = Y.SVGEllipse;
_yuitest_coverline("graphics-svg-default", 8);
Y.Path = Y.SVGPath;
_yuitest_coverline("graphics-svg-default", 9);
Y.Drawing = Y.SVGDrawing;


}, '@VERSION@', {});
