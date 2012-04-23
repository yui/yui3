YUI.add('shape-anim-tests', function(Y) {

var suite = new Y.Test.Suite("Y.Graphic"),
ShapeTestTemplate = function(cfg, globalCfg) {
    var i;
    ShapeTestTemplate.superclass.constructor.apply(this);
    cfg.width = cfg.width || 40;
    cfg.height = cfg.height || 30;
    this.attrCfg = cfg;
    for(i in globalCfg)
    {
        if(globalCfg.hasOwnProperty(i))
        {
            this[i] = globalCfg[i];
        }
    }
};

Y.extend(ShapeTestTemplate, Y.Test.Case, {
    name: "ShapeAnimTests",

    setUp: function () {
        var node,
            contentBounds,
            nodewidth,
            nodeheight;
        Y.one("body").append('<div id="testbed"></div>');
        Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="graphiccontainer"></div>');
        graphic = new Y.Graphic({render: "#graphiccontainer"});
        this.graphic = graphic;
        this.shape = graphic.addShape(this.attrCfg);
    },

    tearDown: function () {
        this.graphic.destroy();
        Y.one("#testbed").remove(true);
    }
});

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

function AnimTransformTest()
{
    AnimTransformTest.superclass.constructor.apply(this, arguments);
};

Y.extend(AnimTransformTest, ShapeTestTemplate, {
    test: function()
    {
            var anim = new Y.Anim({
                node: this.shape,
                duration: .5,
                easing: "easeNone",
                to: {
                    transform: this.endTransform 
                }
            }),
            test = this;

            anim.on('end', function() {
                test.resume(function() {
                    Y.Assert.areEqual(this.endTransform, this.shape.get("transform"));
                });
            });

            start = new Date();
            anim.run();
            test.wait(2000);
    }
});

var genericFill = {
        color: "#f00"
    },

    genericStroke = {
        color: "#00f",
        weight: 1
    },

    translateTest = function(shape) 
    {  
        return new AnimTransformTest({
            type: shape,
            fill: genericFill,
            stroke: genericStroke
        },
        {
            endTransform: "translate(10, 20)",
            NAME: shape + "TranslateTest"
        });
    },

    rotateTest = function(shape) 
    {  
        return new AnimTransformTest({
            type: shape,
            fill: genericFill,
            stroke: genericStroke
        },
        {
            endTransform: "rotate(130)",
            NAME: shape + "RotateTest"
        });
    },

    skewXTest = function(shape) 
    {  
        return new AnimTransformTest({
            type: shape,
            fill: genericFill,
            stroke: genericStroke
        },
        {
            endTransform: "skewX(130)",
            NAME: shape + "SkewXTest"
        });
    },

    skewYTest = function(shape) 
    {  
        return new AnimTransformTest({
            type: shape,
            fill: genericFill,
            stroke: genericStroke
        },
        {
            endTransform: "skewY(180)",
            NAME: shape + "SkewYTest"
        });
    },

    scaleTest = function(shape) 
    {  
        return new AnimTransformTest({
            type: shape,
            fill: genericFill,
            stroke: genericStroke
        },
        {
            endTransform: "scale(8, 5)",
            NAME: shape + "ScaleTest"
        });
    },

    scaleRotateTest = function(shape) 
    { 
        return new AnimTransformTest({
            type: shape,
            fill: genericFill,
            stroke: genericStroke
        },
        {
            endTransform: "scale(8, 5);rotate(110)",
            NAME: shape + "ScaleRotateTest"
        });
    },

    scaleRotateTranslateTest = function(shape) 
    { 
        return new AnimTransformTest({
            type: shape,
            fill: genericFill,
            stroke: genericStroke
        },
        {
            endTransform: "scale(8, 5);rotate(110);translate(10, 10)",
            NAME: shape + "ScaleRotateTranslateTest"
        });
    },

    scaleSkewXTranslateTest = function(shape) 
    { 
        return new AnimTransformTest({
            type: shape,
            fill: genericFill,
            stroke: genericStroke
        },
        {
            endTransform: "scale(8, 5);skewX(110);translate(10, 10)",
            NAME: shape + "ScaleSkewXTranslateTest"
        });
    },

    scaleSkewYTranslateTest = function(shape) 
    { 
        return new AnimTransformTest({
            type: shape,
            fill: genericFill,
            stroke: genericStroke
        },
        {
            endTransform: "scale(8, 5);skewY(110);translate(10, 10)",
            NAME: shape + "ScaleSkewYTranslateTest"
        });
    },

    matrixTest = function(shape) 
    { 
        return new AnimTransformTest({
            type: shape,
            fill: genericFill,
            stroke: genericStroke
        },
        {
            endTransform: "matrix(2, -3, 1, 2, 12, 5)",
            NAME: shape + "MatrixTest"
        });
    }

suite.add(translateTest("rect"));
suite.add(rotateTest("rect"));
suite.add(skewXTest("rect"));
suite.add(skewYTest("rect"));
suite.add(scaleTest("rect"));
suite.add(scaleRotateTest("rect"));
suite.add(scaleRotateTranslateTest("rect"));
suite.add(scaleSkewXTranslateTest("rect"));
suite.add(scaleSkewYTranslateTest("rect"));
suite.add(matrixTest("rect"));

suite.add(translateTest("circle"));
suite.add(rotateTest("circle"));
suite.add(skewXTest("circle"));
suite.add(skewYTest("circle"));
suite.add(scaleTest("circle"));
suite.add(scaleRotateTest("circle"));
suite.add(scaleRotateTranslateTest("circle"));
suite.add(scaleSkewXTranslateTest("circle"));
suite.add(scaleSkewYTranslateTest("circle"));
suite.add(matrixTest("circle"));

suite.add(translateTest("ellipse"));
suite.add(rotateTest("ellipse"));
suite.add(skewXTest("ellipse"));
suite.add(skewYTest("ellipse"));
suite.add(scaleTest("ellipse"));
suite.add(scaleRotateTest("ellipse"));
suite.add(scaleRotateTranslateTest("ellipse"));
suite.add(scaleSkewXTranslateTest("ellipse"));
suite.add(scaleSkewYTranslateTest("ellipse"));
suite.add(matrixTest("ellipse"));

suite.add(translateTest(Y.RoundedRect));
suite.add(rotateTest(Y.RoundedRect));
suite.add(skewXTest(Y.RoundedRect));
suite.add(skewYTest(Y.RoundedRect));
suite.add(scaleTest(Y.RoundedRect));
suite.add(scaleRotateTest(Y.RoundedRect));
suite.add(scaleRotateTranslateTest(Y.RoundedRect));
suite.add(scaleSkewXTranslateTest(Y.RoundedRect));
suite.add(scaleSkewYTranslateTest(Y.RoundedRect));
suite.add(matrixTest(Y.RoundedRect));

Y.Test.Runner.add( suite );

}, '@VERSION@' ,{requires:['graphics', 'anim-shape-transform', 'test']});
