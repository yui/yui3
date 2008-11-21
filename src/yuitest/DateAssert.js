
    
    /**
     * The DateAssert object provides functions to test JavaScript Date objects
     * for a variety of cases.
     *
     * @namespace Y
     * @class DateAssert
     * @static
     */
     
    Y.DateAssert = {
    
        /**
         * Asserts that a date's month, day, and year are equal to another date's.
         * @param {Date} expected The expected date.
         * @param {Date} actual The actual date to test.
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @method datesAreEqual
         * @static
         */
        datesAreEqual : function (expected /*:Date*/, actual /*:Date*/, message /*:String*/){
            if (expected instanceof Date && actual instanceof Date){
                Y.AssertareEqual(expected.getFullYear(), actual.getFullYear(), Y.Assert_formatMessage(message, "Years should be equal."));
                Y.AssertareEqual(expected.getMonth(), actual.getMonth(), Y.Assert_formatMessage(message, "Months should be equal."));
                Y.AssertareEqual(expected.getDate(), actual.getDate(), Y.Assert_formatMessage(message, "Day of month should be equal."));
            } else {
                throw new TypeError("DateY.AssertdatesAreEqual(): Expected and actual values must be Date objects.");
            }
        },
    
        /**
         * Asserts that a date's hour, minutes, and seconds are equal to another date's.
         * @param {Date} expected The expected date.
         * @param {Date} actual The actual date to test.
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @method timesAreEqual
         * @static
         */
        timesAreEqual : function (expected /*:Date*/, actual /*:Date*/, message /*:String*/){
            if (expected instanceof Date && actual instanceof Date){
                Y.AssertareEqual(expected.getHours(), actual.getHours(), Y.Assert_formatMessage(message, "Hours should be equal."));
                Y.AssertareEqual(expected.getMinutes(), actual.getMinutes(), Y.Assert_formatMessage(message, "Minutes should be equal."));
                Y.AssertareEqual(expected.getSeconds(), actual.getSeconds(), Y.Assert_formatMessage(message, "Seconds should be equal."));
            } else {
                throw new TypeError("DateY.AsserttimesAreEqual(): Expected and actual values must be Date objects.");
            }
        }
        
    };