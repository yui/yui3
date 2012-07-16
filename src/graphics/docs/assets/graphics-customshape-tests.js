YUI.add('graphics-customshape-tests', function(Y) {
    var suite = new Y.Test.Suite('graphics-customshape-tests example test suite'),
        _getClassName = Y.ClassNameManager.getClassName,
        SHAPE,
        ENGINE = "vml",
        ROUNDEDRECT,
        DOCUMENT = Y.config.doc,
        canvas = DOCUMENT && DOCUMENT.createElement("canvas"),
        graphicTests,
        svgTests,
        canvasTests,
        vmlTests,
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
    }
    else if(canvas && canvas.getContext && canvas.getContext("2d"))
    {
        ENGINE = "canvas";
    }
    SHAPE = "." + _getClassName(ENGINE + "Shape");
    ROUNDEDRECT = "." + _getClassName("roundedRect");

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
            },

            getDimensions: function(shape)
            {
                var w,
                    h,
                    node = this._node;
                switch(shape)
                {
                    case "circle" :
                        w = node.getAttribute("r") * 2;
                        h = w;
                    break;
                    case "ellipse" :
                        w = parseFloat(node.getAttribute("rx")) * 2;
                        h = parseFloat(node.getAttribute("ry")) * 2;
                    break;
                    default :
                        w = node.get("width");
                        h = node.get("height");
                    break;
                }
                return {
                    width: w,
                    height: h
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
            },

            getDimensions: function(shape)
            {
                var node = this._node,
                    w = parseFloat(node.getComputedStyle("width")),
                    h = parseFloat(node.getComputedStyle("height"));
                return {
                    width: w,
                    height: h
                };
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
            },

            getDimensions: function(shape)
            {
                var node = this._node,
                    w = parseFloat(node.get("width")),
                    h = parseFloat(node.get("height")),
                    wt = this.getStroke().weight || 0;
                if(wt) {
                    wt = wt * 2;
                    w = w - wt;
                    h = h - wt;
                }
                return {
                    width: w,
                    height: h
                };
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
        name: "Graphics Path Tests",

        testGraphicsLoaded : function()
        {
            var shapes = Y.all(SHAPE),
                paths = Y.all(ROUNDEDRECT);
            Y.Assert.areEqual(1, shapes.size(), "There should be 1 shape.");
            Y.Assert.areEqual(1, paths.size(), "There should be 1 roundedRect instance.");
        }
    }));

    Y.Test.Runner.add(suite);
}, '' ,{requires:['classnamemanager', 'node']});

