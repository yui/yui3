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
_yuitest_coverage["build/graphics-svg/graphics-svg.js"].code=["YUI.add('graphics-svg', function (Y, NAME) {","","var IMPLEMENTATION = \"svg\",","    SHAPE = \"shape\",","	SPLITPATHPATTERN = /[a-z][^a-z]*/ig,","    SPLITARGSPATTERN = /[-]?[0-9]*[0-9|\\.][0-9]*/g,","    Y_LANG = Y.Lang,","	AttributeLite = Y.AttributeLite,","	SVGGraphic,","    SVGShape,","	SVGCircle,","	SVGRect,","	SVGPath,","	SVGEllipse,","    SVGPieSlice,","    DOCUMENT = Y.config.doc,","    _getClassName = Y.ClassNameManager.getClassName;","","function SVGDrawing(){}","","/**"," * <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> implementation of the <a href=\"Drawing.html\">`Drawing`</a> class. "," * `SVGDrawing` is not intended to be used directly. Instead, use the <a href=\"Drawing.html\">`Drawing`</a> class. "," * If the browser has <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities, the <a href=\"Drawing.html\">`Drawing`</a> "," * class will point to the `SVGDrawing` class."," *"," * @module graphics"," * @class SVGDrawing"," * @constructor"," */","SVGDrawing.prototype = {","    /**","     * Maps path to methods","     *","     * @property _pathSymbolToMethod","     * @type Object","     * @private","     */","    _pathSymbolToMethod: {","        M: \"moveTo\",","        m: \"relativeMoveTo\",","        L: \"lineTo\",","        l: \"relativeLineTo\",","        C: \"curveTo\",","        c: \"relativeCurveTo\",","        Q: \"quadraticCurveTo\",","        q: \"relativeQuadraticCurveTo\",","        z: \"closePath\",","        Z: \"closePath\"","    },","","    /**","     * Current x position of the drawing.","     *","     * @property _currentX","     * @type Number","     * @private","     */","    _currentX: 0,","","    /**","     * Current y position of the drqwing.","     *","     * @property _currentY","     * @type Number","     * @private","     */","    _currentY: 0,","    ","    /**","     * Indicates the type of shape","     *","     * @private","     * @property _type","     * @readOnly","     * @type String","     */","    _type: \"path\",","    ","    /**","     * Value for rounding up to coordsize","     *","     * @property _coordSpaceMultiplier","     * @type Number","     * @private","     */","    _coordSpaceMultiplier: 100,","","    /**","     * Rounds dimensions and position values based on the coordinate space.","     *","     * @method _round","     * @param {Number} The value for rounding","     * @return Number","     * @private","     */","    _round:function(val)","    {","        val = Math.round(val * 100)/100;","        return val;","    },","   ","    /**","     * Draws a bezier curve.","     *","     * @method curveTo","     * @param {Number} cp1x x-coordinate for the first control point.","     * @param {Number} cp1y y-coordinate for the first control point.","     * @param {Number} cp2x x-coordinate for the second control point.","     * @param {Number} cp2y y-coordinate for the second control point.","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    curveTo: function() {","        this._curveTo.apply(this, [Y.Array(arguments), false]);","    },","","    /**","     * Draws a bezier curve relative to the current coordinates.","     *","     * @method relativeCurveTo","     * @param {Number} cp1x x-coordinate for the first control point.","     * @param {Number} cp1y y-coordinate for the first control point.","     * @param {Number} cp2x x-coordinate for the second control point.","     * @param {Number} cp2y y-coordinate for the second control point.","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    relativeCurveTo: function() {","        this._curveTo.apply(this, [Y.Array(arguments), true]);","    },","","    /**","     * Implements curveTo methods.","     *","     * @method _curveTo","     * @param {Array} args The arguments to be used.","     * @param {Boolean} relative Indicates whether or not to use relative coordinates.","     * @private","     */","    _curveTo: function(args, relative) {","        var w,","            h,","            pts,","            right,","            left,","            bottom,","            top,","            i = 0,","            len,","            pathArrayLen,","            currentArray,","            command = relative ? \"c\" : \"C\",","            relativeX = relative ? parseFloat(this._currentX) : 0,","            relativeY = relative ? parseFloat(this._currentY) : 0;","        this._pathArray = this._pathArray || [];","        if(this._pathType !== command)","        {","            this._pathType = command;","            currentArray = [command];","            this._pathArray.push(currentArray);","        }","        else","        {","            currentArray = this._pathArray[Math.max(0, this._pathArray.length - 1)];","            if(!currentArray)","            {","                currentArray = [];","                this._pathArray.push(currentArray);","            }","        }","        pathArrayLen = this._pathArray.length - 1;","        this._pathArray[pathArrayLen] = this._pathArray[pathArrayLen].concat(args);","        len = args.length - 5;","        for(; i < len; i = i + 6)","        {","            cp1x = parseFloat(args[i]) + relativeX;","            cp1y = parseFloat(args[i + 1]) + relativeY;","            cp2x = parseFloat(args[i + 2]) + relativeX;","            cp2y = parseFloat(args[i + 3]) + relativeY;","            x = parseFloat(args[i + 4]) + relativeX;","            y = parseFloat(args[i + 5]) + relativeY;","            right = Math.max(x, Math.max(cp1x, cp2x));","            bottom = Math.max(y, Math.max(cp1y, cp2y));","            left = Math.min(x, Math.min(cp1x, cp2x));","            top = Math.min(y, Math.min(cp1y, cp2y));","            w = Math.abs(right - left);","            h = Math.abs(bottom - top);","            pts = [[this._currentX, this._currentY] , [cp1x, cp1y], [cp2x, cp2y], [x, y]]; ","            this._setCurveBoundingBox(pts, w, h);","            this._currentX = x;","            this._currentY = y;","        }","    },","","    /**","     * Draws a quadratic bezier curve.","     *","     * @method quadraticCurveTo","     * @param {Number} cpx x-coordinate for the control point.","     * @param {Number} cpy y-coordinate for the control point.","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    quadraticCurveTo: function() {","        this._quadraticCurveTo.apply(this, [Y.Array(arguments), false]);","    },","","    /**","     * Draws a quadratic bezier curve relative to the current position.","     *","     * @method quadraticCurveTo","     * @param {Number} cpx x-coordinate for the control point.","     * @param {Number} cpy y-coordinate for the control point.","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    relativeQuadraticCurveTo: function() {","        this._quadraticCurveTo.apply(this, [Y.Array(arguments), true]);","    },","   ","    /**","     * Implements quadraticCurveTo methods.","     *","     * @method _quadraticCurveTo","     * @param {Array} args The arguments to be used.","     * @param {Boolean} relative Indicates whether or not to use relative coordinates.","     * @private","     */","    _quadraticCurveTo: function(args, relative) {","        var cpx, ","            cpy, ","            x, ","            y,","            pathArrayLen,","            currentArray,","            w,","            h,","            pts,","            right,","            left,","            bottom,","            top,","            i = 0,","            len,","            command = relative ? \"q\" : \"Q\",","            relativeX = relative ? parseFloat(this._currentX) : 0,","            relativeY = relative ? parseFloat(this._currentY) : 0;","        if(this._pathType !== command)","        {","            this._pathType = command;","            currentArray = [command];","            this._pathArray.push(currentArray);","        }","        else","        {","            currentArray = this._pathArray[Math.max(0, this._pathArray.length - 1)];","            if(!currentArray)","            {","                currentArray = [];","                this._pathArray.push(currentArray);","            }","        }","        pathArrayLen = this._pathArray.length - 1;","        this._pathArray[pathArrayLen] = this._pathArray[pathArrayLen].concat(args);","        len = args.length - 3;","        for(; i < len; i = i + 4)","        {","            cpx = parseFloat(args[i]) + relativeX;","            cpy = parseFloat(args[i + 1]) + relativeY;","            x = parseFloat(args[i + 2]) + relativeX;","            y = parseFloat(args[i + 3]) + relativeY;","            right = Math.max(x, cpx);","            bottom = Math.max(y, cpy);","            left = Math.min(x, cpx);","            top = Math.min(y, cpy);","            w = Math.abs(right - left);","            h = Math.abs(bottom - top);","            pts = [[this._currentX, this._currentY] , [cpx, cpy], [x, y]]; ","            this._setCurveBoundingBox(pts, w, h);","            this._currentX = x;","            this._currentY = y;","        }","    },","","    /**","     * Draws a rectangle.","     *","     * @method drawRect","     * @param {Number} x x-coordinate","     * @param {Number} y y-coordinate","     * @param {Number} w width","     * @param {Number} h height","     */","    drawRect: function(x, y, w, h) {","        this.moveTo(x, y);","        this.lineTo(x + w, y);","        this.lineTo(x + w, y + h);","        this.lineTo(x, y + h);","        this.lineTo(x, y);","    },","","    /**","     * Draws a rectangle with rounded corners.","     * ","     * @method drawRect","     * @param {Number} x x-coordinate","     * @param {Number} y y-coordinate","     * @param {Number} w width","     * @param {Number} h height","     * @param {Number} ew width of the ellipse used to draw the rounded corners","     * @param {Number} eh height of the ellipse used to draw the rounded corners","     */","    drawRoundRect: function(x, y, w, h, ew, eh) {","        this.moveTo(x, y + eh);","        this.lineTo(x, y + h - eh);","        this.quadraticCurveTo(x, y + h, x + ew, y + h);","        this.lineTo(x + w - ew, y + h);","        this.quadraticCurveTo(x + w, y + h, x + w, y + h - eh);","        this.lineTo(x + w, y + eh);","        this.quadraticCurveTo(x + w, y, x + w - ew, y);","        this.lineTo(x + ew, y);","        this.quadraticCurveTo(x, y, x, y + eh);","	},","","    /**","     * Draws a circle.     ","     * ","     * @method drawCircle","     * @param {Number} x y-coordinate","     * @param {Number} y x-coordinate","     * @param {Number} r radius","     * @protected","     */","	drawCircle: function(x, y, radius) {","        var circum = radius * 2;","        this._drawingComplete = false;","        this._trackSize(x, y);","        this._trackSize(x + circum, y + circum);","        this._pathArray = this._pathArray || [];","        this._pathArray.push([\"M\", x + radius, y]);","        this._pathArray.push([\"A\",  radius, radius, 0, 1, 0, x + radius, y + circum]);","        this._pathArray.push([\"A\",  radius, radius, 0, 1, 0, x + radius, y]);","        this._currentX = x;","        this._currentY = y;","        return this;","    },","   ","    /**","     * Draws an ellipse.","     *","     * @method drawEllipse","     * @param {Number} x x-coordinate","     * @param {Number} y y-coordinate","     * @param {Number} w width","     * @param {Number} h height","     * @protected","     */","	drawEllipse: function(x, y, w, h) {","        var radius = w * 0.5,","            yRadius = h * 0.5;","        this._drawingComplete = false;","        this._trackSize(x, y);","        this._trackSize(x + w, y + h);","        this._pathArray = this._pathArray || [];","        this._pathArray.push([\"M\", x + radius, y]);","        this._pathArray.push([\"A\",  radius, yRadius, 0, 1, 0, x + radius, y + h]);","        this._pathArray.push([\"A\",  radius, yRadius, 0, 1, 0, x + radius, y]);","        this._currentX = x;","        this._currentY = y;","        return this;","    },","","    /**","     * Draws a diamond.     ","     * ","     * @method drawDiamond","     * @param {Number} x y-coordinate","     * @param {Number} y x-coordinate","     * @param {Number} width width","     * @param {Number} height height","     * @protected","     */","    drawDiamond: function(x, y, width, height)","    {","        var midWidth = width * 0.5,","            midHeight = height * 0.5;","        this.moveTo(x + midWidth, y);","        this.lineTo(x + width, y + midHeight);","        this.lineTo(x + midWidth, y + height);","        this.lineTo(x, y + midHeight);","        this.lineTo(x + midWidth, y);","        return this;","    },","","    /**","     * Draws a wedge.","     *","     * @method drawWedge","     * @param {Number} x x-coordinate of the wedge's center point","     * @param {Number} y y-coordinate of the wedge's center point","     * @param {Number} startAngle starting angle in degrees","     * @param {Number} arc sweep of the wedge. Negative values draw clockwise.","     * @param {Number} radius radius of wedge. If [optional] yRadius is defined, then radius is the x radius.","     * @param {Number} yRadius [optional] y radius for wedge.","     * @private","     */","    drawWedge: function(x, y, startAngle, arc, radius, yRadius)","    {","        var segs,","            segAngle,","            theta,","            angle,","            angleMid,","            ax,","            ay,","            bx,","            by,","            cx,","            cy,","            i = 0,","            diameter = radius * 2,","            currentArray,","            pathArrayLen;","        yRadius = yRadius || radius;","        if(this._pathType != \"M\")","        {","            this._pathType = \"M\";","            currentArray = [\"M\"];","            this._pathArray.push(currentArray);","        }","        else","        {","            currentArray = this._getCurrentArray(); ","        }","        pathArrayLen = this._pathArray.length - 1;","        this._pathArray[pathArrayLen].push(x); ","        this._pathArray[pathArrayLen].push(x); ","        ","        // limit sweep to reasonable numbers","        if(Math.abs(arc) > 360)","        {","            arc = 360;","        }","        ","        // First we calculate how many segments are needed","        // for a smooth arc.","        segs = Math.ceil(Math.abs(arc) / 45);","        ","        // Now calculate the sweep of each segment.","        segAngle = arc / segs;","        ","        // The math requires radians rather than degrees. To convert from degrees","        // use the formula (degrees/180)*Math.PI to get radians.","        theta = -(segAngle / 180) * Math.PI;","        ","        // convert angle startAngle to radians","        angle = (startAngle / 180) * Math.PI;","        if(segs > 0)","        {","            // draw a line from the center to the start of the curve","            ax = x + Math.cos(startAngle / 180 * Math.PI) * radius;","            ay = y + Math.sin(startAngle / 180 * Math.PI) * yRadius;","            this._pathType = \"L\";","            pathArrayLen++;","            this._pathArray[pathArrayLen] = [\"L\"];","            this._pathArray[pathArrayLen].push(Math.round(ax));","            this._pathArray[pathArrayLen].push(Math.round(ay));","            pathArrayLen++; ","            this._pathType = \"Q\";","            this._pathArray[pathArrayLen] = [\"Q\"];","            for(; i < segs; ++i)","            {","                angle += theta;","                angleMid = angle - (theta / 2);","                bx = x + Math.cos(angle) * radius;","                by = y + Math.sin(angle) * yRadius;","                cx = x + Math.cos(angleMid) * (radius / Math.cos(theta / 2));","                cy = y + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));","                this._pathArray[pathArrayLen].push(Math.round(cx));","                this._pathArray[pathArrayLen].push(Math.round(cy));","                this._pathArray[pathArrayLen].push(Math.round(bx));","                this._pathArray[pathArrayLen].push(Math.round(by));","            }","        }","        this._currentX = x;","        this._currentY = y;","        this._trackSize(diameter, diameter); ","        return this;","    },","","    /**","     * Draws a line segment using the current line style from the current drawing position to the specified x and y coordinates.","     * ","     * @method lineTo","     * @param {Number} point1 x-coordinate for the end point.","     * @param {Number} point2 y-coordinate for the end point.","     */","    lineTo: function()","    {","        this._lineTo.apply(this, [Y.Array(arguments), false]);","    },","","    /**","     * Draws a line segment using the current line style from the current drawing position to the relative x and y coordinates.","     * ","     * @method relativeLineTo","     * @param {Number} point1 x-coordinate for the end point.","     * @param {Number} point2 y-coordinate for the end point.","     */","    relativeLineTo: function()","    {","        this._lineTo.apply(this, [Y.Array(arguments), true]);","    },","","    /**","     * Implements lineTo methods.","     *","     * @method _lineTo","     * @param {Array} args The arguments to be used.","     * @param {Boolean} relative Indicates whether or not to use relative coordinates.","     * @private","     */","    _lineTo: function(args, relative) {","        var point1 = args[0],","            i,","            len,","            pathArrayLen,","            currentArray,","            x,","            y,","            command = relative ? \"l\" : \"L\",","            relativeX = relative ? this._round(this._currentX) : 0,","            relativeY = relative ? this._round(this._currentY) : 0;","        this._pathArray = this._pathArray || [];","        this._shapeType = \"path\";","        len = args.length;","        if(this._pathType !== command)","        {","            this._pathType = command;","            currentArray = [command];","            this._pathArray.push(currentArray);","        }","        else","        {","            currentArray = this._getCurrentArray();","        }","        pathArrayLen = this._pathArray.length - 1;","        if (typeof point1 === 'string' || typeof point1 === 'number') {","            for (i = 0; i < len; i = i + 2) {","                x = this._round(args[i]);","                y = this._round(args[i + 1]);","                this._pathArray[pathArrayLen].push(x);","                this._pathArray[pathArrayLen].push(y);","                x = x + relativeX;","                y = y + relativeY;","                this._currentX = x;","                this._currentY = y;","                this._trackSize.apply(this, [x, y]);","            }","        }","        else","        {","            for (i = 0; i < len; ++i) {","                x = this._round(args[i][0]);","                y = this._round(args[i][1]);","                this._pathArray[pathArrayLen].push(x);","                this._pathArray[pathArrayLen].push(y);","                this._currentX = x;","                this._currentY = y;","                x = x + relativeX;","                y = y + relativeY;","                this._trackSize.apply(this, [x, y]);","            }","        }","    },","","    /**","     * Moves the current drawing position to specified x and y coordinates.","     *","     * @method moveTo","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    moveTo: function()","    {","        this._moveTo.apply(this, [Y.Array(arguments), false]);","    },","","    /**","     * Moves the current drawing position relative to specified x and y coordinates.","     *","     * @method relativeMoveTo","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    relativeMoveTo: function()","    {","        this._moveTo.apply(this, [Y.Array(arguments), true]);","    },","","    /**","     * Implements moveTo methods.","     *","     * @method _moveTo","     * @param {Array} args The arguments to be used.","     * @param {Boolean} relative Indicates whether or not to use relative coordinates.","     * @private","     */","    _moveTo: function(args, relative) {","        var pathArrayLen,","            currentArray,","            x = this._round(args[0]),","            y = this._round(args[1]),","            command = relative ? \"m\" : \"M\",","            relativeX = relative ? parseFloat(this._currentX) : 0,","            relativeY = relative ? parseFloat(this._currentY) : 0;","        this._pathArray = this._pathArray || [];","        this._pathType = command;","        currentArray = [command];","        this._pathArray.push(currentArray);","        pathArrayLen = this._pathArray.length - 1;","        this._pathArray[pathArrayLen] = this._pathArray[pathArrayLen].concat([x, y]);","        x = x + relativeX;","        y = y + relativeY;","        this._currentX = x;","        this._currentY = y;","        this._trackSize(x, y);","    },"," ","    /**","     * Completes a drawing operation. ","     *","     * @method end","     */","    end: function()","    {","        this._closePath();","        this._graphic.addToRedrawQueue(this);    ","    },","","    /**","     * Clears the path.","     *","     * @method clear","     */","    clear: function()","    {","        this._currentX = 0;","        this._currentY = 0;","        this._width = 0;","        this._height = 0;","        this._left = 0;","        this._right = 0;","        this._top = 0;","        this._bottom = 0;","        this._pathArray = [];","        this._path = \"\";","    },","","    /**","     * Draws the path.","     *","     * @method _closePath","     * @private","     */","    _closePath: function()","    {","        var pathArray,","            segmentArray,","            pathType,","            len,","            val,","            val2,","            i,","            path = \"\",","            node = this.node,","            left = this._round(this._left),","            top = this._round(this._top),","            fill = this.get(\"fill\");","        if(this._pathArray)","        {","            pathArray = this._pathArray.concat();","            while(pathArray && pathArray.length > 0)","            {","                segmentArray = pathArray.shift();","                len = segmentArray.length;","                pathType = segmentArray[0];","                if(pathType === \"A\" || pathType == \"c\" || pathType == \"C\")","                {","                    path += pathType + segmentArray[1] + \",\" + segmentArray[2];","                }","                else if(pathType != \"z\")","                {","                    path += \" \" + pathType + this._round(segmentArray[1] - left);","                }","                else","                {","                    path += \" z \";","                }","                switch(pathType)","                {","                    case \"L\" :","                    case \"l\" :","                    case \"M\" :","                    case \"Q\" :","                    case \"q\" :","                        for(i = 2; i < len; ++i)","                        {","                            val = (i % 2 === 0) ? top : left;","                            val = segmentArray[i] - val;","                            path += \", \" + this._round(val);","                        }","                    break;","                    case \"A\" :","                        val = \" \" + this._round(segmentArray[3]) + \" \" + this._round(segmentArray[4]);","                        val += \",\" + this._round(segmentArray[5]) + \" \" + this._round(segmentArray[6] - left);","                        val += \",\" + this._round(segmentArray[7] - top);","                        path += \" \" + val;","                    break;","                    case \"C\" :","                    case \"c\" :","                        for(i = 3; i < len - 1; i = i + 2)","                        {","                            val = this._round(segmentArray[i] - left);","                            val = val + \", \";","                            val = val + this._round(segmentArray[i + 1] - top);","                            path += \" \" + val;","                        }","                    break;","                }","            }","            if(fill && fill.color)","            {","                path += 'z';","            }","            Y.Lang.trim(path);","            if(path)","            {","                node.setAttribute(\"d\", path);","            }","            ","            this._path = path;","            this._fillChangeHandler();","            this._strokeChangeHandler();","            this._updateTransform();","        }","    },","","    /**","     * Ends a fill and stroke","     *","     * @method closePath","     */","    closePath: function()","    {","        this._pathArray.push([\"z\"]);","    },","","    /**","     * Returns the current array of drawing commands.","     *","     * @method _getCurrentArray","     * @return Array","     * @private","     */","    _getCurrentArray: function()","    {","        var currentArray = this._pathArray[Math.max(0, this._pathArray.length - 1)];","        if(!currentArray)","        {","            currentArray = [];","            this._pathArray.push(currentArray);","        }","        return currentArray;","    },","    ","    /**","     * Returns the points on a curve","     *","     * @method getBezierData","     * @param Array points Array containing the begin, end and control points of a curve.","     * @param Number t The value for incrementing the next set of points.","     * @return Array","     * @private","     */","    getBezierData: function(points, t) {  ","        var n = points.length,","            tmp = [],","            i,","            j;","","        for (i = 0; i < n; ++i){","            tmp[i] = [points[i][0], points[i][1]]; // save input","        }","        ","        for (j = 1; j < n; ++j) {","            for (i = 0; i < n - j; ++i) {","                tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];","                tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1]; ","            }","        }","        return [ tmp[0][0], tmp[0][1] ]; ","    },","  ","    /**","     * Calculates the bounding box for a curve","     *","     * @method _setCurveBoundingBox","     * @param Array pts Array containing points for start, end and control points of a curve.","     * @param Number w Width used to calculate the number of points to describe the curve.","     * @param Number h Height used to calculate the number of points to describe the curve.","     * @private","     */","    _setCurveBoundingBox: function(pts, w, h)","    {","        var i = 0,","            left = this._currentX,","            right = left,","            top = this._currentY,","            bottom = top,","            len = Math.round(Math.sqrt((w * w) + (h * h))),","            t = 1/len,","            xy;","        for(; i < len; ++i)","        {","            xy = this.getBezierData(pts, t * i);","            left = isNaN(left) ? xy[0] : Math.min(xy[0], left);","            right = isNaN(right) ? xy[0] : Math.max(xy[0], right);","            top = isNaN(top) ? xy[1] : Math.min(xy[1], top);","            bottom = isNaN(bottom) ? xy[1] : Math.max(xy[1], bottom);","        }","        left = Math.round(left * 10)/10;","        right = Math.round(right * 10)/10;","        top = Math.round(top * 10)/10;","        bottom = Math.round(bottom * 10)/10;","        this._trackSize(right, bottom);","        this._trackSize(left, top);","    },","    ","    /**","     * Updates the size of the graphics object","     *","     * @method _trackSize","     * @param {Number} w width","     * @param {Number} h height","     * @private","     */","    _trackSize: function(w, h) {","        if (w > this._right) {","            this._right = w;","        }","        if(w < this._left)","        {","            this._left = w;    ","        }","        if (h < this._top)","        {","            this._top = h;","        }","        if (h > this._bottom) ","        {","            this._bottom = h;","        }","        this._width = this._right - this._left;","        this._height = this._bottom - this._top;","    }","};","Y.SVGDrawing = SVGDrawing;","/**"," * <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> implementation of the <a href=\"Shape.html\">`Shape`</a> class. "," * `SVGShape` is not intended to be used directly. Instead, use the <a href=\"Shape.html\">`Shape`</a> class. "," * If the browser has <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities, the <a href=\"Shape.html\">`Shape`</a> "," * class will point to the `SVGShape` class."," *"," * @module graphics"," * @class SVGShape"," * @constructor"," * @param {Object} cfg (optional) Attribute configs"," */","SVGShape = function(cfg)","{","    this._transforms = [];","    this.matrix = new Y.Matrix();","    this._normalizedMatrix = new Y.Matrix();","    SVGShape.superclass.constructor.apply(this, arguments);","};","","SVGShape.NAME = \"shape\";","","Y.extend(SVGShape, Y.GraphicBase, Y.mix({","    /**","     * Storage for x attribute.","     *","     * @property _x","     * @protected","     */","    _x: 0,","","    /**","     * Storage for y attribute.","     *","     * @property _y","     * @protected","     */","    _y: 0,","    ","    /**","     * Init method, invoked during construction.","     * Calls `initializer` method.","     *","     * @method init","     * @protected","     */","	init: function()","	{","		this.initializer.apply(this, arguments);","	},","","	/**","	 * Initializes the shape","	 *","	 * @private","	 * @method initializer","	 */","	initializer: function(cfg)","	{","		var host = this,","            graphic = cfg.graphic,","            data = this.get(\"data\");","		host.createNode(); ","		if(graphic)","        {","            host._setGraphic(graphic);","        }","        if(data)","        {","            host._parsePathData(data);","        }","        host._updateHandler();","	},"," ","    /**","     * Set the Graphic instance for the shape.","     *","     * @method _setGraphic","     * @param {Graphic | Node | HTMLElement | String} render This param is used to determine the graphic instance. If it is a `Graphic` instance, it will be assigned","     * to the `graphic` attribute. Otherwise, a new Graphic instance will be created and rendered into the dom element that the render represents.","     * @private","     */","    _setGraphic: function(render)","    {","        var graphic;","        if(render instanceof Y.SVGGraphic)","        {","		    this._graphic = render;","        }","        else","        {","            render = Y.one(render);","            graphic = new Y.SVGGraphic({","                render: render","            });","            graphic._appendShape(this);","            this._graphic = graphic;","        }","    },","","	/**","	 * Add a class name to each node.","	 *","	 * @method addClass","	 * @param {String} className the class name to add to the node's class attribute ","	 */","	addClass: function(className)","	{","		var node = this.node;","		node.className.baseVal = Y_LANG.trim([node.className.baseVal, className].join(' '));","	},","","	/**","	 * Removes a class name from each node.","	 *","	 * @method removeClass","	 * @param {String} className the class name to remove from the node's class attribute","	 */","	removeClass: function(className)","	{","		var node = this.node,","			classString = node.className.baseVal;","		classString = classString.replace(new RegExp(className + ' '), className).replace(new RegExp(className), '');","		node.className.baseVal = classString;","	},","","	/**","	 * Gets the current position of the node in page coordinates.","	 *","	 * @method getXY","	 * @return Array The XY position of the shape.","	 */","	getXY: function()","	{","		var graphic = this._graphic,","			parentXY = graphic.getXY(),","			x = this._x,","			y = this._y;","		return [parentXY[0] + x, parentXY[1] + y];","	},","","	/**","	 * Set the position of the shape in page coordinates, regardless of how the node is positioned.","	 *","	 * @method setXY","	 * @param {Array} Contains x & y values for new position (coordinates are page-based)","	 */","	setXY: function(xy)","	{","		var graphic = this._graphic,","			parentXY = graphic.getXY();","		this._x = xy[0] - parentXY[0];","		this._y = xy[1] - parentXY[1];","        this.set(\"transform\", this.get(\"transform\"));","	},","","	/**","	 * Determines whether the node is an ancestor of another HTML element in the DOM hierarchy. ","	 *","	 * @method contains","	 * @param {SVGShape | HTMLElement} needle The possible node or descendent","	 * @return Boolean Whether or not this shape is the needle or its ancestor.","	 */","	contains: function(needle)","	{","		return needle === Y.one(this.node);","	},","","	/**","	 * Compares nodes to determine if they match.","	 * Node instances can be compared to each other and/or HTMLElements.","	 * @method compareTo","	 * @param {HTMLElement | Node} refNode The reference node to compare to the node.","	 * @return {Boolean} True if the nodes match, false if they do not.","	 */","	compareTo: function(refNode) {","		var node = this.node;","","		return node === refNode;","	},","","	/**","	 * Test if the supplied node matches the supplied selector.","	 *","	 * @method test","	 * @param {String} selector The CSS selector to test against.","	 * @return Boolean Wheter or not the shape matches the selector.","	 */","	test: function(selector)","	{","		return Y.Selector.test(this.node, selector);","	},","	","	/**","	 * Value function for fill attribute","	 *","	 * @private","	 * @method _getDefaultFill","	 * @return Object","	 */","	_getDefaultFill: function() {","		return {","			type: \"solid\",","			opacity: 1,","			cx: 0.5,","			cy: 0.5,","			fx: 0.5,","			fy: 0.5,","			r: 0.5","		};","	},","	","	/**","	 * Value function for stroke attribute","	 *","	 * @private","	 * @method _getDefaultStroke","	 * @return Object","	 */","	_getDefaultStroke: function() ","	{","		return {","			weight: 1,","			dashstyle: \"none\",","			color: \"#000\",","			opacity: 1.0","		};","	},","","	/**","	 * Creates the dom node for the shape.","	 *","     * @method createNode","	 * @return HTMLElement","	 * @private","	 */","	createNode: function()","	{","		var host = this,","            node = DOCUMENT.createElementNS(\"http://www.w3.org/2000/svg\", \"svg:\" + this._type),","			id = host.get(\"id\"),","            name = host.name,","            concat = host._camelCaseConcat,","			pointerEvents = host.get(\"pointerEvents\");","		host.node = node;","		host.addClass(_getClassName(SHAPE) + \" \" + _getClassName(concat(IMPLEMENTATION, SHAPE)) + \" \" + _getClassName(name) + \" \" + _getClassName(concat(IMPLEMENTATION, name))); ","        if(id)","		{","			node.setAttribute(\"id\", id);","		}","		if(pointerEvents)","		{","			node.setAttribute(\"pointer-events\", pointerEvents);","		}","        if(!host.get(\"visible\"))","        {","            Y.one(node).setStyle(\"visibility\", \"hidden\");","        }","	},","	","","	/**","     * Overrides default `on` method. Checks to see if its a dom interaction event. If so, ","     * return an event attached to the `node` element. If not, return the normal functionality.","     *","     * @method on","     * @param {String} type event type","     * @param {Object} callback function","	 * @private","	 */","	on: function(type, fn)","	{","		if(Y.Node.DOM_EVENTS[type])","		{","			return Y.one(\"#\" +  this.get(\"id\")).on(type, fn);","		}","		return Y.on.apply(this, arguments);","	},","","	/**","	 * Adds a stroke to the shape node.","	 *","	 * @method _strokeChangeHandler","	 * @private","	 */","	_strokeChangeHandler: function(e)","	{","		var node = this.node,","			stroke = this.get(\"stroke\"),","			strokeOpacity,","			dashstyle,","			dash,","			linejoin;","		if(stroke && stroke.weight && stroke.weight > 0)","		{","			linejoin = stroke.linejoin || \"round\";","			strokeOpacity = parseFloat(stroke.opacity);","			dashstyle = stroke.dashstyle || \"none\";","			dash = Y_LANG.isArray(dashstyle) ? dashstyle.toString() : dashstyle;","			stroke.color = stroke.color || \"#000000\";","			stroke.weight = stroke.weight || 1;","			stroke.opacity = Y_LANG.isNumber(strokeOpacity) ? strokeOpacity : 1;","			stroke.linecap = stroke.linecap || \"butt\";","			node.setAttribute(\"stroke-dasharray\", dash);","			node.setAttribute(\"stroke\", stroke.color);","			node.setAttribute(\"stroke-linecap\", stroke.linecap);","			node.setAttribute(\"stroke-width\",  stroke.weight);","			node.setAttribute(\"stroke-opacity\", stroke.opacity);","			if(linejoin == \"round\" || linejoin == \"bevel\")","			{","				node.setAttribute(\"stroke-linejoin\", linejoin);","			}","			else","			{","				linejoin = parseInt(linejoin, 10);","				if(Y_LANG.isNumber(linejoin))","				{","					node.setAttribute(\"stroke-miterlimit\",  Math.max(linejoin, 1));","					node.setAttribute(\"stroke-linejoin\", \"miter\");","				}","			}","		}","		else","		{","			node.setAttribute(\"stroke\", \"none\");","		}","	},","	","	/**","	 * Adds a fill to the shape node.","	 *","	 * @method _fillChangeHandler","	 * @private","	 */","	_fillChangeHandler: function(e)","	{","		var node = this.node,","			fill = this.get(\"fill\"),","			fillOpacity,","			type;","		if(fill)","		{","			type = fill.type;","			if(type == \"linear\" || type == \"radial\")","			{","				this._setGradientFill(fill);","				node.setAttribute(\"fill\", \"url(#grad\" + this.get(\"id\") + \")\");","			}","			else if(!fill.color)","			{","				node.setAttribute(\"fill\", \"none\");","			}","			else","			{","                fillOpacity = parseFloat(fill.opacity);","				fillOpacity = Y_LANG.isNumber(fillOpacity) ? fillOpacity : 1;","				node.setAttribute(\"fill\", fill.color);","				node.setAttribute(\"fill-opacity\", fillOpacity);","			}","		}","		else","		{","			node.setAttribute(\"fill\", \"none\");","		}","	},","","	/**","	 * Creates a gradient fill","	 *","	 * @method _setGradientFill","	 * @param {String} type gradient type","	 * @private","	 */","	_setGradientFill: function(fill) {","		var offset,","			opacity,","			color,","			stopNode,","            newStop,","			isNumber = Y_LANG.isNumber,","			graphic = this._graphic,","			type = fill.type, ","			gradientNode = graphic.getGradientNode(\"grad\" + this.get(\"id\"), type),","			stops = fill.stops,","			w = this.get(\"width\"),","			h = this.get(\"height\"),","			rotation = fill.rotation || 0,","			radCon = Math.PI/180,","            tanRadians = parseFloat(parseFloat(Math.tan(rotation * radCon)).toFixed(8)),","            i,","			len,","			def,","			stop,","			x1 = \"0%\", ","			x2 = \"100%\", ","			y1 = \"0%\", ","			y2 = \"0%\",","			cx = fill.cx,","			cy = fill.cy,","			fx = fill.fx,","			fy = fill.fy,","			r = fill.r,","            stopNodes = [];","		if(type == \"linear\")","		{","            cx = w/2;","            cy = h/2;","            if(Math.abs(tanRadians) * w/2 >= h/2)","            {","                if(rotation < 180)","                {","                    y1 = 0;","                    y2 = h;","                }","                else","                {","                    y1 = h;","                    y2 = 0;","                }","                x1 = cx - ((cy - y1)/tanRadians);","                x2 = cx - ((cy - y2)/tanRadians); ","            }","            else","            {","                if(rotation > 90 && rotation < 270)","                {","                    x1 = w;","                    x2 = 0;","                }","                else","                {","                    x1 = 0;","                    x2 = w;","                }","                y1 = ((tanRadians * (cx - x1)) - cy) * -1;","                y2 = ((tanRadians * (cx - x2)) - cy) * -1;","            }","","            x1 = Math.round(100 * x1/w);","            x2 = Math.round(100 * x2/w);","            y1 = Math.round(100 * y1/h);","            y2 = Math.round(100 * y2/h);","            ","            //Set default value if not valid ","            x1 = isNumber(x1) ? x1 : 0;","            x2 = isNumber(x2) ? x2 : 100;","            y1 = isNumber(y1) ? y1 : 0;","            y2 = isNumber(y2) ? y2 : 0;","            ","            gradientNode.setAttribute(\"spreadMethod\", \"pad\");","			gradientNode.setAttribute(\"width\", w);","			gradientNode.setAttribute(\"height\", h);","            gradientNode.setAttribute(\"x1\", x1 + \"%\");","            gradientNode.setAttribute(\"x2\", x2 + \"%\");","            gradientNode.setAttribute(\"y1\", y1 + \"%\");","            gradientNode.setAttribute(\"y2\", y2 + \"%\");","		}","		else","		{","			gradientNode.setAttribute(\"cx\", (cx * 100) + \"%\");","			gradientNode.setAttribute(\"cy\", (cy * 100) + \"%\");","			gradientNode.setAttribute(\"fx\", (fx * 100) + \"%\");","			gradientNode.setAttribute(\"fy\", (fy * 100) + \"%\");","			gradientNode.setAttribute(\"r\", (r * 100) + \"%\");","		}","		","		len = stops.length;","		def = 0;","        for(i = 0; i < len; ++i)","		{","            if(this._stops && this._stops.length > 0)","            {","                stopNode = this._stops.shift();","                newStop = false;","            }","            else","            {","			    stopNode = graphic._createGraphicNode(\"stop\");","                newStop = true;","            }","			stop = stops[i];","			opacity = stop.opacity;","			color = stop.color;","			offset = stop.offset || i/(len - 1);","			offset = Math.round(offset * 100) + \"%\";","			opacity = isNumber(opacity) ? opacity : 1;","			opacity = Math.max(0, Math.min(1, opacity));","			def = (i + 1) / len;","			stopNode.setAttribute(\"offset\", offset);","			stopNode.setAttribute(\"stop-color\", color);","			stopNode.setAttribute(\"stop-opacity\", opacity);","			if(newStop)","            {","                gradientNode.appendChild(stopNode);","            }","            stopNodes.push(stopNode);","		}","        while(this._stops && this._stops.length > 0)","        {","            gradientNode.removeChild(this._stops.shift());","        }","        this._stops = stopNodes;","	},","","    _stops: null,","","    /**","     * Sets the value of an attribute.","     *","     * @method set","     * @param {String|Object} name The name of the attribute. Alternatively, an object of key value pairs can ","     * be passed in to set multiple attributes at once.","     * @param {Any} value The value to set the attribute to. This value is ignored if an object is received as ","     * the name param.","     */","	set: function() ","	{","		var host = this;","		AttributeLite.prototype.set.apply(host, arguments);","		if(host.initialized)","		{","			host._updateHandler();","		}","	},","","	/**","	 * Specifies a 2d translation.","	 *","	 * @method translate","	 * @param {Number} x The value to transate on the x-axis.","	 * @param {Number} y The value to translate on the y-axis.","	 */","	translate: function(x, y)","	{","		this._addTransform(\"translate\", arguments);","	},","","	/**","	 * Translates the shape along the x-axis. When translating x and y coordinates,","	 * use the `translate` method.","	 *","	 * @method translateX","	 * @param {Number} x The value to translate.","	 */","	translateX: function(x)","    {","        this._addTransform(\"translateX\", arguments);","    },","","	/**","	 * Translates the shape along the y-axis. When translating x and y coordinates,","	 * use the `translate` method.","	 *","	 * @method translateY","	 * @param {Number} y The value to translate.","	 */","	translateY: function(y)","    {","        this._addTransform(\"translateY\", arguments);","    },","","    /**","     * Skews the shape around the x-axis and y-axis.","     *","     * @method skew","     * @param {Number} x The value to skew on the x-axis.","     * @param {Number} y The value to skew on the y-axis.","     */","    skew: function(x, y)","    {","        this._addTransform(\"skew\", arguments);","    },","","	/**","	 * Skews the shape around the x-axis.","	 *","	 * @method skewX","	 * @param {Number} x x-coordinate","	 */","	 skewX: function(x)","	 {","		this._addTransform(\"skewX\", arguments);","	 },","","	/**","	 * Skews the shape around the y-axis.","	 *","	 * @method skewY","	 * @param {Number} y y-coordinate","	 */","	 skewY: function(y)","	 {","		this._addTransform(\"skewY\", arguments);","	 },","","	/**","	 * Rotates the shape clockwise around it transformOrigin.","	 *","	 * @method rotate","	 * @param {Number} deg The degree of the rotation.","	 */","	 rotate: function(deg)","	 {","		this._addTransform(\"rotate\", arguments);","	 },","","	/**","	 * Specifies a 2d scaling operation.","	 *","	 * @method scale","	 * @param {Number} val","	 */","	scale: function(x, y)","	{","		this._addTransform(\"scale\", arguments);","	},","","    /**","     * Adds a transform to the shape.","     *","     * @method _addTransform","     * @param {String} type The transform being applied.","     * @param {Array} args The arguments for the transform.","	 * @private","	 */","	_addTransform: function(type, args)","	{","        args = Y.Array(args);","        this._transform = Y_LANG.trim(this._transform + \" \" + type + \"(\" + args.join(\", \") + \")\");","        args.unshift(type);","        this._transforms.push(args);","        if(this.initialized)","        {","            this._updateTransform();","        }","	},","","	/**","     * Applies all transforms.","     *","     * @method _updateTransform","	 * @private","	 */","	_updateTransform: function()","	{","		var isPath = this._type == \"path\",","		    node = this.node,","			key,","			transform,","			transformOrigin,","			x,","			y,","            tx,","            ty,","            matrix = this.matrix,","            normalizedMatrix = this._normalizedMatrix,","            i = 0,","            len = this._transforms.length;","","        if(isPath || (this._transforms && this._transforms.length > 0))","		{","            x = this._x;","            y = this._y;","            transformOrigin = this.get(\"transformOrigin\");","            tx = x + (transformOrigin[0] * this.get(\"width\"));","            ty = y + (transformOrigin[1] * this.get(\"height\")); ","            //need to use translate for x/y coords","            if(isPath)","            {","                //adjust origin for custom shapes ","                if(!(this instanceof Y.SVGPath))","                {","                    tx = this._left + (transformOrigin[0] * this.get(\"width\"));","                    ty = this._top + (transformOrigin[1] * this.get(\"height\"));","                }","                normalizedMatrix.init({dx: x + this._left, dy: y + this._top});","            }","            normalizedMatrix.translate(tx, ty);","            for(; i < len; ++i)","            {","                key = this._transforms[i].shift();","                if(key)","                {","                    normalizedMatrix[key].apply(normalizedMatrix, this._transforms[i]);","                    matrix[key].apply(matrix, this._transforms[i]); ","                }","                if(isPath)","                {","                    this._transforms[i].unshift(key);","                }","			}","            normalizedMatrix.translate(-tx, -ty);","            transform = \"matrix(\" + normalizedMatrix.a + \",\" + ","                            normalizedMatrix.b + \",\" + ","                            normalizedMatrix.c + \",\" + ","                            normalizedMatrix.d + \",\" + ","                            normalizedMatrix.dx + \",\" +","                            normalizedMatrix.dy + \")\";","		}","        this._graphic.addToRedrawQueue(this);    ","        if(transform)","		{","            node.setAttribute(\"transform\", transform);","        }","        if(!isPath)","        {","            this._transforms = [];","        }","	},","","	/**","	 * Draws the shape.","	 *","	 * @method _draw","	 * @private","	 */","	_draw: function()","	{","		var node = this.node;","		node.setAttribute(\"width\", this.get(\"width\"));","		node.setAttribute(\"height\", this.get(\"height\"));","		node.setAttribute(\"x\", this._x);","		node.setAttribute(\"y\", this._y);","		node.style.left = this._x + \"px\";","		node.style.top = this._y + \"px\";","		this._fillChangeHandler();","		this._strokeChangeHandler();","		this._updateTransform();","	},","","	/**","     * Updates `Shape` based on attribute changes.","     *","     * @method _updateHandler","	 * @private","	 */","	_updateHandler: function(e)","	{","		this._draw();","	},","    ","    /**","     * Storage for the transform attribute.","     *","     * @property _transform","     * @type String","     * @private","     */","    _transform: \"\",","","	/**","	 * Returns the bounds for a shape.","	 *","     * Calculates the a new bounding box from the original corner coordinates (base on size and position) and the transform matrix.","     * The calculated bounding box is used by the graphic instance to calculate its viewBox. ","     *","	 * @method getBounds","	 * @return Object","	 */","	getBounds: function()","	{","		var type = this._type,","			stroke = this.get(\"stroke\"),","            w = this.get(\"width\"),","			h = this.get(\"height\"),","			x = type == \"path\" ? 0 : this._x,","			y = type == \"path\" ? 0 : this._y,","            wt = 0;","        if(type != \"path\")","        {","            if(stroke && stroke.weight)","            {","                wt = stroke.weight;","            }","            w = (x + w + wt) - (x - wt); ","            h = (y + h + wt) - (y - wt);","            x -= wt;","            y -= wt;","        }","		return this._normalizedMatrix.getContentRect(w, h, x, y);","	},","","    /**","     * Places the shape above all other shapes.","     *","     * @method toFront","     */","    toFront: function()","    {","        var graphic = this.get(\"graphic\");","        if(graphic)","        {","            graphic._toFront(this);","        }","    },","","    /**","     * Places the shape underneath all other shapes.","     *","     * @method toFront","     */","    toBack: function()","    {","        var graphic = this.get(\"graphic\");","        if(graphic)","        {","            graphic._toBack(this);","        }","    },","","    /**","     * Parses path data string and call mapped methods.","     *","     * @method _parsePathData","     * @param {String} val The path data","     * @private","     */","    _parsePathData: function(val)","    {","        var method,","            methodSymbol,","            args,","            commandArray = Y.Lang.trim(val.match(SPLITPATHPATTERN)),","            i = 0,","            len, ","            str,","            symbolToMethod = this._pathSymbolToMethod;","        if(commandArray)","        {","            this.clear();","            len = commandArray.length || 0;","            for(; i < len; i = i + 1)","            {","                str = commandArray[i];","                methodSymbol = str.substr(0, 1),","                args = str.substr(1).match(SPLITARGSPATTERN);","                method = symbolToMethod[methodSymbol];","                if(method)","                {","                    if(args)","                    {","                        this[method].apply(this, args);","                    }","                    else","                    {","                        this[method].apply(this);","                    }","                }","            }","            this.end();","        }","    },","","    /**","     * Destroys the shape instance.","     *","     * @method destroy","     */","    destroy: function()","    {","        var graphic = this.get(\"graphic\");","        if(graphic)","        {","            graphic.removeShape(this);","        }","        else","        {","            this._destroy();","        }","    },","","    /**","     *  Implementation for shape destruction","     *","     *  @method destroy","     *  @protected","     */","    _destroy: function()","    {","        if(this.node)","        {","            Y.Event.purgeElement(this.node, true);","            if(this.node.parentNode)","            {","                this.node.parentNode.removeChild(this.node);","            }","            this.node = null;","        }","    }"," }, Y.SVGDrawing.prototype));","	","SVGShape.ATTRS = {","	/**","	 * An array of x, y values which indicates the transformOrigin in which to rotate the shape. Valid values range between 0 and 1 representing a ","	 * fraction of the shape's corresponding bounding box dimension. The default value is [0.5, 0.5].","	 *","	 * @config transformOrigin","	 * @type Array","	 */","	transformOrigin: {","		valueFn: function()","		{","			return [0.5, 0.5];","		}","	},","	","    /**","     * <p>A string containing, in order, transform operations applied to the shape instance. The `transform` string can contain the following values:","     *     ","     *    <dl>","     *        <dt>rotate</dt><dd>Rotates the shape clockwise around it transformOrigin.</dd>","     *        <dt>translate</dt><dd>Specifies a 2d translation.</dd>","     *        <dt>skew</dt><dd>Skews the shape around the x-axis and y-axis.</dd>","     *        <dt>scale</dt><dd>Specifies a 2d scaling operation.</dd>","     *        <dt>translateX</dt><dd>Translates the shape along the x-axis.</dd>","     *        <dt>translateY</dt><dd>Translates the shape along the y-axis.</dd>","     *        <dt>skewX</dt><dd>Skews the shape around the x-axis.</dd>","     *        <dt>skewY</dt><dd>Skews the shape around the y-axis.</dd>","     *        <dt>matrix</dt><dd>Specifies a 2D transformation matrix comprised of the specified six values.</dd>      ","     *    </dl>","     * </p>","     * <p>Applying transforms through the transform attribute will reset the transform matrix and apply a new transform. The shape class also contains corresponding methods for each transform","     * that will apply the transform to the current matrix. The below code illustrates how you might use the `transform` attribute to instantiate a recangle with a rotation of 45 degrees.</p>","            var myRect = new Y.Rect({","                type:\"rect\",","                width: 50,","                height: 40,","                transform: \"rotate(45)\"","            };","     * <p>The code below would apply `translate` and `rotate` to an existing shape.</p>","    ","        myRect.set(\"transform\", \"translate(40, 50) rotate(45)\");","	 * @config transform","     * @type String  ","	 */","	transform: {","		setter: function(val)","        {","            this.matrix.init();	","            this._normalizedMatrix.init();","		    this._transforms = this.matrix.getTransformArray(val);","            this._transform = val;","            return val;","		},","","        getter: function()","        {","            return this._transform;","        }","	},","","	/**","	 * Unique id for class instance.","	 *","	 * @config id","	 * @type String","	 */","	id: {","		valueFn: function()","		{","			return Y.guid();","		},","","		setter: function(val)","		{","			var node = this.node;","			if(node)","			{","				node.setAttribute(\"id\", val);","			}","			return val;","		}","	},","","	/**","	 * Indicates the x position of shape.","	 *","	 * @config x","	 * @type Number","	 */","	x: {","	    getter: function()","        {","            return this._x;","        },","","        setter: function(val)","        {","            var transform = this.get(\"transform\");","            this._x = val;","            if(transform) ","            {","                this.set(\"transform\", transform);","            }","        }","	},","","	/**","	 * Indicates the y position of shape.","	 *","	 * @config y","	 * @type Number","	 */","	y: {","	    getter: function()","        {","            return this._y;","        },","","        setter: function(val)","        {","            var transform = this.get(\"transform\");","            this._y = val;","            if(transform) ","            {","                this.set(\"transform\", transform);","            }","        }","	},","","	/**","	 * Indicates the width of the shape","	 *","	 * @config width","	 * @type Number","	 */","	width: {","        value: 0","    },","","	/**","	 * Indicates the height of the shape","	 * ","	 * @config height","	 * @type Number","	 */","	height: {","        value: 0","    },","","	/**","	 * Indicates whether the shape is visible.","	 *","	 * @config visible","	 * @type Boolean","	 */","	visible: {","		value: true,","","		setter: function(val){","			var visibility = val ? \"visible\" : \"hidden\";","			if(this.node)","            {","                this.node.style.visibility = visibility;","            }","			return val;","		}","	},","","	/**","	 * Contains information about the fill of the shape. ","     *  <dl>","     *      <dt>color</dt><dd>The color of the fill.</dd>","     *      <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the fill. The default value is 1.</dd>","     *      <dt>type</dt><dd>Type of fill.","     *          <dl>","     *              <dt>solid</dt><dd>Solid single color fill. (default)</dd>","     *              <dt>linear</dt><dd>Linear gradient fill.</dd>","     *              <dt>radial</dt><dd>Radial gradient fill.</dd>","     *          </dl>","     *      </dd>","     *  </dl>","     *  <p>If a `linear` or `radial` is specified as the fill type. The following additional property is used:","     *  <dl>","     *      <dt>stops</dt><dd>An array of objects containing the following properties:","     *          <dl>","     *              <dt>color</dt><dd>The color of the stop.</dd>","     *              <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the stop. The default value is 1. Note: No effect for IE 6 - 8</dd>","     *              <dt>offset</dt><dd>Number between 0 and 1 indicating where the color stop is positioned.</dd> ","     *          </dl>","     *      </dd>","     *      <p>Linear gradients also have the following property:</p>","     *      <dt>rotation</dt><dd>Linear gradients flow left to right by default. The rotation property allows you to change the flow by rotation. (e.g. A rotation of 180 would make the gradient pain from right to left.)</dd>","     *      <p>Radial gradients have the following additional properties:</p>","     *      <dt>r</dt><dd>Radius of the gradient circle.</dd>","     *      <dt>fx</dt><dd>Focal point x-coordinate of the gradient.</dd>","     *      <dt>fy</dt><dd>Focal point y-coordinate of the gradient.</dd>","     *      <dt>cx</dt><dd>","     *          <p>The x-coordinate of the center of the gradient circle. Determines where the color stop begins. The default value 0.5.</p>","     *          <p><strong>Note: </strong>Currently, this property is not implemented for corresponding `CanvasShape` and `VMLShape` classes which are used on Android or IE 6 - 8.</p>","     *      </dd>","     *      <dt>cy</dt><dd>","     *          <p>The y-coordinate of the center of the gradient circle. Determines where the color stop begins. The default value 0.5.</p>","     *          <p><strong>Note: </strong>Currently, this property is not implemented for corresponding `CanvasShape` and `VMLShape` classes which are used on Android or IE 6 - 8.</p>","     *      </dd>","     *  </dl>","	 *","	 * @config fill","	 * @type Object ","	 */","	fill: {","		valueFn: \"_getDefaultFill\",","		","		setter: function(val)","		{","			var fill,","				tmpl = this.get(\"fill\") || this._getDefaultFill();","			fill = (val) ? Y.merge(tmpl, val) : null;","			if(fill && fill.color)","			{","				if(fill.color === undefined || fill.color == \"none\")","				{","					fill.color = null;","				}","			}","			return fill;","		}","	},","","	/**","	 * Contains information about the stroke of the shape.","     *  <dl>","     *      <dt>color</dt><dd>The color of the stroke.</dd>","     *      <dt>weight</dt><dd>Number that indicates the width of the stroke.</dd>","     *      <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the stroke. The default value is 1.</dd>","     *      <dt>dashstyle</dt>Indicates whether to draw a dashed stroke. When set to \"none\", a solid stroke is drawn. When set to an array, the first index indicates the","     *  length of the dash. The second index indicates the length of gap.","     *      <dt>linecap</dt><dd>Specifies the linecap for the stroke. The following values can be specified:","     *          <dl>","     *              <dt>butt (default)</dt><dd>Specifies a butt linecap.</dd>","     *              <dt>square</dt><dd>Specifies a sqare linecap.</dd>","     *              <dt>round</dt><dd>Specifies a round linecap.</dd>","     *          </dl>","     *      </dd>","     *      <dt>linejoin</dt><dd>Specifies a linejoin for the stroke. The following values can be specified:","     *          <dl>","     *              <dt>round (default)</dt><dd>Specifies that the linejoin will be round.</dd>","     *              <dt>bevel</dt><dd>Specifies a bevel for the linejoin.</dd>","     *              <dt>miter limit</dt><dd>An integer specifying the miter limit of a miter linejoin. If you want to specify a linejoin of miter, you simply specify the limit as opposed to having","     *  separate miter and miter limit values.</dd>","     *          </dl>","     *      </dd>","     *  </dl>","	 *","	 * @config stroke","	 * @type Object","	 */","	stroke: {","		valueFn: \"_getDefaultStroke\",","","		setter: function(val)","		{","			var tmpl = this.get(\"stroke\") || this._getDefaultStroke(),","                wt;","            if(val && val.hasOwnProperty(\"weight\"))","            {","                wt = parseInt(val.weight, 10);","                if(!isNaN(wt))","                {","                    val.weight = wt;","                }","            }","            return (val) ? Y.merge(tmpl, val) : null;","		}","	},","	","	// Only implemented in SVG","	// Determines whether the instance will receive mouse events.","	// ","	// @config pointerEvents","	// @type string","	//","	pointerEvents: {","		valueFn: function() ","		{","			var val = \"visiblePainted\",","				node = this.node;","			if(node)","			{","				node.setAttribute(\"pointer-events\", val);","			}","			return val;","		},","","		setter: function(val)","		{","			var node = this.node;","			if(node)","			{","				node.setAttribute(\"pointer-events\", val);","			}","			return val;","		}","	},","","	/**","	 * Dom node for the shape.","	 *","	 * @config node","	 * @type HTMLElement","	 * @readOnly","	 */","	node: {","		readOnly: true,","","		getter: function()","		{","			return this.node;","		}","	},","","    /**","     * Represents an SVG Path string.","     *","     * @config data","     * @type String","     */","    data: {","        setter: function(val)","        {","            if(this.get(\"node\"))","            {","                this._parsePathData(val);","            }","            return val;","        }","    },","","	/**","	 * Reference to the parent graphic instance","	 *","	 * @config graphic","	 * @type SVGGraphic","	 * @readOnly","	 */","	graphic: {","		readOnly: true,","","		getter: function()","		{","			return this._graphic;","		}","	}","};","Y.SVGShape = SVGShape;","","/**"," * <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> implementation of the <a href=\"Path.html\">`Path`</a> class. "," * `SVGPath` is not intended to be used directly. Instead, use the <a href=\"Path.html\">`Path`</a> class. "," * If the browser has <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities, the <a href=\"Path.html\">`Path`</a> "," * class will point to the `SVGPath` class."," *"," * @module graphics"," * @class SVGPath"," * @extends SVGShape"," * @constructor"," */","SVGPath = function(cfg)","{","	SVGPath.superclass.constructor.apply(this, arguments);","};","SVGPath.NAME = \"path\";","Y.extend(SVGPath, Y.SVGShape, {","    /**","     * Left edge of the path","     *","     * @property _left","     * @type Number","     * @private","     */","    _left: 0,","","    /**","     * Right edge of the path","     *","     * @property _right","     * @type Number","     * @private","     */","    _right: 0,","    ","    /**","     * Top edge of the path","     *","     * @property _top","     * @type Number","     * @private","     */","    _top: 0, ","    ","    /**","     * Bottom edge of the path","     *","     * @property _bottom","     * @type Number","     * @private","     */","    _bottom: 0,","","    /**","     * Indicates the type of shape","     *","     * @property _type","     * @readOnly","     * @type String","     * @private","     */","    _type: \"path\",","","    /**","     * Storage for path","     *","     * @property _path","     * @type String","     * @private","     */","	_path: \"\"","});","","SVGPath.ATTRS = Y.merge(Y.SVGShape.ATTRS, {","	/**","	 * Indicates the path used for the node.","	 *","	 * @config path","	 * @type String","     * @readOnly","	 */","	path: {","		readOnly: true,","","		getter: function()","		{","			return this._path;","		}","	},","","	/**","	 * Indicates the width of the shape","	 * ","	 * @config width","	 * @type Number","	 */","	width: {","		getter: function()","		{","			var val = Math.max(this._right - this._left, 0);","			return val;","		}","	},","","	/**","	 * Indicates the height of the shape","	 * ","	 * @config height","	 * @type Number","	 */","	height: {","		getter: function()","		{","			return Math.max(this._bottom - this._top, 0);","		}","	}","});","Y.SVGPath = SVGPath;","/**"," * <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> implementation of the <a href=\"Rect.html\">`Rect`</a> class. "," * `SVGRect` is not intended to be used directly. Instead, use the <a href=\"Rect.html\">`Rect`</a> class. "," * If the browser has <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities, the <a href=\"Rect.html\">`Rect`</a> "," * class will point to the `SVGRect` class."," *"," * @module graphics"," * @class SVGRect"," * @constructor"," */","SVGRect = function()","{","	SVGRect.superclass.constructor.apply(this, arguments);","};","SVGRect.NAME = \"rect\";","Y.extend(SVGRect, Y.SVGShape, {","    /**","     * Indicates the type of shape","     *","     * @property _type","     * @type String","     * @private","     */","    _type: \"rect\""," });","SVGRect.ATTRS = Y.SVGShape.ATTRS;","Y.SVGRect = SVGRect;","/**"," * <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> implementation of the <a href=\"Ellipse.html\">`Ellipse`</a> class. "," * `SVGEllipse` is not intended to be used directly. Instead, use the <a href=\"Ellipse.html\">`Ellipse`</a> class. "," * If the browser has <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities, the <a href=\"Ellipse.html\">`Ellipse`</a> "," * class will point to the `SVGEllipse` class."," *"," * @module graphics"," * @class SVGEllipse"," * @constructor"," */","SVGEllipse = function(cfg)","{","	SVGEllipse.superclass.constructor.apply(this, arguments);","};","","SVGEllipse.NAME = \"ellipse\";","","Y.extend(SVGEllipse, SVGShape, {","	/**","	 * Indicates the type of shape","	 *","	 * @property _type","	 * @type String","     * @private","	 */","	_type: \"ellipse\",","","	/**","	 * Updates the shape.","	 *","	 * @method _draw","	 * @private","	 */","	_draw: function()","	{","		var node = this.node,","			w = this.get(\"width\"),","			h = this.get(\"height\"),","			x = this.get(\"x\"),","			y = this.get(\"y\"),","			xRadius = w * 0.5,","			yRadius = h * 0.5,","			cx = x + xRadius,","			cy = y + yRadius;","		node.setAttribute(\"rx\", xRadius);","		node.setAttribute(\"ry\", yRadius);","		node.setAttribute(\"cx\", cx);","		node.setAttribute(\"cy\", cy);","		this._fillChangeHandler();","		this._strokeChangeHandler();","		this._updateTransform();","	}","});","","SVGEllipse.ATTRS = Y.merge(SVGShape.ATTRS, {","	/**","	 * Horizontal radius for the ellipse. ","	 *","	 * @config xRadius","	 * @type Number","	 */","	xRadius: {","		setter: function(val)","		{","			this.set(\"width\", val * 2);","		},","","		getter: function()","		{","			var val = this.get(\"width\");","			if(val) ","			{","				val *= 0.5;","			}","			return val;","		}","	},","","	/**","	 * Vertical radius for the ellipse. ","	 *","	 * @config yRadius","	 * @type Number","	 * @readOnly","	 */","	yRadius: {","		setter: function(val)","		{","			this.set(\"height\", val * 2);","		},","","		getter: function()","		{","			var val = this.get(\"height\");","			if(val) ","			{","				val *= 0.5;","			}","			return val;","		}","	}","});","Y.SVGEllipse = SVGEllipse;","/**"," * <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> implementation of the <a href=\"Circle.html\">`Circle`</a> class. "," * `SVGCircle` is not intended to be used directly. Instead, use the <a href=\"Circle.html\">`Circle`</a> class. "," * If the browser has <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities, the <a href=\"Circle.html\">`Circle`</a> "," * class will point to the `SVGCircle` class."," *"," * @module graphics"," * @class SVGCircle"," * @constructor"," */"," SVGCircle = function(cfg)"," {","    SVGCircle.superclass.constructor.apply(this, arguments);"," };","    "," SVGCircle.NAME = \"circle\";",""," Y.extend(SVGCircle, Y.SVGShape, {    ","    ","    /**","     * Indicates the type of shape","     *","     * @property _type","     * @type String","     * @private","     */","    _type: \"circle\",","","    /**","     * Updates the shape.","     *","     * @method _draw","     * @private","     */","    _draw: function()","    {","        var node = this.node,","            x = this.get(\"x\"),","            y = this.get(\"y\"),","            radius = this.get(\"radius\"),","            cx = x + radius,","            cy = y + radius;","        node.setAttribute(\"r\", radius);","        node.setAttribute(\"cx\", cx);","        node.setAttribute(\"cy\", cy);","        this._fillChangeHandler();","        this._strokeChangeHandler();","        this._updateTransform();","    }"," });","    ","SVGCircle.ATTRS = Y.merge(Y.SVGShape.ATTRS, {","	/**","	 * Indicates the width of the shape","	 *","	 * @config width","	 * @type Number","	 */","    width: {","        setter: function(val)","        {","            this.set(\"radius\", val/2);","            return val;","        },","","        getter: function()","        {","            return this.get(\"radius\") * 2;","        }","    },","","	/**","	 * Indicates the height of the shape","	 *","	 * @config height","	 * @type Number","	 */","    height: {","        setter: function(val)","        {","            this.set(\"radius\", val/2);","            return val;","        },","","        getter: function()","        {","            return this.get(\"radius\") * 2;","        }","    },","","    /**","     * Radius of the circle","     *","     * @config radius","     * @type Number","     */","    radius: {","        value: 0","    }","});","Y.SVGCircle = SVGCircle;","/**"," * Draws pie slices"," *"," * @module graphics"," * @class SVGPieSlice"," * @constructor"," */","SVGPieSlice = function()","{","	SVGPieSlice.superclass.constructor.apply(this, arguments);","};","SVGPieSlice.NAME = \"svgPieSlice\";","Y.extend(SVGPieSlice, Y.SVGShape, Y.mix({","    /**","     * Indicates the type of shape","     *","     * @property _type","     * @type String","     * @private","     */","    _type: \"path\",","","	/**","	 * Change event listener","	 *","	 * @private","	 * @method _updateHandler","	 */","	_draw: function(e)","	{","        var x = this.get(\"cx\"),","            y = this.get(\"cy\"),","            startAngle = this.get(\"startAngle\"),","            arc = this.get(\"arc\"),","            radius = this.get(\"radius\");","        this.clear();","        this.drawWedge(x, y, startAngle, arc, radius);","		this.end();","	}"," }, Y.SVGDrawing.prototype));","SVGPieSlice.ATTRS = Y.mix({","    cx: {","        value: 0","    },","","    cy: {","        value: 0","    },","    /**","     * Starting angle in relation to a circle in which to begin the pie slice drawing.","     *","     * @config startAngle","     * @type Number","     */","    startAngle: {","        value: 0","    },","","    /**","     * Arc of the slice.","     *","     * @config arc","     * @type Number","     */","    arc: {","        value: 0","    },","","    /**","     * Radius of the circle in which the pie slice is drawn","     *","     * @config radius","     * @type Number","     */","    radius: {","        value: 0","    }","}, Y.SVGShape.ATTRS);","Y.SVGPieSlice = SVGPieSlice;","/**"," * <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> implementation of the <a href=\"Graphic.html\">`Graphic`</a> class. "," * `SVGGraphic` is not intended to be used directly. Instead, use the <a href=\"Graphic.html\">`Graphic`</a> class. "," * If the browser has <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities, the <a href=\"Graphic.html\">`Graphic`</a> "," * class will point to the `SVGGraphic` class."," *"," * @module graphics"," * @class SVGGraphic"," * @constructor"," */","SVGGraphic = function(cfg) {","    SVGGraphic.superclass.constructor.apply(this, arguments);","};","","SVGGraphic.NAME = \"svgGraphic\";","","SVGGraphic.ATTRS = {","    /**","     * Whether or not to render the `Graphic` automatically after to a specified parent node after init. This can be a Node instance or a CSS selector string.","     * ","     * @config render","     * @type Node | String ","     */","    render: {},","	","    /**","	 * Unique id for class instance.","	 *","	 * @config id","	 * @type String","	 */","	id: {","		valueFn: function()","		{","			return Y.guid();","		},","","		setter: function(val)","		{","			var node = this._node;","			if(node)","			{","				node.setAttribute(\"id\", val);","			}","			return val;","		}","	},","","    /**","     * Key value pairs in which a shape instance is associated with its id.","     *","     *  @config shapes","     *  @type Object","     *  @readOnly","     */","    shapes: {","        readOnly: true,","","        getter: function()","        {","            return this._shapes;","        }","    },","","    /**","     *  Object containing size and coordinate data for the content of a Graphic in relation to the coordSpace node.","     *","     *  @config contentBounds","     *  @type Object ","     *  @readOnly","     */","    contentBounds: {","        readOnly: true,","","        getter: function()","        {","            return this._contentBounds;","        }","    },","","    /**","     *  The html element that represents to coordinate system of the Graphic instance.","     *","     *  @config node","     *  @type HTMLElement","     *  @readOnly","     */","    node: {","        readOnly: true,","","        getter: function()","        {","            return this._node;","        }","    },","    ","	/**","	 * Indicates the width of the `Graphic`. ","	 *","	 * @config width","	 * @type Number","	 */","    width: {","        setter: function(val)","        {","            if(this._node)","            {","                this._node.style.width = val + \"px\";","            }","            return val; ","        }","    },","","	/**","	 * Indicates the height of the `Graphic`. ","	 *","	 * @config height ","	 * @type Number","	 */","    height: {","        setter: function(val)","        {","            if(this._node)","            {","                this._node.style.height = val  + \"px\";","            }","            return val;","        }","    },","","    /**","     *  Determines the sizing of the Graphic. ","     *","     *  <dl>","     *      <dt>sizeContentToGraphic</dt><dd>The Graphic's width and height attributes are, either explicitly set through the <code>width</code> and <code>height</code>","     *      attributes or are determined by the dimensions of the parent element. The content contained in the Graphic will be sized to fit with in the Graphic instance's ","     *      dimensions. When using this setting, the <code>preserveAspectRatio</code> attribute will determine how the contents are sized.</dd>","     *      <dt>sizeGraphicToContent</dt><dd>(Also accepts a value of true) The Graphic's width and height are determined by the size and positioning of the content.</dd>","     *      <dt>false</dt><dd>The Graphic's width and height attributes are, either explicitly set through the <code>width</code> and <code>height</code>","     *      attributes or are determined by the dimensions of the parent element. The contents of the Graphic instance are not affected by this setting.</dd>","     *  </dl>","     *","     *","     *  @config autoSize","     *  @type Boolean | String","     *  @default false","     */","    autoSize: {","        value: false","    },","    ","    /**","     * Determines how content is sized when <code>autoSize</code> is set to <code>sizeContentToGraphic</code>.","     *","     *  <dl>","     *      <dt>none<dt><dd>Do not force uniform scaling. Scale the graphic content of the given element non-uniformly if necessary ","     *      such that the element's bounding box exactly matches the viewport rectangle.</dd>","     *      <dt>xMinYMin</dt><dd>Force uniform scaling position along the top left of the Graphic's node.</dd>","     *      <dt>xMidYMin</dt><dd>Force uniform scaling horizontally centered and positioned at the top of the Graphic's node.<dd>","     *      <dt>xMaxYMin</dt><dd>Force uniform scaling positioned horizontally from the right and vertically from the top.</dd>","     *      <dt>xMinYMid</dt>Force uniform scaling positioned horizontally from the left and vertically centered.</dd>","     *      <dt>xMidYMid (the default)</dt><dd>Force uniform scaling with the content centered.</dd>","     *      <dt>xMaxYMid</dt><dd>Force uniform scaling positioned horizontally from the right and vertically centered.</dd>","     *      <dt>xMinYMax</dt><dd>Force uniform scaling positioned horizontally from the left and vertically from the bottom.</dd>","     *      <dt>xMidYMax</dt><dd>Force uniform scaling horizontally centered and position vertically from the bottom.</dd>","     *      <dt>xMaxYMax</dt><dd>Force uniform scaling positioned horizontally from the right and vertically from the bottom.</dd>","     *  </dl>","     * ","     * @config preserveAspectRatio","     * @type String","     * @default xMidYMid","     */","    preserveAspectRatio: {","        value: \"xMidYMid\"","    },","    ","    /**","     * The contentBounds will resize to greater values but not to smaller values. (for performance)","     * When resizing the contentBounds down is desirable, set the resizeDown value to true.","     *","     * @config resizeDown ","     * @type Boolean","     */","    resizeDown: {","        value: false","    },","","	/**","	 * Indicates the x-coordinate for the instance.","	 *","	 * @config x","	 * @type Number","	 */","    x: {","        getter: function()","        {","            return this._x;","        },","","        setter: function(val)","        {","            this._x = val;","            if(this._node)","            {","                this._node.style.left = val + \"px\";","            }","            return val;","        }","    },","","	/**","	 * Indicates the y-coordinate for the instance.","	 *","	 * @config y","	 * @type Number","	 */","    y: {","        getter: function()","        {","            return this._y;","        },","","        setter: function(val)","        {","            this._y = val;","            if(this._node)","            {","                this._node.style.top = val + \"px\";","            }","            return val;","        }","    },","","    /**","     * Indicates whether or not the instance will automatically redraw after a change is made to a shape.","     * This property will get set to false when batching operations.","     *","     * @config autoDraw","     * @type Boolean","     * @default true","     * @private","     */","    autoDraw: {","        value: true","    },","    ","    visible: {","        value: true,","","        setter: function(val)","        {","            this._toggleVisible(val);","            return val;","        }","    },","","    //","    //  Indicates the pointer-events setting for the svg:svg element.","    //","    //  @config pointerEvents","    //  @type String","    //","    pointerEvents: {","        value: \"none\"","    }","};","","Y.extend(SVGGraphic, Y.GraphicBase, {","    /**","     * Sets the value of an attribute.","     *","     * @method set","     * @param {String|Object} name The name of the attribute. Alternatively, an object of key value pairs can ","     * be passed in to set multiple attributes at once.","     * @param {Any} value The value to set the attribute to. This value is ignored if an object is received as ","     * the name param.","     */","	set: function(attr, value) ","	{","		var host = this,","            redrawAttrs = {","                autoDraw: true,","                autoSize: true,","                preserveAspectRatio: true,","                resizeDown: true","            },","            key,","            forceRedraw = false;","		AttributeLite.prototype.set.apply(host, arguments);	","        if(host._state.autoDraw === true && Y.Object.size(this._shapes) > 0)","        {","            if(Y_LANG.isString && redrawAttrs[attr])","            {","                forceRedraw = true;","            }","            else if(Y_LANG.isObject(attr))","            {","                for(key in redrawAttrs)","                {","                    if(redrawAttrs.hasOwnProperty(key) && attr[key])","                    {","                        forceRedraw = true;","                        break;","                    }","                }","            }","        }","        if(forceRedraw)","        {","            host._redraw();","        }","	},","","    /**","     * Storage for `x` attribute.","     *","     * @property _x","     * @type Number","     * @private","     */","    _x: 0,","","    /**","     * Storage for `y` attribute.","     *","     * @property _y","     * @type Number","     * @private","     */","    _y: 0,","","    /**","     * Gets the current position of the graphic instance in page coordinates.","     *","     * @method getXY","     * @return Array The XY position of the shape.","     */","    getXY: function()","    {","        var node = Y.one(this._node),","            xy;","        if(node)","        {","            xy = node.getXY();","        }","        return xy;","    },","","    /**","     * Initializes the class.","     *","     * @method initializer","     * @private","     */","    initializer: function() {","        var render = this.get(\"render\"),","            visibility = this.get(\"visible\") ? \"visible\" : \"hidden\";","        this._shapes = {};","		this._contentBounds = {","            left: 0,","            top: 0,","            right: 0,","            bottom: 0","        };","        this._gradients = {};","        this._node = DOCUMENT.createElement('div');","        this._node.style.position = \"absolute\";","        this._node.style.left = this.get(\"x\") + \"px\";","        this._node.style.top = this.get(\"y\") + \"px\";","        this._node.style.visibility = visibility;","        this._contentNode = this._createGraphics();","        this._contentNode.style.visibility = visibility;","        this._contentNode.setAttribute(\"id\", this.get(\"id\"));","        this._node.appendChild(this._contentNode);","        if(render)","        {","            this.render(render);","        }","    },","","    /**","     * Adds the graphics node to the dom.","     * ","     * @method render","     * @param {HTMLElement} parentNode node in which to render the graphics node into.","     */","    render: function(render) {","        var parentNode = Y.one(render),","            w = this.get(\"width\") || parseInt(parentNode.getComputedStyle(\"width\"), 10),","            h = this.get(\"height\") || parseInt(parentNode.getComputedStyle(\"height\"), 10);","        parentNode = parentNode || Y.one(DOCUMENT.body);","        parentNode.append(this._node);","        this.parentNode = parentNode;","        this.set(\"width\", w);","        this.set(\"height\", h);","        return this;","    },","","    /**","     * Removes all nodes.","     *","     * @method destroy","     */","    destroy: function()","    {","        this.removeAllShapes();","        if(this._contentNode)","        {","            this._removeChildren(this._contentNode);","            if(this._contentNode.parentNode)","            {","                this._contentNode.parentNode.removeChild(this._contentNode);","            }","            this._contentNode = null;","        }","        if(this._node)","        {","            this._removeChildren(this._node);","            Y.one(this._node).remove(true);","            this._node = null;","        }","    },","","    /**","     * Generates a shape instance by type.","     *","     * @method addShape","     * @param {Object} cfg attributes for the shape","     * @return Shape","     */","    addShape: function(cfg)","    {","        cfg.graphic = this;","        if(!this.get(\"visible\"))","        {","            cfg.visible = false;","        }","        var shapeClass = this._getShapeClass(cfg.type),","            shape = new shapeClass(cfg);","        this._appendShape(shape);","        return shape;","    },","","    /**","     * Adds a shape instance to the graphic instance.","     *","     * @method _appendShape","     * @param {Shape} shape The shape instance to be added to the graphic.","     * @private","     */","    _appendShape: function(shape)","    {","        var node = shape.node,","            parentNode = this._frag || this._contentNode;","        if(this.get(\"autoDraw\")) ","        {","            parentNode.appendChild(node);","        }","        else","        {","            this._getDocFrag().appendChild(node);","        }","    },","","    /**","     * Removes a shape instance from from the graphic instance.","     *","     * @method removeShape","     * @param {Shape|String} shape The instance or id of the shape to be removed.","     */","    removeShape: function(shape)","    {","        if(!(shape instanceof SVGShape))","        {","            if(Y_LANG.isString(shape))","            {","                shape = this._shapes[shape];","            }","        }","        if(shape && shape instanceof SVGShape)","        {","            shape._destroy();","            delete this._shapes[shape.get(\"id\")];","        }","        if(this.get(\"autoDraw\")) ","        {","            this._redraw();","        }","        return shape;","    },","","    /**","     * Removes all shape instances from the dom.","     *","     * @method removeAllShapes","     */","    removeAllShapes: function()","    {","        var shapes = this._shapes,","            i;","        for(i in shapes)","        {","            if(shapes.hasOwnProperty(i))","            {","                shapes[i]._destroy();","            }","        }","        this._shapes = {};","    },","    ","    /**","     * Removes all child nodes.","     *","     * @method _removeChildren","     * @param {HTMLElement} node","     * @private","     */","    _removeChildren: function(node)","    {","        if(node.hasChildNodes())","        {","            var child;","            while(node.firstChild)","            {","                child = node.firstChild;","                this._removeChildren(child);","                node.removeChild(child);","            }","        }","    },","","    /**","     * Clears the graphics object.","     *","     * @method clear","     */","    clear: function() {","        this.removeAllShapes();","    },","","    /**","     * Toggles visibility","     *","     * @method _toggleVisible","     * @param {Boolean} val indicates visibilitye","     * @private","     */","    _toggleVisible: function(val)","    {","        var i,","            shapes = this._shapes,","            visibility = val ? \"visible\" : \"hidden\";","        if(shapes)","        {","            for(i in shapes)","            {","                if(shapes.hasOwnProperty(i))","                {","                    shapes[i].set(\"visible\", val);","                }","            }","        }","        if(this._contentNode)","        {","            this._contentNode.style.visibility = visibility;","        }","        if(this._node)","        {","            this._node.style.visibility = visibility;","        }","    },","","    /**","     * Returns a shape class. Used by `addShape`. ","     *","     * @method _getShapeClass","     * @param {Shape | String} val Indicates which shape class. ","     * @return Function ","     * @private","     */","    _getShapeClass: function(val)","    {","        var shape = this._shapeClass[val];","        if(shape)","        {","            return shape;","        }","        return val;","    },","","    /**","     * Look up for shape classes. Used by `addShape` to retrieve a class for instantiation.","     *","     * @property _shapeClass","     * @type Object","     * @private","     */","    _shapeClass: {","        circle: Y.SVGCircle,","        rect: Y.SVGRect,","        path: Y.SVGPath,","        ellipse: Y.SVGEllipse,","        pieslice: Y.SVGPieSlice","    },","    ","    /**","     * Returns a shape based on the id of its dom node.","     *","     * @method getShapeById","     * @param {String} id Dom id of the shape's node attribute.","     * @return Shape","     */","    getShapeById: function(id)","    {","        var shape = this._shapes[id];","        return shape;","    },","","	/**","	 * Allows for creating multiple shapes in order to batch appending and redraw operations.","	 *","	 * @method batch","	 * @param {Function} method Method to execute.","	 */","    batch: function(method)","    {","        var autoDraw = this.get(\"autoDraw\");","        this.set(\"autoDraw\", false);","        method();","        this.set(\"autoDraw\", autoDraw);","    },","    ","    /**","     * Returns a document fragment to for attaching shapes.","     *","     * @method _getDocFrag","     * @return DocumentFragment","     * @private","     */","    _getDocFrag: function()","    {","        if(!this._frag)","        {","            this._frag = DOCUMENT.createDocumentFragment();","        }","        return this._frag;","    },","","    /**","     * Redraws all shapes.","     *","     * @method _redraw","     * @private","     */","    _redraw: function()","    {","        var autoSize = this.get(\"autoSize\"),","            preserveAspectRatio = this.get(\"preserveAspectRatio\"),","            box = this.get(\"resizeDown\") ? this._getUpdatedContentBounds() : this._contentBounds,","            left = box.left,","            right = box.right,","            top = box.top,","            bottom = box.bottom,","            width = right - left,","            height = bottom - top,","            computedWidth,","            computedHeight,","            computedLeft,","            computedTop,","            node;","        if(autoSize)","        {","            if(autoSize == \"sizeContentToGraphic\")","            {","                node = Y.one(this._node);","                computedWidth = parseFloat(node.getComputedStyle(\"width\"));","                computedHeight = parseFloat(node.getComputedStyle(\"height\"));","                computedLeft = computedTop = 0;","                this._contentNode.setAttribute(\"preserveAspectRatio\", preserveAspectRatio);","            }","            else ","            {","                computedWidth = width;","                computedHeight = height;","                computedLeft = left;","                computedTop = top;","                this._state.width = width;","                this._state.height = height;","                if(this._node)","                {","                    this._node.style.width = width + \"px\";","                    this._node.style.height = height + \"px\";","                }","            }","        }","        else","        {","                computedWidth = width;","                computedHeight = height;","                computedLeft = left;","                computedTop = top;","        }","        if(this._contentNode)","        {","            this._contentNode.style.left = computedLeft + \"px\";","            this._contentNode.style.top = computedTop + \"px\";","            this._contentNode.setAttribute(\"width\", computedWidth);","            this._contentNode.setAttribute(\"height\", computedHeight);","            this._contentNode.style.width = computedWidth + \"px\";","            this._contentNode.style.height = computedHeight + \"px\";","            this._contentNode.setAttribute(\"viewBox\", \"\" + left + \" \" + top + \" \" + width + \" \" + height + \"\");","        }","        if(this._frag)","        {","            if(this._contentNode)","            {","                this._contentNode.appendChild(this._frag);","            }","            this._frag = null;","        } ","    },"," ","    /**","     * Adds a shape to the redraw queue and calculates the contentBounds. Used internally ","     * by `Shape` instances.","     *","     * @method addToRedrawQueue","     * @param shape {SVGShape}","     * @protected","     */","    addToRedrawQueue: function(shape)","    {","        var shapeBox,","            box;","        this._shapes[shape.get(\"id\")] = shape;","        if(!this.get(\"resizeDown\"))","        {","            shapeBox = shape.getBounds();","            box = this._contentBounds;","            box.left = box.left < shapeBox.left ? box.left : shapeBox.left;","            box.top = box.top < shapeBox.top ? box.top : shapeBox.top;","            box.right = box.right > shapeBox.right ? box.right : shapeBox.right;","            box.bottom = box.bottom > shapeBox.bottom ? box.bottom : shapeBox.bottom;","            box.width = box.right - box.left;","            box.height = box.bottom - box.top;","            this._contentBounds = box;","        }","        if(this.get(\"autoDraw\")) ","        {","            this._redraw();","        }","    },","","    /**","     * Recalculates and returns the `contentBounds` for the `Graphic` instance.","     *","     * @method _getUpdatedContentBounds","     * @return {Object} ","     * @private","     */","    _getUpdatedContentBounds: function()","    {","        var bounds,","            i,","            shape,","            queue = this._shapes,","            box = {};","        for(i in queue)","        {","            if(queue.hasOwnProperty(i))","            {","                shape = queue[i];","                bounds = shape.getBounds();","                box.left = Y_LANG.isNumber(box.left) ? Math.min(box.left, bounds.left) : bounds.left;","                box.top = Y_LANG.isNumber(box.top) ? Math.min(box.top, bounds.top) : bounds.top;","                box.right = Y_LANG.isNumber(box.right) ? Math.max(box.right, bounds.right) : bounds.right;","                box.bottom = Y_LANG.isNumber(box.bottom) ? Math.max(box.bottom, bounds.bottom) : bounds.bottom;","            }","        }","        box.left = Y_LANG.isNumber(box.left) ? box.left : 0;","        box.top = Y_LANG.isNumber(box.top) ? box.top : 0;","        box.right = Y_LANG.isNumber(box.right) ? box.right : 0;","        box.bottom = Y_LANG.isNumber(box.bottom) ? box.bottom : 0;","        this._contentBounds = box;","        return box;","    },","","    /**","     * Creates a contentNode element","     *","     * @method _createGraphics","     * @private","     */","    _createGraphics: function() {","        var contentNode = this._createGraphicNode(\"svg\"),","            pointerEvents = this.get(\"pointerEvents\");","        contentNode.style.position = \"absolute\";","        contentNode.style.top = \"0px\";","        contentNode.style.left = \"0px\";","        contentNode.style.overflow = \"auto\";","        contentNode.setAttribute(\"overflow\", \"auto\");","        contentNode.setAttribute(\"pointer-events\", pointerEvents);","        return contentNode;","    },","","    /**","     * Creates a graphic node","     *","     * @method _createGraphicNode","     * @param {String} type node type to create","     * @param {String} pe specified pointer-events value","     * @return HTMLElement","     * @private","     */","    _createGraphicNode: function(type, pe)","    {","        var node = DOCUMENT.createElementNS(\"http://www.w3.org/2000/svg\", \"svg:\" + type),","            v = pe || \"none\";","        if(type !== \"defs\" && type !== \"stop\" && type !== \"linearGradient\" && type != \"radialGradient\")","        {","            node.setAttribute(\"pointer-events\", v);","        }","        return node;","    },","","    /**","     * Returns a reference to a gradient definition based on an id and type.","     *","     * @method getGradientNode","     * @param {String} key id that references the gradient definition","     * @param {String} type description of the gradient type","     * @return HTMLElement","     * @protected","     */","    getGradientNode: function(key, type)","    {","        var gradients = this._gradients,","            gradient,","            nodeType = type + \"Gradient\";","        if(gradients.hasOwnProperty(key) && gradients[key].tagName.indexOf(type) > -1)","        {","            gradient = this._gradients[key];","        }","        else","        {","            gradient = this._createGraphicNode(nodeType);","            if(!this._defs)","            {","                this._defs = this._createGraphicNode(\"defs\");","                this._contentNode.appendChild(this._defs);","            }","            this._defs.appendChild(gradient);","            key = key || \"gradient\" + Math.round(100000 * Math.random());","            gradient.setAttribute(\"id\", key);","            if(gradients.hasOwnProperty(key))","            {","                this._defs.removeChild(gradients[key]);","            }","            gradients[key] = gradient;","        }","        return gradient;","    },","","    /**","     * Inserts shape on the top of the tree.","     *","     * @method _toFront","     * @param {SVGShape} Shape to add.","     * @private","     */","    _toFront: function(shape)","    {","        var contentNode = this._contentNode;","        if(shape instanceof Y.SVGShape)","        {","            shape = shape.get(\"node\");","        }","        if(contentNode && shape)","        {","            contentNode.appendChild(shape);","        }","    },","","    /**","     * Inserts shape as the first child of the content node.","     *","     * @method _toBack","     * @param {SVGShape} Shape to add.","     * @private","     */","    _toBack: function(shape)","    {","        var contentNode = this._contentNode,","            targetNode;","        if(shape instanceof Y.SVGShape)","        {","            shape = shape.get(\"node\");","        }","        if(contentNode && shape)","        {","            targetNode = contentNode.firstChild;","            if(targetNode)","            {","                contentNode.insertBefore(shape, targetNode);","            }","            else","            {","                contentNode.appendChild(shape);","            }","        }","    }","});","","Y.SVGGraphic = SVGGraphic;","","","","}, '@VERSION@', {\"requires\": [\"graphics\"]});"];
_yuitest_coverage["build/graphics-svg/graphics-svg.js"].lines = {"1":0,"3":0,"19":0,"31":0,"99":0,"100":0,"115":0,"130":0,"142":0,"156":0,"157":0,"159":0,"160":0,"161":0,"165":0,"166":0,"168":0,"169":0,"172":0,"173":0,"174":0,"175":0,"177":0,"178":0,"179":0,"180":0,"181":0,"182":0,"183":0,"184":0,"185":0,"186":0,"187":0,"188":0,"189":0,"190":0,"191":0,"192":0,"206":0,"219":0,"231":0,"249":0,"251":0,"252":0,"253":0,"257":0,"258":0,"260":0,"261":0,"264":0,"265":0,"266":0,"267":0,"269":0,"270":0,"271":0,"272":0,"273":0,"274":0,"275":0,"276":0,"277":0,"278":0,"279":0,"280":0,"281":0,"282":0,"296":0,"297":0,"298":0,"299":0,"300":0,"315":0,"316":0,"317":0,"318":0,"319":0,"320":0,"321":0,"322":0,"323":0,"336":0,"337":0,"338":0,"339":0,"340":0,"341":0,"342":0,"343":0,"344":0,"345":0,"346":0,"360":0,"362":0,"363":0,"364":0,"365":0,"366":0,"367":0,"368":0,"369":0,"370":0,"371":0,"386":0,"388":0,"389":0,"390":0,"391":0,"392":0,"393":0,"410":0,"425":0,"426":0,"428":0,"429":0,"430":0,"434":0,"436":0,"437":0,"438":0,"441":0,"443":0,"448":0,"451":0,"455":0,"458":0,"459":0,"462":0,"463":0,"464":0,"465":0,"466":0,"467":0,"468":0,"469":0,"470":0,"471":0,"472":0,"474":0,"475":0,"476":0,"477":0,"478":0,"479":0,"480":0,"481":0,"482":0,"483":0,"486":0,"487":0,"488":0,"489":0,"501":0,"513":0,"525":0,"535":0,"536":0,"537":0,"538":0,"540":0,"541":0,"542":0,"546":0,"548":0,"549":0,"550":0,"551":0,"552":0,"553":0,"554":0,"555":0,"556":0,"557":0,"558":0,"559":0,"564":0,"565":0,"566":0,"567":0,"568":0,"569":0,"570":0,"571":0,"572":0,"573":0,"587":0,"599":0,"611":0,"618":0,"619":0,"620":0,"621":0,"622":0,"623":0,"624":0,"625":0,"626":0,"627":0,"628":0,"638":0,"639":0,"649":0,"650":0,"651":0,"652":0,"653":0,"654":0,"655":0,"656":0,"657":0,"658":0,"669":0,"681":0,"683":0,"684":0,"686":0,"687":0,"688":0,"689":0,"691":0,"693":0,"695":0,"699":0,"701":0,"708":0,"710":0,"711":0,"712":0,"714":0,"716":0,"717":0,"718":0,"719":0,"720":0,"723":0,"725":0,"726":0,"727":0,"728":0,"730":0,"733":0,"735":0,"737":0,"738":0,"740":0,"743":0,"744":0,"745":0,"746":0,"757":0,"769":0,"770":0,"772":0,"773":0,"775":0,"788":0,"793":0,"794":0,"797":0,"798":0,"799":0,"800":0,"803":0,"817":0,"825":0,"827":0,"828":0,"829":0,"830":0,"831":0,"833":0,"834":0,"835":0,"836":0,"837":0,"838":0,"850":0,"851":0,"853":0,"855":0,"857":0,"859":0,"861":0,"863":0,"865":0,"866":0,"869":0,"881":0,"883":0,"884":0,"885":0,"886":0,"889":0,"891":0,"917":0,"928":0,"931":0,"932":0,"934":0,"936":0,"938":0,"940":0,"953":0,"954":0,"956":0,"960":0,"961":0,"964":0,"965":0,"977":0,"978":0,"989":0,"991":0,"992":0,"1003":0,"1007":0,"1018":0,"1020":0,"1021":0,"1022":0,"1034":0,"1045":0,"1047":0,"1059":0,"1070":0,"1090":0,"1107":0,"1113":0,"1114":0,"1115":0,"1117":0,"1119":0,"1121":0,"1123":0,"1125":0,"1141":0,"1143":0,"1145":0,"1156":0,"1162":0,"1164":0,"1165":0,"1166":0,"1167":0,"1168":0,"1169":0,"1170":0,"1171":0,"1172":0,"1173":0,"1174":0,"1175":0,"1176":0,"1177":0,"1179":0,"1183":0,"1184":0,"1186":0,"1187":0,"1193":0,"1205":0,"1209":0,"1211":0,"1212":0,"1214":0,"1215":0,"1217":0,"1219":0,"1223":0,"1224":0,"1225":0,"1226":0,"1231":0,"1243":0,"1272":0,"1274":0,"1275":0,"1276":0,"1278":0,"1280":0,"1281":0,"1285":0,"1286":0,"1288":0,"1289":0,"1293":0,"1295":0,"1296":0,"1300":0,"1301":0,"1303":0,"1304":0,"1307":0,"1308":0,"1309":0,"1310":0,"1313":0,"1314":0,"1315":0,"1316":0,"1318":0,"1319":0,"1320":0,"1321":0,"1322":0,"1323":0,"1324":0,"1328":0,"1329":0,"1330":0,"1331":0,"1332":0,"1335":0,"1336":0,"1337":0,"1339":0,"1341":0,"1342":0,"1346":0,"1347":0,"1349":0,"1350":0,"1351":0,"1352":0,"1353":0,"1354":0,"1355":0,"1356":0,"1357":0,"1358":0,"1359":0,"1360":0,"1362":0,"1364":0,"1366":0,"1368":0,"1370":0,"1386":0,"1387":0,"1388":0,"1390":0,"1403":0,"1415":0,"1427":0,"1439":0,"1450":0,"1461":0,"1472":0,"1483":0,"1496":0,"1497":0,"1498":0,"1499":0,"1500":0,"1502":0,"1514":0,"1528":0,"1530":0,"1531":0,"1532":0,"1533":0,"1534":0,"1536":0,"1539":0,"1541":0,"1542":0,"1544":0,"1546":0,"1547":0,"1549":0,"1550":0,"1552":0,"1553":0,"1555":0,"1557":0,"1560":0,"1561":0,"1568":0,"1569":0,"1571":0,"1573":0,"1575":0,"1587":0,"1588":0,"1589":0,"1590":0,"1591":0,"1592":0,"1593":0,"1594":0,"1595":0,"1596":0,"1607":0,"1630":0,"1637":0,"1639":0,"1641":0,"1643":0,"1644":0,"1645":0,"1646":0,"1648":0,"1658":0,"1659":0,"1661":0,"1672":0,"1673":0,"1675":0,"1688":0,"1696":0,"1698":0,"1699":0,"1700":0,"1702":0,"1703":0,"1705":0,"1706":0,"1708":0,"1710":0,"1714":0,"1718":0,"1729":0,"1730":0,"1732":0,"1736":0,"1748":0,"1750":0,"1751":0,"1753":0,"1755":0,"1760":0,"1771":0,"1807":0,"1808":0,"1809":0,"1810":0,"1811":0,"1816":0,"1829":0,"1834":0,"1835":0,"1837":0,"1839":0,"1852":0,"1857":0,"1858":0,"1859":0,"1861":0,"1875":0,"1880":0,"1881":0,"1882":0,"1884":0,"1919":0,"1920":0,"1922":0,"1924":0,"1974":0,"1976":0,"1977":0,"1979":0,"1981":0,"1984":0,"2021":0,"2023":0,"2025":0,"2026":0,"2028":0,"2031":0,"2044":0,"2046":0,"2048":0,"2050":0,"2055":0,"2056":0,"2058":0,"2060":0,"2076":0,"2089":0,"2091":0,"2093":0,"2109":0,"2113":0,"2126":0,"2128":0,"2130":0,"2131":0,"2188":0,"2201":0,"2214":0,"2215":0,"2228":0,"2232":0,"2243":0,"2245":0,"2247":0,"2248":0,"2258":0,"2259":0,"2270":0,"2272":0,"2275":0,"2277":0,"2295":0,"2304":0,"2305":0,"2306":0,"2307":0,"2308":0,"2309":0,"2310":0,"2314":0,"2324":0,"2329":0,"2330":0,"2332":0,"2334":0,"2348":0,"2353":0,"2354":0,"2356":0,"2358":0,"2362":0,"2373":0,"2375":0,"2378":0,"2380":0,"2399":0,"2405":0,"2406":0,"2407":0,"2408":0,"2409":0,"2410":0,"2414":0,"2424":0,"2425":0,"2430":0,"2443":0,"2444":0,"2449":0,"2463":0,"2471":0,"2473":0,"2475":0,"2476":0,"2494":0,"2499":0,"2500":0,"2501":0,"2504":0,"2542":0,"2553":0,"2554":0,"2557":0,"2559":0,"2577":0,"2582":0,"2583":0,"2585":0,"2587":0,"2603":0,"2619":0,"2635":0,"2648":0,"2650":0,"2652":0,"2665":0,"2667":0,"2669":0,"2739":0,"2744":0,"2745":0,"2747":0,"2749":0,"2762":0,"2767":0,"2768":0,"2770":0,"2772":0,"2794":0,"2795":0,"2810":0,"2822":0,"2831":0,"2832":0,"2834":0,"2836":0,"2838":0,"2840":0,"2842":0,"2844":0,"2845":0,"2850":0,"2852":0,"2882":0,"2884":0,"2886":0,"2888":0,"2898":0,"2900":0,"2901":0,"2907":0,"2908":0,"2909":0,"2910":0,"2911":0,"2912":0,"2913":0,"2914":0,"2915":0,"2916":0,"2917":0,"2919":0,"2930":0,"2933":0,"2934":0,"2935":0,"2936":0,"2937":0,"2938":0,"2948":0,"2949":0,"2951":0,"2952":0,"2954":0,"2956":0,"2958":0,"2960":0,"2961":0,"2962":0,"2975":0,"2976":0,"2978":0,"2980":0,"2982":0,"2983":0,"2995":0,"2997":0,"2999":0,"3003":0,"3015":0,"3017":0,"3019":0,"3022":0,"3024":0,"3025":0,"3027":0,"3029":0,"3031":0,"3041":0,"3043":0,"3045":0,"3047":0,"3050":0,"3062":0,"3064":0,"3065":0,"3067":0,"3068":0,"3069":0,"3080":0,"3092":0,"3095":0,"3097":0,"3099":0,"3101":0,"3105":0,"3107":0,"3109":0,"3111":0,"3125":0,"3126":0,"3128":0,"3130":0,"3157":0,"3158":0,"3169":0,"3170":0,"3171":0,"3172":0,"3184":0,"3186":0,"3188":0,"3199":0,"3213":0,"3215":0,"3217":0,"3218":0,"3219":0,"3220":0,"3221":0,"3225":0,"3226":0,"3227":0,"3228":0,"3229":0,"3230":0,"3231":0,"3233":0,"3234":0,"3240":0,"3241":0,"3242":0,"3243":0,"3245":0,"3247":0,"3248":0,"3249":0,"3250":0,"3251":0,"3252":0,"3253":0,"3255":0,"3257":0,"3259":0,"3261":0,"3275":0,"3277":0,"3278":0,"3280":0,"3281":0,"3282":0,"3283":0,"3284":0,"3285":0,"3286":0,"3287":0,"3288":0,"3290":0,"3292":0,"3305":0,"3310":0,"3312":0,"3314":0,"3315":0,"3316":0,"3317":0,"3318":0,"3319":0,"3322":0,"3323":0,"3324":0,"3325":0,"3326":0,"3327":0,"3337":0,"3339":0,"3340":0,"3341":0,"3342":0,"3343":0,"3344":0,"3345":0,"3359":0,"3361":0,"3363":0,"3365":0,"3379":0,"3382":0,"3384":0,"3388":0,"3389":0,"3391":0,"3392":0,"3394":0,"3395":0,"3396":0,"3397":0,"3399":0,"3401":0,"3403":0,"3415":0,"3416":0,"3418":0,"3420":0,"3422":0,"3435":0,"3437":0,"3439":0,"3441":0,"3443":0,"3444":0,"3446":0,"3450":0,"3456":0};
_yuitest_coverage["build/graphics-svg/graphics-svg.js"].functions = {"SVGDrawing:19":0,"_round:97":0,"curveTo:114":0,"relativeCurveTo:129":0,"_curveTo:141":0,"quadraticCurveTo:205":0,"relativeQuadraticCurveTo:218":0,"_quadraticCurveTo:230":0,"drawRect:295":0,"drawRoundRect:314":0,"drawCircle:335":0,"drawEllipse:359":0,"drawDiamond:384":0,"drawWedge:408":0,"lineTo:499":0,"relativeLineTo:511":0,"_lineTo:524":0,"moveTo:585":0,"relativeMoveTo:597":0,"_moveTo:610":0,"end:636":0,"clear:647":0,"_closePath:667":0,"closePath:755":0,"_getCurrentArray:767":0,"getBezierData:787":0,"_setCurveBoundingBox:815":0,"_trackSize:849":0,"SVGShape:881":0,"init:915":0,"initializer:926":0,"_setGraphic:951":0,"addClass:975":0,"removeClass:987":0,"getXY:1001":0,"setXY:1016":0,"contains:1032":0,"compareTo:1044":0,"test:1057":0,"_getDefaultFill:1069":0,"_getDefaultStroke:1088":0,"createNode:1105":0,"on:1139":0,"_strokeChangeHandler:1154":0,"_fillChangeHandler:1203":0,"_setGradientFill:1242":0,"set:1384":0,"translate:1401":0,"translateX:1413":0,"translateY:1425":0,"skew:1437":0,"skewX:1448":0,"skewY:1459":0,"rotate:1470":0,"scale:1481":0,"_addTransform:1494":0,"_updateTransform:1512":0,"_draw:1585":0,"_updateHandler:1605":0,"getBounds:1628":0,"toFront:1656":0,"toBack:1670":0,"_parsePathData:1686":0,"destroy:1727":0,"_destroy:1746":0,"valueFn:1769":0,"setter:1805":0,"getter:1814":0,"valueFn:1827":0,"setter:1832":0,"getter:1850":0,"setter:1855":0,"getter:1873":0,"setter:1878":0,"setter:1918":0,"setter:1972":0,"setter:2019":0,"valueFn:2042":0,"setter:2053":0,"getter:2074":0,"setter:2087":0,"getter:2107":0,"SVGPath:2126":0,"getter:2199":0,"getter:2212":0,"getter:2226":0,"SVGRect:2243":0,"SVGEllipse:2270":0,"_draw:2293":0,"setter:2322":0,"getter:2327":0,"setter:2346":0,"getter:2351":0,"SVGCircle:2373":0,"_draw:2397":0,"setter:2422":0,"getter:2428":0,"setter:2441":0,"getter:2447":0,"SVGPieSlice:2471":0,"_draw:2492":0,"SVGGraphic:2553":0,"valueFn:2575":0,"setter:2580":0,"getter:2601":0,"getter:2617":0,"getter:2633":0,"setter:2646":0,"setter:2663":0,"getter:2737":0,"setter:2742":0,"getter:2760":0,"setter:2765":0,"setter:2792":0,"set:2820":0,"getXY:2880":0,"initializer:2897":0,"render:2929":0,"destroy:2946":0,"addShape:2973":0,"_appendShape:2993":0,"removeShape:3013":0,"removeAllShapes:3039":0,"_removeChildren:3060":0,"clear:3079":0,"_toggleVisible:3090":0,"_getShapeClass:3123":0,"getShapeById:3155":0,"batch:3167":0,"_getDocFrag:3182":0,"_redraw:3197":0,"addToRedrawQueue:3273":0,"_getUpdatedContentBounds:3303":0,"_createGraphics:3336":0,"_createGraphicNode:3357":0,"getGradientNode:3377":0,"_toFront:3413":0,"_toBack:3433":0,"(anonymous 1):1":0};
_yuitest_coverage["build/graphics-svg/graphics-svg.js"].coveredLines = 886;
_yuitest_coverage["build/graphics-svg/graphics-svg.js"].coveredFunctions = 139;
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1);
YUI.add('graphics-svg', function (Y, NAME) {

_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "(anonymous 1)", 1);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3);
var IMPLEMENTATION = "svg",
    SHAPE = "shape",
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

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 19);
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
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 31);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_round", 97);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 99);
val = Math.round(val * 100)/100;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 100);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "curveTo", 114);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 115);
this._curveTo.apply(this, [Y.Array(arguments), false]);
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
     */
    relativeCurveTo: function() {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "relativeCurveTo", 129);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 130);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_curveTo", 141);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 142);
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
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 156);
this._pathArray = this._pathArray || [];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 157);
if(this._pathType !== command)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 159);
this._pathType = command;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 160);
currentArray = [command];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 161);
this._pathArray.push(currentArray);
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 165);
currentArray = this._pathArray[Math.max(0, this._pathArray.length - 1)];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 166);
if(!currentArray)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 168);
currentArray = [];
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 169);
this._pathArray.push(currentArray);
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 172);
pathArrayLen = this._pathArray.length - 1;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 173);
this._pathArray[pathArrayLen] = this._pathArray[pathArrayLen].concat(args);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 174);
len = args.length - 5;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 175);
for(; i < len; i = i + 6)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 177);
cp1x = parseFloat(args[i]) + relativeX;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 178);
cp1y = parseFloat(args[i + 1]) + relativeY;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 179);
cp2x = parseFloat(args[i + 2]) + relativeX;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 180);
cp2y = parseFloat(args[i + 3]) + relativeY;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 181);
x = parseFloat(args[i + 4]) + relativeX;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 182);
y = parseFloat(args[i + 5]) + relativeY;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 183);
right = Math.max(x, Math.max(cp1x, cp2x));
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 184);
bottom = Math.max(y, Math.max(cp1y, cp2y));
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 185);
left = Math.min(x, Math.min(cp1x, cp2x));
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 186);
top = Math.min(y, Math.min(cp1y, cp2y));
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 187);
w = Math.abs(right - left);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 188);
h = Math.abs(bottom - top);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 189);
pts = [[this._currentX, this._currentY] , [cp1x, cp1y], [cp2x, cp2y], [x, y]]; 
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 190);
this._setCurveBoundingBox(pts, w, h);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 191);
this._currentX = x;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 192);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "quadraticCurveTo", 205);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 206);
this._quadraticCurveTo.apply(this, [Y.Array(arguments), false]);
    },

    /**
     * Draws a quadratic bezier curve relative to the current position.
     *
     * @method quadraticCurveTo
     * @param {Number} cpx x-coordinate for the control point.
     * @param {Number} cpy y-coordinate for the control point.
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     */
    relativeQuadraticCurveTo: function() {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "relativeQuadraticCurveTo", 218);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 219);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_quadraticCurveTo", 230);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 231);
