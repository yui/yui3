if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/format-numbers/format-numbers.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/format-numbers/format-numbers.js",
    code: []
};
_yuitest_coverage["build/format-numbers/format-numbers.js"].code=["YUI.add('format-numbers', function (Y, NAME) {","","/*"," * Copyright 2012 Yahoo! Inc. All Rights Reserved. Based on code owned by VMWare, Inc. "," */","","//","// Format class","//","","/**"," * Base class for all formats. To format an object, instantiate the"," * format of your choice and call the <code>format</code> method which"," * returns the formatted string."," */","Format = function(pattern, formats) {","    if (arguments.length == 0) {","        return;","    }","    this._pattern = pattern;","    this._segments = []; ","    this.Formats = formats; ","}","","// Data","","Format.prototype._pattern = null;","Format.prototype._segments = null;","","//Exceptions","","Y.mix(Format, {","    Exception: function(name, message) {","        this.name = name;","        this.message = message;","        this.toString = function() {","            return this.name + \": \" + this.message;","        }","    },","    ParsingException: function(message) {","        ParsingException.superclass.constructor.call(this, \"ParsingException\", message);","    },","    IllegalArgumentsException: function(message) {","        IllegalArgumentsException.superclass.constructor.call(this, \"IllegalArgumentsException\", message);","    },","    FormatException: function(message) {","        FormatException.superclass.constructor.call(this, \"FormatException\", message);","    }","});","","Y.extend(Format.ParsingException, Format.Exception);","Y.extend(Format.IllegalArgumentsException, Format.Exception);","Y.extend(Format.FormatException, Format.Exception);","","// Public methods","","Format.prototype.format = function(object) { ","    var s = [];","        ","    for (var i = 0; i < this._segments.length; i++) {","        s.push(this._segments[i].format(object));","    }","    return s.join(\"\");","};","","// Protected static methods","","function zeroPad (s, length, zeroChar, rightSide) {","    s = typeof s == \"string\" ? s : String(s);","","    if (s.length >= length) return s;","","    zeroChar = zeroChar || '0';","	","    var a = [];","    for (var i = s.length; i < length; i++) {","        a.push(zeroChar);","    }","    a[rightSide ? \"unshift\" : \"push\"](s);","","    return a.join(\"\");","}","    ","/** "," * Parses the given string according to this format's pattern and returns"," * an object."," * <p>"," * <strong>Note:</strong>"," * The default implementation of this method assumes that the sub-class"," * has implemented the <code>_createParseObject</code> method."," */","Format.prototype.parse = function(s, pp) {","    var object = this._createParseObject();","    var index = pp || 0;","    for (var i = 0; i < this._segments.length; i++) {","        var segment = this._segments[i];","        index = segment.parse(object, s, index);","    }","        ","    if (index < s.length) {","        throw new Format.ParsingException(\"Input too long\");","    }","    return object;","};","    ","/**"," * Creates the object that is initialized by parsing"," * <p>"," * <strong>Note:</strong>"," * This must be implemented by sub-classes."," */","Format.prototype._createParseObject = function(s) {","    throw new Format.ParsingException(\"Not implemented\");","};","","//","// Segment class","//","","Format.Segment = function(format, s) {","    if (arguments.length == 0) return;","    this._parent = format;","    this._s = s;","};","    ","// Public methods","","Format.Segment.prototype.format = function(o) { ","    return this._s; ","};","","/**"," * Parses the string at the given index, initializes the parse object"," * (as appropriate), and returns the new index within the string for"," * the next parsing step."," * <p>"," * <strong>Note:</strong>"," * This method must be implemented by sub-classes."," *"," * @param o     [object] The parse object to be initialized."," * @param s     [string] The input string to be parsed."," * @param index [number] The index within the string to start parsing."," */","Format.Segment.prototype.parse = function(o, s, index) {","    throw new Format.ParsingException(\"Not implemented\");","};","","Format.Segment.prototype.getFormat = function() {","    return this._parent;","};","","Format.Segment._parseLiteral = function(literal, s, index) {","    if (s.length - index < literal.length) {","        throw new Format.ParsingException(\"Input too short\");","    }","    for (var i = 0; i < literal.length; i++) {","        if (literal.charAt(i) != s.charAt(index + i)) {","            throw new Format.ParsingException(\"Input doesn't match\");","        }","    }","    return index + literal.length;","};","    ","/**"," * Parses an integer at the offset of the given string and calls a"," * method on the specified object."," *"," * @param o         [object]   The target object."," * @param f         [function|string] The method to call on the target object."," *                             If this parameter is a string, then it is used"," *                             as the name of the property to set on the"," *                             target object."," * @param adjust    [number]   The numeric adjustment to make on the"," *                             value before calling the object method."," * @param s         [string]   The string to parse."," * @param index     [number]   The index within the string to start parsing."," * @param fixedlen  [number]   If specified, specifies the required number"," *                             of digits to be parsed."," * @param radix     [number]   Optional. Specifies the radix of the parse"," *                             string. Defaults to 10 if not specified."," */","Format.Segment._parseInt = function(o, f, adjust, s, index, fixedlen, radix) {","    var len = fixedlen || s.length - index;","    var head = index;","    for (var i = 0; i < len; i++) {","        if (!s.charAt(index++).match(/\\d/)) {","            index--;","            break;","        }","    }","    var tail = index;","    if (head == tail) {","        throw new Format.ParsingException(\"Number not present\");","    }","    if (fixedlen && tail - head != fixedlen) {","        throw new Format.ParsingException(\"Number too short\");","    }","    var value = parseInt(s.substring(head, tail), radix || 10);","    if (f) {","        var target = o || window;","        if (typeof f == \"function\") {","            f.call(target, value + adjust);","        }","        else {","            target[f] = value + adjust;","        }","    }","    return tail;","};","","//","// Text segment class","//","","Format.TextSegment = function(format, s) {","    if (arguments.length == 0) return;","    Format.TextSegment.superclass.constructor.call(this, format, s);","};","","Y.extend(Format.TextSegment, Format.Segment);","","Format.TextSegment.prototype.toString = function() { ","    return \"text: \\\"\"+this._s+'\"'; ","};","    ","Format.TextSegment.prototype.parse = function(o, s, index) {","    return Format.Segment._parseLiteral(this._s, s, index);","};","","if(String.prototype.trim == null) {","    String.prototype.trim = function() {","        return this.replace(/^\\s+/, '').replace(/\\s+$/, '');","    };","}","/**"," * NumberFormat helps you to format and parse numbers for any locale."," * Your code can be completely independent of the locale conventions for decimal points, thousands-separators,"," * or even the particular decimal digits used, or whether the number format is even decimal."," * "," * This module uses parts of zimbra NumberFormat"," * "," * @module format-numbers"," * @requires format-base"," */","","/**"," * @param pattern       The number pattern."," * @param formats       locale data"," * @param skipNegFormat Specifies whether to skip the generation of this"," *                      format's negative value formatter."," *                      <p>"," *                      <strong>Note:</strong> "," *                      This parameter is only used by the implementation "," *                      and should not be passed by application code "," *                      instantiating a custom number format."," */","","var MODULE_NAME = \"format-numbers\";","","NumberFormat = function(pattern, formats, skipNegFormat) {","    if (arguments.length == 0) {","        return;","    }","","    Format.call(this, pattern, formats);","    if (!pattern) {","        return;","    }","","    if(pattern == \"{plural_style}\") {","        pattern = this.Formats.decimalFormat;","        this._isPluralCurrency = true;","	this._pattern = pattern;","    }","","    //Default currency","    this.currency = this.Formats.defaultCurrency;","    if(this.currency == null || this.currency == \"\") {","        this.currency = \"USD\";","    }","        ","    var patterns = pattern.split(/;/);","    pattern = patterns[0];","	","    this._useGrouping = (pattern.indexOf(\",\") != -1);      //Will be set to true if pattern uses grouping","    this._parseIntegerOnly = (pattern.indexOf(\".\") == -1);  //Will be set to false if pattern contains fractional parts","        ","    //If grouping is used, find primary and secondary grouping","    if(this._useGrouping) {","        var numberPattern = pattern.match(/[0#,]+/);","        var groupingRegex = new RegExp(\"[0#]+\", \"g\");","        var groups = numberPattern[0].match(groupingRegex);","            ","        var i = groups.length - 2;","        this._primaryGrouping = groups[i+1].length;","        this._secondaryGrouping = (i > 0 ? groups[i].length : groups[i+1].length);","    }","        ","    // parse prefix","    i = 0;","        ","    var results = this.__parseStatic(pattern, i);","    i = results.offset;","    var hasPrefix = results.text != \"\";","    if (hasPrefix) {","        this._segments.push(new Format.TextSegment(this, results.text));","    }","	","    // parse number descriptor","    var start = i;","    while (i < pattern.length &&","        NumberFormat._META_CHARS.indexOf(pattern.charAt(i)) != -1) {","        i++;","    }","    var end = i;","","    var numPattern = pattern.substring(start, end);","    var e = numPattern.indexOf(this.Formats.exponentialSymbol);","    var expon = e != -1 ? numPattern.substring(e + 1) : null;","    if (expon) {","        numPattern = numPattern.substring(0, e);","        this._showExponent = true;","    }","	","    var dot = numPattern.indexOf('.');","    var whole = dot != -1 ? numPattern.substring(0, dot) : numPattern;","    if (whole) {","        /*var comma = whole.lastIndexOf(',');","            if (comma != -1) {","                this._groupingOffset = whole.length - comma - 1;","            }*/","        whole = whole.replace(/[^#0]/g,\"\");","        var zero = whole.indexOf('0');","        if (zero != -1) {","            this._minIntDigits = whole.length - zero;","        }","        this._maxIntDigits = whole.length;","    }","	","    var fract = dot != -1 ? numPattern.substring(dot + 1) : null;","    if (fract) {","        zero = fract.lastIndexOf('0');","        if (zero != -1) {","            this._minFracDigits = zero + 1;","        }","        this._maxFracDigits = fract.replace(/[^#0]/g,\"\").length;","    }","	","    this._segments.push(new NumberFormat.NumberSegment(this, numPattern));","	","    // parse suffix","    results = this.__parseStatic(pattern, i);","    i = results.offset;","    if (results.text != \"\") {","        this._segments.push(new Format.TextSegment(this, results.text));","    }","	","    // add negative formatter","    if (skipNegFormat) return;","	","    if (patterns.length > 1) {","        pattern = patterns[1];","        this._negativeFormatter = new NumberFormat(pattern, formats, true);","    }","    else {","        // no negative pattern; insert minus sign before number segment","        var formatter = new NumberFormat(\"\", formats);","        formatter._segments = formatter._segments.concat(this._segments);","","        var index = hasPrefix ? 1 : 0;","        var minus = new Format.TextSegment(formatter, this.Formats.minusSign);","        formatter._segments.splice(index, 0, minus);","		","        this._negativeFormatter = formatter;","    }","}","NumberFormat.prototype = new Format;","NumberFormat.prototype.constructor = NumberFormat;","    ","// Constants","","NumberFormat._NUMBER = \"number\";","NumberFormat._INTEGER = \"integer\";","NumberFormat._CURRENCY = \"currency\";","NumberFormat._PERCENT = \"percent\";","","NumberFormat._META_CHARS = \"0#.,E\";","","// Data","","NumberFormat.prototype._groupingOffset = Number.MAX_VALUE;","//NumberFormat.prototype._maxIntDigits;","NumberFormat.prototype._minIntDigits = 1;","//NumberFormat.prototype._maxFracDigits;","//NumberFormat.prototype._minFracDigits;","NumberFormat.prototype._isCurrency = false;","NumberFormat.prototype._isPercent = false;","NumberFormat.prototype._isPerMille = false;","NumberFormat.prototype._showExponent = false;","//NumberFormat.prototype._negativeFormatter;","","// Public methods","","NumberFormat.prototype.format = function(number) {","    if (number < 0 && this._negativeFormatter) {","        return this._negativeFormatter.format(number);","    }","        ","    var result = Format.prototype.format.call(this, number);","        ","    if(this._isPluralCurrency) {","        var pattern = \"\";","        if(number == 1) {","            //Singular","            pattern = this.Formats.currencyPatternSingular;","            pattern = pattern.replace(\"{1}\", this.Formats[this.currency + \"_currencySingular\"]);","        } else {","            //Plural","            pattern = this.Formats.currencyPatternPlural;","            pattern = pattern.replace(\"{1}\", this.Formats[this.currency + \"_currencyPlural\"]);","        }","            ","        result = pattern.replace(\"{0}\", result);","    }","        ","    return result;","};","    ","NumberFormat.prototype.parse = function(s, pp) {","    if(s.indexOf(this.Formats.minusSign) != -1 && this._negativeFormatter) {","        return this._negativeFormatter.parse(s, pp);","    }","        ","    if(this._isPluralCurrency) {","        var singular = this.Formats[this.currency + \"_currencySingular\"];","        var plural = this.Formats[this.currency + \"_currencyPlural\"];","            ","        s = s.replace(plural, \"\").replace(singular, \"\").trim();","    }","        ","    var object = null;","    try {","        object = Format.prototype.parse.call(this, s, pp);","        object = object.value;","    } catch(e) {","    }","        ","    return object;","}","","// Private methods","","NumberFormat.prototype.__parseStatic = function(s, i) {","    var data = [];","    while (i < s.length) {","        var c = s.charAt(i++);","        if (NumberFormat._META_CHARS.indexOf(c) != -1) {","            i--;","            break;","        }","        switch (c) {","            case \"'\": {","                var start = i;","                while (i < s.length && s.charAt(i++) != \"'\") {","                // do nothing","                }","                var end = i;","                c = end - start == 0 ? \"'\" : s.substring(start, end);","                break;","            }","            case '%': {","                c = this.Formats.percentSign; ","                this._isPercent = true;","                break;","            }","            case '\\u2030': {","                c = this.Formats.perMilleSign; ","                this._isPerMille = true;","                break;","            }","            case '\\u00a4': {","                if(s.charAt(i) == '\\u00a4') {","                    c = this.Formats[this.currency + \"_currencyISO\"];","                    i++;","                } else {","                    c = this.Formats[this.currency + \"_currencySymbol\"];","                }","                this._isCurrency = true;","                break;","            }","        }","        data.push(c);","    }","    return {","        text: data.join(\"\"), ","        offset: i","    };","};","    ","NumberFormat.prototype._createParseObject = function() {","    return {","        value: null","    };","};","    ","//","// NumberFormat.NumberSegment class","//","","NumberFormat.NumberSegment = function(format, s) {","    if (arguments.length == 0) return;","    Format.Segment.call(this, format, s);","};","NumberFormat.NumberSegment.prototype = new Format.Segment;","NumberFormat.NumberSegment.prototype.constructor = NumberFormat.NumberSegment;","    ","// Public methods","","NumberFormat.NumberSegment.prototype.format = function(number) {","    // special values","    if (isNaN(number)) return this._parent.Formats.nanSymbol;","    if (number === Number.NEGATIVE_INFINITY || number === Number.POSITIVE_INFINITY) {","        return this._parent.Formats.infinitySign;","    }","","    // adjust value","    if (typeof number != \"number\") number = Number(number);","    number = Math.abs(number); // NOTE: minus sign is part of pattern","    if (this._parent._isPercent) number *= 100;","    else if (this._parent._isPerMille) number *= 1000;","    if(this._parent._parseIntegerOnly) number = Math.floor(number);","        ","    // format","    var expon = this._parent.Formats.exponentialSymbol;","    var exponReg = new RegExp(expon + \"+\");","    var s = this._parent._showExponent","    ? number.toExponential(this._parent._maxFracDigits).toUpperCase().replace(exponReg,expon)","    : number.toFixed(this._parent._maxFracDigits || 0);","    s = this._normalize(s);","    return s;","};","","// Protected methods","","NumberFormat.NumberSegment.prototype._normalize = function(s) {","    var exponSymbol = this._parent.Formats.exponentialSymbol;","    var splitReg = new RegExp(\"[\\\\.\" + exponSymbol + \"]\")","    var match = s.split(splitReg);","	","    // normalize whole part","    var whole = match.shift();","    if (whole.length < this._parent._minIntDigits) {","        whole = zeroPad(whole, this._parent._minIntDigits, this._parent.Formats.numberZero);","    }","    if (whole.length > this._parent._primaryGrouping && this._parent._useGrouping) {","        var a = [];","	    ","        var offset = this._parent._primaryGrouping;","        var i = whole.length - offset;","        while (i > 0) {","            a.unshift(whole.substr(i, offset));","            a.unshift(this._parent.Formats.groupingSeparator);","            offset = this._parent._secondaryGrouping;","            i -= offset;","        }","        a.unshift(whole.substring(0, i + offset));","		","        whole = a.join(\"\");","    }","	","    // normalize rest","    var fract = '0';","    var expon;","        ","    if(s.match(/\\./))","        fract = match.shift();","    else if(s.match(/\\e/) || s.match(/\\E/))","        expon = match.shift();","","    fract = fract.replace(/0+$/,\"\");","    if (fract.length < this._parent._minFracDigits) {","        fract = zeroPad(fract, this._parent._minFracDigits, this._parent.Formats.numberZero, true);","    }","	","    a = [ whole ];","    if (fract.length > 0) {","        var decimal = this._parent.Formats.decimalSeparator;","        a.push(decimal, fract);","    }","    if (expon) {","        a.push(exponSymbol, expon.replace(/^\\+/,\"\"));","    }","	","    // return normalize result","    return a.join(\"\");","}","    ","NumberFormat.NumberSegment.prototype.parse = function(object, s, index) {","    var comma = this._parent.Formats.groupingSeparator;","    var dot = this._parent.Formats.decimalSeparator;","    var minusSign = this._parent.Formats.minusSign;","    var expon = this._parent.Formats.exponentialSymbol;","        ","    var numberRegexPattern = \"[\\\\\" + minusSign + \"0-9\" + comma + \"]+\";","    if(!this._parent._parseIntegerOnly) {","        numberRegexPattern += \"(\\\\\" + dot + \"[0-9]+)?\";","    }","    if(this._parent._showExponent) {","        numberRegexPattern += \"(\" + expon +\"\\\\+?[0-9]+)\";","    }","        ","    var numberRegex = new RegExp(numberRegexPattern);","    var matches = s.match(numberRegex);","        ","    if(!matches) {","        throw new Format.ParsingException(\"Number does not match pattern\");","    }","        ","    var negativeNum = s.indexOf(minusSign) != -1;","    var endIndex = index + matches[0].length;","    s = s.slice(index, endIndex);","        ","    var scientific = null;","        ","    //Scientific format does not use grouping","    if(this._parent.showExponent) {","        scientific = s.split(expon);","    } else if(this._parent._useGrouping) {","        //Verify grouping data exists","        if(!this._parent._primaryGrouping) {","            //Should not happen","            throw new Format.ParsingException(\"Invalid pattern\");","        }","            ","        //Verify grouping is correct","        var i = s.length - this._parent._primaryGrouping - 1;","            ","        if(matches[1]) {","            //If there is a decimal part, ignore that. Grouping assumed to apply only to whole number part","            i = i - matches[1].length;","        }","            ","        //Use primary grouping for first group","        if(i > 0) {","            //There should be a comma at i","            if(s.charAt(i) != ',') {","                throw new Format.ParsingException(\"Number does not match pattern\");","            }","                ","            //Remove comma","            s = s.slice(0, i) + s.slice(i+1);","        }","            ","        //If more groups, use primary/secondary grouping as applicable","        var grouping = this._parent._secondaryGrouping || this._parent._primaryGrouping;","        i = i - grouping - 1;","            ","        while(i > 0) {","            //There should be a comma at i","            if(s.charAt(i) != ',') {","                throw new Format.ParsingException(\"Number does not match pattern\");","            }","                ","            //Remove comma","            s = s.slice(0, i) + s.slice(i+1);","            i = i - grouping - 1;","        }","            ","        //Verify there are no more grouping separators","        if(s.indexOf(comma) != -1) {","            throw new Format.ParsingException(\"Number does not match pattern\");","        }","    }","        ","    if(scientific) {","        object.value = parseFloat(scientific[0], 10) * Math.pow(10, parseFloat(scientific[1], 10));","    } else {","        object.value = parseFloat(s, 10);","    }","        ","    //Special types","    if(negativeNum) object.value *= -1;","    if (this._parent._isPercent) object.value /= 100;","    else if (this._parent._isPerMille) object.value /= 1000;","        ","    return endIndex;","};","    ","//","// YUI Code","//","    ","/**"," * NumberFormat"," * @class Y.NumberFormat"," * @constructor"," * @param {Number} style (Optional) the given style. Defaults to Number style"," */","Y.NumberFormat = function(style) {","    style = style || Y.NumberFormat.STYLES.NUMBER_STYLE;","        ","    var pattern = \"\";","    var formats = Y.Intl.get(MODULE_NAME);","    switch(style) {","        case Y.NumberFormat.STYLES.CURRENCY_STYLE:","            pattern = formats.currencyFormat;","            break;","        case Y.NumberFormat.STYLES.ISO_CURRENCY_STYLE:","            pattern = formats.currencyFormat;","            pattern = pattern.replace(\"\\u00a4\", \"\\u00a4\\u00a4\");","            break;","        case Y.NumberFormat.STYLES.NUMBER_STYLE:","            pattern = formats.decimalFormat;","            break;","        case Y.NumberFormat.STYLES.PERCENT_STYLE:","            pattern = formats.percentFormat;","            break;","        case Y.NumberFormat.STYLES.PLURAL_CURRENCY_STYLE:","            //This is like <value> <currency>. This may be dependent on whether the value is singular or plural. Will be handled during formatting","            pattern = \"{plural_style}\";","            break;","        case Y.NumberFormat.STYLES.SCIENTIFIC_STYLE:","            pattern = formats.scientificFormat;","            break;","    }","        ","    this._numberFormatInstance = new NumberFormat(pattern, formats);","}","    ","Y.NumberFormat.STYLES = {","    CURRENCY_STYLE: 1,","    ISO_CURRENCY_STYLE: 2,","    NUMBER_STYLE: 4,","    PERCENT_STYLE: 8,","    PLURAL_CURRENCY_STYLE: 16,","    SCIENTIFIC_STYLE: 32","}","    ","//Exceptions","    ","Y.NumberFormat.UnknownStyleException = function(message) {","    this.message = message;","}","Y.NumberFormat.UnknownStyleException.prototype.toString = function() {","    return \"UnknownStyleException: \" + this.message;","}","    ","//Static methods","    ","/**"," * Create an instance of NumberFormat "," * @param {Number} style (Optional) the given style"," */    ","Y.NumberFormat.createInstance = function(style) {","    return new Y.NumberFormat(style);","}","","/**"," * Returns an array of BCP 47 language tags for the languages supported by this class"," * @return {Array} an array of BCP 47 language tags for the languages supported by this class."," */","Y.NumberFormat.getAvailableLocales = function() {","    return Y.Intl.getAvailableLangs(MODULE_NAME);","}","    ","//Public methods","    ","/**"," * Format a number to product a String."," * @param {Number} number the number to format"," */","Y.NumberFormat.prototype.format = function(number) {","    return this._numberFormatInstance.format(number);","}","    ","/**"," * Gets the currency used to display currency amounts. This may be an empty string for some cases. "," * @return {String} a 3-letter ISO code indicating the currency in use, or an empty string."," */","Y.NumberFormat.prototype.getCurrency = function() {","    return this._numberFormatInstance.currency;","}","    ","/**"," * Returns the maximum number of digits allowed in the fraction portion of a number. "," * @return {Number} the maximum number of digits allowed in the fraction portion of a number."," */","Y.NumberFormat.prototype.getMaximumFractionDigits = function() {","    return this._numberFormatInstance._maxFracDigits || 0;","}","    ","/**"," * Returns the maximum number of digits allowed in the integer portion of a number. "," * @return {Number} the maximum number of digits allowed in the integer portion of a number."," */","Y.NumberFormat.prototype.getMaximumIntegerDigits = function() {","    return this._numberFormatInstance._maxIntDigits || 0;","}","    ","/**"," * Returns the minimum number of digits allowed in the fraction portion of a number. "," * @return {Number} the minimum number of digits allowed in the fraction portion of a number."," */","Y.NumberFormat.prototype.getMinimumFractionDigits = function() {","    return this._numberFormatInstance._minFracDigits || 0;","}","    ","/**"," * Returns the minimum number of digits allowed in the integer portion of a number."," * @return {Number} the minimum number of digits allowed in the integer portion of a number."," */","Y.NumberFormat.prototype.getMinimumIntegerDigits = function() {","    return this._numberFormatInstance._minIntDigits || 0;","}","    ","/**"," * Returns true if grouping is used in this format."," * For example, in the English locale, with grouping on, the number 1234567 might be formatted as \"1,234,567\"."," * The grouping separator as well as the size of each group is locale dependant."," * @return {Boolean}"," */","Y.NumberFormat.prototype.isGroupingUsed = function() {","    return this._numberFormatInstance._useGrouping;","}","    ","/**"," * Return true if this format will parse numbers as integers only."," * For example in the English locale, with ParseIntegerOnly true, the string \"1234.\" would be parsed as the integer value 1234"," * and parsing would stop at the \".\" character. Of course, the exact format accepted by the parse operation is locale dependant."," * @return {Boolean}"," */","Y.NumberFormat.prototype.isParseIntegerOnly = function() {","    return this._numberFormatInstance._parseIntegerOnly;","}","    ","/**"," * Parse the string to get a number"," * @param {String} txt The string to parse"," * @param {Number} pp (Optional) Parse position. The position to start parsing at. Defaults to 0"," */","Y.NumberFormat.prototype.parse = function(txt, pp) {","    return this._numberFormatInstance.parse(txt, pp);","}","    ","/**"," * Sets the currency used to display currency amounts."," * This takes effect immediately, if this format is a currency format."," * If this format is not a currency format, then the currency is used if and when this object becomes a currency format."," * @param {String} currency a 3-letter ISO code indicating new currency to use. May be the empty string to indicate no currency."," */","Y.NumberFormat.prototype.setCurrency = function(currency) {","    this._numberFormatInstance.currency = currency;","}","    ","/**"," * Set whether or not grouping will be used in this format. "," * @param {Boolean} value"," */","Y.NumberFormat.prototype.setGroupingUsed = function(value) {","    this._numberFormatInstance._useGrouping = value;","}","    ","/**"," * Sets the maximum number of digits allowed in the fraction portion of a number."," * maximumFractionDigits must be >= minimumFractionDigits."," * If the new value for maximumFractionDigits is less than the current value of minimumFractionDigits,"," * then minimumFractionDigits will also be set to the new value. "," * @param {Number} newValue the new value to be set."," */","Y.NumberFormat.prototype.setMaximumFractionDigits = function(newValue) {","    this._numberFormatInstance._maxFracDigits = newValue;","        ","    if(this.getMinimumFractionDigits() > newValue) {","        this.setMinimumFractionDigits(newValue);","    }","}","    ","/**"," * Sets the maximum number of digits allowed in the integer portion of a number."," * maximumIntegerDigits must be >= minimumIntegerDigits."," * If the new value for maximumIntegerDigits is less than the current value of minimumIntegerDigits,"," * then minimumIntegerDigits will also be set to the new value."," * @param {Number} newValue the new value to be set."," */","Y.NumberFormat.prototype.setMaximumIntegerDigits = function(newValue) {","    this._numberFormatInstance._maxIntDigits = newValue;","        ","    if(this.getMinimumIntegerDigits() > newValue) {","        this.setMinimumIntegerDigits(newValue);","    }","}","    ","/**"," * Sets the minimum number of digits allowed in the fraction portion of a number."," * minimumFractionDigits must be <= maximumFractionDigits."," * If the new value for minimumFractionDigits exceeds the current value of maximumFractionDigits,"," * then maximumIntegerDigits will also be set to the new value"," * @param {Number} newValue the new value to be set."," */","Y.NumberFormat.prototype.setMinimumFractionDigits = function(newValue) {","    this._numberFormatInstance._minFracDigits = newValue;","        ","    if(this.getMaximumFractionDigits() < newValue) {","        this.setMaximumFractionDigits(newValue);","    }","}","    ","/**"," * Sets the minimum number of digits allowed in the integer portion of a number."," * minimumIntegerDigits must be <= maximumIntegerDigits."," * If the new value for minimumIntegerDigits exceeds the current value of maximumIntegerDigits,"," * then maximumIntegerDigits will also be set to the new value. "," * @param {Number} newValue the new value to be set."," */","Y.NumberFormat.prototype.setMinimumIntegerDigits = function(newValue) {","    this._numberFormatInstance._minIntDigits = newValue;","        ","    if(this.getMaximumIntegerDigits() < newValue) {","        this.setMaximumIntegerDigits(newValue);","    }","}","    ","/**"," * Sets whether or not numbers should be parsed as integers only. "," * @param {Boolean} newValue set True, this format will parse numbers as integers only."," */","Y.NumberFormat.prototype.setParseIntegerOnly = function(newValue) {","    this._numberFormatInstance._parseIntegerOnly = newValue;","}","","","}, '@VERSION@', {","    \"lang\": [","        \"af-NA\",","        \"af\",","        \"af-ZA\",","        \"am-ET\",","        \"am\",","        \"ar-AE\",","        \"ar-BH\",","        \"ar-DZ\",","        \"ar-EG\",","        \"ar-IQ\",","        \"ar-JO\",","        \"ar-KW\",","        \"ar-LB\",","        \"ar-LY\",","        \"ar-MA\",","        \"ar-OM\",","        \"ar-QA\",","        \"ar-SA\",","        \"ar-SD\",","        \"ar-SY\",","        \"ar-TN\",","        \"ar\",","        \"ar-YE\",","        \"as-IN\",","        \"as\",","        \"az-AZ\",","        \"az-Cyrl-AZ\",","        \"az-Cyrl\",","        \"az-Latn-AZ\",","        \"az-Latn\",","        \"az\",","        \"be-BY\",","        \"be\",","        \"bg-BG\",","        \"bg\",","        \"bn-BD\",","        \"bn-IN\",","        \"bn\",","        \"bo-CN\",","        \"bo-IN\",","        \"bo\",","        \"ca-ES\",","        \"ca\",","        \"cs-CZ\",","        \"cs\",","        \"cy-GB\",","        \"cy\",","        \"da-DK\",","        \"da\",","        \"de-AT\",","        \"de-BE\",","        \"de-CH\",","        \"de-DE\",","        \"de-LI\",","        \"de-LU\",","        \"de\",","        \"el-CY\",","        \"el-GR\",","        \"el\",","        \"en-AU\",","        \"en-BE\",","        \"en-BW\",","        \"en-BZ\",","        \"en-CA\",","        \"en-GB\",","        \"en-HK\",","        \"en-IE\",","        \"en-IN\",","        \"en-JM\",","        \"en-JO\",","        \"en-MH\",","        \"en-MT\",","        \"en-MY\",","        \"en-NA\",","        \"en-NZ\",","        \"en-PH\",","        \"en-PK\",","        \"en-RH\",","        \"en-SG\",","        \"en-TT\",","        \"en\",","        \"en-US-POSIX\",","        \"en-US\",","        \"en-VI\",","        \"en-ZA\",","        \"en-ZW\",","        \"eo\",","        \"es-AR\",","        \"es-BO\",","        \"es-CL\",","        \"es-CO\",","        \"es-CR\",","        \"es-DO\",","        \"es-EC\",","        \"es-ES\",","        \"es-GT\",","        \"es-HN\",","        \"es-MX\",","        \"es-NI\",","        \"es-PA\",","        \"es-PE\",","        \"es-PR\",","        \"es-PY\",","        \"es-SV\",","        \"es\",","        \"es-US\",","        \"es-UY\",","        \"es-VE\",","        \"et-EE\",","        \"et\",","        \"eu-ES\",","        \"eu\",","        \"fa-AF\",","        \"fa-IR\",","        \"fa\",","        \"fi-FI\",","        \"fi\",","        \"fil-PH\",","        \"fil\",","        \"fo-FO\",","        \"fo\",","        \"fr-BE\",","        \"fr-CA\",","        \"fr-CH\",","        \"fr-FR\",","        \"fr-LU\",","        \"fr-MC\",","        \"fr-SN\",","        \"fr\",","        \"ga-IE\",","        \"ga\",","        \"gl-ES\",","        \"gl\",","        \"gsw-CH\",","        \"gsw\",","        \"gu-IN\",","        \"gu\",","        \"gv-GB\",","        \"gv\",","        \"ha-GH\",","        \"ha-Latn-GH\",","        \"ha-Latn-NE\",","        \"ha-Latn-NG\",","        \"ha-Latn\",","        \"ha-NE\",","        \"ha-NG\",","        \"ha\",","        \"haw\",","        \"haw-US\",","        \"he-IL\",","        \"he\",","        \"hi-IN\",","        \"hi\",","        \"hr-HR\",","        \"hr\",","        \"hu-HU\",","        \"hu\",","        \"hy-AM-REVISED\",","        \"hy-AM\",","        \"hy\",","        \"id-ID\",","        \"id\",","        \"ii-CN\",","        \"ii\",","        \"in-ID\",","        \"in\",","        \"is-IS\",","        \"is\",","        \"it-CH\",","        \"it-IT\",","        \"it\",","        \"iw-IL\",","        \"iw\",","        \"ja-JP-TRADITIONAL\",","        \"ja-JP\",","        \"ja\",","        \"ka-GE\",","        \"ka\",","        \"kk-Cyrl-KZ\",","        \"kk-Cyrl\",","        \"kk-KZ\",","        \"kk\",","        \"kl-GL\",","        \"kl\",","        \"km-KH\",","        \"km\",","        \"kn-IN\",","        \"kn\",","        \"kok-IN\",","        \"kok\",","        \"ko-KR\",","        \"ko\",","        \"kw-GB\",","        \"kw\",","        \"lt-LT\",","        \"lt\",","        \"lv-LV\",","        \"lv\",","        \"mk-MK\",","        \"mk\",","        \"ml-IN\",","        \"ml\",","        \"mr-IN\",","        \"mr\",","        \"ms-BN\",","        \"ms-MY\",","        \"ms\",","        \"mt-MT\",","        \"mt\",","        \"nb-NO\",","        \"nb\",","        \"ne-IN\",","        \"ne-NP\",","        \"ne\",","        \"nl-BE\",","        \"nl-NL\",","        \"nl\",","        \"nn-NO\",","        \"nn\",","        \"no-NO-NY\",","        \"no-NO\",","        \"no\",","        \"om-ET\",","        \"om-KE\",","        \"om\",","        \"or-IN\",","        \"or\",","        \"pa-Arab-PK\",","        \"pa-Arab\",","        \"pa-Guru-IN\",","        \"pa-Guru\",","        \"pa-IN\",","        \"pa-PK\",","        \"pa\",","        \"pl-PL\",","        \"pl\",","        \"ps-AF\",","        \"ps\",","        \"pt-BR\",","        \"pt-PT\",","        \"pt\",","        \"ro-MD\",","        \"ro-RO\",","        \"ro\",","        \"ru-RU\",","        \"ru\",","        \"ru-UA\",","        \"sh-BA\",","        \"sh-CS\",","        \"sh\",","        \"sh-YU\",","        \"si-LK\",","        \"si\",","        \"sk-SK\",","        \"sk\",","        \"sl-SI\",","        \"sl\",","        \"so-DJ\",","        \"so-ET\",","        \"so-KE\",","        \"so-SO\",","        \"so\",","        \"sq-AL\",","        \"sq\",","        \"sr-BA\",","        \"sr-CS\",","        \"sr-Cyrl-BA\",","        \"sr-Cyrl-CS\",","        \"sr-Cyrl-ME\",","        \"sr-Cyrl-RS\",","        \"sr-Cyrl\",","        \"sr-Cyrl-YU\",","        \"sr-Latn-BA\",","        \"sr-Latn-CS\",","        \"sr-Latn-ME\",","        \"sr-Latn-RS\",","        \"sr-Latn\",","        \"sr-Latn-YU\",","        \"sr-ME\",","        \"sr-RS\",","        \"sr\",","        \"sr-YU\",","        \"sv-FI\",","        \"sv-SE\",","        \"sv\",","        \"sw-KE\",","        \"sw\",","        \"sw-TZ\",","        \"ta-IN\",","        \"ta\",","        \"te-IN\",","        \"te\",","        \"th-TH-TRADITIONAL\",","        \"th-TH\",","        \"th\",","        \"ti-ER\",","        \"ti-ET\",","        \"ti\",","        \"tl-PH\",","        \"tl\",","        \"tr-TR\",","        \"tr\",","        \"uk\",","        \"uk-UA\",","        \"ur-IN\",","        \"ur-PK\",","        \"ur\",","        \"uz-AF\",","        \"uz-Arab-AF\",","        \"uz-Arab\",","        \"uz-Cyrl\",","        \"uz-Cyrl-UZ\",","        \"uz-Latn\",","        \"uz-Latn-UZ\",","        \"uz\",","        \"uz-UZ\",","        \"vi\",","        \"vi-VN\",","        \"zh-CN\",","        \"zh-Hans-CN\",","        \"zh-Hans-HK\",","        \"zh-Hans-MO\",","        \"zh-Hans-SG\",","        \"zh-Hans\",","        \"zh-Hant-HK\",","        \"zh-Hant-MO\",","        \"zh-Hant-TW\",","        \"zh-Hant\",","        \"zh-HK\",","        \"zh-MO\",","        \"zh-SG\",","        \"zh-TW\",","        \"zh\",","        \"zu\",","        \"zu-ZA\"","    ]","});"];
_yuitest_coverage["build/format-numbers/format-numbers.js"].lines = {"1":0,"16":0,"17":0,"18":0,"20":0,"21":0,"22":0,"27":0,"28":0,"32":0,"34":0,"35":0,"36":0,"37":0,"41":0,"44":0,"47":0,"51":0,"52":0,"53":0,"57":0,"58":0,"60":0,"61":0,"63":0,"68":0,"69":0,"71":0,"73":0,"75":0,"76":0,"77":0,"79":0,"81":0,"92":0,"93":0,"94":0,"95":0,"96":0,"97":0,"100":0,"101":0,"103":0,"112":0,"113":0,"120":0,"121":0,"122":0,"123":0,"128":0,"129":0,"144":0,"145":0,"148":0,"149":0,"152":0,"153":0,"154":0,"156":0,"157":0,"158":0,"161":0,"182":0,"183":0,"184":0,"185":0,"186":0,"187":0,"188":0,"191":0,"192":0,"193":0,"195":0,"196":0,"198":0,"199":0,"200":0,"201":0,"202":0,"205":0,"208":0,"215":0,"216":0,"217":0,"220":0,"222":0,"223":0,"226":0,"227":0,"230":0,"231":0,"232":0,"258":0,"260":0,"261":0,"262":0,"265":0,"266":0,"267":0,"270":0,"271":0,"272":0,"273":0,"277":0,"278":0,"279":0,"282":0,"283":0,"285":0,"286":0,"289":0,"290":0,"291":0,"292":0,"294":0,"295":0,"296":0,"300":0,"302":0,"303":0,"304":0,"305":0,"306":0,"310":0,"311":0,"313":0,"315":0,"317":0,"318":0,"319":0,"320":0,"321":0,"322":0,"325":0,"326":0,"327":0,"332":0,"333":0,"334":0,"335":0,"337":0,"340":0,"341":0,"342":0,"343":0,"344":0,"346":0,"349":0,"352":0,"353":0,"354":0,"355":0,"359":0,"361":0,"362":0,"363":0,"367":0,"368":0,"370":0,"371":0,"372":0,"374":0,"377":0,"378":0,"382":0,"383":0,"384":0,"385":0,"387":0,"391":0,"393":0,"396":0,"397":0,"398":0,"399":0,"404":0,"405":0,"406":0,"409":0,"411":0,"412":0,"413":0,"415":0,"416":0,"419":0,"420":0,"423":0,"426":0,"429":0,"430":0,"431":0,"434":0,"435":0,"436":0,"438":0,"441":0,"442":0,"443":0,"444":0,"448":0,"453":0,"454":0,"455":0,"456":0,"457":0,"458":0,"459":0,"461":0,"463":0,"464":0,"467":0,"468":0,"469":0,"472":0,"473":0,"474":0,"477":0,"478":0,"479":0,"482":0,"483":0,"484":0,"486":0,"488":0,"489":0,"492":0,"494":0,"500":0,"501":0,"510":0,"511":0,"512":0,"514":0,"515":0,"519":0,"521":0,"522":0,"523":0,"527":0,"528":0,"529":0,"530":0,"531":0,"534":0,"535":0,"536":0,"539":0,"540":0,"545":0,"546":0,"547":0,"548":0,"551":0,"552":0,"553":0,"555":0,"556":0,"558":0,"559":0,"560":0,"561":0,"562":0,"563":0,"564":0,"566":0,"568":0,"572":0,"573":0,"575":0,"576":0,"577":0,"578":0,"580":0,"581":0,"582":0,"585":0,"586":0,"587":0,"588":0,"590":0,"591":0,"595":0,"598":0,"599":0,"600":0,"601":0,"602":0,"604":0,"605":0,"606":0,"608":0,"609":0,"612":0,"613":0,"615":0,"616":0,"619":0,"620":0,"621":0,"623":0,"626":0,"627":0,"628":0,"630":0,"632":0,"636":0,"638":0,"640":0,"644":0,"646":0,"647":0,"651":0,"655":0,"656":0,"658":0,"660":0,"661":0,"665":0,"666":0,"670":0,"671":0,"675":0,"676":0,"678":0,"682":0,"683":0,"684":0,"686":0,"699":0,"700":0,"702":0,"703":0,"704":0,"706":0,"707":0,"709":0,"710":0,"711":0,"713":0,"714":0,"716":0,"717":0,"720":0,"721":0,"723":0,"724":0,"727":0,"730":0,"741":0,"742":0,"744":0,"745":0,"754":0,"755":0,"762":0,"763":0,"772":0,"773":0,"780":0,"781":0,"788":0,"789":0,"796":0,"797":0,"804":0,"805":0,"812":0,"813":0,"822":0,"823":0,"832":0,"833":0,"841":0,"842":0,"851":0,"852":0,"859":0,"860":0,"870":0,"871":0,"873":0,"874":0,"885":0,"886":0,"888":0,"889":0,"900":0,"901":0,"903":0,"904":0,"915":0,"916":0,"918":0,"919":0,"927":0,"928":0};
_yuitest_coverage["build/format-numbers/format-numbers.js"].functions = {"Format:16":0,"toString:36":0,"Exception:33":0,"ParsingException:40":0,"IllegalArgumentsException:43":0,"FormatException:46":0,"format:57":0,"zeroPad:68":0,"parse:92":0,"_createParseObject:112":0,"Segment:120":0,"format:128":0,"parse:144":0,"getFormat:148":0,"_parseLiteral:152":0,"_parseInt:182":0,"TextSegment:215":0,"toString:222":0,"parse:226":0,"trim:231":0,"NumberFormat:260":0,"format:404":0,"parse:429":0,"__parseStatic:453":0,"_createParseObject:500":0,"NumberSegment:510":0,"format:519":0,"_normalize:545":0,"parse:598":0,"NumberFormat:699":0,"UnknownStyleException:741":0,"toString:744":0,"createInstance:754":0,"getAvailableLocales:762":0,"format:772":0,"getCurrency:780":0,"getMaximumFractionDigits:788":0,"getMaximumIntegerDigits:796":0,"getMinimumFractionDigits:804":0,"getMinimumIntegerDigits:812":0,"isGroupingUsed:822":0,"isParseIntegerOnly:832":0,"parse:841":0,"setCurrency:851":0,"setGroupingUsed:859":0,"setMaximumFractionDigits:870":0,"setMaximumIntegerDigits:885":0,"setMinimumFractionDigits:900":0,"setMinimumIntegerDigits:915":0,"setParseIntegerOnly:927":0,"(anonymous 1):1":0};
_yuitest_coverage["build/format-numbers/format-numbers.js"].coveredLines = 396;
_yuitest_coverage["build/format-numbers/format-numbers.js"].coveredFunctions = 51;
_yuitest_coverline("build/format-numbers/format-numbers.js", 1);
YUI.add('format-numbers', function (Y, NAME) {

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
_yuitest_coverfunc("build/format-numbers/format-numbers.js", "(anonymous 1)", 1);
_yuitest_coverline("build/format-numbers/format-numbers.js", 16);
Format = function(pattern, formats) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "Format", 16);
_yuitest_coverline("build/format-numbers/format-numbers.js", 17);
if (arguments.length == 0) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 18);
return;
    }
    _yuitest_coverline("build/format-numbers/format-numbers.js", 20);
