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
_yuitest_coverage["build/graphics-svg/graphics-svg.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/graphics-svg/graphics-svg.js",
    code: []
};
_yuitest_coverage["build/graphics-svg/graphics-svg.js"].code=["YUI.add('graphics-svg', function (Y, NAME) {","","var SHAPE = \"svgShape\",","	Y_LANG = Y.Lang,","	AttributeLite = Y.AttributeLite,","	SVGGraphic,","    SVGShape,","	SVGCircle,","	SVGRect,","	SVGPath,","	SVGEllipse,","    SVGPieSlice,","    DOCUMENT = Y.config.doc,","    _getClassName = Y.ClassNameManager.getClassName;","","function SVGDrawing(){}","","/**"," * <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> implementation of the <a href=\"Drawing.html\">`Drawing`</a> class. "," * `SVGDrawing` is not intended to be used directly. Instead, use the <a href=\"Drawing.html\">`Drawing`</a> class. "," * If the browser has <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities, the <a href=\"Drawing.html\">`Drawing`</a> "," * class will point to the `SVGDrawing` class."," *"," * @module graphics"," * @class SVGDrawing"," * @constructor"," */","SVGDrawing.prototype = {","    /**","     * Current x position of the drawing.","     *","     * @property _currentX","     * @type Number","     * @private","     */","    _currentX: 0,","","    /**","     * Current y position of the drqwing.","     *","     * @property _currentY","     * @type Number","     * @private","     */","    _currentY: 0,","    ","    /**","     * Indicates the type of shape","     *","     * @private","     * @property _type","     * @readOnly","     * @type String","     */","    _type: \"path\",","   ","    /**","     * Draws a bezier curve.","     *","     * @method curveTo","     * @param {Number} cp1x x-coordinate for the first control point.","     * @param {Number} cp1y y-coordinate for the first control point.","     * @param {Number} cp2x x-coordinate for the second control point.","     * @param {Number} cp2y y-coordinate for the second control point.","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    curveTo: function(cp1x, cp1y, cp2x, cp2y, x, y) {","        var pathArrayLen,","            currentArray,","            w,","            h,","            pts,","            right,","            left,","            bottom,","            top;","        this._pathArray = this._pathArray || [];","        if(this._pathType !== \"C\")","        {","            this._pathType = \"C\";","            currentArray = [\"C\"];","            this._pathArray.push(currentArray);","        }","        else","        {","            currentArray = this._pathArray[Math.max(0, this._pathArray.length - 1)];","            if(!currentArray)","            {","                currentArray = [];","                this._pathArray.push(currentArray);","            }","        }","        pathArrayLen = this._pathArray.length - 1;","        this._pathArray[pathArrayLen] = this._pathArray[pathArrayLen].concat([Math.round(cp1x), Math.round(cp1y), Math.round(cp2x) , Math.round(cp2y), x, y]);","        right = Math.max(x, Math.max(cp1x, cp2x));","        bottom = Math.max(y, Math.max(cp1y, cp2y));","        left = Math.min(x, Math.min(cp1x, cp2x));","        top = Math.min(y, Math.min(cp1y, cp2y));","        w = Math.abs(right - left);","        h = Math.abs(bottom - top);","        pts = [[this._currentX, this._currentY] , [cp1x, cp1y], [cp2x, cp2y], [x, y]]; ","        this._setCurveBoundingBox(pts, w, h);","        this._currentX = x;","        this._currentY = y;","    },","","    /**","     * Draws a quadratic bezier curve.","     *","     * @method quadraticCurveTo","     * @param {Number} cpx x-coordinate for the control point.","     * @param {Number} cpy y-coordinate for the control point.","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    quadraticCurveTo: function(cpx, cpy, x, y) {","        var pathArrayLen,","            currentArray,","            w,","            h,","            pts,","            right,","            left,","            bottom,","            top;","        if(this._pathType !== \"Q\")","        {","            this._pathType = \"Q\";","            currentArray = [\"Q\"];","            this._pathArray.push(currentArray);","        }","        else","        {","            currentArray = this._pathArray[Math.max(0, this._pathArray.length - 1)];","            if(!currentArray)","            {","                currentArray = [];","                this._pathArray.push(currentArray);","            }","        }","        pathArrayLen = this._pathArray.length - 1;","        this._pathArray[pathArrayLen] = this._pathArray[pathArrayLen].concat([Math.round(cpx), Math.round(cpy), Math.round(x), Math.round(y)]);","        right = Math.max(x, cpx);","        bottom = Math.max(y, cpy);","        left = Math.min(x, cpx);","        top = Math.min(y, cpy);","        w = Math.abs(right - left);","        h = Math.abs(bottom - top);","        pts = [[this._currentX, this._currentY] , [cpx, cpy], [x, y]]; ","        this._setCurveBoundingBox(pts, w, h);","        this._currentX = x;","        this._currentY = y;","    },","","    /**","     * Draws a rectangle.","     *","     * @method drawRect","     * @param {Number} x x-coordinate","     * @param {Number} y y-coordinate","     * @param {Number} w width","     * @param {Number} h height","     */","    drawRect: function(x, y, w, h) {","        this.moveTo(x, y);","        this.lineTo(x + w, y);","        this.lineTo(x + w, y + h);","        this.lineTo(x, y + h);","        this.lineTo(x, y);","    },","","    /**","     * Draws a rectangle with rounded corners.","     * ","     * @method drawRect","     * @param {Number} x x-coordinate","     * @param {Number} y y-coordinate","     * @param {Number} w width","     * @param {Number} h height","     * @param {Number} ew width of the ellipse used to draw the rounded corners","     * @param {Number} eh height of the ellipse used to draw the rounded corners","     */","    drawRoundRect: function(x, y, w, h, ew, eh) {","        this.moveTo(x, y + eh);","        this.lineTo(x, y + h - eh);","        this.quadraticCurveTo(x, y + h, x + ew, y + h);","        this.lineTo(x + w - ew, y + h);","        this.quadraticCurveTo(x + w, y + h, x + w, y + h - eh);","        this.lineTo(x + w, y + eh);","        this.quadraticCurveTo(x + w, y, x + w - ew, y);","        this.lineTo(x + ew, y);","        this.quadraticCurveTo(x, y, x, y + eh);","	},","","    /**","     * Draws a circle.     ","     * ","     * @method drawCircle","     * @param {Number} x y-coordinate","     * @param {Number} y x-coordinate","     * @param {Number} r radius","     * @protected","     */","	drawCircle: function(x, y, radius) {","        var circum = radius * 2;","        this._drawingComplete = false;","        this._trackSize(x, y);","        this._trackSize(x + circum, y + circum);","        this._pathArray = this._pathArray || [];","        this._pathArray.push([\"M\", x + radius, y]);","        this._pathArray.push([\"A\",  radius, radius, 0, 1, 0, x + radius, y + circum]);","        this._pathArray.push([\"A\",  radius, radius, 0, 1, 0, x + radius, y]);","        this._currentX = x;","        this._currentY = y;","        return this;","    },","   ","    /**","     * Draws an ellipse.","     *","     * @method drawEllipse","     * @param {Number} x x-coordinate","     * @param {Number} y y-coordinate","     * @param {Number} w width","     * @param {Number} h height","     * @protected","     */","	drawEllipse: function(x, y, w, h) {","        var radius = w * 0.5,","            yRadius = h * 0.5;","        this._drawingComplete = false;","        this._trackSize(x, y);","        this._trackSize(x + w, y + h);","        this._pathArray = this._pathArray || [];","        this._pathArray.push([\"M\", x + radius, y]);","        this._pathArray.push([\"A\",  radius, yRadius, 0, 1, 0, x + radius, y + h]);","        this._pathArray.push([\"A\",  radius, yRadius, 0, 1, 0, x + radius, y]);","        this._currentX = x;","        this._currentY = y;","        return this;","    },","","    /**","     * Draws a diamond.     ","     * ","     * @method drawDiamond","     * @param {Number} x y-coordinate","     * @param {Number} y x-coordinate","     * @param {Number} width width","     * @param {Number} height height","     * @protected","     */","    drawDiamond: function(x, y, width, height)","    {","        var midWidth = width * 0.5,","            midHeight = height * 0.5;","        this.moveTo(x + midWidth, y);","        this.lineTo(x + width, y + midHeight);","        this.lineTo(x + midWidth, y + height);","        this.lineTo(x, y + midHeight);","        this.lineTo(x + midWidth, y);","        return this;","    },","","    /**","     * Draws a wedge.","     *","     * @method drawWedge","     * @param {Number} x x-coordinate of the wedge's center point","     * @param {Number} y y-coordinate of the wedge's center point","     * @param {Number} startAngle starting angle in degrees","     * @param {Number} arc sweep of the wedge. Negative values draw clockwise.","     * @param {Number} radius radius of wedge. If [optional] yRadius is defined, then radius is the x radius.","     * @param {Number} yRadius [optional] y radius for wedge.","     * @private","     */","    drawWedge: function(x, y, startAngle, arc, radius, yRadius)","    {","        var segs,","            segAngle,","            theta,","            angle,","            angleMid,","            ax,","            ay,","            bx,","            by,","            cx,","            cy,","            i = 0,","            diameter = radius * 2,","            currentArray,","            pathArrayLen;","        yRadius = yRadius || radius;","        if(this._pathType != \"M\")","        {","            this._pathType = \"M\";","            currentArray = [\"M\"];","            this._pathArray.push(currentArray);","        }","        else","        {","            currentArray = this._getCurrentArray(); ","        }","        pathArrayLen = this._pathArray.length - 1;","        this._pathArray[pathArrayLen].push(x); ","        this._pathArray[pathArrayLen].push(x); ","        ","        // limit sweep to reasonable numbers","        if(Math.abs(arc) > 360)","        {","            arc = 360;","        }","        ","        // First we calculate how many segments are needed","        // for a smooth arc.","        segs = Math.ceil(Math.abs(arc) / 45);","        ","        // Now calculate the sweep of each segment.","        segAngle = arc / segs;","        ","        // The math requires radians rather than degrees. To convert from degrees","        // use the formula (degrees/180)*Math.PI to get radians.","        theta = -(segAngle / 180) * Math.PI;","        ","        // convert angle startAngle to radians","        angle = (startAngle / 180) * Math.PI;","        if(segs > 0)","        {","            // draw a line from the center to the start of the curve","            ax = x + Math.cos(startAngle / 180 * Math.PI) * radius;","            ay = y + Math.sin(startAngle / 180 * Math.PI) * yRadius;","            this._pathType = \"L\";","            pathArrayLen++;","            this._pathArray[pathArrayLen] = [\"L\"];","            this._pathArray[pathArrayLen].push(Math.round(ax));","            this._pathArray[pathArrayLen].push(Math.round(ay));","            pathArrayLen++; ","            this._pathType = \"Q\";","            this._pathArray[pathArrayLen] = [\"Q\"];","            for(; i < segs; ++i)","            {","                angle += theta;","                angleMid = angle - (theta / 2);","                bx = x + Math.cos(angle) * radius;","                by = y + Math.sin(angle) * yRadius;","                cx = x + Math.cos(angleMid) * (radius / Math.cos(theta / 2));","                cy = y + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));","                this._pathArray[pathArrayLen].push(Math.round(cx));","                this._pathArray[pathArrayLen].push(Math.round(cy));","                this._pathArray[pathArrayLen].push(Math.round(bx));","                this._pathArray[pathArrayLen].push(Math.round(by));","            }","        }","        this._currentX = x;","        this._currentY = y;","        this._trackSize(diameter, diameter); ","        return this;","    },","    ","    /**","     * Draws a line segment using the current line style from the current drawing position to the specified x and y coordinates.","     * ","     * @method lineTo","     * @param {Number} point1 x-coordinate for the end point.","     * @param {Number} point2 y-coordinate for the end point.","     */","    lineTo: function(point1, point2, etc) {","        var args = arguments,","            i,","            len,","            pathArrayLen,","            currentArray;","        this._pathArray = this._pathArray || [];","        if (typeof point1 === 'string' || typeof point1 === 'number') {","            args = [[point1, point2]];","        }","        len = args.length;","        this._shapeType = \"path\";","        if(this._pathType !== \"L\")","        {","            this._pathType = \"L\";","            currentArray = ['L'];","            this._pathArray.push(currentArray);","        }","        else","        {","            currentArray = this._getCurrentArray();","        }","        pathArrayLen = this._pathArray.length - 1;","        for (i = 0; i < len; ++i) {","            this._pathArray[pathArrayLen].push(args[i][0]);","            this._pathArray[pathArrayLen].push(args[i][1]);","            this._currentX = args[i][0];","            this._currentY = args[i][1];","            this._trackSize.apply(this, args[i]);","        }","    },","","    /**","     * Moves the current drawing position to specified x and y coordinates.","     *","     * @method moveTo","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    moveTo: function(x, y) {","        var pathArrayLen,","            currentArray;","        this._pathArray = this._pathArray || [];","        this._pathType = \"M\";","        currentArray = [\"M\"];","        this._pathArray.push(currentArray);","        pathArrayLen = this._pathArray.length - 1;","        this._pathArray[pathArrayLen] = this._pathArray[pathArrayLen].concat([x, y]);","        this._currentX = x;","        this._currentY = y;","        this._trackSize(x, y);","    },"," ","    /**","     * Completes a drawing operation. ","     *","     * @method end","     */","    end: function()","    {","        this._closePath();","        this._graphic.addToRedrawQueue(this);    ","    },","","    /**","     * Clears the path.","     *","     * @method clear","     */","    clear: function()","    {","        this._currentX = 0;","        this._currentY = 0;","        this._width = 0;","        this._height = 0;","        this._left = 0;","        this._right = 0;","        this._top = 0;","        this._bottom = 0;","        this._pathArray = [];","        this._path = \"\";","    },","","    /**","     * Draws the path.","     *","     * @method _closePath","     * @private","     */","    _closePath: function()","    {","        var pathArray,","            segmentArray,","            pathType,","            len,","            val,","            val2,","            i,","            path = \"\",","            node = this.node,","            left = this._left,","            top = this._top,","            fill = this.get(\"fill\");","        if(this._pathArray)","        {","            pathArray = this._pathArray.concat();","            while(pathArray && pathArray.length > 0)","            {","                segmentArray = pathArray.shift();","                len = segmentArray.length;","                pathType = segmentArray[0];","                if(pathType === \"A\")","                {","                    path += pathType + segmentArray[1] + \",\" + segmentArray[2];","                }","                else if(pathType != \"z\")","                {","                    path += \" \" + pathType + (segmentArray[1] - left);","                }","                else","                {","                    path += \" z \";","                }","                switch(pathType)","                {","                    case \"L\" :","                    case \"M\" :","                    case \"Q\" :","                        for(i = 2; i < len; ++i)","                        {","                            val = (i % 2 === 0) ? top : left;","                            val = segmentArray[i] - val;","                            path += \", \" + val;","                        }","                    break;","                    case \"A\" :","                        val = \" \" + segmentArray[3] + \" \" + segmentArray[4];","                        val += \",\" + segmentArray[5] + \" \" + (segmentArray[6] - left);","                        val += \",\" + (segmentArray[7] - top);","                        path += \" \" + val;","                    break;","                    case \"C\" :","                        for(i = 2; i < len; ++i)","                        {","                            val = (i % 2 === 0) ? top : left;","                            val2 = segmentArray[i];","                            val2 -= val;","                            path += \" \" + val2;","                        }","                    break;","                }","            }","            if(fill && fill.color)","            {","                path += 'z';","            }","            if(path)","            {","                node.setAttribute(\"d\", path);","            }","            ","            this._path = path;","            this._fillChangeHandler();","            this._strokeChangeHandler();","            this._updateTransform();","        }","    },","","    /**","     * Ends a fill and stroke","     *","     * @method closePath","     */","    closePath: function()","    {","        this._pathArray.push([\"z\"]);","    },","","    /**","     * Returns the current array of drawing commands.","     *","     * @method _getCurrentArray","     * @return Array","     * @private","     */","    _getCurrentArray: function()","    {","        var currentArray = this._pathArray[Math.max(0, this._pathArray.length - 1)];","        if(!currentArray)","        {","            currentArray = [];","            this._pathArray.push(currentArray);","        }","        return currentArray;","    },","    ","    /**","     * Returns the points on a curve","     *","     * @method getBezierData","     * @param Array points Array containing the begin, end and control points of a curve.","     * @param Number t The value for incrementing the next set of points.","     * @return Array","     * @private","     */","    getBezierData: function(points, t) {  ","        var n = points.length,","            tmp = [],","            i,","            j;","","        for (i = 0; i < n; ++i){","            tmp[i] = [points[i][0], points[i][1]]; // save input","        }","        ","        for (j = 1; j < n; ++j) {","            for (i = 0; i < n - j; ++i) {","                tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];","                tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1]; ","            }","        }","        return [ tmp[0][0], tmp[0][1] ]; ","    },","  ","    /**","     * Calculates the bounding box for a curve","     *","     * @method _setCurveBoundingBox","     * @param Array pts Array containing points for start, end and control points of a curve.","     * @param Number w Width used to calculate the number of points to describe the curve.","     * @param Number h Height used to calculate the number of points to describe the curve.","     * @private","     */","    _setCurveBoundingBox: function(pts, w, h)","    {","        var i = 0,","            left = this._currentX,","            right = left,","            top = this._currentY,","            bottom = top,","            len = Math.round(Math.sqrt((w * w) + (h * h))),","            t = 1/len,","            xy;","        for(; i < len; ++i)","        {","            xy = this.getBezierData(pts, t * i);","            left = isNaN(left) ? xy[0] : Math.min(xy[0], left);","            right = isNaN(right) ? xy[0] : Math.max(xy[0], right);","            top = isNaN(top) ? xy[1] : Math.min(xy[1], top);","            bottom = isNaN(bottom) ? xy[1] : Math.max(xy[1], bottom);","        }","        left = Math.round(left * 10)/10;","        right = Math.round(right * 10)/10;","        top = Math.round(top * 10)/10;","        bottom = Math.round(bottom * 10)/10;","        this._trackSize(right, bottom);","        this._trackSize(left, top);","    },","    ","    /**","     * Updates the size of the graphics object","     *","     * @method _trackSize","     * @param {Number} w width","     * @param {Number} h height","     * @private","     */","    _trackSize: function(w, h) {","        if (w > this._right) {","            this._right = w;","        }","        if(w < this._left)","        {","            this._left = w;    ","        }","        if (h < this._top)","        {","            this._top = h;","        }","        if (h > this._bottom) ","        {","            this._bottom = h;","        }","        this._width = this._right - this._left;","        this._height = this._bottom - this._top;","    }","};","Y.SVGDrawing = SVGDrawing;","/**"," * <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> implementation of the <a href=\"Shape.html\">`Shape`</a> class. "," * `SVGShape` is not intended to be used directly. Instead, use the <a href=\"Shape.html\">`Shape`</a> class. "," * If the browser has <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities, the <a href=\"Shape.html\">`Shape`</a> "," * class will point to the `SVGShape` class."," *"," * @module graphics"," * @class SVGShape"," * @constructor"," * @param {Object} cfg (optional) Attribute configs"," */","SVGShape = function(cfg)","{","    this._transforms = [];","    this.matrix = new Y.Matrix();","    this._normalizedMatrix = new Y.Matrix();","    SVGShape.superclass.constructor.apply(this, arguments);","};","","SVGShape.NAME = \"svgShape\";","","Y.extend(SVGShape, Y.GraphicBase, Y.mix({","    /**","     * Storage for x attribute.","     *","     * @property _x","     * @protected","     */","    _x: 0,","","    /**","     * Storage for y attribute.","     *","     * @property _y","     * @protected","     */","    _y: 0,","    ","    /**","     * Init method, invoked during construction.","     * Calls `initializer` method.","     *","     * @method init","     * @protected","     */","	init: function()","	{","		this.initializer.apply(this, arguments);","	},","","	/**","	 * Initializes the shape","	 *","	 * @private","	 * @method initializer","	 */","	initializer: function(cfg)","	{","		var host = this,","            graphic = cfg.graphic;","		host.createNode(); ","		if(graphic)","        {","            host._setGraphic(graphic);","        }","        host._updateHandler();","	},"," ","    /**","     * Set the Graphic instance for the shape.","     *","     * @method _setGraphic","     * @param {Graphic | Node | HTMLElement | String} render This param is used to determine the graphic instance. If it is a `Graphic` instance, it will be assigned","     * to the `graphic` attribute. Otherwise, a new Graphic instance will be created and rendered into the dom element that the render represents.","     * @private","     */","    _setGraphic: function(render)","    {","        var graphic;","        if(render instanceof Y.SVGGraphic)","        {","		    this._graphic = render;","        }","        else","        {","            render = Y.one(render);","            graphic = new Y.SVGGraphic({","                render: render","            });","            graphic._appendShape(this);","            this._graphic = graphic;","        }","    },","","	/**","	 * Add a class name to each node.","	 *","	 * @method addClass","	 * @param {String} className the class name to add to the node's class attribute ","	 */","	addClass: function(className)","	{","		var node = this.node;","		node.className.baseVal = Y_LANG.trim([node.className.baseVal, className].join(' '));","	},","","	/**","	 * Removes a class name from each node.","	 *","	 * @method removeClass","	 * @param {String} className the class name to remove from the node's class attribute","	 */","	removeClass: function(className)","	{","		var node = this.node,","			classString = node.className.baseVal;","		classString = classString.replace(new RegExp(className + ' '), className).replace(new RegExp(className), '');","		node.className.baseVal = classString;","	},","","	/**","	 * Gets the current position of the node in page coordinates.","	 *","	 * @method getXY","	 * @return Array The XY position of the shape.","	 */","	getXY: function()","	{","		var graphic = this._graphic,","			parentXY = graphic.getXY(),","			x = this._x,","			y = this._y;","		return [parentXY[0] + x, parentXY[1] + y];","	},","","	/**","	 * Set the position of the shape in page coordinates, regardless of how the node is positioned.","	 *","	 * @method setXY","	 * @param {Array} Contains x & y values for new position (coordinates are page-based)","	 */","	setXY: function(xy)","	{","		var graphic = this._graphic,","			parentXY = graphic.getXY();","		this._x = xy[0] - parentXY[0];","		this._y = xy[1] - parentXY[1];","        this.set(\"transform\", this.get(\"transform\"));","	},","","	/**","	 * Determines whether the node is an ancestor of another HTML element in the DOM hierarchy. ","	 *","	 * @method contains","	 * @param {SVGShape | HTMLElement} needle The possible node or descendent","	 * @return Boolean Whether or not this shape is the needle or its ancestor.","	 */","	contains: function(needle)","	{","		return needle === Y.one(this.node);","	},","","	/**","	 * Compares nodes to determine if they match.","	 * Node instances can be compared to each other and/or HTMLElements.","	 * @method compareTo","	 * @param {HTMLElement | Node} refNode The reference node to compare to the node.","	 * @return {Boolean} True if the nodes match, false if they do not.","	 */","	compareTo: function(refNode) {","		var node = this.node;","","		return node === refNode;","	},","","	/**","	 * Test if the supplied node matches the supplied selector.","	 *","	 * @method test","	 * @param {String} selector The CSS selector to test against.","	 * @return Boolean Wheter or not the shape matches the selector.","	 */","	test: function(selector)","	{","		return Y.Selector.test(this.node, selector);","	},","	","	/**","	 * Value function for fill attribute","	 *","	 * @private","	 * @method _getDefaultFill","	 * @return Object","	 */","	_getDefaultFill: function() {","		return {","			type: \"solid\",","			opacity: 1,","			cx: 0.5,","			cy: 0.5,","			fx: 0.5,","			fy: 0.5,","			r: 0.5","		};","	},","	","	/**","	 * Value function for stroke attribute","	 *","	 * @private","	 * @method _getDefaultStroke","	 * @return Object","	 */","	_getDefaultStroke: function() ","	{","		return {","			weight: 1,","			dashstyle: \"none\",","			color: \"#000\",","			opacity: 1.0","		};","	},","","	/**","	 * Creates the dom node for the shape.","	 *","     * @method createNode","	 * @return HTMLElement","	 * @private","	 */","	createNode: function()","	{","		var node = DOCUMENT.createElementNS(\"http://www.w3.org/2000/svg\", \"svg:\" + this._type),","			id = this.get(\"id\"),","			pointerEvents = this.get(\"pointerEvents\");","		this.node = node;","		this.addClass(_getClassName(SHAPE) + \" \" + _getClassName(this.name)); ","        if(id)","		{","			node.setAttribute(\"id\", id);","		}","		if(pointerEvents)","		{","			node.setAttribute(\"pointer-events\", pointerEvents);","		}","        if(!this.get(\"visible\"))","        {","            Y.one(node).setStyle(\"visibility\", \"hidden\");","        }","	},","	","","	/**","     * Overrides default `on` method. Checks to see if its a dom interaction event. If so, ","     * return an event attached to the `node` element. If not, return the normal functionality.","     *","     * @method on","     * @param {String} type event type","     * @param {Object} callback function","	 * @private","	 */","	on: function(type, fn)","	{","		if(Y.Node.DOM_EVENTS[type])","		{","			return Y.one(\"#\" +  this.get(\"id\")).on(type, fn);","		}","		return Y.on.apply(this, arguments);","	},","","	/**","	 * Adds a stroke to the shape node.","	 *","	 * @method _strokeChangeHandler","	 * @private","	 */","	_strokeChangeHandler: function(e)","	{","		var node = this.node,","			stroke = this.get(\"stroke\"),","			strokeOpacity,","			dashstyle,","			dash,","			linejoin;","		if(stroke && stroke.weight && stroke.weight > 0)","		{","			linejoin = stroke.linejoin || \"round\";","			strokeOpacity = parseFloat(stroke.opacity);","			dashstyle = stroke.dashstyle || \"none\";","			dash = Y_LANG.isArray(dashstyle) ? dashstyle.toString() : dashstyle;","			stroke.color = stroke.color || \"#000000\";","			stroke.weight = stroke.weight || 1;","			stroke.opacity = Y_LANG.isNumber(strokeOpacity) ? strokeOpacity : 1;","			stroke.linecap = stroke.linecap || \"butt\";","			node.setAttribute(\"stroke-dasharray\", dash);","			node.setAttribute(\"stroke\", stroke.color);","			node.setAttribute(\"stroke-linecap\", stroke.linecap);","			node.setAttribute(\"stroke-width\",  stroke.weight);","			node.setAttribute(\"stroke-opacity\", stroke.opacity);","			if(linejoin == \"round\" || linejoin == \"bevel\")","			{","				node.setAttribute(\"stroke-linejoin\", linejoin);","			}","			else","			{","				linejoin = parseInt(linejoin, 10);","				if(Y_LANG.isNumber(linejoin))","				{","					node.setAttribute(\"stroke-miterlimit\",  Math.max(linejoin, 1));","					node.setAttribute(\"stroke-linejoin\", \"miter\");","				}","			}","		}","		else","		{","			node.setAttribute(\"stroke\", \"none\");","		}","	},","	","	/**","	 * Adds a fill to the shape node.","	 *","	 * @method _fillChangeHandler","	 * @private","	 */","	_fillChangeHandler: function(e)","	{","		var node = this.node,","			fill = this.get(\"fill\"),","			fillOpacity,","			type;","		if(fill)","		{","			type = fill.type;","			if(type == \"linear\" || type == \"radial\")","			{","				this._setGradientFill(fill);","				node.setAttribute(\"fill\", \"url(#grad\" + this.get(\"id\") + \")\");","			}","			else if(!fill.color)","			{","				node.setAttribute(\"fill\", \"none\");","			}","			else","			{","                fillOpacity = parseFloat(fill.opacity);","				fillOpacity = Y_LANG.isNumber(fillOpacity) ? fillOpacity : 1;","				node.setAttribute(\"fill\", fill.color);","				node.setAttribute(\"fill-opacity\", fillOpacity);","			}","		}","		else","		{","			node.setAttribute(\"fill\", \"none\");","		}","	},","","	/**","	 * Creates a gradient fill","	 *","	 * @method _setGradientFill","	 * @param {String} type gradient type","	 * @private","	 */","	_setGradientFill: function(fill) {","		var offset,","			opacity,","			color,","			stopNode,","            newStop,","			isNumber = Y_LANG.isNumber,","			graphic = this._graphic,","			type = fill.type, ","			gradientNode = graphic.getGradientNode(\"grad\" + this.get(\"id\"), type),","			stops = fill.stops,","			w = this.get(\"width\"),","			h = this.get(\"height\"),","			rotation = fill.rotation || 0,","			radCon = Math.PI/180,","            tanRadians = parseFloat(parseFloat(Math.tan(rotation * radCon)).toFixed(8)),","            i,","			len,","			def,","			stop,","			x1 = \"0%\", ","			x2 = \"100%\", ","			y1 = \"0%\", ","			y2 = \"0%\",","			cx = fill.cx,","			cy = fill.cy,","			fx = fill.fx,","			fy = fill.fy,","			r = fill.r,","            stopNodes = [];","		if(type == \"linear\")","		{","            cx = w/2;","            cy = h/2;","            if(Math.abs(tanRadians) * w/2 >= h/2)","            {","                if(rotation < 180)","                {","                    y1 = 0;","                    y2 = h;","                }","                else","                {","                    y1 = h;","                    y2 = 0;","                }","                x1 = cx - ((cy - y1)/tanRadians);","                x2 = cx - ((cy - y2)/tanRadians); ","            }","            else","            {","                if(rotation > 90 && rotation < 270)","                {","                    x1 = w;","                    x2 = 0;","                }","                else","                {","                    x1 = 0;","                    x2 = w;","                }","                y1 = ((tanRadians * (cx - x1)) - cy) * -1;","                y2 = ((tanRadians * (cx - x2)) - cy) * -1;","            }","","            x1 = Math.round(100 * x1/w);","            x2 = Math.round(100 * x2/w);","            y1 = Math.round(100 * y1/h);","            y2 = Math.round(100 * y2/h);","            ","            //Set default value if not valid ","            x1 = isNumber(x1) ? x1 : 0;","            x2 = isNumber(x2) ? x2 : 100;","            y1 = isNumber(y1) ? y1 : 0;","            y2 = isNumber(y2) ? y2 : 0;","            ","            gradientNode.setAttribute(\"spreadMethod\", \"pad\");","			gradientNode.setAttribute(\"width\", w);","			gradientNode.setAttribute(\"height\", h);","            gradientNode.setAttribute(\"x1\", x1 + \"%\");","            gradientNode.setAttribute(\"x2\", x2 + \"%\");","            gradientNode.setAttribute(\"y1\", y1 + \"%\");","            gradientNode.setAttribute(\"y2\", y2 + \"%\");","		}","		else","		{","			gradientNode.setAttribute(\"cx\", (cx * 100) + \"%\");","			gradientNode.setAttribute(\"cy\", (cy * 100) + \"%\");","			gradientNode.setAttribute(\"fx\", (fx * 100) + \"%\");","			gradientNode.setAttribute(\"fy\", (fy * 100) + \"%\");","			gradientNode.setAttribute(\"r\", (r * 100) + \"%\");","		}","		","		len = stops.length;","		def = 0;","        for(i = 0; i < len; ++i)","		{","            if(this._stops && this._stops.length > 0)","            {","                stopNode = this._stops.shift();","                newStop = false;","            }","            else","            {","			    stopNode = graphic._createGraphicNode(\"stop\");","                newStop = true;","            }","			stop = stops[i];","			opacity = stop.opacity;","			color = stop.color;","			offset = stop.offset || i/(len - 1);","			offset = Math.round(offset * 100) + \"%\";","			opacity = isNumber(opacity) ? opacity : 1;","			opacity = Math.max(0, Math.min(1, opacity));","			def = (i + 1) / len;","			stopNode.setAttribute(\"offset\", offset);","			stopNode.setAttribute(\"stop-color\", color);","			stopNode.setAttribute(\"stop-opacity\", opacity);","			if(newStop)","            {","                gradientNode.appendChild(stopNode);","            }","            stopNodes.push(stopNode);","		}","        while(this._stops && this._stops.length > 0)","        {","            gradientNode.removeChild(this._stops.shift());","        }","        this._stops = stopNodes;","	},","","    _stops: null,","","    /**","     * Sets the value of an attribute.","     *","     * @method set","     * @param {String|Object} name The name of the attribute. Alternatively, an object of key value pairs can ","     * be passed in to set multiple attributes at once.","     * @param {Any} value The value to set the attribute to. This value is ignored if an object is received as ","     * the name param.","     */","	set: function() ","	{","		var host = this;","		AttributeLite.prototype.set.apply(host, arguments);","		if(host.initialized)","		{","			host._updateHandler();","		}","	},","","	/**","	 * Specifies a 2d translation.","	 *","	 * @method translate","	 * @param {Number} x The value to transate on the x-axis.","	 * @param {Number} y The value to translate on the y-axis.","	 */","	translate: function(x, y)","	{","		this._addTransform(\"translate\", arguments);","	},","","	/**","	 * Translates the shape along the x-axis. When translating x and y coordinates,","	 * use the `translate` method.","	 *","	 * @method translateX","	 * @param {Number} x The value to translate.","	 */","	translateX: function(x)","    {","        this._addTransform(\"translateX\", arguments);","    },","","	/**","	 * Translates the shape along the y-axis. When translating x and y coordinates,","	 * use the `translate` method.","	 *","	 * @method translateY","	 * @param {Number} y The value to translate.","	 */","	translateY: function(y)","    {","        this._addTransform(\"translateY\", arguments);","    },","","    /**","     * Skews the shape around the x-axis and y-axis.","     *","     * @method skew","     * @param {Number} x The value to skew on the x-axis.","     * @param {Number} y The value to skew on the y-axis.","     */","    skew: function(x, y)","    {","        this._addTransform(\"skew\", arguments);","    },","","	/**","	 * Skews the shape around the x-axis.","	 *","	 * @method skewX","	 * @param {Number} x x-coordinate","	 */","	 skewX: function(x)","	 {","		this._addTransform(\"skewX\", arguments);","	 },","","	/**","	 * Skews the shape around the y-axis.","	 *","	 * @method skewY","	 * @param {Number} y y-coordinate","	 */","	 skewY: function(y)","	 {","		this._addTransform(\"skewY\", arguments);","	 },","","	/**","	 * Rotates the shape clockwise around it transformOrigin.","	 *","	 * @method rotate","	 * @param {Number} deg The degree of the rotation.","	 */","	 rotate: function(deg)","	 {","		this._addTransform(\"rotate\", arguments);","	 },","","	/**","	 * Specifies a 2d scaling operation.","	 *","	 * @method scale","	 * @param {Number} val","	 */","	scale: function(x, y)","	{","		this._addTransform(\"scale\", arguments);","	},","","    /**","     * Adds a transform to the shape.","     *","     * @method _addTransform","     * @param {String} type The transform being applied.","     * @param {Array} args The arguments for the transform.","	 * @private","	 */","	_addTransform: function(type, args)","	{","        args = Y.Array(args);","        this._transform = Y_LANG.trim(this._transform + \" \" + type + \"(\" + args.join(\", \") + \")\");","        args.unshift(type);","        this._transforms.push(args);","        if(this.initialized)","        {","            this._updateTransform();","        }","	},","","	/**","     * Applies all transforms.","     *","     * @method _updateTransform","	 * @private","	 */","	_updateTransform: function()","	{","		var isPath = this._type == \"path\",","		    node = this.node,","			key,","			transform,","			transformOrigin,","			x,","			y,","            tx,","            ty,","            matrix = this.matrix,","            normalizedMatrix = this._normalizedMatrix,","            i = 0,","            len = this._transforms.length;","","        if(isPath || (this._transforms && this._transforms.length > 0))","		{","            x = this._x;","            y = this._y;","            transformOrigin = this.get(\"transformOrigin\");","            tx = x + (transformOrigin[0] * this.get(\"width\"));","            ty = y + (transformOrigin[1] * this.get(\"height\")); ","            //need to use translate for x/y coords","            if(isPath)","            {","                //adjust origin for custom shapes ","                if(!(this instanceof Y.SVGPath))","                {","                    tx = this._left + (transformOrigin[0] * this.get(\"width\"));","                    ty = this._top + (transformOrigin[1] * this.get(\"height\"));","                }","                normalizedMatrix.init({dx: x + this._left, dy: y + this._top});","            }","            normalizedMatrix.translate(tx, ty);","            for(; i < len; ++i)","            {","                key = this._transforms[i].shift();","                if(key)","                {","                    normalizedMatrix[key].apply(normalizedMatrix, this._transforms[i]);","                    matrix[key].apply(matrix, this._transforms[i]); ","                }","                if(isPath)","                {","                    this._transforms[i].unshift(key);","                }","			}","            normalizedMatrix.translate(-tx, -ty);","            transform = \"matrix(\" + normalizedMatrix.a + \",\" + ","                            normalizedMatrix.b + \",\" + ","                            normalizedMatrix.c + \",\" + ","                            normalizedMatrix.d + \",\" + ","                            normalizedMatrix.dx + \",\" +","                            normalizedMatrix.dy + \")\";","		}","        this._graphic.addToRedrawQueue(this);    ","        if(transform)","		{","            node.setAttribute(\"transform\", transform);","        }","        if(!isPath)","        {","            this._transforms = [];","        }","	},","","	/**","	 * Draws the shape.","	 *","	 * @method _draw","	 * @private","	 */","	_draw: function()","	{","		var node = this.node;","		node.setAttribute(\"width\", this.get(\"width\"));","		node.setAttribute(\"height\", this.get(\"height\"));","		node.setAttribute(\"x\", this._x);","		node.setAttribute(\"y\", this._y);","		node.style.left = this._x + \"px\";","		node.style.top = this._y + \"px\";","		this._fillChangeHandler();","		this._strokeChangeHandler();","		this._updateTransform();","	},","","	/**","     * Updates `Shape` based on attribute changes.","     *","     * @method _updateHandler","	 * @private","	 */","	_updateHandler: function(e)","	{","		this._draw();","	},","    ","    /**","     * Storage for the transform attribute.","     *","     * @property _transform","     * @type String","     * @private","     */","    _transform: \"\",","","	/**","	 * Returns the bounds for a shape.","	 *","     * Calculates the a new bounding box from the original corner coordinates (base on size and position) and the transform matrix.","     * The calculated bounding box is used by the graphic instance to calculate its viewBox. ","     *","	 * @method getBounds","	 * @return Object","	 */","	getBounds: function()","	{","		var type = this._type,","			w = this.get(\"width\"),","			h = this.get(\"height\"),","			x = type == \"path\" ? 0 : this._x,","			y = type == \"path\" ? 0 : this._y;","		return this._normalizedMatrix.getContentRect(w, h, x, y);","	},","","    /**","     * Destroys the shape instance.","     *","     * @method destroy","     */","    destroy: function()","    {","        var graphic = this.get(\"graphic\");","        if(graphic)","        {","            graphic.removeShape(this);","        }","        else","        {","            this._destroy();","        }","    },","","    /**","     *  Implementation for shape destruction","     *","     *  @method destroy","     *  @protected","     */","    _destroy: function()","    {","        if(this.node)","        {","            Y.Event.purgeElement(this.node, true);","            if(this.node.parentNode)","            {","                this.node.parentNode.removeChild(this.node);","            }","            this.node = null;","        }","    }"," }, Y.SVGDrawing.prototype));","	","SVGShape.ATTRS = {","	/**","	 * An array of x, y values which indicates the transformOrigin in which to rotate the shape. Valid values range between 0 and 1 representing a ","	 * fraction of the shape's corresponding bounding box dimension. The default value is [0.5, 0.5].","	 *","	 * @config transformOrigin","	 * @type Array","	 */","	transformOrigin: {","		valueFn: function()","		{","			return [0.5, 0.5];","		}","	},","	","    /**","     * <p>A string containing, in order, transform operations applied to the shape instance. The `transform` string can contain the following values:","     *     ","     *    <dl>","     *        <dt>rotate</dt><dd>Rotates the shape clockwise around it transformOrigin.</dd>","     *        <dt>translate</dt><dd>Specifies a 2d translation.</dd>","     *        <dt>skew</dt><dd>Skews the shape around the x-axis and y-axis.</dd>","     *        <dt>scale</dt><dd>Specifies a 2d scaling operation.</dd>","     *        <dt>translateX</dt><dd>Translates the shape along the x-axis.</dd>","     *        <dt>translateY</dt><dd>Translates the shape along the y-axis.</dd>","     *        <dt>skewX</dt><dd>Skews the shape around the x-axis.</dd>","     *        <dt>skewY</dt><dd>Skews the shape around the y-axis.</dd>","     *        <dt>matrix</dt><dd>Specifies a 2D transformation matrix comprised of the specified six values.</dd>      ","     *    </dl>","     * </p>","     * <p>Applying transforms through the transform attribute will reset the transform matrix and apply a new transform. The shape class also contains corresponding methods for each transform","     * that will apply the transform to the current matrix. The below code illustrates how you might use the `transform` attribute to instantiate a recangle with a rotation of 45 degrees.</p>","            var myRect = new Y.Rect({","                type:\"rect\",","                width: 50,","                height: 40,","                transform: \"rotate(45)\"","            };","     * <p>The code below would apply `translate` and `rotate` to an existing shape.</p>","    ","        myRect.set(\"transform\", \"translate(40, 50) rotate(45)\");","	 * @config transform","     * @type String  ","	 */","	transform: {","		setter: function(val)","        {","            this.matrix.init();	","            this._normalizedMatrix.init();","		    this._transforms = this.matrix.getTransformArray(val);","            this._transform = val;","            return val;","		},","","        getter: function()","        {","            return this._transform;","        }","	},","","	/**","	 * Unique id for class instance.","	 *","	 * @config id","	 * @type String","	 */","	id: {","		valueFn: function()","		{","			return Y.guid();","		},","","		setter: function(val)","		{","			var node = this.node;","			if(node)","			{","				node.setAttribute(\"id\", val);","			}","			return val;","		}","	},","","	/**","	 * Indicates the x position of shape.","	 *","	 * @config x","	 * @type Number","	 */","	x: {","	    getter: function()","        {","            return this._x;","        },","","        setter: function(val)","        {","            var transform = this.get(\"transform\");","            this._x = val;","            if(transform) ","            {","                this.set(\"transform\", transform);","            }","        }","	},","","	/**","	 * Indicates the y position of shape.","	 *","	 * @config y","	 * @type Number","	 */","	y: {","	    getter: function()","        {","            return this._y;","        },","","        setter: function(val)","        {","            var transform = this.get(\"transform\");","            this._y = val;","            if(transform) ","            {","                this.set(\"transform\", transform);","            }","        }","	},","","	/**","	 * Indicates the width of the shape","	 *","	 * @config width","	 * @type Number","	 */","	width: {","        value: 0","    },","","	/**","	 * Indicates the height of the shape","	 * ","	 * @config height","	 * @type Number","	 */","	height: {","        value: 0","    },","","	/**","	 * Indicates whether the shape is visible.","	 *","	 * @config visible","	 * @type Boolean","	 */","	visible: {","		value: true,","","		setter: function(val){","			var visibility = val ? \"visible\" : \"hidden\";","			if(this.node)","            {","                this.node.style.visibility = visibility;","            }","			return val;","		}","	},","","	/**","	 * Contains information about the fill of the shape. ","     *  <dl>","     *      <dt>color</dt><dd>The color of the fill.</dd>","     *      <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the fill. The default value is 1.</dd>","     *      <dt>type</dt><dd>Type of fill.","     *          <dl>","     *              <dt>solid</dt><dd>Solid single color fill. (default)</dd>","     *              <dt>linear</dt><dd>Linear gradient fill.</dd>","     *              <dt>radial</dt><dd>Radial gradient fill.</dd>","     *          </dl>","     *      </dd>","     *  </dl>","     *  <p>If a `linear` or `radial` is specified as the fill type. The following additional property is used:","     *  <dl>","     *      <dt>stops</dt><dd>An array of objects containing the following properties:","     *          <dl>","     *              <dt>color</dt><dd>The color of the stop.</dd>","     *              <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the stop. The default value is 1. Note: No effect for IE 6 - 8</dd>","     *              <dt>offset</dt><dd>Number between 0 and 1 indicating where the color stop is positioned.</dd> ","     *          </dl>","     *      </dd>","     *      <p>Linear gradients also have the following property:</p>","     *      <dt>rotation</dt><dd>Linear gradients flow left to right by default. The rotation property allows you to change the flow by rotation. (e.g. A rotation of 180 would make the gradient pain from right to left.)</dd>","     *      <p>Radial gradients have the following additional properties:</p>","     *      <dt>r</dt><dd>Radius of the gradient circle.</dd>","     *      <dt>fx</dt><dd>Focal point x-coordinate of the gradient.</dd>","     *      <dt>fy</dt><dd>Focal point y-coordinate of the gradient.</dd>","     *      <dt>cx</dt><dd>","     *          <p>The x-coordinate of the center of the gradient circle. Determines where the color stop begins. The default value 0.5.</p>","     *          <p><strong>Note: </strong>Currently, this property is not implemented for corresponding `CanvasShape` and `VMLShape` classes which are used on Android or IE 6 - 8.</p>","     *      </dd>","     *      <dt>cy</dt><dd>","     *          <p>The y-coordinate of the center of the gradient circle. Determines where the color stop begins. The default value 0.5.</p>","     *          <p><strong>Note: </strong>Currently, this property is not implemented for corresponding `CanvasShape` and `VMLShape` classes which are used on Android or IE 6 - 8.</p>","     *      </dd>","     *  </dl>","	 *","	 * @config fill","	 * @type Object ","	 */","	fill: {","		valueFn: \"_getDefaultFill\",","		","		setter: function(val)","		{","			var fill,","				tmpl = this.get(\"fill\") || this._getDefaultFill();","			fill = (val) ? Y.merge(tmpl, val) : null;","			if(fill && fill.color)","			{","				if(fill.color === undefined || fill.color == \"none\")","				{","					fill.color = null;","				}","			}","			return fill;","		}","	},","","	/**","	 * Contains information about the stroke of the shape.","     *  <dl>","     *      <dt>color</dt><dd>The color of the stroke.</dd>","     *      <dt>weight</dt><dd>Number that indicates the width of the stroke.</dd>","     *      <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the stroke. The default value is 1.</dd>","     *      <dt>dashstyle</dt>Indicates whether to draw a dashed stroke. When set to \"none\", a solid stroke is drawn. When set to an array, the first index indicates the","     *  length of the dash. The second index indicates the length of gap.","     *      <dt>linecap</dt><dd>Specifies the linecap for the stroke. The following values can be specified:","     *          <dl>","     *              <dt>butt (default)</dt><dd>Specifies a butt linecap.</dd>","     *              <dt>square</dt><dd>Specifies a sqare linecap.</dd>","     *              <dt>round</dt><dd>Specifies a round linecap.</dd>","     *          </dl>","     *      </dd>","     *      <dt>linejoin</dt><dd>Specifies a linejoin for the stroke. The following values can be specified:","     *          <dl>","     *              <dt>round (default)</dt><dd>Specifies that the linejoin will be round.</dd>","     *              <dt>bevel</dt><dd>Specifies a bevel for the linejoin.</dd>","     *              <dt>miter limit</dt><dd>An integer specifying the miter limit of a miter linejoin. If you want to specify a linejoin of miter, you simply specify the limit as opposed to having","     *  separate miter and miter limit values.</dd>","     *          </dl>","     *      </dd>","     *  </dl>","	 *","	 * @config stroke","	 * @type Object","	 */","	stroke: {","		valueFn: \"_getDefaultStroke\",","","		setter: function(val)","		{","			var tmpl = this.get(\"stroke\") || this._getDefaultStroke(),","                wt;","            if(val && val.hasOwnProperty(\"weight\"))","            {","                wt = parseInt(val.weight, 10);","                if(!isNaN(wt))","                {","                    val.weight = wt;","                }","            }","            return (val) ? Y.merge(tmpl, val) : null;","		}","	},","	","	// Only implemented in SVG","	// Determines whether the instance will receive mouse events.","	// ","	// @config pointerEvents","	// @type string","	//","	pointerEvents: {","		valueFn: function() ","		{","			var val = \"visiblePainted\",","				node = this.node;","			if(node)","			{","				node.setAttribute(\"pointer-events\", val);","			}","			return val;","		},","","		setter: function(val)","		{","			var node = this.node;","			if(node)","			{","				node.setAttribute(\"pointer-events\", val);","			}","			return val;","		}","	},","","	/**","	 * Dom node for the shape.","	 *","	 * @config node","	 * @type HTMLElement","	 * @readOnly","	 */","	node: {","		readOnly: true,","","		getter: function()","		{","			return this.node;","		}","	},","","	/**","	 * Reference to the parent graphic instance","	 *","	 * @config graphic","	 * @type SVGGraphic","	 * @readOnly","	 */","	graphic: {","		readOnly: true,","","		getter: function()","		{","			return this._graphic;","		}","	}","};","Y.SVGShape = SVGShape;","","/**"," * <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> implementation of the <a href=\"Path.html\">`Path`</a> class. "," * `SVGPath` is not intended to be used directly. Instead, use the <a href=\"Path.html\">`Path`</a> class. "," * If the browser has <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities, the <a href=\"Path.html\">`Path`</a> "," * class will point to the `SVGPath` class."," *"," * @module graphics"," * @class SVGPath"," * @extends SVGShape"," * @constructor"," */","SVGPath = function(cfg)","{","	SVGPath.superclass.constructor.apply(this, arguments);","};","SVGPath.NAME = \"svgPath\";","Y.extend(SVGPath, Y.SVGShape, {","    /**","     * Left edge of the path","     *","     * @property _left","     * @type Number","     * @private","     */","    _left: 0,","","    /**","     * Right edge of the path","     *","     * @property _right","     * @type Number","     * @private","     */","    _right: 0,","    ","    /**","     * Top edge of the path","     *","     * @property _top","     * @type Number","     * @private","     */","    _top: 0, ","    ","    /**","     * Bottom edge of the path","     *","     * @property _bottom","     * @type Number","     * @private","     */","    _bottom: 0,","","    /**","     * Indicates the type of shape","     *","     * @property _type","     * @readOnly","     * @type String","     * @private","     */","    _type: \"path\",","","    /**","     * Storage for path","     *","     * @property _path","     * @type String","     * @private","     */","	_path: \"\"","});","","SVGPath.ATTRS = Y.merge(Y.SVGShape.ATTRS, {","	/**","	 * Indicates the path used for the node.","	 *","	 * @config path","	 * @type String","     * @readOnly","	 */","	path: {","		readOnly: true,","","		getter: function()","		{","			return this._path;","		}","	},","","	/**","	 * Indicates the width of the shape","	 * ","	 * @config width","	 * @type Number","	 */","	width: {","		getter: function()","		{","			var val = Math.max(this._right - this._left, 0);","			return val;","		}","	},","","	/**","	 * Indicates the height of the shape","	 * ","	 * @config height","	 * @type Number","	 */","	height: {","		getter: function()","		{","			return Math.max(this._bottom - this._top, 0);","		}","	}","});","Y.SVGPath = SVGPath;","/**"," * <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> implementation of the <a href=\"Rect.html\">`Rect`</a> class. "," * `SVGRect` is not intended to be used directly. Instead, use the <a href=\"Rect.html\">`Rect`</a> class. "," * If the browser has <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities, the <a href=\"Rect.html\">`Rect`</a> "," * class will point to the `SVGRect` class."," *"," * @module graphics"," * @class SVGRect"," * @constructor"," */","SVGRect = function()","{","	SVGRect.superclass.constructor.apply(this, arguments);","};","SVGRect.NAME = \"svgRect\";","Y.extend(SVGRect, Y.SVGShape, {","    /**","     * Indicates the type of shape","     *","     * @property _type","     * @type String","     * @private","     */","    _type: \"rect\""," });","SVGRect.ATTRS = Y.SVGShape.ATTRS;","Y.SVGRect = SVGRect;","/**"," * <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> implementation of the <a href=\"Ellipse.html\">`Ellipse`</a> class. "," * `SVGEllipse` is not intended to be used directly. Instead, use the <a href=\"Ellipse.html\">`Ellipse`</a> class. "," * If the browser has <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities, the <a href=\"Ellipse.html\">`Ellipse`</a> "," * class will point to the `SVGEllipse` class."," *"," * @module graphics"," * @class SVGEllipse"," * @constructor"," */","SVGEllipse = function(cfg)","{","	SVGEllipse.superclass.constructor.apply(this, arguments);","};","","SVGEllipse.NAME = \"svgEllipse\";","","Y.extend(SVGEllipse, SVGShape, {","	/**","	 * Indicates the type of shape","	 *","	 * @property _type","	 * @type String","     * @private","	 */","	_type: \"ellipse\",","","	/**","	 * Updates the shape.","	 *","	 * @method _draw","	 * @private","	 */","	_draw: function()","	{","		var node = this.node,","			w = this.get(\"width\"),","			h = this.get(\"height\"),","			x = this.get(\"x\"),","			y = this.get(\"y\"),","			xRadius = w * 0.5,","			yRadius = h * 0.5,","			cx = x + xRadius,","			cy = y + yRadius;","		node.setAttribute(\"rx\", xRadius);","		node.setAttribute(\"ry\", yRadius);","		node.setAttribute(\"cx\", cx);","		node.setAttribute(\"cy\", cy);","		this._fillChangeHandler();","		this._strokeChangeHandler();","		this._updateTransform();","	}","});","","SVGEllipse.ATTRS = Y.merge(SVGShape.ATTRS, {","	/**","	 * Horizontal radius for the ellipse. ","	 *","	 * @config xRadius","	 * @type Number","	 */","	xRadius: {","		setter: function(val)","		{","			this.set(\"width\", val * 2);","		},","","		getter: function()","		{","			var val = this.get(\"width\");","			if(val) ","			{","				val *= 0.5;","			}","			return val;","		}","	},","","	/**","	 * Vertical radius for the ellipse. ","	 *","	 * @config yRadius","	 * @type Number","	 * @readOnly","	 */","	yRadius: {","		setter: function(val)","		{","			this.set(\"height\", val * 2);","		},","","		getter: function()","		{","			var val = this.get(\"height\");","			if(val) ","			{","				val *= 0.5;","			}","			return val;","		}","	}","});","Y.SVGEllipse = SVGEllipse;","/**"," * <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> implementation of the <a href=\"Circle.html\">`Circle`</a> class. "," * `SVGCircle` is not intended to be used directly. Instead, use the <a href=\"Circle.html\">`Circle`</a> class. "," * If the browser has <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities, the <a href=\"Circle.html\">`Circle`</a> "," * class will point to the `SVGCircle` class."," *"," * @module graphics"," * @class SVGCircle"," * @constructor"," */"," SVGCircle = function(cfg)"," {","    SVGCircle.superclass.constructor.apply(this, arguments);"," };","    "," SVGCircle.NAME = \"svgCircle\";",""," Y.extend(SVGCircle, Y.SVGShape, {    ","    ","    /**","     * Indicates the type of shape","     *","     * @property _type","     * @type String","     * @private","     */","    _type: \"circle\",","","    /**","     * Updates the shape.","     *","     * @method _draw","     * @private","     */","    _draw: function()","    {","        var node = this.node,","            x = this.get(\"x\"),","            y = this.get(\"y\"),","            radius = this.get(\"radius\"),","            cx = x + radius,","            cy = y + radius;","        node.setAttribute(\"r\", radius);","        node.setAttribute(\"cx\", cx);","        node.setAttribute(\"cy\", cy);","        this._fillChangeHandler();","        this._strokeChangeHandler();","        this._updateTransform();","    }"," });","    ","SVGCircle.ATTRS = Y.merge(Y.SVGShape.ATTRS, {","	/**","	 * Indicates the width of the shape","	 *","	 * @config width","	 * @type Number","	 */","    width: {","        setter: function(val)","        {","            this.set(\"radius\", val/2);","            return val;","        },","","        getter: function()","        {","            return this.get(\"radius\") * 2;","        }","    },","","	/**","	 * Indicates the height of the shape","	 *","	 * @config height","	 * @type Number","	 */","    height: {","        setter: function(val)","        {","            this.set(\"radius\", val/2);","            return val;","        },","","        getter: function()","        {","            return this.get(\"radius\") * 2;","        }","    },","","    /**","     * Radius of the circle","     *","     * @config radius","     * @type Number","     */","    radius: {","        value: 0","    }","});","Y.SVGCircle = SVGCircle;","/**"," * Draws pie slices"," *"," * @module graphics"," * @class SVGPieSlice"," * @constructor"," */","SVGPieSlice = function()","{","	SVGPieSlice.superclass.constructor.apply(this, arguments);","};","SVGPieSlice.NAME = \"svgPieSlice\";","Y.extend(SVGPieSlice, Y.SVGShape, Y.mix({","    /**","     * Indicates the type of shape","     *","     * @property _type","     * @type String","     * @private","     */","    _type: \"path\",","","	/**","	 * Change event listener","	 *","	 * @private","	 * @method _updateHandler","	 */","	_draw: function(e)","	{","        var x = this.get(\"cx\"),","            y = this.get(\"cy\"),","            startAngle = this.get(\"startAngle\"),","            arc = this.get(\"arc\"),","            radius = this.get(\"radius\");","        this.clear();","        this.drawWedge(x, y, startAngle, arc, radius);","		this.end();","	}"," }, Y.SVGDrawing.prototype));","SVGPieSlice.ATTRS = Y.mix({","    cx: {","        value: 0","    },","","    cy: {","        value: 0","    },","    /**","     * Starting angle in relation to a circle in which to begin the pie slice drawing.","     *","     * @config startAngle","     * @type Number","     */","    startAngle: {","        value: 0","    },","","    /**","     * Arc of the slice.","     *","     * @config arc","     * @type Number","     */","    arc: {","        value: 0","    },","","    /**","     * Radius of the circle in which the pie slice is drawn","     *","     * @config radius","     * @type Number","     */","    radius: {","        value: 0","    }","}, Y.SVGShape.ATTRS);","Y.SVGPieSlice = SVGPieSlice;","/**"," * <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> implementation of the <a href=\"Graphic.html\">`Graphic`</a> class. "," * `SVGGraphic` is not intended to be used directly. Instead, use the <a href=\"Graphic.html\">`Graphic`</a> class. "," * If the browser has <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities, the <a href=\"Graphic.html\">`Graphic`</a> "," * class will point to the `SVGGraphic` class."," *"," * @module graphics"," * @class SVGGraphic"," * @constructor"," */","SVGGraphic = function(cfg) {","    SVGGraphic.superclass.constructor.apply(this, arguments);","};","","SVGGraphic.NAME = \"svgGraphic\";","","SVGGraphic.ATTRS = {","    /**","     * Whether or not to render the `Graphic` automatically after to a specified parent node after init. This can be a Node instance or a CSS selector string.","     * ","     * @config render","     * @type Node | String ","     */","    render: {},","	","    /**","	 * Unique id for class instance.","	 *","	 * @config id","	 * @type String","	 */","	id: {","		valueFn: function()","		{","			return Y.guid();","		},","","		setter: function(val)","		{","			var node = this._node;","			if(node)","			{","				node.setAttribute(\"id\", val);","			}","			return val;","		}","	},","","    /**","     * Key value pairs in which a shape instance is associated with its id.","     *","     *  @config shapes","     *  @type Object","     *  @readOnly","     */","    shapes: {","        readOnly: true,","","        getter: function()","        {","            return this._shapes;","        }","    },","","    /**","     *  Object containing size and coordinate data for the content of a Graphic in relation to the coordSpace node.","     *","     *  @config contentBounds","     *  @type Object ","     *  @readOnly","     */","    contentBounds: {","        readOnly: true,","","        getter: function()","        {","            return this._contentBounds;","        }","    },","","    /**","     *  The html element that represents to coordinate system of the Graphic instance.","     *","     *  @config node","     *  @type HTMLElement","     *  @readOnly","     */","    node: {","        readOnly: true,","","        getter: function()","        {","            return this._node;","        }","    },","    ","	/**","	 * Indicates the width of the `Graphic`. ","	 *","	 * @config width","	 * @type Number","	 */","    width: {","        setter: function(val)","        {","            if(this._node)","            {","                this._node.style.width = val + \"px\";","            }","            return val; ","        }","    },","","	/**","	 * Indicates the height of the `Graphic`. ","	 *","	 * @config height ","	 * @type Number","	 */","    height: {","        setter: function(val)","        {","            if(this._node)","            {","                this._node.style.height = val  + \"px\";","            }","            return val;","        }","    },","","    /**","     *  Determines the sizing of the Graphic. ","     *","     *  <dl>","     *      <dt>sizeContentToGraphic</dt><dd>The Graphic's width and height attributes are, either explicitly set through the <code>width</code> and <code>height</code>","     *      attributes or are determined by the dimensions of the parent element. The content contained in the Graphic will be sized to fit with in the Graphic instance's ","     *      dimensions. When using this setting, the <code>preserveAspectRatio</code> attribute will determine how the contents are sized.</dd>","     *      <dt>sizeGraphicToContent</dt><dd>(Also accepts a value of true) The Graphic's width and height are determined by the size and positioning of the content.</dd>","     *      <dt>false</dt><dd>The Graphic's width and height attributes are, either explicitly set through the <code>width</code> and <code>height</code>","     *      attributes or are determined by the dimensions of the parent element. The contents of the Graphic instance are not affected by this setting.</dd>","     *  </dl>","     *","     *","     *  @config autoSize","     *  @type Boolean | String","     *  @default false","     */","    autoSize: {","        value: false","    },","    ","    /**","     * Determines how content is sized when <code>autoSize</code> is set to <code>sizeContentToGraphic</code>.","     *","     *  <dl>","     *      <dt>none<dt><dd>Do not force uniform scaling. Scale the graphic content of the given element non-uniformly if necessary ","     *      such that the element's bounding box exactly matches the viewport rectangle.</dd>","     *      <dt>xMinYMin</dt><dd>Force uniform scaling position along the top left of the Graphic's node.</dd>","     *      <dt>xMidYMin</dt><dd>Force uniform scaling horizontally centered and positioned at the top of the Graphic's node.<dd>","     *      <dt>xMaxYMin</dt><dd>Force uniform scaling positioned horizontally from the right and vertically from the top.</dd>","     *      <dt>xMinYMid</dt>Force uniform scaling positioned horizontally from the left and vertically centered.</dd>","     *      <dt>xMidYMid (the default)</dt><dd>Force uniform scaling with the content centered.</dd>","     *      <dt>xMaxYMid</dt><dd>Force uniform scaling positioned horizontally from the right and vertically centered.</dd>","     *      <dt>xMinYMax</dt><dd>Force uniform scaling positioned horizontally from the left and vertically from the bottom.</dd>","     *      <dt>xMidYMax</dt><dd>Force uniform scaling horizontally centered and position vertically from the bottom.</dd>","     *      <dt>xMaxYMax</dt><dd>Force uniform scaling positioned horizontally from the right and vertically from the bottom.</dd>","     *  </dl>","     * ","     * @config preserveAspectRatio","     * @type String","     * @default xMidYMid","     */","    preserveAspectRatio: {","        value: \"xMidYMid\"","    },","    ","    /**","     * The contentBounds will resize to greater values but not to smaller values. (for performance)","     * When resizing the contentBounds down is desirable, set the resizeDown value to true.","     *","     * @config resizeDown ","     * @type Boolean","     */","    resizeDown: {","        value: false","    },","","	/**","	 * Indicates the x-coordinate for the instance.","	 *","	 * @config x","	 * @type Number","	 */","    x: {","        getter: function()","        {","            return this._x;","        },","","        setter: function(val)","        {","            this._x = val;","            if(this._node)","            {","                this._node.style.left = val + \"px\";","            }","            return val;","        }","    },","","	/**","	 * Indicates the y-coordinate for the instance.","	 *","	 * @config y","	 * @type Number","	 */","    y: {","        getter: function()","        {","            return this._y;","        },","","        setter: function(val)","        {","            this._y = val;","            if(this._node)","            {","                this._node.style.top = val + \"px\";","            }","            return val;","        }","    },","","    /**","     * Indicates whether or not the instance will automatically redraw after a change is made to a shape.","     * This property will get set to false when batching operations.","     *","     * @config autoDraw","     * @type Boolean","     * @default true","     * @private","     */","    autoDraw: {","        value: true","    },","    ","    visible: {","        value: true,","","        setter: function(val)","        {","            this._toggleVisible(val);","            return val;","        }","    },","","    //","    //  Indicates the pointer-events setting for the svg:svg element.","    //","    //  @config pointerEvents","    //  @type String","    //","    pointerEvents: {","        value: \"none\"","    }","};","","Y.extend(SVGGraphic, Y.GraphicBase, {","    /**","     * Sets the value of an attribute.","     *","     * @method set","     * @param {String|Object} name The name of the attribute. Alternatively, an object of key value pairs can ","     * be passed in to set multiple attributes at once.","     * @param {Any} value The value to set the attribute to. This value is ignored if an object is received as ","     * the name param.","     */","	set: function(attr, value) ","	{","		var host = this,","            redrawAttrs = {","                autoDraw: true,","                autoSize: true,","                preserveAspectRatio: true,","                resizeDown: true","            },","            key,","            forceRedraw = false;","		AttributeLite.prototype.set.apply(host, arguments);	","        if(host._state.autoDraw === true)","        {","            if(Y_LANG.isString && redrawAttrs[attr])","            {","                forceRedraw = true;","            }","            else if(Y_LANG.isObject(attr))","            {","                for(key in redrawAttrs)","                {","                    if(redrawAttrs.hasOwnProperty(key) && attr[key])","                    {","                        forceRedraw = true;","                        break;","                    }","                }","            }","        }","        if(forceRedraw)","        {","            host._redraw();","        }","	},","","    /**","     * Storage for `x` attribute.","     *","     * @property _x","     * @type Number","     * @private","     */","    _x: 0,","","    /**","     * Storage for `y` attribute.","     *","     * @property _y","     * @type Number","     * @private","     */","    _y: 0,","","    /**","     * Gets the current position of the graphic instance in page coordinates.","     *","     * @method getXY","     * @return Array The XY position of the shape.","     */","    getXY: function()","    {","        var node = Y.one(this._node),","            xy;","        if(node)","        {","            xy = node.getXY();","        }","        return xy;","    },","","    /**","     * Initializes the class.","     *","     * @method initializer","     * @private","     */","    initializer: function() {","        var render = this.get(\"render\"),","            visibility = this.get(\"visible\") ? \"visible\" : \"hidden\";","        this._shapes = {};","		this._contentBounds = {","            left: 0,","            top: 0,","            right: 0,","            bottom: 0","        };","        this._gradients = {};","        this._node = DOCUMENT.createElement('div');","        this._node.style.position = \"absolute\";","        this._node.style.left = this.get(\"x\") + \"px\";","        this._node.style.top = this.get(\"y\") + \"px\";","        this._node.style.visibility = visibility;","        this._contentNode = this._createGraphics();","        this._contentNode.style.visibility = visibility;","        this._contentNode.setAttribute(\"id\", this.get(\"id\"));","        this._node.appendChild(this._contentNode);","        if(render)","        {","            this.render(render);","        }","    },","","    /**","     * Adds the graphics node to the dom.","     * ","     * @method render","     * @param {HTMLElement} parentNode node in which to render the graphics node into.","     */","    render: function(render) {","        var parentNode = Y.one(render),","            w = this.get(\"width\") || parseInt(parentNode.getComputedStyle(\"width\"), 10),","            h = this.get(\"height\") || parseInt(parentNode.getComputedStyle(\"height\"), 10);","        parentNode = parentNode || Y.one(DOCUMENT.body);","        parentNode.append(this._node);","        this.parentNode = parentNode;","        this.set(\"width\", w);","        this.set(\"height\", h);","        return this;","    },","","    /**","     * Removes all nodes.","     *","     * @method destroy","     */","    destroy: function()","    {","        this.removeAllShapes();","        if(this._contentNode)","        {","            this._removeChildren(this._contentNode);","            if(this._contentNode.parentNode)","            {","                this._contentNode.parentNode.removeChild(this._contentNode);","            }","            this._contentNode = null;","        }","        if(this._node)","        {","            this._removeChildren(this._node);","            Y.one(this._node).remove(true);","            this._node = null;","        }","    },","","    /**","     * Generates a shape instance by type.","     *","     * @method addShape","     * @param {Object} cfg attributes for the shape","     * @return Shape","     */","    addShape: function(cfg)","    {","        cfg.graphic = this;","        if(!this.get(\"visible\"))","        {","            cfg.visible = false;","        }","        var shapeClass = this._getShapeClass(cfg.type),","            shape = new shapeClass(cfg);","        this._appendShape(shape);","        return shape;","    },","","    /**","     * Adds a shape instance to the graphic instance.","     *","     * @method _appendShape","     * @param {Shape} shape The shape instance to be added to the graphic.","     * @private","     */","    _appendShape: function(shape)","    {","        var node = shape.node,","            parentNode = this._frag || this._contentNode;","        if(this.get(\"autoDraw\")) ","        {","            parentNode.appendChild(node);","        }","        else","        {","            this._getDocFrag().appendChild(node);","        }","    },","","    /**","     * Removes a shape instance from from the graphic instance.","     *","     * @method removeShape","     * @param {Shape|String} shape The instance or id of the shape to be removed.","     */","    removeShape: function(shape)","    {","        if(!(shape instanceof SVGShape))","        {","            if(Y_LANG.isString(shape))","            {","                shape = this._shapes[shape];","            }","        }","        if(shape && shape instanceof SVGShape)","        {","            shape._destroy();","            delete this._shapes[shape.get(\"id\")];","        }","        if(this.get(\"autoDraw\")) ","        {","            this._redraw();","        }","        return shape;","    },","","    /**","     * Removes all shape instances from the dom.","     *","     * @method removeAllShapes","     */","    removeAllShapes: function()","    {","        var shapes = this._shapes,","            i;","        for(i in shapes)","        {","            if(shapes.hasOwnProperty(i))","            {","                shapes[i]._destroy();","            }","        }","        this._shapes = {};","    },","    ","    /**","     * Removes all child nodes.","     *","     * @method _removeChildren","     * @param {HTMLElement} node","     * @private","     */","    _removeChildren: function(node)","    {","        if(node.hasChildNodes())","        {","            var child;","            while(node.firstChild)","            {","                child = node.firstChild;","                this._removeChildren(child);","                node.removeChild(child);","            }","        }","    },","","    /**","     * Clears the graphics object.","     *","     * @method clear","     */","    clear: function() {","        this.removeAllShapes();","    },","","    /**","     * Toggles visibility","     *","     * @method _toggleVisible","     * @param {Boolean} val indicates visibilitye","     * @private","     */","    _toggleVisible: function(val)","    {","        var i,","            shapes = this._shapes,","            visibility = val ? \"visible\" : \"hidden\";","        if(shapes)","        {","            for(i in shapes)","            {","                if(shapes.hasOwnProperty(i))","                {","                    shapes[i].set(\"visible\", val);","                }","            }","        }","        if(this._contentNode)","        {","            this._contentNode.style.visibility = visibility;","        }","        if(this._node)","        {","            this._node.style.visibility = visibility;","        }","    },","","    /**","     * Returns a shape class. Used by `addShape`. ","     *","     * @method _getShapeClass","     * @param {Shape | String} val Indicates which shape class. ","     * @return Function ","     * @private","     */","    _getShapeClass: function(val)","    {","        var shape = this._shapeClass[val];","        if(shape)","        {","            return shape;","        }","        return val;","    },","","    /**","     * Look up for shape classes. Used by `addShape` to retrieve a class for instantiation.","     *","     * @property _shapeClass","     * @type Object","     * @private","     */","    _shapeClass: {","        circle: Y.SVGCircle,","        rect: Y.SVGRect,","        path: Y.SVGPath,","        ellipse: Y.SVGEllipse,","        pieslice: Y.SVGPieSlice","    },","    ","    /**","     * Returns a shape based on the id of its dom node.","     *","     * @method getShapeById","     * @param {String} id Dom id of the shape's node attribute.","     * @return Shape","     */","    getShapeById: function(id)","    {","        var shape = this._shapes[id];","        return shape;","    },","","	/**","	 * Allows for creating multiple shapes in order to batch appending and redraw operations.","	 *","	 * @method batch","	 * @param {Function} method Method to execute.","	 */","    batch: function(method)","    {","        var autoDraw = this.get(\"autoDraw\");","        this.set(\"autoDraw\", false);","        method();","        this._redraw();","        this.set(\"autoDraw\", autoDraw);","    },","    ","    /**","     * Returns a document fragment to for attaching shapes.","     *","     * @method _getDocFrag","     * @return DocumentFragment","     * @private","     */","    _getDocFrag: function()","    {","        if(!this._frag)","        {","            this._frag = DOCUMENT.createDocumentFragment();","        }","        return this._frag;","    },","","    /**","     * Redraws all shapes.","     *","     * @method _redraw","     * @private","     */","    _redraw: function()","    {","        var autoSize = this.get(\"autoSize\"),","            preserveAspectRatio = this.get(\"preserveAspectRatio\"),","            box = this.get(\"resizeDown\") ? this._getUpdatedContentBounds() : this._contentBounds,","            left = box.left,","            right = box.right,","            top = box.top,","            bottom = box.bottom,","            width = box.width,","            height = box.height,","            computedWidth,","            computedHeight,","            computedLeft,","            computedTop,","            node;","        if(autoSize)","        {","            if(autoSize == \"sizeContentToGraphic\")","            {","                node = Y.one(this._node);","                computedWidth = parseFloat(node.getComputedStyle(\"width\"));","                computedHeight = parseFloat(node.getComputedStyle(\"height\"));","                computedLeft = computedTop = 0;","                this._contentNode.setAttribute(\"preserveAspectRatio\", preserveAspectRatio);","            }","            else ","            {","                computedWidth = width;","                computedHeight = height;","                computedLeft = left;","                computedTop = top;","                this._state.width = width;","                this._state.height = height;","                if(this._node)","                {","                    this._node.style.width = width + \"px\";","                    this._node.style.height = height + \"px\";","                }","            }","        }","        else","        {","                computedWidth = width;","                computedHeight = height;","                computedLeft = left;","                computedTop = top;","        }","        if(this._contentNode)","        {","            this._contentNode.style.left = computedLeft + \"px\";","            this._contentNode.style.top = computedTop + \"px\";","            this._contentNode.setAttribute(\"width\", computedWidth);","            this._contentNode.setAttribute(\"height\", computedHeight);","            this._contentNode.style.width = computedWidth + \"px\";","            this._contentNode.style.height = computedHeight + \"px\";","            this._contentNode.setAttribute(\"viewBox\", \"\" + left + \" \" + top + \" \" + width + \" \" + height + \"\");","        }","        if(this._frag)","        {","            if(this._contentNode)","            {","                this._contentNode.appendChild(this._frag);","            }","            this._frag = null;","        } ","    },"," ","    /**","     * Adds a shape to the redraw queue and calculates the contentBounds. Used internally ","     * by `Shape` instances.","     *","     * @method addToRedrawQueue","     * @param shape {SVGShape}","     * @protected","     */","    addToRedrawQueue: function(shape)","    {","        var shapeBox,","            box;","        this._shapes[shape.get(\"id\")] = shape;","        if(!this.get(\"resizeDown\"))","        {","            shapeBox = shape.getBounds();","            box = this._contentBounds;","            box.left = box.left < shapeBox.left ? box.left : shapeBox.left;","            box.top = box.top < shapeBox.top ? box.top : shapeBox.top;","            box.right = box.right > shapeBox.right ? box.right : shapeBox.right;","            box.bottom = box.bottom > shapeBox.bottom ? box.bottom : shapeBox.bottom;","            box.width = box.right - box.left;","            box.height = box.bottom - box.top;","            this._contentBounds = box;","        }","        if(this.get(\"autoDraw\")) ","        {","            this._redraw();","        }","    },","","    /**","     * Recalculates and returns the `contentBounds` for the `Graphic` instance.","     *","     * @method _getUpdatedContentBounds","     * @return {Object} ","     * @private","     */","    _getUpdatedContentBounds: function()","    {","        var bounds,","            i,","            shape,","            queue = this._shapes,","            box = {","                left: 0,","                top: 0,","                right: 0,","                bottom: 0","            };","        for(i in queue)","        {","            if(queue.hasOwnProperty(i))","            {","                shape = queue[i];","                bounds = shape.getBounds();","                box.left = Math.min(box.left, bounds.left);","                box.top = Math.min(box.top, bounds.top);","                box.right = Math.max(box.right, bounds.right);","                box.bottom = Math.max(box.bottom, bounds.bottom);","            }","        }","        box.width = box.right - box.left;","        box.height = box.bottom - box.top;","        this._contentBounds = box;","        return box;","    },","","    /**","     * Creates a contentNode element","     *","     * @method _createGraphics","     * @private","     */","    _createGraphics: function() {","        var contentNode = this._createGraphicNode(\"svg\"),","            pointerEvents = this.get(\"pointerEvents\");","        contentNode.style.position = \"absolute\";","        contentNode.style.top = \"0px\";","        contentNode.style.left = \"0px\";","        contentNode.style.overflow = \"auto\";","        contentNode.setAttribute(\"overflow\", \"auto\");","        contentNode.setAttribute(\"pointer-events\", pointerEvents);","        return contentNode;","    },","","    /**","     * Creates a graphic node","     *","     * @method _createGraphicNode","     * @param {String} type node type to create","     * @param {String} pe specified pointer-events value","     * @return HTMLElement","     * @private","     */","    _createGraphicNode: function(type, pe)","    {","        var node = DOCUMENT.createElementNS(\"http://www.w3.org/2000/svg\", \"svg:\" + type),","            v = pe || \"none\";","        if(type !== \"defs\" && type !== \"stop\" && type !== \"linearGradient\" && type != \"radialGradient\")","        {","            node.setAttribute(\"pointer-events\", v);","        }","        return node;","    },","","    /**","     * Returns a reference to a gradient definition based on an id and type.","     *","     * @method getGradientNode","     * @param {String} key id that references the gradient definition","     * @param {String} type description of the gradient type","     * @return HTMLElement","     * @protected","     */","    getGradientNode: function(key, type)","    {","        var gradients = this._gradients,","            gradient,","            nodeType = type + \"Gradient\";","        if(gradients.hasOwnProperty(key) && gradients[key].tagName.indexOf(type) > -1)","        {","            gradient = this._gradients[key];","        }","        else","        {","            gradient = this._createGraphicNode(nodeType);","            if(!this._defs)","            {","                this._defs = this._createGraphicNode(\"defs\");","                this._contentNode.appendChild(this._defs);","            }","            this._defs.appendChild(gradient);","            key = key || \"gradient\" + Math.round(100000 * Math.random());","            gradient.setAttribute(\"id\", key);","            if(gradients.hasOwnProperty(key))","            {","                this._defs.removeChild(gradients[key]);","            }","            gradients[key] = gradient;","        }","        return gradient;","    }","","});","","Y.SVGGraphic = SVGGraphic;","","","","}, '@VERSION@', {\"requires\": [\"graphics\"]});"];
_yuitest_coverage["build/graphics-svg/graphics-svg.js"].lines = {"1":0,"3":0,"16":0,"28":0,"69":0,"78":0,"79":0,"81":0,"82":0,"83":0,"87":0,"88":0,"90":0,"91":0,"94":0,"95":0,"96":0,"97":0,"98":0,"99":0,"100":0,"101":0,"102":0,"103":0,"104":0,"105":0,"118":0,"127":0,"129":0,"130":0,"131":0,"135":0,"136":0,"138":0,"139":0,"142":0,"143":0,"144":0,"145":0,"146":0,"147":0,"148":0,"149":0,"150":0,"151":0,"152":0,"153":0,"166":0,"167":0,"168":0,"169":0,"170":0,"185":0,"186":0,"187":0,"188":0,"189":0,"190":0,"191":0,"192":0,"193":0,"206":0,"207":0,"208":0,"209":0,"210":0,"211":0,"212":0,"213":0,"214":0,"215":0,"216":0,"230":0,"232":0,"233":0,"234":0,"235":0,"236":0,"237":0,"238":0,"239":0,"240":0,"241":0,"256":0,"258":0,"259":0,"260":0,"261":0,"262":0,"263":0,"280":0,"295":0,"296":0,"298":0,"299":0,"300":0,"304":0,"306":0,"307":0,"308":0,"311":0,"313":0,"318":0,"321":0,"325":0,"328":0,"329":0,"332":0,"333":0,"334":0,"335":0,"336":0,"337":0,"338":0,"339":0,"340":0,"341":0,"342":0,"344":0,"345":0,"346":0,"347":0,"348":0,"349":0,"350":0,"351":0,"352":0,"353":0,"356":0,"357":0,"358":0,"359":0,"370":0,"375":0,"376":0,"377":0,"379":0,"380":0,"381":0,"383":0,"384":0,"385":0,"389":0,"391":0,"392":0,"393":0,"394":0,"395":0,"396":0,"397":0,"409":0,"411":0,"412":0,"413":0,"414":0,"415":0,"416":0,"417":0,"418":0,"419":0,"429":0,"430":0,"440":0,"441":0,"442":0,"443":0,"444":0,"445":0,"446":0,"447":0,"448":0,"449":0,"460":0,"472":0,"474":0,"475":0,"477":0,"478":0,"479":0,"480":0,"482":0,"484":0,"486":0,"490":0,"492":0,"497":0,"499":0,"500":0,"501":0,"503":0,"505":0,"506":0,"507":0,"508":0,"509":0,"511":0,"513":0,"514":0,"515":0,"516":0,"518":0,"521":0,"523":0,"525":0,"527":0,"530":0,"531":0,"532":0,"533":0,"544":0,"556":0,"557":0,"559":0,"560":0,"562":0,"575":0,"580":0,"581":0,"584":0,"585":0,"586":0,"587":0,"590":0,"604":0,"612":0,"614":0,"615":0,"616":0,"617":0,"618":0,"620":0,"621":0,"622":0,"623":0,"624":0,"625":0,"637":0,"638":0,"640":0,"642":0,"644":0,"646":0,"648":0,"650":0,"652":0,"653":0,"656":0,"668":0,"670":0,"671":0,"672":0,"673":0,"676":0,"678":0,"704":0,"715":0,"717":0,"718":0,"720":0,"722":0,"735":0,"736":0,"738":0,"742":0,"743":0,"746":0,"747":0,"759":0,"760":0,"771":0,"773":0,"774":0,"785":0,"789":0,"800":0,"802":0,"803":0,"804":0,"816":0,"827":0,"829":0,"841":0,"852":0,"872":0,"889":0,"892":0,"893":0,"894":0,"896":0,"898":0,"900":0,"902":0,"904":0,"920":0,"922":0,"924":0,"935":0,"941":0,"943":0,"944":0,"945":0,"946":0,"947":0,"948":0,"949":0,"950":0,"951":0,"952":0,"953":0,"954":0,"955":0,"956":0,"958":0,"962":0,"963":0,"965":0,"966":0,"972":0,"984":0,"988":0,"990":0,"991":0,"993":0,"994":0,"996":0,"998":0,"1002":0,"1003":0,"1004":0,"1005":0,"1010":0,"1022":0,"1051":0,"1053":0,"1054":0,"1055":0,"1057":0,"1059":0,"1060":0,"1064":0,"1065":0,"1067":0,"1068":0,"1072":0,"1074":0,"1075":0,"1079":0,"1080":0,"1082":0,"1083":0,"1086":0,"1087":0,"1088":0,"1089":0,"1092":0,"1093":0,"1094":0,"1095":0,"1097":0,"1098":0,"1099":0,"1100":0,"1101":0,"1102":0,"1103":0,"1107":0,"1108":0,"1109":0,"1110":0,"1111":0,"1114":0,"1115":0,"1116":0,"1118":0,"1120":0,"1121":0,"1125":0,"1126":0,"1128":0,"1129":0,"1130":0,"1131":0,"1132":0,"1133":0,"1134":0,"1135":0,"1136":0,"1137":0,"1138":0,"1139":0,"1141":0,"1143":0,"1145":0,"1147":0,"1149":0,"1165":0,"1166":0,"1167":0,"1169":0,"1182":0,"1194":0,"1206":0,"1218":0,"1229":0,"1240":0,"1251":0,"1262":0,"1275":0,"1276":0,"1277":0,"1278":0,"1279":0,"1281":0,"1293":0,"1307":0,"1309":0,"1310":0,"1311":0,"1312":0,"1313":0,"1315":0,"1318":0,"1320":0,"1321":0,"1323":0,"1325":0,"1326":0,"1328":0,"1329":0,"1331":0,"1332":0,"1334":0,"1336":0,"1339":0,"1340":0,"1347":0,"1348":0,"1350":0,"1352":0,"1354":0,"1366":0,"1367":0,"1368":0,"1369":0,"1370":0,"1371":0,"1372":0,"1373":0,"1374":0,"1375":0,"1386":0,"1409":0,"1414":0,"1424":0,"1425":0,"1427":0,"1431":0,"1443":0,"1445":0,"1446":0,"1448":0,"1450":0,"1455":0,"1466":0,"1502":0,"1503":0,"1504":0,"1505":0,"1506":0,"1511":0,"1524":0,"1529":0,"1530":0,"1532":0,"1534":0,"1547":0,"1552":0,"1553":0,"1554":0,"1556":0,"1570":0,"1575":0,"1576":0,"1577":0,"1579":0,"1614":0,"1615":0,"1617":0,"1619":0,"1669":0,"1671":0,"1672":0,"1674":0,"1676":0,"1679":0,"1716":0,"1718":0,"1720":0,"1721":0,"1723":0,"1726":0,"1739":0,"1741":0,"1743":0,"1745":0,"1750":0,"1751":0,"1753":0,"1755":0,"1771":0,"1787":0,"1791":0,"1804":0,"1806":0,"1808":0,"1809":0,"1866":0,"1879":0,"1892":0,"1893":0,"1906":0,"1910":0,"1921":0,"1923":0,"1925":0,"1926":0,"1936":0,"1937":0,"1948":0,"1950":0,"1953":0,"1955":0,"1973":0,"1982":0,"1983":0,"1984":0,"1985":0,"1986":0,"1987":0,"1988":0,"1992":0,"2002":0,"2007":0,"2008":0,"2010":0,"2012":0,"2026":0,"2031":0,"2032":0,"2034":0,"2036":0,"2040":0,"2051":0,"2053":0,"2056":0,"2058":0,"2077":0,"2083":0,"2084":0,"2085":0,"2086":0,"2087":0,"2088":0,"2092":0,"2102":0,"2103":0,"2108":0,"2121":0,"2122":0,"2127":0,"2141":0,"2149":0,"2151":0,"2153":0,"2154":0,"2172":0,"2177":0,"2178":0,"2179":0,"2182":0,"2220":0,"2231":0,"2232":0,"2235":0,"2237":0,"2255":0,"2260":0,"2261":0,"2263":0,"2265":0,"2281":0,"2297":0,"2313":0,"2326":0,"2328":0,"2330":0,"2343":0,"2345":0,"2347":0,"2417":0,"2422":0,"2423":0,"2425":0,"2427":0,"2440":0,"2445":0,"2446":0,"2448":0,"2450":0,"2472":0,"2473":0,"2488":0,"2500":0,"2509":0,"2510":0,"2512":0,"2514":0,"2516":0,"2518":0,"2520":0,"2522":0,"2523":0,"2528":0,"2530":0,"2560":0,"2562":0,"2564":0,"2566":0,"2576":0,"2578":0,"2579":0,"2585":0,"2586":0,"2587":0,"2588":0,"2589":0,"2590":0,"2591":0,"2592":0,"2593":0,"2594":0,"2595":0,"2597":0,"2608":0,"2611":0,"2612":0,"2613":0,"2614":0,"2615":0,"2616":0,"2626":0,"2627":0,"2629":0,"2630":0,"2632":0,"2634":0,"2636":0,"2638":0,"2639":0,"2640":0,"2653":0,"2654":0,"2656":0,"2658":0,"2660":0,"2661":0,"2673":0,"2675":0,"2677":0,"2681":0,"2693":0,"2695":0,"2697":0,"2700":0,"2702":0,"2703":0,"2705":0,"2707":0,"2709":0,"2719":0,"2721":0,"2723":0,"2725":0,"2728":0,"2740":0,"2742":0,"2743":0,"2745":0,"2746":0,"2747":0,"2758":0,"2770":0,"2773":0,"2775":0,"2777":0,"2779":0,"2783":0,"2785":0,"2787":0,"2789":0,"2803":0,"2804":0,"2806":0,"2808":0,"2835":0,"2836":0,"2847":0,"2848":0,"2849":0,"2850":0,"2851":0,"2863":0,"2865":0,"2867":0,"2878":0,"2892":0,"2894":0,"2896":0,"2897":0,"2898":0,"2899":0,"2900":0,"2904":0,"2905":0,"2906":0,"2907":0,"2908":0,"2909":0,"2910":0,"2912":0,"2913":0,"2919":0,"2920":0,"2921":0,"2922":0,"2924":0,"2926":0,"2927":0,"2928":0,"2929":0,"2930":0,"2931":0,"2932":0,"2934":0,"2936":0,"2938":0,"2940":0,"2954":0,"2956":0,"2957":0,"2959":0,"2960":0,"2961":0,"2962":0,"2963":0,"2964":0,"2965":0,"2966":0,"2967":0,"2969":0,"2971":0,"2984":0,"2994":0,"2996":0,"2998":0,"2999":0,"3000":0,"3001":0,"3002":0,"3003":0,"3006":0,"3007":0,"3008":0,"3009":0,"3019":0,"3021":0,"3022":0,"3023":0,"3024":0,"3025":0,"3026":0,"3027":0,"3041":0,"3043":0,"3045":0,"3047":0,"3061":0,"3064":0,"3066":0,"3070":0,"3071":0,"3073":0,"3074":0,"3076":0,"3077":0,"3078":0,"3079":0,"3081":0,"3083":0,"3085":0,"3090":0};
_yuitest_coverage["build/graphics-svg/graphics-svg.js"].functions = {"SVGDrawing:16":0,"curveTo:68":0,"quadraticCurveTo:117":0,"drawRect:165":0,"drawRoundRect:184":0,"drawCircle:205":0,"drawEllipse:229":0,"drawDiamond:254":0,"drawWedge:278":0,"lineTo:369":0,"moveTo:408":0,"end:427":0,"clear:438":0,"_closePath:458":0,"closePath:542":0,"_getCurrentArray:554":0,"getBezierData:574":0,"_setCurveBoundingBox:602":0,"_trackSize:636":0,"SVGShape:668":0,"init:702":0,"initializer:713":0,"_setGraphic:733":0,"addClass:757":0,"removeClass:769":0,"getXY:783":0,"setXY:798":0,"contains:814":0,"compareTo:826":0,"test:839":0,"_getDefaultFill:851":0,"_getDefaultStroke:870":0,"createNode:887":0,"on:918":0,"_strokeChangeHandler:933":0,"_fillChangeHandler:982":0,"_setGradientFill:1021":0,"set:1163":0,"translate:1180":0,"translateX:1192":0,"translateY:1204":0,"skew:1216":0,"skewX:1227":0,"skewY:1238":0,"rotate:1249":0,"scale:1260":0,"_addTransform:1273":0,"_updateTransform:1291":0,"_draw:1364":0,"_updateHandler:1384":0,"getBounds:1407":0,"destroy:1422":0,"_destroy:1441":0,"valueFn:1464":0,"setter:1500":0,"getter:1509":0,"valueFn:1522":0,"setter:1527":0,"getter:1545":0,"setter:1550":0,"getter:1568":0,"setter:1573":0,"setter:1613":0,"setter:1667":0,"setter:1714":0,"valueFn:1737":0,"setter:1748":0,"getter:1769":0,"getter:1785":0,"SVGPath:1804":0,"getter:1877":0,"getter:1890":0,"getter:1904":0,"SVGRect:1921":0,"SVGEllipse:1948":0,"_draw:1971":0,"setter:2000":0,"getter:2005":0,"setter:2024":0,"getter:2029":0,"SVGCircle:2051":0,"_draw:2075":0,"setter:2100":0,"getter:2106":0,"setter:2119":0,"getter:2125":0,"SVGPieSlice:2149":0,"_draw:2170":0,"SVGGraphic:2231":0,"valueFn:2253":0,"setter:2258":0,"getter:2279":0,"getter:2295":0,"getter:2311":0,"setter:2324":0,"setter:2341":0,"getter:2415":0,"setter:2420":0,"getter:2438":0,"setter:2443":0,"setter:2470":0,"set:2498":0,"getXY:2558":0,"initializer:2575":0,"render:2607":0,"destroy:2624":0,"addShape:2651":0,"_appendShape:2671":0,"removeShape:2691":0,"removeAllShapes:2717":0,"_removeChildren:2738":0,"clear:2757":0,"_toggleVisible:2768":0,"_getShapeClass:2801":0,"getShapeById:2833":0,"batch:2845":0,"_getDocFrag:2861":0,"_redraw:2876":0,"addToRedrawQueue:2952":0,"_getUpdatedContentBounds:2982":0,"_createGraphics:3018":0,"_createGraphicNode:3039":0,"getGradientNode:3059":0,"(anonymous 1):1":0};
_yuitest_coverage["build/graphics-svg/graphics-svg.js"].coveredLines = 801;
_yuitest_coverage["build/graphics-svg/graphics-svg.js"].coveredFunctions = 124;
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1);
YUI.add('graphics-svg', function (Y, NAME) {

_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "(anonymous 1)", 1);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3);
var SHAPE = "svgShape",
	Y_LANG = Y.Lang,
	AttributeLite = Y.AttributeLite,
	SVGGraphic,
    SVGShape,
	SVGCircle,
	SVGRect,
	SVGPath,
	SVGEllipse,
    SVGPieSlice,
    DOCUMENT = Y.config.doc,
    _getClassName = Y.ClassNameManager.getClassName;

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 16);
function SVGDrawing(){}

