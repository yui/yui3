if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/graphics-canvas/graphics-canvas.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/graphics-canvas/graphics-canvas.js",
    code: []
};
_yuitest_coverage["build/graphics-canvas/graphics-canvas.js"].code=["YUI.add('graphics-canvas', function (Y, NAME) {","","var IMPLEMENTATION = \"canvas\",","    SHAPE = \"shape\",","	SPLITPATHPATTERN = /[a-z][^a-z]*/ig,","    SPLITARGSPATTERN = /[-]?[0-9]*[0-9|\\.][0-9]*/g,","    DOCUMENT = Y.config.doc,","    Y_LANG = Y.Lang,","    AttributeLite = Y.AttributeLite,","	CanvasShape,","	CanvasPath,","	CanvasRect,","    CanvasEllipse,","	CanvasCircle,","    CanvasPieSlice,","    Y_DOM = Y.DOM,","    Y_Color = Y.Color,","    PARSE_INT = parseInt,","    PARSE_FLOAT = parseFloat,","    IS_NUMBER = Y_LANG.isNumber,","    RE = RegExp,","    TORGB = Y_Color.toRGB,","    TOHEX = Y_Color.toHex,","    _getClassName = Y.ClassNameManager.getClassName;","","/**"," * <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> implementation of the <a href=\"Drawing.html\">`Drawing`</a> class. "," * `CanvasDrawing` is not intended to be used directly. Instead, use the <a href=\"Drawing.html\">`Drawing`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities but has "," * <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> capabilities, the <a href=\"Drawing.html\">`Drawing`</a> "," * class will point to the `CanvasDrawing` class."," *"," * @module graphics"," * @class CanvasDrawing"," * @constructor"," */","function CanvasDrawing()","{","}","","CanvasDrawing.prototype = {","    /**","     * Maps path to methods","     *","     * @property _pathSymbolToMethod","     * @type Object","     * @private","     */","    _pathSymbolToMethod: {","        M: \"moveTo\",","        m: \"relativeMoveTo\",","        L: \"lineTo\",","        l: \"relativeLineTo\",","        C: \"curveTo\",","        c: \"relativeCurveTo\",","        Q: \"quadraticCurveTo\",","        q: \"relativeQuadraticCurveTo\",","        z: \"closePath\",","        Z: \"closePath\"","    },","","    /**","     * Current x position of the drawing.","     *","     * @property _currentX","     * @type Number","     * @private","     */","    _currentX: 0,","","    /**","     * Current y position of the drqwing.","     *","     * @property _currentY","     * @type Number","     * @private","     */","    _currentY: 0,","    ","    /**","     * Parses hex color string and alpha value to rgba","     *","     * @method _toRGBA","     * @param {Object} val Color value to parse. Can be hex string, rgb or name.","     * @param {Number} alpha Numeric value between 0 and 1 representing the alpha level.","     * @private","     */","    _toRGBA: function(val, alpha) {","        alpha = (alpha !== undefined) ? alpha : 1;","        if (!Y_Color.re_RGB.test(val)) {","            val = TOHEX(val);","        }","","        if(Y_Color.re_hex.exec(val)) {","            val = 'rgba(' + [","                PARSE_INT(RE.$1, 16),","                PARSE_INT(RE.$2, 16),","                PARSE_INT(RE.$3, 16)","            ].join(',') + ',' + alpha + ')';","        }","        return val;","    },","","    /**","     * Converts color to rgb format","     *","     * @method _toRGB","     * @param val Color value to convert.","     * @private ","     */","    _toRGB: function(val) {","        return TORGB(val);","    },","","    /**","     * Sets the size of the graphics object.","     * ","     * @method setSize","     * @param w {Number} width to set for the instance.","     * @param h {Number} height to set for the instance.","     * @private","     */","	setSize: function(w, h) {","        if(this.get(\"autoSize\"))","        {","            if(w > this.node.getAttribute(\"width\"))","            {","                this.node.style.width = w + \"px\";","                this.node.setAttribute(\"width\", w);","            }","            if(h > this.node.getAttribute(\"height\"))","            {","                this.node.style.height = h + \"px\";","                this.node.setAttribute(\"height\", h);","            }","        }","    },","    ","	/**","     * Tracks coordinates. Used to calculate the start point of dashed lines. ","     *","     * @method _updateCoords","     * @param {Number} x x-coordinate","     * @param {Number} y y-coordinate","	 * @private","	 */","    _updateCoords: function(x, y)","    {","        this._xcoords.push(x);","        this._ycoords.push(y);","        this._currentX = x;","        this._currentY = y;","    },","","	/**","     * Clears the coordinate arrays. Called at the end of a drawing operation.  ","	 * ","     * @method _clearAndUpdateCoords","     * @private","	 */","    _clearAndUpdateCoords: function()","    {","        var x = this._xcoords.pop() || 0,","            y = this._ycoords.pop() || 0;","        this._updateCoords(x, y);","    },","","	/**","     * Moves the shape's dom node.","     *","     * @method _updateNodePosition","	 * @private","	 */","    _updateNodePosition: function()","    {","        var node = this.get(\"node\"),","            x = this.get(\"x\"),","            y = this.get(\"y\"); ","        node.style.position = \"absolute\";","        node.style.left = (x + this._left) + \"px\";","        node.style.top = (y + this._top) + \"px\";","    },","    ","    /**","     * Queues up a method to be executed when a shape redraws.","     *","     * @method _updateDrawingQueue","     * @param {Array} val An array containing data that can be parsed into a method and arguments. The value at zero-index of the array is a string reference of","     * the drawing method that will be called. All subsequent indices are argument for that method. For example, `lineTo(10, 100)` would be structured as:","     * `[\"lineTo\", 10, 100]`.","     * @private","     */","    _updateDrawingQueue: function(val)","    {","        this._methods.push(val);","    },","    ","    /**","     * Draws a line segment from the current drawing position to the specified x and y coordinates.","     * ","     * @method lineTo","     * @param {Number} point1 x-coordinate for the end point.","     * @param {Number} point2 y-coordinate for the end point.","     */","    lineTo: function()","    {","        this._lineTo.apply(this, [Y.Array(arguments), false]);","    },","","    /**","     * Draws a line segment from the current drawing position to the relative x and y coordinates.","     * ","     * @method lineTo","     * @param {Number} point1 x-coordinate for the end point.","     * @param {Number} point2 y-coordinate for the end point.","     */","    relativeLineTo: function()","    {","        this._lineTo.apply(this, [Y.Array(arguments), true]);","    },","","    /**","     * Implements lineTo methods.","     *","     * @method _lineTo","     * @param {Array} args The arguments to be used.","     * @param {Boolean} relative Indicates whether or not to use relative coordinates.","     * @private","     */","    _lineTo: function(args, relative) ","    {","        var point1 = args[0], ","            i, ","            len,","            x,","            y,","            wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0,","            relativeX = relative ? parseFloat(this._currentX) : 0,","            relativeY = relative ? parseFloat(this._currentY) : 0;","        if(!this._lineToMethods)","        {","            this._lineToMethods = [];","        }","        len = args.length - 1;","        if (typeof point1 === 'string' || typeof point1 === 'number') {","            for (i = 0; i < len; i = i + 2) {","                x = parseFloat(args[i]);","                y = parseFloat(args[i + 1]);","                x = x + relativeX;","                y = y + relativeY;","                this._updateDrawingQueue([\"lineTo\", x, y]);","                this._trackSize(x - wt, y - wt);","                this._trackSize(x + wt, y + wt);","                this._updateCoords(x, y);","            }","        }","        else","        {","            for (i = 0; i < len; i = i + 1) ","            {","                x = parseFloat(args[i][0]);","                y = parseFloat(args[i][1]);","                this._updateDrawingQueue([\"lineTo\", x, y]);","                this._lineToMethods[this._lineToMethods.length] = this._methods[this._methods.length - 1];","                this._trackSize(x - wt, y - wt);","                this._trackSize(x + wt, y + wt);","                this._updateCoords(x, y);","            }","        }","        this._drawingComplete = false;","        return this;","    },","","    /**","     * Moves the current drawing position to specified x and y coordinates.","     *","     * @method moveTo","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    moveTo: function()","    {","        this._moveTo.apply(this, [Y.Array(arguments), false]);","    },","","    /**","     * Moves the current drawing position relative to specified x and y coordinates.","     *","     * @method relativeMoveTo","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    relativeMoveTo: function()","    {","        this._moveTo.apply(this, [Y.Array(arguments), true]);","    },","","    /**","     * Implements moveTo methods.","     *","     * @method _moveTo","     * @param {Array} args The arguments to be used.","     * @param {Boolean} relative Indicates whether or not to use relative coordinates.","     * @private","     */","    _moveTo: function(args, relative) {","        var wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0,","            relativeX = relative ? parseFloat(this._currentX) : 0,","            relativeY = relative ? parseFloat(this._currentY) : 0,","            x = parseFloat(args[0]) + relativeX,","            y = parseFloat(args[1]) + relativeY;","        this._updateDrawingQueue([\"moveTo\", x, y]);","        this._trackSize(x - wt, y - wt);","        this._trackSize(x + wt, y + wt);","        this._updateCoords(x, y);","        this._drawingComplete = false;","        return this;","    },","    ","    /**","     * Draws a bezier curve.","     *","     * @method curveTo","     * @param {Number} cp1x x-coordinate for the first control point.","     * @param {Number} cp1y y-coordinate for the first control point.","     * @param {Number} cp2x x-coordinate for the second control point.","     * @param {Number} cp2y y-coordinate for the second control point.","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    curveTo: function() {","        this._curveTo.apply(this, [Y.Array(arguments), false]);","    },","","    /**","     * Draws a bezier curve relative to the current coordinates.","     *","     * @method curveTo","     * @param {Number} cp1x x-coordinate for the first control point.","     * @param {Number} cp1y y-coordinate for the first control point.","     * @param {Number} cp2x x-coordinate for the second control point.","     * @param {Number} cp2y y-coordinate for the second control point.","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    relativeCurveTo: function() {","        this._curveTo.apply(this, [Y.Array(arguments), true]);","    },","    ","    /**","     * Implements curveTo methods.","     *","     * @method _curveTo","     * @param {Array} args The arguments to be used.","     * @param {Boolean} relative Indicates whether or not to use relative coordinates.","     * @private","     */","    _curveTo: function(args, relative) {","        var w,","            h,","            pts,","            right,","            left,","            bottom,","            top,","            i = 0,","            len,","            relativeX = relative ? parseFloat(this._currentX) : 0,","            relativeY = relative ? parseFloat(this._currentY) : 0;","        len = args.length - 5;","        for(; i < len; i = i + 6)","        {","            cp1x = parseFloat(args[i]) + relativeX;","            cp1y = parseFloat(args[i + 1]) + relativeY;","            cp2x = parseFloat(args[i + 2]) + relativeX;","            cp2y = parseFloat(args[i + 3]) + relativeY;","            x = parseFloat(args[i + 4]) + relativeX;","            y = parseFloat(args[i + 5]) + relativeY;","            this._updateDrawingQueue([\"bezierCurveTo\", cp1x, cp1y, cp2x, cp2y, x, y]);","            this._drawingComplete = false;","            right = Math.max(x, Math.max(cp1x, cp2x));","            bottom = Math.max(y, Math.max(cp1y, cp2y));","            left = Math.min(x, Math.min(cp1x, cp2x));","            top = Math.min(y, Math.min(cp1y, cp2y));","            w = Math.abs(right - left);","            h = Math.abs(bottom - top);","            pts = [[this._currentX, this._currentY] , [cp1x, cp1y], [cp2x, cp2y], [x, y]]; ","            this._setCurveBoundingBox(pts, w, h);","            this._currentX = x;","            this._currentY = y;","        }","    },","","    /**","     * Draws a quadratic bezier curve.","     *","     * @method quadraticCurveTo","     * @param {Number} cpx x-coordinate for the control point.","     * @param {Number} cpy y-coordinate for the control point.","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    quadraticCurveTo: function() {","        this._quadraticCurveTo.apply(this, [Y.Array(arguments), false]);","    },","","    /**","     * Draws a quadratic bezier curve relative to the current position.","     *","     * @method relativeQuadraticCurveTo","     * @param {Number} cpx x-coordinate for the control point.","     * @param {Number} cpy y-coordinate for the control point.","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    relativeQuadraticCurveTo: function() {","        this._quadraticCurveTo.apply(this, [Y.Array(arguments), true]);","    },","","    /**","     * Implements quadraticCurveTo methods.","     *","     * @method _quadraticCurveTo","     * @param {Array} args The arguments to be used.","     * @param {Boolean} relative Indicates whether or not to use relative coordinates.","     * @private","     */","    _quadraticCurveTo: function(args, relative) {","        var cpx, ","            cpy, ","            x, ","            y,","            w,","            h,","            pts,","            right,","            left,","            bottom,","            top,","            i = 0,","            len = args.length - 3,","            wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0,","            relativeX = relative ? parseFloat(this._currentX) : 0,","            relativeY = relative ? parseFloat(this._currentY) : 0;","        for(; i < len; i = i + 4)","        {","            cpx = parseFloat(args[i]) + relativeX;","            cpy = parseFloat(args[i + 1]) + relativeY;","            x = parseFloat(args[i + 2]) + relativeX;","            y = parseFloat(args[i + 3]) + relativeY;","            this._drawingComplete = false;","            right = Math.max(x, cpx);","            bottom = Math.max(y, cpy);","            left = Math.min(x, cpx);","            top = Math.min(y, cpy);","            w = Math.abs(right - left);","            h = Math.abs(bottom - top);","            pts = [[this._currentX, this._currentY] , [cpx, cpy], [x, y]]; ","            this._setCurveBoundingBox(pts, w, h);","            this._updateDrawingQueue([\"quadraticCurveTo\", cpx, cpy, x, y]);","            this._updateCoords(x, y);","        }","        return this;","    },","","    /**","     * Draws a circle. Used internally by `CanvasCircle` class.","     *","     * @method drawCircle","     * @param {Number} x y-coordinate","     * @param {Number} y x-coordinate","     * @param {Number} r radius","     * @protected","     */","	drawCircle: function(x, y, radius) {","        var startAngle = 0,","            endAngle = 2 * Math.PI,","            wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0,","            circum = radius * 2;","            circum += wt;","        this._drawingComplete = false;","        this._trackSize(x + circum, y + circum);","        this._trackSize(x - wt, y - wt);","        this._updateCoords(x, y);","        this._updateDrawingQueue([\"arc\", x + radius, y + radius, radius, startAngle, endAngle, false]);","        return this;","    },","","    /**","     * Draws a diamond.     ","     * ","     * @method drawDiamond","     * @param {Number} x y-coordinate","     * @param {Number} y x-coordinate","     * @param {Number} width width","     * @param {Number} height height","     * @protected","     */","    drawDiamond: function(x, y, width, height)","    {","        var midWidth = width * 0.5,","            midHeight = height * 0.5;","        this.moveTo(x + midWidth, y);","        this.lineTo(x + width, y + midHeight);","        this.lineTo(x + midWidth, y + height);","        this.lineTo(x, y + midHeight);","        this.lineTo(x + midWidth, y);","        return this;","    },","","    /**","     * Draws an ellipse. Used internally by `CanvasEllipse` class.","     *","     * @method drawEllipse","     * @param {Number} x x-coordinate","     * @param {Number} y y-coordinate","     * @param {Number} w width","     * @param {Number} h height","     * @protected","     */","	drawEllipse: function(x, y, w, h) {","        var l = 8,","            theta = -(45/180) * Math.PI,","            angle = 0,","            angleMid,","            radius = w/2,","            yRadius = h/2,","            i = 0,","            centerX = x + radius,","            centerY = y + yRadius,","            ax, ay, bx, by, cx, cy,","            wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0;","","        ax = centerX + Math.cos(0) * radius;","        ay = centerY + Math.sin(0) * yRadius;","        this.moveTo(ax, ay);","        for(; i < l; i++)","        {","            angle += theta;","            angleMid = angle - (theta / 2);","            bx = centerX + Math.cos(angle) * radius;","            by = centerY + Math.sin(angle) * yRadius;","            cx = centerX + Math.cos(angleMid) * (radius / Math.cos(theta / 2));","            cy = centerY + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));","            this._updateDrawingQueue([\"quadraticCurveTo\", cx, cy, bx, by]);","        }","        this._trackSize(x + w + wt, y + h + wt);","        this._trackSize(x - wt, y - wt);","        this._updateCoords(x, y);","        return this;","    },","","    /**","     * Draws a rectangle.","     *","     * @method drawRect","     * @param {Number} x x-coordinate","     * @param {Number} y y-coordinate","     * @param {Number} w width","     * @param {Number} h height","     */","    drawRect: function(x, y, w, h) {","        var wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0;","        this._drawingComplete = false;","        this.moveTo(x, y);","        this.lineTo(x + w, y);","        this.lineTo(x + w, y + h);","        this.lineTo(x, y + h);","        this.lineTo(x, y);","        return this;","    },","","    /**","     * Draws a rectangle with rounded corners.","     * ","     * @method drawRect","     * @param {Number} x x-coordinate","     * @param {Number} y y-coordinate","     * @param {Number} w width","     * @param {Number} h height","     * @param {Number} ew width of the ellipse used to draw the rounded corners","     * @param {Number} eh height of the ellipse used to draw the rounded corners","     */","    drawRoundRect: function(x, y, w, h, ew, eh) {","        var wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0;","        this._drawingComplete = false;","        this.moveTo( x, y + eh);","        this.lineTo(x, y + h - eh);","        this.quadraticCurveTo(x, y + h, x + ew, y + h);","        this.lineTo(x + w - ew, y + h);","        this.quadraticCurveTo(x + w, y + h, x + w, y + h - eh);","        this.lineTo(x + w, y + eh);","        this.quadraticCurveTo(x + w, y, x + w - ew, y);","        this.lineTo(x + ew, y);","        this.quadraticCurveTo(x, y, x, y + eh);","        return this;","    },","    ","    /**","     * Draws a wedge.","     *","     * @method drawWedge","     * @param {Number} x x-coordinate of the wedge's center point","     * @param {Number} y y-coordinate of the wedge's center point","     * @param {Number} startAngle starting angle in degrees","     * @param {Number} arc sweep of the wedge. Negative values draw clockwise.","     * @param {Number} radius radius of wedge. If [optional] yRadius is defined, then radius is the x radius.","     * @param {Number} yRadius [optional] y radius for wedge.","     * @private","     */","    drawWedge: function(x, y, startAngle, arc, radius, yRadius)","    {","        var wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0,","            segs,","            segAngle,","            theta,","            angle,","            angleMid,","            ax,","            ay,","            bx,","            by,","            cx,","            cy,","            i = 0;","        yRadius = yRadius || radius;","","        this._drawingComplete = false;","        // move to x,y position","        this._updateDrawingQueue([\"moveTo\", x, y]);","        ","        yRadius = yRadius || radius;","        ","        // limit sweep to reasonable numbers","        if(Math.abs(arc) > 360)","        {","            arc = 360;","        }","        ","        // First we calculate how many segments are needed","        // for a smooth arc.","        segs = Math.ceil(Math.abs(arc) / 45);","        ","        // Now calculate the sweep of each segment.","        segAngle = arc / segs;","        ","        // The math requires radians rather than degrees. To convert from degrees","        // use the formula (degrees/180)*Math.PI to get radians.","        theta = -(segAngle / 180) * Math.PI;","        ","        // convert angle startAngle to radians","        angle = (startAngle / 180) * Math.PI;","        ","        // draw the curve in segments no larger than 45 degrees.","        if(segs > 0)","        {","            // draw a line from the center to the start of the curve","            ax = x + Math.cos(startAngle / 180 * Math.PI) * radius;","            ay = y + Math.sin(startAngle / 180 * Math.PI) * yRadius;","            this.lineTo(ax, ay);","            // Loop for drawing curve segments","            for(; i < segs; ++i)","            {","                angle += theta;","                angleMid = angle - (theta / 2);","                bx = x + Math.cos(angle) * radius;","                by = y + Math.sin(angle) * yRadius;","                cx = x + Math.cos(angleMid) * (radius / Math.cos(theta / 2));","                cy = y + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));","                this._updateDrawingQueue([\"quadraticCurveTo\", cx, cy, bx, by]);","            }","            // close the wedge by drawing a line to the center","            this._updateDrawingQueue([\"lineTo\", x, y]);","        }","        this._trackSize(0 - wt , 0 - wt);","        this._trackSize((radius * 2) + wt, (radius * 2) + wt);","        return this;","    },","    ","    /**","     * Completes a drawing operation. ","     *","     * @method end","     */","    end: function() {","        this._closePath();","        return this;","    },","","    /**","     * Ends a fill and stroke","     *","     * @method closePath","     */","    closePath: function()","    {","        this._updateDrawingQueue([\"closePath\"]);","        this._updateDrawingQueue([\"beginPath\"]);","    },","","	/**","	 * Clears the graphics object.","	 *","	 * @method clear","	 */","    ","    /**","     * Returns a linear gradient fill","     *","     * @method _getLinearGradient","     * @return CanvasGradient","     * @private","     */","    _getLinearGradient: function() {","        var isNumber = Y.Lang.isNumber,","            fill = this.get(\"fill\"),","            stops = fill.stops,","            opacity,","            color,","            stop,","            i = 0,","            len = stops.length,","            gradient,","            x = 0,","            y = 0,","            w = this.get(\"width\"),","            h = this.get(\"height\"),","            r = fill.rotation || 0,","            x1, x2, y1, y2,","            cx = x + w/2,","            cy = y + h/2,","            offset,","            radCon = Math.PI/180,","            tanRadians = parseFloat(parseFloat(Math.tan(r * radCon)).toFixed(8));","        if(Math.abs(tanRadians) * w/2 >= h/2)","        {","            if(r < 180)","            {","                y1 = y;","                y2 = y + h;","            }","            else","            {","                y1 = y + h;","                y2 = y;","            }","            x1 = cx - ((cy - y1)/tanRadians);","            x2 = cx - ((cy - y2)/tanRadians); ","        }","        else","        {","            if(r > 90 && r < 270)","            {","                x1 = x + w;","                x2 = x;","            }","            else","            {","                x1 = x;","                x2 = x + w;","            }","            y1 = ((tanRadians * (cx - x1)) - cy) * -1;","            y2 = ((tanRadians * (cx - x2)) - cy) * -1;","        }","        gradient = this._context.createLinearGradient(x1, y1, x2, y2);","        for(; i < len; ++i)","        {","            stop = stops[i];","            opacity = stop.opacity;","            color = stop.color;","            offset = stop.offset;","            if(isNumber(opacity))","            {","                opacity = Math.max(0, Math.min(1, opacity));","                color = this._toRGBA(color, opacity);","            }","            else","            {","                color = TORGB(color);","            }","            offset = stop.offset || i/(len - 1);","            gradient.addColorStop(offset, color);","        }","        return gradient;","    },","","    /**","     * Returns a radial gradient fill","     *","     * @method _getRadialGradient","     * @return CanvasGradient","     * @private","     */","    _getRadialGradient: function() {","        var isNumber = Y.Lang.isNumber,","            fill = this.get(\"fill\"),","            r = fill.r,","            fx = fill.fx,","            fy = fill.fy,","            stops = fill.stops,","            opacity,","            color,","            stop,","            i = 0,","            len = stops.length,","            gradient,","            x = 0,","            y = 0,","            w = this.get(\"width\"),","            h = this.get(\"height\"),","            x1, x2, y1, y2, r2, ","            xc, yc, xn, yn, d, ","            offset,","            ratio,","            stopMultiplier;","        xc = x + w/2;","        yc = y + h/2;","        x1 = w * fx;","        y1 = h * fy;","        x2 = x + w/2;","        y2 = y + h/2;","        r2 = w * r;","        d = Math.sqrt( Math.pow(Math.abs(xc - x1), 2) + Math.pow(Math.abs(yc - y1), 2) );","        if(d >= r2)","        {","            ratio = d/r2;","            //hack. gradient won't show if it is exactly on the edge of the arc","            if(ratio === 1)","            {","                ratio = 1.01;","            }","            xn = (x1 - xc)/ratio;","            yn = (y1 - yc)/ratio;","            xn = xn > 0 ? Math.floor(xn) : Math.ceil(xn);","            yn = yn > 0 ? Math.floor(yn) : Math.ceil(yn);","            x1 = xc + xn;","            y1 = yc + yn;","        }","        ","        //If the gradient radius is greater than the circle's, adjusting the radius stretches the gradient properly.","        //If the gradient radius is less than the circle's, adjusting the radius of the gradient will not work. ","        //Instead, adjust the color stops to reflect the smaller radius.","        if(r >= 0.5)","        {","            gradient = this._context.createRadialGradient(x1, y1, r, x2, y2, r * w);","            stopMultiplier = 1;","        }","        else","        {","            gradient = this._context.createRadialGradient(x1, y1, r, x2, y2, w/2);","            stopMultiplier = r * 2;","        }","        for(; i < len; ++i)","        {","            stop = stops[i];","            opacity = stop.opacity;","            color = stop.color;","            offset = stop.offset;","            if(isNumber(opacity))","            {","                opacity = Math.max(0, Math.min(1, opacity));","                color = this._toRGBA(color, opacity);","            }","            else","            {","                color = TORGB(color);","            }","            offset = stop.offset || i/(len - 1);","            offset *= stopMultiplier;","            if(offset <= 1)","            {","                gradient.addColorStop(offset, color);","            }","        }","        return gradient;","    },","","","    /**","     * Clears all values","     *","     * @method _initProps","     * @private","     */","    _initProps: function() {","        this._methods = [];","        this._lineToMethods = [];","        this._xcoords = [0];","		this._ycoords = [0];","		this._width = 0;","        this._height = 0;","        this._left = 0;","        this._top = 0;","        this._right = 0;","        this._bottom = 0;","        this._currentX = 0;","        this._currentY = 0;","    },","   ","    /**","     * Indicates a drawing has completed.","     *","     * @property _drawingComplete","     * @type Boolean","     * @private","     */","    _drawingComplete: false,","","    /**","     * Creates canvas element","     *","     * @method _createGraphic","     * @return HTMLCanvasElement","     * @private","     */","    _createGraphic: function(config) {","        var graphic = Y.config.doc.createElement('canvas');","        return graphic;","    },","    ","    /**","     * Returns the points on a curve","     *","     * @method getBezierData","     * @param Array points Array containing the begin, end and control points of a curve.","     * @param Number t The value for incrementing the next set of points.","     * @return Array","     * @private","     */","    getBezierData: function(points, t) {  ","        var n = points.length,","            tmp = [],","            i,","            j;","","        for (i = 0; i < n; ++i){","            tmp[i] = [points[i][0], points[i][1]]; // save input","        }","        ","        for (j = 1; j < n; ++j) {","            for (i = 0; i < n - j; ++i) {","                tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];","                tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1]; ","            }","        }","        return [ tmp[0][0], tmp[0][1] ]; ","    },","  ","    /**","     * Calculates the bounding box for a curve","     *","     * @method _setCurveBoundingBox","     * @param Array pts Array containing points for start, end and control points of a curve.","     * @param Number w Width used to calculate the number of points to describe the curve.","     * @param Number h Height used to calculate the number of points to describe the curve.","     * @private","     */","    _setCurveBoundingBox: function(pts, w, h)","    {","        var i = 0,","            left = this._currentX,","            right = left,","            top = this._currentY,","            bottom = top,","            len = Math.round(Math.sqrt((w * w) + (h * h))),","            t = 1/len,","            wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0,","            xy;","        for(; i < len; ++i)","        {","            xy = this.getBezierData(pts, t * i);","            left = isNaN(left) ? xy[0] : Math.min(xy[0], left);","            right = isNaN(right) ? xy[0] : Math.max(xy[0], right);","            top = isNaN(top) ? xy[1] : Math.min(xy[1], top);","            bottom = isNaN(bottom) ? xy[1] : Math.max(xy[1], bottom);","        }","        left = Math.round(left * 10)/10;","        right = Math.round(right * 10)/10;","        top = Math.round(top * 10)/10;","        bottom = Math.round(bottom * 10)/10;","        this._trackSize(right + wt, bottom + wt);","        this._trackSize(left - wt, top - wt);","    },","","    /**","     * Updates the size of the graphics object","     *","     * @method _trackSize","     * @param {Number} w width","     * @param {Number} h height","     * @private","     */","    _trackSize: function(w, h) {","        if (w > this._right) {","            this._right = w;","        }","        if(w < this._left)","        {","            this._left = w;    ","        }","        if (h < this._top)","        {","            this._top = h;","        }","        if (h > this._bottom) ","        {","            this._bottom = h;","        }","        this._width = this._right - this._left;","        this._height = this._bottom - this._top;","    }","};","Y.CanvasDrawing = CanvasDrawing;","/**"," * <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> implementation of the <a href=\"Shape.html\">`Shape`</a> class. "," * `CanvasShape` is not intended to be used directly. Instead, use the <a href=\"Shape.html\">`Shape`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities but has "," * <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> capabilities, the <a href=\"Shape.html\">`Shape`</a> "," * class will point to the `CanvasShape` class."," *"," * @module graphics"," * @class CanvasShape"," * @constructor"," */","CanvasShape = function(cfg)","{","    this._transforms = [];","    this.matrix = new Y.Matrix();","    CanvasShape.superclass.constructor.apply(this, arguments);","};","","CanvasShape.NAME = \"shape\";","","Y.extend(CanvasShape, Y.GraphicBase, Y.mix({","    /**","     * Init method, invoked during construction.","     * Calls `initializer` method.","     *","     * @method init","     * @protected","     */","    init: function()","	{","		this.initializer.apply(this, arguments);","	},","","	/**","	 * Initializes the shape","	 *","	 * @private","	 * @method _initialize","	 */","	initializer: function(cfg)","	{","		var host = this,","            graphic = cfg.graphic,","            data = this.get(\"data\");","        host._initProps();","		host.createNode(); ","		host._xcoords = [0];","		host._ycoords = [0];","        if(graphic)","        {","            this._setGraphic(graphic);","        }","        if(data)","        {","            host._parsePathData(data);","        }","		host._updateHandler();","	},"," ","    /**","     * Set the Graphic instance for the shape.","     *","     * @method _setGraphic","     * @param {Graphic | Node | HTMLElement | String} render This param is used to determine the graphic instance. If it is a `Graphic` instance, it will be assigned","     * to the `graphic` attribute. Otherwise, a new Graphic instance will be created and rendered into the dom element that the render represents.","     * @private","     */","    _setGraphic: function(render)","    {","        var graphic;","        if(render instanceof Y.CanvasGraphic)","        {","		    this._graphic = render;","        }","        else","        {","            render = Y.one(render);","            graphic = new Y.CanvasGraphic({","                render: render","            });","            graphic._appendShape(this);","            this._graphic = graphic;","        }","    },","   ","	/**","	 * Add a class name to each node.","	 *","	 * @method addClass","	 * @param {String} className the class name to add to the node's class attribute ","	 */","	addClass: function(className)","	{","		var node = Y.one(this.get(\"node\"));","		node.addClass(className);","	},","	","	/**","	 * Removes a class name from each node.","	 *","	 * @method removeClass","	 * @param {String} className the class name to remove from the node's class attribute","	 */","	removeClass: function(className)","	{","		var node = Y.one(this.get(\"node\"));","		node.removeClass(className);","	},","","	/**","	 * Gets the current position of the node in page coordinates.","	 *","	 * @method getXY","	 * @return Array The XY position of the shape.","	 */","	getXY: function()","	{","		var graphic = this.get(\"graphic\"),","			parentXY = graphic.getXY(),","			x = this.get(\"x\"),","			y = this.get(\"y\");","		return [parentXY[0] + x, parentXY[1] + y];","	},","","	/**","	 * Set the position of the shape in page coordinates, regardless of how the node is positioned.","	 *","	 * @method setXY","	 * @param {Array} Contains X & Y values for new position (coordinates are page-based)","	 */","	setXY: function(xy)","	{","		var graphic = this.get(\"graphic\"),","			parentXY = graphic.getXY(),","			x = xy[0] - parentXY[0],","			y = xy[1] - parentXY[1];","		this._set(\"x\", x);","		this._set(\"y\", y);","		this._updateNodePosition(x, y);","	},","","	/**","	 * Determines whether the node is an ancestor of another HTML element in the DOM hierarchy. ","	 *","	 * @method contains","	 * @param {CanvasShape | HTMLElement} needle The possible node or descendent","	 * @return Boolean Whether or not this shape is the needle or its ancestor.","	 */","	contains: function(needle)","	{","		return needle === Y.one(this.node);","	},","","	/**","	 * Test if the supplied node matches the supplied selector.","	 *","	 * @method test","	 * @param {String} selector The CSS selector to test against.","	 * @return Boolean Wheter or not the shape matches the selector.","	 */","	test: function(selector)","	{","		return Y.one(this.get(\"node\")).test(selector);","		//return Y.Selector.test(this.node, selector);","	},","","	/**","	 * Compares nodes to determine if they match.","	 * Node instances can be compared to each other and/or HTMLElements.","	 * @method compareTo","	 * @param {HTMLElement | Node} refNode The reference node to compare to the node.","	 * @return {Boolean} True if the nodes match, false if they do not.","	 */","	compareTo: function(refNode) {","		var node = this.node;","		return node === refNode;","	},","","	/**","	 * Value function for fill attribute","	 *","	 * @method _getDefaultFill","	 * @return Object","	 * @private","	 */","	_getDefaultFill: function() {","		return {","			type: \"solid\",","			cx: 0.5,","			cy: 0.5,","			fx: 0.5,","			fy: 0.5,","			r: 0.5","		};","	},","","	/**","	 * Value function for stroke attribute","	 *","	 * @method _getDefaultStroke","	 * @return Object","	 * @private","	 */","	_getDefaultStroke: function() ","	{","		return {","			weight: 1,","			dashstyle: \"none\",","			color: \"#000\",","			opacity: 1.0","		};","	},","","	/**","	 * Left edge of the path","	 *","     * @property _left","     * @type Number","	 * @private","	 */","	_left: 0,","","	/**","	 * Right edge of the path","	 *","     * @property _right","     * @type Number","	 * @private","	 */","	_right: 0,","	","	/**","	 * Top edge of the path","	 *","     * @property _top","     * @type Number","	 * @private","	 */","	_top: 0, ","	","	/**","	 * Bottom edge of the path","	 *","     * @property _bottom","     * @type Number","	 * @private","	 */","	_bottom: 0,","","	/**","	 * Creates the dom node for the shape.","	 *","     * @method createNode","	 * @return HTMLElement","	 * @private","	 */","	createNode: function()","	{","		var host = this,","            node = Y.config.doc.createElement('canvas'),","			id = host.get(\"id\"),","            concat = host._camelCaseConcat,","            name = host.name;","		host._context = node.getContext('2d');","		node.setAttribute(\"overflow\", \"visible\");","        node.style.overflow = \"visible\";","        if(!host.get(\"visible\"))","        {","            node.style.visibility = \"hidden\";","        }","		node.setAttribute(\"id\", id);","		id = \"#\" + id;","	    host.node = node;","		host.addClass(_getClassName(SHAPE) + \" \" + _getClassName(concat(IMPLEMENTATION, SHAPE)) + \" \" + _getClassName(name) + \" \" + _getClassName(concat(IMPLEMENTATION, name))); ","	},","	","	/**","     * Overrides default `on` method. Checks to see if its a dom interaction event. If so, ","     * return an event attached to the `node` element. If not, return the normal functionality.","     *","     * @method on","     * @param {String} type event type","     * @param {Object} callback function","	 * @private","	 */","	on: function(type, fn)","	{","		if(Y.Node.DOM_EVENTS[type])","		{","			return Y.one(\"#\" +  this.get(\"id\")).on(type, fn);","		}","		return Y.on.apply(this, arguments);","	},","	","	/**","	 * Adds a stroke to the shape node.","	 *","	 * @method _strokeChangeHandler","     * @param {Object} stroke Properties of the `stroke` attribute.","	 * @private","	 */","	_setStrokeProps: function(stroke)","	{","		var color,","			weight,","			opacity,","			linejoin,","			linecap,","			dashstyle;","	    if(stroke)","        {","            color = stroke.color;","            weight = PARSE_FLOAT(stroke.weight);","            opacity = PARSE_FLOAT(stroke.opacity);","            linejoin = stroke.linejoin || \"round\";","            linecap = stroke.linecap || \"butt\";","            dashstyle = stroke.dashstyle;","            this._miterlimit = null;","            this._dashstyle = (dashstyle && Y.Lang.isArray(dashstyle) && dashstyle.length > 1) ? dashstyle : null;","            this._strokeWeight = weight;","","            if (IS_NUMBER(weight) && weight > 0) ","            {","                this._stroke = 1;","            } ","            else ","            {","                this._stroke = 0;","            }","            if (IS_NUMBER(opacity)) {","                this._strokeStyle = this._toRGBA(color, opacity);","            }","            else","            {","                this._strokeStyle = color;","            }","            this._linecap = linecap;","            if(linejoin == \"round\" || linejoin == \"bevel\")","            {","                this._linejoin = linejoin;","            }","            else","            {","                linejoin = parseInt(linejoin, 10);","                if(IS_NUMBER(linejoin))","                {","                    this._miterlimit =  Math.max(linejoin, 1);","                    this._linejoin = \"miter\";","                }","            }","        }","        else","        {","            this._stroke = 0;","        }","	},","","    /**","     * Sets the value of an attribute.","     *","     * @method set","     * @param {String|Object} name The name of the attribute. Alternatively, an object of key value pairs can ","     * be passed in to set multiple attributes at once.","     * @param {Any} value The value to set the attribute to. This value is ignored if an object is received as ","     * the name param.","     */","	set: function() ","	{","		var host = this,","			val = arguments[0];","		AttributeLite.prototype.set.apply(host, arguments);","		if(host.initialized)","		{","			host._updateHandler();","		}","	},","	","	/**","	 * Adds a fill to the shape node.","	 *","	 * @method _setFillProps ","     * @param {Object} fill Properties of the `fill` attribute.","	 * @private","	 */","	_setFillProps: function(fill)","	{","		var isNumber = IS_NUMBER,","			color,","			opacity,","			type;","        if(fill)","        {","            color = fill.color;","            type = fill.type;","            if(type == \"linear\" || type == \"radial\")","            {","                this._fillType = type;","            }","            else if(color)","            {","                opacity = fill.opacity;","                if (isNumber(opacity)) ","                {","                    opacity = Math.max(0, Math.min(1, opacity));","                    color = this._toRGBA(color, opacity);","                } ","                else ","                {","                    color = TORGB(color);","                }","","                this._fillColor = color;","                this._fillType = 'solid';","            }","            else","            {","                this._fillColor = null;","            }","        }","		else","		{","            this._fillType = null;","			this._fillColor = null;","		}","	},","","	/**","	 * Specifies a 2d translation.","	 *","	 * @method translate","	 * @param {Number} x The value to transate on the x-axis.","	 * @param {Number} y The value to translate on the y-axis.","	 */","	translate: function(x, y)","	{","		this._translateX += x;","		this._translateY += y;","		this._addTransform(\"translate\", arguments);","	},","","	/**","	 * Translates the shape along the x-axis. When translating x and y coordinates,","	 * use the `translate` method.","	 *","	 * @method translateX","	 * @param {Number} x The value to translate.","	 */","	translateX: function(x)","    {","        this._translateX += x;","        this._addTransform(\"translateX\", arguments);","    },","","	/**","	 * Performs a translate on the y-coordinate. When translating x and y coordinates,","	 * use the `translate` method.","	 *","	 * @method translateY","	 * @param {Number} y The value to translate.","	 */","	translateY: function(y)","    {","        this._translateY += y;","        this._addTransform(\"translateY\", arguments);","    },","","    /**","     * Skews the shape around the x-axis and y-axis.","     *","     * @method skew","     * @param {Number} x The value to skew on the x-axis.","     * @param {Number} y The value to skew on the y-axis.","     */","    skew: function(x, y)","    {","        this._addTransform(\"skew\", arguments);","    },","","	/**","	 * Skews the shape around the x-axis.","	 *","	 * @method skewX","	 * @param {Number} x x-coordinate","	 */","	 skewX: function(x)","	 {","		this._addTransform(\"skewX\", arguments);","	 },","","	/**","	 * Skews the shape around the y-axis.","	 *","	 * @method skewY","	 * @param {Number} y y-coordinate","	 */","	 skewY: function(y)","	 {","		this._addTransform(\"skewY\", arguments);","	 },","","	/**","	 * Rotates the shape clockwise around it transformOrigin.","	 *","	 * @method rotate","	 * @param {Number} deg The degree of the rotation.","	 */","	 rotate: function(deg)","	 {","		this._rotation = deg;","		this._addTransform(\"rotate\", arguments);","	 },","","	/**","	 * Specifies a 2d scaling operation.","	 *","	 * @method scale","	 * @param {Number} val","	 */","	scale: function(x, y)","	{","		this._addTransform(\"scale\", arguments);","	},","	","    /**","     * Storage for `rotation` atribute.","     *","     * @property _rotation","     * @type Number","	 * @private","	 */","	_rotation: 0,","    ","    /**","     * Storage for the transform attribute.","     *","     * @property _transform","     * @type String","     * @private","     */","    _transform: \"\",","","    /**","     * Adds a transform to the shape.","     *","     * @method _addTransform","     * @param {String} type The transform being applied.","     * @param {Array} args The arguments for the transform.","	 * @private","	 */","	_addTransform: function(type, args)","	{","        args = Y.Array(args);","        this._transform = Y_LANG.trim(this._transform + \" \" + type + \"(\" + args.join(\", \") + \")\");","        args.unshift(type);","        this._transforms.push(args);","        if(this.initialized)","        {","            this._updateTransform();","        }","	},","","	/**","     * Applies all transforms.","     *","     * @method _updateTransform","	 * @private","	 */","	_updateTransform: function()","	{","		var node = this.node,","			key,","			transform,","			transformOrigin = this.get(\"transformOrigin\"),","            matrix = this.matrix,","            i = 0,","            len = this._transforms.length;","        ","        if(this._transforms && this._transforms.length > 0)","        {","            for(; i < len; ++i)","            {","                key = this._transforms[i].shift();","                if(key)","                {","                    matrix[key].apply(matrix, this._transforms[i]); ","                }","            }","            transform = matrix.toCSSText();","        }","        ","        this._graphic.addToRedrawQueue(this);    ","		transformOrigin = (100 * transformOrigin[0]) + \"% \" + (100 * transformOrigin[1]) + \"%\";","        Y_DOM.setStyle(node, \"transformOrigin\", transformOrigin);","        if(transform)","		{","            Y_DOM.setStyle(node, \"transform\", transform);","		}","        this._transforms = [];","	},","","	/**","     * Updates `Shape` based on attribute changes.","     *","     * @method _updateHandler","	 * @private","	 */","	_updateHandler: function()","	{","		this._draw();","		this._updateTransform();","	},","	","	/**","	 * Updates the shape.","	 *","	 * @method _draw","	 * @private","	 */","	_draw: function()","	{","        var node = this.node;","        this.clear();","		this._closePath();","		node.style.left = this.get(\"x\") + \"px\";","		node.style.top = this.get(\"y\") + \"px\";","	},","","	/**","	 * Completes a shape or drawing","	 *","	 * @method _closePath","	 * @private","	 */","	_closePath: function()","	{","		if(!this._methods)","		{","			return;","		}","		var node = this.get(\"node\"),","			w = this._right - this._left,","			h = this._bottom - this._top,","			context = this._context,","			methods = [],","			cachedMethods = this._methods.concat(),","			i = 0,","			j,","			method,","			args,","            argsLen,","			len = 0;","		this._context.clearRect(0, 0, node.width, node.height);","	   if(this._methods)","	   {","			len = cachedMethods.length;","			if(!len || len < 1)","			{","				return;","			}","			for(; i < len; ++i)","			{","				methods[i] = cachedMethods[i].concat();","				args = methods[i];","                argsLen = args[0] == \"quadraticCurveTo\" ? args.length : 3;","				for(j = 1; j < argsLen; ++j)","				{","					if(j % 2 === 0)","					{","						args[j] = args[j] - this._top;","					}","					else","					{","						args[j] = args[j] - this._left;","					}","				}","			}","            node.setAttribute(\"width\", Math.min(w, 2000));","            node.setAttribute(\"height\", Math.min(2000, h));","            context.beginPath();","			for(i = 0; i < len; ++i)","			{","				args = methods[i].concat();","				if(args && args.length > 0)","				{","					method = args.shift();","					if(method)","					{","                        if(method == \"closePath\")","                        {","                            context.closePath();","                            this._strokeAndFill(context);","                        }","						else if(method && method == \"lineTo\" && this._dashstyle)","						{","							args.unshift(this._xcoords[i] - this._left, this._ycoords[i] - this._top);","							this._drawDashedLine.apply(this, args);","						}","						else","						{","                            context[method].apply(context, args); ","						}","					}","				}","			}","","            this._strokeAndFill(context);","			this._drawingComplete = true;","			this._clearAndUpdateCoords();","			this._updateNodePosition();","			this._methods = cachedMethods;","		}","	},","","    /**","     * Completes a stroke and/or fill operation on the context.","     *","     * @method _strokeAndFill","     * @param {Context} Reference to the context element of the canvas instance.","     * @private","     */","    _strokeAndFill: function(context)","    {","        if (this._fillType) ","        {","            if(this._fillType == \"linear\")","            {","                context.fillStyle = this._getLinearGradient();","            }","            else if(this._fillType == \"radial\")","            {","                context.fillStyle = this._getRadialGradient();","            }","            else","            {","                context.fillStyle = this._fillColor;","            }","            context.closePath();","            context.fill();","        }","","        if (this._stroke) {","            if(this._strokeWeight)","            {","                context.lineWidth = this._strokeWeight;","            }","            context.lineCap = this._linecap;","            context.lineJoin = this._linejoin;","            if(this._miterlimit)","            {","                context.miterLimit = this._miterlimit;","            }","            context.strokeStyle = this._strokeStyle;","            context.stroke();","        }","    },","","	/**","	 * Draws a dashed line between two points.","	 * ","	 * @method _drawDashedLine","	 * @param {Number} xStart	The x position of the start of the line","	 * @param {Number} yStart	The y position of the start of the line","	 * @param {Number} xEnd		The x position of the end of the line","	 * @param {Number} yEnd		The y position of the end of the line","	 * @private","	 */","	_drawDashedLine: function(xStart, yStart, xEnd, yEnd)","	{","		var context = this._context,","			dashsize = this._dashstyle[0],","			gapsize = this._dashstyle[1],","			segmentLength = dashsize + gapsize,","			xDelta = xEnd - xStart,","			yDelta = yEnd - yStart,","			delta = Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta, 2)),","			segmentCount = Math.floor(Math.abs(delta / segmentLength)),","			radians = Math.atan2(yDelta, xDelta),","			xCurrent = xStart,","			yCurrent = yStart,","			i;","		xDelta = Math.cos(radians) * segmentLength;","		yDelta = Math.sin(radians) * segmentLength;","		","		for(i = 0; i < segmentCount; ++i)","		{","			context.moveTo(xCurrent, yCurrent);","			context.lineTo(xCurrent + Math.cos(radians) * dashsize, yCurrent + Math.sin(radians) * dashsize);","			xCurrent += xDelta;","			yCurrent += yDelta;","		}","		","		context.moveTo(xCurrent, yCurrent);","		delta = Math.sqrt((xEnd - xCurrent) * (xEnd - xCurrent) + (yEnd - yCurrent) * (yEnd - yCurrent));","		","		if(delta > dashsize)","		{","			context.lineTo(xCurrent + Math.cos(radians) * dashsize, yCurrent + Math.sin(radians) * dashsize);","		}","		else if(delta > 0)","		{","			context.lineTo(xCurrent + Math.cos(radians) * delta, yCurrent + Math.sin(radians) * delta);","		}","		","		context.moveTo(xEnd, yEnd);","	},","","	//This should move to CanvasDrawing class. ","    //Currently docmented in CanvasDrawing class.","    clear: function() {","		this._initProps();","        if(this.node) ","        {","            this._context.clearRect(0, 0, this.node.width, this.node.height);","        }","        return this;","	},","	","	/**","	 * Returns the bounds for a shape.","	 *","     * Calculates the a new bounding box from the original corner coordinates (base on size and position) and the transform matrix.","     * The calculated bounding box is used by the graphic instance to calculate its viewBox. ","     *","	 * @method getBounds","	 * @return Object","	 */","	getBounds: function()","	{","		var type = this._type,","			w = this.get(\"width\"),","			h = this.get(\"height\"),","			x = this.get(\"x\"),","			y = this.get(\"y\");","        if(type == \"path\")","        {","            x = x + this._left;","            y = y + this._top;","            w = this._right - this._left;","            h = this._bottom - this._top;","        }","        return this._getContentRect(w, h, x, y);","	},","","    /**","     * Calculates the bounding box for the shape.","     *","     * @method _getContentRect","     * @param {Number} w width of the shape","     * @param {Number} h height of the shape","     * @param {Number} x x-coordinate of the shape","     * @param {Number} y y-coordinate of the shape","     * @private","     */","    _getContentRect: function(w, h, x, y)","    {","        var transformOrigin = this.get(\"transformOrigin\"),","            transformX = transformOrigin[0] * w,","            transformY = transformOrigin[1] * h,","		    transforms = this.matrix.getTransformArray(this.get(\"transform\")),","            matrix = new Y.Matrix(),","            i = 0,","            len = transforms.length,","            transform,","            key,","            contentRect;","        if(this._type == \"path\")","        {","            transformX = transformX + x;","            transformY = transformY + y;","        }","        transformX = !isNaN(transformX) ? transformX : 0;","        transformY = !isNaN(transformY) ? transformY : 0;","        matrix.translate(transformX, transformY);","        for(; i < len; i = i + 1)","        {","            transform = transforms[i];","            key = transform.shift();","            if(key)","            {","                matrix[key].apply(matrix, transform); ","            }","        }","        matrix.translate(-transformX, -transformY);","        contentRect = matrix.getContentRect(w, h, x, y);","        return contentRect;","    },","","    /**","     * Places the shape above all other shapes.","     *","     * @method toFront","     */","    toFront: function()","    {","        var graphic = this.get(\"graphic\");","        if(graphic)","        {","            graphic._toFront(this);","        }","    },","","    /**","     * Places the shape underneath all other shapes.","     *","     * @method toFront","     */","    toBack: function()","    {","        var graphic = this.get(\"graphic\");","        if(graphic)","        {","            graphic._toBack(this);","        }","    },","","    /**","     * Parses path data string and call mapped methods.","     *","     * @method _parsePathData","     * @param {String} val The path data","     * @private","     */","    _parsePathData: function(val)","    {","        var method,","            methodSymbol,","            args,","            commandArray = Y.Lang.trim(val.match(SPLITPATHPATTERN)),","            i = 0,","            len, ","            str,","            symbolToMethod = this._pathSymbolToMethod;","        if(commandArray)","        {","            this.clear();","            len = commandArray.length || 0;","            for(; i < len; i = i + 1)","            {","                str = commandArray[i];","                methodSymbol = str.substr(0, 1),","                args = str.substr(1).match(SPLITARGSPATTERN);","                method = symbolToMethod[methodSymbol];","                if(method)","                {","                    if(args)","                    {","                        this[method].apply(this, args);","                    }","                    else","                    {","                        this[method].apply(this);","                    }","                }","            }","            this.end();","        }","    },","    ","    /**","     * Destroys the shape instance.","     *","     * @method destroy","     */","    destroy: function()","    {","        var graphic = this.get(\"graphic\");","        if(graphic)","        {","            graphic.removeShape(this);","        }","        else","        {","            this._destroy();","        }","    },","","    /**","     *  Implementation for shape destruction","     *","     *  @method destroy","     *  @protected","     */","    _destroy: function()","    {","        if(this.node)","        {","            Y.one(this.node).remove(true);","            this._context = null;","            this.node = null;","        }","    }","}, Y.CanvasDrawing.prototype));","","CanvasShape.ATTRS =  {","	/**","	 * An array of x, y values which indicates the transformOrigin in which to rotate the shape. Valid values range between 0 and 1 representing a ","	 * fraction of the shape's corresponding bounding box dimension. The default value is [0.5, 0.5].","	 *","	 * @config transformOrigin","	 * @type Array","	 */","	transformOrigin: {","		valueFn: function()","		{","			return [0.5, 0.5];","		}","	},","	","    /**","     * <p>A string containing, in order, transform operations applied to the shape instance. The `transform` string can contain the following values:","     *     ","     *    <dl>","     *        <dt>rotate</dt><dd>Rotates the shape clockwise around it transformOrigin.</dd>","     *        <dt>translate</dt><dd>Specifies a 2d translation.</dd>","     *        <dt>skew</dt><dd>Skews the shape around the x-axis and y-axis.</dd>","     *        <dt>scale</dt><dd>Specifies a 2d scaling operation.</dd>","     *        <dt>translateX</dt><dd>Translates the shape along the x-axis.</dd>","     *        <dt>translateY</dt><dd>Translates the shape along the y-axis.</dd>","     *        <dt>skewX</dt><dd>Skews the shape around the x-axis.</dd>","     *        <dt>skewY</dt><dd>Skews the shape around the y-axis.</dd>","     *        <dt>matrix</dt><dd>Specifies a 2D transformation matrix comprised of the specified six values.</dd>      ","     *    </dl>","     * </p>","     * <p>Applying transforms through the transform attribute will reset the transform matrix and apply a new transform. The shape class also contains corresponding methods for each transform","     * that will apply the transform to the current matrix. The below code illustrates how you might use the `transform` attribute to instantiate a recangle with a rotation of 45 degrees.</p>","            var myRect = new Y.Rect({","                type:\"rect\",","                width: 50,","                height: 40,","                transform: \"rotate(45)\"","            };","     * <p>The code below would apply `translate` and `rotate` to an existing shape.</p>","    ","        myRect.set(\"transform\", \"translate(40, 50) rotate(45)\");","	 * @config transform","     * @type String  ","	 */","	transform: {","		setter: function(val)","		{","            this.matrix.init();	","		    this._transforms = this.matrix.getTransformArray(val);","            this._transform = val;","            return val;","		},","","        getter: function()","        {","            return this._transform;","        }","	},","","	/**","	 * Dom node for the shape","	 *","	 * @config node","	 * @type HTMLElement","	 * @readOnly","	 */","	node: {","		readOnly: true,","","		getter: function()","		{","			return this.node;","		}","	},","","	/**","	 * Unique id for class instance.","	 *","	 * @config id","	 * @type String","	 */","	id: {","		valueFn: function()","		{","			return Y.guid();","		},","","		setter: function(val)","		{","			var node = this.node;","			if(node)","			{","				node.setAttribute(\"id\", val);","			}","			return val;","		}","	},","","	/**","	 * Indicates the width of the shape","	 *","	 * @config width","	 * @type Number","	 */","	width: {","        value: 0","    },","","	/**","	 * Indicates the height of the shape","	 *","	 * @config height","	 * @type Number","	 */","	height: {","        value: 0","    },","","	/**","	 * Indicates the x position of shape.","	 *","	 * @config x","	 * @type Number","	 */","	x: {","		value: 0","	},","","	/**","	 * Indicates the y position of shape.","	 *","	 * @config y","	 * @type Number","	 */","	y: {","		value: 0","	},","","	/**","	 * Indicates whether the shape is visible.","	 *","	 * @config visible","	 * @type Boolean","	 */","	visible: {","		value: true,","","		setter: function(val){","			var node = this.get(\"node\"),","                visibility = val ? \"visible\" : \"hidden\";","			if(node)","            {","                node.style.visibility = visibility;","            }","			return val;","		}","	},","","	/**","	 * Contains information about the fill of the shape. ","     *  <dl>","     *      <dt>color</dt><dd>The color of the fill.</dd>","     *      <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the fill. The default value is 1.</dd>","     *      <dt>type</dt><dd>Type of fill.","     *          <dl>","     *              <dt>solid</dt><dd>Solid single color fill. (default)</dd>","     *              <dt>linear</dt><dd>Linear gradient fill.</dd>","     *              <dt>radial</dt><dd>Radial gradient fill.</dd>","     *          </dl>","     *      </dd>","     *  </dl>","     *  <p>If a `linear` or `radial` is specified as the fill type. The following additional property is used:","     *  <dl>","     *      <dt>stops</dt><dd>An array of objects containing the following properties:","     *          <dl>","     *              <dt>color</dt><dd>The color of the stop.</dd>","     *              <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the stop. The default value is 1. Note: No effect for IE 6 - 8</dd>","     *              <dt>offset</dt><dd>Number between 0 and 1 indicating where the color stop is positioned.</dd> ","     *          </dl>","     *      </dd>","     *      <p>Linear gradients also have the following property:</p>","     *      <dt>rotation</dt><dd>Linear gradients flow left to right by default. The rotation property allows you to change the flow by rotation. (e.g. A rotation of 180 would make the gradient pain from right to left.)</dd>","     *      <p>Radial gradients have the following additional properties:</p>","     *      <dt>r</dt><dd>Radius of the gradient circle.</dd>","     *      <dt>fx</dt><dd>Focal point x-coordinate of the gradient.</dd>","     *      <dt>fy</dt><dd>Focal point y-coordinate of the gradient.</dd>","     *  </dl>","     *  <p>The corresponding `SVGShape` class implements the following additional properties.</p>","     *  <dl>","     *      <dt>cx</dt><dd>","     *          <p>The x-coordinate of the center of the gradient circle. Determines where the color stop begins. The default value 0.5.</p>","     *      </dd>","     *      <dt>cy</dt><dd>","     *          <p>The y-coordinate of the center of the gradient circle. Determines where the color stop begins. The default value 0.5.</p>","     *      </dd>","     *  </dl>","     *  <p>These properties are not currently implemented in `CanvasShape` or `VMLShape`.</p> ","	 *","	 * @config fill","	 * @type Object ","	 */","	fill: {","		valueFn: \"_getDefaultFill\",","		","		setter: function(val)","		{","			var fill,","				tmpl = this.get(\"fill\") || this._getDefaultFill();","			fill = (val) ? Y.merge(tmpl, val) : null;","			if(fill && fill.color)","			{","				if(fill.color === undefined || fill.color == \"none\")","				{","					fill.color = null;","				}","			}","			this._setFillProps(fill);","			return fill;","		}","	},","","	/**","	 * Contains information about the stroke of the shape.","     *  <dl>","     *      <dt>color</dt><dd>The color of the stroke.</dd>","     *      <dt>weight</dt><dd>Number that indicates the width of the stroke.</dd>","     *      <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the stroke. The default value is 1.</dd>","     *      <dt>dashstyle</dt>Indicates whether to draw a dashed stroke. When set to \"none\", a solid stroke is drawn. When set to an array, the first index indicates the","     *  length of the dash. The second index indicates the length of gap.","     *      <dt>linecap</dt><dd>Specifies the linecap for the stroke. The following values can be specified:","     *          <dl>","     *              <dt>butt (default)</dt><dd>Specifies a butt linecap.</dd>","     *              <dt>square</dt><dd>Specifies a sqare linecap.</dd>","     *              <dt>round</dt><dd>Specifies a round linecap.</dd>","     *          </dl>","     *      </dd>","     *      <dt>linejoin</dt><dd>Specifies a linejoin for the stroke. The following values can be specified:","     *          <dl>","     *              <dt>round (default)</dt><dd>Specifies that the linejoin will be round.</dd>","     *              <dt>bevel</dt><dd>Specifies a bevel for the linejoin.</dd>","     *              <dt>miter limit</dt><dd>An integer specifying the miter limit of a miter linejoin. If you want to specify a linejoin of miter, you simply specify the limit as opposed to having","     *  separate miter and miter limit values.</dd>","     *          </dl>","     *      </dd>","     *  </dl>","	 *","	 * @config stroke","	 * @type Object","	 */","	stroke: {","		valueFn: \"_getDefaultStroke\",","","		setter: function(val)","		{","			var tmpl = this.get(\"stroke\") || this._getDefaultStroke(),","                wt;","            if(val && val.hasOwnProperty(\"weight\"))","            {","                wt = parseInt(val.weight, 10);","                if(!isNaN(wt))","                {","                    val.weight = wt;","                }","            }","			val = (val) ? Y.merge(tmpl, val) : null;","			this._setStrokeProps(val);","			return val;","		}","	},","	","	//Not used. Remove in future.","	autoSize: {","		value: false","	},","","	// Only implemented in SVG","	// Determines whether the instance will receive mouse events.","	// ","	// @config pointerEvents","	// @type string","	//","	pointerEvents: {","		value: \"visiblePainted\"","	},","","    /**","     * Represents an SVG Path string.","     *","     * @config data","     * @type String","     */","    data: {","        setter: function(val)","        {","            if(this.get(\"node\"))","            {","                this._parsePathData(val);","            }","            return val;","        }","    },","","	/**","	 * Reference to the container Graphic.","	 *","	 * @config graphic","	 * @type Graphic","	 */","	graphic: {","		readOnly: true,","","		getter: function()","		{","			return this._graphic;","		}","    }","};","Y.CanvasShape = CanvasShape;","/**"," * <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> implementation of the <a href=\"Path.html\">`Path`</a> class. "," * `CanvasPath` is not intended to be used directly. Instead, use the <a href=\"Path.html\">`Path`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities but has "," * <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> capabilities, the <a href=\"Path.html\">`Path`</a> "," * class will point to the `CanvasPath` class."," *"," * @module graphics"," * @class CanvasPath"," * @extends CanvasShape"," */","CanvasPath = function(cfg)","{","	CanvasPath.superclass.constructor.apply(this, arguments);","};","CanvasPath.NAME = \"path\";","Y.extend(CanvasPath, Y.CanvasShape, {","    /**","     * Indicates the type of shape","     *","     * @property _type","     * @type String","     * @private","     */","    _type: \"path\",","","	/**","	 * Draws the shape.","	 *","	 * @method _draw","	 * @private","	 */","    _draw: function()","    {","        this._closePath();","        this._updateTransform();","    },","","	/**","	 * Creates the dom node for the shape.","	 *","     * @method createNode","	 * @return HTMLElement","	 * @private","	 */","	createNode: function()","	{","		var host = this,","            node = Y.config.doc.createElement('canvas'),","			name = host.name,","            concat = host._camelCaseConcat,","            id = host.get(\"id\");","		host._context = node.getContext('2d');","		node.setAttribute(\"overflow\", \"visible\");","        node.setAttribute(\"pointer-events\", \"none\");","        node.style.pointerEvents = \"none\";","        node.style.overflow = \"visible\";","		node.setAttribute(\"id\", id);","		id = \"#\" + id;","		host.node = node;","		host.addClass(_getClassName(SHAPE) + \" \" + _getClassName(concat(IMPLEMENTATION, SHAPE)) + \" \" + _getClassName(name) + \" \" + _getClassName(concat(IMPLEMENTATION, name))); ","	},","","    /**","     * Completes a drawing operation. ","     *","     * @method end","     */","    end: function()","    {","        this._draw();","    }","});","","CanvasPath.ATTRS = Y.merge(Y.CanvasShape.ATTRS, {","	/**","	 * Indicates the width of the shape","	 *","	 * @config width","	 * @type Number","	 */","	width: {","		getter: function()","		{","			var offset = this._stroke && this._strokeWeight ? (this._strokeWeight * 2) : 0;","			return this._width - offset;","		},","","		setter: function(val)","		{","			this._width = val;","			return val;","		}","	},","","	/**","	 * Indicates the height of the shape","	 *","	 * @config height","	 * @type Number","	 */","	height: {","		getter: function()","		{","			var offset = this._stroke && this._strokeWeight ? (this._strokeWeight * 2) : 0;","            return this._height - offset;","		},","","		setter: function(val)","		{","			this._height = val;","			return val;","		}","	},","	","	/**","	 * Indicates the path used for the node.","	 *","	 * @config path","	 * @type String","     * @readOnly","	 */","	path: {","        readOnly: true,","","		getter: function()","		{","			return this._path;","		}","	}","});","Y.CanvasPath = CanvasPath;","/**"," * <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> implementation of the <a href=\"Rect.html\">`Rect`</a> class. "," * `CanvasRect` is not intended to be used directly. Instead, use the <a href=\"Rect.html\">`Rect`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities but has "," * <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> capabilities, the <a href=\"Rect.html\">`Rect`</a> "," * class will point to the `CanvasRect` class."," *"," * @module graphics"," * @class CanvasRect"," * @constructor"," */","CanvasRect = function()","{","	CanvasRect.superclass.constructor.apply(this, arguments);","};","CanvasRect.NAME = \"rect\";","Y.extend(CanvasRect, Y.CanvasShape, {","	/**","	 * Indicates the type of shape","	 *","	 * @property _type","	 * @type String","     * @private","	 */","	_type: \"rect\",","","	/**","	 * Draws the shape.","	 *","	 * @method _draw","	 * @private","	 */","	_draw: function()","	{","		var w = this.get(\"width\"),","			h = this.get(\"height\");","		this.clear();","        this.drawRect(0, 0, w, h);","		this._closePath();","	}","});","CanvasRect.ATTRS = Y.CanvasShape.ATTRS;","Y.CanvasRect = CanvasRect;","/**"," * <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> implementation of the <a href=\"Ellipse.html\">`Ellipse`</a> class. "," * `CanvasEllipse` is not intended to be used directly. Instead, use the <a href=\"Ellipse.html\">`Ellipse`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities but has "," * <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> capabilities, the <a href=\"Ellipse.html\">`Ellipse`</a> "," * class will point to the `CanvasEllipse` class."," *"," * @module graphics"," * @class CanvasEllipse"," * @constructor"," */","CanvasEllipse = function(cfg)","{","	CanvasEllipse.superclass.constructor.apply(this, arguments);","};","","CanvasEllipse.NAME = \"ellipse\";","","Y.extend(CanvasEllipse, CanvasShape, {","	/**","	 * Indicates the type of shape","	 *","	 * @property _type","	 * @type String","     * @private","	 */","	_type: \"ellipse\",","","	/**","     * Draws the shape.","     *","     * @method _draw","	 * @private","	 */","	_draw: function()","	{","		var w = this.get(\"width\"),","			h = this.get(\"height\");","		this.clear();","        this.drawEllipse(0, 0, w, h);","		this._closePath();","	}","});","CanvasEllipse.ATTRS = Y.merge(CanvasShape.ATTRS, {","	/**","	 * Horizontal radius for the ellipse. ","	 *","	 * @config xRadius","	 * @type Number","	 */","	xRadius: {","		setter: function(val)","		{","			this.set(\"width\", val * 2);","		},","","		getter: function()","		{","			var val = this.get(\"width\");","			if(val) ","			{","				val *= 0.5;","			}","			return val;","		}","	},","","	/**","	 * Vertical radius for the ellipse. ","	 *","	 * @config yRadius","	 * @type Number","	 * @readOnly","	 */","	yRadius: {","		setter: function(val)","		{","			this.set(\"height\", val * 2);","		},","","		getter: function()","		{","			var val = this.get(\"height\");","			if(val) ","			{","				val *= 0.5;","			}","			return val;","		}","	}","});","Y.CanvasEllipse = CanvasEllipse;","/**"," * <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> implementation of the <a href=\"Circle.html\">`Circle`</a> class. "," * `CanvasCircle` is not intended to be used directly. Instead, use the <a href=\"Circle.html\">`Circle`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities but has "," * <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> capabilities, the <a href=\"Circle.html\">`Circle`</a> "," * class will point to the `CanvasCircle` class."," *"," * @module graphics"," * @class CanvasCircle"," * @constructor"," */","CanvasCircle = function(cfg)","{","	CanvasCircle.superclass.constructor.apply(this, arguments);","};","    ","CanvasCircle.NAME = \"circle\";","","Y.extend(CanvasCircle, Y.CanvasShape, {","	/**","	 * Indicates the type of shape","	 *","	 * @property _type","	 * @type String","     * @private","	 */","	_type: \"circle\",","","	/**","     * Draws the shape.","     *","     * @method _draw","	 * @private","	 */","	_draw: function()","	{","		var radius = this.get(\"radius\");","		if(radius)","		{","            this.clear();","            this.drawCircle(0, 0, radius);","			this._closePath();","		}","	}","});","","CanvasCircle.ATTRS = Y.merge(Y.CanvasShape.ATTRS, {","	/**","	 * Indicates the width of the shape","	 *","	 * @config width","	 * @type Number","	 */","	width: {","        setter: function(val)","        {","            this.set(\"radius\", val/2);","            return val;","        },","","		getter: function()","		{","			return this.get(\"radius\") * 2;","		}","	},","","	/**","	 * Indicates the height of the shape","	 *","	 * @config height","	 * @type Number","	 */","	height: {","        setter: function(val)","        {","            this.set(\"radius\", val/2);","            return val;","        },","","		getter: function()","		{","			return this.get(\"radius\") * 2;","		}","	},","","	/**","	 * Radius of the circle","	 *","	 * @config radius","     * @type Number","	 */","	radius: {","		lazyAdd: false","	}","});","Y.CanvasCircle = CanvasCircle;","/**"," * Draws pie slices"," *"," * @module graphics"," * @class CanvasPieSlice"," * @constructor"," */","CanvasPieSlice = function()","{","	CanvasPieSlice.superclass.constructor.apply(this, arguments);","};","CanvasPieSlice.NAME = \"canvasPieSlice\";","Y.extend(CanvasPieSlice, Y.CanvasShape, {","    /**","     * Indicates the type of shape","     *","     * @property _type","     * @type String","     * @private","     */","    _type: \"path\",","","	/**","	 * Change event listener","	 *","	 * @private","	 * @method _updateHandler","	 */","	_draw: function(e)","	{","        var x = this.get(\"cx\"),","            y = this.get(\"cy\"),","            startAngle = this.get(\"startAngle\"),","            arc = this.get(\"arc\"),","            radius = this.get(\"radius\");","        this.clear();","        this._left = x;","        this._right = radius;","        this._top = y;","        this._bottom = radius;","        this.drawWedge(x, y, startAngle, arc, radius);","		this.end();","	}"," });","CanvasPieSlice.ATTRS = Y.mix({","    cx: {","        value: 0","    },","","    cy: {","        value: 0","    },","    /**","     * Starting angle in relation to a circle in which to begin the pie slice drawing.","     *","     * @config startAngle","     * @type Number","     */","    startAngle: {","        value: 0","    },","","    /**","     * Arc of the slice.","     *","     * @config arc","     * @type Number","     */","    arc: {","        value: 0","    },","","    /**","     * Radius of the circle in which the pie slice is drawn","     *","     * @config radius","     * @type Number","     */","    radius: {","        value: 0","    }","}, Y.CanvasShape.ATTRS);","Y.CanvasPieSlice = CanvasPieSlice;","/**"," * <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> implementation of the `Graphic` class. "," * `CanvasGraphic` is not intended to be used directly. Instead, use the <a href=\"Graphic.html\">`Graphic`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities but has "," * <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> capabilities, the <a href=\"Graphic.html\">`Graphic`</a> "," * class will point to the `CanvasGraphic` class."," *"," * @module graphics"," * @class CanvasGraphic"," * @constructor"," */","function CanvasGraphic(config) {","    ","    CanvasGraphic.superclass.constructor.apply(this, arguments);","}","","CanvasGraphic.NAME = \"canvasGraphic\";","","CanvasGraphic.ATTRS = {","    /**","     * Whether or not to render the `Graphic` automatically after to a specified parent node after init. This can be a Node instance or a CSS selector string.","     * ","     * @config render","     * @type Node | String ","     */","    render: {},","	","    /**","	 * Unique id for class instance.","	 *","	 * @config id","	 * @type String","	 */","	id: {","		valueFn: function()","		{","			return Y.guid();","		},","","		setter: function(val)","		{","			var node = this._node;","			if(node)","			{","				node.setAttribute(\"id\", val);","			}","			return val;","		}","	},","","    /**","     * Key value pairs in which a shape instance is associated with its id.","     *","     *  @config shapes","     *  @type Object","     *  @readOnly","     */","    shapes: {","        readOnly: true,","","        getter: function()","        {","            return this._shapes;","        }","    },","","    /**","     *  Object containing size and coordinate data for the content of a Graphic in relation to the graphic instance's position.","     *","     *  @config contentBounds ","     *  @type Object","     *  @readOnly","     */","    contentBounds: {","        readOnly: true,","","        getter: function()","        {","            return this._contentBounds;","        }","    },","","    /**","     *  The outermost html element of the Graphic instance.","     *","     *  @config node","     *  @type HTMLElement","     *  @readOnly","     */","    node: {","        readOnly: true,","","        getter: function()","        {","            return this._node;","        }","    },","","	/**","	 * Indicates the width of the `Graphic`. ","	 *","	 * @config width","	 * @type Number","	 */","    width: {","        setter: function(val)","        {","            if(this._node)","            {","                this._node.style.width = val + \"px\";            ","            }","            return val;","        }","    },","","	/**","	 * Indicates the height of the `Graphic`. ","	 *","	 * @config height ","	 * @type Number","	 */","    height: {","        setter: function(val)","        {","            if(this._node)","            {","                this._node.style.height = val + \"px\";","            }","            return val;","        }","    },","","    /**","     *  Determines the sizing of the Graphic. ","     *","     *  <dl>","     *      <dt>sizeContentToGraphic</dt><dd>The Graphic's width and height attributes are, either explicitly set through the <code>width</code> and <code>height</code>","     *      attributes or are determined by the dimensions of the parent element. The content contained in the Graphic will be sized to fit with in the Graphic instance's ","     *      dimensions. When using this setting, the <code>preserveAspectRatio</code> attribute will determine how the contents are sized.</dd>","     *      <dt>sizeGraphicToContent</dt><dd>(Also accepts a value of true) The Graphic's width and height are determined by the size and positioning of the content.</dd>","     *      <dt>false</dt><dd>The Graphic's width and height attributes are, either explicitly set through the <code>width</code> and <code>height</code>","     *      attributes or are determined by the dimensions of the parent element. The contents of the Graphic instance are not affected by this setting.</dd>","     *  </dl>","     *","     *","     *  @config autoSize","     *  @type Boolean | String","     *  @default false","     */","    autoSize: {","        value: false","    },","","    /**","     * Determines how content is sized when <code>autoSize</code> is set to <code>sizeContentToGraphic</code>.","     *","     *  <dl>","     *      <dt>none<dt><dd>Do not force uniform scaling. Scale the graphic content of the given element non-uniformly if necessary ","     *      such that the element's bounding box exactly matches the viewport rectangle.</dd>","     *      <dt>xMinYMin</dt><dd>Force uniform scaling position along the top left of the Graphic's node.</dd>","     *      <dt>xMidYMin</dt><dd>Force uniform scaling horizontally centered and positioned at the top of the Graphic's node.<dd>","     *      <dt>xMaxYMin</dt><dd>Force uniform scaling positioned horizontally from the right and vertically from the top.</dd>","     *      <dt>xMinYMid</dt>Force uniform scaling positioned horizontally from the left and vertically centered.</dd>","     *      <dt>xMidYMid (the default)</dt><dd>Force uniform scaling with the content centered.</dd>","     *      <dt>xMaxYMid</dt><dd>Force uniform scaling positioned horizontally from the right and vertically centered.</dd>","     *      <dt>xMinYMax</dt><dd>Force uniform scaling positioned horizontally from the left and vertically from the bottom.</dd>","     *      <dt>xMidYMax</dt><dd>Force uniform scaling horizontally centered and position vertically from the bottom.</dd>","     *      <dt>xMaxYMax</dt><dd>Force uniform scaling positioned horizontally from the right and vertically from the bottom.</dd>","     *  </dl>","     * ","     * @config preserveAspectRatio","     * @type String","     * @default xMidYMid","     */","    preserveAspectRatio: {","        value: \"xMidYMid\"","    },","","    /**","     * The contentBounds will resize to greater values but not smaller values. (for performance)","     * When resizing the contentBounds down is desirable, set the resizeDown value to true.","     *","     * @config resizeDown ","     * @type Boolean","     */","    resizeDown: {","        value: false","    },","","	/**","	 * Indicates the x-coordinate for the instance.","	 *","	 * @config x","	 * @type Number","	 */","    x: {","        getter: function()","        {","            return this._x;","        },","","        setter: function(val)","        {","            this._x = val;","            if(this._node)","            {","                this._node.style.left = val + \"px\";","            }","            return val;","        }","    },","","	/**","	 * Indicates the y-coordinate for the instance.","	 *","	 * @config y","	 * @type Number","	 */","    y: {","        getter: function()","        {","            return this._y;","        },","","        setter: function(val)","        {","            this._y = val;","            if(this._node)","            {","                this._node.style.top = val + \"px\";","            }","            return val;","        }","    },","","    /**","     * Indicates whether or not the instance will automatically redraw after a change is made to a shape.","     * This property will get set to false when batching operations.","     *","     * @config autoDraw","     * @type Boolean","     * @default true","     * @private","     */","    autoDraw: {","        value: true","    },","","	/**","	 * Indicates whether the `Graphic` and its children are visible.","	 *","	 * @config visible","	 * @type Boolean","	 */","    visible: {","        value: true,","","        setter: function(val)","        {","            this._toggleVisible(val);","            return val;","        }","    }","};","","Y.extend(CanvasGraphic, Y.GraphicBase, {","    /**","     * Sets the value of an attribute.","     *","     * @method set","     * @param {String|Object} name The name of the attribute. Alternatively, an object of key value pairs can ","     * be passed in to set multiple attributes at once.","     * @param {Any} value The value to set the attribute to. This value is ignored if an object is received as ","     * the name param.","     */","	set: function(attr, value) ","	{","		var host = this,","            redrawAttrs = {","                autoDraw: true,","                autoSize: true,","                preserveAspectRatio: true,","                resizeDown: true","            },","            key,","            forceRedraw = false;","		AttributeLite.prototype.set.apply(host, arguments);	","        if(host._state.autoDraw === true && Y.Object.size(this._shapes) > 0)","        {","            if(Y_LANG.isString && redrawAttrs[attr])","            {","                forceRedraw = true;","            }","            else if(Y_LANG.isObject(attr))","            {","                for(key in redrawAttrs)","                {","                    if(redrawAttrs.hasOwnProperty(key) && attr[key])","                    {","                        forceRedraw = true;","                        break;","                    }","                }","            }","        }","        if(forceRedraw)","        {","            host._redraw();","        }","	},","","    /**","     * Storage for `x` attribute.","     *","     * @property _x","     * @type Number","     * @private","     */","    _x: 0,","","    /**","     * Storage for `y` attribute.","     *","     * @property _y","     * @type Number","     * @private","     */","    _y: 0,","","    /**","     * Gets the current position of the graphic instance in page coordinates.","     *","     * @method getXY","     * @return Array The XY position of the shape.","     */","    getXY: function()","    {","        var node = Y.one(this._node),","            xy;","        if(node)","        {","            xy = node.getXY();","        }","        return xy;","    },","    ","	/**","     * Initializes the class.","     *","     * @method initializer","     * @param {Object} config Optional attributes ","     * @private","     */","    initializer: function(config) {","        var render = this.get(\"render\"),","            visibility = this.get(\"visible\") ? \"visible\" : \"hidden\",","            w = this.get(\"width\") || 0,","            h = this.get(\"height\") || 0;","        this._shapes = {};","        this._redrawQueue = {};","		this._contentBounds = {","            left: 0,","            top: 0,","            right: 0,","            bottom: 0","        };","        this._node = DOCUMENT.createElement('div');","        this._node.style.position = \"absolute\";","        this._node.style.visibility = visibility;","        this.set(\"width\", w);","        this.set(\"height\", h);","        if(render)","        {","            this.render(render);","        }","    },","","    /**","     * Adds the graphics node to the dom.","     * ","     * @method render","     * @param {HTMLElement} parentNode node in which to render the graphics node into.","     */","    render: function(render) {","        var parentNode = Y.one(render),","            node = this._node,","            w = this.get(\"width\") || parseInt(parentNode.getComputedStyle(\"width\"), 10),","            h = this.get(\"height\") || parseInt(parentNode.getComputedStyle(\"height\"), 10);","        parentNode = parentNode || DOCUMENT.body;","        parentNode.appendChild(node);","        node.style.display = \"block\";","        node.style.position = \"absolute\";","        node.style.left = \"0px\";","        node.style.top = \"0px\";","        this.set(\"width\", w);","        this.set(\"height\", h);","        this.parentNode = parentNode;","        return this;","    },","","    /**","     * Removes all nodes.","     *","     * @method destroy","     */","    destroy: function()","    {","        this.removeAllShapes();","        if(this._node)","        {","            this._removeChildren(this._node);","            Y.one(this._node).destroy();","        }","    },","","    /**","     * Generates a shape instance by type.","     *","     * @method addShape","     * @param {Object} cfg attributes for the shape","     * @return Shape","     */","    addShape: function(cfg)","    {","        cfg.graphic = this;","        if(!this.get(\"visible\"))","        {","            cfg.visible = false;","        }","        var shapeClass = this._getShapeClass(cfg.type),","            shape = new shapeClass(cfg);","        this._appendShape(shape);","        return shape;","    },","","    /**","     * Adds a shape instance to the graphic instance.","     *","     * @method _appendShape","     * @param {Shape} shape The shape instance to be added to the graphic.","     * @private","     */","    _appendShape: function(shape)","    {","        var node = shape.node,","            parentNode = this._frag || this._node;","        if(this.get(\"autoDraw\")) ","        {","            parentNode.appendChild(node);","        }","        else","        {","            this._getDocFrag().appendChild(node);","        }","    },","","    /**","     * Removes a shape instance from from the graphic instance.","     *","     * @method removeShape","     * @param {Shape|String} shape The instance or id of the shape to be removed.","     */","    removeShape: function(shape)","    {","        if(!(shape instanceof CanvasShape))","        {","            if(Y_LANG.isString(shape))","            {","                shape = this._shapes[shape];","            }","        }","        if(shape && shape instanceof CanvasShape)","        {","            shape._destroy();","            delete this._shapes[shape.get(\"id\")];","        }","        if(this.get(\"autoDraw\")) ","        {","            this._redraw();","        }","        return shape;","    },","","    /**","     * Removes all shape instances from the dom.","     *","     * @method removeAllShapes","     */","    removeAllShapes: function()","    {","        var shapes = this._shapes,","            i;","        for(i in shapes)","        {","            if(shapes.hasOwnProperty(i))","            {","                shapes[i].destroy();","            }","        }","        this._shapes = {};","    },","    ","    /**","     * Clears the graphics object.","     *","     * @method clear","     */","    clear: function() {","        this.removeAllShapes();","    },","","    /**","     * Removes all child nodes.","     *","     * @method _removeChildren","     * @param {HTMLElement} node","     * @private","     */","    _removeChildren: function(node)","    {","        if(node && node.hasChildNodes())","        {","            var child;","            while(node.firstChild)","            {","                child = node.firstChild;","                this._removeChildren(child);","                node.removeChild(child);","            }","        }","    },","    ","    /**","     * Toggles visibility","     *","     * @method _toggleVisible","     * @param {Boolean} val indicates visibilitye","     * @private","     */","    _toggleVisible: function(val)","    {","        var i,","            shapes = this._shapes,","            visibility = val ? \"visible\" : \"hidden\";","        if(shapes)","        {","            for(i in shapes)","            {","                if(shapes.hasOwnProperty(i))","                {","                    shapes[i].set(\"visible\", val);","                }","            }","        }","        if(this._node)","        {","            this._node.style.visibility = visibility;","        }","    },","","    /**","     * Returns a shape class. Used by `addShape`. ","     *","     * @method _getShapeClass","     * @param {Shape | String} val Indicates which shape class. ","     * @return Function ","     * @private","     */","    _getShapeClass: function(val)","    {","        var shape = this._shapeClass[val];","        if(shape)","        {","            return shape;","        }","        return val;","    },","    ","    /**","     * Look up for shape classes. Used by `addShape` to retrieve a class for instantiation.","     *","     * @property _shapeClass","     * @type Object","     * @private","     */","    _shapeClass: {","        circle: Y.CanvasCircle,","        rect: Y.CanvasRect,","        path: Y.CanvasPath,","        ellipse: Y.CanvasEllipse,","        pieslice: Y.CanvasPieSlice","    },","    ","    /**","     * Returns a shape based on the id of its dom node.","     *","     * @method getShapeById","     * @param {String} id Dom id of the shape's node attribute.","     * @return Shape","     */","    getShapeById: function(id)","    {","        var shape = this._shapes[id];","        return shape;","    },","","	/**","	 * Allows for creating multiple shapes in order to batch appending and redraw operations.","	 *","	 * @method batch","	 * @param {Function} method Method to execute.","	 */","    batch: function(method)","    {","        var autoDraw = this.get(\"autoDraw\");","        this.set(\"autoDraw\", false);","        method();","        this.set(\"autoDraw\", autoDraw);","    },","","    /**","     * Returns a document fragment to for attaching shapes.","     *","     * @method _getDocFrag","     * @return DocumentFragment","     * @private","     */","    _getDocFrag: function()","    {","        if(!this._frag)","        {","            this._frag = DOCUMENT.createDocumentFragment();","        }","        return this._frag;","    },","    ","    /**","     * Redraws all shapes.","     *","     * @method _redraw","     * @private","     */","    _redraw: function()","    {","        var autoSize = this.get(\"autoSize\"),","            preserveAspectRatio = this.get(\"preserveAspectRatio\"),","            box = this.get(\"resizeDown\") ? this._getUpdatedContentBounds() : this._contentBounds,","            contentWidth,","            contentHeight,","            w,","            h,","            xScale,","            yScale,","            translateX = 0,","            translateY = 0,","            matrix,","            node = this.get(\"node\");","        if(autoSize)","        {","            if(autoSize == \"sizeContentToGraphic\")","            {","                contentWidth = box.right - box.left;","                contentHeight = box.bottom - box.top;","                w = parseFloat(Y_DOM.getComputedStyle(node, \"width\"));","                h = parseFloat(Y_DOM.getComputedStyle(node, \"height\"));","                matrix = new Y.Matrix();","                if(preserveAspectRatio == \"none\")","                {","                    xScale = w/contentWidth;","                    yScale = h/contentHeight;","                }","                else","                {","                    if(contentWidth/contentHeight !== w/h) ","                    {","                        if(contentWidth * h/contentHeight > w)","                        {","                            xScale = yScale = w/contentWidth;","                            translateY = this._calculateTranslate(preserveAspectRatio.slice(5).toLowerCase(), contentHeight * w/contentWidth, h);","                        }","                        else","                        {","                            xScale = yScale = h/contentHeight;","                            translateX = this._calculateTranslate(preserveAspectRatio.slice(1, 4).toLowerCase(), contentWidth * h/contentHeight, w);","                        }","                    }","                }","                Y_DOM.setStyle(node, \"transformOrigin\", \"0% 0%\");","                translateX = translateX - (box.left * xScale);","                translateY = translateY - (box.top * yScale);","                matrix.translate(translateX, translateY);","                matrix.scale(xScale, yScale);","                Y_DOM.setStyle(node, \"transform\", matrix.toCSSText());","            }","            else","            {","                this.set(\"width\", box.right);","                this.set(\"height\", box.bottom);","            }","        }","        if(this._frag)","        {","            this._node.appendChild(this._frag);","            this._frag = null;","        }","    },","    ","    /**","     * Determines the value for either an x or y value to be used for the <code>translate</code> of the Graphic.","     *","     * @method _calculateTranslate","     * @param {String} position The position for placement. Possible values are min, mid and max.","     * @param {Number} contentSize The total size of the content.","     * @param {Number} boundsSize The total size of the Graphic.","     * @return Number","     * @private","     */","    _calculateTranslate: function(position, contentSize, boundsSize)","    {","        var ratio = boundsSize - contentSize,","            coord;","        switch(position)","        {","            case \"mid\" :","                coord = ratio * 0.5;","            break;","            case \"max\" :","                coord = ratio;","            break;","            default :","                coord = 0;","            break;","        }","        return coord;","    },","    ","    /**","     * Adds a shape to the redraw queue and calculates the contentBounds. Used internally ","     * by `Shape` instances.","     *","     * @method addToRedrawQueue","     * @param Shape shape The shape instance to add to the queue","     * @protected","     */","    addToRedrawQueue: function(shape)","    {","        var shapeBox,","            box;","        this._shapes[shape.get(\"id\")] = shape;","        if(!this.get(\"resizeDown\"))","        {","            shapeBox = shape.getBounds();","            box = this._contentBounds;","            box.left = box.left < shapeBox.left ? box.left : shapeBox.left;","            box.top = box.top < shapeBox.top ? box.top : shapeBox.top;","            box.right = box.right > shapeBox.right ? box.right : shapeBox.right;","            box.bottom = box.bottom > shapeBox.bottom ? box.bottom : shapeBox.bottom;","            this._contentBounds = box;","        }","        if(this.get(\"autoDraw\")) ","        {","            this._redraw();","        }","    },","","    /**","     * Recalculates and returns the `contentBounds` for the `Graphic` instance.","     *","     * @method _getUpdatedContentBounds","     * @return {Object} ","     * @private","     */","    _getUpdatedContentBounds: function()","    {","        var bounds,","            i,","            shape,","            queue = this._shapes,","            box = {};","        for(i in queue)","        {","            if(queue.hasOwnProperty(i))","            {","                shape = queue[i];","                bounds = shape.getBounds();","                box.left = Y_LANG.isNumber(box.left) ? Math.min(box.left, bounds.left) : bounds.left;","                box.top = Y_LANG.isNumber(box.top) ? Math.min(box.top, bounds.top) : bounds.top;","                box.right = Y_LANG.isNumber(box.right) ? Math.max(box.right, bounds.right) : bounds.right;","                box.bottom = Y_LANG.isNumber(box.bottom) ? Math.max(box.bottom, bounds.bottom) : bounds.bottom;","            }","        }","        box.left = Y_LANG.isNumber(box.left) ? box.left : 0;","        box.top = Y_LANG.isNumber(box.top) ? box.top : 0;","        box.right = Y_LANG.isNumber(box.right) ? box.right : 0;","        box.bottom = Y_LANG.isNumber(box.bottom) ? box.bottom : 0;","        this._contentBounds = box;","        return box;","    },","","    /**","     * Inserts shape on the top of the tree.","     *","     * @method _toFront","     * @param {CanvasShape} Shape to add.","     * @private","     */","    _toFront: function(shape)","    {","        var contentNode = this.get(\"node\");","        if(shape instanceof Y.CanvasShape)","        {","            shape = shape.get(\"node\");","        }","        if(contentNode && shape)","        {","            contentNode.appendChild(shape);","        }","    },","","    /**","     * Inserts shape as the first child of the content node.","     *","     * @method _toBack","     * @param {CanvasShape} Shape to add.","     * @private","     */","    _toBack: function(shape)","    {","        var contentNode = this.get(\"node\"),","            targetNode;","        if(shape instanceof Y.CanvasShape)","        {","            shape = shape.get(\"node\");","        }","        if(contentNode && shape)","        {","            targetNode = contentNode.firstChild;","            if(targetNode)","            {","                contentNode.insertBefore(shape, targetNode);","            }","            else","            {","                contentNode.appendChild(shape);","            }","        }","    }","});","","Y.CanvasGraphic = CanvasGraphic;","","","}, '@VERSION@', {\"requires\": [\"graphics\"]});"];
_yuitest_coverage["build/graphics-canvas/graphics-canvas.js"].lines = {"1":0,"3":0,"37":0,"41":0,"89":0,"90":0,"91":0,"94":0,"95":0,"101":0,"112":0,"124":0,"126":0,"128":0,"129":0,"131":0,"133":0,"134":0,"149":0,"150":0,"151":0,"152":0,"163":0,"165":0,"176":0,"179":0,"180":0,"181":0,"195":0,"207":0,"219":0,"232":0,"240":0,"242":0,"244":0,"245":0,"246":0,"247":0,"248":0,"249":0,"250":0,"251":0,"252":0,"253":0,"254":0,"259":0,"261":0,"262":0,"263":0,"264":0,"265":0,"266":0,"267":0,"270":0,"271":0,"283":0,"295":0,"307":0,"312":0,"313":0,"314":0,"315":0,"316":0,"317":0,"332":0,"347":0,"359":0,"370":0,"371":0,"373":0,"374":0,"375":0,"376":0,"377":0,"378":0,"379":0,"380":0,"381":0,"382":0,"383":0,"384":0,"385":0,"386":0,"387":0,"388":0,"389":0,"390":0,"404":0,"417":0,"429":0,"445":0,"447":0,"448":0,"449":0,"450":0,"451":0,"452":0,"453":0,"454":0,"455":0,"456":0,"457":0,"458":0,"459":0,"460":0,"461":0,"463":0,"476":0,"480":0,"481":0,"482":0,"483":0,"484":0,"485":0,"486":0,"501":0,"503":0,"504":0,"505":0,"506":0,"507":0,"508":0,"522":0,"534":0,"535":0,"536":0,"537":0,"539":0,"540":0,"541":0,"542":0,"543":0,"544":0,"545":0,"547":0,"548":0,"549":0,"550":0,"563":0,"564":0,"565":0,"566":0,"567":0,"568":0,"569":0,"570":0,"585":0,"586":0,"587":0,"588":0,"589":0,"590":0,"591":0,"592":0,"593":0,"594":0,"595":0,"596":0,"613":0,"626":0,"628":0,"630":0,"632":0,"635":0,"637":0,"642":0,"645":0,"649":0,"652":0,"655":0,"658":0,"659":0,"660":0,"662":0,"664":0,"665":0,"666":0,"667":0,"668":0,"669":0,"670":0,"673":0,"675":0,"676":0,"677":0,"686":0,"687":0,"697":0,"698":0,"715":0,"735":0,"737":0,"739":0,"740":0,"744":0,"745":0,"747":0,"748":0,"752":0,"754":0,"755":0,"759":0,"760":0,"762":0,"763":0,"765":0,"766":0,"768":0,"769":0,"770":0,"771":0,"772":0,"774":0,"775":0,"779":0,"781":0,"782":0,"784":0,"795":0,"816":0,"817":0,"818":0,"819":0,"820":0,"821":0,"822":0,"823":0,"824":0,"826":0,"828":0,"830":0,"832":0,"833":0,"834":0,"835":0,"836":0,"837":0,"843":0,"845":0,"846":0,"850":0,"851":0,"853":0,"855":0,"856":0,"857":0,"858":0,"859":0,"861":0,"862":0,"866":0,"868":0,"869":0,"870":0,"872":0,"875":0,"886":0,"887":0,"888":0,"889":0,"890":0,"891":0,"892":0,"893":0,"894":0,"895":0,"896":0,"897":0,"917":0,"918":0,"931":0,"936":0,"937":0,"940":0,"941":0,"942":0,"943":0,"946":0,"960":0,"969":0,"971":0,"972":0,"973":0,"974":0,"975":0,"977":0,"978":0,"979":0,"980":0,"981":0,"982":0,"994":0,"995":0,"997":0,"999":0,"1001":0,"1003":0,"1005":0,"1007":0,"1009":0,"1010":0,"1013":0,"1025":0,"1027":0,"1028":0,"1029":0,"1032":0,"1034":0,"1044":0,"1055":0,"1058":0,"1059":0,"1060":0,"1061":0,"1062":0,"1064":0,"1066":0,"1068":0,"1070":0,"1083":0,"1084":0,"1086":0,"1090":0,"1091":0,"1094":0,"1095":0,"1107":0,"1108":0,"1119":0,"1120":0,"1131":0,"1135":0,"1146":0,"1150":0,"1151":0,"1152":0,"1164":0,"1176":0,"1188":0,"1189":0,"1200":0,"1219":0,"1272":0,"1277":0,"1278":0,"1279":0,"1280":0,"1282":0,"1284":0,"1285":0,"1286":0,"1287":0,"1301":0,"1303":0,"1305":0,"1317":0,"1323":0,"1325":0,"1326":0,"1327":0,"1328":0,"1329":0,"1330":0,"1331":0,"1332":0,"1333":0,"1335":0,"1337":0,"1341":0,"1343":0,"1344":0,"1348":0,"1350":0,"1351":0,"1353":0,"1357":0,"1358":0,"1360":0,"1361":0,"1367":0,"1382":0,"1384":0,"1385":0,"1387":0,"1400":0,"1404":0,"1406":0,"1407":0,"1408":0,"1410":0,"1412":0,"1414":0,"1415":0,"1417":0,"1418":0,"1422":0,"1425":0,"1426":0,"1430":0,"1435":0,"1436":0,"1449":0,"1450":0,"1451":0,"1463":0,"1464":0,"1476":0,"1477":0,"1489":0,"1500":0,"1511":0,"1522":0,"1523":0,"1534":0,"1565":0,"1566":0,"1567":0,"1568":0,"1569":0,"1571":0,"1583":0,"1591":0,"1593":0,"1595":0,"1596":0,"1598":0,"1601":0,"1604":0,"1605":0,"1606":0,"1607":0,"1609":0,"1611":0,"1622":0,"1623":0,"1634":0,"1635":0,"1636":0,"1637":0,"1638":0,"1649":0,"1651":0,"1653":0,"1665":0,"1666":0,"1668":0,"1669":0,"1671":0,"1673":0,"1675":0,"1676":0,"1677":0,"1678":0,"1680":0,"1682":0,"1686":0,"1690":0,"1691":0,"1692":0,"1693":0,"1695":0,"1696":0,"1698":0,"1699":0,"1701":0,"1703":0,"1704":0,"1706":0,"1708":0,"1709":0,"1713":0,"1719":0,"1720":0,"1721":0,"1722":0,"1723":0,"1736":0,"1738":0,"1740":0,"1742":0,"1744":0,"1748":0,"1750":0,"1751":0,"1754":0,"1755":0,"1757":0,"1759":0,"1760":0,"1761":0,"1763":0,"1765":0,"1766":0,"1782":0,"1794":0,"1795":0,"1797":0,"1799":0,"1800":0,"1801":0,"1802":0,"1805":0,"1806":0,"1808":0,"1810":0,"1812":0,"1814":0,"1817":0,"1823":0,"1824":0,"1826":0,"1828":0,"1842":0,"1847":0,"1849":0,"1850":0,"1851":0,"1852":0,"1854":0,"1869":0,"1879":0,"1881":0,"1882":0,"1884":0,"1885":0,"1886":0,"1887":0,"1889":0,"1890":0,"1891":0,"1893":0,"1896":0,"1897":0,"1898":0,"1908":0,"1909":0,"1911":0,"1922":0,"1923":0,"1925":0,"1938":0,"1946":0,"1948":0,"1949":0,"1950":0,"1952":0,"1953":0,"1955":0,"1956":0,"1958":0,"1960":0,"1964":0,"1968":0,"1979":0,"1980":0,"1982":0,"1986":0,"1998":0,"2000":0,"2001":0,"2002":0,"2007":0,"2018":0,"2054":0,"2055":0,"2056":0,"2057":0,"2062":0,"2078":0,"2091":0,"2096":0,"2097":0,"2099":0,"2101":0,"2155":0,"2157":0,"2159":0,"2161":0,"2213":0,"2215":0,"2216":0,"2218":0,"2220":0,"2223":0,"2224":0,"2261":0,"2263":0,"2265":0,"2266":0,"2268":0,"2271":0,"2272":0,"2273":0,"2301":0,"2303":0,"2305":0,"2320":0,"2324":0,"2336":0,"2338":0,"2340":0,"2341":0,"2359":0,"2360":0,"2372":0,"2377":0,"2378":0,"2379":0,"2380":0,"2381":0,"2382":0,"2383":0,"2384":0,"2385":0,"2395":0,"2399":0,"2409":0,"2410":0,"2415":0,"2416":0,"2429":0,"2430":0,"2435":0,"2436":0,"2452":0,"2456":0,"2468":0,"2470":0,"2472":0,"2473":0,"2491":0,"2493":0,"2494":0,"2495":0,"2498":0,"2499":0,"2511":0,"2513":0,"2516":0,"2518":0,"2536":0,"2538":0,"2539":0,"2540":0,"2543":0,"2553":0,"2558":0,"2559":0,"2561":0,"2563":0,"2577":0,"2582":0,"2583":0,"2585":0,"2587":0,"2591":0,"2603":0,"2605":0,"2608":0,"2610":0,"2628":0,"2629":0,"2631":0,"2632":0,"2633":0,"2638":0,"2648":0,"2649":0,"2654":0,"2667":0,"2668":0,"2673":0,"2687":0,"2695":0,"2697":0,"2699":0,"2700":0,"2718":0,"2723":0,"2724":0,"2725":0,"2726":0,"2727":0,"2728":0,"2729":0,"2732":0,"2770":0,"2782":0,"2784":0,"2787":0,"2789":0,"2807":0,"2812":0,"2813":0,"2815":0,"2817":0,"2833":0,"2849":0,"2865":0,"2878":0,"2880":0,"2882":0,"2895":0,"2897":0,"2899":0,"2969":0,"2974":0,"2975":0,"2977":0,"2979":0,"2992":0,"2997":0,"2998":0,"3000":0,"3002":0,"3030":0,"3031":0,"3036":0,"3048":0,"3057":0,"3058":0,"3060":0,"3062":0,"3064":0,"3066":0,"3068":0,"3070":0,"3071":0,"3076":0,"3078":0,"3108":0,"3110":0,"3112":0,"3114":0,"3125":0,"3129":0,"3130":0,"3131":0,"3137":0,"3138":0,"3139":0,"3140":0,"3141":0,"3142":0,"3144":0,"3155":0,"3159":0,"3160":0,"3161":0,"3162":0,"3163":0,"3164":0,"3165":0,"3166":0,"3167":0,"3168":0,"3178":0,"3179":0,"3181":0,"3182":0,"3195":0,"3196":0,"3198":0,"3200":0,"3202":0,"3203":0,"3215":0,"3217":0,"3219":0,"3223":0,"3235":0,"3237":0,"3239":0,"3242":0,"3244":0,"3245":0,"3247":0,"3249":0,"3251":0,"3261":0,"3263":0,"3265":0,"3267":0,"3270":0,"3279":0,"3291":0,"3293":0,"3294":0,"3296":0,"3297":0,"3298":0,"3312":0,"3315":0,"3317":0,"3319":0,"3321":0,"3325":0,"3327":0,"3341":0,"3342":0,"3344":0,"3346":0,"3373":0,"3374":0,"3385":0,"3386":0,"3387":0,"3388":0,"3400":0,"3402":0,"3404":0,"3415":0,"3428":0,"3430":0,"3432":0,"3433":0,"3434":0,"3435":0,"3436":0,"3437":0,"3439":0,"3440":0,"3444":0,"3446":0,"3448":0,"3449":0,"3453":0,"3454":0,"3458":0,"3459":0,"3460":0,"3461":0,"3462":0,"3463":0,"3467":0,"3468":0,"3471":0,"3473":0,"3474":0,"3490":0,"3492":0,"3495":0,"3496":0,"3498":0,"3499":0,"3501":0,"3502":0,"3504":0,"3517":0,"3519":0,"3520":0,"3522":0,"3523":0,"3524":0,"3525":0,"3526":0,"3527":0,"3528":0,"3530":0,"3532":0,"3545":0,"3550":0,"3552":0,"3554":0,"3555":0,"3556":0,"3557":0,"3558":0,"3559":0,"3562":0,"3563":0,"3564":0,"3565":0,"3566":0,"3567":0,"3579":0,"3580":0,"3582":0,"3584":0,"3586":0,"3599":0,"3601":0,"3603":0,"3605":0,"3607":0,"3608":0,"3610":0,"3614":0,"3620":0};
_yuitest_coverage["build/graphics-canvas/graphics-canvas.js"].functions = {"CanvasDrawing:37":0,"_toRGBA:88":0,"_toRGB:111":0,"setSize:123":0,"_updateCoords:147":0,"_clearAndUpdateCoords:161":0,"_updateNodePosition:174":0,"_updateDrawingQueue:193":0,"lineTo:205":0,"relativeLineTo:217":0,"_lineTo:230":0,"moveTo:281":0,"relativeMoveTo:293":0,"_moveTo:306":0,"curveTo:331":0,"relativeCurveTo:346":0,"_curveTo:358":0,"quadraticCurveTo:403":0,"relativeQuadraticCurveTo:416":0,"_quadraticCurveTo:428":0,"drawCircle:475":0,"drawDiamond:499":0,"drawEllipse:521":0,"drawRect:562":0,"drawRoundRect:584":0,"drawWedge:611":0,"end:685":0,"closePath:695":0,"_getLinearGradient:714":0,"_getRadialGradient:794":0,"_initProps:885":0,"_createGraphic:916":0,"getBezierData:930":0,"_setCurveBoundingBox:958":0,"_trackSize:993":0,"CanvasShape:1025":0,"init:1042":0,"initializer:1053":0,"_setGraphic:1081":0,"addClass:1105":0,"removeClass:1117":0,"getXY:1129":0,"setXY:1144":0,"contains:1162":0,"test:1174":0,"compareTo:1187":0,"_getDefaultFill:1199":0,"_getDefaultStroke:1217":0,"createNode:1270":0,"on:1299":0,"_setStrokeProps:1315":0,"set:1380":0,"_setFillProps:1398":0,"translate:1447":0,"translateX:1461":0,"translateY:1474":0,"skew:1487":0,"skewX:1498":0,"skewY:1509":0,"rotate:1520":0,"scale:1532":0,"_addTransform:1563":0,"_updateTransform:1581":0,"_updateHandler:1620":0,"_draw:1632":0,"_closePath:1647":0,"_strokeAndFill:1734":0,"_drawDashedLine:1780":0,"clear:1822":0,"getBounds:1840":0,"_getContentRect:1867":0,"toFront:1906":0,"toBack:1920":0,"_parsePathData:1936":0,"destroy:1977":0,"_destroy:1996":0,"valueFn:2016":0,"setter:2052":0,"getter:2060":0,"getter:2076":0,"valueFn:2089":0,"setter:2094":0,"setter:2154":0,"setter:2211":0,"setter:2259":0,"setter:2299":0,"getter:2318":0,"CanvasPath:2336":0,"_draw:2357":0,"createNode:2370":0,"end:2393":0,"getter:2407":0,"setter:2413":0,"getter:2427":0,"setter:2433":0,"getter:2450":0,"CanvasRect:2468":0,"_draw:2489":0,"CanvasEllipse:2511":0,"_draw:2534":0,"setter:2551":0,"getter:2556":0,"setter:2575":0,"getter:2580":0,"CanvasCircle:2603":0,"_draw:2626":0,"setter:2646":0,"getter:2652":0,"setter:2665":0,"getter:2671":0,"CanvasPieSlice:2695":0,"_draw:2716":0,"CanvasGraphic:2782":0,"valueFn:2805":0,"setter:2810":0,"getter:2831":0,"getter:2847":0,"getter:2863":0,"setter:2876":0,"setter:2893":0,"getter:2967":0,"setter:2972":0,"getter:2990":0,"setter:2995":0,"setter:3028":0,"set:3046":0,"getXY:3106":0,"initializer:3124":0,"render:3154":0,"destroy:3176":0,"addShape:3193":0,"_appendShape:3213":0,"removeShape:3233":0,"removeAllShapes:3259":0,"clear:3278":0,"_removeChildren:3289":0,"_toggleVisible:3310":0,"_getShapeClass:3339":0,"getShapeById:3371":0,"batch:3383":0,"_getDocFrag:3398":0,"_redraw:3413":0,"_calculateTranslate:3488":0,"addToRedrawQueue:3515":0,"_getUpdatedContentBounds:3543":0,"_toFront:3577":0,"_toBack:3597":0,"(anonymous 1):1":0};
_yuitest_coverage["build/graphics-canvas/graphics-canvas.js"].coveredLines = 889;
_yuitest_coverage["build/graphics-canvas/graphics-canvas.js"].coveredFunctions = 148;
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1);
YUI.add('graphics-canvas', function (Y, NAME) {

_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "(anonymous 1)", 1);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3);
var IMPLEMENTATION = "canvas",
    SHAPE = "shape",
	SPLITPATHPATTERN = /[a-z][^a-z]*/ig,
    SPLITARGSPATTERN = /[-]?[0-9]*[0-9|\.][0-9]*/g,
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
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 37);
function CanvasDrawing()
{
}

