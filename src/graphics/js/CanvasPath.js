/**
 * The CanvasPath class creates a graphic object with editable 
 * properties.
 *
 * @class CanvasPath
 * @extends CanvasShape
 */
var CanvasPath = function(cfg)
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
     * @private
     */
    _addListeners: function() {},

    /**
     * @private
     */
    _draw: function()
    {
        this._paint();
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
			return this._width;
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
			return this._height;
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
		getter: function()
		{
			return this._path;
		},

		setter: function(val)
		{
			this._path = val;
			return val;
		}
	}
});
Y.CanvasPath = CanvasPath;
