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
_yuitest_coverage["graphics-vml"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "graphics-vml",
    code: []
};
_yuitest_coverage["graphics-vml"].code=["YUI.add('graphics-vml', function (Y, NAME) {","","var SHAPE = \"vmlShape\",","    Y_LANG = Y.Lang,","    IS_NUM = Y_LANG.isNumber,","    IS_ARRAY = Y_LANG.isArray,","    IS_STRING = Y_LANG.isString,","    Y_DOM = Y.DOM,","    Y_SELECTOR = Y.Selector,","    DOCUMENT = Y.config.doc,","    AttributeLite = Y.AttributeLite,","	VMLShape,","	VMLCircle,","	VMLPath,","	VMLRect,","	VMLEllipse,","	VMLGraphic,","    VMLPieSlice,","    _getClassName = Y.ClassNameManager.getClassName;","","function VMLDrawing() {}","","/**"," * <a href=\"http://www.w3.org/TR/NOTE-VML\">VML</a> implementation of the <a href=\"Drawing.html\">`Drawing`</a> class. "," * `VMLDrawing` is not intended to be used directly. Instead, use the <a href=\"Drawing.html\">`Drawing`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> and <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> "," * capabilities, the <a href=\"Drawing.html\">`Drawing`</a> class will point to the `VMLDrawing` class."," *"," * @module graphics"," * @class VMLDrawing"," * @constructor"," */","VMLDrawing.prototype = {","    /**","     * Value for rounding up to coordsize","     *","     * @property _coordSpaceMultiplier","     * @type Number","     * @private","     */","    _coordSpaceMultiplier: 100,","","    /**","     * Rounds dimensions and position values based on the coordinate space.","     *","     * @method _round","     * @param {Number} The value for rounding","     * @return Number","     * @private","     */","    _round:function(val)","    {","        return Math.round(val * this._coordSpaceMultiplier);","    },","","    /**","     * Concatanates the path.","     *","     * @method _addToPath","     * @param {String} val The value to add to the path string.","     * @private","     */","    _addToPath: function(val)","    {","        this._path = this._path || \"\";","        if(this._movePath)","        {","            this._path += this._movePath;","            this._movePath = null;","        }","        this._path += val;","    },","","    /**","     * Current x position of the drawing.","     *","     * @property _currentX","     * @type Number","     * @private","     */","    _currentX: 0,","","    /**","     * Current y position of the drqwing.","     *","     * @property _currentY","     * @type Number","     * @private","     */","    _currentY: 0,","","    /**","     * Draws a bezier curve.","     *","     * @method curveTo","     * @param {Number} cp1x x-coordinate for the first control point.","     * @param {Number} cp1y y-coordinate for the first control point.","     * @param {Number} cp2x x-coordinate for the second control point.","     * @param {Number} cp2y y-coordinate for the second control point.","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    curveTo: function(cp1x, cp1y, cp2x, cp2y, x, y) {","        var w,","            h,","            pts,","            right,","            left,","            bottom,","            top;","        this._addToPath(\" c \" + this._round(cp1x) + \", \" + this._round(cp1y) + \", \" + this._round(cp2x) + \", \" + this._round(cp2y) + \", \" + this._round(x) + \", \" + this._round(y));","        right = Math.max(x, Math.max(cp1x, cp2x));","        bottom = Math.max(y, Math.max(cp1y, cp2y));","        left = Math.min(x, Math.min(cp1x, cp2x));","        top = Math.min(y, Math.min(cp1y, cp2y));","        w = Math.abs(right - left);","        h = Math.abs(bottom - top);","        pts = [[this._currentX, this._currentY] , [cp1x, cp1y], [cp2x, cp2y], [x, y]]; ","        this._setCurveBoundingBox(pts, w, h);","        this._currentX = x;","        this._currentY = y;","    },","","    /**","     * Draws a quadratic bezier curve.","     *","     * @method quadraticCurveTo","     * @param {Number} cpx x-coordinate for the control point.","     * @param {Number} cpy y-coordinate for the control point.","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    quadraticCurveTo: function(cpx, cpy, x, y) {","        var currentX = this._currentX,","            currentY = this._currentY,","            cp1x = currentX + 0.67*(cpx - currentX),","            cp1y = currentY + 0.67*(cpy - currentY),","            cp2x = cp1x + (x - currentX) * 0.34,","            cp2y = cp1y + (y - currentY) * 0.34;","        this.curveTo(cp1x, cp1y, cp2x, cp2y, x, y);","    },","","    /**","     * Draws a rectangle.","     *","     * @method drawRect","     * @param {Number} x x-coordinate","     * @param {Number} y y-coordinate","     * @param {Number} w width","     * @param {Number} h height","     */","    drawRect: function(x, y, w, h) {","        this.moveTo(x, y);","        this.lineTo(x + w, y);","        this.lineTo(x + w, y + h);","        this.lineTo(x, y + h);","        this.lineTo(x, y);","        this._currentX = x;","        this._currentY = y;","        return this;","    },","","    /**","     * Draws a rectangle with rounded corners.","     * ","     * @method drawRect","     * @param {Number} x x-coordinate","     * @param {Number} y y-coordinate","     * @param {Number} w width","     * @param {Number} h height","     * @param {Number} ew width of the ellipse used to draw the rounded corners","     * @param {Number} eh height of the ellipse used to draw the rounded corners","     */","    drawRoundRect: function(x, y, w, h, ew, eh) {","        this.moveTo(x, y + eh);","        this.lineTo(x, y + h - eh);","        this.quadraticCurveTo(x, y + h, x + ew, y + h);","        this.lineTo(x + w - ew, y + h);","        this.quadraticCurveTo(x + w, y + h, x + w, y + h - eh);","        this.lineTo(x + w, y + eh);","        this.quadraticCurveTo(x + w, y, x + w - ew, y);","        this.lineTo(x + ew, y);","        this.quadraticCurveTo(x, y, x, y + eh);","        return this;","    },","","    /**","     * Draws a circle. Used internally by `CanvasCircle` class.","     *","     * @method drawCircle","     * @param {Number} x y-coordinate","     * @param {Number} y x-coordinate","     * @param {Number} r radius","     * @protected","     */","	drawCircle: function(x, y, radius) {","        var startAngle = 0,","            endAngle = 360,","            circum = radius * 2;","","        endAngle *= 65535;","        this._drawingComplete = false;","        this._trackSize(x + circum, y + circum);","        this.moveTo((x + circum), (y + radius));","        this._addToPath(\" ae \" + this._round(x + radius) + \", \" + this._round(y + radius) + \", \" + this._round(radius) + \", \" + this._round(radius) + \", \" + startAngle + \", \" + endAngle);","        return this;","    },","    ","    /**","     * Draws an ellipse.","     *","     * @method drawEllipse","     * @param {Number} x x-coordinate","     * @param {Number} y y-coordinate","     * @param {Number} w width","     * @param {Number} h height","     * @protected","     */","	drawEllipse: function(x, y, w, h) {","        var startAngle = 0,","            endAngle = 360,","            radius = w * 0.5,","            yRadius = h * 0.5;","        endAngle *= 65535;","        this._drawingComplete = false;","        this._trackSize(x + w, y + h);","        this.moveTo((x + w), (y + yRadius));","        this._addToPath(\" ae \" + this._round(x + radius) + \", \" + this._round(x + radius) + \", \" + this._round(y + yRadius) + \", \" + this._round(radius) + \", \" + this._round(yRadius) + \", \" + startAngle + \", \" + endAngle);","        return this;","    },","    ","    /**","     * Draws a diamond.     ","     * ","     * @method drawDiamond","     * @param {Number} x y-coordinate","     * @param {Number} y x-coordinate","     * @param {Number} width width","     * @param {Number} height height","     * @protected","     */","    drawDiamond: function(x, y, width, height)","    {","        var midWidth = width * 0.5,","            midHeight = height * 0.5;","        this.moveTo(x + midWidth, y);","        this.lineTo(x + width, y + midHeight);","        this.lineTo(x + midWidth, y + height);","        this.lineTo(x, y + midHeight);","        this.lineTo(x + midWidth, y);","        return this;","    },","","    /**","     * Draws a wedge.","     *","     * @method drawWedge","     * @param {Number} x x-coordinate of the wedge's center point","     * @param {Number} y y-coordinate of the wedge's center point","     * @param {Number} startAngle starting angle in degrees","     * @param {Number} arc sweep of the wedge. Negative values draw clockwise.","     * @param {Number} radius radius of wedge. If [optional] yRadius is defined, then radius is the x radius.","     * @param {Number} yRadius [optional] y radius for wedge.","     * @private","     */","    drawWedge: function(x, y, startAngle, arc, radius)","    {","        var diameter = radius * 2;","        if(Math.abs(arc) > 360)","        {","            arc = 360;","        }","        this._currentX = x;","        this._currentY = y;","        startAngle *= -65535;","        arc *= 65536;","        startAngle = Math.round(startAngle);","        arc = Math.round(arc);","        this.moveTo(x, y);","        this._addToPath(\" ae \" + this._round(x) + \", \" + this._round(y) + \", \" + this._round(radius) + \" \" + this._round(radius) + \", \" +  startAngle + \", \" + arc);","        this._trackSize(diameter, diameter); ","        return this;","    },","","    /**","     * Draws a line segment using the current line style from the current drawing position to the specified x and y coordinates.","     * ","     * @method lineTo","     * @param {Number} point1 x-coordinate for the end point.","     * @param {Number} point2 y-coordinate for the end point.","     */","    lineTo: function(point1, point2, etc) {","        var args = arguments,","            i,","            len,","            path = ' l ';","        if (typeof point1 === 'string' || typeof point1 === 'number') {","            args = [[point1, point2]];","        }","        len = args.length;","        for (i = 0; i < len; ++i) {","            path += ' ' + this._round(args[i][0]) + ', ' + this._round(args[i][1]);","            this._trackSize.apply(this, args[i]);","            this._currentX = args[i][0];","            this._currentY = args[i][1];","        }","        this._addToPath(path);","        return this;","    },","","    /**","     * Moves the current drawing position to specified x and y coordinates.","     *","     * @method moveTo","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    moveTo: function(x, y) {","        this._movePath = \" m \" + this._round(x) + \", \" + this._round(y);","        this._trackSize(x, y);","        this._currentX = x;","        this._currentY = y;","    },","","    /**","     * Draws the graphic.","     *","     * @method _draw","     * @private","     */","    _closePath: function()","    {","        var fill = this.get(\"fill\"),","            stroke = this.get(\"stroke\"),","            node = this.node,","            w = this.get(\"width\"),","            h = this.get(\"height\"),","            path = this._path,","            pathEnd = \"\",","            multiplier = this._coordSpaceMultiplier;","        this._fillChangeHandler();","        this._strokeChangeHandler();","        if(path)","        {","            if(fill && fill.color)","            {","                pathEnd += ' x';","            }","            if(stroke)","            {","                pathEnd += ' e';","            }","        }","        if(path)","        {","            node.path = path + pathEnd;","        }","        if(!isNaN(w) && !isNaN(h))","        {","            node.coordOrigin = this._left + \", \" + this._top;","            node.coordSize = (w * multiplier) + \", \" + (h * multiplier);","            node.style.position = \"absolute\";","            node.style.width =  w + \"px\";","            node.style.height =  h + \"px\";","        }","        this._path = path;","        this._movePath = null;","        this._updateTransform();","    },","","    /**","     * Completes a drawing operation. ","     *","     * @method end","     */","    end: function()","    {","        this._closePath();","    },","","    /**","     * Ends a fill and stroke","     *","     * @method closePath","     */","    closePath: function()","    {","        this._addToPath(\" x e\");","    },","","    /**","     * Clears the path.","     *","     * @method clear","     */","    clear: function()","    {","		this._right = 0;","        this._bottom = 0;","        this._width = 0;","        this._height = 0;","        this._left = 0;","        this._top = 0;","        this._path = \"\";","        this._movePath = null;","    },","    ","    /**","     * Returns the points on a curve","     *","     * @method getBezierData","     * @param Array points Array containing the begin, end and control points of a curve.","     * @param Number t The value for incrementing the next set of points.","     * @return Array","     * @private","     */","    getBezierData: function(points, t) {  ","        var n = points.length,","            tmp = [],","            i,","            j;","","        for (i = 0; i < n; ++i){","            tmp[i] = [points[i][0], points[i][1]]; // save input","        }","        ","        for (j = 1; j < n; ++j) {","            for (i = 0; i < n - j; ++i) {","                tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];","                tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1]; ","            }","        }","        return [ tmp[0][0], tmp[0][1] ]; ","    },","  ","    /**","     * Calculates the bounding box for a curve","     *","     * @method _setCurveBoundingBox","     * @param Array pts Array containing points for start, end and control points of a curve.","     * @param Number w Width used to calculate the number of points to describe the curve.","     * @param Number h Height used to calculate the number of points to describe the curve.","     * @private","     */","    _setCurveBoundingBox: function(pts, w, h)","    {","        var i = 0,","            left = this._currentX,","            right = left,","            top = this._currentY,","            bottom = top,","            len = Math.round(Math.sqrt((w * w) + (h * h))),","            t = 1/len,","            xy;","        for(; i < len; ++i)","        {","            xy = this.getBezierData(pts, t * i);","            left = isNaN(left) ? xy[0] : Math.min(xy[0], left);","            right = isNaN(right) ? xy[0] : Math.max(xy[0], right);","            top = isNaN(top) ? xy[1] : Math.min(xy[1], top);","            bottom = isNaN(bottom) ? xy[1] : Math.max(xy[1], bottom);","        }","        left = Math.round(left * 10)/10;","        right = Math.round(right * 10)/10;","        top = Math.round(top * 10)/10;","        bottom = Math.round(bottom * 10)/10;","        this._trackSize(right, bottom);","        this._trackSize(left, top);","    },","","    /**","     * Updates the size of the graphics object","     *","     * @method _trackSize","     * @param {Number} w width","     * @param {Number} h height","     * @private","     */","    _trackSize: function(w, h) {","        if (w > this._right) {","            this._right = w;","        }","        if(w < this._left)","        {","            this._left = w;    ","        }","        if (h < this._top)","        {","            this._top = h;","        }","        if (h > this._bottom) ","        {","            this._bottom = h;","        }","        this._width = this._right - this._left;","        this._height = this._bottom - this._top;","    },","","    _left: 0,","","    _right: 0,","","    _top: 0,","","    _bottom: 0,","","    _width: 0,","","    _height: 0","};","Y.VMLDrawing = VMLDrawing;","/**"," * <a href=\"http://www.w3.org/TR/NOTE-VML\">VML</a> implementation of the <a href=\"Shape.html\">`Shape`</a> class. "," * `VMLShape` is not intended to be used directly. Instead, use the <a href=\"Shape.html\">`Shape`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> and <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> "," * capabilities, the <a href=\"Shape.html\">`Shape`</a> class will point to the `VMLShape` class."," *"," * @module graphics"," * @class VMLShape"," * @constructor"," * @param {Object} cfg (optional) Attribute configs"," */","VMLShape = function() ","{","    this._transforms = [];","    this.matrix = new Y.Matrix();","    this._normalizedMatrix = new Y.Matrix();","    VMLShape.superclass.constructor.apply(this, arguments);","};","","VMLShape.NAME = \"vmlShape\";","","Y.extend(VMLShape, Y.GraphicBase, Y.mix({","	/**","	 * Indicates the type of shape","	 *","	 * @property _type","	 * @type String","     * @private","	 */","	_type: \"shape\",","    ","    /**","     * Init method, invoked during construction.","     * Calls `initializer` method.","     *","     * @method init","     * @protected","     */","	init: function()","	{","		this.initializer.apply(this, arguments);","	},","","	/**","	 * Initializes the shape","	 *","	 * @private","	 * @method _initialize","	 */","	initializer: function(cfg)","	{","		var host = this,","            graphic = cfg.graphic;","		host.createNode();","        if(graphic)","        {","            this._setGraphic(graphic);","        }","        this._updateHandler();","	},"," ","    /**","     * Set the Graphic instance for the shape.","     *","     * @method _setGraphic","     * @param {Graphic | Node | HTMLElement | String} render This param is used to determine the graphic instance. If it is a `Graphic` instance, it will be assigned","     * to the `graphic` attribute. Otherwise, a new Graphic instance will be created and rendered into the dom element that the render represents.","     * @private","     */","    _setGraphic: function(render)","    {","        var graphic;","        if(render instanceof Y.VMLGraphic)","        {","		    this._graphic = render;","        }","        else","        {","            render = Y.one(render);","            graphic = new Y.VMLGraphic({","                render: render","            });","            graphic._appendShape(this);","            this._graphic = graphic;","            this._appendStrokeAndFill();","        }","    },","    ","    /**","     * Appends fill and stroke nodes to the shape.","     *","     * @method _appendStrokeAndFill","     * @private","     */","    _appendStrokeAndFill: function()","    {","        if(this._strokeNode)","        {","            this.node.appendChild(this._strokeNode);","        }","        if(this._fillNode)","        {","            this.node.appendChild(this._fillNode);","        }","    },","    ","	/**","	 * Creates the dom node for the shape.","	 *","     * @method createNode","	 * @return HTMLElement","	 * @private","	 */","	createNode: function()","	{","        var node,","			x = this.get(\"x\"),","			y = this.get(\"y\"),","            w = this.get(\"width\"),","            h = this.get(\"height\"),","			id,","			type,","			nodestring,","            visibility = this.get(\"visible\") ? \"visible\" : \"hidden\",","			strokestring,","			classString,","			stroke,","			endcap,","			opacity,","			joinstyle,","			miterlimit,","			dashstyle,","			fill,","			fillstring;","			id = this.get(\"id\");","			type = this._type == \"path\" ? \"shape\" : this._type;","			classString = 'vml' + type + ' ' + _getClassName(SHAPE) + \" \" + _getClassName(this.constructor.NAME); ","			stroke = this._getStrokeProps();","			fill = this._getFillProps();","			","			nodestring  = '<' + type + '  xmlns=\"urn:schemas-microsft.com:vml\" id=\"' + id + '\" class=\"' + classString + '\" style=\"behavior:url(#default#VML);display:inline-block;position:absolute;left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;height:' + h + 'px;visibility:' + visibility + '\"';","","		    if(stroke && stroke.weight && stroke.weight > 0)","			{","				endcap = stroke.endcap;","				opacity = parseFloat(stroke.opacity);","				joinstyle = stroke.joinstyle;","				miterlimit = stroke.miterlimit;","				dashstyle = stroke.dashstyle;","				nodestring += ' stroked=\"t\" strokecolor=\"' + stroke.color + '\" strokeWeight=\"' + stroke.weight + 'px\"';","				","				strokestring = '<stroke class=\"vmlstroke\" xmlns=\"urn:schemas-microsft.com:vml\" on=\"t\" style=\"behavior:url(#default#VML);display:inline-block;\"';","				strokestring += ' opacity=\"' + opacity + '\"';","				if(endcap)","				{","					strokestring += ' endcap=\"' + endcap + '\"';","				}","				if(joinstyle)","				{","					strokestring += ' joinstyle=\"' + joinstyle + '\"';","				}","				if(miterlimit)","				{","					strokestring += ' miterlimit=\"' + miterlimit + '\"';","				}","				if(dashstyle)","				{","					strokestring += ' dashstyle=\"' + dashstyle + '\"';","				}","				strokestring += '></stroke>';","				this._strokeNode = DOCUMENT.createElement(strokestring);","				nodestring += ' stroked=\"t\"';","			}","			else","			{","				nodestring += ' stroked=\"f\"';","			}","			if(fill)","			{","				if(fill.node)","				{","					fillstring = fill.node;","					this._fillNode = DOCUMENT.createElement(fillstring);","				}","				if(fill.color)","				{","					nodestring += ' fillcolor=\"' + fill.color + '\"';","				}","				nodestring += ' filled=\"' + fill.filled + '\"';","			}","			","			","			nodestring += '>';","			nodestring += '</' + type + '>';","			","			node = DOCUMENT.createElement(nodestring);","","            this.node = node;","            this._strokeFlag = false;","            this._fillFlag = false;","	},","","	/**","	 * Add a class name to each node.","	 *","	 * @method addClass","	 * @param {String} className the class name to add to the node's class attribute ","	 */","	addClass: function(className)","	{","		var node = this.node;","		Y_DOM.addClass(node, className);","	},","","	/**","	 * Removes a class name from each node.","	 *","	 * @method removeClass","	 * @param {String} className the class name to remove from the node's class attribute","	 */","	removeClass: function(className)","	{","		var node = this.node;","		Y_DOM.removeClass(node, className);","	},","","	/**","	 * Gets the current position of the node in page coordinates.","	 *","	 * @method getXY","	 * @return Array The XY position of the shape.","	 */","	getXY: function()","	{","		var graphic = this._graphic,","			parentXY = graphic.getXY(),","			x = this.get(\"x\"),","			y = this.get(\"y\");","		return [parentXY[0] + x, parentXY[1] + y];","	},","","	/**","	 * Set the position of the shape in page coordinates, regardless of how the node is positioned.","	 *","	 * @method setXY","	 * @param {Array} Contains x & y values for new position (coordinates are page-based)","     *","	 */","	setXY: function(xy)","	{","		var graphic = this._graphic,","			parentXY = graphic.getXY();","		this.set(\"x\", xy[0] - parentXY[0]);","		this.set(\"y\", xy[1] - parentXY[1]);","	},","","	/**","	 * Determines whether the node is an ancestor of another HTML element in the DOM hierarchy. ","	 *","	 * @method contains","	 * @param {VMLShape | HTMLElement} needle The possible node or descendent","	 * @return Boolean Whether or not this shape is the needle or its ancestor.","	 */","	contains: function(needle)","	{","		return needle === Y.one(this.node);","	},","","	/**","	 * Compares nodes to determine if they match.","	 * Node instances can be compared to each other and/or HTMLElements.","	 * @method compareTo","	 * @param {HTMLElement | Node} refNode The reference node to compare to the node.","	 * @return {Boolean} True if the nodes match, false if they do not.","	 */","	compareTo: function(refNode) {","		var node = this.node;","","		return node === refNode;","	},","","	/**","	 * Test if the supplied node matches the supplied selector.","	 *","	 * @method test","	 * @param {String} selector The CSS selector to test against.","	 * @return Boolean Wheter or not the shape matches the selector.","	 */","	test: function(selector)","	{","		return Y_SELECTOR.test(this.node, selector);","	},","","	/**","     * Calculates and returns properties for setting an initial stroke.","     *","     * @method _getStrokeProps","     * @return Object","     *","	 * @private","	 */","	 _getStrokeProps: function()","	 {","		var props,","			stroke = this.get(\"stroke\"),","			strokeOpacity,","			dashstyle,","			dash = \"\",","			val,","			i = 0,","			len,","			linecap,","			linejoin;","        if(stroke && stroke.weight && stroke.weight > 0)","		{","			props = {};","			linecap = stroke.linecap || \"flat\";","			linejoin = stroke.linejoin || \"round\";","			if(linecap != \"round\" && linecap != \"square\")","			{","				linecap = \"flat\";","			}","			strokeOpacity = parseFloat(stroke.opacity);","			dashstyle = stroke.dashstyle || \"none\";","			stroke.color = stroke.color || \"#000000\";","			stroke.weight = stroke.weight || 1;","			stroke.opacity = IS_NUM(strokeOpacity) ? strokeOpacity : 1;","			props.stroked = true;","			props.color = stroke.color;","			props.weight = stroke.weight;","			props.endcap = linecap;","			props.opacity = stroke.opacity;","			if(IS_ARRAY(dashstyle))","			{","				dash = [];","				len = dashstyle.length;","				for(i = 0; i < len; ++i)","				{","					val = dashstyle[i];","					dash[i] = val / stroke.weight;","				}","			}","			if(linejoin == \"round\" || linejoin == \"bevel\")","			{","				props.joinstyle = linejoin;","			}","			else","			{","				linejoin = parseInt(linejoin, 10);","				if(IS_NUM(linejoin))","				{","					props.miterlimit = Math.max(linejoin, 1);","					props.joinstyle = \"miter\";","				}","			}","			props.dashstyle = dash;","		}","		return props;","	 },","","	/**","	 * Adds a stroke to the shape node.","	 *","	 * @method _strokeChangeHandler","	 * @private","	 */","	_strokeChangeHandler: function(e)","	{","        if(!this._strokeFlag)","        {","            return;","        }","		var node = this.node,","			stroke = this.get(\"stroke\"),","			strokeOpacity,","			dashstyle,","			dash = \"\",","			val,","			i = 0,","			len,","			linecap,","			linejoin;","		if(stroke && stroke.weight && stroke.weight > 0)","		{","			linecap = stroke.linecap || \"flat\";","			linejoin = stroke.linejoin || \"round\";","			if(linecap != \"round\" && linecap != \"square\")","			{","				linecap = \"flat\";","			}","			strokeOpacity = parseFloat(stroke.opacity);","			dashstyle = stroke.dashstyle || \"none\";","			stroke.color = stroke.color || \"#000000\";","			stroke.weight = stroke.weight || 1;","			stroke.opacity = IS_NUM(strokeOpacity) ? strokeOpacity : 1;","			node.stroked = true;","			node.strokeColor = stroke.color;","			node.strokeWeight = stroke.weight + \"px\";","			if(!this._strokeNode)","			{","				this._strokeNode = this._createGraphicNode(\"stroke\");","				node.appendChild(this._strokeNode);","			}","			this._strokeNode.endcap = linecap;","			this._strokeNode.opacity = stroke.opacity;","			if(IS_ARRAY(dashstyle))","			{","				dash = [];","				len = dashstyle.length;","				for(i = 0; i < len; ++i)","				{","					val = dashstyle[i];","					dash[i] = val / stroke.weight;","				}","			}","			if(linejoin == \"round\" || linejoin == \"bevel\")","			{","				this._strokeNode.joinstyle = linejoin;","			}","			else","			{","				linejoin = parseInt(linejoin, 10);","				if(IS_NUM(linejoin))","				{","					this._strokeNode.miterlimit = Math.max(linejoin, 1);","					this._strokeNode.joinstyle = \"miter\";","				}","			}","			this._strokeNode.dashstyle = dash;","            this._strokeNode.on = true;","		}","		else","		{","            if(this._strokeNode)","            {","                this._strokeNode.on = false;","            }","			node.stroked = false;","		}","        this._strokeFlag = false;","	},","","	/**","     * Calculates and returns properties for setting an initial fill.","     *","     * @method _getFillProps","     * @return Object","     *","	 * @private","	 */","	_getFillProps: function()","	{","		var fill = this.get(\"fill\"),","			fillOpacity,","			props,","			gradient,","			i,","			fillstring,","			filled = false;","		if(fill)","		{","			props = {};","			","			if(fill.type == \"radial\" || fill.type == \"linear\")","			{","				fillOpacity = parseFloat(fill.opacity);","				fillOpacity = IS_NUM(fillOpacity) ? fillOpacity : 1;","				filled = true;","				gradient = this._getGradientFill(fill);","				fillstring = '<fill xmlns=\"urn:schemas-microsft.com:vml\" class=\"vmlfill\" style=\"behavior:url(#default#VML);display:inline-block;\" opacity=\"' + fillOpacity + '\"';","				for(i in gradient)","				{","					if(gradient.hasOwnProperty(i))","					{","						fillstring += ' ' + i + '=\"' + gradient[i] + '\"';","					}","				}","				fillstring += ' />';","				props.node = fillstring;","			}","			else if(fill.color)","			{","				fillOpacity = parseFloat(fill.opacity);","				filled = true;","                props.color = fill.color;","				if(IS_NUM(fillOpacity))","				{","					fillOpacity = Math.max(Math.min(fillOpacity, 1), 0);","                    props.opacity = fillOpacity;    ","				    if(fillOpacity < 1)","                    {","                        props.node = '<fill xmlns=\"urn:schemas-microsft.com:vml\" class=\"vmlfill\" style=\"behavior:url(#default#VML);display:inline-block;\" type=\"solid\" opacity=\"' + fillOpacity + '\"/>';","				    }","                }","			}","			props.filled = filled;","		}","		return props;","	},","","	/**","	 * Adds a fill to the shape node.","	 *","	 * @method _fillChangeHandler","	 * @private","	 */","	_fillChangeHandler: function(e)","	{","        if(!this._fillFlag)","        {","            return;","        }","		var node = this.node,","			fill = this.get(\"fill\"),","			fillOpacity,","			fillstring,","			filled = false,","            i,","            gradient;","		if(fill)","		{","			if(fill.type == \"radial\" || fill.type == \"linear\")","			{","				filled = true;","				gradient = this._getGradientFill(fill);","                if(this._fillNode)","                {","                    for(i in gradient)","                    {","                        if(gradient.hasOwnProperty(i))","                        {","                            if(i == \"colors\")","                            {","                                this._fillNode.colors.value = gradient[i];","                            }","                            else","                            {","                                this._fillNode[i] = gradient[i];","                            }","                        }","                    }","                }","                else","                {","                    fillstring = '<fill xmlns=\"urn:schemas-microsft.com:vml\" class=\"vmlfill\" style=\"behavior:url(#default#VML);display:inline-block;\"';","                    for(i in gradient)","                    {","                        if(gradient.hasOwnProperty(i))","                        {","                            fillstring += ' ' + i + '=\"' + gradient[i] + '\"';","                        }","                    }","                    fillstring += ' />';","                    this._fillNode = DOCUMENT.createElement(fillstring);","                    node.appendChild(this._fillNode);","                }","			}","			else if(fill.color)","			{","                node.fillcolor = fill.color;","				fillOpacity = parseFloat(fill.opacity);","				filled = true;","				if(IS_NUM(fillOpacity) && fillOpacity < 1)","				{","					fill.opacity = fillOpacity;","                    if(this._fillNode)","					{","                        if(this._fillNode.getAttribute(\"type\") != \"solid\")","                        {","                            this._fillNode.type = \"solid\";","                        }","						this._fillNode.opacity = fillOpacity;","					}","					else","					{     ","                        fillstring = '<fill xmlns=\"urn:schemas-microsft.com:vml\" class=\"vmlfill\" style=\"behavior:url(#default#VML);display:inline-block;\" type=\"solid\" opacity=\"' + fillOpacity + '\"/>';","                        this._fillNode = DOCUMENT.createElement(fillstring);","                        node.appendChild(this._fillNode);","					}","				}","				else if(this._fillNode)","                {   ","                    this._fillNode.opacity = 1;","                    this._fillNode.type = \"solid\";","				}","			}","		}","		node.filled = filled;","        this._fillFlag = false;","	},","","	//not used. remove next release.","    _updateFillNode: function(node)","	{","		if(!this._fillNode)","		{","			this._fillNode = this._createGraphicNode(\"fill\");","			node.appendChild(this._fillNode);","		}","	},","","    /**","     * Calculates and returns an object containing gradient properties for a fill node. ","     *","     * @method _getGradientFill","     * @param {Object} fill Object containing fill properties.","     * @return Object","     * @private","     */","	_getGradientFill: function(fill)","	{","		var gradientProps = {},","			gradientBoxWidth,","			gradientBoxHeight,","			type = fill.type,","			w = this.get(\"width\"),","			h = this.get(\"height\"),","			isNumber = IS_NUM,","			stop,","			stops = fill.stops,","			len = stops.length,","			opacity,","			color,","			i = 0,","			oi,","			colorstring = \"\",","			cx = fill.cx,","			cy = fill.cy,","			fx = fill.fx,","			fy = fill.fy,","			r = fill.r,","            pct,","			rotation = fill.rotation || 0;","		if(type === \"linear\")","		{","            if(rotation <= 270)","            {","                rotation = Math.abs(rotation - 270);","            }","			else if(rotation < 360)","            {","                rotation = 270 + (360 - rotation);","            }","            else","            {","                rotation = 270;","            }","            gradientProps.type = \"gradient\";//\"gradientunscaled\";","			gradientProps.angle = rotation;","		}","		else if(type === \"radial\")","		{","			gradientBoxWidth = w * (r * 2);","			gradientBoxHeight = h * (r * 2);","			fx = r * 2 * (fx - 0.5);","			fy = r * 2 * (fy - 0.5);","			fx += cx;","			fy += cy;","			gradientProps.focussize = (gradientBoxWidth/w)/10 + \"% \" + (gradientBoxHeight/h)/10 + \"%\";","			gradientProps.alignshape = false;","			gradientProps.type = \"gradientradial\";","			gradientProps.focus = \"100%\";","			gradientProps.focusposition = Math.round(fx * 100) + \"% \" + Math.round(fy * 100) + \"%\";","		}","		for(;i < len; ++i) {","			stop = stops[i];","			color = stop.color;","			opacity = stop.opacity;","			opacity = isNumber(opacity) ? opacity : 1;","			pct = stop.offset || i/(len-1);","			pct *= (r * 2);","            pct = Math.round(100 * pct) + \"%\";","            oi = i > 0 ? i + 1 : \"\";","            gradientProps[\"opacity\" + oi] = opacity + \"\";","            colorstring += \", \" + pct + \" \" + color;","		}","		if(parseFloat(pct) < 100)","		{","			colorstring += \", 100% \" + color;","		}","		gradientProps.colors = colorstring.substr(2);","		return gradientProps;","	},","","    /**","     * Adds a transform to the shape.","     *","     * @method _addTransform","     * @param {String} type The transform being applied.","     * @param {Array} args The arguments for the transform.","	 * @private","	 */","	_addTransform: function(type, args)","	{","        args = Y.Array(args);","        this._transform = Y_LANG.trim(this._transform + \" \" + type + \"(\" + args.join(\", \") + \")\");","        args.unshift(type);","        this._transforms.push(args);","        if(this.initialized)","        {","            this._updateTransform();","        }","	},","	","	/**","     * Applies all transforms.","     *","     * @method _updateTransform","	 * @private","	 */","	_updateTransform: function()","	{","		var node = this.node,","            key,","			transform,","			transformOrigin,","            x = this.get(\"x\"),","            y = this.get(\"y\"),","            tx,","            ty,","            matrix = this.matrix,","            normalizedMatrix = this._normalizedMatrix,","            isPathShape = this instanceof Y.VMLPath,","            i = 0,","            len = this._transforms.length;","        if(this._transforms && this._transforms.length > 0)","		{","            transformOrigin = this.get(\"transformOrigin\");","       ","            if(isPathShape)","            {","                normalizedMatrix.translate(this._left, this._top);","            }","            //vml skew matrix transformOrigin ranges from -0.5 to 0.5.","            //subtract 0.5 from values","            tx = transformOrigin[0] - 0.5;","            ty = transformOrigin[1] - 0.5;","            ","            //ensure the values are within the appropriate range to avoid errors","            tx = Math.max(-0.5, Math.min(0.5, tx));","            ty = Math.max(-0.5, Math.min(0.5, ty));","            for(; i < len; ++i)","            {","                key = this._transforms[i].shift();","                if(key)","                {","                    normalizedMatrix[key].apply(normalizedMatrix, this._transforms[i]); ","                    matrix[key].apply(matrix, this._transforms[i]); ","                }","			}","            if(isPathShape)","            {","                normalizedMatrix.translate(-this._left, -this._top);","            }","            transform = normalizedMatrix.a + \",\" + ","                        normalizedMatrix.c + \",\" + ","                        normalizedMatrix.b + \",\" + ","                        normalizedMatrix.d + \",\" + ","                        0 + \",\" +","                        0;","		}","        this._graphic.addToRedrawQueue(this);    ","        if(transform)","        {","            if(!this._skew)","            {","                this._skew = DOCUMENT.createElement( '<skew class=\"vmlskew\" xmlns=\"urn:schemas-microsft.com:vml\" on=\"false\" style=\"behavior:url(#default#VML);display:inline-block;\" />');","                this.node.appendChild(this._skew); ","            }","            this._skew.matrix = transform;","            this._skew.on = true;","            //this._skew.offset = this._getSkewOffsetValue(normalizedMatrix.dx) + \"px, \" + this._getSkewOffsetValue(normalizedMatrix.dy) + \"px\";","            this._skew.origin = tx + \", \" + ty;","        }","        if(this._type != \"path\")","        {","            this._transforms = [];","        }","        //add the translate to the x and y coordinates","        node.style.left = (x + this._getSkewOffsetValue(normalizedMatrix.dx)) + \"px\";","        node.style.top =  (y + this._getSkewOffsetValue(normalizedMatrix.dy)) + \"px\";","    },","    ","    /**","     * Normalizes the skew offset values between -32767 and 32767.","     *","     * @method _getSkewOffsetValue","     * @param {Number} val The value to normalize","     * @return Number","     * @private","     */","    _getSkewOffsetValue: function(val)","    {","        var sign = Y.MatrixUtil.sign(val),","            absVal = Math.abs(val);","        val = Math.min(absVal, 32767) * sign;","        return val;","    },","	","	/**","	 * Storage for translateX","	 *","     * @property _translateX","     * @type Number","	 * @private","	 */","	_translateX: 0,","","	/**","	 * Storage for translateY","	 *","     * @property _translateY","     * @type Number","	 * @private","	 */","	_translateY: 0,","    ","    /**","     * Storage for the transform attribute.","     *","     * @property _transform","     * @type String","     * @private","     */","    _transform: \"\",","	","    /**","	 * Specifies a 2d translation.","	 *","	 * @method translate","	 * @param {Number} x The value to translate on the x-axis.","	 * @param {Number} y The value to translate on the y-axis.","	 */","	translate: function(x, y)","	{","		this._translateX += x;","		this._translateY += y;","		this._addTransform(\"translate\", arguments);","	},","","	/**","	 * Translates the shape along the x-axis. When translating x and y coordinates,","	 * use the `translate` method.","	 *","	 * @method translateX","	 * @param {Number} x The value to translate.","	 */","	translateX: function(x)","    {","        this._translateX += x;","        this._addTransform(\"translateX\", arguments);","    },","","	/**","	 * Performs a translate on the y-coordinate. When translating x and y coordinates,","	 * use the `translate` method.","	 *","	 * @method translateY","	 * @param {Number} y The value to translate.","	 */","	translateY: function(y)","    {","        this._translateY += y;","        this._addTransform(\"translateY\", arguments);","    },","","    /**","     * Skews the shape around the x-axis and y-axis.","     *","     * @method skew","     * @param {Number} x The value to skew on the x-axis.","     * @param {Number} y The value to skew on the y-axis.","     */","    skew: function(x, y)","    {","        this._addTransform(\"skew\", arguments);","    },","","	/**","	 * Skews the shape around the x-axis.","	 *","	 * @method skewX","	 * @param {Number} x x-coordinate","	 */","	 skewX: function(x)","	 {","		this._addTransform(\"skewX\", arguments);","	 },","","	/**","	 * Skews the shape around the y-axis.","	 *","	 * @method skewY","	 * @param {Number} y y-coordinate","	 */","	 skewY: function(y)","	 {","		this._addTransform(\"skewY\", arguments);","	 },","","	/**","	 * Rotates the shape clockwise around it transformOrigin.","	 *","	 * @method rotate","	 * @param {Number} deg The degree of the rotation.","	 */","	 rotate: function(deg)","	 {","		this._addTransform(\"rotate\", arguments);","	 },","","	/**","	 * Specifies a 2d scaling operation.","	 *","	 * @method scale","	 * @param {Number} val","	 */","	scale: function(x, y)","	{","		this._addTransform(\"scale\", arguments);","	},","","	/**","     * Overrides default `on` method. Checks to see if its a dom interaction event. If so, ","     * return an event attached to the `node` element. If not, return the normal functionality.","     *","     * @method on","     * @param {String} type event type","     * @param {Object} callback function","	 * @private","	 */","	on: function(type, fn)","	{","		if(Y.Node.DOM_EVENTS[type])","		{","			return Y.one(\"#\" +  this.get(\"id\")).on(type, fn);","		}","		return Y.on.apply(this, arguments);","	},","","	/**","	 * Draws the shape.","	 *","	 * @method _draw","	 * @private","	 */","	_draw: function()","	{","	},","","	/**","     * Updates `Shape` based on attribute changes.","     *","     * @method _updateHandler","	 * @private","	 */","	_updateHandler: function(e)","	{","		var host = this,","            node = host.node;","        host._fillChangeHandler();","        host._strokeChangeHandler();","        node.style.width = this.get(\"width\") + \"px\";","        node.style.height = this.get(\"height\") + \"px\"; ","        this._draw();","		host._updateTransform();","	},","","	/**","	 * Creates a graphic node","	 *","	 * @method _createGraphicNode","	 * @param {String} type node type to create","	 * @return HTMLElement","	 * @private","	 */","	_createGraphicNode: function(type)","	{","		type = type || this._type;","		return DOCUMENT.createElement('<' + type + ' xmlns=\"urn:schemas-microsft.com:vml\" style=\"behavior:url(#default#VML);display:inline-block;\" class=\"vml' + type + '\"/>');","	},","","	/**","	 * Value function for fill attribute","	 *","	 * @private","	 * @method _getDefaultFill","	 * @return Object","	 */","	_getDefaultFill: function() {","		return {","			type: \"solid\",","			cx: 0.5,","			cy: 0.5,","			fx: 0.5,","			fy: 0.5,","			r: 0.5","		};","	},","","	/**","	 * Value function for stroke attribute","	 *","	 * @private","	 * @method _getDefaultStroke","	 * @return Object","	 */","	_getDefaultStroke: function() ","	{","		return {","			weight: 1,","			dashstyle: \"none\",","			color: \"#000\",","			opacity: 1.0","		};","	},","","    /**","     * Sets the value of an attribute.","     *","     * @method set","     * @param {String|Object} name The name of the attribute. Alternatively, an object of key value pairs can ","     * be passed in to set multiple attributes at once.","     * @param {Any} value The value to set the attribute to. This value is ignored if an object is received as ","     * the name param.","     */","	set: function() ","	{","		var host = this;","		AttributeLite.prototype.set.apply(host, arguments);","		if(host.initialized)","		{","			host._updateHandler();","		}","	},","","	/**","	 * Returns the bounds for a shape.","	 *","     * Calculates the a new bounding box from the original corner coordinates (base on size and position) and the transform matrix.","     * The calculated bounding box is used by the graphic instance to calculate its viewBox. ","     *","	 * @method getBounds","	 * @return Object","	 */","	getBounds: function()","	{","		var isPathShape = this instanceof Y.VMLPath,","			w = this.get(\"width\"),","			h = this.get(\"height\"),","            x = this.get(\"x\"),","            y = this.get(\"y\");","        if(isPathShape)","        {","            x = x + this._left;","            y = y + this._top;","            w = this._right - this._left;","            h = this._bottom - this._top;","        }","        return this._getContentRect(w, h, x, y);","	},","","    /**","     * Calculates the bounding box for the shape.","     *","     * @method _getContentRect","     * @param {Number} w width of the shape","     * @param {Number} h height of the shape","     * @param {Number} x x-coordinate of the shape","     * @param {Number} y y-coordinate of the shape","     * @private","     */","    _getContentRect: function(w, h, x, y)","    {","        var transformOrigin = this.get(\"transformOrigin\"),","            transformX = transformOrigin[0] * w,","            transformY = transformOrigin[1] * h,","		    transforms = this.matrix.getTransformArray(this.get(\"transform\")),","            matrix = new Y.Matrix(),","            i = 0,","            len = transforms.length,","            transform,","            key,","            contentRect,","            isPathShape = this instanceof Y.VMLPath;","        if(isPathShape)","        {","            matrix.translate(this._left, this._top);","        }","        transformX = !isNaN(transformX) ? transformX : 0;","        transformY = !isNaN(transformY) ? transformY : 0;","        matrix.translate(transformX, transformY);","        for(; i < len; i = i + 1)","        {","            transform = transforms[i];","            key = transform.shift();","            if(key)","            {","                matrix[key].apply(matrix, transform); ","            }","        }","        matrix.translate(-transformX, -transformY);","        if(isPathShape)","        {","            matrix.translate(-this._left, -this._top);","        }","        contentRect = matrix.getContentRect(w, h, x, y);","        return contentRect;","    },","	","    /**","     *  Destroys shape","     *","     *  @method destroy","     */","    destroy: function()","    {","        var graphic = this.get(\"graphic\");","        if(graphic)","        {","            graphic.removeShape(this);","        }","        else","        {","            this._destroy();","        }","    },","","    /**","     *  Implementation for shape destruction","     *","     *  @method destroy","     *  @protected","     */","    _destroy: function()","    {","        if(this.node)","        {   ","            if(this._fillNode)","            {","                this.node.removeChild(this._fillNode);","                this._fillNode = null;","            }","            if(this._strokeNode)","            {","                this.node.removeChild(this._strokeNode);","                this._strokeNode = null;","            }","            Y.one(this.node).remove(true);","        }","    }","}, Y.VMLDrawing.prototype));","","VMLShape.ATTRS = {","	/**","	 * An array of x, y values which indicates the transformOrigin in which to rotate the shape. Valid values range between 0 and 1 representing a ","	 * fraction of the shape's corresponding bounding box dimension. The default value is [0.5, 0.5].","	 *","	 * @config transformOrigin","	 * @type Array","	 */","	transformOrigin: {","		valueFn: function()","		{","			return [0.5, 0.5];","		}","	},","	","    /**","     * <p>A string containing, in order, transform operations applied to the shape instance. The `transform` string can contain the following values:","     *     ","     *    <dl>","     *        <dt>rotate</dt><dd>Rotates the shape clockwise around it transformOrigin.</dd>","     *        <dt>translate</dt><dd>Specifies a 2d translation.</dd>","     *        <dt>skew</dt><dd>Skews the shape around the x-axis and y-axis.</dd>","     *        <dt>scale</dt><dd>Specifies a 2d scaling operation.</dd>","     *        <dt>translateX</dt><dd>Translates the shape along the x-axis.</dd>","     *        <dt>translateY</dt><dd>Translates the shape along the y-axis.</dd>","     *        <dt>skewX</dt><dd>Skews the shape around the x-axis.</dd>","     *        <dt>skewY</dt><dd>Skews the shape around the y-axis.</dd>","     *        <dt>matrix</dt><dd>Specifies a 2D transformation matrix comprised of the specified six values.</dd>      ","     *    </dl>","     * </p>","     * <p>Applying transforms through the transform attribute will reset the transform matrix and apply a new transform. The shape class also contains corresponding methods for each transform","     * that will apply the transform to the current matrix. The below code illustrates how you might use the `transform` attribute to instantiate a recangle with a rotation of 45 degrees.</p>","            var myRect = new Y.Rect({","                type:\"rect\",","                width: 50,","                height: 40,","                transform: \"rotate(45)\"","            };","     * <p>The code below would apply `translate` and `rotate` to an existing shape.</p>","    ","        myRect.set(\"transform\", \"translate(40, 50) rotate(45)\");","	 * @config transform","     * @type String  ","	 */","	transform: {","		setter: function(val)","		{","            var i = 0,","                len,","                transform;","            this.matrix.init();	","            this._normalizedMatrix.init();	","            this._transforms = this.matrix.getTransformArray(val);","            len = this._transforms.length;","            for(;i < len; ++i)","            {","                transform = this._transforms[i];","            }","            this._transform = val;","            return val;","		},","","        getter: function()","        {","            return this._transform;","        }","	},","","	/**","	 * Indicates the x position of shape.","	 *","	 * @config x","	 * @type Number","	 */","	x: {","		value: 0","	},","","	/**","	 * Indicates the y position of shape.","	 *","	 * @config y","	 * @type Number","	 */","	y: {","		value: 0","	},","","	/**","	 * Unique id for class instance.","	 *","	 * @config id","	 * @type String","	 */","	id: {","		valueFn: function()","		{","			return Y.guid();","		},","","		setter: function(val)","		{","			var node = this.node;","			if(node)","			{","				node.setAttribute(\"id\", val);","			}","			return val;","		}","	},","	","	/**","	 * ","	 * @config width","	 */","	width: {","		value: 0","	},","","	/**","	 * ","	 * @config height","	 */","	height: {","		value: 0","	},","","	/**","	 * Indicates whether the shape is visible.","	 *","	 * @config visible","	 * @type Boolean","	 */","	visible: {","		value: true,","","		setter: function(val){","			var node = this.node,","				visibility = val ? \"visible\" : \"hidden\";","			if(node)","			{","				node.style.visibility = visibility;","			}","			return val;","		}","	},","","	/**","	 * Contains information about the fill of the shape. ","     *  <dl>","     *      <dt>color</dt><dd>The color of the fill.</dd>","     *      <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the fill. The default value is 1.</dd>","     *      <dt>type</dt><dd>Type of fill.","     *          <dl>","     *              <dt>solid</dt><dd>Solid single color fill. (default)</dd>","     *              <dt>linear</dt><dd>Linear gradient fill.</dd>","     *              <dt>radial</dt><dd>Radial gradient fill.</dd>","     *          </dl>","     *      </dd>","     *  </dl>","     *  <p>If a `linear` or `radial` is specified as the fill type. The following additional property is used:","     *  <dl>","     *      <dt>stops</dt><dd>An array of objects containing the following properties:","     *          <dl>","     *              <dt>color</dt><dd>The color of the stop.</dd>","     *              <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the stop. The default value is 1. Note: No effect for IE 6 - 8</dd>","     *              <dt>offset</dt><dd>Number between 0 and 1 indicating where the color stop is positioned.</dd> ","     *          </dl>","     *      </dd>","     *      <p>Linear gradients also have the following property:</p>","     *      <dt>rotation</dt><dd>Linear gradients flow left to right by default. The rotation property allows you to change the flow by rotation. (e.g. A rotation of 180 would make the gradient pain from right to left.)</dd>","     *      <p>Radial gradients have the following additional properties:</p>","     *      <dt>r</dt><dd>Radius of the gradient circle.</dd>","     *      <dt>fx</dt><dd>Focal point x-coordinate of the gradient.</dd>","     *      <dt>fy</dt><dd>Focal point y-coordinate of the gradient.</dd>","     *  </dl>","     *  <p>The corresponding `SVGShape` class implements the following additional properties.</p>","     *  <dl>","     *      <dt>cx</dt><dd>","     *          <p>The x-coordinate of the center of the gradient circle. Determines where the color stop begins. The default value 0.5.</p>","     *      </dd>","     *      <dt>cy</dt><dd>","     *          <p>The y-coordinate of the center of the gradient circle. Determines where the color stop begins. The default value 0.5.</p>","     *      </dd>","     *  </dl>","     *  <p>These properties are not currently implemented in `CanvasShape` or `VMLShape`.</p> ","	 *","	 * @config fill","	 * @type Object ","	 */","	fill: {","		valueFn: \"_getDefaultFill\",","		","		setter: function(val)","		{","			var i,","				fill,","				tmpl = this.get(\"fill\") || this._getDefaultFill();","			","			if(val)","			{","				//ensure, fill type is solid if color is explicitly passed.","				if(val.hasOwnProperty(\"color\"))","				{","					val.type = \"solid\";","				}","				for(i in val)","				{","					if(val.hasOwnProperty(i))","					{   ","						tmpl[i] = val[i];","					}","				}","			}","			fill = tmpl;","			if(fill && fill.color)","			{","				if(fill.color === undefined || fill.color == \"none\")","				{","					fill.color = null;","				}","			}","			this._fillFlag = true;","            return fill;","		}","	},","","	/**","	 * Contains information about the stroke of the shape.","     *  <dl>","     *      <dt>color</dt><dd>The color of the stroke.</dd>","     *      <dt>weight</dt><dd>Number that indicates the width of the stroke.</dd>","     *      <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the stroke. The default value is 1.</dd>","     *      <dt>dashstyle</dt>Indicates whether to draw a dashed stroke. When set to \"none\", a solid stroke is drawn. When set to an array, the first index indicates the","     *  length of the dash. The second index indicates the length of gap.","     *      <dt>linecap</dt><dd>Specifies the linecap for the stroke. The following values can be specified:","     *          <dl>","     *              <dt>butt (default)</dt><dd>Specifies a butt linecap.</dd>","     *              <dt>square</dt><dd>Specifies a sqare linecap.</dd>","     *              <dt>round</dt><dd>Specifies a round linecap.</dd>","     *          </dl>","     *      </dd>","     *      <dt>linejoin</dt><dd>Specifies a linejoin for the stroke. The following values can be specified:","     *          <dl>","     *              <dt>round (default)</dt><dd>Specifies that the linejoin will be round.</dd>","     *              <dt>bevel</dt><dd>Specifies a bevel for the linejoin.</dd>","     *              <dt>miter limit</dt><dd>An integer specifying the miter limit of a miter linejoin. If you want to specify a linejoin of miter, you simply specify the limit as opposed to having","     *  separate miter and miter limit values.</dd>","     *          </dl>","     *      </dd>","     *  </dl>","	 *","	 * @config stroke","	 * @type Object","	 */","	stroke: {","		valueFn: \"_getDefaultStroke\",","		","		setter: function(val)","		{","			var i,","				stroke,","                wt,","				tmpl = this.get(\"stroke\") || this._getDefaultStroke();","			if(val)","			{","                if(val.hasOwnProperty(\"weight\"))","                {","                    wt = parseInt(val.weight, 10);","                    if(!isNaN(wt))","                    {","                        val.weight = wt;","                    }","                }","				for(i in val)","				{","					if(val.hasOwnProperty(i))","					{   ","						tmpl[i] = val[i];","					}","				}","			}","			stroke = tmpl;","            this._strokeFlag = true;","			return stroke;","		}","	},","	","	//Not used. Remove in future.","    autoSize: {","		value: false","	},","","	// Only implemented in SVG","	// Determines whether the instance will receive mouse events.","	// ","	// @config pointerEvents","	// @type string","	//","	pointerEvents: {","		value: \"visiblePainted\"","	},","","	/**","	 * Dom node for the shape.","	 *","	 * @config node","	 * @type HTMLElement","	 * @readOnly","	 */","	node: {","		readOnly: true,","","		getter: function()","		{","			return this.node;","		}","	},","","	/**","	 * Reference to the container Graphic.","	 *","	 * @config graphic","	 * @type Graphic","	 */","	graphic: {","		readOnly: true,","","		getter: function()","		{","			return this._graphic;","		}","	}","};","Y.VMLShape = VMLShape;","/**"," * <a href=\"http://www.w3.org/TR/NOTE-VML\">VML</a> implementation of the <a href=\"Path.html\">`Path`</a> class. "," * `VMLPath` is not intended to be used directly. Instead, use the <a href=\"Path.html\">`Path`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> and <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> "," * capabilities, the <a href=\"Path.html\">`Path`</a> class will point to the `VMLPath` class."," *"," * @module graphics"," * @class VMLPath"," * @extends VMLShape"," */","VMLPath = function()","{","	VMLPath.superclass.constructor.apply(this, arguments);","};","","VMLPath.NAME = \"vmlPath\";","Y.extend(VMLPath, Y.VMLShape, {","    /*","     * Completes a drawing operation. ","     *","     * @method end","     */","    end: function()","    {","        this._closePath();","        this._updateTransform();","    }","});","VMLPath.ATTRS = Y.merge(Y.VMLShape.ATTRS, {","	/**","	 * Indicates the width of the shape","	 * ","	 * @config width","	 * @type Number","	 */","	width: {","		getter: function()","		{","			var val = Math.max(this._right - this._left, 0);","			return val;","		}","	},","","	/**","	 * Indicates the height of the shape","	 * ","	 * @config height","	 * @type Number","	 */","	height: {","		getter: function()","		{","			return Math.max(this._bottom - this._top, 0);","		}","	},","	","	/**","	 * Indicates the path used for the node.","	 *","	 * @config path","	 * @type String","     * @readOnly","	 */","	path: {","		readOnly: true,","","		getter: function()","		{","			return this._path;","		}","	}","});","Y.VMLPath = VMLPath;","/**"," * <a href=\"http://www.w3.org/TR/NOTE-VML\">VML</a> implementation of the <a href=\"Rect.html\">`Rect`</a> class. "," * `VMLRect` is not intended to be used directly. Instead, use the <a href=\"Rect.html\">`Rect`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> and <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> "," * capabilities, the <a href=\"Rect.html\">`Rect`</a> class will point to the `VMLRect` class."," *"," * @module graphics"," * @class VMLRect"," * @constructor"," */","VMLRect = function()","{","	VMLRect.superclass.constructor.apply(this, arguments);","};","VMLRect.NAME = \"vmlRect\"; ","Y.extend(VMLRect, Y.VMLShape, {","	/**","	 * Indicates the type of shape","	 *","	 * @property _type","	 * @type String","     * @private","	 */","	_type: \"rect\"","});","VMLRect.ATTRS = Y.VMLShape.ATTRS;","Y.VMLRect = VMLRect;","/**"," * <a href=\"http://www.w3.org/TR/NOTE-VML\">VML</a> implementation of the <a href=\"Ellipse.html\">`Ellipse`</a> class. "," * `VMLEllipse` is not intended to be used directly. Instead, use the <a href=\"Ellipse.html\">`Ellipse`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> and <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> "," * capabilities, the <a href=\"Ellipse.html\">`Ellipse`</a> class will point to the `VMLEllipse` class."," *"," * @module graphics"," * @class VMLEllipse"," * @constructor"," */","VMLEllipse = function()","{","	VMLEllipse.superclass.constructor.apply(this, arguments);","};","","VMLEllipse.NAME = \"vmlEllipse\";","","Y.extend(VMLEllipse, Y.VMLShape, {","	/**","	 * Indicates the type of shape","	 *","	 * @property _type","	 * @type String","     * @private","	 */","	_type: \"oval\"","});","VMLEllipse.ATTRS = Y.merge(Y.VMLShape.ATTRS, {","	/**","	 * Horizontal radius for the ellipse. ","	 *","	 * @config xRadius","	 * @type Number","	 */","	xRadius: {","		lazyAdd: false,","","		getter: function()","		{","			var val = this.get(\"width\");","			val = Math.round((val/2) * 100)/100;","			return val;","		},","		","		setter: function(val)","		{","			var w = val * 2; ","			this.set(\"width\", w);","			return val;","		}","	},","","	/**","	 * Vertical radius for the ellipse. ","	 *","	 * @config yRadius","	 * @type Number","	 * @readOnly","	 */","	yRadius: {","		lazyAdd: false,","		","		getter: function()","		{","			var val = this.get(\"height\");","			val = Math.round((val/2) * 100)/100;","			return val;","		},","","		setter: function(val)","		{","			var h = val * 2;","			this.set(\"height\", h);","			return val;","		}","	}","});","Y.VMLEllipse = VMLEllipse;","/**"," * <a href=\"http://www.w3.org/TR/NOTE-VML\">VML</a> implementation of the <a href=\"Circle.html\">`Circle`</a> class. "," * `VMLCircle` is not intended to be used directly. Instead, use the <a href=\"Circle.html\">`Circle`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> and <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> "," * capabilities, the <a href=\"Circle.html\">`Circle`</a> class will point to the `VMLCircle` class."," *"," * @module graphics"," * @class VMLCircle"," * @constructor"," */","VMLCircle = function(cfg)","{","	VMLCircle.superclass.constructor.apply(this, arguments);","};","","VMLCircle.NAME = \"vmlCircle\";","","Y.extend(VMLCircle, VMLShape, {","	/**","	 * Indicates the type of shape","	 *","	 * @property _type","	 * @type String","     * @private","	 */","	_type: \"oval\"","});","","VMLCircle.ATTRS = Y.merge(VMLShape.ATTRS, {","	/**","	 * Radius for the circle.","	 *","	 * @config radius","	 * @type Number","	 */","	radius: {","		lazyAdd: false,","","		value: 0","	},","","	/**","	 * Indicates the width of the shape","	 *","	 * @config width","	 * @type Number","	 */","	width: {","        setter: function(val)","        {","            this.set(\"radius\", val/2);","            return val;","        },","","		getter: function()","		{   ","			var radius = this.get(\"radius\"),","			val = radius && radius > 0 ? radius * 2 : 0;","			return val;","		}","	},","","	/**","	 * Indicates the height of the shape","	 *","	 * @config height","	 * @type Number","	 */","	height: {","        setter: function(val)","        {","            this.set(\"radius\", val/2);","            return val;","        },","","		getter: function()","		{   ","			var radius = this.get(\"radius\"),","			val = radius && radius > 0 ? radius * 2 : 0;","			return val;","		}","	}","});","Y.VMLCircle = VMLCircle;","/**"," * Draws pie slices"," *"," * @module graphics"," * @class VMLPieSlice"," * @constructor"," */","VMLPieSlice = function()","{","	VMLPieSlice.superclass.constructor.apply(this, arguments);","};","VMLPieSlice.NAME = \"vmlPieSlice\";","Y.extend(VMLPieSlice, Y.VMLShape, Y.mix({","    /**","     * Indicates the type of shape","     *","     * @property _type","     * @type String","     * @private","     */","    _type: \"shape\",","","	/**","	 * Change event listener","	 *","	 * @private","	 * @method _updateHandler","	 */","	_draw: function(e)","	{","        var x = this.get(\"cx\"),","            y = this.get(\"cy\"),","            startAngle = this.get(\"startAngle\"),","            arc = this.get(\"arc\"),","            radius = this.get(\"radius\");","        this.clear();","        this.drawWedge(x, y, startAngle, arc, radius);","		this.end();","	}"," }, Y.VMLDrawing.prototype));","VMLPieSlice.ATTRS = Y.mix({","    cx: {","        value: 0","    },","","    cy: {","        value: 0","    },","    /**","     * Starting angle in relation to a circle in which to begin the pie slice drawing.","     *","     * @config startAngle","     * @type Number","     */","    startAngle: {","        value: 0","    },","","    /**","     * Arc of the slice.","     *","     * @config arc","     * @type Number","     */","    arc: {","        value: 0","    },","","    /**","     * Radius of the circle in which the pie slice is drawn","     *","     * @config radius","     * @type Number","     */","    radius: {","        value: 0","    }","}, Y.VMLShape.ATTRS);","Y.VMLPieSlice = VMLPieSlice;","/**"," * <a href=\"http://www.w3.org/TR/NOTE-VML\">VML</a> implementation of the <a href=\"Graphic.html\">`Graphic`</a> class. "," * `VMLGraphic` is not intended to be used directly. Instead, use the <a href=\"Graphic.html\">`Graphic`</a> class. "," * If the browser lacks <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> and <a href=\"http://www.w3.org/TR/html5/the-canvas-element.html\">Canvas</a> "," * capabilities, the <a href=\"Graphic.html\">`Graphic`</a> class will point to the `VMLGraphic` class."," *"," * @module graphics"," * @class VMLGraphic"," * @constructor"," */","VMLGraphic = function() {","    VMLGraphic.superclass.constructor.apply(this, arguments);    ","};","","VMLGraphic.NAME = \"vmlGraphic\";","","VMLGraphic.ATTRS = {","    /**","     * Whether or not to render the `Graphic` automatically after to a specified parent node after init. This can be a Node instance or a CSS selector string.","     * ","     * @config render","     * @type Node | String ","     */","    render: {},","	","    /**","	 * Unique id for class instance.","	 *","	 * @config id","	 * @type String","	 */","	id: {","		valueFn: function()","		{","			return Y.guid();","		},","","		setter: function(val)","		{","			var node = this._node;","			if(node)","			{","				node.setAttribute(\"id\", val);","			}","			return val;","		}","	},","","    /**","     * Key value pairs in which a shape instance is associated with its id.","     *","     *  @config shapes","     *  @type Object","     *  @readOnly","     */","    shapes: {","        readOnly: true,","","        getter: function()","        {","            return this._shapes;","        }","    },","","    /**","     *  Object containing size and coordinate data for the content of a Graphic in relation to the coordSpace node.","     *","     *  @config contentBounds","     *  @type Object","     */","    contentBounds: {","        readOnly: true,","","        getter: function()","        {","            return this._contentBounds;","        }","    },","","    /**","     *  The html element that represents to coordinate system of the Graphic instance.","     *","     *  @config node","     *  @type HTMLElement","     */","    node: {","        readOnly: true,","","        getter: function()","        {","            return this._node;","        }","    },","","	/**","	 * Indicates the width of the `Graphic`. ","	 *","	 * @config width","	 * @type Number","	 */","    width: {","        setter: function(val)","        {","            if(this._node)","            {","                this._node.style.width = val + \"px\";","            }","            return val;","        }","    },","","	/**","	 * Indicates the height of the `Graphic`. ","	 *","	 * @config height ","	 * @type Number","	 */","    height: {","        setter: function(val)","        {","            if(this._node)","            {","                this._node.style.height = val + \"px\";","            }","            return val;","        }","    },","","    /**","     *  Determines the sizing of the Graphic. ","     *","     *  <dl>","     *      <dt>sizeContentToGraphic</dt><dd>The Graphic's width and height attributes are, either explicitly set through the <code>width</code> and <code>height</code>","     *      attributes or are determined by the dimensions of the parent element. The content contained in the Graphic will be sized to fit with in the Graphic instance's ","     *      dimensions. When using this setting, the <code>preserveAspectRatio</code> attribute will determine how the contents are sized.</dd>","     *      <dt>sizeGraphicToContent</dt><dd>(Also accepts a value of true) The Graphic's width and height are determined by the size and positioning of the content.</dd>","     *      <dt>false</dt><dd>The Graphic's width and height attributes are, either explicitly set through the <code>width</code> and <code>height</code>","     *      attributes or are determined by the dimensions of the parent element. The contents of the Graphic instance are not affected by this setting.</dd>","     *  </dl>","     *","     *","     *  @config autoSize","     *  @type Boolean | String","     *  @default false","     */","    autoSize: {","        value: false","    },","","    /**","     * Determines how content is sized when <code>autoSize</code> is set to <code>sizeContentToGraphic</code>.","     *","     *  <dl>","     *      <dt>none<dt><dd>Do not force uniform scaling. Scale the graphic content of the given element non-uniformly if necessary ","     *      such that the element's bounding box exactly matches the viewport rectangle.</dd>","     *      <dt>xMinYMin</dt><dd>Force uniform scaling position along the top left of the Graphic's node.</dd>","     *      <dt>xMidYMin</dt><dd>Force uniform scaling horizontally centered and positioned at the top of the Graphic's node.<dd>","     *      <dt>xMaxYMin</dt><dd>Force uniform scaling positioned horizontally from the right and vertically from the top.</dd>","     *      <dt>xMinYMid</dt>Force uniform scaling positioned horizontally from the left and vertically centered.</dd>","     *      <dt>xMidYMid (the default)</dt><dd>Force uniform scaling with the content centered.</dd>","     *      <dt>xMaxYMid</dt><dd>Force uniform scaling positioned horizontally from the right and vertically centered.</dd>","     *      <dt>xMinYMax</dt><dd>Force uniform scaling positioned horizontally from the left and vertically from the bottom.</dd>","     *      <dt>xMidYMax</dt><dd>Force uniform scaling horizontally centered and position vertically from the bottom.</dd>","     *      <dt>xMaxYMax</dt><dd>Force uniform scaling positioned horizontally from the right and vertically from the bottom.</dd>","     *  </dl>","     * ","     * @config preserveAspectRatio","     * @type String","     * @default xMidYMid","     */","    preserveAspectRatio: {","        value: \"xMidYMid\"","    },","","    /**","     * The contentBounds will resize to greater values but not values. (for performance)","     * When resizing the contentBounds down is desirable, set the resizeDown value to true.","     *","     * @config resizeDown ","     * @type Boolean","     */","    resizeDown: {","        getter: function()","        {","            return this._resizeDown;","        },","","        setter: function(val)","        {","            this._resizeDown = val;","            if(this._node)","            {","                this._redraw();","            }","            return val;","        }","    },","","	/**","	 * Indicates the x-coordinate for the instance.","	 *","	 * @config x","	 * @type Number","	 */","    x: {","        getter: function()","        {","            return this._x;","        },","","        setter: function(val)","        {","            this._x = val;","            if(this._node)","            {","                this._node.style.left = val + \"px\";","            }","            return val;","        }","    },","","	/**","	 * Indicates the y-coordinate for the instance.","	 *","	 * @config y","	 * @type Number","	 */","    y: {","        getter: function()","        {","            return this._y;","        },","","        setter: function(val)","        {","            this._y = val;","            if(this._node)","            {","                this._node.style.top = val + \"px\";","            }","            return val;","        }","    },","","    /**","     * Indicates whether or not the instance will automatically redraw after a change is made to a shape.","     * This property will get set to false when batching operations.","     *","     * @config autoDraw","     * @type Boolean","     * @default true","     * @private","     */","    autoDraw: {","        value: true","    },","","    visible: {","        value: true,","","        setter: function(val)","        {","            this._toggleVisible(val);","            return val;","        }","    }","};","","Y.extend(VMLGraphic, Y.GraphicBase, {","    /**","     * Storage for `x` attribute.","     *","     * @property _x","     * @type Number","     * @private","     */","    _x: 0,","","    /**","     * Storage for `y` attribute.","     *","     * @property _y","     * @type Number","     * @private","     */","    _y: 0,","","    /**","     * Gets the current position of the graphic instance in page coordinates.","     *","     * @method getXY","     * @return Array The XY position of the shape.","     */","    getXY: function()","    {","        var node = this.parentNode,","            x = this.get(\"x\"),","            y = this.get(\"y\"),","            xy;","        if(node)","        {","            xy = Y.one(node).getXY();","            xy[0] += x;","            xy[1] += y;","        }","        else","        {","            xy = Y.DOM._getOffset(this._node);","        }","        return xy;","    },","","    /**","     * @private","     * @property _resizeDown ","     * @type Boolean","     */","    _resizeDown: false,","","    /**","     * Initializes the class.","     *","     * @method initializer","     * @private","     */","    initializer: function(config) {","        var render = this.get(\"render\"),","            visibility = this.get(\"visible\") ? \"visible\" : \"hidden\";","        this._shapes = {};","		this._contentBounds = {","            left: 0,","            top: 0,","            right: 0,","            bottom: 0","        };","        this._node = DOCUMENT.createElement('div');","        this._node.style.position = \"absolute\";","        this._node.style.left = this.get(\"x\") + \"px\";","        this._node.style.top = this.get(\"y\") + \"px\";","        this._node.style.visibility = visibility;","        this._node.setAttribute(\"id\", this.get(\"id\"));","        this._contentNode = this._createGraphic();","        this._contentNode.style.position = \"absolute\";","        this._contentNode.style.left = \"0px\";","        this._contentNode.style.top = \"0px\";","        this._contentNode.style.visibility = visibility;","        this._node.appendChild(this._contentNode);","        if(render)","        {","            this.render(render);","        }","    },","    ","    /**","     * Adds the graphics node to the dom.","     * ","     * @method render","     * @param {HTMLElement} parentNode node in which to render the graphics node into.","     */","    render: function(render) {","        var parentNode = Y.one(render),","            w = this.get(\"width\") || parseInt(parentNode.getComputedStyle(\"width\"), 10),","            h = this.get(\"height\") || parseInt(parentNode.getComputedStyle(\"height\"), 10);","        parentNode = parentNode || DOCUMENT.body;","        parentNode.appendChild(this._node);","        this.parentNode = parentNode;","        this.set(\"width\", w);","        this.set(\"height\", h);","        return this;","    },","","    /**","     * Removes all nodes.","     *","     * @method destroy","     */","    destroy: function()","    {","        this.clear();","        Y.one(this._node).remove(true);","    },","","    /**","     * Generates a shape instance by type.","     *","     * @method addShape","     * @param {Object} cfg attributes for the shape","     * @return Shape","     */","    addShape: function(cfg)","    {","        cfg.graphic = this;","        if(!this.get(\"visible\"))","        {","            cfg.visible = false;","        }","        var shapeClass = this._getShapeClass(cfg.type),","            shape = new shapeClass(cfg);","        this._appendShape(shape);","        shape._appendStrokeAndFill();","        return shape;","    },","","    /**","     * Adds a shape instance to the graphic instance.","     *","     * @method _appendShape","     * @param {Shape} shape The shape instance to be added to the graphic.","     * @private","     */","    _appendShape: function(shape)","    {","        var node = shape.node,","            parentNode = this._frag || this._contentNode;","        if(this.get(\"autoDraw\")) ","        {","            parentNode.appendChild(node);","        }","        else","        {","            this._getDocFrag().appendChild(node);","        }","    },","","    /**","     * Removes a shape instance from from the graphic instance.","     *","     * @method removeShape","     * @param {Shape|String} shape The instance or id of the shape to be removed.","     */","    removeShape: function(shape)","    {","        if(!(shape instanceof VMLShape))","        {","            if(Y_LANG.isString(shape))","            {","                shape = this._shapes[shape];","            }","        }","        if(shape && (shape instanceof VMLShape))","        {","            shape._destroy();","            this._shapes[shape.get(\"id\")] = null;","            delete this._shapes[shape.get(\"id\")];","        }","        if(this.get(\"autoDraw\"))","        {","            this._redraw();","        }","    },","","    /**","     * Removes all shape instances from the dom.","     *","     * @method removeAllShapes","     */","    removeAllShapes: function()","    {","        var shapes = this._shapes,","            i;","        for(i in shapes)","        {","            if(shapes.hasOwnProperty(i))","            {","                shapes[i].destroy();","            }","        }","        this._shapes = {};","    },","","    /**","     * Removes all child nodes.","     *","     * @method _removeChildren","     * @param node","     * @private","     */","    _removeChildren: function(node)","    {","        if(node.hasChildNodes())","        {","            var child;","            while(node.firstChild)","            {","                child = node.firstChild;","                this._removeChildren(child);","                node.removeChild(child);","            }","        }","    },","","    /**","     * Clears the graphics object.","     *","     * @method clear","     */","    clear: function() {","        this.removeAllShapes();","        this._removeChildren(this._contentNode);","    },","","    /**","     * Toggles visibility","     *","     * @method _toggleVisible","     * @param {Boolean} val indicates visibilitye","     * @private","     */","    _toggleVisible: function(val)","    {","        var i,","            shapes = this._shapes,","            visibility = val ? \"visible\" : \"hidden\";","        if(shapes)","        {","            for(i in shapes)","            {","                if(shapes.hasOwnProperty(i))","                {","                    shapes[i].set(\"visible\", val);","                }","            }","        }","        if(this._contentNode)","        {","            this._contentNode.style.visibility = visibility;","        }","        if(this._node)","        {","            this._node.style.visibility = visibility;","        }","    },","","    /**","     * Sets the size of the graphics object.","     * ","     * @method setSize","     * @param w {Number} width to set for the instance.","     * @param h {Number} height to set for the instance.","     */","    setSize: function(w, h) {","        w = Math.round(w);","        h = Math.round(h);","        this._node.style.width = w + 'px';","        this._node.style.height = h + 'px';","    },","","    /**","     * Sets the positon of the graphics object.","     *","     * @method setPosition","     * @param {Number} x x-coordinate for the object.","     * @param {Number} y y-coordinate for the object.","     */","    setPosition: function(x, y)","    {","        x = Math.round(x);","        y = Math.round(y);","        this._node.style.left = x + \"px\";","        this._node.style.top = y + \"px\";","    },","","    /**","     * Creates a group element","     *","     * @method _createGraphic","     * @private","     */","    _createGraphic: function() {","        var group = DOCUMENT.createElement('<group xmlns=\"urn:schemas-microsft.com:vml\" style=\"behavior:url(#default#VML);display:block;position:absolute;top:0px;left:0px;zoom:1;\" />');","        return group;","    },","","    /**","     * Creates a graphic node","     *","     * @method _createGraphicNode","     * @param {String} type node type to create","     * @param {String} pe specified pointer-events value","     * @return HTMLElement","     * @private","     */","    _createGraphicNode: function(type)","    {","        return DOCUMENT.createElement('<' + type + ' xmlns=\"urn:schemas-microsft.com:vml\" style=\"behavior:url(#default#VML);display:inline-block;zoom:1;\" />');","    ","    },","","    /**","     * Returns a shape based on the id of its dom node.","     *","     * @method getShapeById","     * @param {String} id Dom id of the shape's node attribute.","     * @return Shape","     */","    getShapeById: function(id)","    {","        return this._shapes[id];","    },","","    /**","     * Returns a shape class. Used by `addShape`. ","     *","     * @method _getShapeClass","     * @param {Shape | String} val Indicates which shape class. ","     * @return Function ","     * @private","     */","    _getShapeClass: function(val)","    {","        var shape = this._shapeClass[val];","        if(shape)","        {","            return shape;","        }","        return val;","    },","","    /**","     * Look up for shape classes. Used by `addShape` to retrieve a class for instantiation.","     *","     * @property _shapeClass","     * @type Object","     * @private","     */","    _shapeClass: {","        circle: Y.VMLCircle,","        rect: Y.VMLRect,","        path: Y.VMLPath,","        ellipse: Y.VMLEllipse,","        pieslice: Y.VMLPieSlice","    },","","	/**","	 * Allows for creating multiple shapes in order to batch appending and redraw operations.","	 *","	 * @method batch","	 * @param {Function} method Method to execute.","	 */","    batch: function(method)","    {","        var autoDraw = this.get(\"autoDraw\");","        this.set(\"autoDraw\", false);","        method.apply();","        this._redraw();","        this.set(\"autoDraw\", autoDraw);","    },","    ","    /**","     * Returns a document fragment to for attaching shapes.","     *","     * @method _getDocFrag","     * @return DocumentFragment","     * @private","     */","    _getDocFrag: function()","    {","        if(!this._frag)","        {","            this._frag = DOCUMENT.createDocumentFragment();","        }","        return this._frag;","    },","","    /**","     * Adds a shape to the redraw queue and calculates the contentBounds. ","     *","     * @method addToRedrawQueue","     * @param shape {VMLShape}","     * @protected","     */","    addToRedrawQueue: function(shape)","    {","        var shapeBox,","            box;","        this._shapes[shape.get(\"id\")] = shape;","        if(!this._resizeDown)","        {","            shapeBox = shape.getBounds();","            box = this._contentBounds;","            box.left = box.left < shapeBox.left ? box.left : shapeBox.left;","            box.top = box.top < shapeBox.top ? box.top : shapeBox.top;","            box.right = box.right > shapeBox.right ? box.right : shapeBox.right;","            box.bottom = box.bottom > shapeBox.bottom ? box.bottom : shapeBox.bottom;","            box.width = box.right - box.left;","            box.height = box.bottom - box.top;","            this._contentBounds = box;","        }","        if(this.get(\"autoDraw\")) ","        {","            this._redraw();","        }","    },","","    /**","     * Redraws all shapes.","     *","     * @method _redraw","     * @private","     */","    _redraw: function()","    {","        var autoSize = this.get(\"autoSize\"),","            preserveAspectRatio,","            nodeWidth,","            nodeHeight,","            xCoordOrigin = 0,","            yCoordOrigin = 0,","            box = this._resizeDown ? this._getUpdatedContentBounds() : this._contentBounds,","            left = box.left,","            right = box.right,","            top = box.top,","            bottom = box.bottom,","            contentWidth = box.width,","            contentHeight = box.height,","            aspectRatio,","            xCoordSize,","            yCoordSize,","            scaledWidth,","            scaledHeight;","        if(autoSize)","        {","            if(autoSize == \"sizeContentToGraphic\")","            {","                preserveAspectRatio = this.get(\"preserveAspectRatio\");","                contentWidth = box.width;","                contentHeight = box.height;","                nodeWidth = this.get(\"width\");","                nodeHeight = this.get(\"height\");","                if(preserveAspectRatio == \"none\" || contentWidth/contentHeight === nodeWidth/nodeHeight)","                {","                    xCoordOrigin = left;","                    yCoordOrigin = top;","                    xCoordSize = contentWidth;","                    yCoordSize = contentHeight;","                }","                else ","                {","                    if(contentWidth * nodeHeight/contentHeight > nodeWidth)","                    {","                        aspectRatio = nodeHeight/nodeWidth;","                        xCoordSize = contentWidth;","                        yCoordSize = contentWidth * aspectRatio;","                        scaledHeight = (nodeWidth * (contentHeight/contentWidth)) * (yCoordSize/nodeHeight);","                        yCoordOrigin = this._calculateCoordOrigin(preserveAspectRatio.slice(5).toLowerCase(), scaledHeight, yCoordSize);","                        yCoordOrigin = top + yCoordOrigin;","                        xCoordOrigin = left;","                    }","                    else","                    {","                        aspectRatio = nodeWidth/nodeHeight;","                        xCoordSize = contentHeight * aspectRatio;","                        yCoordSize = contentHeight;","                        scaledWidth = (nodeHeight * (contentWidth/contentHeight)) * (xCoordSize/nodeWidth);","                        xCoordOrigin = this._calculateCoordOrigin(preserveAspectRatio.slice(1, 4).toLowerCase(), scaledWidth, xCoordSize);","                        xCoordOrigin = xCoordOrigin + left;","                        yCoordOrigin = top;","                    }","                }","                this._contentNode.style.width = nodeWidth + \"px\";","                this._contentNode.style.height = nodeHeight + \"px\";","                this._contentNode.coordOrigin = xCoordOrigin + \", \" + yCoordOrigin;","            }","            else ","            {","                xCoordSize = contentWidth;","                yCoordSize = contentHeight;","                this._contentNode.style.width = contentWidth + \"px\";","                this._contentNode.style.height = contentHeight + \"px\";","                this._state.width = contentWidth;","                this._state.height =  contentHeight;","                if(this._node)","                {","                    this._node.style.width = contentWidth + \"px\";","                    this._node.style.height = contentHeight + \"px\";","                }","","            }","            this._contentNode.coordSize = xCoordSize + \", \" + yCoordSize;","        }","        else","        {","            this._contentNode.style.width = right + \"px\";","            this._contentNode.style.height = bottom + \"px\";","            this._contentNode.coordSize = right + \", \" + bottom;","        }","        if(this._frag)","        {","            this._contentNode.appendChild(this._frag);","            this._frag = null;","        }","    },","    ","    /**","     * Determines the value for either an x or y coordinate to be used for the <code>coordOrigin</code> of the Graphic.","     *","     * @method _calculateCoordOrigin","     * @param {String} position The position for placement. Possible values are min, mid and max.","     * @param {Number} size The total scaled size of the content.","     * @param {Number} coordsSize The coordsSize for the Graphic.","     * @return Number","     * @private","     */","    _calculateCoordOrigin: function(position, size, coordsSize)","    {","        var coord;","        switch(position)","        {","            case \"min\" :","                coord = 0;","            break;","            case \"mid\" :","                coord = (size - coordsSize)/2;","            break;","            case \"max\" :","                coord = (size - coordsSize);","            break;","        }","        return coord;","    },","","    /**","     * Recalculates and returns the `contentBounds` for the `Graphic` instance.","     *","     * @method _getUpdatedContentBounds","     * @return {Object} ","     * @private","     */","    _getUpdatedContentBounds: function()","    {","        var bounds,","            i,","            shape,","            queue = this._shapes,","            box = {","                left: 0,","                top: 0,","                right: 0,","                bottom: 0","            };","        for(i in queue)","        {","            if(queue.hasOwnProperty(i))","            {","                shape = queue[i];","                bounds = shape.getBounds();","                box.left = Math.min(box.left, bounds.left);","                box.top = Math.min(box.top, bounds.top);","                box.right = Math.max(box.right, bounds.right);","                box.bottom = Math.max(box.bottom, bounds.bottom);","            }","        }","        box.width = box.right - box.left;","        box.height = box.bottom - box.top;","        this._contentBounds = box;","        return box;","    }","});","Y.VMLGraphic = VMLGraphic;","","","","}, '@VERSION@', {\"requires\": [\"graphics\"]});"];
_yuitest_coverage["graphics-vml"].lines = {"1":0,"3":0,"21":0,"33":0,"53":0,"65":0,"66":0,"68":0,"69":0,"71":0,"104":0,"111":0,"112":0,"113":0,"114":0,"115":0,"116":0,"117":0,"118":0,"119":0,"120":0,"121":0,"134":0,"140":0,"153":0,"154":0,"155":0,"156":0,"157":0,"158":0,"159":0,"160":0,"175":0,"176":0,"177":0,"178":0,"179":0,"180":0,"181":0,"182":0,"183":0,"184":0,"197":0,"201":0,"202":0,"203":0,"204":0,"205":0,"206":0,"220":0,"224":0,"225":0,"226":0,"227":0,"228":0,"229":0,"244":0,"246":0,"247":0,"248":0,"249":0,"250":0,"251":0,"268":0,"269":0,"271":0,"273":0,"274":0,"275":0,"276":0,"277":0,"278":0,"279":0,"280":0,"281":0,"282":0,"293":0,"297":0,"298":0,"300":0,"301":0,"302":0,"303":0,"304":0,"305":0,"307":0,"308":0,"319":0,"320":0,"321":0,"322":0,"333":0,"341":0,"342":0,"343":0,"345":0,"347":0,"349":0,"351":0,"354":0,"356":0,"358":0,"360":0,"361":0,"362":0,"363":0,"364":0,"366":0,"367":0,"368":0,"378":0,"388":0,"398":0,"399":0,"400":0,"401":0,"402":0,"403":0,"404":0,"405":0,"418":0,"423":0,"424":0,"427":0,"428":0,"429":0,"430":0,"433":0,"447":0,"455":0,"457":0,"458":0,"459":0,"460":0,"461":0,"463":0,"464":0,"465":0,"466":0,"467":0,"468":0,"480":0,"481":0,"483":0,"485":0,"487":0,"489":0,"491":0,"493":0,"495":0,"496":0,"511":0,"523":0,"525":0,"526":0,"527":0,"528":0,"531":0,"533":0,"552":0,"563":0,"565":0,"566":0,"568":0,"570":0,"583":0,"584":0,"586":0,"590":0,"591":0,"594":0,"595":0,"596":0,"608":0,"610":0,"612":0,"614":0,"627":0,"646":0,"647":0,"648":0,"649":0,"650":0,"652":0,"654":0,"656":0,"657":0,"658":0,"659":0,"660":0,"661":0,"663":0,"664":0,"665":0,"667":0,"669":0,"671":0,"673":0,"675":0,"677":0,"679":0,"681":0,"682":0,"683":0,"687":0,"689":0,"691":0,"693":0,"694":0,"696":0,"698":0,"700":0,"704":0,"705":0,"707":0,"709":0,"710":0,"711":0,"722":0,"723":0,"734":0,"735":0,"746":0,"750":0,"762":0,"764":0,"765":0,"777":0,"788":0,"790":0,"802":0,"815":0,"825":0,"827":0,"828":0,"829":0,"830":0,"832":0,"834":0,"835":0,"836":0,"837":0,"838":0,"839":0,"840":0,"841":0,"842":0,"843":0,"844":0,"846":0,"847":0,"848":0,"850":0,"851":0,"854":0,"856":0,"860":0,"861":0,"863":0,"864":0,"867":0,"869":0,"880":0,"882":0,"884":0,"894":0,"896":0,"897":0,"898":0,"900":0,"902":0,"903":0,"904":0,"905":0,"906":0,"907":0,"908":0,"909":0,"910":0,"912":0,"913":0,"915":0,"916":0,"917":0,"919":0,"920":0,"921":0,"923":0,"924":0,"927":0,"929":0,"933":0,"934":0,"936":0,"937":0,"940":0,"941":0,"945":0,"947":0,"949":0,"951":0,"964":0,"971":0,"973":0,"975":0,"977":0,"978":0,"979":0,"980":0,"981":0,"982":0,"984":0,"986":0,"989":0,"990":0,"992":0,"994":0,"995":0,"996":0,"997":0,"999":0,"1000":0,"1001":0,"1003":0,"1007":0,"1009":0,"1020":0,"1022":0,"1024":0,"1031":0,"1033":0,"1035":0,"1036":0,"1037":0,"1039":0,"1041":0,"1043":0,"1045":0,"1049":0,"1056":0,"1057":0,"1059":0,"1061":0,"1064":0,"1065":0,"1066":0,"1069":0,"1071":0,"1072":0,"1073":0,"1074":0,"1076":0,"1077":0,"1079":0,"1081":0,"1083":0,"1087":0,"1088":0,"1089":0,"1092":0,"1094":0,"1095":0,"1099":0,"1100":0,"1106":0,"1108":0,"1109":0,"1123":0,"1145":0,"1147":0,"1149":0,"1151":0,"1153":0,"1157":0,"1159":0,"1160":0,"1162":0,"1164":0,"1165":0,"1166":0,"1167":0,"1168":0,"1169":0,"1170":0,"1171":0,"1172":0,"1173":0,"1174":0,"1176":0,"1177":0,"1178":0,"1179":0,"1180":0,"1181":0,"1182":0,"1183":0,"1184":0,"1185":0,"1186":0,"1188":0,"1190":0,"1192":0,"1193":0,"1206":0,"1207":0,"1208":0,"1209":0,"1210":0,"1212":0,"1224":0,"1237":0,"1239":0,"1241":0,"1243":0,"1247":0,"1248":0,"1251":0,"1252":0,"1253":0,"1255":0,"1256":0,"1258":0,"1259":0,"1262":0,"1264":0,"1266":0,"1273":0,"1274":0,"1276":0,"1278":0,"1279":0,"1281":0,"1282":0,"1284":0,"1286":0,"1288":0,"1291":0,"1292":0,"1305":0,"1307":0,"1308":0,"1347":0,"1348":0,"1349":0,"1361":0,"1362":0,"1374":0,"1375":0,"1387":0,"1398":0,"1409":0,"1420":0,"1431":0,"1445":0,"1447":0,"1449":0,"1470":0,"1472":0,"1473":0,"1474":0,"1475":0,"1476":0,"1477":0,"1490":0,"1491":0,"1502":0,"1521":0,"1540":0,"1541":0,"1542":0,"1544":0,"1559":0,"1564":0,"1566":0,"1567":0,"1568":0,"1569":0,"1571":0,"1586":0,"1597":0,"1599":0,"1601":0,"1602":0,"1603":0,"1604":0,"1606":0,"1607":0,"1608":0,"1610":0,"1613":0,"1614":0,"1616":0,"1618":0,"1619":0,"1629":0,"1630":0,"1632":0,"1636":0,"1648":0,"1650":0,"1652":0,"1653":0,"1655":0,"1657":0,"1658":0,"1660":0,"1665":0,"1676":0,"1712":0,"1715":0,"1716":0,"1717":0,"1718":0,"1719":0,"1721":0,"1723":0,"1724":0,"1729":0,"1762":0,"1767":0,"1768":0,"1770":0,"1772":0,"1802":0,"1804":0,"1806":0,"1808":0,"1860":0,"1864":0,"1867":0,"1869":0,"1871":0,"1873":0,"1875":0,"1879":0,"1880":0,"1882":0,"1884":0,"1887":0,"1888":0,"1925":0,"1929":0,"1931":0,"1933":0,"1934":0,"1936":0,"1939":0,"1941":0,"1943":0,"1947":0,"1948":0,"1949":0,"1980":0,"1995":0,"1999":0,"2010":0,"2012":0,"2015":0,"2016":0,"2024":0,"2025":0,"2028":0,"2038":0,"2039":0,"2052":0,"2068":0,"2072":0,"2083":0,"2085":0,"2087":0,"2088":0,"2098":0,"2099":0,"2110":0,"2112":0,"2115":0,"2117":0,"2127":0,"2139":0,"2140":0,"2141":0,"2146":0,"2147":0,"2148":0,"2164":0,"2165":0,"2166":0,"2171":0,"2172":0,"2173":0,"2177":0,"2188":0,"2190":0,"2193":0,"2195":0,"2206":0,"2228":0,"2229":0,"2234":0,"2236":0,"2249":0,"2250":0,"2255":0,"2257":0,"2261":0,"2269":0,"2271":0,"2273":0,"2274":0,"2292":0,"2297":0,"2298":0,"2299":0,"2302":0,"2340":0,"2351":0,"2352":0,"2355":0,"2357":0,"2375":0,"2380":0,"2381":0,"2383":0,"2385":0,"2401":0,"2416":0,"2431":0,"2444":0,"2446":0,"2448":0,"2461":0,"2463":0,"2465":0,"2525":0,"2530":0,"2531":0,"2533":0,"2535":0,"2548":0,"2553":0,"2554":0,"2556":0,"2558":0,"2571":0,"2576":0,"2577":0,"2579":0,"2581":0,"2603":0,"2604":0,"2609":0,"2636":0,"2640":0,"2642":0,"2643":0,"2644":0,"2648":0,"2650":0,"2667":0,"2669":0,"2670":0,"2676":0,"2677":0,"2678":0,"2679":0,"2680":0,"2681":0,"2682":0,"2683":0,"2684":0,"2685":0,"2686":0,"2687":0,"2688":0,"2690":0,"2701":0,"2704":0,"2705":0,"2706":0,"2707":0,"2708":0,"2709":0,"2719":0,"2720":0,"2732":0,"2733":0,"2735":0,"2737":0,"2739":0,"2740":0,"2741":0,"2753":0,"2755":0,"2757":0,"2761":0,"2773":0,"2775":0,"2777":0,"2780":0,"2782":0,"2783":0,"2784":0,"2786":0,"2788":0,"2799":0,"2801":0,"2803":0,"2805":0,"2808":0,"2820":0,"2822":0,"2823":0,"2825":0,"2826":0,"2827":0,"2838":0,"2839":0,"2851":0,"2854":0,"2856":0,"2858":0,"2860":0,"2864":0,"2866":0,"2868":0,"2870":0,"2882":0,"2883":0,"2884":0,"2885":0,"2897":0,"2898":0,"2899":0,"2900":0,"2910":0,"2911":0,"2925":0,"2938":0,"2951":0,"2952":0,"2954":0,"2956":0,"2982":0,"2983":0,"2984":0,"2985":0,"2986":0,"2998":0,"3000":0,"3002":0,"3014":0,"3016":0,"3017":0,"3019":0,"3020":0,"3021":0,"3022":0,"3023":0,"3024":0,"3025":0,"3026":0,"3027":0,"3029":0,"3031":0,"3043":0,"3061":0,"3063":0,"3065":0,"3066":0,"3067":0,"3068":0,"3069":0,"3070":0,"3072":0,"3073":0,"3074":0,"3075":0,"3079":0,"3081":0,"3082":0,"3083":0,"3084":0,"3085":0,"3086":0,"3087":0,"3091":0,"3092":0,"3093":0,"3094":0,"3095":0,"3096":0,"3097":0,"3100":0,"3101":0,"3102":0,"3106":0,"3107":0,"3108":0,"3109":0,"3110":0,"3111":0,"3112":0,"3114":0,"3115":0,"3119":0,"3123":0,"3124":0,"3125":0,"3127":0,"3129":0,"3130":0,"3146":0,"3147":0,"3150":0,"3151":0,"3153":0,"3154":0,"3156":0,"3157":0,"3159":0,"3171":0,"3181":0,"3183":0,"3185":0,"3186":0,"3187":0,"3188":0,"3189":0,"3190":0,"3193":0,"3194":0,"3195":0,"3196":0,"3199":0};
_yuitest_coverage["graphics-vml"].functions = {"VMLDrawing:21":0,"_round:51":0,"_addToPath:63":0,"curveTo:103":0,"quadraticCurveTo:133":0,"drawRect:152":0,"drawRoundRect:174":0,"drawCircle:196":0,"drawEllipse:219":0,"drawDiamond:242":0,"drawWedge:266":0,"lineTo:292":0,"moveTo:318":0,"_closePath:331":0,"end:376":0,"closePath:386":0,"clear:396":0,"getBezierData:417":0,"_setCurveBoundingBox:445":0,"_trackSize:479":0,"VMLShape:523":0,"init:550":0,"initializer:561":0,"_setGraphic:581":0,"_appendStrokeAndFill:606":0,"createNode:625":0,"addClass:720":0,"removeClass:732":0,"getXY:744":0,"setXY:760":0,"contains:775":0,"compareTo:787":0,"test:800":0,"_getStrokeProps:813":0,"_strokeChangeHandler:878":0,"_getFillProps:962":0,"_fillChangeHandler:1018":0,"_updateFillNode:1104":0,"_getGradientFill:1121":0,"_addTransform:1204":0,"_updateTransform:1222":0,"_getSkewOffsetValue:1303":0,"translate:1345":0,"translateX:1359":0,"translateY:1372":0,"skew:1385":0,"skewX:1396":0,"skewY:1407":0,"rotate:1418":0,"scale:1429":0,"on:1443":0,"_updateHandler:1468":0,"_createGraphicNode:1488":0,"_getDefaultFill:1501":0,"_getDefaultStroke:1519":0,"set:1538":0,"getBounds:1557":0,"_getContentRect:1584":0,"destroy:1627":0,"_destroy:1646":0,"valueFn:1674":0,"setter:1710":0,"getter:1727":0,"valueFn:1760":0,"setter:1765":0,"setter:1801":0,"setter:1858":0,"setter:1923":0,"getter:1978":0,"getter:1993":0,"VMLPath:2010":0,"end:2022":0,"getter:2036":0,"getter:2050":0,"getter:2066":0,"VMLRect:2083":0,"VMLEllipse:2110":0,"getter:2137":0,"setter:2144":0,"getter:2162":0,"setter:2169":0,"VMLCircle:2188":0,"setter:2226":0,"getter:2232":0,"setter:2247":0,"getter:2253":0,"VMLPieSlice:2269":0,"_draw:2290":0,"VMLGraphic:2351":0,"valueFn:2373":0,"setter:2378":0,"getter:2399":0,"getter:2414":0,"getter:2429":0,"setter:2442":0,"setter:2459":0,"getter:2523":0,"setter:2528":0,"getter:2546":0,"setter:2551":0,"getter:2569":0,"setter:2574":0,"setter:2601":0,"getXY:2634":0,"initializer:2666":0,"render:2700":0,"destroy:2717":0,"addShape:2730":0,"_appendShape:2751":0,"removeShape:2771":0,"removeAllShapes:2797":0,"_removeChildren:2818":0,"clear:2837":0,"_toggleVisible:2849":0,"setSize:2881":0,"setPosition:2895":0,"_createGraphic:2909":0,"_createGraphicNode:2923":0,"getShapeById:2936":0,"_getShapeClass:2949":0,"batch:2980":0,"_getDocFrag:2996":0,"addToRedrawQueue:3012":0,"_redraw:3041":0,"_calculateCoordOrigin:3144":0,"_getUpdatedContentBounds:3169":0,"(anonymous 1):1":0};
_yuitest_coverage["graphics-vml"].coveredLines = 834;
_yuitest_coverage["graphics-vml"].coveredFunctions = 127;
_yuitest_coverline("graphics-vml", 1);
YUI.add('graphics-vml', function (Y, NAME) {

_yuitest_coverfunc("graphics-vml", "(anonymous 1)", 1);
_yuitest_coverline("graphics-vml", 3);
var SHAPE = "vmlShape",
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

_yuitest_coverline("graphics-vml", 21);
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
_yuitest_coverline("graphics-vml", 33);
VMLDrawing.prototype = {
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
        _yuitest_coverfunc("graphics-vml", "_round", 51);
_yuitest_coverline("graphics-vml", 53);
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
        _yuitest_coverfunc("graphics-vml", "_addToPath", 63);
_yuitest_coverline("graphics-vml", 65);
this._path = this._path || "";
        _yuitest_coverline("graphics-vml", 66);
if(this._movePath)
        {
            _yuitest_coverline("graphics-vml", 68);
this._path += this._movePath;
            _yuitest_coverline("graphics-vml", 69);
this._movePath = null;
        }
        _yuitest_coverline("graphics-vml", 71);
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
    curveTo: function(cp1x, cp1y, cp2x, cp2y, x, y) {
        _yuitest_coverfunc("graphics-vml", "curveTo", 103);
_yuitest_coverline("graphics-vml", 104);
var w,
            h,
            pts,
            right,
            left,
            bottom,
            top;
        _yuitest_coverline("graphics-vml", 111);
this._addToPath(" c " + this._round(cp1x) + ", " + this._round(cp1y) + ", " + this._round(cp2x) + ", " + this._round(cp2y) + ", " + this._round(x) + ", " + this._round(y));
        _yuitest_coverline("graphics-vml", 112);
right = Math.max(x, Math.max(cp1x, cp2x));
        _yuitest_coverline("graphics-vml", 113);
bottom = Math.max(y, Math.max(cp1y, cp2y));
        _yuitest_coverline("graphics-vml", 114);
left = Math.min(x, Math.min(cp1x, cp2x));
        _yuitest_coverline("graphics-vml", 115);
top = Math.min(y, Math.min(cp1y, cp2y));
        _yuitest_coverline("graphics-vml", 116);
w = Math.abs(right - left);
        _yuitest_coverline("graphics-vml", 117);
h = Math.abs(bottom - top);
        _yuitest_coverline("graphics-vml", 118);
pts = [[this._currentX, this._currentY] , [cp1x, cp1y], [cp2x, cp2y], [x, y]]; 
        _yuitest_coverline("graphics-vml", 119);
this._setCurveBoundingBox(pts, w, h);
        _yuitest_coverline("graphics-vml", 120);
this._currentX = x;
        _yuitest_coverline("graphics-vml", 121);
this._currentY = y;
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
        _yuitest_coverfunc("graphics-vml", "quadraticCurveTo", 133);
_yuitest_coverline("graphics-vml", 134);
var currentX = this._currentX,
            currentY = this._currentY,
            cp1x = currentX + 0.67*(cpx - currentX),
            cp1y = currentY + 0.67*(cpy - currentY),
            cp2x = cp1x + (x - currentX) * 0.34,
            cp2y = cp1y + (y - currentY) * 0.34;
        _yuitest_coverline("graphics-vml", 140);
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
        _yuitest_coverfunc("graphics-vml", "drawRect", 152);
_yuitest_coverline("graphics-vml", 153);
this.moveTo(x, y);
        _yuitest_coverline("graphics-vml", 154);
this.lineTo(x + w, y);
        _yuitest_coverline("graphics-vml", 155);
this.lineTo(x + w, y + h);
        _yuitest_coverline("graphics-vml", 156);
this.lineTo(x, y + h);
        _yuitest_coverline("graphics-vml", 157);
this.lineTo(x, y);
        _yuitest_coverline("graphics-vml", 158);
this._currentX = x;
        _yuitest_coverline("graphics-vml", 159);
this._currentY = y;
        _yuitest_coverline("graphics-vml", 160);
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
        _yuitest_coverfunc("graphics-vml", "drawRoundRect", 174);
_yuitest_coverline("graphics-vml", 175);
this.moveTo(x, y + eh);
        _yuitest_coverline("graphics-vml", 176);
this.lineTo(x, y + h - eh);
        _yuitest_coverline("graphics-vml", 177);
this.quadraticCurveTo(x, y + h, x + ew, y + h);
        _yuitest_coverline("graphics-vml", 178);
this.lineTo(x + w - ew, y + h);
        _yuitest_coverline("graphics-vml", 179);
this.quadraticCurveTo(x + w, y + h, x + w, y + h - eh);
        _yuitest_coverline("graphics-vml", 180);
this.lineTo(x + w, y + eh);
        _yuitest_coverline("graphics-vml", 181);
this.quadraticCurveTo(x + w, y, x + w - ew, y);
        _yuitest_coverline("graphics-vml", 182);
this.lineTo(x + ew, y);
        _yuitest_coverline("graphics-vml", 183);
this.quadraticCurveTo(x, y, x, y + eh);
        _yuitest_coverline("graphics-vml", 184);
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
        _yuitest_coverfunc("graphics-vml", "drawCircle", 196);
_yuitest_coverline("graphics-vml", 197);
var startAngle = 0,
            endAngle = 360,
            circum = radius * 2;

        _yuitest_coverline("graphics-vml", 201);
endAngle *= 65535;
        _yuitest_coverline("graphics-vml", 202);
this._drawingComplete = false;
        _yuitest_coverline("graphics-vml", 203);
this._trackSize(x + circum, y + circum);
        _yuitest_coverline("graphics-vml", 204);
this.moveTo((x + circum), (y + radius));
        _yuitest_coverline("graphics-vml", 205);
this._addToPath(" ae " + this._round(x + radius) + ", " + this._round(y + radius) + ", " + this._round(radius) + ", " + this._round(radius) + ", " + startAngle + ", " + endAngle);
        _yuitest_coverline("graphics-vml", 206);
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
        _yuitest_coverfunc("graphics-vml", "drawEllipse", 219);
_yuitest_coverline("graphics-vml", 220);
var startAngle = 0,
            endAngle = 360,
            radius = w * 0.5,
            yRadius = h * 0.5;
        _yuitest_coverline("graphics-vml", 224);
endAngle *= 65535;
        _yuitest_coverline("graphics-vml", 225);
this._drawingComplete = false;
        _yuitest_coverline("graphics-vml", 226);
this._trackSize(x + w, y + h);
        _yuitest_coverline("graphics-vml", 227);
this.moveTo((x + w), (y + yRadius));
        _yuitest_coverline("graphics-vml", 228);
this._addToPath(" ae " + this._round(x + radius) + ", " + this._round(x + radius) + ", " + this._round(y + yRadius) + ", " + this._round(radius) + ", " + this._round(yRadius) + ", " + startAngle + ", " + endAngle);
        _yuitest_coverline("graphics-vml", 229);
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
        _yuitest_coverfunc("graphics-vml", "drawDiamond", 242);
_yuitest_coverline("graphics-vml", 244);
var midWidth = width * 0.5,
            midHeight = height * 0.5;
        _yuitest_coverline("graphics-vml", 246);
this.moveTo(x + midWidth, y);
        _yuitest_coverline("graphics-vml", 247);
this.lineTo(x + width, y + midHeight);
        _yuitest_coverline("graphics-vml", 248);
this.lineTo(x + midWidth, y + height);
        _yuitest_coverline("graphics-vml", 249);
this.lineTo(x, y + midHeight);
        _yuitest_coverline("graphics-vml", 250);
this.lineTo(x + midWidth, y);
        _yuitest_coverline("graphics-vml", 251);
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
        _yuitest_coverfunc("graphics-vml", "drawWedge", 266);
_yuitest_coverline("graphics-vml", 268);
var diameter = radius * 2;
        _yuitest_coverline("graphics-vml", 269);
if(Math.abs(arc) > 360)
        {
            _yuitest_coverline("graphics-vml", 271);
arc = 360;
        }
        _yuitest_coverline("graphics-vml", 273);
this._currentX = x;
        _yuitest_coverline("graphics-vml", 274);
this._currentY = y;
        _yuitest_coverline("graphics-vml", 275);
startAngle *= -65535;
        _yuitest_coverline("graphics-vml", 276);
arc *= 65536;
        _yuitest_coverline("graphics-vml", 277);
startAngle = Math.round(startAngle);
        _yuitest_coverline("graphics-vml", 278);
arc = Math.round(arc);
        _yuitest_coverline("graphics-vml", 279);
this.moveTo(x, y);
        _yuitest_coverline("graphics-vml", 280);
this._addToPath(" ae " + this._round(x) + ", " + this._round(y) + ", " + this._round(radius) + " " + this._round(radius) + ", " +  startAngle + ", " + arc);
        _yuitest_coverline("graphics-vml", 281);
this._trackSize(diameter, diameter); 
        _yuitest_coverline("graphics-vml", 282);
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
        _yuitest_coverfunc("graphics-vml", "lineTo", 292);
_yuitest_coverline("graphics-vml", 293);
var args = arguments,
            i,
            len,
            path = ' l ';
        _yuitest_coverline("graphics-vml", 297);
if (typeof point1 === 'string' || typeof point1 === 'number') {
            _yuitest_coverline("graphics-vml", 298);
args = [[point1, point2]];
        }
        _yuitest_coverline("graphics-vml", 300);
len = args.length;
        _yuitest_coverline("graphics-vml", 301);
for (i = 0; i < len; ++i) {
            _yuitest_coverline("graphics-vml", 302);
path += ' ' + this._round(args[i][0]) + ', ' + this._round(args[i][1]);
            _yuitest_coverline("graphics-vml", 303);
this._trackSize.apply(this, args[i]);
            _yuitest_coverline("graphics-vml", 304);
this._currentX = args[i][0];
            _yuitest_coverline("graphics-vml", 305);
this._currentY = args[i][1];
        }
        _yuitest_coverline("graphics-vml", 307);
this._addToPath(path);
        _yuitest_coverline("graphics-vml", 308);
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
        _yuitest_coverfunc("graphics-vml", "moveTo", 318);
_yuitest_coverline("graphics-vml", 319);
this._movePath = " m " + this._round(x) + ", " + this._round(y);
        _yuitest_coverline("graphics-vml", 320);
this._trackSize(x, y);
        _yuitest_coverline("graphics-vml", 321);
this._currentX = x;
        _yuitest_coverline("graphics-vml", 322);
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
        _yuitest_coverfunc("graphics-vml", "_closePath", 331);
_yuitest_coverline("graphics-vml", 333);
var fill = this.get("fill"),
            stroke = this.get("stroke"),
            node = this.node,
            w = this.get("width"),
            h = this.get("height"),
            path = this._path,
            pathEnd = "",
            multiplier = this._coordSpaceMultiplier;
        _yuitest_coverline("graphics-vml", 341);
this._fillChangeHandler();
        _yuitest_coverline("graphics-vml", 342);
this._strokeChangeHandler();
        _yuitest_coverline("graphics-vml", 343);
if(path)
        {
            _yuitest_coverline("graphics-vml", 345);
if(fill && fill.color)
            {
                _yuitest_coverline("graphics-vml", 347);
pathEnd += ' x';
            }
            _yuitest_coverline("graphics-vml", 349);
if(stroke)
            {
                _yuitest_coverline("graphics-vml", 351);
pathEnd += ' e';
            }
        }
        _yuitest_coverline("graphics-vml", 354);
if(path)
        {
            _yuitest_coverline("graphics-vml", 356);
node.path = path + pathEnd;
        }
        _yuitest_coverline("graphics-vml", 358);
if(!isNaN(w) && !isNaN(h))
        {
            _yuitest_coverline("graphics-vml", 360);
node.coordOrigin = this._left + ", " + this._top;
            _yuitest_coverline("graphics-vml", 361);
node.coordSize = (w * multiplier) + ", " + (h * multiplier);
            _yuitest_coverline("graphics-vml", 362);
node.style.position = "absolute";
            _yuitest_coverline("graphics-vml", 363);
node.style.width =  w + "px";
            _yuitest_coverline("graphics-vml", 364);
node.style.height =  h + "px";
        }
        _yuitest_coverline("graphics-vml", 366);
this._path = path;
        _yuitest_coverline("graphics-vml", 367);
this._movePath = null;
        _yuitest_coverline("graphics-vml", 368);
this._updateTransform();
    },

    /**
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function()
    {
        _yuitest_coverfunc("graphics-vml", "end", 376);
_yuitest_coverline("graphics-vml", 378);
this._closePath();
    },

    /**
     * Ends a fill and stroke
     *
     * @method closePath
     */
    closePath: function()
    {
        _yuitest_coverfunc("graphics-vml", "closePath", 386);
_yuitest_coverline("graphics-vml", 388);
this._addToPath(" x e");
    },

    /**
     * Clears the path.
     *
     * @method clear
     */
    clear: function()
    {
		_yuitest_coverfunc("graphics-vml", "clear", 396);
_yuitest_coverline("graphics-vml", 398);
this._right = 0;
        _yuitest_coverline("graphics-vml", 399);
this._bottom = 0;
        _yuitest_coverline("graphics-vml", 400);
this._width = 0;
        _yuitest_coverline("graphics-vml", 401);
this._height = 0;
        _yuitest_coverline("graphics-vml", 402);
this._left = 0;
        _yuitest_coverline("graphics-vml", 403);
this._top = 0;
        _yuitest_coverline("graphics-vml", 404);
this._path = "";
        _yuitest_coverline("graphics-vml", 405);
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
        _yuitest_coverfunc("graphics-vml", "getBezierData", 417);
_yuitest_coverline("graphics-vml", 418);
var n = points.length,
            tmp = [],
            i,
            j;

        _yuitest_coverline("graphics-vml", 423);
for (i = 0; i < n; ++i){
            _yuitest_coverline("graphics-vml", 424);
tmp[i] = [points[i][0], points[i][1]]; // save input
        }
        
        _yuitest_coverline("graphics-vml", 427);
for (j = 1; j < n; ++j) {
            _yuitest_coverline("graphics-vml", 428);
for (i = 0; i < n - j; ++i) {
                _yuitest_coverline("graphics-vml", 429);
tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];
                _yuitest_coverline("graphics-vml", 430);
tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1]; 
            }
        }
        _yuitest_coverline("graphics-vml", 433);
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
        _yuitest_coverfunc("graphics-vml", "_setCurveBoundingBox", 445);
_yuitest_coverline("graphics-vml", 447);
var i = 0,
            left = this._currentX,
            right = left,
            top = this._currentY,
            bottom = top,
            len = Math.round(Math.sqrt((w * w) + (h * h))),
            t = 1/len,
            xy;
        _yuitest_coverline("graphics-vml", 455);
for(; i < len; ++i)
        {
            _yuitest_coverline("graphics-vml", 457);
xy = this.getBezierData(pts, t * i);
            _yuitest_coverline("graphics-vml", 458);
left = isNaN(left) ? xy[0] : Math.min(xy[0], left);
            _yuitest_coverline("graphics-vml", 459);
right = isNaN(right) ? xy[0] : Math.max(xy[0], right);
            _yuitest_coverline("graphics-vml", 460);
top = isNaN(top) ? xy[1] : Math.min(xy[1], top);
            _yuitest_coverline("graphics-vml", 461);
bottom = isNaN(bottom) ? xy[1] : Math.max(xy[1], bottom);
        }
        _yuitest_coverline("graphics-vml", 463);
left = Math.round(left * 10)/10;
        _yuitest_coverline("graphics-vml", 464);
right = Math.round(right * 10)/10;
        _yuitest_coverline("graphics-vml", 465);
top = Math.round(top * 10)/10;
        _yuitest_coverline("graphics-vml", 466);
bottom = Math.round(bottom * 10)/10;
        _yuitest_coverline("graphics-vml", 467);
this._trackSize(right, bottom);
        _yuitest_coverline("graphics-vml", 468);
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
        _yuitest_coverfunc("graphics-vml", "_trackSize", 479);
_yuitest_coverline("graphics-vml", 480);
if (w > this._right) {
            _yuitest_coverline("graphics-vml", 481);
this._right = w;
        }
        _yuitest_coverline("graphics-vml", 483);
if(w < this._left)
        {
            _yuitest_coverline("graphics-vml", 485);
this._left = w;    
        }
        _yuitest_coverline("graphics-vml", 487);
if (h < this._top)
        {
            _yuitest_coverline("graphics-vml", 489);
this._top = h;
        }
        _yuitest_coverline("graphics-vml", 491);
if (h > this._bottom) 
        {
            _yuitest_coverline("graphics-vml", 493);
this._bottom = h;
        }
        _yuitest_coverline("graphics-vml", 495);
this._width = this._right - this._left;
        _yuitest_coverline("graphics-vml", 496);
this._height = this._bottom - this._top;
    },

    _left: 0,

    _right: 0,

    _top: 0,

    _bottom: 0,

    _width: 0,

    _height: 0
};
_yuitest_coverline("graphics-vml", 511);
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
_yuitest_coverline("graphics-vml", 523);
VMLShape = function() 
{
    _yuitest_coverfunc("graphics-vml", "VMLShape", 523);
_yuitest_coverline("graphics-vml", 525);
this._transforms = [];
    _yuitest_coverline("graphics-vml", 526);
this.matrix = new Y.Matrix();
    _yuitest_coverline("graphics-vml", 527);
this._normalizedMatrix = new Y.Matrix();
    _yuitest_coverline("graphics-vml", 528);
VMLShape.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("graphics-vml", 531);
VMLShape.NAME = "vmlShape";

_yuitest_coverline("graphics-vml", 533);
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
		_yuitest_coverfunc("graphics-vml", "init", 550);
_yuitest_coverline("graphics-vml", 552);
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
		_yuitest_coverfunc("graphics-vml", "initializer", 561);
_yuitest_coverline("graphics-vml", 563);
var host = this,
            graphic = cfg.graphic;
		_yuitest_coverline("graphics-vml", 565);
host.createNode();
        _yuitest_coverline("graphics-vml", 566);
if(graphic)
        {
            _yuitest_coverline("graphics-vml", 568);
this._setGraphic(graphic);
        }
        _yuitest_coverline("graphics-vml", 570);
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
        _yuitest_coverfunc("graphics-vml", "_setGraphic", 581);
_yuitest_coverline("graphics-vml", 583);
var graphic;
        _yuitest_coverline("graphics-vml", 584);
if(render instanceof Y.VMLGraphic)
        {
		    _yuitest_coverline("graphics-vml", 586);
this._graphic = render;
        }
        else
        {
            _yuitest_coverline("graphics-vml", 590);
render = Y.one(render);
            _yuitest_coverline("graphics-vml", 591);
graphic = new Y.VMLGraphic({
                render: render
            });
            _yuitest_coverline("graphics-vml", 594);
graphic._appendShape(this);
            _yuitest_coverline("graphics-vml", 595);
this._graphic = graphic;
            _yuitest_coverline("graphics-vml", 596);
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
        _yuitest_coverfunc("graphics-vml", "_appendStrokeAndFill", 606);
_yuitest_coverline("graphics-vml", 608);
if(this._strokeNode)
        {
            _yuitest_coverline("graphics-vml", 610);
this.node.appendChild(this._strokeNode);
        }
        _yuitest_coverline("graphics-vml", 612);
if(this._fillNode)
        {
            _yuitest_coverline("graphics-vml", 614);
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
        _yuitest_coverfunc("graphics-vml", "createNode", 625);
_yuitest_coverline("graphics-vml", 627);
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
			_yuitest_coverline("graphics-vml", 646);
id = this.get("id");
			_yuitest_coverline("graphics-vml", 647);
type = this._type == "path" ? "shape" : this._type;
			_yuitest_coverline("graphics-vml", 648);
classString = 'vml' + type + ' ' + _getClassName(SHAPE) + " " + _getClassName(this.constructor.NAME); 
			_yuitest_coverline("graphics-vml", 649);
stroke = this._getStrokeProps();
			_yuitest_coverline("graphics-vml", 650);
fill = this._getFillProps();
			
			_yuitest_coverline("graphics-vml", 652);
nodestring  = '<' + type + '  xmlns="urn:schemas-microsft.com:vml" id="' + id + '" class="' + classString + '" style="behavior:url(#default#VML);display:inline-block;position:absolute;left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;height:' + h + 'px;visibility:' + visibility + '"';

		    _yuitest_coverline("graphics-vml", 654);
if(stroke && stroke.weight && stroke.weight > 0)
			{
				_yuitest_coverline("graphics-vml", 656);
endcap = stroke.endcap;
				_yuitest_coverline("graphics-vml", 657);
opacity = parseFloat(stroke.opacity);
				_yuitest_coverline("graphics-vml", 658);
joinstyle = stroke.joinstyle;
				_yuitest_coverline("graphics-vml", 659);
miterlimit = stroke.miterlimit;
				_yuitest_coverline("graphics-vml", 660);
dashstyle = stroke.dashstyle;
				_yuitest_coverline("graphics-vml", 661);
nodestring += ' stroked="t" strokecolor="' + stroke.color + '" strokeWeight="' + stroke.weight + 'px"';
				
				_yuitest_coverline("graphics-vml", 663);
strokestring = '<stroke class="vmlstroke" xmlns="urn:schemas-microsft.com:vml" on="t" style="behavior:url(#default#VML);display:inline-block;"';
				_yuitest_coverline("graphics-vml", 664);
strokestring += ' opacity="' + opacity + '"';
				_yuitest_coverline("graphics-vml", 665);
if(endcap)
				{
					_yuitest_coverline("graphics-vml", 667);
strokestring += ' endcap="' + endcap + '"';
				}
				_yuitest_coverline("graphics-vml", 669);
if(joinstyle)
				{
					_yuitest_coverline("graphics-vml", 671);
strokestring += ' joinstyle="' + joinstyle + '"';
				}
				_yuitest_coverline("graphics-vml", 673);
if(miterlimit)
				{
					_yuitest_coverline("graphics-vml", 675);
strokestring += ' miterlimit="' + miterlimit + '"';
				}
				_yuitest_coverline("graphics-vml", 677);
if(dashstyle)
				{
					_yuitest_coverline("graphics-vml", 679);
strokestring += ' dashstyle="' + dashstyle + '"';
				}
				_yuitest_coverline("graphics-vml", 681);
strokestring += '></stroke>';
				_yuitest_coverline("graphics-vml", 682);
this._strokeNode = DOCUMENT.createElement(strokestring);
				_yuitest_coverline("graphics-vml", 683);
nodestring += ' stroked="t"';
			}
			else
			{
				_yuitest_coverline("graphics-vml", 687);
nodestring += ' stroked="f"';
			}
			_yuitest_coverline("graphics-vml", 689);
if(fill)
			{
				_yuitest_coverline("graphics-vml", 691);
if(fill.node)
				{
					_yuitest_coverline("graphics-vml", 693);
fillstring = fill.node;
					_yuitest_coverline("graphics-vml", 694);
this._fillNode = DOCUMENT.createElement(fillstring);
				}
				_yuitest_coverline("graphics-vml", 696);
if(fill.color)
				{
					_yuitest_coverline("graphics-vml", 698);
nodestring += ' fillcolor="' + fill.color + '"';
				}
				_yuitest_coverline("graphics-vml", 700);
nodestring += ' filled="' + fill.filled + '"';
			}
			
			
			_yuitest_coverline("graphics-vml", 704);
nodestring += '>';
			_yuitest_coverline("graphics-vml", 705);
nodestring += '</' + type + '>';
			
			_yuitest_coverline("graphics-vml", 707);
node = DOCUMENT.createElement(nodestring);

            _yuitest_coverline("graphics-vml", 709);
this.node = node;
            _yuitest_coverline("graphics-vml", 710);
this._strokeFlag = false;
            _yuitest_coverline("graphics-vml", 711);
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
		_yuitest_coverfunc("graphics-vml", "addClass", 720);
_yuitest_coverline("graphics-vml", 722);
var node = this.node;
		_yuitest_coverline("graphics-vml", 723);
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
		_yuitest_coverfunc("graphics-vml", "removeClass", 732);
_yuitest_coverline("graphics-vml", 734);
var node = this.node;
		_yuitest_coverline("graphics-vml", 735);
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
		_yuitest_coverfunc("graphics-vml", "getXY", 744);
_yuitest_coverline("graphics-vml", 746);
var graphic = this._graphic,
			parentXY = graphic.getXY(),
			x = this.get("x"),
			y = this.get("y");
		_yuitest_coverline("graphics-vml", 750);
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
		_yuitest_coverfunc("graphics-vml", "setXY", 760);
_yuitest_coverline("graphics-vml", 762);
var graphic = this._graphic,
			parentXY = graphic.getXY();
		_yuitest_coverline("graphics-vml", 764);
this.set("x", xy[0] - parentXY[0]);
		_yuitest_coverline("graphics-vml", 765);
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
		_yuitest_coverfunc("graphics-vml", "contains", 775);
_yuitest_coverline("graphics-vml", 777);
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
		_yuitest_coverfunc("graphics-vml", "compareTo", 787);
_yuitest_coverline("graphics-vml", 788);
var node = this.node;

		_yuitest_coverline("graphics-vml", 790);
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
		_yuitest_coverfunc("graphics-vml", "test", 800);
_yuitest_coverline("graphics-vml", 802);
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
		_yuitest_coverfunc("graphics-vml", "_getStrokeProps", 813);
_yuitest_coverline("graphics-vml", 815);
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
        _yuitest_coverline("graphics-vml", 825);
if(stroke && stroke.weight && stroke.weight > 0)
		{
			_yuitest_coverline("graphics-vml", 827);
props = {};
			_yuitest_coverline("graphics-vml", 828);
linecap = stroke.linecap || "flat";
			_yuitest_coverline("graphics-vml", 829);
linejoin = stroke.linejoin || "round";
			_yuitest_coverline("graphics-vml", 830);
if(linecap != "round" && linecap != "square")
			{
				_yuitest_coverline("graphics-vml", 832);
linecap = "flat";
			}
			_yuitest_coverline("graphics-vml", 834);
strokeOpacity = parseFloat(stroke.opacity);
			_yuitest_coverline("graphics-vml", 835);
dashstyle = stroke.dashstyle || "none";
			_yuitest_coverline("graphics-vml", 836);
stroke.color = stroke.color || "#000000";
			_yuitest_coverline("graphics-vml", 837);
stroke.weight = stroke.weight || 1;
			_yuitest_coverline("graphics-vml", 838);
stroke.opacity = IS_NUM(strokeOpacity) ? strokeOpacity : 1;
			_yuitest_coverline("graphics-vml", 839);
props.stroked = true;
			_yuitest_coverline("graphics-vml", 840);
props.color = stroke.color;
			_yuitest_coverline("graphics-vml", 841);
props.weight = stroke.weight;
			_yuitest_coverline("graphics-vml", 842);
props.endcap = linecap;
			_yuitest_coverline("graphics-vml", 843);
props.opacity = stroke.opacity;
			_yuitest_coverline("graphics-vml", 844);
if(IS_ARRAY(dashstyle))
			{
				_yuitest_coverline("graphics-vml", 846);
dash = [];
				_yuitest_coverline("graphics-vml", 847);
len = dashstyle.length;
				_yuitest_coverline("graphics-vml", 848);
for(i = 0; i < len; ++i)
				{
					_yuitest_coverline("graphics-vml", 850);
val = dashstyle[i];
					_yuitest_coverline("graphics-vml", 851);
dash[i] = val / stroke.weight;
				}
			}
			_yuitest_coverline("graphics-vml", 854);
if(linejoin == "round" || linejoin == "bevel")
			{
				_yuitest_coverline("graphics-vml", 856);
props.joinstyle = linejoin;
			}
			else
			{
				_yuitest_coverline("graphics-vml", 860);
linejoin = parseInt(linejoin, 10);
				_yuitest_coverline("graphics-vml", 861);
if(IS_NUM(linejoin))
				{
					_yuitest_coverline("graphics-vml", 863);
props.miterlimit = Math.max(linejoin, 1);
					_yuitest_coverline("graphics-vml", 864);
props.joinstyle = "miter";
				}
			}
			_yuitest_coverline("graphics-vml", 867);
props.dashstyle = dash;
		}
		_yuitest_coverline("graphics-vml", 869);
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
        _yuitest_coverfunc("graphics-vml", "_strokeChangeHandler", 878);
_yuitest_coverline("graphics-vml", 880);
if(!this._strokeFlag)
        {
            _yuitest_coverline("graphics-vml", 882);
return;
        }
		_yuitest_coverline("graphics-vml", 884);
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
		_yuitest_coverline("graphics-vml", 894);
if(stroke && stroke.weight && stroke.weight > 0)
		{
			_yuitest_coverline("graphics-vml", 896);
linecap = stroke.linecap || "flat";
			_yuitest_coverline("graphics-vml", 897);
linejoin = stroke.linejoin || "round";
			_yuitest_coverline("graphics-vml", 898);
if(linecap != "round" && linecap != "square")
			{
				_yuitest_coverline("graphics-vml", 900);
linecap = "flat";
			}
			_yuitest_coverline("graphics-vml", 902);
strokeOpacity = parseFloat(stroke.opacity);
			_yuitest_coverline("graphics-vml", 903);
dashstyle = stroke.dashstyle || "none";
			_yuitest_coverline("graphics-vml", 904);
stroke.color = stroke.color || "#000000";
			_yuitest_coverline("graphics-vml", 905);
stroke.weight = stroke.weight || 1;
			_yuitest_coverline("graphics-vml", 906);
stroke.opacity = IS_NUM(strokeOpacity) ? strokeOpacity : 1;
			_yuitest_coverline("graphics-vml", 907);
node.stroked = true;
			_yuitest_coverline("graphics-vml", 908);
node.strokeColor = stroke.color;
			_yuitest_coverline("graphics-vml", 909);
node.strokeWeight = stroke.weight + "px";
			_yuitest_coverline("graphics-vml", 910);
if(!this._strokeNode)
			{
				_yuitest_coverline("graphics-vml", 912);
this._strokeNode = this._createGraphicNode("stroke");
				_yuitest_coverline("graphics-vml", 913);
node.appendChild(this._strokeNode);
			}
			_yuitest_coverline("graphics-vml", 915);
this._strokeNode.endcap = linecap;
			_yuitest_coverline("graphics-vml", 916);
this._strokeNode.opacity = stroke.opacity;
			_yuitest_coverline("graphics-vml", 917);
if(IS_ARRAY(dashstyle))
			{
				_yuitest_coverline("graphics-vml", 919);
dash = [];
				_yuitest_coverline("graphics-vml", 920);
len = dashstyle.length;
				_yuitest_coverline("graphics-vml", 921);
for(i = 0; i < len; ++i)
				{
					_yuitest_coverline("graphics-vml", 923);
val = dashstyle[i];
					_yuitest_coverline("graphics-vml", 924);
dash[i] = val / stroke.weight;
				}
			}
			_yuitest_coverline("graphics-vml", 927);
if(linejoin == "round" || linejoin == "bevel")
			{
				_yuitest_coverline("graphics-vml", 929);
this._strokeNode.joinstyle = linejoin;
			}
			else
			{
				_yuitest_coverline("graphics-vml", 933);
linejoin = parseInt(linejoin, 10);
				_yuitest_coverline("graphics-vml", 934);
if(IS_NUM(linejoin))
				{
					_yuitest_coverline("graphics-vml", 936);
this._strokeNode.miterlimit = Math.max(linejoin, 1);
					_yuitest_coverline("graphics-vml", 937);
this._strokeNode.joinstyle = "miter";
				}
			}
			_yuitest_coverline("graphics-vml", 940);
this._strokeNode.dashstyle = dash;
            _yuitest_coverline("graphics-vml", 941);
this._strokeNode.on = true;
		}
		else
		{
            _yuitest_coverline("graphics-vml", 945);
if(this._strokeNode)
            {
                _yuitest_coverline("graphics-vml", 947);
this._strokeNode.on = false;
            }
			_yuitest_coverline("graphics-vml", 949);
node.stroked = false;
		}
        _yuitest_coverline("graphics-vml", 951);
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
		_yuitest_coverfunc("graphics-vml", "_getFillProps", 962);
_yuitest_coverline("graphics-vml", 964);
var fill = this.get("fill"),
			fillOpacity,
			props,
			gradient,
			i,
			fillstring,
			filled = false;
		_yuitest_coverline("graphics-vml", 971);
if(fill)
		{
			_yuitest_coverline("graphics-vml", 973);
props = {};
			
			_yuitest_coverline("graphics-vml", 975);
if(fill.type == "radial" || fill.type == "linear")
			{
				_yuitest_coverline("graphics-vml", 977);
fillOpacity = parseFloat(fill.opacity);
				_yuitest_coverline("graphics-vml", 978);
fillOpacity = IS_NUM(fillOpacity) ? fillOpacity : 1;
				_yuitest_coverline("graphics-vml", 979);
filled = true;
				_yuitest_coverline("graphics-vml", 980);
gradient = this._getGradientFill(fill);
				_yuitest_coverline("graphics-vml", 981);
fillstring = '<fill xmlns="urn:schemas-microsft.com:vml" class="vmlfill" style="behavior:url(#default#VML);display:inline-block;" opacity="' + fillOpacity + '"';
				_yuitest_coverline("graphics-vml", 982);
for(i in gradient)
				{
					_yuitest_coverline("graphics-vml", 984);
if(gradient.hasOwnProperty(i))
					{
						_yuitest_coverline("graphics-vml", 986);
fillstring += ' ' + i + '="' + gradient[i] + '"';
					}
				}
				_yuitest_coverline("graphics-vml", 989);
fillstring += ' />';
				_yuitest_coverline("graphics-vml", 990);
props.node = fillstring;
			}
			else {_yuitest_coverline("graphics-vml", 992);
if(fill.color)
			{
				_yuitest_coverline("graphics-vml", 994);
fillOpacity = parseFloat(fill.opacity);
				_yuitest_coverline("graphics-vml", 995);
filled = true;
                _yuitest_coverline("graphics-vml", 996);
props.color = fill.color;
				_yuitest_coverline("graphics-vml", 997);
if(IS_NUM(fillOpacity))
				{
					_yuitest_coverline("graphics-vml", 999);
fillOpacity = Math.max(Math.min(fillOpacity, 1), 0);
                    _yuitest_coverline("graphics-vml", 1000);
props.opacity = fillOpacity;    
				    _yuitest_coverline("graphics-vml", 1001);
if(fillOpacity < 1)
                    {
                        _yuitest_coverline("graphics-vml", 1003);
props.node = '<fill xmlns="urn:schemas-microsft.com:vml" class="vmlfill" style="behavior:url(#default#VML);display:inline-block;" type="solid" opacity="' + fillOpacity + '"/>';
				    }
                }
			}}
			_yuitest_coverline("graphics-vml", 1007);
props.filled = filled;
		}
		_yuitest_coverline("graphics-vml", 1009);
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
        _yuitest_coverfunc("graphics-vml", "_fillChangeHandler", 1018);
_yuitest_coverline("graphics-vml", 1020);
if(!this._fillFlag)
        {
            _yuitest_coverline("graphics-vml", 1022);
return;
        }
		_yuitest_coverline("graphics-vml", 1024);
var node = this.node,
			fill = this.get("fill"),
			fillOpacity,
			fillstring,
			filled = false,
            i,
            gradient;
		_yuitest_coverline("graphics-vml", 1031);
if(fill)
		{
			_yuitest_coverline("graphics-vml", 1033);
if(fill.type == "radial" || fill.type == "linear")
			{
				_yuitest_coverline("graphics-vml", 1035);
filled = true;
				_yuitest_coverline("graphics-vml", 1036);
gradient = this._getGradientFill(fill);
                _yuitest_coverline("graphics-vml", 1037);
if(this._fillNode)
                {
                    _yuitest_coverline("graphics-vml", 1039);
for(i in gradient)
                    {
                        _yuitest_coverline("graphics-vml", 1041);
if(gradient.hasOwnProperty(i))
                        {
                            _yuitest_coverline("graphics-vml", 1043);
if(i == "colors")
                            {
                                _yuitest_coverline("graphics-vml", 1045);
this._fillNode.colors.value = gradient[i];
                            }
                            else
                            {
                                _yuitest_coverline("graphics-vml", 1049);
this._fillNode[i] = gradient[i];
                            }
                        }
                    }
                }
                else
                {
                    _yuitest_coverline("graphics-vml", 1056);
fillstring = '<fill xmlns="urn:schemas-microsft.com:vml" class="vmlfill" style="behavior:url(#default#VML);display:inline-block;"';
                    _yuitest_coverline("graphics-vml", 1057);
for(i in gradient)
                    {
                        _yuitest_coverline("graphics-vml", 1059);
if(gradient.hasOwnProperty(i))
                        {
                            _yuitest_coverline("graphics-vml", 1061);
fillstring += ' ' + i + '="' + gradient[i] + '"';
                        }
                    }
                    _yuitest_coverline("graphics-vml", 1064);
fillstring += ' />';
                    _yuitest_coverline("graphics-vml", 1065);
this._fillNode = DOCUMENT.createElement(fillstring);
                    _yuitest_coverline("graphics-vml", 1066);
node.appendChild(this._fillNode);
                }
			}
			else {_yuitest_coverline("graphics-vml", 1069);
if(fill.color)
			{
                _yuitest_coverline("graphics-vml", 1071);
node.fillcolor = fill.color;
				_yuitest_coverline("graphics-vml", 1072);
fillOpacity = parseFloat(fill.opacity);
				_yuitest_coverline("graphics-vml", 1073);
filled = true;
				_yuitest_coverline("graphics-vml", 1074);
if(IS_NUM(fillOpacity) && fillOpacity < 1)
				{
					_yuitest_coverline("graphics-vml", 1076);
fill.opacity = fillOpacity;
                    _yuitest_coverline("graphics-vml", 1077);
if(this._fillNode)
					{
                        _yuitest_coverline("graphics-vml", 1079);
if(this._fillNode.getAttribute("type") != "solid")
                        {
                            _yuitest_coverline("graphics-vml", 1081);
this._fillNode.type = "solid";
                        }
						_yuitest_coverline("graphics-vml", 1083);
this._fillNode.opacity = fillOpacity;
					}
					else
					{     
                        _yuitest_coverline("graphics-vml", 1087);
fillstring = '<fill xmlns="urn:schemas-microsft.com:vml" class="vmlfill" style="behavior:url(#default#VML);display:inline-block;" type="solid" opacity="' + fillOpacity + '"/>';
                        _yuitest_coverline("graphics-vml", 1088);
this._fillNode = DOCUMENT.createElement(fillstring);
                        _yuitest_coverline("graphics-vml", 1089);
node.appendChild(this._fillNode);
					}
				}
				else {_yuitest_coverline("graphics-vml", 1092);
if(this._fillNode)
                {   
                    _yuitest_coverline("graphics-vml", 1094);
this._fillNode.opacity = 1;
                    _yuitest_coverline("graphics-vml", 1095);
this._fillNode.type = "solid";
				}}
			}}
		}
		_yuitest_coverline("graphics-vml", 1099);
node.filled = filled;
        _yuitest_coverline("graphics-vml", 1100);
this._fillFlag = false;
	},

	//not used. remove next release.
    _updateFillNode: function(node)
	{
		_yuitest_coverfunc("graphics-vml", "_updateFillNode", 1104);
_yuitest_coverline("graphics-vml", 1106);
if(!this._fillNode)
		{
			_yuitest_coverline("graphics-vml", 1108);
this._fillNode = this._createGraphicNode("fill");
			_yuitest_coverline("graphics-vml", 1109);
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
		_yuitest_coverfunc("graphics-vml", "_getGradientFill", 1121);
_yuitest_coverline("graphics-vml", 1123);
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
		_yuitest_coverline("graphics-vml", 1145);
if(type === "linear")
		{
            _yuitest_coverline("graphics-vml", 1147);
if(rotation <= 270)
            {
                _yuitest_coverline("graphics-vml", 1149);
rotation = Math.abs(rotation - 270);
            }
			else {_yuitest_coverline("graphics-vml", 1151);
if(rotation < 360)
            {
                _yuitest_coverline("graphics-vml", 1153);
rotation = 270 + (360 - rotation);
            }
            else
            {
                _yuitest_coverline("graphics-vml", 1157);
rotation = 270;
            }}
            _yuitest_coverline("graphics-vml", 1159);
gradientProps.type = "gradient";//"gradientunscaled";
			_yuitest_coverline("graphics-vml", 1160);
gradientProps.angle = rotation;
		}
		else {_yuitest_coverline("graphics-vml", 1162);
if(type === "radial")
		{
			_yuitest_coverline("graphics-vml", 1164);
gradientBoxWidth = w * (r * 2);
			_yuitest_coverline("graphics-vml", 1165);
gradientBoxHeight = h * (r * 2);
			_yuitest_coverline("graphics-vml", 1166);
fx = r * 2 * (fx - 0.5);
			_yuitest_coverline("graphics-vml", 1167);
fy = r * 2 * (fy - 0.5);
			_yuitest_coverline("graphics-vml", 1168);
fx += cx;
			_yuitest_coverline("graphics-vml", 1169);
fy += cy;
			_yuitest_coverline("graphics-vml", 1170);
gradientProps.focussize = (gradientBoxWidth/w)/10 + "% " + (gradientBoxHeight/h)/10 + "%";
			_yuitest_coverline("graphics-vml", 1171);
gradientProps.alignshape = false;
			_yuitest_coverline("graphics-vml", 1172);
gradientProps.type = "gradientradial";
			_yuitest_coverline("graphics-vml", 1173);
gradientProps.focus = "100%";
			_yuitest_coverline("graphics-vml", 1174);
gradientProps.focusposition = Math.round(fx * 100) + "% " + Math.round(fy * 100) + "%";
		}}
		_yuitest_coverline("graphics-vml", 1176);
for(;i < len; ++i) {
			_yuitest_coverline("graphics-vml", 1177);
stop = stops[i];
			_yuitest_coverline("graphics-vml", 1178);
color = stop.color;
			_yuitest_coverline("graphics-vml", 1179);
opacity = stop.opacity;
			_yuitest_coverline("graphics-vml", 1180);
opacity = isNumber(opacity) ? opacity : 1;
			_yuitest_coverline("graphics-vml", 1181);
pct = stop.offset || i/(len-1);
			_yuitest_coverline("graphics-vml", 1182);
pct *= (r * 2);
            _yuitest_coverline("graphics-vml", 1183);
pct = Math.round(100 * pct) + "%";
            _yuitest_coverline("graphics-vml", 1184);
oi = i > 0 ? i + 1 : "";
            _yuitest_coverline("graphics-vml", 1185);
gradientProps["opacity" + oi] = opacity + "";
            _yuitest_coverline("graphics-vml", 1186);
colorstring += ", " + pct + " " + color;
		}
		_yuitest_coverline("graphics-vml", 1188);
if(parseFloat(pct) < 100)
		{
			_yuitest_coverline("graphics-vml", 1190);
colorstring += ", 100% " + color;
		}
		_yuitest_coverline("graphics-vml", 1192);
gradientProps.colors = colorstring.substr(2);
		_yuitest_coverline("graphics-vml", 1193);
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
        _yuitest_coverfunc("graphics-vml", "_addTransform", 1204);
_yuitest_coverline("graphics-vml", 1206);
args = Y.Array(args);
        _yuitest_coverline("graphics-vml", 1207);
this._transform = Y_LANG.trim(this._transform + " " + type + "(" + args.join(", ") + ")");
        _yuitest_coverline("graphics-vml", 1208);
args.unshift(type);
        _yuitest_coverline("graphics-vml", 1209);
this._transforms.push(args);
        _yuitest_coverline("graphics-vml", 1210);
if(this.initialized)
        {
            _yuitest_coverline("graphics-vml", 1212);
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
		_yuitest_coverfunc("graphics-vml", "_updateTransform", 1222);
_yuitest_coverline("graphics-vml", 1224);
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
        _yuitest_coverline("graphics-vml", 1237);
if(this._transforms && this._transforms.length > 0)
		{
            _yuitest_coverline("graphics-vml", 1239);
transformOrigin = this.get("transformOrigin");
       
            _yuitest_coverline("graphics-vml", 1241);
if(isPathShape)
            {
                _yuitest_coverline("graphics-vml", 1243);
normalizedMatrix.translate(this._left, this._top);
            }
            //vml skew matrix transformOrigin ranges from -0.5 to 0.5.
            //subtract 0.5 from values
            _yuitest_coverline("graphics-vml", 1247);
tx = transformOrigin[0] - 0.5;
            _yuitest_coverline("graphics-vml", 1248);
ty = transformOrigin[1] - 0.5;
            
            //ensure the values are within the appropriate range to avoid errors
            _yuitest_coverline("graphics-vml", 1251);
tx = Math.max(-0.5, Math.min(0.5, tx));
            _yuitest_coverline("graphics-vml", 1252);
ty = Math.max(-0.5, Math.min(0.5, ty));
            _yuitest_coverline("graphics-vml", 1253);
for(; i < len; ++i)
            {
                _yuitest_coverline("graphics-vml", 1255);
key = this._transforms[i].shift();
                _yuitest_coverline("graphics-vml", 1256);
if(key)
                {
                    _yuitest_coverline("graphics-vml", 1258);
normalizedMatrix[key].apply(normalizedMatrix, this._transforms[i]); 
                    _yuitest_coverline("graphics-vml", 1259);
matrix[key].apply(matrix, this._transforms[i]); 
                }
			}
            _yuitest_coverline("graphics-vml", 1262);
if(isPathShape)
            {
                _yuitest_coverline("graphics-vml", 1264);
normalizedMatrix.translate(-this._left, -this._top);
            }
            _yuitest_coverline("graphics-vml", 1266);
transform = normalizedMatrix.a + "," + 
                        normalizedMatrix.c + "," + 
                        normalizedMatrix.b + "," + 
                        normalizedMatrix.d + "," + 
                        0 + "," +
                        0;
		}
        _yuitest_coverline("graphics-vml", 1273);
this._graphic.addToRedrawQueue(this);    
        _yuitest_coverline("graphics-vml", 1274);
if(transform)
        {
            _yuitest_coverline("graphics-vml", 1276);
if(!this._skew)
            {
                _yuitest_coverline("graphics-vml", 1278);
this._skew = DOCUMENT.createElement( '<skew class="vmlskew" xmlns="urn:schemas-microsft.com:vml" on="false" style="behavior:url(#default#VML);display:inline-block;" />');
                _yuitest_coverline("graphics-vml", 1279);
this.node.appendChild(this._skew); 
            }
            _yuitest_coverline("graphics-vml", 1281);
this._skew.matrix = transform;
            _yuitest_coverline("graphics-vml", 1282);
this._skew.on = true;
            //this._skew.offset = this._getSkewOffsetValue(normalizedMatrix.dx) + "px, " + this._getSkewOffsetValue(normalizedMatrix.dy) + "px";
            _yuitest_coverline("graphics-vml", 1284);
this._skew.origin = tx + ", " + ty;
        }
        _yuitest_coverline("graphics-vml", 1286);
if(this._type != "path")
        {
            _yuitest_coverline("graphics-vml", 1288);
this._transforms = [];
        }
        //add the translate to the x and y coordinates
        _yuitest_coverline("graphics-vml", 1291);
node.style.left = (x + this._getSkewOffsetValue(normalizedMatrix.dx)) + "px";
        _yuitest_coverline("graphics-vml", 1292);
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
        _yuitest_coverfunc("graphics-vml", "_getSkewOffsetValue", 1303);
_yuitest_coverline("graphics-vml", 1305);
var sign = Y.MatrixUtil.sign(val),
            absVal = Math.abs(val);
        _yuitest_coverline("graphics-vml", 1307);
val = Math.min(absVal, 32767) * sign;
        _yuitest_coverline("graphics-vml", 1308);
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
		_yuitest_coverfunc("graphics-vml", "translate", 1345);
_yuitest_coverline("graphics-vml", 1347);
this._translateX += x;
		_yuitest_coverline("graphics-vml", 1348);
this._translateY += y;
		_yuitest_coverline("graphics-vml", 1349);
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
        _yuitest_coverfunc("graphics-vml", "translateX", 1359);
_yuitest_coverline("graphics-vml", 1361);
this._translateX += x;
        _yuitest_coverline("graphics-vml", 1362);
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
        _yuitest_coverfunc("graphics-vml", "translateY", 1372);
_yuitest_coverline("graphics-vml", 1374);
this._translateY += y;
        _yuitest_coverline("graphics-vml", 1375);
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
        _yuitest_coverfunc("graphics-vml", "skew", 1385);
_yuitest_coverline("graphics-vml", 1387);
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
		_yuitest_coverfunc("graphics-vml", "skewX", 1396);
_yuitest_coverline("graphics-vml", 1398);
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
		_yuitest_coverfunc("graphics-vml", "skewY", 1407);
_yuitest_coverline("graphics-vml", 1409);
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
		_yuitest_coverfunc("graphics-vml", "rotate", 1418);
_yuitest_coverline("graphics-vml", 1420);
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
		_yuitest_coverfunc("graphics-vml", "scale", 1429);
_yuitest_coverline("graphics-vml", 1431);
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
		_yuitest_coverfunc("graphics-vml", "on", 1443);
_yuitest_coverline("graphics-vml", 1445);
if(Y.Node.DOM_EVENTS[type])
		{
			_yuitest_coverline("graphics-vml", 1447);
return Y.one("#" +  this.get("id")).on(type, fn);
		}
		_yuitest_coverline("graphics-vml", 1449);
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
		_yuitest_coverfunc("graphics-vml", "_updateHandler", 1468);
_yuitest_coverline("graphics-vml", 1470);
var host = this,
            node = host.node;
        _yuitest_coverline("graphics-vml", 1472);
host._fillChangeHandler();
        _yuitest_coverline("graphics-vml", 1473);
host._strokeChangeHandler();
        _yuitest_coverline("graphics-vml", 1474);
node.style.width = this.get("width") + "px";
        _yuitest_coverline("graphics-vml", 1475);
node.style.height = this.get("height") + "px"; 
        _yuitest_coverline("graphics-vml", 1476);
this._draw();
		_yuitest_coverline("graphics-vml", 1477);
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
		_yuitest_coverfunc("graphics-vml", "_createGraphicNode", 1488);
_yuitest_coverline("graphics-vml", 1490);
type = type || this._type;
		_yuitest_coverline("graphics-vml", 1491);
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
		_yuitest_coverfunc("graphics-vml", "_getDefaultFill", 1501);
_yuitest_coverline("graphics-vml", 1502);
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
		_yuitest_coverfunc("graphics-vml", "_getDefaultStroke", 1519);
_yuitest_coverline("graphics-vml", 1521);
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
		_yuitest_coverfunc("graphics-vml", "set", 1538);
_yuitest_coverline("graphics-vml", 1540);
var host = this;
		_yuitest_coverline("graphics-vml", 1541);
AttributeLite.prototype.set.apply(host, arguments);
		_yuitest_coverline("graphics-vml", 1542);
if(host.initialized)
		{
			_yuitest_coverline("graphics-vml", 1544);
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
		_yuitest_coverfunc("graphics-vml", "getBounds", 1557);
_yuitest_coverline("graphics-vml", 1559);
var isPathShape = this instanceof Y.VMLPath,
			w = this.get("width"),
			h = this.get("height"),
            x = this.get("x"),
            y = this.get("y");
        _yuitest_coverline("graphics-vml", 1564);
if(isPathShape)
        {
            _yuitest_coverline("graphics-vml", 1566);
x = x + this._left;
            _yuitest_coverline("graphics-vml", 1567);
y = y + this._top;
            _yuitest_coverline("graphics-vml", 1568);
w = this._right - this._left;
            _yuitest_coverline("graphics-vml", 1569);
h = this._bottom - this._top;
        }
        _yuitest_coverline("graphics-vml", 1571);
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
        _yuitest_coverfunc("graphics-vml", "_getContentRect", 1584);
_yuitest_coverline("graphics-vml", 1586);
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
        _yuitest_coverline("graphics-vml", 1597);
if(isPathShape)
        {
            _yuitest_coverline("graphics-vml", 1599);
matrix.translate(this._left, this._top);
        }
        _yuitest_coverline("graphics-vml", 1601);
transformX = !isNaN(transformX) ? transformX : 0;
        _yuitest_coverline("graphics-vml", 1602);
transformY = !isNaN(transformY) ? transformY : 0;
        _yuitest_coverline("graphics-vml", 1603);
matrix.translate(transformX, transformY);
        _yuitest_coverline("graphics-vml", 1604);
for(; i < len; i = i + 1)
        {
            _yuitest_coverline("graphics-vml", 1606);
transform = transforms[i];
            _yuitest_coverline("graphics-vml", 1607);
key = transform.shift();
            _yuitest_coverline("graphics-vml", 1608);
if(key)
            {
                _yuitest_coverline("graphics-vml", 1610);
matrix[key].apply(matrix, transform); 
            }
        }
        _yuitest_coverline("graphics-vml", 1613);
matrix.translate(-transformX, -transformY);
        _yuitest_coverline("graphics-vml", 1614);
if(isPathShape)
        {
            _yuitest_coverline("graphics-vml", 1616);
matrix.translate(-this._left, -this._top);
        }
        _yuitest_coverline("graphics-vml", 1618);
contentRect = matrix.getContentRect(w, h, x, y);
        _yuitest_coverline("graphics-vml", 1619);
return contentRect;
    },
	
    /**
     *  Destroys shape
     *
     *  @method destroy
     */
    destroy: function()
    {
        _yuitest_coverfunc("graphics-vml", "destroy", 1627);
_yuitest_coverline("graphics-vml", 1629);
var graphic = this.get("graphic");
        _yuitest_coverline("graphics-vml", 1630);
if(graphic)
        {
            _yuitest_coverline("graphics-vml", 1632);
graphic.removeShape(this);
        }
        else
        {
            _yuitest_coverline("graphics-vml", 1636);
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
        _yuitest_coverfunc("graphics-vml", "_destroy", 1646);
_yuitest_coverline("graphics-vml", 1648);
if(this.node)
        {   
            _yuitest_coverline("graphics-vml", 1650);
if(this._fillNode)
            {
                _yuitest_coverline("graphics-vml", 1652);
this.node.removeChild(this._fillNode);
                _yuitest_coverline("graphics-vml", 1653);
this._fillNode = null;
            }
            _yuitest_coverline("graphics-vml", 1655);
if(this._strokeNode)
            {
                _yuitest_coverline("graphics-vml", 1657);
this.node.removeChild(this._strokeNode);
                _yuitest_coverline("graphics-vml", 1658);
this._strokeNode = null;
            }
            _yuitest_coverline("graphics-vml", 1660);
Y.one(this.node).remove(true);
        }
    }
}, Y.VMLDrawing.prototype));

_yuitest_coverline("graphics-vml", 1665);
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
			_yuitest_coverfunc("graphics-vml", "valueFn", 1674);
_yuitest_coverline("graphics-vml", 1676);
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
            _yuitest_coverfunc("graphics-vml", "setter", 1710);
_yuitest_coverline("graphics-vml", 1712);
var i = 0,
                len,
                transform;
            _yuitest_coverline("graphics-vml", 1715);
this.matrix.init();	
            _yuitest_coverline("graphics-vml", 1716);
this._normalizedMatrix.init();	
            _yuitest_coverline("graphics-vml", 1717);
this._transforms = this.matrix.getTransformArray(val);
            _yuitest_coverline("graphics-vml", 1718);
len = this._transforms.length;
            _yuitest_coverline("graphics-vml", 1719);
for(;i < len; ++i)
            {
                _yuitest_coverline("graphics-vml", 1721);
transform = this._transforms[i];
            }
            _yuitest_coverline("graphics-vml", 1723);
this._transform = val;
            _yuitest_coverline("graphics-vml", 1724);
return val;
		},

        getter: function()
        {
            _yuitest_coverfunc("graphics-vml", "getter", 1727);
_yuitest_coverline("graphics-vml", 1729);
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
			_yuitest_coverfunc("graphics-vml", "valueFn", 1760);
_yuitest_coverline("graphics-vml", 1762);
return Y.guid();
		},

		setter: function(val)
		{
			_yuitest_coverfunc("graphics-vml", "setter", 1765);
_yuitest_coverline("graphics-vml", 1767);
var node = this.node;
			_yuitest_coverline("graphics-vml", 1768);
if(node)
			{
				_yuitest_coverline("graphics-vml", 1770);
node.setAttribute("id", val);
			}
			_yuitest_coverline("graphics-vml", 1772);
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
			_yuitest_coverfunc("graphics-vml", "setter", 1801);
_yuitest_coverline("graphics-vml", 1802);
var node = this.node,
				visibility = val ? "visible" : "hidden";
			_yuitest_coverline("graphics-vml", 1804);
if(node)
			{
				_yuitest_coverline("graphics-vml", 1806);
node.style.visibility = visibility;
			}
			_yuitest_coverline("graphics-vml", 1808);
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
			_yuitest_coverfunc("graphics-vml", "setter", 1858);
_yuitest_coverline("graphics-vml", 1860);
var i,
				fill,
				tmpl = this.get("fill") || this._getDefaultFill();
			
			_yuitest_coverline("graphics-vml", 1864);
if(val)
			{
				//ensure, fill type is solid if color is explicitly passed.
				_yuitest_coverline("graphics-vml", 1867);
if(val.hasOwnProperty("color"))
				{
					_yuitest_coverline("graphics-vml", 1869);
val.type = "solid";
				}
				_yuitest_coverline("graphics-vml", 1871);
for(i in val)
				{
					_yuitest_coverline("graphics-vml", 1873);
if(val.hasOwnProperty(i))
					{   
						_yuitest_coverline("graphics-vml", 1875);
tmpl[i] = val[i];
					}
				}
			}
			_yuitest_coverline("graphics-vml", 1879);
fill = tmpl;
			_yuitest_coverline("graphics-vml", 1880);
if(fill && fill.color)
			{
				_yuitest_coverline("graphics-vml", 1882);
if(fill.color === undefined || fill.color == "none")
				{
					_yuitest_coverline("graphics-vml", 1884);
fill.color = null;
				}
			}
			_yuitest_coverline("graphics-vml", 1887);
this._fillFlag = true;
            _yuitest_coverline("graphics-vml", 1888);
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
			_yuitest_coverfunc("graphics-vml", "setter", 1923);
_yuitest_coverline("graphics-vml", 1925);
var i,
				stroke,
                wt,
				tmpl = this.get("stroke") || this._getDefaultStroke();
			_yuitest_coverline("graphics-vml", 1929);
if(val)
			{
                _yuitest_coverline("graphics-vml", 1931);
if(val.hasOwnProperty("weight"))
                {
                    _yuitest_coverline("graphics-vml", 1933);
wt = parseInt(val.weight, 10);
                    _yuitest_coverline("graphics-vml", 1934);
if(!isNaN(wt))
                    {
                        _yuitest_coverline("graphics-vml", 1936);
val.weight = wt;
                    }
                }
				_yuitest_coverline("graphics-vml", 1939);
for(i in val)
				{
					_yuitest_coverline("graphics-vml", 1941);
if(val.hasOwnProperty(i))
					{   
						_yuitest_coverline("graphics-vml", 1943);
tmpl[i] = val[i];
					}
				}
			}
			_yuitest_coverline("graphics-vml", 1947);
stroke = tmpl;
            _yuitest_coverline("graphics-vml", 1948);
this._strokeFlag = true;
			_yuitest_coverline("graphics-vml", 1949);
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
			_yuitest_coverfunc("graphics-vml", "getter", 1978);
_yuitest_coverline("graphics-vml", 1980);
return this.node;
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
			_yuitest_coverfunc("graphics-vml", "getter", 1993);
_yuitest_coverline("graphics-vml", 1995);
return this._graphic;
		}
	}
};
_yuitest_coverline("graphics-vml", 1999);
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
_yuitest_coverline("graphics-vml", 2010);
VMLPath = function()
{
	_yuitest_coverfunc("graphics-vml", "VMLPath", 2010);
_yuitest_coverline("graphics-vml", 2012);
VMLPath.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("graphics-vml", 2015);
VMLPath.NAME = "vmlPath";
_yuitest_coverline("graphics-vml", 2016);
Y.extend(VMLPath, Y.VMLShape, {
    /*
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function()
    {
        _yuitest_coverfunc("graphics-vml", "end", 2022);
_yuitest_coverline("graphics-vml", 2024);
this._closePath();
        _yuitest_coverline("graphics-vml", 2025);
this._updateTransform();
    }
});
_yuitest_coverline("graphics-vml", 2028);
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
			_yuitest_coverfunc("graphics-vml", "getter", 2036);
_yuitest_coverline("graphics-vml", 2038);
var val = Math.max(this._right - this._left, 0);
			_yuitest_coverline("graphics-vml", 2039);
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
			_yuitest_coverfunc("graphics-vml", "getter", 2050);
_yuitest_coverline("graphics-vml", 2052);
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
			_yuitest_coverfunc("graphics-vml", "getter", 2066);
_yuitest_coverline("graphics-vml", 2068);
return this._path;
		}
	}
});
_yuitest_coverline("graphics-vml", 2072);
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
_yuitest_coverline("graphics-vml", 2083);
VMLRect = function()
{
	_yuitest_coverfunc("graphics-vml", "VMLRect", 2083);
_yuitest_coverline("graphics-vml", 2085);
VMLRect.superclass.constructor.apply(this, arguments);
};
_yuitest_coverline("graphics-vml", 2087);
VMLRect.NAME = "vmlRect"; 
_yuitest_coverline("graphics-vml", 2088);
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
_yuitest_coverline("graphics-vml", 2098);
VMLRect.ATTRS = Y.VMLShape.ATTRS;
_yuitest_coverline("graphics-vml", 2099);
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
_yuitest_coverline("graphics-vml", 2110);
VMLEllipse = function()
{
	_yuitest_coverfunc("graphics-vml", "VMLEllipse", 2110);
_yuitest_coverline("graphics-vml", 2112);
VMLEllipse.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("graphics-vml", 2115);
VMLEllipse.NAME = "vmlEllipse";

_yuitest_coverline("graphics-vml", 2117);
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
_yuitest_coverline("graphics-vml", 2127);
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
			_yuitest_coverfunc("graphics-vml", "getter", 2137);
_yuitest_coverline("graphics-vml", 2139);
var val = this.get("width");
			_yuitest_coverline("graphics-vml", 2140);
val = Math.round((val/2) * 100)/100;
			_yuitest_coverline("graphics-vml", 2141);
return val;
		},
		
		setter: function(val)
		{
			_yuitest_coverfunc("graphics-vml", "setter", 2144);
_yuitest_coverline("graphics-vml", 2146);
var w = val * 2; 
			_yuitest_coverline("graphics-vml", 2147);
this.set("width", w);
			_yuitest_coverline("graphics-vml", 2148);
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
			_yuitest_coverfunc("graphics-vml", "getter", 2162);
_yuitest_coverline("graphics-vml", 2164);
var val = this.get("height");
			_yuitest_coverline("graphics-vml", 2165);
val = Math.round((val/2) * 100)/100;
			_yuitest_coverline("graphics-vml", 2166);
return val;
		},

		setter: function(val)
		{
			_yuitest_coverfunc("graphics-vml", "setter", 2169);
_yuitest_coverline("graphics-vml", 2171);
var h = val * 2;
			_yuitest_coverline("graphics-vml", 2172);
this.set("height", h);
			_yuitest_coverline("graphics-vml", 2173);
return val;
		}
	}
});
_yuitest_coverline("graphics-vml", 2177);
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
_yuitest_coverline("graphics-vml", 2188);
VMLCircle = function(cfg)
{
	_yuitest_coverfunc("graphics-vml", "VMLCircle", 2188);
_yuitest_coverline("graphics-vml", 2190);
VMLCircle.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("graphics-vml", 2193);
VMLCircle.NAME = "vmlCircle";

_yuitest_coverline("graphics-vml", 2195);
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

_yuitest_coverline("graphics-vml", 2206);
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
            _yuitest_coverfunc("graphics-vml", "setter", 2226);
_yuitest_coverline("graphics-vml", 2228);
this.set("radius", val/2);
            _yuitest_coverline("graphics-vml", 2229);
return val;
        },

		getter: function()
		{   
			_yuitest_coverfunc("graphics-vml", "getter", 2232);
_yuitest_coverline("graphics-vml", 2234);
var radius = this.get("radius"),
			val = radius && radius > 0 ? radius * 2 : 0;
			_yuitest_coverline("graphics-vml", 2236);
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
            _yuitest_coverfunc("graphics-vml", "setter", 2247);
_yuitest_coverline("graphics-vml", 2249);
this.set("radius", val/2);
            _yuitest_coverline("graphics-vml", 2250);
return val;
        },

		getter: function()
		{   
			_yuitest_coverfunc("graphics-vml", "getter", 2253);
_yuitest_coverline("graphics-vml", 2255);
var radius = this.get("radius"),
			val = radius && radius > 0 ? radius * 2 : 0;
			_yuitest_coverline("graphics-vml", 2257);
return val;
		}
	}
});
_yuitest_coverline("graphics-vml", 2261);
Y.VMLCircle = VMLCircle;
/**
 * Draws pie slices
 *
 * @module graphics
 * @class VMLPieSlice
 * @constructor
 */
_yuitest_coverline("graphics-vml", 2269);
VMLPieSlice = function()
{
	_yuitest_coverfunc("graphics-vml", "VMLPieSlice", 2269);
_yuitest_coverline("graphics-vml", 2271);
VMLPieSlice.superclass.constructor.apply(this, arguments);
};
_yuitest_coverline("graphics-vml", 2273);
VMLPieSlice.NAME = "vmlPieSlice";
_yuitest_coverline("graphics-vml", 2274);
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
        _yuitest_coverfunc("graphics-vml", "_draw", 2290);
_yuitest_coverline("graphics-vml", 2292);
var x = this.get("cx"),
            y = this.get("cy"),
            startAngle = this.get("startAngle"),
            arc = this.get("arc"),
            radius = this.get("radius");
        _yuitest_coverline("graphics-vml", 2297);
this.clear();
        _yuitest_coverline("graphics-vml", 2298);
this.drawWedge(x, y, startAngle, arc, radius);
		_yuitest_coverline("graphics-vml", 2299);
this.end();
	}
 }, Y.VMLDrawing.prototype));
