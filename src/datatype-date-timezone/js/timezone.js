/**
 * Timezone performs operations on a given timezone string represented in Olson tz database 
 * This module uses parts of zimbra AjxTimezone to handle time-zones
 * @module yTimezone
 * @requires tzoneData, tzoneLinks, yDateFormatData
 */

var MODULE_NAME = "datatype-date-timezone";
    
AjxTimezone = function() {
    this.localeData = Y.Intl.get(MODULE_NAME);
};

//
// Static methods
//

AjxTimezone.getTransition = function(onset, year) {
    var trans = [ year || new Date().getFullYear(), onset.mon, 1 ];
    if (onset.mday) {
        trans[2] = onset.mday;
    }
    else if (onset.wkday) {
        var date = new Date(year, onset.mon - 1, 1, onset.hour, onset.min, onset.sec);

        // last wkday of month
        var wkday, adjust;
        if (onset.week == -1) {
            // NOTE: This creates a date of the *last* day of specified month by
            //       setting the month to *next* month and setting day of month
            //       to zero (i.e. the day *before* the first day).
            var last = new Date(new Date(date.getTime()).setMonth(onset.mon, 0));
            var count = last.getDate();
            wkday = last.getDay() + 1;
            adjust = wkday >= onset.wkday ? wkday - onset.wkday : 7 - onset.wkday - wkday;
            trans[2] = count - adjust;
        }

        // Nth wkday of month
        else {
            wkday = date.getDay() + 1;
            adjust = onset.wkday == wkday ? 1 :0;
            trans[2] = onset.wkday + 7 * (onset.week - adjust) - wkday + 1;
        }
    }
    return trans;
};

AjxTimezone.addWkDayTransition = function(onset) {
    var trans = onset.trans;
    var mon = trans[1];
    var monDay = trans[2];
    var week = Math.floor((monDay - 1) / 7);
    var date = new Date(trans[0], trans[1] - 1, trans[2], 12, 0, 0);

    // NOTE: This creates a date of the *last* day of specified month by
    //       setting the month to *next* month and setting day of month
    //       to zero (i.e. the day *before* the first day).
    var count = new Date(new Date(date.getTime()).setMonth(mon - 1, 0)).getDate();
    var last = count - monDay < 7;

    // set onset values
    onset.mon =  mon;
    onset.week = last ? -1 : week + 1;
    onset.wkday = date.getDay() + 1;
    onset.hour = trans[3];
    onset.min = trans[4];
    onset.sec = trans[5];
    return onset;
};

AjxTimezone.createTransitionDate = function(onset) {
    var date = new Date(TimezoneData.TRANSITION_YEAR, onset.mon - 1, 1, 12, 0, 0);
    if (onset.mday) {
        date.setDate(onset.mday);
    }
    else if (onset.week == -1) {
        date.setMonth(date.getMonth() + 1, 0);
        for (var i = 0; i < 7; i++) {
            if (date.getDay() + 1 == onset.wkday) {
                break;
            }
            date.setDate(date.getDate() - 1);
        }
    }
    else {
        for (i = 0; i < 7; i++) {
            if (date.getDay() + 1 == onset.wkday) {
                break;
            }
            date.setDate(date.getDate() + 1);
        }
        date.setDate(date.getDate() + 7 * (onset.week - 1));
    }
    var trans = [ date.getFullYear(), date.getMonth() + 1, date.getDate() ];
    return trans;
};

AjxTimezone.prototype.getShortName = function(tzId) {
    var shortName = this.localeData[tzId + "_Z_short"] || ["GMT",AjxTimezone._SHORT_NAMES[tzId]].join("");
    return shortName;
};
AjxTimezone.prototype.getMediumName = function(tzId) {
    var mediumName = this.localeData[tzId + "_Z_abbreviated"] || ['(',this.getShortName(tzId),') ',tzId].join("");
    return mediumName;
};
AjxTimezone.prototype.getLongName = AjxTimezone.prototype.getMediumName;

AjxTimezone.addRule = function(rule) {
    var tzId = rule.tzId;

    AjxTimezone._SHORT_NAMES[tzId] = AjxTimezone._generateShortName(rule.standard.offset);
    AjxTimezone._CLIENT2RULE[tzId] = rule;

    var array = rule.daylight ? AjxTimezone.DAYLIGHT_RULES : AjxTimezone.STANDARD_RULES;
    array.push(rule);
};

