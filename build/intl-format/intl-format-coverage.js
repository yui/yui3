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
_yuitest_coverage["build/intl-format/intl-format.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/intl-format/intl-format.js",
    code: []
};
_yuitest_coverage["build/intl-format/intl-format.js"].code=["YUI.add('intl-format', function (Y, NAME) {","","//For MessageFormat","","UnsupportedOperationException = function(message) {","    this.message = message;","    this.toString = function() {","        return \"UnsupportedOperationException: \" + this.message;","    }","}","","Formatter = function(values) {","    this.values = values;","};","","//Static methods","","Formatter.createInstance = function(values) {","    //return new Formatter(values);","    throw new UnsupportedOperationException('Not implemented');	//Must override in descendants","};","","//Public methods","","Formatter.prototype.getValue = function(key) {","    if(Y.Lang.isArray(this.values)) {","        key = parseInt(key); ","    }","    return this.values[key];","};","","Formatter.prototype.getParams = function(params) {","    if(!params || !params.key) {","        return false;","    }","","    var value = this.getValue(params.key);","	","    if(value != null) {","        params.value = value;","        return true;","    }","","    return false;","};","","Formatter.prototype.format = function(str, config) {","    throw new UnsupportedOperationException('Not implemented');	//Must override in descendants","};","","//For date and time formatters","Y.mix(Formatter, {","    getCurrentTimeZone: function() {","        var systemTZoneOffset = (new Date()).getTimezoneOffset()*-60;","        return Y.Date.Timezone.getTimezoneIdForOffset(systemTZoneOffset); ","    }","})","","if(String.prototype.trim == null) {","    String.prototype.trim = function() {","        return this.replace(/^\\s+/, '').replace(/\\s+$/, '');","    };","}","StringFormatter = function(values) {","    StringFormatter.superclass.constructor.call(this, values);","    this.regex = \"{\\\\s*([a-zA-Z0-9_]+)\\\\s*}\";","}","","Y.extend(StringFormatter, Formatter);","","StringFormatter.createInstance = function(values) {","    return new StringFormatter(values);","}","","StringFormatter.prototype.getParams = function(params, matches) {","    if(matches && matches[1]) {","        params.key = matches[1];","        if(Formatter.prototype.getParams.call(this, params)) {","            return true;","        }","    }","	","    return false;","}","","StringFormatter.prototype.format = function(str) {","    var regex = new RegExp(this.regex, \"gm\");","    var matches = null;","    while((matches = regex.exec(str))) {","        var params = {};","","        if(this.getParams(params, matches)) {","            //Got a match","            str = str.replace(matches[0], params.value);","        }","","    }","","    return str;","}","DateFormatter = function(values) {","    DateFormatter.superclass.constructor.call(this, values);","    this.styles = {","        \"short\":  [ Y.Date.DATE_FORMATS.YMD_SHORT, 0, 0 ],","        \"medium\": [ Y.Date.DATE_FORMATS.YMD_ABBREVIATED,0, 0 ],","        \"long\":   [ Y.Date.DATE_FORMATS.YMD_LONG, 0, 0 ],","        \"full\":   [ Y.Date.DATE_FORMATS.WYMD_LONG, 0, 0 ]","    };","    this.regex = \"{\\\\s*([a-zA-Z0-9_]+)\\\\s*,\\\\s*date\\\\s*(,\\\\s*(\\\\w+)\\\\s*)?}\";","}","","Y.extend(DateFormatter, Formatter);","","DateFormatter.createInstance = function(values) {","    return new DateFormatter(values);","}","","DateFormatter.prototype.getParams = function(params, matches) {","    if(matches) {","        if(matches[1]) {","            params.key = matches[1];","        }","        if(matches[3]) {","            params.style = matches[3];","        }","    }","","    if(!params.style) {","        params.style = \"medium\";","    }			//If no style, default to medium","","    if(!this.styles[params.style]) {","        return false;","    }	//Invalid style","","    if(params.key && Formatter.prototype.getParams.call(this, params)) {","        return true;","    }","","    return false;","}","","DateFormatter.prototype.format = function(str, config) {","    var regex = new RegExp(this.regex, \"gm\");","    var matches = null;","    while((matches = regex.exec(str))) {","        var params = {};","","        if(this.getParams(params, matches)) {","            //Got a match","            var style = this.styles[params.style];","            var result = Y.Date.format(new Date(params.value), {","                timezone: config.timezone || Formatter.getCurrentTimeZone(),","                dateFormat: style[0],","                timeFormat: style[1],","                timezoneFormat: style[2]","            })","            str = str.replace(matches[0], result);","        }","","    }","","    return str;","}","TimeFormatter = function(values) {","    TimeFormatter.superclass.constructor.call(this, values);","    this.styles = {","        \"short\": [ 0, Y.Date.TIME_FORMATS.HM_SHORT, Y.Date.TIMEZONE_FORMATS.NONE ],","        \"medium\": [ 0, Y.Date.TIME_FORMATS.HM_ABBREVIATED, Y.Date.TIMEZONE_FORMATS.NONE ],","        \"long\": [ 0, Y.Date.TIME_FORMATS.HM_ABBREVIATED, Y.Date.TIMEZONE_FORMATS.Z_SHORT ],","        \"full\": [ 0, Y.Date.TIME_FORMATS.HM_ABBREVIATED, Y.Date.TIMEZONE_FORMATS.Z_ABBREVIATED ]","    };","    this.regex = \"{\\\\s*([a-zA-Z0-9_]+)\\\\s*,\\\\s*time\\\\s*(,\\\\s*(\\\\w+)\\\\s*)?}\";","}","","Y.extend(TimeFormatter, DateFormatter);","","TimeFormatter.createInstance = function(values) {","    return new TimeFormatter(values);","}","NumberFormatter = function(values) {","    NumberFormatter.superclass.constructor.call(this, values);","    this.styles = {","        \"integer\": Y.Number.STYLES.NUMBER_STYLE,","        \"percent\": Y.Number.STYLES.PERCENT_STYLE,","        \"currency\": Y.Number.STYLES.CURRENCY_STYLE","    };","    this.regex = \"{\\\\s*([a-zA-Z0-9_]+)\\\\s*,\\\\s*number\\\\s*(,\\\\s*(\\\\w+)\\\\s*)?}\";","}","","Y.extend(NumberFormatter, Formatter);","","NumberFormatter.createInstance = function(values) {","    return new NumberFormatter(values);","}","","NumberFormatter.prototype.getParams = function(params, matches) {","    if(matches) {","        if(matches[1]) {","            params.key = matches[1];","        }","        if(matches[3]) {","            params.style = matches[3];","        }","    }","","    if(!params.style) {","        params.style = \"integer\";	//If no style, default to medium","	params.showDecimal = true;	//Show decimal parts too","    }","","    if(!this.styles[params.style]) {	//Invalid style","        return false;","    }","","    if(params.key && Formatter.prototype.getParams.call(this, params)) {","        return true;","    }","","    return false;","}","","NumberFormatter.prototype.format = function(str) {","    var regex = new RegExp(this.regex, \"gm\");","    var matches = null;","    while((matches = regex.exec(str))) {","        var params = {};","","        if(this.getParams(params, matches)) {","            //Got a match","            var config = {","                style: this.styles[params.style]","            }","            if(params.style == \"integer\" && !params.showDecimal) { config.parseIntegerOnly = true; }","            str = str.replace(matches[0], Y.Number.format(params.value, config));","        }","    }","","    return str;","}","SelectFormatter = function(values) {","    SelectFormatter.superclass.constructor.call(this, values);","    this.regex = \"{\\\\s*([a-zA-Z0-9_]+)\\\\s*,\\\\s*select\\\\s*,\\\\s*\";","}","","Y.extend(SelectFormatter, Formatter);","","SelectFormatter.createInstance = function(values) {","    return new SelectFormatter(values);","}","","SelectFormatter.prototype.getParams = function(params, matches) {","    if(matches) {","        if(matches[1]) {","            params.key = matches[1];","        }","    }","","    if(params.key && Formatter.prototype.getParams.call(this, params)) {","        return true;","    }","","    return false;","}","","SelectFormatter.prototype.parseOptions = function(str, start) {","    var options = {};","    var key = \"\", value = \"\", current = \"\";","    for(var i=start; i<str.length; i++) {","        var ch = str.charAt(i);","        if (ch == '\\\\') {","            current += ch + str.charAt(i+1);","            i++;","        } else if (ch == '}') {","            if(current == \"\") {","                i++;","                break;","            }","            value = current;","            options[key.trim()] = value;","            current = key = value = \"\";","        } else if (ch == '{') {","            key = current;","            current = \"\";","        } else {","            current += ch;","        }		","    }","","    if(current != \"\") { ","        return null;","    }","","    return {","        options: options, ","        next: i","    };","}","","SelectFormatter.prototype.select = function(options, params) {","    for ( var key in options ) {","        if( key == \"other\" ) {","            continue;	//Will use this only if everything else fails","        }","","        if( key == params.value ) {","            return options[key];","        }","    }","","    return options[\"other\"];","}","","SelectFormatter.prototype.format = function(str) {","    var regex = new RegExp(this.regex, \"gm\");","    var matches = null;","    while((matches = regex.exec(str))) {","        var params = {};","","        if(this.getParams(params, matches)) {","            //Got a match","            var options = this.parseOptions(str, regex.lastIndex);","            if(!options) {","                continue;","            }","","            regex.lastIndex = options.next;","            options = options.options;","","            var result = this.select(options, params);","            if(result) {","                var start = str.indexOf(matches[0]);","                str = str.slice(0, start) + result + str.slice(regex.lastIndex);","            }","        }","","    }","","    return str;","}","PluralFormatter = function(values) {","    PluralFormatter.superclass.constructor.call(this, values);","    this.regex = \"{\\\\s*([a-zA-Z0-9_]+)\\\\s*,\\\\s*plural\\\\s*,\\\\s*\";","}","","Y.extend(PluralFormatter, SelectFormatter);","","PluralFormatter.createInstance = function(values) {","    return new PluralFormatter(values);","}","","PluralFormatter.prototype.select = function(options, params) {","    var result = options.other;","    if(params.value == 0 && options.zero) {","        result = options.zero;","    }","    if(params.value == 1 && options.one) {","        result = options.one;","    }","    if(params.value == 2 && options.two) {","        result = options.two;","    }","","    result = result.replace(\"#\", new NumberFormatter({VAL: params.value}).format(\"{VAL, number, integer}\"));	//Use 'number' to format this part","","    return result;","}","ChoiceFormatter = function(values) {","    ChoiceFormatter.superclass.constructor.call(this, values);","    this.regex = \"{\\\\s*([a-zA-Z0-9_]+)\\\\s*,\\\\s*choice\\\\s*,\\\\s*(.+)}\";","}","","Y.extend(ChoiceFormatter, SelectFormatter);","","ChoiceFormatter.createInstance = function(values) {","    return new ChoiceFormatter(values);","}","","ChoiceFormatter.prototype.parseOptions = function(choicesStr) {","    var options = [];","    var choicesArray = choicesStr.split(\"|\");","    for (var i=0; i<choicesArray.length; i++) {","        var choice = choicesArray[i];","        var relations = ['#', '<', '\\u2264'];","        for (var j=0; j<relations.length; j++) {","            var rel = relations[j];","            if(choice.indexOf(rel) != -1) {","                var mapping = choice.split(rel);","                var ch = {","                    value: mapping[0],","                    result: mapping[1],","                    relation: rel","                };","                options.push(ch);","                break;","            }","        }","    }","","    return options;","}","","ChoiceFormatter.prototype.getParams = function(params, matches) {","    if(SelectFormatter.prototype.getParams.call(this, params, matches)) {","        if(matches[2]) {","            params.choices = this.parseOptions(matches[2]);","            return params.choices === [] ? false: true;","        }","    }","","    return false;","}","","ChoiceFormatter.prototype.select = function(params) {","    for ( var i=0; i<params.choices.length; i++) {","        var choice = params.choices[i];","        var value = choice.value, result = choice.result, relation = choice.relation;","        if( (relation == '#' && value == params.value) || (relation == '<' && value < params.value) || (relation == '\\u2264' && value <= params.value)) {","        return result;","        }","    }","","    return \"\";","}","","ChoiceFormatter.prototype.format = function(str) {","    var regex = new RegExp(this.regex, \"gm\");","    var matches = null;","    while((matches = regex.exec(str))) {","        var params = {};","","        if(this.getParams(params, matches)) {","            var result = this.select(params);","            if(result) {","                str = str.replace(matches[0], result);","            }","        }","    }","","    return str;","}","/**"," * Formatter classes. For each group found in the pattern, will try to parse with all of these formatters."," * If a formatter fails to parse, the next one in the list try to do so."," */","var formatters = [ StringFormatter, DateFormatter, TimeFormatter, NumberFormatter, ChoiceFormatter, PluralFormatter, SelectFormatter ];","","Y.mix(Y.Intl, {","    formatMessage: function(pattern, values, config) {","        config = config || {};","        for(var i=0; i<formatters.length; i++) {","            var formatter = formatters[i].createInstance(values);","            pattern = formatter.format(pattern, config);","        }","        return pattern;","    }","})","","","}, '@VERSION@', {\"requires\": [\"datatype-date-advanced-format\", \"datatype-number-advanced-format\", \"intl\"]});"];
_yuitest_coverage["build/intl-format/intl-format.js"].lines = {"1":0,"5":0,"6":0,"7":0,"8":0,"12":0,"13":0,"18":0,"20":0,"25":0,"26":0,"27":0,"29":0,"32":0,"33":0,"34":0,"37":0,"39":0,"40":0,"41":0,"44":0,"47":0,"48":0,"52":0,"54":0,"55":0,"59":0,"60":0,"61":0,"64":0,"65":0,"66":0,"69":0,"71":0,"72":0,"75":0,"76":0,"77":0,"78":0,"79":0,"83":0,"86":0,"87":0,"88":0,"89":0,"90":0,"92":0,"94":0,"99":0,"101":0,"102":0,"103":0,"109":0,"112":0,"114":0,"115":0,"118":0,"119":0,"120":0,"121":0,"123":0,"124":0,"128":0,"129":0,"132":0,"133":0,"136":0,"137":0,"140":0,"143":0,"144":0,"145":0,"146":0,"147":0,"149":0,"151":0,"152":0,"158":0,"163":0,"165":0,"166":0,"167":0,"173":0,"176":0,"178":0,"179":0,"181":0,"182":0,"183":0,"188":0,"191":0,"193":0,"194":0,"197":0,"198":0,"199":0,"200":0,"202":0,"203":0,"207":0,"208":0,"209":0,"212":0,"213":0,"216":0,"217":0,"220":0,"223":0,"224":0,"225":0,"226":0,"227":0,"229":0,"231":0,"234":0,"235":0,"239":0,"241":0,"242":0,"243":0,"246":0,"248":0,"249":0,"252":0,"253":0,"254":0,"255":0,"259":0,"260":0,"263":0,"266":0,"267":0,"268":0,"269":0,"270":0,"271":0,"272":0,"273":0,"274":0,"275":0,"276":0,"277":0,"279":0,"280":0,"281":0,"282":0,"283":0,"284":0,"286":0,"290":0,"291":0,"294":0,"300":0,"301":0,"302":0,"303":0,"306":0,"307":0,"311":0,"314":0,"315":0,"316":0,"317":0,"318":0,"320":0,"322":0,"323":0,"324":0,"327":0,"328":0,"330":0,"331":0,"332":0,"333":0,"339":0,"341":0,"342":0,"343":0,"346":0,"348":0,"349":0,"352":0,"353":0,"354":0,"355":0,"357":0,"358":0,"360":0,"361":0,"364":0,"366":0,"368":0,"369":0,"370":0,"373":0,"375":0,"376":0,"379":0,"380":0,"381":0,"382":0,"383":0,"384":0,"385":0,"386":0,"387":0,"388":0,"389":0,"394":0,"395":0,"400":0,"403":0,"404":0,"405":0,"406":0,"407":0,"411":0,"414":0,"415":0,"416":0,"417":0,"418":0,"419":0,"423":0,"426":0,"427":0,"428":0,"429":0,"430":0,"432":0,"433":0,"434":0,"435":0,"440":0,"446":0,"448":0,"450":0,"451":0,"452":0,"453":0,"455":0};
_yuitest_coverage["build/intl-format/intl-format.js"].functions = {"toString:7":0,"UnsupportedOperationException:5":0,"Formatter:12":0,"createInstance:18":0,"getValue:25":0,"getParams:32":0,"format:47":0,"getCurrentTimeZone:53":0,"trim:60":0,"StringFormatter:64":0,"createInstance:71":0,"getParams:75":0,"format:86":0,"DateFormatter:101":0,"createInstance:114":0,"getParams:118":0,"format:143":0,"TimeFormatter:165":0,"createInstance:178":0,"NumberFormatter:181":0,"createInstance:193":0,"getParams:197":0,"format:223":0,"SelectFormatter:241":0,"createInstance:248":0,"getParams:252":0,"parseOptions:266":0,"select:300":0,"format:314":0,"PluralFormatter:341":0,"createInstance:348":0,"select:352":0,"ChoiceFormatter:368":0,"createInstance:375":0,"parseOptions:379":0,"getParams:403":0,"select:414":0,"format:426":0,"formatMessage:449":0,"(anonymous 1):1":0};
_yuitest_coverage["build/intl-format/intl-format.js"].coveredLines = 241;
_yuitest_coverage["build/intl-format/intl-format.js"].coveredFunctions = 40;
_yuitest_coverline("build/intl-format/intl-format.js", 1);
YUI.add('intl-format', function (Y, NAME) {

//For MessageFormat

_yuitest_coverfunc("build/intl-format/intl-format.js", "(anonymous 1)", 1);
_yuitest_coverline("build/intl-format/intl-format.js", 5);
UnsupportedOperationException = function(message) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "UnsupportedOperationException", 5);
_yuitest_coverline("build/intl-format/intl-format.js", 6);
this.message = message;
    _yuitest_coverline("build/intl-format/intl-format.js", 7);
this.toString = function() {
        _yuitest_coverfunc("build/intl-format/intl-format.js", "toString", 7);
_yuitest_coverline("build/intl-format/intl-format.js", 8);
return "UnsupportedOperationException: " + this.message;
    }
}

