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
_yuitest_coverage["build/format-numbers/format-numbers.js"].code=["YUI.add('format-numbers', function (Y, NAME) {","","/*"," * Copyright 2012 Yahoo! Inc. All Rights Reserved. Based on code owned by VMWare, Inc. "," */","","//","// Format class","//","","/**"," * Base class for all formats. To format an object, instantiate the"," * format of your choice and call the <code>format</code> method which"," * returns the formatted string."," */","Format = function(pattern, formats) {","    if (arguments.length == 0) {","        return;","    }","    this._pattern = pattern;","    this._segments = []; ","    this.Formats = formats; ","}","","// Data","","Format.prototype._pattern = null;","Format.prototype._segments = null;","","//Exceptions","    ","Format.ParsingException = function(message) {","    this.message = message;","}","Format.ParsingException.prototype.toString = function() {","    return \"ParsingException: \" + this.message;","}","","Format.IllegalArgumentsException = function(message) {","    this.message = message;","}","Format.IllegalArgumentsException.prototype.toString = function() {","    return \"IllegalArgumentsException: \" + this.message;","}","    ","Format.FormatException = function(message) {","    this.message = message;","}","Format.FormatException.prototype.toString = function() {","    return \"FormatException: \" + this.message;","}    ","","// Public methods","","Format.prototype.format = function(object) { ","    var s = [];","        ","    for (var i = 0; i < this._segments.length; i++) {","        s.push(this._segments[i].format(object));","    }","    return s.join(\"\");","};","","// Protected static methods","","function zeroPad (s, length, zeroChar, rightSide) {","    s = typeof s == \"string\" ? s : String(s);","","    if (s.length >= length) return s;","","    zeroChar = zeroChar || '0';","	","    var a = [];","    for (var i = s.length; i < length; i++) {","        a.push(zeroChar);","    }","    a[rightSide ? \"unshift\" : \"push\"](s);","","    return a.join(\"\");","}","    ","/** "," * Parses the given string according to this format's pattern and returns"," * an object."," * <p>"," * <strong>Note:</strong>"," * The default implementation of this method assumes that the sub-class"," * has implemented the <code>_createParseObject</code> method."," */","Format.prototype.parse = function(s, pp) {","    var object = this._createParseObject();","    var index = pp || 0;","    for (var i = 0; i < this._segments.length; i++) {","        var segment = this._segments[i];","        index = segment.parse(object, s, index);","    }","        ","    if (index < s.length) {","        throw new Format.ParsingException(\"Input too long\");","    }","    return object;","};","    ","/**","     * Creates the object that is initialized by parsing","     * <p>","     * <strong>Note:</strong>","     * This must be implemented by sub-classes.","     */","Format.prototype._createParseObject = function(s) {","    throw new Format.ParsingException(\"Not implemented\");","};","","//","// Segment class","//","","Format.Segment = function(format, s) {","    if (arguments.length == 0) return;","    this._parent = format;","    this._s = s;","};","    ","// Data","","Format.Segment.prototype._parent = null;","Format.Segment.prototype._s = null;","","// Public methods","","Format.Segment.prototype.format = function(o) { ","    return this._s; ","};","","/**"," * Parses the string at the given index, initializes the parse object"," * (as appropriate), and returns the new index within the string for"," * the next parsing step."," * <p>"," * <strong>Note:</strong>"," * This method must be implemented by sub-classes."," *"," * @param o     [object] The parse object to be initialized."," * @param s     [string] The input string to be parsed."," * @param index [number] The index within the string to start parsing."," */","Format.Segment.prototype.parse = function(o, s, index) {","    throw new Format.ParsingException(\"Not implemented\");","};","","Format.Segment.prototype.getFormat = function() {","    return this._parent;","};","","Format.Segment._parseLiteral = function(literal, s, index) {","    if (s.length - index < literal.length) {","        throw new Format.ParsingException(\"Input too short\");","    }","    for (var i = 0; i < literal.length; i++) {","        if (literal.charAt(i) != s.charAt(index + i)) {","            throw new Format.ParsingException(\"Input doesn't match\");","        }","    }","    return index + literal.length;","};","    ","/**"," * Parses an integer at the offset of the given string and calls a"," * method on the specified object."," *"," * @param o         [object]   The target object."," * @param f         [function|string] The method to call on the target object."," *                             If this parameter is a string, then it is used"," *                             as the name of the property to set on the"," *                             target object."," * @param adjust    [number]   The numeric adjustment to make on the"," *                             value before calling the object method."," * @param s         [string]   The string to parse."," * @param index     [number]   The index within the string to start parsing."," * @param fixedlen  [number]   If specified, specifies the required number"," *                             of digits to be parsed."," * @param radix     [number]   Optional. Specifies the radix of the parse"," *                             string. Defaults to 10 if not specified."," */","Format.Segment._parseInt = function(o, f, adjust, s, index, fixedlen, radix) {","    var len = fixedlen || s.length - index;","    var head = index;","    for (var i = 0; i < len; i++) {","        if (!s.charAt(index++).match(/\\d/)) {","            index--;","            break;","        }","    }","    var tail = index;","    if (head == tail) {","        throw new Format.ParsingException(\"Number not present\");","    }","    if (fixedlen && tail - head != fixedlen) {","        throw new Format.ParsingException(\"Number too short\");","    }","    var value = parseInt(s.substring(head, tail), radix || 10);","    if (f) {","        var target = o || window;","        if (typeof f == \"function\") {","            f.call(target, value + adjust);","        }","        else {","            target[f] = value + adjust;","        }","    }","    return tail;","};","","//","// Text segment class","//","","Format.TextSegment = function(format, s) {","    if (arguments.length == 0) return;","    Format.Segment.call(this, format, s);","};","Format.TextSegment.prototype = new Format.Segment;","Format.TextSegment.prototype.constructor = Format.TextSegment;","","Format.TextSegment.prototype.toString = function() { ","    return \"text: \\\"\"+this._s+'\"'; ","};","    ","Format.TextSegment.prototype.parse = function(o, s, index) {","    return Format.Segment._parseLiteral(this._s, s, index);","};","","if(String.prototype.trim == null) {","    String.prototype.trim = function() {","        return this.replace(/^\\s+/, '').replace(/\\s+$/, '');","    };","}","/**"," * NumberFormat helps you to format and parse numbers for any locale."," * Your code can be completely independent of the locale conventions for decimal points, thousands-separators,"," * or even the particular decimal digits used, or whether the number format is even decimal."," * "," * This module uses parts of zimbra NumberFormat"," * "," * @module format-numbers"," * @requires format-base"," */","","/**"," * @param pattern       The number pattern."," * @param formats       locale data"," * @param skipNegFormat Specifies whether to skip the generation of this"," *                      format's negative value formatter."," *                      <p>"," *                      <strong>Note:</strong> "," *                      This parameter is only used by the implementation "," *                      and should not be passed by application code "," *                      instantiating a custom number format."," */","","var MODULE_NAME = \"format-numbers\";","","NumberFormat = function(pattern, formats, skipNegFormat) {","    if (arguments.length == 0) {","        return;","    }","","    Format.call(this, pattern, formats);","    if (!pattern) {","        return;","    }","","    if(pattern == \"{plural_style}\") {","        pattern = this.Formats.decimalFormat;","        this._isPluralCurrency = true;","	this._pattern = pattern;","    }","","    //Default currency","    this.currency = this.Formats.defaultCurrency;","    if(this.currency == null || this.currency == \"\") {","        this.currency = \"USD\";","    }","        ","    var patterns = pattern.split(/;/);","    pattern = patterns[0];","	","    this._useGrouping = (pattern.indexOf(\",\") != -1);      //Will be set to true if pattern uses grouping","    this._parseIntegerOnly = (pattern.indexOf(\".\") == -1);  //Will be set to false if pattern contains fractional parts","        ","    //If grouping is used, find primary and secondary grouping","    if(this._useGrouping) {","        var numberPattern = pattern.match(/[0#,]+/);","        var groupingRegex = new RegExp(\"[0#]+\", \"g\");","        var groups = numberPattern[0].match(groupingRegex);","            ","        var i = groups.length - 2;","        this._primaryGrouping = groups[i+1].length;","        this._secondaryGrouping = (i > 0 ? groups[i].length : groups[i+1].length);","    }","        ","    // parse prefix","    i = 0;","        ","    var results = this.__parseStatic(pattern, i);","    i = results.offset;","    var hasPrefix = results.text != \"\";","    if (hasPrefix) {","        this._segments.push(new Format.TextSegment(this, results.text));","    }","	","    // parse number descriptor","    var start = i;","    while (i < pattern.length &&","        NumberFormat._META_CHARS.indexOf(pattern.charAt(i)) != -1) {","        i++;","    }","    var end = i;","","    var numPattern = pattern.substring(start, end);","    var e = numPattern.indexOf(this.Formats.exponentialSymbol);","    var expon = e != -1 ? numPattern.substring(e + 1) : null;","    if (expon) {","        numPattern = numPattern.substring(0, e);","        this._showExponent = true;","    }","	","    var dot = numPattern.indexOf('.');","    var whole = dot != -1 ? numPattern.substring(0, dot) : numPattern;","    if (whole) {","        /*var comma = whole.lastIndexOf(',');","            if (comma != -1) {","                this._groupingOffset = whole.length - comma - 1;","            }*/","        whole = whole.replace(/[^#0]/g,\"\");","        var zero = whole.indexOf('0');","        if (zero != -1) {","            this._minIntDigits = whole.length - zero;","        }","        this._maxIntDigits = whole.length;","    }","	","    var fract = dot != -1 ? numPattern.substring(dot + 1) : null;","    if (fract) {","        zero = fract.lastIndexOf('0');","        if (zero != -1) {","            this._minFracDigits = zero + 1;","        }","        this._maxFracDigits = fract.replace(/[^#0]/g,\"\").length;","    }","	","    this._segments.push(new NumberFormat.NumberSegment(this, numPattern));","	","    // parse suffix","    results = this.__parseStatic(pattern, i);","    i = results.offset;","    if (results.text != \"\") {","        this._segments.push(new Format.TextSegment(this, results.text));","    }","	","    // add negative formatter","    if (skipNegFormat) return;","	","    if (patterns.length > 1) {","        pattern = patterns[1];","        this._negativeFormatter = new NumberFormat(pattern, formats, true);","    }","    else {","        // no negative pattern; insert minus sign before number segment","        var formatter = new NumberFormat(\"\", formats);","        formatter._segments = formatter._segments.concat(this._segments);","","        var index = hasPrefix ? 1 : 0;","        var minus = new Format.TextSegment(formatter, this.Formats.minusSign);","        formatter._segments.splice(index, 0, minus);","		","        this._negativeFormatter = formatter;","    }","}","NumberFormat.prototype = new Format;","NumberFormat.prototype.constructor = NumberFormat;","    ","// Constants","","NumberFormat._NUMBER = \"number\";","NumberFormat._INTEGER = \"integer\";","NumberFormat._CURRENCY = \"currency\";","NumberFormat._PERCENT = \"percent\";","","NumberFormat._META_CHARS = \"0#.,E\";","","// Data","","NumberFormat.prototype._groupingOffset = Number.MAX_VALUE;","//NumberFormat.prototype._maxIntDigits;","NumberFormat.prototype._minIntDigits = 1;","//NumberFormat.prototype._maxFracDigits;","//NumberFormat.prototype._minFracDigits;","NumberFormat.prototype._isCurrency = false;","NumberFormat.prototype._isPercent = false;","NumberFormat.prototype._isPerMille = false;","NumberFormat.prototype._showExponent = false;","//NumberFormat.prototype._negativeFormatter;","","// Public methods","","NumberFormat.prototype.format = function(number) {","    if (number < 0 && this._negativeFormatter) {","        return this._negativeFormatter.format(number);","    }","        ","    var result = Format.prototype.format.call(this, number);","        ","    if(this._isPluralCurrency) {","        var pattern = \"\";","        if(number == 1) {","            //Singular","            pattern = this.Formats.currencyPatternSingular;","            pattern = pattern.replace(\"{1}\", this.Formats[this.currency + \"_currencySingular\"]);","        } else {","            //Plural","            pattern = this.Formats.currencyPatternPlural;","            pattern = pattern.replace(\"{1}\", this.Formats[this.currency + \"_currencyPlural\"]);","        }","            ","        result = pattern.replace(\"{0}\", result);","    }","        ","    return result;","};","    ","NumberFormat.prototype.parse = function(s, pp) {","    if(s.indexOf(this.Formats.minusSign) != -1 && this._negativeFormatter) {","        return this._negativeFormatter.parse(s, pp);","    }","        ","    if(this._isPluralCurrency) {","        var singular = this.Formats[this.currency + \"_currencySingular\"];","        var plural = this.Formats[this.currency + \"_currencyPlural\"];","            ","        s = s.replace(plural, \"\").replace(singular, \"\").trim();","    }","        ","    var object = null;","    try {","        object = Format.prototype.parse.call(this, s, pp);","        object = object.value;","    } catch(e) {","    }","        ","    return object;","}","","// Private methods","","NumberFormat.prototype.__parseStatic = function(s, i) {","    var data = [];","    while (i < s.length) {","        var c = s.charAt(i++);","        if (NumberFormat._META_CHARS.indexOf(c) != -1) {","            i--;","            break;","        }","        switch (c) {","            case \"'\": {","                var start = i;","                while (i < s.length && s.charAt(i++) != \"'\") {","                // do nothing","                }","                var end = i;","                c = end - start == 0 ? \"'\" : s.substring(start, end);","                break;","            }","            case '%': {","                c = this.Formats.percentSign; ","                this._isPercent = true;","                break;","            }","            case '\\u2030': {","                c = this.Formats.perMilleSign; ","                this._isPerMille = true;","                break;","            }","            case '\\u00a4': {","                if(s.charAt(i) == '\\u00a4') {","                    c = this.Formats[this.currency + \"_currencyISO\"];","                    i++;","                } else {","                    c = this.Formats[this.currency + \"_currencySymbol\"];","                }","                this._isCurrency = true;","                break;","            }","        }","        data.push(c);","    }","    return {","        text: data.join(\"\"), ","        offset: i","    };","};","    ","NumberFormat.prototype._createParseObject = function() {","    return {","        value: null","    };","};","    ","//","// NumberFormat.NumberSegment class","//","","NumberFormat.NumberSegment = function(format, s) {","    if (arguments.length == 0) return;","    Format.Segment.call(this, format, s);","};","NumberFormat.NumberSegment.prototype = new Format.Segment;","NumberFormat.NumberSegment.prototype.constructor = NumberFormat.NumberSegment;","    ","// Public methods","","NumberFormat.NumberSegment.prototype.format = function(number) {","    // special values","    if (isNaN(number)) return this._parent.Formats.nanSymbol;","    if (number === Number.NEGATIVE_INFINITY || number === Number.POSITIVE_INFINITY) {","        return this._parent.Formats.infinitySign;","    }","","    // adjust value","    if (typeof number != \"number\") number = Number(number);","    number = Math.abs(number); // NOTE: minus sign is part of pattern","    if (this._parent._isPercent) number *= 100;","    else if (this._parent._isPerMille) number *= 1000;","    if(this._parent._parseIntegerOnly) number = Math.floor(number);","        ","    // format","    var expon = this._parent.Formats.exponentialSymbol;","    var exponReg = new RegExp(expon + \"+\");","    var s = this._parent._showExponent","    ? number.toExponential(this._parent._maxFracDigits).toUpperCase().replace(exponReg,expon)","    : number.toFixed(this._parent._maxFracDigits || 0);","    s = this._normalize(s);","    return s;","};","","// Protected methods","","NumberFormat.NumberSegment.prototype._normalize = function(s) {","    var exponSymbol = this._parent.Formats.exponentialSymbol;","    var splitReg = new RegExp(\"[\\\\.\" + exponSymbol + \"]\")","    var match = s.split(splitReg);","	","    // normalize whole part","    var whole = match.shift();","    if (whole.length < this._parent._minIntDigits) {","        whole = zeroPad(whole, this._parent._minIntDigits, this._parent.Formats.numberZero);","    }","    if (whole.length > this._parent._primaryGrouping && this._parent._useGrouping) {","        var a = [];","	    ","        var offset = this._parent._primaryGrouping;","        var i = whole.length - offset;","        while (i > 0) {","            a.unshift(whole.substr(i, offset));","            a.unshift(this._parent.Formats.groupingSeparator);","            offset = this._parent._secondaryGrouping;","            i -= offset;","        }","        a.unshift(whole.substring(0, i + offset));","		","        whole = a.join(\"\");","    }","	","    // normalize rest","    var fract = '0';","    var expon;","        ","    if(s.match(/\\./))","        fract = match.shift();","    else if(s.match(/\\e/) || s.match(/\\E/))","        expon = match.shift();","","    fract = fract.replace(/0+$/,\"\");","    if (fract.length < this._parent._minFracDigits) {","        fract = zeroPad(fract, this._parent._minFracDigits, this._parent.Formats.numberZero, true);","    }","	","    a = [ whole ];","    if (fract.length > 0) {","        var decimal = this._parent.Formats.decimalSeparator;","        a.push(decimal, fract);","    }","    if (expon) {","        a.push(exponSymbol, expon.replace(/^\\+/,\"\"));","    }","	","    // return normalize result","    return a.join(\"\");","}","    ","NumberFormat.NumberSegment.prototype.parse = function(object, s, index) {","    var comma = this._parent.Formats.groupingSeparator;","    var dot = this._parent.Formats.decimalSeparator;","    var minusSign = this._parent.Formats.minusSign;","    var expon = this._parent.Formats.exponentialSymbol;","        ","    var numberRegexPattern = \"[\\\\\" + minusSign + \"0-9\" + comma + \"]+\";","    if(!this._parent._parseIntegerOnly) {","        numberRegexPattern += \"(\\\\\" + dot + \"[0-9]+)?\";","    }","    if(this._parent._showExponent) {","        numberRegexPattern += \"(\" + expon +\"\\\\+?[0-9]+)\";","    }","        ","    var numberRegex = new RegExp(numberRegexPattern);","    var matches = s.match(numberRegex);","        ","    if(!matches) {","        throw new Format.ParsingException(\"Number does not match pattern\");","    }","        ","    var negativeNum = s.indexOf(minusSign) != -1;","    var endIndex = index + matches[0].length;","    s = s.slice(index, endIndex);","        ","    var scientific = null;","        ","    //Scientific format does not use grouping","    if(this._parent.showExponent) {","        scientific = s.split(expon);","    } else if(this._parent._useGrouping) {","        //Verify grouping data exists","        if(!this._parent._primaryGrouping) {","            //Should not happen","            throw new Format.ParsingException(\"Invalid pattern\");","        }","            ","        //Verify grouping is correct","        var i = s.length - this._parent._primaryGrouping - 1;","            ","        if(matches[1]) {","            //If there is a decimal part, ignore that. Grouping assumed to apply only to whole number part","            i = i - matches[1].length;","        }","            ","        //Use primary grouping for first group","        if(i > 0) {","            //There should be a comma at i","            if(s.charAt(i) != ',') {","                throw new Format.ParsingException(\"Number does not match pattern\");","            }","                ","            //Remove comma","            s = s.slice(0, i) + s.slice(i+1);","        }","            ","        //If more groups, use primary/secondary grouping as applicable","        var grouping = this._parent._secondaryGrouping || this._parent._primaryGrouping;","        i = i - grouping - 1;","            ","        while(i > 0) {","            //There should be a comma at i","            if(s.charAt(i) != ',') {","                throw new Format.ParsingException(\"Number does not match pattern\");","            }","                ","            //Remove comma","            s = s.slice(0, i) + s.slice(i+1);","            i = i - grouping - 1;","        }","            ","        //Verify there are no more grouping separators","        if(s.indexOf(comma) != -1) {","            throw new Format.ParsingException(\"Number does not match pattern\");","        }","    }","        ","    if(scientific) {","        object.value = parseFloat(scientific[0], 10) * Math.pow(10, parseFloat(scientific[1], 10));","    } else {","        object.value = parseFloat(s, 10);","    }","        ","    //Special types","    if(negativeNum) object.value *= -1;","    if (this._parent._isPercent) object.value /= 100;","    else if (this._parent._isPerMille) object.value /= 1000;","        ","    return endIndex;","};","    ","//","// YUI Code","//","    ","/**"," * NumberFormat"," * @class Y.NumberFormat"," * @constructor"," * @param {Number} style (Optional) the given style. Defaults to Number style"," */","Y.NumberFormat = function(style) {","    style = style || Y.NumberFormat.STYLES.NUMBER_STYLE;","        ","    var pattern = \"\";","    var formats = Y.Intl.get(MODULE_NAME);","    switch(style) {","        case Y.NumberFormat.STYLES.CURRENCY_STYLE:","            pattern = formats.currencyFormat;","            break;","        case Y.NumberFormat.STYLES.ISO_CURRENCY_STYLE:","            pattern = formats.currencyFormat;","            pattern = pattern.replace(\"\\u00a4\", \"\\u00a4\\u00a4\");","            break;","        case Y.NumberFormat.STYLES.NUMBER_STYLE:","            pattern = formats.decimalFormat;","            break;","        case Y.NumberFormat.STYLES.PERCENT_STYLE:","            pattern = formats.percentFormat;","            break;","        case Y.NumberFormat.STYLES.PLURAL_CURRENCY_STYLE:","            //This is like <value> <currency>. This may be dependent on whether the value is singular or plural. Will be handled during formatting","            pattern = \"{plural_style}\";","            break;","        case Y.NumberFormat.STYLES.SCIENTIFIC_STYLE:","            pattern = formats.scientificFormat;","            break;","    }","        ","    this._numberFormatInstance = new NumberFormat(pattern, formats);","}","    ","Y.NumberFormat.STYLES = {","    CURRENCY_STYLE: 1,","    ISO_CURRENCY_STYLE: 2,","    NUMBER_STYLE: 4,","    PERCENT_STYLE: 8,","    PLURAL_CURRENCY_STYLE: 16,","    SCIENTIFIC_STYLE: 32","}","    ","//Exceptions","    ","Y.NumberFormat.UnknownStyleException = function(message) {","    this.message = message;","}","Y.NumberFormat.UnknownStyleException.prototype.toString = function() {","    return \"UnknownStyleException: \" + this.message;","}","    ","//Static methods","    ","/**"," * Create an instance of NumberFormat "," * @param {Number} style (Optional) the given style"," */    ","Y.NumberFormat.createInstance = function(style) {","    return new Y.NumberFormat(style);","}","","/**"," * Returns an array of BCP 47 language tags for the languages supported by this class"," * @return {Array} an array of BCP 47 language tags for the languages supported by this class."," */","Y.NumberFormat.getAvailableLocales = function() {","    return Y.Intl.getAvailableLangs(MODULE_NAME);","}","    ","//Public methods","    ","/**"," * Format a number to product a String."," * @param {Number} number the number to format"," */","Y.NumberFormat.prototype.format = function(number) {","    return this._numberFormatInstance.format(number);","}","    ","/**"," * Gets the currency used to display currency amounts. This may be an empty string for some cases. "," * @return {String} a 3-letter ISO code indicating the currency in use, or an empty string."," */","Y.NumberFormat.prototype.getCurrency = function() {","    return this._numberFormatInstance.currency;","}","    ","/**"," * Returns the maximum number of digits allowed in the fraction portion of a number. "," * @return {Number} the maximum number of digits allowed in the fraction portion of a number."," */","Y.NumberFormat.prototype.getMaximumFractionDigits = function() {","    return this._numberFormatInstance._maxFracDigits || 0;","}","    ","/**"," * Returns the maximum number of digits allowed in the integer portion of a number. "," * @return {Number} the maximum number of digits allowed in the integer portion of a number."," */","Y.NumberFormat.prototype.getMaximumIntegerDigits = function() {","    return this._numberFormatInstance._maxIntDigits || 0;","}","    ","/**"," * Returns the minimum number of digits allowed in the fraction portion of a number. "," * @return {Number} the minimum number of digits allowed in the fraction portion of a number."," */","Y.NumberFormat.prototype.getMinimumFractionDigits = function() {","    return this._numberFormatInstance._minFracDigits || 0;","}","    ","/**"," * Returns the minimum number of digits allowed in the integer portion of a number."," * @return {Number} the minimum number of digits allowed in the integer portion of a number."," */","Y.NumberFormat.prototype.getMinimumIntegerDigits = function() {","    return this._numberFormatInstance._minIntDigits || 0;","}","    ","/**"," * Returns true if grouping is used in this format."," * For example, in the English locale, with grouping on, the number 1234567 might be formatted as \"1,234,567\"."," * The grouping separator as well as the size of each group is locale dependant."," * @return {Boolean}"," */","Y.NumberFormat.prototype.isGroupingUsed = function() {","    return this._numberFormatInstance._useGrouping;","}","    ","/**"," * Return true if this format will parse numbers as integers only."," * For example in the English locale, with ParseIntegerOnly true, the string \"1234.\" would be parsed as the integer value 1234"," * and parsing would stop at the \".\" character. Of course, the exact format accepted by the parse operation is locale dependant."," * @return {Boolean}"," */","Y.NumberFormat.prototype.isParseIntegerOnly = function() {","    return this._numberFormatInstance._parseIntegerOnly;","}","    ","/**"," * Parse the string to get a number"," * @param {String} txt The string to parse"," * @param {Number} pp (Optional) Parse position. The position to start parsing at. Defaults to 0"," */","Y.NumberFormat.prototype.parse = function(txt, pp) {","    return this._numberFormatInstance.parse(txt, pp);","}","    ","/**"," * Sets the currency used to display currency amounts."," * This takes effect immediately, if this format is a currency format."," * If this format is not a currency format, then the currency is used if and when this object becomes a currency format."," * @param {String} currency a 3-letter ISO code indicating new currency to use. May be the empty string to indicate no currency."," */","Y.NumberFormat.prototype.setCurrency = function(currency) {","    this._numberFormatInstance.currency = currency;","}","    ","/**"," * Set whether or not grouping will be used in this format. "," * @param {Boolean} value"," */","Y.NumberFormat.prototype.setGroupingUsed = function(value) {","    this._numberFormatInstance._useGrouping = value;","}","    ","/**"," * Sets the maximum number of digits allowed in the fraction portion of a number."," * maximumFractionDigits must be >= minimumFractionDigits."," * If the new value for maximumFractionDigits is less than the current value of minimumFractionDigits,"," * then minimumFractionDigits will also be set to the new value. "," * @param {Number} newValue the new value to be set."," */","Y.NumberFormat.prototype.setMaximumFractionDigits = function(newValue) {","    this._numberFormatInstance._maxFracDigits = newValue;","        ","    if(this.getMinimumFractionDigits() > newValue) {","        this.setMinimumFractionDigits(newValue);","    }","}","    ","/**"," * Sets the maximum number of digits allowed in the integer portion of a number."," * maximumIntegerDigits must be >= minimumIntegerDigits."," * If the new value for maximumIntegerDigits is less than the current value of minimumIntegerDigits,"," * then minimumIntegerDigits will also be set to the new value."," * @param {Number} newValue the new value to be set."," */","Y.NumberFormat.prototype.setMaximumIntegerDigits = function(newValue) {","    this._numberFormatInstance._maxIntDigits = newValue;","        ","    if(this.getMinimumIntegerDigits() > newValue) {","        this.setMinimumIntegerDigits(newValue);","    }","}","    ","/**"," * Sets the minimum number of digits allowed in the fraction portion of a number."," * minimumFractionDigits must be <= maximumFractionDigits."," * If the new value for minimumFractionDigits exceeds the current value of maximumFractionDigits,"," * then maximumIntegerDigits will also be set to the new value"," * @param {Number} newValue the new value to be set."," */","Y.NumberFormat.prototype.setMinimumFractionDigits = function(newValue) {","    this._numberFormatInstance._minFracDigits = newValue;","        ","    if(this.getMaximumFractionDigits() < newValue) {","        this.setMaximumFractionDigits(newValue);","    }","}","    ","/**"," * Sets the minimum number of digits allowed in the integer portion of a number."," * minimumIntegerDigits must be <= maximumIntegerDigits."," * If the new value for minimumIntegerDigits exceeds the current value of maximumIntegerDigits,"," * then maximumIntegerDigits will also be set to the new value. "," * @param {Number} newValue the new value to be set."," */","Y.NumberFormat.prototype.setMinimumIntegerDigits = function(newValue) {","    this._numberFormatInstance._minIntDigits = newValue;","        ","    if(this.getMaximumIntegerDigits() < newValue) {","        this.setMaximumIntegerDigits(newValue);","    }","}","    ","/**"," * Sets whether or not numbers should be parsed as integers only. "," * @param {Boolean} newValue set True, this format will parse numbers as integers only."," */","Y.NumberFormat.prototype.setParseIntegerOnly = function(newValue) {","    this._numberFormatInstance._parseIntegerOnly = newValue;","}","","","}, '@VERSION@', {\"lang\": [\"af-NA\", \"af\", \"af-ZA\", \"am-ET\", \"am\", \"ar-AE\", \"ar-BH\", \"ar-DZ\", \"ar-EG\", \"ar-IQ\", \"ar-JO\", \"ar-KW\", \"ar-LB\", \"ar-LY\", \"ar-MA\", \"ar-OM\", \"ar-QA\", \"ar-SA\", \"ar-SD\", \"ar-SY\", \"ar-TN\", \"ar\", \"ar-YE\", \"as-IN\", \"as\", \"az-AZ\", \"az-Cyrl-AZ\", \"az-Cyrl\", \"az-Latn-AZ\", \"az-Latn\", \"az\", \"be-BY\", \"be\", \"bg-BG\", \"bg\", \"bn-BD\", \"bn-IN\", \"bn\", \"bo-CN\", \"bo-IN\", \"bo\", \"ca-ES\", \"ca\", \"cs-CZ\", \"cs\", \"cy-GB\", \"cy\", \"da-DK\", \"da\", \"de-AT\", \"de-BE\", \"de-CH\", \"de-DE\", \"de-LI\", \"de-LU\", \"de\", \"el-CY\", \"el-GR\", \"el\", \"en-AU\", \"en-BE\", \"en-BW\", \"en-BZ\", \"en-CA\", \"en-GB\", \"en-HK\", \"en-IE\", \"en-IN\", \"en-JM\", \"en-JO\", \"en-MH\", \"en-MT\", \"en-MY\", \"en-NA\", \"en-NZ\", \"en-PH\", \"en-PK\", \"en-RH\", \"en-SG\", \"en-TT\", \"en\", \"en-US-POSIX\", \"en-US\", \"en-VI\", \"en-ZA\", \"en-ZW\", \"eo\", \"es-AR\", \"es-BO\", \"es-CL\", \"es-CO\", \"es-CR\", \"es-DO\", \"es-EC\", \"es-ES\", \"es-GT\", \"es-HN\", \"es-MX\", \"es-NI\", \"es-PA\", \"es-PE\", \"es-PR\", \"es-PY\", \"es-SV\", \"es\", \"es-US\", \"es-UY\", \"es-VE\", \"et-EE\", \"et\", \"eu-ES\", \"eu\", \"fa-AF\", \"fa-IR\", \"fa\", \"fi-FI\", \"fi\", \"fil-PH\", \"fil\", \"fo-FO\", \"fo\", \"fr-BE\", \"fr-CA\", \"fr-CH\", \"fr-FR\", \"fr-LU\", \"fr-MC\", \"fr-SN\", \"fr\", \"ga-IE\", \"ga\", \"gl-ES\", \"gl\", \"gsw-CH\", \"gsw\", \"gu-IN\", \"gu\", \"gv-GB\", \"gv\", \"ha-GH\", \"ha-Latn-GH\", \"ha-Latn-NE\", \"ha-Latn-NG\", \"ha-Latn\", \"ha-NE\", \"ha-NG\", \"ha\", \"haw\", \"haw-US\", \"he-IL\", \"he\", \"hi-IN\", \"hi\", \"hr-HR\", \"hr\", \"hu-HU\", \"hu\", \"hy-AM-REVISED\", \"hy-AM\", \"hy\", \"id-ID\", \"id\", \"ii-CN\", \"ii\", \"in-ID\", \"in\", \"is-IS\", \"is\", \"it-CH\", \"it-IT\", \"it\", \"iw-IL\", \"iw\", \"ja-JP-TRADITIONAL\", \"ja-JP\", \"ja\", \"ka-GE\", \"ka\", \"kk-Cyrl-KZ\", \"kk-Cyrl\", \"kk-KZ\", \"kk\", \"kl-GL\", \"kl\", \"km-KH\", \"km\", \"kn-IN\", \"kn\", \"kok-IN\", \"kok\", \"ko-KR\", \"ko\", \"kw-GB\", \"kw\", \"lt-LT\", \"lt\", \"lv-LV\", \"lv\", \"mk-MK\", \"mk\", \"ml-IN\", \"ml\", \"mr-IN\", \"mr\", \"ms-BN\", \"ms-MY\", \"ms\", \"mt-MT\", \"mt\", \"nb-NO\", \"nb\", \"ne-IN\", \"ne-NP\", \"ne\", \"nl-BE\", \"nl-NL\", \"nl\", \"nn-NO\", \"nn\", \"no-NO-NY\", \"no-NO\", \"no\", \"om-ET\", \"om-KE\", \"om\", \"or-IN\", \"or\", \"pa-Arab-PK\", \"pa-Arab\", \"pa-Guru-IN\", \"pa-Guru\", \"pa-IN\", \"pa-PK\", \"pa\", \"pl-PL\", \"pl\", \"ps-AF\", \"ps\", \"pt-BR\", \"pt-PT\", \"pt\", \"ro-MD\", \"ro-RO\", \"ro\", \"ru-RU\", \"ru\", \"ru-UA\", \"sh-BA\", \"sh-CS\", \"sh\", \"sh-YU\", \"si-LK\", \"si\", \"sk-SK\", \"sk\", \"sl-SI\", \"sl\", \"so-DJ\", \"so-ET\", \"so-KE\", \"so-SO\", \"so\", \"sq-AL\", \"sq\", \"sr-BA\", \"sr-CS\", \"sr-Cyrl-BA\", \"sr-Cyrl-CS\", \"sr-Cyrl-ME\", \"sr-Cyrl-RS\", \"sr-Cyrl\", \"sr-Cyrl-YU\", \"sr-Latn-BA\", \"sr-Latn-CS\", \"sr-Latn-ME\", \"sr-Latn-RS\", \"sr-Latn\", \"sr-Latn-YU\", \"sr-ME\", \"sr-RS\", \"sr\", \"sr-YU\", \"sv-FI\", \"sv-SE\", \"sv\", \"sw-KE\", \"sw\", \"sw-TZ\", \"ta-IN\", \"ta\", \"te-IN\", \"te\", \"th-TH-TRADITIONAL\", \"th-TH\", \"th\", \"ti-ER\", \"ti-ET\", \"ti\", \"tl-PH\", \"tl\", \"tr-TR\", \"tr\", \"uk\", \"uk-UA\", \"ur-IN\", \"ur-PK\", \"ur\", \"uz-AF\", \"uz-Arab-AF\", \"uz-Arab\", \"uz-Cyrl\", \"uz-Cyrl-UZ\", \"uz-Latn\", \"uz-Latn-UZ\", \"uz\", \"uz-UZ\", \"vi\", \"vi-VN\", \"zh-CN\", \"zh-Hans-CN\", \"zh-Hans-HK\", \"zh-Hans-MO\", \"zh-Hans-SG\", \"zh-Hans\", \"zh-Hant-HK\", \"zh-Hant-MO\", \"zh-Hant-TW\", \"zh-Hant\", \"zh-HK\", \"zh-MO\", \"zh-SG\", \"zh-TW\", \"zh\", \"zu\", \"zu-ZA\"]});"];
_yuitest_coverage["build/format-numbers/format-numbers.js"].lines = {"1":0,"16":0,"17":0,"18":0,"20":0,"21":0,"22":0,"27":0,"28":0,"32":0,"33":0,"35":0,"36":0,"39":0,"40":0,"42":0,"43":0,"46":0,"47":0,"49":0,"50":0,"55":0,"56":0,"58":0,"59":0,"61":0,"66":0,"67":0,"69":0,"71":0,"73":0,"74":0,"75":0,"77":0,"79":0,"90":0,"91":0,"92":0,"93":0,"94":0,"95":0,"98":0,"99":0,"101":0,"110":0,"111":0,"118":0,"119":0,"120":0,"121":0,"126":0,"127":0,"131":0,"132":0,"147":0,"148":0,"151":0,"152":0,"155":0,"156":0,"157":0,"159":0,"160":0,"161":0,"164":0,"185":0,"186":0,"187":0,"188":0,"189":0,"190":0,"191":0,"194":0,"195":0,"196":0,"198":0,"199":0,"201":0,"202":0,"203":0,"204":0,"205":0,"208":0,"211":0,"218":0,"219":0,"220":0,"222":0,"223":0,"225":0,"226":0,"229":0,"230":0,"233":0,"234":0,"235":0,"261":0,"263":0,"264":0,"265":0,"268":0,"269":0,"270":0,"273":0,"274":0,"275":0,"276":0,"280":0,"281":0,"282":0,"285":0,"286":0,"288":0,"289":0,"292":0,"293":0,"294":0,"295":0,"297":0,"298":0,"299":0,"303":0,"305":0,"306":0,"307":0,"308":0,"309":0,"313":0,"314":0,"316":0,"318":0,"320":0,"321":0,"322":0,"323":0,"324":0,"325":0,"328":0,"329":0,"330":0,"335":0,"336":0,"337":0,"338":0,"340":0,"343":0,"344":0,"345":0,"346":0,"347":0,"349":0,"352":0,"355":0,"356":0,"357":0,"358":0,"362":0,"364":0,"365":0,"366":0,"370":0,"371":0,"373":0,"374":0,"375":0,"377":0,"380":0,"381":0,"385":0,"386":0,"387":0,"388":0,"390":0,"394":0,"396":0,"399":0,"400":0,"401":0,"402":0,"407":0,"408":0,"409":0,"412":0,"414":0,"415":0,"416":0,"418":0,"419":0,"422":0,"423":0,"426":0,"429":0,"432":0,"433":0,"434":0,"437":0,"438":0,"439":0,"441":0,"444":0,"445":0,"446":0,"447":0,"451":0,"456":0,"457":0,"458":0,"459":0,"460":0,"461":0,"462":0,"464":0,"466":0,"467":0,"470":0,"471":0,"472":0,"475":0,"476":0,"477":0,"480":0,"481":0,"482":0,"485":0,"486":0,"487":0,"489":0,"491":0,"492":0,"495":0,"497":0,"503":0,"504":0,"513":0,"514":0,"515":0,"517":0,"518":0,"522":0,"524":0,"525":0,"526":0,"530":0,"531":0,"532":0,"533":0,"534":0,"537":0,"538":0,"539":0,"542":0,"543":0,"548":0,"549":0,"550":0,"551":0,"554":0,"555":0,"556":0,"558":0,"559":0,"561":0,"562":0,"563":0,"564":0,"565":0,"566":0,"567":0,"569":0,"571":0,"575":0,"576":0,"578":0,"579":0,"580":0,"581":0,"583":0,"584":0,"585":0,"588":0,"589":0,"590":0,"591":0,"593":0,"594":0,"598":0,"601":0,"602":0,"603":0,"604":0,"605":0,"607":0,"608":0,"609":0,"611":0,"612":0,"615":0,"616":0,"618":0,"619":0,"622":0,"623":0,"624":0,"626":0,"629":0,"630":0,"631":0,"633":0,"635":0,"639":0,"641":0,"643":0,"647":0,"649":0,"650":0,"654":0,"658":0,"659":0,"661":0,"663":0,"664":0,"668":0,"669":0,"673":0,"674":0,"678":0,"679":0,"681":0,"685":0,"686":0,"687":0,"689":0,"702":0,"703":0,"705":0,"706":0,"707":0,"709":0,"710":0,"712":0,"713":0,"714":0,"716":0,"717":0,"719":0,"720":0,"723":0,"724":0,"726":0,"727":0,"730":0,"733":0,"744":0,"745":0,"747":0,"748":0,"757":0,"758":0,"765":0,"766":0,"775":0,"776":0,"783":0,"784":0,"791":0,"792":0,"799":0,"800":0,"807":0,"808":0,"815":0,"816":0,"825":0,"826":0,"835":0,"836":0,"844":0,"845":0,"854":0,"855":0,"862":0,"863":0,"873":0,"874":0,"876":0,"877":0,"888":0,"889":0,"891":0,"892":0,"903":0,"904":0,"906":0,"907":0,"918":0,"919":0,"921":0,"922":0,"930":0,"931":0};
_yuitest_coverage["build/format-numbers/format-numbers.js"].functions = {"Format:16":0,"ParsingException:32":0,"toString:35":0,"IllegalArgumentsException:39":0,"toString:42":0,"FormatException:46":0,"toString:49":0,"format:55":0,"zeroPad:66":0,"parse:90":0,"_createParseObject:110":0,"Segment:118":0,"format:131":0,"parse:147":0,"getFormat:151":0,"_parseLiteral:155":0,"_parseInt:185":0,"TextSegment:218":0,"toString:225":0,"parse:229":0,"trim:234":0,"NumberFormat:263":0,"format:407":0,"parse:432":0,"__parseStatic:456":0,"_createParseObject:503":0,"NumberSegment:513":0,"format:522":0,"_normalize:548":0,"parse:601":0,"NumberFormat:702":0,"UnknownStyleException:744":0,"toString:747":0,"createInstance:757":0,"getAvailableLocales:765":0,"format:775":0,"getCurrency:783":0,"getMaximumFractionDigits:791":0,"getMaximumIntegerDigits:799":0,"getMinimumFractionDigits:807":0,"getMinimumIntegerDigits:815":0,"isGroupingUsed:825":0,"isParseIntegerOnly:835":0,"parse:844":0,"setCurrency:854":0,"setGroupingUsed:862":0,"setMaximumFractionDigits:873":0,"setMaximumIntegerDigits:888":0,"setMinimumFractionDigits:903":0,"setMinimumIntegerDigits:918":0,"setParseIntegerOnly:930":0,"(anonymous 1):1":0};
_yuitest_coverage["build/format-numbers/format-numbers.js"].coveredLines = 400;
_yuitest_coverage["build/format-numbers/format-numbers.js"].coveredFunctions = 52;
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
Format.ParsingException = function(message) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "ParsingException", 32);
_yuitest_coverline("build/format-numbers/format-numbers.js", 33);
this.message = message;
}
_yuitest_coverline("build/format-numbers/format-numbers.js", 35);
Format.ParsingException.prototype.toString = function() {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "toString", 35);
_yuitest_coverline("build/format-numbers/format-numbers.js", 36);
return "ParsingException: " + this.message;
}

