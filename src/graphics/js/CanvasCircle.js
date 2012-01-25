/**
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> implementation of the <a href="Circle.html">`Circle`</a> class. 
 * `CanvasCircle` is not intended to be used directly. Instead, use the <a href="Circle.html">`Circle`</a> class. 
 * If the browser lacks <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities but has 
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> capabilities, the <a href="Circle.html">`Circle`</a> 
 * class will point to the `CanvasCircle` class.
 *
 * @module graphics
 * @class CanvasCircle
 * @constructor
 */
CanvasCircle = function(cfg)
{
	CanvasCircle.superclass.constructor.apply(this, arguments);
};
    
CanvasCircle.NAME = "canvasCircle";

Y.extend(CanvasCircle, Y.CanvasShape, {
	/**
	 * Indicates the type of shape
	 *
	 * @property _type
	 * @type String
     * @private
	 */
	_type: "circle",

	/**
     * Draws the shape.
     *
     * @method _draw
	 * @private
	 */
	_draw: function()
	{
		var radius = this.get("radius");
		if(radius)
		{
            this.clear();
            this.drawCircle(0, 0, radius);
			this._closePath();
		}
	}
});

CanvasCircle.ATTRS = Y.merge(Y.CanvasShape.ATTRS, {
	/**
	 * Indicates the width of the shape
	 *
	 * @config width
	 * @type Number
	 */
	width: {
        setter: function(val)
        {
            this.set("radius", val/2);
            return val;
        },

		getter: function()
		{
			return this.get("radius") * 2;
		}
	},

	/**
	 * Indicates the height of the shape
	 *
	 * @config height
	 * @type Number
	 */
	height: {
        setter: function(val)
        {
            this.set("radius", val/2);
            return val;
        },

		getter: function()
		{
			return this.get("radius") * 2;
		}
	},

	/**
	 * Radius of the circle
	 *
	 * @config radius
     * @type Number
	 */
	radius: {
		lazyAdd: false
	}
});
Y.CanvasCircle = CanvasCircle;
