YUI.add('shape-depth-tests', function(Y) {

var suite = new Y.Test.Suite("Graphics: Graphic");
var suite = new Y.Test.Suite("Graphics: Shape Depth Tests"),
    DepthTests,
    ENGINE = "vml",
    DOCUMENT = Y.config.doc,
	svg = DOCUMENT && DOCUMENT.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"),
    canvas = DOCUMENT && DOCUMENT.createElement("canvas"),
    DEFAULTENGINE = Y.config.defaultGraphicEngine;

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

DepthTests = new Y.Test.Case({
    name: "ShapeDepthTests",

    loadShapes: function () {
        Y.one("body").append('<div id="testbed"></div>');
        Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="graphiccontainer"></div>');
        graphic = new Y.Graphic({render: "#graphiccontainer"});
        this.graphic = graphic;
        this.rect = graphic.addShape({
            type: "rect",
            width: 120,
            height: 80,
            x: 45,
            y: 45,
            fill: {
                color: "#f00"
            },
            stroke: {
                weight: 1,
                color: "#000"
            }
        });
        this.circle = graphic.addShape({
            type: "circle",
            radius: 45,
            x: 60,
            y: 70,
            fill: {
                color: "#00f"
            },
            stroke: {
                weight: 1,
                color: "#000"
            }
        });
        this.ellipse = graphic.addShape({
            type: "ellipse",
            width: 80,
            height: 110,
            x: 80,
            y: 50,
            fill: {
                color: "#9aa"
            },
            stroke: {
                weight: 1,
                color: "#000"
            }
        });
        this.roundRect = graphic.addShape({
            type: Y.RoundedRect,
            width: 130,
            height: 90,
            x: 100,
            y: 100,
            fill: {
                color: "#eee"
            },
            stroke: {
                weight: 1,
                color: "#000"
            }
        });
        this._contentNode = ENGINE == "svg" ? graphic._contentNode : graphic.get("node");
    },

    destroyShapesAndGraphic: function () {
        this.graphic.destroy();
        Y.one("#testbed").remove(true);
    },

    testRectToFront: function() {
        this.loadShapes();
        var shape = this.rect,
            shapeNode = shape.get("node"),
            contentNode = this._contentNode;
        Y.Assert.areNotEqual(shapeNode, contentNode.lastChild, "The shape's dom node should not be the last child of the graphic node.");
        shape.toFront();
        Y.Assert.areEqual(shapeNode, contentNode.lastChild, "The shape's dom node should be the last child of the graphic node.");
    },

    testCircleToFront: function() {
        var shape = this.circle,
            shapeNode = shape.get("node"),
            contentNode = this._contentNode;
        Y.Assert.areNotEqual(shapeNode, contentNode.lastChild, "The shape's dom node should not be the last child of the graphic node.");
        shape.toFront();
        Y.Assert.areEqual(shapeNode, contentNode.lastChild, "The shape's dom node should be the last child of the graphic node.");
    },

    testEllipseToFront: function() {
        var shape = this.ellipse,
            shapeNode = shape.get("node"),
            contentNode = this._contentNode;
        Y.Assert.areNotEqual(shapeNode, contentNode.lastChild, "The shape's dom node should not be the last child of the graphic node.");
        shape.toFront();
        Y.Assert.areEqual(shapeNode, contentNode.lastChild, "The shape's dom node should be the last child of the graphic node.");
    },

    testRoundRectToFront: function() {
        var shape = this.roundRect,
            shapeNode = shape.get("node"),
            contentNode = this._contentNode;
        Y.Assert.areNotEqual(shapeNode, contentNode.lastChild, "The shape's dom node should not be the last child of the graphic node.");
        shape.toFront();
        Y.Assert.areEqual(shapeNode, contentNode.lastChild, "The shape's dom node should be the last child of the graphic node.");
    },
    
    testRoundRectToBack: function() {
        var shape = this.roundRect,
            shapeNode = shape.get("node"),
            contentNode = this._contentNode;
        Y.Assert.areNotEqual(shapeNode, contentNode.firstChild, "The shape's dom node should not be the first child of the graphic node.");
        shape.toBack();
        Y.Assert.areEqual(shapeNode, contentNode.firstChild, "The shape's dom node should be the first child of the graphic node.");
    },
    
    testEllipseToBack: function() {
        var shape = this.ellipse,
            shapeNode = shape.get("node"),
            contentNode = this._contentNode;
        Y.Assert.areNotEqual(shapeNode, contentNode.firstChild, "The shape's dom node should not be the first child of the graphic node.");
        shape.toBack();
        Y.Assert.areEqual(shapeNode, contentNode.firstChild, "The shape's dom node should be the first child of the graphic node.");
    },
    
    testCircleToBack: function() {
        var shape = this.circle,
            shapeNode = shape.get("node"),
            contentNode = this._contentNode;
        Y.Assert.areNotEqual(shapeNode, contentNode.firstChild, "The shape's dom node should not be the first child of the graphic node.");
        shape.toBack();
        Y.Assert.areEqual(shapeNode, contentNode.firstChild, "The shape's dom node should be the first child of the graphic node.");
    },

    testRectToBack: function() {
        var shape = this.rect,
            shapeNode = shape.get("node"),
            contentNode = this._contentNode;
        Y.Assert.areNotEqual(shapeNode, contentNode.firstChild, "The shape's dom node should not be the first child of the graphic node.");
        shape.toBack();
        Y.Assert.areEqual(shapeNode, contentNode.firstChild, "The shape's dom node should be the first child of the graphic node.");
        this.destroyShapesAndGraphic();
    }
});

suite.add(DepthTests);
    

Y.Test.Runner.add( suite );

}, '@VERSION@' ,{requires:['graphics', 'test']});
