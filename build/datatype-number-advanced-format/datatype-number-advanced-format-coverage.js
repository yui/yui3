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
_yuitest_coverage["build/datatype-number-advanced-format/datatype-number-advanced-format.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/datatype-number-advanced-format/datatype-number-advanced-format.js",
    code: []
};
_yuitest_coverage["build/datatype-number-advanced-format/datatype-number-advanced-format.js"].code=["YUI.add('datatype-number-advanced-format', function (Y, NAME) {","","/*"," * Copyright 2012 Yahoo! Inc. All Rights Reserved. Based on code owned by VMWare, Inc. "," */","","//","// Format class","//","","/**"," * Base class for all formats. To format an object, instantiate the"," * format of your choice and call the <code>format</code> method which"," * returns the formatted string."," */","Format = function(pattern, formats) {","    if (arguments.length == 0) {","        return;","    }","    this._pattern = pattern;","    this._segments = []; ","    this.Formats = formats; ","}","","// Data","","Format.prototype._pattern = null;","Format.prototype._segments = null;","","//Exceptions","","Y.mix(Format, {","    Exception: function(name, message) {","        this.name = name;","        this.message = message;","        this.toString = function() {","            return this.name + \": \" + this.message;","        }","    },","    ParsingException: function(message) {","        Format.ParsingException.superclass.constructor.call(this, \"ParsingException\", message);","    },","    IllegalArgumentsException: function(message) {","        Format.IllegalArgumentsException.superclass.constructor.call(this, \"IllegalArgumentsException\", message);","    },","    FormatException: function(message) {","        Format.FormatException.superclass.constructor.call(this, \"FormatException\", message);","    }","});","","Y.extend(Format.ParsingException, Format.Exception);","Y.extend(Format.IllegalArgumentsException, Format.Exception);","Y.extend(Format.FormatException, Format.Exception);","","// Public methods","","Format.prototype.format = function(object) { ","    var s = [];","        ","    for (var i = 0; i < this._segments.length; i++) {","        s.push(this._segments[i].format(object));","    }","    return s.join(\"\");","};","","// Protected static methods","","function zeroPad (s, length, zeroChar, rightSide) {","    s = typeof s == \"string\" ? s : String(s);","","    if (s.length >= length) return s;","","    zeroChar = zeroChar || '0';","	","    var a = [];","    for (var i = s.length; i < length; i++) {","        a.push(zeroChar);","    }","    a[rightSide ? \"unshift\" : \"push\"](s);","","    return a.join(\"\");","}","    ","/** "," * Parses the given string according to this format's pattern and returns"," * an object."," * <p>"," * <strong>Note:</strong>"," * The default implementation of this method assumes that the sub-class"," * has implemented the <code>_createParseObject</code> method."," */","Format.prototype.parse = function(s, pp) {","    var object = this._createParseObject();","    var index = pp || 0;","    for (var i = 0; i < this._segments.length; i++) {","        var segment = this._segments[i];","        index = segment.parse(object, s, index);","    }","        ","    if (index < s.length) {","        throw new Format.ParsingException(\"Input too long\");","    }","    return object;","};","    ","/**"," * Creates the object that is initialized by parsing"," * <p>"," * <strong>Note:</strong>"," * This must be implemented by sub-classes."," */","Format.prototype._createParseObject = function(s) {","    throw new Format.ParsingException(\"Not implemented\");","};","","//","// Segment class","//","","Format.Segment = function(format, s) {","    if (arguments.length == 0) return;","    this._parent = format;","    this._s = s;","};","    ","// Public methods","","Format.Segment.prototype.format = function(o) { ","    return this._s; ","};","","/**"," * Parses the string at the given index, initializes the parse object"," * (as appropriate), and returns the new index within the string for"," * the next parsing step."," * <p>"," * <strong>Note:</strong>"," * This method must be implemented by sub-classes."," *"," * @param o     [object] The parse object to be initialized."," * @param s     [string] The input string to be parsed."," * @param index [number] The index within the string to start parsing."," */","Format.Segment.prototype.parse = function(o, s, index) {","    throw new Format.ParsingException(\"Not implemented\");","};","","Format.Segment.prototype.getFormat = function() {","    return this._parent;","};","","Format.Segment._parseLiteral = function(literal, s, index) {","    if (s.length - index < literal.length) {","        throw new Format.ParsingException(\"Input too short\");","    }","    for (var i = 0; i < literal.length; i++) {","        if (literal.charAt(i) != s.charAt(index + i)) {","            throw new Format.ParsingException(\"Input doesn't match\");","        }","    }","    return index + literal.length;","};","    ","/**"," * Parses an integer at the offset of the given string and calls a"," * method on the specified object."," *"," * @param o         [object]   The target object."," * @param f         [function|string] The method to call on the target object."," *                             If this parameter is a string, then it is used"," *                             as the name of the property to set on the"," *                             target object."," * @param adjust    [number]   The numeric adjustment to make on the"," *                             value before calling the object method."," * @param s         [string]   The string to parse."," * @param index     [number]   The index within the string to start parsing."," * @param fixedlen  [number]   If specified, specifies the required number"," *                             of digits to be parsed."," * @param radix     [number]   Optional. Specifies the radix of the parse"," *                             string. Defaults to 10 if not specified."," */","Format.Segment._parseInt = function(o, f, adjust, s, index, fixedlen, radix) {","    var len = fixedlen || s.length - index;","    var head = index;","    for (var i = 0; i < len; i++) {","        if (!s.charAt(index++).match(/\\d/)) {","            index--;","            break;","        }","    }","    var tail = index;","    if (head == tail) {","        throw new Format.ParsingException(\"Number not present\");","    }","    if (fixedlen && tail - head != fixedlen) {","        throw new Format.ParsingException(\"Number too short\");","    }","    var value = parseInt(s.substring(head, tail), radix || 10);","    if (f) {","        var target = o || window;","        if (typeof f == \"function\") {","            f.call(target, value + adjust);","        }","        else {","            target[f] = value + adjust;","        }","    }","    return tail;","};","","//","// Text segment class","//","","Format.TextSegment = function(format, s) {","    if (arguments.length == 0) return;","    Format.TextSegment.superclass.constructor.call(this, format, s);","};","","Y.extend(Format.TextSegment, Format.Segment);","","Format.TextSegment.prototype.toString = function() { ","    return \"text: \\\"\"+this._s+'\"'; ","};","    ","Format.TextSegment.prototype.parse = function(o, s, index) {","    return Format.Segment._parseLiteral(this._s, s, index);","};","","if(String.prototype.trim == null) {","    String.prototype.trim = function() {","        return this.replace(/^\\s+/, '').replace(/\\s+$/, '');","    };","}","/**"," * NumberFormat helps you to format and parse numbers for any locale."," * Your code can be completely independent of the locale conventions for decimal points, thousands-separators,"," * or even the particular decimal digits used, or whether the number format is even decimal."," * "," * This module uses parts of zimbra NumberFormat"," * "," * @module format-numbers"," * @requires format-base"," */","","/**"," * @param pattern       The number pattern."," * @param formats       locale data"," * @param skipNegFormat Specifies whether to skip the generation of this"," *                      format's negative value formatter."," *                      <p>"," *                      <strong>Note:</strong> "," *                      This parameter is only used by the implementation "," *                      and should not be passed by application code "," *                      instantiating a custom number format."," */","","var MODULE_NAME = \"datatype-number-advanced-format\";","","NumberFormat = function(pattern, formats, skipNegFormat) {","    if (arguments.length == 0) {","        return;","    }","","    NumberFormat.superclass.constructor.call(this, pattern, formats);","    if (!pattern) {","        return;","    }","","    if(pattern == \"{plural_style}\") {","        pattern = this.Formats.decimalFormat;","        this._isPluralCurrency = true;","        this._pattern = pattern;","    }","","    //Default currency","    this.currency = this.Formats.defaultCurrency;","    if(this.currency == null || this.currency == \"\") {","        this.currency = \"USD\";","    }","        ","    var patterns = pattern.split(/;/);","    pattern = patterns[0];","	","    this._useGrouping = (pattern.indexOf(\",\") != -1);      //Will be set to true if pattern uses grouping","    this._parseIntegerOnly = (pattern.indexOf(\".\") == -1);  //Will be set to false if pattern contains fractional parts","        ","    //If grouping is used, find primary and secondary grouping","    if(this._useGrouping) {","        var numberPattern = pattern.match(/[0#,]+/);","        var groupingRegex = new RegExp(\"[0#]+\", \"g\");","        var groups = numberPattern[0].match(groupingRegex);","            ","        var i = groups.length - 2;","        this._primaryGrouping = groups[i+1].length;","        this._secondaryGrouping = (i > 0 ? groups[i].length : groups[i+1].length);","    }","        ","    // parse prefix","    i = 0;","        ","    var results = this.__parseStatic(pattern, i);","    i = results.offset;","    var hasPrefix = results.text != \"\";","    if (hasPrefix) {","        this._segments.push(new Format.TextSegment(this, results.text));","    }","	","    // parse number descriptor","    var start = i;","    while (i < pattern.length &&","        NumberFormat._META_CHARS.indexOf(pattern.charAt(i)) != -1) {","        i++;","    }","    var end = i;","","    var numPattern = pattern.substring(start, end);","    var e = numPattern.indexOf(this.Formats.exponentialSymbol);","    var expon = e != -1 ? numPattern.substring(e + 1) : null;","    if (expon) {","        numPattern = numPattern.substring(0, e);","        this._showExponent = true;","    }","	","    var dot = numPattern.indexOf('.');","    var whole = dot != -1 ? numPattern.substring(0, dot) : numPattern;","    if (whole) {","        /*var comma = whole.lastIndexOf(',');","            if (comma != -1) {","                this._groupingOffset = whole.length - comma - 1;","            }*/","        whole = whole.replace(/[^#0]/g,\"\");","        var zero = whole.indexOf('0');","        if (zero != -1) {","            this._minIntDigits = whole.length - zero;","        }","        this._maxIntDigits = whole.length;","    }","	","    var fract = dot != -1 ? numPattern.substring(dot + 1) : null;","    if (fract) {","        zero = fract.lastIndexOf('0');","        if (zero != -1) {","            this._minFracDigits = zero + 1;","        }","        this._maxFracDigits = fract.replace(/[^#0]/g,\"\").length;","    }","	","    this._segments.push(new NumberFormat.NumberSegment(this, numPattern));","	","    // parse suffix","    results = this.__parseStatic(pattern, i);","    i = results.offset;","    if (results.text != \"\") {","        this._segments.push(new Format.TextSegment(this, results.text));","    }","	","    // add negative formatter","    if (skipNegFormat) return;","	","    if (patterns.length > 1) {","        pattern = patterns[1];","        this._negativeFormatter = new NumberFormat(pattern, formats, true);","    }","    else {","        // no negative pattern; insert minus sign before number segment","        var formatter = new NumberFormat(\"\", formats);","        formatter._segments = formatter._segments.concat(this._segments);","","        var index = hasPrefix ? 1 : 0;","        var minus = new Format.TextSegment(formatter, this.Formats.minusSign);","        formatter._segments.splice(index, 0, minus);","		","        this._negativeFormatter = formatter;","    }","}","","Y.extend(NumberFormat, Format);","    ","// Constants","","Y.mix(NumberFormat, {","    _NUMBER: \"number\",","    _INTEGER: \"integer\",","    _CURRENCY: \"currency\",","    _PERCENT: \"percent\",","","    _META_CHARS: \"0#.,E\"","});","","// Data","","NumberFormat.prototype._groupingOffset = Number.MAX_VALUE;","//NumberFormat.prototype._maxIntDigits;","NumberFormat.prototype._minIntDigits = 1;","//NumberFormat.prototype._maxFracDigits;","//NumberFormat.prototype._minFracDigits;","NumberFormat.prototype._isCurrency = false;","NumberFormat.prototype._isPercent = false;","NumberFormat.prototype._isPerMille = false;","NumberFormat.prototype._showExponent = false;","//NumberFormat.prototype._negativeFormatter;","","// Public methods","","NumberFormat.prototype.format = function(number) {","    if (number < 0 && this._negativeFormatter) {","        return this._negativeFormatter.format(number);","    }","        ","    var result = Format.prototype.format.call(this, number);","        ","    if(this._isPluralCurrency) {","        var pattern = \"\";","        if(number == 1) {","            //Singular","            pattern = this.Formats.currencyPatternSingular;","            pattern = pattern.replace(\"{1}\", this.Formats[this.currency + \"_currencySingular\"]);","        } else {","            //Plural","            pattern = this.Formats.currencyPatternPlural;","            pattern = pattern.replace(\"{1}\", this.Formats[this.currency + \"_currencyPlural\"]);","        }","            ","        result = pattern.replace(\"{0}\", result);","    }","        ","    return result;","};","    ","NumberFormat.prototype.parse = function(s, pp) {","    if(s.indexOf(this.Formats.minusSign) != -1 && this._negativeFormatter) {","        return this._negativeFormatter.parse(s, pp);","    }","        ","    if(this._isPluralCurrency) {","        var singular = this.Formats[this.currency + \"_currencySingular\"];","        var plural = this.Formats[this.currency + \"_currencyPlural\"];","            ","        s = s.replace(plural, \"\").replace(singular, \"\").trim();","    }","        ","    var object = null;","    try {","        object = Format.prototype.parse.call(this, s, pp);","        object = object.value;","    } catch(e) {","    }","        ","    return object;","}","","// Private methods","","NumberFormat.prototype.__parseStatic = function(s, i) {","    var data = [];","    while (i < s.length) {","        var c = s.charAt(i++);","        if (NumberFormat._META_CHARS.indexOf(c) != -1) {","            i--;","            break;","        }","        switch (c) {","            case \"'\": {","                var start = i;","                while (i < s.length && s.charAt(i++) != \"'\") {","                // do nothing","                }","                var end = i;","                c = end - start == 0 ? \"'\" : s.substring(start, end);","                break;","            }","            case '%': {","                c = this.Formats.percentSign; ","                this._isPercent = true;","                break;","            }","            case '\\u2030': {","                c = this.Formats.perMilleSign; ","                this._isPerMille = true;","                break;","            }","            case '\\u00a4': {","                if(s.charAt(i) == '\\u00a4') {","                    c = this.Formats[this.currency + \"_currencyISO\"];","                    i++;","                } else {","                    c = this.Formats[this.currency + \"_currencySymbol\"];","                }","                this._isCurrency = true;","                break;","            }","        }","        data.push(c);","    }","    return {","        text: data.join(\"\"), ","        offset: i","    };","};","    ","NumberFormat.prototype._createParseObject = function() {","    return {","        value: null","    };","};","    ","//","// NumberFormat.NumberSegment class","//","","NumberFormat.NumberSegment = function(format, s) {","    if (arguments.length == 0) return;","    NumberFormat.NumberSegment.superclass.constructor.call(this, format, s);","};","Y.extend(NumberFormat.NumberSegment, Format.Segment);","    ","// Public methods","","NumberFormat.NumberSegment.prototype.format = function(number) {","    // special values","    if (isNaN(number)) return this._parent.Formats.nanSymbol;","    if (number === Number.NEGATIVE_INFINITY || number === Number.POSITIVE_INFINITY) {","        return this._parent.Formats.infinitySign;","    }","","    // adjust value","    if (typeof number != \"number\") number = Number(number);","    number = Math.abs(number); // NOTE: minus sign is part of pattern","    if (this._parent._isPercent) number *= 100;","    else if (this._parent._isPerMille) number *= 1000;","    if(this._parent._parseIntegerOnly) number = Math.floor(number);","        ","    // format","    var expon = this._parent.Formats.exponentialSymbol;","    var exponReg = new RegExp(expon + \"+\");","    var s = this._parent._showExponent","    ? number.toExponential(this._parent._maxFracDigits).toUpperCase().replace(exponReg,expon)","    : number.toFixed(this._parent._maxFracDigits || 0);","    s = this._normalize(s);","    return s;","};","","// Protected methods","","NumberFormat.NumberSegment.prototype._normalize = function(s) {","    var exponSymbol = this._parent.Formats.exponentialSymbol;","    var splitReg = new RegExp(\"[\\\\.\" + exponSymbol + \"]\")","    var match = s.split(splitReg);","	","    // normalize whole part","    var whole = match.shift();","    if (whole.length < this._parent._minIntDigits) {","        whole = zeroPad(whole, this._parent._minIntDigits, this._parent.Formats.numberZero);","    }","    if (whole.length > this._parent._primaryGrouping && this._parent._useGrouping) {","        var a = [];","	    ","        var offset = this._parent._primaryGrouping;","        var i = whole.length - offset;","        while (i > 0) {","            a.unshift(whole.substr(i, offset));","            a.unshift(this._parent.Formats.groupingSeparator);","            offset = this._parent._secondaryGrouping;","            i -= offset;","        }","        a.unshift(whole.substring(0, i + offset));","		","        whole = a.join(\"\");","    }","	","    // normalize rest","    var fract = '0';","    var expon;","        ","    if(s.match(/\\./))","        fract = match.shift();","    else if(s.match(/\\e/) || s.match(/\\E/))","        expon = match.shift();","","    fract = fract.replace(/0+$/,\"\");","    if (fract.length < this._parent._minFracDigits) {","        fract = zeroPad(fract, this._parent._minFracDigits, this._parent.Formats.numberZero, true);","    }","	","    a = [ whole ];","    if (fract.length > 0) {","        var decimal = this._parent.Formats.decimalSeparator;","        a.push(decimal, fract);","    }","    if (expon) {","        a.push(exponSymbol, expon.replace(/^\\+/,\"\"));","    }","	","    // return normalize result","    return a.join(\"\");","}","    ","NumberFormat.NumberSegment.prototype.parse = function(object, s, index) {","    var comma = this._parent.Formats.groupingSeparator;","    var dot = this._parent.Formats.decimalSeparator;","    var minusSign = this._parent.Formats.minusSign;","    var expon = this._parent.Formats.exponentialSymbol;","        ","    var numberRegexPattern = \"[\\\\\" + minusSign + \"0-9\" + comma + \"]+\";","    if(!this._parent._parseIntegerOnly) {","        numberRegexPattern += \"(\\\\\" + dot + \"[0-9]+)?\";","    }","    if(this._parent._showExponent) {","        numberRegexPattern += \"(\" + expon +\"\\\\+?[0-9]+)\";","    }","        ","    var numberRegex = new RegExp(numberRegexPattern);","    var matches = s.match(numberRegex);","        ","    if(!matches) {","        throw new Format.ParsingException(\"Number does not match pattern\");","    }","        ","    var negativeNum = s.indexOf(minusSign) != -1;","    var endIndex = index + matches[0].length;","    s = s.slice(index, endIndex);","        ","    var scientific = null;","        ","    //Scientific format does not use grouping","    if(this._parent.showExponent) {","        scientific = s.split(expon);","    } else if(this._parent._useGrouping) {","        //Verify grouping data exists","        if(!this._parent._primaryGrouping) {","            //Should not happen","            throw new Format.ParsingException(\"Invalid pattern\");","        }","            ","        //Verify grouping is correct","        var i = s.length - this._parent._primaryGrouping - 1;","            ","        if(matches[1]) {","            //If there is a decimal part, ignore that. Grouping assumed to apply only to whole number part","            i = i - matches[1].length;","        }","            ","        //Use primary grouping for first group","        if(i > 0) {","            //There should be a comma at i","            if(s.charAt(i) != ',') {","                throw new Format.ParsingException(\"Number does not match pattern\");","            }","                ","            //Remove comma","            s = s.slice(0, i) + s.slice(i+1);","        }","            ","        //If more groups, use primary/secondary grouping as applicable","        var grouping = this._parent._secondaryGrouping || this._parent._primaryGrouping;","        i = i - grouping - 1;","            ","        while(i > 0) {","            //There should be a comma at i","            if(s.charAt(i) != ',') {","                throw new Format.ParsingException(\"Number does not match pattern\");","            }","                ","            //Remove comma","            s = s.slice(0, i) + s.slice(i+1);","            i = i - grouping - 1;","        }","            ","        //Verify there are no more grouping separators","        if(s.indexOf(comma) != -1) {","            throw new Format.ParsingException(\"Number does not match pattern\");","        }","    }","        ","    if(scientific) {","        object.value = parseFloat(scientific[0], 10) * Math.pow(10, parseFloat(scientific[1], 10));","    } else {","        object.value = parseFloat(s, 10);","    }","        ","    //Special types","    if(negativeNum) object.value *= -1;","    if (this._parent._isPercent) object.value /= 100;","    else if (this._parent._isPerMille) object.value /= 1000;","        ","    return endIndex;","};","    ","//","// YUI Code","//","    ","/**"," * NumberFormat"," * @class YNumberFormat"," * @constructor"," * @param {Number} style (Optional) the given style. Defaults to Number style"," */","YNumberFormat = function(style) {","    style = style || Y.Number.STYLES.NUMBER_STYLE;","    ","    if(Y.Lang.isString(style)) {","        style = Y.Number.STYLES[style];","    }","    ","    var pattern = \"\";","    var formats = Y.Intl.get(MODULE_NAME);","    switch(style) {","        case Y.Number.STYLES.CURRENCY_STYLE:","            pattern = formats.currencyFormat;","            break;","        case Y.Number.STYLES.ISO_CURRENCY_STYLE:","            pattern = formats.currencyFormat;","            pattern = pattern.replace(\"\\u00a4\", \"\\u00a4\\u00a4\");","            break;","        case Y.Number.STYLES.NUMBER_STYLE:","            pattern = formats.decimalFormat;","            break;","        case Y.Number.STYLES.PERCENT_STYLE:","            pattern = formats.percentFormat;","            break;","        case Y.Number.STYLES.PLURAL_CURRENCY_STYLE:","            //This is like <value> <currency>. This may be dependent on whether the value is singular or plural. Will be handled during formatting","            pattern = \"{plural_style}\";","            break;","        case Y.Number.STYLES.SCIENTIFIC_STYLE:","            pattern = formats.scientificFormat;","            break;","    }","        ","    this._numberFormatInstance = new NumberFormat(pattern, formats);","}","    ","Y.mix(Y.Number, {","    STYLES: {","        CURRENCY_STYLE: 1,","        ISO_CURRENCY_STYLE: 2,","        NUMBER_STYLE: 4,","        PERCENT_STYLE: 8,","        PLURAL_CURRENCY_STYLE: 16,","        SCIENTIFIC_STYLE: 32","    },","    ","    //Static methods","    ","    ","    /**","     * Create an instance of NumberFormat ","     * @param {Number} style (Optional) the given style","     */    ","    createInstance: function(style) {","        return new YNumberFormat(style);","    },","    ","    /**","     * Returns an array of BCP 47 language tags for the languages supported by this class","     * @return {Array} an array of BCP 47 language tags for the languages supported by this class.","     */","    getAvailableLocales: function() {","        return Y.Intl.getAvailableLangs(MODULE_NAME);","    }","});","","","","    ","//Public methods","    ","/**"," * Format a number to product a String."," * @param {Number} number the number to format"," */","YNumberFormat.prototype.format = function(number) {","    return this._numberFormatInstance.format(number);","}","    ","/**"," * Gets the currency used to display currency amounts. This may be an empty string for some cases. "," * @return {String} a 3-letter ISO code indicating the currency in use, or an empty string."," */","YNumberFormat.prototype.getCurrency = function() {","    return this._numberFormatInstance.currency;","}","    ","/**"," * Returns the maximum number of digits allowed in the fraction portion of a number. "," * @return {Number} the maximum number of digits allowed in the fraction portion of a number."," */","YNumberFormat.prototype.getMaximumFractionDigits = function() {","    return this._numberFormatInstance._maxFracDigits || 0;","}","    ","/**"," * Returns the maximum number of digits allowed in the integer portion of a number. "," * @return {Number} the maximum number of digits allowed in the integer portion of a number."," */","YNumberFormat.prototype.getMaximumIntegerDigits = function() {","    return this._numberFormatInstance._maxIntDigits || 0;","}","    ","/**"," * Returns the minimum number of digits allowed in the fraction portion of a number. "," * @return {Number} the minimum number of digits allowed in the fraction portion of a number."," */","YNumberFormat.prototype.getMinimumFractionDigits = function() {","    return this._numberFormatInstance._minFracDigits || 0;","}","    ","/**"," * Returns the minimum number of digits allowed in the integer portion of a number."," * @return {Number} the minimum number of digits allowed in the integer portion of a number."," */","YNumberFormat.prototype.getMinimumIntegerDigits = function() {","    return this._numberFormatInstance._minIntDigits || 0;","}","    ","/**"," * Returns true if grouping is used in this format."," * For example, in the English locale, with grouping on, the number 1234567 might be formatted as \"1,234,567\"."," * The grouping separator as well as the size of each group is locale dependant."," * @return {Boolean}"," */","YNumberFormat.prototype.isGroupingUsed = function() {","    return this._numberFormatInstance._useGrouping;","}","    ","/**"," * Return true if this format will parse numbers as integers only."," * For example in the English locale, with ParseIntegerOnly true, the string \"1234.\" would be parsed as the integer value 1234"," * and parsing would stop at the \".\" character. Of course, the exact format accepted by the parse operation is locale dependant."," * @return {Boolean}"," */","YNumberFormat.prototype.isParseIntegerOnly = function() {","    return this._numberFormatInstance._parseIntegerOnly;","}","    ","/**"," * Parse the string to get a number"," * @param {String} txt The string to parse"," * @param {Number} pp (Optional) Parse position. The position to start parsing at. Defaults to 0"," */","YNumberFormat.prototype.parse = function(txt, pp) {","    return this._numberFormatInstance.parse(txt, pp);","}","    ","/**"," * Sets the currency used to display currency amounts."," * This takes effect immediately, if this format is a currency format."," * If this format is not a currency format, then the currency is used if and when this object becomes a currency format."," * @param {String} currency a 3-letter ISO code indicating new currency to use. May be the empty string to indicate no currency."," */","YNumberFormat.prototype.setCurrency = function(currency) {","    this._numberFormatInstance.currency = currency;","}","    ","/**"," * Set whether or not grouping will be used in this format. "," * @param {Boolean} value"," */","YNumberFormat.prototype.setGroupingUsed = function(value) {","    this._numberFormatInstance._useGrouping = value;","}","    ","/**"," * Sets the maximum number of digits allowed in the fraction portion of a number."," * maximumFractionDigits must be >= minimumFractionDigits."," * If the new value for maximumFractionDigits is less than the current value of minimumFractionDigits,"," * then minimumFractionDigits will also be set to the new value. "," * @param {Number} newValue the new value to be set."," */","YNumberFormat.prototype.setMaximumFractionDigits = function(newValue) {","    this._numberFormatInstance._maxFracDigits = newValue;","        ","    if(this.getMinimumFractionDigits() > newValue) {","        this.setMinimumFractionDigits(newValue);","    }","}","    ","/**"," * Sets the maximum number of digits allowed in the integer portion of a number."," * maximumIntegerDigits must be >= minimumIntegerDigits."," * If the new value for maximumIntegerDigits is less than the current value of minimumIntegerDigits,"," * then minimumIntegerDigits will also be set to the new value."," * @param {Number} newValue the new value to be set."," */","YNumberFormat.prototype.setMaximumIntegerDigits = function(newValue) {","    this._numberFormatInstance._maxIntDigits = newValue;","        ","    if(this.getMinimumIntegerDigits() > newValue) {","        this.setMinimumIntegerDigits(newValue);","    }","}","    ","/**"," * Sets the minimum number of digits allowed in the fraction portion of a number."," * minimumFractionDigits must be <= maximumFractionDigits."," * If the new value for minimumFractionDigits exceeds the current value of maximumFractionDigits,"," * then maximumIntegerDigits will also be set to the new value"," * @param {Number} newValue the new value to be set."," */","YNumberFormat.prototype.setMinimumFractionDigits = function(newValue) {","    this._numberFormatInstance._minFracDigits = newValue;","        ","    if(this.getMaximumFractionDigits() < newValue) {","        this.setMaximumFractionDigits(newValue);","    }","}","    ","/**"," * Sets the minimum number of digits allowed in the integer portion of a number."," * minimumIntegerDigits must be <= maximumIntegerDigits."," * If the new value for minimumIntegerDigits exceeds the current value of maximumIntegerDigits,"," * then maximumIntegerDigits will also be set to the new value. "," * @param {Number} newValue the new value to be set."," */","YNumberFormat.prototype.setMinimumIntegerDigits = function(newValue) {","    this._numberFormatInstance._minIntDigits = newValue;","        ","    if(this.getMaximumIntegerDigits() < newValue) {","        this.setMaximumIntegerDigits(newValue);","    }","}","    ","/**"," * Sets whether or not numbers should be parsed as integers only. "," * @param {Boolean} newValue set True, this format will parse numbers as integers only."," */","YNumberFormat.prototype.setParseIntegerOnly = function(newValue) {","    this._numberFormatInstance._parseIntegerOnly = newValue;","}","","Y.Number.deprecatedFormat = Y.Number.format;","Y.Number.deprecatedParse = Y.Number.parse;","","/**"," * Takes a Number and formats to string for display to user"," *"," * @for Number"," * @method format"," * @param data {Number} Number"," * @param config {Object} (Optional) Configuration values:"," *   <dl>"," *      <dt>style {Number/String} (Optional)</dt>"," *         <dd>Format/Style to use. See Y.Number.STYLES</dd>"," *      <dt>parseIntegerOnly {Boolean} (Optional)</dt>"," *         <dd>If true, only the whole number part of data will be used</dd>"," *   </dl>"," * @return {String} Formatted string representation of data"," */","Y.Number.format = function(data, config) {","    config = config || {};","    ","    if(config.prefix != null || config.decimalPlaces != null || config.decimalSeparator != null || config.thousandsSeparator != null || config.suffix != null) {","        return Y.Number.deprecatedFormat(data, config);","    }","    ","    try {","        var formatter = new YNumberFormat(config.style);","        if(config.parseIntegerOnly) {","            formatter.setParseIntegerOnly(true);","        }","        return formatter.format(data);","    } catch(e) {","        //Error. Fallback to deprecated format","        console.log(e);","    }","    return Y.Number.deprecatedFormat(data, config);","}","","/**"," * Parses data and returns a number"," * "," * @for Number"," * @method format"," * @param data {String} Data to be parsed"," * @param config (Object} (Optional) Object containg 'style' (Pattern data is represented in. See Y.Number.STYLES) and 'parsePosition' (index position in data to start parsing at) Both parameters are optional. If omitted, style defaults to NUMBER_STYLE, and parsePosition defaults to 0"," * @return {Number} Number represented by data "," */","Y.Number.parse = function(data, config) {","    try {","        var formatter = new YNumberFormat(config.style);","        return formatter.parse(data, config.parsePosition);","    } catch(e) {","        //Fallback on deprecated parse","        console.log(e);","    }","    ","    return Y.Number.parse(data);","}","","//Update Parsers shortcut","Y.namespace(\"Parsers\").number = Y.Number.parse","","","}, '@VERSION@', {\"lang\": [], \"requires\": [\"datatype-number-format\", \"datatype-number-parse\"]});"];
_yuitest_coverage["build/datatype-number-advanced-format/datatype-number-advanced-format.js"].lines = {"1":0,"16":0,"17":0,"18":0,"20":0,"21":0,"22":0,"27":0,"28":0,"32":0,"34":0,"35":0,"36":0,"37":0,"41":0,"44":0,"47":0,"51":0,"52":0,"53":0,"57":0,"58":0,"60":0,"61":0,"63":0,"68":0,"69":0,"71":0,"73":0,"75":0,"76":0,"77":0,"79":0,"81":0,"92":0,"93":0,"94":0,"95":0,"96":0,"97":0,"100":0,"101":0,"103":0,"112":0,"113":0,"120":0,"121":0,"122":0,"123":0,"128":0,"129":0,"144":0,"145":0,"148":0,"149":0,"152":0,"153":0,"154":0,"156":0,"157":0,"158":0,"161":0,"182":0,"183":0,"184":0,"185":0,"186":0,"187":0,"188":0,"191":0,"192":0,"193":0,"195":0,"196":0,"198":0,"199":0,"200":0,"201":0,"202":0,"205":0,"208":0,"215":0,"216":0,"217":0,"220":0,"222":0,"223":0,"226":0,"227":0,"230":0,"231":0,"232":0,"258":0,"260":0,"261":0,"262":0,"265":0,"266":0,"267":0,"270":0,"271":0,"272":0,"273":0,"277":0,"278":0,"279":0,"282":0,"283":0,"285":0,"286":0,"289":0,"290":0,"291":0,"292":0,"294":0,"295":0,"296":0,"300":0,"302":0,"303":0,"304":0,"305":0,"306":0,"310":0,"311":0,"313":0,"315":0,"317":0,"318":0,"319":0,"320":0,"321":0,"322":0,"325":0,"326":0,"327":0,"332":0,"333":0,"334":0,"335":0,"337":0,"340":0,"341":0,"342":0,"343":0,"344":0,"346":0,"349":0,"352":0,"353":0,"354":0,"355":0,"359":0,"361":0,"362":0,"363":0,"367":0,"368":0,"370":0,"371":0,"372":0,"374":0,"378":0,"382":0,"393":0,"395":0,"398":0,"399":0,"400":0,"401":0,"406":0,"407":0,"408":0,"411":0,"413":0,"414":0,"415":0,"417":0,"418":0,"421":0,"422":0,"425":0,"428":0,"431":0,"432":0,"433":0,"436":0,"437":0,"438":0,"440":0,"443":0,"444":0,"445":0,"446":0,"450":0,"455":0,"456":0,"457":0,"458":0,"459":0,"460":0,"461":0,"463":0,"465":0,"466":0,"469":0,"470":0,"471":0,"474":0,"475":0,"476":0,"479":0,"480":0,"481":0,"484":0,"485":0,"486":0,"488":0,"490":0,"491":0,"494":0,"496":0,"502":0,"503":0,"512":0,"513":0,"514":0,"516":0,"520":0,"522":0,"523":0,"524":0,"528":0,"529":0,"530":0,"531":0,"532":0,"535":0,"536":0,"537":0,"540":0,"541":0,"546":0,"547":0,"548":0,"549":0,"552":0,"553":0,"554":0,"556":0,"557":0,"559":0,"560":0,"561":0,"562":0,"563":0,"564":0,"565":0,"567":0,"569":0,"573":0,"574":0,"576":0,"577":0,"578":0,"579":0,"581":0,"582":0,"583":0,"586":0,"587":0,"588":0,"589":0,"591":0,"592":0,"596":0,"599":0,"600":0,"601":0,"602":0,"603":0,"605":0,"606":0,"607":0,"609":0,"610":0,"613":0,"614":0,"616":0,"617":0,"620":0,"621":0,"622":0,"624":0,"627":0,"628":0,"629":0,"631":0,"633":0,"637":0,"639":0,"641":0,"645":0,"647":0,"648":0,"652":0,"656":0,"657":0,"659":0,"661":0,"662":0,"666":0,"667":0,"671":0,"672":0,"676":0,"677":0,"679":0,"683":0,"684":0,"685":0,"687":0,"700":0,"701":0,"703":0,"704":0,"707":0,"708":0,"709":0,"711":0,"712":0,"714":0,"715":0,"716":0,"718":0,"719":0,"721":0,"722":0,"725":0,"726":0,"728":0,"729":0,"732":0,"735":0,"753":0,"761":0,"774":0,"775":0,"782":0,"783":0,"790":0,"791":0,"798":0,"799":0,"806":0,"807":0,"814":0,"815":0,"824":0,"825":0,"834":0,"835":0,"843":0,"844":0,"853":0,"854":0,"861":0,"862":0,"872":0,"873":0,"875":0,"876":0,"887":0,"888":0,"890":0,"891":0,"902":0,"903":0,"905":0,"906":0,"917":0,"918":0,"920":0,"921":0,"929":0,"930":0,"933":0,"934":0,"951":0,"952":0,"954":0,"955":0,"958":0,"959":0,"960":0,"961":0,"963":0,"966":0,"968":0,"980":0,"981":0,"982":0,"983":0,"986":0,"989":0,"993":0};
_yuitest_coverage["build/datatype-number-advanced-format/datatype-number-advanced-format.js"].functions = {"Format:16":0,"toString:36":0,"Exception:33":0,"ParsingException:40":0,"IllegalArgumentsException:43":0,"FormatException:46":0,"format:57":0,"zeroPad:68":0,"parse:92":0,"_createParseObject:112":0,"Segment:120":0,"format:128":0,"parse:144":0,"getFormat:148":0,"_parseLiteral:152":0,"_parseInt:182":0,"TextSegment:215":0,"toString:222":0,"parse:226":0,"trim:231":0,"NumberFormat:260":0,"format:406":0,"parse:431":0,"__parseStatic:455":0,"_createParseObject:502":0,"NumberSegment:512":0,"format:520":0,"_normalize:546":0,"parse:599":0,"YNumberFormat:700":0,"createInstance:752":0,"getAvailableLocales:760":0,"format:774":0,"getCurrency:782":0,"getMaximumFractionDigits:790":0,"getMaximumIntegerDigits:798":0,"getMinimumFractionDigits:806":0,"getMinimumIntegerDigits:814":0,"isGroupingUsed:824":0,"isParseIntegerOnly:834":0,"parse:843":0,"setCurrency:853":0,"setGroupingUsed:861":0,"setMaximumFractionDigits:872":0,"setMaximumIntegerDigits:887":0,"setMinimumFractionDigits:902":0,"setMinimumIntegerDigits:917":0,"setParseIntegerOnly:929":0,"format:951":0,"parse:980":0,"(anonymous 1):1":0};
_yuitest_coverage["build/datatype-number-advanced-format/datatype-number-advanced-format.js"].coveredLines = 406;
_yuitest_coverage["build/datatype-number-advanced-format/datatype-number-advanced-format.js"].coveredFunctions = 51;
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 1);
YUI.add('datatype-number-advanced-format', function (Y, NAME) {

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
_yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "(anonymous 1)", 1);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 16);
Format = function(pattern, formats) {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "Format", 16);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 17);
if (arguments.length == 0) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 18);
return;
    }
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 20);
this._pattern = pattern;
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 21);
this._segments = []; 
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 22);
this.Formats = formats; 
}