var cpx, 
            cpy, 
            x, 
            y,
            pathArrayLen,
            currentArray,
            w,
            h,
            pts,
            right,
            left,
            bottom,
            top,
            i = 0,
            len,
            command = relative ? "q" : "Q",
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 249);
if(this._pathType !== command)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 251);
this._pathType = command;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 252);
currentArray = [command];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 253);
this._pathArray.push(currentArray);
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 257);
currentArray = this._pathArray[Math.max(0, this._pathArray.length - 1)];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 258);
if(!currentArray)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 260);
currentArray = [];
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 261);
this._pathArray.push(currentArray);
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 264);
pathArrayLen = this._pathArray.length - 1;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 265);
this._pathArray[pathArrayLen] = this._pathArray[pathArrayLen].concat(args);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 266);
len = args.length - 3;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 267);
for(; i < len; i = i + 4)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 269);
cpx = parseFloat(args[i]) + relativeX;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 270);
cpy = parseFloat(args[i + 1]) + relativeY;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 271);
x = parseFloat(args[i + 2]) + relativeX;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 272);
y = parseFloat(args[i + 3]) + relativeY;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 273);
right = Math.max(x, cpx);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 274);
bottom = Math.max(y, cpy);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 275);
left = Math.min(x, cpx);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 276);
top = Math.min(y, cpy);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 277);
w = Math.abs(right - left);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 278);
h = Math.abs(bottom - top);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 279);
pts = [[this._currentX, this._currentY] , [cpx, cpy], [x, y]]; 
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 280);
this._setCurveBoundingBox(pts, w, h);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 281);
this._currentX = x;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 282);
this._currentY = y;
        }
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "drawRect", 295);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 296);
this.moveTo(x, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 297);
this.lineTo(x + w, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 298);
this.lineTo(x + w, y + h);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 299);
this.lineTo(x, y + h);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 300);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "drawRoundRect", 314);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 315);
this.moveTo(x, y + eh);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 316);
this.lineTo(x, y + h - eh);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 317);
this.quadraticCurveTo(x, y + h, x + ew, y + h);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 318);
this.lineTo(x + w - ew, y + h);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 319);
this.quadraticCurveTo(x + w, y + h, x + w, y + h - eh);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 320);
this.lineTo(x + w, y + eh);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 321);
this.quadraticCurveTo(x + w, y, x + w - ew, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 322);
this.lineTo(x + ew, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 323);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "drawCircle", 335);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 336);
var circum = radius * 2;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 337);
this._drawingComplete = false;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 338);
this._trackSize(x, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 339);
this._trackSize(x + circum, y + circum);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 340);
this._pathArray = this._pathArray || [];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 341);
this._pathArray.push(["M", x + radius, y]);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 342);
this._pathArray.push(["A",  radius, radius, 0, 1, 0, x + radius, y + circum]);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 343);
this._pathArray.push(["A",  radius, radius, 0, 1, 0, x + radius, y]);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 344);
this._currentX = x;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 345);
this._currentY = y;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 346);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "drawEllipse", 359);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 360);
var radius = w * 0.5,
            yRadius = h * 0.5;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 362);
