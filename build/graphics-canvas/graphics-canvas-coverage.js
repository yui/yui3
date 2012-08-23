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
_yuitest_coverage["graphics-canvas"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "graphics-canvas",
    code: []
};
_yuitest_coverage["graphics-canvas"].code=["YUI.add('graphics-canvas', function (Y, NAME) {","","var SHAPE = \"canvasShape\",","    DOCUMENT = Y.config.doc,","    Y_LANG = Y.Lang,","    AttributeLite = Y.AttributeLite,","	CanvasShape,","	CanvasPath,","	CanvasRect,","    CanvasEllipse,","	CanvasCircle,","    CanvasPieSlice,","    Y_DOM = Y.DOM,","    Y_Color = Y.Color,","    PARSE_INT = parseInt,","    PARSE_FLOAT = parseFloat,","    IS_NUMBER = Y_LANG.isNumber,","    RE = RegExp,","    TORGB = Y_Color.toRGB,","    TOHEX = Y_Color.toHex,","    _getClassName = Y.ClassNameManager.getClassName;","","/**"," * <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> implementation of the <a href=\"Drawing.html\">`Drawing`</a> class. "," * `CanvasDrawing` is not intended to be used directly. Instead, use the <a href=\"Drawing.html\">`Drawing`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities but has "," * <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> capabilities, the <a href=\"Drawing.html\">`Drawing`</a> "," * class will point to the `CanvasDrawing` class."," *"," * @module graphics"," * @class CanvasDrawing"," * @constructor"," */","function CanvasDrawing()","{","}","","CanvasDrawing.prototype = {","    /**","     * Current x position of the drawing.","     *","     * @property _currentX","     * @type Number","     * @private","     */","    _currentX: 0,","","    /**","     * Current y position of the drqwing.","     *","     * @property _currentY","     * @type Number","     * @private","     */","    _currentY: 0,","    ","    /**","     * Parses hex color string and alpha value to rgba","     *","     * @method _toRGBA","     * @param {Object} val Color value to parse. Can be hex string, rgb or name.","     * @param {Number} alpha Numeric value between 0 and 1 representing the alpha level.","     * @private","     */","    _toRGBA: function(val, alpha) {","        alpha = (alpha !== undefined) ? alpha : 1;","        if (!Y_Color.re_RGB.test(val)) {","            val = TOHEX(val);","        }","","        if(Y_Color.re_hex.exec(val)) {","            val = 'rgba(' + [","                PARSE_INT(RE.$1, 16),","                PARSE_INT(RE.$2, 16),","                PARSE_INT(RE.$3, 16)","            ].join(',') + ',' + alpha + ')';","        }","        return val;","    },","","    /**","     * Converts color to rgb format","     *","     * @method _toRGB","     * @param val Color value to convert.","     * @private ","     */","    _toRGB: function(val) {","        return TORGB(val);","    },","","    /**","     * Sets the size of the graphics object.","     * ","     * @method setSize","     * @param w {Number} width to set for the instance.","     * @param h {Number} height to set for the instance.","     * @private","     */","	setSize: function(w, h) {","        if(this.get(\"autoSize\"))","        {","            if(w > this.node.getAttribute(\"width\"))","            {","                this.node.style.width = w + \"px\";","                this.node.setAttribute(\"width\", w);","            }","            if(h > this.node.getAttribute(\"height\"))","            {","                this.node.style.height = h + \"px\";","                this.node.setAttribute(\"height\", h);","            }","        }","    },","    ","	/**","     * Tracks coordinates. Used to calculate the start point of dashed lines. ","     *","     * @method _updateCoords","     * @param {Number} x x-coordinate","     * @param {Number} y y-coordinate","	 * @private","	 */","    _updateCoords: function(x, y)","    {","        this._xcoords.push(x);","        this._ycoords.push(y);","        this._currentX = x;","        this._currentY = y;","    },","","	/**","     * Clears the coordinate arrays. Called at the end of a drawing operation.  ","	 * ","     * @method _clearAndUpdateCoords","     * @private","	 */","    _clearAndUpdateCoords: function()","    {","        var x = this._xcoords.pop() || 0,","            y = this._ycoords.pop() || 0;","        this._updateCoords(x, y);","    },","","	/**","     * Moves the shape's dom node.","     *","     * @method _updateNodePosition","	 * @private","	 */","    _updateNodePosition: function()","    {","        var node = this.get(\"node\"),","            x = this.get(\"x\"),","            y = this.get(\"y\"); ","        node.style.position = \"absolute\";","        node.style.left = (x + this._left) + \"px\";","        node.style.top = (y + this._top) + \"px\";","    },","    ","    /**","     * Queues up a method to be executed when a shape redraws.","     *","     * @method _updateDrawingQueue","     * @param {Array} val An array containing data that can be parsed into a method and arguments. The value at zero-index of the array is a string reference of","     * the drawing method that will be called. All subsequent indices are argument for that method. For example, `lineTo(10, 100)` would be structured as:","     * `[\"lineTo\", 10, 100]`.","     * @private","     */","    _updateDrawingQueue: function(val)","    {","        this._methods.push(val);","    },","    ","    /**","     * Draws a line segment using the current line style from the current drawing position to the specified x and y coordinates.","     * ","     * @method lineTo","     * @param {Number} point1 x-coordinate for the end point.","     * @param {Number} point2 y-coordinate for the end point.","     */","    lineTo: function(point1, point2, etc) ","    {","        var args = arguments, ","            i = 0, ","            len,","            x,","            y,","            wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0;","        if(!this._lineToMethods)","        {","            this._lineToMethods = [];","        }","        if (typeof point1 === 'string' || typeof point1 === 'number') {","            args = [[point1, point2]];","        }","","        len = args.length;","        for (; i < len; ++i) ","        {","            if(args[i])","            {","                x = args[i][0];","                y = args[i][1];","                this._updateDrawingQueue([\"lineTo\", x, y]);","                this._lineToMethods[this._lineToMethods.length] = this._methods[this._methods.length - 1];","                this._trackSize(x - wt, y - wt);","                this._trackSize(x + wt, y + wt);","                this._updateCoords(x, y);","            }","        }","        this._drawingComplete = false;","        return this;","    },","","    /**","     * Moves the current drawing position to specified x and y coordinates.","     *","     * @method moveTo","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    moveTo: function(x, y) {","        var wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0;","        this._updateDrawingQueue([\"moveTo\", x, y]);","        this._trackSize(x - wt, y - wt);","        this._trackSize(x + wt, y + wt);","        this._updateCoords(x, y);","        this._drawingComplete = false;","        return this;","    },","    ","    /**","     * Draws a bezier curve.","     *","     * @method curveTo","     * @param {Number} cp1x x-coordinate for the first control point.","     * @param {Number} cp1y y-coordinate for the first control point.","     * @param {Number} cp2x x-coordinate for the second control point.","     * @param {Number} cp2y y-coordinate for the second control point.","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    curveTo: function(cp1x, cp1y, cp2x, cp2y, x, y) {","        var w,","            h,","            pts,","            right,","            left,","            bottom,","            top;","        this._updateDrawingQueue([\"bezierCurveTo\", cp1x, cp1y, cp2x, cp2y, x, y]);","        this._drawingComplete = false;","        right = Math.max(x, Math.max(cp1x, cp2x));","        bottom = Math.max(y, Math.max(cp1y, cp2y));","        left = Math.min(x, Math.min(cp1x, cp2x));","        top = Math.min(y, Math.min(cp1y, cp2y));","        w = Math.abs(right - left);","        h = Math.abs(bottom - top);","        pts = [[this._currentX, this._currentY] , [cp1x, cp1y], [cp2x, cp2y], [x, y]]; ","        this._setCurveBoundingBox(pts, w, h);","        this._updateCoords(x, y);","        return this;","    },","","    /**","     * Draws a quadratic bezier curve.","     *","     * @method quadraticCurveTo","     * @param {Number} cpx x-coordinate for the control point.","     * @param {Number} cpy y-coordinate for the control point.","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    quadraticCurveTo: function(cpx, cpy, x, y) {","        var w,","            h,","            pts,","            right,","            left,","            bottom,","            top,","            wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0;","        this._updateDrawingQueue([\"quadraticCurveTo\", cpx, cpy, x, y]);","        this._drawingComplete = false;","        right = Math.max(x, cpx);","        bottom = Math.max(y, cpy);","        left = Math.min(x, cpx);","        top = Math.min(y, cpy);","        w = Math.abs(right - left);","        h = Math.abs(bottom - top);","        pts = [[this._currentX, this._currentY] , [cpx, cpy], [x, y]]; ","        this._setCurveBoundingBox(pts, w, h);","        this._updateCoords(x, y);","        return this;","    },","","    /**","     * Draws a circle. Used internally by `CanvasCircle` class.","     *","     * @method drawCircle","     * @param {Number} x y-coordinate","     * @param {Number} y x-coordinate","     * @param {Number} r radius","     * @protected","     */","	drawCircle: function(x, y, radius) {","        var startAngle = 0,","            endAngle = 2 * Math.PI,","            wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0,","            circum = radius * 2;","            circum += wt;","        this._drawingComplete = false;","        this._trackSize(x + circum, y + circum);","        this._trackSize(x - wt, y - wt);","        this._updateCoords(x, y);","        this._updateDrawingQueue([\"arc\", x + radius, y + radius, radius, startAngle, endAngle, false]);","        return this;","    },","","    /**","     * Draws a diamond.     ","     * ","     * @method drawDiamond","     * @param {Number} x y-coordinate","     * @param {Number} y x-coordinate","     * @param {Number} width width","     * @param {Number} height height","     * @protected","     */","    drawDiamond: function(x, y, width, height)","    {","        var midWidth = width * 0.5,","            midHeight = height * 0.5;","        this.moveTo(x + midWidth, y);","        this.lineTo(x + width, y + midHeight);","        this.lineTo(x + midWidth, y + height);","        this.lineTo(x, y + midHeight);","        this.lineTo(x + midWidth, y);","        return this;","    },","","    /**","     * Draws an ellipse. Used internally by `CanvasEllipse` class.","     *","     * @method drawEllipse","     * @param {Number} x x-coordinate","     * @param {Number} y y-coordinate","     * @param {Number} w width","     * @param {Number} h height","     * @protected","     */","	drawEllipse: function(x, y, w, h) {","        var l = 8,","            theta = -(45/180) * Math.PI,","            angle = 0,","            angleMid,","            radius = w/2,","            yRadius = h/2,","            i = 0,","            centerX = x + radius,","            centerY = y + yRadius,","            ax, ay, bx, by, cx, cy,","            wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0;","","        ax = centerX + Math.cos(0) * radius;","        ay = centerY + Math.sin(0) * yRadius;","        this.moveTo(ax, ay);","        for(; i < l; i++)","        {","            angle += theta;","            angleMid = angle - (theta / 2);","            bx = centerX + Math.cos(angle) * radius;","            by = centerY + Math.sin(angle) * yRadius;","            cx = centerX + Math.cos(angleMid) * (radius / Math.cos(theta / 2));","            cy = centerY + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));","            this._updateDrawingQueue([\"quadraticCurveTo\", cx, cy, bx, by]);","        }","        this._trackSize(x + w + wt, y + h + wt);","        this._trackSize(x - wt, y - wt);","        this._updateCoords(x, y);","        return this;","    },","","    /**","     * Draws a rectangle.","     *","     * @method drawRect","     * @param {Number} x x-coordinate","     * @param {Number} y y-coordinate","     * @param {Number} w width","     * @param {Number} h height","     */","    drawRect: function(x, y, w, h) {","        var wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0;","        this._drawingComplete = false;","        this.moveTo(x, y);","        this.lineTo(x + w, y);","        this.lineTo(x + w, y + h);","        this.lineTo(x, y + h);","        this.lineTo(x, y);","        return this;","    },","","    /**","     * Draws a rectangle with rounded corners.","     * ","     * @method drawRect","     * @param {Number} x x-coordinate","     * @param {Number} y y-coordinate","     * @param {Number} w width","     * @param {Number} h height","     * @param {Number} ew width of the ellipse used to draw the rounded corners","     * @param {Number} eh height of the ellipse used to draw the rounded corners","     */","    drawRoundRect: function(x, y, w, h, ew, eh) {","        var wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0;","        this._drawingComplete = false;","        this.moveTo( x, y + eh);","        this.lineTo(x, y + h - eh);","        this.quadraticCurveTo(x, y + h, x + ew, y + h);","        this.lineTo(x + w - ew, y + h);","        this.quadraticCurveTo(x + w, y + h, x + w, y + h - eh);","        this.lineTo(x + w, y + eh);","        this.quadraticCurveTo(x + w, y, x + w - ew, y);","        this.lineTo(x + ew, y);","        this.quadraticCurveTo(x, y, x, y + eh);","        return this;","    },","    ","    /**","     * Draws a wedge.","     *","     * @method drawWedge","     * @param {Number} x x-coordinate of the wedge's center point","     * @param {Number} y y-coordinate of the wedge's center point","     * @param {Number} startAngle starting angle in degrees","     * @param {Number} arc sweep of the wedge. Negative values draw clockwise.","     * @param {Number} radius radius of wedge. If [optional] yRadius is defined, then radius is the x radius.","     * @param {Number} yRadius [optional] y radius for wedge.","     * @private","     */","    drawWedge: function(x, y, startAngle, arc, radius, yRadius)","    {","        var wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0,","            segs,","            segAngle,","            theta,","            angle,","            angleMid,","            ax,","            ay,","            bx,","            by,","            cx,","            cy,","            i = 0;","        yRadius = yRadius || radius;","","        this._drawingComplete = false;","        // move to x,y position","        this._updateDrawingQueue([\"moveTo\", x, y]);","        ","        yRadius = yRadius || radius;","        ","        // limit sweep to reasonable numbers","        if(Math.abs(arc) > 360)","        {","            arc = 360;","        }","        ","        // First we calculate how many segments are needed","        // for a smooth arc.","        segs = Math.ceil(Math.abs(arc) / 45);","        ","        // Now calculate the sweep of each segment.","        segAngle = arc / segs;","        ","        // The math requires radians rather than degrees. To convert from degrees","        // use the formula (degrees/180)*Math.PI to get radians.","        theta = -(segAngle / 180) * Math.PI;","        ","        // convert angle startAngle to radians","        angle = (startAngle / 180) * Math.PI;","        ","        // draw the curve in segments no larger than 45 degrees.","        if(segs > 0)","        {","            // draw a line from the center to the start of the curve","            ax = x + Math.cos(startAngle / 180 * Math.PI) * radius;","            ay = y + Math.sin(startAngle / 180 * Math.PI) * yRadius;","            this.lineTo(ax, ay);","            // Loop for drawing curve segments","            for(; i < segs; ++i)","            {","                angle += theta;","                angleMid = angle - (theta / 2);","                bx = x + Math.cos(angle) * radius;","                by = y + Math.sin(angle) * yRadius;","                cx = x + Math.cos(angleMid) * (radius / Math.cos(theta / 2));","                cy = y + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));","                this._updateDrawingQueue([\"quadraticCurveTo\", cx, cy, bx, by]);","            }","            // close the wedge by drawing a line to the center","            this._updateDrawingQueue([\"lineTo\", x, y]);","        }","        this._trackSize(0 - wt , 0 - wt);","        this._trackSize((radius * 2) + wt, (radius * 2) + wt);","        return this;","    },","    ","    /**","     * Completes a drawing operation. ","     *","     * @method end","     */","    end: function() {","        this._closePath();","        return this;","    },","","    /**","     * Ends a fill and stroke","     *","     * @method closePath","     */","    closePath: function()","    {","        this._updateDrawingQueue([\"closePath\"]);","        this._updateDrawingQueue([\"beginPath\"]);","    },","","	/**","	 * Clears the graphics object.","	 *","	 * @method clear","	 */","    ","    /**","     * Returns a linear gradient fill","     *","     * @method _getLinearGradient","     * @return CanvasGradient","     * @private","     */","    _getLinearGradient: function() {","        var isNumber = Y.Lang.isNumber,","            fill = this.get(\"fill\"),","            stops = fill.stops,","            opacity,","            color,","            stop,","            i = 0,","            len = stops.length,","            gradient,","            x = 0,","            y = 0,","            w = this.get(\"width\"),","            h = this.get(\"height\"),","            r = fill.rotation || 0,","            x1, x2, y1, y2,","            cx = x + w/2,","            cy = y + h/2,","            offset,","            radCon = Math.PI/180,","            tanRadians = parseFloat(parseFloat(Math.tan(r * radCon)).toFixed(8));","        if(Math.abs(tanRadians) * w/2 >= h/2)","        {","            if(r < 180)","            {","                y1 = y;","                y2 = y + h;","            }","            else","            {","                y1 = y + h;","                y2 = y;","            }","            x1 = cx - ((cy - y1)/tanRadians);","            x2 = cx - ((cy - y2)/tanRadians); ","        }","        else","        {","            if(r > 90 && r < 270)","            {","                x1 = x + w;","                x2 = x;","            }","            else","            {","                x1 = x;","                x2 = x + w;","            }","            y1 = ((tanRadians * (cx - x1)) - cy) * -1;","            y2 = ((tanRadians * (cx - x2)) - cy) * -1;","        }","        gradient = this._context.createLinearGradient(x1, y1, x2, y2);","        for(; i < len; ++i)","        {","            stop = stops[i];","            opacity = stop.opacity;","            color = stop.color;","            offset = stop.offset;","            if(isNumber(opacity))","            {","                opacity = Math.max(0, Math.min(1, opacity));","                color = this._toRGBA(color, opacity);","            }","            else","            {","                color = TORGB(color);","            }","            offset = stop.offset || i/(len - 1);","            gradient.addColorStop(offset, color);","        }","        return gradient;","    },","","    /**","     * Returns a radial gradient fill","     *","     * @method _getRadialGradient","     * @return CanvasGradient","     * @private","     */","    _getRadialGradient: function() {","        var isNumber = Y.Lang.isNumber,","            fill = this.get(\"fill\"),","            r = fill.r,","            fx = fill.fx,","            fy = fill.fy,","            stops = fill.stops,","            opacity,","            color,","            stop,","            i = 0,","            len = stops.length,","            gradient,","            x = 0,","            y = 0,","            w = this.get(\"width\"),","            h = this.get(\"height\"),","            x1, x2, y1, y2, r2, ","            xc, yc, xn, yn, d, ","            offset,","            ratio,","            stopMultiplier;","        xc = x + w/2;","        yc = y + h/2;","        x1 = w * fx;","        y1 = h * fy;","        x2 = x + w/2;","        y2 = y + h/2;","        r2 = w * r;","        d = Math.sqrt( Math.pow(Math.abs(xc - x1), 2) + Math.pow(Math.abs(yc - y1), 2) );","        if(d >= r2)","        {","            ratio = d/r2;","            //hack. gradient won't show if it is exactly on the edge of the arc","            if(ratio === 1)","            {","                ratio = 1.01;","            }","            xn = (x1 - xc)/ratio;","            yn = (y1 - yc)/ratio;","            xn = xn > 0 ? Math.floor(xn) : Math.ceil(xn);","            yn = yn > 0 ? Math.floor(yn) : Math.ceil(yn);","            x1 = xc + xn;","            y1 = yc + yn;","        }","        ","        //If the gradient radius is greater than the circle's, adjusting the radius stretches the gradient properly.","        //If the gradient radius is less than the circle's, adjusting the radius of the gradient will not work. ","        //Instead, adjust the color stops to reflect the smaller radius.","        if(r >= 0.5)","        {","            gradient = this._context.createRadialGradient(x1, y1, r, x2, y2, r * w);","            stopMultiplier = 1;","        }","        else","        {","            gradient = this._context.createRadialGradient(x1, y1, r, x2, y2, w/2);","            stopMultiplier = r * 2;","        }","        for(; i < len; ++i)","        {","            stop = stops[i];","            opacity = stop.opacity;","            color = stop.color;","            offset = stop.offset;","            if(isNumber(opacity))","            {","                opacity = Math.max(0, Math.min(1, opacity));","                color = this._toRGBA(color, opacity);","            }","            else","            {","                color = TORGB(color);","            }","            offset = stop.offset || i/(len - 1);","            offset *= stopMultiplier;","            if(offset <= 1)","            {","                gradient.addColorStop(offset, color);","            }","        }","        return gradient;","    },","","","    /**","     * Clears all values","     *","     * @method _initProps","     * @private","     */","    _initProps: function() {","        this._methods = [];","        this._lineToMethods = [];","        this._xcoords = [0];","		this._ycoords = [0];","		this._width = 0;","        this._height = 0;","        this._left = 0;","        this._top = 0;","        this._right = 0;","        this._bottom = 0;","        this._currentX = 0;","        this._currentY = 0;","    },","   ","    /**","     * Indicates a drawing has completed.","     *","     * @property _drawingComplete","     * @type Boolean","     * @private","     */","    _drawingComplete: false,","","    /**","     * Creates canvas element","     *","     * @method _createGraphic","     * @return HTMLCanvasElement","     * @private","     */","    _createGraphic: function(config) {","        var graphic = Y.config.doc.createElement('canvas');","        return graphic;","    },","    ","    /**","     * Returns the points on a curve","     *","     * @method getBezierData","     * @param Array points Array containing the begin, end and control points of a curve.","     * @param Number t The value for incrementing the next set of points.","     * @return Array","     * @private","     */","    getBezierData: function(points, t) {  ","        var n = points.length,","            tmp = [],","            i,","            j;","","        for (i = 0; i < n; ++i){","            tmp[i] = [points[i][0], points[i][1]]; // save input","        }","        ","        for (j = 1; j < n; ++j) {","            for (i = 0; i < n - j; ++i) {","                tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];","                tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1]; ","            }","        }","        return [ tmp[0][0], tmp[0][1] ]; ","    },","  ","    /**","     * Calculates the bounding box for a curve","     *","     * @method _setCurveBoundingBox","     * @param Array pts Array containing points for start, end and control points of a curve.","     * @param Number w Width used to calculate the number of points to describe the curve.","     * @param Number h Height used to calculate the number of points to describe the curve.","     * @private","     */","    _setCurveBoundingBox: function(pts, w, h)","    {","        var i = 0,","            left = this._currentX,","            right = left,","            top = this._currentY,","            bottom = top,","            len = Math.round(Math.sqrt((w * w) + (h * h))),","            t = 1/len,","            wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0,","            xy;","        for(; i < len; ++i)","        {","            xy = this.getBezierData(pts, t * i);","            left = isNaN(left) ? xy[0] : Math.min(xy[0], left);","            right = isNaN(right) ? xy[0] : Math.max(xy[0], right);","            top = isNaN(top) ? xy[1] : Math.min(xy[1], top);","            bottom = isNaN(bottom) ? xy[1] : Math.max(xy[1], bottom);","        }","        left = Math.round(left * 10)/10;","        right = Math.round(right * 10)/10;","        top = Math.round(top * 10)/10;","        bottom = Math.round(bottom * 10)/10;","        this._trackSize(right + wt, bottom + wt);","        this._trackSize(left - wt, top - wt);","    },","","    /**","     * Updates the size of the graphics object","     *","     * @method _trackSize","     * @param {Number} w width","     * @param {Number} h height","     * @private","     */","    _trackSize: function(w, h) {","        if (w > this._right) {","            this._right = w;","        }","        if(w < this._left)","        {","            this._left = w;    ","        }","        if (h < this._top)","        {","            this._top = h;","        }","        if (h > this._bottom) ","        {","            this._bottom = h;","        }","        this._width = this._right - this._left;","        this._height = this._bottom - this._top;","    }","};","Y.CanvasDrawing = CanvasDrawing;","/**"," * <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> implementation of the <a href=\"Shape.html\">`Shape`</a> class. "," * `CanvasShape` is not intended to be used directly. Instead, use the <a href=\"Shape.html\">`Shape`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities but has "," * <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> capabilities, the <a href=\"Shape.html\">`Shape`</a> "," * class will point to the `CanvasShape` class."," *"," * @module graphics"," * @class CanvasShape"," * @constructor"," */","CanvasShape = function(cfg)","{","    this._transforms = [];","    this.matrix = new Y.Matrix();","    CanvasShape.superclass.constructor.apply(this, arguments);","};","","CanvasShape.NAME = \"canvasShape\";","","Y.extend(CanvasShape, Y.GraphicBase, Y.mix({","    /**","     * Init method, invoked during construction.","     * Calls `initializer` method.","     *","     * @method init","     * @protected","     */","    init: function()","	{","		this.initializer.apply(this, arguments);","	},","","	/**","	 * Initializes the shape","	 *","	 * @private","	 * @method _initialize","	 */","	initializer: function(cfg)","	{","		var host = this,","            graphic = cfg.graphic;","        host._initProps();","		host.createNode(); ","		host._xcoords = [0];","		host._ycoords = [0];","        if(graphic)","        {","            this._setGraphic(graphic);","        }","		host._updateHandler();","	},"," ","    /**","     * Set the Graphic instance for the shape.","     *","     * @method _setGraphic","     * @param {Graphic | Node | HTMLElement | String} render This param is used to determine the graphic instance. If it is a `Graphic` instance, it will be assigned","     * to the `graphic` attribute. Otherwise, a new Graphic instance will be created and rendered into the dom element that the render represents.","     * @private","     */","    _setGraphic: function(render)","    {","        var graphic;","        if(render instanceof Y.CanvasGraphic)","        {","		    this._graphic = render;","        }","        else","        {","            render = Y.one(render);","            graphic = new Y.CanvasGraphic({","                render: render","            });","            graphic._appendShape(this);","            this._graphic = graphic;","        }","    },","   ","	/**","	 * Add a class name to each node.","	 *","	 * @method addClass","	 * @param {String} className the class name to add to the node's class attribute ","	 */","	addClass: function(className)","	{","		var node = Y.one(this.get(\"node\"));","		node.addClass(className);","	},","	","	/**","	 * Removes a class name from each node.","	 *","	 * @method removeClass","	 * @param {String} className the class name to remove from the node's class attribute","	 */","	removeClass: function(className)","	{","		var node = Y.one(this.get(\"node\"));","		node.removeClass(className);","	},","","	/**","	 * Gets the current position of the node in page coordinates.","	 *","	 * @method getXY","	 * @return Array The XY position of the shape.","	 */","	getXY: function()","	{","		var graphic = this.get(\"graphic\"),","			parentXY = graphic.getXY(),","			x = this.get(\"x\"),","			y = this.get(\"y\");","		return [parentXY[0] + x, parentXY[1] + y];","	},","","	/**","	 * Set the position of the shape in page coordinates, regardless of how the node is positioned.","	 *","	 * @method setXY","	 * @param {Array} Contains X & Y values for new position (coordinates are page-based)","	 */","	setXY: function(xy)","	{","		var graphic = this.get(\"graphic\"),","			parentXY = graphic.getXY(),","			x = xy[0] - parentXY[0],","			y = xy[1] - parentXY[1];","		this._set(\"x\", x);","		this._set(\"y\", y);","		this._updateNodePosition(x, y);","	},","","	/**","	 * Determines whether the node is an ancestor of another HTML element in the DOM hierarchy. ","	 *","	 * @method contains","	 * @param {CanvasShape | HTMLElement} needle The possible node or descendent","	 * @return Boolean Whether or not this shape is the needle or its ancestor.","	 */","	contains: function(needle)","	{","		return needle === Y.one(this.node);","	},","","	/**","	 * Test if the supplied node matches the supplied selector.","	 *","	 * @method test","	 * @param {String} selector The CSS selector to test against.","	 * @return Boolean Wheter or not the shape matches the selector.","	 */","	test: function(selector)","	{","		return Y.one(this.get(\"node\")).test(selector);","		//return Y.Selector.test(this.node, selector);","	},","","	/**","	 * Compares nodes to determine if they match.","	 * Node instances can be compared to each other and/or HTMLElements.","	 * @method compareTo","	 * @param {HTMLElement | Node} refNode The reference node to compare to the node.","	 * @return {Boolean} True if the nodes match, false if they do not.","	 */","	compareTo: function(refNode) {","		var node = this.node;","		return node === refNode;","	},","","	/**","	 * Value function for fill attribute","	 *","	 * @method _getDefaultFill","	 * @return Object","	 * @private","	 */","	_getDefaultFill: function() {","		return {","			type: \"solid\",","			cx: 0.5,","			cy: 0.5,","			fx: 0.5,","			fy: 0.5,","			r: 0.5","		};","	},","","	/**","	 * Value function for stroke attribute","	 *","	 * @method _getDefaultStroke","	 * @return Object","	 * @private","	 */","	_getDefaultStroke: function() ","	{","		return {","			weight: 1,","			dashstyle: \"none\",","			color: \"#000\",","			opacity: 1.0","		};","	},","","	/**","	 * Left edge of the path","	 *","     * @property _left","     * @type Number","	 * @private","	 */","	_left: 0,","","	/**","	 * Right edge of the path","	 *","     * @property _right","     * @type Number","	 * @private","	 */","	_right: 0,","	","	/**","	 * Top edge of the path","	 *","     * @property _top","     * @type Number","	 * @private","	 */","	_top: 0, ","	","	/**","	 * Bottom edge of the path","	 *","     * @property _bottom","     * @type Number","	 * @private","	 */","	_bottom: 0,","","	/**","	 * Creates the dom node for the shape.","	 *","     * @method createNode","	 * @return HTMLElement","	 * @private","	 */","	createNode: function()","	{","		var node = Y.config.doc.createElement('canvas'),","			id = this.get(\"id\");","		this._context = node.getContext('2d');","		node.setAttribute(\"overflow\", \"visible\");","        node.style.overflow = \"visible\";","        if(!this.get(\"visible\"))","        {","            node.style.visibility = \"hidden\";","        }","		node.setAttribute(\"id\", id);","		id = \"#\" + id;","		this.node = node;","		this.addClass(_getClassName(SHAPE) + \" \" + _getClassName(this.name)); ","	},","	","	/**","     * Overrides default `on` method. Checks to see if its a dom interaction event. If so, ","     * return an event attached to the `node` element. If not, return the normal functionality.","     *","     * @method on","     * @param {String} type event type","     * @param {Object} callback function","	 * @private","	 */","	on: function(type, fn)","	{","		if(Y.Node.DOM_EVENTS[type])","		{","			return Y.one(\"#\" +  this.get(\"id\")).on(type, fn);","		}","		return Y.on.apply(this, arguments);","	},","	","	/**","	 * Adds a stroke to the shape node.","	 *","	 * @method _strokeChangeHandler","     * @param {Object} stroke Properties of the `stroke` attribute.","	 * @private","	 */","	_setStrokeProps: function(stroke)","	{","		var color,","			weight,","			opacity,","			linejoin,","			linecap,","			dashstyle;","	    if(stroke)","        {","            color = stroke.color;","            weight = PARSE_FLOAT(stroke.weight);","            opacity = PARSE_FLOAT(stroke.opacity);","            linejoin = stroke.linejoin || \"round\";","            linecap = stroke.linecap || \"butt\";","            dashstyle = stroke.dashstyle;","            this._miterlimit = null;","            this._dashstyle = (dashstyle && Y.Lang.isArray(dashstyle) && dashstyle.length > 1) ? dashstyle : null;","            this._strokeWeight = weight;","","            if (IS_NUMBER(weight) && weight > 0) ","            {","                this._stroke = 1;","            } ","            else ","            {","                this._stroke = 0;","            }","            if (IS_NUMBER(opacity)) {","                this._strokeStyle = this._toRGBA(color, opacity);","            }","            else","            {","                this._strokeStyle = color;","            }","            this._linecap = linecap;","            if(linejoin == \"round\" || linejoin == \"bevel\")","            {","                this._linejoin = linejoin;","            }","            else","            {","                linejoin = parseInt(linejoin, 10);","                if(IS_NUMBER(linejoin))","                {","                    this._miterlimit =  Math.max(linejoin, 1);","                    this._linejoin = \"miter\";","                }","            }","        }","        else","        {","            this._stroke = 0;","        }","	},","","    /**","     * Sets the value of an attribute.","     *","     * @method set","     * @param {String|Object} name The name of the attribute. Alternatively, an object of key value pairs can ","     * be passed in to set multiple attributes at once.","     * @param {Any} value The value to set the attribute to. This value is ignored if an object is received as ","     * the name param.","     */","	set: function() ","	{","		var host = this,","			val = arguments[0];","		AttributeLite.prototype.set.apply(host, arguments);","		if(host.initialized)","		{","			host._updateHandler();","		}","	},","	","	/**","	 * Adds a fill to the shape node.","	 *","	 * @method _setFillProps ","     * @param {Object} fill Properties of the `fill` attribute.","	 * @private","	 */","	_setFillProps: function(fill)","	{","		var isNumber = IS_NUMBER,","			color,","			opacity,","			type;","        if(fill)","        {","            color = fill.color;","            type = fill.type;","            if(type == \"linear\" || type == \"radial\")","            {","                this._fillType = type;","            }","            else if(color)","            {","                opacity = fill.opacity;","                if (isNumber(opacity)) ","                {","                    opacity = Math.max(0, Math.min(1, opacity));","                    color = this._toRGBA(color, opacity);","                } ","                else ","                {","                    color = TORGB(color);","                }","","                this._fillColor = color;","                this._fillType = 'solid';","            }","            else","            {","                this._fillColor = null;","            }","        }","		else","		{","            this._fillType = null;","			this._fillColor = null;","		}","	},","","	/**","	 * Specifies a 2d translation.","	 *","	 * @method translate","	 * @param {Number} x The value to transate on the x-axis.","	 * @param {Number} y The value to translate on the y-axis.","	 */","	translate: function(x, y)","	{","		this._translateX += x;","		this._translateY += y;","		this._addTransform(\"translate\", arguments);","	},","","	/**","	 * Translates the shape along the x-axis. When translating x and y coordinates,","	 * use the `translate` method.","	 *","	 * @method translateX","	 * @param {Number} x The value to translate.","	 */","	translateX: function(x)","    {","        this._translateX += x;","        this._addTransform(\"translateX\", arguments);","    },","","	/**","	 * Performs a translate on the y-coordinate. When translating x and y coordinates,","	 * use the `translate` method.","	 *","	 * @method translateY","	 * @param {Number} y The value to translate.","	 */","	translateY: function(y)","    {","        this._translateY += y;","        this._addTransform(\"translateY\", arguments);","    },","","    /**","     * Skews the shape around the x-axis and y-axis.","     *","     * @method skew","     * @param {Number} x The value to skew on the x-axis.","     * @param {Number} y The value to skew on the y-axis.","     */","    skew: function(x, y)","    {","        this._addTransform(\"skew\", arguments);","    },","","	/**","	 * Skews the shape around the x-axis.","	 *","	 * @method skewX","	 * @param {Number} x x-coordinate","	 */","	 skewX: function(x)","	 {","		this._addTransform(\"skewX\", arguments);","	 },","","	/**","	 * Skews the shape around the y-axis.","	 *","	 * @method skewY","	 * @param {Number} y y-coordinate","	 */","	 skewY: function(y)","	 {","		this._addTransform(\"skewY\", arguments);","	 },","","	/**","	 * Rotates the shape clockwise around it transformOrigin.","	 *","	 * @method rotate","	 * @param {Number} deg The degree of the rotation.","	 */","	 rotate: function(deg)","	 {","		this._rotation = deg;","		this._addTransform(\"rotate\", arguments);","	 },","","	/**","	 * Specifies a 2d scaling operation.","	 *","	 * @method scale","	 * @param {Number} val","	 */","	scale: function(x, y)","	{","		this._addTransform(\"scale\", arguments);","	},","	","    /**","     * Storage for `rotation` atribute.","     *","     * @property _rotation","     * @type Number","	 * @private","	 */","	_rotation: 0,","    ","    /**","     * Storage for the transform attribute.","     *","     * @property _transform","     * @type String","     * @private","     */","    _transform: \"\",","","    /**","     * Adds a transform to the shape.","     *","     * @method _addTransform","     * @param {String} type The transform being applied.","     * @param {Array} args The arguments for the transform.","	 * @private","	 */","	_addTransform: function(type, args)","	{","        args = Y.Array(args);","        this._transform = Y_LANG.trim(this._transform + \" \" + type + \"(\" + args.join(\", \") + \")\");","        args.unshift(type);","        this._transforms.push(args);","        if(this.initialized)","        {","            this._updateTransform();","        }","	},","","	/**","     * Applies all transforms.","     *","     * @method _updateTransform","	 * @private","	 */","	_updateTransform: function()","	{","		var node = this.node,","			key,","			transform,","			transformOrigin = this.get(\"transformOrigin\"),","            matrix = this.matrix,","            i = 0,","            len = this._transforms.length;","        ","        if(this._transforms && this._transforms.length > 0)","        {","            for(; i < len; ++i)","            {","                key = this._transforms[i].shift();","                if(key)","                {","                    matrix[key].apply(matrix, this._transforms[i]); ","                }","            }","            transform = matrix.toCSSText();","        }","        ","        this._graphic.addToRedrawQueue(this);    ","		transformOrigin = (100 * transformOrigin[0]) + \"% \" + (100 * transformOrigin[1]) + \"%\";","		node.style.MozTransformOrigin = transformOrigin; ","		node.style.webkitTransformOrigin = transformOrigin;","		node.style.msTransformOrigin = transformOrigin;","		node.style.OTransformOrigin = transformOrigin;","        if(transform)","		{","            node.style.MozTransform = transform;","            node.style.webkitTransform = transform;","            node.style.msTransform = transform;","            node.style.OTransform = transform;","		}","        this._transforms = [];","	},","","	/**","     * Updates `Shape` based on attribute changes.","     *","     * @method _updateHandler","	 * @private","	 */","	_updateHandler: function()","	{","		this._draw();","		this._updateTransform();","	},","	","	/**","	 * Updates the shape.","	 *","	 * @method _draw","	 * @private","	 */","	_draw: function()","	{","        var node = this.node;","        this.clear();","		this._closePath();","		node.style.left = this.get(\"x\") + \"px\";","		node.style.top = this.get(\"y\") + \"px\";","	},","","	/**","	 * Completes a shape or drawing","	 *","	 * @method _closePath","	 * @private","	 */","	_closePath: function()","	{","		if(!this._methods)","		{","			return;","		}","		var node = this.get(\"node\"),","			w = this._right - this._left,","			h = this._bottom - this._top,","			context = this._context,","			methods = [],","			cachedMethods = this._methods.concat(),","			i = 0,","			j,","			method,","			args,","            argsLen,","			len = 0;","		this._context.clearRect(0, 0, node.width, node.height);","	   if(this._methods)","	   {","			len = cachedMethods.length;","			if(!len || len < 1)","			{","				return;","			}","			for(; i < len; ++i)","			{","				methods[i] = cachedMethods[i].concat();","				args = methods[i];","                argsLen = args[0] == \"quadraticCurveTo\" ? args.length : 3;","				for(j = 1; j < argsLen; ++j)","				{","					if(j % 2 === 0)","					{","						args[j] = args[j] - this._top;","					}","					else","					{","						args[j] = args[j] - this._left;","					}","				}","			}","            node.setAttribute(\"width\", Math.min(w, 2000));","            node.setAttribute(\"height\", Math.min(2000, h));","            context.beginPath();","			for(i = 0; i < len; ++i)","			{","				args = methods[i].concat();","				if(args && args.length > 0)","				{","					method = args.shift();","					if(method)","					{","                        if(method == \"closePath\")","                        {","                            this._strokeAndFill(context);","                        }","						if(method && method == \"lineTo\" && this._dashstyle)","						{","							args.unshift(this._xcoords[i] - this._left, this._ycoords[i] - this._top);","							this._drawDashedLine.apply(this, args);","						}","						else","						{","                            context[method].apply(context, args); ","						}","					}","				}","			}","","            this._strokeAndFill(context);","			this._drawingComplete = true;","			this._clearAndUpdateCoords();","			this._updateNodePosition();","			this._methods = cachedMethods;","		}","	},","","    /**","     * Completes a stroke and/or fill operation on the context.","     *","     * @method _strokeAndFill","     * @param {Context} Reference to the context element of the canvas instance.","     * @private","     */","    _strokeAndFill: function(context)","    {","        if (this._fillType) ","        {","            if(this._fillType == \"linear\")","            {","                context.fillStyle = this._getLinearGradient();","            }","            else if(this._fillType == \"radial\")","            {","                context.fillStyle = this._getRadialGradient();","            }","            else","            {","                context.fillStyle = this._fillColor;","            }","            context.closePath();","            context.fill();","        }","","        if (this._stroke) {","            if(this._strokeWeight)","            {","                context.lineWidth = this._strokeWeight;","            }","            context.lineCap = this._linecap;","            context.lineJoin = this._linejoin;","            if(this._miterlimit)","            {","                context.miterLimit = this._miterlimit;","            }","            context.strokeStyle = this._strokeStyle;","            context.stroke();","        }","    },","","	/**","	 * Draws a dashed line between two points.","	 * ","	 * @method _drawDashedLine","	 * @param {Number} xStart	The x position of the start of the line","	 * @param {Number} yStart	The y position of the start of the line","	 * @param {Number} xEnd		The x position of the end of the line","	 * @param {Number} yEnd		The y position of the end of the line","	 * @private","	 */","	_drawDashedLine: function(xStart, yStart, xEnd, yEnd)","	{","		var context = this._context,","			dashsize = this._dashstyle[0],","			gapsize = this._dashstyle[1],","			segmentLength = dashsize + gapsize,","			xDelta = xEnd - xStart,","			yDelta = yEnd - yStart,","			delta = Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta, 2)),","			segmentCount = Math.floor(Math.abs(delta / segmentLength)),","			radians = Math.atan2(yDelta, xDelta),","			xCurrent = xStart,","			yCurrent = yStart,","			i;","		xDelta = Math.cos(radians) * segmentLength;","		yDelta = Math.sin(radians) * segmentLength;","		","		for(i = 0; i < segmentCount; ++i)","		{","			context.moveTo(xCurrent, yCurrent);","			context.lineTo(xCurrent + Math.cos(radians) * dashsize, yCurrent + Math.sin(radians) * dashsize);","			xCurrent += xDelta;","			yCurrent += yDelta;","		}","		","		context.moveTo(xCurrent, yCurrent);","		delta = Math.sqrt((xEnd - xCurrent) * (xEnd - xCurrent) + (yEnd - yCurrent) * (yEnd - yCurrent));","		","		if(delta > dashsize)","		{","			context.lineTo(xCurrent + Math.cos(radians) * dashsize, yCurrent + Math.sin(radians) * dashsize);","		}","		else if(delta > 0)","		{","			context.lineTo(xCurrent + Math.cos(radians) * delta, yCurrent + Math.sin(radians) * delta);","		}","		","		context.moveTo(xEnd, yEnd);","	},","","	//This should move to CanvasDrawing class. ","    //Currently docmented in CanvasDrawing class.","    clear: function() {","		this._initProps();","        if(this.node) ","        {","            this._context.clearRect(0, 0, this.node.width, this.node.height);","        }","        return this;","	},","	","	/**","	 * Returns the bounds for a shape.","	 *","     * Calculates the a new bounding box from the original corner coordinates (base on size and position) and the transform matrix.","     * The calculated bounding box is used by the graphic instance to calculate its viewBox. ","     *","	 * @method getBounds","	 * @return Object","	 */","	getBounds: function()","	{","		var type = this._type,","		    stroke = this.get(\"stroke\"),","			w = this.get(\"width\"),","			h = this.get(\"height\"),","			x = this.get(\"x\"),","			y = this.get(\"y\"),","            wt = 0;","        if(type == \"path\")","        {","            x = x + this._left;","            y = y + this._top;","            w = this._right - this._left;","            h = this._bottom - this._top;","        }","		if(stroke && stroke.weight)","		{","			wt = stroke.weight;","		}","        w = (x + w + wt) - (x - wt); ","        h = (y + h + wt) - (y - wt);","        x -= wt;","        y -= wt;","        return this._getContentRect(w, h, x, y);","	},","","    /**","     * Calculates the bounding box for the shape.","     *","     * @method _getContentRect","     * @param {Number} w width of the shape","     * @param {Number} h height of the shape","     * @param {Number} x x-coordinate of the shape","     * @param {Number} y y-coordinate of the shape","     * @private","     */","    _getContentRect: function(w, h, x, y)","    {","        var transformOrigin = this.get(\"transformOrigin\"),","            transformX = transformOrigin[0] * w,","            transformY = transformOrigin[1] * h,","		    transforms = this.matrix.getTransformArray(this.get(\"transform\")),","            matrix = new Y.Matrix(),","            i = 0,","            len = transforms.length,","            transform,","            key,","            contentRect;","        if(this._type == \"path\")","        {","            transformX = transformX + x;","            transformY = transformY + y;","        }","        transformX = !isNaN(transformX) ? transformX : 0;","        transformY = !isNaN(transformY) ? transformY : 0;","        matrix.translate(transformX, transformY);","        for(; i < len; i = i + 1)","        {","            transform = transforms[i];","            key = transform.shift();","            if(key)","            {","                matrix[key].apply(matrix, transform); ","            }","        }","        matrix.translate(-transformX, -transformY);","        contentRect = matrix.getContentRect(w, h, x, y);","        return contentRect;","    },","    ","    /**","     * Destroys the shape instance.","     *","     * @method destroy","     */","    destroy: function()","    {","        var graphic = this.get(\"graphic\");","        if(graphic)","        {","            graphic.removeShape(this);","        }","        else","        {","            this._destroy();","        }","    },","","    /**","     *  Implementation for shape destruction","     *","     *  @method destroy","     *  @protected","     */","    _destroy: function()","    {","        if(this.node)","        {","            Y.one(this.node).remove(true);","            this._context = null;","            this.node = null;","        }","    }","}, Y.CanvasDrawing.prototype));","","CanvasShape.ATTRS =  {","	/**","	 * An array of x, y values which indicates the transformOrigin in which to rotate the shape. Valid values range between 0 and 1 representing a ","	 * fraction of the shape's corresponding bounding box dimension. The default value is [0.5, 0.5].","	 *","	 * @config transformOrigin","	 * @type Array","	 */","	transformOrigin: {","		valueFn: function()","		{","			return [0.5, 0.5];","		}","	},","	","    /**","     * <p>A string containing, in order, transform operations applied to the shape instance. The `transform` string can contain the following values:","     *     ","     *    <dl>","     *        <dt>rotate</dt><dd>Rotates the shape clockwise around it transformOrigin.</dd>","     *        <dt>translate</dt><dd>Specifies a 2d translation.</dd>","     *        <dt>skew</dt><dd>Skews the shape around the x-axis and y-axis.</dd>","     *        <dt>scale</dt><dd>Specifies a 2d scaling operation.</dd>","     *        <dt>translateX</dt><dd>Translates the shape along the x-axis.</dd>","     *        <dt>translateY</dt><dd>Translates the shape along the y-axis.</dd>","     *        <dt>skewX</dt><dd>Skews the shape around the x-axis.</dd>","     *        <dt>skewY</dt><dd>Skews the shape around the y-axis.</dd>","     *        <dt>matrix</dt><dd>Specifies a 2D transformation matrix comprised of the specified six values.</dd>      ","     *    </dl>","     * </p>","     * <p>Applying transforms through the transform attribute will reset the transform matrix and apply a new transform. The shape class also contains corresponding methods for each transform","     * that will apply the transform to the current matrix. The below code illustrates how you might use the `transform` attribute to instantiate a recangle with a rotation of 45 degrees.</p>","            var myRect = new Y.Rect({","                type:\"rect\",","                width: 50,","                height: 40,","                transform: \"rotate(45)\"","            };","     * <p>The code below would apply `translate` and `rotate` to an existing shape.</p>","    ","        myRect.set(\"transform\", \"translate(40, 50) rotate(45)\");","	 * @config transform","     * @type String  ","	 */","	transform: {","		setter: function(val)","		{","            this.matrix.init();	","		    this._transforms = this.matrix.getTransformArray(val);","            this._transform = val;","            return val;","		},","","        getter: function()","        {","            return this._transform;","        }","	},","","	/**","	 * Dom node for the shape","	 *","	 * @config node","	 * @type HTMLElement","	 * @readOnly","	 */","	node: {","		readOnly: true,","","		getter: function()","		{","			return this.node;","		}","	},","","	/**","	 * Unique id for class instance.","	 *","	 * @config id","	 * @type String","	 */","	id: {","		valueFn: function()","		{","			return Y.guid();","		},","","		setter: function(val)","		{","			var node = this.node;","			if(node)","			{","				node.setAttribute(\"id\", val);","			}","			return val;","		}","	},","","	/**","	 * Indicates the width of the shape","	 *","	 * @config width","	 * @type Number","	 */","	width: {","        value: 0","    },","","	/**","	 * Indicates the height of the shape","	 *","	 * @config height","	 * @type Number","	 */","	height: {","        value: 0","    },","","	/**","	 * Indicates the x position of shape.","	 *","	 * @config x","	 * @type Number","	 */","	x: {","		value: 0","	},","","	/**","	 * Indicates the y position of shape.","	 *","	 * @config y","	 * @type Number","	 */","	y: {","		value: 0","	},","","	/**","	 * Indicates whether the shape is visible.","	 *","	 * @config visible","	 * @type Boolean","	 */","	visible: {","		value: true,","","		setter: function(val){","			var node = this.get(\"node\"),","                visibility = val ? \"visible\" : \"hidden\";","			if(node)","            {","                node.style.visibility = visibility;","            }","			return val;","		}","	},","","	/**","	 * Contains information about the fill of the shape. ","     *  <dl>","     *      <dt>color</dt><dd>The color of the fill.</dd>","     *      <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the fill. The default value is 1.</dd>","     *      <dt>type</dt><dd>Type of fill.","     *          <dl>","     *              <dt>solid</dt><dd>Solid single color fill. (default)</dd>","     *              <dt>linear</dt><dd>Linear gradient fill.</dd>","     *              <dt>radial</dt><dd>Radial gradient fill.</dd>","     *          </dl>","     *      </dd>","     *  </dl>","     *  <p>If a `linear` or `radial` is specified as the fill type. The following additional property is used:","     *  <dl>","     *      <dt>stops</dt><dd>An array of objects containing the following properties:","     *          <dl>","     *              <dt>color</dt><dd>The color of the stop.</dd>","     *              <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the stop. The default value is 1. Note: No effect for IE 6 - 8</dd>","     *              <dt>offset</dt><dd>Number between 0 and 1 indicating where the color stop is positioned.</dd> ","     *          </dl>","     *      </dd>","     *      <p>Linear gradients also have the following property:</p>","     *      <dt>rotation</dt><dd>Linear gradients flow left to right by default. The rotation property allows you to change the flow by rotation. (e.g. A rotation of 180 would make the gradient pain from right to left.)</dd>","     *      <p>Radial gradients have the following additional properties:</p>","     *      <dt>r</dt><dd>Radius of the gradient circle.</dd>","     *      <dt>fx</dt><dd>Focal point x-coordinate of the gradient.</dd>","     *      <dt>fy</dt><dd>Focal point y-coordinate of the gradient.</dd>","     *  </dl>","     *  <p>The corresponding `SVGShape` class implements the following additional properties.</p>","     *  <dl>","     *      <dt>cx</dt><dd>","     *          <p>The x-coordinate of the center of the gradient circle. Determines where the color stop begins. The default value 0.5.</p>","     *      </dd>","     *      <dt>cy</dt><dd>","     *          <p>The y-coordinate of the center of the gradient circle. Determines where the color stop begins. The default value 0.5.</p>","     *      </dd>","     *  </dl>","     *  <p>These properties are not currently implemented in `CanvasShape` or `VMLShape`.</p> ","	 *","	 * @config fill","	 * @type Object ","	 */","	fill: {","		valueFn: \"_getDefaultFill\",","		","		setter: function(val)","		{","			var fill,","				tmpl = this.get(\"fill\") || this._getDefaultFill();","			fill = (val) ? Y.merge(tmpl, val) : null;","			if(fill && fill.color)","			{","				if(fill.color === undefined || fill.color == \"none\")","				{","					fill.color = null;","				}","			}","			this._setFillProps(fill);","			return fill;","		}","	},","","	/**","	 * Contains information about the stroke of the shape.","     *  <dl>","     *      <dt>color</dt><dd>The color of the stroke.</dd>","     *      <dt>weight</dt><dd>Number that indicates the width of the stroke.</dd>","     *      <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the stroke. The default value is 1.</dd>","     *      <dt>dashstyle</dt>Indicates whether to draw a dashed stroke. When set to \"none\", a solid stroke is drawn. When set to an array, the first index indicates the","     *  length of the dash. The second index indicates the length of gap.","     *      <dt>linecap</dt><dd>Specifies the linecap for the stroke. The following values can be specified:","     *          <dl>","     *              <dt>butt (default)</dt><dd>Specifies a butt linecap.</dd>","     *              <dt>square</dt><dd>Specifies a sqare linecap.</dd>","     *              <dt>round</dt><dd>Specifies a round linecap.</dd>","     *          </dl>","     *      </dd>","     *      <dt>linejoin</dt><dd>Specifies a linejoin for the stroke. The following values can be specified:","     *          <dl>","     *              <dt>round (default)</dt><dd>Specifies that the linejoin will be round.</dd>","     *              <dt>bevel</dt><dd>Specifies a bevel for the linejoin.</dd>","     *              <dt>miter limit</dt><dd>An integer specifying the miter limit of a miter linejoin. If you want to specify a linejoin of miter, you simply specify the limit as opposed to having","     *  separate miter and miter limit values.</dd>","     *          </dl>","     *      </dd>","     *  </dl>","	 *","	 * @config stroke","	 * @type Object","	 */","	stroke: {","		valueFn: \"_getDefaultStroke\",","","		setter: function(val)","		{","			var tmpl = this.get(\"stroke\") || this._getDefaultStroke(),","                wt;","            if(val && val.hasOwnProperty(\"weight\"))","            {","                wt = parseInt(val.weight, 10);","                if(!isNaN(wt))","                {","                    val.weight = wt;","                }","            }","			val = (val) ? Y.merge(tmpl, val) : null;","			this._setStrokeProps(val);","			return val;","		}","	},","	","	//Not used. Remove in future.","	autoSize: {","		value: false","	},","","	// Only implemented in SVG","	// Determines whether the instance will receive mouse events.","	// ","	// @config pointerEvents","	// @type string","	//","	pointerEvents: {","		value: \"visiblePainted\"","	},","","	/**","	 * Reference to the container Graphic.","	 *","	 * @config graphic","	 * @type Graphic","	 */","	graphic: {","		readOnly: true,","","		getter: function()","		{","			return this._graphic;","		}","    }","};","Y.CanvasShape = CanvasShape;","/**"," * <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> implementation of the <a href=\"Path.html\">`Path`</a> class. "," * `CanvasPath` is not intended to be used directly. Instead, use the <a href=\"Path.html\">`Path`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities but has "," * <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> capabilities, the <a href=\"Path.html\">`Path`</a> "," * class will point to the `CanvasPath` class."," *"," * @module graphics"," * @class CanvasPath"," * @extends CanvasShape"," */","CanvasPath = function(cfg)","{","	CanvasPath.superclass.constructor.apply(this, arguments);","};","CanvasPath.NAME = \"canvasPath\";","Y.extend(CanvasPath, Y.CanvasShape, {","    /**","     * Indicates the type of shape","     *","     * @property _type","     * @type String","     * @private","     */","    _type: \"path\",","","	/**","	 * Draws the shape.","	 *","	 * @method _draw","	 * @private","	 */","    _draw: function()","    {","        this._closePath();","        this._updateTransform();","    },","","	/**","	 * Creates the dom node for the shape.","	 *","     * @method createNode","	 * @return HTMLElement","	 * @private","	 */","	createNode: function()","	{","		var node = Y.config.doc.createElement('canvas'),","			id = this.get(\"id\");","		this._context = node.getContext('2d');","		node.setAttribute(\"overflow\", \"visible\");","        node.setAttribute(\"pointer-events\", \"none\");","        node.style.pointerEvents = \"none\";","        node.style.overflow = \"visible\";","		node.setAttribute(\"id\", id);","		id = \"#\" + id;","		this.node = node;","		this.addClass(_getClassName(SHAPE) + \" \" + _getClassName(this.name)); ","	},","","    /**","     * Completes a drawing operation. ","     *","     * @method end","     */","    end: function()","    {","        this._draw();","    }","});","","CanvasPath.ATTRS = Y.merge(Y.CanvasShape.ATTRS, {","	/**","	 * Indicates the width of the shape","	 *","	 * @config width","	 * @type Number","	 */","	width: {","		getter: function()","		{","			var offset = this._stroke && this._strokeWeight ? (this._strokeWeight * 2) : 0;","			return this._width - offset;","		},","","		setter: function(val)","		{","			this._width = val;","			return val;","		}","	},","","	/**","	 * Indicates the height of the shape","	 *","	 * @config height","	 * @type Number","	 */","	height: {","		getter: function()","		{","			var offset = this._stroke && this._strokeWeight ? (this._strokeWeight * 2) : 0;","            return this._height - offset;","		},","","		setter: function(val)","		{","			this._height = val;","			return val;","		}","	},","	","	/**","	 * Indicates the path used for the node.","	 *","	 * @config path","	 * @type String","     * @readOnly","	 */","	path: {","        readOnly: true,","","		getter: function()","		{","			return this._path;","		}","	}","});","Y.CanvasPath = CanvasPath;","/**"," * <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> implementation of the <a href=\"Rect.html\">`Rect`</a> class. "," * `CanvasRect` is not intended to be used directly. Instead, use the <a href=\"Rect.html\">`Rect`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities but has "," * <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> capabilities, the <a href=\"Rect.html\">`Rect`</a> "," * class will point to the `CanvasRect` class."," *"," * @module graphics"," * @class CanvasRect"," * @constructor"," */","CanvasRect = function()","{","	CanvasRect.superclass.constructor.apply(this, arguments);","};","CanvasRect.NAME = \"canvasRect\";","Y.extend(CanvasRect, Y.CanvasShape, {","	/**","	 * Indicates the type of shape","	 *","	 * @property _type","	 * @type String","     * @private","	 */","	_type: \"rect\",","","	/**","	 * Draws the shape.","	 *","	 * @method _draw","	 * @private","	 */","	_draw: function()","	{","		var w = this.get(\"width\"),","			h = this.get(\"height\");","		this.clear();","        this.drawRect(0, 0, w, h);","		this._closePath();","	}","});","CanvasRect.ATTRS = Y.CanvasShape.ATTRS;","Y.CanvasRect = CanvasRect;","/**"," * <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> implementation of the <a href=\"Ellipse.html\">`Ellipse`</a> class. "," * `CanvasEllipse` is not intended to be used directly. Instead, use the <a href=\"Ellipse.html\">`Ellipse`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities but has "," * <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> capabilities, the <a href=\"Ellipse.html\">`Ellipse`</a> "," * class will point to the `CanvasEllipse` class."," *"," * @module graphics"," * @class CanvasEllipse"," * @constructor"," */","CanvasEllipse = function(cfg)","{","	CanvasEllipse.superclass.constructor.apply(this, arguments);","};","","CanvasEllipse.NAME = \"canvasEllipse\";","","Y.extend(CanvasEllipse, CanvasShape, {","	/**","	 * Indicates the type of shape","	 *","	 * @property _type","	 * @type String","     * @private","	 */","	_type: \"ellipse\",","","	/**","     * Draws the shape.","     *","     * @method _draw","	 * @private","	 */","	_draw: function()","	{","		var w = this.get(\"width\"),","			h = this.get(\"height\");","		this.clear();","        this.drawEllipse(0, 0, w, h);","		this._closePath();","	}","});","CanvasEllipse.ATTRS = Y.merge(CanvasShape.ATTRS, {","	/**","	 * Horizontal radius for the ellipse. ","	 *","	 * @config xRadius","	 * @type Number","	 */","	xRadius: {","		setter: function(val)","		{","			this.set(\"width\", val * 2);","		},","","		getter: function()","		{","			var val = this.get(\"width\");","			if(val) ","			{","				val *= 0.5;","			}","			return val;","		}","	},","","	/**","	 * Vertical radius for the ellipse. ","	 *","	 * @config yRadius","	 * @type Number","	 * @readOnly","	 */","	yRadius: {","		setter: function(val)","		{","			this.set(\"height\", val * 2);","		},","","		getter: function()","		{","			var val = this.get(\"height\");","			if(val) ","			{","				val *= 0.5;","			}","			return val;","		}","	}","});","Y.CanvasEllipse = CanvasEllipse;","/**"," * <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> implementation of the <a href=\"Circle.html\">`Circle`</a> class. "," * `CanvasCircle` is not intended to be used directly. Instead, use the <a href=\"Circle.html\">`Circle`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities but has "," * <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> capabilities, the <a href=\"Circle.html\">`Circle`</a> "," * class will point to the `CanvasCircle` class."," *"," * @module graphics"," * @class CanvasCircle"," * @constructor"," */","CanvasCircle = function(cfg)","{","	CanvasCircle.superclass.constructor.apply(this, arguments);","};","    ","CanvasCircle.NAME = \"canvasCircle\";","","Y.extend(CanvasCircle, Y.CanvasShape, {","	/**","	 * Indicates the type of shape","	 *","	 * @property _type","	 * @type String","     * @private","	 */","	_type: \"circle\",","","	/**","     * Draws the shape.","     *","     * @method _draw","	 * @private","	 */","	_draw: function()","	{","		var radius = this.get(\"radius\");","		if(radius)","		{","            this.clear();","            this.drawCircle(0, 0, radius);","			this._closePath();","		}","	}","});","","CanvasCircle.ATTRS = Y.merge(Y.CanvasShape.ATTRS, {","	/**","	 * Indicates the width of the shape","	 *","	 * @config width","	 * @type Number","	 */","	width: {","        setter: function(val)","        {","            this.set(\"radius\", val/2);","            return val;","        },","","		getter: function()","		{","			return this.get(\"radius\") * 2;","		}","	},","","	/**","	 * Indicates the height of the shape","	 *","	 * @config height","	 * @type Number","	 */","	height: {","        setter: function(val)","        {","            this.set(\"radius\", val/2);","            return val;","        },","","		getter: function()","		{","			return this.get(\"radius\") * 2;","		}","	},","","	/**","	 * Radius of the circle","	 *","	 * @config radius","     * @type Number","	 */","	radius: {","		lazyAdd: false","	}","});","Y.CanvasCircle = CanvasCircle;","/**"," * Draws pie slices"," *"," * @module graphics"," * @class CanvasPieSlice"," * @constructor"," */","CanvasPieSlice = function()","{","	CanvasPieSlice.superclass.constructor.apply(this, arguments);","};","CanvasPieSlice.NAME = \"canvasPieSlice\";","Y.extend(CanvasPieSlice, Y.CanvasShape, {","    /**","     * Indicates the type of shape","     *","     * @property _type","     * @type String","     * @private","     */","    _type: \"path\",","","	/**","	 * Change event listener","	 *","	 * @private","	 * @method _updateHandler","	 */","	_draw: function(e)","	{","        var x = this.get(\"cx\"),","            y = this.get(\"cy\"),","            startAngle = this.get(\"startAngle\"),","            arc = this.get(\"arc\"),","            radius = this.get(\"radius\");","        this.clear();","        this._left = x;","        this._right = radius;","        this._top = y;","        this._bottom = radius;","        this.drawWedge(x, y, startAngle, arc, radius);","		this.end();","	}"," });","CanvasPieSlice.ATTRS = Y.mix({","    cx: {","        value: 0","    },","","    cy: {","        value: 0","    },","    /**","     * Starting angle in relation to a circle in which to begin the pie slice drawing.","     *","     * @config startAngle","     * @type Number","     */","    startAngle: {","        value: 0","    },","","    /**","     * Arc of the slice.","     *","     * @config arc","     * @type Number","     */","    arc: {","        value: 0","    },","","    /**","     * Radius of the circle in which the pie slice is drawn","     *","     * @config radius","     * @type Number","     */","    radius: {","        value: 0","    }","}, Y.CanvasShape.ATTRS);","Y.CanvasPieSlice = CanvasPieSlice;","/**"," * <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> implementation of the `Graphic` class. "," * `CanvasGraphic` is not intended to be used directly. Instead, use the <a href=\"Graphic.html\">`Graphic`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities but has "," * <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> capabilities, the <a href=\"Graphic.html\">`Graphic`</a> "," * class will point to the `CanvasGraphic` class."," *"," * @module graphics"," * @class CanvasGraphic"," * @constructor"," */","function CanvasGraphic(config) {","    ","    CanvasGraphic.superclass.constructor.apply(this, arguments);","}","","CanvasGraphic.NAME = \"canvasGraphic\";","","CanvasGraphic.ATTRS = {","    /**","     * Whether or not to render the `Graphic` automatically after to a specified parent node after init. This can be a Node instance or a CSS selector string.","     * ","     * @config render","     * @type Node | String ","     */","    render: {},","	","    /**","	 * Unique id for class instance.","	 *","	 * @config id","	 * @type String","	 */","	id: {","		valueFn: function()","		{","			return Y.guid();","		},","","		setter: function(val)","		{","			var node = this._node;","			if(node)","			{","				node.setAttribute(\"id\", val);","			}","			return val;","		}","	},","","    /**","     * Key value pairs in which a shape instance is associated with its id.","     *","     *  @config shapes","     *  @type Object","     *  @readOnly","     */","    shapes: {","        readOnly: true,","","        getter: function()","        {","            return this._shapes;","        }","    },","","    /**","     *  Object containing size and coordinate data for the content of a Graphic in relation to the graphic instance's position.","     *","     *  @config contentBounds ","     *  @type Object","     *  @readOnly","     */","    contentBounds: {","        readOnly: true,","","        getter: function()","        {","            return this._contentBounds;","        }","    },","","    /**","     *  The outermost html element of the Graphic instance.","     *","     *  @config node","     *  @type HTMLElement","     *  @readOnly","     */","    node: {","        readOnly: true,","","        getter: function()","        {","            return this._node;","        }","    },","","	/**","	 * Indicates the width of the `Graphic`. ","	 *","	 * @config width","	 * @type Number","	 */","    width: {","        setter: function(val)","        {","            if(this._node)","            {","                this._node.style.width = val + \"px\";            ","            }","            return val;","        }","    },","","	/**","	 * Indicates the height of the `Graphic`. ","	 *","	 * @config height ","	 * @type Number","	 */","    height: {","        setter: function(val)","        {","            if(this._node)","            {","                this._node.style.height = val + \"px\";","            }","            return val;","        }","    },","","    /**","     *  Determines the sizing of the Graphic. ","     *","     *  <dl>","     *      <dt>sizeContentToGraphic</dt><dd>The Graphic's width and height attributes are, either explicitly set through the <code>width</code> and <code>height</code>","     *      attributes or are determined by the dimensions of the parent element. The content contained in the Graphic will be sized to fit with in the Graphic instance's ","     *      dimensions. When using this setting, the <code>preserveAspectRatio</code> attribute will determine how the contents are sized.</dd>","     *      <dt>sizeGraphicToContent</dt><dd>(Also accepts a value of true) The Graphic's width and height are determined by the size and positioning of the content.</dd>","     *      <dt>false</dt><dd>The Graphic's width and height attributes are, either explicitly set through the <code>width</code> and <code>height</code>","     *      attributes or are determined by the dimensions of the parent element. The contents of the Graphic instance are not affected by this setting.</dd>","     *  </dl>","     *","     *","     *  @config autoSize","     *  @type Boolean | String","     *  @default false","     */","    autoSize: {","        value: false","    },","","    /**","     * Determines how content is sized when <code>autoSize</code> is set to <code>sizeContentToGraphic</code>.","     *","     *  <dl>","     *      <dt>none<dt><dd>Do not force uniform scaling. Scale the graphic content of the given element non-uniformly if necessary ","     *      such that the element's bounding box exactly matches the viewport rectangle.</dd>","     *      <dt>xMinYMin</dt><dd>Force uniform scaling position along the top left of the Graphic's node.</dd>","     *      <dt>xMidYMin</dt><dd>Force uniform scaling horizontally centered and positioned at the top of the Graphic's node.<dd>","     *      <dt>xMaxYMin</dt><dd>Force uniform scaling positioned horizontally from the right and vertically from the top.</dd>","     *      <dt>xMinYMid</dt>Force uniform scaling positioned horizontally from the left and vertically centered.</dd>","     *      <dt>xMidYMid (the default)</dt><dd>Force uniform scaling with the content centered.</dd>","     *      <dt>xMaxYMid</dt><dd>Force uniform scaling positioned horizontally from the right and vertically centered.</dd>","     *      <dt>xMinYMax</dt><dd>Force uniform scaling positioned horizontally from the left and vertically from the bottom.</dd>","     *      <dt>xMidYMax</dt><dd>Force uniform scaling horizontally centered and position vertically from the bottom.</dd>","     *      <dt>xMaxYMax</dt><dd>Force uniform scaling positioned horizontally from the right and vertically from the bottom.</dd>","     *  </dl>","     * ","     * @config preserveAspectRatio","     * @type String","     * @default xMidYMid","     */","    preserveAspectRatio: {","        value: \"xMidYMid\"","    },","","    /**","     * The contentBounds will resize to greater values but not smaller values. (for performance)","     * When resizing the contentBounds down is desirable, set the resizeDown value to true.","     *","     * @config resizeDown ","     * @type Boolean","     */","    resizeDown: {","        getter: function()","        {","            return this._resizeDown;","        },","","        setter: function(val)","        {","            this._resizeDown = val;","            if(this._node)","            {","                this._redraw();","            }","            return val;","        }","    },","","	/**","	 * Indicates the x-coordinate for the instance.","	 *","	 * @config x","	 * @type Number","	 */","    x: {","        getter: function()","        {","            return this._x;","        },","","        setter: function(val)","        {","            this._x = val;","            if(this._node)","            {","                this._node.style.left = val + \"px\";","            }","            return val;","        }","    },","","	/**","	 * Indicates the y-coordinate for the instance.","	 *","	 * @config y","	 * @type Number","	 */","    y: {","        getter: function()","        {","            return this._y;","        },","","        setter: function(val)","        {","            this._y = val;","            if(this._node)","            {","                this._node.style.top = val + \"px\";","            }","            return val;","        }","    },","","    /**","     * Indicates whether or not the instance will automatically redraw after a change is made to a shape.","     * This property will get set to false when batching operations.","     *","     * @config autoDraw","     * @type Boolean","     * @default true","     * @private","     */","    autoDraw: {","        value: true","    },","","	/**","	 * Indicates whether the `Graphic` and its children are visible.","	 *","	 * @config visible","	 * @type Boolean","	 */","    visible: {","        value: true,","","        setter: function(val)","        {","            this._toggleVisible(val);","            return val;","        }","    }","};","","Y.extend(CanvasGraphic, Y.GraphicBase, {","    /**","     * Storage for `x` attribute.","     *","     * @property _x","     * @type Number","     * @private","     */","    _x: 0,","","    /**","     * Storage for `y` attribute.","     *","     * @property _y","     * @type Number","     * @private","     */","    _y: 0,","","    /**","     * Gets the current position of the graphic instance in page coordinates.","     *","     * @method getXY","     * @return Array The XY position of the shape.","     */","    getXY: function()","    {","        var node = Y.one(this._node),","            xy;","        if(node)","        {","            xy = node.getXY();","        }","        return xy;","    },","","    /**","     * Storage for `resizeDown` attribute.","     *","     * @property _resizeDown ","     * @type Boolean","     * @private","     */","    _resizeDown: false,","    ","	/**","     * Initializes the class.","     *","     * @method initializer","     * @param {Object} config Optional attributes ","     * @private","     */","    initializer: function(config) {","        var render = this.get(\"render\"),","            visibility = this.get(\"visible\") ? \"visible\" : \"hidden\",","            w = this.get(\"width\") || 0,","            h = this.get(\"height\") || 0;","        this._shapes = {};","        this._redrawQueue = {};","		this._contentBounds = {","            left: 0,","            top: 0,","            right: 0,","            bottom: 0","        };","        this._node = DOCUMENT.createElement('div');","        this._node.style.position = \"absolute\";","        this._node.style.visibility = visibility;","        this.set(\"width\", w);","        this.set(\"height\", h);","        if(render)","        {","            this.render(render);","        }","    },","","    /**","     * Adds the graphics node to the dom.","     * ","     * @method render","     * @param {HTMLElement} parentNode node in which to render the graphics node into.","     */","    render: function(render) {","        var parentNode = Y.one(render),","            node = this._node,","            w = this.get(\"width\") || parseInt(parentNode.getComputedStyle(\"width\"), 10),","            h = this.get(\"height\") || parseInt(parentNode.getComputedStyle(\"height\"), 10);","        parentNode = parentNode || DOCUMENT.body;","        parentNode.appendChild(node);","        node.style.display = \"block\";","        node.style.position = \"absolute\";","        node.style.left = \"0px\";","        node.style.top = \"0px\";","        this.set(\"width\", w);","        this.set(\"height\", h);","        this.parentNode = parentNode;","        return this;","    },","","    /**","     * Removes all nodes.","     *","     * @method destroy","     */","    destroy: function()","    {","        this.removeAllShapes();","        if(this._node)","        {","            this._removeChildren(this._node);","            Y.one(this._node).destroy();","        }","    },","","    /**","     * Generates a shape instance by type.","     *","     * @method addShape","     * @param {Object} cfg attributes for the shape","     * @return Shape","     */","    addShape: function(cfg)","    {","        cfg.graphic = this;","        if(!this.get(\"visible\"))","        {","            cfg.visible = false;","        }","        var shapeClass = this._getShapeClass(cfg.type),","            shape = new shapeClass(cfg);","        this._appendShape(shape);","        return shape;","    },","","    /**","     * Adds a shape instance to the graphic instance.","     *","     * @method _appendShape","     * @param {Shape} shape The shape instance to be added to the graphic.","     * @private","     */","    _appendShape: function(shape)","    {","        var node = shape.node,","            parentNode = this._frag || this._node;","        if(this.get(\"autoDraw\")) ","        {","            parentNode.appendChild(node);","        }","        else","        {","            this._getDocFrag().appendChild(node);","        }","    },","","    /**","     * Removes a shape instance from from the graphic instance.","     *","     * @method removeShape","     * @param {Shape|String} shape The instance or id of the shape to be removed.","     */","    removeShape: function(shape)","    {","        if(!(shape instanceof CanvasShape))","        {","            if(Y_LANG.isString(shape))","            {","                shape = this._shapes[shape];","            }","        }","        if(shape && shape instanceof CanvasShape)","        {","            shape._destroy();","            delete this._shapes[shape.get(\"id\")];","        }","        if(this.get(\"autoDraw\")) ","        {","            this._redraw();","        }","        return shape;","    },","","    /**","     * Removes all shape instances from the dom.","     *","     * @method removeAllShapes","     */","    removeAllShapes: function()","    {","        var shapes = this._shapes,","            i;","        for(i in shapes)","        {","            if(shapes.hasOwnProperty(i))","            {","                shapes[i].destroy();","            }","        }","        this._shapes = {};","    },","    ","    /**","     * Clears the graphics object.","     *","     * @method clear","     */","    clear: function() {","        this.removeAllShapes();","    },","","    /**","     * Removes all child nodes.","     *","     * @method _removeChildren","     * @param {HTMLElement} node","     * @private","     */","    _removeChildren: function(node)","    {","        if(node && node.hasChildNodes())","        {","            var child;","            while(node.firstChild)","            {","                child = node.firstChild;","                this._removeChildren(child);","                node.removeChild(child);","            }","        }","    },","    ","    /**","     * Toggles visibility","     *","     * @method _toggleVisible","     * @param {Boolean} val indicates visibilitye","     * @private","     */","    _toggleVisible: function(val)","    {","        var i,","            shapes = this._shapes,","            visibility = val ? \"visible\" : \"hidden\";","        if(shapes)","        {","            for(i in shapes)","            {","                if(shapes.hasOwnProperty(i))","                {","                    shapes[i].set(\"visible\", val);","                }","            }","        }","        if(this._node)","        {","            this._node.style.visibility = visibility;","        }","    },","","    /**","     * Returns a shape class. Used by `addShape`. ","     *","     * @method _getShapeClass","     * @param {Shape | String} val Indicates which shape class. ","     * @return Function ","     * @private","     */","    _getShapeClass: function(val)","    {","        var shape = this._shapeClass[val];","        if(shape)","        {","            return shape;","        }","        return val;","    },","    ","    /**","     * Look up for shape classes. Used by `addShape` to retrieve a class for instantiation.","     *","     * @property _shapeClass","     * @type Object","     * @private","     */","    _shapeClass: {","        circle: Y.CanvasCircle,","        rect: Y.CanvasRect,","        path: Y.CanvasPath,","        ellipse: Y.CanvasEllipse,","        pieslice: Y.CanvasPieSlice","    },","    ","    /**","     * Returns a shape based on the id of its dom node.","     *","     * @method getShapeById","     * @param {String} id Dom id of the shape's node attribute.","     * @return Shape","     */","    getShapeById: function(id)","    {","        var shape = this._shapes[id];","        return shape;","    },","","	/**","	 * Allows for creating multiple shapes in order to batch appending and redraw operations.","	 *","	 * @method batch","	 * @param {Function} method Method to execute.","	 */","    batch: function(method)","    {","        var autoDraw = this.get(\"autoDraw\");","        this.set(\"autoDraw\", false);","        method();","        this._redraw();","        this.set(\"autoDraw\", autoDraw);","    },","","    /**","     * Returns a document fragment to for attaching shapes.","     *","     * @method _getDocFrag","     * @return DocumentFragment","     * @private","     */","    _getDocFrag: function()","    {","        if(!this._frag)","        {","            this._frag = DOCUMENT.createDocumentFragment();","        }","        return this._frag;","    },","    ","    /**","     * Redraws all shapes.","     *","     * @method _redraw","     * @private","     */","    _redraw: function()","    {","        var autoSize = this.get(\"autoSize\"),","            preserveAspectRatio = this.get(\"preserveAspectRatio\"),","            box = this.get(\"resizeDown\") ? this._getUpdatedContentBounds() : this._contentBounds,","            contentWidth,","            contentHeight,","            w,","            h,","            xScale,","            yScale,","            translateX = 0,","            translateY = 0,","            matrix,","            node = this.get(\"node\");","        if(autoSize)","        {","            if(autoSize == \"sizeContentToGraphic\")","            {","                contentWidth = box.width;","                contentHeight = box.height;","                w = parseFloat(Y_DOM.getComputedStyle(node, \"width\"));","                h = parseFloat(Y_DOM.getComputedStyle(node, \"height\"));","                matrix = new Y.Matrix();","                if(preserveAspectRatio == \"none\")","                {","                    xScale = w/contentWidth;","                    yScale = h/contentHeight;","                }","                else","                {","                    if(contentWidth/contentHeight !== w/h) ","                    {","                        if(contentWidth * h/contentHeight > w)","                        {","                            xScale = yScale = w/contentWidth;","                            translateY = this._calculateTranslate(preserveAspectRatio.slice(5).toLowerCase(), contentHeight * w/contentWidth, h);","                        }","                        else","                        {","                            xScale = yScale = h/contentHeight;","                            translateX = this._calculateTranslate(preserveAspectRatio.slice(1, 4).toLowerCase(), contentWidth * h/contentHeight, w);","                        }","                    }","                }","                Y_DOM.setStyle(node, \"transformOrigin\", \"0% 0%\");","                translateX = translateX - (box.left * xScale);","                translateY = translateY - (box.top * yScale);","                matrix.translate(translateX, translateY);","                matrix.scale(xScale, yScale);","                Y_DOM.setStyle(node, \"transform\", matrix.toCSSText());","            }","            else","            {","                this.set(\"width\", box.right);","                this.set(\"height\", box.bottom);","            }","        }","        if(this._frag)","        {","            this._node.appendChild(this._frag);","            this._frag = null;","        }","    },","    ","    /**","     * Determines the value for either an x or y value to be used for the <code>translate</code> of the Graphic.","     *","     * @method _calculateTranslate","     * @param {String} position The position for placement. Possible values are min, mid and max.","     * @param {Number} contentSize The total size of the content.","     * @param {Number} boundsSize The total size of the Graphic.","     * @return Number","     * @private","     */","    _calculateTranslate: function(position, contentSize, boundsSize)","    {","        var ratio = boundsSize - contentSize,","            coord;","        switch(position)","        {","            case \"mid\" :","                coord = ratio * 0.5;","            break;","            case \"max\" :","                coord = ratio;","            break;","            default :","                coord = 0;","            break;","        }","        return coord;","    },","    ","    /**","     * Adds a shape to the redraw queue and calculates the contentBounds. Used internally ","     * by `Shape` instances.","     *","     * @method addToRedrawQueue","     * @param Shape shape The shape instance to add to the queue","     * @protected","     */","    addToRedrawQueue: function(shape)","    {","        var shapeBox,","            box;","        this._shapes[shape.get(\"id\")] = shape;","        if(!this.get(\"resizeDown\"))","        {","            shapeBox = shape.getBounds();","            box = this._contentBounds;","            box.left = box.left < shapeBox.left ? box.left : shapeBox.left;","            box.top = box.top < shapeBox.top ? box.top : shapeBox.top;","            box.right = box.right > shapeBox.right ? box.right : shapeBox.right;","            box.bottom = box.bottom > shapeBox.bottom ? box.bottom : shapeBox.bottom;","            box.width = box.right - box.left;","            box.height = box.bottom - box.top;","            this._contentBounds = box;","        }","        if(this.get(\"autoDraw\")) ","        {","            this._redraw();","        }","    },","","    /**","     * Recalculates and returns the `contentBounds` for the `Graphic` instance.","     *","     * @method _getUpdatedContentBounds","     * @return {Object} ","     * @private","     */","    _getUpdatedContentBounds: function()","    {","        var bounds,","            i,","            shape,","            queue = this._shapes,","            box = {","                left: 0,","                top: 0,","                right: 0,","                bottom: 0","            };","        for(i in queue)","        {","            if(queue.hasOwnProperty(i))","            {","                shape = queue[i];","                bounds = shape.getBounds();","                box.left = Math.min(box.left, bounds.left);","                box.top = Math.min(box.top, bounds.top);","                box.right = Math.max(box.right, bounds.right);","                box.bottom = Math.max(box.bottom, bounds.bottom);","            }","        }","        box.width = box.right - box.left;","        box.height = box.bottom - box.top;","        this._contentBounds = box;","        return box;","    }","});","","Y.CanvasGraphic = CanvasGraphic;","","","}, '@VERSION@', {\"requires\": [\"graphics\"]});"];
_yuitest_coverage["graphics-canvas"].lines = {"1":0,"3":0,"34":0,"38":0,"66":0,"67":0,"68":0,"71":0,"72":0,"78":0,"89":0,"101":0,"103":0,"105":0,"106":0,"108":0,"110":0,"111":0,"126":0,"127":0,"128":0,"129":0,"140":0,"142":0,"153":0,"156":0,"157":0,"158":0,"172":0,"184":0,"190":0,"192":0,"194":0,"195":0,"198":0,"199":0,"201":0,"203":0,"204":0,"205":0,"206":0,"207":0,"208":0,"209":0,"212":0,"213":0,"224":0,"225":0,"226":0,"227":0,"228":0,"229":0,"230":0,"245":0,"252":0,"253":0,"254":0,"255":0,"256":0,"257":0,"258":0,"259":0,"260":0,"261":0,"262":0,"263":0,"276":0,"284":0,"285":0,"286":0,"287":0,"288":0,"289":0,"290":0,"291":0,"292":0,"293":0,"294":0,"295":0,"308":0,"312":0,"313":0,"314":0,"315":0,"316":0,"317":0,"318":0,"333":0,"335":0,"336":0,"337":0,"338":0,"339":0,"340":0,"354":0,"366":0,"367":0,"368":0,"369":0,"371":0,"372":0,"373":0,"374":0,"375":0,"376":0,"377":0,"379":0,"380":0,"381":0,"382":0,"395":0,"396":0,"397":0,"398":0,"399":0,"400":0,"401":0,"402":0,"417":0,"418":0,"419":0,"420":0,"421":0,"422":0,"423":0,"424":0,"425":0,"426":0,"427":0,"428":0,"445":0,"458":0,"460":0,"462":0,"464":0,"467":0,"469":0,"474":0,"477":0,"481":0,"484":0,"487":0,"490":0,"491":0,"492":0,"494":0,"496":0,"497":0,"498":0,"499":0,"500":0,"501":0,"502":0,"505":0,"507":0,"508":0,"509":0,"518":0,"519":0,"529":0,"530":0,"547":0,"567":0,"569":0,"571":0,"572":0,"576":0,"577":0,"579":0,"580":0,"584":0,"586":0,"587":0,"591":0,"592":0,"594":0,"595":0,"597":0,"598":0,"600":0,"601":0,"602":0,"603":0,"604":0,"606":0,"607":0,"611":0,"613":0,"614":0,"616":0,"627":0,"648":0,"649":0,"650":0,"651":0,"652":0,"653":0,"654":0,"655":0,"656":0,"658":0,"660":0,"662":0,"664":0,"665":0,"666":0,"667":0,"668":0,"669":0,"675":0,"677":0,"678":0,"682":0,"683":0,"685":0,"687":0,"688":0,"689":0,"690":0,"691":0,"693":0,"694":0,"698":0,"700":0,"701":0,"702":0,"704":0,"707":0,"718":0,"719":0,"720":0,"721":0,"722":0,"723":0,"724":0,"725":0,"726":0,"727":0,"728":0,"729":0,"749":0,"750":0,"763":0,"768":0,"769":0,"772":0,"773":0,"774":0,"775":0,"778":0,"792":0,"801":0,"803":0,"804":0,"805":0,"806":0,"807":0,"809":0,"810":0,"811":0,"812":0,"813":0,"814":0,"826":0,"827":0,"829":0,"831":0,"833":0,"835":0,"837":0,"839":0,"841":0,"842":0,"845":0,"857":0,"859":0,"860":0,"861":0,"864":0,"866":0,"876":0,"887":0,"889":0,"890":0,"891":0,"892":0,"893":0,"895":0,"897":0,"910":0,"911":0,"913":0,"917":0,"918":0,"921":0,"922":0,"934":0,"935":0,"946":0,"947":0,"958":0,"962":0,"973":0,"977":0,"978":0,"979":0,"991":0,"1003":0,"1015":0,"1016":0,"1027":0,"1046":0,"1099":0,"1101":0,"1102":0,"1103":0,"1104":0,"1106":0,"1108":0,"1109":0,"1110":0,"1111":0,"1125":0,"1127":0,"1129":0,"1141":0,"1147":0,"1149":0,"1150":0,"1151":0,"1152":0,"1153":0,"1154":0,"1155":0,"1156":0,"1157":0,"1159":0,"1161":0,"1165":0,"1167":0,"1168":0,"1172":0,"1174":0,"1175":0,"1177":0,"1181":0,"1182":0,"1184":0,"1185":0,"1191":0,"1206":0,"1208":0,"1209":0,"1211":0,"1224":0,"1228":0,"1230":0,"1231":0,"1232":0,"1234":0,"1236":0,"1238":0,"1239":0,"1241":0,"1242":0,"1246":0,"1249":0,"1250":0,"1254":0,"1259":0,"1260":0,"1273":0,"1274":0,"1275":0,"1287":0,"1288":0,"1300":0,"1301":0,"1313":0,"1324":0,"1335":0,"1346":0,"1347":0,"1358":0,"1389":0,"1390":0,"1391":0,"1392":0,"1393":0,"1395":0,"1407":0,"1415":0,"1417":0,"1419":0,"1420":0,"1422":0,"1425":0,"1428":0,"1429":0,"1430":0,"1431":0,"1432":0,"1433":0,"1434":0,"1436":0,"1437":0,"1438":0,"1439":0,"1441":0,"1452":0,"1453":0,"1464":0,"1465":0,"1466":0,"1467":0,"1468":0,"1479":0,"1481":0,"1483":0,"1495":0,"1496":0,"1498":0,"1499":0,"1501":0,"1503":0,"1505":0,"1506":0,"1507":0,"1508":0,"1510":0,"1512":0,"1516":0,"1520":0,"1521":0,"1522":0,"1523":0,"1525":0,"1526":0,"1528":0,"1529":0,"1531":0,"1533":0,"1535":0,"1537":0,"1538":0,"1542":0,"1548":0,"1549":0,"1550":0,"1551":0,"1552":0,"1565":0,"1567":0,"1569":0,"1571":0,"1573":0,"1577":0,"1579":0,"1580":0,"1583":0,"1584":0,"1586":0,"1588":0,"1589":0,"1590":0,"1592":0,"1594":0,"1595":0,"1611":0,"1623":0,"1624":0,"1626":0,"1628":0,"1629":0,"1630":0,"1631":0,"1634":0,"1635":0,"1637":0,"1639":0,"1641":0,"1643":0,"1646":0,"1652":0,"1653":0,"1655":0,"1657":0,"1671":0,"1678":0,"1680":0,"1681":0,"1682":0,"1683":0,"1685":0,"1687":0,"1689":0,"1690":0,"1691":0,"1692":0,"1693":0,"1708":0,"1718":0,"1720":0,"1721":0,"1723":0,"1724":0,"1725":0,"1726":0,"1728":0,"1729":0,"1730":0,"1732":0,"1735":0,"1736":0,"1737":0,"1747":0,"1748":0,"1750":0,"1754":0,"1766":0,"1768":0,"1769":0,"1770":0,"1775":0,"1786":0,"1822":0,"1823":0,"1824":0,"1825":0,"1830":0,"1846":0,"1859":0,"1864":0,"1865":0,"1867":0,"1869":0,"1923":0,"1925":0,"1927":0,"1929":0,"1981":0,"1983":0,"1984":0,"1986":0,"1988":0,"1991":0,"1992":0,"2029":0,"2031":0,"2033":0,"2034":0,"2036":0,"2039":0,"2040":0,"2041":0,"2071":0,"2075":0,"2087":0,"2089":0,"2091":0,"2092":0,"2110":0,"2111":0,"2123":0,"2125":0,"2126":0,"2127":0,"2128":0,"2129":0,"2130":0,"2131":0,"2132":0,"2133":0,"2143":0,"2147":0,"2157":0,"2158":0,"2163":0,"2164":0,"2177":0,"2178":0,"2183":0,"2184":0,"2200":0,"2204":0,"2216":0,"2218":0,"2220":0,"2221":0,"2239":0,"2241":0,"2242":0,"2243":0,"2246":0,"2247":0,"2259":0,"2261":0,"2264":0,"2266":0,"2284":0,"2286":0,"2287":0,"2288":0,"2291":0,"2301":0,"2306":0,"2307":0,"2309":0,"2311":0,"2325":0,"2330":0,"2331":0,"2333":0,"2335":0,"2339":0,"2351":0,"2353":0,"2356":0,"2358":0,"2376":0,"2377":0,"2379":0,"2380":0,"2381":0,"2386":0,"2396":0,"2397":0,"2402":0,"2415":0,"2416":0,"2421":0,"2435":0,"2443":0,"2445":0,"2447":0,"2448":0,"2466":0,"2471":0,"2472":0,"2473":0,"2474":0,"2475":0,"2476":0,"2477":0,"2480":0,"2518":0,"2530":0,"2532":0,"2535":0,"2537":0,"2555":0,"2560":0,"2561":0,"2563":0,"2565":0,"2581":0,"2597":0,"2613":0,"2626":0,"2628":0,"2630":0,"2643":0,"2645":0,"2647":0,"2707":0,"2712":0,"2713":0,"2715":0,"2717":0,"2730":0,"2735":0,"2736":0,"2738":0,"2740":0,"2753":0,"2758":0,"2759":0,"2761":0,"2763":0,"2791":0,"2792":0,"2797":0,"2824":0,"2826":0,"2828":0,"2830":0,"2850":0,"2854":0,"2855":0,"2856":0,"2862":0,"2863":0,"2864":0,"2865":0,"2866":0,"2867":0,"2869":0,"2880":0,"2884":0,"2885":0,"2886":0,"2887":0,"2888":0,"2889":0,"2890":0,"2891":0,"2892":0,"2893":0,"2903":0,"2904":0,"2906":0,"2907":0,"2920":0,"2921":0,"2923":0,"2925":0,"2927":0,"2928":0,"2940":0,"2942":0,"2944":0,"2948":0,"2960":0,"2962":0,"2964":0,"2967":0,"2969":0,"2970":0,"2972":0,"2974":0,"2976":0,"2986":0,"2988":0,"2990":0,"2992":0,"2995":0,"3004":0,"3016":0,"3018":0,"3019":0,"3021":0,"3022":0,"3023":0,"3037":0,"3040":0,"3042":0,"3044":0,"3046":0,"3050":0,"3052":0,"3066":0,"3067":0,"3069":0,"3071":0,"3098":0,"3099":0,"3110":0,"3111":0,"3112":0,"3113":0,"3114":0,"3126":0,"3128":0,"3130":0,"3141":0,"3154":0,"3156":0,"3158":0,"3159":0,"3160":0,"3161":0,"3162":0,"3163":0,"3165":0,"3166":0,"3170":0,"3172":0,"3174":0,"3175":0,"3179":0,"3180":0,"3184":0,"3185":0,"3186":0,"3187":0,"3188":0,"3189":0,"3193":0,"3194":0,"3197":0,"3199":0,"3200":0,"3216":0,"3218":0,"3221":0,"3222":0,"3224":0,"3225":0,"3227":0,"3228":0,"3230":0,"3243":0,"3245":0,"3246":0,"3248":0,"3249":0,"3250":0,"3251":0,"3252":0,"3253":0,"3254":0,"3255":0,"3256":0,"3258":0,"3260":0,"3273":0,"3283":0,"3285":0,"3287":0,"3288":0,"3289":0,"3290":0,"3291":0,"3292":0,"3295":0,"3296":0,"3297":0,"3298":0,"3302":0};
_yuitest_coverage["graphics-canvas"].functions = {"CanvasDrawing:34":0,"_toRGBA:65":0,"_toRGB:88":0,"setSize:100":0,"_updateCoords:124":0,"_clearAndUpdateCoords:138":0,"_updateNodePosition:151":0,"_updateDrawingQueue:170":0,"lineTo:182":0,"moveTo:223":0,"curveTo:244":0,"quadraticCurveTo:275":0,"drawCircle:307":0,"drawDiamond:331":0,"drawEllipse:353":0,"drawRect:394":0,"drawRoundRect:416":0,"drawWedge:443":0,"end:517":0,"closePath:527":0,"_getLinearGradient:546":0,"_getRadialGradient:626":0,"_initProps:717":0,"_createGraphic:748":0,"getBezierData:762":0,"_setCurveBoundingBox:790":0,"_trackSize:825":0,"CanvasShape:857":0,"init:874":0,"initializer:885":0,"_setGraphic:908":0,"addClass:932":0,"removeClass:944":0,"getXY:956":0,"setXY:971":0,"contains:989":0,"test:1001":0,"compareTo:1014":0,"_getDefaultFill:1026":0,"_getDefaultStroke:1044":0,"createNode:1097":0,"on:1123":0,"_setStrokeProps:1139":0,"set:1204":0,"_setFillProps:1222":0,"translate:1271":0,"translateX:1285":0,"translateY:1298":0,"skew:1311":0,"skewX:1322":0,"skewY:1333":0,"rotate:1344":0,"scale:1356":0,"_addTransform:1387":0,"_updateTransform:1405":0,"_updateHandler:1450":0,"_draw:1462":0,"_closePath:1477":0,"_strokeAndFill:1563":0,"_drawDashedLine:1609":0,"clear:1651":0,"getBounds:1669":0,"_getContentRect:1706":0,"destroy:1745":0,"_destroy:1764":0,"valueFn:1784":0,"setter:1820":0,"getter:1828":0,"getter:1844":0,"valueFn:1857":0,"setter:1862":0,"setter:1922":0,"setter:1979":0,"setter:2027":0,"getter:2069":0,"CanvasPath:2087":0,"_draw:2108":0,"createNode:2121":0,"end:2141":0,"getter:2155":0,"setter:2161":0,"getter:2175":0,"setter:2181":0,"getter:2198":0,"CanvasRect:2216":0,"_draw:2237":0,"CanvasEllipse:2259":0,"_draw:2282":0,"setter:2299":0,"getter:2304":0,"setter:2323":0,"getter:2328":0,"CanvasCircle:2351":0,"_draw:2374":0,"setter:2394":0,"getter:2400":0,"setter:2413":0,"getter:2419":0,"CanvasPieSlice:2443":0,"_draw:2464":0,"CanvasGraphic:2530":0,"valueFn:2553":0,"setter:2558":0,"getter:2579":0,"getter:2595":0,"getter:2611":0,"setter:2624":0,"setter:2641":0,"getter:2705":0,"setter:2710":0,"getter:2728":0,"setter:2733":0,"getter:2751":0,"setter:2756":0,"setter:2789":0,"getXY:2822":0,"initializer:2849":0,"render:2879":0,"destroy:2901":0,"addShape:2918":0,"_appendShape:2938":0,"removeShape:2958":0,"removeAllShapes:2984":0,"clear:3003":0,"_removeChildren:3014":0,"_toggleVisible:3035":0,"_getShapeClass:3064":0,"getShapeById:3096":0,"batch:3108":0,"_getDocFrag:3124":0,"_redraw:3139":0,"_calculateTranslate:3214":0,"addToRedrawQueue:3241":0,"_getUpdatedContentBounds:3271":0,"(anonymous 1):1":0};
_yuitest_coverage["graphics-canvas"].coveredLines = 829;
_yuitest_coverage["graphics-canvas"].coveredFunctions = 135;
_yuitest_coverline("graphics-canvas", 1);
YUI.add('graphics-canvas', function (Y, NAME) {

_yuitest_coverfunc("graphics-canvas", "(anonymous 1)", 1);
_yuitest_coverline("graphics-canvas", 3);
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
_yuitest_coverline("graphics-canvas", 34);
function CanvasDrawing()
{
}

_yuitest_coverline("graphics-canvas", 38);
CanvasDrawing.prototype = {
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
        _yuitest_coverfunc("graphics-canvas", "_toRGBA", 65);
_yuitest_coverline("graphics-canvas", 66);
alpha = (alpha !== undefined) ? alpha : 1;
        _yuitest_coverline("graphics-canvas", 67);
if (!Y_Color.re_RGB.test(val)) {
            _yuitest_coverline("graphics-canvas", 68);
val = TOHEX(val);
        }

        _yuitest_coverline("graphics-canvas", 71);
if(Y_Color.re_hex.exec(val)) {
            _yuitest_coverline("graphics-canvas", 72);
val = 'rgba(' + [
                PARSE_INT(RE.$1, 16),
                PARSE_INT(RE.$2, 16),
                PARSE_INT(RE.$3, 16)
            ].join(',') + ',' + alpha + ')';
        }
        _yuitest_coverline("graphics-canvas", 78);
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
        _yuitest_coverfunc("graphics-canvas", "_toRGB", 88);
_yuitest_coverline("graphics-canvas", 89);
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
        _yuitest_coverfunc("graphics-canvas", "setSize", 100);
_yuitest_coverline("graphics-canvas", 101);
if(this.get("autoSize"))
        {
            _yuitest_coverline("graphics-canvas", 103);
if(w > this.node.getAttribute("width"))
            {
                _yuitest_coverline("graphics-canvas", 105);
this.node.style.width = w + "px";
                _yuitest_coverline("graphics-canvas", 106);
this.node.setAttribute("width", w);
            }
            _yuitest_coverline("graphics-canvas", 108);
if(h > this.node.getAttribute("height"))
            {
                _yuitest_coverline("graphics-canvas", 110);
this.node.style.height = h + "px";
                _yuitest_coverline("graphics-canvas", 111);
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
        _yuitest_coverfunc("graphics-canvas", "_updateCoords", 124);
_yuitest_coverline("graphics-canvas", 126);
this._xcoords.push(x);
        _yuitest_coverline("graphics-canvas", 127);
this._ycoords.push(y);
        _yuitest_coverline("graphics-canvas", 128);
this._currentX = x;
        _yuitest_coverline("graphics-canvas", 129);
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
        _yuitest_coverfunc("graphics-canvas", "_clearAndUpdateCoords", 138);
_yuitest_coverline("graphics-canvas", 140);
var x = this._xcoords.pop() || 0,
            y = this._ycoords.pop() || 0;
        _yuitest_coverline("graphics-canvas", 142);
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
        _yuitest_coverfunc("graphics-canvas", "_updateNodePosition", 151);
_yuitest_coverline("graphics-canvas", 153);
var node = this.get("node"),
            x = this.get("x"),
            y = this.get("y"); 
        _yuitest_coverline("graphics-canvas", 156);
node.style.position = "absolute";
        _yuitest_coverline("graphics-canvas", 157);
node.style.left = (x + this._left) + "px";
        _yuitest_coverline("graphics-canvas", 158);
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
        _yuitest_coverfunc("graphics-canvas", "_updateDrawingQueue", 170);
_yuitest_coverline("graphics-canvas", 172);
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
        _yuitest_coverfunc("graphics-canvas", "lineTo", 182);
_yuitest_coverline("graphics-canvas", 184);
var args = arguments, 
            i = 0, 
            len,
            x,
            y,
            wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0;
        _yuitest_coverline("graphics-canvas", 190);
if(!this._lineToMethods)
        {
            _yuitest_coverline("graphics-canvas", 192);
this._lineToMethods = [];
        }
        _yuitest_coverline("graphics-canvas", 194);
if (typeof point1 === 'string' || typeof point1 === 'number') {
            _yuitest_coverline("graphics-canvas", 195);
args = [[point1, point2]];
        }

        _yuitest_coverline("graphics-canvas", 198);
len = args.length;
        _yuitest_coverline("graphics-canvas", 199);
for (; i < len; ++i) 
        {
            _yuitest_coverline("graphics-canvas", 201);
if(args[i])
            {
                _yuitest_coverline("graphics-canvas", 203);
x = args[i][0];
                _yuitest_coverline("graphics-canvas", 204);
y = args[i][1];
                _yuitest_coverline("graphics-canvas", 205);
this._updateDrawingQueue(["lineTo", x, y]);
                _yuitest_coverline("graphics-canvas", 206);
this._lineToMethods[this._lineToMethods.length] = this._methods[this._methods.length - 1];
                _yuitest_coverline("graphics-canvas", 207);
this._trackSize(x - wt, y - wt);
                _yuitest_coverline("graphics-canvas", 208);
this._trackSize(x + wt, y + wt);
                _yuitest_coverline("graphics-canvas", 209);
this._updateCoords(x, y);
            }
        }
        _yuitest_coverline("graphics-canvas", 212);
this._drawingComplete = false;
        _yuitest_coverline("graphics-canvas", 213);
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
        _yuitest_coverfunc("graphics-canvas", "moveTo", 223);
_yuitest_coverline("graphics-canvas", 224);
var wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0;
        _yuitest_coverline("graphics-canvas", 225);
this._updateDrawingQueue(["moveTo", x, y]);
        _yuitest_coverline("graphics-canvas", 226);
this._trackSize(x - wt, y - wt);
        _yuitest_coverline("graphics-canvas", 227);
this._trackSize(x + wt, y + wt);
        _yuitest_coverline("graphics-canvas", 228);
this._updateCoords(x, y);
        _yuitest_coverline("graphics-canvas", 229);
this._drawingComplete = false;
        _yuitest_coverline("graphics-canvas", 230);
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
        _yuitest_coverfunc("graphics-canvas", "curveTo", 244);
_yuitest_coverline("graphics-canvas", 245);
var w,
            h,
            pts,
            right,
            left,
            bottom,
            top;
        _yuitest_coverline("graphics-canvas", 252);
this._updateDrawingQueue(["bezierCurveTo", cp1x, cp1y, cp2x, cp2y, x, y]);
        _yuitest_coverline("graphics-canvas", 253);
this._drawingComplete = false;
        _yuitest_coverline("graphics-canvas", 254);
right = Math.max(x, Math.max(cp1x, cp2x));
        _yuitest_coverline("graphics-canvas", 255);
bottom = Math.max(y, Math.max(cp1y, cp2y));
        _yuitest_coverline("graphics-canvas", 256);
left = Math.min(x, Math.min(cp1x, cp2x));
        _yuitest_coverline("graphics-canvas", 257);
top = Math.min(y, Math.min(cp1y, cp2y));
        _yuitest_coverline("graphics-canvas", 258);
w = Math.abs(right - left);
        _yuitest_coverline("graphics-canvas", 259);
h = Math.abs(bottom - top);
        _yuitest_coverline("graphics-canvas", 260);
pts = [[this._currentX, this._currentY] , [cp1x, cp1y], [cp2x, cp2y], [x, y]]; 
        _yuitest_coverline("graphics-canvas", 261);
this._setCurveBoundingBox(pts, w, h);
        _yuitest_coverline("graphics-canvas", 262);
this._updateCoords(x, y);
        _yuitest_coverline("graphics-canvas", 263);
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
        _yuitest_coverfunc("graphics-canvas", "quadraticCurveTo", 275);
_yuitest_coverline("graphics-canvas", 276);
var w,
            h,
            pts,
            right,
            left,
            bottom,
            top,
            wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0;
        _yuitest_coverline("graphics-canvas", 284);
this._updateDrawingQueue(["quadraticCurveTo", cpx, cpy, x, y]);
        _yuitest_coverline("graphics-canvas", 285);
this._drawingComplete = false;
        _yuitest_coverline("graphics-canvas", 286);
right = Math.max(x, cpx);
        _yuitest_coverline("graphics-canvas", 287);
bottom = Math.max(y, cpy);
        _yuitest_coverline("graphics-canvas", 288);
left = Math.min(x, cpx);
        _yuitest_coverline("graphics-canvas", 289);
top = Math.min(y, cpy);
        _yuitest_coverline("graphics-canvas", 290);
w = Math.abs(right - left);
        _yuitest_coverline("graphics-canvas", 291);
h = Math.abs(bottom - top);
        _yuitest_coverline("graphics-canvas", 292);
pts = [[this._currentX, this._currentY] , [cpx, cpy], [x, y]]; 
        _yuitest_coverline("graphics-canvas", 293);
this._setCurveBoundingBox(pts, w, h);
        _yuitest_coverline("graphics-canvas", 294);
this._updateCoords(x, y);
        _yuitest_coverline("graphics-canvas", 295);
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
        _yuitest_coverfunc("graphics-canvas", "drawCircle", 307);
_yuitest_coverline("graphics-canvas", 308);
var startAngle = 0,
            endAngle = 2 * Math.PI,
            wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0,
            circum = radius * 2;
            _yuitest_coverline("graphics-canvas", 312);
circum += wt;
        _yuitest_coverline("graphics-canvas", 313);
this._drawingComplete = false;
        _yuitest_coverline("graphics-canvas", 314);
this._trackSize(x + circum, y + circum);
        _yuitest_coverline("graphics-canvas", 315);
this._trackSize(x - wt, y - wt);
        _yuitest_coverline("graphics-canvas", 316);
this._updateCoords(x, y);
        _yuitest_coverline("graphics-canvas", 317);
this._updateDrawingQueue(["arc", x + radius, y + radius, radius, startAngle, endAngle, false]);
        _yuitest_coverline("graphics-canvas", 318);
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
        _yuitest_coverfunc("graphics-canvas", "drawDiamond", 331);
_yuitest_coverline("graphics-canvas", 333);
var midWidth = width * 0.5,
            midHeight = height * 0.5;
        _yuitest_coverline("graphics-canvas", 335);
this.moveTo(x + midWidth, y);
        _yuitest_coverline("graphics-canvas", 336);
this.lineTo(x + width, y + midHeight);
        _yuitest_coverline("graphics-canvas", 337);
this.lineTo(x + midWidth, y + height);
        _yuitest_coverline("graphics-canvas", 338);
this.lineTo(x, y + midHeight);
        _yuitest_coverline("graphics-canvas", 339);
this.lineTo(x + midWidth, y);
        _yuitest_coverline("graphics-canvas", 340);
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
        _yuitest_coverfunc("graphics-canvas", "drawEllipse", 353);
_yuitest_coverline("graphics-canvas", 354);
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

        _yuitest_coverline("graphics-canvas", 366);
ax = centerX + Math.cos(0) * radius;
        _yuitest_coverline("graphics-canvas", 367);
ay = centerY + Math.sin(0) * yRadius;
        _yuitest_coverline("graphics-canvas", 368);
this.moveTo(ax, ay);
        _yuitest_coverline("graphics-canvas", 369);
for(; i < l; i++)
        {
            _yuitest_coverline("graphics-canvas", 371);
angle += theta;
            _yuitest_coverline("graphics-canvas", 372);
angleMid = angle - (theta / 2);
            _yuitest_coverline("graphics-canvas", 373);
bx = centerX + Math.cos(angle) * radius;
            _yuitest_coverline("graphics-canvas", 374);
by = centerY + Math.sin(angle) * yRadius;
            _yuitest_coverline("graphics-canvas", 375);
cx = centerX + Math.cos(angleMid) * (radius / Math.cos(theta / 2));
            _yuitest_coverline("graphics-canvas", 376);
cy = centerY + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));
            _yuitest_coverline("graphics-canvas", 377);
this._updateDrawingQueue(["quadraticCurveTo", cx, cy, bx, by]);
        }
        _yuitest_coverline("graphics-canvas", 379);
this._trackSize(x + w + wt, y + h + wt);
        _yuitest_coverline("graphics-canvas", 380);
this._trackSize(x - wt, y - wt);
        _yuitest_coverline("graphics-canvas", 381);
this._updateCoords(x, y);
        _yuitest_coverline("graphics-canvas", 382);
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
        _yuitest_coverfunc("graphics-canvas", "drawRect", 394);
_yuitest_coverline("graphics-canvas", 395);
var wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0;
        _yuitest_coverline("graphics-canvas", 396);
this._drawingComplete = false;
        _yuitest_coverline("graphics-canvas", 397);
this.moveTo(x, y);
        _yuitest_coverline("graphics-canvas", 398);
this.lineTo(x + w, y);
        _yuitest_coverline("graphics-canvas", 399);
this.lineTo(x + w, y + h);
        _yuitest_coverline("graphics-canvas", 400);
this.lineTo(x, y + h);
        _yuitest_coverline("graphics-canvas", 401);
this.lineTo(x, y);
        _yuitest_coverline("graphics-canvas", 402);
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
        _yuitest_coverfunc("graphics-canvas", "drawRoundRect", 416);
_yuitest_coverline("graphics-canvas", 417);
var wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0;
        _yuitest_coverline("graphics-canvas", 418);
this._drawingComplete = false;
        _yuitest_coverline("graphics-canvas", 419);
this.moveTo( x, y + eh);
        _yuitest_coverline("graphics-canvas", 420);
this.lineTo(x, y + h - eh);
        _yuitest_coverline("graphics-canvas", 421);
this.quadraticCurveTo(x, y + h, x + ew, y + h);
        _yuitest_coverline("graphics-canvas", 422);
this.lineTo(x + w - ew, y + h);
        _yuitest_coverline("graphics-canvas", 423);
this.quadraticCurveTo(x + w, y + h, x + w, y + h - eh);
        _yuitest_coverline("graphics-canvas", 424);
this.lineTo(x + w, y + eh);
        _yuitest_coverline("graphics-canvas", 425);
this.quadraticCurveTo(x + w, y, x + w - ew, y);
        _yuitest_coverline("graphics-canvas", 426);
this.lineTo(x + ew, y);
        _yuitest_coverline("graphics-canvas", 427);
this.quadraticCurveTo(x, y, x, y + eh);
        _yuitest_coverline("graphics-canvas", 428);
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
        _yuitest_coverfunc("graphics-canvas", "drawWedge", 443);
_yuitest_coverline("graphics-canvas", 445);
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
        _yuitest_coverline("graphics-canvas", 458);
yRadius = yRadius || radius;

        _yuitest_coverline("graphics-canvas", 460);
this._drawingComplete = false;
        // move to x,y position
        _yuitest_coverline("graphics-canvas", 462);
this._updateDrawingQueue(["moveTo", x, y]);
        
        _yuitest_coverline("graphics-canvas", 464);
yRadius = yRadius || radius;
        
        // limit sweep to reasonable numbers
        _yuitest_coverline("graphics-canvas", 467);
if(Math.abs(arc) > 360)
        {
            _yuitest_coverline("graphics-canvas", 469);
arc = 360;
        }
        
        // First we calculate how many segments are needed
        // for a smooth arc.
        _yuitest_coverline("graphics-canvas", 474);
segs = Math.ceil(Math.abs(arc) / 45);
        
        // Now calculate the sweep of each segment.
        _yuitest_coverline("graphics-canvas", 477);
segAngle = arc / segs;
        
        // The math requires radians rather than degrees. To convert from degrees
        // use the formula (degrees/180)*Math.PI to get radians.
        _yuitest_coverline("graphics-canvas", 481);
theta = -(segAngle / 180) * Math.PI;
        
        // convert angle startAngle to radians
        _yuitest_coverline("graphics-canvas", 484);
angle = (startAngle / 180) * Math.PI;
        
        // draw the curve in segments no larger than 45 degrees.
        _yuitest_coverline("graphics-canvas", 487);
if(segs > 0)
        {
            // draw a line from the center to the start of the curve
            _yuitest_coverline("graphics-canvas", 490);
ax = x + Math.cos(startAngle / 180 * Math.PI) * radius;
            _yuitest_coverline("graphics-canvas", 491);
ay = y + Math.sin(startAngle / 180 * Math.PI) * yRadius;
            _yuitest_coverline("graphics-canvas", 492);
this.lineTo(ax, ay);
            // Loop for drawing curve segments
            _yuitest_coverline("graphics-canvas", 494);
for(; i < segs; ++i)
            {
                _yuitest_coverline("graphics-canvas", 496);
angle += theta;
                _yuitest_coverline("graphics-canvas", 497);
angleMid = angle - (theta / 2);
                _yuitest_coverline("graphics-canvas", 498);
bx = x + Math.cos(angle) * radius;
                _yuitest_coverline("graphics-canvas", 499);
by = y + Math.sin(angle) * yRadius;
                _yuitest_coverline("graphics-canvas", 500);
cx = x + Math.cos(angleMid) * (radius / Math.cos(theta / 2));
                _yuitest_coverline("graphics-canvas", 501);
cy = y + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));
                _yuitest_coverline("graphics-canvas", 502);
this._updateDrawingQueue(["quadraticCurveTo", cx, cy, bx, by]);
            }
            // close the wedge by drawing a line to the center
            _yuitest_coverline("graphics-canvas", 505);
this._updateDrawingQueue(["lineTo", x, y]);
        }
        _yuitest_coverline("graphics-canvas", 507);
this._trackSize(0 - wt , 0 - wt);
        _yuitest_coverline("graphics-canvas", 508);
this._trackSize((radius * 2) + wt, (radius * 2) + wt);
        _yuitest_coverline("graphics-canvas", 509);
return this;
    },
    
    /**
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function() {
        _yuitest_coverfunc("graphics-canvas", "end", 517);
_yuitest_coverline("graphics-canvas", 518);
this._closePath();
        _yuitest_coverline("graphics-canvas", 519);
return this;
    },

    /**
     * Ends a fill and stroke
     *
     * @method closePath
     */
    closePath: function()
    {
        _yuitest_coverfunc("graphics-canvas", "closePath", 527);
_yuitest_coverline("graphics-canvas", 529);
this._updateDrawingQueue(["closePath"]);
        _yuitest_coverline("graphics-canvas", 530);
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
        _yuitest_coverfunc("graphics-canvas", "_getLinearGradient", 546);
_yuitest_coverline("graphics-canvas", 547);
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
        _yuitest_coverline("graphics-canvas", 567);
if(Math.abs(tanRadians) * w/2 >= h/2)
        {
            _yuitest_coverline("graphics-canvas", 569);
if(r < 180)
            {
                _yuitest_coverline("graphics-canvas", 571);
y1 = y;
                _yuitest_coverline("graphics-canvas", 572);
y2 = y + h;
            }
            else
            {
                _yuitest_coverline("graphics-canvas", 576);
y1 = y + h;
                _yuitest_coverline("graphics-canvas", 577);
y2 = y;
            }
            _yuitest_coverline("graphics-canvas", 579);
x1 = cx - ((cy - y1)/tanRadians);
            _yuitest_coverline("graphics-canvas", 580);
x2 = cx - ((cy - y2)/tanRadians); 
        }
        else
        {
            _yuitest_coverline("graphics-canvas", 584);
if(r > 90 && r < 270)
            {
                _yuitest_coverline("graphics-canvas", 586);
x1 = x + w;
                _yuitest_coverline("graphics-canvas", 587);
x2 = x;
            }
            else
            {
                _yuitest_coverline("graphics-canvas", 591);
x1 = x;
                _yuitest_coverline("graphics-canvas", 592);
x2 = x + w;
            }
            _yuitest_coverline("graphics-canvas", 594);
y1 = ((tanRadians * (cx - x1)) - cy) * -1;
            _yuitest_coverline("graphics-canvas", 595);
y2 = ((tanRadians * (cx - x2)) - cy) * -1;
        }
        _yuitest_coverline("graphics-canvas", 597);
gradient = this._context.createLinearGradient(x1, y1, x2, y2);
        _yuitest_coverline("graphics-canvas", 598);
for(; i < len; ++i)
        {
            _yuitest_coverline("graphics-canvas", 600);
stop = stops[i];
            _yuitest_coverline("graphics-canvas", 601);
opacity = stop.opacity;
            _yuitest_coverline("graphics-canvas", 602);
color = stop.color;
            _yuitest_coverline("graphics-canvas", 603);
offset = stop.offset;
            _yuitest_coverline("graphics-canvas", 604);
if(isNumber(opacity))
            {
                _yuitest_coverline("graphics-canvas", 606);
opacity = Math.max(0, Math.min(1, opacity));
                _yuitest_coverline("graphics-canvas", 607);
color = this._toRGBA(color, opacity);
            }
            else
            {
                _yuitest_coverline("graphics-canvas", 611);
color = TORGB(color);
            }
            _yuitest_coverline("graphics-canvas", 613);
offset = stop.offset || i/(len - 1);
            _yuitest_coverline("graphics-canvas", 614);
gradient.addColorStop(offset, color);
        }
        _yuitest_coverline("graphics-canvas", 616);
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
        _yuitest_coverfunc("graphics-canvas", "_getRadialGradient", 626);
_yuitest_coverline("graphics-canvas", 627);
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
        _yuitest_coverline("graphics-canvas", 648);
xc = x + w/2;
        _yuitest_coverline("graphics-canvas", 649);
yc = y + h/2;
        _yuitest_coverline("graphics-canvas", 650);
x1 = w * fx;
        _yuitest_coverline("graphics-canvas", 651);
y1 = h * fy;
        _yuitest_coverline("graphics-canvas", 652);
x2 = x + w/2;
        _yuitest_coverline("graphics-canvas", 653);
y2 = y + h/2;
        _yuitest_coverline("graphics-canvas", 654);
r2 = w * r;
        _yuitest_coverline("graphics-canvas", 655);
d = Math.sqrt( Math.pow(Math.abs(xc - x1), 2) + Math.pow(Math.abs(yc - y1), 2) );
        _yuitest_coverline("graphics-canvas", 656);
if(d >= r2)
        {
            _yuitest_coverline("graphics-canvas", 658);
ratio = d/r2;
            //hack. gradient won't show if it is exactly on the edge of the arc
            _yuitest_coverline("graphics-canvas", 660);
if(ratio === 1)
            {
                _yuitest_coverline("graphics-canvas", 662);
ratio = 1.01;
            }
            _yuitest_coverline("graphics-canvas", 664);
xn = (x1 - xc)/ratio;
            _yuitest_coverline("graphics-canvas", 665);
yn = (y1 - yc)/ratio;
            _yuitest_coverline("graphics-canvas", 666);
xn = xn > 0 ? Math.floor(xn) : Math.ceil(xn);
            _yuitest_coverline("graphics-canvas", 667);
yn = yn > 0 ? Math.floor(yn) : Math.ceil(yn);
            _yuitest_coverline("graphics-canvas", 668);
x1 = xc + xn;
            _yuitest_coverline("graphics-canvas", 669);
y1 = yc + yn;
        }
        
        //If the gradient radius is greater than the circle's, adjusting the radius stretches the gradient properly.
        //If the gradient radius is less than the circle's, adjusting the radius of the gradient will not work. 
        //Instead, adjust the color stops to reflect the smaller radius.
        _yuitest_coverline("graphics-canvas", 675);
if(r >= 0.5)
        {
            _yuitest_coverline("graphics-canvas", 677);
gradient = this._context.createRadialGradient(x1, y1, r, x2, y2, r * w);
            _yuitest_coverline("graphics-canvas", 678);
stopMultiplier = 1;
        }
        else
        {
            _yuitest_coverline("graphics-canvas", 682);
gradient = this._context.createRadialGradient(x1, y1, r, x2, y2, w/2);
            _yuitest_coverline("graphics-canvas", 683);
stopMultiplier = r * 2;
        }
        _yuitest_coverline("graphics-canvas", 685);
for(; i < len; ++i)
        {
            _yuitest_coverline("graphics-canvas", 687);
stop = stops[i];
            _yuitest_coverline("graphics-canvas", 688);
opacity = stop.opacity;
            _yuitest_coverline("graphics-canvas", 689);
color = stop.color;
            _yuitest_coverline("graphics-canvas", 690);
offset = stop.offset;
            _yuitest_coverline("graphics-canvas", 691);
if(isNumber(opacity))
            {
                _yuitest_coverline("graphics-canvas", 693);
opacity = Math.max(0, Math.min(1, opacity));
                _yuitest_coverline("graphics-canvas", 694);
color = this._toRGBA(color, opacity);
            }
            else
            {
                _yuitest_coverline("graphics-canvas", 698);
color = TORGB(color);
            }
            _yuitest_coverline("graphics-canvas", 700);
offset = stop.offset || i/(len - 1);
            _yuitest_coverline("graphics-canvas", 701);
offset *= stopMultiplier;
            _yuitest_coverline("graphics-canvas", 702);
if(offset <= 1)
            {
                _yuitest_coverline("graphics-canvas", 704);
gradient.addColorStop(offset, color);
            }
        }
        _yuitest_coverline("graphics-canvas", 707);
return gradient;
    },


    /**
     * Clears all values
     *
     * @method _initProps
     * @private
     */
    _initProps: function() {
        _yuitest_coverfunc("graphics-canvas", "_initProps", 717);
_yuitest_coverline("graphics-canvas", 718);
this._methods = [];
        _yuitest_coverline("graphics-canvas", 719);
this._lineToMethods = [];
        _yuitest_coverline("graphics-canvas", 720);
this._xcoords = [0];
		_yuitest_coverline("graphics-canvas", 721);
this._ycoords = [0];
		_yuitest_coverline("graphics-canvas", 722);
this._width = 0;
        _yuitest_coverline("graphics-canvas", 723);
this._height = 0;
        _yuitest_coverline("graphics-canvas", 724);
this._left = 0;
        _yuitest_coverline("graphics-canvas", 725);
this._top = 0;
        _yuitest_coverline("graphics-canvas", 726);
this._right = 0;
        _yuitest_coverline("graphics-canvas", 727);
this._bottom = 0;
        _yuitest_coverline("graphics-canvas", 728);
this._currentX = 0;
        _yuitest_coverline("graphics-canvas", 729);
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
        _yuitest_coverfunc("graphics-canvas", "_createGraphic", 748);
_yuitest_coverline("graphics-canvas", 749);
var graphic = Y.config.doc.createElement('canvas');
        _yuitest_coverline("graphics-canvas", 750);
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
        _yuitest_coverfunc("graphics-canvas", "getBezierData", 762);
_yuitest_coverline("graphics-canvas", 763);
var n = points.length,
            tmp = [],
            i,
            j;

        _yuitest_coverline("graphics-canvas", 768);
for (i = 0; i < n; ++i){
            _yuitest_coverline("graphics-canvas", 769);
tmp[i] = [points[i][0], points[i][1]]; // save input
        }
        
        _yuitest_coverline("graphics-canvas", 772);
for (j = 1; j < n; ++j) {
            _yuitest_coverline("graphics-canvas", 773);
for (i = 0; i < n - j; ++i) {
                _yuitest_coverline("graphics-canvas", 774);
tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];
                _yuitest_coverline("graphics-canvas", 775);
tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1]; 
            }
        }
        _yuitest_coverline("graphics-canvas", 778);
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
        _yuitest_coverfunc("graphics-canvas", "_setCurveBoundingBox", 790);
