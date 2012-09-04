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
_yuitest_coverage["build/graphics-vml/graphics-vml.js"].code=["YUI.add('graphics-vml', function (Y, NAME) {","","var SHAPE = \"vmlShape\",","	SPLITPATHPATTERN = /[a-z][^a-z]*/ig,","    SPLITARGSPATTERN = /[-]?[0-9]*[0-9|\\.][0-9]*/g,","    Y_LANG = Y.Lang,","    IS_NUM = Y_LANG.isNumber,","    IS_ARRAY = Y_LANG.isArray,","    IS_STRING = Y_LANG.isString,","    Y_DOM = Y.DOM,","    Y_SELECTOR = Y.Selector,","    DOCUMENT = Y.config.doc,","    AttributeLite = Y.AttributeLite,","	VMLShape,","	VMLCircle,","	VMLPath,","	VMLRect,","	VMLEllipse,","	VMLGraphic,","    VMLPieSlice,","    _getClassName = Y.ClassNameManager.getClassName;","","function VMLDrawing() {}","","/**"," * <a href=\"http://www.w3.org/TR/NOTE-VML\">VML</a> implementation of the <a href=\"Drawing.html\">`Drawing`</a> class. "," * `VMLDrawing` is not intended to be used directly. Instead, use the <a href=\"Drawing.html\">`Drawing`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> and <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> "," * capabilities, the <a href=\"Drawing.html\">`Drawing`</a> class will point to the `VMLDrawing` class."," *"," * @module graphics"," * @class VMLDrawing"," * @constructor"," */","VMLDrawing.prototype = {","    /**","     * Maps path to methods","     *","     * @property _pathSymbolToMethod","     * @type Object","     * @private","     */","    _pathSymbolToMethod: {","        M: \"moveTo\",","        L: \"lineTo\",","        C: \"curveTo\",","        c: \"relativeCurveTo\",","        Q: \"quadraticCurveTo\",","        z: \"closePath\",","        Z: \"closePath\"","    },","","    /**","     * Value for rounding up to coordsize","     *","     * @property _coordSpaceMultiplier","     * @type Number","     * @private","     */","    _coordSpaceMultiplier: 100,","","    /**","     * Rounds dimensions and position values based on the coordinate space.","     *","     * @method _round","     * @param {Number} The value for rounding","     * @return Number","     * @private","     */","    _round:function(val)","    {","        return Math.round(val * this._coordSpaceMultiplier);","    },","","    /**","     * Concatanates the path.","     *","     * @method _addToPath","     * @param {String} val The value to add to the path string.","     * @private","     */","    _addToPath: function(val)","    {","        this._path = this._path || \"\";","        if(this._movePath)","        {","            this._path += this._movePath;","            this._movePath = null;","        }","        this._path += val;","    },","","    /**","     * Current x position of the drawing.","     *","     * @property _currentX","     * @type Number","     * @private","     */","    _currentX: 0,","","    /**","     * Current y position of the drqwing.","     *","     * @property _currentY","     * @type Number","     * @private","     */","    _currentY: 0,","    ","    /**","     * Draws a bezier curve.","     *","     * @method curveTo","     * @param {Number} cp1x x-coordinate for the first control point.","     * @param {Number} cp1y y-coordinate for the first control point.","     * @param {Number} cp2x x-coordinate for the second control point.","     * @param {Number} cp2y y-coordinate for the second control point.","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    curveTo: function() {","        this._curveTo.apply(this, [Y.Array(arguments), false]);","    },","","    /**","     * Draws a bezier curve.","     *","     * @method curveTo","     * @param {Number} cp1x x-coordinate for the first control point.","     * @param {Number} cp1y y-coordinate for the first control point.","     * @param {Number} cp2x x-coordinate for the second control point.","     * @param {Number} cp2y y-coordinate for the second control point.","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    relativeCurveTo: function() {","        this._curveTo.apply(this, [Y.Array(arguments), true]);","    },","    ","    /**","     * Implements curveTo methods.","     *","     * @method _curveTo","     * @param {Array} args The arguments to be used.","     * @param {Boolean} relative Indicates whether or not to use relative coordinates.","     * @private","     */","    _curveTo: function(args, relative) {","        var w,","            h,","            cp1x,","            cp1y,","            cp2x,","            cp2y,","            pts,","            right,","            left,","            bottom,","            top,","            i = 0,","            len,","            path,","            command = relative ? \" v \" : \" c \",","            relativeX = relative ? parseFloat(this._currentX) : 0,","            relativeY = relative ? parseFloat(this._currentY) : 0;","        len = args.length - 5;","        path = command; ","        for(; i < len; i = i + 6)","        {","            cp1x = parseFloat(args[i]);","            cp1y = parseFloat(args[i + 1]);","            cp2x = parseFloat(args[i + 2]);","            cp2y = parseFloat(args[i + 3]);","            x = parseFloat(args[i + 4]);","            y = parseFloat(args[i + 5]);","            if(i > 0)","            {","                path = path + \", \";","            }","            path = path + this._round(cp1x) + \", \" + this._round(cp1y) + \", \" + this._round(cp2x) + \", \" + this._round(cp2y) + \", \" + this._round(x) + \", \" + this._round(y); ","            cp1x = cp1x + relativeX;","            cp1y = cp1y + relativeY;","            cp2x = cp2x + relativeX;","            cp2y = cp2y + relativeY;","            x = x + relativeX;","            y = y + relativeY;","            right = Math.max(x, Math.max(cp1x, cp2x));","            bottom = Math.max(y, Math.max(cp1y, cp2y));","            left = Math.min(x, Math.min(cp1x, cp2x));","            top = Math.min(y, Math.min(cp1y, cp2y));","            w = Math.abs(right - left);","            h = Math.abs(bottom - top);","            pts = [[this._currentX, this._currentY] , [cp1x, cp1y], [cp2x, cp2y], [x, y]]; ","            this._setCurveBoundingBox(pts, w, h);","            this._currentX = x;","            this._currentY = y;","        }","        this._addToPath(path);","    },","","    /**","     * Draws a quadratic bezier curve.","     *","     * @method quadraticCurveTo","     * @param {Number} cpx x-coordinate for the control point.","     * @param {Number} cpy y-coordinate for the control point.","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    quadraticCurveTo: function(cpx, cpy, x, y) {","        var currentX = this._currentX,","            currentY = this._currentY,","            cp1x = currentX + 0.67*(cpx - currentX),","            cp1y = currentY + 0.67*(cpy - currentY),","            cp2x = cp1x + (x - currentX) * 0.34,","            cp2y = cp1y + (y - currentY) * 0.34;","        this.curveTo(cp1x, cp1y, cp2x, cp2y, x, y);","    },","","    /**","     * Draws a rectangle.","     *","     * @method drawRect","     * @param {Number} x x-coordinate","     * @param {Number} y y-coordinate","     * @param {Number} w width","     * @param {Number} h height","     */","    drawRect: function(x, y, w, h) {","        this.moveTo(x, y);","        this.lineTo(x + w, y);","        this.lineTo(x + w, y + h);","        this.lineTo(x, y + h);","        this.lineTo(x, y);","        this._currentX = x;","        this._currentY = y;","        return this;","    },","","    /**","     * Draws a rectangle with rounded corners.","     * ","     * @method drawRect","     * @param {Number} x x-coordinate","     * @param {Number} y y-coordinate","     * @param {Number} w width","     * @param {Number} h height","     * @param {Number} ew width of the ellipse used to draw the rounded corners","     * @param {Number} eh height of the ellipse used to draw the rounded corners","     */","    drawRoundRect: function(x, y, w, h, ew, eh) {","        this.moveTo(x, y + eh);","        this.lineTo(x, y + h - eh);","        this.quadraticCurveTo(x, y + h, x + ew, y + h);","        this.lineTo(x + w - ew, y + h);","        this.quadraticCurveTo(x + w, y + h, x + w, y + h - eh);","        this.lineTo(x + w, y + eh);","        this.quadraticCurveTo(x + w, y, x + w - ew, y);","        this.lineTo(x + ew, y);","        this.quadraticCurveTo(x, y, x, y + eh);","        return this;","    },","","    /**","     * Draws a circle. Used internally by `CanvasCircle` class.","     *","     * @method drawCircle","     * @param {Number} x y-coordinate","     * @param {Number} y x-coordinate","     * @param {Number} r radius","     * @protected","     */","	drawCircle: function(x, y, radius) {","        var startAngle = 0,","            endAngle = 360,","            circum = radius * 2;","","        endAngle *= 65535;","        this._drawingComplete = false;","        this._trackSize(x + circum, y + circum);","        this.moveTo((x + circum), (y + radius));","        this._addToPath(\" ae \" + this._round(x + radius) + \", \" + this._round(y + radius) + \", \" + this._round(radius) + \", \" + this._round(radius) + \", \" + startAngle + \", \" + endAngle);","        return this;","    },","    ","    /**","     * Draws an ellipse.","     *","     * @method drawEllipse","     * @param {Number} x x-coordinate","     * @param {Number} y y-coordinate","     * @param {Number} w width","     * @param {Number} h height","     * @protected","     */","	drawEllipse: function(x, y, w, h) {","        var startAngle = 0,","            endAngle = 360,","            radius = w * 0.5,","            yRadius = h * 0.5;","        endAngle *= 65535;","        this._drawingComplete = false;","        this._trackSize(x + w, y + h);","        this.moveTo((x + w), (y + yRadius));","        this._addToPath(\" ae \" + this._round(x + radius) + \", \" + this._round(x + radius) + \", \" + this._round(y + yRadius) + \", \" + this._round(radius) + \", \" + this._round(yRadius) + \", \" + startAngle + \", \" + endAngle);","        return this;","    },","    ","    /**","     * Draws a diamond.     ","     * ","     * @method drawDiamond","     * @param {Number} x y-coordinate","     * @param {Number} y x-coordinate","     * @param {Number} width width","     * @param {Number} height height","     * @protected","     */","    drawDiamond: function(x, y, width, height)","    {","        var midWidth = width * 0.5,","            midHeight = height * 0.5;","        this.moveTo(x + midWidth, y);","        this.lineTo(x + width, y + midHeight);","        this.lineTo(x + midWidth, y + height);","        this.lineTo(x, y + midHeight);","        this.lineTo(x + midWidth, y);","        return this;","    },","","    /**","     * Draws a wedge.","     *","     * @method drawWedge","     * @param {Number} x x-coordinate of the wedge's center point","     * @param {Number} y y-coordinate of the wedge's center point","     * @param {Number} startAngle starting angle in degrees","     * @param {Number} arc sweep of the wedge. Negative values draw clockwise.","     * @param {Number} radius radius of wedge. If [optional] yRadius is defined, then radius is the x radius.","     * @param {Number} yRadius [optional] y radius for wedge.","     * @private","     */","    drawWedge: function(x, y, startAngle, arc, radius)","    {","        var diameter = radius * 2;","        if(Math.abs(arc) > 360)","        {","            arc = 360;","        }","        this._currentX = x;","        this._currentY = y;","        startAngle *= -65535;","        arc *= 65536;","        startAngle = Math.round(startAngle);","        arc = Math.round(arc);","        this.moveTo(x, y);","        this._addToPath(\" ae \" + this._round(x) + \", \" + this._round(y) + \", \" + this._round(radius) + \" \" + this._round(radius) + \", \" +  startAngle + \", \" + arc);","        this._trackSize(diameter, diameter); ","        return this;","    },","","    /**","     * Draws a line segment using the current line style from the current drawing position to the specified x and y coordinates.","     * ","     * @method lineTo","     * @param {Number} point1 x-coordinate for the end point.","     * @param {Number} point2 y-coordinate for the end point.","     */","    lineTo: function(point1, point2, etc) {","        var args = arguments,","            i,","            len,","            path = ' l ';","        if (typeof point1 === 'string' || typeof point1 === 'number') {","            args = [[point1, point2]];","        }","        len = args.length;","        for (i = 0; i < len; ++i) {","            path += ' ' + this._round(args[i][0]) + ', ' + this._round(args[i][1]);","            this._trackSize.apply(this, args[i]);","            this._currentX = args[i][0];","            this._currentY = args[i][1];","        }","        this._addToPath(path);","        return this;","    },","","    /**","     * Moves the current drawing position to specified x and y coordinates.","     *","     * @method moveTo","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    moveTo: function(x, y) {","        x = parseFloat(x);","        y = parseFloat(y);","        this._movePath = \" m \" + this._round(x) + \", \" + this._round(y);","        this._trackSize(x, y);","        this._currentX = x;","        this._currentY = y;","    },","","    /**","     * Draws the graphic.","     *","     * @method _draw","     * @private","     */","    _closePath: function()","    {","        var fill = this.get(\"fill\"),","            stroke = this.get(\"stroke\"),","            node = this.node,","            w = this.get(\"width\"),","            h = this.get(\"height\"),","            path = this._path,","            pathEnd = \"\",","            multiplier = this._coordSpaceMultiplier;","        this._fillChangeHandler();","        this._strokeChangeHandler();","        if(path)","        {","            if(fill && fill.color)","            {","                pathEnd += ' x';","            }","            if(stroke)","            {","                pathEnd += ' e';","            }","        }","        if(path)","        {","            node.path = path + pathEnd;","        }","        if(!isNaN(w) && !isNaN(h))","        {","            node.coordOrigin = this._left + \", \" + this._top;","            node.coordSize = (w * multiplier) + \", \" + (h * multiplier);","            node.style.position = \"absolute\";","            node.style.width =  w + \"px\";","            node.style.height =  h + \"px\";","        }","        this._path = path;","        this._movePath = null;","        this._updateTransform();","    },","","    /**","     * Completes a drawing operation. ","     *","     * @method end","     */","    end: function()","    {","        this._closePath();","    },","","    /**","     * Ends a fill and stroke","     *","     * @method closePath","     */","    closePath: function()","    {","        this._addToPath(\" x e\");","    },","","    /**","     * Clears the path.","     *","     * @method clear","     */","    clear: function()","    {","		this._right = 0;","        this._bottom = 0;","        this._width = 0;","        this._height = 0;","        this._left = 0;","        this._top = 0;","        this._path = \"\";","        this._movePath = null;","    },","    ","    /**","     * Returns the points on a curve","     *","     * @method getBezierData","     * @param Array points Array containing the begin, end and control points of a curve.","     * @param Number t The value for incrementing the next set of points.","     * @return Array","     * @private","     */","    getBezierData: function(points, t) {  ","        var n = points.length,","            tmp = [],","            i,","            j;","","        for (i = 0; i < n; ++i){","            tmp[i] = [points[i][0], points[i][1]]; // save input","        }","        ","        for (j = 1; j < n; ++j) {","            for (i = 0; i < n - j; ++i) {","                tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];","                tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1]; ","            }","        }","        return [ tmp[0][0], tmp[0][1] ]; ","    },","  ","    /**","     * Calculates the bounding box for a curve","     *","     * @method _setCurveBoundingBox","     * @param Array pts Array containing points for start, end and control points of a curve.","     * @param Number w Width used to calculate the number of points to describe the curve.","     * @param Number h Height used to calculate the number of points to describe the curve.","     * @private","     */","    _setCurveBoundingBox: function(pts, w, h)","    {","        var i = 0,","            left = this._currentX,","            right = left,","            top = this._currentY,","            bottom = top,","            len = Math.round(Math.sqrt((w * w) + (h * h))),","            t = 1/len,","            xy;","        for(; i < len; ++i)","        {","            xy = this.getBezierData(pts, t * i);","            left = isNaN(left) ? xy[0] : Math.min(xy[0], left);","            right = isNaN(right) ? xy[0] : Math.max(xy[0], right);","            top = isNaN(top) ? xy[1] : Math.min(xy[1], top);","            bottom = isNaN(bottom) ? xy[1] : Math.max(xy[1], bottom);","        }","        left = Math.round(left * 10)/10;","        right = Math.round(right * 10)/10;","        top = Math.round(top * 10)/10;","        bottom = Math.round(bottom * 10)/10;","        this._trackSize(right, bottom);","        this._trackSize(left, top);","    },","","    /**","     * Updates the size of the graphics object","     *","     * @method _trackSize","     * @param {Number} w width","     * @param {Number} h height","     * @private","     */","    _trackSize: function(w, h) {","        if (w > this._right) {","            this._right = w;","        }","        if(w < this._left)","        {","            this._left = w;    ","        }","        if (h < this._top)","        {","            this._top = h;","        }","        if (h > this._bottom) ","        {","            this._bottom = h;","        }","        this._width = this._right - this._left;","        this._height = this._bottom - this._top;","    },","","    _left: 0,","","    _right: 0,","","    _top: 0,","","    _bottom: 0,","","    _width: 0,","","    _height: 0","};","Y.VMLDrawing = VMLDrawing;","/**"," * <a href=\"http://www.w3.org/TR/NOTE-VML\">VML</a> implementation of the <a href=\"Shape.html\">`Shape`</a> class. "," * `VMLShape` is not intended to be used directly. Instead, use the <a href=\"Shape.html\">`Shape`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> and <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> "," * capabilities, the <a href=\"Shape.html\">`Shape`</a> class will point to the `VMLShape` class."," *"," * @module graphics"," * @class VMLShape"," * @constructor"," * @param {Object} cfg (optional) Attribute configs"," */","VMLShape = function() ","{","    this._transforms = [];","    this.matrix = new Y.Matrix();","    this._normalizedMatrix = new Y.Matrix();","    VMLShape.superclass.constructor.apply(this, arguments);","};","","VMLShape.NAME = \"vmlShape\";","","Y.extend(VMLShape, Y.GraphicBase, Y.mix({","	/**","	 * Indicates the type of shape","	 *","	 * @property _type","	 * @type String","     * @private","	 */","	_type: \"shape\",","    ","    /**","     * Init method, invoked during construction.","     * Calls `initializer` method.","     *","     * @method init","     * @protected","     */","	init: function()","	{","		this.initializer.apply(this, arguments);","	},","","	/**","	 * Initializes the shape","	 *","	 * @private","	 * @method _initialize","	 */","	initializer: function(cfg)","	{","		var host = this,","            graphic = cfg.graphic,","            data = this.get(\"data\");","		host.createNode();","        if(graphic)","        {","            this._setGraphic(graphic);","        }","        if(data)","        {","            host._parsePathData(data);","        }","        this._updateHandler();","	},"," ","    /**","     * Set the Graphic instance for the shape.","     *","     * @method _setGraphic","     * @param {Graphic | Node | HTMLElement | String} render This param is used to determine the graphic instance. If it is a `Graphic` instance, it will be assigned","     * to the `graphic` attribute. Otherwise, a new Graphic instance will be created and rendered into the dom element that the render represents.","     * @private","     */","    _setGraphic: function(render)","    {","        var graphic;","        if(render instanceof Y.VMLGraphic)","        {","		    this._graphic = render;","        }","        else","        {","            render = Y.one(render);","            graphic = new Y.VMLGraphic({","                render: render","            });","            graphic._appendShape(this);","            this._graphic = graphic;","            this._appendStrokeAndFill();","        }","    },","    ","    /**","     * Appends fill and stroke nodes to the shape.","     *","     * @method _appendStrokeAndFill","     * @private","     */","    _appendStrokeAndFill: function()","    {","        if(this._strokeNode)","        {","            this.node.appendChild(this._strokeNode);","        }","        if(this._fillNode)","        {","            this.node.appendChild(this._fillNode);","        }","    },","    ","	/**","	 * Creates the dom node for the shape.","	 *","     * @method createNode","	 * @return HTMLElement","	 * @private","	 */","	createNode: function()","	{","        var node,","			x = this.get(\"x\"),","			y = this.get(\"y\"),","            w = this.get(\"width\"),","            h = this.get(\"height\"),","			id,","			type,","			nodestring,","            visibility = this.get(\"visible\") ? \"visible\" : \"hidden\",","			strokestring,","			classString,","			stroke,","			endcap,","			opacity,","			joinstyle,","			miterlimit,","			dashstyle,","			fill,","			fillstring;","			id = this.get(\"id\");","			type = this._type == \"path\" ? \"shape\" : this._type;","			classString = 'vml' + type + ' ' + _getClassName(SHAPE) + \" \" + _getClassName(this.constructor.NAME); ","			stroke = this._getStrokeProps();","			fill = this._getFillProps();","			","			nodestring  = '<' + type + '  xmlns=\"urn:schemas-microsft.com:vml\" id=\"' + id + '\" class=\"' + classString + '\" style=\"behavior:url(#default#VML);display:inline-block;position:absolute;left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;height:' + h + 'px;visibility:' + visibility + '\"';","","		    if(stroke && stroke.weight && stroke.weight > 0)","			{","				endcap = stroke.endcap;","				opacity = parseFloat(stroke.opacity);","				joinstyle = stroke.joinstyle;","				miterlimit = stroke.miterlimit;","				dashstyle = stroke.dashstyle;","				nodestring += ' stroked=\"t\" strokecolor=\"' + stroke.color + '\" strokeWeight=\"' + stroke.weight + 'px\"';","				","				strokestring = '<stroke class=\"vmlstroke\" xmlns=\"urn:schemas-microsft.com:vml\" on=\"t\" style=\"behavior:url(#default#VML);display:inline-block;\"';","				strokestring += ' opacity=\"' + opacity + '\"';","				if(endcap)","				{","					strokestring += ' endcap=\"' + endcap + '\"';","				}","				if(joinstyle)","				{","					strokestring += ' joinstyle=\"' + joinstyle + '\"';","				}","				if(miterlimit)","				{","					strokestring += ' miterlimit=\"' + miterlimit + '\"';","				}","				if(dashstyle)","				{","					strokestring += ' dashstyle=\"' + dashstyle + '\"';","				}","				strokestring += '></stroke>';","				this._strokeNode = DOCUMENT.createElement(strokestring);","				nodestring += ' stroked=\"t\"';","			}","			else","			{","				nodestring += ' stroked=\"f\"';","			}","			if(fill)","			{","				if(fill.node)","				{","					fillstring = fill.node;","					this._fillNode = DOCUMENT.createElement(fillstring);","				}","				if(fill.color)","				{","					nodestring += ' fillcolor=\"' + fill.color + '\"';","				}","				nodestring += ' filled=\"' + fill.filled + '\"';","			}","			","			","			nodestring += '>';","			nodestring += '</' + type + '>';","			","			node = DOCUMENT.createElement(nodestring);","","            this.node = node;","            this._strokeFlag = false;","            this._fillFlag = false;","	},","","	/**","	 * Add a class name to each node.","	 *","	 * @method addClass","	 * @param {String} className the class name to add to the node's class attribute ","	 */","	addClass: function(className)","	{","		var node = this.node;","		Y_DOM.addClass(node, className);","	},","","	/**","	 * Removes a class name from each node.","	 *","	 * @method removeClass","	 * @param {String} className the class name to remove from the node's class attribute","	 */","	removeClass: function(className)","	{","		var node = this.node;","		Y_DOM.removeClass(node, className);","	},","","	/**","	 * Gets the current position of the node in page coordinates.","	 *","	 * @method getXY","	 * @return Array The XY position of the shape.","	 */","	getXY: function()","	{","		var graphic = this._graphic,","			parentXY = graphic.getXY(),","			x = this.get(\"x\"),","			y = this.get(\"y\");","		return [parentXY[0] + x, parentXY[1] + y];","	},","","	/**","	 * Set the position of the shape in page coordinates, regardless of how the node is positioned.","	 *","	 * @method setXY","	 * @param {Array} Contains x & y values for new position (coordinates are page-based)","     *","	 */","	setXY: function(xy)","	{","		var graphic = this._graphic,","			parentXY = graphic.getXY();","		this.set(\"x\", xy[0] - parentXY[0]);","		this.set(\"y\", xy[1] - parentXY[1]);","	},","","	/**","	 * Determines whether the node is an ancestor of another HTML element in the DOM hierarchy. ","	 *","	 * @method contains","	 * @param {VMLShape | HTMLElement} needle The possible node or descendent","	 * @return Boolean Whether or not this shape is the needle or its ancestor.","	 */","	contains: function(needle)","	{","		return needle === Y.one(this.node);","	},","","	/**","	 * Compares nodes to determine if they match.","	 * Node instances can be compared to each other and/or HTMLElements.","	 * @method compareTo","	 * @param {HTMLElement | Node} refNode The reference node to compare to the node.","	 * @return {Boolean} True if the nodes match, false if they do not.","	 */","	compareTo: function(refNode) {","		var node = this.node;","","		return node === refNode;","	},","","	/**","	 * Test if the supplied node matches the supplied selector.","	 *","	 * @method test","	 * @param {String} selector The CSS selector to test against.","	 * @return Boolean Wheter or not the shape matches the selector.","	 */","	test: function(selector)","	{","		return Y_SELECTOR.test(this.node, selector);","	},","","	/**","     * Calculates and returns properties for setting an initial stroke.","     *","     * @method _getStrokeProps","     * @return Object","     *","	 * @private","	 */","	 _getStrokeProps: function()","	 {","		var props,","			stroke = this.get(\"stroke\"),","			strokeOpacity,","			dashstyle,","			dash = \"\",","			val,","			i = 0,","			len,","			linecap,","			linejoin;","        if(stroke && stroke.weight && stroke.weight > 0)","		{","			props = {};","			linecap = stroke.linecap || \"flat\";","			linejoin = stroke.linejoin || \"round\";","			if(linecap != \"round\" && linecap != \"square\")","			{","				linecap = \"flat\";","			}","			strokeOpacity = parseFloat(stroke.opacity);","			dashstyle = stroke.dashstyle || \"none\";","			stroke.color = stroke.color || \"#000000\";","			stroke.weight = stroke.weight || 1;","			stroke.opacity = IS_NUM(strokeOpacity) ? strokeOpacity : 1;","			props.stroked = true;","			props.color = stroke.color;","			props.weight = stroke.weight;","			props.endcap = linecap;","			props.opacity = stroke.opacity;","			if(IS_ARRAY(dashstyle))","			{","				dash = [];","				len = dashstyle.length;","				for(i = 0; i < len; ++i)","				{","					val = dashstyle[i];","					dash[i] = val / stroke.weight;","				}","			}","			if(linejoin == \"round\" || linejoin == \"bevel\")","			{","				props.joinstyle = linejoin;","			}","			else","			{","				linejoin = parseInt(linejoin, 10);","				if(IS_NUM(linejoin))","				{","					props.miterlimit = Math.max(linejoin, 1);","					props.joinstyle = \"miter\";","				}","			}","			props.dashstyle = dash;","		}","		return props;","	 },","","	/**","	 * Adds a stroke to the shape node.","	 *","	 * @method _strokeChangeHandler","	 * @private","	 */","	_strokeChangeHandler: function(e)","	{","        if(!this._strokeFlag)","        {","            return;","        }","		var node = this.node,","			stroke = this.get(\"stroke\"),","			strokeOpacity,","			dashstyle,","			dash = \"\",","			val,","			i = 0,","			len,","			linecap,","			linejoin;","		if(stroke && stroke.weight && stroke.weight > 0)","		{","			linecap = stroke.linecap || \"flat\";","			linejoin = stroke.linejoin || \"round\";","			if(linecap != \"round\" && linecap != \"square\")","			{","				linecap = \"flat\";","			}","			strokeOpacity = parseFloat(stroke.opacity);","			dashstyle = stroke.dashstyle || \"none\";","			stroke.color = stroke.color || \"#000000\";","			stroke.weight = stroke.weight || 1;","			stroke.opacity = IS_NUM(strokeOpacity) ? strokeOpacity : 1;","			node.stroked = true;","			node.strokeColor = stroke.color;","			node.strokeWeight = stroke.weight + \"px\";","			if(!this._strokeNode)","			{","				this._strokeNode = this._createGraphicNode(\"stroke\");","				node.appendChild(this._strokeNode);","			}","			this._strokeNode.endcap = linecap;","			this._strokeNode.opacity = stroke.opacity;","			if(IS_ARRAY(dashstyle))","			{","				dash = [];","				len = dashstyle.length;","				for(i = 0; i < len; ++i)","				{","					val = dashstyle[i];","					dash[i] = val / stroke.weight;","				}","			}","			if(linejoin == \"round\" || linejoin == \"bevel\")","			{","				this._strokeNode.joinstyle = linejoin;","			}","			else","			{","				linejoin = parseInt(linejoin, 10);","				if(IS_NUM(linejoin))","				{","					this._strokeNode.miterlimit = Math.max(linejoin, 1);","					this._strokeNode.joinstyle = \"miter\";","				}","			}","			this._strokeNode.dashstyle = dash;","            this._strokeNode.on = true;","		}","		else","		{","            if(this._strokeNode)","            {","                this._strokeNode.on = false;","            }","			node.stroked = false;","		}","        this._strokeFlag = false;","	},","","	/**","     * Calculates and returns properties for setting an initial fill.","     *","     * @method _getFillProps","     * @return Object","     *","	 * @private","	 */","	_getFillProps: function()","	{","		var fill = this.get(\"fill\"),","			fillOpacity,","			props,","			gradient,","			i,","			fillstring,","			filled = false;","		if(fill)","		{","			props = {};","			","			if(fill.type == \"radial\" || fill.type == \"linear\")","			{","				fillOpacity = parseFloat(fill.opacity);","				fillOpacity = IS_NUM(fillOpacity) ? fillOpacity : 1;","				filled = true;","				gradient = this._getGradientFill(fill);","				fillstring = '<fill xmlns=\"urn:schemas-microsft.com:vml\" class=\"vmlfill\" style=\"behavior:url(#default#VML);display:inline-block;\" opacity=\"' + fillOpacity + '\"';","				for(i in gradient)","				{","					if(gradient.hasOwnProperty(i))","					{","						fillstring += ' ' + i + '=\"' + gradient[i] + '\"';","					}","				}","				fillstring += ' />';","				props.node = fillstring;","			}","			else if(fill.color)","			{","				fillOpacity = parseFloat(fill.opacity);","				filled = true;","                props.color = fill.color;","				if(IS_NUM(fillOpacity))","				{","					fillOpacity = Math.max(Math.min(fillOpacity, 1), 0);","                    props.opacity = fillOpacity;    ","				    if(fillOpacity < 1)","                    {","                        props.node = '<fill xmlns=\"urn:schemas-microsft.com:vml\" class=\"vmlfill\" style=\"behavior:url(#default#VML);display:inline-block;\" type=\"solid\" opacity=\"' + fillOpacity + '\"/>';","				    }","                }","			}","			props.filled = filled;","		}","		return props;","	},","","	/**","	 * Adds a fill to the shape node.","	 *","	 * @method _fillChangeHandler","	 * @private","	 */","	_fillChangeHandler: function(e)","	{","        if(!this._fillFlag)","        {","            return;","        }","		var node = this.node,","			fill = this.get(\"fill\"),","			fillOpacity,","			fillstring,","			filled = false,","            i,","            gradient;","		if(fill)","		{","			if(fill.type == \"radial\" || fill.type == \"linear\")","			{","				filled = true;","				gradient = this._getGradientFill(fill);","                if(this._fillNode)","                {","                    for(i in gradient)","                    {","                        if(gradient.hasOwnProperty(i))","                        {","                            if(i == \"colors\")","                            {","                                this._fillNode.colors.value = gradient[i];","                            }","                            else","                            {","                                this._fillNode[i] = gradient[i];","                            }","                        }","                    }","                }","                else","                {","                    fillstring = '<fill xmlns=\"urn:schemas-microsft.com:vml\" class=\"vmlfill\" style=\"behavior:url(#default#VML);display:inline-block;\"';","                    for(i in gradient)","                    {","                        if(gradient.hasOwnProperty(i))","                        {","                            fillstring += ' ' + i + '=\"' + gradient[i] + '\"';","                        }","                    }","                    fillstring += ' />';","                    this._fillNode = DOCUMENT.createElement(fillstring);","                    node.appendChild(this._fillNode);","                }","			}","			else if(fill.color)","			{","                node.fillcolor = fill.color;","				fillOpacity = parseFloat(fill.opacity);","				filled = true;","				if(IS_NUM(fillOpacity) && fillOpacity < 1)","				{","					fill.opacity = fillOpacity;","                    if(this._fillNode)","					{","                        if(this._fillNode.getAttribute(\"type\") != \"solid\")","                        {","                            this._fillNode.type = \"solid\";","                        }","						this._fillNode.opacity = fillOpacity;","					}","					else","					{     ","                        fillstring = '<fill xmlns=\"urn:schemas-microsft.com:vml\" class=\"vmlfill\" style=\"behavior:url(#default#VML);display:inline-block;\" type=\"solid\" opacity=\"' + fillOpacity + '\"/>';","                        this._fillNode = DOCUMENT.createElement(fillstring);","                        node.appendChild(this._fillNode);","					}","				}","				else if(this._fillNode)","                {   ","                    this._fillNode.opacity = 1;","                    this._fillNode.type = \"solid\";","				}","			}","		}","		node.filled = filled;","        this._fillFlag = false;","	},","","	//not used. remove next release.","    _updateFillNode: function(node)","	{","		if(!this._fillNode)","		{","			this._fillNode = this._createGraphicNode(\"fill\");","			node.appendChild(this._fillNode);","		}","	},","","    /**","     * Calculates and returns an object containing gradient properties for a fill node. ","     *","     * @method _getGradientFill","     * @param {Object} fill Object containing fill properties.","     * @return Object","     * @private","     */","	_getGradientFill: function(fill)","	{","		var gradientProps = {},","			gradientBoxWidth,","			gradientBoxHeight,","			type = fill.type,","			w = this.get(\"width\"),","			h = this.get(\"height\"),","			isNumber = IS_NUM,","			stop,","			stops = fill.stops,","			len = stops.length,","			opacity,","			color,","			i = 0,","			oi,","			colorstring = \"\",","			cx = fill.cx,","			cy = fill.cy,","			fx = fill.fx,","			fy = fill.fy,","			r = fill.r,","            pct,","			rotation = fill.rotation || 0;","		if(type === \"linear\")","		{","            if(rotation <= 270)","            {","                rotation = Math.abs(rotation - 270);","            }","			else if(rotation < 360)","            {","                rotation = 270 + (360 - rotation);","            }","            else","            {","                rotation = 270;","            }","            gradientProps.type = \"gradient\";//\"gradientunscaled\";","			gradientProps.angle = rotation;","		}","		else if(type === \"radial\")","		{","			gradientBoxWidth = w * (r * 2);","			gradientBoxHeight = h * (r * 2);","			fx = r * 2 * (fx - 0.5);","			fy = r * 2 * (fy - 0.5);","			fx += cx;","			fy += cy;","			gradientProps.focussize = (gradientBoxWidth/w)/10 + \"% \" + (gradientBoxHeight/h)/10 + \"%\";","			gradientProps.alignshape = false;","			gradientProps.type = \"gradientradial\";","			gradientProps.focus = \"100%\";","			gradientProps.focusposition = Math.round(fx * 100) + \"% \" + Math.round(fy * 100) + \"%\";","		}","		for(;i < len; ++i) {","			stop = stops[i];","			color = stop.color;","			opacity = stop.opacity;","			opacity = isNumber(opacity) ? opacity : 1;","			pct = stop.offset || i/(len-1);","			pct *= (r * 2);","            pct = Math.round(100 * pct) + \"%\";","            oi = i > 0 ? i + 1 : \"\";","            gradientProps[\"opacity\" + oi] = opacity + \"\";","            colorstring += \", \" + pct + \" \" + color;","		}","		if(parseFloat(pct) < 100)","		{","			colorstring += \", 100% \" + color;","		}","		gradientProps.colors = colorstring.substr(2);","		return gradientProps;","	},","","    /**","     * Adds a transform to the shape.","     *","     * @method _addTransform","     * @param {String} type The transform being applied.","     * @param {Array} args The arguments for the transform.","	 * @private","	 */","	_addTransform: function(type, args)","	{","        args = Y.Array(args);","        this._transform = Y_LANG.trim(this._transform + \" \" + type + \"(\" + args.join(\", \") + \")\");","        args.unshift(type);","        this._transforms.push(args);","        if(this.initialized)","        {","            this._updateTransform();","        }","	},","	","	/**","     * Applies all transforms.","     *","     * @method _updateTransform","	 * @private","	 */","	_updateTransform: function()","	{","		var node = this.node,","            key,","			transform,","			transformOrigin,","            x = this.get(\"x\"),","            y = this.get(\"y\"),","            tx,","            ty,","            matrix = this.matrix,","            normalizedMatrix = this._normalizedMatrix,","            isPathShape = this instanceof Y.VMLPath,","            i = 0,","            len = this._transforms.length;","        if(this._transforms && this._transforms.length > 0)","		{","            transformOrigin = this.get(\"transformOrigin\");","       ","            if(isPathShape)","            {","                normalizedMatrix.translate(this._left, this._top);","            }","            //vml skew matrix transformOrigin ranges from -0.5 to 0.5.","            //subtract 0.5 from values","            tx = transformOrigin[0] - 0.5;","            ty = transformOrigin[1] - 0.5;","            ","            //ensure the values are within the appropriate range to avoid errors","            tx = Math.max(-0.5, Math.min(0.5, tx));","            ty = Math.max(-0.5, Math.min(0.5, ty));","            for(; i < len; ++i)","            {","                key = this._transforms[i].shift();","                if(key)","                {","                    normalizedMatrix[key].apply(normalizedMatrix, this._transforms[i]); ","                    matrix[key].apply(matrix, this._transforms[i]); ","                }","			}","            if(isPathShape)","            {","                normalizedMatrix.translate(-this._left, -this._top);","            }","            transform = normalizedMatrix.a + \",\" + ","                        normalizedMatrix.c + \",\" + ","                        normalizedMatrix.b + \",\" + ","                        normalizedMatrix.d + \",\" + ","                        0 + \",\" +","                        0;","		}","        this._graphic.addToRedrawQueue(this);    ","        if(transform)","        {","            if(!this._skew)","            {","                this._skew = DOCUMENT.createElement( '<skew class=\"vmlskew\" xmlns=\"urn:schemas-microsft.com:vml\" on=\"false\" style=\"behavior:url(#default#VML);display:inline-block;\" />');","                this.node.appendChild(this._skew); ","            }","            this._skew.matrix = transform;","            this._skew.on = true;","            //this._skew.offset = this._getSkewOffsetValue(normalizedMatrix.dx) + \"px, \" + this._getSkewOffsetValue(normalizedMatrix.dy) + \"px\";","            this._skew.origin = tx + \", \" + ty;","        }","        if(this._type != \"path\")","        {","            this._transforms = [];","        }","        //add the translate to the x and y coordinates","        node.style.left = (x + this._getSkewOffsetValue(normalizedMatrix.dx)) + \"px\";","        node.style.top =  (y + this._getSkewOffsetValue(normalizedMatrix.dy)) + \"px\";","    },","    ","    /**","     * Normalizes the skew offset values between -32767 and 32767.","     *","     * @method _getSkewOffsetValue","     * @param {Number} val The value to normalize","     * @return Number","     * @private","     */","    _getSkewOffsetValue: function(val)","    {","        var sign = Y.MatrixUtil.sign(val),","            absVal = Math.abs(val);","        val = Math.min(absVal, 32767) * sign;","        return val;","    },","	","	/**","	 * Storage for translateX","	 *","     * @property _translateX","     * @type Number","	 * @private","	 */","	_translateX: 0,","","	/**","	 * Storage for translateY","	 *","     * @property _translateY","     * @type Number","	 * @private","	 */","	_translateY: 0,","    ","    /**","     * Storage for the transform attribute.","     *","     * @property _transform","     * @type String","     * @private","     */","    _transform: \"\",","	","    /**","	 * Specifies a 2d translation.","	 *","	 * @method translate","	 * @param {Number} x The value to translate on the x-axis.","	 * @param {Number} y The value to translate on the y-axis.","	 */","	translate: function(x, y)","	{","		this._translateX += x;","		this._translateY += y;","		this._addTransform(\"translate\", arguments);","	},","","	/**","	 * Translates the shape along the x-axis. When translating x and y coordinates,","	 * use the `translate` method.","	 *","	 * @method translateX","	 * @param {Number} x The value to translate.","	 */","	translateX: function(x)","    {","        this._translateX += x;","        this._addTransform(\"translateX\", arguments);","    },","","	/**","	 * Performs a translate on the y-coordinate. When translating x and y coordinates,","	 * use the `translate` method.","	 *","	 * @method translateY","	 * @param {Number} y The value to translate.","	 */","	translateY: function(y)","    {","        this._translateY += y;","        this._addTransform(\"translateY\", arguments);","    },","","    /**","     * Skews the shape around the x-axis and y-axis.","     *","     * @method skew","     * @param {Number} x The value to skew on the x-axis.","     * @param {Number} y The value to skew on the y-axis.","     */","    skew: function(x, y)","    {","        this._addTransform(\"skew\", arguments);","    },","","	/**","	 * Skews the shape around the x-axis.","	 *","	 * @method skewX","	 * @param {Number} x x-coordinate","	 */","	 skewX: function(x)","	 {","		this._addTransform(\"skewX\", arguments);","	 },","","	/**","	 * Skews the shape around the y-axis.","	 *","	 * @method skewY","	 * @param {Number} y y-coordinate","	 */","	 skewY: function(y)","	 {","		this._addTransform(\"skewY\", arguments);","	 },","","	/**","	 * Rotates the shape clockwise around it transformOrigin.","	 *","	 * @method rotate","	 * @param {Number} deg The degree of the rotation.","	 */","	 rotate: function(deg)","	 {","		this._addTransform(\"rotate\", arguments);","	 },","","	/**","	 * Specifies a 2d scaling operation.","	 *","	 * @method scale","	 * @param {Number} val","	 */","	scale: function(x, y)","	{","		this._addTransform(\"scale\", arguments);","	},","","	/**","     * Overrides default `on` method. Checks to see if its a dom interaction event. If so, ","     * return an event attached to the `node` element. If not, return the normal functionality.","     *","     * @method on","     * @param {String} type event type","     * @param {Object} callback function","	 * @private","	 */","	on: function(type, fn)","	{","		if(Y.Node.DOM_EVENTS[type])","		{","			return Y.one(\"#\" +  this.get(\"id\")).on(type, fn);","		}","		return Y.on.apply(this, arguments);","	},","","	/**","	 * Draws the shape.","	 *","	 * @method _draw","	 * @private","	 */","	_draw: function()","	{","	},","","	/**","     * Updates `Shape` based on attribute changes.","     *","     * @method _updateHandler","	 * @private","	 */","	_updateHandler: function(e)","	{","		var host = this,","            node = host.node;","        host._fillChangeHandler();","        host._strokeChangeHandler();","        node.style.width = this.get(\"width\") + \"px\";","        node.style.height = this.get(\"height\") + \"px\"; ","        this._draw();","		host._updateTransform();","	},","","	/**","	 * Creates a graphic node","	 *","	 * @method _createGraphicNode","	 * @param {String} type node type to create","	 * @return HTMLElement","	 * @private","	 */","	_createGraphicNode: function(type)","	{","		type = type || this._type;","		return DOCUMENT.createElement('<' + type + ' xmlns=\"urn:schemas-microsft.com:vml\" style=\"behavior:url(#default#VML);display:inline-block;\" class=\"vml' + type + '\"/>');","	},","","	/**","	 * Value function for fill attribute","	 *","	 * @private","	 * @method _getDefaultFill","	 * @return Object","	 */","	_getDefaultFill: function() {","		return {","			type: \"solid\",","			cx: 0.5,","			cy: 0.5,","			fx: 0.5,","			fy: 0.5,","			r: 0.5","		};","	},","","	/**","	 * Value function for stroke attribute","	 *","	 * @private","	 * @method _getDefaultStroke","	 * @return Object","	 */","	_getDefaultStroke: function() ","	{","		return {","			weight: 1,","			dashstyle: \"none\",","			color: \"#000\",","			opacity: 1.0","		};","	},","","    /**","     * Sets the value of an attribute.","     *","     * @method set","     * @param {String|Object} name The name of the attribute. Alternatively, an object of key value pairs can ","     * be passed in to set multiple attributes at once.","     * @param {Any} value The value to set the attribute to. This value is ignored if an object is received as ","     * the name param.","     */","	set: function() ","	{","		var host = this;","		AttributeLite.prototype.set.apply(host, arguments);","		if(host.initialized)","		{","			host._updateHandler();","		}","	},","","	/**","	 * Returns the bounds for a shape.","	 *","     * Calculates the a new bounding box from the original corner coordinates (base on size and position) and the transform matrix.","     * The calculated bounding box is used by the graphic instance to calculate its viewBox. ","     *","	 * @method getBounds","	 * @return Object","	 */","	getBounds: function()","	{","		var isPathShape = this instanceof Y.VMLPath,","			w = this.get(\"width\"),","			h = this.get(\"height\"),","            x = this.get(\"x\"),","            y = this.get(\"y\");","        if(isPathShape)","        {","            x = x + this._left;","            y = y + this._top;","            w = this._right - this._left;","            h = this._bottom - this._top;","        }","        return this._getContentRect(w, h, x, y);","	},","","    /**","     * Calculates the bounding box for the shape.","     *","     * @method _getContentRect","     * @param {Number} w width of the shape","     * @param {Number} h height of the shape","     * @param {Number} x x-coordinate of the shape","     * @param {Number} y y-coordinate of the shape","     * @private","     */","    _getContentRect: function(w, h, x, y)","    {","        var transformOrigin = this.get(\"transformOrigin\"),","            transformX = transformOrigin[0] * w,","            transformY = transformOrigin[1] * h,","		    transforms = this.matrix.getTransformArray(this.get(\"transform\")),","            matrix = new Y.Matrix(),","            i = 0,","            len = transforms.length,","            transform,","            key,","            contentRect,","            isPathShape = this instanceof Y.VMLPath;","        if(isPathShape)","        {","            matrix.translate(this._left, this._top);","        }","        transformX = !isNaN(transformX) ? transformX : 0;","        transformY = !isNaN(transformY) ? transformY : 0;","        matrix.translate(transformX, transformY);","        for(; i < len; i = i + 1)","        {","            transform = transforms[i];","            key = transform.shift();","            if(key)","            {","                matrix[key].apply(matrix, transform); ","            }","        }","        matrix.translate(-transformX, -transformY);","        if(isPathShape)","        {","            matrix.translate(-this._left, -this._top);","        }","        contentRect = matrix.getContentRect(w, h, x, y);","        return contentRect;","    },","","    /**","     * Places the shape above all other shapes.","     *","     * @method toFront","     */","    toFront: function()","    {","        var graphic = this.get(\"graphic\");","        if(graphic)","        {","            graphic._toFront(this);","        }","    },","","    /**","     * Places the shape underneath all other shapes.","     *","     * @method toFront","     */","    toBack: function()","    {","        var graphic = this.get(\"graphic\");","        if(graphic)","        {","            graphic._toBack(this);","        }","    },","","    /**","     * Parses path data string and call mapped methods.","     *","     * @method _parsePathData","     * @param {String} val The path data","     * @private","     */","    _parsePathData: function(val)","    {","        var method,","            methodSymbol,","            args,","            commandArray = Y.Lang.trim(val.match(SPLITPATHPATTERN)),","            i = 0,","            len, ","            str,","            symbolToMethod = this._pathSymbolToMethod;","        if(commandArray)","        {","            this.clear();","            len = commandArray.length || 0;","            for(; i < len; i = i + 1)","            {","                str = commandArray[i];","                methodSymbol = str.substr(0, 1),","                args = str.substr(1).match(SPLITARGSPATTERN);","                method = symbolToMethod[methodSymbol];","                if(method)","                {","                    this[method].apply(this, args);","                }","            }","            this.end();","        }","    },","	","    /**","     *  Destroys shape","     *","     *  @method destroy","     */","    destroy: function()","    {","        var graphic = this.get(\"graphic\");","        if(graphic)","        {","            graphic.removeShape(this);","        }","        else","        {","            this._destroy();","        }","    },","","    /**","     *  Implementation for shape destruction","     *","     *  @method destroy","     *  @protected","     */","    _destroy: function()","    {","        if(this.node)","        {   ","            if(this._fillNode)","            {","                this.node.removeChild(this._fillNode);","                this._fillNode = null;","            }","            if(this._strokeNode)","            {","                this.node.removeChild(this._strokeNode);","                this._strokeNode = null;","            }","            Y.one(this.node).remove(true);","        }","    }","}, Y.VMLDrawing.prototype));","","VMLShape.ATTRS = {","	/**","	 * An array of x, y values which indicates the transformOrigin in which to rotate the shape. Valid values range between 0 and 1 representing a ","	 * fraction of the shape's corresponding bounding box dimension. The default value is [0.5, 0.5].","	 *","	 * @config transformOrigin","	 * @type Array","	 */","	transformOrigin: {","		valueFn: function()","		{","			return [0.5, 0.5];","		}","	},","	","    /**","     * <p>A string containing, in order, transform operations applied to the shape instance. The `transform` string can contain the following values:","     *     ","     *    <dl>","     *        <dt>rotate</dt><dd>Rotates the shape clockwise around it transformOrigin.</dd>","     *        <dt>translate</dt><dd>Specifies a 2d translation.</dd>","     *        <dt>skew</dt><dd>Skews the shape around the x-axis and y-axis.</dd>","     *        <dt>scale</dt><dd>Specifies a 2d scaling operation.</dd>","     *        <dt>translateX</dt><dd>Translates the shape along the x-axis.</dd>","     *        <dt>translateY</dt><dd>Translates the shape along the y-axis.</dd>","     *        <dt>skewX</dt><dd>Skews the shape around the x-axis.</dd>","     *        <dt>skewY</dt><dd>Skews the shape around the y-axis.</dd>","     *        <dt>matrix</dt><dd>Specifies a 2D transformation matrix comprised of the specified six values.</dd>      ","     *    </dl>","     * </p>","     * <p>Applying transforms through the transform attribute will reset the transform matrix and apply a new transform. The shape class also contains corresponding methods for each transform","     * that will apply the transform to the current matrix. The below code illustrates how you might use the `transform` attribute to instantiate a recangle with a rotation of 45 degrees.</p>","            var myRect = new Y.Rect({","                type:\"rect\",","                width: 50,","                height: 40,","                transform: \"rotate(45)\"","            };","     * <p>The code below would apply `translate` and `rotate` to an existing shape.</p>","    ","        myRect.set(\"transform\", \"translate(40, 50) rotate(45)\");","	 * @config transform","     * @type String  ","	 */","	transform: {","		setter: function(val)","		{","            var i = 0,","                len,","                transform;","            this.matrix.init();	","            this._normalizedMatrix.init();	","            this._transforms = this.matrix.getTransformArray(val);","            len = this._transforms.length;","            for(;i < len; ++i)","            {","                transform = this._transforms[i];","            }","            this._transform = val;","            return val;","		},","","        getter: function()","        {","            return this._transform;","        }","	},","","	/**","	 * Indicates the x position of shape.","	 *","	 * @config x","	 * @type Number","	 */","	x: {","		value: 0","	},","","	/**","	 * Indicates the y position of shape.","	 *","	 * @config y","	 * @type Number","	 */","	y: {","		value: 0","	},","","	/**","	 * Unique id for class instance.","	 *","	 * @config id","	 * @type String","	 */","	id: {","		valueFn: function()","		{","			return Y.guid();","		},","","		setter: function(val)","		{","			var node = this.node;","			if(node)","			{","				node.setAttribute(\"id\", val);","			}","			return val;","		}","	},","	","	/**","	 * ","	 * @config width","	 */","	width: {","		value: 0","	},","","	/**","	 * ","	 * @config height","	 */","	height: {","		value: 0","	},","","	/**","	 * Indicates whether the shape is visible.","	 *","	 * @config visible","	 * @type Boolean","	 */","	visible: {","		value: true,","","		setter: function(val){","			var node = this.node,","				visibility = val ? \"visible\" : \"hidden\";","			if(node)","			{","				node.style.visibility = visibility;","			}","			return val;","		}","	},","","	/**","	 * Contains information about the fill of the shape. ","     *  <dl>","     *      <dt>color</dt><dd>The color of the fill.</dd>","     *      <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the fill. The default value is 1.</dd>","     *      <dt>type</dt><dd>Type of fill.","     *          <dl>","     *              <dt>solid</dt><dd>Solid single color fill. (default)</dd>","     *              <dt>linear</dt><dd>Linear gradient fill.</dd>","     *              <dt>radial</dt><dd>Radial gradient fill.</dd>","     *          </dl>","     *      </dd>","     *  </dl>","     *  <p>If a `linear` or `radial` is specified as the fill type. The following additional property is used:","     *  <dl>","     *      <dt>stops</dt><dd>An array of objects containing the following properties:","     *          <dl>","     *              <dt>color</dt><dd>The color of the stop.</dd>","     *              <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the stop. The default value is 1. Note: No effect for IE 6 - 8</dd>","     *              <dt>offset</dt><dd>Number between 0 and 1 indicating where the color stop is positioned.</dd> ","     *          </dl>","     *      </dd>","     *      <p>Linear gradients also have the following property:</p>","     *      <dt>rotation</dt><dd>Linear gradients flow left to right by default. The rotation property allows you to change the flow by rotation. (e.g. A rotation of 180 would make the gradient pain from right to left.)</dd>","     *      <p>Radial gradients have the following additional properties:</p>","     *      <dt>r</dt><dd>Radius of the gradient circle.</dd>","     *      <dt>fx</dt><dd>Focal point x-coordinate of the gradient.</dd>","     *      <dt>fy</dt><dd>Focal point y-coordinate of the gradient.</dd>","     *  </dl>","     *  <p>The corresponding `SVGShape` class implements the following additional properties.</p>","     *  <dl>","     *      <dt>cx</dt><dd>","     *          <p>The x-coordinate of the center of the gradient circle. Determines where the color stop begins. The default value 0.5.</p>","     *      </dd>","     *      <dt>cy</dt><dd>","     *          <p>The y-coordinate of the center of the gradient circle. Determines where the color stop begins. The default value 0.5.</p>","     *      </dd>","     *  </dl>","     *  <p>These properties are not currently implemented in `CanvasShape` or `VMLShape`.</p> ","	 *","	 * @config fill","	 * @type Object ","	 */","	fill: {","		valueFn: \"_getDefaultFill\",","		","		setter: function(val)","		{","			var i,","				fill,","				tmpl = this.get(\"fill\") || this._getDefaultFill();","			","			if(val)","			{","				//ensure, fill type is solid if color is explicitly passed.","				if(val.hasOwnProperty(\"color\"))","				{","					val.type = \"solid\";","				}","				for(i in val)","				{","					if(val.hasOwnProperty(i))","					{   ","						tmpl[i] = val[i];","					}","				}","			}","			fill = tmpl;","			if(fill && fill.color)","			{","				if(fill.color === undefined || fill.color == \"none\")","				{","					fill.color = null;","				}","			}","			this._fillFlag = true;","            return fill;","		}","	},","","	/**","	 * Contains information about the stroke of the shape.","     *  <dl>","     *      <dt>color</dt><dd>The color of the stroke.</dd>","     *      <dt>weight</dt><dd>Number that indicates the width of the stroke.</dd>","     *      <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the stroke. The default value is 1.</dd>","     *      <dt>dashstyle</dt>Indicates whether to draw a dashed stroke. When set to \"none\", a solid stroke is drawn. When set to an array, the first index indicates the","     *  length of the dash. The second index indicates the length of gap.","     *      <dt>linecap</dt><dd>Specifies the linecap for the stroke. The following values can be specified:","     *          <dl>","     *              <dt>butt (default)</dt><dd>Specifies a butt linecap.</dd>","     *              <dt>square</dt><dd>Specifies a sqare linecap.</dd>","     *              <dt>round</dt><dd>Specifies a round linecap.</dd>","     *          </dl>","     *      </dd>","     *      <dt>linejoin</dt><dd>Specifies a linejoin for the stroke. The following values can be specified:","     *          <dl>","     *              <dt>round (default)</dt><dd>Specifies that the linejoin will be round.</dd>","     *              <dt>bevel</dt><dd>Specifies a bevel for the linejoin.</dd>","     *              <dt>miter limit</dt><dd>An integer specifying the miter limit of a miter linejoin. If you want to specify a linejoin of miter, you simply specify the limit as opposed to having","     *  separate miter and miter limit values.</dd>","     *          </dl>","     *      </dd>","     *  </dl>","	 *","	 * @config stroke","	 * @type Object","	 */","	stroke: {","		valueFn: \"_getDefaultStroke\",","		","		setter: function(val)","		{","			var i,","				stroke,","                wt,","				tmpl = this.get(\"stroke\") || this._getDefaultStroke();","			if(val)","			{","                if(val.hasOwnProperty(\"weight\"))","                {","                    wt = parseInt(val.weight, 10);","                    if(!isNaN(wt))","                    {","                        val.weight = wt;","                    }","                }","				for(i in val)","				{","					if(val.hasOwnProperty(i))","					{   ","						tmpl[i] = val[i];","					}","				}","			}","			stroke = tmpl;","            this._strokeFlag = true;","			return stroke;","		}","	},","	","	//Not used. Remove in future.","    autoSize: {","		value: false","	},","","	// Only implemented in SVG","	// Determines whether the instance will receive mouse events.","	// ","	// @config pointerEvents","	// @type string","	//","	pointerEvents: {","		value: \"visiblePainted\"","	},","","	/**","	 * Dom node for the shape.","	 *","	 * @config node","	 * @type HTMLElement","	 * @readOnly","	 */","	node: {","		readOnly: true,","","		getter: function()","		{","			return this.node;","		}","	},","","    /**","     * Represents an SVG Path string.","     *","     * @config data","     * @type String","     */","    data: {","        setter: function(val)","        {","            if(this.get(\"node\"))","            {","                this._parsePathData(val);","            }","            return val;","        }","    },","","	/**","	 * Reference to the container Graphic.","	 *","	 * @config graphic","	 * @type Graphic","	 */","	graphic: {","		readOnly: true,","","		getter: function()","		{","			return this._graphic;","		}","	}","};","Y.VMLShape = VMLShape;","/**"," * <a href=\"http://www.w3.org/TR/NOTE-VML\">VML</a> implementation of the <a href=\"Path.html\">`Path`</a> class. "," * `VMLPath` is not intended to be used directly. Instead, use the <a href=\"Path.html\">`Path`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> and <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> "," * capabilities, the <a href=\"Path.html\">`Path`</a> class will point to the `VMLPath` class."," *"," * @module graphics"," * @class VMLPath"," * @extends VMLShape"," */","VMLPath = function()","{","	VMLPath.superclass.constructor.apply(this, arguments);","};","","VMLPath.NAME = \"vmlPath\";","Y.extend(VMLPath, Y.VMLShape, {","    /*","     * Completes a drawing operation. ","     *","     * @method end","     */","    end: function()","    {","        this._closePath();","        this._updateTransform();","    }","});","VMLPath.ATTRS = Y.merge(Y.VMLShape.ATTRS, {","	/**","	 * Indicates the width of the shape","	 * ","	 * @config width","	 * @type Number","	 */","	width: {","		getter: function()","		{","			var val = Math.max(this._right - this._left, 0);","			return val;","		}","	},","","	/**","	 * Indicates the height of the shape","	 * ","	 * @config height","	 * @type Number","	 */","	height: {","		getter: function()","		{","			return Math.max(this._bottom - this._top, 0);","		}","	},","	","	/**","	 * Indicates the path used for the node.","	 *","	 * @config path","	 * @type String","     * @readOnly","	 */","	path: {","		readOnly: true,","","		getter: function()","		{","			return this._path;","		}","	}","});","Y.VMLPath = VMLPath;","/**"," * <a href=\"http://www.w3.org/TR/NOTE-VML\">VML</a> implementation of the <a href=\"Rect.html\">`Rect`</a> class. "," * `VMLRect` is not intended to be used directly. Instead, use the <a href=\"Rect.html\">`Rect`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> and <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> "," * capabilities, the <a href=\"Rect.html\">`Rect`</a> class will point to the `VMLRect` class."," *"," * @module graphics"," * @class VMLRect"," * @constructor"," */","VMLRect = function()","{","	VMLRect.superclass.constructor.apply(this, arguments);","};","VMLRect.NAME = \"vmlRect\"; ","Y.extend(VMLRect, Y.VMLShape, {","	/**","	 * Indicates the type of shape","	 *","	 * @property _type","	 * @type String","     * @private","	 */","	_type: \"rect\"","});","VMLRect.ATTRS = Y.VMLShape.ATTRS;","Y.VMLRect = VMLRect;","/**"," * <a href=\"http://www.w3.org/TR/NOTE-VML\">VML</a> implementation of the <a href=\"Ellipse.html\">`Ellipse`</a> class. "," * `VMLEllipse` is not intended to be used directly. Instead, use the <a href=\"Ellipse.html\">`Ellipse`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> and <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> "," * capabilities, the <a href=\"Ellipse.html\">`Ellipse`</a> class will point to the `VMLEllipse` class."," *"," * @module graphics"," * @class VMLEllipse"," * @constructor"," */","VMLEllipse = function()","{","	VMLEllipse.superclass.constructor.apply(this, arguments);","};","","VMLEllipse.NAME = \"vmlEllipse\";","","Y.extend(VMLEllipse, Y.VMLShape, {","	/**","	 * Indicates the type of shape","	 *","	 * @property _type","	 * @type String","     * @private","	 */","	_type: \"oval\"","});","VMLEllipse.ATTRS = Y.merge(Y.VMLShape.ATTRS, {","	/**","	 * Horizontal radius for the ellipse. ","	 *","	 * @config xRadius","	 * @type Number","	 */","	xRadius: {","		lazyAdd: false,","","		getter: function()","		{","			var val = this.get(\"width\");","			val = Math.round((val/2) * 100)/100;","			return val;","		},","		","		setter: function(val)","		{","			var w = val * 2; ","			this.set(\"width\", w);","			return val;","		}","	},","","	/**","	 * Vertical radius for the ellipse. ","	 *","	 * @config yRadius","	 * @type Number","	 * @readOnly","	 */","	yRadius: {","		lazyAdd: false,","		","		getter: function()","		{","			var val = this.get(\"height\");","			val = Math.round((val/2) * 100)/100;","			return val;","		},","","		setter: function(val)","		{","			var h = val * 2;","			this.set(\"height\", h);","			return val;","		}","	}","});","Y.VMLEllipse = VMLEllipse;","/**"," * <a href=\"http://www.w3.org/TR/NOTE-VML\">VML</a> implementation of the <a href=\"Circle.html\">`Circle`</a> class. "," * `VMLCircle` is not intended to be used directly. Instead, use the <a href=\"Circle.html\">`Circle`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> and <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> "," * capabilities, the <a href=\"Circle.html\">`Circle`</a> class will point to the `VMLCircle` class."," *"," * @module graphics"," * @class VMLCircle"," * @constructor"," */","VMLCircle = function(cfg)","{","	VMLCircle.superclass.constructor.apply(this, arguments);","};","","VMLCircle.NAME = \"vmlCircle\";","","Y.extend(VMLCircle, VMLShape, {","	/**","	 * Indicates the type of shape","	 *","	 * @property _type","	 * @type String","     * @private","	 */","	_type: \"oval\"","});","","VMLCircle.ATTRS = Y.merge(VMLShape.ATTRS, {","	/**","	 * Radius for the circle.","	 *","	 * @config radius","	 * @type Number","	 */","	radius: {","		lazyAdd: false,","","		value: 0","	},","","	/**","	 * Indicates the width of the shape","	 *","	 * @config width","	 * @type Number","	 */","	width: {","        setter: function(val)","        {","            this.set(\"radius\", val/2);","            return val;","        },","","		getter: function()","		{   ","			var radius = this.get(\"radius\"),","			val = radius && radius > 0 ? radius * 2 : 0;","			return val;","		}","	},","","	/**","	 * Indicates the height of the shape","	 *","	 * @config height","	 * @type Number","	 */","	height: {","        setter: function(val)","        {","            this.set(\"radius\", val/2);","            return val;","        },","","		getter: function()","		{   ","			var radius = this.get(\"radius\"),","			val = radius && radius > 0 ? radius * 2 : 0;","			return val;","		}","	}","});","Y.VMLCircle = VMLCircle;","/**"," * Draws pie slices"," *"," * @module graphics"," * @class VMLPieSlice"," * @constructor"," */","VMLPieSlice = function()","{","	VMLPieSlice.superclass.constructor.apply(this, arguments);","};","VMLPieSlice.NAME = \"vmlPieSlice\";","Y.extend(VMLPieSlice, Y.VMLShape, Y.mix({","    /**","     * Indicates the type of shape","     *","     * @property _type","     * @type String","     * @private","     */","    _type: \"shape\",","","	/**","	 * Change event listener","	 *","	 * @private","	 * @method _updateHandler","	 */","	_draw: function(e)","	{","        var x = this.get(\"cx\"),","            y = this.get(\"cy\"),","            startAngle = this.get(\"startAngle\"),","            arc = this.get(\"arc\"),","            radius = this.get(\"radius\");","        this.clear();","        this.drawWedge(x, y, startAngle, arc, radius);","		this.end();","	}"," }, Y.VMLDrawing.prototype));","VMLPieSlice.ATTRS = Y.mix({","    cx: {","        value: 0","    },","","    cy: {","        value: 0","    },","    /**","     * Starting angle in relation to a circle in which to begin the pie slice drawing.","     *","     * @config startAngle","     * @type Number","     */","    startAngle: {","        value: 0","    },","","    /**","     * Arc of the slice.","     *","     * @config arc","     * @type Number","     */","    arc: {","        value: 0","    },","","    /**","     * Radius of the circle in which the pie slice is drawn","     *","     * @config radius","     * @type Number","     */","    radius: {","        value: 0","    }","}, Y.VMLShape.ATTRS);","Y.VMLPieSlice = VMLPieSlice;","/**"," * <a href=\"http://www.w3.org/TR/NOTE-VML\">VML</a> implementation of the <a href=\"Graphic.html\">`Graphic`</a> class. "," * `VMLGraphic` is not intended to be used directly. Instead, use the <a href=\"Graphic.html\">`Graphic`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> and <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> "," * capabilities, the <a href=\"Graphic.html\">`Graphic`</a> class will point to the `VMLGraphic` class."," *"," * @module graphics"," * @class VMLGraphic"," * @constructor"," */","VMLGraphic = function() {","    VMLGraphic.superclass.constructor.apply(this, arguments);    ","};","","VMLGraphic.NAME = \"vmlGraphic\";","","VMLGraphic.ATTRS = {","    /**","     * Whether or not to render the `Graphic` automatically after to a specified parent node after init. This can be a Node instance or a CSS selector string.","     * ","     * @config render","     * @type Node | String ","     */","    render: {},","	","    /**","	 * Unique id for class instance.","	 *","	 * @config id","	 * @type String","	 */","	id: {","		valueFn: function()","		{","			return Y.guid();","		},","","		setter: function(val)","		{","			var node = this._node;","			if(node)","			{","				node.setAttribute(\"id\", val);","			}","			return val;","		}","	},","","    /**","     * Key value pairs in which a shape instance is associated with its id.","     *","     *  @config shapes","     *  @type Object","     *  @readOnly","     */","    shapes: {","        readOnly: true,","","        getter: function()","        {","            return this._shapes;","        }","    },","","    /**","     *  Object containing size and coordinate data for the content of a Graphic in relation to the coordSpace node.","     *","     *  @config contentBounds","     *  @type Object","     */","    contentBounds: {","        readOnly: true,","","        getter: function()","        {","            return this._contentBounds;","        }","    },","","    /**","     *  The html element that represents to coordinate system of the Graphic instance.","     *","     *  @config node","     *  @type HTMLElement","     */","    node: {","        readOnly: true,","","        getter: function()","        {","            return this._node;","        }","    },","","	/**","	 * Indicates the width of the `Graphic`. ","	 *","	 * @config width","	 * @type Number","	 */","    width: {","        setter: function(val)","        {","            if(this._node)","            {","                this._node.style.width = val + \"px\";","            }","            return val;","        }","    },","","	/**","	 * Indicates the height of the `Graphic`. ","	 *","	 * @config height ","	 * @type Number","	 */","    height: {","        setter: function(val)","        {","            if(this._node)","            {","                this._node.style.height = val + \"px\";","            }","            return val;","        }","    },","","    /**","     *  Determines the sizing of the Graphic. ","     *","     *  <dl>","     *      <dt>sizeContentToGraphic</dt><dd>The Graphic's width and height attributes are, either explicitly set through the <code>width</code> and <code>height</code>","     *      attributes or are determined by the dimensions of the parent element. The content contained in the Graphic will be sized to fit with in the Graphic instance's ","     *      dimensions. When using this setting, the <code>preserveAspectRatio</code> attribute will determine how the contents are sized.</dd>","     *      <dt>sizeGraphicToContent</dt><dd>(Also accepts a value of true) The Graphic's width and height are determined by the size and positioning of the content.</dd>","     *      <dt>false</dt><dd>The Graphic's width and height attributes are, either explicitly set through the <code>width</code> and <code>height</code>","     *      attributes or are determined by the dimensions of the parent element. The contents of the Graphic instance are not affected by this setting.</dd>","     *  </dl>","     *","     *","     *  @config autoSize","     *  @type Boolean | String","     *  @default false","     */","    autoSize: {","        value: false","    },","","    /**","     * Determines how content is sized when <code>autoSize</code> is set to <code>sizeContentToGraphic</code>.","     *","     *  <dl>","     *      <dt>none<dt><dd>Do not force uniform scaling. Scale the graphic content of the given element non-uniformly if necessary ","     *      such that the element's bounding box exactly matches the viewport rectangle.</dd>","     *      <dt>xMinYMin</dt><dd>Force uniform scaling position along the top left of the Graphic's node.</dd>","     *      <dt>xMidYMin</dt><dd>Force uniform scaling horizontally centered and positioned at the top of the Graphic's node.<dd>","     *      <dt>xMaxYMin</dt><dd>Force uniform scaling positioned horizontally from the right and vertically from the top.</dd>","     *      <dt>xMinYMid</dt>Force uniform scaling positioned horizontally from the left and vertically centered.</dd>","     *      <dt>xMidYMid (the default)</dt><dd>Force uniform scaling with the content centered.</dd>","     *      <dt>xMaxYMid</dt><dd>Force uniform scaling positioned horizontally from the right and vertically centered.</dd>","     *      <dt>xMinYMax</dt><dd>Force uniform scaling positioned horizontally from the left and vertically from the bottom.</dd>","     *      <dt>xMidYMax</dt><dd>Force uniform scaling horizontally centered and position vertically from the bottom.</dd>","     *      <dt>xMaxYMax</dt><dd>Force uniform scaling positioned horizontally from the right and vertically from the bottom.</dd>","     *  </dl>","     * ","     * @config preserveAspectRatio","     * @type String","     * @default xMidYMid","     */","    preserveAspectRatio: {","        value: \"xMidYMid\"","    },","","    /**","     * The contentBounds will resize to greater values but not values. (for performance)","     * When resizing the contentBounds down is desirable, set the resizeDown value to true.","     *","     * @config resizeDown ","     * @type Boolean","     */","    resizeDown: {","        resizeDown: false","    },","","	/**","	 * Indicates the x-coordinate for the instance.","	 *","	 * @config x","	 * @type Number","	 */","    x: {","        getter: function()","        {","            return this._x;","        },","","        setter: function(val)","        {","            this._x = val;","            if(this._node)","            {","                this._node.style.left = val + \"px\";","            }","            return val;","        }","    },","","	/**","	 * Indicates the y-coordinate for the instance.","	 *","	 * @config y","	 * @type Number","	 */","    y: {","        getter: function()","        {","            return this._y;","        },","","        setter: function(val)","        {","            this._y = val;","            if(this._node)","            {","                this._node.style.top = val + \"px\";","            }","            return val;","        }","    },","","    /**","     * Indicates whether or not the instance will automatically redraw after a change is made to a shape.","     * This property will get set to false when batching operations.","     *","     * @config autoDraw","     * @type Boolean","     * @default true","     * @private","     */","    autoDraw: {","        value: true","    },","","    visible: {","        value: true,","","        setter: function(val)","        {","            this._toggleVisible(val);","            return val;","        }","    }","};","","Y.extend(VMLGraphic, Y.GraphicBase, {","    /**","     * Sets the value of an attribute.","     *","     * @method set","     * @param {String|Object} name The name of the attribute. Alternatively, an object of key value pairs can ","     * be passed in to set multiple attributes at once.","     * @param {Any} value The value to set the attribute to. This value is ignored if an object is received as ","     * the name param.","     */","	set: function(attr, value) ","	{","		var host = this,","            redrawAttrs = {","                autoDraw: true,","                autoSize: true,","                preserveAspectRatio: true,","                resizeDown: true","            },","            key,","            forceRedraw = false;","		AttributeLite.prototype.set.apply(host, arguments);	","        if(host._state.autoDraw === true && Y.Object.size(this._shapes) > 0)","        {","            if(Y_LANG.isString && redrawAttrs[attr])","            {","                forceRedraw = true;","            }","            else if(Y_LANG.isObject(attr))","            {","                for(key in redrawAttrs)","                {","                    if(redrawAttrs.hasOwnProperty(key) && attr[key])","                    {","                        forceRedraw = true;","                        break;","                    }","                }","            }","        }","        if(forceRedraw)","        {","            host._redraw();","        }","	},","","    /**","     * Storage for `x` attribute.","     *","     * @property _x","     * @type Number","     * @private","     */","    _x: 0,","","    /**","     * Storage for `y` attribute.","     *","     * @property _y","     * @type Number","     * @private","     */","    _y: 0,","","    /**","     * Gets the current position of the graphic instance in page coordinates.","     *","     * @method getXY","     * @return Array The XY position of the shape.","     */","    getXY: function()","    {","        var node = this.parentNode,","            x = this.get(\"x\"),","            y = this.get(\"y\"),","            xy;","        if(node)","        {","            xy = Y.one(node).getXY();","            xy[0] += x;","            xy[1] += y;","        }","        else","        {","            xy = Y.DOM._getOffset(this._node);","        }","        return xy;","    },","","    /**","     * Initializes the class.","     *","     * @method initializer","     * @private","     */","    initializer: function(config) {","        var render = this.get(\"render\"),","            visibility = this.get(\"visible\") ? \"visible\" : \"hidden\";","        this._shapes = {};","		this._contentBounds = {","            left: 0,","            top: 0,","            right: 0,","            bottom: 0","        };","        this._node = DOCUMENT.createElement('div');","        this._node.style.position = \"absolute\";","        this._node.style.left = this.get(\"x\") + \"px\";","        this._node.style.top = this.get(\"y\") + \"px\";","        this._node.style.visibility = visibility;","        this._node.setAttribute(\"id\", this.get(\"id\"));","        this._contentNode = this._createGraphic();","        this._contentNode.style.position = \"absolute\";","        this._contentNode.style.left = \"0px\";","        this._contentNode.style.top = \"0px\";","        this._contentNode.style.visibility = visibility;","        this._node.appendChild(this._contentNode);","        if(render)","        {","            this.render(render);","        }","    },","    ","    /**","     * Adds the graphics node to the dom.","     * ","     * @method render","     * @param {HTMLElement} parentNode node in which to render the graphics node into.","     */","    render: function(render) {","        var parentNode = Y.one(render),","            w = this.get(\"width\") || parseInt(parentNode.getComputedStyle(\"width\"), 10),","            h = this.get(\"height\") || parseInt(parentNode.getComputedStyle(\"height\"), 10);","        parentNode = parentNode || DOCUMENT.body;","        parentNode.appendChild(this._node);","        this.parentNode = parentNode;","        this.set(\"width\", w);","        this.set(\"height\", h);","        return this;","    },","","    /**","     * Removes all nodes.","     *","     * @method destroy","     */","    destroy: function()","    {","        this.clear();","        Y.one(this._node).remove(true);","    },","","    /**","     * Generates a shape instance by type.","     *","     * @method addShape","     * @param {Object} cfg attributes for the shape","     * @return Shape","     */","    addShape: function(cfg)","    {","        cfg.graphic = this;","        if(!this.get(\"visible\"))","        {","            cfg.visible = false;","        }","        var shapeClass = this._getShapeClass(cfg.type),","            shape = new shapeClass(cfg);","        this._appendShape(shape);","        shape._appendStrokeAndFill();","        return shape;","    },","","    /**","     * Adds a shape instance to the graphic instance.","     *","     * @method _appendShape","     * @param {Shape} shape The shape instance to be added to the graphic.","     * @private","     */","    _appendShape: function(shape)","    {","        var node = shape.node,","            parentNode = this._frag || this._contentNode;","        if(this.get(\"autoDraw\")) ","        {","            parentNode.appendChild(node);","        }","        else","        {","            this._getDocFrag().appendChild(node);","        }","    },","","    /**","     * Removes a shape instance from from the graphic instance.","     *","     * @method removeShape","     * @param {Shape|String} shape The instance or id of the shape to be removed.","     */","    removeShape: function(shape)","    {","        if(!(shape instanceof VMLShape))","        {","            if(Y_LANG.isString(shape))","            {","                shape = this._shapes[shape];","            }","        }","        if(shape && (shape instanceof VMLShape))","        {","            shape._destroy();","            this._shapes[shape.get(\"id\")] = null;","            delete this._shapes[shape.get(\"id\")];","        }","        if(this.get(\"autoDraw\"))","        {","            this._redraw();","        }","    },","","    /**","     * Removes all shape instances from the dom.","     *","     * @method removeAllShapes","     */","    removeAllShapes: function()","    {","        var shapes = this._shapes,","            i;","        for(i in shapes)","        {","            if(shapes.hasOwnProperty(i))","            {","                shapes[i].destroy();","            }","        }","        this._shapes = {};","    },","","    /**","     * Removes all child nodes.","     *","     * @method _removeChildren","     * @param node","     * @private","     */","    _removeChildren: function(node)","    {","        if(node.hasChildNodes())","        {","            var child;","            while(node.firstChild)","            {","                child = node.firstChild;","                this._removeChildren(child);","                node.removeChild(child);","            }","        }","    },","","    /**","     * Clears the graphics object.","     *","     * @method clear","     */","    clear: function() {","        this.removeAllShapes();","        this._removeChildren(this._contentNode);","    },","","    /**","     * Toggles visibility","     *","     * @method _toggleVisible","     * @param {Boolean} val indicates visibilitye","     * @private","     */","    _toggleVisible: function(val)","    {","        var i,","            shapes = this._shapes,","            visibility = val ? \"visible\" : \"hidden\";","        if(shapes)","        {","            for(i in shapes)","            {","                if(shapes.hasOwnProperty(i))","                {","                    shapes[i].set(\"visible\", val);","                }","            }","        }","        if(this._contentNode)","        {","            this._contentNode.style.visibility = visibility;","        }","        if(this._node)","        {","            this._node.style.visibility = visibility;","        }","    },","","    /**","     * Sets the size of the graphics object.","     * ","     * @method setSize","     * @param w {Number} width to set for the instance.","     * @param h {Number} height to set for the instance.","     */","    setSize: function(w, h) {","        w = Math.round(w);","        h = Math.round(h);","        this._node.style.width = w + 'px';","        this._node.style.height = h + 'px';","    },","","    /**","     * Sets the positon of the graphics object.","     *","     * @method setPosition","     * @param {Number} x x-coordinate for the object.","     * @param {Number} y y-coordinate for the object.","     */","    setPosition: function(x, y)","    {","        x = Math.round(x);","        y = Math.round(y);","        this._node.style.left = x + \"px\";","        this._node.style.top = y + \"px\";","    },","","    /**","     * Creates a group element","     *","     * @method _createGraphic","     * @private","     */","    _createGraphic: function() {","        var group = DOCUMENT.createElement('<group xmlns=\"urn:schemas-microsft.com:vml\" style=\"behavior:url(#default#VML);display:block;position:absolute;top:0px;left:0px;zoom:1;\" />');","        return group;","    },","","    /**","     * Creates a graphic node","     *","     * @method _createGraphicNode","     * @param {String} type node type to create","     * @param {String} pe specified pointer-events value","     * @return HTMLElement","     * @private","     */","    _createGraphicNode: function(type)","    {","        return DOCUMENT.createElement('<' + type + ' xmlns=\"urn:schemas-microsft.com:vml\" style=\"behavior:url(#default#VML);display:inline-block;zoom:1;\" />');","    ","    },","","    /**","     * Returns a shape based on the id of its dom node.","     *","     * @method getShapeById","     * @param {String} id Dom id of the shape's node attribute.","     * @return Shape","     */","    getShapeById: function(id)","    {","        return this._shapes[id];","    },","","    /**","     * Returns a shape class. Used by `addShape`. ","     *","     * @method _getShapeClass","     * @param {Shape | String} val Indicates which shape class. ","     * @return Function ","     * @private","     */","    _getShapeClass: function(val)","    {","        var shape = this._shapeClass[val];","        if(shape)","        {","            return shape;","        }","        return val;","    },","","    /**","     * Look up for shape classes. Used by `addShape` to retrieve a class for instantiation.","     *","     * @property _shapeClass","     * @type Object","     * @private","     */","    _shapeClass: {","        circle: Y.VMLCircle,","        rect: Y.VMLRect,","        path: Y.VMLPath,","        ellipse: Y.VMLEllipse,","        pieslice: Y.VMLPieSlice","    },","","	/**","	 * Allows for creating multiple shapes in order to batch appending and redraw operations.","	 *","	 * @method batch","	 * @param {Function} method Method to execute.","	 */","    batch: function(method)","    {","        var autoDraw = this.get(\"autoDraw\");","        this.set(\"autoDraw\", false);","        method.apply();","        this._redraw();","        this.set(\"autoDraw\", autoDraw);","    },","    ","    /**","     * Returns a document fragment to for attaching shapes.","     *","     * @method _getDocFrag","     * @return DocumentFragment","     * @private","     */","    _getDocFrag: function()","    {","        if(!this._frag)","        {","            this._frag = DOCUMENT.createDocumentFragment();","        }","        return this._frag;","    },","","    /**","     * Adds a shape to the redraw queue and calculates the contentBounds. ","     *","     * @method addToRedrawQueue","     * @param shape {VMLShape}","     * @protected","     */","    addToRedrawQueue: function(shape)","    {","        var shapeBox,","            box;","        this._shapes[shape.get(\"id\")] = shape;","        if(!this.get(\"resizeDown\"))","        {","            shapeBox = shape.getBounds();","            box = this._contentBounds;","            box.left = box.left < shapeBox.left ? box.left : shapeBox.left;","            box.top = box.top < shapeBox.top ? box.top : shapeBox.top;","            box.right = box.right > shapeBox.right ? box.right : shapeBox.right;","            box.bottom = box.bottom > shapeBox.bottom ? box.bottom : shapeBox.bottom;","            box.width = box.right - box.left;","            box.height = box.bottom - box.top;","            this._contentBounds = box;","        }","        if(this.get(\"autoDraw\")) ","        {","            this._redraw();","        }","    },","","    /**","     * Redraws all shapes.","     *","     * @method _redraw","     * @private","     */","    _redraw: function()","    {","        var autoSize = this.get(\"autoSize\"),","            preserveAspectRatio,","            nodeWidth,","            nodeHeight,","            xCoordOrigin = 0,","            yCoordOrigin = 0,","            box = this.get(\"resizeDown\") ? this._getUpdatedContentBounds() : this._contentBounds,","            left = box.left,","            right = box.right,","            top = box.top,","            bottom = box.bottom,","            contentWidth = right - left,","            contentHeight = bottom - top,","            aspectRatio,","            xCoordSize,","            yCoordSize,","            scaledWidth,","            scaledHeight,","            visible = this.get(\"visible\");","        this._contentNode.style.visibility = \"hidden\";","        if(autoSize)","        {","            if(autoSize == \"sizeContentToGraphic\")","            {","                preserveAspectRatio = this.get(\"preserveAspectRatio\");","                nodeWidth = this.get(\"width\");","                nodeHeight = this.get(\"height\");","                if(preserveAspectRatio == \"none\" || contentWidth/contentHeight === nodeWidth/nodeHeight)","                {","                    xCoordOrigin = left;","                    yCoordOrigin = top;","                    xCoordSize = contentWidth;","                    yCoordSize = contentHeight;","                }","                else ","                {","                    if(contentWidth * nodeHeight/contentHeight > nodeWidth)","                    {","                        aspectRatio = nodeHeight/nodeWidth;","                        xCoordSize = contentWidth;","                        yCoordSize = contentWidth * aspectRatio;","                        scaledHeight = (nodeWidth * (contentHeight/contentWidth)) * (yCoordSize/nodeHeight);","                        yCoordOrigin = this._calculateCoordOrigin(preserveAspectRatio.slice(5).toLowerCase(), scaledHeight, yCoordSize);","                        yCoordOrigin = top + yCoordOrigin;","                        xCoordOrigin = left;","                    }","                    else","                    {","                        aspectRatio = nodeWidth/nodeHeight;","                        xCoordSize = contentHeight * aspectRatio;","                        yCoordSize = contentHeight;","                        scaledWidth = (nodeHeight * (contentWidth/contentHeight)) * (xCoordSize/nodeWidth);","                        xCoordOrigin = this._calculateCoordOrigin(preserveAspectRatio.slice(1, 4).toLowerCase(), scaledWidth, xCoordSize);","                        xCoordOrigin = xCoordOrigin + left;","                        yCoordOrigin = top;","                    }","                }","                this._contentNode.style.width = nodeWidth + \"px\";","                this._contentNode.style.height = nodeHeight + \"px\";","                this._contentNode.coordOrigin = xCoordOrigin + \", \" + yCoordOrigin;","            }","            else ","            {","                xCoordSize = contentWidth;","                yCoordSize = contentHeight;","                this._contentNode.style.width = contentWidth + \"px\";","                this._contentNode.style.height = contentHeight + \"px\";","                this._state.width = contentWidth;","                this._state.height =  contentHeight;","                if(this._node)","                {","                    this._node.style.width = contentWidth + \"px\";","                    this._node.style.height = contentHeight + \"px\";","                }","","            }","            this._contentNode.coordSize = xCoordSize + \", \" + yCoordSize;","        }","        else","        {","            this._contentNode.style.width = right + \"px\";","            this._contentNode.style.height = bottom + \"px\";","            this._contentNode.coordSize = right + \", \" + bottom;","        }","        if(this._frag)","        {","            this._contentNode.appendChild(this._frag);","            this._frag = null;","        }","        if(visible)","        {","            this._contentNode.style.visibility = \"visible\";","        }","    },","    ","    /**","     * Determines the value for either an x or y coordinate to be used for the <code>coordOrigin</code> of the Graphic.","     *","     * @method _calculateCoordOrigin","     * @param {String} position The position for placement. Possible values are min, mid and max.","     * @param {Number} size The total scaled size of the content.","     * @param {Number} coordsSize The coordsSize for the Graphic.","     * @return Number","     * @private","     */","    _calculateCoordOrigin: function(position, size, coordsSize)","    {","        var coord;","        switch(position)","        {","            case \"min\" :","                coord = 0;","            break;","            case \"mid\" :","                coord = (size - coordsSize)/2;","            break;","            case \"max\" :","                coord = (size - coordsSize);","            break;","        }","        return coord;","    },","","    /**","     * Recalculates and returns the `contentBounds` for the `Graphic` instance.","     *","     * @method _getUpdatedContentBounds","     * @return {Object} ","     * @private","     */","    _getUpdatedContentBounds: function()","    {","        var bounds,","            i,","            shape,","            queue = this._shapes,","            box = {};","        for(i in queue)","        {","            if(queue.hasOwnProperty(i))","            {","                shape = queue[i];","                bounds = shape.getBounds();","                box.left = Y_LANG.isNumber(box.left) ? Math.min(box.left, bounds.left) : bounds.left;","                box.top = Y_LANG.isNumber(box.top) ? Math.min(box.top, bounds.top) : bounds.top;","                box.right = Y_LANG.isNumber(box.right) ? Math.max(box.right, bounds.right) : bounds.right;","                box.bottom = Y_LANG.isNumber(box.bottom) ? Math.max(box.bottom, bounds.bottom) : bounds.bottom;","            }","        }","        box.left = Y_LANG.isNumber(box.left) ? box.left : 0;","        box.top = Y_LANG.isNumber(box.top) ? box.top : 0;","        box.right = Y_LANG.isNumber(box.right) ? box.right : 0;","        box.bottom = Y_LANG.isNumber(box.bottom) ? box.bottom : 0;","        this._contentBounds = box;","        return box;","    },","","    /**","     * Inserts shape on the top of the tree.","     *","     * @method _toFront","     * @param {VMLShape} Shape to add.","     * @private","     */","    _toFront: function(shape)","    {","        var contentNode = this._contentNode;","        if(shape instanceof Y.VMLShape)","        {","            shape = shape.get(\"node\");","        }","        if(contentNode && shape)","        {","            contentNode.appendChild(shape);","        }","    },","","    /**","     * Inserts shape as the first child of the content node.","     *","     * @method _toBack","     * @param {VMLShape} Shape to add.","     * @private","     */","    _toBack: function(shape)","    {","        var contentNode = this._contentNode,","            targetNode;","        if(shape instanceof Y.VMLShape)","        {","            shape = shape.get(\"node\");","        }","        if(contentNode && shape)","        {","            targetNode = contentNode.firstChild;","            if(targetNode)","            {","                contentNode.insertBefore(shape, targetNode);","            }","            else","            {","                contentNode.appendChild(shape);","            }","        }","    }","});","Y.VMLGraphic = VMLGraphic;","","","","}, '@VERSION@', {\"requires\": [\"graphics\"]});"];
_yuitest_coverage["build/graphics-vml/graphics-vml.js"].lines = {"1":0,"3":0,"23":0,"35":0,"72":0,"84":0,"85":0,"87":0,"88":0,"90":0,"123":0,"138":0,"150":0,"167":0,"168":0,"169":0,"171":0,"172":0,"173":0,"174":0,"175":0,"176":0,"177":0,"179":0,"181":0,"182":0,"183":0,"184":0,"185":0,"186":0,"187":0,"188":0,"189":0,"190":0,"191":0,"192":0,"193":0,"194":0,"195":0,"196":0,"197":0,"199":0,"212":0,"218":0,"231":0,"232":0,"233":0,"234":0,"235":0,"236":0,"237":0,"238":0,"253":0,"254":0,"255":0,"256":0,"257":0,"258":0,"259":0,"260":0,"261":0,"262":0,"275":0,"279":0,"280":0,"281":0,"282":0,"283":0,"284":0,"298":0,"302":0,"303":0,"304":0,"305":0,"306":0,"307":0,"322":0,"324":0,"325":0,"326":0,"327":0,"328":0,"329":0,"346":0,"347":0,"349":0,"351":0,"352":0,"353":0,"354":0,"355":0,"356":0,"357":0,"358":0,"359":0,"360":0,"371":0,"375":0,"376":0,"378":0,"379":0,"380":0,"381":0,"382":0,"383":0,"385":0,"386":0,"397":0,"398":0,"399":0,"400":0,"401":0,"402":0,"413":0,"421":0,"422":0,"423":0,"425":0,"427":0,"429":0,"431":0,"434":0,"436":0,"438":0,"440":0,"441":0,"442":0,"443":0,"444":0,"446":0,"447":0,"448":0,"458":0,"468":0,"478":0,"479":0,"480":0,"481":0,"482":0,"483":0,"484":0,"485":0,"498":0,"503":0,"504":0,"507":0,"508":0,"509":0,"510":0,"513":0,"527":0,"535":0,"537":0,"538":0,"539":0,"540":0,"541":0,"543":0,"544":0,"545":0,"546":0,"547":0,"548":0,"560":0,"561":0,"563":0,"565":0,"567":0,"569":0,"571":0,"573":0,"575":0,"576":0,"591":0,"603":0,"605":0,"606":0,"607":0,"608":0,"611":0,"613":0,"632":0,"643":0,"646":0,"647":0,"649":0,"651":0,"653":0,"655":0,"668":0,"669":0,"671":0,"675":0,"676":0,"679":0,"680":0,"681":0,"693":0,"695":0,"697":0,"699":0,"712":0,"731":0,"732":0,"733":0,"734":0,"735":0,"737":0,"739":0,"741":0,"742":0,"743":0,"744":0,"745":0,"746":0,"748":0,"749":0,"750":0,"752":0,"754":0,"756":0,"758":0,"760":0,"762":0,"764":0,"766":0,"767":0,"768":0,"772":0,"774":0,"776":0,"778":0,"779":0,"781":0,"783":0,"785":0,"789":0,"790":0,"792":0,"794":0,"795":0,"796":0,"807":0,"808":0,"819":0,"820":0,"831":0,"835":0,"847":0,"849":0,"850":0,"862":0,"873":0,"875":0,"887":0,"900":0,"910":0,"912":0,"913":0,"914":0,"915":0,"917":0,"919":0,"920":0,"921":0,"922":0,"923":0,"924":0,"925":0,"926":0,"927":0,"928":0,"929":0,"931":0,"932":0,"933":0,"935":0,"936":0,"939":0,"941":0,"945":0,"946":0,"948":0,"949":0,"952":0,"954":0,"965":0,"967":0,"969":0,"979":0,"981":0,"982":0,"983":0,"985":0,"987":0,"988":0,"989":0,"990":0,"991":0,"992":0,"993":0,"994":0,"995":0,"997":0,"998":0,"1000":0,"1001":0,"1002":0,"1004":0,"1005":0,"1006":0,"1008":0,"1009":0,"1012":0,"1014":0,"1018":0,"1019":0,"1021":0,"1022":0,"1025":0,"1026":0,"1030":0,"1032":0,"1034":0,"1036":0,"1049":0,"1056":0,"1058":0,"1060":0,"1062":0,"1063":0,"1064":0,"1065":0,"1066":0,"1067":0,"1069":0,"1071":0,"1074":0,"1075":0,"1077":0,"1079":0,"1080":0,"1081":0,"1082":0,"1084":0,"1085":0,"1086":0,"1088":0,"1092":0,"1094":0,"1105":0,"1107":0,"1109":0,"1116":0,"1118":0,"1120":0,"1121":0,"1122":0,"1124":0,"1126":0,"1128":0,"1130":0,"1134":0,"1141":0,"1142":0,"1144":0,"1146":0,"1149":0,"1150":0,"1151":0,"1154":0,"1156":0,"1157":0,"1158":0,"1159":0,"1161":0,"1162":0,"1164":0,"1166":0,"1168":0,"1172":0,"1173":0,"1174":0,"1177":0,"1179":0,"1180":0,"1184":0,"1185":0,"1191":0,"1193":0,"1194":0,"1208":0,"1230":0,"1232":0,"1234":0,"1236":0,"1238":0,"1242":0,"1244":0,"1245":0,"1247":0,"1249":0,"1250":0,"1251":0,"1252":0,"1253":0,"1254":0,"1255":0,"1256":0,"1257":0,"1258":0,"1259":0,"1261":0,"1262":0,"1263":0,"1264":0,"1265":0,"1266":0,"1267":0,"1268":0,"1269":0,"1270":0,"1271":0,"1273":0,"1275":0,"1277":0,"1278":0,"1291":0,"1292":0,"1293":0,"1294":0,"1295":0,"1297":0,"1309":0,"1322":0,"1324":0,"1326":0,"1328":0,"1332":0,"1333":0,"1336":0,"1337":0,"1338":0,"1340":0,"1341":0,"1343":0,"1344":0,"1347":0,"1349":0,"1351":0,"1358":0,"1359":0,"1361":0,"1363":0,"1364":0,"1366":0,"1367":0,"1369":0,"1371":0,"1373":0,"1376":0,"1377":0,"1390":0,"1392":0,"1393":0,"1432":0,"1433":0,"1434":0,"1446":0,"1447":0,"1459":0,"1460":0,"1472":0,"1483":0,"1494":0,"1505":0,"1516":0,"1530":0,"1532":0,"1534":0,"1555":0,"1557":0,"1558":0,"1559":0,"1560":0,"1561":0,"1562":0,"1575":0,"1576":0,"1587":0,"1606":0,"1625":0,"1626":0,"1627":0,"1629":0,"1644":0,"1649":0,"1651":0,"1652":0,"1653":0,"1654":0,"1656":0,"1671":0,"1682":0,"1684":0,"1686":0,"1687":0,"1688":0,"1689":0,"1691":0,"1692":0,"1693":0,"1695":0,"1698":0,"1699":0,"1701":0,"1703":0,"1704":0,"1714":0,"1715":0,"1717":0,"1728":0,"1729":0,"1731":0,"1744":0,"1752":0,"1754":0,"1755":0,"1756":0,"1758":0,"1759":0,"1761":0,"1762":0,"1764":0,"1767":0,"1778":0,"1779":0,"1781":0,"1785":0,"1797":0,"1799":0,"1801":0,"1802":0,"1804":0,"1806":0,"1807":0,"1809":0,"1814":0,"1825":0,"1861":0,"1864":0,"1865":0,"1866":0,"1867":0,"1868":0,"1870":0,"1872":0,"1873":0,"1878":0,"1911":0,"1916":0,"1917":0,"1919":0,"1921":0,"1951":0,"1953":0,"1955":0,"1957":0,"2009":0,"2013":0,"2016":0,"2018":0,"2020":0,"2022":0,"2024":0,"2028":0,"2029":0,"2031":0,"2033":0,"2036":0,"2037":0,"2074":0,"2078":0,"2080":0,"2082":0,"2083":0,"2085":0,"2088":0,"2090":0,"2092":0,"2096":0,"2097":0,"2098":0,"2129":0,"2142":0,"2144":0,"2146":0,"2161":0,"2165":0,"2176":0,"2178":0,"2181":0,"2182":0,"2190":0,"2191":0,"2194":0,"2204":0,"2205":0,"2218":0,"2234":0,"2238":0,"2249":0,"2251":0,"2253":0,"2254":0,"2264":0,"2265":0,"2276":0,"2278":0,"2281":0,"2283":0,"2293":0,"2305":0,"2306":0,"2307":0,"2312":0,"2313":0,"2314":0,"2330":0,"2331":0,"2332":0,"2337":0,"2338":0,"2339":0,"2343":0,"2354":0,"2356":0,"2359":0,"2361":0,"2372":0,"2394":0,"2395":0,"2400":0,"2402":0,"2415":0,"2416":0,"2421":0,"2423":0,"2427":0,"2435":0,"2437":0,"2439":0,"2440":0,"2458":0,"2463":0,"2464":0,"2465":0,"2468":0,"2506":0,"2517":0,"2518":0,"2521":0,"2523":0,"2541":0,"2546":0,"2547":0,"2549":0,"2551":0,"2567":0,"2582":0,"2597":0,"2610":0,"2612":0,"2614":0,"2627":0,"2629":0,"2631":0,"2701":0,"2706":0,"2707":0,"2709":0,"2711":0,"2724":0,"2729":0,"2730":0,"2732":0,"2734":0,"2756":0,"2757":0,"2762":0,"2774":0,"2783":0,"2784":0,"2786":0,"2788":0,"2790":0,"2792":0,"2794":0,"2796":0,"2797":0,"2802":0,"2804":0,"2834":0,"2838":0,"2840":0,"2841":0,"2842":0,"2846":0,"2848":0,"2858":0,"2860":0,"2861":0,"2867":0,"2868":0,"2869":0,"2870":0,"2871":0,"2872":0,"2873":0,"2874":0,"2875":0,"2876":0,"2877":0,"2878":0,"2879":0,"2881":0,"2892":0,"2895":0,"2896":0,"2897":0,"2898":0,"2899":0,"2900":0,"2910":0,"2911":0,"2923":0,"2924":0,"2926":0,"2928":0,"2930":0,"2931":0,"2932":0,"2944":0,"2946":0,"2948":0,"2952":0,"2964":0,"2966":0,"2968":0,"2971":0,"2973":0,"2974":0,"2975":0,"2977":0,"2979":0,"2990":0,"2992":0,"2994":0,"2996":0,"2999":0,"3011":0,"3013":0,"3014":0,"3016":0,"3017":0,"3018":0,"3029":0,"3030":0,"3042":0,"3045":0,"3047":0,"3049":0,"3051":0,"3055":0,"3057":0,"3059":0,"3061":0,"3073":0,"3074":0,"3075":0,"3076":0,"3088":0,"3089":0,"3090":0,"3091":0,"3101":0,"3102":0,"3116":0,"3129":0,"3142":0,"3143":0,"3145":0,"3147":0,"3173":0,"3174":0,"3175":0,"3176":0,"3177":0,"3189":0,"3191":0,"3193":0,"3205":0,"3207":0,"3208":0,"3210":0,"3211":0,"3212":0,"3213":0,"3214":0,"3215":0,"3216":0,"3217":0,"3218":0,"3220":0,"3222":0,"3234":0,"3253":0,"3254":0,"3256":0,"3258":0,"3259":0,"3260":0,"3261":0,"3263":0,"3264":0,"3265":0,"3266":0,"3270":0,"3272":0,"3273":0,"3274":0,"3275":0,"3276":0,"3277":0,"3278":0,"3282":0,"3283":0,"3284":0,"3285":0,"3286":0,"3287":0,"3288":0,"3291":0,"3292":0,"3293":0,"3297":0,"3298":0,"3299":0,"3300":0,"3301":0,"3302":0,"3303":0,"3305":0,"3306":0,"3310":0,"3314":0,"3315":0,"3316":0,"3318":0,"3320":0,"3321":0,"3323":0,"3325":0,"3341":0,"3342":0,"3345":0,"3346":0,"3348":0,"3349":0,"3351":0,"3352":0,"3354":0,"3366":0,"3371":0,"3373":0,"3375":0,"3376":0,"3377":0,"3378":0,"3379":0,"3380":0,"3383":0,"3384":0,"3385":0,"3386":0,"3387":0,"3388":0,"3400":0,"3401":0,"3403":0,"3405":0,"3407":0,"3420":0,"3422":0,"3424":0,"3426":0,"3428":0,"3429":0,"3431":0,"3435":0,"3440":0};
_yuitest_coverage["build/graphics-vml/graphics-vml.js"].functions = {"VMLDrawing:23":0,"_round:70":0,"_addToPath:82":0,"curveTo:122":0,"relativeCurveTo:137":0,"_curveTo:149":0,"quadraticCurveTo:211":0,"drawRect:230":0,"drawRoundRect:252":0,"drawCircle:274":0,"drawEllipse:297":0,"drawDiamond:320":0,"drawWedge:344":0,"lineTo:370":0,"moveTo:396":0,"_closePath:411":0,"end:456":0,"closePath:466":0,"clear:476":0,"getBezierData:497":0,"_setCurveBoundingBox:525":0,"_trackSize:559":0,"VMLShape:603":0,"init:630":0,"initializer:641":0,"_setGraphic:666":0,"_appendStrokeAndFill:691":0,"createNode:710":0,"addClass:805":0,"removeClass:817":0,"getXY:829":0,"setXY:845":0,"contains:860":0,"compareTo:872":0,"test:885":0,"_getStrokeProps:898":0,"_strokeChangeHandler:963":0,"_getFillProps:1047":0,"_fillChangeHandler:1103":0,"_updateFillNode:1189":0,"_getGradientFill:1206":0,"_addTransform:1289":0,"_updateTransform:1307":0,"_getSkewOffsetValue:1388":0,"translate:1430":0,"translateX:1444":0,"translateY:1457":0,"skew:1470":0,"skewX:1481":0,"skewY:1492":0,"rotate:1503":0,"scale:1514":0,"on:1528":0,"_updateHandler:1553":0,"_createGraphicNode:1573":0,"_getDefaultFill:1586":0,"_getDefaultStroke:1604":0,"set:1623":0,"getBounds:1642":0,"_getContentRect:1669":0,"toFront:1712":0,"toBack:1726":0,"_parsePathData:1742":0,"destroy:1776":0,"_destroy:1795":0,"valueFn:1823":0,"setter:1859":0,"getter:1876":0,"valueFn:1909":0,"setter:1914":0,"setter:1950":0,"setter:2007":0,"setter:2072":0,"getter:2127":0,"setter:2140":0,"getter:2159":0,"VMLPath:2176":0,"end:2188":0,"getter:2202":0,"getter:2216":0,"getter:2232":0,"VMLRect:2249":0,"VMLEllipse:2276":0,"getter:2303":0,"setter:2310":0,"getter:2328":0,"setter:2335":0,"VMLCircle:2354":0,"setter:2392":0,"getter:2398":0,"setter:2413":0,"getter:2419":0,"VMLPieSlice:2435":0,"_draw:2456":0,"VMLGraphic:2517":0,"valueFn:2539":0,"setter:2544":0,"getter:2565":0,"getter:2580":0,"getter:2595":0,"setter:2608":0,"setter:2625":0,"getter:2699":0,"setter:2704":0,"getter:2722":0,"setter:2727":0,"setter:2754":0,"set:2772":0,"getXY:2832":0,"initializer:2857":0,"render:2891":0,"destroy:2908":0,"addShape:2921":0,"_appendShape:2942":0,"removeShape:2962":0,"removeAllShapes:2988":0,"_removeChildren:3009":0,"clear:3028":0,"_toggleVisible:3040":0,"setSize:3072":0,"setPosition:3086":0,"_createGraphic:3100":0,"_createGraphicNode:3114":0,"getShapeById:3127":0,"_getShapeClass:3140":0,"batch:3171":0,"_getDocFrag:3187":0,"addToRedrawQueue:3203":0,"_redraw:3232":0,"_calculateCoordOrigin:3339":0,"_getUpdatedContentBounds:3364":0,"_toFront:3398":0,"_toBack:3418":0,"(anonymous 1):1":0};
_yuitest_coverage["build/graphics-vml/graphics-vml.js"].coveredLines = 901;
_yuitest_coverage["build/graphics-vml/graphics-vml.js"].coveredFunctions = 134;
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1);
YUI.add('graphics-vml', function (Y, NAME) {

_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "(anonymous 1)", 1);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3);
var SHAPE = "vmlShape",
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

