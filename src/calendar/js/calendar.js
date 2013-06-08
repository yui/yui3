/**
The Calendar component is a UI widget that allows users
to view dates in a two-dimensional month grid, as well as
to select one or more dates, or ranges of dates. Calendar
is generated dynamically and relies on the developer to
provide for a progressive enhancement alternative.


@module calendar
**/

/**
Create a calendar view to represent a single or multiple
month range of dates, rendered as a grid with date and
weekday labels.

@class Calendar
@extends CalendarBase
@uses CalendarSelection
@param config {Object} Configuration object (see Configuration attributes)
@constructor
**/
Y.Calendar = Y.Base.create('calendar', Y.CalendarBase, [Y.CalendarSelection], {
    initializer: function () {
        this.plug(Y.Plugin.CalendarNavigator);
    }
});
