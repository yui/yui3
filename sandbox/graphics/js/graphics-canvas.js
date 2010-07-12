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
    beginGradientFill: function(config) {
        var color,
            alpha,
            i = 0,
            colors = config.colors,
            alphas = config.alphas || [],
            len = colors.length;
        this._fillAlphas = alphas;
        this._fillColors = colors;
        this._fillType =  config.type || "linear";
        this._fillRatios = config.ratios || [];
        this._fillRotation = config.rotation || 0;
        this._fillWidth = config.width || null;
        this._fillHeight = config.height || null;
        this._fillX = !isNaN(config.tx) ? config.tx : NaN;
        this._fillY = !isNaN(config.ty) ? config.ty : NaN;
        for(;i < len; ++i)
        {
            alpha = alphas[i];
            color = colors[i];
            if (alpha) {
               color = this._2RGBA(color, alpha);
            } else {
                color = this._2RGB(color);
            }
            colors[i] = color;
        }
        this._context.beginPath();
    },
    
    _initProps: function() {
        var context = this._context;
        
        context.fillStyle = 'rgba(0, 0, 0, 1)'; // use transparent when no fill
        context.lineWidth = 1;
        //context.lineCap = 'butt';
        context.lineJoin = 'miter';
        context.miterLimit = 3;
        context.strokeStyle = 'rgba(0, 0, 0, 1)';

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
    },

	drawCircle: function(x, y, radius) {
        var context = this._context,
            startAngle = 0 * Math.PI / 180,
            endAngle = 360 * Math.PI / 180;

        this._trackPos(x, y);
        this._trackSize(radius * 2, radius * 2);
        context.beginPath();
        context.arc(x, y, radius, startAngle, endAngle, false);
        this.drawShape();
    },

	drawEllipse: function(x, y, w, h) {
        var context = this._context,
            startAngle = 0 * Math.PI / 180,
            endAngle = 360 * Math.PI / 180;

        this._trackPos(x, y);
        this._trackSize(w, h);
        context.beginPath();
        context.moveTo(x + w, y + h/2);
        context.arc(x + w/2, y + h/2, w/2, startAngle, endAngle, false);
        this.drawShape();
	},

    drawRect: function(x, y, w, h) {
        this._context.beginPath();
        this.moveTo(x, y).lineTo(x + w, y).lineTo(x + w, y + h).lineTo(x, y + h).lineTo(x, y);
        this._trackPos(x, y);
        this._trackSize(w, h);
        this.drawShape();
    },

    drawRoundRect: function(x, y, w, h, ew, eh) {
        var ctx = this._context;
        ctx.beginPath();
        ctx.moveTo(x, y + eh);
        ctx.lineTo(x, y + h - eh);
        ctx.quadraticCurveTo(x, y + h, x + ew, y + h);
        ctx.lineTo(x + w - ew, y + h);
        ctx.quadraticCurveTo(x + w, y + h, x + w, y + h - eh);
        ctx.lineTo(x + w, y + eh);
        ctx.quadraticCurveTo(x + w, y, x + w - ew, y);
        ctx.lineTo(x + ew, y);
        ctx.quadraticCurveTo(x, y, x, y + eh);

        this.drawShape();
        this._trackPos(x, y);
        this._trackSize(w, h);
    },

    _getFill: function() {
        var type = this._fillType,
            fill;

        switch (type) {
            case 'linear': 
                fill = this._getLinearGradient('fill');
                break;

            case 'radial': 
                fill = this._getRadialGradient('fill');
                break;

            case 'solid': 
                fill = this._fillColor;
                break;
        }
        return fill;
    },

    _getLinearGradient: function(type) {
        var prop = '_' + type,
            colors = this[prop + 'Colors'],
            ratios = this[prop + 'Ratios'],
            x = !isNaN(this._fillX) ? this._fillX : this._x,
            y = !isNaN(this._fillY) ? this._fillY : this._y,
            w = this._fillWidth || (this._width - x),
            h = this._fillHeight || (this._height - y),
            ctx = this._context,
            r = this[prop + 'Rotation'],
            i,
            l,
            color,
            ratio,
            def,
            grad,
            x1, x2, y1, y2,
            cx = x + w/2,
            cy = y + h/2,
            radCon = Math.PI/180,
            tanRadians = parseFloat(parseFloat(Math.tan(r * radCon)).toFixed(8));
        if(Math.abs(tanRadians) * w/2 >= h/2)
        {
            if(r < 180)
            {
                y1 = y;
                y2 = y + h;
            }
            else
            {
                y1 = y + h;
                y2 = y;
            }
            x1 = cx - ((cy - y1)/tanRadians);
            x2 = cx - ((cy - y2)/tanRadians); 
        }
        else
        {
            if(r > 90 && r < 270)
            {
                x1 = x + w;
                x2 = x;
            }
            else
            {
                x1 = x;
                x2 = x + w;
            }
            y1 = ((tanRadians * (cx - x1)) - cy) * -1;
            y2 = ((tanRadians * (cx - x2)) - cy) * -1;
        }
        grad = ctx.createLinearGradient(x1, y1, x2, y2);
        l = colors.length;
        def = 0;
        for(i = 0; i < l; ++i)
        {
            color = colors[i];
            ratio = ratios[i] || i/(l - 1);
            grad.addColorStop(ratio, color);
            def = (i + 1) / l;
        }
        
        return grad;
    },

    _getRadialGradient: function(type) {
        var prop = '_' + type,
            colors = this[prop + "Colors"],
            ratios = this[prop + "Ratios"],
            i,
            l,
            w = this._fillWidth || this._width,
            x = !isNaN(this._fillX) ? this._fillX : this._x,
            y = !isNaN(this._fillY) ? this._fillY : this._y,
            color,
            ratio,
            def,
            grad,
            ctx = this._context;
            x += this._fillWidth/2;
            y += this._fillHeight/2;
        grad = ctx.createRadialGradient(x, y, 1, x, y, w/2);
        l = colors.length;
        def = 0;
        for(i = 0; i < l; ++i) {
            color = colors[i];
            ratio = ratios[i] || i/(l - 1);
            grad.addColorStop(ratio, color);
        }
        return grad;
    },
    
    drawShape: function()
    {
        var context = this._context,
            fill;

        if (this._fillType) {
            fill = this._getFill();
            if (fill) {
                context.fillStyle = fill;
            }
            context.closePath();
        }


        if (this._fillType) {
            context.fill();
        }

        if (this._stroke) {
            context.stroke();
        }
        

    },

    end: function() {
        this.drawShape();
        this._initProps();
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
        
        if(!this._fill)
        {
            context.beginPath();
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
            context = this._context,
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

    setSize: function(w, h)
    {
        this._node.style.width = w + "px";
        this._node.style.height = h + "px";
        this._canvas.width = w;
        this._canvas.height = h;
    },

    _node: null,

    render: function(node) {
        node = node || Y.config.doc.body;
        this._node = document.createElement("div");
        this._node.style.width = node.offsetWidth + "px";
        this._node.style.height = node.offsetHeight + "px";
        this._node.style.display = "block";
        this._node.style.position = "absolute";
        this._node.style.left = node.style.left;
        this._node.style.top = node.style.top;
        node.appendChild(this._node);
        this._node.appendChild(this._canvas);
        this._canvas.width = node.offsetWidth > 0 ? node.offsetWidth : 100;
        this._canvas.height = node.offsetHeight > 0 ? node.offsetHeight : 100;
        return this;
    },

    _trackSize: function(w, h) {
        if (w > this._width) {
            this._width = w;
        }
        if (h > this._height) {
            this._height = h;
        }
    },

    _trackPos: function(x, y) {
        if (x > this._x) {
            this._x = x;
        }
        if (y > this._y) {
            this._y = y;
        }
    }
};

Y.Graphic = Graphic;