_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 41);
CanvasDrawing.prototype = {
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
    
    /**
     * Parses hex color string and alpha value to rgba
     *
     * @method _toRGBA
     * @param {Object} val Color value to parse. Can be hex string, rgb or name.
     * @param {Number} alpha Numeric value between 0 and 1 representing the alpha level.
     * @private
     */
    _toRGBA: function(val, alpha) {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_toRGBA", 88);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 89);
alpha = (alpha !== undefined) ? alpha : 1;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 90);
if (!Y_Color.re_RGB.test(val)) {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 91);
val = TOHEX(val);
        }

        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 94);
if(Y_Color.re_hex.exec(val)) {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 95);
val = 'rgba(' + [
                PARSE_INT(RE.$1, 16),
                PARSE_INT(RE.$2, 16),
                PARSE_INT(RE.$3, 16)
            ].join(',') + ',' + alpha + ')';
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 101);
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
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_toRGB", 111);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 112);
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
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "setSize", 123);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 124);
if(this.get("autoSize"))
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 126);
if(w > this.node.getAttribute("width"))
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 128);
this.node.style.width = w + "px";
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 129);
this.node.setAttribute("width", w);
            }
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 131);
if(h > this.node.getAttribute("height"))
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 133);
this.node.style.height = h + "px";
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 134);
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
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_updateCoords", 147);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 149);
this._xcoords.push(x);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 150);
this._ycoords.push(y);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 151);
this._currentX = x;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 152);
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
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_clearAndUpdateCoords", 161);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 163);
var x = this._xcoords.pop() || 0,
            y = this._ycoords.pop() || 0;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 165);
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
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_updateNodePosition", 174);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 176);
var node = this.get("node"),
            x = this.get("x"),
            y = this.get("y"); 
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 179);
node.style.position = "absolute";
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 180);
node.style.left = (x + this._left) + "px";
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 181);
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
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_updateDrawingQueue", 193);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 195);
this._methods.push(val);
    },
    
    /**
     * Draws a line segment from the current drawing position to the specified x and y coordinates.
     * 
     * @method lineTo
     * @param {Number} point1 x-coordinate for the end point.
     * @param {Number} point2 y-coordinate for the end point.
     */
    lineTo: function()
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "lineTo", 205);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 207);
this._lineTo.apply(this, [Y.Array(arguments), false]);
    },

    /**
     * Draws a line segment from the current drawing position to the relative x and y coordinates.
     * 
     * @method lineTo
     * @param {Number} point1 x-coordinate for the end point.
     * @param {Number} point2 y-coordinate for the end point.
     */
    relativeLineTo: function()
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "relativeLineTo", 217);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 219);
this._lineTo.apply(this, [Y.Array(arguments), true]);
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
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_lineTo", 230);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 232);
var point1 = args[0], 
            i, 
            len,
            x,
            y,
            wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0,
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 240);
if(!this._lineToMethods)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 242);
this._lineToMethods = [];
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 244);
len = args.length - 1;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 245);
if (typeof point1 === 'string' || typeof point1 === 'number') {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 246);
for (i = 0; i < len; i = i + 2) {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 247);
x = parseFloat(args[i]);
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 248);
y = parseFloat(args[i + 1]);
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 249);
x = x + relativeX;
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 250);
y = y + relativeY;
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 251);
this._updateDrawingQueue(["lineTo", x, y]);
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 252);
this._trackSize(x - wt, y - wt);
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 253);
this._trackSize(x + wt, y + wt);
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 254);
this._updateCoords(x, y);
            }
        }
        else
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 259);
for (i = 0; i < len; i = i + 1) 
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 261);
x = parseFloat(args[i][0]);
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 262);
y = parseFloat(args[i][1]);
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 263);
this._updateDrawingQueue(["lineTo", x, y]);
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 264);
this._lineToMethods[this._lineToMethods.length] = this._methods[this._methods.length - 1];
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 265);
this._trackSize(x - wt, y - wt);
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 266);
this._trackSize(x + wt, y + wt);
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 267);
this._updateCoords(x, y);
            }
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 270);
this._drawingComplete = false;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 271);
return this;
    },

    /**
     * Moves the current drawing position to specified x and y coordinates.
     *
     * @method moveTo
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     */
    moveTo: function()
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "moveTo", 281);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 283);
this._moveTo.apply(this, [Y.Array(arguments), false]);
    },

    /**
     * Moves the current drawing position relative to specified x and y coordinates.
     *
     * @method relativeMoveTo
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     */
    relativeMoveTo: function()
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "relativeMoveTo", 293);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 295);
this._moveTo.apply(this, [Y.Array(arguments), true]);
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
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_moveTo", 306);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 307);
var wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0,
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0,
            x = parseFloat(args[0]) + relativeX,
            y = parseFloat(args[1]) + relativeY;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 312);
