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
_yuitest_coverage["build/format-message/format-message.js"].code=["YUI.add('format-message', function (Y, NAME) {","","//For MessageFormat","","UnsupportedOperationException = function(message) {","    this.message = message;","}","","UnsupportedOperationException.prototype.toString = function() {","    return \"UnsupportedOperationException: \" + this.message;","}","","Formatter = function(values) {","    this.values = values;","};","","//Static methods","","Formatter.createInstance = function(values) {","    //return new Formatter(values);","    throw new UnsupportedOperationException('Not implemented');	//Must override in descendants","};","","//Public methods","","Formatter.prototype.getValue = function(key) {","    if(Y.Lang.isArray(this.values)) {","       key = parseInt(key); ","    }","    return this.values[key];","};","","Formatter.prototype.getParams = function(params) {","    if(!params || !params.key) {","        return false;","    }","","    var value = this.getValue(params.key);","	","    if(value != null) {","        params.value = value;","        return true;","    }","","    return false;","};","","Formatter.prototype.format = function(str) {","    throw new UnsupportedOperationException('Not implemented');	//Must override in descendants","};","","//For date and time formatters","Formatter.setTimeZone = function(timezone) {","    Formatter.timezone = timezone;","}","","Formatter.getTimeZone = function() {","    if(!this.timezone) {","        var systemTZoneOffset = (new Date()).getTimezoneOffset()*-60;","        Formatter.timezone = Y.TimeZone.getTimezoneIdForOffset(systemTZoneOffset); ","    }","    return Formatter.timezone;","}","","if(String.prototype.trim == null) {","    String.prototype.trim = function() {","        return this.replace(/^\\s+/, '').replace(/\\s+$/, '');","    };","}","StringFormatter = function(values) {","    Formatter.call(this, values);","    this.regex = \"{\\\\s*([a-zA-Z0-9_]+)\\\\s*}\";","}","","StringFormatter.prototype = new Formatter;","StringFormatter.prototype.constructor = StringFormatter;","","StringFormatter.createInstance = function(values) {","    return new StringFormatter(values);","}","","StringFormatter.prototype.getParams = function(params, matches) {","    if(matches && matches[1]) {","        params.key = matches[1];","        if(Formatter.prototype.getParams.call(this, params)) {","            return true;","        }","    }","	","    return false;","}","","StringFormatter.prototype.format = function(str) {","    var regex = new RegExp(this.regex, \"gm\");","    var matches = null;","    while((matches = regex.exec(str))) {","        var params = {};","","        if(this.getParams(params, matches)) {","            //Got a match","            str = str.replace(matches[0], params.value);","        }","","    }","","    return str;","}","DateFormatter = function(values) {","    Formatter.call(this, values);","    this.styles = {","        \"short\":  [ Y.DateFormat.DATE_FORMATS.YMD_SHORT, 0, 0 ],","        \"medium\": [ Y.DateFormat.DATE_FORMATS.YMD_ABBREVIATED,0, 0 ],","        \"long\":   [ Y.DateFormat.DATE_FORMATS.YMD_LONG, 0, 0 ],","        \"full\":   [ Y.DateFormat.DATE_FORMATS.WYMD_LONG, 0, 0 ]","    };","    this.regex = \"{\\\\s*([a-zA-Z0-9_]+)\\\\s*,\\\\s*date\\\\s*(,\\\\s*(\\\\w+)\\\\s*)?}\";","}","","DateFormatter.prototype = new Formatter;","DateFormatter.prototype.constructor = DateFormatter;","","DateFormatter.createInstance = function(values) {","    return new DateFormatter(values);","}","","DateFormatter.prototype.getParams = function(params, matches) {","    if(matches) {","        if(matches[1]) {","            params.key = matches[1];","        }","        if(matches[3]) {","            params.style = matches[3];","        }","    }","","    if(!params.style) {","        params.style = \"medium\";","    }			//If no style, default to medium","","    if(!this.styles[params.style]) {","        return false;","    }	//Invalid style","","    if(params.key && Formatter.prototype.getParams.call(this, params)) {","        return true;","    }","","    return false;","}","","DateFormatter.prototype.format = function(str) {","    var regex = new RegExp(this.regex, \"gm\");","    var matches = null;","    while((matches = regex.exec(str))) {","        var params = {};","","        if(this.getParams(params, matches)) {","            //Got a match","            var style = this.styles[params.style];","            var format = new Y.DateFormat(Formatter.getTimeZone(), style[0], style[1], style[2]);","            str = str.replace(matches[0], format.format(new Date(params.value)));","        }","","    }","","    return str;","}","TimeFormatter = function(values) {","    DateFormatter.call(this, values);","    this.styles = {","        \"short\": [ 0, Y.DateFormat.TIME_FORMATS.HM_SHORT, Y.DateFormat.TIMEZONE_FORMATS.NONE ],","        \"medium\": [ 0, Y.DateFormat.TIME_FORMATS.HM_ABBREVIATED, Y.DateFormat.TIMEZONE_FORMATS.NONE ],","        \"long\": [ 0, Y.DateFormat.TIME_FORMATS.HM_ABBREVIATED, Y.DateFormat.TIMEZONE_FORMATS.Z_SHORT ],","        \"full\": [ 0, Y.DateFormat.TIME_FORMATS.HM_ABBREVIATED, Y.DateFormat.TIMEZONE_FORMATS.Z_ABBREVIATED ]","    };","    this.regex = \"{\\\\s*([a-zA-Z0-9_]+)\\\\s*,\\\\s*time\\\\s*(,\\\\s*(\\\\w+)\\\\s*)?}\";","}","","TimeFormatter.prototype = new DateFormatter;","TimeFormatter.prototype.constructor = TimeFormatter;","","TimeFormatter.createInstance = function(values) {","    return new TimeFormatter(values);","}","NumberFormatter = function(values) {","    Formatter.call(this, values);","    this.styles = {","        \"integer\": Y.NumberFormat.STYLES.NUMBER_STYLE,","        \"percent\": Y.NumberFormat.STYLES.PERCENT_STYLE,","        \"currency\": Y.NumberFormat.STYLES.CURRENCY_STYLE","    };","    this.regex = \"{\\\\s*([a-zA-Z0-9_]+)\\\\s*,\\\\s*number\\\\s*(,\\\\s*(\\\\w+)\\\\s*)?}\";","}","","NumberFormatter.prototype = new Formatter;","NumberFormatter.prototype.constructor = NumberFormatter;","","NumberFormatter.createInstance = function(values) {","    return new NumberFormatter(values);","}","","NumberFormatter.prototype.getParams = function(params, matches) {","    if(matches) {","        if(matches[1]) {","            params.key = matches[1];","        }","        if(matches[3]) {","            params.style = matches[3];","        }","    }","","    if(!params.style) {","        params.style = \"integer\";	//If no style, default to medium","	params.showDecimal = true;	//Show decimal parts too","    }","","    if(!this.styles[params.style]) {	//Invalid style","        return false;","    }","","    if(params.key && Formatter.prototype.getParams.call(this, params)) {","        return true;","    }","","    return false;","}","","NumberFormatter.prototype.format = function(str) {","    var regex = new RegExp(this.regex, \"gm\");","    var matches = null;","    while((matches = regex.exec(str))) {","        var params = {};","","        if(this.getParams(params, matches)) {","            //Got a match","            var format = new Y.NumberFormat(this.styles[params.style]);","            if(params.style == \"integer\" && !params.showDecimal) { format.setParseIntegerOnly(true); }","            str = str.replace(matches[0], format.format(params.value));","        }","    }","","    return str;","}","SelectFormatter = function(values) {","    Formatter.call(this, values);","    this.regex = \"{\\\\s*([a-zA-Z0-9_]+)\\\\s*,\\\\s*select\\\\s*,\\\\s*\";","}","","SelectFormatter.prototype = new Formatter;","SelectFormatter.prototype.constructor = SelectFormatter;","","","SelectFormatter.createInstance = function(values) {","    return new SelectFormatter(values);","}","","SelectFormatter.prototype.getParams = function(params, matches) {","    if(matches) {","        if(matches[1]) {","            params.key = matches[1];","        }","    }","","    if(params.key && Formatter.prototype.getParams.call(this, params)) {","        return true;","    }","","    return false;","}","","SelectFormatter.prototype.parseOptions = function(str, start) {","    var options = {};","    var key = \"\", value = \"\", current = \"\";","    for(var i=start; i<str.length; i++) {","        var ch = str.charAt(i);","        if (ch == '\\\\') {","            current += ch + str.charAt(i+1);","            i++;","        } else if (ch == '}') {","            if(current == \"\") {","                i++;","                break;","            }","            value = current;","            options[key.trim()] = value;","            current = key = value = \"\";","        } else if (ch == '{') {","            key = current;","            current = \"\";","        } else {","            current += ch;","        }		","    }","","    if(current != \"\") { ","        return null;","    }","","    return {","        options: options, ","        next: i","    };","}","","SelectFormatter.prototype.select = function(options, params) {","    for ( var key in options ) {","        if( key == \"other\" ) {","            continue;	//Will use this only if everything else fails","        }","","        if( key == params.value ) {","            return options[key];","        }","    }","","    return options[\"other\"];","}","","SelectFormatter.prototype.format = function(str) {","    var regex = new RegExp(this.regex, \"gm\");","    var matches = null;","    while((matches = regex.exec(str))) {","        var params = {};","","        if(this.getParams(params, matches)) {","            //Got a match","            var options = this.parseOptions(str, regex.lastIndex);","            if(!options) {","                continue;","            }","","            regex.lastIndex = options.next;","            options = options.options;","","            var result = this.select(options, params);","            if(result) {","                var start = str.indexOf(matches[0]);","                str = str.slice(0, start) + result + str.slice(regex.lastIndex);","            }","        }","","    }","","    return str;","}","PluralFormatter = function(values) {","    SelectFormatter.call(this, values);","    this.regex = \"{\\\\s*([a-zA-Z0-9_]+)\\\\s*,\\\\s*plural\\\\s*,\\\\s*\";","}","","PluralFormatter.prototype = new SelectFormatter;","PluralFormatter.prototype.constructor = PluralFormatter;","","","PluralFormatter.createInstance = function(values) {","    return new PluralFormatter(values);","}","","PluralFormatter.prototype.select = function(options, params) {","    var result = options.other;","    if(params.value == 0 && options.zero) {","        result = options.zero;","    }","    if(params.value == 1 && options.one) {","        result = options.one;","    }","    if(params.value == 2 && options.two) {","        result = options.two;","    }","","    result = result.replace(\"#\", new NumberFormatter({VAL: params.value}).format(\"{VAL, number, integer}\"));	//Use 'number' to format this part","","    return result;","}","ChoiceFormatter = function(values) {","    SelectFormatter.call(this, values);","    this.regex = \"{\\\\s*([a-zA-Z0-9_]+)\\\\s*,\\\\s*choice\\\\s*,\\\\s*(.+)}\";","}","","ChoiceFormatter.prototype = new SelectFormatter;","ChoiceFormatter.prototype.constructor = ChoiceFormatter;","","","ChoiceFormatter.createInstance = function(values) {","    return new ChoiceFormatter(values);","}","","ChoiceFormatter.prototype.parseOptions = function(choicesStr) {","    var options = [];","    var choicesArray = choicesStr.split(\"|\");","    for (var i=0; i<choicesArray.length; i++) {","        var choice = choicesArray[i];","        var relations = ['#', '<', '\\u2264'];","        for (var j=0; j<relations.length; j++) {","            var rel = relations[j];","            if(choice.indexOf(rel) != -1) {","                var mapping = choice.split(rel);","                var ch = {","                    value: mapping[0],","                    result: mapping[1],","                    relation: rel","                };","                options.push(ch);","                break;","            }","        }","    }","","    return options;","}","","ChoiceFormatter.prototype.getParams = function(params, matches) {","    if(SelectFormatter.prototype.getParams.call(this, params, matches)) {","        if(matches[2]) {","            params.choices = this.parseOptions(matches[2]);","            return params.choices === [] ? false: true;","        }","    }","","    return false;","}","","ChoiceFormatter.prototype.select = function(params) {","    for ( var i=0; i<params.choices.length; i++) {","        var choice = params.choices[i];","        var value = choice.value, result = choice.result, relation = choice.relation;","        if( (relation == '#' && value == params.value) || (relation == '<' && value < params.value) || (relation == '\\u2264' && value <= params.value)) {","        return result;","        }","    }","","    return \"\";","}","","ChoiceFormatter.prototype.format = function(str) {","    var regex = new RegExp(this.regex, \"gm\");","    var matches = null;","    while((matches = regex.exec(str))) {","        var params = {};","","        if(this.getParams(params, matches)) {","            var result = this.select(params);","            if(result) {","                str = str.replace(matches[0], result);","            }","        }","    }","","    return str;","}","/**"," * Formatter classes. For each group found in the pattern, will try to parse with all of these formatters."," * If a formatter fails to parse, the next one in the list try to do so."," */","var formatters = [ StringFormatter, DateFormatter, TimeFormatter, NumberFormatter, ChoiceFormatter, PluralFormatter, SelectFormatter ];","","Y.MessageFormat = {","    setTimeZone: Formatter.setTimeZone,","","    getTimeZone: Formatter.getTimeZone,","","    format: function(pattern, values) {","        for(var i=0; i<formatters.length; i++) {","            var formatter = formatters[i].createInstance(values);","            pattern = formatter.format(pattern);","        }","        return pattern;","    }","}","","","}, '@VERSION@', {\"requires\": [\"format-date\", \"format-numbers\"]});"];
_yuitest_coverage["build/format-message/format-message.js"].lines = {"1":0,"5":0,"6":0,"9":0,"10":0,"13":0,"14":0,"19":0,"21":0,"26":0,"27":0,"28":0,"30":0,"33":0,"34":0,"35":0,"38":0,"40":0,"41":0,"42":0,"45":0,"48":0,"49":0,"53":0,"54":0,"57":0,"58":0,"59":0,"60":0,"62":0,"65":0,"66":0,"67":0,"70":0,"71":0,"72":0,"75":0,"76":0,"78":0,"79":0,"82":0,"83":0,"84":0,"85":0,"86":0,"90":0,"93":0,"94":0,"95":0,"96":0,"97":0,"99":0,"101":0,"106":0,"108":0,"109":0,"110":0,"116":0,"119":0,"120":0,"122":0,"123":0,"126":0,"127":0,"128":0,"129":0,"131":0,"132":0,"136":0,"137":0,"140":0,"141":0,"144":0,"145":0,"148":0,"151":0,"152":0,"153":0,"154":0,"155":0,"157":0,"159":0,"160":0,"161":0,"166":0,"168":0,"169":0,"170":0,"176":0,"179":0,"180":0,"182":0,"183":0,"185":0,"186":0,"187":0,"192":0,"195":0,"196":0,"198":0,"199":0,"202":0,"203":0,"204":0,"205":0,"207":0,"208":0,"212":0,"213":0,"214":0,"217":0,"218":0,"221":0,"222":0,"225":0,"228":0,"229":0,"230":0,"231":0,"232":0,"234":0,"236":0,"237":0,"238":0,"242":0,"244":0,"245":0,"246":0,"249":0,"250":0,"253":0,"254":0,"257":0,"258":0,"259":0,"260":0,"264":0,"265":0,"268":0,"271":0,"272":0,"273":0,"274":0,"275":0,"276":0,"277":0,"278":0,"279":0,"280":0,"281":0,"282":0,"284":0,"285":0,"286":0,"287":0,"288":0,"289":0,"291":0,"295":0,"296":0,"299":0,"305":0,"306":0,"307":0,"308":0,"311":0,"312":0,"316":0,"319":0,"320":0,"321":0,"322":0,"323":0,"325":0,"327":0,"328":0,"329":0,"332":0,"333":0,"335":0,"336":0,"337":0,"338":0,"344":0,"346":0,"347":0,"348":0,"351":0,"352":0,"355":0,"356":0,"359":0,"360":0,"361":0,"362":0,"364":0,"365":0,"367":0,"368":0,"371":0,"373":0,"375":0,"376":0,"377":0,"380":0,"381":0,"384":0,"385":0,"388":0,"389":0,"390":0,"391":0,"392":0,"393":0,"394":0,"395":0,"396":0,"397":0,"398":0,"403":0,"404":0,"409":0,"412":0,"413":0,"414":0,"415":0,"416":0,"420":0,"423":0,"424":0,"425":0,"426":0,"427":0,"428":0,"432":0,"435":0,"436":0,"437":0,"438":0,"439":0,"441":0,"442":0,"443":0,"444":0,"449":0,"455":0,"457":0,"463":0,"464":0,"465":0,"467":0};
_yuitest_coverage["build/format-message/format-message.js"].functions = {"UnsupportedOperationException:5":0,"toString:9":0,"Formatter:13":0,"createInstance:19":0,"getValue:26":0,"getParams:33":0,"format:48":0,"setTimeZone:53":0,"getTimeZone:57":0,"trim:66":0,"StringFormatter:70":0,"createInstance:78":0,"getParams:82":0,"format:93":0,"DateFormatter:108":0,"createInstance:122":0,"getParams:126":0,"format:151":0,"TimeFormatter:168":0,"createInstance:182":0,"NumberFormatter:185":0,"createInstance:198":0,"getParams:202":0,"format:228":0,"SelectFormatter:244":0,"createInstance:253":0,"getParams:257":0,"parseOptions:271":0,"select:305":0,"format:319":0,"PluralFormatter:346":0,"createInstance:355":0,"select:359":0,"ChoiceFormatter:375":0,"createInstance:384":0,"parseOptions:388":0,"getParams:412":0,"select:423":0,"format:435":0,"format:462":0,"(anonymous 1):1":0};
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
        "short":  [ Y.DateFormat.DATE_FORMATS.YMD_SHORT, 0, 0 ],
        "medium": [ Y.DateFormat.DATE_FORMATS.YMD_ABBREVIATED,0, 0 ],
        "long":   [ Y.DateFormat.DATE_FORMATS.YMD_LONG, 0, 0 ],
        "full":   [ Y.DateFormat.DATE_FORMATS.WYMD_LONG, 0, 0 ]
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
var format = new Y.DateFormat(Formatter.getTimeZone(), style[0], style[1], style[2]);
            _yuitest_coverline("build/format-message/format-message.js", 161);