AjxTimezone.getRule = function(tzId, tz) {
    var rule = AjxTimezone._CLIENT2RULE[tzId];
    if (!rule && tz) {
        var names = [ "standard", "daylight" ];
        var rules = tz.daylight ? AjxTimezone.DAYLIGHT_RULES : AjxTimezone.STANDARD_RULES;
        for (var i = 0; i < rules.length; i++) {
            rule = rules[i];

            var found = true;
            for (var j = 0; j < names.length; j++) {
                var name = names[j];
                var onset = rule[name];
                if (!onset) continue;
			
                var breakOuter = false;

                for (var p in tz[name]) {
                    if (tz[name][p] != onset[p]) {
                        found = false;
                        breakOuter = true;
                        break;
                    }
                }
                
                if(breakOuter){
                    break;
                }
            }
            if (found) {
                return rule;
            }
        }
        return null;
    }

    return rule;
};

AjxTimezone.getOffset = function(tzId, date) {
    var rule = AjxTimezone.getRule(tzId);
    if (rule && rule.daylight) {
        var year = date.getFullYear();

        var standard = rule.standard, daylight  = rule.daylight;
        var stdTrans = AjxTimezone.getTransition(standard, year);
        var dstTrans = AjxTimezone.getTransition(daylight, year);

        var month    = date.getMonth()+1, day = date.getDate();
        var stdMonth = stdTrans[1], stdDay = stdTrans[2];
        var dstMonth = dstTrans[1], dstDay = dstTrans[2];

        // northern hemisphere
        var isDST = false;
        if (dstMonth < stdMonth) {
            isDST = month > dstMonth && month < stdMonth;
            isDST = isDST || (month == dstMonth && day >= dstDay);
            isDST = isDST || (month == stdMonth && day <  stdDay);
        }

        // sorthern hemisphere
        else {
            isDST = month < dstMonth || month > stdMonth;
            isDST = isDST || (month == dstMonth && day <  dstDay);
            isDST = isDST || (month == stdMonth && day >= stdDay);
        }

        return isDST ? daylight.offset : standard.offset;
    }
    return rule ? rule.standard.offset : -(new Date().getTimezoneOffset());
};

AjxTimezone._BY_OFFSET = function(arule, brule) {
    // sort by offset and then by name
    var delta = arule.standard.offset - brule.standard.offset;
    if (delta == 0) {
        var aname = arule.tzId;
        var bname = brule.tzId;
        if (aname < bname) delta = -1;
        else if (aname > bname) delta = 1;
    }
    return delta;
};

// Constants

AjxTimezone._SHORT_NAMES = {};
AjxTimezone._CLIENT2RULE = {};

/** 
 * The data is specified using the server identifiers for historical
 * reasons. Perhaps in the future we'll use the client (i.e. Java)
 * identifiers on the server as well.
 */
AjxTimezone.STANDARD_RULES = [];
AjxTimezone.DAYLIGHT_RULES = [];
(function() {
    for (var i = 0; i < TimezoneData.TIMEZONE_RULES.length; i++) {
        var rule = TimezoneData.TIMEZONE_RULES[i];
        var array = rule.daylight ? AjxTimezone.DAYLIGHT_RULES : AjxTimezone.STANDARD_RULES;
        array.push(rule);
    }
})();

AjxTimezone._generateShortName = function(offset, period) {
    if (offset == 0) return "";
    var sign = offset < 0 ? "-" : "+";
    var stdOffset = Math.abs(offset);
    var hours = Math.floor(stdOffset / 60);
    var minutes = stdOffset % 60;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return [sign,hours,period?".":"",minutes].join("");
};

(function() {
    TimezoneData.TIMEZONE_RULES.sort(AjxTimezone._BY_OFFSET);
    for (var j = 0; j < TimezoneData.TIMEZONE_RULES.length; j++) {
        var rule = TimezoneData.TIMEZONE_RULES[j];
        AjxTimezone.addRule(rule);
    }
})();

Array.prototype.indexOf = function(obj) {
    for(var i=0; i<this.length; i++) {
        if(this[i] == obj) {
            return i;
        }
    }
    return -1;
}