this._pattern = pattern;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 21);
this._segments = []; 
    _yuitest_coverline("build/format-numbers/format-numbers.js", 22);
this.Formats = formats; 
}

// Data

_yuitest_coverline("build/format-numbers/format-numbers.js", 27);
Format.prototype._pattern = null;
_yuitest_coverline("build/format-numbers/format-numbers.js", 28);
Format.prototype._segments = null;

//Exceptions

_yuitest_coverline("build/format-numbers/format-numbers.js", 32);
Y.mix(Format, {
    Exception: function(name, message) {
        _yuitest_coverfunc("build/format-numbers/format-numbers.js", "Exception", 33);
_yuitest_coverline("build/format-numbers/format-numbers.js", 34);
this.name = name;
        _yuitest_coverline("build/format-numbers/format-numbers.js", 35);
this.message = message;
        _yuitest_coverline("build/format-numbers/format-numbers.js", 36);
this.toString = function() {
            _yuitest_coverfunc("build/format-numbers/format-numbers.js", "toString", 36);
_yuitest_coverline("build/format-numbers/format-numbers.js", 37);
return this.name + ": " + this.message;
        }
    },
    ParsingException: function(message) {
        _yuitest_coverfunc("build/format-numbers/format-numbers.js", "ParsingException", 40);
_yuitest_coverline("build/format-numbers/format-numbers.js", 41);
ParsingException.superclass.constructor.call(this, "ParsingException", message);
    },
    IllegalArgumentsException: function(message) {
        _yuitest_coverfunc("build/format-numbers/format-numbers.js", "IllegalArgumentsException", 43);
_yuitest_coverline("build/format-numbers/format-numbers.js", 44);
IllegalArgumentsException.superclass.constructor.call(this, "IllegalArgumentsException", message);
    },
    FormatException: function(message) {
        _yuitest_coverfunc("build/format-numbers/format-numbers.js", "FormatException", 46);
_yuitest_coverline("build/format-numbers/format-numbers.js", 47);
FormatException.superclass.constructor.call(this, "FormatException", message);
    }
});