_yuitest_coverline("build/intl-format/intl-format.js", 12);
Formatter = function(values) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "Formatter", 12);
_yuitest_coverline("build/intl-format/intl-format.js", 13);
this.values = values;
};

//Static methods

_yuitest_coverline("build/intl-format/intl-format.js", 18);
Formatter.createInstance = function(values) {
    //return new Formatter(values);
    _yuitest_coverfunc("build/intl-format/intl-format.js", "createInstance", 18);
_yuitest_coverline("build/intl-format/intl-format.js", 20);
throw new UnsupportedOperationException('Not implemented');	//Must override in descendants
};

//Public methods

_yuitest_coverline("build/intl-format/intl-format.js", 25);
Formatter.prototype.getValue = function(key) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "getValue", 25);
_yuitest_coverline("build/intl-format/intl-format.js", 26);
if(Y.Lang.isArray(this.values)) {
        _yuitest_coverline("build/intl-format/intl-format.js", 27);
key = parseInt(key); 
    }
    _yuitest_coverline("build/intl-format/intl-format.js", 29);
return this.values[key];
};

_yuitest_coverline("build/intl-format/intl-format.js", 32);
Formatter.prototype.getParams = function(params) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "getParams", 32);
_yuitest_coverline("build/intl-format/intl-format.js", 33);
if(!params || !params.key) {
        _yuitest_coverline("build/intl-format/intl-format.js", 34);
return false;
    }

    _yuitest_coverline("build/intl-format/intl-format.js", 37);
