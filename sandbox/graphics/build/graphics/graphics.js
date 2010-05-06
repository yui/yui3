YUI.add('graphics', function(Y) {

/**
 * Graphics provides an api for drawing objects within the dom.
 */
function Graphics(config)
{
    var uA = Y.UA,
        engine = uA.ie ? "vml" : "canvas";
	this._config = config;
    this._config.engine = engine;
	Graphics.superclass.constructor.apply(this, [this._config]);
}

Graphics.NAME = "graphics";

Graphics.ATTRS = {
	engine : {
		getter: function() {
			return this._engine;
		},
		validator: function(val) {
			return (val == "canvas" || val == "vml");
		},
		setter: function(val) {
			this._engine = this._getAPI(val);
			return this._engine;
		}
	}
};

Y.extend(Graphics, Y.Base, {
	_config: null,

	_engine: null,

	_getAPI: function(val)
	{
		var api,
			config = this._config;
    switch(val)
		{
			case "canvas" :
				api = new Y.CanvasAPI(config);
			break;
			case "vml" :
				api = new Y.VMLAPI(config);
			break;
		}
		return api;
	},

    /** 
     *Specifies a simple one-color fill that subsequent calls to other Graphics methods (such as lineTo() or drawCircle()) use when drawing.
     */
    beginFill: function(color, alpha)
    {
		var eng = this.get("engine");
        return eng.beginFill.apply(eng, arguments);
    },
	
    /** 
     *Specifies a gradient fill used by subsequent calls to other Graphics methods (such as lineTo() or drawCircle()) for the object.
     */
    beginGradientFill: function(type, colors, alphas, ratios, rotation, matrix, spreadMethod, interpolationMethod, focalPointRatio)
    {
		var eng = this.get("engine");
        return eng.beginGradientFill.apply(eng, arguments);
    },

    /** 
     *Clears the graphics that were drawn to this Graphics object, and resets fill and line style settings.
     */
    clear: function()
    {
		var eng = this.get("engine");
        return eng.clear.apply(eng);
    },
	
    /** 
     *Draws a curve using the current line style from the current drawing position to (anchorX, anchorY) and using the control point that (controlX, controlY) specifies.
     */
    curveTo: function(cp1x, cp1y, cp2x, cp2y, x, y)
    {
		var eng = this.get("engine");
        return eng.curveTo.apply(eng, arguments);
    },

    /** 
     *Draws a circle.
     */
	drawCircle: function(x, y, radius)
	{
		var eng = this.get("engine");
        return eng.drawCircle.apply(eng, arguments);
	},

    /** 
     *Draws an ellipse.
     */
    drawEllipse: function(x, y, w, h)
    {
		var eng = this.get("engine");
        return eng.beginGradientFill.apply(eng, arguments);
    },
	
    /** 
     *Draws a rectangle.
     */
    drawRectangle: function(x, y, w, h)
	{
		var eng = this.get("engine");
		return eng.drawRectangle.apply(eng, arguments);
	},
	
    /** 
     *Draws a rounded rectangle.
     */
    drawRoundRect: function(x, y, w, h, ellipseWidth, ellipseHeight)
    {
		var eng = this.get("engine");
        return eng.drawRoundRect.apply(eng, arguments);
    },
        
    /** 
     *Applies a fill to the lines and curves that were added since the last call to the beginFill() or beginGradientFill() method.
     */
    endFill: function()
    {
		var eng = this.get("engine");
        return eng.endFill.apply(eng);
    },

    /** 
     *Specifies a gradient to use for the stroke when drawing lines.
     */
    lineGradientStyle: function(type, colors, alphas, ratios, matrix, spreadMethod, interpolationMethod, focalPointRatio)
    {
		var eng = this.get("engine");
        return eng.lineGradientStyle.apply(eng, arguments);
    },
        
    /** 
     *Specifies a line style used for subsequent calls to Graphics methods such as the lineTo() method or the drawCircle() method.
     */
    lineStyle: function(thickness, color, alpha, pixelHinting, scaleMode, caps, joints, miterLimit)
    {
		var eng = this.get("engine");
        return eng.lineStyle.apply(eng, arguments);
    },
    
    /** 
     *Draws a line using the current line style from the current drawing position to (x, y); the current drawing position is then set to (x, y).
     */
    lineTo: function(x, y)
    {
		var eng = this.get("engine");
        return eng.lineTo.apply(eng, arguments);
    },
    
    /** 
     * Moves the current drawing position to (x, y).
     */
    moveTo: function(x, y)
    {
		var eng = this.get("engine");
        return eng.moveTo.apply(eng, arguments);
    }
});

Y.Graphics = Graphics;
/**
 * CanvasAPI provides an api for drawing objects within the dom.
 */
function CanvasAPI(config)
{
	CanvasAPI.superclass.constructor.apply(this, arguments);
}

CanvasAPI.NAME = "canvasAPI";

CanvasAPI.ATTRS = {
    /**
     * Parent for the the Graphics instance.
     */
    parent: {
		getter: function()
		{
			return this._parent;
		},

		setter: function(value)
		{
			if(Y.Lang.isString(value))
			{
				this._parent = document.getElementById(value);
			}
			else
			{
				this._parent = value;
			}
			return this._parent;
		}
	},

    /**
     * Reference to the canvas object.
     */
	canvas: {
		getter: function() {
			if(!this._canvas)
			{
				this._setCanvas();
			}
			return this._canvas;
		}
	},

    /**
     * Context of the canvas object.
     */
	context: {
		getter: function() {
			if(!this._context)
			{
				this._context = this.get("canvas").getContext("2d");
			}
			return this._context;
		}
	},

    /**
     * x coordinate
     */
    x: {
        getter: function()
        {
            return this._x;
        },

        setter: function(val)
        {
            this._x = val;
            return val;
        },

        validator: function(val)
        {
            return Y.Lang.isNumber(val);
        }
    },

    /**
     * y coordinate
     */
    y: {
        getter: function()
        {
            return this._y;
        },

        setter: function(val)
        {
            this._y = val;
            return val;
        },

        validator: function(val)
        {
            return Y.Lang.isNumber(val);
        }
    },

    /**
     * Color to be used for solid fills.
     */
    fillColor: {
        getter: function()
        {
            return this._fillColor;
        },

        setter: function(val)
        {
            this._fillColor = val;
            return val;
        }
    },

    /**
     * Colors to be used for gradient fills.
     */
    fillAlpha: {
        getter: function()
        {
            return this._fillAlpha;
        },

        setter: function(val)
        {
            this._fillAlpha = val;
            return val;
        }
    },

    /**
     * Color to be used for solid lines.
     */
    lineColor: {
        getter: function()
        {
            return this._lineColor;
        },

        setter: function(val)
        {
            this._lineColor = val;
            return val;
        }
    },

    /**
     * Width of a line
     */
    lineWidth: {
        getter: function()
        {
            return this._lineWidth;
        },

        setter: function(val)
        {
            this._lineWidth = val;
            return val;
        },

        validator: function(val)
        {
            return Y.Lang.isNumber(val);
        }
    },

    /**
     * Alpha value for line.
     */
    lineAlpha: {
        getter: function()
        {
            return this._lineAlpha;
        },

        setter: function(val)
        {
            this._lineAlpha = val;
            return val;
        },

        validator: function(val)
        {
            return Y.Lang.isNumber(val);
        }
    },

    /**
     * Type of fill to use.
     *  <ul>
     *      <li><code>solid</code>: single color</li>
     *      <li><code>linear</code>: linear gradient</li>
     *      <li><code>radial</code>: radial gradient</li>
     *  </ul>
     */
    fillType: {
        getter: function()
        {
            return this._fillType;
        },

        setter: function(val)
        {
            this._fillType = val;
            return val;
        },

        validator: function(val)
        {
            return (val === "solid" || val === "linear" || val === "radial");
        }
    },

    /**
     * Colors to be used for a gradient fill.
     */
    fillColors: {
        getter: function()
        {
            return this._fillColors;
        },

        setter: function(val)
        {
            this._fillColors = val;
            return val;
        },

        validator: function(val)
        {   
            return Y.Lang.isArray(val);
        }
    },

    /**
     * Ratios to be used for each color in a gradient.
     */
    fillRatios: {
        getter: function()
        {
            return this._fillRatios;
        },

        setter: function(val)
        {
            this._fillRatios = val;
            return val;
        },

        validator: function(val)
        {   
            return Y.Lang.isArray(val);
        }
    },

    /**
     * Direction in which to rotate a gradient fill. (0 represents a left to right)
     */
    fillRotation: {
        getter: function()
        {
            return this._fillRotation;
        },

        setter: function(val)
        {
            this._fillRotation = val;
            return val;
        },

        validator: function(val)
        {   
            return Y.Lang.isNumber(val);
        }
    }
};

Y.extend(CanvasAPI, Y.Base, {
    /**
     * @private
     * Sets the canvas for the graphics instance.
     */
    _setCanvas: function()
	{
		var parent = this.get("parent");
		this._canvas = document.createElement("canvas");
		this._canvas.width = parseInt(this._parent.style.width, 10) || parent.width;
		this._canvas.height = parseInt(this._parent.style.height, 10) || parent.height;
		this._context = this._canvas.getContext("2d");
		parent.appendChild(this._canvas);
	},

    /**
     * @private
     * Storage for canvas
     */
	_canvas: null,

    /**
     * @private
     * Storage for context
     */
	_context: null,

    /**
     * @private
     * Storage for fillType
     */
    _fillType: "solid",

    /**
     * @private
     * Storage for x.
     */
    _x: 0,

    /**
     * @private
     * Storage for y.
     */
    _y: 0,

    /**
     * @private
     * Storage for fillColor.
     */
    _fillColor: null,

    /**
     * @private
     * Storage for fillAlpha.
     */
    _fillAlpha: 1,

    /**
     * @private
     * Storage for lineColor.
     */
    _lineColor: null,

    /**
     * @private
     * Storage for lineWidth.
     */
    _lineWidth: 1,

    /**
     * @private
     * Storage for lineAlpha.
     */
    _lineAlpha: 1,

    /**
     * @private
     * Storage for fillColors.
     */
    _fillColors: [],

    /**
     * @private
     * Storage for fillRatios.
     */
    _fillRatios: null, 

    /**
     * @private
     * Storage
     */
    _fillRotation: 0,

    /** 
     *Specifies a simple one-color fill that subsequent calls to other Graphics methods (such as lineTo() or drawCircle()) use when drawing.
     */
    beginFill: function(color, alpha)
    {
        var ctx = this.get("context");
        this.set("fillColor", color);
        this.set("fillAlpha", alpha);
        this.set("fillType", "solid");
        ctx.beginPath();
        ctx.fillStyle = color;
    },
	
    /** 
     *Specifies a gradient fill used by subsequent calls to other Graphics methods (such as lineTo() or drawCircle()) for the object.
     */
    beginGradientFill: function(type, colors, alphas, ratios, rotation, matrix, spreadMethod, interpolationMethod, focalPointRatio)
    {
        this.set("fillType", type);
        this.set("fillColors", colors);
        this.set("fillRatios", ratios);
        this.set("fillRotation", rotation);
        var ctx = this.get("context");
        ctx.beginPath();
    },

    /** 
     *Clears the graphics that were drawn to this Graphics object, and resets fill and line style settings.
     */
    clear: function()
    {
        this.set("fillColor", null);
        this.set("lineColor", null);
        this.set("lineWidth", 1);
        this.set("fillAlpha", 1);
        this.set("lineAlpha", 1);
   },
	
    /** 
     *Draws a curve using the current line style from the current drawing position to (anchorX, anchorY) and using the control point that (controlX, controlY) specifies.
     */
    curveTo: function(cp1x, cp1y, cp2x, cp2y, x, y)
    {
        var ctx = this.get("context");
        ctx.bezierCurveTo(arguments);
    },

    /** 
     *Draws a circle.
     */
	drawCircle: function(x, y, radius)
	{
		var startAngle = 0,
			endAngle = 360,
			anticlockwise = false,
			ctx = this.get("context");
		this.set("x", x);
        this.set("y", y);
        startAngle *= (Math.PI/180);
		endAngle *= (Math.PI/180);
        ctx.beginPath();
        ctx.fillStyle = this._getFill(radius * 2, radius * 2);
        ctx.arc(x + radius, y + radius, radius, startAngle, endAngle, anticlockwise);
	},

    /** 
     *Draws an ellipse.
     */
    drawEllipse: function(x, y, width, height)
    {
    },
	
    /** 
     *Draws a rectangle.
     */
    drawRectangle: function(x, y, w, h)
	{
        var fc = this.get("fillColor"),
			sc = this.get("lineColor"),
            ctx = this.get("context");
        ctx.beginPath();
        ctx.fillStyle = this._getFill(w, h);	
        if(fc || this.get("fillColors"))
        {
            ctx.fillRect(x, y, w, h);
        }
        if(sc)
        {
            ctx.strokeRect(x, y, w, h);
        }
	},
	
    /** 
     *Draws a rounded rectangle.
     */
    drawRoundRect: function(x, y, w, h, ew, eh)
    {
		var ctx = this.get("context");
            ctx.beginPath();
            ctx.fillStyle = this._getFill(w, h);	
            ctx.moveTo(x, y + eh);
            ctx.lineTo(x, y + h - eh);
            ctx.quadraticCurveTo(x, y + h, x + ew, y + h);
            ctx.lineTo(x + w - ew, y + h);
            ctx.quadraticCurveTo(x + w, y + h, x + w, y + h - eh);
            ctx.lineTo(x + w, y + eh);
            ctx.quadraticCurveTo(x + w, y, x + w - ew, y);
            ctx.lineTo(x + ew, y);
            ctx.quadraticCurveTo(x, y, x, y + eh);
    },
        
    /** 
     *Applies a fill to the lines and curves that were added since the last call to the beginFill() or beginGradientFill() method.
     */
    endFill: function()
    {
        var ctx = this.get("context");
		if(this.get("lineColor"))
		{
			ctx.stroke();
		}
		if(this.get("fillColor") || this.get("fillColors"))
		{
            ctx.fill();
		}
        ctx.closePath();
    },

    /** 
     *Specifies a gradient to use for the stroke when drawing lines.
     */
    lineGradientStyle: function(type, colors, alphas, ratios, matrix, spreadMethod, interpolationMethod, focalPointRatio)
    {
    },
        
    /** 
     *Specifies a line style used for subsequent calls to Graphics methods such as the lineTo() method or the drawCircle() method.
     */
    lineStyle: function(thickness, color, alpha, pixelHinting, scaleMode, caps, joints, miterLimit)
    {
        var ctx = this.get("context");
        this.set("lineWidth", thickness);
        this.set("lineColor", color);
        this.set("lineAlpha", alpha);
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
    },
    
    /** 
     *Draws a line using the current line style from the current drawing position to (x, y); the current drawing position is then set to (x, y).
     */
    lineTo: function(x, y)
    {
        var ctx = this.get("context");
        ctx.lineTo(x, y);
        this.set("x", x);
        this.set("y", y);
    },
    
    /** 
     * Moves the current drawing position to (x, y).
     */
    moveTo: function(x, y)
    {
        var ctx = this.get("context");
        ctx.moveTo(x, y);
        this.set("x", x);
        this.set("y", y);
    },

    /**
     * @private
     */
    _getFill: function(w, h)
    {
        var type = this.get("fillType");
        if(type === "solid")
        {
            return this.get("fillColor");
        }
        if(type === "linear")
        {
            return this._getLinearGradient(w, h, "fill");
        }
        return this._getRadialGradient(w, h, "fill");
    },

    /**
     * @private
     */
    _getLineFill: function(w, h)
    {
        var type = this.get("lineType");
        if(type === "solid")
        {
            return this.get("lineColor");
        }
        if(type === "linear")
        {
            return this._getLinearGradient(w, h, "line");
        }
        return this._getRadialGradient(w, h, "line");
    },

    /**
     * @private
     */
    _getLinearGradient: function(w, h, type)
    {
        var colors = this.get(type + "Colors"),
            ratios = this.get(type + "Ratios"),
            i,
            l,
            x = this.get("x"),
            y = this.get("y"),
            color,
            ratio,
            def,
            ctx = this.get("context"),
            r = this.get(type + "Rotation"),
            grad;
        //temporary hack for rotation. 
        switch(r)
        {
            case 45:
                grad = ctx.createLinearGradient(x + w, y + h, x, y); 
            break;
            case 90:
                grad = ctx.createLinearGradient(x + w, y, x, y); 
            break;
            case 135:
                grad = ctx.createLinearGradient(x + w, y, x, y + h); 
            break;
            case 180:
                grad = ctx.createLinearGradient(x, y, x, y + h); 
            break;
            case 225:
                grad = ctx.createLinearGradient(x, y, x + w, y + h); 
            break;
            case 270:
                grad = ctx.createLinearGradient(x, y, x + w, y); 
            break;
            case 315:
                grad = ctx.createLinearGradient(x, y + h, x + w, y); 
            break;
            default:
                grad = ctx.createLinearGradient(x, y + h, x, y); 
            break;

        }
        l = colors.length;
        def = 0;
        for(i = 0; i < l; ++i)
        {
            color = colors[i];
            ratio = ratios[i] || def;
            grad.addColorStop(ratio, color);
            def = (i + 1) / l;
        }
        return grad;
    },

    /**
     * @private
     */
    _getRadialGradient: function(w, h, type)
    {
        var colors = this.get(type + "Colors"),
            ratios = this.get(type + "Ratios"),
            i,
            l,
            x = this.get("x"),
            y = this.get("y"),
            color,
            ratio,
            def,
            grad,
            ctx = this.get("context");
        grad = ctx.createRadialGradient(x + w/2, y + w/2, w/2, x + w, y + h, w/2);
        l = colors.length;
        def = 0;
        for(i = 0; i < l; ++i)
        {
            color = colors[i];
            ratio = ratios[i] || def;
            grad.addColorStop(ratio, color);
            def = (i + 1) / l;
        }
        return grad;
    }
});

Y.CanvasAPI = CanvasAPI;
/**
 * VMLAPI provides an api for drawing objects within the dom.
 */
function VMLAPI(config)
{
	VMLAPI.superclass.constructor.apply(this, arguments);
}

VMLAPI.NAME = "vmlAPI";

VMLAPI.ATTRS = {
	parent: {
		getter: function()
		{
			return this._parent;
		},

		setter: function(value)
		{
			if(Y.Lang.isString(value))
			{
				this._parent = document.getElementById(value);
			}
			else
			{
				this._parent = value;
			}
			return this._parent;
		}
	},
	
    canvas: {
		getter: function() {
			if(!this._canvas)
			{
				this._setCanvas();
			}
			return this._canvas;
		}
	},

    x: {
        getter: function()
        {
            return this._x;
        },

        setter: function(val)
        {
            this._x = val;
            return val;
        },

        validator: function(val)
        {
            return Y.Lang.isNumber(val);
        }
    },

    y: {
        getter: function()
        {
            return this._y;
        },

        setter: function(val)
        {
            this._y = val;
            return val;
        },

        validator: function(val)
        {
            return Y.Lang.isNumber(val);
        }
    },

    fillColor: {
        getter: function()
        {
            return this._fillColor;
        },

        setter: function(val)
        {
            this._fillColor = val;
            return val;
        }
    },

    fillAlpha: {
        getter: function()
        {
            return this._fillAlpha;
        },

        setter: function(val)
        {
            this._fillAlpha = val;
            return val;
        }
    },

    lineColor: {
        getter: function()
        {
            return this._lineColor;
        },

        setter: function(val)
        {
            this._lineColor = val;
            return val;
        }
    },

    lineWidth: {
        getter: function()
        {
            return this._lineWidth;
        },

        setter: function(val)
        {
            this._lineWidth = val;
            return val;
        },

        validator: function(val)
        {
            return Y.Lang.isNumber(val);
        }
    },

    lineAlpha: {
        getter: function()
        {
            return this._lineAlpha;
        },

        setter: function(val)
        {
            this._lineAlpha = val;
            return val;
        },

        validator: function(val)
        {
            return Y.Lang.isNumber(val);
        }
    },

    fillType: {
        getter: function()
        {
            return this._fillType;
        },

        setter: function(val)
        {
            this._fillType = val;
            return val;
        },
        
        validator:function(val)
        {
            return Y.Lang.isString(val);
        }

    },

    fillProps: {
        getter: function()
        {
            return this._fillProps;
        },

        setter: function(val)
        {
            this._fillProps = val;
            return val;
        },

        validator: function(val)
        {
            return Y.Lang.isObject(val);
        }

    }
};

Y.extend(VMLAPI, Y.Base, {
	_fillType: "solid",

    _fillProps: null,
    
    _canvas: null,

	_setCanvas: function()
	{
		var parent = this.get("parent"),
            w = parseInt(parent.style.width, 10),
            h = parseInt(parent.style.height, 10);
        this._canvas = document.createElement("v:group");
        this._canvas.setAttribute("id", "engine");
		this._canvas.style.width = w + "px";
		this._canvas.style.height = h + "px";
		this._canvas.setAttribute("coordsize", w + " " + h); 
        parent.appendChild(this._canvas);
	},

    /**
     * @private
     * Storage for x.
     */
    _x: 0,

    /**
     * @private
     * Storage for y.
     */
    _y: 0,

    /**
     * @private
     * Storage for fillColor.
     */
    _fillColor: null,

    /**
     * @private
     * Storage for fillAlpha.
     */
    _fillAlpha: 1,

    /**
     * @private
     * Storage for lineColor.
     */
    _lineColor: null,

    /**
     * @private
     * Storage for lineWidth.
     */
    _lineWidth: 1,

    /**
     * @private
     * Storage for lineAlpha.
     */
    _lineAlpha: 1,

    /** 
     *Specifies a simple one-color fill that subsequent calls to other Graphics methods (such as lineTo() or drawCircle()) use when drawing.
     */
    beginFill: function(color, alpha)
    {
        this.set("fillColor", color);
        this.set("fillAlpha", alpha);
    },
	
    /** 
     *Specifies a gradient fill used by subsequent calls to other Graphics methods (such as lineTo() or drawCircle()) for the object.
     */
    beginGradientFill: function(type, colors, alphas, ratios, rotation, matrix, spreadMethod, interpolationMethod, focalPointRatio)
    {
        var fill = {},
            i = 1,
            len = colors.length;
        fill.type = "linear" ? "gradient" : "GradientRadial";
        fill.color = colors[0];
        for(;i < len; ++i)
        {
            fill["color" + (i + 1)] = colors[i];
        }
        fill.angle = rotation;
        this.set("fillProps", fill);
        this.set("fillType", type);

    },

    /** 
     *Clears the graphics that were drawn to this Graphics object, and resets fill and line style settings.
     */
    clear: function()
    {
    },
	
    /** 
     *Draws a curve using the current line style from the current drawing position to (anchorX, anchorY) and using the control point that (controlX, controlY) specifies.
     */
    curveTo: function(cp1x, cp1y, cp2x, cp2y, x, y)
    {
    },

    /** 
     *Draws a circle.
     */
	drawCircle: function(x, y, radius)
	{
		var diameter = radius * 2,
			sc = this.get("lineColor"),
			lw = this.get("lineWidth"),
			fc = this.get("fillColor"),
            fill,
            fillProps,
            i,
            circ = document.createElement("v:oval");
        circ.setAttribute("strokeweight", lw + "px");
        circ.setAttribute("strokecolor", sc);
        circ.style.left = x + "px";
        circ.style.top = y + "px";
        circ.style.width = diameter + "px";
        circ.style.height = diameter + "px";
        if(this.get("fillType") === "solid")
        {
            circ.fillcolor = fc;
        }
        else
        {
            fillProps = this.get("fillProps");
            fill = document.createElement("v:fill");
            for(i in fillProps)
            {
                if(fillProps.hasOwnProperty(i))
                {
                    fill[i] = fillProps[i];
                }
            }
            circ.appendChild(fill);
        }
        this.get("canvas").appendChild(circ);
	},

    /** 
     *Draws an ellipse.
     */
    drawEllipse: function(x, y, w, h)
    {
    },
	
    /** 
     *Draws a rectangle.
     */
    drawRectangle: function(x, y, w, h)
	{
		var lw = this.get("lineWidth"),
			fc = this.get("fillColor"),
			sc = this.get("lineColor"),
            rect = document.createElement("v:rect"),
            fill,
            fillProps,
            i;
        rect.setAttribute("strokeweight", lw + "px");
        rect.style.width = w + "px";
        rect.style.height = h + "px";
        rect.style.top = y;
        rect.style.left = x;
        if(this.get("fillType") === "solid")
        {
            rect.fillColor = fc;
        }
        else
        {
            fillProps = this.get("fillProps");
            fill = document.createElement("v:fill");
            for(i in fillProps)
            {
                if(fillProps.hasOwnProperty(i))
                {
                    fill[i] = fillProps[i];
                }
            }
            rect.appendChild(fill);
        }
        rect.strokecolor = sc;
        this.get("canvas").appendChild(rect);
	},
	
    /** 
     *Draws a rounded rectangle.
     */
    drawRoundRect: function(x, y, w, h, ew, eh)
    {
		var lw = this.get("lineWidth"),
			fc = this.get("fillColor"),
			sc = this.get("lineColor"),
            rect = document.createElement("v:roundrect"),
            len = Math.min(w/2, h/2),
            pct = Math.round((ew/len)*100),
            fill,
            fillProps,
            i;
        rect.setAttribute("strokeweight", lw + "px");
        rect.arcsize = pct + "%";
        rect.style.width = w + "px";
        rect.style.height = h + "px";
        rect.style.top = y;
        rect.style.left = x;
        if(this.get("fillType") === "solid")
        {
            rect.fillColor = fc;
        }
        else
        {
            fillProps = this.get("fillProps");
            fill = document.createElement("v:fill");
            for(i in fillProps)
            {
                if(fillProps.hasOwnProperty(i))
                {
                    fill[i] = fillProps[i];
                }
            }
            rect.appendChild(fill);
        }
        rect.strokecolor = sc;
        this.get("canvas").appendChild(rect);
    },
        
    /** 
     *Applies a fill to the lines and curves that were added since the last call to the beginFill() or beginGradientFill() method.
     */
    endFill: function()
    {

    },

    /** 
     *Specifies a gradient to use for the stroke when drawing lines.
     */
    lineGradientStyle: function(type, colors, alphas, ratios, matrix, spreadMethod, interpolationMethod, focalPointRatio)
    {
    },
        
    /** 
     *Specifies a line style used for subsequent calls to Graphics methods such as the lineTo() method or the drawCircle() method.
     */
    lineStyle: function(thickness, color, alpha, pixelHinting, scaleMode, caps, joints, miterLimit)
    {
        this.set("lineWidth", thickness);
        this.set("lineColor", color);
        this.set("lineAlpha", alpha);
    },
    
    /** 
     *Draws a line using the current line style from the current drawing position to (x, y); the current drawing position is then set to (x, y).
     */
    lineTo: function(x, y)
    {
    },
    
    /** 
     * Moves the current drawing position to (x, y).
     */
    moveTo: function(x, y)
    {
        this.set("x", x);
        this.set("y", y);
    }
});

Y.VMLAPI = VMLAPI;


}, '@VERSION@' );
