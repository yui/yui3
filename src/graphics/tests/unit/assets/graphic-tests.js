YUI.add('graphic-tests', function(Y) {

var suite = new Y.Test.Suite("Graphics: Graphic");
    ENGINE = "vml",
    DOCUMENT = Y.config.doc,
	svg = DOCUMENT && DOCUMENT.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"),
    canvas = DOCUMENT && DOCUMENT.createElement("canvas"),
    DEFAULTENGINE = Y.config.defaultGraphicEngine,
    parentDiv = Y.DOM.create('<div style="position:absolute;top:0px;left:0px;" id="testdiv"></div>'),
    DOC = Y.config.doc;
    DOC.body.appendChild(parentDiv);
if((canvas && canvas.getContext && canvas.getContext("2d")) && (DEFAULTENGINE == "canvas" || !svg))
{
    ENGINE = "canvas";
}
else if(svg)
{
    ENGINE = "svg";
}

function RoundedRect()
{
    RoundedRect.superclass.constructor.apply(this, arguments);
};

RoundedRect.NAME = "roundedRect";
Y.extend(RoundedRect, Y.Shape, {
    _draw: function()
    {
        var w = this.get("width"),
            h = this.get("height"),
            ew = this.get("ellipseWidth"),
            eh = this.get("ellipseHeight");
        this.clear();
        this.moveTo(0, eh);
        this.lineTo(0, h - eh);
        this.quadraticCurveTo(0, h, ew, h);
        this.lineTo(w - ew, h);
        this.quadraticCurveTo(w, h, w, h - eh);
        this.lineTo(w, eh);
        this.quadraticCurveTo(w, 0, w - ew, 0);
        this.lineTo(ew, 0);
        this.quadraticCurveTo(0, 0, 0, eh);
        this.end();
    }
}, {
    ATTRS: Y.mix({
        ellipseWidth: {
            value: 4
        },

        ellipseHeight: {
            value: 4
        }
    }, Y.Shape.ATTRS)
}); 
Y.RoundedRect = RoundedRect;
var GraphicTestTemplate = function(cfg, globalCfg) {
    var i;
    GraphicTestTemplate.superclass.constructor.apply(this);
    this.attrCfg = cfg;
    cfg.render = "#testdiv";
    for(i in globalCfg)
    {
        if(globalCfg.hasOwnProperty(i))
        {
            this[i] = globalCfg[i];
        }
    }
};

Y.extend(GraphicTestTemplate, Y.Test.Case, {
    graphicWidth: 500,

    graphicHeight: 400,

    setUp: function () {
        Y.DOM.setStyle(parentDiv, "width", this.graphicWidth + "px");
        Y.DOM.setStyle(parentDiv, "height", this.graphicHeight + "px");
        this.graphic = new Y.Graphic(this.attrCfg);
    },

    tearDown: function () {
        this.graphic.destroy();
        Y.DOM.setStyle(parentDiv, "width", "0px");
        Y.DOM.setStyle(parentDiv, "height", "0px");
        //remove the focus event from the document as its not related to graphics.
        Y.Event.purgeElement(DOC, false);
    }
});

Y.GraphicTestTemplate = GraphicTestTemplate;

var AddAndRemoveShapesTemplate = function()
{
    AddAndRemoveShapesTemplate.superclass.constructor.apply(this, arguments);
};
Y.extend(AddAndRemoveShapesTemplate, GraphicTestTemplate, {
        NAME: "AddAndRemoveShapesTests",
        testDefault: function()
        {
            this.addShapes();
            this.removeShapes();
        },

        addShapes: function()
        {
            var mygraphic = this.graphic,
                myrect,
                mycircle,
                myellipse,
                myroundrect,
                counter;
            counter = Y.Object.size(mygraphic.get("shapes"));
            Y.Assert.areEqual(0, counter, "There should be 0 shapes.");
            myrect = mygraphic.addShape({
                type: "rect",
                width: 20,
                height: 30,
                fill: {
                    color: "#9aa"
                }
            });
            counter = Y.Object.size(mygraphic.get("shapes"));
            Y.Assert.areEqual(1, counter, "There should be 1 shapes.");
            mycircle = mygraphic.addShape({
                type: "circle",
                radius: 6,
                fill: {
                    color: "#9aa"
                },
                stroke: {
                    weight: 1,
                    color: "#9aa"
                },
                x: 100,
                y: 100
            });
            counter = Y.Object.size(mygraphic.get("shapes"));
            Y.Assert.areEqual(2, counter, "There should be 2 shapes.");
            myellipse = mygraphic.addShape({
                type: "ellipse",
                width: 12,
                height: 8,
                fill: {
                    color: "#9aa"
                },
                stroke: {
                    weight: 1,
                    color: "#9aa"
                },
                x: 150,
                y: 150
            });
            counter = Y.Object.size(mygraphic.get("shapes"));
            Y.Assert.areEqual(3, counter, "There should be 3 shapes.");
            myroundrect = mygraphic.addShape({
                type: Y.RoundedRect,
                width: 30,
                height: 40,
                fill: {
                    color: "#9aa"
                },
                stroke: {
                    weight: 1,
                    color: "#9aa"
                },
                x: 200,
                y: 200
            });
            counter = Y.Object.size(mygraphic.get("shapes"));
            Y.Assert.areEqual(4, counter, "There should be 4 shapes.");
            this.rect = myrect;
            this.circle = mycircle;
            this.ellipse = myellipse;
            this.roundrect = myroundrect;
        },

        removeShapes: function()
        {
            var counter,
                mygraphic = this.graphic;
            counter = Y.Object.size(mygraphic.get("shapes"));
            Y.Assert.areEqual(4, counter, "There should be 4 shapes.");
            mygraphic.removeShape(this.rect);
            counter = Y.Object.size(mygraphic.get("shapes"));
            Y.Assert.areEqual(3, counter, "There should be 3 shapes.");
            mygraphic.removeShape(this.circle);
            counter = Y.Object.size(mygraphic.get("shapes"));
            Y.Assert.areEqual(2, counter, "There should be 2 shapes.");
            mygraphic.removeShape(this.ellipse); 
            counter = Y.Object.size(mygraphic.get("shapes"));
            Y.Assert.areEqual(1, counter, "There should be 1 shapes.");
            mygraphic.removeShape(this.roundrect); 
            counter = Y.Object.size(mygraphic.get("shapes"));
            Y.Assert.areEqual(0, counter, "There should be 0 shapes.");
        }
    });
    Y.AddAndRemoveShapesTemplate = AddAndRemoveShapesTemplate; 

var AddAndRemoveShapesByIdTemplate = function()
{
    AddAndRemoveShapesByIdTemplate.superclass.constructor.apply(this, arguments);
};
Y.extend(AddAndRemoveShapesByIdTemplate, AddAndRemoveShapesTemplate, {
    removeShapes: function()
    {
        var counter,
            mygraphic = this.graphic;
        counter = Y.Object.size(mygraphic.get("shapes"));
        Y.Assert.areEqual(4, counter, "There should be 4 shapes.");
        mygraphic.removeShape(this.rect.get("id"));
        counter = Y.Object.size(mygraphic.get("shapes"));
        Y.Assert.areEqual(3, counter, "There should be 3 shapes.");
        mygraphic.removeShape(this.circle.get("id"));
        counter = Y.Object.size(mygraphic.get("shapes"));
        Y.Assert.areEqual(2, counter, "There should be 2 shapes.");
        mygraphic.removeShape(this.ellipse.get("id")); 
        counter = Y.Object.size(mygraphic.get("shapes"));
        Y.Assert.areEqual(1, counter, "There should be 1 shapes.");
        mygraphic.removeShape(this.roundrect.get("id")); 
        counter = Y.Object.size(mygraphic.get("shapes"));
        Y.Assert.areEqual(0, counter, "There should be 0 shapes.");
    }
});

Y.AddAndRemoveShapesByIdTemplate = AddAndRemoveShapesByIdTemplate;

var batchTest = function(shape)
{
    return new Y.GraphicTestTemplate({},
    {
        NAME: shape + "BatchTests",

        testDefault: function()
        {
            var i,
                counter = 0,
                shapes,
                mygraphic = this.graphic;
            mygraphic.batch(function(){
                var myshape,
                    i = 0,
                    x = 0,
                    y = 0,
                    len = 100;
                for(; i < len; ++i)
                {
                    myshape = mygraphic.addShape({
                    type:shape,
                        stroke: {
                            color:"#f00",
                            weight: 1,
                            opacity: 0.5
                        },
                        fill: {
                            color:"#00f",
                            opacity: 0.3
                        },
                        width: 10,
                        height: 10,
                        x: x,
                        y: y
                    });
                    x += 3;
                    y += 3;
                }
            });
            shapes = this.graphic.get("shapes");
            counter = Y.Object.size(shapes);
            Y.Assert.areEqual(100, counter, "There should be 100 shapes.");
            mygraphic.clear();
            shapes = this.graphic.get("shapes");
            counter = Y.Object.size(shapes);
            Y.Assert.areEqual(0, counter, "There should be 0 shapes.");
        }
    });
},

addAndRemoveShapes = function(name, attrs)
{
    attrs = attrs || {};
    return new Y.AddAndRemoveShapesTemplate(attrs, {
        name: name
    });
};

addAndRemoveShapesById = function(name, attrs)
{
    attrs = attrs || {};
    return new Y.AddAndRemoveShapesByIdTemplate(attrs, {
        name: name 
    });
},

toggleVisibleTest = function(name, attrs)
{
    attrs = attrs || {};
    return new Y.AddAndRemoveShapesTemplate(attrs, {
        name: name,

        testDefault: function()
        {
            this.addShapes();
            var mygraphic = this.graphic,
            i,
            shapes = mygraphic.get("shapes"),
            shape;
            mygraphic.set("visible", false);
            for(i in shapes)
            {
                if(shapes.hasOwnProperty(i))
                {
                    shape = shapes[i];
                    Y.Assert.isFalse(shape.get("visible"), "The shape's visible attribute should be false.");
                    Y.Assert.areEqual("hidden", shape.get("node").style.visibility, "The visibility style of the shape's node should be hidden.");
                }
            }
            mygraphic.set("visible", true);
            for(i in shapes)
            {
                if(shapes.hasOwnProperty(i))
                {
                    shape = shapes[i];
                    Y.Assert.isTrue(shape.get("visible"), "The shape's visible attribute should be true.");
                    Y.Assert.areEqual("visible", shape.get("node").style.visibility, "The visibility style of the shape's node should be visible.");
                }
            }
            
            this.removeShapes();
        }
    });
},

addAndRemoveShapesAndTestIds = function(name, attrs) {
    attrs = attrs || {};
    return new Y.AddAndRemoveShapesTemplate(attrs, {
        name: name,

        testDefault: function()
        {
            this.addShapes();
            var mygraphic = this.graphic,
            i,
            shapes = mygraphic.get("shapes"),
            shape,
            id,
            domId,
            shapeById;
            for(i in shapes)
            {
                if(shapes.hasOwnProperty(i))
                {
                    shape = shapes[i];
                    id = shape.get("id");
                    domId = shape.get("node").id;
                    shapeById = mygraphic.getShapeById(id);
                    Y.Assert.areEqual(id, domId, "The dom id of the shape's node is " + domId + ". The id of the shape is " + id + ". They should be the same.");
                    Y.Assert.areEqual(shape, shapeById, "The shapes should be the same.");
                    Y.Assert.areEqual(shape.get("id"), shapeById.get("id"), "The shapes should have the same ids.");
                }
            }
            this.removeShapes();
        }
    });
},

addAndRemoveShapesAndSetAttributes = function(name, attrs) {
    return new Y.AddAndRemoveShapesTemplate({}, {
        name: name,

        testDefault: function()
        {
            this.addShapes();
            var mygraphic = this.graphic,
                i,
                val;
            for(i in attrs)
            {
                if(attrs.hasOwnProperty(i))
                {
                    val = attrs[i];
                    mygraphic.set(i, val);
                    Y.Assert.areEqual(val, mygraphic.get(i), "The value of " + i + " should be " + val + ".");
                    if(i == "id")
                    {
                        Y.Assert.areEqual(val, mygraphic.get("node").id, "The value of the graphic node's id should be " + val + ".");
                    }
                }
            }
            this.removeShapes();
        }
    });
},

graphicTestXY = new Y.GraphicTestTemplate({}, {
    name: "GraphicTestXY",

    testDefault: function()
    {
        var mygraphic = this.graphic,
            x = 20,
            y = 30,
            parentXY = Y.DOM.getXY(parentDiv),
            xy,
            testX = parentXY[0] + x,
            testY = parentXY[1] + y;
        mygraphic.set("x", x);
        mygraphic.set("y", y);
        xy = mygraphic.getXY();
        Y.Assert.areEqual(x, mygraphic.get("x"), "The x attribute for the graphic should be " + x + ".");
        Y.Assert.areEqual(y, mygraphic.get("y"), "The y attribute for the graphic should be " + y + ".");
        Y.Assert.areEqual(testX, xy[0], "The page x coordinate should be " + testX + ".");
        Y.Assert.areEqual(testY, xy[1], "The page y coordinate should be " + testY + ".");
    }
}),

GETDIMENSIONS = function(graphic)
{
    var node,
        dimensions,
        bounds,
        w,
        h,
        transform,
        matrix;
    if(ENGINE == "anvas")
    {
        node = graphic.get("node");
        transform = Y.DOM.getStyle(node, "transform");
        w = parseFloat(Y.DOM.getComputedStyle(node, "width"));
        h = parseFloat(Y.DOM.getComputedStyle(node, "height"));
        matrix = new Y.Matrix();
        matrix.applyCSSText(transform);
        bounds = matrix.getContentRect(w, h);
        dimensions = {
            //width: bounds.right - bounds.left,
            //height: bounds.bottom - bounds.top
            width: Y.DOM.getAttribute(node, "offsetWidth"),
            height: Y.DOM.getAttribute(node, "offsetHeight")
        }
    }
    else
    {
        node = graphic._contentNode;
        w = parseFloat(Y.DOM.getComputedStyle(node, "width"));
        h = parseFloat(Y.DOM.getComputedStyle(node, "height"));
        dimensions = {
            width: w,
            height : h
        }
    }
    return dimensions;
},

autoSizeContentToGraphic = function(name, w, h)
{

    return new Y.GraphicTestTemplate({
    }, {
        graphicWidth: w,

        graphicHeight: h,

        name: name,

        testDefault: function()
        {
            var mygraphic = this.graphic,
                node = (ENGINE == "svg") ? mygraphic._contentNode : mygraphic.get("node"),
                width,
                height;
                rect= mygraphic.addShape({
                    type: "rect",
                    width: 800,
                    height: 800,
                    fill: {
                        color: "#f00"
                    },
                    stroke: {
                        color: "#00f",
                        weight: 1
                    }
                });
            mygraphic.set("autoSize", "sizeContentToGraphic");
            width = parseFloat(Y.DOM.getComputedStyle(node, "width"));
            height = parseFloat(Y.DOM.getComputedStyle(node, "height"));
            Y.Assert.areEqual(this.graphicWidth, width, "The graphic width should be " + this.graphicWidth + ". The actual value is " + width + ".");
            Y.Assert.areEqual(this.graphicHeight, height, "The graphic height should be " + this.graphicHeight + ". The actual value is " + height + ".");
        }
    });
},

autoSizeContentToGraphicOverloadedSetter = function(name, w, h, preserveAspectRatio, resizeDown)
{
    return new Y.GraphicTestTemplate({
    }, {
        graphicWidth: w,

        graphicHeight: h,

        name: name,

        resizeDown: resizeDown,

        preserveAspectRatio: preserveAspectRatio,

        testDefault: function()
        {
            var mygraphic = this.graphic,
                node = (ENGINE == "svg") ? mygraphic._contentNode : mygraphic.get("node"),
                width,
                height;
                rect= mygraphic.addShape({
                    type: "rect",
                    width: 800,
                    height: 800,
                    fill: {
                        color: "#f00"
                    },
                    stroke: {
                        color: "#00f",
                        weight: 1
                    }
                });
            mygraphic.set({
                autoSize: "sizeContentToGraphic",
                resizeDown: this.resizeDown,
                preserveAspectRatio: this.preserveAspectRatio
            });
            width = parseFloat(Y.DOM.getComputedStyle(node, "width"));
            height = parseFloat(Y.DOM.getComputedStyle(node, "height"));
            Y.Assert.areEqual(this.graphicWidth, width, "The graphic width should be " + this.graphicWidth + ". The actual value is " + width + ".");
            Y.Assert.areEqual(this.graphicHeight, height, "The graphic height should be " + this.graphicHeight + ". The actual value is " + height + ".");
        }
    });
};


suite.add(batchTest("rect"));
suite.add(batchTest("circle"));
suite.add(batchTest("ellipse"));
suite.add(batchTest(Y.RoundedRect));
suite.add(addAndRemoveShapes("AddAndRemoveShapes"));
suite.add(addAndRemoveShapesById("AddAndRemoveShapesById"));
suite.add(addAndRemoveShapes("AddAndRemoveShapes", {autoSize: true}));
suite.add(addAndRemoveShapesById("AddAndRemoveShapesById", {autoSize: true}));
suite.add(addAndRemoveShapes("AddAndRemoveShapes", {autoDraw: true}));
suite.add(addAndRemoveShapesById("AddAndRemoveShapesById", {autoDraw: true}));
suite.add(addAndRemoveShapes("AddAndRemoveShapes", {resizeDown: true}));
suite.add(addAndRemoveShapesById("AddAndRemoveShapesById", {resizeDown: true}));
suite.add(addAndRemoveShapes("AddAndRemoveShapes", {id: "uniqueGraphicId"}));
suite.add(addAndRemoveShapesById("AddAndRemoveShapesById", {id: "uniqueGraphicId"}));
suite.add(addAndRemoveShapesAndSetAttributes("AddAndRemoveShapesAndSetAttributes", {
    id: "uniqueGraphicId",
    autoSize: true,
    autoDraw: true,
    resizeDown: true
}));
suite.add(graphicTestXY);
suite.add(addAndRemoveShapes("AddAndRemoveShapes", {visible: false}));
suite.add(addAndRemoveShapesById("AddAndRemoveShapesById", {resizeDown: false}));
suite.add(toggleVisibleTest("ToggleVisibleTest"));
suite.add(addAndRemoveShapesAndTestIds("TestGraphic.getShapeById()"));
suite.add(autoSizeContentToGraphic("SizeDownWide", 400, 300));
suite.add(autoSizeContentToGraphic("SizeDownTall", 300, 400));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownWideAspectRatioNone", 400, 300, "none", false));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownWideAspectRatioNoneResizeDown", 400, 300, "none", true));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownWideAspectRatioXMinYMin", 400, 300, "xMinYMin", false));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownWideAspectRatioXMinYMinResizeDown", 400, 300, "xMinYMin", true));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownWideAspectRatioXMidYMin", 400, 300, "xMidYMin", false));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownWideAspectRatioXMidYMinResizeDown", 400, 300, "xMidYMin", true));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownWideAspectRatioXMaxYMin", 400, 300, "xMaxYMin", false));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownWideAspectRatioXMaxYMinResizeDown", 400, 300, "xMaxYMin", true));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownWideAspectRatioXMinYMid", 400, 300, "xMinYMid", false));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownWideAspectRatioXMinYMidResizeDown", 400, 300, "xMinYMid", true));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownWideAspectRatioXMidYMid", 400, 300, "xMidYMid", false));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownWideAspectRatioXMidYMidResizeDown", 400, 300, "xMidYMid", true));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownWideAspectRatioXMaxYMid", 400, 300, "xMaxYMid", false));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownWideAspectRatioXMaxYMidResizeDown", 400, 300, "xMaxYMid", true));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownWideAspectRatioXMinYMax", 400, 300, "xMinYMax", false));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownWideAspectRatioXMinYMaxResizeDown", 400, 300, "xMinYMax", true));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownWideAspectRatioXMidYMax", 400, 300, "xMidYMax", false));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownWideAspectRatioXMidYMaxResizeDown", 400, 300, "xMidYMax", true));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownWideAspectRatioXMaxYMax", 400, 300, "xMaxYMax", false));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownWideAspectRatioXMaxYMaxResizeDown", 400, 300, "xMaxYMax", true));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownTallAspectRatioNone", 300, 400, "none", false));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownTallAspectRatioNoneResizeDown", 300, 400, "none", true));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownTallAspectRatioXMinYMin", 300, 400, "xMinYMin", false));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownTallAspectRatioXMinYMinResizeDown", 300, 400, "xMinYMin", true));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownTallAspectRatioXMidYMin", 300, 400, "xMidYMin", false));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownTallAspectRatioXMidYMinResizeDown", 300, 400, "xMidYMin", true));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownTallAspectRatioXMaxYMin", 300, 400, "xMaxYMin", false));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownTallAspectRatioXMaxYMinResizeDown", 300, 400, "xMaxYMin", true));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownTallAspectRatioXMinYMid", 300, 400, "xMinYMid", false));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownTallAspectRatioXMinYMidResizeDown", 300, 400, "xMinYMid", true));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownTallAspectRatioXMidYMid", 300, 400, "xMidYMid", false));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownTallAspectRatioXMidYMidResizeDown", 300, 400, "xMidYMid", true));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownTallAspectRatioXMaxYMid", 300, 400, "xMaxYMid", false));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownTallAspectRatioXMaxYMidResizeDown", 300, 400, "xMaxYMid", true));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownTallAspectRatioXMinYMax", 300, 400, "xMinYMax", false));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownTallAspectRatioXMinYMaxResizeDown", 300, 400, "xMinYMax", true));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownTallAspectRatioXMidYMax", 300, 400, "xMidYMax", false));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownTallAspectRatioXMidYMaxResizeDown", 300, 400, "xMidYMax", true));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownTallAspectRatioXMaxYMax", 300, 400, "xMaxYMax", false));
suite.add(autoSizeContentToGraphicOverloadedSetter("SizeDownTallAspectRatioXMaxYMaxResizeDown", 300, 400, "xMaxYMax", true));

Y.Test.Runner.add( suite );

}, '@VERSION@' ,{requires:['graphics', 'test']});
