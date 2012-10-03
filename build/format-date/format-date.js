YUI.add('format-date', function (Y, NAME) {

/*
 * Copyright 2012 Yahoo! Inc. All Rights Reserved. Based on code owned by VMWare, Inc. 
 */

//
// Format class
//

/**
 * Base class for all formats. To format an object, instantiate the
 * format of your choice and call the <code>format</code> method which
 * returns the formatted string.
 */
Format = function(pattern, formats) {
    if (arguments.length == 0) {
        return;
    }
    this._pattern = pattern;
    this._segments = []; 
    this.Formats = formats; 
}

// Data

Format.prototype._pattern = null;
Format.prototype._segments = null;

//Exceptions
    
Format.ParsingException = function(message) {
    this.message = message;
}
Format.ParsingException.prototype.toString = function() {
    return "ParsingException: " + this.message;
}

Format.IllegalArgumentsException = function(message) {
    this.message = message;
}
Format.IllegalArgumentsException.prototype.toString = function() {
    return "IllegalArgumentsException: " + this.message;
}
    
Format.FormatException = function(message) {
    this.message = message;
}
Format.FormatException.prototype.toString = function() {
    return "FormatException: " + this.message;
}    

// Public methods

Format.prototype.format = function(object) { 
    var s = [];
        
    for (var i = 0; i < this._segments.length; i++) {
        s.push(this._segments[i].format(object));
    }
    return s.join("");
};

// Protected static methods

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
    
/** 
 * Parses the given string according to this format's pattern and returns
 * an object.
 * <p>
 * <strong>Note:</strong>
 * The default implementation of this method assumes that the sub-class
 * has implemented the <code>_createParseObject</code> method.
 */
Format.prototype.parse = function(s, pp) {
    var object = this._createParseObject();
    var index = pp || 0;
    for (var i = 0; i < this._segments.length; i++) {
        var segment = this._segments[i];
        index = segment.parse(object, s, index);
    }
        
    if (index < s.length) {
        throw new Format.ParsingException("Input too long");
    }
    return object;
};
    
/**
     * Creates the object that is initialized by parsing
     * <p>
     * <strong>Note:</strong>
     * This must be implemented by sub-classes.
     */
Format.prototype._createParseObject = function(s) {
    throw new Format.ParsingException("Not implemented");
};

//
// Segment class
//

Format.Segment = function(format, s) {
    if (arguments.length == 0) return;
    this._parent = format;
    this._s = s;
};
    
// Data

Format.Segment.prototype._parent = null;
Format.Segment.prototype._s = null;

// Public methods

Format.Segment.prototype.format = function(o) { 
    return this._s; 
};

/**
 * Parses the string at the given index, initializes the parse object
 * (as appropriate), and returns the new index within the string for
 * the next parsing step.
 * <p>
 * <strong>Note:</strong>
 * This method must be implemented by sub-classes.
 *
 * @param o     [object] The parse object to be initialized.
 * @param s     [string] The input string to be parsed.
 * @param index [number] The index within the string to start parsing.
 */
Format.Segment.prototype.parse = function(o, s, index) {
    throw new Format.ParsingException("Not implemented");
};

Format.Segment.prototype.getFormat = function() {
    return this._parent;
};

Format.Segment._parseLiteral = function(literal, s, index) {
    if (s.length - index < literal.length) {
        throw new Format.ParsingException("Input too short");
    }
    for (var i = 0; i < literal.length; i++) {
        if (literal.charAt(i) != s.charAt(index + i)) {
            throw new Format.ParsingException("Input doesn't match");
        }
    }
    return index + literal.length;
};
    
/**
 * Parses an integer at the offset of the given string and calls a
 * method on the specified object.
 *
 * @param o         [object]   The target object.
 * @param f         [function|string] The method to call on the target object.
 *                             If this parameter is a string, then it is used
 *                             as the name of the property to set on the
 *                             target object.
 * @param adjust    [number]   The numeric adjustment to make on the
 *                             value before calling the object method.
 * @param s         [string]   The string to parse.
 * @param index     [number]   The index within the string to start parsing.
 * @param fixedlen  [number]   If specified, specifies the required number
 *                             of digits to be parsed.
 * @param radix     [number]   Optional. Specifies the radix of the parse
 *                             string. Defaults to 10 if not specified.
 */
Format.Segment._parseInt = function(o, f, adjust, s, index, fixedlen, radix) {
    var len = fixedlen || s.length - index;
    var head = index;
    for (var i = 0; i < len; i++) {
        if (!s.charAt(index++).match(/\d/)) {
            index--;
            break;
        }
    }
    var tail = index;
    if (head == tail) {
        throw new Format.ParsingException("Number not present");
    }
    if (fixedlen && tail - head != fixedlen) {
        throw new Format.ParsingException("Number too short");
    }
    var value = parseInt(s.substring(head, tail), radix || 10);
    if (f) {
        var target = o || window;
        if (typeof f == "function") {
            f.call(target, value + adjust);
        }
        else {
            target[f] = value + adjust;
        }
    }
    return tail;
};

//
// Text segment class
//

Format.TextSegment = function(format, s) {
    if (arguments.length == 0) return;
    Format.Segment.call(this, format, s);
};
Format.TextSegment.prototype = new Format.Segment;
Format.TextSegment.prototype.constructor = Format.TextSegment;

Format.TextSegment.prototype.toString = function() { 
    return "text: \""+this._s+'"'; 
};
    
Format.TextSegment.prototype.parse = function(o, s, index) {
    return Format.Segment._parseLiteral(this._s, s, index);
};

if(String.prototype.trim == null) {
    String.prototype.trim = function() {
        return this.replace(/^\s+/, '').replace(/\s+$/, '');
    };
}
/**
 * Y.DateFormat provides absolute date and time formatting.
 * Applications can choose date, time, and time zone components separately. For dates, relative descriptions (English "yesterday", German "vorgestern", Japanese "後天") are also supported. 
 * This module uses a few modified parts of zimbra AjxFormat to handle dates and time.
 * 
 * Absolute formats use the default calendar specified in CLDR for each locale. Currently this means the Buddhist calendar for Thailand; the Gregorian calendar for all other countries.
 * However, you can specify other calendars using language subtags; for example, for Thai the Gregorian calendar can be specified as th-TH-u-ca-gregory. 
 * 
 * @module format-date
 * @requires format-base, timezone
 */

var MODULE_NAME = "format-date";
    
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
    Format.call(this, pattern, formats);
    this.timeZone = new Y.TimeZone(timeZoneId);
        
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
DateFormat.prototype = new Format;
DateFormat.prototype.constructor = DateFormat;

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
    Format.Segment.call(this, format, s);
}
DateFormat.DateSegment.prototype = new Format.Segment;
DateFormat.DateSegment.prototype.constructor = DateFormat.DateSegment;

//
// Date era segment class
//

DateFormat.EraSegment = function(format, s) {
    if (arguments.length == 0) return;
    DateFormat.DateSegment.call(this, format, s);
};
DateFormat.EraSegment.prototype = new DateFormat.DateSegment;
DateFormat.EraSegment.prototype.constructor = DateFormat.EraSegment;

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
    DateFormat.DateSegment.call(this, format, s);
};
DateFormat.YearSegment.prototype = new DateFormat.DateSegment;
DateFormat.YearSegment.prototype.constructor = DateFormat.YearSegment;

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
    DateFormat.DateSegment.call(this, format, s);
    this.initialize();
};
DateFormat.MonthSegment.prototype = new DateFormat.DateSegment;
DateFormat.MonthSegment.prototype.constructor = DateFormat.MonthSegment;

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
    DateFormat.DateSegment.call(this, format, s);
};
DateFormat.WeekSegment.prototype = new DateFormat.DateSegment;
DateFormat.WeekSegment.prototype.constructor = DateFormat.WeekSegment;

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
    DateFormat.DateSegment.call(this, format, s);
};
DateFormat.DaySegment.prototype = new DateFormat.DateSegment;
DateFormat.DaySegment.prototype.constructor = DateFormat.DaySegment;

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
    DateFormat.DateSegment.call(this, format, s);
    this.initialize();
};
DateFormat.WeekdaySegment.prototype = new DateFormat.DateSegment;
DateFormat.WeekdaySegment.prototype.constructor = DateFormat.WeekdaySegment;

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
    Format.Segment.call(this, format, s);
};
DateFormat.TimeSegment.prototype = new Format.Segment;
DateFormat.TimeSegment.prototype.constructor = DateFormat.TimeSegment;

