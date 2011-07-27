/**
 * Draws a circle
 *
 * @module graphics
 * @class VMLCircle
 * @constructor
 */
VMLCircle = function(cfg)
{
	VMLCircle.superclass.constructor.apply(this, arguments);
};

VMLCircle.NAME = "vmlCircle";

Y.extend(VMLCircle, VMLShape, {
	/**
	 * Indicates the type of shape
	 *
	 * @property _type
	 * @readOnly
	 * @type String
	 */
	_type: "oval"
});

VMLCircle.ATTRS = Y.merge(VMLShape.ATTRS, {
	/**
	 * Radius for the circle.
	 *
	 * @config radius
	 * @type Number
	 */
	radius: {
		lazyAdd: false,

		value: 0
	},

	/**
	 * Width of the circle
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
			var radius = this.get("radius"),
			val = radius && radius > 0 ? radius * 2 : 0;
			return val;
		}
	},

	/**
	 * Width of the circle
	 *
	 * @config width
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
			var radius = this.get("radius"),
			val = radius && radius > 0 ? radius * 2 : 0;
			return val;
		}
	}
});
Y.VMLCircle = VMLCircle;
