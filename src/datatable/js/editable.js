/**
 Allows the cells on a DataTable to be edited. Requires either the inline or popup cell editors.

 @module datatable
 @submodule datatable-editable
*/
var Lang = Y.Lang,
    arrEach = Y.Array.each,


    EDITABLE = 'editable',
    EDITOR_OPEN_ACTION = 'editorOpenAction',
    DEF_EDITOR = 'defaultEditor',
    WRAP_AROUND_NAV = 'wrapAroundNavigation',

    CHANGE = 'Change',
    CELL_EDITOR = 'celleditor',
    COL = 'col',
    COLUMNS = 'columns',

    KEYC_ESC = 27,
    KEYC_ENTER = 13,
    KEYC_TAB = 9,
    KEYC_UP  = 38,
    KEYC_DOWN  = 40,
    KEYC_RIGHT  = 39,
    KEYC_LEFT  = 37,


/**
 A DataTable class extension that configures a DataTable for editing.
 Currently it supports cell editing via both inline and with popups.

 This module is essentially a base wrapper-class to setup a DataTable
 for editing with the appropriate attributes and
 listener creation / detachment.  The actual editors are within
 the datatable-celleditor-inline and datatable-celleditor-popup modules.

 @class DataTable.Editable
 @extends Y.DataTable
*/
DtEditable = function (){};

// Define new attributes to support editing
DtEditable.ATTRS = {

    /**
    A boolean flag that sets the DataTable state to allow editing (either inline or popup cell editing).
    (May support row editing in future also)

    @attribute editable
    @type boolean
    @default false
    */
    editable: {
        value:      false,
        validator:  Lang.isBoolean
    },

    /**
    Defines the event type on the TD that opens the cell editor, usually
    'click' or 'dblclick'

    @attribute editorOpenAction
    @type {String|null}
    @default 'dblclick'
    */
    editorOpenAction: {
        value:      'dblclick',
        validator:  function (v){
            return Lang.isString(v) || v===null;
        }
    },

    /**
    Defines the keys that will open the editor when pressed while an editable cell
    has the focus.

    It can be set to a keyCode or an alias from the [KEY_NAMES](#property_KEY_NAMES)
    table plus modifiers as described in [keyActions](#property_keyActions) or an array of them
    to enable multiple keys to open the editor.  A null value will disable the
    use of keystrokes to open the editor.

    The default follows the W3C recommendations: http://www.w3.org/WAI/PF/aria-practices/#grid


    @attribute editorOpenKey
    @type [String | Integer] | String | Integer | null
    @default F2 and Enter
    */
    editorOpenKey: {
        value: [13, 113],
        setter: function (value) {
            Y.log('DataTable.Editable.editorOpenKey setter: ' + value, 'info', 'datatable-editable');
            if (value) {
                return Y.Array(value);
            }
            return value;
        }
    },

    /**
    Specifies a default editor name to respond to an editing event defined in
    [_editorOpenAction](#attr_editorOpenAction) attribute.
    The default editor is used if the DataTable is in editing mode (i.e. "editable:true") and if
    the column DOES NOT include a property `editable:false` in its definitions.

    Cell editors are typically assigned by setting a column property
    (i.e. `editor:"text"` or `editor:"date"`) on each individual column.

    This attribute can be used to set a single editor to work on every column
    without having to define it on each  column.

    @attribute defaultEditor
    @type {String|Null}
    @default null
    */
    defaultEditor : {
        value:      null,
        validator:  function (v) {
            return Lang.isString(v) || v === null;
        }
    },

    /**
    Determines whether keyboard navigation beyond an edge of the table wraps
    around to the opposite edge.

    @attribute wrapAroundNavigation
    @type Boolean
    @default true
    */
    wrapAroundNavigation: {
        value: true,
        validator: Lang.isBoolean
    }
};

