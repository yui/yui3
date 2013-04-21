// Constants to refer to the parts of the date array
var L = Y.Lang,
    YR = 0, MO = 1, D = 2, H = 3, MI = 4, S = 5, TZh = 6, TZm = 7, AP = 8;
    digitsRegExp = [
        /^\s*(\d+)/,
        /^\s*(\d{1,1})/,
        /^\s*(\d{1,2})/,
        /^\s*(\d{1,3})/,
        /^\s*(\d{1,4})/
    ],
    spaceRegExp = /(\s+)/g,
    gmtUtcRegExp = /^(\s*gmt)|(\s*utc)|(\s*)/i,
    tzRegExp = /^\s*([a-z]+(\/[a-z]+)?)/i,
/**
 * Parse date submodule.
 *
 * @module datatype-date
 * @submodule datatype-date-parse
 * @for Date
 */
Y.mix(Y.namespace("Date"), {


    /**
     * Turns a sequence of digits into a number.
     * Returns the parsed value.
     * @method _parseDigits
     * @param maxLen {Integer} Maximum number of characters to read
     * @param [max] {Integer} Maximum acceptable value, such as 59 for minutes.
     * @return {Integer} Value parsed.
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
     * Returns the index position of the value in the array of localized strings that
     * matches the most characters of the string being parsed at the current index position.
     * @method _parseStrings
     * @param key {String} Key within the language resources used to retrieve the
     *          array of localized strings to look for in the parsed string.
     * @return {Integer} Index of the first string that matches.
     * @static
     * @private
     */
    _parseStrings: function (data, d, key, part) {
        var i,l,
            options = this._resources[key],
            len = 0, winner = null ;

        data = L.trimLeft(data);
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
    _skipChars: function (data, d, chars) {
        data = L.trimLeft(data);
        if (data.indexOf(chars) === 0) {
            return data.substr(chars.length);
        }
        return null;
    },
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
     * while the value is anything that post-processor might need
     * @property _pending
     * @type Object
     * @default {}
     * @static
     * @private
     */
    _pending: {},
    /**
     * Table of parsers, indexed by the formatting code.
     * Each one is a function.
     * @property parsers
     * @type Object
     * @static
     * @protected
     */
    parsers: {
        // Though some of the parts might not provide useful information,
        // such as the weekday
        // they need to be skipped over
        a: ['_parseStrings','a'],
        A: ['_parseStrings','A'],
        b: ['_parseStrings','b',MO],
        B: ['_parseStrings','B',MO],
        C: function (data) {
            var d1 = [];
            // The century will have to be added to whatever the year in the century might be
            data = this._parseDigits(data, d1, 0 , 2);
            this._pending.C = d1[0] * 100;
            return data;
        },
        d: ['_parseDigits', D, 2, 31],
        e: ['_parseDigits', D, 2, 31],
        g: ['_parseDigits', YR, 2],
        G: ['_parseDigits', YR, 4],
        H: ['_parseDigits', H, 2, 23],
        I: function (data, d) {
            data = this._parseDigits(data, d, H, 2, 12);
            if (d[H] === 12) {
                d[H] = 0;
            }
           return  data;
        },
        j: function (data) {
            var d1 = [];
            // The year might not be in yet, so I leave it pending
            data = this._parseDigits(data, d1, 0 , 3);
            this._pending.j = d1[0];
            return data;
        },
        k: ['_parseDigits', H, 2, 23],
        l: function (data, d) {
            data = this._parseDigits(data, d, H, 2, 12);
            if (d[H] === 12) {
                d[H] = 0;
            }
            return  data;
        },
        m: function (data, d) {
            data = this._parseDigits(data, d, MO, 2, 12);
            d[MO] -= 1;
            return  data;
        },
        M: ['_parseDigits', MI, 2, 59],
        p: function (data, d) {
            data = this._parseStrings(data, d, 'p', AP);
            d[AP] = d[AP] ? 12 : 0;
            return data;
        },
        P: function (data, d) {
            data = this._parseStrings(data, d, 'P', AP);
            d[AP] = d[AP] ? 12 : 0;
            return data;
        },
        s: function (data) {
            var d1 = [];
            data = this._parseDigits(data, d1, 0, 0);
            // The seconds by themselves provide all that is needed
            this._pending.s = d1[0];
            return data;
        },
        S: ['_parseDigits', S, 2, 59],
        u: ['_skipDigits', 1],
        U: ['_skipDigits', 2],
        V: ['_skipDigits', 2],
        w: ['_skipDigits', 1],
        W: ['_skipDigits', 2],
        y: ['_parseDigits', YR, 4],
        Y: ['_parseDigits', YR, 4],
        z: function (data, d) {
            data = data.replace(gmtUtcRegExp,'');

            var more = false, sign = 1, h = 0, m = 0, d1=[],
                code = data[0];
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
                data = this._parseDigits(data, d1, 0, 4);
                if (data === null) {
                    return null;
                }
                h = d1[0];
                if (h < 100 && data[0] === ':') {
                    data = data.substr(1);
                    data = this._parseDigits(data, d1, 0, 2);
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
        },
        Z: function (data, d) {
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
        },
        '%': function (data) {
            return data.substr(1);
        }


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
    cutoff: 30,
    _buildParser: Y.cached(function (format, cutoff) {
        var DT = Y.Date, i, inPerc = false, c,
            ps = DT.parsers,
            parsers = [], skip = '';

        if (cutoff === undefined) {
            cutoff = DT.cutoff;
        }

        format = DT._expandAggregates(format).replace(spaceRegExp, '');
        for (i = 0; i < format.length; i++) {
            c = format[i];
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
                        parsers.push(['_skipChars', skip.toLowerCase()]);
                        skip = '';
                    }
                } else {
                    skip += c;
                }
            }
        }

        return function (data) {
            var i, val, p, fn, c,
                //   YR MO D   H  MI S  TZh   TZm    AP
                d = [0, 0, 0,  0, 0, 0, null, null , 0];

            for (i = 0; i < parsers.length; i++) {
                p = parsers[i];
                if (typeof p === 'function') {
                    fn = p;
                    p = [data, d];
                } else {
                    fn = this[p[0]];
                    p = [data, d].concat(p.slice(1));
                }
                if (fn) {
                    data = fn.apply(DT, p);
                    if (data === null) {
                        return null;
                    }
                }
            }

            for (c in this._pending) {
                switch (c) {
                    case 'j':
                        val = new Date(d[YR], 0, this._pending.j);
                        d[MO] = val.getMonth();
                        d[D] = val.getDate();
                        break;
                    case 's':
                        return new Date(this._pending.s * 1000);
                    case 'C':
                        d[YR] = (d[YR] || 0) + this._pending.C;
                        break;
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
     * [_timezones](#property__timezones) table which is not an exhaustive list.
     *
     * Some formats, such as the day of the week, are ignored for the calculation
     * since they don't provide enough information on their own.
     * However, if specified in the format, they are required to be present in the input
     * string.
     *
     *
     * @method parse
     * @param data {Date|Number|String} date object, timestamp (string or number), or string.
     * @param [format] {String} Format specification, same as for Date.Format.
     * @param [cutoff=30] {Integer | null} When years are given as two digits, values below the
     *         cutoff value will be assumed to be in the XXI century, values below in the XX century.
     *         If `cutoff` is null, no century will be assumed.
     * @return {Date} a Date object or null if unable to parse
     * @static
     */
    parse: function(data, format, cutoff) {
        var val, parser;
        this._resources = Y.Intl.get('datatype-date-format');

        /*jshint eqeqeq:false */ // The simple != below is intentional
        if (data && format && typeof(data) === 'string' && +data != data) {
        /*jshint eqeqeq:true */

            data = data.toLowerCase();

            this._pending = {};

            parser = this._buildParser(format, cutoff);

            return parser && parser.call(this, data);

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

