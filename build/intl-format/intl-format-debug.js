YUI.add('intl-format', function (Y, NAME) {

//For MessageFormat

UnsupportedOperationException = function(message) {
    this.message = message;
    this.toString = function() {
        return "UnsupportedOperationException: " + this.message;
    }
}

Formatter = function(values) {
    this.values = values;
};

//Static methods

Formatter.createInstance = function(values) {
    //return new Formatter(values);
    throw new UnsupportedOperationException('Not implemented');	//Must override in descendants
};

//Public methods

Formatter.prototype.getValue = function(key) {
    if(Y.Lang.isArray(this.values)) {
        key = parseInt(key); 
    }
    return this.values[key];
};

Formatter.prototype.getParams = function(params) {
    if(!params || !params.key) {
        return false;
    }

    var value = this.getValue(params.key);
	
    if(value != null) {
        params.value = value;
        return true;
    }

    return false;
};

Formatter.prototype.format = function(str, config) {
    throw new UnsupportedOperationException('Not implemented');	//Must override in descendants
};

//For date and time formatters
Y.mix(Formatter, {
    getCurrentTimeZone: function() {
        var systemTZoneOffset = (new Date()).getTimezoneOffset()*-60;
        return Y.Date.Timezone.getTimezoneIdForOffset(systemTZoneOffset); 
    }
})

if(String.prototype.trim == null) {
    String.prototype.trim = function() {
        return this.replace(/^\s+/, '').replace(/\s+$/, '');
    };
}
StringFormatter = function(values) {
    StringFormatter.superclass.constructor.call(this, values);
    this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*}";
}

Y.extend(StringFormatter, Formatter);

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
DateFormatter = function(values) {
    DateFormatter.superclass.constructor.call(this, values);
    this.styles = {
        "short":  [ Y.Date.DATE_FORMATS.YMD_SHORT, 0, 0 ],
        "medium": [ Y.Date.DATE_FORMATS.YMD_ABBREVIATED,0, 0 ],
        "long":   [ Y.Date.DATE_FORMATS.YMD_LONG, 0, 0 ],
        "full":   [ Y.Date.DATE_FORMATS.WYMD_LONG, 0, 0 ]
    };
    this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*date\\s*(,\\s*(\\w+)\\s*)?}";
}

Y.extend(DateFormatter, Formatter);

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

DateFormatter.prototype.format = function(str, config) {
    var regex = new RegExp(this.regex, "gm");
    var matches = null;
    while((matches = regex.exec(str))) {
        var params = {};

        if(this.getParams(params, matches)) {
            //Got a match
            var style = this.styles[params.style];
            var result = Y.Date.format(new Date(params.value), {
                timezone: config.timezone || Formatter.getCurrentTimeZone(),
                dateFormat: style[0],
                timeFormat: style[1],
                timezoneFormat: style[2]
            })
            str = str.replace(matches[0], result);
        }

    }

    return str;
}
TimeFormatter = function(values) {
    TimeFormatter.superclass.constructor.call(this, values);
    this.styles = {
        "short": [ 0, Y.Date.TIME_FORMATS.HM_SHORT, Y.Date.TIMEZONE_FORMATS.NONE ],
        "medium": [ 0, Y.Date.TIME_FORMATS.HM_ABBREVIATED, Y.Date.TIMEZONE_FORMATS.NONE ],
        "long": [ 0, Y.Date.TIME_FORMATS.HM_ABBREVIATED, Y.Date.TIMEZONE_FORMATS.Z_SHORT ],
        "full": [ 0, Y.Date.TIME_FORMATS.HM_ABBREVIATED, Y.Date.TIMEZONE_FORMATS.Z_ABBREVIATED ]
    };
    this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*time\\s*(,\\s*(\\w+)\\s*)?}";
}

Y.extend(TimeFormatter, DateFormatter);

