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
_yuitest_coverage["build/graphics-vml/graphics-vml.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/graphics-vml/graphics-vml.js",
    code: []
};
_yuitest_coverage["build/graphics-vml/graphics-vml.js"].code=["YUI.add('graphics-vml', function (Y, NAME) {","","var IMPLEMENTATION = \"vml\",","    SHAPE = \"shape\",","	SPLITPATHPATTERN = /[a-z][^a-z]*/ig,","    SPLITARGSPATTERN = /[-]?[0-9]*[0-9|\\.][0-9]*/g,","    Y_LANG = Y.Lang,","    IS_NUM = Y_LANG.isNumber,","    IS_ARRAY = Y_LANG.isArray,","    IS_STRING = Y_LANG.isString,","    Y_DOM = Y.DOM,","    Y_SELECTOR = Y.Selector,","    DOCUMENT = Y.config.doc,","    AttributeLite = Y.AttributeLite,","	VMLShape,","	VMLCircle,","	VMLPath,","	VMLRect,","	VMLEllipse,","	VMLGraphic,","    VMLPieSlice,","    _getClassName = Y.ClassNameManager.getClassName;","","function VMLDrawing() {}","","/**"," * <a href=\"http://www.w3.org/TR/NOTE-VML\">VML</a> implementation of the <a href=\"Drawing.html\">`Drawing`</a> class. "," * `VMLDrawing` is not intended to be used directly. Instead, use the <a href=\"Drawing.html\">`Drawing`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> and <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> "," * capabilities, the <a href=\"Drawing.html\">`Drawing`</a> class will point to the `VMLDrawing` class."," *"," * @module graphics"," * @class VMLDrawing"," * @constructor"," */","VMLDrawing.prototype = {","    /**","     * Maps path to methods","     *","     * @property _pathSymbolToMethod","     * @type Object","     * @private","     */","    _pathSymbolToMethod: {","        M: \"moveTo\",","        m: \"relativeMoveTo\",","        L: \"lineTo\",","        l: \"relativeLineTo\",","        C: \"curveTo\",","        c: \"relativeCurveTo\",","        Q: \"quadraticCurveTo\",","        q: \"relativeQuadraticCurveTo\",","        z: \"closePath\",","        Z: \"closePath\"","    },","","    /**","     * Value for rounding up to coordsize","     *","     * @property _coordSpaceMultiplier","     * @type Number","     * @private","     */","    _coordSpaceMultiplier: 100,","","    /**","     * Rounds dimensions and position values based on the coordinate space.","     *","     * @method _round","     * @param {Number} The value for rounding","     * @return Number","     * @private","     */","    _round:function(val)","    {","        return Math.round(val * this._coordSpaceMultiplier);","    },","","    /**","     * Concatanates the path.","     *","     * @method _addToPath","     * @param {String} val The value to add to the path string.","     * @private","     */","    _addToPath: function(val)","    {","        this._path = this._path || \"\";","        if(this._movePath)","        {","            this._path += this._movePath;","            this._movePath = null;","        }","        this._path += val;","    },","","    /**","     * Current x position of the drawing.","     *","     * @property _currentX","     * @type Number","     * @private","     */","    _currentX: 0,","","    /**","     * Current y position of the drqwing.","     *","     * @property _currentY","     * @type Number","     * @private","     */","    _currentY: 0,","    ","    /**","     * Draws a bezier curve.","     *","     * @method curveTo","     * @param {Number} cp1x x-coordinate for the first control point.","     * @param {Number} cp1y y-coordinate for the first control point.","     * @param {Number} cp2x x-coordinate for the second control point.","     * @param {Number} cp2y y-coordinate for the second control point.","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    curveTo: function() {","        this._curveTo.apply(this, [Y.Array(arguments), false]);","    },","","    /**","     * Draws a bezier curve.","     *","     * @method relativeCurveTo","     * @param {Number} cp1x x-coordinate for the first control point.","     * @param {Number} cp1y y-coordinate for the first control point.","     * @param {Number} cp2x x-coordinate for the second control point.","     * @param {Number} cp2y y-coordinate for the second control point.","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    relativeCurveTo: function() {","        this._curveTo.apply(this, [Y.Array(arguments), true]);","    },","    ","    /**","     * Implements curveTo methods.","     *","     * @method _curveTo","     * @param {Array} args The arguments to be used.","     * @param {Boolean} relative Indicates whether or not to use relative coordinates.","     * @private","     */","    _curveTo: function(args, relative) {","        var w,","            h,","            cp1x,","            cp1y,","            cp2x,","            cp2y,","            pts,","            right,","            left,","            bottom,","            top,","            i = 0,","            len,","            path,","            command = relative ? \" v \" : \" c \",","            relativeX = relative ? parseFloat(this._currentX) : 0,","            relativeY = relative ? parseFloat(this._currentY) : 0;","        len = args.length - 5;","        path = command; ","        for(; i < len; i = i + 6)","        {","            cp1x = parseFloat(args[i]);","            cp1y = parseFloat(args[i + 1]);","            cp2x = parseFloat(args[i + 2]);","            cp2y = parseFloat(args[i + 3]);","            x = parseFloat(args[i + 4]);","            y = parseFloat(args[i + 5]);","            if(i > 0)","            {","                path = path + \", \";","            }","            path = path + this._round(cp1x) + \", \" + this._round(cp1y) + \", \" + this._round(cp2x) + \", \" + this._round(cp2y) + \", \" + this._round(x) + \", \" + this._round(y); ","            cp1x = cp1x + relativeX;","            cp1y = cp1y + relativeY;","            cp2x = cp2x + relativeX;","            cp2y = cp2y + relativeY;","            x = x + relativeX;","            y = y + relativeY;","            right = Math.max(x, Math.max(cp1x, cp2x));","            bottom = Math.max(y, Math.max(cp1y, cp2y));","            left = Math.min(x, Math.min(cp1x, cp2x));","            top = Math.min(y, Math.min(cp1y, cp2y));","            w = Math.abs(right - left);","            h = Math.abs(bottom - top);","            pts = [[this._currentX, this._currentY] , [cp1x, cp1y], [cp2x, cp2y], [x, y]]; ","            this._setCurveBoundingBox(pts, w, h);","            this._currentX = x;","            this._currentY = y;","        }","        this._addToPath(path);","    },","","    /**","     * Draws a quadratic bezier curve.","     *","     * @method quadraticCurveTo","     * @param {Number} cpx x-coordinate for the control point.","     * @param {Number} cpy y-coordinate for the control point.","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    quadraticCurveTo: function() {","        this._quadraticCurveTo.apply(this, [Y.Array(arguments), false]);","    },","","    /**","     * Draws a quadratic bezier curve relative to the current position.","     *","     * @method relativeQuadraticCurveTo","     * @param {Number} cpx x-coordinate for the control point.","     * @param {Number} cpy y-coordinate for the control point.","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    relativeQuadraticCurveTo: function() {","        this._quadraticCurveTo.apply(this, [Y.Array(arguments), true]);","    },","","    /**","     * Implements quadraticCurveTo methods.","     *","     * @method _quadraticCurveTo","     * @param {Array} args The arguments to be used.","     * @param {Boolean} relative Indicates whether or not to use relative coordinates.","     * @private","     */","    _quadraticCurveTo: function(args, relative) {","        var cpx, ","            cpy,","            cp1x,","            cp1y,","            cp2x,","            cp2y,","            x, ","            y,","            currentX = this._currentX,","            currentY = this._currentY,","            i = 0,","            len = args.length - 3,","            bezierArgs = [],","            relativeX = relative ? parseFloat(this._currentX) : 0,","            relativeY = relative ? parseFloat(this._currentY) : 0;","        for(; i < len; i = i + 4)","        {","            cpx = parseFloat(args[i]) + relativeX;","            cpy = parseFloat(args[i + 1]) + relativeY;","            x = parseFloat(args[i + 2]) + relativeX;","            y = parseFloat(args[i + 3]) + relativeY;","            cp1x = currentX + 0.67*(cpx - currentX);","            cp1y = currentY + 0.67*(cpy - currentY);","            cp2x = cp1x + (x - currentX) * 0.34;","            cp2y = cp1y + (y - currentY) * 0.34;","            bezierArgs.push(cp1x),","            bezierArgs.push(cp1y),","            bezierArgs.push(cp2x),","            bezierArgs.push(cp2y);","            bezierArgs.push(x);","            bezierArgs.push(y);","        }","        this._curveTo.apply(this, [bezierArgs, false]);","    },","","    /**","     * Draws a rectangle.","     *","     * @method drawRect","     * @param {Number} x x-coordinate","     * @param {Number} y y-coordinate","     * @param {Number} w width","     * @param {Number} h height","     */","    drawRect: function(x, y, w, h) {","        this.moveTo(x, y);","        this.lineTo(x + w, y);","        this.lineTo(x + w, y + h);","        this.lineTo(x, y + h);","        this.lineTo(x, y);","        this._currentX = x;","        this._currentY = y;","        return this;","    },","","    /**","     * Draws a rectangle with rounded corners.","     * ","     * @method drawRect","     * @param {Number} x x-coordinate","     * @param {Number} y y-coordinate","     * @param {Number} w width","     * @param {Number} h height","     * @param {Number} ew width of the ellipse used to draw the rounded corners","     * @param {Number} eh height of the ellipse used to draw the rounded corners","     */","    drawRoundRect: function(x, y, w, h, ew, eh) {","        this.moveTo(x, y + eh);","        this.lineTo(x, y + h - eh);","        this.quadraticCurveTo(x, y + h, x + ew, y + h);","        this.lineTo(x + w - ew, y + h);","        this.quadraticCurveTo(x + w, y + h, x + w, y + h - eh);","        this.lineTo(x + w, y + eh);","        this.quadraticCurveTo(x + w, y, x + w - ew, y);","        this.lineTo(x + ew, y);","        this.quadraticCurveTo(x, y, x, y + eh);","        return this;","    },","","    /**","     * Draws a circle. Used internally by `CanvasCircle` class.","     *","     * @method drawCircle","     * @param {Number} x y-coordinate","     * @param {Number} y x-coordinate","     * @param {Number} r radius","     * @protected","     */","	drawCircle: function(x, y, radius) {","        var startAngle = 0,","            endAngle = 360,","            circum = radius * 2;","","        endAngle *= 65535;","        this._drawingComplete = false;","        this._trackSize(x + circum, y + circum);","        this.moveTo((x + circum), (y + radius));","        this._addToPath(\" ae \" + this._round(x + radius) + \", \" + this._round(y + radius) + \", \" + this._round(radius) + \", \" + this._round(radius) + \", \" + startAngle + \", \" + endAngle);","        return this;","    },","    ","    /**","     * Draws an ellipse.","     *","     * @method drawEllipse","     * @param {Number} x x-coordinate","     * @param {Number} y y-coordinate","     * @param {Number} w width","     * @param {Number} h height","     * @protected","     */","	drawEllipse: function(x, y, w, h) {","        var startAngle = 0,","            endAngle = 360,","            radius = w * 0.5,","            yRadius = h * 0.5;","        endAngle *= 65535;","        this._drawingComplete = false;","        this._trackSize(x + w, y + h);","        this.moveTo((x + w), (y + yRadius));","        this._addToPath(\" ae \" + this._round(x + radius) + \", \" + this._round(x + radius) + \", \" + this._round(y + yRadius) + \", \" + this._round(radius) + \", \" + this._round(yRadius) + \", \" + startAngle + \", \" + endAngle);","        return this;","    },","    ","    /**","     * Draws a diamond.     ","     * ","     * @method drawDiamond","     * @param {Number} x y-coordinate","     * @param {Number} y x-coordinate","     * @param {Number} width width","     * @param {Number} height height","     * @protected","     */","    drawDiamond: function(x, y, width, height)","    {","        var midWidth = width * 0.5,","            midHeight = height * 0.5;","        this.moveTo(x + midWidth, y);","        this.lineTo(x + width, y + midHeight);","        this.lineTo(x + midWidth, y + height);","        this.lineTo(x, y + midHeight);","        this.lineTo(x + midWidth, y);","        return this;","    },","","    /**","     * Draws a wedge.","     *","     * @method drawWedge","     * @param {Number} x x-coordinate of the wedge's center point","     * @param {Number} y y-coordinate of the wedge's center point","     * @param {Number} startAngle starting angle in degrees","     * @param {Number} arc sweep of the wedge. Negative values draw clockwise.","     * @param {Number} radius radius of wedge. If [optional] yRadius is defined, then radius is the x radius.","     * @param {Number} yRadius [optional] y radius for wedge.","     * @private","     */","    drawWedge: function(x, y, startAngle, arc, radius)","    {","        var diameter = radius * 2;","        if(Math.abs(arc) > 360)","        {","            arc = 360;","        }","        this._currentX = x;","        this._currentY = y;","        startAngle *= -65535;","        arc *= 65536;","        startAngle = Math.round(startAngle);","        arc = Math.round(arc);","        this.moveTo(x, y);","        this._addToPath(\" ae \" + this._round(x) + \", \" + this._round(y) + \", \" + this._round(radius) + \" \" + this._round(radius) + \", \" +  startAngle + \", \" + arc);","        this._trackSize(diameter, diameter); ","        return this;","    },","","    /**","     * Draws a line segment from the current drawing position to the specified x and y coordinates.","     * ","     * @method lineTo","     * @param {Number} point1 x-coordinate for the end point.","     * @param {Number} point2 y-coordinate for the end point.","     */","    lineTo: function()","    {","        this._lineTo.apply(this, [Y.Array(arguments), false]);","    },","","    /**","     * Draws a line segment using the current line style from the current drawing position to the relative x and y coordinates.","     * ","     * @method relativeLineTo","     * @param {Number} point1 x-coordinate for the end point.","     * @param {Number} point2 y-coordinate for the end point.","     */","    relativeLineTo: function()","    {","        this._lineTo.apply(this, [Y.Array(arguments), true]);","    },","","    /**","     * Implements lineTo methods.","     *","     * @method _lineTo","     * @param {Array} args The arguments to be used.","     * @param {Boolean} relative Indicates whether or not to use relative coordinates.","     * @private","     */","    _lineTo: function(args, relative) {","        var point1 = args[0],","            i,","            len,","            x,","            y,","            path = relative ? \" r \" : \" l \",","            relativeX = relative ? parseFloat(this._currentX) : 0,","            relativeY = relative ? parseFloat(this._currentY) : 0;","        len = args.length;","        if (typeof point1 == \"string\" || typeof point1 == \"number\") {","            for (i = 0; i < len; i = i + 2) {","                x = parseFloat(args[i]);","                y = parseFloat(args[i + 1]);","                path += ' ' + this._round(x) + ', ' + this._round(y);","                x = x + relativeX;","                y = y + relativeY;","                this._currentX = x;","                this._currentY = y;","                this._trackSize.apply(this, [x, y]);","            }","        }","        else","        {","            for (i = 0; i < len; i = i + 1) {","                x = parseFloat(args[i][0]);","                y = parseFloat(args[i][1]);","                path += ' ' + this._round(x) + ', ' + this._round(y);","                x = x + relativeX;","                y = y + relativeY;","                this._currentX = x;","                this._currentY = y;","                this._trackSize.apply([x, y]);","            }","        }","        this._addToPath(path);","        return this;","    },","    ","    /**","     * Moves the current drawing position to specified x and y coordinates.","     *","     * @method moveTo","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    moveTo: function()","    {","        this._moveTo.apply(this, [Y.Array(arguments), false]);","    },","","    /**","     * Moves the current drawing position relative to specified x and y coordinates.","     *","     * @method relativeMoveTo","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    relativeMoveTo: function()","    {","        this._moveTo.apply(this, [Y.Array(arguments), true]);","    },","","    /**","     * Implements moveTo methods.","     *","     * @method _moveTo","     * @param {Array} args The arguments to be used.","     * @param {Boolean} relative Indicates whether or not to use relative coordinates.","     * @private","     */","    _moveTo: function(args, relative) {","        var x = parseFloat(args[0]);","            y = parseFloat(args[1]),","            command = relative ? \" t \" : \" m \",","            relativeX = relative ? parseFloat(this._currentX) : 0,","            relativeY = relative ? parseFloat(this._currentY) : 0;","        this._movePath = command + this._round(x) + \", \" + this._round(y);","        x = x + relativeX;","        y = y + relativeY;","        this._trackSize(x, y);","        this._currentX = x;","        this._currentY = y;","    },","","    /**","     * Draws the graphic.","     *","     * @method _draw","     * @private","     */","    _closePath: function()","    {","        var fill = this.get(\"fill\"),","            stroke = this.get(\"stroke\"),","            node = this.node,","            w = this.get(\"width\"),","            h = this.get(\"height\"),","            path = this._path,","            pathEnd = \"\",","            multiplier = this._coordSpaceMultiplier;","        this._fillChangeHandler();","        this._strokeChangeHandler();","        if(path)","        {","            if(fill && fill.color)","            {","                pathEnd += ' x';","            }","            if(stroke)","            {","                pathEnd += ' e';","            }","        }","        if(path)","        {","            node.path = path + pathEnd;","        }","        if(!isNaN(w) && !isNaN(h))","        {","            node.coordOrigin = this._left + \", \" + this._top;","            node.coordSize = (w * multiplier) + \", \" + (h * multiplier);","            node.style.position = \"absolute\";","            node.style.width =  w + \"px\";","            node.style.height =  h + \"px\";","        }","        this._path = path;","        this._movePath = null;","        this._updateTransform();","    },","","    /**","     * Completes a drawing operation. ","     *","     * @method end","     */","    end: function()","    {","        this._closePath();","    },","","    /**","     * Ends a fill and stroke","     *","     * @method closePath","     */","    closePath: function()","    {","        this._addToPath(\" x e\");","    },","","    /**","     * Clears the path.","     *","     * @method clear","     */","    clear: function()","    {","		this._right = 0;","        this._bottom = 0;","        this._width = 0;","        this._height = 0;","        this._left = 0;","        this._top = 0;","        this._path = \"\";","        this._movePath = null;","    },","    ","    /**","     * Returns the points on a curve","     *","     * @method getBezierData","     * @param Array points Array containing the begin, end and control points of a curve.","     * @param Number t The value for incrementing the next set of points.","     * @return Array","     * @private","     */","    getBezierData: function(points, t) {  ","        var n = points.length,","            tmp = [],","            i,","            j;","","        for (i = 0; i < n; ++i){","            tmp[i] = [points[i][0], points[i][1]]; // save input","        }","        ","        for (j = 1; j < n; ++j) {","            for (i = 0; i < n - j; ++i) {","                tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];","                tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1]; ","            }","        }","        return [ tmp[0][0], tmp[0][1] ]; ","    },","  ","    /**","     * Calculates the bounding box for a curve","     *","     * @method _setCurveBoundingBox","     * @param Array pts Array containing points for start, end and control points of a curve.","     * @param Number w Width used to calculate the number of points to describe the curve.","     * @param Number h Height used to calculate the number of points to describe the curve.","     * @private","     */","    _setCurveBoundingBox: function(pts, w, h)","    {","        var i = 0,","            left = this._currentX,","            right = left,","            top = this._currentY,","            bottom = top,","            len = Math.round(Math.sqrt((w * w) + (h * h))),","            t = 1/len,","            xy;","        for(; i < len; ++i)","        {","            xy = this.getBezierData(pts, t * i);","            left = isNaN(left) ? xy[0] : Math.min(xy[0], left);","            right = isNaN(right) ? xy[0] : Math.max(xy[0], right);","            top = isNaN(top) ? xy[1] : Math.min(xy[1], top);","            bottom = isNaN(bottom) ? xy[1] : Math.max(xy[1], bottom);","        }","        left = Math.round(left * 10)/10;","        right = Math.round(right * 10)/10;","        top = Math.round(top * 10)/10;","        bottom = Math.round(bottom * 10)/10;","        this._trackSize(right, bottom);","        this._trackSize(left, top);","    },","","    /**","     * Updates the size of the graphics object","     *","     * @method _trackSize","     * @param {Number} w width","     * @param {Number} h height","     * @private","     */","    _trackSize: function(w, h) {","        if (w > this._right) {","            this._right = w;","        }","        if(w < this._left)","        {","            this._left = w;    ","        }","        if (h < this._top)","        {","            this._top = h;","        }","        if (h > this._bottom) ","        {","            this._bottom = h;","        }","        this._width = this._right - this._left;","        this._height = this._bottom - this._top;","    },","","    _left: 0,","","    _right: 0,","","    _top: 0,","","    _bottom: 0,","","    _width: 0,","","    _height: 0","};","Y.VMLDrawing = VMLDrawing;","/**"," * <a href=\"http://www.w3.org/TR/NOTE-VML\">VML</a> implementation of the <a href=\"Shape.html\">`Shape`</a> class. "," * `VMLShape` is not intended to be used directly. Instead, use the <a href=\"Shape.html\">`Shape`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> and <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> "," * capabilities, the <a href=\"Shape.html\">`Shape`</a> class will point to the `VMLShape` class."," *"," * @module graphics"," * @class VMLShape"," * @constructor"," * @param {Object} cfg (optional) Attribute configs"," */","VMLShape = function() ","{","    this._transforms = [];","    this.matrix = new Y.Matrix();","    this._normalizedMatrix = new Y.Matrix();","    VMLShape.superclass.constructor.apply(this, arguments);","};","","VMLShape.NAME = \"shape\";","","Y.extend(VMLShape, Y.GraphicBase, Y.mix({","	/**","	 * Indicates the type of shape","	 *","	 * @property _type","	 * @type String","     * @private","	 */","	_type: \"shape\",","    ","    /**","     * Init method, invoked during construction.","     * Calls `initializer` method.","     *","     * @method init","     * @protected","     */","	init: function()","	{","		this.initializer.apply(this, arguments);","	},","","	/**","	 * Initializes the shape","	 *","	 * @private","	 * @method _initialize","	 */","	initializer: function(cfg)","	{","		var host = this,","            graphic = cfg.graphic,","            data = this.get(\"data\");","		host.createNode();","        if(graphic)","        {","            this._setGraphic(graphic);","        }","        if(data)","        {","            host._parsePathData(data);","        }","        this._updateHandler();","	},"," ","    /**","     * Set the Graphic instance for the shape.","     *","     * @method _setGraphic","     * @param {Graphic | Node | HTMLElement | String} render This param is used to determine the graphic instance. If it is a `Graphic` instance, it will be assigned","     * to the `graphic` attribute. Otherwise, a new Graphic instance will be created and rendered into the dom element that the render represents.","     * @private","     */","    _setGraphic: function(render)","    {","        var graphic;","        if(render instanceof Y.VMLGraphic)","        {","		    this._graphic = render;","        }","        else","        {","            render = Y.one(render);","            graphic = new Y.VMLGraphic({","                render: render","            });","            graphic._appendShape(this);","            this._graphic = graphic;","            this._appendStrokeAndFill();","        }","    },","    ","    /**","     * Appends fill and stroke nodes to the shape.","     *","     * @method _appendStrokeAndFill","     * @private","     */","    _appendStrokeAndFill: function()","    {","        if(this._strokeNode)","        {","            this.node.appendChild(this._strokeNode);","        }","        if(this._fillNode)","        {","            this.node.appendChild(this._fillNode);","        }","    },","    ","	/**","	 * Creates the dom node for the shape.","	 *","     * @method createNode","	 * @return HTMLElement","	 * @private","	 */","	createNode: function()","	{","        var node,","            concat = this._camelCaseConcat,","			x = this.get(\"x\"),","			y = this.get(\"y\"),","            w = this.get(\"width\"),","            h = this.get(\"height\"),","			id,","			type,","			name = this.name,","            nodestring,","            visibility = this.get(\"visible\") ? \"visible\" : \"hidden\",","			strokestring,","			classString,","			stroke,","			endcap,","			opacity,","			joinstyle,","			miterlimit,","			dashstyle,","			fill,","			fillstring;","			id = this.get(\"id\");","			type = this._type == \"path\" ? \"shape\" : this._type;","		    classString = _getClassName(SHAPE) + \" \" + _getClassName(concat(IMPLEMENTATION, SHAPE)) + \" \" + _getClassName(name) + \" \" + _getClassName(concat(IMPLEMENTATION, name)) + \" \" + IMPLEMENTATION + type; ","			stroke = this._getStrokeProps();","			fill = this._getFillProps();","			","			nodestring  = '<' + type + '  xmlns=\"urn:schemas-microsft.com:vml\" id=\"' + id + '\" class=\"' + classString + '\" style=\"behavior:url(#default#VML);display:inline-block;position:absolute;left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;height:' + h + 'px;visibility:' + visibility + '\"';","","		    if(stroke && stroke.weight && stroke.weight > 0)","			{","				endcap = stroke.endcap;","				opacity = parseFloat(stroke.opacity);","				joinstyle = stroke.joinstyle;","				miterlimit = stroke.miterlimit;","				dashstyle = stroke.dashstyle;","				nodestring += ' stroked=\"t\" strokecolor=\"' + stroke.color + '\" strokeWeight=\"' + stroke.weight + 'px\"';","				","				strokestring = '<stroke class=\"vmlstroke\" xmlns=\"urn:schemas-microsft.com:vml\" on=\"t\" style=\"behavior:url(#default#VML);display:inline-block;\"';","				strokestring += ' opacity=\"' + opacity + '\"';","				if(endcap)","				{","					strokestring += ' endcap=\"' + endcap + '\"';","				}","				if(joinstyle)","				{","					strokestring += ' joinstyle=\"' + joinstyle + '\"';","				}","				if(miterlimit)","				{","					strokestring += ' miterlimit=\"' + miterlimit + '\"';","				}","				if(dashstyle)","				{","					strokestring += ' dashstyle=\"' + dashstyle + '\"';","				}","				strokestring += '></stroke>';","				this._strokeNode = DOCUMENT.createElement(strokestring);","				nodestring += ' stroked=\"t\"';","			}","			else","			{","				nodestring += ' stroked=\"f\"';","			}","			if(fill)","			{","				if(fill.node)","				{","					fillstring = fill.node;","					this._fillNode = DOCUMENT.createElement(fillstring);","				}","				if(fill.color)","				{","					nodestring += ' fillcolor=\"' + fill.color + '\"';","				}","				nodestring += ' filled=\"' + fill.filled + '\"';","			}","			","			","			nodestring += '>';","			nodestring += '</' + type + '>';","			","			node = DOCUMENT.createElement(nodestring);","","            this.node = node;","            this._strokeFlag = false;","            this._fillFlag = false;","	},","","	/**","	 * Add a class name to each node.","	 *","	 * @method addClass","	 * @param {String} className the class name to add to the node's class attribute ","	 */","	addClass: function(className)","	{","		var node = this.node;","		Y_DOM.addClass(node, className);","	},","","	/**","	 * Removes a class name from each node.","	 *","	 * @method removeClass","	 * @param {String} className the class name to remove from the node's class attribute","	 */","	removeClass: function(className)","	{","		var node = this.node;","		Y_DOM.removeClass(node, className);","	},","","	/**","	 * Gets the current position of the node in page coordinates.","	 *","	 * @method getXY","	 * @return Array The XY position of the shape.","	 */","	getXY: function()","	{","		var graphic = this._graphic,","			parentXY = graphic.getXY(),","			x = this.get(\"x\"),","			y = this.get(\"y\");","		return [parentXY[0] + x, parentXY[1] + y];","	},","","	/**","	 * Set the position of the shape in page coordinates, regardless of how the node is positioned.","	 *","	 * @method setXY","	 * @param {Array} Contains x & y values for new position (coordinates are page-based)","     *","	 */","	setXY: function(xy)","	{","		var graphic = this._graphic,","			parentXY = graphic.getXY();","		this.set(\"x\", xy[0] - parentXY[0]);","		this.set(\"y\", xy[1] - parentXY[1]);","	},","","	/**","	 * Determines whether the node is an ancestor of another HTML element in the DOM hierarchy. ","	 *","	 * @method contains","	 * @param {VMLShape | HTMLElement} needle The possible node or descendent","	 * @return Boolean Whether or not this shape is the needle or its ancestor.","	 */","	contains: function(needle)","	{","		return needle === Y.one(this.node);","	},","","	/**","	 * Compares nodes to determine if they match.","	 * Node instances can be compared to each other and/or HTMLElements.","	 * @method compareTo","	 * @param {HTMLElement | Node} refNode The reference node to compare to the node.","	 * @return {Boolean} True if the nodes match, false if they do not.","	 */","	compareTo: function(refNode) {","		var node = this.node;","","		return node === refNode;","	},","","	/**","	 * Test if the supplied node matches the supplied selector.","	 *","	 * @method test","	 * @param {String} selector The CSS selector to test against.","	 * @return Boolean Wheter or not the shape matches the selector.","	 */","	test: function(selector)","	{","		return Y_SELECTOR.test(this.node, selector);","	},","","	/**","     * Calculates and returns properties for setting an initial stroke.","     *","     * @method _getStrokeProps","     * @return Object","     *","	 * @private","	 */","	 _getStrokeProps: function()","	 {","		var props,","			stroke = this.get(\"stroke\"),","			strokeOpacity,","			dashstyle,","			dash = \"\",","			val,","			i = 0,","			len,","			linecap,","			linejoin;","        if(stroke && stroke.weight && stroke.weight > 0)","		{","			props = {};","			linecap = stroke.linecap || \"flat\";","			linejoin = stroke.linejoin || \"round\";","			if(linecap != \"round\" && linecap != \"square\")","			{","				linecap = \"flat\";","			}","			strokeOpacity = parseFloat(stroke.opacity);","			dashstyle = stroke.dashstyle || \"none\";","			stroke.color = stroke.color || \"#000000\";","			stroke.weight = stroke.weight || 1;","			stroke.opacity = IS_NUM(strokeOpacity) ? strokeOpacity : 1;","			props.stroked = true;","			props.color = stroke.color;","			props.weight = stroke.weight;","			props.endcap = linecap;","			props.opacity = stroke.opacity;","			if(IS_ARRAY(dashstyle))","			{","				dash = [];","				len = dashstyle.length;","				for(i = 0; i < len; ++i)","				{","					val = dashstyle[i];","					dash[i] = val / stroke.weight;","				}","			}","			if(linejoin == \"round\" || linejoin == \"bevel\")","			{","				props.joinstyle = linejoin;","			}","			else","			{","				linejoin = parseInt(linejoin, 10);","				if(IS_NUM(linejoin))","				{","					props.miterlimit = Math.max(linejoin, 1);","					props.joinstyle = \"miter\";","				}","			}","			props.dashstyle = dash;","		}","		return props;","	 },","","	/**","	 * Adds a stroke to the shape node.","	 *","	 * @method _strokeChangeHandler","	 * @private","	 */","	_strokeChangeHandler: function(e)","	{","        if(!this._strokeFlag)","        {","            return;","        }","		var node = this.node,","			stroke = this.get(\"stroke\"),","			strokeOpacity,","			dashstyle,","			dash = \"\",","			val,","			i = 0,","			len,","			linecap,","			linejoin;","		if(stroke && stroke.weight && stroke.weight > 0)","		{","			linecap = stroke.linecap || \"flat\";","			linejoin = stroke.linejoin || \"round\";","			if(linecap != \"round\" && linecap != \"square\")","			{","				linecap = \"flat\";","			}","			strokeOpacity = parseFloat(stroke.opacity);","			dashstyle = stroke.dashstyle || \"none\";","			stroke.color = stroke.color || \"#000000\";","			stroke.weight = stroke.weight || 1;","			stroke.opacity = IS_NUM(strokeOpacity) ? strokeOpacity : 1;","			node.stroked = true;","			node.strokeColor = stroke.color;","			node.strokeWeight = stroke.weight + \"px\";","			if(!this._strokeNode)","			{","				this._strokeNode = this._createGraphicNode(\"stroke\");","				node.appendChild(this._strokeNode);","			}","			this._strokeNode.endcap = linecap;","			this._strokeNode.opacity = stroke.opacity;","			if(IS_ARRAY(dashstyle))","			{","				dash = [];","				len = dashstyle.length;","				for(i = 0; i < len; ++i)","				{","					val = dashstyle[i];","					dash[i] = val / stroke.weight;","				}","			}","			if(linejoin == \"round\" || linejoin == \"bevel\")","			{","				this._strokeNode.joinstyle = linejoin;","			}","			else","			{","				linejoin = parseInt(linejoin, 10);","				if(IS_NUM(linejoin))","				{","					this._strokeNode.miterlimit = Math.max(linejoin, 1);","					this._strokeNode.joinstyle = \"miter\";","				}","			}","			this._strokeNode.dashstyle = dash;","            this._strokeNode.on = true;","		}","		else","		{","            if(this._strokeNode)","            {","                this._strokeNode.on = false;","            }","			node.stroked = false;","		}","        this._strokeFlag = false;","	},","","	/**","     * Calculates and returns properties for setting an initial fill.","     *","     * @method _getFillProps","     * @return Object","     *","	 * @private","	 */","	_getFillProps: function()","	{","		var fill = this.get(\"fill\"),","			fillOpacity,","			props,","			gradient,","			i,","			fillstring,","			filled = false;","		if(fill)","		{","			props = {};","			","			if(fill.type == \"radial\" || fill.type == \"linear\")","			{","				fillOpacity = parseFloat(fill.opacity);","				fillOpacity = IS_NUM(fillOpacity) ? fillOpacity : 1;","				filled = true;","				gradient = this._getGradientFill(fill);","				fillstring = '<fill xmlns=\"urn:schemas-microsft.com:vml\" class=\"vmlfill\" style=\"behavior:url(#default#VML);display:inline-block;\" opacity=\"' + fillOpacity + '\"';","				for(i in gradient)","				{","					if(gradient.hasOwnProperty(i))","					{","						fillstring += ' ' + i + '=\"' + gradient[i] + '\"';","					}","				}","				fillstring += ' />';","				props.node = fillstring;","			}","			else if(fill.color)","			{","				fillOpacity = parseFloat(fill.opacity);","				filled = true;","                props.color = fill.color;","				if(IS_NUM(fillOpacity))","				{","					fillOpacity = Math.max(Math.min(fillOpacity, 1), 0);","                    props.opacity = fillOpacity;    ","				    if(fillOpacity < 1)","                    {","                        props.node = '<fill xmlns=\"urn:schemas-microsft.com:vml\" class=\"vmlfill\" style=\"behavior:url(#default#VML);display:inline-block;\" type=\"solid\" opacity=\"' + fillOpacity + '\"/>';","				    }","                }","			}","			props.filled = filled;","		}","		return props;","	},","","	/**","	 * Adds a fill to the shape node.","	 *","	 * @method _fillChangeHandler","	 * @private","	 */","	_fillChangeHandler: function(e)","	{","        if(!this._fillFlag)","        {","            return;","        }","		var node = this.node,","			fill = this.get(\"fill\"),","			fillOpacity,","			fillstring,","			filled = false,","            i,","            gradient;","		if(fill)","		{","			if(fill.type == \"radial\" || fill.type == \"linear\")","			{","				filled = true;","				gradient = this._getGradientFill(fill);","                if(this._fillNode)","                {","                    for(i in gradient)","                    {","                        if(gradient.hasOwnProperty(i))","                        {","                            if(i == \"colors\")","                            {","                                this._fillNode.colors.value = gradient[i];","                            }","                            else","                            {","                                this._fillNode[i] = gradient[i];","                            }","                        }","                    }","                }","                else","                {","                    fillstring = '<fill xmlns=\"urn:schemas-microsft.com:vml\" class=\"vmlfill\" style=\"behavior:url(#default#VML);display:inline-block;\"';","                    for(i in gradient)","                    {","                        if(gradient.hasOwnProperty(i))","                        {","                            fillstring += ' ' + i + '=\"' + gradient[i] + '\"';","                        }","                    }","                    fillstring += ' />';","                    this._fillNode = DOCUMENT.createElement(fillstring);","                    node.appendChild(this._fillNode);","                }","			}","			else if(fill.color)","			{","                node.fillcolor = fill.color;","				fillOpacity = parseFloat(fill.opacity);","				filled = true;","				if(IS_NUM(fillOpacity) && fillOpacity < 1)","				{","					fill.opacity = fillOpacity;","                    if(this._fillNode)","					{","                        if(this._fillNode.getAttribute(\"type\") != \"solid\")","                        {","                            this._fillNode.type = \"solid\";","                        }","						this._fillNode.opacity = fillOpacity;","					}","					else","					{     ","                        fillstring = '<fill xmlns=\"urn:schemas-microsft.com:vml\" class=\"vmlfill\" style=\"behavior:url(#default#VML);display:inline-block;\" type=\"solid\" opacity=\"' + fillOpacity + '\"/>';","                        this._fillNode = DOCUMENT.createElement(fillstring);","                        node.appendChild(this._fillNode);","					}","				}","				else if(this._fillNode)","                {   ","                    this._fillNode.opacity = 1;","                    this._fillNode.type = \"solid\";","				}","			}","		}","		node.filled = filled;","        this._fillFlag = false;","	},","","	//not used. remove next release.","    _updateFillNode: function(node)","	{","		if(!this._fillNode)","		{","			this._fillNode = this._createGraphicNode(\"fill\");","			node.appendChild(this._fillNode);","		}","	},","","    /**","     * Calculates and returns an object containing gradient properties for a fill node. ","     *","     * @method _getGradientFill","     * @param {Object} fill Object containing fill properties.","     * @return Object","     * @private","     */","	_getGradientFill: function(fill)","	{","		var gradientProps = {},","			gradientBoxWidth,","			gradientBoxHeight,","			type = fill.type,","			w = this.get(\"width\"),","			h = this.get(\"height\"),","			isNumber = IS_NUM,","			stop,","			stops = fill.stops,","			len = stops.length,","			opacity,","			color,","			i = 0,","			oi,","			colorstring = \"\",","			cx = fill.cx,","			cy = fill.cy,","			fx = fill.fx,","			fy = fill.fy,","			r = fill.r,","            pct,","			rotation = fill.rotation || 0;","		if(type === \"linear\")","		{","            if(rotation <= 270)","            {","                rotation = Math.abs(rotation - 270);","            }","			else if(rotation < 360)","            {","                rotation = 270 + (360 - rotation);","            }","            else","            {","                rotation = 270;","            }","            gradientProps.type = \"gradient\";//\"gradientunscaled\";","			gradientProps.angle = rotation;","		}","		else if(type === \"radial\")","		{","			gradientBoxWidth = w * (r * 2);","			gradientBoxHeight = h * (r * 2);","			fx = r * 2 * (fx - 0.5);","			fy = r * 2 * (fy - 0.5);","			fx += cx;","			fy += cy;","			gradientProps.focussize = (gradientBoxWidth/w)/10 + \"% \" + (gradientBoxHeight/h)/10 + \"%\";","			gradientProps.alignshape = false;","			gradientProps.type = \"gradientradial\";","			gradientProps.focus = \"100%\";","			gradientProps.focusposition = Math.round(fx * 100) + \"% \" + Math.round(fy * 100) + \"%\";","		}","		for(;i < len; ++i) {","			stop = stops[i];","			color = stop.color;","			opacity = stop.opacity;","			opacity = isNumber(opacity) ? opacity : 1;","			pct = stop.offset || i/(len-1);","			pct *= (r * 2);","            pct = Math.round(100 * pct) + \"%\";","            oi = i > 0 ? i + 1 : \"\";","            gradientProps[\"opacity\" + oi] = opacity + \"\";","            colorstring += \", \" + pct + \" \" + color;","		}","		if(parseFloat(pct) < 100)","		{","			colorstring += \", 100% \" + color;","		}","		gradientProps.colors = colorstring.substr(2);","		return gradientProps;","	},","","    /**","     * Adds a transform to the shape.","     *","     * @method _addTransform","     * @param {String} type The transform being applied.","     * @param {Array} args The arguments for the transform.","	 * @private","	 */","	_addTransform: function(type, args)","	{","        args = Y.Array(args);","        this._transform = Y_LANG.trim(this._transform + \" \" + type + \"(\" + args.join(\", \") + \")\");","        args.unshift(type);","        this._transforms.push(args);","        if(this.initialized)","        {","            this._updateTransform();","        }","	},","	","	/**","     * Applies all transforms.","     *","     * @method _updateTransform","	 * @private","	 */","	_updateTransform: function()","	{","		var node = this.node,","            key,","			transform,","			transformOrigin,","            x = this.get(\"x\"),","            y = this.get(\"y\"),","            tx,","            ty,","            matrix = this.matrix,","            normalizedMatrix = this._normalizedMatrix,","            isPathShape = this instanceof Y.VMLPath,","            i = 0,","            len = this._transforms.length;","        if(this._transforms && this._transforms.length > 0)","		{","            transformOrigin = this.get(\"transformOrigin\");","       ","            if(isPathShape)","            {","                normalizedMatrix.translate(this._left, this._top);","            }","            //vml skew matrix transformOrigin ranges from -0.5 to 0.5.","            //subtract 0.5 from values","            tx = transformOrigin[0] - 0.5;","            ty = transformOrigin[1] - 0.5;","            ","            //ensure the values are within the appropriate range to avoid errors","            tx = Math.max(-0.5, Math.min(0.5, tx));","            ty = Math.max(-0.5, Math.min(0.5, ty));","            for(; i < len; ++i)","            {","                key = this._transforms[i].shift();","                if(key)","                {","                    normalizedMatrix[key].apply(normalizedMatrix, this._transforms[i]); ","                    matrix[key].apply(matrix, this._transforms[i]); ","                }","			}","            if(isPathShape)","            {","                normalizedMatrix.translate(-this._left, -this._top);","            }","            transform = normalizedMatrix.a + \",\" + ","                        normalizedMatrix.c + \",\" + ","                        normalizedMatrix.b + \",\" + ","                        normalizedMatrix.d + \",\" + ","                        0 + \",\" +","                        0;","		}","        this._graphic.addToRedrawQueue(this);    ","        if(transform)","        {","            if(!this._skew)","            {","                this._skew = DOCUMENT.createElement( '<skew class=\"vmlskew\" xmlns=\"urn:schemas-microsft.com:vml\" on=\"false\" style=\"behavior:url(#default#VML);display:inline-block;\" />');","                this.node.appendChild(this._skew); ","            }","            this._skew.matrix = transform;","            this._skew.on = true;","            //this._skew.offset = this._getSkewOffsetValue(normalizedMatrix.dx) + \"px, \" + this._getSkewOffsetValue(normalizedMatrix.dy) + \"px\";","            this._skew.origin = tx + \", \" + ty;","        }","        if(this._type != \"path\")","        {","            this._transforms = [];","        }","        //add the translate to the x and y coordinates","        node.style.left = (x + this._getSkewOffsetValue(normalizedMatrix.dx)) + \"px\";","        node.style.top =  (y + this._getSkewOffsetValue(normalizedMatrix.dy)) + \"px\";","    },","    ","    /**","     * Normalizes the skew offset values between -32767 and 32767.","     *","     * @method _getSkewOffsetValue","     * @param {Number} val The value to normalize","     * @return Number","     * @private","     */","    _getSkewOffsetValue: function(val)","    {","        var sign = Y.MatrixUtil.sign(val),","            absVal = Math.abs(val);","        val = Math.min(absVal, 32767) * sign;","        return val;","    },","	","	/**","	 * Storage for translateX","	 *","     * @property _translateX","     * @type Number","	 * @private","	 */","	_translateX: 0,","","	/**","	 * Storage for translateY","	 *","     * @property _translateY","     * @type Number","	 * @private","	 */","	_translateY: 0,","    ","    /**","     * Storage for the transform attribute.","     *","     * @property _transform","     * @type String","     * @private","     */","    _transform: \"\",","	","    /**","	 * Specifies a 2d translation.","	 *","	 * @method translate","	 * @param {Number} x The value to translate on the x-axis.","	 * @param {Number} y The value to translate on the y-axis.","	 */","	translate: function(x, y)","	{","		this._translateX += x;","		this._translateY += y;","		this._addTransform(\"translate\", arguments);","	},","","	/**","	 * Translates the shape along the x-axis. When translating x and y coordinates,","	 * use the `translate` method.","	 *","	 * @method translateX","	 * @param {Number} x The value to translate.","	 */","	translateX: function(x)","    {","        this._translateX += x;","        this._addTransform(\"translateX\", arguments);","    },","","	/**","	 * Performs a translate on the y-coordinate. When translating x and y coordinates,","	 * use the `translate` method.","	 *","	 * @method translateY","	 * @param {Number} y The value to translate.","	 */","	translateY: function(y)","    {","        this._translateY += y;","        this._addTransform(\"translateY\", arguments);","    },","","    /**","     * Skews the shape around the x-axis and y-axis.","     *","     * @method skew","     * @param {Number} x The value to skew on the x-axis.","     * @param {Number} y The value to skew on the y-axis.","     */","    skew: function(x, y)","    {","        this._addTransform(\"skew\", arguments);","    },","","	/**","	 * Skews the shape around the x-axis.","	 *","	 * @method skewX","	 * @param {Number} x x-coordinate","	 */","	 skewX: function(x)","	 {","		this._addTransform(\"skewX\", arguments);","	 },","","	/**","	 * Skews the shape around the y-axis.","	 *","	 * @method skewY","	 * @param {Number} y y-coordinate","	 */","	 skewY: function(y)","	 {","		this._addTransform(\"skewY\", arguments);","	 },","","	/**","	 * Rotates the shape clockwise around it transformOrigin.","	 *","	 * @method rotate","	 * @param {Number} deg The degree of the rotation.","	 */","	 rotate: function(deg)","	 {","		this._addTransform(\"rotate\", arguments);","	 },","","	/**","	 * Specifies a 2d scaling operation.","	 *","	 * @method scale","	 * @param {Number} val","	 */","	scale: function(x, y)","	{","		this._addTransform(\"scale\", arguments);","	},","","	/**","     * Overrides default `on` method. Checks to see if its a dom interaction event. If so, ","     * return an event attached to the `node` element. If not, return the normal functionality.","     *","     * @method on","     * @param {String} type event type","     * @param {Object} callback function","	 * @private","	 */","	on: function(type, fn)","	{","		if(Y.Node.DOM_EVENTS[type])","		{","			return Y.one(\"#\" +  this.get(\"id\")).on(type, fn);","		}","		return Y.on.apply(this, arguments);","	},","","	/**","	 * Draws the shape.","	 *","	 * @method _draw","	 * @private","	 */","	_draw: function()","	{","	},","","	/**","     * Updates `Shape` based on attribute changes.","     *","     * @method _updateHandler","	 * @private","	 */","	_updateHandler: function(e)","	{","		var host = this,","            node = host.node;","        host._fillChangeHandler();","        host._strokeChangeHandler();","        node.style.width = this.get(\"width\") + \"px\";","        node.style.height = this.get(\"height\") + \"px\"; ","        this._draw();","		host._updateTransform();","	},","","	/**","	 * Creates a graphic node","	 *","	 * @method _createGraphicNode","	 * @param {String} type node type to create","	 * @return HTMLElement","	 * @private","	 */","	_createGraphicNode: function(type)","	{","		type = type || this._type;","		return DOCUMENT.createElement('<' + type + ' xmlns=\"urn:schemas-microsft.com:vml\" style=\"behavior:url(#default#VML);display:inline-block;\" class=\"vml' + type + '\"/>');","	},","","	/**","	 * Value function for fill attribute","	 *","	 * @private","	 * @method _getDefaultFill","	 * @return Object","	 */","	_getDefaultFill: function() {","		return {","			type: \"solid\",","			cx: 0.5,","			cy: 0.5,","			fx: 0.5,","			fy: 0.5,","			r: 0.5","		};","	},","","	/**","	 * Value function for stroke attribute","	 *","	 * @private","	 * @method _getDefaultStroke","	 * @return Object","	 */","	_getDefaultStroke: function() ","	{","		return {","			weight: 1,","			dashstyle: \"none\",","			color: \"#000\",","			opacity: 1.0","		};","	},","","    /**","     * Sets the value of an attribute.","     *","     * @method set","     * @param {String|Object} name The name of the attribute. Alternatively, an object of key value pairs can ","     * be passed in to set multiple attributes at once.","     * @param {Any} value The value to set the attribute to. This value is ignored if an object is received as ","     * the name param.","     */","	set: function() ","	{","		var host = this;","		AttributeLite.prototype.set.apply(host, arguments);","		if(host.initialized)","		{","			host._updateHandler();","		}","	},","","	/**","	 * Returns the bounds for a shape.","	 *","     * Calculates the a new bounding box from the original corner coordinates (base on size and position) and the transform matrix.","     * The calculated bounding box is used by the graphic instance to calculate its viewBox. ","     *","	 * @method getBounds","	 * @return Object","	 */","	getBounds: function()","	{","		var isPathShape = this instanceof Y.VMLPath,","			w = this.get(\"width\"),","			h = this.get(\"height\"),","            x = this.get(\"x\"),","            y = this.get(\"y\");","        if(isPathShape)","        {","            x = x + this._left;","            y = y + this._top;","            w = this._right - this._left;","            h = this._bottom - this._top;","        }","        return this._getContentRect(w, h, x, y);","	},","","    /**","     * Calculates the bounding box for the shape.","     *","     * @method _getContentRect","     * @param {Number} w width of the shape","     * @param {Number} h height of the shape","     * @param {Number} x x-coordinate of the shape","     * @param {Number} y y-coordinate of the shape","     * @private","     */","    _getContentRect: function(w, h, x, y)","    {","        var transformOrigin = this.get(\"transformOrigin\"),","            transformX = transformOrigin[0] * w,","            transformY = transformOrigin[1] * h,","		    transforms = this.matrix.getTransformArray(this.get(\"transform\")),","            matrix = new Y.Matrix(),","            i = 0,","            len = transforms.length,","            transform,","            key,","            contentRect,","            isPathShape = this instanceof Y.VMLPath;","        if(isPathShape)","        {","            matrix.translate(this._left, this._top);","        }","        transformX = !isNaN(transformX) ? transformX : 0;","        transformY = !isNaN(transformY) ? transformY : 0;","        matrix.translate(transformX, transformY);","        for(; i < len; i = i + 1)","        {","            transform = transforms[i];","            key = transform.shift();","            if(key)","            {","                matrix[key].apply(matrix, transform); ","            }","        }","        matrix.translate(-transformX, -transformY);","        if(isPathShape)","        {","            matrix.translate(-this._left, -this._top);","        }","        contentRect = matrix.getContentRect(w, h, x, y);","        return contentRect;","    },","","    /**","     * Places the shape above all other shapes.","     *","     * @method toFront","     */","    toFront: function()","    {","        var graphic = this.get(\"graphic\");","        if(graphic)","        {","            graphic._toFront(this);","        }","    },","","    /**","     * Places the shape underneath all other shapes.","     *","     * @method toFront","     */","    toBack: function()","    {","        var graphic = this.get(\"graphic\");","        if(graphic)","        {","            graphic._toBack(this);","        }","    },","","    /**","     * Parses path data string and call mapped methods.","     *","     * @method _parsePathData","     * @param {String} val The path data","     * @private","     */","    _parsePathData: function(val)","    {","        var method,","            methodSymbol,","            args,","            commandArray = Y.Lang.trim(val.match(SPLITPATHPATTERN)),","            i = 0,","            len, ","            str,","            symbolToMethod = this._pathSymbolToMethod;","        if(commandArray)","        {","            this.clear();","            len = commandArray.length || 0;","            for(; i < len; i = i + 1)","            {","                str = commandArray[i];","                methodSymbol = str.substr(0, 1),","                args = str.substr(1).match(SPLITARGSPATTERN);","                method = symbolToMethod[methodSymbol];","                if(method)","                {","                    if(args)","                    {","                        this[method].apply(this, args);","                    }","                    else","                    {","                        this[method].apply(this);","                    }","                }","            }","            this.end();","        }","    },","	","    /**","     *  Destroys shape","     *","     *  @method destroy","     */","    destroy: function()","    {","        var graphic = this.get(\"graphic\");","        if(graphic)","        {","            graphic.removeShape(this);","        }","        else","        {","            this._destroy();","        }","    },","","    /**","     *  Implementation for shape destruction","     *","     *  @method destroy","     *  @protected","     */","    _destroy: function()","    {","        if(this.node)","        {   ","            if(this._fillNode)","            {","                this.node.removeChild(this._fillNode);","                this._fillNode = null;","            }","            if(this._strokeNode)","            {","                this.node.removeChild(this._strokeNode);","                this._strokeNode = null;","            }","            Y.one(this.node).remove(true);","        }","    }","}, Y.VMLDrawing.prototype));","","VMLShape.ATTRS = {","	/**","	 * An array of x, y values which indicates the transformOrigin in which to rotate the shape. Valid values range between 0 and 1 representing a ","	 * fraction of the shape's corresponding bounding box dimension. The default value is [0.5, 0.5].","	 *","	 * @config transformOrigin","	 * @type Array","	 */","	transformOrigin: {","		valueFn: function()","		{","			return [0.5, 0.5];","		}","	},","	","    /**","     * <p>A string containing, in order, transform operations applied to the shape instance. The `transform` string can contain the following values:","     *     ","     *    <dl>","     *        <dt>rotate</dt><dd>Rotates the shape clockwise around it transformOrigin.</dd>","     *        <dt>translate</dt><dd>Specifies a 2d translation.</dd>","     *        <dt>skew</dt><dd>Skews the shape around the x-axis and y-axis.</dd>","     *        <dt>scale</dt><dd>Specifies a 2d scaling operation.</dd>","     *        <dt>translateX</dt><dd>Translates the shape along the x-axis.</dd>","     *        <dt>translateY</dt><dd>Translates the shape along the y-axis.</dd>","     *        <dt>skewX</dt><dd>Skews the shape around the x-axis.</dd>","     *        <dt>skewY</dt><dd>Skews the shape around the y-axis.</dd>","     *        <dt>matrix</dt><dd>Specifies a 2D transformation matrix comprised of the specified six values.</dd>      ","     *    </dl>","     * </p>","     * <p>Applying transforms through the transform attribute will reset the transform matrix and apply a new transform. The shape class also contains corresponding methods for each transform","     * that will apply the transform to the current matrix. The below code illustrates how you might use the `transform` attribute to instantiate a recangle with a rotation of 45 degrees.</p>","            var myRect = new Y.Rect({","                type:\"rect\",","                width: 50,","                height: 40,","                transform: \"rotate(45)\"","            };","     * <p>The code below would apply `translate` and `rotate` to an existing shape.</p>","    ","        myRect.set(\"transform\", \"translate(40, 50) rotate(45)\");","	 * @config transform","     * @type String  ","	 */","	transform: {","		setter: function(val)","		{","            var i = 0,","                len,","                transform;","            this.matrix.init();	","            this._normalizedMatrix.init();	","            this._transforms = this.matrix.getTransformArray(val);","            len = this._transforms.length;","            for(;i < len; ++i)","            {","                transform = this._transforms[i];","            }","            this._transform = val;","            return val;","		},","","        getter: function()","        {","            return this._transform;","        }","	},","","	/**","	 * Indicates the x position of shape.","	 *","	 * @config x","	 * @type Number","	 */","	x: {","		value: 0","	},","","	/**","	 * Indicates the y position of shape.","	 *","	 * @config y","	 * @type Number","	 */","	y: {","		value: 0","	},","","	/**","	 * Unique id for class instance.","	 *","	 * @config id","	 * @type String","	 */","	id: {","		valueFn: function()","		{","			return Y.guid();","		},","","		setter: function(val)","		{","			var node = this.node;","			if(node)","			{","				node.setAttribute(\"id\", val);","			}","			return val;","		}","	},","	","	/**","	 * ","	 * @config width","	 */","	width: {","		value: 0","	},","","	/**","	 * ","	 * @config height","	 */","	height: {","		value: 0","	},","","	/**","	 * Indicates whether the shape is visible.","	 *","	 * @config visible","	 * @type Boolean","	 */","	visible: {","		value: true,","","		setter: function(val){","			var node = this.node,","				visibility = val ? \"visible\" : \"hidden\";","			if(node)","			{","				node.style.visibility = visibility;","			}","			return val;","		}","	},","","	/**","	 * Contains information about the fill of the shape. ","     *  <dl>","     *      <dt>color</dt><dd>The color of the fill.</dd>","     *      <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the fill. The default value is 1.</dd>","     *      <dt>type</dt><dd>Type of fill.","     *          <dl>","     *              <dt>solid</dt><dd>Solid single color fill. (default)</dd>","     *              <dt>linear</dt><dd>Linear gradient fill.</dd>","     *              <dt>radial</dt><dd>Radial gradient fill.</dd>","     *          </dl>","     *      </dd>","     *  </dl>","     *  <p>If a `linear` or `radial` is specified as the fill type. The following additional property is used:","     *  <dl>","     *      <dt>stops</dt><dd>An array of objects containing the following properties:","     *          <dl>","     *              <dt>color</dt><dd>The color of the stop.</dd>","     *              <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the stop. The default value is 1. Note: No effect for IE 6 - 8</dd>","     *              <dt>offset</dt><dd>Number between 0 and 1 indicating where the color stop is positioned.</dd> ","     *          </dl>","     *      </dd>","     *      <p>Linear gradients also have the following property:</p>","     *      <dt>rotation</dt><dd>Linear gradients flow left to right by default. The rotation property allows you to change the flow by rotation. (e.g. A rotation of 180 would make the gradient pain from right to left.)</dd>","     *      <p>Radial gradients have the following additional properties:</p>","     *      <dt>r</dt><dd>Radius of the gradient circle.</dd>","     *      <dt>fx</dt><dd>Focal point x-coordinate of the gradient.</dd>","     *      <dt>fy</dt><dd>Focal point y-coordinate of the gradient.</dd>","     *  </dl>","     *  <p>The corresponding `SVGShape` class implements the following additional properties.</p>","     *  <dl>","     *      <dt>cx</dt><dd>","     *          <p>The x-coordinate of the center of the gradient circle. Determines where the color stop begins. The default value 0.5.</p>","     *      </dd>","     *      <dt>cy</dt><dd>","     *          <p>The y-coordinate of the center of the gradient circle. Determines where the color stop begins. The default value 0.5.</p>","     *      </dd>","     *  </dl>","     *  <p>These properties are not currently implemented in `CanvasShape` or `VMLShape`.</p> ","	 *","	 * @config fill","	 * @type Object ","	 */","	fill: {","		valueFn: \"_getDefaultFill\",","		","		setter: function(val)","		{","			var i,","				fill,","				tmpl = this.get(\"fill\") || this._getDefaultFill();","			","			if(val)","			{","				//ensure, fill type is solid if color is explicitly passed.","				if(val.hasOwnProperty(\"color\"))","				{","					val.type = \"solid\";","				}","				for(i in val)","				{","					if(val.hasOwnProperty(i))","					{   ","						tmpl[i] = val[i];","					}","				}","			}","			fill = tmpl;","			if(fill && fill.color)","			{","				if(fill.color === undefined || fill.color == \"none\")","				{","					fill.color = null;","				}","			}","			this._fillFlag = true;","            return fill;","		}","	},","","	/**","	 * Contains information about the stroke of the shape.","     *  <dl>","     *      <dt>color</dt><dd>The color of the stroke.</dd>","     *      <dt>weight</dt><dd>Number that indicates the width of the stroke.</dd>","     *      <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the stroke. The default value is 1.</dd>","     *      <dt>dashstyle</dt>Indicates whether to draw a dashed stroke. When set to \"none\", a solid stroke is drawn. When set to an array, the first index indicates the","     *  length of the dash. The second index indicates the length of gap.","     *      <dt>linecap</dt><dd>Specifies the linecap for the stroke. The following values can be specified:","     *          <dl>","     *              <dt>butt (default)</dt><dd>Specifies a butt linecap.</dd>","     *              <dt>square</dt><dd>Specifies a sqare linecap.</dd>","     *              <dt>round</dt><dd>Specifies a round linecap.</dd>","     *          </dl>","     *      </dd>","     *      <dt>linejoin</dt><dd>Specifies a linejoin for the stroke. The following values can be specified:","     *          <dl>","     *              <dt>round (default)</dt><dd>Specifies that the linejoin will be round.</dd>","     *              <dt>bevel</dt><dd>Specifies a bevel for the linejoin.</dd>","     *              <dt>miter limit</dt><dd>An integer specifying the miter limit of a miter linejoin. If you want to specify a linejoin of miter, you simply specify the limit as opposed to having","     *  separate miter and miter limit values.</dd>","     *          </dl>","     *      </dd>","     *  </dl>","	 *","	 * @config stroke","	 * @type Object","	 */","	stroke: {","		valueFn: \"_getDefaultStroke\",","		","		setter: function(val)","		{","			var i,","				stroke,","                wt,","				tmpl = this.get(\"stroke\") || this._getDefaultStroke();","			if(val)","			{","                if(val.hasOwnProperty(\"weight\"))","                {","                    wt = parseInt(val.weight, 10);","                    if(!isNaN(wt))","                    {","                        val.weight = wt;","                    }","                }","				for(i in val)","				{","					if(val.hasOwnProperty(i))","					{   ","						tmpl[i] = val[i];","					}","				}","			}","			stroke = tmpl;","            this._strokeFlag = true;","			return stroke;","		}","	},","	","	//Not used. Remove in future.","    autoSize: {","		value: false","	},","","	// Only implemented in SVG","	// Determines whether the instance will receive mouse events.","	// ","	// @config pointerEvents","	// @type string","	//","	pointerEvents: {","		value: \"visiblePainted\"","	},","","	/**","	 * Dom node for the shape.","	 *","	 * @config node","	 * @type HTMLElement","	 * @readOnly","	 */","	node: {","		readOnly: true,","","		getter: function()","		{","			return this.node;","		}","	},","","    /**","     * Represents an SVG Path string.","     *","     * @config data","     * @type String","     */","    data: {","        setter: function(val)","        {","            if(this.get(\"node\"))","            {","                this._parsePathData(val);","            }","            return val;","        }","    },","","	/**","	 * Reference to the container Graphic.","	 *","	 * @config graphic","	 * @type Graphic","	 */","	graphic: {","		readOnly: true,","","		getter: function()","		{","			return this._graphic;","		}","	}","};","Y.VMLShape = VMLShape;","/**"," * <a href=\"http://www.w3.org/TR/NOTE-VML\">VML</a> implementation of the <a href=\"Path.html\">`Path`</a> class. "," * `VMLPath` is not intended to be used directly. Instead, use the <a href=\"Path.html\">`Path`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> and <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> "," * capabilities, the <a href=\"Path.html\">`Path`</a> class will point to the `VMLPath` class."," *"," * @module graphics"," * @class VMLPath"," * @extends VMLShape"," */","VMLPath = function()","{","	VMLPath.superclass.constructor.apply(this, arguments);","};","","VMLPath.NAME = \"path\";","Y.extend(VMLPath, Y.VMLShape);","VMLPath.ATTRS = Y.merge(Y.VMLShape.ATTRS, {","	/**","	 * Indicates the width of the shape","	 * ","	 * @config width","	 * @type Number","	 */","	width: {","		getter: function()","		{","			var val = Math.max(this._right - this._left, 0);","			return val;","		}","	},","","	/**","	 * Indicates the height of the shape","	 * ","	 * @config height","	 * @type Number","	 */","	height: {","		getter: function()","		{","			return Math.max(this._bottom - this._top, 0);","		}","	},","	","	/**","	 * Indicates the path used for the node.","	 *","	 * @config path","	 * @type String","     * @readOnly","	 */","	path: {","		readOnly: true,","","		getter: function()","		{","			return this._path;","		}","	}","});","Y.VMLPath = VMLPath;","/**"," * <a href=\"http://www.w3.org/TR/NOTE-VML\">VML</a> implementation of the <a href=\"Rect.html\">`Rect`</a> class. "," * `VMLRect` is not intended to be used directly. Instead, use the <a href=\"Rect.html\">`Rect`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> and <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> "," * capabilities, the <a href=\"Rect.html\">`Rect`</a> class will point to the `VMLRect` class."," *"," * @module graphics"," * @class VMLRect"," * @constructor"," */","VMLRect = function()","{","	VMLRect.superclass.constructor.apply(this, arguments);","};","VMLRect.NAME = \"rect\"; ","Y.extend(VMLRect, Y.VMLShape, {","	/**","	 * Indicates the type of shape","	 *","	 * @property _type","	 * @type String","     * @private","	 */","	_type: \"rect\"","});","VMLRect.ATTRS = Y.VMLShape.ATTRS;","Y.VMLRect = VMLRect;","/**"," * <a href=\"http://www.w3.org/TR/NOTE-VML\">VML</a> implementation of the <a href=\"Ellipse.html\">`Ellipse`</a> class. "," * `VMLEllipse` is not intended to be used directly. Instead, use the <a href=\"Ellipse.html\">`Ellipse`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> and <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> "," * capabilities, the <a href=\"Ellipse.html\">`Ellipse`</a> class will point to the `VMLEllipse` class."," *"," * @module graphics"," * @class VMLEllipse"," * @constructor"," */","VMLEllipse = function()","{","	VMLEllipse.superclass.constructor.apply(this, arguments);","};","","VMLEllipse.NAME = \"ellipse\";","","Y.extend(VMLEllipse, Y.VMLShape, {","	/**","	 * Indicates the type of shape","	 *","	 * @property _type","	 * @type String","     * @private","	 */","	_type: \"oval\"","});","VMLEllipse.ATTRS = Y.merge(Y.VMLShape.ATTRS, {","	/**","	 * Horizontal radius for the ellipse. ","	 *","	 * @config xRadius","	 * @type Number","	 */","	xRadius: {","		lazyAdd: false,","","		getter: function()","		{","			var val = this.get(\"width\");","			val = Math.round((val/2) * 100)/100;","			return val;","		},","		","		setter: function(val)","		{","			var w = val * 2; ","			this.set(\"width\", w);","			return val;","		}","	},","","	/**","	 * Vertical radius for the ellipse. ","	 *","	 * @config yRadius","	 * @type Number","	 * @readOnly","	 */","	yRadius: {","		lazyAdd: false,","		","		getter: function()","		{","			var val = this.get(\"height\");","			val = Math.round((val/2) * 100)/100;","			return val;","		},","","		setter: function(val)","		{","			var h = val * 2;","			this.set(\"height\", h);","			return val;","		}","	}","});","Y.VMLEllipse = VMLEllipse;","/**"," * <a href=\"http://www.w3.org/TR/NOTE-VML\">VML</a> implementation of the <a href=\"Circle.html\">`Circle`</a> class. "," * `VMLCircle` is not intended to be used directly. Instead, use the <a href=\"Circle.html\">`Circle`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> and <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> "," * capabilities, the <a href=\"Circle.html\">`Circle`</a> class will point to the `VMLCircle` class."," *"," * @module graphics"," * @class VMLCircle"," * @constructor"," */","VMLCircle = function(cfg)","{","	VMLCircle.superclass.constructor.apply(this, arguments);","};","","VMLCircle.NAME = \"circle\";","","Y.extend(VMLCircle, VMLShape, {","	/**","	 * Indicates the type of shape","	 *","	 * @property _type","	 * @type String","     * @private","	 */","	_type: \"oval\"","});","","VMLCircle.ATTRS = Y.merge(VMLShape.ATTRS, {","	/**","	 * Radius for the circle.","	 *","	 * @config radius","	 * @type Number","	 */","	radius: {","		lazyAdd: false,","","		value: 0","	},","","	/**","	 * Indicates the width of the shape","	 *","	 * @config width","	 * @type Number","	 */","	width: {","        setter: function(val)","        {","            this.set(\"radius\", val/2);","            return val;","        },","","		getter: function()","		{   ","			var radius = this.get(\"radius\"),","			val = radius && radius > 0 ? radius * 2 : 0;","			return val;","		}","	},","","	/**","	 * Indicates the height of the shape","	 *","	 * @config height","	 * @type Number","	 */","	height: {","        setter: function(val)","        {","            this.set(\"radius\", val/2);","            return val;","        },","","		getter: function()","		{   ","			var radius = this.get(\"radius\"),","			val = radius && radius > 0 ? radius * 2 : 0;","			return val;","		}","	}","});","Y.VMLCircle = VMLCircle;","/**"," * Draws pie slices"," *"," * @module graphics"," * @class VMLPieSlice"," * @constructor"," */","VMLPieSlice = function()","{","	VMLPieSlice.superclass.constructor.apply(this, arguments);","};","VMLPieSlice.NAME = \"vmlPieSlice\";","Y.extend(VMLPieSlice, Y.VMLShape, Y.mix({","    /**","     * Indicates the type of shape","     *","     * @property _type","     * @type String","     * @private","     */","    _type: \"shape\",","","	/**","	 * Change event listener","	 *","	 * @private","	 * @method _updateHandler","	 */","	_draw: function(e)","	{","        var x = this.get(\"cx\"),","            y = this.get(\"cy\"),","            startAngle = this.get(\"startAngle\"),","            arc = this.get(\"arc\"),","            radius = this.get(\"radius\");","        this.clear();","        this.drawWedge(x, y, startAngle, arc, radius);","		this.end();","	}"," }, Y.VMLDrawing.prototype));","VMLPieSlice.ATTRS = Y.mix({","    cx: {","        value: 0","    },","","    cy: {","        value: 0","    },","    /**","     * Starting angle in relation to a circle in which to begin the pie slice drawing.","     *","     * @config startAngle","     * @type Number","     */","    startAngle: {","        value: 0","    },","","    /**","     * Arc of the slice.","     *","     * @config arc","     * @type Number","     */","    arc: {","        value: 0","    },","","    /**","     * Radius of the circle in which the pie slice is drawn","     *","     * @config radius","     * @type Number","     */","    radius: {","        value: 0","    }","}, Y.VMLShape.ATTRS);","Y.VMLPieSlice = VMLPieSlice;","/**"," * <a href=\"http://www.w3.org/TR/NOTE-VML\">VML</a> implementation of the <a href=\"Graphic.html\">`Graphic`</a> class. "," * `VMLGraphic` is not intended to be used directly. Instead, use the <a href=\"Graphic.html\">`Graphic`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> and <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> "," * capabilities, the <a href=\"Graphic.html\">`Graphic`</a> class will point to the `VMLGraphic` class."," *"," * @module graphics"," * @class VMLGraphic"," * @constructor"," */","VMLGraphic = function() {","    VMLGraphic.superclass.constructor.apply(this, arguments);    ","};","","VMLGraphic.NAME = \"vmlGraphic\";","","VMLGraphic.ATTRS = {","    /**","     * Whether or not to render the `Graphic` automatically after to a specified parent node after init. This can be a Node instance or a CSS selector string.","     * ","     * @config render","     * @type Node | String ","     */","    render: {},","	","    /**","	 * Unique id for class instance.","	 *","	 * @config id","	 * @type String","	 */","	id: {","		valueFn: function()","		{","			return Y.guid();","		},","","		setter: function(val)","		{","			var node = this._node;","			if(node)","			{","				node.setAttribute(\"id\", val);","			}","			return val;","		}","	},","","    /**","     * Key value pairs in which a shape instance is associated with its id.","     *","     *  @config shapes","     *  @type Object","     *  @readOnly","     */","    shapes: {","        readOnly: true,","","        getter: function()","        {","            return this._shapes;","        }","    },","","    /**","     *  Object containing size and coordinate data for the content of a Graphic in relation to the coordSpace node.","     *","     *  @config contentBounds","     *  @type Object","     */","    contentBounds: {","        readOnly: true,","","        getter: function()","        {","            return this._contentBounds;","        }","    },","","    /**","     *  The html element that represents to coordinate system of the Graphic instance.","     *","     *  @config node","     *  @type HTMLElement","     */","    node: {","        readOnly: true,","","        getter: function()","        {","            return this._node;","        }","    },","","	/**","	 * Indicates the width of the `Graphic`. ","	 *","	 * @config width","	 * @type Number","	 */","    width: {","        setter: function(val)","        {","            if(this._node)","            {","                this._node.style.width = val + \"px\";","            }","            return val;","        }","    },","","	/**","	 * Indicates the height of the `Graphic`. ","	 *","	 * @config height ","	 * @type Number","	 */","    height: {","        setter: function(val)","        {","            if(this._node)","            {","                this._node.style.height = val + \"px\";","            }","            return val;","        }","    },","","    /**","     *  Determines the sizing of the Graphic. ","     *","     *  <dl>","     *      <dt>sizeContentToGraphic</dt><dd>The Graphic's width and height attributes are, either explicitly set through the <code>width</code> and <code>height</code>","     *      attributes or are determined by the dimensions of the parent element. The content contained in the Graphic will be sized to fit with in the Graphic instance's ","     *      dimensions. When using this setting, the <code>preserveAspectRatio</code> attribute will determine how the contents are sized.</dd>","     *      <dt>sizeGraphicToContent</dt><dd>(Also accepts a value of true) The Graphic's width and height are determined by the size and positioning of the content.</dd>","     *      <dt>false</dt><dd>The Graphic's width and height attributes are, either explicitly set through the <code>width</code> and <code>height</code>","     *      attributes or are determined by the dimensions of the parent element. The contents of the Graphic instance are not affected by this setting.</dd>","     *  </dl>","     *","     *","     *  @config autoSize","     *  @type Boolean | String","     *  @default false","     */","    autoSize: {","        value: false","    },","","    /**","     * Determines how content is sized when <code>autoSize</code> is set to <code>sizeContentToGraphic</code>.","     *","     *  <dl>","     *      <dt>none<dt><dd>Do not force uniform scaling. Scale the graphic content of the given element non-uniformly if necessary ","     *      such that the element's bounding box exactly matches the viewport rectangle.</dd>","     *      <dt>xMinYMin</dt><dd>Force uniform scaling position along the top left of the Graphic's node.</dd>","     *      <dt>xMidYMin</dt><dd>Force uniform scaling horizontally centered and positioned at the top of the Graphic's node.<dd>","     *      <dt>xMaxYMin</dt><dd>Force uniform scaling positioned horizontally from the right and vertically from the top.</dd>","     *      <dt>xMinYMid</dt>Force uniform scaling positioned horizontally from the left and vertically centered.</dd>","     *      <dt>xMidYMid (the default)</dt><dd>Force uniform scaling with the content centered.</dd>","     *      <dt>xMaxYMid</dt><dd>Force uniform scaling positioned horizontally from the right and vertically centered.</dd>","     *      <dt>xMinYMax</dt><dd>Force uniform scaling positioned horizontally from the left and vertically from the bottom.</dd>","     *      <dt>xMidYMax</dt><dd>Force uniform scaling horizontally centered and position vertically from the bottom.</dd>","     *      <dt>xMaxYMax</dt><dd>Force uniform scaling positioned horizontally from the right and vertically from the bottom.</dd>","     *  </dl>","     * ","     * @config preserveAspectRatio","     * @type String","     * @default xMidYMid","     */","    preserveAspectRatio: {","        value: \"xMidYMid\"","    },","","    /**","     * The contentBounds will resize to greater values but not values. (for performance)","     * When resizing the contentBounds down is desirable, set the resizeDown value to true.","     *","     * @config resizeDown ","     * @type Boolean","     */","    resizeDown: {","        resizeDown: false","    },","","	/**","	 * Indicates the x-coordinate for the instance.","	 *","	 * @config x","	 * @type Number","	 */","    x: {","        getter: function()","        {","            return this._x;","        },","","        setter: function(val)","        {","            this._x = val;","            if(this._node)","            {","                this._node.style.left = val + \"px\";","            }","            return val;","        }","    },","","	/**","	 * Indicates the y-coordinate for the instance.","	 *","	 * @config y","	 * @type Number","	 */","    y: {","        getter: function()","        {","            return this._y;","        },","","        setter: function(val)","        {","            this._y = val;","            if(this._node)","            {","                this._node.style.top = val + \"px\";","            }","            return val;","        }","    },","","    /**","     * Indicates whether or not the instance will automatically redraw after a change is made to a shape.","     * This property will get set to false when batching operations.","     *","     * @config autoDraw","     * @type Boolean","     * @default true","     * @private","     */","    autoDraw: {","        value: true","    },","","    visible: {","        value: true,","","        setter: function(val)","        {","            this._toggleVisible(val);","            return val;","        }","    }","};","","Y.extend(VMLGraphic, Y.GraphicBase, {","    /**","     * Sets the value of an attribute.","     *","     * @method set","     * @param {String|Object} name The name of the attribute. Alternatively, an object of key value pairs can ","     * be passed in to set multiple attributes at once.","     * @param {Any} value The value to set the attribute to. This value is ignored if an object is received as ","     * the name param.","     */","	set: function(attr, value) ","	{","		var host = this,","            redrawAttrs = {","                autoDraw: true,","                autoSize: true,","                preserveAspectRatio: true,","                resizeDown: true","            },","            key,","            forceRedraw = false;","		AttributeLite.prototype.set.apply(host, arguments);	","        if(host._state.autoDraw === true && Y.Object.size(this._shapes) > 0)","        {","            if(Y_LANG.isString && redrawAttrs[attr])","            {","                forceRedraw = true;","            }","            else if(Y_LANG.isObject(attr))","            {","                for(key in redrawAttrs)","                {","                    if(redrawAttrs.hasOwnProperty(key) && attr[key])","                    {","                        forceRedraw = true;","                        break;","                    }","                }","            }","        }","        if(forceRedraw)","        {","            host._redraw();","        }","	},","","    /**","     * Storage for `x` attribute.","     *","     * @property _x","     * @type Number","     * @private","     */","    _x: 0,","","    /**","     * Storage for `y` attribute.","     *","     * @property _y","     * @type Number","     * @private","     */","    _y: 0,","","    /**","     * Gets the current position of the graphic instance in page coordinates.","     *","     * @method getXY","     * @return Array The XY position of the shape.","     */","    getXY: function()","    {","        var node = this.parentNode,","            x = this.get(\"x\"),","            y = this.get(\"y\"),","            xy;","        if(node)","        {","            xy = Y.one(node).getXY();","            xy[0] += x;","            xy[1] += y;","        }","        else","        {","            xy = Y.DOM._getOffset(this._node);","        }","        return xy;","    },","","    /**","     * Initializes the class.","     *","     * @method initializer","     * @private","     */","    initializer: function(config) {","        var render = this.get(\"render\"),","            visibility = this.get(\"visible\") ? \"visible\" : \"hidden\";","        this._shapes = {};","		this._contentBounds = {","            left: 0,","            top: 0,","            right: 0,","            bottom: 0","        };","        this._node = DOCUMENT.createElement('div');","        this._node.style.position = \"absolute\";","        this._node.style.left = this.get(\"x\") + \"px\";","        this._node.style.top = this.get(\"y\") + \"px\";","        this._node.style.visibility = visibility;","        this._node.setAttribute(\"id\", this.get(\"id\"));","        this._contentNode = this._createGraphic();","        this._contentNode.style.position = \"absolute\";","        this._contentNode.style.left = \"0px\";","        this._contentNode.style.top = \"0px\";","        this._contentNode.style.visibility = visibility;","        this._node.appendChild(this._contentNode);","        if(render)","        {","            this.render(render);","        }","    },","    ","    /**","     * Adds the graphics node to the dom.","     * ","     * @method render","     * @param {HTMLElement} parentNode node in which to render the graphics node into.","     */","    render: function(render) {","        var parentNode = Y.one(render),","            w = this.get(\"width\") || parseInt(parentNode.getComputedStyle(\"width\"), 10),","            h = this.get(\"height\") || parseInt(parentNode.getComputedStyle(\"height\"), 10);","        parentNode = parentNode || DOCUMENT.body;","        parentNode.appendChild(this._node);","        this.parentNode = parentNode;","        this.set(\"width\", w);","        this.set(\"height\", h);","        return this;","    },","","    /**","     * Removes all nodes.","     *","     * @method destroy","     */","    destroy: function()","    {","        this.clear();","        Y.one(this._node).remove(true);","    },","","    /**","     * Generates a shape instance by type.","     *","     * @method addShape","     * @param {Object} cfg attributes for the shape","     * @return Shape","     */","    addShape: function(cfg)","    {","        cfg.graphic = this;","        if(!this.get(\"visible\"))","        {","            cfg.visible = false;","        }","        var shapeClass = this._getShapeClass(cfg.type),","            shape = new shapeClass(cfg);","        this._appendShape(shape);","        shape._appendStrokeAndFill();","        return shape;","    },","","    /**","     * Adds a shape instance to the graphic instance.","     *","     * @method _appendShape","     * @param {Shape} shape The shape instance to be added to the graphic.","     * @private","     */","    _appendShape: function(shape)","    {","        var node = shape.node,","            parentNode = this._frag || this._contentNode;","        if(this.get(\"autoDraw\") || this.get(\"autoSize\") == \"sizeContentToGraphic\") ","        {","            parentNode.appendChild(node);","        }","        else","        {","            this._getDocFrag().appendChild(node);","        }","    },","","    /**","     * Removes a shape instance from from the graphic instance.","     *","     * @method removeShape","     * @param {Shape|String} shape The instance or id of the shape to be removed.","     */","    removeShape: function(shape)","    {","        if(!(shape instanceof VMLShape))","        {","            if(Y_LANG.isString(shape))","            {","                shape = this._shapes[shape];","            }","        }","        if(shape && (shape instanceof VMLShape))","        {","            shape._destroy();","            this._shapes[shape.get(\"id\")] = null;","            delete this._shapes[shape.get(\"id\")];","        }","        if(this.get(\"autoDraw\"))","        {","            this._redraw();","        }","    },","","    /**","     * Removes all shape instances from the dom.","     *","     * @method removeAllShapes","     */","    removeAllShapes: function()","    {","        var shapes = this._shapes,","            i;","        for(i in shapes)","        {","            if(shapes.hasOwnProperty(i))","            {","                shapes[i].destroy();","            }","        }","        this._shapes = {};","    },","","    /**","     * Removes all child nodes.","     *","     * @method _removeChildren","     * @param node","     * @private","     */","    _removeChildren: function(node)","    {","        if(node.hasChildNodes())","        {","            var child;","            while(node.firstChild)","            {","                child = node.firstChild;","                this._removeChildren(child);","                node.removeChild(child);","            }","        }","    },","","    /**","     * Clears the graphics object.","     *","     * @method clear","     */","    clear: function() {","        this.removeAllShapes();","        this._removeChildren(this._contentNode);","    },","","    /**","     * Toggles visibility","     *","     * @method _toggleVisible","     * @param {Boolean} val indicates visibilitye","     * @private","     */","    _toggleVisible: function(val)","    {","        var i,","            shapes = this._shapes,","            visibility = val ? \"visible\" : \"hidden\";","        if(shapes)","        {","            for(i in shapes)","            {","                if(shapes.hasOwnProperty(i))","                {","                    shapes[i].set(\"visible\", val);","                }","            }","        }","        if(this._contentNode)","        {","            this._contentNode.style.visibility = visibility;","        }","        if(this._node)","        {","            this._node.style.visibility = visibility;","        }","    },","","    /**","     * Sets the size of the graphics object.","     * ","     * @method setSize","     * @param w {Number} width to set for the instance.","     * @param h {Number} height to set for the instance.","     */","    setSize: function(w, h) {","        w = Math.round(w);","        h = Math.round(h);","        this._node.style.width = w + 'px';","        this._node.style.height = h + 'px';","    },","","    /**","     * Sets the positon of the graphics object.","     *","     * @method setPosition","     * @param {Number} x x-coordinate for the object.","     * @param {Number} y y-coordinate for the object.","     */","    setPosition: function(x, y)","    {","        x = Math.round(x);","        y = Math.round(y);","        this._node.style.left = x + \"px\";","        this._node.style.top = y + \"px\";","    },","","    /**","     * Creates a group element","     *","     * @method _createGraphic","     * @private","     */","    _createGraphic: function() {","        var group = DOCUMENT.createElement('<group xmlns=\"urn:schemas-microsft.com:vml\" style=\"behavior:url(#default#VML);display:block;position:absolute;top:0px;left:0px;zoom:1;\" />');","        return group;","    },","","    /**","     * Creates a graphic node","     *","     * @method _createGraphicNode","     * @param {String} type node type to create","     * @param {String} pe specified pointer-events value","     * @return HTMLElement","     * @private","     */","    _createGraphicNode: function(type)","    {","        return DOCUMENT.createElement('<' + type + ' xmlns=\"urn:schemas-microsft.com:vml\" style=\"behavior:url(#default#VML);display:inline-block;zoom:1;\" />');","    ","    },","","    /**","     * Returns a shape based on the id of its dom node.","     *","     * @method getShapeById","     * @param {String} id Dom id of the shape's node attribute.","     * @return Shape","     */","    getShapeById: function(id)","    {","        return this._shapes[id];","    },","","    /**","     * Returns a shape class. Used by `addShape`. ","     *","     * @method _getShapeClass","     * @param {Shape | String} val Indicates which shape class. ","     * @return Function ","     * @private","     */","    _getShapeClass: function(val)","    {","        var shape = this._shapeClass[val];","        if(shape)","        {","            return shape;","        }","        return val;","    },","","    /**","     * Look up for shape classes. Used by `addShape` to retrieve a class for instantiation.","     *","     * @property _shapeClass","     * @type Object","     * @private","     */","    _shapeClass: {","        circle: Y.VMLCircle,","        rect: Y.VMLRect,","        path: Y.VMLPath,","        ellipse: Y.VMLEllipse,","        pieslice: Y.VMLPieSlice","    },","","	/**","	 * Allows for creating multiple shapes in order to batch appending and redraw operations.","	 *","	 * @method batch","	 * @param {Function} method Method to execute.","	 */","    batch: function(method)","    {","        var autoDraw = this.get(\"autoDraw\");","        this.set(\"autoDraw\", false);","        method.apply();","        this.set(\"autoDraw\", autoDraw);","    },","    ","    /**","     * Returns a document fragment to for attaching shapes.","     *","     * @method _getDocFrag","     * @return DocumentFragment","     * @private","     */","    _getDocFrag: function()","    {","        if(!this._frag)","        {","            this._frag = DOCUMENT.createDocumentFragment();","        }","        return this._frag;","    },","","    /**","     * Adds a shape to the redraw queue and calculates the contentBounds. ","     *","     * @method addToRedrawQueue","     * @param shape {VMLShape}","     * @protected","     */","    addToRedrawQueue: function(shape)","    {","        var shapeBox,","            box;","        this._shapes[shape.get(\"id\")] = shape;","        if(!this.get(\"resizeDown\"))","        {","            shapeBox = shape.getBounds();","            box = this._contentBounds;","            box.left = box.left < shapeBox.left ? box.left : shapeBox.left;","            box.top = box.top < shapeBox.top ? box.top : shapeBox.top;","            box.right = box.right > shapeBox.right ? box.right : shapeBox.right;","            box.bottom = box.bottom > shapeBox.bottom ? box.bottom : shapeBox.bottom;","            box.width = box.right - box.left;","            box.height = box.bottom - box.top;","            this._contentBounds = box;","        }","        if(this.get(\"autoDraw\")) ","        {","            this._redraw();","        }","    },","","    /**","     * Redraws all shapes.","     *","     * @method _redraw","     * @private","     */","    _redraw: function()","    {","        var autoSize = this.get(\"autoSize\"),","            preserveAspectRatio,","            nodeWidth,","            nodeHeight,","            xCoordOrigin = 0,","            yCoordOrigin = 0,","            box = this.get(\"resizeDown\") ? this._getUpdatedContentBounds() : this._contentBounds,","            left = box.left,","            right = box.right,","            top = box.top,","            bottom = box.bottom,","            contentWidth = right - left,","            contentHeight = bottom - top,","            aspectRatio,","            xCoordSize,","            yCoordSize,","            scaledWidth,","            scaledHeight,","            visible = this.get(\"visible\");","        this._contentNode.style.visibility = \"hidden\";","        if(autoSize)","        {","            if(autoSize == \"sizeContentToGraphic\")","            {","                preserveAspectRatio = this.get(\"preserveAspectRatio\");","                nodeWidth = this.get(\"width\");","                nodeHeight = this.get(\"height\");","                if(preserveAspectRatio == \"none\" || contentWidth/contentHeight === nodeWidth/nodeHeight)","                {","                    xCoordOrigin = left;","                    yCoordOrigin = top;","                    xCoordSize = contentWidth;","                    yCoordSize = contentHeight;","                }","                else ","                {","                    if(contentWidth * nodeHeight/contentHeight > nodeWidth)","                    {","                        aspectRatio = nodeHeight/nodeWidth;","                        xCoordSize = contentWidth;","                        yCoordSize = contentWidth * aspectRatio;","                        scaledHeight = (nodeWidth * (contentHeight/contentWidth)) * (yCoordSize/nodeHeight);","                        yCoordOrigin = this._calculateCoordOrigin(preserveAspectRatio.slice(5).toLowerCase(), scaledHeight, yCoordSize);","                        yCoordOrigin = top + yCoordOrigin;","                        xCoordOrigin = left;","                    }","                    else","                    {","                        aspectRatio = nodeWidth/nodeHeight;","                        xCoordSize = contentHeight * aspectRatio;","                        yCoordSize = contentHeight;","                        scaledWidth = (nodeHeight * (contentWidth/contentHeight)) * (xCoordSize/nodeWidth);","                        xCoordOrigin = this._calculateCoordOrigin(preserveAspectRatio.slice(1, 4).toLowerCase(), scaledWidth, xCoordSize);","                        xCoordOrigin = xCoordOrigin + left;","                        yCoordOrigin = top;","                    }","                }","                this._contentNode.style.width = nodeWidth + \"px\";","                this._contentNode.style.height = nodeHeight + \"px\";","                this._contentNode.coordOrigin = xCoordOrigin + \", \" + yCoordOrigin;","            }","            else ","            {","                xCoordSize = contentWidth;","                yCoordSize = contentHeight;","                this._contentNode.style.width = contentWidth + \"px\";","                this._contentNode.style.height = contentHeight + \"px\";","                this._state.width = contentWidth;","                this._state.height =  contentHeight;","                if(this._node)","                {","                    this._node.style.width = contentWidth + \"px\";","                    this._node.style.height = contentHeight + \"px\";","                }","","            }","            this._contentNode.coordSize = xCoordSize + \", \" + yCoordSize;","        }","        else","        {","            this._contentNode.style.width = right + \"px\";","            this._contentNode.style.height = bottom + \"px\";","            this._contentNode.coordSize = right + \", \" + bottom;","        }","        if(this._frag)","        {","            this._contentNode.appendChild(this._frag);","            this._frag = null;","        }","        if(visible)","        {","            this._contentNode.style.visibility = \"visible\";","        }","    },","    ","    /**","     * Determines the value for either an x or y coordinate to be used for the <code>coordOrigin</code> of the Graphic.","     *","     * @method _calculateCoordOrigin","     * @param {String} position The position for placement. Possible values are min, mid and max.","     * @param {Number} size The total scaled size of the content.","     * @param {Number} coordsSize The coordsSize for the Graphic.","     * @return Number","     * @private","     */","    _calculateCoordOrigin: function(position, size, coordsSize)","    {","        var coord;","        switch(position)","        {","            case \"min\" :","                coord = 0;","            break;","            case \"mid\" :","                coord = (size - coordsSize)/2;","            break;","            case \"max\" :","                coord = (size - coordsSize);","            break;","        }","        return coord;","    },","","    /**","     * Recalculates and returns the `contentBounds` for the `Graphic` instance.","     *","     * @method _getUpdatedContentBounds","     * @return {Object} ","     * @private","     */","    _getUpdatedContentBounds: function()","    {","        var bounds,","            i,","            shape,","            queue = this._shapes,","            box = {};","        for(i in queue)","        {","            if(queue.hasOwnProperty(i))","            {","                shape = queue[i];","                bounds = shape.getBounds();","                box.left = Y_LANG.isNumber(box.left) ? Math.min(box.left, bounds.left) : bounds.left;","                box.top = Y_LANG.isNumber(box.top) ? Math.min(box.top, bounds.top) : bounds.top;","                box.right = Y_LANG.isNumber(box.right) ? Math.max(box.right, bounds.right) : bounds.right;","                box.bottom = Y_LANG.isNumber(box.bottom) ? Math.max(box.bottom, bounds.bottom) : bounds.bottom;","            }","        }","        box.left = Y_LANG.isNumber(box.left) ? box.left : 0;","        box.top = Y_LANG.isNumber(box.top) ? box.top : 0;","        box.right = Y_LANG.isNumber(box.right) ? box.right : 0;","        box.bottom = Y_LANG.isNumber(box.bottom) ? box.bottom : 0;","        this._contentBounds = box;","        return box;","    },","","    /**","     * Inserts shape on the top of the tree.","     *","     * @method _toFront","     * @param {VMLShape} Shape to add.","     * @private","     */","    _toFront: function(shape)","    {","        var contentNode = this._contentNode;","        if(shape instanceof Y.VMLShape)","        {","            shape = shape.get(\"node\");","        }","        if(contentNode && shape)","        {","            contentNode.appendChild(shape);","        }","    },","","    /**","     * Inserts shape as the first child of the content node.","     *","     * @method _toBack","     * @param {VMLShape} Shape to add.","     * @private","     */","    _toBack: function(shape)","    {","        var contentNode = this._contentNode,","            targetNode;","        if(shape instanceof Y.VMLShape)","        {","            shape = shape.get(\"node\");","        }","        if(contentNode && shape)","        {","            targetNode = contentNode.firstChild;","            if(targetNode)","            {","                contentNode.insertBefore(shape, targetNode);","            }","            else","            {","                contentNode.appendChild(shape);","            }","        }","    }","});","Y.VMLGraphic = VMLGraphic;","","","","}, '@VERSION@', {\"requires\": [\"graphics\"]});"];
_yuitest_coverage["build/graphics-vml/graphics-vml.js"].lines = {"1":0,"3":0,"24":0,"36":0,"76":0,"88":0,"89":0,"91":0,"92":0,"94":0,"127":0,"142":0,"154":0,"171":0,"172":0,"173":0,"175":0,"176":0,"177":0,"178":0,"179":0,"180":0,"181":0,"183":0,"185":0,"186":0,"187":0,"188":0,"189":0,"190":0,"191":0,"192":0,"193":0,"194":0,"195":0,"196":0,"197":0,"198":0,"199":0,"200":0,"201":0,"203":0,"216":0,"229":0,"241":0,"256":0,"258":0,"259":0,"260":0,"261":0,"262":0,"263":0,"264":0,"265":0,"266":0,"270":0,"271":0,"273":0,"286":0,"287":0,"288":0,"289":0,"290":0,"291":0,"292":0,"293":0,"308":0,"309":0,"310":0,"311":0,"312":0,"313":0,"314":0,"315":0,"316":0,"317":0,"330":0,"334":0,"335":0,"336":0,"337":0,"338":0,"339":0,"353":0,"357":0,"358":0,"359":0,"360":0,"361":0,"362":0,"377":0,"379":0,"380":0,"381":0,"382":0,"383":0,"384":0,"401":0,"402":0,"404":0,"406":0,"407":0,"408":0,"409":0,"410":0,"411":0,"412":0,"413":0,"414":0,"415":0,"427":0,"439":0,"451":0,"459":0,"460":0,"461":0,"462":0,"463":0,"464":0,"465":0,"466":0,"467":0,"468":0,"469":0,"474":0,"475":0,"476":0,"477":0,"478":0,"479":0,"480":0,"481":0,"482":0,"485":0,"486":0,"498":0,"510":0,"522":0,"523":0,"527":0,"528":0,"529":0,"530":0,"531":0,"532":0,"543":0,"551":0,"552":0,"553":0,"555":0,"557":0,"559":0,"561":0,"564":0,"566":0,"568":0,"570":0,"571":0,"572":0,"573":0,"574":0,"576":0,"577":0,"578":0,"588":0,"598":0,"608":0,"609":0,"610":0,"611":0,"612":0,"613":0,"614":0,"615":0,"628":0,"633":0,"634":0,"637":0,"638":0,"639":0,"640":0,"643":0,"657":0,"665":0,"667":0,"668":0,"669":0,"670":0,"671":0,"673":0,"674":0,"675":0,"676":0,"677":0,"678":0,"690":0,"691":0,"693":0,"695":0,"697":0,"699":0,"701":0,"703":0,"705":0,"706":0,"721":0,"733":0,"735":0,"736":0,"737":0,"738":0,"741":0,"743":0,"762":0,"773":0,"776":0,"777":0,"779":0,"781":0,"783":0,"785":0,"798":0,"799":0,"801":0,"805":0,"806":0,"809":0,"810":0,"811":0,"823":0,"825":0,"827":0,"829":0,"842":0,"863":0,"864":0,"865":0,"866":0,"867":0,"869":0,"871":0,"873":0,"874":0,"875":0,"876":0,"877":0,"878":0,"880":0,"881":0,"882":0,"884":0,"886":0,"888":0,"890":0,"892":0,"894":0,"896":0,"898":0,"899":0,"900":0,"904":0,"906":0,"908":0,"910":0,"911":0,"913":0,"915":0,"917":0,"921":0,"922":0,"924":0,"926":0,"927":0,"928":0,"939":0,"940":0,"951":0,"952":0,"963":0,"967":0,"979":0,"981":0,"982":0,"994":0,"1005":0,"1007":0,"1019":0,"1032":0,"1042":0,"1044":0,"1045":0,"1046":0,"1047":0,"1049":0,"1051":0,"1052":0,"1053":0,"1054":0,"1055":0,"1056":0,"1057":0,"1058":0,"1059":0,"1060":0,"1061":0,"1063":0,"1064":0,"1065":0,"1067":0,"1068":0,"1071":0,"1073":0,"1077":0,"1078":0,"1080":0,"1081":0,"1084":0,"1086":0,"1097":0,"1099":0,"1101":0,"1111":0,"1113":0,"1114":0,"1115":0,"1117":0,"1119":0,"1120":0,"1121":0,"1122":0,"1123":0,"1124":0,"1125":0,"1126":0,"1127":0,"1129":0,"1130":0,"1132":0,"1133":0,"1134":0,"1136":0,"1137":0,"1138":0,"1140":0,"1141":0,"1144":0,"1146":0,"1150":0,"1151":0,"1153":0,"1154":0,"1157":0,"1158":0,"1162":0,"1164":0,"1166":0,"1168":0,"1181":0,"1188":0,"1190":0,"1192":0,"1194":0,"1195":0,"1196":0,"1197":0,"1198":0,"1199":0,"1201":0,"1203":0,"1206":0,"1207":0,"1209":0,"1211":0,"1212":0,"1213":0,"1214":0,"1216":0,"1217":0,"1218":0,"1220":0,"1224":0,"1226":0,"1237":0,"1239":0,"1241":0,"1248":0,"1250":0,"1252":0,"1253":0,"1254":0,"1256":0,"1258":0,"1260":0,"1262":0,"1266":0,"1273":0,"1274":0,"1276":0,"1278":0,"1281":0,"1282":0,"1283":0,"1286":0,"1288":0,"1289":0,"1290":0,"1291":0,"1293":0,"1294":0,"1296":0,"1298":0,"1300":0,"1304":0,"1305":0,"1306":0,"1309":0,"1311":0,"1312":0,"1316":0,"1317":0,"1323":0,"1325":0,"1326":0,"1340":0,"1362":0,"1364":0,"1366":0,"1368":0,"1370":0,"1374":0,"1376":0,"1377":0,"1379":0,"1381":0,"1382":0,"1383":0,"1384":0,"1385":0,"1386":0,"1387":0,"1388":0,"1389":0,"1390":0,"1391":0,"1393":0,"1394":0,"1395":0,"1396":0,"1397":0,"1398":0,"1399":0,"1400":0,"1401":0,"1402":0,"1403":0,"1405":0,"1407":0,"1409":0,"1410":0,"1423":0,"1424":0,"1425":0,"1426":0,"1427":0,"1429":0,"1441":0,"1454":0,"1456":0,"1458":0,"1460":0,"1464":0,"1465":0,"1468":0,"1469":0,"1470":0,"1472":0,"1473":0,"1475":0,"1476":0,"1479":0,"1481":0,"1483":0,"1490":0,"1491":0,"1493":0,"1495":0,"1496":0,"1498":0,"1499":0,"1501":0,"1503":0,"1505":0,"1508":0,"1509":0,"1522":0,"1524":0,"1525":0,"1564":0,"1565":0,"1566":0,"1578":0,"1579":0,"1591":0,"1592":0,"1604":0,"1615":0,"1626":0,"1637":0,"1648":0,"1662":0,"1664":0,"1666":0,"1687":0,"1689":0,"1690":0,"1691":0,"1692":0,"1693":0,"1694":0,"1707":0,"1708":0,"1719":0,"1738":0,"1757":0,"1758":0,"1759":0,"1761":0,"1776":0,"1781":0,"1783":0,"1784":0,"1785":0,"1786":0,"1788":0,"1803":0,"1814":0,"1816":0,"1818":0,"1819":0,"1820":0,"1821":0,"1823":0,"1824":0,"1825":0,"1827":0,"1830":0,"1831":0,"1833":0,"1835":0,"1836":0,"1846":0,"1847":0,"1849":0,"1860":0,"1861":0,"1863":0,"1876":0,"1884":0,"1886":0,"1887":0,"1888":0,"1890":0,"1891":0,"1893":0,"1894":0,"1896":0,"1898":0,"1902":0,"1906":0,"1917":0,"1918":0,"1920":0,"1924":0,"1936":0,"1938":0,"1940":0,"1941":0,"1943":0,"1945":0,"1946":0,"1948":0,"1953":0,"1964":0,"2000":0,"2003":0,"2004":0,"2005":0,"2006":0,"2007":0,"2009":0,"2011":0,"2012":0,"2017":0,"2050":0,"2055":0,"2056":0,"2058":0,"2060":0,"2090":0,"2092":0,"2094":0,"2096":0,"2148":0,"2152":0,"2155":0,"2157":0,"2159":0,"2161":0,"2163":0,"2167":0,"2168":0,"2170":0,"2172":0,"2175":0,"2176":0,"2213":0,"2217":0,"2219":0,"2221":0,"2222":0,"2224":0,"2227":0,"2229":0,"2231":0,"2235":0,"2236":0,"2237":0,"2268":0,"2281":0,"2283":0,"2285":0,"2300":0,"2304":0,"2315":0,"2317":0,"2320":0,"2321":0,"2322":0,"2332":0,"2333":0,"2346":0,"2362":0,"2366":0,"2377":0,"2379":0,"2381":0,"2382":0,"2392":0,"2393":0,"2404":0,"2406":0,"2409":0,"2411":0,"2421":0,"2433":0,"2434":0,"2435":0,"2440":0,"2441":0,"2442":0,"2458":0,"2459":0,"2460":0,"2465":0,"2466":0,"2467":0,"2471":0,"2482":0,"2484":0,"2487":0,"2489":0,"2500":0,"2522":0,"2523":0,"2528":0,"2530":0,"2543":0,"2544":0,"2549":0,"2551":0,"2555":0,"2563":0,"2565":0,"2567":0,"2568":0,"2586":0,"2591":0,"2592":0,"2593":0,"2596":0,"2634":0,"2645":0,"2646":0,"2649":0,"2651":0,"2669":0,"2674":0,"2675":0,"2677":0,"2679":0,"2695":0,"2710":0,"2725":0,"2738":0,"2740":0,"2742":0,"2755":0,"2757":0,"2759":0,"2829":0,"2834":0,"2835":0,"2837":0,"2839":0,"2852":0,"2857":0,"2858":0,"2860":0,"2862":0,"2884":0,"2885":0,"2890":0,"2902":0,"2911":0,"2912":0,"2914":0,"2916":0,"2918":0,"2920":0,"2922":0,"2924":0,"2925":0,"2930":0,"2932":0,"2962":0,"2966":0,"2968":0,"2969":0,"2970":0,"2974":0,"2976":0,"2986":0,"2988":0,"2989":0,"2995":0,"2996":0,"2997":0,"2998":0,"2999":0,"3000":0,"3001":0,"3002":0,"3003":0,"3004":0,"3005":0,"3006":0,"3007":0,"3009":0,"3020":0,"3023":0,"3024":0,"3025":0,"3026":0,"3027":0,"3028":0,"3038":0,"3039":0,"3051":0,"3052":0,"3054":0,"3056":0,"3058":0,"3059":0,"3060":0,"3072":0,"3074":0,"3076":0,"3080":0,"3092":0,"3094":0,"3096":0,"3099":0,"3101":0,"3102":0,"3103":0,"3105":0,"3107":0,"3118":0,"3120":0,"3122":0,"3124":0,"3127":0,"3139":0,"3141":0,"3142":0,"3144":0,"3145":0,"3146":0,"3157":0,"3158":0,"3170":0,"3173":0,"3175":0,"3177":0,"3179":0,"3183":0,"3185":0,"3187":0,"3189":0,"3201":0,"3202":0,"3203":0,"3204":0,"3216":0,"3217":0,"3218":0,"3219":0,"3229":0,"3230":0,"3244":0,"3257":0,"3270":0,"3271":0,"3273":0,"3275":0,"3301":0,"3302":0,"3303":0,"3304":0,"3316":0,"3318":0,"3320":0,"3332":0,"3334":0,"3335":0,"3337":0,"3338":0,"3339":0,"3340":0,"3341":0,"3342":0,"3343":0,"3344":0,"3345":0,"3347":0,"3349":0,"3361":0,"3380":0,"3381":0,"3383":0,"3385":0,"3386":0,"3387":0,"3388":0,"3390":0,"3391":0,"3392":0,"3393":0,"3397":0,"3399":0,"3400":0,"3401":0,"3402":0,"3403":0,"3404":0,"3405":0,"3409":0,"3410":0,"3411":0,"3412":0,"3413":0,"3414":0,"3415":0,"3418":0,"3419":0,"3420":0,"3424":0,"3425":0,"3426":0,"3427":0,"3428":0,"3429":0,"3430":0,"3432":0,"3433":0,"3437":0,"3441":0,"3442":0,"3443":0,"3445":0,"3447":0,"3448":0,"3450":0,"3452":0,"3468":0,"3469":0,"3472":0,"3473":0,"3475":0,"3476":0,"3478":0,"3479":0,"3481":0,"3493":0,"3498":0,"3500":0,"3502":0,"3503":0,"3504":0,"3505":0,"3506":0,"3507":0,"3510":0,"3511":0,"3512":0,"3513":0,"3514":0,"3515":0,"3527":0,"3528":0,"3530":0,"3532":0,"3534":0,"3547":0,"3549":0,"3551":0,"3553":0,"3555":0,"3556":0,"3558":0,"3562":0,"3567":0};
_yuitest_coverage["build/graphics-vml/graphics-vml.js"].functions = {"VMLDrawing:24":0,"_round:74":0,"_addToPath:86":0,"curveTo:126":0,"relativeCurveTo:141":0,"_curveTo:153":0,"quadraticCurveTo:215":0,"relativeQuadraticCurveTo:228":0,"_quadraticCurveTo:240":0,"drawRect:285":0,"drawRoundRect:307":0,"drawCircle:329":0,"drawEllipse:352":0,"drawDiamond:375":0,"drawWedge:399":0,"lineTo:425":0,"relativeLineTo:437":0,"_lineTo:450":0,"moveTo:496":0,"relativeMoveTo:508":0,"_moveTo:521":0,"_closePath:541":0,"end:586":0,"closePath:596":0,"clear:606":0,"getBezierData:627":0,"_setCurveBoundingBox:655":0,"_trackSize:689":0,"VMLShape:733":0,"init:760":0,"initializer:771":0,"_setGraphic:796":0,"_appendStrokeAndFill:821":0,"createNode:840":0,"addClass:937":0,"removeClass:949":0,"getXY:961":0,"setXY:977":0,"contains:992":0,"compareTo:1004":0,"test:1017":0,"_getStrokeProps:1030":0,"_strokeChangeHandler:1095":0,"_getFillProps:1179":0,"_fillChangeHandler:1235":0,"_updateFillNode:1321":0,"_getGradientFill:1338":0,"_addTransform:1421":0,"_updateTransform:1439":0,"_getSkewOffsetValue:1520":0,"translate:1562":0,"translateX:1576":0,"translateY:1589":0,"skew:1602":0,"skewX:1613":0,"skewY:1624":0,"rotate:1635":0,"scale:1646":0,"on:1660":0,"_updateHandler:1685":0,"_createGraphicNode:1705":0,"_getDefaultFill:1718":0,"_getDefaultStroke:1736":0,"set:1755":0,"getBounds:1774":0,"_getContentRect:1801":0,"toFront:1844":0,"toBack:1858":0,"_parsePathData:1874":0,"destroy:1915":0,"_destroy:1934":0,"valueFn:1962":0,"setter:1998":0,"getter:2015":0,"valueFn:2048":0,"setter:2053":0,"setter:2089":0,"setter:2146":0,"setter:2211":0,"getter:2266":0,"setter:2279":0,"getter:2298":0,"VMLPath:2315":0,"getter:2330":0,"getter:2344":0,"getter:2360":0,"VMLRect:2377":0,"VMLEllipse:2404":0,"getter:2431":0,"setter:2438":0,"getter:2456":0,"setter:2463":0,"VMLCircle:2482":0,"setter:2520":0,"getter:2526":0,"setter:2541":0,"getter:2547":0,"VMLPieSlice:2563":0,"_draw:2584":0,"VMLGraphic:2645":0,"valueFn:2667":0,"setter:2672":0,"getter:2693":0,"getter:2708":0,"getter:2723":0,"setter:2736":0,"setter:2753":0,"getter:2827":0,"setter:2832":0,"getter:2850":0,"setter:2855":0,"setter:2882":0,"set:2900":0,"getXY:2960":0,"initializer:2985":0,"render:3019":0,"destroy:3036":0,"addShape:3049":0,"_appendShape:3070":0,"removeShape:3090":0,"removeAllShapes:3116":0,"_removeChildren:3137":0,"clear:3156":0,"_toggleVisible:3168":0,"setSize:3200":0,"setPosition:3214":0,"_createGraphic:3228":0,"_createGraphicNode:3242":0,"getShapeById:3255":0,"_getShapeClass:3268":0,"batch:3299":0,"_getDocFrag:3314":0,"addToRedrawQueue:3330":0,"_redraw:3359":0,"_calculateCoordOrigin:3466":0,"_getUpdatedContentBounds:3491":0,"_toFront:3525":0,"_toBack:3545":0,"(anonymous 1):1":0};
_yuitest_coverage["build/graphics-vml/graphics-vml.js"].coveredLines = 932;
_yuitest_coverage["build/graphics-vml/graphics-vml.js"].coveredFunctions = 139;
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1);
YUI.add('graphics-vml', function (Y, NAME) {

_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "(anonymous 1)", 1);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3);
var IMPLEMENTATION = "vml",
    SHAPE = "shape",
	SPLITPATHPATTERN = /[a-z][^a-z]*/ig,
    SPLITARGSPATTERN = /[-]?[0-9]*[0-9|\.][0-9]*/g,
    Y_LANG = Y.Lang,
    IS_NUM = Y_LANG.isNumber,
    IS_ARRAY = Y_LANG.isArray,
    IS_STRING = Y_LANG.isString,
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