this._updateDrawingQueue(["moveTo", x, y]);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 313);
this._trackSize(x - wt, y - wt);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 314);
this._trackSize(x + wt, y + wt);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 315);
this._updateCoords(x, y);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 316);
this._drawingComplete = false;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 317);
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
    curveTo: function() {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "curveTo", 331);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 332);
this._curveTo.apply(this, [Y.Array(arguments), false]);
    },

    /**
     * Draws a bezier curve relative to the current coordinates.
     *
     * @method curveTo
     * @param {Number} cp1x x-coordinate for the first control point.
     * @param {Number} cp1y y-coordinate for the first control point.
     * @param {Number} cp2x x-coordinate for the second control point.
     * @param {Number} cp2y y-coordinate for the second control point.
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     */
    relativeCurveTo: function() {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "relativeCurveTo", 346);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 347);
this._curveTo.apply(this, [Y.Array(arguments), true]);
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
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_curveTo", 358);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 359);
var w,
            h,
            pts,
            right,
            left,
            bottom,
            top,
            i = 0,
            len,
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 370);
len = args.length - 5;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 371);
for(; i < len; i = i + 6)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 373);
cp1x = parseFloat(args[i]) + relativeX;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 374);
cp1y = parseFloat(args[i + 1]) + relativeY;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 375);
cp2x = parseFloat(args[i + 2]) + relativeX;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 376);
cp2y = parseFloat(args[i + 3]) + relativeY;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 377);
x = parseFloat(args[i + 4]) + relativeX;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 378);
y = parseFloat(args[i + 5]) + relativeY;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 379);
this._updateDrawingQueue(["bezierCurveTo", cp1x, cp1y, cp2x, cp2y, x, y]);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 380);
this._drawingComplete = false;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 381);
right = Math.max(x, Math.max(cp1x, cp2x));
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 382);
bottom = Math.max(y, Math.max(cp1y, cp2y));
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 383);
left = Math.min(x, Math.min(cp1x, cp2x));
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 384);
top = Math.min(y, Math.min(cp1y, cp2y));
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 385);
w = Math.abs(right - left);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 386);
h = Math.abs(bottom - top);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 387);
pts = [[this._currentX, this._currentY] , [cp1x, cp1y], [cp2x, cp2y], [x, y]]; 
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 388);
this._setCurveBoundingBox(pts, w, h);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 389);
this._currentX = x;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 390);
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
     */
    quadraticCurveTo: function() {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "quadraticCurveTo", 403);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 404);
