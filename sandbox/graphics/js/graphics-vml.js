var VMLGraphics = function(config) {
    
    this.initializer.apply(this, arguments);
};

VMLGraphics.prototype = {
    initializer: function(config) {
        config = config || {};
        var w = config.width || 0,
            h = config.height || 0;
        this._vml = this._createGraphics();
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
            if (alpha) {
                this._fillProps = {
                    type:"solid",
                    opacity: alpha
                };
            }
            this._fillColor = color;
            this._fill = 1;
        }
        return this;
    },

    /** 
     *Specifies a gradient fill used by subsequent calls to other Graphics methods (such as lineTo() or drawCircle()) for the object.
     */
    beginGradientFill: function(config) {
        var type = config.type,
            colors = config.colors,
            alphas = config.alphas || [],
            ratios = config.ratios || [],
            fill = {
                colors:colors,
                ratios:ratios
            },
            len = alphas.length,
            i = 0,
            alpha,
            oi,
            rotation = config.rotation || 0;
    
        for(;i < len; ++i)
        {
            alpha = alphas[i];
            oi = i > 0 ? i + 1 : "";
            alphas[i] = Math.round(alpha * 100) + "%";
            fill["opacity" + oi] = alphas[i];
        }
        if(type === "linear")
        {
            if(config)
            {
            }
            if(rotation > 0 && rotation <= 90)
            {
                rotation = 450 - rotation;
            }
            else if(rotation <= 270)
            {
                rotation = 270 - rotation;
            }
            else if(rotation <= 360)
            {
                rotation = 630 - rotation;
            }
            else
            {
                rotation = 270;
            }
            fill.type = "gradientunscaled";
            fill.angle = rotation;
        }
        else if(type === "radial")
        {
            fill.alignshape = false;
            fill.type = "gradientradial";
            fill.focus = "100%";
            fill.focusposition = "50%,50%";
        }
        fill.ratios = ratios || [];
        
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
        this._fillProps = fill;
    },

    /**
     * Clears the graphics object.
     */
    clear: function() {
        this._path = '';
        this._removeChildren(this._vml);
    },

    /**
     * @private
     */
    _removeChildren: function(node)
    {
        if(node.hasChildNodes())
        {
            var child;
            while(node.firstChild)
            {
                child = node.firstChild;
                this._removeChildren(child);
                node.removeChild(child);
            }
        }
    },

    /**
     * Draws a bezier curve
     */
    curveTo: function(cp1x, cp1y, cp2x, cp2y, x, y) {
        this._shape = "shape";
        this._path += ' c ' + Math.round(cp1x) + ", " + Math.round(cp1y) + ", " + Math.round(cp2x) + ", " + Math.round(cp2y) + ", " + x + ", " + y;
        this._trackSize(x, y);
    },

    /**
     * Draws a quadratic bezier curve
     */
    quadraticCurveTo: function(cpx, cpy, x, y) {
        this._path += ' qb ' + cpx + ", " + cpy + ", " + x + ", " + y;
    },

    /**
     * Draws a circle
     */
	drawCircle: function(x, y, r) {
        this._width = this._height = r * 2;
        this._x = x - r;
        this._y = y - r;
        this._shape = "oval";
        //this._path += ' ar ' + this._x + ", " + this._y + ", " + (this._x + this._width) + ", " + (this._y + this._height) + ", " + this._x + " " + this._y + ", " + this._x + " " + this._y;
        this._draw();
	},

    /**
     * Draws an ellipse
     */
    drawEllipse: function(x, y, w, h) {
        this._width = w;
        this._height = h;
        this._x = x;
        this._y = y;
        this._shape = "oval";
        //this._path += ' ar ' + this._x + ", " + this._y + ", " + (this._x + this._width) + ", " + (this._y + this._height) + ", " + this._x + " " + this._y + ", " + this._x + " " + this._y;
        this._draw();
    },

    /**
     * Draws a rectangle
     */
    drawRect: function(x, y, w, h) {
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

    drawWedge: function(x, y, startAngle, arc, radius, yRadius)
    {
        this._drawingComplete = false;
        this._width = radius;
        this._height = radius;
        yRadius = yRadius || radius;
        this._path += this._getWedgePath({x:x, y:y, startAngle:startAngle, arc:arc, radius:radius, yRadius:yRadius});
        this._width = radius * 2;
        this._height = this._width;
        this._shape = "shape";
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
            path;  
        if(Math.abs(arc) > 360)
        {
            arc = 360;
        }
        startAngle *= 65535;
        arc *= 65536;
        path = " m " + x + " " + y + " ae " + x + " " + y + " " + radius + " " + radius + " " + startAngle + " " + arc;
        return path;
    },
    
    end: function() {
        if(this._shape)
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
        this._strokeWeight = thickness * 0.7;
        this._strokeColor = color;
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
        this._shape = "shape";
        this._path += ' l ';
        for (i = 0; i < len; ++i) {
            this._path += ' ' + Math.round(args[i][0]) + ', ' + Math.round(args[i][1]);

            this._trackSize.apply(this, args[i]);
        }
    },

    /**
     * Moves the current drawing position to specified x and y coordinates.
     */
    moveTo: function(x, y) {
        this._path += ' m ' + Math.round(x) + ', ' + Math.round(y);
    },

    /**
     * Sets the size of the graphics object
     */
    setSize: function(w, h) {
        this._vml.style.width = w + 'px';
        this._vml.style.height = h + 'px';
        this._vml.coordSize = w + ' ' + h;
    },
   
    setPosition: function(x, y)
    {
        this._vml.style.left = x + "px";
        this._vml.style.top = y + "px";
    },

    /**
     * @private
     */
    render: function(node) {
        var w = node.offsetWidth || 0,
            h = node.offsetHeight || 0;
        node = node || Y.config.doc.body;
        node.appendChild(this._vml);
        this.setSize(w, h);
        this._initProps();
        return this;
    },

    /**
     * @private
     * Reference to current vml shape
     */
    _shape: null,

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
    },

    /**
     * @private
     * Clears the properties
     */
    _initProps: function() {
        this._fillColor = null;
        this._strokeColor = null;
        this._strokeWeight = 0;
        this._fillProps = null;
        this._path = '';
        this._width = 0;
        this._height = 0;
        this._x = 0;
        this._y = 0;
        this._fill = null;
        this._stroke = 0;
        this._stroked = false;
    },

    /**
     * @private
     * Clears path properties
     */
    _clearPath: function()
    {
        this._shape = null;
        this._path = '';
        this._width = 0;
        this._height = 0;
        this._x = 0;
        this._y = 0;
    },

    /**
     * @private 
     * Completes a vml shape
     */
    _draw: function()
    {
        var shape = this._createGraphicNode(this._shape),
            w = this._width,
            h = this._height,
            fillProps = this._fillProps;
        if(this._path)
        {
            if(this._fill || this._fillProps)
            {
                this._path += ' x';
            }
            if(this._stroke)
            {
                this._path += ' e';
            }
            shape.path = this._path;
            shape.coordSize = w + ', ' + h;
        }
        else
        {
            shape.style.display = "block";
            shape.style.position = "absolute";
            shape.style.left = this._x + "px";
            shape.style.top = this._y + "px";
        }
        
        if (this._fill) {
            shape.fillColor = this._fillColor;
        }
        else
        {
            shape.filled = false;
        }
        if (this._stroke && this._strokeWeight > 0) {
            shape.strokeColor = this._strokeColor;
            shape.strokeWeight = this._strokeWeight;
        } else {
            shape.stroked = false;
        }
        shape.style.width = w + 'px';
        shape.style.height = h + 'px';
        if (fillProps) {
            shape.filled = true;
            shape.appendChild(this._getFill());
        }
        this._vml.appendChild(shape);
        this._clearPath();
    },

    /**
     * @private
     * Returns ths actual fill object to be used in a drawing or shape
     */
    _getFill: function() {
        var fill = this._createGraphicNode("fill"),
            w = this._width,
            h = this._height,
            fillProps = this._fillProps,
            prop,
            pct,
            i = 0,
            colors,
            colorstring = "",
            len,
            ratios,
            hyp = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2)),
            cx = 50,
            cy = 50;
        if(this._gradientBox)
        {
            cx= Math.round( (this._gradientBox.width/2 - ((this._x - this._gradientBox.tx) * hyp/w))/(w * w/hyp) * 100);
            cy = Math.round( (this._gradientBox.height/2 - ((this._y - this._gradientBox.ty) * hyp/h))/(h * h/hyp) * 100);
            fillProps.focussize = (this._gradientBox.width/w)/10 + " " + (this._gradientBox.height/h)/10;
        }
        if(fillProps.colors)
        {
            colors = fillProps.colors.concat();
            ratios = fillProps.ratios.concat();
            len = colors.length;
            for(;i < len; ++i) {
                pct = ratios[i] || i/(len-1);
                pct = Math.round(100 * pct) + "%";
                colorstring += ", " + pct + " " + colors[i];
            }
            if(parseInt(pct, 10) < 100)
            {
                colorstring += ", 100% " + colors[len-1];
            }
        }
        for (prop in fillProps) {
            if(fillProps.hasOwnProperty(prop)) {
                fill.setAttribute(prop, fillProps[prop]);
           }
        }
        fill.colors = colorstring.substr(2);
        if(fillProps.type === "gradientradial")
        {
            fill.focusposition = cx + "%," + cy + "%";
        }
        return fill;
    },

    /**
     * @private
     * Creates a group element
     */
    _createGraphics: function() {
        var group = this._createGraphicNode("group");
        group.style.display = "inline-block";
        group.style.position = 'absolute';
        return group;
    },

    /**
     * @private
     * Creates a vml node.
     */
    _createGraphicNode: function(type)
    {
        return document.createElement('<' + type + ' xmlns="urn:schemas-microsft.com:vml" class="vml' + type + '"/>');
    
    },
    
    _getNodeShapeType: function(type)
    {
        var shape = "shape";
        if(this._typeConversionHash.hasOwnProperty(type))
        {
            shape = this._typeConversionHash[type];
        }
        return shape;
    },

    _typeConversionHash: {
        circle: "oval",
        ellipse: "oval",
        rect: "rect"
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
            path;
        if(config.node)
        {
            node = config.node;
            type = config.type || config.shape;
        }
        else
        {
            this.clear();
            type = config.shape || "shape";
            node = this._createGraphicNode(this._getNodeShapeType(type));
            if(type === "wedge")
            {
                path = this._getWedgePath(config.props);
                if(fill)
                {
                    path += ' x';
                }
                if(border)
                {
                    path += ' e';
                }
                node.path = path;
            }
        }
        this.setPosition(0, 0);
        if(border && border.weight && border.weight > 0)
        {
            node.strokecolor = border.color || "#000000";
            node.strokeweight = border.weight || 1;
            node.stroked = true;
            w -= border.weight;
            h -= border.weight;
        }
        else
        {
            node.stroked = false;
        }
        this.setSize(w, h);
        node.style.width = w + "px";
        node.style.height = h + "px";
        node.filled = true;
        if(fill.type === "linear" || fill.type === "radial")
        {
            this.beginGradientFill(fill);
            node.appendChild(this._getFill());
        }
        else if(fill.type === "bitmap")
        {
            this.beginBitmapFill(fill);
            node.appendChild(this._getFill());
        }
        else
        {
            if(!fill.color)
            {
                node.filled = false;
            }
            else
            {
                if(config.fillnode)
                {
                    this._removeChildren(config.fillnode);
                }
                fillnode = this._createGraphicNode("fill");
                fillnode.setAttribute("type", "solid");
                fill.alpha = fill.alpha || 1;                
                fillnode.setAttribute("color", fill.color);
                fillnode.setAttribute("opacity", fill.alpha);
                node.appendChild(fillnode);
            }
        }
        node.style.display = "block";
        node.style.position = "absolute";
        if(!config.node)
        {
            this._vml.appendChild(node);
        }
        shape = {
            width:w,
            height:h,
            fill:fill,
            node:node,
            fillnode:fillnode,
            border:border
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
            config.fillnode = null;
        }
        return this.getShape(shape);
    },

    addChild: function(child)
    {
        this._vml.appendChild(child);
    }
};

