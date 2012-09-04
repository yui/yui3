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
_yuitest_coverage["build/graphics-svg/graphics-svg.js"].code=["YUI.add('graphics-svg', function (Y, NAME) {","","var SHAPE = \"svgShape\",","	SPLITPATHPATTERN = /[a-z][^a-z]*/ig,","    SPLITARGSPATTERN = /[-]?[0-9]*[0-9|\\.][0-9]*/g,","    Y_LANG = Y.Lang,","	AttributeLite = Y.AttributeLite,","	SVGGraphic,","    SVGShape,","	SVGCircle,","	SVGRect,","	SVGPath,","	SVGEllipse,","    SVGPieSlice,","    DOCUMENT = Y.config.doc,","    _getClassName = Y.ClassNameManager.getClassName;","","function SVGDrawing(){}","","/**"," * <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> implementation of the <a href=\"Drawing.html\">`Drawing`</a> class. "," * `SVGDrawing` is not intended to be used directly. Instead, use the <a href=\"Drawing.html\">`Drawing`</a> class. "," * If the browser has <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities, the <a href=\"Drawing.html\">`Drawing`</a> "," * class will point to the `SVGDrawing` class."," *"," * @module graphics"," * @class SVGDrawing"," * @constructor"," */","SVGDrawing.prototype = {","    /**","     * Maps path to methods","     *","     * @property _pathSymbolToMethod","     * @type Object","     * @private","     */","    _pathSymbolToMethod: {","        M: \"moveTo\",","        L: \"lineTo\",","        C: \"curveTo\",","        c: \"relativeCurveTo\",","        Q: \"quadraticCurveTo\",","        z: \"closePath\",","        Z: \"closePath\"","    },","","    /**","     * Current x position of the drawing.","     *","     * @property _currentX","     * @type Number","     * @private","     */","    _currentX: 0,","","    /**","     * Current y position of the drqwing.","     *","     * @property _currentY","     * @type Number","     * @private","     */","    _currentY: 0,","    ","    /**","     * Indicates the type of shape","     *","     * @private","     * @property _type","     * @readOnly","     * @type String","     */","    _type: \"path\",","    ","    /**","     * Value for rounding up to coordsize","     *","     * @property _coordSpaceMultiplier","     * @type Number","     * @private","     */","    _coordSpaceMultiplier: 100,","","    /**","     * Rounds dimensions and position values based on the coordinate space.","     *","     * @method _round","     * @param {Number} The value for rounding","     * @return Number","     * @private","     */","    _round:function(val)","    {","        val = Math.round(val * 100)/100;","        return val;","    },","   ","    /**","     * Draws a bezier curve.","     *","     * @method curveTo","     * @param {Number} cp1x x-coordinate for the first control point.","     * @param {Number} cp1y y-coordinate for the first control point.","     * @param {Number} cp2x x-coordinate for the second control point.","     * @param {Number} cp2y y-coordinate for the second control point.","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    curveTo: function() {","        this._curveTo.apply(this, [Y.Array(arguments), false]);","    },","","    /**","     * Draws a bezier curve.","     *","     * @method curveTo","     * @param {Number} cp1x x-coordinate for the first control point.","     * @param {Number} cp1y y-coordinate for the first control point.","     * @param {Number} cp2x x-coordinate for the second control point.","     * @param {Number} cp2y y-coordinate for the second control point.","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    relativeCurveTo: function() {","        this._curveTo.apply(this, [Y.Array(arguments), true]);","    },","","    /**","     * Implements curveTo methods.","     *","     * @method _curveTo","     * @param {Array} args The arguments to be used.","     * @param {Boolean} relative Indicates whether or not to use relative coordinates.","     * @private","     */","    _curveTo: function(args, relative) {","        var w,","            h,","            pts,","            right,","            left,","            bottom,","            top,","            i = 0,","            len,","            pathArrayLen,","            currentArray,","            command = relative ? \"c\" : \"C\",","            relativeX = relative ? parseFloat(this._currentX) : 0,","            relativeY = relative ? parseFloat(this._currentY) : 0;","        this._pathArray = this._pathArray || [];","        if(this._pathType !== command)","        {","            this._pathType = command;","            currentArray = [command];","            this._pathArray.push(currentArray);","        }","        else","        {","            currentArray = this._pathArray[Math.max(0, this._pathArray.length - 1)];","            if(!currentArray)","            {","                currentArray = [];","                this._pathArray.push(currentArray);","            }","        }","        pathArrayLen = this._pathArray.length - 1;","        this._pathArray[pathArrayLen] = this._pathArray[pathArrayLen].concat(args);","        len = args.length - 5;","        for(; i < len; i = i + 6)","        {","            cp1x = args[i] + relative;","            cp1y = args[i + 1] + relative;","            cp2x = args[i + 2] + relative;","            cp2y = args[i + 3] + relative;","            x = parseFloat(args[i + 4]) + relativeX;","            y = parseFloat(args[i + 5]) + relativeY;","            right = Math.max(x, Math.max(cp1x, cp2x));","            bottom = Math.max(y, Math.max(cp1y, cp2y));","            left = Math.min(x, Math.min(cp1x, cp2x));","            top = Math.min(y, Math.min(cp1y, cp2y));","            w = Math.abs(right - left);","            h = Math.abs(bottom - top);","            pts = [[this._currentX, this._currentY] , [cp1x, cp1y], [cp2x, cp2y], [x, y]]; ","            this._setCurveBoundingBox(pts, w, h);","            this._currentX = x;","            this._currentY = y;","        }","    },","","    /**","     * Draws a quadratic bezier curve.","     *","     * @method quadraticCurveTo","     * @param {Number} cpx x-coordinate for the control point.","     * @param {Number} cpy y-coordinate for the control point.","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    quadraticCurveTo: function(cpx, cpy, x, y) {","        var pathArrayLen,","            currentArray,","            w,","            h,","            pts,","            right,","            left,","            bottom,","            top;","        if(this._pathType !== \"Q\")","        {","            this._pathType = \"Q\";","            currentArray = [\"Q\"];","            this._pathArray.push(currentArray);","        }","        else","        {","            currentArray = this._pathArray[Math.max(0, this._pathArray.length - 1)];","            if(!currentArray)","            {","                currentArray = [];","                this._pathArray.push(currentArray);","            }","        }","        pathArrayLen = this._pathArray.length - 1;","        this._pathArray[pathArrayLen] = this._pathArray[pathArrayLen].concat([Math.round(cpx), Math.round(cpy), Math.round(x), Math.round(y)]);","        right = Math.max(x, cpx);","        bottom = Math.max(y, cpy);","        left = Math.min(x, cpx);","        top = Math.min(y, cpy);","        w = Math.abs(right - left);","        h = Math.abs(bottom - top);","        pts = [[this._currentX, this._currentY] , [cpx, cpy], [x, y]]; ","        this._setCurveBoundingBox(pts, w, h);","        this._currentX = x;","        this._currentY = y;","    },","","    /**","     * Draws a rectangle.","     *","     * @method drawRect","     * @param {Number} x x-coordinate","     * @param {Number} y y-coordinate","     * @param {Number} w width","     * @param {Number} h height","     */","    drawRect: function(x, y, w, h) {","        this.moveTo(x, y);","        this.lineTo(x + w, y);","        this.lineTo(x + w, y + h);","        this.lineTo(x, y + h);","        this.lineTo(x, y);","    },","","    /**","     * Draws a rectangle with rounded corners.","     * ","     * @method drawRect","     * @param {Number} x x-coordinate","     * @param {Number} y y-coordinate","     * @param {Number} w width","     * @param {Number} h height","     * @param {Number} ew width of the ellipse used to draw the rounded corners","     * @param {Number} eh height of the ellipse used to draw the rounded corners","     */","    drawRoundRect: function(x, y, w, h, ew, eh) {","        this.moveTo(x, y + eh);","        this.lineTo(x, y + h - eh);","        this.quadraticCurveTo(x, y + h, x + ew, y + h);","        this.lineTo(x + w - ew, y + h);","        this.quadraticCurveTo(x + w, y + h, x + w, y + h - eh);","        this.lineTo(x + w, y + eh);","        this.quadraticCurveTo(x + w, y, x + w - ew, y);","        this.lineTo(x + ew, y);","        this.quadraticCurveTo(x, y, x, y + eh);","	},","","    /**","     * Draws a circle.     ","     * ","     * @method drawCircle","     * @param {Number} x y-coordinate","     * @param {Number} y x-coordinate","     * @param {Number} r radius","     * @protected","     */","	drawCircle: function(x, y, radius) {","        var circum = radius * 2;","        this._drawingComplete = false;","        this._trackSize(x, y);","        this._trackSize(x + circum, y + circum);","        this._pathArray = this._pathArray || [];","        this._pathArray.push([\"M\", x + radius, y]);","        this._pathArray.push([\"A\",  radius, radius, 0, 1, 0, x + radius, y + circum]);","        this._pathArray.push([\"A\",  radius, radius, 0, 1, 0, x + radius, y]);","        this._currentX = x;","        this._currentY = y;","        return this;","    },","   ","    /**","     * Draws an ellipse.","     *","     * @method drawEllipse","     * @param {Number} x x-coordinate","     * @param {Number} y y-coordinate","     * @param {Number} w width","     * @param {Number} h height","     * @protected","     */","	drawEllipse: function(x, y, w, h) {","        var radius = w * 0.5,","            yRadius = h * 0.5;","        this._drawingComplete = false;","        this._trackSize(x, y);","        this._trackSize(x + w, y + h);","        this._pathArray = this._pathArray || [];","        this._pathArray.push([\"M\", x + radius, y]);","        this._pathArray.push([\"A\",  radius, yRadius, 0, 1, 0, x + radius, y + h]);","        this._pathArray.push([\"A\",  radius, yRadius, 0, 1, 0, x + radius, y]);","        this._currentX = x;","        this._currentY = y;","        return this;","    },","","    /**","     * Draws a diamond.     ","     * ","     * @method drawDiamond","     * @param {Number} x y-coordinate","     * @param {Number} y x-coordinate","     * @param {Number} width width","     * @param {Number} height height","     * @protected","     */","    drawDiamond: function(x, y, width, height)","    {","        var midWidth = width * 0.5,","            midHeight = height * 0.5;","        this.moveTo(x + midWidth, y);","        this.lineTo(x + width, y + midHeight);","        this.lineTo(x + midWidth, y + height);","        this.lineTo(x, y + midHeight);","        this.lineTo(x + midWidth, y);","        return this;","    },","","    /**","     * Draws a wedge.","     *","     * @method drawWedge","     * @param {Number} x x-coordinate of the wedge's center point","     * @param {Number} y y-coordinate of the wedge's center point","     * @param {Number} startAngle starting angle in degrees","     * @param {Number} arc sweep of the wedge. Negative values draw clockwise.","     * @param {Number} radius radius of wedge. If [optional] yRadius is defined, then radius is the x radius.","     * @param {Number} yRadius [optional] y radius for wedge.","     * @private","     */","    drawWedge: function(x, y, startAngle, arc, radius, yRadius)","    {","        var segs,","            segAngle,","            theta,","            angle,","            angleMid,","            ax,","            ay,","            bx,","            by,","            cx,","            cy,","            i = 0,","            diameter = radius * 2,","            currentArray,","            pathArrayLen;","        yRadius = yRadius || radius;","        if(this._pathType != \"M\")","        {","            this._pathType = \"M\";","            currentArray = [\"M\"];","            this._pathArray.push(currentArray);","        }","        else","        {","            currentArray = this._getCurrentArray(); ","        }","        pathArrayLen = this._pathArray.length - 1;","        this._pathArray[pathArrayLen].push(x); ","        this._pathArray[pathArrayLen].push(x); ","        ","        // limit sweep to reasonable numbers","        if(Math.abs(arc) > 360)","        {","            arc = 360;","        }","        ","        // First we calculate how many segments are needed","        // for a smooth arc.","        segs = Math.ceil(Math.abs(arc) / 45);","        ","        // Now calculate the sweep of each segment.","        segAngle = arc / segs;","        ","        // The math requires radians rather than degrees. To convert from degrees","        // use the formula (degrees/180)*Math.PI to get radians.","        theta = -(segAngle / 180) * Math.PI;","        ","        // convert angle startAngle to radians","        angle = (startAngle / 180) * Math.PI;","        if(segs > 0)","        {","            // draw a line from the center to the start of the curve","            ax = x + Math.cos(startAngle / 180 * Math.PI) * radius;","            ay = y + Math.sin(startAngle / 180 * Math.PI) * yRadius;","            this._pathType = \"L\";","            pathArrayLen++;","            this._pathArray[pathArrayLen] = [\"L\"];","            this._pathArray[pathArrayLen].push(Math.round(ax));","            this._pathArray[pathArrayLen].push(Math.round(ay));","            pathArrayLen++; ","            this._pathType = \"Q\";","            this._pathArray[pathArrayLen] = [\"Q\"];","            for(; i < segs; ++i)","            {","                angle += theta;","                angleMid = angle - (theta / 2);","                bx = x + Math.cos(angle) * radius;","                by = y + Math.sin(angle) * yRadius;","                cx = x + Math.cos(angleMid) * (radius / Math.cos(theta / 2));","                cy = y + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));","                this._pathArray[pathArrayLen].push(Math.round(cx));","                this._pathArray[pathArrayLen].push(Math.round(cy));","                this._pathArray[pathArrayLen].push(Math.round(bx));","                this._pathArray[pathArrayLen].push(Math.round(by));","            }","        }","        this._currentX = x;","        this._currentY = y;","        this._trackSize(diameter, diameter); ","        return this;","    },","    ","    /**","     * Draws a line segment using the current line style from the current drawing position to the specified x and y coordinates.","     * ","     * @method lineTo","     * @param {Number} point1 x-coordinate for the end point.","     * @param {Number} point2 y-coordinate for the end point.","     */","    lineTo: function(point1, point2, etc) {","        var args = arguments,","            i,","            len,","            pathArrayLen,","            currentArray,","            x,","            y;","        this._pathArray = this._pathArray || [];","        this._shapeType = \"path\";","        len = args.length;","        if(this._pathType !== \"L\")","        {","            this._pathType = \"L\";","            currentArray = ['L'];","            this._pathArray.push(currentArray);","        }","        else","        {","            currentArray = this._getCurrentArray();","        }","        pathArrayLen = this._pathArray.length - 1;","        if (typeof point1 === 'string' || typeof point1 === 'number') {","            for (i = 0; i < len; i = i + 2) {","                x = args[i];","                y = args[i + 1];","                this._pathArray[pathArrayLen].push(x);","                this._pathArray[pathArrayLen].push(y);","                this._currentX = x;","                this._currentY = y;","                this._trackSize.apply(this, [x, y]);","            }","        }","        else","        {","            for (i = 0; i < len; ++i) {","                this._pathArray[pathArrayLen].push(args[i][0]);","               this._pathArray[pathArrayLen].push(args[i][1]);","                this._currentX = args[i][0];","                this._currentY = args[i][1];","                this._trackSize.apply(this, args[i]);","            }","        }","    },","","    /**","     * Moves the current drawing position to specified x and y coordinates.","     *","     * @method moveTo","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    moveTo: function(x, y) {","        var pathArrayLen,","            currentArray;","        this._pathArray = this._pathArray || [];","        this._pathType = \"M\";","        currentArray = [\"M\"];","        this._pathArray.push(currentArray);","        pathArrayLen = this._pathArray.length - 1;","        this._pathArray[pathArrayLen] = this._pathArray[pathArrayLen].concat([this._round(x), this._round(y)]);","        this._currentX = x;","        this._currentY = y;","        this._trackSize(x, y);","    },"," ","    /**","     * Completes a drawing operation. ","     *","     * @method end","     */","    end: function()","    {","        this._closePath();","        this._graphic.addToRedrawQueue(this);    ","    },","","    /**","     * Clears the path.","     *","     * @method clear","     */","    clear: function()","    {","        this._currentX = 0;","        this._currentY = 0;","        this._width = 0;","        this._height = 0;","        this._left = 0;","        this._right = 0;","        this._top = 0;","        this._bottom = 0;","        this._pathArray = [];","        this._path = \"\";","    },","","    /**","     * Draws the path.","     *","     * @method _closePath","     * @private","     */","    _closePath: function()","    {","        var pathArray,","            segmentArray,","            pathType,","            len,","            val,","            val2,","            i,","            path = \"\",","            node = this.node,","            left = this._round(this._left),","            top = this._round(this._top),","            fill = this.get(\"fill\");","        if(this._pathArray)","        {","            pathArray = this._pathArray.concat();","            while(pathArray && pathArray.length > 0)","            {","                segmentArray = pathArray.shift();","                len = segmentArray.length;","                pathType = segmentArray[0];","                if(pathType === \"A\" || pathType == \"c\" || pathType == \"C\")","                {","                    path += pathType + segmentArray[1] + \",\" + segmentArray[2];","                }","                else if(pathType != \"z\")","                {","                    path += \" \" + pathType + this._round(segmentArray[1] - left);","                }","                else","                {","                    path += \" z \";","                }","                switch(pathType)","                {","                    case \"L\" :","                    case \"M\" :","                    case \"Q\" :","                    case \"l\" :","                        for(i = 2; i < len; ++i)","                        {","                            val = (i % 2 === 0) ? top : left;","                            val = segmentArray[i] - val;","                            path += \", \" + this._round(val);","                        }","                    break;","                    case \"A\" :","                        val = \" \" + this._round(segmentArray[3]) + \" \" + this._round(segmentArray[4]);","                        val += \",\" + this._round(segmentArray[5]) + \" \" + this._round(segmentArray[6] - left);","                        val += \",\" + this._round(segmentArray[7] - top);","                        path += \" \" + val;","                    break;","                    case \"C\" :","                    case \"c\" :","                        for(i = 3; i < len - 1; i = i + 2)","                        {","                            val = this._round(segmentArray[i] - left);","                            val = val + \", \";","                            val = val + this._round(segmentArray[i + 1] - top);","                            path += \" \" + val;","                        }","                    break;","                }","            }","            if(fill && fill.color)","            {","                path += 'z';","            }","            Y.Lang.trim(path);","            if(path)","            {","                node.setAttribute(\"d\", path);","            }","            ","            this._path = path;","            this._fillChangeHandler();","            this._strokeChangeHandler();","            this._updateTransform();","        }","    },","","    /**","     * Ends a fill and stroke","     *","     * @method closePath","     */","    closePath: function()","    {","        this._pathArray.push([\"z\"]);","    },","","    /**","     * Returns the current array of drawing commands.","     *","     * @method _getCurrentArray","     * @return Array","     * @private","     */","    _getCurrentArray: function()","    {","        var currentArray = this._pathArray[Math.max(0, this._pathArray.length - 1)];","        if(!currentArray)","        {","            currentArray = [];","            this._pathArray.push(currentArray);","        }","        return currentArray;","    },","    ","    /**","     * Returns the points on a curve","     *","     * @method getBezierData","     * @param Array points Array containing the begin, end and control points of a curve.","     * @param Number t The value for incrementing the next set of points.","     * @return Array","     * @private","     */","    getBezierData: function(points, t) {  ","        var n = points.length,","            tmp = [],","            i,","            j;","","        for (i = 0; i < n; ++i){","            tmp[i] = [points[i][0], points[i][1]]; // save input","        }","        ","        for (j = 1; j < n; ++j) {","            for (i = 0; i < n - j; ++i) {","                tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];","                tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1]; ","            }","        }","        return [ tmp[0][0], tmp[0][1] ]; ","    },","  ","    /**","     * Calculates the bounding box for a curve","     *","     * @method _setCurveBoundingBox","     * @param Array pts Array containing points for start, end and control points of a curve.","     * @param Number w Width used to calculate the number of points to describe the curve.","     * @param Number h Height used to calculate the number of points to describe the curve.","     * @private","     */","    _setCurveBoundingBox: function(pts, w, h)","    {","        var i = 0,","            left = this._currentX,","            right = left,","            top = this._currentY,","            bottom = top,","            len = Math.round(Math.sqrt((w * w) + (h * h))),","            t = 1/len,","            xy;","        for(; i < len; ++i)","        {","            xy = this.getBezierData(pts, t * i);","            left = isNaN(left) ? xy[0] : Math.min(xy[0], left);","            right = isNaN(right) ? xy[0] : Math.max(xy[0], right);","            top = isNaN(top) ? xy[1] : Math.min(xy[1], top);","            bottom = isNaN(bottom) ? xy[1] : Math.max(xy[1], bottom);","        }","        left = Math.round(left * 10)/10;","        right = Math.round(right * 10)/10;","        top = Math.round(top * 10)/10;","        bottom = Math.round(bottom * 10)/10;","        this._trackSize(right, bottom);","        this._trackSize(left, top);","    },","    ","    /**","     * Updates the size of the graphics object","     *","     * @method _trackSize","     * @param {Number} w width","     * @param {Number} h height","     * @private","     */","    _trackSize: function(w, h) {","        if (w > this._right) {","            this._right = w;","        }","        if(w < this._left)","        {","            this._left = w;    ","        }","        if (h < this._top)","        {","            this._top = h;","        }","        if (h > this._bottom) ","        {","            this._bottom = h;","        }","        this._width = this._right - this._left;","        this._height = this._bottom - this._top;","    }","};","Y.SVGDrawing = SVGDrawing;","/**"," * <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> implementation of the <a href=\"Shape.html\">`Shape`</a> class. "," * `SVGShape` is not intended to be used directly. Instead, use the <a href=\"Shape.html\">`Shape`</a> class. "," * If the browser has <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities, the <a href=\"Shape.html\">`Shape`</a> "," * class will point to the `SVGShape` class."," *"," * @module graphics"," * @class SVGShape"," * @constructor"," * @param {Object} cfg (optional) Attribute configs"," */","SVGShape = function(cfg)","{","    this._transforms = [];","    this.matrix = new Y.Matrix();","    this._normalizedMatrix = new Y.Matrix();","    SVGShape.superclass.constructor.apply(this, arguments);","};","","SVGShape.NAME = \"svgShape\";","","Y.extend(SVGShape, Y.GraphicBase, Y.mix({","    /**","     * Storage for x attribute.","     *","     * @property _x","     * @protected","     */","    _x: 0,","","    /**","     * Storage for y attribute.","     *","     * @property _y","     * @protected","     */","    _y: 0,","    ","    /**","     * Init method, invoked during construction.","     * Calls `initializer` method.","     *","     * @method init","     * @protected","     */","	init: function()","	{","		this.initializer.apply(this, arguments);","	},","","	/**","	 * Initializes the shape","	 *","	 * @private","	 * @method initializer","	 */","	initializer: function(cfg)","	{","		var host = this,","            graphic = cfg.graphic,","            data = this.get(\"data\");","		host.createNode(); ","		if(graphic)","        {","            host._setGraphic(graphic);","        }","        if(data)","        {","            host._parsePathData(data);","        }","        host._updateHandler();","	},"," ","    /**","     * Set the Graphic instance for the shape.","     *","     * @method _setGraphic","     * @param {Graphic | Node | HTMLElement | String} render This param is used to determine the graphic instance. If it is a `Graphic` instance, it will be assigned","     * to the `graphic` attribute. Otherwise, a new Graphic instance will be created and rendered into the dom element that the render represents.","     * @private","     */","    _setGraphic: function(render)","    {","        var graphic;","        if(render instanceof Y.SVGGraphic)","        {","		    this._graphic = render;","        }","        else","        {","            render = Y.one(render);","            graphic = new Y.SVGGraphic({","                render: render","            });","            graphic._appendShape(this);","            this._graphic = graphic;","        }","    },","","	/**","	 * Add a class name to each node.","	 *","	 * @method addClass","	 * @param {String} className the class name to add to the node's class attribute ","	 */","	addClass: function(className)","	{","		var node = this.node;","		node.className.baseVal = Y_LANG.trim([node.className.baseVal, className].join(' '));","	},","","	/**","	 * Removes a class name from each node.","	 *","	 * @method removeClass","	 * @param {String} className the class name to remove from the node's class attribute","	 */","	removeClass: function(className)","	{","		var node = this.node,","			classString = node.className.baseVal;","		classString = classString.replace(new RegExp(className + ' '), className).replace(new RegExp(className), '');","		node.className.baseVal = classString;","	},","","	/**","	 * Gets the current position of the node in page coordinates.","	 *","	 * @method getXY","	 * @return Array The XY position of the shape.","	 */","	getXY: function()","	{","		var graphic = this._graphic,","			parentXY = graphic.getXY(),","			x = this._x,","			y = this._y;","		return [parentXY[0] + x, parentXY[1] + y];","	},","","	/**","	 * Set the position of the shape in page coordinates, regardless of how the node is positioned.","	 *","	 * @method setXY","	 * @param {Array} Contains x & y values for new position (coordinates are page-based)","	 */","	setXY: function(xy)","	{","		var graphic = this._graphic,","			parentXY = graphic.getXY();","		this._x = xy[0] - parentXY[0];","		this._y = xy[1] - parentXY[1];","        this.set(\"transform\", this.get(\"transform\"));","	},","","	/**","	 * Determines whether the node is an ancestor of another HTML element in the DOM hierarchy. ","	 *","	 * @method contains","	 * @param {SVGShape | HTMLElement} needle The possible node or descendent","	 * @return Boolean Whether or not this shape is the needle or its ancestor.","	 */","	contains: function(needle)","	{","		return needle === Y.one(this.node);","	},","","	/**","	 * Compares nodes to determine if they match.","	 * Node instances can be compared to each other and/or HTMLElements.","	 * @method compareTo","	 * @param {HTMLElement | Node} refNode The reference node to compare to the node.","	 * @return {Boolean} True if the nodes match, false if they do not.","	 */","	compareTo: function(refNode) {","		var node = this.node;","","		return node === refNode;","	},","","	/**","	 * Test if the supplied node matches the supplied selector.","	 *","	 * @method test","	 * @param {String} selector The CSS selector to test against.","	 * @return Boolean Wheter or not the shape matches the selector.","	 */","	test: function(selector)","	{","		return Y.Selector.test(this.node, selector);","	},","	","	/**","	 * Value function for fill attribute","	 *","	 * @private","	 * @method _getDefaultFill","	 * @return Object","	 */","	_getDefaultFill: function() {","		return {","			type: \"solid\",","			opacity: 1,","			cx: 0.5,","			cy: 0.5,","			fx: 0.5,","			fy: 0.5,","			r: 0.5","		};","	},","	","	/**","	 * Value function for stroke attribute","	 *","	 * @private","	 * @method _getDefaultStroke","	 * @return Object","	 */","	_getDefaultStroke: function() ","	{","		return {","			weight: 1,","			dashstyle: \"none\",","			color: \"#000\",","			opacity: 1.0","		};","	},","","	/**","	 * Creates the dom node for the shape.","	 *","     * @method createNode","	 * @return HTMLElement","	 * @private","	 */","	createNode: function()","	{","		var node = DOCUMENT.createElementNS(\"http://www.w3.org/2000/svg\", \"svg:\" + this._type),","			id = this.get(\"id\"),","			pointerEvents = this.get(\"pointerEvents\");","		this.node = node;","		this.addClass(_getClassName(SHAPE) + \" \" + _getClassName(this.name)); ","        if(id)","		{","			node.setAttribute(\"id\", id);","		}","		if(pointerEvents)","		{","			node.setAttribute(\"pointer-events\", pointerEvents);","		}","        if(!this.get(\"visible\"))","        {","            Y.one(node).setStyle(\"visibility\", \"hidden\");","        }","	},","	","","	/**","     * Overrides default `on` method. Checks to see if its a dom interaction event. If so, ","     * return an event attached to the `node` element. If not, return the normal functionality.","     *","     * @method on","     * @param {String} type event type","     * @param {Object} callback function","	 * @private","	 */","	on: function(type, fn)","	{","		if(Y.Node.DOM_EVENTS[type])","		{","			return Y.one(\"#\" +  this.get(\"id\")).on(type, fn);","		}","		return Y.on.apply(this, arguments);","	},","","	/**","	 * Adds a stroke to the shape node.","	 *","	 * @method _strokeChangeHandler","	 * @private","	 */","	_strokeChangeHandler: function(e)","	{","		var node = this.node,","			stroke = this.get(\"stroke\"),","			strokeOpacity,","			dashstyle,","			dash,","			linejoin;","		if(stroke && stroke.weight && stroke.weight > 0)","		{","			linejoin = stroke.linejoin || \"round\";","			strokeOpacity = parseFloat(stroke.opacity);","			dashstyle = stroke.dashstyle || \"none\";","			dash = Y_LANG.isArray(dashstyle) ? dashstyle.toString() : dashstyle;","			stroke.color = stroke.color || \"#000000\";","			stroke.weight = stroke.weight || 1;","			stroke.opacity = Y_LANG.isNumber(strokeOpacity) ? strokeOpacity : 1;","			stroke.linecap = stroke.linecap || \"butt\";","			node.setAttribute(\"stroke-dasharray\", dash);","			node.setAttribute(\"stroke\", stroke.color);","			node.setAttribute(\"stroke-linecap\", stroke.linecap);","			node.setAttribute(\"stroke-width\",  stroke.weight);","			node.setAttribute(\"stroke-opacity\", stroke.opacity);","			if(linejoin == \"round\" || linejoin == \"bevel\")","			{","				node.setAttribute(\"stroke-linejoin\", linejoin);","			}","			else","			{","				linejoin = parseInt(linejoin, 10);","				if(Y_LANG.isNumber(linejoin))","				{","					node.setAttribute(\"stroke-miterlimit\",  Math.max(linejoin, 1));","					node.setAttribute(\"stroke-linejoin\", \"miter\");","				}","			}","		}","		else","		{","			node.setAttribute(\"stroke\", \"none\");","		}","	},","	","	/**","	 * Adds a fill to the shape node.","	 *","	 * @method _fillChangeHandler","	 * @private","	 */","	_fillChangeHandler: function(e)","	{","		var node = this.node,","			fill = this.get(\"fill\"),","			fillOpacity,","			type;","		if(fill)","		{","			type = fill.type;","			if(type == \"linear\" || type == \"radial\")","			{","				this._setGradientFill(fill);","				node.setAttribute(\"fill\", \"url(#grad\" + this.get(\"id\") + \")\");","			}","			else if(!fill.color)","			{","				node.setAttribute(\"fill\", \"none\");","			}","			else","			{","                fillOpacity = parseFloat(fill.opacity);","				fillOpacity = Y_LANG.isNumber(fillOpacity) ? fillOpacity : 1;","				node.setAttribute(\"fill\", fill.color);","				node.setAttribute(\"fill-opacity\", fillOpacity);","			}","		}","		else","		{","			node.setAttribute(\"fill\", \"none\");","		}","	},","","	/**","	 * Creates a gradient fill","	 *","	 * @method _setGradientFill","	 * @param {String} type gradient type","	 * @private","	 */","	_setGradientFill: function(fill) {","		var offset,","			opacity,","			color,","			stopNode,","            newStop,","			isNumber = Y_LANG.isNumber,","			graphic = this._graphic,","			type = fill.type, ","			gradientNode = graphic.getGradientNode(\"grad\" + this.get(\"id\"), type),","			stops = fill.stops,","			w = this.get(\"width\"),","			h = this.get(\"height\"),","			rotation = fill.rotation || 0,","			radCon = Math.PI/180,","            tanRadians = parseFloat(parseFloat(Math.tan(rotation * radCon)).toFixed(8)),","            i,","			len,","			def,","			stop,","			x1 = \"0%\", ","			x2 = \"100%\", ","			y1 = \"0%\", ","			y2 = \"0%\",","			cx = fill.cx,","			cy = fill.cy,","			fx = fill.fx,","			fy = fill.fy,","			r = fill.r,","            stopNodes = [];","		if(type == \"linear\")","		{","            cx = w/2;","            cy = h/2;","            if(Math.abs(tanRadians) * w/2 >= h/2)","            {","                if(rotation < 180)","                {","                    y1 = 0;","                    y2 = h;","                }","                else","                {","                    y1 = h;","                    y2 = 0;","                }","                x1 = cx - ((cy - y1)/tanRadians);","                x2 = cx - ((cy - y2)/tanRadians); ","            }","            else","            {","                if(rotation > 90 && rotation < 270)","                {","                    x1 = w;","                    x2 = 0;","                }","                else","                {","                    x1 = 0;","                    x2 = w;","                }","                y1 = ((tanRadians * (cx - x1)) - cy) * -1;","                y2 = ((tanRadians * (cx - x2)) - cy) * -1;","            }","","            x1 = Math.round(100 * x1/w);","            x2 = Math.round(100 * x2/w);","            y1 = Math.round(100 * y1/h);","            y2 = Math.round(100 * y2/h);","            ","            //Set default value if not valid ","            x1 = isNumber(x1) ? x1 : 0;","            x2 = isNumber(x2) ? x2 : 100;","            y1 = isNumber(y1) ? y1 : 0;","            y2 = isNumber(y2) ? y2 : 0;","            ","            gradientNode.setAttribute(\"spreadMethod\", \"pad\");","			gradientNode.setAttribute(\"width\", w);","			gradientNode.setAttribute(\"height\", h);","            gradientNode.setAttribute(\"x1\", x1 + \"%\");","            gradientNode.setAttribute(\"x2\", x2 + \"%\");","            gradientNode.setAttribute(\"y1\", y1 + \"%\");","            gradientNode.setAttribute(\"y2\", y2 + \"%\");","		}","		else","		{","			gradientNode.setAttribute(\"cx\", (cx * 100) + \"%\");","			gradientNode.setAttribute(\"cy\", (cy * 100) + \"%\");","			gradientNode.setAttribute(\"fx\", (fx * 100) + \"%\");","			gradientNode.setAttribute(\"fy\", (fy * 100) + \"%\");","			gradientNode.setAttribute(\"r\", (r * 100) + \"%\");","		}","		","		len = stops.length;","		def = 0;","        for(i = 0; i < len; ++i)","		{","            if(this._stops && this._stops.length > 0)","            {","                stopNode = this._stops.shift();","                newStop = false;","            }","            else","            {","			    stopNode = graphic._createGraphicNode(\"stop\");","                newStop = true;","            }","			stop = stops[i];","			opacity = stop.opacity;","			color = stop.color;","			offset = stop.offset || i/(len - 1);","			offset = Math.round(offset * 100) + \"%\";","			opacity = isNumber(opacity) ? opacity : 1;","			opacity = Math.max(0, Math.min(1, opacity));","			def = (i + 1) / len;","			stopNode.setAttribute(\"offset\", offset);","			stopNode.setAttribute(\"stop-color\", color);","			stopNode.setAttribute(\"stop-opacity\", opacity);","			if(newStop)","            {","                gradientNode.appendChild(stopNode);","            }","            stopNodes.push(stopNode);","		}","        while(this._stops && this._stops.length > 0)","        {","            gradientNode.removeChild(this._stops.shift());","        }","        this._stops = stopNodes;","	},","","    _stops: null,","","    /**","     * Sets the value of an attribute.","     *","     * @method set","     * @param {String|Object} name The name of the attribute. Alternatively, an object of key value pairs can ","     * be passed in to set multiple attributes at once.","     * @param {Any} value The value to set the attribute to. This value is ignored if an object is received as ","     * the name param.","     */","	set: function() ","	{","		var host = this;","		AttributeLite.prototype.set.apply(host, arguments);","		if(host.initialized)","		{","			host._updateHandler();","		}","	},","","	/**","	 * Specifies a 2d translation.","	 *","	 * @method translate","	 * @param {Number} x The value to transate on the x-axis.","	 * @param {Number} y The value to translate on the y-axis.","	 */","	translate: function(x, y)","	{","		this._addTransform(\"translate\", arguments);","	},","","	/**","	 * Translates the shape along the x-axis. When translating x and y coordinates,","	 * use the `translate` method.","	 *","	 * @method translateX","	 * @param {Number} x The value to translate.","	 */","	translateX: function(x)","    {","        this._addTransform(\"translateX\", arguments);","    },","","	/**","	 * Translates the shape along the y-axis. When translating x and y coordinates,","	 * use the `translate` method.","	 *","	 * @method translateY","	 * @param {Number} y The value to translate.","	 */","	translateY: function(y)","    {","        this._addTransform(\"translateY\", arguments);","    },","","    /**","     * Skews the shape around the x-axis and y-axis.","     *","     * @method skew","     * @param {Number} x The value to skew on the x-axis.","     * @param {Number} y The value to skew on the y-axis.","     */","    skew: function(x, y)","    {","        this._addTransform(\"skew\", arguments);","    },","","	/**","	 * Skews the shape around the x-axis.","	 *","	 * @method skewX","	 * @param {Number} x x-coordinate","	 */","	 skewX: function(x)","	 {","		this._addTransform(\"skewX\", arguments);","	 },","","	/**","	 * Skews the shape around the y-axis.","	 *","	 * @method skewY","	 * @param {Number} y y-coordinate","	 */","	 skewY: function(y)","	 {","		this._addTransform(\"skewY\", arguments);","	 },","","	/**","	 * Rotates the shape clockwise around it transformOrigin.","	 *","	 * @method rotate","	 * @param {Number} deg The degree of the rotation.","	 */","	 rotate: function(deg)","	 {","		this._addTransform(\"rotate\", arguments);","	 },","","	/**","	 * Specifies a 2d scaling operation.","	 *","	 * @method scale","	 * @param {Number} val","	 */","	scale: function(x, y)","	{","		this._addTransform(\"scale\", arguments);","	},","","    /**","     * Adds a transform to the shape.","     *","     * @method _addTransform","     * @param {String} type The transform being applied.","     * @param {Array} args The arguments for the transform.","	 * @private","	 */","	_addTransform: function(type, args)","	{","        args = Y.Array(args);","        this._transform = Y_LANG.trim(this._transform + \" \" + type + \"(\" + args.join(\", \") + \")\");","        args.unshift(type);","        this._transforms.push(args);","        if(this.initialized)","        {","            this._updateTransform();","        }","	},","","	/**","     * Applies all transforms.","     *","     * @method _updateTransform","	 * @private","	 */","	_updateTransform: function()","	{","		var isPath = this._type == \"path\",","		    node = this.node,","			key,","			transform,","			transformOrigin,","			x,","			y,","            tx,","            ty,","            matrix = this.matrix,","            normalizedMatrix = this._normalizedMatrix,","            i = 0,","            len = this._transforms.length;","","        if(isPath || (this._transforms && this._transforms.length > 0))","		{","            x = this._x;","            y = this._y;","            transformOrigin = this.get(\"transformOrigin\");","            tx = x + (transformOrigin[0] * this.get(\"width\"));","            ty = y + (transformOrigin[1] * this.get(\"height\")); ","            //need to use translate for x/y coords","            if(isPath)","            {","                //adjust origin for custom shapes ","                if(!(this instanceof Y.SVGPath))","                {","                    tx = this._left + (transformOrigin[0] * this.get(\"width\"));","                    ty = this._top + (transformOrigin[1] * this.get(\"height\"));","                }","                normalizedMatrix.init({dx: x + this._left, dy: y + this._top});","            }","            normalizedMatrix.translate(tx, ty);","            for(; i < len; ++i)","            {","                key = this._transforms[i].shift();","                if(key)","                {","                    normalizedMatrix[key].apply(normalizedMatrix, this._transforms[i]);","                    matrix[key].apply(matrix, this._transforms[i]); ","                }","                if(isPath)","                {","                    this._transforms[i].unshift(key);","                }","			}","            normalizedMatrix.translate(-tx, -ty);","            transform = \"matrix(\" + normalizedMatrix.a + \",\" + ","                            normalizedMatrix.b + \",\" + ","                            normalizedMatrix.c + \",\" + ","                            normalizedMatrix.d + \",\" + ","                            normalizedMatrix.dx + \",\" +","                            normalizedMatrix.dy + \")\";","		}","        this._graphic.addToRedrawQueue(this);    ","        if(transform)","		{","            node.setAttribute(\"transform\", transform);","        }","        if(!isPath)","        {","            this._transforms = [];","        }","	},","","	/**","	 * Draws the shape.","	 *","	 * @method _draw","	 * @private","	 */","	_draw: function()","	{","		var node = this.node;","		node.setAttribute(\"width\", this.get(\"width\"));","		node.setAttribute(\"height\", this.get(\"height\"));","		node.setAttribute(\"x\", this._x);","		node.setAttribute(\"y\", this._y);","		node.style.left = this._x + \"px\";","		node.style.top = this._y + \"px\";","		this._fillChangeHandler();","		this._strokeChangeHandler();","		this._updateTransform();","	},","","	/**","     * Updates `Shape` based on attribute changes.","     *","     * @method _updateHandler","	 * @private","	 */","	_updateHandler: function(e)","	{","		this._draw();","	},","    ","    /**","     * Storage for the transform attribute.","     *","     * @property _transform","     * @type String","     * @private","     */","    _transform: \"\",","","	/**","	 * Returns the bounds for a shape.","	 *","     * Calculates the a new bounding box from the original corner coordinates (base on size and position) and the transform matrix.","     * The calculated bounding box is used by the graphic instance to calculate its viewBox. ","     *","	 * @method getBounds","	 * @return Object","	 */","	getBounds: function()","	{","		var type = this._type,","			stroke = this.get(\"stroke\"),","            w = this.get(\"width\"),","			h = this.get(\"height\"),","			x = type == \"path\" ? 0 : this._x,","			y = type == \"path\" ? 0 : this._y,","            wt = 0;","        if(type != \"path\")","        {","            if(stroke && stroke.weight)","            {","                wt = stroke.weight;","            }","            w = (x + w + wt) - (x - wt); ","            h = (y + h + wt) - (y - wt);","            x -= wt;","            y -= wt;","        }","		return this._normalizedMatrix.getContentRect(w, h, x, y);","	},","","    /**","     * Places the shape above all other shapes.","     *","     * @method toFront","     */","    toFront: function()","    {","        var graphic = this.get(\"graphic\");","        if(graphic)","        {","            graphic._toFront(this);","        }","    },","","    /**","     * Places the shape underneath all other shapes.","     *","     * @method toFront","     */","    toBack: function()","    {","        var graphic = this.get(\"graphic\");","        if(graphic)","        {","            graphic._toBack(this);","        }","    },","","    /**","     * Parses path data string and call mapped methods.","     *","     * @method _parsePathData","     * @param {String} val The path data","     * @private","     */","    _parsePathData: function(val)","    {","        var method,","            methodSymbol,","            args,","            commandArray = Y.Lang.trim(val.match(SPLITPATHPATTERN)),","            i = 0,","            len, ","            str,","            symbolToMethod = this._pathSymbolToMethod;","        if(commandArray)","        {","            this.clear();","            len = commandArray.length || 0;","            for(; i < len; i = i + 1)","            {","                str = commandArray[i];","                methodSymbol = str.substr(0, 1),","                args = str.substr(1).match(SPLITARGSPATTERN);","                method = symbolToMethod[methodSymbol];","                if(method)","                {","                    this[method].apply(this, args);","                }","            }","            this.end();","        }","    },","","    /**","     * Destroys the shape instance.","     *","     * @method destroy","     */","    destroy: function()","    {","        var graphic = this.get(\"graphic\");","        if(graphic)","        {","            graphic.removeShape(this);","        }","        else","        {","            this._destroy();","        }","    },","","    /**","     *  Implementation for shape destruction","     *","     *  @method destroy","     *  @protected","     */","    _destroy: function()","    {","        if(this.node)","        {","            Y.Event.purgeElement(this.node, true);","            if(this.node.parentNode)","            {","                this.node.parentNode.removeChild(this.node);","            }","            this.node = null;","        }","    }"," }, Y.SVGDrawing.prototype));","	","SVGShape.ATTRS = {","	/**","	 * An array of x, y values which indicates the transformOrigin in which to rotate the shape. Valid values range between 0 and 1 representing a ","	 * fraction of the shape's corresponding bounding box dimension. The default value is [0.5, 0.5].","	 *","	 * @config transformOrigin","	 * @type Array","	 */","	transformOrigin: {","		valueFn: function()","		{","			return [0.5, 0.5];","		}","	},","	","    /**","     * <p>A string containing, in order, transform operations applied to the shape instance. The `transform` string can contain the following values:","     *     ","     *    <dl>","     *        <dt>rotate</dt><dd>Rotates the shape clockwise around it transformOrigin.</dd>","     *        <dt>translate</dt><dd>Specifies a 2d translation.</dd>","     *        <dt>skew</dt><dd>Skews the shape around the x-axis and y-axis.</dd>","     *        <dt>scale</dt><dd>Specifies a 2d scaling operation.</dd>","     *        <dt>translateX</dt><dd>Translates the shape along the x-axis.</dd>","     *        <dt>translateY</dt><dd>Translates the shape along the y-axis.</dd>","     *        <dt>skewX</dt><dd>Skews the shape around the x-axis.</dd>","     *        <dt>skewY</dt><dd>Skews the shape around the y-axis.</dd>","     *        <dt>matrix</dt><dd>Specifies a 2D transformation matrix comprised of the specified six values.</dd>      ","     *    </dl>","     * </p>","     * <p>Applying transforms through the transform attribute will reset the transform matrix and apply a new transform. The shape class also contains corresponding methods for each transform","     * that will apply the transform to the current matrix. The below code illustrates how you might use the `transform` attribute to instantiate a recangle with a rotation of 45 degrees.</p>","            var myRect = new Y.Rect({","                type:\"rect\",","                width: 50,","                height: 40,","                transform: \"rotate(45)\"","            };","     * <p>The code below would apply `translate` and `rotate` to an existing shape.</p>","    ","        myRect.set(\"transform\", \"translate(40, 50) rotate(45)\");","	 * @config transform","     * @type String  ","	 */","	transform: {","		setter: function(val)","        {","            this.matrix.init();	","            this._normalizedMatrix.init();","		    this._transforms = this.matrix.getTransformArray(val);","            this._transform = val;","            return val;","		},","","        getter: function()","        {","            return this._transform;","        }","	},","","	/**","	 * Unique id for class instance.","	 *","	 * @config id","	 * @type String","	 */","	id: {","		valueFn: function()","		{","			return Y.guid();","		},","","		setter: function(val)","		{","			var node = this.node;","			if(node)","			{","				node.setAttribute(\"id\", val);","			}","			return val;","		}","	},","","	/**","	 * Indicates the x position of shape.","	 *","	 * @config x","	 * @type Number","	 */","	x: {","	    getter: function()","        {","            return this._x;","        },","","        setter: function(val)","        {","            var transform = this.get(\"transform\");","            this._x = val;","            if(transform) ","            {","                this.set(\"transform\", transform);","            }","        }","	},","","	/**","	 * Indicates the y position of shape.","	 *","	 * @config y","	 * @type Number","	 */","	y: {","	    getter: function()","        {","            return this._y;","        },","","        setter: function(val)","        {","            var transform = this.get(\"transform\");","            this._y = val;","            if(transform) ","            {","                this.set(\"transform\", transform);","            }","        }","	},","","	/**","	 * Indicates the width of the shape","	 *","	 * @config width","	 * @type Number","	 */","	width: {","        value: 0","    },","","	/**","	 * Indicates the height of the shape","	 * ","	 * @config height","	 * @type Number","	 */","	height: {","        value: 0","    },","","	/**","	 * Indicates whether the shape is visible.","	 *","	 * @config visible","	 * @type Boolean","	 */","	visible: {","		value: true,","","		setter: function(val){","			var visibility = val ? \"visible\" : \"hidden\";","			if(this.node)","            {","                this.node.style.visibility = visibility;","            }","			return val;","		}","	},","","	/**","	 * Contains information about the fill of the shape. ","     *  <dl>","     *      <dt>color</dt><dd>The color of the fill.</dd>","     *      <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the fill. The default value is 1.</dd>","     *      <dt>type</dt><dd>Type of fill.","     *          <dl>","     *              <dt>solid</dt><dd>Solid single color fill. (default)</dd>","     *              <dt>linear</dt><dd>Linear gradient fill.</dd>","     *              <dt>radial</dt><dd>Radial gradient fill.</dd>","     *          </dl>","     *      </dd>","     *  </dl>","     *  <p>If a `linear` or `radial` is specified as the fill type. The following additional property is used:","     *  <dl>","     *      <dt>stops</dt><dd>An array of objects containing the following properties:","     *          <dl>","     *              <dt>color</dt><dd>The color of the stop.</dd>","     *              <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the stop. The default value is 1. Note: No effect for IE 6 - 8</dd>","     *              <dt>offset</dt><dd>Number between 0 and 1 indicating where the color stop is positioned.</dd> ","     *          </dl>","     *      </dd>","     *      <p>Linear gradients also have the following property:</p>","     *      <dt>rotation</dt><dd>Linear gradients flow left to right by default. The rotation property allows you to change the flow by rotation. (e.g. A rotation of 180 would make the gradient pain from right to left.)</dd>","     *      <p>Radial gradients have the following additional properties:</p>","     *      <dt>r</dt><dd>Radius of the gradient circle.</dd>","     *      <dt>fx</dt><dd>Focal point x-coordinate of the gradient.</dd>","     *      <dt>fy</dt><dd>Focal point y-coordinate of the gradient.</dd>","     *      <dt>cx</dt><dd>","     *          <p>The x-coordinate of the center of the gradient circle. Determines where the color stop begins. The default value 0.5.</p>","     *          <p><strong>Note: </strong>Currently, this property is not implemented for corresponding `CanvasShape` and `VMLShape` classes which are used on Android or IE 6 - 8.</p>","     *      </dd>","     *      <dt>cy</dt><dd>","     *          <p>The y-coordinate of the center of the gradient circle. Determines where the color stop begins. The default value 0.5.</p>","     *          <p><strong>Note: </strong>Currently, this property is not implemented for corresponding `CanvasShape` and `VMLShape` classes which are used on Android or IE 6 - 8.</p>","     *      </dd>","     *  </dl>","	 *","	 * @config fill","	 * @type Object ","	 */","	fill: {","		valueFn: \"_getDefaultFill\",","		","		setter: function(val)","		{","			var fill,","				tmpl = this.get(\"fill\") || this._getDefaultFill();","			fill = (val) ? Y.merge(tmpl, val) : null;","			if(fill && fill.color)","			{","				if(fill.color === undefined || fill.color == \"none\")","				{","					fill.color = null;","				}","			}","			return fill;","		}","	},","","	/**","	 * Contains information about the stroke of the shape.","     *  <dl>","     *      <dt>color</dt><dd>The color of the stroke.</dd>","     *      <dt>weight</dt><dd>Number that indicates the width of the stroke.</dd>","     *      <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the stroke. The default value is 1.</dd>","     *      <dt>dashstyle</dt>Indicates whether to draw a dashed stroke. When set to \"none\", a solid stroke is drawn. When set to an array, the first index indicates the","     *  length of the dash. The second index indicates the length of gap.","     *      <dt>linecap</dt><dd>Specifies the linecap for the stroke. The following values can be specified:","     *          <dl>","     *              <dt>butt (default)</dt><dd>Specifies a butt linecap.</dd>","     *              <dt>square</dt><dd>Specifies a sqare linecap.</dd>","     *              <dt>round</dt><dd>Specifies a round linecap.</dd>","     *          </dl>","     *      </dd>","     *      <dt>linejoin</dt><dd>Specifies a linejoin for the stroke. The following values can be specified:","     *          <dl>","     *              <dt>round (default)</dt><dd>Specifies that the linejoin will be round.</dd>","     *              <dt>bevel</dt><dd>Specifies a bevel for the linejoin.</dd>","     *              <dt>miter limit</dt><dd>An integer specifying the miter limit of a miter linejoin. If you want to specify a linejoin of miter, you simply specify the limit as opposed to having","     *  separate miter and miter limit values.</dd>","     *          </dl>","     *      </dd>","     *  </dl>","	 *","	 * @config stroke","	 * @type Object","	 */","	stroke: {","		valueFn: \"_getDefaultStroke\",","","		setter: function(val)","		{","			var tmpl = this.get(\"stroke\") || this._getDefaultStroke(),","                wt;","            if(val && val.hasOwnProperty(\"weight\"))","            {","                wt = parseInt(val.weight, 10);","                if(!isNaN(wt))","                {","                    val.weight = wt;","                }","            }","            return (val) ? Y.merge(tmpl, val) : null;","		}","	},","	","	// Only implemented in SVG","	// Determines whether the instance will receive mouse events.","	// ","	// @config pointerEvents","	// @type string","	//","	pointerEvents: {","		valueFn: function() ","		{","			var val = \"visiblePainted\",","				node = this.node;","			if(node)","			{","				node.setAttribute(\"pointer-events\", val);","			}","			return val;","		},","","		setter: function(val)","		{","			var node = this.node;","			if(node)","			{","				node.setAttribute(\"pointer-events\", val);","			}","			return val;","		}","	},","","	/**","	 * Dom node for the shape.","	 *","	 * @config node","	 * @type HTMLElement","	 * @readOnly","	 */","	node: {","		readOnly: true,","","		getter: function()","		{","			return this.node;","		}","	},","","    /**","     * Represents an SVG Path string.","     *","     * @config data","     * @type String","     */","    data: {","        setter: function(val)","        {","            if(this.get(\"node\"))","            {","                this._parsePathData(val);","            }","            return val;","        }","    },","","	/**","	 * Reference to the parent graphic instance","	 *","	 * @config graphic","	 * @type SVGGraphic","	 * @readOnly","	 */","	graphic: {","		readOnly: true,","","		getter: function()","		{","			return this._graphic;","		}","	}","};","Y.SVGShape = SVGShape;","","/**"," * <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> implementation of the <a href=\"Path.html\">`Path`</a> class. "," * `SVGPath` is not intended to be used directly. Instead, use the <a href=\"Path.html\">`Path`</a> class. "," * If the browser has <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities, the <a href=\"Path.html\">`Path`</a> "," * class will point to the `SVGPath` class."," *"," * @module graphics"," * @class SVGPath"," * @extends SVGShape"," * @constructor"," */","SVGPath = function(cfg)","{","	SVGPath.superclass.constructor.apply(this, arguments);","};","SVGPath.NAME = \"svgPath\";","Y.extend(SVGPath, Y.SVGShape, {","    /**","     * Left edge of the path","     *","     * @property _left","     * @type Number","     * @private","     */","    _left: 0,","","    /**","     * Right edge of the path","     *","     * @property _right","     * @type Number","     * @private","     */","    _right: 0,","    ","    /**","     * Top edge of the path","     *","     * @property _top","     * @type Number","     * @private","     */","    _top: 0, ","    ","    /**","     * Bottom edge of the path","     *","     * @property _bottom","     * @type Number","     * @private","     */","    _bottom: 0,","","    /**","     * Indicates the type of shape","     *","     * @property _type","     * @readOnly","     * @type String","     * @private","     */","    _type: \"path\",","","    /**","     * Storage for path","     *","     * @property _path","     * @type String","     * @private","     */","	_path: \"\"","});","","SVGPath.ATTRS = Y.merge(Y.SVGShape.ATTRS, {","	/**","	 * Indicates the path used for the node.","	 *","	 * @config path","	 * @type String","     * @readOnly","	 */","	path: {","		readOnly: true,","","		getter: function()","		{","			return this._path;","		}","	},","","	/**","	 * Indicates the width of the shape","	 * ","	 * @config width","	 * @type Number","	 */","	width: {","		getter: function()","		{","			var val = Math.max(this._right - this._left, 0);","			return val;","		}","	},","","	/**","	 * Indicates the height of the shape","	 * ","	 * @config height","	 * @type Number","	 */","	height: {","		getter: function()","		{","			return Math.max(this._bottom - this._top, 0);","		}","	}","});","Y.SVGPath = SVGPath;","/**"," * <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> implementation of the <a href=\"Rect.html\">`Rect`</a> class. "," * `SVGRect` is not intended to be used directly. Instead, use the <a href=\"Rect.html\">`Rect`</a> class. "," * If the browser has <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities, the <a href=\"Rect.html\">`Rect`</a> "," * class will point to the `SVGRect` class."," *"," * @module graphics"," * @class SVGRect"," * @constructor"," */","SVGRect = function()","{","	SVGRect.superclass.constructor.apply(this, arguments);","};","SVGRect.NAME = \"svgRect\";","Y.extend(SVGRect, Y.SVGShape, {","    /**","     * Indicates the type of shape","     *","     * @property _type","     * @type String","     * @private","     */","    _type: \"rect\""," });","SVGRect.ATTRS = Y.SVGShape.ATTRS;","Y.SVGRect = SVGRect;","/**"," * <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> implementation of the <a href=\"Ellipse.html\">`Ellipse`</a> class. "," * `SVGEllipse` is not intended to be used directly. Instead, use the <a href=\"Ellipse.html\">`Ellipse`</a> class. "," * If the browser has <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities, the <a href=\"Ellipse.html\">`Ellipse`</a> "," * class will point to the `SVGEllipse` class."," *"," * @module graphics"," * @class SVGEllipse"," * @constructor"," */","SVGEllipse = function(cfg)","{","	SVGEllipse.superclass.constructor.apply(this, arguments);","};","","SVGEllipse.NAME = \"svgEllipse\";","","Y.extend(SVGEllipse, SVGShape, {","	/**","	 * Indicates the type of shape","	 *","	 * @property _type","	 * @type String","     * @private","	 */","	_type: \"ellipse\",","","	/**","	 * Updates the shape.","	 *","	 * @method _draw","	 * @private","	 */","	_draw: function()","	{","		var node = this.node,","			w = this.get(\"width\"),","			h = this.get(\"height\"),","			x = this.get(\"x\"),","			y = this.get(\"y\"),","			xRadius = w * 0.5,","			yRadius = h * 0.5,","			cx = x + xRadius,","			cy = y + yRadius;","		node.setAttribute(\"rx\", xRadius);","		node.setAttribute(\"ry\", yRadius);","		node.setAttribute(\"cx\", cx);","		node.setAttribute(\"cy\", cy);","		this._fillChangeHandler();","		this._strokeChangeHandler();","		this._updateTransform();","	}","});","","SVGEllipse.ATTRS = Y.merge(SVGShape.ATTRS, {","	/**","	 * Horizontal radius for the ellipse. ","	 *","	 * @config xRadius","	 * @type Number","	 */","	xRadius: {","		setter: function(val)","		{","			this.set(\"width\", val * 2);","		},","","		getter: function()","		{","			var val = this.get(\"width\");","			if(val) ","			{","				val *= 0.5;","			}","			return val;","		}","	},","","	/**","	 * Vertical radius for the ellipse. ","	 *","	 * @config yRadius","	 * @type Number","	 * @readOnly","	 */","	yRadius: {","		setter: function(val)","		{","			this.set(\"height\", val * 2);","		},","","		getter: function()","		{","			var val = this.get(\"height\");","			if(val) ","			{","				val *= 0.5;","			}","			return val;","		}","	}","});","Y.SVGEllipse = SVGEllipse;","/**"," * <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> implementation of the <a href=\"Circle.html\">`Circle`</a> class. "," * `SVGCircle` is not intended to be used directly. Instead, use the <a href=\"Circle.html\">`Circle`</a> class. "," * If the browser has <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities, the <a href=\"Circle.html\">`Circle`</a> "," * class will point to the `SVGCircle` class."," *"," * @module graphics"," * @class SVGCircle"," * @constructor"," */"," SVGCircle = function(cfg)"," {","    SVGCircle.superclass.constructor.apply(this, arguments);"," };","    "," SVGCircle.NAME = \"svgCircle\";",""," Y.extend(SVGCircle, Y.SVGShape, {    ","    ","    /**","     * Indicates the type of shape","     *","     * @property _type","     * @type String","     * @private","     */","    _type: \"circle\",","","    /**","     * Updates the shape.","     *","     * @method _draw","     * @private","     */","    _draw: function()","    {","        var node = this.node,","            x = this.get(\"x\"),","            y = this.get(\"y\"),","            radius = this.get(\"radius\"),","            cx = x + radius,","            cy = y + radius;","        node.setAttribute(\"r\", radius);","        node.setAttribute(\"cx\", cx);","        node.setAttribute(\"cy\", cy);","        this._fillChangeHandler();","        this._strokeChangeHandler();","        this._updateTransform();","    }"," });","    ","SVGCircle.ATTRS = Y.merge(Y.SVGShape.ATTRS, {","	/**","	 * Indicates the width of the shape","	 *","	 * @config width","	 * @type Number","	 */","    width: {","        setter: function(val)","        {","            this.set(\"radius\", val/2);","            return val;","        },","","        getter: function()","        {","            return this.get(\"radius\") * 2;","        }","    },","","	/**","	 * Indicates the height of the shape","	 *","	 * @config height","	 * @type Number","	 */","    height: {","        setter: function(val)","        {","            this.set(\"radius\", val/2);","            return val;","        },","","        getter: function()","        {","            return this.get(\"radius\") * 2;","        }","    },","","    /**","     * Radius of the circle","     *","     * @config radius","     * @type Number","     */","    radius: {","        value: 0","    }","});","Y.SVGCircle = SVGCircle;","/**"," * Draws pie slices"," *"," * @module graphics"," * @class SVGPieSlice"," * @constructor"," */","SVGPieSlice = function()","{","	SVGPieSlice.superclass.constructor.apply(this, arguments);","};","SVGPieSlice.NAME = \"svgPieSlice\";","Y.extend(SVGPieSlice, Y.SVGShape, Y.mix({","    /**","     * Indicates the type of shape","     *","     * @property _type","     * @type String","     * @private","     */","    _type: \"path\",","","	/**","	 * Change event listener","	 *","	 * @private","	 * @method _updateHandler","	 */","	_draw: function(e)","	{","        var x = this.get(\"cx\"),","            y = this.get(\"cy\"),","            startAngle = this.get(\"startAngle\"),","            arc = this.get(\"arc\"),","            radius = this.get(\"radius\");","        this.clear();","        this.drawWedge(x, y, startAngle, arc, radius);","		this.end();","	}"," }, Y.SVGDrawing.prototype));","SVGPieSlice.ATTRS = Y.mix({","    cx: {","        value: 0","    },","","    cy: {","        value: 0","    },","    /**","     * Starting angle in relation to a circle in which to begin the pie slice drawing.","     *","     * @config startAngle","     * @type Number","     */","    startAngle: {","        value: 0","    },","","    /**","     * Arc of the slice.","     *","     * @config arc","     * @type Number","     */","    arc: {","        value: 0","    },","","    /**","     * Radius of the circle in which the pie slice is drawn","     *","     * @config radius","     * @type Number","     */","    radius: {","        value: 0","    }","}, Y.SVGShape.ATTRS);","Y.SVGPieSlice = SVGPieSlice;","/**"," * <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> implementation of the <a href=\"Graphic.html\">`Graphic`</a> class. "," * `SVGGraphic` is not intended to be used directly. Instead, use the <a href=\"Graphic.html\">`Graphic`</a> class. "," * If the browser has <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities, the <a href=\"Graphic.html\">`Graphic`</a> "," * class will point to the `SVGGraphic` class."," *"," * @module graphics"," * @class SVGGraphic"," * @constructor"," */","SVGGraphic = function(cfg) {","    SVGGraphic.superclass.constructor.apply(this, arguments);","};","","SVGGraphic.NAME = \"svgGraphic\";","","SVGGraphic.ATTRS = {","    /**","     * Whether or not to render the `Graphic` automatically after to a specified parent node after init. This can be a Node instance or a CSS selector string.","     * ","     * @config render","     * @type Node | String ","     */","    render: {},","	","    /**","	 * Unique id for class instance.","	 *","	 * @config id","	 * @type String","	 */","	id: {","		valueFn: function()","		{","			return Y.guid();","		},","","		setter: function(val)","		{","			var node = this._node;","			if(node)","			{","				node.setAttribute(\"id\", val);","			}","			return val;","		}","	},","","    /**","     * Key value pairs in which a shape instance is associated with its id.","     *","     *  @config shapes","     *  @type Object","     *  @readOnly","     */","    shapes: {","        readOnly: true,","","        getter: function()","        {","            return this._shapes;","        }","    },","","    /**","     *  Object containing size and coordinate data for the content of a Graphic in relation to the coordSpace node.","     *","     *  @config contentBounds","     *  @type Object ","     *  @readOnly","     */","    contentBounds: {","        readOnly: true,","","        getter: function()","        {","            return this._contentBounds;","        }","    },","","    /**","     *  The html element that represents to coordinate system of the Graphic instance.","     *","     *  @config node","     *  @type HTMLElement","     *  @readOnly","     */","    node: {","        readOnly: true,","","        getter: function()","        {","            return this._node;","        }","    },","    ","	/**","	 * Indicates the width of the `Graphic`. ","	 *","	 * @config width","	 * @type Number","	 */","    width: {","        setter: function(val)","        {","            if(this._node)","            {","                this._node.style.width = val + \"px\";","            }","            return val; ","        }","    },","","	/**","	 * Indicates the height of the `Graphic`. ","	 *","	 * @config height ","	 * @type Number","	 */","    height: {","        setter: function(val)","        {","            if(this._node)","            {","                this._node.style.height = val  + \"px\";","            }","            return val;","        }","    },","","    /**","     *  Determines the sizing of the Graphic. ","     *","     *  <dl>","     *      <dt>sizeContentToGraphic</dt><dd>The Graphic's width and height attributes are, either explicitly set through the <code>width</code> and <code>height</code>","     *      attributes or are determined by the dimensions of the parent element. The content contained in the Graphic will be sized to fit with in the Graphic instance's ","     *      dimensions. When using this setting, the <code>preserveAspectRatio</code> attribute will determine how the contents are sized.</dd>","     *      <dt>sizeGraphicToContent</dt><dd>(Also accepts a value of true) The Graphic's width and height are determined by the size and positioning of the content.</dd>","     *      <dt>false</dt><dd>The Graphic's width and height attributes are, either explicitly set through the <code>width</code> and <code>height</code>","     *      attributes or are determined by the dimensions of the parent element. The contents of the Graphic instance are not affected by this setting.</dd>","     *  </dl>","     *","     *","     *  @config autoSize","     *  @type Boolean | String","     *  @default false","     */","    autoSize: {","        value: false","    },","    ","    /**","     * Determines how content is sized when <code>autoSize</code> is set to <code>sizeContentToGraphic</code>.","     *","     *  <dl>","     *      <dt>none<dt><dd>Do not force uniform scaling. Scale the graphic content of the given element non-uniformly if necessary ","     *      such that the element's bounding box exactly matches the viewport rectangle.</dd>","     *      <dt>xMinYMin</dt><dd>Force uniform scaling position along the top left of the Graphic's node.</dd>","     *      <dt>xMidYMin</dt><dd>Force uniform scaling horizontally centered and positioned at the top of the Graphic's node.<dd>","     *      <dt>xMaxYMin</dt><dd>Force uniform scaling positioned horizontally from the right and vertically from the top.</dd>","     *      <dt>xMinYMid</dt>Force uniform scaling positioned horizontally from the left and vertically centered.</dd>","     *      <dt>xMidYMid (the default)</dt><dd>Force uniform scaling with the content centered.</dd>","     *      <dt>xMaxYMid</dt><dd>Force uniform scaling positioned horizontally from the right and vertically centered.</dd>","     *      <dt>xMinYMax</dt><dd>Force uniform scaling positioned horizontally from the left and vertically from the bottom.</dd>","     *      <dt>xMidYMax</dt><dd>Force uniform scaling horizontally centered and position vertically from the bottom.</dd>","     *      <dt>xMaxYMax</dt><dd>Force uniform scaling positioned horizontally from the right and vertically from the bottom.</dd>","     *  </dl>","     * ","     * @config preserveAspectRatio","     * @type String","     * @default xMidYMid","     */","    preserveAspectRatio: {","        value: \"xMidYMid\"","    },","    ","    /**","     * The contentBounds will resize to greater values but not to smaller values. (for performance)","     * When resizing the contentBounds down is desirable, set the resizeDown value to true.","     *","     * @config resizeDown ","     * @type Boolean","     */","    resizeDown: {","        value: false","    },","","	/**","	 * Indicates the x-coordinate for the instance.","	 *","	 * @config x","	 * @type Number","	 */","    x: {","        getter: function()","        {","            return this._x;","        },","","        setter: function(val)","        {","            this._x = val;","            if(this._node)","            {","                this._node.style.left = val + \"px\";","            }","            return val;","        }","    },","","	/**","	 * Indicates the y-coordinate for the instance.","	 *","	 * @config y","	 * @type Number","	 */","    y: {","        getter: function()","        {","            return this._y;","        },","","        setter: function(val)","        {","            this._y = val;","            if(this._node)","            {","                this._node.style.top = val + \"px\";","            }","            return val;","        }","    },","","    /**","     * Indicates whether or not the instance will automatically redraw after a change is made to a shape.","     * This property will get set to false when batching operations.","     *","     * @config autoDraw","     * @type Boolean","     * @default true","     * @private","     */","    autoDraw: {","        value: true","    },","    ","    visible: {","        value: true,","","        setter: function(val)","        {","            this._toggleVisible(val);","            return val;","        }","    },","","    //","    //  Indicates the pointer-events setting for the svg:svg element.","    //","    //  @config pointerEvents","    //  @type String","    //","    pointerEvents: {","        value: \"none\"","    }","};","","Y.extend(SVGGraphic, Y.GraphicBase, {","    /**","     * Sets the value of an attribute.","     *","     * @method set","     * @param {String|Object} name The name of the attribute. Alternatively, an object of key value pairs can ","     * be passed in to set multiple attributes at once.","     * @param {Any} value The value to set the attribute to. This value is ignored if an object is received as ","     * the name param.","     */","	set: function(attr, value) ","	{","		var host = this,","            redrawAttrs = {","                autoDraw: true,","                autoSize: true,","                preserveAspectRatio: true,","                resizeDown: true","            },","            key,","            forceRedraw = false;","		AttributeLite.prototype.set.apply(host, arguments);	","        if(host._state.autoDraw === true && Y.Object.size(this._shapes) > 0)","        {","            if(Y_LANG.isString && redrawAttrs[attr])","            {","                forceRedraw = true;","            }","            else if(Y_LANG.isObject(attr))","            {","                for(key in redrawAttrs)","                {","                    if(redrawAttrs.hasOwnProperty(key) && attr[key])","                    {","                        forceRedraw = true;","                        break;","                    }","                }","            }","        }","        if(forceRedraw)","        {","            host._redraw();","        }","	},","","    /**","     * Storage for `x` attribute.","     *","     * @property _x","     * @type Number","     * @private","     */","    _x: 0,","","    /**","     * Storage for `y` attribute.","     *","     * @property _y","     * @type Number","     * @private","     */","    _y: 0,","","    /**","     * Gets the current position of the graphic instance in page coordinates.","     *","     * @method getXY","     * @return Array The XY position of the shape.","     */","    getXY: function()","    {","        var node = Y.one(this._node),","            xy;","        if(node)","        {","            xy = node.getXY();","        }","        return xy;","    },","","    /**","     * Initializes the class.","     *","     * @method initializer","     * @private","     */","    initializer: function() {","        var render = this.get(\"render\"),","            visibility = this.get(\"visible\") ? \"visible\" : \"hidden\";","        this._shapes = {};","		this._contentBounds = {","            left: 0,","            top: 0,","            right: 0,","            bottom: 0","        };","        this._gradients = {};","        this._node = DOCUMENT.createElement('div');","        this._node.style.position = \"absolute\";","        this._node.style.left = this.get(\"x\") + \"px\";","        this._node.style.top = this.get(\"y\") + \"px\";","        this._node.style.visibility = visibility;","        this._contentNode = this._createGraphics();","        this._contentNode.style.visibility = visibility;","        this._contentNode.setAttribute(\"id\", this.get(\"id\"));","        this._node.appendChild(this._contentNode);","        if(render)","        {","            this.render(render);","        }","    },","","    /**","     * Adds the graphics node to the dom.","     * ","     * @method render","     * @param {HTMLElement} parentNode node in which to render the graphics node into.","     */","    render: function(render) {","        var parentNode = Y.one(render),","            w = this.get(\"width\") || parseInt(parentNode.getComputedStyle(\"width\"), 10),","            h = this.get(\"height\") || parseInt(parentNode.getComputedStyle(\"height\"), 10);","        parentNode = parentNode || Y.one(DOCUMENT.body);","        parentNode.append(this._node);","        this.parentNode = parentNode;","        this.set(\"width\", w);","        this.set(\"height\", h);","        return this;","    },","","    /**","     * Removes all nodes.","     *","     * @method destroy","     */","    destroy: function()","    {","        this.removeAllShapes();","        if(this._contentNode)","        {","            this._removeChildren(this._contentNode);","            if(this._contentNode.parentNode)","            {","                this._contentNode.parentNode.removeChild(this._contentNode);","            }","            this._contentNode = null;","        }","        if(this._node)","        {","            this._removeChildren(this._node);","            Y.one(this._node).remove(true);","            this._node = null;","        }","    },","","    /**","     * Generates a shape instance by type.","     *","     * @method addShape","     * @param {Object} cfg attributes for the shape","     * @return Shape","     */","    addShape: function(cfg)","    {","        cfg.graphic = this;","        if(!this.get(\"visible\"))","        {","            cfg.visible = false;","        }","        var shapeClass = this._getShapeClass(cfg.type),","            shape = new shapeClass(cfg);","        this._appendShape(shape);","        return shape;","    },","","    /**","     * Adds a shape instance to the graphic instance.","     *","     * @method _appendShape","     * @param {Shape} shape The shape instance to be added to the graphic.","     * @private","     */","    _appendShape: function(shape)","    {","        var node = shape.node,","            parentNode = this._frag || this._contentNode;","        if(this.get(\"autoDraw\")) ","        {","            parentNode.appendChild(node);","        }","        else","        {","            this._getDocFrag().appendChild(node);","        }","    },","","    /**","     * Removes a shape instance from from the graphic instance.","     *","     * @method removeShape","     * @param {Shape|String} shape The instance or id of the shape to be removed.","     */","    removeShape: function(shape)","    {","        if(!(shape instanceof SVGShape))","        {","            if(Y_LANG.isString(shape))","            {","                shape = this._shapes[shape];","            }","        }","        if(shape && shape instanceof SVGShape)","        {","            shape._destroy();","            delete this._shapes[shape.get(\"id\")];","        }","        if(this.get(\"autoDraw\")) ","        {","            this._redraw();","        }","        return shape;","    },","","    /**","     * Removes all shape instances from the dom.","     *","     * @method removeAllShapes","     */","    removeAllShapes: function()","    {","        var shapes = this._shapes,","            i;","        for(i in shapes)","        {","            if(shapes.hasOwnProperty(i))","            {","                shapes[i]._destroy();","            }","        }","        this._shapes = {};","    },","    ","    /**","     * Removes all child nodes.","     *","     * @method _removeChildren","     * @param {HTMLElement} node","     * @private","     */","    _removeChildren: function(node)","    {","        if(node.hasChildNodes())","        {","            var child;","            while(node.firstChild)","            {","                child = node.firstChild;","                this._removeChildren(child);","                node.removeChild(child);","            }","        }","    },","","    /**","     * Clears the graphics object.","     *","     * @method clear","     */","    clear: function() {","        this.removeAllShapes();","    },","","    /**","     * Toggles visibility","     *","     * @method _toggleVisible","     * @param {Boolean} val indicates visibilitye","     * @private","     */","    _toggleVisible: function(val)","    {","        var i,","            shapes = this._shapes,","            visibility = val ? \"visible\" : \"hidden\";","        if(shapes)","        {","            for(i in shapes)","            {","                if(shapes.hasOwnProperty(i))","                {","                    shapes[i].set(\"visible\", val);","                }","            }","        }","        if(this._contentNode)","        {","            this._contentNode.style.visibility = visibility;","        }","        if(this._node)","        {","            this._node.style.visibility = visibility;","        }","    },","","    /**","     * Returns a shape class. Used by `addShape`. ","     *","     * @method _getShapeClass","     * @param {Shape | String} val Indicates which shape class. ","     * @return Function ","     * @private","     */","    _getShapeClass: function(val)","    {","        var shape = this._shapeClass[val];","        if(shape)","        {","            return shape;","        }","        return val;","    },","","    /**","     * Look up for shape classes. Used by `addShape` to retrieve a class for instantiation.","     *","     * @property _shapeClass","     * @type Object","     * @private","     */","    _shapeClass: {","        circle: Y.SVGCircle,","        rect: Y.SVGRect,","        path: Y.SVGPath,","        ellipse: Y.SVGEllipse,","        pieslice: Y.SVGPieSlice","    },","    ","    /**","     * Returns a shape based on the id of its dom node.","     *","     * @method getShapeById","     * @param {String} id Dom id of the shape's node attribute.","     * @return Shape","     */","    getShapeById: function(id)","    {","        var shape = this._shapes[id];","        return shape;","    },","","	/**","	 * Allows for creating multiple shapes in order to batch appending and redraw operations.","	 *","	 * @method batch","	 * @param {Function} method Method to execute.","	 */","    batch: function(method)","    {","        var autoDraw = this.get(\"autoDraw\");","        this.set(\"autoDraw\", false);","        method();","        this._redraw();","        this.set(\"autoDraw\", autoDraw);","    },","    ","    /**","     * Returns a document fragment to for attaching shapes.","     *","     * @method _getDocFrag","     * @return DocumentFragment","     * @private","     */","    _getDocFrag: function()","    {","        if(!this._frag)","        {","            this._frag = DOCUMENT.createDocumentFragment();","        }","        return this._frag;","    },","","    /**","     * Redraws all shapes.","     *","     * @method _redraw","     * @private","     */","    _redraw: function()","    {","        var autoSize = this.get(\"autoSize\"),","            preserveAspectRatio = this.get(\"preserveAspectRatio\"),","            box = this.get(\"resizeDown\") ? this._getUpdatedContentBounds() : this._contentBounds,","            left = box.left,","            right = box.right,","            top = box.top,","            bottom = box.bottom,","            width = right - left,","            height = bottom - top,","            computedWidth,","            computedHeight,","            computedLeft,","            computedTop,","            node;","        if(autoSize)","        {","            if(autoSize == \"sizeContentToGraphic\")","            {","                node = Y.one(this._node);","                computedWidth = parseFloat(node.getComputedStyle(\"width\"));","                computedHeight = parseFloat(node.getComputedStyle(\"height\"));","                computedLeft = computedTop = 0;","                this._contentNode.setAttribute(\"preserveAspectRatio\", preserveAspectRatio);","            }","            else ","            {","                computedWidth = width;","                computedHeight = height;","                computedLeft = left;","                computedTop = top;","                this._state.width = width;","                this._state.height = height;","                if(this._node)","                {","                    this._node.style.width = width + \"px\";","                    this._node.style.height = height + \"px\";","                }","            }","        }","        else","        {","                computedWidth = width;","                computedHeight = height;","                computedLeft = left;","                computedTop = top;","        }","        if(this._contentNode)","        {","            this._contentNode.style.left = computedLeft + \"px\";","            this._contentNode.style.top = computedTop + \"px\";","            this._contentNode.setAttribute(\"width\", computedWidth);","            this._contentNode.setAttribute(\"height\", computedHeight);","            this._contentNode.style.width = computedWidth + \"px\";","            this._contentNode.style.height = computedHeight + \"px\";","            this._contentNode.setAttribute(\"viewBox\", \"\" + left + \" \" + top + \" \" + width + \" \" + height + \"\");","        }","        if(this._frag)","        {","            if(this._contentNode)","            {","                this._contentNode.appendChild(this._frag);","            }","            this._frag = null;","        } ","    },"," ","    /**","     * Adds a shape to the redraw queue and calculates the contentBounds. Used internally ","     * by `Shape` instances.","     *","     * @method addToRedrawQueue","     * @param shape {SVGShape}","     * @protected","     */","    addToRedrawQueue: function(shape)","    {","        var shapeBox,","            box;","        this._shapes[shape.get(\"id\")] = shape;","        if(!this.get(\"resizeDown\"))","        {","            shapeBox = shape.getBounds();","            box = this._contentBounds;","            box.left = box.left < shapeBox.left ? box.left : shapeBox.left;","            box.top = box.top < shapeBox.top ? box.top : shapeBox.top;","            box.right = box.right > shapeBox.right ? box.right : shapeBox.right;","            box.bottom = box.bottom > shapeBox.bottom ? box.bottom : shapeBox.bottom;","            box.width = box.right - box.left;","            box.height = box.bottom - box.top;","            this._contentBounds = box;","        }","        if(this.get(\"autoDraw\")) ","        {","            this._redraw();","        }","    },","","    /**","     * Recalculates and returns the `contentBounds` for the `Graphic` instance.","     *","     * @method _getUpdatedContentBounds","     * @return {Object} ","     * @private","     */","    _getUpdatedContentBounds: function()","    {","        var bounds,","            i,","            shape,","            queue = this._shapes,","            box = {};","        for(i in queue)","        {","            if(queue.hasOwnProperty(i))","            {","                shape = queue[i];","                bounds = shape.getBounds();","                box.left = Y_LANG.isNumber(box.left) ? Math.min(box.left, bounds.left) : bounds.left;","                box.top = Y_LANG.isNumber(box.top) ? Math.min(box.top, bounds.top) : bounds.top;","                box.right = Y_LANG.isNumber(box.right) ? Math.max(box.right, bounds.right) : bounds.right;","                box.bottom = Y_LANG.isNumber(box.bottom) ? Math.max(box.bottom, bounds.bottom) : bounds.bottom;","            }","        }","        box.left = Y_LANG.isNumber(box.left) ? box.left : 0;","        box.top = Y_LANG.isNumber(box.top) ? box.top : 0;","        box.right = Y_LANG.isNumber(box.right) ? box.right : 0;","        box.bottom = Y_LANG.isNumber(box.bottom) ? box.bottom : 0;","        this._contentBounds = box;","        return box;","    },","","    /**","     * Creates a contentNode element","     *","     * @method _createGraphics","     * @private","     */","    _createGraphics: function() {","        var contentNode = this._createGraphicNode(\"svg\"),","            pointerEvents = this.get(\"pointerEvents\");","        contentNode.style.position = \"absolute\";","        contentNode.style.top = \"0px\";","        contentNode.style.left = \"0px\";","        contentNode.style.overflow = \"auto\";","        contentNode.setAttribute(\"overflow\", \"auto\");","        contentNode.setAttribute(\"pointer-events\", pointerEvents);","        return contentNode;","    },","","    /**","     * Creates a graphic node","     *","     * @method _createGraphicNode","     * @param {String} type node type to create","     * @param {String} pe specified pointer-events value","     * @return HTMLElement","     * @private","     */","    _createGraphicNode: function(type, pe)","    {","        var node = DOCUMENT.createElementNS(\"http://www.w3.org/2000/svg\", \"svg:\" + type),","            v = pe || \"none\";","        if(type !== \"defs\" && type !== \"stop\" && type !== \"linearGradient\" && type != \"radialGradient\")","        {","            node.setAttribute(\"pointer-events\", v);","        }","        return node;","    },","","    /**","     * Returns a reference to a gradient definition based on an id and type.","     *","     * @method getGradientNode","     * @param {String} key id that references the gradient definition","     * @param {String} type description of the gradient type","     * @return HTMLElement","     * @protected","     */","    getGradientNode: function(key, type)","    {","        var gradients = this._gradients,","            gradient,","            nodeType = type + \"Gradient\";","        if(gradients.hasOwnProperty(key) && gradients[key].tagName.indexOf(type) > -1)","        {","            gradient = this._gradients[key];","        }","        else","        {","            gradient = this._createGraphicNode(nodeType);","            if(!this._defs)","            {","                this._defs = this._createGraphicNode(\"defs\");","                this._contentNode.appendChild(this._defs);","            }","            this._defs.appendChild(gradient);","            key = key || \"gradient\" + Math.round(100000 * Math.random());","            gradient.setAttribute(\"id\", key);","            if(gradients.hasOwnProperty(key))","            {","                this._defs.removeChild(gradients[key]);","            }","            gradients[key] = gradient;","        }","        return gradient;","    },","","    /**","     * Inserts shape on the top of the tree.","     *","     * @method _toFront","     * @param {SVGShape} Shape to add.","     * @private","     */","    _toFront: function(shape)","    {","        var contentNode = this._contentNode;","        if(shape instanceof Y.SVGShape)","        {","            shape = shape.get(\"node\");","        }","        if(contentNode && shape)","        {","            contentNode.appendChild(shape);","        }","    },","","    /**","     * Inserts shape as the first child of the content node.","     *","     * @method _toBack","     * @param {SVGShape} Shape to add.","     * @private","     */","    _toBack: function(shape)","    {","        var contentNode = this._contentNode,","            targetNode;","        if(shape instanceof Y.SVGShape)","        {","            shape = shape.get(\"node\");","        }","        if(contentNode && shape)","        {","            targetNode = contentNode.firstChild;","            if(targetNode)","            {","                contentNode.insertBefore(shape, targetNode);","            }","            else","            {","                contentNode.appendChild(shape);","            }","        }","    }","});","","Y.SVGGraphic = SVGGraphic;","","","","}, '@VERSION@', {\"requires\": [\"graphics\"]});"];
_yuitest_coverage["build/graphics-svg/graphics-svg.js"].lines = {"1":0,"3":0,"18":0,"30":0,"95":0,"96":0,"111":0,"126":0,"138":0,"152":0,"153":0,"155":0,"156":0,"157":0,"161":0,"162":0,"164":0,"165":0,"168":0,"169":0,"170":0,"171":0,"173":0,"174":0,"175":0,"176":0,"177":0,"178":0,"179":0,"180":0,"181":0,"182":0,"183":0,"184":0,"185":0,"186":0,"187":0,"188":0,"202":0,"211":0,"213":0,"214":0,"215":0,"219":0,"220":0,"222":0,"223":0,"226":0,"227":0,"228":0,"229":0,"230":0,"231":0,"232":0,"233":0,"234":0,"235":0,"236":0,"237":0,"250":0,"251":0,"252":0,"253":0,"254":0,"269":0,"270":0,"271":0,"272":0,"273":0,"274":0,"275":0,"276":0,"277":0,"290":0,"291":0,"292":0,"293":0,"294":0,"295":0,"296":0,"297":0,"298":0,"299":0,"300":0,"314":0,"316":0,"317":0,"318":0,"319":0,"320":0,"321":0,"322":0,"323":0,"324":0,"325":0,"340":0,"342":0,"343":0,"344":0,"345":0,"346":0,"347":0,"364":0,"379":0,"380":0,"382":0,"383":0,"384":0,"388":0,"390":0,"391":0,"392":0,"395":0,"397":0,"402":0,"405":0,"409":0,"412":0,"413":0,"416":0,"417":0,"418":0,"419":0,"420":0,"421":0,"422":0,"423":0,"424":0,"425":0,"426":0,"428":0,"429":0,"430":0,"431":0,"432":0,"433":0,"434":0,"435":0,"436":0,"437":0,"440":0,"441":0,"442":0,"443":0,"454":0,"461":0,"462":0,"463":0,"464":0,"466":0,"467":0,"468":0,"472":0,"474":0,"475":0,"476":0,"477":0,"478":0,"479":0,"480":0,"481":0,"482":0,"483":0,"488":0,"489":0,"490":0,"491":0,"492":0,"493":0,"506":0,"508":0,"509":0,"510":0,"511":0,"512":0,"513":0,"514":0,"515":0,"516":0,"526":0,"527":0,"537":0,"538":0,"539":0,"540":0,"541":0,"542":0,"543":0,"544":0,"545":0,"546":0,"557":0,"569":0,"571":0,"572":0,"574":0,"575":0,"576":0,"577":0,"579":0,"581":0,"583":0,"587":0,"589":0,"595":0,"597":0,"598":0,"599":0,"601":0,"603":0,"604":0,"605":0,"606":0,"607":0,"610":0,"612":0,"613":0,"614":0,"615":0,"617":0,"620":0,"622":0,"624":0,"625":0,"627":0,"630":0,"631":0,"632":0,"633":0,"644":0,"656":0,"657":0,"659":0,"660":0,"662":0,"675":0,"680":0,"681":0,"684":0,"685":0,"686":0,"687":0,"690":0,"704":0,"712":0,"714":0,"715":0,"716":0,"717":0,"718":0,"720":0,"721":0,"722":0,"723":0,"724":0,"725":0,"737":0,"738":0,"740":0,"742":0,"744":0,"746":0,"748":0,"750":0,"752":0,"753":0,"756":0,"768":0,"770":0,"771":0,"772":0,"773":0,"776":0,"778":0,"804":0,"815":0,"818":0,"819":0,"821":0,"823":0,"825":0,"827":0,"840":0,"841":0,"843":0,"847":0,"848":0,"851":0,"852":0,"864":0,"865":0,"876":0,"878":0,"879":0,"890":0,"894":0,"905":0,"907":0,"908":0,"909":0,"921":0,"932":0,"934":0,"946":0,"957":0,"977":0,"994":0,"997":0,"998":0,"999":0,"1001":0,"1003":0,"1005":0,"1007":0,"1009":0,"1025":0,"1027":0,"1029":0,"1040":0,"1046":0,"1048":0,"1049":0,"1050":0,"1051":0,"1052":0,"1053":0,"1054":0,"1055":0,"1056":0,"1057":0,"1058":0,"1059":0,"1060":0,"1061":0,"1063":0,"1067":0,"1068":0,"1070":0,"1071":0,"1077":0,"1089":0,"1093":0,"1095":0,"1096":0,"1098":0,"1099":0,"1101":0,"1103":0,"1107":0,"1108":0,"1109":0,"1110":0,"1115":0,"1127":0,"1156":0,"1158":0,"1159":0,"1160":0,"1162":0,"1164":0,"1165":0,"1169":0,"1170":0,"1172":0,"1173":0,"1177":0,"1179":0,"1180":0,"1184":0,"1185":0,"1187":0,"1188":0,"1191":0,"1192":0,"1193":0,"1194":0,"1197":0,"1198":0,"1199":0,"1200":0,"1202":0,"1203":0,"1204":0,"1205":0,"1206":0,"1207":0,"1208":0,"1212":0,"1213":0,"1214":0,"1215":0,"1216":0,"1219":0,"1220":0,"1221":0,"1223":0,"1225":0,"1226":0,"1230":0,"1231":0,"1233":0,"1234":0,"1235":0,"1236":0,"1237":0,"1238":0,"1239":0,"1240":0,"1241":0,"1242":0,"1243":0,"1244":0,"1246":0,"1248":0,"1250":0,"1252":0,"1254":0,"1270":0,"1271":0,"1272":0,"1274":0,"1287":0,"1299":0,"1311":0,"1323":0,"1334":0,"1345":0,"1356":0,"1367":0,"1380":0,"1381":0,"1382":0,"1383":0,"1384":0,"1386":0,"1398":0,"1412":0,"1414":0,"1415":0,"1416":0,"1417":0,"1418":0,"1420":0,"1423":0,"1425":0,"1426":0,"1428":0,"1430":0,"1431":0,"1433":0,"1434":0,"1436":0,"1437":0,"1439":0,"1441":0,"1444":0,"1445":0,"1452":0,"1453":0,"1455":0,"1457":0,"1459":0,"1471":0,"1472":0,"1473":0,"1474":0,"1475":0,"1476":0,"1477":0,"1478":0,"1479":0,"1480":0,"1491":0,"1514":0,"1521":0,"1523":0,"1525":0,"1527":0,"1528":0,"1529":0,"1530":0,"1532":0,"1542":0,"1543":0,"1545":0,"1556":0,"1557":0,"1559":0,"1572":0,"1580":0,"1582":0,"1583":0,"1584":0,"1586":0,"1587":0,"1589":0,"1590":0,"1592":0,"1595":0,"1606":0,"1607":0,"1609":0,"1613":0,"1625":0,"1627":0,"1628":0,"1630":0,"1632":0,"1637":0,"1648":0,"1684":0,"1685":0,"1686":0,"1687":0,"1688":0,"1693":0,"1706":0,"1711":0,"1712":0,"1714":0,"1716":0,"1729":0,"1734":0,"1735":0,"1736":0,"1738":0,"1752":0,"1757":0,"1758":0,"1759":0,"1761":0,"1796":0,"1797":0,"1799":0,"1801":0,"1851":0,"1853":0,"1854":0,"1856":0,"1858":0,"1861":0,"1898":0,"1900":0,"1902":0,"1903":0,"1905":0,"1908":0,"1921":0,"1923":0,"1925":0,"1927":0,"1932":0,"1933":0,"1935":0,"1937":0,"1953":0,"1966":0,"1968":0,"1970":0,"1986":0,"1990":0,"2003":0,"2005":0,"2007":0,"2008":0,"2065":0,"2078":0,"2091":0,"2092":0,"2105":0,"2109":0,"2120":0,"2122":0,"2124":0,"2125":0,"2135":0,"2136":0,"2147":0,"2149":0,"2152":0,"2154":0,"2172":0,"2181":0,"2182":0,"2183":0,"2184":0,"2185":0,"2186":0,"2187":0,"2191":0,"2201":0,"2206":0,"2207":0,"2209":0,"2211":0,"2225":0,"2230":0,"2231":0,"2233":0,"2235":0,"2239":0,"2250":0,"2252":0,"2255":0,"2257":0,"2276":0,"2282":0,"2283":0,"2284":0,"2285":0,"2286":0,"2287":0,"2291":0,"2301":0,"2302":0,"2307":0,"2320":0,"2321":0,"2326":0,"2340":0,"2348":0,"2350":0,"2352":0,"2353":0,"2371":0,"2376":0,"2377":0,"2378":0,"2381":0,"2419":0,"2430":0,"2431":0,"2434":0,"2436":0,"2454":0,"2459":0,"2460":0,"2462":0,"2464":0,"2480":0,"2496":0,"2512":0,"2525":0,"2527":0,"2529":0,"2542":0,"2544":0,"2546":0,"2616":0,"2621":0,"2622":0,"2624":0,"2626":0,"2639":0,"2644":0,"2645":0,"2647":0,"2649":0,"2671":0,"2672":0,"2687":0,"2699":0,"2708":0,"2709":0,"2711":0,"2713":0,"2715":0,"2717":0,"2719":0,"2721":0,"2722":0,"2727":0,"2729":0,"2759":0,"2761":0,"2763":0,"2765":0,"2775":0,"2777":0,"2778":0,"2784":0,"2785":0,"2786":0,"2787":0,"2788":0,"2789":0,"2790":0,"2791":0,"2792":0,"2793":0,"2794":0,"2796":0,"2807":0,"2810":0,"2811":0,"2812":0,"2813":0,"2814":0,"2815":0,"2825":0,"2826":0,"2828":0,"2829":0,"2831":0,"2833":0,"2835":0,"2837":0,"2838":0,"2839":0,"2852":0,"2853":0,"2855":0,"2857":0,"2859":0,"2860":0,"2872":0,"2874":0,"2876":0,"2880":0,"2892":0,"2894":0,"2896":0,"2899":0,"2901":0,"2902":0,"2904":0,"2906":0,"2908":0,"2918":0,"2920":0,"2922":0,"2924":0,"2927":0,"2939":0,"2941":0,"2942":0,"2944":0,"2945":0,"2946":0,"2957":0,"2969":0,"2972":0,"2974":0,"2976":0,"2978":0,"2982":0,"2984":0,"2986":0,"2988":0,"3002":0,"3003":0,"3005":0,"3007":0,"3034":0,"3035":0,"3046":0,"3047":0,"3048":0,"3049":0,"3050":0,"3062":0,"3064":0,"3066":0,"3077":0,"3091":0,"3093":0,"3095":0,"3096":0,"3097":0,"3098":0,"3099":0,"3103":0,"3104":0,"3105":0,"3106":0,"3107":0,"3108":0,"3109":0,"3111":0,"3112":0,"3118":0,"3119":0,"3120":0,"3121":0,"3123":0,"3125":0,"3126":0,"3127":0,"3128":0,"3129":0,"3130":0,"3131":0,"3133":0,"3135":0,"3137":0,"3139":0,"3153":0,"3155":0,"3156":0,"3158":0,"3159":0,"3160":0,"3161":0,"3162":0,"3163":0,"3164":0,"3165":0,"3166":0,"3168":0,"3170":0,"3183":0,"3188":0,"3190":0,"3192":0,"3193":0,"3194":0,"3195":0,"3196":0,"3197":0,"3200":0,"3201":0,"3202":0,"3203":0,"3204":0,"3205":0,"3215":0,"3217":0,"3218":0,"3219":0,"3220":0,"3221":0,"3222":0,"3223":0,"3237":0,"3239":0,"3241":0,"3243":0,"3257":0,"3260":0,"3262":0,"3266":0,"3267":0,"3269":0,"3270":0,"3272":0,"3273":0,"3274":0,"3275":0,"3277":0,"3279":0,"3281":0,"3293":0,"3294":0,"3296":0,"3298":0,"3300":0,"3313":0,"3315":0,"3317":0,"3319":0,"3321":0,"3322":0,"3324":0,"3328":0,"3334":0};
_yuitest_coverage["build/graphics-svg/graphics-svg.js"].functions = {"SVGDrawing:18":0,"_round:93":0,"curveTo:110":0,"relativeCurveTo:125":0,"_curveTo:137":0,"quadraticCurveTo:201":0,"drawRect:249":0,"drawRoundRect:268":0,"drawCircle:289":0,"drawEllipse:313":0,"drawDiamond:338":0,"drawWedge:362":0,"lineTo:453":0,"moveTo:505":0,"end:524":0,"clear:535":0,"_closePath:555":0,"closePath:642":0,"_getCurrentArray:654":0,"getBezierData:674":0,"_setCurveBoundingBox:702":0,"_trackSize:736":0,"SVGShape:768":0,"init:802":0,"initializer:813":0,"_setGraphic:838":0,"addClass:862":0,"removeClass:874":0,"getXY:888":0,"setXY:903":0,"contains:919":0,"compareTo:931":0,"test:944":0,"_getDefaultFill:956":0,"_getDefaultStroke:975":0,"createNode:992":0,"on:1023":0,"_strokeChangeHandler:1038":0,"_fillChangeHandler:1087":0,"_setGradientFill:1126":0,"set:1268":0,"translate:1285":0,"translateX:1297":0,"translateY:1309":0,"skew:1321":0,"skewX:1332":0,"skewY:1343":0,"rotate:1354":0,"scale:1365":0,"_addTransform:1378":0,"_updateTransform:1396":0,"_draw:1469":0,"_updateHandler:1489":0,"getBounds:1512":0,"toFront:1540":0,"toBack:1554":0,"_parsePathData:1570":0,"destroy:1604":0,"_destroy:1623":0,"valueFn:1646":0,"setter:1682":0,"getter:1691":0,"valueFn:1704":0,"setter:1709":0,"getter:1727":0,"setter:1732":0,"getter:1750":0,"setter:1755":0,"setter:1795":0,"setter:1849":0,"setter:1896":0,"valueFn:1919":0,"setter:1930":0,"getter:1951":0,"setter:1964":0,"getter:1984":0,"SVGPath:2003":0,"getter:2076":0,"getter:2089":0,"getter:2103":0,"SVGRect:2120":0,"SVGEllipse:2147":0,"_draw:2170":0,"setter:2199":0,"getter:2204":0,"setter:2223":0,"getter:2228":0,"SVGCircle:2250":0,"_draw:2274":0,"setter:2299":0,"getter:2305":0,"setter:2318":0,"getter:2324":0,"SVGPieSlice:2348":0,"_draw:2369":0,"SVGGraphic:2430":0,"valueFn:2452":0,"setter:2457":0,"getter:2478":0,"getter:2494":0,"getter:2510":0,"setter:2523":0,"setter:2540":0,"getter:2614":0,"setter:2619":0,"getter:2637":0,"setter:2642":0,"setter:2669":0,"set:2697":0,"getXY:2757":0,"initializer:2774":0,"render:2806":0,"destroy:2823":0,"addShape:2850":0,"_appendShape:2870":0,"removeShape:2890":0,"removeAllShapes:2916":0,"_removeChildren:2937":0,"clear:2956":0,"_toggleVisible:2967":0,"_getShapeClass:3000":0,"getShapeById:3032":0,"batch:3044":0,"_getDocFrag:3060":0,"_redraw:3075":0,"addToRedrawQueue:3151":0,"_getUpdatedContentBounds:3181":0,"_createGraphics:3214":0,"_createGraphicNode:3235":0,"getGradientNode:3255":0,"_toFront:3291":0,"_toBack:3311":0,"(anonymous 1):1":0};
_yuitest_coverage["build/graphics-svg/graphics-svg.js"].coveredLines = 865;
_yuitest_coverage["build/graphics-svg/graphics-svg.js"].coveredFunctions = 133;
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1);
YUI.add('graphics-svg', function (Y, NAME) {

_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "(anonymous 1)", 1);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3);
var SHAPE = "svgShape",
	SPLITPATHPATTERN = /[a-z][^a-z]*/ig,
    SPLITARGSPATTERN = /[-]?[0-9]*[0-9|\.][0-9]*/g,
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

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 18);
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
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 30);
SVGDrawing.prototype = {
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_round", 93);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 95);
val = Math.round(val * 100)/100;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 96);
return val;
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "curveTo", 110);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 111);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "relativeCurveTo", 125);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 126);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_curveTo", 137);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 138);
var w,
            h,
            pts,
            right,
            left,
            bottom,
            top,
            i = 0,
            len,
            pathArrayLen,
            currentArray,
            command = relative ? "c" : "C",
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 152);
this._pathArray = this._pathArray || [];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 153);
if(this._pathType !== command)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 155);
this._pathType = command;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 156);
currentArray = [command];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 157);
this._pathArray.push(currentArray);
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 161);
currentArray = this._pathArray[Math.max(0, this._pathArray.length - 1)];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 162);
if(!currentArray)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 164);
currentArray = [];
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 165);
this._pathArray.push(currentArray);
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 168);
pathArrayLen = this._pathArray.length - 1;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 169);
this._pathArray[pathArrayLen] = this._pathArray[pathArrayLen].concat(args);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 170);
len = args.length - 5;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 171);
for(; i < len; i = i + 6)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 173);
cp1x = args[i] + relative;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 174);
cp1y = args[i + 1] + relative;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 175);
cp2x = args[i + 2] + relative;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 176);
cp2y = args[i + 3] + relative;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 177);
x = parseFloat(args[i + 4]) + relativeX;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 178);
y = parseFloat(args[i + 5]) + relativeY;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 179);
right = Math.max(x, Math.max(cp1x, cp2x));
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 180);
bottom = Math.max(y, Math.max(cp1y, cp2y));
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 181);
left = Math.min(x, Math.min(cp1x, cp2x));
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 182);
top = Math.min(y, Math.min(cp1y, cp2y));
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 183);
w = Math.abs(right - left);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 184);
h = Math.abs(bottom - top);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 185);
pts = [[this._currentX, this._currentY] , [cp1x, cp1y], [cp2x, cp2y], [x, y]]; 
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 186);
this._setCurveBoundingBox(pts, w, h);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 187);
this._currentX = x;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 188);
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
    quadraticCurveTo: function(cpx, cpy, x, y) {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "quadraticCurveTo", 201);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 202);