// Data

_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 27);
Format.prototype._pattern = null;
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 28);
Format.prototype._segments = null;

//Exceptions

_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 32);
Y.mix(Format, {
    Exception: function(name, message) {
        _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "Exception", 33);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 34);
this.name = name;
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 35);
this.message = message;
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 36);
this.toString = function() {
            _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "toString", 36);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 37);
return this.name + ": " + this.message;
        }
    },
    ParsingException: function(message) {
        _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "ParsingException", 40);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 41);
Format.ParsingException.superclass.constructor.call(this, "ParsingException", message);
    },
    IllegalArgumentsException: function(message) {
        _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "IllegalArgumentsException", 43);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 44);
Format.IllegalArgumentsException.superclass.constructor.call(this, "IllegalArgumentsException", message);
    },
    FormatException: function(message) {
        _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "FormatException", 46);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 47);
Format.FormatException.superclass.constructor.call(this, "FormatException", message);
    }
});

_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 51);
Y.extend(Format.ParsingException, Format.Exception);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 52);
Y.extend(Format.IllegalArgumentsException, Format.Exception);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 53);
Y.extend(Format.FormatException, Format.Exception);

// Public methods

_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 57);
Format.prototype.format = function(object) { 
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "format", 57);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 58);
var s = [];
        
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 60);
for (var i = 0; i < this._segments.length; i++) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 61);
s.push(this._segments[i].format(object));
    }
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 63);
return s.join("");
};

