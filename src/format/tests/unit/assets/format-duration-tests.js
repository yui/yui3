YUI.add('format-duration-tests', function(Y) {
                
    var durationFormatTests = new Y.Test.Case( {
                    
        name: "Duration Format Tests",
                    
        setUp : function () {
            Y.Intl.add(
                "format-duration",
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
            this.durationLong = new Y.DurationFormat(Y.DurationFormat.STYLES.HMS_LONG);
            this.durationShort = new Y.DurationFormat(Y.DurationFormat.STYLES.HMS_SHORT);
        },
        
        //---------------------------------------------------------------------
        // Test methods
        //---------------------------------------------------------------------
                    
        "Test for format(int timeValueInSeconds)" : function () {
            var Assert = Y.Assert;
                        
            //Test long format first
            var result = this.durationLong.format(1), expect = "0 hours 0 minutes 1 second";
            Assert.areEqual(expect, result);
                    
            result = this.durationLong.format(3601), expect = "1 hour 0 minutes 1 second";
            Assert.areEqual(expect, result);
                        
            //Test short format
            result = this.durationShort.format(1), expect = "0:00:01";
            Assert.areEqual(expect, result);
                        
            result = this.durationShort.format(3601), expect = "1:00:01";
            Assert.areEqual(expect, result);
        },
        
        "Test for format(string xmlDurationFormat)" : function () {
            var Assert = Y.Assert;
                        
            //Test long format first
            var result = this.durationLong.format("PT1M2S"), expect = "1 minute 2 seconds";
            Assert.areEqual(expect, result);
                    
            result = this.durationLong.format("P12Y23M34DT11H22M33S"), expect = "11 hours 22 minutes 33 seconds";
            Assert.areEqual(expect, result);
                        
            //Test short format
            result = this.durationShort.format("PT1M2S"), expect = "0:01:02";
            Assert.areEqual(expect, result);
                        
            result = this.durationShort.format("P12Y23M34DT11H22M33S"), expect = "11:22:33";
            Assert.areEqual(expect, result);
        },
                    
        "Test for format(int hour, int min, int second)" : function () {
            var Assert = Y.Assert;
                        
            //Test long format first
            var result = this.durationLong.format(-1, -1, 3), expect = "3 seconds";
            Assert.areEqual(expect, result);
                    
            result = this.durationLong.format(-1, 41, -3), expect = "41 minutes";
            Assert.areEqual(expect, result);
                        
            //Test short format
            result = this.durationShort.format(-1, -1, 3), expect = "0:00:03";
            Assert.areEqual(expect, result);
                        
            result = this.durationShort.format(-1, 41, -3), expect = "0:41:00";
            Assert.areEqual(expect, result);
        }
    });

    //Add tests to runner
    var TestRunner = Y.Test.Runner;
    TestRunner.add(durationFormatTests);
});