AjxTimezone.getCurrentTimezoneIds = function(rawOffset) {
    rawOffset = rawOffset/60;	//Need offset in minutes
    var result = [];
    var today = new Date();
    for(tzId in AjxTimezone._CLIENT2RULE) {
        if(rawOffset == 0 || AjxTimezone.getOffset(tzId, today) == rawOffset) {
            result.push(tzId);
        }
    }

    for(link in TimezoneLinks) {
        if(result.indexOf(TimezoneLinks[link]) != -1) {
            result.push(link);
        }
    }
    return result;
}

AjxTimezone.getTimezoneIdForOffset = function(rawOffset) {
    rawOffset = rawOffset/60;	//Need offset in minutes

    if(rawOffset % 60 == 0) {
        var etcGMTId = "Etc/GMT";
        if(rawOffset != 0) {
            etcGMTId += (rawOffset > 0? "-": "+") + rawOffset/60;
        }

        if(AjxTimezone._CLIENT2RULE[etcGMTId] != null) {
            return etcGMTId;
        } 
    }
	
    var today = new Date();
    for(tzId in AjxTimezone._CLIENT2RULE) {
        if(AjxTimezone.getOffset(tzId, today) == rawOffset) {
            return tzId;
        }
    }

    return "";
}

AjxTimezone.isDST = function(tzId, date) {
    var rule = AjxTimezone.getRule(tzId);
    if (rule && rule.daylight) {
        var year = date.getFullYear();

        var standard = rule.standard, daylight  = rule.daylight;
        var stdTrans = AjxTimezone.getTransition(standard, year);
        var dstTrans = AjxTimezone.getTransition(daylight, year);

        var month    = date.getMonth()+1, day = date.getDate();
        var stdMonth = stdTrans[1], stdDay = stdTrans[2];
        var dstMonth = dstTrans[1], dstDay = dstTrans[2];

        // northern hemisphere
        var isDSTActive = false;
        if (dstMonth < stdMonth) {
            isDSTActive = month > dstMonth && month < stdMonth;
            isDSTActive = isDSTActive || (month == dstMonth && day >= dstDay);
            isDSTActive = isDSTActive || (month == stdMonth && day <  stdDay);
        }

        // sorthern hemisphere
        else {
            isDSTActive = month < dstMonth || month > stdMonth;
            isDSTActive = isDSTActive || (month == dstMonth && day <  dstDay);
            isDSTActive = isDSTActive || (month == stdMonth && day >= stdDay);
        }

        return isDSTActive? 1:0;
    }
    return -1;
}

AjxTimezone.isValidTimezoneId = function(tzId) {
    return (AjxTimezone._CLIENT2RULE[tzId] != null || TimezoneLinks[tzId] != null);
}

//
// Start YUI Code
//
    
//Support methods first

/**
 * Pad number so that it is atleast num characters long
 * @param {String} num String to be padded
 * @param {Number} length (Optional) Minimum number of characters the string should have after padding. If omitted, defaults to 2
 * @return {String} The padded string
 */
function zeroPad(num, length) {
    length = length || 2;
    var str = num + "";
    for(var i=str.length; i<length; i++) {
        str = "0" + str;
    }
    return str;
}

/**
 * Get Day of Year(0-365) for the date passed
 * @param {Date} date
 * @return {Number} Day of Year
 */
function getDOY(date) {
    var oneJan = new Date(date.getFullYear(),0,1);
    return Math.ceil((date - oneJan) / 86400000);
}
    
/**
 * Get integer part of floating point argument
 * @param floatNum A real number
 * @return Integer part of floatNum
 */
function floatToInt(floatNum) {
    return (floatNum < 0) ? Math.ceil(floatNum) : Math.floor(floatNum);
}

/**
 * Timezone constructor. locale is optional, if not specified, defaults to root locale
 * @class Timezone
 * @constructor
 * @param {String} tzId TimeZone ID as in Olson tz database
 */
Timezone = function(tzId) {
    var normalizedId = Timezone.getNormalizedTimezoneId(tzId);
    if(normalizedId == "") {
        throw new Timezone.UnknownTimeZoneException("Could not find timezone: " + tzId);
    }
    this.tzId = normalizedId;
        
    this._ajxTimeZoneInstance = new AjxTimezone();
}

//Exception Handling
Timezone.UnknownTimeZoneException = function (message) {
    this.message = message;
}
Timezone.UnknownTimeZoneException.prototype.toString = function () {
    return 'UnknownTimeZoneException: ' + this.message;
}

//Static methods

