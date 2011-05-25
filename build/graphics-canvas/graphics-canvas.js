YUI.add('graphics-canvas', function(Y) {

var _dummy;
/**
 * Creates dom element used for converting color string to rgb
 *
 * @method _createDummy
 * @private
 */
function _createDummy() 
{
    if(!_dummy)
    {
        _dummy = Y.config.doc.createElement('div');
    }
    _dummy.style.height = 0;
    _dummy.style.width = 0;
    _dummy.style.overflow = 'hidden';
    Y.config.doc.documentElement.appendChild(_dummy);
    return _dummy;
}


/**
 * Set of drawing apis for canvas based classes.
 *
 * @class CanvasDrawing
 * @constructor
 */
function CanvasDrawing()
{
}

CanvasDrawing.prototype = {
    /**
     * Regex expression used for converting hex strings to rgb
     *
     * @property _reHex
     * @private
     */
    _reHex: /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,

    /**
     * Parses hex color string and alpha value to rgba
     *
     * @method _2RGBA
     * @private
     */
    _2RGBA: function(val, alpha) {
        alpha = (alpha !== undefined) ? alpha : 1;
        if (this._reHex.exec(val)) {
            val = 'rgba(' + [
                parseInt(RegExp.$1, 16),
                parseInt(RegExp.$2, 16),
                parseInt(RegExp.$3, 16)
            ].join(',') + ',' + alpha + ')';
        }
        return val;
    },

    /**
     * Converts color to rgb format
     *
     * @method _2RGB
     * @private 
     */
    _2RGB: function(val) {
        var dummy = _createDummy();
        dummy.style.background = val;
        return dummy.style.backgroundColor;
    },

    /**
     * Sets the size of the graphics object.
     * 
     * @method setSize
     * @param w {Number} width to set for the instance.
     * @param h {Number} height to set for the instance.
     */
	setSize: function(w, h) {
        if(this.get("autoSize"))
        {
            if(w > this.node.getAttribute("width"))
            {
                this.node.style.width = w + "px";
                this.node.setAttribute("width", w);
            }
            if(h > this.node.getAttribute("height"))
            {
                this.node.style.height = h + "px";
                this.node.setAttribute("height", h);
            }
        }
    },

	/**
	 * @private
	 */
    _updatePosition: function(x, y)
    {
        this._updateCoords(x, y);
        if(x <= this._left)
        {
            this._left = x;
        }
        else if(x >= this._right)
        {
            this._right = x;
        }
        if(y <= this._top)
        {
            this._top = y;
        }
        else if(y >= this._bottom)
        {
            this._bottom = y;
        }
        this._width = this._right - this._left;
        this._height = this._bottom - this._top;
    },
    
	/**
	 * @private
	 */
    _updateCoords: function(x, y)
    {
        this._xcoords.push(x);
        this._ycoords.push(y);
    },

	/**
	 * @private
	 */
    _clearAndUpdateCoords: function()
    {
        var x = this._xcoords.pop() || 0,
            y = this._ycoords.pop() || 0;
        this._updateCoords(x, y);
    },

	/**
	 * @private
	 */
    _updateNodePosition: function()
    {
        var node = this.get("node"),
            x = this.get("x"),
            y = this.get("y"); 
        node.style.position = "absolute";
        node.style.left = (x + this._left) + "px";
        node.style.top = (y + this._top) + "px";
    },

    /**
     * Holds queue of methods for the target canvas.
     * 
     * @property _methods
     * @type Object
     * @private
     */
    _methods: null,

    /**
     * Holds queue of properties for the target canvas.
     *
     * @property _properties
     * @type Object
     * @private
     */
    _properties: null,
    
    /**
     * Adds a method to the drawing queue
     */
    _updateDrawingQueue: function(val)
    {
        if(!this._methods)
        {
            this._methods = [];
        }
        this._methods.push(val);
    },
    
    /**
     * Draws a line segment using the current line style from the current drawing position to the specified x and y coordinates.
     * 
     * @method lineTo
     * @param {Number} point1 x-coordinate for the end point.
     * @param {Number} point2 y-coordinate for the end point.
     */
    lineTo: function(point1, point2, etc) {
        var args = arguments, 
            i, len;
        if(!this._lineToMethods)
        {
            this._lineToMethods = [];
        }
        if (typeof point1 === 'string' || typeof point1 === 'number') {
            args = [[point1, point2]];
        }

        for (i = 0, len = args.length; i < len; ++i) {
            this._updateDrawingQueue(["lineTo", args[i][0], args[i][1]]);
            this._lineToMethods[this._lineToMethods.length] = this._methods[this._methods.length - 1];
            this._updateShapeProps.apply(this, args[i]);
            this._updatePosition(args[i][0], args[i][1]);
        }
        this._drawingComplete = false;
        return this;
    },

    /**
     * Moves the current drawing position to specified x and y coordinates.
     *
     * @method moveTo
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     */
    moveTo: function(x, y) {
        this._updateDrawingQueue(["moveTo", x, y]);
        this._updateShapeProps(x, y);
        this._updatePosition(x, y);
        this._drawingComplete = false;
        return this;
    },
    
    /**
     * Draws a bezier curve.
     *
     * @method curveTo
     * @param {Number} cp1x x-coordinate for the first control point.
     * @param {Number} cp1y y-coordinate for the first control point.
     * @param {Number} cp2x x-coordinate for the second control point.
     * @param {Number} cp2y y-coordinate for the second control point.
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     */
    curveTo: function(cp1x, cp1y, cp2x, cp2y, x, y) {
        var hiX,
            hiY,
            loX,
            loY;
        this._updateDrawingQueue(["bezierCurveTo", cp1x, cp1y, cp2x, cp2y, x, y]);
        this._drawingComplete = false;
        this._updateShapeProps(x, y);
        hiX = Math.max(x, Math.max(cp1x, cp2x));
        hiY = Math.max(y, Math.max(cp1y, cp2y));
        loX = Math.min(x, Math.min(cp1x, cp2x));
        loY = Math.min(y, Math.min(cp1y, cp2y));
        this._updatePosition(hiX, hiY);
        this._updatePosition(loX, loY);
        return this;
    },

    /**
     * Draws a quadratic bezier curve.
     *
     * @method quadraticCurveTo
     * @param {Number} cpx x-coordinate for the control point.
     * @param {Number} cpy y-coordinate for the control point.
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     */
    quadraticCurveTo: function(cpx, cpy, x, y) {
        var hiX,
            hiY,
            loX,
            loY;
        this._updateDrawingQueue(["quadraticCurveTo", cpx, cpy, x, y]);
        this._drawingComplete = false;
        this._updateShapeProps(x, y);
        hiX = Math.max(x, cpx);
        hiY = Math.max(y, cpy);
        loX = Math.min(x, cpx);
        loY = Math.min(y, cpy);
        this._updatePosition(hiX, hiY);
        this._updatePosition(loX, loY);
        return this;
    },

    /**
     * Draws a circle.
     *
     * @method drawCircle
     * @param {Number} x y-coordinate
     * @param {Number} y x-coordinate
     * @param {Number} r radius
     */
	drawCircle: function(x, y, radius) {
        var startAngle = 0,
            endAngle = 2 * Math.PI,
            circum = radius * 2;
        this._shape = {
            x:x,
            y:y,
            w:circum,
            h:circum
        };
        this._drawingComplete = false;
        this._updatePosition(x + circum, y + circum);
        this._updateDrawingQueue(["arc", x + radius, y + radius, radius, startAngle, endAngle, false]);
        return this;
    },

    /**
     * Draws an ellipse.
     *
     * @method drawEllipse
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
     * @param {Number} w width
     * @param {Number} h height
     */
	drawEllipse: function(x, y, w, h) {
        this._shape = {
            x:x,
            y:y,
            w:w,
            h:h
        };
        if(this._stroke && this._strokeWeight > 0)
        {
            w -= this._strokeWeight * 2;
            h -= this._strokeWeight * 2;
            x += this._strokeWeight;
            y += this._strokeWeight;
        }
        var l = 8,
            theta = -(45/180) * Math.PI,
            angle = 0,
            angleMid,
            radius = w/2,
            yRadius = h/2,
            i = 0,
            centerX = x + radius,
            centerY = y + yRadius,
            ax, ay, bx, by, cx, cy;

        ax = centerX + Math.cos(0) * radius;
        ay = centerY + Math.sin(0) * yRadius;
        this.moveTo(ax, ay);
        for(; i < l; i++)
        {
            angle += theta;
            angleMid = angle - (theta / 2);
            bx = centerX + Math.cos(angle) * radius;
            by = centerY + Math.sin(angle) * yRadius;
            cx = centerX + Math.cos(angleMid) * (radius / Math.cos(theta / 2));
            cy = centerY + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));
            this.quadraticCurveTo(cx, cy, bx, by);
        }
        this._trackPos(x, y);
        this._trackSize(x + w, y + h);
        return this;
    },

    /**
     * Draws a rectangle.
     *
     * @method drawRect
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
     * @param {Number} w width
     * @param {Number} h height
     */
    drawRect: function(x, y, w, h) {
        this._shape = {
            x:x,
            y:y,
            w:w,
            h:h
        };
        this._drawingComplete = false;
        this.moveTo(x, y);
        this.lineTo(x + w, y);
        this.lineTo(x + w, y + h);
        this.lineTo(x, y + h);
        this.lineTo(x, y);
        return this;
    },

    /**
     * Draws a rectangle with rounded corners.
     * 
     * @method drawRect
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
     * @param {Number} w width
     * @param {Number} h height
     * @param {Number} ew width of the ellipse used to draw the rounded corners
     * @param {Number} eh height of the ellipse used to draw the rounded corners
     */
    drawRoundRect: function(x, y, w, h, ew, eh) {
        this._shape = {
            x:x,
            y:y,
            w:w,
            h:h
        };
        this._drawingComplete = false;
        this._updateDrawingQueue(["moveTo", x, y + eh]);
        this._updateDrawingQueue(["lineTo", x, y + h - eh]);
        this._updateDrawingQueue(["quadraticCurveTo", x, y + h, x + ew, y + h]);
        this._updateDrawingQueue(["lineTo", x + w - ew, y + h]);
        this._updateDrawingQueue(["quadraticCurveTo", x + w, y + h, x + w, y + h - eh]);
        this._updateDrawingQueue(["lineTo", x + w, y + eh]);
        this._updateDrawingQueue(["quadraticCurveTo", x + w, y, x + w - ew, y]);
        this._updateDrawingQueue(["lineTo", x + ew, y]);
        this._updateDrawingQueue(["quadraticCurveTo", x, y, x, y + eh]);
        this._trackPos(x, y);
        this._trackSize(w, h);
        this._paint();
        return this;
    },
    
    /**
     * @private
     * Draws a wedge.
     * 
     * @param x				x component of the wedge's center point
     * @param y				y component of the wedge's center point
     * @param startAngle	starting angle in degrees
     * @param arc			sweep of the wedge. Negative values draw clockwise.
     * @param radius		radius of wedge. If [optional] yRadius is defined, then radius is the x radius.
     * @param yRadius		[optional] y radius for wedge.
     */
    drawWedge: function(cfg)
    {
        var x = cfg.x,
            y = cfg.y,
            startAngle = cfg.startAngle,
            arc = cfg.arc,
            radius = cfg.radius,
            yRadius = cfg.yRadius,
            segs,
            segAngle,
            theta,
            angle,
            angleMid,
            ax,
            ay,
            bx,
            by,
            cx,
            cy,
            i = 0;

        this._drawingComplete = false;
        // move to x,y position
        this._updateRenderQueue(["moveTo", x, y]);
        
        yRadius = yRadius || radius;
        
        // limit sweep to reasonable numbers
        if(Math.abs(arc) > 360)
        {
            arc = 360;
        }
        
        // First we calculate how many segments are needed
        // for a smooth arc.
        segs = Math.ceil(Math.abs(arc) / 45);
        
        // Now calculate the sweep of each segment.
        segAngle = arc / segs;
        
        // The math requires radians rather than degrees. To convert from degrees
        // use the formula (degrees/180)*Math.PI to get radians.
        theta = -(segAngle / 180) * Math.PI;
        
        // convert angle startAngle to radians
        angle = -(startAngle / 180) * Math.PI;
        
        // draw the curve in segments no larger than 45 degrees.
        if(segs > 0)
        {
            // draw a line from the center to the start of the curve
            ax = x + Math.cos(startAngle / 180 * Math.PI) * radius;
            ay = y + Math.sin(-startAngle / 180 * Math.PI) * yRadius;
            this.lineTo(ax, ay);
            // Loop for drawing curve segments
            for(; i < segs; ++i)
            {
                angle += theta;
                angleMid = angle - (theta / 2);
                bx = x + Math.cos(angle) * radius;
                by = y + Math.sin(angle) * yRadius;
                cx = x + Math.cos(angleMid) * (radius / Math.cos(theta / 2));
                cy = y + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));
                this._updateRenderQueue(["quadraticCurveTo", cx, cy, bx, by]);
            }
            // close the wedge by drawing a line to the center
            this._updateRenderQueue(["lineTo", x, y]);
        }
        this._trackPos(x, y);
        this._trackSize(radius, radius);
        this._paint();
    },
    
    /**
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function() {
        this._paint();
        return this;
    },

    /**
     * Returns a linear gradient fill
     *
     * @method _getLinearGradient
     * @private
     */
    _getLinearGradient: function() {
        var isNumber = Y.Lang.isNumber,
            fill = this.get("fill"),
            stops = fill.stops,
            opacity,
            color,
            stop,
            i = 0,
            len = stops.length,
            gradient,
            x = 0,
            y = 0,
            w = this.get("width"),
            h = this.get("height"),
            r = fill.rotation,
            x1, x2, y1, y2,
            cx = x + w/2,
            cy = y + h/2,
            offset,
            radCon = Math.PI/180,
            tanRadians = parseFloat(parseFloat(Math.tan(r * radCon)).toFixed(8));
        if(Math.abs(tanRadians) * w/2 >= h/2)
        {
            if(r < 180)
            {
                y1 = y;
                y2 = y + h;
            }
            else
            {
                y1 = y + h;
                y2 = y;
            }
            x1 = cx - ((cy - y1)/tanRadians);
            x2 = cx - ((cy - y2)/tanRadians); 
        }
        else
        {
            if(r > 90 && r < 270)
            {
                x1 = x + w;
                x2 = x;
            }
            else
            {
                x1 = x;
                x2 = x + w;
            }
            y1 = ((tanRadians * (cx - x1)) - cy) * -1;
            y2 = ((tanRadians * (cx - x2)) - cy) * -1;
        }
        gradient = this._context.createLinearGradient(x1, y1, x2, y2);
        for(; i < len; ++i)
        {
            stop = stops[i];
            opacity = stop.opacity;
            color = stop.color;
            offset = stop.offset;
            if(isNumber(opacity))
            {
                opacity = Math.max(0, Math.min(1, opacity));
                color = this._2RGBA(color, opacity);
            }
            else
            {
                color = this._2RGB(color);
            }
            offset = stop.offset || i/(len - 1);
            gradient.addColorStop(offset, color);
        }
        return gradient;
    },

    /**
     * Returns a radial gradient fill
     *
     * @method _getRadialGradient
     * @private
     */
    _getRadialGradient: function() {
        var isNumber = Y.Lang.isNumber,
            fill = this.get("fill"),
            r = fill.r,
            fx = fill.fx,
            fy = fill.fy,
            stops = fill.stops,
            opacity,
            color,
            stop,
            i = 0,
            len = stops.length,
            gradient,
            x = 0,
            y = 0,
            w = this.get("width"),
            h = this.get("height"),
            x1, x2, y1, y2, r2, 
            xc, yc, xn, yn, d, 
            offset,
            ratio,
            stopMultiplier;
        xc = x + w/2;
        yc = y + h/2;
        x1 = w * fx;
        y1 = h * fy;
        x2 = x + w/2;
        y2 = y + h/2;
        r2 = w * r;
        d = Math.sqrt( Math.pow(Math.abs(xc - x1), 2) + Math.pow(Math.abs(yc - y1), 2) );
        if(d >= r2)
        {
            ratio = d/r2;
            //hack. gradient won't show if it is exactly on the edge of the arc
            if(ratio === 1)
            {
                ratio = 1.01;
            }
            xn = (x1 - xc)/ratio;
            yn = (y1 - yc)/ratio;
            xn = xn > 0 ? Math.floor(xn) : Math.ceil(xn);
            yn = yn > 0 ? Math.floor(yn) : Math.ceil(yn);
            x1 = xc + xn;
            y1 = yc + yn;
        }
        
        //If the gradient radius is greater than the circle's, adjusting the radius stretches the gradient properly.
        //If the gradient radius is less than the circle's, adjusting the radius of the gradient will not work. 
        //Instead, adjust the color stops to reflect the smaller radius.
        if(r >= 0.5)
        {
            gradient = this._context.createRadialGradient(x1, y1, r, x2, y2, r * w);
            stopMultiplier = 1;
        }
        else
        {
            gradient = this._context.createRadialGradient(x1, y1, r, x2, y2, w/2);
            stopMultiplier = r * 2;
        }
        for(; i < len; ++i)
        {
            stop = stops[i];
            opacity = stop.opacity;
            color = stop.color;
            offset = stop.offset;
            if(isNumber(opacity))
            {
                opacity = Math.max(0, Math.min(1, opacity));
                color = this._2RGBA(color, opacity);
            }
            else
            {
                color = this._2RGB(color);
            }
            offset = stop.offset || i/(len - 1);
            offset *= stopMultiplier;
            if(offset <= 1)
            {
                gradient.addColorStop(offset, color);
            }
        }
        return gradient;
    },


    /**
     * Clears all values
     *
     * @method _initProps
     * @private
     */
    _initProps: function() {
        this._methods = [];
        this._lineToMethods = [];
        this._xcoords = [0];
		this._ycoords = [0];
		this._width = 0;
        this._height = 0;
        this._left = 0;
        this._top = 0;
        this._right = 0;
        this._bottom = 0;
        this._x = 0;
        this._y = 0;
    },
   
    /**
     * @private
     */
    _drawingComplete: false,

    /**
     * Creates canvas element
     *
     * @method _createGraphic
     * @private
     */
    _createGraphic: function(config) {
        var graphic = Y.config.doc.createElement('canvas');
        return graphic;
    },
    
    /**
     * Updates the size of the graphics object
     *
     * @method _trackSize
     * @param {Number} w width
     * @param {Number} h height
     * @private
     */
    _trackSize: function(w, h) {
        if (w > this._width) {
            this._width = w;
        }
        if (h > this._height) {
            this._height = h;
        }
    },

    /**
     * Updates the position of the current drawing
     *
     * @method _trackPos
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
     * @private
     */
    _trackPos: function(x, y) {
        if (x > this._x) {
            this._x = x;
        }
        if (y > this._y) {
            this._y = y;
        }
    },

    /**
     * Updates the position and size of the current drawing
     *
     * @method _updateShapeProps
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
     * @private
     */
    _updateShapeProps: function(x, y)
    {
        var w,h;
        if(!this._shape)
        {
            this._shape = {};
        }
        if(!this._shape.x)
        {
            this._shape.x = x;
        }
        else
        {
            this._shape.x = Math.min(this._shape.x, x);
        }
        if(!this._shape.y)
        {
            this._shape.y = y;
        }
        else
        {
            this._shape.y = Math.min(this._shape.y, y);
        }
        w = Math.abs(x - this._shape.x);
        if(!this._shape.w)
        {
            this._shape.w = w;
        }
        else
        {
            this._shape.w = Math.max(w, this._shape.w);
        }
        h = Math.abs(y - this._shape.y);
        if(!this._shape.h)
        {
            this._shape.h = h;
        }
        else
        {
            this._shape.h = Math.max(h, this._shape.h);
        }
    }
};
Y.CanvasDrawing = CanvasDrawing;
/**
 * Base class for creating shapes.
 *
 * @class CanvasShape
 */
