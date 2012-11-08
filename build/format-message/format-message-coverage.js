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
_yuitest_coverage["build/format-message/format-message.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/format-message/format-message.js",
    code: []
};
_yuitest_coverage["build/format-message/format-message.js"].code=["YUI.add('format-message', function (Y, NAME) {","","//For MessageFormat","","UnsupportedOperationException = function(message) {","    this.message = message;","}","","UnsupportedOperationException.prototype.toString = function() {","    return \"UnsupportedOperationException: \" + this.message;","}","","Formatter = function(values) {","    this.values = values;","};","","//Static methods","","Formatter.createInstance = function(values) {","    //return new Formatter(values);","    throw new UnsupportedOperationException('Not implemented');	//Must override in descendants","};","","//Public methods","","Formatter.prototype.getValue = function(key) {","    if(Y.Lang.isArray(this.values)) {","       key = parseInt(key); ","    }","    return this.values[key];","};","","Formatter.prototype.getParams = function(params) {","    if(!params || !params.key) {","        return false;","    }","","    var value = this.getValue(params.key);","	","    if(value != null) {","        params.value = value;","        return true;","    }","","    return false;","};","","Formatter.prototype.format = function(str) {","    throw new UnsupportedOperationException('Not implemented');	//Must override in descendants","};","","//For date and time formatters","Formatter.setTimeZone = function(timezone) {","    Formatter.timezone = timezone;","}","","Formatter.getTimeZone = function() {","    if(!this.timezone) {","        var systemTZoneOffset = (new Date()).getTimezoneOffset()*-60;","        Formatter.timezone = Y.TimeZone.getTimezoneIdForOffset(systemTZoneOffset); ","    }","    return Formatter.timezone;","}","","if(String.prototype.trim == null) {","    String.prototype.trim = function() {","        return this.replace(/^\\s+/, '').replace(/\\s+$/, '');","    };","}","StringFormatter = function(values) {","    Formatter.call(this, values);","    this.regex = \"{\\\\s*([a-zA-Z0-9_]+)\\\\s*}\";","}","","StringFormatter.prototype = new Formatter;","StringFormatter.prototype.constructor = StringFormatter;","","StringFormatter.createInstance = function(values) {","    return new StringFormatter(values);","}","","StringFormatter.prototype.getParams = function(params, matches) {","    if(matches && matches[1]) {","        params.key = matches[1];","        if(Formatter.prototype.getParams.call(this, params)) {","            return true;","        }","    }","	","    return false;","}","","StringFormatter.prototype.format = function(str) {","    var regex = new RegExp(this.regex, \"gm\");","    var matches = null;","    while((matches = regex.exec(str))) {","        var params = {};","","        if(this.getParams(params, matches)) {","            //Got a match","            str = str.replace(matches[0], params.value);","        }","","    }","","    return str;","}","DateFormatter = function(values) {","    Formatter.call(this, values);","    this.styles = {","        \"short\":  [ Y.Date.DATE_FORMATS.YMD_SHORT, 0, 0 ],","        \"medium\": [ Y.Date.DATE_FORMATS.YMD_ABBREVIATED,0, 0 ],","        \"long\":   [ Y.Date.DATE_FORMATS.YMD_LONG, 0, 0 ],","        \"full\":   [ Y.Date.DATE_FORMATS.WYMD_LONG, 0, 0 ]","    };","    this.regex = \"{\\\\s*([a-zA-Z0-9_]+)\\\\s*,\\\\s*date\\\\s*(,\\\\s*(\\\\w+)\\\\s*)?}\";","}","","DateFormatter.prototype = new Formatter;","DateFormatter.prototype.constructor = DateFormatter;","","DateFormatter.createInstance = function(values) {","    return new DateFormatter(values);","}","","DateFormatter.prototype.getParams = function(params, matches) {","    if(matches) {","        if(matches[1]) {","            params.key = matches[1];","        }","        if(matches[3]) {","            params.style = matches[3];","        }","    }","","    if(!params.style) {","        params.style = \"medium\";","    }			//If no style, default to medium","","    if(!this.styles[params.style]) {","        return false;","    }	//Invalid style","","    if(params.key && Formatter.prototype.getParams.call(this, params)) {","        return true;","    }","","    return false;","}","","DateFormatter.prototype.format = function(str) {","    var regex = new RegExp(this.regex, \"gm\");","    var matches = null;","    while((matches = regex.exec(str))) {","        var params = {};","","        if(this.getParams(params, matches)) {","            //Got a match","            var style = this.styles[params.style];","            var result = Y.Date.format(new Date(params.value), {","                timezone: Formatter.getTimeZone(),","                dateFormat: style[0],","                timeFormat: style[1],","                timezoneFormat: style[2]","            })","            str = str.replace(matches[0], result);","        }","","    }","","    return str;","}","TimeFormatter = function(values) {","    DateFormatter.call(this, values);","    this.styles = {","        \"short\": [ 0, Y.Date.TIME_FORMATS.HM_SHORT, Y.Date.TIMEZONE_FORMATS.NONE ],","        \"medium\": [ 0, Y.Date.TIME_FORMATS.HM_ABBREVIATED, Y.Date.TIMEZONE_FORMATS.NONE ],","        \"long\": [ 0, Y.Date.TIME_FORMATS.HM_ABBREVIATED, Y.Date.TIMEZONE_FORMATS.Z_SHORT ],","        \"full\": [ 0, Y.Date.TIME_FORMATS.HM_ABBREVIATED, Y.Date.TIMEZONE_FORMATS.Z_ABBREVIATED ]","    };","    this.regex = \"{\\\\s*([a-zA-Z0-9_]+)\\\\s*,\\\\s*time\\\\s*(,\\\\s*(\\\\w+)\\\\s*)?}\";","}","","TimeFormatter.prototype = new DateFormatter;","TimeFormatter.prototype.constructor = TimeFormatter;","","TimeFormatter.createInstance = function(values) {","    return new TimeFormatter(values);","}","NumberFormatter = function(values) {","    Formatter.call(this, values);","    this.styles = {","        \"integer\": Y.Number.STYLES.NUMBER_STYLE,","        \"percent\": Y.Number.STYLES.PERCENT_STYLE,","        \"currency\": Y.Number.STYLES.CURRENCY_STYLE","    };","    this.regex = \"{\\\\s*([a-zA-Z0-9_]+)\\\\s*,\\\\s*number\\\\s*(,\\\\s*(\\\\w+)\\\\s*)?}\";","}","","NumberFormatter.prototype = new Formatter;","NumberFormatter.prototype.constructor = NumberFormatter;","","NumberFormatter.createInstance = function(values) {","    return new NumberFormatter(values);","}","","NumberFormatter.prototype.getParams = function(params, matches) {","    if(matches) {","        if(matches[1]) {","            params.key = matches[1];","        }","        if(matches[3]) {","            params.style = matches[3];","        }","    }","","    if(!params.style) {","        params.style = \"integer\";	//If no style, default to medium","	params.showDecimal = true;	//Show decimal parts too","    }","","    if(!this.styles[params.style]) {	//Invalid style","        return false;","    }","","    if(params.key && Formatter.prototype.getParams.call(this, params)) {","        return true;","    }","","    return false;","}","","NumberFormatter.prototype.format = function(str) {","    var regex = new RegExp(this.regex, \"gm\");","    var matches = null;","    while((matches = regex.exec(str))) {","        var params = {};","","        if(this.getParams(params, matches)) {","            //Got a match","            var config = {","                style: this.styles[params.style]","            }","            if(params.style == \"integer\" && !params.showDecimal) { config.parseIntegerOnly = true; }","            str = str.replace(matches[0], Y.Number.format(params.value, config));","        }","    }","","    return str;","}","SelectFormatter = function(values) {","    Formatter.call(this, values);","    this.regex = \"{\\\\s*([a-zA-Z0-9_]+)\\\\s*,\\\\s*select\\\\s*,\\\\s*\";","}","","SelectFormatter.prototype = new Formatter;","SelectFormatter.prototype.constructor = SelectFormatter;","","","SelectFormatter.createInstance = function(values) {","    return new SelectFormatter(values);","}","","SelectFormatter.prototype.getParams = function(params, matches) {","    if(matches) {","        if(matches[1]) {","            params.key = matches[1];","        }","    }","","    if(params.key && Formatter.prototype.getParams.call(this, params)) {","        return true;","    }","","    return false;","}","","SelectFormatter.prototype.parseOptions = function(str, start) {","    var options = {};","    var key = \"\", value = \"\", current = \"\";","    for(var i=start; i<str.length; i++) {","        var ch = str.charAt(i);","        if (ch == '\\\\') {","            current += ch + str.charAt(i+1);","            i++;","        } else if (ch == '}') {","            if(current == \"\") {","                i++;","                break;","            }","            value = current;","            options[key.trim()] = value;","            current = key = value = \"\";","        } else if (ch == '{') {","            key = current;","            current = \"\";","        } else {","            current += ch;","        }		","    }","","    if(current != \"\") { ","        return null;","    }","","    return {","        options: options, ","        next: i","    };","}","","SelectFormatter.prototype.select = function(options, params) {","    for ( var key in options ) {","        if( key == \"other\" ) {","            continue;	//Will use this only if everything else fails","        }","","        if( key == params.value ) {","            return options[key];","        }","    }","","    return options[\"other\"];","}","","SelectFormatter.prototype.format = function(str) {","    var regex = new RegExp(this.regex, \"gm\");","    var matches = null;","    while((matches = regex.exec(str))) {","        var params = {};","","        if(this.getParams(params, matches)) {","            //Got a match","            var options = this.parseOptions(str, regex.lastIndex);","            if(!options) {","                continue;","            }","","            regex.lastIndex = options.next;","            options = options.options;","","            var result = this.select(options, params);","            if(result) {","                var start = str.indexOf(matches[0]);","                str = str.slice(0, start) + result + str.slice(regex.lastIndex);","            }","        }","","    }","","    return str;","}","PluralFormatter = function(values) {","    SelectFormatter.call(this, values);","    this.regex = \"{\\\\s*([a-zA-Z0-9_]+)\\\\s*,\\\\s*plural\\\\s*,\\\\s*\";","}","","PluralFormatter.prototype = new SelectFormatter;","PluralFormatter.prototype.constructor = PluralFormatter;","","","PluralFormatter.createInstance = function(values) {","    return new PluralFormatter(values);","}","","PluralFormatter.prototype.select = function(options, params) {","    var result = options.other;","    if(params.value == 0 && options.zero) {","        result = options.zero;","    }","    if(params.value == 1 && options.one) {","        result = options.one;","    }","    if(params.value == 2 && options.two) {","        result = options.two;","    }","","    result = result.replace(\"#\", new NumberFormatter({VAL: params.value}).format(\"{VAL, number, integer}\"));	//Use 'number' to format this part","","    return result;","}","ChoiceFormatter = function(values) {","    SelectFormatter.call(this, values);","    this.regex = \"{\\\\s*([a-zA-Z0-9_]+)\\\\s*,\\\\s*choice\\\\s*,\\\\s*(.+)}\";","}","","ChoiceFormatter.prototype = new SelectFormatter;","ChoiceFormatter.prototype.constructor = ChoiceFormatter;","","","ChoiceFormatter.createInstance = function(values) {","    return new ChoiceFormatter(values);","}","","ChoiceFormatter.prototype.parseOptions = function(choicesStr) {","    var options = [];","    var choicesArray = choicesStr.split(\"|\");","    for (var i=0; i<choicesArray.length; i++) {","        var choice = choicesArray[i];","        var relations = ['#', '<', '\\u2264'];","        for (var j=0; j<relations.length; j++) {","            var rel = relations[j];","            if(choice.indexOf(rel) != -1) {","                var mapping = choice.split(rel);","                var ch = {","                    value: mapping[0],","                    result: mapping[1],","                    relation: rel","                };","                options.push(ch);","                break;","            }","        }","    }","","    return options;","}","","ChoiceFormatter.prototype.getParams = function(params, matches) {","    if(SelectFormatter.prototype.getParams.call(this, params, matches)) {","        if(matches[2]) {","            params.choices = this.parseOptions(matches[2]);","            return params.choices === [] ? false: true;","        }","    }","","    return false;","}","","ChoiceFormatter.prototype.select = function(params) {","    for ( var i=0; i<params.choices.length; i++) {","        var choice = params.choices[i];","        var value = choice.value, result = choice.result, relation = choice.relation;","        if( (relation == '#' && value == params.value) || (relation == '<' && value < params.value) || (relation == '\\u2264' && value <= params.value)) {","        return result;","        }","    }","","    return \"\";","}","","ChoiceFormatter.prototype.format = function(str) {","    var regex = new RegExp(this.regex, \"gm\");","    var matches = null;","    while((matches = regex.exec(str))) {","        var params = {};","","        if(this.getParams(params, matches)) {","            var result = this.select(params);","            if(result) {","                str = str.replace(matches[0], result);","            }","        }","    }","","    return str;","}","/**"," * Formatter classes. For each group found in the pattern, will try to parse with all of these formatters."," * If a formatter fails to parse, the next one in the list try to do so."," */","var formatters = [ StringFormatter, DateFormatter, TimeFormatter, NumberFormatter, ChoiceFormatter, PluralFormatter, SelectFormatter ];","","Y.MessageFormat = {","    setTimeZone: Formatter.setTimeZone,","","    getTimeZone: Formatter.getTimeZone,","","    format: function(pattern, values) {","        for(var i=0; i<formatters.length; i++) {","            var formatter = formatters[i].createInstance(values);","            pattern = formatter.format(pattern);","        }","        return pattern;","    }","}","","","}, '@VERSION@', {\"requires\": [\"datatype-date-advanced-format\", \"datatype-number-advanced-format\"]});"];
_yuitest_coverage["build/format-message/format-message.js"].lines = {"1":0,"5":0,"6":0,"9":0,"10":0,"13":0,"14":0,"19":0,"21":0,"26":0,"27":0,"28":0,"30":0,"33":0,"34":0,"35":0,"38":0,"40":0,"41":0,"42":0,"45":0,"48":0,"49":0,"53":0,"54":0,"57":0,"58":0,"59":0,"60":0,"62":0,"65":0,"66":0,"67":0,"70":0,"71":0,"72":0,"75":0,"76":0,"78":0,"79":0,"82":0,"83":0,"84":0,"85":0,"86":0,"90":0,"93":0,"94":0,"95":0,"96":0,"97":0,"99":0,"101":0,"106":0,"108":0,"109":0,"110":0,"116":0,"119":0,"120":0,"122":0,"123":0,"126":0,"127":0,"128":0,"129":0,"131":0,"132":0,"136":0,"137":0,"140":0,"141":0,"144":0,"145":0,"148":0,"151":0,"152":0,"153":0,"154":0,"155":0,"157":0,"159":0,"160":0,"166":0,"171":0,"173":0,"174":0,"175":0,"181":0,"184":0,"185":0,"187":0,"188":0,"190":0,"191":0,"192":0,"197":0,"200":0,"201":0,"203":0,"204":0,"207":0,"208":0,"209":0,"210":0,"212":0,"213":0,"217":0,"218":0,"219":0,"222":0,"223":0,"226":0,"227":0,"230":0,"233":0,"234":0,"235":0,"236":0,"237":0,"239":0,"241":0,"244":0,"245":0,"249":0,"251":0,"252":0,"253":0,"256":0,"257":0,"260":0,"261":0,"264":0,"265":0,"266":0,"267":0,"271":0,"272":0,"275":0,"278":0,"279":0,"280":0,"281":0,"282":0,"283":0,"284":0,"285":0,"286":0,"287":0,"288":0,"289":0,"291":0,"292":0,"293":0,"294":0,"295":0,"296":0,"298":0,"302":0,"303":0,"306":0,"312":0,"313":0,"314":0,"315":0,"318":0,"319":0,"323":0,"326":0,"327":0,"328":0,"329":0,"330":0,"332":0,"334":0,"335":0,"336":0,"339":0,"340":0,"342":0,"343":0,"344":0,"345":0,"351":0,"353":0,"354":0,"355":0,"358":0,"359":0,"362":0,"363":0,"366":0,"367":0,"368":0,"369":0,"371":0,"372":0,"374":0,"375":0,"378":0,"380":0,"382":0,"383":0,"384":0,"387":0,"388":0,"391":0,"392":0,"395":0,"396":0,"397":0,"398":0,"399":0,"400":0,"401":0,"402":0,"403":0,"404":0,"405":0,"410":0,"411":0,"416":0,"419":0,"420":0,"421":0,"422":0,"423":0,"427":0,"430":0,"431":0,"432":0,"433":0,"434":0,"435":0,"439":0,"442":0,"443":0,"444":0,"445":0,"446":0,"448":0,"449":0,"450":0,"451":0,"456":0,"462":0,"464":0,"470":0,"471":0,"472":0,"474":0};
_yuitest_coverage["build/format-message/format-message.js"].functions = {"UnsupportedOperationException:5":0,"toString:9":0,"Formatter:13":0,"createInstance:19":0,"getValue:26":0,"getParams:33":0,"format:48":0,"setTimeZone:53":0,"getTimeZone:57":0,"trim:66":0,"StringFormatter:70":0,"createInstance:78":0,"getParams:82":0,"format:93":0,"DateFormatter:108":0,"createInstance:122":0,"getParams:126":0,"format:151":0,"TimeFormatter:173":0,"createInstance:187":0,"NumberFormatter:190":0,"createInstance:203":0,"getParams:207":0,"format:233":0,"SelectFormatter:251":0,"createInstance:260":0,"getParams:264":0,"parseOptions:278":0,"select:312":0,"format:326":0,"PluralFormatter:353":0,"createInstance:362":0,"select:366":0,"ChoiceFormatter:382":0,"createInstance:391":0,"parseOptions:395":0,"getParams:419":0,"select:430":0,"format:442":0,"format:469":0,"(anonymous 1):1":0};
_yuitest_coverage["build/format-message/format-message.js"].coveredLines = 251;
_yuitest_coverage["build/format-message/format-message.js"].coveredFunctions = 41;
_yuitest_coverline("build/format-message/format-message.js", 1);
YUI.add('format-message', function (Y, NAME) {

//For MessageFormat

_yuitest_coverfunc("build/format-message/format-message.js", "(anonymous 1)", 1);
_yuitest_coverline("build/format-message/format-message.js", 5);
UnsupportedOperationException = function(message) {
    _yuitest_coverfunc("build/format-message/format-message.js", "UnsupportedOperationException", 5);
_yuitest_coverline("build/format-message/format-message.js", 6);
this.message = message;
}

_yuitest_coverline("build/format-message/format-message.js", 9);
UnsupportedOperationException.prototype.toString = function() {
    _yuitest_coverfunc("build/format-message/format-message.js", "toString", 9);
_yuitest_coverline("build/format-message/format-message.js", 10);
return "UnsupportedOperationException: " + this.message;
}

_yuitest_coverline("build/format-message/format-message.js", 13);
Formatter = function(values) {
    _yuitest_coverfunc("build/format-message/format-message.js", "Formatter", 13);
_yuitest_coverline("build/format-message/format-message.js", 14);
this.values = values;
};

//Static methods

_yuitest_coverline("build/format-message/format-message.js", 19);
Formatter.createInstance = function(values) {
    //return new Formatter(values);
    _yuitest_coverfunc("build/format-message/format-message.js", "createInstance", 19);
_yuitest_coverline("build/format-message/format-message.js", 21);
throw new UnsupportedOperationException('Not implemented');	//Must override in descendants
};

//Public methods

_yuitest_coverline("build/format-message/format-message.js", 26);
Formatter.prototype.getValue = function(key) {
    _yuitest_coverfunc("build/format-message/format-message.js", "getValue", 26);
_yuitest_coverline("build/format-message/format-message.js", 27);
if(Y.Lang.isArray(this.values)) {
       _yuitest_coverline("build/format-message/format-message.js", 28);
key = parseInt(key); 
    }
    _yuitest_coverline("build/format-message/format-message.js", 30);
return this.values[key];
};

_yuitest_coverline("build/format-message/format-message.js", 33);
Formatter.prototype.getParams = function(params) {
    _yuitest_coverfunc("build/format-message/format-message.js", "getParams", 33);
_yuitest_coverline("build/format-message/format-message.js", 34);
if(!params || !params.key) {
        _yuitest_coverline("build/format-message/format-message.js", 35);
return false;
    }

    _yuitest_coverline("build/format-message/format-message.js", 38);
var value = this.getValue(params.key);
	
    _yuitest_coverline("build/format-message/format-message.js", 40);
if(value != null) {
        _yuitest_coverline("build/format-message/format-message.js", 41);
params.value = value;
        _yuitest_coverline("build/format-message/format-message.js", 42);
return true;
    }

    _yuitest_coverline("build/format-message/format-message.js", 45);
return false;
};

_yuitest_coverline("build/format-message/format-message.js", 48);
Formatter.prototype.format = function(str) {
    _yuitest_coverfunc("build/format-message/format-message.js", "format", 48);
_yuitest_coverline("build/format-message/format-message.js", 49);
throw new UnsupportedOperationException('Not implemented');	//Must override in descendants
};

//For date and time formatters
_yuitest_coverline("build/format-message/format-message.js", 53);
Formatter.setTimeZone = function(timezone) {
    _yuitest_coverfunc("build/format-message/format-message.js", "setTimeZone", 53);
_yuitest_coverline("build/format-message/format-message.js", 54);
Formatter.timezone = timezone;
}

_yuitest_coverline("build/format-message/format-message.js", 57);
Formatter.getTimeZone = function() {
    _yuitest_coverfunc("build/format-message/format-message.js", "getTimeZone", 57);
_yuitest_coverline("build/format-message/format-message.js", 58);
if(!this.timezone) {
        _yuitest_coverline("build/format-message/format-message.js", 59);
var systemTZoneOffset = (new Date()).getTimezoneOffset()*-60;
        _yuitest_coverline("build/format-message/format-message.js", 60);
Formatter.timezone = Y.TimeZone.getTimezoneIdForOffset(systemTZoneOffset); 
    }
    _yuitest_coverline("build/format-message/format-message.js", 62);
return Formatter.timezone;
}

_yuitest_coverline("build/format-message/format-message.js", 65);
if(String.prototype.trim == null) {
    _yuitest_coverline("build/format-message/format-message.js", 66);
String.prototype.trim = function() {
        _yuitest_coverfunc("build/format-message/format-message.js", "trim", 66);
_yuitest_coverline("build/format-message/format-message.js", 67);
return this.replace(/^\s+/, '').replace(/\s+$/, '');
    };
}
_yuitest_coverline("build/format-message/format-message.js", 70);
StringFormatter = function(values) {
    _yuitest_coverfunc("build/format-message/format-message.js", "StringFormatter", 70);
_yuitest_coverline("build/format-message/format-message.js", 71);
Formatter.call(this, values);
    _yuitest_coverline("build/format-message/format-message.js", 72);
this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*}";
}

_yuitest_coverline("build/format-message/format-message.js", 75);
StringFormatter.prototype = new Formatter;
_yuitest_coverline("build/format-message/format-message.js", 76);
StringFormatter.prototype.constructor = StringFormatter;

_yuitest_coverline("build/format-message/format-message.js", 78);
StringFormatter.createInstance = function(values) {
    _yuitest_coverfunc("build/format-message/format-message.js", "createInstance", 78);
_yuitest_coverline("build/format-message/format-message.js", 79);
return new StringFormatter(values);
}

_yuitest_coverline("build/format-message/format-message.js", 82);
StringFormatter.prototype.getParams = function(params, matches) {
    _yuitest_coverfunc("build/format-message/format-message.js", "getParams", 82);
_yuitest_coverline("build/format-message/format-message.js", 83);
if(matches && matches[1]) {
        _yuitest_coverline("build/format-message/format-message.js", 84);
params.key = matches[1];
        _yuitest_coverline("build/format-message/format-message.js", 85);
if(Formatter.prototype.getParams.call(this, params)) {
            _yuitest_coverline("build/format-message/format-message.js", 86);
return true;
        }
    }
	
    _yuitest_coverline("build/format-message/format-message.js", 90);
return false;
}

_yuitest_coverline("build/format-message/format-message.js", 93);
StringFormatter.prototype.format = function(str) {
    _yuitest_coverfunc("build/format-message/format-message.js", "format", 93);
_yuitest_coverline("build/format-message/format-message.js", 94);
var regex = new RegExp(this.regex, "gm");
    _yuitest_coverline("build/format-message/format-message.js", 95);
var matches = null;
    _yuitest_coverline("build/format-message/format-message.js", 96);
while((matches = regex.exec(str))) {
        _yuitest_coverline("build/format-message/format-message.js", 97);
var params = {};

        _yuitest_coverline("build/format-message/format-message.js", 99);
if(this.getParams(params, matches)) {
            //Got a match
            _yuitest_coverline("build/format-message/format-message.js", 101);
str = str.replace(matches[0], params.value);
        }

    }

    _yuitest_coverline("build/format-message/format-message.js", 106);
return str;
}
_yuitest_coverline("build/format-message/format-message.js", 108);
DateFormatter = function(values) {
    _yuitest_coverfunc("build/format-message/format-message.js", "DateFormatter", 108);
_yuitest_coverline("build/format-message/format-message.js", 109);
Formatter.call(this, values);
    _yuitest_coverline("build/format-message/format-message.js", 110);
this.styles = {
        "short":  [ Y.Date.DATE_FORMATS.YMD_SHORT, 0, 0 ],
        "medium": [ Y.Date.DATE_FORMATS.YMD_ABBREVIATED,0, 0 ],
        "long":   [ Y.Date.DATE_FORMATS.YMD_LONG, 0, 0 ],
        "full":   [ Y.Date.DATE_FORMATS.WYMD_LONG, 0, 0 ]
    };
    _yuitest_coverline("build/format-message/format-message.js", 116);
this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*date\\s*(,\\s*(\\w+)\\s*)?}";
}

