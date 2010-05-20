
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
        Y.log('bitmapFill not implemented', 'warn', 'graphics-vml');
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
        var i = 0,
            len,
            pct,
            fill;
        rotation = rotation || 0;
        rotation = 270 - rotation;
        if(rotation < 0) 
        {
            rotation += 360;
        }
        fill = {
            type: (type === "linear") ? "gradient" : "gradientradial",
            angle: rotation,
            colors: ""
        };
        len = colors.length;
        for(;i < len; ++i) {
            pct = ratios[i] || i/(len-1);
            pct = Math.round(100 * pct) + "%";
            fill.colors += ", " + pct + " " + colors[i];
        }
        fill.colors = fill.colors.substr(2);

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
    Y.log('using VML');
    Y.Graphic = VMLGraphics;
}

