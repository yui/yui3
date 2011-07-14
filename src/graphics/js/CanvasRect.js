/**
 * Draws rectangles
 *
 * @module graphics
 * @class CanvasRect
 * @constructor
 */
CanvasRect = function()
{
	CanvasRect.superclass.constructor.apply(this, arguments);
};
CanvasRect.NAME = "canvasRect";
Y.extend(CanvasRect, Y.CanvasShape, {
	/**
	 * Indicates the type of shape
	 *
	 * @property _type
	 * @readOnly
	 * @type String
	 */
	_type: "rect",

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
        this.drawRect(0, 0, w, h);
		this._paint();
	}
});
CanvasRect.ATTRS = Y.CanvasShape.ATTRS;
Y.CanvasRect = CanvasRect;