str = str.replace(matches[0], format.format(new Date(params.value)));
        }

    }

    _yuitest_coverline("build/format-message/format-message.js", 166);
return str;
}
_yuitest_coverline("build/format-message/format-message.js", 168);
TimeFormatter = function(values) {
    _yuitest_coverfunc("build/format-message/format-message.js", "TimeFormatter", 168);
_yuitest_coverline("build/format-message/format-message.js", 169);
DateFormatter.call(this, values);
    _yuitest_coverline("build/format-message/format-message.js", 170);
this.styles = {
        "short": [ 0, Y.DateFormat.TIME_FORMATS.HM_SHORT, Y.DateFormat.TIMEZONE_FORMATS.NONE ],
        "medium": [ 0, Y.DateFormat.TIME_FORMATS.HM_ABBREVIATED, Y.DateFormat.TIMEZONE_FORMATS.NONE ],
        "long": [ 0, Y.DateFormat.TIME_FORMATS.HM_ABBREVIATED, Y.DateFormat.TIMEZONE_FORMATS.Z_SHORT ],
        "full": [ 0, Y.DateFormat.TIME_FORMATS.HM_ABBREVIATED, Y.DateFormat.TIMEZONE_FORMATS.Z_ABBREVIATED ]
    };
    _yuitest_coverline("build/format-message/format-message.js", 176);
this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*time\\s*(,\\s*(\\w+)\\s*)?}";
}