var value = this.getValue(params.key);
	
    _yuitest_coverline("build/intl-format/intl-format.js", 39);
if(value != null) {
        _yuitest_coverline("build/intl-format/intl-format.js", 40);
params.value = value;
        _yuitest_coverline("build/intl-format/intl-format.js", 41);
return true;
    }

    _yuitest_coverline("build/intl-format/intl-format.js", 44);
return false;
};

_yuitest_coverline("build/intl-format/intl-format.js", 47);
Formatter.prototype.format = function(str, config) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "format", 47);
_yuitest_coverline("build/intl-format/intl-format.js", 48);
throw new UnsupportedOperationException('Not implemented');	//Must override in descendants
};

//For date and time formatters
_yuitest_coverline("build/intl-format/intl-format.js", 52);
Y.mix(Formatter, {
    getCurrentTimeZone: function() {
        _yuitest_coverfunc("build/intl-format/intl-format.js", "getCurrentTimeZone", 53);
_yuitest_coverline("build/intl-format/intl-format.js", 54);
var systemTZoneOffset = (new Date()).getTimezoneOffset()*-60;
        _yuitest_coverline("build/intl-format/intl-format.js", 55);
return Y.Date.Timezone.getTimezoneIdForOffset(systemTZoneOffset); 
    }
})