_yuitest_coverline("graphics-canvas", 792);
var i = 0,
            left = this._currentX,
            right = left,
            top = this._currentY,
            bottom = top,
            len = Math.round(Math.sqrt((w * w) + (h * h))),
            t = 1/len,
            wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0,
            xy;
        _yuitest_coverline("graphics-canvas", 801);
for(; i < len; ++i)
        {
            _yuitest_coverline("graphics-canvas", 803);
xy = this.getBezierData(pts, t * i);
            _yuitest_coverline("graphics-canvas", 804);
left = isNaN(left) ? xy[0] : Math.min(xy[0], left);
            _yuitest_coverline("graphics-canvas", 805);
right = isNaN(right) ? xy[0] : Math.max(xy[0], right);
            _yuitest_coverline("graphics-canvas", 806);
top = isNaN(top) ? xy[1] : Math.min(xy[1], top);
            _yuitest_coverline("graphics-canvas", 807);
bottom = isNaN(bottom) ? xy[1] : Math.max(xy[1], bottom);
        }
        _yuitest_coverline("graphics-canvas", 809);
left = Math.round(left * 10)/10;
        _yuitest_coverline("graphics-canvas", 810);
right = Math.round(right * 10)/10;
        _yuitest_coverline("graphics-canvas", 811);
