
Y.Number.deprecatedFormat = Y.Number.format;
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
Y.Number.format = function(data, config) {
    config = config || {};
    
    if(config.prefix != null || config.decimalPlaces != null || config.decimalSeparator != null || config.thousandsSeparator != null || config.suffix != null) {
        return Y.Number.deprecatedFormat(data, config);
    }
    
    try {
        var formatter = new YNumberFormat(config.style);
        if(config.parseIntegerOnly) {
            formatter.setParseIntegerOnly(true);
        }
        return formatter.format(data);
    } catch(e) {
        //Error. Fallback to deprecated format
        console.log(e);
    }
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
Y.Number.parse = function(data, config) {
    try {
        var formatter = new YNumberFormat(config.style);
        return formatter.parse(data, config.parsePosition);
    } catch(e) {
        //Fallback on deprecated parse
        console.log(e);
    }
    
    return Y.Number.parse(data);
}

//Update Parsers shortcut
Y.namespace("Parsers").number = Y.Number.parse