_yuitest_coverline("build/graphics-vml/graphics-vml.js", 23);
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
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 35);
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
        L: "lineTo",
        C: "curveTo",
        c: "relativeCurveTo",
        Q: "quadraticCurveTo",
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_round", 70);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 72);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_addToPath", 82);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 84);
this._path = this._path || "";
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 85);
if(this._movePath)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 87);
this._path += this._movePath;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 88);
this._movePath = null;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 90);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "curveTo", 122);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 123);
this._curveTo.apply(this, [Y.Array(arguments), false]);
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
    relativeCurveTo: function() {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "relativeCurveTo", 137);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 138);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_curveTo", 149);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 150);
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
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 167);
len = args.length - 5;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 168);
path = command; 
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 169);
for(; i < len; i = i + 6)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 171);
cp1x = parseFloat(args[i]);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 172);
cp1y = parseFloat(args[i + 1]);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 173);
cp2x = parseFloat(args[i + 2]);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 174);
cp2y = parseFloat(args[i + 3]);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 175);
x = parseFloat(args[i + 4]);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 176);
y = parseFloat(args[i + 5]);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 177);
if(i > 0)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 179);
path = path + ", ";
            }
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 181);
path = path + this._round(cp1x) + ", " + this._round(cp1y) + ", " + this._round(cp2x) + ", " + this._round(cp2y) + ", " + this._round(x) + ", " + this._round(y); 
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 182);
cp1x = cp1x + relativeX;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 183);
cp1y = cp1y + relativeY;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 184);
cp2x = cp2x + relativeX;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 185);
cp2y = cp2y + relativeY;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 186);
x = x + relativeX;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 187);
y = y + relativeY;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 188);
right = Math.max(x, Math.max(cp1x, cp2x));
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 189);
bottom = Math.max(y, Math.max(cp1y, cp2y));
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 190);
left = Math.min(x, Math.min(cp1x, cp2x));
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 191);
top = Math.min(y, Math.min(cp1y, cp2y));
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 192);
w = Math.abs(right - left);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 193);
h = Math.abs(bottom - top);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 194);
pts = [[this._currentX, this._currentY] , [cp1x, cp1y], [cp2x, cp2y], [x, y]]; 
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 195);
this._setCurveBoundingBox(pts, w, h);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 196);
this._currentX = x;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 197);
this._currentY = y;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 199);
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
    quadraticCurveTo: function(cpx, cpy, x, y) {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "quadraticCurveTo", 211);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 212);
