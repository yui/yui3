YUI.add('graphics-tests', function(Y) {

var suite = new Y.Test.Suite("Y.Graphic"),
    ENGINE = "vml",
    DOCUMENT = Y.config.doc,
	canvas = DOCUMENT && DOCUMENT.createElement("canvas"),
    graphicTests,
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
            Y.assert(graphic.get("node").nodeName == "group");
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
        Y.assert(myrect.get("node").nodeName == "rect");
    },

    "testVMLRectNodeDimensions()" : function()
    {
        var node = this.myrect.get("node");
        Y.assert(Y.one(node).getComputedStyle("width") == "300px");
        Y.assert(Y.one(node).getComputedStyle("height") == "200px");
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
        Y.assert(Y.one(node).getComputedStyle("width") == this.myrect.get("width") + "px");
    },
    
    "testVMLRectNodeHeightAgainstShapeAttr" : function()
    {
        var node = this.myrect.get("node");
        Y.assert(Y.one(node).getComputedStyle("height") == this.myrect.get("height") + "px");
    },

    "testVMLRectNodeFillAgainstShapeAttr" : function()
    {
        var node = this.myrect.get("node"),
            fill = this.myrect.get("fill"),
            toHex = Y.Color.toHex;
        Y.assert(toHex(fill.color) == toHex(node.fillcolor));
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
    }
});

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

visibleUpFrontTest = new Y.Test.Case({
    name: "Test visible attribute",

    setUp: function () {
        Y.one("body").append('<div id="testbed"></div>');
        Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="graphiccontainer"></div>');
        this.graphic = new Y.Graphic({render: "#graphiccontainer"});
        this.shape = this.graphic.addShape({
                type: "rect",
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

suite.add(graphicTests);
suite.add(visibleUpFrontTest);

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