/**
 * <a href="http://www.w3.org/TR/SVG/">SVG</a> implementation of the <a href="Drawing.html">`Drawing`</a> class. 
 * `SVGDrawing` is not intended to be used directly. Instead, use the <a href="Drawing.html">`Drawing`</a> class. 
 * If the browser has <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities, the <a href="Drawing.html">`Drawing`</a> 
 * class will point to the `SVGDrawing` class.
 *
 * @module graphics
 * @class SVGDrawing
 * @constructor
 */
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 28);
SVGDrawing.prototype = {
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
     */
    curveTo: function(cp1x, cp1y, cp2x, cp2y, x, y) {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "curveTo", 68);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 69);
var pathArrayLen,
            currentArray,
            w,
            h,
            pts,
            right,
            left,
            bottom,
            top;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 78);
this._pathArray = this._pathArray || [];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 79);
if(this._pathType !== "C")
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 81);
this._pathType = "C";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 82);
currentArray = ["C"];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 83);
this._pathArray.push(currentArray);
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 87);
currentArray = this._pathArray[Math.max(0, this._pathArray.length - 1)];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 88);
if(!currentArray)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 90);
currentArray = [];
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 91);
this._pathArray.push(currentArray);
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 94);
pathArrayLen = this._pathArray.length - 1;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 95);
this._pathArray[pathArrayLen] = this._pathArray[pathArrayLen].concat([Math.round(cp1x), Math.round(cp1y), Math.round(cp2x) , Math.round(cp2y), x, y]);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 96);
right = Math.max(x, Math.max(cp1x, cp2x));
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 97);
bottom = Math.max(y, Math.max(cp1y, cp2y));
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 98);
left = Math.min(x, Math.min(cp1x, cp2x));
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 99);
top = Math.min(y, Math.min(cp1y, cp2y));
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 100);
w = Math.abs(right - left);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 101);
h = Math.abs(bottom - top);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 102);
pts = [[this._currentX, this._currentY] , [cp1x, cp1y], [cp2x, cp2y], [x, y]]; 
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 103);
this._setCurveBoundingBox(pts, w, h);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 104);
this._currentX = x;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 105);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "quadraticCurveTo", 117);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 118);
var pathArrayLen,
            currentArray,
            w,
            h,
            pts,
            right,
            left,
            bottom,
            top;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 127);