top = Math.round(top * 10)/10;
        _yuitest_coverline("graphics-canvas", 812);
bottom = Math.round(bottom * 10)/10;
        _yuitest_coverline("graphics-canvas", 813);
this._trackSize(right + wt, bottom + wt);
        _yuitest_coverline("graphics-canvas", 814);
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
        _yuitest_coverfunc("graphics-canvas", "_trackSize", 825);
_yuitest_coverline("graphics-canvas", 826);
if (w > this._right) {
            _yuitest_coverline("graphics-canvas", 827);
this._right = w;
        }
        _yuitest_coverline("graphics-canvas", 829);
if(w < this._left)
        {
            _yuitest_coverline("graphics-canvas", 831);
this._left = w;    
        }
        _yuitest_coverline("graphics-canvas", 833);
if (h < this._top)
        {
            _yuitest_coverline("graphics-canvas", 835);
this._top = h;
        }
        _yuitest_coverline("graphics-canvas", 837);
if (h > this._bottom) 
        {
            _yuitest_coverline("graphics-canvas", 839);
this._bottom = h;
        }
        _yuitest_coverline("graphics-canvas", 841);
this._width = this._right - this._left;
        _yuitest_coverline("graphics-canvas", 842);
this._height = this._bottom - this._top;
    }
};
_yuitest_coverline("graphics-canvas", 845);
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
_yuitest_coverline("graphics-canvas", 857);
CanvasShape = function(cfg)
{
    _yuitest_coverfunc("graphics-canvas", "CanvasShape", 857);
_yuitest_coverline("graphics-canvas", 859);
this._transforms = [];
    _yuitest_coverline("graphics-canvas", 860);
this.matrix = new Y.Matrix();
    _yuitest_coverline("graphics-canvas", 861);
CanvasShape.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("graphics-canvas", 864);
CanvasShape.NAME = "canvasShape";

_yuitest_coverline("graphics-canvas", 866);
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
		_yuitest_coverfunc("graphics-canvas", "init", 874);
_yuitest_coverline("graphics-canvas", 876);
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
		_yuitest_coverfunc("graphics-canvas", "initializer", 885);
_yuitest_coverline("graphics-canvas", 887);
var host = this,
            graphic = cfg.graphic;
        _yuitest_coverline("graphics-canvas", 889);
host._initProps();
		_yuitest_coverline("graphics-canvas", 890);
host.createNode(); 
		_yuitest_coverline("graphics-canvas", 891);
host._xcoords = [0];
		_yuitest_coverline("graphics-canvas", 892);
host._ycoords = [0];
        _yuitest_coverline("graphics-canvas", 893);
if(graphic)
        {
            _yuitest_coverline("graphics-canvas", 895);
this._setGraphic(graphic);
        }
		_yuitest_coverline("graphics-canvas", 897);
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
        _yuitest_coverfunc("graphics-canvas", "_setGraphic", 908);
_yuitest_coverline("graphics-canvas", 910);
var graphic;
        _yuitest_coverline("graphics-canvas", 911);
if(render instanceof Y.CanvasGraphic)
        {
		    _yuitest_coverline("graphics-canvas", 913);
this._graphic = render;
        }
        else
        {
            _yuitest_coverline("graphics-canvas", 917);
render = Y.one(render);
            _yuitest_coverline("graphics-canvas", 918);
graphic = new Y.CanvasGraphic({
                render: render
            });
            _yuitest_coverline("graphics-canvas", 921);
graphic._appendShape(this);
            _yuitest_coverline("graphics-canvas", 922);
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
		_yuitest_coverfunc("graphics-canvas", "addClass", 932);
_yuitest_coverline("graphics-canvas", 934);
var node = Y.one(this.get("node"));
		_yuitest_coverline("graphics-canvas", 935);
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
		_yuitest_coverfunc("graphics-canvas", "removeClass", 944);
_yuitest_coverline("graphics-canvas", 946);
var node = Y.one(this.get("node"));
		_yuitest_coverline("graphics-canvas", 947);
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
		_yuitest_coverfunc("graphics-canvas", "getXY", 956);
_yuitest_coverline("graphics-canvas", 958);
var graphic = this.get("graphic"),
			parentXY = graphic.getXY(),
			x = this.get("x"),
			y = this.get("y");
		_yuitest_coverline("graphics-canvas", 962);
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
		_yuitest_coverfunc("graphics-canvas", "setXY", 971);
_yuitest_coverline("graphics-canvas", 973);
var graphic = this.get("graphic"),
			parentXY = graphic.getXY(),
			x = xy[0] - parentXY[0],
			y = xy[1] - parentXY[1];
		_yuitest_coverline("graphics-canvas", 977);
this._set("x", x);
		_yuitest_coverline("graphics-canvas", 978);
this._set("y", y);
		_yuitest_coverline("graphics-canvas", 979);
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
		_yuitest_coverfunc("graphics-canvas", "contains", 989);
_yuitest_coverline("graphics-canvas", 991);
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
		_yuitest_coverfunc("graphics-canvas", "test", 1001);
_yuitest_coverline("graphics-canvas", 1003);
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
		_yuitest_coverfunc("graphics-canvas", "compareTo", 1014);
_yuitest_coverline("graphics-canvas", 1015);
var node = this.node;
		_yuitest_coverline("graphics-canvas", 1016);
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
		_yuitest_coverfunc("graphics-canvas", "_getDefaultFill", 1026);
_yuitest_coverline("graphics-canvas", 1027);
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
		_yuitest_coverfunc("graphics-canvas", "_getDefaultStroke", 1044);
_yuitest_coverline("graphics-canvas", 1046);
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
		_yuitest_coverfunc("graphics-canvas", "createNode", 1097);
_yuitest_coverline("graphics-canvas", 1099);
var node = Y.config.doc.createElement('canvas'),
			id = this.get("id");
		_yuitest_coverline("graphics-canvas", 1101);
this._context = node.getContext('2d');
		_yuitest_coverline("graphics-canvas", 1102);
node.setAttribute("overflow", "visible");
        _yuitest_coverline("graphics-canvas", 1103);
node.style.overflow = "visible";
        _yuitest_coverline("graphics-canvas", 1104);
if(!this.get("visible"))
        {
            _yuitest_coverline("graphics-canvas", 1106);
node.style.visibility = "hidden";
        }
		_yuitest_coverline("graphics-canvas", 1108);
node.setAttribute("id", id);
		_yuitest_coverline("graphics-canvas", 1109);
id = "#" + id;
		_yuitest_coverline("graphics-canvas", 1110);
this.node = node;
		_yuitest_coverline("graphics-canvas", 1111);
this.addClass(_getClassName(SHAPE) + " " + _getClassName(this.name)); 
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
		_yuitest_coverfunc("graphics-canvas", "on", 1123);
_yuitest_coverline("graphics-canvas", 1125);
if(Y.Node.DOM_EVENTS[type])
		{
			_yuitest_coverline("graphics-canvas", 1127);
return Y.one("#" +  this.get("id")).on(type, fn);
		}
		_yuitest_coverline("graphics-canvas", 1129);
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
		_yuitest_coverfunc("graphics-canvas", "_setStrokeProps", 1139);
_yuitest_coverline("graphics-canvas", 1141);
var color,
			weight,
			opacity,
			linejoin,
			linecap,
			dashstyle;
	    _yuitest_coverline("graphics-canvas", 1147);
if(stroke)
        {
            _yuitest_coverline("graphics-canvas", 1149);
color = stroke.color;
            _yuitest_coverline("graphics-canvas", 1150);
weight = PARSE_FLOAT(stroke.weight);
            _yuitest_coverline("graphics-canvas", 1151);
opacity = PARSE_FLOAT(stroke.opacity);
            _yuitest_coverline("graphics-canvas", 1152);
linejoin = stroke.linejoin || "round";
            _yuitest_coverline("graphics-canvas", 1153);
linecap = stroke.linecap || "butt";
            _yuitest_coverline("graphics-canvas", 1154);
dashstyle = stroke.dashstyle;
            _yuitest_coverline("graphics-canvas", 1155);
this._miterlimit = null;
            _yuitest_coverline("graphics-canvas", 1156);
this._dashstyle = (dashstyle && Y.Lang.isArray(dashstyle) && dashstyle.length > 1) ? dashstyle : null;
            _yuitest_coverline("graphics-canvas", 1157);
this._strokeWeight = weight;

            _yuitest_coverline("graphics-canvas", 1159);
if (IS_NUMBER(weight) && weight > 0) 
            {
                _yuitest_coverline("graphics-canvas", 1161);
this._stroke = 1;
            } 
            else 
            {
                _yuitest_coverline("graphics-canvas", 1165);
this._stroke = 0;
            }
            _yuitest_coverline("graphics-canvas", 1167);
if (IS_NUMBER(opacity)) {
                _yuitest_coverline("graphics-canvas", 1168);
this._strokeStyle = this._toRGBA(color, opacity);
            }
            else
            {
                _yuitest_coverline("graphics-canvas", 1172);
this._strokeStyle = color;
            }
            _yuitest_coverline("graphics-canvas", 1174);
this._linecap = linecap;
            _yuitest_coverline("graphics-canvas", 1175);
if(linejoin == "round" || linejoin == "bevel")
            {
                _yuitest_coverline("graphics-canvas", 1177);
this._linejoin = linejoin;
            }
            else
            {
                _yuitest_coverline("graphics-canvas", 1181);
linejoin = parseInt(linejoin, 10);
                _yuitest_coverline("graphics-canvas", 1182);
if(IS_NUMBER(linejoin))
                {
                    _yuitest_coverline("graphics-canvas", 1184);
this._miterlimit =  Math.max(linejoin, 1);
                    _yuitest_coverline("graphics-canvas", 1185);
this._linejoin = "miter";
                }
            }
        }
        else
        {
            _yuitest_coverline("graphics-canvas", 1191);
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
		_yuitest_coverfunc("graphics-canvas", "set", 1204);
_yuitest_coverline("graphics-canvas", 1206);
var host = this,
			val = arguments[0];
		_yuitest_coverline("graphics-canvas", 1208);
AttributeLite.prototype.set.apply(host, arguments);
		_yuitest_coverline("graphics-canvas", 1209);
if(host.initialized)
		{
			_yuitest_coverline("graphics-canvas", 1211);
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
		_yuitest_coverfunc("graphics-canvas", "_setFillProps", 1222);
_yuitest_coverline("graphics-canvas", 1224);
var isNumber = IS_NUMBER,
			color,
			opacity,
			type;
        _yuitest_coverline("graphics-canvas", 1228);
if(fill)
        {
            _yuitest_coverline("graphics-canvas", 1230);
color = fill.color;
            _yuitest_coverline("graphics-canvas", 1231);
type = fill.type;
            _yuitest_coverline("graphics-canvas", 1232);
if(type == "linear" || type == "radial")
            {
                _yuitest_coverline("graphics-canvas", 1234);
this._fillType = type;
            }
            else {_yuitest_coverline("graphics-canvas", 1236);
if(color)
            {
                _yuitest_coverline("graphics-canvas", 1238);
opacity = fill.opacity;
                _yuitest_coverline("graphics-canvas", 1239);
if (isNumber(opacity)) 
                {
                    _yuitest_coverline("graphics-canvas", 1241);
opacity = Math.max(0, Math.min(1, opacity));
                    _yuitest_coverline("graphics-canvas", 1242);
color = this._toRGBA(color, opacity);
                } 
                else 
                {
                    _yuitest_coverline("graphics-canvas", 1246);
color = TORGB(color);
                }

                _yuitest_coverline("graphics-canvas", 1249);
this._fillColor = color;
                _yuitest_coverline("graphics-canvas", 1250);
this._fillType = 'solid';
            }
            else
            {
                _yuitest_coverline("graphics-canvas", 1254);
this._fillColor = null;
            }}
        }
		else
		{
            _yuitest_coverline("graphics-canvas", 1259);
this._fillType = null;
			_yuitest_coverline("graphics-canvas", 1260);
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
		_yuitest_coverfunc("graphics-canvas", "translate", 1271);
_yuitest_coverline("graphics-canvas", 1273);
this._translateX += x;
		_yuitest_coverline("graphics-canvas", 1274);
this._translateY += y;
		_yuitest_coverline("graphics-canvas", 1275);
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
        _yuitest_coverfunc("graphics-canvas", "translateX", 1285);
_yuitest_coverline("graphics-canvas", 1287);
this._translateX += x;
        _yuitest_coverline("graphics-canvas", 1288);
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
        _yuitest_coverfunc("graphics-canvas", "translateY", 1298);
_yuitest_coverline("graphics-canvas", 1300);
this._translateY += y;
        _yuitest_coverline("graphics-canvas", 1301);
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
        _yuitest_coverfunc("graphics-canvas", "skew", 1311);
_yuitest_coverline("graphics-canvas", 1313);
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
		_yuitest_coverfunc("graphics-canvas", "skewX", 1322);
_yuitest_coverline("graphics-canvas", 1324);
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
		_yuitest_coverfunc("graphics-canvas", "skewY", 1333);
_yuitest_coverline("graphics-canvas", 1335);
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
		_yuitest_coverfunc("graphics-canvas", "rotate", 1344);
_yuitest_coverline("graphics-canvas", 1346);
this._rotation = deg;
		_yuitest_coverline("graphics-canvas", 1347);
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
		_yuitest_coverfunc("graphics-canvas", "scale", 1356);
_yuitest_coverline("graphics-canvas", 1358);
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
        _yuitest_coverfunc("graphics-canvas", "_addTransform", 1387);
_yuitest_coverline("graphics-canvas", 1389);
args = Y.Array(args);
        _yuitest_coverline("graphics-canvas", 1390);
this._transform = Y_LANG.trim(this._transform + " " + type + "(" + args.join(", ") + ")");
        _yuitest_coverline("graphics-canvas", 1391);
args.unshift(type);
        _yuitest_coverline("graphics-canvas", 1392);
this._transforms.push(args);
        _yuitest_coverline("graphics-canvas", 1393);
if(this.initialized)
        {
            _yuitest_coverline("graphics-canvas", 1395);
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
		_yuitest_coverfunc("graphics-canvas", "_updateTransform", 1405);
_yuitest_coverline("graphics-canvas", 1407);
var node = this.node,
			key,
			transform,
			transformOrigin = this.get("transformOrigin"),
            matrix = this.matrix,
            i = 0,
            len = this._transforms.length;
        
        _yuitest_coverline("graphics-canvas", 1415);
if(this._transforms && this._transforms.length > 0)
        {
            _yuitest_coverline("graphics-canvas", 1417);
for(; i < len; ++i)
            {
                _yuitest_coverline("graphics-canvas", 1419);
key = this._transforms[i].shift();
                _yuitest_coverline("graphics-canvas", 1420);
if(key)
                {
                    _yuitest_coverline("graphics-canvas", 1422);
matrix[key].apply(matrix, this._transforms[i]); 
                }
            }
            _yuitest_coverline("graphics-canvas", 1425);
transform = matrix.toCSSText();
        }
        
        _yuitest_coverline("graphics-canvas", 1428);
this._graphic.addToRedrawQueue(this);    
		_yuitest_coverline("graphics-canvas", 1429);
transformOrigin = (100 * transformOrigin[0]) + "% " + (100 * transformOrigin[1]) + "%";
		_yuitest_coverline("graphics-canvas", 1430);
node.style.MozTransformOrigin = transformOrigin; 
		_yuitest_coverline("graphics-canvas", 1431);
node.style.webkitTransformOrigin = transformOrigin;
		_yuitest_coverline("graphics-canvas", 1432);
node.style.msTransformOrigin = transformOrigin;
		_yuitest_coverline("graphics-canvas", 1433);
node.style.OTransformOrigin = transformOrigin;
        _yuitest_coverline("graphics-canvas", 1434);
if(transform)
		{
            _yuitest_coverline("graphics-canvas", 1436);
node.style.MozTransform = transform;
            _yuitest_coverline("graphics-canvas", 1437);
node.style.webkitTransform = transform;
            _yuitest_coverline("graphics-canvas", 1438);
node.style.msTransform = transform;
            _yuitest_coverline("graphics-canvas", 1439);
node.style.OTransform = transform;
		}
        _yuitest_coverline("graphics-canvas", 1441);
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
		_yuitest_coverfunc("graphics-canvas", "_updateHandler", 1450);
_yuitest_coverline("graphics-canvas", 1452);
this._draw();
		_yuitest_coverline("graphics-canvas", 1453);
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
        _yuitest_coverfunc("graphics-canvas", "_draw", 1462);
_yuitest_coverline("graphics-canvas", 1464);
var node = this.node;
        _yuitest_coverline("graphics-canvas", 1465);
this.clear();
		_yuitest_coverline("graphics-canvas", 1466);
this._closePath();
		_yuitest_coverline("graphics-canvas", 1467);
node.style.left = this.get("x") + "px";
		_yuitest_coverline("graphics-canvas", 1468);
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
		_yuitest_coverfunc("graphics-canvas", "_closePath", 1477);
_yuitest_coverline("graphics-canvas", 1479);
if(!this._methods)
		{
			_yuitest_coverline("graphics-canvas", 1481);
return;
		}
		_yuitest_coverline("graphics-canvas", 1483);
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
		_yuitest_coverline("graphics-canvas", 1495);
this._context.clearRect(0, 0, node.width, node.height);
	   _yuitest_coverline("graphics-canvas", 1496);
if(this._methods)
	   {
			_yuitest_coverline("graphics-canvas", 1498);
len = cachedMethods.length;
			_yuitest_coverline("graphics-canvas", 1499);
if(!len || len < 1)
			{
				_yuitest_coverline("graphics-canvas", 1501);
return;
			}
			_yuitest_coverline("graphics-canvas", 1503);
for(; i < len; ++i)
			{
				_yuitest_coverline("graphics-canvas", 1505);
methods[i] = cachedMethods[i].concat();
				_yuitest_coverline("graphics-canvas", 1506);
args = methods[i];
                _yuitest_coverline("graphics-canvas", 1507);
argsLen = args[0] == "quadraticCurveTo" ? args.length : 3;
				_yuitest_coverline("graphics-canvas", 1508);
for(j = 1; j < argsLen; ++j)
				{
					_yuitest_coverline("graphics-canvas", 1510);
if(j % 2 === 0)
					{
						_yuitest_coverline("graphics-canvas", 1512);
args[j] = args[j] - this._top;
					}
					else
					{
						_yuitest_coverline("graphics-canvas", 1516);
args[j] = args[j] - this._left;
					}
				}
			}
            _yuitest_coverline("graphics-canvas", 1520);
node.setAttribute("width", Math.min(w, 2000));
            _yuitest_coverline("graphics-canvas", 1521);
node.setAttribute("height", Math.min(2000, h));
            _yuitest_coverline("graphics-canvas", 1522);
context.beginPath();
			_yuitest_coverline("graphics-canvas", 1523);
for(i = 0; i < len; ++i)
			{
				_yuitest_coverline("graphics-canvas", 1525);
args = methods[i].concat();
				_yuitest_coverline("graphics-canvas", 1526);
if(args && args.length > 0)
				{
					_yuitest_coverline("graphics-canvas", 1528);
method = args.shift();
					_yuitest_coverline("graphics-canvas", 1529);
if(method)
					{
                        _yuitest_coverline("graphics-canvas", 1531);
if(method == "closePath")
                        {
                            _yuitest_coverline("graphics-canvas", 1533);
this._strokeAndFill(context);
                        }
						_yuitest_coverline("graphics-canvas", 1535);
if(method && method == "lineTo" && this._dashstyle)
						{
							_yuitest_coverline("graphics-canvas", 1537);
args.unshift(this._xcoords[i] - this._left, this._ycoords[i] - this._top);
							_yuitest_coverline("graphics-canvas", 1538);
this._drawDashedLine.apply(this, args);
						}
						else
						{
                            _yuitest_coverline("graphics-canvas", 1542);
context[method].apply(context, args); 
						}
					}
				}
			}

            _yuitest_coverline("graphics-canvas", 1548);
this._strokeAndFill(context);
			_yuitest_coverline("graphics-canvas", 1549);
this._drawingComplete = true;
			_yuitest_coverline("graphics-canvas", 1550);
this._clearAndUpdateCoords();
			_yuitest_coverline("graphics-canvas", 1551);
this._updateNodePosition();
			_yuitest_coverline("graphics-canvas", 1552);
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
        _yuitest_coverfunc("graphics-canvas", "_strokeAndFill", 1563);
_yuitest_coverline("graphics-canvas", 1565);
if (this._fillType) 
        {
            _yuitest_coverline("graphics-canvas", 1567);
if(this._fillType == "linear")
            {
                _yuitest_coverline("graphics-canvas", 1569);
context.fillStyle = this._getLinearGradient();
            }
            else {_yuitest_coverline("graphics-canvas", 1571);
if(this._fillType == "radial")
            {
                _yuitest_coverline("graphics-canvas", 1573);
context.fillStyle = this._getRadialGradient();
            }
            else
            {
                _yuitest_coverline("graphics-canvas", 1577);
context.fillStyle = this._fillColor;
            }}
            _yuitest_coverline("graphics-canvas", 1579);
context.closePath();
            _yuitest_coverline("graphics-canvas", 1580);
context.fill();
        }

        _yuitest_coverline("graphics-canvas", 1583);
if (this._stroke) {
            _yuitest_coverline("graphics-canvas", 1584);
if(this._strokeWeight)
            {
                _yuitest_coverline("graphics-canvas", 1586);
context.lineWidth = this._strokeWeight;
            }
            _yuitest_coverline("graphics-canvas", 1588);
context.lineCap = this._linecap;
            _yuitest_coverline("graphics-canvas", 1589);
context.lineJoin = this._linejoin;
            _yuitest_coverline("graphics-canvas", 1590);
if(this._miterlimit)
            {
                _yuitest_coverline("graphics-canvas", 1592);
context.miterLimit = this._miterlimit;
            }
            _yuitest_coverline("graphics-canvas", 1594);
context.strokeStyle = this._strokeStyle;
            _yuitest_coverline("graphics-canvas", 1595);
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
		_yuitest_coverfunc("graphics-canvas", "_drawDashedLine", 1609);
_yuitest_coverline("graphics-canvas", 1611);
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
		_yuitest_coverline("graphics-canvas", 1623);
xDelta = Math.cos(radians) * segmentLength;
		_yuitest_coverline("graphics-canvas", 1624);
yDelta = Math.sin(radians) * segmentLength;
		
		_yuitest_coverline("graphics-canvas", 1626);
for(i = 0; i < segmentCount; ++i)
		{
			_yuitest_coverline("graphics-canvas", 1628);
context.moveTo(xCurrent, yCurrent);
			_yuitest_coverline("graphics-canvas", 1629);
context.lineTo(xCurrent + Math.cos(radians) * dashsize, yCurrent + Math.sin(radians) * dashsize);
			_yuitest_coverline("graphics-canvas", 1630);
xCurrent += xDelta;
			_yuitest_coverline("graphics-canvas", 1631);
yCurrent += yDelta;
		}
		
		_yuitest_coverline("graphics-canvas", 1634);
context.moveTo(xCurrent, yCurrent);
		_yuitest_coverline("graphics-canvas", 1635);
delta = Math.sqrt((xEnd - xCurrent) * (xEnd - xCurrent) + (yEnd - yCurrent) * (yEnd - yCurrent));
		
		_yuitest_coverline("graphics-canvas", 1637);
if(delta > dashsize)
		{
			_yuitest_coverline("graphics-canvas", 1639);
context.lineTo(xCurrent + Math.cos(radians) * dashsize, yCurrent + Math.sin(radians) * dashsize);
		}
		else {_yuitest_coverline("graphics-canvas", 1641);
if(delta > 0)
		{
			_yuitest_coverline("graphics-canvas", 1643);
context.lineTo(xCurrent + Math.cos(radians) * delta, yCurrent + Math.sin(radians) * delta);
		}}
		
		_yuitest_coverline("graphics-canvas", 1646);
context.moveTo(xEnd, yEnd);
	},

	//This should move to CanvasDrawing class. 
    //Currently docmented in CanvasDrawing class.
    clear: function() {
		_yuitest_coverfunc("graphics-canvas", "clear", 1651);
_yuitest_coverline("graphics-canvas", 1652);
this._initProps();
        _yuitest_coverline("graphics-canvas", 1653);
if(this.node) 
        {
            _yuitest_coverline("graphics-canvas", 1655);
this._context.clearRect(0, 0, this.node.width, this.node.height);
        }
        _yuitest_coverline("graphics-canvas", 1657);
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
		_yuitest_coverfunc("graphics-canvas", "getBounds", 1669);
_yuitest_coverline("graphics-canvas", 1671);
var type = this._type,
		    stroke = this.get("stroke"),
			w = this.get("width"),
			h = this.get("height"),
			x = this.get("x"),
			y = this.get("y"),
            wt = 0;
        _yuitest_coverline("graphics-canvas", 1678);
if(type == "path")
        {
            _yuitest_coverline("graphics-canvas", 1680);
x = x + this._left;
            _yuitest_coverline("graphics-canvas", 1681);
y = y + this._top;
            _yuitest_coverline("graphics-canvas", 1682);
w = this._right - this._left;
            _yuitest_coverline("graphics-canvas", 1683);
h = this._bottom - this._top;
        }
		_yuitest_coverline("graphics-canvas", 1685);
if(stroke && stroke.weight)
		{
			_yuitest_coverline("graphics-canvas", 1687);
wt = stroke.weight;
		}
        _yuitest_coverline("graphics-canvas", 1689);
w = (x + w + wt) - (x - wt); 
        _yuitest_coverline("graphics-canvas", 1690);
h = (y + h + wt) - (y - wt);
        _yuitest_coverline("graphics-canvas", 1691);
x -= wt;
        _yuitest_coverline("graphics-canvas", 1692);
y -= wt;
        _yuitest_coverline("graphics-canvas", 1693);
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
        _yuitest_coverfunc("graphics-canvas", "_getContentRect", 1706);
_yuitest_coverline("graphics-canvas", 1708);
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
        _yuitest_coverline("graphics-canvas", 1718);
if(this._type == "path")
        {
            _yuitest_coverline("graphics-canvas", 1720);
transformX = transformX + x;
            _yuitest_coverline("graphics-canvas", 1721);
transformY = transformY + y;
        }
        _yuitest_coverline("graphics-canvas", 1723);
transformX = !isNaN(transformX) ? transformX : 0;
        _yuitest_coverline("graphics-canvas", 1724);
transformY = !isNaN(transformY) ? transformY : 0;
        _yuitest_coverline("graphics-canvas", 1725);
matrix.translate(transformX, transformY);
        _yuitest_coverline("graphics-canvas", 1726);
for(; i < len; i = i + 1)
        {
            _yuitest_coverline("graphics-canvas", 1728);
transform = transforms[i];
            _yuitest_coverline("graphics-canvas", 1729);
key = transform.shift();
            _yuitest_coverline("graphics-canvas", 1730);
if(key)
            {
                _yuitest_coverline("graphics-canvas", 1732);
matrix[key].apply(matrix, transform); 
            }
        }
        _yuitest_coverline("graphics-canvas", 1735);
matrix.translate(-transformX, -transformY);
        _yuitest_coverline("graphics-canvas", 1736);
contentRect = matrix.getContentRect(w, h, x, y);
        _yuitest_coverline("graphics-canvas", 1737);
return contentRect;
    },
    
    /**
     * Destroys the shape instance.
     *
     * @method destroy
     */
    destroy: function()
    {
        _yuitest_coverfunc("graphics-canvas", "destroy", 1745);
_yuitest_coverline("graphics-canvas", 1747);
var graphic = this.get("graphic");
        _yuitest_coverline("graphics-canvas", 1748);
if(graphic)
        {
            _yuitest_coverline("graphics-canvas", 1750);
graphic.removeShape(this);
        }
        else
        {
            _yuitest_coverline("graphics-canvas", 1754);
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
        _yuitest_coverfunc("graphics-canvas", "_destroy", 1764);
_yuitest_coverline("graphics-canvas", 1766);
if(this.node)
        {
            _yuitest_coverline("graphics-canvas", 1768);
Y.one(this.node).remove(true);
            _yuitest_coverline("graphics-canvas", 1769);
this._context = null;
            _yuitest_coverline("graphics-canvas", 1770);
this.node = null;
        }
    }
}, Y.CanvasDrawing.prototype));

_yuitest_coverline("graphics-canvas", 1775);
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
			_yuitest_coverfunc("graphics-canvas", "valueFn", 1784);
_yuitest_coverline("graphics-canvas", 1786);
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
            _yuitest_coverfunc("graphics-canvas", "setter", 1820);
_yuitest_coverline("graphics-canvas", 1822);
this.matrix.init();	
		    _yuitest_coverline("graphics-canvas", 1823);
this._transforms = this.matrix.getTransformArray(val);
            _yuitest_coverline("graphics-canvas", 1824);
this._transform = val;
            _yuitest_coverline("graphics-canvas", 1825);
return val;
		},

        getter: function()
        {
            _yuitest_coverfunc("graphics-canvas", "getter", 1828);
_yuitest_coverline("graphics-canvas", 1830);
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
			_yuitest_coverfunc("graphics-canvas", "getter", 1844);
_yuitest_coverline("graphics-canvas", 1846);
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
			_yuitest_coverfunc("graphics-canvas", "valueFn", 1857);
_yuitest_coverline("graphics-canvas", 1859);
return Y.guid();
		},

		setter: function(val)
		{
			_yuitest_coverfunc("graphics-canvas", "setter", 1862);
_yuitest_coverline("graphics-canvas", 1864);
var node = this.node;
			_yuitest_coverline("graphics-canvas", 1865);
if(node)
			{
				_yuitest_coverline("graphics-canvas", 1867);
node.setAttribute("id", val);
			}
			_yuitest_coverline("graphics-canvas", 1869);
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
			_yuitest_coverfunc("graphics-canvas", "setter", 1922);
_yuitest_coverline("graphics-canvas", 1923);
var node = this.get("node"),
                visibility = val ? "visible" : "hidden";
			_yuitest_coverline("graphics-canvas", 1925);
if(node)
            {
                _yuitest_coverline("graphics-canvas", 1927);
node.style.visibility = visibility;
            }
			_yuitest_coverline("graphics-canvas", 1929);
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
			_yuitest_coverfunc("graphics-canvas", "setter", 1979);
_yuitest_coverline("graphics-canvas", 1981);
var fill,
				tmpl = this.get("fill") || this._getDefaultFill();
			_yuitest_coverline("graphics-canvas", 1983);
fill = (val) ? Y.merge(tmpl, val) : null;
			_yuitest_coverline("graphics-canvas", 1984);
if(fill && fill.color)
			{
				_yuitest_coverline("graphics-canvas", 1986);
if(fill.color === undefined || fill.color == "none")
				{
					_yuitest_coverline("graphics-canvas", 1988);
fill.color = null;
				}
			}
			_yuitest_coverline("graphics-canvas", 1991);
this._setFillProps(fill);
			_yuitest_coverline("graphics-canvas", 1992);
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
			_yuitest_coverfunc("graphics-canvas", "setter", 2027);
_yuitest_coverline("graphics-canvas", 2029);
var tmpl = this.get("stroke") || this._getDefaultStroke(),
                wt;
            _yuitest_coverline("graphics-canvas", 2031);
if(val && val.hasOwnProperty("weight"))
            {
                _yuitest_coverline("graphics-canvas", 2033);
wt = parseInt(val.weight, 10);
                _yuitest_coverline("graphics-canvas", 2034);
if(!isNaN(wt))
                {
                    _yuitest_coverline("graphics-canvas", 2036);
val.weight = wt;
                }
            }
			_yuitest_coverline("graphics-canvas", 2039);
val = (val) ? Y.merge(tmpl, val) : null;
			_yuitest_coverline("graphics-canvas", 2040);
this._setStrokeProps(val);
			_yuitest_coverline("graphics-canvas", 2041);
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
	 * Reference to the container Graphic.
	 *
	 * @config graphic
	 * @type Graphic
	 */
	graphic: {
		readOnly: true,

		getter: function()
		{
			_yuitest_coverfunc("graphics-canvas", "getter", 2069);
_yuitest_coverline("graphics-canvas", 2071);
return this._graphic;
		}
    }
};
_yuitest_coverline("graphics-canvas", 2075);
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
_yuitest_coverline("graphics-canvas", 2087);
CanvasPath = function(cfg)
{
	_yuitest_coverfunc("graphics-canvas", "CanvasPath", 2087);
_yuitest_coverline("graphics-canvas", 2089);
CanvasPath.superclass.constructor.apply(this, arguments);
};
_yuitest_coverline("graphics-canvas", 2091);
CanvasPath.NAME = "canvasPath";
_yuitest_coverline("graphics-canvas", 2092);
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
        _yuitest_coverfunc("graphics-canvas", "_draw", 2108);
_yuitest_coverline("graphics-canvas", 2110);
this._closePath();
        _yuitest_coverline("graphics-canvas", 2111);
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
		_yuitest_coverfunc("graphics-canvas", "createNode", 2121);
_yuitest_coverline("graphics-canvas", 2123);
var node = Y.config.doc.createElement('canvas'),
			id = this.get("id");
		_yuitest_coverline("graphics-canvas", 2125);
this._context = node.getContext('2d');
		_yuitest_coverline("graphics-canvas", 2126);
node.setAttribute("overflow", "visible");
        _yuitest_coverline("graphics-canvas", 2127);
node.setAttribute("pointer-events", "none");
        _yuitest_coverline("graphics-canvas", 2128);
node.style.pointerEvents = "none";
        _yuitest_coverline("graphics-canvas", 2129);
node.style.overflow = "visible";
		_yuitest_coverline("graphics-canvas", 2130);
node.setAttribute("id", id);
		_yuitest_coverline("graphics-canvas", 2131);
id = "#" + id;
		_yuitest_coverline("graphics-canvas", 2132);
this.node = node;
		_yuitest_coverline("graphics-canvas", 2133);
this.addClass(_getClassName(SHAPE) + " " + _getClassName(this.name)); 
	},

    /**
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function()
    {
        _yuitest_coverfunc("graphics-canvas", "end", 2141);
_yuitest_coverline("graphics-canvas", 2143);
this._draw();
    }
});

_yuitest_coverline("graphics-canvas", 2147);
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
			_yuitest_coverfunc("graphics-canvas", "getter", 2155);
_yuitest_coverline("graphics-canvas", 2157);
var offset = this._stroke && this._strokeWeight ? (this._strokeWeight * 2) : 0;
			_yuitest_coverline("graphics-canvas", 2158);
return this._width - offset;
		},

		setter: function(val)
		{
			_yuitest_coverfunc("graphics-canvas", "setter", 2161);
_yuitest_coverline("graphics-canvas", 2163);
this._width = val;
			_yuitest_coverline("graphics-canvas", 2164);
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
			_yuitest_coverfunc("graphics-canvas", "getter", 2175);
_yuitest_coverline("graphics-canvas", 2177);
var offset = this._stroke && this._strokeWeight ? (this._strokeWeight * 2) : 0;
            _yuitest_coverline("graphics-canvas", 2178);
return this._height - offset;
		},

		setter: function(val)
		{
			_yuitest_coverfunc("graphics-canvas", "setter", 2181);
_yuitest_coverline("graphics-canvas", 2183);
this._height = val;
			_yuitest_coverline("graphics-canvas", 2184);
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
			_yuitest_coverfunc("graphics-canvas", "getter", 2198);
_yuitest_coverline("graphics-canvas", 2200);
return this._path;
		}
	}
});
_yuitest_coverline("graphics-canvas", 2204);
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
_yuitest_coverline("graphics-canvas", 2216);
CanvasRect = function()
{
	_yuitest_coverfunc("graphics-canvas", "CanvasRect", 2216);
_yuitest_coverline("graphics-canvas", 2218);
CanvasRect.superclass.constructor.apply(this, arguments);
};
_yuitest_coverline("graphics-canvas", 2220);
CanvasRect.NAME = "canvasRect";
_yuitest_coverline("graphics-canvas", 2221);
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
		_yuitest_coverfunc("graphics-canvas", "_draw", 2237);
_yuitest_coverline("graphics-canvas", 2239);
var w = this.get("width"),
			h = this.get("height");
		_yuitest_coverline("graphics-canvas", 2241);
this.clear();
        _yuitest_coverline("graphics-canvas", 2242);
this.drawRect(0, 0, w, h);
		_yuitest_coverline("graphics-canvas", 2243);
this._closePath();
	}
});
_yuitest_coverline("graphics-canvas", 2246);
CanvasRect.ATTRS = Y.CanvasShape.ATTRS;
_yuitest_coverline("graphics-canvas", 2247);
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
_yuitest_coverline("graphics-canvas", 2259);
CanvasEllipse = function(cfg)
{
	_yuitest_coverfunc("graphics-canvas", "CanvasEllipse", 2259);
_yuitest_coverline("graphics-canvas", 2261);
CanvasEllipse.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("graphics-canvas", 2264);
CanvasEllipse.NAME = "canvasEllipse";

_yuitest_coverline("graphics-canvas", 2266);
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
		_yuitest_coverfunc("graphics-canvas", "_draw", 2282);
_yuitest_coverline("graphics-canvas", 2284);
var w = this.get("width"),
			h = this.get("height");
		_yuitest_coverline("graphics-canvas", 2286);
this.clear();
        _yuitest_coverline("graphics-canvas", 2287);
this.drawEllipse(0, 0, w, h);
		_yuitest_coverline("graphics-canvas", 2288);
this._closePath();
	}
});
_yuitest_coverline("graphics-canvas", 2291);
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
			_yuitest_coverfunc("graphics-canvas", "setter", 2299);
_yuitest_coverline("graphics-canvas", 2301);
this.set("width", val * 2);
		},

		getter: function()
		{
			_yuitest_coverfunc("graphics-canvas", "getter", 2304);
_yuitest_coverline("graphics-canvas", 2306);
var val = this.get("width");
			_yuitest_coverline("graphics-canvas", 2307);
if(val) 
			{
				_yuitest_coverline("graphics-canvas", 2309);
val *= 0.5;
			}
			_yuitest_coverline("graphics-canvas", 2311);
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
			_yuitest_coverfunc("graphics-canvas", "setter", 2323);
_yuitest_coverline("graphics-canvas", 2325);
this.set("height", val * 2);
		},

		getter: function()
		{
			_yuitest_coverfunc("graphics-canvas", "getter", 2328);
_yuitest_coverline("graphics-canvas", 2330);
var val = this.get("height");
			_yuitest_coverline("graphics-canvas", 2331);
if(val) 
			{
				_yuitest_coverline("graphics-canvas", 2333);
val *= 0.5;
			}
			_yuitest_coverline("graphics-canvas", 2335);
return val;
		}
	}
});
_yuitest_coverline("graphics-canvas", 2339);
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
_yuitest_coverline("graphics-canvas", 2351);
CanvasCircle = function(cfg)
{
	_yuitest_coverfunc("graphics-canvas", "CanvasCircle", 2351);
_yuitest_coverline("graphics-canvas", 2353);
CanvasCircle.superclass.constructor.apply(this, arguments);
};
    
_yuitest_coverline("graphics-canvas", 2356);
CanvasCircle.NAME = "canvasCircle";

_yuitest_coverline("graphics-canvas", 2358);
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
		_yuitest_coverfunc("graphics-canvas", "_draw", 2374);
_yuitest_coverline("graphics-canvas", 2376);
var radius = this.get("radius");
		_yuitest_coverline("graphics-canvas", 2377);
if(radius)
		{
            _yuitest_coverline("graphics-canvas", 2379);
this.clear();
            _yuitest_coverline("graphics-canvas", 2380);
this.drawCircle(0, 0, radius);
			_yuitest_coverline("graphics-canvas", 2381);
this._closePath();
		}
	}
});

_yuitest_coverline("graphics-canvas", 2386);
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
            _yuitest_coverfunc("graphics-canvas", "setter", 2394);
_yuitest_coverline("graphics-canvas", 2396);
this.set("radius", val/2);
            _yuitest_coverline("graphics-canvas", 2397);
return val;
        },

		getter: function()
		{
			_yuitest_coverfunc("graphics-canvas", "getter", 2400);
_yuitest_coverline("graphics-canvas", 2402);
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
            _yuitest_coverfunc("graphics-canvas", "setter", 2413);
_yuitest_coverline("graphics-canvas", 2415);
this.set("radius", val/2);
            _yuitest_coverline("graphics-canvas", 2416);
return val;
        },

		getter: function()
		{
			_yuitest_coverfunc("graphics-canvas", "getter", 2419);
_yuitest_coverline("graphics-canvas", 2421);
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
_yuitest_coverline("graphics-canvas", 2435);
Y.CanvasCircle = CanvasCircle;
/**
 * Draws pie slices
 *
 * @module graphics
 * @class CanvasPieSlice
 * @constructor
 */
_yuitest_coverline("graphics-canvas", 2443);
CanvasPieSlice = function()
{
	_yuitest_coverfunc("graphics-canvas", "CanvasPieSlice", 2443);
_yuitest_coverline("graphics-canvas", 2445);
CanvasPieSlice.superclass.constructor.apply(this, arguments);
};
_yuitest_coverline("graphics-canvas", 2447);
CanvasPieSlice.NAME = "canvasPieSlice";
_yuitest_coverline("graphics-canvas", 2448);
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
        _yuitest_coverfunc("graphics-canvas", "_draw", 2464);
_yuitest_coverline("graphics-canvas", 2466);
var x = this.get("cx"),
            y = this.get("cy"),
            startAngle = this.get("startAngle"),
            arc = this.get("arc"),
            radius = this.get("radius");
        _yuitest_coverline("graphics-canvas", 2471);
this.clear();
        _yuitest_coverline("graphics-canvas", 2472);
this._left = x;
        _yuitest_coverline("graphics-canvas", 2473);
this._right = radius;
        _yuitest_coverline("graphics-canvas", 2474);
this._top = y;
        _yuitest_coverline("graphics-canvas", 2475);
this._bottom = radius;
        _yuitest_coverline("graphics-canvas", 2476);
this.drawWedge(x, y, startAngle, arc, radius);
		_yuitest_coverline("graphics-canvas", 2477);
this.end();
	}
 });