_yuitest_coverline("build/format-message/format-message.js", 119);
DateFormatter.prototype = new Formatter;
_yuitest_coverline("build/format-message/format-message.js", 120);
DateFormatter.prototype.constructor = DateFormatter;

_yuitest_coverline("build/format-message/format-message.js", 122);
DateFormatter.createInstance = function(values) {
    _yuitest_coverfunc("build/format-message/format-message.js", "createInstance", 122);
_yuitest_coverline("build/format-message/format-message.js", 123);
return new DateFormatter(values);
}

_yuitest_coverline("build/format-message/format-message.js", 126);
DateFormatter.prototype.getParams = function(params, matches) {
    _yuitest_coverfunc("build/format-message/format-message.js", "getParams", 126);
_yuitest_coverline("build/format-message/format-message.js", 127);
if(matches) {
        _yuitest_coverline("build/format-message/format-message.js", 128);
if(matches[1]) {
            _yuitest_coverline("build/format-message/format-message.js", 129);
params.key = matches[1];
        }
        _yuitest_coverline("build/format-message/format-message.js", 131);
if(matches[3]) {
            _yuitest_coverline("build/format-message/format-message.js", 132);
params.style = matches[3];
        }
    }

    _yuitest_coverline("build/format-message/format-message.js", 136);
if(!params.style) {
        _yuitest_coverline("build/format-message/format-message.js", 137);
params.style = "medium";
    }			//If no style, default to medium

    _yuitest_coverline("build/format-message/format-message.js", 140);
if(!this.styles[params.style]) {
        _yuitest_coverline("build/format-message/format-message.js", 141);
return false;
    }	//Invalid style

    _yuitest_coverline("build/format-message/format-message.js", 144);
if(params.key && Formatter.prototype.getParams.call(this, params)) {
        _yuitest_coverline("build/format-message/format-message.js", 145);
return true;
    }

    _yuitest_coverline("build/format-message/format-message.js", 148);
return false;
}