// Protected static methods

_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 68);
function zeroPad (s, length, zeroChar, rightSide) {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "zeroPad", 68);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 69);
s = typeof s == "string" ? s : String(s);

    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 71);
if (s.length >= length) {return s;}

    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 73);
zeroChar = zeroChar || '0';
	
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 75);
var a = [];
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 76);
for (var i = s.length; i < length; i++) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 77);
a.push(zeroChar);
    }
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 79);
a[rightSide ? "unshift" : "push"](s);

    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 81);
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
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 92);
Format.prototype.parse = function(s, pp) {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "parse", 92);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 93);
var object = this._createParseObject();
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 94);
var index = pp || 0;
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 95);
for (var i = 0; i < this._segments.length; i++) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 96);
var segment = this._segments[i];
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 97);
index = segment.parse(object, s, index);
    }
        
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 100);
if (index < s.length) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 101);
throw new Format.ParsingException("Input too long");
    }
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 103);
return object;
};
    
/**
 * Creates the object that is initialized by parsing
 * <p>
 * <strong>Note:</strong>
 * This must be implemented by sub-classes.
 */
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 112);
Format.prototype._createParseObject = function(s) {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "_createParseObject", 112);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 113);
throw new Format.ParsingException("Not implemented");
};

//
// Segment class
//

