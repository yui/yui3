YUI.add('shape-fillandstroke-tests', function(Y) {

var suite = new Y.Test.Suite("Graphics: Shape Fill And Stroke"),
ShapeTestTemplate = function(cfg, globalCfg) {
    var i;
    ShapeTestTemplate.superclass.constructor.apply(this);
    cfg.width = cfg.width || 40;
    cfg.height = cfg.height || 40;
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
    name: "ShapeFillAndStrokeTests",

    setUp: function () {
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

function FillAndStrokeTest()
{
    FillAndStrokeTest.superclass.constructor.apply(this, arguments);
};

Y.extend(FillAndStrokeTest, ShapeTestTemplate);
var solidTest = function()
    {
        var shape = this.shape,
            fill = shape.get("fill"),
            fillColor = this.fillColor != "none" ? this.fillColor : null;
        Y.Assert.areEqual(fillColor, fill.color, "The fill color should be " + fillColor + ".");
        Y.Assert.areEqual(this.fillOpacity, fill.opacity, "The fill opacity should be " + this.fillOpacity + ".");
    },

    gradientTest = function()
    {
        var shape = this.shape,
            fill = shape.get("fill"),
            stops = fill.stops,
            type = fill.type,
            len = stops.length,
            i = 0;
        for(; i < len; ++i)
        {
            if(stops[i])
            {
                if(stops[i].offset || Y.Lang.isNumber(stops[i].offset))
                {
                    Y.Assert.areEqual(this.offset[i], stops[i].offset, "The offset should be " + this.offset[i] + ".");
                }
                Y.Assert.areEqual(this.color[i], stops[i].color, "The color should be " + this.color[i] + ".");
                if(stops[i].opacity || Y.Lang.isNumber(stops[i].opacity))
                {
                    Y.Assert.areEqual(this.opacity[i], stops[i].opacity, "The opacity should be " + this.opacity[i] + ".");
                }

            }
        }
    },

    fillTest = function(shape, fill, stroke, props) 
    {  
        return new FillAndStrokeTest({
            type: shape,
            fill: fill,
            stroke: stroke
        }, props);
    },

    solidFillTest = function(shape, opacity, fillColor)
    {
        return new fillTest(shape, {
            type: "solid",
            opacity: opacity,
            color: fillColor
        },
        {
            color: "#00f",
            opacity: opacity
        },
        {
            fillColor: fillColor,
            fillOpacity: opacity,
            strokeColor: "#00f",
            strokeOpacity: opacity,
            test: solidTest,
            NAME: shape + " with solid fill with opacity of " + opacity + " for stroke and fill."
        });
    },

    solidFill = function(shape, opacity)
    {
        return solidFillTest(shape, opacity, "#f00");
    },

    solidFillNone = function(shape, opacity)
    {
        return solidFillTest(shape, opacity, "none");
    },

    gradientFill = function(shape, type, color, opacity, offset, opts)
    {
        var i = 0,
            len = color.length,
            stops = [],
            props = {},
            fill,
            key;
        for(; i < len; ++i)
        {
            stops[i] = {color: color[i]};
            if(opacity && Y.Lang.isNumber(opacity[i]))
            {
                stops[i].opacity = opacity[i];
            }
            if(offset && Y.Lang.isNumber(offset[i]))
            {
                stops[i].offset = offset[i];
            }
        }
        fill = {
            type: type,
            stops: stops
        };
        if(opts)
        {
            for(key in opts)
            {
                if(opts.hasOwnProperty(key))
                {
                    props[key] = opts[key];
                    fill[key] = opts[key];
                }
            }
        }
        if(color)
        {
            props.color = color;
        }
        if(opacity)
        {
            props.opacity = opacity;
        }
        if(offset)
        {
            props.offset = offset;
        }
        props.test = gradientTest;
        return new fillTest(shape, fill, {weight: 1, color: "#000"}, props);
    },

    threeColors = [
        "#ff0",
        "#f00",
        "#eee"
    ], 
    
    threeOpacities = [
        0.3,
        0.8,
        0.2
    ], 
    
    threeOffsets = [
        0.2,
        0.6,
        0.9
    ],

    radialPointTwos = {
        r: 0.2,
        fx: 0.2,
        fy: 0.2,
        cx: 0.2,
        cy: 0.2
    },

    radialAssortedValues = {
        r: 0.5,
        fx: 0.2,
        fy: 0.5,
        cx: 0.2,
        cy: 0.5
    },
    
    radialPointEights = {
        r: 0.8,
        fx: 0.8,
        fy: 0.8,
        cx: 0.8,
        cy: 0.8
    };
    
    suite.add(solidFill("rect", 0));
    suite.add(solidFill("rect", 0.1));
    suite.add(solidFill("rect", 0.2));
    suite.add(solidFill("rect", 0.3));
    suite.add(solidFill("rect", 0.4));
    suite.add(solidFill("rect", 0.5));
    suite.add(solidFill("rect", 0.6));
    suite.add(solidFill("rect", 0.7));
    suite.add(solidFill("rect", 0.8));
    suite.add(solidFill("rect", 0.9));
    suite.add(solidFill("rect", 1));
    suite.add(solidFill("ellipse", 0));
    suite.add(solidFill("ellipse", 0.1));
    suite.add(solidFill("ellipse", 0.2));
    suite.add(solidFill("ellipse", 0.3));
    suite.add(solidFill("ellipse", 0.4));
    suite.add(solidFill("ellipse", 0.5));
    suite.add(solidFill("ellipse", 0.6));
    suite.add(solidFill("ellipse", 0.7));
    suite.add(solidFill("ellipse", 0.8));
    suite.add(solidFill("ellipse", 0.9));
    suite.add(solidFill("ellipse", 1));
    suite.add(solidFill("circle", 0));
    suite.add(solidFill("circle", 0.1));
    suite.add(solidFill("circle", 0.2));
    suite.add(solidFill("circle", 0.3));
    suite.add(solidFill("circle", 0.4));
    suite.add(solidFill("circle", 0.5));
    suite.add(solidFill("circle", 0.6));
    suite.add(solidFill("circle", 0.7));
    suite.add(solidFill("circle", 0.8));
    suite.add(solidFill("circle", 0.9));
    suite.add(solidFill("circle", 1));
    
    suite.add(solidFillNone("rect", 0));
    suite.add(solidFillNone("rect", 0.1));
    suite.add(solidFillNone("rect", 0.2));
    suite.add(solidFillNone("rect", 0.3));
    suite.add(solidFillNone("rect", 0.4));
    suite.add(solidFillNone("rect", 0.5));
    suite.add(solidFillNone("rect", 0.6));
    suite.add(solidFillNone("rect", 0.7));
    suite.add(solidFillNone("rect", 0.8));
    suite.add(solidFillNone("rect", 0.9));
    suite.add(solidFillNone("rect", 1));
    suite.add(solidFillNone("ellipse", 0));
    suite.add(solidFillNone("ellipse", 0.1));
    suite.add(solidFillNone("ellipse", 0.2));
    suite.add(solidFillNone("ellipse", 0.3));
    suite.add(solidFillNone("ellipse", 0.4));
    suite.add(solidFillNone("ellipse", 0.5));
    suite.add(solidFillNone("ellipse", 0.6));
    suite.add(solidFillNone("ellipse", 0.7));
    suite.add(solidFillNone("ellipse", 0.8));
    suite.add(solidFillNone("ellipse", 0.9));
    suite.add(solidFillNone("ellipse", 1));
    suite.add(solidFillNone("circle", 0));
    suite.add(solidFillNone("circle", 0.1));
    suite.add(solidFillNone("circle", 0.2));
    suite.add(solidFillNone("circle", 0.3));
    suite.add(solidFillNone("circle", 0.4));
    suite.add(solidFillNone("circle", 0.5));
    suite.add(solidFillNone("circle", 0.6));
    suite.add(solidFillNone("circle", 0.7));
    suite.add(solidFillNone("circle", 0.8));
    suite.add(solidFillNone("circle", 0.9));
    suite.add(solidFillNone("circle", 1));
    
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, threeOffsets));
    suite.add(gradientFill("rect", "linear", threeColors, null, threeOffsets));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, null));
    suite.add(gradientFill("rect", "linear", threeColors, null, null));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 45}));
    suite.add(gradientFill("rect", "linear", threeColors, null, threeOffsets, {rotation: 45}));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, null, {rotation: 45}));
    suite.add(gradientFill("rect", "linear", threeColors, null, null, {rotation: 45}));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 90}));
    suite.add(gradientFill("rect", "linear", threeColors, null, threeOffsets, {rotation: 90}));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, null, {rotation: 90}));
    suite.add(gradientFill("rect", "linear", threeColors, null, null, {rotation: 90}));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 135}));
    suite.add(gradientFill("rect", "linear", threeColors, null, threeOffsets, {rotation: 135}));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, null, {rotation: 135}));
    suite.add(gradientFill("rect", "linear", threeColors, null, null, {rotation: 135}));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 180}));
    suite.add(gradientFill("rect", "linear", threeColors, null, threeOffsets, {rotation: 180}));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, null, {rotation: 180}));
    suite.add(gradientFill("rect", "linear", threeColors, null, null, {rotation: 180}));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 225}));
    suite.add(gradientFill("rect", "linear", threeColors, null, threeOffsets, {rotation: 225}));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, null, {rotation: 225}));
    suite.add(gradientFill("rect", "linear", threeColors, null, null, {rotation: 225}));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 270}));
    suite.add(gradientFill("rect", "linear", threeColors, null, threeOffsets, {rotation: 270}));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, null, {rotation: 270}));
    suite.add(gradientFill("rect", "linear", threeColors, null, null, {rotation: 270}));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 315}));
    suite.add(gradientFill("rect", "linear", threeColors, null, threeOffsets, {rotation: 315}));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, null, {rotation: 315}));
    suite.add(gradientFill("rect", "linear", threeColors, null, null, {rotation: 315}));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 360}));
    suite.add(gradientFill("rect", "linear", threeColors, null, threeOffsets, {rotation: 360}));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, null, {rotation: 360}));
    suite.add(gradientFill("rect", "linear", threeColors, null, null, {rotation: 360}));

    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, threeOffsets));
    suite.add(gradientFill("circle", "linear", threeColors, null, threeOffsets));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, null));
    suite.add(gradientFill("circle", "linear", threeColors, null, null));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 45}));
    suite.add(gradientFill("circle", "linear", threeColors, null, threeOffsets, {rotation: 45}));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, null, {rotation: 45}));
    suite.add(gradientFill("circle", "linear", threeColors, null, null, {rotation: 45}));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 90}));
    suite.add(gradientFill("circle", "linear", threeColors, null, threeOffsets, {rotation: 90}));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, null, {rotation: 90}));
    suite.add(gradientFill("circle", "linear", threeColors, null, null, {rotation: 90}));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 135}));
    suite.add(gradientFill("circle", "linear", threeColors, null, threeOffsets, {rotation: 135}));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, null, {rotation: 135}));
    suite.add(gradientFill("circle", "linear", threeColors, null, null, {rotation: 135}));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 180}));
    suite.add(gradientFill("circle", "linear", threeColors, null, threeOffsets, {rotation: 180}));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, null, {rotation: 180}));
    suite.add(gradientFill("circle", "linear", threeColors, null, null, {rotation: 180}));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 225}));
    suite.add(gradientFill("circle", "linear", threeColors, null, threeOffsets, {rotation: 225}));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, null, {rotation: 225}));
    suite.add(gradientFill("circle", "linear", threeColors, null, null, {rotation: 225}));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 270}));
    suite.add(gradientFill("circle", "linear", threeColors, null, threeOffsets, {rotation: 270}));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, null, {rotation: 270}));
    suite.add(gradientFill("circle", "linear", threeColors, null, null, {rotation: 270}));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 315}));
    suite.add(gradientFill("circle", "linear", threeColors, null, threeOffsets, {rotation: 315}));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, null, {rotation: 315}));
    suite.add(gradientFill("circle", "linear", threeColors, null, null, {rotation: 315}));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 360}));
    suite.add(gradientFill("circle", "linear", threeColors, null, threeOffsets, {rotation: 360}));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, null, {rotation: 360}));
    suite.add(gradientFill("circle", "linear", threeColors, null, null, {rotation: 360}));
    
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, threeOffsets));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, threeOffsets));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, null));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, null));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 45}));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, threeOffsets, {rotation: 45}));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, null, {rotation: 45}));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, null, {rotation: 45}));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 90}));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, threeOffsets, {rotation: 90}));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, null, {rotation: 90}));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, null, {rotation: 90}));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 135}));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, threeOffsets, {rotation: 135}));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, null, {rotation: 135}));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, null, {rotation: 135}));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 180}));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, threeOffsets, {rotation: 180}));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, null, {rotation: 180}));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, null, {rotation: 180}));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 225}));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, threeOffsets, {rotation: 225}));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, null, {rotation: 225}));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, null, {rotation: 225}));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 270}));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, threeOffsets, {rotation: 270}));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, null, {rotation: 270}));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, null, {rotation: 270}));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 315}));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, threeOffsets, {rotation: 315}));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, null, {rotation: 315}));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, null, {rotation: 315}));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 360}));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, threeOffsets, {rotation: 360}));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, null, {rotation: 360}));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, null, {rotation: 360}));
    
    suite.add(gradientFill("rect", "radial", threeColors, threeOpacities, threeOffsets));
    suite.add(gradientFill("rect", "radial", threeColors, null, threeOffsets));
    suite.add(gradientFill("rect", "radial", threeColors, threeOpacities, null));
    suite.add(gradientFill("rect", "radial", threeColors, null, null));
    suite.add(gradientFill("rect", "radial", threeColors, threeOpacities, threeOffsets, radialPointTwos));
    suite.add(gradientFill("rect", "radial", threeColors, null, threeOffsets, radialPointTwos));
    suite.add(gradientFill("rect", "radial", threeColors, threeOpacities, null, radialPointTwos));
    suite.add(gradientFill("rect", "radial", threeColors, null, null, radialPointTwos));
    suite.add(gradientFill("rect", "radial", threeColors, threeOpacities, threeOffsets, radialAssortedValues));
    suite.add(gradientFill("rect", "radial", threeColors, null, threeOffsets, radialAssortedValues));
    suite.add(gradientFill("rect", "radial", threeColors, threeOpacities, null, radialAssortedValues));
    suite.add(gradientFill("rect", "radial", threeColors, null, null, radialAssortedValues));
    suite.add(gradientFill("rect", "radial", threeColors, threeOpacities, threeOffsets, radialPointEights));
    suite.add(gradientFill("rect", "radial", threeColors, null, threeOffsets, radialPointEights));
    suite.add(gradientFill("rect", "radial", threeColors, threeOpacities, null, radialPointEights));
    suite.add(gradientFill("rect", "radial", threeColors, null, null, radialPointEights));
    
    suite.add(gradientFill("ellipse", "radial", threeColors, threeOpacities, threeOffsets));
    suite.add(gradientFill("ellipse", "radial", threeColors, null, threeOffsets));
    suite.add(gradientFill("ellipse", "radial", threeColors, threeOpacities, null));
    suite.add(gradientFill("ellipse", "radial", threeColors, null, null));
    suite.add(gradientFill("ellipse", "radial", threeColors, threeOpacities, threeOffsets, radialPointTwos));
    suite.add(gradientFill("ellipse", "radial", threeColors, null, threeOffsets, radialPointTwos));
    suite.add(gradientFill("ellipse", "radial", threeColors, threeOpacities, null, radialPointTwos));
    suite.add(gradientFill("ellipse", "radial", threeColors, null, null, radialPointTwos));
    suite.add(gradientFill("ellipse", "radial", threeColors, threeOpacities, threeOffsets, radialAssortedValues));
    suite.add(gradientFill("ellipse", "radial", threeColors, null, threeOffsets, radialAssortedValues));
    suite.add(gradientFill("ellipse", "radial", threeColors, threeOpacities, null, radialAssortedValues));
    suite.add(gradientFill("ellipse", "radial", threeColors, null, null, radialAssortedValues));
    suite.add(gradientFill("ellipse", "radial", threeColors, threeOpacities, threeOffsets, radialPointEights));
    suite.add(gradientFill("ellipse", "radial", threeColors, null, threeOffsets, radialPointEights));
    suite.add(gradientFill("ellipse", "radial", threeColors, threeOpacities, null, radialPointEights));
    suite.add(gradientFill("ellipse", "radial", threeColors, null, null, radialPointEights));

    suite.add(gradientFill("circle", "radial", threeColors, threeOpacities, threeOffsets));
    suite.add(gradientFill("circle", "radial", threeColors, null, threeOffsets));
    suite.add(gradientFill("circle", "radial", threeColors, threeOpacities, null));
    suite.add(gradientFill("circle", "radial", threeColors, null, null));
    suite.add(gradientFill("circle", "radial", threeColors, threeOpacities, threeOffsets, radialPointTwos));
    suite.add(gradientFill("circle", "radial", threeColors, null, threeOffsets, radialPointTwos));
    suite.add(gradientFill("circle", "radial", threeColors, threeOpacities, null, radialPointTwos));
    suite.add(gradientFill("circle", "radial", threeColors, null, null, radialPointTwos));
    suite.add(gradientFill("circle", "radial", threeColors, threeOpacities, threeOffsets, radialAssortedValues));
    suite.add(gradientFill("circle", "radial", threeColors, null, threeOffsets, radialAssortedValues));
    suite.add(gradientFill("circle", "radial", threeColors, threeOpacities, null, radialAssortedValues));
    suite.add(gradientFill("circle", "radial", threeColors, null, null, radialAssortedValues));
    suite.add(gradientFill("circle", "radial", threeColors, threeOpacities, threeOffsets, radialPointEights));
    suite.add(gradientFill("circle", "radial", threeColors, null, threeOffsets, radialPointEights));
    suite.add(gradientFill("circle", "radial", threeColors, threeOpacities, null, radialPointEights));
    suite.add(gradientFill("circle", "radial", threeColors, null, null, radialPointEights));

Y.Test.Runner.add( suite );

}, '@VERSION@' ,{requires:['graphics', 'test']});
