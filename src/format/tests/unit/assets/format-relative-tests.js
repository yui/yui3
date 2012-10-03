YUI.add('format-relative-tests', function(Y) {
            
    var relativeTimeFormatTests = new Y.Test.Case( {
                    
        name: "Relative Time Format Tests",
                    
        setUp : function () {
            this.delta = 60;
            this.timeValue = 1265078145;
            Y.Intl.add(
                "format-relative",
                "en-US",

                {
                    "RelativeTime/oneUnit" : "{0} ago",
                    "RelativeTime/twoUnits" : "{0} {1} ago",
                    "minute" : "minute",
                    "minute_abbr" : "min",
                    "minutes" : "minutes",
                    "minutes_abbr" : "mins",
                    "second" : "second",
                    "second_abbr" : "sec",
                    "seconds" : "seconds",
                    "seconds_abbr" : "secs"
                }
                );
        },
        
        //---------------------------------------------------------------------
        // Test methods
        //---------------------------------------------------------------------
                    
        "One or Two Units Long" : function () {
            var formatter = new Y.RelativeTimeFormat(Y.RelativeTimeFormat.STYLES.ONE_OR_TWO_UNITS_LONG);
            var result = formatter.format(this.timeValue - this.delta, this.timeValue);
                        
            Y.Assert.areEqual("1 minute 0 seconds ago", result);
        },
        
        "One or Two Units Abbreviated" : function () {
            var formatter = new Y.RelativeTimeFormat(Y.RelativeTimeFormat.STYLES.ONE_OR_TWO_UNITS_ABBREVIATED);
            var result = formatter.format(this.timeValue - this.delta, this.timeValue);
                        
            Y.Assert.areEqual("1 min 0 secs ago", result);
        },
                    
        "One Unit Long" : function () {
            var formatter = new Y.RelativeTimeFormat(Y.RelativeTimeFormat.STYLES.ONE_UNIT_LONG);
            var result = formatter.format(this.timeValue - this.delta, this.timeValue);
                        
            Y.Assert.areEqual("1 minute ago", result);
        },
                    
        "One Unit Abbreviated" : function () {
            var formatter = new Y.RelativeTimeFormat(Y.RelativeTimeFormat.STYLES.ONE_UNIT_ABBREVIATED);
            var result = formatter.format(this.timeValue - this.delta, this.timeValue);
                        
            Y.Assert.areEqual("1 min ago", result);
        },
                    
        "Test result when timeValue is equal to relativeTo Time" : function () {
            var formatter = new Y.RelativeTimeFormat(Y.RelativeTimeFormat.STYLES.ONE_UNIT_ABBREVIATED);
            var result = formatter.format(this.timeValue, this.timeValue);
                        
            Y.Assert.areEqual("0 secs ago", result);
        }
    });
                
    //Add tests to runner
    var TestRunner = Y.Test.Runner;
    TestRunner.add(relativeTimeFormatTests);
});