_yuitest_coverline("build/format-numbers/format-numbers.js", 39);
Format.IllegalArgumentsException = function(message) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "IllegalArgumentsException", 39);
_yuitest_coverline("build/format-numbers/format-numbers.js", 40);
this.message = message;
}
_yuitest_coverline("build/format-numbers/format-numbers.js", 42);
Format.IllegalArgumentsException.prototype.toString = function() {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "toString", 42);
_yuitest_coverline("build/format-numbers/format-numbers.js", 43);
return "IllegalArgumentsException: " + this.message;
}
    
_yuitest_coverline("build/format-numbers/format-numbers.js", 46);
Format.FormatException = function(message) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "FormatException", 46);
_yuitest_coverline("build/format-numbers/format-numbers.js", 47);
this.message = message;
}
_yuitest_coverline("build/format-numbers/format-numbers.js", 49);
Format.FormatException.prototype.toString = function() {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "toString", 49);
_yuitest_coverline("build/format-numbers/format-numbers.js", 50);
return "FormatException: " + this.message;
}    

// Public methods

_yuitest_coverline("build/format-numbers/format-numbers.js", 55);
Format.prototype.format = function(object) { 
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "format", 55);
_yuitest_coverline("build/format-numbers/format-numbers.js", 56);
var s = [];
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 58);
for (var i = 0; i < this._segments.length; i++) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 59);
s.push(this._segments[i].format(object));
    }
    _yuitest_coverline("build/format-numbers/format-numbers.js", 61);