this._quadraticCurveTo.apply(this, [Y.Array(arguments), false]);
    },

    /**
     * Draws a quadratic bezier curve relative to the current position.
     *
     * @method relativeQuadraticCurveTo
     * @param {Number} cpx x-coordinate for the control point.
     * @param {Number} cpy y-coordinate for the control point.
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     */
    relativeQuadraticCurveTo: function() {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "relativeQuadraticCurveTo", 416);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 417);
this._quadraticCurveTo.apply(this, [Y.Array(arguments), true]);
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
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_quadraticCurveTo", 428);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 429);
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
            i = 0,
            len = args.length - 3,
            wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0,
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 445);
for(; i < len; i = i + 4)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 447);
cpx = parseFloat(args[i]) + relativeX;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 448);
cpy = parseFloat(args[i + 1]) + relativeY;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 449);
x = parseFloat(args[i + 2]) + relativeX;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 450);
y = parseFloat(args[i + 3]) + relativeY;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 451);
this._drawingComplete = false;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 452);
right = Math.max(x, cpx);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 453);
bottom = Math.max(y, cpy);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 454);
left = Math.min(x, cpx);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 455);
top = Math.min(y, cpy);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 456);
w = Math.abs(right - left);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 457);
h = Math.abs(bottom - top);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 458);
pts = [[this._currentX, this._currentY] , [cpx, cpy], [x, y]]; 
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 459);
this._setCurveBoundingBox(pts, w, h);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 460);
this._updateDrawingQueue(["quadraticCurveTo", cpx, cpy, x, y]);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 461);
this._updateCoords(x, y);
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 463);
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
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "drawCircle", 475);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 476);
var startAngle = 0,
            endAngle = 2 * Math.PI,
            wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0,
            circum = radius * 2;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 480);