_yuitest_coverline("build/format-numbers/format-numbers.js", 51);
Y.extend(Format.ParsingException, Format.Exception);
_yuitest_coverline("build/format-numbers/format-numbers.js", 52);
Y.extend(Format.IllegalArgumentsException, Format.Exception);
_yuitest_coverline("build/format-numbers/format-numbers.js", 53);
Y.extend(Format.FormatException, Format.Exception);

// Public methods

_yuitest_coverline("build/format-numbers/format-numbers.js", 57);
Format.prototype.format = function(object) { 
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "format", 57);
_yuitest_coverline("build/format-numbers/format-numbers.js", 58);
var s = [];
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 60);
for (var i = 0; i < this._segments.length; i++) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 61);
s.push(this._segments[i].format(object));
    }
    _yuitest_coverline("build/format-numbers/format-numbers.js", 63);
return s.join("");
};

// Protected static methods

_yuitest_coverline("build/format-numbers/format-numbers.js", 68);
function zeroPad (s, length, zeroChar, rightSide) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "zeroPad", 68);
_yuitest_coverline("build/format-numbers/format-numbers.js", 69);
s = typeof s == "string" ? s : String(s);

    _yuitest_coverline("build/format-numbers/format-numbers.js", 71);
if (s.length >= length) {return s;}

    _yuitest_coverline("build/format-numbers/format-numbers.js", 73);
