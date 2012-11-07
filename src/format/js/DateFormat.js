/**
 * YDateFormat provides absolute date and time formatting.
 * Applications can choose date, time, and time zone components separately. For dates, relative descriptions (English "yesterday", German "vorgestern", Japanese "後天") are also supported. 
 * This module uses a few modified parts of zimbra AjxFormat to handle dates and time.
 * 
 * Absolute formats use the default calendar specified in CLDR for each locale. Currently this means the Buddhist calendar for Thailand; the Gregorian calendar for all other countries.
 * However, you can specify other calendars using language subtags; for example, for Thai the Gregorian calendar can be specified as th-TH-u-ca-gregory. 
 */

var MODULE_NAME = "datatype-date-advanced-format";
    
//
// Resources
//
ShortNames = {
    "weekdayMonShort":"M",
    "weekdayTueShort":"T",
    "weekdayWedShort":"W",
    "weekdayThuShort":"T",
    "weekdayFriShort":"F",
    "weekdaySatShort":"S",
    "weekdaySunShort":"S",
    "monthJanShort":"J",
    "monthFebShort":"F",
    "monthMarShort":"M",
    "monthAprShort":"A",
    "monthMayShort":"M",
    "monthJunShort":"J",
    "monthJulShort":"J",
    "monthAugShort":"A",
    "monthSepShort":"S",
    "monthOctShort":"O",
    "monthNovShort":"N",
    "monthDecShort":"D"
}
    
//
// Date format class
//

/**
 * The DateFormat class formats Date objects according to a specified 
 * pattern. The patterns are defined the same as the SimpleDateFormat
 * class in the Java libraries.
 * <p>
 * <strong>Note:</strong>
 * The date format differs from the Java patterns a few ways: the pattern
 * "EEEEE" (5 'E's) denotes a <em>short</em> weekday and the pattern "MMMMM"
 * (5 'M's) denotes a <em>short</em> month name. This matches the extended 
 * pattern found in the Common Locale Data Repository (CLDR) found at: 
 * http://www.unicode.org/cldr/.
 */
DateFormat = function(pattern, formats, timeZoneId) {
    if (arguments.length == 0) {
        return;
    }
    DateFormat.superclass.constructor.call(this, pattern, formats);
    this.timeZone = new Y.Date.Timezone(timeZoneId);
        
    if (pattern == null) {
        return;
    }
    var head, tail, segment;
    for (var i = 0; i < pattern.length; i++) {
        // literal
        var c = pattern.charAt(i);
        if (c == "'") {
            head = i + 1;
            for (i++ ; i < pattern.length; i++) {
                c = pattern.charAt(i);
                if (c == "'") {
                    if (i + 1 < pattern.length && pattern.charAt(i + 1) == "'") {
                        pattern = pattern.substr(0, i) + pattern.substr(i + 1);
                    }
                    else {
                        break;
                    }
                }
            }
            if (i == pattern.length) {
                throw new Format.FormatException("unterminated string literal");
            }
            tail = i;
            segment = new Format.TextSegment(this, pattern.substring(head, tail));
            this._segments.push(segment);
            continue;
        }

        // non-meta chars
        head = i;
        while(i < pattern.length) {
            c = pattern.charAt(i);
            if (DateFormat._META_CHARS.indexOf(c) != -1 || c == "'") {
                break;
            }
            i++;
        }
        tail = i;
        if (head != tail) {
            segment = new Format.TextSegment(this, pattern.substring(head, tail));
            this._segments.push(segment);
            i--;
            continue;
        }
		
        // meta char
        head = i;
        while(++i < pattern.length) {
            if (pattern.charAt(i) != c) {
                break;
            }		
        }
        tail = i--;
        var count = tail - head;
        var field = pattern.substr(head, count);
        segment = null;
        switch (c) {
            case 'G':
                segment = new DateFormat.EraSegment(this, field);
                break;
            case 'y':
                segment = new DateFormat.YearSegment(this, field);
                break;
            case 'M':
                segment = new DateFormat.MonthSegment(this, field);
                break;
            case 'w':
            case 'W':
                segment = new DateFormat.WeekSegment(this, field);
                break;
            case 'D':
            case 'd':
                segment = new DateFormat.DaySegment(this, field);
                break;
            case 'F':
            case 'E':
                segment = new DateFormat.WeekdaySegment(this, field);
                break;
            case 'a':
                segment = new DateFormat.AmPmSegment(this, field);
                break;
            case 'H':
            case 'k':
            case 'K':
            case 'h':
                segment = new DateFormat.HourSegment(this, field);
                break;
            case 'm':
                segment = new DateFormat.MinuteSegment(this, field);
                break;
            case 's':
            case 'S':
                segment = new DateFormat.SecondSegment(this, field);
                break;
            case 'z':
            case 'Z':
                segment = new DateFormat.TimezoneSegment(this, field);
                break;
        }
        if (segment != null) {
            segment._index = this._segments.length;
            this._segments.push(segment);
        }
    }
}
Y.extend(DateFormat, Format);