var SHAPE = "canvasShape",
    AttributeLite = Y.AttributeLite,
    PluginHost = Y.Plugin.Host,
	CanvasPath,
	CanvasRect,
    CanvasEllipse,
	CanvasCircle,
	CanvasShape = function(cfg)
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
	CanvasShape.NAME = "canvasShape";
	CanvasShape.prototype = Y.merge(Y.CanvasDrawing.prototype, {
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
			host._xcoords = [0];
			host._ycoords = [0];
			/*
			host.get("stroke");
			host.get("fill");
			node.setAttribute("width", host.get("width"));
			node.setAttribute("height", host.get("height"));
			*/
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
		 * @protected
		 */
		translate: function(x, y)
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
		},

		/**
		 * @private
		 */
		_updateHandler: function()
		{
			this._draw();
		},
		
		/**
		 * @private
		 */
		_draw: function()
		{
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
				w = this.get("width") || this._width,
				h = this.get("height") || this._height,
				context = this._context,
				methods = [],
				cachedMethods = this._methods.concat(),
				i = 0,
				j,
				method,
				args,
				len = 0;
			this._context.clearRect(0, 0, w, h);
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
					for(j = 1; j < args.length; ++j)
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
			var w = this.get("width"),
				h = this.get("height");
			this._initProps();
			this._context.clearRect(0, 0, w, h);
			return this;
		}
	});

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
            }
        },

        /**
         * 
         * @attribute width
         */
        width: {},

        /**
         * 
         * @attribute height
         */
        height: {},

        /**
         * The x-coordinate for the shape.
         */
        x: {
            value: 0
        },

        /**
         * The x-coordinate for the shape.
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
         *  </dl>
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
	//Straightup augment, no wrapper functions
	Y.mix(CanvasShape, Y.AttributeLite, false, null, 1);
	Y.mix(CanvasShape, Y.EventTarget, false, null, 1);
	Y.mix(CanvasShape, PluginHost, false, null, 1);
	CanvasShape.plug = PluginHost.plug;
	CanvasShape.unplug = PluginHost.unplug;
	Y.CanvasShape = CanvasShape;
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
/**
 * Draws rectangles
 */
