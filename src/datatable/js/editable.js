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



/**
 A DataTable class extension that configures a DT for "editing", current deployment supports cell editing
 both inline and with popups.

 This module is essentially a base wrapper-class to setup DT for editing with the appropriate attributes and
 listener creation / detachment.  The real guts of "datatable-editing" is in the View class definitions, within
 the datatable-celleditor-inline and datatable-celleditor-popup modules.

 #### Functionality

 The module is basically intended to keep track of the editing state (via [editable](#attr_editable) attribute) and
 housekeeping functions with regard to managing editor View instance creation, rendering and destruction.

 By design this module attempts to group common editor View instances wherever possible.  So for a DT with 14 columns
 all set with `"inline"` View classes only 1 View instance is created.
 <br/>Likewise if a DT uses 4 different `"calendar"` editor View types but each one as slightly different `editorConfig`,
 then this module creates 4 different calendar View instances to handle the different configurations.

 Listeners are set for the `celleditor:save` event and saved to the active `data` setting within this module.

 Additional capability is provided for cell editing situations to add CSS classes to TD's which are added to "editable"
 columns (e.g. cursor) to indicate they are "clickable".

 This module works sortable, scrollable (y-scrolling currently) to make changes to the client-side of the DT model
 (remote updates should be provided via ModelList sync or user-defined listeners.)


 #### Attributes

 Presently three attributes are provided;
 [editable](#attr_editable), [editorOpenAction](#attr_editorOpenAction) and [defaultEditor](#attr_defaultEditor).

 The primary ATTR is the [editable](#attr_editable), which is used to toggle on/off the editing state of the DT
 instance.

 The [defaultEditor](#attr_defaultEditor) attribute is used to setup a cell editor View instance to be used on all editable columns
 that don't already have an editor assigned.

 ##### Column Properties

 In addition to a few new attributes the module also recognizes some new column properties in order to support
 cell-editing in particular;
 <table>
 <tr><th>editable</th><td>{Boolean}</td><td>Flag to indicate if column is editable (set `editable:false` to exclude an
 individual column)</td></tr>
 <tr><th>editor</th><td>{String}</td><td>Name of the defined Y.DataTable.EditorOptions View configuration for this column.</td></tr>
 <tr><th>editorConfig</th><td>{Object}</td><td>Passed to the View editor class when instantiated, and Y.merge'ed in to become View class
 attributes.</td></tr>
 </table>

 When this module is loaded and the "editable:true" attribute is set, it attempts to economize on the "instantiation cost"
 of creating View instances by identifying only editor Views that are required based upon column definitions and/or the
 defaultEditor attribute. (e.g. if all columns are "text" editors, only one "text" editor View is instantiated)

 ##### ... More Info

 The module fires the event [celleditor:save](#event_celleditor:save), which can be listened for to provide updating
 of remote data back to a server (assuming a ModelList "sync" layer is NOT used).  Haven't provided the equivalent to
 YUI 2.x's "asyncSubmitter" because I think this event could easily be listened to in order to provide follow-on
 updating to remote data stores.

 A new class Object (Y.DataTable.EditorOptions) is added to the DataTable namespace that serves as the
 datastore of the editor View configuration properties.  Each "key" (object property) within this object
 is an entrypoint to a specific editor configuration, which are defined in the separate View class extensions (presently
 datatable-celleditor-inline and datatable-celleditor-popup. Please see those for specifics.)

 ###### KNOWN ISSUES:
   <ul>
   <li>Works minimally with "y" scrolling, "x" scrolling still needs work.</li>
   <li>Initial editor invocation is limited to "mouse" actions on TD only (although keyboard navigation cell-to-cell is available).</li>
   </ul>

 ###### FUTURE:
 This module will be amended to add support for "row" editing, if required.

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
    Defines the cell editing event type on the TD that initiates the editor, used to
    specify the listener that invokes an editor.

    Note: IMHO The only sensible options are 'click' or 'dblclick'

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
    Specifies a default editor name to respond to an editing event defined in [_editorOpenAction](#attr_editorOpenAction)
    attribute.  The default editor is used if the DataTable is in editing mode (i.e. "editable:true") and if
    the column DOES NOT include a property editable:false in its definitions.

    Cell editors are typically assigned by setting a column property (i.e. editor:'text' or 'date') on each
    individual column.

    This attribute can be used to set a single editor to work on every column without having to define it on each
    column.

    @attribute defaultEditor
    @type {String|Null}
    @default null
    */
    defaultEditor : {
        value:      null,
        validator:  function (v){
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

// Add static props and public/private methods to be added to DataTable
Y.mix( DtEditable.prototype, {

    // -------------------------- Placeholder Private Properties  -----------------------------

    /**
     Holds the View instance of the active cell editor currently displayed
     @property _openEditor
     @type Y.View
     @default null
     @private
     @static
     */
    _openEditor:        null,

    /**
     Holds the current record (i.e. a Model class) of the TD being edited
     (Note: this may not always work, better to use "clientId" of the record, i.e. sorting, etc..)
     @property _editorRecord
     @type Model
     @default null
     @private
     @static
     */
    _editorRecord:        null,

    /**
     Holds the column key (or name) of the TD cell being edited
     @property _editorColKey
     @type String
     @default null
     @private
     @static
     */
    _editorColKey:        null,

    /**
     Holds the TD Node currently being edited
     @property _editorTd
     @type Node
     @default null
     @private
     @static
     */
    _editorTd:            null,


    // -------------------------- Subscriber handles  -----------------------------

    /**
     Placeholder for the DT level event listener for "editableChange" attribute.
     @property _subscrEditable
     @type EventHandle
     @default null
     @private
     @static
     */
    _subscrEditable:     null,

    /**
     Placeholder for the DT event listener to begin editing a cell (based on editorOpenAction ATTR)
     @property _subscrEditOpen
     @type EventHandle
     @default null
     @private
     @static
     */
    _subscrEditOpen: null,


    /**
     CSS class name that is added to indicate a column is editable
     @property _classColEditable
     @type String
     @default 'yui3-datatable-col-editable'
     @private
     @static
     */
    _classColEditable:  null,

    /**
     CSS classname to identify the individual input collection HTML nodes within
     the View container

     @property _classEditing
     @type String
     @default 'yui3-datatable-col-editing'
     @protected
    */
    _classEditing:  null,

    /**
     Placeholder hash that stores the "common" editors, i.e. standard editor names that occur
     within Y.DataTable.EditorOptions and are used in this DT.

     This object holds the View instances, keyed by the editor "name" for quick hash reference.
     The object is populated in method [_buildColumnEditors](#method__buildColumnEditors).

     @property _commonEditors
     @type Object
     @default null
     @private
     @static
     */
    _commonEditors:  null,

    /**
     Placeholder hash that stores cell editors keyed by column key (or column name) where the value
     for the associated key is either a (a) {String} which references an editor name in the [_commonEditors](#property__commonEditors)
     hash or (b) {View} instance for a customized editor View instance (typically one with specified "editorConfig" in the
     column definition).

     The object is populated in method [_buildColumnEditors](#method__buildColumnEditors).

     @property _columnEditors
     @type Object
     @default null
     @private
     @static
     */
    _columnEditors: null,

    // future
    //_editableType:      null,   //  'cell', 'row', 'inline?'

    //==========================  LIFECYCLE METHODS  =============================

    /**
    Initializer that sets up listeners for "editable" state and sets some CSS names
    @method initializer
    @protected
     */
    initializer: function (){
        Y.log('DataTable.Editable.initializer');

        this._classColEditable = this.getClassName(COL,EDITABLE);
        this._classEditing = this.getClassName(COL,'editing');


        this._UI_ATTRS.SYNC = this._UI_ATTRS.SYNC.concat(EDITABLE, EDITOR_OPEN_ACTION);
        this._UI_ATTRS.BIND.push(EDITABLE, EDITOR_OPEN_ACTION);
    },

    /**
    Cleans up ALL of the DT listeners and the editor View instances and generated private props
    @method destructor
    @protected
    */
    destructor:function () {
        Y.log('DataTable.Editable.destructor');
        // detach the "editableChange" listener on the DT
        this.set(EDITABLE,false);
        this._unbindEditable();
    },

    //==========================  PUBLIC METHODS  =============================

    /**
    Opens the given TD eventfacade or Node with it's assigned cell editor.

    @method openCellEditor
    @param e {EventFacade|Node} Passed in object from an event OR a TD Node istance
    @public
     */
    openCellEditor: function (e) {
        Y.log('DataTable.Editable.openCellEditor');
        var td        = e.currentTarget || e,
            col       = this.getColumnByTd(td),
            colKey    = col.key || col.name,
            record    = this.getRecord(td),
            editorRef = (colKey) ? this._columnEditors[colKey] : null,
            editorInstance = (editorRef && Lang.isString(editorRef) ) ? this._commonEditors[editorRef] : editorRef;

        if(!td) {
            return;
        }

        if(this._xScroll && this._xScrollNode) {
            this._subscrEditable.push(this._xScrollNode.on('scroll', this._onScrollUpdateCellEditor, this));
        }
        if(this._yScroll && this._yScrollNode) {
            this._subscrEditable.push(this._yScrollNode.on('scroll', this._onScrollUpdateCellEditor, this));
        }

        //
        // Bailout if column is null, has editable:false or no editor assigned ...
        //
        if(col && col.editable === false && !editorInstance) {
            return;
        }

        // Hide any editor that may currently be open ... unless it is the currently visible one
        if(this._openEditor) {
            if ( this._openEditor === editorInstance ) {
                this._openEditor.hideEditor();
            } else {
                this.hideCellEditor();
            }
        }

        //
        //  If the editorInstance exists, populate it and show it
        //
        //TODO:  fix this to rebuild new editors if user changes a column definition on the fly
        //
        if(editorInstance) {
            if (this._editorTd) {
                this._editorTd.removeClass(this._classEditing);
            }
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
    Cleans up a currently open cell editor View and unbinds any listeners that this DT had
    set on the View.
    @method hideCellEditor
    @public
    */
    hideCellEditor: function (){
        Y.log('DataTable.Editable.hideCellEditor');
        if(this._openEditor) {
            this._openEditor.hideEditor();
            this._unsetEditor();
        }
    },

    /**
    Utility method that scans through all editor instances and hides them
    @method hideAllCellEditors
    @private
     */
    hideAllCellEditors: function (){
        Y.log('DataTable.Editable.hideAllCellEditors');
        this.hideCellEditor();
        var ces = this._getAllCellEditors();
        arrEach(ces, function (editor){
            if(editor && editor.hideEditor) {
                editor.hideEditor();
            }
        });
    },


    /**
    Returns all cell editor View instances for the editable columns of the current DT instance
    @method getCellEditors
    @return {Object} Hash containing all the cell editors instances indexed by the column key.
     */
    getCellEditors: function (){
        Y.log('DataTable.Editable.getCellEditors');
        var rtn = {}, ed;
        Y.Object.each(this._columnEditors, function (v, k){
            ed = (Lang.isString(v)) ? this._commonEditors[v] : v;
            rtn[k] =  ed;
        }, this);
        return rtn;
    },

    /**
    Utility method to return the cell editor View instance associated with a particular column of the
    Datatable.

    Returns null if the given column is not editable.

    @method getCellEditor
    @param col {Object|String|Integer} Column identifier, either the Column object, column key or column index
    @returns {View} Cell editor instance, or null if no editor for given column
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

            this.after(CELL_EDITOR + ':keyNav', this._afterkeyNav)
        ];


        this._uiSetEditorOpenAction(this.get(EDITOR_OPEN_ACTION));
    },

    /**
    Unbinds ALL of the popup editor listeners and removes column editors.
    This should only be used when the DT is destroyed
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

        // Detach scrolling listeners
        arrEach(this._subscrCellEditorScrolls, function (dh){
            if(dh && dh.detach) {
                dh.detach();
            }
        });
        this._subscrCellEditorScrolls = [];

        this.detach(CELL_EDITOR + ':*');

        this._unsetEditor();

        // run through all instantiated editors and destroy them
        this._destroyColumnEditors();

    },

    /**
    Listener that toggles the DT editable state, setting/unsetting the listeners associated with
    cell editing.
    @method _uiSetEditable
    @param e {EventFacade} Change event facade for "editable" attribute
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

    @method _afterDefaultEditorChange
    @param e {EventFacade} Change eventfacade for "defaultEditor" attribute
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
    Setter method for the [editorOpenAction](#attr_editorOpenAction) attribute, specifies what
    TD event to listen to for initiating editing.

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
    Pre-scans the DT columns looking for column named editors and collects unique editors,
    instantiates them, and adds them to the  _columnEditors array.  This method only creates
    View instances that are required, through combination of _commonEditors and _columnEditors
    properties.

    @method _buildColumnEditors
    @private
    */
    _buildColumnEditors: function () {
        Y.log('DataTable.Editable._buildColumnEditors');
        var cols     = this.get(COLUMNS),
            defEditor = this.get(DEF_EDITOR),
            editorName, colKey, editorInstance;

        if( !Y.DataTable.EditorOptions ) {
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

                //this._editorColHash[colKey] = editorName;

                //
                // If an editor is named, check if its definition exists, and that it is
                // not already instantiated.   If not, create it ...
                //

                // check for common editor ....
                if (editorName && Y.DataTable.EditorOptions[editorName]) {

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
    This method takes the given editorName (i.e. 'textarea') and if the default editor
    configuration, adds in any column 'editorConfig' and creates the corresponding
    cell editor View instance.

    Makes shallow copies of editorConfig: { overlayConfig, widgetConfig, templateObject }

    @method _createCellEditorInstance
    @param editorName {String} Editor name
    @param column {Object} Column object
    @return editorInstance {View} A newly created editor instance for the supplied editorname and column definitions
    @private
     */
    _createCellEditorInstance: function (editorName, column) {
        Y.log('DataTable.Editable._createCellEditorInstance: ' + editorName + ' for ' + column.key);
        var Editor = Y.DataTable.EditorOptions[editorName],
            editor = null;

        if (Editor) {
            editor = new Editor(column.editorConfig).render();
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
    Re-initializes the static props to null
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
        if(this.get(EDITABLE)) {
            var ckey;
            arrEach(this.get(COLUMNS),function (col){
                ckey = col.key || col.name;
                if(ckey) {
                    this._updateEditableColumnCSS(ckey, col.editable !== false); //(flag) ? col.editable || true : false);
                }
            },this);
        }
    },

    /**
    Method that adds/removes the CSS editable-column class from a DataTable column,
    based upon the setting of the boolean "opt"

    @method _updateEditableColumnCSS
    @param cname {String}  Column key or name to alter
    @param opt {Boolean} True of False to indicate if the CSS class should be added or removed
    @private
     */
    _updateEditableColumnCSS : function (cname, opt) {
        Y.log('DataTable.Editable._updateEditableColumnCSS: ' + cname + ' add: ' + opt);
        var tbody = this.get('contentBox').one('tbody.'+ this.getClassName('data')),
            col   = (cname) ? this.getColumn(cname) : null,
            colEditable = col && col.editable !== false,
            tdCol;
        if(!cname || !col || !colEditable) {
            return;
        }

        colEditable = col.editor || this.get(DEF_EDITOR);

        if(!tbody || !colEditable) {
            return;
        }

        tdCol = tbody.all('td.'+this.getClassName(COL,cname));

        if(tdCol) {
            if (opt) {
                tdCol.addClass(this._classColEditable);
            } else {
                tdCol.removeClass(this._classColEditable);
            }
        }
    },

    /**
    Listener to TD "click" events that hides a popup editor is not in the current cell
    @method _handleCellClick
    @param e
    @private
     */
    _handleCellClick:  function (e){
        Y.log('DataTable.Editable._handleCellClick');
        var td = e.currentTarget,
            cn = this.getColumnNameByTd(td);

        if (cn && this._openEditor &&  this._openEditor.get('colKey')!==cn) {
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
    Listens to changes to an Editor's "keyDir" event, which result from the user
    pressing "ctrl-" arrow key while in an editor to navigate to an cell.

    The value of "keyDir" is an Array of two elements, in [row,col] format which indicates
    the number of rows or columns to be changed to from the current TD location
    (See the base method .getCell)

    @method _afterkeyNav
    @param e {EventFacade} The attribute change event facade for the View's 'keyDir' attribute
    @private
     */
    _afterkeyNav : function (e) {
        Y.log('DataTable.Editable._afterkeyNav');
        var dx = e.dx,
            dy = e.dy,
            td = this._editorTd,
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
Y.Base.mix(Y.DataTable, [Y.DataTable.Editable]);

/**
This object is attached to the DataTable namespace to allow addition of "editors" in conjunction
with the Y.DataTable.Editable module.
 *
(See modules datatable-celleditor-popup and datatable-celleditor-inline for
 examples of the content of this object)
 *
@class DataTable.EditorOptions
@extends Y.DataTable
@type {Object}
@since 3.8.0
 */
Y.DataTable.EditorOptions = {};
