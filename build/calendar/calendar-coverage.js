if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/calendar/calendar.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/calendar/calendar.js",
    code: []
};
_yuitest_coverage["build/calendar/calendar.js"].code=["YUI.add('calendar', function (Y, NAME) {","","/**"," * The Calendar component is a UI widget that allows users"," * to view dates in a two-dimensional month grid, as well as"," * to select one or more dates, or ranges of dates. Calendar"," * is generated dynamically and relies on the developer to"," * provide for a progressive enhancement alternative."," *"," *"," * @module calendar"," */","","var getCN             = Y.ClassNameManager.getClassName,","    CALENDAR          = 'calendar',","    KEY_DOWN          = 40,","    KEY_UP            = 38,","    KEY_LEFT          = 37,","    KEY_RIGHT         = 39,","    KEY_ENTER         = 13,","    KEY_SPACE         = 32,","    CAL_DAY_SELECTED  = getCN(CALENDAR, 'day-selected'),","    CAL_DAY_HILITED   = getCN(CALENDAR, 'day-highlighted'),","    CAL_DAY           = getCN(CALENDAR, 'day'),","    CAL_PREVMONTH_DAY = getCN(CALENDAR, 'prevmonth-day'),","    CAL_NEXTMONTH_DAY = getCN(CALENDAR, 'nextmonth-day'),","    CAL_GRID          = getCN(CALENDAR, 'grid'),","    ydate             = Y.DataType.Date,","    CAL_PANE          = getCN(CALENDAR, 'pane'),","    os                = Y.UA.os;","","/** Create a calendar view to represent a single or multiple","    * month range of dates, rendered as a grid with date and","    * weekday labels.","    *","    * @class Calendar","    * @extends CalendarBase","    * @param config {Object} Configuration object (see Configuration attributes)","    * @constructor","    */","function Calendar() {","    Calendar.superclass.constructor.apply ( this, arguments );","}","","Y.Calendar = Y.extend(Calendar, Y.CalendarBase, {","","    _keyEvents: [],","","    _highlightedDateNode: null,","","    /**","     * A property tracking the last selected date on the calendar, for the","     * purposes of multiple selection.","     *","     * @property _lastSelectedDate","     * @type Date","     * @default null","     * @private","     */","    _lastSelectedDate: null,","","    /**","     * Designated initializer. Activates the navigation plugin for the calendar.","     *","     * @method initializer","     */","    initializer : function () {","        this.plug(Y.Plugin.CalendarNavigator);","","        this._keyEvents = [];","        this._highlightedDateNode = null;","        this._lastSelectedDate = null;","    },","","    /**","     * Overrides the _bindCalendarEvents placeholder in CalendarBase","     * and binds calendar events during bindUI stage.","     * @method _bindCalendarEvents","     * @protected","     */","    _bindCalendarEvents : function () {","        var contentBox = this.get('contentBox'),","            pane       = contentBox.one(\".\" + CAL_PANE);","","        pane.on(\"selectstart\", this._preventSelectionStart);","        pane.delegate(\"click\", this._clickCalendar, \".\" + CAL_DAY + \", .\" + CAL_PREVMONTH_DAY + \", .\" + CAL_NEXTMONTH_DAY, this);","        pane.delegate(\"keydown\", this._keydownCalendar, \".\" + CAL_GRID, this);","        pane.delegate(\"focus\", this._focusCalendarGrid, \".\" + CAL_GRID, this);","        pane.delegate(\"focus\", this._focusCalendarCell, \".\" + CAL_DAY, this);","        pane.delegate(\"blur\", this._blurCalendarGrid, \".\" + CAL_GRID + \",.\" + CAL_DAY, this);","","","        this.after(['minimumDateChange', 'maximumDateChange'], this._afterCustomRendererChange);","    },","","    /**","     * Prevents text selection if it is started within the calendar pane","     * @method _preventSelectionStart","     * @param event {Event} The selectstart event","     * @protected","     */","    _preventSelectionStart : function (event) {","        event.preventDefault();","    },","","    /**","     * Highlights a specific date node with keyboard highlight class","     * @method _highlightDateNode","     * @param oDate {Date} Date corresponding the node to be highlighted","     * @protected","     */","    _highlightDateNode : function (oDate) {","        this._unhighlightCurrentDateNode();","        var newNode = this._dateToNode(oDate);","        newNode.focus();","        newNode.addClass(CAL_DAY_HILITED);","    },","","    /**","     * Unhighlights a specific date node currently highlighted with keyboard highlight class","     * @method _unhighlightCurrentDateNode","     * @protected","     */","    _unhighlightCurrentDateNode : function () {","        var allHilitedNodes = this.get(\"contentBox\").all(\".\" + CAL_DAY_HILITED);","        if (allHilitedNodes) {","            allHilitedNodes.removeClass(CAL_DAY_HILITED);","        }","    },","","    /**","     * Returns the grid number for a specific calendar grid (for multi-grid templates)","     * @method _getGridNumber","     * @param gridNode {Node} Node corresponding to a specific grid","     * @protected","     */","    _getGridNumber : function (gridNode) {","        var idParts = gridNode.get(\"id\").split(\"_\").reverse();","","        return parseInt(idParts[0], 10);","    },","","    /**","     * Handler for loss of focus of calendar grid","     * @method _blurCalendarGrid","     * @protected","     */","    _blurCalendarGrid : function () {","        this._unhighlightCurrentDateNode();","    },","","","    /**","     * Handler for gain of focus of calendar cell","     * @method _focusCalendarCell","     * @protected","     */","    _focusCalendarCell : function (ev) {","        this._highlightedDateNode = ev.target;","        ev.stopPropagation();","    },","","    /**","     * Handler for gain of focus of calendar grid","     * @method _focusCalendarGrid","     * @protected","     */","    _focusCalendarGrid : function () {","        this._unhighlightCurrentDateNode();","        this._highlightedDateNode = null;","    },","","    /**","     * Handler for keyboard press on a calendar grid","     * @method _keydownCalendar","     * @protected","     */","    _keydownCalendar : function (ev) {","        var gridNum = this._getGridNumber(ev.target),","            curDate = !this._highlightedDateNode ? null : this._nodeToDate(this._highlightedDateNode),","            keyCode = ev.keyCode,","            dayNum = 0,","            dir = '',","            selMode,","            newDate,","            startDate,","            endDate,","            lastPaneDate;","","        switch(keyCode) {","            case KEY_DOWN:","                dayNum = 7;","                dir = 's';","                break;","            case KEY_UP:","                dayNum = -7;","                dir = 'n';","                break;","            case KEY_LEFT:","                dayNum = -1;","                dir = 'w';","                break;","            case KEY_RIGHT:","                dayNum = 1;","                dir = 'e';","                break;","            case KEY_SPACE: case KEY_ENTER:","                ev.preventDefault();","                if (this._highlightedDateNode) {","                    selMode = this.get(\"selectionMode\");","                    if (selMode === \"single\" && !this._highlightedDateNode.hasClass(CAL_DAY_SELECTED)) {","                            this._clearSelection(true);","                            this._addDateToSelection(curDate);","                    } else if (selMode === \"multiple\" || selMode === \"multiple-sticky\") {","                        if (this._highlightedDateNode.hasClass(CAL_DAY_SELECTED)) {","                            this._removeDateFromSelection(curDate);","                        } else {","                            this._addDateToSelection(curDate);","                        }","                    }","                }","                break;","        }","","","        if (keyCode === KEY_DOWN || keyCode === KEY_UP || keyCode === KEY_LEFT || keyCode === KEY_RIGHT) {","","            if (!curDate) {","                curDate = ydate.addMonths(this.get(\"date\"), gridNum);","                dayNum = 0;","            }","","            ev.preventDefault();","","            newDate = ydate.addDays(curDate, dayNum);","            startDate = this.get(\"date\");","            endDate = ydate.addMonths(this.get(\"date\"), this._paneNumber - 1);","            lastPaneDate = new Date(endDate);","            endDate.setDate(ydate.daysInMonth(endDate));","","            if (ydate.isInRange(newDate, startDate, endDate)) {","/*","                var paneShift = (newDate.getMonth() - curDate.getMonth()) % 10;","","                if (paneShift != 0) {","                    var newGridNum = gridNum + paneShift,","                            contentBox = this.get('contentBox'),","                            newPane = contentBox.one(\"#\" + this._calendarId + \"_pane_\" + newGridNum);","                            newPane.focus();","                }","*/","                this._highlightDateNode(newDate);","            } else if (ydate.isGreater(startDate, newDate)) {","                if (!ydate.isGreaterOrEqual(this.get(\"minimumDate\"), startDate)) {","                    this.set(\"date\", ydate.addMonths(startDate, -1));","                    this._highlightDateNode(newDate);","                }","            } else if (ydate.isGreater(newDate, endDate)) {","                if (!ydate.isGreaterOrEqual(lastPaneDate, this.get(\"maximumDate\"))) {","                    this.set(\"date\", ydate.addMonths(startDate, 1));","                    this._highlightDateNode(newDate);","                }","            }","        }","    },","","    /**","     * Handles the calendar clicks based on selection mode.","     * @method _clickCalendar","     * @param {Event} ev A click event","     * @private","     */","    _clickCalendar : function (ev) {","        var clickedCell = ev.currentTarget,","            clickedCellIsDay = clickedCell.hasClass(CAL_DAY) &&","                                !clickedCell.hasClass(CAL_PREVMONTH_DAY) &&","                                !clickedCell.hasClass(CAL_NEXTMONTH_DAY),","","        clickedCellIsSelected = clickedCell.hasClass(CAL_DAY_SELECTED),","        selectedDate;","","        switch (this.get(\"selectionMode\")) {","            case(\"single\"):","                if (clickedCellIsDay) {","                    if (!clickedCellIsSelected) {","                        this._clearSelection(true);","                        this._addDateToSelection(this._nodeToDate(clickedCell));","                    }","                }","                break;","            case(\"multiple-sticky\"):","                if (clickedCellIsDay) {","                    if (clickedCellIsSelected) {","                        this._removeDateFromSelection(this._nodeToDate(clickedCell));","                    } else {","                        this._addDateToSelection(this._nodeToDate(clickedCell));","                    }","                }","                break;","            case(\"multiple\"):","                if (clickedCellIsDay) {","                    if (!ev.metaKey && !ev.ctrlKey && !ev.shiftKey) {","                        this._clearSelection(true);","                        this._lastSelectedDate = this._nodeToDate(clickedCell);","                        this._addDateToSelection(this._lastSelectedDate);","                    } else if (((os === 'macintosh' && ev.metaKey) || (os !== 'macintosh' && ev.ctrlKey)) && !ev.shiftKey) {","                        if (clickedCellIsSelected) {","                            this._removeDateFromSelection(this._nodeToDate(clickedCell));","                            this._lastSelectedDate = null;","                        } else {","                            this._lastSelectedDate = this._nodeToDate(clickedCell);","                            this._addDateToSelection(this._lastSelectedDate);","                        }","                    } else if (((os === 'macintosh' && ev.metaKey) || (os !== 'macintosh' && ev.ctrlKey)) && ev.shiftKey) {","                        if (this._lastSelectedDate) {","                            selectedDate = this._nodeToDate(clickedCell);","                            this._addDateRangeToSelection(selectedDate, this._lastSelectedDate);","                            this._lastSelectedDate = selectedDate;","                        } else {","                            this._lastSelectedDate = this._nodeToDate(clickedCell);","                            this._addDateToSelection(this._lastSelectedDate);","                        }","                    } else if (ev.shiftKey) {","                        if (this._lastSelectedDate) {","                            selectedDate = this._nodeToDate(clickedCell);","                            this._clearSelection(true);","                            this._addDateRangeToSelection(selectedDate, this._lastSelectedDate);","                            this._lastSelectedDate = selectedDate;","                        } else {","                            this._clearSelection(true);","                            this._lastSelectedDate = this._nodeToDate(clickedCell);","                            this._addDateToSelection(this._lastSelectedDate);","                        }","                    }","                }","                break;","        }","","        if (clickedCellIsDay) {","            /**","            * Fired when a specific date cell in the calendar is clicked. The event carries a","            * payload which includes a `cell` property corresponding to the node of the actual","            * date cell, and a `date` property, with the `Date` that was clicked.","            *","            * @event dateClick","            */","            this.fire(\"dateClick\", {cell: clickedCell, date: this._nodeToDate(clickedCell)});","        } else if (clickedCell.hasClass(CAL_PREVMONTH_DAY)) {","            /**","            * Fired when any of the previous month's days displayed before the calendar grid","            * are clicked.","            *","            * @event prevMonthClick","            */","            this.fire(\"prevMonthClick\");","        } else if (clickedCell.hasClass(CAL_NEXTMONTH_DAY)) {","            /**","            * Fired when any of the next month's days displayed after the calendar grid","            * are clicked.","            *","            * @event nextMonthClick","            */","            this.fire(\"nextMonthClick\");","        }","    },","","    /**","     * Overrides CalendarBase.prototype._canBeSelected to disable","     * nodes earlier than minimumDate and later than maximumDate","     * @method _canBeSelected","     * @private","     */","    _canBeSelected : function (date) {","        var minDate = this.get('minimumDate'),","            maxDate = this.get('maximumDate');","","        if ((minDate && !ydate.isGreaterOrEqual(date, minDate)) ||","            (maxDate &&  ydate.isGreater(date, maxDate))) {","            return false;","        }","","        return Calendar.superclass._canBeSelected.call(this, date);","    },","","    /**","     * Overrides CalendarBase.prototype._renderCustomRules to disable","     * nodes earlier than minimumDate and later than maximumDate","     * @method _renderCustomRules","     * @private","     */","    _renderCustomRules: function () {","        Calendar.superclass._renderCustomRules.call(this);","","        var minDate = this.get('minimumDate'),","            maxDate = this.get('maximumDate'),","            dates = [],","            i, l,","            paneNum;","","        if (!minDate && !maxDate) {","            return;","        }","","        for (paneNum = 0; paneNum < this._paneNumber; paneNum++) {","            paneDate = ydate.addMonths(this.get(\"date\"), paneNum);","            dates = dates.concat(ydate.listOfDatesInMonth(paneDate));","        }","","        if (minDate) {","            for (i = 0, l = dates.length; i < l; i++) {","                if (!ydate.isGreaterOrEqual(dates[i], minDate)) {","                    this._disableDate(dates[i]);","                } else {","                    break;","                }","            }","        }","","        if (maxDate) {","            for (i = dates.length - 1; i >= 0; i--) {","                if (ydate.isGreater(dates[i], maxDate)) {","                    this._disableDate(dates[i]);","                } else {","                    break;","                }","            }","        }","    },","","    /**","     * Subtracts one month from the current calendar view.","     * @method subtractMonth","     * @return {Calendar} A reference to this object","     * @chainable","     */","    subtractMonth : function (e) {","        this.set(\"date\", ydate.addMonths(this.get(\"date\"), -1));","        if (e) {","            e.halt();","        }","        return this;","    },","","    /**","     * Subtracts one year from the current calendar view.","     * @method subtractYear","     * @return {Calendar} A reference to this object","     * @chainable","     */","    subtractYear : function (e) {","        this.set(\"date\", ydate.addYears(this.get(\"date\"), -1));","        if (e) {","            e.halt();","        }","        return this;","    },","","    /**","     * Adds one month to the current calendar view.","     * @method addMonth","     * @return {Calendar} A reference to this object","     * @chainable","     */","    addMonth : function (e) {","        this.set(\"date\", ydate.addMonths(this.get(\"date\"), 1));","        if (e) {","            e.halt();","        }","        return this;","    },","","    /**","     * Adds one year to the current calendar view.","     * @method addYear","     * @return {Calendar} A reference to this object","     * @chainable","     */","    addYear : function (e) {","        this.set(\"date\", ydate.addYears(this.get(\"date\"), 1));","        if (e) {","            e.halt();","        }","        return this;","    }","}, {","    /**","    * The identity of the widget.","    *","    * @property NAME","    * @type String","    * @default 'calendar'","    * @readOnly","    * @protected","    * @static","    */","    NAME: \"calendar\",","","    /**","    * Static property used to define the default attribute configuration of","    * the Widget.","    *","    * @property ATTRS","    * @type {Object}","    * @protected","    * @static","    */","    ATTRS: {","","        /**","         * A setting specifying the type of selection the calendar allows.","         * Possible values include:","         * <ul>","         *   <li>`single` - One date at a time</li>","         *   <li>`multiple-sticky` - Multiple dates, selected one at a time (the dates \"stick\"). This option","         *   is appropriate for mobile devices, where function keys from the keyboard are not available.</li>","         *   <li>`multiple` - Multiple dates, selected with Ctrl/Meta keys for additional single","         *   dates, and Shift key for date ranges.</li>","         *","         * @attribute selectionMode","         * @type String","         * @default single","         */","        selectionMode: {","            value: \"single\"","        },","","        /**","         * The date corresponding to the current calendar view. Always","         * normalized to the first of the month that contains the date","         * at assignment time. Used as the first date visible in the","         * calendar.","         *","         * @attribute date","         * @type Date","         * @default Today's date as set on the user's computer.","         */","        date: {","            value: new Date(),","            lazyAdd: false,","            setter: function (val) {","","                var newDate    = this._normalizeDate(val),","                    newEndDate = ydate.addMonths(newDate, this._paneNumber - 1),","                    minDate    = this.get(\"minimumDate\"),","                    maxDate    = this.get(\"maximumDate\");","","                if ((!minDate || ydate.isGreaterOrEqual(newDate, minDate)) &&","                    (!maxDate || ydate.isGreaterOrEqual(maxDate, newEndDate))","                ) {","                    return newDate;","                } else if (minDate && ydate.isGreater(minDate, newDate)) {","                    return this._normalizeDate(minDate);","                } else if (maxDate && ydate.isGreater(newEndDate, maxDate)) {","                    return ydate.addMonths(this._normalizeDate(maxDate), 1 - this._paneNumber);","                }","            }","        },","","        /**","         * Unless minimumDate is null, it will not be possible to display and select dates earlier than this one.","         *","         * @attribute minimumDate","         * @type Date","         * @default null","         */","        minimumDate: {","            value: null,","            setter: function (val) {","                if (Y.Lang.isDate(val)) {","                    var curDate = this.get('date'),","                        newMin  = this._normalizeTime(val);","                    if (curDate && !ydate.isGreaterOrEqual(curDate, newMin)) {","                        this.set('date', val);","                    }","                    return newMin;","                } else {","                    return null;","                }","            }","        },","","        /**","         * Unless maximumDate is null, it will not be possible to display and select dates later than this one.","         *","         * @attribute maximumDate","         * @type Date","         * @default null","         */","        maximumDate: {","            value: null,","            setter: function (val) {","                if (Y.Lang.isDate(val)) {","                    var curDate = this.get('date');","","                    if (curDate && !ydate.isGreaterOrEqual(val, ydate.addMonths(curDate, this._paneNumber - 1))) {","                        this.set('date', ydate.addMonths(this._normalizeDate(val), 1 - this._paneNumber));","                    }","","                    return this._normalizeTime(val);","                } else {","                    return null;","                }","            }","        }","    }","});","","}, '@VERSION@', {","    \"requires\": [","        \"calendar-base\",","        \"calendarnavigator\"","    ],","    \"lang\": [","        \"de\",","        \"en\",","        \"es\",","        \"es-AR\",","        \"fr\",","        \"hu\",","        \"it\",","        \"ja\",","        \"nb-NO\",","        \"nl\",","        \"pt-BR\",","        \"ru\",","        \"zh-HANT-TW\"","    ],","    \"skinnable\": true","});"];
_yuitest_coverage["build/calendar/calendar.js"].lines = {"1":0,"14":0,"41":0,"42":0,"45":0,"68":0,"70":0,"71":0,"72":0,"82":0,"85":0,"86":0,"87":0,"88":0,"89":0,"90":0,"93":0,"103":0,"113":0,"114":0,"115":0,"116":0,"125":0,"126":0,"127":0,"138":0,"140":0,"149":0,"159":0,"160":0,"169":0,"170":0,"179":0,"190":0,"192":0,"193":0,"194":0,"196":0,"197":0,"198":0,"200":0,"201":0,"202":0,"204":0,"205":0,"206":0,"208":0,"209":0,"210":0,"211":0,"212":0,"213":0,"214":0,"215":0,"216":0,"218":0,"222":0,"226":0,"228":0,"229":0,"230":0,"233":0,"235":0,"236":0,"237":0,"238":0,"239":0,"241":0,"252":0,"253":0,"254":0,"255":0,"256":0,"258":0,"259":0,"260":0,"261":0,"274":0,"282":0,"284":0,"285":0,"286":0,"287":0,"290":0,"292":0,"293":0,"294":0,"296":0,"299":0,"301":0,"302":0,"303":0,"304":0,"305":0,"306":0,"307":0,"308":0,"309":0,"311":0,"312":0,"314":0,"315":0,"316":0,"317":0,"318":0,"320":0,"321":0,"323":0,"324":0,"325":0,"326":0,"327":0,"328":0,"330":0,"331":0,"332":0,"336":0,"339":0,"347":0,"348":0,"355":0,"356":0,"363":0,"374":0,"377":0,"379":0,"382":0,"392":0,"394":0,"400":0,"401":0,"404":0,"405":0,"406":0,"409":0,"410":0,"411":0,"412":0,"414":0,"419":0,"420":0,"421":0,"422":0,"424":0,"437":0,"438":0,"439":0,"441":0,"451":0,"452":0,"453":0,"455":0,"465":0,"466":0,"467":0,"469":0,"479":0,"480":0,"481":0,"483":0,"542":0,"547":0,"550":0,"551":0,"552":0,"553":0,"554":0,"569":0,"570":0,"572":0,"573":0,"575":0,"577":0,"592":0,"593":0,"595":0,"596":0,"599":0,"601":0};
_yuitest_coverage["build/calendar/calendar.js"].functions = {"Calendar:41":0,"initializer:67":0,"_bindCalendarEvents:81":0,"_preventSelectionStart:102":0,"_highlightDateNode:112":0,"_unhighlightCurrentDateNode:124":0,"_getGridNumber:137":0,"_blurCalendarGrid:148":0,"_focusCalendarCell:158":0,"_focusCalendarGrid:168":0,"_keydownCalendar:178":0,"_clickCalendar:273":0,"_canBeSelected:373":0,"_renderCustomRules:391":0,"subtractMonth:436":0,"subtractYear:450":0,"addMonth:464":0,"addYear:478":0,"setter:540":0,"setter:568":0,"setter:591":0,"(anonymous 1):1":0};
_yuitest_coverage["build/calendar/calendar.js"].coveredLines = 179;
_yuitest_coverage["build/calendar/calendar.js"].coveredFunctions = 22;
_yuitest_coverline("build/calendar/calendar.js", 1);
YUI.add('calendar', function (Y, NAME) {

/**
 * The Calendar component is a UI widget that allows users
 * to view dates in a two-dimensional month grid, as well as
 * to select one or more dates, or ranges of dates. Calendar
 * is generated dynamically and relies on the developer to
 * provide for a progressive enhancement alternative.
 *
 *
 * @module calendar
 */

_yuitest_coverfunc("build/calendar/calendar.js", "(anonymous 1)", 1);
_yuitest_coverline("build/calendar/calendar.js", 14);
var getCN             = Y.ClassNameManager.getClassName,
    CALENDAR          = 'calendar',
    KEY_DOWN          = 40,
    KEY_UP            = 38,
    KEY_LEFT          = 37,
    KEY_RIGHT         = 39,
    KEY_ENTER         = 13,
    KEY_SPACE         = 32,
    CAL_DAY_SELECTED  = getCN(CALENDAR, 'day-selected'),
    CAL_DAY_HILITED   = getCN(CALENDAR, 'day-highlighted'),
    CAL_DAY           = getCN(CALENDAR, 'day'),
    CAL_PREVMONTH_DAY = getCN(CALENDAR, 'prevmonth-day'),
    CAL_NEXTMONTH_DAY = getCN(CALENDAR, 'nextmonth-day'),
    CAL_GRID          = getCN(CALENDAR, 'grid'),
    ydate             = Y.DataType.Date,
    CAL_PANE          = getCN(CALENDAR, 'pane'),
    os                = Y.UA.os;

/** Create a calendar view to represent a single or multiple
    * month range of dates, rendered as a grid with date and
    * weekday labels.
    *
    * @class Calendar
    * @extends CalendarBase
    * @param config {Object} Configuration object (see Configuration attributes)
    * @constructor
    */
_yuitest_coverline("build/calendar/calendar.js", 41);
function Calendar() {
    _yuitest_coverfunc("build/calendar/calendar.js", "Calendar", 41);
_yuitest_coverline("build/calendar/calendar.js", 42);
Calendar.superclass.constructor.apply ( this, arguments );
}

_yuitest_coverline("build/calendar/calendar.js", 45);
Y.Calendar = Y.extend(Calendar, Y.CalendarBase, {

    _keyEvents: [],

    _highlightedDateNode: null,

    /**
     * A property tracking the last selected date on the calendar, for the
     * purposes of multiple selection.
     *
     * @property _lastSelectedDate
     * @type Date
     * @default null
     * @private
     */
    _lastSelectedDate: null,

    /**
     * Designated initializer. Activates the navigation plugin for the calendar.
     *
     * @method initializer
     */
    initializer : function () {
        _yuitest_coverfunc("build/calendar/calendar.js", "initializer", 67);
_yuitest_coverline("build/calendar/calendar.js", 68);
this.plug(Y.Plugin.CalendarNavigator);

        _yuitest_coverline("build/calendar/calendar.js", 70);
this._keyEvents = [];
        _yuitest_coverline("build/calendar/calendar.js", 71);
this._highlightedDateNode = null;
        _yuitest_coverline("build/calendar/calendar.js", 72);
this._lastSelectedDate = null;
    },

    /**
     * Overrides the _bindCalendarEvents placeholder in CalendarBase
     * and binds calendar events during bindUI stage.
     * @method _bindCalendarEvents
     * @protected
     */
    _bindCalendarEvents : function () {
        _yuitest_coverfunc("build/calendar/calendar.js", "_bindCalendarEvents", 81);
_yuitest_coverline("build/calendar/calendar.js", 82);
var contentBox = this.get('contentBox'),
            pane       = contentBox.one("." + CAL_PANE);

        _yuitest_coverline("build/calendar/calendar.js", 85);
pane.on("selectstart", this._preventSelectionStart);
        _yuitest_coverline("build/calendar/calendar.js", 86);
pane.delegate("click", this._clickCalendar, "." + CAL_DAY + ", ." + CAL_PREVMONTH_DAY + ", ." + CAL_NEXTMONTH_DAY, this);
        _yuitest_coverline("build/calendar/calendar.js", 87);
pane.delegate("keydown", this._keydownCalendar, "." + CAL_GRID, this);
        _yuitest_coverline("build/calendar/calendar.js", 88);
pane.delegate("focus", this._focusCalendarGrid, "." + CAL_GRID, this);
        _yuitest_coverline("build/calendar/calendar.js", 89);
pane.delegate("focus", this._focusCalendarCell, "." + CAL_DAY, this);
        _yuitest_coverline("build/calendar/calendar.js", 90);
pane.delegate("blur", this._blurCalendarGrid, "." + CAL_GRID + ",." + CAL_DAY, this);


        _yuitest_coverline("build/calendar/calendar.js", 93);
this.after(['minimumDateChange', 'maximumDateChange'], this._afterCustomRendererChange);
    },

    /**
     * Prevents text selection if it is started within the calendar pane
     * @method _preventSelectionStart
     * @param event {Event} The selectstart event
     * @protected
     */
    _preventSelectionStart : function (event) {
        _yuitest_coverfunc("build/calendar/calendar.js", "_preventSelectionStart", 102);
_yuitest_coverline("build/calendar/calendar.js", 103);
event.preventDefault();
    },

    /**
     * Highlights a specific date node with keyboard highlight class
     * @method _highlightDateNode
     * @param oDate {Date} Date corresponding the node to be highlighted
     * @protected
     */
    _highlightDateNode : function (oDate) {
        _yuitest_coverfunc("build/calendar/calendar.js", "_highlightDateNode", 112);
_yuitest_coverline("build/calendar/calendar.js", 113);
this._unhighlightCurrentDateNode();
        _yuitest_coverline("build/calendar/calendar.js", 114);
var newNode = this._dateToNode(oDate);
        _yuitest_coverline("build/calendar/calendar.js", 115);
newNode.focus();
        _yuitest_coverline("build/calendar/calendar.js", 116);
newNode.addClass(CAL_DAY_HILITED);
    },

    /**
     * Unhighlights a specific date node currently highlighted with keyboard highlight class
     * @method _unhighlightCurrentDateNode
     * @protected
     */
    _unhighlightCurrentDateNode : function () {
        _yuitest_coverfunc("build/calendar/calendar.js", "_unhighlightCurrentDateNode", 124);
_yuitest_coverline("build/calendar/calendar.js", 125);
var allHilitedNodes = this.get("contentBox").all("." + CAL_DAY_HILITED);
        _yuitest_coverline("build/calendar/calendar.js", 126);
if (allHilitedNodes) {
            _yuitest_coverline("build/calendar/calendar.js", 127);
allHilitedNodes.removeClass(CAL_DAY_HILITED);
        }
    },

    /**
     * Returns the grid number for a specific calendar grid (for multi-grid templates)
     * @method _getGridNumber
     * @param gridNode {Node} Node corresponding to a specific grid
     * @protected
     */
    _getGridNumber : function (gridNode) {
        _yuitest_coverfunc("build/calendar/calendar.js", "_getGridNumber", 137);
_yuitest_coverline("build/calendar/calendar.js", 138);
var idParts = gridNode.get("id").split("_").reverse();

        _yuitest_coverline("build/calendar/calendar.js", 140);
return parseInt(idParts[0], 10);
    },

    /**
     * Handler for loss of focus of calendar grid
     * @method _blurCalendarGrid
     * @protected
     */
    _blurCalendarGrid : function () {
        _yuitest_coverfunc("build/calendar/calendar.js", "_blurCalendarGrid", 148);
_yuitest_coverline("build/calendar/calendar.js", 149);
this._unhighlightCurrentDateNode();
    },


    /**
     * Handler for gain of focus of calendar cell
     * @method _focusCalendarCell
     * @protected
     */
    _focusCalendarCell : function (ev) {
        _yuitest_coverfunc("build/calendar/calendar.js", "_focusCalendarCell", 158);
_yuitest_coverline("build/calendar/calendar.js", 159);
this._highlightedDateNode = ev.target;
        _yuitest_coverline("build/calendar/calendar.js", 160);
ev.stopPropagation();
    },

    /**
     * Handler for gain of focus of calendar grid
     * @method _focusCalendarGrid
     * @protected
     */
    _focusCalendarGrid : function () {
        _yuitest_coverfunc("build/calendar/calendar.js", "_focusCalendarGrid", 168);
_yuitest_coverline("build/calendar/calendar.js", 169);
this._unhighlightCurrentDateNode();
        _yuitest_coverline("build/calendar/calendar.js", 170);
this._highlightedDateNode = null;
    },

    /**
     * Handler for keyboard press on a calendar grid
     * @method _keydownCalendar
     * @protected
     */
    _keydownCalendar : function (ev) {
        _yuitest_coverfunc("build/calendar/calendar.js", "_keydownCalendar", 178);
_yuitest_coverline("build/calendar/calendar.js", 179);
var gridNum = this._getGridNumber(ev.target),
            curDate = !this._highlightedDateNode ? null : this._nodeToDate(this._highlightedDateNode),
            keyCode = ev.keyCode,
            dayNum = 0,
            dir = '',
            selMode,
            newDate,
            startDate,
            endDate,
            lastPaneDate;

        _yuitest_coverline("build/calendar/calendar.js", 190);
switch(keyCode) {
            case KEY_DOWN:
                _yuitest_coverline("build/calendar/calendar.js", 192);
dayNum = 7;
                _yuitest_coverline("build/calendar/calendar.js", 193);
dir = 's';
                _yuitest_coverline("build/calendar/calendar.js", 194);
break;
            case KEY_UP:
                _yuitest_coverline("build/calendar/calendar.js", 196);
dayNum = -7;
                _yuitest_coverline("build/calendar/calendar.js", 197);
dir = 'n';
                _yuitest_coverline("build/calendar/calendar.js", 198);
break;
            case KEY_LEFT:
                _yuitest_coverline("build/calendar/calendar.js", 200);
dayNum = -1;
                _yuitest_coverline("build/calendar/calendar.js", 201);
dir = 'w';
                _yuitest_coverline("build/calendar/calendar.js", 202);
break;
            case KEY_RIGHT:
                _yuitest_coverline("build/calendar/calendar.js", 204);
dayNum = 1;
                _yuitest_coverline("build/calendar/calendar.js", 205);
dir = 'e';
                _yuitest_coverline("build/calendar/calendar.js", 206);
break;
            case KEY_SPACE: case KEY_ENTER:
                _yuitest_coverline("build/calendar/calendar.js", 208);
ev.preventDefault();
                _yuitest_coverline("build/calendar/calendar.js", 209);
if (this._highlightedDateNode) {
                    _yuitest_coverline("build/calendar/calendar.js", 210);
selMode = this.get("selectionMode");
                    _yuitest_coverline("build/calendar/calendar.js", 211);
if (selMode === "single" && !this._highlightedDateNode.hasClass(CAL_DAY_SELECTED)) {
                            _yuitest_coverline("build/calendar/calendar.js", 212);
this._clearSelection(true);
                            _yuitest_coverline("build/calendar/calendar.js", 213);
this._addDateToSelection(curDate);
                    } else {_yuitest_coverline("build/calendar/calendar.js", 214);
if (selMode === "multiple" || selMode === "multiple-sticky") {
                        _yuitest_coverline("build/calendar/calendar.js", 215);
if (this._highlightedDateNode.hasClass(CAL_DAY_SELECTED)) {
                            _yuitest_coverline("build/calendar/calendar.js", 216);
this._removeDateFromSelection(curDate);
                        } else {
                            _yuitest_coverline("build/calendar/calendar.js", 218);
this._addDateToSelection(curDate);
                        }
                    }}
                }
                _yuitest_coverline("build/calendar/calendar.js", 222);
break;
        }


        _yuitest_coverline("build/calendar/calendar.js", 226);
if (keyCode === KEY_DOWN || keyCode === KEY_UP || keyCode === KEY_LEFT || keyCode === KEY_RIGHT) {

            _yuitest_coverline("build/calendar/calendar.js", 228);
if (!curDate) {
                _yuitest_coverline("build/calendar/calendar.js", 229);
curDate = ydate.addMonths(this.get("date"), gridNum);
                _yuitest_coverline("build/calendar/calendar.js", 230);
dayNum = 0;
            }

            _yuitest_coverline("build/calendar/calendar.js", 233);
ev.preventDefault();

            _yuitest_coverline("build/calendar/calendar.js", 235);
newDate = ydate.addDays(curDate, dayNum);
            _yuitest_coverline("build/calendar/calendar.js", 236);
startDate = this.get("date");
            _yuitest_coverline("build/calendar/calendar.js", 237);
endDate = ydate.addMonths(this.get("date"), this._paneNumber - 1);
            _yuitest_coverline("build/calendar/calendar.js", 238);
lastPaneDate = new Date(endDate);
            _yuitest_coverline("build/calendar/calendar.js", 239);
endDate.setDate(ydate.daysInMonth(endDate));

            _yuitest_coverline("build/calendar/calendar.js", 241);
if (ydate.isInRange(newDate, startDate, endDate)) {
/*
                var paneShift = (newDate.getMonth() - curDate.getMonth()) % 10;

                if (paneShift != 0) {
                    var newGridNum = gridNum + paneShift,
                            contentBox = this.get('contentBox'),
                            newPane = contentBox.one("#" + this._calendarId + "_pane_" + newGridNum);
                            newPane.focus();
                }
*/
                _yuitest_coverline("build/calendar/calendar.js", 252);
this._highlightDateNode(newDate);
            } else {_yuitest_coverline("build/calendar/calendar.js", 253);
if (ydate.isGreater(startDate, newDate)) {
                _yuitest_coverline("build/calendar/calendar.js", 254);
if (!ydate.isGreaterOrEqual(this.get("minimumDate"), startDate)) {
                    _yuitest_coverline("build/calendar/calendar.js", 255);
this.set("date", ydate.addMonths(startDate, -1));
                    _yuitest_coverline("build/calendar/calendar.js", 256);
this._highlightDateNode(newDate);
                }
            } else {_yuitest_coverline("build/calendar/calendar.js", 258);
if (ydate.isGreater(newDate, endDate)) {
                _yuitest_coverline("build/calendar/calendar.js", 259);
if (!ydate.isGreaterOrEqual(lastPaneDate, this.get("maximumDate"))) {
                    _yuitest_coverline("build/calendar/calendar.js", 260);
this.set("date", ydate.addMonths(startDate, 1));
                    _yuitest_coverline("build/calendar/calendar.js", 261);
this._highlightDateNode(newDate);
                }
            }}}
        }
    },

    /**
     * Handles the calendar clicks based on selection mode.
     * @method _clickCalendar
     * @param {Event} ev A click event
     * @private
     */
    _clickCalendar : function (ev) {
        _yuitest_coverfunc("build/calendar/calendar.js", "_clickCalendar", 273);
_yuitest_coverline("build/calendar/calendar.js", 274);
var clickedCell = ev.currentTarget,
            clickedCellIsDay = clickedCell.hasClass(CAL_DAY) &&
                                !clickedCell.hasClass(CAL_PREVMONTH_DAY) &&
                                !clickedCell.hasClass(CAL_NEXTMONTH_DAY),

        clickedCellIsSelected = clickedCell.hasClass(CAL_DAY_SELECTED),
        selectedDate;

        _yuitest_coverline("build/calendar/calendar.js", 282);
switch (this.get("selectionMode")) {
            case("single"):
                _yuitest_coverline("build/calendar/calendar.js", 284);
if (clickedCellIsDay) {
                    _yuitest_coverline("build/calendar/calendar.js", 285);
if (!clickedCellIsSelected) {
                        _yuitest_coverline("build/calendar/calendar.js", 286);
this._clearSelection(true);
                        _yuitest_coverline("build/calendar/calendar.js", 287);
this._addDateToSelection(this._nodeToDate(clickedCell));
                    }
                }
                _yuitest_coverline("build/calendar/calendar.js", 290);
break;
            case("multiple-sticky"):
                _yuitest_coverline("build/calendar/calendar.js", 292);
if (clickedCellIsDay) {
                    _yuitest_coverline("build/calendar/calendar.js", 293);
if (clickedCellIsSelected) {
                        _yuitest_coverline("build/calendar/calendar.js", 294);
this._removeDateFromSelection(this._nodeToDate(clickedCell));
                    } else {
                        _yuitest_coverline("build/calendar/calendar.js", 296);
this._addDateToSelection(this._nodeToDate(clickedCell));
                    }
                }
                _yuitest_coverline("build/calendar/calendar.js", 299);
break;
            case("multiple"):
                _yuitest_coverline("build/calendar/calendar.js", 301);
if (clickedCellIsDay) {
                    _yuitest_coverline("build/calendar/calendar.js", 302);
if (!ev.metaKey && !ev.ctrlKey && !ev.shiftKey) {
                        _yuitest_coverline("build/calendar/calendar.js", 303);
this._clearSelection(true);
                        _yuitest_coverline("build/calendar/calendar.js", 304);
this._lastSelectedDate = this._nodeToDate(clickedCell);
                        _yuitest_coverline("build/calendar/calendar.js", 305);
this._addDateToSelection(this._lastSelectedDate);
                    } else {_yuitest_coverline("build/calendar/calendar.js", 306);
if (((os === 'macintosh' && ev.metaKey) || (os !== 'macintosh' && ev.ctrlKey)) && !ev.shiftKey) {
                        _yuitest_coverline("build/calendar/calendar.js", 307);
if (clickedCellIsSelected) {
                            _yuitest_coverline("build/calendar/calendar.js", 308);
this._removeDateFromSelection(this._nodeToDate(clickedCell));
                            _yuitest_coverline("build/calendar/calendar.js", 309);
this._lastSelectedDate = null;
                        } else {
                            _yuitest_coverline("build/calendar/calendar.js", 311);
this._lastSelectedDate = this._nodeToDate(clickedCell);
                            _yuitest_coverline("build/calendar/calendar.js", 312);
this._addDateToSelection(this._lastSelectedDate);
                        }
                    } else {_yuitest_coverline("build/calendar/calendar.js", 314);
if (((os === 'macintosh' && ev.metaKey) || (os !== 'macintosh' && ev.ctrlKey)) && ev.shiftKey) {
                        _yuitest_coverline("build/calendar/calendar.js", 315);
if (this._lastSelectedDate) {
                            _yuitest_coverline("build/calendar/calendar.js", 316);
selectedDate = this._nodeToDate(clickedCell);
                            _yuitest_coverline("build/calendar/calendar.js", 317);
this._addDateRangeToSelection(selectedDate, this._lastSelectedDate);
                            _yuitest_coverline("build/calendar/calendar.js", 318);
this._lastSelectedDate = selectedDate;
                        } else {
                            _yuitest_coverline("build/calendar/calendar.js", 320);
this._lastSelectedDate = this._nodeToDate(clickedCell);
                            _yuitest_coverline("build/calendar/calendar.js", 321);
this._addDateToSelection(this._lastSelectedDate);
                        }
                    } else {_yuitest_coverline("build/calendar/calendar.js", 323);
if (ev.shiftKey) {
                        _yuitest_coverline("build/calendar/calendar.js", 324);
if (this._lastSelectedDate) {
                            _yuitest_coverline("build/calendar/calendar.js", 325);
selectedDate = this._nodeToDate(clickedCell);
                            _yuitest_coverline("build/calendar/calendar.js", 326);
this._clearSelection(true);
                            _yuitest_coverline("build/calendar/calendar.js", 327);
this._addDateRangeToSelection(selectedDate, this._lastSelectedDate);
                            _yuitest_coverline("build/calendar/calendar.js", 328);
this._lastSelectedDate = selectedDate;
                        } else {
                            _yuitest_coverline("build/calendar/calendar.js", 330);
this._clearSelection(true);
                            _yuitest_coverline("build/calendar/calendar.js", 331);
this._lastSelectedDate = this._nodeToDate(clickedCell);
                            _yuitest_coverline("build/calendar/calendar.js", 332);
this._addDateToSelection(this._lastSelectedDate);
                        }
                    }}}}
                }
                _yuitest_coverline("build/calendar/calendar.js", 336);
break;
        }

        _yuitest_coverline("build/calendar/calendar.js", 339);
if (clickedCellIsDay) {
            /**
            * Fired when a specific date cell in the calendar is clicked. The event carries a
            * payload which includes a `cell` property corresponding to the node of the actual
            * date cell, and a `date` property, with the `Date` that was clicked.
            *
            * @event dateClick
            */
            _yuitest_coverline("build/calendar/calendar.js", 347);
this.fire("dateClick", {cell: clickedCell, date: this._nodeToDate(clickedCell)});
        } else {_yuitest_coverline("build/calendar/calendar.js", 348);
if (clickedCell.hasClass(CAL_PREVMONTH_DAY)) {
            /**
            * Fired when any of the previous month's days displayed before the calendar grid
            * are clicked.
            *
            * @event prevMonthClick
            */
            _yuitest_coverline("build/calendar/calendar.js", 355);
this.fire("prevMonthClick");
        } else {_yuitest_coverline("build/calendar/calendar.js", 356);
if (clickedCell.hasClass(CAL_NEXTMONTH_DAY)) {
            /**
            * Fired when any of the next month's days displayed after the calendar grid
            * are clicked.
            *
            * @event nextMonthClick
            */
            _yuitest_coverline("build/calendar/calendar.js", 363);
this.fire("nextMonthClick");
        }}}
    },

    /**
     * Overrides CalendarBase.prototype._canBeSelected to disable
     * nodes earlier than minimumDate and later than maximumDate
     * @method _canBeSelected
     * @private
     */
    _canBeSelected : function (date) {
        _yuitest_coverfunc("build/calendar/calendar.js", "_canBeSelected", 373);
_yuitest_coverline("build/calendar/calendar.js", 374);
var minDate = this.get('minimumDate'),
            maxDate = this.get('maximumDate');

        _yuitest_coverline("build/calendar/calendar.js", 377);
if ((minDate && !ydate.isGreaterOrEqual(date, minDate)) ||
            (maxDate &&  ydate.isGreater(date, maxDate))) {
            _yuitest_coverline("build/calendar/calendar.js", 379);
return false;
        }

        _yuitest_coverline("build/calendar/calendar.js", 382);
return Calendar.superclass._canBeSelected.call(this, date);
    },

    /**
     * Overrides CalendarBase.prototype._renderCustomRules to disable
     * nodes earlier than minimumDate and later than maximumDate
     * @method _renderCustomRules
     * @private
     */
    _renderCustomRules: function () {
        _yuitest_coverfunc("build/calendar/calendar.js", "_renderCustomRules", 391);
_yuitest_coverline("build/calendar/calendar.js", 392);
Calendar.superclass._renderCustomRules.call(this);

        _yuitest_coverline("build/calendar/calendar.js", 394);
var minDate = this.get('minimumDate'),
            maxDate = this.get('maximumDate'),
            dates = [],
            i, l,
            paneNum;

        _yuitest_coverline("build/calendar/calendar.js", 400);
if (!minDate && !maxDate) {
            _yuitest_coverline("build/calendar/calendar.js", 401);
return;
        }

        _yuitest_coverline("build/calendar/calendar.js", 404);
for (paneNum = 0; paneNum < this._paneNumber; paneNum++) {
            _yuitest_coverline("build/calendar/calendar.js", 405);
paneDate = ydate.addMonths(this.get("date"), paneNum);
            _yuitest_coverline("build/calendar/calendar.js", 406);
dates = dates.concat(ydate.listOfDatesInMonth(paneDate));
        }

        _yuitest_coverline("build/calendar/calendar.js", 409);
if (minDate) {
            _yuitest_coverline("build/calendar/calendar.js", 410);
for (i = 0, l = dates.length; i < l; i++) {
                _yuitest_coverline("build/calendar/calendar.js", 411);
if (!ydate.isGreaterOrEqual(dates[i], minDate)) {
                    _yuitest_coverline("build/calendar/calendar.js", 412);
this._disableDate(dates[i]);
                } else {
                    _yuitest_coverline("build/calendar/calendar.js", 414);
break;
                }
            }
        }

        _yuitest_coverline("build/calendar/calendar.js", 419);
if (maxDate) {
            _yuitest_coverline("build/calendar/calendar.js", 420);
for (i = dates.length - 1; i >= 0; i--) {
                _yuitest_coverline("build/calendar/calendar.js", 421);
if (ydate.isGreater(dates[i], maxDate)) {
                    _yuitest_coverline("build/calendar/calendar.js", 422);
this._disableDate(dates[i]);
                } else {
                    _yuitest_coverline("build/calendar/calendar.js", 424);
break;
                }
            }
        }
    },

    /**
     * Subtracts one month from the current calendar view.
     * @method subtractMonth
     * @return {Calendar} A reference to this object
     * @chainable
     */
    subtractMonth : function (e) {
        _yuitest_coverfunc("build/calendar/calendar.js", "subtractMonth", 436);
_yuitest_coverline("build/calendar/calendar.js", 437);
this.set("date", ydate.addMonths(this.get("date"), -1));
        _yuitest_coverline("build/calendar/calendar.js", 438);
if (e) {
            _yuitest_coverline("build/calendar/calendar.js", 439);
e.halt();
        }
        _yuitest_coverline("build/calendar/calendar.js", 441);
return this;
    },

    /**
     * Subtracts one year from the current calendar view.
     * @method subtractYear
     * @return {Calendar} A reference to this object
     * @chainable
     */
    subtractYear : function (e) {
        _yuitest_coverfunc("build/calendar/calendar.js", "subtractYear", 450);
_yuitest_coverline("build/calendar/calendar.js", 451);
this.set("date", ydate.addYears(this.get("date"), -1));
        _yuitest_coverline("build/calendar/calendar.js", 452);
if (e) {
            _yuitest_coverline("build/calendar/calendar.js", 453);
e.halt();
        }
        _yuitest_coverline("build/calendar/calendar.js", 455);
return this;
    },

    /**
     * Adds one month to the current calendar view.
     * @method addMonth
     * @return {Calendar} A reference to this object
     * @chainable
     */
    addMonth : function (e) {
        _yuitest_coverfunc("build/calendar/calendar.js", "addMonth", 464);
_yuitest_coverline("build/calendar/calendar.js", 465);
this.set("date", ydate.addMonths(this.get("date"), 1));
        _yuitest_coverline("build/calendar/calendar.js", 466);
if (e) {
            _yuitest_coverline("build/calendar/calendar.js", 467);
e.halt();
        }
        _yuitest_coverline("build/calendar/calendar.js", 469);
return this;
    },

    /**
     * Adds one year to the current calendar view.
     * @method addYear
     * @return {Calendar} A reference to this object
     * @chainable
     */
    addYear : function (e) {
        _yuitest_coverfunc("build/calendar/calendar.js", "addYear", 478);
_yuitest_coverline("build/calendar/calendar.js", 479);
this.set("date", ydate.addYears(this.get("date"), 1));
        _yuitest_coverline("build/calendar/calendar.js", 480);
if (e) {
            _yuitest_coverline("build/calendar/calendar.js", 481);
e.halt();
        }
        _yuitest_coverline("build/calendar/calendar.js", 483);
return this;
    }
}, {
    /**
    * The identity of the widget.
    *
    * @property NAME
    * @type String
    * @default 'calendar'
    * @readOnly
    * @protected
    * @static
    */
    NAME: "calendar",

    /**
    * Static property used to define the default attribute configuration of
    * the Widget.
    *
    * @property ATTRS
    * @type {Object}
    * @protected
    * @static
    */
    ATTRS: {

        /**
         * A setting specifying the type of selection the calendar allows.
         * Possible values include:
         * <ul>
         *   <li>`single` - One date at a time</li>
         *   <li>`multiple-sticky` - Multiple dates, selected one at a time (the dates "stick"). This option
         *   is appropriate for mobile devices, where function keys from the keyboard are not available.</li>
         *   <li>`multiple` - Multiple dates, selected with Ctrl/Meta keys for additional single
         *   dates, and Shift key for date ranges.</li>
         *
         * @attribute selectionMode
         * @type String
         * @default single
         */
        selectionMode: {
            value: "single"
        },

        /**
         * The date corresponding to the current calendar view. Always
         * normalized to the first of the month that contains the date
         * at assignment time. Used as the first date visible in the
         * calendar.
         *
         * @attribute date
         * @type Date
         * @default Today's date as set on the user's computer.
         */
        date: {
            value: new Date(),
            lazyAdd: false,
            setter: function (val) {

                _yuitest_coverfunc("build/calendar/calendar.js", "setter", 540);
_yuitest_coverline("build/calendar/calendar.js", 542);
var newDate    = this._normalizeDate(val),
                    newEndDate = ydate.addMonths(newDate, this._paneNumber - 1),
                    minDate    = this.get("minimumDate"),
                    maxDate    = this.get("maximumDate");

                _yuitest_coverline("build/calendar/calendar.js", 547);
if ((!minDate || ydate.isGreaterOrEqual(newDate, minDate)) &&
                    (!maxDate || ydate.isGreaterOrEqual(maxDate, newEndDate))
                ) {
                    _yuitest_coverline("build/calendar/calendar.js", 550);
return newDate;
                } else {_yuitest_coverline("build/calendar/calendar.js", 551);
if (minDate && ydate.isGreater(minDate, newDate)) {
                    _yuitest_coverline("build/calendar/calendar.js", 552);
return this._normalizeDate(minDate);
                } else {_yuitest_coverline("build/calendar/calendar.js", 553);
if (maxDate && ydate.isGreater(newEndDate, maxDate)) {
                    _yuitest_coverline("build/calendar/calendar.js", 554);
return ydate.addMonths(this._normalizeDate(maxDate), 1 - this._paneNumber);
                }}}
            }
        },

        /**
         * Unless minimumDate is null, it will not be possible to display and select dates earlier than this one.
         *
         * @attribute minimumDate
         * @type Date
         * @default null
         */
        minimumDate: {
            value: null,
            setter: function (val) {
                _yuitest_coverfunc("build/calendar/calendar.js", "setter", 568);
_yuitest_coverline("build/calendar/calendar.js", 569);
if (Y.Lang.isDate(val)) {
                    _yuitest_coverline("build/calendar/calendar.js", 570);
var curDate = this.get('date'),
                        newMin  = this._normalizeTime(val);
                    _yuitest_coverline("build/calendar/calendar.js", 572);
if (curDate && !ydate.isGreaterOrEqual(curDate, newMin)) {
                        _yuitest_coverline("build/calendar/calendar.js", 573);
this.set('date', val);
                    }
                    _yuitest_coverline("build/calendar/calendar.js", 575);
return newMin;
                } else {
                    _yuitest_coverline("build/calendar/calendar.js", 577);
return null;
                }
            }
        },

        /**
         * Unless maximumDate is null, it will not be possible to display and select dates later than this one.
         *
         * @attribute maximumDate
         * @type Date
         * @default null
         */
        maximumDate: {
            value: null,
            setter: function (val) {
                _yuitest_coverfunc("build/calendar/calendar.js", "setter", 591);
_yuitest_coverline("build/calendar/calendar.js", 592);
if (Y.Lang.isDate(val)) {
                    _yuitest_coverline("build/calendar/calendar.js", 593);
var curDate = this.get('date');

                    _yuitest_coverline("build/calendar/calendar.js", 595);
if (curDate && !ydate.isGreaterOrEqual(val, ydate.addMonths(curDate, this._paneNumber - 1))) {
                        _yuitest_coverline("build/calendar/calendar.js", 596);
this.set('date', ydate.addMonths(this._normalizeDate(val), 1 - this._paneNumber));
                    }

                    _yuitest_coverline("build/calendar/calendar.js", 599);
return this._normalizeTime(val);
                } else {
                    _yuitest_coverline("build/calendar/calendar.js", 601);
return null;
                }
            }
        }
    }
});

}, '@VERSION@', {
    "requires": [
        "calendar-base",
        "calendarnavigator"
    ],
    "lang": [
        "de",
        "en",
        "es",
        "es-AR",
        "fr",
        "hu",
        "it",
        "ja",
        "nb-NO",
        "nl",
        "pt-BR",
        "ru",
        "zh-HANT-TW"
    ],
    "skinnable": true
});