/**
 * Returns list of timezone Id's that have the same rawOffSet as passed in
 * @param {Number} rawOffset Raw offset (in seconds) from GMT.
 * @return {Array} array of timezone Id's that match rawOffset passed in to the API. 
 */
Timezone.getCurrentTimezoneIds = function(rawOffset) {
    return AjxTimezone.getCurrentTimezoneIds(rawOffset);
}

/**
 * Given a raw offset in seconds, get the tz database ID that reflects the given raw offset, or empty string if there is no such ID. Where available, the function will return an ID 
 * starting with "Etc/GMT"; for offsets where no such ID exists but that are used by actual time zones, the ID of one of those time zones is returned.
 * Note that the offset shown in an "Etc/GMT" ID is opposite to the value of rawOffset
 * @param {Number} rawOffset Offset from GMT in seconds
 * @return {String} timezone id
 */
Timezone.getTimezoneIdForOffset = function(rawOffset) {
    return AjxTimezone.getTimezoneIdForOffset(rawOffset);
}

/**
 * Given a wall time reference, convert it to UNIX time - seconds since Epoch
 * @param {Object} walltime Walltime that needs conversion. Missing properties will be treat as 0.
 * @return {Number} UNIX time - time in seconds since Epoch
 */
Timezone.getUnixTimeFromWallTime = function(walltime) {
    /*
	 * Initialize any missing properties.
	 */
    if(walltime.year == null) {
        walltime.year = new Date().getFullYear();	//Default to current year
    }
    if(walltime.mon == null) {
        walltime.mon = 0;				//Default to January
    }
    if(walltime.mday == null) {
        walltime.mday = 1;				//Default to first of month
    }
    if(walltime.hour == null) {			//Default to 12 midnight
        walltime.hour = 0;
    }
    if(walltime.min == null) {
        walltime.min = 0;
    }
    if(walltime.sec == null) {
        walltime.sec = 0;
    }
    if(walltime.gmtoff == null) {			//Default to UTC
        walltime.gmtoff = 0;
    }

    var utcTime = Date.UTC(walltime.year, walltime.mon, walltime.mday, walltime.hour, walltime.min, walltime.sec);
    utcTime -= walltime.gmtoff*1000;

    return floatToInt(utcTime/1000);	//Unix time: count from midnight Jan 1 1970 UTC
}

/**
 * Checks if the timestamp passed in is a valid timestamp for this timezone and offset.
 * @param {String} timeStamp Time value in UTC RFC3339 format - yyyy-mm-ddThh:mm:ssZ or yyyy-mm-ddThh:mm:ss+/-HH:MM
 * @param {Number} rawOffset An offset from UTC in seconds. 
 * @return {Boolean} true if valid timestamp, false otherwise
 */
Timezone.isValidTimestamp = function(timeStamp, rawOffset) {
    var regex = /^(\d\d\d\d)-([0-1][0-9])-([0-3][0-9])([T ])([0-2][0-9]):([0-6][0-9]):([0-6][0-9])(Z|[+-][0-1][0-9]:[0-3][0-9])?$/
    var matches = (new RegExp(regex)).exec(timeStamp);

    //No match
    if(matches == null) {
        return false;
    }

    var year = parseInt(matches[1]),
    month = parseInt(matches[2]),
    day = parseInt(matches[3]),
    dateTimeSeparator = matches[4],
    hours = parseInt(matches[5]),
    minutes = parseInt(matches[6]),
    seconds = parseInt(matches[7]),
    tZone = matches[8];
    //Month should be in 1-12
    if(month < 1 || month > 12) {
        return false;
    }

    //Months with 31 days
    var m31 = [1,3,5,7,8,10,12];
    var maxDays = 30;
    if(m31.indexOf(month) != -1) {
        maxDays = 31;
    } else if(month == 2) {
        if(year % 400 == 0) {
            maxDays = 29;
        } else if(year % 100 == 0) {
            maxDays = 28;
        } else if(year % 4 == 0) {
            maxDays = 29;
        } else {
            maxDays = 28;
        }
    }

    //Day should be valid day for month
    if(day < 1 || day > maxDays) {	
        return false;
    }

    //Hours should be in 0-23
    if(hours < 0 || hours > 23) {
        return false;
    }

    //Minutes and Seconds should in 0-59
    if(minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
        return false;
    }

    //Now verify timezone
    if(dateTimeSeparator == " " && tZone == null) {
        //SQL Format
        return true;
    } else if(dateTimeSeparator == "T" && tZone != null) {
        //RFC3339 Format
        var offset = 0;
        if(tZone != "Z") {
            //Not UTC TimeZone
            offset = parseInt(tZone.substr(1,3))*60 + parseInt(tZone.substr(4));
            offset = offset*60;	//To seconds

            offset = offset * (tZone.charAt(0) == "+" ? 1 : -1);
        }
        //Check offset in timeStamp with passed rawOffset
        if(offset == rawOffset) {
            return true;
        }
    }

    //If reached here, wrong format
    return false;
}

