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
_yuitest_coverage["build/format-date/format-date.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/format-date/format-date.js",
    code: []
};
_yuitest_coverage["build/format-date/format-date.js"].code=["YUI.add('format-date', function (Y, NAME) {","","/*"," * Copyright 2012 Yahoo! Inc. All Rights Reserved. Based on code owned by VMWare, Inc. "," */","","//","// Format class","//","","/**"," * Base class for all formats. To format an object, instantiate the"," * format of your choice and call the <code>format</code> method which"," * returns the formatted string."," */","Format = function(pattern, formats) {","    if (arguments.length == 0) {","        return;","    }","    this._pattern = pattern;","    this._segments = []; ","    this.Formats = formats; ","}","","// Data","","Format.prototype._pattern = null;","Format.prototype._segments = null;","","//Exceptions","    ","Format.ParsingException = function(message) {","    this.message = message;","}","Format.ParsingException.prototype.toString = function() {","    return \"ParsingException: \" + this.message;","}","","Format.IllegalArgumentsException = function(message) {","    this.message = message;","}","Format.IllegalArgumentsException.prototype.toString = function() {","    return \"IllegalArgumentsException: \" + this.message;","}","    ","Format.FormatException = function(message) {","    this.message = message;","}","Format.FormatException.prototype.toString = function() {","    return \"FormatException: \" + this.message;","}    ","","// Public methods","","Format.prototype.format = function(object) { ","    var s = [];","        ","    for (var i = 0; i < this._segments.length; i++) {","        s.push(this._segments[i].format(object));","    }","    return s.join(\"\");","};","","// Protected static methods","","function zeroPad (s, length, zeroChar, rightSide) {","    s = typeof s == \"string\" ? s : String(s);","","    if (s.length >= length) return s;","","    zeroChar = zeroChar || '0';","	","    var a = [];","    for (var i = s.length; i < length; i++) {","        a.push(zeroChar);","    }","    a[rightSide ? \"unshift\" : \"push\"](s);","","    return a.join(\"\");","}","    ","/** "," * Parses the given string according to this format's pattern and returns"," * an object."," * <p>"," * <strong>Note:</strong>"," * The default implementation of this method assumes that the sub-class"," * has implemented the <code>_createParseObject</code> method."," */","Format.prototype.parse = function(s, pp) {","    var object = this._createParseObject();","    var index = pp || 0;","    for (var i = 0; i < this._segments.length; i++) {","        var segment = this._segments[i];","        index = segment.parse(object, s, index);","    }","        ","    if (index < s.length) {","        throw new Format.ParsingException(\"Input too long\");","    }","    return object;","};","    ","/**","     * Creates the object that is initialized by parsing","     * <p>","     * <strong>Note:</strong>","     * This must be implemented by sub-classes.","     */","Format.prototype._createParseObject = function(s) {","    throw new Format.ParsingException(\"Not implemented\");","};","","//","// Segment class","//","","Format.Segment = function(format, s) {","    if (arguments.length == 0) return;","    this._parent = format;","    this._s = s;","};","    ","// Data","","Format.Segment.prototype._parent = null;","Format.Segment.prototype._s = null;","","// Public methods","","Format.Segment.prototype.format = function(o) { ","    return this._s; ","};","","/**"," * Parses the string at the given index, initializes the parse object"," * (as appropriate), and returns the new index within the string for"," * the next parsing step."," * <p>"," * <strong>Note:</strong>"," * This method must be implemented by sub-classes."," *"," * @param o     [object] The parse object to be initialized."," * @param s     [string] The input string to be parsed."," * @param index [number] The index within the string to start parsing."," */","Format.Segment.prototype.parse = function(o, s, index) {","    throw new Format.ParsingException(\"Not implemented\");","};","","Format.Segment.prototype.getFormat = function() {","    return this._parent;","};","","Format.Segment._parseLiteral = function(literal, s, index) {","    if (s.length - index < literal.length) {","        throw new Format.ParsingException(\"Input too short\");","    }","    for (var i = 0; i < literal.length; i++) {","        if (literal.charAt(i) != s.charAt(index + i)) {","            throw new Format.ParsingException(\"Input doesn't match\");","        }","    }","    return index + literal.length;","};","    ","/**"," * Parses an integer at the offset of the given string and calls a"," * method on the specified object."," *"," * @param o         [object]   The target object."," * @param f         [function|string] The method to call on the target object."," *                             If this parameter is a string, then it is used"," *                             as the name of the property to set on the"," *                             target object."," * @param adjust    [number]   The numeric adjustment to make on the"," *                             value before calling the object method."," * @param s         [string]   The string to parse."," * @param index     [number]   The index within the string to start parsing."," * @param fixedlen  [number]   If specified, specifies the required number"," *                             of digits to be parsed."," * @param radix     [number]   Optional. Specifies the radix of the parse"," *                             string. Defaults to 10 if not specified."," */","Format.Segment._parseInt = function(o, f, adjust, s, index, fixedlen, radix) {","    var len = fixedlen || s.length - index;","    var head = index;","    for (var i = 0; i < len; i++) {","        if (!s.charAt(index++).match(/\\d/)) {","            index--;","            break;","        }","    }","    var tail = index;","    if (head == tail) {","        throw new Format.ParsingException(\"Number not present\");","    }","    if (fixedlen && tail - head != fixedlen) {","        throw new Format.ParsingException(\"Number too short\");","    }","    var value = parseInt(s.substring(head, tail), radix || 10);","    if (f) {","        var target = o || window;","        if (typeof f == \"function\") {","            f.call(target, value + adjust);","        }","        else {","            target[f] = value + adjust;","        }","    }","    return tail;","};","","//","// Text segment class","//","","Format.TextSegment = function(format, s) {","    if (arguments.length == 0) return;","    Format.Segment.call(this, format, s);","};","Format.TextSegment.prototype = new Format.Segment;","Format.TextSegment.prototype.constructor = Format.TextSegment;","","Format.TextSegment.prototype.toString = function() { ","    return \"text: \\\"\"+this._s+'\"'; ","};","    ","Format.TextSegment.prototype.parse = function(o, s, index) {","    return Format.Segment._parseLiteral(this._s, s, index);","};","","if(String.prototype.trim == null) {","    String.prototype.trim = function() {","        return this.replace(/^\\s+/, '').replace(/\\s+$/, '');","    };","}","/**"," * Y.DateFormat provides absolute date and time formatting."," * Applications can choose date, time, and time zone components separately. For dates, relative descriptions (English \"yesterday\", German \"vorgestern\", Japanese \"後天\") are also supported. "," * This module uses a few modified parts of zimbra AjxFormat to handle dates and time."," * "," * Absolute formats use the default calendar specified in CLDR for each locale. Currently this means the Buddhist calendar for Thailand; the Gregorian calendar for all other countries."," * However, you can specify other calendars using language subtags; for example, for Thai the Gregorian calendar can be specified as th-TH-u-ca-gregory. "," * "," * @module format-date"," * @requires format-base, timezone"," */","","var MODULE_NAME = \"format-date\";","    ","//","// Resources","//","ShortNames = {","    \"weekdayMonShort\":\"M\",","    \"weekdayTueShort\":\"T\",","    \"weekdayWedShort\":\"W\",","    \"weekdayThuShort\":\"T\",","    \"weekdayFriShort\":\"F\",","    \"weekdaySatShort\":\"S\",","    \"weekdaySunShort\":\"S\",","    \"monthJanShort\":\"J\",","    \"monthFebShort\":\"F\",","    \"monthMarShort\":\"M\",","    \"monthAprShort\":\"A\",","    \"monthMayShort\":\"M\",","    \"monthJunShort\":\"J\",","    \"monthJulShort\":\"J\",","    \"monthAugShort\":\"A\",","    \"monthSepShort\":\"S\",","    \"monthOctShort\":\"O\",","    \"monthNovShort\":\"N\",","    \"monthDecShort\":\"D\"","}","    ","//","// Date format class","//","","/**"," * The DateFormat class formats Date objects according to a specified "," * pattern. The patterns are defined the same as the SimpleDateFormat"," * class in the Java libraries."," * <p>"," * <strong>Note:</strong>"," * The date format differs from the Java patterns a few ways: the pattern"," * \"EEEEE\" (5 'E's) denotes a <em>short</em> weekday and the pattern \"MMMMM\""," * (5 'M's) denotes a <em>short</em> month name. This matches the extended "," * pattern found in the Common Locale Data Repository (CLDR) found at: "," * http://www.unicode.org/cldr/."," */","DateFormat = function(pattern, formats, timeZoneId) {","    if (arguments.length == 0) {","        return;","    }","    Format.call(this, pattern, formats);","    this.timeZone = new Y.TimeZone(timeZoneId);","        ","    if (pattern == null) {","        return;","    }","    var head, tail, segment;","    for (var i = 0; i < pattern.length; i++) {","        // literal","        var c = pattern.charAt(i);","        if (c == \"'\") {","            head = i + 1;","            for (i++ ; i < pattern.length; i++) {","                c = pattern.charAt(i);","                if (c == \"'\") {","                    if (i + 1 < pattern.length && pattern.charAt(i + 1) == \"'\") {","                        pattern = pattern.substr(0, i) + pattern.substr(i + 1);","                    }","                    else {","                        break;","                    }","                }","            }","            if (i == pattern.length) {","                throw new Format.FormatException(\"unterminated string literal\");","            }","            tail = i;","            segment = new Format.TextSegment(this, pattern.substring(head, tail));","            this._segments.push(segment);","            continue;","        }","","        // non-meta chars","        head = i;","        while(i < pattern.length) {","            c = pattern.charAt(i);","            if (DateFormat._META_CHARS.indexOf(c) != -1 || c == \"'\") {","                break;","            }","            i++;","        }","        tail = i;","        if (head != tail) {","            segment = new Format.TextSegment(this, pattern.substring(head, tail));","            this._segments.push(segment);","            i--;","            continue;","        }","		","        // meta char","        head = i;","        while(++i < pattern.length) {","            if (pattern.charAt(i) != c) {","                break;","            }		","        }","        tail = i--;","        var count = tail - head;","        var field = pattern.substr(head, count);","        segment = null;","        switch (c) {","            case 'G':","                segment = new DateFormat.EraSegment(this, field);","                break;","            case 'y':","                segment = new DateFormat.YearSegment(this, field);","                break;","            case 'M':","                segment = new DateFormat.MonthSegment(this, field);","                break;","            case 'w':","            case 'W':","                segment = new DateFormat.WeekSegment(this, field);","                break;","            case 'D':","            case 'd':","                segment = new DateFormat.DaySegment(this, field);","                break;","            case 'F':","            case 'E':","                segment = new DateFormat.WeekdaySegment(this, field);","                break;","            case 'a':","                segment = new DateFormat.AmPmSegment(this, field);","                break;","            case 'H':","            case 'k':","            case 'K':","            case 'h':","                segment = new DateFormat.HourSegment(this, field);","                break;","            case 'm':","                segment = new DateFormat.MinuteSegment(this, field);","                break;","            case 's':","            case 'S':","                segment = new DateFormat.SecondSegment(this, field);","                break;","            case 'z':","            case 'Z':","                segment = new DateFormat.TimezoneSegment(this, field);","                break;","        }","        if (segment != null) {","            segment._index = this._segments.length;","            this._segments.push(segment);","        }","    }","}","DateFormat.prototype = new Format;","DateFormat.prototype.constructor = DateFormat;","","// Constants","","DateFormat.SHORT = 0;","DateFormat.MEDIUM = 1;","DateFormat.LONG = 2;","DateFormat.DEFAULT = DateFormat.MEDIUM;","","DateFormat._META_CHARS = \"GyMwWDdFEaHkKhmsSzZ\";","","DateFormat.prototype.format = function(object, relative) {","    var useRelative = false;","    if(relative != null && relative != \"\") {","        useRelative = true;","    }","","    var s = [];","    var datePattern = false;","    for (var i = 0; i < this._segments.length; i++) {","        //Mark datePattern sections in case of relative dates","        if(this._segments[i].toString().indexOf(\"text: \\\"<datePattern>\\\"\") == 0) {","            if(useRelative) {","                s.push(relative);","            }","            datePattern = true;","            continue;","        }","        if(this._segments[i].toString().indexOf(\"text: \\\"</datePattern>\\\"\") == 0) {","            datePattern = false;","            continue;","        }","        if(!datePattern || !useRelative) {","            s.push(this._segments[i].format(object));","        }","    }","    return s.join(\"\");","}","","//","// Date segment class","//","","DateFormat.DateSegment = function(format, s) {","    if (arguments.length == 0) return;","    Format.Segment.call(this, format, s);","}","DateFormat.DateSegment.prototype = new Format.Segment;","DateFormat.DateSegment.prototype.constructor = DateFormat.DateSegment;","","//","// Date era segment class","//","","DateFormat.EraSegment = function(format, s) {","    if (arguments.length == 0) return;","    DateFormat.DateSegment.call(this, format, s);","};","DateFormat.EraSegment.prototype = new DateFormat.DateSegment;","DateFormat.EraSegment.prototype.constructor = DateFormat.EraSegment;","","// Public methods","","DateFormat.EraSegment.prototype.format = function(date) { ","    // NOTE: Only support current era at the moment...","    return this.getFormat().AD;","};","","//","// Date year segment class","//","","DateFormat.YearSegment = function(format, s) {","    if (arguments.length == 0) return;","    DateFormat.DateSegment.call(this, format, s);","};","DateFormat.YearSegment.prototype = new DateFormat.DateSegment;","DateFormat.YearSegment.prototype.constructor = DateFormat.YearSegment;","","DateFormat.YearSegment.prototype.toString = function() { ","    return \"dateYear: \\\"\"+this._s+'\"'; ","};","","// Public methods","","DateFormat.YearSegment.prototype.format = function(date) { ","    var year = String(date.getFullYear());","    return this._s.length != 1 && this._s.length < 4 ? year.substr(year.length - 2) : zeroPad(year, this._s.length);","};","","//","// Date month segment class","//","","DateFormat.MonthSegment = function(format, s) {","    if (arguments.length == 0) return;","    DateFormat.DateSegment.call(this, format, s);","    this.initialize();","};","DateFormat.MonthSegment.prototype = new DateFormat.DateSegment;","DateFormat.MonthSegment.prototype.constructor = DateFormat.MonthSegment;","","DateFormat.MonthSegment.prototype.toString = function() { ","    return \"dateMonth: \\\"\"+this._s+'\"'; ","};","","DateFormat.MonthSegment.prototype.initialize = function() {","    DateFormat.MonthSegment.MONTHS = {};","    DateFormat.MonthSegment.MONTHS[DateFormat.SHORT] = [","    ShortNames.monthJanShort,ShortNames.monthFebShort,ShortNames.monthMarShort,","    ShortNames.monthAprShort,ShortNames.monthMayShort,ShortNames.monthJunShort,","    ShortNames.monthJulShort,ShortNames.monthAugShort,ShortNames.monthSepShort,","    ShortNames.monthOctShort,ShortNames.monthNovShort,ShortNames.monthDecShort","    ];","    DateFormat.MonthSegment.MONTHS[DateFormat.MEDIUM] = [","    this.getFormat().Formats.monthJanMedium, this.getFormat().Formats.monthFebMedium, this.getFormat().Formats.monthMarMedium,","    this.getFormat().Formats.monthAprMedium, this.getFormat().Formats.monthMayMedium, this.getFormat().Formats.monthJunMedium,","    this.getFormat().Formats.monthJulMedium, this.getFormat().Formats.monthAugMedium, this.getFormat().Formats.monthSepMedium,","    this.getFormat().Formats.monthOctMedium, this.getFormat().Formats.monthNovMedium, this.getFormat().Formats.monthDecMedium","    ];","    DateFormat.MonthSegment.MONTHS[DateFormat.LONG] = [","    this.getFormat().Formats.monthJanLong, this.getFormat().Formats.monthFebLong, this.getFormat().Formats.monthMarLong,","    this.getFormat().Formats.monthAprLong, this.getFormat().Formats.monthMayLong, this.getFormat().Formats.monthJunLong,","    this.getFormat().Formats.monthJulLong, this.getFormat().Formats.monthAugLong, this.getFormat().Formats.monthSepLong,","    this.getFormat().Formats.monthOctLong, this.getFormat().Formats.monthNovLong, this.getFormat().Formats.monthDecLong","    ];","};","","// Public methods","","DateFormat.MonthSegment.prototype.format = function(date) {","    var month = date.getMonth();","    switch (this._s.length) {","        case 1:","            return String(month + 1);","        case 2:","            return zeroPad(month + 1, 2);","        case 3:","            return DateFormat.MonthSegment.MONTHS[DateFormat.MEDIUM][month];","        case 5:","            return DateFormat.MonthSegment.MONTHS[DateFormat.SHORT][month];","    }","    return DateFormat.MonthSegment.MONTHS[DateFormat.LONG][month];","};","","//","// Date week segment class","//","","DateFormat.WeekSegment = function(format, s) {","    if (arguments.length == 0) return;","    DateFormat.DateSegment.call(this, format, s);","};","DateFormat.WeekSegment.prototype = new DateFormat.DateSegment;","DateFormat.WeekSegment.prototype.constructor = DateFormat.WeekSegment;","","// Public methods","","DateFormat.WeekSegment.prototype.format = function(date) {","    var year = date.getYear();","    var month = date.getMonth();","    var day = date.getDate();","	","    var ofYear = /w/.test(this._s);","    var date2 = new Date(year, ofYear ? 0 : month, 1);","","    var week = 0;","    while (true) {","        week++;","        if (date2.getMonth() > month || (date2.getMonth() == month && date2.getDate() >= day)) {","            break;","        }","        date2.setDate(date2.getDate() + 7);","    }","","    return zeroPad(week, this._s.length);","};","","//","// Date day segment class","//","","DateFormat.DaySegment = function(format, s) {","    if (arguments.length == 0) return;","    DateFormat.DateSegment.call(this, format, s);","};","DateFormat.DaySegment.prototype = new DateFormat.DateSegment;","DateFormat.DaySegment.prototype.constructor = DateFormat.DaySegment;","","// Public methods","","DateFormat.DaySegment.prototype.format = function(date) {","    var month = date.getMonth();","    var day = date.getDate();","    if (/D/.test(this._s) && month > 0) {","        var year = date.getYear();","        do {","            // set date to first day of month and then go back one day","            var date2 = new Date(year, month, 1);","            date2.setDate(0); ","			","            day += date2.getDate();","            month--;","        } while (month > 0);","    }","    return zeroPad(day, this._s.length);","};","","//","// Date weekday segment class","//","","DateFormat.WeekdaySegment = function(format, s) {","    if (arguments.length == 0) return;","    DateFormat.DateSegment.call(this, format, s);","    this.initialize();","};","DateFormat.WeekdaySegment.prototype = new DateFormat.DateSegment;","DateFormat.WeekdaySegment.prototype.constructor = DateFormat.WeekdaySegment;","","DateFormat.DaySegment.prototype.toString = function() { ","    return \"dateDay: \\\"\"+this._s+'\"'; ","};","","DateFormat.WeekdaySegment.prototype.initialize = function() {","    DateFormat.WeekdaySegment.WEEKDAYS = {};","    // NOTE: The short names aren't available in Java so we have to define them.","    DateFormat.WeekdaySegment.WEEKDAYS[DateFormat.SHORT] = [","    ShortNames.weekdaySunShort,ShortNames.weekdayMonShort,ShortNames.weekdayTueShort,","    ShortNames.weekdayWedShort,ShortNames.weekdayThuShort,ShortNames.weekdayFriShort,","    ShortNames.weekdaySatShort","    ];","    DateFormat.WeekdaySegment.WEEKDAYS[DateFormat.MEDIUM] = [","    this.getFormat().Formats.weekdaySunMedium, this.getFormat().Formats.weekdayMonMedium, this.getFormat().Formats.weekdayTueMedium,","    this.getFormat().Formats.weekdayWedMedium, this.getFormat().Formats.weekdayThuMedium, this.getFormat().Formats.weekdayFriMedium,","    this.getFormat().Formats.weekdaySatMedium","    ];","    DateFormat.WeekdaySegment.WEEKDAYS[DateFormat.LONG] = [","    this.getFormat().Formats.weekdaySunLong, this.getFormat().Formats.weekdayMonLong, this.getFormat().Formats.weekdayTueLong,","    this.getFormat().Formats.weekdayWedLong, this.getFormat().Formats.weekdayThuLong, this.getFormat().Formats.weekdayFriLong,","    this.getFormat().Formats.weekdaySatLong","    ];","};","","// Public methods","","DateFormat.WeekdaySegment.prototype.format = function(date) {","    var weekday = date.getDay();","    if (/E/.test(this._s)) {","        var style;","        switch (this._s.length) {","            case 4:","                style = DateFormat.LONG;","                break;","            case 5:","                style = DateFormat.SHORT;","                break;","            default:","                style = DateFormat.MEDIUM;","        }","        return DateFormat.WeekdaySegment.WEEKDAYS[style][weekday];","    }","    return zeroPad(weekday, this._s.length);","};","","//","// Time segment class","//","","DateFormat.TimeSegment = function(format, s) {","    if (arguments.length == 0) return;","    Format.Segment.call(this, format, s);","};","DateFormat.TimeSegment.prototype = new Format.Segment;","DateFormat.TimeSegment.prototype.constructor = DateFormat.TimeSegment;","","//","// Time hour segment class","//","","DateFormat.HourSegment = function(format, s) {","    if (arguments.length == 0) return;","    Format.Segment.call(this, format, s);","};","DateFormat.HourSegment.prototype = new DateFormat.TimeSegment;","DateFormat.HourSegment.prototype.constructor = DateFormat.HourSegment;","","DateFormat.HourSegment.prototype.toString = function() { ","    return \"timeHour: \\\"\"+this._s+'\"'; ","};","","// Public methods","","DateFormat.HourSegment.prototype.format = function(date) {","    var hours = date.getHours();","    if (hours > 12 && /[hK]/.test(this._s)) {","        hours -= 12;","    }","    else if (hours == 0 && /[h]/.test(this._s)) {","        hours = 12;","    }","    /***","	// NOTE: This is commented out to match the Java formatter output","	//       but from the comments for these meta-chars, it doesn't","	//       seem right.","	if (/[Hk]/.test(this._s)) {","		hours--;","	}","    /***/","    return zeroPad(hours, this._s.length);","};","","//","// Time minute segment class","//","","DateFormat.MinuteSegment = function(format, s) {","    if (arguments.length == 0) return;","    Format.Segment.call(this, format, s);","};","DateFormat.MinuteSegment.prototype = new DateFormat.TimeSegment;","DateFormat.MinuteSegment.prototype.constructor = DateFormat.MinuteSegment;","","DateFormat.MinuteSegment.prototype.toString = function() { ","    return \"timeMinute: \\\"\"+this._s+'\"'; ","};","","// Public methods","","DateFormat.MinuteSegment.prototype.format = function(date) {","    var minutes = date.getMinutes();","    return zeroPad(minutes, this._s.length);","};","","//","// Time second segment class","//","","DateFormat.SecondSegment = function(format, s) {","    if (arguments.length == 0) return;","    Format.Segment.call(this, format, s);","};","DateFormat.SecondSegment.prototype = new DateFormat.TimeSegment;","DateFormat.SecondSegment.prototype.constructor = DateFormat.SecondSegment;","","// Public methods","","DateFormat.SecondSegment.prototype.format = function(date) {","    var minutes = /s/.test(this._s) ? date.getSeconds() : date.getMilliseconds();","    return zeroPad(minutes, this._s.length);","};","","//","// Time am/pm segment class","//","","DateFormat.AmPmSegment = function(format, s) {","    if (arguments.length == 0) return;","    Format.Segment.call(this, format, s);","};","DateFormat.AmPmSegment.prototype = new DateFormat.TimeSegment;","DateFormat.AmPmSegment.prototype.constructor = DateFormat.AmPmSegment;","","DateFormat.AmPmSegment.prototype.toString = function() { ","    return \"timeAmPm: \\\"\"+this._s+'\"'; ","};","","// Public methods","","DateFormat.AmPmSegment.prototype.format = function(date) {","    var hours = date.getHours();","    return hours < 12 ? this.getFormat().Formats.periodAm : this.getFormat().Formats.periodPm;","};","","//","// Time timezone segment class","//","","DateFormat.TimezoneSegment = function(format, s) {","    if (arguments.length == 0) return;","    Format.Segment.call(this, format, s);","};","DateFormat.TimezoneSegment.prototype = new DateFormat.TimeSegment;","DateFormat.TimezoneSegment.prototype.constructor = DateFormat.TimezoneSegment;","","DateFormat.TimezoneSegment.prototype.toString = function() { ","    return \"timeTimezone: \\\"\"+this._s+'\"'; ","};","","// Public methods","","DateFormat.TimezoneSegment.prototype.format = function(date) {","    if (/Z/.test(this._s)) {","        return this.getFormat().timeZone.getShortName();","    }","    return this._s.length < 4 ? this.getFormat().timeZone.getMediumName() : this.getFormat().timeZone.getLongName();","};","    ","//","// Non-Gregorian Calendars","//","    ","//Buddhist Calendar. This is normally used only for Thai locales (th).","BuddhistDateFormat = function(pattern, formats, timeZoneId, locale) {","    if (arguments.length == 0) return;","    DateFormat.call(this, pattern, formats, timeZoneId, locale);","        ","    //Iterate through _segments, and replace the ones that are different for Buddhist Calendar","    var segments = this._segments;","    for(var i=0; i<segments.length; i++) {","        if(segments[i] instanceof DateFormat.YearSegment) {","            segments[i] = new BuddhistDateFormat.YearSegment(segments[i]);","        } else if (segments[i] instanceof DateFormat.EraSegment) {","            segments[i] = new BuddhistDateFormat.EraSegment(segments[i]);","        }","    }","}","    ","BuddhistDateFormat.prototype = new DateFormat;","BuddhistDateFormat.prototype.constructor = BuddhistDateFormat;","    ","//Override YearSegment class for Buddhist Calender","BuddhistDateFormat.YearSegment = function(segment) {","    if (arguments.length == 0) return;","    DateFormat.YearSegment.call(this, segment._parent, segment._s);","};","    ","BuddhistDateFormat.YearSegment.prototype = new DateFormat.YearSegment;","BuddhistDateFormat.YearSegment.prototype.constructor = BuddhistDateFormat.YearSegment;","","BuddhistDateFormat.YearSegment.prototype.format = function(date) { ","    var year = date.getFullYear();","    year = String(year + 543);      //Buddhist Calendar epoch is in 543 BC","    return this._s.length != 1 && this._s.length < 4 ? year.substr(year.length - 2) : zeroPad(year, this._s.length);","};","    ","//Override EraSegment class for Buddhist Calender","BuddhistDateFormat.EraSegment = function(segment) {","    if (arguments.length == 0) return;","    DateFormat.EraSegment.call(this, segment._parent, segment._s);","};","    ","BuddhistDateFormat.EraSegment.prototype = new DateFormat.EraSegment;","BuddhistDateFormat.EraSegment.prototype.constructor = BuddhistDateFormat.EraSegment;","","BuddhistDateFormat.EraSegment.prototype.format = function(date) { ","    return \"BE\";    //Only Buddhist Era supported for now","};","        ","//","// Start YUI code","//","    ","/**"," * @class Y.DateFormat"," * @constructor"," * @param {String} timeZone (Optional) TZ database ID for the time zone that should be used. If no argument is provided, \"Etc/GMT\" is used. If an argument is provided that is not a valid time zone identifier, an Error exception is thrown."," * @param {Number} dateFormat (Optional) Selector for the desired date format from Y.DateFormat.DATE_FORMATS. If no argument is provided, NONE is assumed. If an argument is provided that's not a valid selector, an Error exception is thrown. "," * @param {Number} timeFormat (Optional) Selector for the desired time format from Y.DateFormat.TIME_FORMATS. If no argument is provided, NONE is assumed. If an argument is provided that's not a valid selector, an Error exception is thrown. "," * @param {Number} timeZoneFormat (Optional) Selector for the desired time zone format from Y.DateFormat.TIMEZONE_FORMATS. If no argument is provided, NONE is assumed. If an argument is provided that's not a valid selector, an Error exception is thrown. "," */","Y.DateFormat = function(timeZone, dateFormat, timeFormat, timeZoneFormat) {","        ","    if(timeZone == null) {","        timeZone = \"Etc/GMT\";","    }","","    this._Formats = Y.Intl.get(MODULE_NAME);","        ","    //If not valid time zone","    if(!Y.TimeZone.isValidTimezoneId(timeZone)) {","        throw new Y.TimeZone.UnknownTimeZoneException(\"Could not find timezone: \" + timeZone);","    }","","    this._timeZone = timeZone;","    this._timeZoneInstance = new Y.TimeZone(this._timeZone);","","    this._dateFormat = dateFormat;","    this._timeFormat = timeFormat;","    this._timeZoneFormat = timeZoneFormat;","","    this._relative = false;","    this._pattern = this._generatePattern();","","    var locale = Y.Intl.getLang(MODULE_NAME);","        ","    if(locale.match(/^th/) && !locale.match(/u-ca-gregory/)) {","        //Use buddhist calendar","        this._dateFormatInstance = new BuddhistDateFormat(this._pattern, this._Formats, this._timeZone);","    } else {","        //Use gregorian calendar","        this._dateFormatInstance = new DateFormat(this._pattern, this._Formats, this._timeZone);","    }        ","}","","//Selector values","Y.DateFormat.DATE_FORMATS = {","    NONE: 0,","    WYMD_LONG: 1,","    WYMD_ABBREVIATED: 4,","    WYMD_SHORT: 8,","    WMD_LONG: 16,","    WMD_ABBREVIATED: 32,","    WMD_SHORT: 64,","    YMD_LONG: 128,","    YMD_ABBREVIATED: 256,","    YMD_SHORT: 512,","    YM_LONG: 1024,","    MD_LONG: 2048,","    MD_ABBREVIATED: 4096,","    MD_SHORT: 8192,","    W_LONG: 16384,","    W_ABBREVIATED: 32768,","    M_LONG: 65536,","    M_ABBREVIATED: 131072,","    YMD_FULL: 262144,","    RELATIVE_DATE: 524288","}","","Y.DateFormat.TIME_FORMATS = {","    NONE: 0,","    HM_ABBREVIATED: 1,","    HM_SHORT: 2,","    H_ABBREVIATED: 4","}","","Y.DateFormat.TIMEZONE_FORMATS = {","    NONE: 0,","    Z_ABBREVIATED: 1,","    Z_SHORT: 2","}","","//Static methods","","/**"," * Returns an array of BCP 47 language tags for the languages supported by this class"," * @return {Array} an array of BCP 47 language tags for the languages supported by this class."," */","Y.DateFormat.availableLanguages = function() {","    return Y.Intl.getAvailableLangs(MODULE_NAME);","}","","//Private methods","","/**"," * Generate date pattern for selected format"," * @return {String} Date pattern for internal use."," */","Y.DateFormat.prototype._generateDatePattern = function() {","    var format = this._dateFormat;","    if(format == null) return \"\";","    if(format & Y.DateFormat.DATE_FORMATS.RELATIVE_DATE) {","        this._relative = true;","        format = format ^ Y.DateFormat.DATE_FORMATS.RELATIVE_DATE;","    }","    switch(format) {","        //Use relative only for formats with day component","        case Y.DateFormat.DATE_FORMATS.NONE:","            this._relative = false;","            return \"\";","        case Y.DateFormat.DATE_FORMATS.WYMD_LONG:","            return this._Formats.WYMD_long;","        case Y.DateFormat.DATE_FORMATS.WYMD_ABBREVIATED:","            return this._Formats.WYMD_abbreviated;","        case Y.DateFormat.DATE_FORMATS.WYMD_SHORT:","            return this._Formats.WYMD_short;","        case Y.DateFormat.DATE_FORMATS.WMD_LONG:","            return this._Formats.WMD_long;","        case Y.DateFormat.DATE_FORMATS.WMD_ABBREVIATED:","            return this._Formats.WMD_abbreviated;","        case Y.DateFormat.DATE_FORMATS.WMD_SHORT:","            return this._Formats.WMD_short;","        case Y.DateFormat.DATE_FORMATS.YMD_LONG:","            return this._Formats.YMD_long;","        case Y.DateFormat.DATE_FORMATS.YMD_ABBREVIATED:","            return this._Formats.YMD_abbreviated;","        case Y.DateFormat.DATE_FORMATS.YMD_SHORT:","            return this._Formats.YMD_short;","        case Y.DateFormat.DATE_FORMATS.YM_LONG:","            this._relative = false;","            return this._Formats.YM_long;","        case Y.DateFormat.DATE_FORMATS.MD_LONG:","            return this._Formats.MD_long;","        case Y.DateFormat.DATE_FORMATS.MD_ABBREVIATED:","            return this._Formats.MD_abbreviated;","        case Y.DateFormat.DATE_FORMATS.MD_SHORT:","            return this._Formats.MD_short;","        case Y.DateFormat.DATE_FORMATS.W_LONG:","            this._relative = false;","            return this._Formats.W_long;","        case Y.DateFormat.DATE_FORMATS.W_ABBREVIATED:","            this._relative = false;","            return this._Formats.W_abbreviated;","        case Y.DateFormat.DATE_FORMATS.M_LONG:","            this._relative = false;","            return this._Formats.M_long;","        case Y.DateFormat.DATE_FORMATS.M_ABBREVIATED:","            this._relative = false;","            return this._Formats.M_abbreviated;","        case Y.DateFormat.DATE_FORMATS.YMD_FULL:","            return this._Formats.YMD_full;","        default:","            throw new Format.IllegalArgumentsException(\"Date format given does not exist\");	//Error no such pattern.","    }","}","    ","/**"," * Generate time pattern for selected format"," * @return {String} Time pattern for internal use."," */","Y.DateFormat.prototype._generateTimePattern = function() {","    var format = this._timeFormat;","    if(format == null) return \"\";","    switch(format) {","        case Y.DateFormat.TIME_FORMATS.NONE:","            return \"\";","        case Y.DateFormat.TIME_FORMATS.HM_ABBREVIATED:","            return this._Formats.HM_abbreviated;","        case Y.DateFormat.TIME_FORMATS.HM_SHORT:","            return this._Formats.HM_short;","        case Y.DateFormat.TIME_FORMATS.H_ABBREVIATED:","            return this._Formats.H_abbreviated;","        default:","            throw new Format.IllegalArgumentsException(\"Time format given does not exist\");	//Error no such pattern.","    }","}","    ","/**"," * Generate time-zone pattern for selected format"," * @return {String} Time-Zone pattern for internal use."," */","Y.DateFormat.prototype._generateTimeZonePattern = function() {","    var format = this._timeZoneFormat;","    if(format == null) return \"\";","    switch(format) {","        case Y.DateFormat.TIMEZONE_FORMATS.NONE:","            return \"\";","        case Y.DateFormat.TIMEZONE_FORMATS.Z_ABBREVIATED:","            return \"z\";","        case Y.DateFormat.TIMEZONE_FORMATS.Z_SHORT:","            return \"Z\";","        default:","            throw new Format.IllegalArgumentsException(\"Time Zone format given does not exist\");	//Error no such pattern.","    }","}","    ","/**"," * Generate pattern for selected date, time and time-zone formats"," * @return {String} Combined pattern for date, time and time-zone for internal use."," */","Y.DateFormat.prototype._generatePattern = function() {","    var datePattern = this._generateDatePattern();","    var timePattern = this._generateTimePattern();","    var timeZonePattern = this._generateTimeZonePattern();","","    //Combine patterns. Mark date pattern part, to use with relative dates.","    if(datePattern != \"\") {","        datePattern = \"'<datePattern>'\" + datePattern + \"'</datePattern>'\";","    }","        ","    var pattern = \"\";","    if(timePattern != \"\" && timeZonePattern != \"\") {","        pattern = this._Formats.DateTimeTimezoneCombination;","    } else if (timePattern != \"\") {","        pattern = this._Formats.DateTimeCombination;","    } else if(timeZonePattern != \"\") {","        pattern = this._Formats.DateTimezoneCombination;","    } else if(datePattern != \"\"){","        //Just date","        pattern = \"{1}\";","    }","        ","    pattern = pattern.replace(\"{0}\", timePattern).replace(\"{1}\", datePattern).replace(\"{2}\", timeZonePattern);","        ","    //Remove unnecessary whitespaces","    pattern = pattern.replace(/\\s\\s+/g, \" \").replace(/^\\s+/, \"\").replace(/\\s+$/, \"\");","","    return pattern;","}","","//public methods","","/**"," * Formats a time value."," * @param {Date} date The time value to be formatted. If no valid Date object is provided, an Error exception is thrown."," * @return {String} The formatted string"," */","Y.DateFormat.prototype.format = function(date) {","    if(date == null) {","        throw new Y.DateFormat.IllegalArgumentsException(\"No date provided.\");","    }","        ","    var offset = this._timeZoneInstance.getRawOffset() * 1000;","    date = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000 + offset);","        ","    var relativeDate = null;","    if(this._relative) {","        var today = new Date();","        var tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);","        var yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);","","        if(date.getFullYear() == today.getFullYear() && date.getMonth() == today.getMonth() && date.getDate() == today.getDate()) {","            relativeDate = this._Formats.today;","        }","","        if(date.getFullYear() == tomorrow.getFullYear() && date.getMonth() == tomorrow.getMonth() && date.getDate() == tomorrow.getDate()) {","            relativeDate = this._Formats.tomorrow;","        }","","        if(date.getFullYear() == yesterday.getFullYear() && date.getMonth() == yesterday.getMonth() && date.getDate() == yesterday.getDate()) {","            relativeDate = this._Formats.yesterday;","        }","    }","    return this._dateFormatInstance.format(date, relativeDate);","}","","","}, '@VERSION@', {\"lang\": [\"af-NA\", \"af\", \"af-ZA\", \"am-ET\", \"am\", \"ar-AE\", \"ar-BH\", \"ar-DZ\", \"ar-EG\", \"ar-IQ\", \"ar-JO\", \"ar-KW\", \"ar-LB\", \"ar-LY\", \"ar-MA\", \"ar-OM\", \"ar-QA\", \"ar-SA\", \"ar-SD\", \"ar-SY\", \"ar-TN\", \"ar\", \"ar-YE\", \"as-IN\", \"as\", \"az-AZ\", \"az-Cyrl-AZ\", \"az-Cyrl\", \"az-Latn-AZ\", \"az-Latn\", \"az\", \"be-BY\", \"be\", \"bg-BG\", \"bg\", \"bn-BD\", \"bn-IN\", \"bn\", \"bo-CN\", \"bo-IN\", \"bo\", \"ca-ES\", \"ca\", \"cs-CZ\", \"cs\", \"cy-GB\", \"cy\", \"da-DK\", \"da\", \"de-AT\", \"de-BE\", \"de-CH\", \"de-DE\", \"de-LI\", \"de-LU\", \"de\", \"el-CY\", \"el-GR\", \"el\", \"en-AU\", \"en-BE\", \"en-BW\", \"en-BZ\", \"en-CA\", \"en-GB\", \"en-HK\", \"en-IE\", \"en-IN\", \"en-JM\", \"en-JO\", \"en-MH\", \"en-MT\", \"en-MY\", \"en-NA\", \"en-NZ\", \"en-PH\", \"en-PK\", \"en-RH\", \"en-SG\", \"en-TT\", \"en\", \"en-US-POSIX\", \"en-US\", \"en-VI\", \"en-ZA\", \"en-ZW\", \"eo\", \"es-AR\", \"es-BO\", \"es-CL\", \"es-CO\", \"es-CR\", \"es-DO\", \"es-EC\", \"es-ES\", \"es-GT\", \"es-HN\", \"es-MX\", \"es-NI\", \"es-PA\", \"es-PE\", \"es-PR\", \"es-PY\", \"es-SV\", \"es\", \"es-US\", \"es-UY\", \"es-VE\", \"et-EE\", \"et\", \"eu-ES\", \"eu\", \"fa-AF\", \"fa-IR\", \"fa\", \"fi-FI\", \"fi\", \"fil-PH\", \"fil\", \"fo-FO\", \"fo\", \"fr-BE\", \"fr-CA\", \"fr-CH\", \"fr-FR\", \"fr-LU\", \"fr-MC\", \"fr-SN\", \"fr\", \"ga-IE\", \"ga\", \"gl-ES\", \"gl\", \"gsw-CH\", \"gsw\", \"gu-IN\", \"gu\", \"gv-GB\", \"gv\", \"ha-GH\", \"ha-Latn-GH\", \"ha-Latn-NE\", \"ha-Latn-NG\", \"ha-Latn\", \"ha-NE\", \"ha-NG\", \"ha\", \"haw\", \"haw-US\", \"he-IL\", \"he\", \"hi-IN\", \"hi\", \"hr-HR\", \"hr\", \"hu-HU\", \"hu\", \"hy-AM-REVISED\", \"hy-AM\", \"hy\", \"id-ID\", \"id\", \"ii-CN\", \"ii\", \"in-ID\", \"in\", \"is-IS\", \"is\", \"it-CH\", \"it-IT\", \"it\", \"iw-IL\", \"iw\", \"ja-JP-TRADITIONAL\", \"ja-JP\", \"ja\", \"ka-GE\", \"ka\", \"kk-Cyrl-KZ\", \"kk-Cyrl\", \"kk-KZ\", \"kk\", \"kl-GL\", \"kl\", \"km-KH\", \"km\", \"kn-IN\", \"kn\", \"kok-IN\", \"kok\", \"ko-KR\", \"ko\", \"kw-GB\", \"kw\", \"lt-LT\", \"lt\", \"lv-LV\", \"lv\", \"mk-MK\", \"mk\", \"ml-IN\", \"ml\", \"mr-IN\", \"mr\", \"ms-BN\", \"ms-MY\", \"ms\", \"mt-MT\", \"mt\", \"nb-NO\", \"nb\", \"ne-IN\", \"ne-NP\", \"ne\", \"nl-BE\", \"nl-NL\", \"nl\", \"nn-NO\", \"nn\", \"no-NO-NY\", \"no-NO\", \"no\", \"om-ET\", \"om-KE\", \"om\", \"or-IN\", \"or\", \"pa-Arab-PK\", \"pa-Arab\", \"pa-Guru-IN\", \"pa-Guru\", \"pa-IN\", \"pa-PK\", \"pa\", \"pl-PL\", \"pl\", \"ps-AF\", \"ps\", \"pt-BR\", \"pt-PT\", \"pt\", \"ro-MD\", \"ro-RO\", \"ro\", \"ru-RU\", \"ru\", \"ru-UA\", \"sh-BA\", \"sh-CS\", \"sh\", \"sh-YU\", \"si-LK\", \"si\", \"sk-SK\", \"sk\", \"sl-SI\", \"sl\", \"so-DJ\", \"so-ET\", \"so-KE\", \"so-SO\", \"so\", \"sq-AL\", \"sq\", \"sr-BA\", \"sr-CS\", \"sr-Cyrl-BA\", \"sr-Cyrl-CS\", \"sr-Cyrl-ME\", \"sr-Cyrl-RS\", \"sr-Cyrl\", \"sr-Cyrl-YU\", \"sr-Latn-BA\", \"sr-Latn-CS\", \"sr-Latn-ME\", \"sr-Latn-RS\", \"sr-Latn\", \"sr-Latn-YU\", \"sr-ME\", \"sr-RS\", \"sr\", \"sr-YU\", \"sv-FI\", \"sv-SE\", \"sv\", \"sw-KE\", \"sw\", \"sw-TZ\", \"ta-IN\", \"ta\", \"te-IN\", \"te\", \"th-TH-TRADITIONAL\", \"th-TH\", \"th\", \"ti-ER\", \"ti-ET\", \"ti\", \"tl-PH\", \"tl\", \"tr-TR\", \"tr\", \"uk\", \"uk-UA\", \"ur-IN\", \"ur-PK\", \"ur\", \"uz-AF\", \"uz-Arab-AF\", \"uz-Arab\", \"uz-Cyrl\", \"uz-Cyrl-UZ\", \"uz-Latn\", \"uz-Latn-UZ\", \"uz\", \"uz-UZ\", \"vi\", \"vi-VN\", \"zh-CN\", \"zh-Hans-CN\", \"zh-Hans-HK\", \"zh-Hans-MO\", \"zh-Hans-SG\", \"zh-Hans\", \"zh-Hant-HK\", \"zh-Hant-MO\", \"zh-Hant-TW\", \"zh-Hant\", \"zh-HK\", \"zh-MO\", \"zh-SG\", \"zh-TW\", \"zh\", \"zu\", \"zu-ZA\"], \"requires\": [\"timezone\"]});"];
_yuitest_coverage["build/format-date/format-date.js"].lines = {"1":0,"16":0,"17":0,"18":0,"20":0,"21":0,"22":0,"27":0,"28":0,"32":0,"33":0,"35":0,"36":0,"39":0,"40":0,"42":0,"43":0,"46":0,"47":0,"49":0,"50":0,"55":0,"56":0,"58":0,"59":0,"61":0,"66":0,"67":0,"69":0,"71":0,"73":0,"74":0,"75":0,"77":0,"79":0,"90":0,"91":0,"92":0,"93":0,"94":0,"95":0,"98":0,"99":0,"101":0,"110":0,"111":0,"118":0,"119":0,"120":0,"121":0,"126":0,"127":0,"131":0,"132":0,"147":0,"148":0,"151":0,"152":0,"155":0,"156":0,"157":0,"159":0,"160":0,"161":0,"164":0,"185":0,"186":0,"187":0,"188":0,"189":0,"190":0,"191":0,"194":0,"195":0,"196":0,"198":0,"199":0,"201":0,"202":0,"203":0,"204":0,"205":0,"208":0,"211":0,"218":0,"219":0,"220":0,"222":0,"223":0,"225":0,"226":0,"229":0,"230":0,"233":0,"234":0,"235":0,"250":0,"255":0,"293":0,"294":0,"295":0,"297":0,"298":0,"300":0,"301":0,"303":0,"304":0,"306":0,"307":0,"308":0,"309":0,"310":0,"311":0,"312":0,"313":0,"316":0,"320":0,"321":0,"323":0,"324":0,"325":0,"326":0,"330":0,"331":0,"332":0,"333":0,"334":0,"336":0,"338":0,"339":0,"340":0,"341":0,"342":0,"343":0,"347":0,"348":0,"349":0,"350":0,"353":0,"354":0,"355":0,"356":0,"357":0,"359":0,"360":0,"362":0,"363":0,"365":0,"366":0,"369":0,"370":0,"373":0,"374":0,"377":0,"378":0,"380":0,"381":0,"386":0,"387":0,"389":0,"390":0,"393":0,"394":0,"397":0,"398":0,"400":0,"401":0,"402":0,"406":0,"407":0,"411":0,"412":0,"413":0,"414":0,"416":0,"418":0,"419":0,"420":0,"421":0,"424":0,"425":0,"426":0,"428":0,"429":0,"430":0,"432":0,"433":0,"435":0,"436":0,"437":0,"439":0,"440":0,"443":0,"450":0,"451":0,"452":0,"454":0,"455":0,"461":0,"462":0,"463":0,"465":0,"466":0,"470":0,"472":0,"479":0,"480":0,"481":0,"483":0,"484":0,"486":0,"487":0,"492":0,"493":0,"494":0,"501":0,"502":0,"503":0,"504":0,"506":0,"507":0,"509":0,"510":0,"513":0,"514":0,"515":0,"521":0,"527":0,"537":0,"538":0,"539":0,"541":0,"543":0,"545":0,"547":0,"549":0,"556":0,"557":0,"558":0,"560":0,"561":0,"565":0,"566":0,"567":0,"568":0,"570":0,"571":0,"573":0,"574":0,"575":0,"576":0,"577":0,"579":0,"582":0,"589":0,"590":0,"591":0,"593":0,"594":0,"598":0,"599":0,"600":0,"601":0,"602":0,"603":0,"605":0,"606":0,"608":0,"609":0,"612":0,"619":0,"620":0,"621":0,"622":0,"624":0,"625":0,"627":0,"628":0,"631":0,"632":0,"634":0,"639":0,"644":0,"653":0,"654":0,"655":0,"656":0,"657":0,"659":0,"660":0,"662":0,"663":0,"665":0,"667":0,"669":0,"676":0,"677":0,"678":0,"680":0,"681":0,"687":0,"688":0,"689":0,"691":0,"692":0,"694":0,"695":0,"700":0,"701":0,"702":0,"703":0,"705":0,"706":0,"716":0,"723":0,"724":0,"725":0,"727":0,"728":0,"730":0,"731":0,"736":0,"737":0,"738":0,"745":0,"746":0,"747":0,"749":0,"750":0,"754":0,"755":0,"756":0,"763":0,"764":0,"765":0,"767":0,"768":0,"770":0,"771":0,"776":0,"777":0,"778":0,"785":0,"786":0,"787":0,"789":0,"790":0,"792":0,"793":0,"798":0,"799":0,"800":0,"802":0,"810":0,"811":0,"812":0,"815":0,"816":0,"817":0,"818":0,"819":0,"820":0,"825":0,"826":0,"829":0,"830":0,"831":0,"834":0,"835":0,"837":0,"838":0,"839":0,"840":0,"844":0,"845":0,"846":0,"849":0,"850":0,"852":0,"853":0,"868":0,"870":0,"871":0,"874":0,"877":0,"878":0,"881":0,"882":0,"884":0,"885":0,"886":0,"888":0,"889":0,"891":0,"893":0,"895":0,"898":0,"903":0,"926":0,"933":0,"945":0,"946":0,"955":0,"956":0,"957":0,"958":0,"959":0,"960":0,"962":0,"965":0,"966":0,"968":0,"970":0,"972":0,"974":0,"976":0,"978":0,"980":0,"982":0,"984":0,"986":0,"987":0,"989":0,"991":0,"993":0,"995":0,"996":0,"998":0,"999":0,"1001":0,"1002":0,"1004":0,"1005":0,"1007":0,"1009":0,"1017":0,"1018":0,"1019":0,"1020":0,"1022":0,"1024":0,"1026":0,"1028":0,"1030":0,"1038":0,"1039":0,"1040":0,"1041":0,"1043":0,"1045":0,"1047":0,"1049":0,"1057":0,"1058":0,"1059":0,"1060":0,"1063":0,"1064":0,"1067":0,"1068":0,"1069":0,"1070":0,"1071":0,"1072":0,"1073":0,"1074":0,"1076":0,"1079":0,"1082":0,"1084":0,"1094":0,"1095":0,"1096":0,"1099":0,"1100":0,"1102":0,"1103":0,"1104":0,"1105":0,"1106":0,"1108":0,"1109":0,"1112":0,"1113":0,"1116":0,"1117":0,"1120":0};
_yuitest_coverage["build/format-date/format-date.js"].functions = {"Format:16":0,"ParsingException:32":0,"toString:35":0,"IllegalArgumentsException:39":0,"toString:42":0,"FormatException:46":0,"toString:49":0,"format:55":0,"zeroPad:66":0,"parse:90":0,"_createParseObject:110":0,"Segment:118":0,"format:131":0,"parse:147":0,"getFormat:151":0,"_parseLiteral:155":0,"_parseInt:185":0,"TextSegment:218":0,"toString:225":0,"parse:229":0,"trim:234":0,"DateFormat:293":0,"format:418":0,"DateSegment:450":0,"EraSegment:461":0,"format:470":0,"YearSegment:479":0,"toString:486":0,"format:492":0,"MonthSegment:501":0,"toString:509":0,"initialize:513":0,"format:537":0,"WeekSegment:556":0,"format:565":0,"DaySegment:589":0,"format:598":0,"WeekdaySegment:619":0,"toString:627":0,"initialize:631":0,"format:653":0,"TimeSegment:676":0,"HourSegment:687":0,"toString:694":0,"format:700":0,"MinuteSegment:723":0,"toString:730":0,"format:736":0,"SecondSegment:745":0,"format:754":0,"AmPmSegment:763":0,"toString:770":0,"format:776":0,"TimezoneSegment:785":0,"toString:792":0,"format:798":0,"BuddhistDateFormat:810":0,"YearSegment:829":0,"format:837":0,"EraSegment:844":0,"format:852":0,"DateFormat:868":0,"availableLanguages:945":0,"_generateDatePattern:955":0,"_generateTimePattern:1017":0,"_generateTimeZonePattern:1038":0,"_generatePattern:1057":0,"format:1094":0,"(anonymous 1):1":0};
_yuitest_coverage["build/format-date/format-date.js"].coveredLines = 487;
_yuitest_coverage["build/format-date/format-date.js"].coveredFunctions = 69;
_yuitest_coverline("build/format-date/format-date.js", 1);
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
_yuitest_coverfunc("build/format-date/format-date.js", "(anonymous 1)", 1);
_yuitest_coverline("build/format-date/format-date.js", 16);
Format = function(pattern, formats) {
    _yuitest_coverfunc("build/format-date/format-date.js", "Format", 16);
_yuitest_coverline("build/format-date/format-date.js", 17);
if (arguments.length == 0) {
        _yuitest_coverline("build/format-date/format-date.js", 18);
return;
    }
    _yuitest_coverline("build/format-date/format-date.js", 20);
this._pattern = pattern;
    _yuitest_coverline("build/format-date/format-date.js", 21);
this._segments = []; 
    _yuitest_coverline("build/format-date/format-date.js", 22);
this.Formats = formats; 
}