// Constants

DateFormat.SHORT = 0;
DateFormat.MEDIUM = 1;
DateFormat.LONG = 2;
DateFormat.DEFAULT = DateFormat.MEDIUM;

DateFormat._META_CHARS = "GyMwWDdFEaHkKhmsSzZ";

DateFormat.prototype.format = function(object, relative) {
    var useRelative = false;
    if(relative != null && relative != "") {
        useRelative = true;
    }

    var s = [];
    var datePattern = false;
    for (var i = 0; i < this._segments.length; i++) {
        //Mark datePattern sections in case of relative dates
        if(this._segments[i].toString().indexOf("text: \"<datePattern>\"") == 0) {
            if(useRelative) {
                s.push(relative);
            }
            datePattern = true;
            continue;
        }
        if(this._segments[i].toString().indexOf("text: \"</datePattern>\"") == 0) {
            datePattern = false;
            continue;
        }
        if(!datePattern || !useRelative) {
            s.push(this._segments[i].format(object));
        }
    }
    return s.join("");
}

//
// Date segment class
//

DateFormat.DateSegment = function(format, s) {
    if (arguments.length == 0) return;
    DateFormat.DateSegment.superclass.constructor.call(this, format, s);
}
Y.extend(DateFormat.DateSegment, Format.Segment);

//
// Date era segment class
//

DateFormat.EraSegment = function(format, s) {
    if (arguments.length == 0) return;
    DateFormat.EraSegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.EraSegment, DateFormat.DateSegment);

// Public methods

DateFormat.EraSegment.prototype.format = function(date) { 
    // NOTE: Only support current era at the moment...
    return this.getFormat().AD;
};

//
// Date year segment class
//

DateFormat.YearSegment = function(format, s) {
    if (arguments.length == 0) return;
    DateFormat.YearSegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.YearSegment, DateFormat.DateSegment);

DateFormat.YearSegment.prototype.toString = function() { 
    return "dateYear: \""+this._s+'"'; 
};

// Public methods

DateFormat.YearSegment.prototype.format = function(date) { 
    var year = String(date.getFullYear());
    return this._s.length != 1 && this._s.length < 4 ? year.substr(year.length - 2) : zeroPad(year, this._s.length);
};

//
// Date month segment class
//

DateFormat.MonthSegment = function(format, s) {
    if (arguments.length == 0) return;
    DateFormat.MonthSegment.superclass.constructor.call(this, format, s);
    this.initialize();
};
Y.extend(DateFormat.MonthSegment, DateFormat.DateSegment);

DateFormat.MonthSegment.prototype.toString = function() { 
    return "dateMonth: \""+this._s+'"'; 
};

DateFormat.MonthSegment.prototype.initialize = function() {
    DateFormat.MonthSegment.MONTHS = {};
    DateFormat.MonthSegment.MONTHS[DateFormat.SHORT] = [
    ShortNames.monthJanShort,ShortNames.monthFebShort,ShortNames.monthMarShort,
    ShortNames.monthAprShort,ShortNames.monthMayShort,ShortNames.monthJunShort,
    ShortNames.monthJulShort,ShortNames.monthAugShort,ShortNames.monthSepShort,
    ShortNames.monthOctShort,ShortNames.monthNovShort,ShortNames.monthDecShort
    ];
    DateFormat.MonthSegment.MONTHS[DateFormat.MEDIUM] = [
    this.getFormat().Formats.monthJanMedium, this.getFormat().Formats.monthFebMedium, this.getFormat().Formats.monthMarMedium,
    this.getFormat().Formats.monthAprMedium, this.getFormat().Formats.monthMayMedium, this.getFormat().Formats.monthJunMedium,
    this.getFormat().Formats.monthJulMedium, this.getFormat().Formats.monthAugMedium, this.getFormat().Formats.monthSepMedium,
    this.getFormat().Formats.monthOctMedium, this.getFormat().Formats.monthNovMedium, this.getFormat().Formats.monthDecMedium
    ];
    DateFormat.MonthSegment.MONTHS[DateFormat.LONG] = [
    this.getFormat().Formats.monthJanLong, this.getFormat().Formats.monthFebLong, this.getFormat().Formats.monthMarLong,
    this.getFormat().Formats.monthAprLong, this.getFormat().Formats.monthMayLong, this.getFormat().Formats.monthJunLong,
    this.getFormat().Formats.monthJulLong, this.getFormat().Formats.monthAugLong, this.getFormat().Formats.monthSepLong,
    this.getFormat().Formats.monthOctLong, this.getFormat().Formats.monthNovLong, this.getFormat().Formats.monthDecLong
    ];
};