this._drawingComplete = false;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 363);
this._trackSize(x, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 364);
this._trackSize(x + w, y + h);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 365);
this._pathArray = this._pathArray || [];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 366);
this._pathArray.push(["M", x + radius, y]);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 367);
this._pathArray.push(["A",  radius, yRadius, 0, 1, 0, x + radius, y + h]);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 368);
this._pathArray.push(["A",  radius, yRadius, 0, 1, 0, x + radius, y]);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 369);
this._currentX = x;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 370);
this._currentY = y;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 371);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "drawDiamond", 384);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 386);
var midWidth = width * 0.5,
            midHeight = height * 0.5;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 388);
this.moveTo(x + midWidth, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 389);
this.lineTo(x + width, y + midHeight);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 390);
this.lineTo(x + midWidth, y + height);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 391);
this.lineTo(x, y + midHeight);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 392);
this.lineTo(x + midWidth, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 393);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "drawWedge", 408);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 410);
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
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 425);
yRadius = yRadius || radius;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 426);
if(this._pathType != "M")
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 428);
this._pathType = "M";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 429);
currentArray = ["M"];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 430);
this._pathArray.push(currentArray);
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 434);
currentArray = this._getCurrentArray(); 
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 436);
pathArrayLen = this._pathArray.length - 1;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 437);
this._pathArray[pathArrayLen].push(x); 
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 438);
this._pathArray[pathArrayLen].push(x); 
        
        // limit sweep to reasonable numbers
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 441);
if(Math.abs(arc) > 360)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 443);
arc = 360;
        }
        
        // First we calculate how many segments are needed
        // for a smooth arc.
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 448);
segs = Math.ceil(Math.abs(arc) / 45);
        
        // Now calculate the sweep of each segment.
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 451);
segAngle = arc / segs;
        
        // The math requires radians rather than degrees. To convert from degrees
        // use the formula (degrees/180)*Math.PI to get radians.
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 455);
theta = -(segAngle / 180) * Math.PI;
        
        // convert angle startAngle to radians
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 458);
angle = (startAngle / 180) * Math.PI;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 459);
if(segs > 0)
        {
            // draw a line from the center to the start of the curve
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 462);
ax = x + Math.cos(startAngle / 180 * Math.PI) * radius;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 463);
ay = y + Math.sin(startAngle / 180 * Math.PI) * yRadius;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 464);
this._pathType = "L";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 465);
pathArrayLen++;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 466);
this._pathArray[pathArrayLen] = ["L"];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 467);
this._pathArray[pathArrayLen].push(Math.round(ax));
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 468);
this._pathArray[pathArrayLen].push(Math.round(ay));
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 469);
pathArrayLen++; 
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 470);
this._pathType = "Q";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 471);
this._pathArray[pathArrayLen] = ["Q"];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 472);
for(; i < segs; ++i)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 474);
angle += theta;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 475);
angleMid = angle - (theta / 2);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 476);
bx = x + Math.cos(angle) * radius;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 477);
by = y + Math.sin(angle) * yRadius;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 478);
cx = x + Math.cos(angleMid) * (radius / Math.cos(theta / 2));
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 479);
cy = y + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 480);
this._pathArray[pathArrayLen].push(Math.round(cx));
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 481);
this._pathArray[pathArrayLen].push(Math.round(cy));
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 482);
this._pathArray[pathArrayLen].push(Math.round(bx));
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 483);
this._pathArray[pathArrayLen].push(Math.round(by));
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 486);
this._currentX = x;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 487);
this._currentY = y;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 488);
this._trackSize(diameter, diameter); 
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 489);
return this;
    },

    /**
     * Draws a line segment using the current line style from the current drawing position to the specified x and y coordinates.
     * 
     * @method lineTo
     * @param {Number} point1 x-coordinate for the end point.
     * @param {Number} point2 y-coordinate for the end point.
     */
    lineTo: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "lineTo", 499);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 501);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "relativeLineTo", 511);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 513);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_lineTo", 524);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 525);
