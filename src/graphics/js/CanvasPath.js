/**
 * The CanvasPath class creates a graphic object with editable 
 * properties.
 *
 * @class CanvasPath
 * @extends CanvasShape
 */
CanvasPath = function(cfg)
{
	CanvasPath.superclass.constructor.apply(this, arguments);
};
CanvasPath.NAME = "canvasPath";
Y.extend(CanvasPath, Y.CanvasShape, {
    /**
     * Indicates the type of shape
     *
     * @property _type
     * @readOnly
     * @type String
     */
    _type: "path",

	/**
	 * Draws the shape.
	 *
	 * @method _draw
	 * @private
	 */
    _draw: function()
    {
        this._paint();
    },

	/**
	 * Creates the dom node for the shape.
	 *
	 * @private
	 * @return HTMLElement
	 */
	createNode: function()
	{
		var node = Y.config.doc.createElement('canvas'),
			id = this.get("id");
		this._context = node.getContext('2d');
		node.setAttribute("overflow", "visible");
        node.setAttribute("pointer-events", "none");
        node.style.pointerEvents = "none";
        node.style.overflow = "visible";
        node.setAttribute("class", "yui3-" + SHAPE);
		node.setAttribute("class", "yui3-" + this.name);
		node.setAttribute("id", id);
		id = "#" + id;
		this.node = node;
	},

    /**
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function()
    {
        this._draw();
    }
});

CanvasPath.ATTRS = Y.merge(Y.CanvasShape.ATTRS, {
	/**
	 * Indicates the width of the shape
	 *
	 * @attribute width
	 * @type Number
	 */
	width: {
		getter: function()
		{
			var offset = this._stroke && this._strokeWeight ? (this._strokeWeight * 2) : 0;
			return this._width - offset;
		},

		setter: function(val)
		{
			this._width = val;
			return val;
		}
	},

	/**
	 * Indicates the height of the shape
	 *
	 * @attribute height
	 * @type Number
	 */
	height: {
		getter: function()
		{
			var offset = this._stroke && this._strokeWeight ? (this._strokeWeight * 2) : 0;
            return this._height - offset;
		},

		setter: function(val)
		{
			this._height = val;
			return val;
		}
	},
	
	/**
	 * Indicates the path used for the node.
	 *
	 * @attribute path
	 * @type String
	 */
	path: {
        readOnly: true,

		getter: function()
		{
			return this._path;
		}
	}
});
Y.CanvasPath = CanvasPath;
