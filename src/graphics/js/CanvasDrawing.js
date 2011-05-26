var SHAPE = "canvasShape",
    AttributeLite = Y.AttributeLite,
    PluginHost = Y.Plugin.Host,
	CanvasShape,
	CanvasPath,
	CanvasRect,
    CanvasEllipse,
	CanvasCircle,
	DUMMY;
/**
 * Creates dom element used for converting color string to rgb
 *
 * @method _createDummy
 * @private
 */
function _createDummy() 
{
    if(!DUMMY)
    {
        DUMMY = Y.config.doc.createElement('div');
    }
    DUMMY.style.height = 0;
    DUMMY.style.width = 0;
    DUMMY.style.overflow = 'hidden';
    Y.config.doc.documentElement.appendChild(DUMMY);
    return DUMMY;
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
