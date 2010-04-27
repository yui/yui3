YUI.add('canvas', function(Y) {
var Canvas = function(config) {
    this._canvas = this._createCanvas(config);
    this._stateProxy = this._canvas.getContext ? // IE shares this constructor TODO: refactor
        this._canvas.getContext('2d') : this._canvas;

    Canvas.superclass.constructor.apply(this, arguments);
};

Y.extend(Canvas, Y.Base, {
    initializer: function(config) {
    },

    _createCanvas: function() {
        return Y.config.doc.createElement('canvas');
    },

    beginPath: function() {
        this._canvas.getContext('2d').beginPath();
        return this;
    },

    closePath: function() {
        this._canvas.getContext('2d').closePath();
        return this;
    },

    lineTo: function(point1, point2, etc) {
        var args = arguments;
        if (typeof point1 === 'string' || typeof point1 === 'number') {
            args = [[point1, point2]];
        }
        for (
            var i = 0,
                context = this._canvas.getContext('2d'),
                len = args.length;
            i < len; ++i) {
            context.lineTo(args[i][0], args[i][1]);
        }
        return this;
    },

    fill: function() {
        this._canvas.getContext('2d').fill();
        return this;
    },

    stroke: function() {
        this._canvas.getContext('2d').stroke();
        return this;
    },

    moveTo: function(x, y) {
        this._canvas.getContext('2d').moveTo(x, y);
        return this;
    },

    draw: function(node) {
        node = Y.one(node) || Y.config.doc.body;
        node.appendChild(this._canvas);
        return this;
    },

    _lazyAddAttrs: false

}, {

    ATTRS: {
        height: {
            setter: function(val) {
                this._canvas.height = val;
                return val;
            },
            _bypassProxy: true
        },

        width: {
            setter: function(val) {
                this._canvas.width = val;
                return val;
            },
            _bypassProxy: true
        },

        strokeWeight: {
            setter: function(val) {
                // multiply by factor to match pixels
                this._canvas.getContext('2d').lineWidth = val * 1.5;
                return val;
            }
        },

        strokeColor: {
            setter: function(val) {
                var context = this._canvas.getContext('2d');
                context.strokeStyle = val;
                return val;
            }
        },

        fillColor: {
            setter: function(val) {
                var context = this._canvas.getContext('2d');
                context.fillStyle = val;
                return val;
            }

        },

        destructor: function() {
            this._canvas = null;
        }
    },

    NAME: 'canvas'
});

Y.Canvas = Canvas;
}, '@VERSION@' ,{requires:['node', 'base']});