var point1 = args[0],
            i,
            len,
            pathArrayLen,
            currentArray,
            x,
            y,
            command = relative ? "l" : "L",
            relativeX = relative ? this._round(this._currentX) : 0,
            relativeY = relative ? this._round(this._currentY) : 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 535);
this._pathArray = this._pathArray || [];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 536);
this._shapeType = "path";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 537);
len = args.length;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 538);
if(this._pathType !== command)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 540);
this._pathType = command;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 541);
currentArray = [command];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 542);
this._pathArray.push(currentArray);
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 546);
currentArray = this._getCurrentArray();
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 548);
pathArrayLen = this._pathArray.length - 1;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 549);
if (typeof point1 === 'string' || typeof point1 === 'number') {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 550);
for (i = 0; i < len; i = i + 2) {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 551);
x = this._round(args[i]);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 552);
y = this._round(args[i + 1]);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 553);
this._pathArray[pathArrayLen].push(x);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 554);
this._pathArray[pathArrayLen].push(y);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 555);
x = x + relativeX;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 556);
y = y + relativeY;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 557);
this._currentX = x;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 558);
this._currentY = y;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 559);
this._trackSize.apply(this, [x, y]);
            }
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 564);
for (i = 0; i < len; ++i) {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 565);
x = this._round(args[i][0]);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 566);
y = this._round(args[i][1]);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 567);
this._pathArray[pathArrayLen].push(x);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 568);
this._pathArray[pathArrayLen].push(y);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 569);
this._currentX = x;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 570);
this._currentY = y;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 571);
x = x + relativeX;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 572);
y = y + relativeY;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 573);
this._trackSize.apply(this, [x, y]);
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
    moveTo: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "moveTo", 585);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 587);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "relativeMoveTo", 597);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 599);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_moveTo", 610);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 611);
