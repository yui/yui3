YUI.add('calendar-multipane-tests', function(Y) {

    var suite = new Y.Test.Suite('calendar-multipane example test suite'),
        Assert = Y.Assert;
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                calendar = '#mycalendar ',
                calendarLabel = Y.one(calendar + '.yui3-calendar-header-label'),
                prevMonthButton = Y.one(calendar + '.yui3-calendarnav-prevmonth'),
                nextMonthButton = Y.one(calendar + '.yui3-calendarnav-nextmonth');
    suite.add(new Y.Test.Case({

        name: 'Calendar Multipane Example tests',

        'test calendar rules': function() {
            var calendarDate = new Date(2011, 6, 1, 12, 00),
                allCalendarCells = Y.all(".yui3-calendar-day:not(.yui3-calendar-column-hidden)"),
                firstDay = allCalendarCells.item(0),
                secondDay = allCalendarCells.item(1);

                Assert.isTrue(firstDay.hasClass("yui3-calendar-selection-disabled"), " - The first day of July should be disabled.");
                Assert.isTrue(secondDay.hasClass("redtext"), "- The second day of July should have CSS class redtext");
         },

        'test calendar selection': function() {
            var calendarDate = new Date(2011, 6, 1, 12, 00),
                allCalendarCells = Y.all(".yui3-calendar-day:not(.yui3-calendar-column-hidden)"),
                firstDay = allCalendarCells.item(0),
                secondDay = allCalendarCells.item(1),
                thirdDay = allCalendarCells.item(2);

                firstDay.simulate("click");
                Assert.isFalse(firstDay.hasClass("yui3-calendar-day-selected"), " - The first day of July should not be selectable.");

                secondDay.simulate("click");
                Assert.isTrue(secondDay.hasClass("yui3-calendar-day-selected"), " - The second day of July should be selectable.");

                thirdDay.simulate("click");
                Assert.isTrue(thirdDay.hasClass("yui3-calendar-day-selected"), " - The third day of July should be selected.");
                Assert.isFalse(secondDay.hasClass("yui3-calendar-day-selected"), " - The second day of July should be deselected.");
         },
         
        'test calendar navigation': function() {
            var todaysDate = new Date(),
                normalizedDate = new Date(todaysDate.getFullYear(), todaysDate.getMonth(), 1, 12, 00);

            Assert.areEqual(calendarLabel.get("text"), "July 2011 — August 2011", " - The calendar header label is incorrect");

            prevMonthButton.simulate('click');

            Assert.areEqual(calendarLabel.get("text"), "June 2011 — July 2011", " - The calendar header label for the previous month is incorrect");

            nextMonthButton.simulate('click');
            nextMonthButton.simulate('click');

            Assert.areEqual(calendarLabel.get("text"), "August 2011 — September 2011", " - The calendar header label for the next month is incorrect");
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate', 'selector-css3', 'datatype-date-format' ] });
