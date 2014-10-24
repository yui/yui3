var IMPLEMENTATION = "vml",
    SHAPE = "shape",
	SPLITPATHPATTERN = /[a-z][^a-z]*/ig,
    SPLITARGSPATTERN = /[\-]?[0-9]*[0-9|\.][0-9]*/g,
    Y_LANG = Y.Lang,
    IS_NUM = Y_LANG.isNumber,
    IS_ARRAY = Y_LANG.isArray,
    Y_DOM = Y.DOM,
    Y_SELECTOR = Y.Selector,
    DOCUMENT = Y.config.doc,
    AttributeLite = Y.AttributeLite,
	VMLShape,
	VMLCircle,
	VMLPath,
	VMLRect,
	VMLEllipse,
	VMLGraphic,
    VMLPieSlice,
    _getClassName = Y.ClassNameManager.getClassName;

function VMLDrawing() {}

/**
 * <a href="http://www.w3.org/TR/NOTE-VML">VML</a> implementation of the <a href="Drawing.html">`Drawing`</a> class.
 * `VMLDrawing` is not intended to be used directly. Instead, use the <a href="Drawing.html">`Drawing`</a> class.
 * If the browser lacks <a href="http://www.w3.org/TR/SVG/">SVG</a> and <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a>
 * capabilities, the <a href="Drawing.html">`Drawing`</a> class will point to the `VMLDrawing` class.
 *
 * @module graphics
 * @class VMLDrawing
 * @constructor
 */
