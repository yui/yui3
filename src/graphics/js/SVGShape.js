/**
 * <a href="http://www.w3.org/TR/SVG/">SVG</a> implementation of the <a href="Shape.html">`Shape`</a> class. 
 * `SVGShape` is not intended to be used directly. Instead, use the <a href="Shape.html">`Shape`</a> class. 
 * If the browser has <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities, the <a href="Shape.html">`Shape`</a> 
 * class will point to the `SVGShape` class.
 *
 * @module graphics
 * @class SVGShape
 * @constructor
 * @param {Object} cfg (optional) Attribute configs
 */
SVGShape = function(cfg)
{
    this._transforms = [];
    this.matrix = new Y.Matrix();
    this._normalizedMatrix = new Y.Matrix();
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
	 * @method initializer
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
        if(!this.get("visible"))
        {
            Y.one(node).setStyle("visibility", "hidden");
        }
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
		if(Y.Node.DOM_EVENTS[type])
		{
			return Y.one("#" +  this.get("id")).on(type, fn);
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
            newStop,
			isNumber = Y_LANG.isNumber,
			graphic = this._graphic,
			type = fill.type, 
			gradientNode = graphic.getGradientNode("grad" + this.get("id"), type),
			stops = fill.stops,
			w = this.get("width"),
			h = this.get("height"),
			rotation = fill.rotation,
			radCon = Math.PI/180,
            tanRadians = parseFloat(parseFloat(Math.tan(rotation * radCon)).toFixed(8)),
            i,
			len,
			def,
			stop,
			x1 = "0%", 
			x2 = "100%", 
			y1 = "0%", 
			y2 = "0%",
			cx = fill.cx,
			cy = fill.cy,
			fx = fill.fx,
			fy = fill.fy,
			r = fill.r,
            stopNodes = [];
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
            if(this._stops && this._stops.length > 0)
            {
                stopNode = this._stops.shift();
                newStop = false;
            }
            else
            {
			    stopNode = graphic._createGraphicNode("stop");
                newStop = true;
            }
			stop = stops[i];
			opacity = stop.opacity;
			color = stop.color;
			offset = stop.offset || i/(len - 1);
			offset = Math.round(offset * 100) + "%";
			opacity = isNumber(opacity) ? opacity : 1;
			opacity = Math.max(0, Math.min(1, opacity));
			def = (i + 1) / len;
			stopNode.setAttribute("offset", offset);
			stopNode.setAttribute("stop-color", color);
			stopNode.setAttribute("stop-opacity", opacity);
			if(newStop)
            {
                gradientNode.appendChild(stopNode);
            }
            stopNodes.push(stopNode);
		}
        while(this._stops && this._stops.length > 0)
        {
            gradientNode.removeChild(this._stops.shift());
        }
        this._stops = stopNodes;
	},

    _stops: null,

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
	 * Specifies a 2d translation.
	 *
	 * @method translate
	 * @param {Number} x The value to transate on the x-axis.
	 * @param {Number} y The value to translate on the y-axis.
	 */
	translate: function(x, y)
	{
		this._addTransform("translate", arguments);
	},

	/**
	 * Translates the shape along the x-axis. When translating x and y coordinates,
	 * use the `translate` method.
	 *
	 * @method translateX
	 * @param {Number} x The value to translate.
	 */
	translateX: function(x)
    {
        this._addTransform("translateX", arguments);
    },

	/**
	 * Translates the shape along the y-axis. When translating x and y coordinates,
	 * use the `translate` method.
	 *
	 * @method translateY
	 * @param {Number} y The value to translate.
	 */
	translateY: function(y)
    {
        this._addTransform("translateY", arguments);
    },

    /**
     * Skews the shape around the x-axis and y-axis.
     *
     * @method skew
     * @param {Number} x The value to skew on the x-axis.
     * @param {Number} y The value to skew on the y-axis.
     */
    skew: function(x, y)
    {
        this._addTransform("skew", arguments);
    },

	/**
	 * Skews the shape around the x-axis.
	 *
	 * @method skewX
	 * @param {Number} x x-coordinate
	 */
	 skewX: function(x)
	 {
		this._addTransform("skewX", arguments);
	 },

	/**
	 * Skews the shape around the y-axis.
	 *
	 * @method skewY
	 * @param {Number} y y-coordinate
	 */
	 skewY: function(y)
	 {
		this._addTransform("skewY", arguments);
	 },

	/**
	 * Rotates the shape clockwise around it transformOrigin.
	 *
	 * @method rotate
	 * @param {Number} deg The degree of the rotation.
	 */
	 rotate: function(deg)
	 {
		this._addTransform("rotate", arguments);
	 },

	/**
	 * Specifies a 2d scaling operation.
	 *
	 * @method scale
	 * @param {Number} val
	 */
	scale: function(x, y)
	{
		this._addTransform("scale", arguments);
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
        args = Y.Array(args);
        this._transform = Y_LANG.trim(this._transform + " " + type + "(" + args.join(", ") + ")");
        args.unshift(type);
        this._transforms.push(args);
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
		var isPath = this._type == "path",
		    node = this.node,
			key,
			transform,
			transformOrigin,
			x,
			y,
            tx,
            ty,
            matrix = this.matrix,
            normalizedMatrix = this._normalizedMatrix,
            i = 0,
            len = this._transforms.length;

        if(isPath || (this._transforms && this._transforms.length > 0))
		{
            x = this.get("x");
            y = this.get("y");
            transformOrigin = this.get("transformOrigin");
            tx = x + (transformOrigin[0] * this.get("width"));
            ty = y + (transformOrigin[1] * this.get("height")); 
            //need to use translate for x/y coords
            if(isPath)
            {
                //adjust origin for custom shapes 
                if(!(this instanceof Y.SVGPath))
                {
                    tx = this._left + (transformOrigin[0] * this.get("width"));
                    ty = this._top + (transformOrigin[1] * this.get("height"));
                }
                normalizedMatrix.init({dx: x + this._left, dy: y + this._top});
            }
            normalizedMatrix.translate(tx, ty);
            for(; i < len; ++i)
            {
                key = this._transforms[i].shift();
                if(key)
                {
                    normalizedMatrix[key].apply(normalizedMatrix, this._transforms[i]);
                    matrix[key].apply(matrix, this._transforms[i]); 
                }
                if(isPath)
                {
                    this._transforms[i].unshift(key);
                }
			}
            normalizedMatrix.translate(-tx, -ty);
            transform = "matrix(" + normalizedMatrix.a + "," + 
                            normalizedMatrix.b + "," + 
                            normalizedMatrix.c + "," + 
                            normalizedMatrix.d + "," + 
                            normalizedMatrix.dx + "," +
                            normalizedMatrix.dy + ")";
		}
        this._graphic.addToRedrawQueue(this);    
        if(transform)
		{
            node.setAttribute("transform", transform);
        }
        if(!isPath)
        {
            this._transforms = [];
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
     * Storage for the transform attribute.
     *
     * @property _transform
     * @type String
     * @private
     */
    _transform: "",

	/**
	 * Returns the bounds for a shape.
	 *
     * Calculates the a new bounding box from the original corner coordinates (base on size and position) and the transform matrix.
     * The calculated bounding box is used by the graphic instance to calculate its viewBox. 
     *
	 * @method getBounds
	 * @return Object
	 */
	getBounds: function()
	{
		var type = this._type,
            stroke = this.get("stroke"),
			w = this.get("width"),
			h = this.get("height"),
			x = type == "path" ? 0 : this.get("x"),
			y = type == "path" ? 0 : this.get("y"),
            wt = 0;
        if(stroke && stroke.weight)
		{
			wt = stroke.weight;
		}
        w = (x + w + wt) - (x - wt); 
        h = (y + h + wt) - (y - wt);
        x -= wt;
        y -= wt;
		return this._normalizedMatrix.getContentRect(w, h, x, y);
	},

    /**
     * Destroys the shape instance.
     *
     * @method destroy
     */
    destroy: function()
    {
        var graphic = this.get("graphic");
        if(graphic)
        {
            graphic.removeShape(this);
        }
        else
        {
            this._destroy();
        }
    },

    /**
     *  Implementation for shape destruction
     *
     *  @method destroy
     *  @protected
     */
    _destroy: function()
    {
        if(this.node)
        {
            Y.Event.purgeElement(this.node, true);
            if(this.node.parentNode)
            {
                this.node.parentNode.removeChild(this.node);
            }
            this.node = null;
        }
    }
 }, Y.SVGDrawing.prototype));
	
