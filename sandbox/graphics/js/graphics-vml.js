
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
    },

    _createGraphics: function() {

    var group = document.createElement('<group xmlns="urn:schemas-microsft.com:vml" class="vmlgroup"/>');
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
        var i = 1,
            len = colors.length,
            fill = {
                type: (type === "linear") ? "gradient" : "GradientRadial",
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

	drawRoundRect: function(x, y, r, start, end, anticlockwise) {
        return this;
	},

    endFill: function() {
        var shape = document.createElement('<shape xmlns="urn:schemas-microsft.com:vml" class="vmlshape"/>'),
            w = this._width,
            h = this._height,
            fillProps = this._fillProps,
            prop,
            fill;

        this._path += ' x e';

        shape.path = this._path;

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

        if (fillProps) {
            fill = document.createElement('<fill xmlns="urn:schemas-microsft.com:vml" class="vmlfill"/>');
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
        sheet.addRule(".vmlfill", "behavior:url(#default#VML)", sheet.rules.length);
    try
    {
         document.namespaces.add('v', 'urn:schemas-microsoft-com:vml', "#default#VML");
    }
    catch(e)
    {
    }
    Y.log('using VML');
    Y.Graphic = VMLGraphics;
}