var currentX = this._currentX,
            currentY = this._currentY,
            cp1x = currentX + 0.67*(cpx - currentX),
            cp1y = currentY + 0.67*(cpy - currentY),
            cp2x = cp1x + (x - currentX) * 0.34,
            cp2y = cp1y + (y - currentY) * 0.34;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 218);
this.curveTo(cp1x, cp1y, cp2x, cp2y, x, y);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "drawRect", 230);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 231);
this.moveTo(x, y);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 232);
this.lineTo(x + w, y);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 233);
this.lineTo(x + w, y + h);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 234);
this.lineTo(x, y + h);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 235);
this.lineTo(x, y);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 236);
this._currentX = x;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 237);
this._currentY = y;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 238);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "drawRoundRect", 252);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 253);
this.moveTo(x, y + eh);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 254);
this.lineTo(x, y + h - eh);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 255);
this.quadraticCurveTo(x, y + h, x + ew, y + h);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 256);
this.lineTo(x + w - ew, y + h);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 257);
this.quadraticCurveTo(x + w, y + h, x + w, y + h - eh);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 258);
this.lineTo(x + w, y + eh);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 259);
this.quadraticCurveTo(x + w, y, x + w - ew, y);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 260);
this.lineTo(x + ew, y);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 261);
this.quadraticCurveTo(x, y, x, y + eh);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 262);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "drawCircle", 274);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 275);
var startAngle = 0,
            endAngle = 360,
            circum = radius * 2;

        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 279);