zeroChar = zeroChar || '0';
	
    _yuitest_coverline("build/format-numbers/format-numbers.js", 75);
var a = [];
    _yuitest_coverline("build/format-numbers/format-numbers.js", 76);
for (var i = s.length; i < length; i++) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 77);
a.push(zeroChar);
    }
    _yuitest_coverline("build/format-numbers/format-numbers.js", 79);
a[rightSide ? "unshift" : "push"](s);

    _yuitest_coverline("build/format-numbers/format-numbers.js", 81);
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
_yuitest_coverline("build/format-numbers/format-numbers.js", 92);
Format.prototype.parse = function(s, pp) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "parse", 92);
_yuitest_coverline("build/format-numbers/format-numbers.js", 93);
var object = this._createParseObject();
    _yuitest_coverline("build/format-numbers/format-numbers.js", 94);
var index = pp || 0;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 95);
for (var i = 0; i < this._segments.length; i++) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 96);
var segment = this._segments[i];
        _yuitest_coverline("build/format-numbers/format-numbers.js", 97);
index = segment.parse(object, s, index);
    }
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 100);
if (index < s.length) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 101);
throw new Format.ParsingException("Input too long");
    }
    _yuitest_coverline("build/format-numbers/format-numbers.js", 103);
return object;
};
    
