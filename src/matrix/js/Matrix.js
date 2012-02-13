/**
 * Matrix is a class that allows for the manipulation of a transform matrix.
 * This class is a work in progress.
 *
 * @class Matrix
 * @constructor
 */
var Matrix = function(config) {
    this.init(config);
};

Matrix.prototype = {
    /**
     * Used as value for the _rounding method.
     *
     * @property _rounder
     * @private
     */
    _rounder: 100000,

    /**
     * Updates the matrix. 
     *
     * @method multiple
     * @param {Number} a 
     * @param {Number} b
     * @param {Number} c
     * @param {Number} d
     * @param {Number} dx
     * @param {Number} dy
     */
    multiply: function(a, b, c, d, dx, dy) {
        var matrix = this,
            matrix_a = matrix.a * a + matrix.c * b,
            matrix_b = matrix.b * a + matrix.d * b,
            matrix_c = matrix.a * c + matrix.c * d,
            matrix_d = matrix.b * c + matrix.d * d,
            matrix_dx = matrix.a * dx + matrix.c * dy + matrix.dx,
            matrix_dy = matrix.b * dx + matrix.d * dy + matrix.dy;

        matrix.a = matrix_a;
        matrix.b = matrix_b;
        matrix.c = matrix_c;
        matrix.d = matrix_d;
        matrix.dx = matrix_dx;
        matrix.dy = matrix_dy;
        return this;
    },

    /**
     * Parses a string and updates the matrix.
     *
     * @method applyCSSText
     * @param {String} val A css transform string
     */
    applyCSSText: function(val) {
        var re = /\s*([a-z]*)\(([\w,\s]*)\)/gi,
            args,
            m;

        while ((m = re.exec(val))) {
            if (typeof this[m[1]] === 'function') {
                args = m[2].split(',');
                this[m[1]].apply(this, args);
            }
        }
    },
    
    /**
     * Parses a string and returns an array of transform arrays.
     *
     * @method applyCSSText
     * @param {String} val A css transform string
     * @return Array
     */
    getTransformArray: function(val) {
        var re = /\s*([a-z]*)\(([\w,\.,\-,\s]*)\)/gi,
            transforms = [],
            args,
            m;
        
        val = val.replace(/matrix/g, "multiply");
        while ((m = re.exec(val))) {
            if (typeof this[m[1]] === 'function') {
                args = m[2].split(',');
                args.unshift(m[1]);
                transforms.push(args);
            }
        }
        return transforms;
    },

    /**
     * Default values for the matrix
     *
     * @property _defaults
     * @private
     */
    _defaults: {
        a: 1,
        b: 0,
        c: 0,
        d: 1,
        dx: 0,
        dy: 0
    },

    /**
     * Rounds values
     *
     * @method _round
     * @private
     */
    _round: function(val) {
        val = Math.round(val * this._rounder) / this._rounder;
        return val;
    },

    /**
     * Initializes a matrix.
     *
     * @method init
     * @param {Object} config Specified key value pairs for matrix properties. If a property is not explicitly defined in the config argument,
     * the default value will be used.
     */
    init: function(config) {
        var defaults = this._defaults,
            prop;

        config = config || {};

        for (prop in defaults) {
            if(defaults.hasOwnProperty(prop))
            {
                this[prop] = (prop in config) ? config[prop] : defaults[prop];
            }
        }

        this._config = config;
    },

    /**
     * Applies a scale transform
     *
     * @method scale
     * @param {Number} val
     */
    scale: function(x, y) {
        this.multiply(x, 0, 0, y, 0, 0);
        return this;
    },
    
    /**
     * Applies a skew transformation.
     *
     * @method skew
     * @param {Number} x The value to skew on the x-axis.
     * @param {Number} y The value to skew on the y-axis.
     */
    skew: function(x, y) {
        x = x || 0;
        y = y || 0;

        if (x !== undefined) { // null or undef
            x = this._round(Math.tan(this.angle2rad(x)));

        }

        if (y !== undefined) { // null or undef
            y = this._round(Math.tan(this.angle2rad(y)));
        }

        this.multiply(1, y, x, 1, 0, 0);
        return this;
    },

    /**
     * Applies a skew to the x-coordinate
     *
     * @method skewX
     * @param {Number} x x-coordinate
     */
    skewX: function(x) {
        this.skew(x);
        return this;
    },

    /**
     * Applies a skew to the y-coordinate
     *
     * @method skewY
     * @param {Number} y y-coordinate
     */
    skewY: function(y) {
        this.skew(null, y);
        return this;
    },

    /**
     * Returns a string of text that can be used to populate a the css transform property of an element.
     *
     * @method toCSSText
     * @return String
     */
    toCSSText: function() {
        var matrix = this,
            dx = matrix.dx,
            dy = matrix.dy,
            text = 'matrix(';


        if (Y.UA.gecko) { // requires unit
            if (!isNaN(dx)) {
                dx += 'px';
            }
            if (!isNaN(dy)) {
                dy += 'px';
            }
        }

        text +=     matrix.a + ',' + 
                    matrix.b + ',' + 
                    matrix.c + ',' + 
                    matrix.d + ',' + 
                    dx + ',' +
                    dy;

        text += ')';

        return text;
    },

    /**
     * Returns a string that can be used to populate the css filter property of an element.
     *
     * @method toFilterText
     * @return String
     */
    toFilterText: function() {
        var matrix = this,
            text = 'progid:DXImageTransform.Microsoft.Matrix(';
        text +=     'M11=' + matrix.a + ',' + 
                    'M21=' + matrix.b + ',' + 
                    'M12=' + matrix.c + ',' + 
                    'M22=' + matrix.d + ',' +
                    'sizingMethod="auto expand")';

        text += '';

        return text;
    },

    /**
     * Converts a radian value to a degree.
     *
     * @method rad2deg
     * @param {Number} rad Radian value to be converted.
     * @return Number
     */
    rad2deg: function(rad) {
        var deg = rad * (180 / Math.PI);
        return deg;
    },

    /**
     * Converts a degree value to a radian.
     *
     * @method deg2rad
     * @param {Number} deg Degree value to be converted to radian.
     * @return Number
     */
    deg2rad: function(deg) {
        var rad = deg * (Math.PI / 180);
        return rad;
    },

    angle2rad: function(val) {
        if (typeof val === 'string' && val.indexOf('rad') > -1) {
            val = parseFloat(val);
        } else { // default to deg
            val = this.deg2rad(parseFloat(val));
        }

        return val;
    },

    /**
     * Applies a rotate transform.
     *
     * @method rotate
     * @param {Number} deg The degree of the rotation.
     */
    rotate: function(deg, x, y) {
        var matrix = [],
            rad = this.angle2rad(deg),
            sin = this._round(Math.sin(rad)),
            cos = this._round(Math.cos(rad));
        this.multiply(cos, sin, 0 - sin, cos, 0, 0);
        return this;
    },

    /**
     * Applies translate transformation.
     *
     * @method translate
     * @param {Number} x The value to transate on the x-axis.
     * @param {Number} y The value to translate on the y-axis.
     */
    translate: function(x, y) {
        x = parseFloat(x) || 0;
        y = parseFloat(y) || 0;
        this.multiply(1, 0, 0, 1, x, y);
        return this;
    },

    /**
     * Returns an identity matrix.
     *
     * @method identity
     * @return Object
     */
    identity: function() {
        var config = this._config,
            defaults = this._defaults,
            prop;

        for (prop in config) {
            if (prop in defaults) {
                this[prop] = defaults[prop];
            }
        }
        return this;
    },

    /**
     * Returns a 3x3 Matrix array
     *
     * /                                             \
     * | matrix[0][0]   matrix[1][0]    matrix[2][0] |
     * | matrix[0][1]   matrix[1][1]    matrix[2][1] |
     * | matrix[0][2]   matrix[1][2]    matrix[2][2] |
     * \                                             /
     *
     * @method getMatrixArray
     * @return Array
     */
    getMatrixArray: function()
    {
        var matrix = this,
            matrixArray = [
                [matrix.a, matrix.c, matrix.dx],
                [matrix.b, matrix.d, matrix.dy],
                [0, 0, 1]
            ];
        return matrixArray;
    },

    /**
     * Returns the left, top, right and bottom coordinates for a transformed
     * item.
     *
     * @method getContentRect
     * @param {Number} width The width of the item.
     * @param {Number} height The height of the item.
     * @param {Number} x The x-coordinate of the item.
     * @param {Number} y The y-coordinate of the item.
     * @return Object
     */
    getContentRect: function(width, height, x, y)
    {
        var left = !isNaN(x) ? x : 0,
            top = !isNaN(y) ? y : 0,
            right = left + width,
            bottom = top + height,
            matrix = this,
            a = matrix.a,
            b = matrix.b,
            c = matrix.c,
            d = matrix.d,
            dx = matrix.dx,
            dy = matrix.dy,
            x1 = (a * left + c * top + dx), 
            y1 = (b * left + d * top + dy),
            //[x2, y2]
            x2 = (a * right + c * top + dx),
            y2 = (b * right + d * top + dy),
            //[x3, y3]
            x3 = (a * left + c * bottom + dx),
            y3 = (b * left + d * bottom + dy),
            //[x4, y4]
            x4 = (a * right + c * bottom + dx),
            y4 = (b * right + d * bottom + dy);
        return {
            left: Math.min(x3, Math.min(x1, Math.min(x2, x4))),
            right: Math.max(x3, Math.max(x1, Math.max(x2, x4))),
            top: Math.min(y2, Math.min(y4, Math.min(y3, y1))),
            bottom: Math.max(y2, Math.max(y4, Math.max(y3, y1)))
        };
    },       
    
    /**
     * Returns the determinant of the matrix.
     *
     * @method getDeterminant
     * @return Number
     */
    getDeterminant: function()
    {
        return Y.MatrixUtil.getDeterminant(this.getMatrixArray());
    },

    /**
     * Returns the inverse (in array form) of the matrix.
     *
     * @method inverse
     * @return Array
     */
    inverse: function()
    {
        return Y.MatrixUtil.inverse(this.getMatrixArray());
    },

    /**
     * Returns the transpose of the matrix
     *
     * @method transpose
     * @return Array
     */
    transpose: function()
    {
        return Y.MatrixUtil.transpose(this.getMatrixArray());
    },

    /**
     * Returns an array of transform commands that represent the matrix.
     *
     * @method decompose
     * @return Array
     */
    decompose: function()
    {
        return Y.MatrixUtil.decompose(this.getMatrixArray());
    }
};

Y.Matrix = Matrix;