// Public methods

DateFormat.MonthSegment.prototype.format = function(date) {
    var month = date.getMonth();
    switch (this._s.length) {
        case 1:
            return String(month + 1);
        case 2:
            return zeroPad(month + 1, 2);
        case 3:
            return DateFormat.MonthSegment.MONTHS[DateFormat.MEDIUM][month];
        case 5:
            return DateFormat.MonthSegment.MONTHS[DateFormat.SHORT][month];
    }
    return DateFormat.MonthSegment.MONTHS[DateFormat.LONG][month];
};

//
// Date week segment class
//

DateFormat.WeekSegment = function(format, s) {
    if (arguments.length == 0) return;
    DateFormat.WeekSegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.WeekSegment, DateFormat.DateSegment);

// Public methods

DateFormat.WeekSegment.prototype.format = function(date) {
    var year = date.getYear();
    var month = date.getMonth();
    var day = date.getDate();
	
    var ofYear = /w/.test(this._s);
    var date2 = new Date(year, ofYear ? 0 : month, 1);

    var week = 0;
    while (true) {
        week++;
        if (date2.getMonth() > month || (date2.getMonth() == month && date2.getDate() >= day)) {
            break;
        }
        date2.setDate(date2.getDate() + 7);
    }

    return zeroPad(week, this._s.length);
};

//
// Date day segment class
//

DateFormat.DaySegment = function(format, s) {
    if (arguments.length == 0) return;
    DateFormat.DaySegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.DaySegment, DateFormat.DateSegment);

// Public methods

DateFormat.DaySegment.prototype.format = function(date) {
    var month = date.getMonth();
    var day = date.getDate();
    if (/D/.test(this._s) && month > 0) {
        var year = date.getYear();
        do {
            // set date to first day of month and then go back one day
            var date2 = new Date(year, month, 1);
            date2.setDate(0); 
			
            day += date2.getDate();
            month--;
        } while (month > 0);
    }
    return zeroPad(day, this._s.length);
};

//
// Date weekday segment class
//

DateFormat.WeekdaySegment = function(format, s) {
    if (arguments.length == 0) return;
    DateFormat.WeekdaySegment.superclass.constructor.call(this, format, s);
    this.initialize();
};
Y.extend(DateFormat.WeekdaySegment, DateFormat.DateSegment);

DateFormat.DaySegment.prototype.toString = function() { 
    return "dateDay: \""+this._s+'"'; 
};

DateFormat.WeekdaySegment.prototype.initialize = function() {
    DateFormat.WeekdaySegment.WEEKDAYS = {};
    // NOTE: The short names aren't available in Java so we have to define them.
    DateFormat.WeekdaySegment.WEEKDAYS[DateFormat.SHORT] = [
    ShortNames.weekdaySunShort,ShortNames.weekdayMonShort,ShortNames.weekdayTueShort,
    ShortNames.weekdayWedShort,ShortNames.weekdayThuShort,ShortNames.weekdayFriShort,
    ShortNames.weekdaySatShort
    ];
    DateFormat.WeekdaySegment.WEEKDAYS[DateFormat.MEDIUM] = [
    this.getFormat().Formats.weekdaySunMedium, this.getFormat().Formats.weekdayMonMedium, this.getFormat().Formats.weekdayTueMedium,
    this.getFormat().Formats.weekdayWedMedium, this.getFormat().Formats.weekdayThuMedium, this.getFormat().Formats.weekdayFriMedium,
    this.getFormat().Formats.weekdaySatMedium
    ];
    DateFormat.WeekdaySegment.WEEKDAYS[DateFormat.LONG] = [
    this.getFormat().Formats.weekdaySunLong, this.getFormat().Formats.weekdayMonLong, this.getFormat().Formats.weekdayTueLong,
    this.getFormat().Formats.weekdayWedLong, this.getFormat().Formats.weekdayThuLong, this.getFormat().Formats.weekdayFriLong,
    this.getFormat().Formats.weekdaySatLong
    ];
};

