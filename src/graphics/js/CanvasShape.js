/**
 * Base class for creating shapes.
 *
 * @class CanvasShape
 */
CanvasShape = function(cfg)
{
    CanvasShape.superclass.constructor.apply(this, arguments);
};

CanvasShape.NAME = "canvasShape";

Y.extend(CanvasShape, Y.BaseGraphic, Y.mix(Y.CanvasDrawing.prototype, {
	/**
     * @private
     */
    init: function()
	{
		this.initializer.apply(this, arguments);
	},

	/**
	 * Initializes the shape
	 *
	 * @private
	 * @method _initialize
	 */
	initializer: function(cfg)
	{
		var host = this;
        host._initProps();
		host.createNode(); 
		host._graphic = cfg.graphic;
		host._xcoords = [0];
		host._ycoords = [0];
		host._updateHandler();
	},
   
	/**
	 * Add a class name to each node.
	 *
	 * @method addClass
	 * @param {String} className the class name to add to the node's class attribute 
	 */
	addClass: function(className)
	{
		var node = Y.one(this.get("node"));
		node.addClass(className);
	},
	
	/**
	 * Removes a class name from each node.
	 *
	 * @method removeClass
	 * @param {String} className the class name to remove from the node's class attribute
	 */
	removeClass: function(className)
	{
		var node = Y.one(this.get("node"));
		node.removeClass(className);
	},

	/**
	 * Gets the current position of the node in page coordinates.
	 *
	 * @method getXY
	 * @return Array The XY position of the shape.
	 */
	getXY: function()
	{
		var graphic = this.get("graphic"),
			parentXY = graphic.getXY(),
			x = this.get("x"),
			y = this.get("y");
		return [parentXY[0] + x, parentXY[1] + y];
	},

	/**
	 * Set the position of the shape in page coordinates, regardless of how the node is positioned.
	 *
	 * @method setXY
	 * @param {Array} Contains X & Y values for new position (coordinates are page-based)
	 */
	setXY: function(xy)
	{
		var graphic = this.get("graphic"),
			parentXY = graphic.getXY(),
			x = xy[0] - parentXY[0],
			y = xy[1] - parentXY[1];
		this._set("x", x);
		this._set("y", y);
		this._updateNodePosition(x, y);
	},

	/**
	 * Determines whether the node is an ancestor of another HTML element in the DOM hierarchy. 
	 *
	 * @method contains
	 * @param {CanvasShape | HTMLElement} needle The possible node or descendent
	 * @return Boolean Whether or not this shape is the needle or its ancestor.
	 */
	contains: function(needle)
	{
		return needle === Y.one(this.node);
	},

	/**
	 * Test if the supplied node matches the supplied selector.
	 *
	 * @method test
	 * @param {String} selector The CSS selector to test against.
	 * @return Boolean Wheter or not the shape matches the selector.
	 */
	test: function(selector)
	{
		return Y.one(this.get("node")).test(selector);
		//return Y.Selector.test(this.node, selector);
	},

	/**
	 * Compares nodes to determine if they match.
	 * Node instances can be compared to each other and/or HTMLElements.
	 * @method compareTo
	 * @param {HTMLElement | Node} refNode The reference node to compare to the node.
	 * @return {Boolean} True if the nodes match, false if they do not.
	 */
	compareTo: function(refNode) {
		var node = this.node;
		return node === refNode;
	},

	/**
	 * Value function for fill attribute
	 *
	 * @private
	 * @method _getDefaultFill
	 * @return Object
	 */
	_getDefaultFill: function() {
		return {
			type: "solid",
			cx: 0.5,
			cy: 0.5,
			fx: 0.5,
			fy: 0.5,
			r: 0.5
		};
	},

	/**
	 * Value function for stroke attribute
	 *
	 * @private
	 * @method _getDefaultStroke
	 * @return Object
	 */
	_getDefaultStroke: function() 
	{
		return {
			weight: 1,
			dashstyle: "none",
			color: "#000",
			opacity: 1.0
		};
	},

	/**
	 * Left edge of the path
	 *
	 * @private
	 */
	_left: 0,

	/**
	 * Right edge of the path
	 *
	 * @private
	 */
	_right: 0,
	
	/**
	 * Top edge of the path
	 *
	 * @private
	 */
	_top: 0, 
	
	/**
	 * Bottom edge of the path
	 *
	 * @private
	 */
	_bottom: 0,

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
        node.style.overflow = "visible";
        node.setAttribute("class", "yui3-" + SHAPE);
		node.setAttribute("class", "yui3-" + this.name);
		node.setAttribute("id", id);
		id = "#" + id;
		this.node = node;
	},

	/**
	 * @private
	 */
	isMouseEvent: function(type)
	{
		if(type.indexOf('mouse') > -1 || type.indexOf('click') > -1)
		{
			return true;
		}
		return false;
	},
	
	/**
	 * @private
	 */
	before: function(type, fn)
	{
		if(this.isMouseEvent(type))
		{
			return Y.before(type, fn, "#" +  this.get("id"));
		}
		return Y.on.apply(this, arguments);
	},
	
	/**
	 * @private
	 */
	on: function(type, fn)
	{
		if(this.isMouseEvent(type))
		{
			return Y.on(type, fn, "#" +  this.get("id"));
		}
		return Y.on.apply(this, arguments);
	},
	
	/**
	 * @private
	 */
	after: function(type, fn)
	{
		if(this.isMouseEvent(type))
		{
			return Y.after(type, fn, "#" +  this.get("id"));
		}
		return Y.on.apply(this, arguments);
	},
	
	/**
	 * Adds a stroke to the shape node.
	 *
	 * @method _strokeChangeHandler
	 * @private
	 */
	_setStrokeProps: function(stroke)
	{
		var color = stroke.color,
			weight = stroke.weight,
			opacity = stroke.opacity,
			linejoin = stroke.linejoin || "round",
			linecap = stroke.linecap || "butt",
			dashstyle = stroke.dashstyle;
		this._miterlimit = null;
		this._dashstyle = (dashstyle && Y.Lang.isArray(dashstyle) && dashstyle.length > 1) ? dashstyle : null;
		this._strokeWeight = weight;

		if (weight) 
		{
			this._stroke = 1;
		} 
		else 
		{
			this._stroke = 0;
		}
		if (opacity) {
			this._strokeStyle = this._2RGBA(color, opacity);
		}
		else
		{
			this._strokeStyle = color;
		}
		this._linecap = linecap;
		if(linejoin == "round" || linejoin == "square")
		{
			this._linejoin = linejoin;
		}
		else
		{
			linejoin = parseInt(linejoin, 10);
			if(Y.Lang.isNumber(linejoin))
			{
				this._miterlimit =  Math.max(linejoin, 1);
				this._linejoin = "miter";
			}
		}
	},

	/**
	 * @private
	 */
	set: function() 
	{
		var host = this,
			val = arguments[0];
		AttributeLite.prototype.set.apply(host, arguments);
		if(host.initialized && val != "x" && val != "y")
		{
			host._updateHandler();
		}
	},
	
	/**
	 * Adds a fill to the shape node.
	 *
	 * @method _fillChangeHandler
	 * @private
	 */
	_setFillProps: function(fill)
	{
		var isNumber = Y.Lang.isNumber,
			color = fill.color,
			opacity,
			type = fill.type;
		if(type == "linear" || type == "radial")
		{
			this._fillType = type;
		}
		else if(color)
		{
			opacity = fill.opacity;
			if (isNumber(opacity)) 
			{
				opacity = Math.max(0, Math.min(1, opacity));
				color = this._2RGBA(color, opacity);
			} 
			else 
			{
				color = this._2RGB(color);
			}

			this._fillColor = color;
			this._fillType = 'solid';
		}
		else
		{
			this._fillColor = null;
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
		this._translateX = x;
		this._translateY = y;
		this._translate.apply(this, arguments);
	},

	/**
	 * Applies translate transformation.
	 *
	 * @method translate
	 * @param {Number} x The x-coordinate
	 * @param {Number} y The y-coordinate
	 * @protected
	 */
	_translate: function(x, y)
	{
		var translate = "translate(" + x + "px, " + y + "px)";
		this._updateTransform("translate", /translate\(.*\)/, translate);
	},

	/**
	 * Applies a skew to the x-coordinate
	 *
	 * @method skewX:q
	 * @param {Number} x x-coordinate
	 */
	 skewX: function(x)
	 {
	 },

	/**
	 * Applies a skew to the x-coordinate
	 *
	 * @method skewX:q
	 * @param {Number} x x-coordinate
	 */
	 skewY: function(y)
	 {
	 },

	/**
	 * @private
	 */
	_rotation: 0,

	/**
	 * Applies a rotation.
	 *
	 * @method rotate
	 * @param
	 */
	rotate: function(deg)
	{
		var rotate = "rotate(" + deg + "deg)";
		this._rotation = deg;
		this._updateTransform("rotate", /rotate\(.*\)/, rotate);
	},

	/**
	 * An array of x, y values which indicates the transformOrigin in which to rotate the shape. Valid values range between 0 and 1 representing a 
	 * fraction of the shape's corresponding bounding box dimension. The default value is [0.5, 0.5].
	 *
	 * @attribute transformOrigin
	 * @type Array
	 */
	_transformOrigin: function(x, y)
	{
		var node = this.get("node");
		node.style.MozTransformOrigin = (100 * x) + "% " + (100 * y) + "%";
	},

	/**
	 * Applies a scale transform
	 *
	 * @method scale
	 * @param {Number} val
	 */
	scale: function(val)
	{
	},

	/**
	 * Applies a matrix transformation
	 *
	 * @method matrix
	 */
	matrix: function(a, b, c, d, e, f)
	{
	},

	/**
	 * @private
	 */
	_updateTransform: function(type, test, val)
	{
		var node = this.get("node"),
			transform = node.style.MozTransform || node.style.webkitTransform || node.style.msTransform || node.style.OTransform,
			transformOrigin = this.get("transformOrigin");
		if(transform && transform.length > 0)
		{
			if(transform.indexOf(type) > -1)
			{
				transform = transform.replace(test, val);
			}
			else
			{
				transform += " " + val;
			}
		}
		else
		{
			transform = val;
		}
		transformOrigin = (100 * transformOrigin[0]) + "% " + (100 * transformOrigin[1]) + "%";
		node.style.MozTransformOrigin = transformOrigin; 
		node.style.webkitTransformOrigin = transformOrigin;
		node.style.msTransformOrigin = transformOrigin;
		node.style.OTransformOrigin = transformOrigin;
		node.style.MozTransform = transform;
		node.style.webkitTransform = transform;
		node.style.msTransform = transform;
		node.style.OTransform = transform;
		this._graphic.addToRedrawQueue(this);    
	},

	/**
	 * @private
	 */
	_updateHandler: function()
	{
		this._draw();
		this._graphic.addToRedrawQueue(this);    
	},
	
	/**
	 * @private
	 */
	_draw: function()
	{
        this.clear();
		this._paint();
	},

	/**
	 * Completes a shape or drawing
	 *
	 * @method _paint
	 * @private
	 */
	_paint: function()
	{
		if(!this._methods)
		{
			return;
		}
		var node = this.get("node"),
			w = this._right - this._left,
			h = this._bottom - this._top,
			context = this._context,
			methods = [],
			cachedMethods = this._methods.concat(),
			i = 0,
			j,
			method,
			args,
            argsLen,
			len = 0;
		this._context.clearRect(0, 0, node.width, node.height);
	   if(this._methods)
	   {
			len = cachedMethods.length;
			if(!len || len < 1)
			{
				return;
			}
			for(; i < len; ++i)
			{
				methods[i] = cachedMethods[i].concat();
				args = methods[i];
                argsLen = args[0] == "quadraticCurveTo" ? args.length : 3;
				for(j = 1; j < argsLen; ++j)
				{
					if(j % 2 === 0)
					{
						args[j] = args[j] - this._top;
					}
					else
					{
						args[j] = args[j] - this._left;
					}
				}
			}
            node.setAttribute("width", w);
			node.setAttribute("height", h);
			context.beginPath();
			for(i = 0; i < len; ++i)
			{
				args = methods[i].concat();
				if(args && args.length > 0)
				{
					method = args.shift();
					if(method)
					{
						if(method && method == "lineTo" && this._dashstyle)
						{
							args.unshift(this._xcoords[i] - this._left, this._ycoords[i] - this._top);
							this._drawDashedLine.apply(this, args);
						}
						else
						{
                            context[method].apply(context, args); 
						}
					}
				}
			}


			if (this._fillType) 
			{
				if(this._fillType == "linear")
				{
					context.fillStyle = this._getLinearGradient();
				}
				else if(this._fillType == "radial")
				{
					context.fillStyle = this._getRadialGradient();
				}
				else
				{
					context.fillStyle = this._fillColor;
				}
				context.closePath();
				context.fill();
			}

			if (this._stroke) {
				if(this._strokeWeight)
				{
					context.lineWidth = this._strokeWeight;
				}
				context.lineCap = this._linecap;
				context.lineJoin = this._linejoin;
				if(this._miterlimit)
				{
					context.miterLimit = this._miterlimit;
				}
				context.strokeStyle = this._strokeStyle;
				context.stroke();
			}
			this._drawingComplete = true;
			this._clearAndUpdateCoords();
			this._updateNodePosition();
			this._methods = cachedMethods;
		}
	},

	/**
	 * Draws a dashed line between two points.
	 * 
	 * @method _drawDashedLine
	 * @param {Number} xStart	The x position of the start of the line
	 * @param {Number} yStart	The y position of the start of the line
	 * @param {Number} xEnd		The x position of the end of the line
	 * @param {Number} yEnd		The y position of the end of the line
	 * @private
	 */
	_drawDashedLine: function(xStart, yStart, xEnd, yEnd)
	{
		var context = this._context,
			dashsize = this._dashstyle[0],
			gapsize = this._dashstyle[1],
			segmentLength = dashsize + gapsize,
			xDelta = xEnd - xStart,
			yDelta = yEnd - yStart,
			delta = Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta, 2)),
			segmentCount = Math.floor(Math.abs(delta / segmentLength)),
			radians = Math.atan2(yDelta, xDelta),
			xCurrent = xStart,
			yCurrent = yStart,
			i;
		xDelta = Math.cos(radians) * segmentLength;
		yDelta = Math.sin(radians) * segmentLength;
		
		for(i = 0; i < segmentCount; ++i)
		{
			context.moveTo(xCurrent, yCurrent);
			context.lineTo(xCurrent + Math.cos(radians) * dashsize, yCurrent + Math.sin(radians) * dashsize);
			xCurrent += xDelta;
			yCurrent += yDelta;
		}
		
		context.moveTo(xCurrent, yCurrent);
		delta = Math.sqrt((xEnd - xCurrent) * (xEnd - xCurrent) + (yEnd - yCurrent) * (yEnd - yCurrent));
		
		if(delta > dashsize)
		{
			context.lineTo(xCurrent + Math.cos(radians) * dashsize, yCurrent + Math.sin(radians) * dashsize);
		}
		else if(delta > 0)
		{
			context.lineTo(xCurrent + Math.cos(radians) * delta, yCurrent + Math.sin(radians) * delta);
		}
		
		context.moveTo(xEnd, yEnd);
	},

	/**
	 * Clears the graphics object.
	 *
	 * @method clear
	 */
	clear: function() {
		this._initProps();
        if(this.node) 
        {
            this._context.clearRect(0, 0, this.node.width, this.node.height);
        }
        return this;
	},
	
    /**
	 * Returns the bounds for a shape.
	 *
	 * @method getBounds
	 * @return Object
	 */
	getBounds: function()
	{
		var rotation = this.get("rotation"),
			radCon = Math.PI/180,
			sinRadians = parseFloat(parseFloat(Math.sin(rotation * radCon)).toFixed(8)),
			cosRadians = parseFloat(parseFloat(Math.cos(rotation * radCon)).toFixed(8)),
			w = this.get("width"),
			h = this.get("height"),
			stroke = this.get("stroke"),
			x = this.get("x"),
			y = this.get("y"),
            right = x + w,
            bottom = y + h,
            tlx,
            tly,
            blx,
            bly,
            brx,
            bry,
            trx,
            trY,
            wt = 0,
			tx = this.get("translateX"),
			ty = this.get("translateY"),
			bounds = {},
			transformOrigin = this.get("transformOrigin"),
			tox = transformOrigin[0],
			toy = transformOrigin[1];
		if(stroke && stroke.weight)
		{
			wt = stroke.weight;
		}
		if(rotation !== 0)
		{
            tox = x + (tox * w);
            toy = y + (toy * h);
            tlx = this._getRotatedCornerX(x, y, tox, toy, cosRadians, sinRadians); 
            tly = this._getRotatedCornerY(x, y, tox, toy, cosRadians, sinRadians); 
            blx = this._getRotatedCornerX(x, bottom, tox, toy, cosRadians, sinRadians); 
            bly = this._getRotatedCornerY(x, bottom, tox, toy, cosRadians, sinRadians);
            brx = this._getRotatedCornerX(right, bottom, tox, toy, cosRadians, sinRadians);
            bry = this._getRotatedCornerY(right, bottom, tox, toy, cosRadians, sinRadians);
            trx = this._getRotatedCornerX(right, y, tox, toy, cosRadians, sinRadians);
            trY = this._getRotatedCornerY(right, y, tox, toy, cosRadians, sinRadians);
            bounds.left = Math.min(tlx, Math.min(blx, Math.min(brx, trx)));
            bounds.right = Math.max(tlx, Math.max(blx, Math.max(brx, trx)));
            bounds.top = Math.min(tly, Math.min(bly, Math.min(bry, trY)));
            bounds.bottom = Math.max(tly, Math.max(bly, Math.max(bry, trY)));
		}
        else
        {
            bounds.left = x - wt + tx;
            bounds.top = y - wt + ty;
            bounds.right = x + w + wt + tx;
            bounds.bottom = y + h + wt + ty;
        }
		return bounds;
	},

    /**
     * Returns the x coordinate for a bounding box's corner based on the corner's original x/y coordinates, rotation and transform origin of the rotation.
     *
     * @method _getRotatedCornerX
     * @param {Number} x original x-coordinate of corner
     * @param {Number} y original y-coordinate of corner
     * @param {Number} tox transform origin x-coordinate of rotation
     * @param {Number} toy transform origin y-coordinate of rotation
     * @param {Number} cosRadians cosine (in radians) of rotation
     * @param {Number} sinRadians sin (in radians) or rotation
     * @return Number
     * @private
     */
    _getRotatedCornerX: function(x, y, tox, toy, cosRadians, sinRadians)
    {
        return (tox + (x - tox) * cosRadians + (y - toy) * sinRadians);
    },

    /**
     * Returns the y coordinate for a bounding box's corner based on the corner's original x/y coordinates, rotation and transform origin of the rotation.
     *
     * @method _getRotatedCornerY
     * @param {Number} x original x-coordinate of corner
     * @param {Number} y original y-coordinate of corner
     * @param {Number} tox transform origin x-coordinate of rotation
     * @param {Number} toy transform origin y-coordinate of rotation
     * @param {Number} cosRadians cosine (in radians) of rotation
     * @param {Number} sinRadians sin (in radians) or rotation
     * @return Number
     * @private
     */
    _getRotatedCornerY: function(x, y, tox, toy, cosRadians, sinRadians)
    {
        return (toy - (x - tox) * sinRadians + (y - toy) * cosRadians);
    },

    destroy: function()
    {
        var node = this.node,
            context = this._context;
        if(node)
        {
            if(context)
            {
                context.clearRect(0, 0, node.width, node.height);
            }
            if(this._graphic && this._graphic._node)
            {
                this._graphic._node.removeChild(this.node);
            }
        }
	}
}));