_yuitest_coverline("build/format-message/format-message.js", 179);
TimeFormatter.prototype = new DateFormatter;
_yuitest_coverline("build/format-message/format-message.js", 180);
TimeFormatter.prototype.constructor = TimeFormatter;

_yuitest_coverline("build/format-message/format-message.js", 182);
TimeFormatter.createInstance = function(values) {
    _yuitest_coverfunc("build/format-message/format-message.js", "createInstance", 182);
_yuitest_coverline("build/format-message/format-message.js", 183);
return new TimeFormatter(values);
}
_yuitest_coverline("build/format-message/format-message.js", 185);
NumberFormatter = function(values) {
    _yuitest_coverfunc("build/format-message/format-message.js", "NumberFormatter", 185);
_yuitest_coverline("build/format-message/format-message.js", 186);
Formatter.call(this, values);
    _yuitest_coverline("build/format-message/format-message.js", 187);
this.styles = {
        "integer": Y.NumberFormat.STYLES.NUMBER_STYLE,
        "percent": Y.NumberFormat.STYLES.PERCENT_STYLE,
        "currency": Y.NumberFormat.STYLES.CURRENCY_STYLE
    };
    _yuitest_coverline("build/format-message/format-message.js", 192);
this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*number\\s*(,\\s*(\\w+)\\s*)?}";
}

