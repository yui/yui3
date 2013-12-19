// Constants to refer to the parts of the date array
var L = Y.Lang,
    trimLeft = L.trimLeft,

    // index position of the components of the date, based on the
    // positional arguments for the Date constructor, plus some extra
    // such as time-zone (TZ) offset and AMPM indicator.

    // These are used on the `d` argument passed to most parsing functions
    // as well as in the `part` argument (meaning, the `part` of `d` that
    // is being dealt with).
    YR = 0, MO = 1, D = 2, H = 3, MI = 4, S = 5, TZh = 6, TZm = 7, AP = 8;

    // Extracts a variable number of digits from a string.
    // Each entry in the array corresponds to a maximum number of digits
    // to extract, 0 being no limits.  Leading whitespace is ommitted.
    digitsRegExp = [
        /^(\d+)/,
        /^(\d{1,1})/,
        /^(\d{1,2})/,
        /^(\d{1,3})/,
        /^(\d{1,4})/
    ],
    // Removes all whitespaces
    spaceRegExp = /(\s+)/g,

    // Removes the GMT or UTC timezone prefix
    gmtUtcRegExp = /^(gmt)|(utc)|(\s*)/i,

    // extracts a timezone abbreviation
    tzRegExp = /^([a-z]+(\/[a-z]+)?)/i,