endAngle *= 65535;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 280);
this._drawingComplete = false;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 281);
this._trackSize(x + circum, y + circum);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 282);
this.moveTo((x + circum), (y + radius));
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 283);
this._addToPath(" ae " + this._round(x + radius) + ", " + this._round(y + radius) + ", " + this._round(radius) + ", " + this._round(radius) + ", " + startAngle + ", " + endAngle);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 284);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "drawEllipse", 297);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 298);
var startAngle = 0,
            endAngle = 360,
            radius = w * 0.5,
            yRadius = h * 0.5;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 302);
endAngle *= 65535;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 303);
this._drawingComplete = false;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 304);
this._trackSize(x + w, y + h);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 305);
this.moveTo((x + w), (y + yRadius));
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 306);
this._addToPath(" ae " + this._round(x + radius) + ", " + this._round(x + radius) + ", " + this._round(y + yRadius) + ", " + this._round(radius) + ", " + this._round(yRadius) + ", " + startAngle + ", " + endAngle);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 307);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "drawDiamond", 320);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 322);
var midWidth = width * 0.5,
            midHeight = height * 0.5;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 324);
this.moveTo(x + midWidth, y);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 325);
this.lineTo(x + width, y + midHeight);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 326);
this.lineTo(x + midWidth, y + height);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 327);
this.lineTo(x, y + midHeight);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 328);
this.lineTo(x + midWidth, y);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 329);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "drawWedge", 344);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 346);
var diameter = radius * 2;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 347);
if(Math.abs(arc) > 360)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 349);
arc = 360;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 351);
this._currentX = x;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 352);
this._currentY = y;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 353);
startAngle *= -65535;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 354);
arc *= 65536;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 355);
startAngle = Math.round(startAngle);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 356);
arc = Math.round(arc);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 357);
this.moveTo(x, y);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 358);
this._addToPath(" ae " + this._round(x) + ", " + this._round(y) + ", " + this._round(radius) + " " + this._round(radius) + ", " +  startAngle + ", " + arc);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 359);
this._trackSize(diameter, diameter); 
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 360);
return this;
    },

    /**
     * Draws a line segment using the current line style from the current drawing position to the specified x and y coordinates.
     * 
     * @method lineTo
     * @param {Number} point1 x-coordinate for the end point.
     * @param {Number} point2 y-coordinate for the end point.
     */
    lineTo: function(point1, point2, etc) {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "lineTo", 370);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 371);