_yuitest_coverline("build/format-message/format-message.js", 195);
NumberFormatter.prototype = new Formatter;
_yuitest_coverline("build/format-message/format-message.js", 196);
NumberFormatter.prototype.constructor = NumberFormatter;

_yuitest_coverline("build/format-message/format-message.js", 198);
NumberFormatter.createInstance = function(values) {
    _yuitest_coverfunc("build/format-message/format-message.js", "createInstance", 198);
_yuitest_coverline("build/format-message/format-message.js", 199);
return new NumberFormatter(values);
}

_yuitest_coverline("build/format-message/format-message.js", 202);
NumberFormatter.prototype.getParams = function(params, matches) {
    _yuitest_coverfunc("build/format-message/format-message.js", "getParams", 202);
_yuitest_coverline("build/format-message/format-message.js", 203);
if(matches) {
        _yuitest_coverline("build/format-message/format-message.js", 204);
if(matches[1]) {
            _yuitest_coverline("build/format-message/format-message.js", 205);
params.key = matches[1];
        }
        _yuitest_coverline("build/format-message/format-message.js", 207);
if(matches[3]) {
            _yuitest_coverline("build/format-message/format-message.js", 208);
params.style = matches[3];
        }
    }

    _yuitest_coverline("build/format-message/format-message.js", 212);
if(!params.style) {
        _yuitest_coverline("build/format-message/format-message.js", 213);
params.style = "integer";	//If no style, default to medium
	_yuitest_coverline("build/format-message/format-message.js", 214);
params.showDecimal = true;	//Show decimal parts too
    }

    _yuitest_coverline("build/format-message/format-message.js", 217);
if(!this.styles[params.style]) {	//Invalid style
        _yuitest_coverline("build/format-message/format-message.js", 218);
return false;
    }

    _yuitest_coverline("build/format-message/format-message.js", 221);
if(params.key && Formatter.prototype.getParams.call(this, params)) {
        _yuitest_coverline("build/format-message/format-message.js", 222);
return true;
    }

    _yuitest_coverline("build/format-message/format-message.js", 225);
return false;
}

