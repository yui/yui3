YUI.add('date-math-tests', function(Y) {

        // Set up the page
        var Assert = Y.Assert,
            suite = new Y.Test.Suite("DataType.Date.Math Test Suite");
    

        suite.add(new Y.Test.Case({
            name: "isValidDate Tests",
        
            testValidDate: function() {
                var validDate = new Date(1982, 11, 2);
                Assert.isTrue(Y.DataType.Date.isValidDate(validDate), "Expected true.");
            },

            testInvalidDate: function() {
                var invalidDate = new Date("Invalid date string");
                Assert.isFalse(Y.DataType.Date.isValidDate(invalidDate), "Expected false.")
            }
        }));

        suite.add(new Y.Test.Case({
            name: "DateMath Tests",
        
            'test: addDays': function() {
                var initDate = new Date(1983, 11, 2);
                var finalDate = new Date (1983, 11, 4);
                Assert.areEqual(Y.DataType.Date.addDays(initDate, 2).getTime(), finalDate.getTime(), "Expected true.");
            },

            'test: addMonths': function() {
                var initDate = new Date(1982, 11, 2);
                var finalDate = new Date (1983, 10, 2);
                Assert.areEqual(Y.DataType.Date.addMonths(initDate, 11).getTime(), finalDate.getTime(), "Expected true.");
            },

            'test: addYears': function() {
                var initDate = new Date(1982, 11, 2);
                var finalDate = new Date (1989, 11, 2);
                Assert.areEqual(Y.DataType.Date.addYears(initDate, 7).getTime(), finalDate.getTime(), "Expected true.");
            }
        }));

        suite.add(new Y.Test.Case({
            name: "DaysInMonth Tests",
        
            'test: daysInMonth': function() {
                var initDate = new Date(1982, 10, 1);
                Assert.areSame(Y.DataType.Date.daysInMonth(initDate), 30, "Expected true.");

                Assert.areSame(Y.DataType.Date.daysInMonth({}), 0, "Expected true.");

                //Non Leap Yaer
                var initDate = new Date(1982, 1, 1);
                Assert.areSame(Y.DataType.Date.daysInMonth(initDate), 28, "Expected true.");
                
                //Leap Year
                var initDate = new Date(1984, 1, 1);
                Assert.areSame(Y.DataType.Date.daysInMonth(initDate), 29, "Expected true.");

                //Really Old Leap Year
                var initDate = new Date(400, 1, 1);
                Assert.areSame(Y.DataType.Date.daysInMonth(initDate), 29, "Expected true.");

                //Really Old Non Leap Year
                var initDate = new Date(100, 1, 1);
                Assert.areSame(Y.DataType.Date.daysInMonth(initDate), 28, "Expected true.");

            },
            'test: listOfDatesInMonth': function() {
                var initDate = new Date(1982, 10, 1);
                Assert.areSame(Y.DataType.Date.listOfDatesInMonth(initDate).length, 30, "Expected true.");

                Assert.areSame(Y.DataType.Date.listOfDatesInMonth({}).length, 0, "Expected true.");
            }
        }));

        suite.add(new Y.Test.Case({
            name: "Comparitor Tests",
            'test: areEqual': function() {
                var d1 = d2 = new Date();
                Assert.isTrue(Y.DataType.Date.areEqual(d1, d2));
            },
            'test: isGreater': function() {
                var d1 = new Date('10/10/10 10:10:10'),
                    d2 = new Date();
                Assert.isTrue(Y.DataType.Date.isGreater(d2, d1));
            },
            'test: isGreaterOrEqual': function() {
                var d1 = new Date('10/10/10 10:10:10'),
                    d2 = d3 = new Date();
                Assert.isTrue(Y.DataType.Date.isGreaterOrEqual(d2, d1));
                Assert.isTrue(Y.DataType.Date.isGreaterOrEqual(d2, d3));
            },
            'test: isInRange': function() {
                var d1 = new Date('10/10/10 10:10:10'),
                    d2 = new Date('09/09/109 09:09:09'),
                    d3 = new Date('11/11/11 11:11:11');

                Assert.isTrue(Y.DataType.Date.isInRange(d1, d2, d3));
            }
        }));

        
        Y.Test.Runner.add(suite);
});