if(this._pathType !== "Q")
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 129);
this._pathType = "Q";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 130);
currentArray = ["Q"];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 131);
this._pathArray.push(currentArray);
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 135);
currentArray = this._pathArray[Math.max(0, this._pathArray.length - 1)];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 136);
if(!currentArray)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 138);
currentArray = [];
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 139);
this._pathArray.push(currentArray);
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 142);
pathArrayLen = this._pathArray.length - 1;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 143);
this._pathArray[pathArrayLen] = this._pathArray[pathArrayLen].concat([Math.round(cpx), Math.round(cpy), Math.round(x), Math.round(y)]);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 144);
right = Math.max(x, cpx);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 145);
bottom = Math.max(y, cpy);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 146);
left = Math.min(x, cpx);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 147);
top = Math.min(y, cpy);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 148);
w = Math.abs(right - left);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 149);
h = Math.abs(bottom - top);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 150);
pts = [[this._currentX, this._currentY] , [cpx, cpy], [x, y]]; 
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 151);
this._setCurveBoundingBox(pts, w, h);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 152);
this._currentX = x;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 153);
this._currentY = y;
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "drawRect", 165);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 166);
this.moveTo(x, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 167);
this.lineTo(x + w, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 168);
this.lineTo(x + w, y + h);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 169);
this.lineTo(x, y + h);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 170);
this.lineTo(x, y);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "drawRoundRect", 184);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 185);
this.moveTo(x, y + eh);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 186);
this.lineTo(x, y + h - eh);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 187);
this.quadraticCurveTo(x, y + h, x + ew, y + h);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 188);
this.lineTo(x + w - ew, y + h);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 189);
this.quadraticCurveTo(x + w, y + h, x + w, y + h - eh);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 190);
this.lineTo(x + w, y + eh);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 191);
this.quadraticCurveTo(x + w, y, x + w - ew, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 192);
this.lineTo(x + ew, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 193);
this.quadraticCurveTo(x, y, x, y + eh);
	},

    /**
     * Draws a circle.     
     * 
     * @method drawCircle
     * @param {Number} x y-coordinate
     * @param {Number} y x-coordinate
     * @param {Number} r radius
     * @protected
     */
	drawCircle: function(x, y, radius) {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "drawCircle", 205);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 206);