//
// Time hour segment class
//

DateFormat.HourSegment = function(format, s) {
    if (arguments.length == 0) return;
    Format.Segment.call(this, format, s);
};
DateFormat.HourSegment.prototype = new DateFormat.TimeSegment;
DateFormat.HourSegment.prototype.constructor = DateFormat.HourSegment;

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
    Format.Segment.call(this, format, s);
};
DateFormat.MinuteSegment.prototype = new DateFormat.TimeSegment;
DateFormat.MinuteSegment.prototype.constructor = DateFormat.MinuteSegment;

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
    Format.Segment.call(this, format, s);
};
DateFormat.SecondSegment.prototype = new DateFormat.TimeSegment;
DateFormat.SecondSegment.prototype.constructor = DateFormat.SecondSegment;

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
    Format.Segment.call(this, format, s);
};
DateFormat.AmPmSegment.prototype = new DateFormat.TimeSegment;
DateFormat.AmPmSegment.prototype.constructor = DateFormat.AmPmSegment;

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
    Format.Segment.call(this, format, s);
};
DateFormat.TimezoneSegment.prototype = new DateFormat.TimeSegment;
DateFormat.TimezoneSegment.prototype.constructor = DateFormat.TimezoneSegment;

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
    DateFormat.call(this, pattern, formats, timeZoneId, locale);
        
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
    