/**
 * Creates the object that is initialized by parsing
 * <p>
 * <strong>Note:</strong>
 * This must be implemented by sub-classes.
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 112);
Format.prototype._createParseObject = function(s) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "_createParseObject", 112);
_yuitest_coverline("build/format-numbers/format-numbers.js", 113);
throw new Format.ParsingException("Not implemented");
};

//
// Segment class
//

_yuitest_coverline("build/format-numbers/format-numbers.js", 120);
Format.Segment = function(format, s) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "Segment", 120);
_yuitest_coverline("build/format-numbers/format-numbers.js", 121);
if (arguments.length == 0) {return;}
    _yuitest_coverline("build/format-numbers/format-numbers.js", 122);
this._parent = format;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 123);
this._s = s;
};
    
// Public methods

_yuitest_coverline("build/format-numbers/format-numbers.js", 128);
Format.Segment.prototype.format = function(o) { 
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "format", 128);
_yuitest_coverline("build/format-numbers/format-numbers.js", 129);
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
_yuitest_coverline("build/format-numbers/format-numbers.js", 144);
Format.Segment.prototype.parse = function(o, s, index) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "parse", 144);
_yuitest_coverline("build/format-numbers/format-numbers.js", 145);
throw new Format.ParsingException("Not implemented");
};

_yuitest_coverline("build/format-numbers/format-numbers.js", 148);
Format.Segment.prototype.getFormat = function() {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "getFormat", 148);
_yuitest_coverline("build/format-numbers/format-numbers.js", 149);
return this._parent;
};

_yuitest_coverline("build/format-numbers/format-numbers.js", 152);
Format.Segment._parseLiteral = function(literal, s, index) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "_parseLiteral", 152);
_yuitest_coverline("build/format-numbers/format-numbers.js", 153);
if (s.length - index < literal.length) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 154);
throw new Format.ParsingException("Input too short");
    }
    _yuitest_coverline("build/format-numbers/format-numbers.js", 156);
for (var i = 0; i < literal.length; i++) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 157);
if (literal.charAt(i) != s.charAt(index + i)) {
            _yuitest_coverline("build/format-numbers/format-numbers.js", 158);
throw new Format.ParsingException("Input doesn't match");
        }
    }
    _yuitest_coverline("build/format-numbers/format-numbers.js", 161);
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
_yuitest_coverline("build/format-numbers/format-numbers.js", 182);
Format.Segment._parseInt = function(o, f, adjust, s, index, fixedlen, radix) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "_parseInt", 182);
_yuitest_coverline("build/format-numbers/format-numbers.js", 183);
var len = fixedlen || s.length - index;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 184);
var head = index;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 185);
for (var i = 0; i < len; i++) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 186);
if (!s.charAt(index++).match(/\d/)) {
            _yuitest_coverline("build/format-numbers/format-numbers.js", 187);
index--;
            _yuitest_coverline("build/format-numbers/format-numbers.js", 188);
break;
        }
    }
    _yuitest_coverline("build/format-numbers/format-numbers.js", 191);
var tail = index;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 192);
if (head == tail) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 193);
throw new Format.ParsingException("Number not present");
    }
    _yuitest_coverline("build/format-numbers/format-numbers.js", 195);
if (fixedlen && tail - head != fixedlen) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 196);
throw new Format.ParsingException("Number too short");
    }
    _yuitest_coverline("build/format-numbers/format-numbers.js", 198);
var value = parseInt(s.substring(head, tail), radix || 10);
    _yuitest_coverline("build/format-numbers/format-numbers.js", 199);
if (f) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 200);
var target = o || window;
        _yuitest_coverline("build/format-numbers/format-numbers.js", 201);
if (typeof f == "function") {
            _yuitest_coverline("build/format-numbers/format-numbers.js", 202);
f.call(target, value + adjust);
        }
        else {
            _yuitest_coverline("build/format-numbers/format-numbers.js", 205);
target[f] = value + adjust;
        }
    }
    _yuitest_coverline("build/format-numbers/format-numbers.js", 208);
return tail;
};

//
// Text segment class
//

_yuitest_coverline("build/format-numbers/format-numbers.js", 215);
Format.TextSegment = function(format, s) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "TextSegment", 215);
_yuitest_coverline("build/format-numbers/format-numbers.js", 216);
if (arguments.length == 0) {return;}
    _yuitest_coverline("build/format-numbers/format-numbers.js", 217);
Format.TextSegment.superclass.constructor.call(this, format, s);
};

_yuitest_coverline("build/format-numbers/format-numbers.js", 220);
Y.extend(Format.TextSegment, Format.Segment);

_yuitest_coverline("build/format-numbers/format-numbers.js", 222);
Format.TextSegment.prototype.toString = function() { 
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "toString", 222);
_yuitest_coverline("build/format-numbers/format-numbers.js", 223);
return "text: \""+this._s+'"'; 
};
    
_yuitest_coverline("build/format-numbers/format-numbers.js", 226);
Format.TextSegment.prototype.parse = function(o, s, index) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "parse", 226);
_yuitest_coverline("build/format-numbers/format-numbers.js", 227);
return Format.Segment._parseLiteral(this._s, s, index);
};

_yuitest_coverline("build/format-numbers/format-numbers.js", 230);
if(String.prototype.trim == null) {
    _yuitest_coverline("build/format-numbers/format-numbers.js", 231);
String.prototype.trim = function() {
        _yuitest_coverfunc("build/format-numbers/format-numbers.js", "trim", 231);
_yuitest_coverline("build/format-numbers/format-numbers.js", 232);
return this.replace(/^\s+/, '').replace(/\s+$/, '');
    };
}
/**
 * NumberFormat helps you to format and parse numbers for any locale.
 * Your code can be completely independent of the locale conventions for decimal points, thousands-separators,
 * or even the particular decimal digits used, or whether the number format is even decimal.
 * 
 * This module uses parts of zimbra NumberFormat
 * 
 * @module format-numbers
 * @requires format-base
 */

/**
 * @param pattern       The number pattern.
 * @param formats       locale data
 * @param skipNegFormat Specifies whether to skip the generation of this
 *                      format's negative value formatter.
 *                      <p>
 *                      <strong>Note:</strong> 
 *                      This parameter is only used by the implementation 
 *                      and should not be passed by application code 
 *                      instantiating a custom number format.
 */

_yuitest_coverline("build/format-numbers/format-numbers.js", 258);
var MODULE_NAME = "format-numbers";

_yuitest_coverline("build/format-numbers/format-numbers.js", 260);
NumberFormat = function(pattern, formats, skipNegFormat) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "NumberFormat", 260);
_yuitest_coverline("build/format-numbers/format-numbers.js", 261);
if (arguments.length == 0) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 262);
return;
    }

    _yuitest_coverline("build/format-numbers/format-numbers.js", 265);
Format.call(this, pattern, formats);
    _yuitest_coverline("build/format-numbers/format-numbers.js", 266);
if (!pattern) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 267);
return;
    }

    _yuitest_coverline("build/format-numbers/format-numbers.js", 270);
if(pattern == "{plural_style}") {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 271);
pattern = this.Formats.decimalFormat;
        _yuitest_coverline("build/format-numbers/format-numbers.js", 272);
this._isPluralCurrency = true;
	_yuitest_coverline("build/format-numbers/format-numbers.js", 273);
this._pattern = pattern;
    }

    //Default currency
    _yuitest_coverline("build/format-numbers/format-numbers.js", 277);
this.currency = this.Formats.defaultCurrency;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 278);
if(this.currency == null || this.currency == "") {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 279);
this.currency = "USD";
    }
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 282);
var patterns = pattern.split(/;/);
    _yuitest_coverline("build/format-numbers/format-numbers.js", 283);
pattern = patterns[0];
	
    _yuitest_coverline("build/format-numbers/format-numbers.js", 285);
this._useGrouping = (pattern.indexOf(",") != -1);      //Will be set to true if pattern uses grouping
    _yuitest_coverline("build/format-numbers/format-numbers.js", 286);
this._parseIntegerOnly = (pattern.indexOf(".") == -1);  //Will be set to false if pattern contains fractional parts
        
    //If grouping is used, find primary and secondary grouping
    _yuitest_coverline("build/format-numbers/format-numbers.js", 289);
if(this._useGrouping) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 290);
var numberPattern = pattern.match(/[0#,]+/);
        _yuitest_coverline("build/format-numbers/format-numbers.js", 291);
var groupingRegex = new RegExp("[0#]+", "g");
        _yuitest_coverline("build/format-numbers/format-numbers.js", 292);
var groups = numberPattern[0].match(groupingRegex);
            
        _yuitest_coverline("build/format-numbers/format-numbers.js", 294);
var i = groups.length - 2;
        _yuitest_coverline("build/format-numbers/format-numbers.js", 295);
this._primaryGrouping = groups[i+1].length;
        _yuitest_coverline("build/format-numbers/format-numbers.js", 296);
this._secondaryGrouping = (i > 0 ? groups[i].length : groups[i+1].length);
    }
        
    // parse prefix
    _yuitest_coverline("build/format-numbers/format-numbers.js", 300);
i = 0;
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 302);
var results = this.__parseStatic(pattern, i);
    _yuitest_coverline("build/format-numbers/format-numbers.js", 303);
i = results.offset;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 304);
var hasPrefix = results.text != "";
    _yuitest_coverline("build/format-numbers/format-numbers.js", 305);
if (hasPrefix) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 306);
this._segments.push(new Format.TextSegment(this, results.text));
    }
	
    // parse number descriptor
    _yuitest_coverline("build/format-numbers/format-numbers.js", 310);
var start = i;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 311);
while (i < pattern.length &&
        NumberFormat._META_CHARS.indexOf(pattern.charAt(i)) != -1) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 313);
i++;
    }
    _yuitest_coverline("build/format-numbers/format-numbers.js", 315);
var end = i;

    _yuitest_coverline("build/format-numbers/format-numbers.js", 317);
var numPattern = pattern.substring(start, end);
    _yuitest_coverline("build/format-numbers/format-numbers.js", 318);
var e = numPattern.indexOf(this.Formats.exponentialSymbol);
    _yuitest_coverline("build/format-numbers/format-numbers.js", 319);
var expon = e != -1 ? numPattern.substring(e + 1) : null;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 320);
if (expon) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 321);
numPattern = numPattern.substring(0, e);
        _yuitest_coverline("build/format-numbers/format-numbers.js", 322);
this._showExponent = true;
    }
	
    _yuitest_coverline("build/format-numbers/format-numbers.js", 325);
var dot = numPattern.indexOf('.');
    _yuitest_coverline("build/format-numbers/format-numbers.js", 326);
var whole = dot != -1 ? numPattern.substring(0, dot) : numPattern;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 327);
if (whole) {
        /*var comma = whole.lastIndexOf(',');
            if (comma != -1) {
                this._groupingOffset = whole.length - comma - 1;
            }*/
        _yuitest_coverline("build/format-numbers/format-numbers.js", 332);
whole = whole.replace(/[^#0]/g,"");
        _yuitest_coverline("build/format-numbers/format-numbers.js", 333);
var zero = whole.indexOf('0');
        _yuitest_coverline("build/format-numbers/format-numbers.js", 334);
if (zero != -1) {
            _yuitest_coverline("build/format-numbers/format-numbers.js", 335);
this._minIntDigits = whole.length - zero;
        }
        _yuitest_coverline("build/format-numbers/format-numbers.js", 337);
this._maxIntDigits = whole.length;
    }
	
    _yuitest_coverline("build/format-numbers/format-numbers.js", 340);
var fract = dot != -1 ? numPattern.substring(dot + 1) : null;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 341);
if (fract) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 342);
zero = fract.lastIndexOf('0');
        _yuitest_coverline("build/format-numbers/format-numbers.js", 343);
if (zero != -1) {
            _yuitest_coverline("build/format-numbers/format-numbers.js", 344);
this._minFracDigits = zero + 1;
        }
        _yuitest_coverline("build/format-numbers/format-numbers.js", 346);
this._maxFracDigits = fract.replace(/[^#0]/g,"").length;
    }
	
    _yuitest_coverline("build/format-numbers/format-numbers.js", 349);
this._segments.push(new NumberFormat.NumberSegment(this, numPattern));
	
    // parse suffix
    _yuitest_coverline("build/format-numbers/format-numbers.js", 352);
results = this.__parseStatic(pattern, i);
    _yuitest_coverline("build/format-numbers/format-numbers.js", 353);
i = results.offset;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 354);
if (results.text != "") {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 355);
this._segments.push(new Format.TextSegment(this, results.text));
    }
	
    // add negative formatter
    _yuitest_coverline("build/format-numbers/format-numbers.js", 359);
if (skipNegFormat) {return;}
	
    _yuitest_coverline("build/format-numbers/format-numbers.js", 361);
if (patterns.length > 1) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 362);
pattern = patterns[1];
        _yuitest_coverline("build/format-numbers/format-numbers.js", 363);
this._negativeFormatter = new NumberFormat(pattern, formats, true);
    }
    else {
        // no negative pattern; insert minus sign before number segment
        _yuitest_coverline("build/format-numbers/format-numbers.js", 367);
var formatter = new NumberFormat("", formats);
        _yuitest_coverline("build/format-numbers/format-numbers.js", 368);
formatter._segments = formatter._segments.concat(this._segments);

        _yuitest_coverline("build/format-numbers/format-numbers.js", 370);
var index = hasPrefix ? 1 : 0;
        _yuitest_coverline("build/format-numbers/format-numbers.js", 371);
var minus = new Format.TextSegment(formatter, this.Formats.minusSign);
        _yuitest_coverline("build/format-numbers/format-numbers.js", 372);
formatter._segments.splice(index, 0, minus);
		
        _yuitest_coverline("build/format-numbers/format-numbers.js", 374);
this._negativeFormatter = formatter;
    }
}
_yuitest_coverline("build/format-numbers/format-numbers.js", 377);
NumberFormat.prototype = new Format;
_yuitest_coverline("build/format-numbers/format-numbers.js", 378);
NumberFormat.prototype.constructor = NumberFormat;
    
