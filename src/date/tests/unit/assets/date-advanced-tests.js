YUI.add('date-advanced-tests', function(Y) {
	
    var absoluteDateFormat = new Y.Test.Case({
    
        name : "Absolute DateFormat Tests",
                    
        setUp: function() {

            Y.Intl.add(
                "datatype-date-advanced-format",
                "en",
                {                    
                    "DateTimeTimezoneCombination" : "{1} {0} {2}",
                    "HM_short" : "h:mm a",
                    "WYMD_long" : "EEEE, MMMM d, y",
                    "monthJunLong" : "June",
                    "periodPm" : "PM",
                    "weekdayMonLong" : "Monday"
                }
                );
                    
            Y.Intl.add(
                "datatype-date-timezone",
                "en",
                {
                    "Asia/Kolkata_Z_short" : "IST"
                }
                );
            
            Y.Intl.add(
                "datatype-date-advanced-format",
                "th",
                {
                    "DateTimeTimezoneCombination" : "{1}, {0} {2}",
                    "HM_short" : "h:mm a",
                    "WYMD_long" : "EEEE\u0e17\u0e35\u0e48 d MMMM G y",
                    "monthJunLong" : "\u0E21\u0E34\u0E16\u0E38\u0E19\u0E32\u0E22\u0E19",
                    "periodAm" : "\u0E0A\u0E48\u0E27\u0E07\u0E27\u0E31\u0E19",
                    "periodPm" : "\u0E0A\u0E48\u0E27\u0E07\u0E27\u0E31\u0E19",
                    "weekdayMonLong" : "\u0E27\u0E31\u0E19\u0E08\u0E31\u0E19\u0E17\u0E23\u0E4C"
                }
                );
            
            Y.Intl.add(
                "datatype-date-timezone",
                "th",
                {
                    "Asia/Shanghai_Z_short" : "CST (CN)"
                }
                );
        },

        testAbsoluteDateFormat : function () {
            Y.Intl.setLang("datatype-date-advanced-format", "en");
            Y.Intl.setLang("datatype-date-timezone", "en");
                        
            var date = new Date("2012/6/25 15:30 GMT+05:30");
            var result = Y.Date.format(date, {
                timezone: "Asia/Kolkata",
                dateFormat: Y.Date.DATE_FORMATS.WYMD_LONG,
                timeFormat: Y.Date.TIME_FORMATS.HM_SHORT,
                timezoneFormat: Y.Date.TIMEZONE_FORMATS.Z_SHORT
            });
                        
            Y.Assert.areEqual("Monday, June 25, 2012 3:30 PM IST", result);
        },
                    
        testBuddhistCalendar: function () {
            //Thai calendar
            Y.Intl.setLang("datatype-date-advanced-format", "th");    //Change language for this test only
            Y.Intl.setLang("datatype-date-timezone", "th");
                        
            var date = new Date("2012/6/25 15:30 GMT+05:30");
            var result = Y.Date.format(date, {
                timezone: "Asia/Shanghai",
                dateFormat: Y.Date.DATE_FORMATS.WYMD_LONG,
                timeFormat: Y.Date.TIME_FORMATS.HM_SHORT,
                timezoneFormat: Y.Date.TIMEZONE_FORMATS.Z_SHORT
            });
                            
            Y.Assert.areEqual("\u0E27\u0E31\u0E19\u0E08\u0E31\u0E19\u0E17\u0E23\u0E4C\u0E17\u0E35\u0E48 25 \u0E21\u0E34\u0E16\u0E38\u0E19\u0E32\u0E22\u0E19 BE 2555, 6:00 \u0E0A\u0E48\u0E27\u0E07\u0E27\u0E31\u0E19 CST (CN)", result);
        }
    });
                
    var absoluteWithRelative = new Y.Test.Case( {
                    
        name: "Absoulte Date Format with Relative Dates",
        
        setUp : function () {
            Y.Intl.add(
                "datatype-date-advanced-format",
                "en",
                {                    
                    "YMD_full" : "M/d/yy",
                    "today" : "Today",
                    "tomorrow" : "Tomorrow",
                    "yesterday" : "Yesterday",
                    "monthAprLong" : "April",
                    "monthAugLong" : "August",
                    "monthDecLong" : "December",
                    "monthFebLong" : "February",
                    "monthJanLong" : "January",
                    "monthJulLong" : "July",
                    "monthJunLong" : "June",
                    "monthMarLong" : "March",
                    "monthMayLong" : "May",
                    "monthNovLong" : "November",
                    "monthOctLong" : "October",
                    "monthSepLong" : "September",
                    "periodAm" : "AM",
                    "periodPm" : "PM",
                    "weekdayFriLong" : "Friday",
                    "weekdayMonLong" : "Monday",
                    "weekdaySatLong" : "Saturday",
                    "weekdaySunLong" : "Sunday",
                    "weekdayThuLong" : "Thursday",
                    "weekdayTueLong" : "Tuesday",
                    "weekdayWedLong" : "Wednesday"			
                }
                );
                    
            this.date = new Date();
        },
        
        //---------------------------------------------------------------------
        // Test methods
        //---------------------------------------------------------------------
                    
        testToday : function () {
            var result = Y.Date.format(this.date, {
                timezone: "Asia/Kolkata",
                dateFormat:  Y.Date.DATE_FORMATS.YMD_FULL | Y.Date.DATE_FORMATS.RELATIVE_DATE
            });
            Y.Assert.areEqual("Today", result);
        },
        
        testYesterday : function () {
            var date = new Date(this.date.getTime() - 24*60*60*1000);
            var result = Y.Date.format(date, {
                timezone: "Asia/Kolkata",
                dateFormat:  Y.Date.DATE_FORMATS.YMD_FULL | Y.Date.DATE_FORMATS.RELATIVE_DATE
            });
                        
            Y.Assert.areEqual("Yesterday", result);
        },
                    
        testTomorrow : function () {
            var date = new Date(this.date.getTime() + 24*60*60*1000);
            var result = Y.Date.format(date, {
                timezone: "Asia/Kolkata",
                dateFormat:  Y.Date.DATE_FORMATS.YMD_FULL | Y.Date.DATE_FORMATS.RELATIVE_DATE
            });
                        
            Y.Assert.areEqual("Tomorrow", result);
        },
                    
        testDayAfterTomorrow: function() {
            var date = new Date(this.date.getTime() + 2*24*60*60*1000);
            var result = Y.Date.format(date, {
                timezone: "Asia/Kolkata",
                dateFormat:  Y.Date.DATE_FORMATS.YMD_FULL | Y.Date.DATE_FORMATS.RELATIVE_DATE
            });
            var expected = Y.Date.format(date, {
                timezone: "Asia/Kolkata",
                dateFormat:  Y.Date.DATE_FORMATS.YMD_FULL
            });
                        
            Y.Assert.areEqual(expected, result);
        }
    });
    
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
    
    var dateFormatTestSuite = new Y.Test.Suite("DateFormat Tests");
    dateFormatTestSuite.add(absoluteDateFormat);
    dateFormatTestSuite.add(absoluteWithRelative);

    //Add tests to runner
    var TestRunner = Y.Test.Runner;
    TestRunner.add(dateFormatTestSuite);
    TestRunner.add(durationFormatTests);
    TestRunner.add(relativeTimeFormatTests);
});