var pathArrayLen,
            currentArray,
            x = this._round(args[0]),
            y = this._round(args[1]),
            command = relative ? "m" : "M",
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 618);
this._pathArray = this._pathArray || [];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 619);
this._pathType = command;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 620);
currentArray = [command];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 621);
this._pathArray.push(currentArray);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 622);
pathArrayLen = this._pathArray.length - 1;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 623);
this._pathArray[pathArrayLen] = this._pathArray[pathArrayLen].concat([x, y]);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 624);
x = x + relativeX;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 625);
y = y + relativeY;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 626);
this._currentX = x;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 627);
this._currentY = y;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 628);
this._trackSize(x, y);
    },
 
    /**
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "end", 636);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 638);
this._closePath();
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 639);
this._graphic.addToRedrawQueue(this);    
    },

    /**
     * Clears the path.
     *
     * @method clear
     */
    clear: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "clear", 647);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 649);
this._currentX = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 650);
this._currentY = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 651);
this._width = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 652);
this._height = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 653);
this._left = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 654);
this._right = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 655);
this._top = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 656);
this._bottom = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 657);
this._pathArray = [];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 658);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_closePath", 667);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 669);
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
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 681);
if(this._pathArray)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 683);
pathArray = this._pathArray.concat();
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 684);
while(pathArray && pathArray.length > 0)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 686);
segmentArray = pathArray.shift();
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 687);
len = segmentArray.length;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 688);
pathType = segmentArray[0];
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 689);
if(pathType === "A" || pathType == "c" || pathType == "C")
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 691);
path += pathType + segmentArray[1] + "," + segmentArray[2];
                }
                else {_yuitest_coverline("build/graphics-svg/graphics-svg.js", 693);
if(pathType != "z")
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 695);
path += " " + pathType + this._round(segmentArray[1] - left);
                }
                else
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 699);
path += " z ";
                }}
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 701);
switch(pathType)
                {
                    case "L" :
                    case "l" :
                    case "M" :
                    case "Q" :
                    case "q" :
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 708);
for(i = 2; i < len; ++i)
                        {
                            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 710);