// Constants

_yuitest_coverline("build/format-numbers/format-numbers.js", 382);
NumberFormat._NUMBER = "number";
_yuitest_coverline("build/format-numbers/format-numbers.js", 383);
NumberFormat._INTEGER = "integer";
_yuitest_coverline("build/format-numbers/format-numbers.js", 384);
NumberFormat._CURRENCY = "currency";
_yuitest_coverline("build/format-numbers/format-numbers.js", 385);
NumberFormat._PERCENT = "percent";

_yuitest_coverline("build/format-numbers/format-numbers.js", 387);
NumberFormat._META_CHARS = "0#.,E";

// Data

_yuitest_coverline("build/format-numbers/format-numbers.js", 391);
NumberFormat.prototype._groupingOffset = Number.MAX_VALUE;
//NumberFormat.prototype._maxIntDigits;
_yuitest_coverline("build/format-numbers/format-numbers.js", 393);
NumberFormat.prototype._minIntDigits = 1;
//NumberFormat.prototype._maxFracDigits;
//NumberFormat.prototype._minFracDigits;
_yuitest_coverline("build/format-numbers/format-numbers.js", 396);
NumberFormat.prototype._isCurrency = false;
_yuitest_coverline("build/format-numbers/format-numbers.js", 397);
NumberFormat.prototype._isPercent = false;
_yuitest_coverline("build/format-numbers/format-numbers.js", 398);
NumberFormat.prototype._isPerMille = false;
_yuitest_coverline("build/format-numbers/format-numbers.js", 399);
NumberFormat.prototype._showExponent = false;
//NumberFormat.prototype._negativeFormatter;

// Public methods

_yuitest_coverline("build/format-numbers/format-numbers.js", 404);
NumberFormat.prototype.format = function(number) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "format", 404);
_yuitest_coverline("build/format-numbers/format-numbers.js", 405);
if (number < 0 && this._negativeFormatter) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 406);
return this._negativeFormatter.format(number);
    }
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 409);
var result = Format.prototype.format.call(this, number);
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 411);
if(this._isPluralCurrency) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 412);
var pattern = "";
        _yuitest_coverline("build/format-numbers/format-numbers.js", 413);
if(number == 1) {
            //Singular
            _yuitest_coverline("build/format-numbers/format-numbers.js", 415);
pattern = this.Formats.currencyPatternSingular;
            _yuitest_coverline("build/format-numbers/format-numbers.js", 416);
pattern = pattern.replace("{1}", this.Formats[this.currency + "_currencySingular"]);
        } else {
            //Plural
            _yuitest_coverline("build/format-numbers/format-numbers.js", 419);
pattern = this.Formats.currencyPatternPlural;
            _yuitest_coverline("build/format-numbers/format-numbers.js", 420);
pattern = pattern.replace("{1}", this.Formats[this.currency + "_currencyPlural"]);
        }
            
        _yuitest_coverline("build/format-numbers/format-numbers.js", 423);
result = pattern.replace("{0}", result);
    }
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 426);
return result;
};
    
_yuitest_coverline("build/format-numbers/format-numbers.js", 429);
NumberFormat.prototype.parse = function(s, pp) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "parse", 429);
_yuitest_coverline("build/format-numbers/format-numbers.js", 430);
if(s.indexOf(this.Formats.minusSign) != -1 && this._negativeFormatter) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 431);
return this._negativeFormatter.parse(s, pp);
    }
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 434);
if(this._isPluralCurrency) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 435);
var singular = this.Formats[this.currency + "_currencySingular"];
        _yuitest_coverline("build/format-numbers/format-numbers.js", 436);
var plural = this.Formats[this.currency + "_currencyPlural"];
            
        _yuitest_coverline("build/format-numbers/format-numbers.js", 438);
s = s.replace(plural, "").replace(singular, "").trim();
    }
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 441);
var object = null;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 442);
try {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 443);
object = Format.prototype.parse.call(this, s, pp);
        _yuitest_coverline("build/format-numbers/format-numbers.js", 444);
object = object.value;
    } catch(e) {
    }
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 448);
return object;
}

// Private methods

_yuitest_coverline("build/format-numbers/format-numbers.js", 453);
NumberFormat.prototype.__parseStatic = function(s, i) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "__parseStatic", 453);
_yuitest_coverline("build/format-numbers/format-numbers.js", 454);
var data = [];
    _yuitest_coverline("build/format-numbers/format-numbers.js", 455);
while (i < s.length) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 456);
var c = s.charAt(i++);
        _yuitest_coverline("build/format-numbers/format-numbers.js", 457);
if (NumberFormat._META_CHARS.indexOf(c) != -1) {
            _yuitest_coverline("build/format-numbers/format-numbers.js", 458);
i--;
            _yuitest_coverline("build/format-numbers/format-numbers.js", 459);
break;
        }
        _yuitest_coverline("build/format-numbers/format-numbers.js", 461);
switch (c) {
            case "'": {
                _yuitest_coverline("build/format-numbers/format-numbers.js", 463);
var start = i;
                _yuitest_coverline("build/format-numbers/format-numbers.js", 464);
while (i < s.length && s.charAt(i++) != "'") {
                // do nothing
                }
                _yuitest_coverline("build/format-numbers/format-numbers.js", 467);
var end = i;
                _yuitest_coverline("build/format-numbers/format-numbers.js", 468);
c = end - start == 0 ? "'" : s.substring(start, end);
                _yuitest_coverline("build/format-numbers/format-numbers.js", 469);
break;
            }
            case '%': {
                _yuitest_coverline("build/format-numbers/format-numbers.js", 472);
c = this.Formats.percentSign; 
                _yuitest_coverline("build/format-numbers/format-numbers.js", 473);
this._isPercent = true;
                _yuitest_coverline("build/format-numbers/format-numbers.js", 474);
break;
            }
            case '\u2030': {
                _yuitest_coverline("build/format-numbers/format-numbers.js", 477);
c = this.Formats.perMilleSign; 
                _yuitest_coverline("build/format-numbers/format-numbers.js", 478);
this._isPerMille = true;
                _yuitest_coverline("build/format-numbers/format-numbers.js", 479);
break;
            }
            case '\u00a4': {
                _yuitest_coverline("build/format-numbers/format-numbers.js", 482);
if(s.charAt(i) == '\u00a4') {
                    _yuitest_coverline("build/format-numbers/format-numbers.js", 483);
c = this.Formats[this.currency + "_currencyISO"];
                    _yuitest_coverline("build/format-numbers/format-numbers.js", 484);
i++;
                } else {
                    _yuitest_coverline("build/format-numbers/format-numbers.js", 486);
c = this.Formats[this.currency + "_currencySymbol"];
                }
                _yuitest_coverline("build/format-numbers/format-numbers.js", 488);
this._isCurrency = true;
                _yuitest_coverline("build/format-numbers/format-numbers.js", 489);
break;
            }
        }
        _yuitest_coverline("build/format-numbers/format-numbers.js", 492);
data.push(c);
    }
    _yuitest_coverline("build/format-numbers/format-numbers.js", 494);
return {
        text: data.join(""), 
        offset: i
    };
};
    
_yuitest_coverline("build/format-numbers/format-numbers.js", 500);
NumberFormat.prototype._createParseObject = function() {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "_createParseObject", 500);
_yuitest_coverline("build/format-numbers/format-numbers.js", 501);
return {
        value: null
    };
};
    
//
// NumberFormat.NumberSegment class
//

_yuitest_coverline("build/format-numbers/format-numbers.js", 510);
NumberFormat.NumberSegment = function(format, s) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "NumberSegment", 510);
_yuitest_coverline("build/format-numbers/format-numbers.js", 511);
if (arguments.length == 0) {return;}
    _yuitest_coverline("build/format-numbers/format-numbers.js", 512);
Format.Segment.call(this, format, s);
};
_yuitest_coverline("build/format-numbers/format-numbers.js", 514);
NumberFormat.NumberSegment.prototype = new Format.Segment;
_yuitest_coverline("build/format-numbers/format-numbers.js", 515);
NumberFormat.NumberSegment.prototype.constructor = NumberFormat.NumberSegment;
    
// Public methods

_yuitest_coverline("build/format-numbers/format-numbers.js", 519);
NumberFormat.NumberSegment.prototype.format = function(number) {
    // special values
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "format", 519);
_yuitest_coverline("build/format-numbers/format-numbers.js", 521);
if (isNaN(number)) {return this._parent.Formats.nanSymbol;}
    _yuitest_coverline("build/format-numbers/format-numbers.js", 522);
if (number === Number.NEGATIVE_INFINITY || number === Number.POSITIVE_INFINITY) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 523);
return this._parent.Formats.infinitySign;
    }

    // adjust value
    _yuitest_coverline("build/format-numbers/format-numbers.js", 527);
if (typeof number != "number") {number = Number(number);}
    _yuitest_coverline("build/format-numbers/format-numbers.js", 528);
number = Math.abs(number); // NOTE: minus sign is part of pattern
    _yuitest_coverline("build/format-numbers/format-numbers.js", 529);
if (this._parent._isPercent) {number *= 100;}
    else {_yuitest_coverline("build/format-numbers/format-numbers.js", 530);
if (this._parent._isPerMille) {number *= 1000;}}
    _yuitest_coverline("build/format-numbers/format-numbers.js", 531);
if(this._parent._parseIntegerOnly) {number = Math.floor(number);}
        
    // format
    _yuitest_coverline("build/format-numbers/format-numbers.js", 534);
var expon = this._parent.Formats.exponentialSymbol;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 535);
var exponReg = new RegExp(expon + "+");
    _yuitest_coverline("build/format-numbers/format-numbers.js", 536);
var s = this._parent._showExponent
    ? number.toExponential(this._parent._maxFracDigits).toUpperCase().replace(exponReg,expon)
    : number.toFixed(this._parent._maxFracDigits || 0);
    _yuitest_coverline("build/format-numbers/format-numbers.js", 539);
s = this._normalize(s);
    _yuitest_coverline("build/format-numbers/format-numbers.js", 540);
return s;
};

// Protected methods

_yuitest_coverline("build/format-numbers/format-numbers.js", 545);
NumberFormat.NumberSegment.prototype._normalize = function(s) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "_normalize", 545);
_yuitest_coverline("build/format-numbers/format-numbers.js", 546);
var exponSymbol = this._parent.Formats.exponentialSymbol;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 547);
var splitReg = new RegExp("[\\." + exponSymbol + "]")
    _yuitest_coverline("build/format-numbers/format-numbers.js", 548);
var match = s.split(splitReg);
	
    // normalize whole part
    _yuitest_coverline("build/format-numbers/format-numbers.js", 551);
var whole = match.shift();
    _yuitest_coverline("build/format-numbers/format-numbers.js", 552);
if (whole.length < this._parent._minIntDigits) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 553);
whole = zeroPad(whole, this._parent._minIntDigits, this._parent.Formats.numberZero);
    }
    _yuitest_coverline("build/format-numbers/format-numbers.js", 555);
if (whole.length > this._parent._primaryGrouping && this._parent._useGrouping) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 556);
var a = [];
	    
        _yuitest_coverline("build/format-numbers/format-numbers.js", 558);
var offset = this._parent._primaryGrouping;
        _yuitest_coverline("build/format-numbers/format-numbers.js", 559);
var i = whole.length - offset;
        _yuitest_coverline("build/format-numbers/format-numbers.js", 560);
while (i > 0) {
            _yuitest_coverline("build/format-numbers/format-numbers.js", 561);
a.unshift(whole.substr(i, offset));
            _yuitest_coverline("build/format-numbers/format-numbers.js", 562);
a.unshift(this._parent.Formats.groupingSeparator);
            _yuitest_coverline("build/format-numbers/format-numbers.js", 563);
offset = this._parent._secondaryGrouping;
            _yuitest_coverline("build/format-numbers/format-numbers.js", 564);
i -= offset;
        }
        _yuitest_coverline("build/format-numbers/format-numbers.js", 566);
a.unshift(whole.substring(0, i + offset));
		
        _yuitest_coverline("build/format-numbers/format-numbers.js", 568);
whole = a.join("");
    }
	
    // normalize rest
    _yuitest_coverline("build/format-numbers/format-numbers.js", 572);
var fract = '0';
    _yuitest_coverline("build/format-numbers/format-numbers.js", 573);
var expon;
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 575);
if(s.match(/\./))
        {_yuitest_coverline("build/format-numbers/format-numbers.js", 576);
fract = match.shift();}
    else {_yuitest_coverline("build/format-numbers/format-numbers.js", 577);
if(s.match(/\e/) || s.match(/\E/))
        {_yuitest_coverline("build/format-numbers/format-numbers.js", 578);
expon = match.shift();}}

    _yuitest_coverline("build/format-numbers/format-numbers.js", 580);
