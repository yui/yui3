var Graphic = function(config) {
    
    this.initializer.apply(this, arguments);
};

Graphic.prototype = {
    initializer: function(config) {
        config = config || {};
        var w = config.width || 0,
            h = config.height || 0;
        this._svg = this._createGraphics();
        this.setSize(w, h);
        this._initProps();
    },

    /** 
     *Specifies a bitmap fill used by subsequent calls to other Graphics methods (such as lineTo() or drawCircle()) for the object.
     */
    beginBitmapFill: function(config) {
       
        var fill = {};
        fill.src = config.bitmap.src;
        fill.type = "tile";
        this._fillProps = fill;
        if(!isNaN(config.tx) ||
            !isNaN(config.ty) ||
            !isNaN(config.width) ||
            !isNaN(config.height))
        {
            this._gradientBox = {
                tx:config.tx,
                ty:config.ty,
                width:config.width,
                height:config.height
            };
        }
        else
        {
            this._gradientBox = null;
        }
    },

    /**
     * Specifes a solid fill used by subsequent calls to other Graphics methods (such as lineTo() or drawCircle()) for the object.
     */
    beginFill: function(color, alpha) {
        if (color) {
            this._fillAlpha = alpha || 1;
            this._fillColor = color;
            this._fillType = 'solid';
            this._fill = 1;
        }
        return this;
    },
    
    /** 
     *Specifies a gradient fill used by subsequent calls to other Graphics methods (such as lineTo() or drawCircle()) for the object.
     */
    beginGradientFill: function(config) {
        var colors = config.colors,
            alphas = config.alphas || [];
        if(!this._defs)
        {
            this._defs = this._createGraphicNode("defs");
            this._svg.appendChild(this._defs);
        }
        this._fillAlphas = alphas;
        this._fillColors = config.colors;
        this._fillType =  config.type || "linear";
        this._fillRatios = config.ratios || [];
        this._fillRotation = config.rotation || 0;
        this._fillWidth = config.width || null;
        this._fillHeight = config.height || null;
        this._fillX = !isNaN(config.tx) ? config.tx : NaN;
        this._fillY = !isNaN(config.ty) ? config.ty : NaN;
        this._gradientId = "lg" + Math.round(100000 * Math.random());
        return this;
    },

    /**
     * Clears the graphics object.
     */
    clear: function() {
        this._path = '';
    },

    /**
     * Draws a bezier curve
     */
    curveTo: function(cp1x, cp1y, cp2x, cp2y, x, y) {
        this._shapeType = "path";
        if(this._path.indexOf("C") < 0 || this._pathType !== "C")
        {
            this._pathType = "C";
            this._path += ' C';
        }
        this._path += Math.round(cp1x) + ", " + Math.round(cp1y) + ", " + Math.round(cp2x) + ", " + Math.round(cp2y) + ", " + x + ", " + y + " ";
        this._trackSize(x, y);
    },

    /**
     * Draws a quadratic bezier curve
     */
    quadraticCurveTo: function(cpx, cpy, x, y) {
        if(this._path.indexOf("Q") < 0 || this._pathType !== "Q")
        {
            this._pathType = "Q";
            this._path += " Q";
        }
        this._path +=  Math.round(cpx) + " " + Math.round(cpy) + " " + Math.round(x) + " " + Math.round(y);
    },

    /**
     * Draws a circle
     */
	drawCircle: function(x, y, r) {
        this._shape = {
            x:x - r,
            y:y - r,
            w:r * 2,
            h:r * 2
        };
        this._attributes = {cx:x, cy:y, r:r};
        this._width = this._height = r * 2;
        this._x = x - r;
        this._y = y - r;
        this._shapeType = "circle";
        this._draw();
	},

    /**
     * Draws an ellipse
     */
    drawEllipse: function(x, y, w, h) {
        this._shape = {
            x:x,
            y:y,
            w:w,
            h:h
        };
        this._width = w;
        this._height = h;
        this._x = x;
        this._y = y;
        this._shapeType = "ellipse";
        this._draw();
    },

    /**
     * Draws a rectangle
     */
    drawRect: function(x, y, w, h) {
        this._shape = {
            x:x,
            y:y,
            w:w,
            h:h
        };
        this._x = x;
        this._y = y;
        this._width = w;
        this._height = h;
        this.moveTo(x, y);
        this.lineTo(x + w, y);
        this.lineTo(x + w, y + h);
        this.lineTo(x, y + h);
        this.lineTo(x, y);
        this._draw();
    },

    /**
     * Draws a rectangle with rounded corners
     */
    drawRoundRect: function(x, y, w, h, ew, eh) {
        this._shape = {
            x:x,
            y:y,
            w:w,
            h:h
        };
        this._x = x;
        this._y = y;
        this._width = w;
        this._height = h;
        this.moveTo(x, y + eh);
        this.lineTo(x, y + h - eh);
        this.quadraticCurveTo(x, y + h, x + ew, y + h);
        this.lineTo(x + w - ew, y + h);
        this.quadraticCurveTo(x + w, y + h, x + w, y + h - eh);
        this.lineTo(x + w, y + eh);
        this.quadraticCurveTo(x + w, y, x + w - ew, y);
        this.lineTo(x + ew, y);
        this.quadraticCurveTo(x, y, x, y + eh);
        this._draw();
	},

    /**
     * @private
     * Draws a wedge.
     * 
     * @param x				x component of the wedge's center point
     * @param y				y component of the wedge's center point
     * @param startAngle	starting angle in degrees
     * @param arc			sweep of the wedge. Negative values draw clockwise.
     * @param radius		radius of wedge. If [optional] yRadius is defined, then radius is the x radius.
     * @param yRadius		[optional] y radius for wedge.
     */
    drawWedge: function(x, y, startAngle, arc, radius, yRadius)
    {
        this._drawingComplete = false;
        this._path = this._getWedgePath({x:x, y:y, startAngle:startAngle, arc:arc, radius:radius, yRadius:yRadius});
        this._width = radius * 2;
        this._height = this._width;
        this._shapeType = "path";
        this._draw();

    },

    /**
     * @private
     * @description Generates a path string for a wedge shape
     */
    _getWedgePath: function(config)
    {
        var x = config.x,
            y = config.y,
            startAngle = config.startAngle,
            arc = config.arc,
            radius = config.radius,
            yRadius = config.yRadius || radius,
            segs,
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
            path = ' M' + x + ', ' + y;  
        
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
        angle = -(startAngle / 180) * Math.PI;
        if(segs > 0)
        {
            // draw a line from the center to the start of the curve
            ax = x + Math.cos(startAngle / 180 * Math.PI) * radius;
            ay = y + Math.sin(-startAngle / 180 * Math.PI) * yRadius;
            path += " L" + Math.round(ax) + ", " +  Math.round(ay);
            path += " Q";
            for(; i < segs; ++i)
            {
                angle += theta;
                angleMid = angle - (theta / 2);
                bx = x + Math.cos(angle) * radius;
                by = y + Math.sin(angle) * yRadius;
                cx = x + Math.cos(angleMid) * (radius / Math.cos(theta / 2));
                cy = y + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));
                path +=  Math.round(cx) + " " + Math.round(cy) + " " + Math.round(bx) + " " + Math.round(by) + " ";
            }
            path += ' L' + x + ", " + y;
        }
        return path;
    },

    end: function() {
        if(this._shapeType)
        {
            this._draw();
        }
        this._initProps();
    },

    /**
     * @private
     * Not implemented
     * Specifies a gradient to use for the stroke when drawing lines.
     */
    lineGradientStyle: function() {
        Y.log('lineGradientStyle not implemented', 'warn', 'graphics-canvas');
    },
    
    /**
     * Specifies a line style used for subsequent calls to drawing methods
     */
    lineStyle: function(thickness, color, alpha, pixelHinting, scaleMode, caps, joints, miterLimit) {
        this._stroke = 1;
        this._strokeWeight = thickness;
        if (color) {
            this._strokeColor = color;
        }
        this._strokeAlpha = alpha || 1;
    },

    /**
     * Draws a line segment using the current line style from the current drawing position to the specified x and y coordinates.
     */
    lineTo: function(point1, point2, etc) {
        var args = arguments,
            i,
            len;
        if (typeof point1 === 'string' || typeof point1 === 'number') {
            args = [[point1, point2]];
        }
        len = args.length;
        this._shapeType = "path";
        if(this._path.indexOf("L") < 0 || this._pathType !== "L")
        {
            this._pathType = "L";
            this._path += ' L';
        }
        for (i = 0; i < len; ++i) {
            this._path += args[i][0] + ', ' + args[i][1] + " ";

            this._trackSize.apply(this, args[i]);
        }
    },

    /**
     * Moves the current drawing position to specified x and y coordinates.
     */
    moveTo: function(x, y) {
        this._pathType = "M";
        this._path += ' M' + x + ', ' + y;
    },

    /**
     * Sets the size of the graphics object
     */
    setSize: function(w, h) {
        if(w > this._svg.getAttribute("width"))
        {
            this._svg.setAttribute("width",  w);
        }
        if(h > this._svg.getAttribute("height"))
        {
            this._svg.setAttribute("height", h);
        }
   },
   
    setPosition: function(x, y)
    {
        this._svg.setAttribute("x", x);
        this._svg.setAttribute("y", y);
    },

    /**
     * @private
     */
    render: function(node) {
        var w = node.offsetWidth,
            h = node.offsetHeight;
        node = node || Y.config.doc.body;
        node.appendChild(this._svg);
        this.setSize(w, h);
        this._initProps();
        return this;
    },

    /**
     * @private
     * Reference to current vml shape
     */
    _shapeType: null,

    /**
     * @private
     * Updates the size of the graphics object
     */
    _trackSize: function(w, h) {
        if (w > this._width) {
            this._width = w;
        }
        if (h > this._height) {
            this._height = h;
        }
        this.setSize(w, h);
    },

    /**
     * @private
     * Clears the properties
     */
    _initProps: function() {
        this._shape = null;
        this._fillColor = null;
        this._strokeColor = null;
        this._strokeWeight = 0;
        this._fillProps = null;
        this._fillAlphas = null;
        this._fillColors = null;
        this._fillType =  null;
        this._fillRatios = null;
        this._fillRotation = null;
        this._fillWidth = null;
        this._fillHeight = null;
        this._fillX = NaN;
        this._fillY = NaN;
        this._path = '';
        this._width = 0;
        this._height = 0;
        this._x = 0;
        this._y = 0;
        this._fill = null;
        this._stroke = 0;
        this._stroked = false;
        this._pathType = null;
        this._attributes = {};
    },

    /**
     * @private
     * Clears path properties
     */
    _clearPath: function()
    {
        this._shape = null;
        this._shapeType = null;
        this._path = '';
        this._width = 0;
        this._height = 0;
        this._x = 0;
        this._y = 0;
        this._pathType = null;
        this._attributes = {};
    },

    /**
     * @private 
     * Completes a vml shape
     */
    _draw: function()
    {
        var shape = this._createGraphicNode(this._shapeType),
            fillProps = this._fillProps,
            i,
            gradFill;
        if(this._path)
        {
            if(this._fill)
            {
                this._path += 'z';
            }
            shape.setAttribute("d", this._path);
        }
        else
        {
            for(i in this._attributes)
            {
                if(this._attributes.hasOwnProperty(i))
                {
                    shape.setAttribute(i, this._attributes[i]);
                }
            }
        }
        shape.setAttribute("stroke-width",  this._strokeWeight);
        if(this._strokeColor)
        {
            shape.setAttribute("stroke", this._strokeColor);
            shape.setAttribute("stroke-opacity", this._strokeAlpha);
        }
        if(!this._fillType || this._fillType === "solid")
        {
            if(this._fillColor)
            {
               shape.setAttribute("fill", this._fillColor);
               shape.setAttribute("fill-opacity", this._fillAlpha);
            }
            else
            {
                shape.setAttribute("fill", "none");
            }
        }
        else if(this._fillType === "linear")
        {
            gradFill = this._getFill();
            gradFill.setAttribute("id", this._gradientId);
            this._defs.appendChild(gradFill);
            shape.setAttribute("fill", "url(#" + this._gradientId + ")");

        }
        this._svg.appendChild(shape);
        this._clearPath();
    },

    /**
     * @private
     * Returns ths actual fill object to be used in a drawing or shape
     */
    _getFill: function() {
        var type = this._fillType,
            fill;

        switch (type) {
            case 'linear': 
                fill = this._getLinearGradient('fill');
                break;
            case 'radial': 
                //fill = this._getRadialGradient('fill');
                break;
            case 'bitmap':
                //fill = this._bitmapFill;
                break;
        }
        return fill;
    },

    /**
     * @private
     * Returns a linear gradient fill
     */
    _getLinearGradient: function(type) {
        var fill = this._createGraphicNode("linearGradient"),
            prop = '_' + type,
            colors = this[prop + 'Colors'],
            ratios = this[prop + 'Ratios'],
            alphas = this[prop + 'Alphas'],
            x = !isNaN(this._fillX) ? this._fillX : this._shape.x,
            y = !isNaN(this._fillY) ? this._fillY : this._shape.y,
            w = this._fillWidth || (this._shape.w),
            h = this._fillHeight || (this._shape.h),
            r = this[prop + 'Rotation'],
            i,
            l,
            color,
            ratio,
            alpha,
            def,
            stop,
            x1, x2, y1, y2,
            cx = w/2,
            cy = h/2,
            radCon,
            tanRadians;
        /*
        if(r > 0 && r < 90)
        {
            r *= h/w;
        }
        else if(r > 90 && r < 180)
        {

            r =  90 + ((r-90) * w/h);
        }
*/
        radCon = Math.PI/180;
        tanRadians = parseFloat(parseFloat(Math.tan(r * radCon)).toFixed(8));
        if(Math.abs(tanRadians) * w/2 >= h/2)
        {
            if(r < 180)
            {
                y1 = 0;
                y2 = h;
            }
            else
            {
                y1 = h;
                y2 = 0;
            }
            x1 = cx - ((cy - y1)/tanRadians);
            x2 = cx - ((cy - y2)/tanRadians); 
        }
        else
        {
            if(r > 90 && r < 270)
            {
                x1 = w;
                x2 = 0;
            }
            else
            {
                x1 = 0;
                x2 = w;
            }
            y1 = ((tanRadians * (cx - x1)) - cy) * -1;
            y2 = ((tanRadians * (cx - x2)) - cy) * -1;
        }
        /*
        fill.setAttribute("spreadMethod", "pad");
        
        fill.setAttribute("x1", Math.round(100 * x1/w) + "%");
        fill.setAttribute("y1", Math.round(100 * y1/h) + "%");
        fill.setAttribute("x2", Math.round(100 * x2/w) + "%");
        fill.setAttribute("y2", Math.round(100 * y2/h) + "%");
        */
        fill.setAttribute("gradientTransform", "rotate(" + r + ")");//," + (w/2) + ", " + (h/2) + ")");
        fill.setAttribute("width", w);
        fill.setAttribute("height", h);
        fill.setAttribute("gradientUnits", "userSpaceOnUse");
        l = colors.length;
        def = 0;
        for(i = 0; i < l; ++i)
        {
            color = colors[i];
            ratio = ratios[i] || i/(l - 1);
            ratio = Math.round(ratio * 100) + "%";
            alpha = alphas[i] || "1";
            def = (i + 1) / l;
            stop = this._createGraphicNode("stop");
            stop.setAttribute("offset", ratio);
            stop.setAttribute("stop-color", color);
            stop.setAttribute("stop-opacity", alpha);
            fill.appendChild(stop);
        }
        return fill;
    },

    _defs: null,

    /**
     * @private
     * Creates a group element
     */
    _createGraphics: function() {
        var group = this._createGraphicNode("svg");
        group.style.position = "absolute";
        group.style.top = "0px";
        group.style.left = "0px";
        return group;
    },

    /**
     * @private
     * Creates a vml node.
     */
    _createGraphicNode: function(type, pe)
    {
        var node = document.createElementNS("http://www.w3.org/2000/svg", "svg:" + type),
            v = pe || "none";
        if(type !== "defs" && type !== "stop" && type !== "linearGradient")
        {
            node.setAttribute("pointer-events", v);
        }
        return node;
    },
    
    _getNodeShapeType: function(type)
    {
        if(this._typeConversionHash.hasOwnProperty(type))
        {
            type = this._typeConversionHash[type];
        }
        return type;
    },

    _typeConversionHash: {
        circle: "ellipse",
        wedge: "path"
    },

    /**
     * Returns a shape.
     */
    getShape: function(config) {
        var shape,
            node,
            type,
            fill = config.fill,
            border = config.border,
            fillnode,
            w = config.width,
            h = config.height,
            cx = w/2,
            cy = h/2,
            rx = w/2,
            ry = h/2,
            path;
        if(config.node)
        {
            node = config.node;
            type = config.type || config.shape;
            if(type === "circle")
            {
                type = "ellipse";
            }
        }
        else
        {
            this.clear();
            type = config.shape || "shape";
            if(type === "circle")
            {
                type = "ellipse";
            }
            node = this._createGraphicNode(this._getNodeShapeType(type), "visiblePainted");
            if(type === "wedge")
            {
                path = this._getWedgePath(config.props) + " Z";
                node.setAttribute("d", path);
            }
        }
        if(border && border.weight && border.weight > 0)
        {
            border.color = border.color || "#000000";
            border.weight = border.weight || 1;
            border.alpha = border.alpha || 1;
            node.setAttribute("stroke", border.color);
            node.setAttribute("stroke-width",  border.weight);
            node.setAttribute("stroke-opacity", border.alpha);
        }
        else
        {
            node.setAttribute("stroke", "none");
        }
        this.setSize(w, h); 
        this.setPosition(0, 0);
        if(type === "ellipse")
        {
            if(border.weight && border.weight > 0)
            {
                rx -= border.weight;
                ry -= border.weight;
            }
            node.setAttribute("cx", cx);
            node.setAttribute("cy", cy);
            node.setAttribute("rx", rx);
            node.setAttribute("ry", ry);
        }
        else
        {
            node.setAttribute("width", w);
            node.setAttribute("height", h);
            node.style.width = w + "px";
            node.style.height = h + "px";
        }
        if(fill.type === "linear" || fill.type === "radial")
        {
            //this.beginGradientFill(fill);
            //node.appendChild(this._getFill());
        }
        else if(fill.type === "bitmap")
        {
            //this.beginBitmapFill(fill);
            //node.appendChild(this._getFill());
        }
        else
        {
            if(!fill.color)
            {
                node.setAttribute("fill", "none");
            }
            else
            {
                fill.alpha = fill.alpha || 1;
                node.setAttribute("fill", fill.color);
                node.setAttribute("fill-opacity", fill.alpha);
            }
        }
        
        node.style.display = "block";
        node.style.position = "absolute";
        if(!config.node)
        {
            this._svg.appendChild(node);
        }
        shape = {
            width:w,
            height:h,
            fill:fill,
            node:node,
            border:border,
            type:type
        };
        return shape; 
    },
    
    /**
     * @description Updates an existing shape with new properties.
     */
    updateShape: function(shape, config)
    {
        if(config.fill)
        {
            shape.fill = Y.merge(shape.fill, config.fill);
        }
        if(config.border)
        {
            shape.border = Y.merge(shape.border, config.border);
            if(config.border.weight)
            {
                shape.border.weight = config.border.weight;
            }
            else if(config.border.weight === 0)
            {
                shape.border.weight = 0;
            }
        }
        if(config.width)
        {
            shape.width = config.width;
        }
        if(config.height)
        {
            shape.height = config.height;
        }
        if(config.shape !== shape.type)
        {
            config.node = null;
        }
        return this.getShape(shape);
    }

};
Y.Graphic = Graphic;