_yuitest_coverline("build/graphics-vml/graphics-vml.js", 24);
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
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 36);
VMLDrawing.prototype = {
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_round", 74);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 76);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_addToPath", 86);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 88);
this._path = this._path || "";
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 89);
if(this._movePath)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 91);
this._path += this._movePath;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 92);
this._movePath = null;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 94);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "curveTo", 126);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 127);
this._curveTo.apply(this, [Y.Array(arguments), false]);
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
     */
    relativeCurveTo: function() {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "relativeCurveTo", 141);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 142);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_curveTo", 153);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 154);
var w,
            h,
            cp1x,
            cp1y,
            cp2x,
            cp2y,
            pts,
            right,
            left,
            bottom,
            top,
            i = 0,
            len,
            path,
            command = relative ? " v " : " c ",
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 171);
len = args.length - 5;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 172);
path = command; 
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 173);
for(; i < len; i = i + 6)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 175);
cp1x = parseFloat(args[i]);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 176);
cp1y = parseFloat(args[i + 1]);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 177);
cp2x = parseFloat(args[i + 2]);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 178);
cp2y = parseFloat(args[i + 3]);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 179);
x = parseFloat(args[i + 4]);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 180);
y = parseFloat(args[i + 5]);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 181);
if(i > 0)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 183);
path = path + ", ";
            }
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 185);
path = path + this._round(cp1x) + ", " + this._round(cp1y) + ", " + this._round(cp2x) + ", " + this._round(cp2y) + ", " + this._round(x) + ", " + this._round(y); 
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 186);
cp1x = cp1x + relativeX;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 187);
cp1y = cp1y + relativeY;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 188);
cp2x = cp2x + relativeX;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 189);
cp2y = cp2y + relativeY;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 190);
x = x + relativeX;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 191);
y = y + relativeY;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 192);
right = Math.max(x, Math.max(cp1x, cp2x));
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 193);
bottom = Math.max(y, Math.max(cp1y, cp2y));
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 194);
left = Math.min(x, Math.min(cp1x, cp2x));
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 195);
top = Math.min(y, Math.min(cp1y, cp2y));
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 196);
w = Math.abs(right - left);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 197);
h = Math.abs(bottom - top);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 198);
pts = [[this._currentX, this._currentY] , [cp1x, cp1y], [cp2x, cp2y], [x, y]]; 
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 199);
this._setCurveBoundingBox(pts, w, h);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 200);
this._currentX = x;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 201);
this._currentY = y;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 203);
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
     */
    quadraticCurveTo: function() {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "quadraticCurveTo", 215);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 216);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "relativeQuadraticCurveTo", 228);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 229);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_quadraticCurveTo", 240);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 241);
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
            i = 0,
            len = args.length - 3,
            bezierArgs = [],
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 256);
for(; i < len; i = i + 4)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 258);
cpx = parseFloat(args[i]) + relativeX;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 259);
cpy = parseFloat(args[i + 1]) + relativeY;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 260);
x = parseFloat(args[i + 2]) + relativeX;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 261);
y = parseFloat(args[i + 3]) + relativeY;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 262);
cp1x = currentX + 0.67*(cpx - currentX);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 263);
cp1y = currentY + 0.67*(cpy - currentY);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 264);
cp2x = cp1x + (x - currentX) * 0.34;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 265);
cp2y = cp1y + (y - currentY) * 0.34;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 266);
bezierArgs.push(cp1x),
            bezierArgs.push(cp1y),
            bezierArgs.push(cp2x),
            bezierArgs.push(cp2y);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 270);