/**
 * Parse date submodule.
 *
 * @module datatype-date
 * @submodule datatype-date-parse
 * @for Date
 */
    DP = Y.mix(Y.namespace("Date"), {


        /**
         * Turns a sequence of digits into a number.
         * Returns the string with the parsed section excluded while the
         * value is stored into the given position of the array of date/time parts.
         *
         * @method _parseDigits
         * @param data {String} Source of the data to parse.
         * @param d {Array} Array of date/time parts.
         * @param part {Integer} index into the previous array where this value is to be stored.
         * @param maxLen {Integer} Maximum number of characters to read.
         *      Actually, it can only be 1 through 4 or 0 for no limits.
         * @param [max] {Integer} Maximum acceptable value, such as 59 for minutes.
         * @return {String} Remaining part of the string.
         * @static
         * @private
         */
        _parseDigits: function (data, d, part, maxLen, max) {
            var m = digitsRegExp[maxLen].exec(data),
                val;
            if (!m) {
                return null;
            }

            val = parseInt(m[1], 10);

            if (val < 0 || max && val > max) {
                return null;
            }
            d[part] = val;
            return data.substr(m[0].length);
        },
        /**
         * Finds the index position of the value in the array of localized strings that
         * matches the most characters of the string being parsed.
         * It returns the remaining part of the date string being parsed while
         * the index of the string found is stored at the given position in the
         * date/time parts array.
         *
         *
         * @method _parseStrings
         * @param data {String} Source of the data to parse.
         * @param d {Array} Array of date/time parts.
         * @param key {String} Key within the language resources used to retrieve the
         *          array of localized strings to look for in the parsed string.
         * @param part {Integer} index into the previous array where this value is to be stored.
         * @return {String} Remaining part of the string.
         * @static
         * @private
         */
        _parseStrings: function (data, d, key, part) {
            var i,l,
                options = Y.Date._resources[key],
                len = 0, winner = null ;

            for (i = 0; i < options.length; i += 1) {
                if (data.indexOf(options[i].toLowerCase()) === 0) {
                    l = options[i].length;
                    if (l > len) {
                        len = l;
                        winner = i;
                    }
                }
            }
            if (winner === null) {
                return null;
            }
            d[part] = winner;
            return data.substr(len);
        },

        /**
         * Makes sure the leading part of the string (excluding whitespace)
         * matches the given characters and skips over them.
         *
         * @method _skipChars
         * @param data {String} Source of the data to parse.
         * @param d {Array} Array of date/time parts (not used).
         * @param chars {String} Characters to be skipped over.
         * @return {String} Remaining part of the string.
         * @static
         * @private
         */
        _skipChars: function (data, d, chars) {
            if (data.indexOf(chars) === 0) {
                return data.substr(chars.length);
            }
            return null;
        },

        /**
         * Skips over the following digits, up to a maximum number.
         *
         * @method _skipDigits
         * @param data {String} Source of the data to parse.
         * @param d {Array} Array of date/time parts (not used).
         * @param maxLen {Number} Maximum number of digits to skip over.
         *      Actually, it can only be 1 through 4 or 0 for no limits.
         * @return {String} Remaining part of the string.
         * @static
         * @private
         */

        _skipDigits: function (data, d, maxLen) {
            var m = digitsRegExp[maxLen].exec(data);
            if (!m) {
                return null;
            }
            return data.substr(m[0].length);
        },

        /**
         * Hash containing values that need further post-processing.
         * The key serves as a clue as to what operation is expected
         * while the value is anything that post-processor might need.
         *
         * @property _pending
         * @type Object
         * @default {}
         * @static
         * @private
         */
        _pending: {}
    });

 Y.mix(DP, {
    /**
     * Table of parsers, indexed by the formatting code.
     * Each one is an array containing a reference to a function that processes
     * that code and optional arguments passed to that function.
     *
     * All functions will receive the string being parsed starting with the
     * next characters to analize, the date/time array where the date
     * is being assembled and the extra elements in the array.
     *
     * @property parsers
     * @type Object
     * @static
     * @protected
     */
    parsers: {
        // Though some of the parts might not provide useful information,
        // such as the weekday
        // they need to be skipped over
        a: [DP._parseStrings,'a'],
        A: [DP._parseStrings,'A'],
        b: [DP._parseStrings,'b',MO],
        B: [DP._parseStrings,'B',MO],

        C: [function (data) {
            var d1 = [];
            // The century will have to be added to whatever the year in the century might be
            data = DP._parseDigits(data, d1, 0 , 2);
            DP._pending.C = d1[0] * 100;
            return data;
        }],
        d: [DP._parseDigits, D, 2, 31],
        e: [DP._parseDigits, D, 2, 31],
        g: [DP._parseDigits, YR, 2],
        G: [DP._parseDigits, YR, 4],
        H: [DP._parseDigits, H, 2, 23],

        I: [function (data, d) {
            data = DP._parseDigits(data, d, H, 2, 12);
            if (d[H] === 12) {
                d[H] = 0;
            }
           return  data;
        }],
        j: [function (data) {
            var d1 = [];
            // The year might not be in yet, so I leave it pending
            data = DP._parseDigits(data, d1, 0 , 3);
            DP._pending.j = d1[0];
            return data;
        }],
        k: [DP._parseDigits, H, 2, 23],

        l: [function (data, d) {
            data = DP._parseDigits(data, d, H, 2, 12);
            if (d[H] === 12) {
                d[H] = 0;
            }
            return  data;
        }],
        m: [function (data, d) {
            data = DP._parseDigits(data, d, MO, 2, 12);
            d[MO] -= 1;
            return  data;
        }],
        M: [DP._parseDigits, MI, 2, 59],

        p: [function (data, d) {
            data = DP._parseStrings(data, d, 'p', AP);
            d[AP] = d[AP] ? 12 : 0;
            return data;
        }],
        P: [function (data, d) {
            data = DP._parseStrings(data, d, 'P', AP);
            d[AP] = d[AP] ? 12 : 0;
            return data;
        }],
        s: [function (data) {
            var d1 = [];
            data = DP._parseDigits(data, d1, 0, 0);
            // The seconds by themselves provide all that is needed
            DP._pending.s = d1[0];
            return data;
        }],
        S: [DP._parseDigits, S, 2, 59],
        u: [DP._skipDigits, 1],
        U: [DP._skipDigits, 2],
        V: [DP._skipDigits, 2],
        w: [DP._skipDigits, 1],
        W: [DP._skipDigits, 2],
        y: [DP._parseDigits, YR, 4],
        Y: [DP._parseDigits, YR, 4],

        z: [function (data, d) {
            data = data.replace(gmtUtcRegExp,'');

            var more = false, sign = 1, h = 0, m = 0, d1=[],
                code = data.charAt(0);
            switch (code) {
                case '+':
                    more = true;
                    break;
                case '-':
                    sign = -1;
                    more = true;
                    break;
                case 'z':
                    break;
                case 'j':
                    return null;
                default:
                    h = code.charCodeAt() - 'a'.charCodeAt() + 1;
                    if (h > 25) {
                        return null;
                    }
                    if (h > 13) {
                        h = h - 13;
                        sign = -1;
                    } else if (h > 9) {
                        h -= 1;
                    }
            }
            data = data.substr(1);
            if (more) {
                data = DP._parseDigits(data, d1, 0, 4);
                if (data === null) {
                    return null;
                }
                h = d1[0];
                if (h < 100 && data.charAt(0) === ':') {
                    data = data.substr(1);
                    data = DP._parseDigits(data, d1, 0, 2);
                    if (data === null) {
                        return null;
                    }
                    m = d1[0];
                } else {
                    m = h % 100;
                    h = Math.floor(h / 100);
                }

            }
            d[TZh] = sign * h;
            d[TZm] = sign * m;
            return data;
        }],
        Z: [function (data, d) {
            var m,
                matches = tzRegExp.exec(data),
                h = this._timezones[matches[1]],
                sign;
            if (h === undefined) {
                return null;
            }
            sign = (h < 0 ? -1 : 1);
            h = Math.abs(h);
            m = (h % 1) * 60;
            h = Math.floor(h);
            d[TZh] = sign * h;
            d[TZm] = sign * m;
            return data.substr(matches[0].length);
        }],
        '%': [function (data) {
            return data.substr(1);
        }]


    },
    /**
     * Table of time zone abbreviations  and their offset in hours.
     * The keys should be in lowercase and the value the offset in hours
     * to UTC time.
     *
     * The table is pre-loaded with the values for GMT and UTC (0) and the
     * timezones for North America (Canada, USA and México) and Europe.
     *
     * For timezones with offsets in hours and minutes use decimal fractions: IST: 5.5
     *
     * @property _timezones
     * @type Object
     * @protected
     */
    _timezones: {
        eet:2,
        eest:3,
        cet:1,
        cest:2,
        wet:0,
        west:1,
        bst:1,
        ist:1,
        gmt:0,
        uct:0,
        ast:-4,
        adt:-3,
        est:-5,
        edt:-4,
        cst:-6,
        cdt:-5,
        mst:-7,
        mdt:-6,
        pst:-8,
        pdt:-7,
        akst:-9,
        akdt:-8,
        hst:-10


    },

    /**
     * Default value of the cutoff year, when none is specified in the call
     * to [parse](#method_parse).
     *
     * When a year is given in as two digits, values below this cutoff date
     * will have 2000 added to them, those above will have 1900 added.
     *
     * @property cutoff
     * @type Integer
     * @default 30
     * @static
     */
    cutoff: 30,

    /**
     * Returns a parsing function based on the format specification and the
     * cutoff value.   The functions are cached so that further calls with
     * the same arguments will return the same function.
     *
     * @method _buildParse
     * @param format {String} Formatting string
     * @param [cutoff] {Number} Cutoff year.  If none specified, the value in
     *      the [cutoff](#property_cutoff) will be used.
     * @return {Function} The parsing function for that format.  The function takes
     * the string to be parsed and returns the parsed date.
     * @private
     * @static
     */
    _buildParser: Y.cached(function (format, cutoff) {
        var i, inPerc = false, c,
            ps = DP.parsers,
            parsers = [], skip = '';

        if (cutoff === undefined) {
            cutoff = DP.cutoff;
        }

        format = DP._expandAggregates(format).replace(spaceRegExp, '');
        for (i = 0; i < format.length; i++) {
            c = format.charAt(i);
            if (inPerc) {
                inPerc = false;
                if (ps[c]) {
                    parsers.push(ps[c]);
                } else {
                    return null;
                }

            } else {
                if (c === '%') {
                    inPerc = true;
                    if (skip.length) {
                        parsers.push([DP._skipChars, skip.toLowerCase()]);
                        skip = '';
                    }
                } else {
                    skip += c;
                }
            }
        }

        return function (data) {
            var i, val, p, c,
                // See the constants defined at the top of this file:
                //   YR MO D   H  MI S   TZh   TZm    AP
                d = [0, 0, 0,  0, 0, 0,  null, null , 0];

            for (i = 0; i < parsers.length; i++) {
                p = parsers[i];
                data = p[0].apply(DP, [trimLeft(data), d].concat(p.slice(1)));
                if (data === null) {
                    return null;
                }
            }

            p = DP._pending;
            for (c in p) {
                if (p.hasOwnProperty(c)) {
                    switch (c) {
                        case 'j':
                            val = new Date(d[YR], 0, p.j);
                            d[MO] = val.getMonth();
                            d[D] = val.getDate();
                            break;
                        case 's':
                            return new Date(p.s * 1000);
                        case 'C':
                            d[YR] = (d[YR] || 0) + p.C;
                            break;
                    }
                }
            }

            if (cutoff !== null && d[YR] < 100) {
                d[YR] += (d[YR] < cutoff ? 2000 : 1900);
            }

            d[H] = d[H] + d[AP];

            if (d[TZh] === null) {
                return new Date(d[YR], d[MO], d[D], d[H], d[MI], d[S]);
            } else {
                return new Date(Date.UTC(d[YR], d[MO], d[D],d[H] - d[TZh], d[MI] - d[TZm],d[S]));
            }

        };
    }),

    /**
     * Converts data to type Date. If `format` is specified and `data` is a string
     * it will parse it according to that spec, otherwise, it will try `Date.parse`.
     *
     * The parser tries to be tolerant.  Whitespace is mostly ignored and leading zeros
     * are not required.
     *
     * Parsing of the `%Z` format as well as those derived
     * from it (such as `%c` in the `en` locale) depend on the
     * [_timezones](#property__timezones) table which is not an exhaustive list
     * and can easily be expanded.
     *
     * Some formats, such as the day of the week, are ignored for the calculation
     * since they don't provide enough information on their own to calculate a date.
     * However, if specified in the format, they are required to be present in the input
     * string.
     *
     *
     * @method parse
     * @param data {Date|Number|String} date object, timestamp (string or number), or string.
     * @param [format] {String} Format specification, same as for Date.Format.
     * @param [cutoff] {Integer | null} When years are given as two digits, values below the
     *         cutoff value will be assumed to be in the XXI century, values below in the XX century.
     *         If `cutoff` is null, no century will be assumed.
     *         If none is given the value of the [cutoff](#property_cutoff) will be used.
     * @return {Date} a Date object or null if unable to parse
     * @static
     */
    parse: function(data, format, cutoff) {
        var val, parser;
        DP._resources = Y.Intl.get('datatype-date-format');

        if (data && format && typeof(data) === 'string') {

            data = data.toLowerCase();

            DP._pending = {};

            parser = DP._buildParser(format, cutoff);

            return parser && parser.call(DP, data);

        } else {

            val = new Date(+data || data);
            if (L.isDate(val)) {
                return val;
            } else {
                Y.log("Could not convert data " + Y.dump(val) + " to type Date", "warn", "date");
                return null;
            }
        }


    }
});




// Add Parsers shortcut
Y.namespace("Parsers").date = Y.Date.parse;

Y.namespace("DataType");
Y.DataType.Date = Y.Date;

