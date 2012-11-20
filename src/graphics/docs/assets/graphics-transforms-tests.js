YUI.add('graphics-transforms-tests', function(Y) {
    var suite = new Y.Test.Suite('graphics-transforms-tests example test suite'),
        _getClassName = Y.ClassNameManager.getClassName,
        SHAPE,
        RECT,
        CIRCLE,
        ELLIPSE,
        ENGINE = "vml",
        DOCUMENT = Y.config.doc,
        canvas = DOCUMENT && DOCUMENT.createElement("canvas"),
        graphicTests,
        svgTests,
        canvasTests,
        vmlTests,
        PATHNODE = "shape",
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
    RECT = "." + _getClassName(ENGINE + "Rect");
    CIRCLE = "." + _getClassName(ENGINE + "Circle");
    ELLIPSE = "." + _getClassName(ENGINE + "Ellipse");

    IMPLEMENTATION = {
        svg: {
            getStroke: function()
            {
                var node = this._node,
                    color = node.getAttribute("stroke"),
                    weight = node.getAttribute("stroke-width"),
                    opacity = node.getAttribute("stroke-opacity");
                color = toRGBA(TOHEX(color), parseFloat(opacity));
                return {
                    color: color,
                    weight: weight
                }

            },

            getFill: function()
            {
                var node = this._node,
                    fillNode,
                    stopNodes,
                    len,
                    i = 0,
                    stops,
                    stop,
                    stopNode,
                    offset,
                    gradientIndex,
                    tagName,
                    type,
                    color = node.getAttribute("fill"),
                    opacity = node.getAttribute("fill-opacity"),
                    fill = {};
                if(color.indexOf("url") > -1)
                {
                    color = color.slice(color.indexOf("#"), color.lastIndexOf(")"));
                    fillNode = Y.one(color);
                    if(fillNode)
                    {
                        tagName = fillNode.get("tagName");
                        if(tagName)
                        {
                            gradientIndex = tagName.indexOf("Gradient");
                            if(gradientIndex > -1)
                            {
                                type = tagName.slice(tagName.indexOf(":") + 1, gradientIndex);
                                if(type == "linear")
                                {
                                    //add rotation logic
                                }
                                else if(type == "radial")
                                {
                                    //add cx,cy,fx,fy,r logic
                                }
                            }
                            fill.type = type;
                        }
                        stopNodes = fillNode.get("children");
                        stopNodes = stopNodes ? stopNodes.filter("stop") : null;
                        if(stopNodes)
                        {   
                            len = stopNodes.size();
                            stops = [];
                            for(; i < len; i = i + 1)
                            {
                                stopNode = stopNodes.item(i);
                                stop = {};
                                if(stopNode.hasAttribute("stop-color"))
                                {
                                    stop.color = TOHEX(stopNode.getAttribute("stop-color")).toLowerCase();
                                }
                                if(stopNode.hasAttribute("offset"))
                                {
                                    offset = stopNode.getAttribute("offset");
                                    if(offset.indexOf("%") > -1)
                                    {
                                        offset = parseFloat(offset)/100;
                                    }
                                    else
                                    {
                                        offset = 1;
                                    }
                                    stop.offset = offset;
                                }
                                if(stopNode.hasAttribute("stop-opacity"))
                                {
                                    stop.opacity = stopNode.getAttribute("stop-opacity");
                                }
                                stops.push(stop);
                            }
                            fill.stops = stops;
                        }
                    }
                }
                else
                {
                    color = toRGBA(TOHEX(color), parseFloat(opacity));
                    fill.color = color;
                    fill.type = "solid";
                }
                return fill;
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
                        w = node.getAttribute("width");
                        h = node.getAttribute("height");
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
                    nodelist = node.get("children"),
                    strokeNode,
                    color,
                    weight,
                    opacity;
                if(nodelist)
                {
                    strokeNode = nodelist.filter('stroke');
                    if(strokeNode.size() > 0)
                    {
                        strokeNode = strokeNode.shift().getDOMNode();
                    }
                }
                color = node.get("strokecolor");
                weight = node.get("strokeweight");
                opacity = strokeNode ? strokeNode.opacity : 1;
                if(!Y.Lang.isNumber(opacity))
                {
                    opacity = 1;
                }
                if(color.value)
                {
                    color = color.value;
                }
                color = toRGBA(TOHEX(color), parseFloat(opacity));
                weight = Math.round(weight * (96/72));
                return {
                    color: color,
                    weight: weight
                }
            },

            getFill: function()
            {
                var node = this._node,
                    nodelist = Y.one(node).get("children"),
                    type,
                    fillNode,
                    color,
                    offset,
                    stops,
                    stopAttrs,
                    stopStrings,
                    opacity,
                    i = 0,
                    len,
                    fill = {};
                if(nodelist)
                {
                    fillNode = nodelist.filter("fill");
                    if(fillNode.size() > 0)
                    {
                        fillNode = fillNode.shift().getDOMNode();
                    }
                    type = fillNode.type || "solid";
                    if(type == "gradient")
                    {
                        type = "linear";
                    }
                    else if(type == "gradientRadial")
                    {
                        type = "radial";
                    }
                }
                else
                {
                    type = "solid";
                }
                switch(type)
                {
                    case "solid" :
                        color = node.get("fillcolor");
                        opacity = fillNode ? fillNode.opacity : 1;
                        if(color.value)
                        {
                            color = color.value;
                        }
                        color = toRGBA(TOHEX(color), parseFloat(opacity)); 
                        fill.color = color;
                    break;
                    case "linear" :
                        stopStrings = fillNode.colors;
                        if(stopStrings)
                        {
                            stops = [];
                            if(stopStrings.value)
                            {
                                stopStrings = stopStrings.value;
                            }
                            stopStrings = stopStrings.split(";");
                            len = stops.length;
                            for(; i < len; i = i + 1)
                            {
                                stopAttrs = stopStrings[i].split(" ");
                                offset = stopAttrs[0];
                                if(offset.indexOf("f") > -1)
                                {
                                    offset = 100 * parseFloat(offset)/65535
                                    offset = Math.round(offset)/100;
                                }
                                stops.push( {color: TOHEX(stopAttrs[1]).toLowerCase(), offset: offset} );
                            }
                            fill.stops = stops;
                        }
                    break;
                    case "radial" :
                        stopStrings = fillNode.colors;
                        if(stopStrings)
                        {
                            stops = [];
                            if(stopStrings.value)
                            {
                                stopStrings = stopStrings.value;
                            }
                            stopStrings = stopStrings.split(";");
                            len = stops.length;
                            for(; i < len; i = i + 1)
                            {
                                stopAttrs = stopStrings[i].split(" ");
                                offset = stopAttrs[0];
                                if(offset.indexOf("f") > -1)
                                {
                                    offset = 100 * parseFloat(offset)/65535
                                    offset = Math.round(offset)/100;
                                }
                                stops.push( {color: TOHEX(stopAttrs[1]).toLowerCase(), offset: offset} );
                            }
                            fill.stops = stops;
                        }
                    break;
                }
                fill.type = type;
                return fill;
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
        name: "Graphics Gradient Tests",

        testGraphicsLoaded : function()
        {
            var shapes = Y.all(SHAPE);
            Y.Assert.areEqual(3, shapes.size(), "There should be 3 shapes.");
        },

        testShapes: function()
        {
            var rect = Y.all(RECT).shift(),
                rectFillColor = toRGBA(TOHEX("#fde")),
                rectStrokeWeight = 1,
                rectStrokeColor = toRGBA(TOHEX("#000")),
                rectWidth = 40,
                rectHeight = 50,
                rectFill = Y.ShapeNode.one(rect).getFill(),
                rectStroke = Y.ShapeNode.one(rect).getStroke(),
                rectDimensions = Y.ShapeNode.one(rect).getDimensions("rect"),
                ellipse = Y.all(ELLIPSE).shift(),
                ellipseFillColor = toRGBA(TOHEX("#f00"), 0.5),
                ellipseStrokeWeight = 2,
                ellipseStrokeColor = toRGBA(TOHEX("#ddd")),
                ellipseWidth = 100,
                ellipseHeight = 30,
                ellipseFill = Y.ShapeNode.one(ellipse).getFill(),
                ellipseStroke = Y.ShapeNode.one(ellipse).getStroke(),
                ellipseDimensions = Y.ShapeNode.one(ellipse).getDimensions("ellipse"),
                circle = Y.all(CIRCLE).shift(),
                circleFillColor = toRGBA(TOHEX("#00f")),
                circleStrokeWeight = 1,
                circleStrokeColor = toRGBA(TOHEX("#ff0")),
                circleWidth = 24,
                circleHeight = 24,
                circleFill = Y.ShapeNode.one(circle).getFill(),
                circleStroke = Y.ShapeNode.one(circle).getStroke(),
                circleDimensions = Y.ShapeNode.one(circle).getDimensions("circle");
            Y.Assert.areEqual(rectWidth, rectDimensions.width, "The width of the rectangle should be " + rectWidth + ".");
            Y.Assert.areEqual(rectHeight, rectDimensions.height, "The height of the rectangle should be " + rectHeight + ".");
            Y.Assert.areEqual(rectFillColor, rectFill.color, "The fill color of the rectangle should be " + rectFillColor + ".");
            Y.Assert.areEqual(rectStrokeWeight, rectStroke.weight, "The weight of the rectangle stroke should be " + rectStrokeWeight + ".");
            Y.Assert.areEqual(rectStrokeColor, rectStroke.color, "The color of the rectangle stroke should be " + rectStrokeColor + ".");
            Y.Assert.areEqual(ellipseWidth, ellipseDimensions.width, "The width of the ellipse should be " + ellipseWidth + ".");
            Y.Assert.areEqual(ellipseHeight, ellipseDimensions.height, "The height of the ellipse should be " + ellipseHeight + ".");
            Y.Assert.areEqual(ellipseFillColor, ellipseFill.color, "The fill color of the ellipse should be " + ellipseFillColor + ".");
            Y.Assert.areEqual(ellipseStrokeWeight, ellipseStroke.weight, "The weight of the ellipse stroke should be " + ellipseStrokeWeight + ".");
            Y.Assert.areEqual(ellipseStrokeColor, ellipseStroke.color, "The color of the ellipse stroke should be " + ellipseStrokeColor + ".");
            Y.Assert.areEqual(circleWidth, circleDimensions.width, "The width of the circle should be " + circleWidth + ".");
            Y.Assert.areEqual(circleHeight, circleDimensions.height, "The height of the circle should be " + circleHeight + ".");
            Y.Assert.areEqual(circleFillColor, circleFill.color, "The fill color of the circle should be " + circleFillColor + ".");
            Y.Assert.areEqual(circleStrokeWeight, circleStroke.weight, "The weight of the circle stroke should be " + circleStrokeWeight + ".");
            Y.Assert.areEqual(circleStrokeColor, circleStroke.color, "The color of the circle stroke should be " + circleStrokeColor + ".");
        }
    }));

    Y.Test.Runner.add(suite);
}, '' ,{requires:['classnamemanager', 'node']});

