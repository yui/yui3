var IMPLEMENTATION = "canvas",
    SHAPE = "shape",
	SPLITPATHPATTERN = /[a-z][^a-z]*/ig,
    SPLITARGSPATTERN = /[\-]?[0-9]*[0-9|\.][0-9]*/g,
    DOCUMENT = Y.config.doc,
    Y_LANG = Y.Lang,
    AttributeLite = Y.AttributeLite,
	CanvasShape,
	CanvasPath,
	CanvasRect,
    CanvasEllipse,
	CanvasCircle,
    CanvasPieSlice,
    Y_DOM = Y.DOM,
    Y_Color = Y.Color,
    PARSE_INT = parseInt,
    PARSE_FLOAT = parseFloat,
    IS_NUMBER = Y_LANG.isNumber,
    RE = RegExp,
    TORGB = Y_Color.toRGB,
    TOHEX = Y_Color.toHex,
    _getClassName = Y.ClassNameManager.getClassName;

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
     * Maps path to methods
     *
     * @property _pathSymbolToMethod
     * @type Object
     * @private
     */
    _pathSymbolToMethod: {
        A: "ellipticalArc",
        a: "relativeEllipticalArc",
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
        this._currentX = x;
        this._currentY = y;
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
     * @param {Array} val An array containing data that can be parsed into a method and arguments. The value at zero-index
     * of the array is a string reference of the drawing method that will be called. All subsequent indices are argument for
     * that method. For example, `lineTo(10, 100)` would be structured as:
     * `["lineTo", 10, 100]`.
     * @private
     */
    _updateDrawingQueue: function(val)
    {
        this._methods.push(val);
    },

    /**
     * Draws an elliptical arc based on the svg arc spec.
     *
     * @method ellipticalArc
     * @param {Number} rx The x-radius for the arc.
     * @param {Number} ry The y-radius for the arc.
     * @param {Number} xAxisRotation Indicates how much to rotate the ellipse relative to the x-axis
     * of the current coordinate system.
     * @param {Number} largeArcFlag Indicates whether a large arc or small arc will be drawn. A value of `1`
     * indicates a large arc. A value of `0` represents a small arc.
     * @param {Number} sweepFlag Indicates whether a positive or negative angle will be drawn. A value of `1`
     * indicates a positive value. A value of `0` represents a negative value.
     * @param {Number} x The x-coordinate of the arc's end point.
     * @param {Number} y The y-coordinate of the arc's end point.
     * @chainable
     */
    ellipticalArc: function()
    {
        this._ellipticalArc.apply(this, Y.Array(arguments));
        return this;
    },

    /**
     * Draws a relative elliptical arc based on the svg arc spec.
     *
     * @method relativeEllipticalArc
     * @param {Number} rx The x-radius for the arc.
     * @param {Number} ry The y-radius for the arc.
     * @param {Number} xAxisRotation Indicates how much to rotate the ellipse relative to the x-axis
     * of the current coordinate system.
     * @param {Number} largeArcFlag Indicates whether a large arc or small arc will be drawn. A value of `1`
     * indicates a large arc. A value of `0` represents a small arc.
     * @param {Number} sweepFlag Indicates whether a positive or negative angle will be drawn. A value of `1`
     * indicates a positive value. A value of `0` represents a negative value.
     * @param {Number} x The x-coordinate of the arc's end point.
     * @param {Number} y The y-coordinate of the arc's end point.
     * @chainable
     */
    relativeEllipticalArc: function()
    {
        var args = Y.Array(arguments);
        args.push(true);
        this._ellipticalArc.apply(this, args);
        return this;
    },

    /**
     * Implements ellipticalArc methods.
     *
     * @method _ellipticalArc
     * @param {Number} rx The x-radius for the arc.
     * @param {Number} ry The y-radius for the arc.
     * @param {Number} xAxisRotation Indicates how much to rotate the ellipse relative to the x-axis
     * of the current coordinate system.
     * @param {Number} largeArcFlag Indicates whether a large arc or small arc will be drawn. A value of `1`
     * indicates a large arc. A value of `0` represents a small arc.
     * @param {Number} sweepFlag Indicates whether a positive or negative angle will be drawn. A value of `1`
     * indicates a positive value. A value of `0` represents a negative value.
     * @param {Number} x The x-coordinate of the arc's end point.
     * @param {Number} y The y-coordinate of the arc's end point.
     * @param {Boolean} relative Indicates whether or not to use relative coordinates.
     * @private
     */
    _ellipticalArc: function(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y, relative) {
        var x1 = this._currentX,
            y1 = this._currentY,
            x2 = x,
            y2 = y,
            x1_,
            y1_,
            x1_pow2,
            y1_pow2,
            cx,
            cy,
            cx_,
            cy_,
            rxpow2,
            rypow2,
            sinTheta,
            cosTheta,
            radian360 = 2 * Math.PI,
            scalarMultiplier,
            thetaOne,
            deltaTheta,
            thetaTwo,
            sign,
            ux,
            uy,
            vx,
            vy,
            lambda,
            i,
            angle,
            segments,
            segmentAngle,
            curveArgs;
        if(relative) {
            x2 = x2 + x1;
            y2 = y2 + y1;
        }
        //if rx or ry are 0, return lineTo
        if(x1 === x && y1 === y) {
            return;
        }
        if(rx === 0 || ry === 0) {
            return this._lineTo.apply(this, [[x, y], relative]);
        }
        //ensure radii are positive
        rx = Math.abs(rx);
        ry = Math.abs(ry);
        //flags are true unless explicitly set to zero per spec
        largeArcFlag = parseFloat(largeArcFlag) !== 0;
        sweepFlag = parseFloat(sweepFlag) !== 0;
        //ensure its between -360 and 360
        xAxisRotation = xAxisRotation % 360;
        //convert to radians
        xAxisRotation = xAxisRotation/180 * Math.PI;
        //cache sin and cos of angle
        sinTheta = Math.sin(xAxisRotation);
        cosTheta = Math.cos(xAxisRotation);

        //step 1: compute x and y derivatives
        x1_ = (cosTheta * (x1 - x2)/2) + (sinTheta * (y1 - y2)/2);
        y1_ = (-sinTheta * (x1 - x2)/2) + (cosTheta * (y1 - y2)/2);

        //cache squared values
        rxpow2 = Math.pow(rx, 2);
        rypow2 = Math.pow(ry, 2);
        x1_pow2 = Math.pow(x1_, 2);
        y1_pow2 = Math.pow(y1_, 2);
        lambda = x1_pow2/rxpow2 + y1_pow2/rypow2;

        if(lambda > 1) {
            //correct rx and ry and resquare
            lambda = Math.sqrt(lambda);
            rx = lambda * rx;
            ry = lambda * ry;
            rxpow2 = Math.pow(rx, 2);
            rypow2 = Math.pow(ry, 2);
        }

        x1_pow2 = Math.round(x1_pow2 * 10)/10;
        y1_pow2 = Math.round(y1_pow2 * 10)/10;
        rxpow2 = Math.round(rxpow2 * 10)/10;
        rypow2 = Math.round(rypow2 * 10)/10;
        
        //compute cx/cy derivatives
        //cache the scalr value for use in getting both derivatives
        scalarMultiplier = ((rxpow2 * rypow2) - (rxpow2 * y1_pow2) - (rypow2 * x1_pow2)) /  ((rxpow2 * y1_pow2) + (rypow2 * x1_pow2));
        scalarMultiplier = Math.sqrt(scalarMultiplier);
        if(largeArcFlag === sweepFlag) {
            scalarMultiplier = -scalarMultiplier;
        }
        cx_ = scalarMultiplier * (rx * y1_)/ry;
        cy_ = scalarMultiplier * -(ry * x1_)/rx;

        //compute cx and cy
        cx = (cosTheta * cx_) - (sinTheta * cy_) + (x1 + x2)/2;
        cy = (sinTheta * cx_) + (cosTheta * cy_) + (y1 + y2)/2;

        //set vectors for thetaOne
        ux = 1;
        uy = 0;
        vx = (x1_ - cx_)/rx;
        vy = (y1_ - cy_)/ry;
        sign = vy < 0 ? -1 : 1;
        //get the angle between the two vectors
        thetaOne = sign * Math.acos((ux * vx + uy * vy) / (Math.sqrt(ux * ux + uy * uy) * Math.sqrt(vx * vx + vy * vy)));
        
        //set the vectors for deltaTheta
        ux = (x1_ - cx_)/rx;
        uy = (y1_ - cy_)/ry;
        vx = (-x1_ - cx_)/rx;
        vy = (-y1_ - cy_)/ry;
        sign = (ux * vy - uy * vx) < 0 ? -1 : 1;
        //sign = sign < 0 ? -1 : 1;
        //get the angle between the two vectors
        deltaTheta = sign * Math.acos((ux * vx + uy * vy) / (Math.sqrt(ux * ux + uy * uy) * Math.sqrt(vx * vx + vy * vy))) % radian360;

        if(!sweepFlag && deltaTheta > 0) {
            deltaTheta = deltaTheta - radian360;
        } else if(sweepFlag && deltaTheta < 0) {
            deltaTheta = deltaTheta + radian360;
        }
        segments = Math.ceil(Math.abs(deltaTheta) / (1/360 * Math.PI));
        thetaTwo = thetaOne + deltaTheta;
        segmentAngle = deltaTheta/segments;
        angle = thetaOne - segmentAngle;
        curveArgs = [];
        for(i = 0; i < segments; i = i + 1) {
            angle += segmentAngle;
            curveArgs.push((cosTheta * (rx * Math.cos(angle))) - (sinTheta * (ry * Math.sin(angle))) + cx);
            curveArgs.push((sinTheta * (rx * Math.cos(angle))) + (cosTheta * (ry * Math.sin(angle))) + cy);
        }
        this._lineTo(curveArgs);
    },

    /**
     * Draws a line segment from the current drawing position to the specified x and y coordinates.
     *
     * @method lineTo
     * @param {Number} point1 x-coordinate for the end point.
     * @param {Number} point2 y-coordinate for the end point.
     * @chainable
     */
    lineTo: function()
    {
        this._lineTo.apply(this, [Y.Array(arguments), false]);
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
        this._lineTo.apply(this, [Y.Array(arguments), true]);
        return this;
    },

    /**
     * Implements lineTo methods.
     *
     * @method _lineTo
     * @param {Array} args The arguments to be used.
     * @param {Boolean} relative Indicates whether or not to use relative coordinates.
     * @private
     */
    _lineTo: function(args, relative)
    {
        var point1 = args[0],
            i,
            len,
            x,
            y,
            wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0,
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        if(!this._lineToMethods)
        {
            this._lineToMethods = [];
        }
        len = args.length - 1;
        if (typeof point1 === 'string' || typeof point1 === 'number') {
            for (i = 0; i < len; i = i + 2) {
                x = parseFloat(args[i]);
                y = parseFloat(args[i + 1]);
                x = x + relativeX;
                y = y + relativeY;
                this._updateDrawingQueue(["lineTo", x, y]);
                this._trackSize(x - wt, y - wt);
                this._trackSize(x + wt, y + wt);
                this._updateCoords(x, y);
            }
        }
        else
        {
            for (i = 0; i < len; i = i + 1)
            {
                x = parseFloat(args[i][0]);
                y = parseFloat(args[i][1]);
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
     * @chainable
     */
    moveTo: function()
    {
        this._moveTo.apply(this, [Y.Array(arguments), false]);
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
        this._moveTo.apply(this, [Y.Array(arguments), true]);
        return this;
    },

    /**
     * Implements moveTo methods.
     *
     * @method _moveTo
     * @param {Array} args The arguments to be used.
     * @param {Boolean} relative Indicates whether or not to use relative coordinates.
     * @private
     */
    _moveTo: function(args, relative) {
        var wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0,
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0,
            x = parseFloat(args[0]) + relativeX,
            y = parseFloat(args[1]) + relativeY;
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
     * @chainable
     */
    curveTo: function() {
        this._curveTo.apply(this, [Y.Array(arguments), false]);
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
        this._curveTo.apply(this, [Y.Array(arguments), true]);
        return this;
    },

    /**
     * Implements curveTo methods.
     *
     * @method _curveTo
     * @param {Array} args The arguments to be used.
     * @param {Boolean} relative Indicates whether or not to use relative coordinates.
     * @private
     */
    _curveTo: function(args, relative) {
        var w,
            h,
            cp1x,
            cp1y,
            cp2x,
            cp2y,
            x,
            y,
            pts,
            right,
            left,
            bottom,
            top,
            i,
            len,
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        len = args.length - 5;
        for(i = 0; i < len; i = i + 6)
        {
            cp1x = parseFloat(args[i]) + relativeX;
            cp1y = parseFloat(args[i + 1]) + relativeY;
            cp2x = parseFloat(args[i + 2]) + relativeX;
            cp2y = parseFloat(args[i + 3]) + relativeY;
            x = parseFloat(args[i + 4]) + relativeX;
            y = parseFloat(args[i + 5]) + relativeY;
            this._updateDrawingQueue(["bezierCurveTo", cp1x, cp1y, cp2x, cp2y, x, y]);
            this._drawingComplete = false;
            right = Math.max(x, Math.max(cp1x, cp2x));
            bottom = Math.max(y, Math.max(cp1y, cp2y));
            left = Math.min(x, Math.min(cp1x, cp2x));
            top = Math.min(y, Math.min(cp1y, cp2y));
            w = Math.abs(right - left);
            h = Math.abs(bottom - top);
            pts = [[this._currentX, this._currentY] , [cp1x, cp1y], [cp2x, cp2y], [x, y]];
            this._setCurveBoundingBox(pts, w, h);
            this._currentX = x;
            this._currentY = y;
        }
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
        this._quadraticCurveTo.apply(this, [Y.Array(arguments), false]);
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
        this._quadraticCurveTo.apply(this, [Y.Array(arguments), true]);
        return this;
    },

    /**
     * Implements quadraticCurveTo methods.
     *
     * @method _quadraticCurveTo
     * @param {Array} args The arguments to be used.
     * @param {Boolean} relative Indicates whether or not to use relative coordinates.
     * @private
     */
    _quadraticCurveTo: function(args, relative) {
        var cpx,
            cpy,
            x,
            y,
            w,
            h,
            pts,
            right,
            left,
            bottom,
            top,
            i,
            len = args.length - 3,
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        for(i = 0; i < len; i = i + 4)
        {
            cpx = parseFloat(args[i]) + relativeX;
            cpy = parseFloat(args[i + 1]) + relativeY;
            x = parseFloat(args[i + 2]) + relativeX;
            y = parseFloat(args[i + 3]) + relativeY;
            this._drawingComplete = false;
            right = Math.max(x, cpx);
            bottom = Math.max(y, cpy);
            left = Math.min(x, cpx);
            top = Math.min(y, cpy);
            w = Math.abs(right - left);
            h = Math.abs(bottom - top);
            pts = [[this._currentX, this._currentY] , [cpx, cpy], [x, y]];
            this._setCurveBoundingBox(pts, w, h);
            this._updateDrawingQueue(["quadraticCurveTo", cpx, cpy, x, y]);
            this._updateCoords(x, y);
        }
        return this;
    },

    /**
     * Draws a circle. Used internally by `CanvasCircle` class.
     *
     * @method drawCircle
     * @param {Number} x y-coordinate
     * @param {Number} y x-coordinate
     * @param {Number} r radius
     * @chainable
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
     * Draws an ellipse. Used internally by `CanvasEllipse` class.
     *
     * @method drawEllipse
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
     * @param {Number} w width
     * @param {Number} h height
     * @chainable
     * @protected
     */
	drawEllipse: function(x, y, w, h) {
        var l = 8,
            theta = -(45/180) * Math.PI,
            angle = 0,
            angleMid,
            radius = w/2,
            yRadius = h/2,
            i,
            centerX = x + radius,
            centerY = y + yRadius,
            ax, ay, bx, by, cx, cy,
            wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0;

        ax = centerX + Math.cos(0) * radius;
        ay = centerY + Math.sin(0) * yRadius;
        this.moveTo(ax, ay);
        for(i = 0; i < l; i++)
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
     * @chainable
     */
    drawRect: function(x, y, w, h) {
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
     * @chainable
     */
    drawRoundRect: function(x, y, w, h, ew, eh) {
        this._drawingComplete = false;
        this.moveTo( x, y + eh);
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
        var wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0,
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
            for(i = 0; i < segs; ++i)
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
        this._trackSize(-wt , -wt);
        this._trackSize((radius * 2) + wt, (radius * 2) + wt);
        return this;
    },

    /**
     * Completes a drawing operation.
     *
     * @method end
     * @chainable
     */
    end: function() {
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
        this._updateDrawingQueue(["closePath"]);
        this._updateDrawingQueue(["beginPath"]);
        return this;
    },

	/**
	 * Clears the graphics object.
	 *
	 * @method clear
     * @chainable
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
            i,
            len = stops.length,
            gradient,
            x = 0,
            y = 0,
            w = this.get("width"),
            h = this.get("height"),
            r = fill.rotation || 0,
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
        for(i = 0; i < len; ++i)
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
            i,
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
        for(i = 0; i < len; ++i)
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
        this._currentX = 0;
        this._currentY = 0;
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
    _createGraphic: function() {
        var graphic = Y.config.doc.createElement('canvas');
        return graphic;
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
        var i = 0,
            left = this._currentX,
            right = left,
            top = this._currentY,
            bottom = top,
            len = Math.round(Math.sqrt((w * w) + (h * h))),
            t = 1/len,
            wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0,
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
        this._trackSize(right + wt, bottom + wt);
        this._trackSize(left - wt, top - wt);
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
