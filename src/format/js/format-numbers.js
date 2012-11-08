
Y.Number.deprecatedFormat = Y.Number.format;
Y.Number.deprecatedParse = Y.Number.parse;

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