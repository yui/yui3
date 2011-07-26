/**
 * Draws an ellipse
 *
 * @module graphics
 * @class VMLEllipse
 * @constructor
 */
VMLEllipse = function()
{
	VMLEllipse.superclass.constructor.apply(this, arguments);
};

VMLEllipse.NAME = "vmlEllipse";

Y.extend(VMLEllipse, Y.VMLShape, {
	/**
	 * Indicates the type of shape
	 *
	 * @property _type
	 * @readOnly
	 * @type String
	 */
	_type: "oval"
});
VMLEllipse.ATTRS = Y.merge(Y.VMLShape.ATTRS, {
	/**
	 * Horizontal radius for the ellipse.
	 *
	 * @config xRadius
	 * @type Number
	 */
	xRadius: {
		lazyAdd: false,

		getter: function()
		{
			var val = this.get("width");
			val = Math.round((val/2) * 100)/100;
			return val;
		},
		
		setter: function(val)
		{
			var w = val * 2; 
			this.set("width", w);
			return val;
		}
	},

	/**
	 * Vertical radius for the ellipse.
	 *
	 * @config yRadius
	 * @type Number
	 */
	yRadius: {
		lazyAdd: false,
		
		getter: function()
		{
			var val = this.get("height");
			val = Math.round((val/2) * 100)/100;
			return val;
		},

		setter: function(val)
		{
			var h = val * 2;
			this.set("height", h);
			return val;
		}
	}
});
Y.VMLEllipse = VMLEllipse;
