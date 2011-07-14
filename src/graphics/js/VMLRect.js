/**
 * Draws rectangles
 *
 * @module graphics
 * @class VMLRect
 * @constructor
 */
VMLRect = function()
{
	VMLRect.superclass.constructor.apply(this, arguments);
};
VMLRect.NAME = "vmlRect"; 
Y.extend(VMLRect, Y.VMLShape, {
	/**
	 * Indicates the type of shape
	 *
	 * @property _type
	 * @readOnly
	 * @type String
	 */
	_type: "rect"
});
VMLRect.ATTRS = Y.VMLShape.ATTRS;
Y.VMLRect = VMLRect;