_yuitest_coverline("build/format-message/format-message.js", 228);
NumberFormatter.prototype.format = function(str) {
    _yuitest_coverfunc("build/format-message/format-message.js", "format", 228);
_yuitest_coverline("build/format-message/format-message.js", 229);
var regex = new RegExp(this.regex, "gm");
    _yuitest_coverline("build/format-message/format-message.js", 230);
var matches = null;
    _yuitest_coverline("build/format-message/format-message.js", 231);
while((matches = regex.exec(str))) {
        _yuitest_coverline("build/format-message/format-message.js", 232);
var params = {};

        _yuitest_coverline("build/format-message/format-message.js", 234);
if(this.getParams(params, matches)) {
            //Got a match
            _yuitest_coverline("build/format-message/format-message.js", 236);
var format = new Y.NumberFormat(this.styles[params.style]);
            _yuitest_coverline("build/format-message/format-message.js", 237);
if(params.style == "integer" && !params.showDecimal) { format.setParseIntegerOnly(true); }
            _yuitest_coverline("build/format-message/format-message.js", 238);
str = str.replace(matches[0], format.format(params.value));
        }
    }

    _yuitest_coverline("build/format-message/format-message.js", 242);
return str;
}
_yuitest_coverline("build/format-message/format-message.js", 244);
SelectFormatter = function(values) {
    _yuitest_coverfunc("build/format-message/format-message.js", "SelectFormatter", 244);
_yuitest_coverline("build/format-message/format-message.js", 245);
Formatter.call(this, values);
    _yuitest_coverline("build/format-message/format-message.js", 246);
this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*select\\s*,\\s*";
}

