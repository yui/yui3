/**
 * Draws pie slices
 */
SVGPieSlice = function()
{
	SVGPieSlice.superclass.constructor.apply(this, arguments);
};
SVGPieSlice.NAME = "svgPieSlice";
Y.extend(SVGPieSlice, Y.SVGPath, {
    /**
     * Indicates the type of shape
     *
     * @property _type
     * @readOnly
     * @type String
     */
    _type: "path",

	/**
	 * Change event listener
	 *
	 * @private
	 * @method _updateHandler
	 */
	_updateHandler: function(e)
	{
        var x = this.get("cx"),
            y = this.get("cy"),
            startAngle = this.get("startAngle"),
            arc = this.get("arc"),
            radius = this.get("radius");
        this.clear();
        this.drawWedge(x, y, startAngle, arc, radius);
		this._draw();
	}
 });
SVGPieSlice.ATTRS = Y.mix(Y.SVGPath.ATTRS, {
    cx: {
        value: 0
    },

    cy: {
        value: 0
    },
    /**
     * Starting angle in relation to a circle in which to begin the pie slice drawing.
     *
     * @attribute startAngle
     * @type Number
     */
    startAngle: {
        value: 0
    },

    /**
     * Arc of the slice.
     *
     * @attribute arc
     * @type Number
     */
    arc: {
        value: 0
    },

    /**
     * Radius of the circle in which the pie slice is drawn
     *
     * @attribute radius
     * @type Number
     */
    radius: {
        value: 0
    }
});
Y.SVGPieSlice = SVGPieSlice;
