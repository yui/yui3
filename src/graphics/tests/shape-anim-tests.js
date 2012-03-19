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
    rectTranslateTest = new AnimTransformTest({
        type: "rect",
        fill: genericFill,
        stroke: genericStroke
    },
    {
        endTransform: "translate(10, 20)",
        NAME: "RectTranslateTest"
    }),
    rectRotateTest = new AnimTransformTest({
        type: "rect",
        fill: genericFill,
        stroke: genericStroke
    },
    {
        endTransform: "rotate(130)",
        NAME: "RectRotateTest"
    }),
    rectSkewXTest = new AnimTransformTest({
        type: "rect",
        fill: genericFill,
        stroke: genericStroke
    },
    {
        endTransform: "skewX(130)",
        NAME: "RectSkewXTest"
    }),
    rectSkewYTest = new AnimTransformTest({
        type: "rect",
        fill: genericFill,
        stroke: genericStroke
    },
    {
        endTransform: "skewY(180)",
        NAME: "RectSkewYTest"
    }),
    rectScaleTest = new AnimTransformTest({
        type: "rect",
        fill: genericFill,
        stroke: genericStroke
    },
    {
        endTransform: "scale(8, 5)",
        NAME: "RectScaleTest"
    }),
    rectScaleRotateTest = new AnimTransformTest({
        type: "rect",
        fill: genericFill,
        stroke: genericStroke
    },
    {
        endTransform: "scale(8, 5);rotate(110)",
        NAME: "RectScaleRotateTest"
    }),
    rectScaleRotateTranslateTest = new AnimTransformTest({
        type: "rect",
        fill: genericFill,
        stroke: genericStroke
    },
    {
        endTransform: "scale(8, 5);rotate(110);translate(10, 10)",
        NAME: "RectScaleRotateTranslateTest"
    }),
    rectScaleSkewXTranslateTest = new AnimTransformTest({
        type: "rect",
        fill: genericFill,
        stroke: genericStroke
    },
    {
        endTransform: "scale(8, 5);skewX(110);translate(10, 10)",
        NAME: "RectScaleSkewXTranslateTest"
    }),
    rectScaleSkewYTranslateTest = new AnimTransformTest({
        type: "rect",
        fill: genericFill,
        stroke: genericStroke
    },
    {
        endTransform: "scale(8, 5);skewY(110);translate(10, 10)",
        NAME: "RectScaleSkewYTranslateTest"
    }),
    rectMatrixTest = new AnimTransformTest({
        type: "rect",
        fill: genericFill,
        stroke: genericStroke
    },
    {
        endTransform: "matrix(2, -3, 1, 2, 12, 5)",
        NAME: "RectMatrixTest"
    });

suite.add(rectTranslateTest);
suite.add(rectRotateTest);
suite.add(rectSkewXTest);
suite.add(rectSkewYTest);
suite.add(rectScaleTest);
suite.add(rectScaleRotateTest);
suite.add(rectScaleRotateTranslateTest);
suite.add(rectScaleSkewXTranslateTest);
suite.add(rectScaleSkewYTranslateTest);
suite.add(rectMatrixTest);

Y.Test.Runner.add( suite );

}, '@VERSION@' ,{requires:['graphics', 'anim-shape-transform', 'test']});