// Data

_yuitest_coverline("build/format-date/format-date.js", 27);
Format.prototype._pattern = null;
_yuitest_coverline("build/format-date/format-date.js", 28);
Format.prototype._segments = null;

//Exceptions
    
_yuitest_coverline("build/format-date/format-date.js", 32);
Format.ParsingException = function(message) {
    _yuitest_coverfunc("build/format-date/format-date.js", "ParsingException", 32);
_yuitest_coverline("build/format-date/format-date.js", 33);
this.message = message;
}
_yuitest_coverline("build/format-date/format-date.js", 35);
Format.ParsingException.prototype.toString = function() {
    _yuitest_coverfunc("build/format-date/format-date.js", "toString", 35);
_yuitest_coverline("build/format-date/format-date.js", 36);
return "ParsingException: " + this.message;
}

_yuitest_coverline("build/format-date/format-date.js", 39);
Format.IllegalArgumentsException = function(message) {
    _yuitest_coverfunc("build/format-date/format-date.js", "IllegalArgumentsException", 39);
_yuitest_coverline("build/format-date/format-date.js", 40);
this.message = message;
}
_yuitest_coverline("build/format-date/format-date.js", 42);
Format.IllegalArgumentsException.prototype.toString = function() {
    _yuitest_coverfunc("build/format-date/format-date.js", "toString", 42);
_yuitest_coverline("build/format-date/format-date.js", 43);
return "IllegalArgumentsException: " + this.message;
}
    
