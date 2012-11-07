YUI.add('format-relative-tests', function(Y) {
            
    var relativeTimeFormatTests = new Y.Test.Case( {
                    
        name: "Relative Time Format Tests",
                    
        setUp : function () {
            this.delta = 60 * 1000;
            this.timeValue = 1265078145;
            Y.Intl.add(
                "datatype-date-advanced-format",
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
            Y.Date.currentDate = new Date(this.timeValue);
        },
        
        //---------------------------------------------------------------------
        // Test methods
        //---------------------------------------------------------------------
                    
        "One or Two Units Long" : function () {
            var result = Y.Date.format(new Date(this.timeValue - this.delta), {
                relativeTimeFormat: "ONE_OR_TWO_UNITS_LONG"
            });

            Y.Assert.areEqual("1 minute 0 seconds ago", result);
        },
        
        "One or Two Units Abbreviated" : function () {
            var result = Y.Date.format(new Date(this.timeValue - this.delta), {
                relativeTimeFormat: "ONE_OR_TWO_UNITS_ABBREVIATED"
            });
                        
            Y.Assert.areEqual("1 min 0 secs ago", result);
        },
                    
        "One Unit Long" : function () {
            var result = Y.Date.format(new Date(this.timeValue - this.delta), {
                relativeTimeFormat: "ONE_UNIT_LONG"
            });
                        
            Y.Assert.areEqual("1 minute ago", result);
        },
                    
        "One Unit Abbreviated" : function () {
            var result = Y.Date.format(new Date(this.timeValue - this.delta), {
                relativeTimeFormat: "ONE_UNIT_ABBREVIATED"
            });
                        
            Y.Assert.areEqual("1 min ago", result);
        },
                    
        "Test result when timeValue is equal to relativeTo Time" : function () {
            var result = Y.Date.format(new Date(this.timeValue), {
                relativeTimeFormat: "ONE_UNIT_ABBREVIATED"
            });
                        
            Y.Assert.areEqual("0 secs ago", result);
        }
    });
                
    //Add tests to runner
    var TestRunner = Y.Test.Runner;
    TestRunner.add(relativeTimeFormatTests);
});
