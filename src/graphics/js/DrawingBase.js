function DrawingBase(){}

/**
 * Abstract class for drawing operations. Implemented by the following classes:
 *
 *  <ul>
 *      <li>{{#crossLink "CanvasDrawing"}}{{/crossLink}}</li>
 *      <li>{{#crossLink "SVGDrawing"}}{{/crossLink}}</li>
 *      <li>{{#crossLink "VMLDrawing"}}{{/crossLink}}</li>
 *  </ul>
 *
 *
 * @module graphics
 * @class Drawing
 * @constructor
 */
DrawingBase.prototype = {
    /**
     * Maps path to methods
     *
     * @property _pathSymbolToMethod
     * @type Object
     * @private
     */
    _pathSymbolToMethod: {
        M: "moveTo",
        m: "relativeMoveTo",
        L: "lineTo",
        l: "relativeLineTo",
        C: "curveTo",
        c: "relativeCurveTo",
        Q: "quadraticCurveTo",
        q: "relativeQuadraticCurveTo",
        z: "closePath",
        Z: "closePath"
    },

    /**
     * Current x position of the drawing.
     *
     * @property _currentX
     * @type Number
     * @private
     */
    _currentX: 0,

    /**
     * Current y position of the drqwing.
     *
     * @property _currentY
     * @type Number
     * @private
     */
    _currentY: 0,

    _data: "",

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
     * Draws a bezier curve.
     *
     * @method curveTo
     * @param {Number} cp1x x-coordinate for the first control point.
     * @param {Number} cp1y y-coordinate for the first control point.
     * @param {Number} cp2x x-coordinate for the second control point.
     * @param {Number} cp2y y-coordinate for the second control point.
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     * @chainable
     */
    curveTo: function() {
        var args = Y.Array(arguments),
            len = args.length,
            i;
        if(this._pathType !== "C") 
        {
            this._data = this._data + " C";
        }
        else 
        {
            this._data = this._data + " ";
        }
        for(i = 0; i < len - 1; i = i + 2) {
            if(i > 1) 
            {
                this._data = this._data + " ";
            }
            this._data = this._data + args[i] + ", " + args[i + 1];
        }
        this._curveTo.apply(this, [args, false]);
        return this;
    },

    /**
     * Draws a bezier curve relative to the current coordinates.
     *
     * @method relativeCurveTo
     * @param {Number} cp1x x-coordinate for the first control point.
     * @param {Number} cp1y y-coordinate for the first control point.
     * @param {Number} cp2x x-coordinate for the second control point.
     * @param {Number} cp2y y-coordinate for the second control point.
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     * @chainable
     */
    relativeCurveTo: function() {
        var args = Y.Array(arguments),
            len = args.length,
            i;
        if(this._pathType !== "c") 
        {
            this._data = this._data + " c";
        }
        else 
        {
            this._data = this._data + " ";
        }
        for(i = 0; i < len - 1; i = i + 2) {
            if(i > 1) 
            {
                this._data = this._data + " ";
            }
            this._data = this._data + args[i] + ", " + args[i + 1];
        }
        this._curveTo.apply(this, [args, true]);
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
     * @chainable
     */
    quadraticCurveTo: function() {
        var args = Y.Array(arguments),
            len = args.length,
            i;
        if(this._pathType !== "Q") 
        {
            this._data = this._data + " Q";
        }
        else 
        {
            this._data = this._data + " ";
        }
        for(i = 0; i < len - 1; i = i + 2) {
            if(i > 1) 
            {
                this._data = this._data + " ";
            }
            this._data = this._data + args[i] + ", " + args[i + 1];
        }
        this._quadraticCurveTo.apply(this, [args, false]);
        return this;
    },

    /**
     * Draws a quadratic bezier curve relative to the current position.
     *
     * @method relativeQuadraticCurveTo
     * @param {Number} cpx x-coordinate for the control point.
     * @param {Number} cpy y-coordinate for the control point.
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     * @chainable
     */
    relativeQuadraticCurveTo: function() {
        var args = Y.Array(arguments),
            len = args.length,
            i;
        if(this._pathType !== "q") 
        {
            this._data = this._data + " q";
        }
        else 
        {
            this._data = this._data + " ";
        }
        for(i = 0; i < len - 1; i = i + 2) {
            if(i > 1) 
            {
                this._data = this._data + " ";
            }
            this._data = this._data + args[i] + ", " + args[i + 1];
        }
        this._quadraticCurveTo.apply(this, [args, true]);
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
     * @chainable
     */
    drawRect: function(x, y, w, h) {
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
     * @chainable
     */
    drawRoundRect: function(x, y, w, h, ew, eh) {
        this.moveTo(x, y + eh);
        this.lineTo(x, y + h - eh);
        this.quadraticCurveTo(x, y + h, x + ew, y + h);
        this.lineTo(x + w - ew, y + h);
        this.quadraticCurveTo(x + w, y + h, x + w, y + h - eh);
        this.lineTo(x + w, y + eh);
        this.quadraticCurveTo(x + w, y, x + w - ew, y);
        this.lineTo(x + ew, y);
        this.quadraticCurveTo(x, y, x, y + eh);
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
     * @chainable
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
     * Draws a wedge.
     *
     * @method drawWedge
     * @param {Number} x x-coordinate of the wedge's center point
     * @param {Number} y y-coordinate of the wedge's center point
     * @param {Number} startAngle starting angle in degrees
     * @param {Number} arc sweep of the wedge. Negative values draw clockwise.
     * @param {Number} radius radius of wedge. If [optional] yRadius is defined, then radius is the x radius.
     * @param {Number} yRadius [optional] y radius for wedge.
     * @chainable
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
            i,
            diameter = radius * 2;
        yRadius = yRadius || radius;
        this.moveTo(x, y);

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
        if(segs > 0)
        {
            // draw a line from the center to the start of the curve
            ax = x + Math.cos(startAngle / 180 * Math.PI) * radius;
            ay = y + Math.sin(startAngle / 180 * Math.PI) * yRadius;
            this.lineTo(Math.round(ax), Math.round(ay));
            for(i = 0; i < segs; ++i)
            {
                angle += theta;
                angleMid = angle - (theta / 2);
                bx = x + Math.cos(angle) * radius;
                by = y + Math.sin(angle) * yRadius;
                cx = x + Math.cos(angleMid) * (radius / Math.cos(theta / 2));
                cy = y + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));
                this.quadraticCurveTo(Math.round(cx), Math.round(cy), Math.round(bx), Math.round(by));
            }
        }
        this._currentX = x;
        this._currentY = y;
        this._trackSize(diameter, diameter);
        return this;
    },

    /**
     * Draws a line segment from the current drawing position to the specified x and y coordinates.
     *
     * @method lineTo
     * @param {Number} arg1 x-coordinate for the end point.
     * @param {Number} point2 y-coordinate for the end point.
     * @chainable
     */
    lineTo: function()
    {
        var args = this._getLineToArgs.apply(this, arguments);
        if(this._pathType !== "L") 
        {
            this._data = this._data + " L";
        }
        else 
        {
            this._data = this._data + ", ";
        }
        this._data = this._data + args.join(", ");
        this._lineTo.apply(this, [args, false]);
        return this;
    },

    /**
     * Draws a line segment from the current drawing position to the relative x and y coordinates.
     *
     * @method relativeLineTo
     * @param {Number} point1 x-coordinate for the end point.
     * @param {Number} point2 y-coordinate for the end point.
     * @chainable
     */
    relativeLineTo: function()
    {
        var args = this._getLineToArgs.apply(this, arguments);
        if(this._pathType !== "l") 
        {
            this._data = this._data + " l";
        }
        else 
        {
            this._data = this._data + ", ";
        }
        this._data = this._data + args.join(", ");
        this._lineTo.apply(this, [args, true]);
        return this;
    },

    /**
     * Moves the current drawing position to specified x and y coordinates.
     *
     * @method moveTo
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     * @chainable
     */
    moveTo: function()
    {
        var args = Y.Array(arguments);
        if(this._pathType !== "M") 
        {
            this._data = this._data + " M";
        }
        else 
        {
            this._data = this._data + ", ";
        }
        this._data = this._data + args.join(", ");
        this._moveTo.apply(this, [args, false]);
        return this;
    },

    /**
     * Moves the current drawing position relative to specified x and y coordinates.
     *
     * @method relativeMoveTo
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     * @chainable
     */
    relativeMoveTo: function()
    {
        var args = Y.Array(arguments);
        if(this._pathType !== "m") 
        {
            this._data = this._data + " m";
        }
        else 
        {
            this._data = this._data + ", ";
        }
        this._moveTo.apply(this, [Y.Array(arguments), true]);
        return this;
    },

    /**
     * Completes a drawing operation.
     *
     * @method end
     * @chainable
     */
    end: function()
    {
        this._closePath();
        return this;
    },

    /**
     * Ends a fill and stroke
     *
     * @method closePath
     * @chainable
     */
    closePath: function()
    {
        this._pathArray.push(["z"]);
        return this;
    },

    /**
     * Returns an array of points for the _lineTo method.
     *
     * @method _getLineToArgs
     * @return Array
     * @private
     */
    _getLineToArgs: function() {
        var arg1 = arguments[0],
            args,
            i,
            len;
        if(typeof arg1 === "string" || typeof arg1 === "number") 
        {
            args = Y.Array(arguments);
        }
        else
        {
            args = [];
            len = arg1.length;
            for(i = 0; i < len; i = i + 1) 
            {
                args.push(arg1[i][0]);
                args.push(arg1[i][1]);
            }
        }
        return args;
    },

    /**
     * Returns the points on a curve
     *
     * @method getBezierData
     * @param Array points Array containing the begin, end and control points of a curve.
     * @param Number t The value for incrementing the next set of points.
     * @return Array
     * @private
     */
    getBezierData: function(points, t) {
        var n = points.length,
            tmp = [],
            i,
            j;

        for (i = 0; i < n; ++i){
            tmp[i] = [points[i][0], points[i][1]]; // save input
        }

        for (j = 1; j < n; ++j) {
            for (i = 0; i < n - j; ++i) {
                tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];
                tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1];
            }
        }
        return [ tmp[0][0], tmp[0][1] ];
    },

    /**
     * Calculates the bounding box for a curve
     *
     * @method _setCurveBoundingBox
     * @param Array pts Array containing points for start, end and control points of a curve.
     * @param Number w Width used to calculate the number of points to describe the curve.
     * @param Number h Height used to calculate the number of points to describe the curve.
     * @private
     */
    _setCurveBoundingBox: function(pts, w, h)
    {
        var i,
            left = this._currentX,
            right = left,
            top = this._currentY,
            bottom = top,
            len = Math.round(Math.sqrt((w * w) + (h * h))),
            t = 1/len,
            xy;
        for(i = 0; i < len; ++i)
        {
            xy = this.getBezierData(pts, t * i);
            left = isNaN(left) ? xy[0] : Math.min(xy[0], left);
            right = isNaN(right) ? xy[0] : Math.max(xy[0], right);
            top = isNaN(top) ? xy[1] : Math.min(xy[1], top);
            bottom = isNaN(bottom) ? xy[1] : Math.max(xy[1], bottom);
        }
        left = Math.round(left * 10)/10;
        right = Math.round(right * 10)/10;
        top = Math.round(top * 10)/10;
        bottom = Math.round(bottom * 10)/10;
        this._trackSize(right, bottom);
        this._trackSize(left, top);
    },

    /**
     * Returns the svg data string for drawn circle or ellipse.
     *
     * @method _getEllipseData
     * @param {Number} x The x coordinate for the ellipse.
     * @param {Number} y The y coordinate for the ellipse.
     * @param {Number} radius The x radius of the ellipse.
     * @param {Number} yRadius The y radius of the ellipse. If not specified, data for a circle will be created.
     * @return String
     * @private
     */ 
    _getEllipseData: function(x, y, radius, yRadius) {
        var data;
        yRadius = yRadius || radius;
        if(this._pathType !== "M") 
        {
            data = " M";
        }
        else 
        {
            data =  ", ";
        }
        data = data + (x + radius) + ", " + y;
        data = data + " A" + radius + ", " + yRadius + " 0 1, 0 " + (x + radius) + ", " + (y + (yRadius * 2));
        data = data + " A" + radius + ", " + yRadius + " 0 1, 0 " + (x + radius) + ", " + y; 
        this._pathType = "A";
        return data;
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
Y.DrawingBase = DrawingBase;
