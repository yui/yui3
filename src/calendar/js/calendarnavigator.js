/**
 * Provides a plugin which adds navigation controls to Calendar.
 *
 * @module calendarnavigator
 */
var CONTENT_BOX = "contentBox",
    HOST        = "host",
    getCN       = Y.ClassNameManager.getClassName,
    substitute  = Y.Lang.sub,
    node        = Y.Node,
    create      = node.create,
    CALENDAR    = 'calendar',
    CALENDARNAV = 'calendarnav',
    CAL_HD      = getCN(CALENDAR, 'header'),
    CAL_PREV_M  = getCN(CALENDARNAV, 'prevmonth'),
    CAL_NEXT_M  = getCN(CALENDARNAV, 'nextmonth'),
    CAL_DIS_M   = getCN(CALENDARNAV, 'month-disabled'),
    ydate       = Y.DataType.Date;
/**
 * A plugin class which adds navigation controls to Calendar.
 *
 * @class CalendarNavigator
 * @extends Plugin.Base
 * @namespace Plugin
 */
function CalendarNavigator() {
    CalendarNavigator.superclass.constructor.apply(this, arguments);
}

/**
 * The namespace for the plugin. This will be the property on the widget, which will
 * reference the plugin instance, when it's plugged in.
 *
 * @property NS
 * @static
 * @type String
 * @default "navigator"
 */
CalendarNavigator.NS = "navigator";

/**
 * The NAME of the CalendarNavigator class. Used to prefix events generated
 * by the plugin class.
 *
 * @property NAME
 * @static
 * @type String
 * @default "pluginCalendarNavigator"
 */
CalendarNavigator.NAME = "pluginCalendarNavigator";


/**
 * Static property used to define the default attribute
 * configuration for the plugin.
 *
 * @property ATTRS
 * @type Object
 * @static
 */
CalendarNavigator.ATTRS = {

    /**
     * The number of months to shift by when the control arrows are clicked.
     *
     * @attribute shiftByMonths
     * @type Number
     * @default 1 (months)
     */
    shiftByMonths : {
        value: 1
    }
};

   /**
    * The CSS classnames for the calendar navigator controls.
    * @property CALENDARNAV_STRINGS
    * @type Object
    * @readOnly
    * @protected
    * @static
    */
CalendarNavigator.CALENDARNAV_STRINGS = {
   prev_month_class: CAL_PREV_M,
   next_month_class: CAL_NEXT_M
};

   /**
    * The template for the calendar navigator previous month control.
    * @property PREV_MONTH_CONTROL_TEMPLATE
    * @type String
    * @protected
    * @static
    */
CalendarNavigator.PREV_MONTH_CONTROL_TEMPLATE = '<a class="yui3-u {prev_month_class}" role="button" aria-label="{prev_month_arialabel}" ' +
                                                    'tabindex="{control_tabindex}">' +
                                                    "<span>&lt;</span>" +
                                                '</a>';
   /**
    * The template for the calendar navigator next month control.
    * @property NEXT_MONTH_CONTROL_TEMPLATE
    * @type String
    * @readOnly
    * @protected
    * @static
    */
CalendarNavigator.NEXT_MONTH_CONTROL_TEMPLATE = '<a class="yui3-u {next_month_class}" role="button" aria-label="{next_month_arialabel}" ' +
                                                    'tabindex="{control_tabindex}">' +
                                                    "<span>&gt;</span>" +
                                                '</a>';


