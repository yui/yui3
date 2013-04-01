YUI.add('shape-path-tests', function(Y) {

var suite = new Y.Test.Suite("Graphics: Path"),
strokeAndFill = {
    stroke: {
        weight: 1,
        color: "#000"
    },
    fill: {
        color: "#9aa"
    }
},

strokeNoFill = {
    stroke: {
        weight: 1,
        color: "#000"
    },
    fill: null
},

fillNoStroke = {
    fill: {
        color: "#9aa"
    },
    stroke: null
},

pathData = "M5, 0l100, 215 c 150 60 150 60 300 0z",

pathData2 = "M100,250 q150,-150 300,0z",

PathTestTemplate = function(cfg, globalCfg) {
    var i;
    PathTestTemplate.superclass.constructor.apply(this);
    this.attrCfg = cfg;
    cfg.render = "#graphiccontainer";
    for(i in globalCfg)
    {
        if(globalCfg.hasOwnProperty(i))
        {
            this[i] = globalCfg[i];
        }
    }
};

Y.extend(PathTestTemplate, Y.Test.Case, {
    setUp: function () {
        Y.one("body").append('<div id="testbed"></div>');
        Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="graphiccontainer"></div>');
        this.graphic = new Y.Graphic(this.attrCfg);
        if(!this.pathAttrs)
        {
            this.pathAttrs = {};
        }
        this.pathAttrs.type = "path";
        this.path = this.graphic.addShape(this.pathAttrs);
    },
    
    tearDown: function () {
        this.graphic.destroy();
        Y.one("#testbed").remove(true);
    }
});


Y.PathTestTemplate = PathTestTemplate;


var drawRectTest = function(name, attrs) 
{
    return new Y.PathTestTemplate({}, {
        pathAttrs: attrs,

        testDefault: function()
        {
            var w = 200,
                h = 100,
                x = 0,
                y = 0,
                strokeWidth = this.stroke ? this.stroke.weight : 0;
                mypath = this.path;
            mypath.clear();
            mypath.drawRect(x, y, w, h);
            mypath.end();
            Y.Assert.areEqual(w, mypath.get("width"), "The width of the path should be " + w + ".");
            Y.Assert.areEqual(h, mypath.get("height"), "The height of the path should be " + h + ".");
        }
    });
},

drawEllipseTest = function(name, attrs) 
{
    return new Y.PathTestTemplate({}, {
        pathAttrs: attrs,

        testDefault: function()
        {
            var w = 200,
                h = 100,
                x = 0,
                y = 0,
                strokeWidth = this.stroke ? this.stroke.weight : 0;
                mypath = this.path;
            mypath.clear();
            mypath.drawEllipse(x, y, w, h);
            mypath.end();
            Y.Assert.areEqual(w, mypath.get("width"), "The width of the path should be " + w + ".");
            Y.Assert.areEqual(h, mypath.get("height"), "The height of the path should be " + h + ".");
        }
    });
},

drawCircleTest = function(name, attrs) 
{
    return new Y.PathTestTemplate({}, {
        pathAttrs: attrs,

        testDefault: function()
        {
            var w = 100,
                h = 100,
                radius = 50,
                x = 0,
                y = 0,
                strokeWidth = this.stroke ? this.stroke.weight : 0;
                mypath = this.path;
            mypath.clear();
            mypath.drawCircle(x, y, radius);
            mypath.end();
            Y.Assert.areEqual(w, mypath.get("width"), "The width of the path should be " + w + ".");
            Y.Assert.areEqual(h, mypath.get("height"), "The height of the path should be " + h + ".");
        }
    });
},

drawRoundRectTest = function(name, attrs) 
{
    return new Y.PathTestTemplate({}, {
        pathAttrs: attrs,

        testDefault: function()
        {
            var w = 200,
                h = 100,
                x = 0,
                y = 0,
                ew = 4,
                eh = 4,
                strokeWidth = this.stroke ? this.stroke.weight : 0;
                mypath = this.path;
            mypath.clear();
            mypath.drawRoundRect(x, y, w, h, ew, eh);
            mypath.end();
            Y.Assert.areEqual(w, Math.round(mypath.get("width")), "The width of the path should be " + w + ".");
            Y.Assert.areEqual(h, Math.round(mypath.get("height")), "The height of the path should be " + h + ".");
        }
    });
},

drawDiamondTest = function(name, attrs) 
{
    return new Y.PathTestTemplate({}, {
        pathAttrs: attrs,

        testDefault: function()
        {
            var w = 200,
                h = 250,
                x = 0,
                y = 0,
                strokeWidth = this.stroke ? this.stroke.weight : 0;
                mypath = this.path;
            mypath.clear();
            mypath.drawDiamond(x, y, w, h);
            mypath.end();
            Y.Assert.areEqual(w, mypath.get("width"), "The width of the path should be " + w + ".");
            Y.Assert.areEqual(h, mypath.get("height"), "The height of the path should be " + h + ".");
        }
    });
},


drawQuadraticCurvesTest = function(name, attrs) 
{
    return new Y.PathTestTemplate({}, {
        pathAttrs: attrs,

        testDefault: function()
        {
            var w = 100,
                h = 100,
                x = 0,
                y = 0,
                strokeWidth = this.stroke ? this.stroke.weight : 0;
                mypath = this.path;
            mypath.clear();
            mypath.moveTo(w/2, 0)
            mypath.quadraticCurveTo(w, 0, w, h/2);
            mypath.quadraticCurveTo(w, h, w/2, h);
            mypath.quadraticCurveTo(0, h, 0, h/2);
            mypath.quadraticCurveTo(0, 0, w/2, 0);
            mypath.end();
            Y.Assert.areEqual(w, mypath.get("width"), "The width of the path should be " + w + ".");
            Y.Assert.areEqual(h, mypath.get("height"), "The height of the path should be " + h + ".");
        }
    });
},

drawCubicCurvesTest = function(name, attrs) 
{
    return new Y.PathTestTemplate({}, {
        pathAttrs: attrs,

        testDefault: function()
        {
            var w = 100,
                h = 100,
                x = 0,
                y = 0,
                strokeWidth = this.stroke ? this.stroke.weight : 0;
                mypath = this.path;
            mypath.clear();
            mypath.moveTo(w/2, 0)
            mypath.moveTo(50, 0)
            mypath.curveTo(83.5, 0, 100.5, 17, 100, 50);
            mypath.curveTo(100, 83.5, 83, 100.5, 50, 100);
            mypath.curveTo(16.5, 100, -0.5, 83, 0, 50);
            mypath.curveTo(0, 16.5, 17, -0.5, 50, 0);
            mypath.end();
            Y.Assert.areEqual(w, mypath.get("width"), "The width of the path should be " + w + ".");
            Y.Assert.areEqual(h, mypath.get("height"), "The height of the path should be " + h + ".");
        }
    });
},

drawWedgeTest = function(name, attrs) 
{
    return new Y.PathTestTemplate({}, {
        pathAttrs: attrs,

        testDefault: function()
        {
            var radius = 200,
                circum = 400,
                arc = 90,
                x = 200,
                y = 200,
                strokeWidth = this.stroke ? this.stroke.weight : 0;
                mypath = this.path;
            mypath.clear();
            mypath.drawWedge(x, y, 0, arc, radius);
            mypath.end();
            Y.Assert.areEqual(circum, mypath.get("width"), "The width of the path should be " + circum + ".");
            Y.Assert.areEqual(circum, mypath.get("height"), "The height of the path should be " + circum + ".");
        }
    });
},

drawMultipleRectsTest = function(name, attrs) 
{
    return new Y.PathTestTemplate({}, {
        pathAttrs: attrs,

        testDefault: function()
        {
            var w = 30,
                h = 20,
                x = -40,
                y = -30,
                i = 0,
                len = 4,
                strokeWidth = this.stroke ? this.stroke.weight : 0;
                mypath = this.path;
            mypath.clear();
            for(; i < len; ++i)
            {
                x += 40;
                y += 30;
                mypath.drawRect(x, y, w, h);
                mypath.closePath();
            }
            mypath.end();
            w = w + x;
            h = h + y;
            Y.Assert.areEqual(w, mypath.get("width"), "The width of the path should be " + w + ".");
            Y.Assert.areEqual(h, mypath.get("height"), "The height of the path should be " + h + ".");
        }
    });
},

drawMultipleEllipsesTest = function(name, attrs) 
{
    return new Y.PathTestTemplate({}, {
        pathAttrs: attrs,

        testDefault: function()
        {
            var w = 30,
                h = 20,
                x = -40,
                y = -30,
                i = 0,
                len = 4,
                strokeWidth = this.stroke ? this.stroke.weight : 0;
                mypath = this.path;
            mypath.clear();
            for(; i < len; ++i)
            {
                x += 40;
                y += 30;
                mypath.drawEllipse(x, y, w, h);
                mypath.closePath();
            }
            mypath.end();
            w = w + x;
            h = h + y;
            Y.Assert.areEqual(w, mypath.get("width"), "The width of the path should be " + w + ".");
            Y.Assert.areEqual(h, mypath.get("height"), "The height of the path should be " + h + ".");
        }
    });
},

drawMultipleCirclesTest = function(name, attrs) 
{
    return new Y.PathTestTemplate({}, {
        pathAttrs: attrs,

        testDefault: function()
        {
            var w = 30,
                h = 30,
                x = -40,
                y = -40,
                i = 0,
                len = 4,
                strokeWidth = this.stroke ? this.stroke.weight : 0;
                mypath = this.path;
            mypath.clear();
            for(; i < len; ++i)
            {
                x += 40;
                y += 40;
                mypath.drawCircle(x, y, w/2);
                mypath.closePath();
            }
            mypath.end();
            w = w + x;
            h = h + y;
            Y.Assert.areEqual(w, mypath.get("width"), "The width of the path should be " + w + ".");
            Y.Assert.areEqual(h, mypath.get("height"), "The height of the path should be " + h + ".");
        }
    });
},

drawMultipleRoundRectsTest = function(name, attrs) 
{
    return new Y.PathTestTemplate({}, {
        pathAttrs: attrs,

        testDefault: function()
        {
            var w = 30,
                h = 20,
                x = -40,
                y = -30,
                ew = 4,
                eh = 4,
                i = 0,
                len = 4,
                strokeWidth = this.stroke ? this.stroke.weight : 0;
                mypath = this.path;
            mypath.clear();
            for(; i < len; ++i)
            {
                x += 40;
                y += 30;
                mypath.drawRoundRect(x, y, w, h, ew, eh);
                mypath.closePath();
            }
            mypath.end();
            w = w + x;
            h = h + y;
            Y.Assert.areEqual(w, mypath.get("width"), "The width of the path should be " + w + ".");
            Y.Assert.areEqual(h, mypath.get("height"), "The height of the path should be " + h + ".");
        }
    });
},

drawMultipleDiamondsTest = function(name, attrs) 
{
    return new Y.PathTestTemplate({}, {
        pathAttrs: attrs,

        testDefault: function()
        {
            var w = 30,
                h = 20,
                x = -40,
                y = -30,
                i = 0,
                len = 4,
                strokeWidth = this.stroke ? this.stroke.weight : 0;
                mypath = this.path;
            mypath.clear();
            for(; i < len; ++i)
            {
                x += 40;
                y += 30;
                mypath.drawDiamond(x, y, w, h);
                mypath.closePath();
            }
            mypath.end();
            w = w + x;
            h = h + y;
            Y.Assert.areEqual(w, mypath.get("width"), "The width of the path should be " + w + ".");
            Y.Assert.areEqual(h, mypath.get("height"), "The height of the path should be " + h + ".");
        }
    });
},

setPathDataTest = function(name, attrs, pathData) 
{
    return new Y.PathTestTemplate({}, {
        pathAttrs: attrs,

        pathData: pathData,

        testDefault: function()
        {
            var mypath = this.path,
                pathAttr = mypath.get("path");
            Y.Assert.areEqual(pathData, mypath.get("data"), "The path data should be " + pathData);
            mypath.set("data", pathData2);
            Y.Assert.areEqual(pathData2, mypath.get("data"), "The path data should be " + pathData2 + ".");
            mypath.set("data", "");
            Y.Assert.areEqual("", mypath.get("data"), "The path data should be an empty string.");
        }
    });
};
 
suite.add(drawRectTest("DrawRectTestStrokeAndFill", strokeAndFill));
suite.add(drawRectTest("DrawRectTestStrokeNoFill", strokeNoFill));
suite.add(drawRectTest("DrawRectTestFillNoStroke", fillNoStroke));
suite.add(drawEllipseTest("DrawEllipseTestStrokeAndFill", strokeAndFill));
suite.add(drawEllipseTest("DrawEllipseTestStrokeNoFill", strokeNoFill));
suite.add(drawEllipseTest("DrawEllipseTestFillNoStroke", fillNoStroke));
suite.add(drawCircleTest("DrawCircleTestStrokeAndFill", strokeAndFill));
suite.add(drawCircleTest("DrawCircleTestStrokeNoFill", strokeNoFill));
suite.add(drawCircleTest("DrawCircleTestFillNoStroke", fillNoStroke));
suite.add(drawRoundRectTest("DrawRoundRectTestStrokeAndFill", strokeAndFill));
suite.add(drawRoundRectTest("DrawRoundRectTestStrokeNoFill", strokeNoFill));
suite.add(drawRoundRectTest("DrawRoundRectTestFillNoStroke", fillNoStroke));
suite.add(drawDiamondTest("DrawDiamondTestStrokeAndFill", strokeAndFill));
suite.add(drawDiamondTest("DrawDiamondTestStrokeNoFill", strokeNoFill));
suite.add(drawDiamondTest("DrawDiamondTestFillNoStroke", fillNoStroke));
suite.add(drawMultipleRectsTest("DrawMultipleRectsTestStrokeAndFill", strokeAndFill));
suite.add(drawMultipleRectsTest("DrawMultipleRectsTestStrokeNoFill", strokeNoFill));
suite.add(drawMultipleRectsTest("DrawMultipleRectsTestFillNoStroke", fillNoStroke));
suite.add(drawMultipleEllipsesTest("DrawMultipleEllipsesTestStrokeAndFill", strokeAndFill));
suite.add(drawMultipleEllipsesTest("DrawMultipleEllipsesTestStrokeNoFill", strokeNoFill));
suite.add(drawMultipleEllipsesTest("DrawMultipleEllipsesTestFillNoStroke", fillNoStroke));
suite.add(drawMultipleCirclesTest("DrawMultipleCirclesTestStrokeAndFill", strokeAndFill));
suite.add(drawMultipleCirclesTest("DrawMultipleCirclesTestStrokeNoFill", strokeNoFill));
suite.add(drawMultipleCirclesTest("DrawMultipleCirclesTestFillNoStroke", fillNoStroke));
suite.add(drawMultipleRoundRectsTest("DrawMultipleRoundRectsTestStrokeAndFill", strokeAndFill));
suite.add(drawMultipleRoundRectsTest("DrawMultipleRoundRectsTestStrokeNoFill", strokeNoFill));
suite.add(drawMultipleRoundRectsTest("DrawMultipleRoundRectsTestFillNoStroke", fillNoStroke));
suite.add(drawMultipleDiamondsTest("DrawMultipleDiamondsTestStrokeAndFill", strokeAndFill));
suite.add(drawMultipleDiamondsTest("DrawMultipleDiamondsTestStrokeNoFill", strokeNoFill));
suite.add(drawMultipleDiamondsTest("DrawMultipleDiamondsTestFillNoStroke", fillNoStroke));
suite.add(drawQuadraticCurvesTest("DrawQuadraticCurvesTestStrokeAndFill", strokeAndFill));
suite.add(drawQuadraticCurvesTest("DrawQuadraticCurvesTestStrokeNoFill", strokeNoFill));
suite.add(drawQuadraticCurvesTest("DrawQuadraticCurvesTestFillNoStroke", fillNoStroke));
suite.add(drawCubicCurvesTest("DrawCubicCurvesTestStrokeAndFill", strokeAndFill));
suite.add(drawCubicCurvesTest("DrawCubicCurvesTestStrokeNoFill", strokeNoFill));
suite.add(drawCubicCurvesTest("DrawCubicCurvesTestFillNoStroke", fillNoStroke));
suite.add(drawWedgeTest("DrawWedgeTestStrokeAndFill", strokeAndFill));
suite.add(drawWedgeTest("DrawWedgeTestStrokeNoFill", strokeNoFill));
suite.add(drawWedgeTest("DrawWedgeTestFillNoStroke", fillNoStroke));
suite.add(setPathDataTest("TestPathDataAttr", {data: pathData}, pathData));


Y.Test.Runner.add( suite );

}, '@VERSION@' ,{requires:['graphics', 'test']});