return s.join("");
};

// Protected static methods

_yuitest_coverline("build/format-numbers/format-numbers.js", 66);
function zeroPad (s, length, zeroChar, rightSide) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "zeroPad", 66);
_yuitest_coverline("build/format-numbers/format-numbers.js", 67);
s = typeof s == "string" ? s : String(s);

    _yuitest_coverline("build/format-numbers/format-numbers.js", 69);
if (s.length >= length) {return s;}

    _yuitest_coverline("build/format-numbers/format-numbers.js", 71);
zeroChar = zeroChar || '0';
	
    _yuitest_coverline("build/format-numbers/format-numbers.js", 73);
var a = [];
    _yuitest_coverline("build/format-numbers/format-numbers.js", 74);
for (var i = s.length; i < length; i++) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 75);
a.push(zeroChar);
    }
    _yuitest_coverline("build/format-numbers/format-numbers.js", 77);
a[rightSide ? "unshift" : "push"](s);

    _yuitest_coverline("build/format-numbers/format-numbers.js", 79);
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
_yuitest_coverline("build/format-numbers/format-numbers.js", 90);
Format.prototype.parse = function(s, pp) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "parse", 90);
_yuitest_coverline("build/format-numbers/format-numbers.js", 91);
var object = this._createParseObject();
    _yuitest_coverline("build/format-numbers/format-numbers.js", 92);