bezierArgs.push(x);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 271);
bezierArgs.push(y);
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 273);
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
     */
    drawRect: function(x, y, w, h) {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "drawRect", 285);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 286);
this.moveTo(x, y);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 287);
this.lineTo(x + w, y);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 288);
this.lineTo(x + w, y + h);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 289);
this.lineTo(x, y + h);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 290);
this.lineTo(x, y);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 291);
this._currentX = x;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 292);
this._currentY = y;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 293);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "drawRoundRect", 307);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 308);
this.moveTo(x, y + eh);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 309);
this.lineTo(x, y + h - eh);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 310);
this.quadraticCurveTo(x, y + h, x + ew, y + h);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 311);
this.lineTo(x + w - ew, y + h);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 312);
this.quadraticCurveTo(x + w, y + h, x + w, y + h - eh);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 313);
this.lineTo(x + w, y + eh);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 314);
this.quadraticCurveTo(x + w, y, x + w - ew, y);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 315);
this.lineTo(x + ew, y);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 316);
this.quadraticCurveTo(x, y, x, y + eh);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 317);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "drawCircle", 329);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 330);
var startAngle = 0,
            endAngle = 360,
            circum = radius * 2;

        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 334);
endAngle *= 65535;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 335);
this._drawingComplete = false;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 336);
this._trackSize(x + circum, y + circum);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 337);
this.moveTo((x + circum), (y + radius));
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 338);
this._addToPath(" ae " + this._round(x + radius) + ", " + this._round(y + radius) + ", " + this._round(radius) + ", " + this._round(radius) + ", " + startAngle + ", " + endAngle);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 339);
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
     * @protected
     */
	drawEllipse: function(x, y, w, h) {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "drawEllipse", 352);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 353);