var pathArrayLen,
            currentArray,
            w,
            h,
            pts,
            right,
            left,
            bottom,
            top;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 211);
if(this._pathType !== "Q")
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 213);
this._pathType = "Q";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 214);
currentArray = ["Q"];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 215);
this._pathArray.push(currentArray);
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 219);
currentArray = this._pathArray[Math.max(0, this._pathArray.length - 1)];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 220);
if(!currentArray)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 222);
currentArray = [];
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 223);
this._pathArray.push(currentArray);
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 226);
pathArrayLen = this._pathArray.length - 1;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 227);
this._pathArray[pathArrayLen] = this._pathArray[pathArrayLen].concat([Math.round(cpx), Math.round(cpy), Math.round(x), Math.round(y)]);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 228);
right = Math.max(x, cpx);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 229);
bottom = Math.max(y, cpy);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 230);
left = Math.min(x, cpx);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 231);
top = Math.min(y, cpy);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 232);
w = Math.abs(right - left);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 233);
h = Math.abs(bottom - top);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 234);
pts = [[this._currentX, this._currentY] , [cpx, cpy], [x, y]]; 
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 235);
this._setCurveBoundingBox(pts, w, h);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 236);
this._currentX = x;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 237);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "drawRect", 249);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 250);
this.moveTo(x, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 251);
this.lineTo(x + w, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 252);
this.lineTo(x + w, y + h);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 253);
this.lineTo(x, y + h);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 254);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "drawRoundRect", 268);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 269);
this.moveTo(x, y + eh);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 270);
this.lineTo(x, y + h - eh);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 271);
this.quadraticCurveTo(x, y + h, x + ew, y + h);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 272);
this.lineTo(x + w - ew, y + h);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 273);
this.quadraticCurveTo(x + w, y + h, x + w, y + h - eh);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 274);
this.lineTo(x + w, y + eh);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 275);
this.quadraticCurveTo(x + w, y, x + w - ew, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 276);
this.lineTo(x + ew, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 277);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "drawCircle", 289);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 290);
var circum = radius * 2;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 291);
this._drawingComplete = false;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 292);
this._trackSize(x, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 293);
this._trackSize(x + circum, y + circum);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 294);
this._pathArray = this._pathArray || [];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 295);
this._pathArray.push(["M", x + radius, y]);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 296);
this._pathArray.push(["A",  radius, radius, 0, 1, 0, x + radius, y + circum]);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 297);
this._pathArray.push(["A",  radius, radius, 0, 1, 0, x + radius, y]);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 298);
this._currentX = x;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 299);
this._currentY = y;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 300);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "drawEllipse", 313);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 314);
var radius = w * 0.5,
            yRadius = h * 0.5;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 316);
