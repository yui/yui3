
Y.Date.deprecatedFormat = Y.Date.format;
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