var startAngle = 0,
            endAngle = 360,
            radius = w * 0.5,
            yRadius = h * 0.5;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 357);
endAngle *= 65535;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 358);
this._drawingComplete = false;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 359);
this._trackSize(x + w, y + h);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 360);
this.moveTo((x + w), (y + yRadius));
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 361);
this._addToPath(" ae " + this._round(x + radius) + ", " + this._round(x + radius) + ", " + this._round(y + yRadius) + ", " + this._round(radius) + ", " + this._round(yRadius) + ", " + startAngle + ", " + endAngle);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 362);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "drawDiamond", 375);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 377);
var midWidth = width * 0.5,
            midHeight = height * 0.5;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 379);
this.moveTo(x + midWidth, y);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 380);
this.lineTo(x + width, y + midHeight);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 381);
this.lineTo(x + midWidth, y + height);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 382);
this.lineTo(x, y + midHeight);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 383);
this.lineTo(x + midWidth, y);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 384);
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
    drawWedge: function(x, y, startAngle, arc, radius)
    {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "drawWedge", 399);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 401);
var diameter = radius * 2;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 402);
if(Math.abs(arc) > 360)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 404);
arc = 360;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 406);
this._currentX = x;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 407);
this._currentY = y;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 408);
startAngle *= -65535;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 409);
arc *= 65536;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 410);
startAngle = Math.round(startAngle);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 411);
arc = Math.round(arc);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 412);
this.moveTo(x, y);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 413);
this._addToPath(" ae " + this._round(x) + ", " + this._round(y) + ", " + this._round(radius) + " " + this._round(radius) + ", " +  startAngle + ", " + arc);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 414);
this._trackSize(diameter, diameter); 
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 415);
return this;
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "lineTo", 425);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 427);
this._lineTo.apply(this, [Y.Array(arguments), false]);
    },

    /**
     * Draws a line segment using the current line style from the current drawing position to the relative x and y coordinates.
     * 
     * @method relativeLineTo
     * @param {Number} point1 x-coordinate for the end point.
     * @param {Number} point2 y-coordinate for the end point.
     */
    relativeLineTo: function()
    {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "relativeLineTo", 437);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 439);
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
    _lineTo: function(args, relative) {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_lineTo", 450);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 451);
var point1 = args[0],
            i,
            len,
            x,
            y,
            path = relative ? " r " : " l ",
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 459);
len = args.length;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 460);
if (typeof point1 == "string" || typeof point1 == "number") {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 461);
for (i = 0; i < len; i = i + 2) {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 462);
x = parseFloat(args[i]);
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 463);
y = parseFloat(args[i + 1]);
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 464);
path += ' ' + this._round(x) + ', ' + this._round(y);
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 465);
x = x + relativeX;
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 466);
y = y + relativeY;
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 467);
this._currentX = x;
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 468);
this._currentY = y;
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 469);
this._trackSize.apply(this, [x, y]);
            }
        }
        else
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 474);
for (i = 0; i < len; i = i + 1) {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 475);
x = parseFloat(args[i][0]);
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 476);
y = parseFloat(args[i][1]);
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 477);
path += ' ' + this._round(x) + ', ' + this._round(y);
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 478);
x = x + relativeX;
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 479);
y = y + relativeY;
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 480);
this._currentX = x;
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 481);
this._currentY = y;
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 482);
this._trackSize.apply([x, y]);
            }
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 485);
this._addToPath(path);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 486);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "moveTo", 496);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 498);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "relativeMoveTo", 508);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 510);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_moveTo", 521);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 522);
var x = parseFloat(args[0]);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 523);
y = parseFloat(args[1]),
            command = relative ? " t " : " m ",
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 527);
this._movePath = command + this._round(x) + ", " + this._round(y);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 528);
x = x + relativeX;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 529);
y = y + relativeY;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 530);
this._trackSize(x, y);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 531);
this._currentX = x;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 532);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_closePath", 541);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 543);
var fill = this.get("fill"),
            stroke = this.get("stroke"),
            node = this.node,
            w = this.get("width"),
            h = this.get("height"),
            path = this._path,
            pathEnd = "",
            multiplier = this._coordSpaceMultiplier;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 551);