var index = pp || 0;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 93);
for (var i = 0; i < this._segments.length; i++) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 94);
var segment = this._segments[i];
        _yuitest_coverline("build/format-numbers/format-numbers.js", 95);
index = segment.parse(object, s, index);
    }
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 98);
if (index < s.length) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 99);
throw new Format.ParsingException("Input too long");
    }
    _yuitest_coverline("build/format-numbers/format-numbers.js", 101);
return object;
};
    
/**
     * Creates the object that is initialized by parsing
     * <p>
     * <strong>Note:</strong>
     * This must be implemented by sub-classes.
     */
_yuitest_coverline("build/format-numbers/format-numbers.js", 110);
Format.prototype._createParseObject = function(s) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "_createParseObject", 110);
_yuitest_coverline("build/format-numbers/format-numbers.js", 111);
throw new Format.ParsingException("Not implemented");
};

//
// Segment class
//

_yuitest_coverline("build/format-numbers/format-numbers.js", 118);
Format.Segment = function(format, s) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "Segment", 118);
_yuitest_coverline("build/format-numbers/format-numbers.js", 119);
if (arguments.length == 0) {return;}
    _yuitest_coverline("build/format-numbers/format-numbers.js", 120);
this._parent = format;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 121);
this._s = s;
};
    
// Data

_yuitest_coverline("build/format-numbers/format-numbers.js", 126);
Format.Segment.prototype._parent = null;
_yuitest_coverline("build/format-numbers/format-numbers.js", 127);
Format.Segment.prototype._s = null;

// Public methods

_yuitest_coverline("build/format-numbers/format-numbers.js", 131);
Format.Segment.prototype.format = function(o) { 
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "format", 131);
_yuitest_coverline("build/format-numbers/format-numbers.js", 132);
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
_yuitest_coverline("build/format-numbers/format-numbers.js", 147);
Format.Segment.prototype.parse = function(o, s, index) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "parse", 147);
_yuitest_coverline("build/format-numbers/format-numbers.js", 148);
throw new Format.ParsingException("Not implemented");
};