this._drawingComplete = false;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 317);
this._trackSize(x, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 318);
this._trackSize(x + w, y + h);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 319);
this._pathArray = this._pathArray || [];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 320);
this._pathArray.push(["M", x + radius, y]);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 321);
this._pathArray.push(["A",  radius, yRadius, 0, 1, 0, x + radius, y + h]);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 322);
this._pathArray.push(["A",  radius, yRadius, 0, 1, 0, x + radius, y]);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 323);
this._currentX = x;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 324);
this._currentY = y;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 325);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "drawDiamond", 338);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 340);
var midWidth = width * 0.5,
            midHeight = height * 0.5;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 342);
this.moveTo(x + midWidth, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 343);
this.lineTo(x + width, y + midHeight);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 344);
this.lineTo(x + midWidth, y + height);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 345);
this.lineTo(x, y + midHeight);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 346);
this.lineTo(x + midWidth, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 347);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "drawWedge", 362);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 364);
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
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 379);
yRadius = yRadius || radius;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 380);
if(this._pathType != "M")
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 382);
this._pathType = "M";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 383);
currentArray = ["M"];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 384);
this._pathArray.push(currentArray);
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 388);
currentArray = this._getCurrentArray(); 
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 390);
pathArrayLen = this._pathArray.length - 1;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 391);
this._pathArray[pathArrayLen].push(x); 
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 392);
this._pathArray[pathArrayLen].push(x); 
        
        // limit sweep to reasonable numbers
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 395);
if(Math.abs(arc) > 360)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 397);
arc = 360;
        }
        
        // First we calculate how many segments are needed
        // for a smooth arc.
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 402);
segs = Math.ceil(Math.abs(arc) / 45);
        
        // Now calculate the sweep of each segment.
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 405);
segAngle = arc / segs;
        
        // The math requires radians rather than degrees. To convert from degrees
        // use the formula (degrees/180)*Math.PI to get radians.
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 409);
theta = -(segAngle / 180) * Math.PI;
        
        // convert angle startAngle to radians
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 412);
angle = (startAngle / 180) * Math.PI;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 413);
if(segs > 0)
        {
            // draw a line from the center to the start of the curve
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 416);
ax = x + Math.cos(startAngle / 180 * Math.PI) * radius;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 417);
ay = y + Math.sin(startAngle / 180 * Math.PI) * yRadius;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 418);
this._pathType = "L";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 419);
pathArrayLen++;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 420);
this._pathArray[pathArrayLen] = ["L"];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 421);
this._pathArray[pathArrayLen].push(Math.round(ax));
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 422);
this._pathArray[pathArrayLen].push(Math.round(ay));
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 423);
pathArrayLen++; 
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 424);
this._pathType = "Q";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 425);
this._pathArray[pathArrayLen] = ["Q"];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 426);
for(; i < segs; ++i)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 428);
angle += theta;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 429);
angleMid = angle - (theta / 2);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 430);
bx = x + Math.cos(angle) * radius;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 431);
by = y + Math.sin(angle) * yRadius;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 432);
cx = x + Math.cos(angleMid) * (radius / Math.cos(theta / 2));
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 433);
cy = y + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 434);
this._pathArray[pathArrayLen].push(Math.round(cx));
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 435);
this._pathArray[pathArrayLen].push(Math.round(cy));
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 436);
this._pathArray[pathArrayLen].push(Math.round(bx));
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 437);
this._pathArray[pathArrayLen].push(Math.round(by));
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 440);
this._currentX = x;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 441);
this._currentY = y;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 442);
this._trackSize(diameter, diameter); 
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 443);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "lineTo", 453);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 454);
var args = arguments,
            i,
            len,
            pathArrayLen,
            currentArray,
            x,
            y;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 461);
