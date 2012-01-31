var SHAPE = "canvasShape",
    DOCUMENT = Y.config.doc,
    Y_LANG = Y.Lang,
    AttributeLite = Y.AttributeLite,
	CanvasShape,
	CanvasPath,
	CanvasRect,
    CanvasEllipse,
	CanvasCircle,
    CanvasPieSlice,
    Y_Color = Y.Color,
    PARSE_INT = parseInt,
    PARSE_FLOAT = parseFloat,
    IS_NUMBER = Y_LANG.isNumber,
    RE = RegExp,
    TORGB = Y_Color.toRGB,
    TOHEX = Y_Color.toHex;

/**
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> implementation of the <a href="Drawing.html">`Drawing`</a> class. 
 * `CanvasDrawing` is not intended to be used directly. Instead, use the <a href="Drawing.html">`Drawing`</a> class. 
 * If the browser lacks <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities but has 
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> capabilities, the <a href="Drawing.html">`Drawing`</a> 
 * class will point to the `CanvasDrawing` class.
 *
 * @module graphics
 * @class CanvasDrawing
 * @constructor
 */
function CanvasDrawing()
{
}

CanvasDrawing.prototype = {
    /**
     * Parses hex color string and alpha value to rgba
     *
     * @method _toRGBA
     * @param {Object} val Color value to parse. Can be hex string, rgb or name.
     * @param {Number} alpha Numeric value between 0 and 1 representing the alpha level.
     * @private
     */
    _toRGBA: function(val, alpha) {
        alpha = (alpha !== undefined) ? alpha : 1;
        if (!Y_Color.re_RGB.test(val)) {
            val = TOHEX(val);
        }

        if(Y_Color.re_hex.exec(val)) {
            val = 'rgba(' + [
                PARSE_INT(RE.$1, 16),
                PARSE_INT(RE.$2, 16),
                PARSE_INT(RE.$3, 16)
            ].join(',') + ',' + alpha + ')';
        }
        return val;
    },

    /**
     * Converts color to rgb format
     *
     * @method _toRGB
     * @param val Color value to convert.
     * @private 
     */
    _toRGB: function(val) {
        return TORGB(val);
    },

    /**
     * Sets the size of the graphics object.
     * 
     * @method setSize
     * @param w {Number} width to set for the instance.
     * @param h {Number} height to set for the instance.
     * @private
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
     * Tracks coordinates. Used to calculate the start point of dashed lines. 
     *
     * @method _updateCoords
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
	 * @private
	 */
    _updateCoords: function(x, y)
    {
        this._xcoords.push(x);
        this._ycoords.push(y);
    },

	/**
     * Clears the coordinate arrays. Called at the end of a drawing operation.  
	 * 
     * @method _clearAndUpdateCoords
     * @private
	 */
    _clearAndUpdateCoords: function()
    {
        var x = this._xcoords.pop() || 0,
            y = this._ycoords.pop() || 0;
        this._updateCoords(x, y);
    },

	/**
     * Moves the shape's dom node.
     *
     * @method _updateNodePosition
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
     * Queues up a method to be executed when a shape redraws.
     *
     * @method _updateDrawingQueue
     * @param {Array} val An array containing data that can be parsed into a method and arguments. The value at zero-index of the array is a string reference of
     * the drawing method that will be called. All subsequent indices are argument for that method. For example, `lineTo(10, 100)` would be structured as:
     * `["lineTo", 10, 100]`.
     * @private
     */
    _updateDrawingQueue: function(val)
    {
        this._methods.push(val);
    },
    
    /**
     * Draws a line segment using the current line style from the current drawing position to the specified x and y coordinates.
     * 
     * @method lineTo
     * @param {Number} point1 x-coordinate for the end point.
     * @param {Number} point2 y-coordinate for the end point.
     */
    lineTo: function(point1, point2, etc) 
    {
        var args = arguments, 
            i = 0, 
            len,
            x,
            y,
            wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0;
        if(!this._lineToMethods)
        {
            this._lineToMethods = [];
        }
        if (typeof point1 === 'string' || typeof point1 === 'number') {
            args = [[point1, point2]];
        }

        len = args.length;
        for (; i < len; ++i) 
        {
            if(args[i])
            {
                x = args[i][0];
                y = args[i][1];
                this._updateDrawingQueue(["lineTo", x, y]);
                this._lineToMethods[this._lineToMethods.length] = this._methods[this._methods.length - 1];
                this._trackSize(x - wt, y - wt);
                this._trackSize(x + wt, y + wt);
                this._updateCoords(x, y);
            }
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
        var wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0;
        this._updateDrawingQueue(["moveTo", x, y]);
        this._trackSize(x - wt, y - wt);
        this._trackSize(x + wt, y + wt);
        this._updateCoords(x, y);
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
        hiX = Math.max(x, Math.max(cp1x, cp2x));
        hiY = Math.max(y, Math.max(cp1y, cp2y));
        loX = Math.min(x, Math.min(cp1x, cp2x));
        loY = Math.min(y, Math.min(cp1y, cp2y));
        this._trackSize(hiX, hiY);
        this._trackSize(loX, loY);
        this._updateCoords(hiX, hiY);
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
            loY,
            wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0;
        this._updateDrawingQueue(["quadraticCurveTo", cpx, cpy, x, y]);
        this._drawingComplete = false;
        hiX = Math.max(x, cpx);
        hiY = Math.max(y, cpy);
        loX = Math.min(x, cpx);
        loY = Math.min(y, cpy);
        this._trackSize(hiX + wt, hiY + wt);
        this._trackSize(loX - wt, loY - wt);
        this._updateCoords(hiX, hiY);
        return this;
    },

    /**
     * Draws a circle. Used internally by `CanvasCircle` class.
     *
     * @method drawCircle
     * @param {Number} x y-coordinate
     * @param {Number} y x-coordinate
     * @param {Number} r radius
     * @protected
     */
	drawCircle: function(x, y, radius) {
        var startAngle = 0,
            endAngle = 2 * Math.PI,
            wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0,
            circum = radius * 2;
            circum += wt;
        this._drawingComplete = false;
        this._trackSize(x + circum, y + circum);
        this._trackSize(x - wt, y - wt);
        this._updateCoords(x, y);
        this._updateDrawingQueue(["arc", x + radius, y + radius, radius, startAngle, endAngle, false]);
        return this;
    },

    /**
     * Draws a diamond.     
     * 
     * @method drawDiamond
     * @param {Number} x y-coordinate
     * @param {Number} y x-coordinate
     * @param {Number} width width
     * @param {Number} height height
     * @protected
     */
    drawDiamond: function(x, y, width, height)
    {
        var midWidth = width * 0.5,
            midHeight = height * 0.5;
        this.moveTo(x + midWidth, y);
        this.lineTo(x + width, y + midHeight);
        this.lineTo(x + midWidth, y + height);
        this.lineTo(x, y + midHeight);
        this.lineTo(x + midWidth, y);
        return this;
    },

    /**
     * Draws an ellipse. Used internally by `CanvasEllipse` class.
     *
     * @method drawEllipse
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
     * @param {Number} w width
     * @param {Number} h height
     * @protected
     */
	drawEllipse: function(x, y, w, h) {
        var l = 8,
            theta = -(45/180) * Math.PI,
            angle = 0,
            angleMid,
            radius = w/2,
            yRadius = h/2,
            i = 0,
            centerX = x + radius,
            centerY = y + yRadius,
            ax, ay, bx, by, cx, cy,
            wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0;

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
            this._updateDrawingQueue(["quadraticCurveTo", cx, cy, bx, by]);
        }
        this._trackSize(x + w + wt, y + h + wt);
        this._trackSize(x - wt, y - wt);
        this._updateCoords(x, y);
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
        var wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0;
        this._drawingComplete = false;
        this._updateDrawingQueue(["moveTo", x, y]);
        this._updateDrawingQueue(["lineTo", x + w, y]);
        this._updateDrawingQueue(["lineTo", x + w, y + h]);
        this._updateDrawingQueue(["lineTo", x, y + h]);
        this._updateDrawingQueue(["lineTo", x, y]);
        this._trackSize(x - wt, y - wt);
        this._trackSize(x + w + wt, y + h + wt);
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
        var wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0;
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
        this._trackSize(x - wt, y - wt);
        this._trackSize(x + w + wt, y + h + wt);
        this._updateCoords(w, h);
        return this;
    },
    
    /**
     * Draws a wedge.
     *
     * @method drawWedge
     * @param {Number} x x-coordinate of the wedge's center point
     * @param {Number} y y-coordinate of the wedge's center point
     * @param {Number} startAngle starting angle in degrees
     * @param {Number} arc sweep of the wedge. Negative values draw clockwise.
     * @param {Number} radius radius of wedge. If [optional] yRadius is defined, then radius is the x radius.
     * @param {Number} yRadius [optional] y radius for wedge.
     * @private
     */
    drawWedge: function(x, y, startAngle, arc, radius, yRadius)
    {
        var segs,
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
        yRadius = yRadius || radius;

        this._drawingComplete = false;
        // move to x,y position
        this._updateDrawingQueue(["moveTo", x, y]);
        
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
        angle = (startAngle / 180) * Math.PI;
        
        // draw the curve in segments no larger than 45 degrees.
        if(segs > 0)
        {
            // draw a line from the center to the start of the curve
            ax = x + Math.cos(startAngle / 180 * Math.PI) * radius;
            ay = y + Math.sin(startAngle / 180 * Math.PI) * yRadius;
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
                this._updateDrawingQueue(["quadraticCurveTo", cx, cy, bx, by]);
            }
            // close the wedge by drawing a line to the center
            this._updateDrawingQueue(["lineTo", x, y]);
        }
        this._trackSize(0 , 0);
        this._trackSize(radius * 2, radius * 2);
        return this;
    },
    
    /**
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function() {
        this._closePath();
        return this;
    },

    /**
     * Ends a fill and stroke
     *
     * @method closePath
     */
    closePath: function()
    {
        this._updateDrawingQueue(["closePath"]);
        this._updateDrawingQueue(["beginPath"]);
    },

	/**
	 * Clears the graphics object.
	 *
	 * @method clear
	 */
    
    /**
     * Returns a linear gradient fill
     *
     * @method _getLinearGradient
     * @return CanvasGradient
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
                color = this._toRGBA(color, opacity);
            }
            else
            {
                color = TORGB(color);
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
     * @return CanvasGradient
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
                color = this._toRGBA(color, opacity);
            }
            else
            {
                color = TORGB(color);
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
    },
   
    /**
     * Indicates a drawing has completed.
     *
     * @property _drawingComplete
     * @type Boolean
     * @private
     */
    _drawingComplete: false,

    /**
     * Creates canvas element
     *
     * @method _createGraphic
     * @return HTMLCanvasElement
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
        if (w > this._right) {
            this._right = w;
        }
        if(w < this._left)
        {
            this._left = w;    
        }
        if (h < this._top)
        {
            this._top = h;
        }
        if (h > this._bottom) 
        {
            this._bottom = h;
        }
        this._width = this._right - this._left;
        this._height = this._bottom - this._top;
    }
};
Y.CanvasDrawing = CanvasDrawing;