_yuitest_coverline("graphics-canvas", 2480);
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
_yuitest_coverline("graphics-canvas", 2518);
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
_yuitest_coverline("graphics-canvas", 2530);
function CanvasGraphic(config) {
    
    _yuitest_coverfunc("graphics-canvas", "CanvasGraphic", 2530);
_yuitest_coverline("graphics-canvas", 2532);
CanvasGraphic.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("graphics-canvas", 2535);
CanvasGraphic.NAME = "canvasGraphic";

_yuitest_coverline("graphics-canvas", 2537);
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
			_yuitest_coverfunc("graphics-canvas", "valueFn", 2553);
_yuitest_coverline("graphics-canvas", 2555);
return Y.guid();
		},

		setter: function(val)
		{
			_yuitest_coverfunc("graphics-canvas", "setter", 2558);
_yuitest_coverline("graphics-canvas", 2560);
var node = this._node;
			_yuitest_coverline("graphics-canvas", 2561);
if(node)
			{
				_yuitest_coverline("graphics-canvas", 2563);
node.setAttribute("id", val);
			}
			_yuitest_coverline("graphics-canvas", 2565);
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
            _yuitest_coverfunc("graphics-canvas", "getter", 2579);
_yuitest_coverline("graphics-canvas", 2581);
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
            _yuitest_coverfunc("graphics-canvas", "getter", 2595);
_yuitest_coverline("graphics-canvas", 2597);
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
            _yuitest_coverfunc("graphics-canvas", "getter", 2611);
_yuitest_coverline("graphics-canvas", 2613);
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
            _yuitest_coverfunc("graphics-canvas", "setter", 2624);
_yuitest_coverline("graphics-canvas", 2626);
if(this._node)
            {
                _yuitest_coverline("graphics-canvas", 2628);
this._node.style.width = val + "px";            
            }
            _yuitest_coverline("graphics-canvas", 2630);
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
            _yuitest_coverfunc("graphics-canvas", "setter", 2641);
_yuitest_coverline("graphics-canvas", 2643);
if(this._node)
            {
                _yuitest_coverline("graphics-canvas", 2645);
this._node.style.height = val + "px";
            }
            _yuitest_coverline("graphics-canvas", 2647);
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
        getter: function()
        {
            _yuitest_coverfunc("graphics-canvas", "getter", 2705);
_yuitest_coverline("graphics-canvas", 2707);
return this._resizeDown;
        },

        setter: function(val)
        {
            _yuitest_coverfunc("graphics-canvas", "setter", 2710);
_yuitest_coverline("graphics-canvas", 2712);
this._resizeDown = val;
            _yuitest_coverline("graphics-canvas", 2713);
if(this._node)
            {
                _yuitest_coverline("graphics-canvas", 2715);
this._redraw();
            }
            _yuitest_coverline("graphics-canvas", 2717);
return val;
        }
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
            _yuitest_coverfunc("graphics-canvas", "getter", 2728);
_yuitest_coverline("graphics-canvas", 2730);
return this._x;
        },

        setter: function(val)
        {
            _yuitest_coverfunc("graphics-canvas", "setter", 2733);
_yuitest_coverline("graphics-canvas", 2735);
this._x = val;
            _yuitest_coverline("graphics-canvas", 2736);
if(this._node)
            {
                _yuitest_coverline("graphics-canvas", 2738);
this._node.style.left = val + "px";
            }
            _yuitest_coverline("graphics-canvas", 2740);
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
            _yuitest_coverfunc("graphics-canvas", "getter", 2751);
_yuitest_coverline("graphics-canvas", 2753);
return this._y;
        },

        setter: function(val)
        {
            _yuitest_coverfunc("graphics-canvas", "setter", 2756);
_yuitest_coverline("graphics-canvas", 2758);
this._y = val;
            _yuitest_coverline("graphics-canvas", 2759);
if(this._node)
            {
                _yuitest_coverline("graphics-canvas", 2761);
this._node.style.top = val + "px";
            }
            _yuitest_coverline("graphics-canvas", 2763);
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
            _yuitest_coverfunc("graphics-canvas", "setter", 2789);
_yuitest_coverline("graphics-canvas", 2791);
this._toggleVisible(val);
            _yuitest_coverline("graphics-canvas", 2792);
return val;
        }
    }
};

