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