_yuitest_coverline("build/format-message/format-message.js", 151);
DateFormatter.prototype.format = function(str) {
    _yuitest_coverfunc("build/format-message/format-message.js", "format", 151);
_yuitest_coverline("build/format-message/format-message.js", 152);
var regex = new RegExp(this.regex, "gm");
    _yuitest_coverline("build/format-message/format-message.js", 153);
var matches = null;
    _yuitest_coverline("build/format-message/format-message.js", 154);
while((matches = regex.exec(str))) {
        _yuitest_coverline("build/format-message/format-message.js", 155);
var params = {};

        _yuitest_coverline("build/format-message/format-message.js", 157);
if(this.getParams(params, matches)) {
            //Got a match
            _yuitest_coverline("build/format-message/format-message.js", 159);
var style = this.styles[params.style];
            _yuitest_coverline("build/format-message/format-message.js", 160);
var result = Y.Date.format(new Date(params.value), {
                timezone: Formatter.getTimeZone(),
                dateFormat: style[0],
                timeFormat: style[1],
                timezoneFormat: style[2]
            })
            _yuitest_coverline("build/format-message/format-message.js", 166);
str = str.replace(matches[0], result);
        }

    }

    _yuitest_coverline("build/format-message/format-message.js", 171);
return str;
}
_yuitest_coverline("build/format-message/format-message.js", 173);
TimeFormatter = function(values) {
    _yuitest_coverfunc("build/format-message/format-message.js", "TimeFormatter", 173);
_yuitest_coverline("build/format-message/format-message.js", 174);
DateFormatter.call(this, values);
    _yuitest_coverline("build/format-message/format-message.js", 175);
this.styles = {
        "short": [ 0, Y.Date.TIME_FORMATS.HM_SHORT, Y.Date.TIMEZONE_FORMATS.NONE ],
        "medium": [ 0, Y.Date.TIME_FORMATS.HM_ABBREVIATED, Y.Date.TIMEZONE_FORMATS.NONE ],
        "long": [ 0, Y.Date.TIME_FORMATS.HM_ABBREVIATED, Y.Date.TIMEZONE_FORMATS.Z_SHORT ],
        "full": [ 0, Y.Date.TIME_FORMATS.HM_ABBREVIATED, Y.Date.TIMEZONE_FORMATS.Z_ABBREVIATED ]
    };
    _yuitest_coverline("build/format-message/format-message.js", 181);
this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*time\\s*(,\\s*(\\w+)\\s*)?}";
}

