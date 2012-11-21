YUI.add('calendar-tests', function(Y) {

        // Set up the page
        var ASSERT = Y.Assert,
            ARRAYASSERT = Y.ArrayAssert;

        var BasicCalendar = new Y.Test.Case({
            name: "Basic Calendar Tests",

            setUp : function () {
                var firstcontainer = "<div id='firstcontainer'></div>";
                var secondcontainer = "<div id='secondcontainer'></div>";
                Y.one('#container').appendChild(Y.Node.create(firstcontainer));
                Y.one('#container').appendChild(Y.Node.create(secondcontainer));
                this.firstcalendar = null;
                this.secondcalendar = null;

            },

            tearDown : function () {
                delete this.firstcalendar;
                delete this.secondcalendar;
                Y.one('#firstcontainer').remove();
                Y.one('#secondcontainer').remove();
                Y.CalendarBase.CONTENT_TEMPLATE = Y.CalendarBase.ONE_PANE_TEMPLATE;
            },

            testCalendarBase : function() {
                var cfg = {
                    contentBox: "#firstcontainer",
                    date: new Date(2011,11,5)
                };

                this.firstcalendar = new Y.CalendarBase(cfg);
                this.firstcalendar.render();

                //calendar is visible
                Y.Assert.areEqual(this.firstcalendar.get('visible'), true);

                //calendar date is normalized correctly
                var calendarDate = this.firstcalendar.get("date");
                Y.Assert.areEqual(2011, calendarDate.getFullYear());
                Y.Assert.areEqual(11, calendarDate.getMonth());
                Y.Assert.areEqual(1, calendarDate.getDate());

                // Test that the first and last days of the month render correctly

                // Test that showPreviousMonth and showNextMonth are false by default
                Y.Assert.areEqual(false, this.firstcalendar.get("showPrevMonth"));
                Y.Assert.areEqual(false, this.firstcalendar.get("showNextMonth"));
            },

            testBasicCalendar : function() {
                var cfg = {
                    contentBox: "#firstcontainer",
                    date: new Date(2011,11,5)
                };

                this.firstcalendar = new Y.Calendar(cfg);
                this.firstcalendar.render();

                //calendar is visible
                Y.Assert.areEqual(this.firstcalendar.get('visible'), true);

                //calendar date is normalized correctly
                var calendarDate = this.firstcalendar.get("date");
                Y.Assert.areEqual(2011, calendarDate.getFullYear());
                Y.Assert.areEqual(11, calendarDate.getMonth());
                Y.Assert.areEqual(1, calendarDate.getDate());

                // Test that the first and last days of the month render correctly

                // Test that showPreviousMonth and showNextMonth are false by default
                Y.Assert.areEqual(false, this.firstcalendar.get("showPrevMonth"));
                Y.Assert.areEqual(false, this.firstcalendar.get("showNextMonth"));
            },

            testAddMonths : function() {
                var cfg = {
                    contentBox: "#firstcontainer",
                    date: new Date(2011,11,5)
                };

                this.firstcalendar = new Y.Calendar(cfg);
                this.firstcalendar.render();

                //calendar is visible
                Y.Assert.areEqual(this.firstcalendar.get('visible'), true);

                //calendar date is normalized correctly
                var calendarDate = this.firstcalendar.get("date");
                Y.Assert.areEqual(2011, calendarDate.getFullYear());
                Y.Assert.areEqual(11, calendarDate.getMonth());
                Y.Assert.areEqual(1, calendarDate.getDate());

                Y.Assert.isInstanceOf(Y.Calendar, this.firstcalendar.subtractMonth());   // check @chainable
                this.firstcalendar.subtractMonth();

                calendarDate = this.firstcalendar.get("date");
                Y.Assert.areEqual(2011, calendarDate.getFullYear());
                Y.Assert.areEqual(9, calendarDate.getMonth());
                Y.Assert.areEqual(1, calendarDate.getDate());

                Y.Assert.isInstanceOf(Y.Calendar, this.firstcalendar.addMonth());        // check @chainable

                calendarDate = this.firstcalendar.get("date");
                Y.Assert.areEqual(2011, calendarDate.getFullYear());
                Y.Assert.areEqual(10, calendarDate.getMonth());
                Y.Assert.areEqual(1, calendarDate.getDate());

                Y.Assert.isInstanceOf(Y.Calendar, this.firstcalendar.addYear());         // check @chainable

                calendarDate = this.firstcalendar.get("date");
                Y.Assert.areEqual(2012, calendarDate.getFullYear());
                Y.Assert.areEqual(10, calendarDate.getMonth());
                Y.Assert.areEqual(1, calendarDate.getDate());

                Y.Assert.isInstanceOf(Y.Calendar, this.firstcalendar.subtractYear());    // check @chainable
                this.firstcalendar.subtractYear();

                calendarDate = this.firstcalendar.get("date");
                Y.Assert.areEqual(2010, calendarDate.getFullYear());
                Y.Assert.areEqual(10, calendarDate.getMonth());
                Y.Assert.areEqual(1, calendarDate.getDate());
            },

            testMaxMinDates : function() {
                var cfg = {
                    contentBox: "#firstcontainer",
                    date: new Date(2011,5,1),
                    minimumDate: new Date (2011,6,1),
                    maximumDate: new Date (2011,7,1)
                };

                this.firstcalendar = new Y.Calendar(cfg);
                this.firstcalendar.render();

                //calendar is visible
                Y.Assert.areEqual(this.firstcalendar.get('visible'), true);

                //calendar date is reset correclty when minimum date is set
                var calendarDate = this.firstcalendar.get("date");
                Y.Assert.areEqual(2011, calendarDate.getFullYear());
                Y.Assert.areEqual(6, calendarDate.getMonth());
                Y.Assert.areEqual(1, calendarDate.getDate());

                this.firstcalendar.set("minimumDate", new Date (2011,2,1));
                this.firstcalendar.set("maximumDate", new Date (2011,5,1));

                calendarDate = this.firstcalendar.get("date");
                Y.Assert.areEqual(2011, calendarDate.getFullYear());
                Y.Assert.areEqual(5, calendarDate.getMonth());
                Y.Assert.areEqual(1, calendarDate.getDate());

                this.firstcalendar.set("maximumDate", new Date (2011,8,1));
                this.firstcalendar.set("minimumDate", new Date (2011,7,1));

                calendarDate = this.firstcalendar.get("date");
                Y.Assert.areEqual(2011, calendarDate.getFullYear());
                Y.Assert.areEqual(7, calendarDate.getMonth());
                Y.Assert.areEqual(1, calendarDate.getDate());

                this.firstcalendar.set("date", new Date (2011, 9, 1));
                calendarDate = this.firstcalendar.get("date");
                Y.Assert.areEqual(2011, calendarDate.getFullYear());
                Y.Assert.areEqual(8, calendarDate.getMonth());
                Y.Assert.areEqual(1, calendarDate.getDate());

                this.firstcalendar.set("date", new Date (2011, 6, 1));
                calendarDate = this.firstcalendar.get("date");
                Y.Assert.areEqual(2011, calendarDate.getFullYear());
                Y.Assert.areEqual(7, calendarDate.getMonth());
                Y.Assert.areEqual(1, calendarDate.getDate());
            },

            testSelection : function() {
                var cfg = {
                    contentBox: "#firstcontainer",
                    date: new Date(2011,11,5)
                };

                this.firstcalendar = new Y.Calendar(cfg);
                Y.Assert.isInstanceOf(Y.Calendar, this.firstcalendar.selectDates(new Date(2011,11,7)));    // check @chainable
                this.firstcalendar.selectDates(new Date(2011,11,8));
                Y.Assert.isInstanceOf(Y.Calendar, this.firstcalendar.deselectDates(new Date(2011,11,8)));  // check @chainable
                this.firstcalendar.selectDates([new Date(2011,9,10), new Date(2011,11,13)]);
                this.firstcalendar.render();

                //calendar is visible
                Y.Assert.areEqual(this.firstcalendar.get('visible'), true);

                //calendar date is normalized correctly
                var calendarDate = this.firstcalendar.get("date");
                Y.Assert.areEqual(2011, calendarDate.getFullYear());
                Y.Assert.areEqual(11, calendarDate.getMonth());
                Y.Assert.areEqual(1, calendarDate.getDate());

                //Selected dates are highlighted correctly
                var calendarId = "#" + this.firstcalendar._calendarId;
                var firstSelectedDate = Y.one(calendarId + "_pane_0_4_13");
                var secondSelectedDate = Y.one(calendarId + "_pane_0_5_7");
                var unselectedDate = Y.one(calendarId + "_pane_0_6_8");
                Y.Assert.isTrue(firstSelectedDate.hasClass("yui3-calendar-day-selected"));
                Y.Assert.isTrue(secondSelectedDate.hasClass("yui3-calendar-day-selected"));
                Y.Assert.isFalse(unselectedDate.hasClass("yui3-calendar-day-selected"));

                Y.one(".yui3-calendarnav-prevmonth").simulate("click");
                Y.one(".yui3-calendarnav-prevmonth").simulate("click");

                var thirdSelectedDate = Y.one(calendarId + "_pane_0_1_10");
                Y.Assert.isTrue(thirdSelectedDate.hasClass("yui3-calendar-day-selected"));
                Y.Assert.isFalse(firstSelectedDate.hasClass("yui3-calendar-day-selected"));
                Y.Assert.isFalse(secondSelectedDate.hasClass("yui3-calendar-day-selected"));

                Y.one(".yui3-calendarnav-nextmonth").simulate("click");
                Y.one(".yui3-calendarnav-nextmonth").simulate("click");
                Y.Assert.isTrue(firstSelectedDate.hasClass("yui3-calendar-day-selected"));
                Y.Assert.isTrue(secondSelectedDate.hasClass("yui3-calendar-day-selected"));

                // Deselect dates


                this.firstcalendar.deselectDates([new Date(2011,11,7), new Date(2011,9,10)]);

                this.firstcalendar.deselectDates(new Date(2011,11,13));

                Y.Assert.isFalse(firstSelectedDate.hasClass("yui3-calendar-day-selected"));
                Y.Assert.isFalse(secondSelectedDate.hasClass("yui3-calendar-day-selected"));

                this.firstcalendar.deselectDates();

                this.firstcalendar._addDateRangeToSelection(new Date(2011,11,7), new Date(2011,11,18));
                Y.Assert.isTrue(this.firstcalendar._dateToNode(new Date(2011,11,8)).hasClass("yui3-calendar-day-selected"));
                this.firstcalendar._removeDateRangeFromSelection(new Date(2011,11,7), new Date(2011,11,18));
                Y.Assert.isFalse(this.firstcalendar._dateToNode(new Date(2011,11,8)).hasClass("yui3-calendar-day-selected"));

                // Testing the crossing of the daylight savings time
                this.firstcalendar.set("date", new Date(2011,2,1));
                this.firstcalendar._addDateRangeToSelection(new Date(2011,2,10), new Date(2011,2,15));
                Y.Assert.isTrue(this.firstcalendar._dateToNode(new Date(2011,2,10)).hasClass("yui3-calendar-day-selected"));
                Y.Assert.isTrue(this.firstcalendar._dateToNode(new Date(2011,2,11)).hasClass("yui3-calendar-day-selected"));
                Y.Assert.isTrue(this.firstcalendar._dateToNode(new Date(2011,2,12)).hasClass("yui3-calendar-day-selected"));
                Y.Assert.isTrue(this.firstcalendar._dateToNode(new Date(2011,2,13)).hasClass("yui3-calendar-day-selected"));
                Y.Assert.isTrue(this.firstcalendar._dateToNode(new Date(2011,2,14)).hasClass("yui3-calendar-day-selected"));
                Y.Assert.isTrue(this.firstcalendar._dateToNode(new Date(2011,2,15)).hasClass("yui3-calendar-day-selected"));
                this.firstcalendar._removeDateRangeFromSelection(new Date(2011,2,10), new Date(2011,2,15));

            },

            testRules : function () {
                var myRules = {
                   "2011": "fullyear",
                   "2010-2011": {
                       "9-11": {
                           "all": {
                               "0,6": "theweekends"
                           },
                           "10-15": "tenthtofifteenth"
                       },
                       "11": "december",
                       "10-11": {
                           "5": "thefifths"
                       }
                   }
                };

               function myFilter (oDate, oNode, rules) {
                   if (Y.Array.indexOf(rules, "theweekends") >= 0) {
                       oNode.addClass('testclass');
                   }
               };

               var cfg = {
                    contentBox: "#firstcontainer",
                    date: new Date(2011,11,5),
                    customRenderer: {rules: myRules, filterFunction: myFilter},
                    disabledDatesRule: "tenthtofifteenth"
                };

                this.firstcalendar = new Y.Calendar(cfg);
                this.firstcalendar.selectDates(new Date(2011,11,10));
                this.firstcalendar.render();


               var cfg2 = {
                    contentBox: "#secondcontainer",
                    date: new Date(2011,11,5),
                    customRenderer: {rules: myRules, filterFunction: myFilter},
                    enabledDatesRule: "tenthtofifteenth"
                };

                this.secondcalendar = new Y.Calendar(cfg2);
                this.secondcalendar.selectDates(new Date(2011,11,10));
                this.secondcalendar.render();


                this.firstcalendar.set("date", new Date(2011,8,1));
                this.secondcalendar.set("date", new Date(2012,0,1));

                this.secondcalendar.set("customRenderer", {rules: myRules, filterFunction: myFilter});


            },

            testPrevAndNextMonth : function () {
                var cfg = {
                    contentBox: "#firstcontainer",
                    date: new Date(2011,11,5),
                    showPrevMonth: true,
                    showNextMonth: true
                };

                this.firstcalendar = new Y.Calendar(cfg);
                this.firstcalendar.render();

                // Test that showPreviousMonth and showNextMonth are true
                Y.Assert.areEqual(true, this.firstcalendar.get("showPrevMonth"));
                Y.Assert.areEqual(true, this.firstcalendar.get("showNextMonth"));

                // Test that previous and next months are showing
                Y.Assert.areEqual("27", Y.one("#firstcontainer").one(".calendar_col2.yui3-calendar-prevmonth-day").getContent());
                Y.Assert.areEqual("28", Y.one("#firstcontainer").one(".calendar_col3.yui3-calendar-prevmonth-day").getContent());
                Y.Assert.areEqual("29", Y.one("#firstcontainer").one(".calendar_col4.yui3-calendar-prevmonth-day").getContent());
                Y.Assert.areEqual("30", Y.one("#firstcontainer").one(".calendar_col5.yui3-calendar-prevmonth-day").getContent());

                Y.Assert.areEqual("1", Y.one("#firstcontainer").one(".calendar_col2.yui3-calendar-nextmonth-day").getContent());
                Y.Assert.areEqual("2", Y.one("#firstcontainer").one(".calendar_col3.yui3-calendar-nextmonth-day").getContent());
                Y.Assert.areEqual("3", Y.one("#firstcontainer").one(".calendar_col4.yui3-calendar-nextmonth-day").getContent());
                Y.Assert.areEqual("4", Y.one("#firstcontainer").one(".calendar_col5.yui3-calendar-nextmonth-day").getContent());
                Y.Assert.areEqual("5", Y.one("#firstcontainer").one(".calendar_col6.yui3-calendar-nextmonth-day").getContent());
                Y.Assert.areEqual("6", Y.one("#firstcontainer").one(".calendar_col7.yui3-calendar-nextmonth-day").getContent());
                Y.Assert.areEqual("7", Y.one("#firstcontainer").one(".calendar_col8.yui3-calendar-nextmonth-day").getContent());


                Y.one(".calendar_col2.yui3-calendar-prevmonth-day").simulate("click");
                Y.one(".calendar_col2.yui3-calendar-nextmonth-day").simulate("click");
            },

            testTwoCalendars : function () {
                var cfg1 = {
                    contentBox: "#firstcontainer",
                    date: new Date(2011,11,5),
                    showPrevMonth: true,
                    showNextMonth: true
                };

                var cfg2 = {
                    contentBox: "#secondcontainer",
                    date: new Date(2011,11,5),
                    showPrevMonth: true,
                    showNextMonth: true
                };

                this.firstcalendar = new Y.Calendar(cfg1);
                this.firstcalendar.render();

                this.secondcalendar = new Y.Calendar(cfg2);
                this.secondcalendar.render();

                this.firstcalendar.set("showPrevMonth", false);
                this.firstcalendar.set("showNextMonth", false);

                this.firstcalendar.set("showPrevMonth", true);
                this.firstcalendar.set("showNextMonth", true);

                Y.Assert.areNotEqual(this.firstcalendar.get("id"), this.secondcalendar.get("id"));
                Y.Assert.areNotEqual(this.firstcalendar._calendarId, this.secondcalendar._calendarId);
            },

            testCalendarClick : function() {
                var cfg = {
                    contentBox: "#firstcontainer",
                    date: new Date(2011,11,5)
                };

                this.firstcalendar = new Y.Calendar(cfg);
                this.firstcalendar.render();

                // Click on a specific calendar cell;
                var calendarid = this.firstcalendar._calendarId;
                Y.one("#" + calendarid + "_pane_0_6_15").simulate("click");

                var currentDate = this.firstcalendar.get("selectedDates")[0];
                Y.Assert.areEqual(currentDate.getFullYear(), 2011);
                Y.Assert.areEqual(currentDate.getMonth(), 11);
                Y.Assert.areEqual(currentDate.getDate(), 15);

                // Click on a different calendar cell

                Y.one("#" + calendarid + "_pane_0_8_31").simulate("click");

                currentDate = this.firstcalendar.get("selectedDates")[0];
                Y.Assert.areEqual(currentDate.getFullYear(), 2011);
                Y.Assert.areEqual(currentDate.getMonth(), 11);
                Y.Assert.areEqual(currentDate.getDate(), 31);

                // Click to advance the month
                Y.one(".yui3-calendarnav-nextmonth").simulate("click");
                // Click on a date in the new month
                Y.one("#" + calendarid + "_pane_0_8_17").simulate("click");

                currentDate = this.firstcalendar.get("selectedDates")[0];
                Y.Assert.areEqual(currentDate.getFullYear(), 2012);
                Y.Assert.areEqual(currentDate.getMonth(), 0);
                Y.Assert.areEqual(currentDate.getDate(), 17);

            },

            testFebruaries : function() {
                var cfg = {
                    contentBox: "#firstcontainer",
                    date: new Date(1990,1,1)
                };

                this.firstcalendar = new Y.Calendar(cfg);

                this.firstcalendar.render();

                this.firstcalendar.set("date", new Date(1991, 1, 1));
                this.firstcalendar.set("showPrevMonth", false);
                this.firstcalendar.set("showNextMonth", false);
                this.firstcalendar.set("showPrevMonth", true);
                this.firstcalendar.set("showNextMonth", true);
                this.firstcalendar.set("date", new Date(1992, 1, 7));
                this.firstcalendar.set("showPrevMonth", false);
                this.firstcalendar.set("showNextMonth", false);
                this.firstcalendar.set("showPrevMonth", true);
                this.firstcalendar.set("showNextMonth", true);
                this.firstcalendar.set("date", new Date(1993, 1, 9));
                this.firstcalendar.set("showPrevMonth", false);
                this.firstcalendar.set("showNextMonth", false);
                this.firstcalendar.set("showPrevMonth", true);
                this.firstcalendar.set("showNextMonth", true);
                this.firstcalendar.set("date", new Date(1994, 1, 3));
                this.firstcalendar.set("showPrevMonth", false);
                this.firstcalendar.set("showNextMonth", false);
                this.firstcalendar.set("showPrevMonth", true);
                this.firstcalendar.set("showNextMonth", true);
                this.firstcalendar.set("date", new Date(1995, 1, 6));
                this.firstcalendar.set("showPrevMonth", false);
                this.firstcalendar.set("showNextMonth", false);
                this.firstcalendar.set("showPrevMonth", true);
                this.firstcalendar.set("showNextMonth", true);
                this.firstcalendar.set("date", new Date(1996, 1, 20));
                this.firstcalendar.set("showPrevMonth", false);
                this.firstcalendar.set("showNextMonth", false);
                this.firstcalendar.set("showPrevMonth", true);
                this.firstcalendar.set("showNextMonth", true);
                this.firstcalendar.set("date", new Date(1997, 1, 13));
                this.firstcalendar.set("showPrevMonth", false);
                this.firstcalendar.set("showNextMonth", false);
                this.firstcalendar.set("showPrevMonth", true);
                this.firstcalendar.set("showNextMonth", true);
                this.firstcalendar.set("date", new Date(1998, 1, 12));
                this.firstcalendar.set("showPrevMonth", false);
                this.firstcalendar.set("showNextMonth", false);
                this.firstcalendar.set("showPrevMonth", true);
                this.firstcalendar.set("showNextMonth", true);
                this.firstcalendar.set("date", new Date(1999, 1, 18));
                this.firstcalendar.set("showPrevMonth", false);
                this.firstcalendar.set("showNextMonth", false);
                this.firstcalendar.set("showPrevMonth", true);
                this.firstcalendar.set("showNextMonth", true);
                this.firstcalendar.set("date", new Date(2000, 1, 16));
                this.firstcalendar.set("showPrevMonth", false);
                this.firstcalendar.set("showNextMonth", false);
                this.firstcalendar.set("showPrevMonth", true);
                this.firstcalendar.set("showNextMonth", true);
                this.firstcalendar.set("date", new Date(2001, 1, 5));
                this.firstcalendar.set("showPrevMonth", false);
                this.firstcalendar.set("showNextMonth", false);
                this.firstcalendar.set("showPrevMonth", true);
                this.firstcalendar.set("showNextMonth", true);
                this.firstcalendar.set("date", new Date(2002, 1, 2));
                this.firstcalendar.set("showPrevMonth", false);
                this.firstcalendar.set("showNextMonth", false);
                this.firstcalendar.set("showPrevMonth", true);
                this.firstcalendar.set("showNextMonth", true);
                this.firstcalendar.set("date", new Date(2003, 1, 14));
                this.firstcalendar.set("showPrevMonth", false);
                this.firstcalendar.set("showNextMonth", false);
                this.firstcalendar.set("showPrevMonth", true);
                this.firstcalendar.set("showNextMonth", true);
                this.firstcalendar.set("date", new Date(2004, 1, 23));
                this.firstcalendar.set("showPrevMonth", false);
                this.firstcalendar.set("showNextMonth", false);
                this.firstcalendar.set("showPrevMonth", true);
                this.firstcalendar.set("showNextMonth", true);
                this.firstcalendar.set("date", new Date(2005, 1, 25));
                this.firstcalendar.set("showPrevMonth", false);
                this.firstcalendar.set("showNextMonth", false);
                this.firstcalendar.set("showPrevMonth", true);
                this.firstcalendar.set("showNextMonth", true);
            },

            testFocus : function () {
                window.focus();

                var cfg = {
                    contentBox: "#firstcontainer",
                    date: new Date(2011,6,1)
                };

                this.firstcalendar = new Y.Calendar(cfg);
                this.firstcalendar.render();

                var test = this;

                var calgrid = this.firstcalendar.get("contentBox").one(".yui3-calendar-grid");

                calgrid.on("focus", function () {
                    test.resume(function () {
                       calgrid.simulate("keydown", { charCode: 40, keyCode: 40});
                       calgrid.simulate("keydown", { charCode: 40, keyCode: 40 });
                       calgrid.simulate("keydown", { charCode: 37, keyCode: 37 });
                       calgrid.simulate("keydown", { charCode: 38, keyCode: 38 });
                       calgrid.simulate("keydown", { charCode: 39, keyCode: 39 });
                       calgrid.simulate("keydown", { charCode: 32, keyCode: 32 });
                       calgrid.simulate("keydown", { charCode: 32, keyCode: 32 });
                       calgrid.simulate("keydown", { charCode: 40, keyCode: 40 });
                       calgrid.simulate("keydown", { charCode: 32, keyCode: 32 });
                   });
                });

                Y.later(10, this, function () {
                    calgrid.focus();
                });

                test.wait();
           },

            testSelectionModes : function () {
                var cfg = {
                    contentBox: "#firstcontainer",
                    date: new Date(2011,11,1),
                    selectionMode: "multiple-sticky"
                };

                var cfg2 = {
                    contentBox: "#secondcontainer",
                    date: new Date(2011,11,1),
                    selectionMode: "multiple"
                }

                this.firstcalendar = new Y.Calendar(cfg);
                this.firstcalendar.render();

                this.secondcalendar = new Y.Calendar(cfg2);
                this.secondcalendar.render();

                var calgrid = this.firstcalendar.get("contentBox").one(".yui3-calendar-grid");
                var calendarid = this.firstcalendar._calendarId;

                var cell1 = calgrid.one("#" + calendarid + "_pane_0_3_5");
                var cell2 = calgrid.one("#" + calendarid + "_pane_0_5_21");

                cell1.simulate("click");
                cell2.simulate("click");
                cell1.simulate("click");

                this.firstcalendar.set("selectionMode", "multiple");

                this.firstcalendar._clickCalendar ({
                   target: cell1,
                   currentTarget: cell1,
                   metaKey: true,
                   ctrlKey: true,
                   shiftKey: false
                });

                this.firstcalendar._clickCalendar ({
                   target: cell2,
                   currentTarget: cell2,
                   metaKey: true,
                   ctrlKey: true,
                   shiftKey: false
                });

                this.firstcalendar._clickCalendar ({
                   target: cell1,
                   currentTarget: cell1,
                   metaKey: true,
                   ctrlKey: true,
                   shiftKey: true
                });

                this.firstcalendar._clickCalendar ({
                   target: cell2,
                   currentTarget: cell2,
                   metaKey: false,
                   ctrlKey: false,
                   shiftKey: true
                });

                this.firstcalendar._clickCalendar ({
                   target: cell2,
                   currentTarget: cell2,
                   metaKey: false,
                   ctrlKey: false,
                   shiftKey: false
                });

                this.firstcalendar._clickCalendar ({
                   target: cell2,
                   currentTarget: cell2,
                   metaKey: false,
                   ctrlKey: false,
                   shiftKey: false
                });

                this.firstcalendar._clickCalendar ({
                   target: cell1,
                   currentTarget: cell1,
                   metaKey: true,
                   ctrlKey: true,
                   shiftKey: true
                });

                this.firstcalendar._clickCalendar ({
                   target: cell2,
                   currentTarget: cell2,
                   metaKey: false,
                   ctrlKey: false,
                   shiftKey: false
                });


                var calgrid2 = this.secondcalendar.get("contentBox").one(".yui3-calendar-grid");
                var calendarid2 = this.secondcalendar._calendarId;

                var cell3 = calgrid2.one("#" + calendarid2 + "_pane_0_3_5");

                this.secondcalendar._clickCalendar ({
                   target: cell3,
                   currentTarget: cell3,
                   metaKey: false,
                   ctrlKey: false,
                   shiftKey: true
                });

                var e = new Y.DOMEventFacade({type:'selectstart', preventDefault: function () {}});

                this.secondcalendar._preventSelectionStart(e);

                var test = this;

                calgrid.on("focus", function () {
                    test.resume(function () {
                        calgrid.simulate("keydown", { charCode: 40, keyCode: 40 });
                        calgrid.simulate("keydown", { charCode: 40, keyCode: 40 });
                        calgrid.simulate("keydown", { charCode: 32, keyCode: 32 });
                        calgrid.simulate("keydown", { charCode: 32, keyCode: 32 });
                    });
                });

                Y.later(10, this, function () {
                    calgrid.focus();
                });

                test.wait();
           },

            testCalendarNavigation : function() {
                var cfg = {
                    contentBox: "#firstcontainer",
                    date: new Date(2011,11,5)
                };

                this.firstcalendar = new Y.Calendar(cfg);

                this.firstcalendar.render();

                Y.one(".yui3-calendarnav-nextmonth").simulate("click");
                var calendarDate = this.firstcalendar.get("date");
                Y.Assert.areEqual(2012, calendarDate.getFullYear());
                Y.Assert.areEqual(0, calendarDate.getMonth());
                Y.Assert.areEqual(1, calendarDate.getDate());
                Y.one(".yui3-calendarnav-nextmonth").simulate("click");
                calendarDate = this.firstcalendar.get("date");
                Y.Assert.areEqual(2012, calendarDate.getFullYear());
                Y.Assert.areEqual(1, calendarDate.getMonth());
                Y.Assert.areEqual(1, calendarDate.getDate());
                Y.one(".yui3-calendarnav-nextmonth").simulate("click");
                calendarDate = this.firstcalendar.get("date");
                Y.Assert.areEqual(2012, calendarDate.getFullYear());
                Y.Assert.areEqual(2, calendarDate.getMonth());
                Y.Assert.areEqual(1, calendarDate.getDate());
                Y.one(".yui3-calendarnav-nextmonth").simulate("click");
                calendarDate = this.firstcalendar.get("date");
                Y.Assert.areEqual(2012, calendarDate.getFullYear());
                Y.Assert.areEqual(3, calendarDate.getMonth());
                Y.Assert.areEqual(1, calendarDate.getDate());
                Y.one(".yui3-calendarnav-nextmonth").simulate("click");
                calendarDate = this.firstcalendar.get("date");
                Y.Assert.areEqual(2012, calendarDate.getFullYear());
                Y.Assert.areEqual(4, calendarDate.getMonth());
                Y.Assert.areEqual(1, calendarDate.getDate());

                this.firstcalendar.set("date", new Date(2011, 3, 1));
                Y.one(".yui3-calendarnav-prevmonth").simulate("click");
                calendarDate = this.firstcalendar.get("date");
                Y.Assert.areEqual(2011, calendarDate.getFullYear());
                Y.Assert.areEqual(2, calendarDate.getMonth());
                Y.Assert.areEqual(1, calendarDate.getDate());
                Y.one(".yui3-calendarnav-prevmonth").simulate("click");
                calendarDate = this.firstcalendar.get("date");
                Y.Assert.areEqual(2011, calendarDate.getFullYear());
                Y.Assert.areEqual(1, calendarDate.getMonth());
                Y.Assert.areEqual(1, calendarDate.getDate());
                Y.one(".yui3-calendarnav-prevmonth").simulate("click");
                calendarDate = this.firstcalendar.get("date");
                Y.Assert.areEqual(2011, calendarDate.getFullYear());
                Y.Assert.areEqual(0, calendarDate.getMonth());
                Y.Assert.areEqual(1, calendarDate.getDate());
                Y.one(".yui3-calendarnav-prevmonth").simulate("click");
                calendarDate = this.firstcalendar.get("date");
                Y.Assert.areEqual(2010, calendarDate.getFullYear());
                Y.Assert.areEqual(11, calendarDate.getMonth());
                Y.Assert.areEqual(1, calendarDate.getDate());
            },

            testCustomHeader : function() {
                var cfg = {
                    contentBox: "#firstcontainer",
                    date: new Date(2011,11,5)
                };

                this.firstcalendar = new Y.Calendar(cfg);

                this.firstcalendar.set("headerRenderer", function (curDate) {
                   var ydate = Y.DataType.Date,
                       output = ydate.format(curDate, {
                       format: "%m %Y"
                       });
                   return output;
                 });

                this.firstcalendar.render();

                var currentHeaderString = this.firstcalendar.get("contentBox").one(".yui3-calendar-header-label").get("text");
                Y.Assert.areEqual("12 2011", currentHeaderString);

                // Click to advance the month
                Y.one(".yui3-calendarnav-nextmonth").simulate("click");

                currentHeaderString = this.firstcalendar.get("contentBox").one(".yui3-calendar-header-label").get("text");
                Y.Assert.areEqual("01 2012", currentHeaderString);

                this.firstcalendar.set("headerRenderer", function (curDate) {
                   var ydate = Y.DataType.Date,
                       output = ydate.format(curDate, {
                       format: "%m"
                       });
                   return output;
                 });

                currentHeaderString = this.firstcalendar.get("contentBox").one(".yui3-calendar-header-label").get("text");
                Y.Assert.areEqual("01", currentHeaderString);
            },

            testMultiplePanes : function () {
                 var cfg = {
                    contentBox: "#firstcontainer",
                    date: new Date(2011,11,5),
                    selectionMode: "multiple"
                };
                // Set the content template to a two-pane template
                Y.CalendarBase.CONTENT_TEMPLATE = Y.CalendarBase.TWO_PANE_TEMPLATE;
                this.firstcalendar = new Y.Calendar(cfg);
                this.firstcalendar.render();

                // Click on a date
                var calendarid = this.firstcalendar._calendarId;
                Y.one("#" + calendarid + "_pane_0_6_29").simulate("click");

                // Shift-click another date
                Y.one("#" + calendarid + "_pane_1_7_2").simulate("click", {shiftKey: true});

               var date0 = this.firstcalendar.get("selectedDates")[0];
               var date1 = this.firstcalendar.get("selectedDates")[1];
               var date2 = this.firstcalendar.get("selectedDates")[2];
               var date3 = this.firstcalendar.get("selectedDates")[3];
               var date4 = this.firstcalendar.get("selectedDates")[4];

                Y.Assert.areEqual(date0.getFullYear(), 2011);
                Y.Assert.areEqual(date0.getMonth(), 11);
                Y.Assert.areEqual(date0.getDate(), 29);

                Y.Assert.areEqual(date1.getFullYear(), 2011);
                Y.Assert.areEqual(date1.getMonth(), 11);
                Y.Assert.areEqual(date1.getDate(), 30);

                Y.Assert.areEqual(date2.getFullYear(), 2011);
                Y.Assert.areEqual(date2.getMonth(), 11);
                Y.Assert.areEqual(date2.getDate(), 31);

                Y.Assert.areEqual(date3.getFullYear(), 2012);
                Y.Assert.areEqual(date3.getMonth(), 0);
                Y.Assert.areEqual(date3.getDate(), 1);

                Y.Assert.areEqual(date4.getFullYear(), 2012);
                Y.Assert.areEqual(date4.getMonth(), 0);
                Y.Assert.areEqual(date4.getDate(), 2);
            }
        });

        var suite = new Y.Test.Suite("Calendar");
        suite.add(BasicCalendar);

        Y.Test.Runner.add(suite);

});