circum += wt;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 481);
this._drawingComplete = false;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 482);
this._trackSize(x + circum, y + circum);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 483);
this._trackSize(x - wt, y - wt);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 484);
this._updateCoords(x, y);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 485);
this._updateDrawingQueue(["arc", x + radius, y + radius, radius, startAngle, endAngle, false]);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 486);
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
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "drawDiamond", 499);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 501);
var midWidth = width * 0.5,
            midHeight = height * 0.5;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 503);
this.moveTo(x + midWidth, y);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 504);
this.lineTo(x + width, y + midHeight);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 505);
this.lineTo(x + midWidth, y + height);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 506);
this.lineTo(x, y + midHeight);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 507);
this.lineTo(x + midWidth, y);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 508);
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
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "drawEllipse", 521);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 522);
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

        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 534);
ax = centerX + Math.cos(0) * radius;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 535);
ay = centerY + Math.sin(0) * yRadius;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 536);
this.moveTo(ax, ay);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 537);
for(; i < l; i++)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 539);
angle += theta;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 540);
angleMid = angle - (theta / 2);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 541);
bx = centerX + Math.cos(angle) * radius;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 542);
by = centerY + Math.sin(angle) * yRadius;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 543);
cx = centerX + Math.cos(angleMid) * (radius / Math.cos(theta / 2));
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 544);
cy = centerY + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 545);
this._updateDrawingQueue(["quadraticCurveTo", cx, cy, bx, by]);
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 547);
this._trackSize(x + w + wt, y + h + wt);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 548);
this._trackSize(x - wt, y - wt);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 549);
this._updateCoords(x, y);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 550);
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
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "drawRect", 562);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 563);
var wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 564);
this._drawingComplete = false;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 565);
this.moveTo(x, y);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 566);
this.lineTo(x + w, y);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 567);
this.lineTo(x + w, y + h);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 568);
this.lineTo(x, y + h);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 569);
this.lineTo(x, y);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 570);
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
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "drawRoundRect", 584);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 585);
var wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 586);
this._drawingComplete = false;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 587);
this.moveTo( x, y + eh);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 588);
this.lineTo(x, y + h - eh);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 589);
this.quadraticCurveTo(x, y + h, x + ew, y + h);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 590);
this.lineTo(x + w - ew, y + h);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 591);
this.quadraticCurveTo(x + w, y + h, x + w, y + h - eh);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 592);
this.lineTo(x + w, y + eh);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 593);
this.quadraticCurveTo(x + w, y, x + w - ew, y);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 594);
this.lineTo(x + ew, y);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 595);
this.quadraticCurveTo(x, y, x, y + eh);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 596);
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
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "drawWedge", 611);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 613);
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
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 626);
yRadius = yRadius || radius;

        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 628);
