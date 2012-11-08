
Y.Date.deprecatedFormat = Y.Date.format;

/**
 * Takes a native JavaScript Date and formats it as a string for display to user.
 * @for Date
 * @method format
 * @param oDate {Date} Date
 * @param oConfig {Obhect} (Optional) Object literal of configuration values:
 *    <dl>
 *       <dt>dateFormat {String/Number} (Optional)</dt>
 *           <dd>Date Format/Style</dd>
 *       <dt>timeFormat {String/Number} (Optional)</dt>
 *           <dd>Time Format/Style</dd>
 *       <dt>timezoneFormat {String/Number} (Optional)</dt>
 *           <dd> Timezone Format/Style</dd>
 *       <dt>format {HTML} (Optional)</dt>
 *           <dd>format string to use the deprecated format method in datatype-date-format module</dd>
 *    </dl>
 * @return {String} string representation of the date
 */
Y.Date.format = function(oDate, oConfig) {
    oConfig = oConfig || {};
    if(oConfig.format && Y.Lang.isString(oConfig.format)) {
        return Y.Date.deprecatedFormat(oDate, oConfig);
    }
    
    if(!Y.Lang.isDate(oDate)) {
        Y.log("format called without a date", "WARN", "date");
        return Y.Lang.isValue(oDate) ? oDate : "";
    }
                
    var formatter;
    if(oConfig.dateFormat || oConfig.timeFormat || oConfig.timezoneFormat) {    
        formatter = new YDateFormat(oConfig.timezone, oConfig.dateFormat, oConfig.timeFormat, oConfig.timezoneFormat);
        return formatter.format(oDate);
    }
    
    var relativeTo = (typeof Y.Date.currentDate == 'function' ?  Y.Date.currentDate() : Y.Date.currentDate);
    if(oConfig.relativeTimeFormat) {
        formatter = new YRelativeTimeFormat(oConfig.relativeTimeFormat, relativeTo);
        return formatter.format(oDate.getTime()/1000, Y.Date.currentDate.getTime()/1000);
    }
    
    throw new Format.FormatException("Unrecognized format options.");
}

/**
 * Returns a string representation of the duration
 * @for Date
 * @method format
 * @param oDuration {String/Number/Object} Duration as time in seconds, xml duration format, or an object with hours, minutes and seconds
 * @param oConfig {Object} (Optional) Configuration object. Used to pass style parameter to the method. 'style' can be a string (HMS_LONG/HMS_SHORT) or the numerical values in Y.Date.DURATION_FORMATS
 * @return {String} string representation of the duration
 */
Y.Date.formatDuration = function(oDuration, oConfig) {
    oConfig = oConfig || {};
    if(oDuration == null) {
        oDuration = {};
    }
    if(Y.Lang.isNumber(oDuration) || Y.Lang.isString(oDuration)) {
        return (new YDurationFormat(oConfig.style)).format(oDuration);
    } else if(oDuration.hours != null || oDuration.minutes != null || oDuration.seconds != null) {
        if(oDuration.hours == null) { oDuration.hours = -1; }
        if(oDuration.minutes == null) { oDuration.minutes= -1; }
        if(oDuration.seconds == null) { oDuration.seconds = -1; }
        return (new YDurationFormat(oConfig.style)).format(oDuration.hours || -1, oDuration.minutes || -1, oDuration.seconds || -1);
    }
    
    throw new Format.IllegalArgumentsException("Unrecognized duration values");
}
