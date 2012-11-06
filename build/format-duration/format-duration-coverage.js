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
_yuitest_coverage["build/format-duration/format-duration.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/format-duration/format-duration.js",
    code: []
};
_yuitest_coverage["build/format-duration/format-duration.js"].code=["YUI.add('format-duration', function (Y, NAME) {","","/**"," * Y.DurationFormat class formats time in a language independent manner."," * The duration formats use appropriate singular/plural/paucal/etc. forms for all languages. "," * @module format-duration"," * @requires format-numbers"," */","","var MODULE_NAME = \"format-duration\";","/**"," * Y.DurationFormat class formats time in a language independent manner."," * @class Y.DurationFormat"," * @constructor"," * @param {Number} style selector for the desired duration format, from Y.DurationFormat.STYLES"," */","Y.DurationFormat = function(style) {","    this.style = style;","    this.patterns = Y.Intl.get(MODULE_NAME);","    this._numberFormat = new Y.NumberFormat(Y.NumberFormat.STYLES.NUMBER_STYLE);","}","    ","//Static Data","Y.DurationFormat.STYLES = {","    HMS_LONG: 0,","    HMS_SHORT: 1","}","    ","//Support methods","    ","/**"," * Strip decimal part of argument and return the integer part"," * @param floatNum A real number"," * @return Integer part of floatNum"," */","function stripDecimals(floatNum) {","    return floatNum > 0 ? Math.floor(floatNum): Math.ceil(floatNum);","}","    ","function zeroPad (s, length, zeroChar, rightSide) {","    s = typeof s == \"string\" ? s : String(s);","","    if (s.length >= length) return s;","","    zeroChar = zeroChar || '0';","	","    var a = [];","    for (var i = s.length; i < length; i++) {","        a.push(zeroChar);","    }","    a[rightSide ? \"unshift\" : \"push\"](s);","","    return a.join(\"\");","}","    ","if(String.prototype.trim == null) {","    String.prototype.trim = function() {","        return this.replace(/^\\s\\s*/, '').replace(/\\s\\s*$/, '');","    };","}","    ","/**"," * Parse XMLDurationFormat (PnYnMnDTnHnMnS) and return an object with hours, minutes and seconds"," * Any absent values are set to -1, which will be ignored in HMS_long, and set to 0 in HMS_short"," * Year, Month and Day are ignored. Only Hours, Minutes and Seconds are used"," * @param {String} xmlDuration XML Duration String. "," *      The lexical representation for duration is the [ISO 8601] extended format PnYnMnDTnHnMnS, "," *      where nY represents the number of years, nM the number of months, nD the number of days, "," *      'T' is the date/time separator,"," *      nH the number of hours, nM the number of minutes and nS the number of seconds."," *      The number of seconds can include decimal digits to arbitrary precision."," * @return {Object} Duration as an object with the parameters hours, minutes and seconds."," */","function getDuration_XML(xmlDuration) {","    var regex = new RegExp(/P(\\d+Y)?(\\d+M)?(\\d+D)?T(\\d+H)?(\\d+M)?(\\d+(\\.\\d+)?S)/);","    var matches = xmlDuration.match(regex);","        ","    if(matches == null) {","        throw new Y.Format.IllegalArgumentsException(\"xmlDurationFormat should be in the format: 'PnYnMnDTnHnMnS'\");","    }","        ","    return {","        hours: parseInt(matches[4] || -1),","        minutes: parseInt(matches[5] || -1),","        seconds: parseFloat(matches[6] || -1)","    };","}","    ","/**"," * Get duration from time in seconds."," * The value should be integer value in seconds, and should not be negative."," * @param {Number} timeValueInSeconds Duration in seconds"," * @return {Object} Duration as an object with the parameters hours, minutes and seconds."," */","function getDuration_Seconds(timeValueInSeconds) {","    var duration = {};","    if(timeValueInSeconds < 0) {","        throw new Y.Format.IllegalArgumentsException(\"TimeValue cannot be negative\");","    }","                ","    duration.hours = stripDecimals(timeValueInSeconds / 3600);","                ","    timeValueInSeconds %= 3600;","    duration.minutes = stripDecimals(timeValueInSeconds / 60);","                ","    timeValueInSeconds %= 60;","    duration.seconds = timeValueInSeconds;","        ","    return duration;","}","    ","//Public methods","    ","/**"," * Formats the given value into a duration format string. This function supports three kinds of usage, listed below:"," *  String format(int timeValueInSeconds):"," *      Formats the given value into a duration format string. The value should be integer value in seconds, and should not be negative."," *  String format(string xmlDurationFormat):"," *      Formats the given XML duration format into a duration format string. "," *      The year/month/day fields are ignored in the final format string in this version. For future compatibility, please do not pass in the Year/Month/Day part in the parameter."," *      For hour, minute, and second, absent parts are ignored in HMS_long format, but are treated as 0 in HMS_short format style."," *  String format(int hour, int min, int second)"," *      Formats the given duration into a duration format string. Negative values are ignored in HMS_long format, but treated as 0 in HMS_short format."," * @return {String} The formatted string"," */","Y.DurationFormat.prototype.format = function() {","    var duration = {};","    if(arguments.length == 1) {","        if(arguments[0] == null) {","            throw new Y.Format.IllegalArgumentsException(\"Argument is null\");","        }","        if(isNaN(arguments[0])) {                               //Non-numeric string. format(string xmlDurationFormat)","            duration = getDuration_XML(arguments[0].trim());","        } else {                                                //format(int timeValueInSeconds)","            duration = getDuration_Seconds(arguments[0]);","        }","    } else if(arguments.length == 3) {                          //format(int hour, int min, int second)","        if(arguments[2] == null || arguments[1] == null || arguments[0] == null) {","            throw new Y.Format.IllegalArgumentsException(\"One or more arguments are null/undefined\");","        }","        if(isNaN(arguments[2]) || isNaN(arguments[1]) || isNaN(arguments[0])) {              //Non-numeric string.","            throw new Y.Format.IllegalArgumentsException(\"One or more arguments are not numeric\");","        }","            ","        duration = {","            hours: parseInt(arguments[0]),","            minutes: parseInt(arguments[1]),","            seconds: parseInt(arguments[2])","        }","    } else {","        throw new Y.Format.IllegalArgumentsException(\"Unexpected number of arguments\");","    }","        ","    //Test minutes and seconds for invalid values","    if(duration.minutes > 59 || duration.seconds > 59) {","        throw new Y.Format.IllegalArgumentsException(\"Minutes and Seconds should be less than 60\");","    }","        ","    var result = \"\";","        ","    if(this.style == Y.DurationFormat.STYLES.HMS_LONG) {","        result = this.patterns.HMS_long;","        if(duration.hours < 0) {","            duration.hours = \"\";","        } else {","            duration.hours = this._numberFormat.format(duration.hours) + \" \" + (duration.hours == 1 ? this.patterns.hour : this.patterns.hours);","        }","            ","        if(duration.minutes < 0) {","            duration.minutes = \"\";","        } else {","            duration.minutes = duration.minutes + \" \" + (duration.minutes == 1 ? this.patterns.minute : this.patterns.minutes);","        }","            ","        if(duration.seconds < 0) {","            duration.seconds = \"\";","        } else {","            duration.seconds = duration.seconds + \" \" + (duration.seconds == 1 ? this.patterns.second : this.patterns.seconds);","        }","    } else {                                            //HMS_SHORT","        result = this.patterns.HMS_short;","            ","        duration.hours = this._numberFormat.format(duration.hours < 0 ? 0: duration.hours);","        duration.minutes = duration.minutes < 0 ? \"00\": zeroPad(duration.minutes, 2);","        duration.seconds = duration.seconds < 0 ? \"00\": zeroPad(duration.seconds, 2);","    }","        ","    result = result.replace(\"{0}\", duration.hours);","    result = result.replace(\"{1}\", duration.minutes);","    result = result.replace(\"{2}\", duration.seconds);","        ","    //Remove unnecessary whitespaces","    result = result.replace(/\\s\\s+/g, \" \").replace(/^\\s+/, \"\").replace(/\\s+$/, \"\");","        ","    return result;","}","","","}, '@VERSION@', {","    \"lang\": [","        \"af-NA\",","        \"af\",","        \"af-ZA\",","        \"am-ET\",","        \"am\",","        \"ar-AE\",","        \"ar-BH\",","        \"ar-DZ\",","        \"ar-EG\",","        \"ar-IQ\",","        \"ar-JO\",","        \"ar-KW\",","        \"ar-LB\",","        \"ar-LY\",","        \"ar-MA\",","        \"ar-OM\",","        \"ar-QA\",","        \"ar-SA\",","        \"ar-SD\",","        \"ar-SY\",","        \"ar-TN\",","        \"ar\",","        \"ar-YE\",","        \"as-IN\",","        \"as\",","        \"az-AZ\",","        \"az-Cyrl-AZ\",","        \"az-Cyrl\",","        \"az-Latn-AZ\",","        \"az-Latn\",","        \"az\",","        \"be-BY\",","        \"be\",","        \"bg-BG\",","        \"bg\",","        \"bn-BD\",","        \"bn-IN\",","        \"bn\",","        \"bo-CN\",","        \"bo-IN\",","        \"bo\",","        \"ca-ES\",","        \"ca\",","        \"cs-CZ\",","        \"cs\",","        \"cy-GB\",","        \"cy\",","        \"da-DK\",","        \"da\",","        \"de-AT\",","        \"de-BE\",","        \"de-CH\",","        \"de-DE\",","        \"de-LI\",","        \"de-LU\",","        \"de\",","        \"el-CY\",","        \"el-GR\",","        \"el\",","        \"en-AU\",","        \"en-BE\",","        \"en-BW\",","        \"en-BZ\",","        \"en-CA\",","        \"en-GB\",","        \"en-HK\",","        \"en-IE\",","        \"en-IN\",","        \"en-JM\",","        \"en-JO\",","        \"en-MH\",","        \"en-MT\",","        \"en-MY\",","        \"en-NA\",","        \"en-NZ\",","        \"en-PH\",","        \"en-PK\",","        \"en-RH\",","        \"en-SG\",","        \"en-TT\",","        \"en\",","        \"en-US-POSIX\",","        \"en-US\",","        \"en-VI\",","        \"en-ZA\",","        \"en-ZW\",","        \"eo\",","        \"es-AR\",","        \"es-BO\",","        \"es-CL\",","        \"es-CO\",","        \"es-CR\",","        \"es-DO\",","        \"es-EC\",","        \"es-ES\",","        \"es-GT\",","        \"es-HN\",","        \"es-MX\",","        \"es-NI\",","        \"es-PA\",","        \"es-PE\",","        \"es-PR\",","        \"es-PY\",","        \"es-SV\",","        \"es\",","        \"es-US\",","        \"es-UY\",","        \"es-VE\",","        \"et-EE\",","        \"et\",","        \"eu-ES\",","        \"eu\",","        \"fa-AF\",","        \"fa-IR\",","        \"fa\",","        \"fi-FI\",","        \"fi\",","        \"fil-PH\",","        \"fil\",","        \"fo-FO\",","        \"fo\",","        \"fr-BE\",","        \"fr-CA\",","        \"fr-CH\",","        \"fr-FR\",","        \"fr-LU\",","        \"fr-MC\",","        \"fr-SN\",","        \"fr\",","        \"ga-IE\",","        \"ga\",","        \"gl-ES\",","        \"gl\",","        \"gsw-CH\",","        \"gsw\",","        \"gu-IN\",","        \"gu\",","        \"gv-GB\",","        \"gv\",","        \"ha-GH\",","        \"ha-Latn-GH\",","        \"ha-Latn-NE\",","        \"ha-Latn-NG\",","        \"ha-Latn\",","        \"ha-NE\",","        \"ha-NG\",","        \"ha\",","        \"haw\",","        \"haw-US\",","        \"he-IL\",","        \"he\",","        \"hi-IN\",","        \"hi\",","        \"hr-HR\",","        \"hr\",","        \"hu-HU\",","        \"hu\",","        \"hy-AM-REVISED\",","        \"hy-AM\",","        \"hy\",","        \"id-ID\",","        \"id\",","        \"ii-CN\",","        \"ii\",","        \"in-ID\",","        \"in\",","        \"is-IS\",","        \"is\",","        \"it-CH\",","        \"it-IT\",","        \"it\",","        \"iw-IL\",","        \"iw\",","        \"ja-JP-TRADITIONAL\",","        \"ja-JP\",","        \"ja\",","        \"ka-GE\",","        \"ka\",","        \"kk-Cyrl-KZ\",","        \"kk-Cyrl\",","        \"kk-KZ\",","        \"kk\",","        \"kl-GL\",","        \"kl\",","        \"km-KH\",","        \"km\",","        \"kn-IN\",","        \"kn\",","        \"kok-IN\",","        \"kok\",","        \"ko-KR\",","        \"ko\",","        \"kw-GB\",","        \"kw\",","        \"lt-LT\",","        \"lt\",","        \"lv-LV\",","        \"lv\",","        \"mk-MK\",","        \"mk\",","        \"ml-IN\",","        \"ml\",","        \"mr-IN\",","        \"mr\",","        \"ms-BN\",","        \"ms-MY\",","        \"ms\",","        \"mt-MT\",","        \"mt\",","        \"nb-NO\",","        \"nb\",","        \"ne-IN\",","        \"ne-NP\",","        \"ne\",","        \"nl-BE\",","        \"nl-NL\",","        \"nl\",","        \"nn-NO\",","        \"nn\",","        \"no-NO-NY\",","        \"no-NO\",","        \"no\",","        \"om-ET\",","        \"om-KE\",","        \"om\",","        \"or-IN\",","        \"or\",","        \"pa-Arab-PK\",","        \"pa-Arab\",","        \"pa-Guru-IN\",","        \"pa-Guru\",","        \"pa-IN\",","        \"pa-PK\",","        \"pa\",","        \"pl-PL\",","        \"pl\",","        \"ps-AF\",","        \"ps\",","        \"pt-BR\",","        \"pt-PT\",","        \"pt\",","        \"ro-MD\",","        \"ro-RO\",","        \"ro\",","        \"ru-RU\",","        \"ru\",","        \"ru-UA\",","        \"sh-BA\",","        \"sh-CS\",","        \"sh\",","        \"sh-YU\",","        \"si-LK\",","        \"si\",","        \"sk-SK\",","        \"sk\",","        \"sl-SI\",","        \"sl\",","        \"so-DJ\",","        \"so-ET\",","        \"so-KE\",","        \"so-SO\",","        \"so\",","        \"sq-AL\",","        \"sq\",","        \"sr-BA\",","        \"sr-CS\",","        \"sr-Cyrl-BA\",","        \"sr-Cyrl-CS\",","        \"sr-Cyrl-ME\",","        \"sr-Cyrl-RS\",","        \"sr-Cyrl\",","        \"sr-Cyrl-YU\",","        \"sr-Latn-BA\",","        \"sr-Latn-CS\",","        \"sr-Latn-ME\",","        \"sr-Latn-RS\",","        \"sr-Latn\",","        \"sr-Latn-YU\",","        \"sr-ME\",","        \"sr-RS\",","        \"sr\",","        \"sr-YU\",","        \"sv-FI\",","        \"sv-SE\",","        \"sv\",","        \"sw-KE\",","        \"sw\",","        \"sw-TZ\",","        \"ta-IN\",","        \"ta\",","        \"te-IN\",","        \"te\",","        \"th-TH-TRADITIONAL\",","        \"th-TH\",","        \"th\",","        \"ti-ER\",","        \"ti-ET\",","        \"ti\",","        \"tl-PH\",","        \"tl\",","        \"tr-TR\",","        \"tr\",","        \"uk\",","        \"uk-UA\",","        \"ur-IN\",","        \"ur-PK\",","        \"ur\",","        \"uz-AF\",","        \"uz-Arab-AF\",","        \"uz-Arab\",","        \"uz-Cyrl\",","        \"uz-Cyrl-UZ\",","        \"uz-Latn\",","        \"uz-Latn-UZ\",","        \"uz\",","        \"uz-UZ\",","        \"vi\",","        \"vi-VN\",","        \"zh-CN\",","        \"zh-Hans-CN\",","        \"zh-Hans-HK\",","        \"zh-Hans-MO\",","        \"zh-Hans-SG\",","        \"zh-Hans\",","        \"zh-Hant-HK\",","        \"zh-Hant-MO\",","        \"zh-Hant-TW\",","        \"zh-Hant\",","        \"zh-HK\",","        \"zh-MO\",","        \"zh-SG\",","        \"zh-TW\",","        \"zh\",","        \"zu\",","        \"zu-ZA\"","    ],","    \"requires\": [","        \"format-numbers\"","    ]","});"];
_yuitest_coverage["build/format-duration/format-duration.js"].lines = {"1":0,"10":0,"17":0,"18":0,"19":0,"20":0,"24":0,"36":0,"37":0,"40":0,"41":0,"43":0,"45":0,"47":0,"48":0,"49":0,"51":0,"53":0,"56":0,"57":0,"58":0,"74":0,"75":0,"76":0,"78":0,"79":0,"82":0,"95":0,"96":0,"97":0,"98":0,"101":0,"103":0,"104":0,"106":0,"107":0,"109":0,"126":0,"127":0,"128":0,"129":0,"130":0,"132":0,"133":0,"135":0,"137":0,"138":0,"139":0,"141":0,"142":0,"145":0,"151":0,"155":0,"156":0,"159":0,"161":0,"162":0,"163":0,"164":0,"166":0,"169":0,"170":0,"172":0,"175":0,"176":0,"178":0,"181":0,"183":0,"184":0,"185":0,"188":0,"189":0,"190":0,"193":0,"195":0};
_yuitest_coverage["build/format-duration/format-duration.js"].functions = {"DurationFormat:17":0,"stripDecimals:36":0,"zeroPad:40":0,"trim:57":0,"getDuration_XML:74":0,"getDuration_Seconds:95":0,"format:126":0,"(anonymous 1):1":0};
_yuitest_coverage["build/format-duration/format-duration.js"].coveredLines = 75;
_yuitest_coverage["build/format-duration/format-duration.js"].coveredFunctions = 8;
_yuitest_coverline("build/format-duration/format-duration.js", 1);
YUI.add('format-duration', function (Y, NAME) {

/**
 * Y.DurationFormat class formats time in a language independent manner.
 * The duration formats use appropriate singular/plural/paucal/etc. forms for all languages. 
 * @module format-duration
 * @requires format-numbers
 */

_yuitest_coverfunc("build/format-duration/format-duration.js", "(anonymous 1)", 1);
_yuitest_coverline("build/format-duration/format-duration.js", 10);
var MODULE_NAME = "format-duration";
/**
 * Y.DurationFormat class formats time in a language independent manner.
 * @class Y.DurationFormat
 * @constructor
 * @param {Number} style selector for the desired duration format, from Y.DurationFormat.STYLES
 */
_yuitest_coverline("build/format-duration/format-duration.js", 17);
Y.DurationFormat = function(style) {
    _yuitest_coverfunc("build/format-duration/format-duration.js", "DurationFormat", 17);
_yuitest_coverline("build/format-duration/format-duration.js", 18);
this.style = style;
    _yuitest_coverline("build/format-duration/format-duration.js", 19);
this.patterns = Y.Intl.get(MODULE_NAME);
    _yuitest_coverline("build/format-duration/format-duration.js", 20);
this._numberFormat = new Y.NumberFormat(Y.NumberFormat.STYLES.NUMBER_STYLE);
}
    
//Static Data
_yuitest_coverline("build/format-duration/format-duration.js", 24);
Y.DurationFormat.STYLES = {
    HMS_LONG: 0,
    HMS_SHORT: 1
}
    
//Support methods
    
/**
 * Strip decimal part of argument and return the integer part
 * @param floatNum A real number
 * @return Integer part of floatNum
 */
_yuitest_coverline("build/format-duration/format-duration.js", 36);
function stripDecimals(floatNum) {
    _yuitest_coverfunc("build/format-duration/format-duration.js", "stripDecimals", 36);
_yuitest_coverline("build/format-duration/format-duration.js", 37);
return floatNum > 0 ? Math.floor(floatNum): Math.ceil(floatNum);
}
    
_yuitest_coverline("build/format-duration/format-duration.js", 40);
function zeroPad (s, length, zeroChar, rightSide) {
    _yuitest_coverfunc("build/format-duration/format-duration.js", "zeroPad", 40);
_yuitest_coverline("build/format-duration/format-duration.js", 41);
s = typeof s == "string" ? s : String(s);

    _yuitest_coverline("build/format-duration/format-duration.js", 43);
if (s.length >= length) {return s;}

    _yuitest_coverline("build/format-duration/format-duration.js", 45);
zeroChar = zeroChar || '0';
	
    _yuitest_coverline("build/format-duration/format-duration.js", 47);
var a = [];
    _yuitest_coverline("build/format-duration/format-duration.js", 48);
for (var i = s.length; i < length; i++) {
        _yuitest_coverline("build/format-duration/format-duration.js", 49);
a.push(zeroChar);
    }
    _yuitest_coverline("build/format-duration/format-duration.js", 51);
a[rightSide ? "unshift" : "push"](s);

    _yuitest_coverline("build/format-duration/format-duration.js", 53);
return a.join("");
}
    
_yuitest_coverline("build/format-duration/format-duration.js", 56);
if(String.prototype.trim == null) {
    _yuitest_coverline("build/format-duration/format-duration.js", 57);
String.prototype.trim = function() {
        _yuitest_coverfunc("build/format-duration/format-duration.js", "trim", 57);
_yuitest_coverline("build/format-duration/format-duration.js", 58);
return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    };
}
    
/**
 * Parse XMLDurationFormat (PnYnMnDTnHnMnS) and return an object with hours, minutes and seconds
 * Any absent values are set to -1, which will be ignored in HMS_long, and set to 0 in HMS_short
 * Year, Month and Day are ignored. Only Hours, Minutes and Seconds are used
 * @param {String} xmlDuration XML Duration String. 
 *      The lexical representation for duration is the [ISO 8601] extended format PnYnMnDTnHnMnS, 
 *      where nY represents the number of years, nM the number of months, nD the number of days, 
 *      'T' is the date/time separator,
 *      nH the number of hours, nM the number of minutes and nS the number of seconds.
 *      The number of seconds can include decimal digits to arbitrary precision.
 * @return {Object} Duration as an object with the parameters hours, minutes and seconds.
 */
_yuitest_coverline("build/format-duration/format-duration.js", 74);
function getDuration_XML(xmlDuration) {
    _yuitest_coverfunc("build/format-duration/format-duration.js", "getDuration_XML", 74);
_yuitest_coverline("build/format-duration/format-duration.js", 75);
var regex = new RegExp(/P(\d+Y)?(\d+M)?(\d+D)?T(\d+H)?(\d+M)?(\d+(\.\d+)?S)/);
    _yuitest_coverline("build/format-duration/format-duration.js", 76);
var matches = xmlDuration.match(regex);
        
    _yuitest_coverline("build/format-duration/format-duration.js", 78);
if(matches == null) {
        _yuitest_coverline("build/format-duration/format-duration.js", 79);
throw new Y.Format.IllegalArgumentsException("xmlDurationFormat should be in the format: 'PnYnMnDTnHnMnS'");
    }
        
    _yuitest_coverline("build/format-duration/format-duration.js", 82);
return {
        hours: parseInt(matches[4] || -1),
        minutes: parseInt(matches[5] || -1),
        seconds: parseFloat(matches[6] || -1)
    };
}
    
/**
 * Get duration from time in seconds.
 * The value should be integer value in seconds, and should not be negative.
 * @param {Number} timeValueInSeconds Duration in seconds
 * @return {Object} Duration as an object with the parameters hours, minutes and seconds.
 */
_yuitest_coverline("build/format-duration/format-duration.js", 95);
function getDuration_Seconds(timeValueInSeconds) {
    _yuitest_coverfunc("build/format-duration/format-duration.js", "getDuration_Seconds", 95);
_yuitest_coverline("build/format-duration/format-duration.js", 96);
var duration = {};
    _yuitest_coverline("build/format-duration/format-duration.js", 97);
if(timeValueInSeconds < 0) {
        _yuitest_coverline("build/format-duration/format-duration.js", 98);
throw new Y.Format.IllegalArgumentsException("TimeValue cannot be negative");
    }
                
    _yuitest_coverline("build/format-duration/format-duration.js", 101);
duration.hours = stripDecimals(timeValueInSeconds / 3600);
                
    _yuitest_coverline("build/format-duration/format-duration.js", 103);
timeValueInSeconds %= 3600;
    _yuitest_coverline("build/format-duration/format-duration.js", 104);
duration.minutes = stripDecimals(timeValueInSeconds / 60);
                
    _yuitest_coverline("build/format-duration/format-duration.js", 106);
timeValueInSeconds %= 60;
    _yuitest_coverline("build/format-duration/format-duration.js", 107);
duration.seconds = timeValueInSeconds;
        
    _yuitest_coverline("build/format-duration/format-duration.js", 109);
return duration;
}
    
//Public methods
    
/**
 * Formats the given value into a duration format string. This function supports three kinds of usage, listed below:
 *  String format(int timeValueInSeconds):
 *      Formats the given value into a duration format string. The value should be integer value in seconds, and should not be negative.
 *  String format(string xmlDurationFormat):
 *      Formats the given XML duration format into a duration format string. 
 *      The year/month/day fields are ignored in the final format string in this version. For future compatibility, please do not pass in the Year/Month/Day part in the parameter.
 *      For hour, minute, and second, absent parts are ignored in HMS_long format, but are treated as 0 in HMS_short format style.
 *  String format(int hour, int min, int second)
 *      Formats the given duration into a duration format string. Negative values are ignored in HMS_long format, but treated as 0 in HMS_short format.
 * @return {String} The formatted string
 */
_yuitest_coverline("build/format-duration/format-duration.js", 126);
Y.DurationFormat.prototype.format = function() {
    _yuitest_coverfunc("build/format-duration/format-duration.js", "format", 126);
_yuitest_coverline("build/format-duration/format-duration.js", 127);
var duration = {};
    _yuitest_coverline("build/format-duration/format-duration.js", 128);
if(arguments.length == 1) {
        _yuitest_coverline("build/format-duration/format-duration.js", 129);
if(arguments[0] == null) {
            _yuitest_coverline("build/format-duration/format-duration.js", 130);
throw new Y.Format.IllegalArgumentsException("Argument is null");
        }
        _yuitest_coverline("build/format-duration/format-duration.js", 132);
if(isNaN(arguments[0])) {                               //Non-numeric string. format(string xmlDurationFormat)
            _yuitest_coverline("build/format-duration/format-duration.js", 133);
duration = getDuration_XML(arguments[0].trim());
        } else {                                                //format(int timeValueInSeconds)
            _yuitest_coverline("build/format-duration/format-duration.js", 135);
duration = getDuration_Seconds(arguments[0]);
        }
    } else {_yuitest_coverline("build/format-duration/format-duration.js", 137);
if(arguments.length == 3) {                          //format(int hour, int min, int second)
        _yuitest_coverline("build/format-duration/format-duration.js", 138);
if(arguments[2] == null || arguments[1] == null || arguments[0] == null) {
            _yuitest_coverline("build/format-duration/format-duration.js", 139);
throw new Y.Format.IllegalArgumentsException("One or more arguments are null/undefined");
        }
        _yuitest_coverline("build/format-duration/format-duration.js", 141);
if(isNaN(arguments[2]) || isNaN(arguments[1]) || isNaN(arguments[0])) {              //Non-numeric string.
            _yuitest_coverline("build/format-duration/format-duration.js", 142);
throw new Y.Format.IllegalArgumentsException("One or more arguments are not numeric");
        }
            
        _yuitest_coverline("build/format-duration/format-duration.js", 145);
duration = {
            hours: parseInt(arguments[0]),
            minutes: parseInt(arguments[1]),
            seconds: parseInt(arguments[2])
        }
    } else {
        _yuitest_coverline("build/format-duration/format-duration.js", 151);
throw new Y.Format.IllegalArgumentsException("Unexpected number of arguments");
    }}
        
    //Test minutes and seconds for invalid values
    _yuitest_coverline("build/format-duration/format-duration.js", 155);
if(duration.minutes > 59 || duration.seconds > 59) {
        _yuitest_coverline("build/format-duration/format-duration.js", 156);
throw new Y.Format.IllegalArgumentsException("Minutes and Seconds should be less than 60");
    }
        
    _yuitest_coverline("build/format-duration/format-duration.js", 159);
var result = "";
        
    _yuitest_coverline("build/format-duration/format-duration.js", 161);
if(this.style == Y.DurationFormat.STYLES.HMS_LONG) {
        _yuitest_coverline("build/format-duration/format-duration.js", 162);
result = this.patterns.HMS_long;
        _yuitest_coverline("build/format-duration/format-duration.js", 163);
if(duration.hours < 0) {
            _yuitest_coverline("build/format-duration/format-duration.js", 164);
duration.hours = "";
        } else {
            _yuitest_coverline("build/format-duration/format-duration.js", 166);
duration.hours = this._numberFormat.format(duration.hours) + " " + (duration.hours == 1 ? this.patterns.hour : this.patterns.hours);
        }
            
        _yuitest_coverline("build/format-duration/format-duration.js", 169);
if(duration.minutes < 0) {
            _yuitest_coverline("build/format-duration/format-duration.js", 170);
duration.minutes = "";
        } else {
            _yuitest_coverline("build/format-duration/format-duration.js", 172);
duration.minutes = duration.minutes + " " + (duration.minutes == 1 ? this.patterns.minute : this.patterns.minutes);
        }
            
        _yuitest_coverline("build/format-duration/format-duration.js", 175);
if(duration.seconds < 0) {
            _yuitest_coverline("build/format-duration/format-duration.js", 176);
duration.seconds = "";
        } else {
            _yuitest_coverline("build/format-duration/format-duration.js", 178);
duration.seconds = duration.seconds + " " + (duration.seconds == 1 ? this.patterns.second : this.patterns.seconds);
        }
    } else {                                            //HMS_SHORT
        _yuitest_coverline("build/format-duration/format-duration.js", 181);
result = this.patterns.HMS_short;
            
        _yuitest_coverline("build/format-duration/format-duration.js", 183);
duration.hours = this._numberFormat.format(duration.hours < 0 ? 0: duration.hours);
        _yuitest_coverline("build/format-duration/format-duration.js", 184);
duration.minutes = duration.minutes < 0 ? "00": zeroPad(duration.minutes, 2);
        _yuitest_coverline("build/format-duration/format-duration.js", 185);
duration.seconds = duration.seconds < 0 ? "00": zeroPad(duration.seconds, 2);
    }
        
    _yuitest_coverline("build/format-duration/format-duration.js", 188);
result = result.replace("{0}", duration.hours);
    _yuitest_coverline("build/format-duration/format-duration.js", 189);
result = result.replace("{1}", duration.minutes);
    _yuitest_coverline("build/format-duration/format-duration.js", 190);
result = result.replace("{2}", duration.seconds);
        
    //Remove unnecessary whitespaces
    _yuitest_coverline("build/format-duration/format-duration.js", 193);
result = result.replace(/\s\s+/g, " ").replace(/^\s+/, "").replace(/\s+$/, "");
        
    _yuitest_coverline("build/format-duration/format-duration.js", 195);
return result;
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
    ],
    "requires": [
        "format-numbers"
    ]
});