_yuitest_coverline("graphics-vml", 2302);
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
_yuitest_coverline("graphics-vml", 2340);
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
_yuitest_coverline("graphics-vml", 2351);
VMLGraphic = function() {
    _yuitest_coverfunc("graphics-vml", "VMLGraphic", 2351);
_yuitest_coverline("graphics-vml", 2352);
VMLGraphic.superclass.constructor.apply(this, arguments);    
};

_yuitest_coverline("graphics-vml", 2355);
VMLGraphic.NAME = "vmlGraphic";

_yuitest_coverline("graphics-vml", 2357);
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
			_yuitest_coverfunc("graphics-vml", "valueFn", 2373);
_yuitest_coverline("graphics-vml", 2375);
return Y.guid();
		},

		setter: function(val)
		{
			_yuitest_coverfunc("graphics-vml", "setter", 2378);
_yuitest_coverline("graphics-vml", 2380);
var node = this._node;
			_yuitest_coverline("graphics-vml", 2381);
if(node)
			{
				_yuitest_coverline("graphics-vml", 2383);
node.setAttribute("id", val);
			}
			_yuitest_coverline("graphics-vml", 2385);
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
            _yuitest_coverfunc("graphics-vml", "getter", 2399);
_yuitest_coverline("graphics-vml", 2401);
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
            _yuitest_coverfunc("graphics-vml", "getter", 2414);
_yuitest_coverline("graphics-vml", 2416);
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
            _yuitest_coverfunc("graphics-vml", "getter", 2429);
_yuitest_coverline("graphics-vml", 2431);
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
            _yuitest_coverfunc("graphics-vml", "setter", 2442);
_yuitest_coverline("graphics-vml", 2444);
if(this._node)
            {
                _yuitest_coverline("graphics-vml", 2446);
this._node.style.width = val + "px";
            }
            _yuitest_coverline("graphics-vml", 2448);
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
            _yuitest_coverfunc("graphics-vml", "setter", 2459);
_yuitest_coverline("graphics-vml", 2461);
if(this._node)
            {
                _yuitest_coverline("graphics-vml", 2463);
this._node.style.height = val + "px";
            }
            _yuitest_coverline("graphics-vml", 2465);
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
        getter: function()
        {
            _yuitest_coverfunc("graphics-vml", "getter", 2523);
_yuitest_coverline("graphics-vml", 2525);
return this._resizeDown;
        },

        setter: function(val)
        {
            _yuitest_coverfunc("graphics-vml", "setter", 2528);
_yuitest_coverline("graphics-vml", 2530);
this._resizeDown = val;
            _yuitest_coverline("graphics-vml", 2531);
if(this._node)
            {
                _yuitest_coverline("graphics-vml", 2533);
this._redraw();
            }
            _yuitest_coverline("graphics-vml", 2535);
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
            _yuitest_coverfunc("graphics-vml", "getter", 2546);
_yuitest_coverline("graphics-vml", 2548);
return this._x;
        },

        setter: function(val)
        {
            _yuitest_coverfunc("graphics-vml", "setter", 2551);
_yuitest_coverline("graphics-vml", 2553);
this._x = val;
            _yuitest_coverline("graphics-vml", 2554);
if(this._node)
            {
                _yuitest_coverline("graphics-vml", 2556);
this._node.style.left = val + "px";
            }
            _yuitest_coverline("graphics-vml", 2558);
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
            _yuitest_coverfunc("graphics-vml", "getter", 2569);
_yuitest_coverline("graphics-vml", 2571);
return this._y;
        },

        setter: function(val)
        {
            _yuitest_coverfunc("graphics-vml", "setter", 2574);
_yuitest_coverline("graphics-vml", 2576);
this._y = val;
            _yuitest_coverline("graphics-vml", 2577);
if(this._node)
            {
                _yuitest_coverline("graphics-vml", 2579);
this._node.style.top = val + "px";
            }
            _yuitest_coverline("graphics-vml", 2581);
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
            _yuitest_coverfunc("graphics-vml", "setter", 2601);
_yuitest_coverline("graphics-vml", 2603);
this._toggleVisible(val);
            _yuitest_coverline("graphics-vml", 2604);
return val;
        }
    }
};