// Public methods

DateFormat.WeekdaySegment.prototype.format = function(date) {
    var weekday = date.getDay();
    if (/E/.test(this._s)) {
        var style;
        switch (this._s.length) {
            case 4:
                style = DateFormat.LONG;
                break;
            case 5:
                style = DateFormat.SHORT;
                break;
            default:
                style = DateFormat.MEDIUM;
        }
        return DateFormat.WeekdaySegment.WEEKDAYS[style][weekday];
    }
    return zeroPad(weekday, this._s.length);
};

//
// Time segment class
//

DateFormat.TimeSegment = function(format, s) {
    if (arguments.length == 0) return;
    DateFormat.TimeSegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.TimeSegment, Format.Segment);

//
// Time hour segment class
//

DateFormat.HourSegment = function(format, s) {
    if (arguments.length == 0) return;
    DateFormat.HourSegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.HourSegment, DateFormat.TimeSegment);

DateFormat.HourSegment.prototype.toString = function() { 
    return "timeHour: \""+this._s+'"'; 
};

// Public methods

DateFormat.HourSegment.prototype.format = function(date) {
    var hours = date.getHours();
    if (hours > 12 && /[hK]/.test(this._s)) {
        hours -= 12;
    }
    else if (hours == 0 && /[h]/.test(this._s)) {
        hours = 12;
    }
    /***
	// NOTE: This is commented out to match the Java formatter output
	//       but from the comments for these meta-chars, it doesn't
	//       seem right.
	if (/[Hk]/.test(this._s)) {
		hours--;
	}
    /***/
    return zeroPad(hours, this._s.length);
};

//
// Time minute segment class
//

DateFormat.MinuteSegment = function(format, s) {
    if (arguments.length == 0) return;
    DateFormat.MinuteSegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.MinuteSegment, DateFormat.TimeSegment);

DateFormat.MinuteSegment.prototype.toString = function() { 
    return "timeMinute: \""+this._s+'"'; 
};

// Public methods

DateFormat.MinuteSegment.prototype.format = function(date) {
    var minutes = date.getMinutes();
    return zeroPad(minutes, this._s.length);
};

//
// Time second segment class
//

DateFormat.SecondSegment = function(format, s) {
    if (arguments.length == 0) return;
    DateFormat.SecondSegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.SecondSegment, DateFormat.TimeSegment);

// Public methods

DateFormat.SecondSegment.prototype.format = function(date) {
    var minutes = /s/.test(this._s) ? date.getSeconds() : date.getMilliseconds();
    return zeroPad(minutes, this._s.length);
};

//
// Time am/pm segment class
//

DateFormat.AmPmSegment = function(format, s) {
    if (arguments.length == 0) return;
    DateFormat.AmPmSegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.AmPmSegment, DateFormat.TimeSegment);

DateFormat.AmPmSegment.prototype.toString = function() { 
    return "timeAmPm: \""+this._s+'"'; 
};

// Public methods

DateFormat.AmPmSegment.prototype.format = function(date) {
    var hours = date.getHours();
    return hours < 12 ? this.getFormat().Formats.periodAm : this.getFormat().Formats.periodPm;
};

//
// Time timezone segment class
//

DateFormat.TimezoneSegment = function(format, s) {
    if (arguments.length == 0) return;
    DateFormat.TimezoneSegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.TimezoneSegment, DateFormat.TimeSegment);

DateFormat.TimezoneSegment.prototype.toString = function() { 
    return "timeTimezone: \""+this._s+'"'; 
};

// Public methods

DateFormat.TimezoneSegment.prototype.format = function(date) {
    if (/Z/.test(this._s)) {
        return this.getFormat().timeZone.getShortName();
    }
    return this._s.length < 4 ? this.getFormat().timeZone.getMediumName() : this.getFormat().timeZone.getLongName();
};
    