var circum = radius * 2;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 207);
this._drawingComplete = false;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 208);
this._trackSize(x, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 209);
this._trackSize(x + circum, y + circum);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 210);
this._pathArray = this._pathArray || [];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 211);
this._pathArray.push(["M", x + radius, y]);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 212);
this._pathArray.push(["A",  radius, radius, 0, 1, 0, x + radius, y + circum]);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 213);
this._pathArray.push(["A",  radius, radius, 0, 1, 0, x + radius, y]);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 214);
this._currentX = x;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 215);
this._currentY = y;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 216);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "drawEllipse", 229);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 230);
var radius = w * 0.5,
            yRadius = h * 0.5;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 232);
this._drawingComplete = false;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 233);
this._trackSize(x, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 234);
this._trackSize(x + w, y + h);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 235);
this._pathArray = this._pathArray || [];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 236);
this._pathArray.push(["M", x + radius, y]);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 237);
this._pathArray.push(["A",  radius, yRadius, 0, 1, 0, x + radius, y + h]);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 238);
this._pathArray.push(["A",  radius, yRadius, 0, 1, 0, x + radius, y]);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 239);
this._currentX = x;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 240);
this._currentY = y;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 241);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "drawDiamond", 254);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 256);
var midWidth = width * 0.5,
            midHeight = height * 0.5;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 258);
