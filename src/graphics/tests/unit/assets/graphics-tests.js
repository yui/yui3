YUI.add('graphics-tests', function(Y) {

var suite = new Y.Test.Suite("Graphics: Base"),
    ENGINE = "vml",
    DOC = Y.config.doc,
	svg = DOC && DOC.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"),
	canvas = DOC && DOC.createElement("canvas"),
    graphicTests,
    svgTests,
    canvasTests,
    vmlTests,
    rectClassString, 
    circleClassString, 
    ellipseClassString, 
    pathClassString, 
    parentDiv = Y.DOM.create('<div style="position:absolute;top:0px;left:0px;" id="testdiv"></div>'),
    DEFAULTENGINE = Y.config.defaultGraphicEngine;

DOC.body.appendChild(parentDiv);
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

    startX: 5,

    startY: 5,

    setUp: function () {
        this.graphic = new Y.Graphic({
           render: "#testdiv",
           x: this.startX,
           y: this.startY
        });
    },

    tearDown: function () {
        this.graphic.destroy(); 
        //remove the focus event from the document as its not related to graphics.
        Y.Event.purgeElement(DOC, false);
    },

    "test set(x)set(y)" : function()
    {
        var graphic = this.graphic,
            x = 45,
            y = 60,
            startTop = this.startX + "px",
            startLeft = this.startX + "px",
            top = y + "px",
            left = x + "px",
            node = graphic.get("node");
        
        Y.Assert.areEqual(startLeft, Y.DOM.getStyle(node, "left"), "The left style should be " + startLeft + ".");
        Y.Assert.areEqual(startTop, Y.DOM.getStyle(node, "top"), "The top style should be " + startTop + ".");
        graphic.set("x", x);
        Y.Assert.areEqual(left, Y.DOM.getStyle(node, "left"), "The left style should be " + left + ".");
        graphic.set("y", y);
        Y.Assert.areEqual(top, Y.DOM.getStyle(node, "top"), "The top style should be " + top + ".");
    },
    
    "test addShape(circle)": function()
    {
        var graphic = this.graphic,
                diameter = 24,
                rad = 12,
                x = -5,
                y = -5,
                mycircle = graphic.addShape({
                type: "circle",
                stroke: {
                    color: this.initialStrokeColor,
                    weight: 1
                },
                fill: {
                    color: this.initialFillColor
                },
                radius: rad,
                x: x,
                y: y
            }),
            node = mycircle.get("node"),
            classString = Y.DOM.getAttribute(node, "class"),
            shapes = graphic.get("shapes"),
            id = mycircle.get("id"),
            stroke = mycircle.get("stroke"),
            fill = mycircle.get("fill");
        Y.Assert.isInstanceOf(Y.Graphic, graphic);
        Y.assert(mycircle instanceof Y.Circle);
        Y.Assert.areEqual(rad, mycircle.get("radius"), "The circle's radius should be " + rad + ".");
        Y.Assert.areEqual(diameter, mycircle.get("width"), "The circle's width should be " + diameter + ".");
        Y.Assert.areEqual(diameter, mycircle.get("width"), "The circle's height should be " + diameter + ".");
        Y.Assert.areEqual(this.initialStrokeColor, stroke.color, "The stroke color should be " + this.initialStrokeColor + ".");
        Y.Assert.areEqual(this.initialFillColor, fill.color, "The fill color should be " + this.initialFillColor + ".");
        Y.Assert.areEqual(x, mycircle.get("x"), "The x coordinate should be " + x + ".");
        Y.Assert.areEqual(y, mycircle.get("y"), "The y coordinate should be " + y + ".");
        Y.Assert.isTrue(mycircle.contains(node), "The contains method should return true.");
        Y.Assert.isTrue(mycircle.compareTo(node), "The compareTo method should return true.");
        Y.Assert.areEqual(circleClassString, classString, "The class string should be " + circleClassString + ".");
        mycircle.set("stroke", {
            color: this.updatedStrokeColor
        });
        Y.assert(this.updatedStrokeColor === mycircle.get("stroke").color);
        mycircle.set("fill", {
            color: this.updatedFillColor
        });
        Y.assert(this.updatedFillColor === mycircle.get("fill").color);
        graphic.removeShape(mycircle);
        Y.Assert.isFalse(shapes.hasOwnProperty(id) && shapes[id] instanceof Y.Circle);
    },
    
    "test addShape(rect)": function() 
    {
        var graphic = this.graphic,
            dashstyle = this.dashstyle.split(' '),
            weight = 2,
            x = 5,
            y = 5,
            width = 300,
            height = 200,
            myrect = graphic.addShape({
                type: "rect",
                stroke: {
                    weight: weight,
                    color: this.initialStrokeColor
                },
                fill: {
                    color: this.initialFillColor
                },
                x: x,
                y: y,
                width: width,
                height: height
            }),
            shapes = graphic.get("shapes"),
            id = myrect.get("id"),
            node = myrect.get("node"),
            stroke = myrect.get("stroke"),
            fill = myrect.get("fill"),
            classString = Y.DOM.getAttribute(node, "class");
        Y.Assert.isTrue(myrect instanceof Y.Rect, "The shape should be an instance of Y.Rect.");
        Y.Assert.areEqual(rectClassString, classString, "The class string should be " + rectClassString + ".");
        Y.Assert.areEqual(width, myrect.get("width"), "The width of the rect should be " + width + ".");
        Y.Assert.areEqual(height, myrect.get("height"), "The height of the rect should be " + height + ".");
        Y.Assert.areEqual(this.initialStrokeColor, stroke.color, "The stroke color should be " + this.initialStrokeColor + ".");
        Y.Assert.areEqual(this.initialFillColor, fill.color, "The fill color should be " + this.initialFillColor + ".");
        Y.Assert.areEqual(x, myrect.get("x"), "The x coordinate should be " + x + ".");
        Y.Assert.areEqual(y, myrect.get("y"), "The y coordinate should be " + y + ".");
        Y.Assert.areEqual(weight, stroke.weight, "The stroke weight should be " + weight + ".");
        myrect.set("stroke", {
            color: this.updatedStrokeColor
        });
        Y.Assert.areEqual(this.updatedStrokeColor, myrect.get("stroke").color, "The stroke color should be " + this.updatedStrokeColor + ".");
        myrect.set("fill", {
            color: this.updatedFillColor
        });
        Y.Assert.areEqual(this.updatedFillColor, myrect.get("fill").color, "The fill color should be " + this.updatedFillColor + ".");
        myrect.set("stroke", {
            weight: 0
        });
        Y.Assert.areEqual(0, myrect.get("stroke").weight, "The stroke weight should be 0.");
        myrect.set("stroke", {
            dashstyle: dashstyle
        });
        dashstyle = dashstyle.toString();
        Y.Assert.areEqual(dashstyle, myrect.get("stroke").dashstyle.toString(), "The dashstyle should be " + dashstyle + ".");
        graphic.removeShape(myrect);
        Y.Assert.isFalse(shapes.hasOwnProperty(id) && shapes[id] instanceof Y.Rect);
    },

    "test addShape(ellipse)": function()
    {
        var graphic = this.graphic,
            weight = 2,
            width = 100,
            height = 30,
            xRadius = 40,
            yRadius = 50,
            x = 100,
            y = 50,
            myellipse = graphic.addShape({
                type: "ellipse",
                stroke: {
                    color: this.initialStrokeColor,
                    weight: weight 
                },
                fill: {
                    color: this.initialFillColor
                },
                width: width,
                height: height,
                x:x,
                y:y
            }),
            shapes = graphic.get("shapes"),
            id = myellipse.get("id"),
            node = myellipse.get("node"),
            stroke = myellipse.get("stroke"),
            fill = myellipse.get("fill"),
            classString = Y.DOM.getAttribute(node, "class");
        Y.Assert.isTrue(myellipse instanceof Y.Ellipse, "The shape should be an instance of Y.Ellipse.");
        Y.Assert.areEqual(ellipseClassString, classString, "The class string should be " + ellipseClassString + ".");
        Y.Assert.areEqual(width, myellipse.get("width"), "The width of the ellipse should be " + width + ".");
        Y.Assert.areEqual(height, myellipse.get("height"), "The height of the ellipse should be " + height + ".");
        Y.Assert.areEqual(this.initialStrokeColor, stroke.color, "The stroke color should be " + this.initialStrokeColor + ".");
        Y.Assert.areEqual(this.initialFillColor, fill.color, "The fill color should be " + this.initialFillColor + ".");
        Y.Assert.areEqual(x, myellipse.get("x"), "The x coordinate should be " + x + ".");
        Y.Assert.areEqual(y, myellipse.get("y"), "The y coordinate should be " + y + ".");
        Y.Assert.areEqual(weight, stroke.weight, "The stroke weight should be " + weight + ".");
        myellipse.set("fill", {
            color: this.updatedFillColor
        });
        Y.Assert.areEqual(this.updatedFillColor, myellipse.get("fill").color, "The fill color should be " + this.updatedFillColor + ".");
        myellipse.set("fill", {
            color: this.updatedFillColor
        });
        Y.Assert.areEqual(this.updatedFillColor, myellipse.get("fill").color, "The fill color should be " + this.updatedFillColor + ".");
        myellipse.set("stroke", {
            weight: 0
        });
        Y.Assert.areEqual(0, myellipse.get("stroke").weight, "The stroke weight should be 0.");
        width = xRadius * 2;
        height = yRadius * 2;
        myellipse.set("xRadius", xRadius);
        Y.Assert.areEqual(xRadius, myellipse.get("xRadius"), "The xRadius of the ellipse should be " + xRadius + ".");
        Y.Assert.areEqual(width, myellipse.get("width"), "The width of the ellipse should be " + width + ".");
        myellipse.set("yRadius", yRadius);
        Y.Assert.areEqual(yRadius, myellipse.get("yRadius"), "The yRadius of the ellipse should be " + yRadius + ".");
        Y.Assert.areEqual(height, myellipse.get("height"), "The height of the ellipse should be " + height + ".");
        graphic.removeShape(myellipse);
        Y.Assert.isFalse(shapes.hasOwnProperty(id) && shapes[id] instanceof Y.Ellipse);
    },
    
    "test addEllipseWithXRadiusAndYRadius()": function()
    {
        var graphic = this.graphic,
            width = 50,
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
        Y.Assert.areEqual(xRadius, myellipse.get("xRadius"), "The xRadius of the ellipse should be " + xRadius + ".");
        Y.Assert.areEqual(width, myellipse.get("width"), "The width of the ellipse should be " + width + ".");
        Y.Assert.areEqual(yRadius, myellipse.get("yRadius"), "The yRadius of the ellipse should be " + yRadius + ".");
        Y.Assert.areEqual(height, myellipse.get("height"), "The height of the ellipse should be " + height + ".");
        myellipse.destroy();
    },
    
    "test addShape(path)": function()
    {
        var graphic = this.graphic,
            width = 120,
            height = 140,
            x = 0,
            y = 0,
            weight = 2,
            mypath = graphic.addShape({
                type: "path",
                stroke: {
                    weight: 2,
                    color: this.initialStrokeColor
                },
                fill: {
                    color: this.initialFillColor
                }
            }),
            shapes = graphic.get("shapes"),
            id = mypath.get("id"),
            stroke = mypath.get("stroke"),
            fill = mypath.get("fill"),
            node = mypath.get("node"),
            transform = "rotate(" + this.rotate + ")",
            classString = Y.DOM.getAttribute(node, "class");
        mypath.moveTo(-20, -20);
        mypath.lineTo(80, 120);
        mypath.lineTo(100, 80);
        mypath.lineTo(-20, -20);
        mypath.end();
        Y.Assert.isTrue(mypath instanceof Y.Path, "The shape should be an instance of Y.Path.");
        Y.Assert.areEqual(pathClassString, classString, "The class string should be " + pathClassString + ".");
        Y.Assert.areEqual(width, mypath.get("width"), "The width of the path should be " + width + ".");
        Y.Assert.areEqual(height, mypath.get("height"), "The height of the path should be " + height + ".");
        Y.Assert.areEqual(this.initialStrokeColor, stroke.color, "The stroke color should be " + this.initialStrokeColor + ".");
        Y.Assert.areEqual(this.initialFillColor, fill.color, "The fill color should be " + this.initialFillColor + ".");
        Y.Assert.areEqual(x, mypath.get("x"), "The x coordinate should be " + x + ".");
        Y.Assert.areEqual(y, mypath.get("y"), "The y coordinate should be " + y + ".");
        Y.Assert.areEqual(weight, stroke.weight, "The stroke weight should be " + weight + ".");
        mypath.set("stroke", {
            color: this.updatedStrokeColor
        });
        Y.Assert.areEqual(this.updatedStrokeColor, mypath.get("stroke").color, "The stroke color should be " + this.updatedStrokeColor + ".");
        mypath.set("fill", {
            color: this.updatedFillColor
        });
        Y.Assert.areEqual(this.updatedFillColor, mypath.get("fill").color, "The fill color should be " + this.updatedFillColor + ".");
        mypath.set("transform", "");
        mypath.rotate(this.rotate);
        Y.Assert.areEqual(transform, Y.Lang.trim(mypath.get("transform")), "The rotate attribute should be " + transform + ".");
            
        transform = "skewX(" + this.skewX + ")";
        mypath.set("transform", "");
        mypath.skewX(this.skewX);
        Y.Assert.areEqual(transform, Y.Lang.trim(mypath.get("transform")), "The skewX attribute should be " + transform + ".");
            
        transform = "skewY(" + this.skewY + ")";
        mypath.set("transform", "");
        mypath.skewY(this.skewY);
        Y.Assert.areEqual(transform, Y.Lang.trim(mypath.get("transform")), "The skewY attribute should be " + transform + ".");
        
        transform = "skew(" + this.skewX + ", " + this.skewY + ")";
        mypath.set("transform", "");
        mypath.skew(this.skewX, this.skewY);
        Y.Assert.areEqual(transform, Y.Lang.trim(mypath.get("transform")), "The transform attribute should be " + transform + ".");

        transform = "scale(" + this.scaleX + ", " + this.scaleY + ")";
        mypath.set("transform", "");
        mypath.scale(this.scaleX, this.scaleY);
        Y.Assert.areEqual(transform, Y.Lang.trim(mypath.get("transform")), "The transform attribute should be " + transform + ".");
        
        transform = "translate(" + this.translateX + ", " + this.translateY + ")";
        mypath.set("transform", "");
        mypath.translate(this.translateX, this.translateY);
        Y.Assert.areEqual(transform, Y.Lang.trim(mypath.get("transform")), "The transform attribute should be " + transform + ".");
            
        transform = "translateX(" + this.translateX + ")";
        mypath.set("transform", "");
        mypath.translateX(this.translateX);
        Y.Assert.areEqual(transform, Y.Lang.trim(mypath.get("transform")), "The transform attribute should be " + transform + ".");

        transform = "translateY(" + this.translateY + ")";
        mypath.set("transform", "");
        mypath.translateY(this.translateY);
        
        Y.Assert.areEqual(transform, Y.Lang.trim(mypath.get("transform")), "The transform attribute should be " + transform + ".");
        
        graphic.removeShape(mypath);
        Y.Assert.isFalse(shapes.hasOwnProperty(id) && shapes[id] instanceof Y.Path);
    },

    "test passRotation(rect)" : function()
    {
        var graphic = this.graphic,
            myrect = graphic.addShape({
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
        myrect.destroy();
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
        this.graphic = new Y.Graphic({render: "#testdiv"});
    },

    tearDown: function () {
        this.graphic.destroy(); 
        //remove the focus event from the document as its not related to graphics.
        Y.Event.purgeElement(DOC, false);
    },

    "testSVGGraphic()" : function()
    {
        var graphic = this.graphic;
        graphic.on("init", function(e) {
            Y.Assert.areEqual(graphic.get("node").nodeName.toLowerCase(), "div", "The node instance should be a div.");
            Y.Assert.isInstanceOf(SVGElement, graphic._contentNode);
        });
    },
    
    "testSVGRectNode()" : function()
    {
        var width = 300,
            height = 200,
            myrect = this.graphic.addShape({
                type: "rect",
                width: 300,
                height: 200,
                fill: {
                    color: this.initialFillColor
                },
                stroke: {
                    color: this.initialStrokeColor
                }
            }),
            node = myrect.get("node"),
            bevel = "bevel",
            fill = myrect.get("fill"),
            stroke = myrect.get("stroke"),
            linejoin = stroke.linejoin == undefined ? "round" : stroke.linejoin,
            miterlimit = 3,
            opacity = parseFloat(fill.opacity);
        opacity = isNaN(opacity) ? 1 : opacity;
        Y.Assert.isInstanceOf(SVGRectElement, node);
        Y.Assert.areEqual(width, Y.DOM.getAttribute(node, "width"), "The width should be " + width + ".");
        Y.Assert.areEqual(height, Y.DOM.getAttribute(node, "height"), "The height should be " + height + ".");
        Y.Assert.areEqual(this.initialFillColor, Y.DOM.getAttribute(node, "fill"), "The fill should be " + this.initialFillColor + ".");
        Y.Assert.areEqual(this.initialStrokeColor, Y.DOM.getAttribute(node, "stroke"), "The stroke should be " + this.initialStrokeColor + ".");
        Y.Assert.areEqual("1", Y.DOM.getAttribute(node, "fill-opacity"), "The fill-opacity should be 1.");
        Y.Assert.areEqual("1", Y.DOM.getAttribute(node, "stroke-width"), "The stroke-width should be 1.");
        Y.Assert.areEqual("1", Y.DOM.getAttribute(node, "stroke-opacity"), "The stroke-opacity should be 1.");
        Y.Assert.areEqual("none", Y.DOM.getAttribute(node, "stroke-dasharray"), "The stroke-dasharray should be none.");
        Y.Assert.areEqual("butt", Y.DOM.getAttribute(node, "stroke-linecap"), "The stroke-linecap should be butt.");
        Y.Assert.areEqual("round", Y.DOM.getAttribute(node, "stroke-linejoin"), "The stroke-linejoin should be round.");
        //test node width against shape attr
        width = myrect.get("width");
        Y.Assert.areEqual(width, Y.DOM.getAttribute(node, "width"), "The width should be " + width + ".");
        //test node height against shape attr
        width = myrect.get("height");
        Y.Assert.areEqual(height, Y.DOM.getAttribute(node, "height"), "The height should be " + height + ".");
        //test node fill against shape attr
        Y.Assert.areEqual(opacity, Y.DOM.getAttribute(node, "fill-opacity"), "The fill-opacity should equal " + opacity + ".");
        Y.Assert.areEqual(fill.color, Y.DOM.getAttribute(node, "fill"), "The fill should equal " + fill.color + ".");
        //test node stroke against shape attr
        opacity = parseFloat(stroke.opacity);
        opacity = isNaN(opacity) ? 1 : opacity;
        Y.Assert.areEqual(linejoin, Y.DOM.getAttribute(node, "stroke-linejoin"), "The stroke-linejoin should equal " + linejoin + ".");
        Y.Assert.areEqual(opacity, Y.DOM.getAttribute(node, "stroke-opacity"), "The stroke-opacity should equal " + opacity + ".");
        Y.Assert.areEqual(stroke.linecap, Y.DOM.getAttribute(node, "stroke-linecap"), "The stroke-linecap should equal " + stroke.linecap + ".");
        Y.Assert.areEqual(stroke.dashstyle, Y.DOM.getAttribute(node, "stroke-dasharray"), "The stroke-dasharray should equal " + stroke.dashstyle + ".");
        Y.Assert.areEqual(stroke.weight, Y.DOM.getAttribute(node, "stroke-width"), "The stroke-width should equal " + stroke.weight + ".");
        //test bevel line-join
        myrect.set("stroke", {
            linejoin: bevel
        });
        Y.Assert.areEqual(bevel, myrect.get("stroke").linejoin, "The value of the linejoin attribute should be " + bevel + ".");
        Y.Assert.areEqual(bevel, Y.DOM.getAttribute(node, "stroke-linejoin"), "The value of the shape's stroke-linejoin attribute should be " + bevel + ".");
        //test miterlimit
        myrect.set("stroke", {
            linejoin: miterlimit
        });
        Y.Assert.areEqual(miterlimit, myrect.get("stroke").linejoin, "The value of the linejoin attribute should be " + miterlimit + ".");
        Y.Assert.areEqual("miter", node.getAttribute("stroke-linejoin"), "The value of the shape's stroke-linejoin attribute should be miter.");
        Y.Assert.areEqual(miterlimit, Y.DOM.getAttribute(node, "stroke-miterlimit"), "The value of the shape's stroke-miterlimit attribute should be " + miterlimit + ".");
        
        Y.Assert.isTrue(myrect.test(".yui3-svgShape"), "The compareTo method should return true.");
        Y.Assert.isTrue(myrect.test(".yui3-svgRect"), "The compareTo method should return true.");
        myrect.destroy();
    },

    "test addSVGPieSlice()" : function()
    {
        var graphic = this.graphic,
            pieslice = graphic.addShape({
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
        this.graphic = new Y.Graphic({render: "#testdiv"});
    },

    tearDown: function () {
        this.graphic.destroy();
        //remove the focus event from the document as its not related to graphics.
        Y.Event.purgeElement(DOC, false);
    },

    "testVMLGraphic()" : function()
    {
        var graphic = this.graphic;
        graphic.on("init", function(e) {
            Y.Assert.areEqual(graphic.get("node").nodeName, "group", "The node should be a group element.");
        });
    },

    "testVMLRectNode()" : function()
    {
        var width = 300,
            height = 200,
            toHex = Y.Color.toHex,
            fillMatches = false,
            strokeColorMatches = false,
            strokeOpacityMatches = false,
            strokeDashStyleMatches = false,
            strokeLineCapMatches = false,
            strokeLineJoinMatches = false,
            childNodes,
            i,
            len,
            myrect = this.graphic.addShape({
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
            }),
            node = myrect.get("node"),
            miterlimit = 3,
            bevel = "bevel",
            fill = myrect.get("fill");
        Y.Assert.areEqual(node.nodeName, "rect", "The node should be of type rect.");
        Y.Assert.areEqual(parseFloat(Y.DOM.getComputedStyle(node, "width")), width, "The node should be 300 pixels wide.");
        Y.Assert.areEqual(parseFloat(Y.DOM.getComputedStyle(node, "height")), height, "The node should be 200 pixels high.");
        childNodes = node.childNodes; 
        len = childNodes ? childNodes.length : 0;
        for(i = 0; i < len; ++i)
        {
            if(childNodes[i] && childNodes[i].nodeName) {
                //test fill color
                if(childNodes[i].nodeName === "fill" && childNodes[i].color === this.initialFillColor)
                {
                    fillMatches = true;
                }
                
                if(childNodes[i].nodeName === "stroke") {
                    //test stroke color
                    if(toHex(childNodes[i].color) === toHex(this.initialStrokeColor) || toHex(childNodes[i].color.value) === toHex(this.initialStrokeColor)) {
                        strokeColorMatches = true;
                    }
                    //test stroke opacity
                    if(parseFloat(childNodes[i].opacity) === 1) {
                        strokeOpacityMatches = true;
                    }
                   
                    //test stroke dashstyle
                    if(childNodes[i].dashstyle && (childNodes[i].dashstyle + "") === this.dashstyle) {
                        strokeDashStyleMatches = true;
                    }
                    //test stroke linecap
                    if(childNodes[i].endcap && childNodes[i].endcap === "flat")
                    {
                        strokeLineCapMatches = true;
                    }
                    //test stroke linejoin 
                    if(childNodes[i].joinstyle && childNodes[i].joinstyle == this.linejoin)
                    {
                        strokeLineJoinMatches = true;
                    }
                }
            }
        }
        if(!fillMatches)
        {
            fillMatches = toHex(node.fillcolor) === toHex(this.initialFillColor) || toHex(node.fillcolor.value) === toHex(this.initialFillColor); 
        }
        Y.Assert.isTrue(fillMatches);
        if(!strokeColorMatches)
        {
            strokeColorMatches = toHex(node.strokecolor) == toHex(this.initialStrokeColor) || toHex(node.strokecolor.value) == toHex(this.initialStrokeColor); 
        }
        Y.Assert.isTrue(strokeColorMatches);
        if(!strokeOpacityMatches)
        {
            strokeOpacityMatches = node.strokeOpacity === "1";
        }

        Y.Assert.isTrue(strokeOpacityMatches, "The stroke opacity is not correct.");
        Y.Assert.isTrue(strokeDashStyleMatches, "The stroke dashstyle should be " + this.dashstyle + ".");
        Y.Assert.isTrue(strokeLineCapMatches, "The stroke endcap should be flat.");
        Y.Assert.isTrue(strokeLineJoinMatches, "The stroke linejoin should be " + this.linejoin + ".");
        
        Y.Assert.areEqual(Y.DOM.getComputedStyle(node, "width"),  myrect.get("width") + "px", "The width attribute value should be equal to the width of the html element.");
        Y.Assert.areEqual(Y.DOM.getComputedStyle(node, "height"), myrect.get("height") + "px", "The height attribute value should be equal to the height of the html element.");
        Y.Assert.areEqual(this.initialFillColor, fill.color, "The color value of the fill attribute should be " + this.initialFillColor + ".")
    
        myrect.set("stroke", {
            linejoin: bevel
        });
        Y.Assert.areEqual(bevel, myrect.get("stroke").linejoin, "The value of the linejoin attribute should be " + bevel + ".");
            
        myrect.set("stroke", {
            linejoin: miterlimit
        });
        Y.Assert.areEqual(miterlimit, myrect.get("stroke").linejoin, "The value of the linejoin attribute should be " + miterlimit + ".");

        Y.Assert.isTrue(myrect.test(".yui3-vmlShape"), "The compareTo method should return true.");
        Y.Assert.isTrue(myrect.test(".yui3-vmlRect"), "The compareTo method should return true.");
        myrect.destroy();
    },

    "test setRGBA()" : function()
    {
        var graphic = this.graphic,
            fillrgba = 'rgba(75, 75, 75, .5)',
            strokergba = 'rgba(217, 217, 217, .9)',
            toHex = Y.Color.toHex,
            rect = graphic.addShape({
                type: "rect",
                width: 10,
                height: 10,
                fill: {
                    color: fillrgba
                },
                stroke: {
                    color: strokergba
                }
            }),
            fillcolor = toHex(fillrgba),
            strokecolor = toHex(strokergba),
            fillopacity = .5,
            strokeopacity = .9,
            fill = rect.get("fill"),
            stroke = rect.get("stroke");
        Y.Assert.areEqual(fillcolor, fill.color, "The color of the fill should be " + fill.color + "."); 
        Y.Assert.areEqual(strokecolor, stroke.color, "The color of the stroke should be " + stroke.color + "."); 
        Y.Assert.areEqual(fillopacity, fill.opacity, "The opacity of the fill should be " + fill.opacity + "."); 
        Y.Assert.areEqual(strokeopacity, stroke.opacity, "The opacity of the stroke should be " + stroke.opacity + "."); 
    },

    "test addVMLPieSlice()" : function()
    {
        var graphic = this.graphic,
            pieslice = graphic.addShape({
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
        this.graphic = new Y.Graphic({render: "#testdiv"});
    },

    tearDown: function () {
        this.graphic.destroy();
        //remove the focus event from the document as its not related to graphics.
        Y.Event.purgeElement(DOC, false);
    },

    "testCanvasGraphic()" : function()
    {
        var graphic = this.graphic;
        graphic.on("init", function(e) {
            Y.Assert.isInstanceOf(HTMLElement, graphic.get("node"));
        });
        this.graphic = graphic;
    },

    "testCanvasRectNode()" : function()
    {
        var graphic = this.graphic,
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
                    weight: this.initialStrokeWeight,
                    opacity: this.initialFillOpacity
                }
            });
            node = myrect.get("node"),
            context = node.getContext("2d"),
            stroke = myrect.get("stroke"),
            weight = stroke.weight,
            opacity = parseFloat(this.initialFillOpacity),
            fillColor = this.initialFillColor,
            fillAttrColor = myrect.get("fill").color,
            shapeFillColor = context.fillStyle;
            strokeColor = this.TOHEX(this.initialStrokeColor),
            shapeStrokeColor = context.strokeStyle,
            strokeAttr = myrect.get("stroke"),
            strokeAttrColor = strokeAttr.color,
            strokeAttrWeight = strokeAttr.weight,
            bevel = "bevel",
            miterlimit = 3,
            width = this.width + (weight * 2),
            height = this.height + (weight * 2); 
        opacity = Y.Lang.isNumber(opacity) && opacity < 1 ? opacity : 1;
        Y.Assert.isInstanceOf(HTMLCanvasElement, node);
        Y.Assert.areEqual(width, Y.DOM.getAttribute(node, "width"), "The width should be " + width + ".");
        Y.Assert.areEqual(height, Y.DOM.getAttribute(node, "height"), "The height should be " + height + ".");
        if(shapeFillColor.indexOf("RGBA") > -1 || shapeFillColor.indexOf("rgba") > -1)
        {
            shapeFillColor = shapeFillColor.toLowerCase();
            shapeFillColor = shapeFillColor.replace(/, /g, ",");
            fillColor = this.toRGBA(this.TOHEX(fillColor), opacity)
            fillAttrColor = this.toRGBA(this.TOHEX(fillAttrColor), opacity)
        }
        else
        {
            shapeFillColor = this.TOHEX(shapeFillColor);
            fillColor = this.TOHEX(fillColor);
            fillAttrColor = this.TOHEX(fillAttrColor);
        }
        Y.Assert.areEqual(fillColor, shapeFillColor, "The fill color should be " + fillColor + ".");
        Y.Assert.areEqual(fillColor, fillAttrColor, "The fill attr color value should be " + fillColor + ".");
        if(shapeStrokeColor.indexOf("RGBA") > -1 || shapeStrokeColor.indexOf("rgba") > -1)
        {
            shapeStrokeColor = shapeStrokeColor.toLowerCase();
            shapeStrokeColor = shapeStrokeColor.replace(/, /g, ",");
            strokeColor = this.toRGBA(this.TOHEX(strokeColor), opacity)
            strokeAttrColor = this.toRGBA(this.TOHEX(strokeAttrColor), opacity)
        }
        else
        {
            shapeStrokeColor = this.TOHEX(shapeStrokeColor);
            strokeColor = this.TOHEX(strokeColor);
            strokeAttrColor = this.TOHEX(strokeAttrColor);
        }
        Y.Assert.areEqual(strokeColor, shapeStrokeColor, "The color of the stroke should be " + strokeColor + ".");
        Y.Assert.areEqual(strokeColor, strokeAttrColor, "The stroke attr color value should be " + strokeColor + ".");
        Y.Assert.areEqual(this.initialStrokeWeight, context.lineWidth, "The lineWidth should be " + this.initialStrokeWeight + ".");
        Y.Assert.areEqual(this.initialStrokeWeight, strokeAttrWeight, "The stroke attr weight value should be " + this.initialStrokeWeight + ".");
        Y.Assert.areEqual(this.linecap, context.lineCap, "The lineCap value should be " + this.linecap + ".");
        Y.Assert.areEqual("round", context.lineJoin, "The lineJoin value should be round.");
        Y.Assert.areEqual(width, Y.DOM.getAttribute(node, "width"), "The shape node's width should be " + width + ".");
        Y.Assert.areEqual(height, Y.DOM.getAttribute(node, "height"), "The shape node's height should be " + width + ".");
        myrect.set("stroke", {
            linejoin: bevel
        });
        Y.Assert.areEqual(bevel, myrect.get("stroke").linejoin, "The value of the linejoin attribute should be " + bevel + ".");
        Y.Assert.areEqual(bevel, context.lineJoin, "The value of the shape's joinstyle attribute should be " + bevel + ".");
        myrect.set("stroke", {
            linejoin: miterlimit
        });
        Y.Assert.areEqual(miterlimit, myrect.get("stroke").linejoin, "The value of the linejoin attribute should be " + miterlimit + ".");
        Y.Assert.areEqual("miter", context.lineJoin, "The value of the shape's joinstyle attribute should be miter.");
        Y.Assert.areEqual(miterlimit, context.miterLimit, "The value of the shape's miterlimit attribute should be " + miterlimit + ".");
        Y.Assert.isTrue(myrect.test(".yui3-canvasShape"), "The compareTo method should return true.");
        Y.Assert.isTrue(myrect.test(".yui3-canvasRect"), "The compareTo method should return true.");
        myrect.destroy();
    },

    "test addCanvasPieSlice()" : function()
    {
        var graphic = this.graphic,
            pieslice = graphic.addShape({
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
        this.shape = new Y.Rect({
                graphic: "#testdiv",
                type: "rect",
                width: 100,
                height: 100
            });
    },

    tearDown: function () {
        this.shape.destroy();
        //remove the focus event from the document as its not related to graphics.
        Y.Event.purgeElement(DOC, false);
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
        this.graphic = new Y.Graphic({render: "#testdiv"});
    },

    tearDown: function () {
        this.graphic.destroy();
        //remove the focus event from the document as its not related to graphics.
        Y.Event.purgeElement(DOC, false);
    },

    "testGraphicInstantiation()" : function()
    {
        var graphic = this.graphic;
        graphic.on("init", function(e) {
            Y.Assert.isInstanceOf(Y.Graphic, graphic);
        });
        this.graphic = graphic;
    },

    "testTransform()" : function()
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
            }),
            scaleString = this.defaultTransformString + " scale(2, 2)";
        Y.Assert.areEqual(this.defaultTransformString, rect.get("transform"), "The transform should be " + this.defaultTransformString + ".");
        rect.scale(2, 2);
        Y.Assert.areEqual(scaleString, rect.get("transform"), "The transform should be " + scaleString + ".");
        rect.set("transform", "");
        Y.Assert.areEqual("", rect.get("transform"), "The transform should be an empty string.");
        rect.translate(30, 10);
        rect.rotate(90);
        rect.skewX(10);
        Y.Assert.areEqual("translate(30, 10) rotate(90) skewX(10)", rect.get("transform"), "The transform should be translate(30, 10) rotate(90) skewX(10)");
    }
}),

visibleUpFrontTest = function(shape)
{
    return new Y.Test.Case({
        name: shape + "VisibleAttributeTest",

        setUp: function () {
            this.graphic = new Y.Graphic({render: "#testdiv"});
            this.shape = this.graphic.addShape({
                    type: shape,
                    visible: false,
                    width: 100,
                    height: 100
                });
        },

        tearDown: function () {
            this.shape.destroy();
            this.graphic.destroy();
            //remove the focus event from the document as its not related to graphics.
            Y.Event.purgeElement(DOC, false);
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
            this.graphic = new Y.Graphic({render: "#testdiv"});
            this.shape = this.graphic.addShape({
                    type: shape,
                    visible: false,
                    width: 100,
                    height: 100
                });
        },

        tearDown: function () {
            this.shape.destroy();
            this.graphic.destroy();
            //remove the focus event from the document as its not related to graphics.
            Y.Event.purgeElement(DOC, false);
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
            this.graphic = new Y.Graphic({render: "#testdiv"});
            this.shape = this.graphic.addShape({
                    type: shape,
                    visible: false,
                    width: 100,
                    height: 100,
                    id: this.shapeId
                });
        },

        tearDown: function () {
            this.shape.destroy();
            this.graphic.destroy();
            //remove the focus event from the document as its not related to graphics.
            Y.Event.purgeElement(DOC, false);
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
            this.graphic = new Y.Graphic({render: "#testdiv"});
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
            this.shape.destroy();
            this.graphic.destroy();
            //remove the focus event from the document as its not related to graphics.
            Y.Event.purgeElement(DOC, false);
        },

        "testShape.getXY()" : function()
        {
            var shape = this.shape,
                x = this.shapeX,
                y = this.shapeY,
                parentXY = Y.DOM.getXY(parentDiv),
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
            this.graphic = new Y.Graphic({render: "#testdiv"});
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
            this.shape.destroy();
            this.graphic.destroy();
            //remove the focus event from the document as its not related to graphics.
            Y.Event.purgeElement(DOC, false);
        },

        "testShape.setXY()" : function()
        {
            var shape = this.shape,
                setX = this.setX,
                setY = this.setY,
                parentXY = Y.DOM.getXY(parentDiv),
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
            this.graphic = new Y.Graphic({render: "#testdiv"});
            this.shape = this.graphic.addShape({
                    type: shape,
                    width: 100,
                    y: 0
                });
        },

        tearDown: function () {
            this.graphic.destroy();
            //remove the focus event from the document as its not related to graphics.
            Y.Event.purgeElement(DOC, false);
        },

        "testShape.addClass()" : function()
        {
            var shape = this.shape,
                myclass = this.myCustomClass,
                classAttribute;
            shape.addClass(myclass);
            classAttribute = Y.DOM.getAttribute(shape.get("node"), "className");
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
            this.graphic = new Y.Graphic({render: "#testdiv"});
            this.shape = this.graphic.addShape({
                    type: shape,
                    width: 100,
                    y: 0
                });
            this.shape.addClass(this.myCustomClass);
        },

        tearDown: function () {
            this.graphic.destroy();
            //remove the focus event from the document as its not related to graphics.
            Y.Event.purgeElement(DOC, false);
        },

        "testShape.removeClass()" : function()
        {
            var shape = this.shape,
                myclass = this.myCustomClass,
                classAttribute;
            shape.removeClass(myclass);
            classAttribute = Y.DOM.getAttribute(shape.get("node"), "className");
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

}, '@VERSION@' ,{requires:['graphics', 'color-base', 'test']});
