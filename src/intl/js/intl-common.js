/*
 * Copyright 2012 Yahoo! Inc. All Rights Reserved. Based on code owned by VMWare, Inc.
 */

/**
 * This module defines common classes and utility methods to be used by i18n modules for date and number formatting.
 * @module intl-common
 */

var Format;

//
// Format class
//
Y.namespace("Intl.Common");

/**
 * Base class for all formats. To format an object, instantiate the format of your choice and call the format method which
 * returns the formatted string.
 * For internal use only.
 * @class BaseFormat
 * @namespace Intl.Common
 * @constructor
 * @private
 * @param {String} pattern
 * @param {Object} formats
 */
Y.Intl.Common.BaseFormat = function(pattern, formats) {
    if ( !pattern && !formats ) {
        return;
    }

    Y.mix(this, {
        /**
         * Pattern to format/parse
         * @property _pattern
         * @type String
         */
        _pattern: pattern,
        /**
         * Segments in the pattern
         * @property _segments
         * @type Intl.Common.BaseFormat.Segment
         */
        _segments: [],
        Formats: formats
    });
};

Format = Y.Intl.Common.BaseFormat;

Y.mix(Format.prototype, {
    /**
     * Format object
     * @method format
     * @param object The object to be formatted
     * @return {String} Formatted result
     */
    format: function(object) {
        var s = [], i = 0;
    
        for (; i < this._segments.length; i++) {
            s.push(this._segments[i].format(object));
        }
        return s.join("");
    },

    
    /**
     * Parses the given string according to this format's pattern and returns
     * an object.
     * Note:
     * The default implementation of this method assumes that the sub-class
     * has implemented the _createParseObject method.
     * @method parse
     * @for Intl.Common.BaseFormat
     * @param {String} s The string to be parsed
     * @param {Number} [pp=0] Parse position. String will only be read from here
     */
    parse: function(s, pp) {
        var object = this._createParseObject(),
            index = pp || 0,
            i = 0;
        for (; i < this._segments.length; i++) {
            index = this._segments[i].parse(object, s, index);
        }
        
        if (index < s.length) {
            Y.error("Parse Error: Input too long");
        }
        return object;
    }
});

//
// Segment class
//

/**
 * Segments in the pattern to be formatted
 * @class BaseFormat.Segment
 * @for BaseFormat
 * @namespace Intl.Common
 * @private
 * @constructor
 * @param {Format} format The format object that created this segment
 * @param {String} s String representing this segment
 */
Format.Segment = function(format, s) {
    if( !format && !s ) { return; }
    this._parent = format;
    this._s = s;
};

Y.mix(Format.Segment.prototype, {
    /**
     * Formats the object. Will be overridden in most subclasses.
     * @method format
     * //param o The object to format
     * @return {String} Formatted result
     */
    format: function(/*o*/) {
        return this._s;
    },

    /**
     * Return the parent Format object
     * @method getFormat
     * @return {Intl.Common.BaseFormat}
     */
    getFormat: function() {
        return this._parent;
    }
});

Y.mix(Format.Segment, {
    /**
     * Parse literal string that matches the pattern
     * @method _parseLiteral
     * @static
     * @private
     * @param {String} literal The pattern that literal should match
     * @param {String} s The literal to be parsed
     * @param {Number} index The position in s where literal is expected to start from
     * @return {Number} Last position read in s. This is used to continue parsing from the end of the literal.
     */
    _parseLiteral: function(literal, s, index) {
        if (s.length - index < literal.length) {
            Y.error("Parse Error: Input too short");
        }
        for (var i = 0; i < literal.length; i++) {
            if (literal.charAt(i) !== s.charAt(index + i)) {
                Y.error("Parse Error: Input does not match");
            }
        }
        return index + literal.length;
    },
    
    /**
     * Parses an integer at the offset of the given string and calls a
     * method on the specified object.
     *
     * @method _parseInt
     * @private
     *
     * @param o           {Object}   The target object.
     * @param f           {function|String} The method to call on the target object.
     *                               If this parameter is a string, then it is used
     *                               as the name of the property to set on the
     *                               target object.
     * @param adjust      {Number}   The numeric adjustment to make on the
     *                               value before calling the object method.
     * @param s           {String}   The string to parse.
     * @param index       {Number}   The index within the string to start parsing.
     * @param fixedlen    {Number}   If specified, specifies the required number
     *                               of digits to be parsed.
     * @param [radix=10]  {Number}   Specifies the radix of the parse string.
     * @return {Number}   The position where the parsed number was found
     */
    _parseInt: function(o, f, adjust, s, index, fixedlen, radix) {
        var len = fixedlen || s.length - index,
            head = index,
            i = 0,
            tail, value, target;
        for (; i < len; i++) {
            if (!s.charAt(index++).match(/\d/)) {
                index--;
                break;
            }
        }
        tail = index;
        if (head === tail) {
            Y.error("Error parsing number. Number not present");
        }
        if (fixedlen && tail - head !== fixedlen) {
            Y.error("Error parsing number. Number too short");
        }
        value = parseInt(s.substring(head, tail), radix || 10);
        if (f) {
            target = o || Y.config.win;
            if (typeof f === "function") {
                f.call(target, value + adjust);
            }
            else {
                target[f] = value + adjust;
            }
        }
        return tail;
    }
});

//
// Text segment class
//

/**
 * Text segment in the pattern.
 * @class BaseFormat.TextSegment
 * @for BaseFormat
 * @namespace Intl.Common
 * @extends Segment
 * @constructor
 * @param {Format} format The parent Format object
 * @param {String} s The pattern representing this segment
 */
Format.TextSegment = function(format, s) {
    if (!format && !s) { return; }
    Format.TextSegment.superclass.constructor.call(this, format, s);
};

Y.extend(Format.TextSegment, Format.Segment);

Y.mix(Format.TextSegment.prototype, {
    /**
     * Parse an object according to the pattern
     * @method parse
     * @param o The parse object. Not used here. This is only used in more complex segment types
     * @param s {String} The string being parsed
     * @param index {Number} The index in s to start parsing from
     * @return {Number} Last position read in s. This is used to continue parsing from the end of the literal.
     */
    parse: function(o, s, index) {
        return Format.Segment._parseLiteral(this._s, s, index);
    }
}, true);

//Utils
/**
 * Pad string to specified length. For internal use.
 * @method zeroPad
 * @for Intl.Common
 * @static
 * @param {String|Number} s The string or number to be padded
 * @param {Number} length The maximum length s should be padded to have
 * @param {String} [zeroChar='0'] The character to be used to pad the string.
 * @param {Boolean} [rightSide=false] If true, padding will be done from the right-side of the string
 * @return {String} The padded string
 */
Y.Intl.Common.zeroPad  = function(s, length, zeroChar, rightSide) {
    s = typeof s === "string" ? s : String(s);

    if (s.length >= length) { return s; }

    zeroChar = zeroChar || '0';
	
    var a = [], i;
    for (i = s.length; i < length; i++) {
        a.push(zeroChar);
    }
    a[rightSide ? "unshift" : "push"](s);

    return a.join("");
};