this._drawingComplete = false;
        // move to x,y position
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 630);
this._updateDrawingQueue(["moveTo", x, y]);
        
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 632);
yRadius = yRadius || radius;
        
        // limit sweep to reasonable numbers
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 635);
if(Math.abs(arc) > 360)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 637);
arc = 360;
        }
        
        // First we calculate how many segments are needed
        // for a smooth arc.
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 642);
segs = Math.ceil(Math.abs(arc) / 45);
        
        // Now calculate the sweep of each segment.
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 645);
segAngle = arc / segs;
        
        // The math requires radians rather than degrees. To convert from degrees
        // use the formula (degrees/180)*Math.PI to get radians.
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 649);
theta = -(segAngle / 180) * Math.PI;
        
        // convert angle startAngle to radians
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 652);
angle = (startAngle / 180) * Math.PI;
        
        // draw the curve in segments no larger than 45 degrees.
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 655);
if(segs > 0)
        {
            // draw a line from the center to the start of the curve
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 658);
ax = x + Math.cos(startAngle / 180 * Math.PI) * radius;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 659);
ay = y + Math.sin(startAngle / 180 * Math.PI) * yRadius;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 660);
this.lineTo(ax, ay);
            // Loop for drawing curve segments
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 662);
for(; i < segs; ++i)
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 664);
angle += theta;
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 665);
angleMid = angle - (theta / 2);
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 666);
bx = x + Math.cos(angle) * radius;
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 667);
by = y + Math.sin(angle) * yRadius;
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 668);
cx = x + Math.cos(angleMid) * (radius / Math.cos(theta / 2));
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 669);
cy = y + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 670);
this._updateDrawingQueue(["quadraticCurveTo", cx, cy, bx, by]);
            }
            // close the wedge by drawing a line to the center
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 673);
this._updateDrawingQueue(["lineTo", x, y]);
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 675);
this._trackSize(0 - wt , 0 - wt);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 676);
this._trackSize((radius * 2) + wt, (radius * 2) + wt);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 677);
return this;
    },
    
    /**
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function() {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "end", 685);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 686);
this._closePath();
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 687);
return this;
    },

    /**
     * Ends a fill and stroke
     *
     * @method closePath
     */
    closePath: function()
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "closePath", 695);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 697);
this._updateDrawingQueue(["closePath"]);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 698);
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
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_getLinearGradient", 714);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 715);
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
            r = fill.rotation || 0,
            x1, x2, y1, y2,
            cx = x + w/2,
            cy = y + h/2,
            offset,
            radCon = Math.PI/180,
            tanRadians = parseFloat(parseFloat(Math.tan(r * radCon)).toFixed(8));
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 735);
if(Math.abs(tanRadians) * w/2 >= h/2)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 737);
if(r < 180)
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 739);
y1 = y;
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 740);
y2 = y + h;
            }
            else
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 744);
y1 = y + h;
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 745);
y2 = y;
            }
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 747);
x1 = cx - ((cy - y1)/tanRadians);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 748);
x2 = cx - ((cy - y2)/tanRadians); 
        }
        else
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 752);
if(r > 90 && r < 270)
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 754);
x1 = x + w;
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 755);
x2 = x;
            }
            else
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 759);
x1 = x;
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 760);
x2 = x + w;
            }
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 762);
y1 = ((tanRadians * (cx - x1)) - cy) * -1;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 763);
y2 = ((tanRadians * (cx - x2)) - cy) * -1;
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 765);
gradient = this._context.createLinearGradient(x1, y1, x2, y2);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 766);
for(; i < len; ++i)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 768);
stop = stops[i];
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 769);
opacity = stop.opacity;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 770);
color = stop.color;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 771);
offset = stop.offset;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 772);
if(isNumber(opacity))
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 774);
opacity = Math.max(0, Math.min(1, opacity));
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 775);
color = this._toRGBA(color, opacity);
            }
            else
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 779);
color = TORGB(color);
            }
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 781);
offset = stop.offset || i/(len - 1);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 782);
gradient.addColorStop(offset, color);
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 784);
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
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_getRadialGradient", 794);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 795);
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
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 816);
xc = x + w/2;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 817);
yc = y + h/2;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 818);
x1 = w * fx;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 819);
y1 = h * fy;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 820);
x2 = x + w/2;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 821);
y2 = y + h/2;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 822);
r2 = w * r;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 823);
d = Math.sqrt( Math.pow(Math.abs(xc - x1), 2) + Math.pow(Math.abs(yc - y1), 2) );
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 824);
if(d >= r2)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 826);
ratio = d/r2;
            //hack. gradient won't show if it is exactly on the edge of the arc
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 828);
if(ratio === 1)
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 830);
ratio = 1.01;
            }
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 832);
xn = (x1 - xc)/ratio;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 833);
yn = (y1 - yc)/ratio;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 834);
xn = xn > 0 ? Math.floor(xn) : Math.ceil(xn);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 835);
yn = yn > 0 ? Math.floor(yn) : Math.ceil(yn);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 836);
x1 = xc + xn;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 837);
y1 = yc + yn;
        }
        
        //If the gradient radius is greater than the circle's, adjusting the radius stretches the gradient properly.
        //If the gradient radius is less than the circle's, adjusting the radius of the gradient will not work. 
        //Instead, adjust the color stops to reflect the smaller radius.
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 843);
if(r >= 0.5)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 845);
gradient = this._context.createRadialGradient(x1, y1, r, x2, y2, r * w);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 846);
stopMultiplier = 1;
        }
        else
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 850);
gradient = this._context.createRadialGradient(x1, y1, r, x2, y2, w/2);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 851);
stopMultiplier = r * 2;
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 853);
for(; i < len; ++i)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 855);
stop = stops[i];
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 856);
opacity = stop.opacity;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 857);
color = stop.color;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 858);
offset = stop.offset;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 859);
if(isNumber(opacity))
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 861);
opacity = Math.max(0, Math.min(1, opacity));
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 862);
color = this._toRGBA(color, opacity);
            }
            else
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 866);
color = TORGB(color);
            }
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 868);
offset = stop.offset || i/(len - 1);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 869);
offset *= stopMultiplier;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 870);
if(offset <= 1)
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 872);
gradient.addColorStop(offset, color);
            }
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 875);
return gradient;
    },


    /**
     * Clears all values
     *
     * @method _initProps
     * @private
     */
    _initProps: function() {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_initProps", 885);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 886);
this._methods = [];
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 887);
this._lineToMethods = [];
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 888);
this._xcoords = [0];
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 889);
this._ycoords = [0];
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 890);
this._width = 0;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 891);
this._height = 0;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 892);
this._left = 0;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 893);
this._top = 0;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 894);
this._right = 0;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 895);
this._bottom = 0;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 896);
this._currentX = 0;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 897);
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
    _createGraphic: function(config) {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_createGraphic", 916);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 917);
var graphic = Y.config.doc.createElement('canvas');
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 918);
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
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "getBezierData", 930);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 931);
var n = points.length,
            tmp = [],
            i,
            j;

        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 936);
for (i = 0; i < n; ++i){
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 937);
tmp[i] = [points[i][0], points[i][1]]; // save input
        }
        
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 940);
for (j = 1; j < n; ++j) {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 941);
for (i = 0; i < n - j; ++i) {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 942);
tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 943);
tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1]; 
            }
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 946);
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
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_setCurveBoundingBox", 958);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 960);
var i = 0,
            left = this._currentX,
            right = left,
            top = this._currentY,
            bottom = top,
            len = Math.round(Math.sqrt((w * w) + (h * h))),
            t = 1/len,
            wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0,
            xy;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 969);
for(; i < len; ++i)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 971);
xy = this.getBezierData(pts, t * i);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 972);
left = isNaN(left) ? xy[0] : Math.min(xy[0], left);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 973);
right = isNaN(right) ? xy[0] : Math.max(xy[0], right);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 974);
top = isNaN(top) ? xy[1] : Math.min(xy[1], top);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 975);
bottom = isNaN(bottom) ? xy[1] : Math.max(xy[1], bottom);
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 977);
left = Math.round(left * 10)/10;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 978);
right = Math.round(right * 10)/10;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 979);
top = Math.round(top * 10)/10;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 980);
bottom = Math.round(bottom * 10)/10;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 981);
this._trackSize(right + wt, bottom + wt);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 982);
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
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_trackSize", 993);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 994);
if (w > this._right) {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 995);
this._right = w;
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 997);
if(w < this._left)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 999);
this._left = w;    
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1001);
if (h < this._top)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1003);
this._top = h;
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1005);
if (h > this._bottom) 
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1007);
this._bottom = h;
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1009);
this._width = this._right - this._left;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1010);
this._height = this._bottom - this._top;
    }
};
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1013);
Y.CanvasDrawing = CanvasDrawing;
/**
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> implementation of the <a href="Shape.html">`Shape`</a> class. 
 * `CanvasShape` is not intended to be used directly. Instead, use the <a href="Shape.html">`Shape`</a> class. 
 * If the browser lacks <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities but has 
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> capabilities, the <a href="Shape.html">`Shape`</a> 
 * class will point to the `CanvasShape` class.
 *
 * @module graphics
 * @class CanvasShape
 * @constructor
 */
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1025);
CanvasShape = function(cfg)
{
    _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "CanvasShape", 1025);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1027);
this._transforms = [];
    _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1028);
this.matrix = new Y.Matrix();
    _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1029);
CanvasShape.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1032);
CanvasShape.NAME = "shape";

_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1034);
Y.extend(CanvasShape, Y.GraphicBase, Y.mix({
    /**
     * Init method, invoked during construction.
     * Calls `initializer` method.
     *
     * @method init
     * @protected
     */
    init: function()
	{
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "init", 1042);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1044);
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
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "initializer", 1053);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1055);
var host = this,
            graphic = cfg.graphic,
            data = this.get("data");
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1058);
host._initProps();
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1059);
host.createNode(); 
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1060);
host._xcoords = [0];
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1061);
host._ycoords = [0];
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1062);
if(graphic)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1064);
this._setGraphic(graphic);
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1066);
if(data)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1068);
host._parsePathData(data);
        }
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1070);
host._updateHandler();
	},
 
    /**
     * Set the Graphic instance for the shape.
     *
     * @method _setGraphic
     * @param {Graphic | Node | HTMLElement | String} render This param is used to determine the graphic instance. If it is a `Graphic` instance, it will be assigned
     * to the `graphic` attribute. Otherwise, a new Graphic instance will be created and rendered into the dom element that the render represents.
     * @private
     */
    _setGraphic: function(render)
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_setGraphic", 1081);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1083);
var graphic;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1084);
if(render instanceof Y.CanvasGraphic)
        {
		    _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1086);
this._graphic = render;
        }
        else
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1090);
render = Y.one(render);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1091);
graphic = new Y.CanvasGraphic({
                render: render
            });
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1094);
graphic._appendShape(this);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1095);
this._graphic = graphic;
        }
    },
   
	/**
	 * Add a class name to each node.
	 *
	 * @method addClass
	 * @param {String} className the class name to add to the node's class attribute 
	 */
	addClass: function(className)
	{
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "addClass", 1105);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1107);
var node = Y.one(this.get("node"));
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1108);
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
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "removeClass", 1117);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1119);
var node = Y.one(this.get("node"));
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1120);
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
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "getXY", 1129);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1131);
var graphic = this.get("graphic"),
			parentXY = graphic.getXY(),
			x = this.get("x"),
			y = this.get("y");
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1135);
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
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "setXY", 1144);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1146);
var graphic = this.get("graphic"),
			parentXY = graphic.getXY(),
			x = xy[0] - parentXY[0],
			y = xy[1] - parentXY[1];
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1150);
this._set("x", x);
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1151);
this._set("y", y);
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1152);
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
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "contains", 1162);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1164);
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
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "test", 1174);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1176);
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
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "compareTo", 1187);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1188);
var node = this.node;
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1189);
return node === refNode;
	},

	/**
	 * Value function for fill attribute
	 *
	 * @method _getDefaultFill
	 * @return Object
	 * @private
	 */
	_getDefaultFill: function() {
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_getDefaultFill", 1199);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1200);
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
	 * @method _getDefaultStroke
	 * @return Object
	 * @private
	 */
	_getDefaultStroke: function() 
	{
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_getDefaultStroke", 1217);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1219);
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
     * @property _left
     * @type Number
	 * @private
	 */
	_left: 0,

	/**
	 * Right edge of the path
	 *
     * @property _right
     * @type Number
	 * @private
	 */
	_right: 0,
	
	/**
	 * Top edge of the path
	 *
     * @property _top
     * @type Number
	 * @private
	 */
	_top: 0, 
	
	/**
	 * Bottom edge of the path
	 *
     * @property _bottom
     * @type Number
	 * @private
	 */
	_bottom: 0,

	/**
	 * Creates the dom node for the shape.
	 *
     * @method createNode
	 * @return HTMLElement
	 * @private
	 */
	createNode: function()
	{
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "createNode", 1270);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1272);
var host = this,
            node = Y.config.doc.createElement('canvas'),
			id = host.get("id"),
            concat = host._camelCaseConcat,
            name = host.name;
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1277);
host._context = node.getContext('2d');
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1278);
node.setAttribute("overflow", "visible");
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1279);
node.style.overflow = "visible";
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1280);
if(!host.get("visible"))
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1282);
node.style.visibility = "hidden";
        }
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1284);
node.setAttribute("id", id);
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1285);
id = "#" + id;
	    _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1286);
host.node = node;
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1287);
host.addClass(_getClassName(SHAPE) + " " + _getClassName(concat(IMPLEMENTATION, SHAPE)) + " " + _getClassName(name) + " " + _getClassName(concat(IMPLEMENTATION, name))); 
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
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "on", 1299);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1301);
if(Y.Node.DOM_EVENTS[type])
		{
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1303);
return Y.one("#" +  this.get("id")).on(type, fn);
		}
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1305);
return Y.on.apply(this, arguments);
	},
	
	/**
	 * Adds a stroke to the shape node.
	 *
	 * @method _strokeChangeHandler
     * @param {Object} stroke Properties of the `stroke` attribute.
	 * @private
	 */
	_setStrokeProps: function(stroke)
	{
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_setStrokeProps", 1315);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1317);
var color,
			weight,
			opacity,
			linejoin,
			linecap,
			dashstyle;
	    _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1323);
if(stroke)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1325);
color = stroke.color;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1326);
weight = PARSE_FLOAT(stroke.weight);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1327);
opacity = PARSE_FLOAT(stroke.opacity);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1328);
linejoin = stroke.linejoin || "round";
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1329);
linecap = stroke.linecap || "butt";
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1330);
dashstyle = stroke.dashstyle;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1331);
this._miterlimit = null;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1332);
this._dashstyle = (dashstyle && Y.Lang.isArray(dashstyle) && dashstyle.length > 1) ? dashstyle : null;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1333);
this._strokeWeight = weight;

            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1335);
if (IS_NUMBER(weight) && weight > 0) 
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1337);
this._stroke = 1;
            } 
            else 
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1341);
this._stroke = 0;
            }
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1343);
if (IS_NUMBER(opacity)) {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1344);
this._strokeStyle = this._toRGBA(color, opacity);
            }
            else
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1348);
this._strokeStyle = color;
            }
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1350);
this._linecap = linecap;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1351);
if(linejoin == "round" || linejoin == "bevel")
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1353);
this._linejoin = linejoin;
            }
            else
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1357);
linejoin = parseInt(linejoin, 10);
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1358);
if(IS_NUMBER(linejoin))
                {
                    _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1360);
this._miterlimit =  Math.max(linejoin, 1);
                    _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1361);
this._linejoin = "miter";
                }
            }
        }
        else
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1367);
this._stroke = 0;
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
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "set", 1380);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1382);
var host = this,
			val = arguments[0];
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1384);
AttributeLite.prototype.set.apply(host, arguments);
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1385);
if(host.initialized)
		{
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1387);
host._updateHandler();
		}
	},
	
	/**
	 * Adds a fill to the shape node.
	 *
	 * @method _setFillProps 
     * @param {Object} fill Properties of the `fill` attribute.
	 * @private
	 */
	_setFillProps: function(fill)
	{
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_setFillProps", 1398);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1400);
var isNumber = IS_NUMBER,
			color,
			opacity,
			type;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1404);
if(fill)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1406);
color = fill.color;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1407);
type = fill.type;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1408);
if(type == "linear" || type == "radial")
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1410);
this._fillType = type;
            }
            else {_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1412);
if(color)
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1414);
opacity = fill.opacity;
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1415);
if (isNumber(opacity)) 
                {
                    _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1417);
opacity = Math.max(0, Math.min(1, opacity));
                    _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1418);
color = this._toRGBA(color, opacity);
                } 
                else 
                {
                    _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1422);
color = TORGB(color);
                }

                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1425);
this._fillColor = color;
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1426);
this._fillType = 'solid';
            }
            else
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1430);
this._fillColor = null;
            }}
        }
		else
		{
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1435);
this._fillType = null;
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1436);
this._fillColor = null;
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
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "translate", 1447);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1449);
this._translateX += x;
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1450);
this._translateY += y;
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1451);
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
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "translateX", 1461);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1463);
this._translateX += x;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1464);
this._addTransform("translateX", arguments);
    },

	/**
	 * Performs a translate on the y-coordinate. When translating x and y coordinates,
	 * use the `translate` method.
	 *
	 * @method translateY
	 * @param {Number} y The value to translate.
	 */
	translateY: function(y)
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "translateY", 1474);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1476);
this._translateY += y;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1477);
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
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "skew", 1487);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1489);
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
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "skewX", 1498);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1500);
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
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "skewY", 1509);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1511);
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
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "rotate", 1520);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1522);
this._rotation = deg;
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1523);
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
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "scale", 1532);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1534);
this._addTransform("scale", arguments);
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
     * Storage for the transform attribute.
     *
     * @property _transform
     * @type String
     * @private
     */
    _transform: "",

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
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_addTransform", 1563);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1565);
args = Y.Array(args);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1566);
this._transform = Y_LANG.trim(this._transform + " " + type + "(" + args.join(", ") + ")");
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1567);
args.unshift(type);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1568);
this._transforms.push(args);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1569);
if(this.initialized)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1571);
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
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_updateTransform", 1581);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1583);
var node = this.node,
			key,
			transform,
			transformOrigin = this.get("transformOrigin"),
            matrix = this.matrix,
            i = 0,
            len = this._transforms.length;
        
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1591);
if(this._transforms && this._transforms.length > 0)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1593);
for(; i < len; ++i)
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1595);
key = this._transforms[i].shift();
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1596);
if(key)
                {
                    _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1598);
