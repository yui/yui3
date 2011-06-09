Y.log('using VML');
var Y_LANG = Y.Lang,
    IS_NUM = Y_LANG.isNumber,
    IS_ARRAY = Y_LANG.isArray,
    Y_DOM = Y.DOM,
    Y_SELECTOR = Y.Selector,
    DOCUMENT = Y.config.doc,
    AttributeLite = Y.AttributeLite,
    PluginHost = Y.Plugin.Host,
	VMLShape,
	VMLCircle,
	VMLPath,
	VMLRect,
	VMLEllipse,
	VMLGraphic;

function VMLDrawing() {}

VMLDrawing.prototype = {
    /**
     * @private
     */
    _currentX: 0,

    /**
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
        var hiX,
            loX,
            hiY,
            loY;
        x = Math.round(x);
        y = Math.round(y);
        this._path += ' c ' + Math.round(cp1x) + ", " + Math.round(cp1y) + ", " + Math.round(cp2x) + ", " + Math.round(cp2y) + ", " + x + ", " + y;
        this._currentX = x;
        this._currentY = y;
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
        var currentX = this._currentX,
            currentY = this._currentY,
            cp1x = currentX + 0.67*(cpx - currentX),
            cp1y = currentY + 0.67*(cpy - currentY),
            cp2x = cp1x + (x - currentX) * 0.34,
            cp2y = cp1y + (y - currentY) * 0.34;
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
        this.moveTo(x, y);
        this.lineTo(x + w, y);
        this.lineTo(x + w, y + h);
        this.lineTo(x, y + h);
        this.lineTo(x, y);
        this._currentX = x;
        this._currentY = y;
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
        this.moveTo(x, y + eh);
        this.lineTo(x, y + h - eh);
        this.quadraticCurveTo(x, y + h, x + ew, y + h);
        this.lineTo(x + w - ew, y + h);
        this.quadraticCurveTo(x + w, y + h, x + w, y + h - eh);
        this.lineTo(x + w, y + eh);
        this.quadraticCurveTo(x + w, y, x + w - ew, y);
        this.lineTo(x + ew, y);
        this.quadraticCurveTo(x, y, x, y + eh);
        return this;
    },

    /**
     * Draws a wedge.
     * 
     * @param {Number} x			x-coordinate of the wedge's center point
     * @param {Number} y			y-coordinate of the wedge's center point
     * @param {Number} startAngle	starting angle in degrees
     * @param {Number} arc			sweep of the wedge. Negative values draw clockwise.
     * @param {Number} radius		radius of wedge. If [optional] yRadius is defined, then radius is the x radius.
     * @param {Number} yRadius		[optional] y radius for wedge.
     */
    drawWedge: function(x, y, startAngle, arc, radius, yRadius)
    {
        var diameter = radius * 2;
        yRadius = yRadius || radius;
        this._path += this._getWedgePath({x:x, y:y, startAngle:startAngle, arc:arc, radius:radius, yRadius:yRadius});
        this._trackSize(diameter, diameter); 
        this._currentX = x;
        this._currentY = y;
        return this;
    },

    /**
     * Generates a path string for a wedge shape
     *
     * @method _getWedgePath
     * @param {Object} config attributes used to create the path
     * @return String
     * @private
     */
    _getWedgePath: function(config)
    {
        var x = config.x,
            y = config.y,
            startAngle = config.startAngle,
            arc = config.arc,
            radius = config.radius,
            yRadius = config.yRadius || radius,
            path;  
        if(Math.abs(arc) > 360)
        {
            arc = 360;
        }
        startAngle *= -65535;
        arc *= 65536;
        path = " m " + x + " " + y + " ae " + x + " " + y + " " + radius + " " + yRadius + " " + startAngle + " " + arc;
        return path;
    },
    
    /**
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function() {
        this._draw();
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
            len;
        if (typeof point1 === 'string' || typeof point1 === 'number') {
            args = [[point1, point2]];
        }
        len = args.length;
        if(!this._path)
        {
            this._path = "";
        }
        this._path += ' l ';
        for (i = 0; i < len; ++i) {
            this._path += ' ' + Math.round(args[i][0]) + ', ' + Math.round(args[i][1]);
            this._trackSize.apply(this, args[i]);
            this._currentX = args[i][0];
            this._currentY = args[i][1];
        }
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
        if(!this._path)
        {
            this._path = "";
        }
        this._path += ' m ' + Math.round(x) + ', ' + Math.round(y);
        this._trackSize(x, y);
        this._currentX = x;
        this._currentY = y;
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
        var wid = this._width || 0,
            ht = this._height || 0;
        if (w > wid) {
            this._width = w;
        }
        if (h > ht) {
            this._height = h;
        }
    },

    _width: 0,

    _height: 0
};
Y.VMLDrawing = VMLDrawing;