var args = arguments,
            i,
            len,
            path = ' l ';
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 375);
if (typeof point1 === 'string' || typeof point1 === 'number') {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 376);
args = [[point1, point2]];
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 378);
len = args.length;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 379);
for (i = 0; i < len; ++i) {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 380);
path += ' ' + this._round(args[i][0]) + ', ' + this._round(args[i][1]);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 381);
this._trackSize.apply(this, args[i]);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 382);
this._currentX = args[i][0];
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 383);
this._currentY = args[i][1];
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 385);
this._addToPath(path);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 386);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "moveTo", 396);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 397);
x = parseFloat(x);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 398);
y = parseFloat(y);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 399);
this._movePath = " m " + this._round(x) + ", " + this._round(y);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 400);
this._trackSize(x, y);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 401);
this._currentX = x;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 402);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_closePath", 411);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 413);
var fill = this.get("fill"),
            stroke = this.get("stroke"),
            node = this.node,
            w = this.get("width"),
            h = this.get("height"),
            path = this._path,
            pathEnd = "",
            multiplier = this._coordSpaceMultiplier;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 421);
this._fillChangeHandler();
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 422);
this._strokeChangeHandler();
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 423);
if(path)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 425);
if(fill && fill.color)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 427);
pathEnd += ' x';
            }
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 429);
if(stroke)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 431);
pathEnd += ' e';
            }
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 434);
if(path)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 436);
node.path = path + pathEnd;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 438);
if(!isNaN(w) && !isNaN(h))
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 440);
node.coordOrigin = this._left + ", " + this._top;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 441);
node.coordSize = (w * multiplier) + ", " + (h * multiplier);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 442);
node.style.position = "absolute";
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 443);
node.style.width =  w + "px";
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 444);
node.style.height =  h + "px";
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 446);
this._path = path;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 447);
this._movePath = null;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 448);
this._updateTransform();
    },

    /**
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function()
    {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "end", 456);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 458);
this._closePath();
    },

    /**
     * Ends a fill and stroke
     *
     * @method closePath
     */
    closePath: function()
    {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "closePath", 466);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 468);