this._fillChangeHandler();
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 552);
this._strokeChangeHandler();
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 553);
if(path)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 555);
if(fill && fill.color)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 557);
pathEnd += ' x';
            }
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 559);
if(stroke)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 561);
pathEnd += ' e';
            }
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 564);
if(path)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 566);
node.path = path + pathEnd;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 568);
if(!isNaN(w) && !isNaN(h))
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 570);
node.coordOrigin = this._left + ", " + this._top;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 571);
node.coordSize = (w * multiplier) + ", " + (h * multiplier);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 572);
node.style.position = "absolute";
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 573);
node.style.width =  w + "px";
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 574);
node.style.height =  h + "px";
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 576);
this._path = path;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 577);
this._movePath = null;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 578);
this._updateTransform();
    },

    /**
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function()
    {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "end", 586);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 588);
this._closePath();
    },

    /**
     * Ends a fill and stroke
     *
     * @method closePath
     */
    closePath: function()
    {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "closePath", 596);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 598);
this._addToPath(" x e");
    },

    /**
     * Clears the path.
     *
     * @method clear
     */
    clear: function()
    {
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "clear", 606);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 608);
this._right = 0;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 609);
this._bottom = 0;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 610);
this._width = 0;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 611);
this._height = 0;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 612);
this._left = 0;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 613);
this._top = 0;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 614);
this._path = "";
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 615);
this._movePath = null;
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getBezierData", 627);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 628);
var n = points.length,
            tmp = [],
            i,
            j;

        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 633);