if (Y.UA.ie) {
    var sheet = document.createStyleSheet();
    sheet.addRule(".vmlgroup", "behavior:url(#default#VML)", sheet.rules.length);
    sheet.addRule(".vmlgroup", "display:inline-block", sheet.rules.length);
    sheet.addRule(".vmlgroup", "zoom:1", sheet.rules.length);
    sheet.addRule(".vmlshape", "behavior:url(#default#VML)", sheet.rules.length);
    sheet.addRule(".vmlshape", "display:inline-block", sheet.rules.length);
    sheet.addRule(".vmloval", "behavior:url(#default#VML)", sheet.rules.length);
    sheet.addRule(".vmloval", "display:inline-block", sheet.rules.length);
    sheet.addRule(".vmlrect", "behavior:url(#default#VML)", sheet.rules.length);
    sheet.addRule(".vmlrect", "display:block", sheet.rules.length);
    sheet.addRule(".vmlfill", "behavior:url(#default#VML)", sheet.rules.length);
    Y.log('using VML');
    Y.Graphic = VMLGraphics;
}
else
{
    var UID = '_yuid',
        NODE_NAME = 'nodeName',
        _addClass = Y.Node.prototype.addClass,
        node_toString = Y.Node.prototype.toString,
        nodeList_toString = Y.NodeList.prototype.toString;
    Y.Node.prototype.addClass = function(className) {
       var node = this._node;
       if(node.tagName.indexOf("svg") > -1)
       {    
            if(node.className && node.className.baseVal)
            {
                node.className.baseVal = Y.Lang.trim([node.className.baseVal, className].join(' '));
            }
            else
            {
                node.setAttribute("class", className);
            }
        }
        else
        {
            _addClass.apply(this, arguments);
        }
        return this;
    };

    Y.Node.prototype.toString = function() {
        var node = this._node,
            str;
        if(node && node.className && node.className.baseVal)
        {
            if(typeof node.className.baseVal == "string")
            {
                str = node[NODE_NAME] + "." + node.className.baseVal.replace(' ', '.');
            }
            else
            {
                str = this[UID] + ': not bound to any nodes';
            }
        }
        else
        {
            str = node_toString.apply(this, arguments);
        }
        return str;
    };

    Y.NodeList.prototype.toString = function() {
        var nodes = this._nodes,
            node,
            str;
        if (nodes && nodes[0]) {
            node = nodes[0];
        }    
        if(node && node.className && node.className.baseVal)
        {
            if(typeof node.className.baseVal == "string")
            {
                str = node[NODE_NAME];
                if(node.id)
                {
                    str += "#" + node.id;
                }
                str += "." + node.className.baseVal.replace(' ', '.');
            }
            else
            {
                str = this[UID] + ': not bound to any nodes';
            }
        }
        else
        {
            str = nodeList_toString.apply(this, arguments);
        }
        return str;
    };

    Y.NodeList.importMethod(Y.Node.prototype, ['addClass']);
}

