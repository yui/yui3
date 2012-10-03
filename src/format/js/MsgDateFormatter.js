DateFormatter = function(values) {
    Formatter.call(this, values);
    this.styles = {
        "short":  [ Y.DateFormat.DATE_FORMATS.YMD_SHORT, 0, 0 ],
        "medium": [ Y.DateFormat.DATE_FORMATS.YMD_ABBREVIATED,0, 0 ],
        "long":   [ Y.DateFormat.DATE_FORMATS.YMD_LONG, 0, 0 ],
        "full":   [ Y.DateFormat.DATE_FORMATS.WYMD_LONG, 0, 0 ]
    };
    this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*date\\s*(,\\s*(\\w+)\\s*)?}";
}

DateFormatter.prototype = new Formatter;
DateFormatter.prototype.constructor = DateFormatter;

DateFormatter.createInstance = function(values) {
    return new DateFormatter(values);
}

DateFormatter.prototype.getParams = function(params, matches) {
    if(matches) {
        if(matches[1]) {
            params.key = matches[1];
        }
        if(matches[3]) {
            params.style = matches[3];
        }
    }

    if(!params.style) {
        params.style = "medium";
    }			//If no style, default to medium

    if(!this.styles[params.style]) {
        return false;
    }	//Invalid style

    if(params.key && Formatter.prototype.getParams.call(this, params)) {
        return true;
    }

    return false;
}

DateFormatter.prototype.format = function(str) {
    var regex = new RegExp(this.regex, "gm");
    var matches = null;
    while((matches = regex.exec(str))) {
        var params = {};

        if(this.getParams(params, matches)) {
            //Got a match
            var style = this.styles[params.style];
            var format = new Y.DateFormat(Formatter.getTimeZone(), style[0], style[1], style[2]);
            str = str.replace(matches[0], format.format(new Date(params.value)));
        }

    }

    return str;
}