for (i = 0; i < n; ++i){
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 634);
tmp[i] = [points[i][0], points[i][1]]; // save input
        }
        
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 637);
for (j = 1; j < n; ++j) {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 638);
for (i = 0; i < n - j; ++i) {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 639);
tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 640);
tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1]; 
            }
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 643);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_setCurveBoundingBox", 655);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 657);
var i = 0,
            left = this._currentX,
            right = left,
            top = this._currentY,
            bottom = top,
            len = Math.round(Math.sqrt((w * w) + (h * h))),
            t = 1/len,
            xy;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 665);
for(; i < len; ++i)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 667);
xy = this.getBezierData(pts, t * i);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 668);
left = isNaN(left) ? xy[0] : Math.min(xy[0], left);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 669);
right = isNaN(right) ? xy[0] : Math.max(xy[0], right);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 670);
top = isNaN(top) ? xy[1] : Math.min(xy[1], top);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 671);
bottom = isNaN(bottom) ? xy[1] : Math.max(xy[1], bottom);
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 673);
left = Math.round(left * 10)/10;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 674);
right = Math.round(right * 10)/10;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 675);
top = Math.round(top * 10)/10;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 676);
bottom = Math.round(bottom * 10)/10;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 677);
this._trackSize(right, bottom);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 678);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_trackSize", 689);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 690);
if (w > this._right) {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 691);
this._right = w;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 693);
if(w < this._left)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 695);
this._left = w;    
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 697);
if (h < this._top)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 699);
this._top = h;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 701);
if (h > this._bottom) 
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 703);
this._bottom = h;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 705);
this._width = this._right - this._left;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 706);
this._height = this._bottom - this._top;
    },

    _left: 0,

    _right: 0,

    _top: 0,

    _bottom: 0,

    _width: 0,

    _height: 0
};
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 721);
Y.VMLDrawing = VMLDrawing;
/**
 * <a href="http://www.w3.org/TR/NOTE-VML">VML</a> implementation of the <a href="Shape.html">`Shape`</a> class. 
 * `VMLShape` is not intended to be used directly. Instead, use the <a href="Shape.html">`Shape`</a> class. 
 * If the browser lacks <a href="http://www.w3.org/TR/SVG/">SVG</a> and <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> 
 * capabilities, the <a href="Shape.html">`Shape`</a> class will point to the `VMLShape` class.
 *
 * @module graphics
 * @class VMLShape
 * @constructor
 * @param {Object} cfg (optional) Attribute configs
 */
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 733);
VMLShape = function() 
{
    _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "VMLShape", 733);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 735);
this._transforms = [];
    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 736);
this.matrix = new Y.Matrix();
    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 737);
this._normalizedMatrix = new Y.Matrix();
    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 738);
VMLShape.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("build/graphics-vml/graphics-vml.js", 741);
VMLShape.NAME = "shape";

_yuitest_coverline("build/graphics-vml/graphics-vml.js", 743);
Y.extend(VMLShape, Y.GraphicBase, Y.mix({
	/**
	 * Indicates the type of shape
	 *
	 * @property _type
	 * @type String
     * @private
	 */
	_type: "shape",
    
    /**
     * Init method, invoked during construction.
     * Calls `initializer` method.
     *
     * @method init
     * @protected
     */
	init: function()
	{
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "init", 760);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 762);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "initializer", 771);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 773);
var host = this,
            graphic = cfg.graphic,
            data = this.get("data");
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 776);
host.createNode();
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 777);
if(graphic)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 779);
this._setGraphic(graphic);
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 781);
if(data)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 783);
host._parsePathData(data);
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 785);
this._updateHandler();
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_setGraphic", 796);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 798);
var graphic;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 799);
if(render instanceof Y.VMLGraphic)
        {
		    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 801);
this._graphic = render;
        }
        else
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 805);
render = Y.one(render);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 806);
graphic = new Y.VMLGraphic({
                render: render
            });
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 809);
graphic._appendShape(this);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 810);
this._graphic = graphic;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 811);
this._appendStrokeAndFill();
        }
    },
    
    /**
     * Appends fill and stroke nodes to the shape.
     *
     * @method _appendStrokeAndFill
     * @private
     */
    _appendStrokeAndFill: function()
    {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_appendStrokeAndFill", 821);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 823);
if(this._strokeNode)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 825);
this.node.appendChild(this._strokeNode);
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 827);
if(this._fillNode)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 829);
this.node.appendChild(this._fillNode);
        }
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "createNode", 840);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 842);
var node,
            concat = this._camelCaseConcat,
			x = this.get("x"),
			y = this.get("y"),
            w = this.get("width"),
            h = this.get("height"),
			id,
			type,
			name = this.name,
            nodestring,
            visibility = this.get("visible") ? "visible" : "hidden",
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
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 863);
id = this.get("id");
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 864);
type = this._type == "path" ? "shape" : this._type;
		    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 865);
classString = _getClassName(SHAPE) + " " + _getClassName(concat(IMPLEMENTATION, SHAPE)) + " " + _getClassName(name) + " " + _getClassName(concat(IMPLEMENTATION, name)) + " " + IMPLEMENTATION + type; 
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 866);
stroke = this._getStrokeProps();
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 867);
fill = this._getFillProps();
			
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 869);
nodestring  = '<' + type + '  xmlns="urn:schemas-microsft.com:vml" id="' + id + '" class="' + classString + '" style="behavior:url(#default#VML);display:inline-block;position:absolute;left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;height:' + h + 'px;visibility:' + visibility + '"';

		    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 871);
if(stroke && stroke.weight && stroke.weight > 0)
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 873);
endcap = stroke.endcap;
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 874);
opacity = parseFloat(stroke.opacity);
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 875);
joinstyle = stroke.joinstyle;
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 876);
miterlimit = stroke.miterlimit;
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 877);
dashstyle = stroke.dashstyle;
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 878);
nodestring += ' stroked="t" strokecolor="' + stroke.color + '" strokeWeight="' + stroke.weight + 'px"';
				
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 880);
strokestring = '<stroke class="vmlstroke" xmlns="urn:schemas-microsft.com:vml" on="t" style="behavior:url(#default#VML);display:inline-block;"';
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 881);
strokestring += ' opacity="' + opacity + '"';
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 882);
if(endcap)
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 884);
strokestring += ' endcap="' + endcap + '"';
				}
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 886);
if(joinstyle)
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 888);
strokestring += ' joinstyle="' + joinstyle + '"';
				}
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 890);
if(miterlimit)
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 892);
strokestring += ' miterlimit="' + miterlimit + '"';
				}
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 894);
if(dashstyle)
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 896);
strokestring += ' dashstyle="' + dashstyle + '"';
				}
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 898);
strokestring += '></stroke>';
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 899);
this._strokeNode = DOCUMENT.createElement(strokestring);
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 900);
nodestring += ' stroked="t"';
			}
			else
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 904);
nodestring += ' stroked="f"';
			}
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 906);
if(fill)
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 908);
if(fill.node)
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 910);
fillstring = fill.node;
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 911);
this._fillNode = DOCUMENT.createElement(fillstring);
				}
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 913);
if(fill.color)
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 915);
nodestring += ' fillcolor="' + fill.color + '"';
				}
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 917);
nodestring += ' filled="' + fill.filled + '"';
			}
			
			
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 921);
nodestring += '>';
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 922);
nodestring += '</' + type + '>';
			
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 924);
node = DOCUMENT.createElement(nodestring);

            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 926);
this.node = node;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 927);
this._strokeFlag = false;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 928);
this._fillFlag = false;
	},

	/**
	 * Add a class name to each node.
	 *
	 * @method addClass
	 * @param {String} className the class name to add to the node's class attribute 
	 */
	addClass: function(className)
	{
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "addClass", 937);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 939);
var node = this.node;
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 940);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "removeClass", 949);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 951);
var node = this.node;
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 952);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getXY", 961);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 963);
var graphic = this._graphic,
			parentXY = graphic.getXY(),
			x = this.get("x"),
			y = this.get("y");
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 967);
return [parentXY[0] + x, parentXY[1] + y];
	},

	/**
	 * Set the position of the shape in page coordinates, regardless of how the node is positioned.
	 *
	 * @method setXY
	 * @param {Array} Contains x & y values for new position (coordinates are page-based)
     *
	 */
	setXY: function(xy)
	{
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setXY", 977);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 979);
var graphic = this._graphic,
			parentXY = graphic.getXY();
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 981);
this.set("x", xy[0] - parentXY[0]);
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 982);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "contains", 992);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 994);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "compareTo", 1004);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1005);
var node = this.node;

		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1007);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "test", 1017);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1019);
return Y_SELECTOR.test(this.node, selector);
	},

	/**
     * Calculates and returns properties for setting an initial stroke.
     *
     * @method _getStrokeProps
     * @return Object
     *
	 * @private
	 */
	 _getStrokeProps: function()
	 {
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_getStrokeProps", 1030);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1032);
var props,
			stroke = this.get("stroke"),
			strokeOpacity,
			dashstyle,
			dash = "",
			val,
			i = 0,
			len,
			linecap,
			linejoin;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1042);
if(stroke && stroke.weight && stroke.weight > 0)
		{
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1044);
props = {};
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1045);
linecap = stroke.linecap || "flat";
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1046);
linejoin = stroke.linejoin || "round";
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1047);
if(linecap != "round" && linecap != "square")
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1049);
linecap = "flat";
			}
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1051);
strokeOpacity = parseFloat(stroke.opacity);
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1052);
dashstyle = stroke.dashstyle || "none";
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1053);
stroke.color = stroke.color || "#000000";
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1054);
stroke.weight = stroke.weight || 1;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1055);
stroke.opacity = IS_NUM(strokeOpacity) ? strokeOpacity : 1;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1056);
props.stroked = true;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1057);
props.color = stroke.color;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1058);
props.weight = stroke.weight;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1059);
props.endcap = linecap;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1060);
props.opacity = stroke.opacity;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1061);
if(IS_ARRAY(dashstyle))
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1063);
dash = [];
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1064);
len = dashstyle.length;
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1065);
for(i = 0; i < len; ++i)
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1067);
val = dashstyle[i];
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1068);
dash[i] = val / stroke.weight;
				}
			}
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1071);
if(linejoin == "round" || linejoin == "bevel")
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1073);
props.joinstyle = linejoin;
			}
			else
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1077);
linejoin = parseInt(linejoin, 10);
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1078);
if(IS_NUM(linejoin))
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1080);
props.miterlimit = Math.max(linejoin, 1);
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1081);
props.joinstyle = "miter";
				}
			}
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1084);
props.dashstyle = dash;
		}
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1086);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_strokeChangeHandler", 1095);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1097);
if(!this._strokeFlag)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1099);
return;
        }
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1101);
var node = this.node,
			stroke = this.get("stroke"),
			strokeOpacity,
			dashstyle,
			dash = "",
			val,
			i = 0,
			len,
			linecap,
			linejoin;
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1111);
if(stroke && stroke.weight && stroke.weight > 0)
		{
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1113);
linecap = stroke.linecap || "flat";
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1114);
linejoin = stroke.linejoin || "round";
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1115);
if(linecap != "round" && linecap != "square")
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1117);
linecap = "flat";
			}
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1119);
strokeOpacity = parseFloat(stroke.opacity);
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1120);
dashstyle = stroke.dashstyle || "none";
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1121);
stroke.color = stroke.color || "#000000";
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1122);
stroke.weight = stroke.weight || 1;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1123);
stroke.opacity = IS_NUM(strokeOpacity) ? strokeOpacity : 1;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1124);
node.stroked = true;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1125);
node.strokeColor = stroke.color;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1126);
node.strokeWeight = stroke.weight + "px";
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1127);
if(!this._strokeNode)
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1129);
this._strokeNode = this._createGraphicNode("stroke");
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1130);
node.appendChild(this._strokeNode);
			}
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1132);
this._strokeNode.endcap = linecap;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1133);
this._strokeNode.opacity = stroke.opacity;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1134);
if(IS_ARRAY(dashstyle))
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1136);
dash = [];
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1137);
len = dashstyle.length;
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1138);
for(i = 0; i < len; ++i)
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1140);
val = dashstyle[i];
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1141);
dash[i] = val / stroke.weight;
				}
			}
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1144);
if(linejoin == "round" || linejoin == "bevel")
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1146);
this._strokeNode.joinstyle = linejoin;
			}
			else
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1150);
linejoin = parseInt(linejoin, 10);
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1151);
if(IS_NUM(linejoin))
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1153);
this._strokeNode.miterlimit = Math.max(linejoin, 1);
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1154);
this._strokeNode.joinstyle = "miter";
				}
			}
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1157);
this._strokeNode.dashstyle = dash;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1158);
this._strokeNode.on = true;
		}
		else
		{
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1162);
if(this._strokeNode)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1164);
this._strokeNode.on = false;
            }
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1166);
node.stroked = false;
		}
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1168);
this._strokeFlag = false;
	},

	/**
     * Calculates and returns properties for setting an initial fill.
     *
     * @method _getFillProps
     * @return Object
     *
	 * @private
	 */
	_getFillProps: function()
	{
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_getFillProps", 1179);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1181);
var fill = this.get("fill"),
			fillOpacity,
			props,
			gradient,
			i,
			fillstring,
			filled = false;
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1188);
if(fill)
		{
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1190);
props = {};
			
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1192);
if(fill.type == "radial" || fill.type == "linear")
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1194);
fillOpacity = parseFloat(fill.opacity);
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1195);
fillOpacity = IS_NUM(fillOpacity) ? fillOpacity : 1;
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1196);
filled = true;
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1197);
gradient = this._getGradientFill(fill);
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1198);
fillstring = '<fill xmlns="urn:schemas-microsft.com:vml" class="vmlfill" style="behavior:url(#default#VML);display:inline-block;" opacity="' + fillOpacity + '"';
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1199);
for(i in gradient)
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1201);
if(gradient.hasOwnProperty(i))
					{
						_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1203);
