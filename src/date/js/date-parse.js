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
    _parseDigits: function (data, maxLen, max, skipSpace) {
        var i, digit, val = 0;
        for (i = 0; i < maxLen; i += 1) {
            if (!(skipSpace && data[i] === ' ')) {
                digit = parseInt(data[i],10);
                if (isNaN(digit)) {
                    if (i === 0) {
                        i = NaN;
                    }
                    break;
                }
                val = val * 10 + digit;
            }
        }
        if (val < 0 || max && val > max) {
            i = NaN;
        }
        return [val,i];
    },
    _parseStrings: function (data, options) {
        var i;
        for (i = 0; i < options.length; i += 1) {
            if (data.indexOf(options[i].toLowerCase()) === 0) {
                return [i, options[i].length];
            }
        }
        return [0,NaN];
    },
    _pending: {},
    parsers: {
        // Though some of the parts might not provide useful information,
        // such as the weekday
        // they need to be skipped over
        a: function (data, d , resources) {
            var val = this._parseStrings(data, resources.a);
            return val[1];
        },
        A: function (data, d , resources) {
            var val = this._parseStrings(data, resources.A);
            return val[1];
        },
        b: function (data, d , resources) {
            var val = this._parseStrings(data, resources.b);
            d[MO] = val[0];
            return val[1];
        },
        B: function (data, d , resources) {
            var val = this._parseStrings(data, resources.B);
            d[MO] = val[0];
            return val[1];
        },
        C: function (data, d) {
            var val = this._parseDigits(data, 2);
            d[YR] += val[0];
            return val[1];
        },
        d: function (data, d) {
            var val = this._parseDigits(data, 2, 31);
            d[D] = val[0];
            return  val[1];
        },
        e: function (data, d) {
            var val = this._parseDigits(data.substr(i), 2, 31, true);
            d[D] = val[0];
            return  val[1];
        },
        g: function (data, d) {
            var val = this._parseDigits(data, 2);
            d[YR] = val[0];
            return  val[1];
        },
        G: function (data, d) {
            var val = this._parseDigits(data, 4);
            d[YR] = val[0];
            return  val[1];

        },
        H: function (data, d) {
            var val = this._parseDigits(data, 2, 23);
            d[H] += val[0];
            return val[1];

        },
        I: function (data, d) {
            var val = this._parseDigits(data, 2, 12);
            d[H] += val[0] - 1;
            return val[1];

        },
        j: function (data) {
            // The year might not be in yet, so I leave it pending
            this._pending.j = this._parseDigits(data, 3);

        },
        k: function (data, d) {
            var  val = this._parseDigits(data.substr(i), 2, 23, true);
            d[H] += val[0];
            return val[1];


        },
        l: function (data, d) {
            var val = this._parseDigits(data, 2, 12, true);
            d[H] += val[0] - 1;
            return val[1];

        },
        m: function (data, d) {
            var val = this._parseDigits(data, 2, 12);
            d[MO] = val[0] - 1;
            return  val[1];

        },
        M: function (data, d) {
            var val = this._parseDigits(data, 2, 59);
            d[MI] += val[0];
            return  val[1];
        },
        p: function (data, d , resources) {
            var val = this._parseStrings(data, resources.p);
            d[H] += val[0] ? 12 : 0;
            return val[1];
        },
        P: function (data, d , resources) {
            var val = this._parseStrings(data, resources.P);
            d[H] += val[0] ? 12 : 0;
            return val[1];
        },
        s: function (data) {
            // The seconds by themselves provide all that is needed
            this._pending.s = parseInt(data, 10);
        },
        S: function (data, d) {
            var val = this._parseDigits(data, 2, 59);
            d[S] = val[0];
            return  val[1];
        },
        u: function (data) {
            // No useful information, just skip over
            var val = this._parseDigits(data, 1);
            return val[1];
        },
        U: function (data) {
            // No useful information, just skip over
            var val = this._parseDigits(data, 2);
            return val[1];
        },
        V: function (data) {
            // No useful information, just skip over
            var val = this._parseDigits(data, 2);
            return val[1];
        },
        w: function (data) {
            // No useful information, just skip over
            var val = this._parseDigits(data, 1);
            return val[1];
        },
        W: function (data) {
            // No useful information, just skip over
            var val = this._parseDigits(data, 2);
            return val[1];
        },
        y: function (data, d) {
            var val = this._parseDigits(data, 4);
            d[YR] = val[0];
            return  val[1];
        },
        Y: function (data, d) {
            var val = this._parseDigits(data, 4);
            d[YR] = val[0];
            return  val[1];
        },
        z: function (data, d) {
            var len = 1, more = false, sign = 1, h = 0, m = 0,
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
                        return NaN;
                    }
                    if (h > 12) {
                        h = h - 12;
                        sign = -1;
                    }
            }
            if (more) {
                val = this._parseDigits(data.substr(1),4);
                len += val[1];
                h = val[0];
                if (val[1] <= 2) {
                    if (data[val[1] + 1] === ':') {
                        val = this._parseDigits(data.substr(val[1] + 2),2);
                        len += val[1] + 1;
                        m = val[0];
                    }
                } else {
                    m = h % 100;
                    h = Math.floor(h / 100);
                }

            }
            m = d[MI] - sign * m + offset;
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
            return len;
        },
        Z: function () {
            return NaN;

        },
        '%': function () {
            return 1;

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
            i,j = 0, p = false, c;

        cutoff = (cutoff === undefined ? 30 : cutoff);

        /*jshint eqeqeq:false */ // The simple != below is intentional
        if (data && format && typeof(data) === 'string' && +data != data) {
        /*jshint eqeqeq:true */

            data = data.toLowerCase();
            format = this._expandAggregates(format);

            scan: for (i = 0; i < format.length; i+=1) {
                c = format[i];
                if (p) {
                    p = false;
                    if (parsers[c]) {
                        j += parsers[c].call(this, data.substr(j), d , resources);
                        if (isNaN(j)) {
                            break scan;
                        }

                    }
                } else {
                    if (c === '%') {
                        p = true;
                    } else {
                        if (data[j] !== c.toLowerCase()) {
                            break scan;
                        }
                        j += 1;
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
