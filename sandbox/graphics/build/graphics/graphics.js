YUI.add('graphics', function(Y) {

var Graphic = function(config) {
    this.initializer.apply(this, arguments);
};

Graphic.prototype = {
    initializer: function(config) {
        this._dummy = this._createDummy();
        this._canvas = this._createGraphic();
        this._context = this._canvas.getContext('2d');
        this._initProps();
    },

    _reHex: /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,

    _2RGBA: function(val, alpha) {
        alpha = (alpha !== undefined) ? alpha : 1;
        if (this._reHex.exec(val)) {
            val = 'rgba(' + [
                parseInt(RegExp.$1, 16),
                parseInt(RegExp.$2, 16),
                parseInt(RegExp.$3, 16)
            ].join(',') + ',' + alpha + ')';
        }
        return val;
    },

    _createDummy: function() {
        var dummy = Y.config.doc.createElement('div');
        dummy.style.height = 0;
        dummy.style.width = 0;
        dummy.style.overflow = 'hidden';
        Y.config.doc.documentElement.appendChild(dummy);
        return dummy;
    },

    _createGraphic: function(config) {
        var graphic = Y.config.doc.createElement('canvas');

        // no size until drawn on
        graphic.width = 600;
        graphic.height = 600;
        return graphic;
    },

    _2RGB: function(val) {
        this._dummy.style.background = val;
        return this._dummy.style.backgroundColor;
    },

    beginBitmapFill: function(bitmap, matrix, repeat) {
    /*
        repeat = (repeat === false) ? 'no-repeat' : 'repeat';
        var context = this._context;
        this._fillType =  'bitmap';
        context.fillStyle = context.createPattern(bitmap, repeat);
    */
        return this;
    },

    beginFill: function(color, alpha) {
        var context = this._context;
        context.beginPath();
        if (color) {
            if (alpha) {
               color = this._2RGBA(color, alpha);
            } else {
                color = this._2RGB(color);
            }

            this._fillColor = color;
            this._fillType = 'solid';
        }

        return this;
    },

    /** 
     *Specifies a gradient fill used by subsequent calls to other Graphics methods (such as lineTo() or drawCircle()) for the object.
     */
    beginGradientFill: function(type, colors, alphas, ratios, rotation) {
        this._fillType =  type;
        this._fillColors = colors;
        this._fillRatios = ratios;
        this._fillRotation = rotation;
        this._context.beginPath();
        return this;
    },

    _trackSize: function(w, h) {
        if (w > this._width) {
            this._width = w;
        }
        if (h > this._height) {
            this._height = w;
        }
    },

    _trackPos: function(x, y) {
        if (x > this._x) {
            this._x = x;
        }
        if (y > this._y) {
            this._y = y;
        }
    },
    
    _initProps: function() {
        var canvas = this._canvas,
            context = this._context;
        
        context.fillStyle = 'rgba(0, 0, 0, 1)'; // use transparent when no fill
        context.lineWidth = 1;
        //context.lineCap = 'butt';
        context.lineJoin = 'miter';
        context.miterLimit = 3;
        context.strokeStyle = 'rgba(0, 0, 0, 1)';

        // canvas is sized dynamically based on drawing shape
        //canvas.width = 0;
        //canvas.height = 0;

        this._width = 0;
        this._height = 0;

        this._x = 0;
        this._y = 0;
        this._fillType = null;
        this._stroke = null;
    },

    clear: function() {
        this._initProps();
        this._canvas.width = this._canvas.width;
        return this;
    },

    curveTo: function(controlX, controlY, anchorX, anchorY) {
        this._context.quadraticCurveTo(controlX, controlY, anchorX, anchorY);

        return this;
    },

	drawCircle: function(x, y, radius) {
        var context = this._context,
            startAngle = 0 * Math.PI / 180,
            endAngle = 360 * Math.PI / 180,
            anticlockwise = false;

        this._trackPos(x, y);
        this._trackSize(radius * 2, radius * 2);

        context.arc(x + radius, y + radius, radius, startAngle, endAngle, anticlockwise);
        return this;
	},

	drawEllipse: function(x, y, r, start, end, anticlockwise) {
        return this;
	},

    drawRect: function(x, y, w, h) {
        this.moveTo(x, y).lineTo(x + w, y).lineTo(x + w, y + h).lineTo(x, y + h).lineTo(x, y);
        var context = this._context;

        this._trackPos(x, y);
        this._trackSize(w, h);

        return this;
    },

    drawRoundRect: function(x, y, w, h, ew, eh) {
        var ctx = this._context;
        ctx.moveTo(x, y + eh);
        ctx.lineTo(x, y + h - eh);
        ctx.quadraticCurveTo(x, y + h, x + ew, y + h);
        ctx.lineTo(x + w - ew, y + h);
        ctx.quadraticCurveTo(x + w, y + h, x + w, y + h - eh);
        ctx.lineTo(x + w, y + eh);
        ctx.quadraticCurveTo(x + w, y, x + w - ew, y);
        ctx.lineTo(x + ew, y);
        ctx.quadraticCurveTo(x, y, x, y + eh);

        this._trackPos(x, y);
        this._trackSize(w, h);

        return this;
    },

    _getFill: function() {
        var type = this._fillType,
            w = this._width,
            h = this._height,
            fill;

        switch (type) {
            case 'linear': 
                fill = this._getLinearGradient(w, h, 'fill');
                break;

            case 'radial': 
                fill = this._getRadialGradient(w, h, 'fill');
                break;

            case 'solid': 
                fill = this._fillColor;
                break;
        }
        return fill;
    },

    _getLinearGradient: function(w, h, type) {
        var prop = '_' + type,
            colors = this[prop + 'Colors'],
            ratios = this[prop + 'Ratios'],
            x = this._x,
            y = this._y,
            ctx = this._context,
            r = this[prop + 'Rotation'],
            i,
            l,
            color,
            ratio,
            def,
            grad;
        //temporary hack for rotation. 
        switch(r) {
            case 315:
                grad = ctx.createLinearGradient(x, y + h, x + w, y); 
            break;
            case 270:
                grad = ctx.createLinearGradient(x, y + h, x, y); 
            break;
            case 235:
                grad = ctx.createLinearGradient(x + w, y + h, x, y); 
            break;
            case 180:
                grad = ctx.createLinearGradient(x + w, y, x, y); 
            break;
            case 135:
                grad = ctx.createLinearGradient(x + w, y, x, y + h); 
            break;
            case 90:
                grad = ctx.createLinearGradient(x, y, x, y + h); 
            break;
            case 45:
                grad = ctx.createLinearGradient(x, y, x + w, y + h); 
            break;
            default :
                grad = ctx.createLinearGradient(x, y, x + w, y); 
            break;
        }
        l = colors.length;
        def = 0;
        for(i = 0; i < l; ++i)
        {
            color = colors[i];
            ratio = ratios[i] || def;
            grad.addColorStop(ratio, color);
            def = (i + 1) / l;
        }

        return grad;
    },

    _getRadialGradient: function(w, h, type) {
        var prop = '_' + type,
            colors = this[prop + "Colors"],
            ratios = this[prop + "Ratios"],
            i,
            l,
            x = this._x,
            y = this._y,
            color,
            ratio,
            def,
            grad,
            ctx = this._context;

        grad = ctx.createRadialGradient(x + w/2, y + w/2, w/2, x + w, y + h, w/2);
        l = colors.length;
        def = 0;
        for(i = 0; i < l; ++i) {
            color = colors[i];
            ratio = ratios[i] || def;
            grad.addColorStop(ratio, color);
            def = (i + 1) / l;
        }
        return grad;
    },

    endFill: function() {
        var canvas = this._canvas,
            context = this._context,
            fill;

        if (this._fillType) {
            fill = this._getFill();
            if (fill) {
                context.fillStyle = fill;
            }
        }

        context.closePath();

        if (this._fillType) {
            context.fill();
        }

        if (this._stroke) {
            context.stroke();
        }
        
        this._initProps();
        return this;
    },

    lineGradientStyle: function() {
        return this;
    },

    lineStyle: function(thickness, color, alpha, pixelHinting, scaleMode, caps, joints, miterLimit) {
        color = color || '#000000';
        var context = this._context;
        if(this._stroke)
        {
            context.stroke();
        }
        context.lineWidth = thickness;

        if (thickness) {
            this._stroke = 1;
        } else {
            this._stroke = 0;
        }

        if (color) {
            context.strokeStyle = color;

            if (alpha) {
                context.strokeStyle = this._2RGBA(context.strokeStyle, alpha);
            }
        }


        if (caps === 'butt') {
            caps = 'none';
        }

        if (context.lineCap) { // FF errors when trying to set
            //context.lineCap = caps;
        }
        return this;
    },

    lineTo: function(point1, point2, etc) {
        var args = arguments, 
            canvas = this._canvas,
            context = this._context,
            width = this._width,
            height = this._height,
            i, len;
        if (typeof point1 === 'string' || typeof point1 === 'number') {
            args = [[point1, point2]];
        }

        for (i = 0, len = args.length; i < len; ++i) {
            context.lineTo(args[i][0], args[i][1]);

            this._trackSize.apply(this, args[i]);
        }

        return this;
    },

    moveTo: function(x, y) {
        this._context.moveTo(x, y);
        this._trackPos(x, y);
        return this;
    },

    render: function(node) {
        node = node || Y.config.doc.body;
        node.appendChild(this._canvas);
        this._canvas.width = node.offsetWidth;
        this._canvas.height = node.offsetHeight;
        return this;
    }
};

Y.Graphic = Graphic;

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

    _initProps: function() {
        this._fillColor = '#000000';
        this._strokeColor = '#000000';
        this._strokeWeight = 0;

        this._path = '';

        this._width = 0;
        this._height = 0;
        this._x = 0;
        this._y = 0;
        this._fill = 0;
        this._stroke = 0;
        this._stroked = false;
    },

    _createGraphics: function() {
        var group = this.createGraphicNode("group");
        group.style.display = "inline-block";
        group.style.position = 'relative';
        return group;
    },

    beginBitmapFill: function() {
        return this;
    },

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

    beginGradientFill: function(type, colors, alphas, ratios, rotation) {
        var i = 1,
            len = colors.length,
            rotation = rotation || 0;
            rotation = 270 - rotation;
            if(rotation < 0) rotation += 360;
            fill = {
                type: (type === "linear") ? "gradient" : "gradientradial",
                color: colors[0],
                angle: rotation
            };
        for(;i < len; ++i) {
            fill["color" + (i + 1)] = colors[i];
        }

        this._fillProps = fill;
        return this;
    },

    clear: function() {
        this._path = '';
        return this;
    },

    curveTo: function(controlX, controlY, anchorX, anchorY) {
        return this;
    },

	drawCircle: function(x, y, r, start, end, anticlockwise) {
        this._width = this._height = r * 2;
        this._x = x;
        this._y = y;
        this._shape = "oval";
        var circle = this.createGraphicNode("oval");
        circle.style.width = this._width + "px";
        circle.style.height = this._height + "px";
        circle.style.left = x + "px";
        circle.style.top = y + "px";
        circle.strokeColor = this._fillColor;
        circle.fillColor = this._fillColor;
        this._vml.appendChild(circle);
        return this;
	},

    drawRect: function(x, y, w, h) {
        this.moveTo(x, y)
            .lineTo(x + w, y)
            .lineTo(x + w, y + h)
            .lineTo(x, y + h)
            .lineTo(x, y);

        this._trackSize(w + x, h + y);
        //this._trackPos(x, y);
        return this;
    },

    _trackSize: function(w, h) {
        if (w > this._width) {
            this._width = w;
        }
        if (h > this._height) {
            this._height = w;
        }
    },

    _trackPos: function(x, y) {
        if (x > this._x) {
            this._x = x;
        }
        if (y > this._y) {
            this._y = y;
        }
    },

    _shape: "shape",

	drawRoundRect: function(x, y, r, start, end, anticlockwise) {
        return this;
	},

    endFill: function() {
        if(this._shape !== "shape")
        {
            return;
        }
        var shape = this.createGraphicNode(this._shape),
            w = this._width,
            h = this._height,
            fillProps = this._fillProps,
            prop,
            fill;

        if(this._path)
        {
            this._path += ' x e';
            shape.path = this._path;
        }
        else
        {
            shape.style.left = this._x;
            shape.style.top = this._y;
            shape.style.position = "relative";
        }

        if (this._fill) {
            shape.fillColor = this._fillColor;
        }

        if (this._stroke) {
            shape.strokeColor = this._strokeColor;
            shape.strokeWeight = this._strokeWeight;
        } else {
            shape.stroked = false;
        }
        shape.style.width = w + 'px';
        shape.style.height = h + 'px';
        shape.coordSize = w + ', ' + h;

        if (fillProps && this._shape === "shape") {
            fill = this.createGraphicNode("fill");
            for (prop in fillProps) {
                if(fillProps.hasOwnProperty(prop)) {
                    fill.setAttribute(prop, fillProps[prop]);
                }
            }
            shape.appendChild(fill);
        }

        this._vml.appendChild(shape);
        
        this._initProps();
        return this;
    },

    lineGradientStyle: function() {
        return this;
    },

    lineStyle: function(thickness, color, alpha, pixelHinting, scaleMode, caps, joints, miterLimit) {
        this._stroke = 1;
        this._strokeWeight = thickness * 0.7;
        this._strokeColor = color;
        return this;
    },

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
            this._path += ' ' + args[i][0] + ', ' + args[i][1];

            this._trackSize.apply(this, args[i]);
        }
        return this;
    },

    moveTo: function(x, y) {
        this._path += ' m ' + x + ', ' + y;
        return this;
    },

    setSize: function(w, h) {
        this._vml.style.width = w + 'px';
        this._vml.style.height = h + 'px';
        this._vml.coordSize = w + ' ' + h;
    },
   
    createGraphicNode: function(type)
    {
        return document.createElement('<' + type + ' xmlns="urn:schemas-microsft.com:vml" class="vml' + type + '"/>');
    
    },

    render: function(node) {
        var w = node.offsetWidth,
            h = node.offsetHeight;
        node = node || Y.config.doc.body;
        node.appendChild(this._vml);
        this.setSize(w, h);
        this._initProps();
        return this;
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
        sheet.addRule(".vmlfill", "behavior:url(#default#VML)", sheet.rules.length);
    Y.Graphic = VMLGraphics;
}



}, '@VERSION@' );
