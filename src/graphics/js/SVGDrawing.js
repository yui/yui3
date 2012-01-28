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
    DOCUMENT = Y.config.doc;

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
SVGDrawing.prototype = {
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
        var pathArrayLen,
            currentArray,
            hiX,
            loX,
            hiY,
            loY;
        if(this._pathType !== "C")
        {
            this._pathType = "C";
            currentArray = ["C"];
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
        this._pathArray[pathArrayLen] = this._pathArray[pathArrayLen].concat([Math.round(cp1x), Math.round(cp1y), Math.round(cp2x) , Math.round(cp2y), x, y]);
        hiX = Math.max(x, Math.max(cp1x, cp2x));
        hiY = Math.max(y, Math.max(cp1y, cp2y));
        loX = Math.min(x, Math.min(cp1x, cp2x));
        loY = Math.min(y, Math.min(cp1y, cp2y));
        this._trackSize(hiX, hiY);
        this._trackSize(loX, loY);
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
        var pathArrayLen,
            currentArray,
            hiX,
            loX,
            hiY,
            loY;
        if(this._pathType !== "Q")
        {
            this._pathType = "Q";
            currentArray = ["Q"];
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
        this._pathArray[pathArrayLen] = this._pathArray[pathArrayLen].concat([Math.round(cpx), Math.round(cpy), Math.round(x), Math.round(y)]);
        hiX = Math.max(x, cpx);
        hiY = Math.max(y, cpy);
        loX = Math.min(x, cpx);
        loY = Math.min(y, cpy);
        this._trackSize(hiX, hiY);
        this._trackSize(loX, loY);
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
        this.moveTo(x, y);
        this.lineTo(x + w, y);
        this.lineTo(x + w, y + h);
        this.lineTo(x, y + h);
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
        this.moveTo(x, y + eh);
        this.lineTo(x, y + h - eh);
        this.quadraticCurveTo(x, y + h, x + ew, y + h);
        this.lineTo(x + w - ew, y + h);
        this.quadraticCurveTo(x + w, y + h, x + w, y + h - eh);
        this.lineTo(x + w, y + eh);
        this.quadraticCurveTo(x + w, y, x + w - ew, y);
        this.lineTo(x + ew, y);
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
        var circum = radius * 2;
        this._drawingComplete = false;
        this._trackSize(x, y);
        this._trackSize(x + circum, y + circum);
        this._pathArray = this._pathArray || [];
        this._pathArray.push(["M", x + radius, y]);
        this._pathArray.push(["A",  radius, radius, 0, 1, 0, x + radius, y + circum]);
        this._pathArray.push(["A",  radius, radius, 0, 1, 0, x + radius, y]);
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
        var radius = w * 0.5,
            yRadius = h * 0.5;
        this._drawingComplete = false;
        this._trackSize(x, y);
        this._trackSize(x + w, y + h);
        this._pathArray = this._pathArray || [];
        this._pathArray.push(["M", x + radius, y]);
        this._pathArray.push(["A",  radius, yRadius, 0, 1, 0, x + radius, y + h]);
        this._pathArray.push(["A",  radius, yRadius, 0, 1, 0, x + radius, y]);
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
            i = 0,
            diameter = radius * 2,
            currentArray,
            pathArrayLen;
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
            for(; i < segs; ++i)
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
        this._trackSize(diameter, diameter); 
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
        var args = arguments,
            i,
            len,
            pathArrayLen,
            currentArray;
        this._pathArray = this._pathArray || [];
        if (typeof point1 === 'string' || typeof point1 === 'number') {
            args = [[point1, point2]];
        }
        len = args.length;
        this._shapeType = "path";
        if(this._pathType !== "L")
        {
            this._pathType = "L";
            currentArray = ['L'];
            this._pathArray.push(currentArray);
        }
        else
        {
            currentArray = this._getCurrentArray();
        }
        pathArrayLen = this._pathArray.length - 1;
        for (i = 0; i < len; ++i) {
            this._pathArray[pathArrayLen].push(args[i][0]);
            this._pathArray[pathArrayLen].push(args[i][1]);
            this._trackSize.apply(this, args[i]);
        }
    },

    _getCurrentArray: function()
    {
        var currentArray = this._pathArray[Math.max(0, this._pathArray.length - 1)];
        if(!currentArray)
        {
            currentArray = [];
            this._pathArray.push(currentArray);
        }
        return currentArray;
    },

    /**
     * Moves the current drawing position to specified x and y coordinates.
     *
     * @method moveTo
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     */
    moveTo: function(x, y) {
        var pathArrayLen,
            currentArray;
        this._pathArray = this._pathArray || [];
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
        this._pathArray[pathArrayLen] = this._pathArray[pathArrayLen].concat([x, y]);
        this._trackSize(x, y);
    },
 
    /**
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function()
    {
        this._closePath();
        this._graphic.addToRedrawQueue(this);    
    },

    /**
     * Clears the path.
     *
     * @method clear
     */
    clear: function()
    {
        this._width = 0;
        this._height = 0;
        this._left = 0;
        this._right = 0;
        this._top = 0;
        this._bottom = 0;
        this._pathArray = [];
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
                else if(pathType != "z")
                {
                    path += " " + pathType + (segmentArray[1] - left);
                }
                else
                {
                    path += " z ";
                }
                switch(pathType)
                {
                    case "L" :
                    case "M" :
                    case "Q" :
                        for(i = 2; i < len; ++i)
                        {
                            val = (i % 2 === 0) ? top : left;
                            val = segmentArray[i] - val;
                            path += ", " + val;
                        }
                    break;
                    case "A" :
                        val = " " + segmentArray[3] + " " + segmentArray[4];
                        val += "," + segmentArray[5] + " " + (segmentArray[6] - left);
                        val += "," + (segmentArray[7] - top);
                        path += " " + val;
                    break;
                    case "C" :
                        for(i = 2; i < len; ++i)
                        {
                            val = (i % 2 === 0) ? top : left;
                            val2 = segmentArray[i];
                            val2 -= val;
                            path += " " + val2;
                        }
                    break;
                }
            }
            if(fill && fill.color)
            {
                path += 'z';
            }
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
     */
    closePath: function()
    {
        this._pathArray.push(["z"]);
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
    }
};
Y.SVGDrawing = SVGDrawing;