val = (i % 2 === 0) ? top : left;
                            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 711);
val = segmentArray[i] - val;
                            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 712);
path += ", " + this._round(val);
                        }
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 714);
break;
                    case "A" :
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 716);
val = " " + this._round(segmentArray[3]) + " " + this._round(segmentArray[4]);
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 717);
val += "," + this._round(segmentArray[5]) + " " + this._round(segmentArray[6] - left);
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 718);
val += "," + this._round(segmentArray[7] - top);
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 719);
path += " " + val;
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 720);
break;
                    case "C" :
                    case "c" :
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 723);
for(i = 3; i < len - 1; i = i + 2)
                        {
                            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 725);
val = this._round(segmentArray[i] - left);
                            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 726);
val = val + ", ";
                            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 727);
val = val + this._round(segmentArray[i + 1] - top);
                            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 728);
path += " " + val;
                        }
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 730);
break;
                }
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 733);
if(fill && fill.color)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 735);
path += 'z';
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 737);
Y.Lang.trim(path);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 738);
if(path)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 740);
node.setAttribute("d", path);
            }
            
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 743);
this._path = path;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 744);
this._fillChangeHandler();
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 745);
this._strokeChangeHandler();
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 746);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "closePath", 755);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 757);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_getCurrentArray", 767);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 769);
var currentArray = this._pathArray[Math.max(0, this._pathArray.length - 1)];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 770);
if(!currentArray)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 772);
currentArray = [];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 773);
this._pathArray.push(currentArray);
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 775);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getBezierData", 787);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 788);
var n = points.length,
            tmp = [],
            i,
            j;

        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 793);
