/**
 * The SVGPath class creates a shape through the use of drawing methods.
 *
 * @module graphics
 * @class SVGPath
 * @extends SVGShape
 * @constructor
 */
SVGPath = function(cfg)
{
	SVGPath.superclass.constructor.apply(this, arguments);
};
SVGPath.NAME = "svgPath";
Y.extend(SVGPath, Y.SVGShape, {
    /**
     * Left edge of the path
     *
     * @property _left
     * @type Number
     * @private
     */
    _left: 0,

    /**
     * Right edge of the path
     *
     * @property _right
     * @type Number
     * @private
     */
    _right: 0,
    
    /**
     * Top edge of the path
     *
     * @property _top
     * @type Number
     * @private
     */
    _top: 0, 
    
    /**
     * Bottom edge of the path
     *
     * @property _bottom
     * @type Number
     * @private
     */
    _bottom: 0,

    /**
     * Indicates the type of shape
     *
     * @property _type
     * @readOnly
     * @type String
     * @private
     */
    _type: "path",
   
    /**
     * Applies translate transformation.
     *
     * @method translate
     * @param {Number} x The x-coordinate
     * @param {Number} y The y-coordinate
     */
    translate: function(x, y)
    {
        x = parseInt(x, 10);
        y = parseInt(y, 10);
        this._translateX = x;
        this._translateY = y;
        this._translate(this._left + x, this._top + y);
    },
  
	/**
	 * Draws the shape.
	 *
	 * @method _draw
	 * @private
	 */
    _draw: function()
    {
        this._fillChangeHandler();
        this._strokeChangeHandler();
    },

    /**
     * Returns the bounds for a shape.
     *
     * @method getBounds
     * @return Object
     */
    getBounds: function()
    {
        var wt = 0,
            bounds = {},
            stroke = this.get("stroke"),
            tx = this.get("translateX"),
            ty = this.get("translateY");
        if(stroke && stroke.weight)
        {
            wt = stroke.weight;
        }
        bounds.left = this._left - wt + tx;
        bounds.top = this._top - wt + ty;
        bounds.right = (this._right - this._left) + wt + tx;
        bounds.bottom = (this._bottom - this._top) + wt + ty;
        return bounds;
    },

    /**
     *  @private
     */
	_path: ""
});

SVGPath.ATTRS = Y.merge(Y.SVGShape.ATTRS, {
	/**
	 * Path string of the shape
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
	},

	/**
	 * Indicates the height of the shape
	 * 
	 * @attribute height
	 * @type Number
	 */
	width: {
		getter: function()
		{
			var val = Math.max(this._right - this._left, 0);
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
			return Math.max(this._bottom - this._top, 0);
		}
	}
});
Y.SVGPath = SVGPath;