CanvasRect = function()
{
	CanvasRect.superclass.constructor.apply(this, arguments);
};
CanvasRect.NAME = "canvasRect";
Y.extend(CanvasRect, Y.CanvasShape, {
    /**
     * Indicates the type of shape
     *
     * @property _type
     * @readOnly
     * @type String
     */
    _type: "rect",

    /**
     * @private
     */
    _draw: function()
    {
        this.clear();
        var x = this.get("x"),
            y = this.get("y"),
            w = this.get("width"),
            h = this.get("height");
        this.drawRect(x, y, w, h);
        this._paint();
    }
 });
CanvasRect.ATTRS = Y.CanvasShape.ATTRS;
Y.CanvasRect = CanvasRect;
/**
 * Draws ellipses
 */
CanvasEllipse = function(cfg)
{
	CanvasEllipse.superclass.constructor.apply(this, arguments);
};

CanvasEllipse.NAME = "canvasEllipse";

Y.extend(CanvasEllipse, CanvasShape, {
	/**
	 * Indicates the type of shape
	 *
	 * @property _type
	 * @readOnly
	 * @type String
	 */
	_type: "ellipse",

	/**
	 * @private
	 */
	_draw: function()
	{
		var w = this.get("width"),
			h = this.get("height");
		this.drawEllipse(0, 0, w, h);
		this._paint();
	}
});
CanvasEllipse.ATTRS = CanvasShape.ATTRS;
Y.CanvasEllipse = CanvasEllipse;
/**
 * Draws an circle
 */
