YUI.add('graphics-tests', function(Y) {

var suite = new Y.Test.Suite("Y.Graphic"),
    ENGINE = "vml",
    DOCUMENT = Y.config.doc,
	canvas = DOCUMENT && DOCUMENT.createElement("canvas"),
    svgTests,
    canvasTests,
    vmlTests;
if(DOCUMENT && DOCUMENT.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"))
{
    ENGINE = "svg";
}
else if(canvas && canvas.getContext && canvas.getContext("2d"))
{
    ENGINE = "canvas";
}

svgTests = new Y.Test.Case({
    name: "GraphicsTests",

    graphic: null,

    mycircle: null,

    myrect: null,

    myellipse: null,

    mypath: null,

    initialFillColor: "#f00",

    initialStrokeColor: "#00f",

    updatedFillColor: "#9aa",

    updatedStrokeColor: "#99a",

    setUp: function () {
        Y.one("body").append('<div id="testbed"></div>');
    },

    tearDown: function () {
        Y.one("#testbed").remove(true);
    },

    "testGraphic()" : function()
    {
        Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="graphiccontainer"></div>');
        var graphic = new Y.Graphic({render: "#graphiccontainer"});
        graphic.on("init", function(e) {
            Y.Assert.isInstanceOf(SVGElement, graphic._contentNode);
        });
        this.graphic = graphic;
    },

    "testRectNode()" : function()
    {
        var myrect = this.graphic.getShape({
            type: "rect",
            width: 300,
            height: 200,
            fill: {
                color: this.initialFillColor
            },
            stroke: {
                color: this.initialStrokeColor
            }
        });
        this.myrect = myrect;
        Y.Assert.isInstanceOf(SVGRectElement, myrect.get("node"));
    },

    "testRectNodeDimensions()" : function()
    {
        var node = this.myrect.get("node");
        Y.assert(node.getAttribute("width") == "300");
        Y.assert(node.getAttribute("height") == "200");
    },

    "testRectNodeFillColor()" : function() 
    {
        var node = this.myrect.get("node");
        Y.assert(node.getAttribute("fill") == this.initialFillColor);
    },

    "testRectNodeFillOpacity()" : function()
    {
        var node = this.myrect.get("node");
        Y.assert(node.getAttribute("fill-opacity") == "1");
    },

    "testRectNodeStrokeColor" : function()
    {
        var node = this.myrect.get("node");
        Y.assert(node.getAttribute("stroke") == this.initialStrokeColor);
    },

    "testRectNodeStrokeWidth" : function()
    {
        var node = this.myrect.get("node");
        Y.assert(node.getAttribute("stroke-width") == "1");
    },

    "testRectNodeStroke" : function()
    {
        var node = this.myrect.get("node");
        Y.assert(node.getAttribute("stroke-opacity") == "1");
    },

    "testRectNodeStrokeDashArray" : function()
    {
        var node = this.myrect.get("node");
        Y.assert(node.getAttribute("stroke-dasharray") == "none");
    },

    "testRectNodeStrokeLineCap" : function()
    {
        var node = this.myrect.get("node");
        Y.assert(node.getAttribute("stroke-linecap") == "butt");
    },

    "testRectNodeStrokeLineJoin" : function()
    {
        var node = this.myrect.get("node");
        Y.assert(node.getAttribute("stroke-linejoin") == "round");
    },

    "testRectNodeWidthAgainstShapeAttr" : function()
    {
        var node = this.myrect.get("node");
        Y.assert(node.getAttribute("width") == this.myrect.get("width"));
    },
    
    "testRectNodeHeightAgainstShapeAttr" : function()
    {
        var node = this.myrect.get("node");
        Y.assert(node.getAttribute("height") == this.myrect.get("height"));
    },

    "testRectNodeFillAgainstShapeAttr" : function()
    {
        var node = this.myrect.get("node"),
            fill = this.myrect.get("fill"),
            opacity = parseFloat(fill.opacity);
        opacity = isNaN(opacity) ? 1 : opacity;
        Y.assert(fill.color == node.getAttribute("fill"));
        Y.assert(opacity == node.getAttribute("fill-opacity"));
    },

    "testRectNodeStrokeAgainstShapeAttr" : function()
    {
        var node = this.myrect.get("node"),
            stroke = this.myrect.get("stroke"),
            opacity = stroke.opacity,
            linejoin = stroke.linejoin == undefined ? "round" : stroke.linejoin;
        opacity = isNaN(opacity) ? 1 : opacity;
        Y.assert(stroke.color == node.getAttribute("stroke"));
        Y.assert(linejoin == node.getAttribute("stroke-linejoin"));
        Y.assert(opacity == node.getAttribute("stroke-opacity"));
        Y.assert(stroke.linecap == node.getAttribute("stroke-linecap"));
        Y.assert(stroke.dashstyle == node.getAttribute("stroke-dasharray"));
    }
});

if(ENGINE == "svg")
{
    suite.add(svgTests);
}
suite.add( new Y.Test.Case({
    name: "GraphicsTests",

    graphic: null,

    mycircle: null,

    myrect: null,

    myellipse: null,

    mypath: null,

    initialFillColor: "#f00",

    initialStrokeColor: "#00f",

    updatedFillColor: "#9aa",

    updatedStrokeColor: "#99a",

    setUp: function () {
        Y.one("body").append('<div id="testbed"></div>');
    },

    tearDown: function () {
        Y.one("#testbed").remove(true);
    },

    "test default construction": function () {
        Y.Assert.isInstanceOf( Y.Graphic, new Y.Graphic() );
    },

    "test render()": function () {
        Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="graphiccontainer"></div>');

        var div = Y.one("#graphiccontainer"),
            node,
            contentBounds,
            nodewidth,
            nodeheight
        graphic = new Y.Graphic({render: "#graphiccontainer"});
        graphic.on("init", function(e) {
            Y.Assert.isInstanceOf(Y.Graphic, graphic);
        });
    },

    "test getShape(circle)": function()
    {
        var mycircle = graphic.getShape({
            type: "circle",
            stroke: {
                color: this.initialStrokeColor,
                weight: 1
            },
            fill: {
                color: this.initialFillColor
            },
            radius: 12,
            x: -5,
            y: -5
        });
        Y.assert(mycircle instanceof Y.Circle);
        this.mycircle = mycircle;
    },
   
    "test mycircle.get(radius)": function()
    {
        Y.assert(this.mycircle.get("radius") === 12);
    },

    "test mycircle.get(width)": function()
    {
        Y.assert(this.mycircle.get("width") === 24);
    },

    "test mycircle.get(height)" : function()
    {
        Y.assert(this.mycircle.get("height") === 24);
    },

    "test mycircle.get(stroke)" : function()
    {
        var stroke = this.mycircle.get("stroke");
        Y.assert(stroke.color === this.initialStrokeColor);
    },

    "test mycircle.get(fill)" : function()
    {
        var fill = this.mycircle.get("fill");
        Y.assert(fill.color === this.initialFillColor);
    },

    "text mycircle.get(x)" : function()
    {
        Y.assert(this.mycircle.get("x") === -5);
    },

    "test mycircle.get(y)" : function()
    {
        Y.assert(this.mycircle.get("y") === -5);
    },

    "test mycircle.set(stroke)" : function()
    {
        var mycircle = this.mycircle;
        mycircle.set("stroke", {
            color: this.updatedStrokeColor
        });

        Y.assert(this.updatedStrokeColor === mycircle.get("stroke").color);
    },
    
    "test mycircle.set(fill)" : function()
    {
        var mycircle = this.mycircle;
        mycircle.set("fill", {
            color: this.updatedFillColor
        });

        Y.assert(this.updatedFillColor === mycircle.get("fill").color);
    },

    "testRemoveShape(circle)": function()
    {
        var id,
            shapes = graphic.get("shapes"),
            hasShape;
        graphic.removeShape(this.mycircle);
        hasShape = (shapes.hasOwnProperty(id) && shapes[id] instanceof Y.Circle);
        Y.Assert.isFalse(hasShape);
    },
    
    "test getShape(rect)": function() 
    {
        var myrect = graphic.getShape({
            type: "rect",
            stroke: {
                weight: 2,
                color: this.initialStrokeColor
            },
            fill: {
                color: this.initialFillColor
            },
            x: 5,
            y: 5,
            width:300,
            height: 200
        });
        Y.assert(myrect instanceof Y.Rect);
        this.myrect = myrect;
    },

    "test myrect.get(width)": function()
    {
        Y.assert(this.myrect.get("width") === 300);
    },

    "test myrect.get(height)" : function()
    {
        Y.assert(this.myrect.get("height") === 200);
    },

    "test myrect.get(stroke)" : function()
    {
        var stroke = this.myrect.get("stroke");
        Y.assert(stroke.color === this.initialStrokeColor);
    },

    "test myrect.get(fill)" : function()
    {
        var fill = this.myrect.get("fill");
        Y.assert(fill.color === this.initialFillColor);
    },

    "test myrect.get(x)" : function()
    {
        Y.assert(this.myrect.get("x") === 5);
    },

    "test myrect.get(y)" : function()
    {
        Y.assert(this.myrect.get("y") === 5);
    },

    "test myrect.set(stroke)" : function()
    {
        var myrect = this.myrect;
        myrect.set("stroke", {
            color: this.updatedStrokeColor
        });

        Y.assert(this.updatedStrokeColor === myrect.get("stroke").color);
    },
    
    "test myrect.set(fill)" : function()
    {
        var myrect = this.myrect;
        myrect.set("fill", {
            color: this.updatedFillColor
        });

        Y.assert(this.updatedFillColor === myrect.get("fill").color);
    },

    "test removeShape(rect)" : function()
    {
        var id,
            shapes = graphic.get("shapes"),
            hasShape;
        graphic.removeShape(this.myrect);
        hasShape = (shapes.hasOwnProperty(id) && shapes[id] instanceof Y.Rect);
        Y.Assert.isFalse(hasShape);
    },

    "test getShape(ellipse)": function()
    {
        var myellipse = graphic.getShape({
            type: "ellipse",
            stroke: {
                color: this.initialStrokeColor,
                weight: 2
            },
            fill: {
                color: this.initialFillColor
            },
            width: 100,
            height: 30,
            x:100,
            y:50
        });
        Y.assert(myellipse instanceof Y.Ellipse);
        this.myellipse = myellipse;
    },

    "test myellipse.get(width)": function()
    {
        Y.assert(this.myellipse.get("width") === 100);
    },

    "test myellipse.get(height)" : function()
    {
        Y.assert(this.myellipse.get("height") === 30);
    },

    "test myellipse.get(stroke)" : function()
    {
        var stroke = this.myellipse.get("stroke");
        Y.assert(stroke.color === this.initialStrokeColor);
    },

    "test myellipse.get(fill)" : function()
    {
        var fill = this.myellipse.get("fill");
        Y.assert(fill.color === this.initialFillColor);
    },

    "test myellipse.get(x)" : function()
    {
        Y.assert(this.myellipse.get("x") === 100);
    },

    "test myellipse.get(y)" : function()
    {
        Y.assert(this.myellipse.get("y") === 50);
    },

    "test myellipse.set(stroke)" : function()
    {
        var myellipse = this.myellipse;
        myellipse.set("stroke", {
            color: this.updatedStrokeColor
        });

        Y.assert(this.updatedStrokeColor === myellipse.get("stroke").color);
    },
    
    "test myellipse.set(fill)" : function()
    {
        var myellipse = this.myellipse;
        myellipse.set("fill", {
            color: this.updatedFillColor
        });

        Y.assert(this.updatedFillColor === myellipse.get("fill").color);
    },

    "test removeShape(ellipse)" : function()
    {
        var id,
            shapes = graphic.get("shapes"),
            hasShape;
        graphic.removeShape(this.myellipse);
        hasShape = (shapes.hasOwnProperty(id) && shapes[id] instanceof Y.Ellipse);
        Y.Assert.isFalse(hasShape);
    },

    "test getShape(path)": function()
    {
        var mypath = graphic.getShape({
            type: "path",
            stroke: {
                color: this.initialStrokeColor
            },
            fill: {
                color: this.initialFillColor
            }
        });
        mypath.moveTo(-20, -20);
        mypath.lineTo(80, 120);
        mypath.lineTo(100, 80);
        mypath.lineTo(-20, -20);
        mypath.end();
        Y.assert(mypath instanceof Y.Path);
        this.mypath = mypath;
    },

    "test mypath.get(width)": function()
    {
        Y.assert(this.mypath.get("width") === 120);
    },

    "test mypath.get(height)" : function()
    {
        Y.assert(this.mypath.get("height") === 140);
    },

    "test mypath.get(stroke)" : function()
    {
        var stroke = this.mypath.get("stroke");
        Y.assert(stroke.color === this.initialStrokeColor);
    },

    "test mypath.get(fill)" : function()
    {
        var fill = this.mypath.get("fill");
        Y.assert(fill.color === this.initialFillColor);
    },

    "test mypath.get(x)" : function()
    {
        Y.assert(this.mypath.get("x") === 0);
    },

    "test mypath.get(y)" : function()
    {
        Y.assert(this.mypath.get("y") === 0);
    },

    "test mypath.set(stroke)" : function()
    {
        var mypath = this.mypath;
        mypath.set("stroke", {
            color: this.updatedStrokeColor
        });

        Y.assert(this.updatedStrokeColor === mypath.get("stroke").color);
    },
    
    "test mypath.set(fill)" : function()
    {
        var mypath = this.mypath;
        mypath.set("fill", {
            color: this.updatedFillColor
        });

        Y.assert(this.updatedFillColor === mypath.get("fill").color);
    },

    "test removeShape(path)" : function()
    {
        var id,
            shapes = graphic.get("shapes"),
            hasShape;
        graphic.removeShape(this.mypath);
        hasShape = (shapes.hasOwnProperty(id) && shapes[id] instanceof Y.Path);
        Y.Assert.isFalse(hasShape);
    },

    "test passRotation(rect)" : function()
    {
        var myrect = graphic.getShape({
            type: "rect",
            stroke: {
                weight: 2,
                color: this.initialStrokeColor
            },
            fill: {
                color: this.initialFillColor
            },
            x: 5,
            y: 5,
            width:300,
            height: 200,
            rotation: 45
        });
        Y.assert(myrect instanceof Y.Rect);
    }
}));


Y.Test.Runner.add( suite );


}, '@VERSION@' ,{requires:['graphics', 'test']});