_yuitest_coverline("build/format-numbers/format-numbers.js", 151);
Format.Segment.prototype.getFormat = function() {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "getFormat", 151);
_yuitest_coverline("build/format-numbers/format-numbers.js", 152);
return this._parent;
};

_yuitest_coverline("build/format-numbers/format-numbers.js", 155);
Format.Segment._parseLiteral = function(literal, s, index) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "_parseLiteral", 155);
_yuitest_coverline("build/format-numbers/format-numbers.js", 156);
if (s.length - index < literal.length) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 157);
throw new Format.ParsingException("Input too short");
    }
    _yuitest_coverline("build/format-numbers/format-numbers.js", 159);
for (var i = 0; i < literal.length; i++) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 160);
if (literal.charAt(i) != s.charAt(index + i)) {
            _yuitest_coverline("build/format-numbers/format-numbers.js", 161);
throw new Format.ParsingException("Input doesn't match");
        }
    }
    _yuitest_coverline("build/format-numbers/format-numbers.js", 164);
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
_yuitest_coverline("build/format-numbers/format-numbers.js", 185);
Format.Segment._parseInt = function(o, f, adjust, s, index, fixedlen, radix) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "_parseInt", 185);
_yuitest_coverline("build/format-numbers/format-numbers.js", 186);
var len = fixedlen || s.length - index;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 187);
var head = index;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 188);
for (var i = 0; i < len; i++) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 189);
if (!s.charAt(index++).match(/\d/)) {
            _yuitest_coverline("build/format-numbers/format-numbers.js", 190);
index--;
            _yuitest_coverline("build/format-numbers/format-numbers.js", 191);
break;
        }
    }
    _yuitest_coverline("build/format-numbers/format-numbers.js", 194);
var tail = index;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 195);
if (head == tail) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 196);
throw new Format.ParsingException("Number not present");
    }
    _yuitest_coverline("build/format-numbers/format-numbers.js", 198);
if (fixedlen && tail - head != fixedlen) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 199);
throw new Format.ParsingException("Number too short");
    }
    _yuitest_coverline("build/format-numbers/format-numbers.js", 201);
var value = parseInt(s.substring(head, tail), radix || 10);
    _yuitest_coverline("build/format-numbers/format-numbers.js", 202);
if (f) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 203);
var target = o || window;
        _yuitest_coverline("build/format-numbers/format-numbers.js", 204);
if (typeof f == "function") {
            _yuitest_coverline("build/format-numbers/format-numbers.js", 205);
f.call(target, value + adjust);
        }
        else {
            _yuitest_coverline("build/format-numbers/format-numbers.js", 208);
target[f] = value + adjust;
        }
    }
    _yuitest_coverline("build/format-numbers/format-numbers.js", 211);
return tail;
};

//
// Text segment class
//

_yuitest_coverline("build/format-numbers/format-numbers.js", 218);
Format.TextSegment = function(format, s) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "TextSegment", 218);
_yuitest_coverline("build/format-numbers/format-numbers.js", 219);
if (arguments.length == 0) {return;}
    _yuitest_coverline("build/format-numbers/format-numbers.js", 220);
Format.Segment.call(this, format, s);
};
_yuitest_coverline("build/format-numbers/format-numbers.js", 222);
Format.TextSegment.prototype = new Format.Segment;
_yuitest_coverline("build/format-numbers/format-numbers.js", 223);
Format.TextSegment.prototype.constructor = Format.TextSegment;

_yuitest_coverline("build/format-numbers/format-numbers.js", 225);
Format.TextSegment.prototype.toString = function() { 
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "toString", 225);
_yuitest_coverline("build/format-numbers/format-numbers.js", 226);
return "text: \""+this._s+'"'; 
};
    
_yuitest_coverline("build/format-numbers/format-numbers.js", 229);
Format.TextSegment.prototype.parse = function(o, s, index) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "parse", 229);
_yuitest_coverline("build/format-numbers/format-numbers.js", 230);
return Format.Segment._parseLiteral(this._s, s, index);
};

_yuitest_coverline("build/format-numbers/format-numbers.js", 233);
if(String.prototype.trim == null) {
    _yuitest_coverline("build/format-numbers/format-numbers.js", 234);
String.prototype.trim = function() {
        _yuitest_coverfunc("build/format-numbers/format-numbers.js", "trim", 234);
_yuitest_coverline("build/format-numbers/format-numbers.js", 235);
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

_yuitest_coverline("build/format-numbers/format-numbers.js", 261);
var MODULE_NAME = "format-numbers";

_yuitest_coverline("build/format-numbers/format-numbers.js", 263);
NumberFormat = function(pattern, formats, skipNegFormat) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "NumberFormat", 263);
_yuitest_coverline("build/format-numbers/format-numbers.js", 264);
if (arguments.length == 0) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 265);
return;
    }

    _yuitest_coverline("build/format-numbers/format-numbers.js", 268);
Format.call(this, pattern, formats);
    _yuitest_coverline("build/format-numbers/format-numbers.js", 269);
if (!pattern) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 270);
return;
    }

    _yuitest_coverline("build/format-numbers/format-numbers.js", 273);
if(pattern == "{plural_style}") {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 274);
pattern = this.Formats.decimalFormat;
        _yuitest_coverline("build/format-numbers/format-numbers.js", 275);
this._isPluralCurrency = true;
	_yuitest_coverline("build/format-numbers/format-numbers.js", 276);
this._pattern = pattern;
    }

    //Default currency
    _yuitest_coverline("build/format-numbers/format-numbers.js", 280);
this.currency = this.Formats.defaultCurrency;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 281);
if(this.currency == null || this.currency == "") {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 282);
this.currency = "USD";
    }
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 285);
var patterns = pattern.split(/;/);
    _yuitest_coverline("build/format-numbers/format-numbers.js", 286);
pattern = patterns[0];
	
    _yuitest_coverline("build/format-numbers/format-numbers.js", 288);
this._useGrouping = (pattern.indexOf(",") != -1);      //Will be set to true if pattern uses grouping
    _yuitest_coverline("build/format-numbers/format-numbers.js", 289);
this._parseIntegerOnly = (pattern.indexOf(".") == -1);  //Will be set to false if pattern contains fractional parts
        
    //If grouping is used, find primary and secondary grouping
    _yuitest_coverline("build/format-numbers/format-numbers.js", 292);
if(this._useGrouping) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 293);
var numberPattern = pattern.match(/[0#,]+/);
        _yuitest_coverline("build/format-numbers/format-numbers.js", 294);
var groupingRegex = new RegExp("[0#]+", "g");
        _yuitest_coverline("build/format-numbers/format-numbers.js", 295);
var groups = numberPattern[0].match(groupingRegex);
            
        _yuitest_coverline("build/format-numbers/format-numbers.js", 297);
var i = groups.length - 2;
        _yuitest_coverline("build/format-numbers/format-numbers.js", 298);
this._primaryGrouping = groups[i+1].length;
        _yuitest_coverline("build/format-numbers/format-numbers.js", 299);
this._secondaryGrouping = (i > 0 ? groups[i].length : groups[i+1].length);
    }
        
    // parse prefix
    _yuitest_coverline("build/format-numbers/format-numbers.js", 303);
i = 0;
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 305);
var results = this.__parseStatic(pattern, i);
    _yuitest_coverline("build/format-numbers/format-numbers.js", 306);
i = results.offset;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 307);
var hasPrefix = results.text != "";
    _yuitest_coverline("build/format-numbers/format-numbers.js", 308);
if (hasPrefix) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 309);
this._segments.push(new Format.TextSegment(this, results.text));
    }
	
    // parse number descriptor
    _yuitest_coverline("build/format-numbers/format-numbers.js", 313);
var start = i;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 314);
while (i < pattern.length &&
        NumberFormat._META_CHARS.indexOf(pattern.charAt(i)) != -1) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 316);
i++;
    }
    _yuitest_coverline("build/format-numbers/format-numbers.js", 318);
var end = i;

    _yuitest_coverline("build/format-numbers/format-numbers.js", 320);
var numPattern = pattern.substring(start, end);
    _yuitest_coverline("build/format-numbers/format-numbers.js", 321);
var e = numPattern.indexOf(this.Formats.exponentialSymbol);
    _yuitest_coverline("build/format-numbers/format-numbers.js", 322);
var expon = e != -1 ? numPattern.substring(e + 1) : null;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 323);
if (expon) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 324);
numPattern = numPattern.substring(0, e);
        _yuitest_coverline("build/format-numbers/format-numbers.js", 325);
this._showExponent = true;
    }
	
    _yuitest_coverline("build/format-numbers/format-numbers.js", 328);
var dot = numPattern.indexOf('.');
    _yuitest_coverline("build/format-numbers/format-numbers.js", 329);
var whole = dot != -1 ? numPattern.substring(0, dot) : numPattern;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 330);
if (whole) {
        /*var comma = whole.lastIndexOf(',');
            if (comma != -1) {
                this._groupingOffset = whole.length - comma - 1;
            }*/
        _yuitest_coverline("build/format-numbers/format-numbers.js", 335);
whole = whole.replace(/[^#0]/g,"");
        _yuitest_coverline("build/format-numbers/format-numbers.js", 336);
var zero = whole.indexOf('0');
        _yuitest_coverline("build/format-numbers/format-numbers.js", 337);
if (zero != -1) {
            _yuitest_coverline("build/format-numbers/format-numbers.js", 338);
this._minIntDigits = whole.length - zero;
        }
        _yuitest_coverline("build/format-numbers/format-numbers.js", 340);
this._maxIntDigits = whole.length;
    }
	
    _yuitest_coverline("build/format-numbers/format-numbers.js", 343);
var fract = dot != -1 ? numPattern.substring(dot + 1) : null;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 344);
if (fract) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 345);
zero = fract.lastIndexOf('0');
        _yuitest_coverline("build/format-numbers/format-numbers.js", 346);
if (zero != -1) {
            _yuitest_coverline("build/format-numbers/format-numbers.js", 347);
this._minFracDigits = zero + 1;
        }
        _yuitest_coverline("build/format-numbers/format-numbers.js", 349);
this._maxFracDigits = fract.replace(/[^#0]/g,"").length;
    }
	
    _yuitest_coverline("build/format-numbers/format-numbers.js", 352);
this._segments.push(new NumberFormat.NumberSegment(this, numPattern));
	
    // parse suffix
    _yuitest_coverline("build/format-numbers/format-numbers.js", 355);
results = this.__parseStatic(pattern, i);
    _yuitest_coverline("build/format-numbers/format-numbers.js", 356);
i = results.offset;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 357);
if (results.text != "") {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 358);
this._segments.push(new Format.TextSegment(this, results.text));
    }
	
    // add negative formatter
    _yuitest_coverline("build/format-numbers/format-numbers.js", 362);
if (skipNegFormat) {return;}
	
    _yuitest_coverline("build/format-numbers/format-numbers.js", 364);
if (patterns.length > 1) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 365);
pattern = patterns[1];
        _yuitest_coverline("build/format-numbers/format-numbers.js", 366);
this._negativeFormatter = new NumberFormat(pattern, formats, true);
    }
    else {
        // no negative pattern; insert minus sign before number segment
        _yuitest_coverline("build/format-numbers/format-numbers.js", 370);
var formatter = new NumberFormat("", formats);
        _yuitest_coverline("build/format-numbers/format-numbers.js", 371);
formatter._segments = formatter._segments.concat(this._segments);

        _yuitest_coverline("build/format-numbers/format-numbers.js", 373);
var index = hasPrefix ? 1 : 0;
        _yuitest_coverline("build/format-numbers/format-numbers.js", 374);
var minus = new Format.TextSegment(formatter, this.Formats.minusSign);
        _yuitest_coverline("build/format-numbers/format-numbers.js", 375);
formatter._segments.splice(index, 0, minus);
		
        _yuitest_coverline("build/format-numbers/format-numbers.js", 377);
this._negativeFormatter = formatter;
    }
}
_yuitest_coverline("build/format-numbers/format-numbers.js", 380);
NumberFormat.prototype = new Format;
_yuitest_coverline("build/format-numbers/format-numbers.js", 381);
NumberFormat.prototype.constructor = NumberFormat;
    
