YUI.add('canvas-vml', function(Y) {

var VMLCanvas = function(config) {
    VMLCanvas.superclass.constructor.apply(this, arguments);
};

Y.extend(VMLCanvas, Y.Canvas, {
    initializer: function(config) {
    },

    _createCanvas: function() {
        return Y.config.doc.createElement('v:shape');
    },

    beginPath: function() {
        this._path = '';
        return this;
    },

    closePath: function() {
        this._path += ' x e';
        this.set('path', this._path);
        return this;
    },

    lineTo: function(point1, point2, etc) {
        var args = arguments;
        if (typeof point1 === 'string' || typeof point1 === 'number') {
            args = [[point1, point2]];
        }
        this._path += ' l ';
        for (i = 0, len = args.length; i < len; ++i) {
            this._path += ' ' + args[i][0] + ' ' + args[i][1];
        }

        return this;
    },

    moveTo: function(x, y) {
        this._path += ' m ' + x + ' ' + y;
        return this;
    },

    stroke: function() {
        return this;
    },

    fill: function() {
        return this;
    },

    _path: null
}, {
    NAME: 'canvas'
}, true);

VMLCanvas.ATTRS = {};
VMLCanvas.ATTRS.coordSize = {
    valueFn: function() {
        return this.get('height') + ' ' + this.get('width');
    }
};

VMLCanvas.ATTRS.height = {
    setter: function(val) {
        this._canvas.style.height = val + 'px'
        return val;
    },
    _bypassProxy: true
};
        
VMLCanvas.ATTRS.width = {
    setter: function(val) {
        this._canvas.style.width = val + 'px'
        return val;
    },
    _bypassProxy: true
};

VMLCanvas.ATTRS.path = null;
VMLCanvas.ATTRS.fillColor = null;
VMLCanvas.ATTRS.strokeColor = null;
VMLCanvas.ATTRS.strokeWeight = null;

Y.VMLCanvas = VMLCanvas;

if (Y.UA.ie) {
    Y.config.doc.namespaces.add(
        'v', // vml namespace
        null,
        '#default#VML' // required for IE8
    );

    Y.Canvas.ATTRS = {}; // TODO: why cant just override per ATTR?
    Y.Canvas = VMLCanvas;
}

}, '@VERSION@' ,{requires:['canvas']});