_yuitest_coverline("build/format-message/format-message.js", 249);
SelectFormatter.prototype = new Formatter;
_yuitest_coverline("build/format-message/format-message.js", 250);
SelectFormatter.prototype.constructor = SelectFormatter;


_yuitest_coverline("build/format-message/format-message.js", 253);
SelectFormatter.createInstance = function(values) {
    _yuitest_coverfunc("build/format-message/format-message.js", "createInstance", 253);
_yuitest_coverline("build/format-message/format-message.js", 254);
return new SelectFormatter(values);
}

_yuitest_coverline("build/format-message/format-message.js", 257);
SelectFormatter.prototype.getParams = function(params, matches) {
    _yuitest_coverfunc("build/format-message/format-message.js", "getParams", 257);
_yuitest_coverline("build/format-message/format-message.js", 258);
if(matches) {
        _yuitest_coverline("build/format-message/format-message.js", 259);
if(matches[1]) {
            _yuitest_coverline("build/format-message/format-message.js", 260);
params.key = matches[1];
        }
    }

    _yuitest_coverline("build/format-message/format-message.js", 264);
if(params.key && Formatter.prototype.getParams.call(this, params)) {
        _yuitest_coverline("build/format-message/format-message.js", 265);
return true;
    }

    _yuitest_coverline("build/format-message/format-message.js", 268);
return false;
}

_yuitest_coverline("build/format-message/format-message.js", 271);
SelectFormatter.prototype.parseOptions = function(str, start) {
    _yuitest_coverfunc("build/format-message/format-message.js", "parseOptions", 271);
_yuitest_coverline("build/format-message/format-message.js", 272);
var options = {};
    _yuitest_coverline("build/format-message/format-message.js", 273);
var key = "", value = "", current = "";
    _yuitest_coverline("build/format-message/format-message.js", 274);
for(var i=start; i<str.length; i++) {
        _yuitest_coverline("build/format-message/format-message.js", 275);
var ch = str.charAt(i);
        _yuitest_coverline("build/format-message/format-message.js", 276);
if (ch == '\\') {
            _yuitest_coverline("build/format-message/format-message.js", 277);
current += ch + str.charAt(i+1);
            _yuitest_coverline("build/format-message/format-message.js", 278);
i++;
        } else {_yuitest_coverline("build/format-message/format-message.js", 279);
if (ch == '}') {
            _yuitest_coverline("build/format-message/format-message.js", 280);
if(current == "") {
                _yuitest_coverline("build/format-message/format-message.js", 281);
i++;
                _yuitest_coverline("build/format-message/format-message.js", 282);
break;
            }
            _yuitest_coverline("build/format-message/format-message.js", 284);
value = current;
            _yuitest_coverline("build/format-message/format-message.js", 285);
options[key.trim()] = value;
            _yuitest_coverline("build/format-message/format-message.js", 286);
current = key = value = "";
        } else {_yuitest_coverline("build/format-message/format-message.js", 287);
if (ch == '{') {
            _yuitest_coverline("build/format-message/format-message.js", 288);
key = current;
            _yuitest_coverline("build/format-message/format-message.js", 289);
current = "";
        } else {
            _yuitest_coverline("build/format-message/format-message.js", 291);
current += ch;
        }}}		
    }

    _yuitest_coverline("build/format-message/format-message.js", 295);
if(current != "") { 
        _yuitest_coverline("build/format-message/format-message.js", 296);
return null;
    }

    _yuitest_coverline("build/format-message/format-message.js", 299);
return {
        options: options, 
        next: i
    };
}

_yuitest_coverline("build/format-message/format-message.js", 305);
SelectFormatter.prototype.select = function(options, params) {
    _yuitest_coverfunc("build/format-message/format-message.js", "select", 305);
_yuitest_coverline("build/format-message/format-message.js", 306);
for ( var key in options ) {
        _yuitest_coverline("build/format-message/format-message.js", 307);
if( key == "other" ) {
            _yuitest_coverline("build/format-message/format-message.js", 308);
continue;	//Will use this only if everything else fails
        }

        _yuitest_coverline("build/format-message/format-message.js", 311);
if( key == params.value ) {
            _yuitest_coverline("build/format-message/format-message.js", 312);
return options[key];
        }
    }

    _yuitest_coverline("build/format-message/format-message.js", 316);
return options["other"];
}

