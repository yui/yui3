/**
 * Base class for creating shapes.
 *
 * @class VMLShape
 */
var Y_LANG = Y.Lang,
    IS_NUM = Y_LANG.isNumber,
    IS_ARRAY = Y_LANG.isArray,
    Y_DOM = Y.DOM,
    Y_SELECTOR = Y.Selector,
    AttributeLite = Y.AttributeLite,
    PluginHost = Y.Plugin.Host,
	VMLCircle,
	VMLShape = function(cfg) 
	{
		var host = this,
			PluginHost = Y.Plugin && Y.Plugin.Host;  
		if (host._initPlugins && PluginHost) {
			PluginHost.call(host);
		}
		
		host.name = host.constructor.NAME;
		host._eventPrefix = host.constructor.EVENT_PREFIX || host.constructor.NAME;
		AttributeLite.call(host);
		host.addAttrs(cfg);
		host.init.apply(this, arguments);
		if (host._initPlugins) {
			// Need to initPlugins manually, to handle constructor parsing, static Plug parsing
			host._initPlugins(cfg);
		}
		host.initialized = true;
	};

	VMLShape.NAME = "vmlShape";

	VMLShape.prototype = {
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
			host.createNode(); 
			host._graphic = cfg.graphic;
			//host._updateHandler();
		},

		/**
		 * @private
		 */
		createNode: function()
		{
			var node,
				x = this.get("x"),
				y = this.get("y"),
				w = this.get("width"),
				h = this.get("height"),
				id,
				type,
				nodestring,
				strokestring,
				classString,
				stroke,
				endcap,
				opacity,
				joinstyle,
				miterlimit,
				dashstyle,
				fill,
				fillstring;
				id = this.get("id");
				type = this._type;
				classString = 'vml' + type + ' yui3-vmlShape yui3-' + this.constructor.NAME; 
				stroke = this._getStrokeProps();
				fill = this._getFillProps();
				
				nodestring  = '<' + type + '  xmlns="urn:schemas-microsft.com:vml" id="' + id + '" class="' + classString + '" style="behavior:url(#default#VML);display:inline-block;position:absolute;left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;height:' + h + 'px;"';

				if(stroke)
				{
					endcap = stroke.endcap;
					opacity = stroke.opacity;
					joinstyle = stroke.joinstyle;
					miterlimit = stroke.miterlimit;
					dashstyle = stroke.dashstyle;
					nodestring += ' stroked="t" strokecolor="' + stroke.strokeColor + '" strokeWeight="' + stroke.strokeWeight + 'px"';
					
					strokestring = '<stroke class="vmlstroke" xmlns="urn:schemas-microsft.com:vml" style="behavior:url(#default#VML);display:inline-block;"';
					strokestring += ' opacity="' + opacity + '"';
					if(endcap)
					{
						strokestring += ' endcap="' + endcap + '"';
					}
					if(joinstyle)
					{
						strokestring += ' joinstyle="' + joinstyle + '"';
					}
					if(miterlimit)
					{
						strokestring += ' miterlimit="' + miterlimit + '"';
					}
					if(dashstyle)
					{
						strokestring += ' dashstyle="' + dashstyle + '"';
					}
					strokestring += '></stroke>';
					this._strokeNode = document.createElement(strokestring);
					nodestring += ' stroked="t"';
				}
				else
				{
					nodestring += ' stroked="f"';
				}
				if(fill)
				{
					if(fill.node)
					{
						fillstring = fill.node;
						this._fillNode = document.createElement(fillstring);
					}
					else if(fill.color)
					{
						nodestring += ' fillcolor="' + fill.color + '"';
					}
					nodestring += ' filled="' + fill.filled + '"';
				}
				
				
				nodestring += '>';
				nodestring += '</' + type + '>';
				
				node = document.createElement(nodestring);
				if(this._strokeNode)
				{
					node.appendChild(this._strokeNode);
				}
				if(this._fillNode)
				{
					node.appendChild(this._fillNode);
				}

				this.node = node;
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
			Y_DOM.addClass(node, className);
		},

		/**
		 * Removes a class name from each node.
		 *
		 * @method removeClass
		 * @param {String} className the class name to remove from the node's class attribute
		 */
		removeClass: function(className)
		{
			var node = this.node;
			Y_DOM.removeClass(node, className);
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
		 * @param {Array} Contains X & Y values for new position (coordinates are page-based)
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
		 * @param {VMLShape | HTMLElement} needle The possible node or descendent
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
			return Y_SELECTOR.test(this.node, selector);
		},

		/**
		 * @private
		 */
		 _getStrokeProps: function()
		 {
			var props,
				stroke = this.get("stroke"),
				strokeOpacity,
				dashstyle,
				dash = "",
				val,
				endcap,
				i = 0,
				len,
				linecap,
				linejoin;
			if(stroke && stroke.weight && stroke.weight > 0)
			{
				props = {};
				linecap = stroke.linecap || "flat";
				linejoin = stroke.linejoin || "round";
				if(linecap != "round" && linecap != "square")
				{
					linecap = "flat";
				}
				strokeOpacity = stroke.opacity;
				dashstyle = stroke.dashstyle || "none";
				stroke.color = stroke.color || "#000000";
				stroke.weight = stroke.weight || 1;
				stroke.opacity = IS_NUM(strokeOpacity) ? strokeOpacity : 1;
				props.stroked = true;
				props.strokeColor = stroke.color;
				props.strokeWeight = stroke.weight;
				props.endcap = linecap;
				props.opacity = stroke.opacity;
				if(IS_ARRAY(dashstyle))
				{
					dash = [];
					len = dashstyle.length;
					for(i = 0; i < len; ++i)
					{
						val = dashstyle[i];
						dash[i] = val / stroke.weight;
					}
				}
				if(linejoin == "round" || linejoin == "bevel")
				{
					props.joinstyle = linejoin;
				}
				else
				{
					linejoin = parseInt(linejoin, 10);
					if(IS_NUM(linejoin))
					{
						props.miterlimit = Math.max(linejoin, 1);
						props.joinstyle = "miter";
					}
				}
				props.dashstyle = dash;
			}
			return props;

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
				dash = "",
				val,
				endcap,
				i = 0,
				len,
				linecap,
				linejoin;
			if(stroke && stroke.weight && stroke.weight > 0)
			{
				linecap = stroke.linecap || "flat";
				linejoin = stroke.linejoin || "round";
				if(linecap != "round" && linecap != "square")
				{
					linecap = "flat";
				}
				strokeOpacity = stroke.opacity;
				dashstyle = stroke.dashstyle || "none";
				stroke.color = stroke.color || "#000000";
				stroke.weight = stroke.weight || 1;
				stroke.opacity = IS_NUM(strokeOpacity) ? strokeOpacity : 1;
				node.stroked = true;
				node.strokeColor = stroke.color;
				node.strokeWeight = stroke.weight + "px";
				if(!this._strokeNode)
				{
					this._strokeNode = this._createGraphicNode("stroke");
					node.appendChild(this._strokeNode);
				}
				this._strokeNode.endcap = linecap;
				this._strokeNode.opacity = stroke.opacity;
				if(IS_ARRAY(dashstyle))
				{
					dash = [];
					len = dashstyle.length;
					for(i = 0; i < len; ++i)
					{
						val = dashstyle[i];
						dash[i] = val / stroke.weight;
					}
				}
				if(linejoin == "round" || linejoin == "bevel")
				{
					this._strokeNode.joinstyle = linejoin;
				}
				else
				{
					linejoin = parseInt(linejoin, 10);
					if(IS_NUM(linejoin))
					{
						this._strokeNode.miterlimit = Math.max(linejoin, 1);
						this._strokeNode.joinstyle = "miter";
					}
				}
				this._strokeNode.dashstyle = dash;
			}
			else
			{
				node.stroked = false;
			}
		},

		/**
		 * @private
		 */
		_getFillProps: function()
		{
			var node = this.node,
				fill = this.get("fill"),
				fillOpacity,
				props,
				gradient,
				i,
				fillstring,
				filled = false;
			if(fill)
			{
				props = {};
				
				if(fill.type == "radial" || fill.type == "linear")
				{
					fillOpacity = fill.opacity;
					fillOpacity = IS_NUM(fillOpacity) ? fillOpacity : 1;
					filled = true;
					gradient = this._getGradientFill(fill);
					fillstring = '<fill xmlns="urn:schemas-microsft.com:vml" style="behavior:url(#default#VML);display:inline-block;" opacity="' + fillOpacity + '"';
					for(i in gradient)
					{
						if(gradient.hasOwnProperty(i))
						{
							fillstring += ' ' + i + '="' + gradient[i] + '"';
						}
					}
					fillstring += ' />';
					props.node = fillstring;
				}
				else if(fill.color)
				{
					props.color = fill.color;
					fillOpacity = fill.opacity;
					filled = true;
					if(IS_NUM(fillOpacity))
					{
						fillOpacity = Math.max(Math.min(fillOpacity, 1), 0);
						props.opacity = fillOpacity;    
						props.node = '<fill xmlns="urn:schemas-microsft.com:vml" style="behavior:url(#default#VML);display:inline-block;" opacity="' + fillOpacity + '" color="' + fill.color + '"/>';
					}
				}
				props.filled = filled;
			}
			return props;
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
				fillstring,
				filled = false;
			if(fill)
			{
				if(fill.type == "radial" || fill.type == "linear")
				{
					filled = true;
					this._setGradientFill(node, fill);
				}
				else if(fill.color)
				{
					fillOpacity = fill.opacity;
					filled = true;
					if(IS_NUM(fillOpacity))
					{
						fillOpacity = Math.max(Math.min(fillOpacity, 1), 0);
						fill.opacity = fillOpacity;
						if(this._fillNode && this._fillNode.getAttribute("type") == "solid")
						{
							this._fillNode.type = "solid";
							this._fillNode.opacity = fillOpacity;
							this._fillNode.color = fill.color;
						}
						else
						{       
							if(this._fillNode)
							{
								node.removeChild(this._fillNode);
								this._fillNode = null;
							} 
							fillstring = '<fill xmlns="urn:schemas-microsft.com:vml" class="vmlfill" opacity="' + fillOpacity + '" color="' + fill.color + '"/>';
							this._fillNode = document.createElement(fillstring);
							node.appendChild(this._fillNode);
						}
					}
					else
					{
						if(this._fillNode)
						{   
							node.removeChild(this._fillNode);
							this._fillNode = null;
						}
						node.fillColor = fill.color;
					}
				}
			}
			node.filled = filled;
		},

		/**
		 * @private
		 */
		_updateFillNode: function(node)
		{
			if(!this._fillNode)
			{
				this._fillNode = this._createGraphicNode("fill");
				node.appendChild(this._fillNode);
			}
		},

		_getGradientFill: function(fill)
		{
			var gradientProps = {},
				gradientBoxWidth,
				gradientBoxHeight,
				type = fill.type,
				w = this.get("width"),
				h = this.get("height"),
				isNumber = IS_NUM,
				stop,
				stops = fill.stops,
				len = stops.length,
				opacity,
				color,
				i = 0,
				oi,
				colorstring = "",
				cx = fill.cx,
				cy = fill.cy,
				fx = fill.fx,
				fy = fill.fy,
				r = fill.r,
				pct,
				rotation = fill.rotation || 0;
			if(type === "linear")
			{
				if(rotation > 0 && rotation <= 90)
				{
					rotation = 450 - rotation;
				}
				else if(rotation <= 270)
				{
					rotation = 270 - rotation;
				}
				else if(rotation <= 360)
				{
					rotation = 630 - rotation;
				}
				else
				{
					rotation = 270;
				}
				gradientProps.type = "gradient";//"gradientunscaled";
				gradientProps.angle = rotation;
			}
			else if(type === "radial")
			{
				gradientBoxWidth = w * (r * 2);
				gradientBoxHeight = h * (r * 2);
				fx = r * 2 * (fx - 0.5);
				fy = r * 2 * (fy - 0.5);
				fx += cx;
				fy += cy;
				gradientProps.focussize = (gradientBoxWidth/w)/10 + "% " + (gradientBoxHeight/h)/10 + "%";
				//gradientProps.focusSize = ((r - cx) * 10) + "% " + ((r - cy) * 10) + "%"; 
				gradientProps.alignshape = false;
				gradientProps.type = "gradientradial";
				gradientProps.focus = "100%";
				gradientProps.focusposition = Math.round(fx * 100) + "% " + Math.round(fy * 100) + "%";
			}
			for(;i < len; ++i) {
				stop = stops[i];
				color = stop.color;
				opacity = stop.opacity;
				opacity = isNumber(opacity) ? opacity : 1;
				pct = stop.offset || i/(len-1);
				pct *= (r * 2);
				if(pct <= 1)
				{
					pct = Math.round(100 * pct) + "%";
					oi = i > 0 ? i + 1 : "";
					gradientProps["opacity" + oi] = opacity + "";
					colorstring += ", " + pct + " " + color;
				}
			}
			pct = stops[1].offset || 0;
			pct *= 100;
			if(parseInt(pct, 10) < 100)
			{
				colorstring += ", 100% " + color;
			}
			gradientProps.colors = colorstring.substr(2);
			return gradientProps;
		},

		_setGradientFill: function(node, fill)
		{
			this._updateFillNode(node);
			var gradientBoxWidth,
				gradientBoxHeight,
				type = fill.type,
				w = this.get("width"),
				h = this.get("height"),
				isNumber = IS_NUM,
				stop,
				stops = fill.stops,
				len = stops.length,
				opacity,
				color,
				i = 0,
				oi,
				colorstring = "",
				cx = fill.cx,
				cy = fill.cy,
				fx = fill.fx,
				fy = fill.fy,
				r = fill.r,
				pct,
				fillNode = this._fillNode,
				rotation = fill.rotation || 0;
			if(type === "linear")
			{
				if(rotation > 0 && rotation <= 90)
				{
					rotation = 450 - rotation;
				}
				else if(rotation <= 270)
				{
					rotation = 270 - rotation;
				}
				else if(rotation <= 360)
				{
					rotation = 630 - rotation;
				}
				else
				{
					rotation = 270;
				}
				this._fillNode.type = "gradient";//"gradientunscaled";
				this._fillNode.angle = rotation;
			}
			else if(type === "radial")
			{
				gradientBoxWidth = w * (r * 2);
				gradientBoxHeight = h * (r * 2);
				fx = r * 2 * (fx - 0.5);
				fy = r * 2 * (fy - 0.5);
				fx += cx;
				fy += cy;
				this._fillNode.focussize = (gradientBoxWidth/w)/10 + "% " + (gradientBoxHeight/h)/10 + "%";
				//this._fillNode.focusSize = ((r - cx) * 10) + "% " + ((r - cy) * 10) + "%"; 
				this._fillNode.alignshape = false;
				this._fillNode.type = "gradientradial";
				this._fillNode.focus = "100%";
				this._fillNode.focusposition = Math.round(fx * 100) + "% " + Math.round(fy * 100) + "%";
			}
			for(;i < len; ++i) {
				stop = stops[i];
				color = stop.color;
				opacity = stop.opacity;
				opacity = isNumber(opacity) ? opacity : 1;
				pct = stop.offset || i/(len-1);
				pct *= (r * 2);
				if(pct <= 1)
				{
					pct = Math.round(100 * pct) + "%";
					oi = i > 0 ? i + 1 : "";
					this._fillNode["opacity" + oi] = opacity + "";
					colorstring += ", " + pct + " " + color;
				}
			}
			pct = stops[1].offset || 0;
			pct *= 100;
			if(parseInt(pct, 10) < 100)
			{
				colorstring += ", 100% " + color;
			}
			this._fillNode.colors.value = colorstring.substr(2);
		},

		/**
		 * @private
		 */
		_addTransform: function(type, args)
		{
			if(!this._transformArgs)
			{
				this._transformArgs = {};
			}
			this._transformArgs[type] = Array.prototype.slice.call(args, 0);
			//this.fire("transformAdded");
		},

		/**
		 * @private
		 */
		_updateTransform: function()
		{
			var host = this,
				node = host.node,
				w,
				h,
				x = host.get("x"),
				y = host.get("y"),
				transformOrigin,
				transX,
				transY,
				tx,
				ty,
				originX,
				originY,
				absRot,
				radCon,
				sinRadians,
				cosRadians,
				x2,
				y2,
				coordSize,
				transformArgs = host._transformArgs;
			if(transformArgs)
			{
				w = host.get("width");
				h = host.get("height");
				coordSize = node.coordSize;
				if(transformArgs.hasOwnProperty("translate"))
				{
					transX = 0 - (coordSize.x/w * host._translateX);
					transY = 0 - (coordSize.y/h * host._translateY);
					node.coordOrigin = transX + "," + transY;
				}
				if(transformArgs.hasOwnProperty("rotate"))
				{
					transformOrigin = host.get("transformOrigin");
					tx = transformOrigin[0];
					ty = transformOrigin[1];
					originX = w * (tx - 0.5);
					originY = h * (ty - 0.5);
					absRot = Math.abs(host._rotation);
					radCon = Math.PI/180;
					sinRadians = parseFloat(parseFloat(Math.sin(absRot * radCon)).toFixed(8));
					cosRadians = parseFloat(parseFloat(Math.cos(absRot * radCon)).toFixed(8));
					x2 = (originX * cosRadians) - (originY * sinRadians);
					y2 = (originX * sinRadians) + (originY * cosRadians);
					node.style.rotation = host._rotation;
					x = x + (originX - x2);
					y = y + (originY - y2);
				}
			}
			node.style.left = x + "px";
			node.style.top = y + "px";
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
			this._addTransform("translate", arguments);
		},

		/**
		 * Applies a skew to the x-coordinate
		 *
		 * @method skewX:q
		 * @param {Number} x x-coordinate
		 */
		 skewX: function(x)
		 {
			//var node = this.node;
		 },

		/**
		 * Applies a skew to the x-coordinate
		 *
		 * @method skewX:q
		 * @param {Number} x x-coordinate
		 */
		 skewY: function(y)
		 {
			//var node = this.node;
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
			//var node = this.node;
		},

		/**
		 * Applies a matrix transformation
		 *
		 * @method matrix
		 */
		matrix: function(a, b, c, d, e, f)
		{
			//var node = this.node;
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
		 * @private
		 */
		_draw: function()
		{
			var node = this.node,
				x = this.get("x"),
				y = this.get("y"),
				w = this.get("width"),
				h = this.get("height");
			if(!node)
			{
			   this.createNode(); 
			}
			else
			{
				this._fillChangeHandler();
				this._strokeChangeHandler();
				node.style.width = w + "px";
				node.style.height = h + "px";
			}
			this._updateTransform();
		},

		/**
		 * @private
		 */
		_updateHandler: function(e)
		{
			var node = this.node;
			if(node)
			{
				node.style.visible = "hidden";
			}
			this._draw();
			if(node)
			{
				node.style.visible = "visible";
			}
		},

		/**
		 * Creates a graphic node
		 *
		 * @method _createGraphicNode
		 * @param {String} type node type to create
		 * @param {String} specified pointer-events value
		 * @return HTMLElement
		 * @private
		 */
		_createGraphicNode: function(type)
		{
			type = type || this._type;
			return document.createElement('<' + type + ' xmlns="urn:schemas-microsft.com:vml" class="vml' + type + '"/>');
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
		 * @private
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
		 * Returns the bounds for a shape.
		 *
		 * @method getBounds
		 * @return Object
		 */
		getBounds: function()
		{
			var w = this.get("width"),
				h = this.get("height"),
				stroke = this.get("stroke"),
				x = this.get("x"),
				y = this.get("y"),
				wt = 0,
				bounds = {};
			if(stroke && stroke.weight)
			{
				wt = stroke.weight;
			}
			bounds.left = x - wt;
			bounds.top = y - wt;
			bounds.right = x + w + wt;
			bounds.bottom = y + h + wt;
			return bounds;
		}
	};

	VMLShape.ATTRS = {
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
		 * 
		 * @attribute width
		 */
		width: {
			value: 0
		},

		/**
		 * 
		 * @attribute height
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
				var node = this.node,
					visibility = val ? "visible" : "hidden";
				if(node)
				{
					node.style.visibility = visibility;
				}
				return val;
			}
		},

		/**
		 * Contains information about the fill of the shape. 
		 *  <dl>
		 *      <dt>color</dt><dd>The color of the fill.</dd>
		 *      <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the fill. The default value is 1.</dd>
		 *  </dl>
		 *
		 * @attribute fill
		 * @type Object 
		 */
		fill: {
			valueFn: "_getDefaultFill",
			
			setter: function(val)
			{
				var i,
					fill,
					tmpl = this.get("fill") || this._getDefaultFill();
				
				if(val)
				{
					//ensure, fill type is solid if color is explicitly passed.
					if(val.hasOwnProperty("color"))
					{
						val.type = "solid";
					}
					for(i in val)
					{
						if(val.hasOwnProperty(i))
						{   
							tmpl[i] = val[i];
						}
					}
				}
				fill = tmpl;
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
				var i,
					stroke,
					tmpl = this.get("stroke") || this._getDefaultStroke();
				if(val)
				{
					for(i in val)
					{
						if(val.hasOwnProperty(i))
						{   
							tmpl[i] = val[i];
						}
					}
				}
				stroke = tmpl;
				return stroke;
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
	Y.mix(VMLShape, Y.AttributeLite, false, null, 1);
	Y.mix(VMLShape, Y.EventTarget, false, null, 1);
	Y.mix(VMLShape, PluginHost, false, null, 1);
	VMLShape.plug = PluginHost.plug;
	VMLShape.unplug = PluginHost.unplug;
	Y.VMLShape = VMLShape;
