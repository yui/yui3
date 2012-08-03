YUI.add('calendar-simple-tests', function(Y) {

    var suite = new Y.Test.Suite('calendar-simple example test suite'),
        Assert = Y.Assert;
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                calendar = '#mycalendar ',
                calendarLabel = Y.one(calendar + '.yui3-calendar-header-label'),
                prevMonthButton = Y.one(calendar + '.yui3-calendarnav-prevmonth'),
                nextMonthButton = Y.one(calendar + '.yui3-calendarnav-nextmonth'),
                togglePrevMonth = Y.one("#togglePrevMonth"),
                toggleNextMonth = Y.one("#toggleNextMonth");

    suite.add(new Y.Test.Case({

        name: 'Calendar Simple Example tests',

        'test date click': function() {
            var todaysDate = new Date(),
                normalizedDate = new Date(todaysDate.getFullYear(), todaysDate.getMonth(), 1, 12, 00),
                currentDateString = Y.DataType.Date.format(normalizedDate),
                firstDate = Y.one(".yui3-calendar-day");

                firstDate.simulate("click");

                Assert.areEqual(Y.one("#selecteddate").get("text"), currentDateString, " - The currently selected date string is not correct.");
         },

        'test calendar navigation': function() {
            var todaysDate = new Date(),
                normalizedDate = new Date(todaysDate.getFullYear(), todaysDate.getMonth(), 1, 12, 00),
                currentDateString = months[normalizedDate.getMonth()] + " " + normalizedDate.getFullYear();

            Assert.areEqual(calendarLabel.get("text"), currentDateString, " - The calendar header label is incorrect");

            prevMonthButton.simulate('click');
            normalizedDate.setMonth(normalizedDate.getMonth() - 1);
            currentDateString = months[normalizedDate.getMonth()] + " " + normalizedDate.getFullYear();

            Assert.areEqual(calendarLabel.get("text"), currentDateString, " - The calendar header label for the previous month is incorrect");

            nextMonthButton.simulate('click');
            normalizedDate.setMonth(normalizedDate.getMonth() + 1);
            currentDateString = months[normalizedDate.getMonth()] + " " + normalizedDate.getFullYear();

            Assert.areEqual(calendarLabel.get("text"), currentDateString, " - The calendar header label for the next month is incorrect");
        },

        'test previous month trigger': function() {
            while(!Y.one(".yui3-calendar-prevmonth-day:not(.yui3-calendar-column-hidden)")) {
                nextMonthButton.simulate('click');
            }
            
            var firstPrevMonthDate = Y.one(".yui3-calendar-prevmonth-day:not(.yui3-calendar-column-hidden)");
            Assert.isNotNull(firstPrevMonthDate);

            Assert.areNotEqual(Y.Lang.trim(firstPrevMonthDate.get("text")), "", " - previous month cells should have content");
            togglePrevMonth.simulate('click');

            Assert.areEqual(Y.Lang.trim(firstPrevMonthDate.get("text")), "", " - previous month cells should be empty");
         },

        'test next month trigger': function() {
            while(!Y.one(".yui3-calendar-nextmonth-day:not(.yui3-calendar-column-hidden)")) {
                nextMonthButton.simulate('click');
            }
            
            var firstNextMonthDate = Y.one(".yui3-calendar-nextmonth-day:not(.yui3-calendar-column-hidden)");
            Assert.isNotNull(firstNextMonthDate);

            Assert.areNotEqual(Y.Lang.trim(firstNextMonthDate.get("text")), "", " - next month cells should have content");
            toggleNextMonth.simulate('click');

            Assert.areEqual(Y.Lang.trim(firstNextMonthDate.get("text")), "", " - next month cells should be empty");
         }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate', 'selector-css3', 'datatype-date-format' ] });
