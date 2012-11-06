/*
 * Copyright 2012 Yahoo! Inc. All Rights Reserved. Based on code owned by VMWare, Inc. 
 */

//
// Format class
//

/**
 * Base class for all formats. To format an object, instantiate the
 * format of your choice and call the <code>format</code> method which
 * returns the formatted string.
 */
Format = function(pattern, formats) {
    if (arguments.length == 0) {
        return;
    }
    this._pattern = pattern;
    this._segments = []; 
    this.Formats = formats; 
}

// Data

Format.prototype._pattern = null;
Format.prototype._segments = null;

//Exceptions

Y.mix(Format, {
    Exception: function(name, message) {
        this.name = name;
        this.message = message;
        this.toString = function() {
            return this.name + ": " + this.message;
        }
    },
    ParsingException: function(message) {
        ParsingException.superclass.constructor.call(this, "ParsingException", message);
    },
    IllegalArgumentsException: function(message) {
        IllegalArgumentsException.superclass.constructor.call(this, "IllegalArgumentsException", message);
    },
    FormatException: function(message) {
        FormatException.superclass.constructor.call(this, "FormatException", message);
    }
});

Y.extend(Format.ParsingException, Format.Exception);
Y.extend(Format.IllegalArgumentsException, Format.Exception);
Y.extend(Format.FormatException, Format.Exception);

// Public methods

Format.prototype.format = function(object) { 
    var s = [];
        
    for (var i = 0; i < this._segments.length; i++) {
        s.push(this._segments[i].format(object));
    }
    return s.join("");
};

// Protected static methods

function zeroPad (s, length, zeroChar, rightSide) {
    s = typeof s == "string" ? s : String(s);

    if (s.length >= length) return s;

    zeroChar = zeroChar || '0';
	
    var a = [];
    for (var i = s.length; i < length; i++) {
        a.push(zeroChar);
    }
    a[rightSide ? "unshift" : "push"](s);

    return a.join("");
}
    
/** 
 * Parses the given string according to this format's pattern and returns
 * an object.
 * <p>
 * <strong>Note:</strong>
 * The default implementation of this method assumes that the sub-class
 * has implemented the <code>_createParseObject</code> method.
 */
Format.prototype.parse = function(s, pp) {
    var object = this._createParseObject();
    var index = pp || 0;
    for (var i = 0; i < this._segments.length; i++) {
        var segment = this._segments[i];
        index = segment.parse(object, s, index);
    }
        
    if (index < s.length) {
        throw new Format.ParsingException("Input too long");
    }
    return object;
};
    
/**
 * Creates the object that is initialized by parsing
 * <p>
 * <strong>Note:</strong>
 * This must be implemented by sub-classes.
 */
Format.prototype._createParseObject = function(s) {
    throw new Format.ParsingException("Not implemented");
};

//
// Segment class
//

Format.Segment = function(format, s) {
    if (arguments.length == 0) return;
    this._parent = format;
    this._s = s;
};
    
// Public methods

Format.Segment.prototype.format = function(o) { 
    return this._s; 
};

/**
 * Parses the string at the given index, initializes the parse object
 * (as appropriate), and returns the new index within the string for
 * the next parsing step.
 * <p>
 * <strong>Note:</strong>
 * This method must be implemented by sub-classes.
 *
 * @param o     [object] The parse object to be initialized.
 * @param s     [string] The input string to be parsed.
 * @param index [number] The index within the string to start parsing.
 */
Format.Segment.prototype.parse = function(o, s, index) {
    throw new Format.ParsingException("Not implemented");
};

Format.Segment.prototype.getFormat = function() {
    return this._parent;
};

Format.Segment._parseLiteral = function(literal, s, index) {
    if (s.length - index < literal.length) {
        throw new Format.ParsingException("Input too short");
    }
    for (var i = 0; i < literal.length; i++) {
        if (literal.charAt(i) != s.charAt(index + i)) {
            throw new Format.ParsingException("Input doesn't match");
        }
    }
    return index + literal.length;
};
    
/**
 * Parses an integer at the offset of the given string and calls a
 * method on the specified object.
 *
 * @param o         [object]   The target object.
 * @param f         [function|string] The method to call on the target object.
 *                             If this parameter is a string, then it is used
 *                             as the name of the property to set on the
 *                             target object.
 * @param adjust    [number]   The numeric adjustment to make on the
 *                             value before calling the object method.
 * @param s         [string]   The string to parse.
 * @param index     [number]   The index within the string to start parsing.
 * @param fixedlen  [number]   If specified, specifies the required number
 *                             of digits to be parsed.
 * @param radix     [number]   Optional. Specifies the radix of the parse
 *                             string. Defaults to 10 if not specified.
 */
Format.Segment._parseInt = function(o, f, adjust, s, index, fixedlen, radix) {
    var len = fixedlen || s.length - index;
    var head = index;
    for (var i = 0; i < len; i++) {
        if (!s.charAt(index++).match(/\d/)) {
            index--;
            break;
        }
    }
    var tail = index;
    if (head == tail) {
        throw new Format.ParsingException("Number not present");
    }
    if (fixedlen && tail - head != fixedlen) {
        throw new Format.ParsingException("Number too short");
    }
    var value = parseInt(s.substring(head, tail), radix || 10);
    if (f) {
        var target = o || window;
        if (typeof f == "function") {
            f.call(target, value + adjust);
        }
        else {
            target[f] = value + adjust;
        }
    }
    return tail;
};

//
// Text segment class
//

Format.TextSegment = function(format, s) {
    if (arguments.length == 0) return;
    Format.TextSegment.superclass.constructor.call(this, format, s);
};

Y.extend(Format.TextSegment, Format.Segment);

Format.TextSegment.prototype.toString = function() { 
    return "text: \""+this._s+'"'; 
};
    
Format.TextSegment.prototype.parse = function(o, s, index) {
    return Format.Segment._parseLiteral(this._s, s, index);
};

if(String.prototype.trim == null) {
    String.prototype.trim = function() {
        return this.replace(/^\s+/, '').replace(/\s+$/, '');
    };
}