this._pathArray = this._pathArray || [];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 462);
this._shapeType = "path";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 463);
len = args.length;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 464);
if(this._pathType !== "L")
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 466);
this._pathType = "L";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 467);
currentArray = ['L'];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 468);
this._pathArray.push(currentArray);
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 472);
currentArray = this._getCurrentArray();
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 474);
pathArrayLen = this._pathArray.length - 1;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 475);
if (typeof point1 === 'string' || typeof point1 === 'number') {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 476);
for (i = 0; i < len; i = i + 2) {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 477);
x = args[i];
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 478);
y = args[i + 1];
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 479);
this._pathArray[pathArrayLen].push(x);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 480);
this._pathArray[pathArrayLen].push(y);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 481);
this._currentX = x;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 482);
this._currentY = y;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 483);
this._trackSize.apply(this, [x, y]);
            }
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 488);
for (i = 0; i < len; ++i) {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 489);
this._pathArray[pathArrayLen].push(args[i][0]);
               _yuitest_coverline("build/graphics-svg/graphics-svg.js", 490);
this._pathArray[pathArrayLen].push(args[i][1]);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 491);
this._currentX = args[i][0];
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 492);
this._currentY = args[i][1];
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 493);
this._trackSize.apply(this, args[i]);
            }
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "moveTo", 505);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 506);
var pathArrayLen,
            currentArray;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 508);
