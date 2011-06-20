/**
 * Draws ellipses
 */
CanvasEllipse = function(cfg)
{
	CanvasEllipse.superclass.constructor.apply(this, arguments);
};

CanvasEllipse.NAME = "canvasEllipse";

Y.extend(CanvasEllipse, CanvasShape, {
	/**
	 * Indicates the type of shape
	 *
	 * @property _type
	 * @readOnly
	 * @type String
	 */
	_type: "ellipse",

	/**
	 * @private
	 */
	_draw: function()
	{
		var w = this.get("width"),
			h = this.get("height");
		this.clear();
        this.drawEllipse(0, 0, w, h);
		this._paint();
	}
});
CanvasEllipse.ATTRS = CanvasShape.ATTRS;
Y.CanvasEllipse = CanvasEllipse;
