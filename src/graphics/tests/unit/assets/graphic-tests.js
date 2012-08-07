YUI.add('graphic-tests', function(Y) {

var suite = new Y.Test.Suite("Graphics: RoundedRect");

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
    cfg.render = "#graphiccontainer";
    for(i in globalCfg)
    {
        if(globalCfg.hasOwnProperty(i))
        {
            this[i] = globalCfg[i];
        }
    }
};

Y.extend(GraphicTestTemplate, Y.Test.Case, {
    setUp: function () {
        Y.one("body").append('<div id="testbed"></div>');
        Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="graphiccontainer"></div>');
        this.graphic = new Y.Graphic(this.attrCfg);
    },

    tearDown: function () {
        this.graphic.destroy();
        Y.one("#testbed").remove(true);
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
            parentXY = Y.one("#graphiccontainer").getXY(),
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
});


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

Y.Test.Runner.add( suite );

}, '@VERSION@' ,{requires:['graphics', 'test']});