BuddhistDateFormat.prototype = new DateFormat;
BuddhistDateFormat.prototype.constructor = BuddhistDateFormat;
    
//Override YearSegment class for Buddhist Calender
BuddhistDateFormat.YearSegment = function(segment) {
    if (arguments.length == 0) return;
    DateFormat.YearSegment.call(this, segment._parent, segment._s);
};
    
BuddhistDateFormat.YearSegment.prototype = new DateFormat.YearSegment;
BuddhistDateFormat.YearSegment.prototype.constructor = BuddhistDateFormat.YearSegment;

BuddhistDateFormat.YearSegment.prototype.format = function(date) { 
    var year = date.getFullYear();
    year = String(year + 543);      //Buddhist Calendar epoch is in 543 BC
    return this._s.length != 1 && this._s.length < 4 ? year.substr(year.length - 2) : zeroPad(year, this._s.length);
};
    
//Override EraSegment class for Buddhist Calender
BuddhistDateFormat.EraSegment = function(segment) {
    if (arguments.length == 0) return;
    DateFormat.EraSegment.call(this, segment._parent, segment._s);
};
    
BuddhistDateFormat.EraSegment.prototype = new DateFormat.EraSegment;
BuddhistDateFormat.EraSegment.prototype.constructor = BuddhistDateFormat.EraSegment;

BuddhistDateFormat.EraSegment.prototype.format = function(date) { 
    return "BE";    //Only Buddhist Era supported for now
};
        
//
// Start YUI code
//
    
/**
 * @class Y.DateFormat
 * @constructor
 * @param {String} timeZone (Optional) TZ database ID for the time zone that should be used. If no argument is provided, "Etc/GMT" is used. If an argument is provided that is not a valid time zone identifier, an Error exception is thrown.
 * @param {Number} dateFormat (Optional) Selector for the desired date format from Y.DateFormat.DATE_FORMATS. If no argument is provided, NONE is assumed. If an argument is provided that's not a valid selector, an Error exception is thrown. 
 * @param {Number} timeFormat (Optional) Selector for the desired time format from Y.DateFormat.TIME_FORMATS. If no argument is provided, NONE is assumed. If an argument is provided that's not a valid selector, an Error exception is thrown. 
 * @param {Number} timeZoneFormat (Optional) Selector for the desired time zone format from Y.DateFormat.TIMEZONE_FORMATS. If no argument is provided, NONE is assumed. If an argument is provided that's not a valid selector, an Error exception is thrown. 
 */