this.moveTo(x + midWidth, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 259);
this.lineTo(x + width, y + midHeight);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 260);
this.lineTo(x + midWidth, y + height);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 261);
this.lineTo(x, y + midHeight);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 262);
this.lineTo(x + midWidth, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 263);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "drawWedge", 278);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 280);
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
            i = 0,
            diameter = radius * 2,
            currentArray,
            pathArrayLen;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 295);
yRadius = yRadius || radius;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 296);
if(this._pathType != "M")
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 298);
this._pathType = "M";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 299);
currentArray = ["M"];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 300);
this._pathArray.push(currentArray);
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 304);
currentArray = this._getCurrentArray(); 
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 306);
pathArrayLen = this._pathArray.length - 1;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 307);
this._pathArray[pathArrayLen].push(x); 
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 308);
this._pathArray[pathArrayLen].push(x); 
        
        // limit sweep to reasonable numbers
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 311);
if(Math.abs(arc) > 360)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 313);
arc = 360;
        }
        
        // First we calculate how many segments are needed
        // for a smooth arc.
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 318);
segs = Math.ceil(Math.abs(arc) / 45);
        
        // Now calculate the sweep of each segment.
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 321);
segAngle = arc / segs;
        
        // The math requires radians rather than degrees. To convert from degrees
        // use the formula (degrees/180)*Math.PI to get radians.
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 325);
theta = -(segAngle / 180) * Math.PI;
        
        // convert angle startAngle to radians
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 328);
angle = (startAngle / 180) * Math.PI;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 329);
if(segs > 0)
        {
            // draw a line from the center to the start of the curve
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 332);
ax = x + Math.cos(startAngle / 180 * Math.PI) * radius;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 333);
ay = y + Math.sin(startAngle / 180 * Math.PI) * yRadius;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 334);
this._pathType = "L";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 335);
pathArrayLen++;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 336);
this._pathArray[pathArrayLen] = ["L"];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 337);
this._pathArray[pathArrayLen].push(Math.round(ax));
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 338);
this._pathArray[pathArrayLen].push(Math.round(ay));
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 339);
pathArrayLen++; 
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 340);
this._pathType = "Q";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 341);
this._pathArray[pathArrayLen] = ["Q"];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 342);
for(; i < segs; ++i)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 344);
angle += theta;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 345);
angleMid = angle - (theta / 2);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 346);
bx = x + Math.cos(angle) * radius;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 347);
by = y + Math.sin(angle) * yRadius;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 348);
cx = x + Math.cos(angleMid) * (radius / Math.cos(theta / 2));
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 349);
cy = y + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 350);
this._pathArray[pathArrayLen].push(Math.round(cx));
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 351);
this._pathArray[pathArrayLen].push(Math.round(cy));
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 352);
this._pathArray[pathArrayLen].push(Math.round(bx));
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 353);
this._pathArray[pathArrayLen].push(Math.round(by));
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 356);
this._currentX = x;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 357);
this._currentY = y;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 358);
this._trackSize(diameter, diameter); 
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 359);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "lineTo", 369);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 370);
var args = arguments,
            i,
            len,
            pathArrayLen,
            currentArray;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 375);
