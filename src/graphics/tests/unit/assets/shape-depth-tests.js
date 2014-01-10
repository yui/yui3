YUI.add('shape-depth-tests', function(Y) {

var suite = new Y.Test.Suite("Graphics: Shape Depth Tests"),
    parentDiv = Y.DOM.create('<div id="testdiv" style="width: 400px; height: 400px;">'),
    DepthTests,
    ENGINE = "vml",
    DOC = Y.config.doc,
	svg = DOC && DOC.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"),
    canvas = DOC && DOC.createElement("canvas"),
    DEFAULTENGINE = Y.config.defaultGraphicEngine;
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

DepthTests = new Y.Test.Case({
    name: "ShapeDepthTests",

    setUp: function() {
        this.graphic = new Y.Graphic({render: "#testdiv"});
        this.rect = this.graphic.addShape({
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
        this.circle = this.graphic.addShape({
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
        this.ellipse = this.graphic.addShape({
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
        this.roundRect = this.graphic.addShape({
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
        this._contentNode = ENGINE == "svg" ? this.graphic._contentNode : this.graphic.get("node");
    },

    tearDown: function() {
        this.graphic.destroy();
        Y.Event.purgeElement(DOC, false);
    },

    testDefault: function() {
        this.rectToFront();
        this.circleToFront();
        this.ellipseToFront();
        this.roundRectToFront();
        this.roundRectToBack();
        this.ellipseToBack();
        this.circleToBack();
        this.rectToBack();
    },

    rectToFront: function() {
        var shape = this.rect,
            shapeNode = shape.get("node"),
            contentNode = this._contentNode;
        Y.Assert.areNotEqual(shapeNode, contentNode.lastChild, "The shape's dom node should not be the last child of the graphic node.");
        shape.toFront();
        Y.Assert.areEqual(shapeNode, contentNode.lastChild, "The shape's dom node should be the last child of the graphic node.");
    },

    circleToFront: function() {
        var shape = this.circle,
            shapeNode = shape.get("node"),
            contentNode = this._contentNode;
        Y.Assert.areNotEqual(shapeNode, contentNode.lastChild, "The shape's dom node should not be the last child of the graphic node.");
        shape.toFront();
        Y.Assert.areEqual(shapeNode, contentNode.lastChild, "The shape's dom node should be the last child of the graphic node.");
    },

    ellipseToFront: function() {
        var shape = this.ellipse,
            shapeNode = shape.get("node"),
            contentNode = this._contentNode;
        Y.Assert.areNotEqual(shapeNode, contentNode.lastChild, "The shape's dom node should not be the last child of the graphic node.");
        shape.toFront();
        Y.Assert.areEqual(shapeNode, contentNode.lastChild, "The shape's dom node should be the last child of the graphic node.");
    },

    roundRectToFront: function() {
        var shape = this.roundRect,
            shapeNode = shape.get("node"),
            contentNode = this._contentNode;
        Y.Assert.areNotEqual(shapeNode, contentNode.lastChild, "The shape's dom node should not be the last child of the graphic node.");
        shape.toFront();
        Y.Assert.areEqual(shapeNode, contentNode.lastChild, "The shape's dom node should be the last child of the graphic node.");
    },
    
    roundRectToBack: function() {
        var shape = this.roundRect,
            shapeNode = shape.get("node"),
            contentNode = this._contentNode;
        Y.Assert.areNotEqual(shapeNode, contentNode.firstChild, "The shape's dom node should not be the first child of the graphic node.");
        shape.toBack();
        Y.Assert.areEqual(shapeNode, contentNode.firstChild, "The shape's dom node should be the first child of the graphic node.");
    },
    
    ellipseToBack: function() {
        var shape = this.ellipse,
            shapeNode = shape.get("node"),
            contentNode = this._contentNode;
        Y.Assert.areNotEqual(shapeNode, contentNode.firstChild, "The shape's dom node should not be the first child of the graphic node.");
        shape.toBack();
        Y.Assert.areEqual(shapeNode, contentNode.firstChild, "The shape's dom node should be the first child of the graphic node.");
    },
    
    circleToBack: function() {
        var shape = this.circle,
            shapeNode = shape.get("node"),
            contentNode = this._contentNode;
        Y.Assert.areNotEqual(shapeNode, contentNode.firstChild, "The shape's dom node should not be the first child of the graphic node.");
        shape.toBack();
        Y.Assert.areEqual(shapeNode, contentNode.firstChild, "The shape's dom node should be the first child of the graphic node.");
    },

    rectToBack: function() {
        var shape = this.rect,
            shapeNode = shape.get("node"),
            contentNode = this._contentNode;
        Y.Assert.areNotEqual(shapeNode, contentNode.firstChild, "The shape's dom node should not be the first child of the graphic node.");
        shape.toBack();
        Y.Assert.areEqual(shapeNode, contentNode.firstChild, "The shape's dom node should be the first child of the graphic node.");
    }
});

suite.add(DepthTests);
    

Y.Test.Runner.add( suite );

}, '@VERSION@' ,{requires:['graphics', 'test']});
