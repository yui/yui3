
Y.Date.deprecatedFormat = Y.Date.format;
Y.Date.format = function(oDate, oConfig) {
    oConfig = oConfig || {};
    if(oConfig.format && Y.Lang.isString(oConfig.format)) {
        return Y.Date.deprecatedFormat(oDate, oConfig);
    }
        
    var formatter = new YDateFormat(oConfig.timezone, oConfig.dateFormat, oConfig.timeFormat, oConfig.timezoneFormat);
    return formatter.format(oDate);
}