_yuitest_coverline("build/format-message/format-message.js", 184);
TimeFormatter.prototype = new DateFormatter;
_yuitest_coverline("build/format-message/format-message.js", 185);
TimeFormatter.prototype.constructor = TimeFormatter;

_yuitest_coverline("build/format-message/format-message.js", 187);
TimeFormatter.createInstance = function(values) {
    _yuitest_coverfunc("build/format-message/format-message.js", "createInstance", 187);
_yuitest_coverline("build/format-message/format-message.js", 188);
return new TimeFormatter(values);
}
_yuitest_coverline("build/format-message/format-message.js", 190);
NumberFormatter = function(values) {
    _yuitest_coverfunc("build/format-message/format-message.js", "NumberFormatter", 190);
_yuitest_coverline("build/format-message/format-message.js", 191);
Formatter.call(this, values);
    _yuitest_coverline("build/format-message/format-message.js", 192);
this.styles = {
        "integer": Y.Number.STYLES.NUMBER_STYLE,
        "percent": Y.Number.STYLES.PERCENT_STYLE,
        "currency": Y.Number.STYLES.CURRENCY_STYLE
    };
    _yuitest_coverline("build/format-message/format-message.js", 197);
this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*number\\s*(,\\s*(\\w+)\\s*)?}";
}

