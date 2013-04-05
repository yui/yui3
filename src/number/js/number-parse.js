/**
 * Parse number submodule.
 *
 * @module datatype-number
 * @submodule datatype-number-parse
 * @for Number
 */

var LANG = Y.Lang;

Y.mix(Y.namespace("Number"), {
    /**
     * Converts data to type Number.
     * If a `config` argument is used, it will strip the `data` of the prefix,
     * the suffix and the thousands separator, if any of them are found,
     * replace the decimal separator by a dot and parse the resulting string.
     * Extra whitespace will be ignored.
     *
     * @method parse
     * @param data {String | Number | Boolean} Data to convert. The following
     * values return as null: null, undefined, NaN, "".
     * @param [config] {Object} Optional configuration values, same as for [Y.Date.format](#method_format).
     * @param [config.prefix] {HTML} String to be removed from the start, like a currency designator "$"
     * @param [config.decimalPlaces] {Number} Ignored, it is accepted only for compatibility with [Y.Date.format](#method_format).
     * @param [config.decimalSeparator] {HTML} Decimal separator.
     * @param [config.thousandsSeparator] {HTML} Thousands separator.
     * @param [config.suffix] {HTML} String to be removed from the end of the number, like " items".
     * @return {Number} A number, or null.
     */
    parse: function(data, config) {
        var number, r,
            safeRegExp = /(\\|\[|\]|\.|\+|\*|\?|\^|\$|\(|\)|\||\{|\})/g,
            safe = function(r) {
                return r.replace(safeRegExp,'\\$1');
            };
        if (LANG.isString(data) && LANG.isObject(config)) {
            data = data.replace(/\s+/g, '');
            r = config.prefix;

            if (r) {
                data = data.replace(new RegExp('^(\\s*' + safe(r) + ')') , '');
            }
            r = config.suffix;
            if (r) {
                data = data.replace(new RegExp('(' + safe(r) + '\\s*)$'),'');
            }
            r = config.thousandsSeparator;
            if (r) {
                data = data.replace(new RegExp(safe(r),'g'),'');
            }
            r = config.decimalSeparator;
            if (r && r !== '.') {
                data = data.replace(new RegExp(safe(r)),'.');
            }
        }
        number = (data === null || data === "") ? data : +data;
        if(LANG.isNumber(number)) {
            return number;
        }
        else {
            Y.log("Could not parse data to type Number", "warn", "number");
            return null;
        }
    }
});

// Add Parsers shortcut
Y.namespace("Parsers").number = Y.Number.parse;
Y.namespace("DataType");
Y.DataType.Number = Y.Number;