for (i = 0; i < n; ++i){
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 794);
tmp[i] = [points[i][0], points[i][1]]; // save input
        }
        
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 797);
for (j = 1; j < n; ++j) {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 798);
for (i = 0; i < n - j; ++i) {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 799);
tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 800);
tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1]; 
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 803);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_setCurveBoundingBox", 815);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 817);
var i = 0,
            left = this._currentX,
            right = left,
            top = this._currentY,
            bottom = top,
            len = Math.round(Math.sqrt((w * w) + (h * h))),
            t = 1/len,
            xy;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 825);
for(; i < len; ++i)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 827);
xy = this.getBezierData(pts, t * i);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 828);
left = isNaN(left) ? xy[0] : Math.min(xy[0], left);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 829);
right = isNaN(right) ? xy[0] : Math.max(xy[0], right);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 830);
top = isNaN(top) ? xy[1] : Math.min(xy[1], top);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 831);
bottom = isNaN(bottom) ? xy[1] : Math.max(xy[1], bottom);
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 833);
left = Math.round(left * 10)/10;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 834);
right = Math.round(right * 10)/10;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 835);
top = Math.round(top * 10)/10;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 836);
bottom = Math.round(bottom * 10)/10;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 837);
this._trackSize(right, bottom);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 838);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_trackSize", 849);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 850);
if (w > this._right) {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 851);
this._right = w;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 853);
if(w < this._left)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 855);
this._left = w;    
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 857);
if (h < this._top)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 859);
this._top = h;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 861);
if (h > this._bottom) 
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 863);
this._bottom = h;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 865);
this._width = this._right - this._left;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 866);
this._height = this._bottom - this._top;
    }
};
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 869);
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
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 881);
SVGShape = function(cfg)
{
    _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "SVGShape", 881);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 883);
this._transforms = [];
    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 884);
this.matrix = new Y.Matrix();
    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 885);
this._normalizedMatrix = new Y.Matrix();
    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 886);
SVGShape.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 889);
SVGShape.NAME = "shape";

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 891);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "init", 915);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 917);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "initializer", 926);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 928);
var host = this,
            graphic = cfg.graphic,
            data = this.get("data");
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 931);
host.createNode(); 
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 932);
if(graphic)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 934);
host._setGraphic(graphic);
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 936);
if(data)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 938);
host._parsePathData(data);
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 940);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_setGraphic", 951);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 953);
var graphic;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 954);
if(render instanceof Y.SVGGraphic)
        {
		    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 956);
this._graphic = render;
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 960);
render = Y.one(render);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 961);
graphic = new Y.SVGGraphic({
                render: render
            });
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 964);
graphic._appendShape(this);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 965);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "addClass", 975);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 977);
var node = this.node;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 978);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "removeClass", 987);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 989);
var node = this.node,
			classString = node.className.baseVal;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 991);
classString = classString.replace(new RegExp(className + ' '), className).replace(new RegExp(className), '');
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 992);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getXY", 1001);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1003);
var graphic = this._graphic,
			parentXY = graphic.getXY(),
			x = this._x,
			y = this._y;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1007);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setXY", 1016);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1018);
var graphic = this._graphic,
			parentXY = graphic.getXY();
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1020);
this._x = xy[0] - parentXY[0];
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1021);
this._y = xy[1] - parentXY[1];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1022);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "contains", 1032);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1034);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "compareTo", 1044);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1045);
var node = this.node;

		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1047);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "test", 1057);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1059);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_getDefaultFill", 1069);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1070);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_getDefaultStroke", 1088);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1090);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "createNode", 1105);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1107);
var host = this,
            node = DOCUMENT.createElementNS("http://www.w3.org/2000/svg", "svg:" + this._type),
			id = host.get("id"),
            name = host.name,
            concat = host._camelCaseConcat,
			pointerEvents = host.get("pointerEvents");
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1113);
host.node = node;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1114);
host.addClass(_getClassName(SHAPE) + " " + _getClassName(concat(IMPLEMENTATION, SHAPE)) + " " + _getClassName(name) + " " + _getClassName(concat(IMPLEMENTATION, name))); 
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1115);
if(id)
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1117);
node.setAttribute("id", id);
		}
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1119);
if(pointerEvents)
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1121);
node.setAttribute("pointer-events", pointerEvents);
		}
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1123);
if(!host.get("visible"))
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1125);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "on", 1139);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1141);
if(Y.Node.DOM_EVENTS[type])
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1143);
return Y.one("#" +  this.get("id")).on(type, fn);
		}
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1145);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_strokeChangeHandler", 1154);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1156);
var node = this.node,
			stroke = this.get("stroke"),
			strokeOpacity,
			dashstyle,
			dash,
			linejoin;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1162);
if(stroke && stroke.weight && stroke.weight > 0)
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1164);
linejoin = stroke.linejoin || "round";
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1165);
strokeOpacity = parseFloat(stroke.opacity);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1166);
dashstyle = stroke.dashstyle || "none";
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1167);
dash = Y_LANG.isArray(dashstyle) ? dashstyle.toString() : dashstyle;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1168);
stroke.color = stroke.color || "#000000";
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1169);
stroke.weight = stroke.weight || 1;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1170);
stroke.opacity = Y_LANG.isNumber(strokeOpacity) ? strokeOpacity : 1;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1171);
stroke.linecap = stroke.linecap || "butt";
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1172);
node.setAttribute("stroke-dasharray", dash);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1173);
node.setAttribute("stroke", stroke.color);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1174);
node.setAttribute("stroke-linecap", stroke.linecap);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1175);
node.setAttribute("stroke-width",  stroke.weight);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1176);
node.setAttribute("stroke-opacity", stroke.opacity);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1177);
if(linejoin == "round" || linejoin == "bevel")
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1179);
node.setAttribute("stroke-linejoin", linejoin);
			}
			else
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1183);
linejoin = parseInt(linejoin, 10);
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1184);
if(Y_LANG.isNumber(linejoin))
				{
					_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1186);
node.setAttribute("stroke-miterlimit",  Math.max(linejoin, 1));
					_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1187);
node.setAttribute("stroke-linejoin", "miter");
				}
			}
		}
		else
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1193);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_fillChangeHandler", 1203);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1205);
var node = this.node,
			fill = this.get("fill"),
			fillOpacity,
			type;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1209);
if(fill)
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1211);
type = fill.type;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1212);
if(type == "linear" || type == "radial")
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1214);
this._setGradientFill(fill);
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1215);
node.setAttribute("fill", "url(#grad" + this.get("id") + ")");
			}
			else {_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1217);
if(!fill.color)
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1219);
node.setAttribute("fill", "none");
			}
			else
			{
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1223);
fillOpacity = parseFloat(fill.opacity);
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1224);
fillOpacity = Y_LANG.isNumber(fillOpacity) ? fillOpacity : 1;
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1225);
node.setAttribute("fill", fill.color);
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1226);
node.setAttribute("fill-opacity", fillOpacity);
			}}
		}
		else
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1231);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_setGradientFill", 1242);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1243);
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
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1272);
if(type == "linear")
		{
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1274);
cx = w/2;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1275);
cy = h/2;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1276);
if(Math.abs(tanRadians) * w/2 >= h/2)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1278);
if(rotation < 180)
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1280);
y1 = 0;
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1281);
y2 = h;
                }
                else
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1285);
y1 = h;
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1286);
y2 = 0;
                }
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1288);
x1 = cx - ((cy - y1)/tanRadians);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1289);
x2 = cx - ((cy - y2)/tanRadians); 
            }
            else
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1293);
if(rotation > 90 && rotation < 270)
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1295);
x1 = w;
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1296);
x2 = 0;
                }
                else
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1300);
x1 = 0;
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1301);
x2 = w;
                }
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1303);
y1 = ((tanRadians * (cx - x1)) - cy) * -1;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1304);
y2 = ((tanRadians * (cx - x2)) - cy) * -1;
            }

            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1307);
x1 = Math.round(100 * x1/w);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1308);
x2 = Math.round(100 * x2/w);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1309);
y1 = Math.round(100 * y1/h);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1310);
y2 = Math.round(100 * y2/h);
            
            //Set default value if not valid 
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1313);
x1 = isNumber(x1) ? x1 : 0;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1314);
x2 = isNumber(x2) ? x2 : 100;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1315);
y1 = isNumber(y1) ? y1 : 0;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1316);
y2 = isNumber(y2) ? y2 : 0;
            
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1318);
gradientNode.setAttribute("spreadMethod", "pad");
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1319);
gradientNode.setAttribute("width", w);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1320);
gradientNode.setAttribute("height", h);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1321);
gradientNode.setAttribute("x1", x1 + "%");
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1322);
gradientNode.setAttribute("x2", x2 + "%");
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1323);
gradientNode.setAttribute("y1", y1 + "%");
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1324);
gradientNode.setAttribute("y2", y2 + "%");
		}
		else
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1328);
gradientNode.setAttribute("cx", (cx * 100) + "%");
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1329);
gradientNode.setAttribute("cy", (cy * 100) + "%");
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1330);
gradientNode.setAttribute("fx", (fx * 100) + "%");
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1331);
gradientNode.setAttribute("fy", (fy * 100) + "%");
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1332);
gradientNode.setAttribute("r", (r * 100) + "%");
		}
		
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1335);
len = stops.length;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1336);
def = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1337);
for(i = 0; i < len; ++i)
		{
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1339);
if(this._stops && this._stops.length > 0)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1341);
stopNode = this._stops.shift();
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1342);
newStop = false;
            }
            else
            {
			    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1346);
stopNode = graphic._createGraphicNode("stop");
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1347);
newStop = true;
            }
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1349);
stop = stops[i];
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1350);
opacity = stop.opacity;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1351);
color = stop.color;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1352);
offset = stop.offset || i/(len - 1);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1353);
offset = Math.round(offset * 100) + "%";
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1354);
opacity = isNumber(opacity) ? opacity : 1;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1355);
opacity = Math.max(0, Math.min(1, opacity));
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1356);
def = (i + 1) / len;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1357);
stopNode.setAttribute("offset", offset);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1358);
stopNode.setAttribute("stop-color", color);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1359);
stopNode.setAttribute("stop-opacity", opacity);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1360);
if(newStop)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1362);
gradientNode.appendChild(stopNode);
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1364);
stopNodes.push(stopNode);
		}
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1366);
while(this._stops && this._stops.length > 0)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1368);
gradientNode.removeChild(this._stops.shift());
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1370);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "set", 1384);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1386);
var host = this;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1387);
AttributeLite.prototype.set.apply(host, arguments);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1388);
if(host.initialized)
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1390);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "translate", 1401);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1403);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "translateX", 1413);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1415);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "translateY", 1425);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1427);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "skew", 1437);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1439);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "skewX", 1448);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1450);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "skewY", 1459);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1461);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "rotate", 1470);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1472);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "scale", 1481);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1483);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_addTransform", 1494);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1496);
args = Y.Array(args);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1497);
this._transform = Y_LANG.trim(this._transform + " " + type + "(" + args.join(", ") + ")");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1498);
args.unshift(type);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1499);
this._transforms.push(args);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1500);
if(this.initialized)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1502);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_updateTransform", 1512);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1514);
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

        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1528);
if(isPath || (this._transforms && this._transforms.length > 0))
		{
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1530);
x = this._x;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1531);
y = this._y;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1532);
transformOrigin = this.get("transformOrigin");
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1533);
tx = x + (transformOrigin[0] * this.get("width"));
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1534);
ty = y + (transformOrigin[1] * this.get("height")); 
            //need to use translate for x/y coords
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1536);
if(isPath)
            {
                //adjust origin for custom shapes 
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1539);
if(!(this instanceof Y.SVGPath))
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1541);
tx = this._left + (transformOrigin[0] * this.get("width"));
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1542);
ty = this._top + (transformOrigin[1] * this.get("height"));
                }
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1544);
normalizedMatrix.init({dx: x + this._left, dy: y + this._top});
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1546);
normalizedMatrix.translate(tx, ty);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1547);
for(; i < len; ++i)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1549);
key = this._transforms[i].shift();
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1550);
if(key)
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1552);
normalizedMatrix[key].apply(normalizedMatrix, this._transforms[i]);
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1553);
matrix[key].apply(matrix, this._transforms[i]); 
                }
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1555);
if(isPath)
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1557);
this._transforms[i].unshift(key);
                }
			}
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1560);
normalizedMatrix.translate(-tx, -ty);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1561);
transform = "matrix(" + normalizedMatrix.a + "," + 
                            normalizedMatrix.b + "," + 
                            normalizedMatrix.c + "," + 
                            normalizedMatrix.d + "," + 
                            normalizedMatrix.dx + "," +
                            normalizedMatrix.dy + ")";
		}
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1568);
this._graphic.addToRedrawQueue(this);    
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1569);
if(transform)
		{
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1571);
node.setAttribute("transform", transform);
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1573);
if(!isPath)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1575);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_draw", 1585);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1587);
var node = this.node;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1588);
node.setAttribute("width", this.get("width"));
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1589);
node.setAttribute("height", this.get("height"));
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1590);
node.setAttribute("x", this._x);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1591);
node.setAttribute("y", this._y);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1592);
node.style.left = this._x + "px";
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1593);
node.style.top = this._y + "px";
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1594);
this._fillChangeHandler();
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1595);
this._strokeChangeHandler();
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1596);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_updateHandler", 1605);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1607);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getBounds", 1628);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1630);
var type = this._type,
			stroke = this.get("stroke"),
            w = this.get("width"),
			h = this.get("height"),
			x = type == "path" ? 0 : this._x,
			y = type == "path" ? 0 : this._y,
            wt = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1637);
if(type != "path")
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1639);
if(stroke && stroke.weight)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1641);
wt = stroke.weight;
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1643);
w = (x + w + wt) - (x - wt); 
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1644);
h = (y + h + wt) - (y - wt);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1645);
x -= wt;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1646);
y -= wt;
        }
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1648);
return this._normalizedMatrix.getContentRect(w, h, x, y);
	},

    /**
     * Places the shape above all other shapes.
     *
     * @method toFront
     */
    toFront: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "toFront", 1656);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1658);
var graphic = this.get("graphic");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1659);
if(graphic)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1661);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "toBack", 1670);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1672);
var graphic = this.get("graphic");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1673);
if(graphic)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1675);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_parsePathData", 1686);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1688);
var method,
            methodSymbol,
            args,
            commandArray = Y.Lang.trim(val.match(SPLITPATHPATTERN)),
            i = 0,
            len, 
            str,
            symbolToMethod = this._pathSymbolToMethod;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1696);
