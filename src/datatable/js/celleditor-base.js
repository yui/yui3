/**
Provides the base services for cell editors. This class is meant to be subclassed
by actual implementations of cell editors
@module datatable
@submodule datatable-celleditor-base
*/

/**
@class DataTable.BaseCellEditor
@extends Y.View
@author Todd Smith
@since 3.8.0
*/

Y.DataTable.BaseCellEditor =  Y.Base.create('celleditor', Y.View, [], {
    /**
    Defines the INPUT HTML content "template" for the editor's View container.

    To be defined by the subclass.

    @property template
    @type String
    @default ''
    */
    template: '',

    /**
    Placeholder for the created INPUT Node created within the View container.

    @property _inputNode
    @type Node
    @default null
    @protected
    */
    _inputNode: false,

    /**
    Placeholder for listener handles created from this View.

    @property _subscr
    @type Array of EventHandles
    @default null
    @protected
    */
    _subscr:        null,

    /**
    CSS classname to identify the individual input collection HTML nodes within
    the View container

    @property _classEditing
    @type String
    @default 'editing'
    @protected
    */
    _classEditing:  'editing',

    /**
    Copy of the formatter attribute for internal use.
    @method _formatter
    @type Function
    @default (returns value unchanged)
    @private
    */
   _formatter: returnUnchanged,

    /**
    Copy of the parser attribute for internal use.
    @method _parser
    @type Function
    @default (returns value unchanged)
    @private
    */
   _parser: returnUnchanged,

//======================   LIFECYCLE METHODS   ===========================

    /**
    Creates the View instance and sets the container and bindings

    @method initializer
    @chainable
    @protected
    */
    initializer: function () {
        Y.log('DataTable.BaseCellEditor.initializer');
        this.publish({
            /**
            Event fired when the inline editor has been initialized and ready for usage.

            This event can be listened to in order to add additional content or widgets, etc onto
            the View's container.

            @event render
            @param config {Object} The configuration object as received by the `initializer`
            */
            render: {
                defaultFn: this._defRenderFn
            },

            /**
            Event fired when the cell editor is displayed and becomes visible.

            Implementers may listen for this event if they have configured complex View's, that include
            other widgets or components, to update their UI upon displaying of the view.

            @event show
            @param {Object} rtn Returned object
              @param {Node} rtn.td TD Node instance of the calling editor
              @param {Node} rtn.inputNode The editor's INPUT / TEXTAREA Node
              @param {String|Number|Date} rtn.value The current "value" setting
              @param {Object} rtn.cell object
            */

            show: {
                defaultFn: this._defShowFn
            },

            /**
            Event that is fired when the user has finished editing the View's cell contents (signified by either
            a keyboard RTN entry or "Save" button, etc...).

            This event is intended to be the PRIMARY means for implementers to know that the editing has been
            completed and validated.  Consumers (i.e. DataTable) should listen to this event and process it's results
            to save to the Model and or dataset for the DT.

            @event save
            @param {Object} rtn Returned object
              @param {Node} rtn.td TD Node for the edited cell
              @param {Object} rtn.cell Current cell object
              @param {String|Number|Date} rtn.oldValue Data value of this cell prior to editing
              @param {String|Number|Date} rtn.newValue Data value of this cell after editing
            */
            save: {
                defaultFn: this._defSaveFn
            },

            /**
            Fired when editing is cancelled (without saving) on this cell editor.

            @event cancel
            @param {Object} rtn Returned object
              @param {Node} rtn.td TD Node for the edited cell
              @param {Object} rtn.cell Current cell object
              @param {String|Number|Date} rtn.oldValue Data value of this cell prior to editing
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
        this.cancelEditor();
        this._unbindUI();
        this._destroyContainer();
    },

    /**
    @method render
    */
    render: function () {
        Y.log('DataTable.BaseCellEditor.render');
        this.fire('render');
        this._bindUI();
        return this;
    },

    /**
    Processes the initial container for this View, sets up the HTML content
    and creates a listener for positioning changes.

    To be defined by the subclass.

    @method _defRenderFn
    @private
    */
    _defRenderFn: function () {
        Y.log('DataTable.BaseCellEditor._defRenderFn');

    },

    /**
    Adds a listener to this editor instance to reposition based on "xy" attribute changes.

    @method _bindUI
    @private
    */
    _bindUI: function () {
        Y.log('DataTable.BaseCellEditor._bindUI');


        this._subscr = [
            // This is here to support "scrolling" of the underlying DT ...
            this.on('xyChange',this._setEditorXY),

            this._inputNode.on('keydown',    this.processKeyDown, this),
            this._inputNode.on('keypress',   this.processKeyPress, this),
            this._inputNode.on('click',      this._onClick, this)
        ];
    },

    /**
    Detaches any listener handles created by this view.

    @method _unbindUI
    @private
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
    The default action for the `save` event.

    @method _defSaveFn
    @param e {EventFacade} For save event
    @protected
    */
    _defSaveFn: function (e) {
        Y.log('DataTable.BaseCellEditor._defSaveFn');
        this.set('value', e.newValue);
        this.hideEditor();
    },

    /**
    The default action for the `cancel` event.

    @method _defCancelFn
    @protected
    */
    _defCancelFn: function () {
        Y.log('DataTable.BaseCellEditor._defCancelFn');
        this.hideEditor();
    },

    /**
    The default action for the `show` event which should make the editor visible.

    It should be defined by each class of cell editor.

    @method _defShowFn
    @param e {EventFacade}
    @protected
    */
    _defShowFn: function (e) {
        Y.log('DataTable.BaseCellEditor._defShowFn');
        var value = e.value;

        e.td.addClass(this._classEditing);
        // focus the inner INPUT ...
        this._inputNode.focus();
        // set the INPUT value
        this._inputNode.set('value',value);
        this.set('lastValue',value);

        this._set('visible',true);
        this._set('hidden',false);
    },

    //======================   PUBLIC METHODS   ===========================

    /**
    Displays the inline cell editor and positions / resizes the INPUT to
    overlay the edited TD element.

    Set the initial value for the INPUT element, after preprocessing (if reqd)

    @method showEditor
    @param {Node} td The Node instance of the TD to begin editing on
    @public
    */
    showEditor: function (td) {
        Y.log('DataTable.BaseCellEditor.showEditor');
        var cell = this.get('cell'),
            value  = this.get('value');


        value = this._formatter(value);

        this.fire('show',{
            td:         td,
            cell:       cell,
            inputNode:  this._inputNode,
            value:      value
        });

    },
    /**
    Saves the View's `value` setting (usually after keyboard RTN or other means) and fires the
    [save](#event_editorSave) event so consumers (i.e. DataTable) can make final changes to the
    Model or dataset.

    @method saveEditor
    @param value {String|Number|Date} Raw value setting to be saved after editing
    @public
    */
    saveEditor: function (value) {
        Y.log('DataTable.BaseCellEditor.saveEditor: ' + value);

        //
        //  Only save the edited data if it is valid ...
        //
        if(Lang.isValue(value)){

            // If a "save" function was defined, run thru it and update the "value" setting
            value = this._parser(value);

            // So value was initially okay, but didn't pass _parser validation call ...
            if (value === undefined) {
                this.cancelEditor();
                return;
            }

            this.fire("save", {
                td:         this.get('cell').td,
                cell:       this.get('cell'),
                oldValue:   this.get('lastValue'),
                newValue:   value
            });
        }
    },

    /**
    Hides the current editor View instance.  If the optional `hideMe` param is true this View will
    be temporarily "hidden" (used for scrolling DT's when the TD is scrolled off/on to the page)

    @method hideEditor
    @public
    */
    hideEditor: function (hideMe) {
        Y.log('DataTable.BaseCellEditor.hideEditor: ' + hideMe);
        var cont  = this.get('container'),
            cell = this.get('cell');
        if(cont && cont.hide) {
            cont.hide();
        }

        if(cell && cell.td) {
            cell.td.removeClass(this._classEditing);
        }

        if(hideMe) {
            this._set('hidden',true);
        }
        this._set('visible',false);

    },


    /**
    Called when the user has requested to cancel, and abort any changes to the DT cell,
    usually signified by a keyboard ESC or "Cancel" button, etc..

    @method cancelEditor
    @public
    */
    cancelEditor: function () {
        Y.log('DataTable.BaseCellEditor.cancelEditor');

        this.fire("cancel",{
            cell:       this.get('cell'),
            td:         this.get('cell').td,
            oldValue:   this.get('lastValue')
        });
    },

    /**
    Provides a method to process keypress entries and validate or prevent invalid inputs.
    This method is meant to be overrideable by implementers to customize behaviors.

    @method processKeyPress
    @param e {EventFacade} Key press event object
    @public
    */
    processKeyPress: function (e) {
        Y.log('DataTable.BaseCellEditor.processKeyPress');
        var keyc    = e.keyCode,
            inp     = e.target || this._inputNode,
            value   = inp.get('value'),
            keyfilt = this.get('keyFiltering'),
         //   keyvald = this.get('keyValidator'),
            kchar   = String.fromCharCode(keyc),
            flagRE  = true,
            krtn;

        //
        // If RTN, then prevent and save ...
        //
        if(keyc === KEYC_RTN && this.get('saveOnEnterKey')) {
            e.preventDefault();
            this.saveEditor(value);
            return;
        }

        //
        // Check key filtering validation ... either a RegExp or a user-function
        //
        if(keyfilt instanceof RegExp) {
            flagRE = (!kchar.match(keyfilt)) ? false : flagRE;
        } else if (Lang.isFunction(keyfilt)) {
            krtn = keyfilt.call(this,e);
            flagRE = (krtn) ? true : false;
        }

        // If key filtering returned false, prevent continuing
        if(!flagRE) {
            e.preventDefault();
        }

    },

    /**
    Key listener for the INPUT inline editor, "keydown" is checked for non-printing key
    strokes, navigation or ESC.

    This method is intended to overridden by implementers in order to customize behaviors.

    @method processKeyDown
    @param e {EventFacade} Keydown event facade
    @public
    */
    /**
    Fires when the navigation keys are pressed to move to another cell.
    @event keyNav
    @param dx {Integer} number of cells to move in the x direction. (usually -1: left, 0 or 1: right)
    @param dy {Integer} number of cells to move in the y direction. (usually -1: up, 0 or 1: down)
    */
    processKeyDown : function(e){
        Y.log('DataTable.BaseCellEditor.processKeyDown');
        var keyc    = e.keyCode,
            dx = 0, dy = 0;

        if (keyc === KEYC_ESC) {
            e.preventDefault();
            this.cancelEditor();
        }
        if(!this.get('inputKeys')) {
            return;
        }

        switch(keyc) {
            case KEYC_UP:
                dy = (e.ctrlKey) ? -1 : 0;
                break;

            case KEYC_DOWN:
                dy = (e.ctrlKey) ? 1 : 0;
                break;

            case KEYC_LEFT:
                dx = (e.ctrlKey) ? -1 : 0;
                break;

            case KEYC_RIGHT:
                dx = (e.ctrlKey) ? 1 : 0;
                break;

            case KEYC_TAB: // tab
                dx = (e.shiftKey) ? -1 : 1;
                break;
        }

        if(dx || dy) {
            this.fire('keyNav', {dx:dx, dy:dy});
            e.preventDefault();
        }
    },

//======================   PRIVATE METHODS   ===========================

    /**
    Listener to INPUT "click" events that will stop bubbling to the DT TD listener,
    to prevent closing editing while clicking within an INPUT.

    @method _onClick
    @param e {EventFacade}
    @private
    */
    _onClick: function(e) {
        Y.log('DataTable.BaseCellEditor._onClick');
        e.stopPropagation();
    },

    /**
    This method can be used to quickly reset the current View editor's position,
    used for scrollable DataTables.

    To be implemented by the subclasses.

    NOTE: Scrollable inline editing is a little "rough" right now

    @method _setEditorXY
    @param e {EventFacade} The xy attribute change event facade
    @private
    */
    _setEditorXY: function() {
        Y.log('DataTable.BaseCellEditor._setEditorXY');
    }
},{
    ATTRS:{

        /**
        Name for this View instance

        @attribute name
        @type String
        @default null
        */
        name :{
            value:      null,
            validator:  Lang.isString
        },
        /**
        Value that was saved in the Editor View and returned to the record

        @attribute value
        @type {String|Number|Date}
        @default null
        */
        value: {
            value:  null
        },

        /**
        Value that was contained in the cell when the Editor View was displayed

        @attribute lastValue
        @type {String|Number|Date}
        @default null
        */
        lastValue:{
            value:  null
        },

        /**
        Function to execute on the "data" contents just prior to displaying in the Editor's main view
        (i.e. typically used for pre-formatting Date information from JS to mm/dd/YYYY format)

        This function will receive one argument "value" which is the data value from the record, and
        the function runs in Editor scope.

        @attribute formatter
        @type Function
        @default null
        */
        formatter: {
            value: returnUnchanged,
            lazyAdd: false,
            setter: function (formatter) {
                this._formatter =  (typeof formatter === 'function') ? formatter : returnUnchanged;
            }
        },

        /**
        Function to execute when Editing is complete, prior to "saving" the data to the Record (Model)
        This function will receive one argument "value" which is the data value from the INPUT and within
        the scope of the current View instances.

        This method is intended to be used for input validation prior to saving.  **If the returned value
        is "undefined" the cancelEditor method is executed.**

        @attribute parser
        @type Function
        @default null
        */
        parser:{
            value: returnUnchanged,
            lazyAdd: false,
            setter: function (parser) {
                this._parser =  (typeof parser === 'function') ? parser : returnUnchanged;
            }
        },

        /**
        Setting for checking the visibility status of this Editor.

        @attribute visible
        @type Boolean
        @default false
        @readOnly
        */
        visible: {
            value:      false,
            readOnly:   true,
            validator:  Lang.isBoolean
        },

        /**
        Setting to check if the editor is "still open" but just hidden, created in order to support
        scrolling datatables when an editor scrolls out of open window.

        @attribute hidden
        @type Boolean
        @default false
        @readOnly
        */
        hidden: {
            value:      false,
            readOnly:   true,
            validator:  Lang.isBoolean
        },

        /**
        XY coordinate position of the editor View container (INPUT).

        @attribute xy
        @type Array
        @default null
        */
        xy : {
            value:      null,
            validator:  Lang.isArray
        },

        /**
        Provides a keystroke filtering capability to restrict input into the editing area checked during the
        "keypress" event.  This attribute is set to either a RegEx or a function that confirms if the keystroke
        was valid for this editor.  (TRUE meaning valid, FALSE meaning invalid)

        If a function is provided, the single argument is the keystroke event facade `e` and if
        the keystroke is valid it should return true, otherwise if invalid false;

        @example
              /\d/            // for numeric digit-only input
              /\d|\-|\./      // for floating point numeric input
              /\d|\//         // for Date field entry in MM/DD/YYYY format

        @attribute keyFiltering
        @type {RegExp|Function}
        @default null
        */
        keyFiltering:  {
            value:  null
        },

        /**
        Provides the capability to validate the final saved value after editing is finished.
        This attribute can be set to either a RegEx or a function, that operates on the entire
        "value" setting of the editor input (whereas [keyFiltering](#attr_keyFilter) performs
        validation checks on each key input).

        If a function is provided, the single argument is the value setting of the editor.
        the keystroke is valid it should return true, otherwise if invalid false;

        @example
             /\d/            // for numeric digit-only input
             /\d|\-|\.|\+/   // for floating point numeric input
             /\d|\//         // for Date field entry in MM/DD/YYYY format

        @attribute validator
        @type {RegExp|Function}
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
        }


    }



});