// Constants

_yuitest_coverline("build/format-numbers/format-numbers.js", 385);
NumberFormat._NUMBER = "number";
_yuitest_coverline("build/format-numbers/format-numbers.js", 386);
NumberFormat._INTEGER = "integer";
_yuitest_coverline("build/format-numbers/format-numbers.js", 387);
NumberFormat._CURRENCY = "currency";
_yuitest_coverline("build/format-numbers/format-numbers.js", 388);
NumberFormat._PERCENT = "percent";

_yuitest_coverline("build/format-numbers/format-numbers.js", 390);
NumberFormat._META_CHARS = "0#.,E";

// Data

_yuitest_coverline("build/format-numbers/format-numbers.js", 394);
NumberFormat.prototype._groupingOffset = Number.MAX_VALUE;
//NumberFormat.prototype._maxIntDigits;
_yuitest_coverline("build/format-numbers/format-numbers.js", 396);
NumberFormat.prototype._minIntDigits = 1;
//NumberFormat.prototype._maxFracDigits;
//NumberFormat.prototype._minFracDigits;
_yuitest_coverline("build/format-numbers/format-numbers.js", 399);
NumberFormat.prototype._isCurrency = false;
_yuitest_coverline("build/format-numbers/format-numbers.js", 400);
NumberFormat.prototype._isPercent = false;
_yuitest_coverline("build/format-numbers/format-numbers.js", 401);
NumberFormat.prototype._isPerMille = false;
_yuitest_coverline("build/format-numbers/format-numbers.js", 402);
NumberFormat.prototype._showExponent = false;
//NumberFormat.prototype._negativeFormatter;

// Public methods

_yuitest_coverline("build/format-numbers/format-numbers.js", 407);
NumberFormat.prototype.format = function(number) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "format", 407);
_yuitest_coverline("build/format-numbers/format-numbers.js", 408);
if (number < 0 && this._negativeFormatter) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 409);
return this._negativeFormatter.format(number);
    }
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 412);
var result = Format.prototype.format.call(this, number);
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 414);
if(this._isPluralCurrency) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 415);
var pattern = "";
        _yuitest_coverline("build/format-numbers/format-numbers.js", 416);
if(number == 1) {
            //Singular
            _yuitest_coverline("build/format-numbers/format-numbers.js", 418);
pattern = this.Formats.currencyPatternSingular;
            _yuitest_coverline("build/format-numbers/format-numbers.js", 419);
pattern = pattern.replace("{1}", this.Formats[this.currency + "_currencySingular"]);
        } else {
            //Plural
            _yuitest_coverline("build/format-numbers/format-numbers.js", 422);
pattern = this.Formats.currencyPatternPlural;
            _yuitest_coverline("build/format-numbers/format-numbers.js", 423);
pattern = pattern.replace("{1}", this.Formats[this.currency + "_currencyPlural"]);
        }
            
        _yuitest_coverline("build/format-numbers/format-numbers.js", 426);
result = pattern.replace("{0}", result);
    }
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 429);
return result;
};
    
_yuitest_coverline("build/format-numbers/format-numbers.js", 432);
NumberFormat.prototype.parse = function(s, pp) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "parse", 432);
_yuitest_coverline("build/format-numbers/format-numbers.js", 433);
if(s.indexOf(this.Formats.minusSign) != -1 && this._negativeFormatter) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 434);
return this._negativeFormatter.parse(s, pp);
    }
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 437);
if(this._isPluralCurrency) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 438);
var singular = this.Formats[this.currency + "_currencySingular"];
        _yuitest_coverline("build/format-numbers/format-numbers.js", 439);
var plural = this.Formats[this.currency + "_currencyPlural"];
            
        _yuitest_coverline("build/format-numbers/format-numbers.js", 441);
s = s.replace(plural, "").replace(singular, "").trim();
    }
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 444);
var object = null;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 445);
try {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 446);
object = Format.prototype.parse.call(this, s, pp);
        _yuitest_coverline("build/format-numbers/format-numbers.js", 447);
object = object.value;
    } catch(e) {
    }
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 451);
return object;
}

// Private methods

_yuitest_coverline("build/format-numbers/format-numbers.js", 456);
NumberFormat.prototype.__parseStatic = function(s, i) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "__parseStatic", 456);
_yuitest_coverline("build/format-numbers/format-numbers.js", 457);
var data = [];
    _yuitest_coverline("build/format-numbers/format-numbers.js", 458);
while (i < s.length) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 459);
var c = s.charAt(i++);
        _yuitest_coverline("build/format-numbers/format-numbers.js", 460);
if (NumberFormat._META_CHARS.indexOf(c) != -1) {
            _yuitest_coverline("build/format-numbers/format-numbers.js", 461);
i--;
            _yuitest_coverline("build/format-numbers/format-numbers.js", 462);
break;
        }
        _yuitest_coverline("build/format-numbers/format-numbers.js", 464);
switch (c) {
            case "'": {
                _yuitest_coverline("build/format-numbers/format-numbers.js", 466);
var start = i;
                _yuitest_coverline("build/format-numbers/format-numbers.js", 467);
while (i < s.length && s.charAt(i++) != "'") {
                // do nothing
                }
                _yuitest_coverline("build/format-numbers/format-numbers.js", 470);
var end = i;
                _yuitest_coverline("build/format-numbers/format-numbers.js", 471);
c = end - start == 0 ? "'" : s.substring(start, end);
                _yuitest_coverline("build/format-numbers/format-numbers.js", 472);
break;
            }
            case '%': {
                _yuitest_coverline("build/format-numbers/format-numbers.js", 475);
c = this.Formats.percentSign; 
                _yuitest_coverline("build/format-numbers/format-numbers.js", 476);
this._isPercent = true;
                _yuitest_coverline("build/format-numbers/format-numbers.js", 477);
break;
            }
            case '\u2030': {
                _yuitest_coverline("build/format-numbers/format-numbers.js", 480);
c = this.Formats.perMilleSign; 
                _yuitest_coverline("build/format-numbers/format-numbers.js", 481);
this._isPerMille = true;
                _yuitest_coverline("build/format-numbers/format-numbers.js", 482);
break;
            }
            case '\u00a4': {
                _yuitest_coverline("build/format-numbers/format-numbers.js", 485);
if(s.charAt(i) == '\u00a4') {
                    _yuitest_coverline("build/format-numbers/format-numbers.js", 486);
c = this.Formats[this.currency + "_currencyISO"];
                    _yuitest_coverline("build/format-numbers/format-numbers.js", 487);
i++;
                } else {
                    _yuitest_coverline("build/format-numbers/format-numbers.js", 489);
c = this.Formats[this.currency + "_currencySymbol"];
                }
                _yuitest_coverline("build/format-numbers/format-numbers.js", 491);
this._isCurrency = true;
                _yuitest_coverline("build/format-numbers/format-numbers.js", 492);
break;
            }
        }
        _yuitest_coverline("build/format-numbers/format-numbers.js", 495);
data.push(c);
    }
    _yuitest_coverline("build/format-numbers/format-numbers.js", 497);
return {
        text: data.join(""), 
        offset: i
    };
};
    
_yuitest_coverline("build/format-numbers/format-numbers.js", 503);
NumberFormat.prototype._createParseObject = function() {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "_createParseObject", 503);
_yuitest_coverline("build/format-numbers/format-numbers.js", 504);
return {
        value: null
    };
};
    
//
// NumberFormat.NumberSegment class
//

_yuitest_coverline("build/format-numbers/format-numbers.js", 513);
NumberFormat.NumberSegment = function(format, s) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "NumberSegment", 513);
_yuitest_coverline("build/format-numbers/format-numbers.js", 514);
if (arguments.length == 0) {return;}
    _yuitest_coverline("build/format-numbers/format-numbers.js", 515);
Format.Segment.call(this, format, s);
};
_yuitest_coverline("build/format-numbers/format-numbers.js", 517);
NumberFormat.NumberSegment.prototype = new Format.Segment;
_yuitest_coverline("build/format-numbers/format-numbers.js", 518);
NumberFormat.NumberSegment.prototype.constructor = NumberFormat.NumberSegment;
    
// Public methods

_yuitest_coverline("build/format-numbers/format-numbers.js", 522);
NumberFormat.NumberSegment.prototype.format = function(number) {
    // special values
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "format", 522);
_yuitest_coverline("build/format-numbers/format-numbers.js", 524);
if (isNaN(number)) {return this._parent.Formats.nanSymbol;}
    _yuitest_coverline("build/format-numbers/format-numbers.js", 525);
if (number === Number.NEGATIVE_INFINITY || number === Number.POSITIVE_INFINITY) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 526);
return this._parent.Formats.infinitySign;
    }

    // adjust value
    _yuitest_coverline("build/format-numbers/format-numbers.js", 530);
if (typeof number != "number") {number = Number(number);}
    _yuitest_coverline("build/format-numbers/format-numbers.js", 531);
number = Math.abs(number); // NOTE: minus sign is part of pattern
    _yuitest_coverline("build/format-numbers/format-numbers.js", 532);
if (this._parent._isPercent) {number *= 100;}
    else {_yuitest_coverline("build/format-numbers/format-numbers.js", 533);
if (this._parent._isPerMille) {number *= 1000;}}
    _yuitest_coverline("build/format-numbers/format-numbers.js", 534);
if(this._parent._parseIntegerOnly) {number = Math.floor(number);}
        
    // format
    _yuitest_coverline("build/format-numbers/format-numbers.js", 537);
var expon = this._parent.Formats.exponentialSymbol;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 538);
var exponReg = new RegExp(expon + "+");
    _yuitest_coverline("build/format-numbers/format-numbers.js", 539);
var s = this._parent._showExponent
    ? number.toExponential(this._parent._maxFracDigits).toUpperCase().replace(exponReg,expon)
    : number.toFixed(this._parent._maxFracDigits || 0);
    _yuitest_coverline("build/format-numbers/format-numbers.js", 542);
s = this._normalize(s);
    _yuitest_coverline("build/format-numbers/format-numbers.js", 543);
return s;
};

// Protected methods

_yuitest_coverline("build/format-numbers/format-numbers.js", 548);
NumberFormat.NumberSegment.prototype._normalize = function(s) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "_normalize", 548);
_yuitest_coverline("build/format-numbers/format-numbers.js", 549);
var exponSymbol = this._parent.Formats.exponentialSymbol;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 550);
var splitReg = new RegExp("[\\." + exponSymbol + "]")
    _yuitest_coverline("build/format-numbers/format-numbers.js", 551);
var match = s.split(splitReg);
	
    // normalize whole part
    _yuitest_coverline("build/format-numbers/format-numbers.js", 554);
var whole = match.shift();
    _yuitest_coverline("build/format-numbers/format-numbers.js", 555);
if (whole.length < this._parent._minIntDigits) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 556);
whole = zeroPad(whole, this._parent._minIntDigits, this._parent.Formats.numberZero);
    }
    _yuitest_coverline("build/format-numbers/format-numbers.js", 558);
if (whole.length > this._parent._primaryGrouping && this._parent._useGrouping) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 559);
var a = [];
	    
        _yuitest_coverline("build/format-numbers/format-numbers.js", 561);
var offset = this._parent._primaryGrouping;
        _yuitest_coverline("build/format-numbers/format-numbers.js", 562);
var i = whole.length - offset;
        _yuitest_coverline("build/format-numbers/format-numbers.js", 563);
while (i > 0) {
            _yuitest_coverline("build/format-numbers/format-numbers.js", 564);
a.unshift(whole.substr(i, offset));
            _yuitest_coverline("build/format-numbers/format-numbers.js", 565);
a.unshift(this._parent.Formats.groupingSeparator);
            _yuitest_coverline("build/format-numbers/format-numbers.js", 566);
offset = this._parent._secondaryGrouping;
            _yuitest_coverline("build/format-numbers/format-numbers.js", 567);
i -= offset;
        }
        _yuitest_coverline("build/format-numbers/format-numbers.js", 569);
