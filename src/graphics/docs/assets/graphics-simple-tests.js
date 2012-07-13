YUI.add('graphics-simple-tests', function(Y) {
    var suite = new Y.Test.Suite('graphics-simple-tests example test suite'),
        _getClassName = Y.ClassNameManager.getClassName,
        SHAPE,
        ENGINE = "vml",
        DOCUMENT = Y.config.doc,
        canvas = DOCUMENT && DOCUMENT.createElement("canvas"),
        graphicTests,
        svgTests,
        canvasTests,
        vmlTests,
        ELLIPSENODE = "oval",
        TORGB = Y.Color.toRGB,
        TOHEX = Y.Color.toHex,
        toRGBA = function(val, alpha) {
            alpha = Y.Lang.isNumber(alpha) ? alpha : 1;
            if (!Y.Color.re_RGB.test(val)) {
                val = TOHEX(val);
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
        IMPLEMENTATION;

    if(DOCUMENT && DOCUMENT.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"))
    {
        ENGINE = "svg";
        ELLIPSENODE = ENGINE + ":" + "ellipse";
    }
    else if(canvas && canvas.getContext && canvas.getContext("2d"))
    {
        ENGINE = "canvas";
        ELLIPSENODE = ENGINE;
    }
    SHAPE = "." + _getClassName(ENGINE + "Shape");
    ELLIPSE = "." + _getClassName(ENGINE + "Ellipse");
   
    IMPLEMENTATION = {
        svg: {
            getStroke: function()
            {
                var node = this._node,
                    color = node.getAttribute("stroke"),
                    weight = node.getAttribute("stroke-width"),
                    opacity = node.getAttribute("stroke-opacity");
                color = toRGBA(TOHEX(color), opacity);
                return {
                    color: color,
                    weight: weight
                }

            },
            getFill: function()
            {
                var node = this._node,
                    color = node.getAttribute("fill"),
                    opacity = node.getAttribute("fill-opacity");
                color = toRGBA(TOHEX(color), opacity);
                return {
                    color: color
                }
            }
        },
        vml: {
            getStroke: function()
            {
                var node = Y.one(this._node),
                    nodelist = node.children,
                    strokeNode,
                    color,
                    weight,
                    opacity;
                if(nodelist)
                {
                    strokeNode = nodelist.filter('stroke');
                }
                color = node.get("strokecolor");
                weight = node.get("strokeweight");
                opacity = strokeNode ? strokeNode.get("opacity") : 1;
                if(!Y.Lang.isNumber(opacity))
                {
                    opacity = 1;
                }
                if(color.value)
                {
                    color = color.value;
                }
                color = toRGBA(TOHEX(color), opacity);
                weight = Math.round(weight * (96/72));
                return {
                    color: color,
                    weight: weight
                }
            },
            getFill: function()
            {
                var node = this._node,
                    nodelist = Y.one(node).children,
                    fillNode,
                    color,
                    opacity;
                if(nodelist)
                {
                    fillNode = nodelist.filter("fill");
                }
                color = node.get("fillcolor");
                opacity = fillNode ? fillNode.get("opacity") : 1;
                if(color.value)
                {
                    color = color.value;
                }
                color = toRGBA(TOHEX(color), opacity);
                return {
                    color: color
                }
            }
        },
        canvas: {
            getStroke: function()
            {
                var context = this._node.getDOMNode().getContext("2d"),
                    color = context.strokeStyle,
                    weight = context.lineWidth;
                if(color.indexOf("RGBA") > -1 || color.indexOf("rgba") > -1)
                {
                    color = color.toLowerCase();
                    color = color.replace(/, /g, ",");
                }
                else
                {
                    color = toRGBA(TOHEX(color));
                }
                return {
                    color: color,
                    weight: weight
                }

            },
            getFill: function()
            {
                var context = this._node.getDOMNode().getContext("2d"),
                    color = context.fillStyle;
                if(color.indexOf("RGBA") > -1 || color.indexOf("rgba") > -1)
                {
                    color = color.toLowerCase();
                    color = color.replace(/, /g, ",");
                }
                else
                {
                    color = toRGBA(TOHEX(color));
                }
                return {
                    color: color
                }
            }
        }
    };

    function ShapeNode(){}
    ShapeNode.prototype = IMPLEMENTATION[ENGINE];
    ShapeNode.one = function(node)
    {
        var instance = ShapeNode._instance;
        if(!instance)
        {
            instance = new Y.ShapeNode();
            ShapeNode._instance = instance;
        }
        instance._node = node;
        return instance;
    };
    Y.ShapeNode = ShapeNode;

    suite.add(new Y.Test.Case({
        name: "Graphics Simple Tests",

        testGraphicsLoaded : function()
        {
            var shapes = Y.all(SHAPE),
                ellipses = Y.all(ELLIPSE),
                shape = shapes.shift(),
                ellipse = ellipses.shift(),
                fillColor = "#9aa",
                strokeColor = "#000",
                strokeWeight = 2,
                fillOpacity = 1,
                strokeOpacity = 1,
                node = Y.ShapeNode.one(shape),
                fill = node.getFill(),
                stroke = node.getStroke();

            fillColor = toRGBA(TOHEX(fillColor), fillOpacity);
            strokeColor = toRGBA(TOHEX(strokeColor), strokeOpacity);
            Y.Assert.areEqual(shape, ellipse, "Both instances should be the same shape.");
            Y.Assert.areEqual(fillColor, fill.color, "The fill color should be " + fillColor + ".");
            Y.Assert.areEqual(strokeColor, stroke.color, "The stroke color should be " + strokeColor + ".");
            Y.Assert.areEqual(strokeWeight, stroke.weight, "The stroke weight should be " + strokeWeight + ".");
        }
    }));

    Y.Test.Runner.add(suite);
}, '' ,{requires:['classnamemanager', 'node']});