Y.mix( DtEditable.prototype, {

    /**
     Holds a reference to the active cell editor.
     @property _openEditor
     @type DataTable.BaseCellEditor
     @default null
     @private
     */
    _openEditor:        null,

    /**
     Holds the current record (i.e. a Model class) of the TD being edited
     @property _editorRecord
     @type Model
     @default null
     @private
     */
    _editorRecord:        null,

    /**
     Holds the column key (or name) of the cell being edited
     @property _editorColKey
     @type String
     @default null
     @private
     */
    _editorColKey:        null,

    /**
     Holds the TD Node currently being edited
     @property _editorTd
     @type Node
     @default null
     @private
     */
    _editorTd:            null,


    // -------------------------- Subscriber handles  -----------------------------

    /**
     Array with the Event Handles of the events to be cleared on destroying.
     @property _subscrEditable
     @type [EventHandle]
     @default null
     @private
     */
    _subscrEditable:     null,

    /**
     Event handle to the action set in [editorOpenAction](#attr_editorOpenAction).
     @property _subscrEditOpen
     @type EventHandle
     @default null
     @private
     */
    _subscrEditOpen: null,


    /**
     CSS class name that is added to indicate a column is editable
     @property _classColEditable
     @type String
     @default 'yui3-datatable-col-editable'
     @private
     */
    _classColEditable:  null,

    /**
     CSS classname applied to the TD element being edited.

     @property _classCellEditing
     @type String
     @default 'yui3-datatable-celleditor-editing'
     @protected
    */
    _classCellEditing:  null,


    /**
     Hash that stores the "common" editors, i.e. standard editor names that occur
     within Y.DataTable.Editors and are used in this DataTable.

     This object holds the BaseCellEditor instances, keyed by the editor "name" for quick hash reference.

     @property _commonEditors
     @type Object
     @default null
     @private
     */
    _commonEditors:  null,

    /**
     Hash that stores cell editors keyed by column key (or column name) where the value
     for the associated key is either:<ul>
    <li>`String` which references an editor name in the [_commonEditors](#property__commonEditors) hash</li>
    <li>`DataTable.BaseCellEditor` instance for a customized editor instance
      (typically one with specified "editorConfig" in the column definition)</li>
    </ul>
     @property _columnEditors
     @type Object
     @default null
     @private
     */
    _columnEditors: null,

    /**
    Container for all cell editors.  Serves to keep them all together and to
    listen for common events.

    @property _editorsContainer
    @type Node
    @default null
    @private
    */
    _editorsContainer: null,


    //==========================  LIFECYCLE METHODS  =============================

    /**
    Initializer that sets up listeners for `editable` and `editorOpenAction` attributes
    and sets some CSS names
    @method initializer
    @protected
     */
    initializer: function (){
        Y.log('DataTable.Editable.initializer', 'info', 'datatable-editable');

        this._classColEditable = this.getClassName(COL, EDITABLE);
        this._classCellEditing = this.getClassName(CELL_EDITOR, 'editing');

        var u = this._UI_ATTRS;

        this._UI_ATTRS = {
            SYNC: u.SYNC.concat(EDITABLE, EDITOR_OPEN_ACTION),
            BIND: u.BIND.concat(EDITABLE, EDITOR_OPEN_ACTION, 'columns')
        };

        // It is not worth a template nor a property to store the className for the editor container.
        this._editorsContainer = Y.one('body').appendChild('<div class="' + this.getClassName('cell', 'editors') + '"></div>');

    },

    /**
    Cleans up ALL of the DT listeners and the editor instances and generated private props
    @method destructor
    @protected
    */
    destructor:function () {
        Y.log('DataTable.Editable.destructor', 'info', 'datatable-editable');

        // detach the "editableChange" listener on the DT
        this.set(EDITABLE, false);
        this._unbindEditable();
        this._editorsContainer.remove(true);
    },

    /**
    Opens a cell editor on the given DataTable cell.
    It also accepts an EventFacade resulting from a user action.

    @method openCellEditor
    @param td {Node | EventFacade} Table cell to be edited or EventFacade of an action on that cell.
    @public
     */
    openCellEditor: function (td) {
        Y.log('DataTable.Editable.openCellEditor', 'info', 'datatable-editable');

        var col       = this.getColumnByTd(td),
            colKey    = col.key || col.name,
            record    = this.getRecord(td),
            editorRef = (colKey) ? this._columnEditors[colKey] : null,
            editorInstance = (editorRef && Lang.isString(editorRef) ) ? this._commonEditors[editorRef] : editorRef;

        if(!td || (col && col.editable === false && !editorInstance)) {
            return;
        }

        // Hide any editor that may currently be open ... unless it is the currently visible one
        if(this._openEditor) {
            this._openEditor.cancelEditor();
        }

        if(editorInstance) {
            if (this.scrollTo && this.isHidden(td, true)) {
                this.scrollTo(td);
            }


            td.addClass(this._classCellEditing);

            this._openEditor   = editorInstance;          // placeholder to the open Editor View instance
            this._editorTd     = td;                      // store the TD
            this._editorRecord = record;                  // placeholder to the editing Record
            this._editorColKey = colKey;                  // the column key (or name)


            editorInstance.showEditor({
                td:     td,
                record: record,
                colKey: colKey,
                initialValue:  record.get(colKey)
            });

        }

    },


    /**
    Cleans up a currently open cell editor and unbinds any listeners that this DT had
    set on the View.

    @method hideCellEditor
    @public
    */
    hideCellEditor: function () {
        Y.log('DataTable.Editable.hideCellEditor', 'info', 'datatable-editable');
        var oe = this._openEditor,
            td = this._editorTd;

        if(oe) {
            if (oe.get('active')) {
                oe._hideEditor();
            }
            if (td) {
                td.removeClass(this._classCellEditing);

                // Return the focus to the cell just edited
                this.set('focusedCell', td);
                this.focus();
            }

            this._unsetEditor();
        }
    },

    /**
    Returns all cell editor instances for the editable columns of the current DT instance

    @method getCellEditors
    @return {Object} Hash containing all the cell editors instances indexed by the column key.
    */
    getCellEditors: function () {
        Y.log('DataTable.Editable.getCellEditors', 'info', 'datatable-editable');

        var rtn = {};
        Y.Object.each(this._columnEditors, function (v, k){
            rtn[k] =  (Lang.isString(v)) ? this._commonEditors[v] : v;
        }, this);
        return rtn;
    },

    /**
    Returns the cell editor instance associated with a particular column of the
    Datatable.

    Returns null if the given column is not editable.

    @method getCellEditor
    @param col {Object|String|Integer} Column identifier, either the Column object, column key or column index
    @return {DataTable.BaseCellEditor} Cell editor instance, or null if no editor for given column
    @public
     */
    getCellEditor: function (col) {
        Y.log('DataTable.Editable.getCellEditor: ' + col, 'info', 'datatable-editable');

        var ce = this._columnEditors,
        column = (col && typeof col !== "object") ? this.getColumn(col) : null,
        colKey = (column) ? column.key || column.name : null,
        rtn = null;

        if(colKey && ce[colKey]) {
            if(Lang.isString(ce[colKey])) {
                // ce[colKey] is a common editor name, like "textarea", etc..
                rtn = this._commonEditors[ ce[colKey] ];
            } else {
                rtn = ce[colKey];
            }
        }

        return rtn;

    },

    /**
    Returns the Column object (from the original "columns") associated with the input TD Node.

    @method getColumnByTd
    @param cell {Node} Node of TD for which column object is desired
    @return column {Object} The column object entry associated with the desired cell
    @public
     */
    getColumnByTd:  function (cell){
        Y.log('DataTable.Editable.getColumnByTd', 'info', 'datatable-editable');

        var colName = this.getColumnNameByTd(cell);
        return (colName) ? this.getColumn(colName) : null;
    },


    /**
    Returns the column "key" or "name" string for the requested TD Node

    @method getColumnNameByTd
    @param cell {Node} Node of TD for which column name is desired
    @return colName {String} Column key or name
    @public
     */
    getColumnNameByTd: function (cell){
        Y.log('DataTable.Editable.getColumnNameByTd', 'info', 'datatable-editable');

        var classes = cell.get('className').split(" "),
        regCol  = new RegExp(this.getClassName(COL) + '-(.*)'),
        colName;

        Y.Array.some(classes,function (item){
            var colmatch =  item.match(regCol);
            if ( colmatch && Lang.isArray(colmatch) && colmatch[1] ) {
                colName = colmatch[1];
                return true;
            }
        });

        return colName || null;
    },


    /**
    Sets up listeners for the DT editable module,
    @method _bindEditable
    @private
     */
    _bindEditable: function () {
        Y.log('DataTable.Editable._bindEditable', 'info', 'datatable-editable');


        if(this._subscrEditable) {
            Y.log('Check: DataTable.Editable._bindEditable: there should not be subscribers leftover', 'warn', 'datatable-editable');
            arrEach(this._subscrEditable, function (eh){
                if(eh && eh.detach) {
                    eh.detach();
                }
            });
        }

        this._subscrEditable = [
            Y.Do.after(this._updateAllEditableColumnsCSS, this, 'syncUI'),
            this.after('sort', this._afterEditableSort),

            this.after(DEF_EDITOR + CHANGE, this._afterDefaultEditorChange),

            this.after(CELL_EDITOR + ':save', this._afterCellEditorSave),
            this.after(CELL_EDITOR + ':cancel', this._afterCellEditorCancel),

            //this._editorsContainer.on('click',      this._onClick, this),
            this._editorsContainer.on('keydown',    this._onKeyDown, this),
            this.after('scroll', this._onScrollUpdateCellEditor),
            Y.on("windowresize", Y.bind(this._onScrollUpdateCellEditor, this)),
            this._editorsContainer.on('clickoutside', this._afterClickOutside, this),
            this.after('editorOpenKeyChange', this._afterEditorOpenKeyChange)
        ];
        this._uiSetEditorOpenAction(this.get(EDITOR_OPEN_ACTION));
        this._setEditorOpenKeys(this.get('editorOpenKey'));
    },

    /**
    Unbinds ALL of the popup editor listeners and removes column editors.

    @method _unbindEditable
    @private
    */
    _unbindEditable: function () {
        Y.log('DataTable.Editable._unbindEditable', 'info', 'datatable-editable');

        // Detach EDITABLE related listeners
        if(this._subscrEditable) {
            arrEach(this._subscrEditable, function (eh) {
                if(eh && eh.detach) {
                    eh.detach();
                }
            });
        }
        this._subscrEditable = null;

        // Detach edit opening ...
        if(this._subscrEditOpen) {
            this._subscrEditOpen.detach();
        }
        this._subscrEditOpen = null;

        // destroy any currently open editor
        if(this._openEditor && this._openEditor.destroy) {
            this._openEditor.destroy();
        }

        this._unsetEditor();

        // run through all instantiated editors and destroy them
        this._destroyColumnEditors();

    },

    /**
    Listener that toggles the DT editable state, setting/unsetting the listeners associated with
    cell editing.

    It uses the _UI_ATTRS facility of Widget.

    @method _uiSetEditable
    @param value {Boolean} Value for [editable](#attr_editable) attribute
    @private
     */

    _uiSetEditable: function (value) {
        Y.log('DataTable.Editable._uiSetEditable: ' + value, 'info', 'datatable-editable');

        if (value) {
            this._bindEditable();
            this._buildColumnEditors();

        } else {
            this._unbindEditable();
            this._destroyColumnEditors();

        }

    },

    /**
    Listener for changes on [defaultEditor](#attr_defaultEditor) attribute for this DT.
    If the default editor is changed to a valid setting, we disable and re-enable
    editing on the DT to reset the column editors.

    @method _afterDefaultEditorChange
    @param e {EventFacade} Attribute change event facade
    @private
    */
    _afterDefaultEditorChange: function (e) {
        Y.log('DataTable.Editable._afterDefaultEditorChange: ' + e.newVal, 'info', 'datatable-editable');

        var defeditor = e.newVal;

        // if a valid editor is given AND we are in editing mode, toggle off/on ...
        if ( defeditor && this.get(EDITABLE) ) {
            this._uiSetEditable(false);
            this._uiSetEditable(true);
        }
    },

    /**
    Responds to changes in the columns definition by dropping all the current
    editors and creating them again.

    @method _uiSetColumns
    @private
     */
    _uiSetColumns: function () {
        Y.log('DataTable.Editable._uiSetColumns', 'info', 'datatable-editable');

        if (this.get(EDITABLE)) {
            this._uiSetEditable(false);
            this._uiSetEditable(true);
        }
    },

    /**
    Setter method for the [editorOpenAction](#attr_editorOpenAction) attribute,
    Sets the TD event listener for initiating editing.

    It uses the _UI_ATTRS facility of Widget.

    @method _uiSetEditorOpenAction
    @param val {String} Name of the event that should open the editor
    @private
    */
    _uiSetEditorOpenAction: function (val) {
        Y.log('DataTable.Editable._uiSetEditorOpenAction: ' + val, 'info', 'datatable-editable');

        if(this._subscrEditOpen) {
            this._subscrEditOpen.detach();
        }
        if (val) {
            this._subscrEditOpen = this.delegate( val, this._afterEditorOpenAction,
                "tbody." + this.getClassName('data') + " td", this);
        }
    },

    /**
    Listener for the event set at the [editorOpenAction](#attr_editorOpenAction) attribute.
    Opens a cell editor on the target cell.

    @method _afterEditorOpenAction
    @param ev {EventFacade} Event Facade for the corresponding event.
    @private
     */

    _afterEditorOpenAction: function (ev) {
        Y.log('DataTable.Editable._afterEditorOpenAction', 'info', 'datatable-editable');

        // If not completely halted, the cell underneath will get the focus thanks to datatable-keynav
        ev.halt(true);
        this.openCellEditor(ev.currentTarget);
    },

    /**
    Listener for changes in the [editorOpenKey](#attr_editorOpenKey) attribute.
    Adds the given key codes to the [keyActions](#property_keyActions) map
    of the `datatable-keynav` module.

    @method _afterEditorOpenKeyChange
    @param ev {EventFacade} Event facade for the attribute change event.
    @private
    */
    _afterEditorOpenKeyChange: function (ev) {
        Y.log('DataTable.Editable._afterEditorOpenKeyChange: ' + ev.newVal, 'info', 'datatable-editable');

        arrEach(ev.prevVal, function (keyCode) {
            delete this.keyActions[keyCode];
        }, this);
        if (ev.newVal) {
            this._setEditorOpenKeys(ev.newVal);
        }
    },

    /**
    Sets the keys that will open the editor.

    @method _setEditorOpenKeys
    @param keys {[String | Integer]} Array of keys that will open the editor.
    @private
    */
    _setEditorOpenKeys: function(keys) {
        Y.log('DataTable.Editable._setEditorOpenKeys: ' + keys, 'info', 'datatable-editable');
        arrEach(keys, function (keyCode) {
            this.keyActions[keyCode] = '_afterEditorOpenKey';
        }, this);

    },

    /**
    Listener for the keystrokes set at the [editorOpenAction](#attr_editorOpenKey) attribute.
    Opens a cell editor on the target cell.

    It is called from the `datatable-keynav` module.

    @method _afterEditorOpenKey
    @param ev {EventFacade} Event Facade for the corresponding event.
    @private
    */
    _afterEditorOpenKey: function (ev) {
        Y.log('DataTable.Editable._afterEditorOpenKey', 'info', 'datatable-editable');

        this.openCellEditor(ev.target);
    },


    /**
    Pre-scans the DT columns looking for named editors and collects unique editors,
    instantiates them, and adds them to the  [_columnEditors](#property__columnEditors) array.
    This method only creates the editor instances that are required, through a combination of
    [_commonEditors](#property__commonEditors) and [_columnEditors](#property__columnEditors)
    properties.

    @method _buildColumnEditors
    @private
    */
    _buildColumnEditors: function () {
        Y.log('DataTable.Editable._buildColumnEditors', 'info', 'datatable-editable');

        var defEditor = this.get(DEF_EDITOR),
            editorName, colKey, editorInstance;

        if( !Y.DataTable.Editors ) {
            return;
        }

        if( this._columnEditors || this._commonEditors ) {
            this._destroyColumnEditors();
        }

        this._commonEditors = {};
        this._columnEditors = {};

        arrEach(this.get(COLUMNS), function (col) {
            var hasConfig = Lang.isObject(col.editorConfig),
                edConfig = col.editorConfig || {};

            colKey = col.key || col.name;

            if(colKey && col.editable !== false) {

                editorName = col.editor || defEditor;

                this._updateEditableColumnCSS(colKey, true);

                //
                // If an editor is named, check if its definition exists, and that it is
                // not already instantiated.   If not, create it ...
                //

                // check for common editor ....
                if (editorName && Y.DataTable.Editors[editorName]) {
                    if (col.lookupTable && edConfig.lookupTable === undefined) {
                        edConfig.lookupTable = col.lookupTable;
                        hasConfig = true;
                    }

                    if(hasConfig) {

                        editorInstance = this._createCellEditorInstance(editorName, edConfig);

                        this._columnEditors[colKey] = editorInstance || null;

                    } else {

                        if( !this._commonEditors[editorName] ) {
                            editorInstance = this._createCellEditorInstance(editorName, edConfig);
                            this._commonEditors[editorName] = editorInstance;
                        }

                        this._columnEditors[colKey] = editorName;

                    }

                }

            }
        },this);

    },

    /**
    Takes the given editorName (i.e. 'textarea'),
    fetches the corresponding editor class, merges any column 'editorConfig'
    and creates the corresponding
    cell editor instance.

    @method _createCellEditorInstance
    @param editorName {String} Editor name
    @param config {Object} reference to column's editorConfig attribute
    @return {DataTable.BaseCellEditor} A newly created editor instance
    @private
     */
    _createCellEditorInstance: function (editorName, config) {
        Y.log('DataTable.Editable._createCellEditorInstance: ' + editorName + ' for ' + column.key, 'info', 'datatable-editable');

        var Editor = Y.DataTable.Editors[editorName],
            editor = null;

        if (Editor) {
            editor = new Editor(config).render(this._editorsContainer);
            editor.get('container').addClass(this.getClassName('celleditor', editorName));
            editor.addTarget(this);
        }
        return editor;

    },

    /**
    Loops through the column editor instances, destroying them and resetting the collection to null object.

    @method _destroyColumnEditors
    @private
     */
    _destroyColumnEditors: function () {
        Y.log('DataTable.Editable._destroyColumnEditors', 'info', 'datatable-editable');

        if( !this._columnEditors && !this._commonEditors ) {
            return;
        }

        arrEach(this._getAllCellEditors(),function (ce) {
            if(ce && ce.destroy) {
                ce.destroy();
            }
        });

        this._editorsContainer.empty();
        this._commonEditors = null;
        this._columnEditors = null;

        // remove editing class from all editable columns ...
        arrEach( this.get(COLUMNS), function (c){
            if(c.editable === undefined || c.editable === true) {
                this._updateEditableColumnCSS(c.key || c.name,false);
            }
        },this);

    },

    /**
    Utility method to combine "common" and "column-specific" cell editor instances and return them.

    @method _getAllCellEditors
    @return {Array} Of cell editor instances used for the current DT column configurations
    @private
     */
    _getAllCellEditors: function () {
        Y.log('DataTable.Editable._getAllCellEditors', 'info', 'datatable-editable');

        var rtn = [];

        if( this._commonEditors ) {
            Y.Object.each(this._commonEditors, function (ce){
                if(ce && ce instanceof Y.View){
                    rtn.push(ce);
                }
            });
        }

        if( this._columnEditors ) {
            Y.Object.each(this._columnEditors, function (ce){
                if(ce && ce instanceof Y.View){
                    rtn.push(ce);
                }
            });
        }
        return rtn;
    },


    /**
    Listener to the "sort" event, so we can hide any open editors and update the editable column CSS
    after the UI refreshes

    @method _afterEditableSort
    @private
    */
    _afterEditableSort: function () {
        Y.log('DataTable.Editable._afterEditableSort', 'info', 'datatable-editable');

        if(this.get(EDITABLE)) {
            this.hideCellEditor();
            this._updateAllEditableColumnsCSS();
        }
    },

    /**
    Re-initializes the cell-dependent properties to null.

    @method _unsetEditor
    @private
     */
    _unsetEditor: function () {
        Y.log('DataTable.Editable._unsetEditor', 'info', 'datatable-editable');

        // Finally, null out static props on this extension
        this._openEditor = null;
        this._editorRecord = null;
        this._editorColKey = null;
        this._editorTd = null;
    },

    /**
    Method to update all of the current TD's within the current DT to add/remove the editable CSS.

    @method _updateAllEditableColumnsCSS
    @private
     */
    _updateAllEditableColumnsCSS : function () {
        Y.log('DataTable.Editable._updateAllEditableColumnsCSS', 'info', 'datatable-editable');

        var ckey, editable = this.get(EDITABLE);
        arrEach(this.get(COLUMNS), function (col) {
            ckey = col.key || col.name;
            if(ckey) {
                this._updateEditableColumnCSS(ckey, editable && col.editable !== false);
            }
        }, this);
    },

    /**
    Method that adds/removes the CSS editable-column class from a DataTable column,
    based on whether the column is editable.

    @method _updateEditableColumnCSS
    @param colKey {String}  Column key or name to alter
    @param editable {Boolean} The column is editable.
    @private
     */
    _updateEditableColumnCSS : function (colKey, editable) {
        Y.log('DataTable.Editable._updateEditableColumnCSS: ' + colKey + ' editable: ' + editable, 'info', 'datatable-editable');

        var tbody = this._tbodyNode,
            col   = (colKey) ? this.getColumn(colKey) : null,
            colEditable = col && col.editable !== false,
            tdCol;
        if(!tbody || !colKey || !col || !colEditable) {
            return;
        }

        colEditable = col.editor || this.get(DEF_EDITOR);

        if( !colEditable) {
            /*jshint maxlen:200 */

            Y.log('DataTable.Editable._updateEditableColumnCSS (should not be here 1): ' + colKey + ' editable: ' + editable, 'error', 'datatable-editable');
            /*jshint maxlen:120 */
            editable = false;
        }

        tdCol = tbody.all('td.' + this.getClassName(COL, colKey));
        if (tdCol) {
            tdCol.toggleClass(this._classColEditable, editable);
        }
        /*jshint maxlen:200 */
        else  {Y.log('DataTable.Editable._updateEditableColumnCSS (should not be here 2): ' + colKey + ' editable: ' + editable, 'error', 'datatable-editable');}
        /*jshint maxlen:120 */

    },


    /**
    Listener that fires on a scrollable DT scrollbar "scroll" event, and updates
    the current XY position of the currently open Editor.

    @method _onScrollUpdateCellEditor
    @private
     */
    _onScrollUpdateCellEditor: function () {
        Y.log('DataTable.Editable._onScrollUpdateCellEditor', 'info', 'datatable-editable');

        var oe = this._openEditor;

        if(oe && oe.get('active') ) {
            oe.set('visible', !this.isHidden(this._editorTd, true));
            oe._attach(this._editorTd);
        }
    },

    /*
    Closes any open editor if the user clicks outside the editor.

    @method _afterClickOutside
    @private
    */
    _afterClickOutside: function () {
        Y.log('DataTable.Editable._afterClickOutside', 'info', 'datatable-editable');

        if(this._openEditor) {
            this._openEditor.cancelEditor();
        }
    },
    /**
    Key listener for the `keydown` event.
    It handles navigation, Enter or Esc.

    @method _onKeyDown
    @param e {EventFacade} Keydown event facade
    @protected
    */
    _onKeyDown : function (e) {
        Y.log('DataTable.Editable._onKeyDown', 'info', 'datatable-editable');

        var keyc = e.keyCode,
            dx = 0, dy = 0,
            oe = this._openEditor;

        if (!oe) {
            return;
        }
        switch(keyc) {
            case KEYC_ENTER:
                if (oe.get('saveOnEnterKey')) {
                    e.preventDefault();
                    oe.saveEditor();
                    return;
                }
                break;
            case KEYC_ESC:
                e.preventDefault();
                oe.cancelEditor();
                return;
        }
        if(oe.get('navigationEnabled')) {
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
                this._navigate(dx, dy);
                e.preventDefault();
            }
        }
    },


    /**
    Moves to the cell editor at relative position `dx` and  `dy` from the current
    open one.
    Wraps around if [wrapAroundNavigation](#attr_wrapAroundNavigation) is set.


    @method _navigate
    @param dx {integer} the 'x' displacement
    @param dy {integer} the 'y' displacement
    @private
     */
    _navigate : function (dx, dy) {
        Y.log('DataTable.Editable._navigate', 'info', 'datatable-editable');

        var td = this._editorTd,
            colIndex = td.get('cellIndex'),
            tr = td.ancestor('tr'),
            tbody = tr.ancestor('tbody'),
            rowIndex = tr.get('rowIndex') - tbody.get('firstChild.rowIndex'),
            numCols = tr.get('children').size(),
            numRows = tbody.get('children').size(),
            wrap = this.get(WRAP_AROUND_NAV), wrappedOnce = false;

        this.hideCellEditor();

        while (true) {
            rowIndex += dy;
            colIndex += dx;

            if(colIndex === numCols) {
                if (!wrap || wrappedOnce) {
                    return;
                }
                colIndex = 0;
                wrappedOnce = true;
            } else if(colIndex < 0) {
                if (!wrap || wrappedOnce) {
                    return;
                }
                colIndex = numCols - 1;
                wrappedOnce = true;
            } else if(rowIndex === numRows) {
                if (!wrap || wrappedOnce) {
                    return;
                }
                rowIndex = 0;
                wrappedOnce = true;
            } else if(rowIndex < 0) {
                if (!wrap || wrappedOnce) {
                    return;
                }
                rowIndex = numRows - 1;
                wrappedOnce = true;
            }
            if (this.getColumn(colIndex).editable !== false) {
                tr = tbody.get('children').item(rowIndex);
                td = tr.get('children').item(colIndex);
                this.openCellEditor(td);
                return;
            }
        }
    },


    /**
    Fired when the the cell editor is about to be opened.

    @event celleditor:show
    @param ev {Event Facade} Event facade, including:
     @param ev.editor {DataTable.BaseCellEditor} Editor instance used to edit this cell.
     @param ev.td {Node} The TD Node that was edited
     @param ev.record {Model} Model instance of the record data for the edited cell
     @param ev.colKey {String} Column key (or name) of the edited cell
     @param ev.initialValue {Any} The original value of the underlying data for the cell
     @param ev.formattedValue {any} Value as shown to the user
     @param ev.inputNode {Node} Input element for the editor
     */

    /**
    Fired when the open Cell Editor has sent an 'cancel' event, typically from
    a user cancelling editing via ESC key or "Cancel Button"

    @event celleditor:cancel
    @param ev {Event Facade} Event facade, including:
     @param ev.editor {DataTable.BaseCellEditor} Editor instance used to edit this cell.
     @param ev.td {Node} The TD Node that was edited
     @param ev.record {Model} Model instance of the record data for the edited cell
     @param ev.colKey {String} Column key (or name) of the edited cell
     @param ev.initialValue {Any} The original value of the underlying data for the cell
     */

    /**
    Event fired after a Cell Editor has sent the `save` event, closing an editing session.

    @event celleditor:save
    @param ev {Event Facade} Event facade, including:
     @param ev.editor {DataTable.BaseCellEditor} Editor instance used to edit this cell.
     @param ev.td {Node} The TD Node that was edited
     @param ev.record {Model} Model instance of the record data for the edited cell
     @param ev.colKey {String} Column key (or name) of the edited cell
     @param ev.initialValue {Any} The original value of the underlying data for the cell
     @param ev.formattedValue {any} Value as entered by the user
     @param ev.newValue {Any} The value to be saved
      */

    /**
    After listener for the cell editor `cancel` event. If no other listener
    has halted the event, this method will finally hide the editor.

    @method _afterCellEditorCancel
    @private
     */
    _afterCellEditorCancel: function () {
        Y.log('DataTable.Editable._afterCellEditorCancel', 'info', 'datatable-editable');

        if (this._editorTd) {
            this._editorTd.removeClass(this._classCellEditing);
        }

        if(this._openEditor) {
            this.hideCellEditor();
        }
    },


    /**
    After listener for the cell editor `save` event. If no other listener
    has halted the event, this method will finally save the new value
    and hide the editor.

    @method _afterCellEditorSave
    @param ev {Event Facade} Event facade (see: [celleditor:save](#event_celleditor:save) event.
    @private
     */
    _afterCellEditorSave: function (ev) {
        Y.log('DataTable.Editable._afterCellEditorSave', 'info', 'datatable-editable');

        if (this._editorTd) {
            this._editorTd.removeClass(this._classCellEditing);
        }
        if(ev.record){
            ev.record.set(ev.colKey, ev.newValue);
        }
    }
});

Y.DataTable.Editable = DtEditable;
Y.Base.mix(Y.DataTable, [DtEditable]);

/**
This object is attached to the DataTable namespace to allow addition of "editors" in conjunction
with the Y.DataTable.Editable module.

@class DataTable.Editors
@type {Object}
 */
Y.DataTable.Editors = {};