//
// Non-Gregorian Calendars
//
    
//Buddhist Calendar. This is normally used only for Thai locales (th).
BuddhistDateFormat = function(pattern, formats, timeZoneId, locale) {
    if (arguments.length == 0) return;
    BuddhistDateFormat.superclass.constructor.call(this, pattern, formats, timeZoneId, locale);
        
    //Iterate through _segments, and replace the ones that are different for Buddhist Calendar
    var segments = this._segments;
    for(var i=0; i<segments.length; i++) {
        if(segments[i] instanceof DateFormat.YearSegment) {
            segments[i] = new BuddhistDateFormat.YearSegment(segments[i]);
        } else if (segments[i] instanceof DateFormat.EraSegment) {
            segments[i] = new BuddhistDateFormat.EraSegment(segments[i]);
        }
    }
}

Y.extend(BuddhistDateFormat, DateFormat);
    
//Override YearSegment class for Buddhist Calender
BuddhistDateFormat.YearSegment = function(segment) {
    if (arguments.length == 0) return;
    BuddhistDateFormat.YearSegment.superclass.constructor.call(this, segment._parent, segment._s);
};

Y.extend(BuddhistDateFormat.YearSegment, DateFormat.YearSegment);

BuddhistDateFormat.YearSegment.prototype.format = function(date) { 
    var year = date.getFullYear();
    year = String(year + 543);      //Buddhist Calendar epoch is in 543 BC
    return this._s.length != 1 && this._s.length < 4 ? year.substr(year.length - 2) : zeroPad(year, this._s.length);
};
    
//Override EraSegment class for Buddhist Calender
BuddhistDateFormat.EraSegment = function(segment) {
    if (arguments.length == 0) return;
    BuddhistDateFormat.EraSegment.superclass.constructor.call(this, segment._parent, segment._s);
};

Y.extend(BuddhistDateFormat.EraSegment, DateFormat.EraSegment);

BuddhistDateFormat.EraSegment.prototype.format = function(date) { 
    return "BE";    //Only Buddhist Era supported for now
};
        
//
// Start YUI code
//
    
/**
 * @class YDateFormat
 * @constructor
 * @param {String} timeZone (Optional) TZ database ID for the time zone that should be used. If no argument is provided, "Etc/GMT" is used. If an argument is provided that is not a valid time zone identifier, an Error exception is thrown.
 * @param {Number} dateFormat (Optional) Selector for the desired date format from Y.Date.DATE_FORMATS. If no argument is provided, NONE is assumed. If an argument is provided that's not a valid selector, an Error exception is thrown. 
 * @param {Number} timeFormat (Optional) Selector for the desired time format from Y.Date.TIME_FORMATS. If no argument is provided, NONE is assumed. If an argument is provided that's not a valid selector, an Error exception is thrown. 
 * @param {Number} timeZoneFormat (Optional) Selector for the desired time zone format from Y.Date.TIMEZONE_FORMATS. If no argument is provided, NONE is assumed. If an argument is provided that's not a valid selector, an Error exception is thrown. 
 */
YDateFormat = function(timeZone, dateFormat, timeFormat, timeZoneFormat) {
        
    if(timeZone == null) {
        timeZone = "Etc/GMT";
    }

    this._Formats = Y.Intl.get(MODULE_NAME);
        
    //If not valid time zone
    if(!Y.Date.Timezone.isValidTimezoneId(timeZone)) {
        throw new Y.Date.Timezone.UnknownTimeZoneException("Could not find timezone: " + timeZone);
    }

    this._timeZone = timeZone;
    this._timeZoneInstance = new Y.Date.Timezone(this._timeZone);

    this._dateFormat = dateFormat;
    this._timeFormat = timeFormat;
    this._timeZoneFormat = timeZoneFormat;

    this._relative = false;
    this._pattern = this._generatePattern();

    var locale = Y.Intl.getLang(MODULE_NAME);
        
    if(locale.match(/^th/) && !locale.match(/u-ca-gregory/)) {
        //Use buddhist calendar
        this._dateFormatInstance = new BuddhistDateFormat(this._pattern, this._Formats, this._timeZone);
    } else {
        //Use gregorian calendar
        this._dateFormatInstance = new DateFormat(this._pattern, this._Formats, this._timeZone);
    }        
}

