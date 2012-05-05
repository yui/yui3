YUI.add('shape-path-tests', function(Y) {

var suite = new Y.Test.Suite("Y.Path.Tests"),
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

Y.Test.Runner.add( suite );

}, '@VERSION@' ,{requires:['graphics', 'test']});
