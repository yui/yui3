YUI.add('graphics-tests', function(Y) {

var suite = new Y.Test.Suite("Graphics: Base"),
    ENGINE = "vml",
    DOCUMENT = Y.config.doc,
	svg = DOCUMENT && DOCUMENT.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"),
	canvas = DOCUMENT && DOCUMENT.createElement("canvas"),
    graphicTests,
    svgTests,
    canvasTests,
    vmlTests,
    rectClassString, 
    circleClassString, 
    ellipseClassString, 
    pathClassString, 
    DEFAULTENGINE = Y.config.defaultGraphicEngine;

if((canvas && canvas.getContext && canvas.getContext("2d")) && (DEFAULTENGINE == "canvas" || !svg))
{
    ENGINE = "canvas";
    rectClassString = "yui3-shape yui3-canvasShape yui3-rect yui3-canvasRect"; 
    circleClassString = "yui3-shape yui3-canvasShape yui3-circle yui3-canvasCircle";
    ellipseClassString = "yui3-shape yui3-canvasShape yui3-ellipse yui3-canvasEllipse";
    pathClassString = "yui3-shape yui3-canvasShape yui3-path yui3-canvasPath";
}
else if(svg)
{
    ENGINE = "svg";
    rectClassString = "yui3-shape yui3-svgShape yui3-rect yui3-svgRect"; 
    circleClassString = "yui3-shape yui3-svgShape yui3-circle yui3-svgCircle";
    ellipseClassString = "yui3-shape yui3-svgShape yui3-ellipse yui3-svgEllipse";
    pathClassString = "yui3-shape yui3-svgShape yui3-path yui3-svgPath";
}
else
{
    rectClassString = "yui3-shape yui3-vmlShape yui3-rect yui3-vmlRect vmlrect"; 
    circleClassString = "yui3-shape yui3-vmlShape yui3-circle yui3-vmlCircle vmloval";
    ellipseClassString = "yui3-shape yui3-vmlShape yui3-ellipse yui3-vmlEllipse vmloval";
    pathClassString = "yui3-shape yui3-vmlShape yui3-path yui3-vmlPath vmlshape";
}

graphicTests = new Y.Test.Case({
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
    
    dashstyle: "3 7",

    skewX: 45,

    skewY: 45,

    scaleX: 4,

    scaleY: 3,

    translateX: 15,

    translateY: 10,

    rotate: 110,

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

    "test addShape(circle)": function()
    {
        var mycircle = graphic.addShape({
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
  
    "test mycircleDefaultClassString()" : function()
    {
        var node = this.mycircle.get("node"),
            classString = Y.DOM.getAttribute(node, "class");
        Y.Assert.areEqual(circleClassString, classString, "The class string should be " + circleClassString + ".");
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

    "test mycircle.get(x)" : function()
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

    "test mycircle.contains()" :function()
    {
        var mycircle = this.mycircle,
            node = mycircle.get("node");
        Y.Assert.isTrue(mycircle.contains(Y.one(node)), "The contains method should return true.");
    },

    "test mycircle.compareTo()" :function()
    {
        var mycircle = this.mycircle,
            node = mycircle.get("node");
        Y.Assert.isTrue(mycircle.compareTo(node), "The compareTo method should return true.");
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
    
    "test addShape(rect)": function() 
    {
        var myrect = graphic.addShape({
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
  
    "test myrectDefaultClassString()" : function()
    {
        var node = this.myrect.get("node"),
            classString = Y.DOM.getAttribute(node, "class");
        Y.Assert.areEqual(rectClassString, classString, "The class string should be " + rectClassString + ".");
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

    "testRectStrokeWeightType" : function()
    {
        var strokeWeight = 2,
            stroke = this.myrect.get("stroke");
        Y.assert(stroke.weight === strokeWeight);
    },
    
    "test myrect.set(fill)" : function()
    {
        var myrect = this.myrect;
        myrect.set("fill", {
            color: this.updatedFillColor
        });

        Y.assert(this.updatedFillColor === myrect.get("fill").color);
    },

    "test myrect.set(stroke===0)" : function()
    {
        var myrect = this.myrect,
            wt = 0;
        myrect.set("stroke", {
            weight: wt
        });
        Y.Assert.areEqual(wt, myrect.get("stroke").weight, "The stroke weight should be " + wt + ".");
    },

    "test myrect.set(stroke-dashstyle)" : function()
    {
        var myrect = this.myrect,
            dashstyle = this.dashstyle.split(' ');
        myrect.set("stroke", {
            weight: 2,
            dashstyle: dashstyle
        });
        dashstyle = dashstyle.toString();
        Y.Assert.areEqual(dashstyle, myrect.get("stroke").dashstyle.toString(), "The dashstyle should be " + dashstyle + ".");
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

    "test addShape(ellipse)": function()
    {
        var myellipse = graphic.addShape({
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

    "test myellipseDefaultClassString()" : function()
    {
        var node = this.myellipse.get("node"),
            classString = Y.DOM.getAttribute(node, "class");
        Y.Assert.areEqual(ellipseClassString, classString, "The class string should be " + ellipseClassString + ".");
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

    "test myellipse.set(xRadius)" : function()
    {
        var myellipse = this.myellipse,
            xRadius = 40,
            width = 80;
        myellipse.set("xRadius", xRadius);
        Y.Assert.areEqual(xRadius, myellipse.get("xRadius"), "The xRadius of the ellipse should be " + xRadius + ".");
        Y.Assert.areEqual(width, myellipse.get("width"), "The width of the ellipse should be " + width + ".");
    },

    "test myellipse.set(yRadius)" : function()
    {
        var myellipse = this.myellipse,
            yRadius = 40,
            height = 80;
        myellipse.set("yRadius", yRadius);
        Y.Assert.areEqual(yRadius, myellipse.get("yRadius"), "The yRadius of the ellipse should be " + yRadius + ".");
        Y.Assert.areEqual(height, myellipse.get("height"), "The height of the ellipse should be " + height + ".");
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
    
    "test addEllipseWithXRadiusAndYRadius()": function()
    {
        var width = 50,
            height = 100,
            xRadius = 25,
            yRadius = 50,
            myellipse = graphic.addShape({
                type: "ellipse",
                stroke: {
                    color: this.initialStrokeColor,
                    weight: 2
                },
                fill: {
                    color: this.initialFillColor
                },
                xRadius: xRadius,
                yRadius: yRadius
            });
        Y.assert(myellipse instanceof Y.Ellipse);
        Y.Assert.areEqual(xRadius, myellipse.get("xRadius"), "The xRadius of the ellipse should be " + xRadius + ".");
        Y.Assert.areEqual(width, myellipse.get("width"), "The width of the ellipse should be " + width + ".");
        Y.Assert.areEqual(yRadius, myellipse.get("yRadius"), "The yRadius of the ellipse should be " + yRadius + ".");
        Y.Assert.areEqual(height, myellipse.get("height"), "The height of the ellipse should be " + height + ".");
        myellipse.destroy();
    },

    "test addShape(path)": function()
    {
        var mypath = graphic.addShape({
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
  
    "test mypathDefaultClassString()" : function()
    {
        var node = this.mypath.get("node"),
            classString = Y.DOM.getAttribute(node, "class");
        Y.Assert.areEqual(pathClassString, classString, "The class string should be " + pathClassString + ".");
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

    "test rotate(path)" : function()
    {
        var mypath = this.mypath,
            transform = "rotate(" + this.rotate + ")";
        mypath.set("transform", "");
        mypath.rotate(this.rotate);
        Y.Assert.areEqual(transform, Y.Lang.trim(mypath.get("transform")), "The rotate attribute should be " + transform + ".");
    },

    "test skewX(path)" : function()
    {
        var mypath = this.mypath,
            transform = "skewX(" + this.skewX + ")";
        mypath.set("transform", "");
        mypath.skewX(this.skewX);
        Y.Assert.areEqual(transform, Y.Lang.trim(mypath.get("transform")), "The skewX attribute should be " + transform + ".");
    },

    "test skewY(path)" : function()
    {
        var mypath = this.mypath,
            transform = "skewY(" + this.skewY + ")";
        mypath.set("transform", "");
        mypath.skewY(this.skewY);
        Y.Assert.areEqual(transform, Y.Lang.trim(mypath.get("transform")), "The skewY attribute should be " + transform + ".");
    },

    "test skew(path)" : function()
    {
        var mypath = this.mypath,
            transform = "skew(" + this.skewX + ", " + this.skewY + ")";
        mypath.set("transform", "");
        mypath.skew(this.skewX, this.skewY);
        Y.Assert.areEqual(transform, Y.Lang.trim(mypath.get("transform")), "The transform attribute should be " + transform + ".");
    },

    "test scale(path)" : function()
    {
        var mypath = this.mypath,
            transform = "scale(" + this.scaleX + ", " + this.scaleY + ")";
        mypath.set("transform", "");
        mypath.scale(this.scaleX, this.scaleY);
        Y.Assert.areEqual(transform, Y.Lang.trim(mypath.get("transform")), "The transform attribute should be " + transform + ".");
    },

    "test translate(path)" : function()
    {
        var mypath = this.mypath,
            transform = "translate(" + this.translateX + ", " + this.translateY + ")";
        mypath.set("transform", "");
        mypath.translate(this.translateX, this.translateY);
        Y.Assert.areEqual(transform, Y.Lang.trim(mypath.get("transform")), "The transform attribute should be " + transform + ".");
    },

    "test translateX(path)" : function()
    {
        var mypath = this.mypath,
            transform = "translateX(" + this.translateX + ")";
        mypath.set("transform", "");
        mypath.translateX(this.translateX);
        Y.Assert.areEqual(transform, Y.Lang.trim(mypath.get("transform")), "The transform attribute should be " + transform + ".");
    },

    "test translateY(path)" : function()
    {
        var mypath = this.mypath,
            transform = "translateY(" + this.translateY + ")";
        mypath.set("transform", "");
        mypath.translateY(this.translateY);
        Y.Assert.areEqual(transform, Y.Lang.trim(mypath.get("transform")), "The transform attribute should be " + transform + ".");
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
        var myrect = graphic.addShape({
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
});

//suite of svg specific tests
svgTests = new Y.Test.Case({
    name: "SVGGraphicsTests",

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

    "testSVGGraphic()" : function()
    {
        Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="graphiccontainer"></div>');
        var graphic = new Y.Graphic({render: "#graphiccontainer"});
        graphic.on("init", function(e) {
            Y.Assert.areEqual(graphic.get("node").nodeName.toLowerCase(), "div", "The node instance should be a div.");
            Y.Assert.isInstanceOf(SVGElement, graphic._contentNode);
        });
        this.graphic = graphic;
    },

    "testSVGRectNode()" : function()
    {
        var myrect = this.graphic.addShape({
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

    "testSVGRectNodeDimensions()" : function()
    {
        var node = this.myrect.get("node");
        Y.assert(node.getAttribute("width") == "300");
        Y.assert(node.getAttribute("height") == "200");
    },

    "testSVGRectNodeFillColor()" : function() 
    {
        var node = this.myrect.get("node");
        Y.assert(node.getAttribute("fill") == this.initialFillColor);
    },

    "testSVGRectNodeFillOpacity()" : function()
    {
        var node = this.myrect.get("node");
        Y.assert(node.getAttribute("fill-opacity") == "1");
    },

    "testSVGRectNodeStrokeColor" : function()
    {
        var node = this.myrect.get("node");
        Y.assert(node.getAttribute("stroke") == this.initialStrokeColor);
    },

    "testSVGRectNodeStrokeWidth" : function()
    {
        var node = this.myrect.get("node");
        Y.assert(node.getAttribute("stroke-width") == "1");
    },

    "testSVGRectNodeStroke" : function()
    {
        var node = this.myrect.get("node");
        Y.assert(node.getAttribute("stroke-opacity") == "1");
    },

    "testSVGRectNodeStrokeDashArray" : function()
    {
        var node = this.myrect.get("node");
        Y.assert(node.getAttribute("stroke-dasharray") == "none");
    },

    "testSVGRectNodeStrokeLineCap" : function()
    {
        var node = this.myrect.get("node");
        Y.assert(node.getAttribute("stroke-linecap") == "butt");
    },

    "testSVGRectNodeStrokeLineJoin" : function()
    {
        var node = this.myrect.get("node");
        Y.assert(node.getAttribute("stroke-linejoin") == "round");
    },

    "testSVGRectNodeStrokeLineJoinBevel" : function()
    {
        var myrect = this.myrect,
            node = myrect.get("node"),
            bevel = "bevel";
        myrect.set("stroke", {
            linejoin: bevel
        });
        Y.Assert.areEqual(bevel, myrect.get("stroke").linejoin, "The value of the linejoin attribute should be " + bevel + ".");
        Y.Assert.areEqual(bevel, node.getAttribute("stroke-linejoin"), "The value of the shape's stroke-linejoin attribute should be " + bevel + ".");
    },

    "testSVGRectNodeWidthAgainstShapeAttr" : function()
    {
        var node = this.myrect.get("node");
        Y.assert(node.getAttribute("width") == this.myrect.get("width"));
    },
    
    "testSVGRectNodeHeightAgainstShapeAttr" : function()
    {
        var node = this.myrect.get("node");
        Y.assert(node.getAttribute("height") == this.myrect.get("height"));
    },

    "testSVGRectNodeFillAgainstShapeAttr" : function()
    {
        var node = this.myrect.get("node"),
            fill = this.myrect.get("fill"),
            opacity = parseFloat(fill.opacity);
        opacity = isNaN(opacity) ? 1 : opacity;
        Y.assert(fill.color == node.getAttribute("fill"));
        Y.assert(opacity == node.getAttribute("fill-opacity"));
    },

    "testSVGRectNodeStrokeAgainstShapeAttr" : function()
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
        Y.assert(stroke.weight == node.getAttribute("stroke-width"));
    },

    "testSVGRectNodeStrokeLineJoinMiterLimit=3" : function()
    {
        var myrect = this.myrect,
            node = myrect.get("node"),
            miterlimit = 3;
        myrect.set("stroke", {
            linejoin: miterlimit
        });
        Y.Assert.areEqual(miterlimit, myrect.get("stroke").linejoin, "The value of the linejoin attribute should be " + miterlimit + ".");
        Y.Assert.areEqual("miter", node.getAttribute("stroke-linejoin"), "The value of the shape's stroke-linejoin attribute should be miter.");
        Y.Assert.areEqual(miterlimit, node.getAttribute("stroke-miterlimit"), "The value of the shape's stroke-miterlimit attribute should be " + miterlimit + ".");
    },

    "testSVGRect.test()" :function()
    {
        var myrect = this.myrect;
        Y.Assert.isTrue(myrect.test(".yui3-svgShape"), "The compareTo method should return true.");
        Y.Assert.isTrue(myrect.test(".yui3-svgRect"), "The compareTo method should return true.");
        myrect.destroy();
    },
    
    "test addSVGPieSlice()" : function()
    {
        var pieslice = graphic.addShape({
            type: "pieslice",
            stroke: {
                weight: 1,
                color: this.initialStrokeColor
            },
            fill: {
                color: this.initialFillColor
            },
            width: 420,
            height: 420,
            cx: 210,
            cy: 210,
            radius: 210,
            arc: 90
        });
        Y.Assert.isTrue(pieslice instanceof Y.SVGPieSlice, "The shape should be an instance of Y.PieSlice.");
    }
});

//suite of vml specific tests
vmlTests = new Y.Test.Case({
    name: "VMLGraphicsTests",

    graphic: null,

    mycircle: null,

    myrect: null,

    myellipse: null,

    mypath: null,

    initialFillColor: "#f00",

    initialStrokeColor: "#00f",

    updatedFillColor: "#9aa",

    updatedStrokeColor: "#99a",

    dashstyle: "4 2",

    linejoin: "round",

    linecap: "butt", 

    setUp: function () {
        Y.one("body").append('<div id="testbed"></div>');
    },

    tearDown: function () {
        Y.one("#testbed").remove(true);
    },

    "testVMLGraphic()" : function()
    {
        Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="graphiccontainer"></div>');
        var graphic = new Y.Graphic({render: "#graphiccontainer"});
        graphic.on("init", function(e) {
            Y.Assert.areEqual(graphic.get("node").nodeName, "group", "The node should be a group element.");
        });
        this.graphic = graphic;
    },

    "testVMLRectNode()" : function()
    {
        var myrect = this.graphic.addShape({
            type: "rect",
            width: 300,
            height: 200,
            fill: {
                color: this.initialFillColor
            },
            stroke: {
                color: this.initialStrokeColor,
                opacity: 1,
                dashstyle: this.dashstyle.split(' '),
                linejoin: this.linejoin,
                linecap: this.linecap
            }
        });
        this.myrect = myrect;
        Y.Assert.areEqual(myrect.get("node").nodeName, "rect", "The node should be of type rect.");
    },

    "testVMLRectNodeDimensions()" : function()
    {
        var node = this.myrect.get("node");
        Y.Assert.areEqual(Y.one(node).getComputedStyle("width"), "300px", "The node should be 300 pixels wide.");
        Y.Assert.areEqual(Y.one(node).getComputedStyle("height"), "200px", "The node should be 200 pixels high.");
    },

    "testVMLRectNodeFillColor()" : function() 
    {
        var node = this.myrect.get("node"),
            toHex = Y.Color.toHex,
            fillMatches = false,
            childNodes = node.childNodes,
            i = 0,
            len = childNodes ? childNodes.length : 0;
        for(; i < len; ++i)
        {
            if(childNodes[i] && childNodes[i].nodeName == "fill" && childNodes[i].color == this.initialFillColor)
            {
                fillMatches = true;
            }
        }
        if(!fillMatches)
        {
            fillMatches = toHex(node.fillcolor) == toHex(this.initialFillColor) || toHex(node.fillcolor.value) == toHex(this.initialFillColor); 
    
        }
        Y.assert(fillMatches);
    },
    
    "testVMLRectNodeStrokeColor" : function()
    {
        var node = this.myrect.get("node"),
            toHex = Y.Color.toHex,
            strokeMatches = false,
            childNodes = node.childNodes,
            i = 0,
            len = childNodes ? childNodes.length : 0;
        for(; i < len; ++i)
        {
            if(childNodes[i] && childNodes[i].nodeName == "stroke" && ( toHex(childNodes[i].color) == toHex(this.initialStrokeColor) || toHex(childNodes[i].color.value) == toHex(this.initialStrokeColor)))
            {
                strokeMatches = true;
            }
        }
        if(!strokeMatches)
        {
            strokeMatches = toHex(node.strokecolor) == toHex(this.initialStrokeColor) || toHex(node.strokecolor.value) == toHex(this.initialStrokeColor); 
        }
        Y.assert(strokeMatches);
    },

    "testVMLRectNodeStrokeWidth" : function()
    {
        var node = this.myrect.get("node"),
            toHex = Y.Color.toHex,
            strokeMatches = false,
            childNodes = node.childNodes,
            i = 0,
            len = childNodes ? childNodes.length : 0;
        for(; i < len; ++i)
        {
            if(childNodes[i] && childNodes[i].nodeName == "stroke" && childNodes[i].weight == "1")
            {
                strokeMatches = true;
            }
        }
        if(!strokeMatches)
        {
            strokeMatches = node.strokeWeight;
        }
        Y.assert(strokeMatches);
    },

    "testVMLRectNodeStrokeOpacity" : function()
    {
        var node = this.myrect.get("node"),
            strokeMatches = false,
            childNodes = node.childNodes,
            i = 0,
            len = childNodes ? childNodes.length : 0;
        for(; i < len; ++i)
        {
            if(childNodes[i] && childNodes[i].nodeName == "stroke" && childNodes[i].opacity == "1")
            {
                strokeMatches = true;
            }
        }
        if(!strokeMatches)
        {
            strokeMatches = node.strokeOpacity;
        }
        Y.assert(strokeMatches);
    },

    "testVMLRectNodeStrokeDashArray" : function()
    {
        var node = this.myrect.get("node"),
            strokeMatches = false,
            childNodes = node.childNodes,
            i = 0,
            len = childNodes ? childNodes.length : 0;
        for(; i < len; ++i)
        {
            if(childNodes[i] && childNodes[i].nodeName == "stroke" && childNodes[i].dashstyle && childNodes[i].dashstyle == this.dashstyle)
            {
                strokeMatches = true;
            }
        }
        Y.assert(strokeMatches);
    },

    "testVMLRectNodeStrokeLineCap" : function()
    {
        var node = this.myrect.get("node"),
            strokeMatches = false,
            childNodes = node.childNodes,
            i = 0,
            len = childNodes ? childNodes.length : 0;
        for(; i < len; ++i)
        {
            if(childNodes[i] && childNodes[i].nodeName == "stroke" && childNodes[i].endcap && childNodes[i].endcap == "flat")
            {
                strokeMatches = true;
            }
        }
        Y.assert(strokeMatches);
    },

    "testVMLRectNodeStrokeLineJoin" : function()
    {
        var node = this.myrect.get("node"),
            strokeMatches = false,
            childNodes = node.childNodes,
            i = 0,
            len = childNodes ? childNodes.length : 0;
        for(; i < len; ++i)
        {
            if(childNodes[i] && childNodes[i].nodeName == "stroke" && childNodes[i].joinstyle && childNodes[i].joinstyle == this.linejoin)
            {
                strokeMatches = true;
            }
        }
        Y.assert(strokeMatches);
    },

    "testVMLRectNodeWidthAgainstShapeAttr" : function()
    {
        var node = this.myrect.get("node");
        Y.Assert.areEqual(Y.one(node).getComputedStyle("width"),  this.myrect.get("width") + "px", "The width attribute value should be equal to the width of the html element.");
    },
    
    "testVMLRectNodeHeightAgainstShapeAttr" : function()
    {
        var node = this.myrect.get("node");
        Y.Assert.areEqual(Y.one(node).getComputedStyle("height"), this.myrect.get("height") + "px", "The height attribute value should be equal to the height of the html element.");
    },

    "testVMLRectNodeFillAgainstShapeAttr" : function()
    {
        var node = this.myrect.get("node"),
            fill = this.myrect.get("fill"),
            toHex = Y.Color.toHex;
        Y.assert(toHex(fill.color) == toHex(node.fillcolor));
    },

    "testVMLRectNodeStrokeLineJoinBevel" : function()
    {
        var myrect = this.myrect,
            node = Y.one(myrect.get("node")),
            strokeNode = node.one("stroke"),
            bevel = "bevel";
        myrect.set("stroke", {
            linejoin: bevel
        });
        Y.Assert.areEqual(bevel, myrect.get("stroke").linejoin, "The value of the linejoin attribute should be " + bevel + ".");
        Y.Assert.areEqual(bevel, strokeNode.get("joinstyle"), "The value of the shape's joinstyle attribute should be " + bevel + ".");
    },

    "testVMLRectNodeStrokeLineJoinMiterLimit=3" : function()
    {
        var myrect = this.myrect,
            node = Y.one(myrect.get("node")),
            strokeNode = node.one("stroke"),
            miterlimit = 3;
        myrect.set("stroke", {
            linejoin: miterlimit
        });
        Y.Assert.areEqual(miterlimit, myrect.get("stroke").linejoin, "The value of the linejoin attribute should be " + miterlimit + ".");
        Y.Assert.areEqual("miter", strokeNode.get("joinstyle"), "The value of the shape's joinstyle attribute should be miter.");
        Y.Assert.areEqual(miterlimit, strokeNode.get("miterlimit"), "The value of the shape's miterlimit attribute should be " + miterlimit + ".");
    },

    "testVMLRect.test()" :function()
    {
        Y.Assert.isTrue(this.myrect.test(".yui3-vmlShape"), "The compareTo method should return true.");
        Y.Assert.isTrue(this.myrect.test(".yui3-vmlRect"), "The compareTo method should return true.");
        this.myrect.destroy();
    },
    
    "test addVMLPieSlice()" : function()
    {
        var pieslice = graphic.addShape({
            type: "pieslice",
            stroke: {
                weight: 1,
                color: this.initialStrokeColor
            },
            fill: {
                color: this.initialFillColor
            },
            width: 420,
            height: 420,
            cx: 210,
            cy: 210,
            radius: 210,
            arc: 90
        });
        Y.Assert.isTrue(pieslice instanceof Y.VMLPieSlice, "The shape should be an instance of Y.PieSlice.");
    }
});

//suite of canvas specific tests
canvasTests = new Y.Test.Case({
    name: "CanvasGraphicsTests",

    graphic: null,

    mycircle: null,

    myrect: null,

    myellipse: null,

    mypath: null,

    initialFillColor: "#f00",

    initialFillOpacity: 0.5,

    initialStrokeColor: "#00f",

    initialStrokeWeight: 2,

    updatedFillColor: "#9aa",

    updatedStrokeColor: "#99a",

    width: 300,

    height: 200,

    context: null,
    
    linecap: "butt", 
    
    TORGB: Y.Color.toRGB,
    
    TOHEX: Y.Color.toHex,

    toRGBA: function(val, alpha) {
        alpha = (alpha !== undefined) ? alpha : 1;
        if (!Y.Color.re_RGB.test(val)) {
            val = this.TOHEX(val);
        }

        if(Y.Color.re_hex.exec(val)) {
            val = 'rgba(' + [
                parseInt(RegExp.$1, 16),
                parseInt(RegExp.$2, 16),
                parseInt(RegExp.$3, 16)
            ].join(',') + ',' + alpha + ')';
        }
        return val;
    },

    setUp: function () {
        Y.one("body").append('<div id="testbed"></div>');
    },

    tearDown: function () {
        Y.one("#testbed").remove(true);
    },

    "testCanvasGraphic()" : function()
    {
        Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="graphiccontainer"></div>');
        var graphic = new Y.Graphic({render: "#graphiccontainer"});
        graphic.on("init", function(e) {
            Y.Assert.isInstanceOf(HTMLElement, graphic.get("node"));
        });
        this.graphic = graphic;
    },

    "testCanvasRectNode()" : function()
    {
        var node,
            myrect = this.graphic.addShape({
            type: "rect",
            width: this.width,
            height: this.height,
            fill: {
                color: this.initialFillColor,
                opacity: this.initialFillOpacity
            },
            stroke: {
                color: this.initialStrokeColor,
                weight: this.initialStrokeWeight
            }
        });
        node = myrect.get("node");
        this.myrect = myrect;
        this.context = node.getContext("2d");
        Y.Assert.isInstanceOf(HTMLCanvasElement, node);
    },

    "testCanvasRectNodeDimensions()" : function()
    {
        var node = this.myrect.get("node"),
            stroke = this.myrect.get("stroke"),
            weight = stroke.weight;
        weight *= 2;
        Y.assert(node.getAttribute("width") == this.width + weight);
        Y.assert(node.getAttribute("height") == this.height + weight);
    },

    "testCanvasRectNodeFillColor()" : function() 
    {
        var node = this.myrect.get("node"),
            opacity = parseFloat(this.initialFillOpacity),
            fillColor = this.initialFillColor,
            shapeFillColor = this.context.fillStyle;
        opacity = Y.Lang.isNumber(opacity) && opacity < 1 ? opacity : 1;
        if(shapeFillColor.indexOf("RGBA") > -1 || shapeFillColor.indexOf("rgba") > -1)
        {
            shapeFillColor = shapeFillColor.toLowerCase();
            shapeFillColor = shapeFillColor.replace(/, /g, ",");
            fillColor = this.toRGBA(this.TOHEX(fillColor), opacity)
        }
        else
        {
            shapeFillColor = this.TOHEX(shapeFillColor);
            fillColor = this.TOHEX(fillColor);
        }
        Y.assert(shapeFillColor == fillColor);
    },

    "testCanvasRectNodeFillColorAgainstAttr()" : function() 
    {
        var node = this.myrect.get("node"),
            fill = this.myrect.get("fill"),
            opacity = parseFloat(fill.opacity),
            fillColor = fill.color,
            shapeFillColor = this.context.fillStyle;
        opacity = Y.Lang.isNumber(opacity) && opacity < 1 ? opacity : 1;
        if(shapeFillColor.indexOf("RGBA") > -1 || shapeFillColor.indexOf("rgba") > -1)
        {
            shapeFillColor = shapeFillColor.toLowerCase();
            shapeFillColor = shapeFillColor.replace(/, /g, ",");
            fillColor = this.toRGBA(this.TOHEX(fillColor), opacity)
        }
        else
        {
            shapeFillColor = this.TOHEX(shapeFillColor);
            fillColor = this.TOHEX(fillColor);
        }
        Y.assert(shapeFillColor == fillColor);
    },

    "testCanvasRectNodeStrokeColor" : function()
    {
        var node = this.myrect.get("node"),
            opacity = parseFloat(this.initialStrokeOpacity),
            strokeColor = this.TOHEX(this.initialStrokeColor),
            shapeStrokeColor = this.context.strokeStyle;
        opacity = Y.Lang.isNumber(opacity) && opacity < 1 ? opacity : 1
        if(shapeStrokeColor.indexOf("RGBA") > -1 || shapeStrokeColor.indexOf("rgba") > -1)
        {
            shapeStrokeColor = shapeStrokeColor.toLowerCase();
            shapeStrokeColor = shapeStrokeColor.replace(/, /g, ",");
            strokeColor = this.toRGBA(this.TOHEX(strokeColor), opacity)
        }
        else
        {
            shapeStrokeColor = this.TOHEX(shapeStrokeColor);
            strokeColor = this.TOHEX(strokeColor);
        }
        Y.assert(shapeStrokeColor == strokeColor);
    },

    "testCanvasRectNodeStrokeColorAgainstAttr()" : function() 
    {
        var node = this.myrect.get("node"),
            stroke = this.myrect.get("stroke"),
            opacity = parseFloat(stroke.opacity),
            strokeColor = this.TOHEX(stroke.color),
            shapeStrokeColor = this.context.strokeStyle;
        opacity = Y.Lang.isNumber(opacity) && opacity < 1 ? opacity : 1;
        if(shapeStrokeColor.indexOf("RGBA") > -1 || shapeStrokeColor.indexOf("rgba") > -1)
        {
            shapeStrokeColor = shapeStrokeColor.toLowerCase();
            shapeStrokeColor = shapeStrokeColor.replace(/, /g, ",");
            strokeColor = this.toRGBA(this.TOHEX(strokeColor), opacity)
        }
        else
        {
            shapeStrokeColor = this.TOHEX(shapeStrokeColor);
            strokeColor = this.TOHEX(strokeColor);
        }
        Y.assert(shapeStrokeColor == strokeColor);
    },

    "testCanvasRectNodeStrokeWidth" : function()
    {
        var weight = this.initialStrokeWeight,
            shapeWeight = this.context.lineWidth;
        Y.assert(weight == shapeWeight);
    },

    "testCanvasRectNodeStrokeWidthAgainstAttr()" : function()
    {
        var stroke = this.myrect.get("stroke"),
            weight = stroke.weight;
        Y.assert(weight == this.context.lineWidth);
    },

    "testCanvasRectNodeStrokeLineCap" : function()
    {
        Y.assert(this.context.lineCap == this.linecap);
    },

    "testCanvasRectNodeStrokeLineJoin" : function()
    {
        Y.assert(this.context.lineJoin == "round");
    },

    "testCanvasRectNodeWidthAgainstShapeAttr" : function()
    {
        var node = this.myrect.get("node"),
            stroke = this.myrect.get("stroke"),
            weight = stroke.weight || 0,
            width = this.myrect.get("width");
        width += weight * 2;
        Y.assert(node.getAttribute("width") == width);
    },
    
    "testCanvasRectNodeHeightAgainstShapeAttr" : function()
    {
        var node = this.myrect.get("node"),
            stroke = this.myrect.get("stroke"),
            weight = stroke.weight || 0,
            height = this.myrect.get("height");
        height += weight * 2;
        Y.assert(node.getAttribute("height") == height);
    },

    "testCanvasRectNodeStrokeLineJoinBevel" : function()
    {
        var myrect = this.myrect,
            context = this.context,
            bevel = "bevel";
        myrect.set("stroke", {
            linejoin: bevel
        });
        Y.Assert.areEqual(bevel, myrect.get("stroke").linejoin, "The value of the linejoin attribute should be " + bevel + ".");
        Y.Assert.areEqual(bevel, context.lineJoin, "The value of the shape's joinstyle attribute should be " + bevel + ".");
    },

    "testCanvasRectNodeStrokeLineJoinMiterLimit=3" : function()
    {
        var myrect = this.myrect,
            context = this.context,
            miterlimit = 3;
        myrect.set("stroke", {
            linejoin: miterlimit
        });
        Y.Assert.areEqual(miterlimit, myrect.get("stroke").linejoin, "The value of the linejoin attribute should be " + miterlimit + ".");
        Y.Assert.areEqual("miter", context.lineJoin, "The value of the shape's joinstyle attribute should be miter.");
        Y.Assert.areEqual(miterlimit, context.miterLimit, "The value of the shape's miterlimit attribute should be " + miterlimit + ".");
    },

    "testCanvasRect.test()" :function()
    {
        Y.Assert.isTrue(this.myrect.test(".yui3-canvasShape"), "The compareTo method should return true.");
        Y.Assert.isTrue(this.myrect.test(".yui3-canvasRect"), "The compareTo method should return true.");
        this.myrect.destroy();
    },
    
    "test addCanvasPieSlice()" : function()
    {
        var pieslice = graphic.addShape({
            type: "pieslice",
            stroke: {
                weight: 1,
                color: this.initialStrokeColor
            },
            fill: {
                color: this.initialFillColor
            },
            width: 420,
            height: 420,
            cx: 210,
            cy: 210,
            radius: 210,
            arc: 90
        });
        Y.Assert.isTrue(pieslice instanceof Y.CanvasPieSlice, "The shape should be an instance of Y.PieSlice.");
    }

}),

standaloneShape = new Y.Test.Case({
    setUp: function () {
        Y.one("body").append('<div id="testbed"></div>');
        Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="graphiccontainer"></div>');
        this.shape = new Y.Rect({
                graphic: "#graphiccontainer",
                type: "rect",
                width: 100,
                height: 100
            });
    },

    tearDown: function () {
        this.shape.destroy();
        Y.one("#testbed").remove(true);
    },

    "testStandaloneShape()" : function()
    {
        var shape = this.shape;
        Y.Assert.isTrue(shape instanceof Y.Shape);
        Y.Assert.isTrue(shape instanceof Y.Rect);
    }

}),

transformTests = new Y.Test.Case({
    name: "GraphicsTransformTests",

    graphic: null,

    myrect: null,

    initialFillColor: "#f00",

    initialStrokeColor: "#00f",

    defaultTransformString: "rotate(40) translate(45, 55) skew(30, 30)",

    width: 300,

    height: 200,

    setUp: function () {
        Y.one("body").append('<div id="testbed"></div>');
    },

    tearDown: function () {
        Y.one("#testbed").remove(true);
    },

    "testGraphicInstantiation()" : function()
    {
        Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="graphiccontainer"></div>');
        var graphic = new Y.Graphic({render: "#graphiccontainer"});
        graphic.on("init", function(e) {
            Y.Assert.isInstanceOf(Y.Graphic, graphic);
        });
        this.graphic = graphic;
    },

    "testTransformAttributeIntantiation()" : function()
    {
        var rect = this.graphic.addShape({
            type: "rect",
            width: this.width,
            height: this.height,
            stroke: {
                color: this.initialStrokeColor
            },
            fill: {
                color: this.initialFillColor
            },
            transform: this.defaultTransformString
        });
        this.rect = rect;
        Y.assert(this.rect.get("transform") == this.defaultTransformString);
    },

    "testAddTransformStringAppend()" : function()
    {
        var scaleString = this.defaultTransformString + " scale(2, 2)";
        this.rect.scale(2, 2);
        Y.assert(scaleString == this.rect.get("transform"));
    },

    "testAddTransformsAndCompareToString()": function()
    {
        this.rect.set("transform", "");
        Y.assert(this.rect.get("transform") == "");
        this.rect.translate(30, 10);
        this.rect.rotate(90);
        this.rect.skewX(10);
        Y.assert(this.rect.get("transform") == "translate(30, 10) rotate(90) skewX(10)");
    }
}),

visibleUpFrontTest = function(shape)
{
    return new Y.Test.Case({
        name: shape + "VisibleAttributeTest",

        setUp: function () {
            Y.one("body").append('<div id="testbed"></div>');
            Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="graphiccontainer"></div>');
            this.graphic = new Y.Graphic({render: "#graphiccontainer"});
            this.shape = this.graphic.addShape({
                    type: shape,
                    visible: false,
                    width: 100,
                    height: 100
                });
        },

        tearDown: function () {
            this.graphic.destroy();
            Y.one("#testbed").remove(true);
        },

        "testSetVisibleUpfront()" : function()
        {
            var shape = this.shape,
                node = shape.get("node");
            Y.assert(!shape.get("visible"));
            Y.assert(node.style.visibility == "hidden");
        }
    });
},

shapeSetIdTest = function(shape)
{
    return new Y.Test.Case({
        name: shape + "SetIdTest",

        shapeId: "testIdForShape",

        setUp: function () {
            Y.one("body").append('<div id="testbed"></div>');
            Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="graphiccontainer"></div>');
            this.graphic = new Y.Graphic({render: "#graphiccontainer"});
            this.shape = this.graphic.addShape({
                    type: shape,
                    visible: false,
                    width: 100,
                    height: 100
                });
        },

        tearDown: function () {
            this.graphic.destroy();
            Y.one("#testbed").remove(true);
        },

        "testShape.set(id)" : function()
        {
            var shape = this.shape,
                node = shape.get("node");
            shape.set("id", this.shapeId);
            Y.Assert.areEqual(this.shapeId, shape.get("id"), "The id for the shape instance should be " + this.id + ".");
            Y.Assert.areEqual(this.shapeId, node.id, "The id for the shape's dom element should be " + this.id + ".");
        }
    });
},

shapeSetIdUpFrontTest = function(shape)
{
    return new Y.Test.Case({
        name: shape + "SetIdUpFrontTest",

        shapeId: "testIdForShape",

        setUp: function () {
            Y.one("body").append('<div id="testbed"></div>');
            Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="graphiccontainer"></div>');
            this.graphic = new Y.Graphic({render: "#graphiccontainer"});
            this.shape = this.graphic.addShape({
                    type: shape,
                    visible: false,
                    width: 100,
                    height: 100,
                    id: this.shapeId
                });
        },

        tearDown: function () {
            this.graphic.destroy();
            Y.one("#testbed").remove(true);
        },

        "testShape.set(id)" : function()
        {
            var shape = this.shape,
                node = shape.get("node");
            Y.Assert.areEqual(this.shapeId, shape.get("id"), "The id for the shape instance should be " + this.id + ".");
            Y.Assert.areEqual(this.shapeId, node.id, "The id for the shape's dom element should be " + this.id + ".");
        }
    });
},

shapeGetXYTest = function(shape)
{
    return new Y.Test.Case({
        name: shape + "GetXYTest",

        shapeId: "getXYShape",

        shapeX: 40,

        shapeY: 20,

        setUp: function () {
            Y.one("body").append('<div id="testbed"></div>');
            Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="graphiccontainer"></div>');
            this.graphic = new Y.Graphic({render: "#graphiccontainer"});
            this.shape = this.graphic.addShape({
                    type: shape,
                    visible: false,
                    width: 100,
                    height: 100,
                    x: this.shapeX,
                    y: this.shapeY
                });
        },

        tearDown: function () {
            this.graphic.destroy();
            Y.one("#testbed").remove(true);
        },

        "testShape.getXY()" : function()
        {
            var shape = this.shape,
                x = this.shapeX,
                y = this.shapeY,
                parentXY = Y.one("#graphiccontainer").getXY(),
                xy = shape.getXY(),
                testX = parentXY[0] + x,
                testY = parentXY[1] + y;
            Y.Assert.areEqual(testX, xy[0], "The page x for the shape instance should be " + testX + ".");
            Y.Assert.areEqual(testY, xy[1], "The page y for the shape instance should be " + testY + ".");
        }
    });
},

shapeSetXYTest = function(shape)
{
    return new Y.Test.Case({
        name: shape + "SetXYTest",

        shapeId: "setXYShape",

        setX: 100,

        setY: 80,

        setUp: function () {
            Y.one("body").append('<div id="testbed"></div>');
            Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="graphiccontainer"></div>');
            this.graphic = new Y.Graphic({render: "#graphiccontainer"});
            this.shape = this.graphic.addShape({
                    type: shape,
                    visible: false,
                    width: 100,
                    height: 100,
                    x: 0,
                    y: 0
                });
            this.shape.setXY([this.setX, this.setY]);
        },

        tearDown: function () {
            this.graphic.destroy();
            Y.one("#testbed").remove(true);
        },

        "testShape.setXY()" : function()
        {
            var shape = this.shape,
                setX = this.setX,
                setY = this.setY,
                parentXY = Y.one("#graphiccontainer").getXY(),
                xy = shape.getXY(),
                x = xy[0],
                y = xy[1],
                shapeX = x - parentXY[0],
                shapeY = y - parentXY[1];
            Y.Assert.areEqual(setX, x, "The page x for the shape instance should be " + setX + ".");
            Y.Assert.areEqual(setY, y, "The page y for the shape instance should be " + setY + ".");
            Y.Assert.areEqual(shapeX, shape.get("x"), "The x attribute for the shape instance should be " + shapeX + ".");
            Y.Assert.areEqual(shapeY, shape.get("y"), "The y attribute for the shape instance should be " + shapeY + ".");
        }
    });
},

shapeAddClassTest = function(shape)
{
    return new Y.Test.Case({
        name: shape + "AddClassTest",

        shapeId: "addClassShape",

        myCustomClass: "myCustomClass",

        setUp: function () {
            Y.one("body").append('<div id="testbed"></div>');
            Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="graphiccontainer"></div>');
            this.graphic = new Y.Graphic({render: "#graphiccontainer"});
            this.shape = this.graphic.addShape({
                    type: shape,
                    width: 100,
                    y: 0
                });
        },

        tearDown: function () {
            this.graphic.destroy();
            Y.one("#testbed").remove(true);
        },

        "testShape.addClass()" : function()
        {
            var shape = this.shape,
                myclass = this.myCustomClass,
                classAttribute;
            shape.addClass(myclass);
            classAttribute = Y.one(shape.get("node")).get("className");
            if(classAttribute && classAttribute.baseVal)
            {
                classAttribute = classAttribute.baseVal;
            }
            Y.Assert.isTrue(classAttribute.indexOf(myclass) > -1,  "The shape node's class attribute should contain " + myclass + ".");
        }
    });
},

shapeRemoveClassTest = function(shape)
{
    return new Y.Test.Case({
        name: shape + "RemoveClassTest",

        shapeId: "removeClassShape",

        myCustomClass: "myCustomClass",

        setUp: function () {
            Y.one("body").append('<div id="testbed"></div>');
            Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="graphiccontainer"></div>');
            this.graphic = new Y.Graphic({render: "#graphiccontainer"});
            this.shape = this.graphic.addShape({
                    type: shape,
                    width: 100,
                    y: 0
                });
            this.shape.addClass(this.myCustomClass);
        },

        tearDown: function () {
            this.graphic.destroy();
            Y.one("#testbed").remove(true);
        },

        "testShape.removeClass()" : function()
        {
            var shape = this.shape,
                myclass = this.myCustomClass,
                classAttribute;
            shape.removeClass(myclass);
            classAttribute = Y.one(shape.get("node")).get("className");
            if(classAttribute && classAttribute.baseVal)
            {
                classAttribute = classAttribute.baseVal;
            }
            Y.Assert.isTrue(classAttribute.indexOf(myclass) === -1,  "The shape node's class attribute should not contain " + myclass + ".");
        }
    });
};

suite.add(graphicTests);
suite.add(visibleUpFrontTest("rect"));
suite.add(visibleUpFrontTest("circle"));
suite.add(visibleUpFrontTest("ellipse"));
suite.add(shapeSetIdTest("rect"));
suite.add(shapeSetIdTest("circle"));
suite.add(shapeSetIdTest("ellipse"));
suite.add(shapeSetIdUpFrontTest("rect"));
suite.add(shapeSetIdUpFrontTest("circle"));
suite.add(shapeSetIdUpFrontTest("ellipse"));
suite.add(standaloneShape);
suite.add(shapeGetXYTest("rect"));
suite.add(shapeGetXYTest("circle"));
suite.add(shapeGetXYTest("ellipse"));
suite.add(shapeSetXYTest("rect"));
suite.add(shapeSetXYTest("circle"));
suite.add(shapeSetXYTest("ellipse"));
suite.add(shapeAddClassTest("rect"));
suite.add(shapeAddClassTest("circle"));
suite.add(shapeAddClassTest("ellipse"));
suite.add(shapeRemoveClassTest("rect"));
suite.add(shapeRemoveClassTest("circle"));
suite.add(shapeRemoveClassTest("ellipse"));

if(ENGINE == "svg")
{
    suite.add(svgTests);
}
if(ENGINE == "vml")
{
   suite.add(vmlTests);
}
if(ENGINE == "canvas")
{
    suite.add(canvasTests);
}

suite.add(transformTests);

Y.Test.Runner.add( suite );

}, '@VERSION@' ,{requires:['graphics', 'test']});
