SelectFormatter = function(values) {
    Formatter.call(this, values);
    this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*select\\s*,\\s*";
}

SelectFormatter.prototype = new Formatter;
SelectFormatter.prototype.constructor = SelectFormatter;


SelectFormatter.createInstance = function(values) {
    return new SelectFormatter(values);
}

SelectFormatter.prototype.getParams = function(params, matches) {
    if(matches) {
        if(matches[1]) {
            params.key = matches[1];
        }
    }

    if(params.key && Formatter.prototype.getParams.call(this, params)) {
        return true;
    }

    return false;
}

SelectFormatter.prototype.parseOptions = function(str, start) {
    var options = {};
    var key = "", value = "", current = "";
    for(var i=start; i<str.length; i++) {
        var ch = str.charAt(i);
        if (ch == '\\') {
            current += ch + str.charAt(i+1);
            i++;
        } else if (ch == '}') {
            if(current == "") {
                i++;
                break;
            }
            value = current;
            options[key.trim()] = value;
            current = key = value = "";
        } else if (ch == '{') {
            key = current;
            current = "";
        } else {
            current += ch;
        }		
    }

    if(current != "") { 
        return null;
    }

    return {
        options: options, 
        next: i
    };
}

SelectFormatter.prototype.select = function(options, params) {
    for ( var key in options ) {
        if( key == "other" ) {
            continue;	//Will use this only if everything else fails
        }

        if( key == params.value ) {
            return options[key];
        }
    }

    return options["other"];
}

SelectFormatter.prototype.format = function(str) {
    var regex = new RegExp(this.regex, "gm");
    var matches = null;
    while((matches = regex.exec(str))) {
        var params = {};

        if(this.getParams(params, matches)) {
            //Got a match
            var options = this.parseOptions(str, regex.lastIndex);
            if(!options) {
                continue;
            }

            regex.lastIndex = options.next;
            options = options.options;

            var result = this.select(options, params);
            if(result) {
                var start = str.indexOf(matches[0]);
                str = str.slice(0, start) + result + str.slice(regex.lastIndex);
            }
        }

    }

    return str;
}
