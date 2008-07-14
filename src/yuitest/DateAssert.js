(function(){

    var M = function(Y){
    
        var Assert = Y.Assert;
        
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
                    Assert.areEqual(expected.getFullYear(), actual.getFullYear(), Assert._formatMessage(message, "Years should be equal."));
                    Assert.areEqual(expected.getMonth(), actual.getMonth(), Assert._formatMessage(message, "Months should be equal."));
                    Assert.areEqual(expected.getDate(), actual.getDate(), Assert._formatMessage(message, "Day of month should be equal."));
                } else {
                    throw new TypeError("DateAssert.datesAreEqual(): Expected and actual values must be Date objects.");
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
                    Assert.areEqual(expected.getHours(), actual.getHours(), Assert._formatMessage(message, "Hours should be equal."));
                    Assert.areEqual(expected.getMinutes(), actual.getMinutes(), Assert._formatMessage(message, "Minutes should be equal."));
                    Assert.areEqual(expected.getSeconds(), actual.getSeconds(), Assert._formatMessage(message, "Seconds should be equal."));
                } else {
                    throw new TypeError("DateAssert.timesAreEqual(): Expected and actual values must be Date objects.");
                }
            }
            
        };
    };
    
    YUI.add("dateassert", M, "3.0.0");
    
})();