this._pathArray = this._pathArray || [];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 509);
this._pathType = "M";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 510);
currentArray = ["M"];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 511);
this._pathArray.push(currentArray);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 512);
pathArrayLen = this._pathArray.length - 1;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 513);
this._pathArray[pathArrayLen] = this._pathArray[pathArrayLen].concat([this._round(x), this._round(y)]);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 514);
this._currentX = x;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 515);
this._currentY = y;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 516);
this._trackSize(x, y);
    },
 
    /**
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "end", 524);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 526);
this._closePath();
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 527);
this._graphic.addToRedrawQueue(this);    
    },

    /**
     * Clears the path.
     *
     * @method clear
     */
    clear: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "clear", 535);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 537);
this._currentX = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 538);
this._currentY = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 539);
this._width = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 540);
this._height = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 541);
this._left = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 542);
this._right = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 543);
this._top = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 544);
this._bottom = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 545);
this._pathArray = [];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 546);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_closePath", 555);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 557);
var pathArray,
            segmentArray,
            pathType,
            len,
            val,
            val2,
            i,
            path = "",
            node = this.node,
            left = this._round(this._left),
            top = this._round(this._top),
            fill = this.get("fill");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 569);
if(this._pathArray)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 571);
pathArray = this._pathArray.concat();
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 572);
while(pathArray && pathArray.length > 0)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 574);
segmentArray = pathArray.shift();
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 575);
len = segmentArray.length;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 576);
pathType = segmentArray[0];
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 577);
if(pathType === "A" || pathType == "c" || pathType == "C")
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 579);
path += pathType + segmentArray[1] + "," + segmentArray[2];
                }
                else {_yuitest_coverline("build/graphics-svg/graphics-svg.js", 581);
if(pathType != "z")
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 583);
path += " " + pathType + this._round(segmentArray[1] - left);
                }
                else
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 587);
path += " z ";
                }}
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 589);
switch(pathType)
                {
                    case "L" :
                    case "M" :
                    case "Q" :
                    case "l" :
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 595);
for(i = 2; i < len; ++i)
                        {
                            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 597);