Y.mix(Y.Date, {
    //Selector values
    DATE_FORMATS: {
        NONE: 0,
        WYMD_LONG: 1,
        WYMD_ABBREVIATED: 4,
        WYMD_SHORT: 8,
        WMD_LONG: 16,
        WMD_ABBREVIATED: 32,
        WMD_SHORT: 64,
        YMD_LONG: 128,
        YMD_ABBREVIATED: 256,
        YMD_SHORT: 512,
        YM_LONG: 1024,
        MD_LONG: 2048,
        MD_ABBREVIATED: 4096,
        MD_SHORT: 8192,
        W_LONG: 16384,
        W_ABBREVIATED: 32768,
        M_LONG: 65536,
        M_ABBREVIATED: 131072,
        YMD_FULL: 262144,
        RELATIVE_DATE: 524288
    },
    TIME_FORMATS: {
        NONE: 0,
        HM_ABBREVIATED: 1,
        HM_SHORT: 2,
        H_ABBREVIATED: 4
    },
    TIMEZONE_FORMATS: {
        NONE: 0,
        Z_ABBREVIATED: 1,
        Z_SHORT: 2
    },
    
    //Static methods
    
    /**
     * Returns an array of BCP 47 language tags for the languages supported by this class
     * @return {Array} an array of BCP 47 language tags for the languages supported by this class.
     */
    availableLanguages: function() {
        return Y.Intl.getAvailableLangs(MODULE_NAME);
    }
});

//Private methods

/**
 * Generate date pattern for selected format
 * @return {String} Date pattern for internal use.
 */
YDateFormat.prototype._generateDatePattern = function() {
    var format = this._dateFormat;
    if(format && Y.Lang.isString(format)) {
        format = Y.Date.DATE_FORMATS[format];
    }
    
    if(format == null) return "";
    if(format & Y.Date.DATE_FORMATS.RELATIVE_DATE) {
        this._relative = true;
        format = format ^ Y.Date.DATE_FORMATS.RELATIVE_DATE;
    }
    switch(format) {
        //Use relative only for formats with day component
        case Y.Date.DATE_FORMATS.NONE:
            this._relative = false;
            return "";
        case Y.Date.DATE_FORMATS.WYMD_LONG:
            return this._Formats.WYMD_long;
        case Y.Date.DATE_FORMATS.WYMD_ABBREVIATED:
            return this._Formats.WYMD_abbreviated;
        case Y.Date.DATE_FORMATS.WYMD_SHORT:
            return this._Formats.WYMD_short;
        case Y.Date.DATE_FORMATS.WMD_LONG:
            return this._Formats.WMD_long;
        case Y.Date.DATE_FORMATS.WMD_ABBREVIATED:
            return this._Formats.WMD_abbreviated;
        case Y.Date.DATE_FORMATS.WMD_SHORT:
            return this._Formats.WMD_short;
        case Y.Date.DATE_FORMATS.YMD_LONG:
            return this._Formats.YMD_long;
        case Y.Date.DATE_FORMATS.YMD_ABBREVIATED:
            return this._Formats.YMD_abbreviated;
        case Y.Date.DATE_FORMATS.YMD_SHORT:
            return this._Formats.YMD_short;
        case Y.Date.DATE_FORMATS.YM_LONG:
            this._relative = false;
            return this._Formats.YM_long;
        case Y.Date.DATE_FORMATS.MD_LONG:
            return this._Formats.MD_long;
        case Y.Date.DATE_FORMATS.MD_ABBREVIATED:
            return this._Formats.MD_abbreviated;
        case Y.Date.DATE_FORMATS.MD_SHORT:
            return this._Formats.MD_short;
        case Y.Date.DATE_FORMATS.W_LONG:
            this._relative = false;
            return this._Formats.W_long;
        case Y.Date.DATE_FORMATS.W_ABBREVIATED:
            this._relative = false;
            return this._Formats.W_abbreviated;
        case Y.Date.DATE_FORMATS.M_LONG:
            this._relative = false;
            return this._Formats.M_long;
        case Y.Date.DATE_FORMATS.M_ABBREVIATED:
            this._relative = false;
            return this._Formats.M_abbreviated;
        case Y.Date.DATE_FORMATS.YMD_FULL:
            return this._Formats.YMD_full;
        default:
            throw new Format.IllegalArgumentsException("Date format given does not exist");	//Error no such pattern.
    }
}
    
