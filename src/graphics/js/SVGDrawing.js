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
Y.extend(SVGDrawing, Y.DrawingBase, Y.mix({
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
            pts,
            cp1x,
            cp1y,
            cp2x,
            cp2y,
            x,
            y,
            right,
            left,
            bottom,
            top,
            i,
            len,
            pathArrayLen,
            currentArray,
            command = relative ? "c" : "C",
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        this._pathArray = this._pathArray || [];
        if(this._pathType !== command)
        {
            this._pathType = command;
            currentArray = [command];
            this._pathArray.push(currentArray);
        }
        else
        {
            currentArray = this._pathArray[Math.max(0, this._pathArray.length - 1)];
            if(!currentArray)
            {
                currentArray = [];
                this._pathArray.push(currentArray);
            }
        }
        pathArrayLen = this._pathArray.length - 1;
        this._pathArray[pathArrayLen] = this._pathArray[pathArrayLen].concat(args);
        len = args.length - 5;
        for(i = 0; i < len; i = i + 6)
        {
            cp1x = parseFloat(args[i]) + relativeX;
            cp1y = parseFloat(args[i + 1]) + relativeY;
            cp2x = parseFloat(args[i + 2]) + relativeX;
            cp2y = parseFloat(args[i + 3]) + relativeY;
            x = parseFloat(args[i + 4]) + relativeX;
            y = parseFloat(args[i + 5]) + relativeY;
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
            pathArrayLen,
            currentArray,
            w,
            h,
            pts,
            right,
            left,
            bottom,
            top,
            i,
            len,
            command = relative ? "q" : "Q",
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        this._pathArray = this._pathArray || [];
        if(this._pathType !== command)
        {
            this._pathType = command;
            currentArray = [command];
            this._pathArray.push(currentArray);
        }
        else
        {
            currentArray = this._pathArray[Math.max(0, this._pathArray.length - 1)];
            if(!currentArray)
            {
                currentArray = [];
                this._pathArray.push(currentArray);
            }
        }
        pathArrayLen = this._pathArray.length - 1;
        this._pathArray[pathArrayLen] = this._pathArray[pathArrayLen].concat(args);
        len = args.length - 3;
        for(i = 0; i < len; i = i + 4)
        {
            cpx = parseFloat(args[i]) + relativeX;
            cpy = parseFloat(args[i + 1]) + relativeY;
            x = parseFloat(args[i + 2]) + relativeX;
            y = parseFloat(args[i + 3]) + relativeY;
            right = Math.max(x, cpx);
            bottom = Math.max(y, cpy);
            left = Math.min(x, cpx);
            top = Math.min(y, cpy);
            w = Math.abs(right - left);
            h = Math.abs(bottom - top);
            pts = [[this._currentX, this._currentY] , [cpx, cpy], [x, y]];
            this._setCurveBoundingBox(pts, w, h);
            this._currentX = x;
            this._currentY = y;
        }
    },

    /**
     * Draws a circle.
     *
     * @method drawCircle
     * @param {Number} x y-coordinate
     * @param {Number} y x-coordinate
     * @param {Number} r radius
     * @chainable
     * @protected
     */
	drawCircle: function(x, y, radius) {
        var circum = radius * 2;
        this._drawingComplete = false;
        this._trackSize(x, y);
        this._trackSize(x + circum, y + circum);
        this._pathArray = this._pathArray || [];
        this._pathArray.push(["M", x + radius, y]);
        this._pathArray.push(["A",  radius, radius, 0, 1, 0, x + radius, y + circum]);
        this._pathArray.push(["A",  radius, radius, 0, 1, 0, x + radius, y]);
        this._currentX = x;
        this._currentY = y;
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
        var radius = w * 0.5,
            yRadius = h * 0.5;
        this._drawingComplete = false;
        this._trackSize(x, y);
        this._trackSize(x + w, y + h);
        this._pathArray = this._pathArray || [];
        this._pathArray.push(["M", x + radius, y]);
        this._pathArray.push(["A",  radius, yRadius, 0, 1, 0, x + radius, y + h]);
        this._pathArray.push(["A",  radius, yRadius, 0, 1, 0, x + radius, y]);
        this._currentX = x;
        this._currentY = y;
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
            i,
            diameter = radius * 2,
            currentArray,
            pathArrayLen;
        this._pathArray = this._pathArray || [];
        yRadius = yRadius || radius;
        if(this._pathType != "M")
        {
            this._pathType = "M";
            currentArray = ["M"];
            this._pathArray.push(currentArray);
        }
        else
        {
            currentArray = this._getCurrentArray();
        }
        pathArrayLen = this._pathArray.length - 1;
        this._pathArray[pathArrayLen].push(x);
        this._pathArray[pathArrayLen].push(x);

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
        if(segs > 0)
        {
            // draw a line from the center to the start of the curve
            ax = x + Math.cos(startAngle / 180 * Math.PI) * radius;
            ay = y + Math.sin(startAngle / 180 * Math.PI) * yRadius;
            this._pathType = "L";
            pathArrayLen++;
            this._pathArray[pathArrayLen] = ["L"];
            this._pathArray[pathArrayLen].push(Math.round(ax));
            this._pathArray[pathArrayLen].push(Math.round(ay));
            pathArrayLen++;
            this._pathType = "Q";
            this._pathArray[pathArrayLen] = ["Q"];
            for(i = 0; i < segs; ++i)
            {
                angle += theta;
                angleMid = angle - (theta / 2);
                bx = x + Math.cos(angle) * radius;
                by = y + Math.sin(angle) * yRadius;
                cx = x + Math.cos(angleMid) * (radius / Math.cos(theta / 2));
                cy = y + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));
                this._pathArray[pathArrayLen].push(Math.round(cx));
                this._pathArray[pathArrayLen].push(Math.round(cy));
                this._pathArray[pathArrayLen].push(Math.round(bx));
                this._pathArray[pathArrayLen].push(Math.round(by));
            }
        }
        this._currentX = x;
        this._currentY = y;
        this._trackSize(diameter, diameter);
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
            pathArrayLen,
            currentArray,
            x,
            y,
            command = relative ? "l" : "L",
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        this._pathArray = this._pathArray || [];
        this._shapeType = "path";
        len = args.length;
        if(this._pathType !== command)
        {
            this._pathType = command;
            currentArray = [command];
            this._pathArray.push(currentArray);
        }
        else
        {
            currentArray = this._getCurrentArray();
        }
        pathArrayLen = this._pathArray.length - 1;
        if (typeof point1 === 'string' || typeof point1 === 'number') {
            for (i = 0; i < len; i = i + 2) {
                x = parseFloat(args[i]);
                y = parseFloat(args[i + 1]);
                this._pathArray[pathArrayLen].push(x);
                this._pathArray[pathArrayLen].push(y);
                x = x + relativeX;
                y = y + relativeY;
                this._currentX = x;
                this._currentY = y;
                this._trackSize.apply(this, [x, y]);
            }
        }
        else
        {
            for (i = 0; i < len; ++i) {
                x = parseFloat(args[i][0]);
                y = parseFloat(args[i][1]);
                this._pathArray[pathArrayLen].push(x);
                this._pathArray[pathArrayLen].push(y);
                this._currentX = x;
                this._currentY = y;
                x = x + relativeX;
                y = y + relativeY;
                this._trackSize.apply(this, [x, y]);
            }
        }
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
        var pathArrayLen,
            currentArray,
            x = parseFloat(args[0]),
            y = parseFloat(args[1]),
            command = relative ? "m" : "M",
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        this._pathArray = this._pathArray || [];
        this._pathType = command;
        currentArray = [command];
        this._pathArray.push(currentArray);
        pathArrayLen = this._pathArray.length - 1;
        this._pathArray[pathArrayLen] = this._pathArray[pathArrayLen].concat([x, y]);
        x = x + relativeX;
        y = y + relativeY;
        this._currentX = x;
        this._currentY = y;
        this._trackSize(x, y);
    },

    /**
     * Clears the path.
     *
     * @method clear
     * @chainable
     */
    clear: function()
    {
        this._currentX = 0;
        this._currentY = 0;
        this._width = 0;
        this._height = 0;
        this._left = 0;
        this._right = 0;
        this._top = 0;
        this._bottom = 0;
        this._pathArray = [];
        this._path = "";
        return this;
    },

    /**
     * Draws the path.
     *
     * @method _closePath
     * @private
     */
    _closePath: function()
    {
        var pathArray,
            segmentArray,
            pathType,
            len,
            val,
            val2,
            i,
            path = "",
            node = this.node,
            left = parseFloat(this._left),
            top = parseFloat(this._top),
            fill = this.get("fill");
        if(this._pathArray)
        {
            pathArray = this._pathArray.concat();
            while(pathArray && pathArray.length > 0)
            {
                segmentArray = pathArray.shift();
                len = segmentArray.length;
                pathType = segmentArray[0];
                if(pathType === "A")
                {
                    path += pathType + segmentArray[1] + "," + segmentArray[2];
                }
                else if(pathType == "z" || pathType == "Z")
                {
                    path += " z ";
                }
                else if(pathType == "C" || pathType == "c")
                {
                    path += pathType + (segmentArray[1] - left)+ "," + (segmentArray[2] - top);
                }
                else
                {
                    path += " " + pathType + parseFloat(segmentArray[1] - left);
                }
                switch(pathType)
                {
                    case "L" :
                    case "l" :
                    case "M" :
                    case "Q" :
                    case "q" :
                        for(i = 2; i < len; ++i)
                        {
                            val = (i % 2 === 0) ? top : left;
                            val = segmentArray[i] - val;
                            path += ", " + parseFloat(val);
                        }
                    break;
                    case "A" :
                        val = " " + parseFloat(segmentArray[3]) + " " + parseFloat(segmentArray[4]);
                        val += "," + parseFloat(segmentArray[5]) + " " + parseFloat(segmentArray[6] - left);
                        val += "," + parseFloat(segmentArray[7] - top);
                        path += " " + val;
                    break;
                    case "C" :
                    case "c" :
                        for(i = 3; i < len - 1; i = i + 2)
                        {
                            val = parseFloat(segmentArray[i] - left);
                            val = val + ", ";
                            val = val + parseFloat(segmentArray[i + 1] - top);
                            path += " " + val;
                        }
                    break;
                }
            }
            if(fill && fill.color)
            {
                path += 'z';
            }
            Y.Lang.trim(path);
            if(path)
            {
                node.setAttribute("d", path);
            }

            this._path = path;
            this._fillChangeHandler();
            this._strokeChangeHandler();
            this._updateTransform();
        }
    },

    /**
     * Ends a fill and stroke
     *
     * @method closePath
     * @chainable
     */
    closePath: function()
    {
        this._pathArray.push(["z"]);
        return this;
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
        var currentArray = this._pathArray[Math.max(0, this._pathArray.length - 1)];
        if(!currentArray)
        {
            currentArray = [];
            this._pathArray.push(currentArray);
        }
        return currentArray;
    }
}, Y.DrawingBase.prototype));
Y.SVGDrawing = SVGDrawing;