_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 120);
Format.Segment = function(format, s) {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "Segment", 120);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 121);
if (arguments.length == 0) {return;}
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 122);
this._parent = format;
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 123);
this._s = s;
};
    
// Public methods

_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 128);
Format.Segment.prototype.format = function(o) { 
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "format", 128);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 129);
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
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 144);
Format.Segment.prototype.parse = function(o, s, index) {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "parse", 144);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 145);
throw new Format.ParsingException("Not implemented");
};

_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 148);
Format.Segment.prototype.getFormat = function() {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "getFormat", 148);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 149);
return this._parent;
};

_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 152);
Format.Segment._parseLiteral = function(literal, s, index) {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "_parseLiteral", 152);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 153);
if (s.length - index < literal.length) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 154);
throw new Format.ParsingException("Input too short");
    }
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 156);
for (var i = 0; i < literal.length; i++) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 157);
if (literal.charAt(i) != s.charAt(index + i)) {
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 158);
throw new Format.ParsingException("Input doesn't match");
        }
    }
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 161);
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
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 182);
Format.Segment._parseInt = function(o, f, adjust, s, index, fixedlen, radix) {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "_parseInt", 182);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 183);
var len = fixedlen || s.length - index;
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 184);
var head = index;
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 185);
for (var i = 0; i < len; i++) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 186);
if (!s.charAt(index++).match(/\d/)) {
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 187);
index--;
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 188);
break;
        }
    }
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 191);
var tail = index;
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 192);
if (head == tail) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 193);
throw new Format.ParsingException("Number not present");
    }
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 195);
if (fixedlen && tail - head != fixedlen) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 196);
throw new Format.ParsingException("Number too short");
    }
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 198);
var value = parseInt(s.substring(head, tail), radix || 10);
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 199);
if (f) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 200);
var target = o || window;
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 201);
if (typeof f == "function") {
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 202);
f.call(target, value + adjust);
        }
        else {
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 205);
target[f] = value + adjust;
        }
    }
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 208);
return tail;
};

