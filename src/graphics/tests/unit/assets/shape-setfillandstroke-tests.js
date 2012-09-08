YUI.add('shape-setfillandstroke-tests', function(Y) {

var suite = new Y.Test.Suite("Graphics: Set Shape Fill And Stroke"),
ShapeTestTemplate = function(cfg, globalCfg) {
    var i;
    ShapeTestTemplate.superclass.constructor.apply(this);
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
    name: "SetShapeFillAndStrokeTests",

    defaultFill: {
        type: "linear",
        stops: [
            {color: "#9aa"},
            {color: "#eee"}
        ]
    },
    
    setUp: function () {
        var startCfg = {
            stroke: {
                weight: 1,
                color: "#000"
            },
            width: 40,
            height: 40
        },
        fill = this.attrCfg.fill,
        stroke = this.attrCfg.stroke;
        startCfg.fill = this.defaultFill;
        startCfg.type = this.attrCfg.type;
        Y.one("body").append('<div id="testbed"></div>');
        Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="graphiccontainer"></div>');
        graphic = new Y.Graphic({render: "#graphiccontainer"});
        this.graphic = graphic;
        this.shape = graphic.addShape(startCfg);
        if(stroke)
        {
            this.shape.set("stroke", stroke);
        }
        if(fill)
        {
            this.shape.set("fill", fill);
        }
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
            fill = shape.get("fill");
        Y.Assert.areEqual(this.fillColor, fill.color, "The fill color should be " + this.fillColor + ".");
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

    solidFill = function(shape, opacity)
    {
        return new fillTest(shape, {
            type: "solid",
            opacity: opacity,
            color: "#f00"
        },
        {
            color: "#00f",
            opacity: opacity
        },
        {
            fillColor: "#f00",
            fillOpacity: opacity,
            strokeColor: "#00f",
            strokeOpacity: opacity,
            test: solidTest,
            NAME: shape + " with solid fill with opacity of " + opacity + " for stroke and fill."
        });
    },

    gradientFill = function(shape, type, color, opacity, offset, opts, defaultFill)
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
        if(defaultFill)
        {
            props.defaultFill = defaultFill;
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

    noFill = {
        type: "none",
        color: "none"
    },

    fourStops = {
        type: "linear",
        stops: [
            {color: "#f00", opacity: 0.3, offset: 0.2},
            {color: "#fc0", opacity: 0.8, offset: 0.4},
            {color: "#ffe", opacity: 0.2, offset: 0.6},
            {color: "#00f", opacity: 0.4, offset: 0.9}
        ]
    },

    fourRadialStops = {
        type: "radial",
        stops: [
            {color: "#f00", opacity: 0.3, offset: 0.2},
            {color: "#fc0", opacity: 0.8, offset: 0.4},
            {color: "#ffe", opacity: 0.2, offset: 0.6},
            {color: "#00f", opacity: 0.4, offset: 0.9}
        ],
        r: 0.2,
        fx: 0.2,
        fy: 0.2,
        cx: 0.2,
        cy: 0.2
    },

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
    
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, threeOffsets, null, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, null, threeOffsets, null, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, null, null, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, null, null, null, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 45}, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, null, threeOffsets, {rotation: 45}, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, null, {rotation: 45}, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, null, null, {rotation: 45}, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 90}, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, null, threeOffsets, {rotation: 90}, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, null, {rotation: 90}, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, null, null, {rotation: 90}, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 135}, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, null, threeOffsets, {rotation: 135}, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, null, {rotation: 135}, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, null, null, {rotation: 135}, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 180}, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, null, threeOffsets, {rotation: 180}, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, null, {rotation: 180}, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, null, null, {rotation: 180}, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 225}, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, null, threeOffsets, {rotation: 225}, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, null, {rotation: 225}, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, null, null, {rotation: 225}, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 270}, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, null, threeOffsets, {rotation: 270}, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, null, {rotation: 270}, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, null, null, {rotation: 270}, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 315}, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, null, threeOffsets, {rotation: 315}, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, null, {rotation: 315}, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, null, null, {rotation: 315}, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 360}, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, null, threeOffsets, {rotation: 360}, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, null, {rotation: 360}, fourStops));
    suite.add(gradientFill("rect", "linear", threeColors, null, null, {rotation: 360}, fourStops));

    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, threeOffsets, null, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, threeOffsets, null, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, null, null, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, null, null, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 45}, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, threeOffsets, {rotation: 45}, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, null, {rotation: 45}, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, null, {rotation: 45}, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 90}, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, threeOffsets, {rotation: 90}, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, null, {rotation: 90}, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, null, {rotation: 90}, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 135}, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, threeOffsets, {rotation: 135}, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, null, {rotation: 135}, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, null, {rotation: 135}, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 180}, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, threeOffsets, {rotation: 180}, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, null, {rotation: 180}, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, null, {rotation: 180}, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 225}, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, threeOffsets, {rotation: 225}, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, null, {rotation: 225}, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, null, {rotation: 225}, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 270}, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, threeOffsets, {rotation: 270}, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, null, {rotation: 270}, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, null, {rotation: 270}, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 315}, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, threeOffsets, {rotation: 315}, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, null, {rotation: 315}, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, null, {rotation: 315}, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 360}, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, threeOffsets, {rotation: 360}, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, null, {rotation: 360}, fourStops));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, null, {rotation: 360}, fourStops));

    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, threeOffsets, null, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, null, threeOffsets, null, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, null, null, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, null, null, null, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 45}, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, null, threeOffsets, {rotation: 45}, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, null, {rotation: 45}, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, null, null, {rotation: 45}, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 90}, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, null, threeOffsets, {rotation: 90}, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, null, {rotation: 90}, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, null, null, {rotation: 90}, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 135}, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, null, threeOffsets, {rotation: 135}, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, null, {rotation: 135}, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, null, null, {rotation: 135}, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 180}, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, null, threeOffsets, {rotation: 180}, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, null, {rotation: 180}, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, null, null, {rotation: 180}, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 225}, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, null, threeOffsets, {rotation: 225}, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, null, {rotation: 225}, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, null, null, {rotation: 225}, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 270}, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, null, threeOffsets, {rotation: 270}, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, null, {rotation: 270}, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, null, null, {rotation: 270}, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 315}, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, null, threeOffsets, {rotation: 315}, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, null, {rotation: 315}, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, null, null, {rotation: 315}, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 360}, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, null, threeOffsets, {rotation: 360}, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, null, {rotation: 360}, fourStops));
    suite.add(gradientFill("circle", "linear", threeColors, null, null, {rotation: 360}, fourStops));
    
    suite.add(gradientFill("rect", "radial", threeColors, threeOpacities, threeOffsets, null, fourRadialStops));
    suite.add(gradientFill("rect", "radial", threeColors, null, threeOffsets, null, fourRadialStops));
    suite.add(gradientFill("rect", "radial", threeColors, threeOpacities, null, null, fourRadialStops));
    suite.add(gradientFill("rect", "radial", threeColors, null, null, null, fourRadialStops));
    suite.add(gradientFill("rect", "radial", threeColors, threeOpacities, threeOffsets, radialPointTwos, fourRadialStops));
    suite.add(gradientFill("rect", "radial", threeColors, null, threeOffsets, radialPointTwos, fourRadialStops));
    suite.add(gradientFill("rect", "radial", threeColors, threeOpacities, null, radialPointTwos, fourRadialStops));
    suite.add(gradientFill("rect", "radial", threeColors, null, null, radialPointTwos, fourRadialStops));
    suite.add(gradientFill("rect", "radial", threeColors, threeOpacities, threeOffsets, radialAssortedValues, fourRadialStops));
    suite.add(gradientFill("rect", "radial", threeColors, null, threeOffsets, radialAssortedValues, fourRadialStops));
    suite.add(gradientFill("rect", "radial", threeColors, threeOpacities, null, radialAssortedValues, fourRadialStops));
    suite.add(gradientFill("rect", "radial", threeColors, null, null, radialAssortedValues, fourRadialStops));
    suite.add(gradientFill("rect", "radial", threeColors, threeOpacities, threeOffsets, radialPointEights, fourRadialStops));
    suite.add(gradientFill("rect", "radial", threeColors, null, threeOffsets, radialPointEights, fourRadialStops));
    suite.add(gradientFill("rect", "radial", threeColors, threeOpacities, null, radialPointEights, fourRadialStops));
    suite.add(gradientFill("rect", "radial", threeColors, null, null, radialPointEights, fourRadialStops));

    suite.add(gradientFill("ellipse", "radial", threeColors, threeOpacities, threeOffsets, null, fourRadialStops));
    suite.add(gradientFill("ellipse", "radial", threeColors, null, threeOffsets, null, fourRadialStops));
    suite.add(gradientFill("ellipse", "radial", threeColors, threeOpacities, null, null, fourRadialStops));
    suite.add(gradientFill("ellipse", "radial", threeColors, null, null, null, fourRadialStops));
    suite.add(gradientFill("ellipse", "radial", threeColors, threeOpacities, threeOffsets, radialPointTwos, fourRadialStops));
    suite.add(gradientFill("ellipse", "radial", threeColors, null, threeOffsets, radialPointTwos, fourRadialStops));
    suite.add(gradientFill("ellipse", "radial", threeColors, threeOpacities, null, radialPointTwos, fourRadialStops));
    suite.add(gradientFill("ellipse", "radial", threeColors, null, null, radialPointTwos, fourRadialStops));
    suite.add(gradientFill("ellipse", "radial", threeColors, threeOpacities, threeOffsets, radialAssortedValues, fourRadialStops));
    suite.add(gradientFill("ellipse", "radial", threeColors, null, threeOffsets, radialAssortedValues, fourRadialStops));
    suite.add(gradientFill("ellipse", "radial", threeColors, threeOpacities, null, radialAssortedValues, fourRadialStops));
    suite.add(gradientFill("ellipse", "radial", threeColors, null, null, radialAssortedValues, fourRadialStops));
    suite.add(gradientFill("ellipse", "radial", threeColors, threeOpacities, threeOffsets, radialPointEights, fourRadialStops));
    suite.add(gradientFill("ellipse", "radial", threeColors, null, threeOffsets, radialPointEights, fourRadialStops));
    suite.add(gradientFill("ellipse", "radial", threeColors, threeOpacities, null, radialPointEights, fourRadialStops));
    suite.add(gradientFill("ellipse", "radial", threeColors, null, null, radialPointEights, fourRadialStops));

    suite.add(gradientFill("circle", "radial", threeColors, threeOpacities, threeOffsets, null, fourRadialStops));
    suite.add(gradientFill("circle", "radial", threeColors, null, threeOffsets, null, fourRadialStops));
    suite.add(gradientFill("circle", "radial", threeColors, threeOpacities, null, null, fourRadialStops));
    suite.add(gradientFill("circle", "radial", threeColors, null, null, null, fourRadialStops));
    suite.add(gradientFill("circle", "radial", threeColors, threeOpacities, threeOffsets, radialPointTwos, fourRadialStops));
    suite.add(gradientFill("circle", "radial", threeColors, null, threeOffsets, radialPointTwos, fourRadialStops));
    suite.add(gradientFill("circle", "radial", threeColors, threeOpacities, null, radialPointTwos, fourRadialStops));
    suite.add(gradientFill("circle", "radial", threeColors, null, null, radialPointTwos, fourRadialStops));
    suite.add(gradientFill("circle", "radial", threeColors, threeOpacities, threeOffsets, radialAssortedValues, fourRadialStops));
    suite.add(gradientFill("circle", "radial", threeColors, null, threeOffsets, radialAssortedValues, fourRadialStops));
    suite.add(gradientFill("circle", "radial", threeColors, threeOpacities, null, radialAssortedValues, fourRadialStops));
    suite.add(gradientFill("circle", "radial", threeColors, null, null, radialAssortedValues, fourRadialStops));
    suite.add(gradientFill("circle", "radial", threeColors, threeOpacities, threeOffsets, radialPointEights, fourRadialStops));
    suite.add(gradientFill("circle", "radial", threeColors, null, threeOffsets, radialPointEights, fourRadialStops));
    suite.add(gradientFill("circle", "radial", threeColors, threeOpacities, null, radialPointEights, fourRadialStops));
    suite.add(gradientFill("circle", "radial", threeColors, null, null, radialPointEights, fourRadialStops));
    
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, threeOffsets, null, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, null, threeOffsets, null, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, null, null, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, null, null, null, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 45}, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, null, threeOffsets, {rotation: 45}, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, null, {rotation: 45}, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, null, null, {rotation: 45}, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 90}, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, null, threeOffsets, {rotation: 90}, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, null, {rotation: 90}, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, null, null, {rotation: 90}, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 135}, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, null, threeOffsets, {rotation: 135}, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, null, {rotation: 135}, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, null, null, {rotation: 135}, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 180}, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, null, threeOffsets, {rotation: 180}, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, null, {rotation: 180}, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, null, null, {rotation: 180}, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 225}, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, null, threeOffsets, {rotation: 225}, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, null, {rotation: 225}, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, null, null, {rotation: 225}, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 270}, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, null, threeOffsets, {rotation: 270}, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, null, {rotation: 270}, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, null, null, {rotation: 270}, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 315}, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, null, threeOffsets, {rotation: 315}, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, null, {rotation: 315}, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, null, null, {rotation: 315}, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 360}, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, null, threeOffsets, {rotation: 360}, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, threeOpacities, null, {rotation: 360}, noFill));
    suite.add(gradientFill("rect", "linear", threeColors, null, null, {rotation: 360}, noFill));

    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, threeOffsets, null, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, threeOffsets, null, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, null, null, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, null, null, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 45}, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, threeOffsets, {rotation: 45}, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, null, {rotation: 45}, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, null, {rotation: 45}, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 90}, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, threeOffsets, {rotation: 90}, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, null, {rotation: 90}, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, null, {rotation: 90}, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 135}, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, threeOffsets, {rotation: 135}, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, null, {rotation: 135}, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, null, {rotation: 135}, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 180}, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, threeOffsets, {rotation: 180}, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, null, {rotation: 180}, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, null, {rotation: 180}, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 225}, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, threeOffsets, {rotation: 225}, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, null, {rotation: 225}, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, null, {rotation: 225}, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 270}, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, threeOffsets, {rotation: 270}, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, null, {rotation: 270}, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, null, {rotation: 270}, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 315}, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, threeOffsets, {rotation: 315}, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, null, {rotation: 315}, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, null, {rotation: 315}, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 360}, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, threeOffsets, {rotation: 360}, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, threeOpacities, null, {rotation: 360}, noFill));
    suite.add(gradientFill("ellipse", "linear", threeColors, null, null, {rotation: 360}, noFill));

    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, threeOffsets, null, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, null, threeOffsets, null, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, null, null, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, null, null, null, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 45}, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, null, threeOffsets, {rotation: 45}, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, null, {rotation: 45}, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, null, null, {rotation: 45}, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 90}, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, null, threeOffsets, {rotation: 90}, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, null, {rotation: 90}, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, null, null, {rotation: 90}, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 135}, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, null, threeOffsets, {rotation: 135}, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, null, {rotation: 135}, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, null, null, {rotation: 135}, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 180}, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, null, threeOffsets, {rotation: 180}, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, null, {rotation: 180}, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, null, null, {rotation: 180}, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 225}, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, null, threeOffsets, {rotation: 225}, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, null, {rotation: 225}, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, null, null, {rotation: 225}, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 270}, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, null, threeOffsets, {rotation: 270}, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, null, {rotation: 270}, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, null, null, {rotation: 270}, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 315}, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, null, threeOffsets, {rotation: 315}, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, null, {rotation: 315}, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, null, null, {rotation: 315}, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, threeOffsets, {rotation: 360}, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, null, threeOffsets, {rotation: 360}, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, threeOpacities, null, {rotation: 360}, noFill));
    suite.add(gradientFill("circle", "linear", threeColors, null, null, {rotation: 360}, noFill));
    
    suite.add(gradientFill("rect", "radial", threeColors, threeOpacities, threeOffsets, null, noFill));
    suite.add(gradientFill("rect", "radial", threeColors, null, threeOffsets, null, noFill));
    suite.add(gradientFill("rect", "radial", threeColors, threeOpacities, null, null, noFill));
    suite.add(gradientFill("rect", "radial", threeColors, null, null, null, noFill));
    suite.add(gradientFill("rect", "radial", threeColors, threeOpacities, threeOffsets, radialPointTwos, noFill));
    suite.add(gradientFill("rect", "radial", threeColors, null, threeOffsets, radialPointTwos, noFill));
    suite.add(gradientFill("rect", "radial", threeColors, threeOpacities, null, radialPointTwos, noFill));
    suite.add(gradientFill("rect", "radial", threeColors, null, null, radialPointTwos, noFill));
    suite.add(gradientFill("rect", "radial", threeColors, threeOpacities, threeOffsets, radialAssortedValues, noFill));
    suite.add(gradientFill("rect", "radial", threeColors, null, threeOffsets, radialAssortedValues, noFill));
    suite.add(gradientFill("rect", "radial", threeColors, threeOpacities, null, radialAssortedValues, noFill));
    suite.add(gradientFill("rect", "radial", threeColors, null, null, radialAssortedValues, noFill));
    suite.add(gradientFill("rect", "radial", threeColors, threeOpacities, threeOffsets, radialPointEights, noFill));
    suite.add(gradientFill("rect", "radial", threeColors, null, threeOffsets, radialPointEights, noFill));
    suite.add(gradientFill("rect", "radial", threeColors, threeOpacities, null, radialPointEights, noFill));
    suite.add(gradientFill("rect", "radial", threeColors, null, null, radialPointEights, noFill));

    suite.add(gradientFill("ellipse", "radial", threeColors, threeOpacities, threeOffsets, null, noFill));
    suite.add(gradientFill("ellipse", "radial", threeColors, null, threeOffsets, null, noFill));
    suite.add(gradientFill("ellipse", "radial", threeColors, threeOpacities, null, null, noFill));
    suite.add(gradientFill("ellipse", "radial", threeColors, null, null, null, noFill));
    suite.add(gradientFill("ellipse", "radial", threeColors, threeOpacities, threeOffsets, radialPointTwos, noFill));
    suite.add(gradientFill("ellipse", "radial", threeColors, null, threeOffsets, radialPointTwos, noFill));
    suite.add(gradientFill("ellipse", "radial", threeColors, threeOpacities, null, radialPointTwos, noFill));
    suite.add(gradientFill("ellipse", "radial", threeColors, null, null, radialPointTwos, noFill));
    suite.add(gradientFill("ellipse", "radial", threeColors, threeOpacities, threeOffsets, radialAssortedValues, noFill));
    suite.add(gradientFill("ellipse", "radial", threeColors, null, threeOffsets, radialAssortedValues, noFill));
    suite.add(gradientFill("ellipse", "radial", threeColors, threeOpacities, null, radialAssortedValues, noFill));
    suite.add(gradientFill("ellipse", "radial", threeColors, null, null, radialAssortedValues, noFill));
    suite.add(gradientFill("ellipse", "radial", threeColors, threeOpacities, threeOffsets, radialPointEights, noFill));
    suite.add(gradientFill("ellipse", "radial", threeColors, null, threeOffsets, radialPointEights, noFill));
    suite.add(gradientFill("ellipse", "radial", threeColors, threeOpacities, null, radialPointEights, noFill));
    suite.add(gradientFill("ellipse", "radial", threeColors, null, null, radialPointEights, noFill));

    suite.add(gradientFill("circle", "radial", threeColors, threeOpacities, threeOffsets, null, noFill));
    suite.add(gradientFill("circle", "radial", threeColors, null, threeOffsets, null, noFill));
    suite.add(gradientFill("circle", "radial", threeColors, threeOpacities, null, null, noFill));
    suite.add(gradientFill("circle", "radial", threeColors, null, null, null, noFill));
    suite.add(gradientFill("circle", "radial", threeColors, threeOpacities, threeOffsets, radialPointTwos, noFill));
    suite.add(gradientFill("circle", "radial", threeColors, null, threeOffsets, radialPointTwos, noFill));
    suite.add(gradientFill("circle", "radial", threeColors, threeOpacities, null, radialPointTwos, noFill));
    suite.add(gradientFill("circle", "radial", threeColors, null, null, radialPointTwos, noFill));
    suite.add(gradientFill("circle", "radial", threeColors, threeOpacities, threeOffsets, radialAssortedValues, noFill));
    suite.add(gradientFill("circle", "radial", threeColors, null, threeOffsets, radialAssortedValues, noFill));
    suite.add(gradientFill("circle", "radial", threeColors, threeOpacities, null, radialAssortedValues, noFill));
    suite.add(gradientFill("circle", "radial", threeColors, null, null, radialAssortedValues, noFill));
    suite.add(gradientFill("circle", "radial", threeColors, threeOpacities, threeOffsets, radialPointEights, noFill));
    suite.add(gradientFill("circle", "radial", threeColors, null, threeOffsets, radialPointEights, noFill));
    suite.add(gradientFill("circle", "radial", threeColors, threeOpacities, null, radialPointEights, noFill));
    suite.add(gradientFill("circle", "radial", threeColors, null, null, radialPointEights, noFill));

Y.Test.Runner.add( suite );

}, '@VERSION@' ,{requires:['graphics', 'test']});
