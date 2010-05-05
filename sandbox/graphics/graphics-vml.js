YUI.add('graphics-vml', function(Y) {

var VMLGraphics = function(config) {
    this.initializer.apply(this, arguments);
};

VMLGraphics.prototype = {
    initializer: function(config) {
        this._vml = this._createGraphics;
    },

    _createGraphics: function() {
        return Y.config.doc.createElement('v:shape');
    },

    beginBitmapFill: function() {
        Y.log('bitmapFill not implemented', 'warn', 'graphics-vml');
        return this;
    },

    beginFill: function(color, alpha) {
        if (color) {
            this.set('fillColor', color);
        }

        if (alpha) {
            Y.log('vml alpha fill not implemented', 'warn', 'graphics-vml');
        }

        return this;
    },

    beginGradientFill: function() {
        Y.log('gradientFill not implemented', 'warn', 'graphics-vml');
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

	drawRect: function(x, y, r, start, end, anticlockwise) {
        return this;
	},

	drawRoundRect: function(x, y, r, start, end, anticlockwise) {
        return this;
	},

    endFill: function() {
        this._path += ' x e';
        this.set('path', this._path);
        return this;
    },

    lineGradientStyle: function() {
        return this;
    },

    lineStyle: function(thickness, color, alpha, pixelHinting, scaleMode, caps, joints, miterLimit) {
        this._vml.strokeWeight = thickness;
        this._vml.strokeColor = color;
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

    _path: null
};

if (Y.UA.ie) {
/*
    Y.config.doc.namespaces.add(
        'v', // vml namespace
        'urn:schemas-microsoft-com:vml'
    ).doImport('#default#VML');
*/

    Y.Graphics = VMLGraphics;
}

}, '@VERSION@');
