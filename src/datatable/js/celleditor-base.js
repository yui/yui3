/**
Provides the base services for cell editors. This class is meant to be subclassed
by actual implementations of cell editors
@module datatable
@submodule datatable-celleditor-base
*/

/*jshint onevar:false*/
var returnUnchanged = function (value) {
        Y.log('(private) returnUnchanged: ' + value);
        return value;
    },

/**
@class DataTable.BaseCellEditor
@extends Y.View
@author Todd Smith
@since 3.8.0
*/

BCE =  Y.Base.create('celleditor', Y.View, [], {

/*jshint onevar:true*/

    /**
    Array of generic event listener handles created by this class to be
    detached on destruction.

    @property _subscr
    @type [EventHandles]
    @default null
    @protected
    */
    _subscr:        null,



    /**
    Copy of the [formatter](#attr_formatter) attribute for internal use.
    @method _formatter
    @type Function
    @default (returns value unchanged)
    @private
    */
   _formatter: returnUnchanged,

    /**
    Copy of the [parser](#attr_parser) attribute for internal use.
    @method _parser
    @type Function
    @default (returns value unchanged)
    @private
    */
   _parser: returnUnchanged,

   /**
    Collection of information related to the cell being edited.
    It is used mostly to provide context information when firing events.
    @property _cellInfo
    @type Object
    @default null
    @private
    */
   _cellInfo: null,

   /**
   CSS class name to add to an input box when it fails validation.
   @property _classError
   @type String
   @default "yui3-datatable-celleditor-error"
   @private
   */
   _classError: 'yui3-datatable-celleditor-error',

    /**
    Disallow ad-hoc attributes

    @property _allowAdHocAttrs {Boolean}
    @default false
    @protected
     */
    _allowAdHocAttrs: false,

    /**
    Creates the View instance and sets the container and bindings

    @method initializer
    @protected
    */
    initializer: function () {
        Y.log('DataTable.BaseCellEditor.initializer');
        this._subscr = [];
        this.publish({
            /**
            Event fired when the inline editor has been initialized and is ready for use.

            @event render
            */
            render: {
                defaultFn: this._defRenderFn
            },

            /**
            Event fired when the cell editor is displayed and becomes visible.
            @event show
            @param ev {EventFacade} Event Facade including:
            @param ev.td {Node} The TD Node that was edited
            @param ev.record {Model} Model instance of the record data for the edited cell
            @param ev.colKey {String} Column key (or name) of the edited cell
            @param ev.initialValue {Any} The original value of the underlying data for the cell
            @param ev.inputNode {Node} The editor's INPUT / TEXTAREA Node
            @param ev.formattedValue {String} The value as shown to the user.
            */

            show: {
                defaultFn: this._defShowFn
            },

            /**
            Event that is fired when the user has finished editing the View's cell contents

            @event save
            @param ev {Object} Event facade, including:
            @param ev.td {Node} The TD Node that was edited
            @param ev.record {Model} Model instance of the record data for the edited cell
            @param ev.colKey {String} Column key (or name) of the edited cell
            @param ev.initialValue {Any} The original value of the underlying data for the cell
            @param ev.formattedValue {Any} Data value as entered by the user
            @param ev.newValue {Any} Parsed value ready to be saved
            */
            save: {
                defaultFn: this._defSaveFn
            },

            /**
            Fired when editing is cancelled (without saving) on this cell editor.

            @event cancel
            @param ev {Object}  Event facade, including:
            @param ev.td {Node} The TD Node that was edited
            @param ev.record {Model} Model instance of the record data for the edited cell
            @param ev.colKey {String} Column key (or name) of the edited cell
            @param ev.initialValue {Any} The original value of the underlying data for the cell
            */
            cancel: {
                defaultFn: this._defCancelFn
            }
        });

    },

    /**
    @method destructor
    @protected
    */
    destructor: function () {
        Y.log('DataTable.BaseCellEditor.destructor');
        if (this.get('active')) {
            this.cancelEditor();
        }
        this._unbindUI();
        this._destroyContainer();
    },

    /**
    Renders the editor and binds several event listeners.
    Developers writing specific cell editors should not override this method
    but [_defRenderFn](#method__defRenderFn) instead.

    @method render
    @param where {Node} Container where the editor should be rendered into.
    @chainable
    */
    render: function (where) {
        Y.log('DataTable.BaseCellEditor.render');
        where.append(this.get('container'));
        this.fire('render');
        this._bindUI();
        return this;
    },

    /**
    It should insert the HTML for this editor into the container.
    The default implementation does nothing.

    It must be defined by the subclass.

    @method _defRenderFn
    @protected
    */
    _defRenderFn: function () {
        Y.log('DataTable.BaseCellEditor._defRenderFn');

    },

    /**
    Sets the event listeners.

    @method _bindUI
    @protected
    */
    _bindUI: function () {
        Y.log('DataTable.BaseCellEditor._bindUI');


        this._subscr = [
            // This is here to support "scrolling" of the underlying DT ...
            this.after('visibleChange', this._afterVisibleChange)
        ];

    },

    /**
    Detaches all event listeners.

    @method _unbindUI
    @protected
    */
    _unbindUI: function () {
        Y.log('DataTable.BaseCellEditor._unbindUI');
        arrEach(this._subscr, function(e){
            if(e && e.detach) {
                e.detach();
            }
        });
        this._subscr = null;
    },

    /**
    The default action for the [save](#event_save) event.

    @method _defSaveFn
    @param e {EventFacade} For [save](#event_save) event
    @protected
    */
    _defSaveFn: function (e) {
        Y.log('DataTable.BaseCellEditor._defSaveFn');
        this.set('value', e.newValue);
        this._hideEditor();
    },

    /**
    The default action for the [cancel](#event_cancel) event.

    @method _defCancelFn
    @protected
    */
    _defCancelFn: function () {
        Y.log('DataTable.BaseCellEditor._defCancelFn');
        this._hideEditor();
    },

    /**
    The default action for the [show](#event_show) event which should make the editor visible.


    @method _defShowFn
    @param e {EventFacade} for the [show](#event_show) event.
    @protected
    */
    _defShowFn: function () {
        Y.log('DataTable.BaseCellEditor._defShowFn');

        this.set('visible', true);

        this.move();

        this._set('active', true);
    },


    /**
    Displays, positions and resizes the cell editor over the edited TD element.

    Sets the initial value after formatting.

    @method showEditor
    @param cellInfo {Object} Information about the cell that is to be edited, including:
    @param cellInfo.td {Node} Reference to the table cell
    @param cellInfo.record {Model} Reference to the model containing the underlying data
    @param cellInfo.colKey {String} Key of the column for the cell to be edited
    @param cellInfo.initialValue {Any} The underlying value of the cell to be edited
    @public
    */
    showEditor: function (cellInfo) {
        Y.log('DataTable.BaseCellEditor.showEditor');

        this._cellInfo = cellInfo;

        var value  = cellInfo.initialValue;

        this.set('value', value);

        value = this._formatter(value);

        this.fire('show', Y.merge(cellInfo, {
            formattedValue: value
        }));

    },

    /**
    Returns the raw value as entered into the editor.
    To be implemented by each editor.

    @method _getValue
    @return value {mixed} Value as entered in the editor
    @protected
     */
    _getValue: function () {
        Y.log('DataTable.BaseCellEditor._getValue');
    },

    /**
    Saves the value provided after validating and parsing it.

    @method saveEditor
    @param [value] {Any} Raw value (not yet parsed) to be saved.
            If missing, [_getValue](#method__getValue) is used.
    @public
    */
    saveEditor: function (value) {

        if (value === undefined) {
            value = this._getValue();
        }
        //
        //  Only save the edited data if it is valid ...
        //
        var validator = this.get('validator'),
            parsedValue;

        Y.log('DataTable.BaseCellEditor.saveEditor: ' + value);

        if (validator instanceof RegExp ? validator.test(value) : true) {

            // If a "save" function was defined, run thru it and update the "value" setting
            parsedValue = this._parser(value);

            // So value was initially okay, but didn't pass _parser validation call ...
            if (parsedValue !== Y.Attribute.INVALID_VALUE) {

                this.fire("save", Y.merge(this._cellInfo, {
                    formattedValue:   value,
                    newValue:   parsedValue
                }));
                return;
            }
        }
        // If everything was Ok, it should have returned earlier.
        // If it got here, things went wrong
        this.get('container').addClass(this._classError);

    },

    /**
    Hides the current editor View instance.
    @method _hideEditor
    @protected
    */
    _hideEditor: function () {
        Y.log('DataTable.BaseCellEditor._hideEditor');
        this.set('visible', false);
        this.get('container').removeClass(this._classError);

        this._cellInfo = null;
        this._set('active', false);
    },


    /**
    Called when the user has requested to cancel and abort any changes to the DT cell,
    usually signified by a keyboard ESC or "Cancel" button, etc..

    @method cancelEditor
    @public
    */
    cancelEditor: function () {
        Y.log('DataTable.BaseCellEditor.cancelEditor');

        this.fire("cancel", this._cellInfo);
    },



    /**
    Event listener for the [xy](#attr_xy) change event.
    It can be used to quickly reset the cell editor's position,
    used for scrollable DataTables.

    To be implemented by the subclasses.

    @method move
    @param e {EventFacade} Standard attribute change event facade
    @protected
    */
    move: function() {
        Y.log('DataTable.BaseCellEditor.move');
    },

    /**
    Responds to changes in the [visible](#attr_visible) attribute by showing/hiding the
    cell editor

    @method _afterVisibleChange
    @param e {EventFacade} Standard Attribute change event facade
    @private
    */
   _afterVisibleChange: function (e) {
        Y.log('DataTable.BaseCellEditor._afterVisibleChange: ' + e.newVal);

        var container  = this.get('container');
        if(container) {
            if (e.newVal) {
                container.show();
            } else {
                container.hide();
            }
        }
   }
},{
    ATTRS:{

        /**
        Value being edited.  It should be a copy of the value stored in the record.

        @attribute value
        @type Any
        @default null
        */
        value: {
            value:  null
        },


        /**
        Function to execute on the [value](#attr_value) just prior to displaying in the
        editor's input element.
        (i.e. typically used for pre-formatting Date information from JS to mm/dd/YYYY format)

        This function will receive the value from the record as its only argument
        and should return the formatted version to be shown to the user.

        @attribute formatter
        @type Function || null
        @default null
        */
        formatter: {
            value: returnUnchanged,
            lazyAdd: false,
            setter: function (formatter) {
                this._formatter =  (typeof formatter === 'function') ? formatter : returnUnchanged;
                return formatter;
            }
        },

        /**
        Function to execute prior to saving the data to the record (Model).

        This function will receive the raw value from the INPUT element as
        its only argument and should return the value to be stored in the record.

        This method can also be used for input validation prior to saving.
        If the returned value is `Y.Attribute.INVALID_VALUE` saving will be prevented.

        @attribute parser
        @type Function
        @default null
        */
        parser:{
            value: returnUnchanged,
            lazyAdd: false,
            setter: function (parser) {
                this._parser =  (typeof parser === 'function') ? parser : returnUnchanged;
                return parser;
            }
        },


        /**
        Signals whether the editor is open and active.

        @attribute active
        @type Boolean
        @default false
        @readOnly
        */
        active: {
            value:      false,
            readOnly:   true,
            validator:  Lang.isBoolean
        },

        /**
        Determines whether the cell editor is visible.

        The cell editor might be [active](#attr_active) but it might have scrolled off the
        visible area of an scrolling datatable hence turning invisible.

        @attribute visible
        @type Boolean
        @default false
        */
        visible: {
            value: false,
            validator: Lang.isBoolean
        },


        /**
        Provides the capability to validate the final value to be saved after editing is finished.
        This attribute can be a RegEx that operates on the entire
        `value` setting of the editor input element.

        Further validation can be provided by the method set in the [parser](#attr_parser)
        attribute.
        //TODO: shouldn't they be enclosed in between $ and ^ ?

        @example
             /\d/            // for numeric digit-only input
             /\d|\-|\.|\+/   // for floating point numeric input
             /\d|\//         // for Date field entry in MM/DD/YYYY format

        @attribute validator
        @type RegExp
        @default null
        */
        validator: {
            value:      null
        },

        /**
        A flag to signify whether the editor View should be "saved" upon detecting the Enter keystroke
        within the INPUT area.

        For example, textarea typically will not, to allow a newline to be added.

        @attribute saveOnEnterKey
        @type boolean
        @default true
        */
        saveOnEnterKey: {
            value:      true,
            validator:  Lang.isBoolean
        },
        /**
        A flag to indicate if cell-to-cell navigation should be implemented (currently setup for CTRL-arrow
        key, TAB and Shift-TAB) capability
        @attribute navigationEnabled
        @type Boolean
        @default true
        */
        navigationEnabled:{
            value:      true,
            validator:  Lang.isBoolean
        }


    }



});
Y.DataTable.BaseCellEditor = BCE;