_yuitest_coverline("build/format-message/format-message.js", 319);
SelectFormatter.prototype.format = function(str) {
    _yuitest_coverfunc("build/format-message/format-message.js", "format", 319);
_yuitest_coverline("build/format-message/format-message.js", 320);
var regex = new RegExp(this.regex, "gm");
    _yuitest_coverline("build/format-message/format-message.js", 321);
var matches = null;
    _yuitest_coverline("build/format-message/format-message.js", 322);
while((matches = regex.exec(str))) {
        _yuitest_coverline("build/format-message/format-message.js", 323);
var params = {};

        _yuitest_coverline("build/format-message/format-message.js", 325);
if(this.getParams(params, matches)) {
            //Got a match
            _yuitest_coverline("build/format-message/format-message.js", 327);
var options = this.parseOptions(str, regex.lastIndex);
            _yuitest_coverline("build/format-message/format-message.js", 328);
if(!options) {
                _yuitest_coverline("build/format-message/format-message.js", 329);
continue;
            }

            _yuitest_coverline("build/format-message/format-message.js", 332);
regex.lastIndex = options.next;
            _yuitest_coverline("build/format-message/format-message.js", 333);
options = options.options;

            _yuitest_coverline("build/format-message/format-message.js", 335);
var result = this.select(options, params);
            _yuitest_coverline("build/format-message/format-message.js", 336);
if(result) {
                _yuitest_coverline("build/format-message/format-message.js", 337);
var start = str.indexOf(matches[0]);
                _yuitest_coverline("build/format-message/format-message.js", 338);
str = str.slice(0, start) + result + str.slice(regex.lastIndex);
            }
        }

    }

    _yuitest_coverline("build/format-message/format-message.js", 344);
return str;
}
_yuitest_coverline("build/format-message/format-message.js", 346);
PluralFormatter = function(values) {
    _yuitest_coverfunc("build/format-message/format-message.js", "PluralFormatter", 346);
_yuitest_coverline("build/format-message/format-message.js", 347);
SelectFormatter.call(this, values);
    _yuitest_coverline("build/format-message/format-message.js", 348);
this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*plural\\s*,\\s*";
}

_yuitest_coverline("build/format-message/format-message.js", 351);
PluralFormatter.prototype = new SelectFormatter;
_yuitest_coverline("build/format-message/format-message.js", 352);
PluralFormatter.prototype.constructor = PluralFormatter;


_yuitest_coverline("build/format-message/format-message.js", 355);
PluralFormatter.createInstance = function(values) {
    _yuitest_coverfunc("build/format-message/format-message.js", "createInstance", 355);
_yuitest_coverline("build/format-message/format-message.js", 356);
return new PluralFormatter(values);
}

_yuitest_coverline("build/format-message/format-message.js", 359);
PluralFormatter.prototype.select = function(options, params) {
    _yuitest_coverfunc("build/format-message/format-message.js", "select", 359);
_yuitest_coverline("build/format-message/format-message.js", 360);
var result = options.other;
    _yuitest_coverline("build/format-message/format-message.js", 361);
if(params.value == 0 && options.zero) {
        _yuitest_coverline("build/format-message/format-message.js", 362);
result = options.zero;
    }
    _yuitest_coverline("build/format-message/format-message.js", 364);
if(params.value == 1 && options.one) {
        _yuitest_coverline("build/format-message/format-message.js", 365);
result = options.one;
    }
    _yuitest_coverline("build/format-message/format-message.js", 367);
if(params.value == 2 && options.two) {
        _yuitest_coverline("build/format-message/format-message.js", 368);
result = options.two;
    }

    _yuitest_coverline("build/format-message/format-message.js", 371);
result = result.replace("#", new NumberFormatter({VAL: params.value}).format("{VAL, number, integer}"));	//Use 'number' to format this part

    _yuitest_coverline("build/format-message/format-message.js", 373);
return result;
}
_yuitest_coverline("build/format-message/format-message.js", 375);
ChoiceFormatter = function(values) {
    _yuitest_coverfunc("build/format-message/format-message.js", "ChoiceFormatter", 375);
_yuitest_coverline("build/format-message/format-message.js", 376);
SelectFormatter.call(this, values);
    _yuitest_coverline("build/format-message/format-message.js", 377);
this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*choice\\s*,\\s*(.+)}";
}

_yuitest_coverline("build/format-message/format-message.js", 380);
ChoiceFormatter.prototype = new SelectFormatter;
_yuitest_coverline("build/format-message/format-message.js", 381);
ChoiceFormatter.prototype.constructor = ChoiceFormatter;


_yuitest_coverline("build/format-message/format-message.js", 384);
ChoiceFormatter.createInstance = function(values) {
    _yuitest_coverfunc("build/format-message/format-message.js", "createInstance", 384);
_yuitest_coverline("build/format-message/format-message.js", 385);
return new ChoiceFormatter(values);
}