_yuitest_coverline("build/intl-format/intl-format.js", 59);
if(String.prototype.trim == null) {
    _yuitest_coverline("build/intl-format/intl-format.js", 60);
String.prototype.trim = function() {
        _yuitest_coverfunc("build/intl-format/intl-format.js", "trim", 60);
_yuitest_coverline("build/intl-format/intl-format.js", 61);
return this.replace(/^\s+/, '').replace(/\s+$/, '');
    };
}
_yuitest_coverline("build/intl-format/intl-format.js", 64);
StringFormatter = function(values) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "StringFormatter", 64);
_yuitest_coverline("build/intl-format/intl-format.js", 65);
StringFormatter.superclass.constructor.call(this, values);
    _yuitest_coverline("build/intl-format/intl-format.js", 66);
this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*}";
}

_yuitest_coverline("build/intl-format/intl-format.js", 69);
Y.extend(StringFormatter, Formatter);

_yuitest_coverline("build/intl-format/intl-format.js", 71);
StringFormatter.createInstance = function(values) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "createInstance", 71);
_yuitest_coverline("build/intl-format/intl-format.js", 72);
return new StringFormatter(values);
}

_yuitest_coverline("build/intl-format/intl-format.js", 75);
StringFormatter.prototype.getParams = function(params, matches) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "getParams", 75);
_yuitest_coverline("build/intl-format/intl-format.js", 76);
if(matches && matches[1]) {
        _yuitest_coverline("build/intl-format/intl-format.js", 77);
params.key = matches[1];
        _yuitest_coverline("build/intl-format/intl-format.js", 78);
if(Formatter.prototype.getParams.call(this, params)) {
            _yuitest_coverline("build/intl-format/intl-format.js", 79);
return true;
        }
    }
	
    _yuitest_coverline("build/intl-format/intl-format.js", 83);
return false;
}

_yuitest_coverline("build/intl-format/intl-format.js", 86);
StringFormatter.prototype.format = function(str) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "format", 86);
_yuitest_coverline("build/intl-format/intl-format.js", 87);
var regex = new RegExp(this.regex, "gm");
    _yuitest_coverline("build/intl-format/intl-format.js", 88);
var matches = null;
    _yuitest_coverline("build/intl-format/intl-format.js", 89);
while((matches = regex.exec(str))) {
        _yuitest_coverline("build/intl-format/intl-format.js", 90);
var params = {};

        _yuitest_coverline("build/intl-format/intl-format.js", 92);
if(this.getParams(params, matches)) {
            //Got a match
            _yuitest_coverline("build/intl-format/intl-format.js", 94);
str = str.replace(matches[0], params.value);
        }

    }

    _yuitest_coverline("build/intl-format/intl-format.js", 99);