_yuitest_coverline("graphics-vml", 2609);
Y.extend(VMLGraphic, Y.GraphicBase, {
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
        _yuitest_coverfunc("graphics-vml", "getXY", 2634);
_yuitest_coverline("graphics-vml", 2636);
var node = this.parentNode,
            x = this.get("x"),
            y = this.get("y"),
            xy;
        _yuitest_coverline("graphics-vml", 2640);
if(node)
        {
            _yuitest_coverline("graphics-vml", 2642);
xy = Y.one(node).getXY();
            _yuitest_coverline("graphics-vml", 2643);
xy[0] += x;
            _yuitest_coverline("graphics-vml", 2644);
xy[1] += y;
        }
        else
        {
            _yuitest_coverline("graphics-vml", 2648);
xy = Y.DOM._getOffset(this._node);
        }
        _yuitest_coverline("graphics-vml", 2650);
return xy;
    },

    /**
     * @private
     * @property _resizeDown 
     * @type Boolean
     */
    _resizeDown: false,

    /**
     * Initializes the class.
     *
     * @method initializer
     * @private
     */
    initializer: function(config) {
        _yuitest_coverfunc("graphics-vml", "initializer", 2666);
_yuitest_coverline("graphics-vml", 2667);
var render = this.get("render"),
            visibility = this.get("visible") ? "visible" : "hidden";
        _yuitest_coverline("graphics-vml", 2669);
this._shapes = {};
		_yuitest_coverline("graphics-vml", 2670);
this._contentBounds = {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        };
        _yuitest_coverline("graphics-vml", 2676);
this._node = DOCUMENT.createElement('div');
        _yuitest_coverline("graphics-vml", 2677);
this._node.style.position = "absolute";
        _yuitest_coverline("graphics-vml", 2678);
this._node.style.left = this.get("x") + "px";
        _yuitest_coverline("graphics-vml", 2679);
this._node.style.top = this.get("y") + "px";
        _yuitest_coverline("graphics-vml", 2680);
this._node.style.visibility = visibility;
        _yuitest_coverline("graphics-vml", 2681);
this._node.setAttribute("id", this.get("id"));
        _yuitest_coverline("graphics-vml", 2682);
this._contentNode = this._createGraphic();
        _yuitest_coverline("graphics-vml", 2683);
this._contentNode.style.position = "absolute";
        _yuitest_coverline("graphics-vml", 2684);
this._contentNode.style.left = "0px";
        _yuitest_coverline("graphics-vml", 2685);
this._contentNode.style.top = "0px";
        _yuitest_coverline("graphics-vml", 2686);
this._contentNode.style.visibility = visibility;
        _yuitest_coverline("graphics-vml", 2687);
this._node.appendChild(this._contentNode);
        _yuitest_coverline("graphics-vml", 2688);
if(render)
        {
            _yuitest_coverline("graphics-vml", 2690);
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
        _yuitest_coverfunc("graphics-vml", "render", 2700);
_yuitest_coverline("graphics-vml", 2701);
var parentNode = Y.one(render),
            w = this.get("width") || parseInt(parentNode.getComputedStyle("width"), 10),
            h = this.get("height") || parseInt(parentNode.getComputedStyle("height"), 10);
        _yuitest_coverline("graphics-vml", 2704);
parentNode = parentNode || DOCUMENT.body;
        _yuitest_coverline("graphics-vml", 2705);
parentNode.appendChild(this._node);
        _yuitest_coverline("graphics-vml", 2706);
this.parentNode = parentNode;
        _yuitest_coverline("graphics-vml", 2707);
this.set("width", w);
        _yuitest_coverline("graphics-vml", 2708);
this.set("height", h);
        _yuitest_coverline("graphics-vml", 2709);
return this;
    },

    /**
     * Removes all nodes.
     *
     * @method destroy
     */
    destroy: function()
    {
        _yuitest_coverfunc("graphics-vml", "destroy", 2717);
_yuitest_coverline("graphics-vml", 2719);
this.clear();
        _yuitest_coverline("graphics-vml", 2720);
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
        _yuitest_coverfunc("graphics-vml", "addShape", 2730);
_yuitest_coverline("graphics-vml", 2732);
cfg.graphic = this;
        _yuitest_coverline("graphics-vml", 2733);
if(!this.get("visible"))
        {
            _yuitest_coverline("graphics-vml", 2735);
cfg.visible = false;
        }
        _yuitest_coverline("graphics-vml", 2737);
var shapeClass = this._getShapeClass(cfg.type),
            shape = new shapeClass(cfg);
        _yuitest_coverline("graphics-vml", 2739);
this._appendShape(shape);
        _yuitest_coverline("graphics-vml", 2740);
shape._appendStrokeAndFill();
        _yuitest_coverline("graphics-vml", 2741);
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
        _yuitest_coverfunc("graphics-vml", "_appendShape", 2751);
_yuitest_coverline("graphics-vml", 2753);
var node = shape.node,
            parentNode = this._frag || this._contentNode;
        _yuitest_coverline("graphics-vml", 2755);
if(this.get("autoDraw")) 
        {
            _yuitest_coverline("graphics-vml", 2757);
parentNode.appendChild(node);
        }
        else
        {
            _yuitest_coverline("graphics-vml", 2761);
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
        _yuitest_coverfunc("graphics-vml", "removeShape", 2771);
_yuitest_coverline("graphics-vml", 2773);
if(!(shape instanceof VMLShape))
        {
            _yuitest_coverline("graphics-vml", 2775);
if(Y_LANG.isString(shape))
            {
                _yuitest_coverline("graphics-vml", 2777);
shape = this._shapes[shape];
            }
        }
        _yuitest_coverline("graphics-vml", 2780);
if(shape && (shape instanceof VMLShape))
        {
            _yuitest_coverline("graphics-vml", 2782);
shape._destroy();
            _yuitest_coverline("graphics-vml", 2783);
this._shapes[shape.get("id")] = null;
            _yuitest_coverline("graphics-vml", 2784);
delete this._shapes[shape.get("id")];
        }
        _yuitest_coverline("graphics-vml", 2786);
if(this.get("autoDraw"))
        {
            _yuitest_coverline("graphics-vml", 2788);
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
        _yuitest_coverfunc("graphics-vml", "removeAllShapes", 2797);
_yuitest_coverline("graphics-vml", 2799);
var shapes = this._shapes,
            i;
        _yuitest_coverline("graphics-vml", 2801);
for(i in shapes)
        {
            _yuitest_coverline("graphics-vml", 2803);
if(shapes.hasOwnProperty(i))
            {
                _yuitest_coverline("graphics-vml", 2805);
shapes[i].destroy();
            }
        }
        _yuitest_coverline("graphics-vml", 2808);
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
        _yuitest_coverfunc("graphics-vml", "_removeChildren", 2818);
_yuitest_coverline("graphics-vml", 2820);
if(node.hasChildNodes())
        {
            _yuitest_coverline("graphics-vml", 2822);
var child;
            _yuitest_coverline("graphics-vml", 2823);
while(node.firstChild)
            {
                _yuitest_coverline("graphics-vml", 2825);
child = node.firstChild;
                _yuitest_coverline("graphics-vml", 2826);
this._removeChildren(child);
                _yuitest_coverline("graphics-vml", 2827);
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
        _yuitest_coverfunc("graphics-vml", "clear", 2837);
_yuitest_coverline("graphics-vml", 2838);
this.removeAllShapes();
        _yuitest_coverline("graphics-vml", 2839);
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
        _yuitest_coverfunc("graphics-vml", "_toggleVisible", 2849);
_yuitest_coverline("graphics-vml", 2851);
var i,
            shapes = this._shapes,
            visibility = val ? "visible" : "hidden";
        _yuitest_coverline("graphics-vml", 2854);
if(shapes)
        {
            _yuitest_coverline("graphics-vml", 2856);
for(i in shapes)
            {
                _yuitest_coverline("graphics-vml", 2858);
if(shapes.hasOwnProperty(i))
                {
                    _yuitest_coverline("graphics-vml", 2860);
shapes[i].set("visible", val);
                }
            }
        }
        _yuitest_coverline("graphics-vml", 2864);
if(this._contentNode)
        {
            _yuitest_coverline("graphics-vml", 2866);
this._contentNode.style.visibility = visibility;
        }
        _yuitest_coverline("graphics-vml", 2868);
if(this._node)
        {
            _yuitest_coverline("graphics-vml", 2870);
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
        _yuitest_coverfunc("graphics-vml", "setSize", 2881);
_yuitest_coverline("graphics-vml", 2882);
w = Math.round(w);
        _yuitest_coverline("graphics-vml", 2883);
h = Math.round(h);
        _yuitest_coverline("graphics-vml", 2884);
this._node.style.width = w + 'px';
        _yuitest_coverline("graphics-vml", 2885);
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
        _yuitest_coverfunc("graphics-vml", "setPosition", 2895);
_yuitest_coverline("graphics-vml", 2897);
x = Math.round(x);
        _yuitest_coverline("graphics-vml", 2898);
y = Math.round(y);
        _yuitest_coverline("graphics-vml", 2899);
this._node.style.left = x + "px";
        _yuitest_coverline("graphics-vml", 2900);
this._node.style.top = y + "px";
    },

    /**
     * Creates a group element
     *
     * @method _createGraphic
     * @private
     */
    _createGraphic: function() {
        _yuitest_coverfunc("graphics-vml", "_createGraphic", 2909);
_yuitest_coverline("graphics-vml", 2910);
var group = DOCUMENT.createElement('<group xmlns="urn:schemas-microsft.com:vml" style="behavior:url(#default#VML);display:block;position:absolute;top:0px;left:0px;zoom:1;" />');
        _yuitest_coverline("graphics-vml", 2911);
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
        _yuitest_coverfunc("graphics-vml", "_createGraphicNode", 2923);
_yuitest_coverline("graphics-vml", 2925);
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
        _yuitest_coverfunc("graphics-vml", "getShapeById", 2936);
_yuitest_coverline("graphics-vml", 2938);
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
        _yuitest_coverfunc("graphics-vml", "_getShapeClass", 2949);
_yuitest_coverline("graphics-vml", 2951);
var shape = this._shapeClass[val];
        _yuitest_coverline("graphics-vml", 2952);
if(shape)
        {
            _yuitest_coverline("graphics-vml", 2954);
return shape;
        }
        _yuitest_coverline("graphics-vml", 2956);
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
        _yuitest_coverfunc("graphics-vml", "batch", 2980);
_yuitest_coverline("graphics-vml", 2982);
var autoDraw = this.get("autoDraw");
        _yuitest_coverline("graphics-vml", 2983);
this.set("autoDraw", false);
        _yuitest_coverline("graphics-vml", 2984);
method.apply();
        _yuitest_coverline("graphics-vml", 2985);
this._redraw();
        _yuitest_coverline("graphics-vml", 2986);
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
        _yuitest_coverfunc("graphics-vml", "_getDocFrag", 2996);
_yuitest_coverline("graphics-vml", 2998);
if(!this._frag)
        {
            _yuitest_coverline("graphics-vml", 3000);
this._frag = DOCUMENT.createDocumentFragment();
        }
        _yuitest_coverline("graphics-vml", 3002);
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
        _yuitest_coverfunc("graphics-vml", "addToRedrawQueue", 3012);
_yuitest_coverline("graphics-vml", 3014);
var shapeBox,
            box;
        _yuitest_coverline("graphics-vml", 3016);
this._shapes[shape.get("id")] = shape;
        _yuitest_coverline("graphics-vml", 3017);
if(!this._resizeDown)
        {
            _yuitest_coverline("graphics-vml", 3019);
shapeBox = shape.getBounds();
            _yuitest_coverline("graphics-vml", 3020);
box = this._contentBounds;
            _yuitest_coverline("graphics-vml", 3021);
box.left = box.left < shapeBox.left ? box.left : shapeBox.left;
            _yuitest_coverline("graphics-vml", 3022);
box.top = box.top < shapeBox.top ? box.top : shapeBox.top;
            _yuitest_coverline("graphics-vml", 3023);
box.right = box.right > shapeBox.right ? box.right : shapeBox.right;
            _yuitest_coverline("graphics-vml", 3024);
box.bottom = box.bottom > shapeBox.bottom ? box.bottom : shapeBox.bottom;
            _yuitest_coverline("graphics-vml", 3025);
box.width = box.right - box.left;
            _yuitest_coverline("graphics-vml", 3026);
box.height = box.bottom - box.top;
            _yuitest_coverline("graphics-vml", 3027);
this._contentBounds = box;
        }
        _yuitest_coverline("graphics-vml", 3029);
if(this.get("autoDraw")) 
        {
            _yuitest_coverline("graphics-vml", 3031);
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
        _yuitest_coverfunc("graphics-vml", "_redraw", 3041);
_yuitest_coverline("graphics-vml", 3043);
var autoSize = this.get("autoSize"),
            preserveAspectRatio,
            nodeWidth,
            nodeHeight,
            xCoordOrigin = 0,
            yCoordOrigin = 0,
            box = this._resizeDown ? this._getUpdatedContentBounds() : this._contentBounds,
            left = box.left,
            right = box.right,
            top = box.top,
            bottom = box.bottom,
            contentWidth = box.width,
            contentHeight = box.height,
            aspectRatio,
            xCoordSize,
            yCoordSize,
            scaledWidth,
            scaledHeight;
        _yuitest_coverline("graphics-vml", 3061);
if(autoSize)
        {
            _yuitest_coverline("graphics-vml", 3063);
if(autoSize == "sizeContentToGraphic")
            {
                _yuitest_coverline("graphics-vml", 3065);
preserveAspectRatio = this.get("preserveAspectRatio");
                _yuitest_coverline("graphics-vml", 3066);
contentWidth = box.width;
                _yuitest_coverline("graphics-vml", 3067);
contentHeight = box.height;
                _yuitest_coverline("graphics-vml", 3068);
nodeWidth = this.get("width");
                _yuitest_coverline("graphics-vml", 3069);
nodeHeight = this.get("height");
                _yuitest_coverline("graphics-vml", 3070);
if(preserveAspectRatio == "none" || contentWidth/contentHeight === nodeWidth/nodeHeight)
                {
                    _yuitest_coverline("graphics-vml", 3072);
xCoordOrigin = left;
                    _yuitest_coverline("graphics-vml", 3073);
yCoordOrigin = top;
                    _yuitest_coverline("graphics-vml", 3074);
xCoordSize = contentWidth;
                    _yuitest_coverline("graphics-vml", 3075);
yCoordSize = contentHeight;
                }
                else 
                {
                    _yuitest_coverline("graphics-vml", 3079);
if(contentWidth * nodeHeight/contentHeight > nodeWidth)
                    {
                        _yuitest_coverline("graphics-vml", 3081);
aspectRatio = nodeHeight/nodeWidth;
                        _yuitest_coverline("graphics-vml", 3082);
xCoordSize = contentWidth;
                        _yuitest_coverline("graphics-vml", 3083);
yCoordSize = contentWidth * aspectRatio;
                        _yuitest_coverline("graphics-vml", 3084);
scaledHeight = (nodeWidth * (contentHeight/contentWidth)) * (yCoordSize/nodeHeight);
                        _yuitest_coverline("graphics-vml", 3085);
yCoordOrigin = this._calculateCoordOrigin(preserveAspectRatio.slice(5).toLowerCase(), scaledHeight, yCoordSize);
                        _yuitest_coverline("graphics-vml", 3086);
yCoordOrigin = top + yCoordOrigin;
                        _yuitest_coverline("graphics-vml", 3087);
xCoordOrigin = left;
                    }
                    else
                    {
                        _yuitest_coverline("graphics-vml", 3091);
aspectRatio = nodeWidth/nodeHeight;
                        _yuitest_coverline("graphics-vml", 3092);
xCoordSize = contentHeight * aspectRatio;
                        _yuitest_coverline("graphics-vml", 3093);
yCoordSize = contentHeight;
                        _yuitest_coverline("graphics-vml", 3094);
scaledWidth = (nodeHeight * (contentWidth/contentHeight)) * (xCoordSize/nodeWidth);
                        _yuitest_coverline("graphics-vml", 3095);
xCoordOrigin = this._calculateCoordOrigin(preserveAspectRatio.slice(1, 4).toLowerCase(), scaledWidth, xCoordSize);
                        _yuitest_coverline("graphics-vml", 3096);
xCoordOrigin = xCoordOrigin + left;
                        _yuitest_coverline("graphics-vml", 3097);
yCoordOrigin = top;
                    }
                }
                _yuitest_coverline("graphics-vml", 3100);
this._contentNode.style.width = nodeWidth + "px";
                _yuitest_coverline("graphics-vml", 3101);
this._contentNode.style.height = nodeHeight + "px";
                _yuitest_coverline("graphics-vml", 3102);
this._contentNode.coordOrigin = xCoordOrigin + ", " + yCoordOrigin;
            }
            else 
            {
                _yuitest_coverline("graphics-vml", 3106);
xCoordSize = contentWidth;
                _yuitest_coverline("graphics-vml", 3107);
yCoordSize = contentHeight;
                _yuitest_coverline("graphics-vml", 3108);
this._contentNode.style.width = contentWidth + "px";
                _yuitest_coverline("graphics-vml", 3109);
this._contentNode.style.height = contentHeight + "px";
                _yuitest_coverline("graphics-vml", 3110);
this._state.width = contentWidth;
                _yuitest_coverline("graphics-vml", 3111);
this._state.height =  contentHeight;
                _yuitest_coverline("graphics-vml", 3112);
if(this._node)
                {
                    _yuitest_coverline("graphics-vml", 3114);
this._node.style.width = contentWidth + "px";
                    _yuitest_coverline("graphics-vml", 3115);
this._node.style.height = contentHeight + "px";
                }

            }
            _yuitest_coverline("graphics-vml", 3119);
this._contentNode.coordSize = xCoordSize + ", " + yCoordSize;
        }
        else
        {
            _yuitest_coverline("graphics-vml", 3123);
this._contentNode.style.width = right + "px";
            _yuitest_coverline("graphics-vml", 3124);
this._contentNode.style.height = bottom + "px";
            _yuitest_coverline("graphics-vml", 3125);
this._contentNode.coordSize = right + ", " + bottom;
        }
        _yuitest_coverline("graphics-vml", 3127);
if(this._frag)
        {
            _yuitest_coverline("graphics-vml", 3129);
this._contentNode.appendChild(this._frag);
            _yuitest_coverline("graphics-vml", 3130);
this._frag = null;
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
        _yuitest_coverfunc("graphics-vml", "_calculateCoordOrigin", 3144);
_yuitest_coverline("graphics-vml", 3146);
var coord;
        _yuitest_coverline("graphics-vml", 3147);
switch(position)
        {
            case "min" :
                _yuitest_coverline("graphics-vml", 3150);
coord = 0;
            _yuitest_coverline("graphics-vml", 3151);
break;
            case "mid" :
                _yuitest_coverline("graphics-vml", 3153);
coord = (size - coordsSize)/2;
            _yuitest_coverline("graphics-vml", 3154);
break;
            case "max" :
                _yuitest_coverline("graphics-vml", 3156);
coord = (size - coordsSize);
            _yuitest_coverline("graphics-vml", 3157);
break;
        }
        _yuitest_coverline("graphics-vml", 3159);
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
        _yuitest_coverfunc("graphics-vml", "_getUpdatedContentBounds", 3169);
_yuitest_coverline("graphics-vml", 3171);
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
        _yuitest_coverline("graphics-vml", 3181);
for(i in queue)
        {
            _yuitest_coverline("graphics-vml", 3183);
if(queue.hasOwnProperty(i))
            {
                _yuitest_coverline("graphics-vml", 3185);
shape = queue[i];
                _yuitest_coverline("graphics-vml", 3186);
bounds = shape.getBounds();
                _yuitest_coverline("graphics-vml", 3187);
box.left = Math.min(box.left, bounds.left);
                _yuitest_coverline("graphics-vml", 3188);
box.top = Math.min(box.top, bounds.top);
                _yuitest_coverline("graphics-vml", 3189);
box.right = Math.max(box.right, bounds.right);
                _yuitest_coverline("graphics-vml", 3190);
box.bottom = Math.max(box.bottom, bounds.bottom);
            }
        }
        _yuitest_coverline("graphics-vml", 3193);
box.width = box.right - box.left;
        _yuitest_coverline("graphics-vml", 3194);
box.height = box.bottom - box.top;
        _yuitest_coverline("graphics-vml", 3195);
this._contentBounds = box;
        _yuitest_coverline("graphics-vml", 3196);
return box;
    }
});
_yuitest_coverline("graphics-vml", 3199);
Y.VMLGraphic = VMLGraphic;



}, '@VERSION@', {"requires": ["graphics"]});
