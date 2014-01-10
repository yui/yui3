YUI.add('anim-shape-tests', function(Y) {

var suite = new Y.Test.Suite("Anim: Shape"),
ShapeTestTemplate = function(cfg, globalCfg) {
    var i;
    ShapeTestTemplate.superclass.constructor.apply(this);
    cfg.width = cfg.width || 50;
    cfg.height = cfg.height || 50;
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
    name: "AnimShapeTests",

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

function AnimAttrTest()
{
    AnimAttrTest.superclass.constructor.apply(this, arguments);
};

Y.extend(AnimAttrTest, ShapeTestTemplate, {
    _rounder: 100,

    _round: function(val)
    {
        return Math.round(val * this._rounder)/this._rounder;
    },

    test: function()
    {
            var to = this.to,
            key,
            i,
            len,
            prop,
            endProp,
            stroke,
            fill,
            endFill = to.fill,
            endStroke = to.stroke,
            anim = new Y.Anim({
                node: this.shape,
                duration: .5,
                to: to 
            }),
            endStops,
            endStop,
            stops,
            stop,
            test = this,
            shape = this.shape;

            anim.on('end', function() {
                test.resume(function() {
                    stroke = shape.get("stroke");
                    fill = shape.get("fill");
                    for(key in endStroke)
                    {
                        if(endStroke.hasOwnProperty(key))
                        {
                            if(key == "color")
                            {
                                prop = Y.Color.toRGB(stroke[key]);
                                endProp = Y.Color.toRGB(endStroke[key]);
                            }
                            else
                            {
                                prop = stroke[key];
                                endProp = endStroke[key];
                            }
                            Y.Assert.areEqual(endProp, prop, "The " + key + " value should be " + endProp + ".");
                        }
                    }
                    if(endFill.hasOwnProperty("stops"))
                    {
                        endStops = endFill.stops;
                        len = endStops.length || 0;
                        stops = fill.stops;
                        for(i = 0; i < len; i = i + 1)
                        {
                            endStop = endStops[i];
                            stop = stops[i];
                            for(key in endStop)
                            {
                                if(endStop.hasOwnProperty(key))
                                {
                                    if(key == "color")
                                    {
                                        prop = Y.Color.toRGB(stop.color);
                                        endProp = Y.Color.toRGB(endStop.color);
                                    }
                                    else
                                    {
                                        prop = stop[key];
                                        endProp = endStop[key];
                                    }
                                    Y.Assert.areEqual(endProp, prop, "The " + key + " value should be " + endProp + ".");
                                }
                            }
                        }
                    }
                    for(key in endFill)
                    {
                        if(endFill.hasOwnProperty(key) && key != "stops")
                        {
                            if(key == "color" && fill.type == "solid")
                            {
                                prop = Y.Color.toRGB(fill[key]);
                                endProp = Y.Color.toRGB(endFill[key]);
                            }
                            else
                            {
                                prop = Math.round(fill[key] * 100)/100;
                                endProp = Math.round(endFill[key] * 100)/100;
                            }
                            Y.Assert.areEqual(endProp, prop, "The " + key + " value should be " + endProp + ".");
                        }
                    }
                
                });
            });
            
            anim.run();
            test.wait(5000);
    }
});

var genericFill = {
        color: "#f00"
    },

    genericStroke = {
        color: "#00f",
        weight: 1
    },
    
    endFill = {
        color: "#00f",
        opacity: 0.3
    },

    endStroke ={
        color: "#f00",
        weight: 2,
        opacity: 1
    },
                
    linearFill = {
        type: "linear",
        rotation: 45,
        stops: [
            {color: "#ff6666", opacity: 1, offset: 0},
            {color: "#00ffff", opacity: 1, offset: 0.5},
            {color: "#000000", opacity: 1, offset: 1}
        ]
    },
                    
    endLinearFill = {
        stops: [
            {color: "#fccdd3", offset: 0},
            {color: "#9aa", offset: 0.3},
            {color: "#fccdd3", offset: 1}
        ],
        rotation: 271
    },
    
    radialFill = {
        type: "radial",
        stops: [
            {color: "#ff6666", opacity: 1, offset: 0},
            {color: "#00ffff", opacity: 1, offset: 0.4},
            {color: "#000000", opacity: 1, offset: 0.7}
        ],
        cx: .5,
        cy: .5,
        fx: 0.9,
        fy: 0.9,
        r: 0.2 
    },

    endRadialFill = {
        stops: [
            {color: "#fccdd3", offset: 0},
            {color: "#9aa", offset: 0.3},
            {color: "#fccdd3", offset: 1}
        ],
        fx: 0.5,
        fy: 0.5
    },
    
    strokeAndFillTest = function(shape) 
    {  
        return new AnimAttrTest({
            type: shape,
            fill: genericFill,
            stroke: genericStroke
        },
        {
            to: {
                fill: endFill,
                stroke: endStroke
            },
            NAME: shape + "StrokeAndFillTest"
        });
    },

    strokeAndLinearFillTest = function(shape) 
    {  
        return new AnimAttrTest({
            type: shape,
            fill: linearFill,
            stroke: genericStroke
        },
        {
            to: {
                fill: endLinearFill,
                stroke: endStroke
            },
            NAME: shape + "StrokeAndLinearFillTest"
        });
    },

    strokeAndRadialFillTest = function(shape) 
    {  
        return new AnimAttrTest({
            type: shape,
            fill: radialFill,
            stroke: genericStroke
        },
        {
            to: {
                fill: endRadialFill,
                stroke: endStroke
            },
            NAME: shape + "StrokeAndRadialFillTest"
        });
    };

suite.add(strokeAndFillTest("rect"));
suite.add(strokeAndLinearFillTest("rect"));
suite.add(strokeAndRadialFillTest("rect"));

suite.add(strokeAndFillTest("circle"));
suite.add(strokeAndLinearFillTest("circle"));
suite.add(strokeAndRadialFillTest("circle"));

suite.add(strokeAndFillTest("ellipse"));
suite.add(strokeAndLinearFillTest("ellipse"));
suite.add(strokeAndRadialFillTest("ellipse"));

suite.add(strokeAndFillTest(RoundedRect));
suite.add(strokeAndLinearFillTest(RoundedRect));
suite.add(strokeAndRadialFillTest(RoundedRect));

Y.Test.Runner.add( suite );

}, '@VERSION@' ,{requires:['graphics', 'anim-shape', 'test']});