/**
 * Generate time pattern for selected format
 * @return {String} Time pattern for internal use.
 */
YDateFormat.prototype._generateTimePattern = function() {
    var format = this._timeFormat;
    if(format && Y.Lang.isString(format)) {
        format = Y.Date.TIME_FORMATS[format];
    }
    
    if(format == null) return "";
    switch(format) {
        case Y.Date.TIME_FORMATS.NONE:
            return "";
        case Y.Date.TIME_FORMATS.HM_ABBREVIATED:
            return this._Formats.HM_abbreviated;
        case Y.Date.TIME_FORMATS.HM_SHORT:
            return this._Formats.HM_short;
        case Y.Date.TIME_FORMATS.H_ABBREVIATED:
            return this._Formats.H_abbreviated;
        default:
            throw new Format.IllegalArgumentsException("Time format given does not exist");	//Error no such pattern.
    }
}
    
/**
 * Generate time-zone pattern for selected format
 * @return {String} Time-Zone pattern for internal use.
 */
YDateFormat.prototype._generateTimeZonePattern = function() {
    var format = this._timeZoneFormat;
    if(format && Y.Lang.isString(format)) {
        format = Y.Date.TIMEZONE_FORMATS[format];
    }
    
    if(format == null) return "";
    switch(format) {
        case Y.Date.TIMEZONE_FORMATS.NONE:
            return "";
        case Y.Date.TIMEZONE_FORMATS.Z_ABBREVIATED:
            return "z";
        case Y.Date.TIMEZONE_FORMATS.Z_SHORT:
            return "Z";
        default:
            throw new Format.IllegalArgumentsException("Time Zone format given does not exist");	//Error no such pattern.
    }
}
    
/**
 * Generate pattern for selected date, time and time-zone formats
 * @return {String} Combined pattern for date, time and time-zone for internal use.
 */
YDateFormat.prototype._generatePattern = function() {
    var datePattern = this._generateDatePattern();
    var timePattern = this._generateTimePattern();
    var timeZonePattern = this._generateTimeZonePattern();

    //Combine patterns. Mark date pattern part, to use with relative dates.
    if(datePattern != "") {
        datePattern = "'<datePattern>'" + datePattern + "'</datePattern>'";
    }
        
    var pattern = "";
    if(timePattern != "" && timeZonePattern != "") {
        pattern = this._Formats.DateTimeTimezoneCombination;
    } else if (timePattern != "") {
        pattern = this._Formats.DateTimeCombination;
    } else if(timeZonePattern != "") {
        pattern = this._Formats.DateTimezoneCombination;
    } else if(datePattern != ""){
        //Just date
        pattern = "{1}";
    }
        
    pattern = pattern.replace("{0}", timePattern).replace("{1}", datePattern).replace("{2}", timeZonePattern);
        
    //Remove unnecessary whitespaces
    pattern = pattern.replace(/\s\s+/g, " ").replace(/^\s+/, "").replace(/\s+$/, "");

    return pattern;
}

//public methods

/**
 * Formats a time value.
 * @param {Date} date The time value to be formatted. If no valid Date object is provided, an Error exception is thrown.
 * @return {String} The formatted string
 */
YDateFormat.prototype.format = function(date) {
    if(date == null || !Y.Lang.isDate(date)) {
        throw new Format.IllegalArgumentsException("format called without a date.");
    }
        
    var offset = this._timeZoneInstance.getRawOffset() * 1000;
    date = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000 + offset);
        
    var relativeDate = null;
    if(this._relative) {
        var today = new Date();
        var tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        var yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

        if(date.getFullYear() == today.getFullYear() && date.getMonth() == today.getMonth() && date.getDate() == today.getDate()) {
            relativeDate = this._Formats.today;
        }

        if(date.getFullYear() == tomorrow.getFullYear() && date.getMonth() == tomorrow.getMonth() && date.getDate() == tomorrow.getDate()) {
            relativeDate = this._Formats.tomorrow;
        }

        if(date.getFullYear() == yesterday.getFullYear() && date.getMonth() == yesterday.getMonth() && date.getDate() == yesterday.getDate()) {
            relativeDate = this._Formats.yesterday;
        }
    }
    return this._dateFormatInstance.format(date, relativeDate);
}