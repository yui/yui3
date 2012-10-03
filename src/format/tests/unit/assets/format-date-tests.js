YUI.add('format-date-tests', function(Y) {
	
    var absoluteDateFormat = new Y.Test.Case({
    
        name : "Absolute DateFormat Tests",
                    
        setUp: function() {

            Y.Intl.add(
                "format-date",
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
                "timezone",
                "en",
                {
                    "Asia/Kolkata_Z_short" : "IST"
                }
                );
            
            Y.Intl.add(
                "format-date",
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
                "timezone",
                "th",
                {
                    "Asia/Shanghai_Z_short" : "CST (CN)"
                }
                );
        },

        testAbsoluteDateFormat : function () {
            Y.Intl.setLang("format-date", "en");
            Y.Intl.setLang("timezone", "en");
                        
            var date = new Date("2012/6/25 15:30 GMT+05:30");
            var formatter = new Y.DateFormat("Asia/Kolkata", Y.DateFormat.DATE_FORMATS.WYMD_LONG, Y.DateFormat.TIME_FORMATS.HM_SHORT, Y.DateFormat.TIMEZONE_FORMATS.Z_SHORT);
            var result = formatter.format(date);
                        
            Y.Assert.areEqual("Monday, June 25, 2012 3:30 PM IST", result);
        },
                    
        testBuddhistCalendar: function () {
            //Thai calendar
            Y.Intl.setLang("format-date", "th");    //Change language for this test only
            Y.Intl.setLang("timezone", "th");
                        
            var date = new Date("2012/6/25 15:30 GMT+05:30");
            var formatter = new Y.DateFormat("Asia/Shanghai", Y.DateFormat.DATE_FORMATS.WYMD_LONG, Y.DateFormat.TIME_FORMATS.HM_SHORT, Y.DateFormat.TIMEZONE_FORMATS.Z_SHORT);
            var result = formatter.format(date);
                            
            Y.Assert.areEqual("\u0E27\u0E31\u0E19\u0E08\u0E31\u0E19\u0E17\u0E23\u0E4C\u0E17\u0E35\u0E48 25 \u0E21\u0E34\u0E16\u0E38\u0E19\u0E32\u0E22\u0E19 BE 2555, 6:00 \u0E0A\u0E48\u0E27\u0E07\u0E27\u0E31\u0E19 CST (CN)", result);
        }
    });
                
    var absoluteWithRelative = new Y.Test.Case( {
                    
        name: "Absoulte Date Format with Relative Dates",
        
        setUp : function () {
            Y.Intl.add(
                "format-date",
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
                    
            this.formatter = new Y.DateFormat(
                "Asia/Kolkata",
                Y.DateFormat.DATE_FORMATS.YMD_FULL | Y.DateFormat.DATE_FORMATS.RELATIVE_DATE,
                Y.DateFormat.TIME_FORMATS.NONE,
                Y.DateFormat.TIMEZONE_FORMATS.NONE);
                        
            this.date = new Date();
        },
        
        //---------------------------------------------------------------------
        // Test methods
        //---------------------------------------------------------------------
                    
        testToday : function () {
            var result = this.formatter.format(this.date);
            Y.Assert.areEqual("Today", result);
        },
        
        testYesterday : function () {
            var date = new Date(this.date.getTime() - 24*60*60*1000);
            var result = this.formatter.format(date);
                        
            Y.Assert.areEqual("Yesterday", result);
        },
                    
        testTomorrow : function () {
            var date = new Date(this.date.getTime() + 24*60*60*1000);
            var result = this.formatter.format(date);
                        
            Y.Assert.areEqual("Tomorrow", result);
        },
                    
        testDayAfterTomorrow: function() {
            var date = new Date(this.date.getTime() + 2*24*60*60*1000);
            var nonRelativeFormatter = new Y.DateFormat(
                "Asia/Kolkata",
                Y.DateFormat.DATE_FORMATS.YMD_FULL,
                Y.DateFormat.TIME_FORMATS.NONE,
                Y.DateFormat.TIMEZONE_FORMATS.NONE);
                        
            var result = this.formatter.format(date);
            var expected = nonRelativeFormatter.format(date);
                        
            Y.Assert.areEqual(expected, result);
        }
    });

    var dateFormatTestSuite = new Y.Test.Suite("DateFormat Tests");
    dateFormatTestSuite.add(absoluteDateFormat);
    dateFormatTestSuite.add(absoluteWithRelative);

    //Add tests to runner
    var TestRunner = Y.Test.Runner;
    TestRunner.add(dateFormatTestSuite);
});
