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

var MODULE_NAME = "datatype-number-advanced-format";

NumberFormat = function(pattern, formats, skipNegFormat) {
    if (arguments.length == 0) {
        return;
    }

    NumberFormat.superclass.constructor.call(this, pattern, formats);
    if (!pattern) {
        return;
    }

    if(pattern == "{plural_style}") {
        pattern = this.Formats.decimalFormat;
        this._isPluralCurrency = true;
        this._pattern = pattern;
    }

    //Default currency
    this.currency = this.Formats.defaultCurrency;
    if(this.currency == null || this.currency == "") {
        this.currency = "USD";
    }
        
    var patterns = pattern.split(/;/);
    pattern = patterns[0];
	
    this._useGrouping = (pattern.indexOf(",") != -1);      //Will be set to true if pattern uses grouping
    this._parseIntegerOnly = (pattern.indexOf(".") == -1);  //Will be set to false if pattern contains fractional parts
        
    //If grouping is used, find primary and secondary grouping
    if(this._useGrouping) {
        var numberPattern = pattern.match(/[0#,]+/);
        var groupingRegex = new RegExp("[0#]+", "g");
        var groups = numberPattern[0].match(groupingRegex);
            
        var i = groups.length - 2;
        this._primaryGrouping = groups[i+1].length;
        this._secondaryGrouping = (i > 0 ? groups[i].length : groups[i+1].length);
    }
        
    // parse prefix
    i = 0;
        
    var results = this.__parseStatic(pattern, i);
    i = results.offset;
    var hasPrefix = results.text != "";
    if (hasPrefix) {
        this._segments.push(new Format.TextSegment(this, results.text));
    }
	
    // parse number descriptor
    var start = i;
    while (i < pattern.length &&
        NumberFormat._META_CHARS.indexOf(pattern.charAt(i)) != -1) {
        i++;
    }
    var end = i;

    var numPattern = pattern.substring(start, end);
    var e = numPattern.indexOf(this.Formats.exponentialSymbol);
    var expon = e != -1 ? numPattern.substring(e + 1) : null;
    if (expon) {
        numPattern = numPattern.substring(0, e);
        this._showExponent = true;
    }
	
    var dot = numPattern.indexOf('.');
    var whole = dot != -1 ? numPattern.substring(0, dot) : numPattern;
    if (whole) {
        /*var comma = whole.lastIndexOf(',');
            if (comma != -1) {
                this._groupingOffset = whole.length - comma - 1;
            }*/
        whole = whole.replace(/[^#0]/g,"");
        var zero = whole.indexOf('0');
        if (zero != -1) {
            this._minIntDigits = whole.length - zero;
        }
        this._maxIntDigits = whole.length;
    }
	
    var fract = dot != -1 ? numPattern.substring(dot + 1) : null;
    if (fract) {
        zero = fract.lastIndexOf('0');
        if (zero != -1) {
            this._minFracDigits = zero + 1;
        }
        this._maxFracDigits = fract.replace(/[^#0]/g,"").length;
    }
	
    this._segments.push(new NumberFormat.NumberSegment(this, numPattern));
	
    // parse suffix
    results = this.__parseStatic(pattern, i);
    i = results.offset;
    if (results.text != "") {
        this._segments.push(new Format.TextSegment(this, results.text));
    }
	
    // add negative formatter
    if (skipNegFormat) return;
	
    if (patterns.length > 1) {
        pattern = patterns[1];
        this._negativeFormatter = new NumberFormat(pattern, formats, true);
    }
    else {
        // no negative pattern; insert minus sign before number segment
        var formatter = new NumberFormat("", formats);
        formatter._segments = formatter._segments.concat(this._segments);

        var index = hasPrefix ? 1 : 0;
        var minus = new Format.TextSegment(formatter, this.Formats.minusSign);
        formatter._segments.splice(index, 0, minus);
		
        this._negativeFormatter = formatter;
    }
}

Y.extend(NumberFormat, Format);
    
// Constants

Y.mix(NumberFormat, {
    _NUMBER: "number",
    _INTEGER: "integer",
    _CURRENCY: "currency",
    _PERCENT: "percent",

    _META_CHARS: "0#.,E"
});

// Data

NumberFormat.prototype._groupingOffset = Number.MAX_VALUE;
//NumberFormat.prototype._maxIntDigits;
NumberFormat.prototype._minIntDigits = 1;
//NumberFormat.prototype._maxFracDigits;
//NumberFormat.prototype._minFracDigits;
NumberFormat.prototype._isCurrency = false;
NumberFormat.prototype._isPercent = false;
NumberFormat.prototype._isPerMille = false;
NumberFormat.prototype._showExponent = false;
//NumberFormat.prototype._negativeFormatter;

// Public methods

NumberFormat.prototype.format = function(number) {
    if (number < 0 && this._negativeFormatter) {
        return this._negativeFormatter.format(number);
    }
        
    var result = Format.prototype.format.call(this, number);
        
    if(this._isPluralCurrency) {
        var pattern = "";
        if(number == 1) {
            //Singular
            pattern = this.Formats.currencyPatternSingular;
            pattern = pattern.replace("{1}", this.Formats[this.currency + "_currencySingular"]);
        } else {
            //Plural
            pattern = this.Formats.currencyPatternPlural;
            pattern = pattern.replace("{1}", this.Formats[this.currency + "_currencyPlural"]);
        }
            
        result = pattern.replace("{0}", result);
    }
        
    return result;
};
    
NumberFormat.prototype.parse = function(s, pp) {
    if(s.indexOf(this.Formats.minusSign) != -1 && this._negativeFormatter) {
        return this._negativeFormatter.parse(s, pp);
    }
        
    if(this._isPluralCurrency) {
        var singular = this.Formats[this.currency + "_currencySingular"];
        var plural = this.Formats[this.currency + "_currencyPlural"];
            
        s = s.replace(plural, "").replace(singular, "").trim();
    }
        
    var object = null;
    try {
        object = Format.prototype.parse.call(this, s, pp);
        object = object.value;
    } catch(e) {
        Y.log("Failed to parse: " + s + ". Exception: " + e);
    }
        
    return object;
}

// Private methods

NumberFormat.prototype.__parseStatic = function(s, i) {
    var data = [];
    while (i < s.length) {
        var c = s.charAt(i++);
        if (NumberFormat._META_CHARS.indexOf(c) != -1) {
            i--;
            break;
        }
        switch (c) {
            case "'": {
                var start = i;
                while (i < s.length && s.charAt(i++) != "'") {
                // do nothing
                }
                var end = i;
                c = end - start == 0 ? "'" : s.substring(start, end);
                break;
            }
            case '%': {
                c = this.Formats.percentSign; 
                this._isPercent = true;
                break;
            }
            case '\u2030': {
                c = this.Formats.perMilleSign; 
                this._isPerMille = true;
                break;
            }
            case '\u00a4': {
                if(s.charAt(i) == '\u00a4') {
                    c = this.Formats[this.currency + "_currencyISO"];
                    i++;
                } else {
                    c = this.Formats[this.currency + "_currencySymbol"];
                }
                this._isCurrency = true;
                break;
            }
        }
        data.push(c);
    }
    return {
        text: data.join(""), 
        offset: i
    };
};
    
NumberFormat.prototype._createParseObject = function() {
    return {
        value: null
    };
};
    
//
// NumberFormat.NumberSegment class
//

NumberFormat.NumberSegment = function(format, s) {
    if (arguments.length == 0) return;
    NumberFormat.NumberSegment.superclass.constructor.call(this, format, s);
};
Y.extend(NumberFormat.NumberSegment, Format.Segment);
    
// Public methods

NumberFormat.NumberSegment.prototype.format = function(number) {
    // special values
    if (isNaN(number)) return this._parent.Formats.nanSymbol;
    if (number === Number.NEGATIVE_INFINITY || number === Number.POSITIVE_INFINITY) {
        return this._parent.Formats.infinitySign;
    }

    // adjust value
    if (typeof number != "number") number = Number(number);
    number = Math.abs(number); // NOTE: minus sign is part of pattern
    if (this._parent._isPercent) number *= 100;
    else if (this._parent._isPerMille) number *= 1000;
    if(this._parent._parseIntegerOnly) number = Math.floor(number);
        
    // format
    var expon = this._parent.Formats.exponentialSymbol;
    var exponReg = new RegExp(expon + "+");
    var s = this._parent._showExponent
    ? number.toExponential(this._parent._maxFracDigits).toUpperCase().replace(exponReg,expon)
    : number.toFixed(this._parent._maxFracDigits || 0);
    s = this._normalize(s);
    return s;
};

// Protected methods

NumberFormat.NumberSegment.prototype._normalize = function(s) {
    var exponSymbol = this._parent.Formats.exponentialSymbol;
    var splitReg = new RegExp("[\\." + exponSymbol + "]")
    var match = s.split(splitReg);
	
    // normalize whole part
    var whole = match.shift();
    if (whole.length < this._parent._minIntDigits) {
        whole = zeroPad(whole, this._parent._minIntDigits, this._parent.Formats.numberZero);
    }
    if (whole.length > this._parent._primaryGrouping && this._parent._useGrouping) {
        var a = [];
	    
        var offset = this._parent._primaryGrouping;
        var i = whole.length - offset;
        while (i > 0) {
            a.unshift(whole.substr(i, offset));
            a.unshift(this._parent.Formats.groupingSeparator);
            offset = this._parent._secondaryGrouping;
            i -= offset;
        }
        a.unshift(whole.substring(0, i + offset));
		
        whole = a.join("");
    }
	
    // normalize rest
    var fract = '0';
    var expon;
        
    if(s.match(/\./))
        fract = match.shift();
    else if(s.match(/\e/) || s.match(/\E/))
        expon = match.shift();

    fract = fract.replace(/0+$/,"");
    if (fract.length < this._parent._minFracDigits) {
        fract = zeroPad(fract, this._parent._minFracDigits, this._parent.Formats.numberZero, true);
    }
	
    a = [ whole ];
    if (fract.length > 0) {
        var decimal = this._parent.Formats.decimalSeparator;
        a.push(decimal, fract);
    }
    if (expon) {
        a.push(exponSymbol, expon.replace(/^\+/,""));
    }
	
    // return normalize result
    return a.join("");
}
    
NumberFormat.NumberSegment.prototype.parse = function(object, s, index) {
    var comma = this._parent.Formats.groupingSeparator;
    var dot = this._parent.Formats.decimalSeparator;
    var minusSign = this._parent.Formats.minusSign;
    var expon = this._parent.Formats.exponentialSymbol;
        
    var numberRegexPattern = "[\\" + minusSign + "0-9" + comma + "]+";
    if(!this._parent._parseIntegerOnly) {
        numberRegexPattern += "(\\" + dot + "[0-9]+)?";
    }
    if(this._parent._showExponent) {
        numberRegexPattern += "(" + expon +"\\+?[0-9]+)";
    }
        
    var numberRegex = new RegExp(numberRegexPattern);
    var matches = s.match(numberRegex);
        
    if(!matches) {
        throw new Format.ParsingException("Number does not match pattern");
    }
        
    var negativeNum = s.indexOf(minusSign) != -1;
    var endIndex = index + matches[0].length;
    s = s.slice(index, endIndex);
        
    var scientific = null;
        
    //Scientific format does not use grouping
    if(this._parent.showExponent) {
        scientific = s.split(expon);
    } else if(this._parent._useGrouping) {
        //Verify grouping data exists
        if(!this._parent._primaryGrouping) {
            //Should not happen
            throw new Format.ParsingException("Invalid pattern");
        }
            
        //Verify grouping is correct
        var i = s.length - this._parent._primaryGrouping - 1;
            
        if(matches[1]) {
            //If there is a decimal part, ignore that. Grouping assumed to apply only to whole number part
            i = i - matches[1].length;
        }
            
        //Use primary grouping for first group
        if(i > 0) {
            //There should be a comma at i
            if(s.charAt(i) != ',') {
                throw new Format.ParsingException("Number does not match pattern");
            }
                
            //Remove comma
            s = s.slice(0, i) + s.slice(i+1);
        }
            
        //If more groups, use primary/secondary grouping as applicable
        var grouping = this._parent._secondaryGrouping || this._parent._primaryGrouping;
        i = i - grouping - 1;
            
        while(i > 0) {
            //There should be a comma at i
            if(s.charAt(i) != ',') {
                throw new Format.ParsingException("Number does not match pattern");
            }
                
            //Remove comma
            s = s.slice(0, i) + s.slice(i+1);
            i = i - grouping - 1;
        }
            
        //Verify there are no more grouping separators
        if(s.indexOf(comma) != -1) {
            throw new Format.ParsingException("Number does not match pattern");
        }
    }
        
    if(scientific) {
        object.value = parseFloat(scientific[0], 10) * Math.pow(10, parseFloat(scientific[1], 10));
    } else {
        object.value = parseFloat(s, 10);
    }
        
    //Special types
    if(negativeNum) object.value *= -1;
    if (this._parent._isPercent) object.value /= 100;
    else if (this._parent._isPerMille) object.value /= 1000;
        
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
YNumberFormat = function(style) {
    style = style || Y.Number.STYLES.NUMBER_STYLE;
    
    if(Y.Lang.isString(style)) {
        style = Y.Number.STYLES[style];
    }
    
    var pattern = "";
    var formats = Y.Intl.get(MODULE_NAME);
    switch(style) {
        case Y.Number.STYLES.CURRENCY_STYLE:
            pattern = formats.currencyFormat;
            break;
        case Y.Number.STYLES.ISO_CURRENCY_STYLE:
            pattern = formats.currencyFormat;
            pattern = pattern.replace("\u00a4", "\u00a4\u00a4");
            break;
        case Y.Number.STYLES.NUMBER_STYLE:
            pattern = formats.decimalFormat;
            break;
        case Y.Number.STYLES.PERCENT_STYLE:
            pattern = formats.percentFormat;
            break;
        case Y.Number.STYLES.PLURAL_CURRENCY_STYLE:
            //This is like <value> <currency>. This may be dependent on whether the value is singular or plural. Will be handled during formatting
            pattern = "{plural_style}";
            break;
        case Y.Number.STYLES.SCIENTIFIC_STYLE:
            pattern = formats.scientificFormat;
            break;
    }
        
    this._numberFormatInstance = new NumberFormat(pattern, formats);
}
    
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
        return new YNumberFormat(style);
    },
    
    /**
     * Returns an array of BCP 47 language tags for the languages supported by this class
     * @return {Array} an array of BCP 47 language tags for the languages supported by this class.
     */
    getAvailableLocales: function() {
        return Y.Intl.getAvailableLangs(MODULE_NAME);
    }
});



    
//Public methods
    
/**
 * Format a number to product a String.
 * @param {Number} number the number to format
 */
YNumberFormat.prototype.format = function(number) {
    return this._numberFormatInstance.format(number);
}
    
/**
 * Gets the currency used to display currency amounts. This may be an empty string for some cases. 
 * @return {String} a 3-letter ISO code indicating the currency in use, or an empty string.
 */
YNumberFormat.prototype.getCurrency = function() {
    return this._numberFormatInstance.currency;
}
    
/**
 * Returns the maximum number of digits allowed in the fraction portion of a number. 
 * @return {Number} the maximum number of digits allowed in the fraction portion of a number.
 */
YNumberFormat.prototype.getMaximumFractionDigits = function() {
    return this._numberFormatInstance._maxFracDigits || 0;
}
    
/**
 * Returns the maximum number of digits allowed in the integer portion of a number. 
 * @return {Number} the maximum number of digits allowed in the integer portion of a number.
 */
YNumberFormat.prototype.getMaximumIntegerDigits = function() {
    return this._numberFormatInstance._maxIntDigits || 0;
}
    
/**
 * Returns the minimum number of digits allowed in the fraction portion of a number. 
 * @return {Number} the minimum number of digits allowed in the fraction portion of a number.
 */
YNumberFormat.prototype.getMinimumFractionDigits = function() {
    return this._numberFormatInstance._minFracDigits || 0;
}
    
/**
 * Returns the minimum number of digits allowed in the integer portion of a number.
 * @return {Number} the minimum number of digits allowed in the integer portion of a number.
 */
YNumberFormat.prototype.getMinimumIntegerDigits = function() {
    return this._numberFormatInstance._minIntDigits || 0;
}
    
/**
 * Returns true if grouping is used in this format.
 * For example, in the English locale, with grouping on, the number 1234567 might be formatted as "1,234,567".
 * The grouping separator as well as the size of each group is locale dependant.
 * @return {Boolean}
 */
YNumberFormat.prototype.isGroupingUsed = function() {
    return this._numberFormatInstance._useGrouping;
}
    
/**
 * Return true if this format will parse numbers as integers only.
 * For example in the English locale, with ParseIntegerOnly true, the string "1234." would be parsed as the integer value 1234
 * and parsing would stop at the "." character. Of course, the exact format accepted by the parse operation is locale dependant.
 * @return {Boolean}
 */
YNumberFormat.prototype.isParseIntegerOnly = function() {
    return this._numberFormatInstance._parseIntegerOnly;
}
    
/**
 * Parse the string to get a number
 * @param {String} txt The string to parse
 * @param {Number} pp (Optional) Parse position. The position to start parsing at. Defaults to 0
 */
YNumberFormat.prototype.parse = function(txt, pp) {
    return this._numberFormatInstance.parse(txt, pp);
}
    
/**
 * Sets the currency used to display currency amounts.
 * This takes effect immediately, if this format is a currency format.
 * If this format is not a currency format, then the currency is used if and when this object becomes a currency format.
 * @param {String} currency a 3-letter ISO code indicating new currency to use. May be the empty string to indicate no currency.
 */
YNumberFormat.prototype.setCurrency = function(currency) {
    this._numberFormatInstance.currency = currency;
}
    
/**
 * Set whether or not grouping will be used in this format. 
 * @param {Boolean} value
 */
YNumberFormat.prototype.setGroupingUsed = function(value) {
    this._numberFormatInstance._useGrouping = value;
}
    
/**
 * Sets the maximum number of digits allowed in the fraction portion of a number.
 * maximumFractionDigits must be >= minimumFractionDigits.
 * If the new value for maximumFractionDigits is less than the current value of minimumFractionDigits,
 * then minimumFractionDigits will also be set to the new value. 
 * @param {Number} newValue the new value to be set.
 */
YNumberFormat.prototype.setMaximumFractionDigits = function(newValue) {
    this._numberFormatInstance._maxFracDigits = newValue;
        
    if(this.getMinimumFractionDigits() > newValue) {
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
YNumberFormat.prototype.setMaximumIntegerDigits = function(newValue) {
    this._numberFormatInstance._maxIntDigits = newValue;
        
    if(this.getMinimumIntegerDigits() > newValue) {
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
YNumberFormat.prototype.setMinimumFractionDigits = function(newValue) {
    this._numberFormatInstance._minFracDigits = newValue;
        
    if(this.getMaximumFractionDigits() < newValue) {
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
YNumberFormat.prototype.setMinimumIntegerDigits = function(newValue) {
    this._numberFormatInstance._minIntDigits = newValue;
        
    if(this.getMaximumIntegerDigits() < newValue) {
        this.setMaximumIntegerDigits(newValue);
    }
}
    
/**
 * Sets whether or not numbers should be parsed as integers only. 
 * @param {Boolean} newValue set True, this format will parse numbers as integers only.
 */
YNumberFormat.prototype.setParseIntegerOnly = function(newValue) {
    this._numberFormatInstance._parseIntegerOnly = newValue;
}
