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
_yuitest_coverage["graphics-vml-default"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "graphics-vml-default",
    code: []
};
_yuitest_coverage["graphics-vml-default"].code=["YUI.add('graphics-vml-default', function (Y, NAME) {","","Y.Graphic = Y.VMLGraphic;","Y.Shape = Y.VMLShape;","Y.Circle = Y.VMLCircle;","Y.Rect = Y.VMLRect;","Y.Ellipse = Y.VMLEllipse;","Y.Path = Y.VMLPath;","Y.Drawing = Y.VMLDrawing;","","","}, '@VERSION@', {});"];
_yuitest_coverage["graphics-vml-default"].lines = {"1":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0};
_yuitest_coverage["graphics-vml-default"].functions = {"(anonymous 1):1":0};
_yuitest_coverage["graphics-vml-default"].coveredLines = 8;
_yuitest_coverage["graphics-vml-default"].coveredFunctions = 1;
_yuitest_coverline("graphics-vml-default", 1);
YUI.add('graphics-vml-default', function (Y, NAME) {

_yuitest_coverfunc("graphics-vml-default", "(anonymous 1)", 1);
_yuitest_coverline("graphics-vml-default", 3);
Y.Graphic = Y.VMLGraphic;
_yuitest_coverline("graphics-vml-default", 4);
Y.Shape = Y.VMLShape;
_yuitest_coverline("graphics-vml-default", 5);
Y.Circle = Y.VMLCircle;
_yuitest_coverline("graphics-vml-default", 6);
Y.Rect = Y.VMLRect;
_yuitest_coverline("graphics-vml-default", 7);
Y.Ellipse = Y.VMLEllipse;
_yuitest_coverline("graphics-vml-default", 8);
Y.Path = Y.VMLPath;
_yuitest_coverline("graphics-vml-default", 9);
Y.Drawing = Y.VMLDrawing;


}, '@VERSION@', {});