this._pathArray = this._pathArray || [];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 376);
if (typeof point1 === 'string' || typeof point1 === 'number') {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 377);
args = [[point1, point2]];
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 379);
len = args.length;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 380);
this._shapeType = "path";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 381);
if(this._pathType !== "L")
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 383);
this._pathType = "L";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 384);
currentArray = ['L'];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 385);
this._pathArray.push(currentArray);
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 389);
currentArray = this._getCurrentArray();
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 391);
pathArrayLen = this._pathArray.length - 1;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 392);
for (i = 0; i < len; ++i) {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 393);
this._pathArray[pathArrayLen].push(args[i][0]);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 394);
this._pathArray[pathArrayLen].push(args[i][1]);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 395);
this._currentX = args[i][0];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 396);
this._currentY = args[i][1];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 397);
this._trackSize.apply(this, args[i]);
        }
    },

    /**
     * Moves the current drawing position to specified x and y coordinates.
     *
     * @method moveTo
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     */
    moveTo: function(x, y) {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "moveTo", 408);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 409);
var pathArrayLen,
            currentArray;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 411);
this._pathArray = this._pathArray || [];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 412);
this._pathType = "M";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 413);
currentArray = ["M"];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 414);
this._pathArray.push(currentArray);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 415);
pathArrayLen = this._pathArray.length - 1;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 416);
this._pathArray[pathArrayLen] = this._pathArray[pathArrayLen].concat([x, y]);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 417);
this._currentX = x;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 418);
this._currentY = y;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 419);
this._trackSize(x, y);
    },
 
    /**
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "end", 427);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 429);
this._closePath();
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 430);
this._graphic.addToRedrawQueue(this);    
    },

    /**
     * Clears the path.
     *
     * @method clear
     */
    clear: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "clear", 438);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 440);
this._currentX = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 441);
this._currentY = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 442);
this._width = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 443);
this._height = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 444);
this._left = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 445);
this._right = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 446);
this._top = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 447);
this._bottom = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 448);
this._pathArray = [];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 449);
this._path = "";
    },

    /**
     * Draws the path.
     *
     * @method _closePath
     * @private
     */
    _closePath: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_closePath", 458);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 460);
var pathArray,
            segmentArray,
            pathType,
            len,
            val,
            val2,
            i,
            path = "",
            node = this.node,
            left = this._left,
            top = this._top,
            fill = this.get("fill");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 472);
if(this._pathArray)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 474);
pathArray = this._pathArray.concat();
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 475);
while(pathArray && pathArray.length > 0)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 477);
segmentArray = pathArray.shift();
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 478);
len = segmentArray.length;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 479);
pathType = segmentArray[0];
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 480);
if(pathType === "A")
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 482);
path += pathType + segmentArray[1] + "," + segmentArray[2];
                }
                else {_yuitest_coverline("build/graphics-svg/graphics-svg.js", 484);
if(pathType != "z")
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 486);
path += " " + pathType + (segmentArray[1] - left);
                }
                else
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 490);
path += " z ";
                }}
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 492);
switch(pathType)
                {
                    case "L" :
                    case "M" :
                    case "Q" :
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 497);
for(i = 2; i < len; ++i)
                        {
                            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 499);
val = (i % 2 === 0) ? top : left;
                            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 500);
val = segmentArray[i] - val;
                            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 501);
path += ", " + val;
                        }
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 503);
break;
                    case "A" :
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 505);
val = " " + segmentArray[3] + " " + segmentArray[4];
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 506);
val += "," + segmentArray[5] + " " + (segmentArray[6] - left);
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 507);
val += "," + (segmentArray[7] - top);
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 508);
path += " " + val;
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 509);
break;
                    case "C" :
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 511);
for(i = 2; i < len; ++i)
                        {
                            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 513);
val = (i % 2 === 0) ? top : left;
                            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 514);
val2 = segmentArray[i];
                            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 515);
val2 -= val;
                            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 516);
path += " " + val2;
                        }
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 518);
break;
                }
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 521);
if(fill && fill.color)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 523);
path += 'z';
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 525);
if(path)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 527);
node.setAttribute("d", path);
            }
            
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 530);
this._path = path;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 531);
this._fillChangeHandler();
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 532);
this._strokeChangeHandler();
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 533);
this._updateTransform();
        }
    },

    /**
     * Ends a fill and stroke
     *
     * @method closePath
     */
    closePath: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "closePath", 542);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 544);
this._pathArray.push(["z"]);
    },

    /**
     * Returns the current array of drawing commands.
     *
     * @method _getCurrentArray
     * @return Array
     * @private
     */
    _getCurrentArray: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_getCurrentArray", 554);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 556);
var currentArray = this._pathArray[Math.max(0, this._pathArray.length - 1)];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 557);
if(!currentArray)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 559);
currentArray = [];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 560);
this._pathArray.push(currentArray);
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 562);
return currentArray;
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getBezierData", 574);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 575);
var n = points.length,
            tmp = [],
            i,
            j;

        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 580);
for (i = 0; i < n; ++i){
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 581);
tmp[i] = [points[i][0], points[i][1]]; // save input
        }
        
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 584);
for (j = 1; j < n; ++j) {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 585);
for (i = 0; i < n - j; ++i) {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 586);
tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 587);
tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1]; 
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 590);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_setCurveBoundingBox", 602);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 604);
var i = 0,
            left = this._currentX,
            right = left,
            top = this._currentY,
            bottom = top,
            len = Math.round(Math.sqrt((w * w) + (h * h))),
            t = 1/len,
            xy;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 612);
for(; i < len; ++i)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 614);
xy = this.getBezierData(pts, t * i);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 615);
left = isNaN(left) ? xy[0] : Math.min(xy[0], left);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 616);
right = isNaN(right) ? xy[0] : Math.max(xy[0], right);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 617);
top = isNaN(top) ? xy[1] : Math.min(xy[1], top);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 618);
bottom = isNaN(bottom) ? xy[1] : Math.max(xy[1], bottom);
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 620);
left = Math.round(left * 10)/10;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 621);
right = Math.round(right * 10)/10;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 622);
top = Math.round(top * 10)/10;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 623);
bottom = Math.round(bottom * 10)/10;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 624);
this._trackSize(right, bottom);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 625);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_trackSize", 636);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 637);
if (w > this._right) {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 638);
this._right = w;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 640);
if(w < this._left)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 642);
this._left = w;    
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 644);
if (h < this._top)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 646);
this._top = h;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 648);
if (h > this._bottom) 
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 650);
this._bottom = h;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 652);
this._width = this._right - this._left;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 653);
this._height = this._bottom - this._top;
    }
};
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 656);
Y.SVGDrawing = SVGDrawing;
/**
 * <a href="http://www.w3.org/TR/SVG/">SVG</a> implementation of the <a href="Shape.html">`Shape`</a> class. 
 * `SVGShape` is not intended to be used directly. Instead, use the <a href="Shape.html">`Shape`</a> class. 
 * If the browser has <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities, the <a href="Shape.html">`Shape`</a> 
 * class will point to the `SVGShape` class.
 *
 * @module graphics
 * @class SVGShape
 * @constructor
 * @param {Object} cfg (optional) Attribute configs
 */
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 668);
SVGShape = function(cfg)
{
    _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "SVGShape", 668);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 670);
this._transforms = [];
    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 671);
this.matrix = new Y.Matrix();
    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 672);
this._normalizedMatrix = new Y.Matrix();
    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 673);
SVGShape.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 676);
SVGShape.NAME = "svgShape";

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 678);
Y.extend(SVGShape, Y.GraphicBase, Y.mix({
    /**
     * Storage for x attribute.
     *
     * @property _x
     * @protected
     */
    _x: 0,

    /**
     * Storage for y attribute.
     *
     * @property _y
     * @protected
     */
    _y: 0,
    
    /**
     * Init method, invoked during construction.
     * Calls `initializer` method.
     *
     * @method init
     * @protected
     */
	init: function()
	{
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "init", 702);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 704);
this.initializer.apply(this, arguments);
	},

	/**
	 * Initializes the shape
	 *
	 * @private
	 * @method initializer
	 */
	initializer: function(cfg)
	{
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "initializer", 713);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 715);
var host = this,
            graphic = cfg.graphic;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 717);
host.createNode(); 
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 718);
if(graphic)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 720);
host._setGraphic(graphic);
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 722);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_setGraphic", 733);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 735);
var graphic;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 736);
if(render instanceof Y.SVGGraphic)
        {
		    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 738);
this._graphic = render;
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 742);
render = Y.one(render);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 743);
graphic = new Y.SVGGraphic({
                render: render
            });
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 746);
graphic._appendShape(this);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 747);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "addClass", 757);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 759);
var node = this.node;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 760);
node.className.baseVal = Y_LANG.trim([node.className.baseVal, className].join(' '));
	},

	/**
	 * Removes a class name from each node.
	 *
	 * @method removeClass
	 * @param {String} className the class name to remove from the node's class attribute
	 */
	removeClass: function(className)
	{
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "removeClass", 769);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 771);
var node = this.node,
			classString = node.className.baseVal;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 773);
classString = classString.replace(new RegExp(className + ' '), className).replace(new RegExp(className), '');
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 774);
node.className.baseVal = classString;
	},

	/**
	 * Gets the current position of the node in page coordinates.
	 *
	 * @method getXY
	 * @return Array The XY position of the shape.
	 */
	getXY: function()
	{
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getXY", 783);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 785);
var graphic = this._graphic,
			parentXY = graphic.getXY(),
			x = this._x,
			y = this._y;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 789);
return [parentXY[0] + x, parentXY[1] + y];
	},

	/**
	 * Set the position of the shape in page coordinates, regardless of how the node is positioned.
	 *
	 * @method setXY
	 * @param {Array} Contains x & y values for new position (coordinates are page-based)
	 */
	setXY: function(xy)
	{
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setXY", 798);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 800);
var graphic = this._graphic,
			parentXY = graphic.getXY();
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 802);
this._x = xy[0] - parentXY[0];
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 803);
this._y = xy[1] - parentXY[1];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 804);
this.set("transform", this.get("transform"));
	},

	/**
	 * Determines whether the node is an ancestor of another HTML element in the DOM hierarchy. 
	 *
	 * @method contains
	 * @param {SVGShape | HTMLElement} needle The possible node or descendent
	 * @return Boolean Whether or not this shape is the needle or its ancestor.
	 */
	contains: function(needle)
	{
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "contains", 814);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 816);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "compareTo", 826);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 827);
var node = this.node;

		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 829);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "test", 839);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 841);
return Y.Selector.test(this.node, selector);
	},
	
	/**
	 * Value function for fill attribute
	 *
	 * @private
	 * @method _getDefaultFill
	 * @return Object
	 */
	_getDefaultFill: function() {
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_getDefaultFill", 851);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 852);
return {
			type: "solid",
			opacity: 1,
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_getDefaultStroke", 870);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 872);
return {
			weight: 1,
			dashstyle: "none",
			color: "#000",
			opacity: 1.0
		};
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "createNode", 887);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 889);
var node = DOCUMENT.createElementNS("http://www.w3.org/2000/svg", "svg:" + this._type),
			id = this.get("id"),
			pointerEvents = this.get("pointerEvents");
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 892);
this.node = node;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 893);
this.addClass(_getClassName(SHAPE) + " " + _getClassName(this.name)); 
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 894);
if(id)
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 896);
node.setAttribute("id", id);
		}
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 898);
if(pointerEvents)
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 900);
node.setAttribute("pointer-events", pointerEvents);
		}
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 902);
if(!this.get("visible"))
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 904);
Y.one(node).setStyle("visibility", "hidden");
        }
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "on", 918);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 920);
if(Y.Node.DOM_EVENTS[type])
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 922);
return Y.one("#" +  this.get("id")).on(type, fn);
		}
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 924);
return Y.on.apply(this, arguments);
	},

	/**
	 * Adds a stroke to the shape node.
	 *
	 * @method _strokeChangeHandler
	 * @private
	 */
	_strokeChangeHandler: function(e)
	{
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_strokeChangeHandler", 933);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 935);
var node = this.node,
			stroke = this.get("stroke"),
			strokeOpacity,
			dashstyle,
			dash,
			linejoin;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 941);
