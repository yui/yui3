/**
 * Draws an circle
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
     * Horizontal radius for the circle.
     *
     * @attribute radius
     * @type Number
     */
    radius: {
        lazyAdd: false,

        value: 0
    },

    /**
     * Width of the circle
     *
     * @attribute width
     * @readOnly
     * @type Number
     */
    width: {
        readOnly: true,

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
     * @attribute width
     * @readOnly
     * @type Number
     */
    height: {
        readOnly: true,

        getter: function()
        {   
            var radius = this.get("radius"),
            val = radius && radius > 0 ? radius * 2 : 0;
            return val;
        }
	}
});
Y.VMLCircle = VMLCircle;