TimeFormatter.createInstance = function(values) {
    return new TimeFormatter(values);
}
NumberFormatter = function(values) {
    NumberFormatter.superclass.constructor.call(this, values);
    this.styles = {
        "integer": Y.Number.STYLES.NUMBER_STYLE,
        "percent": Y.Number.STYLES.PERCENT_STYLE,
        "currency": Y.Number.STYLES.CURRENCY_STYLE
    };
    this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*number\\s*(,\\s*(\\w+)\\s*)?}";
}

Y.extend(NumberFormatter, Formatter);

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
SelectFormatter = function(values) {
    SelectFormatter.superclass.constructor.call(this, values);
    this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*select\\s*,\\s*";
}

Y.extend(SelectFormatter, Formatter);

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
PluralFormatter = function(values) {
    PluralFormatter.superclass.constructor.call(this, values);
    this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*plural\\s*,\\s*";
}

Y.extend(PluralFormatter, SelectFormatter);

PluralFormatter.createInstance = function(values) {
    return new PluralFormatter(values);
}

PluralFormatter.prototype.select = function(options, params) {
    var result = options.other;
    if(params.value == 0 && options.zero) {
        result = options.zero;
    }
    if(params.value == 1 && options.one) {
        result = options.one;
    }
    if(params.value == 2 && options.two) {
        result = options.two;
    }

    result = result.replace("#", new NumberFormatter({VAL: params.value}).format("{VAL, number, integer}"));	//Use 'number' to format this part

    return result;
}
ChoiceFormatter = function(values) {
    ChoiceFormatter.superclass.constructor.call(this, values);
    this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*choice\\s*,\\s*(.+)}";
}

Y.extend(ChoiceFormatter, SelectFormatter);

ChoiceFormatter.createInstance = function(values) {
    return new ChoiceFormatter(values);
}

ChoiceFormatter.prototype.parseOptions = function(choicesStr) {
    var options = [];
    var choicesArray = choicesStr.split("|");
    for (var i=0; i<choicesArray.length; i++) {
        var choice = choicesArray[i];
        var relations = ['#', '<', '\u2264'];
        for (var j=0; j<relations.length; j++) {
            var rel = relations[j];
            if(choice.indexOf(rel) != -1) {
                var mapping = choice.split(rel);
                var ch = {
                    value: mapping[0],
                    result: mapping[1],
                    relation: rel
                };
                options.push(ch);
                break;
            }
        }
    }

    return options;
}

ChoiceFormatter.prototype.getParams = function(params, matches) {
    if(SelectFormatter.prototype.getParams.call(this, params, matches)) {
        if(matches[2]) {
            params.choices = this.parseOptions(matches[2]);
            return params.choices === [] ? false: true;
        }
    }

    return false;
}

ChoiceFormatter.prototype.select = function(params) {
    for ( var i=0; i<params.choices.length; i++) {
        var choice = params.choices[i];
        var value = choice.value, result = choice.result, relation = choice.relation;
        if( (relation == '#' && value == params.value) || (relation == '<' && value < params.value) || (relation == '\u2264' && value <= params.value)) {
        return result;
        }
    }

    return "";
}

ChoiceFormatter.prototype.format = function(str) {
    var regex = new RegExp(this.regex, "gm");
    var matches = null;
    while((matches = regex.exec(str))) {
        var params = {};

        if(this.getParams(params, matches)) {
            var result = this.select(params);
            if(result) {
                str = str.replace(matches[0], result);
            }
        }
    }

    return str;
}
/**
 * Formatter classes. For each group found in the pattern, will try to parse with all of these formatters.
 * If a formatter fails to parse, the next one in the list try to do so.
 */
var formatters = [ StringFormatter, DateFormatter, TimeFormatter, NumberFormatter, ChoiceFormatter, PluralFormatter, SelectFormatter ];

Y.mix(Y.Intl, {
    formatMessage: function(pattern, values, config) {
        config = config || {};
        for(var i=0; i<formatters.length; i++) {
            var formatter = formatters[i].createInstance(values);
            pattern = formatter.format(pattern, config);
        }
        return pattern;
    }
})


}, '@VERSION@', {"requires": ["datatype-date-advanced-format", "datatype-number-advanced-format", "intl"]});