matrix[key].apply(matrix, this._transforms[i]); 
                }
            }
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1601);
transform = matrix.toCSSText();
        }
        
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1604);
this._graphic.addToRedrawQueue(this);    
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1605);
transformOrigin = (100 * transformOrigin[0]) + "% " + (100 * transformOrigin[1]) + "%";
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1606);
Y_DOM.setStyle(node, "transformOrigin", transformOrigin);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1607);
if(transform)
		{
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1609);
Y_DOM.setStyle(node, "transform", transform);
		}
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1611);
this._transforms = [];
	},

	/**
     * Updates `Shape` based on attribute changes.
     *
     * @method _updateHandler
	 * @private
	 */
	_updateHandler: function()
	{
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_updateHandler", 1620);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1622);
this._draw();
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1623);
this._updateTransform();
	},
	
	/**
	 * Updates the shape.
	 *
	 * @method _draw
	 * @private
	 */
	_draw: function()
	{
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_draw", 1632);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1634);
var node = this.node;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1635);
this.clear();
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1636);
this._closePath();
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1637);
node.style.left = this.get("x") + "px";
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1638);
node.style.top = this.get("y") + "px";
	},

	/**
	 * Completes a shape or drawing
	 *
	 * @method _closePath
	 * @private
	 */
	_closePath: function()
	{
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_closePath", 1647);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1649);
if(!this._methods)
		{
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1651);
return;
		}
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1653);
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
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1665);
this._context.clearRect(0, 0, node.width, node.height);
	   _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1666);
if(this._methods)
	   {
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1668);
len = cachedMethods.length;
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1669);
if(!len || len < 1)
			{
				_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1671);
return;
			}
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1673);
for(; i < len; ++i)
			{
				_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1675);
methods[i] = cachedMethods[i].concat();
				_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1676);
args = methods[i];
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1677);
argsLen = args[0] == "quadraticCurveTo" ? args.length : 3;
				_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1678);
for(j = 1; j < argsLen; ++j)
				{
					_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1680);
if(j % 2 === 0)
					{
						_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1682);
args[j] = args[j] - this._top;
					}
					else
					{
						_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1686);
args[j] = args[j] - this._left;
					}
				}
			}
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1690);
node.setAttribute("width", Math.min(w, 2000));
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1691);
node.setAttribute("height", Math.min(2000, h));
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1692);
context.beginPath();
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1693);
for(i = 0; i < len; ++i)
			{
				_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1695);
args = methods[i].concat();
				_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1696);
if(args && args.length > 0)
				{
					_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1698);
method = args.shift();
					_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1699);
if(method)
					{
                        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1701);
if(method == "closePath")
                        {
                            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1703);
context.closePath();
                            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1704);
this._strokeAndFill(context);
                        }
						else {_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1706);
if(method && method == "lineTo" && this._dashstyle)
						{
							_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1708);
args.unshift(this._xcoords[i] - this._left, this._ycoords[i] - this._top);
							_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1709);
this._drawDashedLine.apply(this, args);
						}
						else
						{
                            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1713);
context[method].apply(context, args); 
						}}
					}
				}
			}

            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1719);
this._strokeAndFill(context);
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1720);
this._drawingComplete = true;
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1721);
this._clearAndUpdateCoords();
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1722);
this._updateNodePosition();
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1723);
this._methods = cachedMethods;
		}
	},

    /**
     * Completes a stroke and/or fill operation on the context.
     *
     * @method _strokeAndFill
     * @param {Context} Reference to the context element of the canvas instance.
     * @private
     */
    _strokeAndFill: function(context)
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_strokeAndFill", 1734);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1736);
if (this._fillType) 
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1738);
if(this._fillType == "linear")
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1740);
context.fillStyle = this._getLinearGradient();
            }
            else {_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1742);
if(this._fillType == "radial")
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1744);
context.fillStyle = this._getRadialGradient();
            }
            else
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1748);
context.fillStyle = this._fillColor;
            }}
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1750);
context.closePath();
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1751);
context.fill();
        }

        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1754);
if (this._stroke) {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1755);
if(this._strokeWeight)
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1757);
context.lineWidth = this._strokeWeight;
            }
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1759);
context.lineCap = this._linecap;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1760);
context.lineJoin = this._linejoin;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1761);
if(this._miterlimit)
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1763);
context.miterLimit = this._miterlimit;
            }
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1765);
context.strokeStyle = this._strokeStyle;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1766);
context.stroke();
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
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_drawDashedLine", 1780);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1782);
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
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1794);
xDelta = Math.cos(radians) * segmentLength;
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1795);
yDelta = Math.sin(radians) * segmentLength;
		
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1797);
for(i = 0; i < segmentCount; ++i)
		{
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1799);
context.moveTo(xCurrent, yCurrent);
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1800);
context.lineTo(xCurrent + Math.cos(radians) * dashsize, yCurrent + Math.sin(radians) * dashsize);
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1801);
xCurrent += xDelta;
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1802);
yCurrent += yDelta;
		}
		
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1805);
context.moveTo(xCurrent, yCurrent);
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1806);
delta = Math.sqrt((xEnd - xCurrent) * (xEnd - xCurrent) + (yEnd - yCurrent) * (yEnd - yCurrent));
		
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1808);
if(delta > dashsize)
		{
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1810);
context.lineTo(xCurrent + Math.cos(radians) * dashsize, yCurrent + Math.sin(radians) * dashsize);
		}
		else {_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1812);
if(delta > 0)
		{
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1814);
context.lineTo(xCurrent + Math.cos(radians) * delta, yCurrent + Math.sin(radians) * delta);
		}}
		
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1817);
context.moveTo(xEnd, yEnd);
	},

	//This should move to CanvasDrawing class. 
    //Currently docmented in CanvasDrawing class.
    clear: function() {
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "clear", 1822);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1823);
this._initProps();
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1824);
if(this.node) 
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1826);
this._context.clearRect(0, 0, this.node.width, this.node.height);
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1828);
return this;
	},
	
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
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "getBounds", 1840);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1842);
var type = this._type,
			w = this.get("width"),
			h = this.get("height"),
			x = this.get("x"),
			y = this.get("y");
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1847);
if(type == "path")
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1849);
x = x + this._left;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1850);
y = y + this._top;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1851);
w = this._right - this._left;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1852);
h = this._bottom - this._top;
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1854);
return this._getContentRect(w, h, x, y);
	},

    /**
     * Calculates the bounding box for the shape.
     *
     * @method _getContentRect
     * @param {Number} w width of the shape
     * @param {Number} h height of the shape
     * @param {Number} x x-coordinate of the shape
     * @param {Number} y y-coordinate of the shape
     * @private
     */
    _getContentRect: function(w, h, x, y)
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_getContentRect", 1867);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1869);
var transformOrigin = this.get("transformOrigin"),
            transformX = transformOrigin[0] * w,
            transformY = transformOrigin[1] * h,
		    transforms = this.matrix.getTransformArray(this.get("transform")),
            matrix = new Y.Matrix(),
            i = 0,
            len = transforms.length,
            transform,
            key,
            contentRect;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1879);
if(this._type == "path")
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1881);
transformX = transformX + x;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1882);
transformY = transformY + y;
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1884);
transformX = !isNaN(transformX) ? transformX : 0;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1885);
transformY = !isNaN(transformY) ? transformY : 0;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1886);
matrix.translate(transformX, transformY);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1887);
for(; i < len; i = i + 1)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1889);
transform = transforms[i];
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1890);
key = transform.shift();
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1891);
if(key)
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1893);
matrix[key].apply(matrix, transform); 
            }
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1896);
matrix.translate(-transformX, -transformY);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1897);
contentRect = matrix.getContentRect(w, h, x, y);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1898);
return contentRect;
    },

    /**
     * Places the shape above all other shapes.
     *
     * @method toFront
     */
    toFront: function()
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "toFront", 1906);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1908);
var graphic = this.get("graphic");
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1909);
if(graphic)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1911);
graphic._toFront(this);
        }
    },

    /**
     * Places the shape underneath all other shapes.
     *
     * @method toFront
     */
    toBack: function()
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "toBack", 1920);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1922);
var graphic = this.get("graphic");
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1923);
if(graphic)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1925);
graphic._toBack(this);
        }
    },

    /**
     * Parses path data string and call mapped methods.
     *
     * @method _parsePathData
     * @param {String} val The path data
     * @private
     */
    _parsePathData: function(val)
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_parsePathData", 1936);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1938);
var method,
            methodSymbol,
            args,
            commandArray = Y.Lang.trim(val.match(SPLITPATHPATTERN)),
            i = 0,
            len, 
            str,
            symbolToMethod = this._pathSymbolToMethod;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1946);
if(commandArray)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1948);
this.clear();
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1949);
len = commandArray.length || 0;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1950);
for(; i < len; i = i + 1)
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1952);
str = commandArray[i];
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1953);
methodSymbol = str.substr(0, 1),
                args = str.substr(1).match(SPLITARGSPATTERN);
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1955);
method = symbolToMethod[methodSymbol];
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1956);
if(method)
                {
                    _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1958);
if(args)
                    {
                        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1960);
this[method].apply(this, args);
                    }
                    else
                    {
                        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1964);
this[method].apply(this);
                    }
                }
            }
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1968);
this.end();
        }
    },
    
    /**
     * Destroys the shape instance.
     *
     * @method destroy
     */
    destroy: function()
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "destroy", 1977);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1979);
var graphic = this.get("graphic");
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1980);
if(graphic)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1982);
graphic.removeShape(this);
        }
        else
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1986);
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
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_destroy", 1996);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 1998);
if(this.node)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2000);
Y.one(this.node).remove(true);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2001);
this._context = null;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2002);
this.node = null;
        }
    }
}, Y.CanvasDrawing.prototype));

_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2007);
CanvasShape.ATTRS =  {
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
			_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "valueFn", 2016);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2018);
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
            _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "setter", 2052);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2054);
this.matrix.init();	
		    _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2055);
this._transforms = this.matrix.getTransformArray(val);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2056);
this._transform = val;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2057);
return val;
		},

        getter: function()
        {
            _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "getter", 2060);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2062);
return this._transform;
        }
	},

	/**
	 * Dom node for the shape
	 *
	 * @config node
	 * @type HTMLElement
	 * @readOnly
	 */
	node: {
		readOnly: true,

		getter: function()
		{
			_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "getter", 2076);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2078);
return this.node;
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
			_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "valueFn", 2089);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2091);
return Y.guid();
		},

		setter: function(val)
		{
			_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "setter", 2094);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2096);
var node = this.node;
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2097);
if(node)
			{
				_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2099);
node.setAttribute("id", val);
			}
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2101);
return val;
		}
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
	 * Indicates whether the shape is visible.
	 *
	 * @config visible
	 * @type Boolean
	 */
	visible: {
		value: true,

		setter: function(val){
			_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "setter", 2154);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2155);
var node = this.get("node"),
                visibility = val ? "visible" : "hidden";
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2157);
if(node)
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2159);
node.style.visibility = visibility;
            }
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2161);
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
     *  </dl>
     *  <p>The corresponding `SVGShape` class implements the following additional properties.</p>
     *  <dl>
     *      <dt>cx</dt><dd>
     *          <p>The x-coordinate of the center of the gradient circle. Determines where the color stop begins. The default value 0.5.</p>
     *      </dd>
     *      <dt>cy</dt><dd>
     *          <p>The y-coordinate of the center of the gradient circle. Determines where the color stop begins. The default value 0.5.</p>
     *      </dd>
     *  </dl>
     *  <p>These properties are not currently implemented in `CanvasShape` or `VMLShape`.</p> 
	 *
	 * @config fill
	 * @type Object 
	 */
	fill: {
		valueFn: "_getDefaultFill",
		
		setter: function(val)
		{
			_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "setter", 2211);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2213);
var fill,
				tmpl = this.get("fill") || this._getDefaultFill();
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2215);
fill = (val) ? Y.merge(tmpl, val) : null;
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2216);
if(fill && fill.color)
			{
				_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2218);
if(fill.color === undefined || fill.color == "none")
				{
					_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2220);
fill.color = null;
				}
			}
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2223);
this._setFillProps(fill);
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2224);
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
			_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "setter", 2259);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2261);
var tmpl = this.get("stroke") || this._getDefaultStroke(),
                wt;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2263);
if(val && val.hasOwnProperty("weight"))
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2265);
wt = parseInt(val.weight, 10);
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2266);
if(!isNaN(wt))
                {
                    _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2268);
val.weight = wt;
                }
            }
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2271);
val = (val) ? Y.merge(tmpl, val) : null;
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2272);
this._setStrokeProps(val);
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2273);
return val;
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
		value: "visiblePainted"
	},

    /**
     * Represents an SVG Path string.
     *
     * @config data
     * @type String
     */
    data: {
        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "setter", 2299);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2301);
if(this.get("node"))
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2303);
this._parsePathData(val);
            }
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2305);
return val;
        }
    },

	/**
	 * Reference to the container Graphic.
	 *
	 * @config graphic
	 * @type Graphic
	 */
	graphic: {
		readOnly: true,

		getter: function()
		{
			_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "getter", 2318);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2320);
return this._graphic;
		}
    }
};
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2324);
Y.CanvasShape = CanvasShape;
/**
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> implementation of the <a href="Path.html">`Path`</a> class. 
 * `CanvasPath` is not intended to be used directly. Instead, use the <a href="Path.html">`Path`</a> class. 
 * If the browser lacks <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities but has 
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> capabilities, the <a href="Path.html">`Path`</a> 
 * class will point to the `CanvasPath` class.
 *
 * @module graphics
 * @class CanvasPath
 * @extends CanvasShape
 */
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2336);
CanvasPath = function(cfg)
{
	_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "CanvasPath", 2336);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2338);
CanvasPath.superclass.constructor.apply(this, arguments);
};
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2340);
CanvasPath.NAME = "path";
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2341);
Y.extend(CanvasPath, Y.CanvasShape, {
    /**
     * Indicates the type of shape
     *
     * @property _type
     * @type String
     * @private
     */
    _type: "path",

	/**
	 * Draws the shape.
	 *
	 * @method _draw
	 * @private
	 */
    _draw: function()
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_draw", 2357);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2359);
this._closePath();
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2360);
this._updateTransform();
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
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "createNode", 2370);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2372);
var host = this,
            node = Y.config.doc.createElement('canvas'),
			name = host.name,
            concat = host._camelCaseConcat,
            id = host.get("id");
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2377);
host._context = node.getContext('2d');
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2378);
node.setAttribute("overflow", "visible");
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2379);
node.setAttribute("pointer-events", "none");
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2380);
node.style.pointerEvents = "none";
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2381);
node.style.overflow = "visible";
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2382);
node.setAttribute("id", id);
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2383);
id = "#" + id;
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2384);
host.node = node;
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2385);
host.addClass(_getClassName(SHAPE) + " " + _getClassName(concat(IMPLEMENTATION, SHAPE)) + " " + _getClassName(name) + " " + _getClassName(concat(IMPLEMENTATION, name))); 
	},

    /**
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function()
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "end", 2393);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2395);
this._draw();
    }
});

_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2399);
CanvasPath.ATTRS = Y.merge(Y.CanvasShape.ATTRS, {
	/**
	 * Indicates the width of the shape
	 *
	 * @config width
	 * @type Number
	 */
	width: {
		getter: function()
		{
			_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "getter", 2407);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2409);
var offset = this._stroke && this._strokeWeight ? (this._strokeWeight * 2) : 0;
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2410);
return this._width - offset;
		},

		setter: function(val)
		{
			_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "setter", 2413);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2415);
this._width = val;
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2416);
return val;
		}
	},

	/**
	 * Indicates the height of the shape
	 *
	 * @config height
	 * @type Number
	 */
	height: {
		getter: function()
		{
			_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "getter", 2427);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2429);
var offset = this._stroke && this._strokeWeight ? (this._strokeWeight * 2) : 0;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2430);
return this._height - offset;
		},

		setter: function(val)
		{
			_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "setter", 2433);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2435);
this._height = val;
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2436);
return val;
		}
	},
	
	/**
	 * Indicates the path used for the node.
	 *
	 * @config path
	 * @type String
     * @readOnly
	 */
	path: {
        readOnly: true,

		getter: function()
		{
			_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "getter", 2450);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2452);
return this._path;
		}
	}
});
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2456);
Y.CanvasPath = CanvasPath;
/**
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> implementation of the <a href="Rect.html">`Rect`</a> class. 
 * `CanvasRect` is not intended to be used directly. Instead, use the <a href="Rect.html">`Rect`</a> class. 
 * If the browser lacks <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities but has 
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> capabilities, the <a href="Rect.html">`Rect`</a> 
 * class will point to the `CanvasRect` class.
 *
 * @module graphics
 * @class CanvasRect
 * @constructor
 */
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2468);
CanvasRect = function()
{
	_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "CanvasRect", 2468);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2470);
CanvasRect.superclass.constructor.apply(this, arguments);
};
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2472);
CanvasRect.NAME = "rect";
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2473);
Y.extend(CanvasRect, Y.CanvasShape, {
	/**
	 * Indicates the type of shape
	 *
	 * @property _type
	 * @type String
     * @private
	 */
	_type: "rect",

	/**
	 * Draws the shape.
	 *
	 * @method _draw
	 * @private
	 */
	_draw: function()
	{
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_draw", 2489);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2491);
var w = this.get("width"),
			h = this.get("height");
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2493);
this.clear();
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2494);
this.drawRect(0, 0, w, h);
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2495);
this._closePath();
	}
});
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2498);
CanvasRect.ATTRS = Y.CanvasShape.ATTRS;
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2499);
Y.CanvasRect = CanvasRect;
/**
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> implementation of the <a href="Ellipse.html">`Ellipse`</a> class. 
 * `CanvasEllipse` is not intended to be used directly. Instead, use the <a href="Ellipse.html">`Ellipse`</a> class. 
 * If the browser lacks <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities but has 
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> capabilities, the <a href="Ellipse.html">`Ellipse`</a> 
 * class will point to the `CanvasEllipse` class.
 *
 * @module graphics
 * @class CanvasEllipse
 * @constructor
 */
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2511);
CanvasEllipse = function(cfg)
{
	_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "CanvasEllipse", 2511);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2513);
CanvasEllipse.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2516);
CanvasEllipse.NAME = "ellipse";

_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2518);
Y.extend(CanvasEllipse, CanvasShape, {
	/**
	 * Indicates the type of shape
	 *
	 * @property _type
	 * @type String
     * @private
	 */
	_type: "ellipse",

	/**
     * Draws the shape.
     *
     * @method _draw
	 * @private
	 */
	_draw: function()
	{
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_draw", 2534);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2536);
var w = this.get("width"),
			h = this.get("height");
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2538);
this.clear();
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2539);
this.drawEllipse(0, 0, w, h);
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2540);
this._closePath();
	}
});
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2543);
CanvasEllipse.ATTRS = Y.merge(CanvasShape.ATTRS, {
	/**
	 * Horizontal radius for the ellipse. 
	 *
	 * @config xRadius
	 * @type Number
	 */
	xRadius: {
		setter: function(val)
		{
			_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "setter", 2551);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2553);
this.set("width", val * 2);
		},

		getter: function()
		{
			_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "getter", 2556);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2558);
var val = this.get("width");
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2559);
if(val) 
			{
				_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2561);
val *= 0.5;
			}
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2563);
return val;
		}
	},

	/**
	 * Vertical radius for the ellipse. 
	 *
	 * @config yRadius
	 * @type Number
	 * @readOnly
	 */
	yRadius: {
		setter: function(val)
		{
			_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "setter", 2575);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2577);
this.set("height", val * 2);
		},

		getter: function()
		{
			_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "getter", 2580);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2582);
var val = this.get("height");
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2583);
if(val) 
			{
				_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2585);
val *= 0.5;
			}
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2587);
return val;
		}
	}
});
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2591);
Y.CanvasEllipse = CanvasEllipse;
/**
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> implementation of the <a href="Circle.html">`Circle`</a> class. 
 * `CanvasCircle` is not intended to be used directly. Instead, use the <a href="Circle.html">`Circle`</a> class. 
 * If the browser lacks <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities but has 
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> capabilities, the <a href="Circle.html">`Circle`</a> 
 * class will point to the `CanvasCircle` class.
 *
 * @module graphics
 * @class CanvasCircle
 * @constructor
 */
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2603);
CanvasCircle = function(cfg)
{
	_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "CanvasCircle", 2603);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2605);
CanvasCircle.superclass.constructor.apply(this, arguments);
};
    
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2608);
CanvasCircle.NAME = "circle";

_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2610);
Y.extend(CanvasCircle, Y.CanvasShape, {
	/**
	 * Indicates the type of shape
	 *
	 * @property _type
	 * @type String
     * @private
	 */
	_type: "circle",

	/**
     * Draws the shape.
     *
     * @method _draw
	 * @private
	 */
	_draw: function()
	{
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_draw", 2626);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2628);
var radius = this.get("radius");
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2629);
if(radius)
		{
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2631);
this.clear();
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2632);
this.drawCircle(0, 0, radius);
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2633);
this._closePath();
		}
	}
});

_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2638);
CanvasCircle.ATTRS = Y.merge(Y.CanvasShape.ATTRS, {
	/**
	 * Indicates the width of the shape
	 *
	 * @config width
	 * @type Number
	 */
	width: {
        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "setter", 2646);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2648);
this.set("radius", val/2);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2649);
return val;
        },

		getter: function()
		{
			_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "getter", 2652);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2654);
return this.get("radius") * 2;
		}
	},

	/**
	 * Indicates the height of the shape
	 *
	 * @config height
	 * @type Number
	 */
	height: {
        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "setter", 2665);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2667);
this.set("radius", val/2);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2668);
return val;
        },

		getter: function()
		{
			_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "getter", 2671);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2673);
return this.get("radius") * 2;
		}
	},

	/**
	 * Radius of the circle
	 *
	 * @config radius
     * @type Number
	 */
	radius: {
		lazyAdd: false
	}
});
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2687);
Y.CanvasCircle = CanvasCircle;
/**
 * Draws pie slices
 *
 * @module graphics
 * @class CanvasPieSlice
 * @constructor
 */
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2695);
CanvasPieSlice = function()
{
	_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "CanvasPieSlice", 2695);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2697);