Y.DateFormat = function(timeZone, dateFormat, timeFormat, timeZoneFormat) {
        
    if(timeZone == null) {
        timeZone = "Etc/GMT";
    }

    this._Formats = Y.Intl.get(MODULE_NAME);
        
    //If not valid time zone
    if(!Y.TimeZone.isValidTimezoneId(timeZone)) {
        throw new Y.TimeZone.UnknownTimeZoneException("Could not find timezone: " + timeZone);
    }

    this._timeZone = timeZone;
    this._timeZoneInstance = new Y.TimeZone(this._timeZone);

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

//Selector values
Y.DateFormat.DATE_FORMATS = {
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
}

Y.DateFormat.TIME_FORMATS = {
    NONE: 0,
    HM_ABBREVIATED: 1,
    HM_SHORT: 2,
    H_ABBREVIATED: 4
}

Y.DateFormat.TIMEZONE_FORMATS = {
    NONE: 0,
    Z_ABBREVIATED: 1,
    Z_SHORT: 2
}

//Static methods

/**
 * Returns an array of BCP 47 language tags for the languages supported by this class
 * @return {Array} an array of BCP 47 language tags for the languages supported by this class.
 */
Y.DateFormat.availableLanguages = function() {
    return Y.Intl.getAvailableLangs(MODULE_NAME);
}

//Private methods

/**
 * Generate date pattern for selected format
 * @return {String} Date pattern for internal use.
 */
Y.DateFormat.prototype._generateDatePattern = function() {
    var format = this._dateFormat;
    if(format == null) return "";
    if(format & Y.DateFormat.DATE_FORMATS.RELATIVE_DATE) {
        this._relative = true;
        format = format ^ Y.DateFormat.DATE_FORMATS.RELATIVE_DATE;
    }
    switch(format) {
        //Use relative only for formats with day component
        case Y.DateFormat.DATE_FORMATS.NONE:
            this._relative = false;
            return "";
        case Y.DateFormat.DATE_FORMATS.WYMD_LONG:
            return this._Formats.WYMD_long;
        case Y.DateFormat.DATE_FORMATS.WYMD_ABBREVIATED:
            return this._Formats.WYMD_abbreviated;
        case Y.DateFormat.DATE_FORMATS.WYMD_SHORT:
            return this._Formats.WYMD_short;
        case Y.DateFormat.DATE_FORMATS.WMD_LONG:
            return this._Formats.WMD_long;
        case Y.DateFormat.DATE_FORMATS.WMD_ABBREVIATED:
            return this._Formats.WMD_abbreviated;
        case Y.DateFormat.DATE_FORMATS.WMD_SHORT:
            return this._Formats.WMD_short;
        case Y.DateFormat.DATE_FORMATS.YMD_LONG:
            return this._Formats.YMD_long;
        case Y.DateFormat.DATE_FORMATS.YMD_ABBREVIATED:
            return this._Formats.YMD_abbreviated;
        case Y.DateFormat.DATE_FORMATS.YMD_SHORT:
            return this._Formats.YMD_short;
        case Y.DateFormat.DATE_FORMATS.YM_LONG:
            this._relative = false;
            return this._Formats.YM_long;
        case Y.DateFormat.DATE_FORMATS.MD_LONG:
            return this._Formats.MD_long;
        case Y.DateFormat.DATE_FORMATS.MD_ABBREVIATED:
            return this._Formats.MD_abbreviated;
        case Y.DateFormat.DATE_FORMATS.MD_SHORT:
            return this._Formats.MD_short;
        case Y.DateFormat.DATE_FORMATS.W_LONG:
            this._relative = false;
            return this._Formats.W_long;
        case Y.DateFormat.DATE_FORMATS.W_ABBREVIATED:
            this._relative = false;
            return this._Formats.W_abbreviated;
        case Y.DateFormat.DATE_FORMATS.M_LONG:
            this._relative = false;
            return this._Formats.M_long;
        case Y.DateFormat.DATE_FORMATS.M_ABBREVIATED:
            this._relative = false;
            return this._Formats.M_abbreviated;
        case Y.DateFormat.DATE_FORMATS.YMD_FULL:
            return this._Formats.YMD_full;
        default:
            throw new Format.IllegalArgumentsException("Date format given does not exist");	//Error no such pattern.
    }
}
    
/**
 * Generate time pattern for selected format
 * @return {String} Time pattern for internal use.
 */
Y.DateFormat.prototype._generateTimePattern = function() {
    var format = this._timeFormat;
    if(format == null) return "";
    switch(format) {
        case Y.DateFormat.TIME_FORMATS.NONE:
            return "";
        case Y.DateFormat.TIME_FORMATS.HM_ABBREVIATED:
            return this._Formats.HM_abbreviated;
        case Y.DateFormat.TIME_FORMATS.HM_SHORT:
            return this._Formats.HM_short;
        case Y.DateFormat.TIME_FORMATS.H_ABBREVIATED:
            return this._Formats.H_abbreviated;
        default:
            throw new Format.IllegalArgumentsException("Time format given does not exist");	//Error no such pattern.
    }
}
    
/**
 * Generate time-zone pattern for selected format
 * @return {String} Time-Zone pattern for internal use.
 */
Y.DateFormat.prototype._generateTimeZonePattern = function() {
    var format = this._timeZoneFormat;
    if(format == null) return "";
    switch(format) {
        case Y.DateFormat.TIMEZONE_FORMATS.NONE:
            return "";
        case Y.DateFormat.TIMEZONE_FORMATS.Z_ABBREVIATED:
            return "z";
        case Y.DateFormat.TIMEZONE_FORMATS.Z_SHORT:
            return "Z";
        default:
            throw new Format.IllegalArgumentsException("Time Zone format given does not exist");	//Error no such pattern.
    }
}
    
/**
 * Generate pattern for selected date, time and time-zone formats
 * @return {String} Combined pattern for date, time and time-zone for internal use.
 */
Y.DateFormat.prototype._generatePattern = function() {
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
Y.DateFormat.prototype.format = function(date) {
    if(date == null) {
        throw new Y.DateFormat.IllegalArgumentsException("No date provided.");
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


}, '@VERSION@', {"lang": ["af-NA", "af", "af-ZA", "am-ET", "am", "ar-AE", "ar-BH", "ar-DZ", "ar-EG", "ar-IQ", "ar-JO", "ar-KW", "ar-LB", "ar-LY", "ar-MA", "ar-OM", "ar-QA", "ar-SA", "ar-SD", "ar-SY", "ar-TN", "ar", "ar-YE", "as-IN", "as", "az-AZ", "az-Cyrl-AZ", "az-Cyrl", "az-Latn-AZ", "az-Latn", "az", "be-BY", "be", "bg-BG", "bg", "bn-BD", "bn-IN", "bn", "bo-CN", "bo-IN", "bo", "ca-ES", "ca", "cs-CZ", "cs", "cy-GB", "cy", "da-DK", "da", "de-AT", "de-BE", "de-CH", "de-DE", "de-LI", "de-LU", "de", "el-CY", "el-GR", "el", "en-AU", "en-BE", "en-BW", "en-BZ", "en-CA", "en-GB", "en-HK", "en-IE", "en-IN", "en-JM", "en-JO", "en-MH", "en-MT", "en-MY", "en-NA", "en-NZ", "en-PH", "en-PK", "en-RH", "en-SG", "en-TT", "en", "en-US-POSIX", "en-US", "en-VI", "en-ZA", "en-ZW", "eo", "es-AR", "es-BO", "es-CL", "es-CO", "es-CR", "es-DO", "es-EC", "es-ES", "es-GT", "es-HN", "es-MX", "es-NI", "es-PA", "es-PE", "es-PR", "es-PY", "es-SV", "es", "es-US", "es-UY", "es-VE", "et-EE", "et", "eu-ES", "eu", "fa-AF", "fa-IR", "fa", "fi-FI", "fi", "fil-PH", "fil", "fo-FO", "fo", "fr-BE", "fr-CA", "fr-CH", "fr-FR", "fr-LU", "fr-MC", "fr-SN", "fr", "ga-IE", "ga", "gl-ES", "gl", "gsw-CH", "gsw", "gu-IN", "gu", "gv-GB", "gv", "ha-GH", "ha-Latn-GH", "ha-Latn-NE", "ha-Latn-NG", "ha-Latn", "ha-NE", "ha-NG", "ha", "haw", "haw-US", "he-IL", "he", "hi-IN", "hi", "hr-HR", "hr", "hu-HU", "hu", "hy-AM-REVISED", "hy-AM", "hy", "id-ID", "id", "ii-CN", "ii", "in-ID", "in", "is-IS", "is", "it-CH", "it-IT", "it", "iw-IL", "iw", "ja-JP-TRADITIONAL", "ja-JP", "ja", "ka-GE", "ka", "kk-Cyrl-KZ", "kk-Cyrl", "kk-KZ", "kk", "kl-GL", "kl", "km-KH", "km", "kn-IN", "kn", "kok-IN", "kok", "ko-KR", "ko", "kw-GB", "kw", "lt-LT", "lt", "lv-LV", "lv", "mk-MK", "mk", "ml-IN", "ml", "mr-IN", "mr", "ms-BN", "ms-MY", "ms", "mt-MT", "mt", "nb-NO", "nb", "ne-IN", "ne-NP", "ne", "nl-BE", "nl-NL", "nl", "nn-NO", "nn", "no-NO-NY", "no-NO", "no", "om-ET", "om-KE", "om", "or-IN", "or", "pa-Arab-PK", "pa-Arab", "pa-Guru-IN", "pa-Guru", "pa-IN", "pa-PK", "pa", "pl-PL", "pl", "ps-AF", "ps", "pt-BR", "pt-PT", "pt", "ro-MD", "ro-RO", "ro", "ru-RU", "ru", "ru-UA", "sh-BA", "sh-CS", "sh", "sh-YU", "si-LK", "si", "sk-SK", "sk", "sl-SI", "sl", "so-DJ", "so-ET", "so-KE", "so-SO", "so", "sq-AL", "sq", "sr-BA", "sr-CS", "sr-Cyrl-BA", "sr-Cyrl-CS", "sr-Cyrl-ME", "sr-Cyrl-RS", "sr-Cyrl", "sr-Cyrl-YU", "sr-Latn-BA", "sr-Latn-CS", "sr-Latn-ME", "sr-Latn-RS", "sr-Latn", "sr-Latn-YU", "sr-ME", "sr-RS", "sr", "sr-YU", "sv-FI", "sv-SE", "sv", "sw-KE", "sw", "sw-TZ", "ta-IN", "ta", "te-IN", "te", "th-TH-TRADITIONAL", "th-TH", "th", "ti-ER", "ti-ET", "ti", "tl-PH", "tl", "tr-TR", "tr", "uk", "uk-UA", "ur-IN", "ur-PK", "ur", "uz-AF", "uz-Arab-AF", "uz-Arab", "uz-Cyrl", "uz-Cyrl-UZ", "uz-Latn", "uz-Latn-UZ", "uz", "uz-UZ", "vi", "vi-VN", "zh-CN", "zh-Hans-CN", "zh-Hans-HK", "zh-Hans-MO", "zh-Hans-SG", "zh-Hans", "zh-Hant-HK", "zh-Hant-MO", "zh-Hant-TW", "zh-Hant", "zh-HK", "zh-MO", "zh-SG", "zh-TW", "zh", "zu", "zu-ZA"], "requires": ["timezone"]});