if(stroke && stroke.weight && stroke.weight > 0)
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 943);
linejoin = stroke.linejoin || "round";
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 944);
strokeOpacity = parseFloat(stroke.opacity);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 945);
dashstyle = stroke.dashstyle || "none";
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 946);
dash = Y_LANG.isArray(dashstyle) ? dashstyle.toString() : dashstyle;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 947);
stroke.color = stroke.color || "#000000";
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 948);
stroke.weight = stroke.weight || 1;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 949);
stroke.opacity = Y_LANG.isNumber(strokeOpacity) ? strokeOpacity : 1;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 950);
stroke.linecap = stroke.linecap || "butt";
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 951);
node.setAttribute("stroke-dasharray", dash);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 952);
node.setAttribute("stroke", stroke.color);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 953);
node.setAttribute("stroke-linecap", stroke.linecap);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 954);
node.setAttribute("stroke-width",  stroke.weight);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 955);
node.setAttribute("stroke-opacity", stroke.opacity);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 956);
if(linejoin == "round" || linejoin == "bevel")
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 958);
node.setAttribute("stroke-linejoin", linejoin);
			}
			else
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 962);
linejoin = parseInt(linejoin, 10);
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 963);
if(Y_LANG.isNumber(linejoin))
				{
					_yuitest_coverline("build/graphics-svg/graphics-svg.js", 965);
node.setAttribute("stroke-miterlimit",  Math.max(linejoin, 1));
					_yuitest_coverline("build/graphics-svg/graphics-svg.js", 966);
node.setAttribute("stroke-linejoin", "miter");
				}
			}
		}
		else
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 972);
node.setAttribute("stroke", "none");
		}
	},
	
	/**
	 * Adds a fill to the shape node.
	 *
	 * @method _fillChangeHandler
	 * @private
	 */
	_fillChangeHandler: function(e)
	{
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_fillChangeHandler", 982);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 984);
var node = this.node,
			fill = this.get("fill"),
			fillOpacity,
			type;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 988);
if(fill)
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 990);
type = fill.type;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 991);
if(type == "linear" || type == "radial")
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 993);
this._setGradientFill(fill);
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 994);
node.setAttribute("fill", "url(#grad" + this.get("id") + ")");
			}
			else {_yuitest_coverline("build/graphics-svg/graphics-svg.js", 996);
if(!fill.color)
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 998);
node.setAttribute("fill", "none");
			}
			else
			{
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1002);
fillOpacity = parseFloat(fill.opacity);
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1003);
fillOpacity = Y_LANG.isNumber(fillOpacity) ? fillOpacity : 1;
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1004);
node.setAttribute("fill", fill.color);
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1005);
node.setAttribute("fill-opacity", fillOpacity);
			}}
		}
		else
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1010);
node.setAttribute("fill", "none");
		}
	},

	/**
	 * Creates a gradient fill
	 *
	 * @method _setGradientFill
	 * @param {String} type gradient type
	 * @private
	 */
	_setGradientFill: function(fill) {
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_setGradientFill", 1021);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1022);
var offset,
			opacity,
			color,
			stopNode,
            newStop,
			isNumber = Y_LANG.isNumber,
			graphic = this._graphic,
			type = fill.type, 
			gradientNode = graphic.getGradientNode("grad" + this.get("id"), type),
			stops = fill.stops,
			w = this.get("width"),
			h = this.get("height"),
			rotation = fill.rotation || 0,
			radCon = Math.PI/180,
            tanRadians = parseFloat(parseFloat(Math.tan(rotation * radCon)).toFixed(8)),
            i,
			len,
			def,
			stop,
			x1 = "0%", 
			x2 = "100%", 
			y1 = "0%", 
			y2 = "0%",
			cx = fill.cx,
			cy = fill.cy,
			fx = fill.fx,
			fy = fill.fy,
			r = fill.r,
            stopNodes = [];
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1051);
if(type == "linear")
		{
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1053);
cx = w/2;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1054);
cy = h/2;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1055);
if(Math.abs(tanRadians) * w/2 >= h/2)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1057);
if(rotation < 180)
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1059);
y1 = 0;
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1060);
y2 = h;
                }
                else
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1064);
y1 = h;
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1065);
y2 = 0;
                }
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1067);
x1 = cx - ((cy - y1)/tanRadians);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1068);
x2 = cx - ((cy - y2)/tanRadians); 
            }
            else
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1072);
if(rotation > 90 && rotation < 270)
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1074);
x1 = w;
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1075);
x2 = 0;
                }
                else
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1079);
x1 = 0;
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1080);
x2 = w;
                }
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1082);
y1 = ((tanRadians * (cx - x1)) - cy) * -1;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1083);
y2 = ((tanRadians * (cx - x2)) - cy) * -1;
            }

            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1086);
x1 = Math.round(100 * x1/w);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1087);
x2 = Math.round(100 * x2/w);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1088);
y1 = Math.round(100 * y1/h);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1089);
y2 = Math.round(100 * y2/h);
            
            //Set default value if not valid 
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1092);
x1 = isNumber(x1) ? x1 : 0;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1093);
x2 = isNumber(x2) ? x2 : 100;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1094);
y1 = isNumber(y1) ? y1 : 0;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1095);
y2 = isNumber(y2) ? y2 : 0;
            
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1097);
gradientNode.setAttribute("spreadMethod", "pad");
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1098);
gradientNode.setAttribute("width", w);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1099);
gradientNode.setAttribute("height", h);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1100);
gradientNode.setAttribute("x1", x1 + "%");
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1101);
gradientNode.setAttribute("x2", x2 + "%");
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1102);
gradientNode.setAttribute("y1", y1 + "%");
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1103);
gradientNode.setAttribute("y2", y2 + "%");
		}
		else
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1107);
gradientNode.setAttribute("cx", (cx * 100) + "%");
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1108);
gradientNode.setAttribute("cy", (cy * 100) + "%");
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1109);
gradientNode.setAttribute("fx", (fx * 100) + "%");
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1110);
gradientNode.setAttribute("fy", (fy * 100) + "%");
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1111);
gradientNode.setAttribute("r", (r * 100) + "%");
		}
		
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1114);
len = stops.length;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1115);
def = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1116);
for(i = 0; i < len; ++i)
		{
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1118);
if(this._stops && this._stops.length > 0)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1120);
stopNode = this._stops.shift();
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1121);
newStop = false;
            }
            else
            {
			    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1125);
stopNode = graphic._createGraphicNode("stop");
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1126);
newStop = true;
            }
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1128);
stop = stops[i];
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1129);
opacity = stop.opacity;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1130);
color = stop.color;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1131);
offset = stop.offset || i/(len - 1);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1132);
offset = Math.round(offset * 100) + "%";
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1133);
opacity = isNumber(opacity) ? opacity : 1;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1134);
opacity = Math.max(0, Math.min(1, opacity));
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1135);
def = (i + 1) / len;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1136);
stopNode.setAttribute("offset", offset);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1137);
stopNode.setAttribute("stop-color", color);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1138);
stopNode.setAttribute("stop-opacity", opacity);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1139);
if(newStop)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1141);
gradientNode.appendChild(stopNode);
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1143);
stopNodes.push(stopNode);
		}
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1145);
while(this._stops && this._stops.length > 0)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1147);
gradientNode.removeChild(this._stops.shift());
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1149);
this._stops = stopNodes;
	},

    _stops: null,

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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "set", 1163);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1165);
var host = this;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1166);
AttributeLite.prototype.set.apply(host, arguments);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1167);
if(host.initialized)
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1169);
host._updateHandler();
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "translate", 1180);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1182);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "translateX", 1192);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1194);
this._addTransform("translateX", arguments);
    },

	/**
	 * Translates the shape along the y-axis. When translating x and y coordinates,
	 * use the `translate` method.
	 *
	 * @method translateY
	 * @param {Number} y The value to translate.
	 */
	translateY: function(y)
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "translateY", 1204);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1206);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "skew", 1216);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1218);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "skewX", 1227);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1229);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "skewY", 1238);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1240);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "rotate", 1249);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1251);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "scale", 1260);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1262);
this._addTransform("scale", arguments);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_addTransform", 1273);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1275);
args = Y.Array(args);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1276);
this._transform = Y_LANG.trim(this._transform + " " + type + "(" + args.join(", ") + ")");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1277);
args.unshift(type);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1278);
this._transforms.push(args);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1279);
if(this.initialized)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1281);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_updateTransform", 1291);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1293);
var isPath = this._type == "path",
		    node = this.node,
			key,
			transform,
			transformOrigin,
			x,
			y,
            tx,
            ty,
            matrix = this.matrix,
            normalizedMatrix = this._normalizedMatrix,
            i = 0,
            len = this._transforms.length;

        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1307);
if(isPath || (this._transforms && this._transforms.length > 0))
		{
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1309);
x = this._x;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1310);
y = this._y;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1311);
transformOrigin = this.get("transformOrigin");
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1312);
tx = x + (transformOrigin[0] * this.get("width"));
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1313);
ty = y + (transformOrigin[1] * this.get("height")); 
            //need to use translate for x/y coords
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1315);
if(isPath)
            {
                //adjust origin for custom shapes 
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1318);
if(!(this instanceof Y.SVGPath))
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1320);
tx = this._left + (transformOrigin[0] * this.get("width"));
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1321);
ty = this._top + (transformOrigin[1] * this.get("height"));
                }
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1323);
normalizedMatrix.init({dx: x + this._left, dy: y + this._top});
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1325);
normalizedMatrix.translate(tx, ty);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1326);
for(; i < len; ++i)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1328);
key = this._transforms[i].shift();
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1329);
if(key)
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1331);
normalizedMatrix[key].apply(normalizedMatrix, this._transforms[i]);
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1332);
matrix[key].apply(matrix, this._transforms[i]); 
                }
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1334);
if(isPath)
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1336);
this._transforms[i].unshift(key);
                }
			}
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1339);
normalizedMatrix.translate(-tx, -ty);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1340);
transform = "matrix(" + normalizedMatrix.a + "," + 
                            normalizedMatrix.b + "," + 
                            normalizedMatrix.c + "," + 
                            normalizedMatrix.d + "," + 
                            normalizedMatrix.dx + "," +
                            normalizedMatrix.dy + ")";
		}
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1347);
this._graphic.addToRedrawQueue(this);    
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1348);
if(transform)
		{
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1350);
node.setAttribute("transform", transform);
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1352);
if(!isPath)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1354);
this._transforms = [];
        }
	},

	/**
	 * Draws the shape.
	 *
	 * @method _draw
	 * @private
	 */
	_draw: function()
	{
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_draw", 1364);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1366);
var node = this.node;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1367);
node.setAttribute("width", this.get("width"));
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1368);
node.setAttribute("height", this.get("height"));
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1369);
node.setAttribute("x", this._x);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1370);
node.setAttribute("y", this._y);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1371);
node.style.left = this._x + "px";
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1372);
node.style.top = this._y + "px";
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1373);
this._fillChangeHandler();
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1374);
this._strokeChangeHandler();
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1375);
this._updateTransform();
	},

	/**
     * Updates `Shape` based on attribute changes.
     *
     * @method _updateHandler
	 * @private
	 */
	_updateHandler: function(e)
	{
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_updateHandler", 1384);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1386);
this._draw();
	},
    
    /**
     * Storage for the transform attribute.
     *
     * @property _transform
     * @type String
     * @private
     */
    _transform: "",

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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getBounds", 1407);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1409);
var type = this._type,
			w = this.get("width"),
			h = this.get("height"),
			x = type == "path" ? 0 : this._x,
			y = type == "path" ? 0 : this._y;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1414);
return this._normalizedMatrix.getContentRect(w, h, x, y);
	},

    /**
     * Destroys the shape instance.
     *
     * @method destroy
     */
    destroy: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "destroy", 1422);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1424);
var graphic = this.get("graphic");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1425);
if(graphic)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1427);
graphic.removeShape(this);
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1431);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_destroy", 1441);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1443);
if(this.node)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1445);
Y.Event.purgeElement(this.node, true);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1446);
if(this.node.parentNode)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1448);
this.node.parentNode.removeChild(this.node);
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1450);
this.node = null;
        }
    }
 }, Y.SVGDrawing.prototype));
	
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1455);
SVGShape.ATTRS = {
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "valueFn", 1464);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1466);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 1500);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1502);
this.matrix.init();	
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1503);
this._normalizedMatrix.init();
		    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1504);
this._transforms = this.matrix.getTransformArray(val);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1505);
this._transform = val;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1506);
return val;
		},

        getter: function()
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 1509);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1511);
return this._transform;
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "valueFn", 1522);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1524);
return Y.guid();
		},

		setter: function(val)
		{
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 1527);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1529);
var node = this.node;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1530);
if(node)
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1532);
node.setAttribute("id", val);
			}
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1534);
return val;
		}
	},

	/**
	 * Indicates the x position of shape.
	 *
	 * @config x
	 * @type Number
	 */
	x: {
	    getter: function()
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 1545);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1547);
return this._x;
        },

        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 1550);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1552);
var transform = this.get("transform");
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1553);
this._x = val;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1554);
if(transform) 
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1556);
this.set("transform", transform);
            }
        }
	},

	/**
	 * Indicates the y position of shape.
	 *
	 * @config y
	 * @type Number
	 */
	y: {
	    getter: function()
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 1568);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1570);
return this._y;
        },

        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 1573);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1575);
var transform = this.get("transform");
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1576);
this._y = val;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1577);
if(transform) 
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1579);
this.set("transform", transform);
            }
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
	 * Indicates whether the shape is visible.
	 *
	 * @config visible
	 * @type Boolean
	 */
	visible: {
		value: true,

		setter: function(val){
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 1613);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1614);
var visibility = val ? "visible" : "hidden";
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1615);
if(this.node)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1617);
this.node.style.visibility = visibility;
            }
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1619);
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
     *      <dt>cx</dt><dd>
     *          <p>The x-coordinate of the center of the gradient circle. Determines where the color stop begins. The default value 0.5.</p>
     *          <p><strong>Note: </strong>Currently, this property is not implemented for corresponding `CanvasShape` and `VMLShape` classes which are used on Android or IE 6 - 8.</p>
     *      </dd>
     *      <dt>cy</dt><dd>
     *          <p>The y-coordinate of the center of the gradient circle. Determines where the color stop begins. The default value 0.5.</p>
     *          <p><strong>Note: </strong>Currently, this property is not implemented for corresponding `CanvasShape` and `VMLShape` classes which are used on Android or IE 6 - 8.</p>
     *      </dd>
     *  </dl>
	 *
	 * @config fill
	 * @type Object 
	 */
	fill: {
		valueFn: "_getDefaultFill",
		
		setter: function(val)
		{
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 1667);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1669);
var fill,
				tmpl = this.get("fill") || this._getDefaultFill();
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1671);
fill = (val) ? Y.merge(tmpl, val) : null;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1672);
if(fill && fill.color)
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1674);
if(fill.color === undefined || fill.color == "none")
				{
					_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1676);
fill.color = null;
				}
			}
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1679);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 1714);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1716);
var tmpl = this.get("stroke") || this._getDefaultStroke(),
                wt;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1718);
if(val && val.hasOwnProperty("weight"))
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1720);
wt = parseInt(val.weight, 10);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1721);
if(!isNaN(wt))
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1723);
val.weight = wt;
                }
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1726);
return (val) ? Y.merge(tmpl, val) : null;
		}
	},
	
	// Only implemented in SVG
	// Determines whether the instance will receive mouse events.
	// 
	// @config pointerEvents
	// @type string
	//
	pointerEvents: {
		valueFn: function() 
		{
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "valueFn", 1737);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1739);
var val = "visiblePainted",
				node = this.node;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1741);
if(node)
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1743);
node.setAttribute("pointer-events", val);
			}
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1745);
return val;
		},

		setter: function(val)
		{
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 1748);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1750);
var node = this.node;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1751);
if(node)
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1753);
node.setAttribute("pointer-events", val);
			}
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1755);
return val;
		}
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 1769);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1771);
return this.node;
		}
	},

	/**
	 * Reference to the parent graphic instance
	 *
	 * @config graphic
	 * @type SVGGraphic
	 * @readOnly
	 */
	graphic: {
		readOnly: true,

		getter: function()
		{
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 1785);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1787);
return this._graphic;
		}
	}
};
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1791);
Y.SVGShape = SVGShape;

/**
 * <a href="http://www.w3.org/TR/SVG/">SVG</a> implementation of the <a href="Path.html">`Path`</a> class. 
 * `SVGPath` is not intended to be used directly. Instead, use the <a href="Path.html">`Path`</a> class. 
 * If the browser has <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities, the <a href="Path.html">`Path`</a> 
 * class will point to the `SVGPath` class.
 *
 * @module graphics
 * @class SVGPath
 * @extends SVGShape
 * @constructor
 */
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1804);
SVGPath = function(cfg)
{
	_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "SVGPath", 1804);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1806);
SVGPath.superclass.constructor.apply(this, arguments);
};
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1808);
SVGPath.NAME = "svgPath";
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1809);
Y.extend(SVGPath, Y.SVGShape, {
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
     * Indicates the type of shape
     *
     * @property _type
     * @readOnly
     * @type String
     * @private
     */
    _type: "path",

    /**
     * Storage for path
     *
     * @property _path
     * @type String
     * @private
     */
	_path: ""
});

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1866);
SVGPath.ATTRS = Y.merge(Y.SVGShape.ATTRS, {
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 1877);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1879);
return this._path;
		}
	},

	/**
	 * Indicates the width of the shape
	 * 
	 * @config width
	 * @type Number
	 */
	width: {
		getter: function()
		{
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 1890);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1892);
var val = Math.max(this._right - this._left, 0);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1893);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 1904);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1906);
return Math.max(this._bottom - this._top, 0);
		}
	}
});
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1910);
Y.SVGPath = SVGPath;
/**
 * <a href="http://www.w3.org/TR/SVG/">SVG</a> implementation of the <a href="Rect.html">`Rect`</a> class. 
 * `SVGRect` is not intended to be used directly. Instead, use the <a href="Rect.html">`Rect`</a> class. 
 * If the browser has <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities, the <a href="Rect.html">`Rect`</a> 
 * class will point to the `SVGRect` class.
 *
 * @module graphics
 * @class SVGRect
 * @constructor
 */
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1921);
SVGRect = function()
{
	_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "SVGRect", 1921);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1923);