_yuitest_coverline("build/format-message/format-message.js", 388);
ChoiceFormatter.prototype.parseOptions = function(choicesStr) {
    _yuitest_coverfunc("build/format-message/format-message.js", "parseOptions", 388);
_yuitest_coverline("build/format-message/format-message.js", 389);
var options = [];
    _yuitest_coverline("build/format-message/format-message.js", 390);
var choicesArray = choicesStr.split("|");
    _yuitest_coverline("build/format-message/format-message.js", 391);
for (var i=0; i<choicesArray.length; i++) {
        _yuitest_coverline("build/format-message/format-message.js", 392);
var choice = choicesArray[i];
        _yuitest_coverline("build/format-message/format-message.js", 393);
var relations = ['#', '<', '\u2264'];
        _yuitest_coverline("build/format-message/format-message.js", 394);
for (var j=0; j<relations.length; j++) {
            _yuitest_coverline("build/format-message/format-message.js", 395);
var rel = relations[j];
            _yuitest_coverline("build/format-message/format-message.js", 396);
if(choice.indexOf(rel) != -1) {
                _yuitest_coverline("build/format-message/format-message.js", 397);
var mapping = choice.split(rel);
                _yuitest_coverline("build/format-message/format-message.js", 398);
var ch = {
                    value: mapping[0],
                    result: mapping[1],
                    relation: rel
                };
                _yuitest_coverline("build/format-message/format-message.js", 403);
options.push(ch);
                _yuitest_coverline("build/format-message/format-message.js", 404);
break;
            }
        }
    }

    _yuitest_coverline("build/format-message/format-message.js", 409);
return options;
}

_yuitest_coverline("build/format-message/format-message.js", 412);
ChoiceFormatter.prototype.getParams = function(params, matches) {
    _yuitest_coverfunc("build/format-message/format-message.js", "getParams", 412);
_yuitest_coverline("build/format-message/format-message.js", 413);
if(SelectFormatter.prototype.getParams.call(this, params, matches)) {
        _yuitest_coverline("build/format-message/format-message.js", 414);
if(matches[2]) {
            _yuitest_coverline("build/format-message/format-message.js", 415);
params.choices = this.parseOptions(matches[2]);
            _yuitest_coverline("build/format-message/format-message.js", 416);
return params.choices === [] ? false: true;
        }
    }

    _yuitest_coverline("build/format-message/format-message.js", 420);
return false;
}

_yuitest_coverline("build/format-message/format-message.js", 423);
ChoiceFormatter.prototype.select = function(params) {
    _yuitest_coverfunc("build/format-message/format-message.js", "select", 423);
_yuitest_coverline("build/format-message/format-message.js", 424);
for ( var i=0; i<params.choices.length; i++) {
        _yuitest_coverline("build/format-message/format-message.js", 425);
var choice = params.choices[i];
        _yuitest_coverline("build/format-message/format-message.js", 426);
var value = choice.value, result = choice.result, relation = choice.relation;
        _yuitest_coverline("build/format-message/format-message.js", 427);
if( (relation == '#' && value == params.value) || (relation == '<' && value < params.value) || (relation == '\u2264' && value <= params.value)) {
        _yuitest_coverline("build/format-message/format-message.js", 428);
return result;
        }
    }

    _yuitest_coverline("build/format-message/format-message.js", 432);
return "";
}

_yuitest_coverline("build/format-message/format-message.js", 435);
ChoiceFormatter.prototype.format = function(str) {
    _yuitest_coverfunc("build/format-message/format-message.js", "format", 435);
_yuitest_coverline("build/format-message/format-message.js", 436);
var regex = new RegExp(this.regex, "gm");
    _yuitest_coverline("build/format-message/format-message.js", 437);
var matches = null;
    _yuitest_coverline("build/format-message/format-message.js", 438);
while((matches = regex.exec(str))) {
        _yuitest_coverline("build/format-message/format-message.js", 439);
var params = {};

        _yuitest_coverline("build/format-message/format-message.js", 441);
if(this.getParams(params, matches)) {
            _yuitest_coverline("build/format-message/format-message.js", 442);
var result = this.select(params);
            _yuitest_coverline("build/format-message/format-message.js", 443);
if(result) {
                _yuitest_coverline("build/format-message/format-message.js", 444);
str = str.replace(matches[0], result);
            }
        }
    }

    _yuitest_coverline("build/format-message/format-message.js", 449);
return str;
}
/**
 * Formatter classes. For each group found in the pattern, will try to parse with all of these formatters.
 * If a formatter fails to parse, the next one in the list try to do so.
 */
_yuitest_coverline("build/format-message/format-message.js", 455);
var formatters = [ StringFormatter, DateFormatter, TimeFormatter, NumberFormatter, ChoiceFormatter, PluralFormatter, SelectFormatter ];

_yuitest_coverline("build/format-message/format-message.js", 457);
Y.MessageFormat = {
    setTimeZone: Formatter.setTimeZone,

    getTimeZone: Formatter.getTimeZone,

    format: function(pattern, values) {
        _yuitest_coverfunc("build/format-message/format-message.js", "format", 462);
_yuitest_coverline("build/format-message/format-message.js", 463);
for(var i=0; i<formatters.length; i++) {
            _yuitest_coverline("build/format-message/format-message.js", 464);
var formatter = formatters[i].createInstance(values);
            _yuitest_coverline("build/format-message/format-message.js", 465);
pattern = formatter.format(pattern);
        }
        _yuitest_coverline("build/format-message/format-message.js", 467);
return pattern;
    }
}


}, '@VERSION@', {"requires": ["format-date", "format-numbers"]});
