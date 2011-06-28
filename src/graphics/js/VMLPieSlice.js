/**
 * Draws pie slices
 */
VMLPieSlice = function()
{
	VMLPieSlice.superclass.constructor.apply(this, arguments);
};
VMLPieSlice.NAME = "vmlPieSlice";
Y.extend(VMLPieSlice, Y.VMLPath, {
    /**
     * Indicates the type of shape
     *
     * @property _type
     * @readOnly
     * @type String
     */
    _type: "shape",
	/**
	 * Initializes the shape
	 *
	 * @private
	 * @method _initialize
	 */
	initializer: function(cfg)
	{
		var host = this,
            graphic = cfg.graphic;
		host.createNode(); 
        host._graphic = graphic;
        host._updateHandler();
        graphic.addToRedrawQueue(this);
	},

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
VMLPieSlice.ATTRS = Y.mix(Y.VMLPath.ATTRS, {
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
Y.VMLPieSlice = VMLPieSlice;