_yuitest_coverline("graphics-canvas", 2797);
Y.extend(CanvasGraphic, Y.GraphicBase, {
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
        _yuitest_coverfunc("graphics-canvas", "getXY", 2822);
_yuitest_coverline("graphics-canvas", 2824);
var node = Y.one(this._node),
            xy;
        _yuitest_coverline("graphics-canvas", 2826);
if(node)
        {
            _yuitest_coverline("graphics-canvas", 2828);
xy = node.getXY();
        }
        _yuitest_coverline("graphics-canvas", 2830);
return xy;
    },

    /**
     * Storage for `resizeDown` attribute.
     *
     * @property _resizeDown 
     * @type Boolean
     * @private
     */
    _resizeDown: false,
    
	/**
     * Initializes the class.
     *
     * @method initializer
     * @param {Object} config Optional attributes 
     * @private
     */
    initializer: function(config) {
        _yuitest_coverfunc("graphics-canvas", "initializer", 2849);
_yuitest_coverline("graphics-canvas", 2850);
var render = this.get("render"),
            visibility = this.get("visible") ? "visible" : "hidden",
            w = this.get("width") || 0,
            h = this.get("height") || 0;
        _yuitest_coverline("graphics-canvas", 2854);
this._shapes = {};
        _yuitest_coverline("graphics-canvas", 2855);
this._redrawQueue = {};
		_yuitest_coverline("graphics-canvas", 2856);
this._contentBounds = {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        };
        _yuitest_coverline("graphics-canvas", 2862);
this._node = DOCUMENT.createElement('div');
        _yuitest_coverline("graphics-canvas", 2863);
this._node.style.position = "absolute";
        _yuitest_coverline("graphics-canvas", 2864);
this._node.style.visibility = visibility;
        _yuitest_coverline("graphics-canvas", 2865);
this.set("width", w);
        _yuitest_coverline("graphics-canvas", 2866);
this.set("height", h);
        _yuitest_coverline("graphics-canvas", 2867);
if(render)
        {
            _yuitest_coverline("graphics-canvas", 2869);
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
        _yuitest_coverfunc("graphics-canvas", "render", 2879);
_yuitest_coverline("graphics-canvas", 2880);
var parentNode = Y.one(render),
            node = this._node,
            w = this.get("width") || parseInt(parentNode.getComputedStyle("width"), 10),
            h = this.get("height") || parseInt(parentNode.getComputedStyle("height"), 10);
        _yuitest_coverline("graphics-canvas", 2884);
parentNode = parentNode || DOCUMENT.body;
        _yuitest_coverline("graphics-canvas", 2885);
parentNode.appendChild(node);
        _yuitest_coverline("graphics-canvas", 2886);
node.style.display = "block";
        _yuitest_coverline("graphics-canvas", 2887);
node.style.position = "absolute";
        _yuitest_coverline("graphics-canvas", 2888);
node.style.left = "0px";
        _yuitest_coverline("graphics-canvas", 2889);
node.style.top = "0px";
        _yuitest_coverline("graphics-canvas", 2890);
this.set("width", w);
        _yuitest_coverline("graphics-canvas", 2891);
this.set("height", h);
        _yuitest_coverline("graphics-canvas", 2892);
this.parentNode = parentNode;
        _yuitest_coverline("graphics-canvas", 2893);
return this;
    },

    /**
     * Removes all nodes.
     *
     * @method destroy
     */
    destroy: function()
    {
        _yuitest_coverfunc("graphics-canvas", "destroy", 2901);
_yuitest_coverline("graphics-canvas", 2903);
this.removeAllShapes();
        _yuitest_coverline("graphics-canvas", 2904);
if(this._node)
        {
            _yuitest_coverline("graphics-canvas", 2906);
this._removeChildren(this._node);
            _yuitest_coverline("graphics-canvas", 2907);
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
        _yuitest_coverfunc("graphics-canvas", "addShape", 2918);
_yuitest_coverline("graphics-canvas", 2920);
cfg.graphic = this;
        _yuitest_coverline("graphics-canvas", 2921);
if(!this.get("visible"))
        {
            _yuitest_coverline("graphics-canvas", 2923);
cfg.visible = false;
        }
        _yuitest_coverline("graphics-canvas", 2925);
var shapeClass = this._getShapeClass(cfg.type),
            shape = new shapeClass(cfg);
        _yuitest_coverline("graphics-canvas", 2927);
this._appendShape(shape);
        _yuitest_coverline("graphics-canvas", 2928);
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
        _yuitest_coverfunc("graphics-canvas", "_appendShape", 2938);
_yuitest_coverline("graphics-canvas", 2940);
var node = shape.node,
            parentNode = this._frag || this._node;
        _yuitest_coverline("graphics-canvas", 2942);
if(this.get("autoDraw")) 
        {
            _yuitest_coverline("graphics-canvas", 2944);
parentNode.appendChild(node);
        }
        else
        {
            _yuitest_coverline("graphics-canvas", 2948);
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
        _yuitest_coverfunc("graphics-canvas", "removeShape", 2958);
_yuitest_coverline("graphics-canvas", 2960);
if(!(shape instanceof CanvasShape))
        {
            _yuitest_coverline("graphics-canvas", 2962);
if(Y_LANG.isString(shape))
            {
                _yuitest_coverline("graphics-canvas", 2964);
shape = this._shapes[shape];
            }
        }
        _yuitest_coverline("graphics-canvas", 2967);
if(shape && shape instanceof CanvasShape)
        {
            _yuitest_coverline("graphics-canvas", 2969);
shape._destroy();
            _yuitest_coverline("graphics-canvas", 2970);
delete this._shapes[shape.get("id")];
        }
        _yuitest_coverline("graphics-canvas", 2972);
if(this.get("autoDraw")) 
        {
            _yuitest_coverline("graphics-canvas", 2974);
this._redraw();
        }
        _yuitest_coverline("graphics-canvas", 2976);
return shape;
    },

    /**
     * Removes all shape instances from the dom.
     *
     * @method removeAllShapes
     */
    removeAllShapes: function()
    {
        _yuitest_coverfunc("graphics-canvas", "removeAllShapes", 2984);
_yuitest_coverline("graphics-canvas", 2986);
var shapes = this._shapes,
            i;
        _yuitest_coverline("graphics-canvas", 2988);
for(i in shapes)
        {
            _yuitest_coverline("graphics-canvas", 2990);
if(shapes.hasOwnProperty(i))
            {
                _yuitest_coverline("graphics-canvas", 2992);
shapes[i].destroy();
            }
        }
        _yuitest_coverline("graphics-canvas", 2995);
this._shapes = {};
    },
    
    /**
     * Clears the graphics object.
     *
     * @method clear
     */
    clear: function() {
        _yuitest_coverfunc("graphics-canvas", "clear", 3003);
_yuitest_coverline("graphics-canvas", 3004);
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
        _yuitest_coverfunc("graphics-canvas", "_removeChildren", 3014);
_yuitest_coverline("graphics-canvas", 3016);
if(node && node.hasChildNodes())
        {
            _yuitest_coverline("graphics-canvas", 3018);
var child;
            _yuitest_coverline("graphics-canvas", 3019);
while(node.firstChild)
            {
                _yuitest_coverline("graphics-canvas", 3021);
child = node.firstChild;
                _yuitest_coverline("graphics-canvas", 3022);
this._removeChildren(child);
                _yuitest_coverline("graphics-canvas", 3023);
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
        _yuitest_coverfunc("graphics-canvas", "_toggleVisible", 3035);
_yuitest_coverline("graphics-canvas", 3037);
var i,
            shapes = this._shapes,
            visibility = val ? "visible" : "hidden";
        _yuitest_coverline("graphics-canvas", 3040);
if(shapes)
        {
            _yuitest_coverline("graphics-canvas", 3042);
for(i in shapes)
            {
                _yuitest_coverline("graphics-canvas", 3044);
if(shapes.hasOwnProperty(i))
                {
                    _yuitest_coverline("graphics-canvas", 3046);
shapes[i].set("visible", val);
                }
            }
        }
        _yuitest_coverline("graphics-canvas", 3050);
if(this._node)
        {
            _yuitest_coverline("graphics-canvas", 3052);
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
        _yuitest_coverfunc("graphics-canvas", "_getShapeClass", 3064);
_yuitest_coverline("graphics-canvas", 3066);
var shape = this._shapeClass[val];
        _yuitest_coverline("graphics-canvas", 3067);
if(shape)
        {
            _yuitest_coverline("graphics-canvas", 3069);
return shape;
        }
        _yuitest_coverline("graphics-canvas", 3071);
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
        _yuitest_coverfunc("graphics-canvas", "getShapeById", 3096);
_yuitest_coverline("graphics-canvas", 3098);
var shape = this._shapes[id];
        _yuitest_coverline("graphics-canvas", 3099);
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
        _yuitest_coverfunc("graphics-canvas", "batch", 3108);
_yuitest_coverline("graphics-canvas", 3110);
var autoDraw = this.get("autoDraw");
        _yuitest_coverline("graphics-canvas", 3111);
this.set("autoDraw", false);
        _yuitest_coverline("graphics-canvas", 3112);
method();
        _yuitest_coverline("graphics-canvas", 3113);
this._redraw();
        _yuitest_coverline("graphics-canvas", 3114);
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
        _yuitest_coverfunc("graphics-canvas", "_getDocFrag", 3124);
_yuitest_coverline("graphics-canvas", 3126);
if(!this._frag)
        {
            _yuitest_coverline("graphics-canvas", 3128);
this._frag = DOCUMENT.createDocumentFragment();
        }
        _yuitest_coverline("graphics-canvas", 3130);
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
        _yuitest_coverfunc("graphics-canvas", "_redraw", 3139);
_yuitest_coverline("graphics-canvas", 3141);
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
        _yuitest_coverline("graphics-canvas", 3154);
if(autoSize)
        {
            _yuitest_coverline("graphics-canvas", 3156);
if(autoSize == "sizeContentToGraphic")
            {
                _yuitest_coverline("graphics-canvas", 3158);
contentWidth = box.width;
                _yuitest_coverline("graphics-canvas", 3159);
contentHeight = box.height;
                _yuitest_coverline("graphics-canvas", 3160);
w = parseFloat(Y_DOM.getComputedStyle(node, "width"));
                _yuitest_coverline("graphics-canvas", 3161);
h = parseFloat(Y_DOM.getComputedStyle(node, "height"));
                _yuitest_coverline("graphics-canvas", 3162);
matrix = new Y.Matrix();
                _yuitest_coverline("graphics-canvas", 3163);
if(preserveAspectRatio == "none")
                {
                    _yuitest_coverline("graphics-canvas", 3165);
xScale = w/contentWidth;
                    _yuitest_coverline("graphics-canvas", 3166);
yScale = h/contentHeight;
                }
                else
                {
                    _yuitest_coverline("graphics-canvas", 3170);
if(contentWidth/contentHeight !== w/h) 
                    {
                        _yuitest_coverline("graphics-canvas", 3172);
if(contentWidth * h/contentHeight > w)
                        {
                            _yuitest_coverline("graphics-canvas", 3174);
xScale = yScale = w/contentWidth;
                            _yuitest_coverline("graphics-canvas", 3175);
translateY = this._calculateTranslate(preserveAspectRatio.slice(5).toLowerCase(), contentHeight * w/contentWidth, h);
                        }
                        else
                        {
                            _yuitest_coverline("graphics-canvas", 3179);
xScale = yScale = h/contentHeight;
                            _yuitest_coverline("graphics-canvas", 3180);
translateX = this._calculateTranslate(preserveAspectRatio.slice(1, 4).toLowerCase(), contentWidth * h/contentHeight, w);
                        }
                    }
                }
                _yuitest_coverline("graphics-canvas", 3184);
Y_DOM.setStyle(node, "transformOrigin", "0% 0%");
                _yuitest_coverline("graphics-canvas", 3185);
translateX = translateX - (box.left * xScale);
                _yuitest_coverline("graphics-canvas", 3186);
translateY = translateY - (box.top * yScale);
                _yuitest_coverline("graphics-canvas", 3187);
matrix.translate(translateX, translateY);
                _yuitest_coverline("graphics-canvas", 3188);
matrix.scale(xScale, yScale);
                _yuitest_coverline("graphics-canvas", 3189);
Y_DOM.setStyle(node, "transform", matrix.toCSSText());
            }
            else
            {
                _yuitest_coverline("graphics-canvas", 3193);
this.set("width", box.right);
                _yuitest_coverline("graphics-canvas", 3194);
this.set("height", box.bottom);
            }
        }
        _yuitest_coverline("graphics-canvas", 3197);
if(this._frag)
        {
            _yuitest_coverline("graphics-canvas", 3199);
this._node.appendChild(this._frag);
            _yuitest_coverline("graphics-canvas", 3200);
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
        _yuitest_coverfunc("graphics-canvas", "_calculateTranslate", 3214);
_yuitest_coverline("graphics-canvas", 3216);
var ratio = boundsSize - contentSize,
            coord;
        _yuitest_coverline("graphics-canvas", 3218);
switch(position)
        {
            case "mid" :
                _yuitest_coverline("graphics-canvas", 3221);
coord = ratio * 0.5;
            _yuitest_coverline("graphics-canvas", 3222);
break;
            case "max" :
                _yuitest_coverline("graphics-canvas", 3224);
coord = ratio;
            _yuitest_coverline("graphics-canvas", 3225);
break;
            default :
                _yuitest_coverline("graphics-canvas", 3227);
coord = 0;
            _yuitest_coverline("graphics-canvas", 3228);
break;
        }
        _yuitest_coverline("graphics-canvas", 3230);
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
        _yuitest_coverfunc("graphics-canvas", "addToRedrawQueue", 3241);
_yuitest_coverline("graphics-canvas", 3243);
var shapeBox,
            box;
        _yuitest_coverline("graphics-canvas", 3245);
this._shapes[shape.get("id")] = shape;
        _yuitest_coverline("graphics-canvas", 3246);
if(!this.get("resizeDown"))
        {
            _yuitest_coverline("graphics-canvas", 3248);
shapeBox = shape.getBounds();
            _yuitest_coverline("graphics-canvas", 3249);
box = this._contentBounds;
            _yuitest_coverline("graphics-canvas", 3250);
box.left = box.left < shapeBox.left ? box.left : shapeBox.left;
            _yuitest_coverline("graphics-canvas", 3251);
box.top = box.top < shapeBox.top ? box.top : shapeBox.top;
            _yuitest_coverline("graphics-canvas", 3252);
box.right = box.right > shapeBox.right ? box.right : shapeBox.right;
            _yuitest_coverline("graphics-canvas", 3253);
box.bottom = box.bottom > shapeBox.bottom ? box.bottom : shapeBox.bottom;
            _yuitest_coverline("graphics-canvas", 3254);
box.width = box.right - box.left;
            _yuitest_coverline("graphics-canvas", 3255);
box.height = box.bottom - box.top;
            _yuitest_coverline("graphics-canvas", 3256);
this._contentBounds = box;
        }
        _yuitest_coverline("graphics-canvas", 3258);
if(this.get("autoDraw")) 
        {
            _yuitest_coverline("graphics-canvas", 3260);
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
        _yuitest_coverfunc("graphics-canvas", "_getUpdatedContentBounds", 3271);
_yuitest_coverline("graphics-canvas", 3273);
var bounds,
            i,
            shape,
            queue = this._shapes,
            box = {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            };
        _yuitest_coverline("graphics-canvas", 3283);
for(i in queue)
        {
            _yuitest_coverline("graphics-canvas", 3285);
if(queue.hasOwnProperty(i))
            {
                _yuitest_coverline("graphics-canvas", 3287);
shape = queue[i];
                _yuitest_coverline("graphics-canvas", 3288);
bounds = shape.getBounds();
                _yuitest_coverline("graphics-canvas", 3289);
box.left = Math.min(box.left, bounds.left);
                _yuitest_coverline("graphics-canvas", 3290);
box.top = Math.min(box.top, bounds.top);
                _yuitest_coverline("graphics-canvas", 3291);
box.right = Math.max(box.right, bounds.right);
                _yuitest_coverline("graphics-canvas", 3292);
box.bottom = Math.max(box.bottom, bounds.bottom);
            }
        }
        _yuitest_coverline("graphics-canvas", 3295);
box.width = box.right - box.left;
        _yuitest_coverline("graphics-canvas", 3296);
box.height = box.bottom - box.top;
        _yuitest_coverline("graphics-canvas", 3297);
this._contentBounds = box;
        _yuitest_coverline("graphics-canvas", 3298);
return box;
    }
});

_yuitest_coverline("graphics-canvas", 3302);
Y.CanvasGraphic = CanvasGraphic;


}, '@VERSION@', {"requires": ["graphics"]});