return str;
}
_yuitest_coverline("build/intl-format/intl-format.js", 101);
DateFormatter = function(values) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "DateFormatter", 101);
_yuitest_coverline("build/intl-format/intl-format.js", 102);
DateFormatter.superclass.constructor.call(this, values);
    _yuitest_coverline("build/intl-format/intl-format.js", 103);
this.styles = {
        "short":  [ Y.Date.DATE_FORMATS.YMD_SHORT, 0, 0 ],
        "medium": [ Y.Date.DATE_FORMATS.YMD_ABBREVIATED,0, 0 ],
        "long":   [ Y.Date.DATE_FORMATS.YMD_LONG, 0, 0 ],
        "full":   [ Y.Date.DATE_FORMATS.WYMD_LONG, 0, 0 ]
    };
    _yuitest_coverline("build/intl-format/intl-format.js", 109);
this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*date\\s*(,\\s*(\\w+)\\s*)?}";
}

_yuitest_coverline("build/intl-format/intl-format.js", 112);
Y.extend(DateFormatter, Formatter);

_yuitest_coverline("build/intl-format/intl-format.js", 114);
DateFormatter.createInstance = function(values) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "createInstance", 114);
_yuitest_coverline("build/intl-format/intl-format.js", 115);
return new DateFormatter(values);
}

_yuitest_coverline("build/intl-format/intl-format.js", 118);
DateFormatter.prototype.getParams = function(params, matches) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "getParams", 118);
_yuitest_coverline("build/intl-format/intl-format.js", 119);
if(matches) {
        _yuitest_coverline("build/intl-format/intl-format.js", 120);
if(matches[1]) {
            _yuitest_coverline("build/intl-format/intl-format.js", 121);
params.key = matches[1];
        }
        _yuitest_coverline("build/intl-format/intl-format.js", 123);
if(matches[3]) {
            _yuitest_coverline("build/intl-format/intl-format.js", 124);
params.style = matches[3];
        }
    }

    _yuitest_coverline("build/intl-format/intl-format.js", 128);
if(!params.style) {
        _yuitest_coverline("build/intl-format/intl-format.js", 129);
params.style = "medium";
    }			//If no style, default to medium

    _yuitest_coverline("build/intl-format/intl-format.js", 132);
if(!this.styles[params.style]) {
        _yuitest_coverline("build/intl-format/intl-format.js", 133);
return false;
    }	//Invalid style

    _yuitest_coverline("build/intl-format/intl-format.js", 136);
if(params.key && Formatter.prototype.getParams.call(this, params)) {
        _yuitest_coverline("build/intl-format/intl-format.js", 137);
return true;
    }

    _yuitest_coverline("build/intl-format/intl-format.js", 140);
return false;
}

_yuitest_coverline("build/intl-format/intl-format.js", 143);
DateFormatter.prototype.format = function(str, config) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "format", 143);
_yuitest_coverline("build/intl-format/intl-format.js", 144);
var regex = new RegExp(this.regex, "gm");
    _yuitest_coverline("build/intl-format/intl-format.js", 145);
var matches = null;
    _yuitest_coverline("build/intl-format/intl-format.js", 146);
while((matches = regex.exec(str))) {
        _yuitest_coverline("build/intl-format/intl-format.js", 147);
var params = {};

        _yuitest_coverline("build/intl-format/intl-format.js", 149);
if(this.getParams(params, matches)) {
            //Got a match
            _yuitest_coverline("build/intl-format/intl-format.js", 151);
var style = this.styles[params.style];
            _yuitest_coverline("build/intl-format/intl-format.js", 152);
var result = Y.Date.format(new Date(params.value), {
                timezone: config.timezone || Formatter.getCurrentTimeZone(),
                dateFormat: style[0],
                timeFormat: style[1],
                timezoneFormat: style[2]
            })
            _yuitest_coverline("build/intl-format/intl-format.js", 158);
str = str.replace(matches[0], result);
        }

    }

    _yuitest_coverline("build/intl-format/intl-format.js", 163);
return str;
}
_yuitest_coverline("build/intl-format/intl-format.js", 165);
TimeFormatter = function(values) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "TimeFormatter", 165);
_yuitest_coverline("build/intl-format/intl-format.js", 166);
TimeFormatter.superclass.constructor.call(this, values);
    _yuitest_coverline("build/intl-format/intl-format.js", 167);
this.styles = {
        "short": [ 0, Y.Date.TIME_FORMATS.HM_SHORT, Y.Date.TIMEZONE_FORMATS.NONE ],
        "medium": [ 0, Y.Date.TIME_FORMATS.HM_ABBREVIATED, Y.Date.TIMEZONE_FORMATS.NONE ],
        "long": [ 0, Y.Date.TIME_FORMATS.HM_ABBREVIATED, Y.Date.TIMEZONE_FORMATS.Z_SHORT ],
        "full": [ 0, Y.Date.TIME_FORMATS.HM_ABBREVIATED, Y.Date.TIMEZONE_FORMATS.Z_ABBREVIATED ]
    };
    _yuitest_coverline("build/intl-format/intl-format.js", 173);
this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*time\\s*(,\\s*(\\w+)\\s*)?}";
}

_yuitest_coverline("build/intl-format/intl-format.js", 176);
Y.extend(TimeFormatter, DateFormatter);

_yuitest_coverline("build/intl-format/intl-format.js", 178);
TimeFormatter.createInstance = function(values) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "createInstance", 178);
_yuitest_coverline("build/intl-format/intl-format.js", 179);
return new TimeFormatter(values);
}
_yuitest_coverline("build/intl-format/intl-format.js", 181);
NumberFormatter = function(values) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "NumberFormatter", 181);
_yuitest_coverline("build/intl-format/intl-format.js", 182);
NumberFormatter.superclass.constructor.call(this, values);
    _yuitest_coverline("build/intl-format/intl-format.js", 183);
