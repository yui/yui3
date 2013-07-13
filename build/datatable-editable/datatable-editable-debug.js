YUI.add('datatable-editable', function (Y, NAME) {

/**
 Allows the cells on a DataTable to be edited. Requires either the inline or popup cell editors.

 @module datatable
 @submodule datatable-editable
*/
var Lang = Y.Lang,
    arrEach = Y.Array.each,
    objEach = Y.Object.each,


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
 It supports cell editing via both inline and with popups.

 This module is essentially a base wrapper-class to setup a DataTable
 for editing with the appropriate attributes and
 listener creation / detachment.  The actual editors are within
 the datatable-celleditors module.

 @class DataTable.Editable
 @extensionfor DataTable
 @for DataTable

*/
DtEditable = function (){};

// Define new attributes to support editing
DtEditable.ATTRS = {

    /**
    A boolean flag that sets the DataTable state to allow editing.
    When a table is set for editing, all columns become editable
    unless explicitly prevented by setting `editable:false` in
    the column.  The [defaultEditor](#attr_defaultEditor) is used
    on any column with no `editor` specified.

    @attribute editable
    @type boolean
    @default false
    */
    editable: {
        value:      false,
        validator:  Lang.isBoolean
    },

    /**
    Defines the mouse event type on the TD that opens the editor, usually
    `click` or `dblclick`

    @attribute editorOpenAction
    @type String | null
    @default 'dblclick'
    */
    editorOpenAction: {
        value:      'dblclick',
        validator:  function (v){
            return typeof v === 'string' || v===null;
        }
    },

    /**
    Defines the keys that will open the editor when pressed while an editable cell
    has the focus.

    It can be set to a keyCode or an alias from the [KEY_NAMES](#property_KEY_NAMES)
    table plus modifiers as described in [keyActions](#property_keyActions)
    or an array of them to enable multiple keys to open the editor.
    A null value will disable the use of keystrokes to open the editor.

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
    Specifies a default editor name to use in editing editable cells with no
    explicit editor set.

    When a table has [editable](#attr_editable) set, all columns become editable
    unless explicitly forbidden.  Since columns don't need to specify an editor
    to be editable, the `defaultEditor` is used for them.

    @attribute defaultEditor
    @type String | Null
    @default 'inline'
    */
    defaultEditor : {
        value:      'inline',
        validator:  function (v) {
            return typeof v === 'string' || v === null;
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
    },

    /**
    When set, the actions in [editorOpenKey](#attr_editorOpenKey) or
    [editorOpenAction](#attr_editorOpenAction) will open the row editor.
    By default, the cell editor is opened.

    @attribute rowEditor
    @type Boolean
    @default false
     */
    rowEditor: {
        value: false,
        validator: Lang.isBoolean
    },
    /**
    Options for the overlay containing the row editor.

    Besides the options for [Overlay](Overlay.html) such as `headerContent`,
    you may use the `buttons` option which defaults to Save and Cancel buttons.
    See BaseCellEditor [buttons](DataTable.BaseCellEditor.html#attr_buttons) to change.
    Do not set neither the body or the footer contents.

    @attribute rowEditorOptions
    @type Object
    */
    rowEditorOptions: {
        valueFn: function () {
            return {buttons: [{save:true}, {cancel:true}]};
        }
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
    When true, the editor in use is the row editor, by default,
    cell editor is used.

    @property _editorRow
    @type Boolean
    @default false
    @private
    */
    _editorRow: false,

    /**
    Once one is created, it holds a reference to a row editor instance,
    to be reused later.

    @property _rowEditorOverlay
    @type DataTable.RowEditorOverlay
    @default null
    @private
     */
    _rowEditorOverlay: null,

    /**
     Holds the current record (i.e. a Model class) of the TD being edited

     @property _editorRecord
     @type Model
     @default null
     @private
    */
    _editorRecord:        null,

    /**
    Holds the column key (or name) of the cell being edited.
    Valid only for cell (not row) editing.

     @property _editorColKey
     @type String
     @default null
     @private
     */
    _editorColKey:        null,

    /**
     Holds the TD or TR Node currently being edited

     @property _editorNode
     @type Node
     @default null
     @private
     */
    _editorNode:            null,

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
     Hash that stores the shared editors, i.e. standard editor names that
     are used by several columns.

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
      (typically one with specified `editorConfig` in the column definition
      and thus cannot be shared)</li>
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
    initializer: function () {
        Y.log('DataTable.Editable.initializer', 'info', 'datatable-editable');

        this._classColEditable = this.getClassName(COL, EDITABLE);
        this._classCellEditing = this.getClassName(CELL_EDITOR, 'editing');

        var u = this._UI_ATTRS;

        this._UI_ATTRS = {
            SYNC: u.SYNC.concat(EDITOR_OPEN_ACTION),
            BIND: u.BIND.concat(EDITABLE, EDITOR_OPEN_ACTION, COLUMNS, 'rowEditorOptions')
        };

        this.onceAfter('render', this._afterEditableRender);
    },

    /**
    Cleans up ALL of the DT listeners and the editor instances and generated private props

    @method destructor
    @protected
    */
    destructor:function () {
        Y.log('DataTable.Editable.destructor', 'info', 'datatable-editable');

        this.set(EDITABLE, false);
        this._editorsContainer.remove(true);
    },

    /**
    Renders the editors after the Datatable itself has been rendered, and attaches
    the required event listeners.

    @method _afterEditableRender
    @private
    */
    _afterEditableRender: function () {
        Y.log('DataTable.Editable._afterEditableRender', 'info', 'datatable-editable');

        // It is not worth a template nor a property to store the className for the editor container.
        this._editorsContainer = Y.one('body').appendChild('<div class="' + this.getClassName('cell', 'editors') + '"></div>');

        if (this.get(EDITABLE)) {
            this._bindEditable();
            this._buildColumnEditors();
        }
    },

    /**
    Opens a cell editor on the given DataTable cell.

    @method openCellEditor
    @param td {Node} Table cell to be edited.
    @public
     */
    openCellEditor: function (td) {
        Y.log('DataTable.Editable.openCellEditor', 'info', 'datatable-editable');

        var col       = this.getColumnByTd(td),
            colKey    = col.key,
            record    = this.getRecord(td),
            editorRef = (colKey) ? this._columnEditors[colKey] : null,
            editorInstance = editorRef && (typeof editorRef === 'string'  ? this._commonEditors[editorRef] : editorRef);

        if(!td || (col && col.editable === false && !editorInstance)) {
            return;
        }

        if (!this.hideEditor()) {
            return;
        }

        // Set the focus on the cell about to be edited
        this.set('focusedCell', td);
        this.blur();

        if (editorInstance) {
            if (this.scrollTo && this.isHidden(td, true)) {
                this.scrollTo(td);
            }


            td.addClass(this._classCellEditing);
            this._editorRow    = false;
            this._openEditor   = editorInstance;
            this._editorNode   = td;
            this._editorRecord = record;
            this._editorColKey = colKey;


            editorInstance.showEditor({
                td:     td,
                record: record,
                colKey: colKey,
                initialValue:  record.get(colKey)
            });

        }
    },
    /**
    Opens a row editor on the given row or the row containing the given node.

    @method openRowEditor
    @param node {Node} Table row to be edited or any node within the row.
    @public
     */
    openRowEditor: function (node) {
        var tr = node.ancestor('tr', true),
            record = this.getRecord(tr),
            editorInstance = this._rowEditorOverlay,
            opts, cePool = this._commonEditors;

        if (!this.hideEditor()) {
            return;
        }

        // Common, pooled editor instances cannot be used because they all have
        // to be shown at once so, first, dereference all editors to actual instances.
        if (cePool) {
            objEach(this._columnMap, function (col, colKey) {
               var ce = this._columnEditors[colKey];
               if (typeof ce === 'string') {
                   if (cePool[ce]) {
                       ce = cePool[ce];
                       delete cePool[ce];
                   } else {
                       // If the editor was in the pool,
                       // it was because it didn't have
                       // extra editorConfig options
                       ce = this._createCellEditorInstance(ce, {});
                   }
                   this._columnEditors[colKey] = ce;
               }
            }, this);
            this._commonEditors = null;
        }

        if (node.get('tagName').toLowerCase() === 'tr') {
            this.set('focusedCell', node.get('firstChild'));
        } else {
            this.set('focusedCell', node.ancestor('td', true));
        }
        this.blur();
        tr.scrollIntoView();
        tr.addClass(this._classCellEditing);

        if (!editorInstance) {
            opts = this.get('rowEditorOptions');
            opts.guest = this;
            this._rowEditorOverlay = editorInstance = new Y.DataTable.RowEditorOverlay(opts).render(this._editorsContainer);
        }

        this._openEditor = editorInstance;
        this._editorRow    = true;
        this._editorNode   = tr;
        this._editorRecord = record;


        editorInstance.showEditor({
            tr:     tr,
            record: record
        });
    },


    /**
    Deactivates and hides a currently open row or cell editor..

    It will return true if it succeeded, which includes not having any actual
    editor to hide (the consequence being the same: no editor visible).

    It will return false if any listener for the
    [celleditor:cancel](#event_celleditor:cancel) event has stopped the event,
    unless the `force` argument is truish, which will force the closing without
    even firing any event.

    @method hideEditor
    @param force {Boolean} Close even if a listener to the
           [celleditor:cancel](#event_celleditor:cancel) event has stopped the event.
    @return {Boolean} True if successful, false if prevented by an event listener.
    @public
    */
    hideEditor: function (force) {
        Y.log('DataTable.Editable.hideEditor', 'info', 'datatable-editable');

        var oe = this._openEditor;

        if (oe) {
            if (oe.get('active')) {
                if (force) {
                    oe._hideEditor();
                    this._hideEditorCntd();
                } else {
                    if (!oe.cancelEditor()) {
                        return false;
                    }
                }
            }
        }
        return true;
    },
    /**
    Finishes up the work of [hideEditor](#method_hideEditor).

    @method _hideEditorCntd
    @private
     */
    _hideEditorCntd: function () {
        var td = this._editorNode;
        if (td) {
            td.removeClass(this._classCellEditing);

            this.focus();
        }

        this._openEditor = null;
        this._editorRecord = null;
        this._editorColKey = null;
        this._editorNode = null;

    },

    /**
    Returns all cell editor instances for the editable columns of the current DT instance

    @method getCellEditors
    @return {Object} Hash containing all the cell editors instances indexed by the column key.
    */
    getCellEditors: function () {
        Y.log('DataTable.Editable.getCellEditors', 'info', 'datatable-editable');

        var rtn = {};
        objEach(this._columnEditors, function (editor, colKey){
            rtn[colKey] =  typeof editor === 'string' ? this._commonEditors[editor] : editor;
        }, this);
        return rtn;
    },

    /**
    Returns the cell editor instance associated with a particular column of the
    Datatable.

    Returns null if the given column is not editable.

    @method getCellEditor
    @param col {Object|String|Integer} Column definition object or column key, name or index as per [getColumn](#method_getColumn).
    @return {DataTable.BaseCellEditor} Cell editor instance, or null if no editor for given column
    @public
     */
    getCellEditor: function (col) {
        Y.log('DataTable.Editable.getCellEditor: ' + col, 'info', 'datatable-editable');

        col = this.getColumn(col);
        if (!col) {
            return null;
        }
        var ce = this._columnEditors[col.key];
        if (typeof ce === 'string') {
            ce = this._commonEditors[ce];
        }

        return ce || null;

    },

    /**
    Returns the Column object (from the original "columns") associated with the input TD Node.

    @method getColumnByTd
    @param cell {Node} Node of TD for which column object is desired
    @return column {Object} The column object entry associated with the desired cell
    @public
     */
    getColumnByTd:  function (cell) {
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
            colName = null;

        Y.Array.some(classes, function (item){
            var colmatch =  item.match(regCol);
            if ( colmatch && Lang.isArray(colmatch) && colmatch[1] ) {
                colName = colmatch[1];
                return true;
            }
        });

        return colName;
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
            //Y.Do.after(this._updateAllEditableColumnsCSS, this, 'syncUI'),
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

        this.hideEditor(true);
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

        if (this._rowEditorOverlay) {
            this._rowEditorOverlay.destroy();
            this._rowEditorOverlay = null;
        }

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
    @param ev {EventFacade} Attribute change event facade
    @private
    */
    _afterDefaultEditorChange: function (ev) {
        Y.log('DataTable.Editable._afterDefaultEditorChange: ' + ev.newVal, 'info', 'datatable-editable');

        var defeditor = ev.newVal;

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
    Listener for changes in [rowEditorOptions](#attr_rowEditorOptions).
    It simply destroys the current instance so a new one will eventually be
    created with the new options.
     */
    _uiSetRowEditorOptions: function () {
        this._rowEditorOverlay.destroy();
        this._rowEditorOverlay = null;
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
        if (this.get('rowEditor')) {
            this.openRowEditor(ev.currentTarget);
        } else {
            this.openCellEditor(ev.currentTarget);
        }
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

        if (this.get('rowEditor')) {
            this.openRowEditor(ev.target);
        } else {
            this.openCellEditor(ev.target);
        }
    },


    /**
    Builds the cell editors for all columns unless explicitly forbidden, using the
    [defaultEditor](#attr_defaultEditor) or the one explicitly identified by name
    in the `editor` column property.  It passes the `editorConfig` column attribute
    to the constructor of each editor.

    It adds them to the  [_columnEditors](#property__columnEditors) hash.
    For editors without special `editorConfig` attributes, it stores a shared instance
    in [_commonEditors](#property__commonEditors) keyed by editor name while placing
    the editor name in [_columnEditors](#property__columnEditors) instead.

    @method _buildColumnEditors
    @private
    */
    _buildColumnEditors: function () {
        Y.log('DataTable.Editable._buildColumnEditors', 'info', 'datatable-editable');

        var defEditor = this.get(DEF_EDITOR),
            editorName, editorInstance;

        if( !Y.DataTable.Editors ) {
            return;
        }

        this._destroyColumnEditors();

        this._commonEditors = {};
        this._columnEditors = {};

        objEach(this._columnMap, function (col, colKey) {
            var hasConfig = Lang.isObject(col.editorConfig),
                edConfig = col.editorConfig || {};

            if(col.editable === false || col.children) {
                return;
            }

            editorName = col.editor || defEditor;

            if (editorName && Y.DataTable.Editors[editorName]) {

                this._updateEditableColumnCSS(colKey, true);

                if (col.lookupTable && edConfig.lookupTable === undefined) {
                    edConfig.lookupTable = col.lookupTable;
                    hasConfig = true;
                }

                if (hasConfig) {

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

        }, this);

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
        Y.log('DataTable.Editable._createCellEditorInstance: ' + editorName, 'info', 'datatable-editable');

        var Editor = Y.DataTable.Editors[editorName],
            editor = null;

        if (Editor) {
            config.className = config.className || this.getClassName('celleditor', editorName);
            editor = new Editor(config).render(this._editorsContainer);
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

        if (this._commonEditors) {
            objEach(this._commonEditors, function (ce) {
                if(ce && ce instanceof BCE){
                    ce.destroy({remove: true});
                }
            });
        }
        this._commonEditors = null;

        if (this._columnEditors) {
            objEach(this._columnEditors, function (ce) {
                if(ce && ce instanceof BCE){
                    ce.destroy({remove: true});
                }
            });
        }

        this._columnEditors = null;
        this._editorsContainer.empty();

        if (this._tbodyNode) {
            this._tbodyNode.all('.' + this._classColEditable).removeClass(this._classColEditable);
        }

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
            this.hideEditor(true);
            this._updateAllEditableColumnsCSS();
        }
    },

    /**
    Method to update all of the current TD's within the current DT to add/remove the editable CSS.

    @method _updateAllEditableColumnsCSS
    @private
     */
    _updateAllEditableColumnsCSS : function () {
        Y.log('DataTable.Editable._updateAllEditableColumnsCSS', 'info', 'datatable-editable');

        var editable = this.get(EDITABLE);
        objEach(this._columnMap, function (col, colKey) {
            if (!col.children) {
                this._updateEditableColumnCSS(colKey, editable && col.editable !== false);
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

        var tbody = this._tbodyNode;
        if(tbody) {
            tbody.all('td.' + this.getClassName(COL, colKey)).toggleClass(this._classColEditable, editable);
        }
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
            oe.set('visible', !this.isHidden(this._editorNode, true));
            oe._attach(this._editorNode);
        }
    },

    /*
    Closes any open editor if the user clicks outside the editor.

    @method _afterClickOutside
    @private
    */
    _afterClickOutside: function () {
        Y.log('DataTable.Editable._afterClickOutside', 'info', 'datatable-editable');

        this.hideEditor();
    },
    /**
    Key listener for the `keydown` event.
    It handles navigation, Enter or Esc.

    @method _onKeyDown
    @param ev {EventFacade} Keydown event facade
    @protected
    */
    _onKeyDown : function (ev) {
        Y.log('DataTable.Editable._onKeyDown', 'info', 'datatable-editable');

        var keyc = ev.keyCode,
            dx = 0, dy = 0,
            oe = this._openEditor;

        if (!oe) {
            return;
        }
        switch(keyc) {
            case KEYC_ENTER:
                if (oe.get('saveOnEnterKey')) {
                    ev.preventDefault();
                    oe.saveEditor();
                    return;
                }
                break;
            case KEYC_ESC:
                ev.preventDefault();
                oe.cancelEditor();
                return;
        }
        if(oe.get('navigationEnabled')) {
            switch(keyc) {
                case KEYC_UP:
                    dy = (ev.ctrlKey) ? -1 : 0;
                    break;

                case KEYC_DOWN:
                    dy = (ev.ctrlKey) ? 1 : 0;
                    break;

                case KEYC_LEFT:
                    dx = (ev.ctrlKey) ? -1 : 0;
                    break;

                case KEYC_RIGHT:
                    dx = (ev.ctrlKey) ? 1 : 0;
                    break;

                case KEYC_TAB: // tab
                    dx = (ev.shiftKey) ? -1 : 1;
                    break;
            }

            if(dx || dy) {
                this._navigate(dx, dy);
                ev.preventDefault();
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

        var td = this._editorNode,
            colIndex = td.get('cellIndex'),
            tr = td.ancestor('tr'),
            tbody = tr.ancestor('tbody'),
            rowIndex = tr.get('rowIndex') - tbody.get('firstChild.rowIndex'),
            numCols = tr.get('children').size(),
            numRows = tbody.get('children').size(),
            wrap = this.get(WRAP_AROUND_NAV), wrappedOnce = false;

        if (!this.hideEditor()) {
            return;
        }

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

        this._hideEditorCntd();
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

        if(ev.record){
            ev.record.set(ev.colKey, ev.newValue);
        }
        this.hideEditor();
    }
});

Y.DataTable.Editable = DtEditable;
Y.Base.mix(Y.DataTable, [DtEditable]);


Y.DataTable.Editors = {};
/**
 Allows the cells on a DataTable to be edited. Supports either the cell or row editors.

 @module datatable
 @submodule datatable-editable
*/

// Needs the following JSHint declaration because this file is appended to
// editable.js which already has a var declaration.
/*jshint onevar:false*/
var returnUnchanged = function (value) {
        Y.log('(private) returnUnchanged: ' + value, 'info', 'celleditor-base');
        return value;
    },

/**
Provides the base services for cell editors. This class is meant to be subclassed
by actual implementations of cell editors.

@class DataTable.BaseCellEditor
@extends Y.View
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
    CSS classname to identify the editor's INPUT Node.

    @property _classInput
    @type String
    @default 'yui3-datatable-celleditor-input'
    @protected
    */
    _classInput: 'yui3-datatable-celleditor-input',

    /**
    CSS class name to add to an input box when it fails validation.

    @property _classError
    @type String
    @default "yui3-datatable-celleditor-error"
    @private
    */
    _classError: 'yui3-datatable-celleditor-error',

    /**
    Optionally holds a reference to the element that serves as input, usually
    an input textbox, textarea or similar and automates a few tasks.

    The default implementation tries to locate such element by searching for an
    element with the CSS class set in the [_classInput](#property__classInput) property.

    If such element exists and can be located, the default implementations of
    [_defShowFn](#method__defShowFn) and [_getValue](#method__getValue) will
    show and retrieve the value from it.

    @property _inputNode
    @type Node
    @default null
    @protected
     */
    _inputNode: null,

    /**
    Reference to the element that is meant to overlap the cell being edited.
    It usually is the [input element](#property__inputNode) itself or its container.

    @property _xyReference
    @type Node
    @default null
    @protected
     */
    _xyReference: null,

    /**
    Disallow ad-hoc attributes

    @property _allowAdHocAttrs {Boolean}
    @default false
    @protected
     */
    _allowAdHocAttrs: false,

    /**
    Lifecycle method.  Initializes the [_subscr](#property__subscr) property to
    hold the event listeners and publishes the events it fires.

    @method initializer
    @protected
    */
    initializer: function () {
        Y.log('DataTable.BaseCellEditor.initializer', 'info', 'celleditor-base');

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
    Lifecycle method.  Closes any active editor and its popup window, if any,
    and unbinds all events.

    @method destructor
    @protected
    */
    destructor: function () {
        Y.log('DataTable.BaseCellEditor.destructor', 'info', 'celleditor-base');

        if (this.get('active')) {
            this.cancelEditor();
        }
        if (this._overlay){
            this._overlay.destroy();
        }
        this._unbindUI();
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
        Y.log('DataTable.BaseCellEditor.render', 'info', 'celleditor-base');
        var cfg = this.get('overlayConfig') || {};

        if (this.get('popup')) {
            cfg.guest = this;
            cfg.buttons = this.get('buttons');
            this._overlay = new Y.DataTable.CellEditorOverlay(cfg).render(where);
            this.set('container', this._overlay.getStdModNode('body', true));

        } else {
            where.append(this.get('container'));
        }
        this.fire('render');
        this._bindUI();
        return this;
    },

    /**
    Displays, positions and resizes the cell editor over the edited TD element.
    Fires the [show](#event_show) event.

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
        Y.log('DataTable.BaseCellEditor.showEditor', 'info', 'celleditor-base');

        this._cellInfo = cellInfo;

        var value  = cellInfo.initialValue;

        this.set('value', value);

        value = this._formatter(value);

        this.fire('show', Y.merge(cellInfo, {
            formattedValue: value
        }));

    },

    /**
    Validates and parses the entered value and fires the [save](#event_save) event
    to save it.  It returns true if successful, false if either the validation or
    parsing failed or if the [save](#event_save) was stopped.

    @method saveEditor
    @param [value] {Any} Raw value (not yet parsed) to be saved.
            If missing, [_getValue](#method__getValue) is used.
    @return {Boolean} True if succesful
    @public
    */
    saveEditor: function (value) {
        if (value === undefined) {
            value = this._getValue();
        }

        var validator = this.get('validator'),
            parsedValue;

        Y.log('DataTable.BaseCellEditor.saveEditor: ' + value, 'info', 'celleditor-base');

        if (validator instanceof RegExp ? validator.test(value) : true) {

            parsedValue = this._parser(value);

            if (parsedValue !== Y.Attribute.INVALID_VALUE) {

                return this.fire("save", Y.merge(this._cellInfo, {
                    formattedValue:   value,
                    newValue:   parsedValue
                }));
            }
        }

        this.get('container').addClass(this._classError);
        return false;
    },

    /**
    Called when the user has requested to cancel and abort any changes to the DT cell,
    usually signified by a keyboard ESC or "Cancel" button, etc..
    Fires the [cancel](#event_cancel) event.

    @method cancelEditor
    @return {Boolean} True if successful, false if the [cancel](#event_cancel) was stopped.
    @public
    */
    cancelEditor: function () {
        Y.log('DataTable.BaseCellEditor.cancelEditor', 'info', 'celleditor-base');

        return this.fire("cancel", this._cellInfo);
    },

    /**
    Creates the input element(s) using the [template](#attr_template) attribute
    and inserts them into this view's [container](#attr_container).
    It tries to locate the [_inputNode](#property__inputNode) and the
    [_xyReference](#property__xyReference).

    Cell editors may override this method.

    @method _defRenderFn
    @param ev {EventFacade} event facade for the [render](#event_render)
    @protected
    */

    _defRenderFn: function (/* ev */) {
        Y.log('DataTable.BaseCellEditor._defRenderFn', 'info', 'celleditor-base');

        var container = this.get('container'),
             classInput = this._classInput;
        container.setHTML(Y.Lang.sub(this.get('template'), {
            classInput:classInput
        }));
        this._inputNode = container.one('.' + classInput);
        this._xyReference = this._inputNode || container;
        container.addClass(this.get('className') + ' yui3-datatable-celleditor');
        if (!this._overlay) {
            container.hide();
        }
    },

    /**
    Sets the event listeners.

    @method _bindUI
    @protected
    */
    _bindUI: function () {
        Y.log('DataTable.BaseCellEditor._bindUI', 'info', 'celleditor-base');


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
        Y.log('DataTable.BaseCellEditor._unbindUI', 'info', 'celleditor-base');

        arrEach(this._subscr, function (ev) {
            if(ev && ev.detach) {
                ev.detach();
            }
        });
        this._subscr = null;
    },

    /**
    The default action for the [save](#event_save) event.
    Saves the value already validated and parsed and hides the editor.

    @method _defSaveFn
    @param ev {EventFacade} For [save](#event_save) event
    @protected
    */
    _defSaveFn: function (ev) {
        Y.log('DataTable.BaseCellEditor._defSaveFn', 'info', 'celleditor-base');

        this.set('value', ev.newValue);
        this._hideEditor();
    },

    /**
    The default action for the [cancel](#event_cancel) event.
    It hides the editor.

    @method _defCancelFn
    @param ev {EventFacade} event facade for the [cancel](#event_cancel)
    @protected
    */
    _defCancelFn: function (/* ev */) {
        Y.log('DataTable.BaseCellEditor._defCancelFn', 'info', 'celleditor-base');

        this._hideEditor();
    },

    /**
    The default action for the [show](#event_show) event which should make the editor visible.

    It shows the editor, positions it over the edited cell and if the
    [_inputNode](#property__inputNode) property is a `Node` instance,
    it will set its `value` property and focus on it.

    @method _defShowFn
    @param ev {EventFacade} for the [show](#event_show) event.
    @protected
    */
    _defShowFn: function (ev) {
        Y.log('DataTable.BaseCellEditor._defShowFn', 'info', 'celleditor-base');

        this.set('visible', true);
        this._attach(ev.td);

        var inputNode = this._inputNode;
        if (inputNode instanceof Y.Node) {
            inputNode.focus().set('value', ev.formattedValue).select();
        }


        this._set('active', true);
    },

    /**
    Returns the raw value as entered into the editor.
    The default implementation assumes the [_inputNode](#property__inputNode)
    property points to a Node with a `value` attribute that returns the value
    as entered.


    @method _getValue
    @return value {mixed} Value as entered in the editor
    @protected
     */
    _getValue: function () {
        Y.log('DataTable.BaseCellEditor._getValue', 'info', 'celleditor-base');
        if (this._inputNode) {
            return this._inputNode.get('value');
        }
    },

    /**
    Hides the current editor View instance.

    @method _hideEditor
    @protected
    */
    _hideEditor: function () {
        Y.log('DataTable.BaseCellEditor._hideEditor', 'info', 'celleditor-base');

        this.set('visible', false);
        this.get('container').removeClass(this._classError);

        this._cellInfo = null;
        this._set('active', false);
    },

    /**
    Resizes and moves the element referenced in the
    [_xyReference](#property__xyReference) property
    to fit on top of the cell being edited.

    The default implementation reads the `region` the cell occupies and
    calls [_resize](#method__resize) and [_move](#method__move).

    @method _attach
    @param td {Node} cell to attach this editor to
    @protected
    */
    _attach: function (td) {
        Y.log('DataTable.BaseCellEditor._attach', 'info', 'celleditor-base');
        if (this.get('visible')) {
            var region = td.get('region');
            this._resize(region.width, region.height);
            this._move(region.left, region.top);
        }
    },

    /**
    Resizes the  element referenced in the [_xyReference](#property__xyReference)
    property to fit on top of the cell being edited.

    @method _resize
    @param width {Number} width of the cell being edited
    @param height {Number} height of the cell being edited
    @protected
     */
    _resize: function (width, height) {
        Y.log('DataTable.BaseCellEditor._resize [' + width + ':' + height + ']','info','celleditor-base');

        var node = this._xyReference;
        node.set('offsetWidth', width + 1);
        node.set('offsetHeight', height);
    },

    /**
    Moves the [_xyRefenrece](#property__xyReference) element to the given position
    or, if it is a popup editor, it  asks the [_overlay](#property__overlay) to do it.

    @method _move
    @param left {Number} left edge of the cell being edited.
    @param top {Number} top edge of the cell being edited.
    @protected
     */
    _move: function (left, top) {
        Y.log('DataTable.BaseCellEditor._move: [' + left + ':' + top + ']', 'info', 'celleditor-base');

        (this._overlay || this._xyReference).setXY([left, top]);
    },

    /**
    Responds to changes in the [visible](#attr_visible) attribute by
    showing/hiding the cell editor

    @method _afterVisibleChange
    @param ev {EventFacade} Standard Attribute change event facade
    @private
    */
   _afterVisibleChange: function (ev) {
        Y.log('DataTable.BaseCellEditor._afterVisibleChange: ' + ev.newVal, 'info', 'celleditor-base');

        var container  = this._overlay || this.get('container');
        if (container) {
            if (ev.newVal) {
                container.show();
            } else {
                container.hide();
            }
        }
   }
},{
    /**
    Single copy of all localized strings to be used across all the editors.

    @property localizedStrings
    @static
    @type Object
    */
    localizedStrings:  Y.Intl.get('datatable-editable'),

    ATTRS:{

        /**
        Template to use in creating the cell editor content.

        If the template contains an input element, i.e. a focusable Node with a
        `value`  property, the base editor will automatically show the value
        and retrieve the user input.   This node should be marked with the
        `{classInput}` placeholder as its className.

        The default uses a simple textbox.

       @attribute template
       @type String
       @default plain input box
         */
        template: {
            value:'<input class="{classInput}" type="text"  />',
            validator: Lang.isString
        },
        /**
        Optional CSS className added to the [container](#attr_container) of
        this editor in addition to the defaults.

        @attribute className
        @type String
        @default ''
         */
        className: {
            validator: Lang.isString,
            value: ''
        },

        /**
        Value being edited.  It should be a copy of the value stored
        or about to be stored in the record.

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
        The formatting function will receive the value from the record as its only argument
        and should return the formatted version to be shown to the user.
        Setting this property to `null` (the default) will simply pass the value through.

        This formatter is separate from the column formatter since it is expected
        that the value to be edited will be stripped of extra decoration or formatting
        to make it easier on the user.


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


        This function will receive the raw value as entered by the user as
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
        Signals whether the editor is open and active, however it might not be
        [visible](#attr_visible) as it might have scrolled off the visible area
        of the datatable.

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

        Further validation can be provided by the method set in the
        [parser](#attr_parser) attribute.

        @example
             /^\d$/            // for numeric digit-only input
             // for Date field entry as MM/DD/YYYY or MM-DD-YYYY
             /^\d{1,2}(\/|\-)d{1,2}(\/|\-)d{1,4}$/

        @attribute validator
        @type RegExp
        @default null
        */
        validator: {
            value:      null
        },

        /**
        A flag to signal whether the editor should be saved upon detecting the Enter keystroke
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
        },

        /**
        Wraps the editor in an overlay, optionally adding [buttons](@attr_buttons)
        and [title](#attr_title)

        @attribute popup
        @type Boolean
        @default false
        */
        popup: {
            value: false,
            validator: Lang.isBoolean
        },

        /**
        Additional config parameters for the Overlay to be used in popup editors.
        These configs are merged with the defaults required by the Editor.

        The following would add a text to the header of the popup editor,
        (the [title](#attr_title) attribute can be used for that purpose).

            {
                key: 'name',
                editor: 'text',
                editorConfig: {
                    overlayConfig: {
                        headerContent: 'Enter name of applicant'
                    }
                }
            }

        @attribute overlayConfig
        @type Object
        @default {}
        */
        overlayConfig:{
            value:      {},
            validator:  Lang.isObject
        },

        /**
        Array of buttons to be added to the popup window below the input element.
        Each entry is an object containing the configuration options for the buttons:

        <ul>
            <li>`label`: The label shown to the user.</li>
            <li>`className`: An optional css class name to assign to the button.</li>
            <li>`save`: A non-null value indicates this is the save button,
                equivalent to pressing the `Enter` key.
                It will be highlighted accordingly.
                If no `label` was explicitly assigned,
                'Save' or its localized equivalent will be shown</li>
            <li>`cancel`: A non-null value indicates this is cancel button,
                equivalent to pressing the `Esc` key.</li>
                If no `label` was explicitly assigned,
                'Cancel' or its localized equivalent will be shown</li>
            <li>`action`: An action to be associated with this button.
                No `action` is required for `save` or `cancel` buttons.</li>
        </ul>

        The `action` property can be a string or a function.
        If a function, it will be called when the button is clicked.  The function will
        receive the button configuration entry as its first argument and an object containing
        information about the cell being edited.
        If `action` is a string, an event will be fired using that string as its name.  The event
        can be listened to by subscribing from the datatable using
        <code>"celleditor:<i>&lt;action string&gt;</i>"</code> as the event type
        and it will receive the button configuration and the cell info object.

        The cell information object contains:
        <ul>
            <li>value {Any} The value from the input element or widget.
                Usually a string, it might be other types for complex widgets such as Calendar.</li>
            <li>td {Node} Reference to the table cell.</li>
            <li>record {Model} Reference to the model containing the underlying data.</li>
            <li>colKey {String} Key of the column for the cell to be edited.</li>
            <li>initialValue {Any} The underlying value of the cell to be edited.</li>
        </ul>

        @attribute buttons
        @type Array|null
        @default null
        */
        buttons: {
            value: null
        },

        /**
        For popup editors, text to be shown in the header area of the overlay.

        @attribute title
        @type text | null
        @default null
        */

        title: {
            value: null
        }

    }
});
Y.DataTable.BaseCellEditor = BCE;// This file gets chained after others that already have var declarations
/*jshint onevar:false*/
var substitute = Y.Lang.sub,
    Plugins = Y.Plugins || {},
    arrMap = Y.Array.map;
/*jshint onevar:true*/

Y.DataTable.CellEditorOverlay = Y.Base.create('celleditor-overlay', Y.Overlay, [],
    {
        /**
        Defines the template for BUTTON elements that are added to the Overlay
        via the [buttons](#attr_buttons) attribute.

        @property btnTemplate
        @type String
        @default See Code
        */
       // the `yui3-button` className is there to benefit from the CSSButton module.
        btnTemplate:    '<button class="yui3-button {classButton}">{label}</button>',

        /**
        Reference to the cell editor that this overlay is hosting.

        @property _guest
        @type Datatable.BaseCellEditor
        @default null
        @private
         */
        _guest: null,

        /**
        Offset from the left edge of the element to be positioned to the left
        edge of this overlay.

        @property _offsetX
        @type Number
        @default 0
        @private
         */
        _offsetX: null,

        /**
        Offset from the top edge of the element to be positioned to the top
        edge of this overlay.

        @property _offsetY
        @type Number
        @default 0
        @private
         */
        _offsetY: null,

        /**
        Lifecycle method.  Setys the title and buttons and makes the overlay draggable
        if the drag and drop plugin is available.

        @method initializer
        @param config {Object} Initial configuration options resulting from
            the merge of the OverlayConfig attributes in the column definitions.
        @protected
         */
        initializer: function (config) {
            Y.log('CellEditorOverlay.initializer','info','CellEditorOverlay');

            var guest = (this._guest = config.guest),
                title = guest.get('title');


            if(Plugins.Drag) {
                this.plug(Plugins.Drag);
            }
            if (title) {
                this.set('headerContent', title);
            }
            this._createOverlayButtons(guest.get('buttons'));
        },

        /**
        Adds to the footer of the overlay the buttons entered
        as the [buttons](#attr_buttons) config property of `editorConfig`
        column definition.
        Sets the click listener on them.

        @method _createOverlayButtons
        @param btnCfg {Array}  Array of button definition objects
        @private
        */
        _createOverlayButtons: function (btnCfg) {
            Y.log('CellEditorOverlay._createOverlayButtons','info','CellEditorOverlay');

            var strings = Y.DataTable.BaseCellEditor.localizedStrings,
                footer,
                buttons;
            if (btnCfg) {
                buttons = arrMap(btnCfg, function (btn) {

                    return substitute(this.btnTemplate,{
                        classButton: (btn.className || '')  + (btn.save ? ' yui3-button-primary' : ''),
                        label:       btn.label ||
                                    (btn.save ? strings.save :
                                    (btn.cancel ? strings.cancel : 'unknown label'))
                    });

                }, this);
                this.set('footerContent', buttons.join('\n'));
                footer = this.getStdModNode('footer', true);
                this._guest._subscr.push(footer.delegate('click', this._afterButtonClick, 'button.yui3-button', this));
            }
        },

        /**
        Listener for clicks on the buttons defined in the [buttons](#attr_buttons) attribute.

        @method _afterButtonClick
        @param ev {EventFacade} Event facade for the click event
        @private
        */
        _afterButtonClick: function (ev) {
            Y.log('CellEditorOverlay._afterButtonClick','info','CellEditorOverlay');

            var btnCfg = null,
                action,
                cellInfo,
                guest = this._guest;

            if (ev.target.ancestor().get('children').some(function(button, index) {
                if (button === ev.target) {
                    btnCfg = guest.get('buttons')[index];
                    return true;
                }
            })) {
                if (btnCfg.save) {
                    guest.saveEditor();
                    return;
                }
                if (btnCfg.cancel) {
                    guest.cancelEditor();
                    return;
                }
                action = btnCfg.action;
                cellInfo = Y.merge(guest._cellInfo, {value: guest._getValue()});
                switch (Lang.type(action)) {
                    case 'string':
                        if (guest[action]) {
                            guest[action].call(guest, btnCfg, cellInfo);
                        } else {
                            guest.fire(action, btnCfg, cellInfo);
                        }
                        break;
                    case 'function':
                        action.call(guest, btnCfg, cellInfo);
                        break;
                }
            }
        },

        /**
        Moves the overlay to the given xy position so that the
        [_guest](#property__guest) element ends on top of the cell being
        edited.

        It has been defined with this name to make it behave as the node used
        with inline editors.  That is why it is private but has no leading
        underscore.

        @method setXY
        @param xy {Array} Array of X and Y position for the guest element.
         */
        setXY: function (xy) {
            Y.log('CellEditorOverlay.setXY','info','CellEditorOverlay');

            var offsetX = this._offsetX,
                bbxy, contentxy, guest = this._guest;
            if (offsetX === null) {
                bbxy = this.get('boundingBox').getXY();
                contentxy = guest._xyReference.getXY();
                offsetX = this._offsetX = bbxy[0] - contentxy[0];
                this._offsetY = bbxy[1] - contentxy[1];
            }
            this.set('xy', [xy[0] + offsetX, xy[1] + this._offsetY]);
        }
    },
    {
        ATTRS: {
            /**
            Overrides the value of Overlay's `zIndex` attribute

            @attribute zIndex
            @type Integer
            @default 99
             */
            zIndex: {
                value: 99
            },

            /**
            Overrides the value of Overlay's `visible` attribute.

            @attribute visible
            @type Boolean
            @default false
             */
            visible: {
                value: false
            }
        }

    }

);
// This file gets chained after others that already have var declarations
/*jshint onevar:false */
//var substitute = Y.Lang.sub,
//    Plugins = Y.Plugins || {},
//    arrMap = Y.Array.map;
/* jshint onevar:true*/

Y.DataTable.RowEditorOverlay = Y.Base.create('roweditor-overlay', Y.Overlay, [],
    {
        /**
        Defines the template for BUTTON elements that are added to the Overlay
        via the [buttons](#attr_buttons) attribute.

        @property btnTemplate
        @type String
        @default See Code
        */
       // the `yui3-button` className is there to benefit from the CSSButton module.
        btnTemplate:    '<button class="yui3-button {classButton}">{label}</button>',

        /**
        Reference to the datatable whose editors this overlay is hosting.

        @property _dt
        @type Datatable
        @default null
        @private
         */
        _dt: null,

        /**
        Offset from the left edge of the element to be positioned to the left
        edge of this overlay.

        @property _offsetX
        @type Number
        @default 0
        @private
         */
        _offsetX: null,

        /**
        Offset from the top edge of the element to be positioned to the top
        edge of this overlay.

        @property _offsetY
        @type Number
        @default 0
        @private
         */
        _offsetY: null,

        /**
        Lifecycle method.  Setys the title and buttons and makes the overlay draggable
        if the drag and drop plugin is available.

        @method initializer
        @param config {Object} Initial configuration options resulting from
            the merge of the OverlayConfig attributes in the column definitions.
        @protected
         */
        initializer: function (config) {
            Y.log('RowEditorOverlay.initializer','info','RowEditorOverlay');
            this._subscr = [];
            var title = config.title;

            this._dt = config.dt;
            if (title) {
                this.set('headerContent', title);
            }
            this._createOverlayButtons(config.buttons);
        },
        destructor: function () {
            arrEach(this._subscr, function (subscr) {
                if (subscr.destroy) {
                    subscr.destroy();
                }
            });
        },
        showEditor: function (config) {
            this.show();
            this._attach(config.tr);
        },

        /**
        Adds to the footer of the overlay the buttons entered
        as the [buttons](#attr_buttons) config property of `editorConfig`
        column definition.
        Sets the click listener on them.

        @method _createOverlayButtons
        @param btnCfg {Array}  Array of button definition objects
        @private
        */
        _createOverlayButtons: function (btnCfg) {
            Y.log('RowEditorOverlay._createOverlayButtons','info','RowEditorOverlay');

            var strings = Y.DataTable.BaseCellEditor.localizedStrings,
                footer,
                buttons;
            if (btnCfg) {
                buttons = arrMap(btnCfg, function (btn) {

                    return substitute(this.btnTemplate,{
                        classButton: (btn.className || '')  + (btn.save ? ' yui3-button-primary' : ''),
                        label:       btn.label ||
                                    (btn.save ? strings.save :
                                    (btn.cancel ? strings.cancel : 'unknown label'))
                    });

                }, this);
                this.set('footerContent', buttons.join('\n'));
                footer = this.getStdModNode('footer', true);
                this._subscr.push(footer.delegate('click', this._afterButtonClick, 'button.yui3-button', this));
            }
        },

        /**
        Listener for clicks on the buttons defined in the [buttons](#attr_buttons) attribute.

        @method _afterButtonClick
        @param ev {EventFacade} Event facade for the click event
        @private
        */
        _afterButtonClick: function (ev) {
            Y.log('RowEditorOverlay._afterButtonClick','info','RowEditorOverlay');

            var btnCfg = null,
                action,
                cellInfo,
                dt = this._dt;

            if (ev.target.ancestor().get('children').some(function(button, index) {
                if (button === ev.target) {
                    btnCfg = this.get('buttons')[index];
                    return true;
                }
            })) {
                if (btnCfg.save) {
                    dt.saveRowEditor();
                    return;
                }
                if (btnCfg.cancel) {
                    dt.cancelRowEditor();
                    return;
                }
                action = btnCfg.action;
                cellInfo = Y.merge(guest._cellInfo, {value: guest._getValue()});
                switch (Lang.type(action)) {
                    case 'string':
                        if (dt[action]) {
                            dt[action].call(dt, btnCfg, cellInfo);
                        } else {
                            dt.fire(action, btnCfg, cellInfo);
                        }
                        break;
                    case 'function':
                        action.call(dt, btnCfg, cellInfo);
                        break;
                }
            }
        },

        /**
        Resizes and moves the body section
        to fit on top of the row being edited.

        The default implementation reads the `region` the row occupies and
        calls [_resize](#method__resize) and [_move](#method__move).

        @method _attach
        @param tr {Node} cell to attach this editor to
        @protected
        */
        _attach: function (tr) {
            Y.log('DataTable.RowEditorOverlay._attach', 'info', 'celleditor-base');
            if (this.get('visible')) {
                var region = tr.get('region');
                this._resize(region.width, region.height);
                this._move(region.left, region.top);
            }
        },

        /**
        Resizes the  body section to fit on top of the row being edited.

        @method _resize
        @param width {Number} width of the cell being edited
        @param height {Number} height of the cell being edited
        @protected
         */
        _resize: function (width, height) {
            Y.log('DataTable.RowEditorOverlay._resize [' + width + ':' + height + ']','info','celleditor-base');

            var node = this.getStdModNode('body',true);
            node.set('offsetWidth', width + 1);
            node.set('offsetHeight', height);
        },

        /**
        Moves the overlay so that the body section fits on top of the row being edited.

        @method _move
        @param left {Number} left edge of the cell being edited.
        @param top {Number} top edge of the cell being edited.
        @protected
         */
        _move: function (left, top) {
            Y.log('DataTable.RowEditorOverlay._move: [' + left + ':' + top + ']', 'info', 'celleditor-base');

            var offsetX = this._offsetX,
                bbxy, contentxy;
            if (offsetX === null) {
                bbxy = this.get('boundingBox').getXY();
                contentxy = this.getStdModNode('body',true).getXY();
                offsetX = this._offsetX = bbxy[0] - contentxy[0];
                this._offsetY = bbxy[1] - contentxy[1];
            }
            this.set('xy', [left + offsetX, top + this._offsetY]);
        }
    },
    {
        ATTRS: {
            /**
            Overrides the value of Overlay's `zIndex` attribute

            @attribute zIndex
            @type Integer
            @default 99
             */
            zIndex: {
                value: 97
            },

            /**
            Overrides the value of Overlay's `visible` attribute.

            @attribute visible
            @type Boolean
            @default false
             */
            visible: {
                value: false
            },
            buttons: {

            }
        }

    }
);


}, '@VERSION@', {
    "skinnable": "true",
    "lang": [
        "en",
        "es"
    ],
    "requires": [
        "datatable-base",
        "datatype",
        "node-screen",
        "datatable-keynav",
        "event-resize",
        "event-outside",
        "overlay",
        "dd-plugin"
    ]
});