_yuitest_coverline("build/format-date/format-date.js", 46);
Format.FormatException = function(message) {
    _yuitest_coverfunc("build/format-date/format-date.js", "FormatException", 46);
_yuitest_coverline("build/format-date/format-date.js", 47);
this.message = message;
}
_yuitest_coverline("build/format-date/format-date.js", 49);
Format.FormatException.prototype.toString = function() {
    _yuitest_coverfunc("build/format-date/format-date.js", "toString", 49);
_yuitest_coverline("build/format-date/format-date.js", 50);
return "FormatException: " + this.message;
}    

// Public methods

_yuitest_coverline("build/format-date/format-date.js", 55);
Format.prototype.format = function(object) { 
    _yuitest_coverfunc("build/format-date/format-date.js", "format", 55);
_yuitest_coverline("build/format-date/format-date.js", 56);
var s = [];
        
    _yuitest_coverline("build/format-date/format-date.js", 58);
for (var i = 0; i < this._segments.length; i++) {
        _yuitest_coverline("build/format-date/format-date.js", 59);
s.push(this._segments[i].format(object));
    }
    _yuitest_coverline("build/format-date/format-date.js", 61);
return s.join("");
};

// Protected static methods

_yuitest_coverline("build/format-date/format-date.js", 66);
function zeroPad (s, length, zeroChar, rightSide) {
    _yuitest_coverfunc("build/format-date/format-date.js", "zeroPad", 66);
_yuitest_coverline("build/format-date/format-date.js", 67);
s = typeof s == "string" ? s : String(s);

    _yuitest_coverline("build/format-date/format-date.js", 69);
if (s.length >= length) {return s;}

    _yuitest_coverline("build/format-date/format-date.js", 71);
zeroChar = zeroChar || '0';
	
    _yuitest_coverline("build/format-date/format-date.js", 73);
var a = [];
    _yuitest_coverline("build/format-date/format-date.js", 74);
for (var i = s.length; i < length; i++) {
        _yuitest_coverline("build/format-date/format-date.js", 75);
a.push(zeroChar);
    }
    _yuitest_coverline("build/format-date/format-date.js", 77);
a[rightSide ? "unshift" : "push"](s);

    _yuitest_coverline("build/format-date/format-date.js", 79);
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
_yuitest_coverline("build/format-date/format-date.js", 90);
Format.prototype.parse = function(s, pp) {
    _yuitest_coverfunc("build/format-date/format-date.js", "parse", 90);
_yuitest_coverline("build/format-date/format-date.js", 91);
var object = this._createParseObject();
    _yuitest_coverline("build/format-date/format-date.js", 92);
var index = pp || 0;
    _yuitest_coverline("build/format-date/format-date.js", 93);
for (var i = 0; i < this._segments.length; i++) {
        _yuitest_coverline("build/format-date/format-date.js", 94);
var segment = this._segments[i];
        _yuitest_coverline("build/format-date/format-date.js", 95);
index = segment.parse(object, s, index);
    }
        
    _yuitest_coverline("build/format-date/format-date.js", 98);
if (index < s.length) {
        _yuitest_coverline("build/format-date/format-date.js", 99);
throw new Format.ParsingException("Input too long");
    }
    _yuitest_coverline("build/format-date/format-date.js", 101);
return object;
};
    
/**
     * Creates the object that is initialized by parsing
     * <p>
     * <strong>Note:</strong>
     * This must be implemented by sub-classes.
     */
_yuitest_coverline("build/format-date/format-date.js", 110);
Format.prototype._createParseObject = function(s) {
    _yuitest_coverfunc("build/format-date/format-date.js", "_createParseObject", 110);
_yuitest_coverline("build/format-date/format-date.js", 111);
throw new Format.ParsingException("Not implemented");
};

//
// Segment class
//

_yuitest_coverline("build/format-date/format-date.js", 118);
Format.Segment = function(format, s) {
    _yuitest_coverfunc("build/format-date/format-date.js", "Segment", 118);
_yuitest_coverline("build/format-date/format-date.js", 119);
if (arguments.length == 0) {return;}
    _yuitest_coverline("build/format-date/format-date.js", 120);
this._parent = format;
    _yuitest_coverline("build/format-date/format-date.js", 121);
this._s = s;
};
    
// Data

_yuitest_coverline("build/format-date/format-date.js", 126);
Format.Segment.prototype._parent = null;
_yuitest_coverline("build/format-date/format-date.js", 127);
Format.Segment.prototype._s = null;

// Public methods

_yuitest_coverline("build/format-date/format-date.js", 131);
Format.Segment.prototype.format = function(o) { 
    _yuitest_coverfunc("build/format-date/format-date.js", "format", 131);
_yuitest_coverline("build/format-date/format-date.js", 132);
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
_yuitest_coverline("build/format-date/format-date.js", 147);
Format.Segment.prototype.parse = function(o, s, index) {
    _yuitest_coverfunc("build/format-date/format-date.js", "parse", 147);
_yuitest_coverline("build/format-date/format-date.js", 148);
throw new Format.ParsingException("Not implemented");
};

_yuitest_coverline("build/format-date/format-date.js", 151);
Format.Segment.prototype.getFormat = function() {
    _yuitest_coverfunc("build/format-date/format-date.js", "getFormat", 151);
_yuitest_coverline("build/format-date/format-date.js", 152);
return this._parent;
};

_yuitest_coverline("build/format-date/format-date.js", 155);
Format.Segment._parseLiteral = function(literal, s, index) {
    _yuitest_coverfunc("build/format-date/format-date.js", "_parseLiteral", 155);
_yuitest_coverline("build/format-date/format-date.js", 156);
if (s.length - index < literal.length) {
        _yuitest_coverline("build/format-date/format-date.js", 157);
throw new Format.ParsingException("Input too short");
    }
    _yuitest_coverline("build/format-date/format-date.js", 159);
for (var i = 0; i < literal.length; i++) {
        _yuitest_coverline("build/format-date/format-date.js", 160);
if (literal.charAt(i) != s.charAt(index + i)) {
            _yuitest_coverline("build/format-date/format-date.js", 161);
throw new Format.ParsingException("Input doesn't match");
        }
    }
    _yuitest_coverline("build/format-date/format-date.js", 164);
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
_yuitest_coverline("build/format-date/format-date.js", 185);
Format.Segment._parseInt = function(o, f, adjust, s, index, fixedlen, radix) {
    _yuitest_coverfunc("build/format-date/format-date.js", "_parseInt", 185);
_yuitest_coverline("build/format-date/format-date.js", 186);
var len = fixedlen || s.length - index;
    _yuitest_coverline("build/format-date/format-date.js", 187);
var head = index;
    _yuitest_coverline("build/format-date/format-date.js", 188);
for (var i = 0; i < len; i++) {
        _yuitest_coverline("build/format-date/format-date.js", 189);
if (!s.charAt(index++).match(/\d/)) {
            _yuitest_coverline("build/format-date/format-date.js", 190);
index--;
            _yuitest_coverline("build/format-date/format-date.js", 191);
break;
        }
    }
    _yuitest_coverline("build/format-date/format-date.js", 194);
var tail = index;
    _yuitest_coverline("build/format-date/format-date.js", 195);
if (head == tail) {
        _yuitest_coverline("build/format-date/format-date.js", 196);
throw new Format.ParsingException("Number not present");
    }
    _yuitest_coverline("build/format-date/format-date.js", 198);
if (fixedlen && tail - head != fixedlen) {
        _yuitest_coverline("build/format-date/format-date.js", 199);
throw new Format.ParsingException("Number too short");
    }
    _yuitest_coverline("build/format-date/format-date.js", 201);
var value = parseInt(s.substring(head, tail), radix || 10);
    _yuitest_coverline("build/format-date/format-date.js", 202);
if (f) {
        _yuitest_coverline("build/format-date/format-date.js", 203);
var target = o || window;
        _yuitest_coverline("build/format-date/format-date.js", 204);
if (typeof f == "function") {
            _yuitest_coverline("build/format-date/format-date.js", 205);
f.call(target, value + adjust);
        }
        else {
            _yuitest_coverline("build/format-date/format-date.js", 208);
target[f] = value + adjust;
        }
    }
    _yuitest_coverline("build/format-date/format-date.js", 211);
return tail;
};

//
// Text segment class
//

_yuitest_coverline("build/format-date/format-date.js", 218);
Format.TextSegment = function(format, s) {
    _yuitest_coverfunc("build/format-date/format-date.js", "TextSegment", 218);
_yuitest_coverline("build/format-date/format-date.js", 219);
if (arguments.length == 0) {return;}
    _yuitest_coverline("build/format-date/format-date.js", 220);
Format.Segment.call(this, format, s);
};
_yuitest_coverline("build/format-date/format-date.js", 222);
Format.TextSegment.prototype = new Format.Segment;
_yuitest_coverline("build/format-date/format-date.js", 223);
Format.TextSegment.prototype.constructor = Format.TextSegment;

_yuitest_coverline("build/format-date/format-date.js", 225);
Format.TextSegment.prototype.toString = function() { 
    _yuitest_coverfunc("build/format-date/format-date.js", "toString", 225);
_yuitest_coverline("build/format-date/format-date.js", 226);
return "text: \""+this._s+'"'; 
};
    
_yuitest_coverline("build/format-date/format-date.js", 229);
Format.TextSegment.prototype.parse = function(o, s, index) {
    _yuitest_coverfunc("build/format-date/format-date.js", "parse", 229);
_yuitest_coverline("build/format-date/format-date.js", 230);
return Format.Segment._parseLiteral(this._s, s, index);
};

_yuitest_coverline("build/format-date/format-date.js", 233);
if(String.prototype.trim == null) {
    _yuitest_coverline("build/format-date/format-date.js", 234);
String.prototype.trim = function() {
        _yuitest_coverfunc("build/format-date/format-date.js", "trim", 234);
_yuitest_coverline("build/format-date/format-date.js", 235);
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

_yuitest_coverline("build/format-date/format-date.js", 250);
var MODULE_NAME = "format-date";
    
//
// Resources
//
_yuitest_coverline("build/format-date/format-date.js", 255);
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
_yuitest_coverline("build/format-date/format-date.js", 293);
DateFormat = function(pattern, formats, timeZoneId) {
    _yuitest_coverfunc("build/format-date/format-date.js", "DateFormat", 293);
_yuitest_coverline("build/format-date/format-date.js", 294);
if (arguments.length == 0) {
        _yuitest_coverline("build/format-date/format-date.js", 295);
return;
    }
    _yuitest_coverline("build/format-date/format-date.js", 297);
Format.call(this, pattern, formats);
    _yuitest_coverline("build/format-date/format-date.js", 298);
this.timeZone = new Y.TimeZone(timeZoneId);
        
    _yuitest_coverline("build/format-date/format-date.js", 300);
if (pattern == null) {
        _yuitest_coverline("build/format-date/format-date.js", 301);
return;
    }
    _yuitest_coverline("build/format-date/format-date.js", 303);
var head, tail, segment;
    _yuitest_coverline("build/format-date/format-date.js", 304);
for (var i = 0; i < pattern.length; i++) {
        // literal
        _yuitest_coverline("build/format-date/format-date.js", 306);
var c = pattern.charAt(i);
        _yuitest_coverline("build/format-date/format-date.js", 307);
if (c == "'") {
            _yuitest_coverline("build/format-date/format-date.js", 308);
head = i + 1;
            _yuitest_coverline("build/format-date/format-date.js", 309);
for (i++ ; i < pattern.length; i++) {
                _yuitest_coverline("build/format-date/format-date.js", 310);
c = pattern.charAt(i);
                _yuitest_coverline("build/format-date/format-date.js", 311);
if (c == "'") {
                    _yuitest_coverline("build/format-date/format-date.js", 312);
if (i + 1 < pattern.length && pattern.charAt(i + 1) == "'") {
                        _yuitest_coverline("build/format-date/format-date.js", 313);
pattern = pattern.substr(0, i) + pattern.substr(i + 1);
                    }
                    else {
                        _yuitest_coverline("build/format-date/format-date.js", 316);
break;
                    }
                }
            }
            _yuitest_coverline("build/format-date/format-date.js", 320);
if (i == pattern.length) {
                _yuitest_coverline("build/format-date/format-date.js", 321);
throw new Format.FormatException("unterminated string literal");
            }
            _yuitest_coverline("build/format-date/format-date.js", 323);
tail = i;
            _yuitest_coverline("build/format-date/format-date.js", 324);
segment = new Format.TextSegment(this, pattern.substring(head, tail));
            _yuitest_coverline("build/format-date/format-date.js", 325);
this._segments.push(segment);
            _yuitest_coverline("build/format-date/format-date.js", 326);
continue;
        }

        // non-meta chars
        _yuitest_coverline("build/format-date/format-date.js", 330);
head = i;
        _yuitest_coverline("build/format-date/format-date.js", 331);
while(i < pattern.length) {
            _yuitest_coverline("build/format-date/format-date.js", 332);
c = pattern.charAt(i);
            _yuitest_coverline("build/format-date/format-date.js", 333);
if (DateFormat._META_CHARS.indexOf(c) != -1 || c == "'") {
                _yuitest_coverline("build/format-date/format-date.js", 334);
break;
            }
            _yuitest_coverline("build/format-date/format-date.js", 336);
i++;
        }
        _yuitest_coverline("build/format-date/format-date.js", 338);
tail = i;
        _yuitest_coverline("build/format-date/format-date.js", 339);
if (head != tail) {
            _yuitest_coverline("build/format-date/format-date.js", 340);
segment = new Format.TextSegment(this, pattern.substring(head, tail));
            _yuitest_coverline("build/format-date/format-date.js", 341);
this._segments.push(segment);
            _yuitest_coverline("build/format-date/format-date.js", 342);
i--;
            _yuitest_coverline("build/format-date/format-date.js", 343);
continue;
        }
		
        // meta char
        _yuitest_coverline("build/format-date/format-date.js", 347);
head = i;
        _yuitest_coverline("build/format-date/format-date.js", 348);
while(++i < pattern.length) {
            _yuitest_coverline("build/format-date/format-date.js", 349);
if (pattern.charAt(i) != c) {
                _yuitest_coverline("build/format-date/format-date.js", 350);
break;
            }		
        }
        _yuitest_coverline("build/format-date/format-date.js", 353);
tail = i--;
        _yuitest_coverline("build/format-date/format-date.js", 354);
var count = tail - head;
        _yuitest_coverline("build/format-date/format-date.js", 355);
var field = pattern.substr(head, count);
        _yuitest_coverline("build/format-date/format-date.js", 356);
segment = null;
        _yuitest_coverline("build/format-date/format-date.js", 357);
switch (c) {
            case 'G':
                _yuitest_coverline("build/format-date/format-date.js", 359);
segment = new DateFormat.EraSegment(this, field);
                _yuitest_coverline("build/format-date/format-date.js", 360);
break;
            case 'y':
                _yuitest_coverline("build/format-date/format-date.js", 362);
segment = new DateFormat.YearSegment(this, field);
                _yuitest_coverline("build/format-date/format-date.js", 363);
break;
            case 'M':
                _yuitest_coverline("build/format-date/format-date.js", 365);
segment = new DateFormat.MonthSegment(this, field);
                _yuitest_coverline("build/format-date/format-date.js", 366);
break;
            case 'w':
            case 'W':
                _yuitest_coverline("build/format-date/format-date.js", 369);
segment = new DateFormat.WeekSegment(this, field);
                _yuitest_coverline("build/format-date/format-date.js", 370);
break;
            case 'D':
            case 'd':
                _yuitest_coverline("build/format-date/format-date.js", 373);
segment = new DateFormat.DaySegment(this, field);
                _yuitest_coverline("build/format-date/format-date.js", 374);
break;
            case 'F':
            case 'E':
                _yuitest_coverline("build/format-date/format-date.js", 377);
segment = new DateFormat.WeekdaySegment(this, field);
                _yuitest_coverline("build/format-date/format-date.js", 378);
break;
            case 'a':
                _yuitest_coverline("build/format-date/format-date.js", 380);
segment = new DateFormat.AmPmSegment(this, field);
                _yuitest_coverline("build/format-date/format-date.js", 381);
break;
            case 'H':
            case 'k':
            case 'K':
            case 'h':
                _yuitest_coverline("build/format-date/format-date.js", 386);
segment = new DateFormat.HourSegment(this, field);
                _yuitest_coverline("build/format-date/format-date.js", 387);
break;
            case 'm':
                _yuitest_coverline("build/format-date/format-date.js", 389);
segment = new DateFormat.MinuteSegment(this, field);
                _yuitest_coverline("build/format-date/format-date.js", 390);
break;
            case 's':
            case 'S':
                _yuitest_coverline("build/format-date/format-date.js", 393);
segment = new DateFormat.SecondSegment(this, field);
                _yuitest_coverline("build/format-date/format-date.js", 394);
break;
            case 'z':
            case 'Z':
                _yuitest_coverline("build/format-date/format-date.js", 397);
segment = new DateFormat.TimezoneSegment(this, field);
                _yuitest_coverline("build/format-date/format-date.js", 398);
break;
        }
        _yuitest_coverline("build/format-date/format-date.js", 400);
if (segment != null) {
            _yuitest_coverline("build/format-date/format-date.js", 401);
segment._index = this._segments.length;
            _yuitest_coverline("build/format-date/format-date.js", 402);
this._segments.push(segment);
        }
    }
}
_yuitest_coverline("build/format-date/format-date.js", 406);
DateFormat.prototype = new Format;
_yuitest_coverline("build/format-date/format-date.js", 407);
DateFormat.prototype.constructor = DateFormat;

// Constants

_yuitest_coverline("build/format-date/format-date.js", 411);
DateFormat.SHORT = 0;
_yuitest_coverline("build/format-date/format-date.js", 412);
DateFormat.MEDIUM = 1;
_yuitest_coverline("build/format-date/format-date.js", 413);
DateFormat.LONG = 2;
_yuitest_coverline("build/format-date/format-date.js", 414);
DateFormat.DEFAULT = DateFormat.MEDIUM;

_yuitest_coverline("build/format-date/format-date.js", 416);
DateFormat._META_CHARS = "GyMwWDdFEaHkKhmsSzZ";

_yuitest_coverline("build/format-date/format-date.js", 418);
DateFormat.prototype.format = function(object, relative) {
    _yuitest_coverfunc("build/format-date/format-date.js", "format", 418);
_yuitest_coverline("build/format-date/format-date.js", 419);
var useRelative = false;
    _yuitest_coverline("build/format-date/format-date.js", 420);
if(relative != null && relative != "") {
        _yuitest_coverline("build/format-date/format-date.js", 421);
useRelative = true;
    }

    _yuitest_coverline("build/format-date/format-date.js", 424);
var s = [];
    _yuitest_coverline("build/format-date/format-date.js", 425);
var datePattern = false;
    _yuitest_coverline("build/format-date/format-date.js", 426);
for (var i = 0; i < this._segments.length; i++) {
        //Mark datePattern sections in case of relative dates
        _yuitest_coverline("build/format-date/format-date.js", 428);
if(this._segments[i].toString().indexOf("text: \"<datePattern>\"") == 0) {
            _yuitest_coverline("build/format-date/format-date.js", 429);
if(useRelative) {
                _yuitest_coverline("build/format-date/format-date.js", 430);
s.push(relative);
            }
            _yuitest_coverline("build/format-date/format-date.js", 432);
datePattern = true;
            _yuitest_coverline("build/format-date/format-date.js", 433);
continue;
        }
        _yuitest_coverline("build/format-date/format-date.js", 435);
if(this._segments[i].toString().indexOf("text: \"</datePattern>\"") == 0) {
            _yuitest_coverline("build/format-date/format-date.js", 436);
datePattern = false;
            _yuitest_coverline("build/format-date/format-date.js", 437);
continue;
        }
        _yuitest_coverline("build/format-date/format-date.js", 439);
if(!datePattern || !useRelative) {
            _yuitest_coverline("build/format-date/format-date.js", 440);
s.push(this._segments[i].format(object));
        }
    }
    _yuitest_coverline("build/format-date/format-date.js", 443);
return s.join("");
}

//
// Date segment class
//

_yuitest_coverline("build/format-date/format-date.js", 450);
DateFormat.DateSegment = function(format, s) {
    _yuitest_coverfunc("build/format-date/format-date.js", "DateSegment", 450);
_yuitest_coverline("build/format-date/format-date.js", 451);
if (arguments.length == 0) {return;}
    _yuitest_coverline("build/format-date/format-date.js", 452);
Format.Segment.call(this, format, s);
}
_yuitest_coverline("build/format-date/format-date.js", 454);
DateFormat.DateSegment.prototype = new Format.Segment;
_yuitest_coverline("build/format-date/format-date.js", 455);
DateFormat.DateSegment.prototype.constructor = DateFormat.DateSegment;

//
// Date era segment class
//

_yuitest_coverline("build/format-date/format-date.js", 461);
DateFormat.EraSegment = function(format, s) {
    _yuitest_coverfunc("build/format-date/format-date.js", "EraSegment", 461);
_yuitest_coverline("build/format-date/format-date.js", 462);
if (arguments.length == 0) {return;}
    _yuitest_coverline("build/format-date/format-date.js", 463);
DateFormat.DateSegment.call(this, format, s);
};
_yuitest_coverline("build/format-date/format-date.js", 465);
DateFormat.EraSegment.prototype = new DateFormat.DateSegment;
_yuitest_coverline("build/format-date/format-date.js", 466);
DateFormat.EraSegment.prototype.constructor = DateFormat.EraSegment;

// Public methods

_yuitest_coverline("build/format-date/format-date.js", 470);
DateFormat.EraSegment.prototype.format = function(date) { 
    // NOTE: Only support current era at the moment...
    _yuitest_coverfunc("build/format-date/format-date.js", "format", 470);
_yuitest_coverline("build/format-date/format-date.js", 472);
return this.getFormat().AD;
};

//
// Date year segment class
//

_yuitest_coverline("build/format-date/format-date.js", 479);
DateFormat.YearSegment = function(format, s) {
    _yuitest_coverfunc("build/format-date/format-date.js", "YearSegment", 479);
_yuitest_coverline("build/format-date/format-date.js", 480);
if (arguments.length == 0) {return;}
    _yuitest_coverline("build/format-date/format-date.js", 481);
DateFormat.DateSegment.call(this, format, s);
};
_yuitest_coverline("build/format-date/format-date.js", 483);
DateFormat.YearSegment.prototype = new DateFormat.DateSegment;
_yuitest_coverline("build/format-date/format-date.js", 484);
DateFormat.YearSegment.prototype.constructor = DateFormat.YearSegment;

_yuitest_coverline("build/format-date/format-date.js", 486);
DateFormat.YearSegment.prototype.toString = function() { 
    _yuitest_coverfunc("build/format-date/format-date.js", "toString", 486);
_yuitest_coverline("build/format-date/format-date.js", 487);
return "dateYear: \""+this._s+'"'; 
};

// Public methods

_yuitest_coverline("build/format-date/format-date.js", 492);
DateFormat.YearSegment.prototype.format = function(date) { 
    _yuitest_coverfunc("build/format-date/format-date.js", "format", 492);
_yuitest_coverline("build/format-date/format-date.js", 493);
var year = String(date.getFullYear());
    _yuitest_coverline("build/format-date/format-date.js", 494);
return this._s.length != 1 && this._s.length < 4 ? year.substr(year.length - 2) : zeroPad(year, this._s.length);
};

//
// Date month segment class
//

_yuitest_coverline("build/format-date/format-date.js", 501);
DateFormat.MonthSegment = function(format, s) {
    _yuitest_coverfunc("build/format-date/format-date.js", "MonthSegment", 501);
_yuitest_coverline("build/format-date/format-date.js", 502);
if (arguments.length == 0) {return;}
    _yuitest_coverline("build/format-date/format-date.js", 503);
DateFormat.DateSegment.call(this, format, s);
    _yuitest_coverline("build/format-date/format-date.js", 504);
this.initialize();
};
_yuitest_coverline("build/format-date/format-date.js", 506);
DateFormat.MonthSegment.prototype = new DateFormat.DateSegment;
_yuitest_coverline("build/format-date/format-date.js", 507);
DateFormat.MonthSegment.prototype.constructor = DateFormat.MonthSegment;

_yuitest_coverline("build/format-date/format-date.js", 509);
DateFormat.MonthSegment.prototype.toString = function() { 
    _yuitest_coverfunc("build/format-date/format-date.js", "toString", 509);
_yuitest_coverline("build/format-date/format-date.js", 510);
return "dateMonth: \""+this._s+'"'; 
};

_yuitest_coverline("build/format-date/format-date.js", 513);
DateFormat.MonthSegment.prototype.initialize = function() {
    _yuitest_coverfunc("build/format-date/format-date.js", "initialize", 513);
_yuitest_coverline("build/format-date/format-date.js", 514);
DateFormat.MonthSegment.MONTHS = {};
    _yuitest_coverline("build/format-date/format-date.js", 515);
DateFormat.MonthSegment.MONTHS[DateFormat.SHORT] = [
    ShortNames.monthJanShort,ShortNames.monthFebShort,ShortNames.monthMarShort,
    ShortNames.monthAprShort,ShortNames.monthMayShort,ShortNames.monthJunShort,
    ShortNames.monthJulShort,ShortNames.monthAugShort,ShortNames.monthSepShort,
    ShortNames.monthOctShort,ShortNames.monthNovShort,ShortNames.monthDecShort
    ];
    _yuitest_coverline("build/format-date/format-date.js", 521);
DateFormat.MonthSegment.MONTHS[DateFormat.MEDIUM] = [
    this.getFormat().Formats.monthJanMedium, this.getFormat().Formats.monthFebMedium, this.getFormat().Formats.monthMarMedium,
    this.getFormat().Formats.monthAprMedium, this.getFormat().Formats.monthMayMedium, this.getFormat().Formats.monthJunMedium,
    this.getFormat().Formats.monthJulMedium, this.getFormat().Formats.monthAugMedium, this.getFormat().Formats.monthSepMedium,
    this.getFormat().Formats.monthOctMedium, this.getFormat().Formats.monthNovMedium, this.getFormat().Formats.monthDecMedium
    ];
    _yuitest_coverline("build/format-date/format-date.js", 527);
DateFormat.MonthSegment.MONTHS[DateFormat.LONG] = [
    this.getFormat().Formats.monthJanLong, this.getFormat().Formats.monthFebLong, this.getFormat().Formats.monthMarLong,
    this.getFormat().Formats.monthAprLong, this.getFormat().Formats.monthMayLong, this.getFormat().Formats.monthJunLong,
    this.getFormat().Formats.monthJulLong, this.getFormat().Formats.monthAugLong, this.getFormat().Formats.monthSepLong,
    this.getFormat().Formats.monthOctLong, this.getFormat().Formats.monthNovLong, this.getFormat().Formats.monthDecLong
    ];
};

// Public methods

_yuitest_coverline("build/format-date/format-date.js", 537);
DateFormat.MonthSegment.prototype.format = function(date) {
    _yuitest_coverfunc("build/format-date/format-date.js", "format", 537);
_yuitest_coverline("build/format-date/format-date.js", 538);
var month = date.getMonth();
    _yuitest_coverline("build/format-date/format-date.js", 539);
switch (this._s.length) {
        case 1:
            _yuitest_coverline("build/format-date/format-date.js", 541);
return String(month + 1);
        case 2:
            _yuitest_coverline("build/format-date/format-date.js", 543);
return zeroPad(month + 1, 2);
        case 3:
            _yuitest_coverline("build/format-date/format-date.js", 545);
return DateFormat.MonthSegment.MONTHS[DateFormat.MEDIUM][month];
        case 5:
            _yuitest_coverline("build/format-date/format-date.js", 547);
return DateFormat.MonthSegment.MONTHS[DateFormat.SHORT][month];
    }
    _yuitest_coverline("build/format-date/format-date.js", 549);
return DateFormat.MonthSegment.MONTHS[DateFormat.LONG][month];
};

//
// Date week segment class
//

_yuitest_coverline("build/format-date/format-date.js", 556);
DateFormat.WeekSegment = function(format, s) {
    _yuitest_coverfunc("build/format-date/format-date.js", "WeekSegment", 556);
_yuitest_coverline("build/format-date/format-date.js", 557);
if (arguments.length == 0) {return;}
    _yuitest_coverline("build/format-date/format-date.js", 558);
DateFormat.DateSegment.call(this, format, s);
};
_yuitest_coverline("build/format-date/format-date.js", 560);
DateFormat.WeekSegment.prototype = new DateFormat.DateSegment;
_yuitest_coverline("build/format-date/format-date.js", 561);
DateFormat.WeekSegment.prototype.constructor = DateFormat.WeekSegment;

// Public methods

_yuitest_coverline("build/format-date/format-date.js", 565);
DateFormat.WeekSegment.prototype.format = function(date) {
    _yuitest_coverfunc("build/format-date/format-date.js", "format", 565);
_yuitest_coverline("build/format-date/format-date.js", 566);
var year = date.getYear();
    _yuitest_coverline("build/format-date/format-date.js", 567);
var month = date.getMonth();
    _yuitest_coverline("build/format-date/format-date.js", 568);
var day = date.getDate();
	
    _yuitest_coverline("build/format-date/format-date.js", 570);
var ofYear = /w/.test(this._s);
    _yuitest_coverline("build/format-date/format-date.js", 571);
var date2 = new Date(year, ofYear ? 0 : month, 1);

    _yuitest_coverline("build/format-date/format-date.js", 573);
var week = 0;
    _yuitest_coverline("build/format-date/format-date.js", 574);
while (true) {
        _yuitest_coverline("build/format-date/format-date.js", 575);
week++;
        _yuitest_coverline("build/format-date/format-date.js", 576);
if (date2.getMonth() > month || (date2.getMonth() == month && date2.getDate() >= day)) {
            _yuitest_coverline("build/format-date/format-date.js", 577);
break;
        }
        _yuitest_coverline("build/format-date/format-date.js", 579);
date2.setDate(date2.getDate() + 7);
    }

    _yuitest_coverline("build/format-date/format-date.js", 582);
return zeroPad(week, this._s.length);
};

//
// Date day segment class
//

_yuitest_coverline("build/format-date/format-date.js", 589);
DateFormat.DaySegment = function(format, s) {
    _yuitest_coverfunc("build/format-date/format-date.js", "DaySegment", 589);
_yuitest_coverline("build/format-date/format-date.js", 590);
if (arguments.length == 0) {return;}
    _yuitest_coverline("build/format-date/format-date.js", 591);
DateFormat.DateSegment.call(this, format, s);
};
_yuitest_coverline("build/format-date/format-date.js", 593);
DateFormat.DaySegment.prototype = new DateFormat.DateSegment;
_yuitest_coverline("build/format-date/format-date.js", 594);
DateFormat.DaySegment.prototype.constructor = DateFormat.DaySegment;

// Public methods

_yuitest_coverline("build/format-date/format-date.js", 598);
DateFormat.DaySegment.prototype.format = function(date) {
    _yuitest_coverfunc("build/format-date/format-date.js", "format", 598);
_yuitest_coverline("build/format-date/format-date.js", 599);
var month = date.getMonth();
    _yuitest_coverline("build/format-date/format-date.js", 600);
var day = date.getDate();
    _yuitest_coverline("build/format-date/format-date.js", 601);
if (/D/.test(this._s) && month > 0) {
        _yuitest_coverline("build/format-date/format-date.js", 602);
var year = date.getYear();
        _yuitest_coverline("build/format-date/format-date.js", 603);
do {
            // set date to first day of month and then go back one day
            _yuitest_coverline("build/format-date/format-date.js", 605);
var date2 = new Date(year, month, 1);
            _yuitest_coverline("build/format-date/format-date.js", 606);
date2.setDate(0); 
			
            _yuitest_coverline("build/format-date/format-date.js", 608);
day += date2.getDate();
            _yuitest_coverline("build/format-date/format-date.js", 609);
month--;
        }while (month > 0);
    }
    _yuitest_coverline("build/format-date/format-date.js", 612);
return zeroPad(day, this._s.length);
};

//
// Date weekday segment class
//

_yuitest_coverline("build/format-date/format-date.js", 619);
DateFormat.WeekdaySegment = function(format, s) {
    _yuitest_coverfunc("build/format-date/format-date.js", "WeekdaySegment", 619);
_yuitest_coverline("build/format-date/format-date.js", 620);
if (arguments.length == 0) {return;}
    _yuitest_coverline("build/format-date/format-date.js", 621);
DateFormat.DateSegment.call(this, format, s);
    _yuitest_coverline("build/format-date/format-date.js", 622);
this.initialize();
};
_yuitest_coverline("build/format-date/format-date.js", 624);
DateFormat.WeekdaySegment.prototype = new DateFormat.DateSegment;
_yuitest_coverline("build/format-date/format-date.js", 625);
DateFormat.WeekdaySegment.prototype.constructor = DateFormat.WeekdaySegment;

_yuitest_coverline("build/format-date/format-date.js", 627);
DateFormat.DaySegment.prototype.toString = function() { 
    _yuitest_coverfunc("build/format-date/format-date.js", "toString", 627);
_yuitest_coverline("build/format-date/format-date.js", 628);
return "dateDay: \""+this._s+'"'; 
};

_yuitest_coverline("build/format-date/format-date.js", 631);
DateFormat.WeekdaySegment.prototype.initialize = function() {
    _yuitest_coverfunc("build/format-date/format-date.js", "initialize", 631);
_yuitest_coverline("build/format-date/format-date.js", 632);
DateFormat.WeekdaySegment.WEEKDAYS = {};
    // NOTE: The short names aren't available in Java so we have to define them.
    _yuitest_coverline("build/format-date/format-date.js", 634);
DateFormat.WeekdaySegment.WEEKDAYS[DateFormat.SHORT] = [
    ShortNames.weekdaySunShort,ShortNames.weekdayMonShort,ShortNames.weekdayTueShort,
    ShortNames.weekdayWedShort,ShortNames.weekdayThuShort,ShortNames.weekdayFriShort,
    ShortNames.weekdaySatShort
    ];
    _yuitest_coverline("build/format-date/format-date.js", 639);
DateFormat.WeekdaySegment.WEEKDAYS[DateFormat.MEDIUM] = [
    this.getFormat().Formats.weekdaySunMedium, this.getFormat().Formats.weekdayMonMedium, this.getFormat().Formats.weekdayTueMedium,
    this.getFormat().Formats.weekdayWedMedium, this.getFormat().Formats.weekdayThuMedium, this.getFormat().Formats.weekdayFriMedium,
    this.getFormat().Formats.weekdaySatMedium
    ];
    _yuitest_coverline("build/format-date/format-date.js", 644);
DateFormat.WeekdaySegment.WEEKDAYS[DateFormat.LONG] = [
    this.getFormat().Formats.weekdaySunLong, this.getFormat().Formats.weekdayMonLong, this.getFormat().Formats.weekdayTueLong,
    this.getFormat().Formats.weekdayWedLong, this.getFormat().Formats.weekdayThuLong, this.getFormat().Formats.weekdayFriLong,
    this.getFormat().Formats.weekdaySatLong
    ];
};

// Public methods

_yuitest_coverline("build/format-date/format-date.js", 653);
DateFormat.WeekdaySegment.prototype.format = function(date) {
    _yuitest_coverfunc("build/format-date/format-date.js", "format", 653);
_yuitest_coverline("build/format-date/format-date.js", 654);
var weekday = date.getDay();
    _yuitest_coverline("build/format-date/format-date.js", 655);
if (/E/.test(this._s)) {
        _yuitest_coverline("build/format-date/format-date.js", 656);
var style;
        _yuitest_coverline("build/format-date/format-date.js", 657);
switch (this._s.length) {
            case 4:
                _yuitest_coverline("build/format-date/format-date.js", 659);
style = DateFormat.LONG;
                _yuitest_coverline("build/format-date/format-date.js", 660);
break;
            case 5:
                _yuitest_coverline("build/format-date/format-date.js", 662);
style = DateFormat.SHORT;
                _yuitest_coverline("build/format-date/format-date.js", 663);
break;
            default:
                _yuitest_coverline("build/format-date/format-date.js", 665);
style = DateFormat.MEDIUM;
        }
        _yuitest_coverline("build/format-date/format-date.js", 667);
return DateFormat.WeekdaySegment.WEEKDAYS[style][weekday];
    }
    _yuitest_coverline("build/format-date/format-date.js", 669);
return zeroPad(weekday, this._s.length);
};

//
// Time segment class
//

_yuitest_coverline("build/format-date/format-date.js", 676);
DateFormat.TimeSegment = function(format, s) {
    _yuitest_coverfunc("build/format-date/format-date.js", "TimeSegment", 676);
_yuitest_coverline("build/format-date/format-date.js", 677);
if (arguments.length == 0) {return;}
    _yuitest_coverline("build/format-date/format-date.js", 678);
Format.Segment.call(this, format, s);
};
_yuitest_coverline("build/format-date/format-date.js", 680);
DateFormat.TimeSegment.prototype = new Format.Segment;
_yuitest_coverline("build/format-date/format-date.js", 681);
DateFormat.TimeSegment.prototype.constructor = DateFormat.TimeSegment;

//
// Time hour segment class
//

_yuitest_coverline("build/format-date/format-date.js", 687);
DateFormat.HourSegment = function(format, s) {
    _yuitest_coverfunc("build/format-date/format-date.js", "HourSegment", 687);
_yuitest_coverline("build/format-date/format-date.js", 688);
if (arguments.length == 0) {return;}
    _yuitest_coverline("build/format-date/format-date.js", 689);
Format.Segment.call(this, format, s);
};
_yuitest_coverline("build/format-date/format-date.js", 691);
DateFormat.HourSegment.prototype = new DateFormat.TimeSegment;
_yuitest_coverline("build/format-date/format-date.js", 692);
DateFormat.HourSegment.prototype.constructor = DateFormat.HourSegment;

_yuitest_coverline("build/format-date/format-date.js", 694);
DateFormat.HourSegment.prototype.toString = function() { 
    _yuitest_coverfunc("build/format-date/format-date.js", "toString", 694);
_yuitest_coverline("build/format-date/format-date.js", 695);
return "timeHour: \""+this._s+'"'; 
};

// Public methods

_yuitest_coverline("build/format-date/format-date.js", 700);
DateFormat.HourSegment.prototype.format = function(date) {
    _yuitest_coverfunc("build/format-date/format-date.js", "format", 700);
_yuitest_coverline("build/format-date/format-date.js", 701);
var hours = date.getHours();
    _yuitest_coverline("build/format-date/format-date.js", 702);
if (hours > 12 && /[hK]/.test(this._s)) {
        _yuitest_coverline("build/format-date/format-date.js", 703);
hours -= 12;
    }
    else {_yuitest_coverline("build/format-date/format-date.js", 705);
if (hours == 0 && /[h]/.test(this._s)) {
        _yuitest_coverline("build/format-date/format-date.js", 706);
hours = 12;
    }}
    /***
	// NOTE: This is commented out to match the Java formatter output
	//       but from the comments for these meta-chars, it doesn't
	//       seem right.
	if (/[Hk]/.test(this._s)) {
		hours--;
	}
    /***/
    _yuitest_coverline("build/format-date/format-date.js", 716);
return zeroPad(hours, this._s.length);
};

//
// Time minute segment class
//

_yuitest_coverline("build/format-date/format-date.js", 723);
DateFormat.MinuteSegment = function(format, s) {
    _yuitest_coverfunc("build/format-date/format-date.js", "MinuteSegment", 723);
_yuitest_coverline("build/format-date/format-date.js", 724);
if (arguments.length == 0) {return;}
    _yuitest_coverline("build/format-date/format-date.js", 725);
Format.Segment.call(this, format, s);
};
_yuitest_coverline("build/format-date/format-date.js", 727);
DateFormat.MinuteSegment.prototype = new DateFormat.TimeSegment;
_yuitest_coverline("build/format-date/format-date.js", 728);
DateFormat.MinuteSegment.prototype.constructor = DateFormat.MinuteSegment;

_yuitest_coverline("build/format-date/format-date.js", 730);
DateFormat.MinuteSegment.prototype.toString = function() { 
    _yuitest_coverfunc("build/format-date/format-date.js", "toString", 730);
_yuitest_coverline("build/format-date/format-date.js", 731);
return "timeMinute: \""+this._s+'"'; 
};

// Public methods

_yuitest_coverline("build/format-date/format-date.js", 736);
DateFormat.MinuteSegment.prototype.format = function(date) {
    _yuitest_coverfunc("build/format-date/format-date.js", "format", 736);
_yuitest_coverline("build/format-date/format-date.js", 737);
var minutes = date.getMinutes();
    _yuitest_coverline("build/format-date/format-date.js", 738);
return zeroPad(minutes, this._s.length);
};

//
// Time second segment class
//

_yuitest_coverline("build/format-date/format-date.js", 745);
DateFormat.SecondSegment = function(format, s) {
    _yuitest_coverfunc("build/format-date/format-date.js", "SecondSegment", 745);
_yuitest_coverline("build/format-date/format-date.js", 746);
if (arguments.length == 0) {return;}
    _yuitest_coverline("build/format-date/format-date.js", 747);
Format.Segment.call(this, format, s);
};
_yuitest_coverline("build/format-date/format-date.js", 749);
DateFormat.SecondSegment.prototype = new DateFormat.TimeSegment;
_yuitest_coverline("build/format-date/format-date.js", 750);
DateFormat.SecondSegment.prototype.constructor = DateFormat.SecondSegment;

// Public methods

_yuitest_coverline("build/format-date/format-date.js", 754);
DateFormat.SecondSegment.prototype.format = function(date) {
    _yuitest_coverfunc("build/format-date/format-date.js", "format", 754);
_yuitest_coverline("build/format-date/format-date.js", 755);
var minutes = /s/.test(this._s) ? date.getSeconds() : date.getMilliseconds();
    _yuitest_coverline("build/format-date/format-date.js", 756);
return zeroPad(minutes, this._s.length);
};

//
// Time am/pm segment class
//

_yuitest_coverline("build/format-date/format-date.js", 763);
DateFormat.AmPmSegment = function(format, s) {
    _yuitest_coverfunc("build/format-date/format-date.js", "AmPmSegment", 763);
_yuitest_coverline("build/format-date/format-date.js", 764);
if (arguments.length == 0) {return;}
    _yuitest_coverline("build/format-date/format-date.js", 765);
Format.Segment.call(this, format, s);
};
_yuitest_coverline("build/format-date/format-date.js", 767);
DateFormat.AmPmSegment.prototype = new DateFormat.TimeSegment;
_yuitest_coverline("build/format-date/format-date.js", 768);
DateFormat.AmPmSegment.prototype.constructor = DateFormat.AmPmSegment;

_yuitest_coverline("build/format-date/format-date.js", 770);
DateFormat.AmPmSegment.prototype.toString = function() { 
    _yuitest_coverfunc("build/format-date/format-date.js", "toString", 770);
_yuitest_coverline("build/format-date/format-date.js", 771);
return "timeAmPm: \""+this._s+'"'; 
};

// Public methods

_yuitest_coverline("build/format-date/format-date.js", 776);
DateFormat.AmPmSegment.prototype.format = function(date) {
    _yuitest_coverfunc("build/format-date/format-date.js", "format", 776);
_yuitest_coverline("build/format-date/format-date.js", 777);
var hours = date.getHours();
    _yuitest_coverline("build/format-date/format-date.js", 778);
return hours < 12 ? this.getFormat().Formats.periodAm : this.getFormat().Formats.periodPm;
};

//
// Time timezone segment class
//

_yuitest_coverline("build/format-date/format-date.js", 785);
DateFormat.TimezoneSegment = function(format, s) {
    _yuitest_coverfunc("build/format-date/format-date.js", "TimezoneSegment", 785);
_yuitest_coverline("build/format-date/format-date.js", 786);
if (arguments.length == 0) {return;}
    _yuitest_coverline("build/format-date/format-date.js", 787);
Format.Segment.call(this, format, s);
};
_yuitest_coverline("build/format-date/format-date.js", 789);
DateFormat.TimezoneSegment.prototype = new DateFormat.TimeSegment;
_yuitest_coverline("build/format-date/format-date.js", 790);
DateFormat.TimezoneSegment.prototype.constructor = DateFormat.TimezoneSegment;

_yuitest_coverline("build/format-date/format-date.js", 792);
DateFormat.TimezoneSegment.prototype.toString = function() { 
    _yuitest_coverfunc("build/format-date/format-date.js", "toString", 792);
_yuitest_coverline("build/format-date/format-date.js", 793);
return "timeTimezone: \""+this._s+'"'; 
};

// Public methods

_yuitest_coverline("build/format-date/format-date.js", 798);
DateFormat.TimezoneSegment.prototype.format = function(date) {
    _yuitest_coverfunc("build/format-date/format-date.js", "format", 798);
_yuitest_coverline("build/format-date/format-date.js", 799);
if (/Z/.test(this._s)) {
        _yuitest_coverline("build/format-date/format-date.js", 800);
return this.getFormat().timeZone.getShortName();
    }
    _yuitest_coverline("build/format-date/format-date.js", 802);
return this._s.length < 4 ? this.getFormat().timeZone.getMediumName() : this.getFormat().timeZone.getLongName();
};
    
//
// Non-Gregorian Calendars
//
    
//Buddhist Calendar. This is normally used only for Thai locales (th).
_yuitest_coverline("build/format-date/format-date.js", 810);
BuddhistDateFormat = function(pattern, formats, timeZoneId, locale) {
    _yuitest_coverfunc("build/format-date/format-date.js", "BuddhistDateFormat", 810);
_yuitest_coverline("build/format-date/format-date.js", 811);
if (arguments.length == 0) {return;}
    _yuitest_coverline("build/format-date/format-date.js", 812);
DateFormat.call(this, pattern, formats, timeZoneId, locale);
        
    //Iterate through _segments, and replace the ones that are different for Buddhist Calendar
    _yuitest_coverline("build/format-date/format-date.js", 815);
var segments = this._segments;
    _yuitest_coverline("build/format-date/format-date.js", 816);
for(var i=0; i<segments.length; i++) {
        _yuitest_coverline("build/format-date/format-date.js", 817);
if(segments[i] instanceof DateFormat.YearSegment) {
            _yuitest_coverline("build/format-date/format-date.js", 818);
segments[i] = new BuddhistDateFormat.YearSegment(segments[i]);
        } else {_yuitest_coverline("build/format-date/format-date.js", 819);
if (segments[i] instanceof DateFormat.EraSegment) {
            _yuitest_coverline("build/format-date/format-date.js", 820);
segments[i] = new BuddhistDateFormat.EraSegment(segments[i]);
        }}
    }
}
    
_yuitest_coverline("build/format-date/format-date.js", 825);
BuddhistDateFormat.prototype = new DateFormat;
_yuitest_coverline("build/format-date/format-date.js", 826);
BuddhistDateFormat.prototype.constructor = BuddhistDateFormat;
    
//Override YearSegment class for Buddhist Calender
_yuitest_coverline("build/format-date/format-date.js", 829);
BuddhistDateFormat.YearSegment = function(segment) {
    _yuitest_coverfunc("build/format-date/format-date.js", "YearSegment", 829);
_yuitest_coverline("build/format-date/format-date.js", 830);
if (arguments.length == 0) {return;}
    _yuitest_coverline("build/format-date/format-date.js", 831);
DateFormat.YearSegment.call(this, segment._parent, segment._s);
};
    
_yuitest_coverline("build/format-date/format-date.js", 834);
BuddhistDateFormat.YearSegment.prototype = new DateFormat.YearSegment;
_yuitest_coverline("build/format-date/format-date.js", 835);
BuddhistDateFormat.YearSegment.prototype.constructor = BuddhistDateFormat.YearSegment;

_yuitest_coverline("build/format-date/format-date.js", 837);
BuddhistDateFormat.YearSegment.prototype.format = function(date) { 
    _yuitest_coverfunc("build/format-date/format-date.js", "format", 837);
_yuitest_coverline("build/format-date/format-date.js", 838);
var year = date.getFullYear();
    _yuitest_coverline("build/format-date/format-date.js", 839);
year = String(year + 543);      //Buddhist Calendar epoch is in 543 BC
    _yuitest_coverline("build/format-date/format-date.js", 840);
return this._s.length != 1 && this._s.length < 4 ? year.substr(year.length - 2) : zeroPad(year, this._s.length);
};
    
//Override EraSegment class for Buddhist Calender
_yuitest_coverline("build/format-date/format-date.js", 844);
BuddhistDateFormat.EraSegment = function(segment) {
    _yuitest_coverfunc("build/format-date/format-date.js", "EraSegment", 844);
_yuitest_coverline("build/format-date/format-date.js", 845);
if (arguments.length == 0) {return;}
    _yuitest_coverline("build/format-date/format-date.js", 846);
DateFormat.EraSegment.call(this, segment._parent, segment._s);
};
    
_yuitest_coverline("build/format-date/format-date.js", 849);
BuddhistDateFormat.EraSegment.prototype = new DateFormat.EraSegment;
_yuitest_coverline("build/format-date/format-date.js", 850);
BuddhistDateFormat.EraSegment.prototype.constructor = BuddhistDateFormat.EraSegment;

_yuitest_coverline("build/format-date/format-date.js", 852);
BuddhistDateFormat.EraSegment.prototype.format = function(date) { 
    _yuitest_coverfunc("build/format-date/format-date.js", "format", 852);
_yuitest_coverline("build/format-date/format-date.js", 853);
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
_yuitest_coverline("build/format-date/format-date.js", 868);
Y.DateFormat = function(timeZone, dateFormat, timeFormat, timeZoneFormat) {
        
    _yuitest_coverfunc("build/format-date/format-date.js", "DateFormat", 868);
_yuitest_coverline("build/format-date/format-date.js", 870);
if(timeZone == null) {
        _yuitest_coverline("build/format-date/format-date.js", 871);
timeZone = "Etc/GMT";
    }

    _yuitest_coverline("build/format-date/format-date.js", 874);
this._Formats = Y.Intl.get(MODULE_NAME);
        
    //If not valid time zone
    _yuitest_coverline("build/format-date/format-date.js", 877);
if(!Y.TimeZone.isValidTimezoneId(timeZone)) {
        _yuitest_coverline("build/format-date/format-date.js", 878);
throw new Y.TimeZone.UnknownTimeZoneException("Could not find timezone: " + timeZone);
    }

    _yuitest_coverline("build/format-date/format-date.js", 881);
this._timeZone = timeZone;
    _yuitest_coverline("build/format-date/format-date.js", 882);
this._timeZoneInstance = new Y.TimeZone(this._timeZone);

    _yuitest_coverline("build/format-date/format-date.js", 884);
this._dateFormat = dateFormat;
    _yuitest_coverline("build/format-date/format-date.js", 885);
this._timeFormat = timeFormat;
    _yuitest_coverline("build/format-date/format-date.js", 886);
this._timeZoneFormat = timeZoneFormat;

    _yuitest_coverline("build/format-date/format-date.js", 888);
this._relative = false;
    _yuitest_coverline("build/format-date/format-date.js", 889);
this._pattern = this._generatePattern();

    _yuitest_coverline("build/format-date/format-date.js", 891);
var locale = Y.Intl.getLang(MODULE_NAME);
        
    _yuitest_coverline("build/format-date/format-date.js", 893);
if(locale.match(/^th/) && !locale.match(/u-ca-gregory/)) {
        //Use buddhist calendar
        _yuitest_coverline("build/format-date/format-date.js", 895);
this._dateFormatInstance = new BuddhistDateFormat(this._pattern, this._Formats, this._timeZone);
    } else {
        //Use gregorian calendar
        _yuitest_coverline("build/format-date/format-date.js", 898);
this._dateFormatInstance = new DateFormat(this._pattern, this._Formats, this._timeZone);
    }        
}

//Selector values
_yuitest_coverline("build/format-date/format-date.js", 903);
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

_yuitest_coverline("build/format-date/format-date.js", 926);
Y.DateFormat.TIME_FORMATS = {
    NONE: 0,
    HM_ABBREVIATED: 1,
    HM_SHORT: 2,
    H_ABBREVIATED: 4
}

_yuitest_coverline("build/format-date/format-date.js", 933);
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
_yuitest_coverline("build/format-date/format-date.js", 945);
Y.DateFormat.availableLanguages = function() {
    _yuitest_coverfunc("build/format-date/format-date.js", "availableLanguages", 945);
_yuitest_coverline("build/format-date/format-date.js", 946);
return Y.Intl.getAvailableLangs(MODULE_NAME);
}

//Private methods

/**
 * Generate date pattern for selected format
 * @return {String} Date pattern for internal use.
 */
_yuitest_coverline("build/format-date/format-date.js", 955);
Y.DateFormat.prototype._generateDatePattern = function() {
    _yuitest_coverfunc("build/format-date/format-date.js", "_generateDatePattern", 955);
_yuitest_coverline("build/format-date/format-date.js", 956);
var format = this._dateFormat;
    _yuitest_coverline("build/format-date/format-date.js", 957);
if(format == null) {return "";}
    _yuitest_coverline("build/format-date/format-date.js", 958);
if(format & Y.DateFormat.DATE_FORMATS.RELATIVE_DATE) {
        _yuitest_coverline("build/format-date/format-date.js", 959);
this._relative = true;
        _yuitest_coverline("build/format-date/format-date.js", 960);
format = format ^ Y.DateFormat.DATE_FORMATS.RELATIVE_DATE;
    }
    _yuitest_coverline("build/format-date/format-date.js", 962);
switch(format) {
        //Use relative only for formats with day component
        case Y.DateFormat.DATE_FORMATS.NONE:
            _yuitest_coverline("build/format-date/format-date.js", 965);
this._relative = false;
            _yuitest_coverline("build/format-date/format-date.js", 966);
return "";
        case Y.DateFormat.DATE_FORMATS.WYMD_LONG:
            _yuitest_coverline("build/format-date/format-date.js", 968);
return this._Formats.WYMD_long;
        case Y.DateFormat.DATE_FORMATS.WYMD_ABBREVIATED:
            _yuitest_coverline("build/format-date/format-date.js", 970);
return this._Formats.WYMD_abbreviated;
        case Y.DateFormat.DATE_FORMATS.WYMD_SHORT:
            _yuitest_coverline("build/format-date/format-date.js", 972);
return this._Formats.WYMD_short;
        case Y.DateFormat.DATE_FORMATS.WMD_LONG:
            _yuitest_coverline("build/format-date/format-date.js", 974);
return this._Formats.WMD_long;
        case Y.DateFormat.DATE_FORMATS.WMD_ABBREVIATED:
            _yuitest_coverline("build/format-date/format-date.js", 976);
return this._Formats.WMD_abbreviated;
        case Y.DateFormat.DATE_FORMATS.WMD_SHORT:
            _yuitest_coverline("build/format-date/format-date.js", 978);
return this._Formats.WMD_short;
        case Y.DateFormat.DATE_FORMATS.YMD_LONG:
            _yuitest_coverline("build/format-date/format-date.js", 980);
return this._Formats.YMD_long;
        case Y.DateFormat.DATE_FORMATS.YMD_ABBREVIATED:
            _yuitest_coverline("build/format-date/format-date.js", 982);
return this._Formats.YMD_abbreviated;
        case Y.DateFormat.DATE_FORMATS.YMD_SHORT:
            _yuitest_coverline("build/format-date/format-date.js", 984);
return this._Formats.YMD_short;
        case Y.DateFormat.DATE_FORMATS.YM_LONG:
            _yuitest_coverline("build/format-date/format-date.js", 986);
this._relative = false;
            _yuitest_coverline("build/format-date/format-date.js", 987);
return this._Formats.YM_long;
        case Y.DateFormat.DATE_FORMATS.MD_LONG:
            _yuitest_coverline("build/format-date/format-date.js", 989);
return this._Formats.MD_long;
        case Y.DateFormat.DATE_FORMATS.MD_ABBREVIATED:
            _yuitest_coverline("build/format-date/format-date.js", 991);
return this._Formats.MD_abbreviated;
        case Y.DateFormat.DATE_FORMATS.MD_SHORT:
            _yuitest_coverline("build/format-date/format-date.js", 993);
return this._Formats.MD_short;
        case Y.DateFormat.DATE_FORMATS.W_LONG:
            _yuitest_coverline("build/format-date/format-date.js", 995);
this._relative = false;
            _yuitest_coverline("build/format-date/format-date.js", 996);
return this._Formats.W_long;
        case Y.DateFormat.DATE_FORMATS.W_ABBREVIATED:
            _yuitest_coverline("build/format-date/format-date.js", 998);
this._relative = false;
            _yuitest_coverline("build/format-date/format-date.js", 999);
return this._Formats.W_abbreviated;
        case Y.DateFormat.DATE_FORMATS.M_LONG:
            _yuitest_coverline("build/format-date/format-date.js", 1001);
this._relative = false;
            _yuitest_coverline("build/format-date/format-date.js", 1002);
return this._Formats.M_long;
        case Y.DateFormat.DATE_FORMATS.M_ABBREVIATED:
            _yuitest_coverline("build/format-date/format-date.js", 1004);
this._relative = false;
            _yuitest_coverline("build/format-date/format-date.js", 1005);
return this._Formats.M_abbreviated;
        case Y.DateFormat.DATE_FORMATS.YMD_FULL:
            _yuitest_coverline("build/format-date/format-date.js", 1007);
return this._Formats.YMD_full;
        default:
            _yuitest_coverline("build/format-date/format-date.js", 1009);
throw new Format.IllegalArgumentsException("Date format given does not exist");	//Error no such pattern.
    }
}
    
/**
 * Generate time pattern for selected format
 * @return {String} Time pattern for internal use.
 */
_yuitest_coverline("build/format-date/format-date.js", 1017);
Y.DateFormat.prototype._generateTimePattern = function() {
    _yuitest_coverfunc("build/format-date/format-date.js", "_generateTimePattern", 1017);
_yuitest_coverline("build/format-date/format-date.js", 1018);
var format = this._timeFormat;
    _yuitest_coverline("build/format-date/format-date.js", 1019);
if(format == null) {return "";}
    _yuitest_coverline("build/format-date/format-date.js", 1020);
switch(format) {
        case Y.DateFormat.TIME_FORMATS.NONE:
            _yuitest_coverline("build/format-date/format-date.js", 1022);
return "";
        case Y.DateFormat.TIME_FORMATS.HM_ABBREVIATED:
            _yuitest_coverline("build/format-date/format-date.js", 1024);
return this._Formats.HM_abbreviated;
        case Y.DateFormat.TIME_FORMATS.HM_SHORT:
            _yuitest_coverline("build/format-date/format-date.js", 1026);
return this._Formats.HM_short;
        case Y.DateFormat.TIME_FORMATS.H_ABBREVIATED:
            _yuitest_coverline("build/format-date/format-date.js", 1028);
return this._Formats.H_abbreviated;
        default:
            _yuitest_coverline("build/format-date/format-date.js", 1030);
throw new Format.IllegalArgumentsException("Time format given does not exist");	//Error no such pattern.
    }
}
    
/**
 * Generate time-zone pattern for selected format
 * @return {String} Time-Zone pattern for internal use.
 */
_yuitest_coverline("build/format-date/format-date.js", 1038);
Y.DateFormat.prototype._generateTimeZonePattern = function() {
    _yuitest_coverfunc("build/format-date/format-date.js", "_generateTimeZonePattern", 1038);
_yuitest_coverline("build/format-date/format-date.js", 1039);
var format = this._timeZoneFormat;
    _yuitest_coverline("build/format-date/format-date.js", 1040);
if(format == null) {return "";}
    _yuitest_coverline("build/format-date/format-date.js", 1041);
switch(format) {
        case Y.DateFormat.TIMEZONE_FORMATS.NONE:
            _yuitest_coverline("build/format-date/format-date.js", 1043);
return "";
        case Y.DateFormat.TIMEZONE_FORMATS.Z_ABBREVIATED:
            _yuitest_coverline("build/format-date/format-date.js", 1045);
return "z";
        case Y.DateFormat.TIMEZONE_FORMATS.Z_SHORT:
            _yuitest_coverline("build/format-date/format-date.js", 1047);
return "Z";
        default:
            _yuitest_coverline("build/format-date/format-date.js", 1049);
throw new Format.IllegalArgumentsException("Time Zone format given does not exist");	//Error no such pattern.
    }
}
    
/**
 * Generate pattern for selected date, time and time-zone formats
 * @return {String} Combined pattern for date, time and time-zone for internal use.
 */
_yuitest_coverline("build/format-date/format-date.js", 1057);
Y.DateFormat.prototype._generatePattern = function() {
    _yuitest_coverfunc("build/format-date/format-date.js", "_generatePattern", 1057);
_yuitest_coverline("build/format-date/format-date.js", 1058);
var datePattern = this._generateDatePattern();
    _yuitest_coverline("build/format-date/format-date.js", 1059);
var timePattern = this._generateTimePattern();
    _yuitest_coverline("build/format-date/format-date.js", 1060);
var timeZonePattern = this._generateTimeZonePattern();

    //Combine patterns. Mark date pattern part, to use with relative dates.
    _yuitest_coverline("build/format-date/format-date.js", 1063);
if(datePattern != "") {
        _yuitest_coverline("build/format-date/format-date.js", 1064);
datePattern = "'<datePattern>'" + datePattern + "'</datePattern>'";
    }
        
    _yuitest_coverline("build/format-date/format-date.js", 1067);
var pattern = "";
    _yuitest_coverline("build/format-date/format-date.js", 1068);
if(timePattern != "" && timeZonePattern != "") {
        _yuitest_coverline("build/format-date/format-date.js", 1069);
pattern = this._Formats.DateTimeTimezoneCombination;
    } else {_yuitest_coverline("build/format-date/format-date.js", 1070);
if (timePattern != "") {
        _yuitest_coverline("build/format-date/format-date.js", 1071);
pattern = this._Formats.DateTimeCombination;
    } else {_yuitest_coverline("build/format-date/format-date.js", 1072);
if(timeZonePattern != "") {
        _yuitest_coverline("build/format-date/format-date.js", 1073);
pattern = this._Formats.DateTimezoneCombination;
    } else {_yuitest_coverline("build/format-date/format-date.js", 1074);
if(datePattern != ""){
        //Just date
        _yuitest_coverline("build/format-date/format-date.js", 1076);
pattern = "{1}";
    }}}}
        
    _yuitest_coverline("build/format-date/format-date.js", 1079);
pattern = pattern.replace("{0}", timePattern).replace("{1}", datePattern).replace("{2}", timeZonePattern);
        
    //Remove unnecessary whitespaces
    _yuitest_coverline("build/format-date/format-date.js", 1082);
pattern = pattern.replace(/\s\s+/g, " ").replace(/^\s+/, "").replace(/\s+$/, "");

    _yuitest_coverline("build/format-date/format-date.js", 1084);
return pattern;
}

//public methods

/**
 * Formats a time value.
 * @param {Date} date The time value to be formatted. If no valid Date object is provided, an Error exception is thrown.
 * @return {String} The formatted string
 */
_yuitest_coverline("build/format-date/format-date.js", 1094);
Y.DateFormat.prototype.format = function(date) {
    _yuitest_coverfunc("build/format-date/format-date.js", "format", 1094);
_yuitest_coverline("build/format-date/format-date.js", 1095);
if(date == null) {
        _yuitest_coverline("build/format-date/format-date.js", 1096);
throw new Y.DateFormat.IllegalArgumentsException("No date provided.");
    }
        
    _yuitest_coverline("build/format-date/format-date.js", 1099);
var offset = this._timeZoneInstance.getRawOffset() * 1000;
    _yuitest_coverline("build/format-date/format-date.js", 1100);
date = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000 + offset);
        
    _yuitest_coverline("build/format-date/format-date.js", 1102);
var relativeDate = null;
    _yuitest_coverline("build/format-date/format-date.js", 1103);
if(this._relative) {
        _yuitest_coverline("build/format-date/format-date.js", 1104);
var today = new Date();
        _yuitest_coverline("build/format-date/format-date.js", 1105);
var tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        _yuitest_coverline("build/format-date/format-date.js", 1106);
var yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

        _yuitest_coverline("build/format-date/format-date.js", 1108);
if(date.getFullYear() == today.getFullYear() && date.getMonth() == today.getMonth() && date.getDate() == today.getDate()) {
            _yuitest_coverline("build/format-date/format-date.js", 1109);
relativeDate = this._Formats.today;
        }

        _yuitest_coverline("build/format-date/format-date.js", 1112);
if(date.getFullYear() == tomorrow.getFullYear() && date.getMonth() == tomorrow.getMonth() && date.getDate() == tomorrow.getDate()) {
            _yuitest_coverline("build/format-date/format-date.js", 1113);
relativeDate = this._Formats.tomorrow;
        }

        _yuitest_coverline("build/format-date/format-date.js", 1116);
if(date.getFullYear() == yesterday.getFullYear() && date.getMonth() == yesterday.getMonth() && date.getDate() == yesterday.getDate()) {
            _yuitest_coverline("build/format-date/format-date.js", 1117);
relativeDate = this._Formats.yesterday;
        }
    }
    _yuitest_coverline("build/format-date/format-date.js", 1120);
return this._dateFormatInstance.format(date, relativeDate);
}


}, '@VERSION@', {"lang": ["af-NA", "af", "af-ZA", "am-ET", "am", "ar-AE", "ar-BH", "ar-DZ", "ar-EG", "ar-IQ", "ar-JO", "ar-KW", "ar-LB", "ar-LY", "ar-MA", "ar-OM", "ar-QA", "ar-SA", "ar-SD", "ar-SY", "ar-TN", "ar", "ar-YE", "as-IN", "as", "az-AZ", "az-Cyrl-AZ", "az-Cyrl", "az-Latn-AZ", "az-Latn", "az", "be-BY", "be", "bg-BG", "bg", "bn-BD", "bn-IN", "bn", "bo-CN", "bo-IN", "bo", "ca-ES", "ca", "cs-CZ", "cs", "cy-GB", "cy", "da-DK", "da", "de-AT", "de-BE", "de-CH", "de-DE", "de-LI", "de-LU", "de", "el-CY", "el-GR", "el", "en-AU", "en-BE", "en-BW", "en-BZ", "en-CA", "en-GB", "en-HK", "en-IE", "en-IN", "en-JM", "en-JO", "en-MH", "en-MT", "en-MY", "en-NA", "en-NZ", "en-PH", "en-PK", "en-RH", "en-SG", "en-TT", "en", "en-US-POSIX", "en-US", "en-VI", "en-ZA", "en-ZW", "eo", "es-AR", "es-BO", "es-CL", "es-CO", "es-CR", "es-DO", "es-EC", "es-ES", "es-GT", "es-HN", "es-MX", "es-NI", "es-PA", "es-PE", "es-PR", "es-PY", "es-SV", "es", "es-US", "es-UY", "es-VE", "et-EE", "et", "eu-ES", "eu", "fa-AF", "fa-IR", "fa", "fi-FI", "fi", "fil-PH", "fil", "fo-FO", "fo", "fr-BE", "fr-CA", "fr-CH", "fr-FR", "fr-LU", "fr-MC", "fr-SN", "fr", "ga-IE", "ga", "gl-ES", "gl", "gsw-CH", "gsw", "gu-IN", "gu", "gv-GB", "gv", "ha-GH", "ha-Latn-GH", "ha-Latn-NE", "ha-Latn-NG", "ha-Latn", "ha-NE", "ha-NG", "ha", "haw", "haw-US", "he-IL", "he", "hi-IN", "hi", "hr-HR", "hr", "hu-HU", "hu", "hy-AM-REVISED", "hy-AM", "hy", "id-ID", "id", "ii-CN", "ii", "in-ID", "in", "is-IS", "is", "it-CH", "it-IT", "it", "iw-IL", "iw", "ja-JP-TRADITIONAL", "ja-JP", "ja", "ka-GE", "ka", "kk-Cyrl-KZ", "kk-Cyrl", "kk-KZ", "kk", "kl-GL", "kl", "km-KH", "km", "kn-IN", "kn", "kok-IN", "kok", "ko-KR", "ko", "kw-GB", "kw", "lt-LT", "lt", "lv-LV", "lv", "mk-MK", "mk", "ml-IN", "ml", "mr-IN", "mr", "ms-BN", "ms-MY", "ms", "mt-MT", "mt", "nb-NO", "nb", "ne-IN", "ne-NP", "ne", "nl-BE", "nl-NL", "nl", "nn-NO", "nn", "no-NO-NY", "no-NO", "no", "om-ET", "om-KE", "om", "or-IN", "or", "pa-Arab-PK", "pa-Arab", "pa-Guru-IN", "pa-Guru", "pa-IN", "pa-PK", "pa", "pl-PL", "pl", "ps-AF", "ps", "pt-BR", "pt-PT", "pt", "ro-MD", "ro-RO", "ro", "ru-RU", "ru", "ru-UA", "sh-BA", "sh-CS", "sh", "sh-YU", "si-LK", "si", "sk-SK", "sk", "sl-SI", "sl", "so-DJ", "so-ET", "so-KE", "so-SO", "so", "sq-AL", "sq", "sr-BA", "sr-CS", "sr-Cyrl-BA", "sr-Cyrl-CS", "sr-Cyrl-ME", "sr-Cyrl-RS", "sr-Cyrl", "sr-Cyrl-YU", "sr-Latn-BA", "sr-Latn-CS", "sr-Latn-ME", "sr-Latn-RS", "sr-Latn", "sr-Latn-YU", "sr-ME", "sr-RS", "sr", "sr-YU", "sv-FI", "sv-SE", "sv", "sw-KE", "sw", "sw-TZ", "ta-IN", "ta", "te-IN", "te", "th-TH-TRADITIONAL", "th-TH", "th", "ti-ER", "ti-ET", "ti", "tl-PH", "tl", "tr-TR", "tr", "uk", "uk-UA", "ur-IN", "ur-PK", "ur", "uz-AF", "uz-Arab-AF", "uz-Arab", "uz-Cyrl", "uz-Cyrl-UZ", "uz-Latn", "uz-Latn-UZ", "uz", "uz-UZ", "vi", "vi-VN", "zh-CN", "zh-Hans-CN", "zh-Hans-HK", "zh-Hans-MO", "zh-Hans-SG", "zh-Hans", "zh-Hant-HK", "zh-Hant-MO", "zh-Hant-TW", "zh-Hant", "zh-HK", "zh-MO", "zh-SG", "zh-TW", "zh", "zu", "zu-ZA"], "requires": ["timezone"]});