this.styles = {
        "integer": Y.Number.STYLES.NUMBER_STYLE,
        "percent": Y.Number.STYLES.PERCENT_STYLE,
        "currency": Y.Number.STYLES.CURRENCY_STYLE
    };
    _yuitest_coverline("build/intl-format/intl-format.js", 188);
this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*number\\s*(,\\s*(\\w+)\\s*)?}";
}

_yuitest_coverline("build/intl-format/intl-format.js", 191);
Y.extend(NumberFormatter, Formatter);

_yuitest_coverline("build/intl-format/intl-format.js", 193);
NumberFormatter.createInstance = function(values) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "createInstance", 193);
_yuitest_coverline("build/intl-format/intl-format.js", 194);
return new NumberFormatter(values);
}

_yuitest_coverline("build/intl-format/intl-format.js", 197);
NumberFormatter.prototype.getParams = function(params, matches) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "getParams", 197);
_yuitest_coverline("build/intl-format/intl-format.js", 198);
if(matches) {
        _yuitest_coverline("build/intl-format/intl-format.js", 199);
if(matches[1]) {
            _yuitest_coverline("build/intl-format/intl-format.js", 200);
params.key = matches[1];
        }
        _yuitest_coverline("build/intl-format/intl-format.js", 202);
if(matches[3]) {
            _yuitest_coverline("build/intl-format/intl-format.js", 203);
params.style = matches[3];
        }
    }

    _yuitest_coverline("build/intl-format/intl-format.js", 207);
if(!params.style) {
        _yuitest_coverline("build/intl-format/intl-format.js", 208);
params.style = "integer";	//If no style, default to medium
	_yuitest_coverline("build/intl-format/intl-format.js", 209);
params.showDecimal = true;	//Show decimal parts too
    }

    _yuitest_coverline("build/intl-format/intl-format.js", 212);
if(!this.styles[params.style]) {	//Invalid style
        _yuitest_coverline("build/intl-format/intl-format.js", 213);
return false;
    }

    _yuitest_coverline("build/intl-format/intl-format.js", 216);
if(params.key && Formatter.prototype.getParams.call(this, params)) {
        _yuitest_coverline("build/intl-format/intl-format.js", 217);
return true;
    }

    _yuitest_coverline("build/intl-format/intl-format.js", 220);
return false;
}

_yuitest_coverline("build/intl-format/intl-format.js", 223);
NumberFormatter.prototype.format = function(str) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "format", 223);
_yuitest_coverline("build/intl-format/intl-format.js", 224);
var regex = new RegExp(this.regex, "gm");
    _yuitest_coverline("build/intl-format/intl-format.js", 225);
var matches = null;
    _yuitest_coverline("build/intl-format/intl-format.js", 226);
while((matches = regex.exec(str))) {
        _yuitest_coverline("build/intl-format/intl-format.js", 227);
var params = {};

        _yuitest_coverline("build/intl-format/intl-format.js", 229);
if(this.getParams(params, matches)) {
            //Got a match
            _yuitest_coverline("build/intl-format/intl-format.js", 231);
var config = {
                style: this.styles[params.style]
            }
            _yuitest_coverline("build/intl-format/intl-format.js", 234);
if(params.style == "integer" && !params.showDecimal) { config.parseIntegerOnly = true; }
            _yuitest_coverline("build/intl-format/intl-format.js", 235);
str = str.replace(matches[0], Y.Number.format(params.value, config));
        }
    }

    _yuitest_coverline("build/intl-format/intl-format.js", 239);
return str;
}
_yuitest_coverline("build/intl-format/intl-format.js", 241);
SelectFormatter = function(values) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "SelectFormatter", 241);
_yuitest_coverline("build/intl-format/intl-format.js", 242);
SelectFormatter.superclass.constructor.call(this, values);
    _yuitest_coverline("build/intl-format/intl-format.js", 243);
this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*select\\s*,\\s*";
}

_yuitest_coverline("build/intl-format/intl-format.js", 246);
Y.extend(SelectFormatter, Formatter);

_yuitest_coverline("build/intl-format/intl-format.js", 248);
SelectFormatter.createInstance = function(values) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "createInstance", 248);
_yuitest_coverline("build/intl-format/intl-format.js", 249);
return new SelectFormatter(values);
}

_yuitest_coverline("build/intl-format/intl-format.js", 252);
SelectFormatter.prototype.getParams = function(params, matches) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "getParams", 252);
_yuitest_coverline("build/intl-format/intl-format.js", 253);
if(matches) {
        _yuitest_coverline("build/intl-format/intl-format.js", 254);
if(matches[1]) {
            _yuitest_coverline("build/intl-format/intl-format.js", 255);
params.key = matches[1];
        }
    }

    _yuitest_coverline("build/intl-format/intl-format.js", 259);
if(params.key && Formatter.prototype.getParams.call(this, params)) {
        _yuitest_coverline("build/intl-format/intl-format.js", 260);
return true;
    }

    _yuitest_coverline("build/intl-format/intl-format.js", 263);
return false;
}

_yuitest_coverline("build/intl-format/intl-format.js", 266);
SelectFormatter.prototype.parseOptions = function(str, start) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "parseOptions", 266);
_yuitest_coverline("build/intl-format/intl-format.js", 267);
var options = {};
    _yuitest_coverline("build/intl-format/intl-format.js", 268);
var key = "", value = "", current = "";
    _yuitest_coverline("build/intl-format/intl-format.js", 269);