fillstring += ' ' + i + '="' + gradient[i] + '"';
					}
				}
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1206);
fillstring += ' />';
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1207);
props.node = fillstring;
			}
			else {_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1209);
if(fill.color)
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1211);
fillOpacity = parseFloat(fill.opacity);
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1212);
filled = true;
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1213);
props.color = fill.color;
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1214);
if(IS_NUM(fillOpacity))
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1216);
fillOpacity = Math.max(Math.min(fillOpacity, 1), 0);
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1217);
props.opacity = fillOpacity;    
				    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1218);
if(fillOpacity < 1)
                    {
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1220);
props.node = '<fill xmlns="urn:schemas-microsft.com:vml" class="vmlfill" style="behavior:url(#default#VML);display:inline-block;" type="solid" opacity="' + fillOpacity + '"/>';
				    }
                }
			}}
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1224);
props.filled = filled;
		}
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1226);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_fillChangeHandler", 1235);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1237);
if(!this._fillFlag)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1239);
return;
        }
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1241);
var node = this.node,
			fill = this.get("fill"),
			fillOpacity,
			fillstring,
			filled = false,
            i,
            gradient;
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1248);
if(fill)
		{
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1250);
if(fill.type == "radial" || fill.type == "linear")
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1252);
filled = true;
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1253);
gradient = this._getGradientFill(fill);
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1254);
if(this._fillNode)
                {
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1256);
for(i in gradient)
                    {
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1258);
if(gradient.hasOwnProperty(i))
                        {
                            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1260);
if(i == "colors")
                            {
                                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1262);
this._fillNode.colors.value = gradient[i];
                            }
                            else
                            {
                                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1266);
this._fillNode[i] = gradient[i];
                            }
                        }
                    }
                }
                else
                {
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1273);
fillstring = '<fill xmlns="urn:schemas-microsft.com:vml" class="vmlfill" style="behavior:url(#default#VML);display:inline-block;"';
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1274);
for(i in gradient)
                    {
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1276);
if(gradient.hasOwnProperty(i))
                        {
                            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1278);
fillstring += ' ' + i + '="' + gradient[i] + '"';
                        }
                    }
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1281);
fillstring += ' />';
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1282);
this._fillNode = DOCUMENT.createElement(fillstring);
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1283);
node.appendChild(this._fillNode);
                }
			}
			else {_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1286);
if(fill.color)
			{
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1288);
node.fillcolor = fill.color;
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1289);
fillOpacity = parseFloat(fill.opacity);
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1290);
filled = true;
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1291);
if(IS_NUM(fillOpacity) && fillOpacity < 1)
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1293);
fill.opacity = fillOpacity;
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1294);
if(this._fillNode)
					{
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1296);
if(this._fillNode.getAttribute("type") != "solid")
                        {
                            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1298);
this._fillNode.type = "solid";
                        }
						_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1300);
this._fillNode.opacity = fillOpacity;
					}
					else
					{     
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1304);
fillstring = '<fill xmlns="urn:schemas-microsft.com:vml" class="vmlfill" style="behavior:url(#default#VML);display:inline-block;" type="solid" opacity="' + fillOpacity + '"/>';
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1305);
this._fillNode = DOCUMENT.createElement(fillstring);
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1306);
node.appendChild(this._fillNode);
					}
				}
				else {_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1309);
if(this._fillNode)
                {   
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1311);
this._fillNode.opacity = 1;
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1312);
this._fillNode.type = "solid";
				}}
			}}
		}
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1316);
node.filled = filled;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1317);
this._fillFlag = false;
	},

	//not used. remove next release.
    _updateFillNode: function(node)
	{
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_updateFillNode", 1321);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1323);
if(!this._fillNode)
		{
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1325);
this._fillNode = this._createGraphicNode("fill");
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1326);
node.appendChild(this._fillNode);
		}
	},

    /**
     * Calculates and returns an object containing gradient properties for a fill node. 
     *
     * @method _getGradientFill
     * @param {Object} fill Object containing fill properties.
     * @return Object
     * @private
     */
	_getGradientFill: function(fill)
	{
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_getGradientFill", 1338);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1340);
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
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1362);
if(type === "linear")
		{
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1364);
if(rotation <= 270)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1366);
rotation = Math.abs(rotation - 270);
            }
			else {_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1368);
if(rotation < 360)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1370);
rotation = 270 + (360 - rotation);
            }
            else
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1374);
rotation = 270;
            }}
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1376);
gradientProps.type = "gradient";//"gradientunscaled";
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1377);
gradientProps.angle = rotation;
		}
		else {_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1379);
if(type === "radial")
		{
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1381);
gradientBoxWidth = w * (r * 2);
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1382);
gradientBoxHeight = h * (r * 2);
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1383);
fx = r * 2 * (fx - 0.5);
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1384);
fy = r * 2 * (fy - 0.5);
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1385);
fx += cx;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1386);
fy += cy;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1387);
gradientProps.focussize = (gradientBoxWidth/w)/10 + "% " + (gradientBoxHeight/h)/10 + "%";
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1388);
gradientProps.alignshape = false;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1389);
gradientProps.type = "gradientradial";
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1390);
gradientProps.focus = "100%";
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1391);
gradientProps.focusposition = Math.round(fx * 100) + "% " + Math.round(fy * 100) + "%";
		}}
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1393);
for(;i < len; ++i) {
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1394);
stop = stops[i];
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1395);
color = stop.color;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1396);
opacity = stop.opacity;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1397);
opacity = isNumber(opacity) ? opacity : 1;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1398);
pct = stop.offset || i/(len-1);
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1399);
pct *= (r * 2);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1400);
pct = Math.round(100 * pct) + "%";
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1401);
oi = i > 0 ? i + 1 : "";
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1402);
gradientProps["opacity" + oi] = opacity + "";
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1403);
colorstring += ", " + pct + " " + color;
		}
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1405);
if(parseFloat(pct) < 100)
		{
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1407);
colorstring += ", 100% " + color;
		}
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1409);
gradientProps.colors = colorstring.substr(2);
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1410);
return gradientProps;
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_addTransform", 1421);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1423);
args = Y.Array(args);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1424);
this._transform = Y_LANG.trim(this._transform + " " + type + "(" + args.join(", ") + ")");
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1425);
args.unshift(type);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1426);
this._transforms.push(args);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1427);
if(this.initialized)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1429);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_updateTransform", 1439);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1441);
var node = this.node,
            key,
			transform,
			transformOrigin,
            x = this.get("x"),
            y = this.get("y"),
            tx,
            ty,
            matrix = this.matrix,
            normalizedMatrix = this._normalizedMatrix,
            isPathShape = this instanceof Y.VMLPath,
            i = 0,
            len = this._transforms.length;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1454);
if(this._transforms && this._transforms.length > 0)
		{
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1456);
transformOrigin = this.get("transformOrigin");
       
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1458);
if(isPathShape)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1460);
normalizedMatrix.translate(this._left, this._top);
            }
            //vml skew matrix transformOrigin ranges from -0.5 to 0.5.
            //subtract 0.5 from values
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1464);
tx = transformOrigin[0] - 0.5;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1465);
ty = transformOrigin[1] - 0.5;
            
            //ensure the values are within the appropriate range to avoid errors
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1468);
tx = Math.max(-0.5, Math.min(0.5, tx));
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1469);
ty = Math.max(-0.5, Math.min(0.5, ty));
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1470);
for(; i < len; ++i)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1472);
key = this._transforms[i].shift();
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1473);
if(key)
                {
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1475);
normalizedMatrix[key].apply(normalizedMatrix, this._transforms[i]); 
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1476);
matrix[key].apply(matrix, this._transforms[i]); 
                }
			}
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1479);
if(isPathShape)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1481);
normalizedMatrix.translate(-this._left, -this._top);
            }
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1483);
transform = normalizedMatrix.a + "," + 
                        normalizedMatrix.c + "," + 
                        normalizedMatrix.b + "," + 
                        normalizedMatrix.d + "," + 
                        0 + "," +
                        0;
		}
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1490);
this._graphic.addToRedrawQueue(this);    
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1491);
if(transform)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1493);
if(!this._skew)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1495);
this._skew = DOCUMENT.createElement( '<skew class="vmlskew" xmlns="urn:schemas-microsft.com:vml" on="false" style="behavior:url(#default#VML);display:inline-block;" />');
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1496);
this.node.appendChild(this._skew); 
            }
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1498);
this._skew.matrix = transform;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1499);
this._skew.on = true;
            //this._skew.offset = this._getSkewOffsetValue(normalizedMatrix.dx) + "px, " + this._getSkewOffsetValue(normalizedMatrix.dy) + "px";
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1501);
this._skew.origin = tx + ", " + ty;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1503);
if(this._type != "path")
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1505);
this._transforms = [];
        }
        //add the translate to the x and y coordinates
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1508);
node.style.left = (x + this._getSkewOffsetValue(normalizedMatrix.dx)) + "px";
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1509);
node.style.top =  (y + this._getSkewOffsetValue(normalizedMatrix.dy)) + "px";
    },
    
    /**
     * Normalizes the skew offset values between -32767 and 32767.
     *
     * @method _getSkewOffsetValue
     * @param {Number} val The value to normalize
     * @return Number
     * @private
     */
    _getSkewOffsetValue: function(val)
    {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_getSkewOffsetValue", 1520);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1522);
var sign = Y.MatrixUtil.sign(val),
            absVal = Math.abs(val);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1524);
val = Math.min(absVal, 32767) * sign;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1525);
return val;
    },
	
	/**
	 * Storage for translateX
	 *
     * @property _translateX
     * @type Number
	 * @private
	 */
	_translateX: 0,

	/**
	 * Storage for translateY
	 *
     * @property _translateY
     * @type Number
	 * @private
	 */
	_translateY: 0,
    
    /**
     * Storage for the transform attribute.
     *
     * @property _transform
     * @type String
     * @private
     */
    _transform: "",
	
    /**
	 * Specifies a 2d translation.
	 *
	 * @method translate
	 * @param {Number} x The value to translate on the x-axis.
	 * @param {Number} y The value to translate on the y-axis.
	 */
	translate: function(x, y)
	{
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "translate", 1562);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1564);
this._translateX += x;
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1565);
this._translateY += y;
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1566);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "translateX", 1576);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1578);
this._translateX += x;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1579);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "translateY", 1589);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1591);
this._translateY += y;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1592);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "skew", 1602);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1604);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "skewX", 1613);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1615);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "skewY", 1624);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1626);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "rotate", 1635);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1637);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "scale", 1646);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1648);
this._addTransform("scale", arguments);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "on", 1660);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1662);
if(Y.Node.DOM_EVENTS[type])
		{
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1664);
return Y.one("#" +  this.get("id")).on(type, fn);
		}
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1666);
return Y.on.apply(this, arguments);
	},

	/**
	 * Draws the shape.
	 *
	 * @method _draw
	 * @private
	 */
	_draw: function()
	{
	},

	/**
     * Updates `Shape` based on attribute changes.
     *
     * @method _updateHandler
	 * @private
	 */
	_updateHandler: function(e)
	{
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_updateHandler", 1685);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1687);
var host = this,
            node = host.node;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1689);
host._fillChangeHandler();
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1690);
host._strokeChangeHandler();
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1691);
node.style.width = this.get("width") + "px";
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1692);
node.style.height = this.get("height") + "px"; 
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1693);
this._draw();
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1694);
host._updateTransform();
	},

	/**
	 * Creates a graphic node
	 *
	 * @method _createGraphicNode
	 * @param {String} type node type to create
	 * @return HTMLElement
	 * @private
	 */
	_createGraphicNode: function(type)
	{
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_createGraphicNode", 1705);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1707);
type = type || this._type;
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1708);
return DOCUMENT.createElement('<' + type + ' xmlns="urn:schemas-microsft.com:vml" style="behavior:url(#default#VML);display:inline-block;" class="vml' + type + '"/>');
	},

	/**
	 * Value function for fill attribute
	 *
	 * @private
	 * @method _getDefaultFill
	 * @return Object
	 */
	_getDefaultFill: function() {
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_getDefaultFill", 1718);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1719);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_getDefaultStroke", 1736);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1738);
return {
			weight: 1,
			dashstyle: "none",
			color: "#000",
			opacity: 1.0
		};
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "set", 1755);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1757);
var host = this;
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1758);
AttributeLite.prototype.set.apply(host, arguments);
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1759);
if(host.initialized)
		{
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1761);
host._updateHandler();
		}
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getBounds", 1774);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1776);
var isPathShape = this instanceof Y.VMLPath,
			w = this.get("width"),
			h = this.get("height"),
            x = this.get("x"),
            y = this.get("y");
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1781);
if(isPathShape)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1783);
x = x + this._left;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1784);
y = y + this._top;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1785);
w = this._right - this._left;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1786);
h = this._bottom - this._top;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1788);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_getContentRect", 1801);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1803);
var transformOrigin = this.get("transformOrigin"),
            transformX = transformOrigin[0] * w,
            transformY = transformOrigin[1] * h,
		    transforms = this.matrix.getTransformArray(this.get("transform")),
            matrix = new Y.Matrix(),
            i = 0,
            len = transforms.length,
            transform,
            key,
            contentRect,
            isPathShape = this instanceof Y.VMLPath;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1814);
if(isPathShape)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1816);
matrix.translate(this._left, this._top);
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1818);
transformX = !isNaN(transformX) ? transformX : 0;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1819);
transformY = !isNaN(transformY) ? transformY : 0;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1820);
matrix.translate(transformX, transformY);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1821);
for(; i < len; i = i + 1)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1823);
transform = transforms[i];
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1824);
key = transform.shift();
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1825);
if(key)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1827);
matrix[key].apply(matrix, transform); 
            }
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1830);
matrix.translate(-transformX, -transformY);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1831);
if(isPathShape)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1833);
matrix.translate(-this._left, -this._top);
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1835);
contentRect = matrix.getContentRect(w, h, x, y);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1836);
return contentRect;
    },

    /**
     * Places the shape above all other shapes.
     *
     * @method toFront
     */
    toFront: function()
    {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "toFront", 1844);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1846);
var graphic = this.get("graphic");
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1847);
if(graphic)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1849);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "toBack", 1858);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1860);
var graphic = this.get("graphic");
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1861);
if(graphic)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1863);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_parsePathData", 1874);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1876);
var method,
            methodSymbol,
            args,
            commandArray = Y.Lang.trim(val.match(SPLITPATHPATTERN)),
            i = 0,
            len, 
            str,
            symbolToMethod = this._pathSymbolToMethod;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1884);
if(commandArray)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1886);
this.clear();
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1887);
len = commandArray.length || 0;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1888);
for(; i < len; i = i + 1)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1890);
str = commandArray[i];
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1891);
methodSymbol = str.substr(0, 1),
                args = str.substr(1).match(SPLITARGSPATTERN);
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1893);
method = symbolToMethod[methodSymbol];
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1894);
if(method)
                {
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1896);
if(args)
                    {
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1898);
this[method].apply(this, args);
                    }
                    else
                    {
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1902);
this[method].apply(this);
                    }
                }
            }
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1906);
this.end();
        }
    },
	
    /**
     *  Destroys shape
     *
     *  @method destroy
     */
    destroy: function()
    {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "destroy", 1915);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1917);
var graphic = this.get("graphic");
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1918);
if(graphic)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1920);
graphic.removeShape(this);
        }
        else
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1924);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_destroy", 1934);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1936);
if(this.node)
        {   
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1938);
if(this._fillNode)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1940);
this.node.removeChild(this._fillNode);
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1941);
this._fillNode = null;
            }
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1943);
if(this._strokeNode)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1945);
this.node.removeChild(this._strokeNode);
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1946);
this._strokeNode = null;
            }
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1948);
Y.one(this.node).remove(true);
        }
    }
}, Y.VMLDrawing.prototype));

_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1953);
VMLShape.ATTRS = {
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
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "valueFn", 1962);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1964);
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
            _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 1998);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2000);
var i = 0,
                len,
                transform;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2003);
this.matrix.init();	
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2004);
this._normalizedMatrix.init();	
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2005);
this._transforms = this.matrix.getTransformArray(val);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2006);
len = this._transforms.length;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2007);
for(;i < len; ++i)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2009);
transform = this._transforms[i];
            }
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2011);
this._transform = val;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2012);
return val;
		},

        getter: function()
        {
            _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getter", 2015);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2017);
return this._transform;
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
	 * Unique id for class instance.
	 *
	 * @config id
	 * @type String
	 */
	id: {
		valueFn: function()
		{
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "valueFn", 2048);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2050);
return Y.guid();
		},

		setter: function(val)
		{
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 2053);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2055);
var node = this.node;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2056);
if(node)
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2058);
node.setAttribute("id", val);
			}
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2060);
return val;
		}
	},
	
	/**
	 * 
	 * @config width
	 */
	width: {
		value: 0
	},

	/**
	 * 
	 * @config height
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
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 2089);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2090);
var node = this.node,
				visibility = val ? "visible" : "hidden";
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2092);
if(node)
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2094);
node.style.visibility = visibility;
			}
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2096);
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
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 2146);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2148);
var i,
				fill,
				tmpl = this.get("fill") || this._getDefaultFill();
			
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2152);
if(val)
			{
				//ensure, fill type is solid if color is explicitly passed.
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2155);
if(val.hasOwnProperty("color"))
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2157);
val.type = "solid";
				}
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2159);
for(i in val)
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2161);
if(val.hasOwnProperty(i))
					{   
						_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2163);
tmpl[i] = val[i];
					}
				}
			}
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2167);
fill = tmpl;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2168);
if(fill && fill.color)
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2170);
if(fill.color === undefined || fill.color == "none")
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2172);
fill.color = null;
				}
			}
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2175);
this._fillFlag = true;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2176);
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
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 2211);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2213);
var i,
				stroke,
                wt,
				tmpl = this.get("stroke") || this._getDefaultStroke();
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2217);
if(val)
			{
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2219);
if(val.hasOwnProperty("weight"))
                {
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2221);
wt = parseInt(val.weight, 10);
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2222);
if(!isNaN(wt))
                    {
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2224);
val.weight = wt;
                    }
                }
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2227);
for(i in val)
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2229);
if(val.hasOwnProperty(i))
					{   
						_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2231);
tmpl[i] = val[i];
					}
				}
			}
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2235);
stroke = tmpl;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2236);
this._strokeFlag = true;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2237);
return stroke;
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
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getter", 2266);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2268);
return this.node;
		}
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
            _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 2279);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2281);
if(this.get("node"))
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2283);
this._parsePathData(val);
            }
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2285);
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
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getter", 2298);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2300);
return this._graphic;
		}
	}
};
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2304);
Y.VMLShape = VMLShape;
/**
 * <a href="http://www.w3.org/TR/NOTE-VML">VML</a> implementation of the <a href="Path.html">`Path`</a> class. 
 * `VMLPath` is not intended to be used directly. Instead, use the <a href="Path.html">`Path`</a> class. 
 * If the browser lacks <a href="http://www.w3.org/TR/SVG/">SVG</a> and <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> 
 * capabilities, the <a href="Path.html">`Path`</a> class will point to the `VMLPath` class.
 *
 * @module graphics
 * @class VMLPath
 * @extends VMLShape
 */
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2315);
VMLPath = function()
{
	_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "VMLPath", 2315);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2317);
VMLPath.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2320);
VMLPath.NAME = "path";
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2321);
Y.extend(VMLPath, Y.VMLShape);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2322);
VMLPath.ATTRS = Y.merge(Y.VMLShape.ATTRS, {
	/**
	 * Indicates the width of the shape
	 * 
	 * @config width
	 * @type Number
	 */
	width: {
		getter: function()
		{
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getter", 2330);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2332);
var val = Math.max(this._right - this._left, 0);
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2333);
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
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getter", 2344);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2346);
return Math.max(this._bottom - this._top, 0);
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
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getter", 2360);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2362);
return this._path;
		}
	}
});
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2366);
Y.VMLPath = VMLPath;
/**
 * <a href="http://www.w3.org/TR/NOTE-VML">VML</a> implementation of the <a href="Rect.html">`Rect`</a> class. 
 * `VMLRect` is not intended to be used directly. Instead, use the <a href="Rect.html">`Rect`</a> class. 
 * If the browser lacks <a href="http://www.w3.org/TR/SVG/">SVG</a> and <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> 
 * capabilities, the <a href="Rect.html">`Rect`</a> class will point to the `VMLRect` class.
 *
 * @module graphics
 * @class VMLRect
 * @constructor
 */
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2377);
VMLRect = function()
{
	_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "VMLRect", 2377);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2379);
VMLRect.superclass.constructor.apply(this, arguments);
};
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2381);
VMLRect.NAME = "rect"; 
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2382);
Y.extend(VMLRect, Y.VMLShape, {
	/**
	 * Indicates the type of shape
	 *
	 * @property _type
	 * @type String
     * @private
	 */
	_type: "rect"
});
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2392);
VMLRect.ATTRS = Y.VMLShape.ATTRS;
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2393);
Y.VMLRect = VMLRect;
/**
 * <a href="http://www.w3.org/TR/NOTE-VML">VML</a> implementation of the <a href="Ellipse.html">`Ellipse`</a> class. 
 * `VMLEllipse` is not intended to be used directly. Instead, use the <a href="Ellipse.html">`Ellipse`</a> class. 
 * If the browser lacks <a href="http://www.w3.org/TR/SVG/">SVG</a> and <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> 
 * capabilities, the <a href="Ellipse.html">`Ellipse`</a> class will point to the `VMLEllipse` class.
 *
 * @module graphics
 * @class VMLEllipse
 * @constructor
 */
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2404);
VMLEllipse = function()
{
	_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "VMLEllipse", 2404);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2406);
VMLEllipse.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2409);
VMLEllipse.NAME = "ellipse";