/**
 * Checks if tzId passed in is a valid Timezone id in tz database.
 * @param {String} tzId timezoneId to be checked for validity
 * @return {Boolean} true if tzId is a valid timezone id in tz database. tzId could be a "zone" id or a "link" id to be a valid tz Id. False otherwise
 */
Timezone.isValidTimezoneId = function(tzId) {
    return AjxTimezone.isValidTimezoneId(tzId);
}

/**
 * Returns the normalized version of the time zone ID, or empty string if tzId is not a valid time zone ID.
 * If tzId is a link Id, the standard name will be returned.
 * @param {String} tzId The timezone ID whose normalized form is requested.
 * @return {String} The normalized version of the timezone Id, or empty string if tzId is not a valid time zone Id.
 */
Timezone.getNormalizedTimezoneId = function(tzId) {
    if(!Timezone.isValidTimezoneId(tzId)) {
        return "";
    }
    var normalizedId;       
    var next = tzId;
        
    do {
        normalizedId = next;
        next = TimezoneLinks[normalizedId];
    } while( next != null );
        
    return normalizedId;
}
    
//Private methods

/**
 * Parse RFC3339 date format and return the Date
 * Format: yyyy-mm-ddThh:mm:ssZ
 * @param {String} dString The date string to be parsed
 * @return {Date} The date represented by dString
 */
Timezone.prototype._parseRFC3339 = function(dString){
    var regexp = /(\d+)(-)?(\d+)(-)?(\d+)(T)?(\d+)(:)?(\d+)(:)?(\d+)(\.\d+)?(Z|([+-])(\d+)(:)?(\d+))/; 

    var result = new Date();

    var d = dString.match(regexp);
    var offset = 0;

    result.setUTCDate(1);
    result.setUTCFullYear(parseInt(d[1],10));
    result.setUTCMonth(parseInt(d[3],10) - 1);
    result.setUTCDate(parseInt(d[5],10));
    result.setUTCHours(parseInt(d[7],10));
    result.setUTCMinutes(parseInt(d[9],10));
    result.setUTCSeconds(parseInt(d[11],10));
    if (d[12]) {
        result.setUTCMilliseconds(parseFloat(d[12]) * 1000);
    } else {
        result.setUTCMilliseconds(0);
    }
    if (d[13] != 'Z') {
        offset = (d[15] * 60) + parseInt(d[17],10);
        offset *= ((d[14] == '-') ? -1 : 1);
        result.setTime(result.getTime() - offset * 60 * 1000);
    }
    return result;
}

/**
 * Parse SQL date format and return the Date
 * Format: yyyy-mm-dd hh:mm:ss
 * @param {String} dString The date string to be parsed
 * @return {Date} The date represented by dString
 */
Timezone.prototype._parseSQLFormat = function(dString) {
    var dateTime = dString.split(" ");
    var date = dateTime[0].split("-");
    var time = dateTime[1].split(":");

    var offset = AjxTimezone.getOffset(this.tzId, new Date(date[0], date[1] - 1, date[2]));
    return new Date(Date.UTC(date[0], date[1] - 1, date[2], time[0], time[1], time[2]) - offset*60*1000);
}

//Public methods

//For use in Y.DateFormat.
Timezone.prototype.getShortName = function() {
    return this._ajxTimeZoneInstance.getShortName(this.tzId);
}

//For use in Y.DateFormat.
Timezone.prototype.getMediumName = function() {
    return this._ajxTimeZoneInstance.getMediumName(this.tzId);
}

//For use in Y.DateFormat.
Timezone.prototype.getLongName = function() {
    return this._ajxTimeZoneInstance.getLongName(this.tzId);
}
    
