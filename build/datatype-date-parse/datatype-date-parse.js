YUI.add('datatype-date-parse', function (Y, NAME) {

/**
 * Parse number submodule.
 *
 * @module datatype-date
 * @submodule datatype-date-parse
 * @for Date
 */
Y.mix(Y.namespace("Date"), {
    /**
     * Converts data to type Date.
     *
     * @method parse
     * @param data {Date|Number|String} date object, timestamp (string or number), or string parsable by Date.parse
     * @return {Date} a Date object or null if unable to parse
     */
    parse: function(data) {
        var val = new Date(+data || data);
        if (Y.Lang.isDate(val)) {
            return val;
        } else {
            return null;
        }
    }
});

// Add Parsers shortcut
Y.namespace("Parsers").date = Y.Date.parse;

Y.namespace("DataType");
Y.DataType.Date = Y.Date;


}, '@VERSION@');
