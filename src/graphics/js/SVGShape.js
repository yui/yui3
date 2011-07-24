/**
 * Base class for creating shapes.
 *
 * @module graphics
 * @class SVGShape
 * @constructor
 * @param {Object} cfg (optional) Attribute configs
 */
SVGShape = function(cfg)
{
    SVGShape.superclass.constructor.apply(this, arguments);
};

SVGShape.NAME = "svgShape";

Y.extend(SVGShape, Y.BaseGraphic, Y.mix({
    /**
     * Init method, invoked during construction.
     * Calls `initializer` method.
     *
     * @method init
     * @protected
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
		host.createNode(); 
		host._graphic = cfg.graphic;
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
		var node = this.node;
		node.className.baseVal = Y_LANG.trim([node.className.baseVal, className].join(' '));
	},

	/**
	 * Removes a class name from each node.
	 *
	 * @method removeClass
	 * @param {String} className the class name to remove from the node's class attribute
	 */
	removeClass: function(className)
	{
		var node = this.node,
			classString = node.className.baseVal;
		classString = classString.replace(new RegExp(className + ' '), className).replace(new RegExp(className), '');
		node.className.baseVal = classString;
	},

	/**
	 * Gets the current position of the node in page coordinates.
	 *
	 * @method getXY
	 * @return Array The XY position of the shape.
	 */
	getXY: function()
	{
		var graphic = this._graphic,
			parentXY = graphic.getXY(),
			x = this.get("x"),
			y = this.get("y");
		return [parentXY[0] + x, parentXY[1] + y];
	},

	/**
	 * Set the position of the shape in page coordinates, regardless of how the node is positioned.
	 *
	 * @method setXY
	 * @param {Array} Contains x & y values for new position (coordinates are page-based)
	 */
	setXY: function(xy)
	{
		var graphic = this._graphic,
			parentXY = graphic.getXY();
		this.set("x", xy[0] - parentXY[0]);
		this.set("y", xy[1] - parentXY[1]);
	},

	/**
	 * Determines whether the node is an ancestor of another HTML element in the DOM hierarchy. 
	 *
	 * @method contains
	 * @param {SVGShape | HTMLElement} needle The possible node or descendent
	 * @return Boolean Whether or not this shape is the needle or its ancestor.
	 */
	contains: function(needle)
	{
		return needle === Y.one(this.node);
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
	 * Test if the supplied node matches the supplied selector.
	 *
	 * @method test
	 * @param {String} selector The CSS selector to test against.
	 * @return Boolean Wheter or not the shape matches the selector.
	 */
	test: function(selector)
	{
		return Y.Selector.test(this.node, selector);
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
			opacity: 1,
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
	 * Creates the dom node for the shape.
	 *
     * @method createNode
	 * @return HTMLElement
	 * @private
	 */
	createNode: function()
	{
		var node = DOCUMENT.createElementNS("http://www.w3.org/2000/svg", "svg:" + this._type),
			id = this.get("id"),
			pointerEvents = this.get("pointerEvents");
		this.node = node;
		this.addClass("yui3-" + SHAPE + " yui3-" + this.name);
		if(id)
		{
			node.setAttribute("id", id);
		}
		if(pointerEvents)
		{
			node.setAttribute("pointer-events", pointerEvents);
		}
	},
	
    /**
     * Parses event to determine if it is a dom interaction event.
     *
     * @method isMouseEvent
     * @param {String} type Type of event
     * @return Boolean
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
     * Overrides default `before` method. Checks to see if its a dom interaction event. If so, 
     * return an event attached to the `node` element. If not, return the normal functionality.
     *
     * @method before
     * @param {String} type event type
     * @param {Object} callback function
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
     * Overrides default `on` method. Checks to see if its a dom interaction event. If so, 
     * return an event attached to the `node` element. If not, return the normal functionality.
     *
     * @method on
     * @param {String} type event type
     * @param {Object} callback function
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
     * Overrides default `after` method. Checks to see if its a dom interaction event. If so, 
     * return an event attached to the `node` element. If not, return the normal functionality.
     *
     * @method after
     * @param {String} type event type
     * @param {Object} callback function
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
	_strokeChangeHandler: function(e)
	{
		var node = this.node,
			stroke = this.get("stroke"),
			strokeOpacity,
			dashstyle,
			dash,
			linejoin;
		if(stroke && stroke.weight && stroke.weight > 0)
		{
			linejoin = stroke.linejoin || "round";
			strokeOpacity = parseFloat(stroke.opacity);
			dashstyle = stroke.dashstyle || "none";
			dash = Y_LANG.isArray(dashstyle) ? dashstyle.toString() : dashstyle;
			stroke.color = stroke.color || "#000000";
			stroke.weight = stroke.weight || 1;
			stroke.opacity = Y_LANG.isNumber(strokeOpacity) ? strokeOpacity : 1;
			stroke.linecap = stroke.linecap || "butt";
			node.setAttribute("stroke-dasharray", dash);
			node.setAttribute("stroke", stroke.color);
			node.setAttribute("stroke-linecap", stroke.linecap);
			node.setAttribute("stroke-width",  stroke.weight);
			node.setAttribute("stroke-opacity", stroke.opacity);
			if(linejoin == "round" || linejoin == "bevel")
			{
				node.setAttribute("stroke-linejoin", linejoin);
			}
			else
			{
				linejoin = parseInt(linejoin, 10);
				if(Y_LANG.isNumber(linejoin))
				{
					node.setAttribute("stroke-miterlimit",  Math.max(linejoin, 1));
					node.setAttribute("stroke-linejoin", "miter");
				}
			}
		}
		else
		{
			node.setAttribute("stroke", "none");
		}
	},
	
	/**
	 * Adds a fill to the shape node.
	 *
	 * @method _fillChangeHandler
	 * @private
	 */
	_fillChangeHandler: function(e)
	{
		var node = this.node,
			fill = this.get("fill"),
			fillOpacity,
			type;
		if(fill)
		{
			type = fill.type;
			if(type == "linear" || type == "radial")
			{
				this._setGradientFill(fill);
				node.setAttribute("fill", "url(#grad" + this.get("id") + ")");
			}
			else if(!fill.color)
			{
				node.setAttribute("fill", "none");
			}
			else
			{
                fillOpacity = parseFloat(fill.opacity);
				fillOpacity = Y_LANG.isNumber(fillOpacity) ? fillOpacity : 1;
				node.setAttribute("fill", fill.color);
				node.setAttribute("fill-opacity", fillOpacity);
			}
		}
		else
		{
			node.setAttribute("fill", "none");
		}
	},

	/**
	 * Creates a gradient fill
	 *
	 * @method _setGradientFill
	 * @param {String} type gradient type
	 * @private
	 */
	_setGradientFill: function(fill) {
		var offset,
			opacity,
			color,
			stopNode,
			isNumber = Y_LANG.isNumber,
			graphic = this._graphic,
			type = fill.type, 
			gradientNode = graphic.getGradientNode("grad" + this.get("id"), type),
			stops = fill.stops,
			w = this.get("width"),
			h = this.get("height"),
			rotation = fill.rotation,
			radCon = Math.PI/180,
			sinRadians = parseFloat(parseFloat(Math.sin(rotation * radCon)).toFixed(8)),
			cosRadians = parseFloat(parseFloat(Math.cos(rotation * radCon)).toFixed(8)),
            tanRadians = parseFloat(parseFloat(Math.tan(rotation * radCon)).toFixed(8)),
			hyp = Math.sqrt((w * w) + (h * h)),
            tx = (sinRadians * hyp),
            ty = (cosRadians * hyp),
            i,
			len,
			def,
			stop,
            x = this.get("x"),
            y = this.get("y"),
			x1 = "0%", 
			x2 = "100%", 
			y1 = "0%", 
			y2 = "0%",
			cx = fill.cx,
			cy = fill.cy,
			fx = fill.fx,
			fy = fill.fy,
			r = fill.r;
		if(type == "linear")
		{
            cx = w/2;
            cy = h/2;
            if(Math.abs(tanRadians) * w/2 >= h/2)
            {
                if(rotation < 180)
                {
                    y1 = 0;
                    y2 = h;
                }
                else
                {
                    y1 = h;
                    y2 = 0;
                }
                x1 = cx - ((cy - y1)/tanRadians);
                x2 = cx - ((cy - y2)/tanRadians); 
            }
            else
            {
                if(rotation > 90 && rotation < 270)
                {
                    x1 = w;
                    x2 = 0;
                }
                else
                {
                    x1 = 0;
                    x2 = w;
                }
                y1 = ((tanRadians * (cx - x1)) - cy) * -1;
                y2 = ((tanRadians * (cx - x2)) - cy) * -1;
            }
            gradientNode.setAttribute("spreadMethod", "pad");
			gradientNode.setAttribute("width", w);
			gradientNode.setAttribute("height", h);
            gradientNode.setAttribute("x1", Math.round(100 * x1/w) + "%");
            gradientNode.setAttribute("y1", Math.round(100 * y1/h) + "%");
            gradientNode.setAttribute("x2", Math.round(100 * x2/w) + "%");
            gradientNode.setAttribute("y2", Math.round(100 * y2/h) + "%");
		}
		else
		{
			gradientNode.setAttribute("cx", (cx * 100) + "%");
			gradientNode.setAttribute("cy", (cy * 100) + "%");
			gradientNode.setAttribute("fx", (fx * 100) + "%");
			gradientNode.setAttribute("fy", (fy * 100) + "%");
			gradientNode.setAttribute("r", (r * 100) + "%");
		}
		
		len = stops.length;
		def = 0;
		for(i = 0; i < len; ++i)
		{
			stop = stops[i];
			opacity = stop.opacity;
			color = stop.color;
			offset = stop.offset || i/(len - 1);
			offset = Math.round(offset * 100) + "%";
			opacity = isNumber(opacity) ? opacity : 1;
			opacity = Math.max(0, Math.min(1, opacity));
			def = (i + 1) / len;
			stopNode = graphic._createGraphicNode("stop");
			stopNode.setAttribute("offset", offset);
			stopNode.setAttribute("stop-color", color);
			stopNode.setAttribute("stop-opacity", opacity);
			gradientNode.appendChild(stopNode);
		}
	},

    /**
     * Sets the value of an attribute.
     *
     * @method set
     * @param {String|Object} name The name of the attribute. Alternatively, an object of key value pairs can 
     * be passed in to set multiple attributes at once.
     * @param {Any} value The value to set the attribute to. This value is ignored if an object is received as 
     * the name param.
     */
	set: function() 
	{
		var host = this;
		AttributeLite.prototype.set.apply(host, arguments);
		if(host.initialized)
		{
			host._updateHandler();
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
		this._addTransform("translate", arguments);
	},

	/**
	 * Applies a skew to the x-coordinate
	 *
	 * @method skewX
	 * @param {Number} x x-coordinate
	 */
	 skewX: function(x)
	 {
		this._addTransform("skewX", arguments);
	 },

	/**
	 * Applies a skew to the y-coordinate
	 *
	 * @method skewY
	 * @param {Number} y y-coordinate
	 */
	 skewY: function(y)
	 {
		this._addTransform("skewY", arguments);
	 },

	/**
     * Storage for `rotation` atribute.
     *
     * @property _rotation
     * @type Number
	 * @private
	 */
	 _rotation: 0,

	/**
	 * Applies a rotation.
	 *
	 * @method rotate
	 * @param {Number} deg The degree of the rotation.
	 */
	 rotate: function(deg)
	 {
		this._rotation = deg;
		this._addTransform("rotate", arguments);
	 },

	/**
	 * Applies a scale transform
	 *
	 * @method scale
	 * @param {Number} val
	 */
	scale: function(val)
	{
		this._addTransform("scale", arguments);
	},

	/**
	 * Applies a matrix transformation
	 *
	 * @method matrix
     * @param {Number} a
     * @param {Number} b
     * @param {Number} c
     * @param {Number} d
     * @param {Number} e
     * @param {Number} f
	 */
	matrix: function(a, b, c, d, e, f)
	{
		this._addTransform("matrix", arguments);
	},

    /**
     * Adds a transform to the shape.
     *
     * @method _addTransform
     * @param {String} type The transform being applied.
     * @param {Array} args The arguments for the transform.
	 * @private
	 */
	_addTransform: function(type, args)
	{
		if(!this._transformArgs)
		{
			this._transformArgs = {};
		}
		this._transformArgs[type] = Array.prototype.slice.call(args, 0);
		if(this.initialized)
        {
            this._updateTransform();
        }
	},

	/**
     * Applies all transforms.
     *
     * @method _updateTransform
	 * @private
	 */
	_updateTransform: function()
	{
		var node = this.node,
			key,
			args,
			val,
			transform = node.getAttribute("transform"),
			test,
			transformOrigin;
		if(this._transformArgs)
		{
			if(this._transformArgs.hasOwnProperty("rotate"))
			{
				transformOrigin = this.get("transformOrigin");
				args = this._transformArgs.rotate;
				args[1] = this.get("x") + (this.get("width") * transformOrigin[0]);
				args[2] = this.get("y") + (this.get("height") * transformOrigin[1]);
			}
		}
		for(key in this._transformArgs)
		{
			if(key && this._transformArgs.hasOwnProperty(key))
			{
				val = key + "(" + this._transformArgs[key].toString() + ")";
				if(transform && transform.length > 0)
				{
					test = new RegExp(key + '(.*)');
					if(transform.indexOf(key) > -1)
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
			}
		}
        this._graphic.addToRedrawQueue(this);    
		if(transform)
		{
			node.setAttribute("transform", transform);
		}
	},

	/**
	 * Draws the shape.
	 *
	 * @method _draw
	 * @private
	 */
	_draw: function()
	{
		var node = this.node;
		node.setAttribute("width", this.get("width"));
		node.setAttribute("height", this.get("height"));
		node.setAttribute("x", this.get("x"));
		node.setAttribute("y", this.get("y"));
		node.style.left = this.get("x") + "px";
		node.style.top = this.get("y") + "px";
		this._fillChangeHandler();
		this._strokeChangeHandler();
		this._updateTransform();
	},

	/**
     * Updates `Shape` based on attribute changes.
     *
     * @method _updateHandler
	 * @private
	 */
	_updateHandler: function(e)
	{
		this._draw();
	},
	
	/**
	 * Storage for translateX
	 *
     * @property _translateX
     * @type Number
	 * @private
	 */
	_translateX: 0,

	/**
	 * Storage for translateY
	 *
     * @property _translateY
     * @type Number
	 * @private
	 */
	_translateY: 0,

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

    /**
     * Destroys the instance.
     *
     * @method destroy
     */
    destroy: function()
    {
        if(this._graphic && this._graphic._contentNode)
        {
            this._graphic._contentNode.removeChild(this.node);
        }
    }
 }, Y.SVGDrawing.prototype));
	
SVGShape.ATTRS = {
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
	 * Indicates whether the shape is visible.
	 *
	 * @attribute visible
	 * @type Boolean
	 */
	visible: {
		value: true,

		setter: function(val){
			var visibility = val ? "visible" : "hidden";
			this.node.style.visibility = visibility;
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
			return (val) ? Y.merge(tmpl, val) : null;
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
		valueFn: function() 
		{
			var val = "visiblePainted",
				node = this.node;
			if(node)
			{
				node.setAttribute("pointer-events", val);
			}
			return val;
		},

		setter: function(val)
		{
			var node = this.node;
			if(node)
			{
				node.setAttribute("pointer-events", val);
			}
			return val;
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
	 * The node used for gradient fills.
	 *
	 * @attribute gradientNode
	 * @type HTMLElement
	 */
	gradientNode: {
		setter: function(val)
		{
			if(Y_LANG.isString(val))
			{
				val = this._graphic.getGradientNode("linear", val);
			}
			return val;
		}
	},

	/**
	 * Indicates whether to automatically refresh.
	 *  
	 * @attribute autoDraw
	 * @type Boolean
	 * @readOnly
	 */
	autoDraw: {
		getter: function()
		{
			return this._graphic.autoDraw;
		}
	},

	/**
	 * Dom node for the shape.
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
	 * Reference to the parent graphic instance
	 *
	 * @attribute graphic
	 * @type SVGGraphic
	 * @readOnly
	 */
	graphic: {
		readOnly: true,

		getter: function()
		{
			return this._graphic;
		}
	}
};
Y.SVGShape = SVGShape;

