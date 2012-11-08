/**
 * YDurationFormat class formats time in a language independent manner.
 * The duration formats use appropriate singular/plural/paucal/etc. forms for all languages. 
 * @module format-duration
 * @requires format-numbers
 */

var MODULE_NAME = "datatype-date-advanced-format";
/**
 * YDurationFormat class formats time in a language independent manner.
 * @class YDurationFormat
 * @constructor
 * @param {Number} style selector for the desired duration format, from Y.Date.DURATION_FORMATS
 */
YDurationFormat = function(style) {
    if(style && Y.Lang.isString(style)) {
        style = Y.Date.DURATION_FORMATS[style];
    }
    this.style = style;
    this.patterns = Y.Intl.get(MODULE_NAME);
}
    
//Exceptions

Y.mix(YDurationFormat, {
    IllegalArgumentsException: function(message) {
        this.message = message;
        this.toString = function() {
            return "IllegalArgumentsException: " + this.message;
        }
    }
})

//Static Data
Y.mix(Y.Date, {
    DURATION_FORMATS: {
        HMS_LONG: 0,
        HMS_SHORT: 1
    }
});
    
//Support methods
    
/**
 * Strip decimal part of argument and return the integer part
 * @param floatNum A real number
 * @return Integer part of floatNum
 */
function stripDecimals(floatNum) {
    return floatNum > 0 ? Math.floor(floatNum): Math.ceil(floatNum);
}
    
function zeroPad (s, length, zeroChar, rightSide) {
    s = typeof s == "string" ? s : String(s);

    if (s.length >= length) return s;

    zeroChar = zeroChar || '0';
	
    var a = [];
    for (var i = s.length; i < length; i++) {
        a.push(zeroChar);
    }
    a[rightSide ? "unshift" : "push"](s);

    return a.join("");
}
    
if(String.prototype.trim == null) {
    String.prototype.trim = function() {
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
function getDuration_XML(xmlDuration) {
    var regex = new RegExp(/P(\d+Y)?(\d+M)?(\d+D)?T(\d+H)?(\d+M)?(\d+(\.\d+)?S)/);
    var matches = xmlDuration.match(regex);
        
    if(matches == null) {
        throw new YDurationFormat.IllegalArgumentsException("xmlDurationFormat should be in the format: 'PnYnMnDTnHnMnS'");
    }
        
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
function getDuration_Seconds(timeValueInSeconds) {
    var duration = {};
    if(timeValueInSeconds < 0) {
        throw new YDurationFormat.IllegalArgumentsException("TimeValue cannot be negative");
    }
                
    duration.hours = stripDecimals(timeValueInSeconds / 3600);
                
    timeValueInSeconds %= 3600;
    duration.minutes = stripDecimals(timeValueInSeconds / 60);
                
    timeValueInSeconds %= 60;
    duration.seconds = timeValueInSeconds;
        
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
YDurationFormat.prototype.format = function() {
    var duration = {};
    if(arguments.length == 1) {
        if(arguments[0] == null) {
            throw new YDurationFormat.IllegalArgumentsException("Argument is null");
        }
        if(isNaN(arguments[0])) {                               //Non-numeric string. format(string xmlDurationFormat)
            duration = getDuration_XML(arguments[0].trim());
        } else {                                                //format(int timeValueInSeconds)
            duration = getDuration_Seconds(arguments[0]);
        }
    } else if(arguments.length == 3) {                          //format(int hour, int min, int second)
        if(arguments[2] == null || arguments[1] == null || arguments[0] == null) {
            throw new YDurationFormat.IllegalArgumentsException("One or more arguments are null/undefined");
        }
        if(isNaN(arguments[2]) || isNaN(arguments[1]) || isNaN(arguments[0])) {              //Non-numeric string.
            throw new YDurationFormat.IllegalArgumentsException("One or more arguments are not numeric");
        }
            
        duration = {
            hours: parseInt(arguments[0]),
            minutes: parseInt(arguments[1]),
            seconds: parseInt(arguments[2])
        }
    } else {
        throw new YDurationFormat.IllegalArgumentsException("Unexpected number of arguments");
    }
        
    //Test minutes and seconds for invalid values
    if(duration.minutes > 59 || duration.seconds > 59) {
        throw new YDurationFormat.IllegalArgumentsException("Minutes and Seconds should be less than 60");
    }
        
    var result = "";
        
    if(this.style == Y.Date.DURATION_FORMATS.HMS_LONG) {
        result = this.patterns.HMS_long;
        if(duration.hours < 0) {
            duration.hours = "";
        } else {
            duration.hours = Y.Number.format(duration.hours) + " " + (duration.hours == 1 ? this.patterns.hour : this.patterns.hours);
        }
            
        if(duration.minutes < 0) {
            duration.minutes = "";
        } else {
            duration.minutes = duration.minutes + " " + (duration.minutes == 1 ? this.patterns.minute : this.patterns.minutes);
        }
            
        if(duration.seconds < 0) {
            duration.seconds = "";
        } else {
            duration.seconds = duration.seconds + " " + (duration.seconds == 1 ? this.patterns.second : this.patterns.seconds);
        }
    } else {                                            //HMS_SHORT
        result = this.patterns.HMS_short;
            
        duration.hours = Y.Number.format(duration.hours < 0 ? 0: duration.hours);
        duration.minutes = duration.minutes < 0 ? "00": zeroPad(duration.minutes, 2);
        duration.seconds = duration.seconds < 0 ? "00": zeroPad(duration.seconds, 2);
    }
        
    result = result.replace("{0}", duration.hours);
    result = result.replace("{1}", duration.minutes);
    result = result.replace("{2}", duration.seconds);
        
    //Remove unnecessary whitespaces
    result = result.replace(/\s\s+/g, " ").replace(/^\s+/, "").replace(/\s+$/, "");
        
    return result;
}
