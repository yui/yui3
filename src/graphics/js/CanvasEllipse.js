/**
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> implementation of the <a href="Ellipse.html">`Ellipse`</a> class.
 * `CanvasEllipse` is not intended to be used directly. Instead, use the <a href="Ellipse.html">`Ellipse`</a> class.
 * If the browser lacks <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities but has
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> capabilities, the <a href="Ellipse.html">`Ellipse`</a>
 * class will point to the `CanvasEllipse` class.
 *
 * @module graphics
 * @class CanvasEllipse
 * @constructor
 */
CanvasEllipse = function()
{
	CanvasEllipse.superclass.constructor.apply(this, arguments);
};

CanvasEllipse.NAME = "ellipse";

Y.extend(CanvasEllipse, CanvasShape, {
	/**
	 * Indicates the type of shape
	 *
	 * @property _type
	 * @type String
     * @private
	 */
	_type: "ellipse",

	/**
     * Draws the shape.
     *
     * @method _draw
	 * @private
	 */
	_draw: function()
	{
		var w = this.get("width"),
			h = this.get("height");
		this.clear();
        this.drawEllipse(0, 0, w, h);
		this._closePath();
	}
});
CanvasEllipse.ATTRS = Y.merge(CanvasShape.ATTRS, {
	/**
	 * Horizontal radius for the ellipse.
	 *
	 * @config xRadius
	 * @type Number
	 */
	xRadius: {
		setter: function(val)
		{
			this.set("width", val * 2);
		},

		getter: function()
		{
			var val = this.get("width");
			if(val)
			{
				val *= 0.5;
			}
			return val;
		}
	},

	/**
	 * Vertical radius for the ellipse.
	 *
	 * @config yRadius
	 * @type Number
	 * @readOnly
	 */
	yRadius: {
		setter: function(val)
		{
			this.set("height", val * 2);
		},

		getter: function()
		{
			var val = this.get("height");
			if(val)
			{
				val *= 0.5;
			}
			return val;
		}
	}
});
Y.CanvasEllipse = CanvasEllipse;
