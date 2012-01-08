/**
 * Parse number submodule.
 *
 * @module datatype
 * @submodule datatype-date-parse
 * @for DataType.Date
 */
Y.mix(Y.namespace("DataType.Date"), {
    /**
     * Converts data to type Date.
     *
     * @method parse
     * @param data {Date|Number|String} date object, timestamp (string or number), or string parsable by Date.parse
     * @return {Date} a Date object or null if unable to parse
     */
    parse: function(data) {
        var val = new Date(+data || data);
        // Validate
        if (Y.Lang.isDate(val)) {
            return val;
        } else {
            Y.log("Could not convert data " + Y.dump(data) + " to type Date", "warn", "date");
            return null;
        }
    }
});

// Add Parsers shortcut
Y.namespace("Parsers").date = Y.DataType.Date.parse;
