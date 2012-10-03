YUI.add('format-message-tests', function(Y) {
	
    var messageFormatTests = new Y.Test.Case({
    
        name : "Message Format Tests",
            
        setUp: function() {

            Y.Intl.add(
                "format-date",
                "en",
                {
                    "YMD_short" : "M/d/yy",
                    "YMD_abbreviated" : "MMM d, y",
                    "YMD_long" : "MMMM d, y",
                    "WYMD_long" : "EEEE, MMMM d, y",
                    "monthSepMedium" : "Sep",
                    "monthSepLong" : "September",
                    "weekdayTueLong" : "Tuesday",
                    "HM_abbreviated" : "h:mm a",
                    "HM_short" : "h:mm a",
                    "H_abbreviated" : "h a",
                    "DateTimeCombination" : "{1} {0}",
                    "DateTimeTimezoneCombination" : "{1} {0} {2}",
                    "DateTimezoneCombination" : "{1} {2}",
                    "TimeTimezoneCombination" : "{0} {2}",
                    "periodAm" : "AM",
                    "periodPm" : "PM"
                }
                );

            Y.Intl.add(
                "timezone",
                "en",
                {
                    "Asia/Kolkata_Z_abbreviated" : "India Time",
                    "Asia/Kolkata_Z_short" : "IST"
                }
                );

            Y.MessageFormat.setTimeZone("Asia/Kolkata");
        },

        testStringFormat: function () {
            var result = Y.MessageFormat.format("{EMPLOYEE} reports to {MANAGER}", {
                "EMPLOYEE": "Ashik", 
                "MANAGER": "Dharmesh"
            });
            Y.Assert.areEqual("Ashik reports to Dharmesh", result);
        },

        testDateFormat: function() {
            var values = {
                "DATE": new Date(2012, 8, 25, 16, 30)
            };

            var result = Y.MessageFormat.format("Today is {DATE, date, short}", values);
            Y.Assert.areEqual("Today is 9/25/12", result, "short DateFormat failed");

            result = Y.MessageFormat.format("Today is {DATE, date, medium}", values);
            Y.Assert.areEqual("Today is Sep 25, 2012", result, "medium DateFormat failed");

            result = Y.MessageFormat.format("Today is {DATE, date, long}", values);
            Y.Assert.areEqual("Today is September 25, 2012", result, "long DateFormat failed");

            result = Y.MessageFormat.format("Today is {DATE, date, full}", values);
            Y.Assert.areEqual("Today is Tuesday, September 25, 2012", result, "full DateFormat failed");
        },

        testTimeFormat: function() {
            var values = {
                "DATE": new Date(2012, 8, 25, 16, 30)
            };

            var result = Y.MessageFormat.format("The time is {DATE, time, short}", values);
            Y.Assert.areEqual("The time is 4:30 PM", result, "short DateFormat failed");

            result = Y.MessageFormat.format("The time is {DATE, time, medium}", values);
            Y.Assert.areEqual("The time is 4:30 PM", result, "medium DateFormat failed");

            result = Y.MessageFormat.format("The time is {DATE, time, long}", values);
            Y.Assert.areEqual("The time is 4:30 PM IST", result, "long DateFormat failed");

            result = Y.MessageFormat.format("The time is {DATE, time, full}", values);
            Y.Assert.areEqual("The time is 4:30 PM India Time", result, "full DateFormat failed");
        },

	testNumberFormat: function() {
            var values = {
                "PRICE": 5000000,
                "POPULATION": 8244910,
                "POPULATION_INDIA": 1241.492,
                "CITY": "New York",
                "SF_PERCENT": 0.15
            };

            var result = Y.MessageFormat.format("There are {POPULATION_INDIA, number} million people in India.", values);
            Y.Assert.areEqual("There are 1,241.492 million people in India.", result, "MessageFormat: {KEY, number} failed");

            result = Y.MessageFormat.format("There are {POPULATION, number, integer} people in {CITY}.", values);
            Y.Assert.areEqual("There are 8,244,910 people in New York.", result, "MessageFormat: {KEY, number, integer} failed");

            result = Y.MessageFormat.format("Current estimates of global smartphone penetration is around {SF_PERCENT, number, percent}.", values);
            Y.Assert.areEqual("Current estimates of global smartphone penetration is around 15%.", result, "MessageFormat: {KEY, number, percent} failed");

            result = Y.MessageFormat.format("The land was sold for {PRICE, number, currency}.", values);
            Y.Assert.areEqual("The land was sold for $5,000,000.00.", result, "MessageFormat: {KEY, number, currency} failed");
	},

	testSelectFormat: function() {
            var pattern = "{NAME} est {GENDER, select, female {allée} other {allé}} à {CITY}.";
            var values = { "NAME": "Henri", "GENDER": "male", "CITY": "Paris" };
	
            var result = Y.MessageFormat.format(pattern, values);
            Y.Assert.areEqual("Henri est allé à Paris.", result);

            values.NAME = "Anne"; values.GENDER = "female";
            result = Y.MessageFormat.format(pattern, values);
            Y.Assert.areEqual("Anne est allée à Paris.", result);
	},

	testPluralFormat: function() {
            var pattern = "{COMPANY_COUNT, plural, one {One company} other {# companies}} published new books.";
	
            var result = Y.MessageFormat.format(pattern, { "COMPANY_COUNT": 1 });
            Y.Assert.areEqual("One company published new books.", result);

            result = Y.MessageFormat.format(pattern, { "COMPANY_COUNT": 2 });
            Y.Assert.areEqual("2 companies published new books.", result);
	},

	testChoiceFormat: function() {
            var pattern = "There {FILE_COUNT, choice, 0#are no files|1#is one file|1<are {FILE_COUNT, number, integer} files} on disk.";

            var result = Y.MessageFormat.format(pattern, { "FILE_COUNT": 0 });
            Y.Assert.areEqual("There are no files on disk.", result);

            result = Y.MessageFormat.format(pattern, { "FILE_COUNT": 1 });
            Y.Assert.areEqual("There is one file on disk.", result);

            result = Y.MessageFormat.format(pattern, { "FILE_COUNT": 2 });
            Y.Assert.areEqual("There are 2 files on disk.", result);
	},

        testNoMatch: function() {
            var pattern = "Test string. {blah}. blah should not match any type.";
            var result = Y.MessageFormat.format(pattern, {});
            Y.Assert.areEqual(pattern, result);
        }
    });

    //Add tests to runner
    var TestRunner = Y.Test.Runner;
    TestRunner.add(messageFormatTests);
});