CanvasCircle = function(cfg)
{
	CanvasCircle.superclass.constructor.apply(this, arguments);
};
    
CanvasCircle.NAME = "canvasCircle";

Y.extend(CanvasCircle, Y.CanvasShape, {
	/**
	 * Indicates the type of shape
	 *
	 * @property _type
	 * @readOnly
	 * @type String
	 */
	_type: "circle",

	/**
	 * @private
	 */
	_draw: function()
	{
		var radius = this.get("radius");
		if(radius)
		{
			this.drawCircle(0, 0, radius);
			this._paint();
		}
	}
});

CanvasCircle.ATTRS = Y.merge(Y.CanvasShape.ATTRS, {
	/**
	 * Indicates the width of the shape
	 *
	 * @attribute width
	 * @type Number
	 */
	width: {
		readOnly:true,

		getter: function()
		{
			return this.get("radius") * 2;
		}
	},

	/**
	 * Indicates the height of the shape
	 *
	 * @attribute height
	 * @type Number
	 */
	height: {
		readOnly:true,

		getter: function()
		{
			return this.get("radius") * 2;
		}
	},

	/**
	 * Radius of the circle
	 *
	 * @attribute radius
	 */
	radius: {
		lazyAdd: false
	}
});
Y.CanvasCircle = CanvasCircle;
/**
 * CanvasGraphic is a simple drawing api that allows for basic drawing operations.
 *
 * @class CanvasGraphic
 * @constructor
 */
