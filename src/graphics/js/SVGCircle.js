/**
 * Draws an circle
 */
 SVGCircle = function(cfg)
 {
    SVGCircle.superclass.constructor.apply(this, arguments);
 };
    
 SVGCircle.NAME = "svgCircle";

 Y.extend(SVGCircle, Y.SVGShape, {    
    
    /**
     * Indicates the type of shape
     *
     * @property _type
     * @readOnly
     * @type String
     */
    _type: "circle",

    /**
     * Updates the shape.
     *
     * @method _draw
     * @private
     */
    _draw: function()
    {
        var node = this.node,
            x = this.get("x"),
            y = this.get("y"),
            radius = this.get("radius"),
            cx = x + radius,
            cy = y + radius;
        node.setAttribute("r", radius);
        node.setAttribute("cx", cx);
        node.setAttribute("cy", cy);
        this._fillChangeHandler();
        this._strokeChangeHandler();
        this._updateTransform();
    }
 });
    
SVGCircle.ATTRS = Y.merge(Y.SVGShape.ATTRS, {
	/**
	 * Indicates the width of the shape
	 *
	 * @attribute width
	 * @type Number
     * @readOnly
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
     * @readOnly
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
     * @type Number
     */
    radius: {
        value: 0
    }
});
Y.SVGCircle = SVGCircle;