for(var i=start; i<str.length; i++) {
        _yuitest_coverline("build/intl-format/intl-format.js", 270);
var ch = str.charAt(i);
        _yuitest_coverline("build/intl-format/intl-format.js", 271);
if (ch == '\\') {
            _yuitest_coverline("build/intl-format/intl-format.js", 272);
current += ch + str.charAt(i+1);
            _yuitest_coverline("build/intl-format/intl-format.js", 273);
i++;
        } else {_yuitest_coverline("build/intl-format/intl-format.js", 274);
if (ch == '}') {
            _yuitest_coverline("build/intl-format/intl-format.js", 275);
if(current == "") {
                _yuitest_coverline("build/intl-format/intl-format.js", 276);
i++;
                _yuitest_coverline("build/intl-format/intl-format.js", 277);
break;
            }
            _yuitest_coverline("build/intl-format/intl-format.js", 279);
value = current;
            _yuitest_coverline("build/intl-format/intl-format.js", 280);
options[key.trim()] = value;
            _yuitest_coverline("build/intl-format/intl-format.js", 281);
current = key = value = "";
        } else {_yuitest_coverline("build/intl-format/intl-format.js", 282);
if (ch == '{') {
            _yuitest_coverline("build/intl-format/intl-format.js", 283);
key = current;
            _yuitest_coverline("build/intl-format/intl-format.js", 284);
current = "";
        } else {
            _yuitest_coverline("build/intl-format/intl-format.js", 286);
current += ch;
        }}}		
    }

    _yuitest_coverline("build/intl-format/intl-format.js", 290);
if(current != "") { 
        _yuitest_coverline("build/intl-format/intl-format.js", 291);
return null;
    }

    _yuitest_coverline("build/intl-format/intl-format.js", 294);
return {
        options: options, 
        next: i
    };
}

_yuitest_coverline("build/intl-format/intl-format.js", 300);
SelectFormatter.prototype.select = function(options, params) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "select", 300);
_yuitest_coverline("build/intl-format/intl-format.js", 301);
for ( var key in options ) {
        _yuitest_coverline("build/intl-format/intl-format.js", 302);
if( key == "other" ) {
            _yuitest_coverline("build/intl-format/intl-format.js", 303);
continue;	//Will use this only if everything else fails
        }

        _yuitest_coverline("build/intl-format/intl-format.js", 306);
if( key == params.value ) {
            _yuitest_coverline("build/intl-format/intl-format.js", 307);
return options[key];
        }
    }

    _yuitest_coverline("build/intl-format/intl-format.js", 311);
return options["other"];
}

_yuitest_coverline("build/intl-format/intl-format.js", 314);
SelectFormatter.prototype.format = function(str) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "format", 314);
_yuitest_coverline("build/intl-format/intl-format.js", 315);
var regex = new RegExp(this.regex, "gm");
    _yuitest_coverline("build/intl-format/intl-format.js", 316);
var matches = null;
    _yuitest_coverline("build/intl-format/intl-format.js", 317);
while((matches = regex.exec(str))) {
        _yuitest_coverline("build/intl-format/intl-format.js", 318);
var params = {};

        _yuitest_coverline("build/intl-format/intl-format.js", 320);
if(this.getParams(params, matches)) {
            //Got a match
            _yuitest_coverline("build/intl-format/intl-format.js", 322);
var options = this.parseOptions(str, regex.lastIndex);
            _yuitest_coverline("build/intl-format/intl-format.js", 323);
if(!options) {
                _yuitest_coverline("build/intl-format/intl-format.js", 324);
continue;
            }

            _yuitest_coverline("build/intl-format/intl-format.js", 327);
regex.lastIndex = options.next;
            _yuitest_coverline("build/intl-format/intl-format.js", 328);
options = options.options;

            _yuitest_coverline("build/intl-format/intl-format.js", 330);
var result = this.select(options, params);
            _yuitest_coverline("build/intl-format/intl-format.js", 331);
if(result) {
                _yuitest_coverline("build/intl-format/intl-format.js", 332);
var start = str.indexOf(matches[0]);
                _yuitest_coverline("build/intl-format/intl-format.js", 333);
str = str.slice(0, start) + result + str.slice(regex.lastIndex);
            }
        }

    }

    _yuitest_coverline("build/intl-format/intl-format.js", 339);
return str;
}
_yuitest_coverline("build/intl-format/intl-format.js", 341);
PluralFormatter = function(values) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "PluralFormatter", 341);
_yuitest_coverline("build/intl-format/intl-format.js", 342);
PluralFormatter.superclass.constructor.call(this, values);
    _yuitest_coverline("build/intl-format/intl-format.js", 343);
this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*plural\\s*,\\s*";
}

_yuitest_coverline("build/intl-format/intl-format.js", 346);
Y.extend(PluralFormatter, SelectFormatter);

_yuitest_coverline("build/intl-format/intl-format.js", 348);
PluralFormatter.createInstance = function(values) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "createInstance", 348);
_yuitest_coverline("build/intl-format/intl-format.js", 349);
return new PluralFormatter(values);
}

_yuitest_coverline("build/intl-format/intl-format.js", 352);
PluralFormatter.prototype.select = function(options, params) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "select", 352);
_yuitest_coverline("build/intl-format/intl-format.js", 353);
var result = options.other;
    _yuitest_coverline("build/intl-format/intl-format.js", 354);
if(params.value == 0 && options.zero) {
        _yuitest_coverline("build/intl-format/intl-format.js", 355);
result = options.zero;
    }
    _yuitest_coverline("build/intl-format/intl-format.js", 357);
if(params.value == 1 && options.one) {
        _yuitest_coverline("build/intl-format/intl-format.js", 358);
result = options.one;
    }
    _yuitest_coverline("build/intl-format/intl-format.js", 360);
if(params.value == 2 && options.two) {
        _yuitest_coverline("build/intl-format/intl-format.js", 361);
result = options.two;
    }

    _yuitest_coverline("build/intl-format/intl-format.js", 364);
result = result.replace("#", new NumberFormatter({VAL: params.value}).format("{VAL, number, integer}"));	//Use 'number' to format this part

    _yuitest_coverline("build/intl-format/intl-format.js", 366);
return result;
}
_yuitest_coverline("build/intl-format/intl-format.js", 368);
ChoiceFormatter = function(values) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "ChoiceFormatter", 368);
_yuitest_coverline("build/intl-format/intl-format.js", 369);
ChoiceFormatter.superclass.constructor.call(this, values);
    _yuitest_coverline("build/intl-format/intl-format.js", 370);
this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*choice\\s*,\\s*(.+)}";
}

_yuitest_coverline("build/intl-format/intl-format.js", 373);
Y.extend(ChoiceFormatter, SelectFormatter);