Y.extend(CalendarNavigator, Y.Plugin.Base, {

    _eventAttachments : {},
    _controls: {},

    /**
     * The initializer lifecycle implementation. Modifies the host widget's
     * render to add navigation controls.
     *
     * @method initializer
     */
    initializer : function() {

        // After the host has rendered its UI, place the navigation cotnrols
        this._controls = {};
        this._eventAttachments = {};

        this.afterHostMethod("renderUI", this._initNavigationControls);
    },

    /**
     * The initializer destructor implementation. Responsible for destroying the initialized
     * control mechanisms.
     *
     * @method destructor
     */
    destructor : function() {

    },

    /**
     * Private utility method that focuses on a navigation button when it is clicked
     * or pressed with a keyboard.
     *
     * @method _focusNavigation
     * @param {Event} ev Click or keydown event from the controls
     * @protected
     */
    _focusNavigation : function (ev) {
        ev.currentTarget.focus();
    },

    /**
     * Private utility method that subtracts months from the host calendar date
     * based on the control click and the shiftByMonths property.
     *
     * @method _subtractMonths
     * @param {Event} ev Click event from the controls
     * @protected
     */
    _subtractMonths : function (ev) {
        if ( (ev.type === "click") || (ev.type === "keydown" && (ev.keyCode === 13 || ev.keyCode === 32)) ) {
            var host = this.get(HOST),
                oldDate = host.get("date");
            host.set("date", ydate.addMonths(oldDate, -1*this.get("shiftByMonths")));
            ev.preventDefault();
        }
    },

    /**
     * Private utility method that adds months to the host calendar date
     * based on the control click and the shiftByMonths property.
     *
     * @method _addMonths
     * @param {Event} ev Click event from the controls
     * @protected
     */
    _addMonths : function (ev) {
        if ( (ev.type === "click") || (ev.type === "keydown" && (ev.keyCode === 13 || ev.keyCode === 32)) ) {
            var host = this.get(HOST),
                oldDate = host.get("date");
            host.set("date", ydate.addMonths(oldDate, this.get("shiftByMonths")));
            ev.preventDefault();
        }
    },


    _updateControlState : function () {

        var host      = this.get(HOST),
            startDate = host.get('date'),
            endDate   = ydate.addMonths(startDate, host._paneNumber - 1),
            minDate   = host._normalizeDate(host.get("minimumDate")),
            maxDate   = host._normalizeDate(host.get("maximumDate"));

        if (ydate.areEqual(minDate, startDate)) {
            if (this._eventAttachments.prevMonth) {
                this._eventAttachments.prevMonth.detach();
                this._eventAttachments.prevMonth = false;
            }

            if (!this._controls.prevMonth.hasClass(CAL_DIS_M)) {
                this._controls.prevMonth.addClass(CAL_DIS_M).setAttribute("aria-disabled", "true");
            }
        }
        else {
            if (!this._eventAttachments.prevMonth) {
            this._eventAttachments.prevMonth = this._controls.prevMonth.on(["click", "keydown"], this._subtractMonths, this);
            }
            if (this._controls.prevMonth.hasClass(CAL_DIS_M)) {
              this._controls.prevMonth.removeClass(CAL_DIS_M).setAttribute("aria-disabled", "false");
            }
        }

        if (ydate.areEqual(maxDate, endDate)) {
            if (this._eventAttachments.nextMonth) {
                this._eventAttachments.nextMonth.detach();
                this._eventAttachments.nextMonth = false;
            }

            if (!this._controls.nextMonth.hasClass(CAL_DIS_M)) {
                this._controls.nextMonth.addClass(CAL_DIS_M).setAttribute("aria-disabled", "true");
            }
        }
        else {
            if (!this._eventAttachments.nextMonth) {
            this._eventAttachments.nextMonth = this._controls.nextMonth.on(["click", "keydown"], this._addMonths, this);
            }
            if (this._controls.nextMonth.hasClass(CAL_DIS_M)) {
              this._controls.nextMonth.removeClass(CAL_DIS_M).setAttribute("aria-disabled", "false");
            }
        }

        this._controls.prevMonth.on(["click", "keydown"], this._focusNavigation, this);
        this._controls.nextMonth.on(["click", "keydown"], this._focusNavigation, this);
    },




    /**
     * Private render assist method that renders the previous month control
     *
     * @method _renderPrevControls
     * @private
     */
    _renderPrevControls : function () {
      var prevControlNode = create(substitute (CalendarNavigator.PREV_MONTH_CONTROL_TEMPLATE,
                               CalendarNavigator.CALENDARNAV_STRINGS));
      prevControlNode.on("selectstart", this.get(HOST)._preventSelectionStart);

      return prevControlNode;
    },

    /**
     * Private render assist method that renders the next month control
     *
     * @method _renderNextControls
     * @private
     */
    _renderNextControls : function () {
      var nextControlNode = create(substitute (CalendarNavigator.NEXT_MONTH_CONTROL_TEMPLATE,
                               CalendarNavigator.CALENDARNAV_STRINGS));
      nextControlNode.on("selectstart", this.get(HOST)._preventSelectionStart);

      return nextControlNode;
    },

    /**
     * Protected render assist method that initialized and renders the navigation controls.
     * @method _initNavigationControls
     * @protected
     */
    _initNavigationControls : function() {
        var host = this.get(HOST),
            headerCell = host.get(CONTENT_BOX).one("." + CAL_HD);

        CalendarNavigator.CALENDARNAV_STRINGS.control_tabindex = host.get("tabIndex");
        CalendarNavigator.CALENDARNAV_STRINGS.prev_month_arialabel = "Go to previous month";
        CalendarNavigator.CALENDARNAV_STRINGS.next_month_arialabel = "Go to next month";

        this._controls.prevMonth = this._renderPrevControls();
        this._controls.nextMonth = this._renderNextControls();

        this._updateControlState();

        host.after(["dateChange", "minimumDateChange", "maximumDateChange"], this._updateControlState, this);

        headerCell.prepend(this._controls.prevMonth);
        headerCell.append(this._controls.nextMonth);
    }
});

Y.namespace("Plugin").CalendarNavigator = CalendarNavigator;
