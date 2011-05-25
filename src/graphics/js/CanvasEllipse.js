/**
 * Draws ellipses
 */
var Y_CanvasShape = Y.CanvasShape,
    Y_CanvasEllipse = function(cfg)
    {
        Y_CanvasEllipse.superclass.constructor.apply(this, arguments);
    };

	Y_CanvasEllipse.NAME = "canvasEllipse";

	Y.extend(Y_CanvasEllipse, Y_CanvasShape, {
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
			this.drawEllipse(0, 0, w, h);
			this._paint();
		}
	});
	Y_CanvasEllipse.ATTRS = Y_CanvasShape.ATTRS;
	Y.CanvasEllipse = Y_CanvasEllipse;