this._addToPath(" x e");
    },

    /**
     * Clears the path.
     *
     * @method clear
     */
    clear: function()
    {
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "clear", 476);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 478);
this._right = 0;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 479);
this._bottom = 0;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 480);
this._width = 0;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 481);
this._height = 0;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 482);
this._left = 0;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 483);
this._top = 0;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 484);
this._path = "";
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 485);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getBezierData", 497);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 498);
var n = points.length,
            tmp = [],
            i,
            j;

        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 503);
for (i = 0; i < n; ++i){
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 504);
tmp[i] = [points[i][0], points[i][1]]; // save input
        }
        
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 507);
for (j = 1; j < n; ++j) {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 508);
for (i = 0; i < n - j; ++i) {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 509);
tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 510);
tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1]; 
            }
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 513);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_setCurveBoundingBox", 525);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 527);
var i = 0,
            left = this._currentX,
            right = left,
            top = this._currentY,
            bottom = top,
            len = Math.round(Math.sqrt((w * w) + (h * h))),
            t = 1/len,
            xy;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 535);
for(; i < len; ++i)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 537);
xy = this.getBezierData(pts, t * i);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 538);
left = isNaN(left) ? xy[0] : Math.min(xy[0], left);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 539);
right = isNaN(right) ? xy[0] : Math.max(xy[0], right);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 540);
top = isNaN(top) ? xy[1] : Math.min(xy[1], top);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 541);
bottom = isNaN(bottom) ? xy[1] : Math.max(xy[1], bottom);
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 543);
left = Math.round(left * 10)/10;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 544);
right = Math.round(right * 10)/10;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 545);
top = Math.round(top * 10)/10;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 546);
bottom = Math.round(bottom * 10)/10;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 547);
this._trackSize(right, bottom);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 548);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_trackSize", 559);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 560);
if (w > this._right) {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 561);
this._right = w;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 563);
if(w < this._left)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 565);
this._left = w;    
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 567);
if (h < this._top)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 569);
this._top = h;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 571);
if (h > this._bottom) 
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 573);
this._bottom = h;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 575);
this._width = this._right - this._left;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 576);
this._height = this._bottom - this._top;
    },

    _left: 0,

    _right: 0,

    _top: 0,

    _bottom: 0,

    _width: 0,

    _height: 0
};
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 591);
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
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 603);
VMLShape = function() 
{
    _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "VMLShape", 603);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 605);
this._transforms = [];
    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 606);
this.matrix = new Y.Matrix();
    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 607);
this._normalizedMatrix = new Y.Matrix();
    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 608);
VMLShape.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("build/graphics-vml/graphics-vml.js", 611);
VMLShape.NAME = "vmlShape";

_yuitest_coverline("build/graphics-vml/graphics-vml.js", 613);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "init", 630);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 632);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "initializer", 641);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 643);
var host = this,
            graphic = cfg.graphic,
            data = this.get("data");
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 646);
host.createNode();
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 647);
if(graphic)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 649);
this._setGraphic(graphic);
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 651);
if(data)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 653);
host._parsePathData(data);
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 655);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_setGraphic", 666);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 668);
var graphic;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 669);
if(render instanceof Y.VMLGraphic)
        {
		    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 671);
this._graphic = render;
        }
        else
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 675);
render = Y.one(render);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 676);
graphic = new Y.VMLGraphic({
                render: render
            });
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 679);
graphic._appendShape(this);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 680);
this._graphic = graphic;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 681);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_appendStrokeAndFill", 691);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 693);
if(this._strokeNode)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 695);
this.node.appendChild(this._strokeNode);
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 697);
if(this._fillNode)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 699);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "createNode", 710);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 712);
var node,
			x = this.get("x"),
			y = this.get("y"),
            w = this.get("width"),
            h = this.get("height"),
			id,
			type,
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
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 731);
id = this.get("id");
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 732);
type = this._type == "path" ? "shape" : this._type;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 733);
classString = 'vml' + type + ' ' + _getClassName(SHAPE) + " " + _getClassName(this.constructor.NAME); 
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 734);
stroke = this._getStrokeProps();
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 735);
fill = this._getFillProps();
			
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 737);
nodestring  = '<' + type + '  xmlns="urn:schemas-microsft.com:vml" id="' + id + '" class="' + classString + '" style="behavior:url(#default#VML);display:inline-block;position:absolute;left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;height:' + h + 'px;visibility:' + visibility + '"';

		    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 739);