a.unshift(whole.substring(0, i + offset));
		
        _yuitest_coverline("build/format-numbers/format-numbers.js", 571);
whole = a.join("");
    }
	
    // normalize rest
    _yuitest_coverline("build/format-numbers/format-numbers.js", 575);
var fract = '0';
    _yuitest_coverline("build/format-numbers/format-numbers.js", 576);
var expon;
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 578);
if(s.match(/\./))
        {_yuitest_coverline("build/format-numbers/format-numbers.js", 579);
fract = match.shift();}
    else {_yuitest_coverline("build/format-numbers/format-numbers.js", 580);
if(s.match(/\e/) || s.match(/\E/))
        {_yuitest_coverline("build/format-numbers/format-numbers.js", 581);
expon = match.shift();}}

    _yuitest_coverline("build/format-numbers/format-numbers.js", 583);
fract = fract.replace(/0+$/,"");
    _yuitest_coverline("build/format-numbers/format-numbers.js", 584);
if (fract.length < this._parent._minFracDigits) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 585);
fract = zeroPad(fract, this._parent._minFracDigits, this._parent.Formats.numberZero, true);
    }
	
    _yuitest_coverline("build/format-numbers/format-numbers.js", 588);
a = [ whole ];
    _yuitest_coverline("build/format-numbers/format-numbers.js", 589);
if (fract.length > 0) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 590);
var decimal = this._parent.Formats.decimalSeparator;
        _yuitest_coverline("build/format-numbers/format-numbers.js", 591);
a.push(decimal, fract);
    }
    _yuitest_coverline("build/format-numbers/format-numbers.js", 593);
if (expon) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 594);
a.push(exponSymbol, expon.replace(/^\+/,""));
    }
	
    // return normalize result
    _yuitest_coverline("build/format-numbers/format-numbers.js", 598);
return a.join("");
}
    
_yuitest_coverline("build/format-numbers/format-numbers.js", 601);
NumberFormat.NumberSegment.prototype.parse = function(object, s, index) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "parse", 601);
_yuitest_coverline("build/format-numbers/format-numbers.js", 602);
var comma = this._parent.Formats.groupingSeparator;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 603);
var dot = this._parent.Formats.decimalSeparator;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 604);
var minusSign = this._parent.Formats.minusSign;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 605);
var expon = this._parent.Formats.exponentialSymbol;
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 607);
var numberRegexPattern = "[\\" + minusSign + "0-9" + comma + "]+";
    _yuitest_coverline("build/format-numbers/format-numbers.js", 608);
if(!this._parent._parseIntegerOnly) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 609);
numberRegexPattern += "(\\" + dot + "[0-9]+)?";
    }
    _yuitest_coverline("build/format-numbers/format-numbers.js", 611);
if(this._parent._showExponent) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 612);
numberRegexPattern += "(" + expon +"\\+?[0-9]+)";
    }
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 615);
var numberRegex = new RegExp(numberRegexPattern);
    _yuitest_coverline("build/format-numbers/format-numbers.js", 616);
var matches = s.match(numberRegex);
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 618);
if(!matches) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 619);
throw new Format.ParsingException("Number does not match pattern");
    }
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 622);
var negativeNum = s.indexOf(minusSign) != -1;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 623);
var endIndex = index + matches[0].length;
    _yuitest_coverline("build/format-numbers/format-numbers.js", 624);
s = s.slice(index, endIndex);
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 626);
var scientific = null;
        
    //Scientific format does not use grouping
    _yuitest_coverline("build/format-numbers/format-numbers.js", 629);
if(this._parent.showExponent) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 630);
scientific = s.split(expon);
    } else {_yuitest_coverline("build/format-numbers/format-numbers.js", 631);
if(this._parent._useGrouping) {
        //Verify grouping data exists
        _yuitest_coverline("build/format-numbers/format-numbers.js", 633);
if(!this._parent._primaryGrouping) {
            //Should not happen
            _yuitest_coverline("build/format-numbers/format-numbers.js", 635);
throw new Format.ParsingException("Invalid pattern");
        }
            
        //Verify grouping is correct
        _yuitest_coverline("build/format-numbers/format-numbers.js", 639);
var i = s.length - this._parent._primaryGrouping - 1;
            
        _yuitest_coverline("build/format-numbers/format-numbers.js", 641);
if(matches[1]) {
            //If there is a decimal part, ignore that. Grouping assumed to apply only to whole number part
            _yuitest_coverline("build/format-numbers/format-numbers.js", 643);
i = i - matches[1].length;
        }
            
        //Use primary grouping for first group
        _yuitest_coverline("build/format-numbers/format-numbers.js", 647);
if(i > 0) {
            //There should be a comma at i
            _yuitest_coverline("build/format-numbers/format-numbers.js", 649);
if(s.charAt(i) != ',') {
                _yuitest_coverline("build/format-numbers/format-numbers.js", 650);
throw new Format.ParsingException("Number does not match pattern");
            }
                
            //Remove comma
            _yuitest_coverline("build/format-numbers/format-numbers.js", 654);
s = s.slice(0, i) + s.slice(i+1);
        }
            
        //If more groups, use primary/secondary grouping as applicable
        _yuitest_coverline("build/format-numbers/format-numbers.js", 658);
var grouping = this._parent._secondaryGrouping || this._parent._primaryGrouping;
        _yuitest_coverline("build/format-numbers/format-numbers.js", 659);
i = i - grouping - 1;
            
        _yuitest_coverline("build/format-numbers/format-numbers.js", 661);
while(i > 0) {
            //There should be a comma at i
            _yuitest_coverline("build/format-numbers/format-numbers.js", 663);
if(s.charAt(i) != ',') {
                _yuitest_coverline("build/format-numbers/format-numbers.js", 664);
throw new Format.ParsingException("Number does not match pattern");
            }
                
            //Remove comma
            _yuitest_coverline("build/format-numbers/format-numbers.js", 668);
s = s.slice(0, i) + s.slice(i+1);
            _yuitest_coverline("build/format-numbers/format-numbers.js", 669);
i = i - grouping - 1;
        }
            
        //Verify there are no more grouping separators
        _yuitest_coverline("build/format-numbers/format-numbers.js", 673);
if(s.indexOf(comma) != -1) {
            _yuitest_coverline("build/format-numbers/format-numbers.js", 674);
throw new Format.ParsingException("Number does not match pattern");
        }
    }}
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 678);
if(scientific) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 679);
object.value = parseFloat(scientific[0], 10) * Math.pow(10, parseFloat(scientific[1], 10));
    } else {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 681);
object.value = parseFloat(s, 10);
    }
        
    //Special types
    _yuitest_coverline("build/format-numbers/format-numbers.js", 685);
if(negativeNum) {object.value *= -1;}
    _yuitest_coverline("build/format-numbers/format-numbers.js", 686);
if (this._parent._isPercent) {object.value /= 100;}
    else {_yuitest_coverline("build/format-numbers/format-numbers.js", 687);
if (this._parent._isPerMille) {object.value /= 1000;}}
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 689);
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
_yuitest_coverline("build/format-numbers/format-numbers.js", 702);
Y.NumberFormat = function(style) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "NumberFormat", 702);
_yuitest_coverline("build/format-numbers/format-numbers.js", 703);
style = style || Y.NumberFormat.STYLES.NUMBER_STYLE;
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 705);
var pattern = "";
    _yuitest_coverline("build/format-numbers/format-numbers.js", 706);
var formats = Y.Intl.get(MODULE_NAME);
    _yuitest_coverline("build/format-numbers/format-numbers.js", 707);
switch(style) {
        case Y.NumberFormat.STYLES.CURRENCY_STYLE:
            _yuitest_coverline("build/format-numbers/format-numbers.js", 709);
pattern = formats.currencyFormat;
            _yuitest_coverline("build/format-numbers/format-numbers.js", 710);
break;
        case Y.NumberFormat.STYLES.ISO_CURRENCY_STYLE:
            _yuitest_coverline("build/format-numbers/format-numbers.js", 712);
pattern = formats.currencyFormat;
            _yuitest_coverline("build/format-numbers/format-numbers.js", 713);
pattern = pattern.replace("\u00a4", "\u00a4\u00a4");
            _yuitest_coverline("build/format-numbers/format-numbers.js", 714);
break;
        case Y.NumberFormat.STYLES.NUMBER_STYLE:
            _yuitest_coverline("build/format-numbers/format-numbers.js", 716);
pattern = formats.decimalFormat;
            _yuitest_coverline("build/format-numbers/format-numbers.js", 717);
break;
        case Y.NumberFormat.STYLES.PERCENT_STYLE:
            _yuitest_coverline("build/format-numbers/format-numbers.js", 719);
pattern = formats.percentFormat;
            _yuitest_coverline("build/format-numbers/format-numbers.js", 720);
break;
        case Y.NumberFormat.STYLES.PLURAL_CURRENCY_STYLE:
            //This is like <value> <currency>. This may be dependent on whether the value is singular or plural. Will be handled during formatting
            _yuitest_coverline("build/format-numbers/format-numbers.js", 723);
pattern = "{plural_style}";
            _yuitest_coverline("build/format-numbers/format-numbers.js", 724);
break;
        case Y.NumberFormat.STYLES.SCIENTIFIC_STYLE:
            _yuitest_coverline("build/format-numbers/format-numbers.js", 726);
pattern = formats.scientificFormat;
            _yuitest_coverline("build/format-numbers/format-numbers.js", 727);
break;
    }
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 730);
this._numberFormatInstance = new NumberFormat(pattern, formats);
}
    
_yuitest_coverline("build/format-numbers/format-numbers.js", 733);
Y.NumberFormat.STYLES = {
    CURRENCY_STYLE: 1,
    ISO_CURRENCY_STYLE: 2,
    NUMBER_STYLE: 4,
    PERCENT_STYLE: 8,
    PLURAL_CURRENCY_STYLE: 16,
    SCIENTIFIC_STYLE: 32
}
    
//Exceptions
    
_yuitest_coverline("build/format-numbers/format-numbers.js", 744);
Y.NumberFormat.UnknownStyleException = function(message) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "UnknownStyleException", 744);
_yuitest_coverline("build/format-numbers/format-numbers.js", 745);
this.message = message;
}
_yuitest_coverline("build/format-numbers/format-numbers.js", 747);
Y.NumberFormat.UnknownStyleException.prototype.toString = function() {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "toString", 747);
_yuitest_coverline("build/format-numbers/format-numbers.js", 748);
return "UnknownStyleException: " + this.message;
}
    
//Static methods
    
/**
 * Create an instance of NumberFormat 
 * @param {Number} style (Optional) the given style
 */    
_yuitest_coverline("build/format-numbers/format-numbers.js", 757);
Y.NumberFormat.createInstance = function(style) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "createInstance", 757);
_yuitest_coverline("build/format-numbers/format-numbers.js", 758);
return new Y.NumberFormat(style);
}