CanvasShape.ATTRS =  {
	/**
	 * An array of x, y values which indicates the transformOrigin in which to rotate the shape. Valid values range between 0 and 1 representing a 
	 * fraction of the shape's corresponding bounding box dimension. The default value is [0.5, 0.5].
	 *
	 * @attribute transformOrigin
	 * @type Array
	 */
	transformOrigin: {
		valueFn: function()
		{
			return [0.5, 0.5];
		}
	},

	/**
	 * The rotation (in degrees) of the shape.
	 *
	 * @attribute rotation
	 * @type Number
	 */
	rotation: {
		setter: function(val)
		{
			this.rotate(val);
		},

		getter: function()
		{
			return this._rotation;
		}
	},

	/**
	 * Performs a translate on the x-coordinate. When translating x and y coordinates,
	 * use the <code>translate</code> method.
	 *
	 * @attribute translateX
	 * @type Number
	 */
	translateX: {
		getter: function()
		{
			return this._translateX;
		},

		setter: function(val)
		{
			this._translateX = val;
			this._translate(val, this._translateY);
			return val;
		}
	},
	
	/**
	 * Performs a translate on the y-coordinate. When translating x and y coordinates,
	 * use the <code>translate</code> method.
	 *
	 * @attribute translateX
	 * @type Number
	 */
	translateY: {
		getter: function()
		{
			return this._translateY;
		},

		setter: function(val)
		{
			this._translateY = val;
			this._translate(this._translateX, val);
			return val;
		}
	},

	/**
	 * Dom node of the shape
	 *
	 * @attribute node
	 * @type HTMLElement
	 * @readOnly
	 */
	node: {
		readOnly: true,

		getter: function()
		{
			return this.node;
		}
	},

	/**
	 * Unique id for class instance.
	 *
	 * @attribute id
	 * @type String
	 */
	id: {
		valueFn: function()
		{
			return Y.guid();
		},

		setter: function(val)
		{
			var node = this.node;
			if(node)
			{
				node.setAttribute("id", val);
			}
			return val;
		}
	},

	/**
	 * Indicates the width of the shape
	 *
	 * @attribute width
	 * @type Number
	 */
	width: {
        value: 0
    },

	/**
	 * Indicates the height of the shape
	 *
	 * @attribute height
	 * @type Number
	 */
	height: {
        value: 0
    },

	/**
	 * Indicates the x position of shape.
	 *
	 * @attribute x
	 * @type Number
	 */
	x: {
		value: 0
	},

	/**
	 * Indicates the y position of shape.
	 *
	 * @attribute y
	 * @type Number
	 */
	y: {
		value: 0
	},

	/**
	 * Indicates whether the shape is visible.
	 *
	 * @attribute visible
	 * @type Boolean
	 */
	visible: {
		value: true,

		setter: function(val){
			var visibility = val ? "visible" : "hidden";
			this.get("node").style.visibility = visibility;
			return val;
		}
	},

	/**
	 * Contains information about the fill of the shape. 
	 *  <dl>
	 *      <dt>color</dt><dd>The color of the fill.</dd>
	 *      <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the fill. The default value is 1.</dd>
	 *      <dt>type</dt><dd>Type of fill.
	 *          <dl>
	 *              <dt>solid</dt><dd>Solid single color fill. (default)</dd>
	 *              <dt>linear</dt><dd>Linear gradient fill.</dd>
	 *              <dt>radial</dt><dd>Radial gradient fill.</dd>
	 *          </dl>
	 *      </dd>
	 *  </dl>
	 *
	 *  <p>If a gradient (linear or radial) is specified as the fill type. The following properties are used:
	 *  <dl>
	 *      <dt>stops</dt><dd>An array of objects containing the following properties:
	 *          <dl>
	 *              <dt>color</dt><dd>The color of the stop.</dd>
	 *              <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the stop. The default value is 1. Note: No effect for IE <= 8</dd>
	 *              <dt>offset</dt><dd>Number between 0 and 1 indicating where the color stop is positioned.</dd> 
	 *          </dl>
	 *      </dd>
	 *      <dt></dt><dd></dd>
	 *      <dt></dt><dd></dd>
	 *      <dt></dt><dd></dd>
	 *  </dl>
	 *  </p>
	 *
	 * @attribute fill
	 * @type Object 
	 */
	fill: {
		valueFn: "_getDefaultFill",
		
		setter: function(val)
		{
			var fill,
				tmpl = this.get("fill") || this._getDefaultFill();
			fill = (val) ? Y.merge(tmpl, val) : null;
			if(fill && fill.color)
			{
				if(fill.color === undefined || fill.color == "none")
				{
					fill.color = null;
				}
			}
			this._setFillProps(fill);
			return fill;
		}
	},

	/**
	 * Contains information about the stroke of the shape.
	 *  <dl>
	 *      <dt>color</dt><dd>The color of the stroke.</dd>
	 *      <dt>weight</dt><dd>Number that indicates the width of the stroke.</dd>
	 *      <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the stroke. The default value is 1.</dd>
	 *      <dt>dashstyle</dt>Indicates whether to draw a dashed stroke. When set to "none", a solid stroke is drawn. When set to an array, the first index indicates the
	 *      length of the dash. The second index indicates the length of gap.
	 *  </dl>
	 *
	 * @attribute stroke
	 * @type Object
	 */
	stroke: {
		valueFn: "_getDefaultStroke",

		setter: function(val)
		{
			var tmpl = this.get("stroke") || this._getDefaultStroke();
			val = (val) ? Y.merge(tmpl, val) : null;
			this._setStrokeProps(val);
			return val;
		}
	},
	
	/**
	 * Indicates whether or not the instance will size itself based on its contents.
	 *
	 * @attribute autoSize 
	 * @type Boolean
	 */
	autoSize: {
		value: false
	},

	/**
	 * Determines whether the instance will receive mouse events.
	 * 
	 * @attribute pointerEvents
	 * @type string
	 */
	pointerEvents: {
		value: "visiblePainted"
	},

	/**
	 * Reference to the container Graphic.
	 *
	 * @attribute graphic
	 * @type Graphic
	 */
	graphic: {
		readOnly: true,

		getter: function()
		{
			return this._graphic;
		}
	}
};
Y.CanvasShape = CanvasShape;