_yuitest_coverline("build/format-message/format-message.js", 200);
NumberFormatter.prototype = new Formatter;
_yuitest_coverline("build/format-message/format-message.js", 201);
NumberFormatter.prototype.constructor = NumberFormatter;

_yuitest_coverline("build/format-message/format-message.js", 203);
NumberFormatter.createInstance = function(values) {
    _yuitest_coverfunc("build/format-message/format-message.js", "createInstance", 203);
_yuitest_coverline("build/format-message/format-message.js", 204);
return new NumberFormatter(values);
}

_yuitest_coverline("build/format-message/format-message.js", 207);
NumberFormatter.prototype.getParams = function(params, matches) {
    _yuitest_coverfunc("build/format-message/format-message.js", "getParams", 207);
_yuitest_coverline("build/format-message/format-message.js", 208);
if(matches) {
        _yuitest_coverline("build/format-message/format-message.js", 209);
if(matches[1]) {
            _yuitest_coverline("build/format-message/format-message.js", 210);
params.key = matches[1];
        }
        _yuitest_coverline("build/format-message/format-message.js", 212);
if(matches[3]) {
            _yuitest_coverline("build/format-message/format-message.js", 213);
params.style = matches[3];
        }
    }

    _yuitest_coverline("build/format-message/format-message.js", 217);
if(!params.style) {
        _yuitest_coverline("build/format-message/format-message.js", 218);
params.style = "integer";	//If no style, default to medium
	_yuitest_coverline("build/format-message/format-message.js", 219);
params.showDecimal = true;	//Show decimal parts too
    }

    _yuitest_coverline("build/format-message/format-message.js", 222);
if(!this.styles[params.style]) {	//Invalid style
        _yuitest_coverline("build/format-message/format-message.js", 223);
return false;
    }

    _yuitest_coverline("build/format-message/format-message.js", 226);
if(params.key && Formatter.prototype.getParams.call(this, params)) {
        _yuitest_coverline("build/format-message/format-message.js", 227);
return true;
    }

    _yuitest_coverline("build/format-message/format-message.js", 230);
return false;
}