fract = fract.replace(/0+$/,"");
    _yuitest_coverline("build/format-numbers/format-numbers.js", 581);
if (fract.length < this._parent._minFracDigits) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 582);
fract = zeroPad(fract, this._parent._minFracDigits, this._parent.Formats.numberZero, true);
    }
	
    _yuitest_coverline("build/format-numbers/format-numbers.js", 585);
a = [ whole ];
    _yuitest_coverline("build/format-numbers/format-numbers.js", 586);
if (fract.length > 0) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 587);
var decimal = this._parent.Formats.decimalSeparator;
        _yuitest_coverline("build/format-numbers/format-numbers.js", 588);
a.push(decimal, fract);
    }
    _yuitest_coverline("build/format-numbers/format-numbers.js", 590);
if (expon) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 591);
a.push(exponSymbol, expon.replace(/^\+/,""));
    }
	
    // return normalize result
    _yuitest_coverline("build/format-numbers/format-numbers.js", 595);
return a.join("");
}
    
_yuitest_coverline("build/format-numbers/format-numbers.js", 598);
NumberFormat.NumberSegment.prototype.parse = function(object, s, index) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "parse", 598);
_yuitest_coverline("build/format-numbers/format-numbers.js", 599);
var comma = this._parent.Formats.groupingSeparator;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 600);
var dot = this._parent.Formats.decimalSeparator;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 601);
var minusSign = this._parent.Formats.minusSign;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 602);
var expon = this._parent.Formats.exponentialSymbol;
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 604);
var numberRegexPattern = "[\\" + minusSign + "0-9" + comma + "]+";
    _yuitest_coverline("build/format-numbers/format-numbers.js", 605);
if(!this._parent._parseIntegerOnly) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 606);
numberRegexPattern += "(\\" + dot + "[0-9]+)?";
    }
    _yuitest_coverline("build/format-numbers/format-numbers.js", 608);
if(this._parent._showExponent) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 609);
numberRegexPattern += "(" + expon +"\\+?[0-9]+)";
    }
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 612);
var numberRegex = new RegExp(numberRegexPattern);
    _yuitest_coverline("build/format-numbers/format-numbers.js", 613);
var matches = s.match(numberRegex);
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 615);
if(!matches) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 616);
throw new Format.ParsingException("Number does not match pattern");
    }
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 619);
var negativeNum = s.indexOf(minusSign) != -1;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 620);
var endIndex = index + matches[0].length;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 621);
s = s.slice(index, endIndex);
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 623);
var scientific = null;
        
    //Scientific format does not use grouping
    _yuitest_coverline("build/format-numbers/format-numbers.js", 626);
if(this._parent.showExponent) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 627);
scientific = s.split(expon);
    } else {_yuitest_coverline("build/format-numbers/format-numbers.js", 628);
if(this._parent._useGrouping) {
        //Verify grouping data exists
        _yuitest_coverline("build/format-numbers/format-numbers.js", 630);
if(!this._parent._primaryGrouping) {
            //Should not happen
            _yuitest_coverline("build/format-numbers/format-numbers.js", 632);
throw new Format.ParsingException("Invalid pattern");
        }
            
        //Verify grouping is correct
        _yuitest_coverline("build/format-numbers/format-numbers.js", 636);
var i = s.length - this._parent._primaryGrouping - 1;
            
        _yuitest_coverline("build/format-numbers/format-numbers.js", 638);
if(matches[1]) {
            //If there is a decimal part, ignore that. Grouping assumed to apply only to whole number part
            _yuitest_coverline("build/format-numbers/format-numbers.js", 640);
i = i - matches[1].length;
        }
            
        //Use primary grouping for first group
        _yuitest_coverline("build/format-numbers/format-numbers.js", 644);
if(i > 0) {
            //There should be a comma at i
            _yuitest_coverline("build/format-numbers/format-numbers.js", 646);
if(s.charAt(i) != ',') {
                _yuitest_coverline("build/format-numbers/format-numbers.js", 647);
throw new Format.ParsingException("Number does not match pattern");
            }
                
            //Remove comma
            _yuitest_coverline("build/format-numbers/format-numbers.js", 651);
s = s.slice(0, i) + s.slice(i+1);
        }
            
        //If more groups, use primary/secondary grouping as applicable
        _yuitest_coverline("build/format-numbers/format-numbers.js", 655);
var grouping = this._parent._secondaryGrouping || this._parent._primaryGrouping;
        _yuitest_coverline("build/format-numbers/format-numbers.js", 656);
i = i - grouping - 1;
            
        _yuitest_coverline("build/format-numbers/format-numbers.js", 658);
while(i > 0) {
            //There should be a comma at i
            _yuitest_coverline("build/format-numbers/format-numbers.js", 660);
if(s.charAt(i) != ',') {
                _yuitest_coverline("build/format-numbers/format-numbers.js", 661);
throw new Format.ParsingException("Number does not match pattern");
            }
                
            //Remove comma
            _yuitest_coverline("build/format-numbers/format-numbers.js", 665);
s = s.slice(0, i) + s.slice(i+1);
            _yuitest_coverline("build/format-numbers/format-numbers.js", 666);
i = i - grouping - 1;
        }
            
        //Verify there are no more grouping separators
        _yuitest_coverline("build/format-numbers/format-numbers.js", 670);
if(s.indexOf(comma) != -1) {
            _yuitest_coverline("build/format-numbers/format-numbers.js", 671);
throw new Format.ParsingException("Number does not match pattern");
        }
    }}
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 675);
if(scientific) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 676);
object.value = parseFloat(scientific[0], 10) * Math.pow(10, parseFloat(scientific[1], 10));
    } else {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 678);
object.value = parseFloat(s, 10);
    }
        
    //Special types
    _yuitest_coverline("build/format-numbers/format-numbers.js", 682);
if(negativeNum) {object.value *= -1;}
    _yuitest_coverline("build/format-numbers/format-numbers.js", 683);
if (this._parent._isPercent) {object.value /= 100;}
    else {_yuitest_coverline("build/format-numbers/format-numbers.js", 684);
if (this._parent._isPerMille) {object.value /= 1000;}}
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 686);
return endIndex;
};
    
//
// YUI Code
//
    
/**
 * NumberFormat
 * @class Y.NumberFormat
 * @constructor
 * @param {Number} style (Optional) the given style. Defaults to Number style
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 699);
Y.NumberFormat = function(style) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "NumberFormat", 699);
_yuitest_coverline("build/format-numbers/format-numbers.js", 700);
style = style || Y.NumberFormat.STYLES.NUMBER_STYLE;
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 702);
var pattern = "";
    _yuitest_coverline("build/format-numbers/format-numbers.js", 703);
var formats = Y.Intl.get(MODULE_NAME);
    _yuitest_coverline("build/format-numbers/format-numbers.js", 704);
switch(style) {
        case Y.NumberFormat.STYLES.CURRENCY_STYLE:
            _yuitest_coverline("build/format-numbers/format-numbers.js", 706);
pattern = formats.currencyFormat;
            _yuitest_coverline("build/format-numbers/format-numbers.js", 707);
break;
        case Y.NumberFormat.STYLES.ISO_CURRENCY_STYLE:
            _yuitest_coverline("build/format-numbers/format-numbers.js", 709);
pattern = formats.currencyFormat;
            _yuitest_coverline("build/format-numbers/format-numbers.js", 710);
pattern = pattern.replace("\u00a4", "\u00a4\u00a4");
            _yuitest_coverline("build/format-numbers/format-numbers.js", 711);
break;
        case Y.NumberFormat.STYLES.NUMBER_STYLE:
            _yuitest_coverline("build/format-numbers/format-numbers.js", 713);
pattern = formats.decimalFormat;
            _yuitest_coverline("build/format-numbers/format-numbers.js", 714);
break;
        case Y.NumberFormat.STYLES.PERCENT_STYLE:
            _yuitest_coverline("build/format-numbers/format-numbers.js", 716);
pattern = formats.percentFormat;
            _yuitest_coverline("build/format-numbers/format-numbers.js", 717);
break;
        case Y.NumberFormat.STYLES.PLURAL_CURRENCY_STYLE:
            //This is like <value> <currency>. This may be dependent on whether the value is singular or plural. Will be handled during formatting
            _yuitest_coverline("build/format-numbers/format-numbers.js", 720);
pattern = "{plural_style}";
            _yuitest_coverline("build/format-numbers/format-numbers.js", 721);
break;
        case Y.NumberFormat.STYLES.SCIENTIFIC_STYLE:
            _yuitest_coverline("build/format-numbers/format-numbers.js", 723);
pattern = formats.scientificFormat;
            _yuitest_coverline("build/format-numbers/format-numbers.js", 724);
break;
    }
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 727);
this._numberFormatInstance = new NumberFormat(pattern, formats);
}
    
_yuitest_coverline("build/format-numbers/format-numbers.js", 730);
Y.NumberFormat.STYLES = {
    CURRENCY_STYLE: 1,
    ISO_CURRENCY_STYLE: 2,
    NUMBER_STYLE: 4,
    PERCENT_STYLE: 8,
    PLURAL_CURRENCY_STYLE: 16,
    SCIENTIFIC_STYLE: 32
}
    
//Exceptions
    
_yuitest_coverline("build/format-numbers/format-numbers.js", 741);
Y.NumberFormat.UnknownStyleException = function(message) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "UnknownStyleException", 741);
_yuitest_coverline("build/format-numbers/format-numbers.js", 742);
this.message = message;
}
_yuitest_coverline("build/format-numbers/format-numbers.js", 744);
Y.NumberFormat.UnknownStyleException.prototype.toString = function() {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "toString", 744);
_yuitest_coverline("build/format-numbers/format-numbers.js", 745);
return "UnknownStyleException: " + this.message;
}
    
//Static methods
    
/**
 * Create an instance of NumberFormat 
 * @param {Number} style (Optional) the given style
 */    
_yuitest_coverline("build/format-numbers/format-numbers.js", 754);
Y.NumberFormat.createInstance = function(style) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "createInstance", 754);
_yuitest_coverline("build/format-numbers/format-numbers.js", 755);
return new Y.NumberFormat(style);
}