val = (i % 2 === 0) ? top : left;
                            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 598);
val = segmentArray[i] - val;
                            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 599);
path += ", " + this._round(val);
                        }
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 601);
break;
                    case "A" :
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 603);
val = " " + this._round(segmentArray[3]) + " " + this._round(segmentArray[4]);
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 604);
val += "," + this._round(segmentArray[5]) + " " + this._round(segmentArray[6] - left);
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 605);
val += "," + this._round(segmentArray[7] - top);
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 606);
path += " " + val;
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 607);
break;
                    case "C" :
                    case "c" :
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 610);
for(i = 3; i < len - 1; i = i + 2)
                        {
                            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 612);
val = this._round(segmentArray[i] - left);
                            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 613);
val = val + ", ";
                            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 614);
val = val + this._round(segmentArray[i + 1] - top);
                            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 615);
path += " " + val;
                        }
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 617);
break;
                }
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 620);
if(fill && fill.color)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 622);
path += 'z';
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 624);
Y.Lang.trim(path);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 625);
if(path)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 627);
node.setAttribute("d", path);
            }
            
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 630);
this._path = path;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 631);
this._fillChangeHandler();
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 632);
this._strokeChangeHandler();
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 633);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "closePath", 642);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 644);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_getCurrentArray", 654);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 656);
var currentArray = this._pathArray[Math.max(0, this._pathArray.length - 1)];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 657);
if(!currentArray)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 659);
currentArray = [];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 660);
this._pathArray.push(currentArray);
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 662);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getBezierData", 674);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 675);
var n = points.length,
            tmp = [],
            i,
            j;

        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 680);
