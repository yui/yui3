// Constants to refer to the parts of the date array
var YR = 0, MO = 1, D = 2, H = 3, MI = 4, S = 5;
/**
 * Parse number submodule.
 *
 * @module datatype-date
 * @submodule datatype-date-parse
 * @for Date
 */
Y.mix(Y.namespace("Date"), {
    /**
     * Turns a sequence of digits into a number.
     * Returns an array containing the value parsed and the number of characters read.
     *
     */
    _data:null,
    _index:0,
    _errorFlag: false,
    _parseDigits: function (maxLen, max, skipSpace) {
        var i, digit, val = 0,
            index = this._index,
            data = this._data;
        for (i = 0; i < maxLen; i += 1, index += 1) {
            if (!(skipSpace && data[index] === ' ')) {
                digit = parseInt(data[index],10);
                if (isNaN(digit)) {
                    if (i === 0) {
                        this._errorFlag = true;
                        return NaN;
                    }
                    break;
                }
                val = val * 10 + digit;
            }
        }
        if (val < 0 || max && val > max) {
            this._errorFlag = true;
            return NaN;
        }
        this._index = index;
        return val;
    },
    _parseStrings: function (options) {
        var i,
            index = this._index,
            data = this._data.substr(index);
        for (i = 0; i < options.length; i += 1) {
            if (data.indexOf(options[i].toLowerCase()) === 0) {
                this._index += options[i].length;
                return i;
            }
        }
        this._errorFlag = true;
        return NaN;
    },
    _pending: {},
    parsers: {
        // Though some of the parts might not provide useful information,
        // such as the weekday
        // they need to be skipped over
        a: function (d , resources) {
            this._parseStrings(resources.a);
        },
        A: function (d  , resources) {
            this._parseStrings(resources.A);
        },
        b: function (d , resources) {
            d[MO] = this._parseStrings(resources.b);
        },
        B: function (d , resources) {
            d[MO] = this._parseStrings(resources.B);
        },
        C: function (d) {
            d[YR] += this._parseDigits(2);
        },
        d: function (d) {
            d[D] = this._parseDigits(2, 31);
        },
        e: function (d) {
            d[D] = this._parseDigits(2, 31, true);
        },
        g: function (d) {
            d[YR] = this._parseDigits(2);
        },
        G: function (d) {
            d[YR] = this._parseDigits(4);

        },
        H: function (d) {
            d[H] += this._parseDigits(2, 23);
        },
        I: function (d) {
            d[H] += this._parseDigits(2, 12) - 1;
        },
        j: function () {
            // The year might not be in yet, so I leave it pending
            this._pending.j = this._parseDigits(3);

        },
        k: function (d) {
            d[H] += this._parseDigits(2, 23, true);
        },
        l: function (d) {
            d[H] +=  this._parseDigits(2, 12, true) - 1;
        },
        m: function (d) {
            d[MO] = this._parseDigits(2, 12) - 1;
        },
        M: function (d) {
            d[MI] +=  this._parseDigits(2, 59);
        },
        p: function (d , resources) {
            d[H] += this._parseStrings(resources.p) ? 12 : 0;
        },
        P: function (d , resources) {
            d[H] +=  this._parseStrings(resources.P) ? 12 : 0;
        },
        s: function () {
            // The seconds by themselves provide all that is needed
            this._pending.s = parseInt(this._data.substr(this._index), 10);
        },
        S: function (d) {
            d[S] = this._parseDigits(2, 59);
        },
        u: function () {
            // No useful information, just skip over
            this._parseDigits(1);
        },
        U: function () {
            // No useful information, just skip over
            this._parseDigits(2);
        },
        V: function () {
            // No useful information, just skip over
            this._parseDigits(2);
        },
        w: function () {
            // No useful information, just skip over
            this._parseDigits(1);
        },
        W: function () {
            // No useful information, just skip over
            this._parseDigits(2);
        },
        y: function (d) {
            d[YR] = this._parseDigits(4);
        },
        Y: function (d) {
            d[YR] = this._parseDigits(4);
        },
        z: function (d) {

            var len = 1, more = false, sign = 1, h = 0, m = 0,
                data = this._data.substr(this._index),
                code = data[0], val,
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
                        this._errorFlag = true;
                        return NaN;
                    }
                    if (h > 12) {
                        h = h - 12;
                        sign = -1;
                    }
            }
            this._index += 1;
            if (more) {

                h = this._parseDigits(4);
                if (h < 100 && data[this._index] === ':') {
                    m = this._parseDigits(2);
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
        },
        Z: function () {
            this._errorFlag = true;
            return NaN;

        },
        '%': function () {
            this._index +=1;
        }


    },
    /**
     * Converts data to type Date. If `format` is specified and `data` is a string
     * it will parse it according to that spec, otherwise, it will try `Date.parse`.
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
            resources = this._resources,
            i, p = false, c;

        cutoff = (cutoff === undefined ? 30 : cutoff);

        /*jshint eqeqeq:false */ // The simple != below is intentional
        if (data && format && typeof(data) === 'string' && +data != data) {
        /*jshint eqeqeq:true */

            this._data = data = data.toLowerCase();
            this._index = 0;
            format = this._expandAggregates(format);


            scan: for (i = 0; i < format.length; i+=1) {
                c = format[i];
                if (p) {
                    p = false;
                    if (parsers[c]) {
                        parsers[c].call(this, d , resources);
                        if (this._errorFlag) {
                            break scan;
                        }

                    }
                } else {
                    if (c === '%') {
                        p = true;
                    } else {
                        if (data[this._index] !== c.toLowerCase()) {
                            this._errorFlag = true;
                            break scan;
                        }
                        this._index += 1;
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
            if (Y.Lang.isDate(val)) {
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