_yuitest_coverline("build/format-message/format-message.js", 233);
NumberFormatter.prototype.format = function(str) {
    _yuitest_coverfunc("build/format-message/format-message.js", "format", 233);
_yuitest_coverline("build/format-message/format-message.js", 234);
var regex = new RegExp(this.regex, "gm");
    _yuitest_coverline("build/format-message/format-message.js", 235);
var matches = null;
    _yuitest_coverline("build/format-message/format-message.js", 236);
while((matches = regex.exec(str))) {
        _yuitest_coverline("build/format-message/format-message.js", 237);
var params = {};

        _yuitest_coverline("build/format-message/format-message.js", 239);
if(this.getParams(params, matches)) {
            //Got a match
            _yuitest_coverline("build/format-message/format-message.js", 241);
var config = {
                style: this.styles[params.style]
            }
            _yuitest_coverline("build/format-message/format-message.js", 244);
if(params.style == "integer" && !params.showDecimal) { config.parseIntegerOnly = true; }
            _yuitest_coverline("build/format-message/format-message.js", 245);
str = str.replace(matches[0], Y.Number.format(params.value, config));
        }
    }

    _yuitest_coverline("build/format-message/format-message.js", 249);
return str;
}
_yuitest_coverline("build/format-message/format-message.js", 251);
SelectFormatter = function(values) {
    _yuitest_coverfunc("build/format-message/format-message.js", "SelectFormatter", 251);
_yuitest_coverline("build/format-message/format-message.js", 252);
Formatter.call(this, values);
    _yuitest_coverline("build/format-message/format-message.js", 253);
this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*select\\s*,\\s*";
}

_yuitest_coverline("build/format-message/format-message.js", 256);
SelectFormatter.prototype = new Formatter;
_yuitest_coverline("build/format-message/format-message.js", 257);
SelectFormatter.prototype.constructor = SelectFormatter;


_yuitest_coverline("build/format-message/format-message.js", 260);
SelectFormatter.createInstance = function(values) {
    _yuitest_coverfunc("build/format-message/format-message.js", "createInstance", 260);
_yuitest_coverline("build/format-message/format-message.js", 261);
return new SelectFormatter(values);
}

_yuitest_coverline("build/format-message/format-message.js", 264);
SelectFormatter.prototype.getParams = function(params, matches) {
    _yuitest_coverfunc("build/format-message/format-message.js", "getParams", 264);
_yuitest_coverline("build/format-message/format-message.js", 265);
if(matches) {
        _yuitest_coverline("build/format-message/format-message.js", 266);
if(matches[1]) {
            _yuitest_coverline("build/format-message/format-message.js", 267);
params.key = matches[1];
        }
    }

    _yuitest_coverline("build/format-message/format-message.js", 271);
if(params.key && Formatter.prototype.getParams.call(this, params)) {
        _yuitest_coverline("build/format-message/format-message.js", 272);
return true;
    }

    _yuitest_coverline("build/format-message/format-message.js", 275);
return false;
}

