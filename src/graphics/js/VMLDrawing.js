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
Y.extend(VMLDrawing, Y.DrawingBase, Y.mix({
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
        this._path = this._path || "";
        if(this._movePath)
        {
            this._path += this._movePath;
            this._movePath = null;
        }
        this._path += val;
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
        var w,
            h,
            x,
            y,
            cp1x,
            cp1y,
            cp2x,
            cp2y,
            pts,
            right,
            left,
            bottom,
            top,
            i,
            len,
            path,
            command = relative ? " v " : " c ",
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        len = args.length - 5;
        path = command;
        for(i = 0; i < len; i = i + 6)
        {
            cp1x = parseFloat(args[i]);
            cp1y = parseFloat(args[i + 1]);
            cp2x = parseFloat(args[i + 2]);
            cp2y = parseFloat(args[i + 3]);
            x = parseFloat(args[i + 4]);
            y = parseFloat(args[i + 5]);
            if(i > 0)
            {
                path = path + ", ";
            }
            path = path + this._round(cp1x) + ", " + this._round(cp1y) + ", " + this._round(cp2x) + ", " + this._round(cp2y) + ", " + this._round(x) + ", " + this._round(y);
            cp1x = cp1x + relativeX;
            cp1y = cp1y + relativeY;
            cp2x = cp2x + relativeX;
            cp2y = cp2y + relativeY;
            x = x + relativeX;
            y = y + relativeY;
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
        this._addToPath(path);
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
            cp1x,
            cp1y,
            cp2x,
            cp2y,
            x,
            y,
            currentX = this._currentX,
            currentY = this._currentY,
            i,
            len = args.length - 3,
            bezierArgs = [],
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        for(i = 0; i < len; i = i + 4)
        {
            cpx = parseFloat(args[i]) + relativeX;
            cpy = parseFloat(args[i + 1]) + relativeY;
            x = parseFloat(args[i + 2]) + relativeX;
            y = parseFloat(args[i + 3]) + relativeY;
            cp1x = currentX + 0.67*(cpx - currentX);
            cp1y = currentY + 0.67*(cpy - currentY);
            cp2x = cp1x + (x - currentX) * 0.34;
            cp2y = cp1y + (y - currentY) * 0.34;
            bezierArgs.push(cp1x);
            bezierArgs.push(cp1y);
            bezierArgs.push(cp2x);
            bezierArgs.push(cp2y);
            bezierArgs.push(x);
            bezierArgs.push(y);
        }
        this._curveTo.apply(this, [bezierArgs, false]);
    },

    /**
     * Draws a circle. Used internally by `CanvasCircle` class.
     *
     * @method drawCircle
     * @param {Number} x y-coordinate
     * @param {Number} y x-coordinate
     * @param {Number} r radius
     * @chainable
     * @protected
     */
	drawCircle: function(x, y, radius) {
        var startAngle = 0,
            endAngle = 360,
            circum = radius * 2;

        endAngle *= 65535;
        this._drawingComplete = false;
        this._trackSize(x + circum, y + circum);
        this.moveTo((x + circum), (y + radius));
        this._addToPath(" ae " + this._round(x + radius) + ", " + this._round(y + radius) + ", " + this._round(radius) + ", " + this._round(radius) + ", " + startAngle + ", " + endAngle);
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
        var startAngle = 0,
            endAngle = 360,
            radius = w * 0.5,
            yRadius = h * 0.5;
        endAngle *= 65535;
        this._drawingComplete = false;
        this._trackSize(x + w, y + h);
        this.moveTo((x + w), (y + yRadius));
        this._addToPath(" ae " + this._round(x + radius) + ", " + this._round(x + radius) + ", " + this._round(y + yRadius) + ", " + this._round(radius) + ", " + this._round(yRadius) + ", " + startAngle + ", " + endAngle);
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
    drawWedge: function(x, y, startAngle, arc, radius)
    {
        var diameter = radius * 2;
        if(Math.abs(arc) > 360)
        {
            arc = 360;
        }
        this._currentX = x;
        this._currentY = y;
        startAngle *= -65535;
        arc *= 65536;
        startAngle = Math.round(startAngle);
        arc = Math.round(arc);
        this.moveTo(x, y);
        this._addToPath(" ae " + this._round(x) + ", " + this._round(y) + ", " + this._round(radius) + " " + this._round(radius) + ", " +  startAngle + ", " + arc);
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
            x,
            y,
            path = relative ? " r " : " l ",
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        if (typeof point1 == "string" || typeof point1 == "number") {
            len = args.length - 1;
            for (i = 0; i < len; i = i + 2) {
                x = parseFloat(args[i]);
                y = parseFloat(args[i + 1]);
                path += ' ' + this._round(x) + ', ' + this._round(y);
                x = x + relativeX;
                y = y + relativeY;
                this._currentX = x;
                this._currentY = y;
                this._trackSize.apply(this, [x, y]);
            }
        }
        else
        {
            len = args.length;
            for (i = 0; i < len; i = i + 1) {
                x = parseFloat(args[i][0]);
                y = parseFloat(args[i][1]);
                path += ' ' + this._round(x) + ', ' + this._round(y);
                x = x + relativeX;
                y = y + relativeY;
                this._currentX = x;
                this._currentY = y;
                this._trackSize.apply(this, [x, y]);
            }
        }
        this._addToPath(path);
        return this;
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
        var x = parseFloat(args[0]),
            y = parseFloat(args[1]),
            command = relative ? " t " : " m ",
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        this._movePath = command + this._round(x) + ", " + this._round(y);
        x = x + relativeX;
        y = y + relativeY;
        this._trackSize(x, y);
        this._currentX = x;
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
        var fill = this.get("fill"),
            stroke = this.get("stroke"),
            node = this.node,
            w = this.get("width"),
            h = this.get("height"),
            path = this._path,
            pathEnd = "",
            multiplier = this._coordSpaceMultiplier;
        this._fillChangeHandler();
        this._strokeChangeHandler();
        if(path)
        {
            if(fill && fill.color)
            {
                pathEnd += ' x';
            }
            if(stroke)
            {
                pathEnd += ' e';
            }
        }
        if(path)
        {
            node.path = path + pathEnd;
        }
        if(!isNaN(w) && !isNaN(h))
        {
            node.coordOrigin = this._left + ", " + this._top;
            node.coordSize = (w * multiplier) + ", " + (h * multiplier);
            node.style.position = "absolute";
            node.style.width =  w + "px";
            node.style.height =  h + "px";
        }
        this._path = path;
        this._movePath = null;
        this._updateTransform();
    },

    /**
     * Ends a fill and stroke
     *
     * @method closePath
     * @chainable
     */
    closePath: function()
    {
        this._addToPath(" x e");
        return this;
    },

    /**
     * Clears the path.
     *
     * @method clear
     * @chainable
     */
    clear: function()
    {
		this._right = 0;
        this._bottom = 0;
        this._width = 0;
        this._height = 0;
        this._left = 0;
        this._top = 0;
        this._path = "";
        this._movePath = null;
        return this;
    },

    _left: 0,

    _right: 0,

    _top: 0,

    _bottom: 0,

    _width: 0,

    _height: 0
}, Y.DrawingBase.prototype));
Y.VMLDrawing = VMLDrawing;
