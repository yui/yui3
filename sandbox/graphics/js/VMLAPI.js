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
