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
_yuitest_coverage["graphics-canvas-default"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "graphics-canvas-default",
    code: []
};
_yuitest_coverage["graphics-canvas-default"].code=["YUI.add('graphics-canvas-default', function (Y, NAME) {","","Y.Graphic = Y.CanvasGraphic;","Y.Shape = Y.CanvasShape;","Y.Circle = Y.CanvasCircle;","Y.Rect = Y.CanvasRect;","Y.Ellipse = Y.CanvasEllipse;","Y.Path = Y.CanvasPath;","Y.Drawing = Y.CanvasDrawing;","","","}, '@VERSION@', {});"];
_yuitest_coverage["graphics-canvas-default"].lines = {"1":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0};
_yuitest_coverage["graphics-canvas-default"].functions = {"(anonymous 1):1":0};
_yuitest_coverage["graphics-canvas-default"].coveredLines = 8;
_yuitest_coverage["graphics-canvas-default"].coveredFunctions = 1;
_yuitest_coverline("graphics-canvas-default", 1);
YUI.add('graphics-canvas-default', function (Y, NAME) {

_yuitest_coverfunc("graphics-canvas-default", "(anonymous 1)", 1);
_yuitest_coverline("graphics-canvas-default", 3);
Y.Graphic = Y.CanvasGraphic;
_yuitest_coverline("graphics-canvas-default", 4);
Y.Shape = Y.CanvasShape;
_yuitest_coverline("graphics-canvas-default", 5);
Y.Circle = Y.CanvasCircle;
_yuitest_coverline("graphics-canvas-default", 6);
Y.Rect = Y.CanvasRect;
_yuitest_coverline("graphics-canvas-default", 7);
Y.Ellipse = Y.CanvasEllipse;
_yuitest_coverline("graphics-canvas-default", 8);
Y.Path = Y.CanvasPath;
_yuitest_coverline("graphics-canvas-default", 9);
Y.Drawing = Y.CanvasDrawing;


}, '@VERSION@', {});
