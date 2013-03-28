// Constants to refer to the parts of the date array
var YR = 0, MO = 1, D = 2, H = 3, MI = 4, S = 5;
    digitsRegExp = /^\s*(\d+)/,
    spaceRegExp = /(\s+)/g,
/**
 * Parse number submodule.
 *
 * @module datatype-date
 * @submodule datatype-date-parse
 * @for Date
 */
Y.mix(Y.namespace("Date"), {

    /**
     * Local copy of the data to be parsed.
     * @property _data
     * @type String
     * @default null
     * @private
     */
    _data:null,


    /**
     * Turns a sequence of digits into a number.
     * Returns the parsed value.
     * @method _parseDigits
     * @param maxLen {Integer} Maximum number of characters to read
     * @param [max] {Integer} Maximum acceptable value, such as 59 for minutes.
     * @return {Integer} Value parsed.
     * @private
     */
    _parseDigits: function (maxLen, max) {
        var m = digitsRegExp.exec(this._data),
            val = m[1].substr(0, maxLen);

        this._data = this._data.substr(m[0].length);
        val = parseInt(val, 10);

        if (val < 0 || max && val > max) {
            return NaN;
        }
        return val;
    },
    /**
     * Returns the index position of the value in the array of localized strings that
     * matches the most characters of the string being parsed at the current index position.
     * @method _parseStrings
     * @param key {String} Key within the language resources used to retrieve the
     *          array of localized strings to look for in the parsed string.
     * @return {Integer} Index of the first string that matches.
     * @private
     */
    _parseStrings: function (key) {
        var i,l,
            options = this._resources[key],
            data = Y.Lang.trimLeft(this._data),
            len = 0, winner = NaN ;
        for (i = 0; i < options.length; i += 1) {
            if (data.indexOf(options[i].toLowerCase()) === 0) {
                l = options[i].length;
                if (l > len) {
                    len = l;
                    winner = i;
                }
            }
        }
        this._data = data.substr(len);
        return winner;
    },
    /**
     * Hash containing values that need further post-processing.
     * The key serves as a clue as to what operation is expected
     * while the value is anything that post-processor might need
     * @property _pending
     * @type Object
     * @default {}
     * @private
     */
    _pending: {},
    /**
     * Table of parsers, indexed by the formatting code.
     * Each one is a function.
     * @property parsers
     * @type Object
     */
    parsers: {
        // Though some of the parts might not provide useful information,
        // such as the weekday
        // they need to be skipped over
        a: function () {
            return this._parseStrings('a');
        },
        A: function () {
            return this._parseStrings('A');
        },
        b: function (d) {
            return d[MO] = this._parseStrings('b');
        },
        B: function (d) {
            return d[MO] = this._parseStrings('B');
        },
        C: function (d) {
            return d[YR] += this._parseDigits(2) * 100;
        },
        d: function (d) {
            return d[D] = this._parseDigits(2, 31);
        },
        e: function (d) {
            return d[D] = this._parseDigits(2, 31);
        },
        g: function (d) {
            return d[YR] = this._parseDigits(2);
        },
        G: function (d) {
            return d[YR] = this._parseDigits(4);

        },
        H: function (d) {
            return d[H] += this._parseDigits(2, 23);
        },
        I: function (d) {
            return d[H] += this._parseDigits(2, 12);
        },
        j: function () {
            // The year might not be in yet, so I leave it pending
            return this._pending.j = this._parseDigits(3);

        },
        k: function (d) {
            return d[H] += this._parseDigits(2, 23);
        },
        l: function (d) {
           return  d[H] +=  this._parseDigits(2, 12);
        },
        m: function (d) {
            return d[MO] = this._parseDigits(2, 12) - 1;
        },
        M: function (d) {
            return d[MI] +=  this._parseDigits(2, 59);
        },
        p: function (d) {
            return d[H] += this._parseStrings('p') ? 12 : 0;
        },
        P: function (d) {
            return d[H] +=  this._parseStrings('P') ? 12 : 0;
        },
        s: function () {
            // The seconds by themselves provide all that is needed
            return this._pending.s = this._parseDigits(999);
        },
        S: function (d) {
            return d[S] = this._parseDigits(2, 59);
        },
        u: function () {
            // No useful information, just skip over
            return this._parseDigits(1);
        },
        U: function () {
            // No useful information, just skip over
            return this._parseDigits(2);
        },
        V: function () {
            // No useful information, just skip over
            return this._parseDigits(2);
        },
        w: function () {
            // No useful information, just skip over
            return this._parseDigits(1);
        },
        W: function () {
            // No useful information, just skip over
            return this._parseDigits(2);
        },
        y: function (d) {
            return d[YR] = this._parseDigits(4);
        },
        Y: function (d) {
            return d[YR] = this._parseDigits(4);
        },
        z: function (d) {

            var more = false, sign = 1, h = 0, m = 0,
                data = this._data,
                code = data[0],
                offset = new Date().getTimezoneOffset();
            switch (code) {
                case '+':
                    more = true;
                    break;
                case '-':
                    sign = -1;
                    more = true;
                    break;
                case 'Z':
                    break;
                default:
                    h = code.charCodeAt() - 'A'.charCodeAt();
                    if (h > 24) {
                        return NaN;
                    }
                    if (h > 12) {
                        h = h - 12;
                        sign = -1;
                    }
            }
            this._data = this._data.substr(1);
            if (more) {

                if (isNaN(h = this._parseDigits(4))) {
                    return NaN;
                }
                if (h < 100 && data[0] === ':') {
                    if (isNaN(m = this._parseDigits(2))) {
                        return NaN;
                    }
                } else {
                    m = h % 100;
                    h = Math.floor(h / 100);
                }

            }
            m = d[MI] - sign * m - offset;
            h = d[H] - sign * h;
            while (m < 0) {
                h -=1;
                m += 60;
            }
            while (m > 59) {
                h += 1;
                m -= 60;
            }
            d[H] = h;
            d[MI] = m;
            return true;
        },
        Z: function () {
            return NaN;

        },
        '%': function () {
            this._data = this._data.substr(1);
            return true;
        }


    },
    /**
     * Converts data to type Date. If `format` is specified and `data` is a string
     * it will parse it according to that spec, otherwise, it will try `Date.parse`.
     *
     * The parser tries to be tolerant.  Whitespace is mostly ignored and leading zeros
     * are not required.  The `%Z` format is not supported as well as those derived
     * from it (such as %c in the `en` locale).
     *
     * Some formats, such as
     * the day of the week, are ignored for the calculation, since they don't provide
     * enough information on their own, but are required to be present in the input
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
     */
    parse: function(data, format, cutoff) {
        var val,
            d = [0,0,0,0,0,0,0],
            parsers = this.parsers,
            i, p = false, c,
            L = Y.Lang;

        cutoff = (cutoff === undefined ? 30 : cutoff);

        /*jshint eqeqeq:false */ // The simple != below is intentional
        if (data && format && typeof(data) === 'string' && +data != data) {
        /*jshint eqeqeq:true */

            this._data = data.toLowerCase();
            format = this._expandAggregates(format).replace(spaceRegExp, '');

            this._pending = {};

            scan: for (i = 0; i < format.length; i+=1) {
                c = format[i];
                if (p) {
                    p = false;
                    if (parsers[c]) {
                        if (isNaN(parsers[c].call(this, d))) {
                            break scan;
                        }

                    }
                } else {
                    if (c ==='%') {
                        p = true;
                    } else {
                        data = L.trimLeft(this._data);
                        if (data[0] !== c.toLowerCase()) {
                            break scan;
                        }
                        this._data = data.substr(1);
                    }
                }
            }
            if (i < format.length) {
                Y.log("Could not convert data " + Y.dump(val) + " to type Date using format " + format + " at format position " + i, "warn", "date");
                return null;

            }
            if (cutoff !== null && d[YR] < 100) {
                d[YR] += (d[YR] < cutoff ? 2000 : 1900);
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

                }
            }
            return new Date(d[YR],d[MO],d[D],d[H],d[MI],d[S]);

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