_yuitest_coverline("build/format-message/format-message.js", 278);
SelectFormatter.prototype.parseOptions = function(str, start) {
    _yuitest_coverfunc("build/format-message/format-message.js", "parseOptions", 278);
_yuitest_coverline("build/format-message/format-message.js", 279);
var options = {};
    _yuitest_coverline("build/format-message/format-message.js", 280);
var key = "", value = "", current = "";
    _yuitest_coverline("build/format-message/format-message.js", 281);
for(var i=start; i<str.length; i++) {
        _yuitest_coverline("build/format-message/format-message.js", 282);
var ch = str.charAt(i);
        _yuitest_coverline("build/format-message/format-message.js", 283);
if (ch == '\\') {
            _yuitest_coverline("build/format-message/format-message.js", 284);
current += ch + str.charAt(i+1);
            _yuitest_coverline("build/format-message/format-message.js", 285);
i++;
        } else {_yuitest_coverline("build/format-message/format-message.js", 286);
if (ch == '}') {
            _yuitest_coverline("build/format-message/format-message.js", 287);
if(current == "") {
                _yuitest_coverline("build/format-message/format-message.js", 288);
i++;
                _yuitest_coverline("build/format-message/format-message.js", 289);
break;
            }
            _yuitest_coverline("build/format-message/format-message.js", 291);
value = current;
            _yuitest_coverline("build/format-message/format-message.js", 292);
options[key.trim()] = value;
            _yuitest_coverline("build/format-message/format-message.js", 293);
current = key = value = "";
        } else {_yuitest_coverline("build/format-message/format-message.js", 294);
if (ch == '{') {
            _yuitest_coverline("build/format-message/format-message.js", 295);
key = current;
            _yuitest_coverline("build/format-message/format-message.js", 296);
current = "";
        } else {
            _yuitest_coverline("build/format-message/format-message.js", 298);
current += ch;
        }}}		
    }

    _yuitest_coverline("build/format-message/format-message.js", 302);
if(current != "") { 
        _yuitest_coverline("build/format-message/format-message.js", 303);
return null;
    }

    _yuitest_coverline("build/format-message/format-message.js", 306);
return {
        options: options, 
        next: i
    };
}

_yuitest_coverline("build/format-message/format-message.js", 312);
SelectFormatter.prototype.select = function(options, params) {
    _yuitest_coverfunc("build/format-message/format-message.js", "select", 312);
_yuitest_coverline("build/format-message/format-message.js", 313);
for ( var key in options ) {
        _yuitest_coverline("build/format-message/format-message.js", 314);
if( key == "other" ) {
            _yuitest_coverline("build/format-message/format-message.js", 315);
continue;	//Will use this only if everything else fails
        }

        _yuitest_coverline("build/format-message/format-message.js", 318);
if( key == params.value ) {
            _yuitest_coverline("build/format-message/format-message.js", 319);
return options[key];
        }
    }

    _yuitest_coverline("build/format-message/format-message.js", 323);
return options["other"];
}

_yuitest_coverline("build/format-message/format-message.js", 326);
SelectFormatter.prototype.format = function(str) {
    _yuitest_coverfunc("build/format-message/format-message.js", "format", 326);
_yuitest_coverline("build/format-message/format-message.js", 327);
var regex = new RegExp(this.regex, "gm");
    _yuitest_coverline("build/format-message/format-message.js", 328);
var matches = null;
    _yuitest_coverline("build/format-message/format-message.js", 329);
while((matches = regex.exec(str))) {
        _yuitest_coverline("build/format-message/format-message.js", 330);
var params = {};

        _yuitest_coverline("build/format-message/format-message.js", 332);
if(this.getParams(params, matches)) {
            //Got a match
            _yuitest_coverline("build/format-message/format-message.js", 334);
var options = this.parseOptions(str, regex.lastIndex);
            _yuitest_coverline("build/format-message/format-message.js", 335);
if(!options) {
                _yuitest_coverline("build/format-message/format-message.js", 336);
continue;
            }

            _yuitest_coverline("build/format-message/format-message.js", 339);
regex.lastIndex = options.next;
            _yuitest_coverline("build/format-message/format-message.js", 340);
options = options.options;

            _yuitest_coverline("build/format-message/format-message.js", 342);
var result = this.select(options, params);
            _yuitest_coverline("build/format-message/format-message.js", 343);
if(result) {
                _yuitest_coverline("build/format-message/format-message.js", 344);
var start = str.indexOf(matches[0]);
                _yuitest_coverline("build/format-message/format-message.js", 345);
str = str.slice(0, start) + result + str.slice(regex.lastIndex);
            }
        }

    }

    _yuitest_coverline("build/format-message/format-message.js", 351);
return str;
}
_yuitest_coverline("build/format-message/format-message.js", 353);
PluralFormatter = function(values) {
    _yuitest_coverfunc("build/format-message/format-message.js", "PluralFormatter", 353);
_yuitest_coverline("build/format-message/format-message.js", 354);
SelectFormatter.call(this, values);
    _yuitest_coverline("build/format-message/format-message.js", 355);
this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*plural\\s*,\\s*";
}

_yuitest_coverline("build/format-message/format-message.js", 358);
PluralFormatter.prototype = new SelectFormatter;
_yuitest_coverline("build/format-message/format-message.js", 359);
PluralFormatter.prototype.constructor = PluralFormatter;


_yuitest_coverline("build/format-message/format-message.js", 362);
PluralFormatter.createInstance = function(values) {
    _yuitest_coverfunc("build/format-message/format-message.js", "createInstance", 362);
_yuitest_coverline("build/format-message/format-message.js", 363);
return new PluralFormatter(values);
}

_yuitest_coverline("build/format-message/format-message.js", 366);
PluralFormatter.prototype.select = function(options, params) {
    _yuitest_coverfunc("build/format-message/format-message.js", "select", 366);
_yuitest_coverline("build/format-message/format-message.js", 367);
var result = options.other;
    _yuitest_coverline("build/format-message/format-message.js", 368);
if(params.value == 0 && options.zero) {
        _yuitest_coverline("build/format-message/format-message.js", 369);
result = options.zero;
    }
    _yuitest_coverline("build/format-message/format-message.js", 371);
if(params.value == 1 && options.one) {
        _yuitest_coverline("build/format-message/format-message.js", 372);
result = options.one;
    }
    _yuitest_coverline("build/format-message/format-message.js", 374);
if(params.value == 2 && options.two) {
        _yuitest_coverline("build/format-message/format-message.js", 375);
result = options.two;
    }

    _yuitest_coverline("build/format-message/format-message.js", 378);
result = result.replace("#", new NumberFormatter({VAL: params.value}).format("{VAL, number, integer}"));	//Use 'number' to format this part

    _yuitest_coverline("build/format-message/format-message.js", 380);
return result;
}
_yuitest_coverline("build/format-message/format-message.js", 382);
ChoiceFormatter = function(values) {
    _yuitest_coverfunc("build/format-message/format-message.js", "ChoiceFormatter", 382);
_yuitest_coverline("build/format-message/format-message.js", 383);
SelectFormatter.call(this, values);
    _yuitest_coverline("build/format-message/format-message.js", 384);
this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*choice\\s*,\\s*(.+)}";
}