if(stroke && stroke.weight && stroke.weight > 0)
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 741);
endcap = stroke.endcap;
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 742);
opacity = parseFloat(stroke.opacity);
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 743);
joinstyle = stroke.joinstyle;
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 744);
miterlimit = stroke.miterlimit;
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 745);
dashstyle = stroke.dashstyle;
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 746);
nodestring += ' stroked="t" strokecolor="' + stroke.color + '" strokeWeight="' + stroke.weight + 'px"';
				
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 748);
strokestring = '<stroke class="vmlstroke" xmlns="urn:schemas-microsft.com:vml" on="t" style="behavior:url(#default#VML);display:inline-block;"';
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 749);
strokestring += ' opacity="' + opacity + '"';
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 750);
if(endcap)
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 752);
strokestring += ' endcap="' + endcap + '"';
				}
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 754);
if(joinstyle)
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 756);
strokestring += ' joinstyle="' + joinstyle + '"';
				}
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 758);
if(miterlimit)
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 760);
strokestring += ' miterlimit="' + miterlimit + '"';
				}
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 762);
if(dashstyle)
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 764);
strokestring += ' dashstyle="' + dashstyle + '"';
				}
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 766);
strokestring += '></stroke>';
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 767);
this._strokeNode = DOCUMENT.createElement(strokestring);
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 768);
nodestring += ' stroked="t"';
			}
			else
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 772);
nodestring += ' stroked="f"';
			}
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 774);
if(fill)
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 776);
if(fill.node)
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 778);
fillstring = fill.node;
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 779);
this._fillNode = DOCUMENT.createElement(fillstring);
				}
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 781);
if(fill.color)
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 783);
nodestring += ' fillcolor="' + fill.color + '"';
				}
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 785);
nodestring += ' filled="' + fill.filled + '"';
			}
			
			
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 789);
nodestring += '>';
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 790);
nodestring += '</' + type + '>';
			
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 792);
node = DOCUMENT.createElement(nodestring);

            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 794);
this.node = node;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 795);
this._strokeFlag = false;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 796);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "addClass", 805);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 807);
var node = this.node;
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 808);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "removeClass", 817);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 819);
var node = this.node;
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 820);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getXY", 829);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 831);
var graphic = this._graphic,
			parentXY = graphic.getXY(),
			x = this.get("x"),
			y = this.get("y");
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 835);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setXY", 845);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 847);
var graphic = this._graphic,
			parentXY = graphic.getXY();
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 849);
this.set("x", xy[0] - parentXY[0]);
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 850);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "contains", 860);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 862);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "compareTo", 872);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 873);
var node = this.node;

		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 875);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "test", 885);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 887);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_getStrokeProps", 898);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 900);
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
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 910);
if(stroke && stroke.weight && stroke.weight > 0)
		{
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 912);
props = {};
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 913);
linecap = stroke.linecap || "flat";
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 914);
linejoin = stroke.linejoin || "round";
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 915);
if(linecap != "round" && linecap != "square")
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 917);
linecap = "flat";
			}
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 919);
strokeOpacity = parseFloat(stroke.opacity);
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 920);
dashstyle = stroke.dashstyle || "none";
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 921);
stroke.color = stroke.color || "#000000";
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 922);
stroke.weight = stroke.weight || 1;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 923);
stroke.opacity = IS_NUM(strokeOpacity) ? strokeOpacity : 1;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 924);
props.stroked = true;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 925);
props.color = stroke.color;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 926);
props.weight = stroke.weight;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 927);
props.endcap = linecap;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 928);
props.opacity = stroke.opacity;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 929);
if(IS_ARRAY(dashstyle))
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 931);
dash = [];
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 932);
len = dashstyle.length;
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 933);
for(i = 0; i < len; ++i)
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 935);
val = dashstyle[i];
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 936);
dash[i] = val / stroke.weight;
				}
			}
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 939);
if(linejoin == "round" || linejoin == "bevel")
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 941);
props.joinstyle = linejoin;
			}
			else
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 945);
linejoin = parseInt(linejoin, 10);
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 946);
if(IS_NUM(linejoin))
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 948);
props.miterlimit = Math.max(linejoin, 1);
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 949);
props.joinstyle = "miter";
				}
			}
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 952);
props.dashstyle = dash;
		}
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 954);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_strokeChangeHandler", 963);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 965);
if(!this._strokeFlag)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 967);
return;
        }
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 969);
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
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 979);
if(stroke && stroke.weight && stroke.weight > 0)
		{
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 981);
linecap = stroke.linecap || "flat";
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 982);
linejoin = stroke.linejoin || "round";
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 983);
if(linecap != "round" && linecap != "square")
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 985);
linecap = "flat";
			}
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 987);
strokeOpacity = parseFloat(stroke.opacity);
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 988);
dashstyle = stroke.dashstyle || "none";
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 989);
stroke.color = stroke.color || "#000000";
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 990);
stroke.weight = stroke.weight || 1;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 991);
stroke.opacity = IS_NUM(strokeOpacity) ? strokeOpacity : 1;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 992);
node.stroked = true;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 993);
node.strokeColor = stroke.color;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 994);
node.strokeWeight = stroke.weight + "px";
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 995);
if(!this._strokeNode)
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 997);
this._strokeNode = this._createGraphicNode("stroke");
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 998);
node.appendChild(this._strokeNode);
			}
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1000);
this._strokeNode.endcap = linecap;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1001);
this._strokeNode.opacity = stroke.opacity;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1002);
if(IS_ARRAY(dashstyle))
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1004);
dash = [];
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1005);
len = dashstyle.length;
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1006);
for(i = 0; i < len; ++i)
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1008);
val = dashstyle[i];
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1009);
dash[i] = val / stroke.weight;
				}
			}
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1012);
if(linejoin == "round" || linejoin == "bevel")
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1014);
this._strokeNode.joinstyle = linejoin;
			}
			else
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1018);
linejoin = parseInt(linejoin, 10);
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1019);
if(IS_NUM(linejoin))
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1021);
this._strokeNode.miterlimit = Math.max(linejoin, 1);
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1022);
this._strokeNode.joinstyle = "miter";
				}
			}
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1025);
this._strokeNode.dashstyle = dash;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1026);
this._strokeNode.on = true;
		}
		else
		{
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1030);
if(this._strokeNode)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1032);
this._strokeNode.on = false;
            }
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1034);
node.stroked = false;
		}
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1036);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_getFillProps", 1047);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1049);
var fill = this.get("fill"),
			fillOpacity,
			props,
			gradient,
			i,
			fillstring,
			filled = false;
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1056);
if(fill)
		{
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1058);
props = {};
			
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1060);
if(fill.type == "radial" || fill.type == "linear")
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1062);
fillOpacity = parseFloat(fill.opacity);
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1063);
fillOpacity = IS_NUM(fillOpacity) ? fillOpacity : 1;
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1064);
filled = true;
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1065);
gradient = this._getGradientFill(fill);
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1066);
fillstring = '<fill xmlns="urn:schemas-microsft.com:vml" class="vmlfill" style="behavior:url(#default#VML);display:inline-block;" opacity="' + fillOpacity + '"';
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1067);
for(i in gradient)
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1069);
if(gradient.hasOwnProperty(i))
					{
						_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1071);
fillstring += ' ' + i + '="' + gradient[i] + '"';
					}
				}
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1074);
fillstring += ' />';
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1075);
props.node = fillstring;
			}
			else {_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1077);
if(fill.color)
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1079);
fillOpacity = parseFloat(fill.opacity);
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1080);
filled = true;
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1081);
props.color = fill.color;
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1082);
if(IS_NUM(fillOpacity))
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1084);
fillOpacity = Math.max(Math.min(fillOpacity, 1), 0);
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1085);
props.opacity = fillOpacity;    
				    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1086);
if(fillOpacity < 1)
                    {
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1088);
props.node = '<fill xmlns="urn:schemas-microsft.com:vml" class="vmlfill" style="behavior:url(#default#VML);display:inline-block;" type="solid" opacity="' + fillOpacity + '"/>';
				    }
                }
			}}
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1092);
props.filled = filled;
		}
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1094);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_fillChangeHandler", 1103);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1105);
if(!this._fillFlag)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1107);
return;
        }
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1109);
var node = this.node,
			fill = this.get("fill"),
			fillOpacity,
			fillstring,
			filled = false,
            i,
            gradient;
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1116);
if(fill)
		{
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1118);
if(fill.type == "radial" || fill.type == "linear")
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1120);
filled = true;
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1121);
gradient = this._getGradientFill(fill);
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1122);
if(this._fillNode)
                {
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1124);
for(i in gradient)
                    {
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1126);
if(gradient.hasOwnProperty(i))
                        {
                            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1128);
if(i == "colors")
                            {
                                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1130);
this._fillNode.colors.value = gradient[i];
                            }
                            else
                            {
                                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1134);
this._fillNode[i] = gradient[i];
                            }
                        }
                    }
                }
                else
                {
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1141);
fillstring = '<fill xmlns="urn:schemas-microsft.com:vml" class="vmlfill" style="behavior:url(#default#VML);display:inline-block;"';
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1142);
for(i in gradient)
                    {
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1144);
if(gradient.hasOwnProperty(i))
                        {
                            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1146);
fillstring += ' ' + i + '="' + gradient[i] + '"';
                        }
                    }
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1149);
fillstring += ' />';
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1150);
this._fillNode = DOCUMENT.createElement(fillstring);
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1151);
node.appendChild(this._fillNode);
                }
			}
			else {_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1154);
if(fill.color)
			{
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1156);
node.fillcolor = fill.color;
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1157);
fillOpacity = parseFloat(fill.opacity);
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1158);
filled = true;
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1159);
if(IS_NUM(fillOpacity) && fillOpacity < 1)
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1161);
fill.opacity = fillOpacity;
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1162);
if(this._fillNode)
					{
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1164);
if(this._fillNode.getAttribute("type") != "solid")
                        {
                            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1166);
this._fillNode.type = "solid";
                        }
						_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1168);
this._fillNode.opacity = fillOpacity;
					}
					else
					{     
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1172);
fillstring = '<fill xmlns="urn:schemas-microsft.com:vml" class="vmlfill" style="behavior:url(#default#VML);display:inline-block;" type="solid" opacity="' + fillOpacity + '"/>';
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1173);
this._fillNode = DOCUMENT.createElement(fillstring);
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1174);
node.appendChild(this._fillNode);
					}
				}
				else {_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1177);
if(this._fillNode)
                {   
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1179);
this._fillNode.opacity = 1;
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1180);
this._fillNode.type = "solid";
				}}
			}}
		}
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1184);
node.filled = filled;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1185);
this._fillFlag = false;
	},

	//not used. remove next release.
    _updateFillNode: function(node)
	{
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_updateFillNode", 1189);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1191);
if(!this._fillNode)
		{
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1193);
this._fillNode = this._createGraphicNode("fill");
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1194);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_getGradientFill", 1206);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1208);
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
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1230);
if(type === "linear")
		{
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1232);
if(rotation <= 270)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1234);
rotation = Math.abs(rotation - 270);
            }
			else {_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1236);
if(rotation < 360)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1238);
rotation = 270 + (360 - rotation);
            }
            else
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1242);
rotation = 270;
            }}
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1244);
gradientProps.type = "gradient";//"gradientunscaled";
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1245);
gradientProps.angle = rotation;
		}
		else {_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1247);
if(type === "radial")
		{
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1249);
gradientBoxWidth = w * (r * 2);
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1250);
gradientBoxHeight = h * (r * 2);
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1251);
fx = r * 2 * (fx - 0.5);
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1252);
fy = r * 2 * (fy - 0.5);
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1253);
fx += cx;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1254);
fy += cy;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1255);
gradientProps.focussize = (gradientBoxWidth/w)/10 + "% " + (gradientBoxHeight/h)/10 + "%";
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1256);
gradientProps.alignshape = false;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1257);
gradientProps.type = "gradientradial";
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1258);
gradientProps.focus = "100%";
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1259);
gradientProps.focusposition = Math.round(fx * 100) + "% " + Math.round(fy * 100) + "%";
		}}
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1261);
for(;i < len; ++i) {
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1262);
stop = stops[i];
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1263);
color = stop.color;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1264);
opacity = stop.opacity;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1265);
opacity = isNumber(opacity) ? opacity : 1;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1266);
pct = stop.offset || i/(len-1);
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1267);
pct *= (r * 2);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1268);
pct = Math.round(100 * pct) + "%";
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1269);
oi = i > 0 ? i + 1 : "";
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1270);
gradientProps["opacity" + oi] = opacity + "";
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1271);
colorstring += ", " + pct + " " + color;
		}
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1273);
if(parseFloat(pct) < 100)
		{
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1275);
colorstring += ", 100% " + color;
		}
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1277);
gradientProps.colors = colorstring.substr(2);
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1278);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_addTransform", 1289);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1291);
args = Y.Array(args);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1292);
this._transform = Y_LANG.trim(this._transform + " " + type + "(" + args.join(", ") + ")");
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1293);
args.unshift(type);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1294);
this._transforms.push(args);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1295);
if(this.initialized)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1297);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_updateTransform", 1307);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1309);
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
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1322);
if(this._transforms && this._transforms.length > 0)
		{
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1324);
transformOrigin = this.get("transformOrigin");
       
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1326);
if(isPathShape)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1328);
normalizedMatrix.translate(this._left, this._top);
            }
            //vml skew matrix transformOrigin ranges from -0.5 to 0.5.
            //subtract 0.5 from values
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1332);
tx = transformOrigin[0] - 0.5;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1333);
ty = transformOrigin[1] - 0.5;
            
            //ensure the values are within the appropriate range to avoid errors
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1336);
tx = Math.max(-0.5, Math.min(0.5, tx));
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1337);
ty = Math.max(-0.5, Math.min(0.5, ty));
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1338);
for(; i < len; ++i)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1340);
key = this._transforms[i].shift();
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1341);
if(key)
                {
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1343);
normalizedMatrix[key].apply(normalizedMatrix, this._transforms[i]); 
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1344);
matrix[key].apply(matrix, this._transforms[i]); 
                }
			}
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1347);
if(isPathShape)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1349);
normalizedMatrix.translate(-this._left, -this._top);
            }
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1351);
transform = normalizedMatrix.a + "," + 
                        normalizedMatrix.c + "," + 
                        normalizedMatrix.b + "," + 
                        normalizedMatrix.d + "," + 
                        0 + "," +
                        0;
		}
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1358);
this._graphic.addToRedrawQueue(this);    
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1359);
if(transform)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1361);
if(!this._skew)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1363);
this._skew = DOCUMENT.createElement( '<skew class="vmlskew" xmlns="urn:schemas-microsft.com:vml" on="false" style="behavior:url(#default#VML);display:inline-block;" />');
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1364);
this.node.appendChild(this._skew); 
            }
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1366);
this._skew.matrix = transform;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1367);
this._skew.on = true;
            //this._skew.offset = this._getSkewOffsetValue(normalizedMatrix.dx) + "px, " + this._getSkewOffsetValue(normalizedMatrix.dy) + "px";
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1369);
this._skew.origin = tx + ", " + ty;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1371);
if(this._type != "path")
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1373);
this._transforms = [];
        }
        //add the translate to the x and y coordinates
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1376);
node.style.left = (x + this._getSkewOffsetValue(normalizedMatrix.dx)) + "px";
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1377);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_getSkewOffsetValue", 1388);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1390);
var sign = Y.MatrixUtil.sign(val),
            absVal = Math.abs(val);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1392);
val = Math.min(absVal, 32767) * sign;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1393);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "translate", 1430);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1432);
this._translateX += x;
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1433);
this._translateY += y;
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1434);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "translateX", 1444);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1446);
this._translateX += x;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1447);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "translateY", 1457);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1459);
this._translateY += y;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1460);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "skew", 1470);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1472);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "skewX", 1481);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1483);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "skewY", 1492);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1494);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "rotate", 1503);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1505);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "scale", 1514);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1516);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "on", 1528);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1530);
if(Y.Node.DOM_EVENTS[type])
		{
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1532);
return Y.one("#" +  this.get("id")).on(type, fn);
		}
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1534);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_updateHandler", 1553);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1555);
var host = this,
            node = host.node;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1557);
host._fillChangeHandler();
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1558);
host._strokeChangeHandler();
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1559);
node.style.width = this.get("width") + "px";
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1560);
node.style.height = this.get("height") + "px"; 
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1561);
this._draw();
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1562);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_createGraphicNode", 1573);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1575);
type = type || this._type;
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1576);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_getDefaultFill", 1586);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1587);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_getDefaultStroke", 1604);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1606);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "set", 1623);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1625);
var host = this;
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1626);
AttributeLite.prototype.set.apply(host, arguments);
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1627);
if(host.initialized)
		{
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1629);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getBounds", 1642);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1644);
var isPathShape = this instanceof Y.VMLPath,
			w = this.get("width"),
			h = this.get("height"),
            x = this.get("x"),
            y = this.get("y");
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1649);
if(isPathShape)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1651);
x = x + this._left;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1652);
y = y + this._top;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1653);
w = this._right - this._left;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1654);
h = this._bottom - this._top;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1656);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_getContentRect", 1669);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1671);
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
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1682);
if(isPathShape)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1684);
matrix.translate(this._left, this._top);
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1686);
transformX = !isNaN(transformX) ? transformX : 0;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1687);
transformY = !isNaN(transformY) ? transformY : 0;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1688);
matrix.translate(transformX, transformY);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1689);
for(; i < len; i = i + 1)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1691);
transform = transforms[i];
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1692);
key = transform.shift();
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1693);
if(key)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1695);
matrix[key].apply(matrix, transform); 
            }
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1698);
matrix.translate(-transformX, -transformY);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1699);
if(isPathShape)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1701);
matrix.translate(-this._left, -this._top);
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1703);
contentRect = matrix.getContentRect(w, h, x, y);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1704);
return contentRect;
    },

    /**
     * Places the shape above all other shapes.
     *
     * @method toFront
     */
    toFront: function()
    {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "toFront", 1712);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1714);
var graphic = this.get("graphic");
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1715);
if(graphic)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1717);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "toBack", 1726);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1728);
var graphic = this.get("graphic");
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1729);
if(graphic)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1731);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_parsePathData", 1742);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1744);
var method,
            methodSymbol,
            args,
            commandArray = Y.Lang.trim(val.match(SPLITPATHPATTERN)),
            i = 0,
            len, 
            str,
            symbolToMethod = this._pathSymbolToMethod;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1752);
if(commandArray)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1754);
this.clear();
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1755);
len = commandArray.length || 0;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1756);
for(; i < len; i = i + 1)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1758);
str = commandArray[i];
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1759);
methodSymbol = str.substr(0, 1),
                args = str.substr(1).match(SPLITARGSPATTERN);
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1761);
method = symbolToMethod[methodSymbol];
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1762);
if(method)
                {
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1764);
this[method].apply(this, args);
                }
            }
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1767);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "destroy", 1776);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1778);
var graphic = this.get("graphic");
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1779);
if(graphic)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1781);
graphic.removeShape(this);
        }
        else
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1785);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_destroy", 1795);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1797);
if(this.node)
        {   
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1799);
if(this._fillNode)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1801);
this.node.removeChild(this._fillNode);
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1802);
this._fillNode = null;
            }
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1804);
if(this._strokeNode)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1806);
this.node.removeChild(this._strokeNode);
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1807);
this._strokeNode = null;
            }
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1809);
Y.one(this.node).remove(true);
        }
    }
}, Y.VMLDrawing.prototype));