/**
 * Returns an array of BCP 47 language tags for the languages supported by this class
 * @return {Array} an array of BCP 47 language tags for the languages supported by this class.
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 765);
Y.NumberFormat.getAvailableLocales = function() {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "getAvailableLocales", 765);
_yuitest_coverline("build/format-numbers/format-numbers.js", 766);
return Y.Intl.getAvailableLangs(MODULE_NAME);
}
    
//Public methods
    
/**
 * Format a number to product a String.
 * @param {Number} number the number to format
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 775);
Y.NumberFormat.prototype.format = function(number) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "format", 775);
_yuitest_coverline("build/format-numbers/format-numbers.js", 776);
return this._numberFormatInstance.format(number);
}
    
/**
 * Gets the currency used to display currency amounts. This may be an empty string for some cases. 
 * @return {String} a 3-letter ISO code indicating the currency in use, or an empty string.
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 783);
Y.NumberFormat.prototype.getCurrency = function() {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "getCurrency", 783);
_yuitest_coverline("build/format-numbers/format-numbers.js", 784);
return this._numberFormatInstance.currency;
}
    
/**
 * Returns the maximum number of digits allowed in the fraction portion of a number. 
 * @return {Number} the maximum number of digits allowed in the fraction portion of a number.
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 791);
Y.NumberFormat.prototype.getMaximumFractionDigits = function() {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "getMaximumFractionDigits", 791);
_yuitest_coverline("build/format-numbers/format-numbers.js", 792);
return this._numberFormatInstance._maxFracDigits || 0;
}
    
/**
 * Returns the maximum number of digits allowed in the integer portion of a number. 
 * @return {Number} the maximum number of digits allowed in the integer portion of a number.
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 799);
Y.NumberFormat.prototype.getMaximumIntegerDigits = function() {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "getMaximumIntegerDigits", 799);
_yuitest_coverline("build/format-numbers/format-numbers.js", 800);
return this._numberFormatInstance._maxIntDigits || 0;
}
    
/**
 * Returns the minimum number of digits allowed in the fraction portion of a number. 
 * @return {Number} the minimum number of digits allowed in the fraction portion of a number.
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 807);
Y.NumberFormat.prototype.getMinimumFractionDigits = function() {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "getMinimumFractionDigits", 807);
_yuitest_coverline("build/format-numbers/format-numbers.js", 808);
return this._numberFormatInstance._minFracDigits || 0;
}
    
/**
 * Returns the minimum number of digits allowed in the integer portion of a number.
 * @return {Number} the minimum number of digits allowed in the integer portion of a number.
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 815);
Y.NumberFormat.prototype.getMinimumIntegerDigits = function() {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "getMinimumIntegerDigits", 815);
_yuitest_coverline("build/format-numbers/format-numbers.js", 816);
return this._numberFormatInstance._minIntDigits || 0;
}
    
/**
 * Returns true if grouping is used in this format.
 * For example, in the English locale, with grouping on, the number 1234567 might be formatted as "1,234,567".
 * The grouping separator as well as the size of each group is locale dependant.
 * @return {Boolean}
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 825);
Y.NumberFormat.prototype.isGroupingUsed = function() {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "isGroupingUsed", 825);
_yuitest_coverline("build/format-numbers/format-numbers.js", 826);
return this._numberFormatInstance._useGrouping;
}
    
/**
 * Return true if this format will parse numbers as integers only.
 * For example in the English locale, with ParseIntegerOnly true, the string "1234." would be parsed as the integer value 1234
 * and parsing would stop at the "." character. Of course, the exact format accepted by the parse operation is locale dependant.
 * @return {Boolean}
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 835);
Y.NumberFormat.prototype.isParseIntegerOnly = function() {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "isParseIntegerOnly", 835);
_yuitest_coverline("build/format-numbers/format-numbers.js", 836);
return this._numberFormatInstance._parseIntegerOnly;
}
    
/**
 * Parse the string to get a number
 * @param {String} txt The string to parse
 * @param {Number} pp (Optional) Parse position. The position to start parsing at. Defaults to 0
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 844);
Y.NumberFormat.prototype.parse = function(txt, pp) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "parse", 844);
_yuitest_coverline("build/format-numbers/format-numbers.js", 845);
return this._numberFormatInstance.parse(txt, pp);
}
    
/**
 * Sets the currency used to display currency amounts.
 * This takes effect immediately, if this format is a currency format.
 * If this format is not a currency format, then the currency is used if and when this object becomes a currency format.
 * @param {String} currency a 3-letter ISO code indicating new currency to use. May be the empty string to indicate no currency.
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 854);
Y.NumberFormat.prototype.setCurrency = function(currency) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "setCurrency", 854);
_yuitest_coverline("build/format-numbers/format-numbers.js", 855);
this._numberFormatInstance.currency = currency;
}
    
/**
 * Set whether or not grouping will be used in this format. 
 * @param {Boolean} value
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 862);
Y.NumberFormat.prototype.setGroupingUsed = function(value) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "setGroupingUsed", 862);
_yuitest_coverline("build/format-numbers/format-numbers.js", 863);
this._numberFormatInstance._useGrouping = value;
}
    
/**
 * Sets the maximum number of digits allowed in the fraction portion of a number.
 * maximumFractionDigits must be >= minimumFractionDigits.
 * If the new value for maximumFractionDigits is less than the current value of minimumFractionDigits,
 * then minimumFractionDigits will also be set to the new value. 
 * @param {Number} newValue the new value to be set.
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 873);
Y.NumberFormat.prototype.setMaximumFractionDigits = function(newValue) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "setMaximumFractionDigits", 873);
_yuitest_coverline("build/format-numbers/format-numbers.js", 874);
this._numberFormatInstance._maxFracDigits = newValue;
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 876);
if(this.getMinimumFractionDigits() > newValue) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 877);
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
_yuitest_coverline("build/format-numbers/format-numbers.js", 888);
Y.NumberFormat.prototype.setMaximumIntegerDigits = function(newValue) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "setMaximumIntegerDigits", 888);
_yuitest_coverline("build/format-numbers/format-numbers.js", 889);
this._numberFormatInstance._maxIntDigits = newValue;
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 891);
if(this.getMinimumIntegerDigits() > newValue) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 892);
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
_yuitest_coverline("build/format-numbers/format-numbers.js", 903);
Y.NumberFormat.prototype.setMinimumFractionDigits = function(newValue) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "setMinimumFractionDigits", 903);
_yuitest_coverline("build/format-numbers/format-numbers.js", 904);
this._numberFormatInstance._minFracDigits = newValue;
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 906);
if(this.getMaximumFractionDigits() < newValue) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 907);
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
_yuitest_coverline("build/format-numbers/format-numbers.js", 918);
Y.NumberFormat.prototype.setMinimumIntegerDigits = function(newValue) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "setMinimumIntegerDigits", 918);
_yuitest_coverline("build/format-numbers/format-numbers.js", 919);
this._numberFormatInstance._minIntDigits = newValue;
        
    _yuitest_coverline("build/format-numbers/format-numbers.js", 921);
if(this.getMaximumIntegerDigits() < newValue) {
        _yuitest_coverline("build/format-numbers/format-numbers.js", 922);
this.setMaximumIntegerDigits(newValue);
    }
}
    
/**
 * Sets whether or not numbers should be parsed as integers only. 
 * @param {Boolean} newValue set True, this format will parse numbers as integers only.
 */
_yuitest_coverline("build/format-numbers/format-numbers.js", 930);
Y.NumberFormat.prototype.setParseIntegerOnly = function(newValue) {
    _yuitest_coverfunc("build/format-numbers/format-numbers.js", "setParseIntegerOnly", 930);
_yuitest_coverline("build/format-numbers/format-numbers.js", 931);
this._numberFormatInstance._parseIntegerOnly = newValue;
}


}, '@VERSION@', {"lang": ["af-NA", "af", "af-ZA", "am-ET", "am", "ar-AE", "ar-BH", "ar-DZ", "ar-EG", "ar-IQ", "ar-JO", "ar-KW", "ar-LB", "ar-LY", "ar-MA", "ar-OM", "ar-QA", "ar-SA", "ar-SD", "ar-SY", "ar-TN", "ar", "ar-YE", "as-IN", "as", "az-AZ", "az-Cyrl-AZ", "az-Cyrl", "az-Latn-AZ", "az-Latn", "az", "be-BY", "be", "bg-BG", "bg", "bn-BD", "bn-IN", "bn", "bo-CN", "bo-IN", "bo", "ca-ES", "ca", "cs-CZ", "cs", "cy-GB", "cy", "da-DK", "da", "de-AT", "de-BE", "de-CH", "de-DE", "de-LI", "de-LU", "de", "el-CY", "el-GR", "el", "en-AU", "en-BE", "en-BW", "en-BZ", "en-CA", "en-GB", "en-HK", "en-IE", "en-IN", "en-JM", "en-JO", "en-MH", "en-MT", "en-MY", "en-NA", "en-NZ", "en-PH", "en-PK", "en-RH", "en-SG", "en-TT", "en", "en-US-POSIX", "en-US", "en-VI", "en-ZA", "en-ZW", "eo", "es-AR", "es-BO", "es-CL", "es-CO", "es-CR", "es-DO", "es-EC", "es-ES", "es-GT", "es-HN", "es-MX", "es-NI", "es-PA", "es-PE", "es-PR", "es-PY", "es-SV", "es", "es-US", "es-UY", "es-VE", "et-EE", "et", "eu-ES", "eu", "fa-AF", "fa-IR", "fa", "fi-FI", "fi", "fil-PH", "fil", "fo-FO", "fo", "fr-BE", "fr-CA", "fr-CH", "fr-FR", "fr-LU", "fr-MC", "fr-SN", "fr", "ga-IE", "ga", "gl-ES", "gl", "gsw-CH", "gsw", "gu-IN", "gu", "gv-GB", "gv", "ha-GH", "ha-Latn-GH", "ha-Latn-NE", "ha-Latn-NG", "ha-Latn", "ha-NE", "ha-NG", "ha", "haw", "haw-US", "he-IL", "he", "hi-IN", "hi", "hr-HR", "hr", "hu-HU", "hu", "hy-AM-REVISED", "hy-AM", "hy", "id-ID", "id", "ii-CN", "ii", "in-ID", "in", "is-IS", "is", "it-CH", "it-IT", "it", "iw-IL", "iw", "ja-JP-TRADITIONAL", "ja-JP", "ja", "ka-GE", "ka", "kk-Cyrl-KZ", "kk-Cyrl", "kk-KZ", "kk", "kl-GL", "kl", "km-KH", "km", "kn-IN", "kn", "kok-IN", "kok", "ko-KR", "ko", "kw-GB", "kw", "lt-LT", "lt", "lv-LV", "lv", "mk-MK", "mk", "ml-IN", "ml", "mr-IN", "mr", "ms-BN", "ms-MY", "ms", "mt-MT", "mt", "nb-NO", "nb", "ne-IN", "ne-NP", "ne", "nl-BE", "nl-NL", "nl", "nn-NO", "nn", "no-NO-NY", "no-NO", "no", "om-ET", "om-KE", "om", "or-IN", "or", "pa-Arab-PK", "pa-Arab", "pa-Guru-IN", "pa-Guru", "pa-IN", "pa-PK", "pa", "pl-PL", "pl", "ps-AF", "ps", "pt-BR", "pt-PT", "pt", "ro-MD", "ro-RO", "ro", "ru-RU", "ru", "ru-UA", "sh-BA", "sh-CS", "sh", "sh-YU", "si-LK", "si", "sk-SK", "sk", "sl-SI", "sl", "so-DJ", "so-ET", "so-KE", "so-SO", "so", "sq-AL", "sq", "sr-BA", "sr-CS", "sr-Cyrl-BA", "sr-Cyrl-CS", "sr-Cyrl-ME", "sr-Cyrl-RS", "sr-Cyrl", "sr-Cyrl-YU", "sr-Latn-BA", "sr-Latn-CS", "sr-Latn-ME", "sr-Latn-RS", "sr-Latn", "sr-Latn-YU", "sr-ME", "sr-RS", "sr", "sr-YU", "sv-FI", "sv-SE", "sv", "sw-KE", "sw", "sw-TZ", "ta-IN", "ta", "te-IN", "te", "th-TH-TRADITIONAL", "th-TH", "th", "ti-ER", "ti-ET", "ti", "tl-PH", "tl", "tr-TR", "tr", "uk", "uk-UA", "ur-IN", "ur-PK", "ur", "uz-AF", "uz-Arab-AF", "uz-Arab", "uz-Cyrl", "uz-Cyrl-UZ", "uz-Latn", "uz-Latn-UZ", "uz", "uz-UZ", "vi", "vi-VN", "zh-CN", "zh-Hans-CN", "zh-Hans-HK", "zh-Hans-MO", "zh-Hans-SG", "zh-Hans", "zh-Hant-HK", "zh-Hant-MO", "zh-Hant-TW", "zh-Hant", "zh-HK", "zh-MO", "zh-SG", "zh-TW", "zh", "zu", "zu-ZA"]});
