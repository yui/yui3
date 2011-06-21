/**
 * The SVGPath class creates a shape through the use of drawing methods.
 *
 * @class SVGPath
 * @extends SVGShape
 */
SVGPath = function(cfg)
{
	SVGPath.superclass.constructor.apply(this, arguments);
};
SVGPath.NAME = "svgPath";
Y.extend(SVGPath, Y.SVGShape, Y.merge(Y.SVGDrawing.prototype, {
    /**
     * Left edge of the path
     *
     * @private
     * @property _left
     */
    _left: 0,

    /**
     * Right edge of the path
     *
     * @private
     * @property _right
     */
    _right: 0,
    
    /**
     * Top edge of the path
     *
     * @private
     * @property _top
     */
    _top: 0, 
    
    /**
     * Bottom edge of the path
     *
     * @private
     * @property _bottom
     */
    _bottom: 0,

    /**
     * Indicates the type of shape
     *
     * @private
     * @property _type
     * @readOnly
     * @type String
     */
    _type: "path",

    /**
     * Draws the path.
     *
     * @method _draw
     * @private
     */
    _draw: function()
    {
        var pathArray,
            segmentArray,
            pathType,
            len,
            val,
            val2,
            i,
            path = "",
            node = this.node,
            tx = this.get("translateX"),
            ty = this.get("translateY"),
            left = this._left,
            top = this._top,
            fill = this.get("fill");
        if(this._pathArray)
        {
            pathArray = this._pathArray.concat();
            while(pathArray && pathArray.length > 0)
            {
                segmentArray = pathArray.shift();
                len = segmentArray.length;
                pathType = segmentArray[0];
                path += " " + pathType + (segmentArray[1] - left);
                switch(pathType)
                {
                    case "L" :
                    case "M" :
                    case "Q" :
                        for(i = 2; i < len; ++i)
                        {
                            val = (i % 2 === 0) ? top : left;
                            val = segmentArray[i] - val;
                            path += ", " + val;
                        }
                    break;
                    case "C" :
                        for(i = 2; i < len; ++i)
                        {
                            val = (i % 2 === 0) ? top : left;
                            val2 = segmentArray[i];
                            val2 -= val;
                            path += " " + val2;
                        }
                    break;

                }
            }
            if(fill && fill.color)
            {
                path += 'z';
            }
            if(path)
            {
                node.setAttribute("d", path);
            }
            //Use transform to handle positioning.
            this._transformArgs = this._transformArgs || {};
            this._transformArgs.translate = [left + tx, top + ty];
            
            this._path = path;
            this._fillChangeHandler();
            this._strokeChangeHandler();
            this._updateTransform();
        }
    },
   
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
	 * @private
	 */ 
	_updateHandler: function()
	{
		//do nothing
	},
 
    /**
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function()
    {
        this._draw();
        this._graphic.addToRedrawQueue(this);    
    },

    /**
     * Clears the path.
     *
     * @method clear
     */
    clear: function()
    {
        this._left = 0;
        this._right = 0;
        this._top = 0;
        this._bottom = 0;
        this._pathArray = [];
        this._path = "";
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

	_path: ""
}));

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
