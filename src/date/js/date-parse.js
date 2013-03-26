/**
 * Parse number submodule.
 *
 * @module datatype-date
 * @submodule datatype-date-parse
 * @for Date
 */
Y.mix(Y.namespace("Date"), {
    _parseDigits: function (data, maxLen) {
        var i, digit, val = 0;
        for (i = 0; i < maxLen; i += 1) {
            digit = parseInt(data[i],10);
            if (isNaN(digit)) {
                if (i === 0) {
                    i = NaN;
                }
                break;
            }
            val = val * 10 + digit;
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
            d[1] = val[0];
            return val[1];
        },
        B: function (data, d , resources) {
            var val = this._parseStrings(data, resources.B);
            d[1] = val[0];
            return val[1];
        },
        C: function (data, d) {
            var val = this._parseDigits(data, 2);
            d[0] += val[0];
            return val[1];
        },
        d: function (data, d) {
            var val = this._parseDigits(data, 2);
            d[2] = val[0];
            if (d[2] > 31) {
                return NaN;
            }
            return  val[1];
        },
        e: function (data, d) {
            var val = this._parseDigits(data, 2);
            d[2] = val[0];
            if (d[2] > 31) {
                return NaN;
            }
            return  val[1];
        },
        g: function (data, d , resources) {
            var val = this._parseDigits(data, 2);
            d[0] = val[0];
            return  val[1];
        },
        G: function (data, d , resources) {
            var val = this._parseDigits(data, 4);
            d[0] = val[0];
            return  val[1];

        },
        H: function (data, d , resources) {

        },
        I: function (data, d , resources) {

        },
        j: function (data, d , resources) {

        },
        k: function (data, d , resources) {

        },
        l: function (data, d , resources) {

        },
        m: function (data, d , resources) {
            var val = this._parseDigits(data, 2);
            d[1] = val[0] - 1;
            if (d[1] > 11) {
                return NaN;
            }
            return  val[1];

        },
        M: function (data, d , resources) {

        },
        p: function (data, d , resources) {

        },
        P: function (data, d , resources) {

        },
        s: function (data, d , resources) {

        },
        S: function (data, d , resources) {

        },
        u: function (data, d , resources) {

        },
        U: function (data, d , resources) {

        },
        V: function (data, d , resources) {

        },
        w: function (data, d , resources) {

        },
        W: function (data, d , resources) {

        },
        y: function (data, d , resources) {

        },
        Y: function (data, d) {
            var val = this._parseDigits(data, 4);
            d[0] = val[0];
            return  val[1];
        },
        z: function (data, d , resources) {

        },
        Z: function (data, d , resources) {

        },
        '%': function (data, d , resources) {
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

        /* jshint eqeqeq: false */ // The simple != below is intentional
        if (data && format && typeof(data) === 'string' && +data != data) {
        /* jshint eqeqeq: true */

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
                        if (data[j] !== c) {
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
            if (cutoff !== null && d[0] < 100) {
                d[0] += (d[0] < cutoff ? 2000 : 1900);
            }
            return new Date(d[0],d[1],d[2],d[3],d[4],d[5],d[6]);

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
