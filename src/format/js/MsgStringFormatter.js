StringFormatter = function(values) {
    Formatter.call(this, values);
    this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*}";
}

StringFormatter.prototype = new Formatter;
StringFormatter.prototype.constructor = StringFormatter;

StringFormatter.createInstance = function(values) {
    return new StringFormatter(values);
}

StringFormatter.prototype.getParams = function(params, matches) {
    if(matches && matches[1]) {
        params.key = matches[1];
        if(Formatter.prototype.getParams.call(this, params)) {
            return true;
        }
    }
	
    return false;
}

StringFormatter.prototype.format = function(str) {
    var regex = new RegExp(this.regex, "gm");
    var matches = null;
    while((matches = regex.exec(str))) {
        var params = {};

        if(this.getParams(params, matches)) {
            //Got a match
            str = str.replace(matches[0], params.value);
        }

    }

    return str;
}