for (i = 0; i < n; ++i){
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 681);
tmp[i] = [points[i][0], points[i][1]]; // save input
        }
        
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 684);
for (j = 1; j < n; ++j) {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 685);
for (i = 0; i < n - j; ++i) {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 686);
tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 687);
tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1]; 
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 690);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_setCurveBoundingBox", 702);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 704);
var i = 0,
            left = this._currentX,
            right = left,
            top = this._currentY,
            bottom = top,
            len = Math.round(Math.sqrt((w * w) + (h * h))),
            t = 1/len,
            xy;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 712);
for(; i < len; ++i)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 714);
xy = this.getBezierData(pts, t * i);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 715);
left = isNaN(left) ? xy[0] : Math.min(xy[0], left);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 716);
right = isNaN(right) ? xy[0] : Math.max(xy[0], right);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 717);
top = isNaN(top) ? xy[1] : Math.min(xy[1], top);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 718);
bottom = isNaN(bottom) ? xy[1] : Math.max(xy[1], bottom);
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 720);
left = Math.round(left * 10)/10;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 721);
right = Math.round(right * 10)/10;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 722);
top = Math.round(top * 10)/10;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 723);
bottom = Math.round(bottom * 10)/10;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 724);
this._trackSize(right, bottom);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 725);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_trackSize", 736);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 737);
if (w > this._right) {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 738);
this._right = w;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 740);
if(w < this._left)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 742);
this._left = w;    
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 744);
if (h < this._top)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 746);
this._top = h;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 748);
if (h > this._bottom) 
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 750);
this._bottom = h;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 752);
this._width = this._right - this._left;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 753);
this._height = this._bottom - this._top;
    }
};
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 756);
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
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 768);
SVGShape = function(cfg)
{
    _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "SVGShape", 768);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 770);
this._transforms = [];
    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 771);
this.matrix = new Y.Matrix();
    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 772);
this._normalizedMatrix = new Y.Matrix();
    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 773);
SVGShape.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 776);
SVGShape.NAME = "svgShape";

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 778);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "init", 802);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 804);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "initializer", 813);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 815);
var host = this,
            graphic = cfg.graphic,
            data = this.get("data");
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 818);
host.createNode(); 
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 819);
if(graphic)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 821);
host._setGraphic(graphic);
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 823);
if(data)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 825);
host._parsePathData(data);
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 827);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_setGraphic", 838);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 840);
var graphic;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 841);
if(render instanceof Y.SVGGraphic)
        {
		    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 843);
this._graphic = render;
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 847);
render = Y.one(render);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 848);
graphic = new Y.SVGGraphic({
                render: render
            });
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 851);
graphic._appendShape(this);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 852);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "addClass", 862);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 864);
var node = this.node;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 865);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "removeClass", 874);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 876);
var node = this.node,
			classString = node.className.baseVal;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 878);
classString = classString.replace(new RegExp(className + ' '), className).replace(new RegExp(className), '');
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 879);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getXY", 888);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 890);
var graphic = this._graphic,
			parentXY = graphic.getXY(),
			x = this._x,
			y = this._y;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 894);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setXY", 903);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 905);
var graphic = this._graphic,
			parentXY = graphic.getXY();
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 907);
this._x = xy[0] - parentXY[0];
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 908);
this._y = xy[1] - parentXY[1];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 909);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "contains", 919);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 921);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "compareTo", 931);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 932);
var node = this.node;

		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 934);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "test", 944);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 946);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_getDefaultFill", 956);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 957);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_getDefaultStroke", 975);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 977);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "createNode", 992);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 994);
var node = DOCUMENT.createElementNS("http://www.w3.org/2000/svg", "svg:" + this._type),
			id = this.get("id"),
			pointerEvents = this.get("pointerEvents");
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 997);
this.node = node;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 998);
this.addClass(_getClassName(SHAPE) + " " + _getClassName(this.name)); 
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 999);
if(id)
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1001);
node.setAttribute("id", id);
		}
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1003);
if(pointerEvents)
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1005);
node.setAttribute("pointer-events", pointerEvents);
		}
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1007);
if(!this.get("visible"))
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1009);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "on", 1023);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1025);
if(Y.Node.DOM_EVENTS[type])
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1027);
return Y.one("#" +  this.get("id")).on(type, fn);
		}
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1029);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_strokeChangeHandler", 1038);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1040);
var node = this.node,
			stroke = this.get("stroke"),
			strokeOpacity,
			dashstyle,
			dash,
			linejoin;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1046);
if(stroke && stroke.weight && stroke.weight > 0)
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1048);
linejoin = stroke.linejoin || "round";
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1049);
strokeOpacity = parseFloat(stroke.opacity);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1050);
dashstyle = stroke.dashstyle || "none";
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1051);
dash = Y_LANG.isArray(dashstyle) ? dashstyle.toString() : dashstyle;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1052);
stroke.color = stroke.color || "#000000";
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1053);
stroke.weight = stroke.weight || 1;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1054);
stroke.opacity = Y_LANG.isNumber(strokeOpacity) ? strokeOpacity : 1;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1055);
stroke.linecap = stroke.linecap || "butt";
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1056);
node.setAttribute("stroke-dasharray", dash);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1057);
node.setAttribute("stroke", stroke.color);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1058);
node.setAttribute("stroke-linecap", stroke.linecap);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1059);
node.setAttribute("stroke-width",  stroke.weight);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1060);
node.setAttribute("stroke-opacity", stroke.opacity);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1061);
if(linejoin == "round" || linejoin == "bevel")
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1063);
node.setAttribute("stroke-linejoin", linejoin);
			}
			else
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1067);
linejoin = parseInt(linejoin, 10);
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1068);
if(Y_LANG.isNumber(linejoin))
				{
					_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1070);
node.setAttribute("stroke-miterlimit",  Math.max(linejoin, 1));
					_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1071);
node.setAttribute("stroke-linejoin", "miter");
				}
			}
		}
		else
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1077);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_fillChangeHandler", 1087);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1089);
var node = this.node,
			fill = this.get("fill"),
			fillOpacity,
			type;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1093);
if(fill)
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1095);
type = fill.type;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1096);
if(type == "linear" || type == "radial")
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1098);
this._setGradientFill(fill);
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1099);
node.setAttribute("fill", "url(#grad" + this.get("id") + ")");
			}
			else {_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1101);
if(!fill.color)
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1103);
node.setAttribute("fill", "none");
			}
			else
			{
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1107);
fillOpacity = parseFloat(fill.opacity);
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1108);
fillOpacity = Y_LANG.isNumber(fillOpacity) ? fillOpacity : 1;
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1109);
node.setAttribute("fill", fill.color);
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1110);
node.setAttribute("fill-opacity", fillOpacity);
			}}
		}
		else
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1115);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_setGradientFill", 1126);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1127);
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
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1156);
if(type == "linear")
		{
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1158);
cx = w/2;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1159);
cy = h/2;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1160);
if(Math.abs(tanRadians) * w/2 >= h/2)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1162);
if(rotation < 180)
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1164);
y1 = 0;
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1165);
y2 = h;
                }
                else
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1169);
y1 = h;
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1170);
y2 = 0;
                }
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1172);
x1 = cx - ((cy - y1)/tanRadians);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1173);
x2 = cx - ((cy - y2)/tanRadians); 
            }
            else
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1177);
if(rotation > 90 && rotation < 270)
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1179);
x1 = w;
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1180);
x2 = 0;
                }
                else
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1184);
x1 = 0;
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1185);
x2 = w;
                }
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1187);
y1 = ((tanRadians * (cx - x1)) - cy) * -1;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1188);
y2 = ((tanRadians * (cx - x2)) - cy) * -1;
            }

            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1191);
x1 = Math.round(100 * x1/w);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1192);
x2 = Math.round(100 * x2/w);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1193);
y1 = Math.round(100 * y1/h);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1194);
y2 = Math.round(100 * y2/h);
            
            //Set default value if not valid 
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1197);
x1 = isNumber(x1) ? x1 : 0;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1198);
x2 = isNumber(x2) ? x2 : 100;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1199);
y1 = isNumber(y1) ? y1 : 0;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1200);
y2 = isNumber(y2) ? y2 : 0;
            
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1202);
gradientNode.setAttribute("spreadMethod", "pad");
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1203);
gradientNode.setAttribute("width", w);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1204);
gradientNode.setAttribute("height", h);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1205);
gradientNode.setAttribute("x1", x1 + "%");
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1206);
gradientNode.setAttribute("x2", x2 + "%");
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1207);
gradientNode.setAttribute("y1", y1 + "%");
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1208);
gradientNode.setAttribute("y2", y2 + "%");
		}
		else
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1212);
gradientNode.setAttribute("cx", (cx * 100) + "%");
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1213);
gradientNode.setAttribute("cy", (cy * 100) + "%");
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1214);
gradientNode.setAttribute("fx", (fx * 100) + "%");
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1215);
gradientNode.setAttribute("fy", (fy * 100) + "%");
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1216);
gradientNode.setAttribute("r", (r * 100) + "%");
		}
		
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1219);
len = stops.length;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1220);
def = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1221);
for(i = 0; i < len; ++i)
		{
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1223);
if(this._stops && this._stops.length > 0)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1225);
stopNode = this._stops.shift();
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1226);
newStop = false;
            }
            else
            {
			    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1230);
stopNode = graphic._createGraphicNode("stop");
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1231);
newStop = true;
            }
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1233);
stop = stops[i];
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1234);
opacity = stop.opacity;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1235);
color = stop.color;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1236);
offset = stop.offset || i/(len - 1);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1237);
offset = Math.round(offset * 100) + "%";
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1238);
opacity = isNumber(opacity) ? opacity : 1;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1239);
opacity = Math.max(0, Math.min(1, opacity));
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1240);
def = (i + 1) / len;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1241);
stopNode.setAttribute("offset", offset);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1242);
stopNode.setAttribute("stop-color", color);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1243);
stopNode.setAttribute("stop-opacity", opacity);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1244);
if(newStop)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1246);
gradientNode.appendChild(stopNode);
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1248);
stopNodes.push(stopNode);
		}
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1250);
while(this._stops && this._stops.length > 0)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1252);
gradientNode.removeChild(this._stops.shift());
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1254);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "set", 1268);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1270);
var host = this;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1271);
AttributeLite.prototype.set.apply(host, arguments);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1272);
if(host.initialized)
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1274);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "translate", 1285);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1287);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "translateX", 1297);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1299);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "translateY", 1309);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1311);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "skew", 1321);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1323);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "skewX", 1332);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1334);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "skewY", 1343);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1345);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "rotate", 1354);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1356);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "scale", 1365);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1367);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_addTransform", 1378);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1380);
args = Y.Array(args);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1381);
this._transform = Y_LANG.trim(this._transform + " " + type + "(" + args.join(", ") + ")");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1382);
args.unshift(type);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1383);
this._transforms.push(args);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1384);
if(this.initialized)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1386);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_updateTransform", 1396);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1398);
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

        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1412);
if(isPath || (this._transforms && this._transforms.length > 0))
		{
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1414);
x = this._x;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1415);
y = this._y;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1416);
transformOrigin = this.get("transformOrigin");
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1417);
tx = x + (transformOrigin[0] * this.get("width"));
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1418);
ty = y + (transformOrigin[1] * this.get("height")); 
            //need to use translate for x/y coords
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1420);
if(isPath)
            {
                //adjust origin for custom shapes 
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1423);
if(!(this instanceof Y.SVGPath))
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1425);
tx = this._left + (transformOrigin[0] * this.get("width"));
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1426);
ty = this._top + (transformOrigin[1] * this.get("height"));
                }
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1428);
normalizedMatrix.init({dx: x + this._left, dy: y + this._top});
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1430);
normalizedMatrix.translate(tx, ty);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1431);
for(; i < len; ++i)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1433);
key = this._transforms[i].shift();
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1434);
if(key)
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1436);
normalizedMatrix[key].apply(normalizedMatrix, this._transforms[i]);
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1437);
matrix[key].apply(matrix, this._transforms[i]); 
                }
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1439);
if(isPath)
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1441);
this._transforms[i].unshift(key);
                }
			}
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1444);
normalizedMatrix.translate(-tx, -ty);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1445);
transform = "matrix(" + normalizedMatrix.a + "," + 
                            normalizedMatrix.b + "," + 
                            normalizedMatrix.c + "," + 
                            normalizedMatrix.d + "," + 
                            normalizedMatrix.dx + "," +
                            normalizedMatrix.dy + ")";
		}
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1452);
this._graphic.addToRedrawQueue(this);    
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1453);
if(transform)
		{
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1455);
node.setAttribute("transform", transform);
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1457);
if(!isPath)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1459);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_draw", 1469);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1471);
var node = this.node;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1472);
node.setAttribute("width", this.get("width"));
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1473);
node.setAttribute("height", this.get("height"));
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1474);
node.setAttribute("x", this._x);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1475);
node.setAttribute("y", this._y);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1476);
node.style.left = this._x + "px";
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1477);
node.style.top = this._y + "px";
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1478);
this._fillChangeHandler();
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1479);
this._strokeChangeHandler();
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1480);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_updateHandler", 1489);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1491);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getBounds", 1512);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1514);
var type = this._type,
			stroke = this.get("stroke"),
            w = this.get("width"),
			h = this.get("height"),
			x = type == "path" ? 0 : this._x,
			y = type == "path" ? 0 : this._y,
            wt = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1521);
if(type != "path")
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1523);
if(stroke && stroke.weight)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1525);
wt = stroke.weight;
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1527);
w = (x + w + wt) - (x - wt); 
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1528);
h = (y + h + wt) - (y - wt);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1529);
x -= wt;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1530);
y -= wt;
        }
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1532);
return this._normalizedMatrix.getContentRect(w, h, x, y);
	},

    /**
     * Places the shape above all other shapes.
     *
     * @method toFront
     */
    toFront: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "toFront", 1540);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1542);
var graphic = this.get("graphic");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1543);
if(graphic)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1545);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "toBack", 1554);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1556);
var graphic = this.get("graphic");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1557);
if(graphic)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1559);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_parsePathData", 1570);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1572);
var method,
            methodSymbol,
            args,
            commandArray = Y.Lang.trim(val.match(SPLITPATHPATTERN)),
            i = 0,
            len, 
            str,
            symbolToMethod = this._pathSymbolToMethod;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1580);
if(commandArray)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1582);
this.clear();
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1583);
len = commandArray.length || 0;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1584);
for(; i < len; i = i + 1)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1586);
str = commandArray[i];
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1587);
methodSymbol = str.substr(0, 1),
                args = str.substr(1).match(SPLITARGSPATTERN);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1589);
method = symbolToMethod[methodSymbol];
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1590);
if(method)
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1592);
this[method].apply(this, args);
                }
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1595);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "destroy", 1604);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1606);
var graphic = this.get("graphic");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1607);
if(graphic)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1609);
graphic.removeShape(this);
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1613);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_destroy", 1623);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1625);
if(this.node)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1627);
Y.Event.purgeElement(this.node, true);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1628);
if(this.node.parentNode)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1630);
this.node.parentNode.removeChild(this.node);
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1632);
this.node = null;
        }
    }
 }, Y.SVGDrawing.prototype));
	
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1637);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "valueFn", 1646);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1648);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 1682);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1684);
this.matrix.init();	
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1685);
this._normalizedMatrix.init();
		    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1686);
this._transforms = this.matrix.getTransformArray(val);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1687);
this._transform = val;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1688);
return val;
		},

        getter: function()
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 1691);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1693);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "valueFn", 1704);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1706);
return Y.guid();
		},

		setter: function(val)
		{
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 1709);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1711);
var node = this.node;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1712);
if(node)
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1714);
node.setAttribute("id", val);
			}
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1716);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 1727);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1729);
return this._x;
        },

        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 1732);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1734);