VMLDrawing.prototype = {
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
     * Value for rounding up to coordsize
     *
     * @property _coordSpaceMultiplier
     * @type Number
     * @private
     */
    _coordSpaceMultiplier: 100,

    /**
     * Rounds dimensions and position values based on the coordinate space.
     *
     * @method _round
     * @param {Number} The value for rounding
     * @return Number
     * @private
     */
    _round:function(val)
    {
        return Math.round(val * this._coordSpaceMultiplier);
    },

    /**
     * Concatanates the path.
     *
     * @method _addToPath
     * @param {String} val The value to add to the path string.
     * @private
     */
    _addToPath: function(val)
    {
        this._path = this._path || "";
        if(this._movePath)
        {
            this._path += this._movePath;
            this._movePath = null;
        }
        this._path += val;
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
     * Draws a bezier curve.
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
            x,
            y,
            cp1x,
            cp1y,
            cp2x,
            cp2y,
            pts,
            right,
            left,
            bottom,
            top,
            i,
            len,
            path,
            command = relative ? " v " : " c ",
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        len = args.length - 5;
        path = command;
        for(i = 0; i < len; i = i + 6)
        {
            cp1x = parseFloat(args[i]);
            cp1y = parseFloat(args[i + 1]);
            cp2x = parseFloat(args[i + 2]);
            cp2y = parseFloat(args[i + 3]);
            x = parseFloat(args[i + 4]);
            y = parseFloat(args[i + 5]);
            if(i > 0)
            {
                path = path + ", ";
            }
            path = path +
                    this._round(cp1x) +
                    ", " +
                    this._round(cp1y) +
                    ", " +
                    this._round(cp2x) +
                    ", " +
                    this._round(cp2y) +
                    ", " +
                    this._round(x) +
                    ", " +
                    this._round(y);
            cp1x = cp1x + relativeX;
            cp1y = cp1y + relativeY;
            cp2x = cp2x + relativeX;
            cp2y = cp2y + relativeY;
            x = x + relativeX;
            y = y + relativeY;
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
        this._addToPath(path);
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
            cp1x,
            cp1y,
            cp2x,
            cp2y,
            x,
            y,
            currentX = this._currentX,
            currentY = this._currentY,
            i,
            len = args.length - 3,
            bezierArgs = [],
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        for(i = 0; i < len; i = i + 4)
        {
            cpx = parseFloat(args[i]) + relativeX;
            cpy = parseFloat(args[i + 1]) + relativeY;
            x = parseFloat(args[i + 2]) + relativeX;
            y = parseFloat(args[i + 3]) + relativeY;
            cp1x = currentX + 0.67*(cpx - currentX);
            cp1y = currentY + 0.67*(cpy - currentY);
            cp2x = cp1x + (x - currentX) * 0.34;
            cp2y = cp1y + (y - currentY) * 0.34;
            bezierArgs.push(cp1x);
            bezierArgs.push(cp1y);
            bezierArgs.push(cp2x);
            bezierArgs.push(cp2y);
            bezierArgs.push(x);
            bezierArgs.push(y);
        }
        this._curveTo.apply(this, [bezierArgs, false]);
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
        this._currentX = x;
        this._currentY = y;
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
            endAngle = 360,
            circum = radius * 2;

        endAngle *= 65535;
        this._drawingComplete = false;
        this._trackSize(x + circum, y + circum);
        this.moveTo((x + circum), (y + radius));
        this._addToPath(
            " ae " +
            this._round(x + radius) +
            ", " +
            this._round(y + radius) +
            ", " +
            this._round(radius) +
            ", " +
            this._round(radius) +
            ", " +
            startAngle +
            ", " +
            endAngle
        );
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
     * @chainable
     * @protected
     */
	drawEllipse: function(x, y, w, h) {
        var startAngle = 0,
            endAngle = 360,
            radius = w * 0.5,
            yRadius = h * 0.5;
        endAngle *= 65535;
        this._drawingComplete = false;
        this._trackSize(x + w, y + h);
        this.moveTo((x + w), (y + yRadius));
        this._addToPath(
            " ae " +
            this._round(x + radius) +
            ", " +
            this._round(x + radius) +
            ", " +
            this._round(y + yRadius) +
            ", " +
            this._round(radius) +
            ", " +
            this._round(yRadius) +
            ", " +
            startAngle +
            ", " +
            endAngle
        );
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
    drawWedge: function(x, y, startAngle, arc, radius)
    {
        var diameter = radius * 2;
        if(Math.abs(arc) > 360)
        {
            arc = 360;
        }
        this._currentX = x;
        this._currentY = y;
        startAngle *= -65535;
        arc *= 65536;
        startAngle = Math.round(startAngle);
        arc = Math.round(arc);
        this.moveTo(x, y);
        this._addToPath(
            " ae " +
            this._round(x) +
            ", " +
            this._round(y) +
            ", " +
            this._round(radius) +
            " " +
            this._round(radius) +
            ", " +
            startAngle +
            ", " +
            arc
        );
        this._trackSize(diameter, diameter);
        return this;
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
     * Draws a line segment using the current line style from the current drawing position to the relative x and y coordinates.
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
    _lineTo: function(args, relative) {
        var point1 = args[0],
            i,
            len,
            x,
            y,
            path = relative ? " r " : " l ",
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        if (typeof point1 === "string" || typeof point1 === "number") {
            len = args.length - 1;
            for (i = 0; i < len; i = i + 2) {
                x = parseFloat(args[i]);
                y = parseFloat(args[i + 1]);
                path += ' ' + this._round(x) + ', ' + this._round(y);
                x = x + relativeX;
                y = y + relativeY;
                this._currentX = x;
                this._currentY = y;
                this._trackSize.apply(this, [x, y]);
            }
        }
        else
        {
            len = args.length;
            for (i = 0; i < len; i = i + 1) {
                x = parseFloat(args[i][0]);
                y = parseFloat(args[i][1]);
                path += ' ' + this._round(x) + ', ' + this._round(y);
                x = x + relativeX;
                y = y + relativeY;
                this._currentX = x;
                this._currentY = y;
                this._trackSize.apply(this, [x, y]);
            }
        }
        this._addToPath(path);
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
        var x = parseFloat(args[0]),
            y = parseFloat(args[1]),
            command = relative ? " t " : " m ",
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        this._movePath = command + this._round(x) + ", " + this._round(y);
        x = x + relativeX;
        y = y + relativeY;
        this._trackSize(x, y);
        this._currentX = x;
        this._currentY = y;
    },

    /**
     * Draws the graphic.
     *
     * @method _draw
     * @private
     */
    _closePath: function()
    {
        var fill = this.get("fill"),
            stroke = this.get("stroke"),
            node = this.node,
            w = this.get("width"),
            h = this.get("height"),
            path = this._path,
            pathEnd = "",
            multiplier = this._coordSpaceMultiplier;
        this._fillChangeHandler();
        this._strokeChangeHandler();
        if(path)
        {
            if(fill && fill.color)
            {
                pathEnd += ' x';
            }
            if(stroke)
            {
                pathEnd += ' e';
            }
        }
        if(path)
        {
            node.path = path + pathEnd;
        }
        if(!isNaN(w) && !isNaN(h))
        {
            node.coordOrigin = this._left + ", " + this._top;
            node.coordSize = (w * multiplier) + ", " + (h * multiplier);
            node.style.position = "absolute";
            node.style.width =  w + "px";
            node.style.height =  h + "px";
        }
        this._path = path;
        this._movePath = null;
        this._updateTransform();
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
        this._addToPath(" x e");
        return this;
    },

    /**
     * Clears the path.
     *
     * @method clear
     * @chainable
     */
    clear: function()
    {
		this._right = 0;
        this._bottom = 0;
        this._width = 0;
        this._height = 0;
        this._left = 0;
        this._top = 0;
        this._path = "";
        this._movePath = null;
        return this;
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
    },

    _left: 0,

    _right: 0,

    _top: 0,

    _bottom: 0,

    _width: 0,

    _height: 0
};
Y.VMLDrawing = VMLDrawing;
