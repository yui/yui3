YUI.add('format-duration-tests', function(Y) {
                
    var durationFormatTests = new Y.Test.Case( {
                    
        name: "Duration Format Tests",
                    
        setUp : function () {
            Y.Intl.add(
                "datatype-date-advanced-format",
                "en-US",
                {
                    "HMS_long" : "{0} {1} {2}",
                    "HMS_short" : "{0}:{1}:{2}",
                    "hour" : "hour",
                    "hours" : "hours",
                    "minute" : "minute",
                    "minutes" : "minutes",
                    "second" : "second",
                    "seconds" : "seconds"			
                }
                );
                    
            Y.Intl.add(
                "format-numbers",
                "en-US",
                {
                    "decimalFormat" : "#,##0.###",
                    "decimalSeparator" : ".",
                    "defaultCurrency" : "USD",
                    "exponentialSymbol" : "E",
                    "groupingSeparator" : ",",
                    "minusSign" : "-",
                    "numberZero" : "0"
                }
                );
        },
        
        //---------------------------------------------------------------------
        // Test methods
        //---------------------------------------------------------------------
                    
        "Test for format(int timeValueInSeconds)" : function () {
            var Assert = Y.Assert;
                        
            //Test long format first
            var result = Y.Date.formatDuration(1, {
                style: "HMS_LONG"
            }), expect = "0 hours 0 minutes 1 second";
            Assert.areEqual(expect, result);
                    
            result = Y.Date.formatDuration(3601, {
                style: "HMS_LONG"
            }), expect = "1 hour 0 minutes 1 second";
            Assert.areEqual(expect, result);
                        
            //Test short format
            result = Y.Date.formatDuration(1, {
                style: "HMS_SHORT"
            }), expect = "0:00:01";
            Assert.areEqual(expect, result);
                        
            result = Y.Date.formatDuration(3601, {
                style: "HMS_SHORT"
            }), expect = "1:00:01";
            Assert.areEqual(expect, result);
        },
        
        "Test for format(string xmlDurationFormat)" : function () {
            var Assert = Y.Assert;
                        
            //Test long format first
            var result = Y.Date.formatDuration("PT1M2S", {
                style: "HMS_LONG"
            }), expect = "1 minute 2 seconds";
            Assert.areEqual(expect, result);
                    
            result = Y.Date.formatDuration("P12Y23M34DT11H22M33S", {
                style: "HMS_LONG"
            }), expect = "11 hours 22 minutes 33 seconds";
            Assert.areEqual(expect, result);
                        
            //Test short format
            result = Y.Date.formatDuration("PT1M2S", {
                style: "HMS_SHORT"
            }), expect = "0:01:02";
            Assert.areEqual(expect, result);
                        
            result = Y.Date.formatDuration("P12Y23M34DT11H22M33S", {
                style: "HMS_SHORT"
            }), expect = "11:22:33";
            Assert.areEqual(expect, result);
        },
                    
        "Test for format(hours, minutes, seconds)" : function () {
            var Assert = Y.Assert;
                        
            //Test long format first
            var result = Y.Date.formatDuration({
                seconds: 3
            }, {
                style: "HMS_LONG"
            }), expect = "3 seconds";
            Assert.areEqual(expect, result);
                    
            result = Y.Date.formatDuration({
                minutes: 41
            }, {
                style: "HMS_LONG"
            }), expect = "41 minutes";
            Assert.areEqual(expect, result);
                        
            //Test short format
            result = Y.Date.formatDuration({
                seconds: 3
            }, {
                style: "HMS_SHORT"
            }), expect = "0:00:03";
            Assert.areEqual(expect, result);
                        
            result = Y.Date.formatDuration({
                minutes: 41
            }, {
                style: "HMS_SHORT"
            }), expect = "0:41:00";
            Assert.areEqual(expect, result);
            
            result = Y.Date.formatDuration({
                hours: 1, 
                minutes: 41, 
                seconds: 3
            }, {
                style: "HMS_SHORT"
            }), expect = "1:41:03";
            Assert.areEqual(expect, result);
        }
    });

    //Add tests to runner
    var TestRunner = Y.Test.Runner;
    TestRunner.add(durationFormatTests);
});