//
// Text segment class
//

_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 215);
Format.TextSegment = function(format, s) {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "TextSegment", 215);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 216);
if (arguments.length == 0) {return;}
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 217);
Format.TextSegment.superclass.constructor.call(this, format, s);
};

_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 220);
Y.extend(Format.TextSegment, Format.Segment);

_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 222);
Format.TextSegment.prototype.toString = function() { 
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "toString", 222);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 223);
return "text: \""+this._s+'"'; 
};
    
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 226);
Format.TextSegment.prototype.parse = function(o, s, index) {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "parse", 226);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 227);
return Format.Segment._parseLiteral(this._s, s, index);
};

_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 230);
if(String.prototype.trim == null) {
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 231);
String.prototype.trim = function() {
        _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "trim", 231);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 232);
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

_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 258);
var MODULE_NAME = "datatype-number-advanced-format";

_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 260);
NumberFormat = function(pattern, formats, skipNegFormat) {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "NumberFormat", 260);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 261);
if (arguments.length == 0) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 262);
return;
    }

    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 265);
NumberFormat.superclass.constructor.call(this, pattern, formats);
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 266);
if (!pattern) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 267);
return;
    }

    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 270);
if(pattern == "{plural_style}") {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 271);
pattern = this.Formats.decimalFormat;
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 272);
this._isPluralCurrency = true;
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 273);
this._pattern = pattern;
    }

    //Default currency
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 277);
this.currency = this.Formats.defaultCurrency;
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 278);
if(this.currency == null || this.currency == "") {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 279);
this.currency = "USD";
    }
        
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 282);
var patterns = pattern.split(/;/);
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 283);
pattern = patterns[0];
	
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 285);
this._useGrouping = (pattern.indexOf(",") != -1);      //Will be set to true if pattern uses grouping
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 286);
this._parseIntegerOnly = (pattern.indexOf(".") == -1);  //Will be set to false if pattern contains fractional parts
        
    //If grouping is used, find primary and secondary grouping
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 289);
if(this._useGrouping) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 290);
var numberPattern = pattern.match(/[0#,]+/);
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 291);
var groupingRegex = new RegExp("[0#]+", "g");
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 292);
var groups = numberPattern[0].match(groupingRegex);
            
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 294);
var i = groups.length - 2;
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 295);
this._primaryGrouping = groups[i+1].length;
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 296);
this._secondaryGrouping = (i > 0 ? groups[i].length : groups[i+1].length);
    }
        
    // parse prefix
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 300);
i = 0;
        
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 302);
var results = this.__parseStatic(pattern, i);
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 303);
i = results.offset;
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 304);
var hasPrefix = results.text != "";
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 305);
if (hasPrefix) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 306);
this._segments.push(new Format.TextSegment(this, results.text));
    }
	
    // parse number descriptor
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 310);
var start = i;
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 311);
while (i < pattern.length &&
        NumberFormat._META_CHARS.indexOf(pattern.charAt(i)) != -1) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 313);
