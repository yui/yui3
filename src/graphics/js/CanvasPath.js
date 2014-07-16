/**
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> implementation of the <a href="Path.html">`Path`</a> class.
 * `CanvasPath` is not intended to be used directly. Instead, use the <a href="Path.html">`Path`</a> class.
 * If the browser lacks <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities but has
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> capabilities, the <a href="Path.html">`Path`</a>
 * class will point to the `CanvasPath` class.
 *
 * @module graphics
 * @class CanvasPath
 * @extends CanvasShape
 */
CanvasPath = function()
{
	CanvasPath.superclass.constructor.apply(this, arguments);
};
CanvasPath.NAME = "path";
Y.extend(CanvasPath, Y.CanvasShape, {
    /**
     * Indicates the type of shape
     *
     * @property _type
     * @type String
     * @private
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
        this._closePath();
        this._updateTransform();
    },

	/**
	 * Creates the dom node for the shape.
	 *
     * @method createNode
	 * @return HTMLElement
	 * @private
	 */
	createNode: function()
	{
		var host = this,
            node = Y.config.doc.createElement('canvas'),
			name = host.name,
            concat = host._camelCaseConcat,
            id = host.get("id");
		host._context = node.getContext('2d');
		node.setAttribute("overflow", "visible");
        node.setAttribute("pointer-events", "none");
        node.style.pointerEvents = "none";
        node.style.overflow = "visible";
		node.setAttribute("id", id);
		id = "#" + id;
		host.node = node;
		host.addClass(
            _getClassName(SHAPE) +
            " " +
            _getClassName(concat(IMPLEMENTATION, SHAPE)) +
            " " +
            _getClassName(name) +
            " " +
            _getClassName(concat(IMPLEMENTATION, name))
        );
	},

    /**
     * Completes a drawing operation.
     *
     * @method end
     */
    end: function()
    {
        this._draw();
        return this;
    }
});

CanvasPath.ATTRS = Y.merge(Y.CanvasShape.ATTRS, {
	/**
	 * Indicates the width of the shape
	 *
	 * @config width
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
	 * @config height
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
	 * @config path
	 * @type String
     * @readOnly
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
