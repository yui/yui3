/**
 * YRelativeTimeFormat class provides localized formatting of relative time values such as "3 minutes ago".
 * Relative time formats supported are defined by how many units they may include.
 * Relative time is only used for past events. The Relative time formats use appropriate singular/plural/paucal/etc. forms for all languages.
 * In order to keep relative time formats independent of time zones, relative day names such as today, yesterday, or tomorrow are not used.
 * @module format-relative
 */

var MODULE_NAME = "datatype-date-advanced-format";
/**
 * @class YRelativeTimeFormat
 * @constructor
 * @param {Number} style (Optional) Selector for the desired relative time format. If no argument is provided, default to ONE_UNIT_LONG. If argument is provided but is not a valid selector, an Error exception is thrown.
 */
YRelativeTimeFormat = function(style) {
    if(style && Y.Lang.isString(style)) {
        style = Y.Date.RELATIVE_TIME_FORMATS[style];
    }
    if(style == null) {
        style = Y.Date.RELATIVE_TIME_FORMATS.ONE_UNIT_LONG;
    }
        
    this.patterns = Y.Intl.get(MODULE_NAME);
    this.style = style;
		
    switch(style) {
        case Y.Date.RELATIVE_TIME_FORMATS.ONE_OR_TWO_UNITS_ABBREVIATED:
            this.numUnits = 2;
            this.abbr = true;
            break;
        case Y.Date.RELATIVE_TIME_FORMATS.ONE_OR_TWO_UNITS_LONG:
            this.numUnits = 2;
            this.abbr = false;
            break;
        case Y.Date.RELATIVE_TIME_FORMATS.ONE_UNIT_ABBREVIATED:
            this.numUnits = 1;
            this.abbr = true;
            break;
        case Y.Date.RELATIVE_TIME_FORMATS.ONE_UNIT_LONG:
            this.numUnits = 1;
            this.abbr = false;
            break;
        default:
            throw new Format.IllegalArgumentsException("Unknown style: Use a style from Y.Date.RELATIVE_TIME_FORMATS");
    }
}
	
//Static data

Y.mix(Y.Date, {
    currentDate: function() { return new Date(); },
    RELATIVE_TIME_FORMATS: {
        ONE_OR_TWO_UNITS_ABBREVIATED: 0,
        ONE_OR_TWO_UNITS_LONG: 1,
        ONE_UNIT_ABBREVIATED: 2,
        ONE_UNIT_LONG: 4
    }
});
	
//Public methods
	
/**
 * Formats a time value.
 * One or two parameters are needed. If only one parameter is specified, this function formats the parameter relative to current time.
 * If two parameters are specified, this function formats the first parameter relative to the second parameter.
 * @param {Number} timeValue The time value (seconds since Epoch) to be formatted.
 * @param {Number} relativeTo (Optional) The time value (seconds since Epoch) in relation to which timeValue should be formatted. It must be greater than or equal to timeValue, otherwise exception will be thrown.
 * @return {String} The formatted string
 */
YRelativeTimeFormat.prototype.format = function(timeValue, relativeTo) {
    if(relativeTo == null) { 
        relativeTo = (new Date()).getTime()/1000; 
        if(timeValue > relativeTo) {
            throw new Format.IllegalArgumentsException("timeValue must be in the past");
        }
    } else if(timeValue > relativeTo) {
        throw new Format.IllegalArgumentsException("relativeTo must be greater than or equal to timeValue");
    }

    var date = new Date((relativeTo - timeValue)*1000);

    var result = [];
    var numUnits = this.numUnits;
        
    var value = date.getUTCFullYear() - 1970;	//Need zero-based index
    var text;
        
    if(value > 0) {
        if(this.abbr) {
            text = value + " " + (value != 1 ? this.patterns.years_abbr : this.patterns.year_abbr); 
            result.push(text);
        } else {
            text = value + " " + (value != 1 ? this.patterns.years : this.patterns.year); 
            result.push(text);
        }
        numUnits--;
    }

    value = date.getUTCMonth();
    if((numUnits > 0) && (numUnits < this.numUnits || value > 0)) {
        if(this.abbr) {
            text = value + " " + (value != 1 ? this.patterns.months_abbr : this.patterns.month_abbr); 
            result.push(text);
        } else {
            text = value + " " + (value != 1 ? this.patterns.months : this.patterns.month); 
            result.push(text);
        }
        numUnits--;
    }

    value = date.getUTCDate()-1;			//Need zero-based index
    if(numUnits > 0 && (numUnits < this.numUnits || value > 0)) {
        if(this.abbr) {
            text = value + " " + (value != 1 ? this.patterns.days_abbr : this.patterns.day_abbr); 
            result.push(text);
        } else {
            text = value + " " + (value != 1 ? this.patterns.days : this.patterns.day); 
            result.push(text);
        }
        numUnits--;
    }

    value = date.getUTCHours();
    if(numUnits > 0 && (numUnits < this.numUnits || value > 0)) {
        if(this.abbr) {
            text = value + " " + (value != 1 ? this.patterns.hours_abbr : this.patterns.hour_abbr); 
            result.push(text);
        } else {
            text = value + " " + (value != 1 ? this.patterns.hours : this.patterns.hour); 
            result.push(text);
        }
        numUnits--;
    }

    value = date.getUTCMinutes();
    if(numUnits > 0 && (numUnits < this.numUnits || value > 0)) {
        if(this.abbr) {
            text = value + " " + (value != 1 ? this.patterns.minutes_abbr : this.patterns.minute_abbr); 
            result.push(text);
        } else {
            text = value + " " + (value != 1 ? this.patterns.minutes : this.patterns.minute); 
            result.push(text);
        }
        numUnits--;
    }

    value = date.getUTCSeconds();
    if(result.length == 0 || (numUnits > 0 && (numUnits < this.numUnits || value > 0))) {
        if(this.abbr) {
            text = value + " " + (value != 1 ? this.patterns.seconds_abbr : this.patterns.second_abbr); 
            result.push(text);
        } else {
            text = value + " " + (value != 1 ? this.patterns.seconds : this.patterns.second); 
            result.push(text);
        }
        numUnits--;
    }

    var pattern = (result.length == 1) ? this.patterns["RelativeTime/oneUnit"] : this.patterns["RelativeTime/twoUnits"];
        
    for(var i=0; i<result.length; i++) {
        pattern = pattern.replace("{" + i + "}", result[i]);
    }
    for(i=result.length; i<this.numUnits; i++) {
        pattern = pattern.replace("{" + i + "}", "");
    }
    //Remove unnecessary whitespaces
    pattern = pattern.replace(/\s+/g, " ").replace(/^\s+/, "").replace(/\s+$/, "");
        
    return pattern;
}