_yuitest_coverline("build/format-message/format-message.js", 387);
ChoiceFormatter.prototype = new SelectFormatter;
_yuitest_coverline("build/format-message/format-message.js", 388);
ChoiceFormatter.prototype.constructor = ChoiceFormatter;


_yuitest_coverline("build/format-message/format-message.js", 391);
ChoiceFormatter.createInstance = function(values) {
    _yuitest_coverfunc("build/format-message/format-message.js", "createInstance", 391);
_yuitest_coverline("build/format-message/format-message.js", 392);
return new ChoiceFormatter(values);
}

_yuitest_coverline("build/format-message/format-message.js", 395);
ChoiceFormatter.prototype.parseOptions = function(choicesStr) {
    _yuitest_coverfunc("build/format-message/format-message.js", "parseOptions", 395);
_yuitest_coverline("build/format-message/format-message.js", 396);
var options = [];
    _yuitest_coverline("build/format-message/format-message.js", 397);
var choicesArray = choicesStr.split("|");
    _yuitest_coverline("build/format-message/format-message.js", 398);
for (var i=0; i<choicesArray.length; i++) {
        _yuitest_coverline("build/format-message/format-message.js", 399);
var choice = choicesArray[i];
        _yuitest_coverline("build/format-message/format-message.js", 400);
var relations = ['#', '<', '\u2264'];
        _yuitest_coverline("build/format-message/format-message.js", 401);
for (var j=0; j<relations.length; j++) {
            _yuitest_coverline("build/format-message/format-message.js", 402);
var rel = relations[j];
            _yuitest_coverline("build/format-message/format-message.js", 403);
if(choice.indexOf(rel) != -1) {
                _yuitest_coverline("build/format-message/format-message.js", 404);
var mapping = choice.split(rel);
                _yuitest_coverline("build/format-message/format-message.js", 405);
var ch = {
                    value: mapping[0],
                    result: mapping[1],
                    relation: rel
                };
                _yuitest_coverline("build/format-message/format-message.js", 410);
options.push(ch);
                _yuitest_coverline("build/format-message/format-message.js", 411);
break;
            }
        }
    }

    _yuitest_coverline("build/format-message/format-message.js", 416);
return options;
}

_yuitest_coverline("build/format-message/format-message.js", 419);
ChoiceFormatter.prototype.getParams = function(params, matches) {
    _yuitest_coverfunc("build/format-message/format-message.js", "getParams", 419);
_yuitest_coverline("build/format-message/format-message.js", 420);
if(SelectFormatter.prototype.getParams.call(this, params, matches)) {
        _yuitest_coverline("build/format-message/format-message.js", 421);
if(matches[2]) {
            _yuitest_coverline("build/format-message/format-message.js", 422);
params.choices = this.parseOptions(matches[2]);
            _yuitest_coverline("build/format-message/format-message.js", 423);
return params.choices === [] ? false: true;
        }
    }

    _yuitest_coverline("build/format-message/format-message.js", 427);
return false;
}

_yuitest_coverline("build/format-message/format-message.js", 430);
ChoiceFormatter.prototype.select = function(params) {
    _yuitest_coverfunc("build/format-message/format-message.js", "select", 430);
_yuitest_coverline("build/format-message/format-message.js", 431);
for ( var i=0; i<params.choices.length; i++) {
        _yuitest_coverline("build/format-message/format-message.js", 432);
var choice = params.choices[i];
        _yuitest_coverline("build/format-message/format-message.js", 433);
var value = choice.value, result = choice.result, relation = choice.relation;
        _yuitest_coverline("build/format-message/format-message.js", 434);
if( (relation == '#' && value == params.value) || (relation == '<' && value < params.value) || (relation == '\u2264' && value <= params.value)) {
        _yuitest_coverline("build/format-message/format-message.js", 435);
return result;
        }
    }

    _yuitest_coverline("build/format-message/format-message.js", 439);
return "";
}

_yuitest_coverline("build/format-message/format-message.js", 442);
ChoiceFormatter.prototype.format = function(str) {
    _yuitest_coverfunc("build/format-message/format-message.js", "format", 442);
_yuitest_coverline("build/format-message/format-message.js", 443);
var regex = new RegExp(this.regex, "gm");
    _yuitest_coverline("build/format-message/format-message.js", 444);
var matches = null;
    _yuitest_coverline("build/format-message/format-message.js", 445);
while((matches = regex.exec(str))) {
        _yuitest_coverline("build/format-message/format-message.js", 446);
var params = {};

        _yuitest_coverline("build/format-message/format-message.js", 448);
if(this.getParams(params, matches)) {
            _yuitest_coverline("build/format-message/format-message.js", 449);
var result = this.select(params);
            _yuitest_coverline("build/format-message/format-message.js", 450);
if(result) {
                _yuitest_coverline("build/format-message/format-message.js", 451);
str = str.replace(matches[0], result);
            }
        }
    }

    _yuitest_coverline("build/format-message/format-message.js", 456);
return str;
}
/**
 * Formatter classes. For each group found in the pattern, will try to parse with all of these formatters.
 * If a formatter fails to parse, the next one in the list try to do so.
 */
_yuitest_coverline("build/format-message/format-message.js", 462);
var formatters = [ StringFormatter, DateFormatter, TimeFormatter, NumberFormatter, ChoiceFormatter, PluralFormatter, SelectFormatter ];

_yuitest_coverline("build/format-message/format-message.js", 464);
Y.MessageFormat = {
    setTimeZone: Formatter.setTimeZone,

    getTimeZone: Formatter.getTimeZone,

    format: function(pattern, values) {
        _yuitest_coverfunc("build/format-message/format-message.js", "format", 469);
_yuitest_coverline("build/format-message/format-message.js", 470);
for(var i=0; i<formatters.length; i++) {
            _yuitest_coverline("build/format-message/format-message.js", 471);
var formatter = formatters[i].createInstance(values);
            _yuitest_coverline("build/format-message/format-message.js", 472);
pattern = formatter.format(pattern);
        }
        _yuitest_coverline("build/format-message/format-message.js", 474);
return pattern;
    }
}


}, '@VERSION@', {"requires": ["datatype-date-advanced-format", "datatype-number-advanced-format"]});