/**
 * Returns an array of BCP 47 language tags for the languages supported by this class
 * @return {Array} an array of BCP 47 language tags for the languages supported by this class.
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 762);
Y.NumberFormat.getAvailableLocales = function() {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "getAvailableLocales", 762);
_yuitest_coverline("build/format-numbers/format-numbers.js", 763);
return Y.Intl.getAvailableLangs(MODULE_NAME);
}
    
//Public methods
    
/**
 * Format a number to product a String.
 * @param {Number} number the number to format
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 772);
Y.NumberFormat.prototype.format = function(number) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "format", 772);
_yuitest_coverline("build/format-numbers/format-numbers.js", 773);
return this._numberFormatInstance.format(number);
}
    
/**
 * Gets the currency used to display currency amounts. This may be an empty string for some cases. 
 * @return {String} a 3-letter ISO code indicating the currency in use, or an empty string.
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 780);
Y.NumberFormat.prototype.getCurrency = function() {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "getCurrency", 780);
_yuitest_coverline("build/format-numbers/format-numbers.js", 781);
return this._numberFormatInstance.currency;
}
    
/**
 * Returns the maximum number of digits allowed in the fraction portion of a number. 
 * @return {Number} the maximum number of digits allowed in the fraction portion of a number.
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 788);
Y.NumberFormat.prototype.getMaximumFractionDigits = function() {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "getMaximumFractionDigits", 788);
_yuitest_coverline("build/format-numbers/format-numbers.js", 789);
return this._numberFormatInstance._maxFracDigits || 0;
}
    
/**
 * Returns the maximum number of digits allowed in the integer portion of a number. 
 * @return {Number} the maximum number of digits allowed in the integer portion of a number.
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 796);
Y.NumberFormat.prototype.getMaximumIntegerDigits = function() {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "getMaximumIntegerDigits", 796);
_yuitest_coverline("build/format-numbers/format-numbers.js", 797);
return this._numberFormatInstance._maxIntDigits || 0;
}
    
/**
 * Returns the minimum number of digits allowed in the fraction portion of a number. 
 * @return {Number} the minimum number of digits allowed in the fraction portion of a number.
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 804);
Y.NumberFormat.prototype.getMinimumFractionDigits = function() {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "getMinimumFractionDigits", 804);
_yuitest_coverline("build/format-numbers/format-numbers.js", 805);
return this._numberFormatInstance._minFracDigits || 0;
}
    
/**
 * Returns the minimum number of digits allowed in the integer portion of a number.
 * @return {Number} the minimum number of digits allowed in the integer portion of a number.
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 812);
Y.NumberFormat.prototype.getMinimumIntegerDigits = function() {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "getMinimumIntegerDigits", 812);
_yuitest_coverline("build/format-numbers/format-numbers.js", 813);
return this._numberFormatInstance._minIntDigits || 0;
}
    
/**
 * Returns true if grouping is used in this format.
 * For example, in the English locale, with grouping on, the number 1234567 might be formatted as "1,234,567".
 * The grouping separator as well as the size of each group is locale dependant.
 * @return {Boolean}
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 822);
Y.NumberFormat.prototype.isGroupingUsed = function() {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "isGroupingUsed", 822);
_yuitest_coverline("build/format-numbers/format-numbers.js", 823);
return this._numberFormatInstance._useGrouping;
}
    
/**
 * Return true if this format will parse numbers as integers only.
 * For example in the English locale, with ParseIntegerOnly true, the string "1234." would be parsed as the integer value 1234
 * and parsing would stop at the "." character. Of course, the exact format accepted by the parse operation is locale dependant.
 * @return {Boolean}
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 832);
Y.NumberFormat.prototype.isParseIntegerOnly = function() {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "isParseIntegerOnly", 832);
_yuitest_coverline("build/format-numbers/format-numbers.js", 833);
return this._numberFormatInstance._parseIntegerOnly;
}
    
/**
 * Parse the string to get a number
 * @param {String} txt The string to parse
 * @param {Number} pp (Optional) Parse position. The position to start parsing at. Defaults to 0
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 841);
Y.NumberFormat.prototype.parse = function(txt, pp) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "parse", 841);
_yuitest_coverline("build/format-numbers/format-numbers.js", 842);
return this._numberFormatInstance.parse(txt, pp);
}
    
/**
 * Sets the currency used to display currency amounts.
 * This takes effect immediately, if this format is a currency format.
 * If this format is not a currency format, then the currency is used if and when this object becomes a currency format.
 * @param {String} currency a 3-letter ISO code indicating new currency to use. May be the empty string to indicate no currency.
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 851);
Y.NumberFormat.prototype.setCurrency = function(currency) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "setCurrency", 851);
_yuitest_coverline("build/format-numbers/format-numbers.js", 852);
this._numberFormatInstance.currency = currency;
}
    
/**
 * Set whether or not grouping will be used in this format. 
 * @param {Boolean} value
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 859);
Y.NumberFormat.prototype.setGroupingUsed = function(value) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "setGroupingUsed", 859);
_yuitest_coverline("build/format-numbers/format-numbers.js", 860);
this._numberFormatInstance._useGrouping = value;
}
    
/**
 * Sets the maximum number of digits allowed in the fraction portion of a number.
 * maximumFractionDigits must be >= minimumFractionDigits.
 * If the new value for maximumFractionDigits is less than the current value of minimumFractionDigits,
 * then minimumFractionDigits will also be set to the new value. 
 * @param {Number} newValue the new value to be set.
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 870);
Y.NumberFormat.prototype.setMaximumFractionDigits = function(newValue) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "setMaximumFractionDigits", 870);
_yuitest_coverline("build/format-numbers/format-numbers.js", 871);
this._numberFormatInstance._maxFracDigits = newValue;
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 873);
if(this.getMinimumFractionDigits() > newValue) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 874);
this.setMinimumFractionDigits(newValue);
    }
}
    
/**
 * Sets the maximum number of digits allowed in the integer portion of a number.
 * maximumIntegerDigits must be >= minimumIntegerDigits.
 * If the new value for maximumIntegerDigits is less than the current value of minimumIntegerDigits,
 * then minimumIntegerDigits will also be set to the new value.
 * @param {Number} newValue the new value to be set.
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 885);
Y.NumberFormat.prototype.setMaximumIntegerDigits = function(newValue) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "setMaximumIntegerDigits", 885);
_yuitest_coverline("build/format-numbers/format-numbers.js", 886);
this._numberFormatInstance._maxIntDigits = newValue;
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 888);
if(this.getMinimumIntegerDigits() > newValue) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 889);
this.setMinimumIntegerDigits(newValue);
    }
}
    
/**
 * Sets the minimum number of digits allowed in the fraction portion of a number.
 * minimumFractionDigits must be <= maximumFractionDigits.
 * If the new value for minimumFractionDigits exceeds the current value of maximumFractionDigits,
 * then maximumIntegerDigits will also be set to the new value
 * @param {Number} newValue the new value to be set.
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 900);
Y.NumberFormat.prototype.setMinimumFractionDigits = function(newValue) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "setMinimumFractionDigits", 900);
_yuitest_coverline("build/format-numbers/format-numbers.js", 901);
this._numberFormatInstance._minFracDigits = newValue;
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 903);
if(this.getMaximumFractionDigits() < newValue) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 904);
this.setMaximumFractionDigits(newValue);
    }
}
    
/**
 * Sets the minimum number of digits allowed in the integer portion of a number.
 * minimumIntegerDigits must be <= maximumIntegerDigits.
 * If the new value for minimumIntegerDigits exceeds the current value of maximumIntegerDigits,
 * then maximumIntegerDigits will also be set to the new value. 
 * @param {Number} newValue the new value to be set.
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 915);
Y.NumberFormat.prototype.setMinimumIntegerDigits = function(newValue) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "setMinimumIntegerDigits", 915);
_yuitest_coverline("build/format-numbers/format-numbers.js", 916);
this._numberFormatInstance._minIntDigits = newValue;
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 918);
if(this.getMaximumIntegerDigits() < newValue) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 919);
this.setMaximumIntegerDigits(newValue);
    }
}
    
/**
 * Sets whether or not numbers should be parsed as integers only. 
 * @param {Boolean} newValue set True, this format will parse numbers as integers only.
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 927);
Y.NumberFormat.prototype.setParseIntegerOnly = function(newValue) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "setParseIntegerOnly", 927);
_yuitest_coverline("build/format-numbers/format-numbers.js", 928);
this._numberFormatInstance._parseIntegerOnly = newValue;
}


}, '@VERSION@', {
    "lang": [
        "af-NA",
        "af",
        "af-ZA",
        "am-ET",
        "am",
        "ar-AE",
        "ar-BH",
        "ar-DZ",
        "ar-EG",
        "ar-IQ",
        "ar-JO",
        "ar-KW",
        "ar-LB",
        "ar-LY",
        "ar-MA",
        "ar-OM",
        "ar-QA",
        "ar-SA",
        "ar-SD",
        "ar-SY",
        "ar-TN",
        "ar",
        "ar-YE",
        "as-IN",
        "as",
        "az-AZ",
        "az-Cyrl-AZ",
        "az-Cyrl",
        "az-Latn-AZ",
        "az-Latn",
        "az",
        "be-BY",
        "be",
        "bg-BG",
        "bg",
        "bn-BD",
        "bn-IN",
        "bn",
        "bo-CN",
        "bo-IN",
        "bo",
        "ca-ES",
        "ca",
        "cs-CZ",
        "cs",
        "cy-GB",
        "cy",
        "da-DK",
        "da",
        "de-AT",
        "de-BE",
        "de-CH",
        "de-DE",
        "de-LI",
        "de-LU",
        "de",
        "el-CY",
        "el-GR",
        "el",
        "en-AU",
        "en-BE",
        "en-BW",
        "en-BZ",
        "en-CA",
        "en-GB",
        "en-HK",
        "en-IE",
        "en-IN",
        "en-JM",
        "en-JO",
        "en-MH",
        "en-MT",
        "en-MY",
        "en-NA",
        "en-NZ",
        "en-PH",
        "en-PK",
        "en-RH",
        "en-SG",
        "en-TT",
        "en",
        "en-US-POSIX",
        "en-US",
        "en-VI",
        "en-ZA",
        "en-ZW",
        "eo",
        "es-AR",
        "es-BO",
        "es-CL",
        "es-CO",
        "es-CR",
        "es-DO",
        "es-EC",
        "es-ES",
        "es-GT",
        "es-HN",
        "es-MX",
        "es-NI",
        "es-PA",
        "es-PE",
        "es-PR",
        "es-PY",
        "es-SV",
        "es",
        "es-US",
        "es-UY",
        "es-VE",
        "et-EE",
        "et",
        "eu-ES",
        "eu",
        "fa-AF",
        "fa-IR",
        "fa",
        "fi-FI",
        "fi",
        "fil-PH",
        "fil",
        "fo-FO",
        "fo",
        "fr-BE",
        "fr-CA",
        "fr-CH",
        "fr-FR",
        "fr-LU",
        "fr-MC",
        "fr-SN",
        "fr",
        "ga-IE",
        "ga",
        "gl-ES",
        "gl",
        "gsw-CH",
        "gsw",
        "gu-IN",
        "gu",
        "gv-GB",
        "gv",
        "ha-GH",
        "ha-Latn-GH",
        "ha-Latn-NE",
        "ha-Latn-NG",
        "ha-Latn",
        "ha-NE",
        "ha-NG",
        "ha",
        "haw",
        "haw-US",
        "he-IL",
        "he",
        "hi-IN",
        "hi",
        "hr-HR",
        "hr",
        "hu-HU",
        "hu",
        "hy-AM-REVISED",
        "hy-AM",
        "hy",
        "id-ID",
        "id",
        "ii-CN",
        "ii",
        "in-ID",
        "in",
        "is-IS",
        "is",
        "it-CH",
        "it-IT",
        "it",
        "iw-IL",
        "iw",
        "ja-JP-TRADITIONAL",
        "ja-JP",
        "ja",
        "ka-GE",
        "ka",
        "kk-Cyrl-KZ",
        "kk-Cyrl",
        "kk-KZ",
        "kk",
        "kl-GL",
        "kl",
        "km-KH",
        "km",
        "kn-IN",
        "kn",
        "kok-IN",
        "kok",
        "ko-KR",
        "ko",
        "kw-GB",
        "kw",
        "lt-LT",
        "lt",
        "lv-LV",
        "lv",
        "mk-MK",
        "mk",
        "ml-IN",
        "ml",
        "mr-IN",
        "mr",
        "ms-BN",
        "ms-MY",
        "ms",
        "mt-MT",
        "mt",
        "nb-NO",
        "nb",
        "ne-IN",
        "ne-NP",
        "ne",
        "nl-BE",
        "nl-NL",
        "nl",
        "nn-NO",
        "nn",
        "no-NO-NY",
        "no-NO",
        "no",
        "om-ET",
        "om-KE",
        "om",
        "or-IN",
        "or",
        "pa-Arab-PK",
        "pa-Arab",
        "pa-Guru-IN",
        "pa-Guru",
        "pa-IN",
        "pa-PK",
        "pa",
        "pl-PL",
        "pl",
        "ps-AF",
        "ps",
        "pt-BR",
        "pt-PT",
        "pt",
        "ro-MD",
        "ro-RO",
        "ro",
        "ru-RU",
        "ru",
        "ru-UA",
        "sh-BA",
        "sh-CS",
        "sh",
        "sh-YU",
        "si-LK",
        "si",
        "sk-SK",
        "sk",
        "sl-SI",
        "sl",
        "so-DJ",
        "so-ET",
        "so-KE",
        "so-SO",
        "so",
        "sq-AL",
        "sq",
        "sr-BA",
        "sr-CS",
        "sr-Cyrl-BA",
        "sr-Cyrl-CS",
        "sr-Cyrl-ME",
        "sr-Cyrl-RS",
        "sr-Cyrl",
        "sr-Cyrl-YU",
        "sr-Latn-BA",
        "sr-Latn-CS",
        "sr-Latn-ME",
        "sr-Latn-RS",
        "sr-Latn",
        "sr-Latn-YU",
        "sr-ME",
        "sr-RS",
        "sr",
        "sr-YU",
        "sv-FI",
        "sv-SE",
        "sv",
        "sw-KE",
        "sw",
        "sw-TZ",
        "ta-IN",
        "ta",
        "te-IN",
        "te",
        "th-TH-TRADITIONAL",
        "th-TH",
        "th",
        "ti-ER",
        "ti-ET",
        "ti",
        "tl-PH",
        "tl",
        "tr-TR",
        "tr",
        "uk",
        "uk-UA",
        "ur-IN",
        "ur-PK",
        "ur",
        "uz-AF",
        "uz-Arab-AF",
        "uz-Arab",
        "uz-Cyrl",
        "uz-Cyrl-UZ",
        "uz-Latn",
        "uz-Latn-UZ",
        "uz",
        "uz-UZ",
        "vi",
        "vi-VN",
        "zh-CN",
        "zh-Hans-CN",
        "zh-Hans-HK",
        "zh-Hans-MO",
        "zh-Hans-SG",
        "zh-Hans",
        "zh-Hant-HK",
        "zh-Hant-MO",
        "zh-Hant-TW",
        "zh-Hant",
        "zh-HK",
        "zh-MO",
        "zh-SG",
        "zh-TW",
        "zh",
        "zu",
        "zu-ZA"
    ]
});
