NumberFormatter = function(values) {
    Formatter.call(this, values);
    this.styles = {
        "integer": Y.Number.STYLES.NUMBER_STYLE,
        "percent": Y.Number.STYLES.PERCENT_STYLE,
        "currency": Y.Number.STYLES.CURRENCY_STYLE
    };
    this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*number\\s*(,\\s*(\\w+)\\s*)?}";
}

NumberFormatter.prototype = new Formatter;
NumberFormatter.prototype.constructor = NumberFormatter;

NumberFormatter.createInstance = function(values) {
    return new NumberFormatter(values);
}

NumberFormatter.prototype.getParams = function(params, matches) {
    if(matches) {
        if(matches[1]) {
            params.key = matches[1];
        }
        if(matches[3]) {
            params.style = matches[3];
        }
    }

    if(!params.style) {
        params.style = "integer";	//If no style, default to medium
	params.showDecimal = true;	//Show decimal parts too
    }

    if(!this.styles[params.style]) {	//Invalid style
        return false;
    }

    if(params.key && Formatter.prototype.getParams.call(this, params)) {
        return true;
    }

    return false;
}

NumberFormatter.prototype.format = function(str) {
    var regex = new RegExp(this.regex, "gm");
    var matches = null;
    while((matches = regex.exec(str))) {
        var params = {};

        if(this.getParams(params, matches)) {
            //Got a match
            var config = {
                style: this.styles[params.style]
            }
            if(params.style == "integer" && !params.showDecimal) { config.parseIntegerOnly = true; }
            str = str.replace(matches[0], Y.Number.format(params.value, config));
        }
    }

    return str;
}
