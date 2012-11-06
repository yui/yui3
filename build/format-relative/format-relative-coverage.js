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
_yuitest_coverage["build/format-relative/format-relative.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/format-relative/format-relative.js",
    code: []
};
_yuitest_coverage["build/format-relative/format-relative.js"].code=["YUI.add('format-relative', function (Y, NAME) {","","/**"," * Y.RelativeTimeFormat class provides localized formatting of relative time values such as \"3 minutes ago\"."," * Relative time formats supported are defined by how many units they may include."," * Relative time is only used for past events. The Relative time formats use appropriate singular/plural/paucal/etc. forms for all languages."," * In order to keep relative time formats independent of time zones, relative day names such as today, yesterday, or tomorrow are not used."," * @module format-relative"," */","","var MODULE_NAME = \"format-relative\";","/**"," * @class Y.RelativeTimeFormat"," * @constructor"," * @param {Number} style (Optional) Selector for the desired relative time format. If no argument is provided, default to ONE_UNIT_LONG. If argument is provided but is not a valid selector, an Error exception is thrown."," */","Y.RelativeTimeFormat = function(style) {","    if(style == null) {","        style = Y.RelativeTimeFormat.STYLES.ONE_UNIT_LONG;","    }","        ","    this.patterns = Y.Intl.get(MODULE_NAME);","    this.style = style;","		","    switch(style) {","        case Y.RelativeTimeFormat.STYLES.ONE_OR_TWO_UNITS_ABBREVIATED:","            this.numUnits = 2;","            this.abbr = true;","            break;","        case Y.RelativeTimeFormat.STYLES.ONE_OR_TWO_UNITS_LONG:","            this.numUnits = 2;","            this.abbr = false;","            break;","        case Y.RelativeTimeFormat.STYLES.ONE_UNIT_ABBREVIATED:","            this.numUnits = 1;","            this.abbr = true;","            break;","        case Y.RelativeTimeFormat.STYLES.ONE_UNIT_LONG:","            this.numUnits = 1;","            this.abbr = false;","            break;","        default:","            throw new Y.RelativeTimeFormat.UnknownStyleException(\"Use a style from Y.RelativeTimeFormat.STYLES\");","    }","}","	","//Exception Handling","","Y.RelativeTimeFormat.UnknownStyleException = function(message) {","    this.message = message;","}","Y.RelativeTimeFormat.UnknownStyleException.prototype.toString = function() {","    return \"UnknownStyleException: \" + this.message;","}","	","Y.RelativeTimeFormat.InvalidArgumentsException = function(message) {","    this.message = message;","}","Y.RelativeTimeFormat.InvalidArgumentsException.prototype.toString = function() {","    return \"InvalidArgumentsException: \" + this.message;","}","","//Static data","	","Y.RelativeTimeFormat.STYLES = {","    ONE_OR_TWO_UNITS_ABBREVIATED: 0,","    ONE_OR_TWO_UNITS_LONG: 1,","    ONE_UNIT_ABBREVIATED: 2,","    ONE_UNIT_LONG: 4","}","	","//Public methods","	","/**"," * Formats a time value."," * One or two parameters are needed. If only one parameter is specified, this function formats the parameter relative to current time."," * If two parameters are specified, this function formats the first parameter relative to the second parameter."," * @param {Number} timeValue The time value (seconds since Epoch) to be formatted."," * @param {Number} relativeTo (Optional) The time value (seconds since Epoch) in relation to which timeValue should be formatted. It must be greater than or equal to timeValue, otherwise exception will be thrown."," * @return {String} The formatted string"," */","Y.RelativeTimeFormat.prototype.format = function(timeValue, relativeTo) {","    if(relativeTo == null) { ","        relativeTo = (new Date()).getTime()/1000; ","        if(timeValue > relativeTo) {","            throw new Y.RelativeTimeFormat.InvalidArgumentsException(\"timeValue must be in the past\");","        }","    } else if(timeValue > relativeTo) {","        throw new Y.RelativeTimeFormat.InvalidArgumentsException(\"relativeTo must be greater than or equal to timeValue\");","    }","","    var date = new Date((relativeTo - timeValue)*1000);","","    var result = [];","    var numUnits = this.numUnits;","        ","    var value = date.getUTCFullYear() - 1970;	//Need zero-based index","    var text;","        ","    if(value > 0) {","        if(this.abbr) {","            text = value + \" \" + (value != 1 ? this.patterns.years_abbr : this.patterns.year_abbr); ","            result.push(text);","        } else {","            text = value + \" \" + (value != 1 ? this.patterns.years : this.patterns.year); ","            result.push(text);","        }","        numUnits--;","    }","","    value = date.getUTCMonth();","    if((numUnits > 0) && (numUnits < this.numUnits || value > 0)) {","        if(this.abbr) {","            text = value + \" \" + (value != 1 ? this.patterns.months_abbr : this.patterns.month_abbr); ","            result.push(text);","        } else {","            text = value + \" \" + (value != 1 ? this.patterns.months : this.patterns.month); ","            result.push(text);","        }","        numUnits--;","    }","","    value = date.getUTCDate()-1;			//Need zero-based index","    if(numUnits > 0 && (numUnits < this.numUnits || value > 0)) {","        if(this.abbr) {","            text = value + \" \" + (value != 1 ? this.patterns.days_abbr : this.patterns.day_abbr); ","            result.push(text);","        } else {","            text = value + \" \" + (value != 1 ? this.patterns.days : this.patterns.day); ","            result.push(text);","        }","        numUnits--;","    }","","    value = date.getUTCHours();","    if(numUnits > 0 && (numUnits < this.numUnits || value > 0)) {","        if(this.abbr) {","            text = value + \" \" + (value != 1 ? this.patterns.hours_abbr : this.patterns.hour_abbr); ","            result.push(text);","        } else {","            text = value + \" \" + (value != 1 ? this.patterns.hours : this.patterns.hour); ","            result.push(text);","        }","        numUnits--;","    }","","    value = date.getUTCMinutes();","    if(numUnits > 0 && (numUnits < this.numUnits || value > 0)) {","        if(this.abbr) {","            text = value + \" \" + (value != 1 ? this.patterns.minutes_abbr : this.patterns.minute_abbr); ","            result.push(text);","        } else {","            text = value + \" \" + (value != 1 ? this.patterns.minutes : this.patterns.minute); ","            result.push(text);","        }","        numUnits--;","    }","","    value = date.getUTCSeconds();","    if(result.length == 0 || (numUnits > 0 && (numUnits < this.numUnits || value > 0))) {","        if(this.abbr) {","            text = value + \" \" + (value != 1 ? this.patterns.seconds_abbr : this.patterns.second_abbr); ","            result.push(text);","        } else {","            text = value + \" \" + (value != 1 ? this.patterns.seconds : this.patterns.second); ","            result.push(text);","        }","        numUnits--;","    }","","    var pattern = (result.length == 1) ? this.patterns[\"RelativeTime/oneUnit\"] : this.patterns[\"RelativeTime/twoUnits\"];","        ","    for(var i=0; i<result.length; i++) {","        pattern = pattern.replace(\"{\" + i + \"}\", result[i]);","    }","    for(i=result.length; i<this.numUnits; i++) {","        pattern = pattern.replace(\"{\" + i + \"}\", \"\");","    }","    //Remove unnecessary whitespaces","    pattern = pattern.replace(/\\s+/g, \" \").replace(/^\\s+/, \"\").replace(/\\s+$/, \"\");","        ","    return pattern;","}","","","}, '@VERSION@', {","    \"lang\": [","        \"af-NA\",","        \"af\",","        \"af-ZA\",","        \"am-ET\",","        \"am\",","        \"ar-AE\",","        \"ar-BH\",","        \"ar-DZ\",","        \"ar-EG\",","        \"ar-IQ\",","        \"ar-JO\",","        \"ar-KW\",","        \"ar-LB\",","        \"ar-LY\",","        \"ar-MA\",","        \"ar-OM\",","        \"ar-QA\",","        \"ar-SA\",","        \"ar-SD\",","        \"ar-SY\",","        \"ar-TN\",","        \"ar\",","        \"ar-YE\",","        \"as-IN\",","        \"as\",","        \"az-AZ\",","        \"az-Cyrl-AZ\",","        \"az-Cyrl\",","        \"az-Latn-AZ\",","        \"az-Latn\",","        \"az\",","        \"be-BY\",","        \"be\",","        \"bg-BG\",","        \"bg\",","        \"bn-BD\",","        \"bn-IN\",","        \"bn\",","        \"bo-CN\",","        \"bo-IN\",","        \"bo\",","        \"ca-ES\",","        \"ca\",","        \"cs-CZ\",","        \"cs\",","        \"cy-GB\",","        \"cy\",","        \"da-DK\",","        \"da\",","        \"de-AT\",","        \"de-BE\",","        \"de-CH\",","        \"de-DE\",","        \"de-LI\",","        \"de-LU\",","        \"de\",","        \"el-CY\",","        \"el-GR\",","        \"el\",","        \"en-AU\",","        \"en-BE\",","        \"en-BW\",","        \"en-BZ\",","        \"en-CA\",","        \"en-GB\",","        \"en-HK\",","        \"en-IE\",","        \"en-IN\",","        \"en-JM\",","        \"en-JO\",","        \"en-MH\",","        \"en-MT\",","        \"en-MY\",","        \"en-NA\",","        \"en-NZ\",","        \"en-PH\",","        \"en-PK\",","        \"en-RH\",","        \"en-SG\",","        \"en-TT\",","        \"en\",","        \"en-US-POSIX\",","        \"en-US\",","        \"en-VI\",","        \"en-ZA\",","        \"en-ZW\",","        \"eo\",","        \"es-AR\",","        \"es-BO\",","        \"es-CL\",","        \"es-CO\",","        \"es-CR\",","        \"es-DO\",","        \"es-EC\",","        \"es-ES\",","        \"es-GT\",","        \"es-HN\",","        \"es-MX\",","        \"es-NI\",","        \"es-PA\",","        \"es-PE\",","        \"es-PR\",","        \"es-PY\",","        \"es-SV\",","        \"es\",","        \"es-US\",","        \"es-UY\",","        \"es-VE\",","        \"et-EE\",","        \"et\",","        \"eu-ES\",","        \"eu\",","        \"fa-AF\",","        \"fa-IR\",","        \"fa\",","        \"fi-FI\",","        \"fi\",","        \"fil-PH\",","        \"fil\",","        \"fo-FO\",","        \"fo\",","        \"fr-BE\",","        \"fr-CA\",","        \"fr-CH\",","        \"fr-FR\",","        \"fr-LU\",","        \"fr-MC\",","        \"fr-SN\",","        \"fr\",","        \"ga-IE\",","        \"ga\",","        \"gl-ES\",","        \"gl\",","        \"gsw-CH\",","        \"gsw\",","        \"gu-IN\",","        \"gu\",","        \"gv-GB\",","        \"gv\",","        \"ha-GH\",","        \"ha-Latn-GH\",","        \"ha-Latn-NE\",","        \"ha-Latn-NG\",","        \"ha-Latn\",","        \"ha-NE\",","        \"ha-NG\",","        \"ha\",","        \"haw\",","        \"haw-US\",","        \"he-IL\",","        \"he\",","        \"hi-IN\",","        \"hi\",","        \"hr-HR\",","        \"hr\",","        \"hu-HU\",","        \"hu\",","        \"hy-AM-REVISED\",","        \"hy-AM\",","        \"hy\",","        \"id-ID\",","        \"id\",","        \"ii-CN\",","        \"ii\",","        \"in-ID\",","        \"in\",","        \"is-IS\",","        \"is\",","        \"it-CH\",","        \"it-IT\",","        \"it\",","        \"iw-IL\",","        \"iw\",","        \"ja-JP-TRADITIONAL\",","        \"ja-JP\",","        \"ja\",","        \"ka-GE\",","        \"ka\",","        \"kk-Cyrl-KZ\",","        \"kk-Cyrl\",","        \"kk-KZ\",","        \"kk\",","        \"kl-GL\",","        \"kl\",","        \"km-KH\",","        \"km\",","        \"kn-IN\",","        \"kn\",","        \"kok-IN\",","        \"kok\",","        \"ko-KR\",","        \"ko\",","        \"kw-GB\",","        \"kw\",","        \"lt-LT\",","        \"lt\",","        \"lv-LV\",","        \"lv\",","        \"mk-MK\",","        \"mk\",","        \"ml-IN\",","        \"ml\",","        \"mr-IN\",","        \"mr\",","        \"ms-BN\",","        \"ms-MY\",","        \"ms\",","        \"mt-MT\",","        \"mt\",","        \"nb-NO\",","        \"nb\",","        \"ne-IN\",","        \"ne-NP\",","        \"ne\",","        \"nl-BE\",","        \"nl-NL\",","        \"nl\",","        \"nn-NO\",","        \"nn\",","        \"no-NO-NY\",","        \"no-NO\",","        \"no\",","        \"om-ET\",","        \"om-KE\",","        \"om\",","        \"or-IN\",","        \"or\",","        \"pa-Arab-PK\",","        \"pa-Arab\",","        \"pa-Guru-IN\",","        \"pa-Guru\",","        \"pa-IN\",","        \"pa-PK\",","        \"pa\",","        \"pl-PL\",","        \"pl\",","        \"ps-AF\",","        \"ps\",","        \"pt-BR\",","        \"pt-PT\",","        \"pt\",","        \"ro-MD\",","        \"ro-RO\",","        \"ro\",","        \"ru-RU\",","        \"ru\",","        \"ru-UA\",","        \"sh-BA\",","        \"sh-CS\",","        \"sh\",","        \"sh-YU\",","        \"si-LK\",","        \"si\",","        \"sk-SK\",","        \"sk\",","        \"sl-SI\",","        \"sl\",","        \"so-DJ\",","        \"so-ET\",","        \"so-KE\",","        \"so-SO\",","        \"so\",","        \"sq-AL\",","        \"sq\",","        \"sr-BA\",","        \"sr-CS\",","        \"sr-Cyrl-BA\",","        \"sr-Cyrl-CS\",","        \"sr-Cyrl-ME\",","        \"sr-Cyrl-RS\",","        \"sr-Cyrl\",","        \"sr-Cyrl-YU\",","        \"sr-Latn-BA\",","        \"sr-Latn-CS\",","        \"sr-Latn-ME\",","        \"sr-Latn-RS\",","        \"sr-Latn\",","        \"sr-Latn-YU\",","        \"sr-ME\",","        \"sr-RS\",","        \"sr\",","        \"sr-YU\",","        \"sv-FI\",","        \"sv-SE\",","        \"sv\",","        \"sw-KE\",","        \"sw\",","        \"sw-TZ\",","        \"ta-IN\",","        \"ta\",","        \"te-IN\",","        \"te\",","        \"th-TH-TRADITIONAL\",","        \"th-TH\",","        \"th\",","        \"ti-ER\",","        \"ti-ET\",","        \"ti\",","        \"tl-PH\",","        \"tl\",","        \"tr-TR\",","        \"tr\",","        \"uk\",","        \"uk-UA\",","        \"ur-IN\",","        \"ur-PK\",","        \"ur\",","        \"uz-AF\",","        \"uz-Arab-AF\",","        \"uz-Arab\",","        \"uz-Cyrl\",","        \"uz-Cyrl-UZ\",","        \"uz-Latn\",","        \"uz-Latn-UZ\",","        \"uz\",","        \"uz-UZ\",","        \"vi\",","        \"vi-VN\",","        \"zh-CN\",","        \"zh-Hans-CN\",","        \"zh-Hans-HK\",","        \"zh-Hans-MO\",","        \"zh-Hans-SG\",","        \"zh-Hans\",","        \"zh-Hant-HK\",","        \"zh-Hant-MO\",","        \"zh-Hant-TW\",","        \"zh-Hant\",","        \"zh-HK\",","        \"zh-MO\",","        \"zh-SG\",","        \"zh-TW\",","        \"zh\",","        \"zu\",","        \"zu-ZA\"","    ]","});"];
_yuitest_coverage["build/format-relative/format-relative.js"].lines = {"1":0,"11":0,"17":0,"18":0,"19":0,"22":0,"23":0,"25":0,"27":0,"28":0,"29":0,"31":0,"32":0,"33":0,"35":0,"36":0,"37":0,"39":0,"40":0,"41":0,"43":0,"49":0,"50":0,"52":0,"53":0,"56":0,"57":0,"59":0,"60":0,"65":0,"82":0,"83":0,"84":0,"85":0,"86":0,"88":0,"89":0,"92":0,"94":0,"95":0,"97":0,"98":0,"100":0,"101":0,"102":0,"103":0,"105":0,"106":0,"108":0,"111":0,"112":0,"113":0,"114":0,"115":0,"117":0,"118":0,"120":0,"123":0,"124":0,"125":0,"126":0,"127":0,"129":0,"130":0,"132":0,"135":0,"136":0,"137":0,"138":0,"139":0,"141":0,"142":0,"144":0,"147":0,"148":0,"149":0,"150":0,"151":0,"153":0,"154":0,"156":0,"159":0,"160":0,"161":0,"162":0,"163":0,"165":0,"166":0,"168":0,"171":0,"173":0,"174":0,"176":0,"177":0,"180":0,"182":0};
_yuitest_coverage["build/format-relative/format-relative.js"].functions = {"RelativeTimeFormat:17":0,"UnknownStyleException:49":0,"toString:52":0,"InvalidArgumentsException:56":0,"toString:59":0,"format:82":0,"(anonymous 1):1":0};
_yuitest_coverage["build/format-relative/format-relative.js"].coveredLines = 96;
_yuitest_coverage["build/format-relative/format-relative.js"].coveredFunctions = 7;
_yuitest_coverline("build/format-relative/format-relative.js", 1);
YUI.add('format-relative', function (Y, NAME) {

/**
 * Y.RelativeTimeFormat class provides localized formatting of relative time values such as "3 minutes ago".
 * Relative time formats supported are defined by how many units they may include.
 * Relative time is only used for past events. The Relative time formats use appropriate singular/plural/paucal/etc. forms for all languages.
 * In order to keep relative time formats independent of time zones, relative day names such as today, yesterday, or tomorrow are not used.
 * @module format-relative
 */

_yuitest_coverfunc("build/format-relative/format-relative.js", "(anonymous 1)", 1);
_yuitest_coverline("build/format-relative/format-relative.js", 11);
var MODULE_NAME = "format-relative";
/**
 * @class Y.RelativeTimeFormat
 * @constructor
 * @param {Number} style (Optional) Selector for the desired relative time format. If no argument is provided, default to ONE_UNIT_LONG. If argument is provided but is not a valid selector, an Error exception is thrown.
 */
_yuitest_coverline("build/format-relative/format-relative.js", 17);
Y.RelativeTimeFormat = function(style) {
    _yuitest_coverfunc("build/format-relative/format-relative.js", "RelativeTimeFormat", 17);
_yuitest_coverline("build/format-relative/format-relative.js", 18);
if(style == null) {
        _yuitest_coverline("build/format-relative/format-relative.js", 19);
style = Y.RelativeTimeFormat.STYLES.ONE_UNIT_LONG;
    }
        
    _yuitest_coverline("build/format-relative/format-relative.js", 22);
this.patterns = Y.Intl.get(MODULE_NAME);
    _yuitest_coverline("build/format-relative/format-relative.js", 23);
this.style = style;
		
    _yuitest_coverline("build/format-relative/format-relative.js", 25);
switch(style) {
        case Y.RelativeTimeFormat.STYLES.ONE_OR_TWO_UNITS_ABBREVIATED:
            _yuitest_coverline("build/format-relative/format-relative.js", 27);
this.numUnits = 2;
            _yuitest_coverline("build/format-relative/format-relative.js", 28);
this.abbr = true;
            _yuitest_coverline("build/format-relative/format-relative.js", 29);
break;
        case Y.RelativeTimeFormat.STYLES.ONE_OR_TWO_UNITS_LONG:
            _yuitest_coverline("build/format-relative/format-relative.js", 31);
this.numUnits = 2;
            _yuitest_coverline("build/format-relative/format-relative.js", 32);
this.abbr = false;
            _yuitest_coverline("build/format-relative/format-relative.js", 33);
break;
        case Y.RelativeTimeFormat.STYLES.ONE_UNIT_ABBREVIATED:
            _yuitest_coverline("build/format-relative/format-relative.js", 35);
this.numUnits = 1;
            _yuitest_coverline("build/format-relative/format-relative.js", 36);
this.abbr = true;
            _yuitest_coverline("build/format-relative/format-relative.js", 37);
break;
        case Y.RelativeTimeFormat.STYLES.ONE_UNIT_LONG:
            _yuitest_coverline("build/format-relative/format-relative.js", 39);
this.numUnits = 1;
            _yuitest_coverline("build/format-relative/format-relative.js", 40);
this.abbr = false;
            _yuitest_coverline("build/format-relative/format-relative.js", 41);
break;
        default:
            _yuitest_coverline("build/format-relative/format-relative.js", 43);
throw new Y.RelativeTimeFormat.UnknownStyleException("Use a style from Y.RelativeTimeFormat.STYLES");
    }
}
	
//Exception Handling

_yuitest_coverline("build/format-relative/format-relative.js", 49);
Y.RelativeTimeFormat.UnknownStyleException = function(message) {
    _yuitest_coverfunc("build/format-relative/format-relative.js", "UnknownStyleException", 49);
_yuitest_coverline("build/format-relative/format-relative.js", 50);
this.message = message;
}
_yuitest_coverline("build/format-relative/format-relative.js", 52);
Y.RelativeTimeFormat.UnknownStyleException.prototype.toString = function() {
    _yuitest_coverfunc("build/format-relative/format-relative.js", "toString", 52);
_yuitest_coverline("build/format-relative/format-relative.js", 53);
return "UnknownStyleException: " + this.message;
}
	
_yuitest_coverline("build/format-relative/format-relative.js", 56);
Y.RelativeTimeFormat.InvalidArgumentsException = function(message) {
    _yuitest_coverfunc("build/format-relative/format-relative.js", "InvalidArgumentsException", 56);
_yuitest_coverline("build/format-relative/format-relative.js", 57);
this.message = message;
}
_yuitest_coverline("build/format-relative/format-relative.js", 59);
Y.RelativeTimeFormat.InvalidArgumentsException.prototype.toString = function() {
    _yuitest_coverfunc("build/format-relative/format-relative.js", "toString", 59);
_yuitest_coverline("build/format-relative/format-relative.js", 60);
return "InvalidArgumentsException: " + this.message;
}

//Static data
	
_yuitest_coverline("build/format-relative/format-relative.js", 65);
Y.RelativeTimeFormat.STYLES = {
    ONE_OR_TWO_UNITS_ABBREVIATED: 0,
    ONE_OR_TWO_UNITS_LONG: 1,
    ONE_UNIT_ABBREVIATED: 2,
    ONE_UNIT_LONG: 4
}
	
//Public methods
	
/**
 * Formats a time value.
 * One or two parameters are needed. If only one parameter is specified, this function formats the parameter relative to current time.
 * If two parameters are specified, this function formats the first parameter relative to the second parameter.
 * @param {Number} timeValue The time value (seconds since Epoch) to be formatted.
 * @param {Number} relativeTo (Optional) The time value (seconds since Epoch) in relation to which timeValue should be formatted. It must be greater than or equal to timeValue, otherwise exception will be thrown.
 * @return {String} The formatted string
 */
_yuitest_coverline("build/format-relative/format-relative.js", 82);
Y.RelativeTimeFormat.prototype.format = function(timeValue, relativeTo) {
    _yuitest_coverfunc("build/format-relative/format-relative.js", "format", 82);
_yuitest_coverline("build/format-relative/format-relative.js", 83);
if(relativeTo == null) { 
        _yuitest_coverline("build/format-relative/format-relative.js", 84);
relativeTo = (new Date()).getTime()/1000; 
        _yuitest_coverline("build/format-relative/format-relative.js", 85);
if(timeValue > relativeTo) {
            _yuitest_coverline("build/format-relative/format-relative.js", 86);
throw new Y.RelativeTimeFormat.InvalidArgumentsException("timeValue must be in the past");
        }
    } else {_yuitest_coverline("build/format-relative/format-relative.js", 88);
if(timeValue > relativeTo) {
        _yuitest_coverline("build/format-relative/format-relative.js", 89);
throw new Y.RelativeTimeFormat.InvalidArgumentsException("relativeTo must be greater than or equal to timeValue");
    }}

    _yuitest_coverline("build/format-relative/format-relative.js", 92);
var date = new Date((relativeTo - timeValue)*1000);

    _yuitest_coverline("build/format-relative/format-relative.js", 94);
var result = [];
    _yuitest_coverline("build/format-relative/format-relative.js", 95);
var numUnits = this.numUnits;
        
    _yuitest_coverline("build/format-relative/format-relative.js", 97);
var value = date.getUTCFullYear() - 1970;	//Need zero-based index
    _yuitest_coverline("build/format-relative/format-relative.js", 98);
var text;
        
    _yuitest_coverline("build/format-relative/format-relative.js", 100);
if(value > 0) {
        _yuitest_coverline("build/format-relative/format-relative.js", 101);
if(this.abbr) {
            _yuitest_coverline("build/format-relative/format-relative.js", 102);
text = value + " " + (value != 1 ? this.patterns.years_abbr : this.patterns.year_abbr); 
            _yuitest_coverline("build/format-relative/format-relative.js", 103);
result.push(text);
        } else {
            _yuitest_coverline("build/format-relative/format-relative.js", 105);
text = value + " " + (value != 1 ? this.patterns.years : this.patterns.year); 
            _yuitest_coverline("build/format-relative/format-relative.js", 106);
result.push(text);
        }
        _yuitest_coverline("build/format-relative/format-relative.js", 108);
numUnits--;
    }

    _yuitest_coverline("build/format-relative/format-relative.js", 111);
value = date.getUTCMonth();
    _yuitest_coverline("build/format-relative/format-relative.js", 112);
if((numUnits > 0) && (numUnits < this.numUnits || value > 0)) {
        _yuitest_coverline("build/format-relative/format-relative.js", 113);
if(this.abbr) {
            _yuitest_coverline("build/format-relative/format-relative.js", 114);
text = value + " " + (value != 1 ? this.patterns.months_abbr : this.patterns.month_abbr); 
            _yuitest_coverline("build/format-relative/format-relative.js", 115);
result.push(text);
        } else {
            _yuitest_coverline("build/format-relative/format-relative.js", 117);
text = value + " " + (value != 1 ? this.patterns.months : this.patterns.month); 
            _yuitest_coverline("build/format-relative/format-relative.js", 118);
result.push(text);
        }
        _yuitest_coverline("build/format-relative/format-relative.js", 120);
numUnits--;
    }

    _yuitest_coverline("build/format-relative/format-relative.js", 123);
value = date.getUTCDate()-1;			//Need zero-based index
    _yuitest_coverline("build/format-relative/format-relative.js", 124);
if(numUnits > 0 && (numUnits < this.numUnits || value > 0)) {
        _yuitest_coverline("build/format-relative/format-relative.js", 125);
if(this.abbr) {
            _yuitest_coverline("build/format-relative/format-relative.js", 126);
text = value + " " + (value != 1 ? this.patterns.days_abbr : this.patterns.day_abbr); 
            _yuitest_coverline("build/format-relative/format-relative.js", 127);
result.push(text);
        } else {
            _yuitest_coverline("build/format-relative/format-relative.js", 129);
text = value + " " + (value != 1 ? this.patterns.days : this.patterns.day); 
            _yuitest_coverline("build/format-relative/format-relative.js", 130);
result.push(text);
        }
        _yuitest_coverline("build/format-relative/format-relative.js", 132);
numUnits--;
    }

    _yuitest_coverline("build/format-relative/format-relative.js", 135);
value = date.getUTCHours();
    _yuitest_coverline("build/format-relative/format-relative.js", 136);
if(numUnits > 0 && (numUnits < this.numUnits || value > 0)) {
        _yuitest_coverline("build/format-relative/format-relative.js", 137);
if(this.abbr) {
            _yuitest_coverline("build/format-relative/format-relative.js", 138);
text = value + " " + (value != 1 ? this.patterns.hours_abbr : this.patterns.hour_abbr); 
            _yuitest_coverline("build/format-relative/format-relative.js", 139);
result.push(text);
        } else {
            _yuitest_coverline("build/format-relative/format-relative.js", 141);
text = value + " " + (value != 1 ? this.patterns.hours : this.patterns.hour); 
            _yuitest_coverline("build/format-relative/format-relative.js", 142);
result.push(text);
        }
        _yuitest_coverline("build/format-relative/format-relative.js", 144);
numUnits--;
    }

    _yuitest_coverline("build/format-relative/format-relative.js", 147);
value = date.getUTCMinutes();
    _yuitest_coverline("build/format-relative/format-relative.js", 148);
if(numUnits > 0 && (numUnits < this.numUnits || value > 0)) {
        _yuitest_coverline("build/format-relative/format-relative.js", 149);
if(this.abbr) {
            _yuitest_coverline("build/format-relative/format-relative.js", 150);
text = value + " " + (value != 1 ? this.patterns.minutes_abbr : this.patterns.minute_abbr); 
            _yuitest_coverline("build/format-relative/format-relative.js", 151);
result.push(text);
        } else {
            _yuitest_coverline("build/format-relative/format-relative.js", 153);
text = value + " " + (value != 1 ? this.patterns.minutes : this.patterns.minute); 
            _yuitest_coverline("build/format-relative/format-relative.js", 154);
result.push(text);
        }
        _yuitest_coverline("build/format-relative/format-relative.js", 156);
numUnits--;
    }

    _yuitest_coverline("build/format-relative/format-relative.js", 159);
value = date.getUTCSeconds();
    _yuitest_coverline("build/format-relative/format-relative.js", 160);
if(result.length == 0 || (numUnits > 0 && (numUnits < this.numUnits || value > 0))) {
        _yuitest_coverline("build/format-relative/format-relative.js", 161);
if(this.abbr) {
            _yuitest_coverline("build/format-relative/format-relative.js", 162);
text = value + " " + (value != 1 ? this.patterns.seconds_abbr : this.patterns.second_abbr); 
            _yuitest_coverline("build/format-relative/format-relative.js", 163);
result.push(text);
        } else {
            _yuitest_coverline("build/format-relative/format-relative.js", 165);
text = value + " " + (value != 1 ? this.patterns.seconds : this.patterns.second); 
            _yuitest_coverline("build/format-relative/format-relative.js", 166);
result.push(text);
        }
        _yuitest_coverline("build/format-relative/format-relative.js", 168);
numUnits--;
    }

    _yuitest_coverline("build/format-relative/format-relative.js", 171);
var pattern = (result.length == 1) ? this.patterns["RelativeTime/oneUnit"] : this.patterns["RelativeTime/twoUnits"];
        
    _yuitest_coverline("build/format-relative/format-relative.js", 173);
for(var i=0; i<result.length; i++) {
        _yuitest_coverline("build/format-relative/format-relative.js", 174);
pattern = pattern.replace("{" + i + "}", result[i]);
    }
    _yuitest_coverline("build/format-relative/format-relative.js", 176);
for(i=result.length; i<this.numUnits; i++) {
        _yuitest_coverline("build/format-relative/format-relative.js", 177);
pattern = pattern.replace("{" + i + "}", "");
    }
    //Remove unnecessary whitespaces
    _yuitest_coverline("build/format-relative/format-relative.js", 180);
pattern = pattern.replace(/\s+/g, " ").replace(/^\s+/, "").replace(/\s+$/, "");
        
    _yuitest_coverline("build/format-relative/format-relative.js", 182);
return pattern;
}


}, '@VERSION@', {
    "lang": [
        "af-NA",
        "af",
        "af-ZA",
        "am-ET",
        "am",
        "ar-AE",
        "ar-BH",
        "ar-DZ",
        "ar-EG",
        "ar-IQ",
        "ar-JO",
        "ar-KW",
        "ar-LB",
        "ar-LY",
        "ar-MA",
        "ar-OM",
        "ar-QA",
        "ar-SA",
        "ar-SD",
        "ar-SY",
        "ar-TN",
        "ar",
        "ar-YE",
        "as-IN",
        "as",
        "az-AZ",
        "az-Cyrl-AZ",
        "az-Cyrl",
        "az-Latn-AZ",
        "az-Latn",
        "az",
        "be-BY",
        "be",
        "bg-BG",
        "bg",
        "bn-BD",
        "bn-IN",
        "bn",
        "bo-CN",
        "bo-IN",
        "bo",
        "ca-ES",
        "ca",
        "cs-CZ",
        "cs",
        "cy-GB",
        "cy",
        "da-DK",
        "da",
        "de-AT",
        "de-BE",
        "de-CH",
        "de-DE",
        "de-LI",
        "de-LU",
        "de",
        "el-CY",
        "el-GR",
        "el",
        "en-AU",
        "en-BE",
        "en-BW",
        "en-BZ",
        "en-CA",
        "en-GB",
        "en-HK",
        "en-IE",
        "en-IN",
        "en-JM",
        "en-JO",
        "en-MH",
        "en-MT",
        "en-MY",
        "en-NA",
        "en-NZ",
        "en-PH",
        "en-PK",
        "en-RH",
        "en-SG",
        "en-TT",
        "en",
        "en-US-POSIX",
        "en-US",
        "en-VI",
        "en-ZA",
        "en-ZW",
        "eo",
        "es-AR",
        "es-BO",
        "es-CL",
        "es-CO",
        "es-CR",
        "es-DO",
        "es-EC",
        "es-ES",
        "es-GT",
        "es-HN",
        "es-MX",
        "es-NI",
        "es-PA",
        "es-PE",
        "es-PR",
        "es-PY",
        "es-SV",
        "es",
        "es-US",
        "es-UY",
        "es-VE",
        "et-EE",
        "et",
        "eu-ES",
        "eu",
        "fa-AF",
        "fa-IR",
        "fa",
        "fi-FI",
        "fi",
        "fil-PH",
        "fil",
        "fo-FO",
        "fo",
        "fr-BE",
        "fr-CA",
        "fr-CH",
        "fr-FR",
        "fr-LU",
        "fr-MC",
        "fr-SN",
        "fr",
        "ga-IE",
        "ga",
        "gl-ES",
        "gl",
        "gsw-CH",
        "gsw",
        "gu-IN",
        "gu",
        "gv-GB",
        "gv",
        "ha-GH",
        "ha-Latn-GH",
        "ha-Latn-NE",
        "ha-Latn-NG",
        "ha-Latn",
        "ha-NE",
        "ha-NG",
        "ha",
        "haw",
        "haw-US",
        "he-IL",
        "he",
        "hi-IN",
        "hi",
        "hr-HR",
        "hr",
        "hu-HU",
        "hu",
        "hy-AM-REVISED",
        "hy-AM",
        "hy",
        "id-ID",
        "id",
        "ii-CN",
        "ii",
        "in-ID",
        "in",
        "is-IS",
        "is",
        "it-CH",
        "it-IT",
        "it",
        "iw-IL",
        "iw",
        "ja-JP-TRADITIONAL",
        "ja-JP",
        "ja",
        "ka-GE",
        "ka",
        "kk-Cyrl-KZ",
        "kk-Cyrl",
        "kk-KZ",
        "kk",
        "kl-GL",
        "kl",
        "km-KH",
        "km",
        "kn-IN",
        "kn",
        "kok-IN",
        "kok",
        "ko-KR",
        "ko",
        "kw-GB",
        "kw",
        "lt-LT",
        "lt",
        "lv-LV",
        "lv",
        "mk-MK",
        "mk",
        "ml-IN",
        "ml",
        "mr-IN",
        "mr",
        "ms-BN",
        "ms-MY",
        "ms",
        "mt-MT",
        "mt",
        "nb-NO",
        "nb",
        "ne-IN",
        "ne-NP",
        "ne",
        "nl-BE",
        "nl-NL",
        "nl",
        "nn-NO",
        "nn",
        "no-NO-NY",
        "no-NO",
        "no",
        "om-ET",
        "om-KE",
        "om",
        "or-IN",
        "or",
        "pa-Arab-PK",
        "pa-Arab",
        "pa-Guru-IN",
        "pa-Guru",
        "pa-IN",
        "pa-PK",
        "pa",
        "pl-PL",
        "pl",
        "ps-AF",
        "ps",
        "pt-BR",
        "pt-PT",
        "pt",
        "ro-MD",
        "ro-RO",
        "ro",
        "ru-RU",
        "ru",
        "ru-UA",
        "sh-BA",
        "sh-CS",
        "sh",
        "sh-YU",
        "si-LK",
        "si",
        "sk-SK",
        "sk",
        "sl-SI",
        "sl",
        "so-DJ",
        "so-ET",
        "so-KE",
        "so-SO",
        "so",
        "sq-AL",
        "sq",
        "sr-BA",
        "sr-CS",
        "sr-Cyrl-BA",
        "sr-Cyrl-CS",
        "sr-Cyrl-ME",
        "sr-Cyrl-RS",
        "sr-Cyrl",
        "sr-Cyrl-YU",
        "sr-Latn-BA",
        "sr-Latn-CS",
        "sr-Latn-ME",
        "sr-Latn-RS",
        "sr-Latn",
        "sr-Latn-YU",
        "sr-ME",
        "sr-RS",
        "sr",
        "sr-YU",
        "sv-FI",
        "sv-SE",
        "sv",
        "sw-KE",
        "sw",
        "sw-TZ",
        "ta-IN",
        "ta",
        "te-IN",
        "te",
        "th-TH-TRADITIONAL",
        "th-TH",
        "th",
        "ti-ER",
        "ti-ET",
        "ti",
        "tl-PH",
        "tl",
        "tr-TR",
        "tr",
        "uk",
        "uk-UA",
        "ur-IN",
        "ur-PK",
        "ur",
        "uz-AF",
        "uz-Arab-AF",
        "uz-Arab",
        "uz-Cyrl",
        "uz-Cyrl-UZ",
        "uz-Latn",
        "uz-Latn-UZ",
        "uz",
        "uz-UZ",
        "vi",
        "vi-VN",
        "zh-CN",
        "zh-Hans-CN",
        "zh-Hans-HK",
        "zh-Hans-MO",
        "zh-Hans-SG",
        "zh-Hans",
        "zh-Hant-HK",
        "zh-Hant-MO",
        "zh-Hant-TW",
        "zh-Hant",
        "zh-HK",
        "zh-MO",
        "zh-SG",
        "zh-TW",
        "zh",
        "zu",
        "zu-ZA"
    ]
});