_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2411);
Y.extend(VMLEllipse, Y.VMLShape, {
	/**
	 * Indicates the type of shape
	 *
	 * @property _type
	 * @type String
     * @private
	 */
	_type: "oval"
});
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2421);
VMLEllipse.ATTRS = Y.merge(Y.VMLShape.ATTRS, {
	/**
	 * Horizontal radius for the ellipse. 
	 *
	 * @config xRadius
	 * @type Number
	 */
	xRadius: {
		lazyAdd: false,

		getter: function()
		{
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getter", 2431);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2433);
var val = this.get("width");
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2434);
val = Math.round((val/2) * 100)/100;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2435);
return val;
		},
		
		setter: function(val)
		{
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 2438);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2440);
var w = val * 2; 
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2441);
this.set("width", w);
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2442);
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
		lazyAdd: false,
		
		getter: function()
		{
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getter", 2456);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2458);
var val = this.get("height");
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2459);
val = Math.round((val/2) * 100)/100;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2460);
return val;
		},

		setter: function(val)
		{
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 2463);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2465);
var h = val * 2;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2466);
this.set("height", h);
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2467);
return val;
		}
	}
});
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2471);
Y.VMLEllipse = VMLEllipse;
/**
 * <a href="http://www.w3.org/TR/NOTE-VML">VML</a> implementation of the <a href="Circle.html">`Circle`</a> class. 
 * `VMLCircle` is not intended to be used directly. Instead, use the <a href="Circle.html">`Circle`</a> class. 
 * If the browser lacks <a href="http://www.w3.org/TR/SVG/">SVG</a> and <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> 
 * capabilities, the <a href="Circle.html">`Circle`</a> class will point to the `VMLCircle` class.
 *
 * @module graphics
 * @class VMLCircle
 * @constructor
 */
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2482);
VMLCircle = function(cfg)
{
	_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "VMLCircle", 2482);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2484);
VMLCircle.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2487);
VMLCircle.NAME = "circle";

_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2489);
Y.extend(VMLCircle, VMLShape, {
	/**
	 * Indicates the type of shape
	 *
	 * @property _type
	 * @type String
     * @private
	 */
	_type: "oval"
});

_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2500);
VMLCircle.ATTRS = Y.merge(VMLShape.ATTRS, {
	/**
	 * Radius for the circle.
	 *
	 * @config radius
	 * @type Number
	 */
	radius: {
		lazyAdd: false,

		value: 0
	},

	/**
	 * Indicates the width of the shape
	 *
	 * @config width
	 * @type Number
	 */
	width: {
        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 2520);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2522);
this.set("radius", val/2);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2523);
return val;
        },

		getter: function()
		{   
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getter", 2526);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2528);
var radius = this.get("radius"),
			val = radius && radius > 0 ? radius * 2 : 0;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2530);
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
        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 2541);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2543);
this.set("radius", val/2);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2544);
return val;
        },

		getter: function()
		{   
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getter", 2547);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2549);
var radius = this.get("radius"),
			val = radius && radius > 0 ? radius * 2 : 0;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2551);
return val;
		}
	}
});
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2555);
Y.VMLCircle = VMLCircle;
/**
 * Draws pie slices
 *
 * @module graphics
 * @class VMLPieSlice
 * @constructor
 */
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2563);
VMLPieSlice = function()
{
	_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "VMLPieSlice", 2563);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2565);
VMLPieSlice.superclass.constructor.apply(this, arguments);
};
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2567);
VMLPieSlice.NAME = "vmlPieSlice";
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2568);
Y.extend(VMLPieSlice, Y.VMLShape, Y.mix({
    /**
     * Indicates the type of shape
     *
     * @property _type
     * @type String
     * @private
     */
    _type: "shape",

	/**
	 * Change event listener
	 *
	 * @private
	 * @method _updateHandler
	 */
	_draw: function(e)
	{
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_draw", 2584);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2586);
var x = this.get("cx"),
            y = this.get("cy"),
            startAngle = this.get("startAngle"),
            arc = this.get("arc"),
            radius = this.get("radius");
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2591);
this.clear();
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2592);
this.drawWedge(x, y, startAngle, arc, radius);
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2593);
this.end();
	}
 }, Y.VMLDrawing.prototype));
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2596);
VMLPieSlice.ATTRS = Y.mix({
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
}, Y.VMLShape.ATTRS);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2634);
Y.VMLPieSlice = VMLPieSlice;
/**
 * <a href="http://www.w3.org/TR/NOTE-VML">VML</a> implementation of the <a href="Graphic.html">`Graphic`</a> class. 
 * `VMLGraphic` is not intended to be used directly. Instead, use the <a href="Graphic.html">`Graphic`</a> class. 
 * If the browser lacks <a href="http://www.w3.org/TR/SVG/">SVG</a> and <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> 
 * capabilities, the <a href="Graphic.html">`Graphic`</a> class will point to the `VMLGraphic` class.
 *
 * @module graphics
 * @class VMLGraphic
 * @constructor
 */
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2645);
VMLGraphic = function() {
    _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "VMLGraphic", 2645);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2646);
VMLGraphic.superclass.constructor.apply(this, arguments);    
};

_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2649);
VMLGraphic.NAME = "vmlGraphic";

_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2651);
VMLGraphic.ATTRS = {
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
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "valueFn", 2667);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2669);
return Y.guid();
		},

		setter: function(val)
		{
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 2672);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2674);
var node = this._node;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2675);
if(node)
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2677);
node.setAttribute("id", val);
			}
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2679);
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
            _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getter", 2693);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2695);
return this._shapes;
        }
    },

    /**
     *  Object containing size and coordinate data for the content of a Graphic in relation to the coordSpace node.
     *
     *  @config contentBounds
     *  @type Object
     */
    contentBounds: {
        readOnly: true,

        getter: function()
        {
            _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getter", 2708);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2710);
return this._contentBounds;
        }
    },

    /**
     *  The html element that represents to coordinate system of the Graphic instance.
     *
     *  @config node
     *  @type HTMLElement
     */
    node: {
        readOnly: true,

        getter: function()
        {
            _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getter", 2723);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2725);
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
            _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 2736);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2738);
if(this._node)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2740);
this._node.style.width = val + "px";
            }
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2742);
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
            _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 2753);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2755);
if(this._node)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2757);
this._node.style.height = val + "px";
            }
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2759);
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
     * The contentBounds will resize to greater values but not values. (for performance)
     * When resizing the contentBounds down is desirable, set the resizeDown value to true.
     *
     * @config resizeDown 
     * @type Boolean
     */
    resizeDown: {
        resizeDown: false
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
            _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getter", 2827);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2829);
return this._x;
        },

        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 2832);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2834);
this._x = val;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2835);
if(this._node)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2837);
this._node.style.left = val + "px";
            }
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2839);
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
            _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getter", 2850);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2852);
return this._y;
        },

        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 2855);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2857);
this._y = val;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2858);
if(this._node)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2860);
this._node.style.top = val + "px";
            }
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2862);
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

    visible: {
        value: true,

        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 2882);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2884);
this._toggleVisible(val);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2885);
return val;
        }
    }
};

_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2890);
Y.extend(VMLGraphic, Y.GraphicBase, {
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "set", 2900);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2902);
var host = this,
            redrawAttrs = {
                autoDraw: true,
                autoSize: true,
                preserveAspectRatio: true,
                resizeDown: true
            },
            key,
            forceRedraw = false;
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2911);
AttributeLite.prototype.set.apply(host, arguments);	
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2912);
if(host._state.autoDraw === true && Y.Object.size(this._shapes) > 0)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2914);
if(Y_LANG.isString && redrawAttrs[attr])
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2916);
forceRedraw = true;
            }
            else {_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2918);
if(Y_LANG.isObject(attr))
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2920);
for(key in redrawAttrs)
                {
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2922);
if(redrawAttrs.hasOwnProperty(key) && attr[key])
                    {
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2924);
forceRedraw = true;
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2925);
break;
                    }
                }
            }}
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2930);
if(forceRedraw)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2932);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getXY", 2960);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2962);
var node = this.parentNode,
            x = this.get("x"),
            y = this.get("y"),
            xy;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2966);
if(node)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2968);
xy = Y.one(node).getXY();
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2969);
xy[0] += x;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2970);
xy[1] += y;
        }
        else
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2974);
xy = Y.DOM._getOffset(this._node);
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2976);
return xy;
    },

    /**
     * Initializes the class.
     *
     * @method initializer
     * @private
     */
    initializer: function(config) {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "initializer", 2985);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2986);
var render = this.get("render"),
            visibility = this.get("visible") ? "visible" : "hidden";
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2988);
this._shapes = {};
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2989);
this._contentBounds = {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        };
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2995);
this._node = DOCUMENT.createElement('div');
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2996);
this._node.style.position = "absolute";
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2997);
this._node.style.left = this.get("x") + "px";
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2998);
this._node.style.top = this.get("y") + "px";
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2999);
this._node.style.visibility = visibility;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3000);
this._node.setAttribute("id", this.get("id"));
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3001);
this._contentNode = this._createGraphic();
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3002);
this._contentNode.style.position = "absolute";
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3003);
this._contentNode.style.left = "0px";
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3004);
this._contentNode.style.top = "0px";
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3005);
this._contentNode.style.visibility = visibility;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3006);
this._node.appendChild(this._contentNode);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3007);
if(render)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3009);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "render", 3019);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3020);
var parentNode = Y.one(render),
            w = this.get("width") || parseInt(parentNode.getComputedStyle("width"), 10),
            h = this.get("height") || parseInt(parentNode.getComputedStyle("height"), 10);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3023);
parentNode = parentNode || DOCUMENT.body;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3024);
parentNode.appendChild(this._node);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3025);
this.parentNode = parentNode;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3026);
this.set("width", w);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3027);
this.set("height", h);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3028);
return this;
    },

    /**
     * Removes all nodes.
     *
     * @method destroy
     */
    destroy: function()
    {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "destroy", 3036);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3038);
this.clear();
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3039);
Y.one(this._node).remove(true);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "addShape", 3049);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3051);
cfg.graphic = this;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3052);
if(!this.get("visible"))
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3054);
cfg.visible = false;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3056);
var shapeClass = this._getShapeClass(cfg.type),
            shape = new shapeClass(cfg);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3058);
this._appendShape(shape);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3059);
shape._appendStrokeAndFill();
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3060);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_appendShape", 3070);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3072);
var node = shape.node,
            parentNode = this._frag || this._contentNode;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3074);
if(this.get("autoDraw") || this.get("autoSize") == "sizeContentToGraphic") 
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3076);
parentNode.appendChild(node);
        }
        else
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3080);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "removeShape", 3090);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3092);
if(!(shape instanceof VMLShape))
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3094);
if(Y_LANG.isString(shape))
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3096);
shape = this._shapes[shape];
            }
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3099);
if(shape && (shape instanceof VMLShape))
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3101);
shape._destroy();
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3102);
this._shapes[shape.get("id")] = null;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3103);
delete this._shapes[shape.get("id")];
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3105);
if(this.get("autoDraw"))
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3107);
this._redraw();
        }
    },

    /**
     * Removes all shape instances from the dom.
     *
     * @method removeAllShapes
     */
    removeAllShapes: function()
    {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "removeAllShapes", 3116);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3118);
var shapes = this._shapes,
            i;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3120);
for(i in shapes)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3122);
if(shapes.hasOwnProperty(i))
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3124);
shapes[i].destroy();
            }
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3127);
this._shapes = {};
    },

    /**
     * Removes all child nodes.
     *
     * @method _removeChildren
     * @param node
     * @private
     */
    _removeChildren: function(node)
    {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_removeChildren", 3137);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3139);
if(node.hasChildNodes())
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3141);
var child;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3142);
while(node.firstChild)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3144);
child = node.firstChild;
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3145);
this._removeChildren(child);
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3146);
node.removeChild(child);
            }
        }
    },

    /**
     * Clears the graphics object.
     *
     * @method clear
     */
    clear: function() {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "clear", 3156);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3157);
this.removeAllShapes();
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3158);
this._removeChildren(this._contentNode);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_toggleVisible", 3168);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3170);
var i,
            shapes = this._shapes,
            visibility = val ? "visible" : "hidden";
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3173);
if(shapes)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3175);
for(i in shapes)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3177);
if(shapes.hasOwnProperty(i))
                {
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3179);
shapes[i].set("visible", val);
                }
            }
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3183);
if(this._contentNode)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3185);
this._contentNode.style.visibility = visibility;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3187);
if(this._node)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3189);
this._node.style.visibility = visibility;
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setSize", 3200);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3201);
w = Math.round(w);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3202);
h = Math.round(h);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3203);
this._node.style.width = w + 'px';
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3204);
this._node.style.height = h + 'px';
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setPosition", 3214);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3216);
x = Math.round(x);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3217);
y = Math.round(y);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3218);
this._node.style.left = x + "px";
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3219);
this._node.style.top = y + "px";
    },

    /**
     * Creates a group element
     *
     * @method _createGraphic
     * @private
     */
    _createGraphic: function() {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_createGraphic", 3228);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3229);
var group = DOCUMENT.createElement('<group xmlns="urn:schemas-microsft.com:vml" style="behavior:url(#default#VML);display:block;position:absolute;top:0px;left:0px;zoom:1;" />');
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3230);
return group;
    },

    /**
     * Creates a graphic node
     *
     * @method _createGraphicNode
     * @param {String} type node type to create
     * @param {String} pe specified pointer-events value
     * @return HTMLElement
     * @private
     */
    _createGraphicNode: function(type)
    {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_createGraphicNode", 3242);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3244);
return DOCUMENT.createElement('<' + type + ' xmlns="urn:schemas-microsft.com:vml" style="behavior:url(#default#VML);display:inline-block;zoom:1;" />');
    
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getShapeById", 3255);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3257);
return this._shapes[id];
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_getShapeClass", 3268);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3270);
var shape = this._shapeClass[val];
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3271);
if(shape)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3273);
return shape;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3275);
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
        circle: Y.VMLCircle,
        rect: Y.VMLRect,
        path: Y.VMLPath,
        ellipse: Y.VMLEllipse,
        pieslice: Y.VMLPieSlice
    },

	/**
	 * Allows for creating multiple shapes in order to batch appending and redraw operations.
	 *
	 * @method batch
	 * @param {Function} method Method to execute.
	 */
    batch: function(method)
    {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "batch", 3299);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3301);
var autoDraw = this.get("autoDraw");
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3302);
this.set("autoDraw", false);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3303);
method.apply();
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3304);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_getDocFrag", 3314);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3316);
if(!this._frag)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3318);
this._frag = DOCUMENT.createDocumentFragment();
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3320);
return this._frag;
    },

    /**
     * Adds a shape to the redraw queue and calculates the contentBounds. 
     *
     * @method addToRedrawQueue
     * @param shape {VMLShape}
     * @protected
     */
    addToRedrawQueue: function(shape)
    {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "addToRedrawQueue", 3330);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3332);
var shapeBox,
            box;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3334);
this._shapes[shape.get("id")] = shape;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3335);
if(!this.get("resizeDown"))
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3337);
shapeBox = shape.getBounds();
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3338);
box = this._contentBounds;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3339);
box.left = box.left < shapeBox.left ? box.left : shapeBox.left;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3340);
box.top = box.top < shapeBox.top ? box.top : shapeBox.top;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3341);
box.right = box.right > shapeBox.right ? box.right : shapeBox.right;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3342);
box.bottom = box.bottom > shapeBox.bottom ? box.bottom : shapeBox.bottom;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3343);
box.width = box.right - box.left;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3344);
box.height = box.bottom - box.top;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3345);
this._contentBounds = box;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3347);
if(this.get("autoDraw")) 
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3349);
this._redraw();
        }
    },

    /**
     * Redraws all shapes.
     *
     * @method _redraw
     * @private
     */
    _redraw: function()
    {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_redraw", 3359);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3361);
var autoSize = this.get("autoSize"),
            preserveAspectRatio,
            nodeWidth,
            nodeHeight,
            xCoordOrigin = 0,
            yCoordOrigin = 0,
            box = this.get("resizeDown") ? this._getUpdatedContentBounds() : this._contentBounds,
            left = box.left,
            right = box.right,
            top = box.top,
            bottom = box.bottom,
            contentWidth = right - left,
            contentHeight = bottom - top,
            aspectRatio,
            xCoordSize,
            yCoordSize,
            scaledWidth,
            scaledHeight,
            visible = this.get("visible");
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3380);
this._contentNode.style.visibility = "hidden";
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3381);
if(autoSize)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3383);
if(autoSize == "sizeContentToGraphic")
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3385);
preserveAspectRatio = this.get("preserveAspectRatio");
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3386);
nodeWidth = this.get("width");
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3387);
nodeHeight = this.get("height");
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3388);
if(preserveAspectRatio == "none" || contentWidth/contentHeight === nodeWidth/nodeHeight)
                {
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3390);
xCoordOrigin = left;
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3391);
yCoordOrigin = top;
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3392);
xCoordSize = contentWidth;
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3393);
yCoordSize = contentHeight;
                }
                else 
                {
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3397);
if(contentWidth * nodeHeight/contentHeight > nodeWidth)
                    {
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3399);
aspectRatio = nodeHeight/nodeWidth;
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3400);
xCoordSize = contentWidth;
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3401);
yCoordSize = contentWidth * aspectRatio;
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3402);
scaledHeight = (nodeWidth * (contentHeight/contentWidth)) * (yCoordSize/nodeHeight);
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3403);
yCoordOrigin = this._calculateCoordOrigin(preserveAspectRatio.slice(5).toLowerCase(), scaledHeight, yCoordSize);
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3404);
yCoordOrigin = top + yCoordOrigin;
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3405);
xCoordOrigin = left;
                    }
                    else
                    {
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3409);
aspectRatio = nodeWidth/nodeHeight;
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3410);
xCoordSize = contentHeight * aspectRatio;
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3411);
yCoordSize = contentHeight;
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3412);
scaledWidth = (nodeHeight * (contentWidth/contentHeight)) * (xCoordSize/nodeWidth);
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3413);
xCoordOrigin = this._calculateCoordOrigin(preserveAspectRatio.slice(1, 4).toLowerCase(), scaledWidth, xCoordSize);
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3414);
xCoordOrigin = xCoordOrigin + left;
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3415);
yCoordOrigin = top;
                    }
                }
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3418);
this._contentNode.style.width = nodeWidth + "px";
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3419);
this._contentNode.style.height = nodeHeight + "px";
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3420);
this._contentNode.coordOrigin = xCoordOrigin + ", " + yCoordOrigin;
            }
            else 
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3424);
xCoordSize = contentWidth;
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3425);
yCoordSize = contentHeight;
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3426);
this._contentNode.style.width = contentWidth + "px";
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3427);
this._contentNode.style.height = contentHeight + "px";
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3428);
this._state.width = contentWidth;
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3429);
this._state.height =  contentHeight;
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3430);
if(this._node)
                {
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3432);
this._node.style.width = contentWidth + "px";
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3433);
this._node.style.height = contentHeight + "px";
                }

            }
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3437);
this._contentNode.coordSize = xCoordSize + ", " + yCoordSize;
        }
        else
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3441);
this._contentNode.style.width = right + "px";
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3442);
this._contentNode.style.height = bottom + "px";
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3443);
this._contentNode.coordSize = right + ", " + bottom;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3445);
if(this._frag)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3447);
this._contentNode.appendChild(this._frag);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3448);
this._frag = null;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3450);
if(visible)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3452);
this._contentNode.style.visibility = "visible";
        }
    },
    
    /**
     * Determines the value for either an x or y coordinate to be used for the <code>coordOrigin</code> of the Graphic.
     *
     * @method _calculateCoordOrigin
     * @param {String} position The position for placement. Possible values are min, mid and max.
     * @param {Number} size The total scaled size of the content.
     * @param {Number} coordsSize The coordsSize for the Graphic.
     * @return Number
     * @private
     */
    _calculateCoordOrigin: function(position, size, coordsSize)
    {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_calculateCoordOrigin", 3466);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3468);
var coord;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3469);
switch(position)
        {
            case "min" :
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3472);
coord = 0;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3473);
break;
            case "mid" :
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3475);
coord = (size - coordsSize)/2;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3476);
break;
            case "max" :
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3478);
coord = (size - coordsSize);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3479);
break;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3481);
return coord;
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_getUpdatedContentBounds", 3491);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3493);
var bounds,
            i,
            shape,
            queue = this._shapes,
            box = {};
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3498);
for(i in queue)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3500);
if(queue.hasOwnProperty(i))
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3502);
shape = queue[i];
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3503);
bounds = shape.getBounds();
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3504);
box.left = Y_LANG.isNumber(box.left) ? Math.min(box.left, bounds.left) : bounds.left;
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3505);
box.top = Y_LANG.isNumber(box.top) ? Math.min(box.top, bounds.top) : bounds.top;
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3506);
box.right = Y_LANG.isNumber(box.right) ? Math.max(box.right, bounds.right) : bounds.right;
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3507);
box.bottom = Y_LANG.isNumber(box.bottom) ? Math.max(box.bottom, bounds.bottom) : bounds.bottom;
            }
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3510);
box.left = Y_LANG.isNumber(box.left) ? box.left : 0;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3511);
box.top = Y_LANG.isNumber(box.top) ? box.top : 0;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3512);
box.right = Y_LANG.isNumber(box.right) ? box.right : 0;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3513);
box.bottom = Y_LANG.isNumber(box.bottom) ? box.bottom : 0;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3514);
this._contentBounds = box;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3515);
return box;
    },

    /**
     * Inserts shape on the top of the tree.
     *
     * @method _toFront
     * @param {VMLShape} Shape to add.
     * @private
     */
    _toFront: function(shape)
    {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_toFront", 3525);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3527);
var contentNode = this._contentNode;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3528);
if(shape instanceof Y.VMLShape)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3530);
shape = shape.get("node");
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3532);
if(contentNode && shape)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3534);
contentNode.appendChild(shape);
        }
    },

    /**
     * Inserts shape as the first child of the content node.
     *
     * @method _toBack
     * @param {VMLShape} Shape to add.
     * @private
     */
    _toBack: function(shape)
    {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_toBack", 3545);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3547);
var contentNode = this._contentNode,
            targetNode;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3549);
if(shape instanceof Y.VMLShape)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3551);
shape = shape.get("node");
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3553);
if(contentNode && shape)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3555);
targetNode = contentNode.firstChild;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3556);
if(targetNode)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3558);
contentNode.insertBefore(shape, targetNode);
            }
            else
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3562);
contentNode.appendChild(shape);
            }
        }
    }
});
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3567);
Y.VMLGraphic = VMLGraphic;



}, '@VERSION@', {"requires": ["graphics"]});