var transform = this.get("transform");
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1735);
this._x = val;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1736);
if(transform) 
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1738);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 1750);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1752);
return this._y;
        },

        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 1755);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1757);
var transform = this.get("transform");
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1758);
this._y = val;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1759);
if(transform) 
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1761);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 1795);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1796);
var visibility = val ? "visible" : "hidden";
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1797);
if(this.node)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1799);
this.node.style.visibility = visibility;
            }
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1801);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 1849);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1851);
var fill,
				tmpl = this.get("fill") || this._getDefaultFill();
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1853);
fill = (val) ? Y.merge(tmpl, val) : null;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1854);
if(fill && fill.color)
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1856);
if(fill.color === undefined || fill.color == "none")
				{
					_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1858);
fill.color = null;
				}
			}
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1861);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 1896);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1898);
var tmpl = this.get("stroke") || this._getDefaultStroke(),
                wt;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1900);
if(val && val.hasOwnProperty("weight"))
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1902);
wt = parseInt(val.weight, 10);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1903);
if(!isNaN(wt))
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1905);
val.weight = wt;
                }
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1908);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "valueFn", 1919);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1921);
var val = "visiblePainted",
				node = this.node;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1923);
if(node)
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1925);
node.setAttribute("pointer-events", val);
			}
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1927);
return val;
		},

		setter: function(val)
		{
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 1930);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1932);
var node = this.node;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1933);
if(node)
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1935);
node.setAttribute("pointer-events", val);
			}
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1937);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 1951);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1953);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 1964);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1966);
if(this.get("node"))
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1968);
this._parsePathData(val);
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1970);
return val;
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 1984);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1986);
return this._graphic;
		}
	}
};
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1990);
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
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2003);
SVGPath = function(cfg)
{
	_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "SVGPath", 2003);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2005);
SVGPath.superclass.constructor.apply(this, arguments);
};
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2007);
SVGPath.NAME = "svgPath";
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2008);
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

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2065);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2076);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2078);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2089);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2091);
var val = Math.max(this._right - this._left, 0);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2092);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2103);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2105);
return Math.max(this._bottom - this._top, 0);
		}
	}
});
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2109);
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
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2120);
SVGRect = function()
{
	_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "SVGRect", 2120);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2122);
SVGRect.superclass.constructor.apply(this, arguments);
};
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2124);
SVGRect.NAME = "svgRect";
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2125);
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
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2135);
SVGRect.ATTRS = Y.SVGShape.ATTRS;
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2136);
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
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2147);
SVGEllipse = function(cfg)
{
	_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "SVGEllipse", 2147);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2149);
SVGEllipse.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2152);
SVGEllipse.NAME = "svgEllipse";

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2154);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_draw", 2170);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2172);
var node = this.node,
			w = this.get("width"),
			h = this.get("height"),
			x = this.get("x"),
			y = this.get("y"),
			xRadius = w * 0.5,
			yRadius = h * 0.5,
			cx = x + xRadius,
			cy = y + yRadius;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2181);
node.setAttribute("rx", xRadius);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2182);
node.setAttribute("ry", yRadius);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2183);
node.setAttribute("cx", cx);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2184);
node.setAttribute("cy", cy);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2185);
this._fillChangeHandler();
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2186);
this._strokeChangeHandler();
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2187);
this._updateTransform();
	}
});

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2191);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2199);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2201);
this.set("width", val * 2);
		},

		getter: function()
		{
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2204);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2206);
var val = this.get("width");
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2207);
if(val) 
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2209);
val *= 0.5;
			}
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2211);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2223);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2225);
this.set("height", val * 2);
		},

		getter: function()
		{
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2228);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2230);
var val = this.get("height");
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2231);
if(val) 
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2233);
val *= 0.5;
			}
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2235);
return val;
		}
	}
});
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2239);
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
 _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2250);
SVGCircle = function(cfg)
 {
    _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "SVGCircle", 2250);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2252);
SVGCircle.superclass.constructor.apply(this, arguments);
 };
    
 _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2255);
SVGCircle.NAME = "svgCircle";

 _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2257);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_draw", 2274);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2276);
var node = this.node,
            x = this.get("x"),
            y = this.get("y"),
            radius = this.get("radius"),
            cx = x + radius,
            cy = y + radius;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2282);
node.setAttribute("r", radius);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2283);
node.setAttribute("cx", cx);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2284);
node.setAttribute("cy", cy);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2285);
this._fillChangeHandler();
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2286);
this._strokeChangeHandler();
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2287);
this._updateTransform();
    }
 });
    
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2291);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2299);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2301);
this.set("radius", val/2);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2302);
return val;
        },

        getter: function()
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2305);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2307);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2318);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2320);
this.set("radius", val/2);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2321);
return val;
        },

        getter: function()
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2324);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2326);
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
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2340);
Y.SVGCircle = SVGCircle;
/**
 * Draws pie slices
 *
 * @module graphics
 * @class SVGPieSlice
 * @constructor
 */
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2348);
SVGPieSlice = function()
{
	_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "SVGPieSlice", 2348);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2350);
SVGPieSlice.superclass.constructor.apply(this, arguments);
};
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2352);
SVGPieSlice.NAME = "svgPieSlice";
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2353);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_draw", 2369);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2371);
var x = this.get("cx"),
            y = this.get("cy"),
            startAngle = this.get("startAngle"),
            arc = this.get("arc"),
            radius = this.get("radius");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2376);
this.clear();
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2377);
this.drawWedge(x, y, startAngle, arc, radius);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2378);
this.end();
	}
 }, Y.SVGDrawing.prototype));
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2381);
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
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2419);
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
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2430);
SVGGraphic = function(cfg) {
    _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "SVGGraphic", 2430);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2431);
SVGGraphic.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2434);
SVGGraphic.NAME = "svgGraphic";

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2436);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "valueFn", 2452);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2454);
return Y.guid();
		},

		setter: function(val)
		{
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2457);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2459);
var node = this._node;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2460);
if(node)
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2462);
node.setAttribute("id", val);
			}
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2464);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2478);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2480);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2494);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2496);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2510);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2512);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2523);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2525);
if(this._node)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2527);
this._node.style.width = val + "px";
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2529);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2540);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2542);
if(this._node)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2544);
this._node.style.height = val  + "px";
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2546);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2614);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2616);
return this._x;
        },

        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2619);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2621);
this._x = val;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2622);
if(this._node)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2624);
this._node.style.left = val + "px";
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2626);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2637);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2639);
return this._y;
        },

        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2642);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2644);
this._y = val;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2645);
if(this._node)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2647);
this._node.style.top = val + "px";
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2649);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2669);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2671);
this._toggleVisible(val);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2672);
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

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2687);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "set", 2697);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2699);
var host = this,
            redrawAttrs = {
                autoDraw: true,
                autoSize: true,
                preserveAspectRatio: true,
                resizeDown: true
            },
            key,
            forceRedraw = false;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2708);
AttributeLite.prototype.set.apply(host, arguments);	
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2709);
if(host._state.autoDraw === true && Y.Object.size(this._shapes) > 0)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2711);
if(Y_LANG.isString && redrawAttrs[attr])
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2713);
forceRedraw = true;
            }
            else {_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2715);
if(Y_LANG.isObject(attr))
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2717);
for(key in redrawAttrs)
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2719);
if(redrawAttrs.hasOwnProperty(key) && attr[key])
                    {
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2721);
forceRedraw = true;
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2722);
break;
                    }
                }
            }}
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2727);
if(forceRedraw)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2729);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getXY", 2757);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2759);
var node = Y.one(this._node),
            xy;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2761);
if(node)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2763);
xy = node.getXY();
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2765);
return xy;
    },

    /**
     * Initializes the class.
     *
     * @method initializer
     * @private
     */
    initializer: function() {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "initializer", 2774);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2775);
var render = this.get("render"),
            visibility = this.get("visible") ? "visible" : "hidden";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2777);
this._shapes = {};
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2778);
this._contentBounds = {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        };
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2784);
this._gradients = {};
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2785);
this._node = DOCUMENT.createElement('div');
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2786);
this._node.style.position = "absolute";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2787);
this._node.style.left = this.get("x") + "px";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2788);
this._node.style.top = this.get("y") + "px";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2789);
this._node.style.visibility = visibility;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2790);
this._contentNode = this._createGraphics();
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2791);
this._contentNode.style.visibility = visibility;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2792);
this._contentNode.setAttribute("id", this.get("id"));
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2793);
this._node.appendChild(this._contentNode);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2794);
if(render)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2796);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "render", 2806);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2807);
var parentNode = Y.one(render),
            w = this.get("width") || parseInt(parentNode.getComputedStyle("width"), 10),
            h = this.get("height") || parseInt(parentNode.getComputedStyle("height"), 10);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2810);
parentNode = parentNode || Y.one(DOCUMENT.body);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2811);
parentNode.append(this._node);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2812);
this.parentNode = parentNode;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2813);
this.set("width", w);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2814);
this.set("height", h);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2815);
return this;
    },

    /**
     * Removes all nodes.
     *
     * @method destroy
     */
    destroy: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "destroy", 2823);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2825);
this.removeAllShapes();
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2826);
if(this._contentNode)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2828);
this._removeChildren(this._contentNode);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2829);
if(this._contentNode.parentNode)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2831);
this._contentNode.parentNode.removeChild(this._contentNode);
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2833);
this._contentNode = null;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2835);
if(this._node)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2837);
this._removeChildren(this._node);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2838);
Y.one(this._node).remove(true);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2839);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "addShape", 2850);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2852);
cfg.graphic = this;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2853);
if(!this.get("visible"))
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2855);
cfg.visible = false;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2857);
var shapeClass = this._getShapeClass(cfg.type),
            shape = new shapeClass(cfg);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2859);
this._appendShape(shape);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2860);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_appendShape", 2870);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2872);
var node = shape.node,
            parentNode = this._frag || this._contentNode;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2874);
if(this.get("autoDraw")) 
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2876);
parentNode.appendChild(node);
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2880);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "removeShape", 2890);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2892);
if(!(shape instanceof SVGShape))
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2894);
if(Y_LANG.isString(shape))
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2896);
shape = this._shapes[shape];
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2899);
if(shape && shape instanceof SVGShape)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2901);
shape._destroy();
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2902);
delete this._shapes[shape.get("id")];
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2904);
if(this.get("autoDraw")) 
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2906);
this._redraw();
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2908);
return shape;
    },

    /**
     * Removes all shape instances from the dom.
     *
     * @method removeAllShapes
     */
    removeAllShapes: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "removeAllShapes", 2916);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2918);
var shapes = this._shapes,
            i;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2920);
for(i in shapes)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2922);
if(shapes.hasOwnProperty(i))
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2924);
shapes[i]._destroy();
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2927);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_removeChildren", 2937);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2939);
if(node.hasChildNodes())
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2941);
var child;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2942);
while(node.firstChild)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2944);
child = node.firstChild;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2945);
this._removeChildren(child);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2946);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "clear", 2956);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2957);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_toggleVisible", 2967);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2969);
var i,
            shapes = this._shapes,
            visibility = val ? "visible" : "hidden";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2972);
if(shapes)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2974);
for(i in shapes)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2976);
if(shapes.hasOwnProperty(i))
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2978);
shapes[i].set("visible", val);
                }
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2982);
if(this._contentNode)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2984);
this._contentNode.style.visibility = visibility;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2986);
if(this._node)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2988);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_getShapeClass", 3000);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3002);
var shape = this._shapeClass[val];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3003);
if(shape)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3005);
return shape;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3007);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getShapeById", 3032);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3034);
var shape = this._shapes[id];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3035);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "batch", 3044);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3046);
var autoDraw = this.get("autoDraw");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3047);
this.set("autoDraw", false);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3048);
method();
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3049);
this._redraw();
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3050);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_getDocFrag", 3060);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3062);
if(!this._frag)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3064);
this._frag = DOCUMENT.createDocumentFragment();
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3066);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_redraw", 3075);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3077);
var autoSize = this.get("autoSize"),
            preserveAspectRatio = this.get("preserveAspectRatio"),
            box = this.get("resizeDown") ? this._getUpdatedContentBounds() : this._contentBounds,
            left = box.left,
            right = box.right,
            top = box.top,
            bottom = box.bottom,
            width = right - left,
            height = bottom - top,
            computedWidth,
            computedHeight,
            computedLeft,
            computedTop,
            node;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3091);
if(autoSize)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3093);
if(autoSize == "sizeContentToGraphic")
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3095);
node = Y.one(this._node);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3096);
computedWidth = parseFloat(node.getComputedStyle("width"));
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3097);
computedHeight = parseFloat(node.getComputedStyle("height"));
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3098);
computedLeft = computedTop = 0;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3099);
this._contentNode.setAttribute("preserveAspectRatio", preserveAspectRatio);
            }
            else 
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3103);
computedWidth = width;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3104);
computedHeight = height;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3105);
computedLeft = left;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3106);
computedTop = top;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3107);
this._state.width = width;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3108);
this._state.height = height;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3109);
if(this._node)
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3111);
this._node.style.width = width + "px";
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3112);
this._node.style.height = height + "px";
                }
            }
        }
        else
        {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3118);
computedWidth = width;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3119);
computedHeight = height;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3120);
computedLeft = left;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3121);
computedTop = top;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3123);
if(this._contentNode)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3125);
this._contentNode.style.left = computedLeft + "px";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3126);
this._contentNode.style.top = computedTop + "px";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3127);
this._contentNode.setAttribute("width", computedWidth);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3128);
this._contentNode.setAttribute("height", computedHeight);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3129);
this._contentNode.style.width = computedWidth + "px";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3130);
this._contentNode.style.height = computedHeight + "px";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3131);
this._contentNode.setAttribute("viewBox", "" + left + " " + top + " " + width + " " + height + "");
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3133);
if(this._frag)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3135);
if(this._contentNode)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3137);
this._contentNode.appendChild(this._frag);
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3139);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "addToRedrawQueue", 3151);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3153);
var shapeBox,
            box;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3155);
this._shapes[shape.get("id")] = shape;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3156);
if(!this.get("resizeDown"))
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3158);
shapeBox = shape.getBounds();
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3159);
box = this._contentBounds;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3160);
box.left = box.left < shapeBox.left ? box.left : shapeBox.left;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3161);
box.top = box.top < shapeBox.top ? box.top : shapeBox.top;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3162);
box.right = box.right > shapeBox.right ? box.right : shapeBox.right;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3163);
box.bottom = box.bottom > shapeBox.bottom ? box.bottom : shapeBox.bottom;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3164);
box.width = box.right - box.left;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3165);
box.height = box.bottom - box.top;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3166);
this._contentBounds = box;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3168);
if(this.get("autoDraw")) 
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3170);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_getUpdatedContentBounds", 3181);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3183);
var bounds,
            i,
            shape,
            queue = this._shapes,
            box = {};
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3188);
for(i in queue)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3190);
if(queue.hasOwnProperty(i))
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3192);
shape = queue[i];
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3193);
bounds = shape.getBounds();
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3194);
box.left = Y_LANG.isNumber(box.left) ? Math.min(box.left, bounds.left) : bounds.left;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3195);
box.top = Y_LANG.isNumber(box.top) ? Math.min(box.top, bounds.top) : bounds.top;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3196);
box.right = Y_LANG.isNumber(box.right) ? Math.max(box.right, bounds.right) : bounds.right;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3197);
box.bottom = Y_LANG.isNumber(box.bottom) ? Math.max(box.bottom, bounds.bottom) : bounds.bottom;
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3200);
box.left = Y_LANG.isNumber(box.left) ? box.left : 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3201);
box.top = Y_LANG.isNumber(box.top) ? box.top : 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3202);
box.right = Y_LANG.isNumber(box.right) ? box.right : 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3203);
box.bottom = Y_LANG.isNumber(box.bottom) ? box.bottom : 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3204);
this._contentBounds = box;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3205);
return box;
    },

    /**
     * Creates a contentNode element
     *
     * @method _createGraphics
     * @private
     */
    _createGraphics: function() {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_createGraphics", 3214);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3215);
var contentNode = this._createGraphicNode("svg"),
            pointerEvents = this.get("pointerEvents");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3217);
contentNode.style.position = "absolute";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3218);
contentNode.style.top = "0px";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3219);
contentNode.style.left = "0px";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3220);
contentNode.style.overflow = "auto";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3221);
contentNode.setAttribute("overflow", "auto");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3222);
contentNode.setAttribute("pointer-events", pointerEvents);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3223);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_createGraphicNode", 3235);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3237);
var node = DOCUMENT.createElementNS("http://www.w3.org/2000/svg", "svg:" + type),
            v = pe || "none";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3239);
if(type !== "defs" && type !== "stop" && type !== "linearGradient" && type != "radialGradient")
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3241);
node.setAttribute("pointer-events", v);
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3243);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getGradientNode", 3255);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3257);
var gradients = this._gradients,
            gradient,
            nodeType = type + "Gradient";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3260);
if(gradients.hasOwnProperty(key) && gradients[key].tagName.indexOf(type) > -1)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3262);
gradient = this._gradients[key];
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3266);
gradient = this._createGraphicNode(nodeType);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3267);
if(!this._defs)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3269);
this._defs = this._createGraphicNode("defs");
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3270);
this._contentNode.appendChild(this._defs);
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3272);
this._defs.appendChild(gradient);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3273);
key = key || "gradient" + Math.round(100000 * Math.random());
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3274);
gradient.setAttribute("id", key);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3275);
if(gradients.hasOwnProperty(key))
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3277);
this._defs.removeChild(gradients[key]);
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3279);
gradients[key] = gradient;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3281);
return gradient;
    },

    /**
     * Inserts shape on the top of the tree.
     *
     * @method _toFront
     * @param {SVGShape} Shape to add.
     * @private
     */
    _toFront: function(shape)
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_toFront", 3291);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3293);
var contentNode = this._contentNode;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3294);
if(shape instanceof Y.SVGShape)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3296);
shape = shape.get("node");
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3298);
if(contentNode && shape)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3300);
contentNode.appendChild(shape);
        }
    },

    /**
     * Inserts shape as the first child of the content node.
     *
     * @method _toBack
     * @param {SVGShape} Shape to add.
     * @private
     */
    _toBack: function(shape)
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_toBack", 3311);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3313);
var contentNode = this._contentNode,
            targetNode;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3315);
if(shape instanceof Y.SVGShape)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3317);
shape = shape.get("node");
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3319);
if(contentNode && shape)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3321);
targetNode = contentNode.firstChild;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3322);
if(targetNode)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3324);
contentNode.insertBefore(shape, targetNode);
            }
            else
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3328);
contentNode.appendChild(shape);
            }
        }
    }
});

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3334);
Y.SVGGraphic = SVGGraphic;



}, '@VERSION@', {"requires": ["graphics"]});
