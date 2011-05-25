/**
 * Draws an circle
 */
 var Y_SVGCircle = function(cfg)
 {
    Y_SVGCircle.superclass.constructor.apply(this, arguments);
 };
    
 Y_SVGCircle.NAME = "svgCircle";

 Y.extend(Y_SVGCircle, Y.SVGShape, {    
    
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
    
Y_SVGCircle.ATTRS = Y.merge(Y.SVGShape.ATTRS, {
    /**
     * 
     * @attribute width
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
     * 
     * @attribute height
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
     */
    radius: {
        value: 0
    }
});
Y.SVGCircle = Y_SVGCircle;
