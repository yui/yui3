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
 @author Todd Smith
 @since 3.8.0
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
    Specifies a default editor name to respond to an editing event defined in
    [_editorOpenAction](#attr_editorOpenAction) attribute.
    The default editor is used if the DataTable is in editing mode (i.e. "editable:true") and if
    the column DOES NOT include a property `editable:false` in its definitions.

    Cell editors are typically assigned by setting a column property
    (i.e. `editor:"text"` or `editor:"date"`) on each individual column.

    This attribute can be used to set a single editor to work on every column without having to define it on each
    column.

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

     @property _classEditing
     @type String
     @default 'yui3-datatable-col-editing'
     @protected
    */
    _classEditing:  null,


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
        Y.log('DataTable.Editable.initializer');

        this._classColEditable = this.getClassName(COL, EDITABLE);
        this._classEditing = this.getClassName(COL, 'editing');

        var u = this._UI_ATTRS;

        this._UI_ATTRS = {
            SYNC: u.SYNC.concat(EDITABLE, EDITOR_OPEN_ACTION),
            BIND: u.BIND.concat(EDITABLE, EDITOR_OPEN_ACTION, 'columns')
        };

        this._editorsContainer = Y.one('body').appendChild('<div class="' + this.getClassName(COL, 'editors') + '"></div>');

    },

    /**
    Cleans up ALL of the DT listeners and the editor instances and generated private props
    @method destructor
    @protected
    */
    destructor:function () {
        Y.log('DataTable.Editable.destructor');
        // detach the "editableChange" listener on the DT
        this.set(EDITABLE, false);
        this._unbindEditable();
        this._editorsContainer.remove(true);
    },

    //==========================  PUBLIC METHODS  =============================

    /**
    Opens a cell editor on the given DataTable cell.
    It also accepts an EventFacade resulting from a user action.

    @method openCellEditor
    @param td {Node | EventFacade} Table cell to be edited or EventFacade of an action on that cell.
    @public
     */
    openCellEditor: function (td) {
        Y.log('DataTable.Editable.openCellEditor');
        td        = td.currentTarget || td;
        var col       = this.getColumnByTd(td),
            colKey    = col.key || col.name,
            record    = this.getRecord(td),
            editorRef = (colKey) ? this._columnEditors[colKey] : null,
            editorInstance = (editorRef && Lang.isString(editorRef) ) ? this._commonEditors[editorRef] : editorRef;

        if(!td) {
            return;
        }



        //
        // Bailout if column is null, has editable:false or no editor assigned ...
        //
        if(col && col.editable === false && !editorInstance) {
            return;
        }

        // Hide any editor that may currently be open ... unless it is the currently visible one
        if(this._openEditor) {
            this.hideCellEditor();
        }

        //
        //  If the editorInstance exists, populate it and show it
        //
        //TODO:  fix this to rebuild new editors if user changes a column definition on the fly
        //
        if(editorInstance) {
            td.addClass(this._classEditing);

            //
            //  Set private props to the open TD we are editing, the editor instance, record and column name
            //
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
        Y.log('DataTable.Editable.hideCellEditor');
        if(this._openEditor) {
            this._openEditor._hideEditor();
            if (this._editorTd) {
                this._editorTd.removeClass(this._classEditing);
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
        Y.log('DataTable.Editable.getCellEditors');
        var rtn = {}, ed;
        Y.Object.each(this._columnEditors, function (v, k){
            ed = (Lang.isString(v)) ? this._commonEditors[v] : v;
            rtn[k] =  ed;
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
        Y.log('DataTable.Editable.getCellEditor: ' + col);
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
        Y.log('DataTable.Editable.getColumnByTd');
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
        Y.log('DataTable.Editable.getColumnNameByTd');
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


    //==========================  PRIVATE METHODS  =============================


    /**
    Sets up listeners for the DT editable module,
    @method _bindEditable
    @private
     */
    _bindEditable: function () {
        Y.log('DataTable.Editable._bindEditable');
        var attachScrollUpdate = function () {
            if(this._xScroll && this._xScrollNode) {
                this._subscrEditable.push(this._xScrollNode.on('scroll', this._onScrollUpdateCellEditor, this));
            }
            if(this._yScroll && this._yScrollNode) {
                this._subscrEditable.push(this._yScrollNode.on('scroll', this._onScrollUpdateCellEditor, this));
            }
        };


        if(this._subscrEditable) {
            Y.log('Check: DataTable.Editable._bindEditable: there should not be subscribers leftover', 'warn');
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
            this._editorsContainer.on('keydown',    this._onKeyDown, this)
        ];
        if (this.get('rendered')) {
            attachScrollUpdate.call(this);

        } else {
            this.onceAfter('renderedChange', attachScrollUpdate);
        }
        this._uiSetEditorOpenAction(this.get(EDITOR_OPEN_ACTION));
    },

    /**
    Unbinds ALL of the popup editor listeners and removes column editors.

    @method _unbindEditable
    @private
     */
    _unbindEditable: function () {
        Y.log('DataTable.Editable._unbindEditable');

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
        Y.log('DataTable.Editable._uiSetEditable: ' + value);
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

    //TODO either do it better or make defaultEditor writeOnce

    @method _afterDefaultEditorChange
    @param e {EventFacade} Attribute change event facade
    @private
    */
    _afterDefaultEditorChange: function (e) {
        Y.log('DataTable.Editable._afterDefaultEditorChange: ' + e.newVal);
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
        Y.log('DataTable.Editable._uiSetColumns');
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
        Y.log('DataTable.Editable._uiSetEditorOpenAction: ' + val);
        if(this._subscrEditOpen) {
            this._subscrEditOpen.detach();
        }
        if (val) {
            this._subscrEditOpen = this.delegate( val, this.openCellEditor,"tbody." + this.getClassName('data') + " td", this);
        }
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
        Y.log('DataTable.Editable._buildColumnEditors');
        var cols     = this.get(COLUMNS),
            defEditor = this.get(DEF_EDITOR),
            editorName, colKey, editorInstance;

        if( !Y.DataTable.Editors ) {
            return;
        }

        if( this._columnEditors || this._commonEditors ) {
            this._destroyColumnEditors();
        }

        this._commonEditors = {};
        this._columnEditors = {};

        //
        //  Loop over all DT columns ....
        //
        arrEach(cols,function (c) {
            if(!c) {
                return;
            }

            colKey = c.key || c.name;

            // An editor was defined (in column) and doesn't yet exist ...
            if(colKey && c.editable !== false) {

                editorName = c.editor || defEditor;

                // This is an editable column, update the TD's for the editable column
                this._updateEditableColumnCSS(colKey, true);

                //
                // If an editor is named, check if its definition exists, and that it is
                // not already instantiated.   If not, create it ...
                //

                // check for common editor ....
                if (editorName && Y.DataTable.Editors[editorName]) {

                    if(Lang.isObject(c.editorConfig) ) {

                        editorInstance = this._createCellEditorInstance(editorName, c);

                        this._columnEditors[colKey] = editorInstance || null;

                    } else {

                        if( !this._commonEditors[editorName] ) {
                            editorInstance = this._createCellEditorInstance(editorName, c);
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
    @param column {Object} Column object
    @return {DataTable.BaseCellEditor} A newly created editor instance
    @private
     */
    _createCellEditorInstance: function (editorName, column) {
        Y.log('DataTable.Editable._createCellEditorInstance: ' + editorName + ' for ' + column.key);
        var Editor = Y.DataTable.Editors[editorName],
            editor = null;

        if (Editor) {
            editor = new Editor(column.editorConfig).render(this._editorsContainer);
            editor.addTarget(this);
        }
        return editor;

    },

    /**
    Loops through the column editor instances, destroying them and resetting the collection to null object
    @method _destroyColumnEditors
    @private
     */
    _destroyColumnEditors: function () {
        Y.log('DataTable.Editable._destroyColumnEditors');
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
    Utility method to combine "common" and "column-specific" cell editor instances and return them
    @method _getAllCellEditors
    @return {Array} Of cell editor instances used for the current DT column configurations
    @private
     */
    _getAllCellEditors: function () {
        Y.log('DataTable.Editable._getAllCellEditors');
        var rtn = [];

        if( this._commonEditors ) {
            Y.Object.each(this._commonEditors,function (ce){
                if(ce && ce instanceof Y.View){
                    rtn.push(ce);
                }
            });
        }

        if( this._columnEditors ) {
            Y.Object.each(this._columnEditors,function (ce){
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
        Y.log('DataTable.Editable._afterEditableSort');
        if(this.get(EDITABLE)) {
            this.hideCellEditor();
            this._updateAllEditableColumnsCSS();
        }
    },

    /**
    Re-initializes the cell-dependent properties to null
    @method _unsetEditor
    @private
     */
    _unsetEditor: function (){
        Y.log('DataTable.Editable._unsetEditor');
        // Finally, null out static props on this extension
        this._openEditor = null;
        this._editorRecord = null;
        this._editorColKey = null;
        this._editorTd = null;
    },

    /**
    Method to update all of the current TD's within the current DT to add/remove the editable CSS
    @method _updateAllEditableColumnsCSS
    @private
     */
    _updateAllEditableColumnsCSS : function () {
        Y.log('DataTable.Editable._updateAllEditableColumnsCSS');
        var ckey, editable = this.get(EDITABLE);
        arrEach(this.get(COLUMNS),function (col){
            ckey = col.key || col.name;
            if(ckey) {
                this._updateEditableColumnCSS(ckey, editable && col.editable !== false);
            }
        },this);
    },

    /**
    Method that adds/removes the CSS editable-column class from a DataTable column,
    based upon the setting of the boolean "opt"

    @method _updateEditableColumnCSS
    @param colKey {String}  Column key or name to alter
    @param opt {Boolean} True of False to indicate if the CSS class should be added or removed
    @private
     */
    _updateEditableColumnCSS : function (colKey, opt) {
        Y.log('DataTable.Editable._updateEditableColumnCSS: ' + colKey + ' add: ' + opt);
        var tbody = this.get('contentBox').one('tbody.'+ this.getClassName('data')),
            col   = (colKey) ? this.getColumn(colKey) : null,
            colEditable = col && col.editable !== false,
            tdCol;
        if(!colKey || !col || !colEditable) {
            return;
        }

        colEditable = col.editor || this.get(DEF_EDITOR);

        if(!tbody || !colEditable) {
            return;
        }

        tdCol = tbody.all('td.' + this.getClassName(COL, colKey));

        if(tdCol) {
            if (opt) {
                tdCol.addClass(this._classColEditable);
            } else {
                tdCol.removeClass(this._classColEditable);
            }
        }
    },

    /**
    Listener to TD "click" events that hides a popup editor if not in the current cell
    @method _handleCellClick
    @param e
    @private
     */
    _handleCellClick:  function (e) {
        Y.log('DataTable.Editable._handleCellClick');
        var td = e.currentTarget,
            cn = this.getColumnNameByTd(td);

        if (cn && this._openEditor &&  this._openEditor.get('colKey') !== cn) {
            this.hideCellEditor();
        }
    },

    /**
    Listener that fires on a scrollable DT scrollbar "scroll" event, and updates the current XY position
     of the currently open Editor.

    @method _onScrollUpdateCellEditor
    @private
     */
    _onScrollUpdateCellEditor: function (e) {
        Y.log('DataTable.Editable._onScrollUpdateCellEditor');
        //
        //  Only go into this dark realm if we have a TD and an editor is open ...
        //
        if(this.get(EDITABLE) && this.get('scrollable') && this._openEditor && this._openEditor.get('active') ) {

            var rt = this._editorTd.get('region'),
                rx = this._xScrollNode.get('region'),
                ry = this._yScrollNode.get('region'),
                rsn = this._scrollbarNode.get('region');
//            console.log(/*'left', rt.left, rx.left, ry.left,'right', rt.right, rx.right, ry.right, rsn.right ,*/'top', rt.top, rx.top, ry.top, rsn.top,'bottom', rt.bottom, rx.bottom, ry.bottom, rsn.bottom);
            console.log('visible left', rt.left > rx.left, 'right', rt.right < rsn.left, 'top', rt.top > rsn.top, 'bottom', rt.bottom < rsn.bottom);
            console.log(rx.left, this._xScrollNode.getXY());
            var oe = this._openEditor,
                scrollBar    = e.target,
                scrollBarClassName  = scrollBar.get('className') || '',
                tr1    = this.getRow(0),
                trh    = (tr1) ? parseFloat(tr1.getComputedStyle('height')) : 0,
                tdxy   = (this._editorTd) ? this._editorTd.getXY() : null,
                xmin, xmax, ymin, ymax, offLimits = false;

            //
            // For vertical scrolling - check vertical 'y' limits
            //
            if( scrollBarClassName.search(/-y-/) !==-1 ) {

                ymin = this._yScrollNode.getY() + trh - 5;
                ymax = ymin + parseFloat(this._yScrollNode.getComputedStyle('height')) - 2 * trh;

                if(tdxy[1] < ymin || tdxy[1] > ymax ) {
                    offLimits = true;
                }
            }

            //
            // For horizontal scrolling - check horizontal 'x' limits
            //
            if( scrollBarClassName.search(/-x-/) !==-1 ) {

                xmin = this._xScrollNode.getX();
                xmax = xmin + parseFloat(this._xScrollNode.getComputedStyle('width'));
                xmax -= parseFloat(this._editorTd.getComputedStyle('width'));

                if(tdxy[0] < xmin || tdxy[0] > xmax ) {
                    offLimits = true;
                }
            }

            oe.set('visible', !offLimits);
            if(!offLimits) {
                oe.set('xy', tdxy);
            }

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
        Y.log('DataTable.Editable._onKeyDown');
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
    Listener to INPUT "click" events that will stop bubbling to the DT TD listener,
    to prevent closing editing while clicking within an INPUT.

    @method _onClick
    @param e {EventFacade}
    @private
    */
   /*
    _onClick: function(e) {
        Y.log('DataTable.Editable._onClick');
        e.stopPropagation();
    },
*/

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
        Y.log('DataTable.Editable._navigate');
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
        Y.log('DataTable.Editable._afterCellEditorCancel');
        if (this._editorTd) {
            this._editorTd.removeClass(this._classEditing);
        }

        if(this._openEditor && !this._openEditor.get('hidden')) {
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
        Y.log('DataTable.Editable._afterCellEditorSave');
        if (this._editorTd) {
            this._editorTd.removeClass(this._classEditing);
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
@since 3.8.0
 */
Y.DataTable.Editors = {};