SVGRect.superclass.constructor.apply(this, arguments);
};
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1925);
SVGRect.NAME = "svgRect";
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1926);
Y.extend(SVGRect, Y.SVGShape, {
    /**
     * Indicates the type of shape
     *
     * @property _type
     * @type String
     * @private
     */
    _type: "rect"
 });
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1936);
SVGRect.ATTRS = Y.SVGShape.ATTRS;
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1937);
Y.SVGRect = SVGRect;
/**
 * <a href="http://www.w3.org/TR/SVG/">SVG</a> implementation of the <a href="Ellipse.html">`Ellipse`</a> class. 
 * `SVGEllipse` is not intended to be used directly. Instead, use the <a href="Ellipse.html">`Ellipse`</a> class. 
 * If the browser has <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities, the <a href="Ellipse.html">`Ellipse`</a> 
 * class will point to the `SVGEllipse` class.
 *
 * @module graphics
 * @class SVGEllipse
 * @constructor
 */
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1948);
SVGEllipse = function(cfg)
{
	_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "SVGEllipse", 1948);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1950);
SVGEllipse.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1953);
SVGEllipse.NAME = "svgEllipse";

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1955);
Y.extend(SVGEllipse, SVGShape, {
	/**
	 * Indicates the type of shape
	 *
	 * @property _type
	 * @type String
     * @private
	 */
	_type: "ellipse",

	/**
	 * Updates the shape.
	 *
	 * @method _draw
	 * @private
	 */
	_draw: function()
	{
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_draw", 1971);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1973);
var node = this.node,
			w = this.get("width"),
			h = this.get("height"),
			x = this.get("x"),
			y = this.get("y"),
			xRadius = w * 0.5,
			yRadius = h * 0.5,
			cx = x + xRadius,
			cy = y + yRadius;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1982);
node.setAttribute("rx", xRadius);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1983);
node.setAttribute("ry", yRadius);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1984);
node.setAttribute("cx", cx);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1985);
node.setAttribute("cy", cy);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1986);
this._fillChangeHandler();
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1987);
this._strokeChangeHandler();
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1988);
this._updateTransform();
	}
});

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1992);
SVGEllipse.ATTRS = Y.merge(SVGShape.ATTRS, {
	/**
	 * Horizontal radius for the ellipse. 
	 *
	 * @config xRadius
	 * @type Number
	 */
	xRadius: {
		setter: function(val)
		{
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2000);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2002);
this.set("width", val * 2);
		},

		getter: function()
		{
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2005);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2007);
var val = this.get("width");
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2008);
if(val) 
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2010);
val *= 0.5;
			}
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2012);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2024);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2026);
this.set("height", val * 2);
		},

		getter: function()
		{
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2029);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2031);
var val = this.get("height");
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2032);
if(val) 
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2034);
val *= 0.5;
			}
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2036);
return val;
		}
	}
});
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2040);
Y.SVGEllipse = SVGEllipse;
/**
 * <a href="http://www.w3.org/TR/SVG/">SVG</a> implementation of the <a href="Circle.html">`Circle`</a> class. 
 * `SVGCircle` is not intended to be used directly. Instead, use the <a href="Circle.html">`Circle`</a> class. 
 * If the browser has <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities, the <a href="Circle.html">`Circle`</a> 
 * class will point to the `SVGCircle` class.
 *
 * @module graphics
 * @class SVGCircle
 * @constructor
 */
 _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2051);
SVGCircle = function(cfg)
 {
    _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "SVGCircle", 2051);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2053);
SVGCircle.superclass.constructor.apply(this, arguments);
 };
    
 _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2056);
SVGCircle.NAME = "svgCircle";

 _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2058);
Y.extend(SVGCircle, Y.SVGShape, {    
    
    /**
     * Indicates the type of shape
     *
     * @property _type
     * @type String
     * @private
     */
    _type: "circle",

    /**
     * Updates the shape.
     *
     * @method _draw
     * @private
     */
    _draw: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_draw", 2075);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2077);
var node = this.node,
            x = this.get("x"),
            y = this.get("y"),
            radius = this.get("radius"),
            cx = x + radius,
            cy = y + radius;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2083);
node.setAttribute("r", radius);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2084);
node.setAttribute("cx", cx);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2085);
node.setAttribute("cy", cy);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2086);
this._fillChangeHandler();
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2087);
this._strokeChangeHandler();
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2088);
this._updateTransform();
    }
 });
    
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2092);
SVGCircle.ATTRS = Y.merge(Y.SVGShape.ATTRS, {
	/**
	 * Indicates the width of the shape
	 *
	 * @config width
	 * @type Number
	 */
    width: {
        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2100);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2102);
this.set("radius", val/2);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2103);
return val;
        },

        getter: function()
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2106);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2108);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2119);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2121);
this.set("radius", val/2);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2122);
return val;
        },

        getter: function()
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2125);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2127);
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
        value: 0
    }
});
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2141);
Y.SVGCircle = SVGCircle;
/**
 * Draws pie slices
 *
 * @module graphics
 * @class SVGPieSlice
 * @constructor
 */
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2149);
SVGPieSlice = function()
{
	_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "SVGPieSlice", 2149);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2151);
SVGPieSlice.superclass.constructor.apply(this, arguments);
};
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2153);
SVGPieSlice.NAME = "svgPieSlice";
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2154);
Y.extend(SVGPieSlice, Y.SVGShape, Y.mix({
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_draw", 2170);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2172);
var x = this.get("cx"),
            y = this.get("cy"),
            startAngle = this.get("startAngle"),
            arc = this.get("arc"),
            radius = this.get("radius");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2177);
this.clear();
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2178);
this.drawWedge(x, y, startAngle, arc, radius);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2179);
this.end();
	}
 }, Y.SVGDrawing.prototype));
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2182);
SVGPieSlice.ATTRS = Y.mix({
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
}, Y.SVGShape.ATTRS);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2220);
Y.SVGPieSlice = SVGPieSlice;
/**
 * <a href="http://www.w3.org/TR/SVG/">SVG</a> implementation of the <a href="Graphic.html">`Graphic`</a> class. 
 * `SVGGraphic` is not intended to be used directly. Instead, use the <a href="Graphic.html">`Graphic`</a> class. 
 * If the browser has <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities, the <a href="Graphic.html">`Graphic`</a> 
 * class will point to the `SVGGraphic` class.
 *
 * @module graphics
 * @class SVGGraphic
 * @constructor
 */
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2231);
SVGGraphic = function(cfg) {
    _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "SVGGraphic", 2231);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2232);
SVGGraphic.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2235);
SVGGraphic.NAME = "svgGraphic";

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2237);
SVGGraphic.ATTRS = {
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "valueFn", 2253);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2255);
return Y.guid();
		},

		setter: function(val)
		{
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2258);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2260);
var node = this._node;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2261);
if(node)
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2263);
node.setAttribute("id", val);
			}
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2265);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2279);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2281);
return this._shapes;
        }
    },

    /**
     *  Object containing size and coordinate data for the content of a Graphic in relation to the coordSpace node.
     *
     *  @config contentBounds
     *  @type Object 
     *  @readOnly
     */
    contentBounds: {
        readOnly: true,

        getter: function()
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2295);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2297);
return this._contentBounds;
        }
    },

    /**
     *  The html element that represents to coordinate system of the Graphic instance.
     *
     *  @config node
     *  @type HTMLElement
     *  @readOnly
     */
    node: {
        readOnly: true,

        getter: function()
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2311);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2313);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2324);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2326);
if(this._node)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2328);
this._node.style.width = val + "px";
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2330);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2341);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2343);
if(this._node)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2345);
this._node.style.height = val  + "px";
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2347);
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
     * The contentBounds will resize to greater values but not to smaller values. (for performance)
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2415);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2417);
return this._x;
        },

        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2420);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2422);
this._x = val;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2423);
if(this._node)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2425);
this._node.style.left = val + "px";
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2427);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2438);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2440);
return this._y;
        },

        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2443);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2445);
this._y = val;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2446);
if(this._node)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2448);
this._node.style.top = val + "px";
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2450);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2470);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2472);
this._toggleVisible(val);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2473);
return val;
        }
    },

    //
    //  Indicates the pointer-events setting for the svg:svg element.
    //
    //  @config pointerEvents
    //  @type String
    //
    pointerEvents: {
        value: "none"
    }
};

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2488);
Y.extend(SVGGraphic, Y.GraphicBase, {
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "set", 2498);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2500);
var host = this,
            redrawAttrs = {
                autoDraw: true,
                autoSize: true,
                preserveAspectRatio: true,
                resizeDown: true
            },
            key,
            forceRedraw = false;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2509);
AttributeLite.prototype.set.apply(host, arguments);	
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2510);
if(host._state.autoDraw === true)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2512);
if(Y_LANG.isString && redrawAttrs[attr])
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2514);
forceRedraw = true;
            }
            else {_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2516);
if(Y_LANG.isObject(attr))
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2518);
for(key in redrawAttrs)
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2520);
if(redrawAttrs.hasOwnProperty(key) && attr[key])
                    {
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2522);
forceRedraw = true;
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2523);
break;
                    }
                }
            }}
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2528);
if(forceRedraw)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2530);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getXY", 2558);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2560);
var node = Y.one(this._node),
            xy;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2562);
if(node)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2564);
xy = node.getXY();
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2566);
return xy;
    },

    /**
     * Initializes the class.
     *
     * @method initializer
     * @private
     */
    initializer: function() {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "initializer", 2575);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2576);
var render = this.get("render"),
            visibility = this.get("visible") ? "visible" : "hidden";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2578);
this._shapes = {};
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2579);
this._contentBounds = {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        };
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2585);
this._gradients = {};
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2586);
this._node = DOCUMENT.createElement('div');
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2587);
this._node.style.position = "absolute";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2588);
this._node.style.left = this.get("x") + "px";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2589);
this._node.style.top = this.get("y") + "px";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2590);
this._node.style.visibility = visibility;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2591);
this._contentNode = this._createGraphics();
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2592);
this._contentNode.style.visibility = visibility;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2593);
this._contentNode.setAttribute("id", this.get("id"));
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2594);
this._node.appendChild(this._contentNode);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2595);
if(render)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2597);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "render", 2607);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2608);
var parentNode = Y.one(render),
            w = this.get("width") || parseInt(parentNode.getComputedStyle("width"), 10),
            h = this.get("height") || parseInt(parentNode.getComputedStyle("height"), 10);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2611);
parentNode = parentNode || Y.one(DOCUMENT.body);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2612);
parentNode.append(this._node);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2613);
this.parentNode = parentNode;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2614);
this.set("width", w);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2615);
this.set("height", h);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2616);
return this;
    },

    /**
     * Removes all nodes.
     *
     * @method destroy
     */
    destroy: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "destroy", 2624);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2626);
this.removeAllShapes();
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2627);
if(this._contentNode)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2629);
this._removeChildren(this._contentNode);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2630);
if(this._contentNode.parentNode)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2632);
this._contentNode.parentNode.removeChild(this._contentNode);
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2634);
this._contentNode = null;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2636);
if(this._node)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2638);
this._removeChildren(this._node);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2639);
Y.one(this._node).remove(true);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2640);
this._node = null;
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "addShape", 2651);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2653);
cfg.graphic = this;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2654);
if(!this.get("visible"))
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2656);
cfg.visible = false;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2658);
var shapeClass = this._getShapeClass(cfg.type),
            shape = new shapeClass(cfg);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2660);
this._appendShape(shape);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2661);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_appendShape", 2671);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2673);
var node = shape.node,
            parentNode = this._frag || this._contentNode;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2675);
if(this.get("autoDraw")) 
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2677);
parentNode.appendChild(node);
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2681);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "removeShape", 2691);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2693);
if(!(shape instanceof SVGShape))
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2695);
if(Y_LANG.isString(shape))
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2697);
shape = this._shapes[shape];
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2700);
if(shape && shape instanceof SVGShape)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2702);
shape._destroy();
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2703);
delete this._shapes[shape.get("id")];
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2705);
if(this.get("autoDraw")) 
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2707);
this._redraw();
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2709);
return shape;
    },

    /**
     * Removes all shape instances from the dom.
     *
     * @method removeAllShapes
     */
    removeAllShapes: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "removeAllShapes", 2717);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2719);
var shapes = this._shapes,
            i;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2721);
for(i in shapes)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2723);
if(shapes.hasOwnProperty(i))
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2725);
shapes[i]._destroy();
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2728);
this._shapes = {};
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_removeChildren", 2738);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2740);
if(node.hasChildNodes())
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2742);
var child;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2743);
while(node.firstChild)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2745);
child = node.firstChild;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2746);
this._removeChildren(child);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2747);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "clear", 2757);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2758);
this.removeAllShapes();
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_toggleVisible", 2768);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2770);
var i,
            shapes = this._shapes,
            visibility = val ? "visible" : "hidden";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2773);
if(shapes)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2775);
for(i in shapes)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2777);
if(shapes.hasOwnProperty(i))
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2779);
shapes[i].set("visible", val);
                }
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2783);
if(this._contentNode)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2785);
this._contentNode.style.visibility = visibility;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2787);
if(this._node)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2789);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_getShapeClass", 2801);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2803);
var shape = this._shapeClass[val];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2804);
if(shape)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2806);
return shape;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2808);
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
        circle: Y.SVGCircle,
        rect: Y.SVGRect,
        path: Y.SVGPath,
        ellipse: Y.SVGEllipse,
        pieslice: Y.SVGPieSlice
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getShapeById", 2833);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2835);
var shape = this._shapes[id];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2836);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "batch", 2845);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2847);
var autoDraw = this.get("autoDraw");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2848);
this.set("autoDraw", false);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2849);
method();
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2850);
this._redraw();
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2851);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_getDocFrag", 2861);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2863);
if(!this._frag)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2865);
this._frag = DOCUMENT.createDocumentFragment();
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2867);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_redraw", 2876);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2878);
var autoSize = this.get("autoSize"),
            preserveAspectRatio = this.get("preserveAspectRatio"),
            box = this.get("resizeDown") ? this._getUpdatedContentBounds() : this._contentBounds,
            left = box.left,
            right = box.right,
            top = box.top,
            bottom = box.bottom,
            width = box.width,
            height = box.height,
            computedWidth,
            computedHeight,
            computedLeft,
            computedTop,
            node;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2892);
if(autoSize)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2894);
if(autoSize == "sizeContentToGraphic")
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2896);
node = Y.one(this._node);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2897);
computedWidth = parseFloat(node.getComputedStyle("width"));
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2898);
computedHeight = parseFloat(node.getComputedStyle("height"));
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2899);
computedLeft = computedTop = 0;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2900);
this._contentNode.setAttribute("preserveAspectRatio", preserveAspectRatio);
            }
            else 
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2904);
computedWidth = width;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2905);
computedHeight = height;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2906);
computedLeft = left;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2907);
computedTop = top;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2908);
this._state.width = width;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2909);
this._state.height = height;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2910);
if(this._node)
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2912);
this._node.style.width = width + "px";
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2913);
this._node.style.height = height + "px";
                }
            }
        }
        else
        {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2919);
computedWidth = width;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2920);
computedHeight = height;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2921);
computedLeft = left;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2922);
computedTop = top;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2924);
if(this._contentNode)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2926);
this._contentNode.style.left = computedLeft + "px";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2927);
this._contentNode.style.top = computedTop + "px";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2928);
this._contentNode.setAttribute("width", computedWidth);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2929);
this._contentNode.setAttribute("height", computedHeight);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2930);
this._contentNode.style.width = computedWidth + "px";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2931);
this._contentNode.style.height = computedHeight + "px";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2932);
this._contentNode.setAttribute("viewBox", "" + left + " " + top + " " + width + " " + height + "");
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2934);
if(this._frag)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2936);
if(this._contentNode)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2938);
this._contentNode.appendChild(this._frag);
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2940);
this._frag = null;
        } 
    },
 
    /**
     * Adds a shape to the redraw queue and calculates the contentBounds. Used internally 
     * by `Shape` instances.
     *
     * @method addToRedrawQueue
     * @param shape {SVGShape}
     * @protected
     */
    addToRedrawQueue: function(shape)
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "addToRedrawQueue", 2952);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2954);
var shapeBox,
            box;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2956);
this._shapes[shape.get("id")] = shape;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2957);
if(!this.get("resizeDown"))
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2959);
shapeBox = shape.getBounds();
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2960);
box = this._contentBounds;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2961);
box.left = box.left < shapeBox.left ? box.left : shapeBox.left;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2962);
box.top = box.top < shapeBox.top ? box.top : shapeBox.top;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2963);
box.right = box.right > shapeBox.right ? box.right : shapeBox.right;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2964);
box.bottom = box.bottom > shapeBox.bottom ? box.bottom : shapeBox.bottom;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2965);
box.width = box.right - box.left;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2966);
box.height = box.bottom - box.top;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2967);
this._contentBounds = box;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2969);
if(this.get("autoDraw")) 
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2971);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_getUpdatedContentBounds", 2982);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2984);
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
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2994);
for(i in queue)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2996);
if(queue.hasOwnProperty(i))
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2998);
shape = queue[i];
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2999);
bounds = shape.getBounds();
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3000);
box.left = Math.min(box.left, bounds.left);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3001);
box.top = Math.min(box.top, bounds.top);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3002);
box.right = Math.max(box.right, bounds.right);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3003);
box.bottom = Math.max(box.bottom, bounds.bottom);
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3006);
box.width = box.right - box.left;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3007);
box.height = box.bottom - box.top;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3008);
this._contentBounds = box;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3009);
return box;
    },

    /**
     * Creates a contentNode element
     *
     * @method _createGraphics
     * @private
     */
    _createGraphics: function() {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_createGraphics", 3018);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3019);
var contentNode = this._createGraphicNode("svg"),
            pointerEvents = this.get("pointerEvents");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3021);
contentNode.style.position = "absolute";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3022);
contentNode.style.top = "0px";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3023);
contentNode.style.left = "0px";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3024);
contentNode.style.overflow = "auto";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3025);
contentNode.setAttribute("overflow", "auto");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3026);
contentNode.setAttribute("pointer-events", pointerEvents);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3027);
return contentNode;
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
    _createGraphicNode: function(type, pe)
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_createGraphicNode", 3039);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3041);
var node = DOCUMENT.createElementNS("http://www.w3.org/2000/svg", "svg:" + type),
            v = pe || "none";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3043);
if(type !== "defs" && type !== "stop" && type !== "linearGradient" && type != "radialGradient")
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3045);
node.setAttribute("pointer-events", v);
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3047);
return node;
    },

    /**
     * Returns a reference to a gradient definition based on an id and type.
     *
     * @method getGradientNode
     * @param {String} key id that references the gradient definition
     * @param {String} type description of the gradient type
     * @return HTMLElement
     * @protected
     */
    getGradientNode: function(key, type)
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getGradientNode", 3059);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3061);
var gradients = this._gradients,
            gradient,
            nodeType = type + "Gradient";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3064);
if(gradients.hasOwnProperty(key) && gradients[key].tagName.indexOf(type) > -1)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3066);
gradient = this._gradients[key];
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3070);
gradient = this._createGraphicNode(nodeType);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3071);
if(!this._defs)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3073);
this._defs = this._createGraphicNode("defs");
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3074);
this._contentNode.appendChild(this._defs);
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3076);
this._defs.appendChild(gradient);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3077);
key = key || "gradient" + Math.round(100000 * Math.random());
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3078);
gradient.setAttribute("id", key);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3079);
if(gradients.hasOwnProperty(key))
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3081);
this._defs.removeChild(gradients[key]);
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3083);
gradients[key] = gradient;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3085);
return gradient;
    }

});

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3090);
Y.SVGGraphic = SVGGraphic;



}, '@VERSION@', {"requires": ["graphics"]});