_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1814);
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
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "valueFn", 1823);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1825);
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
            _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 1859);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1861);
var i = 0,
                len,
                transform;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1864);
this.matrix.init();	
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1865);
this._normalizedMatrix.init();	
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1866);
this._transforms = this.matrix.getTransformArray(val);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1867);
len = this._transforms.length;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1868);
for(;i < len; ++i)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1870);
transform = this._transforms[i];
            }
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1872);
this._transform = val;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 1873);
return val;
		},

        getter: function()
        {
            _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getter", 1876);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1878);
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
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "valueFn", 1909);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1911);
return Y.guid();
		},

		setter: function(val)
		{
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 1914);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1916);
var node = this.node;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1917);
if(node)
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1919);
node.setAttribute("id", val);
			}
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1921);
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
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 1950);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1951);
var node = this.node,
				visibility = val ? "visible" : "hidden";
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1953);
if(node)
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1955);
node.style.visibility = visibility;
			}
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 1957);
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
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 2007);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2009);
var i,
				fill,
				tmpl = this.get("fill") || this._getDefaultFill();
			
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2013);
if(val)
			{
				//ensure, fill type is solid if color is explicitly passed.
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2016);
if(val.hasOwnProperty("color"))
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2018);
val.type = "solid";
				}
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2020);
for(i in val)
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2022);
if(val.hasOwnProperty(i))
					{   
						_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2024);
tmpl[i] = val[i];
					}
				}
			}
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2028);
fill = tmpl;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2029);
if(fill && fill.color)
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2031);
if(fill.color === undefined || fill.color == "none")
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2033);
fill.color = null;
				}
			}
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2036);
this._fillFlag = true;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2037);
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
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 2072);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2074);
var i,
				stroke,
                wt,
				tmpl = this.get("stroke") || this._getDefaultStroke();
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2078);
if(val)
			{
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2080);
if(val.hasOwnProperty("weight"))
                {
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2082);
wt = parseInt(val.weight, 10);
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2083);
if(!isNaN(wt))
                    {
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2085);
val.weight = wt;
                    }
                }
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2088);
for(i in val)
				{
					_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2090);
if(val.hasOwnProperty(i))
					{   
						_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2092);
tmpl[i] = val[i];
					}
				}
			}
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2096);
stroke = tmpl;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2097);
this._strokeFlag = true;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2098);
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
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getter", 2127);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2129);
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
            _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 2140);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2142);
if(this.get("node"))
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2144);
this._parsePathData(val);
            }
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2146);
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
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getter", 2159);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2161);
return this._graphic;
		}
	}
};
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2165);
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
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2176);
VMLPath = function()
{
	_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "VMLPath", 2176);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2178);
VMLPath.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2181);
VMLPath.NAME = "vmlPath";
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2182);
Y.extend(VMLPath, Y.VMLShape, {
    /*
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function()
    {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "end", 2188);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2190);
this._closePath();
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2191);
this._updateTransform();
    }
});
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2194);
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
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getter", 2202);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2204);
var val = Math.max(this._right - this._left, 0);
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2205);
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
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getter", 2216);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2218);
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
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getter", 2232);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2234);
return this._path;
		}
	}
});
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2238);
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
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2249);
VMLRect = function()
{
	_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "VMLRect", 2249);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2251);
VMLRect.superclass.constructor.apply(this, arguments);
};
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2253);
VMLRect.NAME = "vmlRect"; 
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2254);
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
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2264);
VMLRect.ATTRS = Y.VMLShape.ATTRS;
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2265);
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
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2276);
VMLEllipse = function()
{
	_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "VMLEllipse", 2276);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2278);
VMLEllipse.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2281);
VMLEllipse.NAME = "vmlEllipse";

_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2283);
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
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2293);
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
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getter", 2303);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2305);
var val = this.get("width");
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2306);
val = Math.round((val/2) * 100)/100;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2307);
return val;
		},
		
		setter: function(val)
		{
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 2310);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2312);
var w = val * 2; 
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2313);
this.set("width", w);
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2314);
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
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getter", 2328);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2330);
var val = this.get("height");
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2331);
val = Math.round((val/2) * 100)/100;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2332);
return val;
		},

		setter: function(val)
		{
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 2335);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2337);
var h = val * 2;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2338);
this.set("height", h);
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2339);
return val;
		}
	}
});
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2343);
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
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2354);
VMLCircle = function(cfg)
{
	_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "VMLCircle", 2354);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2356);
VMLCircle.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2359);
VMLCircle.NAME = "vmlCircle";

_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2361);
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

_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2372);
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
            _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 2392);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2394);
this.set("radius", val/2);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2395);
return val;
        },

		getter: function()
		{   
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getter", 2398);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2400);
var radius = this.get("radius"),
			val = radius && radius > 0 ? radius * 2 : 0;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2402);
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
            _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 2413);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2415);
this.set("radius", val/2);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2416);
return val;
        },

		getter: function()
		{   
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getter", 2419);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2421);
var radius = this.get("radius"),
			val = radius && radius > 0 ? radius * 2 : 0;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2423);
return val;
		}
	}
});
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2427);
Y.VMLCircle = VMLCircle;
/**
 * Draws pie slices
 *
 * @module graphics
 * @class VMLPieSlice
 * @constructor
 */
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2435);
VMLPieSlice = function()
{
	_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "VMLPieSlice", 2435);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2437);
VMLPieSlice.superclass.constructor.apply(this, arguments);
};
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2439);
VMLPieSlice.NAME = "vmlPieSlice";
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2440);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_draw", 2456);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2458);
var x = this.get("cx"),
            y = this.get("cy"),
            startAngle = this.get("startAngle"),
            arc = this.get("arc"),
            radius = this.get("radius");
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2463);
this.clear();
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2464);
this.drawWedge(x, y, startAngle, arc, radius);
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2465);
this.end();
	}
 }, Y.VMLDrawing.prototype));
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2468);
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
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2506);
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
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2517);
VMLGraphic = function() {
    _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "VMLGraphic", 2517);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2518);
VMLGraphic.superclass.constructor.apply(this, arguments);    
};

_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2521);
VMLGraphic.NAME = "vmlGraphic";

_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2523);
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
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "valueFn", 2539);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2541);
return Y.guid();
		},

		setter: function(val)
		{
			_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 2544);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2546);
var node = this._node;
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2547);
if(node)
			{
				_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2549);
node.setAttribute("id", val);
			}
			_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2551);
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
            _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getter", 2565);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2567);
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
            _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getter", 2580);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2582);
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
            _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getter", 2595);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2597);
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
            _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 2608);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2610);
if(this._node)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2612);
this._node.style.width = val + "px";
            }
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2614);
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
            _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 2625);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2627);
if(this._node)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2629);
this._node.style.height = val + "px";
            }
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2631);
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
            _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getter", 2699);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2701);
return this._x;
        },

        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 2704);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2706);
this._x = val;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2707);
if(this._node)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2709);
this._node.style.left = val + "px";
            }
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2711);
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
            _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getter", 2722);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2724);
return this._y;
        },

        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 2727);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2729);
this._y = val;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2730);
if(this._node)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2732);
this._node.style.top = val + "px";
            }
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2734);
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
            _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setter", 2754);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2756);
this._toggleVisible(val);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2757);
return val;
        }
    }
};

_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2762);
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
		_yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "set", 2772);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2774);
var host = this,
            redrawAttrs = {
                autoDraw: true,
                autoSize: true,
                preserveAspectRatio: true,
                resizeDown: true
            },
            key,
            forceRedraw = false;
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2783);
AttributeLite.prototype.set.apply(host, arguments);	
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2784);
if(host._state.autoDraw === true && Y.Object.size(this._shapes) > 0)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2786);
if(Y_LANG.isString && redrawAttrs[attr])
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2788);
forceRedraw = true;
            }
            else {_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2790);
if(Y_LANG.isObject(attr))
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2792);
for(key in redrawAttrs)
                {
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2794);
if(redrawAttrs.hasOwnProperty(key) && attr[key])
                    {
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2796);
forceRedraw = true;
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2797);
break;
                    }
                }
            }}
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2802);
if(forceRedraw)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2804);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getXY", 2832);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2834);
var node = this.parentNode,
            x = this.get("x"),
            y = this.get("y"),
            xy;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2838);
if(node)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2840);
xy = Y.one(node).getXY();
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2841);
xy[0] += x;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2842);
xy[1] += y;
        }
        else
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2846);
xy = Y.DOM._getOffset(this._node);
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2848);
return xy;
    },

    /**
     * Initializes the class.
     *
     * @method initializer
     * @private
     */
    initializer: function(config) {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "initializer", 2857);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2858);
var render = this.get("render"),
            visibility = this.get("visible") ? "visible" : "hidden";
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2860);
this._shapes = {};
		_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2861);
this._contentBounds = {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        };
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2867);
this._node = DOCUMENT.createElement('div');
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2868);
this._node.style.position = "absolute";
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2869);
this._node.style.left = this.get("x") + "px";
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2870);
this._node.style.top = this.get("y") + "px";
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2871);
this._node.style.visibility = visibility;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2872);
this._node.setAttribute("id", this.get("id"));
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2873);
this._contentNode = this._createGraphic();
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2874);
this._contentNode.style.position = "absolute";
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2875);
this._contentNode.style.left = "0px";
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2876);
this._contentNode.style.top = "0px";
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2877);
this._contentNode.style.visibility = visibility;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2878);
this._node.appendChild(this._contentNode);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2879);
if(render)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2881);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "render", 2891);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2892);
var parentNode = Y.one(render),
            w = this.get("width") || parseInt(parentNode.getComputedStyle("width"), 10),
            h = this.get("height") || parseInt(parentNode.getComputedStyle("height"), 10);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2895);
parentNode = parentNode || DOCUMENT.body;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2896);
parentNode.appendChild(this._node);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2897);
this.parentNode = parentNode;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2898);
this.set("width", w);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2899);
this.set("height", h);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2900);
return this;
    },

    /**
     * Removes all nodes.
     *
     * @method destroy
     */
    destroy: function()
    {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "destroy", 2908);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2910);
this.clear();
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2911);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "addShape", 2921);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2923);
cfg.graphic = this;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2924);
if(!this.get("visible"))
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2926);
cfg.visible = false;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2928);
var shapeClass = this._getShapeClass(cfg.type),
            shape = new shapeClass(cfg);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2930);
this._appendShape(shape);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2931);
shape._appendStrokeAndFill();
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2932);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_appendShape", 2942);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2944);
var node = shape.node,
            parentNode = this._frag || this._contentNode;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2946);
if(this.get("autoDraw")) 
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2948);
parentNode.appendChild(node);
        }
        else
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2952);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "removeShape", 2962);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2964);
if(!(shape instanceof VMLShape))
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2966);
if(Y_LANG.isString(shape))
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2968);
shape = this._shapes[shape];
            }
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2971);
if(shape && (shape instanceof VMLShape))
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2973);
shape._destroy();
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2974);
this._shapes[shape.get("id")] = null;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2975);
delete this._shapes[shape.get("id")];
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2977);
if(this.get("autoDraw"))
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2979);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "removeAllShapes", 2988);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 2990);
var shapes = this._shapes,
            i;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2992);
for(i in shapes)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2994);
if(shapes.hasOwnProperty(i))
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2996);
shapes[i].destroy();
            }
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 2999);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_removeChildren", 3009);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3011);
if(node.hasChildNodes())
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3013);
var child;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3014);
while(node.firstChild)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3016);
child = node.firstChild;
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3017);
this._removeChildren(child);
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3018);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "clear", 3028);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3029);
this.removeAllShapes();
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3030);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_toggleVisible", 3040);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3042);
var i,
            shapes = this._shapes,
            visibility = val ? "visible" : "hidden";
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3045);
if(shapes)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3047);
for(i in shapes)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3049);
if(shapes.hasOwnProperty(i))
                {
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3051);
shapes[i].set("visible", val);
                }
            }
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3055);
if(this._contentNode)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3057);
this._contentNode.style.visibility = visibility;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3059);
if(this._node)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3061);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setSize", 3072);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3073);
w = Math.round(w);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3074);
h = Math.round(h);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3075);
this._node.style.width = w + 'px';
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3076);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "setPosition", 3086);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3088);
x = Math.round(x);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3089);
y = Math.round(y);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3090);
this._node.style.left = x + "px";
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3091);
this._node.style.top = y + "px";
    },

    /**
     * Creates a group element
     *
     * @method _createGraphic
     * @private
     */
    _createGraphic: function() {
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_createGraphic", 3100);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3101);
var group = DOCUMENT.createElement('<group xmlns="urn:schemas-microsft.com:vml" style="behavior:url(#default#VML);display:block;position:absolute;top:0px;left:0px;zoom:1;" />');
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3102);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_createGraphicNode", 3114);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3116);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "getShapeById", 3127);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3129);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_getShapeClass", 3140);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3142);
var shape = this._shapeClass[val];
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3143);
if(shape)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3145);
return shape;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3147);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "batch", 3171);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3173);
var autoDraw = this.get("autoDraw");
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3174);
this.set("autoDraw", false);
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3175);
method.apply();
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3176);
this._redraw();
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3177);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_getDocFrag", 3187);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3189);
if(!this._frag)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3191);
this._frag = DOCUMENT.createDocumentFragment();
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3193);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "addToRedrawQueue", 3203);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3205);
var shapeBox,
            box;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3207);
this._shapes[shape.get("id")] = shape;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3208);
if(!this.get("resizeDown"))
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3210);
shapeBox = shape.getBounds();
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3211);
box = this._contentBounds;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3212);
box.left = box.left < shapeBox.left ? box.left : shapeBox.left;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3213);
box.top = box.top < shapeBox.top ? box.top : shapeBox.top;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3214);
box.right = box.right > shapeBox.right ? box.right : shapeBox.right;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3215);
box.bottom = box.bottom > shapeBox.bottom ? box.bottom : shapeBox.bottom;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3216);
box.width = box.right - box.left;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3217);
box.height = box.bottom - box.top;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3218);
this._contentBounds = box;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3220);
if(this.get("autoDraw")) 
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3222);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_redraw", 3232);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3234);
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
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3253);
this._contentNode.style.visibility = "hidden";
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3254);
if(autoSize)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3256);
if(autoSize == "sizeContentToGraphic")
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3258);
preserveAspectRatio = this.get("preserveAspectRatio");
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3259);
nodeWidth = this.get("width");
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3260);
nodeHeight = this.get("height");
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3261);
if(preserveAspectRatio == "none" || contentWidth/contentHeight === nodeWidth/nodeHeight)
                {
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3263);
xCoordOrigin = left;
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3264);
yCoordOrigin = top;
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3265);
xCoordSize = contentWidth;
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3266);
yCoordSize = contentHeight;
                }
                else 
                {
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3270);
if(contentWidth * nodeHeight/contentHeight > nodeWidth)
                    {
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3272);
aspectRatio = nodeHeight/nodeWidth;
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3273);
xCoordSize = contentWidth;
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3274);
yCoordSize = contentWidth * aspectRatio;
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3275);
scaledHeight = (nodeWidth * (contentHeight/contentWidth)) * (yCoordSize/nodeHeight);
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3276);
yCoordOrigin = this._calculateCoordOrigin(preserveAspectRatio.slice(5).toLowerCase(), scaledHeight, yCoordSize);
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3277);
yCoordOrigin = top + yCoordOrigin;
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3278);
xCoordOrigin = left;
                    }
                    else
                    {
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3282);
aspectRatio = nodeWidth/nodeHeight;
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3283);
xCoordSize = contentHeight * aspectRatio;
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3284);
yCoordSize = contentHeight;
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3285);
scaledWidth = (nodeHeight * (contentWidth/contentHeight)) * (xCoordSize/nodeWidth);
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3286);
xCoordOrigin = this._calculateCoordOrigin(preserveAspectRatio.slice(1, 4).toLowerCase(), scaledWidth, xCoordSize);
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3287);
xCoordOrigin = xCoordOrigin + left;
                        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3288);
yCoordOrigin = top;
                    }
                }
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3291);
this._contentNode.style.width = nodeWidth + "px";
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3292);
this._contentNode.style.height = nodeHeight + "px";
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3293);
this._contentNode.coordOrigin = xCoordOrigin + ", " + yCoordOrigin;
            }
            else 
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3297);
xCoordSize = contentWidth;
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3298);
yCoordSize = contentHeight;
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3299);
this._contentNode.style.width = contentWidth + "px";
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3300);
this._contentNode.style.height = contentHeight + "px";
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3301);
this._state.width = contentWidth;
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3302);
this._state.height =  contentHeight;
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3303);
if(this._node)
                {
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3305);
this._node.style.width = contentWidth + "px";
                    _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3306);
this._node.style.height = contentHeight + "px";
                }

            }
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3310);
this._contentNode.coordSize = xCoordSize + ", " + yCoordSize;
        }
        else
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3314);
this._contentNode.style.width = right + "px";
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3315);
this._contentNode.style.height = bottom + "px";
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3316);
this._contentNode.coordSize = right + ", " + bottom;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3318);
if(this._frag)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3320);
this._contentNode.appendChild(this._frag);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3321);
this._frag = null;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3323);
if(visible)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3325);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_calculateCoordOrigin", 3339);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3341);
var coord;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3342);
switch(position)
        {
            case "min" :
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3345);
coord = 0;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3346);
break;
            case "mid" :
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3348);
coord = (size - coordsSize)/2;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3349);
break;
            case "max" :
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3351);
coord = (size - coordsSize);
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3352);
break;
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3354);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_getUpdatedContentBounds", 3364);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3366);
var bounds,
            i,
            shape,
            queue = this._shapes,
            box = {};
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3371);
for(i in queue)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3373);
if(queue.hasOwnProperty(i))
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3375);
shape = queue[i];
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3376);
bounds = shape.getBounds();
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3377);
box.left = Y_LANG.isNumber(box.left) ? Math.min(box.left, bounds.left) : bounds.left;
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3378);
box.top = Y_LANG.isNumber(box.top) ? Math.min(box.top, bounds.top) : bounds.top;
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3379);
box.right = Y_LANG.isNumber(box.right) ? Math.max(box.right, bounds.right) : bounds.right;
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3380);
box.bottom = Y_LANG.isNumber(box.bottom) ? Math.max(box.bottom, bounds.bottom) : bounds.bottom;
            }
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3383);
box.left = Y_LANG.isNumber(box.left) ? box.left : 0;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3384);
box.top = Y_LANG.isNumber(box.top) ? box.top : 0;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3385);
box.right = Y_LANG.isNumber(box.right) ? box.right : 0;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3386);
box.bottom = Y_LANG.isNumber(box.bottom) ? box.bottom : 0;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3387);
this._contentBounds = box;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3388);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_toFront", 3398);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3400);
var contentNode = this._contentNode;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3401);
if(shape instanceof Y.VMLShape)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3403);
shape = shape.get("node");
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3405);
if(contentNode && shape)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3407);
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
        _yuitest_coverfunc("build/graphics-vml/graphics-vml.js", "_toBack", 3418);
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3420);
var contentNode = this._contentNode,
            targetNode;
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3422);
if(shape instanceof Y.VMLShape)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3424);
shape = shape.get("node");
        }
        _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3426);
if(contentNode && shape)
        {
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3428);
targetNode = contentNode.firstChild;
            _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3429);
if(targetNode)
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3431);
contentNode.insertBefore(shape, targetNode);
            }
            else
            {
                _yuitest_coverline("build/graphics-vml/graphics-vml.js", 3435);
contentNode.appendChild(shape);
            }
        }
    }
});
_yuitest_coverline("build/graphics-vml/graphics-vml.js", 3440);
Y.VMLGraphic = VMLGraphic;



}, '@VERSION@', {"requires": ["graphics"]});