CanvasPieSlice.superclass.constructor.apply(this, arguments);
};
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2699);
CanvasPieSlice.NAME = "canvasPieSlice";
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2700);
Y.extend(CanvasPieSlice, Y.CanvasShape, {
    /**
     * Indicates the type of shape
     *
     * @property _type
     * @type String
     * @private
     */
    _type: "path",

	/**
	 * Change event listener
	 *
	 * @private
	 * @method _updateHandler
	 */
	_draw: function(e)
	{
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_draw", 2716);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2718);
var x = this.get("cx"),
            y = this.get("cy"),
            startAngle = this.get("startAngle"),
            arc = this.get("arc"),
            radius = this.get("radius");
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2723);
this.clear();
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2724);
this._left = x;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2725);
this._right = radius;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2726);
this._top = y;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2727);
this._bottom = radius;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2728);
this.drawWedge(x, y, startAngle, arc, radius);
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2729);
this.end();
	}
 });
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2732);
CanvasPieSlice.ATTRS = Y.mix({
    cx: {
        value: 0
    },

    cy: {
        value: 0
    },
    /**
     * Starting angle in relation to a circle in which to begin the pie slice drawing.
     *
     * @config startAngle
     * @type Number
     */
    startAngle: {
        value: 0
    },

    /**
     * Arc of the slice.
     *
     * @config arc
     * @type Number
     */
    arc: {
        value: 0
    },

    /**
     * Radius of the circle in which the pie slice is drawn
     *
     * @config radius
     * @type Number
     */
    radius: {
        value: 0
    }
}, Y.CanvasShape.ATTRS);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2770);
Y.CanvasPieSlice = CanvasPieSlice;
/**
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> implementation of the `Graphic` class. 
 * `CanvasGraphic` is not intended to be used directly. Instead, use the <a href="Graphic.html">`Graphic`</a> class. 
 * If the browser lacks <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities but has 
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> capabilities, the <a href="Graphic.html">`Graphic`</a> 
 * class will point to the `CanvasGraphic` class.
 *
 * @module graphics
 * @class CanvasGraphic
 * @constructor
 */
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2782);
function CanvasGraphic(config) {
    
    _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "CanvasGraphic", 2782);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2784);
CanvasGraphic.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2787);
CanvasGraphic.NAME = "canvasGraphic";

_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2789);
CanvasGraphic.ATTRS = {
    /**
     * Whether or not to render the `Graphic` automatically after to a specified parent node after init. This can be a Node instance or a CSS selector string.
     * 
     * @config render
     * @type Node | String 
     */
    render: {},
	
    /**
	 * Unique id for class instance.
	 *
	 * @config id
	 * @type String
	 */
	id: {
		valueFn: function()
		{
			_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "valueFn", 2805);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2807);
return Y.guid();
		},

		setter: function(val)
		{
			_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "setter", 2810);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2812);
var node = this._node;
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2813);
if(node)
			{
				_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2815);
node.setAttribute("id", val);
			}
			_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2817);
return val;
		}
	},

    /**
     * Key value pairs in which a shape instance is associated with its id.
     *
     *  @config shapes
     *  @type Object
     *  @readOnly
     */
    shapes: {
        readOnly: true,

        getter: function()
        {
            _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "getter", 2831);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2833);
return this._shapes;
        }
    },

    /**
     *  Object containing size and coordinate data for the content of a Graphic in relation to the graphic instance's position.
     *
     *  @config contentBounds 
     *  @type Object
     *  @readOnly
     */
    contentBounds: {
        readOnly: true,

        getter: function()
        {
            _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "getter", 2847);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2849);
return this._contentBounds;
        }
    },

    /**
     *  The outermost html element of the Graphic instance.
     *
     *  @config node
     *  @type HTMLElement
     *  @readOnly
     */
    node: {
        readOnly: true,

        getter: function()
        {
            _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "getter", 2863);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2865);
return this._node;
        }
    },

	/**
	 * Indicates the width of the `Graphic`. 
	 *
	 * @config width
	 * @type Number
	 */
    width: {
        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "setter", 2876);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2878);
if(this._node)
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2880);
this._node.style.width = val + "px";            
            }
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2882);
return val;
        }
    },

	/**
	 * Indicates the height of the `Graphic`. 
	 *
	 * @config height 
	 * @type Number
	 */
    height: {
        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "setter", 2893);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2895);
if(this._node)
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2897);
this._node.style.height = val + "px";
            }
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2899);
return val;
        }
    },

    /**
     *  Determines the sizing of the Graphic. 
     *
     *  <dl>
     *      <dt>sizeContentToGraphic</dt><dd>The Graphic's width and height attributes are, either explicitly set through the <code>width</code> and <code>height</code>
     *      attributes or are determined by the dimensions of the parent element. The content contained in the Graphic will be sized to fit with in the Graphic instance's 
     *      dimensions. When using this setting, the <code>preserveAspectRatio</code> attribute will determine how the contents are sized.</dd>
     *      <dt>sizeGraphicToContent</dt><dd>(Also accepts a value of true) The Graphic's width and height are determined by the size and positioning of the content.</dd>
     *      <dt>false</dt><dd>The Graphic's width and height attributes are, either explicitly set through the <code>width</code> and <code>height</code>
     *      attributes or are determined by the dimensions of the parent element. The contents of the Graphic instance are not affected by this setting.</dd>
     *  </dl>
     *
     *
     *  @config autoSize
     *  @type Boolean | String
     *  @default false
     */
    autoSize: {
        value: false
    },

    /**
     * Determines how content is sized when <code>autoSize</code> is set to <code>sizeContentToGraphic</code>.
     *
     *  <dl>
     *      <dt>none<dt><dd>Do not force uniform scaling. Scale the graphic content of the given element non-uniformly if necessary 
     *      such that the element's bounding box exactly matches the viewport rectangle.</dd>
     *      <dt>xMinYMin</dt><dd>Force uniform scaling position along the top left of the Graphic's node.</dd>
     *      <dt>xMidYMin</dt><dd>Force uniform scaling horizontally centered and positioned at the top of the Graphic's node.<dd>
     *      <dt>xMaxYMin</dt><dd>Force uniform scaling positioned horizontally from the right and vertically from the top.</dd>
     *      <dt>xMinYMid</dt>Force uniform scaling positioned horizontally from the left and vertically centered.</dd>
     *      <dt>xMidYMid (the default)</dt><dd>Force uniform scaling with the content centered.</dd>
     *      <dt>xMaxYMid</dt><dd>Force uniform scaling positioned horizontally from the right and vertically centered.</dd>
     *      <dt>xMinYMax</dt><dd>Force uniform scaling positioned horizontally from the left and vertically from the bottom.</dd>
     *      <dt>xMidYMax</dt><dd>Force uniform scaling horizontally centered and position vertically from the bottom.</dd>
     *      <dt>xMaxYMax</dt><dd>Force uniform scaling positioned horizontally from the right and vertically from the bottom.</dd>
     *  </dl>
     * 
     * @config preserveAspectRatio
     * @type String
     * @default xMidYMid
     */
    preserveAspectRatio: {
        value: "xMidYMid"
    },

    /**
     * The contentBounds will resize to greater values but not smaller values. (for performance)
     * When resizing the contentBounds down is desirable, set the resizeDown value to true.
     *
     * @config resizeDown 
     * @type Boolean
     */
    resizeDown: {
        value: false
    },

	/**
	 * Indicates the x-coordinate for the instance.
	 *
	 * @config x
	 * @type Number
	 */
    x: {
        getter: function()
        {
            _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "getter", 2967);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2969);
return this._x;
        },

        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "setter", 2972);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2974);
this._x = val;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2975);
if(this._node)
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2977);
this._node.style.left = val + "px";
            }
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2979);
return val;
        }
    },

	/**
	 * Indicates the y-coordinate for the instance.
	 *
	 * @config y
	 * @type Number
	 */
    y: {
        getter: function()
        {
            _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "getter", 2990);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2992);
return this._y;
        },

        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "setter", 2995);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2997);
this._y = val;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 2998);
if(this._node)
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3000);
this._node.style.top = val + "px";
            }
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3002);
return val;
        }
    },

    /**
     * Indicates whether or not the instance will automatically redraw after a change is made to a shape.
     * This property will get set to false when batching operations.
     *
     * @config autoDraw
     * @type Boolean
     * @default true
     * @private
     */
    autoDraw: {
        value: true
    },

	/**
	 * Indicates whether the `Graphic` and its children are visible.
	 *
	 * @config visible
	 * @type Boolean
	 */
    visible: {
        value: true,

        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "setter", 3028);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3030);
this._toggleVisible(val);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3031);
return val;
        }
    }
};

_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3036);
Y.extend(CanvasGraphic, Y.GraphicBase, {
    /**
     * Sets the value of an attribute.
     *
     * @method set
     * @param {String|Object} name The name of the attribute. Alternatively, an object of key value pairs can 
     * be passed in to set multiple attributes at once.
     * @param {Any} value The value to set the attribute to. This value is ignored if an object is received as 
     * the name param.
     */
	set: function(attr, value) 
	{
		_yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "set", 3046);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3048);
var host = this,
            redrawAttrs = {
                autoDraw: true,
                autoSize: true,
                preserveAspectRatio: true,
                resizeDown: true
            },
            key,
            forceRedraw = false;
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3057);
AttributeLite.prototype.set.apply(host, arguments);	
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3058);
if(host._state.autoDraw === true && Y.Object.size(this._shapes) > 0)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3060);
if(Y_LANG.isString && redrawAttrs[attr])
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3062);
forceRedraw = true;
            }
            else {_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3064);
if(Y_LANG.isObject(attr))
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3066);
for(key in redrawAttrs)
                {
                    _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3068);
if(redrawAttrs.hasOwnProperty(key) && attr[key])
                    {
                        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3070);
forceRedraw = true;
                        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3071);
break;
                    }
                }
            }}
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3076);
if(forceRedraw)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3078);
host._redraw();
        }
	},

    /**
     * Storage for `x` attribute.
     *
     * @property _x
     * @type Number
     * @private
     */
    _x: 0,

    /**
     * Storage for `y` attribute.
     *
     * @property _y
     * @type Number
     * @private
     */
    _y: 0,

    /**
     * Gets the current position of the graphic instance in page coordinates.
     *
     * @method getXY
     * @return Array The XY position of the shape.
     */
    getXY: function()
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "getXY", 3106);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3108);
var node = Y.one(this._node),
            xy;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3110);
if(node)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3112);
xy = node.getXY();
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3114);
return xy;
    },
    
	/**
     * Initializes the class.
     *
     * @method initializer
     * @param {Object} config Optional attributes 
     * @private
     */
    initializer: function(config) {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "initializer", 3124);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3125);
var render = this.get("render"),
            visibility = this.get("visible") ? "visible" : "hidden",
            w = this.get("width") || 0,
            h = this.get("height") || 0;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3129);
this._shapes = {};
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3130);
this._redrawQueue = {};
		_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3131);
this._contentBounds = {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        };
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3137);
this._node = DOCUMENT.createElement('div');
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3138);
this._node.style.position = "absolute";
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3139);
this._node.style.visibility = visibility;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3140);
this.set("width", w);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3141);
this.set("height", h);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3142);
if(render)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3144);
this.render(render);
        }
    },

    /**
     * Adds the graphics node to the dom.
     * 
     * @method render
     * @param {HTMLElement} parentNode node in which to render the graphics node into.
     */
    render: function(render) {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "render", 3154);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3155);
var parentNode = Y.one(render),
            node = this._node,
            w = this.get("width") || parseInt(parentNode.getComputedStyle("width"), 10),
            h = this.get("height") || parseInt(parentNode.getComputedStyle("height"), 10);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3159);
parentNode = parentNode || DOCUMENT.body;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3160);
parentNode.appendChild(node);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3161);
node.style.display = "block";
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3162);
node.style.position = "absolute";
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3163);
node.style.left = "0px";
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3164);
node.style.top = "0px";
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3165);
this.set("width", w);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3166);
this.set("height", h);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3167);
this.parentNode = parentNode;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3168);
return this;
    },

    /**
     * Removes all nodes.
     *
     * @method destroy
     */
    destroy: function()
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "destroy", 3176);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3178);
this.removeAllShapes();
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3179);
if(this._node)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3181);
this._removeChildren(this._node);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3182);
Y.one(this._node).destroy();
        }
    },

    /**
     * Generates a shape instance by type.
     *
     * @method addShape
     * @param {Object} cfg attributes for the shape
     * @return Shape
     */
    addShape: function(cfg)
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "addShape", 3193);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3195);
cfg.graphic = this;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3196);
if(!this.get("visible"))
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3198);
cfg.visible = false;
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3200);
var shapeClass = this._getShapeClass(cfg.type),
            shape = new shapeClass(cfg);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3202);
this._appendShape(shape);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3203);
return shape;
    },

    /**
     * Adds a shape instance to the graphic instance.
     *
     * @method _appendShape
     * @param {Shape} shape The shape instance to be added to the graphic.
     * @private
     */
    _appendShape: function(shape)
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_appendShape", 3213);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3215);
var node = shape.node,
            parentNode = this._frag || this._node;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3217);
if(this.get("autoDraw")) 
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3219);
parentNode.appendChild(node);
        }
        else
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3223);
this._getDocFrag().appendChild(node);
        }
    },

    /**
     * Removes a shape instance from from the graphic instance.
     *
     * @method removeShape
     * @param {Shape|String} shape The instance or id of the shape to be removed.
     */
    removeShape: function(shape)
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "removeShape", 3233);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3235);
if(!(shape instanceof CanvasShape))
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3237);
if(Y_LANG.isString(shape))
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3239);
shape = this._shapes[shape];
            }
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3242);
if(shape && shape instanceof CanvasShape)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3244);
shape._destroy();
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3245);
delete this._shapes[shape.get("id")];
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3247);
if(this.get("autoDraw")) 
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3249);
this._redraw();
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3251);
return shape;
    },

    /**
     * Removes all shape instances from the dom.
     *
     * @method removeAllShapes
     */
    removeAllShapes: function()
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "removeAllShapes", 3259);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3261);
var shapes = this._shapes,
            i;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3263);
for(i in shapes)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3265);
if(shapes.hasOwnProperty(i))
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3267);
shapes[i].destroy();
            }
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3270);
this._shapes = {};
    },
    
    /**
     * Clears the graphics object.
     *
     * @method clear
     */
    clear: function() {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "clear", 3278);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3279);
this.removeAllShapes();
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
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_removeChildren", 3289);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3291);
if(node && node.hasChildNodes())
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3293);
var child;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3294);
while(node.firstChild)
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3296);
child = node.firstChild;
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3297);
this._removeChildren(child);
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3298);
node.removeChild(child);
            }
        }
    },
    
    /**
     * Toggles visibility
     *
     * @method _toggleVisible
     * @param {Boolean} val indicates visibilitye
     * @private
     */
    _toggleVisible: function(val)
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_toggleVisible", 3310);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3312);
var i,
            shapes = this._shapes,
            visibility = val ? "visible" : "hidden";
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3315);
if(shapes)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3317);
for(i in shapes)
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3319);
if(shapes.hasOwnProperty(i))
                {
                    _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3321);
shapes[i].set("visible", val);
                }
            }
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3325);
if(this._node)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3327);
this._node.style.visibility = visibility;
        }
    },

    /**
     * Returns a shape class. Used by `addShape`. 
     *
     * @method _getShapeClass
     * @param {Shape | String} val Indicates which shape class. 
     * @return Function 
     * @private
     */
    _getShapeClass: function(val)
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_getShapeClass", 3339);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3341);
var shape = this._shapeClass[val];
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3342);
if(shape)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3344);
return shape;
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3346);
return val;
    },
    
    /**
     * Look up for shape classes. Used by `addShape` to retrieve a class for instantiation.
     *
     * @property _shapeClass
     * @type Object
     * @private
     */
    _shapeClass: {
        circle: Y.CanvasCircle,
        rect: Y.CanvasRect,
        path: Y.CanvasPath,
        ellipse: Y.CanvasEllipse,
        pieslice: Y.CanvasPieSlice
    },
    
    /**
     * Returns a shape based on the id of its dom node.
     *
     * @method getShapeById
     * @param {String} id Dom id of the shape's node attribute.
     * @return Shape
     */
    getShapeById: function(id)
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "getShapeById", 3371);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3373);
var shape = this._shapes[id];
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3374);
return shape;
    },

	/**
	 * Allows for creating multiple shapes in order to batch appending and redraw operations.
	 *
	 * @method batch
	 * @param {Function} method Method to execute.
	 */
    batch: function(method)
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "batch", 3383);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3385);
var autoDraw = this.get("autoDraw");
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3386);
this.set("autoDraw", false);
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3387);
method();
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3388);
this.set("autoDraw", autoDraw);
    },

    /**
     * Returns a document fragment to for attaching shapes.
     *
     * @method _getDocFrag
     * @return DocumentFragment
     * @private
     */
    _getDocFrag: function()
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_getDocFrag", 3398);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3400);
if(!this._frag)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3402);
this._frag = DOCUMENT.createDocumentFragment();
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3404);
return this._frag;
    },
    
    /**
     * Redraws all shapes.
     *
     * @method _redraw
     * @private
     */
    _redraw: function()
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_redraw", 3413);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3415);
var autoSize = this.get("autoSize"),
            preserveAspectRatio = this.get("preserveAspectRatio"),
            box = this.get("resizeDown") ? this._getUpdatedContentBounds() : this._contentBounds,
            contentWidth,
            contentHeight,
            w,
            h,
            xScale,
            yScale,
            translateX = 0,
            translateY = 0,
            matrix,
            node = this.get("node");
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3428);
if(autoSize)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3430);
if(autoSize == "sizeContentToGraphic")
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3432);
contentWidth = box.right - box.left;
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3433);
contentHeight = box.bottom - box.top;
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3434);
w = parseFloat(Y_DOM.getComputedStyle(node, "width"));
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3435);
h = parseFloat(Y_DOM.getComputedStyle(node, "height"));
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3436);
matrix = new Y.Matrix();
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3437);
if(preserveAspectRatio == "none")
                {
                    _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3439);
xScale = w/contentWidth;
                    _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3440);
yScale = h/contentHeight;
                }
                else
                {
                    _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3444);
if(contentWidth/contentHeight !== w/h) 
                    {
                        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3446);
if(contentWidth * h/contentHeight > w)
                        {
                            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3448);
xScale = yScale = w/contentWidth;
                            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3449);
translateY = this._calculateTranslate(preserveAspectRatio.slice(5).toLowerCase(), contentHeight * w/contentWidth, h);
                        }
                        else
                        {
                            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3453);
xScale = yScale = h/contentHeight;
                            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3454);
translateX = this._calculateTranslate(preserveAspectRatio.slice(1, 4).toLowerCase(), contentWidth * h/contentHeight, w);
                        }
                    }
                }
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3458);
Y_DOM.setStyle(node, "transformOrigin", "0% 0%");
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3459);
translateX = translateX - (box.left * xScale);
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3460);
translateY = translateY - (box.top * yScale);
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3461);
matrix.translate(translateX, translateY);
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3462);
matrix.scale(xScale, yScale);
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3463);
Y_DOM.setStyle(node, "transform", matrix.toCSSText());
            }
            else
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3467);
this.set("width", box.right);
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3468);
this.set("height", box.bottom);
            }
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3471);
if(this._frag)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3473);
this._node.appendChild(this._frag);
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3474);
this._frag = null;
        }
    },
    
    /**
     * Determines the value for either an x or y value to be used for the <code>translate</code> of the Graphic.
     *
     * @method _calculateTranslate
     * @param {String} position The position for placement. Possible values are min, mid and max.
     * @param {Number} contentSize The total size of the content.
     * @param {Number} boundsSize The total size of the Graphic.
     * @return Number
     * @private
     */
    _calculateTranslate: function(position, contentSize, boundsSize)
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_calculateTranslate", 3488);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3490);
var ratio = boundsSize - contentSize,
            coord;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3492);
switch(position)
        {
            case "mid" :
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3495);
coord = ratio * 0.5;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3496);
break;
            case "max" :
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3498);
coord = ratio;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3499);
break;
            default :
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3501);
coord = 0;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3502);
break;
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3504);
return coord;
    },
    
    /**
     * Adds a shape to the redraw queue and calculates the contentBounds. Used internally 
     * by `Shape` instances.
     *
     * @method addToRedrawQueue
     * @param Shape shape The shape instance to add to the queue
     * @protected
     */
    addToRedrawQueue: function(shape)
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "addToRedrawQueue", 3515);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3517);
var shapeBox,
            box;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3519);
this._shapes[shape.get("id")] = shape;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3520);
if(!this.get("resizeDown"))
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3522);
shapeBox = shape.getBounds();
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3523);
box = this._contentBounds;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3524);
box.left = box.left < shapeBox.left ? box.left : shapeBox.left;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3525);
box.top = box.top < shapeBox.top ? box.top : shapeBox.top;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3526);
box.right = box.right > shapeBox.right ? box.right : shapeBox.right;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3527);
box.bottom = box.bottom > shapeBox.bottom ? box.bottom : shapeBox.bottom;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3528);
this._contentBounds = box;
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3530);
if(this.get("autoDraw")) 
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3532);
this._redraw();
        }
    },

    /**
     * Recalculates and returns the `contentBounds` for the `Graphic` instance.
     *
     * @method _getUpdatedContentBounds
     * @return {Object} 
     * @private
     */
    _getUpdatedContentBounds: function()
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_getUpdatedContentBounds", 3543);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3545);
var bounds,
            i,
            shape,
            queue = this._shapes,
            box = {};
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3550);
for(i in queue)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3552);
if(queue.hasOwnProperty(i))
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3554);
shape = queue[i];
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3555);
bounds = shape.getBounds();
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3556);
box.left = Y_LANG.isNumber(box.left) ? Math.min(box.left, bounds.left) : bounds.left;
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3557);
box.top = Y_LANG.isNumber(box.top) ? Math.min(box.top, bounds.top) : bounds.top;
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3558);
box.right = Y_LANG.isNumber(box.right) ? Math.max(box.right, bounds.right) : bounds.right;
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3559);
box.bottom = Y_LANG.isNumber(box.bottom) ? Math.max(box.bottom, bounds.bottom) : bounds.bottom;
            }
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3562);
box.left = Y_LANG.isNumber(box.left) ? box.left : 0;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3563);
box.top = Y_LANG.isNumber(box.top) ? box.top : 0;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3564);
box.right = Y_LANG.isNumber(box.right) ? box.right : 0;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3565);
box.bottom = Y_LANG.isNumber(box.bottom) ? box.bottom : 0;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3566);
this._contentBounds = box;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3567);
return box;
    },

    /**
     * Inserts shape on the top of the tree.
     *
     * @method _toFront
     * @param {CanvasShape} Shape to add.
     * @private
     */
    _toFront: function(shape)
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_toFront", 3577);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3579);
var contentNode = this.get("node");
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3580);
if(shape instanceof Y.CanvasShape)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3582);
shape = shape.get("node");
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3584);
if(contentNode && shape)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3586);
contentNode.appendChild(shape);
        }
    },

    /**
     * Inserts shape as the first child of the content node.
     *
     * @method _toBack
     * @param {CanvasShape} Shape to add.
     * @private
     */
    _toBack: function(shape)
    {
        _yuitest_coverfunc("build/graphics-canvas/graphics-canvas.js", "_toBack", 3597);
_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3599);
var contentNode = this.get("node"),
            targetNode;
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3601);
if(shape instanceof Y.CanvasShape)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3603);
shape = shape.get("node");
        }
        _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3605);
if(contentNode && shape)
        {
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3607);
targetNode = contentNode.firstChild;
            _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3608);
if(targetNode)
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3610);
contentNode.insertBefore(shape, targetNode);
            }
            else
            {
                _yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3614);
contentNode.appendChild(shape);
            }
        }
    }
});

_yuitest_coverline("build/graphics-canvas/graphics-canvas.js", 3620);
Y.CanvasGraphic = CanvasGraphic;


}, '@VERSION@', {"requires": ["graphics"]});