i++;
    }
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 315);
var end = i;

    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 317);
var numPattern = pattern.substring(start, end);
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 318);
var e = numPattern.indexOf(this.Formats.exponentialSymbol);
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 319);
var expon = e != -1 ? numPattern.substring(e + 1) : null;
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 320);
if (expon) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 321);
numPattern = numPattern.substring(0, e);
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 322);
this._showExponent = true;
    }
	
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 325);
var dot = numPattern.indexOf('.');
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 326);
var whole = dot != -1 ? numPattern.substring(0, dot) : numPattern;
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 327);
if (whole) {
        /*var comma = whole.lastIndexOf(',');
            if (comma != -1) {
                this._groupingOffset = whole.length - comma - 1;
            }*/
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 332);
whole = whole.replace(/[^#0]/g,"");
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 333);
var zero = whole.indexOf('0');
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 334);
if (zero != -1) {
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 335);
this._minIntDigits = whole.length - zero;
        }
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 337);
this._maxIntDigits = whole.length;
    }
	
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 340);
var fract = dot != -1 ? numPattern.substring(dot + 1) : null;
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 341);
if (fract) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 342);
zero = fract.lastIndexOf('0');
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 343);
if (zero != -1) {
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 344);
this._minFracDigits = zero + 1;
        }
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 346);
this._maxFracDigits = fract.replace(/[^#0]/g,"").length;
    }
	
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 349);
this._segments.push(new NumberFormat.NumberSegment(this, numPattern));
	
    // parse suffix
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 352);
results = this.__parseStatic(pattern, i);
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 353);
i = results.offset;
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 354);
if (results.text != "") {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 355);
this._segments.push(new Format.TextSegment(this, results.text));
    }
	
    // add negative formatter
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 359);
if (skipNegFormat) {return;}
	
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 361);
if (patterns.length > 1) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 362);
pattern = patterns[1];
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 363);
this._negativeFormatter = new NumberFormat(pattern, formats, true);
    }
    else {
        // no negative pattern; insert minus sign before number segment
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 367);
var formatter = new NumberFormat("", formats);
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 368);
formatter._segments = formatter._segments.concat(this._segments);

        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 370);
var index = hasPrefix ? 1 : 0;
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 371);
var minus = new Format.TextSegment(formatter, this.Formats.minusSign);
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 372);
formatter._segments.splice(index, 0, minus);
		
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 374);
this._negativeFormatter = formatter;
    }
}

_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 378);
Y.extend(NumberFormat, Format);
    
// Constants

_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 382);
Y.mix(NumberFormat, {
    _NUMBER: "number",
    _INTEGER: "integer",
    _CURRENCY: "currency",
    _PERCENT: "percent",

    _META_CHARS: "0#.,E"
});

// Data

_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 393);
NumberFormat.prototype._groupingOffset = Number.MAX_VALUE;
//NumberFormat.prototype._maxIntDigits;
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 395);
NumberFormat.prototype._minIntDigits = 1;
//NumberFormat.prototype._maxFracDigits;
//NumberFormat.prototype._minFracDigits;
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 398);
NumberFormat.prototype._isCurrency = false;
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 399);
NumberFormat.prototype._isPercent = false;
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 400);
NumberFormat.prototype._isPerMille = false;
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 401);
NumberFormat.prototype._showExponent = false;
//NumberFormat.prototype._negativeFormatter;

// Public methods

_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 406);
NumberFormat.prototype.format = function(number) {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "format", 406);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 407);
if (number < 0 && this._negativeFormatter) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 408);
return this._negativeFormatter.format(number);
    }
        
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 411);
var result = Format.prototype.format.call(this, number);
        
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 413);
if(this._isPluralCurrency) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 414);
var pattern = "";
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 415);
if(number == 1) {
            //Singular
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 417);
pattern = this.Formats.currencyPatternSingular;
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 418);
pattern = pattern.replace("{1}", this.Formats[this.currency + "_currencySingular"]);
        } else {
            //Plural
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 421);
pattern = this.Formats.currencyPatternPlural;
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 422);
pattern = pattern.replace("{1}", this.Formats[this.currency + "_currencyPlural"]);
        }
            
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 425);
result = pattern.replace("{0}", result);
    }
        
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 428);
return result;
};
    
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 431);
NumberFormat.prototype.parse = function(s, pp) {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "parse", 431);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 432);
if(s.indexOf(this.Formats.minusSign) != -1 && this._negativeFormatter) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 433);
return this._negativeFormatter.parse(s, pp);
    }
        
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 436);
if(this._isPluralCurrency) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 437);
var singular = this.Formats[this.currency + "_currencySingular"];
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 438);
var plural = this.Formats[this.currency + "_currencyPlural"];
            
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 440);
s = s.replace(plural, "").replace(singular, "").trim();
    }
        
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 443);
var object = null;
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 444);
try {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 445);
object = Format.prototype.parse.call(this, s, pp);
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 446);
object = object.value;
    } catch(e) {
    }
        
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 450);
return object;
}

// Private methods

_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 455);
NumberFormat.prototype.__parseStatic = function(s, i) {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "__parseStatic", 455);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 456);
var data = [];
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 457);
while (i < s.length) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 458);
var c = s.charAt(i++);
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 459);
if (NumberFormat._META_CHARS.indexOf(c) != -1) {
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 460);
i--;
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 461);
break;
        }
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 463);
switch (c) {
            case "'": {
                _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 465);
var start = i;
                _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 466);
while (i < s.length && s.charAt(i++) != "'") {
                // do nothing
                }
                _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 469);
var end = i;
                _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 470);
c = end - start == 0 ? "'" : s.substring(start, end);
                _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 471);
break;
            }
            case '%': {
                _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 474);
c = this.Formats.percentSign; 
                _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 475);
this._isPercent = true;
                _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 476);
break;
            }
            case '\u2030': {
                _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 479);
c = this.Formats.perMilleSign; 
                _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 480);
this._isPerMille = true;
                _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 481);
break;
            }
            case '\u00a4': {
                _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 484);
if(s.charAt(i) == '\u00a4') {
                    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 485);
c = this.Formats[this.currency + "_currencyISO"];
                    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 486);
i++;
                } else {
                    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 488);
c = this.Formats[this.currency + "_currencySymbol"];
                }
                _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 490);
this._isCurrency = true;
                _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 491);
break;
            }
        }
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 494);
data.push(c);
    }
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 496);
return {
        text: data.join(""), 
        offset: i
    };
};
    
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 502);
NumberFormat.prototype._createParseObject = function() {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "_createParseObject", 502);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 503);
return {
        value: null
    };
};
    
//
// NumberFormat.NumberSegment class
//

_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 512);
NumberFormat.NumberSegment = function(format, s) {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "NumberSegment", 512);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 513);
if (arguments.length == 0) {return;}
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 514);
NumberFormat.NumberSegment.superclass.constructor.call(this, format, s);
};
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 516);
Y.extend(NumberFormat.NumberSegment, Format.Segment);
    
// Public methods