function CanvasGraphic(config) {
    
    this.initializer.apply(this, arguments);
}

CanvasGraphic.prototype = {
    /**
     * Gets the current position of the node in page coordinates.
     *
     * @method getXY
     * @return Array The XY position of the shape.
     */
    getXY: function()
    {
        var node = Y.one(this.node),
            xy = node.getXY();
        return xy;
    },

    /**
     * Indicates whether or not the instance will size itself based on its contents.
     *
     * @property autoSize 
     * @type String
     */
    autoSize: true,
    
    /**
     * Indicates whether or not the instance will automatically redraw after a change is made to a shape.
     * This property will get set to false when batching operations.
     *
     * @property autoDraw
     * @type Boolean
     * @default true
     */
    autoDraw: true,
    
	/**
     * Initializes the class.
     *
     * @method initializer
     * @private
     */
    initializer: function(config) {
        this._shapes = {};
		config = config || {};
        var w = config.width || 0,
            h = config.height || 0;
        this.node = Y.config.doc.createElement('div');
        this.setSize(w, h);
        if(config.render)
        {
            this.render(config.render);
        }
    },

    /**
     * Sets the size of the graphics object.
     * 
     * @method setSize
     * @param w {Number} width to set for the instance.
     * @param h {Number} height to set for the instance.
     */
    setSize: function(w, h) {
        if(this.autoSize)
        {
            if(w > this.node.getAttribute("width"))
            {
                this.node.style.width = w + "px";
                this.node.setAttribute("width", w);
            }
            if(h > this.node.getAttribute("height"))
            {
                this.node.style.height = h + "px";
                this.node.setAttribute("height", h);
            }
        }
    },

    /**
     * Updates the size of the graphics object
     *
     * @method _trackSize
     * @param {Number} w width
     * @param {Number} h height
     * @private
     */
    _trackSize: function(w, h) {
        if (w > this._width) {
            this._width = w;
        }
        if (h > this._height) {
            this._height = h;
        }
        this.setSize(w, h);
    },

    /**
     * Sets the positon of the graphics object.
     *
     * @method setPosition
     * @param {Number} x x-coordinate for the object.
     * @param {Number} y y-coordinate for the object.
     */
    setPosition: function(x, y)
    {
        this.node.style.left = x + "px";
        this.node.style.top = y + "px";
    },

    /**
     * Adds the graphics node to the dom.
     * 
     * @method render
     * @param {HTMLElement} parentNode node in which to render the graphics node into.
     */
    render: function(render) {
        var node = this.node,
            parentNode = Y.one(render),
            w = parentNode.get("width") || parentNode.get("offsetWidth"),
            h = parentNode.get("height") || parentNode.get("offsetHeight");
        node.style.display = "block";
        node.style.position = "absolute";
        node.style.left = Y.one(node).getStyle("left");
        node.style.top = Y.one(node).getStyle("top");
        node.style.pointerEvents = "visiblePainted";
        parentNode = parentNode || Y.config.doc.body;
        parentNode.appendChild(this.node);
        this.setSize(w, h);
        return this;
    },
    
    /**
     * Shows and and hides a the graphic instance.
     *
     * @method toggleVisible
     * @param val {Boolean} indicates whether the instance should be visible.
     */
    toggleVisible: function(val)
    {
        this.node.style.visibility = val ? "visible" : "hidden";
    },

    /**
     * Adds a shape instance to the graphic instance.
     *
     * @method addShape
     * @param {Shape} shape The shape instance to be added to the graphic.
     */
    addShape: function(shape)
    {
		var node = shape.node,
            parentNode = this._frag || this.node;
        parentNode.appendChild(node);
        if(!this._graphicsList)
        {
            this._graphicsList = [];
        }
        this._graphicsList.push(node);
    },

    /**
     * Generates a shape instance by type.
     *
     * @method getShape
     * @param {String} type type of shape to generate.
     * @param {Object} cfg attributes for the shape
     * @return Shape
     */
    getShape: function(cfg)
    {
        cfg.graphic = this;
		var shape = new this._shapeClass[cfg.type](cfg);
        this._shapes[shape.get("id")] = shape;
        this.addShape(shape);
        return shape;
    },

    /**
     * @private
     */
    _shapeClass: {
        circle: Y.CanvasCircle,
        rect: Y.CanvasRect,
        path: Y.CanvasPath,
        ellipse: Y.CanvasEllipse
    },

	/**
	 * Allows for creating multiple shapes in order to batch appending and redraw operations.
	 *
	 * @method batch
	 * @param {Function} method Method to execute.
	 */
    batch: function(method)
    {
        var node = this.node,
            frag = document.createDocumentFragment();
        this._frag = frag;
        this.autoDraw = false;
        method();
        node.appendChild(frag);
        this._frag = null;
        this.autoDraw = true;
    },

    /**
     * Removes all nodes.
     *
     * @method destroy
     */
    destroy: function()
    {
        this._removeChildren(this.node);
        if(this.node && this.node.parentNode)
        {
            this.node.parentNode.removeChild(this.node);
        }
    },
    
    /**
     * Removes all child nodes.
     *
     * @method _removeChildren
     * @param {HTMLElement} node
     * @private
     */
    _removeChildren: function(node)
    {
        if(node.hasChildNodes())
        {
            var child;
            while(node.firstChild)
            {
                child = node.firstChild;
                this._removeChildren(child);
                node.removeChild(child);
            }
        }
    }
};

Y.CanvasGraphic = CanvasGraphic;


}, '@VERSION@' ,{skinnable:false, requires:['graphics']});