_yuitest_coverline("build/intl-format/intl-format.js", 375);
ChoiceFormatter.createInstance = function(values) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "createInstance", 375);
_yuitest_coverline("build/intl-format/intl-format.js", 376);
return new ChoiceFormatter(values);
}

_yuitest_coverline("build/intl-format/intl-format.js", 379);
ChoiceFormatter.prototype.parseOptions = function(choicesStr) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "parseOptions", 379);
_yuitest_coverline("build/intl-format/intl-format.js", 380);
var options = [];
    _yuitest_coverline("build/intl-format/intl-format.js", 381);
var choicesArray = choicesStr.split("|");
    _yuitest_coverline("build/intl-format/intl-format.js", 382);
for (var i=0; i<choicesArray.length; i++) {
        _yuitest_coverline("build/intl-format/intl-format.js", 383);
var choice = choicesArray[i];
        _yuitest_coverline("build/intl-format/intl-format.js", 384);
var relations = ['#', '<', '\u2264'];
        _yuitest_coverline("build/intl-format/intl-format.js", 385);
for (var j=0; j<relations.length; j++) {
            _yuitest_coverline("build/intl-format/intl-format.js", 386);
var rel = relations[j];
            _yuitest_coverline("build/intl-format/intl-format.js", 387);
if(choice.indexOf(rel) != -1) {
                _yuitest_coverline("build/intl-format/intl-format.js", 388);
var mapping = choice.split(rel);
                _yuitest_coverline("build/intl-format/intl-format.js", 389);
var ch = {
                    value: mapping[0],
                    result: mapping[1],
                    relation: rel
                };
                _yuitest_coverline("build/intl-format/intl-format.js", 394);
options.push(ch);
                _yuitest_coverline("build/intl-format/intl-format.js", 395);
break;
            }
        }
    }

    _yuitest_coverline("build/intl-format/intl-format.js", 400);
return options;
}

_yuitest_coverline("build/intl-format/intl-format.js", 403);
ChoiceFormatter.prototype.getParams = function(params, matches) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "getParams", 403);
_yuitest_coverline("build/intl-format/intl-format.js", 404);
if(SelectFormatter.prototype.getParams.call(this, params, matches)) {
        _yuitest_coverline("build/intl-format/intl-format.js", 405);
if(matches[2]) {
            _yuitest_coverline("build/intl-format/intl-format.js", 406);
params.choices = this.parseOptions(matches[2]);
            _yuitest_coverline("build/intl-format/intl-format.js", 407);
return params.choices === [] ? false: true;
        }
    }

    _yuitest_coverline("build/intl-format/intl-format.js", 411);
return false;
}

_yuitest_coverline("build/intl-format/intl-format.js", 414);
ChoiceFormatter.prototype.select = function(params) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "select", 414);
_yuitest_coverline("build/intl-format/intl-format.js", 415);
for ( var i=0; i<params.choices.length; i++) {
        _yuitest_coverline("build/intl-format/intl-format.js", 416);
var choice = params.choices[i];
        _yuitest_coverline("build/intl-format/intl-format.js", 417);
var value = choice.value, result = choice.result, relation = choice.relation;
        _yuitest_coverline("build/intl-format/intl-format.js", 418);
if( (relation == '#' && value == params.value) || (relation == '<' && value < params.value) || (relation == '\u2264' && value <= params.value)) {
        _yuitest_coverline("build/intl-format/intl-format.js", 419);
return result;
        }
    }

    _yuitest_coverline("build/intl-format/intl-format.js", 423);
return "";
}

_yuitest_coverline("build/intl-format/intl-format.js", 426);
ChoiceFormatter.prototype.format = function(str) {
    _yuitest_coverfunc("build/intl-format/intl-format.js", "format", 426);
_yuitest_coverline("build/intl-format/intl-format.js", 427);
var regex = new RegExp(this.regex, "gm");
    _yuitest_coverline("build/intl-format/intl-format.js", 428);
var matches = null;
    _yuitest_coverline("build/intl-format/intl-format.js", 429);
while((matches = regex.exec(str))) {
        _yuitest_coverline("build/intl-format/intl-format.js", 430);
var params = {};

        _yuitest_coverline("build/intl-format/intl-format.js", 432);
if(this.getParams(params, matches)) {
            _yuitest_coverline("build/intl-format/intl-format.js", 433);
var result = this.select(params);
            _yuitest_coverline("build/intl-format/intl-format.js", 434);
if(result) {
                _yuitest_coverline("build/intl-format/intl-format.js", 435);
str = str.replace(matches[0], result);
            }
        }
    }

    _yuitest_coverline("build/intl-format/intl-format.js", 440);
return str;
}
/**
 * Formatter classes. For each group found in the pattern, will try to parse with all of these formatters.
 * If a formatter fails to parse, the next one in the list try to do so.
 */
_yuitest_coverline("build/intl-format/intl-format.js", 446);
var formatters = [ StringFormatter, DateFormatter, TimeFormatter, NumberFormatter, ChoiceFormatter, PluralFormatter, SelectFormatter ];

_yuitest_coverline("build/intl-format/intl-format.js", 448);
Y.mix(Y.Intl, {
    formatMessage: function(pattern, values, config) {
        _yuitest_coverfunc("build/intl-format/intl-format.js", "formatMessage", 449);
_yuitest_coverline("build/intl-format/intl-format.js", 450);
config = config || {};
        _yuitest_coverline("build/intl-format/intl-format.js", 451);
for(var i=0; i<formatters.length; i++) {
            _yuitest_coverline("build/intl-format/intl-format.js", 452);
var formatter = formatters[i].createInstance(values);
            _yuitest_coverline("build/intl-format/intl-format.js", 453);
pattern = formatter.format(pattern, config);
        }
        _yuitest_coverline("build/intl-format/intl-format.js", 455);
return pattern;
    }
})


}, '@VERSION@', {"requires": ["datatype-date-advanced-format", "datatype-number-advanced-format", "intl"]});
