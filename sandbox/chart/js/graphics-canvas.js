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
        Y.log('beginBitmapFill not implemented', 'warn', 'graphics-canvas');
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
        Y.log('drawEllipse not implemented', 'warn', 'graphics-canvas');
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
            case 45:
                grad = ctx.createLinearGradient(x + w, y + h, x, y); 
            break;
            case 90:
                grad = ctx.createLinearGradient(x + w, y, x, y); 
            break;
            case 135:
                grad = ctx.createLinearGradient(x + w, y, x, y + h); 
            break;
            case 180:
                grad = ctx.createLinearGradient(x, y, x, y + h); 
            break;
            case 225:
                grad = ctx.createLinearGradient(x, y, x + w, y + h); 
            break;
            case 270:
                grad = ctx.createLinearGradient(x, y, x + w, y); 
            break;
            case 315:
                grad = ctx.createLinearGradient(x, y + h, x + w, y); 
            break;
            default:
                grad = ctx.createLinearGradient(x, y + h, x, y); 
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
        Y.log('lineGradientStyle not implemented', 'warn', 'graphics-canvas');
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