SVGShape.ATTRS = {
	/**
	 * An array of x, y values which indicates the transformOrigin in which to rotate the shape. Valid values range between 0 and 1 representing a 
	 * fraction of the shape's corresponding bounding box dimension. The default value is [0.5, 0.5].
	 *
	 * @config transformOrigin
	 * @type Array
	 */
	transformOrigin: {
		valueFn: function()
		{
			return [0.5, 0.5];
		}
	},
	
    /**
     * <p>A string containing, in order, transform operations applied to the shape instance. The `transform` string can contain the following values:
     *     
     *    <dl>
     *        <dt>rotate</dt><dd>Rotates the shape clockwise around it transformOrigin.</dd>
     *        <dt>translate</dt><dd>Specifies a 2d translation.</dd>
     *        <dt>skew</dt><dd>Skews the shape around the x-axis and y-axis.</dd>
     *        <dt>scale</dt><dd>Specifies a 2d scaling operation.</dd>
     *        <dt>translateX</dt><dd>Translates the shape along the x-axis.</dd>
     *        <dt>translateY</dt><dd>Translates the shape along the y-axis.</dd>
     *        <dt>skewX</dt><dd>Skews the shape around the x-axis.</dd>
     *        <dt>skewY</dt><dd>Skews the shape around the y-axis.</dd>
     *        <dt>matrix</dt><dd>Specifies a 2D transformation matrix comprised of the specified six values.</dd>      
     *    </dl>
     * </p>
     * <p>Applying transforms through the transform attribute will reset the transform matrix and apply a new transform. The shape class also contains corresponding methods for each transform
     * that will apply the transform to the current matrix. The below code illustrates how you might use the `transform` attribute to instantiate a recangle with a rotation of 45 degrees.</p>
            var myRect = new Y.Rect({
                type:"rect",
                width: 50,
                height: 40,
                transform: "rotate(45)"
            };
     * <p>The code below would apply `translate` and `rotate` to an existing shape.</p>
    
        myRect.set("transform", "translate(40, 50) rotate(45)");
	 * @config transform
     * @type String  
	 */
	transform: {
		setter: function(val)
        {
            this.matrix.init();	
            this._normalizedMatrix.init();
		    this._transforms = this.matrix.getTransformArray(val);
            this._transform = val;
            if(this.initialized)
            {
                this._updateTransform();
            }
            return val;
		},

        getter: function()
        {
            return this._transform;
        }
	},

	/**
	 * Unique id for class instance.
	 *
	 * @config id
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
	 * @config x
	 * @type Number
	 */
	x: {
		value: 0
	},

	/**
	 * Indicates the y position of shape.
	 *
	 * @config y
	 * @type Number
	 */
	y: {
		value: 0
	},

	/**
	 * Indicates the width of the shape
	 *
	 * @config width
	 * @type Number
	 */
	width: {
        value: 0
    },

	/**
	 * Indicates the height of the shape
	 * 
	 * @config height
	 * @type Number
	 */
	height: {
        value: 0
    },

	/**
	 * Indicates whether the shape is visible.
	 *
	 * @config visible
	 * @type Boolean
	 */
	visible: {
		value: true,

		setter: function(val){
			var visibility = val ? "visible" : "hidden";
			if(this.node)
            {
                this.node.style.visibility = visibility;
            }
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
     *  <p>If a `linear` or `radial` is specified as the fill type. The following additional property is used:
     *  <dl>
     *      <dt>stops</dt><dd>An array of objects containing the following properties:
     *          <dl>
     *              <dt>color</dt><dd>The color of the stop.</dd>
     *              <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the stop. The default value is 1. Note: No effect for IE 6 - 8</dd>
     *              <dt>offset</dt><dd>Number between 0 and 1 indicating where the color stop is positioned.</dd> 
     *          </dl>
     *      </dd>
     *      <p>Linear gradients also have the following property:</p>
     *      <dt>rotation</dt><dd>Linear gradients flow left to right by default. The rotation property allows you to change the flow by rotation. (e.g. A rotation of 180 would make the gradient pain from right to left.)</dd>
     *      <p>Radial gradients have the following additional properties:</p>
     *      <dt>r</dt><dd>Radius of the gradient circle.</dd>
     *      <dt>fx</dt><dd>Focal point x-coordinate of the gradient.</dd>
     *      <dt>fy</dt><dd>Focal point y-coordinate of the gradient.</dd>
     *      <dt>cx</dt><dd>
     *          <p>The x-coordinate of the center of the gradient circle. Determines where the color stop begins. The default value 0.5.</p>
     *          <p><strong>Note: </strong>Currently, this property is not implemented for corresponding `CanvasShape` and `VMLShape` classes which are used on Android or IE 6 - 8.</p>
     *      </dd>
     *      <dt>cy</dt><dd>
     *          <p>The y-coordinate of the center of the gradient circle. Determines where the color stop begins. The default value 0.5.</p>
     *          <p><strong>Note: </strong>Currently, this property is not implemented for corresponding `CanvasShape` and `VMLShape` classes which are used on Android or IE 6 - 8.</p>
     *      </dd>
     *  </dl>
	 *
	 * @config fill
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
     *  length of the dash. The second index indicates the length of gap.
     *      <dt>linecap</dt><dd>Specifies the linecap for the stroke. The following values can be specified:
     *          <dl>
     *              <dt>butt (default)</dt><dd>Specifies a butt linecap.</dd>
     *              <dt>square</dt><dd>Specifies a sqare linecap.</dd>
     *              <dt>round</dt><dd>Specifies a round linecap.</dd>
     *          </dl>
     *      </dd>
     *      <dt>linejoin</dt><dd>Specifies a linejoin for the stroke. The following values can be specified:
     *          <dl>
     *              <dt>round (default)</dt><dd>Specifies that the linejoin will be round.</dd>
     *              <dt>bevel</dt><dd>Specifies a bevel for the linejoin.</dd>
     *              <dt>miter limit</dt><dd>An integer specifying the miter limit of a miter linejoin. If you want to specify a linejoin of miter, you simply specify the limit as opposed to having
     *  separate miter and miter limit values.</dd>
     *          </dl>
     *      </dd>
     *  </dl>
	 *
	 * @config stroke
	 * @type Object
	 */
	stroke: {
		valueFn: "_getDefaultStroke",

		setter: function(val)
		{
			var tmpl = this.get("stroke") || this._getDefaultStroke(),
                wt;
            if(val && val.hasOwnProperty("weight"))
            {
                wt = parseInt(val.weight, 10);
                if(!isNaN(wt))
                {
                    val.weight = wt;
                }
            }
            return (val) ? Y.merge(tmpl, val) : null;
		}
	},
	
	//Not used. Remove in future.
    autoSize: {
		value: false
	},

	// Only implemented in SVG
	// Determines whether the instance will receive mouse events.
	// 
	// @config pointerEvents
	// @type string
	//
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
	 * The node used for gradient fills.
	 *
	 * @config gradientNode
	 * @type HTMLElement
     * @private
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

	//Not used. Remove in future.
    autoDraw: {
		getter: function()
		{
			return this._graphic.autoDraw;
		}
	},

	/**
	 * Dom node for the shape.
	 *
	 * @config node
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
	 * @config graphic
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