if(commandArray)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1698);
this.clear();
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1699);
len = commandArray.length || 0;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1700);
for(; i < len; i = i + 1)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1702);
str = commandArray[i];
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1703);
methodSymbol = str.substr(0, 1),
                args = str.substr(1).match(SPLITARGSPATTERN);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1705);
method = symbolToMethod[methodSymbol];
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1706);
if(method)
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1708);
if(args)
                    {
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1710);
this[method].apply(this, args);
                    }
                    else
                    {
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1714);
this[method].apply(this);
                    }
                }
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1718);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "destroy", 1727);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1729);
var graphic = this.get("graphic");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1730);
if(graphic)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1732);
graphic.removeShape(this);
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1736);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_destroy", 1746);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1748);
if(this.node)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1750);
Y.Event.purgeElement(this.node, true);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1751);
if(this.node.parentNode)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1753);
this.node.parentNode.removeChild(this.node);
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1755);
this.node = null;
        }
    }
 }, Y.SVGDrawing.prototype));
	
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1760);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "valueFn", 1769);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1771);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 1805);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1807);
this.matrix.init();	
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1808);
this._normalizedMatrix.init();
		    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1809);
this._transforms = this.matrix.getTransformArray(val);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1810);
this._transform = val;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1811);
return val;
		},

        getter: function()
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 1814);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1816);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "valueFn", 1827);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1829);
return Y.guid();
		},

		setter: function(val)
		{
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 1832);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1834);
var node = this.node;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1835);
if(node)
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1837);
node.setAttribute("id", val);
			}
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1839);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 1850);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1852);
return this._x;
        },

        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 1855);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1857);
var transform = this.get("transform");
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1858);
this._x = val;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1859);
if(transform) 
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1861);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 1873);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1875);
return this._y;
        },

        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 1878);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1880);
var transform = this.get("transform");
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1881);
this._y = val;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1882);
if(transform) 
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1884);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 1918);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1919);
var visibility = val ? "visible" : "hidden";
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1920);
if(this.node)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1922);
this.node.style.visibility = visibility;
            }
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1924);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 1972);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1974);
var fill,
				tmpl = this.get("fill") || this._getDefaultFill();
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1976);
fill = (val) ? Y.merge(tmpl, val) : null;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1977);
if(fill && fill.color)
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1979);
if(fill.color === undefined || fill.color == "none")
				{
					_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1981);
fill.color = null;
				}
			}
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1984);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2019);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2021);
var tmpl = this.get("stroke") || this._getDefaultStroke(),
                wt;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2023);
if(val && val.hasOwnProperty("weight"))
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2025);
wt = parseInt(val.weight, 10);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2026);
if(!isNaN(wt))
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2028);
val.weight = wt;
                }
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2031);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "valueFn", 2042);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2044);
var val = "visiblePainted",
				node = this.node;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2046);
if(node)
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2048);
node.setAttribute("pointer-events", val);
			}
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2050);
return val;
		},

		setter: function(val)
		{
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2053);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2055);
var node = this.node;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2056);
if(node)
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2058);
node.setAttribute("pointer-events", val);
			}
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2060);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2074);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2076);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2087);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2089);
if(this.get("node"))
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2091);
this._parsePathData(val);
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2093);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2107);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2109);
return this._graphic;
		}
	}
};
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2113);
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
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2126);
SVGPath = function(cfg)
{
	_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "SVGPath", 2126);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2128);
SVGPath.superclass.constructor.apply(this, arguments);
};
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2130);
SVGPath.NAME = "path";
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2131);
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

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2188);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2199);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2201);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2212);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2214);
var val = Math.max(this._right - this._left, 0);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2215);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2226);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2228);
return Math.max(this._bottom - this._top, 0);
		}
	}
});
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2232);
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
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2243);
SVGRect = function()
{
	_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "SVGRect", 2243);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2245);
SVGRect.superclass.constructor.apply(this, arguments);
};
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2247);
SVGRect.NAME = "rect";
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2248);
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
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2258);
SVGRect.ATTRS = Y.SVGShape.ATTRS;
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2259);
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
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2270);
SVGEllipse = function(cfg)
{
	_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "SVGEllipse", 2270);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2272);
SVGEllipse.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2275);
SVGEllipse.NAME = "ellipse";

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2277);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_draw", 2293);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2295);
var node = this.node,
			w = this.get("width"),
			h = this.get("height"),
			x = this.get("x"),
			y = this.get("y"),
			xRadius = w * 0.5,
			yRadius = h * 0.5,
			cx = x + xRadius,
			cy = y + yRadius;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2304);
node.setAttribute("rx", xRadius);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2305);
node.setAttribute("ry", yRadius);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2306);
node.setAttribute("cx", cx);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2307);
node.setAttribute("cy", cy);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2308);
this._fillChangeHandler();
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2309);
this._strokeChangeHandler();
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2310);
this._updateTransform();
	}
});

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2314);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2322);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2324);
this.set("width", val * 2);
		},

		getter: function()
		{
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2327);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2329);
var val = this.get("width");
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2330);
if(val) 
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2332);
val *= 0.5;
			}
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2334);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2346);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2348);
this.set("height", val * 2);
		},

		getter: function()
		{
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2351);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2353);
var val = this.get("height");
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2354);
if(val) 
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2356);
val *= 0.5;
			}
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2358);
return val;
		}
	}
});
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2362);
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
 _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2373);
SVGCircle = function(cfg)
 {
    _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "SVGCircle", 2373);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2375);
SVGCircle.superclass.constructor.apply(this, arguments);
 };
    
 _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2378);
SVGCircle.NAME = "circle";

 _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2380);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_draw", 2397);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2399);
var node = this.node,
            x = this.get("x"),
            y = this.get("y"),
            radius = this.get("radius"),
            cx = x + radius,
            cy = y + radius;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2405);
node.setAttribute("r", radius);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2406);
node.setAttribute("cx", cx);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2407);
node.setAttribute("cy", cy);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2408);
this._fillChangeHandler();
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2409);
this._strokeChangeHandler();
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2410);
this._updateTransform();
    }
 });
    
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2414);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2422);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2424);
this.set("radius", val/2);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2425);
return val;
        },

        getter: function()
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2428);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2430);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2441);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2443);
this.set("radius", val/2);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2444);
return val;
        },

        getter: function()
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2447);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2449);
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
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2463);
Y.SVGCircle = SVGCircle;
/**
 * Draws pie slices
 *
 * @module graphics
 * @class SVGPieSlice
 * @constructor
 */
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2471);
SVGPieSlice = function()
{
	_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "SVGPieSlice", 2471);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2473);
SVGPieSlice.superclass.constructor.apply(this, arguments);
};
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2475);
SVGPieSlice.NAME = "svgPieSlice";
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2476);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_draw", 2492);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2494);
var x = this.get("cx"),
            y = this.get("cy"),
            startAngle = this.get("startAngle"),
            arc = this.get("arc"),
            radius = this.get("radius");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2499);
this.clear();
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2500);
this.drawWedge(x, y, startAngle, arc, radius);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2501);
this.end();
	}
 }, Y.SVGDrawing.prototype));
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2504);
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
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2542);
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
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2553);
SVGGraphic = function(cfg) {
    _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "SVGGraphic", 2553);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2554);
SVGGraphic.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2557);
SVGGraphic.NAME = "svgGraphic";

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2559);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "valueFn", 2575);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2577);
return Y.guid();
		},

		setter: function(val)
		{
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2580);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2582);
var node = this._node;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2583);
if(node)
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2585);
node.setAttribute("id", val);
			}
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2587);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2601);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2603);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2617);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2619);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2633);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2635);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2646);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2648);
if(this._node)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2650);
this._node.style.width = val + "px";
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2652);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2663);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2665);
if(this._node)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2667);
this._node.style.height = val  + "px";
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2669);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2737);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2739);
return this._x;
        },

        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2742);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2744);
this._x = val;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2745);
if(this._node)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2747);
this._node.style.left = val + "px";
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2749);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2760);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2762);
return this._y;
        },

        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2765);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2767);
this._y = val;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2768);
if(this._node)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2770);
this._node.style.top = val + "px";
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2772);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2792);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2794);
this._toggleVisible(val);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2795);
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

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2810);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "set", 2820);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2822);
var host = this,
            redrawAttrs = {
                autoDraw: true,
                autoSize: true,
                preserveAspectRatio: true,
                resizeDown: true
            },
            key,
            forceRedraw = false;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2831);
AttributeLite.prototype.set.apply(host, arguments);	
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2832);
if(host._state.autoDraw === true && Y.Object.size(this._shapes) > 0)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2834);
if(Y_LANG.isString && redrawAttrs[attr])
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2836);
forceRedraw = true;
            }
            else {_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2838);
if(Y_LANG.isObject(attr))
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2840);
for(key in redrawAttrs)
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2842);
if(redrawAttrs.hasOwnProperty(key) && attr[key])
                    {
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2844);
forceRedraw = true;
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2845);
break;
                    }
                }
            }}
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2850);
if(forceRedraw)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2852);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getXY", 2880);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2882);
var node = Y.one(this._node),
            xy;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2884);
if(node)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2886);
xy = node.getXY();
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2888);
return xy;
    },

    /**
     * Initializes the class.
     *
     * @method initializer
     * @private
     */
    initializer: function() {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "initializer", 2897);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2898);
var render = this.get("render"),
            visibility = this.get("visible") ? "visible" : "hidden";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2900);
this._shapes = {};
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2901);
this._contentBounds = {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        };
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2907);
this._gradients = {};
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2908);
this._node = DOCUMENT.createElement('div');
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2909);
this._node.style.position = "absolute";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2910);
this._node.style.left = this.get("x") + "px";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2911);
this._node.style.top = this.get("y") + "px";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2912);
this._node.style.visibility = visibility;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2913);
this._contentNode = this._createGraphics();
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2914);
this._contentNode.style.visibility = visibility;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2915);
this._contentNode.setAttribute("id", this.get("id"));
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2916);
this._node.appendChild(this._contentNode);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2917);
if(render)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2919);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "render", 2929);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2930);
var parentNode = Y.one(render),
            w = this.get("width") || parseInt(parentNode.getComputedStyle("width"), 10),
            h = this.get("height") || parseInt(parentNode.getComputedStyle("height"), 10);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2933);
parentNode = parentNode || Y.one(DOCUMENT.body);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2934);
parentNode.append(this._node);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2935);
this.parentNode = parentNode;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2936);
this.set("width", w);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2937);
this.set("height", h);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2938);
return this;
    },

    /**
     * Removes all nodes.
     *
     * @method destroy
     */
    destroy: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "destroy", 2946);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2948);
this.removeAllShapes();
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2949);
if(this._contentNode)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2951);
this._removeChildren(this._contentNode);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2952);
if(this._contentNode.parentNode)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2954);
this._contentNode.parentNode.removeChild(this._contentNode);
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2956);
this._contentNode = null;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2958);
if(this._node)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2960);
this._removeChildren(this._node);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2961);
Y.one(this._node).remove(true);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2962);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "addShape", 2973);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2975);
cfg.graphic = this;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2976);
if(!this.get("visible"))
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2978);
cfg.visible = false;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2980);
var shapeClass = this._getShapeClass(cfg.type),
            shape = new shapeClass(cfg);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2982);
this._appendShape(shape);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2983);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_appendShape", 2993);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2995);
var node = shape.node,
            parentNode = this._frag || this._contentNode;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2997);
if(this.get("autoDraw")) 
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2999);
parentNode.appendChild(node);
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3003);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "removeShape", 3013);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3015);
if(!(shape instanceof SVGShape))
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3017);
if(Y_LANG.isString(shape))
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3019);
shape = this._shapes[shape];
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3022);
if(shape && shape instanceof SVGShape)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3024);
shape._destroy();
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3025);
delete this._shapes[shape.get("id")];
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3027);
if(this.get("autoDraw")) 
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3029);
this._redraw();
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3031);
return shape;
    },

    /**
     * Removes all shape instances from the dom.
     *
     * @method removeAllShapes
     */
    removeAllShapes: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "removeAllShapes", 3039);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3041);
var shapes = this._shapes,
            i;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3043);
for(i in shapes)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3045);
if(shapes.hasOwnProperty(i))
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3047);
shapes[i]._destroy();
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3050);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_removeChildren", 3060);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3062);
if(node.hasChildNodes())
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3064);
var child;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3065);
while(node.firstChild)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3067);
child = node.firstChild;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3068);
this._removeChildren(child);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3069);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "clear", 3079);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3080);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_toggleVisible", 3090);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3092);
var i,
            shapes = this._shapes,
            visibility = val ? "visible" : "hidden";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3095);
if(shapes)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3097);
for(i in shapes)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3099);
if(shapes.hasOwnProperty(i))
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3101);
shapes[i].set("visible", val);
                }
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3105);
if(this._contentNode)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3107);
this._contentNode.style.visibility = visibility;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3109);
if(this._node)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3111);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_getShapeClass", 3123);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3125);
var shape = this._shapeClass[val];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3126);
if(shape)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3128);
return shape;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3130);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getShapeById", 3155);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3157);
var shape = this._shapes[id];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3158);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "batch", 3167);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3169);
var autoDraw = this.get("autoDraw");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3170);
this.set("autoDraw", false);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3171);
method();
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3172);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_getDocFrag", 3182);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3184);
if(!this._frag)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3186);
this._frag = DOCUMENT.createDocumentFragment();
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3188);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_redraw", 3197);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3199);
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
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3213);
if(autoSize)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3215);
if(autoSize == "sizeContentToGraphic")
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3217);
node = Y.one(this._node);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3218);
computedWidth = parseFloat(node.getComputedStyle("width"));
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3219);
computedHeight = parseFloat(node.getComputedStyle("height"));
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3220);
computedLeft = computedTop = 0;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3221);
this._contentNode.setAttribute("preserveAspectRatio", preserveAspectRatio);
            }
            else 
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3225);
computedWidth = width;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3226);
computedHeight = height;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3227);
computedLeft = left;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3228);
computedTop = top;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3229);
this._state.width = width;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3230);
this._state.height = height;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3231);
if(this._node)
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3233);
this._node.style.width = width + "px";
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3234);
this._node.style.height = height + "px";
                }
            }
        }
        else
        {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3240);
computedWidth = width;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3241);
computedHeight = height;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3242);
computedLeft = left;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3243);
computedTop = top;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3245);
if(this._contentNode)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3247);
this._contentNode.style.left = computedLeft + "px";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3248);
this._contentNode.style.top = computedTop + "px";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3249);
this._contentNode.setAttribute("width", computedWidth);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3250);
this._contentNode.setAttribute("height", computedHeight);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3251);
this._contentNode.style.width = computedWidth + "px";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3252);
this._contentNode.style.height = computedHeight + "px";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3253);
this._contentNode.setAttribute("viewBox", "" + left + " " + top + " " + width + " " + height + "");
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3255);
if(this._frag)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3257);
if(this._contentNode)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3259);
this._contentNode.appendChild(this._frag);
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3261);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "addToRedrawQueue", 3273);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3275);
var shapeBox,
            box;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3277);
this._shapes[shape.get("id")] = shape;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3278);
if(!this.get("resizeDown"))
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3280);
shapeBox = shape.getBounds();
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3281);
box = this._contentBounds;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3282);
box.left = box.left < shapeBox.left ? box.left : shapeBox.left;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3283);
box.top = box.top < shapeBox.top ? box.top : shapeBox.top;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3284);
box.right = box.right > shapeBox.right ? box.right : shapeBox.right;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3285);
box.bottom = box.bottom > shapeBox.bottom ? box.bottom : shapeBox.bottom;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3286);
box.width = box.right - box.left;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3287);
box.height = box.bottom - box.top;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3288);
this._contentBounds = box;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3290);
if(this.get("autoDraw")) 
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3292);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_getUpdatedContentBounds", 3303);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3305);
var bounds,
            i,
            shape,
            queue = this._shapes,
            box = {};
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3310);
for(i in queue)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3312);
if(queue.hasOwnProperty(i))
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3314);
shape = queue[i];
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3315);
bounds = shape.getBounds();
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3316);
box.left = Y_LANG.isNumber(box.left) ? Math.min(box.left, bounds.left) : bounds.left;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3317);
box.top = Y_LANG.isNumber(box.top) ? Math.min(box.top, bounds.top) : bounds.top;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3318);
box.right = Y_LANG.isNumber(box.right) ? Math.max(box.right, bounds.right) : bounds.right;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3319);
box.bottom = Y_LANG.isNumber(box.bottom) ? Math.max(box.bottom, bounds.bottom) : bounds.bottom;
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3322);
box.left = Y_LANG.isNumber(box.left) ? box.left : 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3323);
box.top = Y_LANG.isNumber(box.top) ? box.top : 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3324);
box.right = Y_LANG.isNumber(box.right) ? box.right : 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3325);
box.bottom = Y_LANG.isNumber(box.bottom) ? box.bottom : 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3326);
this._contentBounds = box;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3327);
return box;
    },

    /**
     * Creates a contentNode element
     *
     * @method _createGraphics
     * @private
     */
    _createGraphics: function() {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_createGraphics", 3336);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3337);
var contentNode = this._createGraphicNode("svg"),
            pointerEvents = this.get("pointerEvents");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3339);
contentNode.style.position = "absolute";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3340);
contentNode.style.top = "0px";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3341);
contentNode.style.left = "0px";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3342);
contentNode.style.overflow = "auto";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3343);
contentNode.setAttribute("overflow", "auto");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3344);
contentNode.setAttribute("pointer-events", pointerEvents);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3345);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_createGraphicNode", 3357);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3359);
var node = DOCUMENT.createElementNS("http://www.w3.org/2000/svg", "svg:" + type),
            v = pe || "none";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3361);
if(type !== "defs" && type !== "stop" && type !== "linearGradient" && type != "radialGradient")
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3363);
node.setAttribute("pointer-events", v);
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3365);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getGradientNode", 3377);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3379);
var gradients = this._gradients,
            gradient,
            nodeType = type + "Gradient";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3382);
if(gradients.hasOwnProperty(key) && gradients[key].tagName.indexOf(type) > -1)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3384);
gradient = this._gradients[key];
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3388);
gradient = this._createGraphicNode(nodeType);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3389);
if(!this._defs)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3391);
this._defs = this._createGraphicNode("defs");
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3392);
this._contentNode.appendChild(this._defs);
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3394);
this._defs.appendChild(gradient);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3395);
key = key || "gradient" + Math.round(100000 * Math.random());
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3396);
gradient.setAttribute("id", key);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3397);
if(gradients.hasOwnProperty(key))
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3399);
this._defs.removeChild(gradients[key]);
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3401);
gradients[key] = gradient;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3403);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_toFront", 3413);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3415);
var contentNode = this._contentNode;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3416);
if(shape instanceof Y.SVGShape)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3418);
shape = shape.get("node");
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3420);
if(contentNode && shape)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3422);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_toBack", 3433);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3435);
var contentNode = this._contentNode,
            targetNode;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3437);
if(shape instanceof Y.SVGShape)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3439);
shape = shape.get("node");
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3441);
if(contentNode && shape)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3443);
targetNode = contentNode.firstChild;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3444);
if(targetNode)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3446);
contentNode.insertBefore(shape, targetNode);
            }
            else
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3450);
contentNode.appendChild(shape);
            }
        }
    }
});

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3456);
Y.SVGGraphic = SVGGraphic;



}, '@VERSION@', {"requires": ["graphics"]});