_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 520);
NumberFormat.NumberSegment.prototype.format = function(number) {
    // special values
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "format", 520);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 522);
if (isNaN(number)) {return this._parent.Formats.nanSymbol;}
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 523);
if (number === Number.NEGATIVE_INFINITY || number === Number.POSITIVE_INFINITY) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 524);
return this._parent.Formats.infinitySign;
    }

    // adjust value
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 528);
if (typeof number != "number") {number = Number(number);}
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 529);
number = Math.abs(number); // NOTE: minus sign is part of pattern
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 530);
if (this._parent._isPercent) {number *= 100;}
    else {_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 531);
if (this._parent._isPerMille) {number *= 1000;}}
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 532);
if(this._parent._parseIntegerOnly) {number = Math.floor(number);}
        
    // format
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 535);
var expon = this._parent.Formats.exponentialSymbol;
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 536);
var exponReg = new RegExp(expon + "+");
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 537);
var s = this._parent._showExponent
    ? number.toExponential(this._parent._maxFracDigits).toUpperCase().replace(exponReg,expon)
    : number.toFixed(this._parent._maxFracDigits || 0);
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 540);
s = this._normalize(s);
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 541);
return s;
};

// Protected methods

_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 546);
NumberFormat.NumberSegment.prototype._normalize = function(s) {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "_normalize", 546);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 547);
var exponSymbol = this._parent.Formats.exponentialSymbol;
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 548);
var splitReg = new RegExp("[\\." + exponSymbol + "]")
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 549);
var match = s.split(splitReg);
	
    // normalize whole part
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 552);
var whole = match.shift();
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 553);
if (whole.length < this._parent._minIntDigits) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 554);
whole = zeroPad(whole, this._parent._minIntDigits, this._parent.Formats.numberZero);
    }
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 556);
if (whole.length > this._parent._primaryGrouping && this._parent._useGrouping) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 557);
var a = [];
	    
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 559);
var offset = this._parent._primaryGrouping;
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 560);
var i = whole.length - offset;
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 561);
while (i > 0) {
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 562);
a.unshift(whole.substr(i, offset));
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 563);
a.unshift(this._parent.Formats.groupingSeparator);
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 564);
offset = this._parent._secondaryGrouping;
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 565);
i -= offset;
        }
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 567);
a.unshift(whole.substring(0, i + offset));
		
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 569);
whole = a.join("");
    }
	
    // normalize rest
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 573);
var fract = '0';
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 574);
var expon;
        
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 576);
if(s.match(/\./))
        {_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 577);
fract = match.shift();}
    else {_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 578);
if(s.match(/\e/) || s.match(/\E/))
        {_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 579);
expon = match.shift();}}

    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 581);
fract = fract.replace(/0+$/,"");
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 582);
if (fract.length < this._parent._minFracDigits) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 583);
fract = zeroPad(fract, this._parent._minFracDigits, this._parent.Formats.numberZero, true);
    }
	
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 586);
a = [ whole ];
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 587);
if (fract.length > 0) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 588);
var decimal = this._parent.Formats.decimalSeparator;
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 589);
a.push(decimal, fract);
    }
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 591);
if (expon) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 592);
a.push(exponSymbol, expon.replace(/^\+/,""));
    }
	
    // return normalize result
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 596);
return a.join("");
}
    
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 599);
NumberFormat.NumberSegment.prototype.parse = function(object, s, index) {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "parse", 599);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 600);
var comma = this._parent.Formats.groupingSeparator;
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 601);
var dot = this._parent.Formats.decimalSeparator;
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 602);
var minusSign = this._parent.Formats.minusSign;
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 603);
var expon = this._parent.Formats.exponentialSymbol;
        
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 605);
var numberRegexPattern = "[\\" + minusSign + "0-9" + comma + "]+";
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 606);
if(!this._parent._parseIntegerOnly) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 607);
numberRegexPattern += "(\\" + dot + "[0-9]+)?";
    }
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 609);
if(this._parent._showExponent) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 610);
numberRegexPattern += "(" + expon +"\\+?[0-9]+)";
    }
        
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 613);
var numberRegex = new RegExp(numberRegexPattern);
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 614);
var matches = s.match(numberRegex);
        
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 616);
if(!matches) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 617);
throw new Format.ParsingException("Number does not match pattern");
    }
        
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 620);
var negativeNum = s.indexOf(minusSign) != -1;
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 621);
var endIndex = index + matches[0].length;
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 622);
s = s.slice(index, endIndex);
        
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 624);
var scientific = null;
        
    //Scientific format does not use grouping
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 627);
if(this._parent.showExponent) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 628);
scientific = s.split(expon);
    } else {_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 629);
if(this._parent._useGrouping) {
        //Verify grouping data exists
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 631);
if(!this._parent._primaryGrouping) {
            //Should not happen
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 633);
throw new Format.ParsingException("Invalid pattern");
        }
            
        //Verify grouping is correct
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 637);
var i = s.length - this._parent._primaryGrouping - 1;
            
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 639);
if(matches[1]) {
            //If there is a decimal part, ignore that. Grouping assumed to apply only to whole number part
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 641);
i = i - matches[1].length;
        }
            
        //Use primary grouping for first group
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 645);
if(i > 0) {
            //There should be a comma at i
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 647);
if(s.charAt(i) != ',') {
                _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 648);
throw new Format.ParsingException("Number does not match pattern");
            }
                
            //Remove comma
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 652);
s = s.slice(0, i) + s.slice(i+1);
        }
            
        //If more groups, use primary/secondary grouping as applicable
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 656);
var grouping = this._parent._secondaryGrouping || this._parent._primaryGrouping;
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 657);
i = i - grouping - 1;
            
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 659);
while(i > 0) {
            //There should be a comma at i
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 661);
if(s.charAt(i) != ',') {
                _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 662);
throw new Format.ParsingException("Number does not match pattern");
            }
                
            //Remove comma
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 666);
s = s.slice(0, i) + s.slice(i+1);
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 667);
i = i - grouping - 1;
        }
            
        //Verify there are no more grouping separators
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 671);
if(s.indexOf(comma) != -1) {
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 672);
throw new Format.ParsingException("Number does not match pattern");
        }
    }}
        
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 676);
if(scientific) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 677);
object.value = parseFloat(scientific[0], 10) * Math.pow(10, parseFloat(scientific[1], 10));
    } else {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 679);
object.value = parseFloat(s, 10);
    }
        
    //Special types
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 683);
if(negativeNum) {object.value *= -1;}
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 684);
if (this._parent._isPercent) {object.value /= 100;}
    else {_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 685);
if (this._parent._isPerMille) {object.value /= 1000;}}
        
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 687);
return endIndex;
};
    
//
// YUI Code
//
    
/**
 * NumberFormat
 * @class YNumberFormat
 * @constructor
 * @param {Number} style (Optional) the given style. Defaults to Number style
 */
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 700);
YNumberFormat = function(style) {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "YNumberFormat", 700);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 701);
style = style || Y.Number.STYLES.NUMBER_STYLE;
    
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 703);
if(Y.Lang.isString(style)) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 704);
style = Y.Number.STYLES[style];
    }
    
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 707);
var pattern = "";
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 708);
var formats = Y.Intl.get(MODULE_NAME);
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 709);
switch(style) {
        case Y.Number.STYLES.CURRENCY_STYLE:
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 711);
pattern = formats.currencyFormat;
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 712);
break;
        case Y.Number.STYLES.ISO_CURRENCY_STYLE:
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 714);
pattern = formats.currencyFormat;
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 715);
pattern = pattern.replace("\u00a4", "\u00a4\u00a4");
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 716);
break;
        case Y.Number.STYLES.NUMBER_STYLE:
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 718);
pattern = formats.decimalFormat;
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 719);
break;
        case Y.Number.STYLES.PERCENT_STYLE:
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 721);
pattern = formats.percentFormat;
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 722);
break;
        case Y.Number.STYLES.PLURAL_CURRENCY_STYLE:
            //This is like <value> <currency>. This may be dependent on whether the value is singular or plural. Will be handled during formatting
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 725);
pattern = "{plural_style}";
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 726);
break;
        case Y.Number.STYLES.SCIENTIFIC_STYLE:
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 728);
pattern = formats.scientificFormat;
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 729);
break;
    }
        
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 732);
this._numberFormatInstance = new NumberFormat(pattern, formats);
}
    
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 735);
Y.mix(Y.Number, {
    STYLES: {
        CURRENCY_STYLE: 1,
        ISO_CURRENCY_STYLE: 2,
        NUMBER_STYLE: 4,
        PERCENT_STYLE: 8,
        PLURAL_CURRENCY_STYLE: 16,
        SCIENTIFIC_STYLE: 32
    },
    
    //Static methods
    
    
    /**
     * Create an instance of NumberFormat 
     * @param {Number} style (Optional) the given style
     */    
    createInstance: function(style) {
        _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "createInstance", 752);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 753);
return new YNumberFormat(style);
    },
    
    /**
     * Returns an array of BCP 47 language tags for the languages supported by this class
     * @return {Array} an array of BCP 47 language tags for the languages supported by this class.
     */
    getAvailableLocales: function() {
        _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "getAvailableLocales", 760);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 761);