/**
 * Given a timevalue representation in RFC 3339 or SQL format, convert to UNIX time - seconds since Epoch ie., since 1970-01-01T00:00:00Z
 * @param {String} timeValue TimeValue representation in RFC 3339 or SQL format.
 * @return {Number} UNIX time - time in seconds since Epoch
 */
Timezone.prototype.convertToIncrementalUTC = function(timeValue) {
    if(timeValue.indexOf("T") != -1) {
        //RFC3339
        return this._parseRFC3339(timeValue).getTime() / 1000;
    } else {
        //SQL
        return this._parseSQLFormat(timeValue).getTime() / 1000;
    }
}

/**
 * Given UNIX time - seconds since Epoch ie., 1970-01-01T00:00:00Z, convert the timevalue to RFC3339 format - "yyyy-mm-ddThh:mm:ssZ"
 * @param {Number} timeValue time value in seconds since Epoch.
 * @return {String} RFC3339 format timevalue - "yyyy-mm-ddThh:mm:ssZ"
 */
Timezone.prototype.convertUTCToRFC3339Format = function(timeValue) {
    var uTime = new Date(timeValue * 1000);
    var offset = AjxTimezone.getOffset(this.tzId, uTime);

    var offsetString = "Z";
    if(offset != 0) {
        var offsetSign = (offset > 0 ? "+": "-");
        offsetString = offsetSign + zeroPad(Math.abs(floatToInt(offset/60))) + ":" + zeroPad(offset % 60);
    }

    uTime.setTime(timeValue*1000 + offset*60*1000);

    var rfc3339 = zeroPad(uTime.getUTCFullYear(), 4) + "-" + zeroPad((uTime.getUTCMonth() + 1)) + "-" + zeroPad(uTime.getUTCDate()) 
    + "T" + zeroPad(uTime.getUTCHours()) + ":" + zeroPad(uTime.getUTCMinutes()) + ":" + zeroPad(uTime.getUTCSeconds()) + offsetString;

    return rfc3339;
}

/**
 * Given UNIX Time - seconds since Epoch ie., 1970-01-01T00:00:00Z, convert the timevalue to SQL Format - "yyyy-mm-dd hh:mm:ss"
 * @param {Number} timeValue time value in seconds since Epoch.
 * @return {String} SQL Format timevalue - "yyyy-mm-dd hh:mm:ss"
 */
Timezone.prototype.convertUTCToSQLFormat = function(timeValue) {
    var uTime = new Date(timeValue * 1000);
    var offset = AjxTimezone.getOffset(this.tzId, uTime);
    uTime.setTime(timeValue*1000 + offset*60*1000);

    var sqlDate = zeroPad(uTime.getUTCFullYear(), 4) + "-" + zeroPad((uTime.getUTCMonth() + 1)) + "-" + zeroPad(uTime.getUTCDate()) 
    + " " + zeroPad(uTime.getUTCHours()) + ":" + zeroPad(uTime.getUTCMinutes()) + ":" + zeroPad(uTime.getUTCSeconds());

    return sqlDate;
}

/**
 * Gets the offset of this timezone in seconds from UTC
 * @return {Number} offset of this timezone in seconds from UTC
 */
Timezone.prototype.getRawOffset = function() {
    return AjxTimezone.getOffset(this.tzId, new Date()) * 60;
}

/**
 * Given a unix time, convert it to wall time for this timezone.
 * @param {Number} timeValue value in seconds from Epoch.
 * @return {Object} an object with the properties: sec, min, hour, mday, mon, year, wday, yday, isdst, gmtoff, zone. All of these are integers except for zone, which is a string. isdst is 1 if DST is active, and 0 if DST is inactive.
 */
Timezone.prototype.getWallTimeFromUnixTime = function(timeValue) {
    var offset = AjxTimezone.getOffset(this.tzId, new Date(timeValue*1000)) * 60;
    var localTimeValue = timeValue + offset;
    var date = new Date(localTimeValue*1000);

    var walltime = {
        sec: date.getUTCSeconds(),
        min: date.getUTCMinutes(),
        hour: date.getUTCHours(),
        mday: date.getUTCDate(),
        mon: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        wday: date.getUTCDay(),
        yday: getDOY(date),
        isdst: AjxTimezone.isDST(this.tzId, new Date(timeValue)),
        gmtoff: offset,
        zone: this.tzId
    };

    return walltime;
}

Y.Date.Timezone = Timezone;