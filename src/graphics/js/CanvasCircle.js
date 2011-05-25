/**
 * Draws an circle
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
	 * @readOnly
	 * @type String
	 */
	_type: "circle",

	/**
	 * @private
	 */
	_draw: function()
	{
		var radius = this.get("radius");
		if(radius)
		{
			this.drawCircle(0, 0, radius);
			this._paint();
		}
	}
});

CanvasCircle.ATTRS = Y.merge(Y.CanvasShape.ATTRS, {
	/**
	 * Indicates the width of the shape
	 *
	 * @attribute width
	 * @type Number
	 */
	width: {
		readOnly:true,

		getter: function()
		{
			return this.get("radius") * 2;
		}
	},

	/**
	 * Indicates the height of the shape
	 *
	 * @attribute height
	 * @type Number
	 */
	height: {
		readOnly:true,

		getter: function()
		{
			return this.get("radius") * 2;
		}
	},

	/**
	 * Radius of the circle
	 *
	 * @attribute radius
	 */
	radius: {
		lazyAdd: false
	}
});
Y.CanvasCircle = CanvasCircle;