return Y.Intl.getAvailableLangs(MODULE_NAME);
    }
});



    
//Public methods
    
/**
 * Format a number to product a String.
 * @param {Number} number the number to format
 */
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 774);
YNumberFormat.prototype.format = function(number) {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "format", 774);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 775);
return this._numberFormatInstance.format(number);
}
    
/**
 * Gets the currency used to display currency amounts. This may be an empty string for some cases. 
 * @return {String} a 3-letter ISO code indicating the currency in use, or an empty string.
 */
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 782);
YNumberFormat.prototype.getCurrency = function() {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "getCurrency", 782);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 783);
return this._numberFormatInstance.currency;
}
    
/**
 * Returns the maximum number of digits allowed in the fraction portion of a number. 
 * @return {Number} the maximum number of digits allowed in the fraction portion of a number.
 */
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 790);
YNumberFormat.prototype.getMaximumFractionDigits = function() {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "getMaximumFractionDigits", 790);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 791);
return this._numberFormatInstance._maxFracDigits || 0;
}
    
/**
 * Returns the maximum number of digits allowed in the integer portion of a number. 
 * @return {Number} the maximum number of digits allowed in the integer portion of a number.
 */
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 798);
YNumberFormat.prototype.getMaximumIntegerDigits = function() {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "getMaximumIntegerDigits", 798);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 799);
return this._numberFormatInstance._maxIntDigits || 0;
}
    
/**
 * Returns the minimum number of digits allowed in the fraction portion of a number. 
 * @return {Number} the minimum number of digits allowed in the fraction portion of a number.
 */
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 806);
YNumberFormat.prototype.getMinimumFractionDigits = function() {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "getMinimumFractionDigits", 806);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 807);
return this._numberFormatInstance._minFracDigits || 0;
}
    
/**
 * Returns the minimum number of digits allowed in the integer portion of a number.
 * @return {Number} the minimum number of digits allowed in the integer portion of a number.
 */
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 814);
YNumberFormat.prototype.getMinimumIntegerDigits = function() {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "getMinimumIntegerDigits", 814);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 815);
return this._numberFormatInstance._minIntDigits || 0;
}
    
/**
 * Returns true if grouping is used in this format.
 * For example, in the English locale, with grouping on, the number 1234567 might be formatted as "1,234,567".
 * The grouping separator as well as the size of each group is locale dependant.
 * @return {Boolean}
 */
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 824);
YNumberFormat.prototype.isGroupingUsed = function() {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "isGroupingUsed", 824);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 825);
return this._numberFormatInstance._useGrouping;
}
    
/**
 * Return true if this format will parse numbers as integers only.
 * For example in the English locale, with ParseIntegerOnly true, the string "1234." would be parsed as the integer value 1234
 * and parsing would stop at the "." character. Of course, the exact format accepted by the parse operation is locale dependant.
 * @return {Boolean}
 */
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 834);
YNumberFormat.prototype.isParseIntegerOnly = function() {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "isParseIntegerOnly", 834);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 835);
return this._numberFormatInstance._parseIntegerOnly;
}
    
/**
 * Parse the string to get a number
 * @param {String} txt The string to parse
 * @param {Number} pp (Optional) Parse position. The position to start parsing at. Defaults to 0
 */
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 843);
YNumberFormat.prototype.parse = function(txt, pp) {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "parse", 843);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 844);
return this._numberFormatInstance.parse(txt, pp);
}
    
/**
 * Sets the currency used to display currency amounts.
 * This takes effect immediately, if this format is a currency format.
 * If this format is not a currency format, then the currency is used if and when this object becomes a currency format.
 * @param {String} currency a 3-letter ISO code indicating new currency to use. May be the empty string to indicate no currency.
 */
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 853);
YNumberFormat.prototype.setCurrency = function(currency) {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "setCurrency", 853);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 854);
this._numberFormatInstance.currency = currency;
}
    
/**
 * Set whether or not grouping will be used in this format. 
 * @param {Boolean} value
 */
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 861);
YNumberFormat.prototype.setGroupingUsed = function(value) {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "setGroupingUsed", 861);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 862);
this._numberFormatInstance._useGrouping = value;
}
    
/**
 * Sets the maximum number of digits allowed in the fraction portion of a number.
 * maximumFractionDigits must be >= minimumFractionDigits.
 * If the new value for maximumFractionDigits is less than the current value of minimumFractionDigits,
 * then minimumFractionDigits will also be set to the new value. 
 * @param {Number} newValue the new value to be set.
 */
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 872);
YNumberFormat.prototype.setMaximumFractionDigits = function(newValue) {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "setMaximumFractionDigits", 872);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 873);
this._numberFormatInstance._maxFracDigits = newValue;
        
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 875);
if(this.getMinimumFractionDigits() > newValue) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 876);
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
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 887);
YNumberFormat.prototype.setMaximumIntegerDigits = function(newValue) {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "setMaximumIntegerDigits", 887);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 888);
this._numberFormatInstance._maxIntDigits = newValue;
        
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 890);
if(this.getMinimumIntegerDigits() > newValue) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 891);
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
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 902);
YNumberFormat.prototype.setMinimumFractionDigits = function(newValue) {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "setMinimumFractionDigits", 902);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 903);
this._numberFormatInstance._minFracDigits = newValue;
        
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 905);
if(this.getMaximumFractionDigits() < newValue) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 906);
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
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 917);
YNumberFormat.prototype.setMinimumIntegerDigits = function(newValue) {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "setMinimumIntegerDigits", 917);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 918);
this._numberFormatInstance._minIntDigits = newValue;
        
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 920);
if(this.getMaximumIntegerDigits() < newValue) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 921);
this.setMaximumIntegerDigits(newValue);
    }
}
    
/**
 * Sets whether or not numbers should be parsed as integers only. 
 * @param {Boolean} newValue set True, this format will parse numbers as integers only.
 */
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 929);
YNumberFormat.prototype.setParseIntegerOnly = function(newValue) {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "setParseIntegerOnly", 929);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 930);
this._numberFormatInstance._parseIntegerOnly = newValue;
}

_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 933);
Y.Number.deprecatedFormat = Y.Number.format;
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 934);
Y.Number.deprecatedParse = Y.Number.parse;

/**
 * Takes a Number and formats to string for display to user
 *
 * @for Number
 * @method format
 * @param data {Number} Number
 * @param config {Object} (Optional) Configuration values:
 *   <dl>
 *      <dt>style {Number/String} (Optional)</dt>
 *         <dd>Format/Style to use. See Y.Number.STYLES</dd>
 *      <dt>parseIntegerOnly {Boolean} (Optional)</dt>
 *         <dd>If true, only the whole number part of data will be used</dd>
 *   </dl>
 * @return {String} Formatted string representation of data
 */
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 951);
Y.Number.format = function(data, config) {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "format", 951);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 952);
config = config || {};
    
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 954);
if(config.prefix != null || config.decimalPlaces != null || config.decimalSeparator != null || config.thousandsSeparator != null || config.suffix != null) {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 955);
return Y.Number.deprecatedFormat(data, config);
    }
    
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 958);
try {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 959);
var formatter = new YNumberFormat(config.style);
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 960);
if(config.parseIntegerOnly) {
            _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 961);
formatter.setParseIntegerOnly(true);
        }
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 963);
return formatter.format(data);
    } catch(e) {
        //Error. Fallback to deprecated format
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 966);
console.log(e);
    }
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 968);
return Y.Number.deprecatedFormat(data, config);
}

/**
 * Parses data and returns a number
 * 
 * @for Number
 * @method format
 * @param data {String} Data to be parsed
 * @param config (Object} (Optional) Object containg 'style' (Pattern data is represented in. See Y.Number.STYLES) and 'parsePosition' (index position in data to start parsing at) Both parameters are optional. If omitted, style defaults to NUMBER_STYLE, and parsePosition defaults to 0
 * @return {Number} Number represented by data 
 */
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 980);
Y.Number.parse = function(data, config) {
    _yuitest_coverfunc("build/datatype-number-advanced-format/datatype-number-advanced-format.js", "parse", 980);
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 981);
try {
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 982);
var formatter = new YNumberFormat(config.style);
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 983);
return formatter.parse(data, config.parsePosition);
    } catch(e) {
        //Fallback on deprecated parse
        _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 986);
console.log(e);
    }
    
    _yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 989);
return Y.Number.parse(data);
}

//Update Parsers shortcut
_yuitest_coverline("build/datatype-number-advanced-format/datatype-number-advanced-format.js", 993);
Y.namespace("Parsers").number = Y.Number.parse


}, '@VERSION@', {"lang": [], "requires": ["datatype-number-format", "datatype-number-parse"]});
